import { describe, expect, it } from 'vitest';
import { testContent as c } from '../engine/test-content';
import {
  acceptInvite, acceptJoin, acceptPartnerAnswers, acceptPartnerSegment, act, finishCheckpoint, myAnswersCode,
  myQuestions, mySegmentCode, readInvite, readyToFinish, worldCode, type LocalSave,
} from './session';

const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });

describe('два телефона: от приглашения до конца контрольной точки', () => {
  it('оба приходят к одному миру и не могут подменить чужие решения', async () => {
    const inv = await (await import('./session')).createInvite(c, 'A', { name: forms('Игорь') });
    const invite = await readInvite(c, inv.code);
    const joined = await acceptInvite(c, invite, { name: forms('Лена') });
    let phoneB: LocalSave = joined.save;
    let phoneA: LocalSave = await acceptJoin(c, inv.save, joined.code);
    expect(worldCode(phoneA)).toBe(worldCode(phoneB));

    for (const plan of [['look'], ['go'], ['cp']]) phoneA = act(c, phoneA, plan);
    for (const plan of [['radio'], ['shed'], ['cp']]) phoneB = act(c, phoneB, plan);
    expect(phoneA.phase).toBe('checkpoint');
    expect(phoneB.phase).toBe('checkpoint');

    const codeA = await mySegmentCode(c, phoneA);
    const codeB = await mySegmentCode(c, phoneB);
    phoneA = await acceptPartnerSegment(c, phoneA, codeB);
    phoneB = await acceptPartnerSegment(c, phoneB, codeA);
    phoneB = await acceptPartnerSegment(c, phoneB, codeA); // повтор того же кода безвреден
    expect(phoneA.cp!.mergedHash).toBe(phoneB.cp!.mergedHash);
    await expect(acceptPartnerSegment(c, phoneB, codeB)).rejects.toThrow(/собственный/);

    expect(myQuestions(c, phoneA).map((d) => d.id)).toEqual(['plan']);
    phoneA = { ...phoneA, cp: { ...phoneA.cp!, myAnswers: { plan: 'guard' } } };
    phoneB = { ...phoneB, cp: { ...phoneB.cp!, myAnswers: { plan: 'food' } } };
    expect(readyToFinish(c, phoneA)).toBe(false);
    phoneA = await acceptPartnerAnswers(c, phoneA, await myAnswersCode(phoneB));
    phoneB = await acceptPartnerAnswers(c, phoneB, await myAnswersCode(phoneA));
    phoneA = finishCheckpoint(c, phoneA);
    phoneB = finishCheckpoint(c, phoneB);
    expect(phoneA.baseHash).toBe(phoneB.baseHash);
    expect(phoneA.state!.vars['w.guard']).toBe(true);
    expect(phoneA.phase).toBe('playing');
    expect(phoneA.state!.chars.A.scene).toBe('a_next');
  });
});
