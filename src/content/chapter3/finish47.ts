import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P47 } from './point47';

export const finished47: Cond = all(P47, any(flag('A.c47_finished'), flag('B.c47_finished'), flag('A.c47_down'), flag('B.c47_down')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished47, when), text });
/** Кто может отвечать: на ногах — оба; если один выбыл — решает второй за двоих. */
const active: Cond = any({ partner: 'active' }, { partner: 'incapacitated' });

// Сверка в воскресенье вечером. Суббота у каждого своя — главное о ней; кто выбыл, того нашли и принесли домой.
export const point47Notes: MergeNote[] = [
  N('c47_a_down', flag('A.c47_down'), 'В субботу {A} не вернулся из лесополосы на своих ногах: его принесли на хутор без сознания, с разбитой головой. Хенрике перевязала, но кровь шла долго.'),
  N('c47_b_down', flag('B.c47_down'), 'В субботу {B} не вернулась с края лесополосы на своих ногах: её принесли на хутор без сознания, с разбитой головой. Хенрике перевязала, но кровь шла долго.'),
  N('c47_food_share', v('w.c47_food', 'share'), 'Из погреба Вальдхофа ваш двор получил долю по едокам: два мешка картошки, банки, окорок, мука.'),
  N('c47_food_more', v('w.c47_food', 'more'), 'Из погреба Вальдхофа ваш двор получил больше других. За это Брандт ждёт вас в Сильвестр в страже. Без разговоров.'),
  N('c47_food_half', v('w.c47_food', 'half'), 'Половину своей доли из Вальдхофа {A} отдал колонии: у них сгорело сено. Колония в Сильвестр встанет рядом с вами.'),
  N('c47_food_less', v('w.c47_food', 'less'), 'Из погреба Вальдхофа {A} взял меньше положенного: остальное — семьям с малыми детьми.'),
  N('c47_barn', v('w.c47_barn', 'burned'), 'Сарай Штёверов сгорел вместе с сеном. Три двора остались без сена до весны.'),
  N('c47_cab', any(v('w.c47_cabinet', 'code'), v('w.c47_cabinet', 'long'), v('w.c47_cabinet', 'bar')), 'В прихожей Вальдхофа {A} открыл охотничий шкаф Штёвера: патроны к двустволке, оленина, карта угодий.'),
  N('c47_map', flag('w.c47_hunt_map'), 'У {A.gen} — карта охотничьих угодий Штёвера: вышки, кормушки, где зимой ходит зверь. Для постов в Сильвестр.'),
  N('c47_k_told', v('w.c47_karsten_end', 'told'), 'Карстена Тиде укусили в лесополосе. {B} сказала Брандту. Карстен умер в дежурке пожарной части, с ним сидели. Сыну, Бьёрну, он оставил письмо.'),
  N('c47_k_shed', v('w.c47_karsten_end', 'shed'), 'Карстена Тиде укусили в лесополосе. {B} заперла его в сарайчике у края поля. Там он и обратился. Дверь выдержала.'),
  N('c47_k_truth', v('w.c47_karsten_end', 'truth'), 'Карстена Тиде укусили в лесополосе. {B} сказала ему правду. Он попрощался с сыном и ушёл в лес один.'),
  N('c47_k_hidden', v('w.c47_karsten_end', 'hidden'), 'Карстена Тиде укусили в лесополосе. {B} перевязала и промолчала. Ночью он обратился у себя дома. Бьёрна, его сына, дружина нашла утром укушенным.'),
  N('c47_ute', flag('w.c47_b_stretcher'), 'Уте весь день была на медпункте у лесополосы. Она держится лучше, чем думала сама.'),
];

export const point47Cellar: JointDecision = {
  id: 'c3_new_cellar47', checkpoint: 47, canParticipate: all(P47, active, any(v('w.c47_food', 'share'), v('w.c47_food', 'more'), v('w.c47_food', 'half'), v('w.c47_food', 'less'))),
  prompt: { default: 'Еда из Вальдхофа уже в погребе хутора. Оставить всё себе на январь; отнести часть Барам в Люллау и фрау Ханзен; или отправить часть в винзенский спортзал с завтрашней колонной. Разные ответы — Барам и фрау Ханзен.' },
  options: [
    { id: 'keep', label: { default: 'Оставить себе: январь будет худым' }, effects: [{ set: 'w.c47_cellar', value: 'keep' }],
      text: 'Всё из Вальдхофа остаётся в погребе хутора.' },
    { id: 'share', label: { default: 'Часть — Барам и фрау Ханзен' }, effects: [{ set: 'w.c47_cellar', value: 'share' }],
      text: 'Мешок картошки и банки — Барам в Люллау и фрау Ханзен.' },
    { id: 'point', label: { default: 'Часть — в винзенский спортзал с колонной' }, effects: [{ set: 'w.c47_cellar', value: 'point' }],
      text: 'Часть еды уедет завтра с колонной в винзенскую школу.' },
  ],
  compromises: [{ pair: ['keep', 'share'], result: 'share' }, { pair: ['keep', 'point'], result: 'share' }, { pair: ['share', 'point'], result: 'share' }],
  arbiters: [{ id: 'c47_cellar_share', when: P47, winner: 'share', text: 'Вы не сходитесь. Часть — Барам и фрау Ханзен.' }],
  default: 'share',
};

export const point47Posts: JointDecision = {
  id: 'c3_new_posts47', checkpoint: 47, canParticipate: all(P47, active),
  prompt: { default: 'До Нового года — ночные посты у Зеве и со стороны лесополосы. По двое на каждом посту, смены чаще и тяжелее; один на посту и верёвка колокола прямо к дому; или просить у Брандта людей из дружины в обмен на вашу стражу в Сильвестр. Разные ответы — один и верёвка к дому.' },
  options: [
    { id: 'double', label: { default: 'По двое на посту' }, effects: [{ set: 'w.c47_posts', value: 'double' }],
      text: 'До Нового года на каждом посту — по двое.' },
    { id: 'bell', label: { default: 'Один и верёвка колокола к дому' }, effects: [{ set: 'w.c47_posts', value: 'bell' }],
      text: 'На посту по одному, но от колокола протянут верёвку к дому.' },
    { id: 'brandt', label: { default: 'Попросить людей у Брандта' }, effects: [{ set: 'w.c47_posts', value: 'brandt' }],
      text: 'У Брандта попросите людей на посты — в обмен на вашу стражу в Сильвестр.' },
  ],
  compromises: [{ pair: ['double', 'bell'], result: 'bell' }, { pair: ['double', 'brandt'], result: 'bell' }, { pair: ['bell', 'brandt'], result: 'bell' }],
  arbiters: [{ id: 'c47_posts_bell', when: P47, winner: 'bell', text: 'Вы не сходитесь. Один на посту и верёвка к дому.' }],
  default: 'bell',
};
