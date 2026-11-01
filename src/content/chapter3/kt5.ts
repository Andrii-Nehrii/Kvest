import type { CheckpointDef, JointDecision, JointOption, MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { atAny, CITY, SOUTH, carIn, partnerAtAny, locations2 } from '../chapter2/world2';
import { locations } from '../world';
import { all, flag, not, together, locations3 } from './world3';
import { reports } from './reports';
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
    ...reports(n, { any: [same, { callable: true }] }),
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
          ? 'Полдень проходит без встречи. Ты достаёшь телефон и долго держишь его в руке. Новых сообщений нет.'
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
      when: all({ any: [same, { callable: true }] }, flag('@partner.c3_water_shared')),
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
        id: 'quarantine', when: not(free), winner: 'stay',
        text: 'Осмотр ещё не закончен. Дежурный не открывает дверь ради вашего спора.',
      },
      {
        id: 'old_north', when: all(together, { v: 'w.day3', op: '==', value: 'north' }, north), winner: 'north',
        text: 'Бензин и ключи сохранены на согласованный вчера путь. Вы возвращаетесь к нему.',
      },
      {
        id: 'old_farm', when: all(together, { v: 'w.day3', op: '==', value: 'farm' }, farmRoad), winner: 'farm',
        text: 'Хозяйка вас ждёт. В споре вы держитесь прежнего договора.',
      },
      {
        id: 'farm_short', when: all(farm, { v: 'base.c3_farm.shortDays', op: '>=', value: 1 }), winner: 'exchange',
        text: 'Хенрике показывает на пустую кастрюлю. Отложить обмен ещё на день она не разрешает.',
      },
      {
        id: 'guest_checked', when: checkedGuest, winner: 'inside',
        text: 'Хозяйка сама открывает дверь. Осмотр состоялся, место и работа для гостьи найдены.',
      },
      {
        id: 'danger_at_home', when: all(together, { at: 'b_flat' }, { npc: 'okafor', alive: true, status: 'turned' }, not(flag('w.c3_okafor_closed'))), winner: 'north',
        text: 'За стеной снова удар. Машина и топливо есть; оставаться у этой двери вы не решаетесь.',
      },
    ].filter(a => ids.includes(a.winner)),
    rememberedBy: ['henrike', 'deniz', 'merle', 'okafor'],
  };
}
const cityHome = all(together, same, free, atAny(['a_flat', 'b_flat']));
const workshop = all(together, same, { at: 'deniz_workshop' });
const crowded = all(together, same, atAny(['north_gym', 'ahrensburg', 'messe', 'c3_messe_yard']));
function midday5(): JointDecision {
  return decision('c3_midday5', 5,
    'До темноты несколько часов. Уходя, вы оставите тех, кто сейчас делит с вами крышу. На что договариваетесь?', [
    { id: 'exchange', label: { default: 'За шлангом вдвоём, отдать картошку' },
      when: { at: 'hof_luedemann' },
      feasible: all(farm, { stocked: 'potatoes', qty: 5, at: 'c3_farm_stock' }),
      effects: [...set('w.c3_trip5', 'exchange'), { unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }],
      text: 'Хенрике разрешает взять мешок. Пока вас нет, Павел носит воду один. Шланг должен подойти: второй мешок она не даст.' },
    { id: 'relieve', label: { default: 'Остаться, взять работу Павла на себя' },
      when: { at: 'hof_luedemann' }, feasible: all(farm, { npc: 'pawel', alive: true, at: 'hof_luedemann' }),
      effects: [...set('w.c3_trip5', 'relieve'), { npc: 'pawel', set: { c3_hand_rest: true } }],
      text: 'Павел остаётся у печки. До вечера воду носите вы, за деталью сегодня никто не пойдёт. Хенрике ставит два ведра у порога.' },
    { id: 'water', label: { default: 'К цистерне вдвоём, оставить дом' },
      when: atAny(['a_flat', 'b_flat']), feasible: cityHome, effects: set('w.c3_trip5', 'water'),
      text: 'Вы забираете тару и уходите вдвоём. На стук соседям некому будет ответить. Вернуться нужно до закрытия общего входа.' },
    { id: 'give', label: { default: 'Накормить соседей, вместе держать вход' },
      when: atAny(['a_flat', 'b_flat']), feasible: all(cityHome, food),
      effects: [...set('w.c3_trip5', 'door'), ...foodGift, { set: 'w.c3_shared5', value: true }],
      text: 'Одну пачку отдаёте для общего ужина. Соседи соглашаются сменять вас у входа; за водой сегодня придётся послать другого.' },
    { id: 'jack', label: { default: 'Отдать бокс людям с машиной' },
      when: { at: 'deniz_workshop' }, feasible: workshop,
      effects: [...set('w.c3_trip5', 'jack'), { set: 'w.c3_ws_guest', value: true }],
      text: 'Чужую машину ставят внутри. Вы спите в задней комнате; к воротам нужно проходить мимо незнакомых людей.' },
    { id: 'shift', label: { default: 'Заменить дежурных вдвоём до вечера' },
      when: atAny(['north_gym', 'ahrensburg', 'messe', 'c3_messe_yard', 'deniz_workshop']), feasible: { any: [crowded, workshop] },
      effects: set('w.c3_trip5', 'shift'),
      text: 'Вы отдаёте оставшийся день дежурству. Те, кого сменили, смогут лечь. Свои вещи оставляете там, где их не видно от двери.' },
    { id: 'bed', label: { default: 'Уступить сухое место тому, кто слабее' },
      when: atAny(['north_gym', 'ahrensburg', 'messe', 'messe_q', 'farm_coop', 'c3_messe_yard']),
      feasible: all(together, same), effects: set('w.c3_trip5', 'bed'),
      text: 'Вы переносите вещи ближе к проходу. Освободившееся место занимают сразу; отдохнуть там до ночи уже нельзя.' },
    { id: 'stay', label: { default: 'Остаться при своих вещах' }, effects: set('w.c3_trip5', 'stay'),
      text: 'За чужую смену и чужую дорогу не берётесь. Люди рядом распределяют работу без вас.' },
  ]);
}
function midday7(): JointDecision {
  return decision('c3_midday7', 7,
    'Утро уже изменило то, где можно спать и кому можно доверить дверь. Кого оставите рядом с собой до ночи?', [
    { id: 'search', label: { default: 'Ждать Керема у дороги до темноты' },
      when: { at: 'hof_luedemann' }, feasible: all(farm, { npc: 'kerem', alive: true, at: 'b75_road' }),
      effects: [...set('w.c3_trip7', 'search'), { set: 'w.c3_wait_kerem', value: true }],
      text: 'Дениз показывает место у поворота. Вы берёте воду и идёте туда; вечерняя работа на хуторе остаётся другим.' },
    { id: 'inside', label: { default: 'Поручиться за Кёлер и кормить её' },
      when: { at: 'hof_luedemann' }, feasible: checkedGuest,
      effects: [...set('w.c3_trip7', 'inside'), { set: 'w.c3_guest_contract', value: true }, { set: 'w.c3_owed_food', value: true }, { npc: 'c3_koehler', moveTo: 'hof_luedemann' }],
      text: 'Кёлер остаётся под крышей. Ваши порции теперь делятся на троих. Хенрике больше не спрашивает Оле, ставить ли лишнюю миску.' },
    { id: 'north', label: { default: 'Уехать из дома к северному залу' },
      when: atAny(CITY), feasible: north, effects: set('w.c3_trip7', 'north'),
      text: 'Машину и бензин тратите на северный путь сейчас. Возвращаться за оставленным сегодня не будете.' },
    { id: 'farm', label: { default: 'Уйти к Хенрике до темноты' },
      when: atAny(SOUTH), feasible: farmRoad, effects: set('w.c3_trip7', 'farm'),
      text: 'Вы уходите с вещами к хутору. На дорогу уйдут силы; у калитки вас всё равно осмотрят.' },
    { id: 'isolate', label: { default: 'Отдать тёплое место больному' },
      when: atAny(['a_flat', 'b_flat', 'deniz_workshop', 'ahrensburg', 'north_gym']),
      feasible: all(together, same, free, not(farm)),
      effects: [...set('w.c3_trip7', 'isolate'), { set: 'w.c3_separate_room', value: true }],
      text: 'Вы освобождаете своё тёплое место для наблюдения. Сами ложитесь у прохода. Дверь к больному держите закрытой, еду передаёте снаружи.' },
    { id: 'escort', label: { default: 'Сопровождать тех, кто не идёт сам' },
      when: atAny(['messe', 'messe_q', 'c3_messe_yard', 'north_gym', 'ahrensburg']),
      feasible: all(together, same, free),
      effects: set('w.c3_trip7', 'escort'),
      text: 'Вы остаетесь при тех, кто не может нести вещи. Свою очередь на сухой ночлег отдаёте; до вечера будете рядом с ними.' },
    { id: 'stay', label: { default: 'Сохранить свой ночлег, никого не брать' }, effects: set('w.c3_trip7', 'stay'),
      text: 'Вы оставляете место за собой. Помощь придётся искать у других; ваши вещи готовы, если дверь всё же придётся закрыть снаружи.' },
  ]);
}
export const jointChapter3: Record<string, JointDecision> = {
  c3_midday5: midday5(),
  c3_midday7: midday7(),
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
        id: 'neighbor', label: { default: 'Пустить соседа, уступить своё место' },
        when: atAny(['a_flat', 'b_flat', 'deniz_workshop', 'ahrensburg', 'north_gym']),
        feasible: all(together, same, free, not(farm)),
        effects: [...set('w.c3_night', 'neighbor'), { set: 'w.c3_night_guest', value: true }],
        text: 'Человек переносит вещи внутрь. Вам достаётся место у двери, ему — сухая подстилка. Если ночью станет плохо, разбудят вас.',
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
        when: atAny(SOUTH),
        feasible: farmRoad,
        effects: set('w.c3_night', 'farm'),
        text: 'Утром идёте к хозяйке хутора. Её согласие уже есть, но дорога и проверка у ворот остаются.',
      },
      {
        id: 'north',
        label: { default: 'Утром ехать на север' },
        when: atAny(CITY),
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
    'Ночлег найден не у всех. Можно взять человека с собой, проводить остальных утром или уйти своей дорогой. За какое обещание вы готовы отвечать?',
    [
      {
        id: 'food',
        label: { default: 'Оставить человека с вами до утра' },
        feasible: all(together, same, free, food),
        effects: [...set('w.c3_after8', 'guest'), ...foodGift, { set: 'w.c3_last_guest', value: true }],
        text: 'Вы кормите человека и оставляете рядом. Для его вещей освобождаете сухой угол. Утром уйти вдвоём, не объяснившись с ним, уже не получится.',
      },
      {
        id: 'water',
        label: { default: 'Проводить людей, отдать воду на путь' },
        feasible: all(together, same, free, { has: 'water_15' }),
        effects: [...set('w.c3_after8', 'escort'), { take: 'water_15' }, { set: 'w.c3_dawn_escort', value: true }],
        text: 'На рассвете вы идёте с теми, кто не знает дороги к раздаче. Бутылку отдаёте им сейчас. Свои утренние дела придётся отложить.',
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
