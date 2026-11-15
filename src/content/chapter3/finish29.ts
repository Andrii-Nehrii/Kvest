import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P29, roofLoss } from './point29';

export const finished29: Cond = all(P29, any(flag('A.c29_finished'), flag('B.c29_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished29, when), text });
const w = (key: string): Cond => flag(`w.c29_${key}`);

// Сверка в воскресенье в семь вечера.
export const point29Notes: MergeNote[] = [
  N('c29_kerem_paid', v('w.c29_kerem', 'paid'), 'В субботу приезжал Керем. {A} рассчитался картошкой.'),
  N('c29_reserve', flag('w.c29_reserve'), '{B} и Хенрике считали подвал: если все останутся, еды хватит до февраля, не до сева.'),
  N('c29_rope', flag('A.c29_rope'), 'Уве, пожарный, отдал {A.dat} моток верёвки: в цепи на краю впадины.'),
  N('c29_kids', flag('w.c29_kids_list'), 'Женщины из церкви составили с вами список пропавших детей для Красного Креста.'),
  N('c29_roof', roofLoss, 'В ночь на воскресенье под снегом просела крыша курятника. Три курицы погибли. Рубероид Фолькера так и стоял свёрнутым: прибить его было некому.'),
  N('c29_pump', w('pump_frozen'), 'Колонка во дворе замёрзла.'),
  N('c29_pump_saved', w('pump_saved'), '{A} отогрел колонку костром и слил воду. Пока работает.'),
  N('c29_truth', w('truth_public'), 'На собрании в церкви Йестебурга правда про плазму сказана вслух. Теперь её знают все.'),
  N('c29_a_spoke', w('a_spoke'), '{A} встал в церкви и рассказал про колонию и впадину.'),
  N('c29_b_stood', w('b_stood'), '{B} стояла рядом с Ханной, когда та говорила про детскую палату.'),
  N('c29_volker', w('volker_gone'), 'Фолькер узнал от почтальонши: жена в Тоштедте прожила ещё неделю после того, как он закрыл дверь. Он ушёл туда один.'),
  N('c29_ole_taught', w('ole_taught'), 'Оле научил {A.acc} обращаться с отцовским ружьём.'),
  N('c29_ole_cap', w('ole_cap'), 'Хенрике отдала {A.dat} шапку Оле.'),
  N('c29_bread', w('bread_learned'), 'Хенрике научила {B.acc} печь ржаной хлеб на закваске.'),
  N('c29_nina_stays', w('nina_stays'), 'Хенрике сказала: Нина принадлежит хутору. Это решил Вернер десять лет назад.'),
  N('c29_sweep', { always: true }, 'В ночь на вторник, при минус десяти, дружина и солдаты пойдут на впадину у Гарльсторфа. Те, кто не пойдёт, держат дворы у насыпи.'),
  N('c29_count', w('hollow_count'), 'Тобиас говорит: во впадине четыреста или пятьсот. На морозе они медленные.'),
  N('c29_diesel', w('diesel_known'), 'У Брандта третий грузовик с колонны: солярка в бочках. Тем, кто пойдёт, дадут.'),
];

export const point29Sweep: JointDecision = {
  id: 'c3_new_sweep29', checkpoint: 29, canParticipate: P29,
  prompt: { default: 'В ночь на вторник — впадина у Гарльсторфа. Можно идти с дружиной и солдатами. Можно остаться и держать дворы у насыпи: туда побегут вспугнутые. Можно не участвовать: мороз сделает своё сам. Разные ответы — держать дворы.' },
  options: [
    { id: 'join', label: { default: 'Идти на впадину с дружиной' }, effects: [{ set: 'w.c29_sweep', value: 'join' }],
      text: 'В понедельник в десять вечера вы будете у пожарной части.' },
    { id: 'guard', label: { default: 'Остаться и держать дворы у насыпи' }, effects: [{ set: 'w.c29_sweep', value: 'guard' }],
      text: 'Вы останетесь. Дворы у насыпи: ваш, Уте, колония. Если побегут — сюда.' },
    { id: 'leave', label: { default: 'Не участвовать: мороз сделает сам' }, effects: [{ set: 'w.c29_sweep', value: 'leave' }],
      text: 'Вы не пойдёте и не будете стеречь. Ворота на засов, свет погашен.' },
  ],
  compromises: [{ pair: ['join', 'guard'], result: 'guard' }, { pair: ['join', 'leave'], result: 'guard' }, { pair: ['guard', 'leave'], result: 'guard' }],
  arbiters: [{ id: 'c29_sweep_guard', when: P29, winner: 'guard', text: 'Вы не сходитесь. Держите дворы.' }],
  default: 'guard',
};

export const point29Diesel: JointDecision = {
  id: 'c3_new_diesel29', checkpoint: 29, canParticipate: P29,
  prompt: { default: 'У Брандта солярка в бочках из третьего грузовика. Можно попросить бочку за участие. Можно ничего не просить. Можно потом взять самим, когда никто не будет спрашивать. Разные ответы — ничего не просить.' },
  options: [
    { id: 'trade', label: { default: 'Попросить бочку за участие' }, effects: [{ set: 'w.c29_diesel', value: 'trade' }],
      text: 'Вы попросите бочку. Брандт или Тобиас решат, сколько это стоит.' },
    { id: 'none', label: { default: 'Ничего не просить' }, effects: [{ set: 'w.c29_diesel', value: 'none' }],
      text: 'Вы ничего не попросите. Это не торг.' },
    { id: 'later', label: { default: 'Взять потом самим' }, effects: [{ set: 'w.c29_diesel', value: 'later' }],
      text: 'Потом. Когда никто не будет спрашивать. Если будет кому брать.' },
  ],
  compromises: [{ pair: ['trade', 'none'], result: 'none' }, { pair: ['trade', 'later'], result: 'none' }, { pair: ['none', 'later'], result: 'none' }],
  arbiters: [{ id: 'c29_diesel_none', when: P29, winner: 'none', text: 'Вы не сходитесь. Ничего не просите.' }],
  default: 'none',
};

