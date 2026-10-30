// Глава 2, участок 4 — второй день после КТ 3: дорога (коридор через Elbbrücken, B75, автобус до Messe, A7 на север)
// и первый день на новом месте — хутор, Messe, спортзал на севере; дома — вечер, когда у укушенных начинается острая стадия.
// Вместе в одной машине вы едете одним маршрутом: развилки дороги — только объективные (время, бензин, проверка на посту),
// выбор каждого меняет его самого (тело, вещи, люди), а не маршрут. Машиной распоряжается линия A.
import type { ActionDef, Outcome, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { biteArm } from '../chapter1/a_town';
import { driveTo, waitHour } from '../chapter1/common';
import { C3, CITY, EVE, HARBURG, ISLAND, PM, SOUTH, atAny, radio2 } from './world2';

const S = (s: Scene) => s;
const isA: Cond = { me: 'A' };
const isB: Cond = { me: 'B' };
const together: Cond = { flag: 'w.together' };
const alone: Cond = { not: together };
const after = (h: number, m = 0): Cond => ({ after: at(11, h, m) });
const done = (flag: string): Cond => ({ flag: `$.${flag}` });
const notDone = (flag: string): Cond => ({ not: done(flag) });
const once = (flag: string, extra: Effect[] = []): Effect[] => [{ set: `$.${flag}`, value: true }, ...extra];
const D = (id: string): Cond => ({ v: 'w.day2', op: '==', value: id });
const SOUTH_DEST: Cond = { any: [D('farm'), D('workshop'), D('a_flat')] };
const inCar = { outdoor: false, wet: false, tempC: 8 };
const outside = { outdoor: true };

/** На посту смотрят руки, шею, лоб: свежий укус, царапина или жар (отмечено на КТ 3, одинаково на обоих телефонах). */
const myRisk: Cond = { flag: '$.check_risk' };
const partnerRisk: Cond = { any: [{ all: [isA, { flag: 'B.check_risk' }] }, { all: [isB, { flag: 'A.check_risk' }] }] };
const carRisk: Cond = { any: [myRisk, { all: [together, partnerRisk] }] };
/** Едет на машине A: сам A с ключами или B вместе с ним. */
const byCar: Cond = { any: [{ all: [isA, { has: 'car_keys' }] }, { all: [isB, together] }] };
/** Велосипед при B (в дороге). */
const onBike: Cond = { all: [isB, { flag: '$.bike_ready' }, { not: { flag: '$.bike_lost' } }] };
const tankFor = (km: number): Cond => ({ any: [isB, { fuelFor: 'opel_corsa', km }] });
/** A подходит к своей машине: она стоит у дома, а он — в квартире (или у её подъезда, во дворе). */
const ALL_PLACES = [...SOUTH, ...HARBURG, ...ISLAND, ...CITY];
const toCar: Effect = { if: isA, then: ALL_PLACES.map((p) => ({ if: { itemAt: 'opel_corsa', place: p }, then: [{ move: p }] }) as Effect) };

/** Куда ведёт дорога на юг: машина (A — с бензином, B — просто едет рядом), велосипед или пешком. */
function southArrival(km: number, minutesBike: number, minutesFoot: number): ActionDef[] {
  const dests: [string, string, string][] = [['farm', 'hof_luedemann', 'c4_farm_gate'], ['workshop', 'deniz_workshop', 'c2_workshop'], ['a_flat', 'a_yard', 'c2_ayard']];
  const car: Outcome[] = dests.flatMap(([d, loc, scene]) => [
    { id: `${d}_a`, when: { all: [D(d), isA] }, goto: scene, effects: driveTo(km + (d === 'farm' ? 7 : 0), loc) },
    { id: `${d}_b`, when: D(d), goto: scene, effects: [{ move: loc }] },
  ]);
  const self = (mode: 'bike' | 'foot'): Outcome[] => dests.map(([d, loc, scene]) => ({ id: `${d}_${mode}`, when: D(d), goto: scene, effects: [{ move: loc }] }));
  return [
    { id: 'c4_on_car', label: 'Ехать дальше', minutes: Math.round(km * 1.1), terminal: true, when: { all: [byCar, SOUTH_DEST] },
      enabled: tankFor(km + 7), disabledReason: 'Бензина не хватит — дальше только пешком', outcomes: car },
    { id: 'c4_on_bike', label: 'Крутить педали дальше', minutes: minutesBike, move: true, activity: 'moderate', terminal: true,
      when: { all: [onBike, alone, SOUTH_DEST] }, outcomes: self('bike') },
    { id: 'c4_on_foot', label: 'Идти дальше пешком', minutes: minutesFoot, move: true, activity: 'moderate', terminal: true,
      when: { all: [SOUTH_DEST, { not: { all: [onBike, alone] } }, { any: [{ not: byCar }, { not: tankFor(km + 7) }] }] }, outcomes: self('foot') },
  ];
}

/** Переход к КТ 4 — ночь второго дня. */
export const cp4Action = (label = 'Ночь. Устроиться на ночлег'): ActionDef => ({
  id: 'c4_go', label, minutes: 5, terminal: true, goto: 'c4_cp4', when: { all: [C3, after(20, 0)] }, effects: [{ set: '$.c4', value: true }],
});

export const dayScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────── Коридор через Elbbrücken ─────────────
  S({
    id: 'c4_corridor', for: 'any', chapter: 'ch2', title: 'Elbbrücken', ambient: inCar,
    onEnter: [toCar,
      { if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 12 }] }, then: driveTo(8, 'elbbruecken', 1.5), else: [{ move: 'elbbruecken' }] }],
    text: [
      { when: byCar, text: 'Очередь к мостам начинается ещё на Billhorner Brückenstraße: три ряда машин, двигатели заглушены, люди стоят рядом и курят. Каждые десять минут колонна вздрагивает и проползает на пару корпусов. Впереди, над крышами, — зелёные тенты армейского поста.' },
      { when: { not: byCar }, text: 'Пешеходов и велосипедистов пускают отдельно, по тротуару моста, между бетонными блоками. Очередь короче, чем у машин, но тоже на час: семьи с тележками, старики, подростки с рюкзаками. Над рекой — вертолёт.' },
      { when: { all: [together, byCar] }, text: '{partner} рядом — то {pm:смотрит|смотрит} в окно, то на тебя. Вы почти не разговариваете: всё уже сказано.' },
    ],
    actions: [
      { id: 'c4_queue', label: 'Стоять в очереди до поста', minutes: 150, activity: 'rest', terminal: true,
        outcomes: [
          { id: 'late', when: { not: { flag: 'w.corridor_ok' } }, goto: 'c4_turned_back',
            effects: [{ if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 6 }] }, then: [{ drive: 'opel_corsa', km: 6 }] }] },
          { id: 'risk', when: carRisk, goto: 'c4_check_fail',
            effects: [{ if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 6 }] }, then: [{ drive: 'opel_corsa', km: 6 }] }] },
          { id: 'pass', goto: 'c4_south',
            effects: [{ if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 6 }] }, then: [{ drive: 'opel_corsa', km: 6 }] }] },
        ] },
      { id: 'c4_engine_off', label: 'Глушить двигатель между рывками', minutes: 0, combinable: true, when: { all: [isA, byCar, notDone('engine_off')] },
        text: 'Заглушить, подождать, завести, проехать три метра, заглушить. Стартер скрипит, соседи косятся. Литр, может, полтора — но сейчас каждый литр на счету.',
        effects: once('engine_off', [{ siphon: 'opel_corsa', liters: -1 }]) },
      { id: 'c4_family', label: 'Отдать бутылку воды семье с младенцем из соседней машины', minutes: 5, combinable: true, when: notDone('c4_family'),
        enabled: { hasTag: 'drink' }, disabledReason: 'Отдать нечего — воды нет',
        text: 'Мать с ребёнком на руках сначала не верит, потом благодарит так, что тебе неловко. Её муж молча протягивает тебе пачку печенья в ответ. Обмен.',
        effects: [{ takeTag: 'drink' }, { give: 'crackers' }, ...once('c4_family', [{ body: 'stress', delta: -4 }])] },
      { id: 'c4_queue_talk', label: 'Поговорить с людьми в очереди', minutes: 15, combinable: true, when: notDone('c4_queue_talk'),
        text: 'Говорят, на посту меряют температуру и смотрят руки до локтя. Говорят, кого заворачивают — везут в Messe «на двое суток». Говорят, на юге, в Lüneburg и Celle, уже не пускают в город чужих. Женщина в пуховике говорит, что едет к сестре на ферму, и ей все завидуют.',
        effects: once('c4_queue_talk', [{ learn: 'f_messe_q', kind: 'rumor' }]) },
      { id: 'c4_check_self', label: 'Осмотреть себя: руки, шею — что увидят на посту', minutes: 5, combinable: true, when: notDone('c4_check_self'),
        outcomes: [
          { id: 'mark', when: myRisk, text: 'Ты закатываешь рукав. Там, где была рана, — красное, припухшее, горячее. Солдаты это увидят. Солдаты ищут именно это.', effects: once('c4_check_self', [{ body: 'stress', delta: 10 }]) },
          { id: 'clean', text: 'Ссадины, синяки, грязь под ногтями. Ничего, что похоже на укус. Ты выдыхаешь и опускаешь рукав.', effects: once('c4_check_self') },
        ] },
    ],
  }),

  S({
    id: 'c4_check_fail', for: 'any', chapter: 'ch2', location: 'elbbruecken', title: 'Пост', ambient: outside,
    onEnter: [{ learn: 'f_messe_q' }, { body: 'stress', delta: 14 }],
    text: [
      { text: 'Солдат в маске заглядывает в окно, потом второй — с градусником-пистолетом. «Ärmel hoch. Beide.» Медик в белом комбинезоне смотрит на руку, на лоб, на цифры. Пауза. «Rechts ran.»' },
      { when: myRisk, text: 'Тебя выводят из очереди. Вежливо и не спрашивая. «Zur Beobachtung in die Messe. Achtundvierzig Stunden. Das ist keine Strafe.»' },
      { when: { all: [together, partnerRisk, { not: myRisk }] }, text: '{partner.acc} выводят из машины. Тебе говорят: можешь ехать дальше один или ехать следом, в Messe. Ты не спрашиваешь, что лучше.' },
    ],
    actions: [
      { id: 'c4_escort', label: 'Ехать в Messe за армейским грузовиком', minutes: 50, terminal: true, goto: 'c4_messe_gate',
        text: 'Колонна из пяти машин за грузовиком с солдатами — обратно через пустой город, мимо Hauptbahnhof, мимо Dammtor. У входа в Messe вас разводят по разным очередям.',
        effects: [{ move: 'messe' }, { set: '$.escorted', value: true },
          { if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 8 }] }, then: [{ drive: 'opel_corsa', km: 8, to: 'messe' }] }] },
    ],
  }),

  S({
    id: 'c4_turned_back', for: 'any', chapter: 'ch2', location: 'elbbruecken', title: 'Шлагбаум', ambient: outside,
    onEnter: [{ learn: 'f_corridor_closed' }, { body: 'stress', delta: 8 }],
    text: [{ text: 'В десяти машинах от поста шлагбаум опускается. Солдат идёт вдоль очереди и стучит по капотам: «Geschlossen. Morgen ab neun.» Кто-то кричит, кто-то сигналит, кто-то просто выключает мотор и опускает голову на руль. До поста — сто метров. Сегодня — нет.' }],
    actions: [
      { id: 'c4_back_home', label: 'Вернуться в Barmbek', minutes: 40, terminal: true, goto: 'c2_bflat',
        effects: [{ move: 'b_flat' }, { if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 8 }] }, then: [{ drive: 'opel_corsa', km: 8, to: 'b_street' }] }] },
      { id: 'c4_back_messe', label: 'Ехать в Messe — там хотя бы еда и крыша', minutes: 40, terminal: true, goto: 'c4_messe_gate', when: alone,
        effects: [{ move: 'messe' }, { if: { all: [isA, byCar, { fuelFor: 'opel_corsa', km: 6 }] }, then: [{ drive: 'opel_corsa', km: 6, to: 'messe' }] }] },
    ],
  }),

  S({
    id: 'c4_south', for: 'any', chapter: 'ch2', title: 'На юг', ambient: inCar,
    text: [
      { when: byCar, text: 'Пост позади. Мост, внизу — серая Эльба, баржа, приткнувшаяся к берегу, никого на ней. Дальше — A1 на юг: пустая встречка, брошенные машины на обочине с открытыми дверями, армейская колонна навстречу. В Harburg на развязке — бронемашина и солдаты, но на юг машут: проезжайте.' },
      { when: { not: byCar }, text: 'Пост позади. Мост, ветер с реки, под ногами — гул. Дальше — Wilhelmsburg, Harburg, B75: тридцать с лишним километров. Ты не думаешь о том, сколько это. Ты думаешь только о следующем повороте.' },
    ],
    actions: southArrival(40, 150, 420),
  }),

  S({
    id: 'c4_b75', for: 'any', chapter: 'ch2', title: 'B75 на юг', ambient: outside,
    onEnter: [toCar],
    text: [
      { text: 'Harburg утром второго дня — пустой и серый: закрытые ставни, армейский грузовик у вокзала, очередь к автобусам на Messe. На выезде на юг солдаты машут: проезжайте, на юг — можно.' },
      { when: byCar, text: 'B75 почти пустая. Поля в инее, вороны над пашней, брошенный трактор у обочины.' },
    ],
    actions: southArrival(22, 90, 300),
  }),

  S({
    id: 'c4_local', for: 'any', chapter: 'ch2', title: 'Короткая дорога', ambient: outside,
    onEnter: [toCar],
    text: [{ text: 'Buchholz утром второго дня: без тока, без воды, полупустой. На перекрёстке у ратуши — армейский грузовик с цистерной и очередь с канистрами.' }],
    actions: southArrival(5, 25, 90),
  }),

  // ───────────── Хутор: ворота ─────────────
  S({
    id: 'c4_farm_gate', for: 'any', chapter: 'ch2', location: 'hof_luedemann', title: 'Ворота хутора', ambient: outside,
    onEnter: [{ if: { npc: 'henrike', alive: true }, then: [{ set: '$.met.henrike', value: true }] }],
    text: [
      { text: 'Собака у ворот, потом Оле — с ружьём на сгибе локтя. Он узнаёт машину раньше, чем лица, и не опускает ружьё, пока Хенрике не выходит на крыльцо и не говорит одно слово: «Lass».' },
      { when: { all: [together, isB] }, text: 'Хенрике смотрит на тебя долго — с головы до ног, как на корову на рынке. — Ты — его. Работать умеешь? — Ты киваешь. — Посмотрим.' },
      { when: myRisk, text: 'Хенрике смотрит на твою руку. Она увидела. — Правило ты знаешь, — говорит она. — Сутки в курятнике. Если ничего не будет — заходишь в дом. Если будет — сам{m:|а} понимаешь.' },
      { when: { all: [together, partnerRisk, { not: myRisk }] }, text: 'Хенрике смотрит на руку {partner.gen}. Ей хватает секунды. — Курятник. Сутки. — Она не повышает голос, и спорить не о чем.' },
      { when: { all: [{ not: { flag: 'w.farm_welcome' } }, { not: myRisk }] }, text: '— Сегодня — сарай, — говорит Хенрике. — Завтра посмотрим, что вы за люди.' },
    ],
    actions: [
      { id: 'c4_enter', label: 'Войти в дом', minutes: 5, terminal: true, goto: 'c2_farm', when: { all: [{ flag: 'w.farm_welcome' }, { not: myRisk }] },
        text: 'Внутри — тепло от печки, запах хлеба, сапоги в ряд у двери. Хенрике показывает, где спать, где мыться, где лежат дрова. Правил она не повторяет: ты их уже знаешь.',
        effects: once('farm_in', [{ npc: 'henrike', trust: 2 }, { learn: 'f_coop_rule' }]) },
      { id: 'c4_barn', label: 'Устроиться в сарае', minutes: 10, terminal: true, goto: 'c2_farm', when: { all: [{ not: { flag: 'w.farm_welcome' } }, { not: myRisk }] },
        text: 'Сено, старый трактор, мешки. Павел приносит два одеяла и чайник. — Она всех так, — говорит он. — Меня тоже. Первую неделю.',
        effects: once('farm_barn', [{ npc: 'pawel', trust: 3 }, { learn: 'f_coop_rule' }]) },
      { id: 'c4_coop', label: 'Идти в курятник', minutes: 5, terminal: true, goto: 'c4_coop', when: myRisk,
        effects: [{ move: 'farm_coop' }, { learn: 'f_coop_rule' }] },
    ],
  }),

  S({
    id: 'c4_coop', for: 'any', chapter: 'ch2', location: 'farm_coop', title: 'Старый курятник', safe: true,
    text: [
      { text: 'Кирпичная пристройка без окон. Нары, соломенный тюфяк, ведро, бутылка воды, свеча. Дверь запирается снаружи на засов. Сквозь щель под дверью — полоска света и запах дыма из трубы дома.' },
      { when: EVE, text: 'Вечером засов скрипит: Хенрике ставит на порог миску с супом и хлеб, не заходя. — Как жар? — спрашивает она. Ответ её не интересует: она смотрит сама.' },
    ],
    actions: [
      { id: 'c4_coop_eat', label: 'Поесть то, что принесли', minutes: 15, combinable: true, when: { all: [EVE, notDone('coop_ate')] },
        text: 'Суп с картошкой и салом, горячий. Ты ешь медленно, чтобы растянуть.',
        effects: once('coop_ate', [{ body: 'hunger', delta: -35 }, { body: 'thirst', delta: -15 }]) },
      { id: 'c4_coop_talk', label: 'Говорить с {partner.ins} через дверь', minutes: 30, combinable: true, when: { all: [together, notDone('coop_talk')] },
        text: 'Голос с той стороны двери — близко, у самой щели. Вы говорите о ерунде: о том, что на хуторе пахнет как в детстве у бабушки, о курах, о том, что Оле, кажется, умеет улыбаться. Не о том, что будет через сутки.',
        effects: once('coop_talk', [{ body: 'stress', delta: -10 }]) },
      { id: 'c4_coop_wound', label: 'Осмотреть рану при свече', minutes: 10, combinable: true, when: notDone('coop_wound'),
        text: 'Красное, горячее, но не хуже, чем утром. Или хуже? Ты не можешь понять. Ты бинтуешь заново и долго смотришь на пламя свечи.',
        effects: once('coop_wound', [{ body: 'stress', delta: 4 }]) },
      { id: 'c4_coop_pawel', label: 'Позвать Павла — он ходит мимо к курам', minutes: 15, combinable: true, when: { all: [PM, notDone('coop_pawel')] },
        text: 'Павел садится по ту сторону двери на перевёрнутое ведро. Рассказывает про своих: жена, двое сыновей, дом под Щецином. Последний раз говорил с ними в субботу. — Ты выйдешь, — говорит он. — Я тоже тут сидел, первую ночь. С температурой. Это был грипп.',
        effects: once('coop_pawel', [{ npc: 'pawel', trust: 8 }, { body: 'stress', delta: -4 }]) },
      waitHour('Переждать час', 'c4_wait'),
      cp4Action(),
    ],
  }),

  // ───────────── Messe ─────────────
  S({
    id: 'c4_to_messe', for: 'any', chapter: 'ch2', title: 'В Messe', ambient: outside,
    text: [{ text: 'Через город в Messe идут все: семьи с тележками, старики под руку, люди с переносками, с детскими колясками, набитыми вещами. Полиция на перекрёстках показывает направление жезлами. Никто не разговаривает.' }],
    actions: [
      { id: 'c4_walk', label: 'Идти в Messe со всеми', minutes: 90, move: true, activity: 'moderate', terminal: true, goto: 'c4_messe_gate', effects: [{ move: 'messe' }] },
      { id: 'c4_drive', label: 'Доехать до Messe на машине', minutes: 35, terminal: true, goto: 'c4_messe_gate', when: { all: [isA, alone, { has: 'car_keys' }] },
        enabled: { fuelFor: 'opel_corsa', km: 9 }, disabledReason: 'Машины здесь нет или бензина не хватит', effects: [...driveTo(6, 'messe', 1.5)] },
    ],
  }),

  S({
    id: 'c4_to_harburg', for: 'any', chapter: 'ch2', title: 'К вокзалу Harburg', ambient: outside,
    onEnter: [toCar],
    text: [{ text: 'Автобусы в Messe ходят только от вокзала Harburg. До него — двадцать с лишним километров на север по B75.' }],
    actions: [
      { id: 'c4_car_hbg', label: 'Ехать к вокзалу Harburg', minutes: 35, terminal: true, goto: 'c4_messe_bus', when: byCar,
        enabled: tankFor(26), disabledReason: 'Бензина не хватит',
        outcomes: [
          { id: 'a', when: isA, effects: driveTo(22, 'harburg_station', 1.2) },
          { id: 'b', effects: [{ move: 'harburg_station' }] },
        ] },
      { id: 'c4_bike_hbg', label: 'Ехать на велосипеде к вокзалу Harburg', minutes: 90, move: true, activity: 'moderate', terminal: true, goto: 'c4_messe_bus',
        when: { all: [onBike, alone] }, effects: [{ move: 'harburg_station' }] },
      { id: 'c4_foot_hbg', label: 'Идти пешком к вокзалу Harburg', minutes: 300, move: true, activity: 'moderate', terminal: true, goto: 'c4_messe_bus',
        when: { not: { all: [byCar, tankFor(26)] } }, effects: [{ move: 'harburg_station' }] },
    ],
  }),

  S({
    id: 'c4_messe_bus', for: 'any', chapter: 'ch2', location: 'harburg_station', title: 'Автобус в Messe', ambient: outside,
    text: [{ text: 'Очередь к автобусам — через всю площадь, в два ряда. У дверей каждого автобуса — солдат и медик: руки, шея, градусник ко лбу. Кого-то отводят к отдельному автобусу с занавешенными окнами. Тот уходит полупустым.' }],
    actions: [
      { id: 'c4_board', label: 'Отстоять очередь и сесть в автобус', minutes: 120, activity: 'rest', terminal: true,
        outcomes: [
          { id: 'q', when: myRisk, goto: 'c4_messe_gate', text: 'Медик смотрит на твою руку и молча показывает на автобус с занавесками. Внутри — человек десять, все сидят далеко друг от друга и не поднимают глаз.',
            effects: [{ move: 'messe' }, { learn: 'f_messe_q' }] },
          { id: 'ok', goto: 'c4_messe_gate', text: 'Автобус идёт через закрытый город по пустой полосе: Wilhelmsburg, мост, Hammerbrook, где вчера горело. В окнах — никого. На Dammtor автобус останавливается у ворот Messe.',
            effects: [{ move: 'messe' }] },
        ] },
    ],
  }),

  S({
    id: 'c4_messe_gate', for: 'any', chapter: 'ch2', location: 'messe', title: 'Вход в Messe', ambient: outside,
    text: [
      { text: 'У входа в залы — палатки, столы под навесами, солдаты, люди в жёлтых жилетах DRK. Очереди — к регистрации, к медикам, к раздаче одеял. Над всем — голос из громкоговорителя, по-немецки, по-английски, по-турецки, по-арабски: «Bitte halten Sie Ihre Papiere bereit».' },
      { when: myRisk, text: 'Медик у стола смотрит на твою руку, потом тебе в глаза. Ставит на запястье красный браслет. «Halle B4. Zur Beobachtung.» Это не просьба.' },
      { when: { all: [together, partnerRisk, { not: myRisk }] }, text: '{partner.dat} надевают красный браслет и уводят к отдельному залу за строительным забором. Тебе — белый. «Halle B1.» Ты смотришь {pm:ему|ей} вслед, пока {pm:его|её} не загораживают чужие спины.' },
    ],
    actions: [
      { id: 'c4_register', label: 'Пройти регистрацию', minutes: 45, terminal: true, when: { not: myRisk }, goto: 'c4_messe',
        text: 'Имя, адрес, «есть ли укусы, царапины, контакт с агрессивными лицами». Белый браслет с номером. Одеяло, пакет: бутылка воды, два батончика, зубная щётка. «Halle B1, Reihe 14». Дальше — сам{m:|а}.',
        effects: [{ give: 'water_05' }, { give: 'chocolate' }, { learn: 'f_messe_open' }, ...once('messe_reg')] },
      { id: 'c4_to_q', label: 'Идти в зал наблюдения', minutes: 20, terminal: true, when: myRisk, goto: 'c4_messe_q',
        effects: [{ move: 'messe_q' }, { learn: 'f_messe_q' }] },
    ],
  }),

  S({
    id: 'c4_messe', for: 'any', chapter: 'ch2', location: 'messe', title: 'Зал B1', safe: true,
    text: [
      { text: 'Выставочный зал на тысячу раскладушек. Номера рядов на листах А4, приклеенных скотчем к колоннам. Полевая кухня у дальней стены, туалетные кабины в углу, у входа — солдаты. Пахнет хлоркой, супом и мокрой одеждой. Шум — ровный, как от моря.' },
      { when: EVE, text: 'Вечер. Люди лежат на раскладушках одетыми, обнимая сумки. Кто-то читает при свете телефона, кто-то молится. Дети бегают по проходам, пока их не загоняют обратно.' },
      { when: { all: [together, partnerRisk] }, text: 'Зал наблюдения — за строительным забором в соседнем павильоне. Туда не пускают. Можно подойти к сетке.' },
    ],
    actions: [
      { id: 'c4_soup', label: 'Отстоять очередь к полевой кухне', minutes: 40, combinable: true, when: notDone('messe_soup'),
        text: 'Гороховый суп из армейского котла, хлеб, чай в пластиковом стакане. Солдат на раздаче говорит «Guten Appetit» каждому, как автомат. Суп горячий, и это главное.',
        effects: once('messe_soup', [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -25 }, { body: 'stress', delta: -4 }]) },
      { id: 'c4_cot', label: 'Выбрать раскладушку — у стены, ближе к запасному выходу', minutes: 15, combinable: true, when: notDone('messe_cot'),
        text: 'Ряд 14 почти весь занят. Ты договариваешься с пожилой парой поменяться местами — у стены, в пяти метрах от двери с зелёной табличкой «Notausgang». Сам{m:|а} не знаешь, зачем. На всякий случай.',
        effects: once('messe_cot', [{ set: '$.messe_exit', value: true }]) },
      { id: 'c4_board', label: 'Посмотреть списки на доске поиска', minutes: 20, combinable: true, when: notDone('messe_board'),
        outcomes: [
          { id: 'svenja', when: { npc: 'svenja', at: 'messe' }, text: 'Доска объявлений — тысячи листков: «Ищу маму», «Kai, wir sind in B3», фотографии. В распечатанном списке зала наблюдения — «Svenja K., 21». Значит, её всё-таки отвели туда.',
            effects: once('messe_board', [{ learn: 'f_messe_q' }]) },
          { id: 'none', text: 'Доска объявлений — тысячи листков: «Ищу маму», «Kai, wir sind in B3», фотографии детей, собак, стариков. Ты читаешь, пока не начинает рябить в глазах. Знакомых имён нет. Ты пишешь своё и прикалываешь в угол.',
            effects: once('messe_board') },
        ] },
      { id: 'c4_doctor', label: 'Поговорить с врачом-волонтёром', minutes: 15, combinable: true, when: notDone('messe_doc'),
        text: 'Врач — женщина лет шестидесяти в жилете поверх свитера, глаза красные. — Двое суток наблюдения — это правило штаба, не моё, — говорит она. — Жар бывает и от гриппа. Укус — бывает и от собаки. Но мы видели, что бывает потом. — Она смотрит на очередь за тобой. — Не трогайте чужую кровь. Мойте руки. Больше я ничего не знаю.',
        effects: once('messe_doc', [{ learn: 'f_messe_q' }, { learn: 'f_leaflet', quiet: true }]) },
      { id: 'c4_cough', label: 'Присмотреться к мужчине через два ряда', minutes: 5, combinable: true, when: { all: [EVE, notDone('messe_cough')] },
        text: 'Мужчина лет сорока, один, лежит лицом к стене. Весь мокрый, хотя в зале прохладно. Кашляет. Левая кисть — под одеялом; когда он поворачивается, ты видишь бинт, бурый от засохшей крови. Он ловит твой взгляд и натягивает одеяло выше.',
        effects: once('messe_cough', [{ learn: 'f_messe_cough' }, { body: 'stress', delta: 6 }]) },
      { id: 'c4_report', label: 'Сказать солдату у входа про мужчину с бинтом', minutes: 15, combinable: true, when: { all: [done('messe_cough'), notDone('messe_report')] },
        text: 'Солдат слушает, кивает, говорит в рацию. Через десять минут двое в масках подходят к ряду 16, о чём-то говорят с мужчиной — тихо, вежливо, — и уводят его. Он не сопротивляется. Только оборачивается в дверях и ищет глазами, кто.',
        effects: once('messe_report', [{ set: 'w.messe_reported', value: true }, { body: 'stress', delta: 4 }]) },
      { id: 'c4_fence', label: 'Подойти к сетке зала наблюдения', minutes: 30, combinable: true, when: { all: [together, partnerRisk, notDone('messe_fence')] },
        text: 'Строительная сетка, за ней — второй ряд, между ними три метра и солдат. Ты ждёшь, пока {partner} не подходит с той стороны. Кричать нельзя — вы говорите жестами и губами, как в немом кино. Потом {pm:он|она} прикладывает ладонь к сетке, и ты — со своей стороны.',
        effects: once('messe_fence', [{ body: 'stress', delta: -6 }]) },
      { id: 'c4_rumors', label: 'Послушать, о чём говорят соседи', minutes: 20, combinable: true, when: notDone('messe_rumors'),
        text: 'Говорят, завтра будут автобусы в лагеря в Шлезвиг-Гольштейне — «там палатки и полевые госпитали». Говорят, в зале B4 ночью кричали. Говорят, у кого машина и бензин, давно уехали в Данию. Старик рядом говорит, что в сорок третьем было хуже, и никто ему не отвечает.',
        effects: once('messe_rumors') },
      waitHour('Переждать час', 'c4_wait'),
      cp4Action(),
    ],
  }),

  S({
    id: 'c4_messe_q', for: 'any', chapter: 'ch2', location: 'messe_q', title: 'Зал наблюдения', safe: true,
    text: [
      { text: 'Павильон за строительным забором. Раскладушки через два метра, у каждой — номер и пластиковое ведро. Медсёстры в масках и перчатках меряют температуру каждые четыре часа и записывают в таблицу на планшете. У входа — двое солдат. Они не смотрят на вас. Они смотрят на вас всё время.' },
      { when: EVE, text: 'К вечеру в павильоне тише, чем в большом зале. Здесь никто не плачет вслух.' },
    ],
    actions: [
      { id: 'c4_q_nurse', label: 'Спросить медсестру, что будет дальше', minutes: 5, combinable: true, when: notDone('q_nurse'),
        text: '— Сорок восемь часов, — говорит медсестра, не поднимая глаз от планшета. — Если температура нормальная и рана чистая — белый браслет, и вы в общем зале. — А если нет? — Она поднимает глаза. Ничего не отвечает.',
        effects: once('q_nurse', [{ learn: 'f_messe_q' }, { body: 'stress', delta: 6 }]) },
      { id: 'c4_q_neighbor', label: 'Поговорить с соседкой по раскладушке', minutes: 20, combinable: true, when: notDone('q_neighbor'),
        text: 'Соседка — учительница из Wandsbek, лет пятидесяти, с расцарапанной щекой. Муж. Позавчера. — Он не хотел, — повторяет она. — Он не хотел. — Она показывает тебе фотографию на телефоне: свадьба, восемьдесят девятый год. Потом убирает телефон и ложится лицом к стене.',
        effects: once('q_neighbor', [{ body: 'stress', delta: 4 }]) },
      { id: 'c4_q_fence', label: 'Подойти к сетке — вдруг там {partner}', minutes: 30, combinable: true, when: { all: [together, { not: partnerRisk }, notDone('q_fence')] },
        text: 'Ты стоишь у сетки, пока ноги не затекают. Потом видишь {partner.acc} с той стороны — {pm:он|она} тоже стоит и ждёт. Говорить нельзя. Вы просто смотрите друг на друга сквозь два ряда сетки, пока солдат не машет рукой: расходитесь.',
        effects: once('q_fence', [{ body: 'stress', delta: -8 }]) },
      { id: 'c4_q_food', label: 'Поесть то, что приносят в контейнерах', minutes: 20, combinable: true, when: notDone('q_food'),
        text: 'Суп в пластиковом контейнере, хлеб в плёнке, чай. Приносят в перчатках, ставят на пол у раскладушки, отходят.',
        effects: once('q_food', [{ body: 'hunger', delta: -35 }, { body: 'thirst', delta: -20 }]) },
      waitHour('Переждать час', 'c4_wait'),
      cp4Action(),
    ],
  }),

  // ───────────── На север ─────────────
  S({
    id: 'c4_north', for: 'any', chapter: 'ch2', title: 'A7 на север', ambient: inCar,
    onEnter: [toCar],
    text: [
      { text: 'A7 на север забита, но движется: три полосы в одну сторону, встречка пустая. У Schnelsen-Nord — армейский пост поперёк трассы: машины проходят по одной, у каждой солдат с градусником и медик.' },
    ],
    actions: [
      { id: 'c4_north_post', label: 'Дождаться своей очереди на посту', minutes: 120, activity: 'rest', terminal: true,
        outcomes: [
          { id: 'risk', when: carRisk, goto: 'c4_check_fail' },
          { id: 'pass', goto: 'c4_north_road', effects: [{ if: { all: [isA, { fuelFor: 'opel_corsa', km: 10 }] }, then: [{ drive: 'opel_corsa', km: 10 }] }] },
        ] },
    ],
  }),

  S({
    id: 'c4_north_road', for: 'any', chapter: 'ch2', title: 'Север', ambient: inCar,
    text: [{ text: 'За постом трасса пустеет. Quickborn, Henstedt-Ulzburg — указатели, поля, редкие машины. На выезде к Kaltenkirchen — самодельный щит: «Notunterkunft Sporthalle → DRK». Стрелка нарисована от руки.' }],
    actions: [
      { id: 'c4_gym', label: 'Свернуть к спортзалу', minutes: 30, terminal: true, goto: 'c4_north_gym',
        outcomes: [
          { id: 'a', when: isA, effects: [...driveTo(30, 'north_gym'), { learn: 'f_north_gym' }] },
          { id: 'b', effects: [{ move: 'north_gym' }, { learn: 'f_north_gym' }] },
        ] },
    ],
  }),

  S({
    id: 'c4_north_gym', for: 'any', chapter: 'ch2', location: 'north_gym', title: 'Спортзал в Kaltenkirchen', safe: true,
    text: [
      { text: 'Школьный спортзал: гимнастические маты, раскладушки рядами, баскетбольные кольца под потолком. Человек сорок — меньше, чем ты боял{m:ся|ась}. Во дворе — полевая кухня DRK и пожарная машина. Тихо. После Гамбурга эта тишина звенит в ушах.' },
      { when: EVE, text: 'Вечером приходит бургомистр — немолодой, в куртке пожарного, — и говорит, что город «принимает людей, пока может». Он не говорит, сколько это — «пока».' },
    ],
    actions: [
      { id: 'c4_gym_reg', label: 'Записаться у женщины из DRK', minutes: 15, combinable: true, when: notDone('gym_reg'),
        text: 'Фрау Хинрихсен — седая, коротко стриженная, в красной куртке DRK. Записывает имена в тетрадь от руки. — Правила простые, — говорит она. — Не воровать, не драться, дежурить по очереди. Больных — сразу ко мне. Кто врёт про укусы — на улицу, без разговоров.',
        effects: once('gym_reg', [{ learn: 'f_north_gym' }]) },
      { id: 'c4_gym_soup', label: 'Поесть у полевой кухни', minutes: 30, combinable: true, when: notDone('gym_soup'),
        text: 'Айнтопф с сосисками и хлеб. Пожарный на раздаче накладывает полную миску и говорит, что у его жены сестра в Гамбурге и от неё ничего со вчерашнего утра.',
        effects: once('gym_soup', [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -20 }, { body: 'stress', delta: -6 }]) },
      { id: 'c4_gym_locals', label: 'Поговорить с местными у ворот', minutes: 15, combinable: true, when: notDone('gym_locals'),
        text: 'Двое местных курят у забора и смотрят на приезжих. — Сегодня вас сорок, — говорит один. — Завтра будет четыреста. А кормить кто? — Второй молчит, потом протягивает тебе сигарету. Ты не куришь. Ты берёшь.',
        effects: once('gym_locals', [{ body: 'stress', delta: 2 }]) },
      { id: 'c4_gym_help', label: 'Помочь носить маты и раскладушки', minutes: 45, activity: 'moderate', combinable: true, when: notDone('gym_help'),
        text: 'Ты таскаешь маты из подсобки, пока не начинает ломить спину. Фрау Хинрихсен проходит мимо и ставит в тетради против твоего имени галочку.',
        effects: once('gym_help') },
      radio2('radio', 'Послушать радио у кухни'),
      waitHour('Переждать час', 'c4_wait'),
      cp4Action(),
    ],
  }),

  // ───────────── Вечер дома: острая стадия у укушенных ─────────────
  S({
    id: 'c4_svenja', for: 'any', chapter: 'ch2', location: 'b_flat', title: 'Свенья', universal: false,
    onEnter: [{ learn: 'f_svenja_attack' }, { body: 'stress', delta: 16 }],
    text: [{ text: 'Свенья идёт на тебя через гостиную — быстро, неуклюже, задевая мебель. Лицо мокрое, губы растянуты, зрачки во весь глаз. Она тебя не узнаёт. Она вообще никого не узнаёт.' }],
    actions: [
      { id: 'room', label: 'Увернуться и захлопнуть её в комнате', minutes: 3, activity: 'heavy', terminal: true, goto: 'c2_bflat', risky: true,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] },
            text: 'Ты отскакиваешь за дверь комнаты Мерле, она влетает следом — и ты выскальзываешь обратно и тянешь дверь на себя. Удар. Ещё удар. Ты держишь ручку обеими руками, пока не находишь чем подпереть.',
            effects: [{ npc: 'svenja', set: { locked: true } }] },
          { id: 'bit', text: 'Она успевает схватить тебя за руку, когда ты уже тянешь дверь. Зубы — сквозь рукав. Ты вырываешься, захлопываешь дверь, держишь. Рука пульсирует.',
            effects: [biteArm('leftArm', 2), { npc: 'svenja', set: { locked: true } }] },
        ] },
      { id: 'restrain', label: 'Скрутить её и связать', minutes: 6, activity: 'heavy', terminal: true, goto: 'c2_bflat', risky: true,
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 4, uses: ['strength', 'mobility'] },
            text: 'Она лёгкая, но бьётся так, будто в ней ничего не осталось, кроме этого. Ты прижимаешь её к полу, связываешь руки ремнём, ноги — шнуром от торшера. Она воет. Долго. Ты сидишь рядом на полу и не можешь отдышаться.',
            effects: [{ npc: 'svenja', set: { tied: true } }] },
          { id: 'bit', text: 'Ты валишь её, но она выворачивается и впивается тебе в кисть. Ты всё-таки связываешь её — потом, с кровью на пальцах.',
            effects: [biteArm('hands', 2), { npc: 'svenja', set: { tied: true } }] },
        ] },
      { id: 'flee', label: 'Выскочить на площадку и запереть квартиру снаружи', minutes: 2, terminal: true, goto: 'c2_bstairs',
        text: 'Ты выскакиваешь на площадку и поворачиваешь ключ снаружи. Изнутри — удар в дверь. Ещё. Твоя квартира, твои вещи — там. И она.',
        effects: [{ move: 'b_stairs' }, { npc: 'svenja', set: { locked_in_flat: true } }, { set: '$.flat_lost', value: true }] },
    ],
  }),

  S({
    id: 'c4_okafor_trouble', for: 'any', chapter: 'ch2', location: 'b_okafor', title: 'Квартира Окафора',
    text: [{ text: 'Дверь Окафора не заперта. Он сидит на полу в коридоре, спиной к двери ванной, и держит правую руку левой. Из-под пальцев — кровь. Из ванной — удары и рычание. — Не подходите близко, — говорит он очень спокойно. — Через перчатку. Как у моей коллеги. — Он улыбается. — Профессиональная ирония.' }],
    actions: [
      { id: 'treat', label: 'Обработать ему руку как следует', minutes: 15, combinable: true, when: notDone('okafor_treated'),
        enabled: { hasTag: 'dressing' }, disabledReason: 'Нужен бинт',
        text: 'Он подсказывает, ты делаешь: вода, долго; антисептик; повязка. Его руки не дрожат. Твои — да. — Спасибо, — говорит он. — Это ничего не изменит. Но спасибо.',
        effects: [{ use: 'dressing' }, { npc: 'okafor', trust: 10, set: { treated: true } }, ...once('okafor_treated')] },
      { id: 'talk', label: 'Спросить, что ему нужно', minutes: 10, combinable: true, when: notDone('okafor_last'),
        text: '— Уходите утром, — говорит он. — Не ждите меня и не приходите проверять. Если завтра вечером я буду в порядке — я вас найду. — Он протягивает тебе ключ от своей квартиры. — В шкафу на кухне — аптечка. Возьмите всё. Мне она больше не понадобится. Или понадобится — но не так.',
        effects: [{ give: 'okafor_key' }, { give: 'bandages', qty: 2 }, { give: 'disinfectant' }, { give: 'paracetamol', qty: 6 }, { npc: 'okafor', set: { bitten: true } }, ...once('okafor_last')] },
      { id: 'back', label: 'Вернуться к себе', minutes: 1, terminal: true, goto: 'c2_bstairs', effects: [{ npc: 'okafor', set: { bitten: true } }] },
    ],
  }),

  S({
    id: 'c4_ilse', for: 'any', chapter: 'ch2', location: 'a_flat', title: 'Ильзе', universal: false,
    onEnter: [{ body: 'stress', delta: 16 }],
    text: [{ text: 'Ильзе идёт через комнату — та же походка, что у Герда вчера: рывками, всем телом. На лице — улыбка, которая не её. Шестьдесят шесть лет, пятьдесят килограммов. И сила, которой у неё никогда не было.' }],
    actions: [
      { id: 'bedroom', label: 'Затолкать её в спальню и подпереть дверь', minutes: 4, activity: 'heavy', terminal: true, goto: 'c2_aflat', risky: true,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['strength', 'mobility'] },
            text: 'Ты перехватываешь её за плечи — она лёгкая — и вталкиваешь в спальню. Дверь, стул под ручку, твоя спина. Удары с той стороны — частые, слабые, бесконечные.',
            effects: [{ npc: 'ilse', set: { isolated: true } }] },
          { id: 'bit', text: 'Ты хватаешь её за плечи, и она, извернувшись, вцепляется зубами тебе в запястье. Ты всё-таки вталкиваешь её в спальню и подпираешь дверь. Запястье в крови.',
            effects: [biteArm('hands', 2), { npc: 'ilse', set: { isolated: true } }] },
        ] },
      { id: 'out', label: 'Выскочить на лестницу и захлопнуть квартиру', minutes: 2, terminal: true, goto: 'c2_astairs',
        text: 'Ты выскакиваешь за дверь и держишь ручку. Изнутри — удар, ещё. Квартира, вещи, вода в ванне — там. И она.',
        effects: [{ move: 'a_stairs' }, { set: '$.flat_lost', value: true }] },
    ],
  }),

  // ───────────── КТ 4 ─────────────
  S({
    id: 'c4_cp4', for: 'any', chapter: 'ch2', checkpoint: 4, title: 'Вторая ночь', universal: false, calm: true, ambient: { outdoor: false, wet: false },
    text: [
      { when: atAny(['messe', 'messe_q']), text: 'Вторая ночь. Тысяча людей дышит вокруг тебя в темноте. Ты лежишь с открытыми глазами и считаешь удары собственного сердца.' },
      { when: atAny(['hof_luedemann', 'farm_coop']), text: 'Вторая ночь. Хутор тёмный, только в окне у Хенрике — свеча. Собака ходит вдоль забора. Где-то далеко, за полями, — зарево Гамбурга.' },
      { when: { not: atAny(['messe', 'messe_q', 'hof_luedemann', 'farm_coop']) }, text: 'Вторая ночь. Ты проверяешь дверь — ещё раз — и ложишься, не раздеваясь. Второй день кончился. Ты жив{m:|а}.' },
    ],
    actions: [],
  }),
  S({
    id: 'c5_start', for: 'any', chapter: 'ch3', title: 'Третий день', universal: false,
    text: [{ text: 'Здесь пока заканчивается написанная часть истории: вторая ночь. Дальше — третий день: запасы, люди, решения. Всё, что ты успел{m:|а}, сохранено.' }],
    actions: [],
  }),
].map((s) => [s.id, s]));

