// Общие кусочки сцен главы 1: связь, радио, машина, деньги, переход к контрольным точкам.
import type { ActionDef, Outcome } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';

/** Партнёр появляется в истории не сразу: связь — только после 07:15 (≈ 5–8 решений). */
export const CONTACT_AFTER = at(10, 7, 15);
/** В 12:20 сеть ненадолго оживает (см. network в world.ts) — это и есть первая связь, КТ 1. */
export const NET_BACK = at(10, 12, 20);

/** Второй участок уже идёт (ставится при входе в первые сцены после КТ 1). */
export const SEG2: Cond = { flag: '$.seg2' };
export const seg2Enter: Effect[] = [{ set: '$.seg2', value: true }];

/** Звонок партнёру внутри участка не проходит: партнёр технически офлайн (ARCHITECTURE §7.7). */
export const callAction = (): ActionDef => ({
  id: 'call', label: 'Позвонить {partner.dat}', minutes: 2, combinable: true, group: 'phone_call', repeatable: true,
  when: { all: [{ phoneUsable: true }, { after: CONTACT_AFTER }, { any: [{ before: NET_BACK }, SEG2] }] },
  outcomes: [
    { id: 'unreachable', when: { network: 'voice' }, text: 'Гудок. Второй. Третий… «Der gewünschte Gesprächspartner ist zurzeit nicht erreichbar.»', effects: [{ charge: 'phone', delta: -1 }] },
    { id: 'busy', text: 'Вызов срывается, не начавшись: «Netz besetzt».', effects: [{ charge: 'phone', delta: -0.5 }] },
  ],
});

/** Переход к КТ 1 — всегда в самом конце списка действий. */
export const cp1Actions = (target: 'a_cp1' | 'b_cp1'): ActionDef[] => [
  { id: 'cp1_call', label: 'Сеть ожила — набрать {partner.acc}', minutes: 3, terminal: true, goto: target,
    when: { all: [{ after: NET_BACK }, { phoneUsable: true }, { not: SEG2 }] },
    text: 'Пальцы не сразу попадают по экрану. Вызов. Гудки идут — впервые за всё утро настоящие, длинные гудки.',
    effects: [{ set: '$.kt1_dialed', value: true }] },
  { id: 'cp1_noon', label: 'Полдень. Остановиться и решить, что дальше', minutes: 5, terminal: true, goto: target,
    when: { all: [{ after: at(10, 12, 35) }, { not: { phoneUsable: true } }, { not: SEG2 }] },
    text: 'Телефон мёртвым грузом лежит в кармане. Ты останавливаешься и пытаешься собрать мысли.' },
];

/**
 * Переход к КТ 2: ждать партнёра у себя (с сумерек) или устроиться на ночь (с 20:30). Тоже в конце списка.
 * Из двора, с лестницы, с улицы у дома ждут и ночуют в квартире: у окна, за запертой дверью
 * (иначе партнёр звонил в домофон, а «ты» стоял(а) у того же подъезда — и встреча не засчитывалась).
 */
export const cp2Actions = (target: 'a_cp2' | 'b_cp2', homes: string[], flat: string): ActionDef[] => {
  const atHome: Cond = { any: homes.map((h) => ({ at: h })) };
  return [
    { id: 'cp2_wait', label: 'Сесть у окна и ждать {partner.acc}', minutes: 10, terminal: true, goto: target,
      when: { all: [SEG2, { flag: '$.partner_coming' }, { after: at(10, 16, 45) }, atHome] },
      text: 'Ты придвигаешь стул к окну. Отсюда видно улицу в обе стороны. Остаётся только ждать.',
      effects: [{ move: flat }] },
    { id: 'cp2_night', label: 'Ночь. Устроиться на ночлег и дождаться утра', minutes: 10, terminal: true, goto: target,
      when: { all: [SEG2, { after: at(10, 20, 30) }] },
      outcomes: [
        { id: 'home', when: atHome, text: 'Ты проверяешь дверь ещё раз и ложишься, не раздеваясь.', effects: [{ move: flat }] },
        { id: 'away', text: 'Ты устраиваешься на ночь там, где есть, — не раздеваясь, вполглаза.' },
      ] },
  ];
};

