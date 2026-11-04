// Повседневный уход в новых участках. Запасы, тара и источники питания остаются частью общего состояния.
import type { ActionDef, Scene } from './content-types';
import type { CampOperation, ItemInstance } from './types';
import { BASE_MEALS, baseOf, stockAt } from './base';
import { clamp, round } from './rng';
import { countTag, fmt, giveItem, heldItems, itemType, me, moveItems, network, phone, phoneUsable, setVar, takeItems, type Ctx } from './world';

export const campKey = (ctx: Ctx, key: string) => `${ctx.pid}.camp${ctx.s.checkpoint}.${key}`;
export const campConfig = (ctx: Ctx) => {
  const config = ctx.s.checkpoint >= 5 ? ctx.c.scenes[me(ctx).scene]?.camp : undefined;
  return config?.at === me(ctx).location ? config : undefined;
};
const ready = (ctx: Ctx) => !!ctx.s.vars[campKey(ctx, 'ready')];
const qtyHeld = (ctx: Ctx, type: string) => heldItems(ctx).filter(i => i.type === type).reduce((n, i) => n + i.qty, 0);
const dayAt = (ctx: Ctx) => Math.floor((me(ctx).time - 360) / 1440);
const mealKey = (ctx: Ctx, base: string, day: number, hour: number) => `${ctx.pid}.camp.meal.${base}.${day}.${hour}`;
const pretty = (n: number) => String(round(n, 2)).replace('.', ',');
const byId = (a: { id: string }, b: { id: string }) => a.id === b.id ? 0 : a.id < b.id ? -1 : 1;

function ration(ctx: Ctx) {
  const base = baseOf(ctx, me(ctx).location), day = dayAt(ctx);
  if (!base || ctx.s.vars[`${ctx.pid}.ration.${base.id}`] !== day
    // После КТ6 свой паёк доступен и не-хранителю: суточный расход будет
    // слит с линии хранителя, а личное право на порцию уже записано в 06:00.
    || (ctx.s.checkpoint < 6 && Number(ctx.s.vars[`base.${base.id}.lastDay`] ?? -1) < day)) return;
  const food = clamp(Number(ctx.s.vars[`${ctx.pid}.ration.${base.id}.food`] ?? 0), 0, 1);
  return { base, day, food };
}

function nextMeal(ctx: Ctx) {
  const r = ration(ctx);
  if (!r || !r.food) return;
  const hour = BASE_MEALS.find(h => !ctx.s.vars[mealKey(ctx, r.base.id, r.day, h)]
    && (ctx.s.checkpoint < 6 || me(ctx).time >= r.day * 1440 + h * 60 - 60));
  return hour === undefined ? undefined : { ...r, hour };
}
export const campRationRemaining = (ctx: Ctx) => ready(ctx) ? nextMeal(ctx)?.food ?? 0 : 0;

function waterSources(ctx: Ctx): { item: ItemInstance; per: number; thirst: number }[] {
  const config = campConfig(ctx);
  const own = heldItems(ctx).flatMap(item => {
    const t = itemType(ctx, item.type);
    if (t.container?.empty) return [{ item, per: t.container.liters, thirst: (t.food?.thirst ?? 0) / t.container.liters }];
    return t.tags.includes('water_bulk') ? [{ item, per: 1, thirst: 44 }] : [];
  });
  const stored = config?.kitchen ? Object.values(ctx.s.items).filter(i => i.qty > 0 && i.reservedFor === ctx.pid
    && i.at.kind === 'place' && i.at.id === config.stock && itemType(ctx, i.type).tags.includes('water_bulk'))
    .map(item => ({ item, per: 1, thirst: 44 })) : [];
  return [...stored, ...own].sort((a, b) => Number(!a.item.reservedFor) - Number(!b.item.reservedFor) || byId(a.item, b.item));
}

export const campWater = (ctx: Ctx) => waterSources(ctx).reduce((n, x) => n + x.item.qty * x.per, 0);

function removeQuantity(ctx: Ctx, item: ItemInstance, qty: number, containers = true) {
  const before = item.qty, n = Math.min(before, qty);
  item.qty = round(Math.max(0, before - n), 6); item.changedAt = me(ctx).time;
  if (item.qty <= 0) item.at = { kind: 'gone' };
  const empty = itemType(ctx, item.type).container?.empty;
  const emptied = Math.max(0, Math.ceil(before - 1e-8) - Math.ceil(item.qty - 1e-8));
  if (containers && empty && emptied) giveItem(ctx, empty, emptied);
  return n;
}

