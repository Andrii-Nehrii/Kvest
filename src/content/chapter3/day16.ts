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

  // Дальше по плану CHAPTER3_ARC16_PLAN.md: c16_a_yard (A — двор, канистры/колония), c16_b_house (B — дом, Нина или телефон с Винзеном).
  S16({ id: 'c16_a_yard', for: 'any', chapter: 'ch3', title: 'Двор', camp: yard16, ambient: day16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
  S16({ id: 'c16_b_house', for: 'any', chapter: 'ch3', title: 'Дом', camp: kitchen16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
];
