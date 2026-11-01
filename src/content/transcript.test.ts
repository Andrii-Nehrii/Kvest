// «Прочитать главу как игрок»: пара проходит игру с первой минуты, а текст выбранных участков пишется в файл —
// ровно то, что увидел бы игрок: время, место, текст сцены, все варианты, выбранный, исход, события, заметки и
// решения на точках, состояние тела. Файл надо ПРОЧИТАТЬ целиком (docs/hidden/CHAPTER_GUIDE.md §8).
//
// Запуск (ничего не пишет без переменной KVEST_TRANSCRIPT):
//   KVEST_TRANSCRIPT=farm KVEST_FROM=5 KVEST_ANSWERS=meet=b_to_a,shelter=farm,day2=farm,day3=farm npx vitest run src/content/transcript.test.ts
// Переменные:
//   KVEST_TRANSCRIPT — имя файла: transcripts/<имя>-<сид>.txt (папка не коммитится);
//   KVEST_FROM       — с какого участка писать (участок N заканчивается КТ N), по умолчанию — последние два;
//   KVEST_ANSWERS    — ответы на совместные решения «id=вариант,…» (оба игрока отвечают одинаково; не указано или
//                      недоступно — случайный доступный вариант);
//   KVEST_SEEDS      — сиды через запятую (по умолчанию 1,2,3): разные сиды — разные пути и случайности;
//   KVEST_POLICY     — curious (по умолчанию: пробует всё новое, потом идёт к точке) или hasty (как можно быстрее к точке);
//   KVEST_WANT       — место (id локации), где хотя бы один игрок должен начать участок KVEST_FROM, например hof_luedemann:
//                      сиды перебираются (до 300), пока не найдётся KVEST_COUNT (по умолчанию 3) подходящих прохождений;
//   KVEST_TOGETHER   — 1: ещё и вместе (w.together) в начале участка KVEST_FROM.
// В начале файла — сводка по участкам: шаги, экраны с выбором, прерывания, температура тела, где закончил.
import { mkdirSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { availableActions, isServiceAction } from '../engine/actions';
import { evalCond } from '../engine/conditions';
import { completeCheckpoint, deliverMessages, mergeNotes, mergeSegments, optionsFor, participants, syncClocks } from '../engine/checkpoint';
import { newGame, play, segmentFinished } from '../engine/game';
import { unit } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import { fmt, type Ctx } from '../engine/world';
import { START_TIME } from '../app/session';
import { content as c } from './index';

const NAME = process.env.KVEST_TRANSCRIPT;
const players = {
  A: { name: { nom: 'Андрей', gen: 'Андрея', dat: 'Андрею', acc: 'Андрея', ins: 'Андреем', pre: 'Андрее' } },
  B: { name: { nom: 'Аня', gen: 'Ани', dat: 'Ане', acc: 'Аню', ins: 'Аней', pre: 'Ане' } },
};
const lastCp = Math.max(...c.checkpoints.map((x) => x.index));
const FROM = Number(process.env.KVEST_FROM ?? lastCp - 1);
// Для чтения одной части; по умолчанию по-прежнему до последней КТ.
const TO = Number(process.env.KVEST_TO ?? lastCp);
const ANSWERS = Object.fromEntries((process.env.KVEST_ANSWERS ?? '').split(',').filter(Boolean).map((p) => p.split('=')));
const SEEDS = (process.env.KVEST_SEEDS ?? '1,2,3').split(',');
const POLICY = process.env.KVEST_POLICY ?? 'curious';
const POLICY_FROM = Number(process.env.KVEST_POLICY_FROM ?? 1);
const WANT = process.env.KVEST_WANT;
const TOGETHER = process.env.KVEST_TOGETHER === '1';
const COUNT = Number(process.env.KVEST_COUNT ?? 3);

const clock = (t: number) => {
  const d = new Date(Date.UTC(2026, 10, 10, 0, t));
  return `${d.getUTCDate()}.11 ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};
const leadsToCheckpoint = (goto?: string) => !!goto && c.scenes[goto]?.checkpoint !== undefined;

interface SegStats { steps: number; choiceScreens: number; oneButton: number; interrupts: number; minTemp: number; worst: string }

function segment(s: GameState, pid: PlayerId, tag: string, out: string[] | null): SegStats {
  const seen = new Set<string>();
  const st: SegStats = { steps: 0, choiceScreens: 0, oneButton: 0, interrupts: 0, minTemp: 99, worst: 'awake' };
  const ch = s.chars[pid];
  for (let step = 0; step < 400 && !segmentFinished(c, s, pid); step++) {
    const ctx: Ctx = { s, c, pid };
    const sc = c.scenes[ch.scene];
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
    // Поесть/попить, если совсем плохо (как сделал бы живой игрок).
    const need = ch.body.thirst > 70 || ch.body.hunger > 80;
    const care = need ? enabled.filter((a) => a.universal && /drink|eat/.test(a.def.id)) : [];
    const fresh = story.filter((a) => !seen.has(a.def.id) && !/wait/.test(a.def.id) && !leadsToCheckpoint(a.def.goto));
    const toCp = story.filter((a) => leadsToCheckpoint(a.def.goto));
    // Спешащий ждёт открытия точки; terminal сам по себе — часто обратная дверь, а не путь вперёд.
    const skip = story.filter(a => /wait|_sleep$/.test(a.def.id));
    const pool = care.length ? care
      : POLICY === 'hasty' && s.checkpoint + 1 >= POLICY_FROM ? (toCp.length ? toCp : skip.length ? skip : story.filter((a) => a.def.terminal).length ? story.filter((a) => a.def.terminal) : story)
      : fresh.length ? fresh : toCp.length ? toCp : story.length ? story : enabled;
    if (!pool.length) { out?.push('!!! НЕТ ДОСТУПНЫХ ДЕЙСТВИЙ'); break; }
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
  return st;
}

function run(seed: string): string[] | null {
  {
    const out: string[] = [`Стенограмма «${NAME}», сид ${seed}, участки ${FROM}–${TO}, ответы: ${JSON.stringify(ANSWERS)}, игрок: ${POLICY}`];
    const summary: string[] = [];
    let base = newGame(c, { pairId: 'transcript', seed: `${NAME}:${seed}`, startTime: START_TIME, players });
    for (let n = 1; n <= TO && !base.ended; n++) {
      const write = n >= FROM;
      if (n === FROM && WANT) {
        const here = (['A', 'B'] as const).some((p) => base.chars[p].location === WANT);
        if (!here || (TOGETHER && !base.vars['w.together'])) return null;
      }
      const ends = {} as Record<PlayerId, GameState>;
      for (const pid of ['A', 'B'] as const) {
        const s = structuredClone(base);
        const lines: string[] | null = write ? [] : null;
        const st = segment(s, pid, `${seed}:${n}:${pid}`, lines);
        ends[pid] = s;
        const ch = s.chars[pid];
        const line = `участок ${n} ${pid}: шагов ${st.steps}, экранов с выбором (3+) ${st.choiceScreens}, экранов с единственной кнопкой ${st.oneButton}, прерываний ${st.interrupts}, мин. температура ${st.minTemp.toFixed(1)}, ${st.worst}; конец: ${ch.location} ${clock(ch.time)}`;
        summary.push(line);
        if (lines) out.push('', '', `════════ УЧАСТОК ${n} — ${pid} (${players[pid].name.nom}) ════════`, ...lines, '', `[${line}]`);
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
          const wanted = opts.find((o) => o.id === ANSWERS[id]);
          const pick = wanted ?? opts[Math.floor(unit(`${seed}:${id}:${p}`) * opts.length)];
          (answers[p] ??= {})[id] = pick.id;
          asked.push(`${p}: ${fmt(ctx, d.prompt[p] ?? d.prompt.default)}`, ...opts.map((o) => `   ${o === pick ? '▶' : '·'} ${fmt(ctx, o.label[p] ?? o.label.default)}`));
        }
      }
      const res = completeCheckpoint(c, merged, answers);
      if (write) {
        out.push('', '', `════════ КТ ${n} «${cp.title}» ════════`, ...merged.log.slice(before).map((e) => `· ${e.text}`), ...asked);
        for (const j of res.joint) out.push(`= ${j.id}: ${j.applied.join(', ')} — ${fmt({ s: res.state, c, pid: 'A' }, j.reason ?? '')}`);
        out.push(...res.state.log.slice(merged.log.length).map((e) => `· ${e.text}`));
      }
      base = res.state;
    }
    out.splice(1, 0, '', ...summary, '');
    return out;
  }
}

describe.runIf(!!NAME)('стенограмма прохождения', () => {
  it('пишет transcripts/<имя>-<сид>.txt', { timeout: 1200000 }, () => {
    mkdirSync(new URL('../../transcripts/', import.meta.url), { recursive: true });
    const seeds = WANT ? Array.from({ length: 300 }, (_, i) => String(i + 1)) : SEEDS;
    const written: string[] = [];
    for (const seed of seeds) {
      if (written.length >= (WANT ? COUNT : seeds.length)) break;
      const out = run(seed);
      if (!out) continue;
      writeFileSync(new URL(`../../transcripts/${NAME}-${seed}.txt`, import.meta.url), out.join('\n'));
      written.push(`transcripts/${NAME}-${seed}.txt`);
    }
    console.log(written.length ? `Записано: ${written.join(', ')}` : `Ни один сид не привёл в ${WANT}: поменяйте KVEST_ANSWERS или KVEST_FROM`);
    expect(written.length).toBeGreaterThan(0);
  });
});
