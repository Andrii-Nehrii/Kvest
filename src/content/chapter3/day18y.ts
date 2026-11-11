import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, yard14 } from './point14';
import { A18, B18, S18, camp18b, cold18, lueneburg, npc, own, v } from './point18';

// Участок 18, дополнение: коптильня на чердаке (подсказка — тетрадь Хенрике в c18_a_supper), подпись, стук в ворота у A;
// ночная палата, вопрос врача, свободные часы и второе место в колонне у B.
const set = (key: string, value: string | boolean): Effect => ({ set: `$.c18_${key}`, value });
const w = (key: string, value: string | boolean): Effect => ({ set: `w.c18_${key}`, value });
const until = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S18({ ...scene, for: 'any', chapter: 'ch3',
  actions: scene.actions.map(a => ({ ...a, when: all(A18, a.when ?? { always: true }) })) });
const B = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S18({ ...scene, for: 'any', chapter: 'ch3', location: lueneburg, camp: camp18b, safe: false,
  actions: scene.actions.map(a => ({ ...a, when: all(B18, a.when ?? { always: true }) })) });

const smoked: Effect[] = [{ give: 'c18_wurst', qty: 2 }, { place: 'c18_ham', at: 'c3_farm_stock', qty: 1 }];
const noKey = (key: string, text: string, label: string, minutes: number) =>
  ({ id: `c18_sm_${key}`, label, minutes, terminal: true, goto: 'c18_a_smoke2', text, effects: [set('sm', key)] });
const fed: Effect[] = [{ body: 'hunger', delta: -45 }, { body: 'thirst', delta: -40 }];
const kasiaHere: Cond = all({ npc: 'kasia', alive: true }, flag('w.nowaks_gone'));
const kasiaFriend: Cond = all(kasiaHere, flag('B.helped_nowaks'));
const pawelHere: Cond = { npc: 'pawel', alive: true };
export const ruthHere18: Cond = all({ npc: 'c8_ruth', alive: true }, { npc: 'c8_eva', alive: true });
const toThree = until(18, 14, 50);
/** После прощания с Оле: при свободном втором месте — сцена у борта. */
export const afterFarewell18 = [{ id: 'seat', when: v('w.c18_henrike', 'stays'), goto: 'c18_b_seat' }, { id: 'go', goto: 'c18_b_convoy' }];

