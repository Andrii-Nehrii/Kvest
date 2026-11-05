import type { ActionDef, Scene, TextBlock } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { A9, B9, S9, keremHere9, morning9, outdoor9, yard9 } from './point9';

export const prepare9: Effect = { camp: { kind: 'prepare', quiet: true } };
export const carAt9 = (place: string, liters: number): Cond => all({ itemAt: 'opel_corsa', place }, { fuelIn: 'opel_corsa', liters }, flag('A.c8_has_key'));
/** Машину и бензин тратит только линия A; B просто едет рядом. */
export const ride9 = (km: number): Effect => ({ if: A9, then: [{ drive: 'opel_corsa', km, to: 'hof_luedemann' }], else: [{ move: 'hof_luedemann' }] });
export const walk9: Effect = { move: 'hof_luedemann' };

const yardRest = 'Во дворе пахнет свежими опилками. Боковое окно фургона заколочено двумя новыми досками. Утром их не было.\n\nДениз стоит у кабины с молотком и держит гвозди в зубах. Оле проносит мимо охапку поленьев. Он прижимает её к груди одной правой рукой и не здоровается.';
export const yardText9 = (returning: boolean): TextBlock[] => [
  returning ? { text: 'Хенрике открывает вам калитку и сразу уходит в дом.' } : { text: 'Хенрике закрывает за вами калитку и сразу уходит в дом.' },
  { text: yardRest },
  { when: keremHere9, text: 'У сарая на чурбаке сидит Керем. У его ног — собранный рюкзак.' },
  { when: all(not(keremHere9), { npc: 'kerem', at: 'b75_road' }), text: 'Керема во дворе нет.' },
];
export const yardActions9 = (prefix: string): ActionDef[] => [
  { id: `${prefix}_a`, label: 'Подойти к Денизу и спросить, что с окном', when: A9, minutes: 2, terminal: true, goto: 'c9_a_window', effects: [...morning9, prepare9] },
  { id: `${prefix}_b`, label: 'Пойти в дом вслед за Хенрике', when: B9, minutes: 2, terminal: true, goto: 'c9_b_kitchen', effects: [...morning9, prepare9] },
  { id: `${prefix}_kerem`, label: 'Сначала подойти к Керему с рюкзаком', when: keremHere9, minutes: 2, terminal: true, goto: 'c9_kerem', effects: [...morning9, prepare9] },
];

const keremNext = [{ id: 'a2', when: all(A9, { visited: 'c9_a_window' }), goto: 'c9_a_henrike' }, { id: 'a', when: A9, goto: 'c9_a_window' }, { id: 'b', goto: 'c9_b_kitchen' }];

