import { describe, expect, it } from 'vitest';
import { availableActions, isServiceAction } from '../engine/actions';
import { newGame, play, segmentFinished } from '../engine/game';
import { unit } from '../engine/rng';
import { content as c } from '../content';
import { players } from '../content/playtest';
import { START_TIME } from './session';
import { remainingSteps, segmentProgress } from './progress';

describe('прогресс участка', () => {
  it('растёт, не убывает, до точки не выше 95%, на точке — 100%', () => {
    for (const seed of ['1', '2', '3']) for (const pid of ['A', 'B'] as const) {
      const base = newGame(c, { pairId: 'p', seed, startTime: START_TIME, players });
      const s = structuredClone(base);
      let prev = 0;
      for (let step = 0; step < 300 && !segmentFinished(c, s, pid); step++) {
        const acts = availableActions({ s, c, pid }).filter((a) => a.enabled && !isServiceAction(a.def.id) && a.def.id !== 'u:sleep');
        play(c, s, pid, [acts[Math.floor(unit(`${seed}:${pid}:${step}`) * acts.length)].def.id]);
        const p = segmentProgress(c, base, s, pid)!;
        expect(p).toBeGreaterThanOrEqual(prev);
        if (!segmentFinished(c, s, pid)) expect(p).toBeLessThanOrEqual(0.95);
        prev = p;
      }
      if (segmentFinished(c, s, pid) === 'checkpoint') expect(prev).toBe(1);
    }
  });

  it('оценка есть для каждой выпущенной точки', () => {
    for (const cp of c.checkpoints) expect(remainingSteps(c, cp.index).size, `КТ ${cp.index}`).toBeGreaterThan(0);
  });
});
