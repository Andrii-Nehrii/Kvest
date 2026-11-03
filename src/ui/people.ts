import { evalCond } from '../engine/conditions';
import type { Ctx } from '../engine/world';
import { knownNpc } from './format';

/** Показываем собственные знакомства, не добавляя людей в старую общую базу КТ. */
export function knownContacts(ctx: Ctx) {
  const simulated = new Set(Object.values(ctx.s.npcs)
    .filter(n => knownNpc(n, ctx.pid, ctx.s.vars)).map(n => n.id));
  return Object.values(ctx.c.contacts ?? {}).filter(person =>
    ctx.s.checkpoint >= person.fromCheckpoint && !simulated.has(person.id) && evalCond(ctx, person.knownWhen));
}
