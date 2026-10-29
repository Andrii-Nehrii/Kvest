// Жизнь после бегства: транспорт и топливо, долгие работы (ремонт, укрепление),
// убежище с общим складом и ежедневным расходом еды, воды и дров.
import { evalCond } from './conditions';
import type { BaseDef } from './content-types';
import { round, unit } from './rng';
import { hourOfDay } from './time';
import type { ItemInstance, Minutes, PlayerId } from './types';
import { PLAYERS } from './types';
import { checkChance } from './checks';
import { itemType, log, me, moveItems, roll, type Ctx } from './world';

// ───────────── Транспорт ─────────────

/** Машина рядом с игроком (на его текущем месте). */
export function vehicleHere(ctx: Ctx, type: string): ItemInstance | undefined {
  const loc = me(ctx).location;
  return Object.values(ctx.s.items).find((i) => i.type === type && i.qty > 0 && i.at.kind === 'place' && i.at.id === loc);
}

export function fuelNeeded(ctx: Ctx, type: string, km: number, jam = 1): number {
  const v = itemType(ctx, type).vehicle;
  if (!v) throw new Error(`${type} — не транспорт`);
  return round((km * v.per100km / 100) * jam, 2);
}

export function canDrive(ctx: Ctx, type: string, km: number, jam = 1): boolean {
  const car = vehicleHere(ctx, type);
  return !!car && car.condition > 0 && (car.fuel ?? 0) >= fuelNeeded(ctx, type, km, jam);
}

/** Поездка: тратит топливо и переставляет машину. Время поездки задаёт само действие. */
export function drive(ctx: Ctx, type: string, km: number, to: string | undefined, jam = 1): string | undefined {
  const car = vehicleHere(ctx, type);
  if (!car) return 'Машины здесь нет.';
  if (car.condition <= 0) return 'Машина не заводится.';
  const need = fuelNeeded(ctx, type, km, jam);
  const have = car.fuel ?? 0;
  if (have < need) {
    car.fuel = 0;
    car.changedAt = me(ctx).time;
    return `Двигатель кашляет и глохнет: топливо кончилось примерно через ${Math.floor(km * have / need)} км.`;
  }
  car.fuel = round(have - need, 2);
  if (to) { car.at = { kind: 'place', id: to }; me(ctx).location = to; }
  car.changedAt = me(ctx).time;
  return undefined;
}

/** Заправка из канистры (или с колонки, если канистра не указана). Не тот вид топлива губит двигатель. */
export function refuel(ctx: Ctx, type: string, liters: number, fromCan?: string): string {
  const car = vehicleHere(ctx, type);
  if (!car) return 'Машины здесь нет.';
  const v = itemType(ctx, type).vehicle!;
  const room = round(v.tankL - (car.fuel ?? 0), 2);
  let amount = Math.min(liters, room);
  if (fromCan) {
    const can = Object.values(ctx.s.items).find((i) => i.type === fromCan && i.qty > 0 && (i.fuel ?? 0) > 0
      && ((i.at.kind === 'char' && i.at.id === ctx.pid) || (i.at.kind === 'place' && i.at.id === me(ctx).location)));
    if (!can) return 'Канистры с топливом рядом нет.';
    const fuelType = itemType(ctx, can.type).fuelCan?.fuel;
    amount = Math.min(amount, can.fuel ?? 0);
    can.fuel = round((can.fuel ?? 0) - amount, 2);
    can.changedAt = me(ctx).time;
    if (fuelType && fuelType !== v.fuel) {
      car.condition = Math.max(0, car.condition - 70);
      car.fuel = round((car.fuel ?? 0) + amount, 2);
      car.note = 'не то топливо в баке';
      return `Залито ${amount} л — но это ${fuelType === 'diesel' ? 'дизель' : 'бензин'}, а машине нужен другой.`;
    }
  }
  car.fuel = round((car.fuel ?? 0) + amount, 2);
  car.changedAt = me(ctx).time;
  return `Залито ${amount} л, в баке ${car.fuel} л.`;
}

export function fillCan(ctx: Ctx, canType: string, liters: number): string {
  const can = Object.values(ctx.s.items).find((i) => i.type === canType && i.qty > 0
    && ((i.at.kind === 'char' && i.at.id === ctx.pid) || (i.at.kind === 'place' && i.at.id === me(ctx).location)));
  if (!can) return 'Канистры нет.';
  const cap = itemType(ctx, canType).fuelCan?.capacityL ?? 0;
  const amount = Math.min(liters, round(cap - (can.fuel ?? 0), 2));
  can.fuel = round((can.fuel ?? 0) + amount, 2);
  can.changedAt = me(ctx).time;
  return `В канистре ${can.fuel} л.`;
}

