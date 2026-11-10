import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { B18, S18, any, camp18b, cold18, lueneburg, npc, own } from './point18';

// Участок 18, линия B: сутки в казарме Люнебурга. Сюда сходятся люди из первых дней.
const set = (key: string, value: string | boolean): Effect => ({ set: `$.c18_${key}`, value });
const w = (key: string, value: string | boolean): Effect => ({ set: `w.c18_${key}`, value });
const until = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
const fed: Effect[] = [{ body: 'hunger', delta: -45 }, { body: 'thirst', delta: -40 }];
const kasiaHere: Cond = all({ npc: 'kasia', alive: true }, flag('w.nowaks_gone'));
const kasiaFriend: Cond = all(kasiaHere, flag('B.helped_nowaks'));
const pawelHere: Cond = { npc: 'pawel', alive: true };
const okaforStayed: Cond = all(flag('w.okafor_stays'), { npc: 'okafor', alive: true });
const merle: Cond = flag('w.c16_merle_insulin');
const phoneHidden: Cond = own('gate', 'hid');
const knowsTim: Cond = own('side', 'kitchen');
const B = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S18({ ...scene, for: 'any', chapter: 'ch3', location: lueneburg, camp: camp18b, safe: false,
  actions: scene.actions.map(a => ({ ...a, when: all(B18, a.when ?? { always: true }) })) });

