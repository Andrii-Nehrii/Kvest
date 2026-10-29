import { describe, expect, it } from 'vitest';
import { availableActions, validatePlan } from './actions';
import { baseDailyTick, drive, fillCan, refuel, stockAt, workOnProject } from './base';
import { applyEffects } from './effects';
import { newBody, tickBody } from './body';
import { completeCheckpoint, mergeSegments, resolveJoint, syncClocks, deliverMessages } from './checkpoint';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from './game';
import { decode, encode, newSecret, sign, verify, type SegmentPacket } from './packet';
import { stateHash } from './rng';
import { testContent as c, testSetup } from './test-content';
import type { GameState, PlayerId, Traits } from './types';
import { countItem, itemsAt, type Ctx } from './world';

const fresh = () => newGame(c, testSetup);
const clone = <T,>(x: T) => structuredClone(x);

function run(s: GameState, pid: PlayerId, plans: string[][]): ActionRecord[] {
  const recs: ActionRecord[] = [];
  for (const plan of plans) { recs.push({ scene: s.chars[pid].scene, plan }); play(c, s, pid, plan); }
  return recs;
}

const avgTraits: Traits = { strength: 3, endurance: 3, agility: 3, melee: 2, medicine: 1, driving: 3, stealth: 2, persuasion: 3, technical: 2 };

describe('детерминизм и воспроизведение', () => {
  it('одинаковая игра даёт одинаковый хэш на «двух телефонах»', () => {
    expect(stateHash(fresh())).toBe(stateHash(fresh()));
  });

  it('журнал участка воспроизводится у партнёра бит в бит', () => {
    const base = fresh();
    const s = clone(base);
    const recs = run(s, 'A', [['look', 'pack'], ['go'], ['fight'], ['cp']]);
    const replayed = replaySegment(c, base, 'A', recs);
    expect(stateHash(replayed)).toBe(stateHash(s));
    expect(segmentFinished(c, s, 'A')).toBe('checkpoint');
  });
});

describe('несколько действий за раз', () => {
  it('взаимоисключающие действия нельзя выбрать вместе', () => {
    const ctx: Ctx = { s: fresh(), c, pid: 'A' };
    expect(validatePlan(ctx, ['stay', 'go']).ok).toBe(false);
  });

  it('уход из сцены — только последним шагом', () => {
    const ctx: Ctx = { s: fresh(), c, pid: 'A' };
    expect(validatePlan(ctx, ['go', 'look']).ok).toBe(false);
    expect(validatePlan(ctx, ['look', 'pack', 'go']).ok).toBe(true);
  });

  it('план останавливается, если после шага следующий стал невозможен', () => {
    const s = fresh();
    const res = play(c, s, 'A', ['fall', 'after_fall']);
    // Персонаж очнулся через 2 часа, но план уже прерван — второе действие не выполнено автоматически.
    expect(res.steps.map((x) => x.id)).toEqual(['fall']);
    expect(res.stopped).toBeTruthy();
    expect(s.chars.A.time).toBeGreaterThanOrEqual(testSetup.startTime + 120);
  });
});

describe('ресурсы', () => {
  it('предметы не берутся из ниоткуда и списываются', () => {
    const s = fresh();
    const ctx: Ctx = { s, c, pid: 'A' };
    expect(countItem(ctx, 'water')).toBe(1);
    play(c, s, 'A', ['pack']);
    expect(countItem(ctx, 'water')).toBe(3);
    s.chars.A.body.thirst = 50;
    expect(availableActions(ctx).some((a) => a.def.id === 'u:drink')).toBe(true);
    play(c, s, 'A', ['u:drink']);
    expect(countItem(ctx, 'water')).toBe(2);
    expect(s.chars.A.body.thirst).toBeLessThan(30);
  });

  it('оставленный предмет остаётся на месте и недоступен в другом месте', () => {
    const s = fresh();
    const ctx: Ctx = { s, c, pid: 'B' };
    play(c, s, 'B', ['shed']);
    expect(countItem(ctx, 'water')).toBe(1);
    expect(itemsAt(ctx, 'flatB').reduce((n, i) => n + i.qty, 0)).toBe(1);
  });

  it('телефон разряжается со временем', () => {
    const s = fresh();
    const before = Object.values(s.items).find((i) => i.type === 'phone' && i.at.kind === 'char' && i.at.id === 'B')!.charge!;
    play(c, s, 'B', ['radio']);
    const after = Object.values(s.items).find((i) => i.type === 'phone' && i.at.kind === 'char' && i.at.id === 'B')!.charge!;
    expect(after).toBeLessThan(before);
  });
});

