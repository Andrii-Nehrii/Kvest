// Ядро движка: план из нескольких действий, слияние участков, сведение часов, совместные решения,
// NPC, база. Каждая проверка — на исправленную ошибку; общее свойство — оба телефона считают одинаково.
import { describe, expect, it } from 'vitest';
import { availableActions, CARRY_HARD_FACTOR, validatePlan } from './actions';
import { stockAt, workOnProject } from './base';
import { tickBody } from './body';
import { completeCheckpoint, mergeSegments, resolveHelplessness, resolveJoint, syncClocks } from './checkpoint';
import type { Content } from './content-types';
import { applyEffects } from './effects';
import { newGame, play, replaySegment, type ActionRecord } from './game';
import { stateHash } from './rng';
import { advanceTime, applyStandingRules } from './simulate';
import { testContent, testSetup } from './test-content';
import { at } from './time';
import type { GameState, PlayerId } from './types';
import { carriedWeight, carryLimit, countItem, environment, heldItems, type Ctx } from './world';
import { evalCond } from './conditions';

const clone = <T,>(x: T): T => structuredClone(x);
/** Вариант тестового мира: данные копируются, функции (погода, отопление) — те же. */
function variant(edit: (c: Content) => void): Content {
  const c: Content = {
    ...testContent,
    scenes: JSON.parse(JSON.stringify(testContent.scenes)),
    npcs: JSON.parse(JSON.stringify(testContent.npcs)),
    joint: JSON.parse(JSON.stringify(testContent.joint)),
    events: JSON.parse(JSON.stringify(testContent.events)),
    locations: JSON.parse(JSON.stringify(testContent.locations)),
    bases: testContent.bases?.map((b) => ({ ...b })),
    mergePolicies: { ...testContent.mergePolicies },
  };
  edit(c);
  return c;
}
const fresh = (c: Content = testContent) => newGame(c, testSetup);
const ctxOf = (s: GameState, pid: PlayerId, c: Content = testContent): Ctx => ({ s, c, pid });

describe('план: условие и очерёдность раздельно', () => {
  const c = variant((c) => {
    c.scenes.a_start.actions.push(
      { id: 'ask', label: 'Спросить', minutes: 1, combinable: true },
      { id: 'note', label: 'Записать', minutes: 1, combinable: true },
      { id: 'buy', label: 'Купить', minutes: 1, combinable: true, requiresDone: ['ask'], enabled: { has: 'crowbar' }, disabledReason: 'Нужна монтировка', effects: [{ set: '$.bought', value: true }] },
      { id: 'both', label: 'Оба', minutes: 1, combinable: true, requiresDone: ['ask', 'note'] },
    );
  });

  it('невыполненное условие не обходится тем, что «сначала» стоит в плане', () => {
    const s = fresh(c);
    const v = validatePlan(ctxOf(s, 'A', c), ['ask', 'buy']);
    expect(v.ok).toBe(false);
    expect(v.errors.join(' ')).toMatch(/монтировка/);
    expect(() => play(c, s, 'A', ['ask', 'buy'])).toThrow();
    expect(s.vars['A.bought']).toBeUndefined();
  });

  it('условие выполнено — «сначала X, потом Y» в одном плане работает; причина недоступности — какой шаг нужен', () => {
    const s = fresh(c);
    applyEffects(ctxOf(s, 'A', c), [{ give: 'crowbar' }]);
    const buy = availableActions(ctxOf(s, 'A', c)).find((a) => a.def.id === 'buy')!;
    expect(buy.enabled).toBe(false);
    expect(buy.reason).toMatch(/Спросить/);
    expect(validatePlan(ctxOf(s, 'A', c), ['buy', 'ask']).ok).toBe(false);
    play(c, s, 'A', ['ask', 'buy']);
    expect(s.vars['A.bought']).toBe(true);
  });

  it('часть предварительных шагов уже сделана, остальные — в плане раньше', () => {
    const s = fresh(c);
    play(c, s, 'A', ['ask']);
    expect(validatePlan(ctxOf(s, 'A', c), ['note', 'both']).ok).toBe(true);
    expect(validatePlan(ctxOf(s, 'A', c), ['both']).ok).toBe(false);
  });
});

