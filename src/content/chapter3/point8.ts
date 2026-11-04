import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

export const P8: Cond = all({ cp: 7 }, not({ cp: 8 }));
export const point8Available: Cond = all(P8, flag('w.together'), { at: 'c7_farm_lane' },
  { partnerAt: 'c7_farm_lane' }, { any: [{ v: 'w.c7_departure', op: '==', value: 'car' }, { v: 'w.c7_departure', op: '==', value: 'walk' }] });
export const A8: Cond = { me: 'A' };
export const B8: Cond = { me: 'B' };
export const own8 = (key: string, value: string): Cond => ({ v: `$.c8_${key}`, op: '==', value });
export const once8 = (key: string): Cond => not(flag(`$.c8_${key}`));
export const near8 = (npc: string): Cond => ({ npc, at: 'c7_farm_lane', alive: true });
export const stock8 = (npc: string, type: string, qty = 1): Cond => ({ npcHas: npc, type, qty });
export const road8: NonNullable<Scene['camp']> = { at: 'c7_farm_lane', stock: 'c8_road_store', rest: 'brief', car: 'opel_corsa' };
export const bus8: NonNullable<Scene['camp']> = { ...road8, rest: 'sleep', sleepLabel: 'Поспать полчаса в салоне без отопления' };
export const searching8: NonNullable<Scene['camp']> = { at: 'c8_well_path', stock: 'c8_well_path', rest: false };
export const S8 = (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'c7_farm_lane', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? { outdoor: true, wet: false },
  actions: scene.actions.map(a => ({ ...a, when: all(P8, a.when ?? { always: true }) })),
});
