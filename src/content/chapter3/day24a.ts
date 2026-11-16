import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { v } from './point18';
import { npc, tableOnly } from './point19';
import { S24, monHide, monOpen, monShut, set24, snow24, until24, w24 } from './point24';

// Участок 24, линия A: подготовка к обходу, шкаф Оле с буквенным замком (подсказка — фото «Ole, 9, mit Asta» в ужине 23-й),
// Брандт у ворот (общая сцена), двор после обыска.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S24({ ...scene, for: 'any', chapter: 'ch3' });
const leoHere: Cond = v('w.c24_marcus', 'taken');
const battery: Cond = flag('w.c23_battery_out');
const tried = (w: string): Cond => flag(`$.c24_try_${w}`);
const opened: Effect[] = [{ give: 'c24_binoculars' }, { give: 'c19_shells', qty: 6 }, { give: 'c24_korn' }, w24('ole_cabinet', 'open'), set24('cabinet', 'open')];
const WORDS = ['GERD', 'NINA', 'OLLE', 'ASTA'] as const;
/** Четыре кольца, четыре буквы. Неверное слово стоит десять минут; верное — ASTA, кличка собаки с фотографии над столом. */
const tryActions = (scene: string): ActionDef[] => [
  ...WORDS.map((w): ActionDef => w === 'ASTA'
    ? { id: `${scene}_${w.toLowerCase()}`, label: `Набрать «${w}»`, when: not(tried(w)), minutes: 10, terminal: true, goto: 'c24_gate',
      text: 'Кольца встают на место с мягким щелчком. Дужка отходит. Внутри, на полке, завёрнутый в фланелевую рубашку, лежит армейский бинокль. Под ним картонная коробка: шесть патронов к двустволке. И плоская фляга, в которой плещется что-то крепкое. На крышке выцарапано: «Für Notfälle. O.» На крайний случай.', effects: [...opened, until24(9, 55)] }
    : { id: `${scene}_${w.toLowerCase()}`, label: `Набрать «${w}»`, when: not(tried(w)), minutes: 10, terminal: true, goto: 'c24_a_lock2',
      text: 'Кольца встают, дужка не двигается. Ты дёргаешь ещё раз. Нет.', effects: [set24(`try_${w}`, true)] }),
  { id: `${scene}_break`, label: 'Сбить замок колуном', minutes: 15, activity: 'moderate', terminal: true, goto: 'c24_gate',
    text: 'Три удара. На третьем дужка лопается, а вместе с ней — что-то внутри шкафа, со звоном. Бинокль упал с полки: одна линза треснула паутиной. Патроны целы. Фляга цела. Снизу кричит Нина: что это было?', effects: [{ give: 'c19_shells', qty: 6 }, { give: 'c24_korn' }, w24('ole_cabinet', 'broken'), set24('cabinet', 'broken'), npc('c7_nina', -1), until24(9, 55)] },
  { id: `${scene}_leave`, label: 'Оставить шкаф как есть', minutes: 5, terminal: true, goto: 'c24_gate',
    text: 'Это шкаф Оле. Не твой. Ты задвигаешь перед ним сундук обратно.', effects: [set24('cabinet', 'left'), until24(9, 50)] },
];

