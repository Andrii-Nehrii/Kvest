// Места, погода и связь беты. Места реальные; точные адреса игроков не используются.
import type { LocationDef } from '../engine/content-types';
import { unit } from '../engine/rng';
import { at, hourOfDay } from '../engine/time';
import type { Minutes, Scalar } from '../engine/types';

const L = (l: LocationDef) => l;

export const locations: Record<string, LocationDef> = Object.fromEntries([
  // Линия A — Buchholz in der Nordheide
  L({ id: 'a_flat', name: 'Твоя квартира, Buchholz', region: 'buchholz', indoor: true, power: 'grid', water: true, safe: true, description: 'Двушка на втором этаже трёхэтажного дома из красного кирпича.' }),
  L({ id: 'a_stairs', name: 'Лестница подъезда', region: 'buchholz', indoor: true, description: 'Бетонные ступени, почтовые ящики, запах мокрых курток.' }),
  L({ id: 'a_brockmann', name: 'Квартира Брокманов', region: 'buchholz', indoor: true, power: 'grid', water: true, description: 'Первый этаж. Ковры, фотографии внуков, часы с маятником.' }),
  L({ id: 'a_yard', name: 'Двор и парковка', region: 'buchholz', indoor: false, description: 'Шесть машин, мусорные баки, мокрый газон.' }),
  L({ id: 'a_street', name: 'Улица у дома', region: 'buchholz', indoor: false, media: ['people'] }),
  L({ id: 'deniz_workshop', name: 'Автомастерская Айдына', region: 'buchholz', indoor: true, power: 'grid', description: 'Бокс на две машины в промзоне на краю города.' }),
  L({ id: 'hof_luedemann', name: 'Хутор Людеманов', region: 'lk', indoor: false, description: 'Ферма в полях под Jesteburg.' }),
  L({ id: 'a_house7', name: 'Седьмой дом, подъезд', region: 'buchholz', indoor: true, description: 'Соседний дом, такой же красный кирпич.' }),
  L({ id: 'a_hospital', name: 'Krankenhaus Buchholz', region: 'buchholz', indoor: false, media: ['people'], description: 'Больница на окраине: корпуса, парковка, приёмное отделение, свой генератор.' }),
  L({ id: 'a_market', name: 'Супермаркет у развязки', region: 'buchholz', indoor: true, power: 'grid', media: ['people'] }),
  L({ id: 'a_gas', name: 'Заправка у выезда на трассу', region: 'buchholz', indoor: false, media: ['people'] }),
  L({ id: 'a_road', name: 'Трасса A1 / A7', region: 'lk', indoor: true, description: 'В машине на трассе.' }),
  L({ id: 'harburg', name: 'Harburg', region: 'harburg', indoor: false, media: ['people'], description: 'Южный район Гамбурга по эту сторону Эльбы.' }),
  L({ id: 'harburg_station', name: 'Вокзал Harburg', region: 'harburg', indoor: false, media: ['people'] }),
  L({ id: 'harburg_kerem', name: 'Квартира Керема у вокзала Harburg', region: 'harburg', indoor: true, power: 'grid', water: true }),
  L({ id: 'a7_jam', name: 'A7 перед тоннелем', region: 'harburg', indoor: true, description: 'В машине в пробке.' }),
  L({ id: 'a1_station', name: 'Заправка у съезда Harburg-Süd', region: 'harburg', indoor: false, media: ['people'] }),
  L({ id: 'elbtunnel', name: 'Elbtunnel (A7)', region: 'hh', indoor: true }),
  L({ id: 'hh_city', name: 'Гамбург, Bahrenfeld — Eimsbüttel', region: 'hh', indoor: true, description: 'В машине, в городе.' }),
  L({ id: 'hh_eppendorf', name: 'Гамбург, Eppendorf', region: 'hh', indoor: true, description: 'В машине, в двух кварталах от UKE.' }),
  L({ id: 'hh_ring3', name: 'Гамбург, Ring 3', region: 'hh', indoor: true, description: 'В машине на кольцевой.' }),
  // Линия B — Hamburg-Barmbek
  L({ id: 'b_flat', name: 'Квартира (WG), Barmbek', region: 'hh', indoor: true, power: 'grid', water: true, safe: true, media: ['radio'], description: 'Четвёртый этаж старого дома: высокие потолки, скрипучий паркет, окна во двор и на улицу.' }),
  L({ id: 'b_stairs', name: 'Лестничная площадка', region: 'hh', indoor: true, description: 'Две двери на площадке, деревянные перила, лампа на таймере.' }),
  L({ id: 'b_okafor', name: 'Квартира Окафора', region: 'hh', indoor: true, power: 'grid', water: true }),
  L({ id: 'b_yard', name: 'Задний двор', region: 'hh', indoor: false, description: 'Велопарковка, контейнеры, каштан.' }),
  L({ id: 'b_street', name: 'Улица у дома', region: 'hh', indoor: false, media: ['people'] }),
  L({ id: 'b_nowak', name: 'Квартира Новаков', region: 'hh', indoor: true, power: 'grid', water: true }),
  L({ id: 'b_kiosk', name: 'Киоск на углу', region: 'hh', indoor: false, media: ['people', 'tv'] }),
  L({ id: 'b_market', name: 'Супермаркет у Hamburger Straße', region: 'hh', indoor: true, power: 'grid', media: ['people'] }),
  L({ id: 'b_pharmacy', name: 'Аптека у вокзала Barmbek', region: 'hh', indoor: true, power: 'grid', media: ['people'] }),
  L({ id: 'b_station', name: 'Вокзал Barmbek', region: 'hh', indoor: false, media: ['people'] }),
  L({ id: 'b_van', name: 'Фургон Новаков', region: 'hh', indoor: true }),
  L({ id: 'ahrensburg', name: 'Дом родителей Мерле, Ahrensburg', region: 'stormarn', indoor: true, power: 'grid', water: true, safe: true, media: ['radio'] }),
  L({ id: 'hh_alster', name: 'Гамбург, вдоль Alster', region: 'hh', indoor: false }),
  L({ id: 'hh_neustadt', name: 'Гамбург, Neustadt', region: 'hh', indoor: false }),
  L({ id: 'hh_landungsbruecken', name: 'Landungsbrücken', region: 'hh', indoor: false }),
  L({ id: 'old_elbtunnel', name: 'Старый Эльбский тоннель', region: 'hh', indoor: true }),
  L({ id: 'steinwerder', name: 'Порт, Steinwerder', region: 'hh', indoor: false }),
  L({ id: 'wilhelmsburg', name: 'Wilhelmsburg', region: 'hh', indoor: false }),
  L({ id: 'wilhelmsburg_stairs', name: 'Чужой подъезд в Wilhelmsburg', region: 'hh', indoor: true }),
  L({ id: 'b75_road', name: 'Дорога Harburg — Buchholz', region: 'lk', indoor: false }),
].map((l) => [l.id, l]));

