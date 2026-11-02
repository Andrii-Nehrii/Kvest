// Сессия игрока на его телефоне: создание пары, участок, обмен кодами на контрольной точке.
// Состояние партнёра никогда не принимается целиком — только его журнал, который воспроизводится здесь.
import { canAct } from '../engine/body';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, syncClocks, type JointResult } from '../engine/checkpoint';
import type { Content, JointDecision } from '../engine/content-types';
import { ENGINE_VERSION, newGame, play, replayPrefix, replaySegment, segmentFinished, upgradeState, type ActionRecord, type PlayerSetup } from '../engine/game';
import type { PlanResult } from '../engine/actions';
import { decode, encode, newId, newSecret, sign, verify, type AnswersPacket, type InvitePacket, type SegmentPacket, type Signed } from '../engine/packet';
import { canonical, shortHash, stateHash } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { other } from '../engine/types';

export const START_TIME = at(10, 6, 30);
/** Самый старый движок, чьи сохранения воспроизводятся текущим (поднимать только при несовместимых правках движка). */
export const MIN_COMPATIBLE_ENGINE = '0.2.0';

function olderThan(v: string | undefined, min: string): boolean {
  const a = (v ?? '0').split('.').map(Number);
  const b = min.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) < (b[i] ?? 0);
  }
  return false;
}
export const SAVE_SCHEMA = 1;

export interface CheckpointWork {
  index: number;
  partnerRecords?: ActionRecord[];
  merged?: GameState;
  mergedHash?: string;
  myAnswers?: Record<string, string>;
  partnerAnswers?: Record<string, string>;
  result?: { joint: JointResult[]; hash: string };
  /** Свои коды этой точки — переслать ещё раз, если партнёр не получил их до того, как точка была завершена. */
  sent?: { segment?: string; answers?: string };
}

export interface LocalSave {
  schema: number;
  me: PlayerId;
  pairId: string;
  secret: string;
  seed: string;
  phase: 'invited' | 'playing' | 'checkpoint' | 'ended';
  setups: Partial<Record<PlayerId, PlayerSetup>>;
  base?: GameState;
  baseHash?: string;
  state?: GameState;
  segment: ActionRecord[];
  last?: PlanResult;
  cp?: CheckpointWork;
  /** Последняя завершённая точка, в том числе при немедленном ожидании следующей. */
  lastCheckpoint?: Pick<CheckpointWork, 'index' | 'result' | 'sent'>;
  /** Согласованные хэши мира после каждой контрольной точки. */
  hashes: string[];
  /** Секунды реальной игры в текущем участке (для статистики, в мир не входит). */
  playSeconds: number;
  /** Сообщение игроку один раз (например, что после обновления часть действий пришлось отменить). */
  notice?: string;
  /** Последний код приглашения/ответа — чтобы переслать ещё раз после перезапуска. */
  outgoing?: string;
  updatedAt: number;
}

const clone = <T>(x: T): T => structuredClone(x);

const builds = new WeakMap<Content, string>();
/**
 * Отпечаток сборки: все данные сюжета, код погоды/связи и код движка. Если у партнёров он разный, их миры
 * посчитаются по-разному — это ловится сразу, с понятным текстом, а не загадочным расхождением.
 */
export function contentBuild(c: Content): string {
  let b = builds.get(c);
  if (!b) {
    const { weather, network, ...data } = c;
    b = stateHash(canonical(data) + String(weather) + String(network) + ENGINE_VERSION + __ENGINE_HASH__).slice(0, 12);
    builds.set(c, b);
  }
  return b;
}

function checkVersions(c: Content, p: { content: string; engine: string; build?: string }) {
  if (p.content !== c.version) throw new Error(`У партнёра другая версия сюжета (${p.content}, у тебя ${c.version}). Обновите приложение оба, подключившись к интернету.`);
  if (p.engine !== ENGINE_VERSION) throw new Error(`У партнёра другая версия движка (${p.engine}, у тебя ${ENGINE_VERSION}). Обновите приложение.`);
  if (p.build && p.build !== contentBuild(c)) throw new Error('У партнёра другая сборка игры. Закройте и откройте приложение оба при интернете — оно обновится — и отправьте коды ещё раз.');
}

function startGame(c: Content, save: LocalSave): LocalSave {
  const s = newGame(c, { pairId: save.pairId, seed: save.seed, startTime: START_TIME, players: save.setups as Record<PlayerId, PlayerSetup> });
  const h = stateHash(s);
  return { ...save, phase: 'playing', base: s, baseHash: h, state: clone(s), segment: [], hashes: [h], updatedAt: Date.now() };
}

// ───────────── Создание пары ─────────────

