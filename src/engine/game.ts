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

export const ENGINE_VERSION = '0.1.0';
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
  for (const pid of PLAYERS) {
    const ctx: Ctx = { s, c, pid };
    for (const it of c.characters[pid].startItems) giveItem(ctx, it.type, it.qty ?? 1, { charge: it.charge, condition: it.condition });
    enterScene(ctx, c.characters[pid].startScene);
  }
  markSegmentStart(s);
  return s;
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
