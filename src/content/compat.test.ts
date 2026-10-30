// Совместимость сохранений: когда настоящая игра началась, историю только дописывают.
// fixtures/release-1.json — журналы, сыгранные на выпущенной версии: новая глава обязана воспроизводить их бит в бит.
// Пока игра тестовая (CLAUDE.md), журнал пересоздают после правок механики: удалить файл и выполнить команду ниже.
// Создать: KVEST_FIXTURE=release-N npx vitest run src/content/compat.test.ts
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions } from '../engine/actions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, syncClocks } from '../engine/checkpoint';
import type { Content } from '../engine/content-types';
import { newGame, play, replayPrefix, upgradeState, type ActionRecord } from '../engine/game';
import { stateHash } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import {
  acceptInvite, acceptJoin, acceptPartnerSegment, act, createInvite, mySegmentCode, readInvite, refreshSave, START_TIME, type LocalSave,
} from '../app/session';
import { isServiceAction } from '../engine/actions';
import { segmentFinished } from '../engine/game';
import { unit } from '../engine/rng';
import { content as c } from './index';

const players = {
  A: { name: { nom: 'Андрей', gen: 'Андрея', dat: 'Андрею', acc: 'Андрея', ins: 'Андреем', pre: 'Андрее' } },
  B: { name: { nom: 'Аня', gen: 'Ани', dat: 'Ане', acc: 'Аню', ins: 'Аней', pre: 'Ане' } },
};
const FIXTURES = new URL('./fixtures/', import.meta.url);

interface Leg { base: GameState; records: Record<PlayerId, ActionRecord[]>; endHash: Record<PlayerId, string> }
interface Fixture { content: string; legs: Leg[] }

const noLog = (s: GameState): GameState => ({ ...s, log: [] });

function play1(s: GameState, pid: PlayerId, plans: string[][]): ActionRecord[] {
  const recs: ActionRecord[] = [];
  for (const plan of plans) { recs.push({ scene: s.chars[pid].scene, plan }); play(c, s, pid, plan); }
  return recs;
}

function checkpoint(base: GameState, A: GameState, B: GameState, answers: Record<PlayerId, Record<string, string>>) {
  const merged = mergeSegments(c, base, { A, B });
  const cp = c.checkpoints.find((x) => x.index === base.checkpoint + 1)!;
  syncClocks(c, merged, cp.syncNotBefore);
  deliverMessages(c, merged);
  mergeNotes(c, merged, cp.index);
  return completeCheckpoint(c, merged, answers).state;
}

