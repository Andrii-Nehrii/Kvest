// ЖЁСТКИЙ СТАНДАРТ качества НОВЫХ глав (ch3 и дальше). Эталон — главы 1–2; пороги сняты с них (значения в комментариях).
// Этот файл, playtest.ts, transcript.test.ts и руководства — ЗАЩИЩЁННЫЕ: проверка PR (.github/workflows/quality.yml)
// берёт их из main, а не из ветки главы, и падает, если ветка их меняет. Ослабить порог в своей ветке нельзя.
// Глава, не проходящая этот файл целиком, в main не попадает. Как читать и чинить — docs/hidden/CHAPTER_GUIDE.md §8–§9.
//
// По частям: KVEST_QUALITY_FILES=chapter3/farm5.ts,chapter3/bflat5.ts npx vitest run src/content/quality.test.ts —
// проверяются только сцены, объявленные в этих файлах, и прохождения, которые через них прошли.
// С KVEST_PAIR=<папка с save-A.json/save-B.json> прохождения начинаются с настоящих сохранений пары (CONTEXT.md §4) —
// так проверяются места, до которых случайная игра с первой минуты почти не доходит.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Scene } from '../engine/content-types';
import { content as c } from './index';
import type { LocalSave } from '../app/session';
import { playGame, type SegStats } from './playtest';

const PAIR = process.env.KVEST_PAIR;
const loadSave = (pid: 'A' | 'B'): LocalSave => { const raw = JSON.parse(readFileSync(`${PAIR}/save-${pid}.json`, 'utf8')); return raw.save ?? raw; };
const SAVES = PAIR ? { A: loadSave('A'), B: loadSave('B') } : undefined;

const OLD = ['ch1', 'ch2'];
const CONTENT = new URL('./', import.meta.url);
const readTree = (url: URL): { path: string; src: string }[] => readdirSync(url).flatMap((f) => {
  const u = new URL(f, url);
  if (statSync(u).isDirectory()) return readTree(new URL(`${f}/`, url));
  return /\.ts$/.test(f) && !/\.test\.ts$/.test(f) ? [{ path: u.pathname.split('/src/content/')[1], src: readFileSync(u, 'utf8') }] : [];
});
const sources = readTree(CONTENT);
const allSource = sources.map((s) => s.src).join('\n');
const newDirs = sources.filter((s) => /^chapter(\d+)\//.test(s.path) && Number(s.path.match(/^chapter(\d+)/)![1]) >= 3);

// ── Часть (по файлам) или вся новая глава ──
const PART_FILES = (process.env.KVEST_QUALITY_FILES ?? '').split(',').filter(Boolean);
for (const f of PART_FILES) if (!sources.some((s) => s.path === f)) throw new Error(`KVEST_QUALITY_FILES: нет файла src/content/${f}`);
const partIds = new Set(sources.filter((s) => PART_FILES.includes(s.path)).flatMap((s) => [...s.src.matchAll(/id: '([a-z0-9_]+)'/g)].map((m) => m[1])));
const inPart = (s: Scene) => !PART_FILES.length || partIds.has(s.id);

const newScenes = Object.values(c.scenes).filter((s) => !OLD.includes(s.chapter) && s.checkpoint === undefined && inPart(s));
const byChapter = new Map<string, Scene[]>();
for (const s of newScenes) byChapter.set(s.chapter, [...(byChapter.get(s.chapter) ?? []), s]);
// Заглушка «продолжение следует» в конце написанной части — не глава.
if (!PART_FILES.length) for (const [ch, list] of byChapter) if (list.length < 5) byChapter.delete(ch);

/** Подписи «бытовых мелочей». В главах 1–2 — 3–4 %. */
const CHORE = /^(Проверить|Осмотреть|Посмотреть|Убрать|Положить|Поправить|Подложить|Вымыть|Сменить|Отнести|Подать|Придержать|Подержать|Перенести|Поставить|Разобрать|Протереть|Закрепить|Снять|Освободить|Вычистить|Подтянуть|Прибить|Сложить|Переложить|Отодвинуть|Подвинуть)(?=\s)/;
/** Прямая речь: реплика после тире в начале фразы или в «ёлочках». В главах 1–2 — 29–36 % текстов. */
const SPEECH = /(^|[.!?…]\s+)— [А-ЯЁA-Z]|«[А-ЯЁA-Z]/;
/** Словесные тики, найденные на проверках. В главах 1–2 — 1–3 % текстов. */
const TIC = /больше не |Ты ждёшь|не касаясь|сухой|сухую|сухое|сухим|сухая/;
/** Заготовка «на все места сразу»: «улица или двор», «дверь или тент». В главах 1–2 — ни одной. */
const HEDGE = /\b(улиц[аеуы]|двор[ау]?|проход[ау]?|тент[ау]?|комнат[аеуы]|дверь|двери|стен[аеуы]|окн[оа]) или (улиц|двор|проход|тент|комнат|дверь|двер|стен|окн)/i;

const textsOf = (list: Scene[]) => [...new Set(list.flatMap((s) => [
  ...s.text.map((b) => b.text),
  ...s.actions.flatMap((a) => [a.text ?? '', ...(a.outcomes ?? []).map((o) => o.text ?? '')]),
]).filter((t) => t.length > 30))];
const share = (part: number, all: number) => (all ? part / all : 0);
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] ?? 0; };
const pct = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length * p)] ?? 0; };

