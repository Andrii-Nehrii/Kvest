// Физиология персонажа: голод, жажда, сон, кровопотеря, температура, травмы, болезни.
// Всё меняется только от времени, активности, среды и явных эффектов — без «брони».
import { clamp, round, unit } from './rng';
import { ILLNESSES } from './illness';
import type { Activity, Body, Injury, Minutes, Traits } from './types';

export interface Environment {
  tempC: number;
  wet: boolean;
  outdoor: boolean;
  /** Суммарное утепление надетой одежды, 0–12. */
  warmth: number;
}

const ACTIVITY = {
  sleep: { fatigue: -22, thirst: 0.6, hunger: 0.7, heat: 0 },
  rest: { fatigue: -14, thirst: 1, hunger: 1, heat: 0 },
  light: { fatigue: 4, thirst: 1.3, hunger: 1.2, heat: 2 },
  moderate: { fatigue: 11, thirst: 1.9, hunger: 1.6, heat: 5 },
  heavy: { fatigue: 26, thirst: 2.8, hunger: 2.2, heat: 9 },
} as const satisfies Record<Activity, unknown>;

/** Базовые скорости в час (покой, 20 °C). */
const THIRST_PER_HOUR = 3.4;  // ~30 ч без воды до тяжёлого обезвоживания в покое
const HUNGER_PER_HOUR = 2.2;  // ~45 ч до сильного истощения; смерть от голода — недели

export function newBody(t: Minutes): Body {
  return {
    hunger: 15, thirst: 10, fatigue: 5, sleepDebt: 0, awakeSince: t,
    bloodLoss: 0, coreTemp: 36.8, stress: 10,
    injuries: [], illnesses: [],
    consciousness: 'awake', consciousSince: t,
    meds: {}, rolled: {},
  };
}

export const isDead = (b: Body) => b.consciousness === 'dead';
export const canAct = (b: Body) => b.consciousness === 'awake';
export const isIncapacitated = (b: Body) => b.consciousness === 'unconscious' || b.consciousness === 'coma';

function legPenalty(b: Body): number {
  let p = 0;
  for (const i of b.injuries) {
    if (i.healed >= 1) continue;
    const leg = i.site === 'leftLeg' || i.site === 'rightLeg' || i.site === 'feet';
    if (!leg) continue;
    const left = 1 - i.healed;
    if (i.kind === 'fracture') p = Math.max(p, 0.75 * left);
    else if (i.kind === 'sprain') p += 0.08 * i.severity * left;
    else p += 0.04 * i.severity * left;
  }
  return clamp(p, 0, 0.9);
}

export function painLevel(b: Body, t: Minutes): number {
  let pain = 0;
  for (const i of b.injuries) {
    if (i.healed >= 1) continue;
    const k = i.kind === 'fracture' ? 12 : i.kind === 'burn' ? 9 : i.kind === 'bruise' ? 4 : 7;
    pain += k * i.severity * (1 - i.healed * 0.8) * (i.woundInfected ? 1.4 : 1);
  }
  if ((b.meds.painkiller ?? -1) > t) pain *= 0.45;
  return clamp(round(pain, 1), 0, 100);
}

export function fever(b: Body, t: Minutes): number {
  let f = 0;
  for (const ill of b.illnesses) f = Math.max(f, ILLNESSES[ill.kind]?.fever(ill) ?? 0);
  for (const i of b.injuries) if (i.woundInfected && i.healed < 1) f = Math.max(f, 0.6 + 0.2 * i.severity);
  if ((b.meds.antipyretic ?? -1) > t) f *= 0.4;
  return f;
}

export interface Capabilities {
  mobility: number;
  focus: number;
  strength: number;
  canAct: boolean;
}

