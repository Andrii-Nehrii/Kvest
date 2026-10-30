// Глава 2: ночь и утро второго дня из любых положений, в которых могла закончиться глава 1, и КТ 3.
// Положения строятся прямо (место, машина, NPC), чтобы проверить и редкие линии: хутор, Ahrensburg, машина в городе.
import { describe, expect, it } from 'vitest';
import { availableActions, enterScene, isServiceAction } from '../engine/actions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, resolveJoint, syncClocks } from '../engine/checkpoint';
import { evalCond } from '../engine/conditions';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash, unit } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { fmt } from '../engine/world';
import { START_TIME } from '../app/session';
import { nightRoutes } from './chapter2/away';
import { content as c } from './index';

const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const BAD = /\{[^}]*\}|undefined|NaN/;

interface Setup { name: string; A: string; B: string; car?: [string, number]; together?: boolean; vars?: Record<string, string | number | boolean>; npcs?: Record<string, string> }

/** Состояние сразу после КТ 2: оба в своих местах, ночь, следующая сцена — по правилам КТ 2. */
function afterKt2(x: Setup, seed: string): GameState {
  const s = newGame(c, { pairId: 'p', seed, startTime: START_TIME, players: { A: { name: forms('Андрей') }, B: { name: forms('Аня') } } });
  s.checkpoint = 2;
  for (const pid of ['A', 'B'] as const) { s.chars[pid].location = x[pid]; s.chars[pid].time = at(10, 21, 40); }
  // Одеты и с вещами, как к вечеру первого дня.
  for (const i of Object.values(s.items)) {
    if (i.at.kind !== 'place') continue;
    if (i.at.id === 'a_flat' && ['jeans', 'hoodie', 'boots', 'winter_jacket', 'backpack', 'car_keys', 'water_05', 'first_aid', 'disinfectant'].includes(i.type)) i.at = { kind: 'char', id: 'A' };
    if (i.at.id === 'b_flat' && ['jeans', 'hoodie', 'sneakers', 'backpack', 'water_05', 'plasters'].includes(i.type)) i.at = { kind: 'char', id: 'B' };
  }
  const car = Object.values(s.items).find((i) => i.type === 'opel_corsa')!;
  if (x.car) { car.at = { kind: 'place', id: x.car[0] }; car.fuel = x.car[1]; }
  Object.assign(s.vars, { 'w.crossings': 'tunnel', 'w.harburg_cordon': true, 'w.power.buchholz': 'off', 'w.power.buchholz.since': at(10, 20, 15), 'w.together': !!x.together, ...x.vars });
  for (const [id, loc] of Object.entries(x.npcs ?? {})) s.npcs[id].location = loc;
  // Что знают к вечеру первого дня: хутор и мастерская (A рассказал на КТ), пункт в Messe (радио).
  for (const pid of ['A', 'B'] as const) for (const f of ['f_farm', 'f_deniz_shelter', 'f_messe']) s.knowledge[pid][f] = { kind: 'fact', at: 0, source: 'test' };
  s.npcs.gerd.status = 'turned';
  s.npcs.ilse.status = 'injured'; s.npcs.ilse.vars.bitten = true;
  for (const pid of ['A', 'B'] as const) {
    const r = nightRoutes().find((rt) => evalCond({ s, c, pid }, rt.when))!;
    s.chars[pid].scene = r.scene;
    if (c.scenes[r.scene].location) s.chars[pid].location = c.scenes[r.scene].location!;
  }
  for (const k of Object.keys(s.vars)) if (k.startsWith('seg.loc.')) delete s.vars[k];
  return s;
}

