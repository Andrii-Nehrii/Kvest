import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { content } from '../content';
import { stateHash } from '../engine/rng';
import type { GameState } from '../engine/types';
import { acceptPartnerAnswers, acceptPartnerSegment, exportSave, myAnswersCode, mySegmentCode, type LocalSave } from './session';
import { cloudPairId } from './cloud';
import { REPLAY_ID, REPLAY_PAIR, requestedReplay } from './requested-replay';

const fixture = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const make = (me: 'A' | 'B'): LocalSave => {
  const base = structuredClone(fixture.legs.find(l => l.base.checkpoint === 5)!.base);
  base.pairId = REPLAY_PAIR;
  const baseHash = stateHash(base);
  return { schema: 1, me, pairId: REPLAY_PAIR, secret: 'test-only-replay-secret', seed: base.seed, phase: 'playing', setups: {},
    base, state: structuredClone(base), baseHash, hashes: ['start', 'point1', 'point2', 'point3', 'point4', baseHash], segment: [], playSeconds: 0, updatedAt: 1 };
};
const replay = (me: 'A' | 'B') => ({ ...make(me), replay: REPLAY_ID });

describe('повтор участка 6 по запросу пары', () => {
  it('подхватывает подготовленное начало, сохраняя базу КТ5 и ранние хэши на обоих телефонах', async () => {
    for (const me of ['A', 'B'] as const) {
      const before = make(me); before.phase = 'checkpoint'; before.cp = { index: 6 }; before.playSeconds = 450;
      before.segment = [{ scene: 'c6_start', plan: ['c6_rev_begin'] }];
      const original = structuredClone(before), ready = replay(me);
      const read = vi.fn().mockResolvedValue(exportSave(ready));
      const next = (await requestedReplay(content, before, read))!;
      expect(read).toHaveBeenCalledWith(`${REPLAY_PAIR}-${REPLAY_ID}`, me);
      expect(before).toEqual(original);
      expect(next.segment).toEqual([]); expect(next.cp).toBeUndefined(); expect(next.phase).toBe('playing');
      expect(next.baseHash).toBe(before.baseHash); expect(next.base).toEqual(before.base);
      expect(next.state).toEqual(next.base); expect(next.hashes).toEqual(before.hashes);
    }
  });
  it('не сбрасывает повтор снова и не затрагивает другие пары или ранние точки', async () => {
    const read = vi.fn();
    const other = make('A'); other.pairId = 'other-pair';
    const earlier = make('A'); earlier.base!.checkpoint = 4;
    const unknownReplay = { ...make('A'), replay: 'another-replay' };
    for (const save of [replay('A'), other, earlier, unknownReplay]) expect(await requestedReplay(content, save, read)).toBeUndefined();
    expect(read).not.toHaveBeenCalled();
  });
  it('возвращает к КТ5 и после первого повтора, не меняя его исходные данные', async () => {
    for (const me of ['A', 'B'] as const) {
      const previous = { ...make(me), replay: 'replay6-20261102' };
      previous.segment = [{ scene: 'c6_start', plan: ['c6_rev_begin'] }];
      const snapshot = structuredClone(previous);
      const next = await requestedReplay(content, previous, async () => exportSave(replay(me)));
      expect(next!.replay).toBe(REPLAY_ID);
      expect(next!.segment).toEqual([]);
      expect(next!.hashes).toEqual(previous.hashes);
      expect(previous).toEqual(snapshot);
    }
  });
  it('при открытии старой копии подхватывает уже сделанные ходы повтора, не теряя их', async () => {
    const ready = replay('A'); ready.segment = [{ scene: 'c6_start', plan: ['c6_rev_begin'] }];
    const next = await requestedReplay(content, make('A'), async () => exportSave(ready));
    expect(next!.segment).toEqual(ready.segment);
  });
  it('не заменяет игру при пропавшем или чужом облачном файле', async () => {
    const current = make('A'); const snapshot = structuredClone(current);
    await expect(requestedReplay(content, current, async () => undefined)).rejects.toThrow(/не загружено/);
    await expect(requestedReplay(content, current, async () => exportSave(replay('B')))).rejects.toThrow(/проверить/);
    const different = replay('A'); different.hashes[4] = 'different-past';
    await expect(requestedReplay(content, current, async () => exportSave(different))).rejects.toThrow(/проверить/);
    expect(current).toEqual(snapshot);
  });
  it('разделяет облачные файлы и отклоняет старый ручной код даже при той же базе', async () => {
    const oldA = make('A'), newA = replay('A'), newB = replay('B');
    expect(cloudPairId(oldA)).toBe(REPLAY_PAIR); expect(cloudPairId(newA)).not.toBe(REPLAY_PAIR);
    await expect(acceptPartnerSegment(content, newB, await mySegmentCode(content, oldA))).rejects.toThrow(/другому прохождению/);
    const accepted = await acceptPartnerSegment(content, newB, await mySegmentCode(content, newA));
    expect(accepted.cp!.partnerRecords).toEqual([]);
    for (const save of [oldA, newA, newB]) save.cp = { index: 6, mergedHash: 'test-world', myAnswers: {} };
    await expect(acceptPartnerAnswers(content, newB, await myAnswersCode(oldA))).rejects.toThrow(/другому прохождению/);
    expect((await acceptPartnerAnswers(content, newB, await myAnswersCode(newA))).cp!.partnerAnswers).toEqual({});
  });
});