/** Три участка главы 1 по главной линии «B едет к A». */
function buildFixture(): Fixture {
  const A1 = [['dress', 'warm', 'pack', 'docs', 'window'], ['alert', 'kitchen'], ['door'], ['ask'], ['open'], ['ask_more', 'promise'], ['look'], ['examine'], ['carry'],
    ['to_car'], ['window', 'go'], ['guard'], ['tent'], ['ask', 'tell'], ['comfort'], ['take_home'], ['tea', 'food'], ['radio'], ['leave'], ['yard'], ['car'],
    ['fuel', 'glovebox', 'charge'], ['to_deniz'], ['news', 'petrol'], ['help'], ['farm', 'buy'], ['hamburg'], ['shelter'], ['refuel'], ['stay'], ['stay'], ['cp1_call']];
  const B1 = [['dress', 'warm', 'docs', 'pack'], ['news', 'alert'], ['kitchen'], ['talk', 'fridge', 'insulin_more', 'card'], ['breakfast'], ['peephole'], ['ask'], ['open'],
    ['coffee', 'insulin'], ['back'], ['tell_merle', 'chain'], ['out'], ['nowak'], ['ask', 'pump'], ['help'], ['merle'], ['self'], ['back'], ['yard'], ['check', 'pump'], ['home'],
    ['street'], ['pharmacy'], ['queue'], ['insulin', 'ask', 'cooler'], ['out'], ['kiosk'], ['headlamp', 'map', 'talk', 'batteries'], ['back'], ['home'], ['home'], ['kitchen'],
    ['give_insulin', 'cooler'], ['hall'], ['okafor_open'], ['listen', 'stay', 'merle'], ['back'], ['room'], ['wait_hour'], ['wait_hour'], ['cp1_call']];
  const A2 = [['back_deniz_workshop'], ['car'], ['to_farm'], ['deniz', 'honest'], ['henrike'], ['offer_work', 'offer_fuel', 'tell_news', 'partner'], ['ask'], ['leave'], ['car'], ['to_home'],
    ['back'], ['up'], ['water'], ['wait_hour'], ['wait_hour'], ['wait_hour'], ['cp2_wait']];
  const B2 = [['go'], ['helmet', 'merle_bye', 'okafor'], ['ride'], ['on'], ['shop'], ['on'], ['help'], ['check'], ['pass'], ['on'], ['splint'], ['on'], ['detour'], ['cross'],
    ['south'], ['ride'], ['ride'], ['arrive'], ['door']];
  const legs: Leg[] = [];
  let base = newGame(c, { pairId: 'fixture', seed: 'release-1', startTime: START_TIME, players });
  for (const [plansA, plansB, answers] of [[A1, B1, { A: { meet: 'b_to_a' }, B: { meet: 'b_to_a' } }], [A2, B2, { A: { shelter: 'farm' }, B: { shelter: 'farm' } }]] as const) {
    const a = structuredClone(base);
    const b = structuredClone(base);
    const records = { A: play1(a, 'A', plansA as string[][]), B: play1(b, 'B', plansB as string[][]) };
    legs.push({ base: noLog(base), records, endHash: { A: stateHash(a), B: stateHash(b) } });
    base = checkpoint(base, a, b, answers as Record<PlayerId, Record<string, string>>);
  }
  legs.push({ base: noLog(base), records: { A: [], B: [] }, endHash: { A: stateHash(base), B: stateHash(base) } });
  return { content: c.version, legs };
}

const target = process.env.KVEST_FIXTURE;
if (target) {
  const file = new URL(`${target}.json`, FIXTURES);
  if (existsSync(file)) throw new Error(`${target}.json уже есть — выпущенные журналы не перезаписываются`);
  writeFileSync(file, JSON.stringify(buildFixture()));
}

const releases = ['release-1'].filter((r) => existsSync(new URL(`${r}.json`, FIXTURES)));

describe.runIf(releases.length > 0)('сохранения прошлых версий продолжают играть', () => {
  for (const r of releases) {
    const fx = JSON.parse(readFileSync(new URL(`${r}.json`, FIXTURES), 'utf8')) as Fixture;
    it(`${r}: журналы повторяются бит в бит, после «довоза» игра продолжается`, () => {
      for (const leg of fx.legs) {
        for (const pid of ['A', 'B'] as const) {
          const { state, applied } = replayPrefix(c, leg.base, pid, leg.records[pid]);
          expect(applied, `${pid}: действие №${applied + 1} больше невозможно`).toBe(leg.records[pid].length);
          expect(stateHash(state), `${pid}: сыгранный участок посчитался иначе — изменилось поведение прошлых сцен`).toBe(leg.endHash[pid]);
        }
      }
      const last = structuredClone(fx.legs[fx.legs.length - 1].base);
      upgradeState(c, last);
      for (const pid of ['A', 'B'] as const) expect(() => availableActions({ s: last, c, pid })).not.toThrow();
    });
  }
});