/** Дневные дела в уже знакомых местах второго дня (добавляются к сценам участка 3). */
export const dayActions: Record<string, ActionDef[]> = {
  c2_bflat: [
    { id: 'c4_svenja', label: 'Свенья!', minutes: 0, terminal: true, goto: 'c4_svenja', when: { all: [done('svenja_attack'), notDone('svenja_handled'), { npc: 'svenja', at: 'b_flat' }] },
      effects: once('svenja_handled') },
    { id: 'c4_okafor_go', label: 'Броситься к Окафору', minutes: 1, terminal: true, goto: 'c4_okafor_trouble', when: { all: [done('okafor_trouble'), notDone('okafor_seen')] },
      effects: once('okafor_seen') },
  ],
  c2_bstairs: [
    { id: 'c4_okafor_go', label: 'Броситься к Окафору', minutes: 1, terminal: true, goto: 'c4_okafor_trouble', when: { all: [done('okafor_trouble'), notDone('okafor_seen')] },
      effects: once('okafor_seen') },
  ],
  c2_bstreet: [
    { id: 'c4_ration', label: 'Получить воду и паёк у армейского грузовика', minutes: 50, combinable: true, when: { all: [C3, after(13, 0), { before: at(11, 19, 0) }, notDone('c4_ration')] },
      text: 'Очередь — сорок минут. Солдат выдаёт каждому две бутылки воды и коробку армейского пайка, сверяясь со списком жильцов, который держит парень из жилищной компании. Вычёркивает тебя ручкой.',
      effects: [{ give: 'water_15', qty: 2 }, { give: 'crackers', qty: 2 }, { give: 'canned_beans' }, ...once('c4_ration')] },
    { id: 'c4_walk_messe', label: 'Идти в Messe', minutes: 1, terminal: true, goto: 'c4_to_messe', when: { all: [C3, alone, after(9, 0), { before: at(11, 19, 0) }] } },
  ],
  c2_aflat: [
    { id: 'c4_ilse', label: 'Ильзе!', minutes: 0, terminal: true, goto: 'c4_ilse', when: { all: [done('ilse_attack'), notDone('ilse_handled'), { npc: 'ilse', at: 'a_flat' }] },
      effects: once('ilse_handled') },
  ],
  c2_ayard: [
    { id: 'c4_water', label: 'Сходить за водой к цистерне у ратуши', minutes: 70, activity: 'moderate', combinable: true, when: { all: [C3, after(10, 0), { before: at(11, 18, 0) }, notDone('c4_water')] },
      text: 'Очередь с канистрами и кастрюлями вдоль всей площади. Солдат у цистерны наливает по десять литров на человека и пишет маркером на руке крестик, чтобы не подходили второй раз. Обратно ты несёшь воду в двух пакетах, и пальцы немеют.',
      effects: [{ give: 'water_15', qty: 4 }, ...once('c4_water')] },
    { id: 'c4_to_farm', label: 'Ехать на хутор', minutes: 12, terminal: true, goto: 'c4_farm_gate', when: { all: [C3, alone, isA, { knows: 'f_farm' }, { itemAt: 'opel_corsa', place: 'a_yard' }] },
      enabled: { all: [{ has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 8 }] }, disabledReason: 'Нужны ключи и бензин', effects: driveTo(8, 'hof_luedemann') },
  ],
  c2_workshop: [
    { id: 'c4_with_deniz', label: 'Ехать с Денизом на хутор', minutes: 25, terminal: true, goto: 'c4_farm_gate', when: { all: [done('deniz_leaving'), notDone('deniz_answer')] },
      text: 'Фургон Дениза впереди, ты — следом или рядом, на ящиках. Семь километров по просёлкам. У ворот Дениз выходит первым и что-то долго говорит Хенрике. Она смотрит на тебя поверх его плеча и кивает.',
      effects: [{ move: 'hof_luedemann' }, { set: 'w.farm_welcome', value: true }, ...once('deniz_answer', [{ npc: 'deniz', trust: 4 }])] },
    { id: 'c4_stay_ws', label: 'Остаться в мастерской', minutes: 5, when: { all: [done('deniz_leaving'), notDone('deniz_answer')] },
      text: 'Дениз пожимает плечами и бросает тебе связку ключей. — Запрёшь, когда уйдёшь. Если уйдёшь. — Фургон выезжает за ворота. В мастерской становится очень тихо.',
      effects: once('deniz_answer', [{ set: 'w.workshop_keys', value: true }]) },
  ],
  c2_farm: [
    { id: 'c4_potatoes', label: 'Копать картошку с Павлом', minutes: 90, activity: 'heavy', combinable: true, when: { all: [C3, PM, notDone('c4_potatoes')] },
      text: 'Поздняя картошка, которую не успели убрать до дождей. Вилы, ведро, мешок. Павел работает молча и вдвое быстрее. К концу у тебя горит спина, а у сарая стоят четыре мешка. Хенрике проходит мимо и считает их взглядом.',
      effects: once('c4_potatoes', [{ npc: 'henrike', trust: 5 }, { npc: 'pawel', trust: 4 }]) },
    { id: 'c4_fence', label: 'Чинить с Оле забор у поля', minutes: 60, activity: 'heavy', combinable: true, when: { all: [C3, PM, notDone('c4_fence')] },
      text: 'Столбы, сетка, проволока. Оле объясняет сквозь зубы, ты делаешь. Через полчаса он перестаёт объяснять, через час — говорит, что в армии его учили тому же, только хуже. Это самое длинное, что ты от него слышал{m:|а}.',
      effects: once('c4_fence', [{ npc: 'ole', trust: 8 }]) },
    { id: 'c4_deniz', label: 'Поговорить с Денизом', minutes: 15, combinable: true, when: { all: [C3, { npc: 'deniz', at: 'hof_luedemann' }, notDone('c4_deniz')] },
      text: 'Дениз уже копается в генераторе Хенрике, по локти в масле. — Карбюратор забит, — говорит он, не оборачиваясь. — Почищу — будет свет вечером по два часа. — Он оборачивается. — Хорошо, что ты здесь.',
      effects: once('c4_deniz', [{ npc: 'deniz', trust: 3 }]) },
    { id: 'c4_dinner', label: 'Ужин за большим столом', minutes: 40, combinable: true, when: { all: [C3, after(18, 30), notDone('c4_dinner')] },
      text: 'Картошка с салом, квашеная капуста, хлеб. Хенрике во главе стола, Оле справа от неё, Павел у печки. Говорят мало. В конце Хенрике кладёт ладони на стол: — Дежурим по двое, по три часа. Огня ночью не жечь. Кто увидит чужого — будит меня, не Оле. — Оле смотрит в тарелку.',
      effects: once('c4_dinner', [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -20 }, { body: 'stress', delta: -6 }, { npc: 'henrike', trust: 3 }]) },
    { id: 'c4_wanderer_ole', label: 'Выйти к забору вместе с Оле', minutes: 20, risky: true, when: { all: [done('wanderer'), notDone('wanderer_done')] },
      outcomes: [
        { id: 'quiet', check: { traits: ['persuasion'], difficulty: 4, uses: ['focus'] },
          text: 'Оле вскидывает ружьё. Ты кладёшь руку на ствол: выстрел услышат за километр. Он смотрит на тебя, потом опускает ружьё и берёт вилы у сарая. Через сетку. Один раз. Человек у забора оседает. Оле долго стоит над ним и не говорит ни слова. Потом говорит: «Danke». Ты не знаешь, за что.',
          effects: once('wanderer_done', [{ npc: 'ole', trust: 10, remember: '$:wanderer' }, { npc: 'henrike', trust: 4 }, { body: 'stress', delta: 14 }]) },
        { id: 'shot', text: 'Ты не успеваешь: выстрел, второй. Человек у забора падает. Эхо уходит по полям — далеко, очень далеко. Хенрике выбегает на крыльцо в ночной рубашке и смотрит на сына так, что тебе хочется отвернуться.',
          effects: once('wanderer_done', [{ npc: 'ole', trust: 4 }, { set: 'w.farm_shot', value: true }, { body: 'stress', delta: 12 }]) },
      ] },
    { id: 'c4_wanderer_stay', label: 'Не выходить', minutes: 20, activity: 'rest', when: { all: [done('wanderer'), notDone('wanderer_done')] },
      text: 'Ты лежишь и слушаешь: собака, звон сетки, потом тяжёлые шаги Оле по двору. Потом — тишина. Утром у забора будет свежевскопанная земля, и никто не скажет ни слова.',
      effects: once('wanderer_done', [{ body: 'stress', delta: 8 }]) },
  ],
  c2_car: [
    { id: 'c4_walk_messe', label: 'Идти в Messe', minutes: 1, terminal: true, goto: 'c4_to_messe', when: { all: [C3, alone, atAny(CITY), { before: at(11, 19, 0) }] } },
    { id: 'c4_bus_messe', label: 'Встать в очередь на автобус до Messe', minutes: 1, terminal: true, goto: 'c4_messe_bus', when: { all: [C3, alone, { at: 'harburg_station' }, { before: at(11, 17, 0) }] } },
  ],
  c2_out: [
    { id: 'c4_walk_messe', label: 'Идти в Messe', minutes: 1, terminal: true, goto: 'c4_to_messe', when: { all: [C3, alone, atAny(CITY), { before: at(11, 19, 0) }] } },
    { id: 'c4_bus_messe', label: 'Встать в очередь на автобус до Messe', minutes: 1, terminal: true, goto: 'c4_messe_bus',
      when: { all: [C3, alone, atAny([...HARBURG, ...ISLAND]), { before: at(11, 17, 0) }] }, effects: [{ move: 'harburg_station' }] },
    { id: 'c4_walk_south', label: 'Идти пешком на юг, в Buchholz', minutes: 1, terminal: true, goto: 'c4_b75',
      when: { all: [C3, alone, SOUTH_DEST, atAny([...HARBURG, ...ISLAND])] } },
  ],
};

