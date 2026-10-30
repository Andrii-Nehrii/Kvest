// Глава 2 — мир второго дня (11.11): факты, события, планы NPC, новые люди, радио, зоны для дорог.
// Всё новое поведение включено только с КТ 2 ({ cp: 2 }): сыгранные участки главы 1 считаются по-старому.
import type { AgendaItem, FactDef, LocationDef, NpcDef, Outcome, WorldEvent } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';

export const C2: Cond = { cp: 2 };
/** Участок 4 (после КТ 3). */
export const C3: Cond = { cp: 3 };

// ───────────── Зоны: где кто находится (для ночёвки, утра и дорог) ─────────────

export const A_HOME_PLACES = ['a_flat', 'a_stairs', 'a_yard', 'a_street', 'a_brockmann'];
export const B_HOME_PLACES = ['b_flat', 'b_stairs', 'b_yard', 'b_street', 'b_okafor', 'b_nowak', 'b_kiosk'];
/** Юг: Buchholz и окрестности, хутор, мастерская, дорога на Harburg. */
export const SOUTH = [...A_HOME_PLACES, 'a_house7', 'a_hospital', 'a_market', 'a_gas', 'deniz_workshop', 'hof_luedemann', 'a_road', 'b75_road'];
/** Harburg — южный берег, за Süderelbe. */
export const HARBURG = ['harburg', 'harburg_station', 'harburg_kerem', 'a1_station', 'a7_jam'];
/** Остров между рукавами Эльбы. */
export const ISLAND = ['wilhelmsburg', 'wilhelmsburg_stairs', 'steinwerder'];
/** Гамбург к северу от Эльбы. */
export const CITY = [...B_HOME_PLACES, 'b_market', 'b_pharmacy', 'b_station', 'hh_alster', 'hh_neustadt', 'hh_landungsbruecken', 'old_elbtunnel',
  'elbtunnel', 'hh_city', 'hh_eppendorf', 'hh_ring3', 'messe'];
export const EAST = ['ahrensburg', 'b_van'];

export const atAny = (places: string[]): Cond => ({ any: places.map((p) => ({ at: p })) });
export const partnerAtAny = (places: string[]): Cond => ({ any: places.map((p) => ({ partnerAt: p })) });
/** Машина A стоит в одном из этих мест. */
export const carIn = (places: string[]): Cond => ({ any: places.map((p) => ({ itemAt: 'opel_corsa', place: p })) });
/** Машина стоит там же, где игрок. */
export const carHereAny: Cond = { any: [...SOUTH, ...HARBURG, ...ISLAND, ...CITY].map((p) => ({ all: [{ at: p }, { itemAt: 'opel_corsa', place: p }] })) };
/** Вместе: встретились на КТ и партнёр там же (в своей линии партнёр стоит там, где был на точке). */
export const withPartnerAt = (place: string): Cond => ({ all: [{ flag: 'w.together' }, { partnerAt: place }, { at: place }] });

const night: Cond = { before: at(11, 5, 30) };
const morning: Cond = { after: at(11, 5, 30) };
export const NIGHT = night;
/** Для действий: светлое время второго дня (с 05:30). Для текста — AM / PM / EVE. */
export const MORNING = morning;
export const AM: Cond = { all: [morning, { before: at(11, 12, 0) }] };
export const PM: Cond = { all: [{ after: at(11, 12, 0) }, { before: at(11, 17, 0) }] };
export const EVE: Cond = { after: at(11, 17, 0) };

// ───────────── Новые места ─────────────

