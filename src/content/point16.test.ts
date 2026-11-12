import { describe, expect, it } from 'vitest';
import { completeCheckpoint } from '../engine/checkpoint';
import { applyEffects } from '../engine/effects';
import { segmentFinished } from '../engine/game';
import { evalCond } from '../engine/conditions';
import type { GameState } from '../engine/types';
import { P, acts, after8, car, leg, mergeCp, qty } from '../test/arc9kit';
import { point16Available, point17Available } from './chapter3/point16';
import { point18Available } from './chapter3/point18';
import { phone } from '../engine/world';
import { content as c } from './index';
import { knownContacts } from '../ui/people';

// Положение реальной пары: КТ9 keep, КТ10 door/barn, КТ11 report/stay, КТ12 split, КТ13 drive/walk, КТ14 give/house.
function after14(jens = 'give') {
  const b8 = after8('home');
  const both = (x: Record<string, string>, y: Record<string, string> = x) => ({ A: x, B: y });
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
  return completeCheckpoint(c, s14, both({ c3_new_jens14: jens, c3_new_nina14: 'house' })).state;
}
const answer15 = (nina: string, garden: string) => ({ A: { c3_new_nina15: nina, c3_new_garden15: garden }, B: { c3_new_nina15: nina, c3_new_garden15: garden } });
const answer16 = (albers: string, sweep: string) => ({ A: { c3_new_albers16: albers, c3_new_sweep16: sweep }, B: { c3_new_albers16: albers, c3_new_sweep16: sweep } });

