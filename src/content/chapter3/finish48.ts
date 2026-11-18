import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any } from './point18';
import { P48, bjornAlive48 } from './point48';

export const finished48: Cond = all(P48, any(flag('A.c48_finished'), flag('B.c48_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished48, when), text });

// Сверка в понедельник вечером.
export const point48Notes: MergeNote[] = [
  N('c48_hamburg', flag('w.c48_hamburg'), '{B} уехала с колонной в Гамбург вместе с Мерле. Обратно — четвёртого января, с Нильсом, если мост в Харбурге откроют.'),
  N('c48_radio', flag('w.c48_b_radio'), 'Вечером по рации из больницы в Эппендорфе передали в Винзен: все с хутора Людеманов доехали.'),
  N('c48_stamp', flag('w.c48_pass_stamped'), 'На пропуске Тобиаса теперь штамп Харбургского моста: двое, туда и обратно.'),
  N('c48_vouched', flag('w.c48_b_vouched'), 'На мосту {B} поручилась за больного гриппом: его пропустили.'),
  N('c48_man_left', flag('w.c48_man_left'), 'На мосту одного больного из колонны оставили у будки охраны.'),
  N('c48_offer', flag('w.c48_hamburg'), 'Старшая сестра отделения, Дагмар Вольтерс, зовёт {B} остаться до весны: комната, еда, свет, инсулин для Мерле.'),
  N('c48_bridge', any(flag('w.c48_b_knows_bridge'), flag('w.c48_a_bridge_warn')), 'После Сильвестра мост в Харбурге могут закрыть для гражданских: только колонны с бумагами.'),
  N('c48_march', flag('w.c48_b_knows_march'), 'Инсулина в больнице в Эппендорфе — до марта. Дальше там тоже не знают.'),
  N('c48_letter', flag('w.c48_letter_sent'), 'Письмо Тобиасу ушло с почтой Красного Креста.'),
  N('c48_sack', flag('w.c48_sack_sent'), 'Мешок картошки и банки из Вальдхофа ушли с колонной в винзенский спортзал.'),
  N('c48_r_a', flag('B.c48_rescuer'), 'Доктор Зандер зашила {A.dat} голову: девять швов, капельница. {B} весь день не отходила.'),
  N('c48_r_b', flag('A.c48_rescuer'), 'Доктор Зандер зашила {B.dat} голову: девять швов, капельница. {A} весь день не отходил.'),
  N('c48_bjorn', all(bjornAlive48, flag('w.c48_bjorn_visited')), 'Бьёрн Тиде один на своём дворе: шесть кур, дрова на месяц, еды на неделю. Уходить не хочет.'),
  N('c48_tiede_hens', flag('w.c48_tiede_hens'), 'Кур с пустого двора Тиде забрали на хутор: шесть штук, голодные и злые.'),
  N('c48_rope', flag('w.c48_rope'), 'От колокола у Зеве до кухни протянута верёвка: дёрнешь — в доме звякнет.'),
  N('c48_shelter', flag('w.c48_shelter_warm'), 'Шалаш поста у Зеве утеплён лапником и мешковиной.'),
  N('c48_lukas', flag('w.c48_lukas_watch'), 'Лукас в Сильвестр стоит в страже с вашим двором. Обещал без ракет.'),
  N('c48_julian', flag('w.c48_julian_alone'), 'Юлиан в Сильвестр будет один в будке у переезда: бабушка спит в девять.'),
  N('c48_bahr', flag('w.c48_bahr_food'), 'Барам в Люллау отнесли картошку и банки из Вальдхофа.'),
  N('c48_hansen', flag('w.c48_hansen_food'), 'Фрау Ханзен отнесли её долю из Вальдхофа.'),
  N('c48_hansen_inv', flag('w.c48_hansen_invite'), 'Фрау Ханзен зовёт зайти в Сильвестр на чашку.'),
  N('c48_jannes', flag('w.c48_jannes_for_us'), 'Яннес в Сильвестр стоит на посту у леса — «и за вас».'),
];

export const point48Bjorn: JointDecision = {
  id: 'c3_new_bjorn48', checkpoint: 48, canParticipate: all(P48, bjornAlive48),
  prompt: { default: 'Бьёрну Тиде шестнадцать, отца нет с субботы, он один на своём дворе. Взять его на хутор до весны; помогать, но пусть живёт у себя — еда, дрова, кто-то заходит; или оставить Брандту, дружина присмотрит. Разные ответы — помогать, пусть живёт у себя.' },
  options: [
    { id: 'take', label: { default: 'Взять на хутор до весны' }, effects: [{ set: 'w.c48_bjorn', value: 'take' }],
      text: 'Бьёрна позовёте на хутор до весны. С курами.' },
    { id: 'help', label: { default: 'Помогать, пусть живёт у себя' }, effects: [{ set: 'w.c48_bjorn', value: 'help' }],
      text: 'Бьёрн остаётся у себя. Кто-то из вас заходит через день, с едой.' },
    { id: 'brandt', label: { default: 'Оставить Брандту' }, effects: [{ set: 'w.c48_bjorn', value: 'brandt' }],
      text: 'Бьёрна оставите Брандту: дружина присмотрит.' },
  ],
  compromises: [{ pair: ['take', 'help'], result: 'help' }, { pair: ['take', 'brandt'], result: 'help' }, { pair: ['help', 'brandt'], result: 'help' }],
  arbiters: [{ id: 'c48_bjorn_help', when: P48, winner: 'help', text: 'Вы не сходитесь. Помогать, пусть живёт у себя.' }],
  default: 'help',
};

export const point48Uke: JointDecision = {
  id: 'c3_new_uke48', checkpoint: 48, canParticipate: all(P48, flag('w.c48_hamburg')),
  prompt: { default: '{B} в больнице в Эппендорфе, с Мерле. Вернуться с первой колонной, четвёртого января, как договаривались; или остаться там сестрой до весны — комната, еда, свет, инсулин для Мерле, — а мост, может быть, закроют. Разные ответы — вернуться четвёртого.' },
  options: [
    { id: 'back', label: { default: 'Вернуться четвёртого' }, effects: [{ set: 'w.c48_uke', value: 'back' }],
      text: '{B} вернётся четвёртого января, с Нильсом.' },
    { id: 'spring', label: { default: 'Остаться до весны' }, effects: [{ set: 'w.c48_uke', value: 'spring' }],
      text: '{B} остаётся в Эппендорфе до весны: сестрой в отделении, рядом с Мерле.' },
  ],
  compromises: [{ pair: ['back', 'spring'], result: 'back' }],
  arbiters: [{ id: 'c48_uke_back', when: P48, winner: 'back', text: 'Вы не сходитесь. {B} возвращается четвёртого.' }],
  default: 'back',
};
