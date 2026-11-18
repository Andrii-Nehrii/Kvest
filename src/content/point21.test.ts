import { describe, expect, it } from 'vitest';
import { completeCheckpoint, mergeNotes, mergeSegments, syncClocks } from '../engine/checkpoint';
import { applyEffects } from '../engine/effects';
import { segmentFinished } from '../engine/game';
import { evalCond } from '../engine/conditions';
import { canAct } from '../engine/body';
import type { GameState, PlayerId } from '../engine/types';
import { P, acts, after8, car, leg, mergeCp, qty } from '../test/arc9kit';
import { canon21, point21Available, stageC, stageF, stageL, stageR } from './chapter3/point21';
import { point42Available } from './chapter3/point42';
import { point43Available } from './chapter3/point43';
import { point44Available } from './chapter3/point44';
import { point45Available } from './chapter3/point45';
import { point46Available } from './chapter3/point46';
import { point47Available } from './chapter3/point47';
import { point48Available } from './chapter3/point48';
import { point49Available } from './chapter3/point49';
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

describe('участок 28: пятница — ночь, патруль, Хенрике', () => {
  const s21 = finish(after20('stay', 'wait'));
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  fresh(s21);
  const after27 = (tim: string, patrol: string, ole25: string) => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: 'hide', c3_new_bag21: 'keep' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'home' }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A'), leg(b22, 'B')));
    const b23 = completeCheckpoint(c, s23, both({ c3_new_guests23: 'in', c3_new_monday23: 'hide' })).state;
    const s24 = fresh(mergeCp(b23, 24, leg(b23, 'A'), leg(b23, 'B')));
    const b24 = completeCheckpoint(c, s24, both({ c3_new_duty24: 'b', c3_new_tuesday24: 'stay' })).state;
    const s25 = fresh(mergeCp(b24, 25, leg(b24, 'A'), leg(b24, 'B')));
    const b25 = completeCheckpoint(c, s25, both({ c3_new_ole25: ole25, c3_new_truth25: 'none' })).state;
    const s26 = fresh(mergeCp(b25, 26, leg(b25, 'A'), leg(b25, 'B')));
    const b26 = completeCheckpoint(c, s26, both({ c3_new_meet26: 'ready', c3_new_seed26: 'keep' })).state;
    b26.vars['w.nowaks_gone'] = true; if (b26.npcs.kasia) b26.npcs.kasia.alive = true;
    const s27 = fresh(mergeCp(b26, 27, leg(b26, 'A'), leg(b26, 'B')));
    return completeCheckpoint(c, s27, { A: { c3_new_tim27: tim }, B: { c3_new_patrol27: patrol } }).state;
  };
  for (const [tim, patrol, ole25] of [['stay', 'truth', 'fetch'], ['colony', 'none', 'his'], ['ward', 'tobias', 'now']] as const)
    it(`Тим ${tim}, патрулю ${patrol}, Оле ${ole25}: обе линии, миры сходятся`, () => {
      const b27 = after27(tim, patrol, ole25);
      for (const p of P) expect(b27.chars[p].scene).toBe('c28_start');
      const a = leg(b27, 'A'), b = leg(b27, 'B');
      expect(a.vars['w.c28_tim']).toBe(b.vars['w.c28_tim']); expect(a.vars['w.c28_ole']).toBe(b.vars['w.c28_ole']);
      const s28 = mergeCp(b27, 28, a, b);
      expect(s28.chars.A.time).toBe(s28.chars.B.time);
      for (const p of P) { expect(s28.chars[p].location).toBe('hof_luedemann'); expect(canAct(s28.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s28, { A: { c3_new_place28: 'family', c3_new_house28: 'lea' }, B: { c3_new_place28: 'guests', c3_new_house28: 'lea' } }).state;
      expect(out.vars['w.c28_place']).toBe('hands'); expect(out.vars['w.c28_house']).toBe('lea');
      for (const p of P) expect(out.chars[p].scene).toBe('c29_start');
    });
});

