import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P42, jonasMet42, nina42 } from './point42';

export const finished42: Cond = all(P42, any(flag('A.c42_finished'), flag('B.c42_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished42, when), text });
const bj = (x: string): Cond => v('w.c42_brandt_jonas', x);
const vouched = any(bj('vouch'), bj('self'));

// Сверка в пятницу, половина девятого вечера.
export const point42Notes: MergeNote[] = [
  N('c42_jonas', jonasMet42, '{A} нашёл в лесополосе, в яме под поваленным дубом, солдата-срочника Феликса Риделя. Девятнадцать лет, сбежал в ноябре из ложбины под Гарльсторфом. Яйца из курятников таскал он.'),
  N('c42_jonas_came', flag('w.c42_jonas_came'), 'Феликс пришёл на хутор вместе с {A.ins}. Пока спит в сарае, на сене.'),
  N('c42_jonas_letter', flag('w.c42_jonas_letter'), 'У {A.gen} письмо Феликса матери в Ганновер: передать через Красный Крест.'),
  N('c42_vouch', bj('vouch'), '{A} поручился за Феликса перед Брандтом: собак не будет, если в понедельник парень выйдет на ров.'),
  N('c42_self', bj('self'), '{A} сказал Брандту, что разберётся в лесополосе сам. Срок — до утра субботы, потом собаки.'),
  N('c42_sweep_dogs', all(not(vouched), not(v('w.c42_sweep', 'no_dogs'))), 'В субботу в семь утра люди Брандта пройдут лесополосу с собаками: ищут того, кто таскает яйца.'),
  N('c42_sweep_nodogs', v('w.c42_sweep', 'no_dogs'), 'В субботу люди Брандта пройдут лесополосу. Без собак: {A} уговорил.'),
  N('c42_gun_guard', v('w.c42_gun', 'guard'), 'Ружьё Людеманов с шестью патронами ушло на ночную стражу у Зеве. Расписка — у Хенрике.'),
  N('c42_gun_me', v('w.c42_gun', 'me'), '{A} теперь в ночной страже у Зеве с ружьём Людеманов: понедельник, среда, пятница, с восьми.'),
  N('c42_gun_home', v('w.c42_gun', 'home'), 'Ружьё на стражу не отдали. Лукас сказал: Брандт это запомнит.'),
  N('c42_thomas', flag('w.c42_thomas_heard'), 'По радио Томас Брокман из Торонто поблагодарил мужчину с хутора Людеманов за ответ.'),
  N('c42_thomas_asks', flag('w.c42_thomas_asks'), 'Томас Брокман из Торонто снова спрашивал по радио про родителей.'),
  N('c42_tree', flag('w.c42_tree'), 'В кухне стоит ёлка из лесополосы.'),
  N('c42_tree_candles', flag('w.c42_tree_candles'), 'На ёлке настоящие свечи. Зажигать только при ком-то, ведро с водой рядом.'),
  N('c42_ute_go', v('w.c42_ute', 'go'), 'Уте ждёт вас в первый день Рождества к обеду.'),
  N('c42_ute_invite', v('w.c42_ute', 'invite'), 'Уте придёт к вам на Рождество со своей курицей.'),
  N('c42_ute_both', v('w.c42_ute', 'both'), 'Сочельник — у вас, вместе с Уте. Первый день Рождества — у неё.'),
  N('c42_hansen', flag('w.c42_hansen_invited'), 'Фрау Ханзен придёт к вам на Рождество.'),
  N('c42_merle_low', flag('w.c42_merle_low'), 'Утром у Мерле упал сахар: вечером она отдала свой ужин детям. Отпоили.'),
  N('c42_merle_promise', flag('w.c42_merle_promise'), '{B} пообещала Мерле: если инсулин кончится, отвезти её в больницу в Люнебург.'),
  N('c42_nina', v('w.c42_nina_school', 'for'), 'Нина хочет в школу в Винзене. {B} обещала ей поговорить со всеми.'),
  N('c42_mondays', flag('w.c42_mondays'), '{B} пообещала: по понедельникам к тем, кого кормила Хенрике, снова будут приходить.'),
  N('c42_inv_bahr', all(flag('w.c42_visit_invited'), any(v('w.c42_visit', 'bahr'), v('w.c42_visit', 'both'))), 'На Рождество придут Бары из Люллау: Коринна и двое маленьких.'),
  N('c42_inv_lars', all(flag('w.c42_visit_invited'), any(v('w.c42_visit', 'lars'), v('w.c42_visit', 'both'))), 'На Рождество придёт Юлиан от переезда с бабушкой.'),
  N('c42_lars', flag('w.c42_lars_work'), 'С понедельника Юлиан от переезда приходит работать за еду. К семи.'),
  N('c42_paul', flag('w.c42_weihnachtsmann'), 'Эрик Бар ждёт Деда Мороза. {B} сказала, что он придёт.'),
  N('c42_lea', flag('w.c42_lea_letter'), 'От Леи пришло письмо: весной вернётся. {B} отправила ответ с Лукасом.'),
  N('c42_advent_n', v('w.c42_advent_guests', 'neighbors'), 'Завтра в три на адвентский кофе придут Ханзены и Уте.'),
  N('c42_advent_b', v('w.c42_advent_guests', 'brothers'), 'Завтра в три на адвентский кофе придут братья Айдын.'),
];

export const point42Church: JointDecision = {
  id: 'c3_new_church42', checkpoint: 42, canParticipate: P42,
  prompt: { default: 'В сочельник в шесть — служба в церкви Святого Мартина в Йестебурге. Церковь холодная, обратно — четыре километра в темноте. Идти всем домом, только тем, кто хочет, или остаться дома. Разные ответы — идут те, кто хочет.' },
  options: [
    { id: 'all', label: { default: 'Всем домом' }, effects: [{ set: 'w.c42_church', value: 'all' }],
      text: 'В сочельник в церковь идёте всем домом.' },
    { id: 'some', label: { default: 'Только тем, кто хочет' }, effects: [{ set: 'w.c42_church', value: 'some' }],
      text: 'В сочельник в церковь пойдут те, кто хочет. Остальные — дома, у печи.' },
    { id: 'home', label: { default: 'Остаться дома' }, effects: [{ set: 'w.c42_church', value: 'home' }],
      text: 'В церковь не пойдёте. Сочельник — дома.' },
  ],
  compromises: [{ pair: ['all', 'some'], result: 'some' }, { pair: ['all', 'home'], result: 'some' }, { pair: ['some', 'home'], result: 'some' }],
  arbiters: [{ id: 'c42_church_some', when: P42, winner: 'some', text: 'Вы не сходитесь. Пойдут те, кто хочет.' }],
  default: 'some',
};

export const point42Jonas: JointDecision = {
  id: 'c3_new_jonas42', checkpoint: 42, canParticipate: all(P42, jonasMet42),
  prompt: { default: 'Феликс, срочник из лесополосы. Взять его на хутор до весны: сарай, работа со всеми. Кормить, но пусть живёт сам. Или отвести к Брандту: пусть решает округ. Разные ответы — кормить.' },
  options: [
    { id: 'take', label: { default: 'Взять на хутор до весны' }, effects: [{ set: 'w.c42_jonas_fate', value: 'take' }],
      text: 'Феликс остаётся на хуторе до весны. Спит в сарае, работает со всеми.' },
    { id: 'feed', label: { default: 'Кормить, но пусть живёт сам' }, effects: [{ set: 'w.c42_jonas_fate', value: 'feed' }],
      text: 'Феликса кормите, но жить он будет сам.' },
    { id: 'brandt', label: { default: 'Отвести к Брандту' }, effects: [{ set: 'w.c42_jonas_fate', value: 'brandt' }],
      text: 'В понедельник Феликса отведут к Брандту.' },
  ],
  compromises: [{ pair: ['take', 'feed'], result: 'feed' }, { pair: ['take', 'brandt'], result: 'feed' }, { pair: ['feed', 'brandt'], result: 'feed' }],
  arbiters: [{ id: 'c42_jonas_feed', when: P42, winner: 'feed', text: 'Вы не сходитесь. Кормить, но пусть живёт сам.' }],
  default: 'feed',
};

export const point42School: JointDecision = {
  id: 'c3_new_school42', checkpoint: 42, canParticipate: all(P42, nina42, flag('w.c42_school_known')),
  prompt: { default: 'С четвёртого января в Винзене школа для детей округа: с ночёвкой, автобус в понедельник, домой в пятницу. Отпустить Нину, оставить на хуторе или пусть решает сама. Разные ответы — решает сама.' },
  options: [
    { id: 'go', label: { default: 'Отпустить в школу' }, effects: [{ set: 'w.c42_school', value: 'go' }],
      text: 'С четвёртого января Нина едет в школу в Винзен.' },
    { id: 'home', label: { default: 'Оставить на хуторе' }, effects: [{ set: 'w.c42_school', value: 'home' }],
      text: 'Нина остаётся на хуторе. Школа подождёт.' },
    { id: 'herself', label: { default: 'Пусть решает сама' }, effects: [{ set: 'w.c42_school', value: 'herself' }],
      text: 'Про школу Нина решит сама.' },
  ],
  compromises: [{ pair: ['go', 'home'], result: 'herself' }, { pair: ['go', 'herself'], result: 'herself' }, { pair: ['home', 'herself'], result: 'herself' }],
  arbiters: [{ id: 'c42_school_herself', when: P42, winner: 'herself', text: 'Вы не сходитесь. Нина решит сама.' }],
  default: 'herself',
};
