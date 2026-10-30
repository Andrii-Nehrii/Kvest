// Глава 2, участок 3 — ночь с 10 на 11 ноября и утро второго дня там, где каждого застала КТ 2:
// квартира B в Barmbek, квартира A в Buchholz, машина, улица, хутор, мастерская, Ahrensburg.
// Сцены общие (for: 'any'): хозяина места и гостя различает условие { me }.
// Пока вы вместе, далеко уходить нельзя — куда ехать, решается на КТ 3; кто один, может утром дойти до партнёра.
import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { biteArm } from '../chapter1/a_town';
import { buy, driveTo, waitHour } from '../chapter1/common';
import { AM, C2, C3, EVE, MORNING, NIGHT, PM, radio2, withPartnerAt } from './world2';

const S = (s: Scene) => s;
const isA: Cond = { me: 'A' };
const isB: Cond = { me: 'B' };
const together: Cond = { flag: 'w.together' };
const alone: Cond = { not: together };
const after = (h: number, m = 0): Cond => ({ after: at(11, h, m) });
const before = (h: number, m = 0): Cond => ({ before: at(11, h, m) });
const done = (flag: string): Cond => ({ flag: `$.${flag}` });
const notDone = (flag: string): Cond => ({ not: done(flag) });
const once = (flag: string, extra: Effect[] = []): Effect[] => [{ set: `$.${flag}`, value: true }, ...extra];

/** Переход к КТ 3 — в конце списка каждого места. */
export const cp3Action = (label = 'Утро. Решить, что дальше'): ActionDef => ({
  id: 'c3_go', label, minutes: 5, terminal: true, goto: 'c2_cp3', when: { all: [C2, { not: C3 }, after(7, 30)] },
  effects: [{ set: '$.c3', value: true }],
});

/** Поговорить с партнёром, пока вы в одном месте. */
const talkPartner = (place: string): ActionDef => ({
  id: 'c2_talk', label: 'Рассказать друг другу всё, что было за этот день', minutes: 40, activity: 'rest', combinable: true,
  when: { all: [withPartnerAt(place), notDone('c2_talked')] },
  outcomes: [
    { id: 'a', when: isA, text: 'Вы говорите шёпотом, перебивая друг друга. Ты рассказываешь про дорогу, она — про свой день, и в какой-то момент вы оба замолкаете на полуслове, потому что дальше рассказывать не хочется. Она засыпает у тебя на плече посреди фразы.',
      effects: once('c2_talked', [{ body: 'stress', delta: -15 }]) },
    { id: 'b', text: 'Вы говорите шёпотом, перебивая друг друга. Он рассказывает про дорогу так, будто это была просто поездка, — ты видишь по его рукам, что нет. Ты рассказываешь свой день и вдруг понимаешь, что плачешь. Он не говорит «не плачь». Просто держит.',
      effects: once('c2_talked', [{ body: 'stress', delta: -15 }]) },
  ],
});

/** Утром посмотреть новости в телефоне, если вдруг есть сеть. */
const phoneNews: ActionDef = {
  id: 'c2_phone', label: 'Проверить телефон: сеть, новости', minutes: 4, combinable: true, group: 'phone_news', when: { all: [{ phoneUsable: true }, MORNING] },
  outcomes: [
    { id: 'data', when: { network: 'data' }, text: 'Сеть появляется на полминуты. Push за push-ем: Katastrophenfall, комендантский час, Messe, коридор через мосты с 9 до 14. Сообщений от знакомых — ни одного: всё застряло где-то по дороге.',
      effects: [{ learn: 'f_kfall', quiet: true }, { learn: 'f_curfew', quiet: true }, { learn: 'f_corridor', quiet: true }, { learn: 'f_messe_open', quiet: true }, { charge: 'phone', delta: -2 }] },
    { id: 'none', text: '«Kein Netz». Ты держишь телефон у окна, поднимаешь над головой. Полоска появляется и тут же гаснет.', effects: [{ charge: 'phone', delta: -1 }] },
  ],
};

// ───────────── Barmbek: квартира B ─────────────

const merleHome: Cond = { npc: 'merle', at: 'b_flat' };
const svenjaHere: Cond = { npc: 'svenja', at: 'b_flat' };
const okaforHome: Cond = { npc: 'okafor', at: 'b_okafor' };
const hammering: Cond = { all: [done('c2_hammer'), notDone('hammer_done'), NIGHT] };

const breakfastB: ActionDef = {
  id: 'c2_breakfast', label: 'Позавтракать тем, что есть на кухне', minutes: 20, combinable: true, when: { all: [MORNING, notDone('c2_ate')] },
  outcomes: [
    { id: 'eggs', when: { stocked: 'eggs', qty: 1, at: 'b_flat' },
      text: 'Яичница на всех, хлеб, если остался, кофе — настоящий, пока есть ток. Сидите на кухне и едите молча, прислушиваясь к улице.',
      effects: [{ pickup: 'eggs', qty: 1 }, { take: 'eggs' }, { body: 'hunger', delta: -30 }, { body: 'thirst', delta: -15 }, { body: 'stress', delta: -4 }, ...once('c2_ate')] },
    { id: 'rice', when: { stocked: 'rice', qty: 1, at: 'b_flat' },
      text: 'Рис с томатами из банки. Странный завтрак — но горячий.',
      effects: [{ pickup: 'canned_tomatoes', qty: 1 }, { take: 'canned_tomatoes' }, { body: 'hunger', delta: -25 }, { body: 'thirst', delta: -10 }, ...once('c2_ate')] },
    { id: 'tea', text: 'В шкафах почти пусто. Чай и пара сухарей — всё, что удаётся собрать.',
      effects: [{ body: 'hunger', delta: -8 }, { body: 'thirst', delta: -15 }, ...once('c2_ate')] },
  ],
};

const packB: ActionDef = {
  id: 'c2_pack', label: 'Собрать рюкзак в дорогу: тёплое, вода, еда, аптечка', minutes: 15, combinable: true, when: { all: [MORNING, notDone('c2_packed')] },
  text: 'Ты собираешь то, что осталось в квартире: дождевик, шапку, полотенце, мешки для мусора, нож, таблетки, свечи. Набираешь воду из-под крана во всё, что закрывается. Рюкзак тяжелеет на глазах.',
  effects: [{ pickup: 'backpack' }, { pickup: 'rain_jacket' }, { pickup: 'beanie' }, { pickup: 'towel' }, { pickup: 'trash_bags' }, { pickup: 'kitchen_knife' },
    { pickup: 'ibuprofen' }, { pickup: 'candles' }, { pickup: 'lighter' }, { pickup: 'apple' }, { pickup: 'pasta' }, { pickup: 'crackers' }, { pickup: 'chocolate' },
    { give: 'water_15', qty: 2 }, ...once('c2_packed')],
};

