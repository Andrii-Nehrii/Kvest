// Мелкие общие компоненты: иконки, шкалы, обмен кодами.
import { useState, type ReactNode } from 'react';

const P = {
  story: 'M4 5.5C6.5 4 9.5 4 12 5.5v14c-2.5-1.5-5.5-1.5-8 0zM12 5.5c2.5-1.5 5.5-1.5 8 0v14c-2.5-1.5-5.5-1.5-8 0',
  items: 'M7 8V6a5 5 0 0 1 10 0v2M5 8h14l-1 12H6zM9 12h6',
  body: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10zM8 11h2l1-2 2 4 1-2h2',
  journal: 'M7 4h10v16H7zM10 8h4M10 12h4M10 16h2',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14c2 .8 3 3 3 6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  x: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 6l6 6-6 6',
  share: 'M12 15V3M7 8l5-5 5 5M5 13v6h14v-6',
  copy: 'M8 8h11v11H8zM5 16V5h11',
} as const;

export function Icon({ name, size = 22 }: { name: keyof typeof P; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'more' ? 3.2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={P[name]} /></svg>
  );
}

export function Meter({ label, value, max = 100, text, invert, warnAt = 50, badAt = 75 }: {
  label: string; value: number; max?: number; text?: string; invert?: boolean; warnAt?: number; badAt?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const level = invert ? 100 - pct : pct;
  const cls = level >= badAt ? 'bad' : level >= warnAt ? 'warn' : '';
  return (
    <div className="meter">
      <div className="top"><span>{label}</span><span className="muted">{text ?? Math.round(value)}</span></div>
      <div className="bar"><div className={`fill ${cls}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function Card({ title, children, tone }: { title?: string; children: ReactNode; tone?: 'warn' | 'bad' }) {
  return <section className={`card ${tone ?? ''}`}>{title && <h3>{title}</h3>}{children}</section>;
}

/** Отправить код партнёру: «Поделиться» (мессенджер) или копировать. */
export function CodeOut({ code, hint }: { code: string; hint?: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const share = async () => {
    try { await navigator.share({ text: code }); } catch { /* пользователь закрыл меню */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt('Скопируй код:', code); }
  };
  return (
    <div className="stack">
      {hint && <div className="muted small">{hint}</div>}
      <div className="code-box">{code}</div>
      <div className="row">
        {canShare && <button className="btn primary" onClick={share}><Icon name="share" size={18} />Поделиться</button>}
        <button className={`btn ${canShare ? '' : 'primary'}`} onClick={copy}><Icon name="copy" size={18} />{copied ? 'Скопировано' : 'Копировать'}</button>
      </div>
    </div>
  );
}

/** Принять код партнёра: вставить из буфера или вручную. */
export function CodeIn({ onSubmit, cta = 'Принять код' }: { onSubmit: (code: string) => Promise<void>; cta?: string }) {
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (value = text) => {
    setBusy(true); setErr('');
    try { await onSubmit(value.trim()); setText(''); } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const paste = async () => {
    try { const t = await navigator.clipboard.readText(); setText(t); if (t.includes('KVEST1.')) await submit(t); }
    catch { setErr('Нет доступа к буферу — вставь код в поле вручную (долгое нажатие → «Вставить»).'); }
  };
  return (
    <div className="stack">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="KVEST1.…" spellCheck={false} />
      {err && <div className="errors">{err}</div>}
      <div className="row">
        <button className="btn" onClick={paste} disabled={busy}>Вставить</button>
        <button className="btn primary" onClick={() => submit()} disabled={busy || !text.includes('KVEST1.')}>{cta}</button>
      </div>
    </div>
  );
}
