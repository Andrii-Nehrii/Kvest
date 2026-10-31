import { segmentDay } from './clock';
import type { Outcome, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import {
  A_HOME_PLACES,
  B_HOME_PLACES,
  CITY,
  EAST,
  HARBURG,
  ISLAND,
  NORTH,
  SOUTH,
  atAny,
  carIn,
} from '../chapter2/world2';
import { hub, localMove } from './common';
import { all, C4, flag, isA, isB, not, together } from './world3';

const plan = (id: string): Cond => ({ v: 'w.day3', op: '==', value: id });
const southPlan: Cond = { any: ['farm', 'workshop', 'a_flat'].map(plan) };
const safeFlat = (pid: 'A' | 'B'): Cond =>
  all(
    { any: [{ me: pid }, together] },
    not(flag(`${pid}.flat_lost`)),
    ...(pid === 'A'
      ? [
          not(
            all(
              not({ at: 'a_flat' }),
              { npc: 'gerd', at: 'a_stairs', alive: true, status: 'turned' },
              not({ npcVar: 'gerd', key: 'locked' }),
              not({ npcVar: 'gerd', key: 'tied' }),
            ),
          ),
        ]
      : []),
    not(
      all(
        {
          npc: pid === 'A' ? 'ilse' : 'svenja',
          at: pid === 'A' ? 'a_flat' : 'b_flat',
          alive: true,
          status: 'turned',
        },
        not({
          any: ['isolated', 'locked', 'tied'].map((key) => ({
            npcVar: pid === 'A' ? 'ilse' : 'svenja',
            key,
          })),
        }),
      ),
    ),
  );
export function stayRoutes(n: number): { when?: Cond; scene: string }[] {
  return [
    { when: all({ at: 'farm_coop' }, not(flag('$.c3_coop_clear'))), scene: `c${n}_coop` },
    { when: atAny(['hof_luedemann', 'farm_coop']), scene: `c${n}_farm` },
    { when: all(atAny(A_HOME_PLACES), safeFlat('A')), scene: `c${n}_aflat` },
    { when: all(atAny(B_HOME_PLACES), safeFlat('B')), scene: `c${n}_bflat` },
    {
      when: all(
        { at: 'deniz_workshop' },
        { any: [flag('w.workshop_keys'), { npc: 'deniz', at: 'deniz_workshop', alive: true }] },
      ),
      scene: `c${n}_workshop`,
    },
    { when: atAny(EAST), scene: `c${n}_ahr` },
    { when: atAny(NORTH), scene: `c${n}_north` },
    { when: { at: 'messe_q' }, scene: `c${n}_q` },
    { when: { at: 'messe' }, scene: `c${n}_messe` },
    { when: { at: 'c3_messe_yard' }, scene: `c${n}_messe_yard` },
    { scene: `c${n}_out` },
  ];
}
function routeOutcomes(n: number): Outcome[] {
  return stayRoutes(n).map((r, i) => ({ id: `stay_${i}`, when: r.when, goto: r.scene }));
}
const southOrHarburg = [...SOUTH, ...HARBURG, ...ISLAND];
const travel = (to: string, km: number, zone: string[]): Effect[] => [
  {
    if: all(isA, { has: 'car_keys' }, carIn(zone), { fuelIn: 'opel_corsa', liters: Math.max(1, km * 0.08) }),
    then: [
      ...zone.map((p): Effect => ({ if: { itemAt: 'opel_corsa', place: p }, then: [{ move: p }] })),
      { drive: 'opel_corsa', km, to },
    ],
    else: [{ move: to }],
  },
];
const trip = (
  id: string,
  when: Cond,
  goto: string,
  to: string,
  km: number,
  zone: string[],
  foot: number,
  text: string,
): Outcome => ({
  id,
  when,
  goto,
  text,
  effects: [
    // Физически идёт пешком, если A не может вести; B вместе следует общему маршруту без второго расхода.
    {
      if: not(
        all(
          carIn(zone),
          { fuelIn: 'opel_corsa', liters: Math.max(1, km * 0.08) },
          { any: [{ has: 'car_keys' }, all(isB, together)] },
        ),
      ),
      then: [
        {
          if: all(isB, not(together), flag('B.bike_ready'), not(flag('B.bike_lost'))),
          then: [{ wait: Math.round(foot / 3), activity: 'moderate' }],
          else: [{ wait: foot, activity: 'moderate' }],
        },
      ],
    },
    ...travel(to, km, zone),
  ],
});
export const road: Scene = {
  id: 'c5_road',
  for: 'any',
  chapter: 'ch3',
  title: 'Дневная дорога',
  ambient: { outdoor: true },
  text: [
    {
      when: atAny(CITY),
      text: 'На перекрёстке новый лист поверх вчерашнего: Elbbrücken, 9–14. Пешеходы идут отдельно от машин. На тротуаре мелом нарисована стрелка к посту.',
    },
    {
      when: atAny(southOrHarburg),
      text: 'У дороги на север солдаты показывают на автобус с табличкой Messe. Частные машины разворачивают. На юг проехать пока можно.',
    },
    {
      when: atAny([...EAST, ...NORTH]),
      text: 'У выезда стоит пост. Между машинами расставлены пустые канистры, к ним никто не возвращается. Часовой опускает поперечину перед первым капотом.',
    },
  ],
  actions: [
    {
      id: 'c5_road_wait',
      label: 'Дождаться открытия поста',
      minutes: 45,
      repeatable: true,
      when: { before: at(12, 9) },
      text: 'Очередь не двигается. Ты прячешь руки в рукава и ждёшь, пока у поста сменится часовой.',
    },
    {
      id: 'c5_road_go',
      label: 'Продолжить путь по вчерашнему решению',
      minutes: 60,
      terminal: true,
      when: { after: at(12, 9) },
      outcomes: [
        {
          id: 'late',
          when: all(atAny(CITY), southPlan, { after: at(12, 11, 30) }),
          text: 'До закрытия не успеть. Указатель всё ещё обещает проход, но очередь стоит до поворота. Ты отходишь от дороги и ищешь, где переждать.',
          goto: 'c5_out',
        },
        {
          id: 'no_crossing',
          when: all(
            atAny(CITY),
            southPlan,
            not({
              any: [
                all(carIn(CITY), { fuelIn: 'opel_corsa', liters: 8 }),
                all(isB, not(together), flag('B.bike_ready'), not(flag('B.bike_lost'))),
              ],
            }),
          ),
          text: 'Сегодня пешком через пост не пускают. Машины и велосипеды идут в свою очередь, остальных отводят от шлагбаума. Ты остаёшься на этом берегу.',
          goto: 'c5_out',
        },
        {
          id: 'check',
          when: all(atAny(CITY), { any: [southPlan, plan('north'), plan('messe')] }, flag('$.check_risk')),
          text: 'Медик смотрит на отметку осмотра и не пропускает дальше. «Zur Beobachtung.» Автобус в Messe стоит сбоку, под охраной. Тебя отводят к нему.',
          goto: 'c5_q',
          effects: [{ move: 'messe_q' }],
        },
        {
          id: 'partner_check',
          when: all(
            atAny(CITY),
            { any: [southPlan, plan('north'), plan('messe')] },
            together,
            flag('@partner.check_risk'),
          ),
          goto: 'c5_messe',
          text: 'На посту вас отводят из очереди. В Messe браслеты разного цвета. Ты проходишь в общий зал, всё время оглядываясь на перегородку.',
          effects: [{ move: 'messe' }],
        },
        ...(
          [
            ['local', SOUTH, 0, 100],
            ['harburg', [...HARBURG, ...ISLAND], 20, 340],
            ['city', CITY, 38, 570],
          ] as const
        ).flatMap(([zoneId, zone, extraKm, walk]) => [
          trip(
            `farm_${zoneId}`,
            all(plan('farm'), atAny([...zone])),
            'c5_farm_arrival',
            'hof_luedemann',
            7 + extraKm,
            [...zone],
            walk,
            'У последнего поворота — поле и крыша сарая. Ты останавливаешься перед закрытой калиткой. Собака уже слышит тебя.',
          ),
          trip(
            `ws_${zoneId}`,
            all(plan('workshop'), atAny([...zone]), {
              any: [flag('w.workshop_keys'), { npc: 'deniz', at: 'deniz_workshop', alive: true }],
            }),
            'c5_workshop',
            'deniz_workshop',
            4 + extraKm,
            [...zone],
            walk,
            'Дальше промзоны люди почти не идут. Ты находишь знакомые ворота и проверяешь ключ. Внутри пахнет старым маслом.',
          ),
          trip(
            `a_${zoneId}`,
            all(plan('a_flat'), atAny([...zone]), safeFlat('A')),
            'c5_aflat',
            'a_yard',
            4 + extraKm,
            [...zone],
            walk,
            'У подъезда стало меньше машин. Ты проверяешь лестницу, прежде чем подняться. В квартире холодно, но дверь закрывается.',
          ),
        ]),
        trip(
          'b',
          all(plan('b_flat'), atAny([...CITY, ...EAST]), safeFlat('B')),
          'c5_bflat',
          'b_street',
          10,
          [...CITY, ...EAST],
          120,
          'Ты идёшь против потока с чемоданами. У знакомого подъезда на стекле трещина. Дверь держится; наверху тихо.',
        ),
        trip(
          'north',
          all(plan('north'), atAny(CITY), carIn(CITY), { fuelIn: 'opel_corsa', liters: 6 }),
          'c5_north',
          'north_gym',
          40,
          CITY,
          480,
          'На северном посту проверяют документы и руки. Дальше указатели к Kaltenkirchen. У школьного спортзала человек в красной куртке показывает, где остановиться.',
        ),
        trip(
          'messe',
          all(plan('messe'), atAny(CITY)),
          'c5_messe',
          'messe',
          8,
          CITY,
          90,
          'У автобуса проверяют руки и температуру. Потом долго считают сидящих, записывают имена, снова считают. В Messe ещё принимают.',
        ),
        {
          id: 'bus_messe_q',
          when: all(plan('messe'), atAny(southOrHarburg), flag('$.check_risk')),
          goto: 'c5_q',
          text: 'У автобуса медик задерживается над твоей рукой. На запястье защёлкивают красный браслет. В Messe тебя ведут мимо общей очереди.',
          effects: [
            ...travel('harburg_station', 22, SOUTH),
            { wait: 140, activity: 'rest' },
            { move: 'messe_q' },
          ],
        },
        {
          id: 'bus_messe',
          when: all(plan('messe'), atAny(southOrHarburg)),
          goto: 'c5_messe',
          text: 'У вокзала Harburg очередь в автобус. Машины оставляют на южном берегу. В Messe записывают имена и выдают белые браслеты.',
          effects: [
            ...travel('harburg_station', 22, SOUTH),
            { wait: 140, activity: 'rest' },
            { move: 'messe' },
          ],
        },
        ...routeOutcomes(5),
      ],
    },
  ],
};

export function entry(n: number): Scene {
  const plannedAway: Cond = all(
    C4,
    not(plan('stay')),
    not({ at: 'messe_q' }),
    not({ at: 'farm_coop' }),
    not({
      any: [
        all(plan('farm'), { at: 'hof_luedemann' }),
        all(plan('workshop'), { at: 'deniz_workshop' }),
        all(plan('a_flat'), atAny(A_HOME_PLACES)),
        all(plan('b_flat'), atAny(B_HOME_PLACES)),
        all(plan('messe'), { at: 'messe' }),
        all(plan('north'), atAny(NORTH)),
      ],
    }),
  );
  return {
    ...hub(
      n,
      'start',
      undefined,
      n < 7 ? '12 ноября' : '13 ноября',
      'Свет доходит до застёжки рюкзака. Ты проверяешь, сухая ли ткань под ремнём. Шнурки остаются завязанными с ночи.',
      'Снаружи уже темно. Ты берёшь рюкзак за обе лямки. Одна перекручена, и ты расправляешь её перед первым шагом.',
      [],
    ),
    actions: [
      {
        id: `c${n}_sleep`,
        label: 'Устроиться на ночь и попытаться уснуть',
        minutes: 0,
        repeatable: true,
        when: { before: at(segmentDay(n), 6) },
        effects: [{ sleep: 360 }],
      },
      {
        id: `c${n}_begin`,
        label: 'Подняться и заняться делами',
        minutes: 5,
        terminal: true,
        when: { after: at(segmentDay(n), 6) },
        outcomes: [
          ...(n === 5 ? [{ id: 'road', when: plannedAway, goto: 'c5_road' }] : []),
          ...(n === 6 || n === 8
            ? [
                {
                  id: 'supply',
                  when: { v: `w.c3_trip${n - 1}`, op: '==', value: 'water' } as Cond,
                  goto: `c${n}_supply`,
                },
                {
                  id: 'exchange',
                  when: { v: `w.c3_trip${n - 1}`, op: '==', value: 'exchange' } as Cond,
                  goto: `c${n}_neighbor`,
                },
              ]
            : []),
          ...(n === 7
            ? [
                {
                  id: 'relocate',
                  when: {
                    any: [
                      { v: 'w.c3_night', op: '==', value: 'farm' },
                      { v: 'w.c3_night', op: '==', value: 'north' },
                    ],
                  } as Cond,
                  goto: 'c7_relocate',
                },
              ]
            : []),
          ...routeOutcomes(n),
        ],
      },
    ],
  };
}
export const arrival = hub(
  5,
  'farm_arrival',
  'hof_luedemann',
  'У ворот',
  'Мужчина с ружьём ждёт у калитки. Из дома выходит женщина. — Хенрике. Это Оле, — говорит она, заметив твой взгляд. Потом смотрит на твои руки и лицо.',
  'У ворот темно, из дома светит узкая щель. Хенрике сама выходит на крыльцо, не передавая лампу Оле.',
  [
    localMove(
      5,
      'farm_enter',
      'Дождаться проверки у калитки',
      'c5_farm',
      10,
      all(flag('w.farm_welcome'), not(flag('$.check_risk'))),
    ),
    localMove(5, 'farm_coop', 'Принять место в старом курятнике', 'c5_coop', 10, flag('$.check_risk'), [
      { set: '$.c3_new_coop', value: true },
    ]),
    localMove(
      5,
      'farm_barn',
      'Принять место в сарае',
      'c5_farm',
      10,
      all(not(flag('w.farm_welcome')), not(flag('$.check_risk'))),
    ),
  ],
);

export const relocation: Scene = {
  id: 'c7_relocate',
  for: 'any',
  chapter: 'ch3',
  title: 'Утренняя дорога',
  ambient: { outdoor: false, wet: false },
  text: [
    {
      text: 'Ты берёшь рюкзак прежде, чем кто-то успевает предложить ещё чаю. За дверью холодный воздух. Вчерашний разговор теперь приходится выполнять.',
    },
  ],
  actions: [
    {
      id: 'c7_relocate_go',
      label: 'Идти по согласованному пути',
      minutes: 20,
      terminal: true,
      outcomes: [
        trip(
          'farm',
          { v: 'w.c3_night', op: '==', value: 'farm' },
          'c7_farm',
          'hof_luedemann',
          7,
          SOUTH,
          100,
          'У знакомой калитки ждут, пока выйдет хозяйка. Она смотрит на руки и вещи. На этот раз твоё имя уже помнит.',
        ),
        trip(
          'north',
          { v: 'w.c3_night', op: '==', value: 'north' },
          'c7_north',
          'north_gym',
          40,
          CITY,
          480,
          'У поста на севере очередь короче вчерашней. В спортзале сперва проверяют руки, потом показывают, куда поставить вещи.',
        ),
        ...routeOutcomes(7),
      ],
    },
  ],
};
