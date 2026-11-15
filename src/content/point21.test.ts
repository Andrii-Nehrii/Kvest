import { describe, expect, it } from 'vitest';
import { completeCheckpoint, mergeNotes, mergeSegments, syncClocks } from '../engine/checkpoint';
import { applyEffects } from '../engine/effects';
import { segmentFinished } from '../engine/game';
import { evalCond } from '../engine/conditions';
import { canAct } from '../engine/body';
import type { GameState, PlayerId } from '../engine/types';
import { P, acts, after8, car, leg, mergeCp, qty } from '../test/arc9kit';
import { canon21, point21Available, stageC, stageF, stageL, stageR } from './chapter3/point21';
import { content as c } from './index';

// Линия настоящей пары до КТ18 включительно (ответы — канон), дальше все исходы КТ19–КТ20.
const both = (x: Record<string, string>, y: Record<string, string> = x) => ({ A: x, B: y });
function after18(): GameState {
  const b8 = after8('home');
  const s9 = mergeCp(b8, 9, leg(b8, 'A'), leg(b8, 'B'));
  const b9 = completeCheckpoint(c, s9, both({ c3_new_jens9: 'keep', c3_new_search9b: 'stay' }, { c3_new_jens9: 'keep', c3_new_search9a: 'stay' })).state;
  const s10 = mergeCp(b9, 10, leg(b9, 'A'), leg(b9, 'B'));
  const b10 = completeCheckpoint(c, s10, both({ c3_new_ole10: 'door', c3_new_nina10: 'barn' })).state;
  const s11 = mergeCp(b10, 11, leg(b10, 'A'), leg(b10, 'B'));
  const b11 = completeCheckpoint(c, s11, both({ c3_new_report11: 'report', c3_new_home11: 'stay' })).state;
  const s12 = mergeCp(b11, 12, leg(b11, 'A'), leg(b11, 'B'));
  const b12 = completeCheckpoint(c, s12, both({ c3_new_guests12: 'split', c3_new_promise12a: 'promise' }, { c3_new_guests12: 'split', c3_new_promise12b: 'promise' })).state;
  const s13 = mergeCp(b12, 13, leg(b12, 'A'), leg(b12, 'B'));
  const b13 = completeCheckpoint(c, s13, both({ c3_new_leo13: 'drive', c3_new_road13: 'walk' })).state;
  const s14 = mergeCp(b13, 14, leg(b13, 'A'), leg(b13, 'B'));
  const b14 = completeCheckpoint(c, s14, both({ c3_new_jens14: 'give', c3_new_nina14: 'house' })).state;
  const s15 = mergeCp(b14, 15, leg(b14, 'A'), leg(b14, 'B'));
  const b15 = completeCheckpoint(c, s15, both({ c3_new_nina15: 'stay', c3_new_garden15: 'help' })).state;
  const s16 = mergeCp(b15, 16, leg(b15, 'A'), leg(b15, 'B'));
  const b16 = completeCheckpoint(c, s16, both({ c3_new_albers16: 'take', c3_new_sweep16: 'warn' })).state;
  const s17 = mergeCp(b16, 17, leg(b16, 'A'), leg(b16, 'B'));
  const b17 = completeCheckpoint(c, s17, both({ c3_new_colony17: 'stand', c3_new_nina17: 'with' })).state;
  const s18 = mergeCp(b17, 18, leg(b17, 'A', { c18_s_gate: 'c18_s1_door', c18_s_after: 'c18_s3_leave' }), leg(b17, 'B', { c18_b_dawn: 'c18_bw_stay' }));
  return completeCheckpoint(c, s18, both({ c3_new_friday18: 'write', c3_new_house18: 'known' })).state;
}
const b18 = after18();
const s19 = mergeCp(b18, 19, leg(b18, 'A'), leg(b18, 'B'));
const after19 = (trip: 'go' | 'stay') => completeCheckpoint(c, structuredClone(s19) as GameState, both({ c3_new_trip19: trip, c3_new_gun19: 'lock' })).state;
const b19 = { go: after19('go'), stay: after19('stay') };
const s20 = { go: mergeCp(b19.go, 20, leg(b19.go, 'A'), leg(b19.go, 'B')), stay: mergeCp(b19.stay, 20, leg(b19.stay, 'A'), leg(b19.stay, 'B')) };
const after20 = (trip: 'go' | 'stay', convoy: string) =>
  completeCheckpoint(c, structuredClone(s20[trip]) as GameState, both({ c3_new_convoy20: convoy, c3_new_ole20: 'his' })).state;