export async function createInvite(c: Content, me: PlayerId, setup: PlayerSetup, cloudToken?: string): Promise<{ save: LocalSave; code: string }> {
  const save: LocalSave = {
    schema: SAVE_SCHEMA, me, pairId: newId(), secret: newSecret(), seed: newId(), phase: 'invited',
    setups: { [me]: setup }, segment: [], hashes: [], playSeconds: 0, updatedAt: Date.now(),
  };
  const p: InvitePacket = { v: 1, type: 'invite', pairId: save.pairId, from: me, seed: save.seed, secret: save.secret, content: c.version, engine: ENGINE_VERSION, build: contentBuild(c), setup, ...(cloudToken ? { cloudToken } : {}) };
  const code = await encode(await sign(p, save.secret));
  return { save: { ...save, outgoing: code }, code };
}

export async function readInvite(c: Content, code: string): Promise<Signed<InvitePacket>> {
  const p = (await decode(code)) as Signed<InvitePacket>;
  if (p.type !== 'invite' || !p.secret) throw new Error('Это не приглашение в игру.');
  if (!(await verify(p, p.secret))) throw new Error('Код повреждён — попроси партнёра отправить его ещё раз.');
  checkVersions(c, p);
  return p;
}

export async function acceptInvite(c: Content, invite: Signed<InvitePacket>, setup: PlayerSetup): Promise<{ save: LocalSave; code: string }> {
  const me = other(invite.from);
  let save: LocalSave = {
    schema: SAVE_SCHEMA, me, pairId: invite.pairId, secret: invite.secret!, seed: invite.seed, phase: 'invited',
    setups: { [invite.from]: invite.setup as PlayerSetup, [me]: setup }, segment: [], hashes: [], playSeconds: 0, updatedAt: Date.now(),
  };
  save = startGame(c, save);
  const p: InvitePacket = { v: 1, type: 'join', pairId: save.pairId, from: me, seed: save.seed, content: c.version, engine: ENGINE_VERSION, build: contentBuild(c), setup };
  const code = await encode(await sign(p, save.secret));
  return { save: { ...save, outgoing: code }, code };
}

export async function acceptJoin(c: Content, save: LocalSave, code: string): Promise<LocalSave> {
  const p = (await decode(code)) as Signed<InvitePacket>;
  if (p.type !== 'join') throw new Error('Это не ответ на приглашение.');
  if (p.pairId !== save.pairId) throw new Error('Этот ответ — к другому приглашению.');
  if (!(await verify(p, save.secret))) throw new Error('Подпись не совпала — код повреждён или не от партнёра.');
  if (p.from === save.me) throw new Error('Это твой собственный код.');
  checkVersions(c, p);
  return startGame(c, { ...save, setups: { ...save.setups, [p.from]: p.setup as PlayerSetup } });
}

export const worldCode = (save: LocalSave) => (save.baseHash ? shortHash(save.baseHash) : '—');

// ───────────── Участок ─────────────

export function partnerOf(save: LocalSave): PlayerId {
  return other(save.me);
}

/** Может ли игрок играть участок от этой контрольной точки. */
function hadSegment(base: GameState, pid: PlayerId): boolean {
  return !base.ended && base.chars[pid].controlledBy === pid && canAct(base.chars[pid].body);
}

export function myFinish(c: Content, save: LocalSave): SegmentPacket['finish'] {
  if (!hadSegment(save.base!, save.me)) return 'absent';
  return segmentFinished(c, save.state!, save.me) || 'checkpoint';
}

export function act(c: Content, save: LocalSave, plan: string[]): LocalSave {
  const s = clone(save);
  const scene = s.state!.chars[s.me].scene;
  s.last = play(c, s.state!, s.me, plan);
  s.segment.push({ scene, plan });
  s.updatedAt = Date.now();
  if (segmentFinished(c, s.state!, s.me)) s.phase = 'checkpoint';
  if (s.phase === 'checkpoint') s.cp = { index: s.base!.checkpoint + 1 };
  return maybeMerge(c, s);
}

/**
 * После обновления игры (новая глава, правка текста): довезти новое в сохранение и пересчитать свой
 * участок текущей версией — ровно так, как его посчитает партнёр. Если какое-то действие стало
 * невозможным, участок обрезается перед ним, а игрок видит, сколько действий нужно повторить.
 */
