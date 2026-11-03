import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

export const P7: Cond = all({ cp: 6 }, not({ cp: 7 }));
export const A7: Cond = { me: 'A' };
export const B7: Cond = { me: 'B' };
export const togetherWatch = not({ v: 'w.c6_r_night', op: '==', value: 'own_sleep' });
export const atHome = (id: string): Cond => ({ npc: id, alive: true, at: 'hof_luedemann' });
export const own7 = (key: string, value: string): Cond => ({ v: `$.c7_${key}`, op: '==', value });
export const kitchen7: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'sleep', car: 'opel_corsa' };
export const room7: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief' };
export const urgent7: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false };

// Общая техническая обвязка. Сцены и их речь написаны по отдельности.
export const S7 = (scene: Scene): Scene => ({ ...scene,
  location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? { tempC: 16, outdoor: false, wet: false },
  actions: scene.actions.map(a => ({ ...a, when: all(P7, a.when ?? { always: true }) })),
});
export const once7 = (key: string) => not(flag(`$.c7_${key}`));
