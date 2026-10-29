// Сюжетный линтер и «случайный игрок»: ссылки целы, сцены достижимы, ничего не падает, всё воспроизводится.
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash, unit } from '../engine/rng';
import type { Cond, Effect } from '../engine/types';
import { START_TIME } from '../app/session';
import { content as c } from './index';

const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const setup = { pairId: 'p', seed: 's', startTime: START_TIME, players: { A: { name: forms('Игорь') }, B: { name: forms('Лена') } } };

function walkEffects(effects: Effect[] | undefined, fn: (e: Effect) => void) {
  for (const e of effects ?? []) { fn(e); if ('if' in e) { walkEffects(e.then, fn); walkEffects(e.else, fn); } }
}
function walkCond(cond: Cond | undefined, fn: (c: Cond) => void) {
  if (!cond) return;
  fn(cond);
  if ('all' in cond) cond.all.forEach((x) => walkCond(x, fn));
  if ('any' in cond) cond.any.forEach((x) => walkCond(x, fn));
  if ('not' in cond) walkCond(cond.not, fn);
}

describe('сюжетный линтер', () => {
  it('все ссылки на сцены, предметы, NPC, факты и места существуют', () => {
    const errors: string[] = [];
    const checkEffect = (where: string) => (e: Effect) => {
      const item = 'give' in e ? e.give : 'take' in e ? e.take : 'pickup' in e ? e.pickup : 'drop' in e ? e.drop : 'place' in e ? e.place : undefined;
      if (item && !c.items[item]) errors.push(`${where}: нет предмета ${item}`);
      if ('learn' in e && !c.facts[e.learn]) errors.push(`${where}: нет факта ${e.learn}`);
      if ('npc' in e && !c.npcs[e.npc]) errors.push(`${where}: нет NPC ${e.npc}`);
      if ('move' in e && !c.locations[e.move]) errors.push(`${where}: нет места ${e.move}`);
      if ('message' in e && !c.messages.some((m) => m.id === e.message)) errors.push(`${where}: нет сообщения ${e.message}`);
    };
    const checkCond = (where: string) => (x: Cond) => {
      if ('knows' in x && !c.facts[x.knows]) errors.push(`${where}: условие на неизвестный факт ${x.knows}`);
      if ('has' in x && !c.items[x.has]) errors.push(`${where}: условие на неизвестный предмет ${x.has}`);
      if ('npc' in x && !c.npcs[x.npc]) errors.push(`${where}: условие на неизвестного NPC ${x.npc}`);
      if ('visited' in x && !c.scenes[x.visited]) errors.push(`${where}: условие на неизвестную сцену ${x.visited}`);
      if ('partnerKnows' in x && !c.facts[x.partnerKnows]) errors.push(`${where}: условие на неизвестный факт ${x.partnerKnows}`);
      if ('at' in x && !('npc' in x) && !('stocked' in x) && !c.locations[x.at]) errors.push(`${where}: условие на неизвестное место ${x.at}`);
      if ('partnerAt' in x && !c.locations[x.partnerAt]) errors.push(`${where}: условие на неизвестное место ${x.partnerAt}`);
    };
    for (const s of Object.values(c.scenes)) {
      if (s.location && !c.locations[s.location]) errors.push(`${s.id}: нет места ${s.location}`);
      walkEffects(s.onEnter, checkEffect(s.id));
      for (const t of s.text) walkCond(t.when, checkCond(s.id));
      for (const a of s.actions) {
        const w = `${s.id}/${a.id}`;
        if (a.goto && !c.scenes[a.goto]) errors.push(`${w}: нет сцены ${a.goto}`);
        walkEffects(a.effects, checkEffect(w));
        walkCond(a.when, checkCond(w)); walkCond(a.enabled, checkCond(w));
        for (const o of a.outcomes ?? []) {
          if (o.goto && !c.scenes[o.goto]) errors.push(`${w}/${o.id}: нет сцены ${o.goto}`);
          walkEffects(o.effects, checkEffect(`${w}/${o.id}`));
          walkCond(o.when, checkCond(`${w}/${o.id}`));
        }
      }
    }
    for (const e of c.events) {
      walkEffects(e.effects, checkEffect(e.id));
      if (e.scope === 'world') walkEffects(e.effects, (x) => { if (!('set' in x)) errors.push(`${e.id}: событие мира может только «set»`); });
      for (const n of e.news ?? []) if (n.learn && !c.facts[n.learn]) errors.push(`${e.id}: нет факта ${n.learn}`);
    }
    for (const n of Object.values(c.npcs)) for (const a of n.agenda) { walkEffects(a.effects, checkEffect(`${n.id}/${a.id}`)); walkCond(a.when, checkCond(`${n.id}/${a.id}`)); }
    for (const e of c.events) walkCond(e.when, checkCond(e.id));
    for (const d of Object.values(c.joint)) {
      for (const o of d.options) { walkEffects(o.effects, checkEffect(`${d.id}/${o.id}`)); walkCond(o.when, checkCond(`${d.id}/${o.id}`)); walkCond(o.feasible, checkCond(`${d.id}/${o.id}`)); }
      for (const a of d.arbiters) { walkCond(a.when, checkCond(`${d.id}/${a.id}`)); if (!d.options.some((o) => o.id === a.winner)) errors.push(`${d.id}/${a.id}: нет варианта ${a.winner}`); }
      for (const x of d.compromises ?? []) if (!d.options.some((o) => o.id === x.result)) errors.push(`${d.id}: компромисс ведёт к неизвестному варианту ${x.result}`);
      for (const npc of d.rememberedBy ?? []) if (!c.npcs[npc]) errors.push(`${d.id}: нет NPC ${npc}`);
    }
    for (const cp of c.checkpoints) {
      for (const id of cp.joint) if (!c.joint[id]) errors.push(`КТ ${cp.index}: нет решения ${id}`);
      for (const n of cp.onMerge ?? []) { walkEffects(n.effects, checkEffect(`КТ ${cp.index}/${n.id}`)); walkCond(n.when, checkCond(`КТ ${cp.index}/${n.id}`)); }
    }
    for (const it of c.initialPlaceItems ?? []) if (!c.items[it.type]) errors.push(`старт: нет предмета ${it.type}`);
    for (const cp of c.checkpoints) for (const p of ['A', 'B'] as const) for (const r of cp.next[p]) if (!c.scenes[r.scene]) errors.push(`КТ ${cp.index}: нет сцены ${r.scene}`);
    expect(errors).toEqual([]);
  });

  it('случайный игрок: 40 прохождений без ошибок, каждое воспроизводится бит в бит', () => {
    for (let run = 0; run < 40; run++) {
      const base = newGame(c, { ...setup, seed: `walk-${run}` });
      for (const pid of ['A', 'B'] as const) {
        const s = structuredClone(base);
        const recs: ActionRecord[] = [];
        for (let step = 0; step < 30 && !segmentFinished(c, s, pid); step++) {
          const opts = availableActions({ s, c, pid }).filter((a) => a.enabled && !a.def.id.startsWith('u:rule'));
          if (!opts.length) break;
          const pick = opts[Math.floor(unit(`${run}:${pid}:${step}`) * opts.length)];
          recs.push({ scene: s.chars[pid].scene, plan: [pick.def.id] });
          play(c, s, pid, [pick.def.id]);
        }
        expect(stateHash(replaySegment(c, base, pid, recs))).toBe(stateHash(s));
      }
    }
  });
});
