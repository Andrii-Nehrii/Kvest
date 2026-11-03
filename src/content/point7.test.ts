import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions, enterScene } from '../engine/actions';
import { completeCheckpoint, mergeNotes, mergeSegments, optionsFor, resolveJoint, syncClocks } from '../engine/checkpoint';
import { play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { applyEffects } from '../engine/effects';
import { fuelNeeded } from '../engine/base';
import { stateHash } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { giveItem } from '../engine/world';
import { knownContacts } from '../ui/people';
import { content as c } from './index';

const P = ['A', 'B'] as const;
const fixture = JSON.parse(readFileSync(new URL('./fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const context = (s: GameState, pid: PlayerId = 'A') => ({ s, c, pid });
const actions = (s: GameState, pid: PlayerId) => availableActions(context(s, pid));
const qty = (s: GameState, type: string, kind: string, id: string) => Object.values(s.items)
  .filter(i => i.qty > 0 && i.type === type && i.at.kind === kind && 'id' in i.at && i.at.id === id).reduce((n, i) => n + i.qty, 0);

function leg(base: GameState, pid: PlayerId, forced: Record<string, string> = {}) {
  const s = structuredClone(base), records: ActionRecord[] = [];
  while (!segmentFinished(c, s, pid) && records.length < 100) {
    const scene = s.chars[pid].scene;
    const choices = actions(s, pid).filter(a => a.enabled && !a.universal && a.def.terminal);
    const pick = forced[scene] ?? choices[0]?.def.id;
    expect(pick, `${pid}: ${scene}`).toBeTruthy();
    expect(actions(s, pid).some(a => a.enabled && a.def.id === pick), `${pid}: ${pick}`).toBe(true);
    records.push({ scene, plan: [pick] });
    play(c, s, pid, [pick]);
  }
  expect(segmentFinished(c, s, pid)).toBe('checkpoint');
  expect(stateHash(replaySegment(c, base, pid, records))).toBe(stateHash(s));
  return s;
}
function merged(base: GameState, ends: Record<PlayerId, GameState>) {
  const s = mergeSegments(c, base, ends), n = base.checkpoint + 1;
  syncClocks(c, s, c.checkpoints.find(cp => cp.index === n)!.syncNotBefore);
  mergeNotes(c, s, n);
  return s;
}
let cp6: GameState | undefined;
function start(road = 'quiet', night = 'beside') {
  if (!cp6) {
    const base = structuredClone(fixture.legs.find(l => l.base.checkpoint === 5)!.base);
    Object.assign(base.vars, { 'w.c3_trip5': 'relieve', 'w.c3_f5': 'shield', 'w.c3_farm_gun_lost': true });
    base.npcs.pawel.location = 'hof_luedemann'; base.npcs.pawel.vars.c3_hand_rest = true;
    cp6 = merged(base, { A: leg(base, 'A'), B: leg(base, 'B') });
  }
  const s = completeCheckpoint(c, structuredClone(cp6), {
    A: { c3_l_road6: road, c3_new_night6: night }, B: { c3_l_road6: road, c3_new_night6: night },
  }).state;
  giveItem(context(s), 'crowbar', 1);
  giveItem(context(s, 'B'), 'bandages', 1);
  giveItem(context(s, 'B'), 'water_05', 1);
  return s;
}
const answers = (fate: string, route: string) => ({ c3_new_van7: fate, c3_new_depart7: route });

describe('новый участок 7', () => {
  it('все 12 порядков предыдущей точки: обе линии, точный повтор и все доступные общие исходы', { timeout: 90000 }, () => {
    for (const road of ['quiet', 'divert', 'call']) for (const night of ['beside', 'own_sleep', 'go_with', 'barn_only']) {
      const base = start(road, night);
      expect(base.chars.A.scene).toBe('c7_start');
      expect(base.vars['w.c7_new_story']).toBeUndefined();
      const s = merged(base, { A: leg(base, 'A'), B: leg(base, 'B') });
      for (const id of ['c3_new_van7', 'c3_new_depart7']) expect(optionsFor(c, s, c.joint[id], 'A').map(x => x.id))
        .toEqual(optionsFor(c, s, c.joint[id], 'B').map(x => x.id));
      for (const fate of optionsFor(c, s, c.joint.c3_new_van7, 'A')) for (const route of optionsFor(c, s, c.joint.c3_new_depart7, 'A')) {
        const fuel = Object.values(s.items).find(i => i.type === 'opel_corsa' && i.qty > 0)!.fuel!;
        const result = completeCheckpoint(c, structuredClone(s), { A: answers(fate.id, route.id), B: answers(fate.id, route.id) }).state;
        for (const pid of P) {
          expect(result.chars[pid].scene).toBe('c8_start');
          expect(result.chars[pid].location).toBe(route.id === 'stay' ? 'hof_luedemann' : 'c7_farm_lane');
          expect(result.chars[pid].body.consciousness).toBe('awake');
        }
        expect(result.chars.A.time).toBe(result.chars.B.time);
        const car = Object.values(result.items).find(i => i.type === 'opel_corsa' && i.qty > 0)!;
        expect(car.fuel).toBeCloseTo(fuel - (route.id === 'car' ? fuelNeeded(context(s), 'opel_corsa', 4) : 0));
        expect(car.at).toEqual({ kind: 'place', id: route.id === 'car' ? 'c7_farm_lane' : 'hof_luedemann' });
        if (fate.id === 'stop') {
          expect(result.vars['w.c7_jens']).toBe('dead');
          expect(qty(result, 'crowbar', 'char', 'A')).toBe(0);
          expect(qty(result, 'crowbar', 'npc', 'deniz')).toBe(1);
        }
      }
    }
  });

  it('разные ответы не становятся согласием на убийство или отправление', () => {
    const base = start(), s = merged(base, { A: leg(base, 'A'), B: leg(base, 'B') });
    for (const a of ['hold', 'quiet', 'stop']) for (const b of ['hold', 'quiet', 'stop']) if (a !== b) {
      const copy = structuredClone(s);
      expect(resolveJoint(c, copy, 'c3_new_van7', { A: a, B: b }).applied).toEqual(['hold']);
      expect(copy.vars['w.c7_jens']).toBe('contained');
      expect(qty(copy, 'crowbar', 'char', 'A')).toBe(1);
    }
    for (const a of ['car', 'walk', 'stay']) for (const b of ['car', 'walk', 'stay']) if (a !== b) {
      const copy = structuredClone(s);
      expect(resolveJoint(c, copy, 'c3_new_depart7', { A: a, B: b }).applied).toEqual(['stay']);
      expect(copy.chars.A.location).toBe('hof_luedemann'); expect(copy.chars.B.location).toBe('hof_luedemann');
    }
  });

  it('без предварительной подготовки свой инструмент всё ещё можно использовать, но общая работа займёт дольше', () => {
    const base = start(), s = merged(base, { A: leg(base, 'A', { c7_a_tools: 'c7_a_tools_no' }), B: leg(base, 'B') });
    expect(optionsFor(c, s, c.joint.c3_new_van7, 'A').map(x => x.id)).toContain('quiet');
    const t = s.chars.A.time;
    expect(resolveJoint(c, s, 'c3_new_van7', { A: 'quiet', B: 'quiet' }).applied).toEqual(['quiet']);
    expect(s.chars.A.time).toBe(t + 16); expect(s.chars.B.time).toBe(t + 16);
  });

  it('без припасов и машины остаются честные доступные действия; близкая помощь и общий транспорт не возникают', () => {
    const base = start();
    for (const i of Object.values(base.items)) if (['crowbar', 'multitool', 'car_keys', 'bandages', 'first_aid', 'nitrile_gloves', 'water_05', 'c3_meal', 'opel_corsa'].includes(i.type)) {
      i.qty = 0; i.at = { kind: 'gone' };
    }
    base.npcs.deniz.location = 'deniz_workshop';
    const b = structuredClone(base); play(c, b, 'B', ['c7_begin_pawel']);
    expect(actions(b, 'B').find(a => a.def.id === 'c7_b_dressing')!.enabled).toBe(false);
    expect(actions(b, 'B').find(a => a.def.id === 'c7_b_wash')!.enabled).toBe(false);
    const s = merged(base, { A: leg(base, 'A'), B: leg(base, 'B') });
    expect(optionsFor(c, s, c.joint.c3_new_van7, 'A').map(x => x.id)).toEqual(['hold']);
    expect(optionsFor(c, s, c.joint.c3_new_depart7, 'A').map(x => x.id)).toEqual(['walk', 'stay']);
  });

  it('личный контакт B не раскрывается A без передачи сведений и не меняет мир при просмотре', () => {
    const base = start();
    const a = leg(base, 'A'), b = leg(base, 'B', { c7_b_holder: 'c7_b_note_private', c7_b_last_wish: 'c7_b_wish_exact' });
    const listed = (s: GameState, pid: PlayerId) => knownContacts(context(s, pid)).map(x => x.id);
    expect(listed(base, 'B')).not.toContain('c7_nina');
    expect(listed(b, 'B')).toContain('c7_nina'); expect(listed(a, 'A')).not.toContain('c7_nina');
    const s = merged(base, { A: a, B: b });
    const hash = stateHash(s); expect(listed(s, 'A')).not.toContain('c7_nina'); expect(stateHash(s)).toBe(hash);
    const shared = structuredClone(s); shared.vars['B.c7_share_nina'] = true; mergeNotes(c, shared, 7);
    expect(listed(shared, 'A')).toContain('c7_nina');
    expect(shared.npcs.c7_nina).toBeUndefined();
  });

  it('обоим доступен свой завтрак, даже не-хранителю базы; вода не выдаётся снова, вторая порция завтрака не возникает', () => {
    for (const pid of P) {
      const s = start(), ctx = context(s, pid);
      const water = qty(s, 'water_05', 'char', pid);
      play(c, s, pid, ['c7_begin_exit']);
      expect(qty(s, 'water_05', 'char', pid)).toBe(water);
      applyEffects(ctx, [{ restUntil: at(13, 6, 40) }]);
      s.chars[pid].body.hunger = 60;
      enterScene(ctx, 'c7_breakfast');
      applyEffects(ctx, [{ camp: { kind: 'prepare', quiet: true } }]);
      const stock = JSON.stringify(Object.values(s.items).filter(i => i.at.kind === 'place' && i.at.id === 'c3_farm_stock'));
      expect(actions(s, pid).find(a => a.def.id === 'c7_breakfast_eat')!.enabled).toBe(true);
      expect(actions(s, pid).some(a => a.def.id === 'u:table_meal')).toBe(false);
      applyEffects(ctx, [{ camp: { kind: 'meal', mode: 'eat', communal: true } }]);
      expect(s.chars[pid].body.hunger).toBe(40);
      const after = stateHash(s);
      applyEffects(ctx, [{ camp: { kind: 'meal', mode: 'pack', communal: true } }]);
      expect(stateHash(s)).toBe(after);
      expect(JSON.stringify(Object.values(s.items).filter(i => i.at.kind === 'place' && i.at.id === 'c3_farm_stock'))).toBe(stock);
    }
  });

  it('вода для подарка из колодца требует своей тары: источник даёт ровно пол-литра, бутылка физически у Павла', () => {
    const s = start(), ctx = context(s, 'B');
    play(c, s, 'B', ['c7_begin_pawel']); enterScene(ctx, 'c7_b_water');
    giveItem(ctx, 'empty_bottle_05', 1);
    s.chars.B.rules.drinkWhenThirsty = false; s.chars.B.rules.eatWhenHungry = false;
    const water = () => Object.values(s.items).reduce((n, i) => n + i.qty * ({ water_l: 1, water_05: 0.5, water_15: 1.5 }[i.type] ?? 0), 0);
    const before = water(), t = s.chars.B.time, own = qty(s, 'water_05', 'char', 'B'), npc = qty(s, 'water_05', 'npc', 'pawel');
    play(c, s, 'B', ['c7_b_gift_well']);
    expect(water()).toBeCloseTo(before + 0.5);
    expect(s.chars.B.time).toBe(t + 10);
    expect(qty(s, 'water_05', 'char', 'B')).toBe(own);
    expect(qty(s, 'water_05', 'npc', 'pawel')).toBe(npc + 1);
    expect(qty(s, 'empty_bottle_05', 'char', 'B')).toBe(0);
  });
});
