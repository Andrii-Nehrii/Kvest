// Глава 2, участок 3 — ночь и утро не дома: в машине, на улице, на хуторе, в мастерской, в Ahrensburg.
// Кто один, может утром дойти до партнёра (к двери — и сразу КТ 3: встреча решается на точке, как на КТ 2).
import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { driveTo, waitHour } from '../chapter1/common';
import { cp3Action } from './night';
import { AM, CITY, EVE, HARBURG, ISLAND, MORNING, NIGHT, PM, SOUTH, atAny, carHereAny, radio2 } from './world2';

const S = (s: Scene) => s;
const isA: Cond = { me: 'A' };
const isB: Cond = { me: 'B' };
const together: Cond = { flag: 'w.together' };
const alone: Cond = { not: together };
const after = (h: number, m = 0): Cond => ({ after: at(11, h, m) });
const done = (flag: string): Cond => ({ flag: `$.${flag}` });
const notDone = (flag: string): Cond => ({ not: done(flag) });
const once = (flag: string, extra: Effect[] = []): Effect[] => [{ set: `$.${flag}`, value: true }, ...extra];
const inCar = { outdoor: false, wet: false, tempC: 6 };
const outside = { outdoor: true };
/** Велосипед при B: накачан, не отобран — и B в дороге (дома он стоит во дворе). */
const onBike: Cond = { all: [{ flag: '$.bike_ready' }, { not: { flag: '$.bike_lost' } }, { not: atAny(['b_flat', 'b_stairs', 'b_yard', 'b_street']) }] };
const MOVE_KEYS: Cond = { has: 'car_keys' };

/** Пешком или на велосипеде: велосипед быстрее, остальное время — пешком (move удлиняет при травмах). */
const leg = (bike: number, foot: number): Pick<ActionDef, 'minutes' | 'move' | 'outcomes'> => ({
  minutes: bike, move: true,
  outcomes: [{ id: 'bike', when: onBike }, { id: 'foot', effects: [{ wait: foot - bike, activity: 'moderate' }] }],
});

/** Подойти к двери партнёра — и сразу на точку: дома ли он(а), решится там. */
const ringDoor = (label: string): ActionDef[] => [
  { id: 'c2_ring', label, minutes: 3, terminal: true, goto: 'c2_cp3', when: { not: { cp: 3 } }, effects: [{ set: '$.at_partner_door', value: true }, { set: '$.c3', value: true }] },
  // Днём второго дня (после КТ 3) — то же, но встреча решится на КТ 4.
  { id: 'c4_ring', label, minutes: 3, terminal: true, goto: 'c4_cp4', when: { cp: 3 }, effects: [{ set: '$.at_partner_door4', value: true }, { set: '$.c4', value: true }] },
];

