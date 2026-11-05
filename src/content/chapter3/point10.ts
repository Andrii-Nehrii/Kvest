import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

// Участок 10: вечер и ночь 13.11 после КТ9, до КТ10. Всё новое — за этим условием.
export const P10: Cond = all({ cp: 9 }, not({ cp: 10 }));
export const A10: Cond = { me: 'A' };
export const B10: Cond = { me: 'B' };
const went = (pid: 'A' | 'B'): Cond => ({ v: `w.c9_search_${pid}`, op: '==', value: 'go' });
/** Я ушёл с Денизом искать Керема (решал партнёр). */
export const meSearch10: Cond = { any: [all({ me: 'A' }, went('A')), all({ me: 'B' }, went('B'))] };
export const partnerSearch10: Cond = { any: [all({ me: 'A' }, went('B')), all({ me: 'B' }, went('A'))] };
export const home10 = (id: string): Cond => ({ npc: id, alive: true, at: 'hof_luedemann' });
export const point10Available: Cond = all(P10, flag('w.together'), flag('w.c9_deniz_search'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' },
  { partner: 'active' }, { cap: 'canAct', op: '>=', value: 1 }, home10('henrike'), home10('ole'), { npc: 'c7_nina', alive: true });
export const kept10: Cond = { v: 'w.c9_jens', op: '==', value: 'kept' };
export const knows10: Cond = flag('$.c10_knows');
export const fever10: Cond = { npcVar: 'ole', key: 'c10_fever' };
export const ninaKey10: Cond = { npcHas: 'c7_nina', type: 'c9_van_key' };
export const nina10: Cond = { npc: 'c7_nina', alive: true, at: 'hof_luedemann' };
/** Свои улики точки 9: увидено или услышано лично, а не догадка. */
export const evidence10: Cond = { any: [flag('$.c10_compared'), flag('$.c9_saw_forearm'), flag('$.c9_saw_swelling'), flag('$.c9_q_wound'),
  { v: '$.c9_d2', op: '==', value: 'truth' }, { v: '$.c9_koehler', op: '==', value: 'told' }, { v: '$.c9_sweater', op: '==', value: 'looked' }] };
export const once10 = (key: string): Cond => not(flag(`$.c10_${key}`));
export const own10 = (key: string, value: string): Cond => ({ v: `$.c10_${key}`, op: '==', value });

export const house10: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief' };
export const night10 = { tempC: 4, outdoor: true, wet: false };
export const S10 = (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? false, ambient: scene.ambient ?? { tempC: 17, outdoor: false, wet: false },
  actions: scene.actions.map(a => ({ ...a, when: all(P10, a.when ?? { always: true }) })),
});