export function capabilities(b: Body, traits: Traits, t: Minutes): Capabilities {
  if (!canAct(b)) return { mobility: 0, focus: 0, strength: 0, canAct: false };
  const pain = painLevel(b, t);
  const hypo = Math.max(0, 36 - b.coreTemp);
  const fev = Math.max(0, b.coreTemp - 37.8);
  const blood = Math.max(0, b.bloodLoss - 10);
  let mobility = 1 - legPenalty(b)
    - Math.max(0, b.fatigue - 50) * 0.008
    - blood * 0.008 - pain * 0.003 - hypo * 0.12 - fev * 0.05
    - Math.max(0, b.thirst - 70) * 0.01;
  let focus = 1 - Math.max(0, b.sleepDebt - 8) * 0.045
    - pain * 0.004 - b.stress * 0.002 - blood * 0.007 - hypo * 0.1 - fev * 0.12
    - Math.max(0, b.thirst - 60) * 0.006 - Math.max(0, b.hunger - 75) * 0.004;
  let strength = (0.55 + traits.strength * 0.09)
    * (1 - Math.max(0, b.fatigue - 40) * 0.009 - blood * 0.01 - pain * 0.003 - Math.max(0, b.hunger - 70) * 0.006);
  mobility = round(clamp(mobility, 0, 1));
  focus = round(clamp(focus, 0, 1));
  strength = round(clamp(strength, 0, 1));
  return { mobility, focus, strength, canAct: true };
}

/** Текущая кровопотеря в час с учётом свёртывания и обработки. */
function bleedRate(i: Injury, t: Minutes): number {
  if (i.bleeding <= 0 || i.healed >= 1) return 0;
  const hours = (t - i.since) / 60;
  const treat = i.treated === 'proper' ? 0.05 : i.treated === 'basic' ? 0.3 : 1;
  // Мелкие раны сворачиваются сами за 10–40 мин, средние — за пару часов, тяжёлые — нет.
  const clot = i.severity <= 2 ? Math.exp(-hours / 0.35) : i.severity === 3 ? Math.exp(-hours / 2.5) : 1;
  return i.bleeding * treat * clot;
}

const OPEN_WOUND = new Set(['cut', 'laceration', 'scratch', 'bite', 'burn']);
const HEAL_DAYS: Record<string, number> = {
  bruise: 7, cut: 9, laceration: 16, scratch: 5, bite: 18, sprain: 18, fracture: 45, burn: 20, concussion: 10,
};

export interface TickResult {
  notes: string[];
  died?: string;
}

/**
 * Продвинуть тело на `minutes` минут. Детерминировано: все «броски» — от ключа seed+персонаж+событие.
 */
