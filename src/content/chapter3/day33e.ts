import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import {
  S33, eldersCome, eldersInHouse, frost33, garden33, okaforComes, set33, until33, w33, yardDry33,
} from './point33';

// Участок 33, дополнение (проверка объёма 15.11). A: вода — продолжение выбранного способа (утепление, патруль, чем топить);
// место для стариков; вор у поленницы. B: лекарства фрау Кёрнер; Нина отдаёт свою раскладушку. Отклики — в 34–35.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S33({ ...scene, for: 'any', chapter: 'ch3' });
const pump = (x: string): Cond => v('w.c33_pump', x);
const fixRoute: Cond = any(pump('fixed'), pump('half'));
const medbagHome: Cond = { stocked: 'c30_medbag', qty: 1, at: 'c3_farm_stock' };

export const day33EScenes: Scene[] = [
  X({ id: 'c33_a_pump2', title: 'Вода, полдень', camp: yardDry33, ambient: frost33,
    text: [
      { when: fixRoute, text: 'Трубу надо закрыть на всю зиму, иначе через ночь всё повторится. Чем — решать сейчас, пока она тёплая.' },
      { when: pump('ute'), text: 'На обратном пути от Уте у поворота стоит патруль дружины. Двое, с повязками. Один стучит по бочке: полная. «Wasser? Woher? Für wen?» Вода? Откуда? Кому?' },
      { when: pump('snow'), text: 'Плита съедает дрова быстрее, чем тает снег. К полудню в поленнице дыра. Хенрике смотрит на неё, потом на старый забор у огорода.' },
    ],
    actions: [
      { id: 'c33_ap2_manure', label: 'Обложить соломой и навозом: тепло до весны', when: fixRoute, minutes: 30, activity: 'heavy', terminal: true, goto: 'c33_a_elders',
        text: 'Солома, сверху навоз из хлева, сверху мешковина и доски. Колонка стоит в куче, похожей на маленький стог, и пахнет на весь двор. Хенрике довольна. Фрау Петерсен закрывает окно.', effects: [set33('ap2', 'manure'), w33('pump_lasts', true), until33(12, 0)] },
      { id: 'c33_ap2_mattress', label: 'Обмотать старым матрасом с чердака', when: fixRoute, minutes: 30, terminal: true, goto: 'c33_a_elders',
        text: 'Матрас пролежал на чердаке лет двадцать. Ты обматываешь им трубу и стягиваешь проволокой. Выглядит смешно. Держит ли — покажет ночь.', effects: [set33('ap2', 'mattress'), until33(11, 45)] },
      { id: 'c33_ap2_none', label: 'Оставить как есть: если что, отогреем снова', when: fixRoute, minutes: 15, terminal: true, goto: 'c33_a_elders',
        text: 'Ты складываешь лампу и инструмент. Колонка качает. Пока.', effects: [set33('ap2', 'none'), w33('pump_refreeze', true), until33(11, 30)] },
      { id: 'c33_ap2_truth', label: 'Сказать прямо: от Уте, для хутора, для стариков из Гамбурга', when: pump('ute'), minutes: 30, terminal: true, goto: 'c33_a_elders',
        text: 'Дружинник кивает, пишет что-то в блокнот. «Lüdemann. Gut. Brandt fragt jeden Tag, wer wie viele Leute hat». Брандт каждый день спрашивает, у кого сколько людей. Теперь он знает про вас больше.', effects: [set33('ap2', 'truth'), w33('patrol_noted', true), until33(12, 0)] },
      { id: 'c33_ap2_share', label: 'Налить им по ведру: у них тоже замёрзло', when: pump('ute'), minutes: 30, terminal: true, goto: 'c33_a_elders',
        text: 'Вы наливаете два ведра из бочки в их бидоны. Дружинники благодарят, один жмёт тебе руку. Дома в бочке на десять литров меньше. Зато про вас в блокноте ничего не написано.', effects: [set33('ap2', 'share'), { unstock: 'water_l', qty: 10, at: 'c3_farm_stock' }, npc('c16_brandt', 1), until33(12, 0)] },
      { id: 'c33_ap2_drive', label: 'Не останавливаться: проехать мимо, не отвечая', minutes: 20, when: pump('ute'), terminal: true, goto: 'c33_a_elders',
        text: 'Ты не сбавляешь хода. Дружинник отскакивает от колеса и кричит что-то вслед. Вечером Лукас приносит бумажку от Брандта: «Wasserentnahme melden». Сообщать о заборе воды.', effects: [set33('ap2', 'drive'), w33('brandt_note', true), npc('c16_brandt', -1), until33(11, 45)] },
      { id: 'c33_ap2_fence', label: 'Разобрать старый забор у огорода', when: pump('snow'), minutes: 30, activity: 'moderate', terminal: true, goto: 'c33_a_elders',
        text: 'Штакетник сухой и горит жарко. Ты ломаешь его ногой, пролёт за пролётом. Хенрике выходит, смотрит, как ты ломаешь, и уходит в дом. Забор ставил её муж. Она ничего не говорит.', effects: [set33('ap2', 'fence'), w33('fence_burned', true), npc('henrike', -1), until33(12, 0)] },
      { id: 'c33_ap2_cupboard', label: 'Разбить старый шкаф с чердака', when: pump('snow'), minutes: 30, activity: 'moderate', terminal: true, goto: 'c33_a_elders',
        text: 'Шкаф дубовый, тяжёлый, колется плохо. Внутри, на верхней полке, ты находишь свёрток: детские рисунки, подписанные «Ole, 7 Jahre». Ты откладываешь их отдельно и отдаёшь Хенрике. Шкаф горит долго и ровно.', effects: [set33('ap2', 'cupboard'), w33('ole_drawings', true), npc('henrike', 1), until33(12, 0)] },
      { id: 'c33_ap2_wait', label: 'Остановиться: воды на сегодня хватит, дрова нужнее', when: pump('snow'), minutes: 20, terminal: true, goto: 'c33_a_elders',
        text: 'Ты гасишь плиту. Воды в бочке на день. Завтра снова снег. Хенрике кивает: дрова нужнее.', effects: [set33('ap2', 'wait'), until33(11, 30)] },
    ] }),

  X({ id: 'c33_a_elders', title: 'Место для стариков', camp: house14, onEnter: [until33(12, 0)],
    text: [
      { when: eldersInHouse, text: 'Хенрике отводит тебя в сторону. Комната наверху, где живёте вы, — единственная тёплая, кроме кухни. Старикам с лестницей в их возрасте лучше там. Она не просит. Она просто говорит, как есть.' },
      { when: all(eldersCome, not(eldersInHouse)), text: 'Домик Уте в колонии стоит холодный с утра. Буржуйка там дымит в комнату, труба забита. Если старики будут жить там, её надо чинить сегодня.' },
      { when: not(eldersCome), text: 'Стариков из Бармбека нет: им не нашлось места. Хенрике собирает мешок картошки для Винзена и ставит у двери, на следующую оказию.' },
    ],
    actions: [
      { id: 'c33_ae2_give', label: 'Отдать им свою комнату, самим перебраться на сеновал', when: eldersInHouse, minutes: 40, terminal: true, goto: 'c33_a_talk',
        text: 'Ты переносишь ваши вещи на сеновал над хлевом. Снизу тепло от коров, пахнет сеном и молоком. Фрау Кёрнер, увидев комнату, плачет и гладит подушку. Петерсен жмёт тебе руку и не отпускает.', effects: [set33('ae2', 'give'), w33('room', 'given'), until33(12, 30)] },
      { id: 'c33_ae2_share', label: 'Уступить им кровать, самим — на полу в той же комнате', when: eldersInHouse, minutes: 45, terminal: true, goto: 'c33_a_talk',
        text: 'Вы стелете себе на полу у печной стены. Тесно, храп Петерсена, кашель фрау Кёрнер. Зато тепло всем. Хенрике кивает: так по-людски.', effects: [set33('ae2', 'share'), w33('room', 'shared'), until33(12, 30)] },
      { id: 'c33_ae2_keep', label: 'Сказать Хенрике: пусть спят на кухне, у печи', when: eldersInHouse, minutes: 30, terminal: true, goto: 'c33_a_talk',
        text: 'Хенрике молчит. Потом стелет старикам на кухне, на лавках у печи. Петерсен говорит, что ему всё равно, лишь бы не спортзал. Фрау Кёрнер ничего не говорит.', effects: [set33('ae2', 'keep'), w33('room', 'kept'), npc('henrike', -1), until33(12, 30)] },
      { id: 'c33_ae2_stove', label: 'Пойти в колонию и прочистить трубу в домике Уте', when: all(eldersCome, not(eldersInHouse)), minutes: 40, activity: 'moderate', terminal: true, goto: 'c33_a_talk', ambientDuring: frost33,
        text: 'Ты лезешь на крышу домика по приставной лестнице и прочищаешь трубу шестом с проволокой. Из трубы вываливается гнездо и ком сажи. Буржуйка начинает тянуть. Фрау Кёрнер садится к ней вплотную и закрывает глаза.', effects: [set33('ae2', 'stove'), w33('garden_stove', true), { move: garden33 }, until33(12, 30)] },
      { id: 'c33_ae2_wood', label: 'Отвезти в колонию санки дров', when: all(eldersCome, not(eldersInHouse)), minutes: 40, activity: 'moderate', terminal: true, goto: 'c33_a_talk', ambientDuring: frost33,
        text: 'Санки, дрова, снег по колено. Буржуйка в домике дымит, но дрова у стариков теперь на неделю. Петерсен складывает их у стены сам, полено к полену.', effects: [set33('ae2', 'wood'), until33(12, 30)] },
      { id: 'c33_ae2_sack', label: 'Добавить в мешок для Винзена банку тушёнки', when: not(eldersCome), minutes: 20, terminal: true, goto: 'c33_a_talk',
        text: 'Хенрике смотрит на банку, потом на тебя, и завязывает мешок. «Für die Alten». Для стариков.', effects: [set33('ae2', 'sack'), until33(12, 30)] },
      { id: 'c33_ae2_none', label: 'Заняться своими делами', when: not(eldersCome), minutes: 20, terminal: true, goto: 'c33_a_talk',
        text: 'Мешок стоит у двери. Ты проходишь мимо него весь день.', effects: [set33('ae2', 'none'), until33(12, 30)] },
    ] }),

  X({ id: 'c33_a_thief', title: 'Поленница', camp: yard14, ambient: frost33, onEnter: [until33(17, 0)],
    text: [
      { text: 'В сумерках у поленницы шевелится тень. Мальчишка лет двенадцати, в куртке не по размеру, набирает дрова в мешок. Набирает быстро и аккуратно, сверху, чтобы не было заметно.' },
      { text: 'Ты его знаешь: это внук фрау Кёлер, Пауль.' },
      { when: v('w.c24_paul', 'work'), text: 'В понедельник после обыска Пауль колол у вас дрова за хлеб. Ты ему тогда сказал{m:|а}: приходи ещё. Он пришёл. Только не спросил.' },
    ],
    actions: [
      { id: 'c33_at2_let', label: 'Отвернуться: пусть берёт', minutes: 30, terminal: true, goto: 'c33_council',
        text: 'Ты уходишь в дом, громко хлопнув дверью, чтобы он успел. Утром на крыльце стоит банка с вареньем. Без записки.', effects: [set33('at2', 'let'), w33('paul', 'let'), npc('c3_koehler', 1), until33(18, 0)] },
      { id: 'c33_at2_talk', label: 'Подойти и спросить: у вас нет дров?', minutes: 40, terminal: true, goto: 'c33_council', ambientDuring: frost33,
        text: 'Пауль замирает с поленом в руках. Потом говорит быстро, глядя в снег: у бабушки кончились, мама в Люнебурге, отец… он не договаривает. Ты набиваешь ему мешок доверху и помогаешь закинуть на плечо. «Komm morgen wieder. Hacken. Dann ist es nicht geklaut». Приходи завтра. Колоть. Тогда это не воровство.', effects: [set33('at2', 'talk'), w33('paul', 'work'), npc('c3_koehler', 2, 'c33_paul_wood'), until33(18, 0)] },
      { id: 'c33_at2_catch', label: 'Поймать и отвести к бабушке', minutes: 40, terminal: true, goto: 'c33_council', ambientDuring: frost33,
        text: 'Ты берёшь его за шиворот и ведёшь через дорогу. Фрау Кёлер открывает, видит внука и мешок и закрывает лицо руками. Потом отдаёт тебе мешок и говорит, что они справятся. Ты знаешь, что нет.', effects: [set33('at2', 'catch'), w33('paul', 'caught'), npc('c3_koehler', -2), until33(18, 0)] },
    ] }),

  X({ id: 'c33_b_korner', title: 'Таблетки', camp: kitchen14, onEnter: [until33(11, 50)],
    text: [
      { text: 'Фрау Кёрнер сидит на краю кровати, бледная, губы синеватые, и держит руку на груди. Её таблетки от сердца кончились в спортзале, три дня назад. Название она помнит: «Digitoxin». Без них, говорит она спокойно, неделя. Может, две.' },
      { when: okaforComes, text: 'Окафор слушает её пульс по часам и мрачнеет. «У Зандер может не быть. У Красного Креста — может».' },
      { when: medbagHome, text: 'Армейская сумка из кабины грузовика стоит в кладовке. Сердечного в ней нет, только морфин и бинты.' },
    ],
    actions: [
      { id: 'c33_bk_zander', label: 'Сразу идти к Зандер в Йестебург', minutes: 70, terminal: true, goto: 'c33_b_ole', ambientDuring: frost33,
        text: 'Зандер роется в коробке с лекарствами, которые ты {m:привёз|привезла} из Винзена. На дне — одна пластинка, чужой препарат, похожий. «Nicht dasselbe. Aber besser als nichts. Halbe Dosis». Не то же самое. Но лучше, чем ничего. Половину дозы. Ты несёшь пластинку домой в варежке, как живое.', effects: [set33('bk', 'zander'), w33('korner_pills', 'zander'), { move: 'hof_luedemann' }, until33(12, 30)] },
      { id: 'c33_bk_neighbors', label: 'Обойти соседей: у кого-нибудь из стариков есть такие', minutes: 70, terminal: true, goto: 'c33_b_ole', ambientDuring: frost33,
        text: 'Кёлер, Шульце, двор у насыпи. У старика Шульце есть, полпачки, его покойной жены. Он отдаёт, не торгуясь, и говорит: «Sie hätte es so gewollt». Она бы так хотела.', effects: [set33('bk', 'neighbors'), w33('korner_pills', 'neighbors'), until33(12, 30)] },
      { id: 'c33_bk_wait', label: 'Записать название и передать Красному Кресту на следующей неделе', minutes: 30, terminal: true, goto: 'c33_b_ole',
        text: 'Ты пишешь печатными буквами: DIGITOXIN, фрау Кёрнер, хутор Людеманов. Записку кладёшь в карман куртки. Фрау Кёрнер благодарит тебя, как благодарят за то, что уже сделано.', effects: [set33('bk', 'wait'), w33('korner_pills', 'none'), until33(12, 30)] },
    ] }),

  X({ id: 'c33_b_nina', title: 'Раскладушка', camp: house14, onEnter: [until33(16, 30)],
    text: [
      { when: ninaFarm, text: 'Нина складывает свою раскладушку и несёт её к двери. На вопрос, куда, отвечает, не глядя: «Фрау Кёрнер. Ей на полу нельзя, у неё сердце. А я на лавке посплю. Мне пятнадцать».' },
      { when: not(ninaFarm), text: 'В сенях Хенрике сортирует одеяла: на всех не хватает. Двух недостаёт. Она поднимает глаза на тебя.' },
    ],
    actions: [
      { id: 'c33_bn2_let', label: 'Разрешить: это её решение', when: ninaFarm, minutes: 60, terminal: true, goto: 'c33_council',
        text: 'Нина ставит раскладушку у стены в комнате стариков и стелет сама, туго, по-больничному. Фрау Кёрнер смотрит на неё и говорит: «Du bist ein gutes Kind». Ты хороший ребёнок. Нина краснеет до ушей.', effects: [set33('bn2', 'let'), w33('nina_bed', 'given'), npc('c7_nina', 2, 'c33_gave_bed'), until33(18, 0)] },
      { id: 'c33_bn2_own', label: 'Отдать свою подушку и одеяло, чтобы Нине не мёрзнуть на лавке', when: ninaFarm, minutes: 60, terminal: true, goto: 'c33_council',
        text: 'Ты стелешь Нине на лавке свою подушку и одеяло. Она спорит. Потом засыпает первой, ещё до ужина, свернувшись под твоим одеялом. Ночью ты спишь в куртке.', effects: [set33('bn2', 'own'), w33('nina_bed', 'given'), npc('c7_nina', 1), { body: 'fatigue', delta: 4 }, until33(18, 0)] },
      { id: 'c33_bn2_no', label: 'Сказать: нет, ты растёшь, тебе нужно спать нормально', when: ninaFarm, minutes: 40, terminal: true, goto: 'c33_council',
        text: 'Нина ставит раскладушку обратно. Медленно. Фрау Кёрнер ложится на матрас на полу у печи и говорит, что ей так даже удобнее. Нина весь вечер на неё не смотрит.', effects: [set33('bn2', 'no'), npc('c7_nina', -1), until33(18, 0)] },
      { id: 'c33_bn2_blankets', label: 'Отдать своё одеяло', when: not(ninaFarm), minutes: 40, terminal: true, goto: 'c33_council',
        text: 'Хенрике берёт одеяло и кивает. Одного всё равно не хватает. Она достаёт из сундука пальто мужа и кладёт сверху, как одеяло.', effects: [set33('bn2', 'blankets'), until33(18, 0)] },
      { id: 'c33_bn2_wool', label: 'Спросить Уте: может, у неё есть лишние', when: not(ninaFarm), minutes: 60, terminal: true, goto: 'c33_council', ambientDuring: frost33,
        text: 'У Уте лишних нет. Но есть два старых пледа из колонии, побитые молью. Ты несёшь их домой под мышкой. Молью побиты, но тёплые.', effects: [set33('bn2', 'wool'), npc('c14_ute', 1), until33(18, 0)] },
    ] }),
];

