// Инварианты тела и вещей: что бы ни происходило, числа остаются числами и в своих пределах,
// бытовые правила не трогают резерв и не срабатывают в небезопасной обстановке,
// а скрытое заражение до первых симптомов ничем не отличается от здорового тела.
import { describe, expect, it } from 'vitest';
import { availableActions, isServiceAction, validatePlan } from './actions';
import { capabilities, newBody, painLevel, symptoms, tickBody, type Environment } from './body';
import { newGame, play, segmentFinished } from './game';
import { unit } from './rng';
import { applyStandingRules } from './simulate';
import type { Activity, Body, BodySite, GameState, InjuryKind, PlayerId, Traits } from './types';
import { giveItem, heldItems, type Ctx } from './world';
import { START_TIME } from '../app/session';
import { content as c } from '../content/index';

const TRAITS: Traits = { strength: 3, endurance: 3, agility: 3, melee: 2, medicine: 1, driving: 3, stealth: 2, persuasion: 3, technical: 2 };
const KINDS: InjuryKind[] = ['bruise', 'cut', 'laceration', 'scratch', 'bite', 'sprain', 'fracture', 'burn', 'concussion'];
const SITES: BodySite[] = ['head', 'torso', 'leftArm', 'rightArm', 'hands', 'leftLeg', 'rightLeg', 'feet'];
const ACTS: Activity[] = ['sleep', 'rest', 'light', 'moderate', 'heavy'];
const pick = <T,>(xs: readonly T[], key: string): T => xs[Math.floor(unit(key) * xs.length)];

function bodyProblems(b: Body, t: number, where: string): string[] {
  const out: string[] = [];
  for (const k of ['hunger', 'thirst', 'fatigue', 'sleepDebt', 'bloodLoss', 'coreTemp', 'stress'] as const) {
    if (!Number.isFinite(b[k])) out.push(`${where}: ${k} = ${b[k]}`);
  }
  for (const k of ['hunger', 'thirst', 'fatigue', 'stress'] as const) if (b[k] < 0 || b[k] > 100) out.push(`${where}: ${k} = ${b[k]}`);
  if (b.sleepDebt < 0) out.push(`${where}: sleepDebt = ${b.sleepDebt}`);
  if (b.wet !== undefined && (!Number.isFinite(b.wet) || b.wet < 0 || b.wet > 1)) out.push(`${where}: wet = ${b.wet}`);
  if (b.bloodLoss < 0) out.push(`${where}: bloodLoss = ${b.bloodLoss}`);
  if (b.consciousness === 'dead') {
    if (!b.causeOfDeath || b.diedAt === undefined) out.push(`${where}: смерть без причины/времени`);
  } else {
    if (b.bloodLoss >= 100) out.push(`${where}: жив при кровопотере ${b.bloodLoss}`);
    if (b.coreTemp <= 26 || b.coreTemp >= 42.5) out.push(`${where}: жив при температуре ${b.coreTemp}`);
  }
  for (const i of b.injuries) {
    if (!Number.isFinite(i.healed) || i.healed < 0 || i.healed > 1) out.push(`${where}: заживление ${i.healed}`);
    if (!Number.isFinite(i.bleeding) || i.bleeding < 0) out.push(`${where}: кровотечение ${i.bleeding}`);
  }
  const k = capabilities(b, TRAITS, t);
  for (const x of [k.mobility, k.focus, k.strength]) if (!Number.isFinite(x) || x < 0 || x > 1) out.push(`${where}: способности ${JSON.stringify(k)}`);
  const p = painLevel(b, t);
  if (!Number.isFinite(p) || p < 0 || p > 100) out.push(`${where}: боль ${p}`);
  if (symptoms(b, t).some((s) => !s || /undefined|NaN/.test(s))) out.push(`${where}: симптомы ${symptoms(b, t)}`);
  return out;
}

