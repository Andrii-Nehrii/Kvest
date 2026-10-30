// Действия: одиночные, несколько совместимых, последовательные, условные, рискованные,
// взаимоисключающие. План выполняется по шагам с проверкой мира после каждого шага.
import { canAct } from './body';
import { evalCond } from './conditions';
import type { ActionDef, Scene } from './content-types';
import { checkChance } from './checks';
import { applyEffects, type EffectResult } from './effects';
import { clamp } from './rng';
import { hourOfDay } from './time';
import { advanceTime, applyStandingRules, drinkOrder } from './simulate';
import type { Effect } from './types';
import {
  caps, carriedWeight, carryLimit, countTag, fmt, heldItems, itemsAt, itemType, log, me, network, pain, phone, phoneUsable, roll, type Ctx,
} from './world';

export interface AvailableAction {
  def: ActionDef;
  enabled: boolean;
  reason?: string;
  universal: boolean;
  /**
   * Действие недоступно только потому, что ещё не сделаны эти шаги (requiresDone), а само условие `enabled`
   * выполнено: в плане его можно поставить после них. Если не выполнено `enabled`, поле не задаётся.
   */
  waitsFor?: string[];
}

export function currentScene(ctx: Ctx): Scene {
  const id = me(ctx).scene;
  const s = ctx.c.scenes[id];
  if (!s) throw new Error(`Сцена не найдена: ${id}`);
  return s;
}

const doneKey = (scene: string, action: string) => `${scene}/${action}`;

export function availableActions(ctx: Ctx): AvailableAction[] {
  const scene = currentScene(ctx);
  const ch = me(ctx);
  const out: AvailableAction[] = [];
  for (const def of scene.actions) {
    if (!def.repeatable && ch.done[doneKey(scene.id, def.id)]) continue;
    if (!evalCond(ctx, def.when)) continue;
    // Условие и очерёдность — раздельно: «сначала спросить» можно выполнить в том же плане,
    // а невыполненное условие (нет денег, нет ключа) план не обходит.
    const condOk = evalCond(ctx, def.enabled);
    const waitsFor = (def.requiresDone ?? []).filter((r) => !ch.done[doneKey(scene.id, r)]);
    const enabled = condOk && waitsFor.length === 0;
    const firstLabel = () => scene.actions.find((x) => x.id === waitsFor[0])?.label ?? waitsFor[0];
    out.push({
      def, enabled, universal: false,
      reason: enabled ? undefined : condOk ? fmt(ctx, `Сначала: «${firstLabel()}»`) : def.disabledReason ?? 'Сейчас это невозможно',
      ...(condOk && waitsFor.length ? { waitsFor } : {}),
    });
  }
  if (scene.universal !== false && canAct(ch.body)) {
    for (const def of universalActions(ctx, scene)) out.push({ def, enabled: true, universal: true });
  }
  return out;
}

// ───────────── Универсальные действия ─────────────

function bestFood(ctx: Ctx, need: 'thirst' | 'hunger') {
  const list = heldItems(ctx).filter((i) => (itemType(ctx, i.type).food?.[need] ?? 0) > 0);
  if (need === 'thirst') return list.sort((a, b) => drinkOrder(ctx, a, b))[0];
  return list
    .sort((a, b) => (itemType(ctx, b.type).spoilsAfter ? 1 : 0) - (itemType(ctx, a.type).spoilsAfter ? 1 : 0)
      || (itemType(ctx, b.type).food?.[need] ?? 0) - (itemType(ctx, a.type).food?.[need] ?? 0)
      || (a.id < b.id ? -1 : 1))[0];
}

/** Служебные действия, которые интерфейс показывает не в списке сцены, а на своих экранах. */
export const isServiceAction = (id: string) => /^u:(take|drop1|dropall|rule):/.test(id);

/** Больше этого (во столько раз больше комфортной нагрузки) одной кнопкой «Взять» не унести. */
export const CARRY_HARD_FACTOR = 2;

