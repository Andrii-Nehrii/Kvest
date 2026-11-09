import { describe, expect, it } from 'vitest';
import { completeCheckpoint } from '../engine/checkpoint';
import { evalCond } from '../engine/conditions';
import type { GameState } from '../engine/types';
import { P, acts, after8, car, leg, mergeCp, qty } from '../test/arc9kit';
import { point16Available, point17Available } from './chapter3/point16';
import { phone } from '../engine/world';
import { content as c } from './index';

// Положение реальной пары: КТ9 keep, КТ10 door/barn, КТ11 report/stay, КТ12 split, КТ13 drive/walk, КТ14 give/house.
function after14(jens = 'give') {
  const b8 = after8('home');
  const both = (x: Record<string, string>, y: Record<string, string> = x) => ({ A: x, B: y });
  const s9 = mergeCp(b8, 9, leg(b8, 'A'), leg(b8, 'B'));
  const b9 = completeCheckpoint(c, s9, both({ c3_new_jens9: 'keep', c3_new_search9b: 'stay' }, { c3_new_jens9: 'keep', c3_new_search9a: 'stay' })).state;
  const s10 = mergeCp(b9, 10, leg(b9, 'A'), leg(b9, 'B'));
  const b10 = completeCheckpoint(c, s10, both({ c3_new_ole10: 'door', c3_new_nina10: 'barn' })).state;
  const s11 = mergeCp(b10, 11, leg(b10, 'A'), leg(b10, 'B'));
  const b11 = completeCheckpoint(c, s11, both({ c3_new_report11: 'report', c3_new_home11: 'stay' })).state;
  const s12 = mergeCp(b11, 12, leg(b11, 'A'), leg(b11, 'B'));
  const b12 = completeCheckpoint(c, s12, both({ c3_new_guests12: 'split', c3_new_promise12a: 'promise' }, { c3_new_guests12: 'split', c3_new_promise12b: 'promise' })).state;
  const s13 = mergeCp(b12, 13, leg(b12, 'A'), leg(b12, 'B'));
  const b13 = completeCheckpoint(c, s13, both({ c3_new_leo13: 'drive', c3_new_road13: 'walk' })).state;
  const s14 = mergeCp(b13, 14, leg(b13, 'A'), leg(b13, 'B'));
  return completeCheckpoint(c, s14, both({ c3_new_jens14: jens, c3_new_nina14: 'house' })).state;
}
const answer15 = (nina: string, garden: string) => ({ A: { c3_new_nina15: nina, c3_new_garden15: garden }, B: { c3_new_nina15: nina, c3_new_garden15: garden } });
const answer16 = (albers: string, sweep: string) => ({ A: { c3_new_albers16: albers, c3_new_sweep16: sweep }, B: { c3_new_albers16: albers, c3_new_sweep16: sweep } });

