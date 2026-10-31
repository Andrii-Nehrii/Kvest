import { segmentEnd, inSegment } from './clock';
// Глава 3: все новые часы мира включаются только после КТ 4.
import type {
  AgendaItem,
  BaseDef,
  Content,
  FactDef,
  NpcDef,
  LocationDef,
  ProjectDef,
  WorldEvent,
} from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';

export const C4: Cond = { cp: 4 };
export const C5: Cond = { cp: 5 };
export const all = (...xs: Cond[]): Cond => ({ all: xs });
export const not = (x: Cond): Cond => ({ not: x });
export const flag = (x: string): Cond => ({ flag: x });
export const isA: Cond = { me: 'A' };
export const isB: Cond = { me: 'B' };
export const together = flag('w.together');
export const alone = not(together);
export const keeper = (host: 'A' | 'B' = 'A'): Cond => ({ any: [{ me: host }, alone] });
export const day = (d: number): Cond => all({ after: at(d, 6) }, { before: at(d, 17) });
export const daylightWork = (d: number): Cond => all({ after: at(d, 8) }, { before: at(d, 16) });
export const evening = (d: number): Cond => ({ after: at(d, 17) });
export const npcHere = (id: string, location: string): Cond => ({ npc: id, at: location, alive: true });

export const locations3: Record<string, LocationDef> = Object.fromEntries(
  [
    ...['farm', 'a', 'b', 'ws'].map((id): LocationDef => ({
      id: `c3_${id}_stock`,
      name: 'Общий запас',
      region: id === 'b' ? 'hh' : 'buchholz',
      indoor: true,
    })),
    { id: 'c3_neighbor', name: 'Соседний двор у Jesteburg', region: 'lk', indoor: false, media: ['people'] },
    {
      id: 'c3_messe_yard',
      name: 'Двор за павильонами Messe',
      region: 'hh',
      indoor: false,
      media: ['people'],
    },
  ].map((l) => [l.id, l as LocationDef]),
);

export const facts3: Record<string, FactDef> = Object.fromEntries(
  [
    ['f_c3_well', 'У колодца на хуторе треснул шланг ручного насоса. Ведро и ворот работают и без него.'],
    ['f_c3_exchange', 'Сосед хутора готов обменять рабочий шланг и крепёж на картошку. В долг не даёт.'],
    ['f_c3_okafor', 'Окафор после укуса заперся у себя. Просит не входить, даже если перестанет отвечать.'],
    [
      'f_c3_messe_closed',
      'Пункт приёма в Messe закрыт. Внутри были нападения, людей выводят через служебные дворы.',
    ],
  ].map(([id, text]) => [id, { id, text, topic: 'место', truth: 'true' } as FactDef]),
);

export const agenda3: Record<string, AgendaItem[]> = {
  okafor: [
    {
      id: 'c3_fever',
      at: at(12, 13, 10),
      scope: 'world',
      when: all(C4, flagNpc('bitten'), { npc: 'okafor', status: 'injured' }),
      effects: [{ npc: 'okafor', status: 'sick' }],
    },
    {
      id: 'c3_acute',
      at: at(12, 21, 10),
      scope: 'world',
      when: all(C4, flagNpc('bitten'), { npc: 'okafor', status: 'sick' }),
      effects: [{ npc: 'okafor', status: 'infected' }],
    },
    {
      id: 'c3_turned',
      at: at(13, 9, 10),
      scope: 'world',
      when: all(C4, flagNpc('bitten'), { npc: 'okafor', status: 'infected' }),
      effects: [{ npc: 'okafor', status: 'turned' }],
    },
  ],
};
function flagNpc(key: string): Cond {
  return { npcVar: 'okafor', key };
}

