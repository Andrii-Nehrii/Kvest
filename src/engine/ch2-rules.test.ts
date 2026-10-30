// Правила главы 2 (rules.ts): каждое исправление механики действует только с КТ 2,
// а до неё всё считается так же, как в сыгранной главе 1.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions } from './actions';
import { newBody, symptoms, tickBody, checkThresholds, type Environment } from './body';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, syncClocks } from './checkpoint';
import type { Content } from './content-types';
import { applyEffects } from './effects';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from './game';
import { stateHash } from './rng';
import { ch2Rules } from './rules';
import { applyStandingRules } from './simulate';
import type { Body, GameState, Injury, PlayerId, Traits } from './types';
import { environment, giveItem, heldItems, type Ctx } from './world';
import { START_TIME } from '../app/session';
import { content as real } from '../content/index';

const TRAITS: Traits = { strength: 3, endurance: 3, agility: 3, melee: 2, medicine: 1, driving: 3, stealth: 2, persuasion: 3, technical: 2 };
const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const RAIN: Content = { ...real, weather: () => ({ tempC: 6, rain: true, wind: 15 }) };
const safeScene = Object.values(real.scenes).find((s) => s.for === 'A' && s.safe && s.universal !== false)!;

/** Игра на реальном сюжете; v2 — мир после КТ 2. A стоит в безопасной сцене. */
function game(v2: boolean, c: Content = real): { s: GameState; ctx: Ctx; c: Content } {
  const s = newGame(c, { pairId: 'p', seed: 'ch2', startTime: START_TIME, players: { A: { name: forms('A') }, B: { name: forms('B') } } });
  s.checkpoint = v2 ? 2 : 0;
  s.chars.A.scene = safeScene.id;
  s.chars.A.location = safeScene.location ?? s.chars.A.location;
  for (const i of heldItems({ s, c, pid: 'A' })) if (c.items[i.type].food || c.items[i.type].clothing) i.at = { kind: 'gone' };
  return { s, ctx: { s, c, pid: 'A' }, c };
}

const ROOM: Environment = { tempC: 20, wet: false, outdoor: false, warmth: 3 };
const wound = (kind: Injury['kind'], severity: Injury['severity'], bleeding: number, treated: Injury['treated'] = 'none'): Injury =>
  ({ id: `w-${kind}`, kind, site: 'leftArm', severity, bleeding, treated, since: 0, woundInfected: false, healed: 0 });

/** Тело в тёплой комнате; жажду держим (если нужно), чтобы не умереть от обезвоживания раньше времени. */
function live(b: Body, hours: number, v2: boolean, opts: { thirst?: number; step?: number; env?: Environment; until?: (b: Body) => boolean } = {}) {
  const step = opts.step ?? 15;
  let t = 0;
  for (; t < hours * 60 && b.consciousness !== 'dead'; t += step) {
    if (opts.thirst !== undefined) b.thirst = opts.thirst;
    tickBody(b, TRAITS, t, step, 'rest', opts.env ?? ROOM, 'k', v2);
    if (opts.until?.(b)) return (t + step) / 60;
  }
  return t / 60;
}

describe('правила главы 2 включаются по номеру КТ', () => {
  it('признак — КТ мира ≥ 2', () => {
    expect(ch2Rules({ checkpoint: 0 })).toBe(false);
    expect(ch2Rules({ checkpoint: 1 })).toBe(false);
    expect(ch2Rules({ checkpoint: 2 })).toBe(true);
  });

  const fx = new URL('../content/fixtures/release-1.json', import.meta.url);
  it.runIf(existsSync(fx))('КТ 1 и КТ 2 эталонной игры пересчитываются бит в бит (сведение часов, слияние, итог)', () => {
    const legs = (JSON.parse(readFileSync(fx, 'utf8')) as { legs: { base: GameState; records: Record<PlayerId, ActionRecord[]> }[] }).legs;
    const answers: Record<PlayerId, Record<string, string>>[] = [{ A: { meet: 'b_to_a' }, B: { meet: 'b_to_a' } }, { A: { shelter: 'farm' }, B: { shelter: 'farm' } }];
    for (let k = 0; k < 2; k++) {
      const base = legs[k].base;
      const A = replaySegment(real, base, 'A', legs[k].records.A);
      const B = replaySegment(real, base, 'B', legs[k].records.B);
      const merged = mergeSegments(real, base, { A, B });
      const cp = real.checkpoints.find((x) => x.index === base.checkpoint + 1)!;
      syncClocks(real, merged, cp.syncNotBefore);
      deliverMessages(real, merged);
      mergeNotes(real, merged, cp.index);
      expect(stateHash(completeCheckpoint(real, merged, answers[k]).state), `КТ ${k + 1}`).toBe(stateHash(legs[k + 1].base));
    }
    expect(ch2Rules(legs[2].base)).toBe(true);
  });
});

