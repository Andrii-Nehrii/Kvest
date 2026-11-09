import type { NpcDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';

// Участки 16 и 17: после КТ15 (16.11, 13:00) до КТ17 (17.11, 13:00). План — docs/hidden/CHAPTER3_ARC16_PLAN.md.
export const P16: Cond = all({ cp: 15 }, not({ cp: 16 }));
export const P17: Cond = all({ cp: 16 }, not({ cp: 17 }));
export const A16: Cond = { me: 'A' };
export const B16: Cond = { me: 'B' };
const together: Cond[] = [flag('w.together'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, { partner: 'active' },
  { cap: 'canAct', op: '>=', value: 1 }];
// У настоящей пары на КТ14 Йенса отдали Уте (give); ветки end/gate (Йенса нет) поддержаны текстом.
export const point16Available: Cond = all(P16, flag('w.c14_jens'), flag('w.c15_garden'), flag('w.c15_nina'),
  flag('A.c15_finished'), flag('B.c15_finished'), ...together);
export const point17Available: Cond = all(P17, flag('w.c16_albers'), flag('w.c16_sweep'), flag('A.c16_finished'), flag('B.c16_finished'), ...together);

/** Йенс в колонии (КТ14 give); иначе он похоронен под яблоней. */
export const jensAlive: Cond = { v: 'w.c14_jens', op: '==', value: 'give' };
export const garden16 = (v: 'help' | 'away' | 'tell'): Cond => ({ v: 'w.c15_garden', op: '==', value: v });
export const ninaHere: Cond = { v: 'w.c15_nina', op: '==', value: 'stay' };
export const ninaAway: Cond = { v: 'w.c15_nina', op: '==', value: 'winsen' };
export const own16 = (key: string, value: string): Cond => ({ v: `$.c16_${key}`, op: '==', value });
export const own17 = (key: string, value: string): Cond => ({ v: `$.c17_${key}`, op: '==', value });
export const albers17 = (v: 'take' | 'no'): Cond => ({ v: 'w.c16_albers', op: '==', value: v });
export const sweep17 = (v: 'warn' | 'brandt' | 'stay'): Cond => ({ v: 'w.c16_sweep', op: '==', value: v });
export const kai17 = (v: 'back' | 'a' | 'jannes'): Cond => ({ v: 'w.c17_kai', op: '==', value: v });

export const day16 = { tempC: 5, outdoor: true, wet: false };
export const dusk16 = { tempC: 1, outdoor: true, wet: false };
export const night16 = { tempC: -3, outdoor: true, wet: false };
export const indoor16 = { tempC: 15, outdoor: false, wet: false };
export const village16: NonNullable<Scene['camp']> = { at: 'c16_jesteburg', stock: 'c3_farm_stock', rest: false };

export const nina = (trust: number): Effect => ({ if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust }] });
export const ute = (trust: number): Effect => ({ npc: 'c14_ute', trust });
export const jannes = (trust: number): Effect => ({ npc: 'c14_jannes', trust });
export const tobias = (trust: number): Effect => ({ npc: 'c15_tobias', trust });
export const brandt = (trust: number): Effect => ({ if: { npc: 'c16_brandt', alive: true }, then: [{ npc: 'c16_brandt', trust }] });
export const koehler = (trust: number): Effect => ({ npc: 'c3_koehler', trust });

const wrap = (P: Cond) => (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(P, a.when ?? { always: true }) })),
});
export const S16 = wrap(P16);
export const S17 = wrap(P17);

// Генератор Хенрике: условие работающего источника — LocationDef.localPower хутора в content/world.ts.

export const npcs16: Record<string, NpcDef> = {
  c16_brandt: {
    id: 'c16_brandt', name: 'Брандт', introducedByStory: true,
    intro: 'Командир добровольной пожарной команды Йестебурга, лет шестидесяти. Ведёт обмен у пожарной части и записывает всех, кто приходит.',
    hidden: { goals: ['Чтобы в деревне больше никого не укусили'], fears: ['Что не успеет'], secrets: ['Его внук — тот мальчик из Итценбюттеля'] },
    initial: { alive: true, location: 'c16_jesteburg', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
};
