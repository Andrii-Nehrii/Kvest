import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { v } from './point18';
import { S46, farm46, set46, until46, w46, xmas46 } from './point46';

// Участок 46, линия B — Рождество после полудня: корзина в Люллау к Коринне Бар, у младшей, Мии, болит ухо и жар; про Сильвестр
// Коринна слышала от соседей и боится (огонь, толпа — и дети, которые хотят); горка у колонии с Эриком; фрау Ханзен одна у печки
// (вдова, если Отто не пережил ночь оттепели; разговор с Яннесом после Рождества — `w.c44_hansen_talk`); обратно к сумеркам.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S46({ ...scene, for: 'any', chapter: 'ch3' });
const lullau = 'c26_lullau';
const L = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: lullau, camp: { at: lullau, stock: 'c3_farm_stock', rest: false }, safe: true });
const toLullau: Effect = { move: lullau };
const toFarm: Effect = { move: farm46 };
const widow: Cond = v('w.c40_neighbor', 'dead');
const hasAmoxi: Cond = { has: 'c25_amoxi' };
const hasSyrup: Cond = { has: 'c45_kids_meds' };
const home = { tempC: 16, outdoor: false, wet: false };

export const day46BScenes: Scene[] = [
  X({ id: 'c46_b_road', title: 'В Люллау', camp: { at: farm46, stock: 'c3_farm_stock', rest: false }, ambient: xmas46,
    text: [
      { text: 'Хенрике собирает корзину: суп в бидоне, хлеб, полбанки капусты. «Corinna. Und dann zu Frau Hansen. Die sitzt heute allein». Коринне. А потом к фрау Ханзен. Она сегодня одна.' },
      { text: 'До Люллау два километра, последний дом у края поля. Снег, солнце, тишина. На дороге только твои следы и заячьи.' },
    ],
    actions: [
      { id: 'c46_br_walk', label: 'Идти по дороге, не торопясь', minutes: 45, terminal: true, goto: 'c46_b_bahr', ambientDuring: xmas46, activity: 'moderate',
        text: 'Бидон тёплый, ты несёшь его, прижав к животу. Над полем кружит канюк, потом садится на столб и смотрит, как ты идёшь. Так и провожает глазами до самого Люллау.', effects: [set46('br', 'walk'), toLullau, until46(55, 11, 45)] },
      { id: 'c46_br_nina', label: 'Позвать с собой Нину: ей полезно выйти из дома', when: { npc: 'c7_nina', alive: true, at: 'hof_luedemann' }, minutes: 45, terminal: true, goto: 'c46_b_bahr', ambientDuring: xmas46, activity: 'moderate',
        text: 'Нина несёт хлеб и всю дорогу рассказывает про школу в Винзене, куда пойдёт четвёртого, как будто уже там была. Ты слушаешь и думаешь, что она впервые за месяц говорит так много.', effects: [set46('br', 'nina'), w46('b_nina_walk', true), toLullau, until46(55, 11, 45)] },
      { id: 'c46_br_field', label: 'Срезать через поле: короче, но снег глубже', minutes: 40, terminal: true, goto: 'c46_b_bahr', ambientDuring: xmas46, activity: 'heavy',
        text: 'Снег по колено, под ним мёрзлая пахота. Ты проваливаешься, выбираешься, бидон плещет. До Люллау доходишь с мокрыми коленями, но раньше.', effects: [set46('br', 'field'), { body: 'fatigue', delta: 5 }, toLullau, until46(55, 11, 40)] },
    ] }),

  L({ id: 'c46_b_bahr', title: 'Бары', ambient: home, onEnter: [{ set: '$.met.c42_bahr', value: true }],
    text: [
      { text: 'Коринна открывает сразу, будто ждала у окна. В доме тепло, пахнет дымом и пелёнками. Эрик, лет шести, держит в руках вчерашний подарок: деревянную лошадку на колёсах.' },
      { text: 'Мия, младшая, плачет на руках у матери, тонко и без перерыва. Держится за ухо. Лоб горячий.' },
      { text: 'Коринна говорит быстро, качая Мию: со вчерашнего вечера. И ещё: у соседей говорят про Сильвестр у пожарной части, огонь и суп. «Erik will hin. Ich hab Angst. Vor dem Feuer, vor den Leuten, vor dem, was im Wald ist». Эрик хочет туда. Я боюсь. Огня, людей, того, что в лесу.' },
    ],
    actions: [
      { id: 'c46_bb_ear', label: 'Посмотреть ухо, тёплый компресс, жар сбить', minutes: 60, terminal: true, goto: 'c46_b_well',
        text: 'Ухо красное, внутри не видно. Тёплое масло на вате, платок, шапка. Половину детской таблетки от жара в ложке с вареньем. Через полчаса Мия перестаёт плакать и засыпает, держа мать за волосы. Коринна сидит не шевелясь.', effects: [set46('bb', 'ear'), w46('b_mia', 'treated'), until46(55, 12, 50)] },
      { id: 'c46_bb_syrup', label: 'Дать Мие детский сироп от жара из своей сумки', when: hasSyrup, minutes: 60, terminal: true, goto: 'c46_b_well',
        text: 'Сироп из винзенского шкафа: розовый, сладкий, мерная ложечка. Мия пьёт и морщится. Через полчаса жар спадает. Ты оставляешь Коринне вторую бутылочку и показываешь, сколько и когда.', effects: [set46('bb', 'syrup'), w46('b_mia', 'syrup'), { take: 'c45_kids_meds', qty: 1 }, until46(55, 12, 50)] },
      { id: 'c46_bb_amoxi', label: 'Если к утру не лучше — оставить Коринне блистер антибиотика и объяснить', when: hasAmoxi, minutes: 60, terminal: true, goto: 'c46_b_well',
        text: 'Ты режешь таблетку на четвертинки и пишешь на бумажке: когда, сколько, не бросать на третий день. Коринна повторяет вслух, как в школе. Блистер последний. Ты оставляешь его здесь.', effects: [set46('bb', 'amoxi'), w46('b_mia', 'amoxi'), { take: 'c25_amoxi', qty: 1 }, until46(55, 12, 50)] },
      { id: 'c46_bb_soup', label: 'Сначала разогреть суп и накормить всех: Коринна сама не ела', minutes: 60, terminal: true, goto: 'c46_b_well',
        text: 'Суп на печку, хлеб на стол. Коринна ест, не отрывая глаз от тарелки, и только потом замечает, что Мия заснула у тебя на плече под мокрым платком. «Sie schläft. Seit gestern das erste Mal». Спит. Первый раз со вчерашнего дня.', effects: [set46('bb', 'soup'), w46('b_mia', 'treated'), until46(55, 12, 50)] },
      { id: 'c46_bb_silvester', label: 'Сначала успокоить Мию, потом расспросить Коринну про Сильвестр', minutes: 60, terminal: true, goto: 'c46_b_well',
        text: 'Мия засыпает у тебя на руках под мокрым платком. Коринна рассказывает: соседи хотят идти все, говорят, Брандт поставит стражу. «Und wenn nicht? Ich kann nicht zwei Kinder tragen und rennen». А если нет? Я не могу нести двоих детей и бежать.', effects: [set46('bb', 'silvester'), w46('b_mia', 'treated'), w46('b_corinna_fear', true), w46('heard_silvester', true), until46(55, 12, 50)] },
    ] }),

  L({ id: 'c46_b_well', title: 'Колонка', ambient: xmas46,
    text: [
      { text: 'Во дворе у Коринны колонка, и рычаг не двигается: замёрзла. Воду она второй день топит из снега в кастрюле.' },
      { text: '— Seit Heiligabend. Ich krieg den Hebel nicht runter.\n\nС сочельника. Я не могу опустить рычаг.' },
    ],
    actions: [
      { id: 'c46_bw_hot', label: 'Отогреть колонку кипятком и обмотать тряпками', minutes: 30, terminal: true, goto: 'c46_b_kids', ambientDuring: xmas46,
        text: 'Три чайника кипятка, медленно, сверху вниз. Рычаг вздрагивает, идёт туго, потом легче. Вода сначала ржавая, потом чистая. Ты обматываешь трубу мешковиной и показываешь Коринне, как на ночь сливать.', effects: [set46('bw', 'hot'), w46('b_pump_fixed', true), until46(55, 13, 20)] },
      { id: 'c46_bw_snow', label: 'Натопить ей снега на два дня, пока Эрик ждёт санки', minutes: 30, terminal: true, goto: 'c46_b_kids',
        text: 'Два ведра снега в котёл на плите, потом в бочку. Воды выходит меньше, чем снега, всегда меньше, чем думаешь. До колонки дойдёт кто-нибудь из дружины.', effects: [set46('bw', 'snow'), until46(55, 13, 20)] },
      { id: 'c46_bw_note', label: 'Пообещать прислать Лукаса с паяльной лампой', minutes: 20, terminal: true, goto: 'c46_b_kids',
        text: 'Коринна кивает: Лукаса она знает. Ты пишешь на бумажке «Bahr, Lullau — Pumpe» и кладёшь в карман. Отдать завтра. Не забыть.', effects: [set46('bw', 'note'), w46('b_pump_note', true), until46(55, 13, 10)] },
    ] }),

  L({ id: 'c46_b_kids', title: 'Горка', ambient: xmas46,
    text: [
      { text: 'Эрик тянет тебя за рукав: на краю поля горка, оттуда видно колонию и Зеве. У него санки, старые, деревянные, и он должен показать, как быстро они едут.' },
      { text: 'Коринна смотрит из окна с Мией на руках и машет: идите, идите.' },
    ],
    actions: [
      { id: 'c46_bk_ride', label: 'Съехать с Эриком на санках', minutes: 30, terminal: true, goto: 'c46_b_hansen', ambientDuring: xmas46, activity: 'moderate',
        text: 'Вы едете вдвоём, санки виляют, снег в лицо. Внизу переворачиваетесь, и Эрик хохочет так, что икает. Ещё раз. И ещё. На пятый раз ты остаёшься внизу лежать в снегу и смотреть в небо. Эрик ложится рядом.', effects: [set46('bk', 'ride'), { body: 'stress', delta: -8 }, { body: 'fatigue', delta: 3 }, until46(55, 13, 50)] },
      { id: 'c46_bk_ask', label: 'Спросить Эрика, почему ему так хочется на Сильвестр', minutes: 30, terminal: true, goto: 'c46_b_hansen', ambientDuring: xmas46,
        text: 'Эрик думает, нахмурившись. «Weil Papa immer Raketen gemacht hat. Und dann hat Mama gelacht». Потому что папа всегда запускал ракеты. И мама тогда смеялась. Про папу он больше ничего не говорит и съезжает с горки один.', effects: [set46('bk', 'ask'), w46('b_erik', true), until46(55, 13, 50)] },
      { id: 'c46_bk_look', label: 'Постоять наверху и посмотреть, что видно отсюда', minutes: 30, terminal: true, goto: 'c46_b_hansen', ambientDuring: xmas46,
        text: 'Колония, Зеве подо льдом, пост вашего двора — чёрная точка у реки. Дальше лесополоса. На опушке, у края, что-то стоит. Ты смотришь долго. Не двигается. Пень, наверное. Ты зовёшь Эрика вниз раньше, чем {m:собирался|собиралась}.', effects: [set46('bk', 'look'), w46('b_saw_edge', true), { body: 'stress', delta: 3 }, until46(55, 13, 45)] },
    ] }),

  X({ id: 'c46_b_hansen', title: 'Фрау Ханзен', location: 'c3_neighbor', camp: { at: 'c3_neighbor', stock: 'c3_farm_stock', rest: false }, ambient: home,
    text: [
      { when: widow, text: 'Фрау Ханзен сидит у печки в чёрном платке. На столе два прибора: её и пустой, с перевёрнутой тарелкой. Отто не пережил ночь оттепели. Это её первое Рождество одной за пятьдесят один год.' },
      { when: not(widow), text: 'Ханзены сидят у печки вдвоём. В доме тихо, как в церкви. На столе остатки вчерашнего ужина и две свечи, которые не зажигают днём, чтобы хватило на вечер.' },
      { when: all(widow, flag('w.c44_hansen_talk')), text: 'Она сама начинает про Яннеса: «Nach Weihnachten, hab ich gesagt. Weihnachten ist gestern gewesen». После Рождества, я сказала. Рождество было вчера.' },
    ],
    actions: [
      { id: 'c46_bh_sit', label: 'Налить суп и посидеть с ней, ничего не говоря', minutes: 60, terminal: true, goto: 'c46_b_back',
        text: 'Ты наливаешь суп в две миски. Фрау Ханзен ест медленно, глядя на перевёрнутую тарелку. Потом переворачивает её и наливает в неё ложку супа. Потом ещё одну. «Er hat Erbsen nicht gemocht». Он не любил горох. И смеётся, и плачет одновременно.', effects: [set46('bh', 'sit'), w46('b_hansen', 'sat'), until46(55, 14, 55)] },
      { id: 'c46_bh_jannes', label: 'Предложить: Яннес придёт сам, если она позволит', when: all(widow, flag('w.c44_hansen_talk')), minutes: 60, terminal: true, goto: 'c46_b_back',
        text: 'Фрау Ханзен долго молчит. Потом говорит: «Sonntag. Nach dem Mittag. Und er soll nicht reden. Er soll Holz hacken». В воскресенье. После обеда. И пусть не говорит. Пусть колет дрова. Ты обещаешь передать слово в слово.', effects: [set46('bh', 'jannes'), w46('hansen_sunday', true), until46(55, 14, 55)] },
      { id: 'c46_bh_silvester', label: 'Спросить, что она думает про Сильвестр у пожарной части', minutes: 60, terminal: true, goto: 'c46_b_back',
        text: '— Brandt war schon als Junge so. Wenn es dunkel wird, macht er Licht. Manchmal ist das richtig. — Она смотрит в окно на лесополосу. — Ich bleib zu Hause.\n\nБрандт и мальчишкой был такой. Когда темнеет, он зажигает свет. Иногда это правильно. Я останусь дома.', effects: [set46('bh', 'silvester'), w46('heard_silvester', true), w46('b_hansen_view', true), until46(55, 14, 55)] },
      { id: 'c46_bh_stove', label: 'Подложить дров и наносить воды на неделю', minutes: 60, terminal: true, goto: 'c46_b_back', activity: 'heavy',
        text: 'Шесть вёдер из колонки в бочку на кухне, поленница у печки на неделю. Фрау Ханзен смотрит, как ты работаешь, и говорит только в конце: «Du bist wie Henrike. Die fragt auch nicht». Ты как Хенрике. Та тоже не спрашивает.', effects: [set46('bh', 'stove'), w46('b_hansen', 'helped'), { body: 'fatigue', delta: 6 }, until46(55, 14, 55)] },
    ] }),

  X({ id: 'c46_b_back', title: 'Обратно', camp: { at: farm46, stock: 'c3_farm_stock', rest: false }, ambient: xmas46,
    text: [
      { text: 'Домой — по дороге, пока светло. Бидон пустой и лёгкий. Солнце висит над лесополосой, красное, и снег становится розовым.' },
    ],
    actions: [
      { id: 'c46_bc_walk', label: 'Идти и думать про Коринну и Сильвестр', minutes: 35, terminal: true, goto: 'c46_dusk', ambientDuring: xmas46, activity: 'moderate',
        text: 'Двое детей и мать, которая не может нести обоих и бежать. И Эрик, который хочет ракет, потому что тогда смеялась мама. Ты не знаешь, что правильно. К калитке ты подходишь, так и не решив.', effects: [set46('bc', 'walk'), toFarm, until46(55, 15, 30)] },
      { id: 'c46_bc_fast', label: 'Идти быстрее: у лесополосы не хочется задерживаться', minutes: 30, terminal: true, goto: 'c46_dusk', ambientDuring: xmas46, activity: 'moderate',
        text: 'Ты прибавляешь шагу у лесополосы и не смотришь туда. Не смотреть труднее, чем смотреть. У калитки ты замечаешь, что почти {m:бежал|бежала}.', effects: [set46('bc', 'fast'), toFarm, until46(55, 15, 30)] },
      { id: 'c46_bc_herbs', label: 'Наломать у дороги сухих веток можжевельника для дома', minutes: 40, terminal: true, goto: 'c46_dusk', ambientDuring: xmas46,
        text: 'Можжевельник у края поля, сухие ветки пахнут смолой и праздником. Ты несёшь охапку, и руки потом весь вечер пахнут лесом.', effects: [set46('bc', 'herbs'), toFarm, until46(55, 15, 30)] },
    ] }),
];
