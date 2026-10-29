// Сквозная проверка сюжета главы 1: два «случайных, но разумных» игрока проходят участок 1, КТ 1,
// участок 2 и КТ 2. Ловим тупики, исключения, недостижимые сцены и расхождения при воспроизведении.
import { describe, expect, it } from 'vitest';
import { availableActions, isServiceAction } from '../engine/actions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, syncClocks } from '../engine/checkpoint';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash, unit } from '../engine/rng';
import type { Effect, GameState, PlayerId } from '../engine/types';
import { START_TIME } from '../app/session';
import { aRoadScenes } from './chapter1/a_road';
import { aTownScenes } from './chapter1/a_town';
import { bRoadScenes } from './chapter1/b_road';
import { bTownScenes } from './chapter1/b_town';
import { openingScenes } from './chapter1/opening';
import { content as c } from './index';

const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const setup = (seed: string) => ({ pairId: 'p', seed, startTime: START_TIME, players: { A: { name: forms('Андрей') }, B: { name: forms('Аня') } } });

/** Случайный игрок: в основном сюжетные действия, иногда — поесть/попить/передохнуть. */
function playSegment(s: GameState, pid: PlayerId, tag: string, limit: number) {
  const recs: ActionRecord[] = [];
  const visited = new Set<string>();
  for (let step = 0; step < limit && !segmentFinished(c, s, pid); step++) {
    const all = availableActions({ s, c, pid }).filter((a) => a.enabled && !isServiceAction(a.def.id) && a.def.id !== 'u:sleep');
    const story = all.filter((a) => !a.universal);
    const r = unit(`${tag}:${step}`);
    const pool = story.length && r < 0.9 ? story : all;
    if (!pool.length) break;
    const pick = pool[Math.floor(unit(`${tag}:${step}:pick`) * pool.length)];
    recs.push({ scene: s.chars[pid].scene, plan: [pick.def.id] });
    visited.add(s.chars[pid].scene);
    play(c, s, pid, [pick.def.id]);
  }
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
      (answers[p] ??= {})[id] = opts[Math.floor(unit(`${tag}:${id}:${p}`) * opts.length)].id;
    }
  }
  return completeCheckpoint(c, merged, answers);
}

describe('сюжет главы 1: полное прохождение двумя игроками', () => {
  it('id сцен не повторяются между модулями', () => {
    const seen = new Map<string, number>();
    for (const m of [openingScenes, aTownScenes, aRoadScenes, bTownScenes, bRoadScenes]) for (const id of Object.keys(m)) seen.set(id, (seen.get(id) ?? 0) + 1);
    expect([...seen].filter(([, n]) => n > 1).map(([id]) => id)).toEqual([]);
  });

  it('у каждой сцены, кроме контрольных точек и заглушек, есть выход', () => {
    const bad = Object.values(c.scenes).filter((s) => s.checkpoint === undefined && s.chapter !== 'ch2'
      && !s.actions.some((a) => a.terminal || a.goto || a.outcomes?.some((o) => o.goto))).map((s) => s.id);
    expect(bad).toEqual([]);
  });

  it('все сцены достижимы по переходам', () => {
    const edges = new Map<string, string[]>();
    for (const s of Object.values(c.scenes)) {
      edges.set(s.id, s.actions.flatMap((a) => [a.goto, ...(a.outcomes ?? []).map((o) => o.goto)]).filter((x): x is string => !!x));
    }
    const start = [c.characters.A.startScene, c.characters.B.startScene, ...c.checkpoints.flatMap((cp) => [...cp.next.A, ...cp.next.B].map((r) => r.scene))];
    const seen = new Set(start);
    const queue = [...start];
    while (queue.length) for (const n of edges.get(queue.shift()!) ?? []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
    expect(Object.keys(c.scenes).filter((id) => !seen.has(id))).toEqual([]);
  });

  it('после КТ 1 из любого места, где игрок мог оказаться, есть куда идти', () => {
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
      for (const plan of ['wait', 'harburg', pid === 'A' ? 'to_b' : 'to_a']) {
        for (const loc of places) {
          const s = newGame(c, setup('exits'));
          s.chars[pid].scene = after;
          s.chars[pid].location = loc;
          s.vars[pid === 'A' ? 'w.plan_a' : 'w.plan_b'] = plan;
          if (!availableActions({ s, c, pid }).some((a) => !a.universal && (a.def.terminal || a.def.goto))) bad.push(`${pid} ${plan} @${loc}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('30 пар проходят обе контрольные точки без ошибок и воспроизводятся бит в бит', { timeout: 120000 }, () => {
    const stats = { cp1: 0, cp2: 0, runs: 30, steps1: [] as number[], steps2: [] as number[], t1: [] as number[], t2: [] as number[] };
    const visited = new Set<string>();
    for (let run = 0; run < stats.runs; run++) {
      const tag = `story-${run}`;
      let base = newGame(c, setup(tag));
      for (const seg of [1, 2]) {
        const results = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) {
          const s = structuredClone(base);
          const r = playSegment(s, pid, `${tag}:${seg}:${pid}`, 260);
          r.visited.forEach((v) => visited.add(v));
          expect(stateHash(replaySegment(c, base, pid, r.recs))).toBe(stateHash(s));
          results[pid] = s;
          if (r.finished === 'checkpoint') {
            stats[seg === 1 ? 'steps1' : 'steps2'].push(r.recs.length);
            stats[seg === 1 ? 't1' : 't2'].push(s.chars[pid].time);
          }
        }
        const finishedBoth = (['A', 'B'] as const).every((p) => segmentFinished(c, results[p], p));
        if (!finishedBoth) break;
        stats[seg === 1 ? 'cp1' : 'cp2'] += 1;
        const out = runCheckpoint(base, results, `${tag}:cp${seg}`);
        base = out.state;
        if (base.ended) break;
      }
    }
    const med = (xs: number[]) => xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0;
    const hh = (t: number) => `${Math.floor(((t % 1440) + 1440) % 1440 / 60)}:${String(((t % 1440) + 1440) % 1440 % 60).padStart(2, '0')}`;
    console.log(`КТ1: ${stats.cp1}/${stats.runs}, КТ2: ${stats.cp2}/${stats.runs}; решений до КТ1 ~${med(stats.steps1)}, до КТ2 ~${med(stats.steps2)}; время КТ1 ~${hh(med(stats.t1))}, КТ2 ~${hh(med(stats.t2))}`);
    console.log(`Не посещены случайными игроками: ${Object.keys(c.scenes).filter((id) => !visited.has(id)).join(', ')}`);
    expect(stats.cp1).toBeGreaterThanOrEqual(stats.runs * 0.9);
    expect(stats.cp2).toBeGreaterThanOrEqual(stats.runs * 0.9);
  });
});
