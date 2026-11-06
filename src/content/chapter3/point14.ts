import type { NpcDef, Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

// Участки 14 и 15: после КТ13 (15.11, до полудня) до КТ15 (16.11, после полудня).
export const P14: Cond = all({ cp: 13 }, not({ cp: 14 }));
export const P15: Cond = all({ cp: 14 }, not({ cp: 15 }));
export const A14: Cond = { me: 'A' };
export const B14: Cond = { me: 'B' };
const kept: Cond = { v: 'w.c9_jens', op: '==', value: 'kept' };
const together: Cond[] = [flag('w.together'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, { partner: 'active' },
  { cap: 'canAct', op: '>=', value: 1 }, { npc: 'c7_nina', alive: true, at: 'hof_luedemann' }];
// У настоящей пары после КТ11 (report) хозяева уезжают с врачом, а Йенс остаётся в кабине. Прочие ветки — экран продолжения.
export const point14Available: Cond = all(P14, kept, flag('w.c13_hosts_gone'), flag('w.c13_road'), ...together);
export const point15Available: Cond = all(P15, flag('w.c14_jens'), flag('A.c14_finished'), flag('B.c14_finished'), ...together);

export const leo14: Cond = { v: 'w.c13_leo', op: '==', value: 'farm' };
export const road14 = (v: string): Cond => ({ v: 'w.c13_road', op: '==', value: v });
export const leoWent14 = (v: string): Cond => ({ v: 'w.c13_leo', op: '==', value: v });
/** Что A сказал солдату про фургон в точке 13 (видно обеим линиям после КТ13). */
export const soldier14 = (v: string): Cond => ({ v: 'A.c13_as', op: '==', value: v });
export const jens15 = (v: string): Cond => ({ v: 'w.c14_jens', op: '==', value: v });
export const nina15 = (v: string): Cond => ({ v: 'w.c14_nina', op: '==', value: v });
export const own14 = (key: string, value: string): Cond => ({ v: `$.c14_${key}`, op: '==', value });
export const own15 = (key: string, value: string): Cond => ({ v: `$.c15_${key}`, op: '==', value });

export const kitchen14: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'brief' };
export const yard14: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief', well: true, car: 'opel_corsa' };
export const house14: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'sleep' };
export const tense14: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false };
export const day14 = { tempC: 6, outdoor: true, wet: false };
export const dusk14 = { tempC: 2, outdoor: true, wet: false };
export const night14 = { tempC: -2, outdoor: true, wet: false };
export const indoor14 = { tempC: 15, outdoor: false, wet: false };

const wrap = (P: Cond) => (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor14,
  actions: scene.actions.map(a => ({ ...a, when: all(P, a.when ?? { always: true }) })),
});
export const S14 = wrap(P14);
export const S15 = wrap(P15);

export const npcs14: Record<string, NpcDef> = {
  c14_ute: {
    id: 'c14_ute', name: 'Уте', introducedByStory: true,
    intro: 'Женщина из Винзена, лет пятидесяти пяти. Пришла через поле с велосипедом. Пишет в чат «Winsen hilft».',
    hidden: { goals: ['Забрать больных, пока их не застрелили'], fears: ['Что муж не вернётся'],
      secrets: ['Держит мужа и других обращённых в садовой колонии у насыпи', 'Верит, что обращённые возвращаются'] },
    initial: { alive: true, location: 'c3_neighbor', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
  c14_jannes: {
    id: 'c14_jannes', name: 'Яннес', introducedByStory: true,
    intro: 'Парень лет девятнадцати. Ночует в сарае у соседнего двора. Курит.',
    hidden: { goals: ['Не бросать мать'], fears: ['Что однажды кто-нибудь из них вырвется'], secrets: ['Не верит, что они возвращаются'] },
    initial: { alive: true, location: 'c3_neighbor', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
  c15_tobias: {
    id: 'c15_tobias', name: 'Тобиас', introducedByStory: true,
    intro: 'Солдат с планшетом. Приезжал с патрулём. Утром шестнадцатого приехал один, на велосипеде.',
    hidden: { goals: ['Чтобы стрелять приходилось реже'], fears: ['Что узнают в части'], secrets: ['Его мать — у Уте в колонии'] },
    initial: { alive: true, location: 'hof_luedemann', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
};
