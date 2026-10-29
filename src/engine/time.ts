// Игровое время: минуты от 00:00 вторника 10.11.2026 (Гамбург, CET = UTC+1).
import type { Minutes } from './types';

export const EPOCH_UTC = Date.UTC(2026, 10, 9, 23, 0); // 10.11.2026 00:00 CET
const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export const at = (day: number, hh: number, mm = 0): Minutes => (day - 10) * 1440 + hh * 60 + mm;

function parts(t: Minutes) {
  // В ноябре–марте перехода на летнее время нет: CET фиксированный.
  const d = new Date(EPOCH_UTC + t * 60000 + 3600000);
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth(), day: d.getUTCDate(), wd: d.getUTCDay(), h: d.getUTCHours(), mi: d.getUTCMinutes() };
}

export function clock(t: Minutes): string {
  const p = parts(t);
  return `${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}

export function dateLabel(t: Minutes): string {
  const p = parts(t);
  return `${WEEKDAYS[p.wd]}, ${p.day} ${MONTHS[p.mo]}`;
}

/** Коротко для шапки: «вт, 10.11». */
export function shortDateLabel(t: Minutes): string {
  const p = parts(t);
  return `${['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][p.wd]}, ${String(p.day).padStart(2, '0')}.${String(p.mo + 1).padStart(2, '0')}`;
}

export function hourOfDay(t: Minutes): number {
  const p = parts(t);
  return p.h + p.mi / 60;
}

/**
 * Светлое время в Гамбурге (≈53.5° с. ш.). Восход/закат для ноября–декабря по
 * таблицам: 10.11 — 07:41/16:27, 30.11 — 08:16/16:02. Линейная интерполяция.
 */
export function daylight(t: Minutes): { sunrise: number; sunset: number; isDay: boolean } {
  const p = parts(t);
  const dayOfSeason = p.mo === 10 ? p.day : p.mo === 11 ? 30 + p.day : 10;
  const k = Math.min(Math.max((dayOfSeason - 10) / 20, 0), 1.6);
  const sunrise = 7 + 41 / 60 + k * (35 / 60);
  const sunset = 16 + 27 / 60 - k * (25 / 60);
  const h = hourOfDay(t);
  return { sunrise, sunset, isDay: h >= sunrise - 0.4 && h <= sunset + 0.4 };
}

export function durationLabel(min: number): string {
  if (min < 60) return `${Math.round(min)} мин`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}