describe('сведение часов', () => {
  it('отставший теряет сознание или гибнет, пока ждёт, — часы всё равно доходят до общего момента', () => {
    const c = variant((c) => { c.weather = () => ({ tempC: -15, rain: true, wind: 40 }); });
    const s = fresh(c);
    s.chars.A.location = 'street';
    s.chars.A.scene = 'a_street';
    s.chars.A.body.coreTemp = 31;
    s.chars.B.time += 600;
    syncClocks(c, s);
    expect(s.chars.A.body.consciousness).not.toBe('awake');
    expect(s.chars.A.time).toBe(s.chars.B.time);
  });

  it('недееспособного, которого ведёт партнёр, время не проживается дважды', () => {
    const s = fresh();
    s.chars.A.body.consciousness = 'unconscious';
    s.chars.A.body.bloodLoss = 60;
    s.chars.A.controlledBy = 'B';
    const t0 = s.chars.A.time;
    const ref = clone(s.chars.A.body);
    tickBody(ref, s.chars.A.traits, t0, 120, 'rest', environment(ctxOf(s, 'A')), `${s.seed}:A`);
    syncClocks(testContent, s, t0 + 120);
    expect([s.chars.A.time, s.chars.B.time]).toEqual([t0 + 120, t0 + 120]);
    expect(s.chars.A.body.thirst).toBe(ref.thirst);
  });

  it('пока ждёт на точке в спокойном месте, по привычке пьёт', () => {
    const s = fresh();
    s.chars.A.body.thirst = 44;
    s.chars.B.time += 180;
    syncClocks(testContent, s);
    expect(countItem(ctxOf(s, 'A'), 'water')).toBe(0);
  });

  it('оба без сознания: часы обоих идут вместе, пока кто-то не очнётся', () => {
    const s = fresh();
    for (const p of ['A', 'B'] as const) { s.chars[p].body.consciousness = 'unconscious'; s.chars[p].body.bloodLoss = 56; }
    expect(resolveHelplessness(testContent, s)).toBe('continue');
    expect(s.chars.A.time).toBe(s.chars.B.time);
  });
});

describe('слияние участков', () => {
  it('один унёс стопку, другой взял из неё часть — ничего не теряется и не удваивается; порядок не важен', () => {
    const base = fresh();
    base.items['it-X'] = { id: 'it-X', type: 'water_l', qty: 10, condition: 100, at: { kind: 'place', id: 'shed' }, changedAt: 0 };
    const a = clone(base); a.chars.A.location = 'shed'; a.chars.A.time += 30;
    applyEffects(ctxOf(a, 'A'), [{ pickup: 'water_l' }]);
    const b = clone(base); b.chars.B.location = 'shed'; b.chars.B.time += 60;
    applyEffects(ctxOf(b, 'B'), [{ pickup: 'water_l', qty: 3 }]);
    const m = mergeSegments(testContent, base, { A: a, B: b });
    const mc = (p: PlayerId) => countItem(ctxOf(m, p), 'water_l');
    expect([mc('A'), mc('B'), stockAt(ctxOf(m, 'A'), 'shed', 'water_l')]).toEqual([7, 3, 0]);
    expect(stateHash(mergeSegments(testContent, base, { B: b, A: a }))).toBe(stateHash(m));
  });

  it('NPC: место из участка, где его увели, не откатывает более позднее изменение другого поля', () => {
    const base = fresh();
    const a = clone(base); a.chars.A.time += 30;
    applyEffects(ctxOf(a, 'A'), [{ npc: 'nadia', moveTo: 'flatA', set: { coat: true } }]);
    const b = clone(base); b.chars.B.time += 90;
    applyEffects(ctxOf(b, 'B'), [{ npc: 'nadia', trust: 20, set: { fed: true } }]);
    const m = mergeSegments(testContent, base, { A: a, B: b });
    expect(m.npcs.nadia.location).toBe('flatA');
    expect(m.npcs.nadia.vars).toEqual({ coat: true, fed: true });
    expect(m.npcs.nadia.trust.B).toBe(20);
  });

  it('работа над одним проектом в двух участках складывается', () => {
    const base = fresh();
    base.vars['proj.tractor.started'] = true;
    const a = clone(base); a.vars['proj.tractor.progress'] = 4; a.varTime['proj.tractor.progress'] = base.chars.A.time + 10;
    const b = clone(base); b.vars['proj.tractor.progress'] = 3; b.varTime['proj.tractor.progress'] = base.chars.B.time + 20;
    const m = mergeSegments(testContent, base, { A: a, B: b });
    expect(m.vars['proj.tractor.progress']).toBe(7);
    const r = workOnProject(ctxOf(m, 'A'), 'tractor', 2);
    expect([r.minutes, m.vars['proj.tractor.done']]).toEqual([0, true]);
  });

  it('событие мира у отставшего не перезаписывает то, что партнёр изменил позже', () => {
    const c = variant((c) => { c.events.push({ id: 'ev_gate', at: at(10, 8, 0), scope: 'world', effects: [{ set: 'w.gate', value: 'closed' }] }); });
    const base = fresh(c);
    const a = clone(base);
    advanceTime(ctxOf(a, 'A', c), 120, 'rest');
    applyEffects(ctxOf(a, 'A', c), [{ set: 'w.gate', value: 'open' }]);
    const b = clone(base);
    advanceTime(ctxOf(b, 'B', c), 30, 'rest');
    const m = mergeSegments(c, base, { A: a, B: b });
    syncClocks(c, m);
    expect(m.vars['w.gate']).toBe('open');
  });

  it('общий пункт плана NPC, уже выполненный на линии партнёра, не повторяется у отставшего', () => {
    const c = variant((c) => {
      c.npcs.nadia.agenda = [{ id: 'walk', at: at(10, 8, 0), scope: 'world', effects: [{ npc: 'nadia', moveTo: 'street' }] }];
    });
    const base = fresh(c);
    const a = clone(base);
    advanceTime(ctxOf(a, 'A', c), 120, 'rest');
    applyEffects(ctxOf(a, 'A', c), [{ npc: 'nadia', moveTo: 'flatA' }]);
    const b = clone(base);
    const m = mergeSegments(c, base, { A: a, B: b });
    syncClocks(c, m);
    expect(m.npcs.nadia.location).toBe('flatA');
  });
});