function useWater(ctx: Ctx, liters: number): number | undefined {
  if (campWater(ctx) + 1e-8 < liters) return;
  let left = liters, thirst = 0;
  for (const source of waterSources(ctx)) {
    const used = Math.min(left, source.item.qty * source.per);
    removeQuantity(ctx, source.item, used / source.per);
    thirst += used * source.thirst; left -= used;
    if (left < 1e-8) break;
  }
  return thirst;
}

function heatAvailable(ctx: Ctx) {
  const b = baseOf(ctx, me(ctx).location);
  return !!b && (!ctx.s.vars[`base.${b.id}.cold`] || (qtyHeld(ctx, 'firewood') >= 0.2 && countTag(ctx, 'fire') > 0));
}

function burnIfCold(ctx: Ctx) {
  const b = baseOf(ctx, me(ctx).location);
  if (b && ctx.s.vars[`base.${b.id}.cold`]) takeItems(ctx, i => i.type === 'firewood', 0.2);
}

export function campAvailable(ctx: Ctx, what: 'meal' | 'portion' | 'water' | 'cook' | 'hostMeal' | 'tableMeal'): boolean {
  if (!campConfig(ctx)) return false;
  if (what === 'water') return campWater(ctx) >= 0.5 || (ctx.s.checkpoint === 5 && !ready(ctx) && !!ctx.s.vars[`${ctx.pid}.c6_r_water`]);
  if (what === 'portion') return !!campConfig(ctx)?.kitchen && ready(ctx) && (qtyHeld(ctx, 'c3_meal') > 0 || campAvailable(ctx, 'meal'));
  if (what === 'tableMeal') return !!campConfig(ctx)?.kitchen && ready(ctx) && !!nextMeal(ctx);
  if (!campConfig(ctx)?.kitchen || !ready(ctx) || !heatAvailable(ctx)) return false;
  if (what === 'cook') return qtyHeld(ctx, 'oats') >= 0.5 && campWater(ctx) >= 0.5;
  if (what === 'hostMeal') {
    const n = Math.min(0.5, ration(ctx)?.food ?? 0);
    return n > 0 && !ctx.s.vars['w.c6_camp_host_meal'] && campWater(ctx) >= 0.5 * n;
  }
  const meal = nextMeal(ctx);
  return !!meal && campWater(ctx) + 1e-8 >= 0.5 * meal.food;
}

function deliverWater(ctx: Ctx, liters: number, notes: string[]) {
  const config = campConfig(ctx);
  if (!config || ctx.s.vars[campKey(ctx, 'workWater')]) return;
  giveItem(ctx, 'water_l', liters, { reservedFor: ctx.pid, note: fmt(ctx, 'Отложено для {name.gen}') }, { kind: 'place', id: config.stock });
  setVar(ctx, campKey(ctx, 'workWater'), liters);
  notes.push(`В кухонную ёмкость отложено ${pretty(liters)} л воды. Это часть принесённых двадцати литров.`);
}

function prepare(ctx: Ctx, notes: string[]) {
  const config = campConfig(ctx);
  if (!config || ready(ctx)) return;
  setVar(ctx, campKey(ctx, 'ready'), true);
  const r = ration(ctx);
  if (!ctx.s.vars[`${ctx.pid}.camp.manualMeals`] && r) {
    for (const h of BASE_MEALS) if (me(ctx).time >= 360 + r.day * 1440 + (h - 6) * 60)
      setVar(ctx, mealKey(ctx, r.base.id, r.day, h), true);
    // В старой попытке свою вечернюю порцию уже могли отдать.
    if (ctx.s.checkpoint === 5 && ctx.s.vars['B.c6_l_food'] === 'own' && ctx.pid === 'B') setVar(ctx, mealKey(ctx, r.base.id, r.day, 19), true);
  }
  setVar(ctx, `${ctx.pid}.camp.manualMeals`, true);
  for (const [type, max] of [['oats', 1], ['firewood', 0.4]] as const) {
    const have = stockAt(ctx, config.stock, type);
    // Прежний расход B сохраняется: перед разделом восстанавливаем исходную величину только для расчёта доли.
    const used = ctx.s.checkpoint === 5 && type === 'oats' && ctx.pid === 'B' && ctx.s.vars['B.c6_l_food'] === 'stock' ? 0.25 : 0;
    const amount = round(Math.max(0, Math.min(max, (have + used) / 2 - used)), 6);
    if (amount > 0) {
      moveItems(ctx, i => i.type === type, amount, { kind: 'place', id: config.stock }, { kind: 'char', id: ctx.pid });
      notes.push(`Из общего запаса выделено тебе: ${itemType(ctx, type).name} — ${pretty(amount * itemType(ctx, type).weight)} г.`);
    }
  }
  const car = Object.values(ctx.s.items).find(i => i.qty > 0 && i.type === config.car && i.at.kind === 'place' && i.at.id === me(ctx).location);
  if (car) setVar(ctx, campKey(ctx, 'carLimit'), (car.fuel ?? 0) / 2);
  if (ctx.s.checkpoint === 5 && ctx.s.vars[`${ctx.pid}.c6_r_water`]) deliverWater(ctx, 10, notes);
  notes.push(r?.food ? 'Продукты для суточного пайка уже отложены из общего запаса. Оставшуюся порцию можно съесть или взять с собой; дважды она не выдаётся.' : 'На сегодня порция не выделена. Можно приготовить еду из выделенных продуктов или воспользоваться своими запасами.');
}

