import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { ninaFarm } from './point18';
import { npc } from './point19';
import { S26, brandtByA, dutyA, oleNow, set26, snow26, until26, w26 } from './point26';

// Участок 26, третий проход (до уровня 19–20): мёртвый дружинник в канаве (A), санки Кёлер на дороге и письмо Леи (B),
// поздний вечер у обоих.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S26({ ...scene, for: 'any', chapter: 'ch3' });
const afterTimm = [{ id: 'b', when: brandtByA, goto: 'c26_a_brandt' }, { id: 'm', when: flag('w.c26_meat_got'), goto: 'c26_a_salt' }, { id: 'dl', when: dutyA, goto: 'c26_a_home' }, { id: 'h', goto: 'c26_a_yardwork' }];
const lea: Cond = { npc: 'c21_lea', alive: true };

export const day26GScenes: Scene[] = [
  X({ id: 'c26_a_ditch', title: 'Канава', location: 'c7_farm_lane', ambient: snow26,
    text: [
      { text: 'На обратном пути из Люллау, в канаве у поворота, лицом вниз лежит человек. Снег на нём не тает. На рукаве белая повязка дружины, на поясе фляжка. Рядом, вмёрзшая в лёд, лопата.' },
      { text: 'Ты переворачиваешь его палкой. Обращённый. Давно, дня три. Кто-то его остановил: голова разбита. Лицо незнакомое. В нагрудном кармане корочка с фотографией: «Freiwillige Feuerwehr Hanstedt. Klaus Rieger».' },
    ],
    actions: [
      { id: 'c26_ad2_take', label: 'Забрать корочку и повязку для Брандта: семья должна знать', minutes: 30, terminal: true, outcomes: afterTimm,
        text: 'Ты снимаешь повязку, кладёшь в карман вместе с корочкой. Фляжку оставляешь. Через неделю в Йестебурге кто-то будет ждать Клауса Ригера. Теперь ждать перестанут.', effects: [set26('ad2', 'take'), w26('rieger', 'taken'), { give: 'c26_rieger_card' }, until26(13, 30)] },
      { id: 'c26_ad2_bury', label: 'Закидать его снегом и воткнуть лопату крестом', minutes: 40, activity: 'moderate', terminal: true, outcomes: afterTimm,
        text: 'Ты закидываешь его снегом, пока не остаётся сугроб. Лопату втыкаешь в изголовье, черенком вверх, перекладиной привязываешь палку. Корочку кладёшь ему обратно в карман: найдут весной. Если будут искать.', effects: [set26('ad2', 'bury'), w26('rieger', 'buried'), { body: 'fatigue', delta: 4 }, until26(13, 40)] },
      { id: 'c26_ad2_leave', label: 'Обойти и идти дальше', minutes: 10, terminal: true, outcomes: afterTimm,
        text: 'Ты обходишь канаву по другой стороне дороги. Оглядываешься один раз. Ворона уже сидит на лопате.', effects: [set26('ad2', 'leave'), w26('rieger', 'left'), { body: 'stress', delta: 3 }, until26(13, 15)] },
    ] }),

  X({ id: 'c26_b_sled', title: 'Санки', location: 'c7_farm_lane', ambient: snow26,
    text: [
      { text: 'На полдороге домой ты догоняешь фрау Кёлер. Она тянет санки с дровами в горку, и санки сползают назад, а она упирается и не отпускает верёвку. Дрова для пекарни: без них завтра не будет хлеба.' },
    ],
    actions: [
      { id: 'c26_bs2_pull', label: 'Впрячься вместе с ней до самой пекарни', minutes: 40, activity: 'moderate', terminal: true, goto: 'c26_b_afternoon',
        text: 'Вы тянете вдвоём, дышите в такт. На горке ты толкаешь сзади. У пекарни фрау Кёлер садится на санки и долго не может говорить. Потом достаёт из-под прилавка вчерашнюю булку и суёт тебе в руки. «Für die Kleine. Die mit den Zöpfen». Для малышки. Той, что с косами.', effects: [set26('bs2', 'pull'), npc('c3_koehler', 2, 'c26_pulled_sled'), { give: 'c16_bread' }, until26(14, 40)] },
      { id: 'c26_bs2_half', label: 'Помочь с горкой и идти домой', minutes: 20, terminal: true, goto: 'c26_b_afternoon',
        text: 'Ты затаскиваешь санки на горку. Дальше дорога ровная, фрау Кёлер машет: иди, справлюсь. Ты идёшь и оглядываешься: она тянет медленно, но тянет.', effects: [set26('bs2', 'half'), npc('c3_koehler', 1), until26(14, 20)] },
      { id: 'c26_bs2_pass', label: 'Пройти мимо: {m:сам|сама} еле на ногах после смены', minutes: 5, terminal: true, goto: 'c26_b_afternoon',
        text: 'Ты киваешь ей и проходишь. Сзади слышно, как санки снова сползают и как она ругается, тихо, по-старому.', effects: [set26('bs2', 'pass'), npc('c3_koehler', -1, 'c26_b_passed'), until26(14, 5)] },
    ] }),

  X({ id: 'c26_b_letter', title: 'Письмо в Ганновер', camp: kitchen14, onEnter: [until26(16, 0)],
    text: [
      { when: lea, text: 'Лея садится напротив тебя с листом бумаги и сразу его откладывает. Просит помочь: написать в Красный Крест Ганновера, про мать и брата. Немецкий у неё родной, но рука не пишет: каждое слово как через вату.' },
      { when: not(lea), text: 'Нина сидит над тетрадью и не пишет. Говорит: хочет написать письмо подруге в Винзен, а не знает как: всё, что было за неделю, в письмо не помещается.' },
    ],
    actions: [
      { id: 'c26_bl3_dict', label: 'Писать под её диктовку, медленно, по слову', minutes: 50, terminal: true, goto: 'c26_b_eggs',
        text: 'Маргит Хартман, сорок шесть лет. Финн Хартман, двенадцать. Ганновер, Линден, адрес. Последний раз виделись девятого ноября. Лея диктует ровно, пока не доходит до «девятого ноября». Дальше ты пишешь {m:сам|сама}, по её кивкам.', effects: [set26('bl3', 'dict'), w26('lea_letter', true), npc('c21_lea', 2, 'c26_b_wrote_letter'), until26(16, 50)] },
      { id: 'c26_bl3_short', label: 'Предложить коротко: имена, адрес, дата', minutes: 30, terminal: true, goto: 'c26_b_eggs',
        text: 'Три строки. Лея перечитывает и кивает: так даже лучше, в Красном Кресте длинное не читают. Конверт она подписывает сама.', effects: [set26('bl3', 'short'), w26('lea_letter', true), npc('c21_lea', 1), until26(16, 30)] },
      { id: 'c26_bl3_later', label: 'Сказать: напишем, когда будет оказия', when: lea, minutes: 20, terminal: true, goto: 'c26_b_eggs',
        text: 'Лея кивает и убирает лист. «Oder nie», — говорит она. Или никогда. Без упрёка.', effects: [set26('bl3', 'later'), until26(16, 20)] },
      { id: 'c26_bl3_nina', label: 'Сказать Нине: пиши только одну хорошую вещь', when: not(lea), minutes: 30, terminal: true, goto: 'c26_b_eggs',
        text: 'Нина думает и пишет одну строку: «У нас тут курица, которая клюёт Эву за пятку». Смеётся. Потом пишет ещё полстраницы.', effects: [set26('bl3', 'nina'), npc('c7_nina', 1), until26(16, 30)] },
    ] }),

  X({ id: 'c26_a_late', title: 'Поздно', camp: house14, onEnter: [until26(19, 45)],
    text: [
      { when: oleNow, text: 'Ночью Оле не спит. Ты слышишь, как он ходит по комнате, медленно, держась за стену. Первая ночь дома после Люнебурга.' },
      { when: not(oleNow), text: 'Ночью ты выходишь к сараю: надо проверить, закрыта ли дверь на засов. Из-за поля, от насыпи, доносится звук, как будто кто-то волочит по снегу мешок.' },
    ],
    actions: [
      { id: 'c26_al_ole', label: 'Зайти к Оле и посидеть с ним', when: oleNow, minutes: 40, terminal: true, goto: 'c26_checkpoint',
        text: 'Он сидит на краю кровати в темноте. Говорит, что там, в казарме, не мог спать от тишины, а здесь — от звуков: часы, печь, мать за стеной. Ты сидишь рядом, пока он не ложится. Он засыпает, держа твою руку, и стесняется этого утром.', effects: [set26('al', 'ole'), npc('ole', 2, 'c26_sat_first_night'), until26(20, 30)] },
      { id: 'c26_al_henrike', label: 'Разбудить Хенрике: пусть сидит она', when: oleNow, minutes: 20, terminal: true, goto: 'c26_checkpoint',
        text: 'Хенрике встаёт сразу, будто не спала. Ты слышишь через стену, как она говорит с сыном вполголоса, по-немецки, как с маленьким. Потом тихо.', effects: [set26('al', 'henrike'), npc('henrike', 1), until26(20, 15)] },
      { id: 'c26_al_look', label: 'Посмотреть, что там у насыпи', when: not(oleNow), minutes: 40, terminal: true, goto: 'c26_checkpoint',
        text: 'С фонарём до края поля. На снегу борозда, как от санок, ведёт к колонии. Следы рядом — человеческие, тяжёлые. Кто-то тащил что-то в колонию ночью. Ты возвращаешься и задвигаешь засов на калитке тоже.', effects: [set26('al', 'look'), w26('colony_tracks', true), until26(20, 30)] },
      { id: 'c26_al_bolt', label: 'Задвинуть засов и лечь', minutes: 15, terminal: true, goto: 'c26_checkpoint',
        text: 'Засов, ещё засов. Ты ложишься и долго слушаешь. Звук больше не повторяется.', effects: [set26('al', 'bolt'), until26(20, 10)] },
    ] }),

  X({ id: 'c26_b_late', title: 'Поздно', camp: house14, onEnter: [until26(19, 45)],
    text: [
      { text: 'Перед сном Нина приносит тебе свою тетрадь, где записывает, что ели, и молча показывает последнюю строку. Там цифра: сколько дней хватит картошки, если есть, как сейчас. Цифра маленькая.' },
      { when: not(ninaFarm), text: 'Нины нет, тетрадь лежит на её раскладушке. Ты всё равно открываешь последнюю страницу.' },
    ],
    actions: [
      { id: 'c26_bl4_tell', label: 'Показать цифру Хенрике сейчас же', minutes: 30, terminal: true, goto: 'c26_checkpoint',
        text: 'Хенрике смотрит на цифру, потом на Нину, потом на тебя. Достаёт свою тетрадь, сверяет. «Das Kind rechnet besser als ich». Ребёнок считает лучше меня. Завтра, говорит она, порции будут меньше. Всем, и ей тоже.', effects: [set26('bl4', 'tell'), w26('portions_cut', true), npc('henrike', 1), until26(20, 15)] },
      { id: 'c26_bl4_keep', label: 'Сказать Нине: держи при себе, никому не говори пока', minutes: 20, terminal: true, goto: 'c26_checkpoint',
        text: 'Нина кивает. Закрывает тетрадь. Ей тяжело держать это одной, и теперь вы держите вдвоём.', effects: [set26('bl4', 'keep'), npc('c7_nina', 1, 'c26_shared_secret'), until26(20, 10)] },
      { id: 'c26_bl4_recount', label: 'Пересчитать вместе: вдруг Нина ошиблась', minutes: 40, terminal: true, goto: 'c26_checkpoint',
        text: 'Вы пересчитываете вдвоём, при свечке. Нина не ошиблась. Но вы находите в подвале ещё два ящика, которые она не видела, и цифра становится чуть больше. Чуть.', effects: [set26('bl4', 'recount'), w26('recounted', true), until26(20, 30)] },
    ] }),
];