const SETUPS: Setup[] = [
  { name: 'вместе у B, машина у дома', A: 'b_street', B: 'b_flat', car: ['b_street', 15], together: true, vars: { 'w.henrike_maybe': true, 'w.shelter': 'farm' }, npcs: { svenja: 'b_flat' } },
  { name: 'вместе у A', A: 'a_flat', B: 'a_street', car: ['a_yard', 5], together: true, vars: { 'w.deniz_shelter': true, 'w.shelter': 'a_flat' }, npcs: { ilse: 'a_flat', gerd: 'a_brockmann' } },
  { name: 'A без бензина в Eppendorf, B дома', A: 'hh_eppendorf', B: 'b_flat', car: ['hh_eppendorf', 0], npcs: { jannik: 'a_car' } },
  { name: 'A дома, B на остановке на B75', A: 'a_flat', B: 'b75_road', car: ['a_yard', 9], vars: { 'B.bike_ready': true, 'B.bike_lost': true } },
  { name: 'A на хуторе, B в Ahrensburg', A: 'hof_luedemann', B: 'ahrensburg', car: ['hof_luedemann', 6], vars: { 'w.henrike_yes': true }, npcs: { merle: 'ahrensburg' } },
  { name: 'A у Дениза, B в Wilhelmsburg с велосипедом', A: 'deniz_workshop', B: 'wilhelmsburg_stairs', car: ['deniz_workshop', 12], vars: { 'w.deniz_shelter': true, 'B.bike_ready': true } },
  { name: 'вместе в машине у вокзала Harburg', A: 'harburg_station', B: 'harburg_station', car: ['harburg_station', 7], together: true },
  { name: 'A у её дома, B уехала в Ahrensburg', A: 'b_street', B: 'ahrensburg', car: ['b_street', 11], npcs: { merle: 'ahrensburg' } },
  { name: 'B у его двери, A в машине в Harburg', A: 'harburg', B: 'a_street', car: ['harburg', 4], npcs: { gerd: 'a_brockmann' } },
];

function checkpointWith(base: GameState, results: Record<PlayerId, GameState>, index: number, tag: string, problems: string[], forced?: string): GameState {
  const merged = mergeSegments(c, base, results);
  const cp = c.checkpoints.find((k) => k.index === index)!;
  syncClocks(c, merged, cp.syncNotBefore);
  deliverMessages(c, merged);
  mergeNotes(c, merged, index);
  const answers: Partial<Record<PlayerId, Record<string, string>>> = {};
  for (const id of cp.joint) {
    const d = c.joint[id];
    for (const p of participants(c, merged, d)) {
      const opts = optionsFor(c, merged, d, p);
      for (const o of opts) if (BAD.test(fmt({ s: merged, c, pid: p }, o.label[p] ?? o.label.default))) problems.push(`${id}/${o.id}`);
      // Чаще отвечают одинаково — как живая пара, которая договорилась.
      const pick = forced && opts.some((o) => o.id === forced) ? forced : unit(`${tag}:same:${id}`) < 0.6 && answers.A?.[id] && opts.some((o) => o.id === answers.A![id]) ? answers.A![id] : opts[Math.floor(unit(`${tag}:ans:${id}:${p}`) * opts.length)].id;
      (answers[p] ??= {})[id] = pick;
    }
  }
  const out = completeCheckpoint(c, merged, answers);
  for (const e of out.state.log) if (BAD.test(e.text)) problems.push(`журнал: ${e.text.slice(0, 80)}`);
  return out.state;
}