/** Участок 20 с выбыванием pid (как в тяжёлом звене опасной сцены), второй проходит обычно. */
function down20(trip: 'go' | 'stay', pid: PlayerId) {
  const base = b19[trip];
  const hurt = leg(base, pid, {}, trip === 'stay' ? 'c20_f_d_end' : 'c20_g_breach3');
  hurt.vars[`${pid}.c20_d3`] = 'down';
  applyEffects({ s: hurt, c, pid }, [{ injure: 'laceration', site: 'leftLeg', severity: 4, bleeding: 3 }, { body: 'bloodLoss', delta: 58 }]);
  expect(segmentFinished(c, hurt, pid)).toBe('incapacitated');
  const other = pid === 'A' ? 'B' : 'A';
  const s = mergeCp(base, 20, pid === 'A' ? hurt : leg(base, 'A'), pid === 'B' ? hurt : leg(base, 'B'));
  return completeCheckpoint(c, s, { [other]: { c3_new_convoy20: 'go', c3_new_ole20: 'his' } } as unknown as Record<PlayerId, Record<string, string>>).state;
}

const finish = (s: GameState, n = 21) => mergeCp(s, n, leg(s, 'A'), leg(s, 'B'));

describe('участок 21: все исходы КТ20 на линии пары', () => {
  it('канон пары держится: Хенрике в Люнебурге, колонии нет, Нина на хуторе', () => {
    const v = b18.vars;
    expect([v['w.c18_henrike'], v['w.c18_colony'], v['w.c18_ute'], b18.npcs.c7_nina?.location]).toEqual(['stays', 'cleared', 'colony', 'hof_luedemann']);
    for (const p of P) expect(evalCond({ s: b18, c, pid: p }, canon21)).toBe(true);
  });

  const cases = [['stay', 'go', stageC, 'c21_c_site'], ['stay', 'wait', stageF, 'c21_f_dusk'], ['go', 'go', stageC, 'c21_c_site'],
    ['go', 'home', stageF, 'c21_f_dusk'], ['go', 'wait', stageL, 'c21_l_dusk']] as const;
  for (const [trip, convoy, stage, first] of cases)
    it(`КТ19 ${trip}, КТ20 ${convoy}: точка проходится обоими, миры сходятся у одного утра`, () => {
      const b20 = after20(trip, convoy);
      const fuelOk = evalCond({ s: b20, c, pid: 'A' }, stage);
      for (const p of P) { expect(b20.chars[p].scene).toBe('c21_start'); expect(evalCond({ s: b20, c, pid: p }, point21Available), p).toBe(true); }
      if (!fuelOk) return; // бензина не хватило — пара осталась на месте, это проверяют другие случаи
      const a = leg(b20, 'A'), b = leg(b20, 'B');
      expect(a.chars.A.visited[first]).toBe(1); expect(b.chars.B.visited[first]).toBe(1);
      for (const s of [a, b]) for (const id of ['c21_lea', 'c21_malte']) expect(s.npcs[id]?.location, id).toBe('hof_luedemann');
      const s21 = mergeCp(b20, 21, a, b);
      expect(s21.chars.A.time).toBe(s21.chars.B.time);
      for (const p of P) expect(s21.chars[p].location).toBe('hof_luedemann');
      for (const p of P) expect(canAct(s21.chars[p].body), p).toBe(true);
      const out = completeCheckpoint(c, s21, both({ c3_new_lea21: 'hide', c3_new_bag21: 'keep' })).state;
      expect(out.vars['w.c21_lea']).toBe('hide'); expect(out.vars['w.c21_bag']).toBe('keep');
      expect(qty(out, 'c21_plasma', 'place', 'c3_farm_stock')).toBe(4); expect(qty(out, 'c21_insulin', 'place', 'c3_farm_stock')).toBe(10);
      for (const p of P) expect(out.chars[p].scene).toBe('c22_start');
    });

  it('КТ21: разные ответы — спрашивают её саму; сумка ждёт', () => {
    const s21 = finish(after20('stay', 'wait'));
    const out = completeCheckpoint(c, s21, both({ c3_new_lea21: 'tobias', c3_new_bag21: 'point' }, { c3_new_lea21: 'hide', c3_new_bag21: 'lueneburg' })).state;
    expect(out.vars['w.c21_lea']).toBe('ask'); expect(out.vars['w.c21_bag']).toBe('wait');
    for (const [lea, bag] of [['tobias', 'lueneburg'], ['brandt', 'point']] as const) {
      const same = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: lea, c3_new_bag21: bag })).state;
      expect(same.vars['w.c21_lea']).toBe(lea); expect(same.vars['w.c21_bag']).toBe(bag); 
    }
  });

  for (const [trip, pid] of [['stay', 'A'], ['stay', 'B'], ['go', 'A'], ['go', 'B']] as const)
    it(`выбыл ${pid} (${trip === 'stay' ? 'на хуторе' : 'в Люнебурге'}): второй спасает, к утру оба на ногах`, () => {
      const b20 = down20(trip, pid);
      const rescuer = pid === 'A' ? 'B' : 'A';
      expect(b20.chars[pid].controlledBy).toBe(rescuer);
      expect(evalCond({ s: b20, c, pid: rescuer }, trip === 'stay' ? stageR : stageL)).toBe(true);
      // Каждый путь спасения: первым выбором, через пункт, плохой путь, отказ от плазмы.
      const routes: Record<string, string>[] = trip === 'stay'
        ? [{}, { c21_r_plan: 'c21_rp_point' }, { c21_r_plan: 'c21_rp_lue', c21_r_road: 'c21_rr_field' }, { c21_r_plan: 'c21_rp_stay', c21_r_plasma: 'c21_rq_no' },
          { c21_r_bed: 'c21_rb_help', c21_r_plan: 'c21_rp_stay', c21_r_warm: 'c21_rw_yard', c21_r_plasma: 'c21_rq_no', c21_r_night: 'c21_rn_alarm' }]
        : [{}, { c21_l_n_table: 'c21_ln_none' }, { c21_l_n_table: 'c21_ln_hands' }, { c21_l_n_table: 'c21_ln_none', c21_l_n_bed: 'c21_lk_ole' }];
      for (const forced of routes) {
        const plan = forced.c21_r_plan;
        if (plan && !acts(leg(b20, rescuer, {}, 'c21_r_plan'), rescuer).some(a => a.enabled && a.def.id === plan)) continue;
        const r = leg(b20, rescuer, forced);
        expect(r.chars[rescuer].location, JSON.stringify(forced)).toBe('hof_luedemann');
        expect(r.chars[pid].location, JSON.stringify(forced)).toBe('hof_luedemann');
        expect(r.chars[pid].body.consciousness, JSON.stringify(forced)).not.toBe('dead');
        const s21 = mergeSegments(c, b20, { [rescuer]: r });
        syncClocks(c, s21, c.checkpoints.find(x => x.index === 21)!.syncNotBefore); mergeNotes(c, s21, 21);
        const out = completeCheckpoint(c, s21, { A: { c3_new_lea21: 'hide', c3_new_bag21: 'keep' }, B: { c3_new_lea21: 'hide', c3_new_bag21: 'keep' } }).state;
        if (process.env.KVEST_DEBUG) console.log(trip, pid, JSON.stringify(forced), out.chars[pid].body.bloodLoss, out.chars[pid].body.consciousness, r.chars[pid].body.consciousness);
        expect(canAct(out.chars[pid].body), `${JSON.stringify(forced)} blood=${out.chars[pid].body.bloodLoss}`).toBe(true);
        for (const p of P) { expect(out.chars[p].controlledBy).toBe(p); expect(out.chars[p].scene).toBe('c22_start'); }
      }
    });

  it('без ключей у себя спасающий берёт их из кармана выбывшего', () => {
    const b20 = down20('stay', 'A');
    const keysA = qty(b20, 'car_keys', 'char', 'A');
    if (!keysA) return;
    const r = leg(b20, 'B', { c21_r_plan: 'c21_rp_point' });
    expect(qty(r, 'car_keys', 'char', 'B')).toBeGreaterThan(0);
    expect(car(r).at).toEqual({ kind: 'place', id: 'hof_luedemann' });
  });
});

