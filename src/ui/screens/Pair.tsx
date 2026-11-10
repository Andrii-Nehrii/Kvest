// «Ещё»: схема мест и общий счёт пары.
import { useMemo } from 'react';
import type { Ctx } from '../../engine/world';
import { fmt } from '../../engine/world';
import { other, type GameState, type PlayerId } from '../../engine/types';
import { START_TIME } from '../../app/session';
import { knownNpc } from '../format';
import { Card } from '../kit';
import { layoutMap, mapArea, MAP_EDGES, visitedAreas } from '../map';

const W = 340, H = 300;

/** base — мир последней точки: где партнёр сейчас, без обмена не узнать. */
export function PairMap({ ctx, base }: { ctx: Ctx; base: GameState }) {
  const partner = other(ctx.pid);
  const mine = useMemo(() => visitedAreas(ctx.c, ctx.s, ctx.pid), [ctx.s, ctx.pid]);
  const theirs = useMemo(() => visitedAreas(ctx.c, base, partner), [base, partner]);
  const nodes = useMemo(() => layoutMap(mine, theirs, W, H), [mine, theirs]);
  if (nodes.length < 2) return null;
  const at = new Map(nodes.map((n) => [n.id, n]));
  const here = mapArea(ctx.s.chars[ctx.pid].location);
  const there = mapArea(base.chars[partner].location);
  return (
    <Card title="Где вы были">
      <svg className="pair-map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Схема мест">
        {MAP_EDGES.map(([a, b]) => {
          const p = at.get(a), q = at.get(b);
          return p && q ? <line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} /> : null;
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            {n.id === there && <circle className="ring them" cx={n.x} cy={n.y} r={n.id === here ? 9.5 : 6.5} />}
            {n.id === here && <circle className="ring me" cx={n.x} cy={n.y} r={6.5} />}
            <circle className={`pt ${n.mine ? 'mine' : 'theirs'}`} cx={n.x} cy={n.y} r={3} />
            <text className={n.mine ? '' : 'theirs'} x={n.right ? n.x + 9 : n.x - 9} y={n.ly + 3.5} textAnchor={n.right ? 'start' : 'end'}>{n.name}</text>
          </g>
        ))}
      </svg>
      <div className="small muted map-legend">
        <span><i className="lg me" /> ты сейчас</span>
        <span><i className="lg them" /> {fmt(ctx, '{partner}')} на прошлой точке</span>
        <span><i className="lg dot" /> {fmt(ctx, 'где {pm:был|была} только {partner}')}</span>
      </div>
    </Card>
  );
}

interface Tally { total: number; same: number; mine: number; theirs: number; mixed: number }

/** Совместные решения из истории мира: совпали, чьё вышло, когда разошлись. */
export function tallyJoint(s: GameState, me: PlayerId): Tally {
  const t: Tally = { total: 0, same: 0, mine: 0, theirs: 0, mixed: 0 };
  for (const h of s.history) {
    if (h.kind !== 'joint') continue;
    const a = String(h.data?.[me] ?? ''), b = String(h.data?.[other(me)] ?? '');
    if (!a || !b) continue;
    t.total++;
    if (a === b) { t.same++; continue; }
    const applied = h.summary.slice(h.summary.indexOf(':') + 1).split('+').map((x) => x.trim());
    if (applied.length === 1 && applied[0] === a) t.mine++;
    else if (applied.length === 1 && applied[0] === b) t.theirs++;
    else t.mixed++;
  }
  return t;
}

export function PairStats({ ctx }: { ctx: Ctx }) {
  const s = ctx.s;
  const t = tallyJoint(s, ctx.pid);
  const days = Math.floor((s.chars[ctx.pid].time - START_TIME) / 1440) + 1;
  const people = Object.values(s.npcs).filter((n) => knownNpc(n, 'A', s.vars) || knownNpc(n, 'B', s.vars));
  const lost = people.filter((n) => n.status === 'dead' || n.status === 'turned').length;
  const row = (k: string, v: string | number) => <div className="li kv"><span>{k}</span><span>{v}</span></div>;
  return (
    <Card title="Вы вдвоём">
      {row('День', days)}
      {row('Точек пройдено', s.checkpoint)}
      {row('Знакомых людей', lost ? `${people.length}, потеряно ${lost}` : people.length)}
      {row('Решений вместе', t.total)}
      {t.total > 0 && row('Решили одинаково', t.same)}
      {t.total - t.same > 0 && row('Разошлись', t.total - t.same)}
      {t.mine + t.theirs > 0 && row('Вышло по-твоему', t.mine)}
      {t.mine + t.theirs > 0 && row(fmt(ctx, 'Вышло, как {pm:хотел|хотела} {partner}'), t.theirs)}
      {t.mixed > 0 && row('Вышло третье', t.mixed)}
    </Card>
  );
}