function play3(s: GameState, pid: PlayerId, tag: string, problems: string[], seg = 3): ActionRecord[] {
  const recs: ActionRecord[] = [];
  let same = 0;
  let scene = s.chars[pid].scene;
  for (let step = 0; step < 400 && !segmentFinished(c, s, pid); step++) {
    const ctx = { s, c, pid };
    for (const t of c.scenes[s.chars[pid].scene].text) if (evalCond(ctx, t.when) && BAD.test(fmt(ctx, t.text))) problems.push(`${s.chars[pid].scene}: ${fmt(ctx, t.text).slice(0, 80)}`);
    const avail = availableActions(ctx).filter((a) => a.enabled && !isServiceAction(a.def.id));
    for (const a of avail) if (BAD.test(fmt(ctx, a.def.label))) problems.push(`${s.chars[pid].scene}/${a.def.id}: ${a.def.label}`);
    const story = avail.filter((a) => !a.universal);
    // Ночью иногда спят: так быстрее доходят до утра, как и живые игроки.
    const sleep = seg === 3 ? avail.find((a) => a.def.id === 'u:sleep' || a.def.id === 'c2_sleep' || a.def.id === 'c2_doze') : undefined;
    const r = unit(`${tag}:${step}`);
    const pool = sleep && r < 0.25 ? [sleep] : story.length && r < 0.92 ? story : avail;
    if (!pool.length) { problems.push(`${pid}: нет действий в ${s.chars[pid].scene} @${s.chars[pid].location}`); break; }
    const pick = pool[Math.floor(unit(`${tag}:${step}:p`) * pool.length)];
    recs.push({ scene: s.chars[pid].scene, plan: [pick.def.id] });
    const res = play(c, s, pid, [pick.def.id]);
    for (const st of res.steps) for (const t of st.text) if (BAD.test(t)) problems.push(`${recs[recs.length - 1].scene}/${pick.def.id}: ${t.slice(0, 80)}`);
    if (s.chars[pid].scene !== scene) { scene = s.chars[pid].scene; same = 0; }
    if (++same === 90) problems.push(`${pid} застрял в ${scene} @${s.chars[pid].location}`);
  }
  if (!segmentFinished(c, s, pid)) problems.push(`${pid} не дошёл до КТ ${seg}: ${s.chars[pid].scene} @${s.chars[pid].location} ${s.chars[pid].time}`);
  return recs;
}

