// Логика главы 1: исправленные несостыковки сюжета и мира. Каждая проверка — на конкретную ошибку,
// которую легко повторить в главе 2 (расход вещей, события «не в своё время», NPC не там, невыполнимые решения).
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { evalCond } from '../engine/conditions';
import { mergeNotes, resolveJoint } from '../engine/checkpoint';
import { newGame, play } from '../engine/game';
import { at } from '../engine/time';
import type { GameState, PlayerId } from '../engine/types';
import { START_TIME } from '../app/session';
import { content as c } from './index';

const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
const game = (seed = 'logic') => newGame(c, { pairId: 'p', seed, startTime: START_TIME, players: { A: { name: forms('Андрей') }, B: { name: forms('Аня') } } });

/** Поставить игрока в сцену и место на нужное время (часы партнёра не трогаем). */
function put(s: GameState, pid: PlayerId, scene: string, time: number, location = c.scenes[scene].location) {
  const ch = s.chars[pid];
  ch.scene = scene;
  if (location) ch.location = location;
  ch.time = time;
}
const ids = (s: GameState, pid: PlayerId) => availableActions({ s, c, pid }).filter((a) => !a.universal).map((a) => a.def.id);
const enabled = (s: GameState, pid: PlayerId, id: string) => availableActions({ s, c, pid }).find((a) => a.def.id === id)?.enabled;
const item = (s: GameState, type: string, pid: PlayerId = 'A') => Object.values(s.items).filter((i) => i.type === type && i.qty > 0 && i.at.kind === 'char' && i.at.id === pid);
const carTo = (s: GameState, place: string, fuel: number) => {
  const car = Object.values(s.items).find((i) => i.type === 'opel_corsa')!;
  car.at = { kind: 'place', id: place };
  car.fuel = fuel;
};
const pickup = (s: GameState, pid: PlayerId, type: string) => {
  const it = Object.values(s.items).find((i) => i.type === type && i.at.kind === 'place')!;
  it.at = { kind: 'char', id: pid };
};

