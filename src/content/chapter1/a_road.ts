// Глава 1 — линия A в дороге: больница с Брокманами, трасса на север, Harburg, Керем;
// после КТ 1 — дорога в город (тоннель, пробка, Eppendorf), встреча у Harburg, возвращение. КТ 1 и КТ 2.
import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { aTail, carHere, driveAction, driveTo, radioAction, seg2Enter } from './common';
import { biteArm } from './a_town';

const S = (s: Scene) => s;
const tail = aTail;
const planA = (v: string): Cond => ({ v: 'w.plan_a', op: '==', value: v });
const travels: Cond = { any: [planA('to_b'), planA('harburg')] };
const atHome: Cond = { any: [{ at: 'a_flat' }, { at: 'a_stairs' }, { at: 'a_yard' }, { at: 'a_street' }, { at: 'a_brockmann' }] };
const keremInCar: Cond = { npc: 'kerem', at: 'a_car' };
const inCar = { outdoor: false, tempC: 17 };

/** Вернуться к месту, где A сейчас находится (после КТ 1, если едет не он). */
const backToPlace: ActionDef[] = [
  ['a_flat', 'a_wake'], ['a_stairs', 'a_tbc'], ['a_brockmann', 'a_tbc'], ['a_yard', 'a_yard'], ['a_street', 'a_street'], ['a_house7', 'a_yard'],
  ['a_market', 'a_market'], ['a_gas', 'a_gas'], ['deniz_workshop', 'a_deniz'], ['a_hospital', 'a_hosp_lot'], ['hof_luedemann', 'a_farm_gate'],
  ['a_road', 'a_road1'], ['harburg_station', 'a_harburg_station'], ['harburg_kerem', 'a_harburg1'],
].map(([loc, scene]) => ({ id: `back_${loc}`, label: 'Вернуться к делам', minutes: 1, terminal: true, goto: scene, when: { all: [{ not: travels }, { at: loc }] } }));