export const A_HOMES = ['a_flat', 'a_stairs', 'a_yard', 'a_street'];
export const B_HOMES = ['b_flat', 'b_stairs', 'b_yard', 'b_street'];
/** Хвост любого списка действий: связь и контрольные точки. */
export const aTail = (): ActionDef[] => [...cp1Actions('a_cp1'), ...cp2Actions('a_cp2', A_HOMES, 'a_flat')];
export const bTail = (): ActionDef[] => [...bEventActions, ...cp1Actions('b_cp1'), ...cp2Actions('b_cp2', B_HOMES, 'b_flat')];

/** Действия, которые появляются в местах B из-за событий второго участка (проводы, стук в дверь). */
const bEventActions: ActionDef[] = [
  { id: 'farewell', label: 'Выйти проводить Новаков', minutes: 2, terminal: true, goto: 'b2_farewell',
    when: { all: [{ flag: '$.nowak_leaving' }, { not: { flag: '$.farewell_seen' } }, { not: { flag: 'w.nowaks_gone' } }, { any: [...B_HOMES, 'b_nowak', 'b_kiosk'].map((h) => ({ at: h })) }] } },
  { id: 'svenja', label: 'Посмотреть в глазок — кто стучит', minutes: 1, terminal: true, goto: 'b2_svenja',
    when: { all: [{ flag: '$.svenja_knock' }, { not: { flag: '$.svenja_done' } }, { at: 'b_flat' }] } },
];

/** Переждать: время идёт, тело отдыхает. */
export const waitHour = (label = 'Переждать час', id = 'wait_hour'): ActionDef => ({
  id, label, minutes: 60, activity: 'rest', repeatable: true, combinable: true,
  text: 'Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.',
});

// ───────────── Радио ─────────────

const L = (...ids: string[]): Effect[] => ids.map((learn) => ({ learn, source: 'radio', quiet: true }));

/** Выпуск новостей по времени — от самого свежего к раннему. */
export function radioOutcomes(): Outcome[] {
  return [
    { id: 'r_messe', when: { after: at(10, 19, 30) }, effects: L('f_messe', 'f_cordon'),
      text: 'Вечерний выпуск. В залах Messe Hamburg готовят пункт приёма для жителей «наиболее пострадавших районов», подробности — утром. Диктор зачитывает номера горячих линий, по которым уже никто не дозвонится.' },
    { id: 'r_cordon', when: { after: at(10, 17, 30) }, effects: L('f_cordon', 'f_net_overload'),
      text: '«…Die Polizei riegelt Harburg und Teile der Innenstadt ab…» Всех просят оставаться дома, не открывать посторонним и «не вступать в контакт с агрессивными людьми». Голос у диктора другой — не тот, что утром.' },
    { id: 'r_net', when: { after: at(10, 15, 0) }, effects: L('f_net_overload', 'f_tunnel_open'),
      text: 'Мобильные сети перегружены: «звоните только в экстренных случаях, пишите SMS». Тоннель на A7 в сторону центра открыт, из города на юг — всё стоит. Между выпусками больше не ставят музыку.' },
    { id: 'r_tunnel', when: { after: at(10, 12, 30) }, effects: L('f_tunnel_open', 'f_elbe_jam', 'f_rail_stopped'),
      text: 'Тоннель на A7 в сторону центра снова открыт — одна полоса, движение медленное. Мосты по-прежнему перекрыты. Из города на юг — затор на много километров. Пресс-конференции Сената так и не было: «Сенат заседает».' },
    { id: 'r_jam', when: { after: at(10, 12, 10) }, effects: L('f_elbe_jam', 'f_rail_stopped'),
      text: 'На Elbbrücken и на A1/A7 в сторону юга — затор на много километров: город начинает уезжать. Полиция просит «не создавать хаос на дорогах». Поезда на Harburg стоят.' },
    { id: 'r_rail', when: { after: at(10, 11, 40) }, effects: L('f_rail_stopped', 'f_barmbek_shooting'),
      text: 'Deutsche Bahn остановила поезда между Гамбургом, Harburg и Buchholz — «полицейская операция». Пресс-конференцию Сената переносят. Голос диктора впервые за утро сбивается на полуслове.' },
    { id: 'r_shooting', when: { after: at(10, 9, 40) }, effects: L('f_barmbek_shooting', 'f_bridges_closed'),
      text: '«…Schüsse vor einer Klinik in Barmbek…» Полиция перекрыла квартал, жителей просят держать окна и двери закрытыми. Мосты на юге всё ещё перекрыты. Сенат обещает пресс-конференцию в полдень.' },
    { id: 'r_bridges', when: { after: at(10, 8, 30) }, effects: L('f_bridges_closed', 'f_schools_closed'),
      text: 'Срочное сообщение: «Polizeieinsatz auf der Veddel» — Elbbrücken закрыты в сторону центра. На A1 у Norderelbbrücke грузовик лёг поперёк полос, тоннель на A7 к северу закрыт после аварии. Всех, кто едет в Гамбург с юга, просят развернуться.' },
    { id: 'r_schools', when: { after: at(10, 7, 15) }, effects: L('f_schools_closed', 'f_hospital_attacks'),
      text: 'Школы Гамбурга сегодня закрыты «из соображений предосторожности». Полиция просит держаться подальше от клиник в Eppendorf и Barmbek. Пробки на въездах в город — «как обычно, только хуже».' },
    { id: 'r_early', effects: L('f_hospital_attacks'),
      text: '«…NDR 90,3, es ist kurz vor sieben…» Ровный голос: ночью — «нападения в нескольких клиниках», полиция «не видит признаков теракта», Сенат просит без крайней нужды не ехать в приёмные отделения. Потом прогноз: дождь, плюс семь.' },
  ];
}

