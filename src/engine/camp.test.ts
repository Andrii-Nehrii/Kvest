import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { content as c } from '../content';
import type { Content } from './content-types';
import type { GameState, PlayerId } from './types';
import { availableActions } from './actions';
import { applyEffects } from './effects';
import { play, replaySegment } from './game';
import { mergeNotes, mergeSegments } from './checkpoint';
import { advanceTime } from './simulate';
import { campAvailable, campKey, campWater } from './camp';
import { at } from './time';
import { stateHash } from './rng';
import { giveItem } from './world';

const fixture = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const context = (s: GameState, pid: PlayerId = 'A', content: Content = c) => ({ s, c: content, pid });
function start(): GameState {
  const s = structuredClone(fixture.legs.find(l => l.base.checkpoint === 5)!.base);
  for (const p of ['A', 'B'] as const) {
    const ch = s.chars[p]; ch.location = 'hof_luedemann'; ch.scene = 'c6_r_kitchen'; ch.time = at(12, 13, 26);
    Object.assign(ch.body, { hunger: 60, thirst: 55, fatigue: 50, sleepDebt: 5, consciousness: 'awake' });
    ch.rules.drinkWhenThirsty = false; ch.rules.eatWhenHungry = false;
    s.vars[`${p}.ration.c3_farm`] = 2; s.vars[`${p}.ration.c3_farm.food`] = 1; s.vars[`${p}.ration.c3_farm.water`] = 1;
  }
  s.vars['base.c3_farm.lastDay'] = 2; s.vars['base.c3_farm.cold'] = false;
  return s;
}
const qty = (s: GameState, type: string, owner: string) => Object.values(s.items)
  .filter(i => i.type === type && 'id' in i.at && i.at.id === owner).reduce((n, i) => n + i.qty, 0);
const actions = (s: GameState, p: PlayerId = 'A', content = c) => availableActions(context(s, p, content)).filter(a => a.enabled).map(a => a.def.id);
function erase(s: GameState, filter: (i: GameState['items'][string]) => boolean) {
  for (const i of Object.values(s.items)) if (filter(i)) { i.qty = 0; i.at = { kind: 'gone' }; }
}
function funded(p: PlayerId = 'A') {
  const s = start(); play(c, s, p, ['u:camp_prepare']);
  applyEffects(context(s, p), [{ camp: { kind: 'deliverWater', liters: 10 } }]);
  return s;
}

