import type { Scene } from '../../engine/content-types';
import { flag, not } from './world3';
import { npc } from './point19';
import { S38, bridge38, cab38, fed38, frost38, hall38, kasiaDeparts38, moelln38, set38, until38, w38 } from './point38';

// Участок 38, ветка ухода на восток с Павлом (КТ37 pawel): машина Павла, мост, северный берег, дорога на Мёльн, привал, школа в Мёльне.
// Дальше истории для этой ветки пока нет: после КТ38 — экран «здесь пока заканчивается» (STOCK_PLAN §10.1 п. 3).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S38({ ...scene, for: 'any', chapter: 'ch3' });
const roadCamp = { at: bridge38, stock: 'c3_farm_stock', rest: false as const };
const moellnCamp = { at: moelln38, stock: 'c3_farm_stock', rest: false as const };

export const day38PScenes: Scene[] = [
  X({ id: 'c38_p_board', title: 'Серый «Пассат»', location: bridge38, camp: roadCamp, ambient: cab38,
    text: [
      { text: 'Вы садитесь на заднее сиденье «Пассата». Между вами мешок с мукой. Павел за рулём, рядом с ним его двоюродный брат, молчаливый, с усами.' },
      { when: kasiaDeparts38, text: 'Кася в микроавтобусе впереди. Через заднее стекло видно её шапку.' },
      { text: 'Колонна трогается. Школа, ворота, Винзен. Позади, за полями, остаётся всё.' },
    ],
    actions: [
      { id: 'c38_pb_back', label: 'Смотреть назад, пока видно Винзен', minutes: 60, terminal: true, goto: 'c38_p_bridge', ambientDuring: cab38,
        text: 'Колокольня, водонапорная башня, крыши. Потом лес. Ты поворачиваешься вперёд и встречаешь в зеркале взгляд Павла. Он ничего не говорит.', effects: [set38('pb', 'back'), { body: 'stress', delta: 4 }, until38(7, 45)] },
      { id: 'c38_pb_hand', label: 'Взять {partner.acc} за руку', minutes: 60, terminal: true, goto: 'c38_p_bridge', ambientDuring: cab38,
        text: 'Рука в перчатке. Вы держитесь через мешок с мукой. До моста никто не говорит ни слова.', effects: [set38('pb', 'hand'), { body: 'stress', delta: -3 }, until38(7, 45)] },
      { id: 'c38_pb_pawel', label: 'Спросить Павла, что дальше', minutes: 60, terminal: true, goto: 'c38_p_bridge', ambientDuring: cab38,
        text: '— Mölln dziś. Jutro Schwerin, jeśli benzyna. Potem zobaczymy. — Павел пожимает плечами. Сегодня Мёльн. Завтра Шверин, если хватит бензина. Потом посмотрим.', effects: [set38('pb', 'pawel'), until38(7, 45)] },
    ] }),

  X({ id: 'c38_p_bridge', title: 'Мост', location: bridge38, camp: roadCamp, ambient: frost38,
    text: [
      { text: 'Мост через Эльбу. Шлагбаум, бетонные блоки, солдаты. По реке идёт лёд. Солдат с папкой обходит колонну и сверяет фамилии.' },
      { when: flag('w.c36_east_listed'), text: 'Ваши фамилии в списке колонны есть.' },
      { when: not(flag('w.c36_east_listed')), text: 'Ваших фамилий в списке нет. Павел выходит из машины и идёт к солдату сам.' },
    ],
    actions: [
      { id: 'c38_pr_papers', label: 'Показать документы и молчать', minutes: 45, terminal: true, goto: 'c38_p_bank', ambientDuring: frost38,
        text: 'Солдат светит фонарём на документы, на лица. Кивает. Шлагбаум поднимается. Под колёсами гудит мост. Внизу шуршит лёд. Вы на том берегу.', effects: [set38('pr', 'papers'), until38(9, 0)] },
      { id: 'c38_pr_pawel', label: 'Выйти вместе с Павлом', when: not(flag('w.c36_east_listed')), minutes: 45, terminal: true, goto: 'c38_p_bank', ambientDuring: frost38,
        text: 'Павел говорит с солдатом по-немецки, медленно, с акцентом: «Meine Leute. Ich bürge». Мои люди. Я ручаюсь. Солдат смотрит на вас, на него, на очередь сзади. Машет рукой. Проезжайте.', effects: [set38('pr', 'pawel'), npc('pawel', 1), until38(9, 0)] },
      { id: 'c38_pr_river', label: 'Смотреть на реку, пока ждёте', minutes: 45, terminal: true, goto: 'c38_p_bank', ambientDuring: frost38,
        text: 'Белые плиты льда медленно идут вниз по течению. Если вернуться, то только по этому мосту. А мост закроют в шесть.', effects: [set38('pr', 'river'), until38(9, 0)] },
    ] }),

  X({ id: 'c38_p_bank', title: 'Северный берег', location: bridge38, camp: roadCamp, ambient: frost38,
    text: [
      { text: 'Колонна встаёт за мостом, на площадке у заправки: ждут отставших. Отсюда видно южный берег — тёмная полоса леса. Где-то там, за лесом, хутор.' },
      { text: 'Северная колонна Красного Креста уходит налево, на Аренсбург. Колонна Павла — направо, на восток.' },
    ],
    actions: [
      { id: 'c38_pk_look', label: 'Смотреть на южный берег', minutes: 60, terminal: true, goto: 'c38_p_road', ambientDuring: frost38,
        text: 'Ты стоишь у отбойника и смотришь, пока не начинают слезиться глаза. От ветра. Только от ветра.', effects: [set38('pk', 'look'), { body: 'stress', delta: 5 }, until38(10, 15)] },
      { id: 'c38_pk_talk', label: 'Поговорить с {partner.ins}: правильно ли', minutes: 60, terminal: true, goto: 'c38_p_road', ambientDuring: frost38,
        text: 'Вы говорите тихо, отойдя от машин. Правильно, неправильно — мост уже позади. Но сказать это вслух нужно. Вы говорите. Становится чуть легче.', effects: [set38('pk', 'talk'), { body: 'stress', delta: -3 }, until38(10, 15)] },
      { id: 'c38_pk_help', label: 'Помочь с машиной, у которой спустило колесо', minutes: 60, activity: 'moderate', terminal: true, goto: 'c38_p_road', ambientDuring: frost38,
        text: 'Домкрат, ключ, запаска. Руки примерзают к металлу. Хозяин машины, пожилой поляк, жмёт тебе руку и говорит что-то длинное. Павел переводит: «Он говорит, ты свой».', effects: [set38('pk', 'help'), { body: 'fatigue', delta: 4 }, until38(10, 15)] },
    ] }),

  X({ id: 'c38_p_road', title: 'Дорога на восток', location: bridge38, camp: roadCamp, ambient: cab38,
    text: [
      { text: 'Дорога вдоль Эльбы на восток, к Лауэнбургу, потом на Мёльн. Деревни пустые, в одной из окон смотрит старик и не машет.' },
      { text: 'У Лауэнбурга колонна встаёт: армейский пост, проверка, медленно. Павел выключает мотор, чтобы не жечь бензин.' },
    ],
    actions: [
      { id: 'c38_pd_eat', label: 'Поесть то, что дала с собой Хенрике', minutes: 90, terminal: true, goto: 'c38_p_camp', ambientDuring: cab38,
        text: 'Хлеб с салом, два яйца вкрутую. Ты делишь на всех в машине. Павел ест и говорит: «Pani Henrike gotuje jak moja matka». Пани Хенрике готовит как моя мать.', effects: [set38('pd', 'eat'), ...fed38, until38(13, 0)] },
      { id: 'c38_pd_walk', label: 'Выйти пройтись вдоль колонны', minutes: 90, terminal: true, goto: 'c38_p_camp', ambientDuring: frost38,
        text: 'Семьи с детьми, старики, двое молодых с гитарой. Все говорят по-польски. Ты понимаешь одно слово из трёх. Кто-то протягивает тебе термос с чаем.', effects: [set38('pd', 'walk'), until38(13, 0)] },
      { id: 'c38_pd_sleep', label: 'Заснуть на заднем сиденье', minutes: 90, activity: 'rest', terminal: true, goto: 'c38_p_camp', ambientDuring: cab38,
        text: 'Ты засыпаешь, прижавшись к мешку с мукой, и просыпаешься, когда машина уже снова едет.', effects: [set38('pd', 'sleep'), { body: 'fatigue', delta: -6 }, until38(13, 0)] },
    ] }),

  X({ id: 'c38_p_camp', title: 'Мёльн', location: moelln38, camp: moellnCamp, ambient: hall38, onEnter: [until38(16, 0)],
    text: [
      { text: 'Мёльн. Спортзал школы, раскладушки, армейская кухня во дворе. Колонна Павла ночует здесь: дальше, говорят, дорога не чищена.' },
      { text: 'Павел приносит новость с армейского поста: граница на Одере закрыта. Польша принимает своих только через лагерь под Щецином, по спискам. Он садится на раскладушку и долго молчит.' },
    ],
    actions: [
      { id: 'c38_pc_pawel', label: 'Сесть рядом с Павлом', minutes: 60, terminal: true, goto: 'c38_p_night',
        text: '— Pojedziemy do granicy. Poczekamy. — Павел трёт лицо ладонями. Доедем до границы. Подождём. — A wy… nie wiem. Nie wiem, co z wami.\n\nА вы… не знаю. Не знаю, что с вами.', effects: [set38('pc', 'pawel'), w38('east_border', true), npc('pawel', 1), until38(19, 0)] },
      { id: 'c38_pc_soup', label: 'Встать в очередь к армейской кухне', minutes: 60, terminal: true, goto: 'c38_p_night',
        text: 'Гороховый суп из полевой кухни, по половнику. Солдат на раздаче спрашивает, откуда вы. Ты говоришь. Он кивает: «Von drüben. Gut, dass ihr rüber seid». С того берега. Хорошо, что успели перебраться.', effects: [set38('pc', 'soup'), ...fed38, until38(19, 0)] },
      { id: 'c38_pc_register', label: 'Зарегистрироваться у армейского поста', minutes: 60, terminal: true, goto: 'c38_p_night',
        text: 'Офицер записывает фамилии, откуда, куда. «Osten? Mit den Polen?» На восток? С поляками? Пожимает плечами и ставит штамп. Теперь вы есть в списке с этой стороны реки.', effects: [set38('pc', 'register'), w38('east_registered', true), until38(19, 0)] },
    ] }),

  X({ id: 'c38_p_night', title: 'Ночь за рекой', location: moelln38, camp: { ...moellnCamp, rest: 'sleep' as const }, ambient: hall38,
    text: [
      { text: 'Спортзал затихает. Кто-то храпит, кто-то плачет во сне. Вы лежите на соседних раскладушках, сдвинутых вплотную.' },
      { text: 'Мост закрыт. Хутор на том берегу. Сегодня вы впервые за месяц спите не под крышей Хенрике.' },
    ],
    actions: [
      { id: 'c38_pn_talk', label: 'Шёпотом говорить, пока не уснёте', minutes: 30, terminal: true, goto: 'c38_p_checkpoint',
        text: 'Вы говорите о Хенрике, о корове, о том, кто завтра подоит её вместо вас. Потом о Польше, о границе, о лагере под Щецином. Потом замолкаете.', effects: [set38('pn', 'talk'), { set: '$.c38_finished', value: true }, until38(23, 30)] },
      { id: 'c38_pn_sleep', label: 'Уснуть', minutes: 30, terminal: true, goto: 'c38_p_checkpoint',
        text: 'Ты засыпаешь сразу. Тебе снится хутор, и во сне ты не помнишь, что уехал{m:|а}.', effects: [set38('pn', 'sleep'), { set: '$.c38_finished', value: true }, until38(23, 30)] },
    ] }),

  X({ id: 'c38_p_checkpoint', title: 'За Эльбой', location: moelln38, checkpoint: 38, universal: false, camp: moellnCamp,
    text: [{ text: 'Половина двенадцатого. Мост закрыт. Вы на северном берегу.' }], actions: [] }),
];
