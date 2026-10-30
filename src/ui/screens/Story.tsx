import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { availableActions, currentScene, isServiceAction, validatePlan, type AvailableAction } from '../../engine/actions';
import { evalCond } from '../../engine/conditions';
import { durationLabel } from '../../engine/time';
import { fmt, type Ctx } from '../../engine/world';
import type { LocalSave } from '../../app/session';
import { Icon } from '../kit';

export function Story({ save, ctx, onPlan }: { save: LocalSave; ctx: Ctx; onPlan: (plan: string[]) => void }) {
  const scene = currentScene(ctx);
  const [sel, setSel] = useState<string[]>([]);
  const [showDaily, setShowDaily] = useState(false);
  const [showScene, setShowScene] = useState(false);
  // После действия в той же сцене вступление уже прочитано — сворачиваем его.
  const stayed = !!save.last?.steps.length && save.segment[save.segment.length - 1]?.scene === scene.id;
  const all = useMemo(() => availableActions(ctx).filter((a) => !isServiceAction(a.def.id)), [ctx]);
  const sceneActions = all.filter((a) => !a.universal);
  const daily = all.filter((a) => a.universal);
  const byId = new Map(all.map((a) => [a.def.id, a]));
  const check = sel.length ? validatePlan(ctx, sel) : null;
  // Панель плана закреплена внизу: под ней оставляем ровно столько места, сколько она занимает,
  // иначе нижние действия оказываются под панелью и их не нажать.
  const planRef = useRef<HTMLDivElement>(null);
  const [planH, setPlanH] = useState(0);
  const planOpen = sel.length > 0;
  useLayoutEffect(() => {
    const el = planRef.current;
    if (!el) { setPlanH(0); return; }
    setPlanH(el.offsetHeight);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setPlanH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [planOpen]);

  const toggle = (a: AvailableAction) => {
    // Недоступное можно выбрать, только если оно ждёт шаг, который стоит в плане раньше (движок проверит порядок).
    if (!a.enabled && !a.waitsFor?.length) return;
    setSel((cur) => {
      if (cur.includes(a.def.id)) return cur.filter((x) => x !== a.def.id);
      if (!a.def.combinable) return [a.def.id];
      const keep = cur.filter((x) => byId.get(x)?.def.combinable);
      return [...keep, a.def.id];
    });
  };
  const move = (i: number, d: -1 | 1) => setSel((cur) => {
    const next = [...cur];
    const j = i + d;
    if (j < 0 || j >= next.length) return cur;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  const run = () => { if (check?.ok) { onPlan(sel); setSel([]); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const last = save.last;
  return (
    <div className="page">
      {last && last.steps.length > 0 && (
        <div className="result">
          {last.steps.map((st, i) => (
            <div key={i}>
              <div className="step"><b>{fmt(ctx, st.label)}</b> · {durationLabel(st.minutes)}</div>
              {st.text.map((t, j) => <p key={j}>{t}</p>)}
            </div>
          ))}
          {last.stopped && <div className="stopped">{last.stopped}</div>}
        </div>
      )}
      {scene.title && <div className="scene-title">{scene.title}</div>}
      {stayed && !showScene
        ? <button className="group-toggle" onClick={() => setShowScene(true)}><Icon name="chevron" size={16} />Обстановка</button>
        : <div className="story">{scene.text.filter((b) => evalCond(ctx, b.when)).map((b, i) => <p key={i}>{fmt(ctx, b.text)}</p>)}</div>}

      <div className="actions">
        {sceneActions.map((a) => <ActionCard key={a.def.id} a={a} n={sel.indexOf(a.def.id)} ctx={ctx} onTap={() => toggle(a)} />)}
      </div>

      {daily.length > 0 && (
        <>
          <button className="group-toggle" onClick={() => setShowDaily((v) => !v)}>
            <span style={{ transform: showDaily ? 'rotate(90deg)' : 'none', display: 'inline-flex', transition: 'transform .15s' }}><Icon name="chevron" size={16} /></span>
            Повседневное и связь ({daily.length})
          </button>
          {showDaily && <div className="actions">{daily.map((a) => <ActionCard key={a.def.id} a={a} n={sel.indexOf(a.def.id)} ctx={ctx} onTap={() => toggle(a)} />)}</div>}
        </>
      )}
      {sceneActions.length === 0 && daily.length === 0 && <p className="muted">Здесь пока нечего делать.</p>}

      {sel.length > 0 && (
        <div className="plan">
          <div className="plan-inner" ref={planRef}>
            <div className="plan-rows">{sel.map((id, i) => (
              <div className="plan-row" key={id}>
                <span className="n">{i + 1}</span>
                <span className="t">{fmt(ctx, byId.get(id)?.def.label ?? id)}</span>
                {sel.length > 1 && <>
                  <button className="icon-btn" onClick={() => move(i, -1)} aria-label="Выше"><Icon name="up" size={16} /></button>
                  <button className="icon-btn" onClick={() => move(i, 1)} aria-label="Ниже"><Icon name="down" size={16} /></button>
                </>}
                <button className="icon-btn" onClick={() => setSel(sel.filter((x) => x !== id))} aria-label="Убрать"><Icon name="x" size={16} /></button>
              </div>
            ))}</div>
            {check && !check.ok && <div className="errors">{check.errors.join(' ')}</div>}
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setSel([])}>Отмена</button>
              <button className="btn primary" disabled={!check?.ok} onClick={run}>
                {sel.length > 1 ? `Выполнить по порядку (${sel.length})` : 'Выполнить'}
              </button>
            </div>
          </div>
        </div>
      )}
      {planOpen && <div style={{ height: planH + 16 }} />}
    </div>
  );
}

function ActionCard({ a, n, ctx, onTap }: { a: AvailableAction; n: number; ctx: Ctx; onTap: () => void }) {
  const on = n >= 0;
  return (
    <button className={`action ${on ? 'sel' : ''} ${a.enabled ? '' : 'off'}`} onClick={onTap}>
      <span className="num">{on ? n + 1 : a.def.terminal || a.def.goto || !a.def.combinable ? '›' : '+'}</span>
      <span className="label">
        {fmt(ctx, a.def.label)}{a.def.risky && <span className="risky">риск</span>}
        {!a.enabled && <span className="why">{a.reason}</span>}
      </span>
      {a.def.minutes > 0 && <span className="meta">~{durationLabel(a.def.minutes)}</span>}
    </button>
  );
}