describe('1. жажда: сначала напитки', () => {
  for (const v2 of [false, true]) {
    it(v2 ? 'глава 2: вода, а не яблоко' : 'до КТ 2: как раньше — яблоко', () => {
      const { s, ctx } = game(v2);
      giveItem(ctx, 'apple', 2);
      giveItem(ctx, 'water_15', 1);
      s.chars.A.body.thirst = 50;
      const drink = availableActions(ctx).find((a) => a.def.id === 'u:drink')!;
      expect(drink.def.effects?.[0]).toEqual({ take: v2 ? 'water_15' : 'apple' });
      applyStandingRules(ctx);
      const left = (t: string) => heldItems(ctx).filter((i) => i.type === t).reduce((n, i) => n + i.qty, 0);
      expect([left('apple'), left('water_15')]).toEqual(v2 ? [2, 0] : [1, 1]);
    });
  }
});

describe('2–4. кровь', () => {
  it('2. царапина: до КТ 2 кровь не восстанавливается неделю, в главе 2 — восстанавливается', () => {
    for (const v2 of [false, true]) {
      const b = newBody(0);
      b.bloodLoss = 20;
      b.injuries.push(wound('scratch', 1, 0.5, 'proper'));
      live(b, 48, v2, { thirst: 10 });
      if (v2) { expect(b.bloodLoss).toBeLessThan(1); expect(b.injuries[0].bleeding).toBe(0); }
      else expect(b.bloodLoss).toBeGreaterThanOrEqual(20);
    }
  });

  it('3. обморок от кровопотери при жажде: до КТ 2 — не очнуться, в главе 2 — приходит в себя', () => {
    for (const v2 of [false, true]) {
      const b = newBody(0);
      b.bloodLoss = 56;
      b.thirst = 60;
      checkThresholds(b, 0);
      expect(b.consciousness).toBe('unconscious');
      const woke = live(b, 72, v2, { until: (x) => x.consciousness === 'awake' });
      if (v2) expect(woke).toBeLessThan(20);
      else expect(b.consciousness).not.toBe('awake');
    }
  });

  it('4. тяжёлая рана под повязкой: до КТ 2 — кровотечение навсегда, в главе 2 — останавливается', () => {
    for (const v2 of [false, true]) for (const treated of ['proper', 'basic'] as const) {
      const b = newBody(0);
      b.injuries.push({ ...wound('laceration', 4, 28, treated), treatedAt: 0 });
      live(b, 96, v2, { thirst: 10 });
      if (v2) { expect(b.consciousness).toBe('awake'); expect(b.injuries[0].bleeding).toBe(0); }
      else expect(b.causeOfDeath).toBe('кровопотеря');
    }
  });

  it('4. время обработки записывается только в главе 2', () => {
    for (const v2 of [false, true]) {
      const { s, ctx } = game(v2);
      applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 2 }, { treat: 'basic' }]);
      expect(s.chars.A.body.injuries[0].treatedAt).toBe(v2 ? s.chars.A.time : undefined);
    }
  });
});

describe('5. обморок', () => {
  for (const v2 of [false, true]) {
    it(v2 ? 'глава 2: ровно столько, сколько указано' : 'до КТ 2: короткий — до КТ, длинный — полчаса', () => {
      for (const minutes of [10, 120]) {
        const { s, ctx, c } = game(v2);
        const t0 = s.chars.A.time;
        applyEffects(ctx, [{ faint: minutes }]);
        const b = s.chars.A.body;
        if (v2) {
          expect(b.consciousness).toBe('awake');
          expect(b.awakeSince).toBe(t0 + minutes);
          expect(b.faintUntil).toBeUndefined();
        } else if (minutes < 30) {
          expect(segmentFinished(c, s, 'A')).toBe('incapacitated');
        } else {
          expect(b.awakeSince).toBe(t0 + 30);
        }
      }
    });
  }
});

describe('6. перевязка', () => {
  it('пустой антисептик: до КТ 2 «промыть», в главе 2 — только перевязать', () => {
    for (const v2 of [false, true]) {
      const { s, ctx } = game(v2);
      giveItem(ctx, 'first_aid', 1);
      giveItem(ctx, 'disinfectant', 1, { charge: 0 });
      applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 2 }]);
      const treat = availableActions(ctx).find((a) => a.def.id === 'u:treat')!;
      play(ctx.c, s, 'A', ['u:treat']);
      expect(s.chars.A.body.injuries[0].treated).toBe(v2 ? 'basic' : 'proper');
      expect(treat.def.label).toBe(v2 ? 'Перевязать раны тем, что есть' : 'Промыть и перевязать раны');
    }
  });

  it('аптечка на 4 перевязки: до КТ 2 уходит целиком, в главе 2 — по одной', () => {
    for (const v2 of [false, true]) {
      const { s, ctx } = game(v2);
      giveItem(ctx, 'first_aid', 2);
      giveItem(ctx, 'disinfectant', 1);
      const kits = () => heldItems(ctx).filter((i) => i.type === 'first_aid').map((i) => `${i.qty}:${i.uses ?? 'new'}`).sort();
      let treated = 0;
      for (let n = 0; n < 5; n++) {
        applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 1 }]);
        if (!availableActions(ctx).some((a) => a.def.id === 'u:treat')) break;
        play(ctx.c, s, 'A', ['u:treat']);
        treated++;
        if (n === 0) expect(kits()).toEqual(v2 ? ['1:3', '1:new'] : ['1:new']);
      }
      // Две аптечки: до КТ 2 — две перевязки, в главе 2 — пять из восьми, начатая тратится первой.
      expect([treated, kits()]).toEqual(v2 ? [5, ['1:3']] : [2, []]);
    }
  });

  it('перевязку «кое-как» в главе 2 можно переделать как следует', () => {
    for (const v2 of [false, true]) {
      const { s, ctx } = game(v2);
      giveItem(ctx, 'towel', 1);
      applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 2 }]);
      play(ctx.c, s, 'A', ['u:treat']);
      expect(s.chars.A.body.injuries[0].treated).toBe('basic');
      giveItem(ctx, 'bandages', 1);
      giveItem(ctx, 'disinfectant', 1);
      const again = availableActions(ctx).some((a) => a.def.id === 'u:treat');
      expect(again).toBe(v2);
      if (v2) { play(ctx.c, s, 'A', ['u:treat']); expect(s.chars.A.body.injuries[0].treated).toBe('proper'); }
    }
  });
});

