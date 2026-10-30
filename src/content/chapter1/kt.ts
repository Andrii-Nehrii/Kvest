// Контрольные точки главы 1: КТ 1 «Первая связь» (как встречаемся) и КТ 2 «Ночь» (где пережидать дни).
// Объективные условия проверяются от лица мира (ctx игрока A): «at», «fuelIn», «cap» — про A; про B — через флаги B.* и «partner».
import type { CheckpointDef, JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { A_HOMES } from './common';

const A_CAN_DRIVE: Cond = { all: [{ fuelIn: 'opel_corsa', liters: 4 }, { cap: 'canAct', op: '==', value: 1 }] };
// Велосипед стоит в Barmbek: если B уже уехала с Новаками, ехать ей не на чем.
const B_CAN_TRAVEL: Cond = { all: [{ flag: 'B.bike_ready' }, { not: { flag: 'B.bike_lost' } }, { partner: 'active' },
  { not: { partnerAt: 'ahrensburg' } }, { not: { partnerAt: 'b_van' } }] };
const HARBURG_OK: Cond = { all: [{ not: { flag: 'w.harburg_cordon' } }, A_CAN_DRIVE, B_CAN_TRAVEL] };
const plan = (a: string, b: string): Effect[] => [{ set: 'w.plan_a', value: a }, { set: 'w.plan_b', value: b }];

const meet: JointDecision = {
  id: 'meet', checkpoint: 1,
  prompt: { default: 'Связь рвётся. Полдень, до темноты — четыре часа. Как вы будете добираться друг до друга — и будете ли сегодня вообще?' },
  options: [
    { id: 'a_to_b', label: { A: 'Я еду за тобой в Гамбург — жди дома', B: 'Пусть {partner} приедет за мной — я жду дома', default: '{A} едет за {B.ins} в Гамбург' },
      feasible: A_CAN_DRIVE, effects: [...plan('to_b', 'wait'), { set: 'w.plan_meet', value: 'a_to_b' }],
      text: 'Решено: {A} едет в Гамбург, {B} ждёт дома.' },
    { id: 'b_to_a', label: { A: 'Выбирайся ко мне — я жду здесь', B: 'Я выбираюсь к тебе в Buchholz', default: '{B} пробирается к {A.dat} в Buchholz' },
      feasible: B_CAN_TRAVEL, effects: [...plan('wait', 'to_a'), { set: 'w.plan_meet', value: 'b_to_a' }],
      text: 'Решено: {B} выбирается из города к {A.dat}, {A} ждёт в Buchholz.' },
    { id: 'meet_harburg', label: { default: 'Встречаемся на полпути — у вокзала Harburg' },
      feasible: HARBURG_OK, effects: [...plan('harburg', 'harburg'), { set: 'w.plan_meet', value: 'harburg' }],
      text: 'Решено: встреча у вокзала Harburg — на полпути.' },
    { id: 'wait', label: { default: 'Сегодня никуда: каждый пережидает у себя до утра' },
      effects: [...plan('wait', 'wait'), { set: 'w.plan_meet', value: 'wait' }],
      text: 'Решено: до утра каждый остаётся у себя.' },
  ],
  compromises: [{ pair: ['a_to_b', 'b_to_a'], result: 'meet_harburg', when: HARBURG_OK }],
  arbiters: [
    { id: 'a_on_road', when: { all: [{ at: 'harburg' }, A_CAN_DRIVE] }, winner: 'a_to_b',
      text: '{A} уже в Harburg, на полпути, и машина при нём. Решила дорога, по которой он уже едет.' },
    { id: 'no_car', when: { all: [{ not: A_CAN_DRIVE }, B_CAN_TRAVEL] }, winner: 'b_to_a',
      text: 'Машина {A.gen} не доедет — бензина в обрез или ехать не на чем. Дорога остаётся только у {B.gen}.' },
    { id: 'b_stuck', when: { all: [{ not: B_CAN_TRAVEL }, A_CAN_DRIVE] }, winner: 'a_to_b',
      text: 'Поезда в городе встали, а {B.dat} не на чем выбраться. Остаётся машина {A.gen}.' },
    { id: 'nobody', when: { all: [{ not: A_CAN_DRIVE }, { not: B_CAN_TRAVEL }] }, winner: 'wait',
      text: 'Ни машины на ходу, ни велосипеда: сегодня друг до друга не добраться.' },
    { id: 'jam', when: { flag: 'w.elbe_jam' }, winner: 'a_to_b',
      text: 'Всё, что едет из города на юг, стоит в пробке. В город дорога свободнее: ехать навстречу затору проще, чем сквозь него.' },
    { id: 'bike_far', when: HARBURG_OK, winner: 'meet_harburg',
      text: 'Сорок километров на велосипеде под дождём — слишком. До Harburg вдвое ближе.' },
  ],
  fallbackWeights: [
    { option: 'a_to_b', base: 1 },
    { option: 'b_to_a', base: 1, mods: [{ when: { flag: 'B.bike_lights' }, add: 0.5 }] },
    { option: 'meet_harburg', base: 1 },
    { option: 'wait', base: 1, mods: [{ when: { flag: 'w.elbe_jam' }, add: 0.5 }] },
  ],
  default: 'wait',
  rememberedBy: ['merle', 'ilse', 'deniz'],
};

/** Что обсуждают при встрече: каждый узнаёт то, что знал другой. */
const SHARED = ['f_farm', 'f_henrike_yes', 'f_henrike_maybe', 'f_henrike_no', 'f_deniz_shelter', 'f_messe', 'f_cordon', 'f_okafor_colleague', 'f_leaflet',
  'f_turned_seen', 'f_turned_seen_b', 'f_paramedic_bitten', 'f_pharmacy_bite', 'f_hosp_bite_question', 'f_gerd_rage', 'f_old_tunnel', 'f_drawn_to_light'];
const share: Effect[] = SHARED.map((f) => ({ if: { partnerKnows: f }, then: [{ learn: f, source: 'partner' }] }));
const together: Effect[] = [{ set: 'w.together', value: true }, ...share];
const aHome: Cond = { any: A_HOMES.map((h) => ({ at: h })) };
const partnerAtAHome: Cond = { any: A_HOMES.map((h) => ({ partnerAt: h })) };
const bHome: Cond = { any: [{ at: 'b_flat' }, { at: 'b_stairs' }] };
const partnerAtBHome: Cond = { any: [{ partnerAt: 'b_flat' }, { partnerAt: 'b_stairs' }] };

const kt1Notes: MergeNote[] = [
  // Оба набирали друг друга, пока сеть была жива (12:20–13:10), — или сеть есть прямо сейчас.
  { id: 'call', group: 'call', when: { any: [{ callable: true }, { all: [{ flag: '$.kt1_dialed' }, { flag: '@partner.kt1_dialed' }, { phoneUsable: true }] }] },
    text: 'Гудки обрываются — и в трубке голос {partner.gen}. Далёкий, с треском, слова доходят через одно: «…{pm:жив|жива}… слышишь меня?.. ты где?..» Вы успеваете сказать главное — живы, где вы, что видели, — прежде чем связь рвётся. Перезвонить не получается. Теперь нужно решить, как быть дальше.',
    effects: [{ learn: 'f_kt1_talked' }, { set: '$.talked_kt1', value: true }] },
  { id: 'dead', group: 'call', when: { not: { phoneUsable: true } },
    text: 'Твой телефон мёртв. Ты не знаешь, что с {partner.ins}, — только то, что, может быть, успело дойти в сообщениях раньше.' },
  { id: 'silence', group: 'call',
    text: 'Гудки обрываются. Ещё раз. «Der Teilnehmer ist zurzeit nicht erreichbar». Сеть была — а {partner} не {pm:ответил|ответила}. Ты не знаешь почему.' },
];

const kt2Notes: MergeNote[] = [
  { id: 'meet_b_A', group: 'meet', when: { all: [{ at: 'b_street' }, { flag: 'A.at_b_door' }, partnerAtBHome] }, effects: together,
    text: 'Щелчок домофона. Шаги на лестнице — быстрые, через ступеньку. Дверь подъезда распахивается, и {partner} — в худи, в носках, с мокрыми глазами — врезается в тебя так, что ты отступаешь на шаг. Вы стоите под дождём и не можете отпустить друг друга.' },
  { id: 'meet_b_B', group: 'meet', when: { all: [bHome, { flag: 'A.at_b_door' }, { partnerAt: 'b_street' }] }, effects: together,
    text: 'Домофон. Ты не сразу понимаешь, что это — он. Потом летишь вниз по лестнице, через ступеньку, в одних носках. {partner} стоит у подъезда — мокрый, небритый, живой. Ты врезаешься в него и долго не можешь сказать ни слова.' },
  { id: 'meet_a_B', group: 'meet', when: { all: [{ at: 'a_street' }, { flag: 'B.at_a_door' }, partnerAtAHome] }, effects: together,
    text: 'Шаги за дверью. Замок. {partner} стоит на пороге с фонариком в руке — и роняет его. Ты не помнишь, как оказываешься внутри. Помнишь только, что он держит тебя, мокрую, и повторяет твоё имя.' },
  { id: 'meet_a_A', group: 'meet', when: { all: [aHome, { flag: 'B.at_a_door' }, { partnerAt: 'a_street' }] }, effects: together,
    text: 'Звонок. Стук — кулаком, по-настоящему. Ты открываешь с фонариком в руке — и роняешь его. {partner}. Мокрая насквозь, дрожащая, живая. Она дошла.' },
  { id: 'meet_hbg', group: 'meet', when: { all: [{ at: 'harburg_station' }, { partnerAt: 'harburg_station' }] }, effects: together,
    text: 'Среди фар, зонтов и полицейских мигалок ты вдруг видишь {partner.acc} — и не веришь, пока {pm:он|она} не оказывается совсем рядом. Harburg, вокзал, дождь. Вы нашли друг друга на полпути.' },
  { id: 'miss_b', group: 'meet', when: { all: [{ at: 'b_street' }, { flag: 'A.at_b_door' }] },
    text: 'Никто не открывает. Ты звонишь, стучишь, кричишь в домофон её имя — тишина. Окна четвёртого этажа тёмные. {partner} нет дома.' },
  { id: 'miss_a', group: 'meet', when: { all: [{ at: 'a_street' }, { flag: 'B.at_a_door' }] },
    text: 'Никто не открывает. Ты звонишь, стучишь, зовёшь его — тишина. Окна второго этажа тёмные. {partner} нет дома.' },
  { id: 'miss_hbg', group: 'meet', when: { at: 'harburg_station' },
    text: '{partner} так и не {pm:пришёл|пришла}. Ты ждёшь, пока полиция не прогоняет с площади всех, кто ещё оставался.' },
  { id: 'call', group: 'call', when: { all: [{ not: { flag: 'w.together' } }, { callable: true }] },
    text: 'Ночью звонок вдруг проходит — на несколько секунд. Голос {partner.gen}, хриплый от усталости: «…я в порядке… слышишь?..» И снова тишина.',
    effects: [{ set: '$.talked_kt2', value: true }] },
  { id: 'none', group: 'call', when: { not: { flag: 'w.together' } },
    text: 'Ночью дозвониться не удаётся. Остаются сообщения — те, что дошли, и те, что нет.' },
];

const STAY = 'stay';
const SHELTERS = ['farm', 'workshop', 'a_flat', 'b_flat', 'messe', 'north', STAY];

const shelter: JointDecision = {
  id: 'shelter', checkpoint: 2,
  prompt: { default: 'Ночь. Город за окнами гаснет квартал за кварталом. Нужно решить, где вы переждёте ближайшие дни.' },
  options: [
    { id: 'farm', label: { default: 'Хутор Людеманов под Jesteburg — если Хенрике пустит' }, when: { knows: 'f_farm' },
      feasible: { all: [{ any: [{ flag: 'w.henrike_yes' }, { flag: 'w.henrike_maybe' }, { flag: 'w.deniz_vouch' }] }, { fuelIn: 'opel_corsa', liters: 3 }] },
      effects: [{ set: 'w.shelter', value: 'farm' }], text: 'Утром — на хутор к Людеманам. Хенрике обещала посмотреть — на вас и на то, что вы привезёте.' },
    { id: 'workshop', label: { default: 'Мастерская Дениза в Buchholz' }, when: { knows: 'f_deniz_shelter' }, feasible: { flag: 'w.deniz_shelter' },
      effects: [{ set: 'w.shelter', value: 'workshop' }], text: 'Утром — в мастерскую Дениза: бетон, железо, канистры. Стучать три раза и два.' },
    { id: 'a_flat', label: { A: 'Моя квартира в Buchholz', B: 'Квартира {partner.gen} в Buchholz', default: 'Квартира {A.gen} в Buchholz' },
      effects: [{ set: 'w.shelter', value: 'a_flat' }], text: 'Пока — квартира {A.gen} в Buchholz: свои стены, знакомые соседи.' },
    { id: 'b_flat', label: { A: 'Квартира {partner.gen} в Barmbek', B: 'Моя квартира в Barmbek', default: 'Квартира {B.gen} в Barmbek' },
      effects: [{ set: 'w.shelter', value: 'b_flat' }], text: 'Пока — квартира {B.gen} в Barmbek: четвёртый этаж, вода в ванне, цепочка на двери.' },
    { id: 'messe', label: { default: 'Пункт приёма в Messe — там врачи и полиция' }, when: { knows: 'f_messe' },
      effects: [{ set: 'w.shelter', value: 'messe' }], text: 'Утром — в Messe, в пункт приёма. Там врачи, полиция, много людей. Там, наверное, безопаснее.' },
    { id: 'north', label: { default: 'Уехать из Гамбурга на север, подальше от города' }, feasible: { fuelIn: 'opel_corsa', liters: 10 },
      effects: [{ set: 'w.shelter', value: 'north' }], text: 'Утром — на север, подальше от города, насколько хватит бензина.' },
    { id: STAY, label: { default: 'Пока — каждый там, где есть; утром посмотрим' },
      effects: [{ set: 'w.shelter', value: 'stay' }], text: 'Пока — каждый там, где есть. Утро покажет.' },
  ],
  compromises: [
    // Порознь ночью никто никуда не поедет: любые разные ответы сводятся к «пока остаёмся».
    ...SHELTERS.flatMap((x, i) => SHELTERS.slice(i + 1).map((y) => ({ pair: [x, y] as [string, string], result: STAY, when: { not: { flag: 'w.together' } } as Cond }))),
  ],
  arbiters: [
    { id: 'henrike', when: { flag: 'w.henrike_yes' }, winner: 'farm', text: 'Хенрике сказала «да». Такое второй раз не предлагают.' },
    { id: 'deniz', when: { flag: 'w.deniz_shelter' }, winner: 'workshop', text: 'Дениз ждёт — и он держит слово.' },
    { id: 'here_b', when: { at: 'b_street' }, winner: 'b_flat', text: 'Вы уже здесь, в Barmbek, за запертой дверью. Ночью через город никто не поедет.' },
    { id: 'here_a', when: aHome, winner: 'a_flat', text: 'Вы уже здесь, в Buchholz, за запертой дверью. Ночью никто никуда не поедет.' },
  ],
  fallbackWeights: SHELTERS.map((option) => ({ option, base: 1 })),
  default: STAY,
  rememberedBy: ['merle', 'ilse', 'deniz', 'henrike', 'okafor'],
};

export const joint: Record<string, JointDecision> = { meet, shelter };

export const checkpoints: CheckpointDef[] = [
  { index: 1, title: 'Первая связь', syncNotBefore: at(10, 12, 30), joint: ['meet'], onMerge: kt1Notes,
    next: { A: [{ scene: 'a2_after_call' }], B: [{ scene: 'b2_after_call' }] } },
  { index: 2, title: 'Ночь', joint: ['shelter'], onMerge: kt2Notes,
    next: { A: [{ scene: 'a_ch2' }], B: [{ scene: 'b_ch2' }] } },
];