export function consumeCampFood(ctx: Ctx, type: string, qty = 1, here = false): number {
  const list = here ? Object.values(ctx.s.items).filter(i => i.qty > 0 && i.type === type && i.at.kind === 'place'
    && i.at.id === me(ctx).location && (!i.reservedFor || i.reservedFor === ctx.pid)) : heldItems(ctx).filter(i => i.type === type);
  const food = itemType(ctx, type).food;
  if (!food) return 0;
  const n = Math.min(qty, list.reduce((sum, i) => sum + i.qty, 0));
  let left = n;
  for (const i of list.sort(byId)) {
    left -= removeQuantity(ctx, i, left);
    if (left < 1e-8) break;
  }
  me(ctx).body.hunger = round(clamp(me(ctx).body.hunger - n * (food.hunger ?? 0), 0, 100), 2);
  me(ctx).body.thirst = round(clamp(me(ctx).body.thirst - n * (food.thirst ?? 0), 0, 100), 2);
  return n;
}

export function performCamp(ctx: Ctx, op: CampOperation): string[] {
  const notes: string[] = [];
  if (!campConfig(ctx)) return notes;
  if (op.kind === 'prepare') { prepare(ctx, notes); return op.quiet && ctx.s.checkpoint >= 6 ? [] : notes; }
  if (op.kind === 'consume') {
    const n = consumeCampFood(ctx, op.type, op.qty, op.here);
    notes.push(n ? `Израсходовано: ${itemType(ctx, op.type).name} — ${pretty(n)}.` : 'Подходящей еды или воды здесь больше нет.');
    return notes;
  }
  if (op.kind === 'deliverWater') { prepare(ctx, notes); deliverWater(ctx, op.liters, notes); return notes; }
  if (op.kind === 'fetchWater') {
    if (!campConfig(ctx)?.well) return ['Сейчас нет безопасного доступа к колодцу.'];
    prepare(ctx, notes);
    giveItem(ctx, 'water_l', op.liters, { reservedFor: ctx.pid, note: fmt(ctx, 'Отложено для {name.gen}') }, { kind: 'place', id: campConfig(ctx)!.stock });
    return [...notes, ctx.s.checkpoint >= 6 ? `Из колодца принесено ${pretty(op.liters)} л воды.`
      : `Из колодца принесено ещё ${pretty(op.liters)} л. Обещанные десять литров этим не заменяются.`];
  }
  if (op.kind === 'drink') {
    const benefit = useWater(ctx, op.liters);
    if (benefit === undefined) return ['Воды недостаточно; жажда не изменилась.'];
    me(ctx).body.thirst = round(clamp(me(ctx).body.thirst - benefit, 0, 100), 2);
    return [`Выпито ${pretty(op.liters)} л из доступного запаса.`];
  }
  if (op.kind === 'refill') {
    const vessel = ctx.c.items[op.empty]?.container;
    if (!vessel?.filled || qtyHeld(ctx, op.empty) < 1 || campWater(ctx) < vessel.liters) return ['Нет пустой бутылки или достаточного количества воды.'];
    useWater(ctx, vessel.liters); takeItems(ctx, i => i.type === op.empty, 1); giveItem(ctx, vessel.filled, 1);
    return [`Бутылка наполнена: ${pretty(vessel.liters)} л списано из запаса. Пустой тары стало на одну меньше.`];
  }
  if (op.kind === 'meal') {
    prepare(ctx, notes);
    if (op.mode === 'give' && qtyHeld(ctx, 'c3_meal') > 0) {
      const n = takeItems(ctx, i => i.type === 'c3_meal', Math.min(1, qtyHeld(ctx, 'c3_meal')));
      return [...notes, `Передана готовая порция из рюкзака: ${pretty(n)}. Вторая порция не появилась, сытость владельца не выросла.`];
    }
    const host = op.mode === 'host', meal = host ? ration(ctx) : nextMeal(ctx);
    if (!meal || !campAvailable(ctx, host ? 'hostMeal' : op.communal ? 'tableMeal' : 'meal')) return [...notes, 'Доступной порции нет. Еда и сытость не появились.'];
    const n = host ? Math.min(0.5, meal.food) : meal.food;
    if (!op.communal) { useWater(ctx, 0.5 * n); burnIfCold(ctx); }
    if (host) setVar(ctx, 'w.c6_camp_host_meal', n);
    else if ('hour' in meal && typeof meal.hour === 'number') setVar(ctx, mealKey(ctx, meal.base.id, meal.day, meal.hour), true);
    if (op.mode === 'pack') giveItem(ctx, 'c3_meal', n);
    if (op.mode === 'return') giveItem(ctx, 'c3_meal', n, {}, { kind: 'place', id: campConfig(ctx)!.stock });
    if (op.mode === 'eat') {
      me(ctx).body.hunger = round(clamp(me(ctx).body.hunger - 20 * n, 0, 100), 2);
      me(ctx).body.thirst = round(clamp(me(ctx).body.thirst - 18 * n, 0, 100), 2);
    }
    return [...notes, host ? 'Хозяйка делится своей едой.' : op.mode === 'eat' ? fmt(ctx, 'Ты {m:поел|поела} за общим столом.') : op.mode === 'pack' ? 'Готовая еда теперь у тебя с собой.' : op.mode === 'return' ? 'Твоя порция осталась общему столу.' : 'Ты передаёшь свою еду. Твоя порция использована.'];
  }
  if (op.kind === 'cook') {
    if (!campAvailable(ctx, 'cook')) return ['Для готовки нужны крупа, пол-литра воды и работающая печь или топливо.'];
    takeItems(ctx, i => i.type === 'oats', 0.5); useWater(ctx, 0.5); burnIfCold(ctx);
    if (op.mode === 'pack') giveItem(ctx, 'c3_porridge', 1);
    return ['На дополнительную порцию ушло 250 г крупы и 0,5 л воды. Готовая каша не дублирует исходные продукты.'];
  }
  if (op.kind === 'bank') {
    const bank = heldItems(ctx).find(i => itemType(ctx, i.type).tags.includes('powerbank') && (i.charge ?? 0) > 0 && i.condition > 0), ph = phone(ctx);
    if (!bank || !ph || countTag(ctx, 'charger') === 0) return ['Нужны исправные телефон, пауэрбанк и кабель.'];
    const gain = Math.min(20, 100 - (ph.charge ?? 0), (bank.charge ?? 0) * 2);
    ph.charge = round((ph.charge ?? 0) + gain, 2); bank.charge = round((bank.charge ?? 0) - gain / 2, 2);
    ph.changedAt = bank.changedAt = me(ctx).time;
    return [`Телефон: +${pretty(gain)} %. Пауэрбанк: −${pretty(gain / 2)} %.`];
  }
  if (op.kind === 'carCharge') {
    const car = carForCharging(ctx), ph = phone(ctx);
    if (!car || !ph || (car.fuel ?? 0) < op.fuel || carBudget(ctx) < op.fuel || countTag(ctx, 'charger') === 0) return ['Нет доступного источника питания: нужны машина с топливом и кабель.'];
    car.fuel = round((car.fuel ?? 0) - op.fuel, 4); car.changedAt = me(ctx).time;
    setVar(ctx, campKey(ctx, 'carUsed'), Number(ctx.s.vars[campKey(ctx, 'carUsed')] ?? 0) + op.fuel);
    ph.charge = round(clamp((ph.charge ?? 0) + op.gain, 0, 100), 2); ph.changedAt = me(ctx).time;
    return [`Мотор работал для зарядки: потрачено ${pretty(op.fuel)} л бензина. Телефон: +${pretty(op.gain)} % до фонового расхода.`];
  }
  if (op.kind === 'signal') {
    const ph = phone(ctx);
    if (!ph || !phoneUsable(ctx)) return ['Телефон разряжен или неисправен.'];
    ph.charge = round(Math.max(0, (ph.charge ?? 0) - 1), 2); ph.changedAt = me(ctx).time;
    const net = network(ctx);
    return [`Проверка связи потратила 1 % заряда. Звонки: ${net.voice ? 'сеть доступна' : 'нет соединения'}; сообщения: ${net.sms ? 'можно отправить' : 'не уходят'}; интернет: ${net.data ? 'доступен' : 'не открывается'}.`];
  }
  return notes;
}

