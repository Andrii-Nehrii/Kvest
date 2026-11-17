import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P43, merle43 } from './point43';

export const finished43: Cond = all(P43, any(flag('A.c43_finished'), flag('B.c43_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished43, when), text });
const meA: Cond = { me: 'A' };
const meB: Cond = { me: 'B' };
const whoA: Cond = all(P43, any(meA, { partner: 'incapacitated' }));
const whoB: Cond = all(P43, any(meB, { partner: 'incapacitated' }));

// Сверка в воскресенье, половина девятого. Половины правды про ночь оттепели в сводку не попадают: каждый знает своё.
export const point43Notes: MergeNote[] = [
  N('c43_felix_farm', v('w.c43_felix', 'farm'), 'Феликс Ридель ночует в сарае на хуторе. С понедельника — ров у Зеве.'),
  N('c43_felix_ditch', v('w.c43_felix', 'ditch'), 'Феликс Ридель ночует при пожарной части. С понедельника — ров у Зеве.'),
  N('c43_felix_letter', flag('w.c43_felix_letter_sent'), 'Письмо Феликса матери ушло почтой Красного Креста в Ганновер.'),
  N('c43_vet5', { v: 'w.c43_vet_insulin', op: '==', value: 5 }, 'Из ветклиники Винзена привезли пять флаконов свиного инсулина U-40 и шприцы. Мерле на нём со вчерашнего вечера.'),
  N('c43_vet3', { v: 'w.c43_vet_insulin', op: '==', value: 3 }, 'Из ветклиники Винзена привезли три флакона свиного инсулина U-40. Два оставили для других.'),
  N('c43_nina', flag('w.c43_nina_signed'), 'Нину записали в школу Винзена с четвёртого января. Кровать у окна.'),
  N('c43_meds', flag('w.c43_zander_meds'), 'Для доктора Зандер привезли из Винзена йод, бинты и две упаковки антибиотика.'),
  N('c43_card', flag('w.c43_search_card'), 'На доске поиска в Винзене висит карточка: хутор Людеманов, все, кто жив.'),
  N('c43_offer', all(flag('w.c43_offer_known'), merle43), 'Красный Крест берёт в колонну на Гамбург 28-го тех, кому нужен инсулин. Место для Мерле свободно до 24-го. С ней может ехать один сопровождающий.'),
  N('c43_job', all(flag('w.c43_offer_known'), not(merle43)), 'Красный Крест зовёт медсестру в пункт Винзена: с понедельника по четверг, с ночёвкой, десять кило муки в неделю. С января.'),
  N('c43_council', { always: true }, 'Завтра в десять — совет дворов в пожарной части. Брандт хочет знать, кого не было на посту в ночь оттепели.'),
];

export const point43Council: JointDecision = {
  id: 'c3_new_council43', checkpoint: 43, canParticipate: whoB,
  prompt: { default: 'Завтра на совете Брандт спросит каждый двор про ночь оттепели: кто ушёл с поста у колонии, когда мёртвые прошли к Ханзенам. Говорить за ваш двор будет {A}. Что {A} скажет — решаешь ты.' },
  options: [
    { id: 'truth', label: { default: 'Всё, что знаем, как есть' }, effects: [{ set: 'w.c43_council', value: 'truth' }],
      text: '{A} скажет на совете всё, что знает ваш двор. Как есть.' },
    { id: 'yard', label: { default: 'Что ту ночь наш двор берёт на себя: лишние смены до весны' }, effects: [{ set: 'w.c43_council', value: 'yard' }],
      text: '{A} скажет: за ту ночь отвечает ваш двор. Лишние смены у Зеве — ваши, до весны.' },
    { id: 'silent', label: { default: 'Ничего: не наше дело называть' }, effects: [{ set: 'w.c43_council', value: 'silent' }],
      text: '{A} на совете промолчит.' },
  ],
  arbiters: [{ id: 'c43_council_silent', when: P43, winner: 'silent', text: 'Решить не успели. {A} промолчит.' }],
  default: 'silent',
  soloReason: 'Отвечала она: что скажет он, решает тот, кто знает другую половину.',
};

export const point43Convoy: JointDecision = {
  id: 'c3_new_convoy43', checkpoint: 43, canParticipate: all(whoA, merle43),
  prompt: { default: 'Колонна Красного Креста в Гамбург уходит двадцать восьмого. Место для Мерле и одно для сопровождающего, обратно — когда откроют дороги, может, весной. Ехать ли {B.dat} с ней — решаешь ты.' },
  options: [
    { id: 'go', label: { default: 'Отпустить её с Мерле в Гамбург' }, effects: [{ set: 'w.c43_convoy', value: 'go' }],
      text: '{A} решил: если Мерле поедет, {B} поедет с ней.' },
    { id: 'merle', label: { default: 'Мерле — да, если захочет. {B} — нет, остаётся' }, effects: [{ set: 'w.c43_convoy', value: 'merle' }],
      text: '{A} решил: если Мерле поедет, то без {B.gen}.' },
    { id: 'none', label: { default: 'Никто не едет: перезимуем на ветеринарном' }, effects: [{ set: 'w.c43_convoy', value: 'none' }],
      text: '{A} решил: в Гамбург не едет никто. Зимуют на ветеринарном инсулине.' },
  ],
  arbiters: [{ id: 'c43_convoy_none', when: P43, winner: 'none', text: 'Решить не успели. В Гамбург не едет никто.' }],
  default: 'none',
  soloReason: 'Отвечал он: отпустить ли её, решает тот, кто остаётся.',
};

export const point43Job: JointDecision = {
  id: 'c3_new_job43', checkpoint: 43, canParticipate: all(whoA, not(merle43)),
  prompt: { default: 'Пункт Красного Креста в Винзене зовёт {B.acc} медсестрой: с понедельника по четверг, с ночёвкой, за десять кило муки в неделю для двора. С января. Ответ даёшь ты.' },
  options: [
    { id: 'yes', label: { default: 'Да: пусть работает в Винзене' }, effects: [{ set: 'w.c43_job', value: 'yes' }],
      text: '{A} сказал: да. С января {B} работает в Винзене с понедельника по четверг.' },
    { id: 'part', label: { default: 'Только два дня в неделю, без ночёвки' }, effects: [{ set: 'w.c43_job', value: 'part' }],
      text: '{A} сказал: два дня в неделю, без ночёвки. Пусть Красный Крест согласится.' },
    { id: 'no', label: { default: 'Нет: она нужна здесь' }, effects: [{ set: 'w.c43_job', value: 'no' }],
      text: '{A} сказал: нет. {B} остаётся на хуторе.' },
  ],
  arbiters: [{ id: 'c43_job_no', when: P43, winner: 'no', text: 'Решить не успели. {B} остаётся на хуторе.' }],
  default: 'no',
  soloReason: 'Отвечал он: отпустить ли её, решает тот, кто остаётся.',
};