export const day18BScenes: Scene[] = [
  B({ id: 'c18_b_truck', title: 'Под брезентом', ambient: cold18,
    text: [
      { text: 'В кузове две скамьи вдоль бортов. Напротив сидит женщина с мальчиком лет шести и солдат с автоматом между колен. Пахнет соляркой и мокрой шерстью.' },
      { text: 'Телефон показывает одну полоску. Потом ни одной.' },
    ],
    actions: [
      { id: 'c18_bt_woman', label: 'Заговорить с женщиной', minutes: 50, terminal: true, goto: 'c18_b_gate',
        text: 'Её зовут Ханна. Мужа забрали в Люнебург в четверг: переболел, встал на шестой день.\n\n— Sie nehmen Blut. Jeden Tag. Solange er gebraucht wird, sagen sie.\n\nБерут кровь. Каждый день. Пока нужен, говорят. Мальчик всю дорогу держит её за палец.', effects: [set('bt', 'woman'), until(17, 15, 55)] },
      { id: 'c18_bt_gap', label: 'Смотреть в щель брезента', minutes: 50, terminal: true, goto: 'c18_b_gate',
        text: 'Поля, столбы, пустая остановка. За Зальцхаузеном в борозде стоят двое в больничных рубашках, спиной к дороге. Солдат напротив тоже их видит. Он достаёт блокнот и ставит две палочки.', effects: [set('bt', 'gap'), until(17, 15, 55)] },
      { id: 'c18_bt_sms', label: 'Успеть написать {A.dat}, пока есть сеть', minutes: 50, terminal: true, goto: 'c18_b_gate',
        text: 'Ты пишешь: «Еду. Поешь вечером. Не стой в калитке». Сообщение уходит со второй попытки. Потом сеть пропадает.', effects: [set('bt', 'sms'), w('sms1', true), { body: 'stress', delta: -1 }, until(17, 15, 55)] },
    ] }),

  B({ id: 'c18_b_gate', title: 'КПП', ambient: cold18,
    text: [
      { text: 'Казарма на краю города: кирпичные корпуса, плац, палатки в три ряда. У шлагбаума стол. Сержант показывает на ящик с ячейками.\n\n— Telefone hier rein. Beim Rausgehen zurück.\n\nТелефоны сюда. На выходе вернут.' },
    ],
    actions: [
      { id: 'c18_bg_give', label: 'Сдать телефон', minutes: 10, terminal: true, goto: 'c18_b_reg',
        text: 'Ты выключаешь телефон и кладёшь в ячейку сорок один. Жетон с номером сержант вешает тебе на шнурок.', effects: [set('gate', 'gave'), { phonePower: false }] },
      { id: 'c18_bg_hide', label: 'Сказать, что телефона нет', minutes: 10, risky: true, terminal: true, goto: 'c18_b_reg',
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'persuasion'], difficulty: 3 }, text: 'Телефон лежит в ботинке под стелькой, выключенный. Сержант смотрит на тебя, потом на очередь за тобой и машет: проходи.', effects: [set('gate', 'hid'), { phonePower: false }] },
          { id: 'fail', text: 'Сержант молча показывает на твой ботинок. Телефон уходит в отдельный ящик, без жетона.\n\n— Kommandant. Freitag.\n\nЧерез коменданта. В пятницу.\n\nРюкзак он тоже проверяет, и свёрток из дома остаётся на столе.', effects: [set('gate', 'caught'), w('phone_held', true), { phonePower: false }, { body: 'stress', delta: 3 }] },
        ] },
    ] }),

  B({ id: 'c18_b_henrike', title: 'Хенрике',
    text: [
      { text: 'Женский корпус — бывший спортзал. Раскладушки в четыре ряда, верёвки с бельём между шведскими стенками. Хенрике сидит на крайней, в пальто. За неделю она похудела.' },
      { text: '— Du bist gekommen, — говорит она и встаёт. Ты {m:приехал|приехала}.\n\nОна ведёт тебя к окну.\n\n— Sie stechen ihn jeden Tag. Er sagt, es geht. Er lügt. Ich will ihn hier raus.\n\nЕго колют каждый день. Он говорит, что нормально. Он врёт. Я хочу его отсюда забрать.' },
    ],
    actions: [
      { id: 'c18_bh_food', label: 'Сначала накормить её тем, что привезла', when: all(own('pack', 'food'), not(own('gate', 'caught'))), minutes: 20, terminal: true, goto: 'c18_b_fork',
        text: 'Ты разворачиваешь полотенце. Хенрике берёт картофелину и нюхает её.\n\n— Unsere, — говорит она. Наша.\n\nОна ест медленно, с солью. После этого говорит спокойнее.', effects: [set('bh', 'food'), npc('henrike', 3)] },
      { id: 'c18_bh_ask', label: 'Спросить прямо: чего хочет сам Оле', minutes: 15, terminal: true, goto: 'c18_b_fork',
        text: '— Was will Ole?\n\nХенрике отворачивается к окну.\n\n— Bleiben. Er sagt, er wird gebraucht. Mit siebenundzwanzig hat ihn noch nie jemand gebraucht.\n\nОстаться. Говорит, что нужен. В двадцать семь лет он ещё никому не был нужен.', effects: [set('bh', 'ask'), npc('henrike', 1)] },
      { id: 'c18_bh_listen', label: 'Дать ей выговориться', minutes: 25, terminal: true, goto: 'c18_b_fork',
        text: 'Она говорит двадцать минут: про иглы, про суп из порошка, про женщину с соседней раскладушки, которая кричит во сне. Про хутор она не спрашивает. Боится ответа.', effects: [set('bh', 'listen'), npc('henrike', 2)] },
    ] }),

  B({ id: 'c18_b_fork', title: 'До отбоя',
    text: [
      { text: 'Пропуск к донорам у тебя с семи вечера. До этого два часа. Хенрике ложится и засыпает на середине фразы.' },
      { text: 'Из окна видно кухню с трубой и двор прачечной, где стоят фургоны. В обе стороны идут люди с вёдрами.' },
    ],
    actions: [
      { id: 'c18_bf_kitchen', label: 'Пойти на кухню', minutes: 5, terminal: true, goto: 'c18_b_kitchen', text: 'Ты идёшь на запах лука.', effects: [set('side', 'kitchen')] },
      { id: 'c18_bf_laundry', label: 'Пойти во двор прачечной', minutes: 5, terminal: true, goto: 'c18_b_laundry', text: 'Ты идёшь туда, где стоят фургоны.', effects: [set('side', 'laundry')] },
      { id: 'c18_bf_rest', label: 'Лечь на соседнюю раскладушку', minutes: 5, terminal: true, goto: 'c18_b_ole',
        text: 'Ты ложишься в куртке и спишь полтора часа. Ночью этот сон тебе пригодится.', effects: [set('side', 'rest'), until(17, 18, 50, true)] },
    ] }),

  B({ id: 'c18_b_kitchen', title: 'Кухня',
    text: [
      { when: kasiaHere, text: 'У котла, спиной к двери, женщина в чужом белом халате режет лук. Она оборачивается, и нож останавливается.\n\n— Jezus Maria. Barmbek!\n\nКася Новак. Фургон довёз их сюда на третий день.' },
      { when: kasiaFriend, text: 'Она обнимает тебя мокрыми руками. В первый день ты {m:помогал|помогала} им грузить фургон. Она это помнит.' },
      { when: all(kasiaHere, not(kasiaFriend)), text: 'Она кивает тебе, как соседке по лестнице. В первый день у тебя не нашлось для них времени. Она это тоже помнит.' },
      { when: not(kasiaHere), text: 'У котла женщина в белом халате режет лук. Её зовут Гизела, она из Харбурга. Говорит быстро и не поднимает глаз.' },
      { text: '— Tim liegt drüben, bei den Kindern. Er kriegt Plasma. Von einem jungen Mann vom Bauernhof bei Jesteburg, sagt die Schwester.\n\nТим лежит там, у детей. Ему дают плазму. От парня с хутора под Йестебургом, говорит сестра.', when: kasiaHere },
      { when: not(kasiaHere), text: '— Die Kinderstation kriegt das Plasma. Drei Kinder hängen an einem einzigen Spender, einem jungen Mann vom Land.\n\nПлазма идёт в детское отделение. Трое детей держатся на одном доноре, одном парне из деревни.' },
    ],
    actions: [
      { id: 'c18_bk_help', label: 'Встать рядом и чистить картошку', minutes: 90, activity: 'light', terminal: true, goto: 'c18_b_ole',
        text: 'Ты чистишь два ведра. За это тебе наливают полную миску супа и дают с собой хлеб.', effects: [set('bk', 'help'), ...fed, npc('kasia', 2), until(17, 18, 50)] },
      { id: 'c18_bk_tim', label: 'Попросить отвести к детям', minutes: 60, terminal: true, goto: 'c18_b_ole',
        text: 'В детской палате шесть кроватей. У троих над головой висят жёлтые пакеты. На бирке каждого одна и та же фамилия от руки: Lüdemann.', effects: [set('bk', 'tim'), w('saw_children', true), until(17, 18, 50)] },
    ] }),

  B({ id: 'c18_b_laundry', title: 'Двор прачечной', ambient: cold18,
    text: [
      { when: pawelHere, text: 'У второго фургона человек в ватнике грузит мешки с бельём. Он поворачивается на шаги.\n\n— Pani z hutoru, — говорит Павел и улыбается одним углом рта.\n\nАвтобус Рут дошёл сюда на вторые сутки. Рут и Эва в женском корпусе, в третьем ряду.' },
      { when: not(pawelHere), text: 'У второго фургона человек в ватнике грузит мешки с бельём. Его зовут Гюнтер. Он возит бельё по округе: Винзен, Йестебург, обратно.' },
      { text: 'Фургон прачечной ходит по вторникам и пятницам. Его не досматривают: никто не хочет трогать мешки.' },
    ],
    actions: [
      { id: 'c18_bl_post', label: 'Договориться о письмах с хутора и обратно', minutes: 60, terminal: true, goto: 'c18_b_ole',
        outcomes: [
          { id: 'friend', when: pawelHere, text: '— Dwa razy w tygodniu, — говорит Павел. Два раза в неделю. Он будет оставлять письма в почтовом ящике Людеманов и забирать ответы. Денег не берёт.', effects: [set('bl', 'post'), w('post', true), npc('pawel', 2)] },
          { id: 'paid', text: 'Гюнтер согласен за плату. Ты отдаёшь ему свой шарф. По вторникам и пятницам письма будут лежать в почтовом ящике Людеманов.', effects: [set('bl', 'post'), w('post', true), { body: 'stress', delta: 1 }] },
        ] },
      { id: 'c18_bl_road', label: 'Расспросить про дорогу и посты', minutes: 60, terminal: true, goto: 'c18_b_ole',
        text: 'Он рисует пальцем на пыльном борту: три поста до Йестебурга, один снимают на ночь. На Corsa можно проехать в пятницу до шести утра, если знать, где свернуть у Зальцхаузена.', effects: [set('bl', 'road'), w('road_known', true)] },
    ] }),

  B({ id: 'c18_b_ole', title: 'Оле',
    text: [
      { text: 'Донорский блок на втором этаже штаба. Двенадцать коек. Оле лежит у окна, в сгибе локтя катетер, заклеенный пластырем. Под глазами серое.' },
      { text: '— Sag meiner Mutter, sie soll schlafen, — говорит он вместо приветствия. Скажи матери, пусть спит.' },
      { when: any(knowsTim, own('bh', 'ask')), text: 'Потом, тише:\n\n— Drei Kinder. Wenn ich gehe, kriegen sie nichts. Verstehst du? Ich habe noch nie was gekonnt, was sonst keiner kann.\n\nТрое детей. Если я уйду, им не дадут ничего. Понимаешь? Я никогда не умел того, чего не умеет никто другой.' },
      { when: not(any(knowsTim, own('bh', 'ask'))), text: 'Потом, тише:\n\n— Ich gehe nicht mit. Egal, was sie dir erzählt hat.\n\nЯ не поеду. Что бы она тебе ни говорила.' },
    ],
    actions: [
      { id: 'c18_bo_mother', label: 'Сказать за мать: она боится тебя потерять', minutes: 20, terminal: true, goto: 'c18_b_doctor',
        text: '— Sie hat Angst, — говоришь ты.\n\n— Ich auch, — говорит Оле. — Aber nicht davor.\n\nЯ тоже. Но не этого.', effects: [set('bo', 'mother'), npc('henrike', 1)] },
      { id: 'c18_bo_side', label: 'Сказать, что понимаешь его', minutes: 20, terminal: true, goto: 'c18_b_doctor',
        text: 'Оле смотрит на тебя, ждёт подвоха. Потом кивает и впервые за разговор опускает плечи.\n\n— Dann sag ihr das. Mir glaubt sie nicht.\n\nТогда скажи это ей. Мне она не верит.', effects: [set('bo', 'side'), npc('ole', 3, 'c18_understood')] },
      { id: 'c18_bo_deal', label: 'Спросить, сколько берут и сколько можно', minutes: 20, terminal: true, goto: 'c18_b_doctor',
        text: 'Он показывает листок на спинке койки. Шестьсот миллилитров в день, восемь дней подряд. Ты знаешь, что столько нельзя. Он пожимает плечами.', effects: [set('bo', 'deal'), w('ole_numbers', true)] },
    ] }),

  B({ id: 'c18_b_doctor', title: 'Врач',
    text: [
      { text: 'Врач блока, женщина лет пятидесяти с седой косой, заполняет карты на подоконнике. На халате фамилия: Dr. Ahlers.' },
      { text: '— Station vier, Buchholz, — говорит она, когда ты называешь браслет. — Das war unsere erste Plasmastation. Als der Strom ausfiel, ist das Personal gegangen. Die Türen standen offen. Einundsechzig.\n\nЧетвёртое отделение, Бухгольц. Наша первая станция плазмы. Когда пропал ток, персонал ушёл. Двери остались открыты. Шестьдесят один человек.' },
      { text: 'Она смотрит на твои руки.\n\n— Sie sind gesund. Null negativ wäre mir am liebsten, aber ich nehme alles. Für einen halben Liter können Sie mich um etwas bitten.\n\nВы здоровы. За пол-литра можете о чём-нибудь меня попросить.' },
    ],
    actions: [
      { id: 'c18_bd_ole', label: 'Сдать кровь: пусть у Оле берут через день', minutes: 50, risky: true, terminal: true, goto: 'c18_b_kids',
        text: 'Игла толстая. Пакет наполняется двенадцать минут. Потом врач переписывает листок на спинке койки Оле: «jeden zweiten Tag». Через день. У тебя звенит в ушах, когда ты встаёшь.', effects: [set('bd', 'ole'), w('ole_rest', true), { body: 'bloodLoss', delta: 9 }, { body: 'fatigue', delta: 10 }, npc('henrike', 2), npc('ole', 1)] },
      { id: 'c18_bd_insulin', label: 'Сдать кровь за инсулин для Мерле', when: merle, minutes: 50, risky: true, terminal: true, goto: 'c18_b_kids',
        text: 'Игла толстая. Пакет наполняется двенадцать минут. Врач достаёт из холодильника две шприц-ручки и заворачивает их в перчатку со льдом.\n\n— Bis Freitag kühl halten.\n\nДо пятницы держать в холоде. У тебя звенит в ушах, когда ты встаёшь.', effects: [set('bd', 'insulin'), w('insulin', true), { give: 'c18_insulin' }, { body: 'bloodLoss', delta: 9 }, { body: 'fatigue', delta: 10 }] },
      { id: 'c18_bd_no', label: 'Отказаться: завтра нужны силы', minutes: 10, terminal: true, goto: 'c18_b_kids',
        text: '— Verstehe, — говорит она без обиды и возвращается к картам. Понимаю.', effects: [set('bd', 'no')] },
    ] }),

  B({ id: 'c18_b_supper', title: 'Столовая',
    text: [
      { text: 'Ужин в восемь, в бывшем гараже. Суп из порошка, хлеб, чай. За соседним столом солдаты. Один говорит громче других:\n\n— Morgen um acht, die Kleingärten bei Jesteburg. Zwei Wagen. Um neun sind wir durch.\n\nЗавтра в восемь, садовая колония под Йестебургом. Две машины. К девяти управимся.' },
      { text: 'Ложка у тебя в руке останавливается. До хутора сорок километров и три поста.' },
    ],
    actions: [
      { id: 'c18_bs_sms', label: 'Достать телефон в туалете и написать {A.dat}', when: phoneHidden, minutes: 20, risky: true, terminal: true, goto: 'c18_b_row',
        text: 'Ты включаешь телефон в кабинке. Сети нет. Ты пишешь всё равно: «Две машины. К девяти хотят закончить. Не стой один». Сообщение повисает с часиками. Может быть, уйдёт ночью у окна.', effects: [set('bs', 'sms'), ...fed, w('sms2', true)] },
      { id: 'c18_bs_ask', label: 'Подсесть к солдатам и спросить', minutes: 20, terminal: true, goto: 'c18_b_row',
        text: '— Kennen Sie da jemanden? — спрашивает громкий. Знаете там кого-то?\n\n— Ja.\n\nОн перестаёт жевать.\n\n— Wir schießen nicht auf Leute. Nur auf die anderen.\n\nВ людей мы не стреляем. Только в тех.', effects: [set('bs', 'ask'), ...fed, { body: 'stress', delta: 2 }] },
      { id: 'c18_bs_eat', label: 'Доесть и молчать', minutes: 20, terminal: true, goto: 'c18_b_row',
        text: 'Ты доедаешь суп до дна. Что бы ни было завтра в восемь, отсюда ты этого не изменишь.', effects: [set('bs', 'eat'), ...fed] },
    ] }),

  B({ id: 'c18_b_block', title: 'Третий ряд',
    text: [
      { text: 'До ночного пропуска полчаса. В женском корпусе гасят половину ламп.' },
      { when: flag('B.helped_lady'), text: 'С раскладушки в третьем ряду тебе машет старая женщина в мужском свитере. Ты узнаёшь её не сразу: вокзал Бармбек, первый день, табло. Ты тогда помогла ей разобраться, и она сунула тебе шоколадку.\n\n— Die mit meiner Schokolade! — говорит она соседкам. Та, с моей шоколадкой!' },
      { when: not(flag('B.helped_lady')), text: 'Старая женщина в мужском свитере в третьем ряду смотрит на тебя и хлопает ладонью по краю раскладушки: садись.' },
      { text: 'Её зовут фрау Петерс. Она здесь с тринадцатого и знает, какая сестра добрая, а у какой лучше ничего не просить.' },
    ],
    actions: [
      { id: 'c18_bb_night', label: 'Спросить, как тут проходят ночи у доноров', minutes: 20, terminal: true, goto: 'c18_b_night',
        text: '— Um halb drei kommen sie manchmal ein zweites Mal. Wenn bei den Kindern einer kippt. Dann fragen sie nicht.\n\nВ полтретьего иногда приходят второй раз. Если у детей кому-то плохо. Тогда не спрашивают.', effects: [set('bb', 'night'), until(17, 22, 0)] },
      { id: 'c18_bb_henrike', label: 'Попросить её присмотреть за Хенрике', minutes: 20, terminal: true, goto: 'c18_b_night',
        text: '— Die im Mantel? Die isst nichts, — говорит фрау Петерс. Та, что в пальто? Она ничего не ест. — Ich setze mich neben sie. Bei mir essen alle.\n\nСяду рядом с ней. У меня едят все.', effects: [set('bb', 'henrike'), w('peters', true), npc('henrike', 1), until(17, 22, 0)] },
      { id: 'c18_bb_sleep', label: 'Полчаса полежать', minutes: 30, terminal: true, goto: 'c18_b_night',
        text: 'Ты лежишь с закрытыми глазами и слушаешь, как дышат шестьдесят женщин.', effects: [set('bb', 'sleep'), { body: 'fatigue', delta: -6 }, until(17, 22, 0)] },
    ] }),

  B({ id: 'c18_b_night', title: 'Полтретьего',
    text: [
      { text: 'Ты сидишь на табурете у койки Оле. Он спит с открытым ртом. В половине третьего в блок входят двое санитаров с каталкой.\n\n— Lüdemann. Sonderabnahme.\n\nЛюдеман. Внеочередной забор.' },
      { when: flag('w.c18_ole_rest'), text: 'На спинке койки листок рукой врача: «через день». Санитар на него не смотрит.' },
      { text: 'Оле просыпается и сам подставляет руку. Губы у него белые.' },
    ],
    actions: [
      { id: 'c18_bn_block', label: 'Встать между каталкой и койкой', minutes: 20, risky: true, terminal: true, goto: 'c18_b_dawn',
        outcomes: [
          { id: 'ok', when: flag('w.c18_ole_rest'), text: 'Ты снимаешь листок со спинки и держишь его перед лицом санитара. Он читает, матерится шёпотом и увозит каталку к другой койке.\n\nОле смотрит на тебя зло. Потом засыпает.', effects: [set('bn', 'block'), w('ole_spared_night', true), npc('ole', -1)] },
          { id: 'out', text: 'Ты встаёшь перед каталкой. Санитар зовёт дежурного. Тебя выводят в коридор, пропуск рвут пополам. Через стекло двери ты видишь, как Оле увозят.\n\nДо утра ты сидишь на лестнице.', effects: [set('bn', 'out'), w('pass_lost', true), npc('ole', -2), { body: 'stress', delta: 4 }] },
        ] },
      { id: 'c18_bn_hand', label: 'Идти рядом и держать его за руку', minutes: 60, terminal: true, goto: 'c18_b_dawn',
        text: 'Ты идёшь рядом с каталкой. В процедурной он смотрит не на иглу, а в окно детской палаты напротив. Там горит ночник. Когда пакет полон, он сжимает твои пальцы и не помнит об этом.', effects: [set('bn', 'hand'), npc('ole', 3, 'c18_held_hand'), { body: 'stress', delta: 2 }] },
      { id: 'c18_bn_wake', label: 'Бежать будить Хенрике', minutes: 30, terminal: true, goto: 'c18_b_dawn',
        text: 'Хенрике приходит в пальто поверх рубашки. Она не кричит. Она садится на край каталки, и санитары не решаются её сдвинуть. Через десять минут приходит врач и отменяет забор.\n\n— Ein Mal, — говорит врач. — Das geht ein Mal.\n\nОдин раз. Так получится один раз.', effects: [set('bn', 'wake'), w('ole_spared_night', true), npc('henrike', 2), npc('ole', -1)] },
    ] }),

  B({ id: 'c18_b_dawn', title: 'Шесть утра',
    text: [
      { text: 'В шесть Хенрике стоит у окна коридора с двумя кружками. За окном плац в инее.\n\n— Die Kolonne geht um vier. Ein Platz für dich. Ich kann einen zweiten kriegen, sagt der Feldwebel.\n\nКолонна уходит в четыре. Одно место твоё. Я могу получить второе, говорит фельдфебель.' },
      { text: 'Она ждёт, что скажешь ты.' },
    ],
    actions: [
      { id: 'c18_bw_home', label: 'Звать её домой: хутору нужна хозяйка', minutes: 20, terminal: true, goto: 'c18_b_queue',
        outcomes: [
          { id: 'yes', when: any(flag('w.c18_ole_rest'), flag('w.c18_ole_spared_night'), own('bo', 'side')), text: 'Хенрике долго дует на чай.\n\n— Er will mich hier nicht. Das hat er dir gesagt, oder?\n\nОн не хочет, чтобы я была здесь. Он ведь тебе сказал?\n\nТы киваешь. Она идёт к фельдфебелю за вторым местом.', effects: [{ npc: 'henrike', moveTo: 'hof_luedemann' }, set('bw', 'home'), w('henrike', 'home'), npc('henrike', 2)] },
          { id: 'no', text: '— Nein, — говорит Хенрике. — Solange sie ihn jeden Tag stechen, bleibe ich. Den Hof habt ihr.\n\nНет. Пока его колют каждый день, я остаюсь. Хутор на вас.', effects: [set('bw', 'home'), w('henrike', 'stays')] },
        ] },
      { id: 'c18_bw_stay', label: 'Сказать: оставайся с ним', minutes: 20, terminal: true, goto: 'c18_b_queue',
        text: '— Bleib, — говоришь ты.\n\nХенрике выдыхает. Она снимает с шеи ключ на шнурке и вкладывает тебе в ладонь.\n\n— Der Schrank im Schlafzimmer. Papiere, das Sparbuch, der Fahrzeugbrief. Falls.\n\nШкаф в спальне. Бумаги, сберкнижка, документы на машину. На случай.', effects: [set('bw', 'stay'), w('henrike', 'stays'), w('henrike_key', true), npc('henrike', 3)] },
      { id: 'c18_bw_self', label: 'Сказать: решай сама, я поддержу любое', minutes: 20, terminal: true, goto: 'c18_b_queue',
        text: 'Хенрике усмехается.\n\n— Das sagt ihr Jungen immer. Und dann muss man doch selbst.\n\nВы, молодые, всегда так говорите. А решать всё равно самой.\n\nОна остаётся.', effects: [set('bw', 'self'), w('henrike', 'stays'), npc('henrike', 1)] },
    ] }),

  B({ id: 'c18_b_lists', title: 'Зал списков',
    text: [
      { text: 'В девять открывают зал списков: бывший актовый, стены в листах А4 от пола до потолка. Люди стоят вдоль стен и водят пальцами. Очередь к каждой стене длинная. До обеда успеешь к одной.' },
      { text: 'Где-то в это время у насыпи всё уже случилось. Часы над дверью показывают девять двенадцать.' },
    ],
    actions: [
      { id: 'c18_bi_north', label: 'Стена «Hamburg-Nord / Stormarn»: Мерле', minutes: 120, terminal: true, goto: 'c18_b_farewell',
        text: 'Аренсбург, три листа. «Thiessen, Uwe. Thiessen, Birgit. Thiessen, Merle — registriert 15.11., versorgt». Зарегистрирована, обеспечена. Ты читаешь строчку четыре раза.', effects: [set('bi', 'north'), w('merle_listed', true), { body: 'stress', delta: -3 }, until(18, 12, 0)] },
      { id: 'c18_bi_barmbek', label: 'Стена «Hamburg-Barmbek»: свой дом', minutes: 120, terminal: true, goto: 'c18_b_farewell',
        outcomes: [
          { id: 'okafor', when: okaforStayed, text: 'Твоя улица, твой номер дома. Одиннадцать фамилий. Напротив своей ты читаешь: «abgemeldet». Напротив «Okafor, E.» стоит: «verblieben — versorgt Hausgemeinschaft». Остался, ухаживает за жильцами дома. Запись от шестнадцатого.', effects: [set('bi', 'barmbek'), w('okafor_listed', true), until(18, 12, 0)] },
          { id: 'none', text: 'Твоя улица, твой номер дома. Одиннадцать фамилий. Напротив своей ты читаешь: «abgemeldet». Выбыла. Напротив шести других пусто.', effects: [set('bi', 'barmbek'), until(18, 12, 0)] },
        ] },
      { id: 'c18_bi_station', label: 'Стена «Klinikum Buchholz, Station 4»', minutes: 120, terminal: true, goto: 'c18_b_farewell',
        text: 'Шестьдесят одна фамилия. Двадцать три зачёркнуты синей ручкой. У каждой указан адрес. Ты переписываешь на ладонь тех, кто жил в Бухгольце на одной улице с {A.ins}: «Brockmann, Ilse». Не зачёркнута.', effects: [set('bi', 'station'), w('ilse_listed', true), until(18, 12, 0)] },
    ] }),

  B({ id: 'c18_b_convoy', title: 'Колонна', ambient: cold18,
    text: [
      { text: 'В четыре на плацу три грузовика. На выходе сержант забирает жетон.' },
      { when: own('gate', 'gave'), text: 'Телефон из ячейки сорок один холодный, как камень. Сети нет.' },
      { when: flag('w.c18_phone_held'), text: 'Твой телефон остаётся у коменданта до пятницы. Сержант разводит руками.' },
      { when: flag('w.c18_henrike'), text: 'Оле стоит у окна второго этажа. Он не машет.' },
      { text: 'У третьего поста, за Зальцхаузеном, колонна стоит десять минут. Двое солдат курят у борта и говорят про утро под Йестебургом. Слов через брезент не разобрать.' },
    ],
    actions: [
      { id: 'c18_bc_ask', label: 'Откинуть брезент и спросить', minutes: 80, terminal: true, goto: 'c18_evening',
        text: '— Was war heute früh bei Jesteburg?\n\nСолдат смотрит на тебя, потом на напарника.\n\n— Fragen Sie zu Hause.\n\nСпросите дома.\n\nОстаток дороги ты думаешь, что это значит.', effects: [set('bc', 'ask'), { body: 'stress', delta: 2 }, until(18, 17, 20)] },
      { id: 'c18_bc_wait', label: 'Не спрашивать', minutes: 80, terminal: true, goto: 'c18_evening',
        text: 'Ты сидишь и считаешь столбы в щели брезента. На двести сороковом узнаёшь поворот.', effects: [set('bc', 'wait'), until(18, 17, 20)] },
      { id: 'c18_bc_plan', label: 'Обдумать, что сказать {A.dat} первым', minutes: 80, terminal: true, goto: 'c18_evening',
        text: 'Ты раскладываешь сутки по порядку: Хенрике, Оле, врач, списки. К повороту у тебя есть три фразы. Только неизвестно, кому придётся их говорить.', effects: [set('bc', 'plan'), { body: 'stress', delta: -1 }, until(18, 17, 20)] },
    ] }),
];
