import type { Scene } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { not } from './world3';
import { A16, S16, day16, garden16, jens16, kitchen16, nina16, yard16 } from './point16';

// Черновик участка 16 (06.11, начато до 12:00). Не подключён: index.ts, routes.ts, kt5.ts — при дописывании.
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const split = (a: string, b: string) => [{ id: 'a', when: A16, goto: a }, { id: 'b', goto: b }];

export const day16Scenes: Scene[] = [
  S16({ id: 'c16_noon', for: 'any', chapter: 'ch3', title: 'После решения', camp: kitchen16,
    text: [
      { when: nina16('stay'), text: 'Нина вешает куртку на крючок у двери, рядом с вашими. Потом снимает и вешает снова, ровнее.' },
      { when: nina16('winsen'), text: 'Вы вернулись из Винзена вдвоём. В швейной комнате пустая раскладушка, на подоконнике забытая тетрадь по биологии.' },
      { when: garden16('help'), text: 'Яннес ответил одним словом: «Danke». Уте — вторым: «Ich wusste es».' },
      { when: garden16('tell'), text: 'Патрульная машина уехала в сторону насыпи. Обратно её пока не видно.' },
      { when: garden16('away'), text: 'Про колонию у насыпи больше никто не говорит. От этого она не становится дальше.' },
      { when: jens16('give'), text: 'Под навесом пустая кабина. Дверь кто-то закрыл.' },
      { when: not(jens16('give')), text: 'Под яблоней холмик и доска с выцарапанными буквами.' },
    ],
    actions: [
      { id: 'c16_n_table', label: 'Сесть за стол и съесть, что осталось', minutes: 15, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: 'Хлеб Кёлер, сливы из банки. Ешь молча. В доме тихо так, что слышно часы Хенрике.', effects: [{ set: '$.c16_noon', value: 'table' }] },
      { id: 'c16_n_partner', label: 'Постоять с {partner.ins} на крыльце', minutes: 5, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: 'Вы стоите рядом. Дорога пустая. Над насыпью кружат вороны.', effects: [{ set: '$.c16_noon', value: 'partner' }, { body: 'stress', delta: -1 }] },
      { id: 'c16_n_nina', label: 'Спросить Нину, как она', when: nina16('stay'), minutes: 5, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: '— Нормально. — Нина пожимает плечами. — Просто странно. Вчера было зачем вставать ночью. А сегодня нет.', effects: [{ set: '$.c16_noon', value: 'nina' }, nina(1)] },
    ] }),

  S16({ id: 'c16_a_yard', for: 'any', chapter: 'ch3', title: 'Двор', camp: yard16, ambient: day16,
    text: [
      { text: 'Во дворе пусто. Куры копаются у поленницы. Corsa стоит у сарая, на стекле подсохшие разводы от инея.' },
      { when: { v: 'A.c15_water', op: '==', value: 'colony' }, text: 'У задней калитки две полные канистры. Сорок литров. Ты налил{m:|а} их утром.' },
      { when: garden16('help'), text: 'Яннес написал: «Mittwoch. Ab zehn». В среду, с десяти.' },
    ],
    actions: [
      { id: 'c16_ay_rails', label: 'Подняться на насыпь и посмотреть в сторону колонии', minutes: 30, activity: 'moderate', terminal: true, goto: 'c16_a_yard2',
        text: 'С насыпи видны крыши садовых домиков за рощей. Над одной поднимается дым, тонкий, ровный. Больше ничего не видно. Ты стоишь, пока не начинают мёрзнуть пальцы.', effects: [{ set: '$.c16_yard', value: 'rails' }] },
      { id: 'c16_ay_car', label: 'Проверить Corsa: бензин, колёса', minutes: 15, terminal: true, goto: 'c16_a_yard2',
        text: 'Стрелка ниже четверти. Левое заднее колесо мягкое. Насос в багажнике есть, запаски нет. Если ехать куда-то далеко — то один раз.', effects: [{ set: '$.c16_yard', value: 'car' }] },
      { id: 'c16_ay_van', label: 'Заглянуть под навес', minutes: 8, terminal: true, goto: 'c16_a_yard2',
        effects: [{ set: '$.c16_yard', value: 'van' }],
        outcomes: [
          { id: 'g', when: jens16('give'), text: 'Кабина пустая и чистая. На козырьке пусто: рисунок кто-то снял. Ключ торчит в замке. Фургон теперь просто фургон. Чей — непонятно.' },
          { id: 'x', text: 'Кабина пустая и чистая. Доски с окна сняты, сложены у стены. Одной не хватает: она стоит под яблоней, с буквами.' },
        ] },
    ] }),

  S16({ id: 'c16_b_house', for: 'any', chapter: 'ch3', title: 'Дом', camp: kitchen16,
    text: [
      { when: nina16('stay'), text: 'Нина сидит на подоконнике в швейной комнате и смотрит на поле. На коленях тетрадь по биологии, открытая на той же странице, что и вчера.\n\n— В среду я пойду туда, — говорит она, не оборачиваясь. — С вами или без.' },
      { when: nina16('winsen'), text: 'На кухонном столе вибрирует твой телефон. Незнакомый номер с кодом Винзена. Голос Нины, торопливый:\n\n— Это я. С телефона Лениной мамы. Я доехала. Тут свет. Два часа в день. — Пауза. — А у вас как? Тихо?' },
    ],
    actions: [
      { id: 'c16_bh_with', label: 'Сказать: в среду пойдём вместе', when: nina16('stay'), minutes: 4, terminal: true, goto: 'c16_b_house2',
        text: 'Нина кивает и наконец переворачивает страницу.\n\n— Вместе, — говорит она. — Вы двое и я. Ладно.', effects: [{ set: '$.c16_house', value: 'with' }, nina(1)] },
      { id: 'c16_bh_school', label: 'Спросить про тетрадь', when: nina16('stay'), minutes: 6, terminal: true, goto: 'c16_b_house2',
        text: '— Фотосинтез. — Нина фыркает. — Домашка на четверг. Какой четверг. — Она закрывает тетрадь, но с подоконника её не убирает.', effects: [{ set: '$.c16_house', value: 'school' }] },
      { id: 'c16_bh_quiet', label: 'Сказать: тихо. Скучаем', when: nina16('winsen'), minutes: 5, terminal: true, goto: 'c16_b_house2',
        text: 'Нина молчит. Слышно, как кто-то рядом с ней говорит по-немецки и смеётся.\n\n— Я тоже, — говорит она быстро. — Поливайте кур. В смысле, кормите. Ну, вы поняли.', effects: [{ set: '$.c16_house', value: 'quiet' }, nina(1)] },
      { id: 'c16_bh_colony', label: 'Сказать ей про колонию и среду', when: nina16('winsen'), minutes: 6, terminal: true, goto: 'c16_b_house2',
        text: '— В среду, — повторяет Нина. — Я доеду. На велике. Двадцать километров — это ничего. — Пауза. — Не говорите Лениной маме.', effects: [{ set: '$.c16_house', value: 'colony' }] },
    ] }),

  // Дальше по плану: c16_a_yard2, c16_b_house2 и следующие.
  S16({ id: 'c16_a_yard2', for: 'any', chapter: 'ch3', title: 'Черновик', camp: yard16, ambient: day16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
  S16({ id: 'c16_b_house2', for: 'any', chapter: 'ch3', title: 'Черновик', camp: kitchen16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
];

export const day16Scenes: Scene[] = [
  S16({ id: 'c16_noon', for: 'any', chapter: 'ch3', title: 'После решения', camp: kitchen16,
    text: [
      { when: nina16('stay'), text: 'Нина вешает куртку на крючок у двери, рядом с вашими. Потом снимает и вешает снова, ровнее.' },
      { when: nina16('winsen'), text: 'Вы вернулись из Винзена вдвоём. В швейной комнате пустая раскладушка, на подоконнике забытая тетрадь по биологии.' },
      { when: garden16('help'), text: 'Яннес ответил одним словом: «Danke». Уте — вторым: «Ich wusste es».' },
      { when: garden16('tell'), text: 'Патрульная машина уехала в сторону насыпи. Обратно её пока не видно.' },
      { when: garden16('away'), text: 'Про колонию у насыпи больше никто не говорит. От этого она не становится дальше.' },
      { when: jens16('give'), text: 'Под навесом пустая кабина. Дверь кто-то закрыл.' },
      { when: not(jens16('give')), text: 'Под яблоней холмик и доска с выцарапанными буквами.' },
    ],
    actions: [
      { id: 'c16_n_table', label: 'Сесть за стол и съесть, что осталось', minutes: 15, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: 'Хлеб Кёлер, сливы из банки. Ешь молча. В доме тихо так, что слышно часы Хенрике.', effects: [{ set: '$.c16_noon', value: 'table' }] },
      { id: 'c16_n_partner', label: 'Постоять с {partner.ins} на крыльце', minutes: 5, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: 'Вы стоите рядом. Дорога пустая. Над насыпью кружат вороны.', effects: [{ set: '$.c16_noon', value: 'partner' }, { body: 'stress', delta: -1 }] },
      { id: 'c16_n_nina', label: 'Спросить Нину, как она', when: nina16('stay'), minutes: 5, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: '— Нормально. — Нина пожимает плечами. — Просто странно. Вчера было зачем вставать ночью. А сегодня нет.', effects: [{ set: '$.c16_noon', value: 'nina' }, nina(1)] },
    ] }),

  S16({ id: 'c16_a_yard', for: 'any', chapter: 'ch3', title: 'Двор', camp: yard16, ambient: day16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
  S16({ id: 'c16_b_house', for: 'any', chapter: 'ch3', title: 'Дом', camp: kitchen16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
];