describe('тело', () => {
  const env = { tempC: 20, wet: false, outdoor: false, warmth: 3 };

  it('тяжёлое необработанное кровотечение убивает, перевязка спасает', () => {
    const b1 = newBody(0);
    b1.injuries.push({ id: 'i', kind: 'laceration', site: 'leftLeg', severity: 4, bleeding: 28, treated: 'none', since: 0, woundInfected: false, healed: 0 });
    const r = tickBody(b1, avgTraits, 0, 6 * 60, 'rest', env, 'k');
    expect(r.died).toBe('кровопотеря');

    const b2 = newBody(0);
    b2.injuries.push({ id: 'i', kind: 'laceration', site: 'leftLeg', severity: 4, bleeding: 28, treated: 'proper', since: 0, woundInfected: false, healed: 0 });
    tickBody(b2, avgTraits, 0, 6 * 60, 'rest', env, 'k');
    expect(b2.consciousness).toBe('awake');
  });

  it('мокрая одежда на холоде ведёт к переохлаждению', () => {
    const b = newBody(0);
    tickBody(b, avgTraits, 0, 5 * 60, 'rest', { tempC: 3, wet: true, outdoor: true, warmth: 1 }, 'k');
    expect(b.coreTemp).toBeLessThan(35);
  });

  it('без сна растёт недосып', () => {
    const b = newBody(0);
    tickBody(b, avgTraits, 0, 24 * 60, 'light', env, 'k');
    expect(b.sleepDebt).toBeGreaterThanOrEqual(12);
  });
});

describe('скрытый возбудитель', () => {
  it('контакт с высокой вероятностью → инкубация → жар → смерть, детерминированно', () => {
    const mk = () => {
      const b = newBody(0);
      b.injuries.push({ id: 'bite', kind: 'bite', site: 'leftArm', severity: 3, bleeding: 0, treated: 'proper', since: 0, woundInfected: false, healed: 0, exposure: 1 });
      return b;
    };
    const b = mk();
    tickBody(b, avgTraits, 0, 2 * 60, 'rest', { tempC: 20, wet: false, outdoor: false, warmth: 3 }, 'seed-x');
    expect(b.illnesses.some((i) => i.kind === 'pathogen')).toBe(true);
    expect(b.coreTemp).toBeLessThan(37.5); // инкубация — без симптомов
    const r = tickBody(b, avgTraits, 120, 4 * 24 * 60, 'rest', { tempC: 20, wet: false, outdoor: false, warmth: 3 }, 'seed-x');
    const fate = b.illnesses.find((i) => i.kind === 'pathogen')?.fate;
    if (fate === 'turn' || r.died) expect(r.died).toBe('неизвестная болезнь');
    const b2 = mk();
    const r2 = tickBody(b2, avgTraits, 0, 4 * 24 * 60 + 120, 'rest', { tempC: 20, wet: false, outdoor: false, warmth: 3 }, 'seed-x');
    expect(r2.died).toBe(r.died);
  });
});