describe('участок 22: все ответы КТ21, каждый решает за другого', () => {
  // Синтетические участки выбирают только сюжетные действия и не пьют: перед точкой даём телам обычное состояние.
  const s21 = finish(after20('stay', 'wait'));
  for (const p of P) Object.assign(s21.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 });
  const leaAt = { tobias: 'c18_lueneburg', brandt: 'c16_jesteburg', hide: 'hof_luedemann' } as Record<string, string>;
  for (const lea of ['hide', 'tobias', 'brandt', 'ask'])
    for (const bag of ['lueneburg', 'point', 'keep', 'wait'])
      it(`КТ21 ${lea}/${bag}: обе линии проходятся, миры сходятся, ответы — за партнёра`, () => {
        const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: lea, c3_new_bag21: bag })).state;
        for (const p of P) expect(b21.chars[p].scene).toBe('c22_start');
        const plasma = qty(b21, 'c21_plasma', 'place', 'c3_farm_stock');
        const a = leg(b21, 'A'), b = leg(b21, 'B');
        for (const s of [a, b]) {
          if (lea !== 'ask') expect(s.npcs.c21_lea.location).toBe(leaAt[lea]);
        }
        expect(a.npcs.c21_lea.location).toBe(b.npcs.c21_lea.location);
        const s22 = mergeCp(b21, 22, a, b);
        expect(s22.chars.A.time).toBe(s22.chars.B.time);
        for (const p of P) { expect(s22.chars[p].location).toBe('hof_luedemann'); expect(canAct(s22.chars[p].body)).toBe(true); }
        const left = qty(s22, 'c21_plasma', 'place', 'c3_farm_stock');
        expect(left).toBe(bag === 'wait' ? plasma : 0);
        expect(qty(s22, 'c21_insulin', 'place', 'c3_farm_stock')).toBe(bag === 'keep' || bag === 'wait' ? 10 : 0);
        // A не участвует в вопросе про Тобиаса, B — в письме: ответы друг за друга.
        const out = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'truth', c3_new_tobias22: 'release' }, B: { c3_new_tobias22: 'truth', c3_new_letter22: 'hold' } }).state;
        expect(out.vars['w.c22_tobias']).toBe('truth'); expect(out.vars['w.c22_letter']).toBe('truth');
        for (const p of P) expect(out.chars[p].scene).toBe('c23_start');
      });

  it('половины правды: A узнаёт про ноль, B — что она не болела; партнёр видит столько, сколько рассказали', () => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: 'hide', c3_new_bag21: 'wait' })).state;
    const a = leg(b21, 'A', { c22_evening: 'c22_ev_all' }), b = leg(b21, 'B', { c22_evening: 'c22_ev_keep' });
    expect(a.vars['A.c22_a_truth']).toBe(true); expect(b.vars['B.c22_b_truth']).toBe(true);
    expect(a.vars['B.c22_b_truth']).toBeUndefined(); expect(b.vars['A.c22_a_truth']).toBeUndefined();
    const s22 = mergeCp(b21, 22, a, b);
    const seen = (pid: PlayerId) => s22.log.filter(e => e.pid === pid && e.kind === 'checkpoint').map(e => e.text).join('\n');
    expect(seen('B')).toMatch(/Выздоровели: 0/); expect(seen('A')).not.toMatch(/лептоспироз/); expect(seen('A')).toMatch(/сегодня что-то узнала и молчит/);
  });
});

