import { describe, expect, it } from 'vitest';
import { completeCheckpoint, participants } from '../engine/checkpoint';
import type { GameState } from '../engine/types';
import { knownNpc } from '../ui/format';
import { giveItem } from '../engine/world';
import { P, after8, ctx, leg, mergeCp, qty } from '../test/arc9kit';
import { content as c } from './index';

function after9(jens: string, a: string, b: string, direction = 'home') {
  const base = after8(direction);
  const s = mergeCp(base, 9, leg(base, 'A'), leg(base, 'B'));
  return completeCheckpoint(c, s, { A: { c3_new_jens9: jens, c3_new_search9b: b }, B: { c3_new_jens9: jens, c3_new_search9a: a } }).state;
}
const COMBOS: [string, string, string][] = [['keep', 'go', 'go'], ['keep', 'go', 'stay'], ['keep', 'stay', 'go'], ['keep', 'stay', 'stay'], ['end', 'stay', 'stay'], ['end', 'go', 'stay']];

describe('участок 10: ночь до КТ10', () => {
  it('вход ничего не исполняет над базой КТ9; Дениз уходит первым ходом на обеих линиях', () => {
    const s = after9('keep', 'go', 'stay');
    expect(c.scenes.c10_start.onEnter).toBeUndefined(); expect(c.scenes.c10_start.location).toBeUndefined();
    expect(s.npcs.deniz.location).toBe('hof_luedemann');
    const a = leg(s, 'A', {}, 'c10_s_path'), b = leg(s, 'B', {}, 'c10_f_kitchen');
    expect(a.npcs.deniz.location).toBe('b75_road'); expect(b.npcs.deniz.location).toBe('b75_road');
  });

  for (const [jens, sa, sb] of COMBOS) it(`КТ9: Йенс ${jens}, поиск A=${sa}, B=${sb} — обе линии доходят до КТ10 и повторяются`, () => {
    const base = after9(jens, sa, sb);
    const a = leg(base, 'A'), b = leg(base, 'B');
    expect(a.chars.A.location).toBe('hof_luedemann'); expect(b.chars.B.location).toBe('hof_luedemann');
    // Правду узнаёт тот, кто ходил, и тот, к кому вернулся партнёр.
    const someone = sa === 'go' || sb === 'go';
    if (someone) { expect(a.vars['A.c10_knows']).toBe(true); expect(b.vars['B.c10_knows']).toBe(true); }
    expect(a.npcs.ole.vars.c10_fever).toBe(true);
    const s = mergeCp(base, 10, a, b);
    expect(s.chars.A.time).toBe(s.chars.B.time);
    const opts = participants(c, s, c.joint.c3_new_nina10);
    expect(opts).toEqual(['A', 'B']);
    for (const [oa, ob, want] of [['coop', 'coop', 'coop'], ['coop', 'sleep', 'door'], ['sleep', 'sleep', 'sleep']]) {
      const out = completeCheckpoint(c, structuredClone(s) as GameState, { A: { c3_new_ole10: oa, c3_new_nina10: 'barn' }, B: { c3_new_ole10: ob, c3_new_nina10: 'barn' } }).state;
      expect(out.vars['w.c10_ole']).toBe(want); expect(out.vars['w.c10_nina']).toBe('barn');
      expect(out.npcs.ole.location).toBe(want === 'coop' ? 'farm_coop' : 'hof_luedemann');
      for (const p of P) expect(out.chars[p].scene).toBe('c11_start');
    }
  });

  it('без поиска правда приходит только с личными уликами; без них Хенрике не признаётся', () => {
    const base = after9('keep', 'stay', 'stay');
    const plain = leg(base, 'A', { c10_f_hens: 'c10_f_h_close', c10_n_house: 'c10_n_press' });
    expect(plain.vars['A.c10_press_failed']).toBe(true); expect(plain.vars['A.c10_knows']).toBeUndefined();
    const proof = structuredClone(base); proof.vars['A.c9_saw_forearm'] = true;
    const told = leg(proof, 'A', { c10_n_house: 'c10_n_press' });
    expect(told.vars['A.c10_confession']).toBe(true);
    // Свежая солома в старом курятнике — тоже своя улика.
    const coop = leg(base, 'B', { c10_f_hens: 'c10_f_h_look', c10_n_house: 'c10_n_press' });
    expect(coop.vars['B.c10_confession']).toBe(true);
  });

  it('ибупрофен действительно переходит к Хенрике; ключ Нины забирает только линия B', () => {
    const base = after9('keep', 'stay', 'stay');
    if (!qty(base, 'ibuprofen', 'char', 'A')) giveItem(ctx(base), 'ibuprofen', 4);
    const a = leg(base, 'A', { c10_f_pills: 'c10_f_p_give' });
    expect(qty(a, 'ibuprofen', 'npc', 'henrike')).toBe(1); expect(a.npcs.ole.vars.c10_masked).toBe(true);
    const ninaHas = qty(base, 'c9_van_key', 'npc', 'c7_nina') > 0;
    const b = leg(base, 'B', ninaHas ? { c10_n_nina: 'c10_n_n_key' } : {});
    expect(qty(b, 'c9_van_key', 'char', 'B')).toBe(1);
    const s = mergeCp(base, 10, leg(base, 'A'), b);
    expect(qty(s, 'c9_van_key')).toBe(1); expect(qty(s, 'c9_van_key', 'char', 'B')).toBe(1);
  });

  it('если Йенса нет, Нина ночью приходит к игроку, а не к фургону', () => {
    const base = after9('end', 'stay', 'stay');
    expect(base.vars['w.c7_jens']).toBe('dead');
    const b = leg(base, 'B', {}, 'c10_n_nina');
    expect(knownNpc(b.npcs.c7_nina, 'B', b.vars)).toBe(true);
    expect(c.joint.c3_new_nina10.options.find(o => o.id === 'van')!.when).toBeDefined();
  });
});
