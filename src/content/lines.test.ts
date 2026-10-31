// Главные линии главы 1, пройденные «как игрок»: утро A и B, КТ 1, оба варианта встречи, КТ 2.
// Если правка сюжета ломает эти прохождения, тест покажет, на каком шаге и какие действия были доступны.
import { describe, expect, it } from 'vitest';
import { availableActions, currentScene } from '../engine/actions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, syncClocks } from '../engine/checkpoint';
import { newGame, play } from '../engine/game';
import { clock } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { START_TIME } from '../app/session';
import { content as c } from './index';

const players = {
  A: { name: { nom: 'Андрей', gen: 'Андрея', dat: 'Андрею', acc: 'Андрея', ins: 'Андреем', pre: 'Андрее' } },
  B: { name: { nom: 'Аня', gen: 'Ани', dat: 'Ане', acc: 'Аню', ins: 'Аней', pre: 'Ане' } },
};

function run(s: GameState, pid: PlayerId, plans: string[][]) {
  for (const plan of plans) {
    const ctx = { s, c, pid };
    const avail = availableActions(ctx);
    const ok = plan.every((id) => avail.some((a) => a.def.id === id));
    if (!ok) throw new Error(`${pid} ${clock(s.chars[pid].time)} ${currentScene(ctx).id}: нет ${plan}; есть ${avail.filter((a) => !a.universal).map((a) => a.def.id)}`);
    play(c, s, pid, plan);
  }
}

function checkpoint(base: GameState, A: GameState, B: GameState, answers: Record<PlayerId, Record<string, string>>) {
  const merged = mergeSegments(c, base, { A, B });
  const cp = c.checkpoints.find((x) => x.index === base.checkpoint + 1)!;
  syncClocks(c, merged, cp.syncNotBefore);
  deliverMessages(c, merged);
  mergeNotes(c, merged, cp.index);
  return completeCheckpoint(c, merged, answers);
}

const A1 = [['dress', 'warm', 'pack', 'docs', 'window'], ['alert', 'kitchen'], ['door'], ['ask'], ['open'], ['ask_more', 'promise'], ['look'], ['examine'], ['carry'],
  ['to_car'], ['window', 'go'], ['guard'], ['tent'], ['ask', 'tell'], ['comfort'], ['take_home'], ['tea', 'food'], ['radio'], ['leave'], ['yard'], ['car'],
  ['fuel', 'glovebox', 'charge'], ['to_deniz'], ['news', 'petrol'], ['help'], ['farm', 'buy'], ['hamburg'], ['shelter'], ['refuel'], ['stay'], ['stay'], ['cp1_call']];
const B1 = [['dress', 'warm', 'docs', 'pack'], ['news', 'alert'], ['kitchen'], ['talk', 'fridge', 'insulin_more', 'card'], ['breakfast'], ['peephole'], ['ask'], ['open'],
  ['coffee', 'insulin'], ['back'], ['tell_merle', 'chain'], ['out'], ['nowak'], ['ask', 'pump'], ['help'], ['merle'], ['self'], ['back'], ['yard'], ['check', 'pump'], ['home'],
  ['street'], ['pharmacy'], ['queue'], ['insulin', 'ask', 'cooler'], ['out'], ['kiosk'], ['headlamp', 'map', 'talk', 'batteries'], ['back'], ['home'], ['home'], ['kitchen'],
  ['give_insulin', 'cooler'], ['hall'], ['okafor_open'], ['listen', 'stay', 'merle'], ['back'], ['room'], ['wait_hour'], ['wait_hour'], ['cp1_call']];

function morning(seed: string) {
  const base = newGame(c, { pairId: 'p', seed, startTime: START_TIME, players });
  const a = structuredClone(base);
  const b = structuredClone(base);
  run(a, 'A', A1);
  run(b, 'B', B1);
  return { base, a, b };
}
const lastNotes = (s: GameState, pid: PlayerId) => s.log.filter((e) => e.pid === pid && e.kind === 'checkpoint').map((e) => e.text).join('\n');

