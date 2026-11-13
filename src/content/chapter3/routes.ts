import { A18, B18, P18, point18Available } from './point18';
import { any as any18, ninaFarm as ninaFarm18, v as v18 } from './point18';
import { A19, B19, atFarm, byGirl, cold19, evaHere, girlHere, henrikeHome, inLue, janaHere, point19Available, point20Available, set19, until, uteHere, volkerHere, npc as npc19 } from './point19';
import { indoor16 } from './point16';
import { bflat5EntryActions, bflat5EntryText, bflat5EntryWhen } from './bflat5';
import { segmentDay } from './clock';
import { farm6bAvailable } from './farm6b';
import { point8Available, road8 } from './point8';
import { A9, P9, eastStart9, farmStart9, keremHere9, laneStart9, morning9, outdoor9, point9Available, yard9 } from './point9';
import { carAt9, ride9, walk9, yardActions9, yardText9 } from './entry9';
import { P10, kept10, meSearch10, partnerSearch10, point10Available } from './point10';
import { P11, ole11, point11Available } from './point11';
import type { ActionDef, Outcome, Scene } from '../../engine/content-types';
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
import { A12, B12, P12, P13, guests13, house12, kitchen12, point12Available, point13Available, report12, wound12 } from './point12';
import { A14, P14, P15, house14, jens15, nina15, point14Available, point15Available, yard14 } from './point14';
import { A16, P16, P17, albers17, garden16, ninaAway, ninaHere, point16Available, point17Available, sweep17 } from './point16';

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
  if (n === 6) return [{ when: farm6bAvailable, scene: 'c6_r_kitchen' }, { scene: 'c6_start' }];
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