describe('участок 23: все ответы КТ22, люди из прошлого', () => {
  const s21 = finish(after20('stay', 'wait'));
  for (const p of P) Object.assign(s21.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 });
  const after22 = (lea: string, tobias: string, letter: string, a22: Record<string, string> = {}) => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: lea, c3_new_bag21: 'wait' })).state;
    const s22 = mergeCp(b21, 22, leg(b21, 'A', a22), leg(b21, 'B'));
    for (const p of P) Object.assign(s22.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined });
    return completeCheckpoint(c, s22, { A: { c3_new_letter22: letter }, B: { c3_new_tobias22: tobias } }).state;
  };
  for (const lea of ['hide', 'tobias', 'brandt'])
    for (const tobias of ['truth', 'silent', 'release'])
      it(`КТ21 ${lea}, Тобиасу ${tobias}: точка 23 проходится, гости приходят, миры сходятся`, () => {
        const b22 = after22(lea, tobias, 'home');
        for (const p of P) expect(b22.chars[p].scene).toBe('c23_start');
        const a = leg(b22, 'A'), b = leg(b22, 'B');
        expect(a.vars['w.c23_tobias_told']).toBe(tobias);
        if (lea === 'tobias' && tobias === 'truth') expect(a.vars['w.c23_lea_exposed']).toBe(true);
        for (const s of [a, b]) for (const id of ['c12_marcus', 'c12_leo']) if (s.npcs[id]?.alive) expect(s.npcs[id].location).toBe('hof_luedemann');
        const s23 = mergeCp(b22, 23, a, b);
        expect(s23.chars.A.time).toBe(s23.chars.B.time);
        for (const p of P) { expect(s23.chars[p].location).toBe('hof_luedemann'); expect(canAct(s23.chars[p].body)).toBe(true); }
        const guests = s23.npcs.c12_marcus?.alive ? 'shed' : 'on';
        const out = completeCheckpoint(c, s23, both({ c3_new_guests23: guests, c3_new_monday23: 'hide' })).state;
        expect(out.vars['w.c23_guests']).toBe(guests); expect(out.vars['w.c23_monday']).toBe('hide');
        if (guests === 'shed') expect(out.npcs.c12_marcus.location).toBe('c3_farm_shed');
        for (const p of P) expect(out.chars[p].scene).toBe('c24_start');
      });

  it('обещанная прогулка с Ниной: A идёт к двенадцатому участку', () => {
    const b22 = after22('hide', 'silent', 'home', { c22_a_nina: 'c22_an_sunday' });
    if (b22.vars['w.c22_cap_walk'] !== 'sunday') return; // кепки нет на этой линии
    const a = leg(b22, 'A');
    expect(a.chars.A.visited.c23_a_cap).toBe(1);
  });
});