export const nightScenes: Record<string, Scene> = Object.fromEntries([
  S({
    id: 'c2_bflat', for: 'any', chapter: 'ch2', location: 'b_flat', title: 'Barmbek, четвёртый этаж', safe: true,
    text: [
      { when: { all: [NIGHT, isB, { not: withPartnerAt('b_flat') }] }, text: 'Ночь. Квартира тёплая — в Гамбурге ток ещё есть, — но свет ты не включаешь: с улицы видно каждое светлое окно. Телефон молчит. Ты сидишь на кровати одетая и слушаешь дом.' },
      { when: { all: [NIGHT, isB, withPartnerAt('b_flat')] }, text: 'Ночь. {partner} здесь — в твоей квартире, в твоей самой большой футболке, с кружкой чая, которую никак не может допить. Свет вы не включаете: с улицы видно каждое светлое окно. Ты всё время проверяешь взглядом, что он правда здесь.' },
      { when: { all: [NIGHT, isA] }, text: 'Ночь в её квартире. Тепло — в Гамбурге ещё есть ток. Свет не включаете: с улицы видно каждое окно. {partner} не отходит от тебя дальше чем на шаг. Ты тоже.' },
      { when: { all: [NIGHT, merleHome] }, text: 'За стеной, в комнате Мерле, тихо бормочет радио.' },
      { when: { all: [NIGHT, svenjaHere] }, text: 'На диване в гостиной — Свенья, под пледом, с забинтованной рукой. Не спит: смотрит в потолок.' },
      { when: hammering, text: 'Внизу всё ещё бьют в стеклянную дверь подъезда. Ровно. Без остановки.' },
      { when: AM, text: 'Утро среды. Серый, сухой, холодный свет: дождь кончился ночью. С улицы — непривычные звуки: колёсики чемоданов по брусчатке, чей-то плач, далёкий вертолёт.' },
      { when: { all: [AM, merleHome, { not: done('merle_hypo_bad') }] }, text: 'Мерле на кухне варит кофе на всех и шутит громче обычного.' },
      { when: { all: [AM, merleHome, done('merle_hypo_bad')] }, text: 'Мерле лежит у себя, бледная, с синяком на скуле: ночью она упала и долго лежала на полу. Говорит, что всё нормально. Не нормально.' },
      { when: { all: [AM, svenjaHere, { npc: 'svenja', status: 'sick' }] }, text: 'Свенья на диване не спит: лежит лицом к стене и дрожит под двумя пледами. На подушке — тёмное пятно пота.' },
      { when: { all: [AM, { npcVar: 'okafor', key: 'back_from_clinic' }, okaforHome] }, text: 'На площадке, у двери напротив, — следы мокрых ботинок. Окафор вернулся.' },
      { when: PM, text: 'День второй. Солнце так и не вышло, но и дождя нет. В квартире тепло, гудит холодильник — в Гамбурге ещё есть ток, и от этого почти стыдно. С улицы — то громкоговоритель, то тишина.' },
      { when: EVE, text: 'Темнеет в половине пятого. С восьми — комендантский час, и улица под окнами пустеет раньше: люди не ждут восьми.' },
      { when: { all: [{ not: NIGHT }, { npc: 'svenja', at: 'b_flat' }, { npc: 'svenja', status: 'infected' }, { flag: '$.svenja_handled' }] }, text: 'Из-за двери комнаты — удары. Ровные. Без остановки.' },
    ],
    actions: [
      radio2('radio', 'Включить радио на кухне'),
      { id: 'c2_window', label: 'Посмотреть в окно на улицу', minutes: 3, combinable: true, repeatable: true,
        outcomes: [
          { id: 'hammer_a', when: { all: [hammering, isA] },
            text: 'Внизу, у подъезда, — старик в банном халате, босиком. Он бьёт ладонями в стеклянную дверь — ровно, без злости, как машина. — Это сосед из переднего дома, — шепчет {partner} у тебя за плечом. — Он гулял с таксой. Каждое утро. — Халат распахнут, на ногах грязь. Ему должно быть очень холодно. Ему всё равно.',
            effects: [{ learn: 'f_vorderhaus_man' }, { body: 'stress', delta: 8 }] },
          { id: 'hammer', when: hammering,
            text: 'Внизу, у подъезда, — мужчина в банном халате, босиком. Ты узнаёшь его: сосед из переднего дома, ты видела его с таксой. Он бьёт ладонями в стеклянную дверь — ровно, без злости, как машина. Халат распахнут, на ногах грязь. Ему должно быть очень холодно. Ему всё равно.',
            effects: [{ learn: 'f_vorderhaus_man' }, { body: 'stress', delta: 8 }] },
          { id: 'night', when: NIGHT, text: 'Улица пуста. В доме напротив светится одно окно — и гаснет, пока ты смотришь. Над Hamburger Straße — рыжее зарево, и оттуда же, едва слышно, сирены.' },
          { id: 'police', when: after(8, 15), text: 'По улице ползёт полицейская машина с громкоговорителем на крыше: «Sammelstelle Messe geöffnet… Ausgangssperre ab zwanzig Uhr…» За ней, по тротуару, тянутся люди с чемоданами — в сторону Messe, пешком.',
            effects: [{ learn: 'f_messe_open' }, { learn: 'f_curfew' }] },
          { id: 'morning', text: 'Люди с чемоданами и рюкзаками идут в сторону метро, хотя поезда не ходят. У киоска на углу — очередь. Женщина на балконе напротив курит и смотрит туда же, куда и ты.' },
        ] },
      { id: 'c2_hammer_wait', label: 'Не включать свет и ждать, пока он уйдёт', minutes: 25, activity: 'rest', when: hammering,
        text: 'Ты сидишь в темноте, не двигаясь. Удары становятся реже. Потом — тишина, и шаркающие шаги по двору, к мусорным бакам и дальше, на улицу. Ты ещё долго не можешь заставить себя лечь.',
        effects: once('hammer_done', [{ body: 'stress', delta: 6 }]) },
      { id: 'c2_hammer_okafor', label: 'Тихо постучать к Окафору', minutes: 10, when: { all: [hammering, okaforHome] },
        text: 'Окафор открывает сразу — он не спал. Слушает удары снизу, наклонив голову. — Не открывайте. Не светите. Не шумите, — говорит он. — Он уйдёт сам. Они уходят, когда нечего слышать. — Он говорит «они». Удары и правда стихают через четверть часа.',
        effects: once('hammer_done', [{ npc: 'okafor', trust: 4 }, { learn: 'f_drawn_to_light' }]) },
      { id: 'c2_merle', label: 'Броситься к Мерле', minutes: 1, terminal: true, goto: 'c2_merle_night',
        when: { all: [done('merle_hypo'), notDone('merle_helped'), notDone('merle_hypo_bad')] } },
      { id: 'c2_merle_morning', label: 'Посидеть с Мерле', minutes: 15, combinable: true, when: { all: [MORNING, merleHome, done('merle_hypo_bad'), notDone('merle_sat')] },
        text: 'Ты меряешь ей сахар — низковато, но уже не страшно. Мерле ест шоколад маленькими кусками и не смотрит тебе в глаза. — Я лежала и не могла позвать, — говорит она. — Голова была как вата. Я слышала, как ты дышишь за стеной. — Ты держишь её за руку, пока она не засыпает.',
        effects: once('merle_sat', [{ npc: 'merle', trust: 5 }, { learn: 'f_merle_hypo' }]) },
      { id: 'c2_merle_plans', label: 'Спросить Мерле, что она будет делать', minutes: 10, combinable: true, when: { all: [MORNING, merleHome, notDone('merle_plans')] },
        text: '— Ахренсбург, — говорит Мерле. — Если поезда не ходят, дойду пешком. Двадцать километров — это сколько, пять часов? — Она пытается улыбнуться. — Или с вами. Куда вы — туда и я. Только инсулин нужно держать в холоде. Это не шутка, это просто факт.',
        effects: once('merle_plans', [{ npc: 'merle', trust: 3 }]) },
      talkPartner('b_flat'),
      breakfastB,
      packB,
      phoneNews,
      { id: 'c2_svenja', label: 'Подойти к Свенье', minutes: 1, terminal: true, goto: 'c2_svenja', when: { all: [MORNING, svenjaHere] } },
      waitHour('Переждать час, прислушиваясь к дому', 'c2_wait'),
      { id: 'c2_stairs', label: 'Выйти на лестничную площадку', minutes: 1, terminal: true, goto: 'c2_bstairs' },
      cp3Action(),
    ],
  }),

  S({
    id: 'c2_merle_night', for: 'any', chapter: 'ch2', location: 'b_flat', title: 'Мерле', universal: false,
    text: [{ text: 'Мерле лежит на полу у кровати, на боку. Глаза открыты, но смотрят мимо. Футболка мокрая насквозь, руки ледяные и трясутся. — Всё н-нормально, — говорит она очень медленно. — Я просто… я не помню, что я…' }],
    actions: [
      { id: 'sugar_known', label: 'Сразу сладкое — как учил Окафор', minutes: 15, terminal: true, goto: 'c2_bflat', when: { knows: 'f_hypo_signs' },
        text: 'Сок с кухни, три ложки сахара прямо в стакан. Ты держишь ей голову, она пьёт, давится, пьёт. Через десять минут её взгляд становится её взглядом. — Ну вот, — говорит она хрипло. — Теперь ты видела меня в худшем виде. Можешь шантажировать.',
        effects: once('merle_helped', [{ npc: 'merle', trust: 12, remember: '$:hypo_help' }, { learn: 'f_merle_hypo' }, { body: 'stress', delta: 4 }]) },
      { id: 'sugar_guess', label: 'Дать ей что-нибудь сладкое — сок, сахар, что угодно', minutes: 25, terminal: true, goto: 'c2_bflat', when: { not: { knows: 'f_hypo_signs' } },
        outcomes: [
          { id: 'ok', check: { traits: ['medicine'], difficulty: 3, uses: ['focus'] },
            text: 'Сахар у диабетика — это ведь про сахар, да? Ты приносишь сок, сыплешь в него сахар, держишь стакан. Мерле пьёт. Минут через десять она садится и долго смотрит на свои руки. — Спасибо, — говорит она. — Ты правильно сделала. Я бы не смогла сама.',
            effects: once('merle_helped', [{ npc: 'merle', trust: 10, remember: '$:hypo_help' }, { learn: 'f_merle_hypo' }, { body: 'stress', delta: 6 }]) },
          { id: 'slow', text: 'Ты мечешься по кухне: инсулин? нет, наоборот! — сахар, сок. Мерле давится, проливает половину на себя. Проходит, кажется, вечность, прежде чем она начинает отвечать связно. — Сладкое, — шепчет она. — Сразу сладкое. Запомни, ладно?',
            effects: once('merle_helped', [{ npc: 'merle', trust: 8, remember: '$:hypo_help' }, { learn: 'f_merle_hypo' }, { learn: 'f_hypo_signs' }, { body: 'stress', delta: 10 }]) },
        ] },
      { id: 'okafor', label: 'Стучать к Окафору', minutes: 15, terminal: true, goto: 'c2_bflat', when: okaforHome,
        text: 'Окафор приходит через минуту, в майке и перчатках. Смотрит на Мерле, ничего не спрашивает: сладкий чай, глюкоза из его аптечки, пальцы на её запястье. — Гипогликемия, — говорит он, когда она уже сидит. — От стресса, от того, что ели не вовремя. Сегодня будет ещё. Следите.',
        effects: once('merle_helped', [{ npc: 'merle', trust: 6, remember: '$:hypo_help' }, { npc: 'okafor', trust: 4 }, { learn: 'f_merle_hypo' }, { learn: 'f_hypo_signs' }]) },
    ],
  }),

  S({
    id: 'c2_svenja', for: 'any', chapter: 'ch2', location: 'b_flat', title: 'Свенья',
    onEnter: [{ learn: 'f_svenja_fever' }],
    text: [
      { when: { npc: 'svenja', status: 'sick' }, text: 'Свенья горит. Ты чувствуешь жар, даже не касаясь её лба. Её трясёт, она щурится от серого утреннего света, будто он режет глаза. — Голова, — шепчет она. — Как будто в ней песок. Это грипп, да? Я на прошлой неделе… у нас в группе все болели.' },
      { when: { not: { npc: 'svenja', status: 'sick' } }, text: 'Свенья сидит на диване, завернувшись в плед, и смотрит в окно. Повязка на руке потемнела. — Я не спала, — говорит она. — Каждый раз, как закрываю глаза, вижу его лицо.' },
    ],
    actions: [
      { id: 'pill', label: 'Дать ей таблетку от жара', minutes: 3, combinable: true, when: notDone('svenja_pill'), enabled: { hasTag: 'painkiller' }, disabledReason: 'Нужны таблетки — ибупрофен или парацетамол',
        text: 'Она глотает таблетку, запивает и откидывается на подушку. Через полчаса её почти перестаёт трясти, и она даже улыбается. — Лучше, — говорит она. — Видишь, просто грипп.',
        effects: [{ takeTag: 'painkiller' }, { npc: 'svenja', trust: 5, set: { masked: true } }, ...once('svenja_pill')] },
      { id: 'wound', label: 'Посмотреть укус под повязкой', minutes: 6, combinable: true, when: notDone('svenja_wound'),
        text: 'Ты разматываешь бинт. Полукруг от зубов на предплечье — края припухли и покраснели, кожа вокруг горячая. Гноя нет. Пахнет обычной раной. Ничего такого, чего не бывает с укусом собаки. Ты знаешь только, что у неё жар — и укус.',
        effects: once('svenja_wound') },
      { id: 'water', label: 'Принести ей воды и сесть рядом', minutes: 10, combinable: true, when: notDone('svenja_water'),
        text: 'Она пьёт жадно, проливая на плед. Рассказывает про соседа: тихий, старый, с таксой, всегда здоровался. Позавчера у него был жар. Вчера вечером он стоял под её дверью час — и не отвечал, когда она звала его по имени.',
        effects: once('svenja_water', [{ npc: 'svenja', trust: 4 }]) },
      { id: 'okafor', label: 'Позвать Окафора — пусть посмотрит', minutes: 15, terminal: true, goto: 'c2_bflat', when: { all: [okaforHome, notDone('svenja_fate')] },
        text: 'Окафор надевает перчатки ещё в дверях. Смотрит на руку, трогает лоб, светит фонариком в глаза — Свенья отворачивается со стоном. Лицо у него становится очень спокойным. — Я заберу её к себе, — говорит он. — Отдельная комната, замок. У моей коллеги тоже сначала был просто жар. — Он не договаривает. Свенья смотрит на вас обоих и всё понимает.',
        effects: [{ npc: 'svenja', moveTo: 'b_okafor', set: { isolated: true } }, { npc: 'okafor', trust: 5, set: { has_svenja: true } }, { learn: 'f_okafor_fever' }, ...once('svenja_fate')] },
      { id: 'messe', label: 'Сказать ей идти в Messe — там врачи', minutes: 10, terminal: true, goto: 'c2_bflat', when: { all: [{ any: [{ knows: 'f_messe_open' }, { knows: 'f_messe' }] }, notDone('svenja_fate')] },
        text: '— Там врачи. Там тебе помогут, — говоришь ты, и это даже может быть правдой. Свенья кивает, долго обувается, долго застёгивает куртку здоровой рукой. В дверях оборачивается: — Ты же зайдёшь потом? Узнать? — Ты обещаешь.',
        effects: [{ npc: 'svenja', moveTo: 'messe', trust: -5 }, ...once('svenja_fate')] },
      { id: 'attic', label: 'Отвести её на чердак — подальше от Мерле', minutes: 10, terminal: true, goto: 'c2_bflat', when: notDone('svenja_fate'),
        text: 'Ты говоришь про Мерле, про её сахар, про то, что ей нельзя болеть. Это правда — но не вся. Свенья не спорит. На чердаке — матрасы, старые кресла, холодно. Ты оставляешь ей воду, плед и свечу и закрываешь за собой люк.',
        effects: [{ npc: 'svenja', moveTo: 'b_attic', trust: -10, remember: '$:sent_away' }, ...once('svenja_fate')] },
      { id: 'keep', label: 'Пусть отлежится здесь', minutes: 2, terminal: true, goto: 'c2_bflat', when: notDone('svenja_fate'),
        text: 'Ты поправляешь ей подушку. Это просто жар. Сезон гриппа. Ей нужно отлежаться — и всё.',
        effects: [{ npc: 'svenja', trust: 6, remember: '$:kept' }, ...once('svenja_fate', [{ set: 'w.svenja_kept', value: true }])] },
      { id: 'back', label: 'Отойти', minutes: 1, terminal: true, goto: 'c2_bflat' },
    ],
  }),

  S({
    id: 'c2_bstairs', for: 'any', chapter: 'ch2', location: 'b_stairs', title: 'Лестничная площадка',
    text: [
      { when: NIGHT, text: 'Лестница тёмная: лампа на таймере щёлкает и гаснет, едва ты отпускаешь кнопку. Пахнет сыростью и чужими куртками.' },
      { when: AM, text: 'На площадке холодно. Двери соседей закрыты — кроме одной внизу, распахнутой настежь: Новаки уехали и не заперли.' },
      { when: { all: [okaforHome, AM] }, text: 'Из-за двери Окафора — шаги и звук закипающего чайника.' },
      { when: { all: [{ npc: 'svenja', at: 'b_attic' }, AM] }, text: 'Сверху, из-за люка на чердак, — кашель. Долгий, надрывный.' },
      { when: { all: [{ npc: 'svenja', at: 'b_okafor' }, AM] }, text: 'Из-за двери Окафора — голос Свеньи, высокий, жалобный, и его, низкий и ровный.' },
    ],
    actions: [
      { id: 'c2_okafor', label: 'Постучать к Окафору', minutes: 2, terminal: true, goto: 'c2_okafor', when: { all: [okaforHome, MORNING] } },
      { id: 'c2_attic', label: 'Подняться к люку на чердак', minutes: 3, terminal: true, goto: 'c2_attic', when: { all: [{ npc: 'svenja', at: 'b_attic' }, MORNING] } },
      { id: 'c2_nowak', label: 'Заглянуть в пустую квартиру Новаков', minutes: 10, combinable: true, when: { all: [MORNING, { flag: 'w.nowaks_gone' }, notDone('c2_nowak')] },
        text: 'Внутри — разбросанные вещи, детский носок у порога, открытые шкафы. На кухне — то, что не влезло в фургон: две пачки макарон, банка фасоли, полбутылки масла. На холодильнике магнитом прижата записка по-польски и по-немецки: «Берите что нужно. Кася».',
        effects: [{ give: 'pasta', qty: 2 }, { give: 'canned_beans' }, ...once('c2_nowak')] },
      { id: 'c2_up', label: 'Вернуться в квартиру', minutes: 1, terminal: true, goto: 'c2_bflat',
        enabled: { not: done('flat_lost') }, disabledReason: 'Там, за дверью, — Свенья' },
      { id: 'c2_down', label: 'Спуститься на улицу', minutes: 2, terminal: true, goto: 'c2_bstreet', when: MORNING },
      cp3Action(),
    ],
  }),

  S({
    id: 'c2_okafor', for: 'any', chapter: 'ch2', location: 'b_okafor', title: 'Окафор',
    text: [
      { when: { npcVar: 'okafor', key: 'back_from_clinic' }, text: 'Окафор открывает не сразу. Лицо серое, под глазами — чёрное. На нём всё ещё больничные штаны. — Клиники больше нет, — говорит он вместо «доброе утро». — Входите.' },
      { when: { not: { npcVar: 'okafor', key: 'back_from_clinic' } }, text: 'Окафор открывает сразу, будто ждал у двери. Чайник, две чашки, радио вполголоса. — Вы не спали, — говорит он. Это не вопрос.' },
      { when: { npc: 'svenja', at: 'b_okafor' }, text: 'Дверь в его ванную заперта на ключ. Ключ — у него в нагрудном кармане.' },
    ],
    actions: [
      { id: 'clinic', label: 'Спросить, что было в клинике', minutes: 15, combinable: true, when: { all: [{ npcVar: 'okafor', key: 'back_from_clinic' }, notDone('okafor_clinic')] },
        text: 'Он говорит медленно, глядя в чашку. В два ночи кончились охрана и полиция. В три ушли врачи. Больных с жаром и укусами заперли в отделении, двери заклинили каталками. — Я ушёл в пять, — говорит он. — Последним из тех, кто ушёл. Они стучали в двери, когда я спускался по лестнице.',
        effects: [{ learn: 'f_okafor_clinic' }, { npc: 'okafor', trust: 5 }, ...once('okafor_clinic')] },
      { id: 'svenja', label: 'Спросить, как Свенья', minutes: 8, combinable: true, when: { all: [{ npc: 'svenja', at: 'b_okafor' }, notDone('okafor_svenja')] },
        text: '— Жар с утра. Тридцать восемь и пять. Голова, свет режет глаза, — он перечисляет, как в карте. — Так было у моей коллеги. — Пауза. — Я её не выгоню. Но и не выпущу. Вам лучше уехать, пока вы можете.',
        effects: [{ learn: 'f_okafor_fever' }, { learn: 'f_svenja_fever' }, ...once('okafor_svenja')] },
      { id: 'advice', label: 'Спросить, что он сам сделал бы на вашем месте', minutes: 12, combinable: true, when: notDone('okafor_advice'),
        text: '— Уехал бы, — говорит Окафор не задумываясь. — Из города. Туда, где мало людей. Messe… — он качает головой. — Там проверяют на входе. Но укус под рукавом не всегда видно, а жар в первые сутки — как у гриппа. Если там начнётся, в зале на тысячу коек… — Он не заканчивает. — Но если вам некуда — лучше Messe, чем улица.',
        effects: [{ npc: 'okafor', trust: 3 }, { learn: 'f_okafor_fever' }, ...once('okafor_advice')] },
      { id: 'gloves', label: 'Попросить перчатки и бинты', minutes: 5, combinable: true, when: notDone('okafor_gloves'), enabled: { npc: 'okafor', trust: ['>=', 8] }, disabledReason: 'Вы для него пока просто соседи',
        text: 'Он достаёт из шкафа коробку нитриловых перчаток и отсчитывает тебе горсть. Потом — два бинта и упаковку салфеток. — Перчатки — всегда, — говорит он. — Даже если кажется, что не нужно.',
        effects: [{ give: 'nitrile_gloves', qty: 6 }, { give: 'bandages' }, { learn: 'f_wound_care' }, ...once('okafor_gloves')] },
      { id: 'invite', label: 'Позвать его с собой', minutes: 6, combinable: true, when: notDone('okafor_invite'), enabled: { npc: 'okafor', trust: ['>=', 15] }, disabledReason: 'Он вас слишком мало знает, чтобы идти с вами',
        outcomes: [
          { id: 'svenja', when: { npc: 'svenja', at: 'b_okafor' }, text: 'Он смотрит на запертую дверь ванной. — Не сегодня. Я не оставлю её одну, пока… пока не станет ясно. — Он пожимает тебе руку — крепко, обеими ладонями. — Спасибо, что позвали.',
            effects: [{ npc: 'okafor', trust: 6, remember: '$:invited' }, ...once('okafor_invite')] },
          { id: 'maybe', text: 'Окафор долго молчит. — Медбрат в дороге пригодится, — говорит он наконец. — Я подумаю. Если решу — найду вас до полудня. — Он не обещает. Но и не отказывает.',
            effects: [{ npc: 'okafor', trust: 6, remember: '$:invited', set: { may_join: true } }, ...once('okafor_invite')] },
        ] },
      { id: 'back', label: 'Вернуться к себе', minutes: 1, terminal: true, goto: 'c2_bstairs' },
    ],
  }),

  S({
    id: 'c2_attic', for: 'any', chapter: 'ch2', location: 'b_stairs', title: 'Люк на чердак',
    text: [
      { text: 'Узкая лесенка, люк в потолке. Сверху — кашель и тихий голос, кто-то говорит сам с собой. Пахнет пылью и свечным воском.' },
      { when: { npc: 'svenja', status: 'sick' }, text: 'Свенья лежит на старом матрасе у трубы, под чьим-то спальником. Её трясёт. — Холодно, — говорит она, не открывая глаз. — Почему так холодно?' },
    ],
    actions: [
      { id: 'pill', label: 'Дать ей таблетку от жара', minutes: 3, combinable: true, when: notDone('svenja_pill'), enabled: { hasTag: 'painkiller' }, disabledReason: 'Нужны таблетки',
        text: 'Она глотает, не открывая глаз. Ты сидишь рядом, пока дрожь не становится реже.',
        effects: [{ takeTag: 'painkiller' }, { npc: 'svenja', trust: 6, set: { masked: true } }, ...once('svenja_pill')] },
      { id: 'water', label: 'Оставить ей воду и одеяло', minutes: 5, combinable: true, when: notDone('svenja_water'),
        text: 'Ты укрываешь её своим пледом поверх спальника и ставишь рядом бутылку. Она находит твою руку и сжимает — слабо, горячими пальцами.',
        effects: [{ npc: 'svenja', trust: 5 }, ...once('svenja_water')] },
      { id: 'down', label: 'Спуститься', minutes: 2, terminal: true, goto: 'c2_bstairs' },
    ],
  }),

  S({
    id: 'c2_bstreet', for: 'any', chapter: 'ch2', location: 'b_street', title: 'Улица у дома', ambient: { outdoor: true },
    text: [
      { text: 'Улица живёт по-другому. Люди с чемоданами — в сторону Messe, пешком, семьями. Двое мужчин грузят матрасы на крышу «пассата». У киоска на углу — очередь человек на двадцать, молчаливая и злая.' },
      { when: after(9, 0), text: 'На перекрёстке стоит зелёный армейский грузовик. Солдат в каске раздаёт листовки и отвечает на вопросы одной и той же фразой: «Lesen Sie bitte das Merkblatt.»' },
      { when: { all: [isA, { itemAt: 'opel_corsa', place: 'b_street' }] }, text: 'Твой Corsa стоит у тротуара, где ты оставил его ночью. Целый.' },
      { when: { all: [isB, { itemAt: 'opel_corsa', place: 'b_street' }] }, text: 'Его Corsa стоит у тротуара, где он оставил его ночью. Целый — и с гамбургской грязью до самых окон.' },
    ],
    actions: [
      buy('c2_kiosk_water', 'Купить в киоске воду, 1,5 л', 4, null, [{ give: 'water_15' }], { when: before(11, 0), minutes: 25,
        text: 'Двадцать пять минут в очереди. Фарид за прилавком постарел за ночь лет на десять. Цены написаны маркером на картоне и зачёркнуты дважды. — Только наличные, — говорит он каждому. — Карточки не идут, сеть мёртвая.' }),
      buy('c2_kiosk_bread', 'Купить хлеб и плитку шоколада', 6, null, [{ give: 'bread' }, { give: 'chocolate' }], { when: before(11, 0), minutes: 5,
        text: 'Последняя буханка из ящика под прилавком. Фарид кладёт сверху шоколадку и машет рукой, когда ты лезешь за мелочью: — Для соседей.' }),
      buy('c2_kiosk_batt', 'Купить батарейки', 5, null, [{ give: 'batteries_aa' }], { when: before(11, 0), minutes: 3 }),
      { id: 'c2_leaflet', label: 'Взять листовку у солдата', minutes: 5, combinable: true, when: { all: [after(9, 0), notDone('c2_leaflet')] },
        text: 'Merkblatt, отпечатанный ночью: комендантский час с 20 до 6; Sammelstelle Messe — питание, медицинская помощь; выезд из города на юг — через Elbbrücken, 9–14 часов, «медицинский осмотр обязателен: лица с укусами, ранами неясного происхождения или температурой направляются в Messe». Внизу мелко: «Treibstoffabgabe nur an Einsatzkräfte».',
        effects: [{ learn: 'f_curfew' }, { learn: 'f_messe_open' }, { learn: 'f_corridor' }, { learn: 'f_fuel_ban' }, { learn: 'f_messe_bus' }, ...once('c2_leaflet')] },
      { id: 'c2_people', label: 'Спросить у людей с чемоданами, куда они', minutes: 8, combinable: true, when: notDone('c2_people'),
        text: '— В Messe, куда же ещё, — говорит мужчина с ребёнком на плечах. — Там хоть кормят. — Его жена тянет его за рукав. Старик рядом бурчит, что в Messe «соберут всех больных в одном зале, вот увидите». Девушка с переноской для кошки говорит, что мосты на юг открыли — только там проверяют каждого, и стоят восемь часов.',
        effects: [{ learn: 'f_messe_open' }, { learn: 'f_corridor', kind: 'rumor' }, ...once('c2_people')] },
      { id: 'c2_back', label: 'Вернуться в подъезд', minutes: 2, terminal: true, goto: 'c2_bstairs' },
      cp3Action(),
    ],
  }),

  // ───────────── Buchholz: квартира A ─────────────
  S({
    id: 'c2_aflat', for: 'any', chapter: 'ch2', location: 'a_flat', title: 'Buchholz, второй этаж', safe: true,
    text: [
      { when: { all: [NIGHT, isA, { not: withPartnerAt('a_flat') }] }, text: 'Ночь в Buchholz. Тока нет с вечера, в квартире холодает с каждым часом. Свеча на кухне, тени по стенам. Телефон ловит сеть всё реже, потом перестаёт совсем.' },
      { when: { all: [NIGHT, isA, withPartnerAt('a_flat')] }, text: 'Ночь в Buchholz. Тока нет, в квартире холодно, свеча на кухне. {partner} — здесь: под двумя одеялами, в твоём худи, с мокрыми после душа волосами — вода ещё течёт. Ты сидишь рядом, лицом к двери, и слушаешь дом.' },
      { when: { all: [NIGHT, isB] }, text: 'Его квартира — холодная, тёмная, пахнет им и остывшим кофе. Тока нет. {partner} укрыл тебя двумя одеялами и сел рядом, лицом к двери. Ты смотришь на свечу и не веришь, что дошла.' },
      { when: { all: [NIGHT, { npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', status: 'injured' }] }, text: 'Ильзе дремлет на диване, укрытая пледом, прижимая к груди перевязанную руку.' },
      { when: { all: [{ npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', status: 'sick' }] }, text: 'Ильзе на диване мелко дрожит под пледом. Лоб мокрый, глаза блестят. Она всё время просит пить.' },
      { when: { all: [NIGHT, done('gerd_at_door'), { npc: 'gerd', at: 'a_stairs' }, notDone('gerd_quiet')] }, text: 'За дверью, на площадке, кто-то ходит. Шаркает. Останавливается. Бьётся плечом в дверь. Снова ходит.' },
      { when: { all: [done('thief'), notDone('thief_gone'), isA] }, text: 'Во дворе, у твоей машины, — возня и тихий плеск.' },
      { when: AM, text: 'Утро среды. Сухо и холодно, на газоне иней. Тока по-прежнему нет. Во дворе хлопают багажники: соседи уезжают.' },
      { when: { all: [AM, { v: 'w.water.buchholz', op: '==', value: 'off' }] }, text: 'Кран на кухне хрипит и плюётся воздухом. Воды больше нет.' },
      { when: { all: [AM, { npc: 'gerd', at: 'a_stairs' }] }, text: 'На лестнице за дверью — тихо. Но ты знаешь, кто там.' },
      { when: PM, text: 'День второй в Buchholz. Тока нет, воды нет, телефон молчит. Квартира остывает, и ты ходишь по ней в куртке.' },
      { when: EVE, text: 'Темнеет рано. Свечей осталось мало, и ты зажигаешь одну, на кухне, подальше от окна.' },
      { when: { all: [{ not: NIGHT }, { npc: 'ilse', at: 'a_flat' }, { npcVar: 'ilse', key: 'isolated' }, { any: [{ npc: 'ilse', status: 'infected' }, { npc: 'ilse', status: 'turned' }] }] }, text: 'Из спальни — удары в дверь и скрежет. Стул под ручкой держит.' },
    ],
    actions: [
      { id: 'c2_window', label: 'Выглянуть во двор', minutes: 3, combinable: true, repeatable: true,
        outcomes: [
          { id: 'thief', when: { all: [done('thief'), notDone('thief_gone'), isA] },
            text: 'У твоей машины — человек на корточках, шланг в бензобаке, канистра у колеса. Луч фонарика выхватывает его лицо: Бартельс из седьмого дома, пенсионер, который каждую субботу мыл свой «мерседес».' },
          { id: 'night', when: NIGHT, text: 'Двор чёрный. Ни одного окна — во всём квартале нет тока. Только у седьмого дома кто-то стоит с сигаретой; огонёк то вспыхивает, то гаснет.' },
          { id: 'morning', text: 'Сосед с третьего этажа заталкивает в багажник коробки. Из седьмого дома выносят старушку на кресле-каталке. Над городом — ни одного дыма: печей тут нет, а электричество не вернулось.' },
        ] },
      { id: 'c2_thief_shout', label: 'Крикнуть из окна', minutes: 2, when: { all: [done('thief'), notDone('thief_gone'), isA] },
        text: 'Ты распахиваешь окно и орёшь так, что сам вздрагиваешь. Бартельс шарахается, роняет шланг, хватает канистру и бежит через двор, расплёскивая. Что успел слить — унёс.',
        effects: [{ siphon: 'opel_corsa', liters: 3 }, { set: '$.thief_gone', value: 'shouted' }] },
      { id: 'c2_thief_down', label: 'Спуститься во двор', minutes: 2, terminal: true, goto: 'c2_ayard_thief', risky: true, when: { all: [done('thief'), notDone('thief_gone'), isA] } },
      { id: 'c2_gerd_still', label: 'Не шевелиться и ждать, пока шаги уйдут', minutes: 30, activity: 'rest',
        when: { all: [done('gerd_at_door'), { npc: 'gerd', at: 'a_stairs' }, notDone('gerd_quiet'), NIGHT] },
        text: 'Ты задуваешь свечу и сидишь в темноте. Удары в дверь — ещё, ещё. Потом шаги — вниз, на площадку ниже. Там они ходят дальше: туда и обратно, туда и обратно. Он не уходит. Он просто больше не здесь.',
        effects: [...once('gerd_quiet', [{ learn: 'f_gerd_stairs' }, { body: 'stress', delta: 10 }])] },
      { id: 'c2_gerd_barricade', label: 'Придвинуть к двери шкаф', minutes: 10, activity: 'heavy',
        when: { all: [done('gerd_at_door'), { npc: 'gerd', at: 'a_stairs' }, notDone('barricade')] },
        text: 'Обувной шкаф, потом комод. Скрежет по полу — за дверью шаги замирают, потом удар, сильнее прежних. Когда комод встаёт на место, ты садишься на пол спиной к нему. Удары скоро стихают.',
        effects: [...once('barricade', [{ learn: 'f_gerd_stairs' }, { body: 'stress', delta: -4 }])] },
      { id: 'c2_ilse', label: 'Подойти к Ильзе', minutes: 1, terminal: true, goto: 'c2_ilse', when: { all: [{ npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', status: 'sick' }] } },
      talkPartner('a_flat'),
      { id: 'c2_breakfast', label: 'Поесть тем, что осталось в квартире', minutes: 15, combinable: true, when: { all: [MORNING, notDone('c2_ate')] },
        outcomes: [
          { id: 'ravioli', when: { stocked: 'canned_ravioli', qty: 1, at: 'a_flat' }, text: 'Равиоли из банки, холодные — плита электрическая. На вкус как картон с томатом. Ты съедаешь всё до последней.',
            effects: [{ pickup: 'canned_ravioli', qty: 1 }, { take: 'canned_ravioli' }, { body: 'hunger', delta: -35 }, ...once('c2_ate')] },
          { id: 'bread', when: { stocked: 'bread', qty: 1, at: 'a_flat' }, text: 'Хлеб, уже подсохший, и яблоко. Холодный чай из термоса со вчера.',
            effects: [{ pickup: 'bread', qty: 1 }, { take: 'bread' }, { body: 'hunger', delta: -25 }, { body: 'thirst', delta: -8 }, ...once('c2_ate')] },
          { id: 'none', text: 'В шкафах — макароны, которые не на чем сварить. Ты грызёшь сухую пачку и запиваешь водой.',
            effects: [{ body: 'hunger', delta: -8 }, ...once('c2_ate')] },
        ] },
      { id: 'c2_bath', label: 'Набрать воды из ванны в бутылки', minutes: 10, combinable: true, when: { all: [{ flag: 'A.water_stored' }, notDone('c2_bath')] },
        text: 'В ванне — вчерашний запас, литров сто. Ты наполняешь все бутылки, какие находишь, и ставишь у двери. Вода холодная и чуть пахнет трубами.',
        effects: [{ give: 'water_15', qty: 3 }, ...once('c2_bath')] },
      { id: 'c2_tap', label: 'Набрать воды из крана, пока она есть', minutes: 15, combinable: true,
        when: { all: [{ not: { flag: 'A.water_stored' } }, { v: 'w.water.buchholz', op: '!=', value: 'off' }, notDone('c2_tap')] },
        text: 'Кастрюли, бутылки, ведро. Напор слабый — сначала течёт, потом еле капает. Ты успеваешь наполнить почти всё.',
        effects: [{ give: 'water_15', qty: 3 }, ...once('c2_tap')] },
      { id: 'c2_pack', label: 'Собрать в рюкзак то, что осталось в квартире', minutes: 15, combinable: true, when: { all: [MORNING, notDone('c2_packed')] },
        text: 'Консервы, макароны, яблоки, таблетки, свечи, нож, скотч, кофе — всё, что может пригодиться. Квартира пустеет, а рюкзак не закрывается.',
        effects: [{ pickup: 'backpack' }, { pickup: 'canned_ravioli' }, { pickup: 'pasta' }, { pickup: 'apple' }, { pickup: 'ibuprofen' }, { pickup: 'candles' },
          { pickup: 'kitchen_knife' }, { pickup: 'duct_tape' }, { pickup: 'coffee' }, { pickup: 'bread' }, { pickup: 'water_15' }, ...once('c2_packed')] },
      phoneNews,
      waitHour('Переждать час, прислушиваясь к дому', 'c2_wait'),
      { id: 'c2_astairs', label: 'Выйти на лестницу', minutes: 1, terminal: true, goto: 'c2_astairs' },
      cp3Action(),
    ],
  }),

  S({
    id: 'c2_ayard_thief', for: 'any', chapter: 'ch2', location: 'a_yard', title: 'Во дворе', ambient: { outdoor: true },
    onEnter: [{ body: 'stress', delta: 8 }],
    text: [{ text: 'Бартельс выпрямляется, когда ты выходишь из подъезда. В одной руке — шланг, в другой — фонарик, канистра у колеса уже полная наполовину. Ему лет семьдесят. — Не надо, — говорит он. — Пожалуйста. Моя жена… у неё лёгкие. Мне надо в Lüneburg, к дочери. У меня пустой бак, а заправки не дают.' }],
    actions: [
      { id: 'take', label: 'Забрать канистру и отправить его домой', minutes: 5, terminal: true, goto: 'c2_aflat',
        text: 'Ты молча берёшь канистру. Он не сопротивляется — только смотрит. Потом уходит к седьмому дому, сгорбившись. Ты сливаешь бензин обратно в бак — немного проливается на асфальт.',
        effects: [{ set: '$.thief_gone', value: 'stopped' }, { set: '$.bartels', value: 'refused' }] },
      { id: 'share', label: 'Пусть возьмёт то, что уже слил', minutes: 5, terminal: true, goto: 'c2_aflat',
        text: 'Ты киваешь на канистру: забирай. Он не верит, потом верит — и плачет, по-стариковски, без звука. — Danke. Gott segne Sie. — Он уходит, прижимая канистру к груди, как ребёнка.',
        effects: [{ siphon: 'opel_corsa', liters: 5 }, { set: '$.thief_gone', value: 'shared' }, { set: '$.bartels', value: 'helped' }, { body: 'stress', delta: -4 }] },
      { id: 'threat', label: 'Пригрозить ему', minutes: 3, terminal: true, goto: 'c2_aflat', risky: true,
        text: 'Ты делаешь шаг, и он отступает, роняя фонарик. — Ich gehe, ich gehe! — Он бросает шланг и почти бежит. Канистра остаётся у колеса. Ты сливаешь бензин обратно и ещё долго не можешь унять руки.',
        effects: [{ set: '$.thief_gone', value: 'scared' }, { set: '$.bartels', value: 'threatened' }, { body: 'stress', delta: 4 }] },
    ],
  }),

  S({
    id: 'c2_ilse', for: 'any', chapter: 'ch2', location: 'a_flat', title: 'Ильзе',
    text: [
      { text: 'Ильзе горит. Глаза блестят, губы потрескались, пальцы горячие и сухие. Она узнаёт тебя не сразу. — Герд, — говорит она. — Нет… простите. Мне снился Герд. Он звал меня. Мне надо к нему.' },
    ],
    actions: [
      { id: 'pill', label: 'Дать ей таблетку от жара', minutes: 3, combinable: true, when: notDone('ilse_pill'),
        enabled: { any: [{ hasTag: 'painkiller' }, { stocked: 'ibuprofen', qty: 1, at: 'a_flat' }] }, disabledReason: 'Нужны таблетки',
        text: 'Она глотает таблетку с третьей попытки. Через полчаса её почти перестаёт трясти, и она извиняется — за беспокойство, за диван, за всё.',
        effects: [{ if: { hasTag: 'painkiller' }, then: [{ takeTag: 'painkiller' }], else: [{ pickup: 'ibuprofen', qty: 1 }, { take: 'ibuprofen' }] },
          { npc: 'ilse', trust: 5, set: { masked: true } }, ...once('ilse_pill')] },
      { id: 'wound', label: 'Посмотреть её руку', minutes: 6, combinable: true, when: notDone('ilse_wound'),
        text: 'Ты разматываешь повязку. Полукруг от зубов — красный, вспухший, горячий. Такой же, как был у Герда на предплечье вчера утром. Ты смотришь на него дольше, чем нужно, и аккуратно заматываешь обратно.',
        effects: [{ learn: 'f_ilse_fever' }, ...once('ilse_wound', [{ body: 'stress', delta: 6 }])] },
      { id: 'talk', label: 'Посидеть с ней', minutes: 15, combinable: true, when: notDone('ilse_talk'),
        text: 'Ильзе рассказывает про сына в Канаде, про то, как Герд учил его ловить угрей с причала. Потом про свадьбу, про то, что Герд тогда опоздал на сорок минут — чинил кому-то лодку. Она смеётся и кашляет. — Отвезите меня к нему, — просит она. — Пожалуйста. Я знаю, что вы можете.',
        effects: [{ npc: 'ilse', trust: 5 }, ...once('ilse_talk')] },
      { id: 'bedroom', label: 'Уложить её в спальне и закрыть дверь', minutes: 8, combinable: true, when: notDone('ilse_isolated'),
        text: 'Ты говоришь, что в спальне теплее. Это неправда: тока нет нигде. Ильзе послушно идёт, опираясь на твою руку, и ложится. Ты закрываешь дверь. Ключ от спальни ты не помнишь где — подпираешь ручку стулом.',
        effects: [{ npc: 'ilse', set: { isolated: true } }, ...once('ilse_isolated')] },
      { id: 'back', label: 'Отойти', minutes: 1, terminal: true, goto: 'c2_aflat' },
    ],
  }),

  S({
    id: 'c2_astairs', for: 'any', chapter: 'ch2', location: 'a_stairs', title: 'Лестница',
    text: [
      { when: { npc: 'gerd', at: 'a_stairs' }, text: 'Ты приоткрываешь дверь. На площадке ниже, у почтовых ящиков, стоит Герд. Босой, в той же майке, лицо серое, на подбородке — засохшее, тёмное. Он медленно поворачивает голову на скрип двери.' },
      { when: { all: [{ npc: 'gerd', at: 'a_brockmann' }, { npc: 'gerd', status: 'turned' }] }, text: 'Из-за двери Брокманов — удары и хрип. Дверь вздрагивает, но держит.' },
      { when: { npc: 'gerd', alive: false }, text: 'Дверь Брокманов закрыта. Ты не смотришь на неё.' },
      { when: { not: { npc: 'gerd', at: 'a_stairs' } }, text: 'Подъезд пахнет холодом и сыростью. Почтовые ящики, мокрые следы. Дверь на улицу открыта настежь — подпёрта кирпичом.' },
    ],
    actions: [
      { id: 'sneak', label: 'Дождаться, пока он отвернётся, и проскользнуть мимо', minutes: 6, terminal: true, goto: 'c2_ayard', risky: true, when: { npc: 'gerd', at: 'a_stairs' },
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'agility'], difficulty: 5, uses: ['mobility'] },
            text: 'Ты ждёшь, не дыша, пока он не уходит к окну на площадке. Шаг, ещё шаг — по краю ступенек, где не скрипит. Он оборачивается, когда ты уже у выхода. Ты захлопываешь за собой дверь подъезда и подпираешь её тем же кирпичом.',
            effects: [{ body: 'stress', delta: 8 }] },
          { id: 'grab', text: 'На третьей ступеньке скрипит. Он разворачивается всем телом и идёт на тебя — быстро, без звука. Пальцы впиваются в рукав, рот тянется к руке. Ты бьёшь, вырываешься, вылетаешь на улицу. Рукав разорван. Рука — цела? Ты не {m:уверен|уверена}.',
            effects: [biteArm('leftArm', 1), { body: 'stress', delta: 16 }] },
        ] },
      { id: 'fight', label: 'Убрать его с дороги', minutes: 5, activity: 'heavy', terminal: true, goto: 'c2_ayard', risky: true, when: { npc: 'gerd', at: 'a_stairs' },
        outcomes: [
          { id: 'bit', chance: 0.2, text: 'Ты сбиваешь его с ног — и он вцепляется в тебя, падая. Зубы сквозь рукав, в предплечье. Ты бьёшь ещё и ещё, пока он не затихает у почтовых ящиков. Потом долго сидишь на ступеньке, прижимая к себе руку.',
            effects: [biteArm('leftArm', 2), { npc: 'gerd', alive: false }, { set: '$.killed_gerd', value: true }, { body: 'stress', delta: 25 }] },
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 5, uses: ['strength', 'mobility'] },
            text: 'Он не закрывается и не уворачивается — просто идёт. Ты бьёшь, он падает, встаёт, падает снова. Потом не встаёт. Ты стоишь над ним в пустом подъезде, и где-то наверху хлопает чья-то дверь — кто-то слушал. Никто не выходит.',
            effects: [{ npc: 'gerd', alive: false }, { set: '$.killed_gerd', value: true }, { body: 'stress', delta: 22 }] },
          { id: 'bit2', text: 'Он оказывается сильнее, чем ты {m:думал|думала}, и цепче. Зубы — в кисть, сквозь пальцы. Ты отшвыриваешь его через перила; внизу глухой удар, и тишина. Кровь капает с пальцев на ступени.',
            effects: [biteArm('hands', 2), { npc: 'gerd', alive: false }, { set: '$.killed_gerd', value: true }, { body: 'stress', delta: 25 }] },
        ] },
      { id: 'lure', label: 'Заманить его в квартиру Брокманов и захлопнуть дверь', minutes: 10, terminal: true, goto: 'c2_ayard', risky: true,
        when: { all: [{ npc: 'gerd', at: 'a_stairs' }, isA] },
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'technical'], difficulty: 4, uses: ['mobility', 'focus'] },
            text: 'Ты стучишь по перилам — он идёт на звук. Ещё стук, уже из открытой двери Брокманов. Он входит следом, в темноту, и ты выскальзываешь мимо него в коридор и тянешь дверь на себя. Щелчок. Удар изнутри. Ещё удар. Держит.',
            effects: [{ npc: 'gerd', moveTo: 'a_brockmann', set: { locked: true } }, { body: 'stress', delta: 10 }] },
          { id: 'close', text: 'Он идёт на стук, но слишком быстро: в дверях Брокманов вы сталкиваетесь. Ты отталкиваешь его внутрь, в темноту, и захлопываешь дверь — его пальцы мелькают в щели, и ты давишь, давишь, пока они не исчезают. Защёлка. Ты {m:весь|вся} в поту.',
            effects: [{ npc: 'gerd', moveTo: 'a_brockmann', set: { locked: true } }, { body: 'stress', delta: 16 }] },
        ] },
      { id: 'up', label: 'Вернуться в квартиру и запереться', minutes: 1, terminal: true, goto: 'c2_aflat',
        enabled: { not: done('flat_lost') }, disabledReason: 'Там, за дверью, — Ильзе' },
      { id: 'down', label: 'Спуститься во двор', minutes: 2, terminal: true, goto: 'c2_ayard', when: { not: { npc: 'gerd', at: 'a_stairs' } } },
    ],
  }),

  S({
    id: 'c2_ayard', for: 'any', chapter: 'ch2', location: 'a_yard', title: 'Двор', ambient: { outdoor: true },
    text: [
      { when: NIGHT, text: 'Двор чёрный: во всём квартале нет тока. Машины — тёмные горбы, у мусорных баков что-то шуршит. Холодно так, что перехватывает дыхание.' },
      { when: AM, text: 'Во дворе иней на машинах. Сосед с третьего этажа, Шютте, утрамбовывает в багажник «пассата» коробки, жена держит на руках кота в переноске. Из седьмого дома выносят чемоданы.' },
      { when: { itemAt: 'opel_corsa', place: 'a_yard' }, text: 'Твой Corsa стоит на своём месте.' },
      { when: { all: [{ itemAt: 'opel_corsa', place: 'a_yard' }, { any: [{ v: 'A.thief_gone', op: '==', value: 'got_fuel' }, { v: 'A.thief_gone', op: '==', value: 'shouted' }] }] }, text: 'Под бензобаком — тёмное пятно на асфальте и запах бензина. Крышка лючка открыта.' },
    ],
    actions: [
      { id: 'c2_schuette', label: 'Поговорить с Шютте', minutes: 10, combinable: true, when: { all: [MORNING, notDone('c2_schuette')] },
        text: '— В Celle, к сестре, — говорит Шютте, не переставая грузить. — Через Lüneburger Heide, по просёлкам: на A7 всё стоит. — Он понижает голос. — Бензина больше нигде не продают, слышали? Только полиции и армии. Берегите свой. И сливайте на ночь, а то сольют за вас.',
        effects: [{ learn: 'f_fuel_ban' }, ...once('c2_schuette')] },
      { id: 'c2_check_car', label: 'Проверить машину и бензин', minutes: 3, combinable: true, when: { itemAt: 'opel_corsa', place: 'a_yard' },
        outcomes: [
          { id: 'many', when: { fuelIn: 'opel_corsa', liters: 15 }, text: 'Стрелка — чуть меньше половины. На пару сотен километров, если без пробок. Без пробок сейчас не бывает.' },
          { id: 'some', when: { fuelIn: 'opel_corsa', liters: 6 }, text: 'Стрелка — меньше четверти. Километров сто. Может, меньше.' },
          { id: 'low', when: { fuelIn: 'opel_corsa', liters: 1 }, text: 'Лампочка резерва горит. Километров двадцать — тридцать, и то если повезёт.' },
          { id: 'empty', text: 'Стрелка на нуле. Машина никуда не поедет.' },
        ] },
      { id: 'c2_can', label: 'Залить в бак бензин из канистры', minutes: 5, combinable: true,
        when: { all: [{ itemAt: 'opel_corsa', place: 'a_yard' }, { has: 'can_petrol_10' }] },
        effects: [{ refuel: 'opel_corsa', liters: 10, fromCan: 'can_petrol_10' }] },
      { id: 'c2_up', label: 'Подняться в квартиру', minutes: 2, terminal: true, goto: 'c2_aflat', when: { not: { npc: 'gerd', at: 'a_stairs' } },
        enabled: { not: done('flat_lost') }, disabledReason: 'Там, за дверью, — Ильзе' },
      { id: 'c2_up_gerd', label: 'Вернуться в подъезд', minutes: 1, terminal: true, goto: 'c2_astairs', when: { npc: 'gerd', at: 'a_stairs' } },
      { id: 'c2_to_deniz', label: 'Доехать до мастерской Дениза', minutes: 10, terminal: true, goto: 'c2_workshop',
        when: { all: [MORNING, alone, { knows: 'f_deniz_shelter' }, { itemAt: 'opel_corsa', place: 'a_yard' }] },
        enabled: { all: [{ has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 4 }] }, disabledReason: 'Нужны ключи и хоть немного бензина',
        effects: [...driveTo(4, 'deniz_workshop')] },
      { id: 'c2_walk_deniz', label: 'Дойти пешком до мастерской Дениза', minutes: 45, move: true, activity: 'moderate', terminal: true, goto: 'c2_workshop',
        when: { all: [MORNING, alone, { knows: 'f_deniz_shelter' }] }, effects: [{ move: 'deniz_workshop' }] },
      cp3Action(),
    ],
  }),
].map((s) => [s.id, s]));
