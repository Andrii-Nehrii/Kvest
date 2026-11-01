// «Прочитать главу как игрок»: пара проходит игру с первой минуты, а текст выбранных участков пишется в файл —
// ровно то, что увидел бы игрок: время, место, текст сцены, все варианты, выбранный, исход, события, заметки и
// решения на точках, состояние тела. Файл надо ПРОЧИТАТЬ целиком (docs/hidden/CHAPTER_GUIDE.md §8).
//
// Запуск (ничего не пишет без переменной KVEST_TRANSCRIPT):
//   KVEST_TRANSCRIPT=farm KVEST_FROM=5 KVEST_WANT=hof_luedemann KVEST_TOGETHER=1 KVEST_ANSWERS=meet=b_to_a,shelter=farm,day2=farm,day3=farm npx vitest run src/content/transcript.test.ts
// Переменные:
//   KVEST_TRANSCRIPT — имя файла: transcripts/<имя>-<сид>.txt (папка не коммитится);
//   KVEST_FROM / KVEST_TO — какие участки писать (участок N заканчивается КТ N); по умолчанию — два последних;
//   KVEST_ANSWERS    — ответы на совместные решения «id=вариант,…» (недоступно — случайный доступный вариант);
//   KVEST_SEEDS      — сиды через запятую (по умолчанию 1,2,3);
//   KVEST_POLICY     — curious (пробует всё новое, потом идёт к точке) или hasty (спешит к точке), KVEST_POLICY_FROM — с какого участка;
//   KVEST_WANT       — id места, где хотя бы один игрок начинает участок KVEST_FROM: сиды перебираются (до 300), пока не
//                      найдётся KVEST_COUNT (по умолчанию 3) прохождений; KVEST_TOGETHER=1 — ещё и вместе.
// В начале файла — сводка по участкам: шаги, экраны с выбором, прерывания, экраны с риском, температура тела, где закончил.
import { mkdirSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { lastCp, playGame } from './playtest';

const NAME = process.env.KVEST_TRANSCRIPT;
const FROM = Number(process.env.KVEST_FROM ?? lastCp - 1);
const TO = Number(process.env.KVEST_TO ?? lastCp);
const ANSWERS = Object.fromEntries((process.env.KVEST_ANSWERS ?? '').split(',').filter(Boolean).map((p) => p.split('=')));
const SEEDS = (process.env.KVEST_SEEDS ?? '1,2,3').split(',');
const POLICY = process.env.KVEST_POLICY === 'hasty' ? 'hasty' : 'curious';
const WANT = process.env.KVEST_WANT;
const COUNT = Number(process.env.KVEST_COUNT ?? 3);

describe.runIf(!!NAME)('стенограмма прохождения', () => {
  it('пишет transcripts/<имя>-<сид>.txt', { timeout: 1200000 }, () => {
    mkdirSync(new URL('../../transcripts/', import.meta.url), { recursive: true });
    const seeds = WANT ? Array.from({ length: 300 }, (_, i) => String(i + 1)) : SEEDS;
    const written: string[] = [];
    for (const seed of seeds) {
      if (written.length >= (WANT ? COUNT : seeds.length)) break;
      const r = playGame({ seed, name: NAME, from: FROM, to: TO, answers: ANSWERS, policy: POLICY, policyFrom: Number(process.env.KVEST_POLICY_FROM ?? 1),
        write: true, want: WANT, together: process.env.KVEST_TOGETHER === '1' });
      if (r.skipped) continue;
      const head = `Стенограмма «${NAME}», сид ${seed}, участки ${FROM}–${TO}, ответы: ${JSON.stringify(ANSWERS)}, игрок: ${POLICY}`;
      writeFileSync(new URL(`../../transcripts/${NAME}-${seed}.txt`, import.meta.url), [head, '', ...r.summary, '', ...r.lines].join('\n'));
      written.push(`transcripts/${NAME}-${seed}.txt`);
    }
    console.log(written.length ? `Записано: ${written.join(', ')}` : `Ни один сид не привёл в ${WANT}: поменяйте KVEST_ANSWERS или KVEST_FROM`);
    expect(written.length).toBeGreaterThan(0);
  });
});