export const awayScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────── В машине ─────────────
  S({
    id: 'c2_car', for: 'any', chapter: 'ch2', title: 'Ночь в машине', ambient: inCar,
    onEnter: [{ if: { npc: 'jannik', at: 'a_car' }, then: [{ set: '$.c2_jannik', value: true }] }],
    text: [
      { when: { all: [NIGHT, atAny(['hh_city', 'hh_eppendorf', 'hh_ring3', 'elbtunnel'])] }, text: 'Ночь в машине посреди города. За стёклами — тёмные дома без единого огня, рыжее зарево на востоке и сирены, то ближе, то дальше. Ты запираешь двери изнутри и опускаешь спинку.' },
      { when: { all: [NIGHT, atAny(['harburg', 'harburg_station'])] }, text: 'Площадь у вокзала Harburg пуста. У моста — синие огни оцепления. Иногда мимо проезжает армейский грузовик, и машина вздрагивает от его тяжести.' },
      { when: { all: [NIGHT, atAny(['a7_jam', 'a1_station'])] }, text: 'Пробка так и стоит: сотни тёмных машин, в некоторых — люди, спят или делают вид, как ты. Кто-то через три ряда слушает радио, и обрывки слов долетают сквозь стекло.' },
      { when: { all: [NIGHT, { at: 'b_street' }] }, text: 'Её дом — в двух шагах. Окна четвёртого этажа тёмные. Ты смотришь на них, пока глаза не начинают слезиться.' },
      { when: { all: [NIGHT, atAny(SOUTH)] }, text: 'Ночь в машине на пустой парковке. Тока в городе нет — ни фонарей, ни окон. Только звёзды, впервые за много дней.' },
      { when: { all: [NIGHT, together] }, text: '{partner} рядом — {pm:откинул|откинула} спинку и смотрит в потолок. Вы держитесь за руки, как подростки в кино, и молчите.' },
      { when: { all: [NIGHT, { npc: 'jannik', at: 'a_car' }] }, text: 'Янник спит на пассажирском, прижавшись виском к стеклу, обнимая свой рюкзак.' },
      { when: { all: [{ not: AM }, { not: NIGHT }] }, text: 'День в машине. Стёкла запотевают от дыхания, спина ноет, время тянется. Мимо иногда проходят люди — в одну сторону, к Messe.' },
      { when: AM, text: 'Рассвет в машине: стёкла запотели изнутри, ноги ледяные, шея затекла так, что больно повернуть голову. Ты протираешь окно рукавом.' },
      { when: { all: [AM, done('c2_jannik'), { not: { npc: 'jannik', at: 'a_car' } }] }, text: 'Пассажирское сиденье пустое. На нём записка, вырванная из тетради: «Danke für alles. Ich gehe zu Lea. Viel Glück. — J.»' },
      { when: { all: [AM, atAny(['harburg', 'harburg_station']), after(8, 0)] }, text: 'У вокзала выстраиваются автобусы с табличкой «Sonderfahrt Messe». У дверей — солдаты: смотрят руки, шею, подносят градусник ко лбу. Очередь тянется через всю площадь.' },
      { when: { all: [AM, atAny(['a7_jam', 'a1_station'])] }, text: 'Пробка оживает: машины разворачиваются через разделительную полосу и уходят на юг. Тоннель впереди перекрыт бетонными блоками, у них — бронемашина.' },
      { when: { all: [AM, atAny(CITY)] }, text: 'Утренний город — пустые улицы, патрули, редкие люди с рюкзаками, все в одну сторону. На перекрёстке — армейский грузовик.' },
    ],
    actions: [
      { id: 'c2_sleep', label: 'Откинуть спинку и попытаться уснуть', minutes: 0, repeatable: true, when: NIGHT, effects: [{ sleep: 330 }],
        text: 'Ты закрываешь глаза. Сон приходит кусками — холодными, тревожными.' },
      { id: 'c2_engine', label: 'Погреть салон двигателем четверть часа', minutes: 15, repeatable: true, activity: 'rest',
        when: { all: [NIGHT, isA, MOVE_KEYS, { fuelFor: 'opel_corsa', km: 4 }] },
        text: 'Двигатель урчит, из печки идёт тёплый воздух с запахом пыли. Ты держишь руки над решёткой и думаешь о том, сколько это стоит в литрах.',
        effects: [{ drive: 'opel_corsa', km: 4 }, { body: 'stress', delta: -3 }] },
      { id: 'c2_patrol', label: 'Опустить стекло и держать руки на виду', minutes: 6, when: { all: [done('c2_patrol'), notDone('patrol_done')] },
        text: 'Солдат светит тебе в лицо, потом на руки, на заднее сиденье. Молодой, моложе тебя. — Ausgangssperre. Bis sechs Uhr bleiben Sie im Fahrzeug, verstanden? Утром будет объявление по радио. — Он медлит. — Не выходите ночью. Даже если кто-то стучит. Особенно если стучит.',
        effects: once('patrol_done', [{ learn: 'f_curfew' }, { body: 'stress', delta: 6 }]) },
      { id: 'c2_shadow_still', label: 'Не шевелиться', minutes: 15, when: { all: [done('c2_shadow'), notDone('shadow_done')] },
        text: 'Ты не дышишь. Он стоит, прижав ладони к стеклу, и смотрит сквозь тебя. Потом голова дёргается на какой-то звук вдалеке, и он уходит — медленно, всем телом, по разделительной полосе. Ты долго не можешь разжать пальцы на ручке двери.',
        effects: once('shadow_done', [{ learn: 'f_turned_seen', quiet: true }, { body: 'stress', delta: 12 }]) },
      { id: 'c2_shadow_drive', label: 'Завести машину и отъехать', minutes: 5, when: { all: [done('c2_shadow'), notDone('shadow_done'), isA, MOVE_KEYS, { fuelFor: 'opel_corsa', km: 1 }] },
        text: 'Двигатель схватывает с первого раза. На звук он бьётся в стекло лбом — раз, другой, трещина ползёт по боковому. Ты трогаешься, он идёт следом, потом отстаёт. Через двести метров ты останавливаешься. В зеркале — пусто.',
        effects: [{ drive: 'opel_corsa', km: 1 }, ...once('shadow_done', [{ learn: 'f_drawn_to_light', quiet: true }, { body: 'stress', delta: 10 }])] },
      { id: 'c2_jannik', label: 'Поговорить с Янником', minutes: 20, combinable: true, when: { all: [NIGHT, { npc: 'jannik', at: 'a_car' }, notDone('jannik_talk')] },
        text: 'Янник не спит. Рассказывает про Леа: медсестра, познакомились на концерте, на прошлой неделе поссорились из-за ерунды. — Я ей вчера написал «прости». Не знаю, дошло ли. — Он смеётся. — Глупо, да? Мир кончается, а я про ссору.',
        effects: [{ npc: 'jannik', trust: 6 }, ...once('jannik_talk', [{ body: 'stress', delta: -4 }])] },
      radio2('radio', 'Включить радио в машине'),
      { ...waitHour('Переждать час в машине', 'c2_wait'), when: { not: NIGHT } },
      // Утро: кто один — может доехать или дойти до партнёра или домой. Вместе — решаете на точке.
      { id: 'c2_drive_b', label: 'Доехать до её дома в Barmbek', minutes: 30, terminal: true, goto: 'c2_bdoor',
        when: { all: [MORNING, alone, isA, atAny(CITY), { not: { at: 'b_street' } }, { partnerAt: 'b_flat' }] },
        enabled: { all: [MOVE_KEYS, { fuelFor: 'opel_corsa', km: 12 }] }, disabledReason: 'Нужны ключи и бензин — километров на двенадцать',
        text: 'Утренний город без пробок — впервые за всю жизнь. Ты едешь мимо армейских грузовиков и людей с чемоданами и не останавливаешься.',
        effects: driveTo(8, 'b_street', 1.5) },
      { id: 'c2_walk_b', label: 'Идти пешком к ней в Barmbek', minutes: 110, move: true, activity: 'moderate', terminal: true, goto: 'c2_bdoor',
        when: { all: [MORNING, alone, isA, atAny(CITY), { not: { at: 'b_street' } }, { partnerAt: 'b_flat' }] },
        text: 'Семь километров через утренний город. Патрули смотрят на тебя и не останавливают: ты идёшь не туда, куда все, но комендантский час кончился.',
        effects: [{ move: 'b_street' }] },
      { id: 'c2_ring_b', label: 'Ещё раз позвонить в её домофон', minutes: 3, terminal: true, goto: 'c2_cp3',
        when: { all: [MORNING, alone, isA, { at: 'b_street' }, { not: { cp: 3 } }] },
        effects: [{ set: '$.at_partner_door', value: true }, { set: '$.c3', value: true }] },
      { id: 'c4_ring_b', label: 'Ещё раз позвонить в её домофон', minutes: 3, terminal: true, goto: 'c4_cp4', when: { all: [isA, alone, { at: 'b_street' }, { cp: 3 }, { partnerAt: 'b_flat' }] },
        effects: [{ set: '$.at_partner_door4', value: true }, { set: '$.c4', value: true }] },
      { id: 'c2_drive_home', label: 'Ехать домой в Buchholz', minutes: 35, terminal: true, goto: 'c2_ayard',
        when: { all: [MORNING, alone, isA, atAny([...HARBURG, ...ISLAND])] },
        enabled: { all: [MOVE_KEYS, { fuelFor: 'opel_corsa', km: 26 }] }, disabledReason: 'Нужны ключи и бензин — километров на двадцать пять',
        text: 'B75 на юг почти пустая: все, кто хотел уехать, уехали вчера. Поля в инее, над ними — вороны. На въезде в Buchholz тебя никто не встречает.',
        effects: driveTo(22, 'a_yard', 1.2) },
      { id: 'c2_drive_home_near', label: 'Доехать домой', minutes: 10, terminal: true, goto: 'c2_ayard',
        when: { all: [MORNING, alone, isA, atAny(SOUTH), { not: { at: 'a_yard' } }] },
        enabled: { all: [MOVE_KEYS, { fuelFor: 'opel_corsa', km: 4 }] }, disabledReason: 'Нужны ключи и бензин',
        effects: driveTo(4, 'a_yard') },
      { id: 'c2_walk_home', label: 'Идти домой в Buchholz пешком', minutes: 300, move: true, activity: 'moderate', terminal: true, goto: 'c2_ayard',
        when: { all: [MORNING, alone, isA, atAny([...HARBURG, ...ISLAND])] },
        text: 'Двадцать километров по обочине B75. Через час ноги перестают болеть и начинают просто идти. Мимо проезжают машины — ни одна не останавливается. Ты бы тоже не остановился.',
        effects: [{ move: 'a_yard' }] },
      { id: 'c2_station', label: 'Дойти до вокзала Harburg — там автобусы', minutes: 15, move: true, terminal: true, goto: 'c2_out',
        when: { all: [MORNING, alone, atAny(['harburg', 'a7_jam', 'a1_station'])] }, effects: [{ move: 'harburg_station' }] },
      cp3Action(),
    ],
  }),

  // ───────────── Под открытым небом / в чужом подъезде ─────────────
  S({
    id: 'c2_out', for: 'any', chapter: 'ch2', title: 'Ночь не дома', ambient: outside,
    text: [
      { when: { all: [NIGHT, atAny(['wilhelmsburg_stairs', 'wilhelmsburg'])] }, text: 'Чужой подъезд в Wilhelmsburg. Бетонный пол, батарея чуть тёплая, запах кошек и сырости. Наверху кто-то кашляет за дверью — всю ночь, не переставая.' },
      { when: { all: [NIGHT, { at: 'b75_road' }] }, text: 'Автобусная будка на B75. Стекло с одной стороны выбито, ветер насквозь. Изредка мимо проносятся машины — на юг, без фар.' },
      { when: { all: [NIGHT, atAny(['harburg', 'harburg_station'])] }, text: 'Вокзал Harburg закрыт. Ты находишь угол под навесом автобусной станции, за рекламным щитом, где тебя не видно с площади. Синие огни оцепления у моста не гаснут всю ночь.' },
      { when: { all: [NIGHT, { at: 'a_street' }] }, text: 'Ступеньки у его подъезда. Дверь заперта, окна второго этажа тёмные — во всём квартале нет тока. Ты сидишь, обхватив колени, и вздрагиваешь от каждого шороха во дворе.' },
      { when: { all: [NIGHT, { at: 'b_street' }] }, text: 'Подворотня напротив её дома. Окна четвёртого этажа тёмные. Ты сидишь на корточках у стены и смотришь на её подъезд.' },
      { when: { all: [NIGHT, { not: atAny(['wilhelmsburg_stairs', 'wilhelmsburg', 'b75_road', 'harburg', 'harburg_station', 'a_street', 'b_street']) }] },
        text: 'Ночь застаёт тебя под открытым небом. Ты находишь угол, где тебя не видно с улицы, и ждёшь рассвета, прислушиваясь к каждому звуку.' },
      { when: { all: [{ not: AM }, { not: NIGHT }] }, text: 'День под открытым небом. Холодно, сухо, серо. Ты двигаешься, чтобы не замёрзнуть, и всё время оглядываешься.' },
      { when: AM, text: 'Рассвет. Ты не чувствуешь пальцев ног, и всё тело ноет так, будто тебя били. Но ночь кончилась.' },
      { when: { all: [AM, atAny(['harburg', 'harburg_station']), after(8, 0)] }, text: 'У вокзала выстраиваются автобусы с табличкой «Sonderfahrt Messe». У дверей — солдаты с градусниками. Очередь — через всю площадь.' },
      { when: { all: [AM, { at: 'a_street' }] }, text: 'Buchholz просыпается: соседи выносят чемоданы и косятся на тебя. Его машины во дворе нет.' },
      { when: { all: [AM, atAny(['wilhelmsburg_stairs', 'wilhelmsburg'])] }, text: 'Из подъезда видно улицу: пусто, только чайки и перевёрнутый мусорный бак. Вдали, у моста на Harburg, — зелёные грузовики.' },
    ],
    actions: [
      { ...waitHour('Переждать час, держась в тени', 'c2_wait'), when: { not: NIGHT } },
      { id: 'c2_doze', label: 'Задремать сидя, сколько получится', minutes: 0, repeatable: true, when: NIGHT, effects: [{ sleep: 240 }],
        text: 'Ты закрываешь глаза, обняв рюкзак. Холод будит тебя каждые полчаса.' },
      { id: 'c2_to_harburg', label: 'Идти в Harburg — на юг пропускают', ...leg(25, 60), terminal: true, goto: 'c2_out',
        when: { all: [MORNING, alone, atAny(['wilhelmsburg_stairs', 'wilhelmsburg', 'steinwerder'])] },
        text: 'У моста — солдаты, но на юг пропускают: смотрят руки, шею, ко лбу — градусник. — Weiter. — Harburg утром — пустой и серый, на площади у вокзала — автобусы.',
        effects: [{ move: 'harburg' }, { learn: 'f_corridor', kind: 'rumor' }] },
      { id: 'c2_north_closed', label: 'Вернуться домой, на север', minutes: 1, when: { all: [MORNING, alone, isB, atAny([...ISLAND, ...HARBURG])] },
        enabled: { not: { always: true } }, disabledReason: 'На север не пускают: тоннели закрыты, на мостах — солдаты',
        text: 'Ты подходишь к посту у моста. — Richtung Innenstadt? Nein. Niemand. — Солдат даже не смотрит на тебя. На север сегодня не пускают никого.',
        effects: [{ learn: 'f_tunnels_closed' }, { learn: 'f_corridor' }] },
      { id: 'c2_walk_a', label: 'Идти дальше к нему в Buchholz', ...leg(50, 160), terminal: true, goto: 'c2_adoor',
        when: { all: [MORNING, alone, isB, { at: 'b75_road' }] },
        text: 'Десять километров. Поля, лес, снова поля. Ноги идут сами. Знак «Buchholz i.d. Nordheide» ты гладишь ладонью, проходя мимо.',
        effects: [{ move: 'a_street' }] },
      { id: 'c2_hbg_to_a', label: 'Идти к нему в Buchholz', ...leg(90, 300), terminal: true, goto: 'c2_adoor',
        when: { all: [MORNING, alone, isB, atAny(HARBURG)] },
        text: 'Двадцать километров на юг по B75. Солдаты на выезде из Harburg машут рукой: на юг — можно. Дальше — поля, лес, редкие машины. Ты идёшь и считаешь шаги, потом перестаёшь считать.',
        effects: [{ move: 'a_street' }] },
      { id: 'c2_station', label: 'Дойти до вокзала Harburg — там автобусы', minutes: 15, move: true, terminal: true, goto: 'c2_out',
        when: { all: [MORNING, alone, { at: 'harburg' }] }, effects: [{ move: 'harburg_station' }] },
      { id: 'c2_ask_neighbors', label: 'Спросить соседей про {partner.acc}', minutes: 8, combinable: true, when: { all: [MORNING, isB, { at: 'a_street' }, notDone('asked_neighbors')] },
        text: 'Мужчина с третьего этажа, который грузит коробки в «пассат», качает головой: — Уехал вчера утром на своей машине. Не возвращался. — Он смотрит на тебя внимательнее. — Вы его девушка? Он вас искал, наверное. Все кого-то ищут.',
        effects: once('asked_neighbors') },
      { id: 'c4_wait_a', label: 'Ждать его здесь, у двери, до ночи', minutes: 3, terminal: true, goto: 'c4_cp4', when: { all: [isB, alone, { at: 'a_street' }, { cp: 3 }] },
        effects: [{ set: '$.at_partner_door4', value: true }, { set: '$.c4', value: true }] },
      { id: 'c2_wait_a', label: 'Ждать его здесь, у двери', minutes: 3, terminal: true, goto: 'c2_cp3', when: { all: [isB, { at: 'a_street' }, after(7, 30), { not: { cp: 3 } }] },
        text: 'Ты садишься на ступеньки так, чтобы видеть въезд во двор. Если он вернётся — он вернётся сюда.',
        effects: [{ set: '$.at_partner_door', value: true }, { set: '$.c3', value: true }] },
      { id: 'c2_ring_b', label: 'Ещё раз позвонить в её домофон', minutes: 3, terminal: true, goto: 'c2_cp3', when: { all: [MORNING, isA, { at: 'b_street' }, { not: { cp: 3 } }] },
        effects: [{ set: '$.at_partner_door', value: true }, { set: '$.c3', value: true }] },
      { id: 'c4_ring_b', label: 'Ещё раз позвонить в её домофон', minutes: 3, terminal: true, goto: 'c4_cp4', when: { all: [isA, alone, { at: 'b_street' }, { cp: 3 }, { partnerAt: 'b_flat' }] },
        effects: [{ set: '$.at_partner_door4', value: true }, { set: '$.c4', value: true }] },
      cp3Action(),
    ],
  }),

  S({
    id: 'c2_adoor', for: 'any', chapter: 'ch2', location: 'a_street', title: 'Его дом', ambient: outside,
    text: [{ text: 'Красный кирпич, три этажа, мокрый газон, шесть машин во дворе — нет, уже четыре. Звонок без тока молчит. Ты стоишь перед дверью подъезда и не можешь заставить себя постучать: а если никого?' }],
    actions: ringDoor('Стучать в дверь и звать его'),
  }),
  S({
    id: 'c2_bdoor', for: 'any', chapter: 'ch2', location: 'b_street', title: 'Её дом', ambient: outside,
    text: [{ text: 'Её улица. Её подъезд, каштан во дворе, велопарковка. Окна четвёртого этажа — ты смотришь на них снизу и не можешь понять, есть ли там кто-нибудь.' }],
    actions: ringDoor('Позвонить в домофон'),
  }),

  // ───────────── Хутор Людеманов ─────────────
  S({
    id: 'c2_farm', for: 'any', chapter: 'ch2', location: 'hof_luedemann', title: 'Хутор Людеманов', safe: true,
    text: [
      { when: NIGHT, text: 'Ночь на хуторе. Хенрике отвела тебе угол в старом Altenteil — пристройке, где когда-то жили старики: железная кровать, печка, холод из щелей. Во дворе бродит собака. За стеной кто-то ворочается — Павел.' },
      { when: { all: [NIGHT, { npc: 'deniz', at: 'hof_luedemann' }] }, text: 'Дениз с братом спят в своей машине у сарая — Хенрике пустила их во двор, но не в дом.' },
      { when: { all: [done('farm_lights'), notDone('lights_done')] }, text: 'Фары на краю поля всё ещё горят. Собака не умолкает. Во дворе, у ворот, — силуэт Оле с ружьём.' },
      { when: PM, text: 'День на хуторе. Работа не кончается: куры, дрова, вода из колодца, картошка, забор. Хенрике везде и нигде, Оле — с ружьём на плече, Павел — молча и быстро.' },
      { when: EVE, text: 'Вечер. В доме топится печь, на столе — керосиновая лампа: генератор берегут. За окнами — темнота, какой в городе не бывает, и собака, которая ходит вдоль забора.' },
      { when: AM, text: 'Хутор просыпается раньше тебя: в пять Хенрике уже на ногах, в шесть Павел кормит кур, Оле с ружьём на плече обходит забор. Пахнет дымом, навозом и кофе. Над полями — иней и тишина, какой в городе не бывает.' },
    ],
    actions: [
      { id: 'c2_lights_ole', label: 'Выйти к Оле', minutes: 25, risky: true, when: { all: [done('farm_lights'), notDone('lights_done')] },
        outcomes: [
          { id: 'calm', check: { traits: ['persuasion'], difficulty: 4, uses: ['focus'] },
            text: 'Оле стоит у ворот, ружьё у плеча, палец на спуске. — Не стреляй, — говоришь ты тихо. — Они только смотрят. Выстрелишь — вернутся с друзьями. — Он не опускает ружьё, но и не стреляет. Через десять минут фары гаснут, машина разворачивается и уезжает. Оле сплёвывает. — Нормально, — говорит он. Это много, для Оле.',
            effects: once('lights_done', [{ npc: 'ole', trust: 8, remember: '$:stood_watch' }, { learn: 'f_farm_lights' }]) },
          { id: 'shot', text: 'Ты не успеваешь ничего сказать: Оле стреляет поверх машины. Грохот, собака визжит, фары дёргаются и уносятся по дороге. — Пусть знают, — говорит Оле. Хенрике в окне ничего не говорит, но смотрит на сына долго.',
            effects: once('lights_done', [{ npc: 'ole', trust: 4, remember: '$:stood_watch' }, { learn: 'f_farm_lights' }, { body: 'stress', delta: 6 }]) },
        ] },
      { id: 'c2_lights_stay', label: 'Остаться в кровати', minutes: 30, activity: 'rest', when: { all: [done('farm_lights'), notDone('lights_done')] },
        text: 'Ты лежишь и слушаешь собаку. Через полчаса она замолкает. Утром Оле, проходя мимо, бросает: — Спал? Ну-ну.',
        effects: once('lights_done', [{ npc: 'ole', trust: -2 }, { learn: 'f_farm_lights' }]) },
      { id: 'c2_breakfast', label: 'Завтрак за большим столом у Хенрике', minutes: 30, combinable: true, when: { all: [MORNING, notDone('c2_ate')] },
        text: 'Яйца, хлеб домашней выпечки, масло, кофе из большого кофейника. Хенрике ест быстро и смотрит на тебя поверх кружки. — Правила тут простые, — говорит она. — Работают все. Кто заболел — в старый курятник, пока не станет ясно. Решаю я. — Оле хмыкает. Павел улыбается в тарелку.',
        effects: once('c2_ate', [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -20 }, { body: 'stress', delta: -6 }, { npc: 'henrike', trust: 2 }]) },
      { id: 'c2_hens', label: 'Помочь Павлу с курами', minutes: 40, activity: 'light', combinable: true, when: { all: [MORNING, notDone('c2_hens')] },
        text: 'Павел показывает, где зерно, где вода, как не дать петуху себя клюнуть. Говорит по-немецки с сильным акцентом, иногда сбивается на польский. Его автобус домой отменили позавчера. — Жена звонила в субботу. Потом — ничего, — говорит он и долго смотрит на кур.',
        effects: once('c2_hens', [{ npc: 'pawel', trust: 8 }]) },
      { id: 'c2_wood', label: 'Колоть дрова у сарая', minutes: 60, activity: 'heavy', combinable: true, when: { all: [MORNING, notDone('c2_wood')] },
        text: 'Колун, чурбак, полено. Первые десять минут — неуклюже, потом тело вспоминает. Когда ты разгибаешься, у сарая стоит Хенрике и смотрит на поленницу. Ничего не говорит. Кивает и уходит.',
        effects: once('c2_wood', [{ npc: 'henrike', trust: 6 }, { body: 'stress', delta: -4 }]) },
      { id: 'c2_henrike', label: 'Спросить Хенрике про {partner.acc}', minutes: 10, combinable: true, when: { all: [MORNING, isA, notDone('c2_henrike_b')] },
        outcomes: [
          { id: 'yes', when: { npc: 'henrike', trust: ['>=', 25] },
            text: 'Хенрике слушает, не перебивая. — Привози, — говорит она. — Если работает — место найдётся. Если нет — тоже найдётся, но будет работать. — Она почти улыбается.',
            effects: once('c2_henrike_b', [{ set: 'w.henrike_yes', value: true }, { learn: 'f_henrike_yes' }]) },
          { id: 'maybe', text: '— Посмотрим, — говорит Хенрике. — Ты сам здесь первый день. Покажи сначала, чего стоишь ты.',
            effects: once('c2_henrike_b') },
        ] },
      radio2('radio', 'Послушать радио на кухне у Хенрике'),
      cp3Action(),
    ],
  }),

  // ───────────── Мастерская Дениза ─────────────
  S({
    id: 'c2_workshop', for: 'any', chapter: 'ch2', location: 'deniz_workshop', title: 'Мастерская Айдына', safe: true,
    text: [
      { when: { all: [NIGHT, { npc: 'deniz', at: 'deniz_workshop' }] }, text: 'Ночь в мастерской. Бетонный пол, раскладушка между двумя машинами на подъёмниках, запах масла и холодного железа. Дениз сидит в кресле у ворот с монтировкой на коленях и, кажется, не спит вовсе.' },
      { when: { all: [NIGHT, { npc: 'kerem', at: 'deniz_workshop' }] }, text: 'Керем храпит на заднем сиденье чужого «гольфа».' },
      { when: { all: [done('ws_gate'), notDone('gate_done')] }, text: 'Ворота дёргаются. Снаружи — голоса и смех. Дениз стоит у створки, не шевелясь.' },
      { when: { all: [{ not: AM }, { not: NIGHT }, { npc: 'deniz', at: 'deniz_workshop' }] }, text: 'Мастерская, второй день. Дениз то у фургона, то у радио, то у ворот. Говорит мало.' },
      { when: { all: [{ not: AM }, { not: NIGHT }, { not: { npc: 'deniz', at: 'deniz_workshop' } }, { flag: 'w.workshop_keys' }] }, text: 'Пустая мастерская. Ключи Дениза у тебя в кармане. Бетон, железо, запах масла — и тишина.' },
      { when: { all: [AM, { npc: 'deniz', at: 'deniz_workshop' }] }, text: 'Утро. Дениз варит кофе в турке на газовой горелке — крепкий, со специями, на две чашки. Радио на верстаке бормочет одно и то же уже который раз.' },
      { when: { all: [{ not: { npc: 'deniz', at: 'deniz_workshop' } }, { not: { flag: 'w.workshop_keys' } }] }, text: 'Ворота мастерской заперты. Ты стучишь — три раза и два, как он учил. Никто не отвечает.' },
    ],
    actions: [
      { id: 'c2_gate_stand', label: 'Встать рядом с Денизом у ворот', minutes: 10, risky: true, when: { all: [done('ws_gate'), notDone('gate_done')] },
        text: 'Ты берёшь со стеллажа гаечный ключ и встаёшь рядом. Дениз, не оборачиваясь, говорит громко, по-немецки, чтобы снаружи слышали: — Нас тут четверо, и у нас есть чем встретить. Идите дальше. — Пауза. Смех стихает. Шаги уходят. Дениз выдыхает и хлопает тебя по плечу.',
        effects: once('gate_done', [{ npc: 'deniz', trust: 8, remember: '$:stood_gate' }, { body: 'stress', delta: 6 }]) },
      { id: 'c2_gate_hide', label: 'Отойти вглубь, за машины', minutes: 10, when: { all: [done('ws_gate'), notDone('gate_done')] },
        text: 'Ты прячешься за подъёмником. Дениз что-то кричит в щель ворот, бьёт монтировкой по железу. Голоса уходят. Потом он долго смотрит в твою сторону и ничего не говорит.',
        effects: once('gate_done', [{ npc: 'deniz', trust: -3 }]) },
      { id: 'c2_coffee', label: 'Выпить с Денизом кофе и спросить о планах', minutes: 15, combinable: true, when: { all: [MORNING, { npc: 'deniz', at: 'deniz_workshop' }, notDone('ws_coffee')] },
        outcomes: [
          { id: 'kerem', when: { npc: 'kerem', at: 'deniz_workshop' }, text: '— Брат здесь — значит, можно ехать, — говорит Дениз. — К Хенрике, к полудню. Дизель у меня, генератор у неё. Ей нужны руки и голова, которая умеет чинить. — Он смотрит на тебя. — Твои руки ей тоже нужны.',
            effects: once('ws_coffee', [{ npc: 'deniz', trust: 3 }, { learn: 'f_fuel_ban' }]) },
          { id: 'alone', text: '— Жду брата, — говорит Дениз. — Без него никуда. — Он крутит в руках турку. — Бензин больше не продают, слышал? Только армии. У кого бак полный — тот теперь богач.',
            effects: once('ws_coffee', [{ npc: 'deniz', trust: 3 }, { learn: 'f_fuel_ban' }]) },
        ] },
      { id: 'c2_ws_help', label: 'Помочь Денизу: забить окна, перелить дизель', minutes: 60, activity: 'heavy', combinable: true, when: { all: [MORNING, { npc: 'deniz', at: 'deniz_workshop' }, notDone('ws_help')] },
        text: 'Фанера на окна, канистры в фургон, инструмент в ящики. Дениз работает быстро и молча, показывает жестами. Через час мастерская похожа на склад перед переездом. — Спасибо, — говорит он. По-турецки, потом по-немецки, потом по-русски — где-то выучил.',
        effects: once('ws_help', [{ npc: 'deniz', trust: 8 }]) },
      { id: 'c2_ws_petrol', label: 'Попросить у Дениза бензина', minutes: 15, combinable: true, when: { all: [MORNING, isA, { npc: 'deniz', at: 'deniz_workshop' }, notDone('ws_petrol')] },
        enabled: { npc: 'deniz', trust: ['>=', 40] }, disabledReason: 'Бензин сейчас дороже денег: просить можно у того, кто тебе обязан',
        outcomes: [
          { id: 'can', when: { has: 'can_petrol_10' }, text: 'Дениз молча идёт к «фиату» клиента, который никто уже не заберёт, и сливает бак в твою канистру. — Восемь литров. Больше там нет. Мы в расчёте, — говорит он и тут же добавляет: — Шучу. Не в расчёте.',
            effects: [{ fillCan: 'can_petrol_10', liters: 8 }, ...once('ws_petrol')] },
          { id: 'new', text: 'Дениз молча идёт к «фиату» клиента, который никто уже не заберёт, и сливает бак в старую канистру. — Восемь литров. Больше там нет. Канистру не возвращай.',
            effects: [{ give: 'can_petrol_10', fuel: 8 }, ...once('ws_petrol')] },
        ] },
      { id: 'c2_ws_wait', label: 'Ждать у ворот', minutes: 30, activity: 'rest', repeatable: true, when: { not: { npc: 'deniz', at: 'deniz_workshop' } },
        text: 'Ты сидишь у ворот на перевёрнутом ведре. Мимо промзоны проезжает пустой автобус.' },
      { ...waitHour('Переждать час в мастерской', 'c2_wait'), when: { all: [{ not: NIGHT }, { npc: 'deniz', at: 'deniz_workshop' }] } },
      { id: 'c2_ws_home', label: 'Пешком домой', minutes: 45, move: true, activity: 'moderate', terminal: true, goto: 'c2_ayard',
        when: { all: [MORNING, alone, isA] }, effects: [{ move: 'a_yard' }] },
      radio2('radio', 'Послушать радио на верстаке'),
      cp3Action(),
    ],
  }),

  // ───────────── Ahrensburg, дом Тиссенов ─────────────
  S({
    id: 'c2_ahrensburg', for: 'any', chapter: 'ch2', location: 'ahrensburg', title: 'Ahrensburg', safe: true,
    text: [
      { when: NIGHT, text: 'Ночь в доме Тиссенов. Тепло, чисто, пахнет стиральным порошком. Мерле спит, свернувшись, на соседней кровати. Внизу её отец ходит из комнаты в комнату и проверяет окна — раз в час, ты уже научилась узнавать его шаги.' },
      { when: { all: [{ not: AM }, { not: NIGHT }] }, text: 'День в доме Тиссенов. Уве что-то пилит в гараже, Биргит перебирает кладовку, Мерле спит после обеда, как ребёнок. Здесь всё ещё есть ток, и от этого кажется, что ничего не случилось.' },
      { when: AM, text: 'Утро. Биргит жарит блины — «пока есть мука и ток». Уве сидит у радио с блокнотом и записывает что-то мелким почерком. Мерле в пижаме ест прямо со сковородки и впервые за двое суток похожа на себя.' },
    ],
    actions: [
      { id: 'c2_breakfast', label: 'Сесть со всеми завтракать', minutes: 30, combinable: true, when: { all: [MORNING, notDone('c2_ate')] },
        text: 'Блины с яблочным пюре, какао, хлеб. Биргит подкладывает тебе, не спрашивая. Уве за столом молчит, но один раз пододвигает тебе сахарницу. Мерле пинает тебя под столом и подмигивает: «я же говорила».',
        effects: once('c2_ate', [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -20 }, { body: 'stress', delta: -8 }, { npc: 'birgit', trust: 5 }]) },
      { id: 'c2_uwe', label: 'Спросить Уве, что передают', minutes: 15, combinable: true, when: { all: [MORNING, notDone('c2_uwe')] },
        text: 'Уве показывает блокнот: время, частоты, слова. Katastrophenfall. Комендантский час. Мосты на юг — с проверкой. — В город с юга не пускают, — говорит он. — А из нашего района в город — пока можно. Пока. — Он закрывает блокнот. — Ты хочешь назад.',
        effects: once('c2_uwe', [{ learn: 'f_kfall' }, { learn: 'f_curfew' }, { learn: 'f_corridor' }, { npc: 'uwe', trust: 3 }]) },
      { id: 'c2_ahr_help', label: 'Помочь Уве закрыть окна подвала', minutes: 45, activity: 'moderate', combinable: true, when: { all: [MORNING, notDone('c2_ahr_help')] },
        text: 'Доски, саморезы, шуруповёрт на последнем заряде. Уве держит, ты крутишь. Он поправляет тебя дважды, потом перестаёт. — Хорошо, — говорит он в конце, рассматривая работу. Мерле потом скажет, что слово «хорошо» от отца — это как медаль.',
        effects: once('c2_ahr_help', [{ npc: 'uwe', trust: 8 }]) },
      { id: 'c2_merle', label: 'Поговорить с Мерле', minutes: 15, combinable: true, when: { all: [MORNING, notDone('c2_ahr_merle')] },
        text: '— Оставайся, — говорит Мерле. — Тут есть ток, холодильник, папа, который умеет всё. Инсулина в холоде — на сколько надо. — Она смотрит на тебя и сразу всё понимает. — Ты к нему. Ну конечно. — Она обнимает тебя. — Тогда возьми хотя бы мамины бутерброды.',
        effects: once('c2_ahr_merle', [{ npc: 'merle', trust: 4 }, { give: 'sandwich', qty: 2 }]) },
      { id: 'c2_ahr_ride', label: 'Попросить Уве отвезти тебя домой, в Barmbek', minutes: 70, terminal: true, goto: 'c2_bstreet', when: { all: [MORNING, alone, isB, notDone('c2_ahr_ride')] },
        enabled: { npc: 'uwe', trust: ['>=', 8] }, disabledReason: 'Уве не повезёт в закрытый город почти незнакомую девушку',
        text: 'Уве ничего не говорит — просто берёт ключи. Мерле плачет на крыльце, Биргит суёт тебе пакет с едой. Двадцать километров — час с лишним: блокпост на въезде в Wandsbek, армейский грузовик поперёк Ahrensburger Straße, объезд дворами. У твоего дома Уве глушит мотор. — Береги себя, — говорит он. — И её, своего… кого ты там ждёшь.',
        effects: [{ set: '$.c2_ahr_ride', value: true }, { give: 'sandwich', qty: 2 }, { npc: 'uwe', trust: 3 }] },
      { id: 'c2_ahr_walk', label: 'Идти домой в Barmbek пешком', minutes: 300, move: true, activity: 'moderate', terminal: true, goto: 'c2_bstreet',
        when: { all: [MORNING, alone, isB, { cp: 3 }, { v: 'w.day2', op: '==', value: 'b_flat' }] },
        text: 'Двадцать километров по Ahrensburger Straße — мимо закрытых магазинов, армейского поста в Wandsbek, людей, идущих навстречу, из города. Биргит дала тебе бутерброды и термос. Мерле долго машет с крыльца.',
        effects: [{ give: 'sandwich', qty: 2 }] },
      radio2('radio', 'Послушать радио на кухне'),
      cp3Action(),
    ],
  }),

  // ───────────── КТ 3 ─────────────
  S({
    id: 'c2_cp3', for: 'any', chapter: 'ch2', checkpoint: 3, title: 'Утро', universal: false, calm: true, ambient: { outdoor: false, wet: false },
    text: [
      { when: done('at_partner_door'), text: 'Ты стучишь, зовёшь, ждёшь. Время тянется так, будто кто-то держит его рукой.' },
      { when: { all: [{ not: done('at_partner_door') }, together] }, text: 'Утро второго дня. Вы сидите рядом и смотрите на одно и то же — на дверь, на дорогу, на то, что осталось от вчерашнего плана. Пора решать вместе.' },
      { when: { all: [{ not: done('at_partner_door') }, alone] }, text: 'Утро второго дня. Ты не знаешь, где сейчас {partner} и что {pm:он|она} решил{pm:|а}. Пора решать — хотя бы за себя.' },
    ],
    actions: [],
  }),
].map((s) => [s.id, s]));