// Второй проход (15.11): утро B до приезда стариков — что им постелить.
export const day33LateScenes: Scene[] = [
  X({ id: 'c33_b_rooms', title: 'Постели', camp: house14, onEnter: [until33(8, 0)],
    text: [
      { text: 'До грузовика час. Кровать в комнате наверху одна, а стариков трое. Хенрике стоит посреди комнаты с охапкой простыней и думает вслух: перина, матрас, солома.' },
      { when: eldersCome, text: 'Петерсенам за восемьдесят. У фрау Кёрнер сердце.' },
      { when: not(eldersCome), text: 'Стариков не будет: решили помогать им едой. Но в доме и без них холодные углы, а Окафор, если придёт, тоже где-то должен спать.' },
    ],
    actions: [
      { id: 'c33_br_own', label: 'Отдать свой матрас, себе — солому в мешке', minutes: 50, terminal: true, goto: 'c33_b_arrive',
        text: 'Ты стаскиваешь свой матрас по лестнице. Себе набиваешь мешок соломой из хлева, сухой, колючей. Хенрике смотрит и молча добавляет к соломе своё старое одеяло.', effects: [set33('br', 'own'), w33('b_mattress', 'given'), npc('henrike', 1), until33(9, 0)] },
      { id: 'c33_br_feather', label: 'Уговорить Хенрике достать из сундука перину её матери', minutes: 50, terminal: true, goto: 'c33_b_arrive',
        text: 'Хенрике долго не хочет: перина с приданого, её не доставали тридцать лет. Потом открывает сундук. Перина пахнет лавандой и нафталином. Хенрике взбивает её сама и говорит: «Für die Körner. Die friert am meisten». Для Кёрнер. Она мёрзнет больше всех.', effects: [set33('br', 'feather'), w33('feather_bed', true), until33(9, 0)] },
      { id: 'c33_br_straw', label: 'Набить мешки соломой на всех: тепло и честно', minutes: 60, activity: 'moderate', terminal: true, goto: 'c33_b_arrive',
        text: 'Три мешка, солома, нитки. Ты зашиваешь их большой иглой, как учила Эва. Получаются толстые колючие тюфяки. Лучше, чем пол спортзала.', effects: [set33('br', 'straw'), until33(9, 0)] },
    ] }),
];
