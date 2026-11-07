import { useEffect, useRef, useState } from 'react';
import { cloudPairId, cloudPaths, getFile } from '../app/cloud';
import { progressNote, type ProgressNote } from '../app/progress';
import type { LocalSave } from '../app/session';
import { other } from '../engine/types';
import { content } from '../content';

const POLL_MS = 60_000;
/** Если партнёр ещё на старой сборке (файла прогресса нет), сохранение читается не чаще раза в 5 минут. */
const SAVE_FALLBACK_MS = 5 * 60_000;

function ago(ms: number): string {
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'сейчас';
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ч`;
  return `${Math.floor(h / 24)} дн`;
}

async function fetchPartner(token: string, save: LocalSave, allowSave: boolean): Promise<ProgressNote | undefined> {
  const pair = cloudPairId(save), pid = other(save.me);
  const text = await getFile(token, cloudPaths.progress(pair, pid));
  if (text) return JSON.parse(text) as ProgressNote;
  if (!allowSave) return undefined;
  const raw = await getFile(token, cloudPaths.save(pair, pid));
  if (!raw) return undefined;
  const theirs = JSON.parse(raw)?.save as LocalSave | undefined;
  return theirs ? progressNote(content, theirs, theirs.updatedAt) : undefined;
}

/** Тонкая строка над историей: примерный прогресс участка у обоих и когда обновлялось у партнёра. */
export function ProgressStrip({ save, token }: { save: LocalSave; token?: string }) {
  const [partner, setPartner] = useState<ProgressNote | undefined>();
  const [now, setNow] = useState(Date.now());
  const saveRef = useRef(save);
  saveRef.current = save;
  const lastSaveRead = useRef(0);
  const pairKey = `${cloudPairId(save)}:${save.me}`;

  useEffect(() => {
    setPartner(undefined);
    if (!token) return;
    let alive = true;
    const load = () => {
      if (document.visibilityState === 'hidden') return;
      const allowSave = Date.now() - lastSaveRead.current > SAVE_FALLBACK_MS;
      fetchPartner(token, saveRef.current, allowSave).then((n) => {
        if (!n && allowSave) lastSaveRead.current = Date.now();
        if (alive && n) setPartner((cur) => (!cur || n.at >= cur.at ? n : cur));
      }).catch(() => {});
    };
    load();
    const t = setInterval(load, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    const onVisible = () => { if (document.visibilityState === 'visible') { setNow(Date.now()); load(); } };
    document.addEventListener('visibilitychange', onVisible);
    return () => { alive = false; clearInterval(t); clearInterval(tick); document.removeEventListener('visibilitychange', onVisible); };
  }, [token, pairKey]);

  const mine = progressNote(content, save);
  if (!mine || !save.state) return null;
  const myCp = mine.cp;
  const name = (pid: 'A' | 'B') => save.state!.chars[pid].name.nom;

  let theirPct: number | null = null, theirText = '…';
  if (partner) {
    if (partner.cp > myCp) { theirPct = 1; theirText = '✓'; }
    else if (partner.cp < myCp) { theirPct = 1; theirText = 'на точке'; }
    else if (partner.phase === 'checkpoint') { theirPct = 1; theirText = 'на точке'; }
    else { theirPct = partner.pct; theirText = partner.pct === null ? '?' : `${Math.round(partner.pct * 100)}%`; }
    { const a = ago(now - partner.at); theirText += a === 'сейчас' ? ' · сейчас' : ` · ${a} назад`; }
  }
  const myText = save.phase === 'checkpoint' ? 'на точке' : mine.pct === null ? '?' : `${Math.round(mine.pct * 100)}%`;
  if (mine.pct === null && !token) return null;

  const bar = (pct: number | null) => (
    <span className="pbar"><i style={{ width: `${Math.round((pct ?? 0) * 100)}%` }} /></span>
  );
  return (
    <div className="progress-strip" aria-label="Прогресс до контрольной точки">
      <span className="who">{name(save.me)}</span>{bar(mine.pct)}<span className="val">{myText}</span>
      {token && <>
        <span className="who">{name(other(save.me))}</span>{bar(theirPct)}<span className="val">{theirText}</span>
      </>}
    </div>
  );
}
