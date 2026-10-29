// Ход времени для одной временной линии: тело, батареи, события мира, планы NPC, бытовые правила.
import { canAct, symptoms, tickBody } from './body';
import { evalCond } from './conditions';
import { applyEffects } from './effects';
import { clamp, round } from './rng';
import type { Activity } from './types';
import { other } from './types';
import {
  carriedWeight, carryLimit, countTag, environment, heldItems, itemType, log, me, network, phoneUsable, takeItems, type Ctx,
} from './world';

export interface AdvanceResult {
  interrupted: boolean;
  notes: string[];
}

const HEAVIER: Record<Activity, Activity> = { sleep: 'sleep', rest: 'rest', light: 'moderate', moderate: 'heavy', heavy: 'heavy' };
const STEP = 15;

export function advanceTime(ctx: Ctx, minutes: number, activity: Activity): AdvanceResult {
  const ch = me(ctx);
  const res: AdvanceResult = { interrupted: false, notes: [] };
  fireDue(ctx, res);
  let remaining = Math.max(0, Math.round(minutes));
  const wasAble = canAct(ch.body) || ch.body.consciousness === 'asleep';
  while (remaining > 0 && !res.interrupted) {
    const step = Math.min(STEP, remaining);
    const env = environment(ctx);
    const overloaded = carriedWeight(ctx) > carryLimit(ctx) * 1.25;
    const act = overloaded ? HEAVIER[activity] : activity;
    const before = symptoms(ch.body, ch.time);
    const r = tickBody(ch.body, ch.traits, ch.time, step, act, env, `${ctx.s.seed}:${ctx.pid}`);
    drainBatteries(ctx, step);
    tickControlledPartner(ctx, step);
    ch.time += step;
    remaining -= step;
    for (const n of r.notes) { log(ctx, 'body', n); res.notes.push(n); }
    const after = symptoms(ch.body, ch.time);
    for (const sym of after) if (!before.includes(sym)) { log(ctx, 'body', sym); res.notes.push(sym); }
    if (ch.body.consciousness === 'dead') {
      log(ctx, 'system', 'Смерть.');
      res.interrupted = true;
      break;
    }
    // Потеря сознания во время действия прерывает план; если игрок уже был без сознания — время просто идёт.
    if (wasAble && !canAct(ch.body) && ch.body.consciousness !== 'asleep') res.interrupted = true;
    fireDue(ctx, res);
  }
  return res;
}

/**
 * Недееспособный партнёр, за которого «держит время» эта линия: его тело продолжает
 * меняться (кровь, температура, жажда), даже если игрок не может действовать.
 */
function tickControlledPartner(ctx: Ctx, minutes: number) {
  const pid = other(ctx.pid);
  const p = ctx.s.chars[pid];
  if (p.controlledBy !== ctx.pid || p.body.consciousness === 'dead') return;
  const pctx: Ctx = { ...ctx, pid };
  const r = tickBody(p.body, p.traits, p.time, minutes, 'rest', environment(pctx), `${ctx.s.seed}:${pid}`);
  p.time += minutes;
  if (r.died) log(pctx, 'system', 'Смерть.');
}

function drainBatteries(ctx: Ctx, minutes: number) {
  const ch = me(ctx);
  const loc = ctx.c.locations[ch.location];
  const freePower = loc?.power === 'grid' && ctx.s.vars[`w.power.${loc.region}`] !== 'off';
  const charging = ch.rules.chargePhoneWhenFreePower && freePower && countTag(ctx, 'charger') > 0;
  for (const i of heldItems(ctx)) {
    const bat = itemType(ctx, i.type).battery;
    if (!bat || i.charge === undefined) continue;
    const before = i.charge;
    const tagged = itemType(ctx, i.type).tags;
    if (charging && tagged.includes('phone')) i.charge = clamp(i.charge + 45 * minutes / 60, 0, 100);
    else i.charge = clamp(i.charge - bat.idleDrainPerHour * minutes / 60, 0, 100);
    i.charge = round(i.charge, 2);
    if (i.charge !== before) i.changedAt = ch.time;
    if (before > 0 && i.charge === 0 && tagged.includes('phone')) log(ctx, 'item', 'Телефон сел.');
  }
}

