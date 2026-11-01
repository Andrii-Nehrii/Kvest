// «Где пара ещё может оказаться»: берёт НАСТОЯЩИЕ сохранения пары (ветка saves), повторяет их сыгранные журналы,
// а дальше много раз доигрывает случайно (случайные решения на точках) до начала нужного участка и считает,
// в каких местах и в каком составе игроки могут его начать. Писать новую главу — только для этих мест.
//
//   git fetch origin saves:refs/remotes/origin/saves
//   mkdir -p transcripts/pair && git show origin/saves:pairs/Uwz9uRin2OZVCugy/save-A.json > transcripts/pair/save-A.json \
//     && git show origin/saves:pairs/Uwz9uRin2OZVCugy/save-B.json > transcripts/pair/save-B.json
//   KVEST_PAIR=transcripts/pair npx vitest run src/content/pairpaths.test.ts     → transcripts/pair-paths.txt
// Переменные: KVEST_AT — начало какого участка считать (по умолчанию первый участок новой главы), KVEST_RUNS — прогонов (300).
// Сохранения игроков не коммитить (transcripts/ в .gitignore).
import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, syncClocks } from '../engine/checkpoint';
import { segmentFinished } from '../engine/game';
import { unit } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import type { LocalSave } from '../app/session';
import { content as c } from './index';
import { fromSaves, playSegment } from './playtest';

const DIR = process.env.KVEST_PAIR;
const OLD = ['ch1', 'ch2'];
const firstNew = Math.max(...Object.values(c.scenes).filter((s) => OLD.includes(s.chapter) && s.checkpoint !== undefined).map((s) => s.checkpoint!)) + 1;
const AT = Number(process.env.KVEST_AT ?? firstNew);
const RUNS = Number(process.env.KVEST_RUNS ?? 300);

const load = (pid: PlayerId): LocalSave => {
  const raw = JSON.parse(readFileSync(`${DIR}/save-${pid}.json`, 'utf8'));
  return (raw.save ?? raw) as LocalSave;
};

function checkpoint(base: GameState, ends: Record<PlayerId, GameState>, tag: string): GameState {
  const merged = mergeSegments(c, base, ends);
  const cp = c.checkpoints.find((x) => x.index === base.checkpoint + 1)!;
  syncClocks(c, merged, cp.syncNotBefore);
  deliverMessages(c, merged);
  mergeNotes(c, merged, cp.index);
  const answers: Partial<Record<PlayerId, Record<string, string>>> = {};
  for (const id of cp.joint) for (const p of participants(c, merged, c.joint[id])) {
    const opts = optionsFor(c, merged, c.joint[id], p);
    (answers[p] ??= {})[id] = opts[Math.floor(unit(`${tag}:${id}:${p}`) * opts.length)].id;
  }
  return completeCheckpoint(c, merged, answers).state;
}

describe.runIf(!!DIR)('где пара ещё может оказаться', () => {
  it(`начало участка ${AT}: места и состав`, { timeout: 1800000 }, () => {
    const saves = { A: load('A'), B: load('B') };
    // Общая точка — более поздняя из баз; у отставшего на ней ещё нет своих записей.
    const { base: base0, records, played } = fromSaves(saves);
    for (const p of ['A', 'B'] as const) expect(played[p].applied, `${p}: журнал из облака не повторился`).toBe(records[p].length);

    const tally = new Map<string, number>();
    const places = new Map<string, number>();
    let lost = 0;
    for (let run = 0; run < RUNS; run++) {
      const tag = `paths:${run}`;
      let base = structuredClone(base0);
      // Текущий участок: сыгранное — как в облаке, дальше — случайно.
      const ends = {} as Record<PlayerId, GameState>;
      for (const p of ['A', 'B'] as const) {
        const s = structuredClone(played[p].state);
        if (!segmentFinished(c, s, p)) playSegment(s, p, base.checkpoint + 1, `${tag}:now:${p}`, 'curious', null);
        ends[p] = s;
      }
      base = checkpoint(base, ends, `${tag}:cp${base.checkpoint + 1}`);
      while (!base.ended && base.checkpoint + 1 < AT) {
        const e = {} as Record<PlayerId, GameState>;
        for (const p of ['A', 'B'] as const) { const s = structuredClone(base); playSegment(s, p, base.checkpoint + 1, `${tag}:${base.checkpoint + 1}:${p}`, 'curious', null); e[p] = s; }
        base = checkpoint(base, e, `${tag}:cp${base.checkpoint + 1}`);
      }
      if (base.ended) { lost++; continue; }
      const who = (p: PlayerId) => `${base.chars[p].location}${base.chars[p].body.consciousness === 'awake' || base.chars[p].body.consciousness === 'asleep' ? '' : `(${base.chars[p].body.consciousness})`}`;
      const key = `A: ${who('A')} | B: ${who('B')} | ${base.vars['w.together'] ? 'вместе' : 'порознь'}`;
      tally.set(key, (tally.get(key) ?? 0) + 1);
      for (const l of new Set([base.chars.A.location, base.chars.B.location])) places.set(l, (places.get(l) ?? 0) + 1);
    }
    const pctOf = (n: number) => `${Math.round((100 * n) / RUNS)} %`;
    const out = [
      `Где пара может начать участок ${AT} (из настоящих сохранений: КТ ${base0.checkpoint} пройдена, записей A ${records.A.length}, B ${records.B.length}; ${RUNS} случайных доигрываний)`,
      '', 'Места (хотя бы один игрок там):', ...[...places].sort((a, b) => b[1] - a[1]).map(([l, n]) => `  ${pctOf(n).padStart(5)}  ${l} — ${c.locations[l]?.name ?? ''}`),
      '', 'Расклады:', ...[...tally].sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${pctOf(n).padStart(5)}  ${k}`),
      '', `Игра окончилась (оба выбыли): ${pctOf(lost)}`,
      '', 'Писать новую главу для мест из верхней части списка; места, которых нет в списке, — недостижимы для этой пары.',
    ];
    writeFileSync('transcripts/pair-paths.txt', out.join('\n'));
    console.log(out.join('\n'));
  });
});
