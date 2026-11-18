import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P49, hurt49, silvester49, split49 } from './point49';

export const finished49: Cond = all(P49, any(flag('A.c49_finished'), flag('B.c49_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished49, when), text });
const w = (key: string, value: string): Cond => v(`w.c49_${key}`, value);

// Сверка в четверг, 31.12, в час дня.
export const point49Notes: MergeNote[] = [
  // Хутор и карьер
  N('c49_pit_killed', flag('w.c49_pit_killed'), 'В карьере за лесополосой стоял один, замёрзший. Его убили. На руке — браслет больницы в Харбурге, номер без имени. Двое других ушли по дну карьера в ельник на юге.'),
  N('c49_pit_marked', flag('w.c49_pit_marked'), 'Карьер за лесополосой помечен кольями: в нём стоит один, замёрзший, живой. Двое других ушли в ельник на юге.'),
  N('c49_pit_seen', all(not(flag('w.c49_pit_killed')), not(flag('w.c49_pit_marked')), flag('w.c49_knows_thaw'), any(flag('w.c49_pit_trail'), flag('w.c49_pit_counted'))), 'В карьере за лесополосой стоит один, замёрзший. Двое других ушли в ельник на юге.'),
  N('c49_pit_counted', flag('w.c49_pit_counted'), 'Вокруг карьера старые следы, восемь или десять, с оттепели: всё, что идёт с юга через лес, сползает туда.'),
  N('c49_pit_trail', flag('w.c49_pit_trail'), 'В ельнике за карьером кто-то есть: оттуда слышали треск.'),
  N('c49_thaw', flag('w.c49_knows_thaw'), 'С Нового года обещают оттепель: дождь, до плюс шести. В полночь — около нуля.'),
  N('c49_brandt_knows', flag('w.c49_brandt_knows'), 'Брандт знает про карьер. С десяти вечера там пост.'),
  N('c49_hollow', flag('w.c49_brandt_hollow'), 'Брандт вспомнил ноябрьскую облаву на впадине и поставил пост у карьера.'),
  N('c49_pit_gap', all(flag('w.c49_saw_pit_gap'), not(flag('w.c49_brandt_knows'))), 'В списке постов у карьера нет никого.'),
  N('c49_vol_a', v('A.c49_mq', 'volunteer'), '{A} вызвался на пост у карьера, с десяти вечера.'),
  N('c49_vol_b', v('B.c49_mq', 'volunteer'), '{B} вызвалась на пост у карьера, с десяти вечера.'),
  N('c49_noise', flag('w.c49_said_noise'), 'На совете у Брандта сказали вслух: огонь и колокол в полночь слышно далеко. Брандт ответил, что людям огонь всё равно нужен.'),
  N('c49_shift_saw', flag('w.c49_shift_saw'), 'Ночью с поста у Зеве видели одного на том берегу. Постоял у фонаря и ушёл в камыши.'),
  N('c49_rockets_taken', w('rockets', 'taken'), 'Ракеты и петарды Лукаса заперты у Брандта в шкафу с огнетушителями. Лукас ни с кем не разговаривает.'),
  N('c49_rockets_deal', w('rockets', 'deal'), 'С Лукасом договорились: в полночь одна ракета, с поля у ручья, в двух километрах от леса. Петарды — у {A.gen}.'),
  N('c49_rockets_left', all(w('rockets', 'left'), not(flag('w.c49_brandt_rockets'))), 'Ракеты Лукаса лежат у него на сеновале. Брандт о них не знает.'),
  N('c49_brandt_rockets', flag('w.c49_brandt_rockets'), 'Брандт знает про ракеты Лукаса.'),
  N('c49_lukas_reason', flag('w.c49_lukas_reason'), 'Лукасу ракеты нужны, «чтобы все смотрели вверх, а не в лес».'),
  N('c49_flow', flag('w.c49_a_counted'), 'Из Гамбурга, пока мост открыт, на юг идут люди: у развилки на Ханстедт до полудня насчитали девяносто.'),
  N('c49_gun', w('gun_man', 'guard'), 'На южной дороге дружина забрала у прохожего пистолет с восемью патронами.'),
  N('c49_light', flag('w.c49_a_heard_light'), 'Люди с южной дороги говорят: в Эппендорфе есть свет, в каждом окне.'),
  N('c49_lead', flag('w.c49_lead_set'), 'В комоде нашёлся старый набор для литья олова: в полночь будут гадать.'),
  N('c49_merle_feb', flag('w.c49_merle_feb'), 'Ветеринарного инсулина Мерле при нынешнем расходе — до середины февраля.'),
  // Бьёрн и соседи
  N('c49_bjorn_moved', flag('w.c49_bjorn_moved'), 'Бьёрн Тиде переехал на хутор, с курами. Ключ от отцовского дома носит на шее, на шнурке.'),
  N('c49_bjorn_found', flag('w.c49_bjorn_found'), 'Бьёрна нашли у лесополосы, там, где погиб его отец. С отцовским ружьём, незаряженным.'),
  N('c49_bjorn_gun', flag('w.c49_bjorn_gun_taken'), 'Ружьё Карстена теперь на хуторе.'),
  N('c49_bjorn_fire', flag('w.c49_bjorn_fire'), 'Бьёрн обещал прийти в Сильвестр к огню.'),
  N('c49_bjorn_nights', flag('w.c49_bjorn_nights'), 'Бьёрн не спит ночами: сидит на крыльце с ружьём отца. Дружинник присматривает, «но он не отец».'),
  N('c49_julian', flag('w.c49_julian_invited'), 'Юлиан придёт к вам в Сильвестр.'),
  N('c49_ute', flag('w.c49_ute_potatoes'), 'Уте отнесли мешок картошки: она сварит на всех у леса.'),
  N('c49_hansen', any(flag('w.c49_hansen_windows'), flag('w.c49_hansen_wood'), flag('w.c49_hansen_visit')), 'У фрау Ханзен были: окна к Сильвестру вымыты, дров до Нового года хватит.'),
  // Рация
  N('c49_a_love', w('a_radio', 'love'), 'По рации из Винзена {A} сказал {B.dat} одно: что любит.'),
  N('c49_a_news', w('a_radio', 'news'), '{A} по рации из Винзена: следы у карьера, оттепель с Нового года, мост со второго. Быть осторожной.'),
  N('c49_a_meet', w('a_radio', 'meet'), '{A} по рации из Винзена: «Четвёртого. У школы. Я буду».'),
  N('c49_a_wait', w('a_radio', 'wait'), '{A} по рации из Винзена: «Оставайся, раз там лучше. Я дождусь».'),
  N('c49_a_silent', w('a_radio', 'silent'), '{A} у рации в Винзене не смог сказать ни слова. За него сказал радист: «Он здесь. Он слышит».'),
  N('c49_b_love', w('b_radio', 'love'), 'По рации из Эппендорфа {B} сказала {A.dat}, что любит. По-русски: дежурная не поняла ни слова.'),
  N('c49_b_news', w('b_radio', 'news'), '{B} по рации из Эппендорфа: Мерле лучше, бумаги есть, свет есть.'),
  N('c49_b_bridge', w('b_radio', 'bridge'), '{B} по рации из Эппендорфа, дважды: «Со второго мост закрыт. Сюда не иди сам».'),
  N('c49_b_short', w('b_radio', 'short'), '{B} по рации из Эппендорфа: «Я здесь. Всё ровно».'),
  // Эппендорф
  N('c49_listed', flag('w.c49_b_listed'), '{B} вписана в список колонны Нильса на четвёртое января: печать Красного Креста.'),
  N('c49_merle_listed', flag('w.c49_merle_listed'), 'Мерле тоже вписана в список, на всякий случай.'),
  N('c49_fortnight', any(flag('w.c49_b_knows_fortnight'), flag('w.c49_a_nils_fortnight')), 'После второго января колонны через мост пойдут раз в две недели.'),
  N('c49_card', flag('w.c49_b_staff_card'), '{B} получила карту помощницы больницы: с ней можно остаться в городе и ездить с колоннами.'),
  N('c49_card_partner', flag('w.c49_b_card_partner'), 'На обороте карты карандашом: «Partner: {A}».'),
  N('c49_hypo', flag('w.c49_b_merle_hypo'), 'У Мерле на новой схеме был приступ: сахар упал. {B} была рядом и успела.'),
  N('c49_old_late', all(split49, v('B.c48_hbtr', 'rounds')), 'Старику из восьмой палаты отняли полстопы: пометку в карте врач увидел поздно.'),
  N('c49_merle_home', w('b_merle_view', 'home'), 'Мерле может поехать четвёртого с инсулином на два месяца или остаться до марта. {B} сказала ей: домой.'),
  N('c49_merle_stay', w('b_merle_view', 'stay'), 'Мерле может поехать четвёртого с инсулином на два месяца или остаться до марта. {B} сказала ей: оставайся.'),
  N('c49_merle_hers', w('b_merle_view', 'hers'), 'Мерле может поехать четвёртого с инсулином на два месяца или остаться до марта. {B} сказала: решай сама.'),
  N('c49_letter', flag('w.c49_b_letter2'), '{B} написала {A.dat} письмо на обороте схемы Мерле. Поедет с первой колонной.'),
];

export const point49Tracks: JointDecision = {
  id: 'c3_new_tracks49', checkpoint: 49, canParticipate: all(P49, { at: 'hof_luedemann' }),
  prompt: { default: 'Следы в карьере — с юга; ночью около нуля, с Нового года оттепель. В восемь на площади огонь, в полночь колокол. Просить Брандта закончить к одиннадцати, без колокола и ракет; стоять своими на посту у карьера, а праздник не трогать; или к полуночи держать свой двор дома, за запертой калиткой. Разные ответы — пост у карьера.' },
  options: [
    { id: 'short', label: { default: 'Просить Брандта: до одиннадцати, без колокола' }, effects: [{ set: 'w.c49_tracks', value: 'short' }],
      text: 'Пойдёте к Брандту: праздник — до одиннадцати, без колокола и ракет.' },
    { id: 'pit', label: { default: 'Стоять своими у карьера' }, effects: [{ set: 'w.c49_tracks', value: 'pit' }],
      text: 'Ночью у карьера будет и ваш пост.' },
    { id: 'gate', label: { default: 'К полуночи — домой, калитку запереть' }, effects: [{ set: 'w.c49_tracks', value: 'gate' }],
      text: 'К полуночи ваш двор дома, калитка заперта.' },
  ],
  compromises: [{ pair: ['short', 'pit'], result: 'pit' }, { pair: ['pit', 'gate'], result: 'pit' }, { pair: ['short', 'gate'], result: 'gate' }],
  arbiters: [{ id: 'c49_tracks_pit', when: P49, winner: 'pit', text: 'Вы не сходитесь. Ваш пост — у карьера.' }],
  default: 'pit',
};

export const point49Midnight: JointDecision = {
  id: 'c3_new_midnight49', checkpoint: 49, canParticipate: all(P49, not(split49)),
  prompt: { default: 'Где вы двое встретите полночь. У огня в Йестебурге, со всеми; вдвоём на посту у Зеве — отпустить часового к его семье; или дома, с детьми, Хенрике и оловом. Разные ответы — дома.' },
  options: [
    { id: 'fire', label: { default: 'У огня, со всеми' }, when: not(silvester49('stay')), effects: [{ set: 'w.c49_midnight', value: 'fire' }],
      text: 'Полночь вы встретите у огня в Йестебурге.' },
    { id: 'post', label: { default: 'Вдвоём на посту у Зеве' }, when: not(hurt49), effects: [{ set: 'w.c49_midnight', value: 'post' }],
      text: 'Полночь вы встретите вдвоём на посту у Зеве. Часовой пойдёт к своим.' },
    { id: 'home', label: { default: 'Дома, с детьми и оловом' }, effects: [{ set: 'w.c49_midnight', value: 'home' }],
      text: 'Полночь вы встретите дома, со всеми, кто останется на хуторе.' },
  ],
  compromises: [{ pair: ['fire', 'post'], result: 'home' }, { pair: ['fire', 'home'], result: 'home' }, { pair: ['post', 'home'], result: 'home' }],
  arbiters: [{ id: 'c49_midnight_home', when: P49, winner: 'home', text: 'Вы не сходитесь. Полночь — дома.' }],
  default: 'home',
};

export const point49Merle: JointDecision = {
  id: 'c3_new_merle49', checkpoint: 49, canParticipate: all(P49, split49),
  prompt: { default: 'Мерле в Эппендорфе, врач подобрал ей схему. Везти её домой четвёртого с колонной — с инсулином на два месяца, а дальше видно будет; или оставить в больнице до марта, где свет и врачи. Разные ответы — до марта.' },
  options: [
    { id: 'home', label: { default: 'Домой четвёртого' }, effects: [{ set: 'w.c49_merle', value: 'home' }],
      text: 'Мерле поедет домой четвёртого, с инсулином на два месяца.' },
    { id: 'stay', label: { default: 'Остаться до марта' }, effects: [{ set: 'w.c49_merle', value: 'stay' }],
      text: 'Мерле останется в Эппендорфе до марта.' },
  ],
  compromises: [{ pair: ['home', 'stay'], result: 'stay' }],
  arbiters: [{ id: 'c49_merle_stay', when: P49, winner: 'stay', text: 'Вы не сходитесь. Мерле остаётся до марта.' }],
  default: 'stay',
};
