import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { completeCheckpoint, mergeNotes, mergeSegments, participants, resolveJoint, syncClocks } from '../engine/checkpoint';
import { play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { giveItem } from '../engine/world';
import { knownNpc } from '../ui/format';
import { knownContacts } from '../ui/people';
import { content as c } from './index';

const P = ['A', 'B'] as const;
const fixture = JSON.parse(readFileSync(new URL('./fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const ctx = (s: GameState, pid: PlayerId = 'A') => ({ s, c, pid });
const qty = (s: GameState, type: string, kind?: string, id?: string) => Object.values(s.items)
  .filter(i => i.qty > 0 && i.type === type && (!kind || (i.at.kind === kind && 'id' in i.at && i.at.id === id)))
  .reduce((sum, i) => sum + i.qty, 0);
const acts = (s: GameState, pid: PlayerId) => availableActions(ctx(s, pid));
const car = (s: GameState) => Object.values(s.items).find(i => i.type === 'opel_corsa')!;

// Та же синтетическая стартовая позиция, что и в тесте участка 8: настоящая база КТ5 и состояние пары после КТ7.
function start8() {
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
function leg(base: GameState, pid: PlayerId, forced: Record<string, string> = {}, until?: string) {
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
function mergeCp(base: GameState, n: number, a: GameState, b: GameState) {
  const s = mergeSegments(c, base, { A: a, B: b });
  syncClocks(c, s, c.checkpoints.find(x => x.index === n)!.syncNotBefore); mergeNotes(c, s, n);
  return s;
}
function after8(direction: string) {
  const base = start8();
  const s = mergeCp(base, 8, leg(base, 'A'), leg(base, 'B'));
  return completeCheckpoint(c, s, { A: { c3_new_route8: direction }, B: { c3_new_route8: direction } }).state;
}
const DIRECTIONS = ['home', 'home_foot', 'east', 'stay'];

describe('участок 9: до КТ9', () => {
  it('вход ничего не исполняет над подписанной базой; скрытое утро ставится первым ходом одинаково', () => {
    const s = after8('home'), before = stateHash(s);
    expect(c.scenes.c9_start.onEnter).toBeUndefined(); expect(c.scenes.c9_start.location).toBeUndefined();
    expect(s.chars.A.scene).toBe('c9_start');
    acts(s, 'A'); acts(s, 'B');
    expect(stateHash(s)).toBe(before);
    const a = structuredClone(s), b = structuredClone(s);
    play(c, a, 'A', ['c9_begin_a']); play(c, b, 'B', ['c9_begin_b']);
    for (const x of [a, b]) {
      expect(x.npcs.ole.vars.c9_bitten).toBe(true); expect(x.npcs.ole.status).toBe('ok');
      expect(x.vars['w.c9_van_window']).toBe('boarded');
    }
  });

  for (const direction of DIRECTIONS) it(`исход КТ8 «${direction}»: обе линии доходят до КТ9 без вопросов и повторяются точно`, () => {
    const base = after8(direction);
    const a = leg(base, 'A'), b = leg(base, 'B');
    for (const x of [a, b]) for (const p of P) expect(x.chars[p].body.coreTemp).toBeGreaterThanOrEqual(36);
    expect(a.chars.A.location).toBe('hof_luedemann'); expect(b.chars.B.location).toBe('hof_luedemann');
    const s = mergeCp(base, 9, a, b);
    expect(s.chars.A.time).toBe(s.chars.B.time);
    expect(s.npcs.c7_nina?.location).toBe('hof_luedemann');
    expect(s.vars['w.c9_deniz_search']).toBe(true);
    // Сводка не пересказывает объяснения хозяйки.
    const notes = s.log.filter(l => l.kind === 'checkpoint').map(l => l.text).join(' ');
    expect(notes).not.toMatch(/девушк|колюч|ладон|сеновал/);
    const out = completeCheckpoint(c, s, { A: { c3_new_jens9: 'keep', c3_new_search9b: 'go' }, B: { c3_new_jens9: 'keep', c3_new_search9a: 'stay' } }).state;
    expect(out.checkpoint).toBe(9);
    for (const p of P) expect(out.chars[p].scene).toBe('c10_start');
    expect(out.vars['w.c9_jens']).toBe('kept'); expect(out.vars['w.c9_search_A']).toBe('stay'); expect(out.vars['w.c9_search_B']).toBe('go');
    if (direction === 'stay') expect(car(out).at).toEqual({ kind: 'place', id: 'hof_luedemann' });
    if (direction === 'home_foot') expect(car(out).at).toEqual({ kind: 'place', id: 'c7_farm_lane' });
  });

  it('обратная дорога со стоянки тратит бензин один раз, только линией A', () => {
    const base = after8('stay'), fuel = car(base).fuel!;
    const s = mergeCp(base, 9, leg(base, 'A'), leg(base, 'B'));
    expect(car(s).fuel).toBeCloseTo(fuel - 0.26, 2);
  });

  it('без бензина со стоянки и от кордона возвращаются пешком, машина остаётся на месте', () => {
    for (const direction of ['stay', 'east']) {
      const base = after8(direction), where = car(base).at; car(base).fuel = 0;
      const a = leg(base, 'A', direction === 'east' ? { c9_start: 'c9_begin_east_ask', c9_east_post: 'c9_east_girl' } : {});
      const b = leg(base, 'B');
      expect(car(a).at).toEqual(where); expect(a.chars.A.location).toBe('hof_luedemann'); expect(b.chars.B.location).toBe('hof_luedemann');
    }
  });

  it('на восточной дороге Нину можно встретить заранее; ворота не создают второго человека', () => {
    const base = after8('east');
    const a = leg(base, 'A', { c9_start: 'c9_begin_east_ask', c9_east_post: 'c9_east_girl', c9_east_nina: 'c9_east_nina_way' });
    expect(a.vars['A.c9_nina_road']).toBe(true);
    expect(Object.keys(a.npcs).filter(id => id === 'c7_nina')).toHaveLength(1);
    expect(knownNpc(a.npcs.c7_nina, 'A', a.vars)).toBe(true);
  });

  it('Нина: карточка-контакт сменяется человеком после личной встречи; ключ существует один раз', () => {
    const base = after8('home');
    const a = leg(base, 'A', {}, 'c9_gate2');
    expect(knownNpc(a.npcs.c7_nina, 'A', a.vars)).toBe(true);
    expect(knownContacts(ctx(a)).map(x => x.id)).not.toContain('c7_nina');
    const b = leg(base, 'B', { c9_b_nina: 'c9_b_nina_tea', c9_b_question: 'c9_b_q_words', c9_b_key: 'c9_b_key_take' });
    expect(qty(b, 'c9_van_key', 'char', 'B')).toBe(1); expect(qty(b, 'c9_van_key', 'npc', 'c7_nina')).toBe(0);
    const s = mergeCp(base, 9, leg(base, 'A'), b);
    expect(qty(s, 'c9_van_key')).toBe(1); expect(qty(s, 'c9_van_key', 'char', 'B')).toBe(1);
    expect(s.vars['w.c9_key_holder']).toBe('B');
  });

  it('Нина без доверия ключ не отдаёт, и он остаётся у неё', () => {
    const base = after8('home');
    const b = leg(base, 'B', { c9_gate: 'c9_gate_host', c9_b_nina: 'c9_b_nina_home', c9_b_question: 'c9_b_q_truth', c9_b_key: 'c9_b_key_take' });
    expect(b.vars['B.c9_key']).toBe('refused'); expect(qty(b, 'c9_van_key', 'npc', 'c7_nina')).toBe(1);
  });

  it('обед и ужин — настоящие порции: голод падает, вторая порция не появляется', () => {
    const base = after8('home');
    const b = leg(base, 'B', {}, 'c9_lunch'), hunger = b.chars.B.body.hunger;
    play(c, b, 'B', ['c9_lunch_eat']);
    expect(b.chars.B.body.hunger).toBeLessThan(hunger);
    const a = leg(base, 'A', { c9_lunch: 'c9_lunch_pack' });
    expect(qty(a, 'c3_meal', 'char', 'A')).toBeGreaterThanOrEqual(1);
  });

  it('выбор за партнёра: каждый вопрос видит только другой игрок, итог — его ответ', () => {
    const base = after8('home');
    const s = mergeCp(base, 9, leg(base, 'A'), leg(base, 'B'));
    expect(participants(c, s, c.joint.c3_new_search9a)).toEqual(['B']);
    expect(participants(c, s, c.joint.c3_new_search9b)).toEqual(['A']);
    const r = resolveJoint(c, structuredClone(s), 'c3_new_search9a', { B: 'go' });
    expect(r.kind).toBe('solo'); expect(r.applied).toEqual(['go']); expect(r.reason).toBe(c.joint.c3_new_search9a.soloReason);
    for (const [ja, jb, want] of [['end', 'end', 'dead'], ['end', 'keep', 'kept'], ['keep', 'end', 'kept'], ['keep', 'keep', 'kept']]) {
      const out = completeCheckpoint(c, structuredClone(s), { A: { c3_new_jens9: ja, c3_new_search9b: 'stay' }, B: { c3_new_jens9: jb, c3_new_search9a: 'go' } }).state;
      expect(out.vars['w.c9_jens']).toBe(want);
      expect(out.chars.A.time).toBe(out.chars.B.time);
      if (want === 'dead') expect(out.vars['w.c7_jens']).toBe('dead');
    }
  });

  it("Керем и Кёлер уходят по своим прежним планам, сцены это учитывают", () => {
    const base = after8('home');
    const a = leg(base, 'A');
    expect(a.npcs.kerem.location).toBe('b75_road');
    expect(a.npcs.c3_koehler.location).toBe('c3_neighbor');
  });
});
