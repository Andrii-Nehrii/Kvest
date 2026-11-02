import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { completeCheckpoint, mergeNotes, mergeSegments, optionsFor, syncClocks } from '../engine/checkpoint';
import { play, replayPrefix, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import { content as c } from './index';

// Выпущенный формат КТ5. Для сценарного теста явно задаём сыгранную линию; эталон не перезаписываем.
const release = JSON.parse(readFileSync(new URL('./fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const base = () => {
  const s = structuredClone(release.legs.find(x => x.base.checkpoint === 5)!.base);
  Object.assign(s.vars, { 'w.c3_trip5': 'relieve', 'w.c3_f5': 'shield', 'w.c3_farm_gun_lost': true });
  s.npcs.pawel.location = 'hof_luedemann';
  s.npcs.pawel.vars.c3_hand_rest = true;
  return s;
};
const decisions = [
  ['c6_new_reassure', 'c6_new_listen'], ['c6_new_brace', 'c6_new_reach'],
  ['c6_new_stop_blame', 'c6_new_ask_ole'], ['c6_new_name_fear', 'c6_new_back_rest'],
  ['c6_new_finish_water', 'c6_new_stay_pawel'],
];
function finish(start: GameState, pid: PlayerId, branch: number) {
  const s = structuredClone(start);
  const records: ActionRecord[] = [];
  const plan = ['c6_new_begin', ...decisions.map((opts, i) => opts[(branch >> i) & 1]), 'c6_new_warm_up', 'c6_new_night_talk'];
  for (const id of plan) {
    expect(availableActions({ s, c, pid }).some(a => a.enabled && a.def.id === id), `${pid}/${s.chars[pid].scene}/${id}`).toBe(true);
    records.push({ scene: s.chars[pid].scene, plan: [id] });
    play(c, s, pid, [id]);
  }
  expect(segmentFinished(c, s, pid)).toBe('checkpoint');
  expect(s.chars[pid].body.consciousness).toBe('awake');
  expect(stateHash(replaySegment(c, start, pid, records))).toBe(stateHash(s));
  return s;
}

describe('новый участок 6: продолжение выпущенной КТ5', () => {
  it('все сочетания личных решений проходятся на обоих телефонах и точно воспроизводятся', () => {
    for (const pid of ['A', 'B'] as const) for (let branch = 0; branch < 32; branch++) finish(base(), pid, branch);
  });

  it('снятое начало не воспроизводится; старые сцены не подключены', () => {
    for (const pid of ['A', 'B'] as const) {
      const s = base();
      const replayed = replayPrefix(c, s, pid, [{ scene: 'c6_start', plan: ['c6_begin'] }]);
      expect(replayed.applied).toBe(0);
      expect(stateHash(replayed.state)).toBe(stateHash(s));
    }
    for (const id of ['c6_farm', 'c7_farm', 'c8_farm']) expect(c.scenes[id]).toBeUndefined();
    expect(c.checkpoints.find(x => x.index === 6)?.joint).toEqual(['c3_new_night6']);
    expect(c.checkpoints.some(x => x.index > 6)).toBe(false);
  });

  it('новый вход закрыт до КТ5, после КТ6, вне написанного места и при отсутствии участников', () => {
    for (const variant of ['before', 'after', 'elsewhere', 'apart', 'missing'] as const) {
      const s = base();
      if (variant === 'before') s.checkpoint = 4;
      if (variant === 'after') s.checkpoint = 6;
      if (variant === 'elsewhere') s.chars.A.location = s.chars.B.location = 'b_flat';
      if (variant === 'apart') s.chars.B.location = 'b_flat';
      if (variant === 'missing') s.npcs.pawel.location = 'farm_coop';
      for (const pid of ['A', 'B'] as const) expect(availableActions({ s, c, pid }).filter(a => a.enabled && !a.universal)).toEqual([]);
    }
  });

  it('общий результат записывается один раз при двух телефонах, ночной план исполняется одинаково', () => {
    const start = base();
    const ends = { A: finish(start, 'A', 0), B: finish(start, 'B', 31) };
    const water = (s: GameState) => Object.values(s.items).filter(i => i.type === 'water_l' && i.at.kind === 'place' && i.at.id === 'c3_farm_stock').reduce((sum, i) => sum + i.qty, 0);
    const merged = mergeSegments(c, start, ends);
    syncClocks(c, merged, c.checkpoints.find(x => x.index === 6)!.syncNotBefore);
    const before = water(merged);
    mergeNotes(c, merged, 6);
    expect(water(merged) - before).toBe(20);
    mergeNotes(c, merged, 6);
    expect(water(merged) - before).toBe(20);
    expect(merged.npcs.pawel.vars.c6_new_resting).toBe(true);
    const d = c.joint.c3_new_night6;
    for (const a of optionsFor(c, merged, d, 'A')) for (const b of optionsFor(c, merged, d, 'B')) {
      const answers = { A: { [d.id]: a.id }, B: { [d.id]: b.id } };
      const first = completeCheckpoint(c, structuredClone(merged), answers);
      const second = completeCheckpoint(c, structuredClone(merged), answers);
      expect(stateHash(first.state)).toBe(stateHash(second.state));
      const expected = a.id === b.id ? a.id : 'apart';
      expect(first.joint[0].applied).toEqual([expected]);
      expect(first.state.vars['w.c6_new_night']).toBe(expected);
      expect(first.state.vars['w.c6_new_morning_water']).toBe(expected === 'sleep');
      for (const pid of ['A', 'B'] as const) expect(first.state.chars[pid].scene).toBe('c7_start');
    }
  });
});
