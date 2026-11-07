import { describe, expect, it } from 'vitest';
import { availableActions, enterScene } from './actions';
import { applyEffects } from './effects';
import { newGame } from './game';
import { advanceTime } from './simulate';
import { phone, phoneUsable } from './world';
import { content as c } from '../content';
import { players } from '../content/playtest';
import { START_TIME } from '../app/session';

const game = (cp: number) => {
  const s = newGame(c, { pairId: 'p', seed: 'phone', startTime: START_TIME, players });
  s.checkpoint = cp;
  s.chars.A.rules.chargePhoneWhenFreePower = false; // без бесплатной зарядки на месте
  s.firedEvents.fix_phone35_A = 0; // разовая поправка заряда после КТ13 — отдельно
  return { s, c, pid: 'A' as const };
};
const ids = (ctx: ReturnType<typeof game>) => availableActions(ctx).map((a) => a.def.id);

describe('выключение телефона', () => {
  it('до КТ13 выключить нельзя, эффект ничего не делает', () => {
    const ctx = game(12);
    expect(ids(ctx)).not.toContain('u:phone_off');
    applyEffects(ctx, [{ phonePower: false }]);
    expect(phone(ctx)!.off).toBeUndefined();
  });

  it('выключенный не садится и не принимает связь; включается обратно', () => {
    const ctx = game(13);
    expect(ids(ctx)).toContain('u:phone_off');
    applyEffects(ctx, [{ phonePower: false }]);
    const before = phone(ctx)!.charge;
    expect(phoneUsable(ctx)).toBe(false);
    expect(ids(ctx)).toContain('u:phone_on');
    advanceTime(ctx, 600, 'rest');
    expect(phone(ctx)!.charge).toBe(before);
    applyEffects(ctx, [{ phonePower: true }]);
    expect(phoneUsable(ctx)).toBe(true);
    advanceTime(ctx, 600, 'rest');
    expect(phone(ctx)!.charge!).toBeLessThan(before!);
  });

  it('пользоваться телефоном и дойти до точки — значит включить его', () => {
    const ctx = game(13);
    applyEffects(ctx, [{ phonePower: false }, { charge: 'phone', delta: -1 }]);
    expect(phone(ctx)!.off).toBeUndefined();
    applyEffects(ctx, [{ phonePower: false }]);
    enterScene(ctx, Object.values(c.scenes).find((x) => x.checkpoint === 14)!.id);
    expect(phone(ctx)!.off).toBeUndefined();
  });
});