/** Вход в новый участок; остальные линии пока ждут продолжения. Старые журналы c6_begin не исполняются. */
export const newEntry6: Scene = {
  id: 'c6_start', for: 'any', chapter: 'ch3', title: 'После полудня', universal: false,
  safe: true, ambient: { tempC: 16, wet: false, outdoor: false },
  text: [
    { when: farm6bAvailable, text: 'После обеда пора браться за воду, которую вы обещали принести. Но Павел собирает вещи: после утренней угрозы он не хочет больше здесь спать. Прежде чем идти к Оле во двор, ты останавливаешься у кухонной двери.' },
    { when: not(farm6bAvailable), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: [{ id: 'c6_rev_begin', label: 'Вернуться на кухню к Хенрике и Павлу', when: farm6bAvailable, minutes: 1, terminal: true, goto: 'c6_r_kitchen' }],
};

// Этот вход уже входит в базу КТ7. Новые эффекты — только в первом личном ходе.
export const newEntry8: Scene = {
  id: 'c8_start', for: 'any', chapter: 'ch3', title: 'Продолжение', universal: false,
  camp: road8, safe: true, ambient: { tempC: 9, outdoor: true, wet: false },
  text: [
    { when: all(point8Available, { v: 'w.c7_departure', op: '==', value: 'car' }), text: 'Вы остановились у дороги к Йестебургу. Павел выходит из Corsa со своей сумкой. Подвоз закончился; дальше он хочет найти попутку.\n\nУ остановки стоит белый микроавтобус. Дверца открыта. Павел спрашивает, по пути ли им на восток.\n\nВы ещё можете вернуться к Хенрике. Решение о ночлеге не заставляет уезжать с хутора навсегда.' },
    { when: all(point8Available, { v: 'w.c7_departure', op: '==', value: 'walk' }), text: 'Вы дошли с Павлом до дороги к Йестебургу. Он ставит сумку на скамейку. Corsa осталась у Хенрике; дальше Павел хочет найти попутку.\n\nУ остановки стоит белый микроавтобус. Дверца открыта. Павел спрашивает, по пути ли им на восток.\n\nВы ещё можете вернуться на хутор. Утренний выход не отменяет вашего места там.' },
    { when: not(point8Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: [
    { id: 'c8_begin', label: 'Подойти вместе с Павлом к микроавтобусу', when: point8Available, minutes: 2, terminal: true, goto: 'c8_stop',
      text: 'Павел сам здоровается и объясняет, куда ему нужно. Ты остаёшься рядом. Женщина за рулём представляется Рут.',
      effects: [{ introduceNpc: 'c8_ruth' }, { introduceNpc: 'c8_eva' }, { set: '$.met.c8_ruth', value: true }, { set: '$.met.c8_eva', value: true }, { camp: { kind: 'prepare', quiet: true } }] },
    { id: 'c8_begin_short', label: 'Сначала сказать Павлу, что вы решите возвращение отдельно', when: point8Available, minutes: 3, terminal: true, goto: 'c8_stop',
      text: '«Я понимаю», — отвечает Павел. Вы идёте к микроавтобусу. Рут открывает водительскую дверь, чтобы говорить с вами без стекла.',
      effects: [{ introduceNpc: 'c8_ruth' }, { introduceNpc: 'c8_eva' }, { set: '$.met.c8_ruth', value: true }, { set: '$.met.c8_eva', value: true }, { set: '$.c8_short_trip', value: true }, { camp: { kind: 'prepare', quiet: true } }] },
  ],
};
// Вход уже входит в подписанную базу КТ8: никаких onEnter и места. Эффекты — в первом ходе.
export const newEntry9: Scene = {
  id: 'c9_start', for: 'any', chapter: 'ch3', title: 'После дороги', universal: false,
  camp: yard9, safe: true, ambient: { tempC: 8, outdoor: true, wet: false },
  text: [
    ...yardText9(false).slice(0, 3).map(b => ({ ...b, when: all(point9Available, farmStart9, b.when ?? { always: true }) })),
    { when: all(point9Available, farmStart9, not(keremHere9), { npc: 'kerem', at: 'b75_road' }, { v: 'w.c8_direction', op: '==', value: 'home_foot' }),
      text: 'По дороге сюда вам навстречу попался Керем с рюкзаком. Он кивнул и не остановился.' },
    { when: all(point9Available, farmStart9, { v: 'w.c8_direction', op: '==', value: 'home_foot' }), text: 'Corsa осталась у остановки, в четырёх километрах отсюда.' },
    { when: all(point9Available, laneStart9), text: 'Микроавтобус Рут скрылся за поворотом. Вы сидите на скамейке у остановки. Corsa стоит на обочине.\n\nДо хутора четыре километра. Вещи по-прежнему у Хенрике. Вы остались здесь передохнуть, а не уехать насовсем.' },
    { when: all(point9Available, eastStart9), text: 'Перед перекрёстком стоят пять машин. Дальше дорогу перегородили два грузовика бундесвера. Солдат в каске идёт вдоль очереди и наклоняется к каждому окну.\n\nМикроавтобуса Рут здесь нет: он свернул раньше. Слух о завале оказался правдой. Только завал устроили люди.' },
    { when: not(point9Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    ...yardActions9('c9_begin').map(a => ({ ...a, when: all(point9Available, farmStart9, a.when ?? { always: true }) })),
    { id: 'c9_begin_lane_car', label: 'Ехать обратно на хутор: 20 минут, 0,26 л', when: all(point9Available, laneStart9, carAt9('c7_farm_lane', 0.26)),
      minutes: 20, activity: 'light', terminal: true, goto: 'c9_yard', effects: [...morning9, ride9(4)],
      outcomes: [{ id: 'a', when: A9, text: 'Ты садишься за руль. Поле за окном серое, на обочине стоят лужи. До поворота к хутору вы молчите: оба думаете о Павле.' },
        { id: 'b', text: 'Ты садишься рядом с {A.ins}. Поле за окном серое, на обочине стоят лужи. До поворота к хутору вы молчите: оба думаете о Павле.' }] },
    { id: 'c9_begin_lane_foot', label: 'Идти обратно на хутор пешком: около 55 минут', when: all(point9Available, laneStart9, not(carAt9('c7_farm_lane', 0.26))),
      minutes: 55, activity: 'moderate', move: true, terminal: true, goto: 'c9_yard', effects: [...morning9, walk9],
      ambientDuring: outdoor9, text: 'Вы идёте по краю дороги. Машина остаётся у остановки. Через час впереди показывается крыша хутора.' },
    { id: 'c9_begin_lane_talk', label: 'Сказать {partner.dat}, что хочешь домой', when: all(point9Available, laneStart9), minutes: 2, combinable: true, group: 'c9_begin_talk',
      text: '{partner} кивает. — Я тоже. Странно говорить «домой» про чужой хутор. — Но вы оба так и говорите.', effects: [{ body: 'stress', delta: -2 }] },
    { id: 'c9_begin_east_ask', label: 'Подъехать ближе и спросить солдата, что впереди', when: all(point9Available, eastStart9), minutes: 6, terminal: true, goto: 'c9_east_post', effects: morning9,
      text: 'Вы встаёте в хвост очереди. Солдат доходит до вас через пять минут.' },
    { id: 'c9_begin_east_turn', label: 'Не ждать и сразу развернуться к хутору', when: all(point9Available, eastStart9, carAt9('c8_east_road', 0.9)), minutes: 40, activity: 'light', terminal: true, goto: 'c9_yard',
      effects: [...morning9, ride9(14)], outcomes: [{ id: 'a', when: A9, text: 'Ты разворачиваешь Corsa через сплошную. Обратная дорога кажется короче. Через сорок минут — поворот к хутору.' },
        { id: 'b', text: '{A} разворачивает Corsa через сплошную. Обратная дорога кажется короче. Через сорок минут — поворот к хутору.' }] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P9, a.when ?? { always: true }) })),
};



// Вход уже входит в подписанную базу КТ9: без onEnter и места. Уход Дениза и всё новое — первым ходом.
const denizLeaves10 = { npc: 'deniz', moveTo: 'b75_road', set: { c10_with_kerem: true } } as const;
export const newEntry10: Scene = {
  id: 'c10_start', for: 'any', chapter: 'ch3', title: 'Фонарь за сараем', universal: false,
  safe: true, ambient: { tempC: 5, outdoor: true, wet: false },
  text: [
    { when: all(point10Available, meSearch10, partnerSearch10), text: 'Дениз ждёт у калитки с фонарём. Вы выходите вдвоём следом за ним.' },
    { when: all(point10Available, meSearch10, not(partnerSearch10)), text: 'Дениз ждёт у калитки с фонарём. {partner} остаётся на крыльце и смотрит, как ты застёгиваешь куртку.' },
    { when: all(point10Available, not(meSearch10), partnerSearch10), text: '{partner} застёгивает куртку и уходит с Денизом. Ты стоишь на крыльце, пока их фонарь не скрывается за сараем.' },
    { when: all(point10Available, not(meSearch10), not(partnerSearch10)), text: 'Дениз уходит один. Его фонарь ещё долго мигает между деревьями. Хенрике закрывает калитку на засов.' },
    { when: all(point10Available, kept10), text: 'Под навесом, закутавшись в одеяло, сидит Нина. Лицом к фургону.' },
    { when: all(point10Available, not(kept10)), text: 'Дверца фургона закрыта. Нина на кухне, у печи. Она не плачет.' },
    { when: not(point10Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c10_begin_go', label: 'Идти за Денизом в темноту', when: all(point10Available, meSearch10), minutes: 2, terminal: true, goto: 'c10_s_gate', effects: [denizLeaves10] },
    { id: 'c10_begin_stay', label: 'Вернуться в дом', when: all(point10Available, not(meSearch10)), minutes: 2, terminal: true, goto: 'c10_f_kitchen', effects: [denizLeaves10] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P10, a.when ?? { always: true }) })),
};


// Вход в базе КТ10: без onEnter и места. Ночь — первым личным ходом (сон или смена у двери).
export const newEntry11: Scene = {
  id: 'c11_start', for: 'any', chapter: 'ch3', title: 'Остаток ночи', universal: false, safe: true,
  ambient: { tempC: 15, outdoor: false, wet: false },
  text: [
    { when: all(point11Available, ole11('coop')), text: 'Щеколда курятника задвинута. Хенрике сидит у его двери, завернувшись в одеяло, и не уходит. В доме тихо.' },
    { when: all(point11Available, ole11('door')), text: 'Засов на двери Оле задвинут. Первым у двери дежурит {A}. Под утро его сменит {B}.' },
    { when: all(point11Available, ole11('sleep')), text: 'Вы ложитесь. Хенрике дремлет на табурете у двери сына. Засов никто не задвигает.' },
    { when: not(point11Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c11_night_sleep', label: 'Лечь и попробовать уснуть', when: all(point11Available, { any: [ole11('coop'), ole11('sleep')] }), minutes: 1, terminal: true, goto: 'c11_dawn',
      text: 'Ты засыпаешь не сразу. Потом проваливаешься, как в яму.', effects: [{ restUntil: at(14, 5, 10), sleeping: true }] },
    { id: 'c11_night_watch_a', label: 'Отсидеть первую смену у двери и лечь', when: all(point11Available, ole11('door'), { me: 'A' }), minutes: 1, terminal: true, goto: 'c11_dawn',
      text: 'Ты сидишь у двери до половины четвёртого. За дверью то тихо, то Оле бормочет что-то без слов. Потом тебя сменяет {B}, и ты засыпаешь в одежде.',
      effects: [{ restUntil: at(14, 3, 30) }, { restUntil: at(14, 5, 10), sleeping: true }] },
    { id: 'c11_night_watch_b', label: 'Поспать до своей смены и сменить {A.acc}', when: all(point11Available, ole11('door'), { me: 'B' }), minutes: 1, terminal: true, goto: 'c11_dawn',
      text: 'В половине четвёртого {A} трогает тебя за плечо. Ты садишься на его место у двери. За ней тяжело, часто дышат.',
      effects: [{ restUntil: at(14, 3, 30), sleeping: true }, { restUntil: at(14, 5, 10) }] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P11, a.when ?? { always: true }) })),
};

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

const farmPair: Cond = all({ at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, flag('w.together'));
const FARM_START: Record<number, string> = {
  6: '{partner} подаёт тебе куртку с лавки. — Пошли, пока светло. — У двери Оле стучит вёдрами друг о друга, сбивая грязь.',
  7: '{partner} раскладывает одеяло на двоих и ждёт, пока ты снимешь обувь. — Ночью без меня не вставай. — Хенрике гасит лампу над столом.',
  8: 'Стол после разговора пустеет медленно. {partner} допивает твою воду и ставит кружку вверх дном. — Ну. Пошли делать, что решили.',
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
  const start = hub(
      n,
      'start',
      undefined,
      n < 7 ? '12 ноября' : '13 ноября',
      'Свет доходит до застёжки рюкзака. Ты проверяешь, сухая ли ткань под ремнём. Шнурки остаются завязанными с ночи.',
      'Снаружи уже темно. Ты берёшь рюкзак за обе лямки. Одна перекручена, и ты расправляешь её перед первым шагом.',
      [],
    );
  return {
    ...start,
    text: n === 5 ? [
      { when: all({ before: at(12, 6) }, { at: 'hof_luedemann' }), text: 'Хенрике показывает тебе место у печи. На лавке лежат два свёрнутых одеяла. — Обувь в сенях. Если понадоблюсь, стучи. — Дверь своей комнаты она оставляет приоткрытой.' },
      ...bflat5EntryText,
      ...start.text.map(b => ({ ...b, when: all(b.when ?? { always: true }, not(all({ before: at(12, 6) }, { any: [{ at: 'hof_luedemann' }, bflat5EntryWhen] }))) })),
    ] : [
      // Хутор вместе: начало участка написано для этого места, общий текст — для остальных.
      ...(FARM_START[n] ? [{ when: farmPair, text: FARM_START[n] }] : []),
      ...start.text.map(b => (FARM_START[n] ? { ...b, when: all(b.when ?? { always: true }, not(farmPair)) } : b)),
    ],
    actions: [
      ...(n === 5 ? bflat5EntryActions : []),
      {
        id: `c${n}_sleep`,
        label: 'Уложить вещи на ночь',
        minutes: 5,
        terminal: true,
        when: all({ before: at(segmentDay(n), 6) }, ...(n === 5 ? [not(bflat5EntryWhen)] : [])),
        outcomes: routeOutcomes(n),
      },
      {
        id: `c${n}_begin`,
        label: 'Подняться и заняться делами',
        minutes: 5,
        terminal: true,
        when: { after: at(segmentDay(n), 6) },
        outcomes: [
          ...(n === 5 ? [{ id: 'road', when: plannedAway, goto: 'c5_road' }] : []),
          ...(n === 8 ? [{ id: 'farm_shift', when: all({ at: 'hof_luedemann' }, { any: [all(flag('w.c3_f7_guard'), not(flag('$.c8_guard_cost'))), all({ v: 'w.c3_trip7', op: '==', value: 'search' }, not(flag('$.c8_search_cost')))] }), goto: 'c8_fshift' }] : []),
          ...(n === 6 ? [{ id: 'farm_water', when: all({ at: 'hof_luedemann' }, { v: 'w.c3_trip5', op: '==', value: 'relieve' }, not(flag('$.c6_promise_cost'))), goto: 'c6_fwater' }] : []),
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
          ...(n === 8
            ? [{ id: 'new_road', when: { any: [{ v: 'w.c3_trip7', op: '==', value: 'farm' }, { v: 'w.c3_trip7', op: '==', value: 'north' }] } as Cond, goto: 'c8_relocate' }]
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

export function relocate(n: 7 | 8): Scene {
  const planKey = n === 7 ? 'w.c3_night' : 'w.c3_trip7';
  return {
  id: `c${n}_relocate`,
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
      id: `c${n}_relocate_go`,
      label: 'Идти по согласованному пути',
      minutes: 20,
      terminal: true,
      outcomes: [
        trip(
          'farm',
          { v: planKey, op: '==', value: 'farm' },
          `c${n}_farm`,
          'hof_luedemann',
          7,
          SOUTH,
          100,
          'У знакомой калитки ждут, пока выйдет хозяйка. Она смотрит на руки и вещи. На этот раз твоё имя уже помнит.',
        ),
        trip(
          'north',
          { v: planKey, op: '==', value: 'north' },
          `c${n}_north`,
          'north_gym',
          40,
          CITY,
          480,
          'У поста на севере очередь короче вчерашней. В спортзале сперва проверяют руки, потом показывают, куда поставить вещи.',
        ),
        ...routeOutcomes(n),
      ],
    },
  ],
};

}

// Свой паёк новой точки записывается первым ходом, как в участках 7–9.
const prepareCamp: Effect = { camp: { kind: 'prepare', quiet: true } };

// Вход в базе КТ11: без onEnter и места. Оле переносят в дом первым ходом на обеих линиях.
export const newEntry12: Scene = {
  id: 'c12_start', for: 'any', chapter: 'ch3', title: 'После полудня', universal: false, safe: true, camp: kitchen12,
  ambient: { tempC: 16, outdoor: false, wet: false },
  text: [
    { when: point12Available, text: 'Оле спит на кровати Хенрике, которую подвинули к окну. Рука лежит поверх одеяла, распухшая, в чистом бинте. Хенрике сидит рядом и каждые несколько минут трогает его лоб.' },
    { when: all(point12Available, report12('report')), text: 'На стуле у двери стоит сумка. Хенрике уже положила туда его свитер и бритву.' },
    { when: all(point12Available, report12('secret')), text: 'Шторы в комнате задёрнуты. Окно выходит на дорогу.' },
    { when: all(point12Available, report12('family')), text: 'Когда он проснётся, его спросят. Хенрике ждёт этого и боится.' },
    { when: all(point12Available, wound12('bite')), text: 'Свою руку, замотанную полотенцем, Хенрике держит на коленях.' },
    { when: not(point12Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c12_begin', label: 'Пойти на кухню: Хенрике зовёт обедать', when: point12Available, minutes: 3, terminal: true, goto: 'c12_lunch',
      effects: [prepareCamp, { npc: 'ole', moveTo: 'hof_luedemann' }] },
    { id: 'c12_begin_ole', label: 'Сначала постоять минуту у кровати Оле', when: point12Available, minutes: 4, terminal: true, goto: 'c12_lunch',
      text: 'Оле дышит ровно и глубоко. На подушке мокрое пятно от пота. Хенрике, не оборачиваясь, говорит: «Иди ешь. Я тут».',
      effects: [prepareCamp, { npc: 'ole', moveTo: 'hof_luedemann' }, { body: 'stress', delta: -1 }] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P12, a.when ?? { always: true }) })),
};


// Вход в базе КТ12: без onEnter и места. Ночь — первым личным ходом (сон или дежурство).
export const newEntry13: Scene = {
  id: 'c13_start', for: 'any', chapter: 'ch3', title: 'Ночь', universal: false, safe: true, camp: house12,
  ambient: { tempC: 14, outdoor: false, wet: false },
  text: [
    { when: all(point13Available, guests13('together')), text: 'Сеновал затихает к девяти. Двор тёмный, только на насыпи далеко-далеко ничего не горит.' },
    { when: all(point13Available, guests13('split')), text: 'Засов на кладовке задвинут. Лео спит в доме, на матрасе рядом с Ниной, в её толстовке.' },
    { when: all(point13Available, guests13('watch')), text: 'Первым у лестницы на сеновал сидит {A}. В час его сменит {B}, под утро — Дениз.' },
    { when: not(point13Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c13_night_sleep', label: 'Лечь спать', when: all(point13Available, not(guests13('watch'))), minutes: 1, terminal: true, goto: 'c13_dawn',
      text: 'Ты засыпаешь сразу, как будто падаешь в колодец.', effects: [prepareCamp, { restUntil: at(15, 5, 20), sleeping: true }] },
    { id: 'c13_night_watch_a', label: 'Отсидеть смену до часу и лечь', when: all(point13Available, guests13('watch'), A12), minutes: 1, terminal: true, goto: 'c13_dawn',
      text: 'Ты сидишь у лестницы с фонарём на коленях. Наверху Маркус не спит: слышно, как он шепчет мальчику что-то на одной ноте, как колыбельную. В час тебя сменяет {B}.',
      effects: [prepareCamp, { restUntil: at(15, 1) }, { restUntil: at(15, 5, 20), sleeping: true }] },
    { id: 'c13_night_watch_b', label: 'Поспать до своей смены и сменить {A.acc}', when: all(point13Available, guests13('watch'), B12), minutes: 1, terminal: true, goto: 'c13_dawn',
      text: 'В час {A} трогает тебя за плечо. Ты садишься на ящик у лестницы. Наверху тихо. Один раз Лео вскрикивает во сне, и сразу же — шёпот Маркуса. В половине четвёртого тебя сменяет Дениз.',
      effects: [prepareCamp, { restUntil: at(15, 1), sleeping: true }, { restUntil: at(15, 3, 30) }, { restUntil: at(15, 5, 20), sleeping: true }] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P13, a.when ?? { always: true }) })),
};


// Вход в базе КТ13: без onEnter и места. Паёк точки записывается первым ходом.
export const newEntry14: Scene = {
  id: 'c14_start', for: 'any', chapter: 'ch3', title: 'Полдень', universal: false, safe: true, camp: yard14,
  ambient: { tempC: 6, outdoor: true, wet: false },
  text: [
    { when: point14Available, text: 'Полдень. Машины уехали, и во дворе стало очень тихо.' },
    { when: not(point14Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c14_begin', label: 'Выйти во двор', when: point14Available, minutes: 2, terminal: true, goto: 'c14_noon', effects: [prepareCamp] },
    { id: 'c14_begin_house', label: 'Сначала пройтись по пустому дому', when: point14Available, minutes: 6, terminal: true, goto: 'c14_noon',
      text: 'Кровать Хенрике застелена. На тумбочке очки Оле. В прихожей на гвозде его шапка. Ты не трогаешь ничего.',
      effects: [prepareCamp, { body: 'stress', delta: 1 }] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P14, a.when ?? { always: true }) })),
};

// Вход в базе КТ14: без onEnter и места. Ночь начинается первым личным ходом.
export const newEntry15: Scene = {
  id: 'c15_start', for: 'any', chapter: 'ch3', title: 'Ночь', universal: false, safe: true, camp: house14,
  ambient: { tempC: 15, outdoor: false, wet: false },
  text: [
    { when: all(point15Available, jens15('give')), text: 'До одиннадцати два с половиной часа. Нина сидит на кухне в куртке. Ключ от фургона лежит на столе.' },
    { when: all(point15Available, jens15('end')), text: 'Нина сидит на кухне и смотрит на часы. Ружьё Оле стоит за шкафом в прихожей.' },
    { when: all(point15Available, jens15('gate')), text: 'Засов на задней калитке задвинут. Нина ушла к себе. Под дверью её комнаты горит свет.' },
    { when: all(point15Available, nina15('house')), text: 'Нина будет в доме. Окно её комнаты выходит на навес.' },
    { when: not(point15Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c15_n_wait', label: 'Сидеть на кухне и ждать одиннадцати', when: all(point15Available, jens15('give')), minutes: 1, terminal: true, outcomes: [{ id: 'a', when: A14, goto: 'c15_a_e1' }, { id: 'b', goto: 'c15_b_e1' }],
      text: 'Часы Хенрике тикают. Нина каждые десять минут смотрит в окно.', effects: [prepareCamp] },
    { id: 'c15_n_nap', label: 'Поспать до одиннадцати', when: all(point15Available, jens15('give')), minutes: 1, terminal: true, outcomes: [{ id: 'a', when: A14, goto: 'c15_a_e1' }, { id: 'b', goto: 'c15_b_e1' }],
      text: 'Ты засыпаешь сидя. В десять Нина трогает тебя за плечо.', effects: [prepareCamp, { restUntil: at(15, 22), sleeping: true }] },
    { id: 'c15_n_end', label: 'Ждать, пока стемнеет', when: all(point15Available, jens15('end')), minutes: 1, terminal: true,
      outcomes: [{ id: 'a', when: A14, goto: 'c15_a_e1' }, { id: 'b', goto: 'c15_b_e1' }],
      text: 'Вы ждёте, пока совсем стемнеет. Нина сидит на ступеньке лестницы, обхватив колени.', effects: [prepareCamp] },
    { id: 'c15_n_gate', label: 'Остаться на кухне', when: all(point15Available, jens15('gate')), minutes: 1, terminal: true,
      outcomes: [{ id: 'a', when: A14, goto: 'c15_a_e1' }, { id: 'b', goto: 'c15_b_e1' }],
      text: 'Ты не ложишься. Сидишь на кухне и слушаешь дом.', effects: [prepareCamp] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P15, a.when ?? { always: true }) })),
};

// Вход в базе КТ15: без onEnter и места. Паёк точки записывается первым ходом.
export const newEntry16: Scene = {
  id: 'c16_start', for: 'any', chapter: 'ch3', title: 'После полудня', universal: false, safe: true, camp: yard14,
  ambient: { tempC: 6, outdoor: true, wet: false },
  text: [
    { when: all(point16Available, ninaHere), text: 'Нина вешает куртку на крючок у двери, рядом с вашими, и уходит наверх. Слышно, как она двигает раскладушку ближе к окну.' },
    { when: all(point16Available, ninaAway), text: 'Обратно из Винзена вы едете молча. Во дворе Corsa остывает и тихо пощёлкивает. На кухонном столе стоит Нинина кружка.' },
    { when: all(point16Available, garden16('help')), text: 'У задней калитки стоят пустые вёдра. В среду понадобятся.' },
    { when: all(point16Available, garden16('tell')), text: 'Патрульная машина уехала. На дороге в грязи ещё видны следы её колёс.' },
    { when: all(point16Available, garden16('away')), text: 'Колея тачки через поле почти растаяла.' },
    { when: not(point16Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c16_begin', label: 'Пойти на кухню', when: point16Available, minutes: 2, terminal: true, goto: 'c16_plan', effects: [prepareCamp] },
    { id: 'c16_begin_yard', label: 'Сначала обойти двор', when: point16Available, minutes: 8, terminal: true, goto: 'c16_plan',
      text: 'Навес, пустая кабина, курятник, сарай. Под навесом на сиденье всё ещё лежит пустая бутылка-воронка. Ты её не трогаешь.',
      effects: [prepareCamp] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P16, a.when ?? { always: true }) })),
};

// Вход в базе КТ16: без onEnter и места. Ночь начинается первым личным ходом.
export const newEntry17: Scene = {
  id: 'c17_start', for: 'any', chapter: 'ch3', title: 'Ночь', universal: false, safe: true, camp: house14,
  ambient: { tempC: 15, outdoor: false, wet: false },
  text: [
    { when: all(point17Available, sweep17('warn')), text: 'В десять вы выходите к насыпи. Фонарь заклеен красной изолентой. Мороз сразу щиплет щёки.' },
    { when: all(point17Available, { any: [sweep17('brandt'), sweep17('stay')] }), text: 'Дом затихает к десяти. Генератор в сарае замолкает, и становится слышно, как тикают часы Хенрике.' },
    { when: all(point17Available, albers17('take')), text: 'Сарай подметён. В балке под крышей старое кольцо. Утром в половине седьмого приедет Тобиас.' },
    { when: not(point17Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c17_go', label: 'Одеться потеплее и идти к насыпи', when: all(point17Available, sweep17('warn')), minutes: 5, terminal: true, goto: 'c17_w_rails',
      text: 'Ты надеваешь всё, что есть. Две пары носков, свитер под куртку.', effects: [prepareCamp, { restUntil: at(16, 22) }] },
    { id: 'c17_sleep', label: 'Лечь спать', when: all(point17Available, { any: [sweep17('brandt'), sweep17('stay')] }), minutes: 1, terminal: true,
      outcomes: [{ id: 'a', when: A16, goto: 'c17_n_a_wake' }, { id: 'b', goto: 'c17_n_b_wake' }],
      text: 'Ты засыпаешь не сразу. Слушаешь двор. Потом проваливаешься.', effects: [prepareCamp, { restUntil: at(17, 2, 10), sleeping: true }] },
    { id: 'c17_watch', label: 'Посидеть до полуночи у окна', when: all(point17Available, { any: [sweep17('brandt'), sweep17('stay')] }), minutes: 1, terminal: true,
      outcomes: [{ id: 'a', when: A16, goto: 'c17_n_a_wake' }, { id: 'b', goto: 'c17_n_b_wake' }],
      text: 'Ты сидишь у окна с кружкой. Двор, поле, насыпь. До полуночи ничего. Потом ты засыпаешь.', effects: [prepareCamp, { restUntil: at(17, 0) }, { restUntil: at(17, 2, 10), sleeping: true }] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(P17, a.when ?? { always: true }) })),
};

const pack18 = (id: string, label: string, text: string, value: string, extra: Effect[] = []): ActionDef => ({
  id, label, when: all(point18Available, B18), minutes: 10, terminal: true, goto: 'c18_b_truck', text,
  effects: [prepareCamp, { set: '$.c18_pack', value }, ...extra, { restUntil: at(17, 15) }],
});

// Вход в базе КТ17: без onEnter и места. Машина из Люнебурга — первым ходом на обеих линиях.
export const newEntry18: Scene = {
  id: 'c18_start', for: 'any', chapter: 'ch3', title: 'Одно место', universal: false, safe: true, camp: house14, ambient: { tempC: 15, outdoor: false, wet: false },
  text: [
    { when: point18Available, text: 'В половине третьего во двор въезжает армейский грузовик с брезентом. Водитель не глушит мотор. Он протягивает через окно сложенный листок и говорит: «Lüdemann-Hof? Für euch».' },
    { when: point18Available, text: 'Почерк Хенрике, карандашом.\n\n«Оле хуже. Я не спала четыре ночи. Мне нужен один человек на сутки, сидеть с ним. В наш корпус пускают только женщин. Пусть приедет {B}. Машина идёт обратно завтра к вечеру. Х.»' },
    { when: point18Available, text: '— Ein Platz, — говорит водитель. — Zehn Minuten.\n\nОдно место. Десять минут.' },
    { when: all(point18Available, A18), text: '{B} уже ищет глазами свой рюкзак. Вы оба понимаете, что завтра утром ты будешь здесь один.' },
    { when: all(point18Available, B18), text: '{A} смотрит на тебя, потом в сторону насыпи. Завтрашнее утро достанется ему одному.' },
    { when: not(point18Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c18_sa_food', label: 'Собрать ей еду в дорогу', when: all(point18Available, A18), minutes: 10, terminal: true, goto: 'c18_a_alone',
      text: 'Ты заворачиваешь в полотенце хлеб, четыре варёные картофелины и соль в спичечном коробке. {B} убирает свёрток под куртку. Вы стоите у борта, пока водитель не стучит ладонью по дверце.',
      effects: [prepareCamp, { set: '$.c18_sa', value: 'food' }, { restUntil: at(17, 15) }] },
    { id: 'c18_sa_plan', label: 'Договориться, что делать, если связи не будет', when: all(point18Available, A18), minutes: 10, terminal: true, goto: 'c18_a_alone',
      text: 'Вы договариваетесь быстро. Если она не вернётся к вечеру среды, ты ждёшь до полудня четверга и едешь в Люнебург сам. Если тебя не будет дома, она идёт к Кёлер. Больше вы ничего не успеваете.',
      effects: [prepareCamp, { set: '$.c18_sa', value: 'plan' }, { body: 'stress', delta: -1 }, { restUntil: at(17, 15) }] },
    { id: 'c18_sa_hold', label: 'Просто постоять с ней у борта', when: all(point18Available, A18), minutes: 10, terminal: true, goto: 'c18_a_alone',
      text: 'Вы стоите у заднего борта. Мотор трясёт брезент. Она застёгивает тебе верхнюю пуговицу куртки, как будто это ты уезжаешь.',
      effects: [prepareCamp, { set: '$.c18_sa', value: 'hold' }, { restUntil: at(17, 15) }] },
    pack18('c18_sb_med', 'Взять бинты и всё, что есть от жара', 'Ты складываешь в рюкзак бинты и таблетки. {A} подсаживает тебя в кузов. Брезент падает, и двор пропадает.', 'med'),
    pack18('c18_sb_warm', 'Взять второй свитер и плед', 'Ты берёшь свитер и плед с кресла Хенрике. {A} подсаживает тебя в кузов. Брезент падает, и двор пропадает.', 'warm'),
    pack18('c18_sb_food', 'Взять хлеб и варёную картошку на двоих', 'Ты заворачиваешь хлеб и картошку в полотенце. {A} подсаживает тебя в кузов. Брезент падает, и двор пропадает.', 'food'),
  ] as ActionDef[]).map(a => ({ ...a, when: all(P18, a.when ?? { always: true }) })),
};

const onlyA19 = (a: ActionDef): ActionDef => ({ ...a, when: all(A19, a.when ?? { always: true }) });
const onlyB19 = (a: ActionDef): ActionDef => ({ ...a, when: all(B19, a.when ?? { always: true }) });

// ───────────── Вход: вечер среды после КТ18 ─────────────
// Вход в базе КТ18: без onEnter и места.
export const newEntry19: Scene = {
  id: 'c19_start', for: 'any', chapter: 'ch3', title: 'Вечер среды', universal: false, safe: true, camp: house14, ambient: indoor16,
  text: [
    { when: point19Available, text: 'Разговор на кухне кончается сам: чайник остыл, и говорить больше не о чем. На часах половина восьмого.' },
    { when: all(point19Available, henrikeHome), text: 'Хенрике моет чашки, хотя никто не просил. Иногда она замирает с полотенцем в руках и смотрит на дверь.' },
    { when: all(point19Available, uteHere), text: 'Уте сидит в углу на табурете со своим вязанием. Яннес спит рядом с ней сидя, привалившись к тёплой печке.' },
    { when: all(point19Available, flag('w.c18_jannes_home'), not(uteHere)), text: 'Яннес сидит у печки в куртке и каждые десять минут смотрит в окно, на дорогу к насыпи.' },
    { when: all(point19Available, evaHere), text: 'Эва стоит в прихожей с рюкзаком на плечах. Снять его она не решается.' },
    { when: all(point19Available, janaHere), text: 'Яна стоит в прихожей с рюкзаком на плечах. Снять его она не решается.' },
    { when: all(point19Available, volkerHere), text: 'Над сеновалом горит фонарь Фолькера. Оттуда пахнет табаком.' },
    { when: all(point19Available, ninaFarm18), text: 'Нина сидит на лестнице, на третьей ступеньке.' },
    { when: all(point19Available, v18('w.c18_house', 'closed')), text: 'На воротах висит второй замок. Ключ лежит на полке у двери.' },
    { when: all(point19Available, v18('w.c18_house', 'known')), text: 'На гвозде у двери висит календарь. На обороте вы написали список.' },
    { when: not(point19Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    onlyA19({ id: 'c19_s_bed', label: 'Устроить новых людей на ночь', when: any18(girlHere, uteHere, flag('w.c18_jannes_home')), minutes: 30, activity: 'light', terminal: true, goto: 'c19_wed_night',
      text: 'Ты стаскиваешь с чердака два матраса. Один кладёшь в комнату за кухней, где тепло от печки. Второй — на втором этаже, у Нининой двери. Простыней не хватает, и ты стелешь скатерть.', effects: [prepareCamp, set19('s', 'bed'), until(18, 21, 0)] }),
    onlyA19({ id: 'c19_s_henrike', label: 'Посидеть с Хенрике, пока она моет посуду', when: henrikeHome, minutes: 30, terminal: true, goto: 'c19_wed_night',
      text: 'Ты берёшь второе полотенце. Хенрике протягивает тебе мокрую чашку и долго молчит.\n\n— Der Hof steht, — говорит она наконец. — Das habt ihr gut gemacht.\n\nХутор стоит. Вы хорошо справились. Для Хенрике это много.', effects: [prepareCamp, set19('s', 'henrike'), npc19('henrike', 2), until(18, 21, 0)] }),
    onlyA19({ id: 'c19_s_round', label: 'Обойти двор: ворота, сараи, курятник', minutes: 25, activity: 'light', terminal: true, goto: 'c19_wed_night', ambientDuring: cold19,
      text: 'Ворота закрыты. Куры сидят на насесте. У длинного сарая ты долго слушаешь тишину и идёшь в дом, только когда замерзают уши.', effects: [prepareCamp, set19('s', 'round'), until(18, 21, 0)] }),
    onlyA19({ id: 'c19_s_sleep', label: 'Лечь сразу: ночь у тебя была длинная', minutes: 5, terminal: true, goto: 'c19_wed_night',
      text: 'Ты поднимаешься наверх, не дожидаясь остальных.', effects: [prepareCamp, set19('s', 'sleep'), until(18, 20, 0)] }),
    onlyB19({ id: 'c19_s_wash', label: 'Вымыться горячей водой', minutes: 35, terminal: true, goto: 'c19_wed_night',
      text: 'Таз стоит у печи. Ты моешься по частям, как в детстве на даче, и вода сразу становится серой. Запах казармы уходит не весь.', effects: [prepareCamp, set19('s', 'wash'), { body: 'stress', delta: -2 }, until(18, 21, 0)] }),
    ...byGirl(onlyB19({ id: 'c19_s_girl', label: 'Показать {g}е, где что', when: girlHere, minutes: 25, terminal: true, goto: 'c19_wed_night',
      text: 'Ты показываешь, где туалет, где колодец и какая ступенька скрипит. Рюкзак она снимает только в комнате за кухней.\n\n— Ich bin nützlich, — говорит она. — Ihr werdet sehen.\n\nЯ буду полезной. Вот увидите.', effects: [prepareCamp, set19('s', 'girl'), { if: evaHere, then: [npc19('c8_eva', 2)] }, until(18, 21, 0)] })),
    onlyB19({ id: 'c19_s_nina', label: 'Сесть рядом с Ниной на лестнице', when: ninaFarm18, minutes: 25, terminal: true, goto: 'c19_wed_night',
      text: 'Ты садишься на ступеньку ниже. Нина долго молчит, потом кладёт голову тебе на плечо. Через десять минут она уже спит.', effects: [prepareCamp, set19('s', 'nina'), npc19('c7_nina', 2), until(18, 21, 0)] }),
    onlyB19({ id: 'c19_s_sleep', label: 'Лечь сразу: после казармы гудит голова', minutes: 5, terminal: true, goto: 'c19_wed_night',
      text: 'Подушка пахнет вашим домом. Раскладушек больше нет.', effects: [prepareCamp, set19('s', 'sleep'), until(18, 20, 0)] }),
  ] as ActionDef[]).map(a => ({ ...a, when: all(point19Available, a.when ?? { always: true }) })),
};


// ───────────── Вход в участок 20 ─────────────
// Вход в базе КТ19: без onEnter и места (игроки могут быть в Люнебурге или дома).
export const newEntry20: Scene = {
  id: 'c20_start', for: 'any', chapter: 'ch3', title: 'Пятница', universal: false, safe: true,
  text: [
    { when: all(point20Available, inLue), text: 'Казарма на краю Люнебурга ещё в темноте. У шлагбаума горит прожектор. Corsa остывает на обочине и тикает.' },
    { when: all(point20Available, atFarm), text: 'Пятница начинается без поездки. Во дворе темно, у курятника иней.' },
    { when: not(point20Available), text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
  ],
  actions: ([
    { id: 'c20_go_gate', label: 'Выйти из машины сразу', when: inLue, minutes: 2, terminal: true, goto: 'c20_g_gate', effects: [prepareCamp] },
    { id: 'c20_go_sit', label: 'Посидеть минуту в тёплой машине', when: inLue, minutes: 10, terminal: true, goto: 'c20_g_gate',
      text: 'Мотор тикает, остывая. Стёкла запотевают изнутри. Ты сидишь, пока не перестают дрожать руки, и только потом открываешь дверь.', effects: [prepareCamp, { body: 'stress', delta: -1 }] },
    { id: 'c20_go_yard', label: 'Выйти во двор', when: atFarm, minutes: 2, terminal: true, goto: 'c20_f_dawn', effects: [prepareCamp] },
    { id: 'c20_go_stove', label: 'Сесть у плиты с кружкой', when: atFarm, minutes: 10, terminal: true, goto: 'c20_f_dawn',
      text: 'Плита ещё тёплая со вчера. Ты подбрасываешь полено и греешь руки о кружку, пока чайник не закипит снова.', effects: [prepareCamp] },
  ] as ActionDef[]).map(a => ({ ...a, when: all(point20Available, a.when ?? { always: true }) })),
};

