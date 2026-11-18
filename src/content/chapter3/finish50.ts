import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P50, bite50, clean50, door50, leo50, marcus50, rocketDeal50, rocketsLoud50, slip50, split50 } from './point50';

export const finished50: Cond = all(P50, any(flag('A.c50_finished'), flag('B.c50_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished50, when), text });
const w = (key: string, value: string): Cond => v(`w.c50_${key}`, value);

// Сверка в пятницу, 1.1.2027, в четыре часа дня.
export const point50Notes: MergeNote[] = [
  // Ночь
  N('c50_clean', clean50, 'В новогоднюю ночь из ельника за карьером вышли двое, на свет и колокол. Их встретили у карьера. Никто не ранен.'),
  N('c50_slip', slip50, 'В новогоднюю ночь из ельника вышли четверо, на ракеты. Троих встретили у карьера, четвёртого Яннес догнал у забора колонии. Яннес цел, рукав разорван.'),
  N('c50_door', door50, 'В новогоднюю ночь из лесополосы вышел один, к колонии. Двери были заперты: колония знала. Яннес его остановил.'),
  N('c50_bite', bite50, 'В новогоднюю ночь у колонии укусили старика в синей шапке, Вилли, соседа Уте. К утру его не стало.'),
  N('c50_rockets', rocketsLoud50, 'В полночь Лукас запустил с площади три ракеты.'),
  N('c50_rocket_one', rocketDeal50, 'В полночь Лукас запустил одну ракету с поля у ручья, как договорились.'),
  N('c50_pit_end', flag('w.c50_pit_end'), 'Того, кто стоял у транспортёра в карьере, убили ночью на посту.'),
  N('c50_kiss_fire', w('kiss', 'fire'), 'Полночь {A} и {B} встретили у огня в Йестебурге.'),
  N('c50_kiss_post', w('kiss', 'post'), 'Полночь {A} и {B} встретили вдвоём на посту у Зеве.'),
  N('c50_kiss_home', w('kiss', 'home'), 'Полночь {A} и {B} встретили дома, на крыльце.'),
  N('c50_danced', flag('w.c50_danced'), 'У огня танцевали в грязи под аккордеон.'),
  N('c50_lead_ship', flag('w.c50_lead_ship'), 'В олове вышел корабль. Хенрике сказала: к дороге.'),
  N('c50_lead_key', flag('w.c50_lead_key'), 'В олове вышел ключ. Хенрике сказала: к новому дому.'),
  N('c50_lead_post', flag('w.c50_lead_post'), 'На посту отлили олово над фонарём: птица и ключ.'),
  N('c50_a_north', flag('w.c50_a_north'), 'В полночь {A} повернулся на север.'),
  N('c50_b_south', flag('w.c50_b_south'), 'В полночь {B} в Эппендорфе стояла лицом на юг.'),
  N('c50_bjorn', flag('w.c50_bjorn_fire_talk'), 'Бьёрн встречал Новый год у огня. «Папа бы сказал: слишком много дров».'),
  N('c50_julian', flag('w.c50_julian_fire'), 'Юлиан с бабушкой были у огня.'),
  // Утро
  N('c50_brandt_plan', flag('w.c50_a_pit_plan'), 'Брандт принял план: у карьера пост до весны, каждый двор по ночи в неделю. И ваш.'),
  N('c50_lukas', any(flag('w.c50_a_defended_lukas'), flag('w.c50_lukas_sorry')), 'Лукас ходил извиняться. «В следующем году без ракет».'),
  N('c50_box_open', w('box', 'open'), 'Шкатулку мужа фрау Ханзен открыли: его письмо «Für Erna», медаль за наводнение шестьдесят второго, фасоль своего сбора.'),
  N('c50_box_forced', w('box', 'forced'), 'Шкатулку мужа фрау Ханзен взломали: письмо надорвано, половина фасоли рассыпалась.'),
  N('c50_seeds_farm', w('seeds', 'farm'), 'У хутора есть фасоль на весну: сажать в мае, у южной стены.'),
  N('c50_seeds_colony', w('seeds', 'colony'), 'Фасоль мужа фрау Ханзен отдали в колонию, Уте.'),
  N('c50_hansen_letter', flag('w.c50_hansen_letter'), 'Письмо мужа фрау Ханзен прочитали ей вслух.'),
  N('c50_willi', flag('w.c50_willi_known'), 'Вилли каждое утро приносил детям Уте по яблоку из подвала.'),
  // Лео
  N('c50_leo_marcus', all(leo50, marcus50, flag('w.c50_marcus_north')), 'Маркус уходит с армией на север до весны. Лео он просит оставить у вас.'),
  N('c50_leo_alone', flag('w.c50_leo_orphan'), 'Маркуса не стало в Винзене. Лео привезла Вибке: он спрашивал про вас.'),
  N('c50_leo_ask', flag('w.c50_leo_asked'), 'Лео спросил одно слово: «Bleiben?»'),
  // Эппендорф
  N('c50_case_open', any(w('case', 'open'), w('case', 'forced')), 'Старик из восьмой палаты отдал банки повидла со своей яблони: «Boskoop 2026».'),
  N('c50_jam_farm', w('jam', 'farm'), 'Одна банка повидла едет на хутор, для Хенрике.'),
  N('c50_merle_packed', flag('w.c50_b_merle_packed'), 'Мерле собрала синюю сумку-холодильник: ручки на два месяца, иглы, полоски.'),
  N('c50_merle_drawing', flag('w.c50_b_merle_drawing'), 'Мерле нарисовала хутор и подписала: «Хенрике, кофе, вчетвером».'),
  N('c50_b_doubt', flag('w.c50_b_doubt'), '{B} сказала Вольтерс, что сомневается.'),
  N('c50_b_letter', flag('w.c50_b_letter_ny'), '{B} написала {A.dat} письмо в новогодний вечер. Поедет с колонной.'),
  N('c50_a_letter', flag('w.c50_a_letter_ny'), '{A} написал {B.dat} новогоднее письмо: смешное.'),
  N('c50_church', flag('w.c50_b_church_note'), 'В церкви у Альстера на доске записка: два имени, хутор, «alle gesund».'),
];

export const point50Pit: JointDecision = {
  id: 'c3_new_pit50', checkpoint: 50, canParticipate: all(P50, { at: 'hof_luedemann' }),
  prompt: { default: 'Оттепель до весны, и через карьер идёт всё, что выходит с юга из леса. Держать там пост по очереди дворов, и вашему — ночь в неделю; завалить въезды ветками и поставить колокол на столбе, чтобы слышали на хуторе и в колонии; или оставить карьер Брандту, а свои силы — на хутор. Разные ответы — колокол на столбе.' },
  options: [
    { id: 'post', label: { default: 'Пост по очереди, наша ночь в неделю' }, effects: [{ set: 'w.c50_pit', value: 'post' }],
      text: 'У карьера до весны пост по очереди дворов. Ваша ночь — раз в неделю.' },
    { id: 'bell', label: { default: 'Завалить въезды, колокол на столбе' }, effects: [{ set: 'w.c50_pit', value: 'bell' }],
      text: 'Въезды в карьер завалите ветками, на столб у края повесите колокол.' },
    { id: 'brandt', label: { default: 'Оставить карьер Брандту' }, effects: [{ set: 'w.c50_pit', value: 'brandt' }],
      text: 'Карьер — забота Брандта. Ваши силы — на хутор.' },
  ],
  compromises: [{ pair: ['post', 'bell'], result: 'bell' }, { pair: ['post', 'brandt'], result: 'bell' }, { pair: ['bell', 'brandt'], result: 'bell' }],
  arbiters: [{ id: 'c50_pit_bell', when: P50, winner: 'bell', text: 'Вы не сходитесь. Колокол на столбе.' }],
  default: 'bell',
};

export const point50Leo: JointDecision = {
  id: 'c3_new_leo50', checkpoint: 50, canParticipate: all(P50, { at: 'hof_luedemann' }, leo50),
  prompt: { default: 'Лео у калитки: Маркуса не будет до весны — или не будет вовсе. Взять его на хутор до весны, к детям и Хенрике; отправить с Вибке обратно в Винзен, в спортзал, и навещать; или вписать в список Брандта, чтобы дружина нашла ему место. Разные ответы — на хутор до весны.' },
  options: [
    { id: 'take', label: { default: 'Взять на хутор' }, effects: [{ set: 'w.c50_leo', value: 'take' }],
      text: 'Лео остаётся на хуторе до весны. Заяц сохнет на печке.' },
    { id: 'winsen', label: { default: 'В Винзен, и навещать' }, effects: [{ set: 'w.c50_leo', value: 'winsen' }],
      text: 'Лео вернётся в спортзал в Винзене. Вы будете навещать.' },
    { id: 'brandt', label: { default: 'В список Брандта' }, effects: [{ set: 'w.c50_leo', value: 'brandt' }],
      text: 'Лео впишут в список Брандта: дружина найдёт ему место.' },
  ],
  compromises: [{ pair: ['take', 'winsen'], result: 'take' }, { pair: ['take', 'brandt'], result: 'take' }, { pair: ['winsen', 'brandt'], result: 'winsen' }],
  arbiters: [{ id: 'c50_leo_take', when: P50, winner: 'take', text: 'Вы не сходитесь. Лео остаётся на хуторе.' }],
  default: 'take',
};

export const point50Bridge: JointDecision = {
  id: 'c3_new_bridge50', checkpoint: 50, canParticipate: all(P50, split50),
  prompt: { default: 'Со второго мост закрыт для гражданских, колонны — раз в две недели. Если колонну четвёртого не пустят: {B} ждёт в Эппендорфе следующую; или идёт через мост по пропуску Тобиаса, пешком. Если {B} остаётся до весны: {A} приезжает с колонной раз в две недели на ночь; {B} ездит домой; или только письма. Разные ответы — ждать колонну и письма.' },
  options: [
    { id: 'wait', label: { default: 'Ждать следующую колонну' }, when: not(v('w.c48_uke', 'spring')), effects: [{ set: 'w.c50_bridge', value: 'wait' }],
      text: 'Если четвёртого не пустят, {B} ждёт следующую колонну в Эппендорфе.' },
    { id: 'pass', label: { default: 'Пешком по пропуску Тобиаса' }, when: all(not(v('w.c48_uke', 'spring')), flag('w.c46_pass')), effects: [{ set: 'w.c50_bridge', value: 'pass' }],
      text: 'Если четвёртого не пустят, {B} идёт через мост пешком, по пропуску Тобиаса.' },
    { id: 'visit', label: { default: '{A} приезжает с колонной' }, when: v('w.c48_uke', 'spring'), effects: [{ set: 'w.c50_bridge', value: 'visit' }],
      text: '{A} будет приезжать в Эппендорф с колонной, раз в две недели, на ночь.' },
    { id: 'home', label: { default: '{B} ездит домой' }, when: v('w.c48_uke', 'spring'), effects: [{ set: 'w.c50_bridge', value: 'home' }],
      text: '{B} будет ездить на хутор с колонной, раз в две недели.' },
    { id: 'letters', label: { default: 'Только письма' }, when: v('w.c48_uke', 'spring'), effects: [{ set: 'w.c50_bridge', value: 'letters' }],
      text: 'До весны — письма с колонной. Без поездок.' },
  ],
  compromises: [{ pair: ['wait', 'pass'], result: 'wait' }, { pair: ['visit', 'home'], result: 'letters' }, { pair: ['visit', 'letters'], result: 'letters' }, { pair: ['home', 'letters'], result: 'letters' }],
  arbiters: [{ id: 'c50_bridge_wait', when: all(P50, not(v('w.c48_uke', 'spring'))), winner: 'wait', text: 'Вы не сходитесь. Ждать колонну.' },
    { id: 'c50_bridge_letters', when: all(P50, v('w.c48_uke', 'spring')), winner: 'letters', text: 'Вы не сходитесь. Письма.' }],
  default: 'wait',
};