describe('контрольная точка: слияние', () => {
  function bothSegments() {
    const base = fresh();
    const a = clone(base); const recA = run(a, 'A', [['look'], ['go'], ['cp']]);
    const b = clone(base); const recB = run(b, 'B', [['radio'], ['shed'], ['help'], ['cp']]);
    return { base, recA, recB };
  }

  it('оба телефона получают один и тот же мир (порядок получения пакетов не важен)', () => {
    const { base, recA, recB } = bothSegments();
    // Телефон A: свой журнал + журнал B. Телефон B: наоборот.
    const onA = mergeSegments(c, base, { A: replaySegment(c, base, 'A', recA), B: replaySegment(c, base, 'B', recB) });
    const onB = mergeSegments(c, base, { B: replaySegment(c, base, 'B', recB), A: replaySegment(c, base, 'A', recA) });
    expect(stateHash(onA)).toBe(stateHash(onB));
    // Счётчик паники — «delta»: изменения обоих складываются.
    expect(onA.vars['w.panic']).toBe(3);
    // Знания раздельны: A не узнал то, что узнала B по радио.
    expect(onA.knowledge.A.f_attacks).toBeUndefined();
    expect(onA.knowledge.B.f_attacks).toBeDefined();
  });

  it('пересечение «latest»: побеждает изменение, сделанное позже по игровому времени', () => {
    const { base, recA, recB } = bothSegments();
    const ra = replaySegment(c, base, 'A', recA);
    const rb = replaySegment(c, base, 'B', recB);
    const m = mergeSegments(c, base, { A: ra, B: rb });
    expect(m.vars['w.road']).toBe(rb.vars['w.road']); // A свою дорогу не трогал в этом прохождении
  });

  it('сведение часов и доставка сообщений', () => {
    const base = fresh();
    const a = clone(base); const recA = run(a, 'A', [['u:msg:ok'], ['look'], ['go'], ['cp']]);
    const b = clone(base); const recB = run(b, 'B', [['shed'], ['cp']]);
    const m = mergeSegments(c, base, { A: replaySegment(c, base, 'A', recA), B: replaySegment(c, base, 'B', recB) });
    syncClocks(c, m);
    expect(m.chars.A.time).toBe(m.chars.B.time);
    deliverMessages(c, m);
    expect(m.messages[0].delivered).toBe(true);
    expect(m.knowledge.B.f_partner_ok).toBeDefined();
  });
});

describe('совместные решения', () => {
  const merged = () => {
    const s = fresh();
    s.vars['w.panic'] = 1;
    return s;
  };

  it('одинаковые ответы', () => {
    const s = merged();
    const r = resolveJoint(c, s, 'plan', { A: 'stay', B: 'stay' });
    expect(r.kind).toBe('same');
    expect(s.vars['w.plan']).toBe('stay');
  });

  it('совместимые ответы выполняются оба', () => {
    const s = merged();
    const r = resolveJoint(c, s, 'plan', { A: 'guard', B: 'food' });
    expect(r.kind).toBe('compatible');
    expect(s.vars['w.guard']).toBe(true);
    expect(s.vars['w.food']).toBe(true);
  });

  it('частично совместимые → компромисс, только если он объективно возможен', () => {
    const s = merged();
    expect(resolveJoint(c, s, 'plan', { A: 'all', B: 'none' }).kind).toBe('compromise');
    expect(s.vars['w.meds']).toBe('half');
    const s2 = merged(); s2.vars['w.panic'] = 9;
    expect(resolveJoint(c, s2, 'plan', { A: 'all', B: 'none' }).kind).toBe('conflict');
  });

  it('несовместимые → решает заранее существующее обстоятельство', () => {
    const s = merged(); s.vars['w.storm'] = true;
    const r = resolveJoint(c, s, 'plan', { A: 'stay', B: 'evac' });
    expect(r.kind).toBe('conflict');
    expect(r.applied).toEqual(['stay']);
    expect(s.vars['joint.plan.A']).toBe('stay');
    expect(s.vars['joint.plan.B']).toBe('evac');
    expect(s.npcs.nadia.memory).toContain('B:plan=evac');
  });

  it('без обстоятельств — взвешенная случайность, воспроизводимая и одинаковая при любом порядке', () => {
    const s1 = merged(); const s2 = merged();
    const r1 = resolveJoint(c, s1, 'plan', { A: 'stay', B: 'evac' });
    const r2 = resolveJoint(c, s2, 'plan', { B: 'evac', A: 'stay' });
    expect(r1.applied).toEqual(r2.applied);
    expect(r1.roll).toBe(r2.roll);
    expect(stateHash(s1)).toBe(stateHash(s2));
  });

  it('невыполнимый общий выбор не выполняется', () => {
    const s = merged(); s.vars['w.road'] = 'closed';
    const r = resolveJoint(c, s, 'plan', { A: 'evac', B: 'evac' });
    expect(r.applied).toEqual(['stay']);
  });

  it('недееспособный партнёр не отвечает — решает один', () => {
    const s = merged(); s.chars.B.body.consciousness = 'coma';
    const r = resolveJoint(c, s, 'plan', { A: 'guard' });
    expect(r.kind).toBe('solo');
  });

  it('пока не пришёл ответ участника — решение не принимается', () => {
    const s = merged();
    expect(() => resolveJoint(c, s, 'plan', { A: 'stay' })).toThrow(/Ждём/);
  });
});