describe('обновление игры посреди участка', () => {
  const start = (): LocalSave => {
    const base = newGame(c, { pairId: 'p', seed: 'upd', startTime: START_TIME, players });
    let save: LocalSave = { schema: 1, me: 'A', pairId: 'p', secret: 'x', seed: 'upd', phase: 'playing', setups: players, base, baseHash: stateHash(base),
      state: structuredClone(base), segment: [], hashes: [stateHash(base)], playSeconds: 0, updatedAt: 0 };
    for (const plan of [['dress', 'window'], ['kitchen'], ['leave']]) save = act(c, save, plan);
    return save;
  };
  const withWake = (actions: (a: Content['scenes'][string]['actions']) => Content['scenes'][string]['actions'], extra: Partial<Content> = {}): Content => ({
    ...c, ...extra, scenes: { ...c.scenes, a_wake: { ...c.scenes.a_wake, actions: actions(c.scenes.a_wake.actions) } },
  });

  it('правка текста уже сыгранного действия ничего не ломает', () => {
    const save = start();
    const edited = withWake((acts) => acts.map((a) => (a.id === 'window' ? { ...a, text: (a.text ?? '') + ' Новая фраза.' } : a)));
    const fresh = refreshSave(edited, save);
    expect(fresh.segment).toEqual(save.segment);
    expect(stateHash(fresh.state)).toBe(stateHash(save.state));
    expect(fresh.notice).toBeUndefined();
  });

  it('новые NPC и переменные главы доезжают в идущую игру, сыгранное не меняется', () => {
    const save = start();
    const npc = { ...c.npcs.deniz, id: 'new_npc' };
    const newer: Content = { ...c, npcs: { ...c.npcs, new_npc: npc }, initialVars: { ...c.initialVars, 'w.new_var': 7 },
      initialPlaceItems: [...(c.initialPlaceItems ?? []), { type: 'water_05', at: 'a_flat', key: 'ch2-water' }] };
    const fresh = refreshSave(newer, save);
    expect(fresh.segment).toEqual(save.segment);
    for (const s of [fresh.base!, fresh.state!]) {
      expect(s.npcs.new_npc).toBeTruthy();
      expect(s.vars['w.new_var']).toBe(7);
      expect(s.items['it-K-ch2-water']?.at).toEqual({ kind: 'place', id: 'a_flat' });
    }
    expect(refreshSave(newer, fresh).baseHash).toBe(fresh.baseHash);
  });

  it('если сыгранное действие исчезло, участок обрезается перед ним и игрок предупреждён', () => {
    const save = start();
    const cut = withWake((acts) => acts.filter((a) => a.id !== 'kitchen'));
    const fresh = refreshSave(cut, save);
    expect(fresh.segment.length).toBe(1);
    expect(fresh.notice).toMatch(/отменены/);
    expect(fresh.state!.chars.A.scene).toBe('a_wake');
  });
});

describe('контрольная точка на двух телефонах', () => {
  const forms = (n: string) => ({ nom: n, gen: n, dat: n, acc: n, ins: n, pre: n });
  const toCheckpoint = (save: LocalSave, tag: string): LocalSave => {
    for (let i = 0; i < 300 && save.phase === 'playing' && !segmentFinished(c, save.state!, save.me); i++) {
      const pool = availableActions({ s: save.state!, c, pid: save.me }).filter((a) => a.enabled && !isServiceAction(a.def.id) && a.def.id !== 'u:sleep');
      const story = pool.filter((a) => !a.universal);
      const from = story.length && unit(`${tag}:${i}`) < 0.9 ? story : pool;
      save = act(c, save, [from[Math.floor(unit(`${tag}:${i}:p`) * from.length)].def.id]);
    }
    return save;
  };

  it('ход партнёра пришёл первым, приложение перезапустилось — свой код хода всё равно принимается', async () => {
    const inv = await createInvite(c, 'A', { name: forms('А') });
    const joined = await acceptInvite(c, await readInvite(c, inv.code), { name: forms('Б') });
    let A = toCheckpoint(await acceptJoin(c, inv.save, joined.code), 'cp2ph:A');
    const B = toCheckpoint(joined.save, 'cp2ph:B');
    const before = stateHash(A.state);
    A = await acceptPartnerSegment(c, A, await mySegmentCode(c, B));
    expect(stateHash(A.state), 'слияние изменило сыгранный участок').toBe(before);
    A = refreshSave(c, structuredClone(A));
    const merged = await acceptPartnerSegment(c, B, await mySegmentCode(c, A));
    expect(merged.cp!.mergedHash).toBe(A.cp!.mergedHash);
  });
});
