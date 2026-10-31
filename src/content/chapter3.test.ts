import { describe, expect, it } from 'vitest';
import { availableActions, enterScene, isServiceAction } from '../engine/actions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, resolveJoint, syncClocks } from '../engine/checkpoint';
import { evalCond } from '../engine/conditions';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash, unit } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { fmt } from '../engine/world';
import { START_TIME } from '../app/session';
import { stayRoutes } from './chapter3/routes';
import { content as c } from './index';
const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const P = ['A', 'B'] as const;
const BAD = /[{}]|undefined|NaN|\[object/;
const SETUPS: [string, string, boolean][] = [
  ['hof_luedemann', 'hof_luedemann', true], ['farm_coop', 'hof_luedemann', true], ['farm_coop', 'farm_coop', true],
  ['deniz_workshop', 'deniz_workshop', true], ['a_flat', 'a_flat', true], ['b_flat', 'b_flat', true],
  ['messe', 'messe', true], ['messe_q', 'messe', false], ['messe_q', 'messe_q', true],
  ['north_gym', 'north_gym', true], ['hof_luedemann', 'ahrensburg', false],
  ['hh_eppendorf', 'b_flat', false], ['a_stairs', 'b_street', false], ['a_street', 'ahrensburg', false],
  ['harburg_station', 'harburg_station', true], ['b75_road', 'wilhelmsburg_stairs', false],
  ['a7_jam', 'a1_station', false], ['deniz_workshop', 'a_yard', false],
];
function baseFor(x = SETUPS[0], seed = 'chapter3'): GameState {
  const s = newGame(c, { pairId: 'p', seed, startTime: START_TIME, players: { A: { name: forms('Андрей') }, B: { name: forms('Аня') } } });
  s.checkpoint = 4;
  Object.assign(s.vars, { 'w.together': x[2], 'w.day3': 'stay', 'w.workshop_keys': true, 'w.farm_welcome': true, 'w.power.buchholz': 'off', 'w.water.buchholz': 'off' });
  // Уже сработавшие события прошлых дней не должны в искусственном старте срабатывать впервые.
  for (const e of c.events) if (e.at <= at(11, 22)) { for (const p of P) s.firedEvents[e.scope === 'world' ? `${e.id}@${p}` : e.id] = e.at; };
  for (const [id, def] of Object.entries(c.npcs)) s.npcs[id].agendaDone = def.agenda.filter((a) => (a.at ?? 0) < at(11, 22)).map((a) => a.id);
  Object.assign(s.npcs.deniz, { location: 'hof_luedemann' });
  Object.assign(s.npcs.kerem, { location: 'hof_luedemann' });
  Object.assign(s.npcs.merle, { location: 'ahrensburg' });
  for (const pid of P) {
    s.chars[pid].location = x[pid === 'A' ? 0 : 1]; s.chars[pid].time = at(11, 22, 40); s.chars[pid].scene = 'c5_start';
    for (const it of Object.values(s.items)) if (it.at.kind === 'place' && it.at.id === (pid === 'A' ? 'a_flat' : 'b_flat') && ['jeans', 'hoodie', 'boots', 'winter_jacket', 'sneakers', 'backpack', 'car_keys'].includes(it.type)) it.at = { kind: 'char', id: pid };
    s.vars[`seg.loc.${pid}`] = s.chars[pid].location;
    for (const f of ['f_farm', 'f_deniz_shelter', 'f_messe_open']) s.knowledge[pid][f] = { kind: 'fact', at: 0, source: 'test' };
  }
  const car = Object.values(s.items).find((it) => it.type === 'opel_corsa')!;
  car.at = { kind: 'place', id: x[0] === 'a_flat' ? 'a_yard' : x[0] }; car.fuel = 15;
  return s;
}
const ids = (s: GameState, pid: PlayerId) => availableActions({ s, c, pid }).filter((a) => a.enabled).map((a) => a.def.id);
function leg(base: GameState, pid: PlayerId, tag: string) {
  const s = structuredClone(base), records: ActionRecord[] = [];
  for (let step = 0; step < 400 && !segmentFinished(c, s, pid); step++) {
    const ctx = { s, c, pid }, sc = c.scenes[s.chars[pid].scene];
    for (const b of sc.text) if (evalCond(ctx, b.when)) expect(fmt(ctx, b.text), sc.id).not.toMatch(BAD);
    const acts = availableActions(ctx).filter((a) => a.enabled && !isServiceAction(a.def.id));
    const story = acts.filter((a) => !a.universal);
    const pool = story.length ? story : acts;
    expect(pool.length, `${pid} ${sc.id}`).toBeGreaterThan(0);
    const pick = pool[Math.floor(unit(`${tag}:${step}`) * pool.length)];
    expect(fmt(ctx, pick.def.label)).not.toMatch(BAD);
    records.push({ scene: sc.id, plan: [pick.def.id] });
    const res = play(c, s, pid, [pick.def.id]);
    for (const st of res.steps) for (const t of st.text) expect(t).not.toMatch(BAD);
  }
  expect(segmentFinished(c, s, pid), `${pid} ${s.chars[pid].scene}`).toBeTruthy();
  expect(stateHash(replaySegment(c, base, pid, records))).toBe(stateHash(s));
  return s;
}
function cp(base: GameState, ends: Record<PlayerId, GameState>, answer: string): GameState {
  const s = mergeSegments(c, base, ends), checkpoint = c.checkpoints.find((cp) => cp.index === base.checkpoint + 1)!;
  syncClocks(c, s, checkpoint.syncNotBefore); deliverMessages(c, s); mergeNotes(c, s, checkpoint.index);
  const a = Object.fromEntries(checkpoint.joint.map((id) => [id, answer]));
  const out = completeCheckpoint(c, s, { A: a, B: a }).state;
  for (const e of out.log) expect(e.text).not.toMatch(BAD);
  return out;
}
describe('глава 3', () => {
  for (const [i, x] of SETUPS.entries()) it(`матрица ${i + 1}: ${x[0]} / ${x[1]}`, () => {
    for (let run = 0; run < 2; run++) {
      let base = baseFor(x, `matrix3:${i}:${run}`);
      for (const n of [5, 6]) {
        const ends = { A: leg(base, 'A', `${i}:${run}:${n}:A`), B: leg(base, 'B', `${i}:${run}:${n}:B`) };
        base = cp(base, ends, n === 5 ? ['supply', 'repair', 'rest'][i % 3] : ['settle', 'watch', 'search'][i % 3]);
        if (base.ended) break;
        for (const pid of P) if (base.chars[pid].controlledBy === pid) expect(base.chars[pid].scene).toBe(n === 5 ? 'c6_start' : 'c7_start');
      }
    }
  }, 120000);

  it('каждая домашняя локация и редкий старт имеют определённый маршрут', () => {
    for (const loc of ['a_flat', 'a_stairs', 'a_yard', 'a_street', 'a_brockmann', 'b_flat', 'b_stairs', 'b_yard', 'b_street', 'b_okafor', 'b_nowak', 'b_kiosk', 'hof_luedemann', 'farm_coop', 'deniz_workshop', 'ahrensburg', 'b_van', 'north_gym', 'messe', 'messe_q', 'c3_messe_yard', 'hh_city', 'elbbruecken']) {
      const s = baseFor(); s.chars.A.location = loc;
      for (const n of [5, 6]) expect(c.scenes[stayRoutes(n).find((r) => evalCond({ s, c, pid: 'A' }, r.when))!.scene]).toBeDefined();
    }
  });
  for (const choice of ['farm', 'workshop', 'a_flat', 'b_flat', 'messe', 'north']) it(`план КТ 4: ${choice}, обе линии воспроизводятся`, () => {
    const s = baseFor(['b_flat', 'b_flat', true], `trip:${choice}`);
    s.vars['w.day3'] = choice;
    const ends = { A: leg(s, 'A', `trip:${choice}:A`), B: leg(s, 'B', `trip:${choice}:B`) };
    cp(s, ends, 'rest');
  }, 120000);

  it('порознь несовместимые приоритеты не уводят никого с места', () => {
    for (const decision of ['c3_focus', 'c3_next']) {
      const s = baseFor(['a_flat', 'b_flat', false]);
      s.checkpoint = decision === 'c3_focus' ? 4 : 5;
      for (const a of c.joint[decision].options) for (const b of c.joint[decision].options) if (a.id !== b.id) {
        expect(resolveJoint(c, structuredClone(s), decision, { A: a.id, B: b.id }).applied).toEqual([decision === 'c3_focus' ? 'rest' : 'watch']);
      }
    }
  });
  it('все пары ответов разрешаются только в объективно выполнимый вариант', () => {
    for (const x of SETUPS) for (const id of ['c3_focus', 'c3_next']) {
      const s = baseFor(x); s.vars['w.together'] = x[2];
      for (const a of c.joint[id].options) for (const b of c.joint[id].options) {
        const copy = structuredClone(s), r = resolveJoint(c, copy, id, { A: a.id, B: b.id });
        for (const picked of r.applied) expect(evalCond({ s, c, pid: 'A' }, c.joint[id].options.find((o) => o.id === picked)!.feasible)).toBe(true);
      }
    }
  });
  it('чужая квартира и мастерская без ключа не становятся доступными', () => {
    const s = baseFor(['a_flat', 'a_street', false]); s.vars['w.workshop_keys'] = false;
    for (const [pid, loc, expected] of [['B', 'a_street', 'c5_out'], ['A', 'b_street', 'c5_out'], ['A', 'deniz_workshop', 'c5_out']] as const) {
      s.chars[pid].location = loc;
      expect(stayRoutes(5).find((r) => evalCond({ s, c, pid }, r.when))!.scene).toBe(expected);
    }
  });
  it('убитый сосед не говорит и не меняет стадию болезни', () => {
    const s = baseFor(['b_flat', 'b_flat', true]); s.npcs.okafor.alive = false; s.npcs.okafor.status = 'dead'; s.npcs.okafor.vars.bitten = true;
    s.chars.B.time = at(12, 14); enterScene({ s, c, pid: 'B' }, 'c5_bflat');
    expect(ids(s, 'B')).not.toContain('c5_okafor');
    play(c, s, 'B', ['c5_wait']); expect(s.npcs.okafor.status).toBe('dead');
  });
  it('болезнь Окафора развивается вдали от обоих игроков', () => {
    const s = baseFor(); s.npcs.okafor.status = 'injured'; s.npcs.okafor.vars.bitten = true;
    s.chars.A.time = at(12, 12); enterScene({ s, c, pid: 'A' }, 'c5_farm');
    for (let i = 0; i < 25; i++) play(c, s, 'A', ['c5_wait']);
    expect(s.npcs.okafor.status).toBe('turned');
  });
  it('наблюдение нельзя покинуть по дорожному плану, вспышку — переждать за работой', () => {
    const s = baseFor(['messe_q', 'messe_q', true]); s.vars['w.day3'] = 'farm'; s.chars.A.time = at(12, 8);
    play(c, s, 'A', ['c5_begin']); expect(s.chars.A.scene).toBe('c5_q');
    s.checkpoint = 5; s.chars.A.time = at(13, 8, 59); enterScene({ s, c, pid: 'A' }, 'c6_q');
    play(c, s, 'A', ['c6_wait']);
    expect(ids(s, 'A').filter((id) => id.startsWith('c6_'))).toEqual(['c6_alarm']);
    play(c, s, 'A', ['c6_alarm']); play(c, s, 'A', ['c6_exit_staff']);
    expect(s.chars.A.location).toBe('c3_messe_yard');
  });
  it('на КТ 5 встречу и знания получают обе линии', () => {
    const s = baseFor(); s.vars['w.together'] = false;
    s.knowledge.A.f_c3_well = { kind: 'fact', at: 0, source: 'test' };
    s.knowledge.B.f_c3_exchange = { kind: 'fact', at: 0, source: 'test' };
    s.chars.A.time = s.chars.B.time = at(12, 20); mergeNotes(c, s, 5);
    expect(s.knowledge.A.f_c3_exchange).toBeTruthy(); expect(s.knowledge.B.f_c3_well).toBeTruthy();
    for (const pid of P) expect(s.log.some((e) => e.pid === pid && e.kind === 'checkpoint')).toBe(true);
  });
  it('карантин снимается лично, без выпуска больного партнёра', () => {
    const s = baseFor(['farm_coop', 'farm_coop', true]); s.chars.A.time = s.chars.B.time = at(12, 20);
    s.chars.B.body.coreTemp = 38.2; mergeNotes(c, s, 5);
    expect(s.vars['A.c3_coop_clear']).toBe(true); expect(s.vars['B.c3_coop_clear']).toBeUndefined();
  });
});

describe('глава 3: расход и маршруты', () => {
  it('общая добыча и обмен принадлежат только одной линии, работа обеих складывается', () => {
    const base = baseFor();
    base.chars.A.time = base.chars.B.time = at(12, 10);
    for (const p of P) enterScene({ s: base, c, pid: p }, 'c5_farm');
    const a = structuredClone(base), b = structuredClone(base);
    expect(ids(a, 'A')).toContain('c5_wood'); expect(ids(b, 'B')).not.toContain('c5_wood');
    play(c, a, 'A', ['c5_fence']); play(c, b, 'B', ['c5_fence']);
    const merged = mergeSegments(c, base, { A: a, B: b });
    expect(merged.vars['proj.c3_fence.progress']).toBe(Number(a.vars['proj.c3_fence.progress']) + Number(b.vars['proj.c3_fence.progress']));
  });
  it('суточный расход общей базы не удваивается при слиянии', () => {
    const base = baseFor();
    base.chars.A.time = base.chars.B.time = at(12, 5, 45);
    for (const p of P) enterScene({ s: base, c, pid: p }, 'c5_farm');
    const a = structuredClone(base), b = structuredClone(base);
    for (const [s, pid] of [[a, 'A'], [b, 'B']] as const) play(c, s, pid, ['c5_wait']);
    const sum = (s: GameState, type: string) => Object.values(s.items).filter((i) => i.type === type && i.at.kind === 'place' && i.at.id === 'c3_farm_stock').reduce((a, i) => a + i.qty, 0);
    const merged = mergeSegments(c, base, { A: a, B: b });
    for (const type of ['potatoes', 'oats', 'firewood']) expect(sum(merged, type)).toBe(Math.min(sum(a, type), sum(b, type)));
  });
  it('из города обе линии везут одну машину и тратят бензин один раз', () => {
    const base = baseFor(['b_flat', 'b_flat', true]); base.vars['w.day3'] = 'farm';
    const car = Object.values(base.items).find((i) => i.type === 'opel_corsa')!; car.at = { kind: 'place', id: 'b_street' };
    base.chars.A.time = base.chars.B.time = at(12, 8);
    const ends = {} as Record<PlayerId, GameState>;
    for (const pid of P) {
      const s = structuredClone(base); play(c, s, pid, ['c5_begin']);
      play(c, s, pid, ['c5_road_wait']); play(c, s, pid, ['c5_road_wait']); play(c, s, pid, ['c5_road_go']); ends[pid] = s;
      expect(s.chars[pid].scene).toBe('c5_farm_arrival');
    }
    expect(ends.B.items[car.id].fuel).toBe(15);
    const merged = mergeSegments(c, base, ends);
    expect(merged.items[car.id].fuel).toBe(ends.A.items[car.id].fuel);
    expect(merged.items[car.id].at).toEqual({ kind: 'place', id: 'hof_luedemann' });
  });
  it('без бензина кордон не переносит на южный берег, местный южный путь доступен пешком', () => {
    const s = baseFor(['b_flat', 'b_flat', true]); s.vars['w.day3'] = 'farm'; s.chars.A.time = at(12, 9);
    const car = Object.values(s.items).find((i) => i.type === 'opel_corsa')!; car.fuel = 0; car.at = { kind: 'place', id: 'b_street' };
    play(c, s, 'A', ['c5_begin']); play(c, s, 'A', ['c5_road_go']);
    expect(s.chars.A.scene).toBe('c5_out'); expect(s.chars.A.location).toBe('b_flat');
    const south = baseFor(['a_flat', 'a_flat', true]); south.vars['w.day3'] = 'farm'; south.chars.A.time = at(12, 9);
    Object.values(south.items).find((i) => i.type === 'opel_corsa')!.fuel = 0;
    play(c, south, 'A', ['c5_begin']); play(c, south, 'A', ['c5_road_go']);
    expect(south.chars.A.location).toBe('hof_luedemann');
  });
  it('новый карантин нельзя снять в день прибытия', () => {
    const s = baseFor(['farm_coop', 'farm_coop', true]); s.vars['A.c3_new_coop'] = true;
    s.chars.A.time = s.chars.B.time = at(12, 20); mergeNotes(c, s, 5);
    expect(s.vars['A.c3_coop_clear']).toBeUndefined();
  });
});

it('одинаковые порции из общего запаса вычитаются дважды, не создавая воду', () => {
  const base = baseFor(['a_flat', 'a_flat', true]); base.chars.A.time = base.chars.B.time = at(12, 10);
  const ends = {} as Record<PlayerId, GameState>;
  for (const pid of P) {
    const s = structuredClone(base); enterScene({ s, c, pid }, 'c5_aflat');
    play(c, s, pid, ['c5_draw_water']); ends[pid] = s;
  }
  const merged = mergeSegments(c, base, ends);
  const remain = Object.values(merged.items).filter((i) => i.type === 'water_l' && i.at.kind === 'place' && i.at.id === 'c3_a_stock').reduce((n, i) => n + i.qty, 0);
  expect(remain).toBe(12);
});

it('новая регистрация в Messe учитывает риск на обоих берегах', () => {
  for (const start of ['b_flat', 'a_flat']) {
    const s = baseFor([start, start, true]); s.vars['w.day3'] = 'messe'; s.vars['A.check_risk'] = true; s.chars.A.time = at(12, 9);
    play(c, s, 'A', ['c5_begin']); play(c, s, 'A', ['c5_road_go']);
    expect(s.chars.A.scene).toBe('c5_q'); expect(s.chars.A.location).toBe('messe_q');
  }
});