describe('смерть и поражение', () => {
  it('смерть одного не завершает игру, второй идёт дальше один', () => {
    const s = fresh();
    s.chars.A.body.consciousness = 'dead';
    s.chars.A.body.causeOfDeath = 'тест';
    const out = completeCheckpoint(c, s, { B: { plan: 'stay' } });
    expect(out.state.ended).toBeUndefined();
    expect(out.state.chars.B.scene).toBe('b_next');
  });

  it('оба погибли → окончательное поражение', () => {
    const s = fresh();
    for (const p of ['A', 'B'] as const) s.chars[p].body.consciousness = 'dead';
    const out = completeCheckpoint(c, s, {});
    expect(out.state.ended?.kind).toBe('defeat');
  });

  it('оба без сознания без помощи — время идёт честно до исхода', () => {
    const s = fresh();
    for (const p of ['A', 'B'] as const) {
      s.chars[p].body.consciousness = 'coma';
      s.chars[p].body.bloodLoss = 80;
      s.chars[p].body.injuries.push({ id: `x${p}`, kind: 'laceration', site: 'torso', severity: 5, bleeding: 10, treated: 'none', since: s.chars[p].time, woundInfected: false, healed: 0 });
    }
    const out = completeCheckpoint(c, s, {});
    expect(out.state.ended?.kind).toBe('defeat');
  });

  it('недееспособного ведёт партнёр: его тело продолжает меняться', () => {
    const s = fresh();
    s.chars.B.body.consciousness = 'unconscious';
    s.chars.B.body.bloodLoss = 60;
    const out = completeCheckpoint(c, s, { A: { plan: 'stay' } });
    expect(out.state.chars.B.controlledBy).toBe('A');
  });
});

describe('пакеты синхронизации', () => {
  it('подпись, сжатие, проверка и защита от подмены', async () => {
    const secret = newSecret();
    const pkt: SegmentPacket = { v: 1, type: 'segment', pairId: 'p', from: 'A', checkpoint: 1, baseHash: 'x', engine: '0.1.0', content: 'test-1', actions: [{ scene: 'a_start', plan: ['look', 'go'] }], endHash: 'y', finish: 'checkpoint' };
    const signed = await sign(pkt, secret);
    const text = await encode(signed);
    expect(text.startsWith('KVEST1.')).toBe(true);
    const back = (await decode(text)) as typeof signed;
    expect(await verify(back, secret)).toBe(true);
    expect(await verify({ ...back, actions: [{ scene: 'a_start', plan: ['stay'] }] }, secret)).toBe(false);
    expect(await verify(back, newSecret())).toBe(false);
  });
});

