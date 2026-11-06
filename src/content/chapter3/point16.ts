import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';

// Участок 16: после КТ15 (16.11, 13:00) до КТ16 (17.11, до полудня). Черновик: ещё не подключён.
export const P16: Cond = all({ cp: 15 }, not({ cp: 16 }));
export const A16: Cond = { me: 'A' };
export const B16: Cond = { me: 'B' };
const together: Cond[] = [flag('w.together'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, { partner: 'active' },
  { cap: 'canAct', op: '>=', value: 1 }];
export const point16Available: Cond = all(P16, flag('w.c15_garden'), flag('w.c15_nina'), ...together);

export const garden16 = (v: string): Cond => ({ v: 'w.c15_garden', op: '==', value: v });
export const nina16 = (v: string): Cond => ({ v: 'w.c15_nina', op: '==', value: v });
export const jens16 = (v: string): Cond => ({ v: 'w.c14_jens', op: '==', value: v });
export const ninaHere16: Cond = { npc: 'c7_nina', alive: true, at: 'hof_luedemann' };
export const own16 = (key: string, value: string): Cond => ({ v: `$.c16_${key}`, op: '==', value });

export const kitchen16: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'brief' };
export const yard16: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief', well: true, car: 'opel_corsa' };
export const house16: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: true, rest: 'sleep' };
export const tense16: NonNullable<Scene['camp']> = { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false };
export const day16 = { tempC: 5, outdoor: true, wet: false };
export const dusk16 = { tempC: 1, outdoor: true, wet: false };
export const night16 = { tempC: -3, outdoor: true, wet: false };
export const indoor16 = { tempC: 15, outdoor: false, wet: false };

const wrap = (P: Cond) => (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(P, a.when ?? { always: true }) })),
});
export const S16 = wrap(P16);
