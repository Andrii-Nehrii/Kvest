import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { all, not } from './world3';
import { B10, S10, evidence10, house10, kept10, night10, ninaKey10, partnerSearch10 } from './point10';

const toFever: Effect = { restUntil: at(13, 21) };
const fever: Effect = { restUntil: at(13, 21, 40) };
const next = [{ id: 'ret', when: partnerSearch10, goto: 'c10_f_return' }, { id: 'porch', goto: 'c10_n_porch' }];

export const night10FScenes: Scene[] = [
  S10({ id: 'c10_f_kitchen', for: 'any', chapter: 'ch3', title: 'Вечер в доме', camp: house10, safe: true,
    text: [
      { when: kept10, text: 'Хенрике моет посуду. Дверь в комнату Оле прикрыта. В окно виден навес: Нина сидит там на чурбаке, в одеяле.' },
      { when: not(kept10), text: 'Хенрике моет посуду. Дверь в комнату Оле прикрыта. Нина сидит на лавке у печи с кружкой в руках и не пьёт.' },
    ],
    actions: [
      { id: 'c10_f_dishes', label: 'Помочь Хенрике с посудой', minutes: 15, activity: 'light', terminal: true, goto: 'c10_f_water',
        text: 'Хенрике моет молча. Потом говорит, не поворачиваясь:\n\n— Ты хороший человек.\n\nЭто звучит не как похвала. Как извинение.', effects: [{ set: '$.c10_evening', value: 'dishes' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_ole_door', label: 'Заглянуть к Оле', minutes: 3, terminal: true, goto: 'c10_f_water',
        text: 'Оле лежит одетым поверх одеяла, лицом к стене.\n\n— Чего тебе?\n\n— Ничего.\n\n— Тогда закрой.', effects: [{ set: '$.c10_evening', value: 'ole' }] },
      { id: 'c10_f_to_nina', label: 'Сразу пойти к Нине', minutes: 2, terminal: true, goto: 'c10_f_nina', effects: [{ set: '$.c10_evening', value: 'nina' }] },
    ] }),

  S10({ id: 'c10_f_water', for: 'any', chapter: 'ch3', title: 'Котёл', camp: house10,
    text: [{ text: 'Хенрике ставит на плиту большой котёл и подаёт тебе два ведра.\n\n— Натаскай, если не трудно. Полный.\n\nКотёл — тот, в котором осенью варят картошку свиньям. Свиней на хуторе давно нет.' }],
    actions: [
      { id: 'c10_f_w_carry', label: 'Наносить воды из колодца', minutes: 20, activity: 'moderate', terminal: true, goto: 'c10_f_nina', ambientDuring: night10,
        text: 'Ты носишь вёдра в темноте, на свет кухонного окна. Хенрике выливает их в котёл, не говоря ни слова. Когда котёл полон, она гладит его край ладонью.', effects: [{ set: '$.c10_water', value: 'carry' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_w_why', label: 'Спросить, зачем столько горячей воды на ночь', minutes: 20, activity: 'moderate', terminal: true, goto: 'c10_f_nina', ambientDuring: night10,
        text: '— Мало ли, — говорит Хенрике. — Ночь длинная.\n\nБольше она ничего не объясняет. Ты носишь вёдра, пока котёл не наполнится.', effects: [{ set: '$.c10_water', value: 'why' }] },
      { id: 'c10_f_w_partner', label: 'Сказать, что сначала проверишь Нину, а воду принесёшь потом', minutes: 3, terminal: true, goto: 'c10_f_nina',
        text: 'Хенрике берёт вёдра сама и уходит к колодцу. Возвращается она медленно, держась за перила.', effects: [{ set: '$.c10_water', value: 'later' }] },
    ] }),

  S10({ id: 'c10_f_nina', for: 'any', chapter: 'ch3', title: 'Нина', camp: house10,
    ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { when: kept10, text: 'Под навесом холодно. Нина сидит, натянув одеяло до носа. Из кабины изредка доносится стук.\n\n— Я тут посижу, — говорит она. — Можно? Я не буду открывать.' },
      { when: all(kept10, ninaKey10), text: 'Рука у неё в кармане сжимает брелок.' },
      { when: not(kept10), text: 'Нина смотрит в кружку.\n\n— Его похоронят? Или как? — Она поднимает глаза. — Я хочу дома. У нас за домом сад.' },
    ],
    actions: [
      { id: 'c10_f_n_sit', label: 'Сесть рядом с ней', when: kept10, minutes: 40, activity: 'rest', terminal: true, goto: 'c10_f_axe', ambientDuring: night10,
        text: 'Вы сидите. Нина рассказывает про папины ночные смены: как он засыпал в кабине на парковках и звонил ей в шесть утра, чтобы разбудить в школу. Стук из кабины то стихает, то возвращается.',
        effects: [{ set: '$.c10_fn', value: 'sit' }, { npc: 'c7_nina', trust: 2 }, toFever] },
      { id: 'c10_f_n_blanket', label: 'Принести ей второе одеяло и горячей воды', when: kept10, minutes: 10, terminal: true, goto: 'c10_f_axe',
        text: 'Нина берёт кружку обеими руками и кивает, не глядя. Второе одеяло она накидывает на колени.',
        effects: [{ set: '$.c10_fn', value: 'blanket' }, { npc: 'c7_nina', trust: 1 }, toFever] },
      { id: 'c10_f_n_key', label: 'Попросить у неё ключ на эту ночь', when: all(kept10, B10, ninaKey10), minutes: 4, terminal: true, goto: 'c10_f_axe',
        outcomes: [
          { id: 'given', when: { npc: 'c7_nina', trust: ['>=', 6] }, text: 'Нина долго молчит. Потом достаёт брелок и кладёт тебе на ладонь.\n\n— Утром отдадите.',
            effects: [{ takeFromNpc: 'c7_nina', type: 'c9_van_key' }, { set: '$.c10_fn', value: 'key' }, toFever] },
          { id: 'kept', text: '— Нет, — говорит Нина. — Я же сказала: не буду открывать.', effects: [{ set: '$.c10_fn', value: 'key_no' }, toFever] },
        ] },
      { id: 'c10_f_n_rule', label: 'Сказать, что к полуночи всё равно уведёшь её в дом', when: kept10, minutes: 3, terminal: true, goto: 'c10_f_axe',
        text: '— Посмотрим, — говорит Нина и отворачивается к фургону.', effects: [{ set: '$.c10_fn', value: 'rule' }, { npc: 'c7_nina', trust: -1 }, toFever] },
      { id: 'c10_f_n_promise', label: 'Пообещать помочь отвезти его домой, когда будет можно', when: not(kept10), minutes: 5, terminal: true, goto: 'c10_f_axe',
        text: 'Нина кивает. Потом впервые за вечер пьёт из кружки.', effects: [{ set: '$.c10_fn', value: 'promise' }, { set: '$.c10_burial', value: true }, { npc: 'c7_nina', trust: 2 }, toFever] },
      { id: 'c10_f_n_quiet', label: 'Посидеть с ней молча', when: not(kept10), minutes: 30, activity: 'rest', terminal: true, goto: 'c10_f_axe',
        text: 'Вы сидите у печи. Нина прислоняется к твоему плечу и засыпает сидя. Через полчаса вздрагивает и просыпается.', effects: [{ set: '$.c10_fn', value: 'quiet' }, { npc: 'c7_nina', trust: 1 }, toFever] },
      { id: 'c10_f_n_honest', label: 'Сказать честно: завтра никто никуда не поедет', when: not(kept10), minutes: 3, terminal: true, goto: 'c10_f_axe',
        text: '— Я знаю, — говорит Нина. — Я просто спросила.', effects: [{ set: '$.c10_fn', value: 'honest' }, toFever] },
    ] }),

  S10({ id: 'c10_f_axe', for: 'any', chapter: 'ch3', title: 'Топор', camp: house10,
    text: [{ text: 'Около девяти тебя окликает Оле. Он стоит в дверях своей комнаты, держась за косяк.\n\n— Слушай. Топор в сарае, у колоды. И большой нож на кухне, в ящике. Убери куда-нибудь. На ночь.\n\nОн говорит тихо, чтобы не услышала мать.' }],
    actions: [
      { id: 'c10_f_axe_hide', label: 'Убрать топор и нож, ничего не спрашивая', minutes: 10, terminal: true, goto: 'c10_f_ole',
        text: 'Ты относишь топор на сеновал и прячешь под сено. Нож заворачиваешь в полотенце и кладёшь на шкаф. Оле кивает и закрывает дверь.', effects: [{ set: '$.c10_axe', value: 'hid' }, { set: 'w.c10_blades_hidden', value: true }, { npc: 'ole', trust: 2 }, fever] },
      { id: 'c10_f_axe_why', label: 'Спросить, зачем', minutes: 3, terminal: true, goto: 'c10_f_ole',
        text: '— Потому что я прошу, — говорит Оле. Он долго смотрит на тебя, потом отворачивается. — Сделай, а? Пожалуйста.\n\nТы прячешь топор и нож. Он больше ничего не говорит.', effects: [{ set: '$.c10_axe', value: 'why' }, { set: 'w.c10_blades_hidden', value: true }, fever] },
      { id: 'c10_f_axe_mother', label: 'Сказать, что сначала спросишь у Хенрике', minutes: 3, terminal: true, goto: 'c10_f_ole',
        text: '— Не надо её, — говорит Оле. — Ладно. Забудь.\n\nДверь закрывается.', effects: [{ set: '$.c10_axe', value: 'mother' }, fever] },
    ] }),

  S10({ id: 'c10_f_ole', for: 'any', chapter: 'ch3', title: 'Ковш', camp: house10,
    text: [{ text: 'Около десяти Оле выходит из комнаты за водой. Его знобит. Он пьёт прямо из ковша, и ковш стучит о зубы.\n\nХенрике сразу встаёт.\n\n— Ложись. Я принесу.\n\nОле смотрит на тебя поверх ковша. Глаза у него блестят.' }],
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
      { id: 'c10_f_p_give', label: 'Отдать ей таблетку ибупрофена', when: { has: 'ibuprofen' }, minutes: 3, terminal: true, outcomes: next,
        text: 'Хенрике благодарит и уносит таблетку сыну. Через полчаса выходит.\n\n— Полегче ему, — говорит она. — Говорю же: простуда.',
        effects: [{ handOver: 'ibuprofen', toNpc: 'henrike' }, { set: '$.c10_gave_pills', value: true }, { npc: 'ole', set: { c10_masked: true } }, { npc: 'henrike', trust: 1 }] },
      { id: 'c10_f_p_look', label: 'Сказать, что сначала хочешь {m:сам|сама} на него посмотреть', minutes: 3, terminal: true, outcomes: next,
        text: '— Не надо. Он засыпает. — Хенрике встаёт между тобой и дверью. Не резко. Просто встаёт.', effects: [{ set: '$.c10_pressed', value: true }] },
      { id: 'c10_f_p_no', label: 'Не давать таблеток: жар лучше видеть', when: { has: 'ibuprofen' }, minutes: 2, terminal: true, outcomes: next,
        text: 'Хенрике смотрит на тебя долго. Потом уходит в кладовку. Там долго гремят банки.', effects: [{ set: '$.c10_kept_pills', value: true }] },
      { id: 'c10_f_p_none', label: 'Сказать, что своих таблеток нет', when: not({ has: 'ibuprofen' }), minutes: 2, terminal: true, outcomes: next,
        text: 'Хенрике кивает и уходит в кладовку. Там долго гремят банки.' },
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
