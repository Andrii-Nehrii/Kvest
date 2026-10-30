import { baseOf, canDrive, projectDone, projectProgress, stockAt } from './base';
import { canAct, isDead, isIncapacitated } from './body';
import { daylight } from './time';
import type { CmpOp, Cond, Scalar } from './types';
import { other } from './types';
import { caps, countItem, countTag, getVar, heldItems, me, network, phoneUsable, type Ctx } from './world';

export function cmp(a: Scalar | undefined, op: CmpOp, b: Scalar): boolean {
  if (a === undefined) a = typeof b === 'number' ? 0 : typeof b === 'boolean' ? false : '';
  switch (op) {
    case '<': return a < b;
    case '<=': return a <= b;
    case '==': return a === b;
    case '!=': return a !== b;
    case '>=': return a >= b;
    case '>': return a > b;
  }
}

export function evalCond(ctx: Ctx, c: Cond | undefined): boolean {
  if (!c) return true;
  const ch = me(ctx);
  if ('all' in c) return c.all.every((x) => evalCond(ctx, x));
  if ('any' in c) return c.any.some((x) => evalCond(ctx, x));
  if ('not' in c) return !evalCond(ctx, c.not);
  if ('always' in c) return true;
  if ('cp' in c) return ctx.s.checkpoint >= c.cp;
  if ('me' in c) return ctx.pid === c.me;
  if ('npcVar' in c) {
    const v = ctx.s.npcs[c.npcVar]?.vars[c.key];
    return c.value === undefined ? !!v : v === c.value;
  }
  // NPC — раньше «at»: у условия на NPC тоже есть поле at (где NPC), его нельзя спутать с местом игрока.
  if ('npc' in c) {
    const n = ctx.s.npcs[c.npc];
    if (!n) return false;
    if (c.alive !== undefined && n.alive !== c.alive) return false;
    if (c.at && n.location !== c.at) return false;
    if (c.status && n.status !== c.status) return false;
    if (c.trust && !cmp(n.trust[ctx.pid], c.trust[0], c.trust[1])) return false;
    if (c.remembers && !n.memory.includes(c.remembers.replace('$', ctx.pid))) return false;
    return true;
  }
  if ('flag' in c) return !!getVar(ctx, c.flag);
  if ('v' in c) return cmp(getVar(ctx, c.v), c.op, c.value);
  if ('has' in c) return countItem(ctx, c.has) >= (c.qty ?? 1);
  if ('hasTag' in c) return countTag(ctx, c.hasTag) >= (c.qty ?? 1);
  if ('body' in c) return cmp(ch.body[c.body], c.op, c.value);
  if ('cap' in c) {
    const k = caps(ctx);
    return c.cap === 'canAct' ? cmp(k.canAct ? 1 : 0, c.op, c.value) : cmp(k[c.cap], c.op, c.value);
  }
  if ('injured' in c) {
    return ch.body.injuries.some((i) => i.healed < 1 && (c.injured === 'any' || i.kind === c.injured)
      && (!c.site || i.site === c.site) && i.severity >= (c.minSeverity ?? 1));
  }
  if ('bleeding' in c) return ch.body.injuries.some((i) => i.bleeding > 0 && i.healed < 1 && i.treated === 'none');
  if ('trait' in c) return cmp(ch.traits[c.trait], c.op, c.value);
  if ('after' in c) return ch.time >= c.after;
  if ('before' in c) return ch.time < c.before;
  if ('daylight' in c) return daylight(ch.time).isDay === c.daylight;
  if ('knows' in c) {
    const k = ctx.s.knowledge[ctx.pid][c.knows];
    return !!k && (!c.kind || k.kind === c.kind);
  }
  if ('visited' in c) return (ch.visited[c.visited] ?? 0) >= (c.times ?? 1);
  if ('event' in c) return ctx.s.firedEvents[c.event] !== undefined || ctx.s.firedEvents[`${c.event}@${ctx.pid}`] !== undefined;
  if ('partner' in c) {
    const b = ctx.s.chars[other(ctx.pid)].body;
    if (c.partner === 'dead') return isDead(b);
    if (c.partner === 'incapacitated') return isIncapacitated(b);
    return !isDead(b) && !isIncapacitated(b);
  }
  if ('scene' in c) return ch.scene === c.scene;
  if ('phoneUsable' in c) return phoneUsable(ctx);
  if ('network' in c) return phoneUsable(ctx) && network(ctx)[c.network];
  if ('fuelFor' in c) return canDrive(ctx, c.fuelFor, c.km);
  if ('fuelIn' in c) {
    return Object.values(ctx.s.items).some((i) => i.type === c.fuelIn && i.qty > 0 && i.at.kind !== 'gone' && i.condition > 0 && (i.fuel ?? 0) >= c.liters);
  }
  if ('callable' in c) {
    const pids = [ctx.pid, other(ctx.pid)];
    if (!pids.every((p) => canAct(ctx.s.chars[p].body) && phoneUsable(ctx, p))) return false;
    // Дозваниваются полчаса: достаточно одного 10-минутного окна, когда голос есть у обоих.
    return [0, 10, 20].some((dt) => pids.every((p) => {
      const ch = ctx.s.chars[p];
      const region = ctx.c.locations[ch.location]?.region ?? 'unknown';
      return ctx.c.network?.(region, ch.time + dt, ctx.s.vars).voice ?? true;
    }));
  }
  if ('partnerAt' in c) return ctx.s.chars[other(ctx.pid)].location === c.partnerAt;
  if ('partnerKnows' in c) return !!ctx.s.knowledge[other(ctx.pid)][c.partnerKnows];
  if ('charged' in c) {
    return heldItems(ctx).some((i) => (i.type === c.charged || ctx.c.items[i.type]?.tags.includes(c.charged)) && (i.charge ?? 0) >= c.atLeast);
  }
  if ('itemAt' in c) return Object.values(ctx.s.items).some((i) => i.type === c.itemAt && i.qty > 0 && i.at.kind === 'place' && i.at.id === c.place);
  if ('project' in c) {
    if (c.done !== undefined && projectDone(ctx, c.project) !== c.done) return false;
    if (c.progress && !cmp(projectProgress(ctx, c.project), c.progress[0], c.progress[1])) return false;
    return true;
  }
  if ('stocked' in c) {
    const place = c.at ?? baseOf(ctx, ch.location)?.stock ?? ch.location;
    return stockAt(ctx, place, c.stocked) >= c.qty;
  }
  // «Где игрок» — последним: поле at есть и у других условий (NPC, склад).
  if ('at' in c) return ch.location === c.at;
  const never: never = c;
  throw new Error(`Неизвестное условие: ${JSON.stringify(never)}`);
}