describe('участки 16–17: среда', () => {
  const b14 = after14();
  const s15 = mergeCp(b14, 15, leg(b14, 'A'), leg(b14, 'B'));
  const after15 = (nina: string, garden: string) => completeCheckpoint(c, structuredClone(s15) as GameState, answer15(nina, garden)).state;

  for (const [nina, garden] of [['stay', 'help'], ['stay', 'away'], ['stay', 'tell'], ['winsen', 'help'], ['winsen', 'away'], ['winsen', 'tell']] as const)
    it(`КТ15 ${nina}/${garden}: обе линии проходят точку 16, миры сходятся`, () => {
      const b15 = after15(nina, garden);
      for (const p of P) { expect(b15.chars[p].scene).toBe('c16_start'); expect(evalCond({ s: b15, c, pid: p }, point16Available)).toBe(true); }
      const a = leg(b15, 'A', { c16_a_kerem0: 'c16_ak0_stay' }), b = leg(b15, 'B');
      expect(a.vars['A.met.c16_brandt']).toBe(true); expect(b.vars['B.met.c16_brandt']).toBeUndefined();
      expect(a.npcs.c16_brandt?.alive).toBe(true);
      for (const k of ['c16_pl', 'c16_goods', 'c16_road', 'c16_gate', 'c16_route', 'c16_stove', 'c16_ab', 'c16_bell', 'c16_aby', 'c16_mother', 'c16_doc', 'c16_aba', 'c16_ah', 'c16_d', 'c16_to', 'c16_at', 'c16_finished'])
        expect(a.vars[`A.${k}`], k).toBeDefined();
      for (const k of ['c16_pl', 'c16_bh', 'c16_gen', 'c16_bk', 'c16_bk2', 'c16_bj', 'c16_bj2', 'c16_bd', 'c16_d', 'c16_to', 'c16_bt', 'c16_finished'])
        expect(b.vars[`B.${k}`], k).toBeDefined();
      const s16 = mergeCp(b15, 16, a, b);
      expect(s16.chars.A.time).toBe(s16.chars.B.time);
      const mixed = completeCheckpoint(c, structuredClone(s16) as GameState, { A: { c3_new_albers16: 'take', c3_new_sweep16: 'warn' }, B: { c3_new_albers16: 'no', c3_new_sweep16: 'brandt' } }).state;
      expect(mixed.vars['w.c16_albers']).toBe('no'); expect(mixed.vars['w.c16_sweep']).toBe('brandt');
      for (const p of P) expect(mixed.chars[p].scene).toBe('c17_start');
    });

  const b15 = after15('stay', 'help');
  const s16 = mergeCp(b15, 16, leg(b15, 'A'), leg(b15, 'B'));

  for (const [albers, sweep] of [['take', 'warn'], ['take', 'brandt'], ['take', 'stay'], ['no', 'warn'], ['no', 'brandt'], ['no', 'stay']] as const)
    it(`КТ16 ${albers}/${sweep}: обе линии проходят точку 17, после КТ17 — продолжение`, () => {
      const b16 = completeCheckpoint(c, structuredClone(s16) as GameState, answer16(albers, sweep)).state;
      for (const p of P) { expect(b16.chars[p].scene).toBe('c17_start'); expect(evalCond({ s: b16, c, pid: p }, point17Available)).toBe(true); }
      const a = leg(b16, 'A'), b = leg(b16, 'B');
      const s17 = mergeCp(b16, 17, a, b);
      expect(s17.chars.A.time).toBe(s17.chars.B.time);
      for (const [colony, nina] of [['move', 'with'], ['stand', 'home'], ['end', 'with'], ['away', 'home']]) {
        const out = completeCheckpoint(c, structuredClone(s17) as GameState, { A: { c3_new_colony17: colony, c3_new_nina17: nina }, B: { c3_new_colony17: colony, c3_new_nina17: nina } }).state;
        expect(out.vars['w.c17_colony']).toBe(colony); expect(out.vars['w.c17_nina']).toBe(nina);
        for (const p of P) { expect(out.chars[p].scene).toBe('c18_start'); expect(out.chars[p].location).toBe('hof_luedemann'); }
      }
      const mixed = completeCheckpoint(c, structuredClone(s17) as GameState, { A: { c3_new_colony17: 'move', c3_new_nina17: 'with' }, B: { c3_new_colony17: 'end', c3_new_nina17: 'home' } }).state;
      expect(mixed.vars['w.c17_colony']).toBe('away'); expect(mixed.vars['w.c17_nina']).toBe('home');
    });

  it('Нина в Винзене: на КТ17 её можно привезти — бензин тратится один раз, Нина на хуторе', () => {
    const w15 = after15('winsen', 'away');
    const w16 = completeCheckpoint(c, mergeCp(w15, 16, leg(w15, 'A'), leg(w15, 'B', { c16_b_gen2: 'c16_bg2_keep' })), answer16('no', 'stay')).state;
    const s17w = mergeCp(w16, 17, leg(w16, 'A'), leg(w16, 'B'));
    const out = completeCheckpoint(c, structuredClone(s17w) as GameState, { A: { c3_new_colony17: 'away', c3_new_nina17: 'fetch' }, B: { c3_new_colony17: 'away', c3_new_nina17: 'fetch' } }).state;
    expect(out.vars['w.c17_nina']).toBe('fetch');
    expect(out.npcs.c7_nina.location).toBe('hof_luedemann');
    expect(car(s17w).fuel! - car(out).fuel!).toBeGreaterThan(1); expect(car(s17w).fuel! - car(out).fuel!).toBeLessThan(4);
    const split = completeCheckpoint(c, structuredClone(s17w) as GameState, { A: { c3_new_colony17: 'stand', c3_new_nina17: 'fetch' }, B: { c3_new_colony17: 'stand', c3_new_nina17: 'later' } }).state;
    expect(split.vars['w.c17_nina']).toBe('phone');
  });

  it('генератор: бензин из Corsa тратится, вечером телефон B заряжается от сети хутора; без него — нет', () => {
    const withGen = leg(b15, 'B', { c16_b_gen2: 'c16_bg2_siphon' }, 'c16_dinner');
    const noGen = leg(b15, 'B', { c16_b_gen2: 'c16_bg2_keep' }, 'c16_dinner');
    expect(car(b15).fuel! - car(withGen).fuel!).toBeCloseTo(3, 5);
    expect(car(noGen).fuel).toBe(car(b15).fuel);
    const charge = (s: GameState) => phone({ s, c, pid: 'B' })!.charge!;
    expect(charge(withGen)).toBeGreaterThan(charge(noGen));
  });

  it('обмен в деревне: своя картошка уходит, в канистре появляется бензин; браслет — настоящая вещь до Брандта', () => {
    const village = { c16_a_pack: 'c16_ap_potato', c16_a_market: 'c16_am_fuel', c16_a_kerem0: 'c16_ak0_stay', c16_a_boy: 'c16_aby_band' };
    const a = leg(b15, 'A', village, 'c16_a_home');
    expect(qty(a, 'potatoes', 'char', 'A')).toBe(qty(b15, 'potatoes', 'char', 'A') - 3);
    const can = Object.values(a.items).find(i => i.type === 'can_petrol_10' && i.at.kind === 'char')!;
    expect(can.fuel).toBe(2);
    expect(qty(a, 'c16_wristband', 'char', 'A')).toBe(1);
    const b16 = completeCheckpoint(c, mergeCp(b15, 16, leg(b15, 'A', village), leg(b15, 'B')), answer16('no', 'brandt')).state;
    const a17 = leg(b16, 'A', { c17_a_brandt: 'c17_ab_band' });
    expect(a17.vars['A.c17_brandt']).toBe('convinced');
    expect(qty(a17, 'c16_wristband', 'char', 'A')).toBe(0);
    // Еда за общим столом — из пайка, не из воздуха.
    expect(acts(leg(b16, 'B', {}, 'c17_breakfast'), 'B').find(x => x.def.id === 'c17_bf_eat')?.enabled).toBe(true);
  });

  for (const jens of ['end', 'gate'])
    it(`КТ14 ${jens} (Йенса нет): точки 16 и 17 тоже проходятся, без сцен у двенадцатого домика`, () => {
      const x14 = after14(jens);
      const x15 = completeCheckpoint(c, mergeCp(x14, 15, leg(x14, 'A'), leg(x14, 'B')), answer15('stay', 'away')).state;
      for (const p of P) expect(evalCond({ s: x15, c, pid: p }, point16Available)).toBe(true);
      const x16 = completeCheckpoint(c, mergeCp(x15, 16, leg(x15, 'A'), leg(x15, 'B')), answer16('take', 'warn')).state;
      const b = leg(x16, 'B');
      expect(b.vars['B.c17_saw_jens']).toBeUndefined(); expect(b.chars.B.visited.c17_b_jens).toBeUndefined();
      const out = completeCheckpoint(c, mergeCp(x16, 17, leg(x16, 'A'), b), { A: { c3_new_colony17: 'stand', c3_new_nina17: 'home' }, B: { c3_new_colony17: 'stand', c3_new_nina17: 'home' } }).state;
      for (const p of P) expect(out.chars[p].scene).toBe('c18_start');
    });

  it('развилки: у A деревня или трактор, у B хутор или колония; без трактора перевезти колонию нельзя', () => {
    const tractor = leg(b15, 'A', { c16_a_kerem0: 'c16_ak0_go' });
    expect(tractor.vars['w.c16_tractor']).toBe(true); expect(tractor.chars.A.visited.c16_a_brandt).toBeUndefined();
    const village = leg(b15, 'A', { c16_a_kerem0: 'c16_ak0_stay' });
    expect(village.vars['w.c16_tractor']).toBeUndefined(); expect(village.chars.A.visited.c16_a_bell).toBe(1);
    const colonyB = leg(b15, 'B', { c16_b_jannes2: 'c16_bj2_go' });
    expect(colonyB.chars.B.visited.c16_b_cw_ute).toBe(1); expect(colonyB.chars.B.visited.c16_b_bread).toBeUndefined();
    const s16 = mergeCp(b15, 16, village, colonyB);
    const b16 = completeCheckpoint(c, s16, answer16('no', 'stay')).state;
    // A без трактора: утром можно за ним сходить; B — к Брандту с Кёлер или остаться.
    const aT = leg(b16, 'A', { c17_a_choice: 'c17_ach_tractor' }), aF = leg(b16, 'A', { c17_a_choice: 'c17_ach_farm' });
    expect(aT.vars['w.c17_tractor']).toBe(true); expect(aF.vars['A.c17_afb']).toBeDefined();
    const bV = leg(b16, 'B', { c17_b_koehler: 'c17_bk_brandt' }), bF = leg(b16, 'B', { c17_b_koehler: 'c17_bk_stay' });
    expect(bV.vars['B.met.c16_brandt']).toBe(true); expect(bF.chars.B.visited.c17_b_f_msg).toBe(1);
    const noTractor = mergeCp(b16, 17, aF, bF);
    expect(c.joint.c3_new_colony17.options.filter(o => evalCond({ s: noTractor, c, pid: 'A' }, o.when)).map(o => o.id)).not.toContain('move');
    const withTractor = mergeCp(b16, 17, aT, bV);
    expect(c.joint.c3_new_colony17.options.filter(o => evalCond({ s: withTractor, c, pid: 'A' }, o.when)).map(o => o.id)).toContain('move');
    const out = completeCheckpoint(c, withTractor, { A: { c3_new_colony17: 'move', c3_new_nina17: 'home' }, B: { c3_new_colony17: 'move', c3_new_nina17: 'home' } }).state;
    expect(out.vars['w.c17_colony']).toBe('move');
  });
});
