import { describe, expect, it } from 'vitest';
import { REPLAY_ID, REPLAY_PAIR } from '../app/requested-replay';
import { checkpointReadingFor } from './checkpoint-reading';

const save = { me: 'A' as const, pairId: REPLAY_PAIR, replay: REPLAY_ID, base: { checkpoint: 19 } };

describe('чтение на контрольной точке', () => {
  it('даёт только пройденные точки, начиная с последней', () => {
    expect(checkpointReadingFor(save).map(({ point }) => point)).toEqual(Array.from({ length: 19 }, (_, i) => 19 - i));
    expect(checkpointReadingFor({ ...save, base: { checkpoint: 0 } })).toEqual([]);
  });

  it('использует свою подборку на каждом телефоне до КТ20 включительно', () => {
    const completed = { ...save, base: { checkpoint: 21 } };
    const a = checkpointReadingFor(completed);
    const b = checkpointReadingFor({ ...completed, me: 'B' });
    expect(a).toHaveLength(20);
    expect(b.map(({ point }) => point)).toEqual(a.map(({ point }) => point));
    expect(b[0].point).toBe(20);
    expect(a.every((entry, i) => entry.text !== b[i].text)).toBe(true);
  });

  it('не открывает личную подборку другой паре или другому прохождению', () => {
    expect(checkpointReadingFor({ ...save, pairId: 'another-pair' })).toEqual([]);
    expect(checkpointReadingFor({ ...save, replay: undefined })).toEqual([]);
    expect(checkpointReadingFor({ ...save, base: undefined })).toEqual([]);
  });
});
