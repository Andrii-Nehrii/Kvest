import { describe, expect, it } from 'vitest';
import { completeCheckpoint } from '../engine/checkpoint';
import { evalCond } from '../engine/conditions';
import type { GameState } from '../engine/types';
import { P, acts, after8, leg, mergeCp, qty } from '../test/arc9kit';
import { point14Available, point15Available } from './chapter3/point14';
import { content as c } from './index';

// Положение реальной пары: КТ9 keep, КТ10 door/barn, КТ11 report/stay.
function after13(guests = 'watch', leo = 'marcus', road = 'walk', forced: Record<string, string> = {}) {
  const b8 = after8('home');
  const s9 = mergeCp(b8, 9, leg(b8, 'A'), leg(b8, 'B'));
  const b9 = completeCheckpoint(c, s9, { A: { c3_new_jens9: 'keep', c3_new_search9b: 'stay' }, B: { c3_new_jens9: 'keep', c3_new_search9a: 'stay' } }).state;
  const s10 = mergeCp(b9, 10, leg(b9, 'A'), leg(b9, 'B'));
  const b10 = completeCheckpoint(c, s10, { A: { c3_new_ole10: 'door', c3_new_nina10: 'barn' }, B: { c3_new_ole10: 'door', c3_new_nina10: 'barn' } }).state;
  const s11 = mergeCp(b10, 11, leg(b10, 'A'), leg(b10, 'B'));
  const b11 = completeCheckpoint(c, s11, { A: { c3_new_report11: 'report', c3_new_home11: 'stay' }, B: { c3_new_report11: 'report', c3_new_home11: 'stay' } }).state;
  const s12 = mergeCp(b11, 12, leg(b11, 'A', forced), leg(b11, 'B', forced));
  const b12 = completeCheckpoint(c, s12, { A: { c3_new_guests12: guests, c3_new_promise12a: 'honest' }, B: { c3_new_guests12: guests, c3_new_promise12b: 'promise' } }).state;
  const s13 = mergeCp(b12, 13, leg(b12, 'A', forced), leg(b12, 'B', forced));
  return completeCheckpoint(c, s13, { A: { c3_new_leo13: leo, c3_new_road13: road }, B: { c3_new_leo13: leo, c3_new_road13: road } }).state;
}
const answer14 = (jens: string, nina: string) => ({ A: { c3_new_jens14: jens, c3_new_nina14: nina }, B: { c3_new_jens14: jens, c3_new_nina14: nina } });