describe('участки 16–17: среда', () => {
  const b14 = after14();
  const s15 = mergeCp(b14, 15, leg(b14, 'A'), leg(b14, 'B'));
  const after15 = (nina: string, garden: string) => completeCheckpoint(c, structuredClone(s15) as GameState, answer15(nina, garden)).state;

  for (const [nina, garden] of [['stay', 'help'], ['stay', 'away'], ['stay', 'tell'], ['winsen', 'help'], ['winsen', 'away'], ['winsen', 'tell']] as const)
    it(`КТ15 ${nina}/${garden}: обе линии проходят точку 16, миры сходятся`, () => {
      const b15 = after15(nina, garden);
      for (const p of P) { expect(b15.chars[p].scene).toBe('c16_start'); expect(evalCond({ s: b15, c, pid: p }, point16Available)).toBe(true); }
      const a = leg(b15, 'A', { c16_a_kerem0: 'c16_ak0_stay' }), b = leg(b15, 'B');
      expect(a.vars['A.met.c16_brandt']).toBe(true); expect(b.vars['B.met.c16_brandt']).toBeUndefined();
      expect(a.npcs.c16_brandt?.alive).toBe(true);
      for (const k of ['c16_pl', 'c16_goods', 'c16_road', 'c16_gate', 'c16_route', 'c16_stove', 'c16_ab', 'c16_bell', 'c16_aby', 'c16_mother', 'c16_doc', 'c16_aba', 'c16_ah', 'c16_d', 'c16_to', 'c16_at', 'c16_finished'])
        expect(a.vars[`A.${k}`], k).toBeDefined();
      for (const k of ['c16_pl', 'c16_bh', 'c16_gen', 'c16_bk', 'c16_bk2', 'c16_bj', 'c16_bj2', 'c16_bd', 'c16_d', 'c16_to', 'c16_bt', 'c16_finished'])
        expect(b.vars[`B.${k}`], k).toBeDefined();
      const s16 = mergeCp(b15, 16, a, b);
      expect(s16.chars.A.time).toBe(s16.chars.B.time);
      const mixed = completeCheckpoint(c, structuredClone(s16) as GameState, { A: { c3_new_albers16: 'take', c3_new_sweep16: 'warn' }, B: { c3_new_albers16: 'no', c3_new_sweep16: 'brandt' } }).state;
      expect(mixed.vars['w.c16_albers']).toBe('no'); expect(mixed.vars['w.c16_sweep']).toBe('brandt');
      for (const p of P) expect(mixed.chars[p].scene).toBe('c17_start');
    });

  const b15 = after15('stay', 'help');
  const s16 = mergeCp(b15, 16, leg(b15, 'A'), leg(b15, 'B'));

  for (const [albers, sweep] of [['take', 'warn'], ['take', 'brandt'], ['take', 'stay'], ['no', 'warn'], ['no', 'brandt'], ['no', 'stay']] as const)
    it(`КТ16 ${albers}/${sweep}: обе линии проходят точку 17, после КТ17 — продолжение`, () => {
      const b16 = completeCheckpoint(c, structuredClone(s16) as GameState, answer16(albers, sweep)).state;
      for (const p of P) { expect(b16.chars[p].scene).toBe('c17_start'); expect(evalCond({ s: b16, c, pid: p }, point17Available)).toBe(true); }
      const a = leg(b16, 'A'), b = leg(b16, 'B');
      const s17 = mergeCp(b16, 17, a, b);
      expect(s17.chars.A.time).toBe(s17.chars.B.time);
      for (const [colony, nina] of [['move', 'with'], ['stand', 'home'], ['end', 'with'], ['away', 'home']]) {
        const out = completeCheckpoint(c, structuredClone(s17) as GameState, { A: { c3_new_colony17: colony, c3_new_nina17: nina }, B: { c3_new_colony17: colony, c3_new_nina17: nina } }).state;
        expect(out.vars['w.c17_colony']).toBe(colony); expect(out.vars['w.c17_nina']).toBe(nina);
        for (const p of P) { expect(out.chars[p].scene).toBe('c18_start'); expect(out.chars[p].location).toBe('hof_luedemann'); }
      }
      const mixed = completeCheckpoint(c, structuredClone(s17) as GameState, { A: { c3_new_colony17: 'move', c3_new_nina17: 'with' }, B: { c3_new_colony17: 'end', c3_new_nina17: 'home' } }).state;
      expect(mixed.vars['w.c17_colony']).toBe('away'); expect(mixed.vars['w.c17_nina']).toBe('home');
    });

  it('Нина в Винзене: на КТ17 её можно привезти — бензин тратится один раз, Нина на хуторе', () => {
    const w15 = after15('winsen', 'away');
    const w16 = completeCheckpoint(c, mergeCp(w15, 16, leg(w15, 'A'), leg(w15, 'B', { c16_b_gen2: 'c16_bg2_keep' })), answer16('no', 'stay')).state;
    const s17w = mergeCp(w16, 17, leg(w16, 'A'), leg(w16, 'B'));
    const out = completeCheckpoint(c, structuredClone(s17w) as GameState, { A: { c3_new_colony17: 'away', c3_new_nina17: 'fetch' }, B: { c3_new_colony17: 'away', c3_new_nina17: 'fetch' } }).state;
    expect(out.vars['w.c17_nina']).toBe('fetch');
    expect(out.npcs.c7_nina.location).toBe('hof_luedemann');
    expect(car(s17w).fuel! - car(out).fuel!).toBeGreaterThan(1); expect(car(s17w).fuel! - car(out).fuel!).toBeLessThan(4);
    const split = completeCheckpoint(c, structuredClone(s17w) as GameState, { A: { c3_new_colony17: 'stand', c3_new_nina17: 'fetch' }, B: { c3_new_colony17: 'stand', c3_new_nina17: 'later' } }).state;
    expect(split.vars['w.c17_nina']).toBe('phone');
  });

  it('генератор: бензин из Corsa тратится, вечером телефон B заряжается от сети хутора; без него — нет', () => {
    const withGen = leg(b15, 'B', { c16_b_gen2: 'c16_bg2_siphon' }, 'c16_dinner');
    const noGen = leg(b15, 'B', { c16_b_gen2: 'c16_bg2_keep' }, 'c16_dinner');
    expect(car(b15).fuel! - car(withGen).fuel!).toBeCloseTo(3, 5);
    expect(car(noGen).fuel).toBe(car(b15).fuel);
    const charge = (s: GameState) => phone({ s, c, pid: 'B' })!.charge!;
    expect(charge(withGen)).toBeGreaterThan(charge(noGen));
  });

  it('обмен в деревне: своя картошка уходит, в канистре появляется бензин; браслет — настоящая вещь до Брандта', () => {
    const village = { c16_a_pack: 'c16_ap_potato', c16_a_market: 'c16_am_fuel', c16_a_kerem0: 'c16_ak0_stay', c16_a_boy: 'c16_aby_band' };
    const a = leg(b15, 'A', village, 'c16_a_home');
    expect(qty(a, 'potatoes', 'char', 'A')).toBe(qty(b15, 'potatoes', 'char', 'A') - 3);
    const can = Object.values(a.items).find(i => i.type === 'can_petrol_10' && i.at.kind === 'char')!;
    expect(can.fuel).toBe(2);
    expect(qty(a, 'c16_wristband', 'char', 'A')).toBe(1);
    const b16 = completeCheckpoint(c, mergeCp(b15, 16, leg(b15, 'A', village), leg(b15, 'B')), answer16('no', 'brandt')).state;
    const a17 = leg(b16, 'A', { c17_a_brandt: 'c17_ab_band' });
    expect(a17.vars['A.c17_brandt']).toBe('convinced');
    expect(qty(a17, 'c16_wristband', 'char', 'A')).toBe(0);
    // Еда за общим столом — из пайка, не из воздуха.
    expect(acts(leg(b16, 'B', {}, 'c17_breakfast'), 'B').find(x => x.def.id === 'c17_bf_eat')?.enabled).toBe(true);
  });

  for (const jens of ['end', 'gate'])
    it(`КТ14 ${jens} (Йенса нет): точки 16 и 17 тоже проходятся, без сцен у двенадцатого домика`, () => {
      const x14 = after14(jens);
      const x15 = completeCheckpoint(c, mergeCp(x14, 15, leg(x14, 'A'), leg(x14, 'B')), answer15('stay', 'away')).state;
      for (const p of P) expect(evalCond({ s: x15, c, pid: p }, point16Available)).toBe(true);
      const x16 = completeCheckpoint(c, mergeCp(x15, 16, leg(x15, 'A'), leg(x15, 'B')), answer16('take', 'warn')).state;
      const b = leg(x16, 'B');
      expect(b.vars['B.c17_saw_jens']).toBeUndefined(); expect(b.chars.B.visited.c17_b_jens).toBeUndefined();
      const out = completeCheckpoint(c, mergeCp(x16, 17, leg(x16, 'A'), b), { A: { c3_new_colony17: 'stand', c3_new_nina17: 'home' }, B: { c3_new_colony17: 'stand', c3_new_nina17: 'home' } }).state;
      for (const p of P) expect(out.chars[p].scene).toBe('c18_start');
    });

  it('развилки: у A деревня или трактор, у B хутор или колония; без трактора перевезти колонию нельзя', () => {
    const tractor = leg(b15, 'A', { c16_a_kerem0: 'c16_ak0_go' });
    expect(tractor.vars['w.c16_tractor']).toBe(true); expect(tractor.chars.A.visited.c16_a_brandt).toBeUndefined();
    const village = leg(b15, 'A', { c16_a_kerem0: 'c16_ak0_stay' });
    expect(village.vars['w.c16_tractor']).toBeUndefined(); expect(village.chars.A.visited.c16_a_bell).toBe(1);
    const colonyB = leg(b15, 'B', { c16_b_jannes2: 'c16_bj2_go' });
    expect(colonyB.chars.B.visited.c16_b_cw_ute).toBe(1); expect(colonyB.chars.B.visited.c16_b_bread).toBeUndefined();
    const s16 = mergeCp(b15, 16, village, colonyB);
    const b16 = completeCheckpoint(c, s16, answer16('no', 'stay')).state;
    // A без трактора: утром можно за ним сходить; B — к Брандту с Кёлер или остаться.
    const aT = leg(b16, 'A', { c17_a_choice: 'c17_ach_tractor' }), aF = leg(b16, 'A', { c17_a_choice: 'c17_ach_farm' });
    expect(aT.vars['w.c17_tractor']).toBe(true); expect(aF.vars['A.c17_afb']).toBeDefined();
    const bV = leg(b16, 'B', { c17_b_koehler: 'c17_bk_brandt' }), bF = leg(b16, 'B', { c17_b_koehler: 'c17_bk_stay' });
    expect(bV.vars['B.met.c16_brandt']).toBe(true); expect(bF.chars.B.visited.c17_b_f_msg).toBe(1);
    const noTractor = mergeCp(b16, 17, aF, bF);
    expect(c.joint.c3_new_colony17.options.filter(o => evalCond({ s: noTractor, c, pid: 'A' }, o.when)).map(o => o.id)).not.toContain('move');
    const withTractor = mergeCp(b16, 17, aT, bV);
    expect(c.joint.c3_new_colony17.options.filter(o => evalCond({ s: withTractor, c, pid: 'A' }, o.when)).map(o => o.id)).toContain('move');
    const out = completeCheckpoint(c, withTractor, { A: { c3_new_colony17: 'move', c3_new_nina17: 'home' }, B: { c3_new_colony17: 'move', c3_new_nina17: 'home' } }).state;
    expect(out.vars['w.c17_colony']).toBe('move');
  });
  // Точка 18: сутки порознь. A — хутор и колония, B — Люнебург.
  const b16w = completeCheckpoint(c, structuredClone(s16) as GameState, answer16('take', 'brandt')).state;
  const s17w = mergeCp(b16w, 17, leg(b16w, 'A'), leg(b16w, 'B'));
  const after17 = (colony: string, nina = 'home') => completeCheckpoint(c, structuredClone(s17w) as GameState,
    { A: { c3_new_colony17: colony, c3_new_nina17: nina }, B: { c3_new_colony17: colony, c3_new_nina17: nina } }).state;
  const both18 = (x: Record<string, string>) => ({ A: x, B: x });

  for (const colony of ['move', 'stand', 'end', 'away'])
    it(`КТ17 ${colony}: точка 18 проходится порознь, миры сходятся, дальше продолжение`, () => {
      const b17 = after17(colony);
      for (const p of P) expect(evalCond({ s: b17, c, pid: p }, point18Available)).toBe(true);
      const a = leg(b17, 'A'), b = leg(b17, 'B');
      expect(a.vars['w.c18_colony']).toBeDefined(); expect(a.vars['w.c18_ilse']).toBeDefined();
      expect(b.vars['w.c18_henrike']).toBeDefined(); expect(b.chars.B.visited.c18_b_ole).toBe(1);
      expect(a.chars.A.visited.c18_b_truck).toBeUndefined(); expect(b.chars.B.visited.c18_a_alone).toBeUndefined();
      for (const p of P) expect((p === 'A' ? a : b).chars[p].location).toBe('hof_luedemann');
      const s18 = mergeCp(b17, 18, a, b);
      expect(s18.chars.A.time).toBe(s18.chars.B.time);
      const out = completeCheckpoint(c, s18, both18({ c3_new_friday18: 'go', c3_new_house18: 'open' })).state;
      expect(out.vars['w.c18_friday']).toBe('go'); expect(out.vars['w.c18_house']).toBe('open');
      for (const p of P) expect(out.chars[p].scene).toBe('c19_start');
    });

  it('точка 18: развилки и потери настоящие', () => {
    const stand = after17('stand');
    const held = leg(stand, 'A', { c18_s_gate: 'c18_s1_door', c18_s_eight: 'c18_s2_stay' });
    expect(['spared', 'cleared']).toContain(held.vars['w.c18_colony']);
    if (held.vars['w.c18_colony'] === 'cleared') expect(held.vars['w.c18_a_held']).toBe(true);
    const end = leg(after17('end'), 'A', { c18_e_kai: 'c18_e3_self', c18_e_morning: 'c18_e4_farm' });
    expect(end.vars['w.c18_kai']).toBe('a'); expect(end.vars['w.c18_ute']).toBe('farm'); expect(end.vars['w.c18_colony']).toBe('ended');
    const moved = leg(after17('move'), 'A', { c18_m_second: 'c18_m4_leave', c18_m_morning: 'c18_m5_block' });
    expect(moved.vars['w.c18_moved']).toBe(4); expect(moved.vars['w.c18_tractor_lost']).toBe(true); expect(moved.vars['w.c18_a_held']).toBe(true);
    const b = leg(stand, 'B', { c18_b_fork: 'c18_bf_kitchen', c18_b_doctor: 'c18_bd_ole', c18_b_dawn: 'c18_bw_home', c18_b_lists: 'c18_bi_station' });
    expect(b.vars['w.c18_ole_rest']).toBe(true); expect(b.vars['w.c18_henrike']).toBe('home'); expect(b.npcs.henrike.location).toBe('hof_luedemann');
    expect(leg(stand, 'B', { c18_b_doctor: 'c18_bd_ole' }, 'c18_b_supper').chars.B.body.bloodLoss).toBeGreaterThan(stand.chars.B.body.bloodLoss);
    expect(leg(stand, 'B', { c18_b_dawn: 'c18_bw_stay' }).vars['w.c18_henrike_key']).toBe(true);
  });

  // Точка 19: четверг, у A хутор, у B Йестебург; КТ19 — поездка в Люнебург и ружьё.
  const after18 = (colony: string, friday = 'go', henrike?: Record<string, string>) => {
    const b17 = after17(colony);
    const s18 = mergeCp(b17, 18, leg(b17, 'A'), leg(b17, 'B', henrike ?? {}));
    return completeCheckpoint(c, s18, both18({ c3_new_friday18: friday, c3_new_house18: 'known' })).state;
  };
  for (const [colony, friday] of [['move', 'go'], ['stand', 'write'], ['end', 'no'], ['away', 'go']] as const)
    it(`КТ17 ${colony}, пятница ${friday}: точка 19 проходится, на КТ19 можно уехать в Люнебург`, () => {
      const b18 = after18(colony, friday);
      for (const p of P) expect(b18.chars[p].scene).toBe('c19_start');
      const a = leg(b18, 'A'), b = leg(b18, 'B');
      expect(a.chars.A.visited.c19_a_patrol).toBe(1); expect(b.chars.B.visited.c19_b_queue).toBe(1);
      expect(a.chars.A.visited.c19_b_queue).toBeUndefined(); expect(b.chars.B.visited.c19_a_patrol).toBeUndefined();
      const s19 = mergeCp(b18, 19, a, b);
      expect(s19.chars.A.time).toBe(s19.chars.B.time);
      const go = completeCheckpoint(c, structuredClone(s19) as GameState, both18({ c3_new_trip19: 'go', c3_new_gun19: 'lock' })).state;
      for (const p of P) { expect(go.chars[p].scene).toBe('c20_start'); expect(go.chars[p].location).toBe('c18_lueneburg'); }
      const stay = completeCheckpoint(c, structuredClone(s19) as GameState, both18({ c3_new_trip19: 'stay', c3_new_gun19: 'keep' })).state;
      for (const p of P) expect(stay.chars[p].location).toBe('hof_luedemann');
      // Точка 20 в обеих ветках: Люнебург и хутор; КТ20 — к колонне, домой в объезд или ждать.
      for (const [b19, place, fuel] of [[go, 'c18_lueneburg', 30], [stay, 'hof_luedemann', 12]] as const) {
        const a20 = leg(b19, 'A'), b20 = leg(b19, 'B');
        for (const p of P) expect((p === 'A' ? a20 : b20).chars[p].location).toBe(place);
        const s20 = mergeCp(b19, 20, a20, b20);
        expect(s20.chars.A.time).toBe(s20.chars.B.time);
        const before = car(s20).fuel!;
        const toConvoy = completeCheckpoint(c, structuredClone(s20) as GameState, both18({ c3_new_convoy20: 'go', c3_new_ole20: 'his' })).state;
        for (const p of P) { expect(toConvoy.chars[p].scene).toBe('c21_start'); expect(toConvoy.chars[p].location).toBe(before >= fuel * 0.064 ? 'c21_convoy' : place); }
        const wait = completeCheckpoint(c, structuredClone(s20) as GameState, both18({ c3_new_convoy20: 'wait', c3_new_ole20: 'promise' })).state;
        for (const p of P) expect(wait.chars[p].location).toBe(place);
        if (place === 'c18_lueneburg') {
          const home = completeCheckpoint(c, structuredClone(s20) as GameState, both18({ c3_new_convoy20: 'home', c3_new_ole20: 'enough' })).state;
          for (const p of P) expect(home.chars[p].location).toBe(before >= 48 * 0.064 ? 'hof_luedemann' : place);
        }
      }
    });

  it('точка 20: опасная сцена — осторожный не выбывает; выбывший доживает до точки, его ведёт партнёр, поездки нет', () => {
    const b18 = after18('stand');
    const s19 = mergeCp(b18, 19, leg(b18, 'A'), leg(b18, 'B'));
    const b19 = completeCheckpoint(c, s19, both18({ c3_new_trip19: 'stay', c3_new_gun19: 'keep' })).state;
    const careful = leg(b19, 'A', { c20_f_d_alarm: 'c20_fd1_door', c20_f_d_fence: 'c20_fd2_watch', c20_f_d_end: 'c20_fd3_back' });
    expect(careful.chars.A.visited.c20_f_d_end).toBe(1); expect(careful.vars['w.c20_down']).toBeUndefined();
    // Третье звено с тяжёлым исходом: A без сознания посреди участка.
    const a = leg(b19, 'A', {}, 'c20_f_d_end');
    a.vars['A.c20_out'] = true; a.vars['A.c20_d2'] = 'hurt';
    applyEffects({ s: a, c, pid: 'A' }, [{ injure: 'laceration', site: 'leftLeg', severity: 4, bleeding: 3 }, { body: 'bloodLoss', delta: 58 }]);
    expect(segmentFinished(c, a, 'A')).toBe('incapacitated');
    const s20 = mergeCp(b19, 20, a, leg(b19, 'B'));
    expect(s20.chars.A.body.consciousness).not.toBe('dead');
    const out = completeCheckpoint(c, s20, { B: { c3_new_convoy20: 'go', c3_new_ole20: 'his' } }).state;
    expect(out.chars.A.controlledBy).toBe('B'); expect(out.chars.B.scene).toBe('c21_start');
    expect(out.vars['w.c20_convoy']).not.toBe('go');
    for (const p of P) expect(out.chars[p].location).toBe('hof_luedemann');
  });

  it('точка 19: листок Оле, ружьё, солярка, пайки', () => {
    const b18 = after18('stand');
    const gun = leg(b18, 'A', { c19_a_letter: 'c19_al_cellar', c19_a_cellar: 'c19_ac_take', c19_a_diesel: 'c19_ad_dig' });
    expect(qty(gun, 'c19_flinte', 'char', 'A')).toBe(1); expect(qty(gun, 'c19_shells', 'char', 'A')).toBe(4);
    expect(gun.vars['w.c19_gun']).toBe('house'); expect(gun.chars.A.visited.c19_a_weapons).toBe(1);
    const skip = leg(b18, 'A', { c19_a_letter: 'c19_al_put' });
    expect(skip.vars['w.c19_gun']).toBeUndefined(); expect(skip.chars.A.visited.c19_a_cellar).toBeUndefined();
    const b = leg(b18, 'B', { c19_b_queue: 'c19_bq_take' });
    expect(b.vars['B.c19_bq']).toBe('take');
    const s19 = mergeCp(b18, 19, gun, b);
    const locked = completeCheckpoint(c, s19, both18({ c3_new_trip19: 'stay', c3_new_gun19: 'lock' })).state;
    expect(qty(locked, 'c19_flinte', 'place', 'c3_farm_stock')).toBe(1); expect(qty(locked, 'c19_flinte', 'char', 'A')).toBe(0);
  });

  it('запертые находки: аптечка в точке 17 и коптильня в точке 18', () => {
    const code = leg(b16w, 'B', { c17_b_pantry: 'c17_bp_417' });
    expect(qty(code, 'c17_vet_pen', 'char', 'B')).toBe(1); expect(code.chars.B.visited.c17_b_morning).toBe(1); expect(code.chars.B.visited.c17_b_pantry2).toBeUndefined();
    const brute = leg(b16w, 'B', { c17_b_pantry: 'c17_bp_538', c17_b_pantry2: 'c17_bp2_all' });
    expect(qty(brute, 'c17_vet_pen', 'char', 'B')).toBe(1); expect(brute.chars.B.visited.c17_b_morning).toBeUndefined(); expect(brute.chars.B.time).toBe(code.chars.B.time);
    const pry = leg(b16w, 'B', { c17_b_pantry: 'c17_bp_714', c17_b_pantry2: 'c17_bp2_pry' });
    expect(qty(pry, 'c17_vet_pen')).toBe(0); expect(pry.vars['w.c17_vetbox']).toBe('part');
    expect(leg(b16w, 'B', { c17_b_pantry: 'c17_bp_leave' }).vars['w.c17_vetbox']).toBeUndefined();
    const b17 = completeCheckpoint(c, mergeCp(b16w, 17, leg(b16w, 'A'), code), both18({ c3_new_colony17: 'stand', c3_new_nina17: 'home' })).state;
    expect(qty(b17, 'c17_vet_pen', 'char', 'B')).toBe(1);
    // B: флаконы вместо крови; при неудаче на КПП их отбирают; второе место достаётся живому человеку.
    const trade = leg(b17, 'B', { c18_b_doctor: 'c18_bd_pen_ole', c18_b_dawn: 'c18_bw_stay' });
    expect(trade.vars['w.c18_ole_rest']).toBe(true); expect(qty(trade, 'c17_vet_pen')).toBe(0); expect(trade.vars['B.c18_bd_paid']).toBe('pen');
    expect(leg(b17, 'B', { c18_b_doctor: 'c18_bd_pen_ole' }, 'c18_b_supper').chars.B.body.bloodLoss).toBeLessThanOrEqual(b17.chars.B.body.bloodLoss);
    expect(['eva', 'jana']).toContain(trade.vars['w.c18_seat']); expect(trade.chars.B.visited.c18_b_ward).toBe(1); expect(trade.chars.B.visited.c18_b_free).toBe(1);
    if (trade.vars['w.c18_seat'] === 'eva') expect(trade.npcs.c8_eva.location).toBe('hof_luedemann');
    expect(leg(b17, 'B', { c18_b_dawn: 'c18_bw_self', c18_b_seat: 'c18_bs2_hanna' }).vars['w.c18_seat']).toBe('hanna');
    expect(leg(b17, 'B', { c18_b_queue: 'c18_bu_doctor', c18_b_answer: 'c18_ba_man' }).vars['w.c18_ole_free_day']).toBe(true);
    // A: ключ у соли — без шума; иначе колун. Колбаса меняется на услугу.
    const key = leg(b17, 'A', { c18_a_smoke: 'c18_sm_salt', c18_a_knock: 'c18_kn_wurst', c18_a_patrol: 'c18_ap_gift' });
    expect(key.vars['w.c18_smoke']).toBe('key'); expect(key.chars.A.visited.c18_a_smoke2).toBeUndefined();
    expect(qty(key, 'c18_wurst')).toBe(0); expect(qty(key, 'c18_ham', 'place', 'c3_farm_stock')).toBe(1);
    expect(key.vars['w.c18_roofing']).toBe(true); expect(key.vars['w.c18_list_checked']).toBe(true);
    const broke = leg(b17, 'A', { c18_a_smoke: 'c18_sm_room', c18_a_smoke2: 'c18_sm2_break', c18_a_knock: 'c18_kn_in' });
    expect(broke.vars['w.c18_smoke']).toBe('broke'); expect(qty(broke, 'c18_wurst', 'char', 'A')).toBe(2); expect(broke.vars['w.c18_lodger']).toBe(true);
    const left = leg(b17, 'A', { c18_a_smoke: 'c18_sm_shop', c18_a_smoke2: 'c18_sm2_leave' });
    expect(left.vars['w.c18_smoke']).toBeUndefined(); expect(qty(left, 'c18_wurst')).toBe(0);
    expect(acts(leg(b17, 'A', { c18_a_smoke: 'c18_sm_skip' }, 'c18_a_knock'), 'A').some(x => x.def.id === 'c18_kn_wurst')).toBe(false);
    const s18 = mergeCp(b17, 18, key, trade);
    expect(s18.chars.A.time).toBe(s18.chars.B.time);
    // Карточки: каждый знает только встреченных на своей линии.
    const cards = (s: GameState, pid: 'A' | 'B') => knownContacts({ s, c, pid }).map(x => x.id);
    expect(cards(key, 'A')).toContain('c18_volker'); expect(cards(key, 'A')).not.toContain('c18_ahlers'); expect(cards(b17, 'A')).not.toContain('c18_volker');
    for (const id of ['c18_ahlers', 'c18_peters', 'c18_hanna']) expect(cards(trade, 'B'), id).toContain(id);
    expect(cards(trade, 'B')).not.toContain('c18_volker');
    expect(cards(mergeCp(b17, 18, broke, trade), 'B')).toContain('c18_volker');
  });
});
