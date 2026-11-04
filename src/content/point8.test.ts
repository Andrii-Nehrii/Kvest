import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { completeCheckpoint, mergeNotes, mergeSegments, optionsFor, resolveJoint, syncClocks } from '../engine/checkpoint';
import { play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { giveItem, phone } from '../engine/world';
import { knownNpc } from '../ui/format';
import { knownContacts } from '../ui/people';
import { content as c } from './index';

const P = ['A', 'B'] as const;
const fixture = JSON.parse(readFileSync(new URL('./fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const ctx = (s: GameState, pid: PlayerId = 'A') => ({ s, c, pid });
const qty = (s: GameState, type: string, kind?: string, id?: string) => Object.values(s.items)
  .filter(i => i.qty > 0 && i.type === type && (!kind || (i.at.kind === kind && 'id' in i.at && i.at.id === id)))
  .reduce((sum, i) => sum + i.qty, 0);
const acts = (s: GameState, pid: PlayerId) => availableActions(ctx(s, pid));
function start() {
  const s = structuredClone(fixture.legs.find(x => x.base.checkpoint === 5)!.base);
  s.checkpoint = 7;
  Object.assign(s.vars, { 'w.together': true, 'w.c7_departure': 'car', 'w.c7_jens': 'quieted', 'w.c7_new_story': true,
    'w.farm_welcome': true, 'w.c7_nina_shared': true });
  for (const p of P) {
    s.chars[p].time = at(13, 8, 17); s.chars[p].location = 'c7_farm_lane'; s.chars[p].scene = 'c8_start';
    Object.assign(s.chars[p].body, { hunger: 20, thirst: 30, fatigue: 5, sleepDebt: p === 'B' ? 6 : 1, coreTemp: 36.9 });
  }
  for (const [id, n] of Object.entries(s.npcs)) n.agendaDone = c.npcs[id].agenda.map(a => a.id);
  for (const e of c.events) for (const p of P) s.firedEvents[e.scope === 'world' ? e.id + '@' + p : e.id] = e.at;
  s.npcs.pawel.location = 'c7_farm_lane'; s.npcs.henrike.location = 'hof_luedemann';
  const car = Object.values(s.items).find(i => i.type === 'opel_corsa')!;
  car.at = { kind: 'place', id: 'c7_farm_lane' }; car.fuel = 12.55;
  if (!qty(s, 'car_keys', 'char', 'A')) giveItem(ctx(s), 'car_keys', 1);
  giveItem(ctx(s), 'water_05', 3);
  giveItem(ctx(s), 'towel', 1);
  giveItem(ctx(s, 'B'), 'bandages', 1);
  giveItem(ctx(s), 'c7_jens_note', 1, {}, { kind: 'npc', id: 'pawel' });
  return s;
}
function leg(base: GameState, pid: PlayerId, forced: Record<string, string> = {}, until?: string) {
  const s = structuredClone(base), records: ActionRecord[] = [];
  while (!segmentFinished(c, s, pid) && s.chars[pid].scene !== until && records.length < 100) {
    const scene = s.chars[pid].scene, choices = acts(s, pid).filter(a => a.enabled && !a.universal && a.def.terminal);
    const action = forced[scene] ?? choices[0]?.def.id;
    expect(action, scene).toBeTruthy();
    expect(acts(s, pid).some(a => a.enabled && a.def.id === action), scene + ': ' + action).toBe(true);
    records.push({ scene, plan: [action] }); play(c, s, pid, [action]);
  }
  expect(stateHash(replaySegment(c, base, pid, records))).toBe(stateHash(s));
  if (!until) expect(segmentFinished(c, s, pid)).toBe('checkpoint');
  return s;
}
function merged(base = start(), a: Record<string, string> = {}, b: Record<string, string> = {}) {
  const s = mergeSegments(c, base, { A: leg(base, 'A', a), B: leg(base, 'B', b) });
  syncClocks(c, s, c.checkpoints.find(x => x.index === 8)!.syncNotBefore); mergeNotes(c, s, 8);
  return s;
}
const answer = (a: string, b = a) => ({ A: { c3_new_route8: a }, B: { c3_new_route8: b } });

describe('новый участок 8', () => {
  it('новый вход не исполняет эффектов над подписанной базой; люди появляются после личного знакомства', () => {
    const s = start(), before = stateHash(s);
    expect(c.scenes.c8_start.onEnter).toBeUndefined(); expect(c.scenes.c8_start.location).toBeUndefined();
    expect(acts(s, 'A').some(a => a.enabled && a.def.id === 'c8_begin')).toBe(true);
    expect(stateHash(s)).toBe(before); expect(s.npcs.c8_ruth).toBeUndefined();
    play(c, s, 'A', ['c8_begin']);
    expect(knownNpc(s.npcs.c8_ruth, 'A', s.vars)).toBe(true);
    expect(knownNpc(s.npcs.c8_ruth, 'B', s.vars)).toBe(false);
    expect(s.npcs.c8_helmut).toBeUndefined();
    expect(knownContacts(ctx(s)).some(x => x.id === 'c8_helmut')).toBe(true);
  });

  it('судьба Хельмута не раскрывается B до состоявшегося общего разговора', () => {
    const base = start(), a = leg(base, 'A', {}, 'c8_a_wallet'), b = leg(base, 'B', {}, 'c8_together');
    expect(a.npcs.c8_helmut.alive).toBe(false); expect(b.npcs.c8_helmut).toBeUndefined();
    expect(knownContacts(ctx(b, 'B')).map(x => x.id)).toContain('c8_helmut');
    play(c, b, 'B', ['c8_share_plain']);
    expect(b.npcs.c8_helmut.status).toBe('dead');
    expect(knownNpc(b.npcs.c8_helmut, 'B', b.vars)).toBe(true);
    expect(knownContacts(ctx(b, 'B')).map(x => x.id)).not.toContain('c8_helmut');
  });

  it('обе линии без вопросов доходят до точки и точно воспроизводятся при разных способах поиска и помощи', () => {
    const base = start();
    for (const far of [false, true]) for (const stay of [false, true]) {
      const a = leg(base, 'A', far ? { c8_a_bridge: 'c8_a_bridge_bank', c8_a_well: 'c8_a_well_distance', c8_a_still: 'c8_a_check_wait', c8_a_identity: 'c8_a_identity_report' } : {});
      const b = leg(base, 'B', {
        c8_b_outside: stay ? 'c8_b_coat_no' : 'c8_b_coat_borrow',
        c8_b_rest: stay ? 'c8_b_rest_no' : 'c8_b_rest_sleep',
        c8_farewell: stay ? 'c8_farewell_retract' : 'c8_farewell_walk',
      });
      expect(a.npcs.c8_helmut.alive).toBe(false); expect(b.npcs.c8_helmut.alive).toBe(false);
      expect(a.chars.A.body.coreTemp).toBeGreaterThanOrEqual(36);
      expect(b.chars.B.body.coreTemp).toBeGreaterThanOrEqual(36);
    }
  });

  it('две порции действительно съедены из одного запаса, бутылки опустели; чужие вещи не дублируются', () => {
    const base = start(), a = leg(base, 'A'), b = leg(base, 'B');
    const beforeMeal = leg(base, 'B', {}, 'c8_meal'), h = beforeMeal.chars.B.body.hunger, t = beforeMeal.chars.B.body.thirst;
    play(c, beforeMeal, 'B', ['c8_meal_eat']);
    expect(beforeMeal.chars.B.body.hunger).toBeLessThan(h);
    expect(beforeMeal.chars.B.body.thirst).toBeLessThan(t);
    expect(qty(beforeMeal, 'empty_bottle_05', 'char', 'B')).toBeGreaterThan(0);
    const s = mergeSegments(c, base, { A: a, B: b });
    expect(qty(s, 'c8_roll')).toBe(4); expect(qty(s, 'c8_roll', 'npc', 'c8_ruth')).toBe(4);
    expect(qty(s, 'water_05', 'npc', 'c8_ruth')).toBe(1);
    expect(qty(s, 'c8_helmut_wallet')).toBe(1); expect(qty(s, 'c8_helmut_wallet', 'npc', 'c8_eva')).toBe(1);
    expect(qty(s, 'c8_helmut_coat')).toBe(1); expect(qty(s, 'c8_helmut_coat', 'npc', 'c8_helmut')).toBe(1);
  });

  it('упакованные порции остаются личными; повторный просмотр/появление NPC не возвращает запас', () => {
    const s = merged(start(), { c8_meal: 'c8_meal_pack' }, { c8_meal: 'c8_meal_pack' });
    expect(qty(s, 'c8_roll', 'npc', 'c8_ruth')).toBe(4);
    expect(qty(s, 'c8_roll', 'char', 'A')).toBe(1); expect(qty(s, 'c8_roll', 'char', 'B')).toBe(1);
    expect(qty(s, 'c8_roll')).toBe(6);
    const at = s.chars.A.time, hash = stateHash(s); mergeNotes(c, s, 8);
    expect(s.chars.A.time).toBe(at); expect(stateHash(s)).toBe(hash);
  });

  it('общий выбор возвращает обоих и машину, тратит бензин один раз и сохраняет дом', () => {
    const s = merged(), car = Object.values(s.items).find(i => i.type === 'opel_corsa')!, fuel = car.fuel!, time = s.chars.A.time;
    const out = completeCheckpoint(c, s, answer('home')).state;
    expect(out.checkpoint).toBe(8);
    for (const p of P) { expect(out.chars[p].scene).toBe('c9_start'); expect(out.chars[p].location).toBe('hof_luedemann'); expect(out.chars[p].time).toBe(time + 20); }
    expect(out.items[car.id].fuel).toBeCloseTo(fuel - 0.26);
    expect(out.items[car.id].at).toEqual({ kind: 'place', id: 'hof_luedemann' });
    expect(out.vars['w.farm_welcome']).toBe(true); expect(out.vars['w.c8_home_kept']).toBe(true);
    expect(out.npcs.henrike.vars.c8_place_kept).toBe(true);
    expect(out.npcs.pawel.location).toBe('c8_bus_east');
  });

  it('все пары ответов: разногласие не увозит партнёра, пеший возврат оставляет машину, восточный путь расходует своё топливо', () => {
    const s = merged(), id = 'c3_new_route8', car = Object.values(s.items).find(i => i.type === 'opel_corsa')!;
    expect(optionsFor(c, s, c.joint[id], 'A').map(o => o.id)).toEqual(['home', 'home_foot', 'east', 'stay']);
    for (const a of optionsFor(c, s, c.joint[id], 'A')) for (const b of optionsFor(c, s, c.joint[id], 'B')) {
      const out = completeCheckpoint(c, structuredClone(s), answer(a.id, b.id)).state;
      expect(out.chars.A.time).toBe(out.chars.B.time);
      const agreed = a.id === b.id ? a.id : 'stay';
      expect(out.vars['w.c8_direction']).toBe(agreed);
      expect(out.vars['w.c8_home_kept']).toBe(true);
      if (agreed === 'home_foot') {
        expect(out.chars.A.location).toBe('hof_luedemann'); expect(out.items[car.id].at).toEqual({ kind: 'place', id: 'c7_farm_lane' });
        expect(out.items[car.id].fuel).toBe(car.fuel); expect(out.chars.A.time).toBeGreaterThanOrEqual(s.chars.A.time + 55);
      } else if (agreed === 'east') {
        expect(out.chars.A.location).toBe('c8_east_road'); expect(out.items[car.id].fuel).toBeCloseTo(car.fuel! - 0.64);
        expect(out.npcs.pawel.location).not.toBe(out.chars.A.location);
        expect(out.npcs.c8_ruth.location).not.toBe(out.chars.A.location);
      } else if (agreed === 'stay') {
        expect(out.chars.A.location).toBe('c7_farm_lane'); expect(out.items[car.id].fuel).toBe(car.fuel);
      }
    }
  });

  it('нет ключа, машины или бензина — автомобильная поездка невозможна, остаётся пеший путь', () => {
    for (const missing of ['key', 'car', 'fuel']) {
      const s = merged(), car = Object.values(s.items).find(i => i.type === 'opel_corsa')!;
      if (missing === 'key') for (const i of Object.values(s.items)) if (i.type === 'car_keys') { i.at = { kind: 'gone' }; i.qty = 0; }
      if (missing === 'car') car.at = { kind: 'place', id: 'hof_luedemann' };
      if (missing === 'fuel') car.fuel = 0;
      if (optionsFor(c, s, c.joint.c3_new_route8, 'A').some(o => o.id === 'home'))
        expect(resolveJoint(c, s, 'c3_new_route8', { A: 'home', B: 'home' }).applied).toEqual(['stay']);
      else expect(optionsFor(c, s, c.joint.c3_new_route8, 'A').map(o => o.id)).not.toContain('home');
      expect(s.chars.A.location).toBe('c7_farm_lane');
      expect(optionsFor(c, s, c.joint.c3_new_route8, 'B').map(o => o.id)).toContain('home_foot');
    }
  });

  it('при пешем выходе из КТ7 машина остаётся на хуторе: нет ложного вождения, обе линии проходят точку', () => {
    const base = start(), car = Object.values(base.items).find(i => i.type === 'opel_corsa')!;
    base.vars['w.c7_departure'] = 'walk'; car.at = { kind: 'place', id: 'hof_luedemann' };
    const a = leg(base, 'A', {}, 'c8_a_park');
    expect(acts(a, 'A').filter(x => x.enabled).map(x => x.def.id)).not.toContain('c8_a_park_push');
    const s = merged(base);
    expect(optionsFor(c, s, c.joint.c3_new_route8, 'A').map(o => o.id)).toEqual(['home_foot', 'stay']);
    const out = completeCheckpoint(c, s, answer('home_foot')).state;
    expect(out.chars.A.location).toBe('hof_luedemann'); expect(out.chars.B.location).toBe('hof_luedemann');
    expect(out.items[car.id].at).toEqual(car.at); expect(out.items[car.id].fuel).toBe(car.fuel);
  });

  it('после необратимого исхода КТ7 отправляемое сообщение Нине не называет Йенса живым', () => {
    const base = start(); base.vars['w.c7_jens'] = 'dead';
    const b = leg(base, 'B', {}, 'c8_b_nina');
    const phoneItem = phone(ctx(b, 'B'))!;
    phoneItem.charge = 90;
    // Задаём доступное SMS-окно; предметы и доступность телефона остаются настоящими.
    const sms = { ...c, network: () => ({ voice: false, sms: true, data: false }) };
    const choice = availableActions({ s: b, c: sms, pid: 'B' }).find(a => a.def.id === 'c8_b_nina_send')!;
    expect(choice.enabled).toBe(true);
    const out = play(sms, b, 'B', [choice.def.id]);
    expect(out.steps.flatMap(s => s.text).join(' ')).toContain('Йенс погиб');
    expect(b.vars['B.c8_nina']).toBe('sent');
    expect(phoneItem.charge).toBeLessThan(90);
  });

  it('сон уменьшает реальный недосып, а пальто действительно переходит к B и возвращается', () => {
    const base = start(), b = leg(base, 'B', {}, 'c8_b_rest');
    expect(qty(b, 'c8_helmut_coat', 'char', 'B')).toBe(1);
    expect(qty(b, 'c8_helmut_coat', 'npc', 'c8_eva')).toBe(0);
    const debt = b.chars.B.body.sleepDebt, time = b.chars.B.time;
    play(c, b, 'B', ['c8_b_rest_sleep']);
    expect(b.chars.B.body.sleepDebt).toBeLessThan(debt); expect(b.chars.B.time).toBe(time + 20);
    const end = leg(base, 'B'); expect(qty(end, 'c8_helmut_coat', 'char', 'B')).toBe(0);
  });

  it('автозарядка в обратной поездке соблюдает правило и кабель, не трогает пауэрбанк', () => {
    const source = merged();
    let bankBaseline: unknown;
    for (const enabled of [true, false]) for (const cable of [true, false]) {
      const s = structuredClone(source);
      for (const p of P) {
        s.chars[p].rules.chargePhoneWhenFreePower = enabled;
        const ph = phone(ctx(s, p)); expect(ph).toBeDefined(); ph!.charge = 20;
        for (const i of Object.values(s.items)) if (i.at.kind === 'char' && i.at.id === p && c.items[i.type].tags.includes('charger')) { i.qty = 0; i.at = { kind: 'gone' }; }
        if (cable) giveItem(ctx(s, p), 'charger', 1);
      }
      const out = completeCheckpoint(c, s, answer('home')).state;
      for (const p of P) expect(phone(ctx(out, p))!.charge! > 20).toBe(enabled && cable);
      const banks = Object.values(out.items).filter(i => c.items[i.type].tags.includes('powerbank')).map(i => [i.id, i.charge]);
      if (!bankBaseline) bankBaseline = banks;
      expect(banks).toEqual(bankBaseline);
    }
  });
});
