import type { NpcDef, Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

// Участки 12 и 13: после КТ11 (полдень 14.11) до КТ13 (15.11, до полудня).
export const P12: Cond = all({ cp: 11 }, not({ cp: 12 }));
export const P13: Cond = all({ cp: 12 }, not({ cp: 13 }));
export const A12: Cond = { me: 'A' };
export const B12: Cond = { me: 'B' };
const together: Cond[] = [flag('w.together'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, { partner: 'active' },
  { cap: 'canAct', op: '>=', value: 1 }, { npc: 'henrike', alive: true }, { npc: 'ole', alive: true }, { npc: 'c7_nina', alive: true }];
export const point12Available: Cond = all(P12, flag('w.c11_home'), ...together);
export const point13Available: Cond = all(P13, flag('w.c12_guests'), ...together);

export const report12 = (v: string): Cond => ({ v: 'w.c11_report', op: '==', value: v });
export const home12 = (v: string): Cond => ({ v: 'w.c11_home', op: '==', value: v });
export const wound12 = (v: string): Cond => ({ v: 'w.c11_henrike_wound', op: '==', value: v });
export const guests13 = (v: string): Cond => ({ v: 'w.c12_guests', op: '==', value: v });
export const promiseA13 = (v: string): Cond => ({ v: 'w.c12_promise_A', op: '==', value: v });
export const promiseB13 = (v: string): Cond => ({ v: 'w.c12_promise_B', op: '==', value: v });
export const kept12: Cond = { v: 'w.c9_jens', op: '==', value: 'kept' };
export const own12 = (key: string, value: string): Cond => ({ v: `$.c12_${key}`, op: '==', value });
export const own13 = (key: string, value: string): Cond => ({ v: `$.c13_${key}`, op: '==', value });
/** Сам игрок сигналил ночью фонарём (участок 10, оставшийся на хуторе). */
export const signaled12: Cond = { v: '$.c10_light', op: '==', value: 'signal' };
export const partnerSignaled12: Cond = { v: '@partner.c10_light', op: '==', value: 'signal' };

export const kitchen12: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'brief' };
export const yard12: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief', well: true, car: 'opel_corsa' };
export const house12: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'sleep' };
export const tense12: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false };
export const day12 = { tempC: 7, outdoor: true, wet: false };
export const dusk12 = { tempC: 3, outdoor: true, wet: false };
export const dawn13 = { tempC: -1, outdoor: true, wet: false };
export const indoor12 = { tempC: 16, outdoor: false, wet: false };

const wrap = (P: Cond) => (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor12,
  actions: scene.actions.map(a => ({ ...a, when: all(P, a.when ?? { always: true }) })),
});
export const S12 = wrap(P12);
export const S13 = wrap(P13);
export const meal = (mode: 'eat' | 'pack') => ({ camp: { kind: 'meal' as const, mode, communal: true } });

export const npcs12: Record<string, NpcDef> = {
  c12_marcus: {
    id: 'c12_marcus', name: 'Маркус', introducedByStory: true,
    intro: 'Пришёл с насыпи вместе с мальчиком Лео. Говорит, что он его отец. Идут в Йестебург.',
    hidden: { goals: ['Довести Лео до бабушки в Целле'], fears: ['Что Лео заберут у него на посту', 'Что заболел сам'],
      secrets: ['Он не отец Лео: жил с его матерью', 'Укус на руке — от Лео', 'Мать Лео обратилась, и он её остановил'] },
    initial: { alive: true, location: 'hof_luedemann', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
  c12_leo: {
    id: 'c12_leo', name: 'Лео', introducedByStory: true,
    intro: 'Мальчик лет семи. Пришёл с Маркусом с насыпи. Почти не говорит.',
    hidden: { goals: ['Чтобы Маркус не заболел'], fears: ['Что из-за него Маркус станет как мама'], secrets: ['Это он укусил Маркуса'] },
    initial: { alive: true, location: 'hof_luedemann', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
};
