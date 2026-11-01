// Прохождение «как игрок» для проверок качества и стенограмм (не входит в игру: импортируют только тесты).
// Пара проходит игру с первой минуты; на каждом экране игрок «любопытный» (пробует новое, потом идёт к точке)
// или «спешащий». Собирается статистика участков и, по желанию, текст — ровно то, что увидел бы игрок.
import { availableActions, isServiceAction } from '../engine/actions';
import { evalCond } from '../engine/conditions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, syncClocks } from '../engine/checkpoint';
import { newGame, play, segmentFinished } from '../engine/game';
import { unit } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import { fmt, type Ctx } from '../engine/world';
import { START_TIME } from '../app/session';
import { content as c } from './index';

export const players = {
  A: { name: { nom: 'Андрей', gen: 'Андрея', dat: 'Андрею', acc: 'Андрея', ins: 'Андреем', pre: 'Андрее' } },
  B: { name: { nom: 'Аня', gen: 'Ани', dat: 'Ане', acc: 'Аню', ins: 'Аней', pre: 'Ане' } },
};
export const lastCp = Math.max(...c.checkpoints.map((x) => x.index));

export const clock = (t: number) => {
  const d = new Date(Date.UTC(2026, 10, 10, 0, t));
  return `${d.getUTCDate()}.11 ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};
const leadsToCheckpoint = (goto?: string) => !!goto && c.scenes[goto]?.checkpoint !== undefined;
const isRisky = (a: ReturnType<typeof availableActions>[number]) =>
  !!a.def.risky || !!a.def.outcomes?.some((o) => !!o.check || o.chance !== undefined) || JSON.stringify(a.def).includes('"injure"') || JSON.stringify(a.def).includes('biteArm');

export interface SegStats {
  n: number; pid: PlayerId; steps: number; choiceScreens: number; oneButton: number; interrupts: number;
  riskyOffered: number; minTemp: number; worst: string; place: string; stuck: boolean; scenes: Set<string>;
}

export function playSegment(s: GameState, pid: PlayerId, n: number, tag: string, policy: 'curious' | 'hasty', out: string[] | null): SegStats {
  const seen = new Set<string>();
  const ch = s.chars[pid];
  const st: SegStats = { n, pid, steps: 0, choiceScreens: 0, oneButton: 0, interrupts: 0, riskyOffered: 0, minTemp: 99, worst: 'awake', place: ch.location, stuck: false, scenes: new Set() };
  for (let step = 0; step < 400 && !segmentFinished(c, s, pid); step++) {
    const ctx: Ctx = { s, c, pid };
    const sc = c.scenes[ch.scene];
    st.scenes.add(sc.id);
    const all = availableActions(ctx).filter((a) => !isServiceAction(a.def.id) && a.def.id !== 'u:sleep');
    const enabled = all.filter((a) => a.enabled);
    const story = enabled.filter((a) => !a.universal);
    if (out) {
      out.push('', `── ${clock(ch.time)} · ${sc.title}  [${sc.id} @${ch.location}]`);
      for (const b of sc.text) if (evalCond(ctx, b.when)) out.push(fmt(ctx, b.text));
      for (const a of all.filter((x) => !x.universal)) out.push(`   ${a.enabled ? '·' : '×'} ${fmt(ctx, a.def.label)}${a.enabled ? '' : ` (${a.reason ?? 'недоступно'})`}`);
    }
    const real = story.filter((a) => !/wait/.test(a.def.id));
    if (real.length >= 3) st.choiceScreens++;
    if (real.length === 1 && !story.some((a) => /wait/.test(a.def.id))) st.oneButton++;
    if (real.some(isRisky)) st.riskyOffered++;
    // Поесть/попить, если совсем плохо (как сделал бы живой игрок).
    const need = ch.body.thirst > 70 || ch.body.hunger > 80;
    const care = need ? enabled.filter((a) => a.universal && /drink|eat/.test(a.def.id)) : [];
    const fresh = story.filter((a) => !seen.has(a.def.id) && !/wait/.test(a.def.id) && !leadsToCheckpoint(a.def.goto));
    const toCp = story.filter((a) => leadsToCheckpoint(a.def.goto));
    const waits = story.filter((a) => /wait|_sleep$/.test(a.def.id));
    const terminal = story.filter((a) => a.def.terminal);
    const pool = care.length ? care
      : policy === 'hasty' ? (toCp.length ? toCp : waits.length ? waits : terminal.length ? terminal : story)
      : fresh.length ? fresh : toCp.length ? toCp : story.length ? story : enabled;
    if (!pool.length) { st.stuck = true; out?.push('!!! НЕТ ДОСТУПНЫХ ДЕЙСТВИЙ'); break; }
    const pick = pool[Math.floor(unit(`${tag}:${step}`) * pool.length)];
    seen.add(pick.def.id);
    const fired = new Set(Object.keys(s.firedEvents));
    const res = play(c, s, pid, [pick.def.id]);
    st.steps++;
    const hits = Object.keys(s.firedEvents).filter((k) => !fired.has(k)).map((k) => c.events.find((e) => e.id === k.split('@')[0]));
    if (hits.some((e) => e?.interrupt)) st.interrupts++;
    if (out) {
      out.push(`   ▶ ${fmt(ctx, pick.def.label)}`);
      for (const r of res.steps) for (const t of r.text) out.push(`     ${t}`);
      if (res.stopped) out.push(`     [прервано: ${res.stopped}]`);
    }
    st.minTemp = Math.min(st.minTemp, ch.body.coreTemp);
    if (ch.body.consciousness !== 'awake' && ch.body.consciousness !== 'asleep') st.worst = ch.body.consciousness;
  }
  if (!segmentFinished(c, s, pid)) st.stuck = true;
  return st;
}

export interface GameRun { segments: SegStats[]; lines: string[]; summary: string[]; skipped?: boolean }
export interface PlayOptions {
  seed: string; name?: string; from?: number; to?: number; answers?: Record<string, string>;
  policy?: 'curious' | 'hasty'; policyFrom?: number; write?: boolean;
  /** Пропустить прохождение, если к началу участка `from` ни один игрок не стоит здесь (и не вместе при together). */
  want?: string; together?: boolean;
}

export function playGame(o: PlayOptions): GameRun {
  const from = o.from ?? 1, to = o.to ?? lastCp, answersWanted = o.answers ?? {};
  const run: GameRun = { segments: [], lines: [], summary: [] };
  let base = newGame(c, { pairId: 'transcript', seed: `${o.name ?? 'play'}:${o.seed}`, startTime: START_TIME, players });
  for (let n = 1; n <= to && !base.ended; n++) {
    const write = !!o.write && n >= from;
    if (n === from && o.want) {
      const here = (['A', 'B'] as const).some((p) => base.chars[p].location === o.want);
      if (!here || (o.together && !base.vars['w.together'])) return { ...run, skipped: true };
    }
    const ends = {} as Record<PlayerId, GameState>;
    for (const pid of ['A', 'B'] as const) {
      const s = structuredClone(base);
      const lines: string[] | null = write ? [] : null;
      const policy = o.policy === 'hasty' && n >= (o.policyFrom ?? 1) ? 'hasty' : 'curious';
      const st = playSegment(s, pid, n, `${o.seed}:${n}:${pid}`, policy, lines);
      ends[pid] = s;
      run.segments.push(st);
      const ch = s.chars[pid];
      const line = `участок ${n} ${pid}: шагов ${st.steps}, экранов с выбором (3+) ${st.choiceScreens}, экранов с единственной кнопкой ${st.oneButton}, прерываний ${st.interrupts}, экранов с риском ${st.riskyOffered}, мин. температура ${st.minTemp.toFixed(1)}, ${st.worst}; ${st.place} → ${ch.location} ${clock(ch.time)}`;
      run.summary.push(line);
      if (lines) run.lines.push('', '', `════════ УЧАСТОК ${n} — ${pid} (${players[pid].name.nom}) ════════`, ...lines, '', `[${line}]`);
    }
    const merged = mergeSegments(c, base, ends);
    const cp = c.checkpoints.find((x) => x.index === n)!;
    syncClocks(c, merged, cp.syncNotBefore);
    deliverMessages(c, merged);
    const before = merged.log.length;
    mergeNotes(c, merged, n);
    const answers: Partial<Record<PlayerId, Record<string, string>>> = {};
    const asked: string[] = [];
    for (const id of cp.joint) {
      const d = c.joint[id];
      for (const p of participants(c, merged, d)) {
        const ctx: Ctx = { s: merged, c, pid: p };
        const opts = optionsFor(c, merged, d, p);
        const pick = opts.find((x) => x.id === answersWanted[id]) ?? opts[Math.floor(unit(`${o.seed}:${id}:${p}`) * opts.length)];
        (answers[p] ??= {})[id] = pick.id;
        asked.push(`${p}: ${fmt(ctx, d.prompt[p] ?? d.prompt.default)}`, ...opts.map((x) => `   ${x === pick ? '▶' : '·'} ${fmt(ctx, x.label[p] ?? x.label.default)}`));
      }
    }
    const res = completeCheckpoint(c, merged, answers);
    if (write) {
      run.lines.push('', '', `════════ КТ ${n} «${cp.title}» ════════`, ...merged.log.slice(before).map((e) => `· ${e.text}`), ...asked);
      for (const j of res.joint) run.lines.push(`= ${j.id}: ${j.applied.join(', ')} — ${fmt({ s: res.state, c, pid: 'A' }, j.reason ?? '')}`);
      run.lines.push(...res.state.log.slice(merged.log.length).map((e) => `· ${e.text}`));
    }
    base = res.state;
  }
  return run;
}