describe('глава 1: логика сцен и мира', () => {
  it('перевязать чужую рану — одна перевязка из аптечки, а не вся аптечка', () => {
    const s = game();
    pickup(s, 'A', 'first_aid');
    put(s, 'A', 'a_house7', at(10, 7, 15));
    play(c, s, 'A', ['bandage']);
    const kit = item(s, 'first_aid');
    expect(kit.length).toBe(1);
    expect(kit[0].uses).toBe(3);
  });

  it('утренние события не срабатывают, когда игрок вернулся домой днём', () => {
    const s = game();
    // B ушла из дома до 07:20 и вернулась после обеда: Окафор со смены пришёл давно, «шагов на площадке» нет.
    put(s, 'B', 'b_street', at(10, 14, 50));
    s.vars['B.seg2'] = true;
    play(c, s, 'B', ['home']);
    play(c, s, 'B', ['home']);
    expect(s.chars.B.location).toBe('b_flat');
    expect(s.firedEvents.ev_okafor_home).toBeUndefined();
  });

  it('крик снизу — только пока Ильзе там и ещё не укушена; позже A не «бросается на крик»', () => {
    const s = game();
    s.vars['A.seg2'] = true;
    put(s, 'A', 'a_market', at(10, 11, 0));
    for (let i = 0; i < 6; i++) play(c, s, 'A', ['u:rest']);
    expect(s.npcs.ilse.location).toBe('a_hospital'); // укушена в 11:50, в 13:00 ушла сама
    play(c, s, 'A', ['walk_home']);
    play(c, s, 'A', ['stairs']);
    expect(s.firedEvents.ev_scream).toBeUndefined();
    expect(ids(s, 'A')).not.toContain('brock_scream');
    expect(ids(s, 'A')).toContain('brock_late');
  });

  it('пока Брокманы на руках у A, к контрольной точке не уйти, а довести/передумать можно и после 14:00', () => {
    const s = game();
    pickup(s, 'A', 'car_keys');
    s.vars['A.driving_brockmanns'] = true;
    put(s, 'A', 'a_tbc', at(10, 12, 40));
    expect(ids(s, 'A')).not.toContain('cp1_call');
    put(s, 'A', 'a_tbc', at(10, 14, 30));
    expect(ids(s, 'A')).toEqual(expect.arrayContaining(['to_car', 'brock_back']));
    play(c, s, 'A', ['brock_back']);
    expect(ids(s, 'A')).toContain('cp1_call');
  });

  it('супермаркет: до восьми не открыт, пойманного на краже обратно не пускают', () => {
    const s = game();
    put(s, 'A', 'a_market', at(10, 7, 0));
    expect(enabled(s, 'A', 'queue')).toBe(false);
    put(s, 'A', 'a_market', at(10, 9, 0));
    expect(enabled(s, 'A', 'queue')).toBe(true);
    s.vars['A.stole_market'] = 'caught';
    expect(ids(s, 'A')).not.toContain('queue');
  });

  it('бензин Дениза — в канистру A, если она при нём: канистра у A одна', () => {
    const s = game();
    const can = Object.values(s.items).find((i) => i.type === 'can_petrol_10');
    expect(can).toBeUndefined();
    put(s, 'A', 'a_deniz', at(10, 9, 0));
    play(c, s, 'A', ['u:rest']); // в мастерской
    // Пустая канистра с заправки.
    s.items['it-test-can'] = { id: 'it-test-can', type: 'can_petrol_10', qty: 1, condition: 100, fuel: 0, at: { kind: 'char', id: 'A' }, changedAt: 0 };
    s.npcs.deniz.trust.A = 30;
    play(c, s, 'A', ['petrol']);
    play(c, s, 'A', ['buy']);
    const cans = item(s, 'can_petrol_10');
    expect(cans.length).toBe(1);
    expect(cans[0].fuel).toBe(10);
  });

  it('Янник выходит, если A разворачивается из пробки назад, — а не едет с ним в Buchholz', () => {
    const s = game();
    s.vars['A.seg2'] = true;
    pickup(s, 'A', 'car_keys');
    carTo(s, 'a7_jam', 10);
    s.npcs.jannik.location = 'a_car';
    put(s, 'A', 'a2_jam', at(10, 15, 0));
    play(c, s, 'A', ['u_turn']);
    expect(s.chars.A.scene).toBe('a2_harburg');
    expect(s.npcs.jannik.location).toBe('a7_jam');
  });

  it('ждать партнёра «у дома» — значит в квартире: домофон на КТ 2 засчитывается как встреча', () => {
    const s = game();
    s.vars['B.seg2'] = true;
    s.vars['B.partner_coming'] = true;
    put(s, 'B', 'b_street', at(10, 18, 0));
    play(c, s, 'B', ['cp2_wait']);
    expect(s.chars.B.location).toBe('b_flat');
    put(s, 'A', 'a_cp2', at(10, 18, 10), 'b_street');
    s.vars['A.at_b_door'] = true;
    s.chars.B.time = at(10, 18, 10);
    mergeNotes(c, s, 2);
    expect(s.vars['w.together']).toBe(true);
  });

  it('КТ 1: «A едет за B» невыполнимо с полупустым баком или если B уже в Ahrensburg', () => {
    const low = game();
    carTo(low, 'a_yard', 5);
    expect(resolveJoint(c, low, 'meet', { A: 'a_to_b', B: 'a_to_b' }).applied).not.toEqual(['a_to_b']);
    const away = game();
    away.chars.B.location = 'ahrensburg';
    const r = resolveJoint(c, away, 'meet', { A: 'a_to_b', B: 'a_to_b' });
    expect(r.applied).toEqual(['wait']);
  });

  it('КТ 2: мастерская — только если Дениз этой ночью там', () => {
    const s = game();
    s.vars['w.together'] = true;
    s.vars['w.deniz_shelter'] = true;
    for (const p of ['A', 'B'] as const) s.knowledge[p].f_deniz_shelter = { kind: 'fact', at: 0, source: 't' };
    s.npcs.deniz.location = 'hof_luedemann';
    expect(resolveJoint(c, s, 'shelter', { A: 'workshop', B: 'workshop' }).applied).not.toEqual(['workshop']);
    s.npcs.deniz.location = 'deniz_workshop';
    expect(resolveJoint(c, s, 'shelter', { A: 'workshop', B: 'workshop' }).applied).toEqual(['workshop']);
  });

  it('Новаки уехали, пока B у них, — договариваться уже не с кем', () => {
    const s = game();
    put(s, 'B', 'b_nowak', at(10, 13, 50));
    play(c, s, 'B', ['help']); // полчаса таскать сумки — в 14:05 они уезжают
    expect(s.chars.B.time).toBeGreaterThanOrEqual(at(10, 14, 5));
    expect(s.npcs.dariusz.location).toBe('gone_east');
    expect(ids(s, 'B')).toEqual(['back']);
  });

  it('Сабине отливают пять литров — канистра A действительно теряет их', () => {
    const s = game();
    s.vars['A.seg2'] = true;
    pickup(s, 'A', 'car_keys');
    carTo(s, 'a_road', 10);
    s.items['it-test-can'] = { id: 'it-test-can', type: 'can_petrol_10', qty: 1, condition: 100, fuel: 10, at: { kind: 'char', id: 'A' }, changedAt: 0 };
    put(s, 'A', 'a2_road_north', at(10, 13, 0));
    play(c, s, 'A', ['polo']);
    play(c, s, 'A', ['give_fuel']);
    expect(s.items['it-test-can'].fuel).toBe(5);
  });

  it('канистру можно залить в бак из машины, а не только в мастерской Дениза', () => {
    const s = game();
    pickup(s, 'A', 'car_keys');
    carTo(s, 'a_yard', 4);
    s.items['it-test-can'] = { id: 'it-test-can', type: 'can_petrol_10', qty: 1, condition: 100, fuel: 10, at: { kind: 'char', id: 'A' }, changedAt: 0 };
    put(s, 'A', 'a_drive', at(10, 9, 0), 'a_yard');
    play(c, s, 'A', ['pour']);
    expect(Object.values(s.items).find((i) => i.type === 'opel_corsa')!.fuel).toBe(14);
    expect(s.items['it-test-can'].fuel).toBe(0);
  });

  it('бензин кончился в Eppendorf или на Ring 3: дальше не уехать, но ночью есть ночлег (участок заканчивается)', () => {
    for (const [scene, loc] of [['a2_eppendorf', 'hh_eppendorf'], ['a2_ring3', 'hh_ring3']]) {
      const s = game();
      s.vars['A.seg2'] = true;
      s.vars['w.plan_a'] = 'to_b';
      pickup(s, 'A', 'car_keys');
      carTo(s, loc, 0.3);
      put(s, 'A', scene, at(10, 17, 0), loc);
      expect(availableActions({ s, c, pid: 'A' }).filter((a) => !a.universal && a.enabled)).toEqual([]);
      s.chars.A.time = at(10, 20, 40);
      expect(enabled(s, 'A', 'cp2_night')).toBe(true);
    }
  });

  it('Ильзе стучит — «выйти из квартиры» ведёт к глазку, а не мимо неё на лестницу', () => {
    const s = game();
    put(s, 'A', 'a_wake', at(10, 6, 45));
    play(c, s, 'A', ['u:rest']); // 06:50 — стук
    expect(s.vars['A.knock']).toBe(true);
    play(c, s, 'A', ['leave']);
    expect(s.chars.A.scene).toBe('a_door');
  });

  it('A убил Герда — за дверью Брокманов больше никто не дышит', () => {
    const s = game();
    s.vars['A.seg2'] = true;
    s.vars['A.brock_done'] = true;
    s.vars['A.killed_gerd'] = true;
    s.npcs.gerd.alive = false;
    s.npcs.gerd.status = 'dead';
    put(s, 'A', 'a_tbc', at(10, 19, 30));
    const ctx = { s, c, pid: 'A' as const };
    const texts = c.scenes.a_tbc.text.filter((b) => evalCond(ctx, b.when)).map((b) => b.text).join(' ');
    expect(texts).not.toMatch(/дыхание/);
    expect(ids(s, 'A')).not.toContain('listen');
  });

  it('КТ 2: «вы уже здесь, за запертой дверью» — только если встретились', () => {
    const s = game();
    s.chars.A.location = 'a_flat';
    // Оба хотят на хутор, но бензина нет: не встретились — всё остаётся как есть, без «вы уже здесь».
    carTo(s, 'a_yard', 1);
    for (const p of ['A', 'B'] as const) s.knowledge[p].f_farm = { kind: 'fact', at: 0, source: 't' };
    s.vars['w.henrike_maybe'] = true;
    expect(resolveJoint(c, s, 'shelter', { A: 'farm', B: 'farm' }).reason).not.toMatch(/Вы уже здесь/);
    s.vars['w.together'] = true;
    expect(resolveJoint(c, structuredClone(s), 'shelter', { A: 'farm', B: 'farm' }).applied).toEqual(['a_flat']);
  });
});
