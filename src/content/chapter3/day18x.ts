import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, yard14 } from './point14';
import { afterFarewell18 } from './day18y';
import { A18, B18, S18, any, camp18b, cold18, colony17, jens18, lueneburg, ninaFarm, npc, v } from './point18';

// Участок 18: дополнительные сцены обеих линий. Каждая оставляет след в сводке КТ18 или в следующих точках.
const set = (key: string, value: string | boolean): Effect => ({ set: `$.c18_${key}`, value });
const w = (key: string, value: string | boolean): Effect => ({ set: `w.c18_${key}`, value });
const until = (d: number, h: number, m = 0): Effect => ({ restUntil: at(d, h, m) });
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S18({ ...scene, for: 'any', chapter: 'ch3',
  actions: scene.actions.map(a => ({ ...a, when: all(A18, a.when ?? { always: true }) })) });
const B = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S18({ ...scene, for: 'any', chapter: 'ch3', location: lueneburg, camp: camp18b, safe: false,
  actions: scene.actions.map(a => ({ ...a, when: all(B18, a.when ?? { always: true }) })) });
const afterHens = [
  { id: 'move', when: colony17('move'), goto: 'c18_m_hitch' }, { id: 'end', when: colony17('end'), goto: 'c18_e_walk' }, { id: 'home', goto: 'c18_h_evening' },
];
const denizAlive: Cond = { npc: 'deniz', alive: true };
const favorList: Cond = v('w.c18_tobias_favor', 'list');
const ruthHere: Cond = all({ npc: 'c8_ruth', alive: true }, { npc: 'c8_eva', alive: true });