describe('NPC: смерть необратима', () => {
  it('план погибшего не выполняется, а эффект состояния его не «оживляет»', () => {
    const c = variant((c) => {
      c.npcs.nadia.agenda = [{ id: 'turn', at: at(10, 9, 0), scope: 'A', effects: [{ npc: 'nadia', status: 'turned', moveTo: 'street' }] }];
    });
    const s = fresh(c);
    applyEffects(ctxOf(s, 'A', c), [{ npc: 'nadia', alive: false }, { npc: 'nadia', status: 'turned' }]);
    expect(s.npcs.nadia.status).toBe('dead');
    advanceTime(ctxOf(s, 'A', c), 180, 'rest');
    expect([s.npcs.nadia.status, s.npcs.nadia.location]).toEqual(['dead', 'shed']);
  });
});

describe('совместные решения', () => {
  it('обстоятельство не выбирает объективно невозможный вариант', () => {
    const c = variant((c) => {
      c.joint.plan.arbiters = [
        { id: 'panic', when: { always: true }, winner: 'evac', text: 'Паника.' },
        { id: 'storm', when: { always: true }, winner: 'stay', text: 'Шторм.' },
      ];
    });
    const s = fresh(c);
    s.vars['w.road'] = 'closed';
    const r = resolveJoint(c, s, 'plan', { A: 'stay', B: 'evac' });
    expect(r.applied).toEqual(['stay']);
  });
});

describe('контрольная точка', () => {
  it('начало участка отмечается там, где игрок окажется после точки', () => {
    const c = variant((c) => { c.scenes.a_next.location = 'shed'; });
    const out = completeCheckpoint(c, fresh(c), { A: { plan: 'stay' }, B: { plan: 'stay' } });
    expect(out.state.vars['seg.loc.A']).toBe('shed');
  });
});

describe('база кормит тех, кто на ней живёт', () => {
  const c = variant((c) => { c.bases = [{ ...c.bases![0], heating: undefined }]; });
  function day(stocked: boolean) {
    const s = fresh(c);
    if (stocked) applyEffects(ctxOf(s, 'B', c), [{ place: 'rice', at: 'shed', qty: 4 }, { place: 'water_l', at: 'shed', qty: 20 }]);
    // B на базе (квартира B входит в базу) вместе с Надей (доверяет — не уходит), часы — на 05:00 следующего дня.
    s.npcs.nadia.trust.B = 20;
    s.chars.B.time = at(11, 5, 0);
    s.chars.B.body.hunger = 30;
    s.chars.B.body.thirst = 30;
    advanceTime(ctxOf(s, 'B', c), 15 * 60, 'light');
    return s;
  }

  it('трапезы снимают голод и жажду; склад тратится один раз — на двоих', () => {
    const fed = day(true);
    const hungry = day(false);
    expect(fed.chars.B.body.thirst).toBeLessThan(hungry.chars.B.body.thirst - 60);
    expect(fed.chars.B.body.hunger).toBeLessThan(hungry.chars.B.body.hunger - 40);
    expect(fed.chars.B.body.thirst).toBeLessThan(45); // бытовое правило «пить» не полезет в рюкзак
    expect(stockAt(ctxOf(fed, 'B', c), 'shed', 'water_l')).toBe(14);
    expect(fed.vars['B.ration.farm.water']).toBe(1);
  });

  it('кто не на базе, тот с общего стола не ест', () => {
    const s = fresh(c);
    applyEffects(ctxOf(s, 'B', c), [{ place: 'rice', at: 'shed', qty: 4 }, { place: 'water_l', at: 'shed', qty: 20 }]);
    s.chars.A.time = at(11, 5, 0);
    const before = s.chars.A.body.thirst;
    advanceTime(ctxOf(s, 'A', c), 15 * 60, 'light');
    expect(s.chars.A.body.thirst).toBeGreaterThan(before + 40);
    expect(s.vars['A.ration.farm']).toBeUndefined();
  });

  it('то же самое на телефоне партнёра: журнал воспроизводится бит в бит', () => {
    const base = fresh(c);
    applyEffects(ctxOf(base, 'B', c), [{ place: 'rice', at: 'shed', qty: 4 }, { place: 'water_l', at: 'shed', qty: 20 }]);
    base.chars.B.time = at(10, 21, 0);
    const live = clone(base);
    const recs: ActionRecord[] = [];
    for (const plan of [['u:sleep'], ['radio'], ['u:rest']]) { recs.push({ scene: live.chars.B.scene, plan }); play(c, live, 'B', plan); }
    expect(stateHash(replaySegment(c, base, 'B', recs))).toBe(stateHash(live));
  });
});

