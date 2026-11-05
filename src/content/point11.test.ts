import { describe, expect, it } from 'vitest';
import { completeCheckpoint } from '../engine/checkpoint';
import type { GameState } from '../engine/types';
import { P, after8, leg, mergeCp } from '../test/arc9kit';
import { content as c } from './index';

function after10(ole: string, nina = 'house', jens = 'keep') {
  const b8 = after8('home');
  const s9 = mergeCp(b8, 9, leg(b8, 'A'), leg(b8, 'B'));
  const b9 = completeCheckpoint(c, s9, { A: { c3_new_jens9: jens, c3_new_search9b: 'stay' }, B: { c3_new_jens9: jens, c3_new_search9a: 'go' } }).state;
  const s10 = mergeCp(b9, 10, leg(b9, 'A'), leg(b9, 'B'));
  return completeCheckpoint(c, s10, { A: { c3_new_ole10: ole, c3_new_nina10: nina }, B: { c3_new_ole10: ole, c3_new_nina10: nina } }).state;
}

describe('участок 11: рассвет, иммунитет, КТ11', () => {
  for (const ole of ['coop', 'door', 'sleep']) it(`ночь «${ole}»: обе линии доходят до КТ11; рассвет одинаковый, Оле выживает`, () => {
    const base = after10(ole);
    expect(c.scenes.c11_start.onEnter).toBeUndefined(); expect(c.scenes.c11_start.location).toBeUndefined();
    const a = leg(base, 'A'), b = leg(base, 'B');
    for (const x of [a, b]) {
      expect(x.npcs.ole.vars.c11_immune).toBe(true); expect(x.npcs.ole.location).toBe('farm_coop');
      expect(x.vars['w.c11_henrike_wound']).toBe(ole === 'coop' ? 'none' : ole === 'door' ? 'scratch' : 'bite');
      expect(x.npcs.deniz.location).toBe('hof_luedemann'); expect(x.npcs.kerem.location).toBe('hof_luedemann');
    }
    const s = mergeCp(base, 11, a, b);
    expect(s.chars.A.time).toBe(s.chars.B.time);
    for (const [ra, rb, wantR, ha, hb, wantH] of [['report', 'report', 'report', 'stay', 'stay', 'stay'], ['report', 'secret', 'family', 'stay', 'leave', 'apart'], ['secret', 'secret', 'secret', 'leave', 'leave', 'leave']]) {
      const out = completeCheckpoint(c, structuredClone(s) as GameState, { A: { c3_new_report11: ra, c3_new_home11: ha }, B: { c3_new_report11: rb, c3_new_home11: hb } }).state;
      expect(out.vars['w.c11_report']).toBe(wantR); expect(out.vars['w.c11_home']).toBe(wantH);
      for (const p of P) expect(out.chars[p].scene).toBe('c12_start');
    }
  });

  it('сон перед рассветом действительно уменьшает недосып; при смене у двери B спит меньше A', () => {
    const base = after10('door');
    const a = leg(base, 'A', {}, 'c11_dawn'), b = leg(base, 'B', {}, 'c11_dawn');
    expect(a.chars.A.body.sleepDebt).toBeLessThan(base.chars.A.body.sleepDebt);
    expect(a.chars.A.time).toBe(b.chars.B.time);
  });
});
