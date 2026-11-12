import { describe, expect, it } from 'vitest';
import { availableActions, enterScene, isServiceAction } from '../engine/actions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, resolveJoint, syncClocks } from '../engine/checkpoint';
import { evalCond } from '../engine/conditions';
import { newGame, play, replaySegment, segmentFinished, type ActionRecord } from '../engine/game';
import { stateHash, unit } from '../engine/rng';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { fmt, giveItem } from '../engine/world';
import { START_TIME, shouldSendAnswers, myAnswersCode, acceptPartnerAnswers, readyToFinish, finishCheckpoint, type LocalSave } from '../app/session';
import { stayRoutes } from './chapter3/routes';
import { farm6bAvailable } from './chapter3/farm6b';
import { point8Available } from './chapter3/point8';
import { point9Available } from './chapter3/point9';
import { point10Available } from './chapter3/point10';
import { point11Available } from './chapter3/point11';
import { point12Available, point13Available } from './chapter3/point12';
import { point14Available, point15Available } from './chapter3/point14';
import { point16Available, point17Available } from './chapter3/point16';
import { point18Available } from './chapter3/point18';
import { point19Available, point20Available } from './chapter3/point19';
import { introducedPerson } from '../engine/introduced';
import { content as c } from './index';
/** Написанные участки главы 3 (после последнего — экран продолжения). */
const written = (n: number) => c.checkpoints.some((cp) => cp.index === n);
const SEGS = [5, 6, 7, 8].filter(written);
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
  for (const [id, def] of Object.entries(c.npcs)) if (s.npcs[id]) s.npcs[id].agendaDone = def.agenda.filter((a) => (a.at ?? 0) < at(11, 22)).map((a) => a.id);
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
  // Ответ из доступных игроку вариантов: заданный, иначе «остаться», иначе первый доступный.
  const pickFor = (pid: PlayerId) => Object.fromEntries(checkpoint.joint.map((id) => {
    const opts = optionsFor(c, s, c.joint[id], pid).map((o) => o.id);
    return [id, opts.includes(answer) ? answer : opts.includes('stay') ? 'stay' : opts[0]];
  }));
  const out = completeCheckpoint(c, s, { A: pickFor('A'), B: pickFor('B') }).state;
  for (const e of out.log) expect(e.text).not.toMatch(BAD);
  return out;
}
describe('глава 3', () => {
  for (const [i, x] of SETUPS.entries()) it(`матрица ${i + 1}: ${x[0]} / ${x[1]}`, () => {
    for (let run = 0; run < 2; run++) {
      let base = baseFor(x, `matrix3:${i}:${run}`);
      for (const n of SEGS) {
        // Новый участок 6 написан только для сохранившейся линии пары; остальные ждут продолжения.
        if (n === 6 && !P.every(pid => evalCond({ s: base, c, pid }, farm6bAvailable))) break;
        if (n === 8 && !P.every(pid => evalCond({ s: base, c, pid }, point8Available))) break;
        if (n === 9 && !P.every(pid => evalCond({ s: base, c, pid }, point9Available))) break;
        if (n === 10 && !P.every(pid => evalCond({ s: base, c, pid }, point10Available))) break;
        if (n === 11 && !P.every(pid => evalCond({ s: base, c, pid }, point11Available))) break;
        const ends = { A: leg(base, 'A', `${i}:${run}:${n}:A`), B: leg(base, 'B', `${i}:${run}:${n}:B`) };
        base = cp(base, ends, 'stay');
        if (base.ended) break;
        for (const pid of P) if (base.chars[pid].controlledBy === pid) expect(base.chars[pid].scene).toBe(`c${n + 1}_start`);
      }
    }
  }, 120000);

  it('каждая домашняя локация и редкий старт имеют определённый маршрут', () => {
    for (const loc of ['a_flat', 'a_stairs', 'a_yard', 'a_street', 'a_brockmann', 'b_flat', 'b_stairs', 'b_yard', 'b_street', 'b_okafor', 'b_nowak', 'b_kiosk', 'hof_luedemann', 'farm_coop', 'deniz_workshop', 'ahrensburg', 'b_van', 'north_gym', 'messe', 'messe_q', 'c3_messe_yard', 'hh_city', 'elbbruecken']) {
      const s = baseFor(); s.chars.A.location = loc;
      // Сетка домашних маршрутов используется в старых универсальных участках.
      // Новая точка 7 имеет собственные входы/выходы (point7.test.ts).
      for (const n of SEGS.filter(n => n <= 6)) expect(c.scenes[stayRoutes(n).find((r) => evalCond({ s, c, pid: 'A' }, r.when))!.scene]).toBeDefined();
    }
  });
  for (const choice of ['farm', 'workshop', 'a_flat', 'b_flat', 'messe', 'north']) it(`план КТ 4: ${choice}, обе линии воспроизводятся`, () => {
    const s = baseFor(['b_flat', 'b_flat', true], `trip:${choice}`);
    s.vars['w.day3'] = choice;
    const ends = { A: leg(s, 'A', `trip:${choice}:A`), B: leg(s, 'B', `trip:${choice}:B`) };
    cp(s, ends, 'stay');
  }, 120000);

  it('порознь несовместимые приоритеты не уводят никого с места', () => {
    for (const decision of ['c3_midday5', 'c3_night', 'c3_midday7', 'c3_lastnight']) {
      const s = baseFor(['a_flat', 'b_flat', false]);
      s.checkpoint = c.joint[decision].checkpoint - 1;
      for (const a of optionsFor(c, s, c.joint[decision], 'A')) for (const b of optionsFor(c, s, c.joint[decision], 'B')) if (a.id !== b.id) {
        expect(resolveJoint(c, structuredClone(s), decision, { A: a.id, B: b.id }).applied).toEqual(['stay']);
      }
    }
  });
  it('все пары ответов разрешаются только в объективно выполнимый вариант', () => {
    for (const x of SETUPS) for (const id of ['c3_midday5', 'c3_night', 'c3_midday7', 'c3_lastnight']) {
      const s = baseFor(x); s.vars['w.together'] = x[2];
      for (const a of optionsFor(c, s, c.joint[id], 'A')) for (const b of optionsFor(c, s, c.joint[id], 'B')) {
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
});

describe('глава 3: расход и маршруты', () => {
  it('общая добыча и обмен принадлежат только одной линии, работа обеих складывается', () => {
    const base = baseFor();
    base.chars.A.time = base.chars.B.time = at(12, 10);
    for (const p of P) enterScene({ s: base, c, pid: p }, 'c5_cellar');
    const a = structuredClone(base), b = structuredClone(base);
    expect(ids(a, 'A')).toContain('c5_exchange_sack'); expect(ids(b, 'B')).not.toContain('c5_exchange_sack');
    enterScene({ s: a, c, pid: 'A' }, 'c5_gate'); enterScene({ s: b, c, pid: 'B' }, 'c5_gate');
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
    s.chars.A.time = s.chars.B.time = at(12, 21); mergeNotes(c, s, 6);
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

describe('глава 3: четыре участка и последствия', () => {
  it('живой Герд на лестнице не пропускает с улицы в квартиру', () => {
    const s = baseFor(['a_yard', 'a_flat', true]);
    Object.assign(s.npcs.gerd, { alive: true, status: 'turned', location: 'a_stairs', vars: {} });
    expect(stayRoutes(5).find((r) => evalCond({ s, c, pid: 'A' }, r.when))!.scene).toBe('c5_out');
    s.npcs.gerd.alive = false;
    expect(stayRoutes(5).find((r) => evalCond({ s, c, pid: 'A' }, r.when))!.scene).toBe('c5_aflat');
  });
  it('проверка хозяйки ограничивает совместный приём, согласие меняет состав базы', () => {
    const s = baseFor(); s.checkpoint = 5;
    s.vars['w.c3_koehler_met'] = true;
    // Без осмотра хозяйка не пускает в дом (на хуторе это отдельный исход, а не «остаться»).
    expect(resolveJoint(c, structuredClone(s), 'c3_night', { A: 'inside', B: 'inside' }).applied).not.toEqual(['inside']);
    s.vars['w.c3_guest_checked'] = true; s.npcs.henrike.trust.A = 30; s.npcs.c3_koehler.location = 'hof_luedemann';
    expect(resolveJoint(c, s, 'c3_night', { A: 'inside', B: 'inside' }).applied).toEqual(['inside']);
    expect(s.vars['w.c3_guest_contract']).toBe(true); expect(s.npcs.c3_koehler.location).toBe('hof_luedemann');
  });
});

it('совместная вылазка не выпускает второго игрока из изоляции', () => {
  const s = baseFor(['hof_luedemann', 'farm_coop', true]);
  expect(evalCond({ s, c, pid: 'A' }, c.joint.c3_midday5.options.find(o => o.id === 'exchange')!.feasible)).toBe(false);
});
it('встреча на домашней площадке даёт заметку и знания обоим', () => {
  const s = baseFor(['b_stairs', 'b_flat', false]);
  s.knowledge.B.f_c3_exchange = { kind: 'fact', at: 0, source: 'test' };
  mergeNotes(c, s, 5);
  expect(s.vars['w.together']).toBe(true);
  expect(s.knowledge.A.f_c3_exchange).toBeTruthy();
  for (const pid of P) expect(s.log.some((l) => l.pid === pid && l.kind === 'checkpoint')).toBe(true);
});


it('ответ единственного участника новой точки доходит до второго телефона', async () => {
  const merged = baseFor(); merged.chars.A.body.consciousness = 'dead';
  const phone = (me: PlayerId): LocalSave => ({
    schema: 1, me, pairId: merged.pairId, secret: 'eA', seed: merged.seed,
    phase: 'checkpoint', setups: { A: { name: forms('Андрей') }, B: { name: forms('Аня') } },
    base: merged, state: merged, baseHash: stateHash(merged), segment: [], hashes: [],
    playSeconds: 0, updatedAt: 0, cp: { index: 5, merged, mergedHash: stateHash(merged) },
  });
  let a = phone('A'); const b = phone('B');
  b.cp!.myAnswers = { c3_midday5: optionsFor(c, merged, c.joint.c3_midday5, 'B')[0].id };
  expect(shouldSendAnswers(c, a)).toBe(false);
  expect(shouldSendAnswers(c, b)).toBe(true);
  expect(readyToFinish(c, a)).toBe(false);
  a = await acceptPartnerAnswers(c, a, await myAnswersCode(b));
  expect(readyToFinish(c, a)).toBe(true);
  expect(finishCheckpoint(c, a).baseHash).toBe(finishCheckpoint(c, b).baseHash);
  // Прежние точки сохраняют прежний порядок выдачи кодов.
  b.cp!.index = 4; b.cp!.myAnswers = { day3: 'stay' };
  expect(shouldSendAnswers(c, b)).toBe(false);
});

for (const id of c.checkpoints.filter(cp => cp.index >= 5).flatMap(cp => cp.joint)) {
  for (const option of c.joint[id].options) it(`заданный ответ ${id}/${option.id} исполняется на обоих телефонах`, () => {
    // Вариант проверяется там, где он есть: сначала прежнее место по смыслу, затем остальные домашние места главы.
    const guess = (option.id === 'north' || (['water', 'give', 'isolate', 'neighbor'].includes(option.id) && id !== 'c3_lastnight')) ? 'b_flat' : option.id === 'farm' ? 'a_flat' : option.id === 'jack' ? 'deniz_workshop' : ['shift', 'escort', 'bed'].includes(option.id) ? 'north_gym' : 'hof_luedemann';
    const n = c.joint[id].checkpoint;
    const setup = (place: string) => {
      const s = baseFor([place, place, true], `forced:${id}:${option.id}`);
      s.checkpoint = n - 1;
      if (id === 'c3_l_road6' && option.id !== 'none') {
        s.vars['A.c6_l_finished'] = s.vars['B.c6_l_finished'] = true;
      }
      if (n === 7 && id.startsWith('c3_new_')) {
        // Общие действия 7 доступны после личной подготовки, со своим инструментом
        // и живыми помощниками. Отрицательные случаи проверяет point7.test.ts.
        s.npcs.pawel.location = 'hof_luedemann';
        giveItem({ s, c, pid: 'A' }, 'crowbar', 1);
        Object.assign(s.vars, { 'w.c7_new_story': true, 'A.c7_tools_ready': true,
          'A.c7_has_tool': true, 'A.c7_tools_deniz': true, 'A.c7_deniz_willing': true,
          'A.c7_has_crowbar': true, 'A.c7_has_car_key': true });
      }
      if (n === 8 && id === 'c3_new_route8') {
        for (const pid of P) s.chars[pid].location = 'c7_farm_lane';
        const car = Object.values(s.items).find(i => i.type === 'opel_corsa')!;
        car.at = { kind: 'place', id: 'c7_farm_lane' };
        Object.assign(s.vars, { 'A.c8_finished': true, 'B.c8_finished': true, 'A.c8_has_key': true });
      }
      if (n === 10) s.vars['w.c9_jens'] = 'kept';
      if (n >= 12) for (const npc of ['c12_marcus', 'c12_leo']) s.npcs[npc] ??= introducedPerson(c.npcs[npc], 0);
      if (n >= 14) for (const npc of ['c14_ute', 'c14_jannes']) s.npcs[npc] ??= introducedPerson(c.npcs[npc], 0);
      if (n >= 17) s.vars['w.c16_tractor'] = true;
      if (n >= 17) s.vars['w.c15_nina'] = id === 'c3_new_nina17' && ['fetch', 'phone', 'later'].includes(option.id) ? 'winsen' : 'stay';
      if (n >= 19) {
        // Машина у дома с бензином; ружьё найдено; для «домой в объезд» оба в Люнебурге вместе с машиной.
        const corsa = Object.values(s.items).find(i => i.type === 'opel_corsa')!;
        corsa.fuel = 20; corsa.at = { kind: 'place', id: 'hof_luedemann' };
        s.vars['w.c19_gun'] = 'house';
        if (n === 20 && option.id === 'home') { for (const pid of P) s.chars[pid].location = 'c18_lueneburg'; corsa.at = { kind: 'place', id: 'c18_lueneburg' }; }
      }
      if (option.id === 'search') s.npcs.kerem.location = 'b75_road';
      if (option.id === 'guard') s.vars['w.c3_f7_shed_lost'] = true;
      if (option.id === 'boards') s.vars['w.c3_f8_window_broken'] = true;
      s.vars['w.c3_koehler_met'] = s.vars['w.c3_guest_checked'] = true;
      s.npcs.c3_koehler.location = 'hof_luedemann'; s.npcs.henrike.trust.A = 40;
      for (const pid of P) {
        s.chars[pid].time = c.checkpoints.find((cp) => cp.index === n)!.syncNotBefore!;
        s.knowledge[pid].f_c3_exchange = { kind: 'fact', at: 0, source: 'test' };
      }
      const bottle = Object.values(s.items).find((i) => i.type === 'water_15');
      if (bottle) { bottle.at = { kind: 'char', id: 'A' }; bottle.qty = 2; }
      return s;
    };
    const ok = (s: GameState) => optionsFor(c, s, c.joint[id], 'A').some((o) => o.id === option.id) && evalCond({ s, c, pid: 'A' }, option.feasible);
    const s = [guess, 'hof_luedemann', 'b_flat', 'a_flat', 'north_gym', 'messe', 'deniz_workshop', 'farm_coop'].map(setup).find(ok) ?? setup(guess);
    expect(optionsFor(c, s, c.joint[id], 'A').some((o) => o.id === option.id)).toBe(true);
    expect(evalCond({ s, c, pid: 'A' }, option.feasible), `${id}/${option.id}`).toBe(true);
    const answers = Object.fromEntries(c.checkpoints.find(cp => cp.index === n)!.joint.map(other => [other,
      other === id ? option.id : optionsFor(c, s, c.joint[other], 'A')[0].id]));
    const out = completeCheckpoint(c, s, { A: answers, B: answers });
    expect(out.joint.find(result => result.id === id)!.applied).toEqual([option.id]);
    for (const pid of P) expect(out.state.chars[pid].scene).toBe(`c${n + 1}_start`);
    if (written(n + 1) && (n + 1 !== 6 || P.every(pid => evalCond({ s: out.state, c, pid }, farm6bAvailable)))
      && (n + 1 !== 8 || P.every(pid => evalCond({ s: out.state, c, pid }, point8Available)))
      && (n + 1 !== 9 || P.every(pid => evalCond({ s: out.state, c, pid }, point9Available)))
      && (n + 1 !== 10 || P.every(pid => evalCond({ s: out.state, c, pid }, point10Available)))
      && (n + 1 !== 11 || P.every(pid => evalCond({ s: out.state, c, pid }, point11Available)))
      && (n + 1 !== 12 || P.every(pid => evalCond({ s: out.state, c, pid }, point12Available)))
      && (n + 1 !== 13 || P.every(pid => evalCond({ s: out.state, c, pid }, point13Available)))
      && (n + 1 !== 14 || P.every(pid => evalCond({ s: out.state, c, pid }, point14Available)))
      && (n + 1 !== 15 || P.every(pid => evalCond({ s: out.state, c, pid }, point15Available)))
      && (n + 1 !== 16 || P.every(pid => evalCond({ s: out.state, c, pid }, point16Available)))
      && (n + 1 !== 17 || P.every(pid => evalCond({ s: out.state, c, pid }, point17Available)))
      && (n + 1 !== 18 || P.every(pid => evalCond({ s: out.state, c, pid }, point18Available)))
      && (n + 1 !== 19 || P.every(pid => evalCond({ s: out.state, c, pid }, point19Available)))
      && (n + 1 !== 20 || P.every(pid => evalCond({ s: out.state, c, pid }, point20Available)))) {
      for (const pid of P) leg(out.state, pid, `forced:${id}:${option.id}:${pid}`);
    }
  }, 120000);
}


it('у каждого места выпущенного участка 5 сохранены два доступных прерывания', () => {
  const places: [string, string][] = [
    ['farm', 'hof_luedemann'], ['coop', 'farm_coop'], ['aflat', 'a_flat'], ['bflat', 'b_flat'],
    ['workshop', 'deniz_workshop'], ['ahr', 'ahrensburg'], ['north', 'north_gym'], ['out', 'harburg_station'],
  ];
  // Для нового участка 6 число прерываний не норма: центральная сцена следует из действий.
  for (const n of SEGS.filter(n => n === 5)) for (const [key, place] of [...places, ...(n <= 7 ? [['messe', 'messe'], ['q', 'messe_q']] as [string, string][] : [])]) {
    const s = baseFor([place, place, true]); s.checkpoint = n - 1;
    s.chars.A.time = at(n < 7 ? 12 : 13, n % 2 ? 12 : 20, 30);
    s.chars.A.scene = `c${n}_${key}`;
    for (const npc of Object.values(s.npcs)) npc.location = place === 'farm_coop' ? 'hof_luedemann' : place;
    s.npcs.okafor.location = 'b_okafor';
    const events = c.events.filter((e) => e.interrupt && /^ev_[cfnmb]/.test(e.id) && e.id.startsWith(`ev_${e.id[3]}${n}_`) && (() => { const at = s.chars.A.time; s.chars.A.time = e.at; const result = evalCond({ s, c, pid: 'A' }, e.when); s.chars.A.time = at; return result; })());
    expect(events.length, `${n}/${key}`).toBeGreaterThanOrEqual(2);
  }
});

it('эпизоды дают выбор сразу, вопросы необязательны, исход читается за пределами эпизода', () => {
  const episodes = Object.values(c.scenes).filter(s => s.chapter === 'ch3' && s.onEnter?.some(e => 'set' in e && typeof e.set === 'string' && e.set.endsWith('.started')));
  expect(episodes.length).toBeGreaterThan(5);
  for (const sc of episodes) {
    expect(sc.actions.filter(a => a.terminal).length, sc.id).toBeGreaterThanOrEqual(2);
    expect(sc.actions.some(a => /_step\d+$/.test(a.id)), sc.id).toBe(false);
    for (const a of sc.actions.filter(a => a.terminal)) {
      const result = a.effects?.find(e => 'set' in e && typeof e.set === 'string' && e.set.endsWith('.result'));
      if (!result || !('set' in result) || typeof result.set !== 'string' || !('value' in result)) continue;
      const key = result.set;
      const elsewhere = Object.values(c.scenes).filter(s => s.id !== sc.id).flatMap(s => s.text);
      expect(elsewhere.some(b => (JSON.stringify(b.when) ?? "").includes(key) && (JSON.stringify(b.when) ?? "").includes(JSON.stringify(result.value))), `${sc.id}/${a.id}`).toBe(true);
    }
  }
});

it('вечером не возвращаются выполненные утренние одноразовые дела', () => {
  for (const [before, after] of [[5, 6], [7, 8]]) {
    for (const sc of Object.values(c.scenes).filter(s => s.id.startsWith(`c${before}_`))) {
      const next = c.scenes[sc.id.replace(`c${before}_`, `c${after}_`)];
      if (!next) continue;
      const texts = sc.actions.filter(a => a.text && !a.repeatable && !a.goto).map(a => a.text);
      const duplicates = next.actions.filter(a => a.text && texts.includes(a.text) && !a.repeatable && !a.goto && !a.id.endsWith('_reserve') && !a.id.endsWith('_draw_water'));
      expect(duplicates.map(a => a.id), next.id).toEqual([]);
    }
  }
});

it('новости партнёра требуют контакта, оба слышат конкретный исход', () => {
  const s = baseFor(['hof_luedemann', 'hof_luedemann', true]);
  s.vars['A.c5_spilled.result'] = 'dress'; s.vars['B.c5_bread.result'] = 'rule';
  mergeNotes(c, s, 5);
  expect(s.log.some(l => l.pid === 'B' && l.text.includes('перевязки осталось'))).toBe(true);
  expect(s.log.some(l => l.pid === 'A' && l.text.includes('унёс сумку'))).toBe(true);
  const apart = baseFor(['hof_luedemann', 'b_flat', false]);
  apart.vars['A.c5_spilled.result'] = 'dress';
  for (const i of Object.values(apart.items)) if (i.type === 'phone') i.charge = 0;
  mergeNotes(c, apart, 5);
  expect(apart.log.some(l => l.pid === 'B' && l.text.includes('перевязки осталось'))).toBe(false);
});

it('вместе спор разрешается по обстоятельствам, не обязательным отказом от обоих планов', () => {
  const s = baseFor(); s.checkpoint = 4;
  s.vars['base.c3_farm.shortDays'] = 1;
  expect(resolveJoint(c, s, 'c3_midday5', { A: 'exchange', B: 'relieve' }).applied).toEqual(['exchange']);
});


it('ранний переход к ночлегу двигает часы и открывает само место', () => {
  const s = baseFor(); const before = s.chars.A.time;
  play(c, s, 'A', ['c5_sleep']);
  expect(s.chars.A.time).toBeGreaterThan(before);
  expect(s.chars.A.scene).toBe('c5_farm');
  const time = s.chars.A.time;
  play(c, s, 'A', ['c5_sleep']);
  expect(s.chars.A.time).toBeGreaterThan(time);
});


// Старая сцена разговора с Керемом (c7_kerem) заменена хабом farm7; уход без нажатия проверяет тест «Керем уходит без нажатия эпизода».

it('участок 5: мокрая одежда в кухне сохнет, ночлег не превращается в улицу', () => {
  const s = baseFor();
  s.chars.B.body.wet = 1;
  enterScene({ s, c, pid: 'B' }, 'c5_farm');
  let min = 40;
  for (let i = 0; i < 8; i++) {
    play(c, s, 'B', ['c5_wait']);
    min = Math.min(min, s.chars.B.body.coreTemp);
  }
  expect(min).toBeGreaterThanOrEqual(36);
  expect(s.chars.B.body.wet ?? 0).toBeLessThan(1);
  expect(s.chars.B.body.consciousness).not.toBe('unconscious');
  for (const place of ['c5_well', 'c5_gate']) {
    enterScene({ s, c, pid: 'B' }, place);
    expect(ids(s, 'B')).not.toContain('u:sleep');
    expect(ids(s, 'B')).not.toContain('c5_sleep');
  }
});

it('участок 5: ночью на хуторе нет дневных работ и разговоров', () => {
  const s = baseFor(); s.chars.A.time = at(12, 2);
  enterScene({ s, c, pid: 'A' }, 'c5_farm');
  const story = availableActions({ s, c, pid: 'A' }).filter(a => !a.universal).map(a => a.def.id);
  expect(story.sort()).toEqual(['c5_partner', 'c5_sleep', 'c5_wait']);
});

it('участок 5: завтрак расходует существующий запас один раз', () => {
  const s = baseFor(); s.chars.A.time = at(12, 6, 10);
  enterScene({ s, c, pid: 'A' }, 'c5_farm');
  const oats = () => Object.values(s.items).filter(i => i.type === 'oats').reduce((n, i) => n + i.qty, 0);
  const before = oats();
  expect(ids(s, 'A')).toContain('c5_breakfast'); play(c, s, 'A', ['c5_breakfast']);
  expect(oats()).toBeCloseTo(before - 0.25);
  expect(ids(s, 'A')).not.toContain('c5_breakfast');
});

it('участок 5: здоровый Окафор не признаётся в укусе, отсутствующего заменяет другая просьба', () => {
  const s = baseFor(['b_flat', 'b_flat', true]); s.chars.B.time = at(12, 8);
  s.npcs.okafor.alive = true; s.npcs.okafor.location = 'b_okafor'; s.npcs.okafor.status = 'ok';
  delete s.npcs.okafor.vars.bitten;
  enterScene({ s, c, pid: 'B' }, 'c5_okafor');
  expect(ids(s, 'B')).not.toContain('c5_okafor_voice');
  expect(ids(s, 'B')).toContain('c5_okafor_healthy');
  s.npcs.okafor.alive = false;
  enterScene({ s, c, pid: 'B' }, 'c5_bflat');
  expect(ids(s, 'B')).not.toContain('c5_knock_approach');
  expect(ids(s, 'B')).toContain('c5_cans_approach');
});

it('участок 5: обмен во дворе тратит свою еду, бесплатный выход сохраняет потерю велосипеда', () => {
  const s = baseFor(['b_flat', 'b_flat', true]); s.chars.B.time = at(12, 11);
  enterScene({ s, c, pid: 'B' }, 'c5_yard');
  const food = Object.values(s.items).find(i => i.type === 'oats')!;
  food.at = { kind: 'char', id: 'B' }; food.qty = 2;
  play(c, s, 'B', ['c5_yard_talk']);
  expect(food.qty).toBe(1);
  expect(s.vars['B.c5_yard.result']).toBe('talk');
  expect(s.chars.B.location).toBe('b_flat');
});


it('участок 5: работа над засовом действительно двигает время и проект', () => {
  const s = baseFor(['b_flat', 'b_flat', true]); s.chars.B.time = at(12, 9);
  enterScene({ s, c, pid: 'B' }, 'c5_bflat');
  const before = s.chars.B.time;
  play(c, s, 'B', ['c5_shutters']);
  expect(s.chars.B.time).toBeGreaterThan(before);
  expect(Number(s.vars['proj.c3_shutters_b.progress'])).toBeGreaterThan(0);
});

it('участок 5: перед разговором на КТ возвращаемся с площадки домой', () => {
  const s = baseFor(['b_flat', 'b_flat', true]); s.chars.B.time = at(12, 13);
  enterScene({ s, c, pid: 'B' }, 'c5_landing_B');
  play(c, s, 'B', ['c5_go']);
  expect(s.chars.B.scene).toBe('c5_cp');
  expect(s.chars.B.location).toBe('b_flat');
  expect(optionsFor(c, s, c.joint.c3_midday5, 'B').map(o => o.id)).toContain('water');
});

it('часть 1: неудача у ворота травмирует руку и не объявляет цепь безопасной', () => {
  let failures = 0;
  for (let i = 0; i < 20; i++) {
    const s = baseFor(undefined, `chain-review4:${i}`); s.chars.A.time = at(12, 8);
    enterScene({ s, c, pid: 'A' }, 'c5_spilled');
    play(c, s, 'A', ['c5_spilled_chain']);
    if (!s.vars['A.c5_chain_failed']) continue;
    failures++;
    expect(s.vars['w.c3_chain_safe']).not.toBe(true);
    expect(evalCond({ s, c, pid: 'A' }, { injured: 'bruise', site: 'hands' })).toBe(true);
    expect(s.chars.A.scene).toBe('c5_farm');
  }
  expect(failures).toBeGreaterThan(0);
});

it('часть 1: безопасная помощь с водой закрывает обе альтернативы', () => {
  const s = baseFor(); s.chars.A.time = at(12, 8);
  enterScene({ s, c, pid: 'A' }, 'c5_well');
  play(c, s, 'A', ['c5_water_together']);
  expect(ids(s, 'A')).not.toContain('c5_water');
  expect(ids(s, 'A')).not.toContain('c5_water_together');
  expect(evalCond({ s, c, pid: 'A' }, { injured: 'sprain' })).toBe(false);
});
