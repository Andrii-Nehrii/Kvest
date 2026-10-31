// Сквозная проверка сюжета главы 1: два «случайных, но разумных» игрока проходят участок 1, КТ 1,
// участок 2 и КТ 2. Ловим тупики, исключения, недостижимые сцены и расхождения при воспроизведении.
import { describe, expect, it } from 'vitest';
import { availableActions, isServiceAction, validatePlan } from '../engine/actions';
import { evalCond } from '../engine/conditions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, syncClocks } from '../engine/checkpoint';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash, unit } from '../engine/rng';
import type { Effect, GameState, PlayerId } from '../engine/types';
import { fmt, type Ctx } from '../engine/world';
import { START_TIME } from '../app/session';
import { aRoadScenes } from './chapter1/a_road';
import { aTownScenes } from './chapter1/a_town';
import { bRoadScenes } from './chapter1/b_road';
import { bTownScenes } from './chapter1/b_town';
import { openingScenes } from './chapter1/opening';
import { content as c } from './index';

// Данные сюжета заморожены: если игра где-то их меняет, одинаковые журналы на двух телефонах
// посчитаются по-разному (у одного данные уже «поиграны»). Изменение тут же упадёт с TypeError.
const freeze = (o: unknown, seen = new Set<unknown>()) => {
  if (o && typeof o === 'object' && !seen.has(o)) { seen.add(o); Object.freeze(o); for (const v of Object.values(o)) freeze(v, seen); }
};
freeze(c);

const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const setup = (seed: string) => ({ pairId: 'p', seed, startTime: START_TIME, players: { A: { name: forms('Андрей') }, B: { name: forms('Аня') } } });

/** Тупики: много шагов подряд без единого сюжетного действия (только «подождать»). */
const stuck = new Set<string>();