describe('глава 2: ночь, утро и КТ 3 из разных положений', () => {
  for (const x of SETUPS) {
    it(x.name, () => {
      const problems: string[] = [];
      const reached = new Set<string>();
      const places4 = new Set<string>();
      for (let run = 0; run < 6; run++) {
        const tag = `${x.name}:${run}`;
        const base = afterKt2(x, tag);
        const results = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) {
          const s = structuredClone(base);
          const recs = play3(s, pid, `${tag}:${pid}`, problems);
          expect(stateHash(replaySegment(c, base, pid, recs))).toBe(stateHash(s));
          results[pid] = s;
        }
        if (!(['A', 'B'] as const).every((p) => segmentFinished(c, results[p], p))) continue;
        let state = checkpointWith(base, results, 3, tag, problems);
        reached.add(String(state.vars['w.day2']));
        if (state.ended) continue;
        // Участок 4: дорога и день на новом месте — до КТ 4.
        const res4 = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) {
          const s = structuredClone(state);
          if (s.chars[pid].controlledBy === pid) {
            const recs = play3(s, pid, `${tag}:4:${pid}`, problems, 4);
            expect(stateHash(replaySegment(c, state, pid, recs))).toBe(stateHash(s));
          }
          res4[pid] = s;
        }
        if (!(['A', 'B'] as const).every((p) => segmentFinished(c, res4[p], p))) continue;
        state = checkpointWith(state, res4, 4, `${tag}:4`, problems);
        places4.add(`${state.vars['w.day2']}: A@${state.chars.A.location} B@${state.chars.B.location}`);
        for (const p of ['A', 'B'] as const) if (state.chars[p].controlledBy === p) expect(state.chars[p].scene).toBe('c5_start');
      }
      expect(problems.slice(0, 10)).toEqual([]);
      expect(reached.size).toBeGreaterThan(0);
      console.log(`${x.name}: ${[...places4].join(' | ')}`);
    }, 240000);
  }

  // Заданные ответы на КТ 3: куда едут, и что из этого выходит к ночи.
  const FORCED: [number, string, string, (s: GameState) => void][] = [
    [0, 'farm', 'хутор через коридор', () => {}],
    [0, 'north', 'на север', () => {}],
    [0, 'farm', 'укус замечен на посту — Messe, наблюдение', (s) => { s.chars.A.body.injuries.push({ id: 'w', kind: 'bite', site: 'leftArm', severity: 2, bleeding: 0, treated: 'basic', since: 0, woundInfected: false, healed: 0 }); }],
    [1, 'farm', 'хутор из Buchholz', (s) => { s.vars['w.henrike_yes'] = true; }],
    [1, 'farm', 'хутор: укушенный — в курятник', (s) => { s.vars['w.henrike_yes'] = true; s.chars.B.body.injuries.push({ id: 'w', kind: 'bite', site: 'hands', severity: 1, bleeding: 0, treated: 'basic', since: 0, woundInfected: false, healed: 0 }); }],
    [5, 'workshop', 'мастерская: A уже там, B едет на велосипеде', () => {}],
    [6, 'messe', 'автобус до Messe из Harburg', () => {}],
    [2, 'b_flat', 'A пешком к B', () => {}],
  ];
  for (const [si, answer, name, prep] of FORCED) {
    it(`КТ 3 → ${name}`, () => {
      const problems: string[] = [];
      const ends = new Set<string>();
      for (let run = 0; run < 3; run++) {
        const tag = `forced:${name}:${run}`;
        const base = afterKt2(SETUPS[si], tag);
        prep(base);
        const res = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) { const s = structuredClone(base); play3(s, pid, `${tag}:${pid}`, problems); res[pid] = s; }
        let state = checkpointWith(base, res, 3, tag, problems, answer);
        expect(state.vars['w.day2']).toBe(answer);
        const res4 = {} as Record<PlayerId, GameState>;
        for (const pid of ['A', 'B'] as const) {
          const s = structuredClone(state);
          if (s.chars[pid].controlledBy === pid) play3(s, pid, `${tag}:4:${pid}`, problems, 4);
          res4[pid] = s;
        }
        state = checkpointWith(state, res4, 4, `${tag}:4`, problems);
        ends.add(`A@${state.chars.A.location} B@${state.chars.B.location}`);
      }
      console.log(`${name}: ${[...ends].join(' | ')}`);
      expect(problems.slice(0, 10)).toEqual([]);
    }, 240000);
  }

  it('утром в одиночку можно дойти до партнёра — и на КТ 3 вы встречаетесь', () => {
    const s = afterKt2(SETUPS[2], 'walk');
    const a = structuredClone(s);
    a.chars.A.time = at(11, 6, 30);
    play(c, a, 'A', ['c2_walk_b']);
    expect(a.chars.A.scene).toBe('c2_bdoor');
    play(c, a, 'A', ['c2_ring']);
    expect(segmentFinished(c, a, 'A')).toBe('checkpoint');
    const b = structuredClone(s);
    b.chars.B.time = at(11, 7, 35);
    play(c, b, 'B', ['c3_go']);
    const merged = mergeSegments(c, s, { A: a, B: b });
    syncClocks(c, merged, at(11, 8, 30));
    mergeNotes(c, merged, 3);
    expect(merged.vars['w.together']).toBe(true);
  });

  it('КТ 3: из Barmbek с полным баком можно на юг и на север, из Buchholz в город — нельзя', () => {
    const feas = (x: Setup) => {
      const s = afterKt2(x, 'feas');
      return c.joint.day2.options.filter((o) => evalCond({ s, c, pid: 'A' }, o.feasible)).map((o) => o.id);
    };
    expect(feas(SETUPS[0])).toEqual(expect.arrayContaining(['farm', 'a_flat', 'b_flat', 'messe', 'north', 'stay']));
    const south = feas(SETUPS[1]);
    expect(south).toEqual(expect.arrayContaining(['a_flat', 'messe', 'stay']));
    expect(south).not.toContain('b_flat');
    expect(south).not.toContain('north');
  });

  // ───────────── Регрессии ─────────────

  /** Второй день после КТ 3: решение day2 уже принято, оба стоят там, где их застала точка. */
  function day2State(x: Setup, day2: string, time = at(11, 9, 0)): GameState {
    const s = afterKt2(x, `day2:${x.name}`);
    s.checkpoint = 3;
    Object.assign(s.vars, { 'w.day2': day2, 'w.corridor_ok': true, 'w.kfall': true, 'w.crossings': 'corridor' });
    for (const p of ['A', 'B'] as const) s.chars[p].time = time;
    return s;
  }
  const ids = (s: GameState, pid: PlayerId) => availableActions({ s, c, pid }).filter((a) => a.enabled).map((a) => a.def.id);
  const corsa = (s: GameState) => Object.values(s.items).find((i) => i.type === 'opel_corsa')!;

  it('убитый на лестнице Герд больше не стоит на лестнице: можно подняться домой', () => {
    const s = afterKt2(SETUPS[1], 'gerd');
    s.npcs.gerd.location = 'a_stairs';
    s.npcs.gerd.alive = false; s.npcs.gerd.status = 'dead';
    s.chars.A.time = at(11, 7, 0);
    enterScene({ s, c, pid: 'A' }, 'c2_astairs');
    const here = ids(s, 'A');
    expect(here).not.toContain('sneak');
    expect(here).not.toContain('fight');
    expect(here).toContain('down');
    enterScene({ s, c, pid: 'A' }, 'c2_ayard');
    expect(ids(s, 'A')).toContain('c2_up');
    expect(ids(s, 'A')).not.toContain('c2_up_gerd');
  });

  it('КТ 3: оба оказались в одном месте порознь — встречу видят оба и оба узнают новости друг друга', () => {
    const x: Setup = { name: 'порознь у вокзала', A: 'harburg_station', B: 'harburg_station' };
    const s = afterKt2(x, 'found');
    s.knowledge.A.f_car_shadow = { kind: 'fact', at: 0, source: 'test' };
    s.knowledge.B.f_merle_hypo = { kind: 'fact', at: 0, source: 'test' };
    const res = {} as Record<PlayerId, GameState>;
    for (const pid of ['A', 'B'] as const) {
      const t = structuredClone(s);
      t.chars[pid].time = at(11, 7, 40);
      play(c, t, pid, ['c3_go']);
      res[pid] = t;
    }
    const merged = mergeSegments(c, s, res);
    syncClocks(c, merged, at(11, 8, 30));
    mergeNotes(c, merged, 3);
    expect(merged.vars['w.together']).toBe(true);
    expect(merged.knowledge.A.f_merle_hypo).toBeTruthy();
    expect(merged.knowledge.B.f_car_shadow).toBeTruthy();
    for (const pid of ['A', 'B'] as const) {
      expect(merged.log.some((e) => e.pid === pid && e.kind === 'checkpoint' && e.text.includes('в двадцати шагах'))).toBe(true);
    }
  });

  it('КТ 3: порознь и разные ответы — каждый остаётся, где есть (вчерашний план не тянет одного)', () => {
    const s = afterKt2(SETUPS[3], 'apart');
    s.vars['w.shelter'] = 'a_flat';
    s.chars.A.time = s.chars.B.time = at(11, 9, 0);
    const r = resolveJoint(c, s, 'day2', { A: 'a_flat', B: 'messe' });
    expect(r.applied).toEqual(['stay']);
  });

  it('на посту с укусом: машину A ведёт за грузовиком в Messe, а не бросает у моста', () => {
    const s = day2State(SETUPS[0], 'farm');
    s.vars['A.check_risk'] = true;
    const ctx = { s, c, pid: 'A' as const };
    enterScene(ctx, 'c4_corridor');
    expect(corsa(s).at).toEqual({ kind: 'place', id: 'elbbruecken' });
    play(c, s, 'A', ['c4_queue']);
    expect(s.chars.A.scene).toBe('c4_check_fail');
    play(c, s, 'A', ['c4_escort']);
    expect(s.chars.A.scene).toBe('c4_messe_gate');
    expect(corsa(s).at).toEqual({ kind: 'place', id: 'messe' });
  });

  it('у шлагбаума один A не уходит в её квартиру, а вместе — возвращаются к ней и ставят машину у подъезда', () => {
    const alone = day2State(SETUPS[7], 'farm');
    alone.vars['w.corridor_ok'] = false;
    enterScene({ s: alone, c, pid: 'A' }, 'c4_corridor');
    play(c, alone, 'A', ['c4_queue']);
    expect(alone.chars.A.scene).toBe('c4_turned_back');
    expect(ids(alone, 'A')).not.toContain('c4_back_home');
    play(c, alone, 'A', ['c4_back_car']);
    expect(alone.chars.A.scene).toBe('c2_car');
    expect(corsa(alone).at).toEqual({ kind: 'place', id: alone.chars.A.location });

    const both = day2State(SETUPS[0], 'farm');
    both.vars['w.corridor_ok'] = false;
    enterScene({ s: both, c, pid: 'A' }, 'c4_corridor');
    play(c, both, 'A', ['c4_queue']);
    play(c, both, 'A', ['c4_back_home']);
    expect(both.chars.A.scene).toBe('c2_bflat');
    expect(corsa(both).at).toEqual({ kind: 'place', id: 'b_street' });
  });

  it('одна B, пришедшая в Buchholz, — у его подъезда, а не у него во дворе и в квартире', () => {
    const s = day2State(SETUPS[5], 'a_flat');
    s.chars.B.location = 'harburg';
    s.vars['B.bike_ready'] = true;
    enterScene({ s, c, pid: 'B' }, 'c4_b75');
    play(c, s, 'B', ['c4_on_bike']);
    expect(s.chars.B.scene).toBe('c2_adoor');
    expect(s.chars.B.location).toBe('a_street');
  });

  it('одна B в чужой части города утром может уйти домой; A пешком — к ней', () => {
    const s = afterKt2({ name: 'город', A: 'hh_neustadt', B: 'hh_alster' }, 'city');
    s.chars.A.time = s.chars.B.time = at(11, 7, 0);
    s.chars.B.location = 'hh_alster';
    expect(ids(s, 'B')).toContain('c2_walk_bhome');
    s.chars.B.location = 'b_flat';
    expect(ids(s, 'A')).toContain('c2_walk_b');
  });

  it('Свенья у Окафора кусает его вечером, даже если дома никого нет', () => {
    const s = day2State(SETUPS[4], 'stay', at(11, 16, 0));
    Object.assign(s.npcs.svenja, { location: 'b_okafor', status: 'sick' });
    s.npcs.okafor.location = 'b_okafor';
    s.vars['w.okafor_stays'] = true;
    s.chars.B.location = 'north_gym';
    enterScene({ s, c, pid: 'B' }, 'c4_north_gym');
    while (s.chars.B.time < at(11, 19, 30)) play(c, s, 'B', ['c4_wait']);
    expect(s.npcs.svenja.status).toBe('infected');
    expect(s.npcs.okafor.vars.bitten).toBe(true);
  });

  it('вместе судьбу Свеньи решает хозяйка квартиры, а не гость', () => {
    const s = afterKt2(SETUPS[0], 'svenja');
    s.npcs.svenja.status = 'sick';
    for (const p of ['A', 'B'] as const) { s.chars[p].time = at(11, 8, 0); enterScene({ s, c, pid: p }, 'c2_svenja'); }
    expect(ids(s, 'A')).not.toContain('keep');
    expect(ids(s, 'A')).toContain('water');
    expect(ids(s, 'B')).toContain('keep');
  });

  it('КТ 4: уже на хуторе или на севере — «туда же» выполнимо', () => {
    const s = day2State(SETUPS[4], 'farm', at(11, 22, 30));
    s.chars.A.location = 'farm_coop'; s.chars.B.location = 'hof_luedemann';
    s.vars['w.farm_welcome'] = true; s.vars['w.together'] = true;
    s.vars['w.henrike_yes'] = false;
    const feas = (id: string) => evalCond({ s, c, pid: 'A' }, c.joint.day3.options.find((o) => o.id === id)!.feasible);
    expect(feas('farm')).toBe(true);
    s.chars.A.location = 'north_gym'; s.chars.B.location = 'north_gym';
    expect(feas('north')).toBe(true);
  });
});
