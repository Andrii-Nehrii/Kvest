// Общая синтетическая позиция для тестов дуги 9–11: база КТ5 из эталона и состояние пары после КТ7.
import { readFileSync } from 'node:fs';
import { expect } from 'vitest';
import { availableActions } from '../engine/actions';
import { completeCheckpoint, mergeNotes, mergeSegments, syncClocks } from '../engine/checkpoint';
import { play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { giveItem } from '../engine/world';
import { content as c } from '../content/index';

export const P = ['A', 'B'] as const;
const fixture = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
export const ctx = (s: GameState, pid: PlayerId = 'A') => ({ s, c, pid });
export const qty = (s: GameState, type: string, kind?: string, id?: string) => Object.values(s.items)
  .filter(i => i.qty > 0 && i.type === type && (!kind || (i.at.kind === kind && 'id' in i.at && i.at.id === id)))
  .reduce((sum, i) => sum + i.qty, 0);
export const acts = (s: GameState, pid: PlayerId) => availableActions(ctx(s, pid));
export const car = (s: GameState) => Object.values(s.items).find(i => i.type === 'opel_corsa')!;

// Та же синтетическая стартовая позиция, что и в тесте участка 8: настоящая база КТ5 и состояние пары после КТ7.
export function start8() {
  const s = structuredClone(fixture.legs.find(x => x.base.checkpoint === 5)!.base);
  s.checkpoint = 7;
  Object.assign(s.vars, { 'w.together': true, 'w.c7_departure': 'car', 'w.c7_jens': 'quieted', 'w.c7_new_story': true, 'w.farm_welcome': true, 'w.c7_nina_shared': true });
  for (const p of P) {
    s.chars[p].time = at(13, 8, 17); s.chars[p].location = 'c7_farm_lane'; s.chars[p].scene = 'c8_start';
    Object.assign(s.chars[p].body, { hunger: 20, thirst: 30, fatigue: 5, sleepDebt: p === 'B' ? 6 : 1, coreTemp: 36.9 });
  }
  for (const [id, n] of Object.entries(s.npcs)) n.agendaDone = c.npcs[id].agenda.filter(a => (a.at ?? 0) < at(13, 8))
    .flatMap(a => a.scope === 'world' ? [`${a.id}@A`, `${a.id}@B`] : [a.id]);
  // Как у настоящей пары: суточный паёк хутора записан в 06:00, завтрак пропущен.
  for (const p of P) Object.assign(s.vars, { [`${p}.ration.c3_farm`]: 3, [`${p}.ration.c3_farm.food`]: 1, [`${p}.ration.c3_farm.water`]: 1,
    [`${p}.camp.manualMeals`]: true, [`${p}.camp.meal.c3_farm.3.7`]: true });
  for (const e of c.events) for (const p of P) s.firedEvents[e.scope === 'world' ? e.id + '@' + p : e.id] = e.at;
  for (const id of ['henrike', 'ole', 'deniz', 'kerem', 'c3_koehler']) { s.npcs[id].location = 'hof_luedemann'; s.npcs[id].alive = true; s.npcs[id].status = 'ok'; }
  s.npcs.pawel.location = 'c7_farm_lane';
  const corsa = car(s); corsa.at = { kind: 'place', id: 'c7_farm_lane' }; corsa.fuel = 12.55;
  if (!qty(s, 'car_keys', 'char', 'A')) giveItem(ctx(s), 'car_keys', 1);
  giveItem(ctx(s), 'water_05', 3);
  giveItem(ctx(s, 'B'), 'bandages', 1);
  giveItem(ctx(s), 'c7_jens_note', 1, {}, { kind: 'npc', id: 'pawel' });
  return s;
}
export function leg(base: GameState, pid: PlayerId, forced: Record<string, string> = {}, until?: string) {
  const s = structuredClone(base), records: ActionRecord[] = [];
  while (!segmentFinished(c, s, pid) && s.chars[pid].scene !== until && records.length < 120) {
    const scene = s.chars[pid].scene, choices = acts(s, pid).filter(a => a.enabled && !a.universal && a.def.terminal);
    const action = forced[scene] ?? choices[0]?.def.id;
    expect(action, scene).toBeTruthy();
    expect(acts(s, pid).some(a => a.enabled && a.def.id === action), scene + ': ' + action).toBe(true);
    records.push({ scene, plan: [action] }); play(c, s, pid, [action]);
  }
  expect(stateHash(replaySegment(c, base, pid, records))).toBe(stateHash(s));
  if (!until) expect(segmentFinished(c, s, pid)).toBe('checkpoint');
  return s;
}
export function mergeCp(base: GameState, n: number, a: GameState, b: GameState) {
  const s = mergeSegments(c, base, { A: a, B: b });
  syncClocks(c, s, c.checkpoints.find(x => x.index === n)!.syncNotBefore); mergeNotes(c, s, n);
  return s;
}
export function after8(direction: string) {
  const base = start8();
  const s = mergeCp(base, 8, leg(base, 'A'), leg(base, 'B'));
  return completeCheckpoint(c, s, { A: { c3_new_route8: direction }, B: { c3_new_route8: direction } }).state;
}
