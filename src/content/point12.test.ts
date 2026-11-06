import { describe, expect, it } from 'vitest';
import { completeCheckpoint } from '../engine/checkpoint';
import type { GameState } from '../engine/types';
import { P, after8, leg, mergeCp, qty } from '../test/arc9kit';
import { content as c } from './index';

// Положение реальной пары: оба остались на хуторе, Йенс в кабине, КТ10 door/barn.
function after11(report: string, home: string, ole = 'door') {
  const b8 = after8('home');
  const s9 = mergeCp(b8, 9, leg(b8, 'A'), leg(b8, 'B'));
  const b9 = completeCheckpoint(c, s9, { A: { c3_new_jens9: 'keep', c3_new_search9b: 'stay' }, B: { c3_new_jens9: 'keep', c3_new_search9a: 'stay' } }).state;
  const s10 = mergeCp(b9, 10, leg(b9, 'A'), leg(b9, 'B'));
  const b10 = completeCheckpoint(c, s10, { A: { c3_new_ole10: ole, c3_new_nina10: 'barn' }, B: { c3_new_ole10: ole, c3_new_nina10: 'barn' } }).state;
  const s11 = mergeCp(b10, 11, leg(b10, 'A'), leg(b10, 'B'));
  return completeCheckpoint(c, s11, { A: { c3_new_report11: report, c3_new_home11: home }, B: { c3_new_report11: report, c3_new_home11: home } }).state;
}
function after12(base: GameState, guests: string, pa = 'promise', pb = 'promise', forcedA = {}, forcedB = {}) {
  const s = mergeCp(base, 12, leg(base, 'A', forcedA), leg(base, 'B', forcedB));
  return completeCheckpoint(c, s, { A: { c3_new_guests12: guests, c3_new_promise12a: pa }, B: { c3_new_guests12: guests, c3_new_promise12b: pb } }).state;
}

