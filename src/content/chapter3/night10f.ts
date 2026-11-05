import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { all, not } from './world3';
import { B10, S10, evidence10, house10, kept10, night10, ninaKey10, partnerSearch10 } from './point10';

const toFever: Effect = { restUntil: at(13, 21) };
const fever: Effect = { restUntil: at(13, 21, 40) };
const toRadio: Effect = { restUntil: at(13, 20) };
const toTen: Effect = { restUntil: at(13, 22) };
const next = [{ id: 'ret', when: partnerSearch10, goto: 'c10_f_return' }, { id: 'porch', goto: 'c10_n_porch' }];

export const night10FScenes: Scene[] = [
  S10({ id: 'c10_f_kitchen', for: 'any', chapter: 'ch3', title: 'Вечер в доме', camp: house10, safe: true,
    text: [
      { when: kept10, text: 'Хенрике моет посуду. Дверь в комнату Оле прикрыта. В окно виден навес: Нина сидит там на чурбаке, в одеяле.' },
      { when: not(kept10), text: 'Хенрике моет посуду. Дверь в комнату Оле прикрыта. Нина сидит на лавке у печи с кружкой в руках и не пьёт.' },
    ],
    actions: [
      { id: 'c10_f_dishes', label: 'Помочь Хенрике с посудой', minutes: 15, activity: 'light', terminal: true, goto: 'c10_f_hens',
        text: 'Хенрике моет молча. Потом говорит, не поворачиваясь:\n\n— Ты хороший человек.\n\nЭто звучит не как похвала. Как извинение.', effects: [{ set: '$.c10_evening', value: 'dishes' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_ole_door', label: 'Заглянуть к Оле', minutes: 3, terminal: true, goto: 'c10_f_hens',
        text: 'Оле лежит одетым поверх одеяла, лицом к стене.\n\n— Чего тебе?\n\n— Ничего.\n\n— Тогда закрой.', effects: [{ set: '$.c10_evening', value: 'ole' }] },
      { id: 'c10_f_stove', label: 'Сесть к печи и отогреться', minutes: 10, activity: 'rest', terminal: true, goto: 'c10_f_hens',
        text: 'Ты садишься к печи и вытягиваешь ноги. От тепла сразу тянет в сон. Хенрике смотрит на тебя через плечо и ничего не говорит.', effects: [{ set: '$.c10_evening', value: 'stove' }] },
    ] }),

  S10({ id: 'c10_f_hens', for: 'any', chapter: 'ch3', title: 'Куры', camp: house10, ambient: night10,
    text: [{ text: 'Хенрике снимает с гвоздя фонарь и суёт тебе в руки.\n\n— Кур загони. Они у сарая, дуры, на ночь не идут.\n\nКуры сидят на жерди у сарая, нахохлившись. Ты загоняешь их в курятник по одной. Одиннадцать. На жерди внутри одно место пустое.\n\nНа обратном пути ты проходишь мимо старого курятника. Дверь приоткрыта. Внутри в луче фонаря что-то светлеет.' }],
    actions: [
      { id: 'c10_f_h_look', label: 'Заглянуть в старый курятник', minutes: 5, terminal: true, goto: 'c10_f_radio',
        text: 'Пол выметен. На нём свежая солома, толстым слоем. В углу ведро чистой воды и сложенное шерстяное одеяло. Щеколда снаружи блестит: её недавно смазали.\n\nКурам одеяло не стелют.', effects: [{ set: '$.c10_saw_coop', value: true }, toRadio] },
      { id: 'c10_f_h_ask', label: 'Спросить Хенрике, что там светлеет', minutes: 4, terminal: true, goto: 'c10_f_radio',
        text: '— Солома, — отвечает Хенрике и забирает у тебя фонарь. — Кур туда переведу на зиму. Там теплее.\n\nВ старом курятнике щели в палец. Теплее там не будет.', effects: [{ set: '$.c10_hens', value: 'ask' }, toRadio] },
      { id: 'c10_f_h_close', label: 'Прикрыть дверь и вернуться в дом', minutes: 3, terminal: true, goto: 'c10_f_radio',
        text: 'Ты прикрываешь дверь. Щеколда ходит легко, без звука. Во всём этом дворе скрипит каждая петля, а она — нет.', effects: [{ set: '$.c10_hens', value: 'close' }, toRadio] },
    ] }),

  S10({ id: 'c10_f_radio', for: 'any', chapter: 'ch3', title: 'Восемь часов', camp: house10,
    text: [{ text: 'Ровно в восемь Хенрике включает приёмник. Садится рядом на табурет и наклоняется к динамику, как к человеку.\n\n«…Sammelpunkt Jesteburg. Gebissene werden dort getrennt untergebracht und ärztlich beobachtet. Meldungen über eine Behandlung in den ersten vierundzwanzig Stunden…»\n\nХенрике выключает.\n\n— В первые сутки, — говорит она. — Слышал{m:|а}? В первые сутки помогают.' }],
    actions: [
      { id: 'c10_f_r_on', label: 'Попросить включить и дослушать', minutes: 3, terminal: true, goto: 'c10_f_water',
        text: '— Батарейки последние, — говорит Хенрике. — Главное услышали.\n\nОна уносит приёмник к себе в комнату и возвращается без него.', effects: [{ set: '$.c10_radio', value: 'on' }] },
      { id: 'c10_f_r_who', label: 'Спросить, кому там помогают', minutes: 3, terminal: true, goto: 'c10_f_water',
        text: '— Раненым. Всем. — Хенрике поднимает на тебя глаза. — А тебе зачем?\n\nТы не находишь, что ответить. Она отворачивается к плите.', effects: [{ set: '$.c10_radio', value: 'who' }] },
      { id: 'c10_f_r_quiet', label: 'Промолчать', minutes: 3, terminal: true, goto: 'c10_f_water',
        text: 'Хенрике сидит у выключенного приёмника ещё минуту. Губы у неё шевелятся. Ты разбираешь одно слово: «vierundzwanzig».', effects: [{ set: '$.c10_radio', value: 'quiet' }] },
    ] }),

  S10({ id: 'c10_f_water', for: 'any', chapter: 'ch3', title: 'Котёл', camp: house10,
    text: [{ text: 'Хенрике ставит на плиту большой котёл и подаёт тебе два ведра.\n\n— Натаскай, если не трудно. Полный.\n\nКотёл — тот, в котором осенью варят картошку свиньям. Свиней на хуторе давно нет.' }],
    actions: [
      { id: 'c10_f_w_carry', label: 'Наносить воды из колодца', minutes: 20, activity: 'moderate', terminal: true, goto: 'c10_f_light', ambientDuring: night10,
        text: 'Ты носишь вёдра в темноте, на свет кухонного окна. Хенрике выливает их в котёл, не говоря ни слова. Когда котёл полон, она гладит его край ладонью.', effects: [{ set: '$.c10_water', value: 'carry' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_w_why', label: 'Спросить, зачем столько горячей воды на ночь', minutes: 20, activity: 'moderate', terminal: true, goto: 'c10_f_light', ambientDuring: night10,
        text: '— Мало ли, — говорит Хенрике. — Ночь длинная.\n\nБольше она ничего не объясняет. Ты носишь вёдра, пока котёл не наполнится.', effects: [{ set: '$.c10_water', value: 'why' }] },
      { id: 'c10_f_w_partner', label: 'Сказать, что сначала проверишь Нину, а воду принесёшь потом', minutes: 3, terminal: true, goto: 'c10_f_light',
        text: 'Хенрике берёт вёдра сама и уходит к колодцу. Возвращается она медленно, держась за перила.', effects: [{ set: '$.c10_water', value: 'later' }] },
    ] }),

  S10({ id: 'c10_f_light', for: 'any', chapter: 'ch3', title: 'Огонёк', camp: house10, ambient: night10,
    text: [
      { text: 'Во дворе ты поднимаешь голову. Далеко за полем, там, где старая насыпь, мелькает огонёк. Мелькает и гаснет.\n\nТы ждёшь. Огонёк не появляется.' },
      { when: partnerSearch10, text: 'Там {partner}.' },
      { when: not(partnerSearch10), text: 'Там Дениз. Один.' },
    ],
    actions: [
      { id: 'c10_f_l_signal', label: 'Посигналить фонарём в ту сторону', minutes: 6, terminal: true, goto: 'c10_f_nina',
        text: 'Ты включаешь и выключаешь фонарь. Три раза. Поле молчит. Потом, когда ты уже опускаешь руку, далеко на насыпи коротко мигает. Раз, другой. И снова темно.', effects: [{ set: '$.c10_light', value: 'signal' }, { body: 'stress', delta: -1 }] },
      { id: 'c10_f_l_wait', label: 'Стоять у калитки, пока не загорится', minutes: 15, activity: 'rest', terminal: true, goto: 'c10_f_nina',
        text: 'Ты стоишь, пока не начинают мёрзнуть пальцы. Огонёк загорается снова, уже гораздо левее. Значит, идут. Значит, что-то их остановило, и они пошли дальше.', effects: [{ set: '$.c10_light', value: 'wait' }, { body: 'stress', delta: 2 }] },
      { id: 'c10_f_l_in', label: 'Не стоять на холоде и идти в дом', minutes: 2, terminal: true, goto: 'c10_f_nina',
        text: 'На крыльце ты оглядываешься ещё раз. Поле тёмное и ровное. В нём ничего нет.', effects: [{ set: '$.c10_light', value: 'in' }, { body: 'stress', delta: 1 }] },
    ] }),

  S10({ id: 'c10_f_nina', for: 'any', chapter: 'ch3', title: 'Нина', camp: house10,
    ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { when: kept10, text: 'Под навесом холодно. Нина сидит, натянув одеяло до носа. Из кабины изредка доносится стук.\n\n— Я тут посижу, — говорит она. — Можно? Я не буду открывать.' },
      { when: all(kept10, ninaKey10), text: 'Рука у неё в кармане сжимает брелок.' },
      { when: not(kept10), text: 'Нина смотрит в кружку.\n\n— Его похоронят? Или как? — Она поднимает глаза. — Я хочу дома. У нас за домом сад.' },
    ],
    actions: [
      { id: 'c10_f_n_sit', label: 'Сесть рядом с ней', when: kept10, minutes: 40, activity: 'rest', terminal: true, goto: 'c10_f_phone', ambientDuring: night10,
        text: 'Вы сидите. Нина рассказывает про папины ночные смены: как он засыпал в кабине на парковках и звонил ей в шесть утра, чтобы разбудить в школу. Стук из кабины то стихает, то возвращается.',
        effects: [{ set: '$.c10_fn', value: 'sit' }, { npc: 'c7_nina', trust: 2 }, toFever] },
      { id: 'c10_f_n_blanket', label: 'Принести ей второе одеяло и горячей воды', when: kept10, minutes: 10, terminal: true, goto: 'c10_f_phone',
        text: 'Нина берёт кружку обеими руками и кивает, не глядя. Второе одеяло она накидывает на колени.',
        effects: [{ set: '$.c10_fn', value: 'blanket' }, { npc: 'c7_nina', trust: 1 }, toFever] },
      { id: 'c10_f_n_key', label: 'Попросить у неё ключ на эту ночь', when: all(kept10, B10, ninaKey10), minutes: 4, terminal: true, goto: 'c10_f_phone',
        outcomes: [
          { id: 'given', when: { npc: 'c7_nina', trust: ['>=', 6] }, text: 'Нина долго молчит. Потом достаёт брелок и кладёт тебе на ладонь.\n\n— Утром отдадите.',
            effects: [{ takeFromNpc: 'c7_nina', type: 'c9_van_key' }, { set: '$.c10_fn', value: 'key' }, toFever] },
          { id: 'kept', text: '— Нет, — говорит Нина. — Я же сказала: не буду открывать.', effects: [{ set: '$.c10_fn', value: 'key_no' }, toFever] },
        ] },
      { id: 'c10_f_n_rule', label: 'Сказать, что к полуночи всё равно уведёшь её в дом', when: kept10, minutes: 3, terminal: true, goto: 'c10_f_phone',
        text: '— Посмотрим, — говорит Нина и отворачивается к фургону.', effects: [{ set: '$.c10_fn', value: 'rule' }, { npc: 'c7_nina', trust: -1 }, toFever] },
      { id: 'c10_f_n_promise', label: 'Пообещать помочь отвезти его домой, когда будет можно', when: not(kept10), minutes: 5, terminal: true, goto: 'c10_f_phone',
        text: 'Нина кивает. Потом впервые за вечер пьёт из кружки.', effects: [{ set: '$.c10_fn', value: 'promise' }, { set: '$.c10_burial', value: true }, { npc: 'c7_nina', trust: 2 }, toFever] },
      { id: 'c10_f_n_quiet', label: 'Посидеть с ней молча', when: not(kept10), minutes: 30, activity: 'rest', terminal: true, goto: 'c10_f_phone',
        text: 'Вы сидите у печи. Нина прислоняется к твоему плечу и засыпает сидя. Через полчаса вздрагивает и просыпается.', effects: [{ set: '$.c10_fn', value: 'quiet' }, { npc: 'c7_nina', trust: 1 }, toFever] },
      { id: 'c10_f_n_honest', label: 'Сказать честно: завтра никто никуда не поедет', when: not(kept10), minutes: 3, terminal: true, goto: 'c10_f_phone',
        text: '— Я знаю, — говорит Нина. — Я просто спросила.', effects: [{ set: '$.c10_fn', value: 'honest' }, toFever] },
    ] }),

  S10({ id: 'c10_f_phone', for: 'any', chapter: 'ch3', title: 'Точка на карте', camp: house10,
    ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'Чуть позже Нина сама окликает тебя и достаёт телефон. Экран треснут в углу. Она открывает карту и поворачивает её к тебе.\n\n— Вот папа. — Синяя точка стоит прямо на хуторе. — Телефон у него в куртке. Он его никогда не выключал.\n\nПод картой их переписка. Последнее, что папа написал сам: «Ешь нормально. Не только хлопья».' },
      { text: 'Нина листает дальше, в чат Винзена. Там сотни сообщений, пришедших, пока была сеть. Она останавливается на одном: «У соседки муж сутки горел, а сегодня встал и попросил есть. Честно».' },
    ],
    actions: [
      { id: 'c10_f_ph_read', label: 'Прочитать ответы под ним', minutes: 6, terminal: true, goto: 'c10_f_axe',
        text: '«Фейк». «Фейк». «У нас в Тостедте тоже говорили, а потом…» — и дальше ничего. «Мама говорит, это от группы крови». «А моя — что от молитвы».\n\nНина забирает телефон.\n\n— Я знаю, что там одни дураки, — говорит она. — Я просто читаю.', effects: [{ set: '$.c10_phone', value: 'read' }] },
      { id: 'c10_f_ph_battery', label: 'Сказать, чтобы берегла батарею', minutes: 3, terminal: true, goto: 'c10_f_axe',
        text: '— Тридцать процентов, — говорит Нина. — Я выключаю на ночь. Только папу проверю — и выключаю.\n\nОна ещё раз смотрит на синюю точку и гасит экран.', effects: [{ set: '$.c10_phone', value: 'battery' }] },
      { id: 'c10_f_ph_ask', label: 'Спросить, кто ей это поставил', minutes: 5, terminal: true, goto: 'c10_f_axe',
        text: '— Папа. Когда я в седьмом классе одна в Гамбург на концерт поехала. Ругался, что я трубку не беру. — Нина улыбается краем рта. — Теперь он не берёт.', effects: [{ set: '$.c10_phone', value: 'ask' }, { npc: 'c7_nina', trust: 1 }] },
    ] }),

  S10({ id: 'c10_f_axe', for: 'any', chapter: 'ch3', title: 'Топор', camp: house10,
    text: [{ text: 'В десятом часу тебя окликает Оле. Он стоит в дверях своей комнаты, держась за косяк.\n\n— Слушай. Топор в сарае, у колоды. И большой нож на кухне, в ящике. Убери куда-нибудь. На ночь.\n\nОн говорит тихо, чтобы не услышала мать.' }],
    actions: [
      { id: 'c10_f_axe_hide', label: 'Убрать топор и нож, ничего не спрашивая', minutes: 10, terminal: true, goto: 'c10_f_ole',
        text: 'Ты относишь топор на сеновал и прячешь под сено. Нож заворачиваешь в полотенце и кладёшь на шкаф. Оле кивает и закрывает дверь.', effects: [{ set: '$.c10_axe', value: 'hid' }, { set: 'w.c10_blades_hidden', value: true }, { npc: 'ole', trust: 2 }, fever] },
      { id: 'c10_f_axe_why', label: 'Спросить, зачем', minutes: 3, terminal: true, goto: 'c10_f_ole',
        text: '— Потому что я прошу, — говорит Оле. Он долго смотрит на тебя, потом отворачивается. — Сделай, а? Пожалуйста.\n\nТы прячешь топор и нож. Он больше ничего не говорит.', effects: [{ set: '$.c10_axe', value: 'why' }, { set: 'w.c10_blades_hidden', value: true }, fever] },
      { id: 'c10_f_axe_mother', label: 'Сказать, что сначала спросишь у Хенрике', minutes: 3, terminal: true, goto: 'c10_f_ole',
        text: '— Не надо её, — говорит Оле. — Ладно. Забудь.\n\nДверь закрывается.', effects: [{ set: '$.c10_axe', value: 'mother' }, fever] },
    ] }),

  S10({ id: 'c10_f_ole', for: 'any', chapter: 'ch3', title: 'Ковш', camp: house10,
    text: [{ text: 'Ближе к десяти Оле выходит из комнаты за водой. Его знобит. Он пьёт прямо из ковша, и ковш стучит о зубы.\n\nХенрике сразу встаёт.\n\n— Ложись. Я принесу.\n\nОле смотрит на тебя поверх ковша. Глаза у него блестят.' }],
    actions: [
      { id: 'c10_f_ole_touch', label: 'Потрогать ему лоб', minutes: 2, terminal: true, goto: 'c10_f_pills',
        text: 'Оле не успевает отстраниться. Лоб горячий. Хенрике отводит твою руку.\n\n— Простыл. Весь день в мокром.\n\nОна уводит сына в комнату.', effects: [{ set: '$.c10_felt_fever', value: true }] },
      { id: 'c10_f_ole_arm', label: 'Спросить, как рука', minutes: 2, terminal: true, goto: 'c10_f_pills',
        text: '— Нормально, — говорит Оле и убирает руку за спину. Хенрике уводит его в комнату.', effects: [{ set: '$.c10_asked_arm', value: true }] },
      { id: 'c10_f_ole_let', label: 'Отойти и не мешать Хенрике', minutes: 1, terminal: true, goto: 'c10_f_pills',
        text: 'Хенрике уводит сына. Дверь закрывается неплотно, и слышно, как он стучит зубами.' },
    ] }),

  S10({ id: 'c10_f_pills', for: 'any', chapter: 'ch3', title: 'Тридцать восемь и три', camp: house10,
    text: [
      { text: 'Хенрике возвращается из комнаты сына и прикрывает дверь.\n\n— У кого есть что-нибудь от жара? — спрашивает она. — Простыл он. Тридцать восемь и три.' },
      { when: { has: 'ibuprofen' }, text: 'В твоей аптечке есть ибупрофен.' },
    ],
    actions: [
      { id: 'c10_f_p_give', label: 'Отдать ей таблетку ибупрофена', when: { has: 'ibuprofen' }, minutes: 3, terminal: true, goto: 'c10_f_shelf',
        text: 'Хенрике благодарит и уносит таблетку сыну. Через полчаса выходит.\n\n— Полегче ему, — говорит она. — Говорю же: простуда.',
        effects: [{ handOver: 'ibuprofen', toNpc: 'henrike' }, { set: '$.c10_gave_pills', value: true }, { npc: 'ole', set: { c10_masked: true } }, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_p_look', label: 'Сказать, что сначала хочешь {m:сам|сама} на него посмотреть', minutes: 3, terminal: true, goto: 'c10_f_shelf',
        text: '— Не надо. Он засыпает. — Хенрике встаёт между тобой и дверью. Не резко. Просто встаёт.', effects: [{ set: '$.c10_pressed', value: true }] },
      { id: 'c10_f_p_no', label: 'Не давать таблеток: жар лучше видеть', when: { has: 'ibuprofen' }, minutes: 2, terminal: true, goto: 'c10_f_shelf',
        text: 'Хенрике смотрит на тебя долго. Потом уходит в кладовку. Там долго гремят банки.', effects: [{ set: '$.c10_kept_pills', value: true }] },
      { id: 'c10_f_p_none', label: 'Сказать, что своих таблеток нет', when: not({ has: 'ibuprofen' }), minutes: 2, terminal: true, goto: 'c10_f_shelf',
        text: 'Хенрике кивает и уходит в кладовку. Там долго гремят банки.' },
    ] }),

  S10({ id: 'c10_f_shelf', for: 'any', chapter: 'ch3', title: 'Кладовка', camp: house10,
    text: [{ text: 'Из кладовки зовёт Хенрике:\n\n— Посвети мне. Я без очков.\n\nОна стоит у верхней полки. В руках старая жестяная коробка с красным крестом. Внутри шприцы в бумаге и флакон с выцветшей этикеткой: «Penicillin. Nur für Rinder». Для скота.\n\n— Корове на шестьсот кило — десять кубиков, — говорит Хенрике. — В нём восемьдесят. Посчитай.' }],
    actions: [
      { id: 'c10_f_s_count', label: 'Посчитать ей дозу', minutes: 6, terminal: true, outcomes: next,
        text: 'Ты считаешь вслух. Выходит чуть больше кубика. Хенрике набирает шприц, держа флакон против фонаря, и уходит к сыну.\n\nЗа дверью Оле что-то спрашивает. Она отвечает: «Витамины».', effects: [{ set: '$.c10_vet', value: 'count' }, toTen, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_s_no', label: 'Сказать, что от жара это не поможет', minutes: 4, terminal: true, outcomes: next,
        text: '— А что поможет? — Хенрике смотрит на тебя поверх коробки. — Скажи. Я сделаю.\n\nТы молчишь. Она закрывает коробку и ставит обратно на полку. Крышка звякает о жесть: руки у неё всё-таки дрожат.', effects: [{ set: '$.c10_vet', value: 'no' }, toTen] },
      { id: 'c10_f_s_why', label: 'Спросить, зачем колоть от простуды', minutes: 4, terminal: true, outcomes: next,
        text: '— Затем, что больше у меня ничего нет, — отвечает Хенрике. — Свети, говорю.\n\nТы светишь. Шприц она набирает сама, на глаз.', effects: [{ set: '$.c10_vet', value: 'why' }, toTen] },
    ] }),

  S10({ id: 'c10_f_return', for: 'any', chapter: 'ch3', title: 'Чужой фонарь', camp: house10,
    onEnter: [{ set: '$.c10_knows', value: true }, { set: '$.c10_from_partner', value: true }, { set: 'w.c10_truth', value: true }],
    text: [{ text: 'Около десяти скрипит калитка. {partner} {pm:возвращается один|возвращается одна}, с чужим фонарём в руке. Лицо серое.\n\n— Дениз остался с Керемом, — говорит {partner} тихо, чтобы не услышала Хенрике. — Керем всё видел. Утром Йенс укусил Оле. Через свитер. Хенрике всем соврала.' }],
    actions: [
      { id: 'c10_f_r_hold', label: 'Взять {partner.acc} за руку', minutes: 2, terminal: true, goto: 'c10_n_house',
        text: 'Рука у {partner.gen} ледяная. Вы стоите так, пока не перестают дрожать пальцы.', effects: [{ body: 'stress', delta: -2 }] },
      { id: 'c10_f_r_plan', label: 'Спросить, что теперь делать', minutes: 2, terminal: true, goto: 'c10_n_house',
        text: '— Сначала Нина. Потом Хенрике, — говорит {partner} и снимает мокрые ботинки.' },
      { id: 'c10_f_r_knew', label: 'Сказать, что ты и {m:сам подозревал|сама подозревала}', when: evidence10, minutes: 2, terminal: true, goto: 'c10_n_house',
        text: '{partner} смотрит на тебя.\n\n— И {m:молчал|молчала}?\n\n— Не {m:был уверен|была уверена}.\n\n{partner} кивает. Сейчас это уже неважно.' },
    ] }),
];
