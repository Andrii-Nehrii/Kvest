import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';

// Участок 26: среда 25.11, 06:30 → КТ26 20:30. План — STOCK_PLAN.md §9. Жребий: ресурсы (еда) и потеря-эхо старого решения.
// Потеря: «предупреждённые не ездят» — Corsa отгоняют к пожарной части (если A держали у колонии 18.11). Всё, что видят обе линии, — из базы КТ25.
export const P26: Cond = all({ cp: 25 }, not({ cp: 26 }));
export const A26: Cond = { me: 'A' };
export const B26: Cond = { me: 'B' };
export const farm26 = 'hof_luedemann';
export const jest26 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point26Available: Cond = all(P26, { at: farm26 }, up, flag('w.c25_ole'), flag('w.c25_truth'));
const duty = (x: string): Cond => v('w.c24_duty', x);
export const dutyA = duty('a');
export const dutyB = duty('b');
export const heldA: Cond = flag('w.c18_a_held');
export const carHome26: Cond = { itemAt: 'opel_corsa', place: farm26 };
/** Потеря-эхо: машину забирают у того, кого держали у колонии; иначе урезают паёк за давний отказ или ложь. */
export const carLoss: Cond = all(heldA, carHome26);
export const rationLoss: Cond = all(not(carLoss), not(v('w.c24_ration', 'half')), not(v('w.c25_appeal', 'won')), any(v('w.c19_cart', 'refused'), v('w.c20_list', 'lie2')));
export const oleNow: Cond = all(v('w.c25_ole', 'now'), { npc: 'ole', alive: true });
const truth = (x: string): Cond => v('w.c25_truth', x);
export const truthTold: Cond = any(truth('brandt'), truth('all'));
/** С Брандтом говорит тот, кто сегодня в Йестебурге: B на смене у Зандер, иначе A. */
export const brandtByB: Cond = all(truthTold, dutyB);
export const brandtByA: Cond = all(truthTold, not(dutyB));
const plus: Cond = any(flag('A.c21_brandt_plus'), flag('B.c21_brandt_plus'), v('A.c24_gt', 'calm'), v('B.c24_gt', 'calm'), flag('w.c22_lock_inside'));
const minus: Cond = any(flag('A.c21_brandt_minus'), flag('B.c21_brandt_minus'), v('A.c24_gt', 'argue'), v('B.c24_gt', 'argue'), v('w.c23_monday', 'shut'), flag('w.c24_brandt_told_mats'));
/** Как Брандт примет правду: союзник, сломлен или враг. Считается из базы, одинаково на обеих линиях. */
export const brandtAlly: Cond = all(truthTold, plus, not(minus), truth('brandt'));
export const brandtHostile: Cond = all(truthTold, not(brandtAlly), any(minus, truth('all')));
export const brandtBroken: Cond = all(truthTold, not(brandtAlly), not(brandtHostile));
export const plasmaSpoils: Cond = { stocked: 'c21_plasma', qty: 1, at: 'c3_farm_stock' };
export const leaFarm26: Cond = all(v('w.c21_lea', 'hide'), not(flag('w.c24_lea')), not(flag('w.c25_lea_point')));

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm26, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S26 = wrap(P26);
export const set26 = (key: string, value: string | boolean): Effect => ({ set: `$.c26_${key}`, value });
export const w26 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c26_${key}`, value });
export const until26 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(25, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare26: Effect = { camp: { kind: 'prepare', quiet: true } };
export const snow26 = { tempC: -3, outdoor: true, wet: false };
/** Итоги дня, которые обе линии записывают одинаково. */
export const dayFacts: Effect[] = [
  { if: carLoss, then: [w26('car', 'taken')] },
  { if: rationLoss, then: [w26('ration_loss', true), { set: 'w.c24_ration', value: 'half' }] },
  { if: oleNow, then: [w26('ole_home', true), { npc: 'ole', moveTo: farm26 }, { if: { npc: 'henrike', alive: true }, then: [{ npc: 'henrike', moveTo: farm26 }] }] },
  { if: brandtAlly, then: [w26('brandt', 'ally')] }, { if: brandtHostile, then: [w26('brandt', 'hostile')] }, { if: brandtBroken, then: [w26('brandt', 'broken')] },
];
const finish: Effect = { set: '$.c26_finished', value: true };

export const shared26: Scene[] = [
  S26({ id: 'c26_supper', for: 'any', chapter: 'ch3', title: 'Ужин в среду', camp: kitchen14,
    text: [
      { text: 'Ужин в половине седьмого.' },
      { when: flag('w.c26_meat_got'), text: 'На столе мясо. Настоящее, тушёное с луком, по куску на каждого. Нина ест медленно, с закрытыми глазами. Эва крестится, прежде чем взять вилку.' },
      { when: not(flag('w.c26_meat_got')), text: 'Картошка, капуста, хлеб. Нина режет хлеб тонко, как научилась за эту неделю.' },
      { when: oleNow, text: 'На лавке у печи, где лежал Мальте, сидит Оле. В куртке. Бледный, худой, с синяком на сгибе локтя. Хенрике не сводит с него глаз и подкладывает ему, пока он не говорит: «Mama. Genug».' },
      { when: v('$.c26_ay', 'fence'), text: 'Изгородь у задней калитки подлатана: Нина говорит, что куры больше не убегут в огород. Хенрике проверила сама.' },
      { when: v('$.c26_ah', 'wood'), text: 'Дров у печи на всю ночь. Можно не вставать в три часа подкидывать.' },
      { when: v('w.c26_rieger', 'taken'), text: 'Корочка Клауса Ригера лежит на краю стола. Хенрике смотрит на фотографию и говорит: «Rieger. Der hatte eine Tochter in Hanstedt». У него была дочь в Ханштедте.' },
    ],
    actions: [
      { id: 'c26_su_eat', label: 'Поесть со всеми', minutes: 30, terminal: true, goto: 'c26_evening', ...tableOnly,
        text: 'Ты ешь и слушаешь, как за столом впервые за неделю кто-то смеётся. Нина. Над Мальте, которого нет: она передразнивает, как он пел.', effects: [set26('su', 'eat'), meal('eat'), { if: flag('w.c26_meat_got'), then: [{ body: 'hunger', delta: -15 }] }, until26(19, 10)] },
      { id: 'c26_su_tea', label: 'Только чай', minutes: 15, terminal: true, goto: 'c26_evening',
        text: 'Ты пьёшь чай. День был такой, что есть не хочется.', effects: [set26('su', 'tea'), until26(18, 50)] },
    ] }),

  S26({ id: 'c26_evening', for: 'any', chapter: 'ch3', title: 'Перед четвергом', camp: house14,
    text: [
      { text: 'Завтра четверг. В Люнебурге кончится плазма. Алерс скажет матерям. Кто-то из детей не доживёт до выходных. Кто-то из матерей пойдёт искать то, чего нет.' },
      { when: flag('w.c25_kasia_tim'), text: 'Тим, сын Каси, в той детской. Жар вернулся.' },
      { text: 'А завтра, может быть, кто-то постучит и в ваши ворота.' },
    ],
    actions: [
      { id: 'c26_ev_talk', label: 'Говорить про завтра', minutes: 40, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c26_a_late' }, { id: 'b', goto: 'c26_b_late' }],
        text: 'Вы говорите тихо, чтобы не слышала Нина. Кого пустить. Кого нет. Что делать, если придёт мать с больным ребёнком на руках. Ответа нет ни у одного из вас.', effects: [set26('ev', 'talk'), finish, until26(19, 45)] },
      { id: 'c26_ev_rest', label: 'Лечь пораньше', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c26_a_late' }, { id: 'b', goto: 'c26_b_late' }],
        text: 'Ты ложишься и долго смотришь в потолок. Снизу доносится голос Оле или Нины. Ты засыпаешь, не разобрав слов.', effects: [set26('ev', 'rest'), finish, until26(19, 45)] },
    ] }),

  S26({ id: 'c26_checkpoint', for: 'any', chapter: 'ch3', title: 'Среда, половина девятого', checkpoint: 26, universal: false, camp: house14,
    text: [{ text: 'Половина девятого. Вы решаете, как встретить четверг. И что делать с ящиками в подвале, на которых мелом написано «Saat».' }], actions: [] }),
];

export const npc26 = npc;
