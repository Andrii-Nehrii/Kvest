// Исправления механики тела и вещей: каждое — отдельной проверкой.
import { describe, expect, it } from 'vitest';
import { availableActions } from './actions';
import { newBody, symptoms, tickBody, checkThresholds, type Environment } from './body';
import type { Content } from './content-types';
import { applyEffects } from './effects';
import { newGame, play } from './game';
import { applyStandingRules } from './simulate';
import type { Body, GameState, Injury, Traits } from './types';
import { environment, giveItem, heldItems, type Ctx } from './world';
import { START_TIME } from '../app/session';
import { content as real } from '../content/index';

const TRAITS: Traits = { strength: 3, endurance: 3, agility: 3, melee: 2, medicine: 1, driving: 3, stealth: 2, persuasion: 3, technical: 2 };
const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const RAIN: Content = { ...real, weather: () => ({ tempC: 6, rain: true, wind: 15 }) };
const safeScene = Object.values(real.scenes).find((s) => s.for === 'A' && s.safe && s.universal !== false)!;

/** Игра на реальном сюжете: A стоит в безопасной сцене, без еды и одежды. */
function game(c: Content = real): { s: GameState; ctx: Ctx; c: Content } {
  const s = newGame(c, { pairId: 'p', seed: 'mech', startTime: START_TIME, players: { A: { name: forms('A') }, B: { name: forms('B') } } });
  s.chars.A.scene = safeScene.id;
  s.chars.A.location = safeScene.location ?? s.chars.A.location;
  for (const i of heldItems({ s, c, pid: 'A' })) if (c.items[i.type].food || c.items[i.type].clothing) i.at = { kind: 'gone' };
  return { s, ctx: { s, c, pid: 'A' }, c };
}

const ROOM: Environment = { tempC: 20, wet: false, outdoor: false, warmth: 3 };
const wound = (kind: Injury['kind'], severity: Injury['severity'], bleeding: number, treated: Injury['treated'] = 'none'): Injury =>
  ({ id: `w-${kind}`, kind, site: 'leftArm', severity, bleeding, treated, since: 0, woundInfected: false, healed: 0 });

/** Тело в тёплой комнате; жажду держим (если нужно), чтобы не умереть от обезвоживания раньше времени. */
function live(b: Body, hours: number, opts: { thirst?: number; step?: number; env?: Environment; until?: (b: Body) => boolean } = {}) {
  const step = opts.step ?? 15;
  let t = 0;
  for (; t < hours * 60 && b.consciousness !== 'dead'; t += step) {
    if (opts.thirst !== undefined) b.thirst = opts.thirst;
    tickBody(b, TRAITS, t, step, 'rest', opts.env ?? ROOM, 'k');
    if (opts.until?.(b)) return (t + step) / 60;
  }
  return t / 60;
}

describe('жажда', () => {
  it('«попить» и привычка пить берут воду, а не яблоко', () => {
    const { s, ctx } = game();
    giveItem(ctx, 'apple', 2);
    giveItem(ctx, 'water_15', 1);
    s.chars.A.body.thirst = 50;
    const drink = availableActions(ctx).find((a) => a.def.id === 'u:drink')!;
    expect(drink.def.effects?.[0]).toEqual({ take: 'water_15' });
    applyStandingRules(ctx);
    const left = (t: string) => heldItems(ctx).filter((i) => i.type === t).reduce((n, i) => n + i.qty, 0);
    expect([left('apple'), left('water_15')]).toEqual([2, 0]);
  });
});

describe('кровь', () => {
  it('после остановившегося кровотечения кровь восстанавливается', () => {
    const b = newBody(0);
    b.bloodLoss = 20;
    b.injuries.push(wound('scratch', 1, 0.5, 'proper'));
    live(b, 48, { thirst: 10 });
    expect(b.bloodLoss).toBeLessThan(1);
    expect(b.injuries[0].bleeding).toBe(0);
  });

  it('из обморока от кровопотери приходят в себя и при жажде', () => {
    const b = newBody(0);
    b.bloodLoss = 56;
    b.thirst = 60;
    checkThresholds(b, 0);
    expect(b.consciousness).toBe('unconscious');
    expect(live(b, 72, { until: (x) => x.consciousness === 'awake' })).toBeLessThan(20);
  });

  it('тяжёлая рана под повязкой со временем перестаёт кровоточить', () => {
    for (const treated of ['proper', 'basic'] as const) {
      const b = newBody(0);
      b.injuries.push({ ...wound('laceration', 4, 28, treated), treatedAt: 0 });
      live(b, 96, { thirst: 10 });
      expect(b.consciousness).toBe('awake');
      expect(b.injuries[0].bleeding).toBe(0);
    }
  });

  it('время обработки раны записывается', () => {
    const { s, ctx } = game();
    applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 2 }, { treat: 'basic' }]);
    expect(s.chars.A.body.injuries[0].treatedAt).toBe(s.chars.A.time);
  });
});

describe('обморок', () => {
  it('длится ровно столько, сколько указано — и короткий, и длинный', () => {
    for (const minutes of [10, 120]) {
      const { s, ctx } = game();
      const t0 = s.chars.A.time;
      applyEffects(ctx, [{ faint: minutes }]);
      const b = s.chars.A.body;
      expect(b.consciousness).toBe('awake');
      expect(b.awakeSince).toBe(t0 + minutes);
      expect(b.faintUntil).toBeUndefined();
    }
  });
});

