import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { ninaFarm } from './point18';
import { npc } from './point19';
import { S24, set24, until24, w24 } from './point24';

// Участок 24, третий проход (до уровня 19–20): лиса у курятника и Пауль, внук Кёлер (A; откликается в 33-й), козы Уте (B),
// поздний вечер у обоих.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S24({ ...scene, for: 'any', chapter: 'ch3' });
const snow = { tempC: -2, outdoor: true, wet: false };
const ute: Cond = { npc: 'c14_ute', alive: true };

export const day24GScenes: Scene[] = [
  X({ id: 'c24_a_fox', title: 'Курятник', camp: yard14, ambient: snow,
    text: [
      { text: 'У курятника на снегу следы: мелкие, в линию, как бусы. Лиса. Сетка внизу подкопана, доска у лаза отогнута. Ночью она вернётся: на морозе ей тоже есть нечего.' },
    ],
    actions: [
      { id: 'c24_af_board', label: 'Прибить доски внизу и закопать сетку поглубже', minutes: 40, activity: 'moderate', terminal: true, goto: 'c24_a_paul', ambientDuring: snow,
        text: 'Мёрзлая земля поддаётся ломом. Ты закапываешь сетку на ладонь и прибиваешь сверху две доски. Ночью лиса ходит вокруг, ты слышишь, как куры кудахчут, но утром все на месте.', effects: [set24('af', 'board'), w24('fox', 'blocked'), until24(16, 20)] },
      { id: 'c24_af_trap', label: 'Поставить в сарае старый капкан Оле', minutes: 30, terminal: true, goto: 'c24_a_paul',
        text: 'Капкан ржавый, пружина тугая. Ты взводишь его рукояткой ломика и ставишь у лаза, присыпав соломой. Утром в капкане лиса, рыжая, худая, с белым кончиком хвоста. Шкуру Хенрике, если вернётся, выделает.', effects: [set24('af', 'trap'), w24('fox', 'trapped'), until24(16, 10)] },
      { id: 'c24_af_leave', label: 'Оставить: куры на ночь в хлеву, у коровы', minutes: 20, terminal: true, goto: 'c24_a_paul',
        text: 'Ты переносишь кур по одной в хлев. Корова недовольна. Ночью лиса разоряет пустой курятник, ничего не находит и уходит. Утром надо будет переносить обратно.', effects: [set24('af', 'leave'), w24('fox', 'moved'), until24(16, 0)] },
    ] }),

  X({ id: 'c24_a_paul', title: 'Пауль', camp: yard14, ambient: snow,
    text: [
      { text: 'У ворот мальчишка лет двенадцати с пустыми санками. Пауль, внук фрау Кёлер. Он спрашивает, нет ли работы: дрова колоть, снег кидать. За хлеб. Бабушка не знает, что он пришёл.' },
    ],
    actions: [
      { id: 'c24_ap3_work', label: 'Дать ему колоть дрова и накормить', minutes: 60, terminal: true, goto: 'c24_a_dusk',
        text: 'Пауль колет неумело, но упрямо. Ты показываешь, как ставить полено, как держать колун. Через час у стены небольшая поленница, а у него на ладонях первые мозоли. Ты кормишь его супом и даёшь с собой хлеба. «Komm wieder», — говоришь ты. Приходи ещё.', effects: [set24('ap3', 'work'), w24('paul', 'work'), npc('c3_koehler', 1, 'c24_paul_worked'), until24(17, 20)] },
      { id: 'c24_ap3_bread', label: 'Просто дать ему хлеба', minutes: 15, terminal: true, goto: 'c24_a_dusk',
        text: 'Пауль берёт хлеб, кивает и не уходит. Он хотел работать, а не брать. Потом всё-таки уходит, санки громыхают по дороге.', effects: [set24('ap3', 'bread'), w24('paul', 'bread'), until24(16, 40)] },
      { id: 'c24_ap3_no', label: 'Отправить домой: бабушка будет волноваться', minutes: 10, terminal: true, goto: 'c24_a_dusk',
        text: 'Пауль смотрит на тебя, потом на поленницу. Уходит молча. Ты знаешь, что дома у Кёлер дров почти нет.', effects: [set24('ap3', 'no'), w24('paul', 'no'), until24(16, 30)] },
    ] }),

  X({ id: 'c24_b_ute', title: 'Козы', camp: yard14, ambient: snow,
    text: [
      { when: ute, text: 'Уте стоит у ворот в платке, запыхавшись. Её козы, три, стоят на морозе у домика в колонии: сарай там продуло, крыша съехала. На ночь их надо куда-то деть, иначе к утру одна не встанет.' },
      { when: not(ute), text: 'У ворот блеют две козы. Чьи — непонятно: наверное, из колонии, оттуда, где после среды никого не осталось. Голодные, в инее.' },
    ],
    actions: [
      { id: 'c24_bu2_barn', label: 'Взять коз в хлев к корове', minutes: 50, activity: 'moderate', terminal: true, goto: 'c24_b_dusk', ambientDuring: snow,
        text: 'Козы входят в хлев, обнюхивают корову, корова — коз. Уте устраивает им угол сама, стелет солому. Перед уходом она доит самую старую и оставляет тебе кружку молока, ещё тёплого.', effects: [set24('bu2', 'barn'), w24('goats', 'barn'), { if: ute, then: [npc('c14_ute', 2, 'c24_took_goats')] }, until24(16, 30)] },
      { id: 'c24_bu2_fix', label: 'Пойти в колонию и поправить крышу её сарая', minutes: 70, activity: 'heavy', terminal: true, goto: 'c24_b_dusk', ambientDuring: snow,
        text: 'Крыша съехала на полметра. Вы с Уте поднимаете её жердью, подпираете, забиваете клинья. Руки немеют. Козы смотрят. К сумеркам сарай снова сарай.', effects: [set24('bu2', 'fix'), w24('goats', 'fixed'), { if: ute, then: [npc('c14_ute', 2)] }, { body: 'fatigue', delta: 6 }, until24(16, 50)] },
      { id: 'c24_bu2_no', label: 'Сказать: хлев полный, некуда', minutes: 15, terminal: true, goto: 'c24_b_dusk',
        text: 'Уте кивает и уводит коз сама. Утром ты узнаёшь от Кёлер, что одна коза не встала.', effects: [set24('bu2', 'no'), w24('goats', 'lost'), until24(15, 50)] },
    ] }),

  X({ id: 'c24_a_late', title: 'Поздно', camp: house14, onEnter: [until24(19, 0)],
    text: [
      { text: 'После ужина ты достаёшь из-за печки то, что не нашли при обыске. Спрятанное надо проверить: на месте ли, не отсырело ли.' },
    ],
    actions: [
      { id: 'c24_al5_move', label: 'Перепрятать всё в другое место', minutes: 25, terminal: true, goto: 'c24_checkpoint',
        text: 'Канистру — под доски в сенях, патроны — в банку с крупой. Ты делаешь это при свече, тихо, чтобы не разбудить Нину. Теперь даже ты не сразу найдёшь.', effects: [set24('al5', 'move'), w24('stash', 'moved'), until24(19, 30)] },
      { id: 'c24_al5_tell', label: 'Показать тайник {partner.dat}', minutes: 25, terminal: true, goto: 'c24_checkpoint',
        text: 'Ты показываешь {partner.dat}: здесь канистра, здесь патроны. Если тебя не будет, кто-то должен знать. {partner} кивает и повторяет вслух, чтобы запомнить.', effects: [set24('al5', 'tell'), w24('stash', 'shared'), until24(19, 30)] },
      { id: 'c24_al5_leave', label: 'Оставить как есть: не нашли раз, не найдут и снова', minutes: 15, terminal: true, goto: 'c24_checkpoint',
        text: 'Ты кладёшь всё обратно. Печка тёплая, за ней сухо. Ты надеешься, что прав{m:|а}.', effects: [set24('al5', 'leave'), until24(19, 20)] },
    ] }),

  X({ id: 'c24_b_late', title: 'Поздно', camp: kitchen14, onEnter: [until24(19, 0)],
    text: [
      { text: 'После ужина Нина сидит над тетрадкой, куда записывает, кто что ел. Сегодня она пишет медленно и стирает. Потом показывает тебе: сегодня ели все, кроме неё. Она отдала свою порцию Лео.' },
      { when: not(ninaFarm), text: 'Нины нет: тетрадь лежит на подоконнике раскрытая. Сегодняшняя строка пустая.' },
    ],
    actions: [
      { id: 'c24_bl8_share', label: 'Отдать ей половину своего хлеба', when: ninaFarm, minutes: 20, terminal: true, goto: 'c24_checkpoint',
        text: 'Нина сначала отказывается. Потом ест, медленно, отщипывая. Записывает в тетрадь: «ела». Тебе остаётся полкуска, и ты засыпаешь {m:голодным|голодной}, но спокойно.', effects: [set24('bl8', 'share'), npc('c7_nina', 2, 'c24_shared_bread'), { body: 'hunger', delta: 8 }, until24(19, 30)] },
      { id: 'c24_bl8_talk', label: 'Сказать: так нельзя, ты растёшь. Завтра — сначала ты', when: ninaFarm, minutes: 20, terminal: true, goto: 'c24_checkpoint',
        text: 'Нина кивает, не глядя. Ты знаешь, что завтра она сделает так же. Но теперь она знает, что ты {m:заметил|заметила}.', effects: [set24('bl8', 'talk'), npc('c7_nina', 1), until24(19, 30)] },
      { id: 'c24_bl8_write', label: 'Дописать за неё в тетрадь и лечь', minutes: 15, terminal: true, goto: 'c24_checkpoint',
        text: 'Ты пишешь в тетради ровным почерком: «все ели». Это неправда. Но тетрадь не для правды, она для порядка.', effects: [set24('bl8', 'write'), until24(19, 20)] },
    ] }),
];