describe('главные линии главы 1', () => {
  it('утро обоих доходит до КТ 1, они дозваниваются; B едет к A на велосипеде, встреча в Buchholz', () => {
    const { base, a, b } = morning('line-1');
    expect(a.chars.A.scene).toBe('a_cp1');
    expect(b.chars.B.scene).toBe('b_cp1');
    const kt1 = checkpoint(base, a, b, { A: { meet: 'b_to_a' }, B: { meet: 'b_to_a' } });
    expect(kt1.joint[0].applied).toEqual(['b_to_a']);
    expect(lastNotes(kt1.state, 'A')).toMatch(/в трубке голос Ани/);
    const a2 = structuredClone(kt1.state);
    const b2 = structuredClone(kt1.state);
    run(a2, 'A', [['back_deniz_workshop'], ['car'], ['to_farm'], ['deniz', 'honest'], ['henrike'], ['offer_work', 'offer_fuel', 'tell_news', 'partner'], ['ask'], ['leave'], ['car'], ['to_home'],
      ['back'], ['up'], ['water'], ['wait_hour'], ['wait_hour'], ['wait_hour'], ['cp2_wait']]);
    run(b2, 'B', [['go'], ['helmet', 'merle_bye', 'okafor'], ['ride'], ['on'], ['shop'], ['on'], ['help'], ['check'], ['pass'], ['on'], ['splint'], ['on'], ['detour'], ['cross'],
      ['south'], ['ride'], ['ride'], ['arrive'], ['door']]);
    expect(a2.vars['w.henrike_yes']).toBe(true);
    expect(b2.vars['B.bike_lights']).toBe(true);
    expect(b2.vars['B.courier_done']).toBe('splint');
    const kt2 = checkpoint(kt1.state, a2, b2, { A: { shelter: 'farm' }, B: { shelter: 'farm' } });
    expect(lastNotes(kt2.state, 'A')).toMatch(/Она дошла/);
    expect(lastNotes(kt2.state, 'B')).toMatch(/Шаги за дверью/);
    expect(kt2.state.vars['w.shelter']).toBe('farm');
    expect(kt2.state.chars.A.scene).toBe('c2_aflat');
  });

  it('A едет за B через тоннель и город, B ждёт дома (Новаки, Окафор, Свенья); встреча в Barmbek', () => {
    const { base, a, b } = morning('line-2');
    const kt1 = checkpoint(base, a, b, { A: { meet: 'a_to_b' }, B: { meet: 'a_to_b' } });
    expect(kt1.joint[0].applied).toEqual(['a_to_b']);
    const a2 = structuredClone(kt1.state);
    const b2 = structuredClone(kt1.state);
    run(a2, 'A', [['car'], ['radio', 'north_b'], ['polo'], ['on'], ['kerem'], ['talk', 'message'], ['back'], ['tunnel'], ['crawl'], ['j_take'], ['crawl'], ['j_bandage', 'tunnel'],
      ['help'], ['out'], ['crash_help'], ['jannik'], ['on'], ['look', 'sneak'], ['ring']]);
    run(b2, 'B', [['back_b_flat'], ['out'], ['nowak'], ['tim'], ['back'], ['home'], ['room'], ['wait_hour'], ['farewell'], ['persuade'], ['goodbye'], ['home'], ['home'], ['kitchen'],
      ['radio', 'water', 'cook'], ['hall'], ['barricade'], ['out'], ['okafor_flat'], ['kit'], ['back'], ['room'], ['wait_hour'], ['kitchen'], ['merle_evening'], ['room'], ['look_night'],
      ['wait_hour'], ['wait_hour'], ['hall'], ['svenja'], ['okafor'], ['room'], ['cp2_wait']]);
    expect(b2.npcs.svenja.location).toBe('b_okafor');
    expect(Object.values(a2.items).some((i) => i.type === 'crowbar' && i.at.kind === 'char')).toBe(true);
    expect(a2.vars['A.approached']).toBeTruthy();
    const kt2 = checkpoint(kt1.state, a2, b2, { A: { shelter: 'b_flat' }, B: { shelter: 'farm' } });
    expect(lastNotes(kt2.state, 'A')).toMatch(/Щелчок домофона/);
    expect(lastNotes(kt2.state, 'B')).toMatch(/Домофон/);
    expect(kt2.state.vars['w.shelter']).toBe('b_flat');
  });
});

