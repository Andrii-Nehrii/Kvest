// Примерный прогресс участка: сколько пройдено до следующей контрольной точки. Только для показа —
// в мир, хэш и журнал не входит. Путь ветвится, поэтому оценка — по графу сцен: сколько сюжетных
// переходов в среднем остаётся от сцены до точки, если выбирать среди её переходов наугад. В участках,
// где точка открывается по часам (обжитое место, ожидание), учитывается и игровое время.
import type { Content } from '../engine/content-types';
import type { GameState, PlayerId } from '../engine/types';
import type { LocalSave } from './session';

const cache = new WeakMap<Content, Map<number, Map<string, number>>>();

/** Куда может увести каждое действие сцены (переход действия и его исходов). */
function exits(c: Content, sceneId: string): string[][] {
  const scene = c.scenes[sceneId];
  if (!scene) return [];
  const out: string[][] = [];
  for (const a of scene.actions) {
    if (a.replayOnly) continue;
    const to = new Set<string>();
    if (a.goto) to.add(a.goto);
    for (const o of a.outcomes ?? []) if (o.goto) to.add(o.goto);
    to.delete(sceneId);
    const list = [...to].filter((t) => c.scenes[t]);
    if (list.length) out.push(list);
  }
  return out;
}

/** Сколько переходов в среднем осталось от каждой сцены до точки с номером `cp`. */
export function remainingSteps(c: Content, cp: number): Map<string, number> {
  let byCp = cache.get(c);
  if (!byCp) { byCp = new Map(); cache.set(c, byCp); }
  const hit = byCp.get(cp);
  if (hit) return hit;
  const ids = Object.keys(c.scenes);
  const edges = new Map(ids.map((id) => [id, exits(c, id)]));
  const isTarget = (id: string) => c.scenes[id].checkpoint === cp;
  // Сначала — какие сцены вообще ведут к точке (тупики и чужие ветки в среднее не входят).
  const reach = new Set(ids.filter(isTarget));
  for (let changed = true; changed;) {
    changed = false;
    for (const id of ids) {
      if (reach.has(id) || c.scenes[id].checkpoint !== undefined) continue;
      if (edges.get(id)!.some((to) => to.some((t) => reach.has(t)))) { reach.add(id); changed = true; }
    }
  }
  const r = new Map<string, number>();
  for (const id of reach) r.set(id, isTarget(id) ? 0 : 1);
  for (let it = 0; it < 400; it++) {
    let delta = 0;
    for (const id of reach) {
      if (isTarget(id)) continue;
      const vals: number[] = [];
      for (const to of edges.get(id)!) {
        const ok = to.filter((t) => reach.has(t));
        if (ok.length) vals.push(ok.reduce((s, t) => s + r.get(t)!, 0) / ok.length);
      }
      const v = 1 + vals.reduce((s, x) => s + x, 0) / vals.length;
      delta = Math.max(delta, Math.abs(v - r.get(id)!));
      r.set(id, v);
    }
    if (delta < 1e-3) break;
  }
  byCp.set(cp, r);
  return r;
}

const gates = new WeakMap<Content, Map<number, number | undefined>>();

/** Самое раннее время, с которого открывается переход к точке `cp` (если он ждёт часов). */
function timeGate(c: Content, cp: number): number | undefined {
  let byCp = gates.get(c);
  if (!byCp) { byCp = new Map(); gates.set(c, byCp); }
  if (byCp.has(cp)) return byCp.get(cp);
  const after = (x: unknown, acc: number[]): number[] => {
    if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) {
      if (k === 'after' && typeof v === 'number') acc.push(v); else after(v, acc);
    }
    return acc;
  };
  let gate: number | undefined;
  for (const sc of Object.values(c.scenes)) for (const a of sc.actions) {
    if (a.replayOnly) continue;
    const to = [a.goto, ...(a.outcomes ?? []).map((o) => o.goto)];
    if (!to.some((t) => t && c.scenes[t]?.checkpoint === cp)) continue;
    const at = after([a.when, a.enabled], []);
    if (at.length) gate = Math.min(gate ?? Infinity, Math.max(...at));
  }
  byCp.set(cp, gate);
  return gate;
}

/**
 * Доля пройденного участка (0..1) или undefined, если оценить нельзя. Не убывает внутри участка:
 * берётся лучшая из сцен, пройденных с последней точки. 1 — только на самой точке.
 */
export function segmentProgress(c: Content, base: GameState, state: GameState, pid: PlayerId): number | undefined {
  const cp = base.checkpoint + 1;
  if (!c.checkpoints.some((x) => x.index === cp)) return undefined;
  const ch = state.chars[pid];
  if (c.scenes[ch.scene]?.checkpoint === cp) return 1;
  const r = remainingSteps(c, cp);
  const start = r.get(base.chars[pid].scene);
  if (start === undefined || start <= 0) return timeOnly(c, cp, base, state, pid);
  const was = base.chars[pid].visited;
  let best = 0;
  for (const [id, n] of Object.entries(ch.visited)) {
    if (n <= (was[id] ?? 0) && id !== ch.scene) continue;
    const left = r.get(id);
    if (left !== undefined) best = Math.max(best, 1 - left / start);
  }
  const gate = timeGate(c, cp), t0 = base.chars[pid].time;
  if (gate !== undefined && gate > t0) best = Math.max(best, (ch.time - t0) / (gate - t0));
  return Math.min(0.95, Math.max(0, best));
}

function timeOnly(c: Content, cp: number, base: GameState, state: GameState, pid: PlayerId): number | undefined {
  const gate = timeGate(c, cp), t0 = base.chars[pid].time;
  if (gate === undefined || gate <= t0) return undefined;
  return Math.min(0.95, Math.max(0, (state.chars[pid].time - t0) / (gate - t0)));
}

/** Что телефон сообщает партнёру о своём участке (файл рядом с сохранением в облаке). */
export interface ProgressNote {
  /** Пройдено контрольных точек. */
  cp: number;
  phase: LocalSave['phase'];
  /** 0..1, null — оценить нельзя. */
  pct: number | null;
  /** Когда записано (мс). */
  at: number;
}

export function progressNote(c: Content, save: LocalSave, at = Date.now()): ProgressNote | undefined {
  if (!save.base || !save.state) return undefined;
  const pct = save.phase === 'checkpoint' ? 1 : segmentProgress(c, save.base, save.state, save.me);
  return { cp: save.base.checkpoint, phase: save.phase, pct: pct ?? null, at };
}
