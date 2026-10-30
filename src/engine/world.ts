// Доступ к состоянию: переменные, инвентарь, связь, среда, журнал, случайность.
import { capabilities, painLevel, type Environment } from './body';
import type { Content, ItemType } from './content-types';
import { unit } from './rng';
import type { CharacterState, GameState, ItemInstance, LogEntry, PlayerId, Scalar } from './types';
import { other } from './types';

export interface Ctx {
  s: GameState;
  c: Content;
  /** Чья временная линия сейчас считается. «$» в ключах = этот игрок. */
  pid: PlayerId;
}

export const me = (ctx: Ctx): CharacterState => ctx.s.chars[ctx.pid];
export const partnerOf = (ctx: Ctx): CharacterState => ctx.s.chars[other(ctx.pid)];

export function resolveKey(ctx: Ctx, key: string): string {
  if (key.startsWith('$.')) return `${ctx.pid}.${key.slice(2)}`;
  if (key.startsWith('@partner.')) return `${other(ctx.pid)}.${key.slice(9)}`;
  return key;
}

export function getVar(ctx: Ctx, key: string): Scalar | undefined {
  return ctx.s.vars[resolveKey(ctx, key)];
}

export function setVar(ctx: Ctx, key: string, value: Scalar) {
  const k = resolveKey(ctx, key);
  if (ctx.s.vars[k] === value) return;
  ctx.s.vars[k] = value;
  ctx.s.varTime[k] = me(ctx).time;
}

export function nextId(ctx: Ctx, prefix: string): string {
  ctx.s.idSeq[ctx.pid] += 1;
  return `${prefix}-${ctx.pid}${ctx.s.idSeq[ctx.pid]}`;
}

/** Детерминированный бросок: свой счётчик у каждого игрока. */
export function roll(ctx: Ctx, label: string): number {
  ctx.s.rng[ctx.pid] += 1;
  return unit(`${ctx.s.seed}:${ctx.pid}:${ctx.s.rng[ctx.pid]}:${label}`);
}

export function log(ctx: Ctx, kind: LogEntry['kind'], text: string, pid: PlayerId = ctx.pid) {
  ctx.s.logSeq[pid] += 1;
  ctx.s.log.push({ seq: ctx.s.logSeq[pid], pid, at: ctx.s.chars[pid].time, kind, text: fmt({ ...ctx, pid }, text) });
}

// ───────────── Текст ─────────────

/**
 * Подстановки: {name}, {partner}, {partner.dat}, {partner.ins}… (падежи вводятся при создании персонажа);
 * {A}, {B.gen}… — имя конкретного игрока (для текстов, которые видят оба: итоги контрольных точек);
 * {m:пошёл|пошла} — по роду текущего игрока, {pm:он|она} — по роду партнёра.
 */
export function fmt(ctx: Ctx, text: string): string {
  const mine = me(ctx).name;
  const theirs = partnerOf(ctx).name;
  return text.replace(/\{(name|partner|A|B)(?:\.(nom|gen|dat|acc|ins|pre))?\}/g, (_m, who: string, form?: string) => {
    const n = who === 'name' ? mine : who === 'partner' ? theirs : ctx.s.chars[who as PlayerId].name;
    return n[(form ?? 'nom') as keyof typeof n];
  }).replace(/\{(m|pm):([^|}]*)\|([^}]*)\}/g, (_m, who: string, male: string, female: string) =>
    ((who === 'm' ? me(ctx) : partnerOf(ctx)).gender === 'm' ? male : female));
}

// ───────────── Предметы ─────────────

export function itemType(ctx: Ctx, type: string): ItemType {
  const t = ctx.c.items[type];
  if (!t) throw new Error(`Неизвестный предмет: ${type}`);
  return t;
}

export function heldItems(ctx: Ctx, pid: PlayerId = ctx.pid): ItemInstance[] {
  return Object.values(ctx.s.items)
    .filter((i) => i.at.kind === 'char' && i.at.id === pid && i.qty > 0)
    .sort((a, b) => (a.id < b.id ? -1 : 1));
}

export function itemsAt(ctx: Ctx, place: string): ItemInstance[] {
  return Object.values(ctx.s.items)
    .filter((i) => i.at.kind === 'place' && i.at.id === place && i.qty > 0)
    .sort((a, b) => (a.id < b.id ? -1 : 1));
}

export function countItem(ctx: Ctx, type: string, pid: PlayerId = ctx.pid): number {
  return heldItems(ctx, pid).filter((i) => i.type === type).reduce((n, i) => n + i.qty, 0);
}

export function countTag(ctx: Ctx, tag: string, pid: PlayerId = ctx.pid): number {
  return heldItems(ctx, pid).filter((i) => itemType(ctx, i.type).tags.includes(tag)).reduce((n, i) => n + i.qty, 0);
}

export function carriedWeight(ctx: Ctx, pid: PlayerId = ctx.pid): number {
  return heldItems(ctx, pid).reduce((g, i) => g + itemType(ctx, i.type).weight * i.qty, 0);
}

/** Комфортная нагрузка: 10 кг + 2,5 кг за единицу силы. Сверх неё растёт усталость. */
export function carryLimit(ctx: Ctx, pid: PlayerId = ctx.pid): number {
  return 10000 + ctx.s.chars[pid].traits.strength * 2500;
}