export const entry9Scenes: Scene[] = [
  S9({ id: 'c9_yard', for: 'any', chapter: 'ch3', title: 'Двор', camp: yard9, ambient: outdoor9,
    text: yardText9(true), actions: yardActions9('c9_yard') }),

  S9({ id: 'c9_east_post', for: 'any', chapter: 'ch3', title: 'Кордон', location: 'c8_east_road', ambient: { tempC: 8, outdoor: false, wet: false },
    text: [{ text: 'Солдат наклоняется к опущенному стеклу.\n\n— Дальше нельзя. Граница района. На Люнебург никого не пускаем.\n\nОн смотрит на ваши руки, потом на лица.\n\nУ обочины девочка-подросток с велосипедом спорит со вторым солдатом. Показывает ему телефон. Тот качает головой и отходит.' }],
    actions: [
      { id: 'c9_east_wounded', label: 'Спросить, куда везти раненых, если что', minutes: 2, combinable: true, when: not(flag('$.c9_post_info')),
        text: '— В Йестебург. Школа, спортзал. Там пункт. Осматривают, раненых отделяют, оказывают помощь. — Солдат стучит ладонью по крыше. — Разворачивайтесь.', effects: [{ set: '$.c9_post_info', value: true }] },
      { id: 'c9_east_girl', label: 'Выйти к девочке с велосипедом', minutes: 3, terminal: true, goto: 'c9_east_nina',
        effects: [{ introduceNpc: 'c7_nina' }, { npc: 'c7_nina', moveTo: 'c8_east_road' }, { set: '$.met.c7_nina', value: true }, { set: '$.c9_nina_road', value: true }],
        text: 'Девочка отступает на шаг, когда ты подходишь. Велосипед держит перед собой.' },
      { id: 'c9_east_leave', label: 'Развернуться и ехать на хутор', when: carAt9('c8_east_road', 0.9), minutes: 40, activity: 'light', terminal: true, goto: 'c9_yard', effects: [ride9(14)],
        text: 'Вы разворачиваетесь. В зеркале девочка всё ещё стоит у грузовика. Через сорок минут — поворот к хутору.' },
      { id: 'c9_east_leave_foot', label: 'Возвращаться на хутор пешком', when: not(carAt9('c8_east_road', 0.9)), minutes: 180, activity: 'moderate', move: true, terminal: true, goto: 'c9_yard', effects: [walk9],
        ambientDuring: outdoor9, text: 'Без топлива остаётся только дорога пешком. Вы идёте почти три часа и молчите, чтобы беречь силы.' },
    ] }),

  S9({ id: 'c9_east_nina', for: 'any', chapter: 'ch3', title: 'Точка на карте', location: 'c8_east_road', ambient: outdoor9,
    text: [
      { text: 'Девочке лет пятнадцать. Куртка промокла на плечах, руки красные от руля.\n\n— Вы местные? Мне надо к хутору Людеманов. Под Йестебургом.\n\nНа экране её телефона — карта и точка с подписью «Папа». Точка стоит на хуторе. Последнее обновление: вчера, 23:58.' },
      { when: B9, text: 'Ты узнаёшь название раньше, чем она договаривает.' },
    ],
    actions: ([
      { id: 'c9_east_nina_way', label: 'Сказать, что вы оттуда, и объяснить дорогу', minutes: 40, activity: 'light', terminal: true, goto: 'c9_yard', effects: [ride9(14), { set: '$.c9_east_nina', value: 'way' }, { npc: 'c7_nina', trust: 1 }],
        text: '— Я Нина, — говорит она. — Там мой папа. Белый фургон.\n\nОна запоминает повороты, садится на велосипед и уезжает, не дожидаясь вопросов. Вы возвращаетесь на машине. Через сорок минут — поворот к хутору.' },
      { id: 'c9_east_nina_ride', label: 'Предложить подвезти её', minutes: 40, activity: 'light', terminal: true, goto: 'c9_yard', effects: [ride9(14), { set: '$.c9_east_nina', value: 'ride' }],
        text: '— Я в чужие машины не сажусь. И велосипед не брошу. — Она называет себя: Нина. — Скажите только, где сворачивать.\n\nТы объясняешь. Нина уезжает первой. Вы догоняете и обгоняете её на трассе; в зеркале она становится точкой.' },
      { id: 'c9_east_nina_warn', label: 'Сказать сразу, что человек в белом фургоне тяжело болен', minutes: 40, activity: 'light', terminal: true, goto: 'c9_yard', effects: [ride9(14), { set: '$.c9_east_nina', value: 'warned' }, { body: 'stress', delta: 3 }],
        text: 'Девочка замирает.\n\n— Болен — это не умер, — говорит она. — Я Нина. Это мой папа.\n\nОна уезжает быстрее, чем ты успеваешь что-то добавить. Вы возвращаетесь на хутор другой дорогой и не видите её больше.' },
      { id: 'c9_east_nina_foot', label: 'Объяснить ей дорогу и идти на хутор пешком', when: not(carAt9('c8_east_road', 0.9)), minutes: 180, activity: 'moderate', move: true, terminal: true, goto: 'c9_yard', effects: [walk9, { set: '$.c9_east_nina', value: 'way' }],
        ambientDuring: outdoor9, text: '— Я Нина, — говорит она. — Там мой папа. Белый фургон.\n\nОна уезжает вперёд. Вы идёте пешком почти три часа и молчите, чтобы беречь силы.' },
      { id: 'c9_east_nina_water', label: 'Дать ей бутылку воды', minutes: 2, combinable: true, when: once('water'), enabled: { has: 'water_05' }, disabledReason: 'Нужна своя полная бутылка',
        text: 'Нина пьёт половину сразу, остальное прячет в рюкзак. — Спасибо, — говорит она, впервые глядя прямо на тебя.', effects: [{ handOver: 'water_05', toNpc: 'c7_nina' }, { set: '$.c9_nina_water', value: true }, { npc: 'c7_nina', trust: 2 }] },
    ] as ActionDef[]).map(a => a.goto === 'c9_yard' && !['c9_east_nina_water', 'c9_east_nina_foot'].includes(a.id) ? { ...a, enabled: carAt9('c8_east_road', 0.9), disabledReason: 'Нужны машина рядом, ключ и топливо' } : a) }),

  S9({ id: 'c9_kerem', for: 'any', chapter: 'ch3', title: 'Рюкзак у сарая', universal: false, ambient: outdoor9,
    onEnter: [{ set: '$.c9_kerem_seen', value: true }],
    text: [{ text: 'Керем поднимается с чурбака. Лямки рюкзака уже затянуты.\n\n— Ухожу, — говорит он. — В Харбург. Пешком, полевой дорогой. Брата звал — не идёт.\n\nОн смотрит мимо тебя на дом. В кухонном окне появляется Хенрике и сразу отходит.' }],
    actions: [
      { id: 'c9_kerem_why', label: 'Спросить, почему так срочно', minutes: 4, terminal: true, effects: [{ set: '$.c9_kerem_words', value: 'lies' }, { npc: 'kerem', trust: 1, remember: '$:c9_asked_why' }],
        text: '— Потому что тут… — Из сарая выходит Оле, и Керем замолкает. Оле смотрит на него через весь двор.\n\nКерем отворачивается к рюкзаку и говорит совсем тихо:\n\n— Здесь врут. Уговорите брата уйти. Меня он не слушает.\n\nОн выходит за калитку и сворачивает на полевую дорогу.',
        outcomes: keremNext },
      { id: 'c9_kerem_ride', label: 'Предложить подвезти до большой дороги', when: all(A9, { itemAt: 'opel_corsa', place: 'hof_luedemann' }), minutes: 3, terminal: true,
        effects: [{ set: '$.c9_kerem_words', value: 'ride' }, { npc: 'kerem', trust: 1 }],
        text: '— Не надо. — Керем качает головой. — Вам тут ещё жить. Не надо, чтобы видели, что вы со мной.\n\nОн выходит за калитку и сворачивает на полевую дорогу.',
        outcomes: keremNext },
      { id: 'c9_kerem_stay', label: 'Попросить остаться хотя бы до утра', minutes: 3, terminal: true, effects: [{ set: '$.c9_kerem_words', value: 'stay' }],
        text: '— До утра… — Керем смотрит на заколоченный фургон. — Нет. Утром будет хуже.\n\nОн поднимает рюкзак, выходит за калитку и сворачивает на полевую дорогу.',
        outcomes: keremNext },
    ] }),
];

function once(key: string): Cond { return not(flag(`$.c9_${key}`)); }
