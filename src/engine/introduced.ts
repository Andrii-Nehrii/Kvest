import type { Content, NpcDef } from './content-types';
import type { ItemInstance, NpcState } from './types';
import { me, moveItems, type Ctx } from './world';

export const introducedPerson = (def: NpcDef, time: number): NpcState => ({
  id: def.id, ...structuredClone(def.initial), agendaDone: [], changedAt: time,
});

/** Детерминированный исходный запас. Он не относится к личной нумерации предметов. */
export function introducedItem(c: Content, npc: string, slot: number, checkpoint: number): ItemInstance | undefined {
  const def = c.npcs[npc], spec = def?.initialItems?.[slot];
  if (!def?.introducedByStory || !spec || !c.items[spec.type]) return;
  return { id: `intro:${checkpoint}:${npc}:${slot}`, type: spec.type, qty: spec.qty, condition: 100,
    at: { kind: 'npc', id: npc }, changedAt: 0,
    ...(spec.charge !== undefined ? { charge: spec.charge } : {}), ...(spec.fuel !== undefined ? { fuel: spec.fuel } : {}),
    introducedStock: { checkpoint, npc, slot } };
}

export function introduceNpc(ctx: Ctx, id: string): string | undefined {
  if (ctx.s.checkpoint < 7) return;
  const def = ctx.c.npcs[id];
  if (!def?.introducedByStory) return 'Этот человек не вводится событием.';
  if (ctx.s.npcs[id]) return;
  ctx.s.npcs[id] = introducedPerson(def, me(ctx).time);
  for (let slot = 0; slot < (def.initialItems?.length ?? 0); slot++) {
    const item = introducedItem(ctx.c, id, slot, ctx.s.checkpoint);
    if (item && !ctx.s.items[item.id]) ctx.s.items[item.id] = item;
  }
}

export function npcQuantity(ctx: Ctx, npc: string, type: string): number {
  if (ctx.s.checkpoint < 7 || !ctx.s.npcs[npc]) return 0;
  return Object.values(ctx.s.items).filter(i => i.qty > 0 && i.type === type && i.at.kind === 'npc' && i.at.id === npc)
    .reduce((n, i) => n + i.qty, 0);
}

export function takeFromNpc(ctx: Ctx, npc: string, type: string, qty = 1): string | undefined {
  if (ctx.s.checkpoint < 7) return;
  if (ctx.s.npcs[npc]?.location !== me(ctx).location || !(qty > 0) || npcQuantity(ctx, npc, type) < qty)
    return 'Предмета нет у этого человека рядом с тобой.';
  moveItems(ctx, i => i.type === type, qty, { kind: 'npc', id: npc }, { kind: 'char', id: ctx.pid });
}

export function npcTransfer(ctx: Ctx, from: string, to: string, type: string, qty = 1, allowDeadRecipient = false): string | undefined {
  if (ctx.s.checkpoint < 7) return;
  const a = ctx.s.npcs[from], b = ctx.s.npcs[to];
  if (!a || !b || (!b.alive && !allowDeadRecipient) || a.location !== b.location || !(qty > 0) || npcQuantity(ctx, from, type) < qty)
    return 'Передать предмет между этими людьми сейчас нельзя.';
  moveItems(ctx, i => i.type === type, qty, { kind: 'npc', id: from }, { kind: 'npc', id: to });
}