// ───────────── Погода ─────────────

/** Ноябрь в Гамбурге: 10.11 — дождь и туман, +6…+8; 11.11 — сухо и холоднее; дальше — по сиду. */
export function weather(region: string, t: Minutes) {
  const day = Math.floor(t / 1440);
  const h = hourOfDay(t);
  const diurnal = Math.cos(((h - 14.5) / 24) * 2 * Math.PI); // макс. ~14:30
  const base = [7.2, 3.8, 4.5, 2.0, 5.5][day] ?? 4 + 4 * (unit(`wx:${day}`) - 0.5);
  const amp = [1.0, 2.6, 2.2, 3.0, 2.0][day] ?? 2.5;
  const rural = region === 'buchholz' || region === 'lk' ? -0.6 : 0;
  const tempC = Math.round((base + amp * diurnal + rural) * 10) / 10;
  const slot = Math.floor(t / 180);
  const rainChance = day === 0 ? (h < 13 ? 0.95 : 0.6) : day === 1 ? 0.1 : 0.4;
  const rain = unit(`rain:${region}:${slot}`) < rainChance;
  const wind = Math.round(10 + 14 * unit(`wind:${day}:${Math.floor(h / 6)}`));
  return { tempC, rain, wind };
}

// ───────────── Связь ─────────────

function chance(points: [Minutes, number][], t: Minutes): number {
  let p = points[0][1];
  for (const [from, v] of points) if (t >= from) p = v;
  return p;
}

/**
 * Мобильная связь объективна и одинакова на обоих телефонах: зависит от региона, времени,
 * тока (вышки на аккумуляторах) и событий мира. «Нестабильность» — по 10-минутным окнам.
 */
export function network(region: string, t: Minutes, vars: Record<string, Scalar>) {
  if (vars[`w.net.${region}`] === 'down') return { voice: false, sms: false, data: false };
  const slot = Math.floor(t / 10);
  const towerOnBattery = vars[`w.power.${region}`] === 'off';
  const outageSince = Number(vars[`w.power.${region}.since`] ?? t);
  if (towerOnBattery && t - outageSince > 5 * 60) return { voice: false, sms: false, data: false };
  const voiceP = chance([[0, 0.95], [at(10, 3, 50), 0.55], [at(10, 9, 0), 0.35], [at(10, 12, 20), 0.85], [at(10, 13, 10), 0.2], [at(10, 15, 0), 0.05]], t);
  const smsP = chance([[0, 0.98], [at(10, 3, 50), 0.9], [at(10, 15, 0), 0.6], [at(10, 21, 0), 0.35]], t);
  const dataP = chance([[0, 0.95], [at(10, 3, 50), 0.5], [at(10, 9, 0), 0.25], [at(10, 15, 0), 0.06]], t);
  const k = towerOnBattery ? 0.6 : 1;
  return {
    voice: unit(`net:v:${region}:${slot}`) < voiceP * k,
    sms: unit(`net:s:${region}:${slot}`) < smsP * k,
    data: unit(`net:d:${region}:${slot}`) < dataP * k,
  };
}
