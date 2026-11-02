import { expect, it } from 'vitest';
import { content as c } from '../content';
import { newGame } from '../engine/game';
import { optionsFor } from '../engine/checkpoint';
import { stateHash } from '../engine/rng';
import { acceptPartnerAnswers, finishCheckpoint, myAnswersCode, readyToFinish, shouldSendAnswers, START_TIME, type LocalSave } from './session';
import type { PlayerId } from '../engine/types';

const name = { nom: 'Тест', gen: 'Теста', dat: 'Тесту', acc: 'Теста', ins: 'Тестом', pre: 'Тесте' };
function phone(index: number, me: PlayerId): LocalSave {
  const merged = newGame(c, { pairId: 'compat-ui', seed: 'checkpoint-ui', startTime: START_TIME, players: { A: { name }, B: { name } } });
  merged.checkpoint = index - 1;
  merged.chars.A.location = merged.chars.B.location = 'hof_luedemann';
  merged.vars['w.together'] = true;
  merged.chars.A.body.consciousness = 'dead';
  return {
    schema: 1, me, pairId: merged.pairId, secret: 'eA', seed: merged.seed, phase: 'checkpoint', setups: {},
    base: merged, state: merged, baseHash: stateHash(merged), segment: [], hashes: [], playSeconds: 0, updatedAt: 0,
    cp: { index, merged, mergedHash: stateHash(merged) },
  };
}

for (const index of [1, 2, 3, 4]) it(`КТ ${index}: старый формат и порядок кодов сохранены`, () => {
  const save = phone(index, 'B');
  const def = c.checkpoints.find(cp => cp.index === index)!;
  const answers = Object.fromEntries(def.joint.map(id => [id, c.joint[id].default ?? 'stay']));
  save.cp!.myAnswers = answers;
  expect(shouldSendAnswers(c, save)).toBe(false);
  const finished = finishCheckpoint(c, save);
  expect(finished.schema).toBe(1);
  expect(Object.hasOwn(finished, 'lastCheckpoint')).toBe(false);
  expect(JSON.stringify(finished)).not.toContain('lastCheckpoint');
  expect(finished.cp!.sent).toBeUndefined();
});

for (const index of [5, 6, 7, 8]) it(`КТ ${index}: один отвечающий, одинаковый мир и сохранённый код`, async () => {
  let a = phone(index, 'A'); const b = phone(index, 'B');
  const id = c.checkpoints.find(cp => cp.index === index)!.joint[0];
  b.cp!.myAnswers = { [id]: optionsFor(c, b.cp!.merged!, c.joint[id], 'B')[0].id };
  expect(shouldSendAnswers(c, a)).toBe(false);
  expect(shouldSendAnswers(c, b)).toBe(true);
  expect(readyToFinish(c, a)).toBe(false);
  const answer = await myAnswersCode(b);
  a = await acceptPartnerAnswers(c, a, answer);
  const left = finishCheckpoint(c, a), right = finishCheckpoint(c, b, { answers: answer });
  expect(left.baseHash).toBe(right.baseHash);
  expect(right.lastCheckpoint!.index).toBe(index);
  expect(right.lastCheckpoint!.sent!.answers).toBe(answer);
  if (index === 8) {
    expect(left.phase).toBe('playing');
    expect(left.cp!.index).toBe(8);
  } else {
    expect(left.phase).toBe('checkpoint');
    expect(left.cp!.index).toBe(index + 1);
    expect(left.lastCheckpoint!.result!.hash).toBe(left.baseHash);
  }
});
