import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { completeCheckpoint, mergeNotes, mergeSegments, optionsFor, syncClocks } from '../engine/checkpoint';
import { play, replayPrefix, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { applyEffects } from '../engine/effects';
import { stateHash } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import { content as c } from './index';

const release = JSON.parse(readFileSync(new URL('./fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const base = () => {
  const s = structuredClone(release.legs.find(x => x.base.checkpoint === 5)!.base);
  Object.assign(s.vars, { 'w.c3_trip5': 'relieve', 'w.c3_f5': 'shield', 'w.c3_farm_gun_lost': true });
  s.npcs.pawel.location = 'hof_luedemann';
  s.npcs.pawel.vars.c3_hand_rest = true;
  if (!Object.values(s.items).some(i => i.type === 'potatoes' && i.at.kind === 'char' && i.at.id === 'A' && i.qty >= 5)) {
    applyEffects({ s, c, pid: 'A' }, [{ give: 'potatoes', qty: 5 }]);
  }
  return s;
};
function finish(start: GameState, pid: PlayerId, branch: number, explore = false, forced: Record<string, string> = {}) {
  const s = structuredClone(start), records: ActionRecord[] = [];
  const host = (branch & 1) !== 0;
  const plan = pid === 'A'
    ? ['c6_rev_begin_care', 'c6_r_a_yard', host ? 'c6_r_a_return_care' : 'c6_r_a_work_care', (branch & 2) ? 'c6_r_pay_stock' : 'c6_r_pay_bag', (branch & 4) ? 'c6_r_a_witness' : 'c6_r_a_boundary', 'c6_r_rest_care', 'c6_r_to_checkpoint']
    : ['c6_rev_begin_care', host ? 'c6_r_b_host' : 'c6_r_b_stay', (branch & 2) ? (host ? 'c6_r_b_terms_care' : 'c6_r_b_company_care') : (host ? 'c6_r_b_water_h_care' : 'c6_r_b_water_p_care'), (branch & 4) ? 'c6_r_b_offer' : 'c6_r_b_honest', 'c6_r_rest_care', 'c6_r_to_checkpoint'];
  for (const id of plan) {
    const scene = s.chars[pid].scene;
    const actions = availableActions({ s, c, pid }).filter(a => a.enabled && !a.universal);
    if (scene.startsWith('c6_r_')) {
      expect(actions.length, scene).toBeGreaterThanOrEqual(4);
      expect(actions.filter(a => !a.def.presentation).length, scene).toBeLessThanOrEqual(6);
    }
    const optional = actions.filter(a => a.def.id.startsWith('c6_more_')).map(a => a.def.id);
    if (explore && optional.length) {
      records.push({ scene, plan: optional });
      play(c, s, pid, optional);
      expect(s.chars[pid].scene).toBe(scene);
      const remaining = availableActions({ s, c, pid }).filter(a => a.enabled).map(a => a.def.id);
      expect(remaining).toContain(id);
      expect(optional.some(x => remaining.includes(x))).toBe(false);
    }
    expect(availableActions({ s, c, pid }).some(a => a.enabled && a.def.id === id), `${pid}/${s.chars[pid].scene}/${id}`).toBe(true);
    records.push({ scene: s.chars[pid].scene, plan: [id] });
    play(c, s, pid, [id]);
  }
  let step = 0;
  while (!segmentFinished(c, s, pid) && step < 40) {
    const scene = s.chars[pid].scene;
    expect(scene).toMatch(/^c6_(l_|camp_supper)/);
    const actions = availableActions({ s, c, pid }).filter(a => a.enabled && !a.universal);
    // В еде показываем и недоступные порции: отсутствие продуктов не превращаем в бесплатный ужин.
    expect(availableActions({ s, c, pid }).filter(a => !a.universal).length, scene).toBeGreaterThanOrEqual(4);
    const optional = actions.filter(a => a.def.combinable && !a.def.terminal && !a.def.goto && !a.def.presentation).map(a => a.def.id);
    if (explore && optional.length) {
      records.push({ scene, plan: optional });
      play(c, s, pid, optional);
      expect(s.chars[pid].scene).toBe(scene);
    }
    const choices = availableActions({ s, c, pid }).filter(a => a.enabled && !a.universal && a.def.terminal);
    const id = forced[scene] ?? choices[(branch + step) % choices.length].def.id;
    records.push({ scene, plan: [id] });
    play(c, s, pid, [id]);
    step++;
  }
  expect(segmentFinished(c, s, pid)).toBe('checkpoint');
  expect(s.chars[pid].body.consciousness).toBe('awake');
  expect(stateHash(replaySegment(c, start, pid, records))).toBe(stateHash(s));
  return s;
}
const qty = (s: GameState, type: string, owner: string) => Object.values(s.items).filter(i => i.type === type && 'id' in i.at && i.at.id === owner).reduce((sum, i) => sum + i.qty, 0);
const merge = (s: GameState, a: number, b: number) => {
  const m = mergeSegments(c, s, { A: finish(s, 'A', a), B: finish(s, 'B', b) });
  syncClocks(c, m, c.checkpoints.find(x => x.index === 6)!.syncNotBefore);
  mergeNotes(c, m, 6);
  return m;
};

describe('переработанный участок 6', () => {
  it('оба телефона проходят все свои ветки и воспроизводятся точно', { timeout: 15000 }, () => {
    for (const pid of ['A', 'B'] as const) for (let branch = 0; branch < 8; branch++) {
      const start = base(), direct = finish(start, pid, branch), curious = finish(start, pid, branch, true);
      expect(curious.vars[`${pid}.c6_r_water`]).toBe(direct.vars[`${pid}.c6_r_water`]);
      expect(curious.vars[`${pid}.c6_r_reply`]).toBe(direct.vars[`${pid}.c6_r_reply`]);
      for (const owner of ['A', 'c3_farm_stock']) expect(qty(curious, 'potatoes', owner)).toBe(qty(direct, 'potatoes', owner));
    }
  });
  it('старые начала и снятые участки 7–8 не подключены', () => {
    for (const pid of ['A', 'B'] as const) for (const action of ['c6_begin', 'c6_new_begin']) {
      const s = base(), r = replayPrefix(c, s, pid, [{ scene: 'c6_start', plan: [action] }]);
      expect(r.applied).toBe(0); expect(stateHash(r.state)).toBe(stateHash(s));
    }
    for (const id of ['c6_farm', 'c7_farm', 'c8_farm', 'c6_new_well']) expect(c.scenes[id]).toBeUndefined();
    expect(c.checkpoints.find(x => x.index === 7)!.joint).toEqual(['c3_new_van7', 'c3_new_depart7']);
    expect(c.checkpoints.find(x => x.index === 8)!.joint).toEqual(['c3_new_route8']);
    expect(c.checkpoints.find(x => x.index === 9)!.joint).toEqual(['c3_new_jens9', 'c3_new_search9a', 'c3_new_search9b']);
    expect(c.checkpoints.find(x => x.index === 10)!.joint).toEqual(['c3_new_ole10', 'c3_new_nina10']);
    expect(c.checkpoints.find(x => x.index === 11)!.joint).toEqual(['c3_new_report11', 'c3_new_home11']);
    expect(c.checkpoints.find(x => x.index === 12)!.joint).toEqual(['c3_new_guests12', 'c3_new_promise12a', 'c3_new_promise12b']);
    expect(c.checkpoints.find(x => x.index === 13)!.joint).toEqual(['c3_new_leo13', 'c3_new_road13']);
    expect(c.checkpoints.find(x => x.index === 14)!.joint).toEqual(['c3_new_jens14', 'c3_new_nina14']);
    expect(c.checkpoints.find(x => x.index === 15)!.joint).toEqual(['c3_new_nina15', 'c3_new_garden15']);
    expect(c.checkpoints.find(x => x.index === 16)!.joint).toEqual(['c3_new_albers16', 'c3_new_sweep16']);
    expect(c.checkpoints.find(x => x.index === 17)!.joint).toEqual(['c3_new_colony17', 'c3_new_nina17']);
    expect(c.checkpoints.find(x => x.index === 18)!.joint).toEqual(['c3_new_friday18', 'c3_new_house18']);
    expect(c.checkpoints.some(x => x.index > 18)).toBe(false);
  });
  it('расчёт из другого источника действительно сохраняет мешок, а не списывает его дважды', () => {
    const s = base(), bag = qty(s, 'potatoes', 'A'), stock = qty(s, 'potatoes', 'c3_farm_stock');
    const given = finish(s, 'A', 0), kept = finish(s, 'A', 2);
    expect(qty(given, 'potatoes', 'A')).toBe(bag - 5);
    expect(qty(given, 'potatoes', 'c3_farm_stock')).toBe(stock);
    expect(qty(kept, 'potatoes', 'A')).toBe(bag);
    expect(qty(kept, 'potatoes', 'c3_farm_stock')).toBe(stock - 5);
  });
  it('отказ от работы оставляет общий долг, выполненные доли действительно снимают его', () => {
    for (const [a, b, extra] of [[0, 0, false], [1, 0, true], [0, 2, true], [1, 2, true]] as const) {
      const s = base(), m = merge(s, a, b), water = qty(m, 'water_l', 'c3_farm_stock');
      expect(m.vars['w.c6_r_morning_extra']).toBe(extra);
      mergeNotes(c, m, 6);
      expect(qty(m, 'water_l', 'c3_farm_stock')).toBe(water);
    }
  });
  it('четыре согласованных ответа дают разные судьбы; отказ от личного обещания остаётся виден', () => {
    const m = merge(base(), 0, 4), d = c.joint.c3_new_night6;
    for (const a of optionsFor(c, m, d, 'A')) for (const b of optionsFor(c, m, d, 'B')) {
      const answers = { A: { c3_l_road6: 'quiet', [d.id]: a.id }, B: { c3_l_road6: 'quiet', [d.id]: b.id } };
      const out = completeCheckpoint(c, structuredClone(m), answers);
      expect(stateHash(out.state)).toBe(stateHash(completeCheckpoint(c, structuredClone(m), answers).state));
      const chosen = a.id === b.id ? a.id : 'beside';
      expect(out.joint.find(x => x.id === d.id)!.applied).toEqual([chosen]);
      expect(out.state.npcs.pawel.vars.c6_r_depart_at_dawn).toBe(['go_with', 'own_sleep'].includes(chosen));
      expect(!!out.state.vars['w.c6_r_leave_farm']).toBe(chosen === 'go_with');
      expect(!!out.state.npcs.pawel.vars.c6_r_b_promise_broken).toBe(chosen === 'own_sleep');
      for (const pid of ['A', 'B'] as const) expect(out.state.chars[pid].scene).toBe('c7_start');
    }
  });
  it('общее действие у дороги имеет три разных результата; несовпавшие ответы не открывают ворота', () => {
    const m = merge(base(), 0, 1), d = c.joint.c3_l_road6;
    for (const a of optionsFor(c, m, d, 'A')) for (const b of optionsFor(c, m, d, 'B')) {
      const out = completeCheckpoint(c, structuredClone(m), {
        A: { [d.id]: a.id, c3_new_night6: 'beside' }, B: { [d.id]: b.id, c3_new_night6: 'beside' },
      });
      const chosen = a.id === b.id ? a.id : 'call';
      expect(out.state.vars['w.c6_l_road_result']).toBe(chosen);
      expect(out.state.vars['w.c6_l_van_surrounded']).toBe(chosen === 'quiet');
      expect(out.state.vars['w.c6_l_extra_watch']).toBe(chosen !== 'quiet');
      expect(out.state.vars['w.c6_l_keys_medical_only']).toBe(true);
      expect(out.state.checkpoint).toBe(6);
      expect(out.state.chars.A.location).toBe('hof_luedemann');
      expect(out.state.chars.B.location).toBe('hof_luedemann');
    }
  });
  it('учитывает собственную машину: предложение поездки требует двух ответов, топливо не тратится до дороги', () => {
    const start = base(), car = Object.values(start.items).find(i => i.type === 'opel_corsa')!;
    car.at = { kind: 'place', id: 'hof_luedemann' }; car.fuel = 12;
    for (const available of [true, false]) {
      const probe = structuredClone(start); probe.chars.A.scene = 'c6_l_a_test';
      Object.values(probe.items).find(i => i.type === 'opel_corsa')!.fuel = available ? 12 : 0;
      expect(availableActions({ s: probe, c, pid: 'A' }).some(a => a.enabled && a.def.id === 'c6_l_a_own_car_offer')).toBe(available);
    }
    const m = mergeSegments(c, start, {
      A: finish(start, 'A', 0, false, { c6_l_a_test: 'c6_l_a_own_car_offer' }), B: finish(start, 'B', 0),
    });
    syncClocks(c, m, c.checkpoints.find(cp => cp.index === 6)!.syncNotBefore);
    mergeNotes(c, m, 6);
    expect(m.vars['w.c6_l_owncar_offer']).toBe(true);
    for (const [a, b, accepted] of [['go_with', 'go_with', true], ['go_with', 'beside', false]] as const) {
      const out = completeCheckpoint(c, structuredClone(m), {
        A: { c3_l_road6: 'quiet', c3_new_night6: a }, B: { c3_l_road6: 'quiet', c3_new_night6: b },
      });
      expect(!!out.state.vars['w.c6_l_use_owncar']).toBe(accepted);
      expect(Object.values(out.state.items).find(i => i.type === 'opel_corsa')!.fuel).toBe(12);
    }
  });
  it('вход закрыт до КТ5, после КТ6 и вне написанной линии', () => {
    for (const variant of ['before', 'after', 'elsewhere', 'apart', 'missing']) {
      const s = base();
      if (variant === 'before') s.checkpoint = 4;
      if (variant === 'after') s.checkpoint = 6;
      if (variant === 'elsewhere') s.chars.A.location = s.chars.B.location = 'b_flat';
      if (variant === 'apart') s.chars.B.location = 'b_flat';
      if (variant === 'missing') s.npcs.pawel.location = 'farm_coop';
      for (const pid of ['A', 'B'] as const) expect(availableActions({ s, c, pid }).filter(a => a.enabled && !a.universal)).toEqual([]);
    }
  });
});
