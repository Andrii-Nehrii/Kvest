import { describe, expect, it } from 'vitest';
import { content as c } from '../content';
import { ANSWER_RESET, answerReset } from './answer-reset';
import { acceptPartnerAnswers, exportSave, myAnswersCode, type LocalSave } from './session';

const make = (me: 'A' | 'B', cp: Partial<NonNullable<LocalSave['cp']>> = {}): LocalSave => ({
  schema: 1, me, pairId: ANSWER_RESET.pair, replay: ANSWER_RESET.replay, secret: 's3cret', seed: 'x', phase: 'checkpoint', setups: {},
  base: { checkpoint: ANSWER_RESET.cp - 1 } as LocalSave['base'], state: {} as LocalSave['state'], segment: [], hashes: [], playSeconds: 0, updatedAt: 1,
  cp: { index: ANSWER_RESET.cp, mergedHash: 'm', ...cp },
});
const partner = (finished: boolean) => async () => exportSave({ ...make('A'), lastCheckpoint: { index: finished ? ANSWER_RESET.cp : ANSWER_RESET.cp - 1 } });

describe('разовая отмена ответа на КТ', () => {
  it('B выбирает заново, A забывает прежний ответ и принимает только новый', async () => {
    const oldB = make('B', { myAnswers: { q: 'old' } });
    const b = (await answerReset(oldB, partner(false)))!;
    expect(b.cp!.myAnswers).toBeUndefined(); expect(b.cp!.reset).toBe('mine');
    const a = (await answerReset(make('A', { partnerAnswers: { q: 'old' } }), partner(false)))!;
    expect(a.cp!.partnerAnswers).toBeUndefined(); expect(a.cp!.reset).toBe('partner');
    for (const s of [a, b]) expect(await answerReset(s, partner(false))).toBeUndefined();
    await expect(acceptPartnerAnswers(c, a, await myAnswersCode(oldB))).rejects.toThrow(/прежний/);
    const next = await acceptPartnerAnswers(c, a, await myAnswersCode({ ...b, cp: { ...b.cp!, myAnswers: { q: 'new' } } }));
    expect(next.cp!.partnerAnswers).toEqual({ q: 'new' });
    // Ответ A на B без пометки принимается как обычно.
    expect((await acceptPartnerAnswers(c, b, await myAnswersCode(make('A', { myAnswers: { q: 'a' } })))).cp!.partnerAnswers).toEqual({ q: 'a' });
  });

  it('не трогает другие пары, завершённую точку и случай, когда партнёр уже завершил точку или неизвестно', async () => {
    const b = make('B', { myAnswers: { q: 'old' } });
    expect(await answerReset({ ...b, pairId: 'other' }, partner(false))).toBeUndefined();
    expect(await answerReset({ ...b, cp: { ...b.cp!, index: 11 } }, partner(false))).toBeUndefined();
    expect(await answerReset({ ...b, cp: { ...b.cp!, result: { joint: [], hash: 'h' } } }, partner(false))).toBeUndefined();
    expect(await answerReset(b, partner(true))).toBeUndefined();
    expect(await answerReset(b, async () => undefined)).toBeUndefined();
  });
});
