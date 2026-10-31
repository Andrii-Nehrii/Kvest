import type { CheckpointDef, JointDecision, JointOption, MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { atAny, CITY, SOUTH, carIn, partnerAtAny, locations2 } from '../chapter2/world2';
import { locations } from '../world';
import { all, flag, not, together, locations3 } from './world3';
import { segmentEnd } from './clock';

const groups = [
  ['a_flat', 'a_stairs', 'a_yard'],
  ['b_flat', 'b_stairs', 'b_okafor'],
  ['hof_luedemann', 'farm_coop'],
  ...['deniz_workshop', 'ahrensburg', 'north_gym', 'messe', 'messe_q', 'c3_messe_yard'].map((x) => [x]),
];
const grouped = new Set(groups.flat());
for (const place of Object.keys({ ...locations, ...locations2, ...locations3 })) {
  if (!grouped.has(place) && !place.endsWith('_stock')) groups.push([place]);
}
const same: Cond = { any: groups.map((g) => all(atAny(g), partnerAtAny(g))) };
const free: Cond = not({
  any: [atAny(['farm_coop', 'messe_q']), { partnerAt: 'farm_coop' }, { partnerAt: 'messe_q' }],
});
const farm: Cond = all({ at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, together);
const stocks = [
  ['hof_luedemann', 'c3_farm_stock'],
  ['a_flat', 'c3_a_stock'],
  ['b_flat', 'c3_b_stock'],
  ['deniz_workshop', 'c3_ws_stock'],
] as const;
const food: Cond = {
  any: stocks.map(([place, stock]) => all({ at: place }, { stocked: 'oats', qty: 1, at: stock })),
};
const foodGift: Effect[] = stocks.map(([place, stock]) => ({
  if: all({ at: place }, { stocked: 'oats', qty: 1, at: stock }),
  then: [
    { unstock: 'oats', qty: 1, at: stock },
    { take: 'oats', qty: 1 },
  ],
}));
const north: Cond = all(
  together,
  same,
  atAny(CITY),
  { has: 'car_keys' },
  carIn(CITY),
  { fuelIn: 'opel_corsa', liters: 6 },
  not(flag('A.check_risk')),
  not(flag('B.check_risk')),
);
const farmRoad: Cond = all(
  together,
  same,
  free,
  atAny(SOUTH),
  not({ at: 'hof_luedemann' }),
  flag('w.farm_welcome'),
);
const checkedGuest: Cond = all(farm, { npc: 'c3_koehler', alive: true }, flag('w.c3_guest_checked'), {
  npc: 'henrike',
  at: 'hof_luedemann',
  alive: true,
  trust: ['>=', 12],
});
const share: Effect[] = [
  'f_c3_well',
  'f_c3_exchange',
  'f_c3_okafor',
  'f_c3_messe_closed',
  'f_farm',
  'f_deniz_shelter',
].map((f) => ({ if: { partnerKnows: f }, then: [{ learn: f, source: 'partner' }] }));
const returnPlaces = [
  ['farm', 'hof_luedemann'],
  ['coop', 'farm_coop'],
  ['aflat', 'a_flat'],
  ['bflat', 'b_flat'],
  ['workshop', 'deniz_workshop'],
  ['ahr', 'ahrensburg'],
  ['north', 'north_gym'],
  ['messe', 'messe'],
  ['q', 'messe_q'],
  ['messe_yard', 'c3_messe_yard'],
] as const;
function notes(n: number): MergeNote[] {
  const greeting: Record<string, string> = {
    farm:
      n % 2
        ? 'У кухонного стола есть место на двоих. {partner} садится рядом и подвигает тебе кружку. Сначала вы показываете руки, потом рассказываете про двор.'
        : 'Вы садитесь на лавку у печки. {partner} снимает мокрую куртку, ты придерживаешь спинку стула. На рукаве остаётся тёмная полоса.',
    aflat:
      'Ты слышишь знакомый шаг раньше, чем видишь {partner.acc}. Дверь закрывается изнутри. Вы говорите на кухне, не повышая голоса: снизу всё ещё слышно лестницу.',
    bflat:
      'Вы встречаетесь у кухонного стола. {partner} придвигает кружку, чтобы было куда положить руки. Дверь напротив вы обсуждаете первой, потом воду и двор.',
    workshop:
      'У верстака {partner} сначала проверяет твои ладони, потом спрашивает про ворота. Ты показываешь, какой выход оставлен свободным. Блестящий ключ всё ещё накрыт тряпкой.',
    ahr: 'Пустые тарелки сдвинуты к дальней стене, у края две кружки. {partner} садится напротив. Вы говорите тихо, чтобы наверху могли заснуть.',
    north:
      'Вы садитесь на край одного мата, освободив проход. {partner} убирает сумку между ног. Приходится наклоняться друг к другу: рядом уже спят.',
    messe:
      'Вы находите друг друга между рядами. {partner} называет свой номер койки, ты свой. После этого можно рассказывать, что видели дежурные и кто остался за сеткой.',
    q: 'Между койками для вас оставлен один стул. {partner} показывает браслет, ты поворачиваешь запястье в ответ. Про осмотр говорите без чужих догадок.',
    coop: 'Вы перекликаетесь через дверь курятника. {partner} садится с другой стороны, голоса теперь слышно лучше. На пороге ещё стоит неубранная миска.',
    messe_yard:
      'Ты узнаёшь {partner.acc} у ограды по рюкзаку. Между вами больше нет рядов койки или сетки. Прежде чем говорить, вы оба несколько раз проверяете взглядом, что второй здесь.',
  };
  return [
    {
      id: 'risk',
      group: 'risk',
      when: {
        any: [
          { injured: 'bite' },
          { injured: 'scratch', minSeverity: 2 },
          { body: 'coreTemp', op: '>=', value: 37.8 },
        ],
      },
      effects: [{ set: '$.check_risk', value: true }],
    },
    { id: 'clear', group: 'risk', effects: [{ set: '$.check_risk', value: false }] },
    ...(n >= 6
      ? [
          {
            id: 'coop_clear',
            when: all(
              { at: 'farm_coop' },
              not(flag('$.check_risk')),
              not(flag('$.c3_check_refused')),
              not(flag('$.c3_coop_clear')),
              ...(n < 8 ? [not(flag('$.c3_new_coop'))] : []),
            ),
            effects: [{ set: '$.c3_coop_clear', value: true }] as Effect[],
            text: 'Хенрике смотрит на градусник, затем на чистую повязку. Убирает цепочку с двери. — В дом. Руки вымыть сначала. — Ты впервые выходишь без её ладони перед собой.',
          },
        ]
      : []),
    {
      id: 'meet_coop_door',
      group: 'meet',
      when: all(same, { any: [{ at: 'farm_coop' }, { partnerAt: 'farm_coop' }] }),
      text: greeting.coop,
      effects: [{ set: 'w.together', value: true }, ...share],
    },
    ...returnPlaces.map(([key, place]): MergeNote => ({
      id: `origin_${key}`,
      when: { at: place },
      effects: [
        { set: `$.c3_return_${key}`, value: true },
        ...returnPlaces
          .filter(([other]) => other !== key)
          .map(([other]): Effect => ({ set: `$.c3_return_${other}`, value: false })),
      ],
    })),
    ...returnPlaces.map(([key, place]): MergeNote => ({
      id: `meet_${key}`,
      group: 'meet',
      when: all(
        same,
        key === 'aflat' ? atAny(groups[0]) : key === 'bflat' ? atAny(groups[1]) : { at: place },
      ),
      text: greeting[key],
      effects: [{ set: 'w.together', value: true }, ...share],
    })),
    {
      id: 'meet_outside',
      group: 'meet',
      when: same,
      effects: [{ set: 'w.together', value: true }, ...share],
      text: 'Ты замечаешь знакомый рюкзак и подходишь ближе. {partner} касается твоего рукава, прежде чем заговорить. Вы показываете друг другу руки и вещи, потом рассказываете, что видели.',
    },
    {
      id: 'apart',
      group: 'meet',
      when: not(same),
      effects: [{ set: 'w.together', value: false }],
      text:
        n % 2
          ? 'Полдень проходит без встречи. Ты ещё раз проверяешь улицу или проход перед собой. Знакомого рюкзака нигде нет.'
          : 'У дверей уже темно. Ты ждёшь знакомых шагов, но слышишь только чужие. Вещи приходится оставлять у своей стороны порога.',
    },
    {
      id: 'call',
      when: all(not(same), { callable: true }),
      effects: share,
      text: 'Связь появляется на минуту. Вы называете, где стоите и что видели своими глазами. На чужие слухи минуты не остаётся.',
    },
    {
      id: 'shared_water',
      when: flag('@partner.c3_water_shared'),
      text: '{partner} рассказывает про бутылку, спущенную на верёвке. Внизу её брали обеими руками. Где она теперь, вы не знаете.',
    },
    {
      id: 'koehler',
      when: all(
        { cp: 5 },
        not({ cp: 6 }),
        { at: 'hof_luedemann' },
        flag('w.c3_koehler_met'),
        { npc: 'henrike', alive: true, at: 'hof_luedemann' },
        { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' },
      ),
      text: 'Хенрике подходит к разговору сама. Кёлер ещё ждёт снаружи у тележки. — На еду место найдём. На ночлег сначала спросим, — говорит хозяйка.',
    },
  ];
}
const set = (key: string, value: string): Effect[] => [{ set: key, value }];
function decision(id: string, checkpoint: number, prompt: string, options: JointOption[]): JointDecision {
  const ids = options.map((o) => o.id);
  return {
    id,
    checkpoint,
    prompt: { default: prompt },
    options,
    default: 'stay',
    compromises: ids.flatMap((x, i) =>
      ids
        .slice(i + 1)
        .map((y) => ({ pair: [x, y] as [string, string], result: 'stay', when: not(together) })),
    ),
    arbiters: [
      {
        id: 'apart',
        when: not(together),
        winner: 'stay',
        text: 'Вы в разных местах. Никто не уходит, пока не знает точно, куда придёт второй.',
      },
      {
        id: 'keep_roof',
        when: { always: true },
        winner: 'stay',
        text: 'У вас есть конкретное место и вещи здесь. Пока вы не договорились, дверь за собой не закрываете.',
      },
    ],
    rememberedBy: ['henrike', 'deniz', 'merle', 'okafor'],
  };
}
function midday(n: 5 | 7): JointDecision {
  const key = `w.c3_trip${n}`;
  return decision(
    `c3_midday${n}`,
    n,
    n === 5
      ? 'Пока светло, можно дойти до раздачи или соседнего двора. Если уйдёте, часть дня и запас на дорогу уйдут вместе с вами. Что решаете?'
      : 'После утренних событий идти обратно можно не везде. Остаться здесь, выйти к раздаче или отдать часть своего запаса тем, кто не дойдёт?',
    [
      {
        id: 'water',
        label: { default: 'Вместе к ближайшей раздаче воды' },
        feasible: all(together, same, free),
        effects: set(key, 'water'),
        text: 'Идёте к ближайшей раздаче, вместе. До возвращения о ночлеге придётся позаботиться отдельно.',
      },
      {
        id: 'exchange',
        label: { default: 'С картошкой к соседнему двору' },
        when: { knows: 'f_c3_exchange' },
        feasible: all(farm, { stocked: 'potatoes', qty: 5, at: 'c3_farm_stock' }),
        effects: [...set(key, 'exchange'), { unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }],
        text: 'Пять килограммов берёте со склада под обмен. Возвращать их в общий мешок без разговора с хозяйкой нельзя.',
      },
      {
        id: 'give',
        label: { default: 'Отдать одну пачку из общего запаса' },
        feasible: all(together, same, food),
        effects: [...set(key, 'stay'), ...foodGift, { set: `w.c3_shared${n}`, value: true }],
        text: 'Одна закрытая пачка уходит тем, кто остался у раздачи без еды. В своём запасе её больше нет.',
      },
      {
        id: 'stay',
        label: { default: 'Остаться здесь и сохранить запас' },
        effects: set(key, 'stay'),
        text: 'Остаётесь на месте. Вода, еда и проход к двери пока под рукой.',
      },
    ],
  );
}
export const jointChapter3: Record<string, JointDecision> = {
  c3_midday5: midday(5),
  c3_midday7: midday(7),
  c3_night: decision(
    'c3_night',
    6,
    'На ночь нужно договориться не о намерениях, а о людях под крышей. У Хенрике последнее слово за ней; на чужую ночёвку уйдёт часть общего запаса.',
    [
      {
        id: 'inside',
        label: { default: 'Пустить Кёлер с разрешения хозяйки' },
        when: flag('w.c3_koehler_met'),
        feasible: checkedGuest,
        effects: [
          ...set('w.c3_night', 'stay'),
          { set: 'w.c3_guest_contract', value: true },
          { set: 'w.c3_owed_food', value: true },
          { npc: 'c3_koehler', moveTo: 'hof_luedemann' },
        ],
        text: 'Хенрике разрешает место в доме. Кёлер ест из общего запаса и завтра работает вместе со всеми. За её право остаться отвечает и ваше слово.',
      },
      {
        id: 'separate',
        label: { default: 'Дать только отдельную ночёвку' },
        when: flag('w.c3_koehler_met'),
        feasible: all(farm, { npc: 'c3_koehler', alive: true }, not({ partnerAt: 'farm_coop' })),
        effects: [
          ...set('w.c3_night', 'stay'),
          { set: 'w.c3_guest_contract', value: true },
          { npc: 'c3_koehler', moveTo: 'hof_luedemann', set: { separate: true } },
        ],
        text: 'Хозяйка выделяет угол в сарае. Еду всё равно даёте свою. Дверь в дом на ночь остаётся закрытой.',
      },
      {
        id: 'give',
        label: { default: 'Дать еду, не обещать ночлег' },
        feasible: all(together, same, food),
        effects: [...set('w.c3_night', 'stay'), ...foodGift, { set: 'w.c3_guest_food_only', value: true }],
        text: 'Закрытую пачку отдаёте снаружи. Места под своей крышей не обещаете. Запаса стало меньше, людей внутри столько же.',
      },
      {
        id: 'farm',
        label: { default: 'Утром перейти на хутор' },
        feasible: farmRoad,
        effects: set('w.c3_night', 'farm'),
        text: 'Утром идёте к хозяйке хутора. Её согласие уже есть, но дорога и проверка у ворот остаются.',
      },
      {
        id: 'north',
        label: { default: 'Утром ехать на север' },
        feasible: north,
        effects: set('w.c3_night', 'north'),
        text: 'Машина и бензин уходят на дорогу к северному спортзалу. Назад того же запаса уже не хватит.',
      },
      {
        id: 'stay',
        label: { default: 'Ночевать здесь без новых обещаний' },
        effects: set('w.c3_night', 'stay'),
        text: 'Проверяете дверь и остаётесь на ночь там, где вы есть. За новых людей своего слова не даёте.',
      },
    ],
  ),
  c3_lastnight: decision(
    'c3_lastnight',
    8,
    'К ночи часть запаса ещё можно передать другим, а часть оставить на дорогу. Что отдаёте и где остаётесь спать?',
    [
      {
        id: 'food',
        label: { default: 'Отдать закрытую пачку, остаться здесь' },
        feasible: all(together, same, food),
        effects: [...set('w.c3_after8', 'stay'), ...foodGift],
        text: 'Одна пачка уходит с раздачей. Вы остаётесь под той же крышей, но завтра этой еды уже не будет.',
      },
      {
        id: 'water',
        label: { default: 'Отдать закрытую бутылку, остаться здесь' },
        feasible: all(together, same, { has: 'water_15' }),
        effects: [...set('w.c3_after8', 'stay'), { take: 'water_15' }],
        text: 'Вы отдаёте полтора литра чистой воды. Ночлег сохраняете, утром воду придётся искать снова.',
      },
      {
        id: 'farm',
        label: { default: 'С утра перейти на хутор' },
        feasible: farmRoad,
        effects: set('w.c3_after8', 'farm'),
        text: 'На утро назначена дорога к хутору. Вещи уже не раскладываете по комнате.',
      },
      {
        id: 'north',
        label: { default: 'С утра ехать к северному спортзалу' },
        feasible: north,
        effects: set('w.c3_after8', 'north'),
        text: 'На утро назначена поездка на север. Ключи и бензин остаются на этот путь, чужих поездок до рассвета не берёте.',
      },
      {
        id: 'stay',
        label: { default: 'Сохранить запас и ночевать здесь' },
        effects: set('w.c3_after8', 'stay'),
        text: 'Ночь проводите на месте. Закрытые бутылки и еда остаются рядом с вещами.',
      },
    ],
  ),
};
export const checkpoints3: CheckpointDef[] = ([5, 6, 7, 8] as const).map((n) => ({
  index: n,
  title: { 5: 'Третий полдень', 6: 'Третья ночь', 7: 'Четвёртый полдень', 8: 'Четвёртая ночь' }[n],
  syncNotBefore: segmentEnd(n),
  joint: [n === 5 || n === 7 ? `c3_midday${n}` : n === 6 ? 'c3_night' : 'c3_lastnight'],
  onMerge: notes(n),
  next: { A: [{ scene: `c${n + 1}_start` }], B: [{ scene: `c${n + 1}_start` }] },
}));