export function universalActions(ctx: Ctx, scene: Scene): ActionDef[] {
  const ch = me(ctx);
  const b = ch.body;
  const list: ActionDef[] = [];
  const drink = bestFood(ctx, 'thirst');
  if (drink && b.thirst >= 10) {
    const t = itemType(ctx, drink.type);
    // Вода или молоко — «попить»; яблоко или консервы тоже утоляют жажду, но их едят.
    const label = t.tags.includes('drink') ? `Попить (${t.name})` : `Утолить жажду (${t.name})`;
    list.push({
      id: 'u:drink', label, minutes: 3, combinable: true, group: 'u:drink',
      effects: [{ take: drink.type }, { body: 'thirst', delta: -(t.food?.thirst ?? 0) }, { body: 'hunger', delta: -(t.food?.hunger ?? 0) }],
    });
  }
  const food = bestFood(ctx, 'hunger');
  if (food && b.hunger >= 20) {
    const t = itemType(ctx, food.type);
    list.push({
      id: 'u:eat', label: `Поесть (${t.name})`, minutes: t.food?.minutes ?? 15, combinable: true, group: 'u:eat',
      effects: [{ take: food.type }, { body: 'hunger', delta: -(t.food?.hunger ?? 0) }, { body: 'thirst', delta: -(t.food?.thirst ?? 0) }],
    });
  }
  const untreated = b.injuries.some((i) => i.healed < 1 && i.treated === 'none' && i.kind !== 'bruise' && i.kind !== 'concussion');
  treatActions(ctx, list, untreated);
  if (countTag(ctx, 'painkiller') > 0 && (pain(ctx) >= 10 || b.coreTemp >= 38) && (b.meds.painkiller ?? -1) < ch.time) {
    list.push({ id: 'u:pill', label: 'Принять обезболивающее', minutes: 2, combinable: true, group: 'u:pill',
      effects: [{ takeTag: 'painkiller' }, { medicate: 'painkiller', hours: 5 }, { medicate: 'antipyretic', hours: 5 }] });
  }
  const bank = heldItems(ctx).find((i) => itemType(ctx, i.type).tags.includes('powerbank') && (i.charge ?? 0) >= 10);
  const ph = phone(ctx);
  if (bank && ph && (ph.charge ?? 0) <= 80) {
    list.push({ id: 'u:powerbank', label: 'Подзарядить телефон от пауэрбанка', minutes: 2, combinable: true, group: 'u:powerbank',
      effects: [{ charge: bank.type, delta: -10 }, { charge: 'phone', delta: 20 }] });
  }
  if (phoneUsable(ctx) && network(ctx).data && Object.keys(ctx.s.vars).some((k) => k.startsWith(`${ctx.pid}.missed.`) && ctx.s.vars[k])) {
    list.push({ id: 'u:news', label: 'Пролистать новости в телефоне', minutes: 10, combinable: true, group: 'u:news',
      effects: [{ charge: 'phone', delta: -2 }] });
  }
  if (phoneUsable(ctx) && network(ctx).sms && ch.time >= (ctx.c.partnerContactAfter ?? 0)) {
    for (const m of ctx.c.messages) {
      // Одно и то же сообщение — не чаще раза в час.
      if (ctx.s.messages.some((x) => x.from === ctx.pid && x.template === m.id && ch.time - x.at < 60)) continue;
      list.push({ id: `u:msg:${m.id}`, label: fmt(ctx, `Написать {partner.dat}: «${m.label}»`), minutes: 2, combinable: true, group: `u:msg:${m.id}`,
        effects: [{ message: m.id }, { charge: 'phone', delta: -1 }] });
    }
  }
  const loc = ctx.c.locations[ch.location];
  if (loc?.water && ctx.s.vars[`w.water.${loc.region}`] !== 'off' && b.thirst >= 10) {
    list.push({ id: 'u:tap', label: 'Попить воды из-под крана', minutes: 3, combinable: true, group: 'u:drink', effects: [{ body: 'thirst', delta: -35 }] });
  }
  // Служебные действия интерфейса (экран вещей и настроек). Тоже идут в журнал участка,
  // поэтому у партнёра воспроизводятся так же, как сюжетные.
  // «Взять» уносит стопку целиком, но не больше, чем вообще можно нести (вдвое больше комфортной нагрузки):
  // остальное остаётся лежать.
  const room = carryLimit(ctx) * CARRY_HARD_FACTOR - carriedWeight(ctx);
  const here = new Map<string, number>();
  for (const i of itemsAt(ctx, ch.location)) here.set(i.type, (here.get(i.type) ?? 0) + i.qty);
  for (const [type, qty] of here) {
    const t = itemType(ctx, type);
    if (t.vehicle || t.weight > 30000) continue;
    const n = t.weight > 0 ? Math.min(qty, Math.max(0, Math.floor(room / t.weight))) : qty;
    if (n <= 0) continue;
    list.push({
      id: `u:take:${type}`, label: n < qty ? `Взять: ${t.name} (${n} из ${qty})` : `Взять: ${t.name}`, minutes: 1, combinable: true, group: `u:item:${type}`,
      ...(n < qty ? { text: `Всё не унести: взято ${n} из ${qty}.` } : {}),
      effects: [n < qty ? { pickup: type, qty: n } : { pickup: type }],
    });
  }
  for (const type of [...new Set(heldItems(ctx).map((i) => i.type))]) {
    const t = itemType(ctx, type);
    list.push({ id: `u:drop1:${type}`, label: `Оставить здесь одну: ${t.name}`, minutes: 1, combinable: true, group: `u:item:${type}`, effects: [{ drop: type, qty: 1 }] });
    list.push({ id: `u:dropall:${type}`, label: `Оставить здесь все: ${t.name}`, minutes: 1, combinable: true, group: `u:item:${type}`, effects: [{ drop: type }] });
  }
  for (const key of Object.keys(ch.rules) as (keyof typeof ch.rules)[]) {
    list.push({ id: `u:rule:${key}`, label: `Правило: ${key}`, minutes: 0, combinable: true, group: `u:rule:${key}`, effects: [{ rule: key, value: !ch.rules[key] }] });
  }
  list.push({ id: 'u:rest', label: 'Перевести дух (30 мин)', minutes: 30, activity: 'rest', combinable: true, group: 'u:rest', repeatable: true });
  // Сон — когда он нужен: недосып или ночь (иначе «лечь на два часа» в 06:30 после пробуждения).
  const hour = hourOfDay(ch.time);
  if (scene.safe && (b.sleepDebt >= 4 || hour >= 20 || hour < 5)) {
    const hours = clamp(Math.round(b.sleepDebt / 1.1), 2, 9);
    list.push({ id: 'u:sleep', label: `Лечь спать (≈${hours} ч)`, minutes: 0, group: 'u:sleep', effects: [{ sleep: hours * 60 }], repeatable: true });
  }
  return list;
}