export function giveItem(ctx: Ctx, type: string, qty: number, opts: { charge?: number; condition?: number; note?: string; fuel?: number } = {}, to: ItemInstance['at'] = { kind: 'char', id: ctx.pid }): ItemInstance {
  const def = itemType(ctx, type);
  const t = me(ctx).time;
  const stackable = !def.battery && !def.vehicle && !def.fuelCan && opts.charge === undefined && !opts.note && (opts.condition ?? 100) === 100;
  if (stackable) {
    const existing = Object.values(ctx.s.items).find((i) => i.type === type && i.charge === undefined && !i.note && i.condition === 100 && i.uses === undefined
      && i.at.kind === to.kind && (i.at as { id?: string }).id === (to as { id?: string }).id && i.qty > 0);
    if (existing) { existing.qty += qty; existing.changedAt = t; return existing; }
  }
  const inst: ItemInstance = {
    id: nextId(ctx, 'it'), type, qty, condition: opts.condition ?? 100,
    charge: opts.charge ?? (def.battery ? 100 : undefined), at: to, changedAt: t, note: opts.note,
    fuel: opts.fuel ?? (def.vehicle || def.fuelCan ? 0 : undefined),
  };
  ctx.s.items[inst.id] = inst;
  return inst;
}

/** Списать предметы. Сначала тратятся самые изношенные/старые. Возвращает, сколько списано. */
export function takeItems(ctx: Ctx, pred: (i: ItemInstance) => boolean, qty: number): number {
  let left = qty;
  const list = heldItems(ctx).filter(pred).sort((a, b) => a.condition - b.condition || (a.id < b.id ? -1 : 1));
  for (const i of list) {
    if (left <= 0) break;
    const n = Math.min(i.qty, left);
    i.qty -= n;
    left -= n;
    i.changedAt = me(ctx).time;
    if (i.qty <= 0) i.at = { kind: 'gone' };
  }
  return qty - left;
}

/** Переместить до `qty` штук (Infinity — все). Возвращает, сколько перемещено. */
export function moveItems(ctx: Ctx, pred: (i: ItemInstance) => boolean, qty: number, from: ItemInstance['at'], to: ItemInstance['at']): number {
  let left = qty;
  let moved = 0;
  const src = Object.values(ctx.s.items)
    .filter((i) => i.qty > 0 && i.at.kind === from.kind && (i.at as { id?: string }).id === (from as { id?: string }).id && pred(i))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  for (const i of src) {
    if (left <= 0) break;
    const n = Math.min(i.qty, left);
    if (n === i.qty) { i.at = to; i.changedAt = me(ctx).time; }
    else {
      i.qty -= n;
      i.changedAt = me(ctx).time;
      const copy: ItemInstance = { ...i, id: nextId(ctx, 'it'), qty: n, at: to, changedAt: me(ctx).time };
      ctx.s.items[copy.id] = copy;
    }
    left -= n;
    moved += n;
  }
  // Не qty - left: при qty = Infinity это NaN.
  return moved;
}

export function phone(ctx: Ctx, pid: PlayerId = ctx.pid): ItemInstance | undefined {
  return heldItems(ctx, pid).find((i) => itemType(ctx, i.type).tags.includes('phone') && i.condition > 0);
}

export function phoneUsable(ctx: Ctx, pid: PlayerId = ctx.pid): boolean {
  const p = phone(ctx, pid);
  return !!p && (p.charge ?? 0) > 0;
}

export function network(ctx: Ctx, pid: PlayerId = ctx.pid) {
  const ch = ctx.s.chars[pid];
  const region = ctx.c.locations[ch.location]?.region ?? 'unknown';
  return ctx.c.network?.(region, ch.time, ctx.s.vars) ?? { voice: true, sms: true, data: true };
}

// ───────────── Среда ─────────────

export function environment(ctx: Ctx): Environment {
  const ch = me(ctx);
  const loc = ctx.c.locations[ch.location];
  const scene = ctx.c.scenes[ch.scene];
  const weather = ctx.c.weather(loc?.region ?? 'hh', ch.time);
  const outdoor = scene?.ambient?.outdoor ?? !(loc?.indoor ?? false);
  const powerOff = loc ? ctx.s.vars[`w.power.${loc.region}`] === 'off' : false;
  const indoorTemp = loc?.power === 'grid' && !powerOff ? 20 : Math.max(weather.tempC + 6, 8);
  const slots = new Map<string, number>();
  for (const i of heldItems(ctx)) {
    const cl = itemType(ctx, i.type).clothing;
    if (cl) slots.set(cl.slot, Math.max(slots.get(cl.slot) ?? 0, cl.warmth * (i.condition / 100)));
  }
  const warmth = [...slots.values()].reduce((a, b) => a + b, 0);
  const env: Environment = {
    tempC: scene?.ambient?.tempC ?? (outdoor ? weather.tempC - weather.wind * 0.15 : indoorTemp),
    wet: scene?.ambient?.wet ?? (outdoor && weather.rain),
    outdoor,
    warmth,
  };
  // Надета одна вещь на слот — самая тёплая (остальное лежит в рюкзаке: не греет и не мокнет).
  // Дождевик — поверх всего: защищает от дождя; мусорные мешки — хуже. Мокрая одежда сохнет и под крышей.
  let shield = 0;
  for (const i of heldItems(ctx)) {
    const t = itemType(ctx, i.type);
    if (t.tags.includes('waterproof')) shield = Math.max(shield, t.clothing ? 0.85 : 0.5);
  }
  env.rain = env.wet ? 1 - shield : 0;
  env.dryPerHour = outdoor ? 0.15 : env.tempC >= 18 ? 0.5 : 0.2;
  return env;
}

export function caps(ctx: Ctx, pid: PlayerId = ctx.pid) {
  const ch = ctx.s.chars[pid];
  return capabilities(ch.body, ch.traits, ch.time);
}

export function pain(ctx: Ctx, pid: PlayerId = ctx.pid) {
  const ch = ctx.s.chars[pid];
  return painLevel(ch.body, ch.time);
}