/** Тексты на экране после подстановок: без шаблонов, «undefined» и т.п. */
const badTexts = new Set<string>();
const BAD = /[{}]|undefined|NaN|\[object|\bnull\b/;
const checkText = (where: string, t: string | undefined) => { if (t && BAD.test(t)) badTexts.add(`${where}: ${t.slice(0, 120)}`); };

function checkScreen(ctx: Ctx) {
  const sc = c.scenes[ctx.s.chars[ctx.pid].scene];
  for (const b of sc.text) if (evalCond(ctx, b.when)) checkText(sc.id, fmt(ctx, b.text));
  for (const a of availableActions(ctx)) { checkText(`${sc.id}/${a.def.id}`, fmt(ctx, a.def.label)); checkText(`${sc.id}/${a.def.id}`, a.reason); }
}

/** Случайный игрок: в основном сюжетные действия, иногда — поесть/попить/передохнуть. */
/**
 * chaos: «неаккуратный» игрок — иногда спит, бросает и подбирает вещи, переключает правила,
 * выбирает несколько действий за раз. Так находят тупики, в которые сюжетный игрок не заходит.
 */
function playSegment(s: GameState, pid: PlayerId, tag: string, limit: number, chaos = false) {
  const recs: ActionRecord[] = [];
  const visited = new Set<string>();
  let idle = 0;
  let sameScene = 0;
  let sceneNow = s.chars[pid].scene;
  for (let step = 0; step < limit && !segmentFinished(c, s, pid); step++) {
    if (step % 3 === 0) checkScreen({ s, c, pid });
    const avail = availableActions({ s, c, pid }).filter((a) => a.enabled);
    const all = avail.filter((a) => !isServiceAction(a.def.id) && a.def.id !== 'u:sleep');
    const story = all.filter((a) => !a.universal);
    idle = story.length ? 0 : idle + 1;
    if (idle === 40) stuck.add(`${pid} только «подождать»: ${s.chars[pid].scene} @${s.chars[pid].location}`);
    if (s.chars[pid].scene !== sceneNow) { sceneNow = s.chars[pid].scene; sameScene = 0; }
    if (++sameScene === 80) stuck.add(`${pid} не выйти из сцены: ${sceneNow} @${s.chars[pid].location}`);
    const r = unit(`${tag}:${step}`);
    const pool = chaos && r > 0.75 ? avail : story.length && r < 0.9 ? story : all;
    if (!pool.length) break;
    const pick = pool[Math.floor(unit(`${tag}:${step}:pick`) * pool.length)];
    // Иногда — план из нескольких совместимых действий подряд (как в интерфейсе).
    const plan = [pick.def.id];
    if (chaos && pick.def.combinable && unit(`${tag}:${step}:multi`) < 0.3) {
      const more = avail.filter((a) => a.def.combinable && a.def.id !== pick.def.id && (a.def.group === undefined || a.def.group !== pick.def.group));
      if (more.length) plan.push(more[Math.floor(unit(`${tag}:${step}:m2`) * more.length)].def.id);
    }
    if (plan.length > 1 && !validatePlan({ s, c, pid }, plan).ok) plan.pop();
    recs.push({ scene: s.chars[pid].scene, plan });
    visited.add(s.chars[pid].scene);
    const res = play(c, s, pid, plan);
    for (const st of res.steps) st.text.forEach((t) => checkText(`${recs[recs.length - 1].scene}/${plan.join('+')}`, t));
    checkText(`${pick.def.id} stopped`, res.stopped);
  }
  checkScreen({ s, c, pid });
  visited.add(s.chars[pid].scene);
  return { recs, visited, finished: segmentFinished(c, s, pid) };
}

function runCheckpoint(base: GameState, results: Record<PlayerId, GameState>, tag: string) {
  const merged = mergeSegments(c, base, results);
  const cp = c.checkpoints.find((x) => x.index === base.checkpoint + 1)!;
  syncClocks(c, merged, cp.syncNotBefore);
  deliverMessages(c, merged);
  mergeNotes(c, merged, cp.index);
  const answers: Partial<Record<PlayerId, Record<string, string>>> = {};
  for (const id of cp.joint) {
    const d = c.joint[id];
    for (const p of participants(c, merged, d)) {
      const opts = optionsFor(c, merged, d, p);
      const ctx: Ctx = { s: merged, c, pid: p };
      checkText(`${id} prompt`, fmt(ctx, d.prompt[p] ?? d.prompt.default));
      for (const o of opts) checkText(`${id}/${o.id}`, fmt(ctx, o.label[p] ?? o.label.default));
      (answers[p] ??= {})[id] = opts[Math.floor(unit(`${tag}:${id}:${p}`) * opts.length)].id;
    }
  }
  const out = completeCheckpoint(c, merged, answers);
  for (const j of out.joint) for (const p of ['A', 'B'] as const) {
    const ctx: Ctx = { s: out.state, c, pid: p };
    checkText(`${j.id} reason`, fmt(ctx, j.reason));
    for (const o of j.applied) checkText(`${j.id}/${o}`, fmt(ctx, c.joint[j.id].options.find((x) => x.id === o)?.text ?? ''));
  }
  for (const e of out.state.log) checkText(`log ${e.kind}`, e.text);
  return out;
}

describe('сюжет главы 1: полное прохождение двумя игроками', () => {
  it('id сцен не повторяются между модулями', () => {
    const seen = new Map<string, number>();
    for (const m of [openingScenes, aTownScenes, aRoadScenes, bTownScenes, bRoadScenes]) for (const id of Object.keys(m)) seen.set(id, (seen.get(id) ?? 0) + 1);
    expect([...seen].filter(([, n]) => n > 1).map(([id]) => id)).toEqual([]);
  });

  it('у каждой сцены, кроме контрольных точек и заглушек, есть выход', () => {
    const STUBS = ['c7_start'];
    const bad = Object.values(c.scenes).filter((s) => s.checkpoint === undefined && !STUBS.includes(s.id)
      && !s.actions.some((a) => a.terminal || a.goto || a.outcomes?.some((o) => o.goto))).map((s) => s.id);
    expect(bad).toEqual([]);
  });

  it('все сцены достижимы по переходам', () => {
    const edges = new Map<string, string[]>();
    for (const s of Object.values(c.scenes)) {
      edges.set(s.id, s.actions.flatMap((a) => [a.goto, ...(a.outcomes ?? []).map((o) => o.goto)]).filter((x): x is string => !!x));
    }
    // a_ch2 / b_ch2 — прежние сцены-заглушки после КТ 2: на них могли остаться сохранения.
    const start = [c.characters.A.startScene, c.characters.B.startScene, 'a_ch2', 'b_ch2', ...c.checkpoints.flatMap((cp) => [...cp.next.A, ...cp.next.B].map((r) => r.scene))];
    const seen = new Set(start);
    const queue = [...start];
    while (queue.length) for (const n of edges.get(queue.shift()!) ?? []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
    expect(Object.keys(c.scenes).filter((id) => !seen.has(id))).toEqual([]);
  });

  it('после КТ 1 из любого места, где игрок мог оказаться, есть куда идти — и это можно сделать', () => {
    /** Есть доступный выход из сцены сразу или через пару доступных действий (дойти до машины и т.п.). */
    const wayOut = (s: GameState, pid: PlayerId, depth = 2): boolean => {
      const acts = availableActions({ s, c, pid }).filter((a) => a.enabled && !a.universal);
      if (acts.some((a) => a.def.terminal || a.def.goto)) return true;
      return depth > 0 && acts.some((a) => {
        const t = structuredClone(s);
        play(c, t, pid, [a.def.id]);
        return t.chars[pid].scene !== s.chars[pid].scene || wayOut(t, pid, depth - 1);
      });
    };
    const bad: string[] = [];
    for (const pid of ['A', 'B'] as const) {
      const places = new Set<string>();
      // Места первого участка: сцены второго (a2_/b2_) туда не попадают, кроме тех, что зависят только от времени.
      const seg1 = (id: string) => !/^[ab]2_/.test(id) || ['b2_farewell', 'b2_van', 'b2_ahrensburg', 'b2_svenja'].includes(id);
      for (const sc of Object.values(c.scenes).filter((x) => x.for === pid && x.chapter === 'ch1' && seg1(x.id))) {
        if (sc.location) places.add(sc.location);
        const walk = (effects: Effect[] | undefined) => effects?.forEach((e) => {
          if ('move' in e) places.add(e.move);
          if ('drive' in e && e.to) places.add(e.to);
          if ('if' in e) { walk(e.then); walk(e.else); }
        });
        for (const a of sc.actions) { walk(a.effects); a.outcomes?.forEach((o) => walk(o.effects)); }
      }
      const after = pid === 'A' ? 'a2_after_call' : 'b2_after_call';
      // A: ключи в кармане или нет; машина — во дворе, как в начале игры.
      const variants = pid === 'A' ? ['keys', 'no_keys'] : ['-'];
      for (const plan of ['wait', 'harburg', pid === 'A' ? 'to_b' : 'to_a']) {
        for (const loc of places) {
          for (const v of variants) {
            const s = newGame(c, setup('exits'));
            s.chars[pid].scene = after;
            s.chars[pid].location = loc;
            s.vars[pid === 'A' ? 'w.plan_a' : 'w.plan_b'] = plan;
            // Машина там, куда на ней приехали: за городом — на месте, у вокзала Harburg — на парковке.
            const car = Object.values(s.items).find((i) => i.type === 'opel_corsa');
            const town = ['a_flat', 'a_stairs', 'a_yard', 'a_street', 'a_brockmann', 'a_house7', 'a_market'];
            if (pid === 'A' && car && !town.includes(loc)) car.at = { kind: 'place', id: ['harburg_station', 'harburg_kerem'].includes(loc) ? 'harburg' : loc };
            const keys = Object.values(s.items).find((i) => i.type === 'car_keys');
            if (pid === 'A' && keys) keys.at = v === 'keys' ? { kind: 'char', id: 'A' } : { kind: 'place', id: 'a_hospital' };
            if (!wayOut(s, pid)) bad.push(`${pid} ${plan} @${loc} ${v}`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('30 пар проходят шесть контрольных точек без ошибок и воспроизводятся бит в бит', { timeout: 300000 }, () => {
    const stats = { cp1: 0, cp2: 0, cp3: 0, cp4: 0, cp5: 0, cp6: 0, runs: 30, steps1: [] as number[], steps2: [] as number[], steps3: [] as number[], steps4: [] as number[], steps5: [] as number[], steps6: [] as number[], t1: [] as number[], t2: [] as number[], t3: [] as number[], t4: [] as number[], t5: [] as number[], t6: [] as number[] };
    const visited = new Set<string>();
    for (let run = 0; run < stats.runs; run++) {
      const tag = `story-${run}`;
      let base = newGame(c, setup(tag));
      for (const seg of [1, 2, 3, 4, 5, 6] as const) {
        const results = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) {
          const s = structuredClone(base);
          const r = playSegment(s, pid, `${tag}:${seg}:${pid}`, 300);
          r.visited.forEach((v) => visited.add(v));
          expect(stateHash(replaySegment(c, base, pid, r.recs))).toBe(stateHash(s));
          results[pid] = s;
          if (r.finished === 'checkpoint') {
            stats[`steps${seg}`].push(r.recs.length);
            stats[`t${seg}`].push(s.chars[pid].time);
          }
        }
        const finishedBoth = (['A', 'B'] as const).every((p) => segmentFinished(c, results[p], p));
        if (!finishedBoth) break;
        stats[`cp${seg}`] += 1;
        const out = runCheckpoint(base, results, `${tag}:cp${seg}`);
        base = out.state;
        if (base.ended) break;
      }
    }
    const med = (xs: number[]) => xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0;
    const hh = (t: number) => `${Math.floor(((t % 1440) + 1440) % 1440 / 60)}:${String(((t % 1440) + 1440) % 1440 % 60).padStart(2, '0')}`;
    console.log(`КТ1: ${stats.cp1}/${stats.runs}, КТ2: ${stats.cp2}/${stats.runs}, КТ3: ${stats.cp3}/${stats.runs}, КТ4: ${stats.cp4}/${stats.runs}, КТ5: ${stats.cp5}/${stats.runs}, КТ6: ${stats.cp6}/${stats.runs}; решений до КТ1 ~${med(stats.steps1)}, до КТ2 ~${med(stats.steps2)}, до КТ3 ~${med(stats.steps3)}, до КТ4 ~${med(stats.steps4)}; время КТ1 ~${hh(med(stats.t1))}, КТ2 ~${hh(med(stats.t2))}, КТ3 ~${hh(med(stats.t3))}, КТ4 ~${hh(med(stats.t4))}`);
    console.log(`Не посещены случайными игроками: ${Object.keys(c.scenes).filter((id) => !visited.has(id)).join(', ')}`);
    expect([...badTexts], 'неподставленные шаблоны в текстах').toEqual([]);
    expect([...stuck], 'тупики').toEqual([]);
    expect(stats.cp1).toBeGreaterThanOrEqual(stats.runs * 0.9);
    expect(stats.cp2).toBeGreaterThanOrEqual(stats.runs * 0.9);
    expect(stats.cp3).toBeGreaterThanOrEqual(stats.runs * 0.85);
    expect(stats.cp4).toBeGreaterThanOrEqual(stats.runs * 0.8);
    expect(stats.cp5).toBeGreaterThanOrEqual(stats.runs * 0.75);
    expect(stats.cp6).toBeGreaterThanOrEqual(stats.runs * 0.7);
  });

  it('20 пар «неаккуратных» игроков (сон, вещи, правила, планы) — без ошибок, тупиков и расхождений', { timeout: 300000 }, () => {
    let cp1 = 0;
    const runs = 20;
    for (let run = 0; run < runs; run++) {
      const tag = `chaos-${run}`;
      let base = newGame(c, setup(tag));
      for (const seg of [1, 2, 3, 4, 5, 6]) {
        const results = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) {
          const s = structuredClone(base);
          const r = playSegment(s, pid, `${tag}:${seg}:${pid}`, 320, true);
          expect(stateHash(replaySegment(c, base, pid, r.recs))).toBe(stateHash(s));
          results[pid] = s;
        }
        if (!(['A', 'B'] as const).every((p) => segmentFinished(c, results[p], p))) break;
        if (seg === 1) cp1 += 1;
        base = runCheckpoint(base, results, `${tag}:cp${seg}`).state;
        if (base.ended) break;
      }
    }
    expect([...badTexts], 'неподставленные шаблоны в текстах').toEqual([]);
    expect([...stuck], 'тупики').toEqual([]);
    expect(cp1).toBeGreaterThanOrEqual(runs * 0.8);
  });
});