// ───────────── Долгие работы ─────────────

export function projectProgress(ctx: Ctx, id: string): number {
  return Number(ctx.s.vars[`proj.${id}.progress`] ?? 0);
}

export function projectDone(ctx: Ctx, id: string): boolean {
  return ctx.s.vars[`proj.${id}.done`] === true;
}

function available(ctx: Ctx, type: string): number {
  const loc = me(ctx).location;
  return Object.values(ctx.s.items)
    .filter((i) => i.type === type && i.qty > 0 && ((i.at.kind === 'char' && i.at.id === ctx.pid) || (i.at.kind === 'place' && i.at.id === loc)))
    .reduce((n, i) => n + i.qty, 0);
}

/**
 * Поработать над проектом N часов. Каждый час — проверка навыка: удачный час идёт в зачёт целиком,
 * неудачный — наполовину (ошибки, переделки). Возвращает фразу для журнала.
 */
export function workOnProject(ctx: Ctx, id: string, hours: number): { text: string; minutes: number } {
  const def = ctx.c.projects?.[id];
  if (!def) throw new Error(`Неизвестный проект ${id}`);
  if (projectDone(ctx, id)) return { text: `«${def.name}» уже готово.`, minutes: 0 };
  if (def.at && !def.at.includes(me(ctx).location)) return { text: `Для «${def.name}» нужно быть на месте работ.`, minutes: 0 };
  const startedKey = `proj.${id}.started`;
  for (const n of def.needs ?? []) {
    const already = n.consumed && ctx.s.vars[startedKey];
    if (!already && available(ctx, n.type) < n.qty) {
      return { text: `Для «${def.name}» не хватает: ${itemType(ctx, n.type).name} (нужно ${n.qty}).`, minutes: 0 };
    }
  }
  if (!ctx.s.vars[startedKey]) {
    for (const n of def.needs ?? []) {
      if (!n.consumed) continue;
      const loc = me(ctx).location;
      let left = n.qty;
      left -= moveItems(ctx, (i) => i.type === n.type, left, { kind: 'char', id: ctx.pid }, { kind: 'gone' });
      if (left > 0) moveItems(ctx, (i) => i.type === n.type, left, { kind: 'place', id: loc }, { kind: 'gone' });
    }
    ctx.s.vars[startedKey] = true;
  }
  let gained = 0;
  const whole = Math.max(1, Math.round(hours));
  const p = checkChance(ctx, { traits: def.traits, difficulty: def.difficulty, uses: ['focus', 'strength'] });
  for (let h = 0; h < whole; h++) gained += roll(ctx, `proj:${id}:${h}`) < p ? 1 : 0.5;
  const total = round(projectProgress(ctx, id) + gained, 2);
  ctx.s.vars[`proj.${id}.progress`] = total;
  ctx.s.varTime[`proj.${id}.progress`] = me(ctx).time;
  if (total >= def.hours) {
    ctx.s.vars[`proj.${id}.done`] = true;
    ctx.s.varTime[`proj.${id}.done`] = me(ctx).time;
    return { text: `«${def.name}» — готово.`, minutes: whole * 60 };
  }
  const pct = Math.min(99, Math.floor(total / def.hours * 100));
  return { text: `«${def.name}»: сделано примерно ${pct} %.`, minutes: whole * 60 };
}

// ───────────── Склад базы ─────────────

export function stockAt(ctx: Ctx, place: string, type: string): number {
  return Object.values(ctx.s.items).filter((i) => i.type === type && i.qty > 0 && i.at.kind === 'place' && i.at.id === place).reduce((n, i) => n + i.qty, 0);
}

export function baseOf(ctx: Ctx, location: string): BaseDef | undefined {
  return ctx.c.bases?.find((b) => b.places.includes(location));
}

function takeFromPlace(ctx: Ctx, place: string, pred: (i: ItemInstance) => boolean, amount: number, unitsOf: (i: ItemInstance) => number): number {
  // Сначала скоропортящееся, затем по id — детерминированно.
  const list = Object.values(ctx.s.items)
    .filter((i) => i.qty > 0 && i.at.kind === 'place' && i.at.id === place && pred(i))
    .sort((a, b) => (itemType(ctx, b.type).spoilsAfter ? 1 : 0) - (itemType(ctx, a.type).spoilsAfter ? 1 : 0) || (a.id < b.id ? -1 : 1));
  let left = amount;
  for (const i of list) {
    if (left <= 0) break;
    const per = unitsOf(i);
    if (per <= 0) continue;
    const n = Math.min(i.qty, Math.ceil(left / per - 1e-9));
    i.qty -= n;
    left -= n * per;
    i.changedAt = me(ctx).time;
    if (i.qty <= 0) i.at = { kind: 'gone' };
  }
  return Math.max(0, left);
}

