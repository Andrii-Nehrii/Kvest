// Экраны состояния: вещи, тело, журнал, люди. Показывают только то, что знает персонаж.
import { useState } from 'react';
import { availableActions } from '../../engine/actions';
import { painLevel, symptoms } from '../../engine/body';
import { clock, dateLabel } from '../../engine/time';
import { caps, carriedWeight, carryLimit, fmt, heldItems, itemsAt, itemType, type Ctx } from '../../engine/world';
import { Card, Meter } from '../kit';
import { consciousnessWord, injuryText, knownNpc, trustWord, weightText } from '../format';

const IMPORTANT = ['keys', 'phone', 'medicine', 'card', 'money'];

export function Items({ ctx, onPlan }: { ctx: Ctx; onPlan: (plan: string[]) => void }) {
  const ch = ctx.s.chars[ctx.pid];
  const held = heldItems(ctx);
  const here = itemsAt(ctx, ch.location);
  const w = carriedWeight(ctx);
  const lim = carryLimit(ctx);
  const [open, setOpen] = useState<string | null>(null);
  const [allHere, setAllHere] = useState(false);
  const HERE_SHOWN = 8;
  const describe = (i: (typeof held)[number]) => {
    const t = itemType(ctx, i.type);
    const extra = [
      i.qty > 1 ? `×${i.qty}` : '',
      i.charge !== undefined ? (t.tags.includes('antiseptic') ? `осталось ${Math.round(i.charge)} %` : `заряд ${Math.round(i.charge)} %`) : '',
      i.fuel !== undefined && (t.vehicle || t.fuelCan) ? (t.fuelCan && i.fuel <= 0 ? 'пустая' : `${i.fuel} л`) : '',
      i.condition < 100 ? `износ ${100 - Math.round(i.condition)} %` : '',
    ].filter(Boolean).join(' · ');
    return { t, extra };
  };
  // Кнопки — только для действий, которые движок сейчас разрешает (на точке и в «продолжение следует» их нет).
  const avail = new Set(availableActions(ctx).filter((a) => a.enabled).map((a) => a.def.id));
  /** Ключи, телефон, лекарства, деньги: случайно оставить их — дорого обойдётся. */
  const drop = (i: (typeof held)[number], action: string) => {
    const t = itemType(ctx, i.type);
    if (IMPORTANT.some((tag) => t.tags.includes(tag)) && !confirm(`Оставить здесь: ${t.name}?`)) return;
    onPlan([action]);
  };
  return (
    <div className="page">
      <Card title="Нагрузка">
        <Meter label="Вес на себе" value={w} max={lim * 1.5} text={`${weightText(w)} из ~${weightText(lim)}`} warnAt={60} badAt={80} />
        {w > lim * 1.25 && <div className="small" style={{ color: 'var(--accent)' }}>Перегруз — устаёшь заметно быстрее.</div>}
      </Card>
      <Card title="С собой">
        <div className="list">
          {held.length === 0 && <div className="muted">Ничего.</div>}
          {held.map((i) => {
            const { t, extra } = describe(i);
            return (
              <div key={i.id}>
                <div className="li" onClick={() => setOpen(open === i.id ? null : i.id)}>
                  <span className="grow">{t.name}</span><span className="muted small">{extra}</span>
                </div>
                {open === i.id && t.description && <div className="small muted" style={{ padding: '2px 0 6px' }}>{t.description}</div>}
                {open === i.id && avail.has(`u:drop1:${i.type}`) && (
                  <div className="row" style={{ padding: '4px 0 10px' }}>
                    <button className="btn" onClick={() => drop(i, `u:drop1:${i.type}`)}>{i.qty > 1 ? 'Оставить одну штуку' : 'Оставить здесь'}</button>
                    {i.qty > 1 && avail.has(`u:dropall:${i.type}`) && <button className="btn" onClick={() => drop(i, `u:dropall:${i.type}`)}>Оставить все</button>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      <Card title={`Здесь: ${ctx.c.locations[ch.location]?.name ?? ch.location}`}>
        <div className="list">
          {here.length === 0 && <div className="muted">Ничего полезного на виду.</div>}
          {(allHere ? here : here.slice(0, HERE_SHOWN)).map((i) => {
            const { t, extra } = describe(i);
            const takeable = !t.vehicle && t.weight <= 30000 && avail.has(`u:take:${i.type}`);
            return (
              <div className="li" key={i.id}>
                <span className="grow">{t.name}</span><span className="muted small">{extra}</span>
                {takeable && <button className="btn" style={{ minHeight: 44, padding: '0 14px' }} onClick={() => onPlan([`u:take:${i.type}`])}>Взять</button>}
              </div>
            );
          })}
          {!allHere && here.length > HERE_SHOWN && (
            <button className="group-toggle" onClick={() => setAllHere(true)}>Показать всё ({here.length})</button>
          )}
        </div>
      </Card>
    </div>
  );
}

export function BodyScreen({ ctx }: { ctx: Ctx }) {
  const ch = ctx.s.chars[ctx.pid];
  const b = ch.body;
  const k = caps(ctx);
  const sym = symptoms(b, ch.time);
  const pain = painLevel(b, ch.time);
  const female = ch.gender === 'f';
  return (
    <div className="page">
      <div className="h1">{ch.name.nom}</div>
      <p className="lead">{consciousnessWord(b, female)} · температура {b.coreTemp.toFixed(1).replace('.', ',')} °C</p>
      {sym.length > 0 && <Card title="Самочувствие" tone="warn">{sym.map((s) => <div key={s}>{s}</div>)}</Card>}
      <Card title="Возможности">
        <Meter label="Подвижность" value={k.mobility * 100} text={`${Math.round(k.mobility * 100)} %`} invert />
        <Meter label="Внимание" value={k.focus * 100} text={`${Math.round(k.focus * 100)} %`} invert />
        <Meter label="Сила" value={k.strength * 100} text={`${Math.round(k.strength * 100)} %`} invert />
      </Card>
      <Card title="Потребности">
        <Meter label="Жажда" value={b.thirst} />
        <Meter label="Голод" value={b.hunger} />
        <Meter label="Усталость" value={b.fatigue} />
        <Meter label="Недосып" value={b.sleepDebt} max={24} text={b.sleepDebt < 1 ? 'нет' : `≈${Math.round(b.sleepDebt)} ч`} warnAt={35} badAt={55} />
        <Meter label="Напряжение" value={b.stress} />
        {b.bloodLoss > 1 && <Meter label="Потеря крови" value={b.bloodLoss} warnAt={15} badAt={40} />}
        {pain > 0 && <Meter label="Боль" value={pain} warnAt={25} badAt={55} />}
      </Card>
      <Card title="Травмы">
        {b.injuries.filter((i) => i.healed < 1).length === 0 ? <div className="muted">Нет.</div>
          : b.injuries.filter((i) => i.healed < 1).map((i) => <div className="li" key={i.id}>{injuryText(i)}</div>)}
      </Card>
      <Card title="Черты">
        <div className="small muted">
          Сила {ch.traits.strength} · Выносливость {ch.traits.endurance} · Ловкость {ch.traits.agility} · Рукопашная {ch.traits.melee}<br />
          Медицина {ch.traits.medicine} · Вождение {ch.traits.driving} · Скрытность {ch.traits.stealth} · Убеждение {ch.traits.persuasion} · Техника {ch.traits.technical}
        </div>
      </Card>
    </div>
  );
}

export function Journal({ ctx }: { ctx: Ctx }) {
  const entries = ctx.s.log.filter((e) => e.pid === ctx.pid && e.kind !== 'action').slice().reverse();
  const [kind, setKind] = useState<'all' | 'news' | 'message' | 'body'>('all');
  const shown = entries.filter((e) => kind === 'all' || e.kind === kind).slice(0, 300);
  let lastDay = '';
  return (
    <div className="page">
      <div className="row" style={{ margin: '6px 0 10px' }}>
        {(['all', 'news', 'message', 'body'] as const).map((k) => (
          <button key={k} className={`btn ${kind === k ? 'primary' : ''}`} style={{ minHeight: 44, padding: '0 8px', fontSize: 13 }} onClick={() => setKind(k)}>
            {{ all: 'Всё', news: 'Новости', message: 'Связь', body: 'Тело' }[k]}
          </button>
        ))}
      </div>
      {shown.length === 0 && <p className="muted">Пока пусто.</p>}
      {shown.map((e) => {
        const day = dateLabel(e.at);
        const head = day !== lastDay ? (lastDay = day) : null;
        return (
          <div key={`${e.pid}${e.seq}`}>
            {head && <div className="scene-title">{head}</div>}
            <div className="li"><span className="faint small" style={{ width: 42, flex: 'none' }}>{clock(e.at)}</span><span className="grow">{e.text}</span></div>
          </div>
        );
      })}
    </div>
  );
}

export function People({ ctx }: { ctx: Ctx }) {
  const known = Object.values(ctx.s.npcs).filter((n) => knownNpc(n, ctx.pid, ctx.s.vars));
  const facts = Object.entries(ctx.s.knowledge[ctx.pid]).sort((a, b) => a[1].at - b[1].at);
  const topics = [...new Set(facts.map(([id]) => ctx.c.facts[id]?.topic ?? 'разное'))];
  return (
    <div className="page">
      <Card title="Знакомые люди">
        {known.length === 0 && <div className="muted">Пока никого.</div>}
        {known.map((n) => {
          const def = ctx.c.npcs[n.id];
          const tw = trustWord(n.trust[ctx.pid]);
          return (
            <div className="li" key={n.id} style={{ display: 'block' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <b style={{ flex: 1 }}>{def.name}</b><span className={`tag ${tw.tone}`}>{tw.text}</span>
              </div>
              <div className="small muted">{def.intro}</div>
            </div>
          );
        })}
      </Card>
      {topics.map((t) => (
        <Card key={t} title={`Что известно: ${t}`}>
          {facts.filter(([id]) => (ctx.c.facts[id]?.topic ?? 'разное') === t).map(([id, k]) => (
            <div className="li" key={id}>
              <span className="grow">{ctx.c.facts[id] ? fmt(ctx, ctx.c.facts[id].text) : id}</span>
              {k.kind !== 'fact' && <span className="tag">{k.kind === 'guess' ? 'догадка' : 'слух'}</span>}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