export const locations2: Record<string, LocationDef> = Object.fromEntries(([
  { id: 'messe', name: 'Messe Hamburg, пункт приёма', region: 'hh', indoor: true, power: 'grid', water: true, media: ['people', 'tv'],
    description: 'Выставочные залы у Planten un Blomen: раскладушки рядами, полевая кухня, армейские палатки у входа.' },
  { id: 'messe_q', name: 'Messe, зал наблюдения', region: 'hh', indoor: true, power: 'grid', water: true, media: ['people'],
    description: 'Отдельный зал за строительными заборами: раскладушки через два метра, солдаты у входа, медсёстры с градусниками.' },
  { id: 'elbbruecken', name: 'Elbbrücken, пост', region: 'hh', indoor: false, media: ['people'], description: 'Мосты через Северную Эльбу, армейский пост на въезде.' },
  { id: 'north_gym', name: 'Спортзал, Kaltenkirchen', region: 'sh', indoor: true, power: 'grid', water: true, safe: true, media: ['people', 'radio'],
    description: 'Школьный спортзал на окраине городка: маты, раскладушки, полевая кухня DRK во дворе.' },
  { id: 'farm_coop', name: 'Старый курятник на хуторе', region: 'lk', indoor: true, description: 'Кирпичная пристройка без окон, нары, ведро, щель под дверью.' },
] as LocationDef[]).map((l) => [l.id, l]));

// ───────────── Факты ─────────────

const F = (id: string, topic: string, text: string, truth: FactDef['truth'] = 'true'): FactDef => ({ id, topic, text, truth });

export const facts2: Record<string, FactDef> = Object.fromEntries([
  F('f_kfall', 'новости', 'Сенат объявил Katastrophenfall: городом управляет кризисный штаб, на улицах — бундесвер.'),
  F('f_curfew', 'новости', 'Комендантский час: с 20:00 до 06:00 на улицы не выходить.'),
  F('f_messe_open', 'места', 'Пункт приёма в Messe открыт: еда, врачи, койки. На входе проверяют на укусы и температуру.'),
  F('f_corridor', 'транспорт', 'Из города на юг выпускают только через Elbbrücken, с 9 до 14, с проверкой на укусы и жар. В город с юга не пускают никого.'),
  F('f_messe_bus', 'транспорт', 'От вокзала Harburg до Messe ходят автобусы — только в одну сторону.'),
  F('f_fuel_ban', 'транспорт', 'Заправки отпускают топливо только службам: частным машинам не продают.'),
  F('f_tunnels_closed', 'транспорт', 'Оба тоннеля под Эльбой — и новый на A7, и старый у Landungsbrücken — закрыты.'),
  F('f_buchholz_water', 'место', 'В Buchholz пропала вода в кранах: без тока насосы не качают.'),
  F('f_vorderhaus_man', 'люди', 'Сосед Свеньи из переднего дома ночью бился в стеклянную дверь подъезда — босиком, в халате, будто не чувствовал ни холода, ни боли.'),
  F('f_svenja_fever', 'люди', 'У Свеньи с утра жар, озноб и болит голова. Её укусили вчера вечером.'),
  F('f_ilse_fever', 'люди', 'У Ильзе ночью поднялась температура: озноб, путаная речь. Её укусил Герд.'),
  F('f_okafor_clinic', 'болезнь', 'Окафор: ночью клинику в Barmbek бросили — персонал ушёл, а палаты с больными заперли изнутри.'),
  F('f_okafor_fever', 'болезнь', 'Окафор: у его укушенной коллеги сначала был просто жар, как при гриппе. Через полдня она уже никого не узнавала.'),
  F('f_merle_hypo', 'люди', 'Ночью у Мерле упал сахар: слабость, пот, спутанность. Помогло сладкое.'),
  F('f_gerd_stairs', 'люди', 'Герд ночью выбрался на лестницу: ходит по площадкам, шаркает, бьётся в двери.'),
  F('f_messe_q', 'места', 'В Messe людей с укусами, ранами и жаром отводят в отдельный зал «для наблюдения» — на двое суток.'),
  F('f_corridor_closed', 'транспорт', 'Коридор через Elbbrücken закрывается в два часа дня. Кто не успел — до завтра.'),
  F('f_north_gym', 'места', 'В Kaltenkirchen, в школьном спортзале, DRK принимает людей из Гамбурга: раскладушки, суп, тишина.'),
  F('f_svenja_attack', 'болезнь', 'Свенья в жару вдруг бросилась на людей — как Герд вчера. Не узнавала никого.'),
  F('f_ilse_turned', 'болезнь', 'Ильзе к ночи перестала быть собой: тот же пустой взгляд, что у Герда.'),
  F('f_coop_rule', 'места', 'У Хенрике правило: кто с укусом, раной или жаром — сутки в старом курятнике, пока не станет ясно.'),
  F('f_messe_cough', 'люди', 'В Messe через два ряда от вас мужчина с перевязанной кистью: кашляет, весь мокрый, прячет руку под одеяло.'),
  F('f_farm_lights', 'места', 'Ночью к хутору подъезжала машина без номеров — постояла на краю поля с фарами и уехала.'),
].map((f) => [f.id, f]));

