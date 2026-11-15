import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P34, lea34, pawel34, thomas34 } from './point34';

export const finished34: Cond = all(P34, any(flag('A.c34_finished'), flag('B.c34_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished34, when), text });

// Сверка в воскресенье, восемь вечера. Желания из часа вдвоём (`$.c34_wish`) в сверку не попадают: каждый знает только своё.
export const point34Notes: MergeNote[] = [
  N('c34_tobias_words', v('A.c34_al2', 'write'), '{A} записал слово в слово всё, что сказал Тобиас. Листок лежит в тетради Хенрике.'),
  N('c34_b_slept', all(v('B.c34_bl5', 'go'), lea34), 'После списков Лея весь вечер просидела на крыльце одна. Её не стали трогать.'),
  N('c34_heard_rumor', flag('w.c34_heard_rumor'), 'У церкви говорят: армия третий день что-то грузит в Люнебурге. Одни говорят — уходят. Другие — ерунда.'),
  N('c34_henrike_ready', flag('w.c34_henrike_ready'), 'Хенрике знает, что в понедельник приедет кто-то со списком. Она сама будет говорить.'),
  N('c34_lea_spring', flag('w.c34_lea_spring'), 'Лея решила остаться при пункте у Зандер до весны.'),
  N('c34_agreed', flag('w.c34_agreed_story'), 'Вечером вы шёпотом договорились, кто что скажет, если завтра спросят.'),
  N('c34_car', flag('w.c34_car_back'), 'Corsa снова дома: {A} пригнал её из Йестебурга. Тобиаса переводят; в понедельник приедет кто-то новый, со списком.'),
  N('c34_thomas_truth', v('w.c34_thomas', 'truth'), '{A} продиктовал Томасу Брокману в Торонто правду: оба заболели, обоих больше нет.'),
  N('c34_thomas_gentle', v('w.c34_thomas', 'gentle'), '{A} продиктовал Томасу Брокману в Торонто: родители умерли вместе и не мучились.'),
  N('c34_thomas_none', all(thomas34, v('w.c34_thomas', 'none')), 'На вопрос Томаса Брокмана из Торонто {A} отвечать не стал.'),
  N('c34_pawel', pawel34, 'Павел зовёт на восток: колонна десятого декабря из Винзена, место на двоих.'),
  N('c34_warned', flag('w.c34_tobias_warned'), 'Тобиас сказал: если в понедельник спросят, кто здесь живёт, говорить правду, но только то, о чём спросят.'),
];

export const point34Lean: JointDecision = {
  id: 'c3_new_lean34', checkpoint: 34, canParticipate: P34,
  prompt: { default: 'Это ещё не решение. Куда вы смотрите? Остаться на хуторе и пережить зиму. На восток, с колонной из Винзена. На север, за Эльбу, с колонной Красного Креста. Разные ответы — остаться.' },
  options: [
    { id: 'stay', label: { default: 'Остаться: хутор и зима' }, effects: [{ set: 'w.c34_lean', value: 'stay' }],
      text: 'Вы смотрите на хутор. На зиму здесь.' },
    { id: 'east', label: { default: 'На восток' }, effects: [{ set: 'w.c34_lean', value: 'east' }],
      text: 'Вы смотрите на восток. Туда, где, говорят, есть ток и закон.' },
    { id: 'north', label: { default: 'На север, за Эльбу' }, effects: [{ set: 'w.c34_lean', value: 'north' }],
      text: 'Вы смотрите на север. За Эльбу, к тем, кто там остался.' },
  ],
  compromises: [{ pair: ['stay', 'east'], result: 'stay' }, { pair: ['stay', 'north'], result: 'stay' }, { pair: ['east', 'north'], result: 'stay' }],
  arbiters: [{ id: 'c34_lean_stay', when: P34, winner: 'stay', text: 'Вы смотрите в разные стороны. Пока — хутор.' }],
  default: 'stay',
};