describe('участок 24: обход Брандта по всем ответам КТ23, находка A', () => {
  const s21 = finish(after20('stay', 'wait'));
  for (const p of P) Object.assign(s21.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 });
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  const after23 = (lea: string, guests: string, monday: string, a23: Record<string, string> = {}) => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: lea, c3_new_bag21: 'wait' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'home' }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A', a23), leg(b22, 'B')));
    return completeCheckpoint(c, s23, both({ c3_new_guests23: guests, c3_new_monday23: monday })).state;
  };
  for (const lea of ['hide', 'brandt'])
    for (const guests of ['in', 'shed', 'on'])
      for (const monday of ['open', 'hide', 'shut'])
        it(`КТ21 ${lea}, гости ${guests}, понедельник ${monday}: обход виден обоим одинаково, миры сходятся`, () => {
          const b23 = after23(lea, guests, monday);
          for (const p of P) expect(b23.chars[p].scene).toBe('c24_start');
          const a = leg(b23, 'A'), b = leg(b23, 'B');
          expect(a.vars['w.c24_lea']).toBe(b.vars['w.c24_lea']); expect(a.vars['w.c24_marcus']).toBe(b.vars['w.c24_marcus']);
          if (monday === 'shut') expect(a.vars['w.c24_ration']).toBe('half');
          if (guests === 'shed' && monday !== 'shut') expect(a.vars['w.c24_marcus']).toBe('taken');
          const s24 = mergeCp(b23, 24, a, b);
          expect(s24.chars.A.time).toBe(s24.chars.B.time);
          for (const p of P) { expect(s24.chars[p].location).toBe('hof_luedemann'); expect(canAct(s24.chars[p].body)).toBe(true); }
          const out = completeCheckpoint(c, s24, { A: { c3_new_duty24: 'a', c3_new_tuesday24: 'come' }, B: { c3_new_duty24: 'b', c3_new_tuesday24: 'truth' } }).state;
          expect(out.vars['w.c24_duty']).toBe('b'); expect(out.vars['w.c24_message']).toBe('stay');
          for (const p of P) expect(out.chars[p].scene).toBe('c25_start');
        });

  it('шкаф Оле: ASTA открывает; неверное слово — ещё попытка; колун — бинокль разбит', () => {
    const b23 = after23('hide', 'in', 'hide');
    const open = leg(b23, 'A', { c24_a_room: 'c24_ar_asta' });
    expect(qty(open, 'c24_binoculars', 'char', 'A')).toBe(1); expect(open.vars['w.c24_ole_cabinet']).toBe('open');
    const retry = leg(b23, 'A', { c24_a_room: 'c24_ar_nina', c24_a_lock2: 'c24_al_asta' });
    expect(qty(retry, 'c24_binoculars', 'char', 'A')).toBe(1);
    const broke = leg(b23, 'A', { c24_a_room: 'c24_ar_break' });
    expect(qty(broke, 'c24_binoculars')).toBe(0); expect(qty(broke, 'c24_korn', 'char', 'A')).toBe(1);
    const left = leg(b23, 'A', { c24_a_room: 'c24_ar_leave' });
    expect(left.vars['w.c24_ole_cabinet']).toBeUndefined();
  });
});