/** События мира и планы NPC, время которых наступило на этой временной линии. */
export function fireDue(ctx: Ctx, res: AdvanceResult) {
  const ch = me(ctx);
  const events = ctx.c.events
    .filter((e) => (e.scope === 'world' || e.scope === ctx.pid) && e.at <= ch.time)
    .sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1));
  for (const e of events) {
    const key = e.scope === 'world' ? `${e.id}@${ctx.pid}` : e.id;
    if (ctx.s.firedEvents[key] !== undefined) continue;
    if (!evalCond(ctx, e.when)) continue;
    ctx.s.firedEvents[key] = ch.time;
    applyEffects(ctx, e.effects);
    let heard = false;
    for (const n of e.news ?? []) {
      if (!channelOpen(ctx, n.channel)) {
        if (n.channel === 'phone') ctx.s.vars[`${ctx.pid}.missed.${e.id}`] = true;
        continue;
      }
      heard = true;
      log(ctx, 'news', n.text);
      res.notes.push(n.text);
      if (n.learn) applyEffects(ctx, [{ learn: n.learn, kind: n.kind, source: e.id }]);
    }
    if (e.interrupt && (heard || !e.news?.length)) res.interrupted = true;
  }
  for (const def of Object.values(ctx.c.npcs)) {
    const npc = ctx.s.npcs[def.id];
    if (!npc) continue;
    for (const a of def.agenda) {
      if (a.scope !== 'world' && a.scope !== ctx.pid) continue;
      const doneKey = a.scope === 'world' ? `${a.id}@${ctx.pid}` : a.id;
      if (npc.agendaDone.includes(doneKey)) continue;
      if (a.at !== undefined && a.at > ch.time) continue;
      if (!evalCond(ctx, a.when)) continue;
      npc.agendaDone.push(doneKey);
      npc.changedAt = ch.time;
      const out = applyEffects(ctx, a.effects);
      if (out.interrupted) res.interrupted = true;
    }
  }
}

export function channelOpen(ctx: Ctx, channel: 'phone' | 'radio' | 'people' | 'any' | 'direct'): boolean {
  const loc = ctx.c.locations[me(ctx).location];
  const phone = phoneUsable(ctx) && network(ctx).data;
  const radio = countTag(ctx, 'radio') > 0 || !!loc?.media?.some((m) => m === 'radio' || m === 'tv');
  const people = !!loc?.media?.includes('people');
  switch (channel) {
    case 'direct': return true;
    case 'phone': return phone;
    case 'radio': return radio;
    case 'people': return people;
    case 'any': return phone || radio || people;
  }
}

/** Бытовые правила (п. 5.1): попить/поесть в спокойной обстановке. Не принимают сюжетных решений. */
export function applyStandingRules(ctx: Ctx) {
  const ch = me(ctx);
  if (!canAct(ch.body)) return;
  const scene = ctx.c.scenes[ch.scene];
  if (!scene?.safe && !scene?.calm) return;
  const usable = (tag: 'thirst' | 'hunger') => heldItems(ctx)
    .filter((i) => {
      const t = itemType(ctx, i.type);
      return (t.food?.[tag] ?? 0) > 0 && !(ch.rules.keepReserve && t.tags.includes('reserve'));
    })
    .sort((a, b) => (itemType(ctx, b.type).spoilsAfter ? 1 : 0) - (itemType(ctx, a.type).spoilsAfter ? 1 : 0) || (a.id < b.id ? -1 : 1));
  if (ch.rules.drinkWhenThirsty && ch.body.thirst >= 45) {
    const item = usable('thirst')[0];
    if (item) {
      const t = itemType(ctx, item.type);
      takeItems(ctx, (i) => i.id === item.id, 1);
      ch.body.thirst = clamp(ch.body.thirst - (t.food?.thirst ?? 0), 0, 100);
      ch.body.hunger = clamp(ch.body.hunger - (t.food?.hunger ?? 0), 0, 100);
      log(ctx, 'item', `По привычке: выпито — ${t.name}.`);
    }
  }
  if (ch.rules.eatWhenHungry && ch.body.hunger >= 55) {
    const item = usable('hunger')[0];
    if (item) {
      const t = itemType(ctx, item.type);
      takeItems(ctx, (i) => i.id === item.id, 1);
      ch.body.hunger = clamp(ch.body.hunger - (t.food?.hunger ?? 0), 0, 100);
      ch.body.thirst = clamp(ch.body.thirst - (t.food?.thirst ?? 0), 0, 100);
      log(ctx, 'item', `По привычке: съедено — ${t.name}.`);
    }
  }
}
