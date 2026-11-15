import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { S26, brandtByB, jest26, set26, snow26, until26, w26 } from './point26';

// Участок 26, дополнение (проверка объёма 15.11). A: у ворот фрау Тимм — отклик дороги из 25-й; Нина просит научить стрелять.
// B: утро после человека у ворот; ребёнок с жаром в пункте (Зандер у Брандта); банки на чердаке, если день дома.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S26({ ...scene, for: 'any', chapter: 'ch3' });
const lullau = 'c26_lullau';
const road = (x: string): Cond => v('w.c25_road', x);
const gun: Cond = any({ stocked: 'c19_flinte', qty: 1, at: 'c3_farm_stock' }, { has: 'c19_flinte' });
const afterPoint = [{ id: 'b', when: brandtByB, goto: 'c26_b_brandt' }, { id: 'w', goto: 'c26_b_walk' }];

export const day26EScenes: Scene[] = [
  X({ id: 'c26_a_anke', title: 'Ворота в Люллау', location: lullau, camp: { at: lullau, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: snow26,
    text: [
      { when: road('lift'), text: 'У ворот в Люллау тебя встречает мальчик в шапке с помпоном. Йонас. Он узнаёт тебя первым и кричит в дом: «Mama! Der vom Wäschewagen!» Тот, из прачечного фургона. Анке выходит на крыльцо, вытирая руки о передник.' },
      { when: road('letter'), text: 'У ворот в Люллау никого. Записка Анке, на обороте чека, лежит у тебя в кармане со вчерашнего вечера: «Timm, Lüllau. Anke und Jonas leben. Sind in Pattensen, im Graben. Holt uns».' },
      { when: road('drove'), text: 'У ворот в Люллау стоит мальчишка лет десяти и смотрит на дорогу со стороны Паттензена. Он спрашивает тебя, не видел ли ты по пути красный «Поло». Там его тётя Анке и маленький Йонас. Они едут со вчерашнего дня.' },
      { when: not(flag('w.c25_road')), text: 'У ворот в Люллау тихо. Собака на цепи смотрит на тебя и не лает: бережёт голос на мороз.' },
    ],
    actions: [
      { id: 'c26_an_thanks', label: 'Принять благодарность', when: road('lift'), minutes: 20, terminal: true, goto: 'c26_a_timm',
        text: 'Анке обнимает тебя, неловко, через куртку. Фрау Тимм выходит следом, смотрит на тебя иначе, чем смотрят на торговца.\n\n— Du hast meine Schwiegertochter mitgenommen. Das vergesse ich nicht.\n\nТы привёз мою невестку. Этого я не забуду.', effects: [set26('an', 'thanks'), w26('timm_owes', true), until26(9, 50)] },
      { id: 'c26_an_jonas', label: 'Спросить Йонаса, как ему на новом месте', when: road('lift'), minutes: 20, terminal: true, goto: 'c26_a_timm',
        text: 'Йонас показывает тебе телёнка в хлеву, кошку с котятами и место, где бабушка прячет печенье. Анке смеётся впервые, наверное, за неделю. Фрау Тимм стоит в дверях хлева и молчит. Потом кивает тебе: заходи.', effects: [set26('an', 'jonas'), w26('timm_owes', true), until26(9, 55)] },
      { id: 'c26_an_note', label: 'Отдать фрау Тимм записку', when: road('letter'), minutes: 20, terminal: true, goto: 'c26_a_timm',
        text: 'Фрау Тимм читает записку дважды. Потом молча снимает с гвоздя ключи от трактора и кричит в хлев: «Heiner! Pattensen! Sofort!» Хайнер, работник, выбегает на ходу натягивая куртку. Трактор уезжает через пять минут.\n\n— Wenn sie lebt, — говорит фрау Тимм, глядя ему вслед, — dann wegen dir.\n\nЕсли она жива, то из-за тебя.', effects: [set26('an', 'note'), { take: 'c25_timm_note' }, w26('timm_owes', true), until26(9, 50)] },
      { id: 'c26_an_truth', label: 'Сказать правду: видел{m:|а}. Не остановились', when: road('drove'), minutes: 20, terminal: true, goto: 'c26_a_timm',
        text: 'Ты говоришь, где и когда. Мальчишка бежит в дом. Через пять минут со двора выезжает трактор, за рулём работник, рядом фрау Тимм в стёганом жилете. Она проезжает мимо тебя и не смотрит. Возвращается она через два часа, с невесткой и ребёнком в прицепе. Торговаться с тобой будет её работник.', effects: [set26('an', 'truth'), w26('timm_cold', true), until26(9, 50)] },
      { id: 'c26_an_lie', label: 'Сказать: не видел{m:|а}', when: road('drove'), minutes: 10, terminal: true, goto: 'c26_a_timm',
        text: 'Мальчишка кивает и снова смотрит на дорогу. Ты проходишь во двор. До самого вечера он стоит у ворот.', effects: [set26('an', 'lie'), { body: 'stress', delta: 5 }, until26(9, 40)] },
      { id: 'c26_an_in', label: 'Войти во двор', when: not(flag('w.c25_road')), minutes: 10, terminal: true, goto: 'c26_a_timm',
        text: 'Ты толкаешь калитку. Собака провожает тебя взглядом.', effects: [set26('an', 'in'), until26(9, 40)] },
    ] }),

  X({ id: 'c26_a_nina', title: 'Нина и ружьё', camp: yard14, ambient: snow26, onEnter: [until26(15, 50)],
    text: [
      { text: 'Нина ждёт тебя у сарая. Руки в карманах, подбородок вперёд: так она стоит, когда репетировала, что скажет.' },
      { text: '— Научи меня стрелять. Из ружья. Если вас нет, а они придут, я буду стоять с вилами? Эва старая. Хенрике… — Она не договаривает.' },
      { when: not(gun), text: 'Ружья в доме сейчас нет. Но Нина об этом не знает. Или знает и всё равно просит.' },
    ],
    actions: [
      { id: 'c26_ni_teach', label: 'Научить: заряжать, держать, стрелять по мишени за хлевом', when: gun, minutes: 60, terminal: true, goto: 'c26_a_home', ambientDuring: snow26,
        text: 'Два патрона из четырёх. Ты ставишь на пень за хлевом пустую банку. Показываешь, как переламывать стволы, как прижимать приклад, чтобы не выбило плечо. Первый выстрел Нина делает с закрытыми глазами. Второй — с открытыми. Банка падает. Нина не радуется. Она очень серьёзно кивает сама себе.', effects: [set26('ni', 'teach'), w26('nina_gun', 'taught'), { unstock: 'c19_shells', qty: 2, at: 'c3_farm_stock' }, npc('c7_nina', 2, 'c26_taught_gun'), until26(16, 50)] },
      { id: 'c26_ni_safe', label: 'Показать только, как его не трогать и где патроны', minutes: 40, terminal: true, goto: 'c26_a_home',
        text: 'Ты объясняешь: ружьё всегда разряжено, патроны отдельно, ствол — в пол. Если придут — не стрелять, а звонить в колокол у ворот и бежать на чердак. Нина слушает, запоминает. Ей этого мало. Но она кивает.', effects: [set26('ni', 'safe'), w26('nina_gun', 'safety'), until26(16, 30)] },
      { id: 'c26_ni_no', label: 'Отказать: тебе пятнадцать', minutes: 20, terminal: true, goto: 'c26_a_home',
        text: '— Мне пятнадцать, — повторяет Нина. — А им сколько было, тем, на заборе в колонии?\n\nОна уходит в дом и до ужина не разговаривает ни с кем.', effects: [set26('ni', 'no'), w26('nina_gun', 'no'), npc('c7_nina', -2), until26(16, 10)] },
    ] }),

  X({ id: 'c26_b_shed', title: 'Сарай', camp: yard14, ambient: snow26,
    text: [
      { text: 'Утром засов на сарае задвинут, как ты его {m:оставил|оставила}. Внутри пусто. Окошко под крышей открыто: он ушёл через него, ночью.' },
      { text: 'Одеяло сложено ровным квадратом. На нём кружка, вымытая снегом. Рядом с кружкой — птица, вырезанная из полена перочинным ножом. Сова, маленькая, с круглыми глазами. Яйца в курятнике все на месте.' },
    ],
    actions: [
      { id: 'c26_bsh_keep', label: 'Взять сову себе', minutes: 15, terminal: true, goto: 'c26_b_morning',
        text: 'Сова тёплая от дерева. Ты кладёшь её в карман куртки и время от времени трогаешь, {m:сам|сама} не зная зачем.', effects: [set26('bsh', 'keep'), { give: 'c25_owl' }, until26(6, 45)] },
      { id: 'c26_bsh_nina', label: 'Отдать сову Нине', when: ninaFarm, minutes: 15, terminal: true, goto: 'c26_b_morning',
        text: 'Нина вертит сову в пальцах и ставит её на подоконник у своей раскладушки. «Он был хороший, — говорит она. — Плохие не вырезают сов».', effects: [set26('bsh', 'nina'), npc('c7_nina', 1, 'c26_got_owl'), until26(6, 45)] },
      { id: 'c26_bsh_track', label: 'Посмотреть, куда ведут следы', minutes: 20, terminal: true, goto: 'c26_b_morning', ambientDuring: snow26,
        text: 'Следы идут от сарая через поле к шоссе и дальше на юг, к Ханштедту. Ровные, неторопливые. Человек шёл, а не бежал. Сову ты оставляешь на одеяле: вдруг вернётся за ней.', effects: [set26('bsh', 'track'), until26(6, 50)] },
    ] }),

  X({ id: 'c26_b_child', title: 'Мальчик с жаром', location: jest26, camp: { at: jest26, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: { tempC: 14, outdoor: false, wet: false },
    text: [
      { text: 'В десять в дверь пункта вбегает женщина с мальчиком лет четырёх на руках. Он горячий, как печка, и не плачет, только смотрит. Доктор Зандер в школе у Брандта, на совещании, до полудня.' },
      { text: 'На полке под замком сироп от жара. Ключ Зандер оставила тебе: «Für den Notfall». На крайний случай. Бутылка одна, и она последняя.' },
      { when: v('w.c25_stranger', 'point'), text: 'На раскладушке у окна кашляет вчерашний человек из Харбурга. Он тебя узнаёт и кивает.' },
    ],
    actions: [
      { id: 'c26_bc_syrup', label: 'Открыть шкаф и дать сироп', minutes: 120, terminal: true, outcomes: afterPoint,
        text: 'Ты отмеряешь по весу, как написано на этикетке, и ещё раз пересчитываешь. Мальчик глотает и морщится. Через час жар спадает, он засыпает у матери на руках. Мать целует тебе руки, ты их отдёргиваешь.\n\nЗандер возвращается в полдень, смотрит на открытый шкаф, на бутылку, на мальчика. «Richtig», — говорит она. Правильно. И записывает в журнал твоё имя.', effects: [set26('bc', 'syrup'), w26('child', 'syrup'), until26(12, 0)] },
      { id: 'c26_bc_run', label: 'Бежать в школу за Зандер', minutes: 120, terminal: true, outcomes: afterPoint, ambientDuring: snow26,
        text: 'Ты бежишь через площадь, без куртки. В школе ты врываешься в класс, где Брандт что-то чертит на доске. Он поворачивается, лицо каменное. Зандер встаёт без слова и идёт за тобой. Мальчику она даёт сироп сама и полчаса держит его запястье. Брандт потом передаёт через дружинника: в следующий раз стучать.', effects: [set26('bc', 'run'), w26('child', 'zander'), npc('c16_brandt', -1, 'c26_b_burst_in'), until26(12, 0)] },
      { id: 'c26_bc_cool', label: 'Обтирать прохладной водой и ждать врача', minutes: 120, terminal: true, outcomes: afterPoint,
        text: 'Мокрое полотенце, запястья, шея, подмышки. Снова. Снова. Мальчик хнычет, потом засыпает. Жар держится. В полдень Зандер трогает его лоб, смотрит на тебя и на шкаф с ключом. «Sie hatten den Schlüssel». У вас был ключ. Она не ругает. Она просто даёт сироп сама.', effects: [set26('bc', 'cool'), w26('child', 'waited'), until26(12, 0)] },
    ] }),

  X({ id: 'c26_b_attic', title: 'Чердак', camp: kitchen14,
    text: [
      { text: 'На чердаке, за ящиками с яблоками, Нина находит то, о чём Хенрике, кажется, забыла: полку с банками. Огурцы, тушёнка в стеклянных банках, вишнёвое варенье. На крышках выцветшие даты: 2023, 2024.' },
      { text: 'Двенадцать банок. Шесть с тушёнкой.' },
    ],
    actions: [
      { id: 'c26_ba2_stock', label: 'Снести всё в кладовку и записать', minutes: 60, terminal: true, goto: 'c26_b_afternoon',
        text: 'Ты носишь по две банки, Нина считает вслух. На листке на двери кладовки появляется новая строка: «Tushonka 6». Нина пишет по-русски, крупно.', effects: [set26('ba2', 'stock'), w26('jars', true), { place: 'c26_jar', at: 'c3_farm_stock', qty: 6 }, until26(12, 0)] },
      { id: 'c26_ba2_koehler', label: 'Две банки отнести Кёлер: у неё внуки', minutes: 90, terminal: true, goto: 'c26_b_afternoon', ambientDuring: snow26,
        text: 'Фрау Кёлер открывает не сразу. Увидев банки, долго молчит. Потом берёт, прижимает к груди и говорит: «Henrike hat immer gesagt, ihr seid anständig». Хенрике всегда говорила, что вы порядочные. Остальное ты сносишь в кладовку.', effects: [set26('ba2', 'koehler'), w26('jars', true), w26('jars_koehler', true), { place: 'c26_jar', at: 'c3_farm_stock', qty: 4 }, npc('c3_koehler', 3, 'c26_got_jars'), until26(12, 30)] },
      { id: 'c26_ba2_leave', label: 'Не трогать: это запас Хенрике, пусть она решит', minutes: 30, terminal: true, goto: 'c26_b_afternoon',
        text: 'Ты накрываешь полку мешковиной. Нина спорит, потом соглашается: «Её банки — её решать». Вы спускаетесь. Банки остаются ждать хозяйку.', effects: [set26('ba2', 'leave'), w26('jars_left', true), npc('henrike', 1, 'c26_left_jars'), until26(11, 0)] },
    ] }),
];
