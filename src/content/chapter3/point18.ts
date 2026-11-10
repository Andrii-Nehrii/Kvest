import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, yard14 } from './point14';
import { indoor16 } from './point16';

// Участок 18: 17.11, 13:00 → КТ18 18.11, 19:30. Весь участок порознь. План — docs/hidden/CHAPTER3_ARC18_PLAN.md.
export const P18: Cond = all({ cp: 17 }, not({ cp: 18 }));
export const A18: Cond = { me: 'A' };
export const B18: Cond = { me: 'B' };
export const any = (...xs: Cond[]): Cond => ({ any: xs });
export const v = (key: string, value: string): Cond => ({ v: key, op: '==', value });
export const point18Available: Cond = all(P18, flag('w.c17_colony'), flag('w.c17_nina'), flag('A.c17_finished'), flag('B.c17_finished'),
  flag('w.together'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, { partner: 'active' }, { cap: 'canAct', op: '>=', value: 1 });

export const colony17 = (x: 'move' | 'stand' | 'end' | 'away'): Cond => v('w.c17_colony', x);
export const ninaFarm: Cond = { npc: 'c7_nina', alive: true, at: 'hof_luedemann' };
export const jens18: Cond = v('w.c14_jens', 'give');
export const margitFarm: Cond = v('w.c16_albers', 'take');
/** Брандт на стороне пары: A убедил его, он обещал прийти в семь, или B назвала ему имена. */
export const brandtGood: Cond = any(v('A.c17_brandt', 'convinced'), flag('w.c17_brandt_seven'), v('B.c17_brandt_b', 'soft'));
export const ilseTurned: Cond = { npc: 'ilse', status: 'turned', at: 'a_hospital' };
export const own = (key: string, value: string): Cond => v(`$.c18_${key}`, value);

export const lueneburg = 'c18_lueneburg';
export const camp18b: NonNullable<Scene['camp']> = { at: lueneburg, stock: 'c3_farm_stock', rest: false };
export const cold18 = { tempC: -2, outdoor: true, wet: false };
export const day18 = { tempC: 3, outdoor: true, wet: false };

export const S18 = (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(P18, a.when ?? { always: true }) })),
});
export const npc = (id: string, trust: number, remember?: string): Effect =>
  ({ if: { npc: id, alive: true }, then: [{ npc: id, trust, ...(remember ? { remember } : {}) }] });

export const checkpoint18: Scene = S18({ id: 'c18_checkpoint', for: 'any', chapter: 'ch3', title: 'После среды', checkpoint: 18, universal: false, camp: house14,
  text: [{ text: 'Вы сидите на кухне. Каждый рассказывает свои сутки с начала. Потом решаете, как жить дальше.' }], actions: [] });

const toCp: Effect = { restUntil: at(18, 19, 30) };
export const evening18: Scene = S18({ id: 'c18_evening', for: 'any', chapter: 'ch3', title: 'Грузовик', camp: yard14, ambient: cold18,
  text: [
    { when: A18, text: 'В двадцать минут шестого на дороге появляются фары. Грузовик останавливается у ворот, не заезжая. Брезент откидывается.' },
    { when: all(A18, v('w.c18_henrike', 'home')), text: 'Первой спускается Хенрике. Она держится за борт обеими руками и долго смотрит на свой двор. Потом ты видишь {B.acc}.' },
    { when: all(A18, not(v('w.c18_henrike', 'home'))), text: '{B} спрыгивает одна. Рюкзак у неё на одном плече.' },
    { when: B18, text: 'Грузовик тормозит у ворот хутора в двадцать минут шестого. Ты откидываешь брезент. В окне кухни горит свет. Значит, дом стоит.' },
    { when: all(B18, v('w.c18_henrike', 'home')), text: 'Хенрике спускается первой и держится за борт обеими руками. Она смотрит на двор так, будто считает, чего не хватает.' },
    { when: B18, text: '{A} стоит у ворот. По его лицу ты не можешь понять, что было утром.' },
  ],
  actions: [
    { id: 'c18_ev_tell', label: 'Рассказать первым', when: A18, minutes: 10, terminal: true, goto: 'c18_checkpoint', effects: [{ set: '$.c18_finished', value: true }, { set: '$.c18_ev', value: 'tell' }, toCp],
      text: 'Ты начинаешь говорить ещё во дворе. Выходит сбивчиво и не с начала. Она не перебивает и ведёт тебя в дом за рукав.' },
    { id: 'c18_ev_listen', label: 'Сначала выслушать её', when: A18, minutes: 10, terminal: true, goto: 'c18_checkpoint', effects: [{ set: '$.c18_finished', value: true }, { set: '$.c18_ev', value: 'listen' }, toCp],
      text: '— Сначала ты, — говоришь ты.\n\nОна рассказывает, пока вы идёте через двор. Своё ты держишь до кухни.' },
    { id: 'c18_ev_hug', label: 'Ничего не говорить, обнять', when: A18, minutes: 10, terminal: true, goto: 'c18_checkpoint', effects: [{ set: '$.c18_finished', value: true }, { set: '$.c18_ev', value: 'hug' }, { body: 'stress', delta: -2 }, toCp],
      text: 'От её куртки пахнет соляркой и хлоркой. Вы стоите так, пока грузовик не уезжает.' },
    { id: 'c18_evb_tell', label: 'Рассказать первой', when: B18, minutes: 10, terminal: true, goto: 'c18_checkpoint', effects: [{ set: '$.c18_finished', value: true }, { set: '$.c18_ev', value: 'tell' }, toCp],
      text: 'Ты начинаешь ещё у ворот: казарма, Оле, списки. Он слушает и несёт твой рюкзак.' },
    { id: 'c18_evb_ask', label: 'Спросить, что было утром', when: B18, minutes: 10, terminal: true, goto: 'c18_checkpoint', effects: [{ set: '$.c18_finished', value: true }, { set: '$.c18_ev', value: 'listen' }, toCp],
      text: '— Что было утром? — спрашиваешь ты.\n\n— В доме, — говорит он. — Расскажу в доме.' },
    { id: 'c18_evb_hug', label: 'Ничего не говорить, обнять', when: B18, minutes: 10, terminal: true, goto: 'c18_checkpoint', effects: [{ set: '$.c18_finished', value: true }, { set: '$.c18_ev', value: 'hug' }, { body: 'stress', delta: -2 }, toCp],
      text: 'От него пахнет дымом и холодом. Вы стоите так, пока грузовик не уезжает.' },
  ] });
