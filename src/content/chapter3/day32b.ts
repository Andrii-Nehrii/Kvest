import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import {
  S32, fed32, finish32, frost32, jest32, ninaGoes32, ninaWinsen32, okaforHere32, own32, set32, truck32, until32, volunteerB, w32, winsen32,
} from './point32';

// Участок 32, линия B: Винзен. Человек из прошлого — Окафор с жильцами дома в Бармбеке; Нина и школа; лекарства для пункта.
// Обязательная сцена с ключами (`c32_b_okafor`): «тот, что с красной ниткой, — сверху» — подсказка находки B в 33-й.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S32({ ...scene, for: 'any', chapter: 'ch3' });
const trip = (at: string, rest: false | 'sleep' = false) => ({ at, stock: 'c3_farm_stock', rest });
const hall = { tempC: 14, outdoor: false, wet: false };
const photo: Cond = any({ has: 'c27_photo' }, { has: 'c27_photo_torn' });
const merleAsked: Cond = any(flag('B.asked_merle_ride'), flag('B.okafor_merle'), flag('B.merle_plan_known'));
const svenjaKnock: Cond = flag('B.svenja_knock');
const nina15stay: Cond = v('w.c15_nina', 'stay');
const ninaWith: Cond = flag('$.c32_nina_with');
/** Нина остаётся в Винзене до Рождества — только на этой линии, только Нина. */
const ninaStays: Effect[] = [set32('nina', 'stays'), w32('nina', 'winsen'), { npc: 'c7_nina', moveTo: winsen32 }];
const ninaBack: Effect[] = [set32('nina', 'back'), w32('nina', 'farm'), { npc: 'c7_nina', moveTo: 'hof_luedemann' }];
/** Ответ Окафора или, если его нет, фрау Петерсен. */
const who = (ok: string, pet: string, effects: Effect[], goto: string) => [
  { id: 'ok', when: okaforHere32, text: ok, goto, effects },
  { id: 'pet', text: pet, goto, effects },
];
const okaforMeet: Effect[] = [{ npc: 'okafor', moveTo: winsen32 }, { set: '$.met.okafor', value: true }];