describe('участки 12–13: чужие с насыпи', () => {
  for (const [report, home, ole] of [['report', 'stay', 'door'], ['secret', 'apart', 'door'], ['family', 'leave', 'door'], ['family', 'apart', 'sleep'], ['secret', 'stay', 'coop']] as [string, string, string][])
    it(`КТ11 ${report}/${home}, ночь ${ole}: обе линии проходят 12 и 13, миры сходятся`, () => {
      const b11 = after11(report, home, ole);
      for (const p of P) expect(b11.chars[p].scene).toBe('c12_start');
      const a12 = leg(b11, 'A'), b12 = leg(b11, 'B');
      for (const [x, p] of [[a12, 'A'], [b12, 'B']] as const) {
        expect(x.npcs.c12_marcus?.alive).toBe(true); expect(x.npcs.c12_leo?.alive).toBe(true);
        expect(x.vars[`${p}.met.c12_marcus`]).toBe(true); expect(x.vars[`${p}.met.c12_leo`]).toBe(true);
        expect(x.npcs.ole.location).toBe('hof_luedemann');
      }
      const s12 = mergeCp(b11, 12, a12, b12);
      expect(s12.chars.A.time).toBe(s12.chars.B.time);
      const b12s = completeCheckpoint(c, structuredClone(s12) as GameState, { A: { c3_new_guests12: 'together', c3_new_promise12a: 'honest' }, B: { c3_new_guests12: 'split', c3_new_promise12b: 'promise' } }).state;
      expect(b12s.vars['w.c12_guests']).toBe('watch'); expect(b12s.vars['w.c12_promise_A']).toBe('honest'); expect(b12s.vars['w.c12_promise_B']).toBe('promise');
      for (const p of P) expect(b12s.chars[p].scene).toBe('c13_start');
      const a13 = leg(b12s, 'A'), b13 = leg(b12s, 'B');
      for (const x of [a13, b13]) expect(x.npcs.c12_marcus.vars.c13_cleared).toBe(true);
      if (report === 'report' && ole !== 'sleep') for (const x of [a13, b13]) { expect(x.npcs.ole.location).toBe('c13_sammel'); expect(x.npcs.henrike.location).toBe('c13_sammel'); }
      if (ole === 'sleep') for (const x of [a13, b13]) expect(x.npcs.henrike.location).toBe('c13_sammel');
      const s13 = mergeCp(b12s, 13, a13, b13);
      expect(s13.chars.A.time).toBe(s13.chars.B.time);
      const out = completeCheckpoint(c, structuredClone(s13) as GameState, { A: { c3_new_leo13: 'drive', c3_new_road13: 'drive' }, B: { c3_new_leo13: 'farm', c3_new_road13: 'go' } }).state;
      expect(out.vars['w.c13_leo']).toBe('marcus'); expect(out.vars['w.c13_road']).toBe('drive');
      for (const p of P) { expect(out.chars[p].scene).toBe('c14_start'); expect(out.chars[p].location).toBe('hof_luedemann'); }
      expect(out.npcs.deniz.location).toBe('deniz_workshop'); expect(out.npcs.c12_leo.location).toBe('c8_east_road');
    });

  it('КТ13: поездка в Йестебург и обратно тратит бензин один раз; отъезд насовсем переносит пару', () => {
    const b12 = after12(after11('family', 'stay'), 'together');
    const s13 = mergeCp(b12, 13, leg(b12, 'A'), leg(b12, 'B'));
    const fuel = (s: GameState) => Object.values(s.items).find(i => i.type === 'opel_corsa')!.fuel!;
    const drove = completeCheckpoint(c, structuredClone(s13) as GameState, { A: { c3_new_leo13: 'drive', c3_new_road13: 'walk' }, B: { c3_new_leo13: 'drive', c3_new_road13: 'walk' } }).state;
    expect(drove.npcs.c12_leo.location).toBe('c13_sammel'); expect(drove.chars.A.location).toBe('hof_luedemann');
    expect(fuel(drove)).toBeLessThan(fuel(s13)); expect(fuel(s13) - fuel(drove)).toBeLessThan(2);
    const gone = completeCheckpoint(c, structuredClone(s13) as GameState, { A: { c3_new_leo13: 'farm', c3_new_road13: 'go' }, B: { c3_new_leo13: 'farm', c3_new_road13: 'go' } }).state;
    for (const p of P) expect(gone.chars[p].location).toBe('deniz_workshop');
    expect(gone.npcs.c12_leo.location).toBe('hof_luedemann'); expect(gone.npcs.c12_marcus.location).toBe('c8_east_road');
  });

  it('половины правды обязательны на своих линиях, сверка за ужином доступна обоим', () => {
    const b11 = after11('secret', 'stay');
    const a = leg(b11, 'A', { c12_supper: 'c12_s_eat' }), b = leg(b11, 'B');
    for (const k of ['c12_arms', 'c12_well', 'c12_ao', 'c12_van', 'c12_awin', 'c12_sms', 'c12_rest', 'c12_thermo', 'c12_dusk', 'c12_req', 'c12_gun']) expect(a.vars[`A.${k}`], k).toBeDefined();
    for (const k of ['c12_boy', 'c12_bni', 'c12_bw', 'c12_bag', 'c12_bo', 'c12_hens', 'c12_rest', 'c12_bh', 'c12_said', 'c12_n2', 'c12_chat', 'c12_bm']) expect(b.vars[`B.${k}`], k).toBeDefined();
    expect(c.scenes.c12_supper.actions.find(x => x.id === 'c12_s_tell')!.combinable).toBe(true);
    // Пауэрбанк B действительно отдаёт заряд телефону Нины.
    const bank = leg(b11, 'B', { c12_b_nina: 'c12_bni_bank' });
    const charge = (s: GameState) => Object.values(s.items).find(i => i.type === 'powerbank' && i.at.kind === 'char' && i.at.id === 'B')!.charge!;
    expect(charge(bank)).toBeLessThan(charge(b11));
    // Шоколадка B переходит Лео, а не исчезает.
    if (qty(b11, 'chocolate', 'char', 'B')) {
      const choc = leg(b11, 'B', { c12_b_boy: 'c12_bb_socks' });
      expect(qty(choc, 'chocolate', 'npc', 'c12_leo') + qty(choc, 'chocolate', 'char', 'B')).toBe(qty(b11, 'chocolate', 'char', 'B'));
    }
  });

  it('сон днём и ночью действительно уменьшает недосып; дежурство даёт меньше сна', () => {
    const b11 = after11('family', 'apart');
    const a = leg(b11, 'A', { c12_a_rest: 'c12_ar_sleep' }, 'c12_a_thermo');
    expect(a.chars.A.body.sleepDebt).toBeLessThan(b11.chars.A.body.sleepDebt);
    const together = after12(b11, 'together'), watch = after12(b11, 'watch');
    const sleptA = leg(together, 'A', {}, 'c13_dawn'), watchedA = leg(watch, 'A', {}, 'c13_dawn'), watchedB = leg(watch, 'B', {}, 'c13_dawn');
    expect(watchedA.chars.A.body.sleepDebt).toBeGreaterThan(sleptA.chars.A.body.sleepDebt);
    expect(watchedA.chars.A.time).toBe(watchedB.chars.B.time);
  });
});