// Главная линия продолжения: оба работают на одной базе, общий расход и ремонт остаются едиными.
describe('главная линия главы 3', () => {
  it('два дня от КТ 4 до КТ 6 проходят согласованно', () => {
    let base = newGame(c, { pairId: 'line3', seed: 'line3', startTime: START_TIME, players });
    base.checkpoint = 4;
    Object.assign(base.vars, { 'w.together': true, 'w.day3': 'stay', 'w.farm_welcome': true });
    for (const e of c.events) if (e.at < 2 * 1440) { for (const p of ['A', 'B']) base.firedEvents[e.scope === 'world' ? `${e.id}@${p}` : e.id] = e.at; };
    for (const [id, def] of Object.entries(c.npcs)) base.npcs[id].agendaDone = def.agenda.filter((a) => (a.at ?? 0) < 2 * 1440).map((a) => a.id);
    for (const p of ['A', 'B'] as const) {
      base.chars[p].location = 'hof_luedemann'; base.chars[p].scene = 'c5_start'; base.chars[p].time = 1440 + 22 * 60;
      base.vars[`seg.loc.${p}`] = 'hof_luedemann';
      for (const i of Object.values(base.items)) if (i.at.kind === 'place' && i.at.id === (p === 'A' ? 'a_flat' : 'b_flat') && ['jeans', 'hoodie', 'boots', 'sneakers', 'rain_jacket', 'winter_jacket', 'beanie', 'gloves'].includes(i.type)) i.at = { kind: 'char', id: p };
    }
    for (const n of [5, 6]) {
      const a = structuredClone(base), b = structuredClone(base);
      for (const [p, s] of [['A', a], ['B', b]] as const) {
        run(s, p, [[`c${n}_sleep`], [`c${n}_sleep`], [`c${n}_begin`], [`c${n}_ledger`], [`c${n}_cellar`], [`c${n}_sort`], [`c${n}_up`]]);
        if (p === 'A') run(s, p, [[`c${n}_wood`], [`c${n}_gate`], [`c${n}_tracks`], [`c${n}_home`]]);
        else run(s, p, [[`c${n}_wood_help`], [`c${n}_wash`], [`c${n}_pawel`]]);
        const ctx = { s, c, pid: p };
        let works = 0;
        while (availableActions(ctx).some((a) => a.def.id === `c${n}_fence` && a.enabled) && works++ < 2) run(s, p, [[`c${n}_fence`]]);
        while (s.chars[p].time < (n + 7 - 10) * 1440 + 20 * 60) run(s, p, [[`c${n}_wait`]]);
        run(s, p, [[`c${n}_meeting`], [`c${n}_go`]]);
        expect(s.chars[p].body.consciousness).toBe('awake');
      }
      base = checkpoint(base, a, b, n === 5 ? { A: { c3_focus: 'repair' }, B: { c3_focus: 'repair' } } : { A: { c3_next: 'settle' }, B: { c3_next: 'settle' } }).state;
      expect(base.ended).toBeUndefined();
      expect(base.vars['w.together']).toBe(true);
      expect(base.checkpoint).toBe(n);
    }
    for (const p of ['A', 'B'] as const) expect(base.chars[p].scene).toBe('c7_start');
  });
});