/**
 * Перевязка по правилам главы 2: пустой антисептик не считается, у аптечки тратится одно использование,
 * перевязку «кое-как» можно переделать как следует.
 */
function treatActions(ctx: Ctx, list: ActionDef[], untreated: boolean) {
  const b = me(ctx).body;
  const rough = b.injuries.some((i) => i.healed < 1 && i.treated === 'basic' && i.kind !== 'bruise' && i.kind !== 'concussion');
  const dressing = countTag(ctx, 'dressing') > 0;
  const antiseptic = heldItems(ctx).some((i) => itemType(ctx, i.type).tags.includes('antiseptic') && (i.charge === undefined || i.charge > 0));
  if ((untreated || rough) && dressing && antiseptic) {
    list.push({ id: 'u:treat', label: untreated ? 'Промыть и перевязать раны' : 'Промыть раны и перевязать как следует', minutes: 15, combinable: true, group: 'u:treat',
      effects: [{ use: 'dressing' }, { charge: 'antiseptic', delta: -10 }, { treat: 'proper' }] });
  } else if (untreated && (dressing || countTag(ctx, 'cloth') > 0)) {
    list.push({ id: 'u:treat', label: 'Перевязать раны тем, что есть', minutes: 10, combinable: true, group: 'u:treat',
      effects: [{ use: dressing ? 'dressing' : 'cloth' }, { treat: 'basic' }] });
  }
}

export { checkChance };

// ───────────── План ─────────────

export interface PlanValidation {
  ok: boolean;
  errors: string[];
}

export function validatePlan(ctx: Ctx, ids: string[]): PlanValidation {
  const errors: string[] = [];
  const avail = new Map(availableActions(ctx).map((a) => [a.def.id, a]));
  const defs: ActionDef[] = [];
  if (ids.length === 0) errors.push('Ничего не выбрано.');
  if (new Set(ids).size !== ids.length) errors.push('Одно действие выбрано дважды.');
  for (const id of ids) {
    const a = avail.get(id);
    if (!a) { errors.push(`Действие недоступно: ${id}`); continue; }
    // Недоступное действие допустимо, только если не хватает лишь предыдущих шагов и они стоят в плане раньше.
    if (!a.enabled && !(a.waitsFor && a.waitsFor.every((r) => ids.indexOf(r) >= 0 && ids.indexOf(r) < ids.indexOf(id)))) {
      errors.push(`«${a.def.label}»: ${a.reason}`);
    }
    defs.push(a.def);
  }
  if (defs.length > 1) {
    for (const d of defs) if (!d.combinable) errors.push(`«${d.label}» нельзя совмещать с другими действиями.`);
    const groups = new Map<string, string>();
    for (const d of defs) {
      if (!d.group) continue;
      const prev = groups.get(d.group);
      if (prev) errors.push(`«${prev}» и «${d.label}» взаимоисключают друг друга.`);
      else groups.set(d.group, d.label);
    }
    const terminal = defs.filter((d) => d.terminal || d.goto);
    if (terminal.length > 1) errors.push('В плане может быть только одно действие, которое уводит из этого места.');
    if (terminal.length === 1 && defs[defs.length - 1] !== terminal[0]) errors.push(`«${terminal[0].label}» должно быть последним в плане.`);
  }
  return { ok: errors.length === 0, errors };
}

export interface StepResult {
  id: string;
  label: string;
  text: string[];
  minutes: number;
  outcome?: string;
}