function stateProblems(s: GameState, where: string): string[] {
  const out: string[] = [];
  for (const p of ['A', 'B'] as const) out.push(...bodyProblems(s.chars[p].body, s.chars[p].time, `${where}/${p}`));
  for (const i of Object.values(s.items)) {
    if (!Number.isFinite(i.qty) || i.qty < 0) out.push(`${where}: ${i.id} qty = ${i.qty}`);
    if (i.charge !== undefined && (!Number.isFinite(i.charge) || i.charge < 0 || i.charge > 100)) out.push(`${where}: ${i.id} заряд ${i.charge}`);
    if (i.fuel !== undefined && (!Number.isFinite(i.fuel) || i.fuel < 0)) out.push(`${where}: ${i.id} топливо ${i.fuel}`);
  }
  for (const [k, v] of Object.entries(s.vars)) if (typeof v === 'number' && !Number.isFinite(v)) out.push(`${where}: ${k} = ${v}`);
  return out;
}

describe('тело: инварианты', () => {
  it('300 случайных тел в любой среде — значения конечны и в пределах', () => {
    const problems: string[] = [];
    for (let n = 0; n < 300; n++) {
      const r = (k: string) => unit(`fz:${n}:${k}`);
      const b = newBody(0);
      b.hunger = r('h') * 100; b.thirst = r('t') * 100; b.fatigue = r('f') * 100; b.stress = r('s') * 100;
      b.sleepDebt = r('d') * 30; b.bloodLoss = r('b') * 70; b.coreTemp = 31 + r('c') * 8;
      for (let j = 0; j < Math.floor(r('ni') * 4); j++) {
        b.injuries.push({
          id: `i${j}`, kind: pick(KINDS, `fz:${n}:k${j}`), site: pick(SITES, `fz:${n}:s${j}`), severity: (1 + Math.floor(r(`v${j}`) * 5)) as 1,
          bleeding: r(`bl${j}`) < 0.5 ? 0 : r(`bv${j}`) * 30, treated: pick(['none', 'basic', 'proper'] as const, `fz:${n}:tr${j}`),
          since: -Math.floor(r(`sn${j}`) * 3000), woundInfected: r(`wi${j}`) < 0.2, healed: r(`hl${j}`) * 0.9,
          exposure: r(`ex${j}`) < 0.3 ? r(`ev${j}`) : undefined,
        });
      }
      if (r('ill') < 0.3) b.illnesses.push({ id: 'ill', kind: pick(['cold', 'flu'], `fz:${n}:ik`), stage: 0, since: 0, severity: 0 });
      if (r('med') < 0.3) b.meds = { painkiller: 300, antipyretic: 300, antibiotic: 3000 };
      const env: Environment = { tempC: -15 + r('e') * 50, wet: r('w') < 0.4, outdoor: r('o') < 0.6, warmth: r('wa') * 12, rain: r('rn'), dryPerHour: r('dr') };
      const act = pick(ACTS, `fz:${n}:a`);
      if (act === 'sleep') b.consciousness = 'asleep';
      let t = 0;
      for (let k = 0; k < 40 && b.consciousness !== 'dead'; k++) {
        const step = pick([15, 20, 60, 600], `fz:${n}:st${k}`);
        tickBody(b, TRAITS, t, step, act, env, `fz:${n}`);
        t += step;
        problems.push(...bodyProblems(b, t, `тело ${n}, шаг ${k}`));
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('скрытое заражение до первых симптомов ничем не видно', () => {
    const env: Environment = { tempC: 20, wet: false, outdoor: false, warmth: 3 };
    let incubating = 0;
    for (let n = 0; n < 20; n++) {
      const sick = newBody(0);
      sick.injuries.push({ id: 'b', kind: 'bite', site: 'leftArm', severity: 2, bleeding: 10, treated: 'none', since: 0, woundInfected: false, healed: 0, exposure: 1 });
      const well = structuredClone(sick);
      well.injuries[0].exposure = 0;
      for (let t = 0; t < 40 * 60; t += 15) {
        tickBody(sick, TRAITS, t, 15, 'rest', env, `inc:${n}`);
        tickBody(well, TRAITS, t, 15, 'rest', env, `inc:${n}`);
        if (sick.illnesses[0]?.stage !== 0) continue;
        incubating++;
        const seen = (b: Body) => JSON.stringify([symptoms(b, t + 15), b.coreTemp, b.stress, b.fatigue, b.consciousness, painLevel(b, t + 15), capabilities(b, TRAITS, t + 15)]);
        expect(seen(sick)).toBe(seen(well));
      }
    }
    expect(incubating).toBeGreaterThan(0);
  });
});

describe('бытовые правила', () => {
  const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
  const game = () => newGame(c, { pairId: 'p', seed: 'rules', startTime: START_TIME, players: { A: { name: forms('A') }, B: { name: forms('B') } } });
  const safeScene = Object.values(c.scenes).find((s) => s.for === 'A' && s.safe)!;
  const unsafeScene = Object.values(c.scenes).find((s) => s.for === 'A' && !s.safe && !s.calm && s.universal !== false)!;

  it('в небезопасной обстановке не срабатывают', () => {
    const s = game();
    const ctx: Ctx = { s, c, pid: 'A' };
    s.chars.A.scene = unsafeScene.id;
    giveItem(ctx, 'water_15', 1);
    s.chars.A.body.thirst = 80;
    applyStandingRules(ctx);
    expect(s.chars.A.body.thirst).toBe(80);
  });

  it('не трогают резерв и не едят того, чего нет', () => {
    const s = game();
    const ctx: Ctx = { s, c, pid: 'A' };
    s.chars.A.scene = safeScene.id;
    s.chars.A.rules.eatWhenHungry = true;
    for (const i of heldItems(ctx)) if (c.items[i.type].food) i.at = { kind: 'gone' };
    const reserve = Object.values(c.items).filter((t) => t.tags.includes('reserve') && ((t.food?.hunger ?? 0) > 0 || (t.food?.thirst ?? 0) > 0));
    expect(reserve.length).toBeGreaterThan(0);
    for (const t of reserve) giveItem(ctx, t.id, 1);
    s.chars.A.body.hunger = 90;
    s.chars.A.body.thirst = 90;
    const before = heldItems(ctx).map((i) => `${i.type}:${i.qty}`);
    applyStandingRules(ctx);
    expect(heldItems(ctx).map((i) => `${i.type}:${i.qty}`)).toEqual(before);
    expect(s.chars.A.body.hunger).toBe(90);
    s.chars.A.rules.keepReserve = false;
    applyStandingRules(ctx);
    expect(s.chars.A.body.hunger).toBeLessThan(90);
  });
});

describe('случайные прохождения первого участка', () => {
  it('тело и вещи остаются в пределах, ничего не падает', { timeout: 120000 }, () => {
    const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
    const problems = new Set<string>();
    for (let run = 0; run < 12; run++) {
      const s = newGame(c, { pairId: 'p', seed: `inv-${run}`, startTime: START_TIME, players: { A: { name: forms('A') }, B: { name: forms('B') } } });
      for (const pid of ['A', 'B'] as PlayerId[]) {
        for (let step = 0; step < 250 && !segmentFinished(c, s, pid); step++) {
          const ctx: Ctx = { s, c, pid };
          const avail = availableActions(ctx).filter((a) => a.enabled);
          const story = avail.filter((a) => !a.universal);
          const r = unit(`inv:${run}:${pid}:${step}`);
          // В основном сюжет, иногда — бытовые и служебные действия (вещи, правила, сон).
          const pool = r < 0.25 ? avail : r < 0.85 && story.length ? story : avail.filter((a) => !isServiceAction(a.def.id));
          if (!pool.length) break;
          const id = pick(pool, `inv:${run}:${pid}:${step}:p`).def.id;
          if (!validatePlan(ctx, [id]).ok) continue;
          play(c, s, pid, [id]);
          for (const p of stateProblems(s, `${run}/${pid}/${step} ${id}`)) problems.add(p);
        }
      }
    }
    expect([...problems].slice(0, 20)).toEqual([]);
  });
});