/** Где каждый проводит ночь после КТ 2: по месту, где его застала точка. */
export function nightRoutes(): { when?: Cond; scene: string }[] {
  return [
    { when: atAny(['a_flat', 'a_stairs', 'a_yard', 'a_brockmann']), scene: 'c2_aflat' },
    { when: { all: [{ at: 'a_street' }, { any: [isA, together] }] }, scene: 'c2_aflat' },
    { when: atAny(['b_flat', 'b_stairs', 'b_yard', 'b_okafor', 'b_nowak', 'b_kiosk']), scene: 'c2_bflat' },
    { when: { all: [{ at: 'b_street' }, { any: [isB, together] }] }, scene: 'c2_bflat' },
    { when: { at: 'hof_luedemann' }, scene: 'c2_farm' },
    { when: { all: [{ at: 'deniz_workshop' }, { npc: 'deniz', at: 'deniz_workshop' }] }, scene: 'c2_workshop' },
    { when: { at: 'ahrensburg' }, scene: 'c2_ahrensburg' },
    { when: { all: [carHereAny, { any: [isA, together] }] }, scene: 'c2_car' },
    { scene: 'c2_out' },
  ];
}

/** Сцены-заглушки прежней версии (a_ch2 / b_ch2): на них могли остаться сохранения — оттуда тоже на ночёвку. */
export function chapterEntry(id: 'a_ch2' | 'b_ch2', pid: 'A' | 'B'): Scene {
  return {
    id, for: pid, chapter: 'ch2', title: 'Ночь', universal: false,
    text: [{ text: 'Ночь после первого дня. Где бы ты ни {m:был|была}, нужно как-то дожить до утра.' }],
    actions: nightRoutes().map((r, i, all) => ({
      id: `night_${i}`, label: 'Устроиться на ночь', minutes: 2, terminal: true, goto: r.scene,
      when: { all: [...(r.when ? [r.when] : []), ...all.slice(0, i).filter((x) => x.when).map((x) => ({ not: x.when! }))] },
    })),
  };
}
