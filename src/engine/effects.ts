import { baseOf, drive, fillCan, refuel, workOnProject } from './base';
import { checkThresholds, fallAsleep, kill, wakeUp } from './body';
import { evalCond } from './conditions';
import { newIllness } from './illness';
import { clamp } from './rng';
import { advanceTime, type AdvanceResult } from './simulate';
import type { Effect, PlayerId } from './types';
import { other } from './types';
import {
  fmt, getVar, giveItem, itemType, log, me, moveItems, nextId, setVar, takeItems, type Ctx,
} from './world';

export interface EffectResult {
  interrupted: boolean;
  notes: string[];
  goto?: string;
}

function targetPid(ctx: Ctx, t: PlayerId | '$' | '@partner' | undefined): PlayerId {
  if (!t || t === '$') return ctx.pid;
  if (t === '@partner') return other(ctx.pid);
  return t;
}

function mergeAdvance(out: EffectResult, r: AdvanceResult) {
  out.notes.push(...r.notes);
  if (r.interrupted) out.interrupted = true;
}

export function applyEffects(ctx: Ctx, effects: Effect[] | undefined, out: EffectResult = { interrupted: false, notes: [] }): EffectResult {
  if (!effects) return out;
  for (const e of effects) applyEffect(ctx, e, out);
  return out;
}

