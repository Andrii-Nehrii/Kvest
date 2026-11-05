import type { PlayerId } from '../engine/types';
import { partnerOf, type LocalSave } from './session';
import { REPLAY_ID, REPLAY_PAIR } from './requested-replay';

// Разовая отмена ответа на контрольной точке по прямой просьбе игроков: ответивший выбирает заново,
// второй телефон забывает прежний ответ и принимает только новый (с пометкой retry).
export const ANSWER_RESET = { pair: REPLAY_PAIR, replay: REPLAY_ID, cp: 10, from: 'B' as PlayerId };

const target = (s: LocalSave) => s.pairId === ANSWER_RESET.pair && s.replay === ANSWER_RESET.replay
  && s.phase === 'checkpoint' && s.cp?.index === ANSWER_RESET.cp && !s.cp.result && !s.cp.reset;

/** Партнёр уже завершил точку прежним ответом — тогда отменять поздно (миры разойдутся). */
function partnerFinished(text: string | undefined): boolean | undefined {
  if (!text) return undefined;
  try {
    const p = JSON.parse(text).save as LocalSave;
    return (p.lastCheckpoint?.index ?? 0) >= ANSWER_RESET.cp || (p.base?.checkpoint ?? 0) >= ANSWER_RESET.cp;
  } catch { return undefined; }
}

export async function answerReset(save: LocalSave, readPartnerSave: (me: PlayerId) => Promise<string | undefined>): Promise<LocalSave | undefined> {
  if (!target(save)) return;
  if (save.me === ANSWER_RESET.from) {
    if (!save.cp!.myAnswers) return { ...save, cp: { ...save.cp!, reset: 'mine' }, updatedAt: Date.now() };
    // Без связи или без сохранения партнёра в облаке — попробовать при следующем запуске.
    if (partnerFinished(await readPartnerSave(partnerOf(save)).catch(() => undefined)) !== false) return;
    return { ...save, cp: { ...save.cp!, myAnswers: undefined, reset: 'mine' }, updatedAt: Date.now(), notice: 'Ответ на контрольной точке сброшен — выбери заново.' };
  }
  return { ...save, cp: { ...save.cp!, partnerAnswers: undefined, reset: 'partner' }, updatedAt: Date.now() };
}