export const day18xScenes: Scene[] = [
  A({ id: 'c18_a_call', title: 'Звонок', camp: house14,
    text: [
      { when: denizAlive, text: 'Без десяти пять звонит Дениз. Связь рвётся через слово.\n\n— У нас тут ходят. В рубашках. Третий за день мимо ворот. Идут в вашу сторону, вдоль B75. Ты там один?' },
      { when: not(denizAlive), text: 'Без десяти пять звонит Керем. Связь рвётся через слово.\n\n— У нас тут ходят. В рубашках. Третий за день мимо ворот. Идут в вашу сторону, вдоль B75. Ты там один?' },
    ],
    actions: [
      { id: 'c18_ac_come', label: 'Попросить приехать завтра к полудню', minutes: 5, terminal: true, goto: 'c18_a_koehler',
        text: '— К полудню буду, — говорит он. — На велосипеде. Бензин на такое я не трачу.', effects: [set('ac', 'come'), w('workshop_comes', true), npc('deniz', 1)] },
      { id: 'c18_ac_fine', label: 'Сказать, что справишься', minutes: 5, terminal: true, goto: 'c18_a_koehler',
        text: '— Ладно. Звони, если что, — говорит он и не кладёт трубку ещё секунды три.', effects: [set('ac', 'fine')] },
      { id: 'c18_ac_ask', label: 'Спросить, откуда они идут', minutes: 5, terminal: true, goto: 'c18_a_koehler',
        text: '— Из больницы. На каждом браслет. Один был в тапках с номером палаты. Они не бегут. Идут, как на работу.', effects: [set('ac', 'ask'), w('a_knows_hospital', true)] },
    ] }),

  A({ id: 'c18_a_hens', title: 'Курятник', camp: yard14, ambient: cold18,
    text: [
      { text: 'Перед сном ты идёшь закрыть кур. Фонарь выхватывает в углу сетки, у земли, дыру с кулак. Вчера её не было. На инее рядом узкий след с когтями.' },
    ],
    actions: [
      { id: 'c18_ah_fix', label: 'Заделать дыру сейчас', minutes: 35, activity: 'moderate', terminal: true, outcomes: afterHens,
        text: 'Ты прикручиваешь проволокой кусок старой решётки и заваливаешь низ кирпичами. Пальцы не гнутся. Куры смотрят на тебя с насеста.', effects: [set('ah', 'fix')] },
      { id: 'c18_ah_leave', label: 'Привалить доской до утра', minutes: 5, terminal: true, outcomes: afterHens,
        text: 'Ты приставляешь к дыре доску. Сегодня есть дела важнее кур.', effects: [set('ah', 'leave'), w('hens_lost', true)] },
    ] }),

  A({ id: 'c18_a_nina2', title: 'Что сказать Нине', camp: house14,
    text: [
      { when: ninaFarm, text: 'Нина видела из окна заднюю калитку.\n\n— Wer war das?\n\nКто это был?' },
      { when: not(ninaFarm), text: 'Телефон на подоконнике. От Нины три сообщения подряд: «Ich habe Schüsse gehört. Bis hierher». Я слышала выстрелы. Даже здесь. «Sag was». Скажи что-нибудь.' },
      { when: all(jens18, any(v('w.c18_colony', 'cleared'), v('w.c18_colony', 'ended'))), text: 'Ей надо сказать и про отца.' },
    ],
    actions: [
      { id: 'c18_an2_all', label: 'Рассказать всё, по порядку', minutes: 20, terminal: true, goto: 'c18_a_room',
        text: 'Ты рассказываешь по порядку и не выбираешь слова помягче. Нина слушает до конца.\n\n— Danke, dass du nicht lügst, — говорит она. Спасибо, что не врёшь.', effects: [set('an2', 'all'), w('nina_told', true), npc('c7_nina', 3)] },
      { id: 'c18_an2_later', label: 'Сказать: вечером, когда вернётся {B}', minutes: 5, terminal: true, goto: 'c18_a_room',
        text: '— Вечером. Вдвоём, — говоришь ты.\n\nНина кивает. До вечера она считает часы.', effects: [set('an2', 'later')] },
      { id: 'c18_an2_fork', label: 'Показать ей камертон', when: any(v('w.c18_ilse', 'kept'), v('w.c18_ilse', 'ended')), minutes: 15, terminal: true, goto: 'c18_a_room',
        text: 'Нина стучит камертоном о край стола и подносит к уху.\n\n— A, — говорит она. — Vierhundertvierzig.\n\nЛя. Четыреста сорок. До прошлого года она играла на скрипке.', effects: [set('an2', 'fork'), npc('c7_nina', 2)] },
    ] }),

  A({ id: 'c18_a_room', title: 'Спальня Хенрике', camp: house14,
    text: [
      { text: 'Спальня Хенрике стоит закрытая с её отъезда. Внутри холодно, на подоконнике засохшая герань. Если Хенрике вернётся с колонной, это первое, что она увидит.' },
    ],
    actions: [
      { id: 'c18_ar_move', label: 'Протопить и застелить её кровать', minutes: 30, activity: 'light', terminal: true, goto: 'c18_a_smoke',
        text: 'Ты приносишь ведро углей в жаровне и застилаешь кровать её бельём из шкафа. Герань поливаешь, хотя ей уже всё равно.', effects: [set('ar', 'move'), w('room_ready', true), npc('henrike', 2)] },
      { id: 'c18_ar_keep', label: 'Оставить как есть', minutes: 5, terminal: true, goto: 'c18_a_smoke',
        text: 'Ты закрываешь дверь. Приедет — тогда и протопите.', effects: [set('ar', 'keep')] },
    ] }),

  A({ id: 'c18_a_patrol', title: 'Список', camp: yard14, ambient: cold18,
    text: [
      { text: 'В пять у ворот останавливается патруль. Солдат с планшетом, не Тобиас.\n\n— Wer wohnt hier? Namen, alle. Ab morgen gibt es Rationen nur nach Liste.\n\nКто здесь живёт? Имена, все. С завтрашнего дня пайки только по списку.' },
      { when: favorList, text: 'Он открывает планшет и находит строчку.\n\n— Lüdemann-Hof. Albers hat angerufen. Wen Sie nennen, ist geprüft.\n\nХутор Людеманов. Альберс звонил. Кого назовёте, тот проверен.' },
    ],
    actions: [
      { id: 'c18_ap_all', label: 'Назвать всех, кто сейчас в доме', minutes: 10, terminal: true, goto: 'c18_evening',
        outcomes: [
          { id: 'tobias', when: favorList, text: 'Ты называешь всех. Солдат пишет, не поднимая глаз, и напротив каждого имени ставит «geprüft».', effects: [set('ap', 'all'), w('list', 'all'), w('list_checked', true), until(18, 17, 20)] },
          { id: 'plain', text: 'Ты называешь всех. Солдат пишет, не поднимая глаз. Напротив каждого имени он ставит крестик: проверить.', effects: [set('ap', 'all'), w('list', 'all'), until(18, 17, 20)] },
        ] },
      { id: 'c18_ap_two', label: 'Назвать только себя и {B.acc}', minutes: 10, terminal: true, goto: 'c18_evening',
        text: '— Zwei, — повторяет солдат. Двое. Он смотрит на окна второго этажа, но ничего не говорит.', effects: [set('ap', 'two'), w('list', 'two'), { if: favorList, then: [w('list_checked', true)] }, until(18, 17, 20)] },
      { id: 'c18_ap_gift', label: 'Назвать всех и вынести ему кольцо колбасы', when: all({ has: 'c18_wurst' }, not(favorList)), minutes: 10, terminal: true, goto: 'c18_evening',
        text: 'Ты называешь всех и кладёшь на капот кольцо колбасы. Солдат смотрит на него, потом на тебя.\n\n— Bestechung?\n\n— Abendessen.\n\nВзятка? Ужин. Он убирает кольцо под куртку и напротив каждого имени пишет «geprüft». Проверено.', effects: [set('ap', 'gift'), w('list', 'all'), w('list_checked', true), { take: 'c18_wurst' }, until(18, 17, 20)] },
      { id: 'c18_ap_hosts', label: 'Назвать Людеманов: хутор их', minutes: 10, terminal: true, goto: 'c18_evening',
        text: '— Lüdemann, Henrike. Lüdemann, Ole, — пишет солдат. — Und Sie?\n\n— Gäste, — говоришь ты. Гости.', effects: [set('ap', 'hosts'), w('list', 'hosts'), npc('henrike', 1), until(18, 17, 20)] },
    ] }),

  B({ id: 'c18_b_reg', title: 'Регистрация',
    text: [
      { text: 'За шлагбаумом палатка регистрации. Девушка в маске заполняет карточку.\n\n— Kontakt zu Infizierten in den letzten zehn Tagen?\n\nКонтакт с заражёнными за последние десять дней?' },
    ],
    actions: [
      { id: 'c18_br_yes', label: 'Сказать правду', minutes: 15, terminal: true, goto: 'c18_b_henrike',
        text: 'Она меряет тебе температуру дважды и надевает на запястье жёлтую ленту. С жёлтой ты ешь за отдельным столом. Зато врачи разговаривают с тобой без предисловий.', effects: [set('br', 'yes'), w('b_yellow', true)] },
      { id: 'c18_br_no', label: 'Сказать: нет', minutes: 10, terminal: true, goto: 'c18_b_henrike',
        text: 'Белая лента. Девушка даже не поднимает глаз.', effects: [set('br', 'no')] },
    ] }),

  B({ id: 'c18_b_kids', title: 'Детская палата',
    text: [
      { text: 'Через коридор от доноров детская палата. Дверь стеклянная. Шесть кроватей, у троих над головой жёлтые пакеты.' },
      { when: all({ npc: 'kasia', alive: true }, flag('w.nowaks_gone')), text: 'На второй кровати Тим Новак. На тумбочке клетка. Пан Кулька спит в вате.' },
      { text: 'Сестра у двери говорит шёпотом:\n\n— Am Freitag kommt Ersatz aus Hannover. Bis dahin hängt alles an ihm.\n\nВ пятницу придёт замена из Ганновера. До тех пор всё держится на нём.' },
    ],
    actions: [
      { id: 'c18_bq_read', label: 'Войти и почитать им вслух', minutes: 25, terminal: true, goto: 'c18_b_supper',
        text: 'На подоконнике одна книга, «Jim Knopf». Ты читаешь главу. Немецкий у тебя с акцентом, и девочка у окна поправляет тебя на каждом третьем слове. К концу главы спят все, кроме неё.', effects: [set('bq', 'read'), w('friday_known', true), { body: 'stress', delta: -2 }] },
      { id: 'c18_bq_friday', label: 'Расспросить сестру про пятницу', minutes: 15, terminal: true, goto: 'c18_b_supper',
        text: '— Wenn der Transport durchkommt, — говорит сестра. Если транспорт пройдёт. — Letzte Woche kam er nicht.\n\nНа прошлой неделе не прошёл.', effects: [set('bq', 'friday'), w('friday_known', true), w('friday_doubt', true)] },
      { id: 'c18_bq_go', label: 'Посмотреть через стекло и уйти', minutes: 5, terminal: true, goto: 'c18_b_supper',
        text: 'Ты стоишь у стекла минуту. Потом идёшь на ужин.', effects: [set('bq', 'go')] },
    ] }),

  B({ id: 'c18_b_row', title: 'Третий ряд, у стены', onEnter: [{ if: { not: ruthHere }, then: [{ set: '$.met.c18_jana', value: true }] }],
    text: [
      { when: ruthHere, text: 'В женском корпусе тебя окликают по имени. Эва. За ней на раскладушке Рут, с ногой на свёрнутом одеяле.\n\n— Der Bus steht seit Samstag ohne Diesel, — говорит Рут. Автобус с субботы стоит без солярки.' },
      { when: ruthHere, text: 'Эва берёт тебя за рукав.\n\n— Ihr habt einen Hof. Nehmt mich mit. Ich kann melken, ich kann nähen. Hier werde ich verrückt.\n\nУ вас хутор. Возьмите меня. Я умею доить и шить. Здесь я сойду с ума.' },
      { when: not(ruthHere), text: 'В женском корпусе тебя трогает за рукав девушка лет двадцати, с соседней раскладушки. Её зовут Яна.\n\n— Ihr habt einen Hof? Nehmt mich mit. Ich kann melken, ich kann nähen. Hier werde ich verrückt.\n\nУ вас хутор? Возьмите меня. Я умею доить и шить. Здесь я сойду с ума.' },
    ],
    actions: [
      { id: 'c18_bx_ask', label: 'Пообещать спросить {A.acc}', minutes: 10, terminal: true, goto: 'c18_b_block',
        text: '— Я спрошу. Одна я такое не решаю, — говоришь ты.\n\nОна записывает номер своей раскладушки на твоей ладони, рядом с жетоном.', effects: [set('bx', 'ask'), w('eva_asks', true), npc('c8_eva', 2)] },
      { id: 'c18_bx_no', label: 'Сказать честно: места нет', minutes: 10, terminal: true, goto: 'c18_b_block',
        text: 'Она отпускает рукав сразу.\n\n— Schon gut, — говорит она. Ничего. И отворачивается к стене.', effects: [set('bx', 'no'), npc('c8_eva', -2)] },
      { id: 'c18_bx_address', label: 'Объяснить, как найти хутор', minutes: 10, terminal: true, goto: 'c18_b_block',
        text: 'Ты рисуешь на обороте её карточки: Йестебург, поворот у почтового ящика Людеманов. Придёт она или нет, зависит от неё.', effects: [set('bx', 'address'), w('eva_asks', true), w('eva_address', true), npc('c8_eva', 1)] },
    ] }),

  B({ id: 'c18_b_queue', title: 'Очередь за кашей', ambient: cold18,
    text: [
      { text: 'В семь очередь за кашей тянется вдоль плаца. Перед тобой стоит Ханна из грузовика. Мальчика с ней нет.\n\n— Mein Mann ist heute Nacht nicht aufgewacht, — говорит она ровно. — Neunter Tag. Sie sagen: Kreislauf.\n\nМой муж ночью не проснулся. Девятый день. Говорят: сердце.' },
      { text: 'У Оле сегодня девятый день.' },
    ],
    actions: [
      { id: 'c18_bu_henrike', label: 'Сказать об этом Хенрике', minutes: 20, terminal: true, goto: 'c18_b_lists',
        text: 'Хенрике выслушивает и ставит кружку на подоконник, мимо. Кружка разбивается.\n\n— Ich bleibe an seinem Bett. Sollen sie mich wegtragen.\n\nЯ сяду у его койки. Пусть уносят меня вместе с ней.', effects: [set('bu', 'henrike'), w('ninth_day', true), npc('henrike', 1), { body: 'hunger', delta: -30 }, { body: 'thirst', delta: -30 }, until(18, 9, 0)] },
      { id: 'c18_bu_doctor', label: 'Пойти с этим к врачу', minutes: 30, terminal: true, goto: 'c18_b_answer',
        text: 'Доктор Алерс слушает стоя.\n\n— Ich weiß, — говорит она. — Ich habe den Schein unterschrieben. Was soll ich tun: drei Kinder oder ein Mann?\n\nЯ знаю. Я подписывала справку. Что мне делать: трое детей или один мужчина?\n\nОна ждёт ответа всерьёз.', effects: [set('bu', 'doctor'), w('ninth_day', true), w('doctor_asked', true), { body: 'hunger', delta: -30 }, { body: 'thirst', delta: -30 }, until(18, 9, 0)] },
      { id: 'c18_bu_keep', label: 'Никому не говорить', minutes: 15, terminal: true, goto: 'c18_b_lists',
        text: 'Ты берёшь две миски: себе и Ханне. Она ест, потому что ты стоишь рядом и ждёшь.', effects: [set('bu', 'keep'), { body: 'hunger', delta: -30 }, { body: 'thirst', delta: -30 }, until(18, 9, 0)] },
    ] }),

  B({ id: 'c18_b_farewell', title: 'Перед колонной',
    text: [
      { when: not(flag('w.c18_pass_lost')), text: 'В три тебя ещё раз пускают к донорам, на десять минут. Оле сидит на койке одетый и держит на колене сложенный листок.' },
      { when: flag('w.c18_pass_lost'), text: 'К донорам тебя больше не пускают. В три Оле сам спускается на лестницу, держась за перила. В руке у него сложенный листок.' },
      { text: '— Für {A}. Wegen dem Gewehr und dem Diesel. Und wo der zweite Kellerschlüssel liegt.\n\nДля {A.gen}. Про ружьё и солярку. И где лежит второй ключ от подвала.' },
    ],
    actions: [
      { id: 'c18_bz_promise', label: 'Взять листок и взять с него слово: закружится голова — он говорит «стоп»', minutes: 10, terminal: true, outcomes: afterFarewell18,
        text: '— Versprochen, — говорит Оле слишком быстро. Обещаю. Потом, медленнее: — Ich versuch’s.\n\nПопробую.', effects: [set('bz', 'promise'), w('ole_letter', true), w('ole_promise', true), npc('ole', 1), until(18, 15, 50)] },
      { id: 'c18_bz_take', label: 'Взять листок и обнять его', minutes: 10, terminal: true, outcomes: afterFarewell18,
        text: 'Он деревенеет, как все Людеманы, когда их обнимают. Потом хлопает тебя по спине, два раза.', effects: [set('bz', 'take'), w('ole_letter', true), npc('ole', 2), until(18, 15, 50)] },
      { id: 'c18_bz_friday', label: 'Взять листок и сказать: в пятницу за тобой приедут', when: flag('w.c18_friday_known'), minutes: 10, terminal: true, outcomes: afterFarewell18,
        text: '— Wer sagt das?\n\n— Deine Mutter. Und die Schwester von den Kindern: am Freitag kommt Ersatz.\n\nОле долго складывает листок ещё вдвое.\n\n— Wenn er kommt, — говорит он. Если придёт.', effects: [set('bz', 'friday'), w('ole_letter', true), w('ole_told_friday', true), until(18, 15, 50)] },
    ] }),
];