export function tickBody(b: Body, traits: Traits, from: Minutes, minutes: number, activity: Activity, env: Environment, seedKey: string): TickResult {
  const res: TickResult = { notes: [] };
  let t = from;
  let left = minutes;
  while (left > 0 && b.consciousness !== 'dead') {
    const step = Math.min(left, 20);
    const h = step / 60;
    const act = b.consciousness === 'awake' ? activity : b.consciousness === 'asleep' ? 'sleep' : 'rest';
    const a = ACTIVITY[act];
    const endurance = 1 - traits.endurance * 0.06;

    // Еда, вода, усталость, сон
    const heat = env.tempC > 24 ? 1 + (env.tempC - 24) * 0.05 : 1;
    b.thirst = clamp(b.thirst + THIRST_PER_HOUR * a.thirst * heat * h, 0, 100);
    b.hunger = clamp(b.hunger + HUNGER_PER_HOUR * a.hunger * h, 0, 100);
    const fatigueGain = a.fatigue > 0 ? a.fatigue * endurance : a.fatigue;
    b.fatigue = clamp(b.fatigue + fatigueGain * h, 0, 100);
    if (act === 'sleep') b.sleepDebt = Math.max(0, b.sleepDebt - 1.1 * h);
    else if (b.consciousness === 'awake') b.sleepDebt += 0.5 * h;
    b.stress = clamp(b.stress + (act === 'sleep' || act === 'rest' ? -4 : -1) * h, 0, 100);

    // Кровь
    let bleed = 0;
    for (const i of b.injuries) bleed += bleedRate(i, t);
    if (bleed > 0) b.bloodLoss += bleed * h;
    else if (b.thirst < 60 && b.bloodLoss > 0) b.bloodLoss = Math.max(0, b.bloodLoss - 0.9 * h);

    // Температура тела: стремится к норме+жар, окружающая среда может пересилить
    const target = 36.9 + fever(b, t);
    const cold = env.outdoor || env.tempC < 14
      ? (16 - env.tempC) * (env.wet ? 1.7 : 1) - env.warmth * 3 - a.heat
      : 0;
    if (cold > 0) b.coreTemp -= cold * 0.055 * h;
    b.coreTemp += clamp(target - b.coreTemp, -1.2 * h, (cold > 0 ? 0.3 : 1.2) * h);

    // Обезвоживание
    if (b.thirst >= 100) b.dehydratedSince ??= t;
    else if (b.thirst < 90) b.dehydratedSince = undefined;

    // Раны: заживление и бактериальное заражение (решается один раз, через сутки)
    for (const i of b.injuries) {
      if (i.healed >= 1) continue;
      const days = HEAL_DAYS[i.kind] * (0.6 + i.severity * 0.2) * (i.treated === 'proper' ? 0.8 : 1.15) * (i.woundInfected ? 1.6 : 1);
      i.healed = round(clamp(i.healed + step / (days * 1440), 0, 1), 4);
      const key = `wound:${i.id}`;
      if (OPEN_WOUND.has(i.kind) && !b.rolled[key] && t - i.since >= 1440) {
        b.rolled[key] = true;
        const risk = (i.treated === 'proper' ? 0.02 : i.treated === 'basic' ? 0.08 : 0.2) * (i.severity / 3) * (i.kind === 'bite' ? 2 : 1);
        if (unit(`${seedKey}:${key}`) < risk && (b.meds.antibiotic ?? -1) < t) {
          i.woundInfected = true;
          res.notes.push('Рана покраснела, горячая на ощупь и дёргает болью.');
        }
      }
      if (i.woundInfected && (b.meds.antibiotic ?? -1) > t && unit(`${seedKey}:${key}:abx:${Math.floor(t / 720)}`) < 0.35) {
        i.woundInfected = false;
      }
    }

    // Болезни (включая скрытый возбудитель — см. illness.ts)
    for (const ill of b.illnesses) {
      const def = ILLNESSES[ill.kind];
      if (!def) continue;
      const out = def.progress(ill, b, t + step, seedKey);
      if (out?.note) res.notes.push(out.note);
      if (out?.death) { kill(b, t + step, out.death); res.died = out.death; break; }
    }
    b.illnesses = b.illnesses.filter((i) => i.stage >= 0);
    for (const i of b.injuries) {
      if (i.exposure && !b.rolled[`exp:${i.id}`] && t + step - i.since >= 60) {
        b.rolled[`exp:${i.id}`] = true;
        const pathogen = ILLNESSES.pathogen;
        if (pathogen.infect && unit(`${seedKey}:exp:${i.id}`) < i.exposure) {
          b.illnesses.push(pathogen.infect(`ill-${i.id}`, t + step, `${seedKey}:${i.id}`));
        }
      }
    }

    t += step;
    left -= step;
    if (isDead(b)) break;
    const died = checkThresholds(b, t);
    if (died) { res.died = died; break; }
  }
  for (const i of b.injuries) if (i.healed >= 1 && i.bleeding) i.bleeding = 0;
  b.bloodLoss = round(b.bloodLoss, 2);
  b.coreTemp = round(b.coreTemp, 2);
  b.hunger = round(b.hunger, 2);
  b.thirst = round(b.thirst, 2);
  b.fatigue = round(b.fatigue, 2);
  b.sleepDebt = round(b.sleepDebt, 2);
  b.stress = round(b.stress, 2);
  return res;
}

