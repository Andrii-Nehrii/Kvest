import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { pawel36, tobias36, way36, east36 } from './point36';
import { P37, leaveAsked37 } from './point37';

export const finished37: Cond = all(P37, any(flag('A.c37_finished'), flag('B.c37_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished37, when), text });
const meA: Cond = { me: 'A' };
const meB: Cond = { me: 'B' };

// Сверка в среду, девять вечера. Реквизиция шла на линии A; канистра, если она у B, забирается здесь, один раз.
export const point37Notes: MergeNote[] = [
  { id: 'c37_diesel_b', when: all(finished37, meB, v('w.c37_lost', 'diesel'), { has: 'can_diesel_20' }), effects: [{ take: 'can_diesel_20' }] },
  N('c37_lost_gen', v('w.c37_lost', 'generator'), 'Утром Хаазе забрал генератор: «вы сами его записали». Вечером в доме керосиновая лампа.'),
  N('c37_lost_diesel', v('w.c37_lost', 'diesel'), 'Утром Хаазе забрал канистру солярки из третьего грузовика: имущество бундесвера. Трактор теперь стоит до весны.'),
  N('c37_lost_food', v('w.c37_lost', 'food'), 'Утром Хаазе забрал с хутора центнер картошки: продовольствие для войск на марше.'),
  N('c37_receipt', flag('w.c37_receipt'), '{A} взял у Хаазе расписку: что, сколько, номер части.'),
  N('c37_vouched', flag('w.c37_tobias_vouched'), 'Тобиас за вас поручился. Поэтому взяли только это.'),
  N('c37_paper_given', all(meB, v('w.c37_draft_paper', 'given')), '{A} передал тебе бумагу Хаазе: медперсонал пятнадцатого может уехать с армией, с питанием и жильём. Добровольно.'),
  N('c37_paper_refused_a', all(meA, v('w.c37_draft_paper', 'refused')), 'Ты сказал Хаазе, что она с армией не поедет. Она об этом не знает.'),
  N('c37_paper_burned_a', all(meA, v('w.c37_draft_paper', 'burned')), 'Бумагу Хаазе для неё ты сжёг в печке.'),
  N('c37_hen', flag('w.c37_hen_lost'), 'Рыжий солдат унёс курицу. Хенрике видела.'),
  N('c37_signal', any(v('w.c37_signal', 'bell'), v('w.c37_signal', 'shots'), v('w.c37_signal', 'runner')), 'У Брандта в листе дежурств записан сигнал вашего двора: {A} договорился с Лукасом.'),
  N('c37_alarm', any(v('w.c37_alarm', 'cans'), v('w.c37_alarm', 'bell')), 'На тропе от ручья {A} поставил сигнал: если кто-то пойдёт ночью, в доме услышат.'),
  N('c37_reeds', any(flag('w.c37_frozen_dead'), flag('w.c37_reeds_marked')), 'У камышей на Зеве вмёрз в лёд обращённый. На берегу теперь палка с красной тряпкой.'),
  N('c37_seed', flag('w.c37_seed_traded'), 'Хенрике отдала соседу семенную картошку за солярку.'),
  N('c37_registered', flag('w.c37_a_registered'), '{A} записался у Янника: вторая машина, рядом с водителем, в шесть.'),
  N('c37_pens_north', flag('w.c37_pens_north'), '{B} берёт с собой на север ручки инсулина для Мерле.'),
  N('c37_pens_okafor', flag('w.c37_pens_okafor'), '{B} отложила две ручки инсулина для Мерле: утром отдать Окафору.'),
  N('c37_saatbuch', flag('w.c37_saatbuch'), 'Хенрике отдала {B.dat} свою книгу посевов. «Тогда учи».'),
  N('c37_told_east', flag('w.c37_told_henrike_east'), '{B} сказала Хенрике, что вы, наверное, уйдёте. Хенрике ответила: идите с Богом и пишите.'),
  N('c37_cache', flag('w.c37_cache'), 'В подвале за старым шкафом теперь тайник: два мешка и шесть банок.'),
  N('c37_bread', flag('w.c37_bread'), 'Хенрике напекла хлеба в дорогу и на ночь, когда вернутся.'),
  N('c37_eva', v('w.c37_eva', 'stay'), 'Эва остаётся на хуторе.'),
  N('c37_eva_army', v('w.c37_eva', 'army'), 'Эва решила: пятнадцатого поедет с армией за Эльбу.'),
  N('c37_bergen', flag('w.c37_bergen_letter'), '{B} написала в Берген, матери Леи: что Лея жива и где её искать.'),
];

export const point37Leave: JointDecision = {
  id: 'c3_new_leave37', checkpoint: 37, canParticipate: all(P37, leaveAsked37),
  prompt: { default: 'Последнее слово. Остаться на хуторе — или уйти насовсем: с Павлом завтра в семь, через мост на восток, или с армией пятнадцатого, на двух местах Тобиаса. Назад пути не будет. Разные ответы — остаться.' },
  options: [
    { id: 'stay', label: { default: 'Остаёмся на хуторе' }, effects: [{ set: 'w.c37_leave', value: 'stay' }],
      text: 'Вы остаётесь на хуторе.' },
    { id: 'pawel', label: { default: 'Уходим с Павлом завтра' }, when: all(way36('east'), pawel36), effects: [{ set: 'w.c37_leave', value: 'pawel' }],
      text: 'Завтра в семь вы уходите с Павлом на восток. Насовсем.' },
    { id: 'army', label: { default: 'Уходим с армией пятнадцатого' }, when: all(east36('yes'), tobias36), effects: [{ set: 'w.c37_leave', value: 'army' }],
      text: 'Пятнадцатого в пять вы уходите с армией за Эльбу. Насовсем.' },
  ],
  compromises: [{ pair: ['stay', 'pawel'], result: 'stay' }, { pair: ['stay', 'army'], result: 'stay' }, { pair: ['pawel', 'army'], result: 'stay' }],
  arbiters: [{ id: 'c37_leave_stay', when: P37, winner: 'stay', text: 'Вы остаётесь.' }],
  default: 'stay',
};

export const point37Send: JointDecision = {
  id: 'c3_new_send37', checkpoint: 37, canParticipate: P37,
  prompt: { default: 'Завтра в Винзене. Кто не едет за мост — ехать ли с утра провожать и вечером встречать колонну, только проводить и вернуться к делам, или прощаться здесь, на хуторе. Разные ответы — только проводить.' },
  options: [
    { id: 'both', label: { default: 'Провожать утром и встречать вечером' }, effects: [{ set: 'w.c37_send', value: 'both' }],
      text: 'Завтра — в Винзен с утра и ещё раз вечером, встречать колонну с севера.' },
    { id: 'morning', label: { default: 'Только проводить утром' }, effects: [{ set: 'w.c37_send', value: 'morning' }],
      text: 'Завтра утром — проводить в Винзене. Потом домой, к делам.' },
    { id: 'none', label: { default: 'Прощаться здесь, на хуторе' }, effects: [{ set: 'w.c37_send', value: 'none' }],
      text: 'Прощаться будете здесь, у ворот. В Винзен не ехать.' },
  ],
  compromises: [{ pair: ['both', 'morning'], result: 'morning' }, { pair: ['both', 'none'], result: 'morning' }, { pair: ['morning', 'none'], result: 'morning' }],
  arbiters: [{ id: 'c37_send_morning', when: P37, winner: 'morning', text: 'Вы не сходитесь. Только проводить утром.' }],
  default: 'morning',
};