describe('перевязка', () => {
  it('пустой антисептик не промывает — только перевязать', () => {
    const { s, ctx } = game();
    giveItem(ctx, 'first_aid', 1);
    giveItem(ctx, 'disinfectant', 1, { charge: 0 });
    applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 2 }]);
    const treat = availableActions(ctx).find((a) => a.def.id === 'u:treat')!;
    play(ctx.c, s, 'A', ['u:treat']);
    expect(s.chars.A.body.injuries[0].treated).toBe('basic');
    expect(treat.def.label).toBe('Перевязать раны тем, что есть');
  });

  it('аптечка на 4 перевязки тратится по одной, начатая — первой', () => {
    const { s, ctx } = game();
    giveItem(ctx, 'first_aid', 2);
    giveItem(ctx, 'disinfectant', 1);
    const kits = () => heldItems(ctx).filter((i) => i.type === 'first_aid').map((i) => `${i.qty}:${i.uses ?? 'new'}`).sort();
    let treated = 0;
    for (let n = 0; n < 5; n++) {
      applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 1 }]);
      if (!availableActions(ctx).some((a) => a.def.id === 'u:treat')) break;
      play(ctx.c, s, 'A', ['u:treat']);
      treated++;
      if (n === 0) expect(kits()).toEqual(['1:3', '1:new']);
    }
    expect([treated, kits()]).toEqual([5, ['1:3']]);
  });

  it('перевязку «кое-как» можно переделать как следует', () => {
    const { s, ctx } = game();
    giveItem(ctx, 'towel', 1);
    applyEffects(ctx, [{ injure: 'cut', site: 'leftArm', severity: 2 }]);
    play(ctx.c, s, 'A', ['u:treat']);
    expect(s.chars.A.body.injuries[0].treated).toBe('basic');
    giveItem(ctx, 'bandages', 1);
    giveItem(ctx, 'disinfectant', 1);
    play(ctx.c, s, 'A', ['u:treat']);
    expect(s.chars.A.body.injuries[0].treated).toBe('proper');
  });
});

describe('пауэрбанк', () => {
  it('заряд берётся из заряженного, пустой не заряжает', () => {
    const { s, ctx } = game();
    giveItem(ctx, 'powerbank', 1, { charge: 0 });
    giveItem(ctx, 'powerbank', 1, { charge: 50 });
    heldItems(ctx).find((i) => i.type === 'phone')!.charge = 30;
    play(ctx.c, s, 'A', ['u:powerbank']);
    expect(heldItems(ctx).filter((i) => i.type === 'powerbank').map((i) => i.charge).sort()).toEqual([0, 40]);
  });
});

describe('заживление', () => {
  it('скорость не зависит от шага симуляции', () => {
    const healed = [15, 20].map((step) => {
      const b = newBody(0);
      b.injuries.push(wound('fracture', 5, 0));
      live(b, 5 * 24, { thirst: 10, step });
      return b.injuries[0].healed;
    });
    expect(Math.abs(healed[0] - healed[1]) / Math.max(...healed)).toBeLessThan(0.01);
  });
});

describe('мокрая одежда', () => {
  it('дождевик защищает от дождя', () => {
    const { s, ctx } = game(RAIN);
    s.chars.A.location = 'a_street';
    s.chars.A.scene = Object.values(RAIN.scenes).find((x) => x.for === 'A' && x.location === 'a_street' && !x.ambient)?.id ?? s.chars.A.scene;
    const bare = environment(ctx);
    giveItem(ctx, 'rain_jacket', 1);
    const shielded = environment(ctx);
    expect([bare.wet, shielded.wet]).toEqual([true, true]);
    expect(bare.rain).toBe(1);
    expect(shielded.rain).toBeLessThan(0.2);
  });

  it('одежда намокает за полчаса и сохнет под крышей', () => {
    const b = newBody(0);
    live(b, 0.5, { env: { tempC: 4.5, wet: true, outdoor: true, warmth: 3.5, rain: 1, dryPerHour: 0.15 } });
    expect(b.wet).toBe(1);
    expect(symptoms(b, 30)).toContain('Одежда промокла насквозь');
    live(b, 1, { env: { ...ROOM, rain: 0, dryPerHour: 0.5 } });
    expect(b.wet).toBeCloseTo(0.5, 2);
    live(b, 1.5, { env: { ...ROOM, rain: 0, dryPerHour: 0.5 } });
    expect(b.wet).toBeUndefined();
  });

  it('в дождевике под дождём мёрзнешь меньше', () => {
    const temps = [1, 0.15].map((rain) => {
      const b = newBody(0);
      live(b, 8, { env: { tempC: 4.5, wet: true, outdoor: true, warmth: 3, rain, dryPerHour: 0.15 } });
      return b.coreTemp;
    });
    expect(temps[1]).toBeGreaterThan(temps[0] + 0.5);
  });

  it('одежда считается по одной вещи на слот — запасная в рюкзаке не греет', () => {
    const { ctx } = game();
    giveItem(ctx, 'hoodie', 1);
    const one = environment(ctx).warmth;
    giveItem(ctx, 'hoodie', 1);
    giveItem(ctx, 'rain_jacket', 1);
    expect(environment(ctx).warmth).toBe(one);
  });
});