export function kill(b: Body, t: Minutes, cause: string) {
  b.consciousness = 'dead';
  b.diedAt = t;
  b.causeOfDeath = cause;
}

function setConsciousness(b: Body, c: Body['consciousness'], t: Minutes) {
  if (b.consciousness === c) return;
  b.consciousness = c;
  b.consciousSince = t;
  if (c === 'awake') b.awakeSince = t;
}

/** Пороговые состояния. Возвращает причину смерти, если она наступила. */
export function checkThresholds(b: Body, t: Minutes): string | undefined {
  if (b.consciousness === 'dead') return b.causeOfDeath;
  if (b.bloodLoss >= 100) { kill(b, t, 'кровопотеря'); return b.causeOfDeath; }
  if (b.coreTemp <= 26) { kill(b, t, 'переохлаждение'); return b.causeOfDeath; }
  if (b.coreTemp >= 42.5) { kill(b, t, 'перегрев организма'); return b.causeOfDeath; }
  if (b.dehydratedSince !== undefined && t - b.dehydratedSince >= 48 * 60) { kill(b, t, 'обезвоживание'); return b.causeOfDeath; }

  const head = b.injuries.find((i) => i.site === 'head' && i.kind === 'concussion' && i.severity >= 5 && i.healed < 0.3);
  const coma = b.bloodLoss >= 78 || !!head;
  const out = b.bloodLoss >= 55 || b.coreTemp < 30 || (b.dehydratedSince !== undefined && t - b.dehydratedSince >= 20 * 60);
  if (coma) setConsciousness(b, 'coma', t);
  else if (out) setConsciousness(b, 'unconscious', t);
  else if (b.consciousness === 'unconscious' || b.consciousness === 'coma') {
    // Приходит в себя, только когда причины ушли, и не мгновенно.
    if (t - b.consciousSince >= 30 && b.bloodLoss < 48 && b.coreTemp > 31.5) setConsciousness(b, 'awake', t);
  }
  return undefined;
}

export function wakeUp(b: Body, t: Minutes) {
  if (b.consciousness === 'asleep') setConsciousness(b, 'awake', t);
}

export function fallAsleep(b: Body, t: Minutes) {
  if (b.consciousness === 'awake') setConsciousness(b, 'asleep', t);
}

/** Наблюдаемые симптомы — единственное, что видит игрок о болезнях. */
export function symptoms(b: Body, t: Minutes): string[] {
  const s: string[] = [];
  if (b.coreTemp >= 39.5) s.push('Сильный жар');
  else if (b.coreTemp >= 38) s.push('Жар');
  else if (b.coreTemp >= 37.4) s.push('Знобит, немного горячий лоб');
  if (b.coreTemp < 35) s.push(b.coreTemp < 33 ? 'Сильное переохлаждение: тело почти не слушается' : 'Переохлаждение: трясёт, пальцы не гнутся');
  if (b.thirst >= 70) s.push(b.thirst >= 90 ? 'Обезвоживание: голова кружится, сухо во рту' : 'Сильная жажда');
  if (b.hunger >= 70) s.push('Слабость от голода');
  if (b.sleepDebt >= 12) s.push('Глаза слипаются, мысли путаются');
  else if (b.sleepDebt >= 8) s.push('Хочется спать');
  if (b.fatigue >= 75) s.push('Ноги ватные, сил почти нет');
  if (b.bloodLoss >= 30) s.push(b.bloodLoss >= 45 ? 'Бледность, холодный пот, темнеет в глазах' : 'Слабость от потери крови');
  if (b.injuries.some((i) => i.woundInfected && i.healed < 1)) s.push('Воспалённая рана');
  for (const ill of b.illnesses) for (const x of ILLNESSES[ill.kind]?.symptoms(ill, t) ?? []) if (!s.includes(x)) s.push(x);
  return s;
}