export const day24AScenes: Scene[] = [
  A({ id: 'c24_a_prep', title: 'До десяти', camp: yard14, ambient: snow24,
    text: [
      { when: monOpen, text: 'Вы решили показать всё. Ты выносишь на кухонный стол то, что Брандт захочет увидеть, и раскладываешь, как на рынке.' },
      { when: monHide, text: 'Вы решили: вещи спрятать, людей показать. Ты обходишь тайники, один за другим.' },
      { when: monShut, text: 'Вы решили закрыть ворота. Цепь, замок. Ключ один, и он у тебя.' },
      { text: 'До десяти два часа. Ты ходишь по дому и смотришь на всё глазами чужого человека: что видно сразу, что можно найти, что лучше убрать.' },
    ],
    actions: [
      { id: 'c24_ap_table', label: 'Разложить на столе бумагу Брандта и всё по списку', when: monOpen, minutes: 30, terminal: true, goto: 'c24_a_room',
        text: 'Бумага Брандта, листок с цифрами, ключи от Corsa, расписка за ружьё, если будет. Ты смотришь на стол и думаешь, что так, наверное, выглядит честность. Пустовато.', effects: [set24('ap', 'table'), until24(9, 0)] },
      { id: 'c24_ap_check', label: 'Проверить тайники: канистра, ружьё', when: monHide, minutes: 30, terminal: true, goto: 'c24_a_room',
        outcomes: [
          { id: 'cellar', when: v('w.c23_fuel_spot', 'cellar'), text: 'Канистра за ящиками в подвале. Ты принюхиваешься: бензином пахнет на весь подвал. Собака учует. Перепрятывать некогда и некуда.', effects: [set24('ap', 'check')] },
          { id: 'ok', text: 'Всё на месте. Половица в швейной лежит ровно. В поле у бузины снег не тронут.', effects: [set24('ap', 'check')] },
        ], effects: [until24(9, 0)] },
      { id: 'c24_ap_chain', label: 'Обмотать ворота цепью и повесить замок', when: monShut, minutes: 20, terminal: true, goto: 'c24_a_room', ambientDuring: snow24,
        text: 'Цепь холодная, тяжёлая, в ржавчине. Ты обматываешь створки два раза и защёлкиваешь замок. Нина смотрит с крыльца и молчит.', effects: [set24('ap', 'chain'), until24(8, 50)] },
      { id: 'c24_ap_people', label: 'Пересчитать людей и проверить, кто что скажет', minutes: 30, terminal: true, goto: 'c24_a_room',
        text: 'Нина, Эва, вы двое. Остальные — кто где. Ты повторяешь каждому одно и то же: говорить мало, правду, по-немецки, медленно. Эва кивает. Нина закатывает глаза.', effects: [set24('ap', 'people'), until24(9, 0)] },
    ] }),

  A({ id: 'c24_a_room', title: 'Комната Оле', camp: house14,
    text: [
      { text: 'В комнате Оле под самой крышей пахнет пылью и машинным маслом. Ты {m:поднялся|поднялась} сюда за ящиком для бумаг. За сундуком, у стены, — узкий железный шкаф, армейский, крашенный в зелёный.' },
      { text: 'На дверце висит замок с четырьмя кольцами. На кольцах — буквы. Сейчас набрано «AAAA».' },
      { text: 'До десяти минут сорок.' },
      { when: v('$.c24_ap', 'check'), text: 'Тайники ты {m:проверил|проверила}. Всё на месте. Пока.' },
    ],
    actions: tryActions('c24_ar') }),

  A({ id: 'c24_a_lock2', title: 'Ещё раз', camp: house14,
    text: [
      { text: 'Кольца тугие, холодные. Внизу хлопает дверь, Нина зовёт Эву.' },
      { text: 'Часы на руке показывают, что Брандт уже где-то на дороге.' },
    ],
    actions: tryActions('c24_al') }),

  A({ id: 'c24_a_after', title: 'После обыска', camp: yard14, ambient: snow24,
    text: [
      { text: 'Трактор уходит к соседнему двору. Во дворе следы сапог и собачьих лап, до самого курятника. Дверь сарая распахнута.' },
      { when: leoHere, text: 'Лео стоит у ворот в валенках Хенрике и смотрит туда, куда увели Маркуса. Не плачет. Просто стоит.' },
      { when: not(leoHere), text: 'Нина собирает у курятника рассыпанное зерно, по зёрнышку, в ладонь.' },
      { when: not(monShut), text: 'В доме всё сдвинуто: ящики выдвинуты, одеяла скомканы, банки на полках переставлены. Чужие руки трогали всё.' },
      { when: v('$.c24_bs', 'ask'), text: 'Брандт так и не ответил тебе, что делают с переболевшими в Люнебурге. Только посмотрел, долго, и закрыл папку.' },
      { when: v('$.c24_bs', 'none'), text: '«У нас никто не болел», — сказал{m:|а} ты. Брандт записал это, не поднимая глаз.' },
    ],
    actions: [
      { id: 'c24_aa_leo', label: 'Подойти к Лео и сесть рядом на корточки', when: leoHere, minutes: 20, terminal: true, goto: 'c24_a_lunch', ambientDuring: snow24,
        text: '— Kommt er wieder? — спрашивает Лео, не глядя на тебя. Он вернётся?\n\nТы говоришь, что Маркус не болен, и что это видно по руке, и что через несколько дней его отпустят. Ты сам{m:|а} не знаешь, правда ли это. Лео кивает и берёт тебя за рукав.', effects: [set24('aa', 'leo'), npc('c12_leo', 2), until24(11, 30)] },
      { id: 'c24_aa_track', label: 'Пройти по следам дружины: что унесли из сарая', minutes: 25, terminal: true, goto: 'c24_a_lunch', ambientDuring: snow24,
        text: 'Следы сапог идут от сарая к трактору. В сарае не хватает двух лопат и мотка проволоки. И мешка с овсом для кур, который стоял у двери. Это не по бумаге. Это просто взяли.', effects: [set24('aa', 'track'), w24('brigade_took', true), until24(11, 30)] },
      { id: 'c24_aa_tidy', label: 'Прибрать то, что разбросали', minutes: 40, activity: 'light', terminal: true, goto: 'c24_a_lunch',
        text: 'Ящики в погребе, одежда в шкафах, сено в сарае. Дружинники не ломали, только переворачивали. Яблок в ящике стало на шесть меньше.', effects: [set24('aa', 'tidy'), until24(11, 45)] },
      { id: 'c24_aa_nina', label: 'Помочь Нине с зерном', when: not(leoHere), minutes: 25, terminal: true, goto: 'c24_a_lunch', ambientDuring: snow24,
        text: 'Вы собираете зерно молча. Нина говорит только один раз:\n\n— Овчарку звали Хассо. Я слышала. Хорошая собака. Она не виновата.', effects: [set24('aa', 'nina'), npc('c7_nina', 1), until24(11, 30)] },
    ] }),

  A({ id: 'c24_a_lunch', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед: суп и хлеб. {B} ушла в деревню с Кёлер, за пайком.' },
      { text: 'Суп жидкий, но горячий. Нина ест быстро, не поднимая головы, и уходит, не дожидаясь чая.' },
    ],
    actions: [
      { id: 'c24_al2_eat', label: 'Поесть горячего', minutes: 25, terminal: true, goto: 'c24_y_a_hen', ...tableOnly,
        text: 'Суп жидкий, но горячий. Ты ешь и смотришь на пустую лавку у печи.', effects: [set24('al2', 'eat'), meal('eat'), until24(13, 15)] },
      { id: 'c24_al2_nap', label: 'Поесть и лечь на час', minutes: 30, terminal: true, goto: 'c24_y_a_hen', ...tableOnly,
        text: 'Ты засыпаешь сразу. Тебе ничего не снится.', effects: [set24('al2', 'nap'), meal('eat'), until24(13, 0), until24(14, 0, true)] },
      { id: 'c24_al2_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c24_y_a_hen',
        text: 'Ты пьёшь чай стоя. Есть не хочется.', effects: [set24('al2', 'tea'), until24(12, 45)] },
    ] }),

  A({ id: 'c24_a_jannes', title: 'Яннес', camp: yard14, ambient: snow24,
    text: [
      { text: 'После обеда приходит Яннес. Он принёс инструменты в старой сумке от противогаза.' },
      { text: '— Brandt hat mich auch aufgeschrieben. Für die Schule. Ab Mittwoch. — Он пожимает плечами. — Mutter sagt: geh. Wenigstens gibt es da Essen.\n\nБрандт и меня записал. Для школы. Со среды. Мать говорит: иди. Там хотя бы кормят.' },
      { text: 'Лицо у Яннеса серое после утра у насыпи, но спокойное. Руки он держит в карманах, чтобы не было видно мозолей.' },
      { when: v('$.c24_al2', 'nap'), text: 'После часа сна голова ясная, но плечо ноет от утренней лопаты.' },
      { when: v('$.c24_al2', 'tea'), text: 'Чай согрел, но в животе пусто. Ты стараешься об этом не думать.' },
    ],
    actions: [
      { id: 'c24_aj_pump', label: 'Починить с ним насос', when: not(flag('w.c22_pump_fixed')), minutes: 60, activity: 'moderate', terminal: true, goto: 'c24_a_car', ambientDuring: snow24,
        text: 'Яннес разбирает насос быстрее, чем ты успеваешь подать ключ. Манжета из голенища, капля масла, затянуть. Третий качок — и вода идёт толстой ледяной струёй.\n\n— Elektriker, — говорит Яннес. — Hätte ich werden sollen.\n\nЭлектриком. Должен был стать.', effects: [set24('aj', 'pump'), w24('pump_fixed', true), npc('c14_jannes', 2), until24(15, 0)] },
      { id: 'c24_aj_school', label: 'Спросить, что он знает про школу', minutes: 30, terminal: true, goto: 'c24_a_car',
        text: '— Sechs Betten. Infusionsständer. Und eine Liste an der Tür. — Яннес смотрит в сторону. — Mutter steht drauf. Als Köchin. Und ich als Träger.\n\nШесть кроватей. Стойки для капельниц. И список на двери. Мать там. Поварихой. А я — носильщиком.', effects: [set24('aj', 'school'), w24('school_known', true), until24(14, 30)] },
      { id: 'c24_aj_ute', label: 'Спросить, как Уте после утра', minutes: 20, terminal: true, goto: 'c24_a_car',
        text: '— Sie schläft. Zum ersten Mal seit Mittwoch. — Яннес улыбается углом рта. — Und sie hat gesagt, ich soll euch was bringen. Aber wir haben nichts.\n\nСпит. Первый раз со среды. И сказала, чтобы я вам что-нибудь принёс. Но у нас ничего нет.\n\nОн всё-таки оставляет на крыльце три луковицы.', effects: [set24('aj', 'ute'), { place: 'c24_onion', at: 'c3_farm_stock', qty: 3 }, npc('c14_jannes', 1), until24(14, 20)] },
    ] }),

  A({ id: 'c24_a_car', title: 'Corsa', camp: yard14, ambient: snow24,
    text: [
      { text: 'Corsa стоит под навесом, на крыше снег. Дружинники открывали лючок бензобака: крышка не закручена до конца.' },
      { when: battery, text: 'Под капотом пустое место там, где был аккумулятор. Он в подвале, под старым пальто.' },
      { text: 'Завтра ты едешь в Люнебург с фургоном прачечной. Машина остаётся.' },
    ],
    actions: [
      { id: 'c24_ac_back', label: 'Поставить аккумулятор обратно', when: battery, minutes: 30, activity: 'moderate', terminal: true, goto: 'c24_a_fox',
        text: 'Клеммы, гайки, тряпка. Мотор схватывает со второго раза. Ты глушишь его через минуту: бензин дороже, чем звук.', effects: [set24('ac', 'back'), w24('battery_back', true), until24(15, 40)] },
      { id: 'c24_ac_cap', label: 'Закрутить крышку и проверить уровень', minutes: 15, terminal: true, goto: 'c24_a_fox',
        text: 'Ты закручиваешь крышку до щелчка. Стрелка на приборке там же, где была в субботу. Не отлили. Пока.', effects: [set24('ac', 'cap'), until24(15, 25)] },
      { id: 'c24_ac_teach', label: 'Позвать Нину и показать, как заводить', minutes: 30, terminal: true, goto: 'c24_a_fox',
        outcomes: [
          { id: 'nobat', when: battery, text: 'Нина садится за руль, кладёт руки на десять и два, как учил отец. Заводить нечего: аккумулятор в подвале. Ты показываешь всё остальное. Сцепление, передачи, ручник. Она запоминает с первого раза.', effects: [set24('ac', 'teach'), w24('nina_drives', true), npc('c7_nina', 2)] },
          { id: 'ok', text: 'Нина садится за руль, кладёт руки на десять и два. Мотор схватывает. Она проезжает два метра вперёд и два назад, не заглохнув, и глушит сама.\n\n— Папа учил на парковке у «Лидла», — говорит она. — Я помню.', effects: [set24('ac', 'teach'), w24('nina_drives', true), npc('c7_nina', 2)] },
        ], effects: [until24(15, 40)] },
    ] }),

  A({ id: 'c24_a_dusk', title: 'Сумерки', camp: yard14, ambient: snow24,
    text: [
      { text: 'Темнеет рано. Снег снова идёт, мелкий, косой.' },
      { when: v('$.c24_cabinet', 'open'), text: 'Шкаф Оле наверху стоит открытый. Ты думаешь, что завтра увидишь его хозяина и придётся сказать, что ты в нём рылся.' },
      { when: v('$.c24_cabinet', 'left'), text: 'Шкаф Оле наверху так и стоит за сундуком. Завтра ты увидишь его хозяина. Можно будет спросить слово.' },
      { text: 'Завтра Люнебург. Оле, Хенрике, Алерс. Ты не знаешь, что скажешь. Вы ещё решите это вдвоём.' },
      { text: 'Где-то у колонии коротко тявкает лиса, два раза. Куры в курятнике беспокоятся.' },
      { text: 'На краю поля, у лесополосы, кто-то стоит. Не двигается. В сумерках не разобрать, кто: человек или столб, которого там раньше не было.' },
    ],
    actions: [
      { id: 'c24_ad_watch', label: 'Подняться к окну Оле и посмотреть в бинокль на дорогу', when: { has: 'c24_binoculars' }, minutes: 20, terminal: true, goto: 'c24_supper',
        text: 'В бинокль видно далеко. Трактор Брандта у дальнего двора. Дымок над пекарней Кёлер. На краю поля, у лесополосы, кто-то стоит. Белое пятно. Неподвижно. Смотрит на хутор.', effects: [set24('ad', 'watch'), w24('saw_watcher', true), until24(17, 50)] },
      { id: 'c24_ad_go', label: 'Взять топор и сходить посмотреть, кто там', minutes: 30, activity: 'moderate', risky: true, terminal: true, goto: 'c24_supper', ambientDuring: snow24,
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'agility'], difficulty: 3, uses: ['mobility'] }, text: 'Человек. Солдат, в зимней форме, без шапки. Ремень автомата на плече, автомата нет. Он стоит лицом к лесу и поворачивается на скрип снега слишком медленно. Ты успеваешь. На поясе у него фляга и подсумок с бинтами. Нашивку с фамилией не прочесть: она вся в бурой корке.', effects: [set24('ad', 'go'), w24('soldier', 'killed'), { give: 'bandages' }] },
          { id: 'slip', text: 'Человек. Солдат, в зимней форме, без шапки. Он поворачивается раньше, чем ты думал{m:|а}, и идёт на тебя, проваливаясь в снег. Ты бьёшь, промахиваешься, топор вязнет в сугробе. Он падает на тебя всем весом. Ты выворачиваешься, бьёшь снизу, ещё и ещё. Встаёшь весь в снегу. Плечо ноет.', effects: [set24('ad', 'slip'), w24('soldier', 'killed'), { injure: 'bruise', site: 'rightArm', severity: 2 }, { body: 'stress', delta: 6 }] },
        ], effects: [until24(17, 30)] },
      { id: 'c24_ad_wood', label: 'Натаскать дров в сени на ночь', minutes: 30, activity: 'moderate', terminal: true, goto: 'c24_supper', ambientDuring: snow24,
        text: 'Шесть охапок. Дрова мокрые сверху, сухие внутри. Сени пахнут смолой.', effects: [set24('ad', 'wood'), until24(17, 50)] },
      { id: 'c24_ad_korn', label: 'Глотнуть из фляги Оле: за него', when: { has: 'c24_korn' }, minutes: 10, terminal: true, goto: 'c24_supper',
        text: 'Корн обжигает горло. Ты закашливаешься. Нина смотрит с крыльца и качает головой, совсем как Хенрике.', effects: [set24('ad', 'korn'), { body: 'stress', delta: -3 }, until24(17, 50)] },
      { id: 'c24_ad_sit', label: 'Посидеть на крыльце', minutes: 20, terminal: true, goto: 'c24_supper', ambientDuring: snow24,
        text: 'Снег падает на ладони и тает. Из дома пахнет картошкой.', effects: [set24('ad', 'sit'), { body: 'stress', delta: -1 }, until24(17, 50)] },
    ] }),
];
