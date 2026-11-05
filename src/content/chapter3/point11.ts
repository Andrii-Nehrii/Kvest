import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

// Участок 11: после КТ10 (ночь) до КТ11 (полдень 14.11).
export const P11: Cond = all({ cp: 10 }, not({ cp: 11 }));
export const A11: Cond = { me: 'A' };
export const B11: Cond = { me: 'B' };
export const point11Available: Cond = all(P11, flag('w.together'), flag('w.c10_ole'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' },
  { partner: 'active' }, { cap: 'canAct', op: '>=', value: 1 }, { npc: 'henrike', alive: true }, { npc: 'ole', alive: true }, { npc: 'c7_nina', alive: true });
export const ole11 = (v: string): Cond => ({ v: 'w.c10_ole', op: '==', value: v });
export const nina11 = (v: string): Cond => ({ v: 'w.c10_nina', op: '==', value: v });
export const wound11 = (v: string): Cond => ({ v: 'w.c11_henrike_wound', op: '==', value: v });
export const kept11: Cond = { v: 'w.c9_jens', op: '==', value: 'kept' };
export const once11 = (key: string): Cond => not(flag(`$.c11_${key}`));
export const yard11: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief', well: true, car: 'opel_corsa' };
export const kitchen11: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'brief' };
export const tense11: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false };
export const dawn11 = { tempC: 3, outdoor: true, wet: false };
export const day11 = { tempC: 8, outdoor: true, wet: false };
export const S11 = (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? { tempC: 16, outdoor: false, wet: false },
  actions: scene.actions.map(a => ({ ...a, when: all(P11, a.when ?? { always: true }) })),
});