export function refreshSave(c: Content, save: LocalSave): LocalSave {
  if (!save.base || !save.state || save.phase === 'invited' || save.phase === 'ended') return save;
  const s = clone(save);
  if (upgradeState(c, s.base!)) {
    s.baseHash = stateHash(s.base);
    s.hashes = [...s.hashes.slice(0, -1), s.baseHash];
  }
  if (s.phase === 'checkpoint' && s.cp?.result) return s;
  if (hadSegment(s.base!, s.me)) {
    const { state, applied } = replayPrefix(c, s.base!, s.me, s.segment);
    const lost = s.segment.length - applied;
    const changed = lost > 0 || stateHash(state) !== stateHash(save.state);
    s.state = state;
    if (lost > 0) {
      s.segment = s.segment.slice(0, applied);
      s.last = undefined;
      s.notice = `Игра обновилась: последние действия (${lost}) в новой версии невозможны и отменены — выбери заново.`;
    }
    if (changed && s.phase === 'checkpoint') {
      if (segmentFinished(c, s.state, s.me)) s.cp = { ...s.cp!, merged: undefined, mergedHash: undefined };
      else { s.phase = 'playing'; s.cp = undefined; }
    }
  } else {
    s.state = clone(s.base!);
  }
  if (s.phase === 'checkpoint' && s.cp && !s.cp.merged) {
    try { return maybeMerge(c, s); } catch { return { ...s, cp: { ...s.cp, partnerRecords: undefined } }; }
  }
  return s;
}

/** Если игрок не может действовать с начала участка — сразу контрольная точка. */
export function normalizePhase(c: Content, save: LocalSave): LocalSave {
  if (save.phase !== 'playing' || !save.base) return save;
  if (save.base.ended) return { ...save, phase: 'ended' };
  // На границе написанного продолжения нет следующей точки, которую можно ждать.
  if (save.base.checkpoint >= 5 && !c.checkpoints.some((cp) => cp.index === save.base!.checkpoint + 1)) return save;
  if (!hadSegment(save.base, save.me)) return maybeMerge(c, { ...save, phase: 'checkpoint', cp: { index: save.base.checkpoint + 1 } });
  return save;
}

export const needPartnerSegment = (save: LocalSave) => hadSegment(save.base!, partnerOf(save));

export async function mySegmentCode(c: Content, save: LocalSave): Promise<string> {
  const p: SegmentPacket = {
    v: 1, type: 'segment', pairId: save.pairId, from: save.me, checkpoint: save.base!.checkpoint + 1,
    baseHash: save.baseHash!, engine: ENGINE_VERSION, content: c.version, build: contentBuild(c), actions: save.segment,
    endHash: stateHash(save.state), finish: myFinish(c, save),
  };
  return encode(await sign(p, save.secret));
}

async function readPacket<T extends SegmentPacket | AnswersPacket>(c: Content, save: LocalSave, code: string, type: T['type']): Promise<T> {
  const p = (await decode(code)) as Signed<T>;
  if (p.type !== type) throw new Error(type === 'segment' ? 'Это не код хода — нужен код «мой участок».' : 'Это не код ответов.');
  if (p.pairId !== save.pairId) throw new Error('Код от другой игры.');
  if (p.from === save.me) throw new Error('Это твой собственный код — нужен код партнёра.');
  if (!(await verify(p, save.secret))) throw new Error('Подпись не совпала — код повреждён или изменён.');
  if (p.checkpoint !== save.base!.checkpoint + 1) throw new Error(`Код для контрольной точки №${p.checkpoint}, а у тебя №${save.base!.checkpoint + 1}.`);
  if ('engine' in p) checkVersions(c, p as SegmentPacket);
  return p;
}

export async function acceptPartnerSegment(c: Content, save: LocalSave, code: string): Promise<LocalSave> {
  const p = await readPacket<SegmentPacket>(c, save, code, 'segment');
  if (p.baseHash !== save.baseHash) throw new Error('Вы начинали участок с разных состояний мира. Сравните коды мира на экране «Ещё».');
  const prev = save.cp?.partnerRecords;
  if (prev && JSON.stringify(prev) !== JSON.stringify(p.actions)) throw new Error('Партнёр уже присылал другой ход на эту точку. Переиграть участок нельзя.');
  const replayed = replaySegment(c, save.base!, p.from, p.actions);
  if (stateHash(replayed) !== p.endHash) throw new Error('Ход партнёра воспроизвёлся иначе, чем у него. Проверьте, что у обоих одна версия приложения.');
  return maybeMerge(c, { ...save, cp: { ...(save.cp ?? { index: save.base!.checkpoint + 1 }), partnerRecords: p.actions } });
}

function maybeMerge(c: Content, save: LocalSave): LocalSave {
  if (save.phase !== 'checkpoint' || !save.cp || save.cp.merged) return save;
  const partner = partnerOf(save);
  if (needPartnerSegment(save) && !save.cp.partnerRecords) return save;
  const results: Partial<Record<PlayerId, GameState>> = {};
  if (hadSegment(save.base!, save.me)) results[save.me] = save.state!;
  if (save.cp.partnerRecords) results[partner] = replaySegment(c, save.base!, partner, save.cp.partnerRecords);
  if (!results.A && !results.B) results[save.me] = save.state!;
  const merged = mergeSegments(c, save.base!, results);
  const cpDef = c.checkpoints.find((x) => x.index === save.cp!.index);
  syncClocks(c, merged, cpDef?.syncNotBefore);
  deliverMessages(c, merged);
  mergeNotes(c, merged, save.cp.index);
  return { ...save, cp: { ...save.cp, merged, mergedHash: stateHash(merged) } };
}