function applyEffect(ctx: Ctx, e: Effect, out: EffectResult) {
  const ch = me(ctx);
  const t = ch.time;
  if ('if' in e) { applyEffects(ctx, evalCond(ctx, e.if) ? e.then : e.else, out); return; }
  if ('set' in e && 'value' in e) { setVar(ctx, e.set, e.value); return; }
  if ('add' in e) { setVar(ctx, e.add, Number(getVar(ctx, e.add) ?? 0) + e.value); return; }
  if ('give' in e) {
    giveItem(ctx, e.give, e.qty ?? 1, { charge: e.charge, condition: e.condition, note: e.note, fuel: e.fuel });
    return;
  }
  if ('take' in e) { takeItems(ctx, (i) => i.type === e.take, e.qty ?? 1); return; }
  if ('takeTag' in e) { takeItems(ctx, (i) => itemType(ctx, i.type).tags.includes(e.takeTag), e.qty ?? 1); return; }
  if ('drop' in e) {
    moveItems(ctx, (i) => i.type === e.drop, e.qty ?? Infinity, { kind: 'char', id: ctx.pid }, { kind: 'place', id: ch.location });
    return;
  }
  if ('pickup' in e) {
    moveItems(ctx, (i) => i.type === e.pickup, e.qty ?? Infinity, { kind: 'place', id: e.place ?? ch.location }, { kind: 'char', id: ctx.pid });
    return;
  }
  if ('place' in e) {
    giveItem(ctx, e.place, e.qty ?? 1, { charge: e.charge }, { kind: 'place', id: e.at });
    return;
  }
  if ('charge' in e) {
    const item = Object.values(ctx.s.items).find((i) => i.at.kind === 'char' && i.at.id === ctx.pid && i.qty > 0
      && (i.type === e.charge || itemType(ctx, i.type).tags.includes(e.charge)) && i.charge !== undefined);
    if (item) { item.charge = clamp((item.charge ?? 0) + e.delta, 0, 100); item.changedAt = t; }
    return;
  }
  if ('body' in e) {
    ch.body[e.body] = clamp(ch.body[e.body] + e.delta, 0, e.body === 'sleepDebt' ? 72 : 100);
    if (checkThresholds(ch.body, t)) out.interrupted = true;
    return;
  }
  if ('injure' in e) {
    ch.body.injuries.push({
      id: nextId(ctx, 'inj'), kind: e.injure, site: e.site, severity: e.severity,
      bleeding: e.bleeding ?? defaultBleeding(e.injure, e.severity), treated: 'none', since: t,
      woundInfected: false, healed: 0, exposure: e.exposure,
    });
    ch.body.stress = clamp(ch.body.stress + 8 * e.severity, 0, 100);
    if (checkThresholds(ch.body, t)) out.interrupted = true;
    return;
  }
  if ('treat' in e) {
    const pid = targetPid(ctx, e.target);
    const body = ctx.s.chars[pid].body;
    const rank = { none: 0, basic: 1, proper: 2 } as const;
    for (const i of body.injuries) {
      if (i.healed >= 1 || rank[i.treated] >= rank[e.treat]) continue;
      i.treated = e.treat;
      // Тщательное промывание в первые полчаса немного снижает риск от возбудителя (скрытое правило §2.3).
      if (e.treat === 'proper' && i.exposure && t - i.since <= 30) i.exposure = Math.round(i.exposure * 0.75 * 1000) / 1000;
    }
    return;
  }
  if ('illness' in e) {
    const pid = targetPid(ctx, e.target);
    const id = nextId(ctx, 'ill');
    ctx.s.chars[pid].body.illnesses.push(newIllness(e.illness, id, t, `${ctx.s.seed}:${pid}:${id}`));
    return;
  }
  if ('medicate' in e) { ch.body.meds[e.medicate] = t + Math.round(e.hours * 60); return; }
  if ('learn' in e) {
    const prev = ctx.s.knowledge[ctx.pid][e.learn];
    if (!prev || prev.kind !== 'fact') {
      ctx.s.knowledge[ctx.pid][e.learn] = { kind: e.kind ?? 'fact', at: t, source: e.source ?? ch.scene };
      const f = ctx.c.facts[e.learn];
      if (f && !prev) log(ctx, 'news', f.text);
    }
    return;
  }
  if ('move' in e) { ch.location = e.move; return; }
  if ('npc' in e) {
    const n = ctx.s.npcs[e.npc];
    if (!n) throw new Error(`Неизвестный NPC: ${e.npc}`);
    if (e.trust) n.trust[ctx.pid] = clamp(n.trust[ctx.pid] + e.trust, -100, 100);
    if (e.remember) { const m = e.remember.replace('$', ctx.pid); if (!n.memory.includes(m)) n.memory.push(m); }
    if (e.set) Object.assign(n.vars, e.set);
    if (e.status) n.status = e.status;
    if (e.moveTo) n.location = e.moveTo;
    if (e.alive !== undefined) { n.alive = e.alive; if (!e.alive) n.status = 'dead'; }
    n.changedAt = t;
    return;
  }
  if ('log' in e) { log(ctx, e.kind ?? 'story', e.log); return; }
  if ('message' in e) {
    const tpl = ctx.c.messages.find((m) => m.id === e.message);
    if (!tpl) throw new Error(`Неизвестный шаблон сообщения: ${e.message}`);
    const to = e.to === '@partner' || !e.to ? other(ctx.pid) : e.to;
    ctx.s.messages.push({ id: nextId(ctx, 'msg'), from: ctx.pid, to, at: t, template: tpl.id, text: fmt(ctx, tpl.text), delivered: false });
    log(ctx, 'message', `Отправлено: «${fmt(ctx, tpl.text)}»`);
    return;
  }
  if ('wait' in e) { mergeAdvance(out, advanceTime(ctx, e.wait, e.activity ?? 'rest', { finishOnEvent: (e.activity ?? 'rest') !== 'rest' })); return; }
  if ('sleep' in e) {
    fallAsleep(ch.body, t);
    mergeAdvance(out, advanceTime(ctx, e.sleep, 'sleep'));
    wakeUp(ch.body, ch.time);
    return;
  }
  if ('faint' in e) {
    ch.body.consciousness = 'unconscious';
    ch.body.consciousSince = t;
    mergeAdvance(out, advanceTime(ctx, e.faint, 'rest', { finishOnEvent: true }));
    out.interrupted = true;
    return;
  }
  if ('rule' in e) { ch.rules[e.rule] = e.value; return; }
  if ('drive' in e) {
    const problem = drive(ctx, e.drive, e.km, e.to, e.jam);
    if (problem) { out.notes.push(problem); log(ctx, 'item', problem); out.interrupted = true; }
    return;
  }
  if ('refuel' in e) { const t2 = refuel(ctx, e.refuel, e.liters, e.fromCan); out.notes.push(t2); log(ctx, 'item', t2); return; }
  if ('fillCan' in e) { const t2 = fillCan(ctx, e.fillCan, e.liters); out.notes.push(t2); log(ctx, 'item', t2); return; }
  if ('work' in e) {
    const r = workOnProject(ctx, e.work, e.hours);
    out.notes.push(r.text);
    log(ctx, 'story', r.text);
    if (r.minutes) mergeAdvance(out, advanceTime(ctx, r.minutes, 'moderate', { finishOnEvent: true }));
    const def = ctx.c.projects?.[e.work];
    if (def?.onDone && ctx.s.vars[`proj.${e.work}.done`] === true && !ctx.s.vars[`proj.${e.work}.rewarded`]) {
      ctx.s.vars[`proj.${e.work}.rewarded`] = true;
      applyEffects(ctx, def.onDone, out);
    }
    return;
  }
  if ('stock' in e) {
    const place = e.at ?? baseOf(ctx, ch.location)?.stock ?? ch.location;
    moveItems(ctx, (i) => i.type === e.stock, e.qty, { kind: 'char', id: ctx.pid }, { kind: 'place', id: place });
    return;
  }
  if ('unstock' in e) {
    const place = e.at ?? baseOf(ctx, ch.location)?.stock ?? ch.location;
    moveItems(ctx, (i) => i.type === e.unstock, e.qty, { kind: 'place', id: place }, { kind: 'char', id: ctx.pid });
    return;
  }
  if ('die' in e) { kill(ch.body, t, e.die); out.interrupted = true; return; }
  const never: never = e;
  throw new Error(`Неизвестный эффект: ${JSON.stringify(never)}`);
}

function defaultBleeding(kind: string, sev: number): number {
  switch (kind) {
    case 'cut': return sev * 4;
    case 'laceration': return sev * 7;
    case 'bite': return sev * 5;
    case 'scratch': return sev * 1.5;
    case 'fracture': return sev >= 4 ? sev * 4 : 0; // открытый перелом
    default: return 0;
  }
}