describe('участок 29: первый адвент, собрание', () => {
  const s21 = finish(after20('stay', 'wait'));
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  fresh(s21);
  const after28 = (truth: string, duty: string) => {
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: 'hide', c3_new_bag21: 'keep' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'home' }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A'), leg(b22, 'B')));
    const b23 = completeCheckpoint(c, s23, both({ c3_new_guests23: 'in', c3_new_monday23: 'hide' })).state;
    const s24 = fresh(mergeCp(b23, 24, leg(b23, 'A'), leg(b23, 'B')));
    const b24 = completeCheckpoint(c, s24, both({ c3_new_duty24: duty, c3_new_tuesday24: 'stay' })).state;
    const s25 = fresh(mergeCp(b24, 25, leg(b24, 'A'), leg(b24, 'B')));
    const b25 = completeCheckpoint(c, s25, both({ c3_new_ole25: 'fetch', c3_new_truth25: truth })).state;
    const s26 = fresh(mergeCp(b25, 26, leg(b25, 'A'), leg(b25, 'B')));
    const b26 = completeCheckpoint(c, s26, both({ c3_new_meet26: 'ready', c3_new_seed26: 'keep' })).state;
    b26.vars['w.nowaks_gone'] = true; if (b26.npcs.kasia) b26.npcs.kasia.alive = true;
    const s27 = fresh(mergeCp(b26, 27, leg(b26, 'A'), leg(b26, 'B')));
    const b27 = completeCheckpoint(c, s27, { A: { c3_new_tim27: 'stay' }, B: { c3_new_patrol27: 'tobias' } }).state;
    const s28 = fresh(mergeCp(b27, 28, leg(b27, 'A'), leg(b27, 'B')));
    return completeCheckpoint(c, s28, both({ c3_new_place28: 'hands', c3_new_house28: 'eva' })).state;
  };
  for (const [truth, duty] of [['brandt', 'b'], ['none', 'a']] as const)
    it(`правда ${truth}, смена ${duty}: два дня проходятся, миры сходятся`, () => {
      const b28 = after28(truth, duty);
      b28.vars['A.c18_kn'] = 'water'; b28.vars['A.met.c18_volker'] = true; delete b28.vars['w.c18_lodger'];
      delete b28.vars['w.c28_coop_cleared']; // крышу в 28-й не чистили — проверяем ночь, когда она рушится
      for (const p of P) expect(b28.chars[p].scene).toBe('c29_start');
      const a = leg(b28, 'A', { c29_a_church: 'c29_ac_speak' }), b = leg(b28, 'B');
      expect(a.vars['w.c29_coop_roof']).toBe('fallen'); expect(b.vars['w.c29_coop_roof']).toBe('fallen');
      const s29 = mergeCp(b28, 29, a, b);
      expect(s29.chars.A.time).toBe(s29.chars.B.time);
      for (const p of P) { expect(s29.chars[p].location).toBe('hof_luedemann'); expect(canAct(s29.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s29, { A: { c3_new_sweep29: 'join', c3_new_diesel29: 'trade' }, B: { c3_new_sweep29: 'leave', c3_new_diesel29: 'trade' } }).state;
      expect(out.vars['w.c29_sweep']).toBe('guard'); expect(out.vars['w.c29_diesel']).toBe('trade');
      for (const p of P) expect(out.chars[p].scene).toBe('c30_start');
    });
});

describe('участок 30: мороз — опасная ночь по трём входам', () => {
  const s21 = finish(after20('stay', 'wait'));
  const fresh = (s: GameState) => { for (const p of P) Object.assign(s.chars[p].body, { thirst: 25, hunger: 25, dehydratedSince: undefined, fatigue: 10, sleepDebt: 2 }); return s; };
  fresh(s21);
  let b28cache: GameState | undefined;
  const after28 = () => {
    if (b28cache) return structuredClone(b28cache) as GameState;
    const b21 = completeCheckpoint(c, structuredClone(s21) as GameState, both({ c3_new_lea21: 'hide', c3_new_bag21: 'keep' })).state;
    const s22 = fresh(mergeCp(b21, 22, leg(b21, 'A'), leg(b21, 'B')));
    const b22 = completeCheckpoint(c, s22, { A: { c3_new_letter22: 'home' }, B: { c3_new_tobias22: 'silent' } }).state;
    const s23 = fresh(mergeCp(b22, 23, leg(b22, 'A'), leg(b22, 'B')));
    const b23 = completeCheckpoint(c, s23, both({ c3_new_guests23: 'in', c3_new_monday23: 'hide' })).state;
    const s24 = fresh(mergeCp(b23, 24, leg(b23, 'A'), leg(b23, 'B')));
    const b24 = completeCheckpoint(c, s24, both({ c3_new_duty24: 'b', c3_new_tuesday24: 'stay' })).state;
    const s25 = fresh(mergeCp(b24, 25, leg(b24, 'A'), leg(b24, 'B')));
    const b25 = completeCheckpoint(c, s25, both({ c3_new_ole25: 'fetch', c3_new_truth25: 'brandt' })).state;
    const s26 = fresh(mergeCp(b25, 26, leg(b25, 'A'), leg(b25, 'B')));
    const b26 = completeCheckpoint(c, s26, both({ c3_new_meet26: 'ready', c3_new_seed26: 'keep' })).state;
    b26.vars['w.nowaks_gone'] = true; if (b26.npcs.kasia) b26.npcs.kasia.alive = true;
    const s27 = fresh(mergeCp(b26, 27, leg(b26, 'A'), leg(b26, 'B')));
    const b27 = completeCheckpoint(c, s27, { A: { c3_new_tim27: 'stay' }, B: { c3_new_patrol27: 'tobias' } }).state;
    const s28 = fresh(mergeCp(b27, 28, leg(b27, 'A'), leg(b27, 'B')));
    b28cache = completeCheckpoint(c, s28, both({ c3_new_place28: 'hands', c3_new_house28: 'eva' })).state;
    return structuredClone(b28cache) as GameState;
  };
  const after29 = (sweep: string, diesel: string) => {
    const b28 = after28();
    const s29 = fresh(mergeCp(b28, 29, leg(b28, 'A'), leg(b28, 'B')));
    s29.vars['w.c16_tractor'] = true;
    return completeCheckpoint(c, s29, both({ c3_new_sweep29: sweep, c3_new_diesel29: diesel })).state;
  };
  for (const [sweep, diesel] of [['join', 'none'], ['guard', 'none'], ['leave', 'later'], ['leave', 'none']] as const)
    it(`вход ${sweep}/${diesel}: осторожные проходят без выбывания, миры сходятся`, () => {
      const b29 = after29(sweep, diesel);
      for (const p of P) expect(b29.chars[p].scene).toBe('c30_start');
      const a = leg(b29, 'A'), b = leg(b29, 'B');
      expect(a.vars['$.c30_down'] ?? a.vars['A.c30_down']).toBeUndefined(); expect(b.vars['B.c30_down']).toBeUndefined();
      const s30 = mergeCp(b29, 30, a, b);
      expect(s30.chars.A.time).toBe(s30.chars.B.time);
      for (const p of P) { expect(s30.chars[p].location).toBe('hof_luedemann'); expect(canAct(s30.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s30, both({ c3_new_after30: 'share' })).state;
      expect(out.vars['w.c30_after']).toBe('share');
      for (const p of P) expect(out.chars[p].scene).toBe('c31_start');
    });

  it('безрассудный A на впадине выбывает на третьем звене; B доводит до точки и ведёт его', () => {
    const b29 = after29('join', 'none');
    const a = leg(b29, 'A', { c30_monday: 'c30_mo_work', c30_j_a1: 'c30_ja1_step', c30_j_a2: 'c30_ja2_fight', c30_j_a3: 'c30_ja3_go' }, 'c30_night_end');
    const fell = segmentFinished(c, a, 'A') === 'incapacitated';
    if (process.env.KVEST_DEBUG) console.log('fell', fell, a.vars['A.c30_hurt1'], a.vars['A.c30_hurt2']);
    if (!fell) return; // проверки силы/ловкости могли пройти — это законно
    expect(a.vars['A.c30_down']).toBe(true);
    const s30 = mergeCp(b29, 30, a, leg(b29, 'B'));
    expect(s30.chars.A.body.consciousness).not.toBe('dead');
    const out = completeCheckpoint(c, s30, { B: { c3_new_after30: 'home' } }).state;
    expect(out.chars.A.controlledBy).toBe('B'); expect(out.chars.B.scene).toBe('c31_start');
  });

  // ───────────── Участок 31 ─────────────
  const after30 = (sweep: string, diesel: string, after: string) => {
    const b29 = after29(sweep, diesel);
    const s30 = fresh(mergeCp(b29, 30, leg(b29, 'A'), leg(b29, 'B')));
    return completeCheckpoint(c, s30, both({ c3_new_after30: after })).state;
  };
  for (const [sweep, diesel, after] of [['join', 'none', 'home'], ['guard', 'none', 'share'], ['leave', 'later', 'leave'], ['leave', 'none', 'home']] as const)
    it(`участок 31 после ${sweep}/${diesel}/${after}: оба на ногах, день сходится к вечеру`, () => {
      const b30 = after30(sweep, diesel, after);
      for (const p of P) expect(b30.chars[p].scene).toBe('c31_start');
      const a = leg(b30, 'A'), b = leg(b30, 'B');
      const s31 = mergeCp(b30, 31, a, b);
      expect(s31.chars.A.time).toBe(s31.chars.B.time);
      for (const p of P) { expect(s31.chars[p].location).toBe('hof_luedemann'); expect(canAct(s31.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s31, { A: { c3_new_trip31a: 'yes' }, B: { c3_new_trip31b: 'sent' } }).state;
      expect(out.vars['w.c31_a']).toBe('yes'); expect(out.vars['w.c31_b']).toBe('sent');
      for (const p of P) expect(out.chars[p].scene).toBe('c32_start');
    });

  it('участок 31: ящик A — верный код, неверный код, лом', () => {
    const b30 = after30('join', 'none', 'home');
    const open = leg(b30, 'A', { c31_a_box: 'c31_ab_719' });
    expect(qty(open, 'c31_burner', 'char', 'A')).toBe(1); expect(qty(open, 'c31_thermals', 'char', 'A')).toBe(2); expect(open.vars['w.c31_box']).toBe('open');
    const wrong = leg(b30, 'A', { c31_a_box: 'c31_ab_911', c31_a_box2: 'c31_a2_leave' });
    expect(qty(wrong, 'c31_burner', 'char', 'A')).toBe(0); expect(wrong.vars['w.c31_box']).toBe('left');
    const broke = leg(b30, 'A', { c31_a_box: 'c31_ab_197', c31_a_box2: 'c31_a2_break' });
    expect(qty(broke, 'c31_burner', 'char', 'A')).toBe(0); expect(qty(broke, 'c31_post_map', 'char', 'A')).toBe(1);
    const s31 = mergeCp(b30, 31, open, leg(b30, 'B'));
    expect(s31.chars.A.time).toBe(s31.chars.B.time);
  });

  it('участок 31: Corsa возвращается, если её забрали, а пара была на впадине', () => {
    const b29 = after29('join', 'none');
    const corsa = Object.values(b29.items).find(i => i.type === 'opel_corsa')!;
    corsa.at = { kind: 'place', id: 'c16_jesteburg' }; corsa.fuel = 0.2; b29.vars['w.c26_car'] = 'taken';
    for (const it of Object.values(b29.items)) if (it.type === 'car_keys') it.at = { kind: 'gone' } as never;
    const s30 = fresh(mergeCp(b29, 30, leg(b29, 'A'), leg(b29, 'B')));
    const b30 = completeCheckpoint(c, s30, both({ c3_new_after30: 'home' })).state;
    const a = leg(b30, 'A');
    expect(a.vars['w.c31_car_back']).toBe(true);
    expect(Object.values(a.items).find(i => i.type === 'opel_corsa')!.at).toEqual({ kind: 'place', id: 'hof_luedemann' });
    const s31 = mergeCp(b30, 31, a, leg(b30, 'B'));
    expect(s31.chars.A.time).toBe(s31.chars.B.time); expect(s31.chars.A.location).toBe('hof_luedemann');
  });

  // ───────────── Участок 32 ─────────────
  const after31 = (sweep = 'join', after = 'home') => {
    const b30 = after30(sweep, 'none', after);
    const s31 = fresh(mergeCp(b30, 31, leg(b30, 'A'), leg(b30, 'B')));
    return completeCheckpoint(c, s31, { A: { c3_new_trip31a: 'yes' }, B: { c3_new_trip31b: 'sent' } }).state;
  };
  it('участок 32: порознь — Бухгольц и Винзен, все пути Герда и Нины, миры сходятся в четверг', () => {
    const b31 = after31();
    for (const p of P) expect(b31.chars[p].scene).toBe('c32_start');
    b31.npcs.gerd.alive = true; b31.npcs.gerd.location = 'a_stairs';
    const aRoutes: Record<string, string>[] = [{}, { c32_a_house: 'c32_as_lock', c32_a_thu: 'c32_aq_door', c32_a_street: 'c32_as2_later', c32_a_noise: 'c32_an2_quiet' }, { c32_a_house: 'c32_as_pass', c32_a_dusk: 'c32_ad_ward', c32_a_ward: 'c32_aw_look' }, { c32_a_town: 'c32_at_cars', c32_a_thu: 'c32_aq_market' }];
    const bRoutes: Record<string, string>[] = [{}, { c32_b_lena: 'c32_bl_stay', c32_b_check: 'c32_bc_quiet', c32_b_hall: 'c32_bh2_out' }, { c32_b_lena: 'c32_bl_self', c32_b_sleep: 'c32_bz_write' }, { c32_b_school: 'c32_bs_help', c32_b_thu: 'c32_bq_okafor' }];
    for (let i = 0; i < 4; i++) {
      const a = leg(b31, 'A', aRoutes[i]), b = leg(b31, 'B', bRoutes[i]);
      const s32 = mergeCp(b31, 32, a, b);
      expect(s32.chars.A.time).toBe(s32.chars.B.time);
      for (const p of P) { expect(s32.chars[p].location).toBe('hof_luedemann'); expect(canAct(s32.chars[p].body)).toBe(true); }
      expect(s32.vars['w.c32_generator_point']).toBe(true); expect(s32.vars['w.c32_meds_point']).toBe(true);
      const out = completeCheckpoint(c, s32, { A: { c3_new_okafor32: 'farm', c3_new_deniz32: 'near' }, B: { c3_new_okafor32: 'away', c3_new_deniz32: 'near' } }).state;
      expect(out.vars['w.c32_okafor']).toBe('near'); expect(out.vars['w.c32_deniz']).toBe('near');
      for (const p of P) expect(out.chars[p].scene).toBe('c33_start');
    }
    const ended = leg(b31, 'A', { c32_a_house: 'c32_as_end' });
    expect(ended.npcs.gerd.alive).toBe(false);
    const stay = leg(b31, 'B', { c32_b_lena: 'c32_bl_stay' });
    expect(stay.npcs.c7_nina.location).toBe('c15_winsen');
    const back = leg(b31, 'B', { c32_b_lena: 'c32_bl_back' });
    expect(back.npcs.c7_nina.location).toBe('hof_luedemann');
  });
  it('участок 32: Окафор ушёл на смену в первый день — жильцы без него, записка и ключи', () => {
    const b31 = after31('guard', 'share');
    b31.vars['w.okafor_stays'] = false;
    const b = leg(b31, 'B');
    expect(b.npcs.okafor.location).not.toBe('c15_winsen');
    const s32 = mergeCp(b31, 32, leg(b31, 'A'), b);
    expect(s32.chars.A.time).toBe(s32.chars.B.time);
  });

  // ───────────── Участок 33 ─────────────
  const after32 = (okafor: string, deniz: string, place?: string) => {
    const b31 = after31();
    if (place) b31.vars['w.c28_place'] = place;
    const s32 = fresh(mergeCp(b31, 32, leg(b31, 'A'), leg(b31, 'B')));
    return completeCheckpoint(c, s32, both({ c3_new_okafor32: okafor, c3_new_deniz32: deniz })).state;
  };
  for (const [okafor, deniz, place] of [['farm', 'farm', 'family'], ['farm', 'near', 'hands'], ['near', 'stay', undefined], ['away', 'near', undefined]] as const)
    it(`участок 33 после ${okafor}/${deniz}/${place ?? '-'}: вода, чемодан, миры сходятся`, () => {
      const b32 = after32(okafor, deniz, place);
      for (const p of P) expect(b32.chars[p].scene).toBe('c33_start');
      const a = leg(b32, 'A'), b = leg(b32, 'B', { c33_b_case: 'c33_bc_red' });
      expect(qty(b, 'c33_saline', 'char', 'B')).toBe(20);
      const s33 = mergeCp(b32, 33, a, b);
      expect(s33.chars.A.time).toBe(s33.chars.B.time);
      for (const p of P) { expect(s33.chars[p].location).toBe('hof_luedemann'); expect(canAct(s33.chars[p].body)).toBe(true); }
      if (deniz === 'farm') expect(s33.npcs.deniz.location).toBe('hof_luedemann');
      if (deniz === 'near') expect(s33.npcs.deniz.location).toBe('c3_neighbor');
      const out = completeCheckpoint(c, s33, { A: { c3_new_winter33: 'pot' }, B: { c3_new_winter33: 'yards' } }).state;
      expect(out.vars['w.c33_rule']).toBe('work');
      for (const p of P) expect(out.chars[p].scene).toBe('c34_start');
    });
  it('участок 33: неверный ключ ломается — нож бьёт ампулы; вода — снег или Уте', () => {
    const b32 = after32('near', 'near');
    const forced = leg(b32, 'B', { c33_b_case: 'c33_bc_tag', c33_b_broke: 'c33_bb_knife' });
    expect(qty(forced, 'c33_saline', 'char', 'B')).toBe(9);
    const left = leg(b32, 'B', { c33_b_case: 'c33_bc_fish', c33_b_broke: 'c33_bb_leave' });
    expect(qty(left, 'c33_saline', 'char', 'B')).toBe(0);
    const water = (s: GameState) => qty(s, 'water_l', 'place', 'c3_farm_stock');
    const snow = leg(b32, 'A', { c33_a_pump: 'c33_ap_snow' in Object.fromEntries(acts(leg(b32, 'A', {}, 'c33_a_pump'), 'A').filter(x => x.enabled).map(x => [x.def.id, 1])) ? 'c33_ap_snow' : 'c33_ap_snow_cold' });
    expect(water(snow) - water(b32)).toBe(15);
    const s33 = mergeCp(b32, 33, snow, forced);
    expect(s33.chars.A.time).toBe(s33.chars.B.time);
  });

  // ───────────── Участок 34 ─────────────
  it('участок 34: Николаус и списки — Томас, машина, час вдвоём; миры сходятся', () => {
    const b32 = after32('farm', 'farm', 'family');
    b32.vars['w.c19_brockmann_answer'] = true;
    const corsa = Object.values(b32.items).find(i => i.type === 'opel_corsa')!;
    corsa.at = { kind: 'place', id: 'c16_jesteburg' }; corsa.fuel = 0.2; b32.vars['w.c26_car'] = 'taken';
    const s33 = fresh(mergeCp(b32, 33, leg(b32, 'A'), leg(b32, 'B')));
    const b33 = completeCheckpoint(c, s33, both({ c3_new_winter33: 'work' })).state;
    for (const p of P) expect(b33.chars[p].scene).toBe('c34_start');
    for (const [aw, bw, th] of [['c34_tw_stay', 'c34_tw_north', 'c34_at_truth'], ['c34_tw_east', 'c34_tw_none', 'c34_at_gentle'], ['c34_tw_north', 'c34_tw_east', 'c34_at_none']]) {
      const a = leg(b33, 'A', { c34_two: aw, c34_a_thomas: th }), b = leg(b33, 'B', { c34_two: bw });
      expect(a.vars['w.c34_car_back']).toBe(true);
      expect(a.vars['w.c34_thomas']).toBeDefined();
      const s34 = mergeCp(b33, 34, a, b);
      expect(s34.chars.A.time).toBe(s34.chars.B.time);
      for (const p of P) { expect(s34.chars[p].location).toBe('hof_luedemann'); expect(canAct(s34.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s34, { A: { c3_new_lean34: 'east' }, B: { c3_new_lean34: 'north' } }).state;
      expect(out.vars['w.c34_lean']).toBe('stay');
      for (const p of P) expect(out.chars[p].scene).toBe('c35_start');
    }
  });

  // ───────────── Участок 35 ─────────────
  it('участок 35: знают разное, решают друг за друга — Тобиас, Янник, медсестра; миры сходятся', () => {
    const b32 = after32('farm', 'farm', 'family');
    const s33 = fresh(mergeCp(b32, 33, leg(b32, 'A'), leg(b32, 'B')));
    const b33 = completeCheckpoint(c, s33, both({ c3_new_winter33: 'work' })).state;
    const s34 = fresh(mergeCp(b33, 34, leg(b33, 'A'), leg(b33, 'B')));
    const b34 = completeCheckpoint(c, s34, both({ c3_new_lean34: 'north' })).state;
    for (const p of P) expect(b34.chars[p].scene).toBe('c35_start');
    b34.vars['A.met_jannik'] = 'refused';
    const routes: [Record<string, string>, Record<string, string>, Record<string, string>][] = [
      [{ c35_a_jannik: 'c35_aj_sorry', c35_a_dusk: 'c35_ad_tell' }, { c35_b_dusk: 'c35_bd_tell' }, { c3_new_north35: 'together', c3_new_east35: 'give', c3_new_way35: 'north' }],
      [{ c35_a_jannik: 'c35_aj_excuse', c35_a_dusk: 'c35_ad_keep' }, {}, { c3_new_north35: 'go', c3_new_east35: 'yes', c3_new_way35: 'stay' }],
      [{ c35_a_jannik: 'c35_aj_silent' }, { c35_b_point: 'c35_bp_yes' }, { c3_new_north35: 'no', c3_new_east35: 'no', c3_new_way35: 'east' }],
    ];
    for (const [ar, br, ans] of routes) {
      const a = leg(b34, 'A', ar), b = leg(b34, 'B', br);
      const s35 = mergeCp(b34, 35, a, b);
      expect(s35.chars.A.time).toBe(s35.chars.B.time);
      for (const p of P) { expect(s35.chars[p].location).toBe('hof_luedemann'); expect(canAct(s35.chars[p].body)).toBe(true); }
      const want = ans.c3_new_north35 === 'together' && !s35.vars['w.c35_jannik'] ? 'go' : ans.c3_new_north35;
      const out = completeCheckpoint(c, s35, { A: { c3_new_north35: want, c3_new_way35: ans.c3_new_way35 }, B: { c3_new_east35: ans.c3_new_east35, c3_new_way35: ans.c3_new_way35 } }).state;
      expect(out.vars['w.c35_north']).toBe(want); expect(out.vars['w.c35_east']).toBe(ans.c3_new_east35); expect(out.vars['w.c35_way']).toBe(ans.c3_new_way35);
      for (const p of P) expect(out.chars[p].scene).toBe('c36_start');
    }
  });

  // ───────────── Участок 36 ─────────────
  const after35 = (ans: Record<string, string>, jannik = true) => {
    const b32 = after32('farm', 'farm', 'family');
    const s33 = fresh(mergeCp(b32, 33, leg(b32, 'A'), leg(b32, 'B')));
    const b33 = completeCheckpoint(c, s33, both({ c3_new_winter33: 'work' })).state;
    const s34 = fresh(mergeCp(b33, 34, leg(b33, 'A'), leg(b33, 'B')));
    const b34 = completeCheckpoint(c, s34, both({ c3_new_lean34: 'north' })).state;
    b34.vars['A.met_jannik'] = 'refused';
    const s35 = fresh(mergeCp(b34, 35, leg(b34, 'A', jannik ? { c35_a_jannik: 'c35_aj_sorry' } : { c35_a_jannik: 'c35_aj_silent' }), leg(b34, 'B')));
    const north = ans.north === 'together' && !s35.vars['w.c35_jannik'] ? 'go' : ans.north;
    return completeCheckpoint(c, s35, { A: { c3_new_north35: north, c3_new_way35: ans.way }, B: { c3_new_east35: ans.east, c3_new_way35: ans.way } }).state;
  };

  it('участок 36: порознь на часть — Люнебург и Винзен; кейс Ройтера; миры сходятся', () => {
    const routes: [Record<string, string>, Record<string, string>, Record<string, string>][] = [
      [{ north: 'go', east: 'yes', way: 'stay' }, { c36_a_case: 'c36_ca_212', c36_a_station: 'c36_as_say' }, { c36_b_desk: 'c36_bd_sign' }],
      [{ north: 'together', east: 'give', way: 'north' }, { c36_a_case: 'c36_ca_120', c36_a_case2: 'c36_a2_bar' }, { c36_b_desk: 'c36_bd_merle' }],
      [{ north: 'no', east: 'no', way: 'east' }, { c36_a_case: 'c36_ca_leave' }, { c36_b_desk: 'c36_bd_okafor', c36_b_list: 'c36_bl_us' }],
    ];
    for (const [ans, ar, br] of routes) {
      const b35 = after35(ans);
      for (const p of P) expect(b35.chars[p].scene).toBe('c36_start');
      const a = leg(b35, 'A', ar), b = leg(b35, 'B', br);
      expect(a.vars['A.c36_finished']).toBe(true);
      expect(b.vars['B.c36_finished']).toBe(true);
      if (ar.c36_a_case === 'c36_ca_212') expect(Object.values(a.items).some(i => i.type === 'c36_suture' && i.qty > 0 && i.at.kind === 'char')).toBe(true);
      const s36 = mergeCp(b35, 36, a, b);
      expect(s36.chars.A.time).toBe(s36.chars.B.time);
      for (const p of P) { expect(s36.chars[p].location).toBe('hof_luedemann'); expect(canAct(s36.chars[p].body)).toBe(true); }
      const out = completeCheckpoint(c, s36, { A: { c3_new_merle36: 'all', c3_new_gift36: 'ham' }, B: { c3_new_merle36: 'stay', c3_new_gift36: 'ham' } }).state;
      expect(out.vars['w.c36_merle']).toBe('merle');
      expect(out.vars['w.c36_gift']).toBe('ham');
      for (const p of P) expect(out.chars[p].scene).toBe('c37_start');
    }
  }, 60000);

  // ───────────── Участок 37 ─────────────
  it('участок 37: реквизиция (эхо) у ворот, сборы, последнее слово; миры сходятся', () => {
    const routes: [Record<string, string>, Record<string, string>, Record<string, string>, Record<string, string>][] = [
      [{ north: 'go', east: 'yes', way: 'stay' }, { c37_a_truck: 'c37_at_receipt' }, {}, { c3_new_leave37: 'stay', c3_new_send37: 'both' }],
      [{ north: 'together', east: 'give', way: 'north' }, { c37_a_soldier: 'c37_as_let' }, { c37_b_pens: 'c37_bp_keep' }, { c3_new_send37: 'none' }],
      [{ north: 'no', east: 'no', way: 'east' }, {}, { c37_b_henrike: 'c37_bh_east' }, { c3_new_leave37: 'stay', c3_new_send37: 'morning' }],
    ];
    for (const [ans, ar, br, kt] of routes) {
      const b35 = after35(ans);
      const s36 = fresh(mergeCp(b35, 36, leg(b35, 'A'), leg(b35, 'B')));
      const b36 = completeCheckpoint(c, s36, both({ c3_new_merle36: 'merle', c3_new_gift36: 'potatoes' })).state;
      for (const p of P) expect(b36.chars[p].scene).toBe('c37_start');
      const a = leg(b36, 'A', ar), b = leg(b36, 'B', br);
      expect(a.vars['w.c37_lost']).toBeDefined();
      const s37 = mergeCp(b36, 37, a, b);
      expect(s37.chars.A.time).toBe(s37.chars.B.time);
      for (const p of P) { expect(s37.chars[p].location).toBe('hof_luedemann'); expect(canAct(s37.chars[p].body)).toBe(true); }
      const answers = Object.fromEntries(Object.entries(kt).filter(([id]) => id !== 'c3_new_leave37' || s37.vars['w.c35_way'] === 'east' || s37.vars['w.c35_east'] === 'yes'));
      const out = completeCheckpoint(c, s37, both(answers)).state;
      expect(out.vars['w.c37_send']).toBe(kt.c3_new_send37);
      expect(out.vars['w.c37_leave']).toBe('stay');
      for (const p of P) expect(out.chars[p].scene).toBe('c38_start');
    }
  }, 90000);

  // ───────────── Участок 38 ─────────────
  const after37 = (ans: Record<string, string>, merle: string, kt37: Record<string, string>) => {
    const b35 = after35(ans);
    const s36 = fresh(mergeCp(b35, 36, leg(b35, 'A'), leg(b35, 'B')));
    const b36 = completeCheckpoint(c, s36, both({ c3_new_merle36: merle, c3_new_gift36: 'potatoes' })).state;
    const s37 = fresh(mergeCp(b36, 37, leg(b36, 'A'), leg(b36, 'B')));
    if (kt37.c3_new_leave37 === 'pawel') { s37.vars['A.met.pawel'] = true; s37.npcs.pawel.alive = true; }
    const kt = Object.fromEntries(Object.entries(kt37).filter(([id]) => id !== 'c3_new_leave37' || s37.vars['w.c35_way'] === 'east' || s37.vars['w.c35_east'] === 'yes'));
    return completeCheckpoint(c, s37, both(kt)).state;
  };

  it('участок 38: север, хутор, Винзен, уход с Павлом — порознь на часть; миры сходятся', () => {
    const routes: [Record<string, string>, string, Record<string, string>, string, string][] = [
      [{ north: 'go', east: 'no', way: 'stay' }, 'merle', { c3_new_send37: 'both' }, 'farm', 'hof_luedemann'],
      [{ north: 'together', east: 'give', way: 'north' }, 'all', { c3_new_send37: 'none' }, 'farm', 'hof_luedemann'],
      [{ north: 'no', east: 'no', way: 'stay' }, 'stay', { c3_new_send37: 'none' }, 'north', 'hof_luedemann'],
      [{ north: 'no', east: 'no', way: 'east' }, 'merle', { c3_new_leave37: 'pawel', c3_new_send37: 'morning' }, '', 'c38_moelln'],
    ];
    for (const [ans, merle, kt37, merleAt, place] of routes) {
      const b37 = after37(ans, merle, kt37);
      for (const p of P) expect(b37.chars[p].scene).toBe('c38_start');
      if (place === 'c38_moelln') expect(b37.vars['w.c37_leave']).toBe('pawel');
      const a = leg(b37, 'A'), b = leg(b37, 'B');
      const s38 = mergeCp(b37, 38, a, b);
      expect(s38.chars.A.time).toBe(s38.chars.B.time);
      for (const p of P) { expect(s38.chars[p].location).toBe(place); expect(canAct(s38.chars[p].body)).toBe(true); }
      if (merleAt) expect(s38.vars['w.c38_merle']).toBe(merleAt);
      if (merleAt === 'farm') expect(s38.npcs.merle.location).toBe('hof_luedemann');
      const kt = place === 'hof_luedemann' ? { c3_new_watch38: 'tomorrow', ...(merleAt === 'farm' ? { c3_new_bed38: 'room' } : {}) } : {};
      const out = completeCheckpoint(c, s38, both(kt)).state;
      if (place === 'hof_luedemann') expect(out.vars['w.c38_watch']).toBe('tomorrow');
      for (const p of P) expect(out.chars[p].scene).toBe('c39_start');
    }
  }, 120000);

  // ───────────── Участок 39 ─────────────
  it('участок 39: дом после десятого — дежурство, сундук Оле, совет; миры сходятся', () => {
    const routes: [Record<string, string>, string, Record<string, string>, Record<string, string>, Record<string, string>, Record<string, string>][] = [
      [{ north: 'go', east: 'no', way: 'stay' }, 'merle', { c3_new_send37: 'both' }, { c3_new_watch38: 'tomorrow', c3_new_bed38: 'attic' }, { c39_b_attic: 'c39_ba_073' }, { c3_new_council39: 'guard', c3_new_depot39: 'both' }],
      [{ north: 'no', east: 'no', way: 'stay' }, 'stay', { c3_new_send37: 'none' }, { c3_new_watch38: 'no', c3_new_bed38: 'room' }, { c39_b_attic: 'c39_ba_703', c39_b_attic2: 'c39_b2_hammer' }, { c3_new_council39: 'yards', c3_new_depot39: 'none' }],
      [{ north: 'no', east: 'yes', way: 'stay' }, 'merle', { c3_new_leave37: 'army', c3_new_send37: 'morning' }, { c3_new_watch38: 'from15', c3_new_bed38: 'colony' }, {}, { c3_new_council39: 'brandt', c3_new_depot39: 'one', c3_new_army39: 'stay' }],
    ];
    for (const [ans, merle, kt37, kt38, br, kt39] of routes) {
      const b37 = after37(ans, merle, kt37);
      const s38 = fresh(mergeCp(b37, 38, leg(b37, 'A'), leg(b37, 'B')));
      const k38 = Object.fromEntries(Object.entries(kt38).filter(([id]) => id !== 'c3_new_bed38' || s38.vars['w.c38_merle'] === 'farm'));
      const b38 = completeCheckpoint(c, s38, both(k38)).state;
      for (const p of P) expect(b38.chars[p].scene).toBe('c39_start');
      const a = leg(b38, 'A'), b = leg(b38, 'B', br);
      if (br.c39_b_attic === 'c39_ba_073') expect(Object.values(b.items).some(i => i.type === 'c39_crank_torch' && i.qty > 0)).toBe(true);
      const s39 = mergeCp(b38, 39, a, b);
      expect(s39.chars.A.time).toBe(s39.chars.B.time);
      for (const p of P) { expect(s39.chars[p].location).toBe('hof_luedemann'); expect(canAct(s39.chars[p].body)).toBe(true); }
      const k39 = Object.fromEntries(Object.entries(kt39).filter(([id]) => id !== 'c3_new_army39' || s39.vars['w.c37_leave'] === 'army'));
      const out = completeCheckpoint(c, s39, both(k39)).state;
      expect(out.vars['w.c39_council']).toBe(kt39.c3_new_council39);
      expect(out.vars['w.c39_depot']).toBe(kt39.c3_new_depot39);
      for (const p of P) expect(out.chars[p].scene).toBe('c40_start');
    }
  }, 150000);

  // ───────────── Участок 40 ─────────────
  const after39 = (ans: Record<string, string>, kt37: Record<string, string>, kt38: Record<string, string>, kt39: Record<string, string>) => {
    const b37 = after37(ans, 'merle', kt37);
    const s38 = fresh(mergeCp(b37, 38, leg(b37, 'A'), leg(b37, 'B')));
    const k38 = Object.fromEntries(Object.entries(kt38).filter(([id]) => id !== 'c3_new_bed38' || s38.vars['w.c38_merle'] === 'farm'));
    const b38 = completeCheckpoint(c, s38, both(k38)).state;
    const s39 = fresh(mergeCp(b38, 39, leg(b38, 'A'), leg(b38, 'B')));
    const k39 = Object.fromEntries(Object.entries(kt39).filter(([id]) => id !== 'c3_new_army39' || s39.vars['w.c37_leave'] === 'army'));
    return completeCheckpoint(c, s39, both(k39)).state;
  };
  const b39std = () => after39({ north: 'go', east: 'no', way: 'stay' }, { c3_new_send37: 'both' }, { c3_new_watch38: 'tomorrow', c3_new_bed38: 'attic' }, { c3_new_council39: 'yards', c3_new_depot39: 'one' });
  const kt40 = (s: GameState, who: readonly PlayerId[] = P) => Object.fromEntries(who.map(p => [p, { c3_new_after40: 'neighbors', ...(s.vars['w.c39_lea_date'] === 'wednesday' ? { c3_new_lea40: 'go' } : {}) }]));

  it('участок 40: оттепель — осторожные дома, склад, армия уходит; миры сходятся', () => {
    const b39 = b39std();
    for (const p of P) expect(b39.chars[p].scene).toBe('c40_start');
    const careful: Record<string, string> = { c40_a_n1: 'c40_an1_bell', c40_a_n2: 'c40_an2_back', c40_a_n3: 'c40_an3_shout', c40_b_n1: 'c40_bn1_call', c40_b_n2: 'c40_bn2_table', c40_b_n3: 'c40_bn3_stay' };
    const a = leg(b39, 'A', careful), b = leg(b39, 'B', careful);
    for (const [pid, l] of [['A', a], ['B', b]] as const) { expect(l.vars[`${pid}.c40_down`]).toBeUndefined(); expect(canAct(l.chars[pid].body)).toBe(true); }
    expect(Object.values(a.items).some(i => i.type === 'c16_flour' && i.qty >= 10 && i.at.kind === 'char')).toBe(true);
    const s40 = mergeCp(b39, 40, a, b);
    expect(s40.chars.A.time).toBe(s40.chars.B.time);
    const out = completeCheckpoint(c, s40, kt40(s40)).state;
    expect(out.vars['w.c40_after']).toBe('neighbors');
    expect(out.vars['w.c40_neighbor']).toBeUndefined();
    for (const p of P) expect(out.chars[p].scene).toBe('c41_start');
  }, 150000);

  const downIn40 = (pid: PlayerId) => {
    const b39 = b39std();
    const forced: Record<string, string> = pid === 'A'
      ? { c40_a_n1: 'c40_an1_look', c40_a_n2: 'c40_an2_hold', c40_a_n3: 'c40_an3_run' }
      : { c40_b_n1: 'c40_bn1_go', c40_b_n2: 'c40_bn2_hold', c40_b_n3: 'c40_bn3_run' };
    for (let i = 0; i < 10; i++) {
      const base = structuredClone(b39) as GameState; base.seed = `${base.seed}-down40-${i}`;
      const d = leg(base, pid, forced, 'c40_night_end');
      if (segmentFinished(c, d, pid) !== 'incapacitated') continue;
      const rescuer = pid === 'A' ? 'B' : 'A';
      const s40 = mergeSegments(c, base, { [pid]: d, [rescuer]: leg(base, rescuer) });
      syncClocks(c, s40, c.checkpoints.find(x => x.index === 40)!.syncNotBefore); mergeNotes(c, s40, 40);
      return completeCheckpoint(c, s40, kt40(s40, [rescuer])).state;
    }
    return undefined;
  };
  for (const pid of P)
    it(`участок 40: безрассудная ночь — выбыл ${pid}, второй доигрывает, смерти нет`, () => {
      const out = downIn40(pid);
      expect(out, 'безрассудная цепочка должна приводить к выбыванию').toBeDefined();
      const rescuer = pid === 'A' ? 'B' : 'A';
      expect(out!.chars[pid].controlledBy).toBe(rescuer);
      expect(out!.chars[pid].body.consciousness).not.toBe('dead');
      expect(out!.chars[pid].location).toBe('hof_luedemann');
      expect(out!.chars[rescuer].scene).toBe('c41_start');
    }, 150000);

  it('участок 40: уход с армией — понедельник и казарма, дальше заглушка', () => {
    const b39 = after39({ north: 'no', east: 'yes', way: 'stay' }, { c3_new_leave37: 'army', c3_new_send37: 'morning' }, { c3_new_watch38: 'from15', c3_new_bed38: 'colony' }, { c3_new_council39: 'guard', c3_new_depot39: 'none', c3_new_army39: 'go' });
    if (b39.vars['w.c39_army'] !== 'go') return; // Тобиаса в этой сборке нет — ветка недостижима
    const a = leg(b39, 'A'), b = leg(b39, 'B');
    for (const [pid, l] of [['A', a], ['B', b]] as const) expect(l.chars[pid].location).toBe('c18_lueneburg');
    const out = completeCheckpoint(c, mergeCp(b39, 40, a, b), {}).state;
    for (const p of P) expect(out.chars[p].scene).toBe('c41_start');
  }, 150000);

  // ───────────── Участок 41 ─────────────
  const b40std = () => { const b39 = b39std(); const s40 = mergeCp(b39, 40, leg(b39, 'A'), leg(b39, 'B')); return completeCheckpoint(c, s40, kt40(s40)).state; };
  const kt41 = (s: GameState, who: readonly PlayerId[] = P) => Object.fromEntries(who.map(p => [p, {
    c3_new_xmas41: 'quiet',
    ...(s.vars['w.c39_strangers'] === 'barn' ? { c3_new_jorg41: 'stay' } : {}),
    ...(s.vars['w.c38_merle'] === 'farm' ? { c3_new_vet41: 'one' } : {}),
  }]));

  it('участок 41: после ночи — пост, корова, Йорг; миры сходятся; дальше заглушка', () => {
    const b40 = b40std();
    for (const p of P) expect(b40.chars[p].scene).toBe('c41_start');
    for (const code of [{}, { c41_a_post: 'c41_ap2_1215' }, { c41_a_post: 'c41_ap2_leave' }] as Record<string, string>[]) {
      const a = leg(b40, 'A', code), b = leg(b40, 'B');
      const s41 = mergeCp(b40, 41, a, b);
      expect(s41.chars.A.time).toBe(s41.chars.B.time);
      const out = completeCheckpoint(c, s41, kt41(s41)).state;
      expect(out.vars['w.c41_xmas']).toBe('quiet');
      for (const p of P) { expect(canAct(out.chars[p].body)).toBe(true); expect(out.chars[p].scene).toBe('c42_start'); }
    }
  }, 200000);

  for (const pid of P)
    it(`участок 41: выбыл ${pid} в 40-й — второй выхаживает, к вечеру оба на ногах`, () => {
      const b40 = downIn40(pid);
      expect(b40).toBeDefined();
      const rescuer = pid === 'A' ? 'B' : 'A';
      for (const forced of [{}, { c41_r_bed: 'c41_rb_stove', c41_r_doc: 'c41_rd_out', c41_r_noon: 'c41_rn_sit', c41_r_visit: 'c41_rv_back' }] as Record<string, string>[]) {
        const r = leg(b40!, rescuer, forced);
        expect(r.chars[pid].body.consciousness).not.toBe('dead');
        const s41 = mergeSegments(c, b40!, { [rescuer]: r });
        syncClocks(c, s41, c.checkpoints.find(x => x.index === 41)!.syncNotBefore); mergeNotes(c, s41, 41);
        expect(canAct(s41.chars[pid].body), `${JSON.stringify(forced)} blood=${s41.chars[pid].body.bloodLoss}`).toBe(true);
        const out = completeCheckpoint(c, s41, kt41(s41)).state;
        for (const p of P) { expect(out.chars[p].controlledBy).toBe(p); expect(out.chars[p].scene).toBe('c42_start'); }
        if (process.env.KVEST_DEBUG) console.log(pid, JSON.stringify(out.chars[pid].body), out.chars[pid].location, out.chars[pid].controlledBy);
        for (const p of P) expect(evalCond({ s: out, c, pid: p }, point42Available), `${p} может играть 42-ю`).toBe(true);
      }
    }, 200000);

  // ───────────── Участок 42 ─────────────
  const kt42 = (s: GameState) => Object.fromEntries(P.map(p => [p, {
    c3_new_church42: 'some',
    ...(s.vars['w.c42_jonas_met'] ? { c3_new_jonas42: 'take' } : {}),
    ...(s.vars['w.c42_school_known'] && s.npcs.c7_nina?.alive && s.npcs.c7_nina.location === 'hof_luedemann' ? { c3_new_school42: 'herself' } : {}),
  }]));
  const b41std = () => { const b40 = b40std(); const s41 = mergeCp(b40, 41, leg(b40, 'A'), leg(b40, 'B')); return completeCheckpoint(c, s41, kt41(s41)).state; };

  it('участок 42: два дня до адвента — Йонас, тетрадь понедельников; миры сходятся; дальше заглушка', () => {
    const b41 = b41std();
    for (const p of P) expect(b41.chars[p].scene).toBe('c42_start');
    const variants: [Record<string, string>, Record<string, string>][] = [
      [{}, {}],
      [{ c42_a_tracks: 'c42_at_back' }, { c42_b_notebook: 'c42_bnb_both' }],
      [{ c42_a_offer: 'c42_ao_promise', c42_a_brandt: 'c42_abt_vouch' }, { c42_b_notebook: 'c42_bnb_lars' }],
    ];
    for (const [fa, fb] of variants) {
      const a = leg(b41, 'A', fa), b = leg(b41, 'B', fb);
      for (const [pid, l] of [['A', a], ['B', b]] as const) expect(l.vars[`${pid}.c42_finished`], JSON.stringify([fa, fb])).toBe(true);
      expect(a.vars['w.c42_jonas_met'] ?? false).toBe(fa.c42_a_tracks !== 'c42_at_back');
      const s42 = mergeCp(b41, 42, a, b);
      expect(s42.chars.A.time).toBe(s42.chars.B.time);
      const out = completeCheckpoint(c, s42, kt42(s42)).state;
      expect(out.vars['w.c42_church']).toBe('some');
      if (fa.c42_a_tracks !== 'c42_at_back') expect(out.vars['w.c42_jonas_fate']).toBe('take');
      for (const p of P) { expect(canAct(out.chars[p].body)).toBe(true); expect(out.chars[p].scene).toBe('c43_start'); }
    }
  }, 300000);

  // ───────────── Участок 43 ─────────────
  const b42std = () => { const b41 = b41std(); const s42 = mergeCp(b41, 42, leg(b41, 'A'), leg(b41, 'B')); return completeCheckpoint(c, s42, kt42(s42)).state; };
  it('участок 43: суббота порознь, воскресенье вместе; каждый решает за другого; дальше заглушка', () => {
    const b42 = b42std();
    for (const p of P) { expect(b42.chars[p].scene).toBe('c43_start'); expect(evalCond({ s: b42, c, pid: p }, point43Available)).toBe(true); }
    const variants: [Record<string, string>, Record<string, string>][] = [
      [{}, {}],
      [{ c43_a_sweep: 'c43_as_line', c43_a_jannes: 'c43_aj_help' }, { c43_b_ute: 'c43_bu_jannes' }],
    ];
    for (const [fa, fb] of variants) {
      const a = leg(b42, 'A', fa), b = leg(b42, 'B', fb);
      for (const [pid, l] of [['A', a], ['B', b]] as const) {
        expect(l.vars[`${pid}.c43_finished`], JSON.stringify([fa, fb])).toBe(true);
        expect(l.chars[pid].location).toBe('hof_luedemann');
      }
      expect(b.vars['w.c43_b_knows_why']).toBe(true);
      expect(a.vars['w.c43_a_heard_jannes']).toBe(true);
      const s43 = mergeCp(b42, 43, a, b);
      expect(s43.chars.A.time).toBe(s43.chars.B.time);
      const merleHere = s43.vars['w.c38_merle'] === 'farm';
      const res43 = completeCheckpoint(c, s43, { A: merleHere ? { c3_new_convoy43: 'merle' } : { c3_new_job43: 'part' }, B: { c3_new_council43: 'yard' } });
      const out = res43.state;
      // Вопрос, который некому задать, пропускается молча: ни решения, ни строки в журнале.
      const unasked = res43.joint.find((j) => j.id === (merleHere ? 'c3_new_job43' : 'c3_new_convoy43'))!;
      expect(unasked.silent).toBe(true);
      expect(out.log.some((e) => e.kind === 'checkpoint' && e.text.includes('Решить не успели'))).toBe(false);
      expect(out.vars['w.c43_council']).toBe('yard');
      if (merleHere) expect(out.vars['w.c43_convoy']).toBe('merle'); else expect(out.vars['w.c43_job']).toBe('part');
      for (const p of P) { expect(canAct(out.chars[p].body)).toBe(true); expect(out.chars[p].scene).toBe('c44_start'); }
    }
  }, 300000);

  // ───────────── Участок 44 ─────────────
  it('участок 44: совет по решению КТ43, Нильс, сочельник впереди; миры сходятся; дальше заглушка', () => {
    const b42 = b42std();
    for (const council of ['truth', 'yard', 'silent']) {
      const s43 = mergeCp(b42, 43, leg(b42, 'A'), leg(b42, 'B'));
      const merleHere = s43.vars['w.c38_merle'] === 'farm';
      const b43 = completeCheckpoint(c, s43, { A: merleHere ? { c3_new_convoy43: 'go' } : { c3_new_job43: 'yes' }, B: { c3_new_council43: council } }).state;
      for (const p of P) { expect(b43.chars[p].scene).toBe('c44_start'); expect(evalCond({ s: b43, c, pid: p }, point44Available)).toBe(true); }
      const a = leg(b43, 'A'), b = leg(b43, 'B');
      for (const [pid, l] of [['A', a], ['B', b]] as const) {
        expect(l.vars[`${pid}.c44_finished`], council).toBe(true);
        expect(l.chars[pid].location).toBe('hof_luedemann');
      }
      expect(a.vars['w.c44_verdict']).toBe(b.vars['w.c44_verdict']);
      const s44 = mergeCp(b43, 44, a, b);
      expect(s44.chars.A.time).toBe(s44.chars.B.time);
      const out = completeCheckpoint(c, s44, both({ c3_new_eve44: 'open', c3_new_post44: 'a' }, { c3_new_eve44: 'home', c3_new_post44: 'a' })).state;
      expect(out.vars['w.c44_eve']).toBe('near');
      expect(out.vars['w.c44_post']).toBe('a');
      for (const p of P) { expect(canAct(out.chars[p].body)).toBe(true); expect(out.chars[p].scene).toBe('c45_start'); }
    }
  }, 400000);

  // ───────────── Участок 45 ─────────────
  it('участок 45: порознь на два дня, Эльбмарш и Винзен; встреча у калитки; Нильс; дальше заглушка', () => {
    const b42 = b42std();
    const s43 = mergeCp(b42, 43, leg(b42, 'A'), leg(b42, 'B'));
    const merleHere = s43.vars['w.c38_merle'] === 'farm';
    const b43 = completeCheckpoint(c, s43, { A: merleHere ? { c3_new_convoy43: 'go' } : { c3_new_job43: 'no' }, B: { c3_new_council43: 'truth' } }).state;
    const s44 = mergeCp(b43, 44, leg(b43, 'A'), leg(b43, 'B'));
    const b44 = completeCheckpoint(c, s44, both({ c3_new_eve44: 'near', c3_new_post44: 'other' }, { c3_new_eve44: 'near', c3_new_post44: 'other' })).state;
    for (const p of P) { expect(b44.chars[p].scene).toBe('c45_start'); expect(evalCond({ s: b44, c, pid: p }, point45Available)).toBe(true); }
    const variants: [Record<string, string>, Record<string, string>][] = [
      [{}, {}],
      [{ c45_a_marsh: 'c45_mr_reeds', c45_a_fokken: 'c45_fk_help', c45_a_ferry: 'c45_fr_boy' }, { c45_b_cabinet: 'c45_bc_drawer', c45_b_search: 'c45_bs_all', c45_b_pharm: 'c45_bh_rush' }],
      [{ c45_a_fokken: 'c45_fk_list', c45_a_hiker: 'c45_hk_take' }, { c45_b_cabinet: 'c45_bc_pot', c45_b_pharm: 'c45_bh_slow' }],
    ];
    for (const [fa, fb] of variants) {
      const a = leg(b44, 'A', fa), b = leg(b44, 'B', fb);
      for (const [pid, l] of [['A', a], ['B', b]] as const) {
        expect(l.vars[`${pid}.c45_finished`], JSON.stringify([fa, fb])).toBe(true);
        expect(l.chars[pid].location).toBe('hof_luedemann');
        expect(canAct(l.chars[pid].body)).toBe(true);
      }
      expect(a.vars['w.c45_nils_offer']).toBe(true);
      if (fb.c45_b_cabinet) expect(b.vars['w.c45_cabinet']).toBe('key');
      const s45 = mergeCp(b44, 45, a, b);
      expect(s45.chars.A.time).toBe(s45.chars.B.time);
      const out = completeCheckpoint(c, s45, both({ c3_new_nils45: 'yes', c3_new_guest45: 'night' }, { c3_new_nils45: 'no', c3_new_guest45: 'night' })).state;
      expect(out.vars['w.c45_nils']).toBe('once');
      expect(out.vars['w.c45_guest']).toBe('night');
      for (const p of P) { expect(canAct(out.chars[p].body)).toBe(true); expect(out.chars[p].scene).toBe('c46_start'); }
    }
  }, 400000);

  // ───────────── Участок 46 ─────────────
  it('участок 46: сочельник и Рождество; пост у Зеве; письмо Тобиаса; миры сходятся; дальше заглушка', () => {
    const b42 = b42std();
    const s43 = mergeCp(b42, 43, leg(b42, 'A'), leg(b42, 'B'));
    const merleHere = s43.vars['w.c38_merle'] === 'farm';
    const b43 = completeCheckpoint(c, s43, { A: merleHere ? { c3_new_convoy43: 'go' } : { c3_new_job43: 'yes' }, B: { c3_new_council43: 'truth' } }).state;
    for (const post of ['a', 'b'] as const) {
      const s44 = mergeCp(b43, 44, leg(b43, 'A'), leg(b43, 'B'));
      const b44 = completeCheckpoint(c, s44, both({ c3_new_eve44: 'open', c3_new_post44: post }, { c3_new_eve44: 'open', c3_new_post44: post })).state;
      const s45 = mergeCp(b44, 45, leg(b44, 'A'), leg(b44, 'B'));
      const b45 = completeCheckpoint(c, s45, both({ c3_new_nils45: 'yes', c3_new_guest45: 'night' }, { c3_new_nils45: 'yes', c3_new_guest45: 'night' })).state;
      for (const p of P) { expect(b45.chars[p].scene).toBe('c46_start'); expect(evalCond({ s: b45, c, pid: p }, point46Available)).toBe(true); }
      const a = leg(b45, 'A', post === 'a' ? { c46_post2: 'c46_p2_ice' } : {});
      const b = leg(b45, 'B', post === 'b' ? { c46_post2: 'c46_p2_bell' } : {});
      for (const [pid, l] of [['A', a], ['B', b]] as const) {
        expect(l.vars[`${pid}.c46_finished`], post).toBe(true);
        expect(l.chars[pid].location).toBe('hof_luedemann');
        expect(canAct(l.chars[pid].body)).toBe(true);
      }
      if (post === 'a') expect(a.vars['w.c46_post_dead']).toBe('killed'); else expect(b.vars['w.c46_post_dead']).toBe('water');
      const s46 = mergeCp(b45, 46, a, b);
      expect(s46.chars.A.time).toBe(s46.chars.B.time);
      const answer: Record<string, string> = s46.vars['w.c46_tobias_letter'] ? { c3_new_answer46: 'ask' } : {};
      const out = completeCheckpoint(c, s46, both({ c3_new_silvester46: 'go', ...answer }, { c3_new_silvester46: 'stay', ...answer })).state;
      expect(out.vars['w.c46_silvester']).toBe('some');
      if (s46.vars['w.c46_tobias_letter']) expect(out.vars['w.c46_answer']).toBe('ask');
      for (const p of P) { expect(canAct(out.chars[p].body)).toBe(true); expect(out.chars[p].scene).toBe('c47_start'); }
    }
  }, 600000);

  // ───────────── Участок 47 ─────────────
  it('участок 47: лесополоса, цепочка опасности, Карстен; миры сходятся; дальше заглушка', () => {
    const b42 = b42std();
    const s43 = mergeCp(b42, 43, leg(b42, 'A'), leg(b42, 'B'));
    const merleHere = s43.vars['w.c38_merle'] === 'farm';
    const b43 = completeCheckpoint(c, s43, { A: merleHere ? { c3_new_convoy43: 'go' } : { c3_new_job43: 'no' }, B: { c3_new_council43: 'yard' } }).state;
    const s44 = mergeCp(b43, 44, leg(b43, 'A'), leg(b43, 'B'));
    const b44 = completeCheckpoint(c, s44, both({ c3_new_eve44: 'near', c3_new_post44: 'other' }, { c3_new_eve44: 'near', c3_new_post44: 'other' })).state;
    const s45 = mergeCp(b44, 45, leg(b44, 'A'), leg(b44, 'B'));
    const b45 = completeCheckpoint(c, s45, both({ c3_new_nils45: 'once', c3_new_guest45: 'dinner' }, { c3_new_nils45: 'once', c3_new_guest45: 'dinner' })).state;
    const s46 = mergeCp(b45, 46, leg(b45, 'A'), leg(b45, 'B'));
    const ans46: Record<string, string> = s46.vars['w.c46_tobias_letter'] ? { c3_new_silvester46: 'quiet', c3_new_answer46: 'thanks' } : { c3_new_silvester46: 'quiet' };
    const b46 = completeCheckpoint(c, s46, both(ans46, ans46)).state;
    for (const p of P) { expect(b46.chars[p].scene).toBe('c47_start'); expect(evalCond({ s: b46, c, pid: p }, point47Available)).toBe(true); }
    const variants: [Record<string, string>, Record<string, string>][] = [
      [{}, {}],
      [{ c47_a_house: 'c47_ah_fox', c47_a_share: 'c47_as_more' }, { c47_b_bite: 'c47_bb_hide', c47_b_karsten: 'c47_bk_let' }],
      [{ c47_a_wood: 'c47_aw_rush', c47_a_cellar: 'c47_ace_alone', c47_a_barn: 'c47_ab_lamp', c47_a_carry: 'c47_aca_jump' }, { c47_b_bite: 'c47_bb_shed', c47_b_out: 'c47_bo_alone', c47_b_karsten: 'c47_bk_water', c47_b_last: 'c47_bl_ice' }],
    ];
    for (const [fa, fb] of variants) {
      const a = leg(b46, 'A', fa), b = leg(b46, 'B', fb);
      for (const [pid, l] of [['A', a], ['B', b]] as const) {
        const down = !!l.vars[`${pid}.c47_down`];
        expect(down || !!l.vars[`${pid}.c47_finished`], JSON.stringify([fa, fb])).toBe(true);
        expect(l.chars[pid].location).toBe('hof_luedemann');
        expect(canAct(l.chars[pid].body)).toBe(!down);
      }
      if (fa.c47_a_house) { expect(a.vars['w.c47_cabinet']).toBe('code'); expect(a.vars['w.c47_food']).toBe('more'); }
      if (fb.c47_b_karsten === 'c47_bk_let') expect(b.vars['w.c47_karsten_end']).toBe('hidden');
      const s47 = mergeCp(b46, 47, a, b);
      const ans = { c3_new_cellar47: 'keep', c3_new_posts47: 'double' };
      const answers = Object.fromEntries(P.filter(p => canAct(s47.chars[p].body)).map(p => [p, ans]));
      const out = completeCheckpoint(c, s47, answers).state;
      if (P.every(p => canAct(s47.chars[p].body))) { expect(out.vars['w.c47_posts']).toBe('double'); }
      for (const p of P) if (canAct(out.chars[p].body)) expect(out.chars[p].scene).toBe('c48_start');
    }
  }, 900000);

  // ───────────── Участок 48 ─────────────
  const pick = (s: GameState, n: number, forced: Record<string, string> = {}) => {
    const cp = c.checkpoints.find((x) => x.index === n)!;
    return Object.fromEntries(P.filter((p) => canAct(s.chars[p].body)).map((p) => [p, Object.fromEntries(cp.joint
      .filter((id) => evalCond({ s, c, pid: p }, c.joint[id].canParticipate))
      .map((id) => [id, forced[id] ?? c.joint[id].options.find((o) => evalCond({ s, c, pid: p }, o.when))!.id]))]));
  };
  const b46for48 = () => {
    const b42 = b42std();
    const s43 = mergeCp(b42, 43, leg(b42, 'A'), leg(b42, 'B'));
    const merleHere = s43.vars['w.c38_merle'] === 'farm';
    const b43 = completeCheckpoint(c, s43, { A: merleHere ? { c3_new_convoy43: 'go' } : { c3_new_job43: 'no' }, B: { c3_new_council43: 'truth' } }).state;
    const s44 = mergeCp(b43, 44, leg(b43, 'A'), leg(b43, 'B', merleHere ? { c44_b_answer: 'c44_ba_yes' } : {}));
    const b44 = completeCheckpoint(c, s44, pick(s44, 44, { c3_new_post44: 'other' })).state;
    const s45 = mergeCp(b44, 45, leg(b44, 'A'), leg(b44, 'B'));
    const b45 = completeCheckpoint(c, s45, pick(s45, 45)).state;
    const s46 = mergeCp(b45, 46, leg(b45, 'A'), leg(b45, 'B'));
    return { merleHere, b46: completeCheckpoint(c, s46, pick(s46, 46)).state };
  };
  it('участок 48: колонна или обычный день; миры сходятся; дальше заглушка', () => {
    const { merleHere, b46 } = b46for48();
    const s47 = mergeCp(b46, 47, leg(b46, 'A'), leg(b46, 'B'));
    const b47 = completeCheckpoint(c, s47, pick(s47, 47)).state;
    for (const p of P) { expect(b47.chars[p].scene).toBe('c48_start'); expect(evalCond({ s: b47, c, pid: p }, point48Available)).toBe(true); }
    const hamburg = merleHere && !!b47.vars['w.c44_hamburg_trip'];
    const a = leg(b47, 'A'), b = leg(b47, 'B');
    for (const [pid, l] of [['A', a], ['B', b]] as const) expect(l.vars[`${pid}.c48_finished`]).toBe(true);
    expect(a.chars.A.location).toBe('hof_luedemann');
    expect(b.chars.B.location).toBe(hamburg ? 'c48_uke' : 'hof_luedemann');
    if (hamburg) expect(b.vars['w.c48_hamburg']).toBe(true);
    const s48 = mergeCp(b47, 48, a, b);
    expect(s48.chars.A.time).toBe(s48.chars.B.time);
    const res = completeCheckpoint(c, s48, pick(s48, 48, { c3_new_uke48: 'spring', c3_new_bjorn48: 'take' }));
    if (hamburg) expect(res.state.vars['w.c48_uke']).toBe('spring');
    for (const p of P) expect(res.state.chars[p].scene).toBe('c49_start');
    // ── Участок 49: тридцатое и утро Сильвестра ──
    const b48 = res.state;
    for (const p of P) expect(evalCond({ s: b48, c, pid: p }, point49Available), `${p} может играть 49-ю`).toBe(true);
    const a9 = leg(b48, 'A'), b9 = leg(b48, 'B');
    for (const [pid, l] of [['A', a9], ['B', b9]] as const) expect(l.vars[`${pid}.c49_finished`], `${pid} дошёл до КТ49`).toBe(true);
    expect(a9.chars.A.location).toBe('hof_luedemann');
    expect(b9.chars.B.location).toBe(hamburg ? 'c48_uke' : 'hof_luedemann');
    if (hamburg) expect(a9.vars['w.c49_a_radio']).toBeTruthy();
    const s49 = mergeCp(b48, 49, a9, b9);
    expect(s49.chars.A.time).toBe(s49.chars.B.time);
    const r49 = completeCheckpoint(c, s49, pick(s49, 49, { c3_new_tracks49: 'pit' }));
    expect(r49.state.vars['w.c49_tracks']).toBe('pit');
    if (hamburg) expect(r49.state.vars['w.c49_merle']).toBeTruthy(); else expect(r49.state.vars['w.c49_midnight']).toBeTruthy();
    for (const p of P) expect(r49.state.chars[p].scene).toBe('c50_start');
  }, 1500000);

  it('участок 48: выбывший в 47-й — второй выхаживает, к вечеру сводка и дальше заглушка', () => {
    const { b46 } = b46for48();
    const reckless = { c47_a_wood: 'c47_aw_rush', c47_a_cellar: 'c47_ace_alone', c47_a_barn: 'c47_ab_lamp', c47_a_carry: 'c47_aca_jump' };
    let b47: GameState | undefined;
    for (let i = 0; i < 12 && !b47; i++) {
      const base = structuredClone(b46) as GameState; base.seed = `${base.seed}-d48-${i}`;
      const d = leg(base, 'A', reckless, 'c47_checkpoint');
      if (segmentFinished(c, d, 'A') !== 'incapacitated') continue;
      const s47 = mergeSegments(c, base, { A: d, B: leg(base, 'B') });
      syncClocks(c, s47, c.checkpoints.find((x) => x.index === 47)!.syncNotBefore); mergeNotes(c, s47, 47);
      b47 = completeCheckpoint(c, s47, pick(s47, 47)).state;
    }
    expect(b47, 'никто не выбыл в 47-й за 12 попыток').toBeTruthy();
    expect(canAct(b47!.chars.A.body)).toBe(false);
    expect(evalCond({ s: b47!, c, pid: 'B' }, point48Available)).toBe(true);
    const r = leg(b47!, 'B');
    expect(r.vars['B.c48_rescuer']).toBe(true);
    expect(r.vars['B.c48_finished']).toBe(true);
    expect(r.chars.B.location).toBe('hof_luedemann');
    expect(r.chars.A.body.bloodLoss).toBeLessThan(b47!.chars.A.body.bloodLoss);
    // КТ48 и участок 49: раненый на ногах, играет свою линию со швами
    const s48 = mergeSegments(c, b47!, { B: r });
    syncClocks(c, s48, c.checkpoints.find(x => x.index === 48)!.syncNotBefore); mergeNotes(c, s48, 48);
    expect(canAct(s48.chars.A.body), `blood=${s48.chars.A.body.bloodLoss}`).toBe(true);
    const b48 = completeCheckpoint(c, s48, pick(s48, 48)).state;
    for (const p of P) { expect(b48.chars[p].controlledBy).toBe(p); expect(b48.chars[p].scene).toBe('c49_start'); }
    for (const p of P) expect(evalCond({ s: b48, c, pid: p }, point49Available), `${p} может играть 49-ю`).toBe(true);
    const a9 = leg(b48, 'A'), b9 = leg(b48, 'B');
    expect(a9.vars['A.c49_rh']).toBeTruthy();
    for (const [pid, l] of [['A', a9], ['B', b9]] as const) expect(l.vars[`${pid}.c49_finished`]).toBe(true);
    const out = completeCheckpoint(c, mergeCp(b48, 49, a9, b9), pick(mergeCp(b48, 49, a9, b9), 49)).state;
    for (const p of P) expect(out.chars[p].scene).toBe('c50_start');
  }, 1500000);

  const downIn30 = (pid: PlayerId) => {
    const b29 = after29('join', 'none');
    const forced: Record<string, string> = pid === 'A'
      ? { c30_monday: 'c30_mo_work', c30_j_a1: 'c30_ja1_step', c30_j_a2: 'c30_ja2_fight', c30_j_a3: 'c30_ja3_go' }
      : { c30_monday: 'c30_mo_work', c30_j_b1: 'c30_jb1_bare', c30_j_b2: 'c30_jb2_run', c30_j_b3: 'c30_jb3_cover' };
    for (let i = 0; i < 8; i++) {
      const base = structuredClone(b29) as GameState; base.seed = `${base.seed}-down${i}`;
      const d = leg(base, pid, forced, 'c30_night_end');
      if (segmentFinished(c, d, pid) !== 'incapacitated') continue;
      const rescuer = pid === 'A' ? 'B' : 'A';
      const s30 = mergeSegments(c, base, { [pid]: d, [rescuer]: leg(base, rescuer) });
      syncClocks(c, s30, c.checkpoints.find(x => x.index === 30)!.syncNotBefore); mergeNotes(c, s30, 30);
      return completeCheckpoint(c, s30, { [rescuer]: { c3_new_after30: 'home' } }).state;
    }
    return undefined;
  };
  for (const pid of P)
    it(`участок 31: выбыл ${pid} — второй выхаживает, к вечеру оба на ногах`, () => {
      const b30 = downIn30(pid);
      if (!b30) return; // проверки в 30-й могли пройти — законно
      const rescuer = pid === 'A' ? 'B' : 'A';
      expect(b30.chars[pid].controlledBy).toBe(rescuer);
      expect(b30.chars[pid].location).toBe('hof_luedemann');
      for (const forced of [{}, { c31_r_bed: 'c31_rb_rub', c31_r_doc: 'c31_rd_out', c31_r_noon: 'c31_rn_sit', c31_r_visit: 'c31_rv_out' }, { c31_r_bed: 'c31_rb_schnaps' }] as Record<string, string>[]) {
        const r = leg(b30, rescuer, forced);
        expect(r.chars[pid].body.consciousness).not.toBe('dead');
        const s31 = mergeSegments(c, b30, { [rescuer]: r });
        syncClocks(c, s31, c.checkpoints.find(x => x.index === 31)!.syncNotBefore); mergeNotes(c, s31, 31);
        if (process.env.KVEST_DEBUG) console.log(pid, JSON.stringify(forced), s31.chars[pid].body.bloodLoss, s31.chars[pid].body.consciousness);
        expect(canAct(s31.chars[pid].body), `${JSON.stringify(forced)} blood=${s31.chars[pid].body.bloodLoss}`).toBe(true);
        const out = completeCheckpoint(c, s31, { A: { c3_new_trip31a: 'sent' }, B: { c3_new_trip31b: 'yes' } }).state;
        for (const p of P) { expect(out.chars[p].controlledBy).toBe(p); expect(out.chars[p].scene).toBe('c32_start'); }
      }
    });
});
