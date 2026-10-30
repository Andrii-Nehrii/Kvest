// КТ 3 «Утро» (11.11): встретились ли утром, и совместное решение — куда вы сегодня.
// Выполнимость — объективная, по законам второго дня: на юг из города — только через Elbbrücken (машина,
// велосипед), с юга в город не пускают, кроме автобусов до Messe от вокзала Harburg; на север — только на машине.
// Условия проверяются от лица мира (ctx A): «at» — где A, «partnerAt» — где B.
import type { CheckpointDef, JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { CITY, EAST, HARBURG, ISLAND, SOUTH, atAny, carIn, partnerAtAny } from './world2';

const together: Cond = { flag: 'w.together' };
const A_HOME = ['a_flat', 'a_stairs', 'a_yard'];
const B_HOME = ['b_flat', 'b_stairs', 'b_okafor', 'b_street'];

// ───────────── Кто куда может добраться сегодня ─────────────

const aCanAct: Cond = { cap: 'canAct', op: '==', value: 1 };
const bCanAct: Cond = { partner: 'active' };
/** Машина A на ходу: ключи у A, он может вести, бензина хватает. */
const car = (zone: string[], liters: number): Cond => ({ all: [aCanAct, { has: 'car_keys' }, carIn(zone), { fuelIn: 'opel_corsa', liters }] });
/** Велосипед B при ней (не остался в Barmbek, когда она уехала в Ahrensburg). */
const bBike: Cond = { all: [{ flag: 'B.bike_ready' }, { not: { flag: 'B.bike_lost' } }, { not: partnerAtAny(EAST) }] };
/** Вместе и машина рядом — B едет с A. */
const ride = (zone: string[], liters: number): Cond => ({ all: [together, car(zone, liters)] });

/** На юг (Buchholz, хутор, мастерская): из города — через Elbbrücken (≈45 км, пробка у поста). */
const A_SOUTH: Cond = { any: [atAny([...SOUTH, ...HARBURG, ...ISLAND]), { all: [atAny(CITY), car(CITY, 8)] }] };
const B_SOUTH: Cond = { all: [bCanAct, { any: [partnerAtAny([...SOUTH, ...HARBURG, ...ISLAND]), { all: [partnerAtAny(CITY), { any: [bBike, ride(CITY, 8)] }] }] }] };
/** В Barmbek: с юга в город не пускают. */
const A_CITY: Cond = atAny(CITY);
const B_CITY: Cond = { all: [bCanAct, partnerAtAny([...CITY, ...EAST])] };
/** В Messe: из города — пешком, с юга — автобусом от вокзала Harburg (до него — на машине или пешком из Harburg). */
const A_MESSE: Cond = { any: [atAny([...CITY, ...HARBURG, ...ISLAND]), { all: [atAny(SOUTH), car(SOUTH, 2)] }] };
const B_MESSE: Cond = { all: [bCanAct, { any: [partnerAtAny([...CITY, ...HARBURG, ...ISLAND]), { all: [partnerAtAny(SOUTH), { any: [bBike, ride(SOUTH, 2)] }] }] }] };
/** На север — только на машине из города; B — только вместе с A. */
const A_NORTH: Cond = { all: [atAny(CITY), car(CITY, 6)] };
const B_NORTH: Cond = { all: [bCanAct, together] };

/** Оба могут добраться (кто не может действовать — не участвует и не мешает). */
const both = (a: Cond, b: Cond): Cond => ({ all: [{ any: [a, { not: aCanAct }] }, { any: [b, { not: bCanAct }] }] });

const FARM_DOOR: Cond = { any: [{ flag: 'w.henrike_yes' }, { flag: 'w.henrike_maybe' }, { flag: 'w.deniz_vouch' }] };
const DENIZ_THERE: Cond = { all: [{ flag: 'w.deniz_shelter' }, { any: [{ npc: 'deniz', at: 'deniz_workshop' }, { npc: 'deniz', at: 'harburg_search' }] }] };

/** Коридор на юг — с 9 до 14: кто решает до половины двенадцатого, успевает отстоять очередь. Хенрике пустит, если обещала или есть кому поручиться. */
const corridor: Effect = { if: { before: at(11, 11, 30) }, then: [{ set: 'w.corridor_ok', value: true }] };
const farmWelcome: Effect = { if: { any: [{ flag: 'w.henrike_yes' }, { flag: 'w.deniz_vouch' }, { flag: 'w.deniz_at_farm' }, { all: [{ flag: 'w.henrike_maybe' }, { npc: 'henrike', trust: ['>=', 12] }] }] },
  then: [{ set: 'w.farm_welcome', value: true }] };

const SHELTER_IDS = ['farm', 'workshop', 'a_flat', 'b_flat', 'messe', 'north'];

/**
 * «Куда вы сегодня/завтра» — одно и то же решение на КТ 3 и КТ 4: те же места, те же законы дорог.
 * planVar — вчерашнее решение: кто предлагает его, у того сильнее довод.
 */
function dayDecision(id: string, checkpoint: number, varName: string, prompt: string, planVar: string, extra: Effect[] = []): JointDecision {
  const day = (opt: string): Effect[] => [{ set: varName, value: opt }, ...extra];
  return {
    id, checkpoint, prompt: { default: prompt },
    options: [
      { id: 'farm', label: { default: 'На хутор к Людеманам' }, when: { knows: 'f_farm' }, feasible: { all: [FARM_DOOR, both(A_SOUTH, B_SOUTH)] },
        effects: [...day('farm'), farmWelcome], text: 'Решено: на хутор под Jesteburg. Хенрике обещала посмотреть.' },
      { id: 'workshop', label: { default: 'В мастерскую Дениза' }, when: { knows: 'f_deniz_shelter' }, feasible: { all: [DENIZ_THERE, both(A_SOUTH, B_SOUTH)] },
        effects: day('workshop'), text: 'Решено: в мастерскую Дениза в Buchholz.' },
      { id: 'a_flat', label: { A: 'Ко мне, в Buchholz', B: 'К {partner.dat}, в Buchholz', default: 'В квартиру {A.gen} в Buchholz' }, feasible: both(A_SOUTH, B_SOUTH),
        effects: day('a_flat'), text: 'Решено: в Buchholz, в квартиру {A.gen}.' },
      { id: 'b_flat', label: { A: 'К {partner.dat}, в Barmbek', B: 'Ко мне, в Barmbek', default: 'В квартиру {B.gen} в Barmbek' }, feasible: both(A_CITY, B_CITY),
        effects: day('b_flat'), text: 'Решено: в Barmbek, в квартиру {B.gen}.' },
      { id: 'messe', label: { default: 'В пункт приёма в Messe' }, when: { any: [{ knows: 'f_messe' }, { knows: 'f_messe_open' }, { knows: 'f_kfall' }] }, feasible: both(A_MESSE, B_MESSE),
        effects: day('messe'), text: 'Решено: в Messe, в пункт приёма — еда, врачи, армия.' },
      { id: 'north', label: { default: 'Из города на север, подальше от людей' }, feasible: { all: [A_NORTH, B_NORTH] },
        effects: day('north'), text: 'Решено: из города на север, на машине, насколько хватит бензина и терпения на постах.' },
      { id: 'stay', label: { default: 'Никуда: остаёмся там, где мы есть' },
        effects: day('stay'), text: 'Решено: никуда. Каждый остаётся там, где он есть.' },
    ],
    arbiters: [
      ...SHELTER_IDS.map((sid) => ({
        id: `plan_${sid}`, when: { v: planVar, op: '==', value: sid } as Cond, winner: sid,
        text: 'Об этом вы уже договаривались. Ни один довод с тех пор этого не отменил.',
      })),
      { id: 'apart', when: { not: together }, winner: 'stay', text: 'Вы порознь, связь не держится. Пока каждый не знает точно, где второй, никто никуда не двинется.' },
      { id: 'tired', when: { always: true }, winner: 'stay', text: 'Вы оба вымотаны. Когда не можете договориться — остаётесь, где есть, и ждёте утра.' },
    ],
    fallbackWeights: [...SHELTER_IDS, 'stay'].map((option) => ({ option, base: 1 })),
    default: 'stay',
    rememberedBy: ['merle', 'okafor', 'deniz', 'henrike', 'ilse'],
  };
}

const day2 = dayDecision('day2', 3, 'w.day2',
  'Утро второго дня. Katastrophenfall, на мостах армия, в Messe открыт пункт приёма. Вчера вечером вы что-то решили — но это было вчера. Куда вы сегодня?',
  'w.shelter', [corridor]);

// ───────────── Встреча утром ─────────────

/** Те же факты, что на КТ 2, и новые за ночь: при встрече каждый узнаёт, что знал другой. */
const SHARED = ['f_farm', 'f_henrike_yes', 'f_henrike_maybe', 'f_henrike_no', 'f_deniz_shelter', 'f_messe', 'f_kfall', 'f_curfew', 'f_messe_open', 'f_corridor',
  'f_messe_bus', 'f_fuel_ban', 'f_tunnels_closed', 'f_okafor_clinic', 'f_okafor_fever', 'f_svenja_fever', 'f_ilse_fever', 'f_gerd_stairs', 'f_vorderhaus_man', 'f_okafor_colleague'];
const share: Effect[] = SHARED.map((f) => ({ if: { partnerKnows: f }, then: [{ learn: f, source: 'partner' }] }));
const meet: Effect[] = [{ set: 'w.together', value: true }, ...share];

/** Вы в одном месте (или рядом — квартира, лестница, двор одного дома). */
const SAME: Cond = {
  any: [
    { all: [atAny([...A_HOME, 'a_street']), partnerAtAny([...A_HOME, 'a_street'])] },
    { all: [atAny(B_HOME), partnerAtAny(B_HOME)] },
    ...['hof_luedemann', 'deniz_workshop', 'ahrensburg', 'harburg_station', 'harburg', 'a7_jam', 'hh_city', 'hh_eppendorf', 'hh_ring3', 'elbtunnel', 'a1_station', 'b75_road', 'wilhelmsburg_stairs']
      .map((p) => ({ all: [{ at: p }, { partnerAt: p }] })),
  ],
};
const atDoor: Cond = { flag: '$.at_partner_door' };
const partnerAtDoor: Cond = { any: [{ all: [{ me: 'A' }, { flag: 'B.at_partner_door' }] }, { all: [{ me: 'B' }, { flag: 'A.at_partner_door' }] }] };

/** На посту и у ворот смотрят руки, шею, лоб: свежий укус, царапина или жар. Отметка одинакова на обоих телефонах. */
export const checkRiskNote: MergeNote = {
  id: 'check_risk', group: 'check',
  when: { any: [{ injured: 'bite' }, { injured: 'scratch', minSeverity: 2 }, { body: 'coreTemp', op: '>=', value: 37.8 }] },
  effects: [{ set: '$.check_risk', value: true }],
};
const checkClear: MergeNote = { id: 'check_clear', group: 'check', effects: [{ set: '$.check_risk', value: false }] };

const kt3Notes: MergeNote[] = [
  checkRiskNote, checkClear,
  { id: 'still', group: 'meet', when: { all: [together, SAME, { not: atDoor }, { not: partnerAtDoor }] } },
  { id: 'door_a_home', group: 'meet', when: { all: [{ me: 'B' }, atDoor, { at: 'a_street' }, partnerAtAny(A_HOME)] }, effects: meet,
    text: 'Шаги на лестнице — тяжёлые, быстрые. Дверь подъезда распахивается, и {partner} стоит на пороге — небритый, в куртке нараспашку, с фонариком в руке. Он смотрит на тебя так, будто не верит глазам. Потом ты уже ничего не видишь — только его куртку и его руки.' },
  { id: 'door_a_A', group: 'meet', when: { all: [{ me: 'A' }, atAny(A_HOME), { partnerAt: 'a_street' }, { flag: 'B.at_partner_door' }] }, effects: meet,
    text: 'Стук внизу — кулаком, по стеклу подъезда. И голос. Её голос. Ты не помнишь, как оказываешься на лестнице. {partner} стоит у двери — серая от усталости, в чужой грязи до колен, живая. Она дошла.' },
  { id: 'door_b_home', group: 'meet', when: { all: [{ me: 'A' }, atDoor, { at: 'b_street' }, partnerAtAny(B_HOME)] }, effects: meet,
    text: 'Щелчок домофона. Шаги на лестнице — через ступеньку. Дверь подъезда распахивается, и {partner} врезается в тебя так, что ты отступаешь на шаг. Утро, холод, люди с чемоданами идут мимо и не смотрят. Вам всё равно.' },
  { id: 'door_b_B', group: 'meet', when: { all: [{ me: 'B' }, atAny(B_HOME), { partnerAt: 'b_street' }, { flag: 'A.at_partner_door' }] }, effects: meet,
    text: 'Домофон. Ты не сразу понимаешь, что это — он. Потом летишь вниз по лестнице, через ступеньку. {partner} стоит у подъезда — мокрый, небритый, с красными от бессонной ночи глазами. Живой.' },
  { id: 'found', group: 'meet', when: { all: [{ not: together }, SAME] }, effects: meet,
    text: 'Ты видишь {partner.acc} раньше, чем {pm:он|она} тебя, — и сначала не веришь. Потом веришь.' },
  { id: 'nobody', group: 'meet', when: atDoor,
    text: 'Никто не открывает. Ты стучишь ещё, зовёшь, ждёшь. Тишина. {partner} здесь нет.', effects: [{ set: 'w.together', value: false }] },
  { id: 'apart', group: 'meet', when: together, effects: [{ set: 'w.together', value: false }] },
  { id: 'call', group: 'call', when: { all: [{ not: SAME }, { callable: true }] },
    text: 'Телефон вдруг ловит сеть — на минуту. Ты успеваешь набрать, и {partner} отвечает с первого гудка: голос сорванный, далёкий. Вы говорите только главное — где вы и что собираетесь делать, — и связь рвётся.',
    effects: [{ set: '$.talked_kt3', value: true }, ...share] },
  { id: 'none', group: 'call', when: { not: SAME }, text: 'Утром дозвониться не удаётся. Ты не знаешь, что {partner} {pm:решил|решила} за ночь.' },
];

// ───────────── КТ 4 «Вторая ночь» ─────────────

const SAME4: Cond = {
  any: [
    { all: [atAny([...A_HOME, 'a_street']), partnerAtAny([...A_HOME, 'a_street'])] },
    { all: [atAny(B_HOME), partnerAtAny(B_HOME)] },
    { all: [atAny(['hof_luedemann', 'farm_coop']), partnerAtAny(['hof_luedemann', 'farm_coop'])] },
    ...['deniz_workshop', 'ahrensburg', 'messe', 'messe_q', 'north_gym', 'harburg_station', 'harburg', 'a7_jam', 'hh_city', 'hh_eppendorf', 'hh_ring3', 'elbtunnel', 'a1_station', 'b75_road', 'wilhelmsburg_stairs']
      .map((p) => ({ all: [{ at: p }, { partnerAt: p }] })),
  ],
};
const atDoor4: Cond = { flag: '$.at_partner_door4' };
const partnerAtDoor4: Cond = { any: [{ all: [{ me: 'A' }, { flag: 'B.at_partner_door4' }] }, { all: [{ me: 'B' }, { flag: 'A.at_partner_door4' }] }] };
const split: Cond = { any: [{ all: [{ at: 'messe' }, { partnerAt: 'messe_q' }] }, { all: [{ at: 'messe_q' }, { partnerAt: 'messe' }] }] };

const kt4Notes: MergeNote[] = [
  checkRiskNote, checkClear,
  { id: 'still', group: 'meet', when: { all: [together, SAME4, { not: atDoor4 }, { not: partnerAtDoor4 }] } },
  { id: 'door_a', group: 'meet', when: { all: [{ me: 'B' }, atDoor4, { at: 'a_street' }, partnerAtAny(A_HOME)] }, effects: meet,
    text: 'Шаги на лестнице. Дверь подъезда распахивается — {partner}, с фонариком, в куртке поверх свитера. Он стоит и смотрит, будто ты можешь исчезнуть, если моргнуть. Потом ты уже ничего не видишь.' },
  { id: 'door_a_A', group: 'meet', when: { all: [{ me: 'A' }, atAny(A_HOME), { partnerAt: 'a_street' }, { flag: 'B.at_partner_door4' }] }, effects: meet,
    text: 'Вечером — стук в стекло подъезда, кулаком, и её голос. Ты слетаешь по лестнице. {partner} — серая от усталости, с рюкзаком, который больше неё. Дошла.' },
  { id: 'door_b', group: 'meet', when: { all: [{ me: 'A' }, atDoor4, { at: 'b_street' }, partnerAtAny(B_HOME)] }, effects: meet,
    text: 'Щелчок домофона. Шаги — через ступеньку. {partner} врезается в тебя в дверях подъезда, и вы стоите так, пока у соседей напротив не загорается и не гаснет окно.' },
  { id: 'door_b_B', group: 'meet', when: { all: [{ me: 'B' }, atAny(B_HOME), { partnerAt: 'b_street' }, { flag: 'A.at_partner_door4' }] }, effects: meet,
    text: 'Домофон — поздно, почти в комендантский час. Ты знаешь, кто это, раньше, чем снимаешь трубку. Вниз — через ступеньку. {partner} у подъезда, живой, небритый, с красными глазами.' },
  { id: 'split', group: 'meet', when: split, effects: [{ set: 'w.together', value: false }],
    text: 'Вы в одном здании, в двухстах метрах друг от друга, — но между вами строительный забор, солдаты и двое суток наблюдения.' },
  { id: 'found', group: 'meet', when: { all: [{ not: together }, SAME4] }, effects: meet,
    text: 'Ты видишь {partner.acc} раньше, чем {pm:он|она} тебя, — и сначала не веришь глазам. Потом веришь.' },
  { id: 'nobody', group: 'meet', when: atDoor4, effects: [{ set: 'w.together', value: false }],
    text: 'Никто не открывает. Ты стучишь, зовёшь, ждёшь до самого комендантского часа. {partner} здесь нет.' },
  { id: 'apart', group: 'meet', when: together, effects: [{ set: 'w.together', value: false }] },
  { id: 'call', group: 'call', when: { all: [{ not: SAME4 }, { callable: true }] },
    text: 'Ночью телефон ловит сеть — на минуту. {partner} отвечает сразу. Вы успеваете сказать, где вы, — и связь рвётся.',
    effects: [{ set: '$.talked_kt4', value: true }, ...share] },
  { id: 'none', group: 'call', when: { not: SAME4 }, text: 'Дозвониться не удаётся. Ты засыпаешь с телефоном в руке.' },
];

const day3 = dayDecision('day3', 4, 'w.day3',
  'Вторая ночь. Завтра — третий день. Остаётесь там, где вы сейчас, или двигаетесь дальше?', 'w.day2');

export const joint3: Record<string, JointDecision> = { day2, day3 };

export const checkpoint3 = (next: Record<'A' | 'B', { when?: Cond; scene: string }[]>): CheckpointDef => ({
  index: 3, title: 'Утро', syncNotBefore: at(11, 8, 30), joint: ['day2'], onMerge: kt3Notes, next,
});

export const checkpoint4: CheckpointDef = {
  index: 4, title: 'Вторая ночь', joint: ['day3'], onMerge: kt4Notes,
  next: { A: [{ scene: 'c5_start' }], B: [{ scene: 'c5_start' }] },
};