export const events3: WorldEvent[] = [
  {
    id: 'ev3_corridor_open',
    at: at(12, 9),
    scope: 'world',
    when: C4,
    effects: [{ set: 'w.corridor_closed', value: false }],
  },
  {
    id: 'ev3_corridor_close',
    at: at(12, 14),
    scope: 'world',
    when: C4,
    effects: [{ set: 'w.corridor_closed', value: true }],
  },
  {
    id: 'ev3_messe',
    at: at(13, 9),
    scope: 'world',
    when: C4,
    effects: [
      { set: 'w.c3_messe_outbreak', value: true },
      { set: 'w.messe', value: 'closed' },
    ],
  },
  {
    id: 'ev3_messe_radio',
    at: at(13, 12),
    scope: 'world',
    when: C4,
    news: [
      {
        channel: 'radio',
        learn: 'f_c3_messe_closed',
        text: 'Передача обрывается на середине прогноза. «Die Sammelstelle Messe ist geschlossen. Nicht anfahren.» Диктор просит не ехать к выставочным залам. Про тех, кто внутри, не говорит.',
      },
    ],
  },
  ...([5, 6, 7, 8] as const).map((n): WorldEvent => ({
    id: `ev3_cp${n}`,
    at: segmentEnd(n) - 60,
    scope: 'world',
    when: inSegment(n),
    interrupt: true,
    effects: [{ set: `$.c${n}_due`, value: true }],
    news: [
      {
        channel: 'direct',
        text:
          n % 2
            ? 'До полудня остался час. Телефон лежит рядом с вещами, экраном вниз. Ты переворачиваешь его, чтобы не пропустить короткий сигнал.'
            : 'За дверью уже темно. Ты освобождаешь место для ночлега и ставишь обувь рядом. Связаться лучше до сна.',
      },
    ],
  })),
  ...(['messe', 'messe_q'] as const).map((place): WorldEvent => ({
    id: `ev3_alarm_${place}`,
    at: at(13, 9),
    scope: 'world',
    interrupt: true,
    when: all({ cp: 6 }, { at: place }, { before: at(13, 20) }),
    effects: [{ set: '$.c3_alarm', value: true }],
    news: [
      {
        channel: 'direct',
        text:
          place === 'messe'
            ? 'Падает перегородка. Над рядами слышно «Zurück!», но назад тоже бегут люди. Зелёная табличка выхода остаётся видна над плечами.'
            : 'У ширмы хлопает металлическая опора. Медсестра зовёт к служебной двери, солдат держит сетку плечом. За ней люди уже не идут ровно.',
      },
    ],
  })),
];

export const bases3: BaseDef[] = [
  {
    id: 'c3_farm',
    name: 'Хутор Людеманов',
    places: ['hof_luedemann', 'farm_coop'],
    stock: 'c3_farm_stock',
    from: 4,
    waterPerPerson: 3,
    kcalPerPerson: 2200,
    freeWater: { always: true },
    heating: { tag: 'firewood', perDay: (t) => (t < 5 ? 22 : 14) },
  },
  ...(
    [
      ['a', 'a_flat'],
      ['b', 'b_flat'],
      ['ws', 'deniz_workshop'],
    ] as const
  ).map(([id, loc]): BaseDef => ({
    id: `c3_${id}`,
    name: id === 'ws' ? 'Мастерская' : 'Квартира',
    places: [loc],
    stock: `c3_${id}_stock`,
    from: 4,
    waterPerPerson: 3,
    kcalPerPerson: 2200,
    ...(id === 'b' ? { freeWater: not({ v: 'w.water.hh', op: '==', value: 'off' }) } : {}),
  })),
];
export const projects3: Record<string, ProjectDef> = {
  c3_fence: {
    id: 'c3_fence',
    name: 'Поперечина калитки',
    at: ['hof_luedemann'],
    hours: 3,
    traits: ['technical', 'strength'],
    difficulty: 3,
    onDone: [],
  },
  c3_pump: {
    id: 'c3_pump',
    name: 'Шланг ручного насоса',
    at: ['hof_luedemann'],
    hours: 2,
    traits: ['technical'],
    difficulty: 3,
    needs: [{ type: 'c3_hose', qty: 1, consumed: true }],
    onDone: [],
  },
  c3_shutters_a: {
    id: 'c3_shutters_a',
    name: 'Засов общего подъезда',
    at: ['a_flat'],
    hours: 3,
    traits: ['technical'],
    difficulty: 3,
    onDone: [],
  },
  c3_shutters_b: {
    id: 'c3_shutters_b',
    name: 'Засов общего подъезда',
    at: ['b_flat'],
    hours: 3,
    traits: ['technical'],
    difficulty: 3,
    onDone: [],
  },
  c3_ws_door: {
    id: 'c3_ws_door',
    name: 'Нижняя направляющая ворот',
    at: ['deniz_workshop'],
    hours: 3,
    traits: ['technical'],
    difficulty: 4,
    onDone: [],
  },
};
export const stock3: NonNullable<Content['initialPlaceItems']> = [
  ...(
    [
      ['potatoes', 90],
      ['oats', 12],
      ['firewood', 70],
    ] as const
  ).map(([type, qty]) => ({ key: `c3-farm-${type}`, type, qty, at: 'c3_farm_stock' })),
  ...(['a', 'b', 'ws'] as const).flatMap((id) =>
    (
      [
        ['oats', id === 'ws' ? 2 : 3],
        ['water_l', id === 'b' ? 12 : 18],
      ] as const
    ).map(([type, qty]) => ({ key: `c3-${id}-${type}`, type, qty, at: `c3_${id}_stock` })),
  ),
];