describe('участок 25: порознь — Люнебург и хутор, по ответам КТ22–24', () => {
  const s21 = finish(after20('stay', 'wait'));
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  fresh(s21);
  const after24 = (lea: string, letter: string, message: string, guests = 'in', monday = 'hide') => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: lea, c3_new_bag21: 'keep' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: letter }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A'), leg(b22, 'B')));
    const b23 = completeCheckpoint(c, s23, both({ c3_new_guests23: guests, c3_new_monday23: monday })).state;
    const s24 = fresh(mergeCp(b23, 24, leg(b23, 'A'), leg(b23, 'B')));
    return completeCheckpoint(c, s24, both({ c3_new_duty24: 'b', c3_new_tuesday24: message })).state;
  };
  for (const [lea, letter, message, state] of [['hide', 'truth', 'come', 'stopped'], ['tobias', 'home', 'truth', 'relieved'], ['brandt', 'hold', 'stay', 'collapsed'], ['hide', 'home', 'come', 'collapsed']] as const)
    it(`КТ21 ${lea}, письмо ${letter}, Оле — ${message}: A в Люнебурге, B дома, оба к вечеру на хуторе`, () => {
      const b24 = after24(lea, letter, message);
      for (const p of P) expect(b24.chars[p].scene).toBe('c25_start');
      const a = leg(b24, 'A'), b = leg(b24, 'B');
      expect(a.vars['w.c25_ole_state']).toBe(state); expect(b.vars['w.c25_ole_state']).toBe(state);
      expect(a.chars.A.visited.c25_a_ole).toBe(1); expect(b.chars.B.visited.c25_a_ole).toBeUndefined();
      const s25 = mergeCp(b24, 25, a, b);
      expect(s25.chars.A.time).toBe(s25.chars.B.time);
      for (const p of P) { expect(s25.chars[p].location).toBe('hof_luedemann'); expect(canAct(s25.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s25, { A: { c3_new_ole25: 'now', c3_new_truth25: 'brandt' }, B: { c3_new_ole25: 'his', c3_new_truth25: 'brandt' } }).state;
      expect(out.vars['w.c25_ole']).toBe('fetch'); expect(out.vars['w.c25_truth']).toBe('brandt');
      for (const p of P) expect(out.chars[p].scene).toBe('c26_start');
    });
});

