import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { all, flag, not } from './world3';

// Участок 9: после КТ8 до КТ9. Всё новое — только здесь, за этим условием.
export const P9: Cond = all({ cp: 8 }, not({ cp: 9 }));
export const A9: Cond = { me: 'A' };
export const B9: Cond = { me: 'B' };
const both = (place: string): Cond => all({ at: place }, { partnerAt: place });
export const farmStart9 = both('hof_luedemann');
export const laneStart9 = both('c7_farm_lane');
export const eastStart9 = both('c8_east_road');
export const home9 = (id: string): Cond => ({ npc: id, alive: true, at: 'hof_luedemann' });
export const point9Available: Cond = all(P9, flag('w.together'), flag('w.c8_direction'), { partner: 'active' }, { cap: 'canAct', op: '>=', value: 1 },
  { any: [farmStart9, laneStart9, eastStart9] }, home9('henrike'), home9('ole'), home9('deniz'));
export const own9 = (key: string, value: string): Cond => ({ v: `$.c9_${key}`, op: '==', value });
export const once9 = (key: string): Cond => not(flag(`$.c9_${key}`));
export const near9 = (npc: string): Cond => ({ npc, alive: true, at: 'hof_luedemann' });
export const nina9 = (qty = 1): Cond => ({ npcHas: 'c7_nina', type: 'c9_van_key', qty });
/** Керем ещё во дворе: agenda уводит его в 12:20, разговор с ним — один раз. */
export const keremHere9: Cond = all(near9('kerem'), not(flag('$.c9_kerem_seen')));
export const koehlerHere9: Cond = near9('c3_koehler');
export const lateDay9 = { after: at(13, 17) } as Cond;

export const kitchen9: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'sleep', car: 'opel_corsa' };
export const yard9: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief', car: 'opel_corsa', well: true };
/** Дом без накрытого стола: общий стол — только в сценах обеда и ужина. */
export const house9: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief' };
export const tense9: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false };

/** Утро хутора, пока пары не было. Одинаково на обеих линиях; статусы людей не меняются — это скрыто. */
export const morning9: Effect[] = [{ if: not(flag('w.c9_morning')), then: [
  { set: 'w.c9_morning', value: true }, { set: 'w.c9_van_window', value: 'boarded' },
  { npc: 'ole', set: { c9_bitten: true } }, { npc: 'kerem', set: { c9_saw: true } }, { npc: 'c3_koehler', set: { c9_saw_wash: true } },
] }];

export const S9 = (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? { tempC: 17, outdoor: false, wet: false },
  actions: scene.actions.map(a => ({ ...a, when: all(P9, a.when ?? { always: true }) })),
});
export const outdoor9 = { tempC: 8, outdoor: true, wet: false };