function carForCharging(ctx: Ctx) {
  const config = campConfig(ctx);
  const keys = Object.values(ctx.s.items).some(i => i.qty > 0 && i.type === 'car_keys' && i.at.kind === 'char'
    && (i.at.id === ctx.pid || (ctx.s.vars['w.together'] && ctx.s.chars[i.at.id].location === me(ctx).location)));
  return keys && config?.car ? Object.values(ctx.s.items).find(i => i.qty > 0 && i.condition > 20 && i.type === config.car
    && i.at.kind === 'place' && i.at.id === me(ctx).location) : undefined;
}

const carBudget = (ctx: Ctx) => Number(ctx.s.vars[campKey(ctx, 'carLimit')] ?? 0) - Number(ctx.s.vars[campKey(ctx, 'carUsed')] ?? 0);

export function campActions(ctx: Ctx, scene: Scene, original: ActionDef[]): ActionDef[] {
  const config = campConfig(ctx);
  if (config !== scene.camp) return original;
  if (!config) return original;
  const list: ActionDef[] = original.filter(a => !['u:eat', 'u:drink', 'u:tap', 'u:powerbank', 'u:sleep', 'u:rest'].includes(a.id)
    && (config.rest || a.minutes <= 5 || /^u:(take|drop|rule)/.test(a.id)));
  if (!ready(ctx)) list.push({ id: 'u:camp_prepare', label: 'Уточнить свой паёк и взять разрешённые припасы', minutes: 2, combinable: true,
    effects: [{ camp: { kind: 'prepare' } }] });
  if (me(ctx).body.hunger >= 1) {
    const foods = [...new Set(heldItems(ctx).filter(i => (itemType(ctx, i.type).food?.hunger ?? 0) > 0).map(i => i.type))]
      .sort((a, b) => (itemType(ctx, a).spoilsAfter ?? Infinity) - (itemType(ctx, b).spoilsAfter ?? Infinity) || (a < b ? -1 : 1));
    for (const type of foods) {
      const t = itemType(ctx, type);
      if (config.rest || (t.food?.minutes ?? 15) <= 5) list.push({ id: list.some(a => a.id === 'u:eat') ? `u:eat:${type}` : 'u:eat', label: `Поесть (${t.name})`,
        minutes: t.food?.minutes ?? 15, combinable: true, group: 'u:eat', effects: [{ camp: { kind: 'consume', type } }] });
    }
  }
  if (me(ctx).body.thirst >= 10) {
    const drinks = [...new Set(heldItems(ctx).filter(i => (itemType(ctx, i.type).food?.thirst ?? 0) > 0).map(i => i.type))]
      .sort((a, b) => Number(itemType(ctx, b).tags.includes('drink')) - Number(itemType(ctx, a).tags.includes('drink')) || (a < b ? -1 : 1));
    for (const type of drinks) {
      const t = itemType(ctx, type);
      if (config.rest || (t.food?.minutes ?? 3) <= 5) list.push({ id: list.some(a => a.id === 'u:drink') ? `u:drink:${type}` : 'u:drink', label: `${t.tags.includes('drink') ? 'Попить' : 'Утолить жажду'} (${t.name})`,
        minutes: t.food?.minutes ?? 3, combinable: true, group: 'u:drink', effects: [{ camp: { kind: 'consume', type } }] });
    }
  }
  if (config.kitchen && ready(ctx)) {
    if (campWater(ctx) >= 0.5 && me(ctx).body.thirst >= 10) list.push({ id: 'u:camp_water', label: 'Выпить 0,5 л из отложенной воды', minutes: 3, combinable: true, group: 'u:drink', effects: [{ camp: { kind: 'drink', liters: 0.5 } }] });
    for (const i of heldItems(ctx).filter(i => itemType(ctx, i.type).container?.filled)) {
      const c = itemType(ctx, i.type).container!;
      if (campWater(ctx) >= c.liters) list.push({ id: `u:refill:${i.type}`, label: `Наполнить пустую бутылку (${pretty(c.liters)} л)`, minutes: 2, combinable: true, group: `u:refill:${i.type}`, effects: [{ camp: { kind: 'refill', empty: i.type } }] });
    }
    const mealInStory = ctx.s.checkpoint >= 6 && scene.actions.some(a => a.effects?.some(e => 'camp' in e && e.camp.kind === 'meal' && e.camp.communal));
    if (campAvailable(ctx, 'tableMeal') && !mealInStory && (scene.id !== 'c6_camp_supper' || ctx.replaying)) {
      list.push({ id: 'u:table_meal', label: 'Поесть за общим столом', presentation: 'story', minutes: 10, combinable: true, group: 'u:meal', effects: [{ camp: { kind: 'meal', mode: 'eat', communal: true } }] });
      list.push({ id: 'u:table_pack', label: 'Попросить оставить свою порцию с собой', presentation: 'story', minutes: 3, combinable: true, group: 'u:meal', effects: [{ camp: { kind: 'meal', mode: 'pack', communal: true } }] });
    }
    if (ctx.replaying && campAvailable(ctx, 'meal')) {
      list.push({ id: 'u:camp_meal', label: 'Съесть свою отложенную порцию', minutes: 10, combinable: true, group: 'u:meal', effects: [{ camp: { kind: 'meal', mode: 'eat' } }] });
      list.push({ id: 'u:pack_meal', label: 'Взять свою готовую порцию с собой', minutes: 3, combinable: true, group: 'u:meal', effects: [{ camp: { kind: 'meal', mode: 'pack' } }] });
    }
    if (campAvailable(ctx, 'cook')) list.push({ id: 'u:cook_oats', label: 'Сварить кашу из своих 250 г крупы и 0,5 л воды', minutes: 15, combinable: true, effects: [{ camp: { kind: 'cook', mode: 'pack' } }] });
  }
  if (config.well) list.push({ id: 'u:well_water', label: 'Сходить к колодцу за двумя литрами воды', minutes: 10, activity: 'moderate', ambientDuring: { tempC: 9, outdoor: true },
    combinable: true, group: 'u:well', effects: [{ camp: { kind: 'fetchWater', liters: 2 } }] });
  const bank = heldItems(ctx).some(i => itemType(ctx, i.type).tags.includes('powerbank') && (i.charge ?? 0) > 0 && i.condition > 0), ph = phone(ctx);
  if (bank && ph && (ph.charge ?? 0) < 100 && countTag(ctx, 'charger') > 0) list.push({ id: 'u:powerbank', label: 'Подзарядить телефон от своего пауэрбанка', minutes: 2, combinable: true, group: 'u:powerbank', effects: [{ camp: { kind: 'bank' } }] });
  if (ph && (ph.charge ?? 0) < 100 && config.rest && ready(ctx) && countTag(ctx, 'charger') > 0) {
    const car = carForCharging(ctx);
    const gain = round(Math.max(0, Math.min(20, 100 - (ph.charge ?? 0), (car?.fuel ?? 0) * 100, carBudget(ctx) * 100)), 2), fuel = round(gain / 100, 4);
    if (car && gain >= 1 && (car.fuel ?? 0) >= fuel && carBudget(ctx) + 1e-8 >= fuel) list.push({ id: 'u:car_charge', label: `Зарядить телефон в машине (+${pretty(gain)} %, ${pretty(fuel)} л бензина)`,
      minutes: Math.max(1, Math.ceil(gain * 1.5)), activity: 'rest', combinable: true, group: 'u:powerbank', effects: [{ camp: { kind: 'carCharge', gain, fuel } }] });
  }
  if (phoneUsable(ctx)) list.push({ id: 'u:signal', label: 'Проверить связь и возможность отправить сообщение', minutes: 2, combinable: true, group: 'u:signal', effects: [{ camp: { kind: 'signal' } }] });
  if (config.rest) list.push({ id: 'u:rest', label: config.rest === 'brief' ? 'Перевести дух (10 мин)' : 'Перевести дух (30 мин)', minutes: config.rest === 'brief' ? 10 : 30, activity: 'rest', combinable: true, group: 'u:rest', repeatable: true });
  if (config.rest === 'sleep' && (me(ctx).body.fatigue >= 30 || me(ctx).body.sleepDebt >= 2)) list.push({ id: 'u:sleep', label: ctx.s.checkpoint >= 7 ? config.sleepLabel ?? 'Поспать полчаса в тепле' : 'Поспать полчаса в тепле', minutes: 0, group: 'u:rest', repeatable: true, effects: [{ sleep: 30 }] });
  return list;
}