describe('7. пауэрбанк', () => {
  it('пустой пауэрбанк не заряжает: до КТ 2 списывался пустой, в главе 2 — заряженный', () => {
    for (const v2 of [false, true]) {
      const { s, ctx } = game(v2);
      giveItem(ctx, 'powerbank', 1, { charge: 0 });
      giveItem(ctx, 'powerbank', 1, { charge: 50 });
      heldItems(ctx).find((i) => i.type === 'phone')!.charge = 30;
      play(ctx.c, s, 'A', ['u:powerbank']);
      const banks = heldItems(ctx).filter((i) => i.type === 'powerbank').map((i) => i.charge).sort();
      expect(banks).toEqual(v2 ? [0, 40] : [0, 50]);
    }
  });
});

describe('8. заживление', () => {
  it('до КТ 2 скорость зависит от шага на ±20 %, в главе 2 — нет', () => {
    for (const v2 of [false, true]) {
      const healed = [15, 20].map((step) => {
        const b = newBody(0);
        b.injuries.push(wound('fracture', 5, 0));
        live(b, 5 * 24, v2, { thirst: 10, step });
        return b.injuries[0].healed;
      });
      const spread = Math.abs(healed[0] - healed[1]) / Math.max(...healed);
      if (v2) expect(spread).toBeLessThan(0.01);
      else expect(spread).toBeGreaterThan(0.1);
    }
  });
});

describe('9. мокрая одежда', () => {
  it('дождевик защищает только в главе 2', () => {
    for (const v2 of [false, true]) {
      const { s, ctx } = game(v2, RAIN);
      s.chars.A.location = 'a_street';
      s.chars.A.scene = Object.values(RAIN.scenes).find((x) => x.for === 'A' && x.location === 'a_street' && !x.ambient)?.id ?? s.chars.A.scene;
      const bare = environment(ctx);
      giveItem(ctx, 'rain_jacket', 1);
      const shielded = environment(ctx);
      expect(bare.wet).toBe(true);
      expect(shielded.wet).toBe(true);
      if (v2) { expect(bare.rain).toBe(1); expect(shielded.rain).toBeLessThan(0.2); }
      else { expect(bare.rain).toBeUndefined(); expect(shielded.rain).toBeUndefined(); }
    }
  });

  it('в главе 2 одежда намокает за полчаса и сохнет под крышей; до КТ 2 «мокро» только под дождём', () => {
    const rain: Environment = { tempC: 4.5, wet: true, outdoor: true, warmth: 3.5, rain: 1, dryPerHour: 0.15 };
    for (const v2 of [false, true]) {
      const b = newBody(0);
      live(b, 0.5, v2, { env: rain });
      expect(b.wet).toBe(v2 ? 1 : undefined);
      expect(symptoms(b, 30).includes('Одежда промокла насквозь')).toBe(v2);
      live(b, 1, v2, { env: { ...ROOM, rain: 0, dryPerHour: 0.5 } });
      if (v2) expect(b.wet).toBeCloseTo(0.5, 2);
      live(b, 1.5, v2, { env: { ...ROOM, rain: 0, dryPerHour: 0.5 } });
      expect(b.wet).toBeUndefined();
    }
  });

  it('в главе 2 в дождевике под дождём мёрзнешь меньше; до КТ 2 дождевик не помогал', () => {
    const temps = [false, true].map((v2) => {
      const b = newBody(0);
      live(b, 8, v2, { env: { tempC: 4.5, wet: true, outdoor: true, warmth: 3, rain: 0.15, dryPerHour: 0.15 } });
      return b.coreTemp;
    });
    expect(temps[1]).toBeGreaterThan(temps[0] + 0.5);
  });

  it('одежда считается по одной вещи на слот — запасная в рюкзаке не греет', () => {
    const { ctx } = game(true);
    giveItem(ctx, 'hoodie', 1);
    const one = environment(ctx).warmth;
    giveItem(ctx, 'hoodie', 1);
    giveItem(ctx, 'rain_jacket', 1);
    expect(environment(ctx).warmth).toBe(one);
  });
});