/** Куда каждый идёт после КТ 3: дорога к решённому месту или день там, где он есть. */
export function dayRoutes(stayRoutes: { when?: Cond; scene: string }[]): { when?: Cond; scene: string }[] {
  return [
    { when: { all: [D('messe'), atAny(CITY)] }, scene: 'c4_to_messe' },
    { when: { all: [D('messe'), atAny([...HARBURG, ...ISLAND])] }, scene: 'c4_messe_bus' },
    { when: { all: [D('messe'), atAny(SOUTH)] }, scene: 'c4_to_harburg' },
    { when: { all: [D('north'), atAny(CITY)] }, scene: 'c4_north' },
    { when: { all: [SOUTH_DEST, atAny(CITY)] }, scene: 'c4_corridor' },
    { when: { all: [SOUTH_DEST, atAny([...HARBURG, ...ISLAND])] }, scene: 'c4_b75' },
    { when: { all: [D('farm'), { at: 'hof_luedemann' }] }, scene: 'c2_farm' },
    { when: { all: [D('workshop'), { at: 'deniz_workshop' }] }, scene: 'c2_workshop' },
    { when: { all: [D('a_flat'), atAny(['a_flat', 'a_stairs', 'a_yard', 'a_street']), { any: [isA, together] }] }, scene: 'c2_aflat' },
    // Пришла к его двери, а его нет: ждать у двери (дверь — в КТ 4).
    { when: { all: [isB, alone, { at: 'a_street' }] }, scene: 'c2_adoor' },
    { when: { all: [isA, alone, { at: 'b_street' }, { partnerAt: 'b_flat' }] }, scene: 'c2_bdoor' },
    { when: { all: [SOUTH_DEST, atAny(SOUTH)] }, scene: 'c4_local' },
    ...stayRoutes,
  ];
}

/** Добавить дневные дела и переход к КТ 4 в места второго дня. */
export function withDay(scenes: Record<string, Scene>): Record<string, Scene> {
  return Object.fromEntries(Object.entries(scenes).map(([id, sc]) => {
    const extra = dayActions[id] ?? [];
    const cp4 = sc.actions.some((a) => a.id === 'c3_go') ? [cp4Action()] : [];
    return [id, extra.length || cp4.length ? { ...sc, actions: [...sc.actions, ...extra, ...cp4] } : sc];
  }));
}
