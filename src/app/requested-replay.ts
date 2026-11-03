import type { Content } from '../engine/content-types';
import { stateHash } from '../engine/rng';
import { importSave, type LocalSave } from './session';

// Одноразовое повторное прохождение по прямому запросу игроков. Сохранений и секрета пары в коде нет.
export const REPLAY_PAIR = 'Uwz9uRin2OZVCugy';
export const REPLAY_ID = 'replay6-long-20261103';
const PREVIOUS_REPLAY_ID = 'replay6-20261102';
export const replayBackupKey = (me: string) => `backup-before-${REPLAY_ID}-${me}`;
export const requestedReplaySource = (s: LocalSave) => s.pairId === REPLAY_PAIR
  && (!s.replay || s.replay === PREVIOUS_REPLAY_ID) && !!s.base && s.base.checkpoint >= 5;

export async function requestedReplay(
  content: Content, current: LocalSave,
  read: (cloudId: string, me: LocalSave['me']) => Promise<string | undefined>,
): Promise<LocalSave | undefined> {
  if (!requestedReplaySource(current)) return;
  const raw = await read(`${REPLAY_PAIR}-${REPLAY_ID}`, current.me);
  if (!raw) throw new Error('Повторное прохождение ещё не загружено. Обновите игру при подключении к интернету.');
  const next = importSave(content, raw);
  // В облаке уже может быть более новый ход этого повтора: его не обнуляем.
  if (next.pairId !== current.pairId || next.me !== current.me || next.secret !== current.secret || next.seed !== current.seed
    || next.replay !== REPLAY_ID || !next.base || next.base.checkpoint < 5 || !next.state
    || current.hashes.length < 6 || current.hashes.slice(0, 6).some((hash, i) => next.hashes[i] !== hash)
    || stateHash(next.base) !== next.baseHash) throw new Error('Не удалось проверить сохранение для повторного прохождения.');
  return next;
}