describe('транспорт и топливо', () => {
  it('поездка тратит топливо по расходу, без топлива машина глохнет', () => {
    const s = fresh();
    const ctx: Ctx = { s, c, pid: 'A' };
    const car = applyEffects(ctx, [{ place: 'golf', at: 'flatA' }]) && Object.values(s.items).find((i) => i.type === 'golf')!;
    car.fuel = 10;
    expect(drive(ctx, 'golf', 100, 'street')).toBeUndefined();
    expect(car.fuel).toBeCloseTo(3.5);
    expect(s.chars.A.location).toBe('street');
    expect(drive(ctx, 'golf', 100, 'flatA')).toMatch(/кончилось/);
    expect(car.fuel).toBe(0);
  });

  it('дизель в бензиновую машину губит двигатель', () => {
    const s = fresh();
    const ctx: Ctx = { s, c, pid: 'A' };
    applyEffects(ctx, [{ place: 'golf', at: 'flatA' }, { give: 'can_diesel' }]);
    fillCan(ctx, 'can_diesel', 20);
    const msg = refuel(ctx, 'golf', 15, 'can_diesel');
    expect(msg).toMatch(/дизель/);
    expect(Object.values(s.items).find((i) => i.type === 'golf')!.condition).toBeLessThan(50);
  });
});

describe('долгие работы', () => {
  it('ремонт не начинается без детали, идёт часами и завершается', () => {
    const s = fresh();
    const ctx: Ctx = { s, c, pid: 'A' };
    expect(workOnProject(ctx, 'tractor', 2).minutes).toBe(0);
    applyEffects(ctx, [{ give: 'tire' }]);
    for (let i = 0; i < 6 && !s.vars['proj.tractor.done']; i++) applyEffects(ctx, [{ work: 'tractor', hours: 2 }]);
    expect(s.vars['proj.tractor.done']).toBe(true);
    expect(s.vars['w.tractor']).toBe('ok');
    expect(countItem(ctx, 'tire')).toBe(0);
  });
});

describe('убежище: общий склад', () => {
  it('суточный расход еды, воды и дров; нехватка отмечается', () => {
    const s = fresh();
    const ctx: Ctx = { s, c, pid: 'B' };
    applyEffects(ctx, [{ place: 'rice', at: 'shed', qty: 2 }, { place: 'water_l', at: 'shed', qty: 20 }, { place: 'wood', at: 'shed', qty: 30 }]);
    // На базе: игрок B (flatB) и Надя (shed) — 2 человека.
    baseDailyTick(ctx, c.bases![0], 1);
    expect(stockAt(ctx, 'shed', 'water_l')).toBe(14);
    expect(stockAt(ctx, 'shed', 'rice')).toBe(0); // 4400 ккал → съедено 2 кг (7200)
    baseDailyTick(ctx, c.bases![0], 1); // повтор того же дня ничего не меняет
    expect(stockAt(ctx, 'shed', 'water_l')).toBe(14);
    baseDailyTick(ctx, c.bases![0], 2);
    expect(Number(s.vars['base.farm.shortDays'])).toBe(1);
  });

  it('оба взяли со склада в своих участках — расход складывается при слиянии', () => {
    const base = fresh();
    applyEffects({ s: base, c, pid: 'B' }, [{ place: 'water_l', at: 'shed', qty: 20 }]);
    const a = clone(base); a.chars.A.location = 'shed'; a.chars.A.time += 60;
    applyEffects({ s: a, c, pid: 'A' }, [{ unstock: 'water_l', qty: 3, at: 'shed' }]);
    const b = clone(base); b.chars.B.time += 30;
    applyEffects({ s: b, c, pid: 'B' }, [{ unstock: 'water_l', qty: 5, at: 'shed' }]);
    const m = mergeSegments(c, base, { A: a, B: b });
    expect(stockAt({ s: m, c, pid: 'A' }, 'shed', 'water_l')).toBe(12);
  });
});
