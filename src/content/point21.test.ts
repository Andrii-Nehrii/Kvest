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
