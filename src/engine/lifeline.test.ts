// Выбывание и спасение с участка 19 (решение владельца 12.11): пока партнёр может действовать, выбывший не умирает
// от крови, холода и жажды; умереть можно, только если партнёр не спас и сам выбыл. Партнёра можно донести или довезти.
import { describe, expect, it } from 'vitest';
import { canAct, isDead, LIFELINE_FROM } from './body';
import { completeCheckpoint, resolveHelplessness, syncClocks } from './checkpoint';
import type { Content } from './content-types';
import { applyEffects } from './effects';
import { newGame } from './game';
import { stateHash } from './rng';
import { advanceTime } from './simulate';
import { testContent, testSetup } from './test-content';
import type { GameState, PlayerId } from './types';
import type { Ctx } from './world';

const c: Content = {
  ...testContent,
  items: { ...testContent.items, car_keys: { id: 'car_keys', name: 'ключи от машины', weight: 50, tags: ['keys'] } },
};
const ctxOf = (s: GameState, pid: PlayerId): Ctx => ({ s, c, pid });
/** A выбыл с сильным кровотечением раньше; его ведёт линия B. */
function down(checkpoint: number) {
  const s = newGame(c, testSetup);
  s.checkpoint = checkpoint;
  for (const p of ['A', 'B'] as const) s.chars[p].location = 'shed';
  applyEffects(ctxOf(s, 'A'), [{ injure: 'laceration', site: 'leftLeg', severity: 5, bleeding: 18 }, { body: 'bloodLoss', delta: 56 }]);
  s.chars.A.controlledBy = 'B';
  return s;
}

describe('страховка жизни', () => {
  it('до участка 19 всё по-старому: без помощи выбывший истекает кровью', () => {
    const s = down(LIFELINE_FROM - 1);
    advanceTime(ctxOf(s, 'B'), 600, 'rest');
    expect(isDead(s.chars.A.body)).toBe(true);
  });

  it('с участка 19, пока партнёр на ногах, выбывший жив — но на краю', () => {
    const s = down(LIFELINE_FROM);
    expect(canAct(s.chars.A.body)).toBe(false);
    advanceTime(ctxOf(s, 'B'), 600, 'rest');
    expect(isDead(s.chars.A.body)).toBe(false);
    expect(s.chars.A.body.bloodLoss).toBeGreaterThanOrEqual(78);
    expect(s.chars.A.body.consciousness).toBe('coma');
  });

  it('сведение часов на точке: выбывший доживает до точки, если партнёр может действовать', () => {
    const old = down(LIFELINE_FROM - 1); old.chars.A.controlledBy = 'A'; old.chars.B.time += 600;
    syncClocks(c, old);
    expect(isDead(old.chars.A.body)).toBe(true);
    const s = down(LIFELINE_FROM); s.chars.A.controlledBy = 'A'; s.chars.B.time += 600;
    syncClocks(c, s);
    expect(isDead(s.chars.A.body)).toBe(false);
  });

  it('оба выбыли — страховки нет, смерть возможна', () => {
    const s = down(LIFELINE_FROM);
    applyEffects(ctxOf(s, 'B'), [{ injure: 'laceration', site: 'torso', severity: 5, bleeding: 18 }, { body: 'bloodLoss', delta: 60 }]);
    expect(canAct(s.chars.B.body)).toBe(false);
    expect(resolveHelplessness(c, s)).toBe('defeat');
    expect(isDead(s.chars.A.body)).toBe(true);
  });

  it('прямой удар сценой не убивает, пока партнёр на ногах', () => {
    const s = newGame(c, testSetup); s.checkpoint = LIFELINE_FROM;
    applyEffects(ctxOf(s, 'A'), [{ body: 'bloodLoss', delta: 120 }]);
    expect(isDead(s.chars.A.body)).toBe(false);
  });

  it('партнёр спасает: перевязка и помощь врача — выбывший приходит в себя, на точке снова играет сам', () => {
    const s = down(LIFELINE_FROM);
    advanceTime(ctxOf(s, 'B'), 120, 'rest');
    applyEffects(ctxOf(s, 'B'), [{ treat: 'proper', target: '@partner' }, { body: 'bloodLoss', delta: -50, target: '@partner' }]);
    advanceTime(ctxOf(s, 'B'), 120, 'rest');
    expect(canAct(s.chars.A.body)).toBe(true);
    expect(s.chars.A.time).toBe(s.chars.B.time);
  });
});

describe('донести или довезти партнёра', () => {
  it('пешком недалеко — тяжело и долго; далеко без помощи нельзя', () => {
    const s = down(LIFELINE_FROM);
    const t0 = s.chars.B.time;
    expect(applyEffects(ctxOf(s, 'B'), [{ carryPartner: { to: 'street', km: 8, minutes: 100 } }]).interrupted).toBe(true);
    expect(s.chars.A.location).toBe('shed');
    applyEffects(ctxOf(s, 'B'), [{ carryPartner: { to: 'street', km: 1, minutes: 15 } }]);
    expect([s.chars.A.location, s.chars.B.location]).toEqual(['street', 'street']);
    expect(s.chars.B.time - t0).toBeGreaterThan(15);
    expect(s.chars.A.time).toBe(s.chars.B.time);
  });

  it('на машине — с ключами и топливом, бензин тратится', () => {
    const s = down(LIFELINE_FROM);
    const ctx = ctxOf(s, 'B');
    applyEffects(ctx, [{ place: 'golf', at: 'shed' }, { give: 'car_keys' }]);
    const car = Object.values(s.items).find((i) => i.type === 'golf')!; car.fuel = 20;
    applyEffects(ctx, [{ carryPartner: { to: 'flatA', km: 30, minutes: 35, vehicle: 'golf' } }]);
    expect([s.chars.A.location, s.chars.B.location]).toEqual(['flatA', 'flatA']);
    expect(car.fuel).toBeLessThan(20);
  });

  it('нельзя: до участка 19, партнёр в сознании, партнёра нет рядом', () => {
    const early = down(LIFELINE_FROM - 1);
    expect(applyEffects(ctxOf(early, 'B'), [{ carryPartner: { to: 'street', km: 1, minutes: 15 } }]).interrupted).toBe(true);
    const fine = newGame(c, testSetup); fine.checkpoint = LIFELINE_FROM;
    expect(applyEffects(ctxOf(fine, 'B'), [{ carryPartner: { to: 'street', km: 1, minutes: 15 } }]).interrupted).toBe(true);
    const far = down(LIFELINE_FROM); far.chars.B.location = 'flatB';
    expect(applyEffects(ctxOf(far, 'B'), [{ carryPartner: { to: 'street', km: 1, minutes: 15 } }]).interrupted).toBe(true);
  });

  it('на точке выбывшего ведёт партнёр, а очнувшийся снова играет сам; оба телефона считают одинаково', () => {
    const s = down(LIFELINE_FROM);
    s.chars.A.controlledBy = 'A';
    const twin = structuredClone(s);
    for (const x of [s, twin]) syncClocks(c, x, x.chars.B.time + 60);
    expect(stateHash(s)).toBe(stateHash(twin));
    expect(isDead(s.chars.A.body)).toBe(false);
  });
});

// completeCheckpoint с тестовым контентом точек 18–19 нет; разведение по сценам проверяется в engine.test.ts.
void completeCheckpoint;
