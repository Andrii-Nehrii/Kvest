import { canAct, isDead, LIFELINE_FROM } from './body';
import { canDrive, chargeForTrip, drive, fuelNeeded } from './base';
import { advanceTime } from './simulate';
import { other, PLAYERS } from './types';
import { caps, heldItems, log, me, type Ctx } from './world';

/** До начала дороги проверяем всю группу: при ошибке не перемещаем ни вещи, ни людей. */
export function journey(ctx: Ctx, trip: { to: string; km: number; minutes: number; vehicle?: string }): string | undefined {
  if (ctx.s.checkpoint < 6) return 'Эта дорога ещё не доступна.';
  if (!ctx.c.locations[trip.to] || !Number.isFinite(trip.km) || trip.km <= 0 || !Number.isFinite(trip.minutes) || trip.minutes <= 0)
    return 'Маршрут не задан.';
  const origin = me(ctx).location;
  if (!ctx.s.vars['w.together'] || PLAYERS.some(p => ctx.s.chars[p].location !== origin || !canAct(ctx.s.chars[p].body)))
    return 'Для общего выхода нужно находиться вместе и быть в состоянии двигаться.';
  if (ctx.s.chars.A.time !== ctx.s.chars.B.time) return 'Перед общей дорогой нужно сверить часы.';
  if (trip.vehicle && (!heldItems(ctx).some(i => i.type === 'car_keys') || !canDrive(ctx, trip.vehicle, trip.km)))
    return 'Нужны ключи, исправная машина рядом и топливо на дорогу.';
  const duration = trip.vehicle ? trip.minutes : Math.round(trip.minutes / Math.max(0.2,
    Math.min(...PLAYERS.map(pid => caps({ ...ctx, pid }).mobility))));
  const fuel = trip.vehicle ? fuelNeeded(ctx, trip.vehicle, trip.km) : 0;
  if (trip.vehicle) {
    const problem = drive(ctx, trip.vehicle, trip.km, trip.to);
    if (problem) return problem;
    for (const pid of PLAYERS) if (pid !== ctx.pid) chargeForTrip({ ...ctx, pid }, trip.km);
  }
  for (const pid of PLAYERS) {
    const sub = { ...ctx, pid, ambientOverride: trip.vehicle ? { tempC: 12, outdoor: false, wet: false } : { outdoor: true } };
    ctx.s.chars[pid].location = trip.to;
    advanceTime(sub, duration, trip.vehicle ? 'light' : 'moderate');
    log(sub, 'item', trip.vehicle ? `Общая поездка: ${trip.km} км, ${duration} мин; потрачено ${fuel} л топлива на машину.`
      : `Пешком вместе: ${trip.km} км, ${duration} мин в темпе того, кому труднее идти.`);
  }
  return undefined;
}

/**
 * С участка 19: донести или довезти партнёра без сознания. Он должен быть рядом и вестись этой линией (выбыл раньше).
 * На машине — как обычная поездка (ключи, топливо, время). Пешком — только недалеко (до 3 км) и тяжело: время растёт
 * от силы несущего и его подвижности; с помощью (носилки, тачка, второй человек) — заметно легче.
 * Тело партнёра живёт по пути вместе с часами несущего (страховка жизни действует, пока несущий на ногах).
 */
export function carryPartner(ctx: Ctx, trip: { to: string; km: number; minutes: number; vehicle?: string; helped?: boolean }): string | undefined {
  if (ctx.s.checkpoint < LIFELINE_FROM) return 'Так сейчас нельзя.';
  if (!ctx.c.locations[trip.to] || !Number.isFinite(trip.km) || trip.km <= 0 || !Number.isFinite(trip.minutes) || trip.minutes <= 0)
    return 'Маршрут не задан.';
  const ch = me(ctx), pid = other(ctx.pid), p = ctx.s.chars[pid];
  if (!canAct(ch.body)) return 'Сначала нужно самому стоять на ногах.';
  if (isDead(p.body) || canAct(p.body) || p.body.consciousness === 'asleep' || p.controlledBy !== ctx.pid || p.location !== ch.location)
    return 'Рядом нет того, кого нужно нести.';
  if (!trip.vehicle && trip.km > 3 && !trip.helped) return 'Так далеко на себе не донести.';
  if (trip.vehicle && (!heldItems(ctx).some(i => i.type === 'car_keys') || !canDrive(ctx, trip.vehicle, trip.km)))
    return 'Нужны ключи, исправная машина рядом и топливо на дорогу.';
  const load = trip.helped ? 1.5 : Math.min(3.5, Math.max(1.5, 3.5 - ch.traits.strength * 0.5));
  const duration = trip.vehicle ? trip.minutes : Math.round(trip.minutes * load / Math.max(0.2, caps(ctx).mobility));
  const fuel = trip.vehicle ? fuelNeeded(ctx, trip.vehicle, trip.km) : 0;
  if (trip.vehicle) {
    const problem = drive(ctx, trip.vehicle, trip.km, trip.to);
    if (problem) return problem;
  }
  ch.location = trip.to;
  p.location = trip.to;
  advanceTime({ ...ctx, ambientOverride: trip.vehicle ? { tempC: 12, outdoor: false, wet: false } : { outdoor: true } }, duration, trip.vehicle ? 'light' : 'heavy');
  log(ctx, 'item', trip.vehicle ? `Дорога с {partner.ins} без сознания: ${trip.km} км, ${duration} мин; потрачено ${fuel} л топлива.`
    : `{partner} на руках: ${trip.km} км, ${duration} мин.`);
  return undefined;
}