export const day32BScenes: Scene[] = [
  // ═════════════ Среда ═════════════
  B({ id: 'c32_b_truck', title: 'Грузовик', camp: yard14, ambient: frost32,
    text: [
      { text: 'В семь у ворот армейский «Унимог» с тентом. В кузове на лавках трое солдат и две женщины из Йестебурга с пустыми сумками.' },
      { when: volunteerB, text: 'Доктор Зандер вчера вечером отдала тебе список, сложенный вчетверо, и сказала: «Danke, dass Sie sich gemeldet haben». Спасибо, что вызвались.' },
      { when: not(volunteerB), text: 'Доктор Зандер вчера вечером отдала тебе список, сложенный вчетверо, и сказала: «Es gibt sonst niemanden». Больше некому.' },
      { when: ninaGoes32, text: 'Нина уже сидит в кузове, с рюкзаком на коленях, в шапке Хенрике. Она приготовилась раньше всех.' },
      { when: ninaWinsen32, text: 'Нина ждёт в Винзене. Записка в твоём кармане: «Я покажу».' },
    ],
    actions: [
      { id: 'c32_bt_nina', label: 'Сесть рядом с Ниной', when: ninaGoes32, minutes: 15, terminal: true, goto: 'c32_b_road', ambientDuring: truck32,
        text: 'Нина двигается, освобождая место. Всю дорогу она держится за твой рукав, будто грузовик может выбросить её на повороте.', effects: [set32('bt', 'nina'), set32('nina_with', true), { npc: 'c7_nina', moveTo: winsen32 }, npc('c7_nina', 1), until32(32, 7, 15)] },
      { id: 'c32_bt_soldiers', label: 'Сесть к солдатам и спросить про дорогу', minutes: 15, terminal: true, goto: 'c32_b_road', ambientDuring: truck32,
        text: '— Bis Winsen eine Stunde, — говорит старший. До Винзена час. — Brücke ist zu, wir fahren über Pattensen. Da ist die Kontrolle.\n\nМост закрыт, едем через Паттензен. Там проверка.', effects: [set32('bt', 'soldiers'), { if: ninaGoes32, then: [set32('nina_with', true), { npc: 'c7_nina', moveTo: winsen32 }] }, until32(32, 7, 15)] },
      { id: 'c32_bt_list', label: 'Перечитать список Зандер', minutes: 15, terminal: true, goto: 'c32_b_road', ambientDuring: truck32,
        text: 'Бинты, марля, мазь от обморожений, антибиотики (любые), инсулин (если есть), перчатки, физраствор, термометры. Внизу приписка: «Und fragen Sie nach Kinderfiebersaft». И спросите детский жаропонижающий сироп.', effects: [set32('bt', 'list'), set32('read_list', true), { if: ninaGoes32, then: [set32('nina_with', true), { npc: 'c7_nina', moveTo: winsen32 }] }, until32(32, 7, 15)] },
    ] }),

  B({ id: 'c32_b_road', title: 'Паттензен', location: 'c7_farm_lane', camp: trip('c7_farm_lane'), safe: false, ambient: truck32,
    text: [
      { text: 'Час по замёрзшим полям. В Паттензене у церкви проверка: красно-белый шлагбаум, бумаги, фонарь в лицо. Солдат сверяет тебя со списком Брандта, который у него почему-то есть.' },
      { when: flag('w.c18_okafor_listed'), text: 'Рядом с фамилиями Йестебурга на его планшете — другой лист, гамбургский: эвакуированные из Норда через Гестхахт. На нём ты успеваешь прочитать: «Okafor, E.».' },
    ],
    actions: [
      { id: 'c32_br_wait', label: 'Ждать молча', minutes: 75, terminal: true, goto: 'c32_b_school',
        text: 'Проверка длится сорок минут. Потом грузовик трогается, и через полчаса в тумане показываются крыши Винзена и труба спортзала. Из трубы идёт дым.', effects: [set32('br', 'wait'), { move: winsen32 }, until32(32, 9, 0)] },
      { id: 'c32_br_ask', label: 'Спросить солдата про колонны за Эльбу', minutes: 75, terminal: true, goto: 'c32_b_school',
        text: '— Über die Elbe? — Солдат пожимает плечами. — Das macht das DRK. Wenn sie fahren, dann um den Zehnten. Fragen Sie in der Schule.\n\nЗа Эльбу? Это Красный Крест. Если поедут, то около десятого. Спросите в школе.', effects: [set32('br', 'ask'), set32('heard_column', true), { move: winsen32 }, until32(32, 9, 0)] },
    ] }),

  B({ id: 'c32_b_school', title: 'Школа', location: winsen32, camp: trip(winsen32), ambient: hall,
    text: [
      { text: 'Школа в Винзене. В спортзале раскладушки в шесть рядов, на канатах сушится бельё. Пахнет супом, хлоркой и мокрыми детьми. Здесь эвакуированные из Гамбурга, из Норда: Красный Крест привёз их через Гестхахт неделю назад.' },
      { text: 'В классах на втором этаже идут уроки. Три часа в день, все возрасты вместе. Из-за двери слышно, как кто-то читает вслух таблицу умножения.' },
      { when: ninaWith, text: 'Нина замирает в дверях. Потом к ней бегом, через весь коридор, — девочка с короткой стрижкой. Лена. Они обнимаются молча и долго.' },
      { when: ninaWinsen32, text: 'Нина выбегает тебе навстречу в коридоре, в чужом свитере, с тетрадкой под мышкой.\n\n— Я же написала! — говорит она так, будто ты {m:мог|могла} не приехать.' },
      { text: 'Стол Красного Креста — в учительской. Очередь из двенадцати человек.' },
    ],
    actions: [
      { id: 'c32_bs_queue', label: 'Встать в очередь со списком Зандер', minutes: 120, terminal: true, goto: 'c32_b_okafor',
        text: 'Очередь ползёт. Женщина за столом, немолодая, с карандашом за ухом, читает список Зандер, вычёркивает половину и ставит галочки у остального.\n\n— Bis morgen früh packen wir. Antibiotika: zwei Packungen. Insulin: nein. Fiebersaft: ja, einer.\n\nДо утра соберём. Антибиотики — две упаковки. Инсулина нет. Сироп — да, один.', effects: [set32('bs', 'queue'), w32('meds', 'promised'), ...fed32(15), until32(32, 11, 30)] },
      { id: 'c32_bs_help', label: 'Сначала помочь на раздаче супа', minutes: 120, activity: 'light', terminal: true, goto: 'c32_b_okafor',
        text: 'Ты разливаешь суп из бака, двести половников. Женщина из Красного Креста видит это и пропускает тебя без очереди.\n\n— Wer hilft, wird zuerst bedient. So machen wir das hier.\n\nКто помогает, того обслуживают первым. Так у нас заведено.\n\nОна ставит галочки щедрее: антибиотиков три упаковки вместо двух.', effects: [set32('bs', 'help'), w32('meds', 'promised'), w32('meds_extra', true), ...fed32(20), until32(32, 11, 30)] },
      { id: 'c32_bs_nina', label: 'Сначала посидеть с Ниной на уроке', when: any(ninaWith, ninaWinsen32), minutes: 120, terminal: true, goto: 'c32_b_okafor',
        text: 'Учительница, седая, в перчатках без пальцев, разрешает тебе сесть сзади. Нина решает задачу у доски и ни разу не оборачивается. Когда решает правильно, всё-таки оборачивается.\n\nВ очередь ты встаёшь после. Женщина из Красного Креста вычёркивает половину списка.', effects: [set32('bs', 'nina'), w32('meds', 'promised'), npc('c7_nina', 2, 'c32_sat_in_class'), ...fed32(10), until32(32, 11, 30)] },
    ] }),

  B({ id: 'c32_b_okafor', title: 'Окафор', location: winsen32, camp: trip(winsen32), ambient: hall, onEnter: [{ if: okaforHere32, then: okaforMeet }],
    text: [
      { when: okaforHere32, text: 'В углу спортзала, у шведской стенки, — знакомая спина в сером свитере. Он поворачивается раньше, чем ты успеваешь его окликнуть.' },
      { when: okaforHere32, text: 'Окафор. Похудевший, с седой щетиной, но тот же. Он смотрит на тебя, и лицо у него медленно меняется, как у человека, который давно запретил себе на что-то надеяться.\n\n— Вы живы, — говорит он. — Слава богу. Я говорил им, что вы живы.' },
      { when: okaforHere32, text: 'С ним одиннадцать человек из вашего дома в Бармбеке. Старики Петерсены с третьего, семья с первого с двумя детьми, студент из флигеля. На раскладушке у стены коробка с дырками. Изнутри смотрит рыжий глаз.\n\n— Фуфу, — говорит Окафор. — Не смейтесь.' },
      { when: okaforHere32, text: 'Он показывает связку ключей на проволоке, шесть штук, от квартир соседей.\n\n— Взял, когда уходили. Вдруг кто-то вернётся раньше нас. Этот — Петерсенов. Этот — с первого. А тот, что с красной ниткой, — сверху, от фрау Хаберланд. Она не доехала. Её чемодан мы везём.' },
      { when: okaforHere32, text: '— Свенья, — говорит он, и лицо у него закрывается. — Из переднего дома. Erledigt. Я сам. Так было нужно.\n\nДом заперт. Мерле — в Аренсбурге, у родителей. Инсулина у неё до десятых чисел, если экономит. Туда можно только с колонной Красного Креста, следующая — около десятого.' },
      { when: not(okaforHere32), text: 'В углу спортзала, у шведской стенки, — старики Петерсены с третьего этажа вашего дома в Бармбеке. И с ними ещё девять человек оттуда же. Фрау Петерсен узнаёт тебя и плачет.' },
      { when: not(okaforHere32), text: 'Окафора с ними нет. Он ушёл на смену в первый день и в дом больше не вернулся. Но оставил фрау Петерсен записку и связку ключей от квартир, шесть штук на проволоке.\n\n— Этот наш. Этот с первого. А тот, что с красной ниткой, — сверху, от фрау Хаберланд. Она не доехала. Её чемодан мы везём.\n\nВ записке: «Мерле в Аренсбурге, у родителей. Инсулин до десятых чисел. Туда — только с колонной Красного Креста». Свенья из переднего дома — фрау Петерсен только качает головой.' },
      { when: all(svenjaKnock, okaforHere32), text: 'Ты помнишь, как {m:стучал|стучала} к ней утром десятого.' },
    ],
    actions: [
      { id: 'c32_bo_merle', label: 'Спросить про Мерле: как туда попасть', minutes: 60, terminal: true,
        outcomes: who('— Колонна. Около десятого. Красный Крест возит инсулин и забирает лежачих. Берут сопровождающих, если есть пропуск. — Окафор смотрит на тебя долго. — Если никто другой — пойду я. Я медбрат. Меня возьмут.',
          '— Колонна, около десятого, — говорит фрау Петерсен. — Красный Крест возит инсулин и забирает лежачих. Сопровождающих берут, если есть пропуск. Эммануэль писал: если никто другой, пойдёт он. Только где он теперь.',
          [set32('bo', 'merle'), set32('knows_column', true), w32('merle_column', true), until32(32, 13, 0)], 'c32_b_lena') },
      { id: 'c32_bo_photo', label: 'Показать фотографию дома из коробки Тима', when: photo, minutes: 60, terminal: true,
        outcomes: who('Фотографию передают из рук в руки. Окафор называет каждого на лестнице, медленно, как на перекличке: Новаки, Петерсены, фрау Хаберланд в шляпке, Мерле в огромном шарфе. И ты, сбоку, с пакетом из магазина. На себе он задерживается дольше: на фотографии он держит Фуфу.\n\nСтарик Петерсен просит оставить фотографию до утра. Утром она лежит у тебя на раскладушке, в целлофане.',
          'Фотографию передают из рук в руки. Фрау Петерсен называет каждого на лестнице: Новаки, они сами, фрау Хаберланд в шляпке, Мерле в огромном шарфе, Окафор с котом. И ты, сбоку, с пакетом из магазина.\n\nСтарик Петерсен просит оставить фотографию до утра. Утром она лежит у тебя на раскладушке, в целлофане.',
          [set32('bo', 'photo'), { if: okaforHere32, then: [npc('okafor', 3, 'c32_saw_photo')] }, until32(32, 13, 0)], 'c32_b_lena') },
      { id: 'c32_bo_farm', label: 'Рассказать, где ты теперь: хутор, люди, Хенрике', minutes: 60, terminal: true, goto: 'c32_b_lena',
        text: 'Ты рассказываешь про хутор, про печь, про кур и колодец. Тебя слушают молча, как сказку. Фрау Петерсен спрашивает, есть ли там ванна. Нет. Она всё равно кивает, будто это ничего не меняет.', effects: [set32('bo', 'farm'), set32('told_farm', true), until32(32, 13, 0)] },
      { id: 'c32_bo_merle_old', label: 'Сказать: я {m:обещал|обещала} Мерле, что мы встретимся', when: merleAsked, minutes: 60, terminal: true,
        outcomes: who('Ты не {m:обещал|обещала}. Но говоришь так. Окафор кивает:\n\n— Значит, встретитесь.\n\nИ больше об этом не говорят, как будто это уже решено.',
          'Ты не {m:обещал|обещала}. Но говоришь так. Фрау Петерсен гладит тебя по руке:\n\n— Значит, встретитесь, детка.',
          [set32('bo', 'promise'), w32('merle_promise', true), until32(32, 13, 0)], 'c32_b_lena') },
    ] }),

  B({ id: 'c32_b_lena', title: 'Нина', location: winsen32, camp: trip(winsen32), ambient: hall,
    text: [
      { when: ninaWith, text: 'После обеда Нина находит тебя в коридоре. Лена держится в двух шагах позади.\n\n— Мама Лены говорит, я могу остаться до Рождества. Тут уроки. И свет два часа в день. — Она не смотрит на тебя. — Но я не знаю.' },
      { when: ninaWinsen32, text: 'После обеда Нина находит тебя в коридоре.\n\n— Я тут уже две недели. Тут уроки. Мама Лены хорошая. — Она теребит рукав. — Но хутор… Можно я вернусь с тобой завтра? Или нет?' },
      { when: all(ninaWith, nina15stay), text: 'В ноябре, когда её звали сюда, она выбрала хутор. Теперь выбирает снова.' },
      { when: not(any(ninaWith, ninaWinsen32)), text: 'После обеда ты помогаешь женщине из Красного Креста паковать коробки для пункта. Нины с тобой нет. Ты думаешь о ней всё равно.' },
    ],
    actions: [
      { id: 'c32_bl_stay', label: 'Сказать: оставайся, здесь школа', when: any(ninaWith, ninaWinsen32), minutes: 60, terminal: true, goto: 'c32_b_night',
        text: 'Нина кивает. Потом утыкается тебе в плечо, ненадолго, как будто проверяет, на месте ли ты.\n\n— Ты приедешь на Рождество?\n\n— Приеду.', effects: [...ninaStays, npc('c7_nina', 1, 'c32_told_stay'), until32(32, 15, 0)] },
      { id: 'c32_bl_back', label: 'Сказать: поехали домой', when: any(ninaWith, ninaWinsen32), minutes: 60, terminal: true, goto: 'c32_b_night',
        text: 'Нина выдыхает, будто ждала именно этого и боялась, что ты скажешь другое. Лена обнимает её у дверей и уходит, не оборачиваясь.', effects: [...ninaBack, npc('c7_nina', 2, 'c32_told_home'), until32(32, 15, 0)] },
      { id: 'c32_bl_self', label: 'Сказать: решай сама, я пойму любое', when: any(ninaWith, ninaWinsen32), minutes: 60, terminal: true, goto: 'c32_b_night',
        text: 'Нина думает долго, глядя в окно на школьный двор.\n\n— Тогда… — говорит она, и решение у неё на лице раньше, чем в словах.', effects: [set32('bl', 'self'), { if: nina15stay, then: ninaBack, else: ninaStays }, npc('c7_nina', 2, 'c32_let_decide'), until32(32, 15, 0)] },
      { id: 'c32_bl_pack', label: 'Паковать коробки для пункта', when: not(any(ninaWith, ninaWinsen32)), minutes: 60, activity: 'light', terminal: true, goto: 'c32_b_night',
        text: 'Бинты, марля, перчатки. Ты пишешь на каждой коробке: «Jesteburg, Dr. Sander». Женщина из Красного Креста исправляет: Zander, через «Z».', effects: [set32('bl', 'pack'), until32(32, 15, 0)] },
    ] }),

  B({ id: 'c32_b_night', title: 'Фрау Витхён', location: winsen32, camp: trip(winsen32, 'sleep'), ambient: { tempC: 18, outdoor: false, wet: false }, onEnter: [until32(32, 18, 0)],
    text: [
      { text: 'Ночевать тебя устраивают у фрау Витхён, вдовы учителя, в доме за школой. У неё свет два часа в день от генератора на всю улицу и горячая вода в бойлере. Она наливает тебе ванну. Ты сидишь в ней, пока вода не остывает, и плачешь, {m:сам|сама} не зная о чём.' },
      { when: okaforHere32, text: 'В восемь приходит Окафор. Садится на краешек стула, держит шапку в руках.\n\n— Я хочу попросить вас об одном. Петерсенам за восемьдесят. И фрау Кёрнер, с первого. В спортзале они до весны не доживут. Сквозняк, кашель. Если на вашем хуторе есть место для троих стариков… — Он не договаривает. — Я не прошу за себя. Я пойду за Мерле с колонной, если никто другой.' },
      { when: not(okaforHere32), text: 'В восемь приходит фрау Петерсен. Садится на краешек стула.\n\n— Мы с мужем старые. И фрау Кёрнер. В спортзале нам до весны не дожить. Если у вас там есть место… Нам много не надо. Угол.' },
    ],
    actions: [
      { id: 'c32_bn_ask', label: 'Обещать спросить Хенрике', minutes: 60, terminal: true, goto: 'c32_b_sleep',
        text: '— Спросить — уже много. — Тебя благодарят так, что становится неловко.', effects: [set32('bn', 'ask'), npc('okafor', 1), ...fed32(25), until32(32, 20, 0)] },
      { id: 'c32_bn_honest', label: 'Сказать честно: там тесно, обещать не могу', minutes: 60, terminal: true, goto: 'c32_b_sleep',
        text: '— Спасибо, что честно. — Кивок. — Честное слово сейчас дороже обещания.', effects: [set32('bn', 'honest'), ...fed32(25), until32(32, 20, 0)] },
      { id: 'c32_bn_yes', label: 'Сказать: приезжайте, место найдём', minutes: 60, terminal: true, goto: 'c32_b_sleep',
        text: 'На тебя смотрят так, будто ты {m:подарил|подарила} дом. Ты ещё не знаешь, что скажет Хенрике. Но слово сказано.', effects: [set32('bn', 'yes'), w32('b_promised', true), npc('okafor', 2, 'c32_b_promised_place'), ...fed32(25), until32(32, 20, 0)] },
    ] }),

  B({ id: 'c32_b_sleep', title: 'Ночь', location: winsen32, camp: trip(winsen32, 'sleep'), ambient: { tempC: 16, outdoor: false, wet: false },
    text: [{ text: 'Чистая простыня. Тиканье часов. Где-то за стеной фрау Витхён молится вполголоса. Первая ночь за три недели, когда не надо прислушиваться.' }],
    actions: [
      { id: 'c32_bz_sleep', label: 'Спать', minutes: 30, terminal: true, goto: 'c32_b_thu',
        text: 'Ты засыпаешь сразу и спишь без снов, до самого утра.', effects: [set32('bz', 'sleep'), { body: 'stress', delta: -6 }, until32(33, 6, 30, true)] },
      { id: 'c32_bz_write', label: 'Написать письмо Мерле, на случай колонны', minutes: 60, terminal: true, goto: 'c32_b_thu',
        text: 'Ты пишешь на листке из тетради фрау Витхён. Про хутор, про кур, про то, что всё будет. Не пишешь ни про что страшное. Складываешь вчетверо и пишешь сверху: «Merle, Ahrensburg».', effects: [set32('bz', 'write'), { give: 'c32_merle_letter' }, until32(32, 21, 30), until32(33, 6, 30, true)] },
    ] }),

  // ═════════════ Четверг ═════════════
  B({ id: 'c32_b_thu', title: 'Коробки', location: winsen32, camp: trip(winsen32), ambient: hall,
    text: [
      { text: 'Утром у учительской стоят две коробки, перевязанные бечёвкой. «Jesteburg, Dr. Zander».' },
      { when: flag('w.c32_meds_extra'), text: 'Женщина из Красного Креста подмигивает: в одной коробке на упаковку больше, чем в списке.' },
      { when: own32('nina', 'stays'), text: 'Нина провожает тебя до грузовика. Лена стоит рядом и держит её за руку.' },
      { when: own32('nina', 'back'), text: 'Нина уже сидит в кузове с рюкзаком. Лена машет ей из окна второго этажа.' },
    ],
    actions: [
      { id: 'c32_bq_boxes', label: 'Погрузить коробки и ехать', minutes: 60, terminal: true, goto: 'c32_b_back',
        text: 'Коробки ты ставишь себе под ноги и держишь коленями. Грузовик трогается в половине одиннадцатого.', effects: [set32('bq', 'boxes'), w32('meds', 'got'), { give: 'c32_drk_box' }, until32(33, 10, 30)] },
      { id: 'c32_bq_okafor', label: 'Попрощаться с Окафором и жильцами', when: okaforHere32, minutes: 90, terminal: true, goto: 'c32_b_back',
        text: 'Окафор провожает тебя до грузовика. Фуфу в коробке смотрит в дырку. Окафор жмёт тебе руку двумя руками, по-старомодному.\n\n— Перчатки, — говорит он. — Всегда. Помните?\n\nТы помнишь. Коробки с лекарствами уже в кузове.', effects: [set32('bq', 'okafor'), w32('meds', 'got'), { give: 'c32_drk_box' }, npc('okafor', 1), until32(33, 10, 45)] },
    ] }),

  B({ id: 'c32_b_back', title: 'Обратно', location: winsen32, camp: trip(winsen32), ambient: truck32, onEnter: [until32(33, 11, 0)],
    text: [{ text: 'Обратно через Паттензен. На проверке те же лица, что вчера, машут рукой, не глядя в бумаги.' }],
    actions: [
      { id: 'c32_bk_go', label: 'Ехать', minutes: 120, terminal: true, goto: 'c32_b_point', ambientDuring: truck32,
        text: 'Грузовик высаживает тебя у пожарной части в Йестебурге. Коробки ты несёшь в пункт {m:сам|сама}, одну за другой.', effects: [set32('bk', 'go'), { move: jest32 }, until32(33, 14, 0)] },
    ] }),

  B({ id: 'c32_b_point', title: 'Пункт', location: jest32, camp: trip(jest32), ambient: { tempC: 14, outdoor: false, wet: false },
    text: [
      { text: 'Доктор Зандер вскрывает коробки ножницами прямо на полу и считает вслух, по-немецки, как кассир.' },
      { when: flag('w.c32_meds_extra'), text: '— Drei? Drei Packungen? — Она смотрит на тебя поверх очков. Три упаковки? — Was haben Sie denen erzählt?\n\nЧто вы им наговорили?' },
      { text: '— Insulin?\n\nТы качаешь головой. Она кивает, будто и не ждала.' },
    ],
    actions: [
      { id: 'c32_bp_help', label: 'Остаться и помочь разложить', minutes: 150, activity: 'light', terminal: true, goto: 'c32_b_home',
        text: 'Вы раскладываете по полкам до сумерек. Зандер подписывает каждую коробку сама. В конце говорит:\n\n— Sie haben ein Auge für Ordnung. Kommen Sie wieder.\n\nУ вас глаз на порядок. Приходите ещё.', effects: [set32('bp', 'help'), w32('meds_point', true), until32(33, 16, 30)] },
      { id: 'c32_bp_home', label: 'Отдать и идти домой', minutes: 60, terminal: true, goto: 'c32_b_home',
        text: 'Зандер расписывается в твоей тетради за всё, что ты {m:привёз|привезла}. Потом пожимает тебе руку, сухо и крепко.', effects: [set32('bp', 'home'), w32('meds_point', true), until32(33, 15, 0)] },
    ] }),

  B({ id: 'c32_b_home', title: 'Дорога к хутору', location: 'hof_luedemann', camp: yard14, ambient: frost32, onEnter: [until32(33, 17, 0)],
    text: [
      { text: 'Четыре километра пешком, по укатанному снегу, в сумерках. В пять ты у ворот. Дым из трубы.' },
      { when: own32('nina', 'back'), text: 'Нина обгоняет тебя у калитки и бежит к Хенрике.' },
      { when: own32('nina', 'stays'), text: 'Раскладушка Нины на кухне сложена. Хенрике смотрит на тебя и всё понимает без слов.' },
    ],
    actions: [
      { id: 'c32_bh_wait', label: 'Стоять у ворот и ждать', minutes: 50, terminal: true, goto: 'c32_checkpoint',
        text: 'Ты стоишь у ворот, пока не начинают мёрзнуть ноги. Скоро шесть.', effects: [set32('bh', 'wait'), finish32, until32(33, 18, 0)] },
      { id: 'c32_bh_tea', label: 'Отогреться на кухне', minutes: 50, terminal: true, goto: 'c32_checkpoint',
        text: 'Хенрике наливает тебе чаю. Ты рассказываешь ей про Окафора, про стариков. Она слушает, не перебивая, и в конце говорит только: «Wir werden sehen». Посмотрим.', effects: [set32('bh', 'tea'), ...fed32(15), finish32, until32(33, 18, 0)] },
    ] }),
];
