// Создание игры и воспроизведение участков. Участок = журнал планов действий от общего
// состояния контрольной точки. Партнёр получает журнал и воспроизводит его у себя —
// результат совпадает до бита (проверяется хэшем).
import { markSegmentStart } from './base';
import { canAct, newBody } from './body';
import type { Content } from './content-types';
import { executePlan, enterScene, type PlanResult } from './actions';
import { stateHash } from './rng';
import type { GameState, Minutes, NameForms, NpcState, PlayerId, Traits } from './types';
import { PLAYERS } from './types';
import { giveItem, type Ctx } from './world';

export const ENGINE_VERSION = '0.2.0';
export const SAVE_SCHEMA = 1;

export interface PlayerSetup {
  name: NameForms;
  /** Поправки к шаблону персонажа (в пределах 0–5). */
  traits?: Partial<Traits>;
}

export interface GameSetup {
  pairId: string;
  seed: string;
  players: Record<PlayerId, PlayerSetup>;
  startTime: Minutes;
}

export function newGame(c: Content, setup: GameSetup): GameState {
  const s: GameState = {
    schema: SAVE_SCHEMA, engineVersion: ENGINE_VERSION, contentVersion: c.version,
    pairId: setup.pairId, seed: setup.seed, checkpoint: 0,
    vars: { ...c.initialVars }, varTime: {},
    chars: {} as GameState['chars'], npcs: {}, items: {},
    knowledge: { A: {}, B: {} }, firedEvents: {}, messages: [], log: [],
    rng: { A: 0, B: 0 }, idSeq: { A: 0, B: 0 }, logSeq: { A: 0, B: 0 }, history: [],
  };
  for (const pid of PLAYERS) {
    const tpl = c.characters[pid];
    const traits = { ...tpl.traits };
    for (const [k, v] of Object.entries(setup.players[pid].traits ?? {})) {
      traits[k as keyof Traits] = Math.max(0, Math.min(5, Math.round(v)));
    }
    s.chars[pid] = {
      id: pid, name: setup.players[pid].name, gender: tpl.gender, traits,
      body: newBody(setup.startTime), location: tpl.startLocation, time: setup.startTime,
      scene: tpl.startScene, rules: { chargePhoneWhenFreePower: true, drinkWhenThirsty: true, eatWhenHungry: false, keepReserve: true },
      controlledBy: pid, visited: {}, done: {},
    };
  }
  for (const def of Object.values(c.npcs)) {
    const n: NpcState = { id: def.id, ...structuredClone(def.initial), agendaDone: [], changedAt: setup.startTime };
    s.npcs[def.id] = n;
  }
  // Предметы мира создаются от лица A только ради нумерации id — это не даёт A приоритета.
  // Предметы с ключом (из поздних глав) кладёт upgradeState — так же, как в уже идущие игры.
  for (const it of c.initialPlaceItems ?? []) {
    if (it.key) continue;
    giveItem({ s, c, pid: 'A' }, it.type, it.qty ?? 1, { charge: it.charge, condition: it.condition, fuel: it.fuel }, { kind: 'place', id: it.at });
  }
  upgradeState(c, s);
  for (const pid of PLAYERS) {
    const ctx: Ctx = { s, c, pid };
    for (const it of c.characters[pid].startItems) giveItem(ctx, it.type, it.qty ?? 1, { charge: it.charge, condition: it.condition });
    for (const f of c.initialKnowledge?.[pid] ?? []) s.knowledge[pid][f] = { kind: 'fact', at: setup.startTime, source: 'start' };
    enterScene(ctx, c.characters[pid].startScene);
  }
  markSegmentStart(s);
  return s;
}

/**
 * Довезти в идущую игру то, что появилось в новых главах: NPC, начальные переменные, предметы с ключом.
 * Только добавляет, ничего не перезаписывает; детерминированно — оба телефона получают одно и то же.
 */
export function upgradeState(c: Content, s: GameState): boolean {
  let changed = false;
  for (const def of Object.values(c.npcs)) {
    if (s.npcs[def.id]) continue;
    s.npcs[def.id] = { id: def.id, ...structuredClone(def.initial), agendaDone: [], changedAt: 0 };
    changed = true;
  }
  for (const [k, v] of Object.entries(c.initialVars)) {
    if (k in s.vars) continue;
    s.vars[k] = v;
    changed = true;
  }
  for (const it of c.initialPlaceItems ?? []) {
    if (!it.key || s.vars[`sys.item.${it.key}`]) continue;
    const def = c.items[it.type];
    const id = `it-K-${it.key}`;
    s.items[id] = {
      id, type: it.type, qty: it.qty ?? 1, condition: it.condition ?? 100, charge: it.charge ?? (def?.battery ? 100 : undefined),
      fuel: it.fuel ?? (def?.vehicle || def?.fuelCan ? 0 : undefined), at: { kind: 'place', id: it.at }, changedAt: 0,
    };
    s.vars[`sys.item.${it.key}`] = true;
    changed = true;
  }
  return changed;
}

/**
 * Повторить журнал, сколько получится: если после обновления игры какое-то действие стало невозможным,
 * остановиться перед ним. Возвращает состояние и число выполненных записей.
 */
export function replayPrefix(c: Content, base: GameState, pid: PlayerId, records: ActionRecord[]): { state: GameState; applied: number } {
  let s = structuredClone(base);
  let applied = 0;
  for (const r of records) {
    const before = structuredClone(s);
    try {
      if (s.chars[pid].scene !== r.scene) throw new Error('сцена не совпала');
      play(c, s, pid, r.plan);
    } catch {
      s = before;
      break;
    }
    applied++;
  }
  return { state: s, applied };
}

export interface ActionRecord {
  scene: string;
  plan: string[];
}

export function canPlay(s: GameState, pid: PlayerId): boolean {
  return !s.ended && s.chars[pid].controlledBy === pid && canAct(s.chars[pid].body);
}

/** Участок закончен: дошёл до контрольной точки, погиб или потерял способность действовать. */
export function segmentFinished(c: Content, s: GameState, pid: PlayerId): 'checkpoint' | 'incapacitated' | 'dead' | false {
  const ch = s.chars[pid];
  if (ch.body.consciousness === 'dead') return 'dead';
  if (!canAct(ch.body) && ch.body.consciousness !== 'asleep') return 'incapacitated';
  if (c.scenes[ch.scene]?.checkpoint === s.checkpoint + 1) return 'checkpoint';
  return false;
}

export function play(c: Content, s: GameState, pid: PlayerId, plan: string[]): PlanResult {
  if (segmentFinished(c, s, pid)) throw new Error('Участок уже завершён — нужна контрольная точка.');
  return executePlan({ s, c, pid }, plan);
}

/** Воспроизвести журнал участка от состояния контрольной точки. */
export function replaySegment(c: Content, base: GameState, pid: PlayerId, records: ActionRecord[]): GameState {
  const s = structuredClone(base);
  for (const r of records) {
    if (s.chars[pid].scene !== r.scene) throw new Error(`Расхождение при воспроизведении: ожидалась сцена ${r.scene}, а персонаж в ${s.chars[pid].scene}`);
    play(c, s, pid, r.plan);
  }
  return s;
}

export { stateHash };