describe('вещи', () => {
  it('«Взять» уносит не больше, чем можно нести; остальное остаётся', () => {
    const s = fresh();
    const ctx = ctxOf(s, 'B');
    applyEffects(ctx, [{ place: 'water_l', at: 'flatB', qty: 60 }]);
    const take = availableActions(ctx).find((a) => a.def.id === 'u:take:water_l')!;
    play(testContent, s, 'B', ['u:take:water_l']);
    const carried = heldItems(ctx).reduce((g, i) => g + testContent.items[i.type].weight * i.qty, 0);
    expect(carried).toBeLessThanOrEqual(carryLimit(ctx) * CARRY_HARD_FACTOR);
    expect(countItem(ctx, 'water_l')).toBeGreaterThan(0);
    expect(take.def.label).toMatch(/из 60/);
  });

  it('привычка пить: есть водопровод — пьют из-под крана, запасы не трогают', () => {
    const c = variant((c) => { c.locations.flatA.water = true; });
    const s = fresh(c);
    s.chars.A.body.thirst = 50;
    applyStandingRules(ctxOf(s, 'A', c));
    expect([countItem(ctxOf(s, 'A', c), 'water'), s.chars.A.body.thirst]).toEqual([1, 15]);
  });

  it('эффекты с нулевым количеством и «прибавить» к строке не ломают мир', () => {
    const s = fresh();
    const n = Object.keys(s.items).length;
    applyEffects(ctxOf(s, 'A'), [{ give: 'water', qty: 0 }, { give: 'water', qty: -2 }, { place: 'rice', at: 'shed', qty: 0 }]);
    expect(Object.keys(s.items).length).toBe(n);
    expect(countItem(ctxOf(s, 'A'), 'water')).toBe(1);
    s.vars['w.x'] = 'abc';
    applyEffects(ctxOf(s, 'A'), [{ add: 'w.x', value: 2 }]);
    expect(s.vars['w.x']).toBe(2);
  });
});

describe('машина, канистра, заряд', () => {
  it('бензин кончился в пути: персонаж остаётся в сцене, а не «приезжает»', () => {
    const c = variant((x) => {
      x.scenes.a_start.actions.push({ id: 'far', label: 'Уехать далеко', minutes: 60, goto: 'a_start2', terminal: true, effects: [{ drive: 'golf', km: 2000, to: 'flatB' }] });
      x.scenes.a_start2 = { id: 'a_start2', for: 'A', chapter: 't', location: 'flatB', text: [], actions: [] };
    });
    const s = newGame(c, testSetup);
    const ctx: Ctx = { s, c, pid: 'A' };
    applyEffects(ctx, [{ give: 'golf', fuel: 10 }]);
    const car = heldItems(ctx).find((i) => i.type === 'golf')!;
    car.at = { kind: 'place', id: s.chars.A.location };
    play(c, s, 'A', ['far']);
    expect(s.chars.A.scene).toBe('a_start');
    expect(s.chars.A.location).toBe('flatA');
    expect(car.fuel).toBe(0);
  });

  it('канистра весит вместе с топливом', () => {
    const s = newGame(testContent, testSetup);
    const ctx: Ctx = { s, c: testContent, pid: 'A' };
    const before = carriedWeight(ctx);
    applyEffects(ctx, [{ give: 'can_petrol', fuel: 10 }]);
    expect(carriedWeight(ctx) - before).toBe(1000 + 7400);
  });

  it('условие «заряжено не меньше» смотрит на заряд, а не на наличие', () => {
    const s = newGame(testContent, testSetup);
    const ctx: Ctx = { s, c: testContent, pid: 'A' };
    expect(evalCond(ctx, { charged: 'phone', atLeast: 50 })).toBe(true);
    heldItems(ctx).find((i) => i.type === 'phone')!.charge = 10;
    expect(evalCond(ctx, { charged: 'phone', atLeast: 50 })).toBe(false);
  });
});