/**
 * Кто «держит время» базы в этом участке: игрок, бывший на базе в начале участка
 * (seg.loc.* фиксируются на контрольной точке и одинаковы на обоих телефонах).
 * Если оба — выбирает хэш дня, без приоритета игрока. Если никто — расход посчитается на КТ.
 */
export function baseKeeper(ctx: Ctx, b: BaseDef, day: number): PlayerId | undefined {
  const here = PLAYERS.filter((p) => b.places.includes(String(ctx.s.vars[`seg.loc.${p}`] ?? '')));
  if (here.length <= 1) return here[0];
  return unit(`${ctx.s.seed}:keeper:${b.id}:${day}`) < 0.5 ? 'A' : 'B';
}

const dayOf = (t: Minutes) => Math.floor((t - 6 * 60) / 1440);

/** Суточный расход базы за день `day` (06:00). Идемпотентно: base.<id>.lastDay. */
export function baseDailyTick(ctx: Ctx, b: BaseDef, day: number) {
  const lastKey = `base.${b.id}.lastDay`;
  if (Number(ctx.s.vars[lastKey] ?? -1) >= day) return;
  ctx.s.vars[lastKey] = day;
  ctx.s.varTime[lastKey] = me(ctx).time;
  const npcs = Object.values(ctx.s.npcs).filter((n) => n.alive && b.places.includes(n.location));
  const players = PLAYERS.filter((p) => ctx.s.chars[p].body.consciousness !== 'dead' && b.places.includes(ctx.s.chars[p].location));
  const people = npcs.length + players.length;
  if (people === 0) return;
  const notes: string[] = [];
  const water = ctx.c.bases && b.freeWater && evalCond(ctx, b.freeWater) ? 0 : b.waterPerPerson * people;
  const waterShort = water > 0 ? takeFromPlace(ctx, b.stock, (i) => itemType(ctx, i.type).tags.includes('water_bulk'), water, () => 1) : 0;
  const kcalShort = takeFromPlace(ctx, b.stock, (i) => (itemType(ctx, i.type).food?.kcal ?? 0) > 0 && itemType(ctx, i.type).tags.includes('staple'), b.kcalPerPerson * people, (i) => itemType(ctx, i.type).food!.kcal!);
  if (waterShort > 0) notes.push(`Воды на всех не хватило: недостаёт около ${Math.ceil(waterShort)} л.`);
  if (kcalShort > 0) notes.push(`Еды на всех не хватило: пайки урезаны примерно на ${Math.round(kcalShort / (b.kcalPerPerson * people) * 100)} %.`);
  const shortKey = `base.${b.id}.shortDays`;
  ctx.s.vars[shortKey] = waterShort > 0 || kcalShort > 0 ? Number(ctx.s.vars[shortKey] ?? 0) + 1 : 0;
  if (b.heating) {
    const t = ctx.c.weather(ctx.c.locations[b.places[0]]?.region ?? 'hh', me(ctx).time).tempC;
    const need = b.heating.perDay(t);
    const heatShort = need > 0 ? takeFromPlace(ctx, b.stock, (i) => itemType(ctx, i.type).tags.includes(b.heating!.tag), need, () => 1) : 0;
    ctx.s.vars[`base.${b.id}.cold`] = heatShort > need * 0.5;
    if (heatShort > 0) notes.push('Топлива для печи мало — в доме холодно.');
  }
  for (const p of players) for (const n of notes) log({ ...ctx, pid: p }, 'item', n);
}

/** Пересечение 06:00 на линии игрока-«хранителя» базы. */
export function baseTicksDuring(ctx: Ctx, from: Minutes, to: Minutes) {
  if (!ctx.c.bases?.length) return;
  for (let d = dayOf(from) + 1; d <= dayOf(to); d++) {
    for (const b of ctx.c.bases) if (baseKeeper(ctx, b, d) === ctx.pid) baseDailyTick(ctx, b, d);
  }
}

/** На контрольной точке досчитать дни, которые не посчитал ни один участок. */
export function baseCatchUp(ctx: Ctx, to: Minutes) {
  for (const b of ctx.c.bases ?? []) {
    const last = Number(ctx.s.vars[`base.${b.id}.lastDay`] ?? dayOf(to) - 1);
    for (let d = last + 1; d <= dayOf(to); d++) baseDailyTick(ctx, b, d);
  }
}

/** Отметить, кто где был в начале участка (для хранителя базы). */
export function markSegmentStart(s: Ctx['s']) {
  for (const p of PLAYERS) s.vars[`seg.loc.${p}`] = s.chars[p].location;
}

export function isNight(t: Minutes): boolean {
  const h = hourOfDay(t);
  return h < 6 || h >= 22;
}

