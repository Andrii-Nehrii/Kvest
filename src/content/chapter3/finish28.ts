import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P28, oleDead, timDied, timWard } from './point28';

export const finished28: Cond = all(P28, any(flag('A.c28_finished'), flag('B.c28_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished28, when), text });
const w = (key: string): Cond => flag(`w.c28_${key}`);

// Сверка в пятницу в восемь вечера.
export const point28Notes: MergeNote[] = [
  N('c28_tim_listed', all(flag('w.c28_tim_listed'), not(v('w.c28_tim_listed', 'none'))), 'Тима вписали в список Брандта: Тим Новак, восемь лет, Бармбек. Умер 27 ноября.'),
  N('c28_told_all', flag('w.c28_told_all'), '{A} рассказал Хенрике всё, что было без неё, по порядку.'),
  N('c28_wessel_stays', flag('w.c28_wessel_stays'), 'Вессель живёт на сеновале до десятого: латает мешки и ждёт колонну на восток.'),
  N('c28_wake', v('w.c28_wake', 'all'), 'После похорон приходили соседи: Кёлер, Уте, колония. Девять человек.'),
  N('c28_hollow_rep', flag('w.c28_hollow_reported'), 'С крыши сарая {A} увидел: масса во впадине у Гарльсторфа сдвинулась к старому мосту, на километр ближе. Он сразу сходил к Брандту.'),
  N('c28_hollow_seen', any(flag('w.c28_hollow_seen'), flag('w.c28_hollow_marks')), 'С крыши сарая {A} видел: тёмное пятно у Гарльсторфа стало ближе, у старого моста.'),
  N('c28_kulka', v('w.c28_kulka', 'nina'), 'Пан Кулька, хомяк Тима, теперь живёт у Нины.'),
  N('c28_lea', any(flag('w.c28_lea_lists'), flag('w.c28_lea_needed')), 'Лея собиралась уходить в Ганновер пешком. Пока осталась.'),
  N('c28_tim_dead', timDied, 'Ночью Тим умер. Утром его похоронили.'),
  N('c28_tim_pear', all(timDied, v('w.c27_tim', 'farm')), 'Тим лежит под грушей, рядом с матерью Тобиаса.'),
  N('c28_tim_kai', all(timDied, v('w.c27_tim', 'colony')), 'Тим лежит у насыпи, рядом с Каем, под ольхой.'),
  N('c28_tim_end_kasia', v('w.c28_tim_end', 'kasia'), 'Последнее сделала Кася сама. {B} держала её за плечи.'),
  N('c28_tim_end_m', v('w.c28_tim_end', 'morphine'), '{B} дала Тиму обе ампулы морфина, пока он ещё был собой. До утра он не проснулся.'),
  N('c28_tim_end_t', v('w.c28_tim_end', 'tobias'), 'Ночью над хутором взлетела красная ракета. Приехал Тобиас. Последнее сделал он.'),
  N('c28_tim_end_u', v('w.c28_tim_end', 'ute'), 'Последнее сделала Уте. Потом снова взяла вязание.'),
  N('c28_tim_ward', timWard, 'Вечером Тобиас увёз Тима обратно в Люнебург. Кася поехала с ним.'),
  N('c28_cross', w('tim_cross'), '{A} сделал для Тима берёзовый крест.'),
  N('c28_off', v('w.c28_list', 'off'), 'Хутор вычеркнут из списка Брандта: второе нарушение и ложь. Пайка больше нет.'),
  N('c28_half', v('w.c28_list', 'half'), 'Хутору урезали паёк вдвое до пятнадцатого декабря: второе нарушение.'),
  N('c28_wessel_fired', v('w.c28_wessel', 'fired'), 'Фургон Весселя нашли. Его сняли с маршрута.'),
  N('c28_wessel_stays', v('w.c28_wessel', 'stays'), 'Вессель останется на хуторе до колонны на восток.'),
  N('c28_kasia_stays', v('w.c28_kasia', 'stays'), 'Кася останется на хуторе до колонны на восток.'),
  N('c28_kasia_east', v('w.c28_kasia', 'east'), 'Кася уйдёт десятого с поляками из Винзена: домой, в Щецин.'),
  N('c28_ole_home', all(v('w.c28_ole', 'home'), { not: flag('w.c26_ole_home') }), 'В полдень Хенрике привезла Оле домой. От ворот до крыльца он дошёл сам.'),
  N('c28_ole_dead', oleDead, 'Оле умер в Люнебурге в четверг. «В последний раз, для малышки у окна». Хенрике привезла его шапку и тетрадь.'),
  N('c28_henrike', { always: true }, 'Хенрике снова дома и на своём месте во главе стола. Она спрашивает, как будет дальше. Решает — она.'),
];

export const point28Place: JointDecision = {
  id: 'c3_new_place28', checkpoint: 28, canParticipate: P28,
  prompt: { default: 'Хенрике спрашивает, кем вы будете в этом доме до весны. Можно остаться «своими»: комната наверху ваша, но решает снова она. Можно перейти во флигель работниками: свой угол, свой паёк, своя работа. Можно остаться гостями и к весне уйти своей дорогой. Разные ответы — флигель.' },
  options: [
    { id: 'family', label: { default: 'Остаться своими' }, effects: [{ set: 'w.c28_place', value: 'family' }, { if: { npc: 'henrike', alive: true }, then: [{ npc: 'henrike', trust: 2, remember: 'c28_family' }] }],
      text: 'Вы остаётесь своими. Комната наверху ваша. Хенрике кивает: «Dann gilt mein Wort wieder». Тогда снова действует моё слово.' },
    { id: 'hands', label: { default: 'Перейти во флигель работниками до весны' }, effects: [{ set: 'w.c28_place', value: 'hands' }],
      text: 'Вы переезжаете во флигель. Своя печка, своя дверь, своя работа. Хенрике: «Gut. Arbeiter sind ehrlicher als Familie». Хорошо. Работники честнее родни.' },
    { id: 'guests', label: { default: 'Остаться гостями и к весне уйти' }, effects: [{ set: 'w.c28_place', value: 'guests' }],
      text: 'Вы гости. К весне вы уйдёте своей дорогой. Хенрике долго молчит. Потом говорит: «Gäste kommen wieder. Wenn sie gut waren». Гости возвращаются. Если были хорошими.' },
  ],
  compromises: [{ pair: ['family', 'hands'], result: 'hands' }, { pair: ['family', 'guests'], result: 'hands' }, { pair: ['hands', 'guests'], result: 'hands' }],
  arbiters: [{ id: 'c28_place_hands', when: P28, winner: 'hands', text: 'Вы не сходитесь. Хенрике решает: флигель.' }],
  default: 'hands',
};

export const point28House: JointDecision = {
  id: 'c3_new_house28', checkpoint: 28, canParticipate: P28,
  prompt: { default: 'Хенрике согласна оставить в доме одного человека сверх Нины. Кого вы попросите оставить: Эву, Касю или Лею? Разные ответы — Эву.' },
  options: [
    { id: 'eva', label: { default: 'Эву' }, effects: [{ set: 'w.c28_house', value: 'eva' }],
      text: 'Эва остаётся. Хенрике: «Die kann kochen. Und sie hat keine Angst vor mir». Готовит. И меня не боится.' },
    { id: 'kasia', label: { default: 'Касю' }, effects: [{ set: 'w.c28_house', value: 'kasia' }],
      text: 'Кася остаётся до колонны на восток. Хенрике: «Die hat ihr Kind hier begraben. Die gehört jetzt zu uns». Она похоронила здесь сына. Теперь она наша.' },
    { id: 'lea', label: { default: 'Лею' }, effects: [{ set: 'w.c28_house', value: 'lea' }],
      text: 'Лея может жить здесь. Хенрике: «Wer Ole das Leben gerettet hat, kriegt ein Bett». Кто спас Оле жизнь, получает кровать.' },
  ],
  compromises: [{ pair: ['eva', 'kasia'], result: 'eva' }, { pair: ['eva', 'lea'], result: 'eva' }, { pair: ['kasia', 'lea'], result: 'eva' }],
  arbiters: [{ id: 'c28_house_eva', when: P28, winner: 'eva', text: 'Вы не сходитесь. Хенрике оставляет Эву.' }],
  default: 'eva',
};