// ───────────── Новые люди ─────────────

const npc = (d: Omit<NpcDef, 'initial'> & { location: string; vars?: NpcDef['initial']['vars'] }): NpcDef => ({
  id: d.id, name: d.name, intro: d.intro, hidden: d.hidden, agenda: d.agenda,
  initial: { alive: true, location: d.location, status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: d.vars ?? {} },
});

export const npcs2: Record<string, NpcDef> = Object.fromEntries([
  npc({ id: 'uwe', name: 'Уве Тиссен', location: 'ahrensburg', intro: 'Отец Мерле, 58 лет. Инженер на пенсии, всё чинит сам, говорит мало.',
    hidden: { goals: ['удержать семью дома'], fears: ['что Мерле останется без инсулина'] }, agenda: [] }),
  npc({ id: 'birgit', name: 'Биргит Тиссен', location: 'ahrensburg', intro: 'Мать Мерле, 55 лет. Кормит всех, кто переступил порог.',
    hidden: { goals: ['чтобы все были сыты и рядом'], fears: ['больные в доме'] }, agenda: [] }),
].map((n) => [n.id, n]));

/** Планы прежних NPC на второй день. Добавляются в конец их agenda (index.ts). */
export const agenda2: Record<string, AgendaItem[]> = {
  // Ильзе укушена около полудня 10.11: инкубация ≈16 ч, продром ≈9 ч, острая стадия ≈8 ч (WORLD_BIBLE §2.5).
  ilse: [
    { id: 'c2_fever', at: at(11, 3, 40), scope: 'world', when: { all: [C2, { npc: 'ilse', status: 'injured' }, { npcVar: 'ilse', key: 'bitten' }] },
      effects: [{ npc: 'ilse', status: 'sick', set: { fever: true } }] },
    { id: 'c2_acute', at: at(11, 13, 0), scope: 'world', when: { all: [C2, { npc: 'ilse', status: 'sick' }] },
      effects: [{ npc: 'ilse', status: 'infected', set: { aggressive: true } }] },
    { id: 'c2_turned', at: at(11, 21, 30), scope: 'world', when: { all: [C2, { npc: 'ilse', status: 'infected' }] },
      effects: [{ npc: 'ilse', status: 'turned' }] },
  ],
  // Обращённый Герд за незапертой дверью ночью выходит на лестницу.
  gerd: [
    { id: 'c2_stairs', at: at(11, 1, 30), scope: 'world',
      when: { all: [C2, { npc: 'gerd', at: 'a_brockmann' }, { npc: 'gerd', status: 'turned' }, { not: { npcVar: 'gerd', key: 'locked' } }, { not: { npcVar: 'gerd', key: 'tied' } }] },
      effects: [{ npc: 'gerd', moveTo: 'a_stairs' }] },
  ],
  // Свенья укушена 10.11 около 18:15. Если B её в тот вечер не видела, укус всё равно случился — в переднем доме.
  svenja: [
    { id: 'c2_bitten', at: at(11, 0, 0), scope: 'world', when: { all: [C2, { npc: 'svenja', status: 'ok' }, { npc: 'svenja', at: 'b_vorderhaus' }] },
      effects: [{ npc: 'svenja', status: 'injured', set: { bitten: true } }] },
    { id: 'c2_fever', at: at(11, 6, 40), scope: 'world', when: { all: [C2, { npc: 'svenja', status: 'injured' }] },
      effects: [{ npc: 'svenja', status: 'sick', set: { fever: true } }] },
    { id: 'c2_acute', at: at(11, 17, 0), scope: 'world', when: { all: [C2, { npc: 'svenja', status: 'sick' }] },
      effects: [{ npc: 'svenja', status: 'infected', set: { aggressive: true } }] },
    { id: 'c2_turned', at: at(12, 2, 0), scope: 'world', when: { all: [C2, { npc: 'svenja', status: 'infected' }] },
      effects: [{ npc: 'svenja', status: 'turned' }] },
  ],
  // Окафор ушёл вчера на смену: утром возвращается — клинику бросили.
  okafor: [
    { id: 'c2_back', at: at(11, 7, 40), scope: 'world', when: { all: [C2, { npc: 'okafor', at: 'clinic_barmbek' }] },
      effects: [{ npc: 'okafor', moveTo: 'b_okafor', set: { back_from_clinic: true } }] },
  ],
  // Дениз с братом искали друг друга в Harburg — утром возвращаются в мастерскую.
  deniz: [
    // Брат с ним — в полдень оба уезжают на хутор (кто поедет с ними — решает сцена).
    { id: 'c4_farm', at: at(11, 12, 0), scope: 'world', when: { all: [C3, { npc: 'deniz', at: 'deniz_workshop' }, { npc: 'kerem', at: 'deniz_workshop' }] },
      effects: [{ npc: 'deniz', moveTo: 'hof_luedemann' }, { npc: 'kerem', moveTo: 'hof_luedemann' }, { set: 'w.deniz_at_farm', value: true }] },
    { id: 'c2_back', at: at(11, 9, 30), scope: 'world', when: { all: [C2, { npc: 'deniz', at: 'harburg_search' }] },
      effects: [{ npc: 'deniz', moveTo: 'deniz_workshop' }] },
  ],
  kerem: [
    { id: 'c2_back', at: at(11, 9, 30), scope: 'world', when: { all: [C2, { npc: 'kerem', at: 'harburg_search' }] },
      effects: [{ npc: 'kerem', moveTo: 'deniz_workshop' }] },
  ],
  // Янник ночевал в машине A: с рассветом уходит пешком к своей девушке в Eimsbüttel.
  jannik: [
    { id: 'c2_leaves', at: at(11, 7, 0), scope: 'world', when: { all: [C2, { npc: 'jannik', at: 'a_car' }] },
      effects: [{ npc: 'jannik', moveTo: 'eimsbuettel' }] },
  ],
};