describe.runIf(byChapter.size > 0)('ЖЁСТКИЙ СТАНДАРТ: качество новых глав (эталон — главы 1–2)', () => {
  for (const [ch, list] of byChapter) {
    const labels = list.flatMap((s) => s.actions.filter((a) => !/wait|_go$/.test(a.id)).map((a) => a.label));
    const texts = textsOf(list);

    it(`${ch}: быт не вытесняет историю — подписей «Проверить/Убрать/Положить…» не больше 6 %`, () => {
      const chores = labels.filter((l) => CHORE.test(l));
      expect(share(chores.length, labels.length), `${chores.length} из ${labels.length}: ${chores.slice(0, 12).join(' · ')}`).toBeLessThanOrEqual(0.06);
    });

    it(`${ch}: люди говорят — прямая речь не меньше чем в 25 % текстов`, () => {
      const speech = texts.filter((t) => SPEECH.test(t));
      expect(share(speech.length, texts.length), `${speech.length} из ${texts.length}`).toBeGreaterThanOrEqual(0.25);
    });

    it(`${ch}: без словесных тиков — не больше 3 % текстов`, () => {
      const tic = texts.filter((t) => TIC.test(t));
      expect(share(tic.length, texts.length), `${tic.length} из ${texts.length}: ${tic.slice(0, 5).join(' / ')}`).toBeLessThanOrEqual(0.03);
    });

    it(`${ch}: без заготовок «на все места» («улица или двор»)`, () => {
      expect(texts.filter((t) => HEDGE.test(t))).toEqual([]);
    });

    it(`${ch}: короткие фразы — в среднем 5–10 слов, длиннее 25 слов — не больше 1 % (в главах 1–2 — 7 слов и 0,2 %)`, () => {
      const words = texts.flatMap((t) => t.split(/(?<=[.!?…])\s+/)).filter((x) => x.length > 2).map((x) => x.split(/\s+/).length);
      const avg = words.reduce((a, b) => a + b, 0) / Math.max(1, words.length);
      expect(avg).toBeGreaterThanOrEqual(5);
      expect(avg).toBeLessThanOrEqual(10);
      expect(share(words.filter((w) => w > 25).length, words.length)).toBeLessThanOrEqual(0.01);
    });

    it(`${ch}: один текст — в одном месте (повторов между сценами не больше 2 %; в главах 1–2 — 1 на 150–240)`, () => {
      const occ = new Map<string, Set<string>>();
      for (const s of list) for (const b of s.text) if (b.text.length > 30) occ.set(b.text, (occ.get(b.text) ?? new Set()).add(s.id));
      const dups = [...occ].filter(([, v]) => v.size > 1);
      expect(share(dups.length, occ.size), dups.slice(0, 5).map(([t, v]) => `${[...v].join(',')}: ${t.slice(0, 60)}`).join(' / ')).toBeLessThanOrEqual(0.02);
    });

    it(`${ch}: сцены и тексты написаны руками — id каждой сцены и каждый текст есть в исходниках буквально (без генераторов)`, () => {
      const generatedScenes = list.filter((s) => !allSource.includes(`'${s.id}'`) && !allSource.includes(`"${s.id}"`)).map((s) => s.id);
      expect(generatedScenes, 'сцены собраны формулой (`c${n}_…`, циклы) — писать каждую сцену отдельно').toEqual([]);
      const generatedTexts = texts.filter((t) => !allSource.includes(t.slice(0, 40)));
      expect(generatedTexts.slice(0, 10), 'текст склеен из кусков — писать каждый текст целиком').toEqual([]);
      const acts = [...new Set(list.flatMap((s) => s.actions.map((a) => a.id)).filter((id) => !id.startsWith('u:')))];
      const generatedActs = acts.filter((id) => !allSource.includes(`'${id}'`) && !allSource.includes(`"${id}"`));
      expect(share(generatedActs.length, acts.length), `id действий собраны формулой: ${generatedActs.slice(0, 10).join(', ')}`).toBeLessThanOrEqual(0.1);
    });

    it(`${ch}: подписи действий — до 10 слов, без точки в конце`, () => {
      expect(labels.filter((l) => l.split(/\s+/).length > 10 || /\.$/.test(l))).toEqual([]);
    });

    it(`${ch}: в одной сцене не больше 22 действий (в главе 2 — до 21, почти все скрыты условиями)`, () => {
      expect(list.filter((s) => s.actions.length > 22).map((s) => `${s.id}: ${s.actions.length}`)).toEqual([]);
    });

    it(`${ch}: сцена «под крышей» не считается улицей (иначе персонаж мокнет и мёрзнет в доме)`, () => {
      const bad = list.filter((s) => s.safe && s.location && c.locations[s.location] && !c.locations[s.location].indoor && !s.ambient).map((s) => s.id);
      expect(bad, 'дать сцене ambient: { outdoor: false, wet: false } или сделать её не safe').toEqual([]);
    });

    it(`${ch}: исходы выборов кто-то читает — флагов, которые только ставятся, не больше 15 % (в главе 2 — 11 %)`, () => {
      const all = JSON.stringify(c.scenes) + JSON.stringify(c.events) + JSON.stringify(c.joint) + JSON.stringify(c.checkpoints) + JSON.stringify(c.npcs);
      const sets = new Set<string>();
      for (const s of list) for (const m of JSON.stringify(s).matchAll(/"set":"([^"]+)"/g)) sets.add(m[1]);
      const orphans = [...sets].filter((k) => {
        const name = k.replace(/^[^.]*\./, '');
        const uses = all.split(`${name}"`).length - 1 + all.split(`${name}.`).length - 1;
        return uses - (all.split(`"set":"${k}"`).length - 1) <= 0;
      });
      expect(share(orphans.length, sets.size), `не читаются: ${orphans.slice(0, 20).join(', ')}`).toBeLessThanOrEqual(0.15);
    });
  }

  it('сцены записаны как в главе 2 (S({…}), at(д, ч, м)), а не JSON-дампом', () => {
    const bad: string[] = [];
    for (const f of newDirs.filter((s) => !PART_FILES.length || PART_FILES.includes(s.path))) {
      const quotedKeys = (f.src.match(/"(id|when|text|label|actions|effects)":/g) ?? []).length;
      const rawMinutes = (f.src.match(/\{\s*"?(after|before)"?:\s*\d{4}\s*\}/g) ?? []).length;
      if (quotedKeys > 20 || rawMinutes > 5) bad.push(`${f.path}: ключей в кавычках ${quotedKeys}, минут числом ${rawMinutes}`);
    }
    expect(bad).toEqual([]);
  });

  // ── Прохождение как игрок: те же цифры, что в сводке стенограммы. Главы 1–2 (медианы): шагов 40–59,
  //    прерываний 0–2, экранов с риском 0–7, единственная кнопка 4–7, температура ≥ 36,3. Новые главы — не хуже лучшего из них.
  const lastOld = Math.max(...Object.values(c.scenes).filter((s) => OLD.includes(s.chapter) && s.checkpoint !== undefined).map((s) => s.checkpoint!));
  const newSegs = [...new Set(newScenes.map((s) => Number(s.id.match(/^c(\d+)_/)?.[1])).filter((n) => n > lastOld && c.checkpoints.some((cp) => cp.index === n)))].sort((a, b) => a - b);
  it(`прохождение как игрок: участки ${newSegs.join(', ') || '—'} не хуже глав 1–2`, { timeout: 600000 }, () => {
    const runs: SegStats[] = [];
    for (let seed = 1, found = 0; seed <= (PART_FILES.length ? (SAVES ? 160 : 80) : 16) && found < (PART_FILES.length ? 10 : 16); seed++) {
      const segs = playGame({ seed: String(seed), name: 'quality', saves: SAVES }).segments.filter((x) => newSegs.includes(x.n) && (!PART_FILES.length || [...x.scenes].some((id) => partIds.has(id))));
      if (segs.length) found++;
      runs.push(...segs);
    }
    const report: string[] = [];
    for (const n of newSegs) {
      const s = runs.filter((x) => x.n === n);
      if (!s.length) { report.push(`участок ${n}: ни одно прохождение сюда не дошло — часть недостижима или нужна стенограмма с KVEST_WANT`); continue; }
      const f = (k: keyof SegStats) => s.map((x) => x[k] as number);
      const bad = [
        median(f('steps')) < 30 && `шагов медиана ${median(f('steps'))} < 30`,
        pct(f('steps'), 0.1) < 15 && `шагов у 10 % прохождений ${pct(f('steps'), 0.1)} < 15`,
        median(f('interrupts')) < 2 && `событий-прерываний медиана ${median(f('interrupts'))} < 2`,
        median(f('riskyOffered')) < 2 && `экранов с риском (risky, проверка, травма) медиана ${median(f('riskyOffered'))} < 2`,
        median(f('oneButton')) > 6 && `экранов с единственной кнопкой медиана ${median(f('oneButton'))} > 6`,
        pct(f('minTemp'), 0.1) < 36 && `температура тела падает до ${pct(f('minTemp'), 0.1).toFixed(1)} (где-то «улица» под крышей)`,
        s.some((x) => x.stuck) && `тупик: ${s.filter((x) => x.stuck).map((x) => x.pid + '@' + x.place).join(', ')}`,
      ].filter(Boolean);
      if (bad.length) report.push(`участок ${n} (${s.length} прохождений): ${bad.join('; ')}`);
    }
    expect(report.join('\n')).toBe('');
  });
});
