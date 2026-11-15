import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P35 } from './point35';

export const finished35: Cond = all(P35, any(flag('A.c35_finished'), flag('B.c35_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished35, when), text });
const meA: Cond = { me: 'A' };
const meB: Cond = { me: 'B' };

// Сверка в понедельник, девять вечера. Каждый знает свою половину; что рассказал другому — то и в сверке.
export const point35Notes: MergeNote[] = [
  N('c35_gun_hint', v('w.c35_gun_told', 'hint'), 'Солдат Хаазе спросил про оружие на хуторе: через неделю, сказал он, если позовёте, никто не приедет.'),
  N('c35_gun_truth', v('w.c35_gun_told', 'truth'), 'Солдат Хаазе спросил про оружие. {A} сказал про двустволку. Солдат велел оставить её и держать патроны.'),
  N('c35_car_ready', any(v('w.c35_car_ready', 'battery'), v('w.c35_car_ready', 'fuel')), '{A} готовит Corsa: на случай, если придётся уезжать.'),
  N('c35_b_med', flag('w.c35_b_listed_med'), 'Хаазе записал {B.acc} в отдельную графу: медицинские навыки.'),
  N('c35_list', finished35, 'Утром на хутор приезжал оберлейтенант Хаазе из комендатуры Люнебурга: переписал всех, кто здесь живёт, и кто чем может быть полезен.'),
  N('c35_told_tobias', flag('w.c35_told_tobias'), '{A} рассказал: пятнадцатого армия уходит из Люнебурга за Эльбу, округ остаётся один.'),
  N('c35_tobias_seats', all(flag('w.c35_told_tobias'), flag('w.c35_tobias_offer')), 'У Тобиаса для вас два места в армейском грузовике за Эльбу. Он просил никому не говорить.'),
  N('c35_silent_a', all(meB, flag('w.c35_tobias_offer'), not(flag('w.c35_told_tobias'))), '{A} весь вечер носит что-то в себе и молчит.'),
  N('c35_told_north', flag('w.c35_told_north'), '{B} рассказала: колонне Красного Креста на север нужна медсестра вместо заболевшей. Две недели, до Аренсбурга и обратно. У Мерле инсулина на десять дней.'),
  N('c35_silent_b', all(meA, flag('w.c35_nurse_offer'), not(flag('w.c35_told_north'))), '{B} вернулась из пункта и долго говорила с Хенрике наедине. Тебе — ничего.'),
  N('c35_b_will_go', v('w.c35_b_will', 'go'), '{B} сказала: поедет на север медсестрой. Если {A} отпустит.'),
  N('c35_b_will_unsure', v('w.c35_b_will', 'unsure'), '{B} сказала: не знает, поедет ли на север. Ей страшно.'),
  N('c35_b_will_stay', v('w.c35_b_will', 'stay'), '{B} сказала: пусть на север поедет кто-то другой. Она нужна здесь.'),
  N('c35_brandt', v('w.c35_brandt_ask', 'yes'), 'Брандт остаётся держать округ, когда армия уйдёт. {A} пообещал ему: если останетесь — он в дружине.'),
  N('c35_kasia', v('w.c35_kasia_east', 'promised'), 'Кася хочет на восток, в Польшу, к бабушке. {B} пообещала: если будет место, она поедет первой.'),
  N('c35_told_henrike', flag('w.c35_told_henrike'), '{A} рассказал Хенрике, что пятнадцатого армия уходит.'),
  N('c35_handover', flag('w.c35_b_handover'), '{B} весь вечер писала в тетрадь: кому какие лекарства, кто кашляет, что делать. На случай.'),
  N('c35_jannik', flag('w.c35_jannik'), 'Янник, водитель Красного Креста, — тот парень с A7 у тоннеля, первого дня. Десятого он ведёт вторую машину на север. Возьмёт двоих.'),
  N('c35_henrike', flag('w.c35_henrike_promise'), 'Хенрике просит одного: если уйдёте — сказать до сева. Хутор она записала у пастора: Оле и тому из вас, кто останется.'),
];

const whoA: Cond = all(P35, any(meA, { partner: 'incapacitated' }));
const whoB: Cond = all(P35, any(meB, { partner: 'incapacitated' }));

export const point35North: JointDecision = {
  id: 'c3_new_north35', checkpoint: 35, canParticipate: whoA,
  prompt: { default: 'Колонне Красного Креста на север нужна медсестра вместо заболевшей: две недели, до Аренсбурга, где Мерле, и обратно. Доктор Зандер выпишет удостоверение на {B.acc}, Окафор идёт сопровождающим. Отвечает {A}: отпустить её одну, ехать вдвоём (если водитель Янник возьмёт второго) или нет.' },
  options: [
    { id: 'go', label: { default: 'Отпустить её на север без меня' }, effects: [{ set: 'w.c35_north', value: 'go' }],
      text: '{B} поедет на север медсестрой. Без {A.gen}. Две недели.' },
    { id: 'together', label: { default: 'Ехать вдвоём: Янник возьмёт второго' }, when: flag('w.c35_jannik'), effects: [{ set: 'w.c35_north', value: 'together' }],
      text: 'На север поедут оба: {B} медсестрой, {A} — во второй машине у Янника.' },
    { id: 'no', label: { default: 'Нет: на север она не поедет' }, effects: [{ set: 'w.c35_north', value: 'no' }],
      text: '{B} не поедет на север. Удостоверение доктор Зандер выпишет кому-то другому.' },
  ],
  arbiters: [{ id: 'c35_north_no', when: P35, winner: 'no', text: 'Решить не успели. На север она не поедет.' }],
  default: 'no',
  soloReason: 'Отвечал он: отпустить ли её одну, решает тот, кто остаётся.',
};

export const point35East: JointDecision = {
  id: 'c3_new_east35', checkpoint: 35, canParticipate: whoB,
  prompt: { default: 'Тобиасу разрешили взять «своих» за Эльбу, когда армия уйдёт пятнадцатого: два места в грузовике. Предложил он их {A.dat}, и ответ нужен до четырнадцатого. Отвечает {B}: что {A} скажет Тобиасу — да, нет, или попросит отдать места другим (Касе и Эве).' },
  options: [
    { id: 'yes', label: { default: 'Да: два места за Эльбу берём' }, effects: [{ set: 'w.c35_east', value: 'yes' }],
      text: '{A} скажет Тобиасу: да. Два места за Эльбу ваши.' },
    { id: 'no', label: { default: 'Нет: мы остаёмся' }, effects: [{ set: 'w.c35_east', value: 'no' }],
      text: '{A} скажет Тобиасу: спасибо, нет.' },
    { id: 'give', label: { default: 'Отдать места другим: Касе и Эве' }, effects: [{ set: 'w.c35_east', value: 'give' }],
      text: '{A} попросит Тобиаса взять вместо вас Касю и Эву.' },
  ],
  arbiters: [{ id: 'c35_east_no', when: P35, winner: 'no', text: 'Решить не успели. {A} скажет Тобиасу: нет.' }],
  default: 'no',
  soloReason: 'Отвечала она: что скажет он, решает та, кого это тоже касается.',
};

export const point35Way: JointDecision = {
  id: 'c3_new_way35', checkpoint: 35, canParticipate: P35,
  prompt: { default: 'Куда дальше. Зимовать на хуторе. На север, за Мерле, и обратно. На восток, с Павлом и колонной из Винзена. Разные ответы — зимовать на хуторе.' },
  options: [
    { id: 'stay', label: { default: 'Зимовать на хуторе' }, effects: [{ set: 'w.c35_way', value: 'stay' }],
      text: 'Вы зимуете на хуторе.' },
    { id: 'north', label: { default: 'На север, за Мерле, и обратно' }, effects: [{ set: 'w.c35_way', value: 'north' }],
      text: 'Вы идёте на север, за Мерле. И обратно.' },
    { id: 'east', label: { default: 'На восток, с Павлом' }, effects: [{ set: 'w.c35_way', value: 'east' }],
      text: 'Вы уходите на восток, с Павлом.' },
  ],
  compromises: [{ pair: ['stay', 'north'], result: 'stay' }, { pair: ['stay', 'east'], result: 'stay' }, { pair: ['north', 'east'], result: 'stay' }],
  arbiters: [{ id: 'c35_way_stay', when: P35, winner: 'stay', text: 'Вы не сходитесь. Пока — хутор.' }],
  default: 'stay',
};