describe('повседневный уход в участке 6', () => {
  it('личная еда расходуется; четверть единицы даёт четверть сытости', () => {
    const s = start();
    erase(s, i => i.at.kind === 'char' && i.at.id === 'A' && (c.items[i.type].food?.hunger ?? 0) > 0);
    applyEffects(context(s), [{ give: 'bread', qty: 0.25 }]);
    const before = s.chars.A.body.hunger;
    play(c, s, 'A', ['u:eat']);
    expect(qty(s, 'bread', 'A')).toBe(0);
    expect(before - s.chars.A.body.hunger).toBeGreaterThan(6);
    expect(before - s.chars.A.body.hunger).toBeLessThan(8);
  });

  it('выпитая бутылка остаётся пустой и наполняется за счёт настоящих литров', () => {
    const s = funded();
    erase(s, i => i.at.kind === 'char' && i.at.id === 'A' && ((c.items[i.type].food?.thirst ?? 0) > 0 || i.type.startsWith('empty_bottle')));
    applyEffects(context(s), [{ give: 'water_05', qty: 1 }]);
    play(c, s, 'A', ['u:drink']);
    expect(qty(s, 'water_05', 'A')).toBe(0);
    expect(qty(s, 'empty_bottle_05', 'A')).toBe(1);
    const stored = campWater(context(s)), thirst = s.chars.A.body.thirst;
    play(c, s, 'A', ['u:refill:empty_bottle_05']);
    expect(campWater(context(s))).toBeCloseTo(stored); // вода переместилась в бутылку, не прибавилась
    expect(qty(s, 'water_l', 'c3_farm_stock')).toBeCloseTo(9.5);
    expect(qty(s, 'water_05', 'A')).toBe(1);
    expect(qty(s, 'empty_bottle_05', 'A')).toBe(0);
    expect(s.chars.A.body.thirst).toBeGreaterThanOrEqual(thirst);
  });

  it('пустые запасы не позволяют ни поесть, ни попить, ни наполнить бутылку', () => {
    const s = start();
    erase(s, i => !!c.items[i.type].food || c.items[i.type].tags.includes('water_bulk'));
    s.vars['A.ration.c3_farm.food'] = 0;
    applyEffects(context(s), [{ give: 'empty_bottle_05' }]);
    play(c, s, 'A', ['u:camp_prepare']);
    for (const id of ['u:eat', 'u:drink', 'u:camp_meal', 'u:camp_water', 'u:cook_oats', 'u:refill:empty_bottle_05']) expect(actions(s)).not.toContain(id);
    const snapshot = stateHash(s);
    expect(() => play(c, s, 'A', ['u:camp_meal'])).toThrow();
    expect(stateHash(s)).toBe(snapshot);
    s.chars.A.scene = 'c6_r_evening';
    const thirst = s.chars.A.body.thirst;
    play(c, s, 'A', ['c6_r_rest_care']);
    expect(s.chars.A.body.thirst).toBeGreaterThan(thirst);
  });

  it('двое не получают последнюю крупу дважды: выделенные доли и остаток сохраняют массу', () => {
    for (const total of [0.5, 1, 2.5]) {
      const base = start();
      erase(base, i => i.type === 'oats');
      applyEffects(context(base), [{ place: 'oats', qty: total, at: 'c3_farm_stock' }]);
      const A = structuredClone(base), B = structuredClone(base);
      play(c, A, 'A', ['u:camp_prepare']); play(c, B, 'B', ['u:camp_prepare']);
      const merged = mergeSegments(c, base, { A, B });
      expect(qty(merged, 'oats', 'A') + qty(merged, 'oats', 'B') + qty(merged, 'oats', 'c3_farm_stock')).toBeCloseTo(total);
      expect(qty(merged, 'oats', 'A')).toBeCloseTo(qty(merged, 'oats', 'B'));
    }
  });

  it('каша требует крупу и воду, создаёт одну порцию и съедается отдельно', () => {
    const s = funded();
    erase(s, i => i.at.kind === 'char' && i.at.id === 'A' && i.type !== 'oats' && (c.items[i.type].food?.hunger ?? 0) > 0);
    const oats = qty(s, 'oats', 'A'), water = campWater(context(s));
    play(c, s, 'A', ['u:cook_oats']);
    expect(qty(s, 'oats', 'A')).toBeCloseTo(oats - 0.5);
    expect(campWater(context(s))).toBeCloseTo(water - 0.5);
    expect(qty(s, 'c3_porridge', 'A')).toBe(1);
    const hunger = s.chars.A.body.hunger;
    play(c, s, 'A', ['u:eat']);
    expect(qty(s, 'c3_porridge', 'A')).toBe(0);
    expect(hunger - s.chars.A.body.hunger).toBeGreaterThan(18);
  });

  it('уже оплаченный ужин не списывает продукты повторно и не кормит снова в 19:00', () => {
    const s = funded(), before = qty(s, 'oats', 'c3_farm_stock'), hunger = s.chars.A.body.hunger;
    play(c, s, 'A', ['u:camp_meal']);
    expect(qty(s, 'oats', 'c3_farm_stock')).toBe(before);
    expect(hunger - s.chars.A.body.hunger).toBeGreaterThan(18);
    expect(actions(s)).not.toContain('u:camp_meal');
    s.chars.A.time = at(12, 18, 59);
    const h = s.chars.A.body.hunger;
    advanceTime(context(s), 2, 'rest');
    expect(s.chars.A.body.hunger).toBeGreaterThanOrEqual(h);
    expect(s.chars.A.body.hunger - h).toBeLessThan(1);
  });

  it('взятая с собой и отданная порция больше не выдаются владельцу', () => {
    for (const mode of ['pack', 'give', 'return'] as const) {
      const s = funded(), hunger = s.chars.A.body.hunger;
      applyEffects(context(s), [{ camp: { kind: 'meal', mode } }]);
      expect(s.chars.A.body.hunger).toBe(hunger);
      expect(campAvailable(context(s), 'meal')).toBe(false);
      expect(qty(s, 'c3_meal', 'A')).toBe(mode === 'pack' ? 1 : 0);
      expect(qty(s, 'c3_meal', 'c3_farm_stock')).toBe(mode === 'return' ? 1 : 0);
    }
  });

  it('пауэрбанк тратит свой заряд, учитывает остаток и требует кабель', () => {
    const s = start();
    erase(s, i => i.at.kind === 'char' && i.at.id === 'A' && ['powerbank', 'charger'].includes(i.type));
    applyEffects(context(s), [{ give: 'powerbank', charge: 3 }]);
    const ph = Object.values(s.items).find(i => i.type === 'phone' && i.at.kind === 'char' && i.at.id === 'A')!;
    ph.charge = 0;
    expect(actions(s)).not.toContain('u:powerbank');
    applyEffects(context(s), [{ give: 'charger' }]);
    play(c, s, 'A', ['u:powerbank']);
    const bank = Object.values(s.items).find(i => i.type === 'powerbank' && i.qty > 0 && i.at.kind === 'char' && i.at.id === 'A')!;
    expect(bank.charge).toBe(0);
    expect(ph.charge).toBeGreaterThan(5.8); expect(ph.charge).toBeLessThanOrEqual(6);
    expect(actions(s)).not.toContain('u:powerbank');
  });

  it('две зарядки у машины не тратят один и тот же остаток бензина', () => {
    const base = start(), car = Object.values(base.items).find(i => i.type === 'opel_corsa')!;
    car.at = { kind: 'place', id: 'hof_luedemann' }; car.fuel = 0.3;
    for (const i of Object.values(base.items)) if (i.type === 'phone') i.charge = 20;
    const A = structuredClone(base), B = structuredClone(base);
    for (const [s, p] of [[A, 'A'], [B, 'B']] as const) {
      play(c, s, p, ['u:camp_prepare']);
      expect(actions(s, p)).toContain('u:car_charge');
      play(c, s, p, ['u:car_charge']);
      expect(Number(s.vars[campKey(context(s, p), 'carUsed')])).toBeCloseTo(0.15);
      expect(Object.values(s.items).find(i => i.type === 'phone' && i.at.kind === 'char' && i.at.id === p)!.charge).toBeGreaterThan(33);
      expect(actions(s, p)).not.toContain('u:car_charge');
    }
    const merged = mergeSegments(c, base, { A, B });
    expect(Object.values(merged.items).find(i => i.type === 'opel_corsa')!.fuel).toBeCloseTo(0);
  });

  it('отдых и сон меняют усталость, недосып, время и батарею; в тревоге их нет', () => {
    const s = funded(); s.chars.A.scene = 'c6_r_evening';
    const ph = Object.values(s.items).find(i => i.type === 'phone' && i.at.kind === 'char' && i.at.id === 'A')!;
    const fatigue = s.chars.A.body.fatigue, debt = s.chars.A.body.sleepDebt, time = s.chars.A.time, battery = ph.charge!;
    play(c, s, 'A', ['u:sleep']);
    expect(s.chars.A.time - time).toBe(30);
    expect(s.chars.A.body.fatigue).toBeLessThan(fatigue);
    expect(s.chars.A.body.sleepDebt).toBeLessThan(debt);
    expect(ph.charge).toBeLessThan(battery);
    s.chars.A.scene = 'c6_l_a_door';
    for (const id of ['u:sleep', 'u:rest', 'u:car_charge', 'u:cook_oats', 'u:camp_meal']) expect(actions(s)).not.toContain(id);
  });

  it('поиск сети разряжает телефон, а сообщения доступны только при связи', () => {
    const s = start(), offline = { ...c, network: () => ({ voice: false, sms: false, data: false }) };
    const ph = Object.values(s.items).find(i => i.type === 'phone' && i.at.kind === 'char' && i.at.id === 'A')!, battery = ph.charge!;
    expect(actions(s, 'A', offline).some(id => id.startsWith('u:msg:'))).toBe(false);
    const result = play(offline, s, 'A', ['u:signal']);
    expect(ph.charge).toBeLessThan(battery - 0.9);
    expect(result.steps[0].text.join(' ')).toContain('нет соединения');
    const online = { ...c, network: () => ({ voice: true, sms: true, data: false }) };
    const id = actions(s, 'A', online).find(x => x.startsWith('u:msg:'))!;
    play(online, s, 'A', [id]);
    expect(s.messages.some(m => m.from === 'A')).toBe(true);
    ph.charge = 0;
    expect(actions(s, 'A', online)).not.toContain('u:signal');
    expect(actions(s, 'A', online).some(x => x.startsWith('u:msg:'))).toBe(false);
  });

  it('новые повседневные действия воспроизводятся по журналу без расхождения', () => {
    const base = start(), s = structuredClone(base), records = [];
    for (const id of ['u:camp_prepare', 'u:powerbank', 'u:signal', 'u:rest']) {
      records.push({ scene: s.chars.A.scene, plan: [id] }); play(c, s, 'A', [id]);
    }
    expect(stateHash(replaySegment(c, base, 'A', records))).toBe(stateHash(s));
  });
  it('в плане готовка предшествует еде, исходные продукты не дублируются', () => {
    const s = funded();
    erase(s, i => i.at.kind === 'char' && i.at.id === 'A' && i.type !== 'oats' && (c.items[i.type].food?.hunger ?? 0) > 0);
    const oats = qty(s, 'oats', 'A'), hunger = s.chars.A.body.hunger;
    const result = play(c, s, 'A', ['u:cook_oats', 'u:eat']);
    expect(result.steps).toHaveLength(2);
    expect(qty(s, 'oats', 'A')).toBeCloseTo(oats - 0.5);
    expect(qty(s, 'c3_porridge', 'A')).toBe(0);
    expect(s.chars.A.body.hunger).toBeLessThan(hunger - 15);
  });
  it('отложенную партнёру воду нельзя выпить со своего телефона', () => {
    const s = start();
    erase(s, i => c.items[i.type].tags.includes('drink') || c.items[i.type].tags.includes('water_bulk'));
    giveItem(context(s, 'B'), 'water_l', 10, { reservedFor: 'B' }, { kind: 'place', id: 'c3_farm_stock' });
    expect(campWater(context(s, 'A'))).toBe(0);
    expect(campWater(context(s, 'B'))).toBe(10);
    expect(actions(s, 'A')).not.toContain('u:camp_water');
  });
  it('принесённая вода не создаётся второй раз на контрольной точке', () => {
    const base = start();
    erase(base, i => c.items[i.type].tags.includes('water_bulk'));
    const A = structuredClone(base), B = structuredClone(base);
    for (const [s, p] of [[A, 'A'], [B, 'B']] as const) {
      s.vars[`${p}.c6_r_water`] = true;
      play(c, s, p, ['u:camp_prepare']);
      play(c, s, p, ['u:camp_water']);
    }
    const merged = mergeSegments(c, base, { A, B });
    expect(qty(merged, 'water_l', 'c3_farm_stock')).toBeCloseTo(19);
    mergeNotes(c, merged, 6); mergeNotes(c, merged, 6);
    expect(qty(merged, 'water_l', 'c3_farm_stock')).toBeCloseTo(19);
  });
  it('взятую с собой порцию можно передать, но нельзя одновременно оставить себе', () => {
    const s = funded();
    applyEffects(context(s), [{ camp: { kind: 'meal', mode: 'pack' } }]);
    const water = campWater(context(s)), hunger = s.chars.A.body.hunger;
    expect(campAvailable(context(s), 'portion')).toBe(true);
    applyEffects(context(s), [{ camp: { kind: 'meal', mode: 'give' } }]);
    expect(qty(s, 'c3_meal', 'A')).toBe(0);
    expect(campWater(context(s))).toBe(water);
    expect(s.chars.A.body.hunger).toBe(hunger);
    expect(campAvailable(context(s), 'portion')).toBe(false);
  });
  it('новый уход не даёт удалённого доступа к складу и не меняет прошлые точки', () => {
    for (const variant of ['before', 'elsewhere'] as const) {
      const s = start();
      if (variant === 'before') s.checkpoint = 4;
      else s.chars.A.location = 'b_flat';
      const before = stateHash(s);
      applyEffects(context(s), [{ camp: { kind: 'prepare' } }]);
      expect(stateHash(s)).toBe(before);
      expect(actions(s)).not.toContain('u:camp_prepare');
    }
  });
});