export interface PlanResult {
  steps: StepResult[];
  stopped?: string;
  scene: string;
  checkpointReached?: number;
}

export function enterScene(ctx: Ctx, sceneId: string): EffectResult {
  const ch = me(ctx);
  const scene = ctx.c.scenes[sceneId];
  if (!scene) throw new Error(`Сцена не найдена: ${sceneId}`);
  ch.scene = sceneId;
  ch.visited[sceneId] = (ch.visited[sceneId] ?? 0) + 1;
  if (scene.location) ch.location = scene.location;
  if (scene.title) log(ctx, 'story', `— ${scene.title} —`);
  return applyEffects(ctx, scene.onEnter);
}

export function executePlan(ctx: Ctx, ids: string[]): PlanResult {
  const v = validatePlan(ctx, ids);
  if (!v.ok) throw new Error(v.errors.join(' '));
  const ch = me(ctx);
  const startScene = ch.scene;
  const result: PlanResult = { steps: [], scene: startScene };
  for (let n = 0; n < ids.length; n++) {
    const id = ids[n];
    if (ch.scene !== startScene) { result.stopped = 'Обстановка изменилась — остальные действия отменены.'; break; }
    if (!canAct(ch.body)) { result.stopped = 'Ты не в состоянии продолжать.'; break; }
    // Перед шагом мир проверяется заново: предыдущие шаги уже отмечены как сделанные, условие — по текущему миру.
    const a = availableActions(ctx).find((x) => x.def.id === id);
    if (!a || !a.enabled) {
      result.stopped = `После предыдущего шага «${a?.def.label ?? id}» стало невозможно.`;
      break;
    }
    const def = a.def;
    ch.done[doneKey(startScene, def.id)] = (ch.done[doneKey(startScene, def.id)] ?? 0) + 1;
    const step: StepResult = { id: def.id, label: def.label, text: [], minutes: 0 };
    log(ctx, 'action', def.label);
    if (def.text) step.text.push(fmt(ctx, def.text));

    // Исход определяется по состоянию в начале действия (усталость, травмы, черты).
    let outcomeEffects: Effect[] = [];
    let goto = def.goto;
    let interrupt = false;
    for (const o of def.outcomes ?? []) {
      if (!evalCond(ctx, o.when)) continue;
      const p = o.check ? checkChance(ctx, o.check) : o.chance;
      if (p !== undefined && roll(ctx, `${startScene}/${def.id}/${o.id}`) >= p) continue;
      step.outcome = o.id;
      if (o.text) step.text.push(fmt(ctx, o.text));
      outcomeEffects = o.effects ?? [];
      if (o.goto) goto = o.goto;
      interrupt = !!o.interrupt;
      break;
    }

    const mobility = caps(ctx).mobility;
    const minutes = def.move ? Math.round(def.minutes / Math.max(0.2, mobility)) : def.minutes;
    step.minutes = minutes;
    const startT = ch.time;
    const eff = applyEffects(ctx, def.effects);
    applyEffects(ctx, outcomeEffects, eff);
    if (def.id === 'u:news') deliverMissedNews(ctx, step);
    for (const t of step.text) log(ctx, 'story', t);
    const activity = def.activity ?? (def.move ? 'moderate' : 'light');
    const adv = advanceTime(ctx, Math.max(0, minutes - (ch.time - startT)), activity, { finishOnEvent: activity !== 'rest' });
    step.text.push(...eff.notes, ...adv.notes);
    result.steps.push(step);

    if (eff.interrupted || adv.interrupted) interrupt = true;
    if (canAct(ch.body)) applyStandingRules(ctx);
    if (goto && canAct(ch.body) && !eff.stay) {
      const enter = enterScene(ctx, goto);
      if (ctx.c.scenes[goto].checkpoint !== undefined) result.checkpointReached = ctx.c.scenes[goto].checkpoint;
      if (enter.interrupted) interrupt = true;
    }
    if (interrupt && n < ids.length - 1) { result.stopped = 'План прерван.'; break; }
  }
  result.scene = ch.scene;
  return result;
}

function deliverMissedNews(ctx: Ctx, step: StepResult) {
  const prefix = `${ctx.pid}.missed.`;
  const ids = Object.keys(ctx.s.vars).filter((k) => k.startsWith(prefix) && ctx.s.vars[k]).sort();
  for (const k of ids) {
    const ev = ctx.c.events.find((e) => e.id === k.slice(prefix.length));
    ctx.s.vars[k] = false;
    for (const n of ev?.news ?? []) {
      if (n.channel !== 'phone') continue;
      step.text.push(n.text);
      if (n.learn) applyEffects(ctx, [{ learn: n.learn, kind: n.kind, source: ev!.id, quiet: true }]);
    }
  }
}
