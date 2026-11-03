import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { content as c } from '../content';
import { applyEffects } from './effects';
import { fuelNeeded } from './base';
import { stateHash } from './rng';
import { giveItem } from './world';
import type { GameState, PlayerId } from './types';
import { at } from './time';

const fixture = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const ctx = (s: GameState, pid: PlayerId = 'A') => ({ s, c, pid });
function start() {
  const s = structuredClone(fixture.legs.find(l => l.base.checkpoint === 5)!.base);
  s.checkpoint = 6; s.vars['w.together'] = true; s.vars['w.c7_new_story'] = true;
  s.npcs.pawel.location = 'hof_luedemann';
  for (const p of ['A', 'B'] as const) {
    const ch = s.chars[p]; ch.time = at(13, 6); ch.scene = 'c6_r_kitchen'; ch.location = 'hof_luedemann';
    Object.assign(ch.body, { hunger: 10, thirst: 10, fatigue: 60, sleepDebt: 5, consciousness: 'awake' });
    ch.rules.eatWhenHungry = false; ch.rules.drinkWhenThirsty = false; ch.rules.chargePhoneWhenFreePower = true;
  }
  return s;
}
const phone = (s: GameState, p: PlayerId) => Object.values(s.items).find(i => i.qty > 0 && i.type === 'phone' && i.at.kind === 'char' && i.at.id === p)!;
const qty = (s: GameState, type: string, kind: string, id: string) => Object.values(s.items).filter(i => i.qty > 0 && i.type === type && i.at.kind === kind && 'id' in i.at && i.at.id === id).reduce((n, i) => n + i.qty, 0);