describe('участки 14–15: тачка', () => {
  const b13 = after13();

  it('после КТ13 пары точка 14 доступна обеим линиям, обе доходят до КТ14, карточки — по своей линии', () => {
    for (const p of P) { expect(b13.chars[p].scene).toBe('c14_start'); expect(evalCond({ s: b13, c, pid: p }, point14Available)).toBe(true); }
    const a = leg(b13, 'A'), b = leg(b13, 'B');
    expect(a.vars['A.met.c14_jannes']).toBe(true); expect(a.vars['A.met.c14_ute']).toBeUndefined();
    expect(b.vars['B.met.c14_ute']).toBe(true); expect(b.vars['B.met.c14_jannes']).toBeUndefined();
    for (const x of [a, b]) { expect(x.npcs.c14_ute?.alive).toBe(true); expect(x.npcs.c14_jannes?.alive).toBe(true); }
    for (const k of ['c14_keys', 'c14_van', 'c14_field', 'c14_koehler', 'c14_barn', 'c14_jannes', 'c14_jannes2', 'c14_back', 'c14_dusk', 'c14_rest', 'c14_gun', 'c14_an']) expect(a.vars[`A.${k}`], k).toBeDefined();
    for (const k of ['c14_bk', 'c14_hens', 'c14_bank', 'c14_water', 'c14_chat', 'c14_bu', 'c14_bu2', 'c14_video', 'c14_bvn', 'c14_bd', 'c14_rest', 'c14_letter', 'c14_bn']) expect(b.vars[`B.${k}`], k).toBeDefined();
    // Яйца действительно попадают в общий запас.
    expect(qty(b, 'eggs', 'place', 'c3_farm_stock')).toBeGreaterThan(qty(b13, 'eggs', 'place', 'c3_farm_stock'));
    const s14 = mergeCp(b13, 14, a, b);
    expect(s14.chars.A.time).toBe(s14.chars.B.time);
    const mixed = completeCheckpoint(c, structuredClone(s14) as GameState, { A: { c3_new_jens14: 'give', c3_new_nina14: 'with' }, B: { c3_new_jens14: 'end', c3_new_nina14: 'house' } }).state;
    expect(mixed.vars['w.c14_jens']).toBe('gate'); expect(mixed.vars['w.c14_nina']).toBe('with');
  });

  for (const [jens, nina] of [['give', 'with'], ['give', 'house'], ['end', 'with'], ['end', 'house'], ['gate', 'with'], ['gate', 'house']] as const)
    it(`КТ14 ${jens}/${nina}: обе линии проходят точку 15, миры сходятся, после КТ15 — продолжение`, () => {
      const s14 = mergeCp(b13, 14, leg(b13, 'A'), leg(b13, 'B'));
      const b14 = completeCheckpoint(c, s14, answer14(jens, nina)).state;
      for (const p of P) { expect(b14.chars[p].scene).toBe('c15_start'); expect(evalCond({ s: b14, c, pid: p }, point15Available)).toBe(true); }
      const a = leg(b14, 'A'), b = leg(b14, 'B');
      for (const x of [a, b]) expect(x.npcs.c15_tobias?.alive).toBe(true);
      const s15 = mergeCp(b14, 15, a, b);
      expect(s15.chars.A.time).toBe(s15.chars.B.time);
      const out = completeCheckpoint(c, structuredClone(s15) as GameState, { A: { c3_new_nina15: 'stay', c3_new_garden15: 'help' }, B: { c3_new_nina15: 'winsen', c3_new_garden15: 'tell' } }).state;
      expect(out.vars['w.c15_nina']).toBe('stay'); expect(out.vars['w.c15_garden']).toBe('away');
      for (const p of P) { expect(out.chars[p].scene).toBe('c16_start'); expect(out.chars[p].location).toBe('hof_luedemann'); }
      expect(out.npcs.c7_nina.location).toBe('hof_luedemann');
    });

  it('другие ответы КТ12 и КТ13 тоже ведут в точку 14; Лео на хуторе виден в сценах', () => {
    for (const [guests, leo, road] of [['together', 'farm', 'drive'], ['split', 'drive', 'walk']] as const) {
      const s = after13(guests, leo, road);
      for (const p of P) expect(evalCond({ s, c, pid: p }, point14Available)).toBe(true);
      const a = leg(s, 'A'), b = leg(s, 'B');
      const s14 = mergeCp(s, 14, a, b);
      expect(s14.chars.A.time).toBe(s14.chars.B.time);
    }
  });

  it('КТ15: в Винзен и обратно — бензин тратится один раз, Нина остаётся там', () => {
    const s14 = mergeCp(b13, 14, leg(b13, 'A'), leg(b13, 'B'));
    const b14 = completeCheckpoint(c, s14, answer14('give', 'with')).state;
    const s15 = mergeCp(b14, 15, leg(b14, 'A'), leg(b14, 'B'));
    const fuel = (s: GameState) => Object.values(s.items).find(i => i.type === 'opel_corsa')!.fuel!;
    const out = completeCheckpoint(c, structuredClone(s15) as GameState, { A: { c3_new_nina15: 'winsen', c3_new_garden15: 'away' }, B: { c3_new_nina15: 'winsen', c3_new_garden15: 'away' } }).state;
    expect(out.npcs.c7_nina.location).toBe('c15_winsen');
    for (const p of P) expect(out.chars[p].location).toBe('hof_luedemann');
    expect(fuel(out)).toBeLessThan(fuel(s15)); expect(fuel(s15) - fuel(out)).toBeLessThan(4);
  });

  it('кто в 06:00 ушёл со двора к насыпи, всё равно получает свой завтрак и обед', () => {
    const b8 = after8('home');
    const s9 = mergeCp(b8, 9, leg(b8, 'A'), leg(b8, 'B'));
    const b9 = completeCheckpoint(c, s9, { A: { c3_new_jens9: 'keep', c3_new_search9b: 'stay' }, B: { c3_new_jens9: 'keep', c3_new_search9a: 'stay' } }).state;
    const s10 = mergeCp(b9, 10, leg(b9, 'A'), leg(b9, 'B'));
    const b10 = completeCheckpoint(c, s10, { A: { c3_new_ole10: 'door', c3_new_nina10: 'barn' }, B: { c3_new_ole10: 'door', c3_new_nina10: 'barn' } }).state;
    const s11 = mergeCp(b10, 11, leg(b10, 'A'), leg(b10, 'B'));
    const b11 = completeCheckpoint(c, s11, { A: { c3_new_report11: 'report', c3_new_home11: 'stay' }, B: { c3_new_report11: 'report', c3_new_home11: 'stay' } }).state;
    const s12 = mergeCp(b11, 12, leg(b11, 'A'), leg(b11, 'B'));
    const b12 = completeCheckpoint(c, s12, { A: { c3_new_guests12: 'watch', c3_new_promise12a: 'honest' }, B: { c3_new_guests12: 'watch', c3_new_promise12b: 'promise' } }).state;
    const a = leg(b12, 'A', {}, 'c13_breakfast');
    expect(a.vars['A.c13_a_knows']).toBe(true);
    expect(acts(a, 'A').find(x => x.def.id === 'c13_bf_eat')?.enabled).toBe(true);
    const lunch = leg(b13, 'A', {}, 'c14_lunch');
    expect(acts(lunch, 'A').find(x => x.def.id === 'c14_l_eat')?.enabled).toBe(true);
  });

  it('дневной сон в точке 14 уменьшает недосып; ночь 15 даёт сон обоим', () => {
    const slept = leg(b13, 'A', { c14_a_rest: 'c14_ar_sleep' }, 'c14_a_gun');
    const woke = leg(b13, 'A', { c14_a_rest: 'c14_ar_wood' }, 'c14_a_gun');
    expect(slept.chars.A.body.sleepDebt).toBeLessThan(woke.chars.A.body.sleepDebt);
    const s14 = mergeCp(b13, 14, leg(b13, 'A'), leg(b13, 'B'));
    const b14 = completeCheckpoint(c, s14, answer14('gate', 'with')).state;
    const a = leg(b14, 'A', {}, 'c15_dawn'), b = leg(b14, 'B', {}, 'c15_dawn');
    expect(a.chars.A.time).toBe(b.chars.B.time);
    expect(a.chars.A.body.sleepDebt).toBeLessThan(b14.chars.A.body.sleepDebt + 6);
  });
});