export const radioAction = (id = 'radio', label = 'Включить радио'): ActionDef => ({
  id, label, minutes: 5, combinable: true, repeatable: true, group: 'radio', outcomes: radioOutcomes(),
});

// ───────────── Машина A ─────────────

/** Машина стоит здесь и бак не пуст. */
export const carHere: Cond = { fuelFor: 'opel_corsa', km: 0.1 };
/** Хватит ли бензина на столько километров (с поправкой на пробку). */
export const fuelOk = (km: number, jam = 1): Cond => ({ fuelFor: 'opel_corsa', km: Math.round(km * jam * 10) / 10 });

/** Поездка: бензин, перестановка машины, подзарядка телефона, если он на проводе. */
export function driveTo(km: number, to?: string, jam = 1): Effect[] {
  const e = { drive: 'opel_corsa', km, ...(to ? { to } : {}), ...(jam !== 1 ? { jam } : {}) } as Effect;
  return [e, { if: { all: [{ flag: '$.car_charging' }, { hasTag: 'charger' }] }, then: [{ charge: 'phone', delta: Math.min(40, Math.round(km * jam * 0.8)) }] }];
}

/** Готовое действие «поехать туда-то». */
export function driveAction(id: string, label: string, km: number, minutes: number, to: string, goto: string, extra: Partial<ActionDef> = {}, jam = 1): ActionDef {
  return {
    id, label, minutes, terminal: true, goto,
    enabled: { all: [{ has: 'car_keys' }, fuelOk(km, jam)] },
    disabledReason: 'Нужны ключи от машины и бензин на дорогу',
    ...extra,
    effects: [...driveTo(km, to, jam), ...(extra.effects ?? [])],
  };
}

// ───────────── Деньги ─────────────

/**
 * Покупка. Если указан ключ тока региона — картой можно платить, пока ток есть;
 * без ключа — только наличные.
 */
export function buy(id: string, label: string, eur: number, power: string | null, effects: Effect[], extra: Partial<ActionDef> = {}): ActionDef {
  const cash: Cond = { has: 'cash_eur', qty: eur };
  const card: Cond | null = power ? { all: [{ v: power, op: '!=', value: 'off' }, { has: 'bank_card' }] } : null;
  return {
    id, label: `${label} — ${eur} €`, minutes: 3, combinable: true,
    enabled: card ? { any: [card, cash] } : cash,
    disabledReason: card ? `Нужно ${eur} € наличными: карты сейчас не принимают` : `Нужно ${eur} € наличными`,
    ...extra,
    effects: [card ? { if: card, then: [], else: [{ take: 'cash_eur', qty: eur }] } : { take: 'cash_eur', qty: eur }, ...effects],
  };
}