describe('механики нового участка без изменения старых точек', () => {
  it('сон до часа восстанавливает недосып и двигает время; поздний приход часы не отматывает', () => {
    const s = start(), before = s.chars.A.body.sleepDebt, t = s.chars.A.time;
    applyEffects(ctx(s), [{ restUntil: t + 90, sleeping: true }]);
    expect(s.chars.A.time).toBe(t + 90);
    expect(s.chars.A.body.sleepDebt).toBeLessThan(before);
    const hash = stateHash(s);
    applyEffects(ctx(s), [{ restUntil: t + 30, sleeping: true }]);
    expect(stateHash(s)).toBe(hash);
  });

  it('передача расходует свой предмет и перемещает его к получателю, не кормит дарителя', () => {
    const s = start(); giveItem(ctx(s), 'c3_meal', 1);
    const hunger = s.chars.A.body.hunger;
    applyEffects(ctx(s), [{ handOver: 'c3_meal', toNpc: 'pawel' }]);
    expect(qty(s, 'c3_meal', 'char', 'A')).toBe(0);
    expect(qty(s, 'c3_meal', 'npc', 'pawel')).toBe(1);
    expect(s.chars.A.body.hunger).toBe(hunger);
    const hash = stateHash(s);
    expect(applyEffects(ctx(s), [{ handOver: 'c3_meal', toNpc: 'pawel' }]).interrupted).toBe(true);
    expect(stateHash(s)).toBe(hash);
  });

  it('отсутствующему или погибшему человеку нельзя отдать вещь', () => {
    for (const gone of [true, false]) {
      const s = start(); giveItem(ctx(s), 'c3_meal', 1);
      if (gone) s.npcs.pawel.location = 'farm_coop'; else s.npcs.pawel.alive = false;
      const hash = stateHash(s);
      expect(applyEffects(ctx(s), [{ handOver: 'c3_meal', toNpc: 'pawel' }]).interrupted).toBe(true);
      expect(stateHash(s)).toBe(hash);
    }
  });

  it('общая работа проходит за одно и то же время для обоих; адресное последствие получает указанный человек', () => {
    const s = start(), t = s.chars.A.time;
    const stress = s.chars.A.body.stress;
    s.chars.B.body.stress = 20;
    applyEffects(ctx(s), [{ waitTogether: 12 }]);
    expect(s.chars.A.time).toBe(t + 12);
    expect(s.chars.B.time).toBe(t + 12);
    const partnerStress = s.chars.B.body.stress;
    applyEffects(ctx(s), [{ body: 'stress', delta: 10, target: '@partner' }]);
    expect(s.chars.B.body.stress).toBe(partnerStress + 10);
    expect(s.chars.A.body.stress).toBeLessThanOrEqual(stress);
  });

  it('общая поездка тратит один бак, двигает обоих и заряжает только телефоны с правилом и кабелем', () => {
    const to = c.locations.c7_farm_lane ? 'c7_farm_lane' : 'b75_road';
    for (const enabled of [true, false]) for (const cable of [true, false]) {
      const s = start();
      for (const i of Object.values(s.items)) if (i.type === 'opel_corsa') { i.qty = 0; i.at = { kind: 'gone' }; }
      const car = giveItem(ctx(s), 'opel_corsa', 1, { fuel: 2 }, { kind: 'place', id: 'hof_luedemann' });
      if (!qty(s, 'car_keys', 'char', 'A')) giveItem(ctx(s), 'car_keys', 1);
      s.chars.B.rules.chargePhoneWhenFreePower = enabled;
      if (!cable) for (const i of Object.values(s.items)) if (i.type === 'charger' && i.at.kind === 'char' && i.at.id === 'B') { i.qty = 0; i.at = { kind: 'gone' }; }
      phone(s, 'A').charge = 40; phone(s, 'B').charge = 40;
      const t = s.chars.A.time;
      expect(applyEffects(ctx(s), [{ journey: { to, km: 4, minutes: 20, vehicle: 'opel_corsa' } }]).interrupted).toBe(false);
      expect(car.fuel).toBeCloseTo(2 - fuelNeeded(ctx(s), 'opel_corsa', 4));
      expect(s.chars.A.location).toBe(to); expect(s.chars.B.location).toBe(to);
      expect(s.chars.A.time).toBe(t + 20); expect(s.chars.B.time).toBe(t + 20);
      expect(phone(s, 'A').charge).toBeGreaterThan(40);
      expect(phone(s, 'B').charge! > 40).toBe(enabled && cable);
    }
  });

  it('без горючего/ключа/совместного места поездка никого не переносит и не тратит остаток', () => {
    for (const reason of ['fuel', 'key', 'apart'] as const) {
      const s = start();
      for (const i of Object.values(s.items)) if (i.type === 'opel_corsa') { i.qty = 0; i.at = { kind: 'gone' }; }
      giveItem(ctx(s), 'opel_corsa', 1, { fuel: reason === 'fuel' ? 0.1 : 2 }, { kind: 'place', id: 'hof_luedemann' });
      if (reason === 'key') for (const i of Object.values(s.items)) if (i.type === 'car_keys') { i.qty = 0; i.at = { kind: 'gone' }; }
      if (reason === 'apart') s.chars.B.location = 'farm_coop';
      const hash = stateHash(s);
      expect(applyEffects(ctx(s), [{ journey: { to: 'b75_road', km: 4, minutes: 20, vehicle: 'opel_corsa' } }]).interrupted).toBe(true);
      expect(stateHash(s)).toBe(hash);
    }
  });

  it('пешая дорога занимает время и силы обоих, сохраняя машину и топливо', () => {
    const s = start(), t = s.chars.A.time;
    const cars = JSON.stringify(Object.values(s.items).filter(i => i.type === 'opel_corsa'));
    const tired = s.chars.B.body.fatigue;
    applyEffects(ctx(s), [{ journey: { to: 'b75_road', km: 4, minutes: 55 } }]);
    expect(s.chars.A.time).toBe(s.chars.B.time);
    expect(s.chars.A.time - t).toBeGreaterThanOrEqual(55);
    expect(s.chars.B.body.fatigue).toBeGreaterThan(tired);
    expect(JSON.stringify(Object.values(s.items).filter(i => i.type === 'opel_corsa'))).toBe(cars);
  });

  it('новые операции не меняют старый участок', () => {
    const s = start(); s.checkpoint = 5;
    const hash = stateHash(s);
    applyEffects(ctx(s), [{ restUntil: s.chars.A.time + 90 }, { waitTogether: 12 }, { body: 'stress', delta: 10, target: 'B' }, { handOver: 'water_05', toNpc: 'pawel' }, { journey: { to: 'b75_road', km: 4, minutes: 20 } }]);
    expect(stateHash(s)).toBe(hash);
  });
});