export const npcs3: Record<string, NpcDef> = {
  c3_koehler: {
    id: 'c3_koehler',
    name: 'Элке Кёлер',
    intro: 'Работала в пекарне у Jesteburg. Говорит без просьб до последнего, помогает себе руками.',
    hidden: { goals: ['найти сухой ночлег, сохранить еду'], fears: ['потерять возможность обмена'] },
    initial: {
      alive: true,
      location: 'c3_neighbor',
      status: 'ok',
      trust: { A: 0, B: 0 },
      memory: [],
      vars: {},
    },
    agenda: [
      {
        id: 'c3_visit',
        at: at(12, 14),
        scope: 'world',
        when: all({ cp: 5 }, { npc: 'c3_koehler', at: 'c3_neighbor' }),
        effects: [{ npc: 'c3_koehler', moveTo: 'hof_luedemann' }],
      },
      {
        id: 'c3_uncertain_night',
        at: at(13, 0),
        scope: 'world',
        when: all({ cp: 6 }, not(flag('w.c3_guest_contract'))),
        effects: [{ npc: 'c3_koehler', moveTo: 'c3_neighbor', set: { waited_outside: true } }],
      },
      {
        id: 'c3_back',
        at: at(13, 7),
        scope: 'world',
        when: all({ cp: 6 }, { npc: 'c3_koehler', at: 'c3_neighbor' }),
        effects: [{ npc: 'c3_koehler', moveTo: 'hof_luedemann' }],
      },
      {
        id: 'c3_leave',
        at: at(13, 18),
        scope: 'world',
        when: all({ cp: 7 }, not(flag('w.c3_guest_contract'))),
        effects: [{ npc: 'c3_koehler', moveTo: 'c3_neighbor' }],
      },
    ],
  },
};
agenda3.kerem = [
  {
    id: 'c3_road',
    at: at(13, 12, 20),
    scope: 'world',
    when: all(
      { cp: 6 },
      { npc: 'kerem', at: 'hof_luedemann' },
      not(flag('w.c3_kerem_stays')),
      flag('w.c3_kerem_road'),
    ),
    effects: [{ npc: 'kerem', moveTo: 'b75_road' }],
  },
];
agenda3.pawel = [
  {
    id: 'c3_hand_rest',
    at: at(12, 18),
    scope: 'world',
    when: all(
      { cp: 5 },
      { npc: 'pawel', at: 'hof_luedemann' },
      not({ npcVar: 'pawel', key: 'c3_hand_treated' }),
    ),
    effects: [{ npc: 'pawel', set: { c3_rest_hand: true } }],
  },
];