describe('участок 26: среда — еда, машина, Брандт', () => {
  const s21 = finish(after20('stay', 'wait'));
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  fresh(s21);
  const after25 = (duty: string, ole: string, truth: string) => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: 'hide', c3_new_bag21: 'wait' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'home' }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A'), leg(b22, 'B')));
    const b23 = completeCheckpoint(c, s23, both({ c3_new_guests23: 'in', c3_new_monday23: 'shut' })).state;
    const s24 = fresh(mergeCp(b23, 24, leg(b23, 'A'), leg(b23, 'B')));
    const b24 = completeCheckpoint(c, s24, both({ c3_new_duty24: duty, c3_new_tuesday24: 'stay' })).state;
    const s25 = fresh(mergeCp(b24, 25, leg(b24, 'A'), leg(b24, 'B')));
    return completeCheckpoint(c, s25, both({ c3_new_ole25: ole, c3_new_truth25: truth })).state;
  };
  for (const [duty, ole, truth] of [['b', 'now', 'brandt'], ['a', 'fetch', 'all'], ['none', 'his', 'none'], ['b', 'fetch', 'none']] as const)
    it(`смена ${duty}, Оле ${ole}, правда ${truth}: обе линии проходятся, миры сходятся`, () => {
      const b25 = after25(duty, ole, truth);
      for (const p of P) expect(b25.chars[p].scene).toBe('c26_start');
      const a = leg(b25, 'A'), b = leg(b25, 'B');
      expect(a.vars['w.c26_brandt']).toBe(b.vars['w.c26_brandt']); expect(a.vars['w.c26_car']).toBe(b.vars['w.c26_car']);
      if (truth === 'none') expect(a.vars['w.c26_brandt']).toBeUndefined();
      if (ole === 'now') for (const s of [a, b]) expect(s.npcs.ole.location).toBe('hof_luedemann');
      const s26 = mergeCp(b25, 26, a, b);
      expect(s26.chars.A.time).toBe(s26.chars.B.time);
      for (const p of P) { expect(s26.chars[p].location).toBe('hof_luedemann'); expect(canAct(s26.chars[p].body)).toBe(true); }
      if (s26.vars['w.c18_a_held']) expect(car(s26).at).toEqual({ kind: 'place', id: 'c16_jesteburg' });
      const out = completeCheckpoint(c, s26, { A: { c3_new_meet26: 'go', c3_new_seed26: 'half' }, B: { c3_new_meet26: 'door', c3_new_seed26: 'half' } }).state;
      expect(out.vars['w.c26_plan']).toBe('ready'); expect(out.vars['w.c26_seed']).toBe('half');
      for (const p of P) expect(out.chars[p].scene).toBe('c27_start');
    });
});

describe('участок 27: Кася и Тим, каждый решает за другого', () => {
  const s21 = finish(after20('stay', 'wait'));
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  fresh(s21);
  const after26 = (plan: string, truth: string) => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: 'hide', c3_new_bag21: 'keep' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'home' }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A'), leg(b22, 'B')));
    const b23 = completeCheckpoint(c, s23, both({ c3_new_guests23: 'in', c3_new_monday23: 'hide' })).state;
    const s24 = fresh(mergeCp(b23, 24, leg(b23, 'A'), leg(b23, 'B')));
    const b24 = completeCheckpoint(c, s24, both({ c3_new_duty24: 'b', c3_new_tuesday24: 'stay' })).state;
    const s25 = fresh(mergeCp(b24, 25, leg(b24, 'A'), leg(b24, 'B')));
    const b25 = completeCheckpoint(c, s25, both({ c3_new_ole25: 'his', c3_new_truth25: truth })).state;
    const s26 = fresh(mergeCp(b25, 26, leg(b25, 'A'), leg(b25, 'B')));
    const b26 = completeCheckpoint(c, s26, both({ c3_new_meet26: plan, c3_new_seed26: 'keep' })).state;
    // Новаки уехали на восток в первые дни — как у настоящей пары.
    b26.vars['w.nowaks_gone'] = true; if (b26.npcs.kasia) b26.npcs.kasia.alive = true;
    return b26;
  };
  for (const [plan, truth] of [['ready', 'none'], ['door', 'brandt'], ['go', 'all']] as const)
    it(`план ${plan}, правда ${truth}: обе линии, находка, ответы друг за друга`, () => {
      const b26 = after26(plan, truth);
      for (const p of P) expect(b26.chars[p].scene).toBe('c27_start');
      const a = leg(b26, 'A'), b = leg(b26, 'B', { c27_b_box: 'c27_bx_kulka' });
      expect(a.vars['w.c27_bed']).toBe(b.vars['w.c27_bed']); expect(b.vars['w.c27_box']).toBe('open');
      expect(qty(b, 'c27_photo', 'char', 'B')).toBe(1);
      const s27 = mergeCp(b26, 27, a, b);
      expect(s27.chars.A.time).toBe(s27.chars.B.time);
      for (const p of P) { expect(s27.chars[p].location).toBe('hof_luedemann'); expect(canAct(s27.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s27, { A: { c3_new_tim27: 'colony', c3_new_patrol27: 'none' }, B: { c3_new_tim27: 'ward', c3_new_patrol27: 'tobias' } }).state;
      expect(out.vars['w.c27_tim']).toBe('colony'); expect(out.vars['w.c27_patrol']).toBe('tobias');
      for (const p of P) expect(out.chars[p].scene).toBe('c28_start');
    });
});