export const aRoadScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────── В больницу с Брокманами ─────────────
  S({
    id: 'a_drive_hosp', for: 'A', chapter: 'ch1', title: 'В больницу', ambient: inCar,
    text: [{ text: 'Ильзе устраивается сзади, голова Герда у неё на плече. Он дышит часто, с присвистом; в машине пахнет потом и уксусом. Дворники размазывают туман. Светофоры на перекрёстках мёртвые — ни красного, ни зелёного.' }],
    actions: [
      { id: 'radio', label: 'Включить радио', minutes: 2, combinable: true,
        text: 'Едва из динамиков раздаётся голос диктора, Герд вскрикивает и зажимает уши ладонями. Ильзе испуганно гладит его по голове. Ты выключаешь.',
        effects: [{ learn: 'f_gerd_light' }] },
      { id: 'ask', label: 'Спросить Ильзе про повязку на руке Герда', minutes: 3, combinable: true, when: { not: { knows: 'f_gerd_wound' } },
        text: '— Позавчера в порту какой-то пьяный его укусил. До крови. В медпункте перевязали, сказали — ерунда. — Ильзе смотрит на повязку. — Ерунда, — повторяет она.',
        effects: [{ learn: 'f_gerd_wound' }] },
      { id: 'window', label: 'Приоткрыть окно — душно', minutes: 1, combinable: true,
        text: 'Холодный воздух. Герд поворачивает лицо к щели и жадно хватает его ртом.' },
      driveAction('go', 'Ехать в больницу', 3, 12, 'a_hospital', 'a_hosp_lot', {
        outcomes: [
          { id: 'smooth', check: { traits: ['driving'], difficulty: 1 }, text: 'Перекрёстки проезжаешь медленно, на ощупь, как и все. Через двенадцать минут из тумана выплывают светящиеся окна больницы.' },
          { id: 'close', text: 'На перекрёстке без светофора из тумана вылетает фургон. Ты бьёшь по тормозам, Corsa юзом встаёт в полуметре от его борта. Водитель фургона даже не поворачивает головы. Сзади Ильзе шепчет молитву.', effects: [{ body: 'stress', delta: 8 }] },
        ] }),
    ],
  }),

  // ───────────── Трасса на север (участок 1) ─────────────
  S({
    id: 'a_road1', for: 'A', chapter: 'ch1', location: 'a_road', title: 'A1 на север', ambient: inCar,
    onEnter: [{ set: '$.tried_north', value: true }],
    text: [
      { when: { before: at(10, 8, 30) }, text: 'A1 на север. Машин больше, чем в обычный вторник, и едут нервно, рывками. На обочине мигает аварийкой «пассат» с поднятым капотом. Над Maschener Kreuz висит низкое серое небо.' },
      { when: { after: at(10, 8, 30) }, text: 'A1 на север почти стоит. Табло над трассой мигает жёлтым: «HAMBURG — ELBQUERUNGEN GESPERRT». Кто-то впереди разворачивается прямо через разделительную, под рёв клаксонов.' },
      { when: { after: at(10, 12, 10) }, text: 'Встречная полоса — на юг — сплошная лента красных стоп-сигналов до горизонта. Твоя сторона почти пуста.' },
    ],
    actions: [
      radioAction(),
      driveAction('on', 'Ехать дальше — к Harburg', 16, 35, 'harburg', 'a_harburg1', {}, 1.5),
      driveAction('back', 'Развернуться на ближайшем съезде и вернуться в Buchholz', 6, 12, 'a_yard', 'a_yard'),
      ...tail(),
    ],
  }),
  S({
    id: 'a_harburg1', for: 'A', chapter: 'ch1', location: 'harburg', title: 'Harburg',
    text: [
      { text: 'Harburg. Съезд с трассы забит. На повороте к мостам на Wilhelmsburg поперёк дороги стоят два полицейских микроавтобуса; полицейские в жёлтых жилетах машут: назад, назад. Над крышами, в стороне Эльбы, кружит вертолёт.' },
      { when: { after: at(10, 11, 40) }, text: 'У вокзала толпа: поезда встали совсем. Люди с чемоданами идут пешком вдоль трассы — на юг.' },
      { when: { after: at(10, 12, 30) }, text: 'Полиция начала пропускать машины к A7 — к тоннелю, по одной полосе. Очередь туда — до горизонта.' },
      { when: keremInCar, text: 'Керем на заднем сиденье смотрит в окно и молчит.' },
    ],
    actions: [
      { id: 'police', label: 'Подойти к оцеплению и спросить, как проехать в город', minutes: 8, combinable: true,
        text: '— Keine Durchfahrt. Polizeieinsatz auf der Veddel. Мосты закрыты, на A1 авария, тоннель тоже закрыт. — Полицейский совсем мальчишка, у него дрожит подбородок. — Fahren Sie nach Hause. Bitte.',
        effects: [{ learn: 'f_bridges_closed' }] },
      { id: 'station', label: 'Дойти до вокзала Harburg — может, ходят поезда', minutes: 10, move: true, terminal: true, goto: 'a_harburg_station',
        when: { not: keremInCar } },
      { id: 'kerem', label: 'Найти дом Керема у вокзала', minutes: 12, move: true, terminal: true, goto: 'a_kerem',
        when: { all: [{ flag: '$.kerem_favor' }, { not: { flag: '$.saw_kerem' } }] } },
      { id: 'jam', label: 'Встать в хвост к тоннелю и ждать', minutes: 60, combinable: true, activity: 'rest', repeatable: true,
        effects: [...driveTo(1)],
        outcomes: [
          { id: 'moving', when: { after: at(10, 12, 30) }, text: 'Очередь ползёт. Иногда — по десять метров, иногда стоит по четверть часа. Люди выходят из машин курить. До тоннеля ещё далеко.' },
          { id: 'stuck', text: 'Ничего не движется. Через час вдоль ряда проезжает полицейский на мотоцикле и машет рукой: тоннель закрыт, разворачивайтесь. Никто не разворачивается.' },
        ] },
      driveAction('deniz', 'Везти Керема прямо в мастерскую к Денизу', 22, 35, 'deniz_workshop', 'a_deniz', { when: keremInCar }),
      driveAction('back', 'Вернуться в Buchholz', 20, 30, 'a_yard', 'a_yard', { when: { not: keremInCar } }),
      ...tail(),
    ],
  }),
  S({
    id: 'a_harburg_station', for: 'A', chapter: 'ch1', location: 'harburg_station', title: 'Вокзал Harburg',
    text: [
      { text: 'Вокзал Harburg: люди на чемоданах, на полу, на ступеньках. Табло сверху донизу в красном «Fällt aus». Объявления обрываются на полуслове. У выхода к платформам — двое полицейских. На лавке у стены сидит мужчина с перевязанной щекой и смотрит в одну точку.' },
      { when: { after: at(10, 17, 30) }, text: 'Полиция выводит людей из здания. «Bitte verlassen Sie den Bahnhof!» Ворота к платформам опущены.' },
    ],
    actions: [
      { id: 'db', label: 'Спросить сотрудника DB в красном жилете', minutes: 5, combinable: true,
        outcomes: [
          { id: 'stopped', when: { after: at(10, 11, 40) }, text: '— Всё стоит. Всё. И на юг, и на север. — Он снимает фуражку и вытирает лоб. — Мне самому до Stade, и как?', effects: [{ learn: 'f_rail_stopped' }] },
          { id: 'partly', text: '— S3 и S5 в город не ходят с восьми, — на Veddel полиция. Metronom на юг пока ходит. Пока, — повторяет он.', effects: [{ learn: 'f_trains_disrupted' }] },
        ] },
      { id: 'listen', label: 'Послушать, о чём говорят', minutes: 10, combinable: true,
        text: '«…на Veddel кто-то бросался на людей прямо на платформе…» — «…полицейские в масках, как в ковид…» — «…мост перекрыли, потому что там лежат люди, я сам видел, с моста видно…»',
        effects: [{ learn: 'f_veddel', kind: 'rumor' }, { learn: 'f_rumor_harburg', kind: 'rumor' }] },
      { id: 'man', label: 'Спросить мужчину с перевязанной щекой, нужна ли помощь', minutes: 4, combinable: true, when: { not: { flag: '$.asked_cheek' } },
        text: 'Он поднимает на тебя глаза — ясные, усталые. — Нет. Спасибо. Порезался о стекло, когда у турникетов была давка. — Он улыбается краешком рта. — Все сегодня спрашивают, не укусили ли. Нет. Стекло.',
        effects: [{ set: '$.asked_cheek', value: true }] },
      { id: 'back', label: 'Вернуться к машине', minutes: 10, move: true, terminal: true, goto: 'a_harburg1', effects: [{ move: 'harburg' }] },
    ],
  }),
  S({
    id: 'a_kerem', for: 'A', chapter: 'ch1', location: 'harburg_kerem', title: 'Керем',
    onEnter: [{ set: '$.saw_kerem', value: true }, { set: '$.met.kerem', value: true }],
    text: [{ text: 'Дом у вокзала, третий этаж, табличка «Aydın». Дверь открывает мужчина лет тридцати — похож на Дениза, только мягче, с пластырем на брови. За его спиной коробки и собранные сумки. — Ты кто? — Ты называешь Дениза. Керем выдыхает так, будто держал дыхание с ночи.' }],
    actions: [
      { id: 'talk', label: 'Спросить, что у него случилось', minutes: 8, combinable: true,
        text: '— Ночью у Phoenix толпа, кто-то бросался на машины, на капоты — прямо как в кино, только без музыки. Мне разбили лобовое, я поехал — и в столб. — Он трогает пластырь. — Телефон сел, зарядка в машине, машина там. Думал, пешком дойду до Дениза. Двадцать километров под дождём…',
        effects: [{ learn: 'f_kerem_story' }, { npc: 'kerem', trust: 5 }] },
      { id: 'charge', label: 'Дать ему подзарядить телефон от пауэрбанка', minutes: 3, combinable: true,
        when: { all: [{ hasTag: 'powerbank' }, { not: { flag: '$.kerem_charged' } }] },
        text: 'Керем держит телефон так, будто это живое. Экран загорается. Пачка сообщений — от Дениза, одно за другим.',
        effects: [{ charge: 'powerbank', delta: -15 }, { set: '$.kerem_charged', value: true }, { npc: 'kerem', trust: 8 }, { npc: 'deniz', trust: 5 }] },
      { id: 'ride', label: 'Предложить отвезти его к Денизу', minutes: 10, terminal: true, goto: 'a_harburg1',
        text: 'Керем не заставляет себя упрашивать: две сумки, куртка, ключи — дверь. На лестнице он говорит: — Дениз тебе этого не забудет. Он вообще ничего не забывает.',
        effects: [{ npc: 'kerem', moveTo: 'a_car', trust: 15 }, { move: 'harburg' }] },
      { id: 'leave', label: 'Сказать, что передашь Денизу привет, и уйти', minutes: 10, terminal: true, goto: 'a_harburg1',
        text: '— Скажи ему: я выберусь, — Керем жмёт тебе руку. — Скажи: не надо за мной ехать. Он поедет. Скажи — не надо.',
        effects: [{ move: 'harburg' }] },
    ],
  }),

  // ───────────── КТ 1 ─────────────
  S({
    id: 'a_cp1', for: 'A', chapter: 'ch1', checkpoint: 1, title: 'Полдень', universal: false,
    text: [
      { when: { phoneUsable: true }, text: 'Ты стоишь, прижав телефон к уху так, что больно, и считаешь гудки. Третий. Четвёртый…' },
      { when: { not: { phoneUsable: true } }, text: 'Полдень. Ты не знаешь, что с {partner.ins}, и не можешь узнать. Можно только решить, что делать дальше, — и надеяться, что {pm:он|она} решит так же.' },
    ],
    actions: [],
  }),

  // ───────────── После КТ 1 ─────────────
  S({
    id: 'a2_after_call', for: 'A', chapter: 'ch1', title: 'После звонка',
    onEnter: [...seg2Enter,
      { if: { v: 'w.plan_b', op: '==', value: 'to_a' }, then: [{ set: '$.partner_coming', value: true }] },
      { if: { all: [keremInCar, travels] }, then: [{ npc: 'kerem', moveTo: 'walking' }, { set: '$.kerem_walked', value: true }] }],
    text: [
      { when: planA('to_b'), text: 'Решено: ты едешь за {partner.ins}. Сорок километров — в обычный день минут сорок. Мосты закрыты, но тоннель на A7, говорят, снова пропускает в город.' },
      { when: planA('harburg'), text: 'Решено: Harburg, вокзал. Встретиться там — и дальше вместе. Двадцать километров по трассе, если она едет.' },
      { when: { all: [planA('wait'), { flag: '$.partner_coming' }] }, text: '{partner} будет пробираться к тебе. Тебе остаётся ждать — и подготовить всё к {pm:его|её} приходу. Ждать оказывается труднее, чем ехать.' },
      { when: { all: [planA('wait'), { not: { flag: '$.partner_coming' } }] }, text: 'Решено: до утра — каждый у себя. Это разумно. Это невыносимо.' },
      { when: { flag: '$.kerem_walked' }, text: 'Керем на заднем сиденье слышал весь разговор. — Высади меня. До брата дойду сам. — Двадцать километров, — говоришь ты. — Дойду, — повторяет он и выходит под дождь.' },
    ],
    actions: [
      { id: 'pack', label: 'Забежать домой за вещами: вода, еда, тёплое', minutes: 10, combinable: true, when: { all: [travels, atHome] },
        text: 'Ты сгребаешь всё, что попадается под руку: вода, хлебцы, консервы, шоколад, аптечка, фонарь, куртка, шапка, перчатки, пауэрбанк. Рюкзак тяжелеет. На пороге оглядываешься на квартиру — так, будто видишь её в последний раз.',
        effects: ['backpack', 'water_15', 'water_05', 'crackers', 'canned_beans', 'canned_ravioli', 'chocolate', 'first_aid', 'disinfectant', 'flashlight',
          'winter_jacket', 'beanie', 'gloves', 'powerbank', 'charger', 'car_keys', 'bank_card', 'cash_eur', 'multitool'].map((pickup) => ({ pickup, place: 'a_flat' })) },
      { id: 'ilse', label: 'Сказать Ильзе, что уезжаешь', minutes: 5, combinable: true,
        when: { all: [travels, atHome, { any: [{ npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', at: 'a_brockmann' }] }] },
        text: '— Езжайте, — Ильзе крестит тебя мелко, по-старушечьи, хотя ты никогда не видел, чтобы она ходила в церковь. — Езжайте за ней. Я тут… я справлюсь.',
        effects: [{ npc: 'ilse', trust: 4, remember: '$:went_for_partner' }] },
      { id: 'to_car', label: 'Дойти до машины во дворе', minutes: 3, combinable: true, when: { all: [travels, { not: carHere }, atHome] },
        effects: [{ move: 'a_yard' }] },
      { id: 'car', label: 'Сесть за руль', minutes: 1, terminal: true, goto: 'a_drive', when: travels,
        enabled: { all: [carHere, { has: 'car_keys' }] }, disabledReason: 'Машина не здесь или нет ключей' },
      { id: 'harburg_go', label: 'Ехать к вокзалу Harburg — он в двух шагах', minutes: 5, terminal: true, goto: 'a2_hbg_wait',
        when: { all: [planA('harburg'), { at: 'harburg' }] } },
      { id: 'tunnel', label: 'Ехать к тоннелю — отсюда ближе всего', minutes: 1, terminal: true, goto: 'a2_harburg',
        when: { all: [planA('to_b'), { at: 'harburg' }] } },
      driveAction('return', 'Вернуться в Buchholz', 20, 30, 'a_yard', 'a_yard', { when: { all: [{ not: travels }, { at: 'harburg' }] } }),
      ...backToPlace,
    ],
  }),
  S({
    id: 'a2_road_north', for: 'A', chapter: 'ch1', location: 'a_road', title: 'Против течения', ambient: inCar,
    text: [
      { text: 'A1 на север. Встречная — на юг — стоит сплошной лентой: красные стоп-сигналы до горизонта, сигналы, крики. Твоя сторона почти пуста. Ты едешь против течения, и от этого не по себе.' },
      { text: 'По обочине встречной идут люди — с чемоданами, с детьми на плечах, с собакой на поводке. Кто-то машет тебе: ты не туда.' },
      { when: { not: { flag: '$.met_polo' } }, text: 'Впереди, на твоей обочине, мигает аварийкой старый «поло». Женщина в красной куртке машет тебе обеими руками.' },
    ],
    actions: [
      radioAction(),
      { id: 'polo', label: 'Остановиться у «поло»', minutes: 6, combinable: true, when: { not: { flag: '$.met_polo' } },
        text: 'Бензин кончился. Ей нужно в Wilhelmsburg, за матерью: «Она одна, ей восемьдесят два, она не открывает дверь никому, кроме меня». Её зовут Сабина. Она не просит — просто смотрит на твою канистру на заднем сиденье, если она там есть.',
        effects: [{ set: '$.met_polo', value: true }] },
      { id: 'give_fuel', label: 'Отлить ей пять литров из канистры', minutes: 5, combinable: true,
        when: { all: [{ flag: '$.met_polo' }, { fuelIn: 'can_petrol_10', liters: 5 }, { not: { flag: '$.gave_fuel' } }] },
        text: 'Бензин булькает в горловину «поло». Сабина плачет и смеётся одновременно, пытается сунуть тебе деньги, ты отталкиваешь её руку. «Поло» заводится. Она уезжает первой — туда же, куда и ты.',
        effects: [{ fillCan: 'can_petrol_10', liters: -5 }, { set: '$.gave_fuel', value: true }, { body: 'stress', delta: -4 }] },
      { id: 'refuse', label: 'Сказать, что не можешь помочь, и ехать дальше', minutes: 1, combinable: true,
        when: { all: [{ flag: '$.met_polo' }, { not: { flag: '$.gave_fuel' } }, { not: { flag: '$.refused_polo' } }] },
        text: 'Сабина кивает, не споря. В зеркале она становится всё меньше — красная точка у мигающего «поло».',
        effects: [{ set: '$.refused_polo', value: true }, { body: 'stress', delta: 3 }] },
      driveAction('on', 'Ехать дальше — к Harburg', 16, 25, 'harburg', 'a2_harburg'),
      driveAction('back', 'Повернуть назад, в Buchholz', 6, 12, 'a_yard', 'a_yard'),
      ...tail(),
    ],
  }),
  S({
    id: 'a2_harburg', for: 'A', chapter: 'ch1', location: 'harburg', title: 'Harburg', ambient: inCar,
    text: [
      { text: 'Harburg. На юг — пробка до горизонта; люди идут пешком вдоль машин с чемоданами. На север полиция пропускает к A7 по одной полосе, и очередь туда ползёт.' },
      { when: { after: at(10, 17, 30) }, text: 'Улицы перекрыты лентами и полицейскими машинами. Громкоговоритель: «Bitte bleiben Sie in Ihren Fahrzeugen. Harburg ist abgesperrt.»' },
    ],
    actions: [
      { id: 'hbg', label: 'Поставить машину у вокзала и ждать, как договорились', minutes: 8, terminal: true, goto: 'a2_hbg_wait',
        when: planA('harburg'), effects: driveTo(1, 'harburg_station') },
      { id: 'kerem', label: 'Заглянуть к Керему — это у вокзала', minutes: 12, move: true, terminal: true, goto: 'a_kerem2',
        when: { all: [{ flag: '$.kerem_favor' }, { not: { flag: '$.saw_kerem' } }, { before: at(10, 17, 30) }] } },
      driveAction('tunnel', 'Ехать к тоннелю по A7', 8, 20, 'a7_jam', 'a2_jam', { when: { not: planA('harburg') } }, 2),
      { id: 'wilhelmsburg', label: 'Попробовать через Wilhelmsburg, мимо оцепления', minutes: 40, combinable: true, risky: true,
        when: { all: [{ not: { flag: '$.tried_wilhelmsburg' } }, { not: planA('harburg') }] },
        effects: [{ set: '$.tried_wilhelmsburg', value: true }, ...driveTo(8, undefined, 1.5)],
        text: 'Ты сворачиваешь в промзону, петляешь мимо складов, через старый мост над Süderelbe — и упираешься в бетонные блоки, которые кто-то уже успел поставить. Сразу за ними, на Wilhelmsburger Reichsstraße, стоит пустой автобус с распахнутыми дверями, а у остановки лежит человек. Лицом вниз. Никто к нему не подходит. Ты разворачиваешься.',
        outcomes: [{ id: 'seen', effects: [{ learn: 'f_veddel' }, { body: 'stress', delta: 8 }] }] },
      driveAction('home', 'Повернуть назад, в Buchholz', 20, 35, 'a_yard', 'a_yard'),
      ...tail(),
    ],
  }),
  S({
    id: 'a_kerem2', for: 'A', chapter: 'ch1', location: 'harburg_kerem', title: 'Керем',
    onEnter: [{ set: '$.saw_kerem', value: true }, { set: '$.met.kerem', value: true }],
    text: [{ text: 'Третий этаж, табличка «Aydın». Керем открывает с молотком в руке и опускает его, услышав имя брата. — Ты едешь в город? Сейчас? — Он качает головой. — Ладно. Не мне говорить.' }],
    actions: [
      { id: 'talk', label: 'Рассказать, куда едешь, и спросить про дорогу', minutes: 8, combinable: true,
        text: '— В тоннель встанешь часа на два. Потом по Elbchaussee не суйся — там всё стоит. Через Bahrenfeld и вверх, на Ring 2. Мимо UKE — не надо. Говорят, там самое плохое. — Он пишет маршрут на твоей карте карандашом.',
        effects: [{ learn: 'f_route_tip' }, { npc: 'kerem', trust: 5 }] },
      { id: 'message', label: 'Взять для Дениза записку', minutes: 2, combinable: true,
        text: '«Abi, ich lebe. Komm nicht. K.» — Керем складывает листок вчетверо. — Если увидишь его раньше меня.',
        effects: [{ give: 'kerem_note' }, { npc: 'kerem', trust: 5 }] },
      { id: 'back', label: 'Вернуться к машине', minutes: 10, terminal: true, goto: 'a2_harburg', effects: [{ move: 'harburg' }] },
    ],
  }),
  S({
    id: 'a2_jam', for: 'A', chapter: 'ch1', location: 'a7_jam', title: 'A7, к тоннелю', ambient: inCar,
    text: [
      { text: 'Три полосы машин, едущих в город, сжаты в одну. Ползёшь по метру. Люди выходят из машин, курят, ходят между рядами, спрашивают друг у друга новости. Над портом, над Waltershof, поднимается чёрный дым и косо уходит в дождь.' },
      { when: { all: [{ v: '$.jam', op: '>=', value: 1 }, { not: { flag: '$.met_jannik' } }] }, text: 'В стекло стучат. Парень лет двадцати, в мокрой ветровке, левый рукав в крови от локтя до кисти. — Bitte — nehmen Sie mich mit in die Stadt? Пожалуйста. Мне в Eimsbüttel, к девушке. Я заплачу.' },
      { when: { npc: 'jannik', at: 'a_car' }, text: 'Янник на пассажирском сиденье держит руку на коленях и пытается дозвониться — раз за разом.' },
    ],
    actions: [
      { id: 'crawl', label: 'Ползти дальше', minutes: 30, combinable: true, activity: 'light', repeatable: true,
        effects: [{ add: '$.jam', value: 1 }, ...driveTo(2, undefined, 3)],
        outcomes: [
          { id: 'near', when: { v: '$.jam', op: '>=', value: 2 }, text: 'Впереди показывается портал тоннеля — бетонная пасть с оранжевым светом внутри. Ещё немного.' },
          { id: 'far', text: 'Полчаса — полкилометра. На встречной, за отбойником, стоит брошенная фура с распахнутыми дверями кабины.' },
        ] },
      { id: 'j_take', label: 'Пустить парня в машину', minutes: 3, combinable: true,
        when: { all: [{ v: '$.jam', op: '>=', value: 1 }, { not: { flag: '$.met_jannik' } }] },
        text: 'Его зовут Янник, он студент, живёт в Harburg, девушка — в Eimsbüttel. — Порезался о забор, когда лез через стройку к трассе, — он показывает рукав. — Не укус, честно. Все спрашивают про укусы.',
        effects: [{ set: '$.met_jannik', value: true }, { set: '$.met.jannik', value: true }, { npc: 'jannik', moveTo: 'a_car', trust: 20 }] },
      { id: 'j_refuse', label: 'Покачать головой и не открывать', minutes: 1, combinable: true,
        when: { all: [{ v: '$.jam', op: '>=', value: 1 }, { not: { flag: '$.met_jannik' } }] },
        text: 'Парень смотрит на тебя секунду, кивает и идёт к следующей машине. Потом к следующей. Ты видишь в зеркале, как он стучит в окна, одно за другим.',
        effects: [{ set: '$.met_jannik', value: 'refused' }, { body: 'stress', delta: 3 }] },
      { id: 'j_bandage', label: 'Перевязать Яннику руку', minutes: 8, combinable: true,
        when: { all: [{ npc: 'jannik', at: 'a_car' }, { hasTag: 'dressing' }, { not: { flag: '$.jannik_bandaged' } }] },
        text: 'Длинный рваный порез от локтя к запястью — и правда железо, не зубы: края ровные, внутри ржавая крошка. Ты промываешь водой и бинтуешь. Янник шипит сквозь зубы и благодарит на трёх языках.',
        effects: [{ takeTag: 'dressing' }, { set: '$.jannik_bandaged', value: true }, { npc: 'jannik', trust: 10 }, { learn: 'f_jannik_cut' }] },
      radioAction(),
      driveAction('tunnel', 'Въехать в тоннель', 2, 10, 'elbtunnel', 'a2_tunnel', { when: { v: '$.jam', op: '>=', value: 2 } }, 3),
      { id: 'u_turn', label: 'Развернуться через разделительную — назад', minutes: 10, risky: true, terminal: true, goto: 'a2_harburg',
        outcomes: [
          { id: 'ok', check: { traits: ['driving'], difficulty: 4 }, text: 'Газ, руль до упора, бордюр, рёв клаксонов — и ты на пустой встречной.', effects: [...driveTo(6, 'harburg')] },
          { id: 'scrape', text: 'Бордюр выше, чем казалось: скрежет днища, удар. Ты на встречной, но под машиной что-то стучит.', effects: [...driveTo(6, 'harburg'), { body: 'stress', delta: 6 }] },
        ] },
      ...tail(),
    ],
  }),
  S({
    id: 'a2_tunnel', for: 'A', chapter: 'ch1', location: 'elbtunnel', title: 'Elbtunnel', ambient: { outdoor: false, tempC: 15 },
    text: [
      { text: 'Оранжевый свет, гул вентиляторов. Машины стоят бампер к бамперу. Посередине тоннеля поток встаёт намертво. Кто-то сигналит, звук бьётся о кафель и не кончается.' },
      { when: { not: { flag: '$.tunnel_woman' } }, text: 'В машине впереди открывается дверь. Женщина выбирается наружу, хватается за крышу и дышит — коротко, часто, с всхлипами. Её муж кричит что-то, оглядываясь на соседние машины.' },
    ],
    actions: [
      { id: 'help', label: 'Выйти и помочь ей', minutes: 10, combinable: true, when: { not: { flag: '$.tunnel_woman' } },
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion', 'medicine'], difficulty: 3 },
            text: 'Ты садишься рядом с ней на корточки. «Смотрите на меня. Вдох — на четыре. Выдох — на шесть». Через пару минут её отпускает. Муж жмёт тебе руку обеими руками. Поток вдалеке трогается.',
            effects: [{ set: '$.tunnel_woman', value: 'helped' }, { body: 'stress', delta: -3 }] },
          { id: 'meh', text: 'Ты говоришь с ней, но она тебя не слышит. Муж в конце концов усаживает её обратно и включает ей музыку на телефоне. Поток трогается.', effects: [{ set: '$.tunnel_woman', value: 'tried' }] },
        ] },
      driveAction('out', 'Дождаться, пока поток тронется, и выехать', 4, 25, 'hh_city', 'a2_city', {
        text: 'Тридцать метров. Ещё тридцать. Потом — подъём, серое небо, и ты в городе.',
        effects: [{ if: { not: { flag: '$.tunnel_woman' } }, then: [{ set: '$.tunnel_woman', value: 'ignored' }] }] }, 3),
    ],
  }),
  S({
    id: 'a2_city', for: 'A', chapter: 'ch1', location: 'hh_city', title: 'Город', ambient: inCar,
    text: [
      { text: 'Bahrenfeld. Город другой. На перекрёстках — полиция, магазины закрыты ставнями, у аптеки очередь под дождём, мимо одна за другой проносятся скорые. Автобус стоит поперёк полосы, пустой, с открытыми дверями. До Barmbek — двенадцать километров через весь город.' },
      { when: { daylight: false }, text: 'Темнеет. Фонари горят, но окна многих домов — тёмные.' },
      { when: { npc: 'jannik', at: 'a_car' }, text: '— Я знаю дворы, — говорит Янник. — Через Eimsbüttel можно пройти без главных улиц. Высадишь меня у Osterstraße — и дальше прямо.' },
    ],
    actions: [
      radioAction(),
      driveAction('jannik', 'Ехать дворами, как показывает Янник', 9, 40, 'hh_city', 'a2_backstreets', { when: { npc: 'jannik', at: 'a_car' } }, 1.5),
      driveAction('direct', 'Напрямую — через Eimsbüttel и Eppendorf', 8, 30, 'hh_eppendorf', 'a2_eppendorf', { when: { not: { npc: 'jannik', at: 'a_car' } } }, 1.5),
      driveAction('ring3', 'В объезд — по Ring 3, через Lokstedt', 16, 55, 'hh_ring3', 'a2_ring3', {}, 1.5),
      ...tail(),
    ],
  }),
  S({
    id: 'a2_backstreets', for: 'A', chapter: 'ch1', location: 'hh_city', title: 'Дворами', ambient: inCar,
    onEnter: [{ npc: 'jannik', moveTo: 'eimsbuettel' }, { learn: 'f_turned_seen' }],
    text: [
      { text: 'Янник ведёт уверенно: налево, под арку, вдоль трамвайных путей, через парковку супермаркета. На Osterstraße он выходит, долго жмёт тебе руку через окно. — Удачи тебе. И ей.' },
      { text: 'На следующем перекрёстке на капот бросается человек — молча, всем телом, как падают с высоты. Ты бьёшь по тормозам. Он сползает, встаёт, и ты видишь его лицо в свете фар: серое, неподвижное, кровь из рассечённой брови заливает глаз — он не моргает. Он снова идёт на машину, на свет. Ты даёшь задний ход, объезжаешь его по тротуару. В зеркале он идёт за тобой, пока не теряется в темноте.' },
    ],
    actions: [
      driveAction('on', 'Ехать дальше, в Barmbek', 6, 25, 'b_street', 'a2_barmbek', {}, 1.5),
    ],
  }),
  S({
    id: 'a2_eppendorf', for: 'A', chapter: 'ch1', location: 'hh_eppendorf', title: 'Eppendorf', ambient: inCar,
    onEnter: [{ body: 'stress', delta: 10 }, { learn: 'f_turned_seen' }],
    text: [{ text: 'Объезд выводит тебя на улицу в двух кварталах от UKE. Поперёк — полицейские машины, синие сполохи на мокрых фасадах. Из-за них выбегает человек в больничной рубашке, босиком по лужам. Он врезается в машину перед тобой, отлетает — и, не замечая, что из рассечённого лба хлещет кровь, бросается на окно водителя. Бьёт в стекло лбом. Ещё. Ещё. Женщина за рулём кричит.' }],
    actions: [
      { id: 'reverse', label: 'Сдать назад и уйти в переулок', minutes: 25, risky: true, terminal: true, goto: 'a2_barmbek',
        outcomes: [
          { id: 'ok', check: { traits: ['driving'], difficulty: 3, uses: ['focus'] }, text: 'Задний ход, руль, переулок. Сзади — крик, хлопок, похожий на выстрел. Ты не оглядываешься. Дальше — Winterhude, тёмные улицы, Barmbek.', effects: [...driveTo(9, 'b_street', 1.5)] },
          { id: 'bump', text: 'Задний ход — удар: ты врезаешься бампером в машину сзади. Её водитель даже не выходит. Ты выворачиваешь руль и уходишь в переулок с хрустом пластика. Дальше — тёмные улицы, Barmbek.', effects: [...driveTo(9, 'b_street', 1.5), { body: 'stress', delta: 6 }] },
        ] },
      { id: 'horn', label: 'Сигналить и мигать фарами — отвлечь его от женщины', minutes: 30, risky: true, terminal: true, goto: 'a2_barmbek',
        text: 'Ты давишь на клаксон и щёлкаешь дальним. Человек в рубашке замирает — и поворачивается на свет. Идёт к тебе. Женщина впереди срывается с места. Он врезается в твой капот, бьёт ладонями в лобовое, по стеклу ползёт трещина. Ты даёшь задний ход, и он идёт следом, пока не падает, споткнувшись о бордюр. Встаёт. Идёт. Ты уходишь в переулок.',
        effects: [...driveTo(9, 'b_street', 1.5), { set: '$.saw_attraction', value: true }, { learn: 'f_drawn_to_light' }] },
      { id: 'help', label: 'Выскочить и оттащить его от её машины', minutes: 30, risky: true, terminal: true, goto: 'a2_barmbek',
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 5, uses: ['strength', 'mobility'] },
            text: 'Ты хватаешь его за ворот и швыряешь на асфальт. Он не чувствует удара — сразу встаёт на четвереньки и тянется к твоим ногам. Ты отпинываешь его и прыгаешь в машину. Женщина впереди уже уехала. Подбегают полицейские. Ты — тоже уезжаешь, переулками, в Barmbek.',
            effects: [...driveTo(9, 'b_street', 1.5), { body: 'stress', delta: 8 }] },
          { id: 'bit', text: 'Ты хватаешь его за плечо — и он разворачивается быстрее, чем ты думал. Зубы впиваются в предплечье через рукав. Ты отрываешь его от себя вместе с куском ткани, отшвыриваешь и бежишь к машине. Рука горит. Ты едешь, не разбирая дороги, пока не понимаешь, что это уже Barmbek.',
            effects: [...driveTo(9, 'b_street', 1.5), biteArm('rightArm', 2)] },
        ] },
      { id: 'wait', label: 'Заблокировать двери и не двигаться', minutes: 45, terminal: true, goto: 'a2_barmbek',
        text: 'Ты нажимаешь кнопку блокировки и сидишь, вцепившись в руль. Полицейские подбегают с криками. Человек в рубашке не слышит. Хлопок, второй — он падает у машины женщины. Полицейский стоит над ним и не опускает пистолет ещё долго. Потом улицу перекрывают, и тебе приходится объезжать через Winterhude.',
        effects: [...driveTo(11, 'b_street', 1.5), { body: 'stress', delta: 12 }, { learn: 'f_police_shot' }] },
    ],
  }),
  S({
    id: 'a2_ring3', for: 'A', chapter: 'ch1', location: 'hh_ring3', title: 'Ring 3', ambient: inCar,
    text: [{ text: 'Ring 3 через Lokstedt. У разграбленного магазина электроники двое грузят телевизоры в фургон, не торопясь. Дальше — полицейский пост: две машины, барьер, фонарик тебе в лицо. «Wohin wollen Sie?»' }],
    actions: [
      { id: 'talk', label: 'Объяснить, что едешь за девушкой в Barmbek', minutes: 5, terminal: true, goto: 'a2_barmbek',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 4 }, text: 'Полицейский смотрит на тебя долго, потом на заднее сиденье. — Barmbek. Fahren Sie. Und halten Sie nirgends an.', effects: [...driveTo(8, 'b_street', 1.5), { learn: 'f_looting' }] },
          { id: 'detour', text: '— Hier nicht. Zurück. — Тебя разворачивают. Объезд через Alsterdorf занимает ещё сорок минут. Когда ты наконец въезжаешь в Barmbek, уже совсем темно.', effects: [...driveTo(14, 'b_street', 1.5), { learn: 'f_looting' }] },
        ] },
    ],
  }),
  S({
    id: 'a2_barmbek', for: 'A', chapter: 'ch1', location: 'b_street', title: 'Barmbek', ambient: { outdoor: true },
    onEnter: [{ set: '$.reached_barmbek', value: true }],
    text: [
      { text: 'Barmbek. Её улица. Ты узнаёшь каштаны и киоск на углу — со спущенными ставнями. Фонари горят, но на улице ни души. Где-то наверху, в доме напротив, кричат — долго, на одной ноте, потом крик обрывается.' },
      { when: { before: at(10, 14, 5) }, text: 'У её подъезда стоит белый фургон доставки с польскими номерами.' },
      { when: { after: at(10, 14, 5) }, text: 'Место у её подъезда пустое; на асфальте — сухой прямоугольник, где долго стояла какая-то большая машина.' },
    ],
    actions: [
      { id: 'look', label: 'Оглядеться, прежде чем выходить', minutes: 3, combinable: true,
        text: 'В конце улицы, под фонарём, медленно бредёт фигура — неровно, будто пьяная. Останавливается. Поворачивает голову в твою сторону. Ты гасишь фары.',
        effects: [{ body: 'stress', delta: 5 }] },
      { id: 'ring', label: 'Подойти к подъезду и позвонить в домофон', minutes: 2, terminal: true, goto: 'a_cp2',
        effects: [{ set: 'A.at_b_door', value: true }] },
      ...tail(),
    ],
  }),

  // ───────────── Встреча у Harburg ─────────────
  S({
    id: 'a2_hbg_wait', for: 'A', chapter: 'ch1', location: 'harburg_station', title: 'Вокзал Harburg',
    text: [
      { when: { before: at(10, 17, 30) }, text: 'Площадь перед вокзалом Harburg. Люди с чемоданами, полицейские машины, ларёк, торгующий кофе из термоса за любые деньги. Ты ставишь машину так, чтобы видеть и мост, и дорогу из Wilhelmsburg, — отсюда {partner} должна появиться.' },
      { when: { after: at(10, 17, 30) }, text: 'Громкоговоритель: «Harburg ist abgesperrt. Bitte verlassen Sie den Platz!» Полиция очищает площадь. Ты отгоняешь машину на парковку за углом и смотришь на мост из темноты салона.' },
    ],
    actions: [
      { id: 'watch', label: 'Высматривать велосипедистов на мосту', minutes: 30, combinable: true, activity: 'rest', repeatable: true,
        outcomes: [
          { id: 'dark', when: { daylight: false }, text: 'Фары, фары, фары. Велосипедистов почти нет. Один раз тебе кажется — она. Не она.' },
          { id: 'day', text: 'Пешеходы, велосипеды, тележки. Каждая женщина в капюшоне на секунду — {partner}. Ни одна.' },
        ] },
      { id: 'coffee', label: 'Купить кофе у ларька', minutes: 5, combinable: true, when: { all: [{ before: at(10, 17, 30) }, { has: 'cash_eur', qty: 3 }] },
        text: 'Кофе горький и чуть тёплый. Продавец говорит, что стоит тут с шести утра и уйдёт, только когда кончится термос. — Или когда придут, — добавляет он и не объясняет, кто.',
        effects: [{ take: 'cash_eur', qty: 3 }, { body: 'thirst', delta: -10 }, { body: 'stress', delta: -2 }] },
      radioAction(),
      { id: 'cp2', label: 'Ждать {partner.acc} здесь, сколько потребуется', minutes: 10, terminal: true, goto: 'a_cp2',
        when: { after: at(10, 15, 0) }, text: 'Ты решаешь: отсюда — ни шагу, пока {pm:он|она} не придёт.' },
      ...tail(),
    ],
  }),

  // ───────────── КТ 2 ─────────────
  S({
    id: 'a_cp2', for: 'A', chapter: 'ch1', checkpoint: 2, title: 'Ночь', universal: false,
    text: [
      { when: { at: 'b_street' }, text: 'Ты жмёшь кнопку домофона. Тишина. Ещё раз — долго, до боли в пальце.' },
      { when: { at: 'harburg_station' }, text: 'Ты ждёшь. Город вокруг гаснет квартал за кварталом.' },
      { when: { any: [{ at: 'a_flat' }, { at: 'a_stairs' }, { at: 'a_yard' }, { at: 'a_street' }] }, text: 'Ночь в Buchholz. Ты сидишь в темноте, прислушиваясь к дому, к улице, к собственному телефону.' },
      { when: { at: 'hof_luedemann' }, text: 'Ночь на хуторе. Собака во дворе то и дело рычит в темноту.' },
      { when: { at: 'deniz_workshop' }, text: 'Ночь в мастерской. Генератор выключен — экономят топливо. Слышно, как по железной крыше стучит дождь.' },
    ],
    actions: [],
  }),
  S({
    id: 'a_ch2', for: 'A', chapter: 'ch2', title: 'Продолжение следует', universal: false,
    text: [{ text: 'Здесь заканчивается первая часть истории — первые сутки. Продолжение (дни 2–4: где жить, чем жить, кому верить) — в следующих главах. Всё, что ты успел, сохранено.' }],
    actions: [],
  }),
].map((s) => [s.id, s]));
