import type { Scene } from '../../engine/content-types';
import { flag, not } from './world3';
import { npc } from './point19';
import { S38, bridge38, cab38, fed38, frost38, kasiaDeparts38, set38, until38, w38 } from './point38';

// Участок 38, ветка ухода на восток с Павлом (КТ37 pawel): машина Павла, мост, северный берег, дорога на Мёльн, привал, школа в Мёльне.
// У поста под Лауэнбургом дальше пропускают только с польскими бумагами: вы возвращаетесь по мосту до шести, к ночи — хутор и общая КТ38.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S38({ ...scene, for: 'any', chapter: 'ch3' });
const roadCamp = { at: bridge38, stock: 'c3_farm_stock', rest: false as const };

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
        text: 'Павел говорит с солдатом по-немецки, медленно, с акцентом.\n\n— Meine Leute. Ich bürge.\n\nМои люди. Я ручаюсь. Солдат смотрит на вас, на него, на очередь сзади. Машет рукой. Проезжайте.', effects: [set38('pr', 'pawel'), npc('pawel', 1), until38(9, 0)] },
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
      { id: 'c38_pd_eat', label: 'Поесть то, что дала с собой Хенрике', minutes: 90, terminal: true, goto: 'c38_p_post', ambientDuring: cab38,
        text: 'Хлеб с салом, два яйца вкрутую. Ты делишь на всех в машине. Павел ест и говорит.\n\n— Pani Henrike gotuje jak moja matka.\n\nПани Хенрике готовит как моя мать.', effects: [set38('pd', 'eat'), ...fed38, until38(13, 0)] },
      { id: 'c38_pd_walk', label: 'Выйти пройтись вдоль колонны', minutes: 90, terminal: true, goto: 'c38_p_post', ambientDuring: frost38,
        text: 'Семьи с детьми, старики, двое молодых с гитарой. Все говорят по-польски. Ты понимаешь одно слово из трёх. Кто-то протягивает тебе термос с чаем.', effects: [set38('pd', 'walk'), until38(13, 0)] },
      { id: 'c38_pd_sleep', label: 'Заснуть на заднем сиденье', minutes: 90, activity: 'rest', terminal: true, goto: 'c38_p_post', ambientDuring: cab38,
        text: 'Ты засыпаешь, прижавшись к мешку с мукой, и просыпаешься, когда машина уже снова едет.', effects: [set38('pd', 'sleep'), { body: 'fatigue', delta: -6 }, until38(13, 0)] },
    ] }),

  // Пост у Лауэнбурга: дальше на восток — только с польскими бумагами. Ветка возвращается домой к ночи (REWORK_PLAN.md, этап 13).
  X({ id: 'c38_p_post', title: 'Пост у Лауэнбурга', location: bridge38, camp: roadCamp, ambient: frost38, onEnter: [until38(14, 0)],
    text: [
      { text: 'Очередь доходит до «Пассата» к двум. Офицер в очках листает паспорта, ваши откладывает отдельно.' },
      { text: '— Weiter nach Osten nur mit polnischen Papieren. Befehl seit heute früh. Die Grenze an der Oder ist zu. Polen nimmt seine eigenen Leute auf, über ein Lager bei Stettin. Alle anderen — zurück.\n\nДальше на восток — только с польскими документами. Приказ с сегодняшнего утра. Граница на Одере закрыта. Польша принимает своих, через лагерь под Щецином. Все остальные — назад.' },
      { text: 'Павел выходит из машины и долго говорит с офицером, сначала по-немецки, потом по-польски, потом снова по-немецки. Возвращается, садится за руль и не заводит мотор.\n\n— Nie da się. Przepraszam.\n\nНе получится. Простите.' },
      { when: kasiaDeparts38, text: 'Кася выходит из микроавтобуса впереди и бежит к вам по обочине, в расстёгнутой куртке.' },
    ],
    actions: [
      { id: 'c38_pp_bye', label: 'Попрощаться с Павлом здесь и идти к мосту пешком', minutes: 30, terminal: true, goto: 'c38_p_back', ambientDuring: frost38,
        text: 'Павел обнимает вас по очереди, по-медвежьи, и суёт в карман бумажку с адресом под Щецином. «Jak się skończy — przyjedźcie». Когда кончится — приезжайте. Колонна трогается без вас. Вы стоите у поста, пока последняя машина не скрывается за поворотом.',
        effects: [set38('pp', 'bye'), npc('pawel', 2), until38(14, 30)] },
      { id: 'c38_pp_drive', label: 'Попросить Павла довезти до моста, пока не закрыли', minutes: 40, terminal: true, goto: 'c38_p_back', ambientDuring: cab38,
        text: 'Павел смотрит на указатель бензина, потом на вас, и разворачивает «Пассат» поперёк колонны. Двадцать километров назад вдоль Эльбы. У моста он выходит, обнимает обоих и говорит: «Benzyna — to nic. Ludzie — to coś». Бензин — ерунда. Люди — это что-то. Потом уезжает догонять своих.',
        effects: [set38('pp', 'drive'), npc('pawel', 3), until38(15, 0)] },
      { id: 'c38_pp_truck', label: 'Попроситься в армейский грузовик, который идёт на запад', minutes: 30, terminal: true, goto: 'c38_p_back', ambientDuring: cab38,
        text: 'Водитель кивает на кузов, не спрашивая. Вы прощаетесь с Павлом через опущенное стекло, наскоро, в шуме моторов. Брезент хлопает. Лауэнбург уходит назад.',
        effects: [set38('pp', 'truck'), until38(14, 40)] },
    ] }),

  X({ id: 'c38_p_back', title: 'Обратно до шести', location: bridge38, camp: roadCamp, ambient: frost38,
    onEnter: [w38('east_back', true)],
    text: [
      { text: 'Мост закрывают в шесть. Ты помнишь это утреннее «если вернуться, то только по этому мосту».' },
      { when: kasiaDeparts38, text: 'Кася ушла с Павлом дальше. Её польский паспорт пропустили. Она стояла у поста и не знала, радоваться или плакать, и вы обнимали её втроём, пока Павел не посигналил.' },
      { text: 'На мосту часовой смотрит на вас с удивлением: утром вы ехали на север. Записывает фамилии второй раз за день и поднимает шлагбаум. Под ногами гудит бетон. Внизу шуршит лёд.' },
      { text: 'Южный берег. Автобус Красного Креста на Винзен, потом попутный трактор, потом пешком. К хутору вы подходите в темноте.' },
    ],
    actions: [
      { id: 'c38_pk2_gate', label: 'Постучать в ворота', minutes: 420, terminal: true, goto: 'c38_checkpoint', ambientDuring: frost38,
        text: 'Ворота открывает Хенрике, в шали поверх ночной рубашки, с лампой. Смотрит на вас долго.\n\n— Ich hab die Betten nicht abgezogen.\n\nЯ не снимала бельё с ваших кроватей.\n\nИ уходит в дом первой, оставив дверь открытой.',
        effects: [set38('pk2', 'gate'), { set: '$.c38_finished', value: true }, { body: 'fatigue', delta: 8 }, until38(22, 30)] },
      { id: 'c38_pk2_hand', label: 'Идти последний километр молча, держась за руки', minutes: 420, terminal: true, goto: 'c38_checkpoint', ambientDuring: frost38,
        text: 'Последний километр вы идёте молча. Окно кухни горит: Хенрике не легла. Когда вы входите, она ставит на стол две тарелки, будто ждала именно к этому часу.',
        effects: [set38('pk2', 'hand'), { set: '$.c38_finished', value: true }, { body: 'fatigue', delta: 8 }, { body: 'stress', delta: -4 }, until38(22, 30)] },
    ] }),
];