export const day18yScenes: Scene[] = [
  // ───────────── A ─────────────
  A({ id: 'c18_a_courier', title: 'Подпись', camp: yard14, ambient: cold18,
    text: [
      { text: 'Ты домываешь тарелку, когда у ворот звякает велосипедный звонок. Парень с повязкой дружинника держит планшетку с листом. Фонарик у него в зубах.' },
      { text: '— Von Herrn Brandt. Morgen ab acht bleibt jeder auf seinem Hof. Unterschreiben Sie, dass Sie es wissen.\n\nОт господина Брандта. Завтра с восьми каждый сидит на своём дворе. Распишитесь, что знаете.' },
    ],
    actions: [
      { id: 'c18_co_sign', label: 'Расписаться', minutes: 5, terminal: true, goto: 'c18_a_hens',
        text: 'Ты расписываешься под одиннадцатью фамилиями. Почерк Кёлер узнаёшь сразу: буквы круглые, как булки. Парень светит на подпись и кивает.', effects: [set('co', 'sign'), w('signed', true)] },
      { id: 'c18_co_refuse', label: 'Не подписывать', minutes: 5, terminal: true, goto: 'c18_a_hens',
        text: '— Dann schreibe ich «verweigert».\n\nТогда пишу «отказался».\n\nОн выводит слово печатными буквами и обводит его дважды.', effects: [set('co', 'refuse'), npc('c16_brandt', -1)] },
      { id: 'c18_co_ask', label: 'Спросить, когда солдаты приедут на самом деле', minutes: 8, terminal: true, goto: 'c18_a_hens',
        text: 'Парень оглядывается на дорогу.\n\n— Offiziell um acht. Mein Onkel fährt den zweiten Wagen. Er sagt, ab fünf stehen sie am Übergang.\n\nОфициально в восемь. Мой дядя водит вторую машину. Говорит, с пяти они встанут у переезда.\n\nЛисток он убирает, так и не дав тебе ручку.', effects: [set('co', 'ask'), { body: 'stress', delta: 1 }] },
    ] }),

  A({ id: 'c18_a_smoke', title: 'Железная дверца', camp: house14,
    text: [
      { text: 'Из коридора у спальни узкая лестница идёт на чердак. Там сквозит и пахнет холодным дымом. У дымохода в кирпич вделана железная дверца. На ней висячий замок, старый и смазанный.' },
      { text: 'Ключа в замке нет.' },
    ],
    actions: [
      noKey('board', 'На доске семь ключей. Ты несёшь наверх все разом и пробуешь по очереди. Два входят в скважину. Ни один не проворачивается.', 'Искать ключ на доске у кухонной двери', 15),
      noKey('shop', 'В банках гвозди, шайбы и ключ от велосипедного замка. На верстаке пыль в палец. Сюда давно никто не заходил.', 'Искать ключ в мастерской Оле, в банках с мелочью', 15),
      { id: 'c18_sm_salt', label: 'Искать ключ в кладовке, на полке с солью', minutes: 10, terminal: true, goto: 'c18_a_noon',
        text: 'Соль у Хенрике в глиняном горшке с крышкой. Ключ лежит прямо на соли, в вощёной бумаге. Замок открывается с пол-оборота.\n\nЗа дверцей на крюках висят два кольца колбасы и кусок окорока в марле. Кольца ты забираешь. Окорок относишь в кладовку, к общему.',
        effects: [set('sm', 'key'), w('smoke', 'key'), ...smoked] },
      noKey('room', 'В тумбочке очки, пузырёк валерьянки и фотография Оле в школьной рубашке. Ты задвигаешь ящик тише, чем {m:открывал|открывала}.', 'Искать ключ в спальне, в тумбочке Хенрике', 10),
      { id: 'c18_sm_skip', label: 'Не трогать: заперто не для тебя', minutes: 2, terminal: true, goto: 'c18_a_noon',
        text: 'Ты спускаешься на кухню. Запах дыма держится на свитере до вечера.', effects: [set('sm', 'none')] },
    ] }),

  A({ id: 'c18_a_smoke2', title: 'Замок', camp: house14,
    text: [{ text: 'Ключа нет. Ноги гудят: ночь была короткой. У поленницы во дворе стоит колун.' }],
    actions: [
      { id: 'c18_sm2_break', label: 'Сбить замок обухом колуна', minutes: 10, terminal: true, goto: 'c18_a_noon',
        text: 'Дужка лопается с третьего удара. Грохот идёт по всему дому. За дверцей на крюках два кольца колбасы и кусок окорока в марле. Кольца ты забираешь, окорок относишь в кладовку.\n\nДверцу приходится подвязать проволокой. Запираться она уже не будет.',
        effects: [set('sm', 'broke'), w('smoke', 'broke'), ...smoked, npc('henrike', -1, 'c18_broke_smoke'), { body: 'stress', delta: 1 }] },
      { id: 'c18_sm2_leave', label: 'Оставить как есть', minutes: 2, terminal: true, goto: 'c18_a_noon',
        text: 'Ты спускаешься на кухню. Запах дыма держится на свитере до вечера.', effects: [set('sm', 'left')] },
    ] }),

  A({ id: 'c18_a_knock', title: 'Стук в ворота', camp: yard14, ambient: cold18, onEnter: [{ set: '$.met.c18_volker', value: true }],
    text: [
      { text: 'Тебя будит стук в ворота, негромкий и терпеливый. Начало пятого, за окном сумерки.' },
      { text: 'У ворот мужчина лет пятидесяти с ручной тележкой. В тележке кровельный молоток, рулоны рубероида и спальник. Рукава у него закатаны до локтей, хотя холодно. Он знает, на что сейчас смотрят.' },
      { text: '— Volker. Dachdecker aus Tostedt. Ich brauche Wasser. Und eine Nacht unter einem Dach, wenn es geht. Ich zahle mit Arbeit.\n\nФолькер. Кровельщик из Тоштедта. Мне нужна вода. И одна ночь под крышей, если можно. Плачу работой.' },
    ],
    actions: [
      { id: 'c18_kn_in', label: 'Пустить его на сеновал до утра', minutes: 15, terminal: true, goto: 'c18_a_wait',
        text: 'Ты смотришь его руки и шею и открываешь ворота. Фолькер первым делом глядит не на дом, а на крышу курятника.\n\n— Die Pappe ist durch. Mache ich morgen früh.\n\nРубероид прохудился. Утром сделаю.', effects: [set('kn', 'in'), w('lodger', true)] },
      { id: 'c18_kn_water', label: 'Вынести ему воды, но не пускать', minutes: 10, terminal: true, goto: 'c18_a_wait',
        text: 'Он пьёт у ворот, не торопясь, и наполняет две бутылки из твоего ведра.\n\n— Verstehe ich.\n\nПонимаю.\n\nТележка скрипит до самого поворота.', effects: [set('kn', 'water')] },
      { id: 'c18_kn_wurst', label: 'Дать ему в дорогу воды и кольцо колбасы', when: { has: 'c18_wurst' }, minutes: 10, terminal: true, goto: 'c18_a_wait',
        text: 'Фолькер взвешивает кольцо на ладони. Потом достаёт из тележки рулон рубероида и ставит у столба.\n\n— Für das Hühnerdach. Geschenkt nehme ich nichts.\n\nДля крыши курятника. Даром я ничего не беру.', effects: [set('kn', 'wurst'), { take: 'c18_wurst' }, w('roofing', true)] },
      { id: 'c18_kn_no', label: 'Сказать через ворота: мест нет', minutes: 3, terminal: true, goto: 'c18_a_wait',
        text: 'Он кивает так, будто слышит это не первый раз за день, и берётся за ручку тележки.', effects: [set('kn', 'no')] },
    ] }),

  // ───────────── B ─────────────
  B({ id: 'c18_b_ward', title: 'Четыре утра',
    text: [
      { when: not(flag('w.c18_pass_lost')), text: 'В четыре в коридоре гаснет свет: казарму переводят на другой генератор. Ты сидишь на табурете у двери блока.' },
      { when: flag('w.c18_pass_lost'), text: 'В четыре на лестнице гаснет свет: казарму переводят на другой генератор.' },
      { text: 'Из детской палаты выходит сестра с фонариком на лбу.\n\n— Sind Sie wach? Ich brauche zwei Hände.\n\nВы не спите? Мне нужны две руки.' },
    ],
    actions: [
      { id: 'c18_bv_help', label: 'Пойти с ней', minutes: 40, terminal: true, goto: 'c18_b_dawn',
        text: 'Девочка у окна лежит серая, с открытыми глазами. Сестра вешает новый пакет. Ты держишь тонкую руку, чтобы игла не вышла. На пакете фамилия от руки: Lüdemann. Через двадцать минут у девочки розовеют губы.\n\n— So schnell geht das nur bei seinem.\n\nТак быстро бывает только от его плазмы.', effects: [set('bv', 'help'), w('saw_plasma', true), { body: 'fatigue', delta: 4 }, until(18, 6)] },
      { id: 'c18_bv_ask', label: 'Спросить, что бывает, когда пакета нет', minutes: 15, terminal: true, goto: 'c18_b_dawn',
        text: 'Сестра выключает фонарик, чтобы не светить тебе в лицо.\n\n— Dann zählen wir Stunden. Beim letzten Kind waren es elf.\n\nТогда считаем часы. У последнего ребёнка их было одиннадцать.\n\nВ палату она уходит одна.', effects: [set('bv', 'ask'), w('hours_known', true), { body: 'stress', delta: 2 }, until(18, 6)] },
      { id: 'c18_bv_sleep', label: 'Сказать, что руки не держат, и закрыть глаза', minutes: 5, terminal: true, goto: 'c18_b_dawn',
        text: '— Schon gut.\n\nНичего.\n\nТы засыпаешь сидя, затылком к стене.', effects: [set('bv', 'sleep'), until(18, 6, 0, true)] },
    ] }),

  B({ id: 'c18_b_answer', title: 'Её вопрос',
    text: [{ text: 'Доктор Алерс не уходит. Ручка в её пальцах стоит над чьей-то картой.\n\n— Sagen Sie es. Sie sind die Einzige hier, die nichts von mir braucht.\n\nСкажите. Вы здесь единственная, кому от меня ничего не нужно.' }],
    actions: [
      { id: 'c18_ba_kids', label: 'Трое детей', minutes: 5, terminal: true, goto: 'c18_b_lists',
        text: 'Она кивает один раз.\n\n— So rechne ich auch, jeden Morgen. Danke, dass Sie es laut sagen.\n\nТак я и считаю, каждое утро. Спасибо, что сказали вслух.', effects: [set('ba', 'kids'), w('doctor_answer', 'kids')] },
      { id: 'c18_ba_man', label: 'Один мужчина: его тоже ждут дома', minutes: 5, terminal: true, goto: 'c18_b_lists',
        text: 'Доктор Алерс долго смотрит в карту.\n\n— Einen Tag kann ich ihm geben. Donnerstag. Mehr habe ich nicht.\n\nОдин день я могу ему дать. Четверг. Больше у меня нет.', effects: [set('ba', 'man'), w('doctor_answer', 'man'), w('ole_free_day', true)] },
      { id: 'c18_ba_none', label: 'Это не мне решать', minutes: 5, terminal: true, goto: 'c18_b_lists',
        text: '— Mir auch nicht. Und trotzdem unterschreibe ich.\n\nИ не мне. А подписываю всё равно я.', effects: [set('ba', 'none'), w('doctor_answer', 'none')] },
    ] }),

  B({ id: 'c18_b_free', title: 'До трёх',
    text: [
      { text: 'Из зала списков ты выходишь в полдень. Колонна в четыре, к Оле пустят в три. До трёх ты никому здесь не {m:нужен|нужна}.' },
      { when: flag('w.c18_phone_held'), text: 'Твой телефон лежит в штабе, у коменданта.' },
    ],
    actions: [
      { id: 'c18_bfr_kitchen', label: 'Пойти на кухню: там кормят тех, кто чистит', when: not(own('side', 'kitchen')), minutes: 120, activity: 'light', terminal: true, goto: 'c18_b_farewell',
        outcomes: [
          { id: 'friend', when: kasiaFriend, text: 'У котла стоит женщина в чужом белом халате. Нож у неё в руке останавливается.\n\n— Jezus Maria. Barmbek!\n\nКася Новак. В первый день ты {m:помогал|помогала} им грузить фургон. Она сажает тебя чистить морковь и говорит без остановки. Тим лежит у детей, ему дают плазму. С собой она заворачивает тебе полбуханки.', effects: [set('side2', 'kitchen'), ...fed, { give: 'bread' }, npc('kasia', 2), toThree] },
          { id: 'kasia', when: kasiaHere, text: 'У котла стоит женщина в чужом белом халате. Кася Новак, соседка из Бармбека. Она кивает тебе, как кивают на лестнице, и подвигает ведро с морковью. За два часа ты узнаёшь одно: Тим лежит у детей и получает плазму.', effects: [set('side2', 'kitchen'), ...fed, toThree] },
          { id: 'other', text: 'Женщину у котла зовут Гизела. Она ставит перед тобой ведро моркови и миску супа. За два часа она ни разу не поднимает глаз.', effects: [set('side2', 'kitchen'), ...fed, toThree] },
        ] },
      { id: 'c18_bfr_laundry', label: 'Пойти во двор прачечной, к фургонам', when: not(own('side', 'laundry')), minutes: 90, terminal: true, goto: 'c18_b_farewell',
        outcomes: [
          { id: 'pawel', when: pawelHere, text: 'У второго фургона человек в ватнике грузит мешки с бельём. Он оборачивается на шаги.\n\n— Pani z hutoru.\n\nПавел. Автобус Рут дошёл сюда на вторые сутки. Теперь он возит бельё по округе. Дважды в неделю он берётся оставлять письма в почтовом ящике Людеманов. Денег не хочет.', effects: [set('side2', 'laundry'), w('post', true), npc('pawel', 2), toThree] },
          { id: 'other', text: 'Шофёра фургона зовут Гюнтер. Он возит бельё через Йестебург по вторникам и пятницам. За твой шарф он согласен бросать письма в почтовый ящик Людеманов.', effects: [set('side2', 'laundry'), w('post', true), toThree] },
        ] },
      { id: 'c18_bfr_phone', label: 'Идти к коменданту за телефоном', when: flag('w.c18_phone_held'), minutes: 60, risky: true, terminal: true, goto: 'c18_b_farewell',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3 }, text: 'Комендант, майор с красными глазами, слушает тебя стоя.\n\n— Warum haben Sie gelogen?\n\nПочему вы солгали?\n\nТы говоришь как есть: дома человек, который ждёт сообщения. Он выдвигает ящик стола и кладёт телефон перед тобой.\n\n— Am Tor abgeben. Diesmal wirklich.\n\nСдать на КПП. На этот раз по-настоящему.', effects: [set('bfr', 'phone'), w('phone_held', false), toThree] },
          { id: 'fail', text: 'Комендант не поднимает головы от бумаг.\n\n— Freitag.\n\nВ пятницу.\n\nАдъютант доводит тебя до двери и держит её открытой, пока ты не выйдешь.', effects: [set('bfr', 'phone_no'), { body: 'stress', delta: 2 }, toThree] },
        ] },
      { id: 'c18_bfr_henrike', label: 'Посидеть с Хенрике', minutes: 60, terminal: true, goto: 'c18_b_farewell',
        text: 'Хенрике штопает чужой носок, натянув его на лампочку. Вы сидите рядом и молчите. Потом она спрашивает, не поднимая глаз:\n\n— Die Hühner. Wer macht abends zu?\n\nКуры. Кто закрывает их на ночь?', effects: [set('bfr', 'henrike'), npc('henrike', 2), { body: 'stress', delta: -1 }, toThree] },
      { id: 'c18_bfr_sleep', label: 'Лечь и проспать до трёх', minutes: 5, terminal: true, goto: 'c18_b_farewell',
        text: 'Ты ложишься на раскладушку Хенрике в куртке. Без десяти три тебя будит фрау Петерс, за плечо.', effects: [set('bfr', 'sleep'), until(18, 14, 50, true)] },
    ] }),

  B({ id: 'c18_b_seat', title: 'Второе место', ambient: cold18,
    text: [
      { text: 'На плацу фельдфебель идёт вдоль борта со списком.\n\n— Lüdemann, zwei Plätze. Wo ist die zweite Person?\n\nЛюдеман, два места. Где второй человек?' },
      { text: 'Второе место Хенрике выпросила утром и не отменила. Оно свободно.' },
      { when: ruthHere18, text: 'У шлагбаума стоит Эва с рюкзаком. Она не подходит. Она стоит так, чтобы ты её {m:видел|видела}.' },
      { when: not(ruthHere18), text: 'У шлагбаума стоит Яна с рюкзаком. Она не подходит. Она стоит так, чтобы ты её {m:видел|видела}.' },
      { text: 'Ханна сидит на бордюре у столовой. Мальчик спит у неё на коленях, шапка надвинута на глаза.' },
    ],
    actions: [
      { id: 'c18_bs2_eva', label: 'Позвать Эву', when: ruthHere18, minutes: 10, terminal: true, goto: 'c18_b_convoy',
        text: 'Ты поднимаешь руку. Эва бежит через плац, придерживая рюкзак. Фельдфебель вписывает её фамилию и не спрашивает, кем она тебе приходится.\n\n— Ich mache alles, — говорит она.\n\nЯ буду делать всё.\n\nВ кузове она держит рюкзак на коленях и не выпускает лямку.', effects: [set('bs2', 'girl'), w('seat', 'eva'), { npc: 'c8_eva', moveTo: 'hof_luedemann' }, npc('c8_eva', 3, 'c18_took_me')] },
      { id: 'c18_bs2_jana', label: 'Позвать Яну', when: not(ruthHere18), minutes: 10, terminal: true, goto: 'c18_b_convoy',
        text: 'Ты поднимаешь руку. Яна бежит через плац, придерживая рюкзак. Фельдфебель вписывает её фамилию и не спрашивает, кем она тебе приходится.\n\n— Ich mache alles, — говорит она.\n\nЯ буду делать всё.\n\nВ кузове она держит рюкзак на коленях и не выпускает лямку.', effects: [set('bs2', 'girl'), w('seat', 'jana')] },
      { id: 'c18_bs2_hanna', label: 'Позвать Ханну с мальчиком', minutes: 10, terminal: true, goto: 'c18_b_convoy',
        text: '— Wohin? — спрашивает Ханна.\n\n— Raus hier.\n\nОтсюда.\n\nОна встаёт сразу. Место одно, и мальчика она берёт на руки.\n\n— In Jesteburg wohnt meine Schwägerin. An der Feuerwehr steige ich aus.\n\nВ Йестебурге живёт моя золовка. У пожарной части я сойду.', effects: [set('bs2', 'hanna'), w('seat', 'hanna')] },
      { id: 'c18_bs2_none', label: 'Сказать: второго нет', minutes: 5, terminal: true, goto: 'c18_b_convoy',
        text: 'Фельдфебель зачёркивает строчку. Ты садишься у борта, спиной к шлагбауму.', effects: [set('bs2', 'none'), w('seat', 'none'), { if: flag('w.c18_eva_asks'), then: [npc('c8_eva', -1)] }] },
    ] }),
];