// ───────────── Совместные вопросы ─────────────

export function jointFor(c: Content, save: LocalSave, pid: PlayerId): JointDecision[] {
  const merged = save.cp?.merged;
  if (!merged) return [];
  const cp = c.checkpoints.find((x) => x.index === save.cp!.index);
  return (cp?.joint ?? []).map((id) => c.joint[id]).filter((d) => participants(c, merged, d).includes(pid));
}

export const myQuestions = (c: Content, save: LocalSave) => jointFor(c, save, save.me);
export const partnerAnswers = (c: Content, save: LocalSave) => jointFor(c, save, partnerOf(save)).length > 0;
/** С КТ 5 ответ единственного участника тоже нужен второму телефону для общего результата. */
export const shouldSendAnswers = (c: Content, save: LocalSave): boolean => !!save.cp?.myAnswers
  && (partnerAnswers(c, save) || (save.cp.index >= 5 && myQuestions(c, save).length > 0));
export const optionsForMe = (c: Content, save: LocalSave, d: JointDecision) => optionsFor(c, save.cp!.merged!, d, save.me);

export async function myAnswersCode(save: LocalSave): Promise<string> {
  const p: AnswersPacket = { v: 1, type: 'answers', pairId: save.pairId, from: save.me, checkpoint: save.cp!.index, mergedHash: save.cp!.mergedHash!, answers: save.cp!.myAnswers ?? {} };
  return encode(await sign(p, save.secret));
}

export async function acceptPartnerAnswers(c: Content, save: LocalSave, code: string): Promise<LocalSave> {
  const p = await readPacket<AnswersPacket>(c, save, code, 'answers');
  if (p.mergedHash !== save.cp!.mergedHash) throw new Error('После обмена ходами у вас получились разные миры. Сравните коды мира.');
  const prev = save.cp?.partnerAnswers;
  if (prev && JSON.stringify(prev) !== JSON.stringify(p.answers)) throw new Error('Партнёр уже присылал другие ответы. Изменить их нельзя.');
  return { ...save, cp: { ...save.cp!, partnerAnswers: p.answers } };
}

export function readyToFinish(c: Content, save: LocalSave): boolean {
  const cp = save.cp;
  if (!cp?.merged) return false;
  if (myQuestions(c, save).length && !cp.myAnswers) return false;
  if (partnerAnswers(c, save) && !cp.partnerAnswers) return false;
  return true;
}

export function finishCheckpoint(c: Content, save: LocalSave, sent?: CheckpointWork['sent']): LocalSave {
  const cp = save.cp!;
  const out = completeCheckpoint(c, cp.merged!, { [save.me]: cp.myAnswers ?? {}, [partnerOf(save)]: cp.partnerAnswers ?? {} });
  const next: LocalSave = {
    ...save, phase: out.state.ended ? 'ended' : 'playing', base: out.state, baseHash: out.hash, state: clone(out.state),
    // От пройденной точки остаётся только итог: слитый мир и журнал партнёра больше не нужны.
    segment: [], last: undefined, cp: { index: cp.index, myAnswers: cp.myAnswers, result: { joint: out.joint, hash: out.hash }, sent }, hashes: [...save.hashes, out.hash],
    ...(cp.index >= 5 ? { lastCheckpoint: { index: cp.index, result: { joint: out.joint, hash: out.hash }, sent } } : {}),
    playSeconds: 0, updatedAt: Date.now(),
  };
  return normalizePhase(c, next);
}

// ───────────── Экспорт / импорт сохранения ─────────────

export function exportSave(save: LocalSave): string {
  return JSON.stringify({ kvestSave: 1, save });
}

export function importSave(c: Content, text: string): LocalSave {
  const obj = JSON.parse(text);
  if (obj?.kvestSave !== 1 || !obj.save?.pairId) throw new Error('Это не файл сохранения Kvest.');
  const save = obj.save as LocalSave;
  if (save.schema > SAVE_SCHEMA) throw new Error('Сохранение сделано более новой версией приложения.');
  if (save.base && save.base.contentVersion !== c.version) throw new Error(`Сохранение для версии сюжета ${save.base.contentVersion}, а приложение — ${c.version}.`);
  if (save.base && olderThan(save.base.engineVersion, MIN_COMPATIBLE_ENGINE)) {
    throw new Error(`Сохранение сделано движком ${save.base.engineVersion}: с текущей версией (${ENGINE_VERSION}) оно не воспроизведётся.`);
  }
  return save;
}
