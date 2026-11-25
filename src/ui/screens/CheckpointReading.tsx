import { useEffect, useId, useRef, useState } from 'react';
import type { ReadingEntry } from '../checkpoint-reading';
import { Icon } from '../kit';
import { Narrative } from '../Narrative';

export function CheckpointReading({ entries, waiting }: { entries: readonly ReadingEntry[]; waiting: boolean }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const sceneId = useId();
  const entry = entries[index];
  const previous = entries[index - 1];
  const next = entries[index + 1];

  useEffect(() => {
    if (!dialog.current?.open) return;
    if (body.current) body.current.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
  }, [index]);

  return (
    <>
      {waiting && (
        <button className="action reading-action" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
          <Icon name="story" />
          <span className="label">Если бы всё пошло иначе<span className="why">Почитать, пока ждёшь</span></span>
          <Icon name="chevron" size={18} />
        </button>
      )}
      <dialog className="checkpoint-reading" ref={dialog} aria-labelledby={titleId}>
        <header className="reading-header">
          <h2 id={titleId}>Если бы всё пошло иначе</h2>
          <button className="icon-btn" aria-label="Вернуться к контрольной точке" onClick={() => dialog.current?.close()}>
            <Icon name="x" size={20} />
          </button>
        </header>
        <div className="reading-body" ref={body}>
          <article aria-labelledby={sceneId}>
            <div className="scene-title">Точка {entry.point}</div>
            <h3 id={sceneId} ref={heading} tabIndex={-1}>{entry.title}</h3>
            <div className="story"><Narrative text={entry.text} /></div>
          </article>
        </div>
        <footer className="reading-footer">
          {!waiting && <div className="small muted" role="status">Можно продолжить на контрольной точке.</div>}
          <div className="reading-nav">
            <button className="btn" disabled={!previous} onClick={() => setIndex(index - 1)}>Назад</button>
            <select aria-label="Выбрать точку" value={index} onChange={(e) => setIndex(Number(e.target.value))}>
              {entries.map(({ point }, i) => <option value={i} key={point}>Точка {point}</option>)}
            </select>
            <button className="btn primary" onClick={() => next ? setIndex(index + 1) : dialog.current?.close()}>
              {next ? 'Дальше' : 'К точке'}
            </button>
          </div>
        </footer>
      </dialog>
    </>
  );
}
