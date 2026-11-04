import { at } from '../../engine/time';
import { central5Notes, central6Notes, central7Notes, central8Notes } from './continuity';
import type { CheckpointDef, JointDecision, JointOption, MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { atAny, CITY, SOUTH, carIn, partnerAtAny, locations2 } from '../chapter2/world2';
import { locations } from '../world';
import { all, flag, not, together, locations3 } from './world3';
import { reports } from './reports';
import { segmentEnd } from './clock';
import { farm6bNight, farm6bNotes } from './farm6b';
import { farm6longNotes, farm6longRoad } from './farm6long';
import { point7Van, point7Departure, point7Notes } from './dawn7';
import { point8Route, point8Notes } from './finish8';

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
    ...(n === 5 ? central5Notes : []),
    ...(n === 6 ? central6Notes : []),
    ...(n === 7 ? central7Notes : []),
    ...(n === 8 ? central8Notes : []),
    ...(n === 8 ? [{ id: 'f8_already_here', group: 'meet', when: all(farm, { npc: 'henrike', alive: true, at: 'hof_luedemann' }), text: 'Оле садится у матери. — На завтра кто остаётся? — {partner} просит тебя сначала выслушать. Хенрике отвечает сыну кивком: спрашивай.', effects: [{ set: 'w.together', value: true }, ...share] }] as MergeNote[] : []),
    ...(n === 7 ? [{ id: 'f7_already_here', group: 'meet', when: farm, text: 'Дениз спрашивает про брата. Оле кладёт ключ перед вами. {partner} придерживает твой рукав. — Сначала договоримся.', effects: [{ set: 'w.together', value: true }, ...share] }] as MergeNote[] : []),
    ...(n === 6 ? [{ id: 'f6_already_here', group: 'meet', when: all(farm, flag('w.c3_koehler_met'), { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' }), text: '{partner} держит ваше сложенное одеяло. — Я хотел{pm:|а} просто лечь. С тобой. — Кёлер ждёт у стола.', effects: [{ set: 'w.together', value: true }, ...share] }] as MergeNote[] : []),
    ...(n === 5 ? [
      { id: 'b5_host_meet', group: 'meet', when: all(same, { at: 'b_flat' }, { me: 'B' }), text: 'Ты придвигаешь {partner.dat} свою кружку. — Тут и скажем. — В прихожей ждут ответа. Дверь ты пока не открываешь.', effects: [{ set: 'w.together', value: true }, ...share] },
      { id: 'b5_guest_meet', group: 'meet', when: all(same, { at: 'b_flat' }, { me: 'A' }), text: '{partner} ставит между вами кружку. Ты спрашиваешь, можно ли говорить здесь. {pm:Он|Она} кивает, не отпуская ручки.', effects: [{ set: 'w.together', value: true }, ...share] },
      { id: 'f5_already_here', group: 'meet', when: farm, text: 'Хенрике держит ваши куртки. — Воду тоже кому-то носить. — {partner} не берёт свою. — А нам когда лечь? — Хенрике ждёт.', effects: [{ set: 'w.together', value: true }, ...share] },
      { id: 'n5_already_here', group: 'meet', when: all(same, { at: 'north_gym' }), text: '{partner} складывает ваши вещи на один мат. На соседний мат смотрит женщина из очереди. Вы ещё не ответили ей.', effects: [{ set: 'w.together', value: true }, ...share] },
      { id: 'm5_already_here', group: 'meet', when: all(same, { at: 'messe' }), text: '{partner} смотрит на пустое место возле медпоста. Ты придвигаешь сумку к ногам, освобождая край раскладушки. Пока не садится ни один.', effects: [{ set: 'w.together', value: true }, ...share] },
    ] as MergeNote[] : []),
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
      text: 'Хенрике остаётся у стола. — В дом — ваш угол отдайте. В сарае — место освобожу. Еда в обоих случаях ваша.',
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
  const d = decision('c3_midday5', 5,
    'Хенрике ждёт решения: идти за шлангом, носить воду или попросить отдыха? Выслушай {partner.acc}, прежде чем обещать за двоих.', [
    { id: 'exchange', label: { default: 'Отнести картошку вдвоём за шланг' },
      when: all({ at: 'hof_luedemann' }, not(flag('proj.c3_pump.done')), not({ has: 'c3_hose' }), not(flag('A.c5_trade')), not(flag('B.c5_trade'))),
      feasible: all(farm, not(flag('proj.c3_pump.done')), not({ has: 'c3_hose' }), not(flag('A.c5_trade')), not(flag('B.c5_trade')), { any: [{ has: 'potatoes', qty: 5 }, { stocked: 'potatoes', qty: 5, at: 'c3_farm_stock' }] }),
      effects: [...set('w.c3_trip5', 'exchange'), { if: not({ has: 'potatoes', qty: 5 }), then: [{ unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }] }, { set: 'w.c3_exchange_load5', value: true }],
      text: 'Хенрике придерживает дверь, пока вы поднимаете мешок. — До темноты обратно. — Оба конца верёвки режут ладони.' },
    { id: 'relieve', label: { default: 'Вдвоём носить воду вместо Павла' },
      when: all({ at: 'hof_luedemann' }, { npc: 'pawel', alive: true, at: 'hof_luedemann' }), feasible: all(farm, { npc: 'pawel', alive: true, at: 'hof_luedemann' }),
      effects: [...set('w.c3_trip5', 'relieve'), { npc: 'pawel', set: { c3_hand_rest: true }, remember: 'c3_took_my_shift' }, { npc: 'henrike', remember: 'c3_water_promised' }],
      text: 'Павел поднимается, но Хенрике ставит перед вами вёдра. — До ужина ваши. — Он садится обратно. За шлангом сегодня не пойдёте.' },
    { id: 'farm_rest', label: { default: 'Попросить отдыха для нас обоих' },
      when: farm, feasible: farm,
      effects: [...set('w.c3_trip5', 'stay'), { npc: 'henrike', trust: -3, remember: 'c3_refused_water' }, { set: 'w.c3_farm_rest5', value: true }],
      text: 'Ты просишь дать вам обоим отдохнуть. Хенрике кладёт куртки на лавку. — Ложитесь. Я сама. — Вёдра она выносит по одному.' },
    { id: 'water', label: { default: 'К цистерне вдвоём, оставить дом' },
      when: atAny(['a_flat', 'b_flat']), feasible: all(cityHome, not(all({ at: 'b_flat' }, flag('w.c3_b_stairs_closed')))), effects: [...set('w.c3_trip5', 'water'), { set: 'w.c3_house_empty5', value: true }],
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
      effects: [...set('w.c3_trip5', 'shift'), { set: 'w.c3_shift5', value: true }],
      text: 'Вы отдаёте оставшийся день дежурству. Те, кого сменили, смогут лечь. Свои вещи оставляете там, где их не видно от двери.' },
    { id: 'bed', label: { default: 'Уступить сухое место тому, кто слабее' },
      when: atAny(['north_gym', 'ahrensburg', 'messe', 'messe_q', 'farm_coop', 'c3_messe_yard']),
      feasible: all(together, same), effects: [...set('w.c3_trip5', 'bed'), { set: 'w.c3_bed5_lost', value: true }],
      text: 'Вы переносите вещи ближе к проходу. Освободившееся место занимают сразу; отдохнуть там до ночи уже нельзя.' },
    { id: 'stay', label: { default: 'Остаться при своих вещах' }, when: not(farm), effects: set('w.c3_trip5', 'stay'),
      text: 'За чужую смену и чужую дорогу не берётесь. Люди рядом распределяют работу без вас.' },
  ]);
  d.options.splice(d.options.length - 1, 0,
    { id: 'clinic', label: { default: 'Отдать свой день очереди раненого врача' }, when: all({ at: 'messe' }, { npc: 'c3_messe_doctor', at: 'messe', alive: true }), feasible: all(together, same, { at: 'messe' }, { npc: 'c3_messe_doctor', at: 'messe', alive: true }), effects: [...set('w.c3_trip5', 'clinic'), { set: 'w.c3_mclinic_help5', value: true }], text: 'Врач просит поднести стул к её столу. Вы освобождаете свою раскладушку пациентам и остаётесь при ней. Сумки придётся поставить под ноги.' },
  );
  d.arbiters = [
    { id: 'f5_no_hose', when: all(farm, { v: 'base.c3_farm.shortDays', op: '>=', value: 1 }), winner: 'exchange', text: 'Хенрике показывает на дно ведра. — Этим до завтра не напоишь. — Мешок остаётся у двери.' },
    { id: 'f5_hand_unfit', when: all(farm, { npc: 'pawel', alive: true, at: 'hof_luedemann' }, not({ npcVar: 'pawel', key: 'c3_hand_treated' })), winner: 'relieve', text: 'Павел берётся за дужку, потом разжимает пальцы. Хенрике отодвигает ведро к вам. — Его сегодня не трогать.' },
    { id: 'f5_no_joint_work', when: farm, winner: 'farm_rest', text: 'Хенрике выслушивает вас обоих. — Одного не пошлю. — Она ставит мешок обратно у стены.' },
    { id: 'f5_hand_dressed', when: all(farm, { npc: 'pawel', alive: true, at: 'hof_luedemann' }, { npcVar: 'pawel', key: 'c3_hand_treated' }), winner: 'exchange', text: 'Павел поднимает ведро левой рукой. — Я до вечера. — Хенрике пропускает его к двери и кивает вам на мешок.' },
    { id: 'n5_without_kitchen', when: all(together, same, { at: 'north_gym' }, flag('w.c3_north_kitchen_lost')), winner: 'shift', text: 'Хинрихсен показывает на очередь без еды. Вы замолкаете и идёте к тем, кто пытается устроить раздачу заново.' },
    { id: 'm5_doctor_hurt', when: all(together, same, { at: 'messe' }, { npc: 'c3_messe_doctor', at: 'messe', alive: true, status: 'injured' }), winner: 'clinic', text: 'Врач не может придержать чужую повязку. Вы замечаете это одновременно и подходите с двух сторон.' },
    ...d.arbiters,
    { id: 'no_shared_promise5', when: all(together, same), winner: 'stay', text: 'Вы не даёте общего обещания, пока второй не согласен. Ждущему человеку приходится ответить отказом.' },
  ];
  return d;
}
function midday7(): JointDecision {
  const d = decision('c3_midday7', 7,
    'Утро уже изменило то, где можно спать и кому можно доверить дверь. Кого оставите рядом с собой до ночи?', [
    { id: 'search', label: { default: 'Ждать Керема у дороги до темноты' },
      when: all(farm, { npc: 'kerem', alive: true, at: 'b75_road' }), feasible: all(farm, { npc: 'kerem', alive: true, at: 'b75_road' }),
      effects: [...set('w.c3_trip7', 'search'), { set: 'w.c3_wait_kerem', value: true }],
      text: 'Дениз показывает место у поворота. Вы берёте воду и идёте туда; вечерняя работа на хуторе остаётся другим.' },
    { id: 'inside', label: { default: 'Поручиться за Кёлер и кормить её' },
      when: all(farm, not(flag('w.c3_guest_contract'))), feasible: all(checkedGuest, food, not(flag('w.c3_guest_contract'))),
      effects: [...set('w.c3_trip7', 'inside'), ...foodGift, { set: 'w.c3_guest_contract', value: true }, { set: 'w.c3_owed_food', value: true }, { npc: 'c3_koehler', moveTo: 'hof_luedemann', set: { separate: false } }],
      text: 'Хенрике разрешает остаться. Кёлер получает пачку овсянки из вашего запаса. — На ночь тоже? — спрашивает она. Вы киваете при хозяйке.' },
    { id: 'guard', label: { default: 'Сменить Оле у сарая на полтора часа' },
      when: all(farm, flag('w.c3_f7_shed_lost')), feasible: all(farm, flag('w.c3_f7_shed_lost')),
      effects: [...set('w.c3_trip7', 'guard'), { set: 'w.c3_f7_guard', value: true }, { npc: 'ole', remember: 'c3_promised_shed_watch' }],
      text: 'Оле передаёт вам ключ, но просит не открывать дверь. — Разбудите, если затихнет. — Он уходит в дом. Остальной день вы начинаете у запертого сарая.' },
    { id: 'farm_rest7', label: { default: 'Оставить этот день для нас двоих' },
      when: farm, feasible: farm,
      effects: [...set('w.c3_trip7', 'stay'), { set: 'w.c3_f7_rest', value: true }, { npc: 'henrike', remember: 'c3_kept_own_afternoon' }],
      text: '{partner} просит тебя остаться рядом. Ты говоришь хозяйке, что нового дела не возьмёте. Хенрике зовёт Оле обратно к двери. Дениз остаётся ждать брата сам.' },
    { id: 'north', label: { default: 'Уехать из дома к северному залу' },
      when: atAny(CITY), feasible: north, effects: set('w.c3_trip7', 'north'),
      text: 'Машину и бензин тратите на северный путь сейчас. Возвращаться за оставленным сегодня не будете.' },
    { id: 'farm', label: { default: 'Уйти к Хенрике до темноты' },
      when: all(atAny(SOUTH), not({ at: 'hof_luedemann' })), feasible: farmRoad, effects: set('w.c3_trip7', 'farm'),
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
    { id: 'stay', label: { default: 'Сохранить свой ночлег, никого не брать' }, when: not(farm), effects: set('w.c3_trip7', 'stay'),
      text: 'Вы оставляете место за собой. Помощь придётся искать у других; ваши вещи готовы, если дверь всё же придётся закрыть снаружи.' },
  ]);
  d.arbiters = [
    { id: 'f7_leg_hurt', when: all(farm, { npcVar: 'deniz', key: 'c3_cart_leg' }), winner: 'search', text: 'Дениз не может дойти до поворота один. — Я всё равно пойду, — говорит он. Вы берёте его под руки и выходите вместе.' },
    { id: 'f7_wait_requested', when: all(farm, { any: [flag('A.c7_requested_wait'), flag('B.c7_requested_wait')] }), winner: 'search', text: 'Дениз напоминает, что брату уже предлагали подождать. — Он меня слушал. Теперь я его не брошу. — Вы выходите вместе с ним к повороту.' },
    { id: 'f7_locked_watch', when: all(farm, flag('w.c3_f7_shed_lost')), winner: 'guard', text: 'За дверью ударяет в доски. Оле уже засыпает сидя. Хенрике просит вас сменить его до того, как ключ выпадет из руки.' },
    ...d.arbiters,
    { id: 'f7_couple_hour', when: farm, winner: 'farm_rest7', text: 'Вы садитесь рядом и отказываете в новом обещании. Хенрике забирает ключ обратно. Дениз выходит один.' },
    { id: 'f7_road_wait', when: farm, winner: 'search', text: 'Дениз показывает на пустой поворот. — До вечера там побуду. — Вы берёте воду и выходите с ним.' },
  ];
  return d;
}
function night6(): JointDecision {
  const d = decision(
    'c3_night',
    6,
    'Где вы будете спать и кому уступите место? Прежде чем обещать за двоих, выслушай {partner.acc}.',
    [
      {
        id: 'inside',
        label: { default: 'Отдать Кёлер наш угол и пачку овсянки' },
        when: all(farm, flag('w.c3_koehler_met'), not(flag('w.c3_guest_contract'))),
        feasible: all(checkedGuest, food, { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' }, not(flag('w.c3_guest_contract'))),
        effects: [
          ...set('w.c3_night', 'stay'),
          { set: 'w.c3_guest_contract', value: true },
          { set: 'w.c3_owed_food', value: true },
          { set: 'w.c3_f6_bed_lost', value: true },
          ...foodGift,
          { npc: 'c3_koehler', moveTo: 'hof_luedemann', set: { separate: false }, remember: 'c3_given_their_bed' },
        ],
        text: 'Хенрике разрешает. Вы отдаёте Кёлер свой угол и пачку овсянки. {partner} переносит ваше одеяло к кухонной двери. — Тут вдвоём поместимся?',
      },
      {
        id: 'separate',
        label: { default: 'Устроить Кёлер в сарае, дать пачку овсянки' },
        when: all(farm, flag('w.c3_koehler_met'), not(flag('w.c3_guest_contract'))),
        feasible: all(farm, food, { npc: 'henrike', alive: true, at: 'hof_luedemann' }, { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' }, not(flag('w.c3_guest_contract'))),
        effects: [
          ...set('w.c3_night', 'stay'),
          { set: 'w.c3_guest_contract', value: true },
          ...foodGift,
          { npc: 'c3_koehler', moveTo: 'hof_luedemann', set: { separate: true }, remember: 'c3_given_barn' },
        ],
        text: 'Хенрике освобождает место в сарае. Вы отдаёте Кёлер пачку овсянки; она спрашивает, где набрать воды. — В дом ночью постучать можно? — Хозяйка велит стучать громче.',
      },
      {
        id: 'farm_food', label: { default: 'Дать Кёлер пачку овсянки без ночлега' },
        when: all(farm, flag('w.c3_koehler_met'), not(flag('w.c3_guest_contract'))),
        feasible: all(farm, food, { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' }, not(flag('w.c3_guest_contract'))),
        effects: [...set('w.c3_night', 'stay'), ...foodGift, { set: 'w.c3_guest_food_only', value: true }, { npc: 'c3_koehler', remember: 'c3_food_without_roof' }],
        text: 'Кёлер берёт пачку. — Спасибо. А лечь где? — Ты повторяешь, что места не обещаешь. Она уносит еду во двор.',
      },
      {
        id: 'farm_no', label: { default: 'Сохранить наш угол и еду, отказать Кёлер' },
        when: all(farm, flag('w.c3_koehler_met'), not(flag('w.c3_guest_contract'))), feasible: farm,
        effects: [...set('w.c3_night', 'stay'), { set: 'w.c3_f6_refused', value: true }, { npc: 'c3_koehler', remember: 'c3_refused_at_night' }],
        text: 'Ты говоришь, что за двоих ночлега не обещаешь. Кёлер берёт пальто с твоей лавки. Хенрике открывает ей дверь во двор. — Фонарь оставь до утра, — просит женщина.',
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
        when: not(farm),
        feasible: all(together, same, food),
        effects: [...set('w.c3_night', 'stay'), ...foodGift, { set: 'w.c3_guest_food_only', value: true }],
        text: 'Закрытую пачку отдаёте снаружи. Места под своей крышей не обещаете. Запаса стало меньше, людей внутри столько же.',
      },
      {
        id: 'farm',
        label: { default: 'Утром перейти на хутор' },
        when: all(atAny(SOUTH), not({ at: 'hof_luedemann' })),
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
        when: { any: [not(farm), flag('w.c3_guest_contract'), not(flag('w.c3_koehler_met'))] },
        effects: set('w.c3_night', 'stay'),
        text: 'Проверяете дверь и остаётесь на ночь там, где вы есть. За новых людей своего слова не даёте.',
      },
    ],
  );
  d.arbiters = [
    { id: 'f6_empty_food', when: all(farm, not(food)), winner: 'farm_no', text: 'Хенрике показывает пустую пачку. — На утро самим нечего. Не обещайте еду, которой нет.' },
    { id: 'f6_gate_broken', when: all(farm, flag('w.c3_f6_gate_lost')), winner: 'inside', text: 'Хенрике смотрит на открытую щель у ворот. — Ещё и сарай ночью проверять некому. Осмотрена — пусть в доме. Угол освободите.' },
    { id: 'f6_flour_spilled', when: all(farm, flag('w.c3_f6_flour_lost')), winner: 'inside', text: 'Хенрике смотрит на разрезанный мешок. — С неё хватит. Теперь наше отдаём. — Кёлер ждёт, пока вы уберёте вещи.' },
    ...d.arbiters,
    { id: 'f6_barn_available', when: all(farm, food, { npc: 'henrike', alive: true, at: 'hof_luedemann' }), winner: 'separate', text: 'Хенрике приносит ключ от сарая. — Там переночует. В дом я пока не согласна. — Кёлер соглашается на сарай.' },
    { id: 'f6_food_available', when: all(farm, food), winner: 'farm_food', text: 'Хенрике подвигает закрытую пачку к женщине. — Это можем. Ночлега двое не обещали. — Кёлер забирает еду.' },
    { id: 'f6_no_place_promised', when: farm, winner: 'farm_no', text: 'Хенрике ждёт, пока вы договорите. — За вас обещать не буду. — Кёлер поднимает пальто.' },
  ];
  return d;
}
function lastNight8(): JointDecision {
  const d = decision(
    'c3_lastnight',
    8,
    'Что вы обещаете на ночь и завтрашний день? Сначала договоритесь вдвоём.',
    [
      {
        id: 'care', label: { default: 'Остаться завтра помогать Хенрике, дать пачку на ужин' },
        when: all(farm, food, { npc: 'henrike', alive: true, at: 'hof_luedemann' }),
        feasible: all(farm, food, { npc: 'henrike', alive: true, at: 'hof_luedemann' }),
        effects: [...set('w.c3_after8', 'care'), ...foodGift, { set: 'w.c3_after8_care', value: true }, { npc: 'henrike', remember: 'c3_stayed_to_help_tomorrow' }],
        text: 'Вы отдаёте Оле пачку на общий ужин и обещаете помочь завтра. Он спрашивает, с чего начнёте. {partner} называет одно дело. Ты добавляешь своё.',
      },
      {
        id: 'boards', label: { default: 'Отложить пять килограммов картошки для досок на окно' },
        when: all(farm, flag('w.c3_f8_window_broken')),
        feasible: all(farm, flag('w.c3_f8_window_broken'), { any: [{ has: 'potatoes', qty: 5 }, { stocked: 'potatoes', qty: 5, at: 'c3_farm_stock' }] }),
        effects: [...set('w.c3_after8', 'repair'), { if: not({ has: 'potatoes', qty: 5 }), then: [{ unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }] }, { take: 'potatoes', qty: 5 }, { set: 'w.c3_board_budget', value: 5 }, { npc: 'ole', remember: 'c3_reserved_for_boards' }],
        text: 'Оле забирает отложенный мешок. — Завтра предложу соседу за доски. Сейчас не пойду. — В разбитую кухню на ночь никто не возвращается.',
      },
      {
        id: 'own_path', label: { default: 'Утром уйти вдвоём к дороге без новой смены' },
        when: farm, feasible: all(farm, free),
        effects: [...set('w.c3_after8', 'own_path'), { set: 'w.c3_departure8', value: 'b75_road' }, { npc: 'henrike', remember: 'c3_leaving_together' }],
        text: 'Ты говоришь Оле, что утром вы уйдёте к дороге. Он не просит остаться, только кивает матери. {partner} складывает ваши вещи рядом, чтобы утром не искать по дому.',
      },
      {
        id: 'food',
        label: { default: 'Оставить человека с вами до утра' },
        when: not(farm),
        feasible: all(together, same, free, food),
        effects: [...set('w.c3_after8', 'guest'), ...foodGift, { set: 'w.c3_last_guest', value: true }],
        text: 'Вы кормите человека и оставляете рядом. Для его вещей освобождаете сухой угол. Утром уйти вдвоём, не объяснившись с ним, уже не получится.',
      },
      {
        id: 'water',
        label: { default: 'Проводить людей, отдать воду на путь' },
        when: not(farm),
        feasible: all(together, same, free, { has: 'water_15' }),
        effects: [...set('w.c3_after8', 'escort'), { take: 'water_15' }, { set: 'w.c3_dawn_escort', value: true }],
        text: 'На рассвете вы идёте с теми, кто не знает дороги к раздаче. Бутылку отдаёте им сейчас. Свои утренние дела придётся отложить.',
      },
      {
        id: 'farm',
        label: { default: 'С утра перейти на хутор' },
        when: not(farm),
        feasible: farmRoad,
        effects: set('w.c3_after8', 'farm'),
        text: 'На утро назначена дорога к хутору. Вещи уже не раскладываете по комнате.',
      },
      {
        id: 'north',
        label: { default: 'С утра ехать к северному спортзалу' },
        when: not(farm),
        feasible: north,
        effects: set('w.c3_after8', 'north'),
        text: 'На утро назначена поездка на север. Ключи и бензин остаются на этот путь, чужих поездок до рассвета не берёте.',
      },
      {
        id: 'stay',
        label: { default: 'Сохранить запас и ночевать здесь' },
        effects: [...set('w.c3_after8', 'stay'), { if: farm, then: [{ set: 'w.c3_after8_keep', value: true }, { npc: 'henrike', remember: 'c3_no_new_promise' }] }],
        text: 'Ночь проводите на месте. Закрытые бутылки и еда остаются рядом с вещами.',
      },
    ],
  );
  d.compromises = [...(d.compromises ?? []), { pair: ['own_path', 'stay'], result: 'stay', when: farm }];
  d.arbiters = [
    { id: 'f8_empty_food', when: all(farm, not(food)), winner: 'stay', text: 'Оле показывает пустую пачку. — Такую еду не обещайте. — Вы оставляете ответ на утро, сохранив то, что есть.' },
    { id: 'f8_hurt_host', when: all(farm, { npcVar: 'henrike', key: 'c3_smoke_shoulder' }), winner: 'care', text: 'Хенрике не может поправить подушку под плечом. Оле просит помочь завтра. Вы называете ему время, когда подойдёте.' },
    { id: 'f8_broken_window', when: all(farm, flag('w.c3_f8_window_broken')), winner: 'boards', text: 'Оле показывает на остывшую кухню. — Без досок завтра будет так же. — Вы откладываете мешок сейчас.' },
    ...d.arbiters,
    { id: 'f8_recovering', when: all(farm, flag('w.c3_f8_done')), winner: 'care', text: 'Хенрике снова начинает кашлять. Оле просит вас остаться на завтрашний день. Вы отвечаете ему при ней.' },
    { id: 'f8_son_has_help', when: all(farm, { npc: 'kerem', alive: true, at: 'hof_luedemann' }, { npc: 'deniz', alive: true, at: 'hof_luedemann' }), winner: 'own_path', text: 'Дениз и Керем остаются рядом с Оле. — Утром пойдёте, — говорит он вам. Вы собираете только свои вещи.' },
  ];
  return d;
}
export const jointChapter3: Record<string, JointDecision> = {
  c3_new_route8: point8Route,
  c3_new_van7: point7Van,
  c3_new_depart7: point7Departure,
  c3_l_road6: farm6longRoad,
  c3_new_night6: farm6bNight,
  c3_midday5: midday5(),
  c3_midday7: midday7(),
  c3_night: night6(),
  c3_lastnight: lastNight8(),
};
/** До какой точки глава написана: после неё игроки видят экран «продолжение» (`c{N+1}_start` в chapter3/index.ts). */
export const WRITTEN_TO = 8;
export const checkpoints3: CheckpointDef[] = ([5, 6, 7, 8] as const).filter((n) => n <= WRITTEN_TO).map((n) => ({
  index: n,
  title: { 5: 'Третий полдень', 6: 'Третья ночь', 7: 'Рассвет', 8: 'После поездки' }[n],
  syncNotBefore: n === 8 ? at(13, 11) : n === 7 ? at(13, 7, 45) : segmentEnd(n),
  joint: n === 8 ? ['c3_new_route8'] : n === 7 ? ['c3_new_van7', 'c3_new_depart7'] : n === 6 ? ['c3_l_road6', 'c3_new_night6'] : ['c3_midday5'],
  onMerge: n === 8 ? point8Notes : n === 7 ? point7Notes : n === 6 ? [...farm6bNotes, ...farm6longNotes] : notes(n),
  next: { A: [{ scene: `c${n + 1}_start` }], B: [{ scene: `c${n + 1}_start` }] },
}));