// ───────────── События мира второго дня ─────────────

const inBHome: Cond = atAny(['b_flat', 'b_stairs']);
const inCarScene: Cond = { scene: 'c2_car' };

export const events2: WorldEvent[] = [
  // Ночь
  { id: 'ev2_b_hammer', at: at(11, 2, 20), scope: 'world', when: { all: [C2, inBHome, { before: at(11, 4, 30) }] }, interrupt: true,
    effects: [{ set: '$.c2_hammer', value: true }],
    news: [{ channel: 'direct', text: 'Внизу кто-то бьёт в стеклянную дверь подъезда. Ровно, раз в несколько секунд — не кулаком, ладонями. Звонок не звонит, никто не кричит. Только удары.' }] },
  { id: 'ev2_merle_hypo', at: at(11, 3, 10), scope: 'B', when: { all: [C2, { at: 'b_flat' }, { npc: 'merle', at: 'b_flat' }, { before: at(11, 5, 0) }] }, interrupt: true,
    effects: [{ set: '$.merle_hypo', value: true }],
    news: [{ channel: 'direct', text: 'Из комнаты Мерле — глухой стук, будто на пол упало что-то тяжёлое. Потом тишина.' }] },
  // Если к Мерле никто не подошёл — она приходит в себя сама, но к утру совсем без сил.
  { id: 'ev2_merle_hypo_bad', at: at(11, 3, 55), scope: 'B', when: { all: [C2, { flag: '$.merle_hypo' }, { not: { flag: '$.merle_helped' } }] },
    effects: [{ set: '$.merle_hypo_bad', value: true }] },
  { id: 'ev2_gerd_door', at: at(11, 1, 40), scope: 'world', when: { all: [C2, { npc: 'gerd', at: 'a_stairs' }, { at: 'a_flat' }, { before: at(11, 5, 0) }] }, interrupt: true,
    effects: [{ set: '$.gerd_at_door', value: true }],
    news: [{ channel: 'direct', text: 'На лестнице — шаги. Медленные, шаркающие, с остановками. Они поднимаются до твоей площадки и замирают у двери. Потом — глухой удар плечом. И ещё один.' }] },
  { id: 'ev2_gerd_below', at: at(11, 1, 0), scope: 'world',
    when: { all: [C2, { npc: 'gerd', at: 'a_brockmann' }, { npc: 'gerd', status: 'turned' }, { at: 'a_flat' }, { before: at(11, 5, 0) }] },
    news: [{ channel: 'direct', text: 'Снизу, из квартиры Брокманов, — удары. Неровные, тупые, будто кто-то раз за разом налетает на дверь. Потом долго ничего. Потом снова.' }] },
  { id: 'ev2_ilse_fever', at: at(11, 3, 45), scope: 'world', when: { all: [C2, { npc: 'ilse', at: 'a_flat' }, { at: 'a_flat' }, { npc: 'ilse', status: 'sick' }, { before: at(11, 6, 0) }] }, interrupt: true,
    effects: [{ set: '$.ilse_fever_seen', value: true }],
    news: [{ channel: 'direct', text: 'С дивана — частый стук. Ты не сразу понимаешь, что это зубы. Ильзе сидит, закутавшись в плед, и трясётся всем телом. Лоб у неё горячий и мокрый.', learn: 'f_ilse_fever' }] },
  { id: 'ev2_a_thief', at: at(11, 3, 20), scope: 'A',
    when: { all: [C2, { at: 'a_flat' }, { itemAt: 'opel_corsa', place: 'a_yard' }, { fuelIn: 'opel_corsa', liters: 3 }, { before: at(11, 4, 30) }] }, interrupt: true,
    effects: [{ set: '$.thief', value: true }],
    news: [{ channel: 'direct', text: 'Во дворе звякает металл. Ты подходишь к окну: у твоей машины — тень на корточках, луч фонарика под днищем, рядом канистра. Кто-то сливает твой бензин.' }] },
  { id: 'ev2_a_thief_done', at: at(11, 3, 55), scope: 'A', when: { all: [C2, { flag: '$.thief' }, { not: { flag: '$.thief_gone' } }] },
    effects: [{ siphon: 'opel_corsa', liters: 9 }, { set: '$.thief_gone', value: 'got_fuel' }] },
  { id: 'ev2_car_patrol', at: at(11, 0, 40), scope: 'world', when: { all: [C2, inCarScene, { before: at(11, 4, 0) }, { not: atAny(SOUTH) }] }, interrupt: true,
    effects: [{ set: '$.c2_patrol', value: true }],
    news: [{ channel: 'direct', text: 'Свет фонаря бьёт в стекло. Ты щуришься: двое в касках и камуфляже, третий держит машину на прицеле. Стучат костяшками в окно: «Aufmachen. Langsam.»', learn: 'f_curfew' }] },
  { id: 'ev2_car_shadow', at: at(11, 3, 30), scope: 'world', when: { all: [C2, inCarScene, { before: at(11, 5, 30) }] }, interrupt: true,
    effects: [{ set: '$.c2_shadow', value: true }],
    news: [{ channel: 'direct', text: 'Ты просыпаешься от того, что машина чуть качнулась. За стеклом — человек. Стоит вплотную, ладонями на окне, лицом к тебе. Глаза открыты. Он тебя не видит — или видит и не понимает. Ты перестаёшь дышать.' }] },
  { id: 'ev2_farm_lights', at: at(11, 2, 10), scope: 'world', when: { all: [C2, { at: 'hof_luedemann' }, { before: at(11, 5, 0) }] }, interrupt: true,
    effects: [{ set: '$.farm_lights', value: true }],
    news: [{ channel: 'direct', text: 'Собака во дворе заходится лаем. В окне — свет: на краю поля, у дороги, стоит машина с включёнными фарами. Стоит и не едет.' }] },
  { id: 'ev2_ws_gate', at: at(11, 1, 30), scope: 'world', when: { all: [C2, { at: 'deniz_workshop' }, { npc: 'deniz', at: 'deniz_workshop' }, { before: at(11, 5, 0) }] }, interrupt: true,
    effects: [{ set: '$.ws_gate', value: true }],
    news: [{ channel: 'direct', text: 'Железные ворота мастерской дёргаются — раз, другой. Снаружи голоса, двое или трое, и смех. Дениз уже стоит у ворот с монтировкой и не дышит.' }] },
  { id: 'ev2_ahr_sirens', at: at(11, 4, 10), scope: 'world', when: { all: [C2, { at: 'ahrensburg' }, { before: at(11, 6, 0) }] },
    news: [{ channel: 'direct', text: 'Сквозь сон — сирены. Далеко, со стороны Гамбурга, много, и не стихают. Потом стихают.' }] },

  // Утро: Katastrophenfall
  { id: 'ev2_kfall', at: at(11, 6, 0), scope: 'world', when: C2,
    effects: [{ set: 'w.kfall', value: true }, { set: 'w.crossings', value: 'corridor' }, { set: 'w.curfew', value: true }, { set: 'w.messe', value: 'open' }, { set: 'w.fuel_ban', value: true }],
    news: [
      { channel: 'radio', learn: 'f_kfall', text: 'Шесть утра. Вместо новостей — сигнал, три тона, и чужой, очень спокойный голос: «Der Senat der Freien und Hansestadt Hamburg hat den Katastrophenfall festgestellt…» Кризисный штаб. Бундесвер на улицах. Комендантский час с восьми вечера до шести утра. Оба тоннеля под Эльбой закрыты. Из города на юг — только через Elbbrücken, с девяти до двух, с проверкой. Пункт приёма в Messe открыт: еда, врачи, койки. Заправки — только для служб. Диктор повторяет всё ещё раз, слово в слово.' },
      { channel: 'phone', learn: 'f_kfall', text: 'NINA, сирена в динамике: «Katastrophenfall Hamburg. Ausgangssperre 20–6 Uhr. Sammelstelle Messe geöffnet. Elbquerungen gesperrt.»' },
      { channel: 'people', learn: 'f_kfall', text: 'Люди на улице пересказывают друг другу радио: Katastrophenfall, бундесвер, комендантский час. Кто-то плачет, кто-то смеётся — «ну наконец-то хоть кто-то что-то решил».' },
    ] },
  { id: 'ev2_loudspeaker', at: at(11, 8, 15), scope: 'world', when: { all: [C2, atAny(CITY)] },
    news: [{ channel: 'direct', learn: 'f_messe_open', text: 'По улице медленно ползёт полицейская машина, громкоговоритель на крыше: «Sammelstelle Messe geöffnet… Verpflegung, ärztliche Versorgung… Ausgangssperre ab zwanzig Uhr… Bleiben Sie ruhig.» Голос отражается от домов и пропадает за углом.' }] },
  { id: 'ev2_buchholz_water', at: at(11, 8, 0), scope: 'world', when: C2, effects: [{ set: 'w.water.buchholz', value: 'off' }] },
  // ── Участок 4 (после КТ 3) ──
  { id: 'ev4_corridor_closed', at: at(11, 14, 0), scope: 'world', when: C3, effects: [{ set: 'w.corridor_closed', value: true }],
    news: [{ channel: 'radio', learn: 'f_corridor_closed', text: 'Радио: «Der Korridor über die Elbbrücken ist für heute geschlossen». Следующее открытие — завтра в девять.' }] },
  { id: 'ev4_svenja', at: at(11, 17, 5), scope: 'world', when: { all: [C3, { at: 'b_flat' }, { npc: 'svenja', at: 'b_flat' }, { npc: 'svenja', status: 'infected' }] }, interrupt: true,
    effects: [{ set: '$.svenja_attack', value: true }],
    news: [{ channel: 'direct', text: 'С дивана — звук, какого не издают люди: не стон, не крик — рычание сквозь сжатые зубы. Свенья сидит, выпрямившись, плед на полу. Она смотрит на тебя. Не на тебя — сквозь.' }] },
  { id: 'ev4_okafor_scream', at: at(11, 19, 10), scope: 'world', when: { all: [C3, { any: [{ at: 'b_flat' }, { at: 'b_stairs' }] }, { npc: 'svenja', at: 'b_okafor' }, { npc: 'okafor', at: 'b_okafor' }] }, interrupt: true,
    effects: [{ set: '$.okafor_trouble', value: true }],
    news: [{ channel: 'direct', text: 'Через площадку — грохот, звон стекла и голос Окафора, впервые громкий: «Nein! Svenja, nein!» Потом удар в стену. Потом тишина.' }] },
  { id: 'ev4_attic', at: at(11, 18, 0), scope: 'world', when: { all: [C3, { any: [{ at: 'b_flat' }, { at: 'b_stairs' }] }, { npc: 'svenja', at: 'b_attic' }, { npc: 'svenja', status: 'infected' }] },
    news: [{ channel: 'direct', text: 'Наверху, над потолком, — удары. Кто-то бьётся в люк чердака снизу вверх. Ровно. Без остановки.' }] },
  { id: 'ev4_ilse', at: at(11, 13, 10), scope: 'world',
    when: { all: [C3, { at: 'a_flat' }, { npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', status: 'infected' }, { not: { npcVar: 'ilse', key: 'isolated' } }] }, interrupt: true,
    effects: [{ set: '$.ilse_attack', value: true }],
    news: [{ channel: 'direct', text: 'Ильзе встаёт с дивана — рывком, как Герд вчера. Плед соскальзывает. Она идёт к тебе, вытянув руки, и улыбается — не своим лицом.' }] },
  { id: 'ev4_ilse_door', at: at(11, 13, 10), scope: 'world',
    when: { all: [C3, { at: 'a_flat' }, { npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', status: 'infected' }, { npcVar: 'ilse', key: 'isolated' }] },
    news: [{ channel: 'direct', text: 'Из спальни — удар в дверь. Стул под ручкой подпрыгивает. Ещё удар. Голос Ильзе — без слов, на одной ноте.' }] },
  { id: 'ev4_ilse_turned', at: at(11, 21, 35), scope: 'world', when: { all: [C3, { at: 'a_flat' }, { npc: 'ilse', at: 'a_flat' }, { npc: 'ilse', status: 'turned' }] },
    news: [{ channel: 'direct', learn: 'f_ilse_turned', text: 'В спальне вдруг становится тихо. Надолго. Потом — шаги. Не её шаги: шаркающие, тяжёлые, без остановок, от стены к стене.' }] },
  { id: 'ev4_deniz_leaving', at: at(11, 11, 55), scope: 'world',
    when: { all: [C3, { at: 'deniz_workshop' }, { npc: 'deniz', at: 'deniz_workshop' }, { npc: 'kerem', at: 'deniz_workshop' }] }, interrupt: true,
    effects: [{ set: '$.deniz_leaving', value: true }],
    news: [{ channel: 'direct', text: 'Дениз захлопывает задние двери фургона и вытирает руки. — Едем к Хенрике. Сейчас, пока светло. — Он смотрит на тебя. — С нами?' }] },
  { id: 'ev4_wanderer', at: at(11, 22, 20), scope: 'world', when: { all: [C3, { any: [{ at: 'hof_luedemann' }, { at: 'farm_coop' }] }] }, interrupt: true,
    effects: [{ set: '$.wanderer', value: true }],
    news: [{ channel: 'direct', text: 'Собака заходится — не лаем, визгом. У забора со стороны поля, в лунном свете, — человек. Он стоит и раскачивается, держась за сетку, и сетка звенит.' }] },
  { id: 'ev4_messe_lights', at: at(11, 22, 0), scope: 'world', when: { all: [C3, { any: [{ at: 'messe' }, { at: 'messe_q' }] }] },
    news: [{ channel: 'direct', text: 'В десять гасят верхний свет. Зал не затихает: тысяча людей кашляет, шепчется, плачет, храпит. Где-то в дальнем конце ребёнок спрашивает, когда домой.' }] },
  { id: 'ev4_cp4_push', at: at(11, 22, 30), scope: 'world', when: { all: [C3, { not: { flag: '$.c4' } }] }, interrupt: true,
    effects: [{ set: '$.cp4_due', value: true }],
    news: [{ channel: 'direct', text: 'Половина одиннадцатого. Комендантский час давно начался. День кончился — пора устраиваться на ночь.' }] },
  { id: 'ev2_cp3_push', at: at(11, 10, 30), scope: 'world', when: { all: [C2, { not: C3 }, { not: { flag: '$.c3' } }] }, interrupt: true,
    effects: [{ set: '$.cp3_due', value: true }],
    news: [{ channel: 'direct', text: 'Половина одиннадцатого. Утро уходит, а с ним — светлое время, коридор через мосты и всё, что ещё можно успеть сегодня. Пора решать.' }] },
];

// ───────────── Радио второго дня ─────────────

const L = (...ids: string[]): Effect[] => ids.map((learn) => ({ learn, source: 'radio', quiet: true }));

export function radio2Outcomes(): Outcome[] {
  return [
    { id: 'r2_day', when: { after: at(11, 6, 0) }, effects: L('f_kfall', 'f_curfew', 'f_messe_open', 'f_corridor', 'f_messe_bus', 'f_fuel_ban', 'f_tunnels_closed'),
      text: 'Katastrophenfall — по кругу, каждые полчаса. Комендантский час с 20 до 6. Оба тоннеля под Эльбой закрыты. Из города на юг — только через Elbbrücken, с 9 до 14, «с медицинским осмотром на месте». В город с юга не пускают; от вокзала Harburg до Messe ходят автобусы. В Messe — еда, врачи, койки: «нуждающиеся в помощи, направляйтесь туда». Топливо — только службам. Между повторами — номера горячих линий и просьба «не вступать в контакт с агрессивными людьми».' },
    { id: 'r2_night', effects: L('f_messe'),
      text: 'Ночной эфир без ведущих: музыка, потом сводка, потом снова музыка. Пожары в Hammerbrook и Wilhelmsburg, «отдельные столкновения», Сенат заседает всю ночь. Утром — «важное сообщение». Какое — не говорят.' },
  ];
}

export const radio2 = (id = 'radio', label = 'Включить радио') => ({
  id, label, minutes: 5, combinable: true, repeatable: true, group: 'radio', outcomes: radio2Outcomes(),
});
