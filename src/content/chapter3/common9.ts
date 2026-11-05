import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { A9, B9, S9, house9, kitchen9, koehlerHere9, near9, once9, outdoor9, own9, yard9 } from './point9';

const meal = (mode: 'eat' | 'pack' | 'give') => ({ camp: { kind: 'meal' as const, mode, communal: true } });
const keremGone = not(near9('kerem'));

export const common9Scenes: Scene[] = [
  S9({ id: 'c9_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen9,
    onEnter: [{ if: koehlerHere9, then: [{ set: '$.met.c3_koehler', value: true }] }],
    text: [
      { text: 'Хенрике ставит на стол кастрюлю картофельного супа и режет хлеб. Дениз садится у окна, Оле — с краю. Он ест правой рукой, левую держит под столом.\n\n— Ешьте, — говорит Хенрике. — Вечером будет куриный.' },
      { when: koehlerHere9, text: 'Кёлер сидит на краю скамьи. Ест быстро, будто суп могут отнять.' },
      { when: keremGone, text: 'Место Керема у окна пустует. Дениз ставит туда свою кружку.' },
    ],
    actions: [
      { id: 'c9_lunch_eat', label: 'Поесть со всеми', minutes: 15, terminal: true, enabled: { camp: 'tableMeal' }, disabledReason: 'Твоя порция уже использована или не выделена',
        text: 'Суп горячий, хлеб вчерашний. Несколько минут все просто едят.', effects: [meal('eat')],
        outcomes: [{ id: 'a', when: A9, goto: 'c9_a_fence' }, { id: 'b', goto: 'c9_b_hen' }] },
      { id: 'c9_lunch_pack', label: 'Попросить отложить свою порцию на потом', minutes: 3, terminal: true, enabled: { camp: 'tableMeal' }, disabledReason: 'Твоя порция уже использована или не выделена',
        text: 'Хенрике переливает твой суп в банку и закручивает крышку. Банку ты забираешь с собой.', effects: [meal('pack')],
        outcomes: [{ id: 'a', when: A9, goto: 'c9_a_fence' }, { id: 'b', goto: 'c9_b_hen' }] },
      { id: 'c9_lunch_skip', label: 'Сказать, что не голоден, и выйти из-за стола', minutes: 2, terminal: true,
        text: 'Хенрике не уговаривает. Твоя порция остаётся в кастрюле до вечера.',
        outcomes: [{ id: 'a', when: A9, goto: 'c9_a_fence' }, { id: 'b', goto: 'c9_b_hen' }] },
      { id: 'c9_lunch_bread', label: 'Подвинуть Оле хлеб, раз у него одна рука', when: all(A9, once9('lunch_bread')), minutes: 1, combinable: true,
        text: 'Оле отодвигает хлеб обратно.\n\n— Я не калека.\n\nХенрике молча кладёт кусок прямо ему в тарелку.', effects: [{ set: '$.c9_lunch_bread', value: true }] },
      { id: 'c9_lunch_kerem', label: 'Спросить за столом, куда ушёл Керем', when: all(keremGone, once9('lunch_kerem')), minutes: 2, combinable: true,
        text: '— Ушёл и ушёл, — говорит Хенрике. — Взрослый человек.\n\n— В Харбург. Пешком. Дурак, — говорит Дениз в кружку.\n\nОле не поднимает глаз от тарелки.', effects: [{ set: '$.c9_lunch_kerem', value: true }] },
      { id: 'c9_b_koe_what', label: 'Тихо спросить Кёлер, что же она видела утром', when: all(B9, koehlerHere9, flag('$.c9_koehler'), not(own9('koehler', 'told')), once9('q_what')), minutes: 3, combinable: true,
        text: 'Кёлер долго молчит. Потом говорит тихо, глядя на раковину:\n\n— В десять хозяйка привела сына сюда. Промывала ему руку шнапсом. Он кричал. Крови было много.',
        effects: [{ set: '$.c9_q_what', value: true }, { set: '$.c9_koehler', value: 'told' }] },
      { id: 'c9_b_koe_wound', label: 'Тихо спросить Кёлер, что именно было на руке', when: all(B9, koehlerHere9, own9('koehler', 'told'), once9('q_wound')), minutes: 2, combinable: true,
        text: '— Я пекарь, не врач. — Кёлер проводит пальцем по своему предплечью, выше запястья. — Вот здесь. Рваное, дугой. И ещё дугой, с другой стороны.',
        effects: [{ set: '$.c9_q_wound', value: true }] },
      { id: 'c9_lunch_koehler', label: 'Сесть рядом с Кёлер', when: all(B9, koehlerHere9, once9('lunch_koehler')), minutes: 1, combinable: true,
        text: 'Кёлер подвигается. Хенрике смотрит на вас через стол и ничего не говорит.', effects: [{ set: '$.c9_lunch_koehler', value: true }, { npc: 'c3_koehler', trust: 1 }] },
    ] }),

  S9({ id: 'c9_gate', for: 'any', chapter: 'ch3', title: 'Звонок у калитки', camp: yard9, ambient: outdoor9,
    onEnter: [{ introduceNpc: 'c7_nina' }, { npc: 'c7_nina', moveTo: 'hof_luedemann' }, { set: '$.met.c7_nina', value: true }],
    text: [
      { when: not(flag('$.c9_nina_road')), text: 'У калитки звенит велосипедный звонок. Раз, потом ещё раз, настойчиво.\n\nЗа калиткой стоит девочка лет пятнадцати в мокрой куртке, с рюкзаком. Велосипед она держит перед собой, как щит. Оле уже идёт к ней от сарая.\n\n— Здесь белый фургон, — говорит она. — Папин. Я Нина. Йенс — мой папа.' },
      { when: flag('$.c9_nina_road'), text: 'У калитки звенит велосипедный звонок. Это Нина, девочка с перекрёстка. Добралась. Оле уже идёт к ней от сарая.\n\n— Здесь белый фургон, — говорит она громко, чтобы слышали все. — Папин. Йенс — мой папа.' },
      { when: all(B9, { visited: 'c7_b_recipient' }), text: 'Ты помнишь, как Йенс ночью диктовал: «Нина, я застрял под Йестебургом». Ты {m:думал|думала}, это взрослая женщина.' },
      { when: all(A9, flag('w.c7_nina_shared')), text: 'Нина. Человек, которому Йенс просил написать. Ты {m:думал|думала}, это взрослая женщина.' },
    ],
    actions: [
      { id: 'c9_gate_shield', label: 'Встать между Оле и калиткой', when: A9, minutes: 2, terminal: true, goto: 'c9_gate2',
        text: 'Оле останавливается в шаге от тебя.\n\n— Пусть уезжает.\n\n— Она к отцу приехала, — отвечаешь ты.\n\nНа крыльцо выходит Хенрике.', effects: [{ npc: 'ole', trust: -2 }, { npc: 'c7_nina', trust: 2 }] },
      { id: 'c9_gate_stop', label: 'Окликнуть Оле, чтобы не подходил к ней', when: B9, minutes: 2, terminal: true, goto: 'c9_gate2',
        text: '— Оле!\n\nОн оборачивается. На миг у него такое лицо, будто его застали за чем-то. Потом он отходит к сараю. На крыльцо выходит Хенрике.', effects: [{ npc: 'ole', trust: -1 }, { npc: 'c7_nina', trust: 1 }] },
      { id: 'c9_gate_talk', label: 'Подойти к калитке и заговорить с Ниной', minutes: 2, terminal: true, goto: 'c9_gate2',
        text: '— Ты одна? — спрашиваешь ты.\n\n— Одна. Где он?\n\nНа крыльцо выходит Хенрике.', effects: [{ npc: 'c7_nina', trust: 1 }] },
      { id: 'c9_gate_host', label: 'Позвать Хенрике: это её калитка', minutes: 2, terminal: true, goto: 'c9_gate2',
        text: 'Хенрике выходит на крыльцо и долго смотрит на девочку. Оле оглядывается на мать.', effects: [{ npc: 'henrike', trust: 1 }] },
    ] }),

  S9({ id: 'c9_gate2', for: 'any', chapter: 'ch3', title: 'Не твой отец', camp: yard9, ambient: outdoor9,
    text: [{ text: 'Хенрике сама открывает калитку.\n\n— Заходи. На кухню. К машине не подходи.\n\n— Почему? — спрашивает Нина. — Он там? Он спит?\n\nНикто не отвечает. Оле говорит с крыльца:\n\n— Он больше не твой отец.\n\n— Оле! — Хенрике не повышает голоса, но Оле замолкает.' }],
    actions: [
      { id: 'c9_gate2_a', label: 'Быть рядом с Ниной: она смотрит на фургон', when: A9, minutes: 1, terminal: true, goto: 'c9_a_van',
        text: 'Нина переводит взгляд с Оле на фургон. Ты делаешь шаг к ней.' },
      { id: 'c9_gate2_b', label: 'Остаться у крыльца рядом с Хенрике', when: B9, minutes: 1, terminal: true, goto: 'c9_b_porch',
        text: 'Нина переводит взгляд с Оле на фургон. {A} делает шаг к ней.' },
      { id: 'c9_gate2_ole', label: 'Сказать Оле, что так нельзя', when: once9('gate2_ole'), minutes: 1, combinable: true,
        text: '— А как можно? — огрызается Оле.\n\nХенрике кладёт ему руку на плечо. Он стряхивает её и уходит в дом.', effects: [{ set: '$.c9_gate2_ole', value: true }, { npc: 'ole', trust: -2 }] },
    ] }),

  S9({ id: 'c9_radio', for: 'any', chapter: 'ch3', title: 'Приёмник', camp: house9,
    text: [
      { text: 'В четыре Хенрике включает на кухне старый приёмник на батарейках. Голос диктора тонет в помехах.\n\n«…администрация района. Для раненых и укушенных открыт пункт в Йестебурге, в спортзале школы. Там проведут осмотр и окажут помощь. Скрывать укушенных…»\n\nХенрике выключает приёмник на полуслове. Оле, который стоял в дверях, выходит во двор.' },
      { when: B9, text: 'Нина поднимает голову от кружки.\n\n— Помощь, — говорит она. — Значит, лечат.' },
    ],
    actions: [
      { id: 'c9_radio_on', label: 'Попросить включить снова и дослушать', minutes: 5, terminal: true,
        text: 'Хенрике медлит, потом включает. Диктор уже читает про воду: кипятить, даже колодезную. Конец фразы про укушенных вы пропустили.',
        effects: [{ set: '$.c9_radio', value: 'on' }], outcomes: [{ id: 'a', when: A9, goto: 'c9_a_ole2' }, { id: 'b', goto: 'c9_b_ole' }] },
      { id: 'c9_radio_ask', label: 'Спросить Хенрике, далеко ли эта школа', minutes: 3, terminal: true,
        text: '— Двадцать минут на машине, — отвечает она сразу, будто уже считала. — А что там за помощь, никто не знает.',
        effects: [{ set: '$.c9_radio', value: 'ask' }], outcomes: [{ id: 'a', when: A9, goto: 'c9_a_ole2' }, { id: 'b', goto: 'c9_b_ole' }] },
      { id: 'c9_radio_ole', label: 'Выглянуть за дверь, куда ушёл Оле', minutes: 3, terminal: true, ambientDuring: outdoor9,
        text: 'Оле стоит за дверью, прислонившись лбом к косяку. Увидев тебя, он отворачивается и уходит.',
        effects: [{ set: '$.c9_radio', value: 'ole' }], outcomes: [{ id: 'a', when: A9, goto: 'c9_a_ole2' }, { id: 'b', goto: 'c9_b_ole' }] },
    ] }),

  S9({ id: 'c9_supper', for: 'any', chapter: 'ch3', title: 'Куриный суп', camp: kitchen9,
    text: [
      { text: 'В семь Хенрике разливает куриный суп. Пахнет лавровым листом и луком. За столом Дениз, Оле, Нина и вы. Нина села у окна, откуда видно фургон.\n\nОле не ест. Держит ложку правой рукой и смотрит в тарелку. Хенрике кладёт ему лучший кусок.' },
      { when: keremGone, text: 'Дениз смотрит в тёмное окно. Керема нет.' },
    ],
    actions: [
      { id: 'c9_supper_eat', label: 'Поесть со всеми', minutes: 15, terminal: true, goto: 'c9_dusk', enabled: { camp: 'tableMeal' }, disabledReason: 'Твоя порция уже использована или не выделена',
        text: 'Суп густой и горячий. Нина ест медленно, не сводя глаз с окна.', effects: [meal('eat')] },
      { id: 'c9_supper_nina', label: 'Отдать свою порцию Нине', minutes: 5, terminal: true, goto: 'c9_dusk', enabled: all({ camp: 'tableMeal' }, near9('c7_nina')), disabledReason: 'Твоя порция уже использована или не выделена',
        text: 'Нина сначала отказывается. Потом съедает всё, до последней ложки, и шёпотом говорит «спасибо».', effects: [meal('give'), { npc: 'c7_nina', trust: 2 }] },
      { id: 'c9_supper_pack', label: 'Попросить оставить свою порцию на ночь', minutes: 3, terminal: true, goto: 'c9_dusk', enabled: { camp: 'tableMeal' }, disabledReason: 'Твоя порция уже использована или не выделена',
        text: 'Хенрике наливает твой суп в банку. Банка тёплая. Ты убираешь её в рюкзак.', effects: [meal('pack')] },
      { id: 'c9_supper_none', label: 'Посидеть со всеми без еды', when: not({ camp: 'tableMeal' }), minutes: 10, activity: 'rest', terminal: true, goto: 'c9_dusk',
        text: 'Своя порция у тебя уже ушла раньше. Ты сидишь за столом, пока остальные едят. Хенрике не предлагает добавки: её нет.' },
      { id: 'c9_supper_ole', label: 'Спросить Оле, почему он не ест', when: once9('q_ole_eat'), minutes: 1, combinable: true,
        text: '— Не хочу.\n\n— Устал он, — говорит Хенрике. — Весь день на ногах.\n\nОле поднимает на тебя глаза. Красные, как после бессонной ночи.', effects: [{ set: '$.c9_q_ole_eat', value: true }] },
      { id: 'c9_supper_bread', label: 'Положить на стол хлеб Кёлер', when: once9('bread_table'), enabled: { has: 'c9_koehler_bread' }, disabledReason: 'Хлеба нет при тебе', minutes: 3, combinable: true,
        text: 'Хенрике смотрит на хлеб, потом на тебя. Режет его на всех, тонко. Ты не говоришь, откуда он. Она и так знает.',
        effects: [{ take: 'c9_koehler_bread' }, { body: 'hunger', delta: -4 }, { set: '$.c9_bread_table', value: true }, { npc: 'henrike', trust: -1 }] },
    ] }),

  S9({ id: 'c9_dusk', for: 'any', chapter: 'ch3', title: 'Фонарь', camp: house9,
    text: [{ text: 'После ужина Дениз надевает куртку и берёт фонарь.\n\n— Керема нет. Пойду полевой дорогой вдоль старой ветки, до будки у большой дороги. Если он на Харбург пешком — ночует там.\n\n— Не ходи ночью, — говорит Хенрике. — Взрослый, вернётся.\n\nДениз смотрит на вас обоих.\n\n— Одному в темноте плохо. Кто пойдёт — выходим через полчаса.\n\nНина стоит у окна.\n\n— А папа? — спрашивает она. — Вы что решили?' }],
    actions: [
      { id: 'c9_dusk_talk', label: 'Сказать, что вам с {partner.ins} надо решить вдвоём', minutes: 3, terminal: true, goto: 'c9_checkpoint',
        text: 'Дениз кивает и выходит курить на крыльцо. Хенрике моет посуду спиной к вам.', effects: [{ set: '$.c9_finished', value: true }] },
      { id: 'c9_dusk_porch', label: 'Выйти с {partner.ins} на крыльцо, подальше от всех', minutes: 5, terminal: true, goto: 'c9_checkpoint', ambientDuring: outdoor9,
        text: 'На крыльце холодно. В темноте белеет фургон. Вы стоите рядом, плечом к плечу.', effects: [{ set: '$.c9_finished', value: true }, { body: 'stress', delta: -2 }] },
      { id: 'c9_dusk_nina', label: 'Сначала пообещать Нине, что без неё не решат молча', minutes: 3, terminal: true, goto: 'c9_checkpoint',
        text: 'Нина кивает и снова поворачивается к окну. Хенрике бросает на тебя быстрый взгляд.', effects: [{ set: '$.c9_finished', value: true }, { npc: 'c7_nina', trust: 1 }] },
    ] }),

  S9({ id: 'c9_checkpoint', for: 'any', chapter: 'ch3', title: 'Перед ночью', checkpoint: 9, universal: false, camp: undefined,
    text: [{ text: 'Нужно решить две вещи. Что будет с Йенсом этой ночью. И пойдёт ли {partner} с Денизом искать Керема. Второе каждый из вас решает не за себя, а за другого.' }], actions: [] }),
];
