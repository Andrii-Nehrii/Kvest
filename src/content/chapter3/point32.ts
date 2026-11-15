import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14 } from './point14';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';

// Участок 32: среда 2.12, 06:00 → КТ32 четверг 3.12, 18:00. КЛЮЧЕВАЯ по устройству: порознь на всю точку. План — STOCK_PLAN.md §9.
// A — Бухгольц с братьями Айдын (мастерская, свой подъезд и Герд, Брокманы, больница, ночь в мастерской).
// B — Винзен (школа, Красный Крест, Окафор и жильцы дома в Бармбеке, Нина, ночь у фрау Витхён).
// Линии не видят друг друга; обе возвращаются к шести вечера четверга. Где оба могли бы пересечься (пункт в Йестебурге) — разные часы и люди.
export const P32: Cond = all({ cp: 31 }, not({ cp: 32 }));
export const A32: Cond = { me: 'A' };
export const B32: Cond = { me: 'B' };
export const farm32 = 'hof_luedemann';
export const jest32 = 'c16_jesteburg';
export const winsen32 = 'c15_winsen';
export const ws32 = 'deniz_workshop';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point32Available: Cond = all(P32, { at: farm32 }, { partnerAt: farm32 }, up, { partner: 'active' }, flag('w.c31_a'), flag('w.c31_b'));
export const own32 = (key: string, value: string): Cond => v(`$.c32_${key}`, value);

export const deniz32: Cond = { npc: 'deniz', alive: true };
export const kerem32: Cond = { npc: 'kerem', alive: true };
/** Герд всё ещё на лестнице своего подъезда — обращённый (с первого дня). */
export const gerdStairs: Cond = all({ npc: 'gerd', alive: true, at: 'a_stairs' });
/** Окафор остался в первый день дома (не ушёл на смену) — значит, он с жильцами. */
export const okaforHere32: Cond = all({ npc: 'okafor', alive: true }, flag('w.okafor_stays'));
export const ninaGoes32: Cond = ninaFarm;
export const ninaWinsen32: Cond = all({ npc: 'c7_nina', alive: true }, not(ninaFarm));
export const volunteerA: Cond = v('w.c31_a', 'yes');
export const volunteerB: Cond = v('w.c31_b', 'yes');
export const mapA: Cond = { has: 'c31_post_map' };
export const mailbag32: Cond = flag('w.c19_mailbag');
export const pKnown32: Cond = any(flag('w.c20_p_known'), flag('w.c18_ilse_listed'));

export const frost32 = { tempC: -3, outdoor: true, wet: false };
export const cold32 = { tempC: 10, outdoor: false, wet: false };
export const truck32 = { tempC: 8, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm32, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S32 = wrap(P32);
export const set32 = (key: string, value: string | boolean): Effect => ({ set: `$.c32_${key}`, value });
export const w32 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c32_${key}`, value });
/** День 32 — среда 2.12, день 33 — четверг 3.12. */
export const until32 = (d: 32 | 33, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare32: Effect = { camp: { kind: 'prepare', quiet: true } };
/** Поели в дороге или у чужих: сытость без общего стола хутора. */
export const fed32 = (n = 25): Effect[] => [{ body: 'hunger', delta: -n }, { body: 'thirst', delta: -20 }];
export const finish32: Effect = { set: '$.c32_finished', value: true };

export const shared32: Scene[] = [
  S32({ id: 'c32_checkpoint', for: 'any', chapter: 'ch3', title: 'Четверг, шесть вечера', checkpoint: 32, universal: false, camp: house14,
    text: [
      { text: 'Шесть вечера. У ворот хутора двое суток сходятся в одну кухню. Каждый привёз своё: людей, вещи, новости. Теперь — что с ними делать.' },
    ], actions: [] }),
];
