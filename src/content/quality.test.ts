// ПОДСКАЗКИ по качеству новых глав (ch3 и дальше) + несколько технических проверок.
// С 02.11 (решение владельца) числа здесь — НЕ требования: главы, написанные «под проверку», вышли непонятными и скучными.
// Главное мерило — живой читатель: интересно ли и понятно ли с первого прочтения (docs/hidden/CHAPTER3_BRIEF.md, начало).
// Падают только технические вещи: сцена «под крышей» мокнет как улица; участок не проходится или игрок мёрзнет в доме.
// Остальное печатается как «ПОДСКАЗКА: …» — прочитать, исправлять только если это правда мешает читателю.
// Файл защищён: правится только в main.
//
// По частям: KVEST_QUALITY_FILES=chapter3/farm6.ts npx vitest run src/content/quality.test.ts
// С KVEST_PAIR=<папка с save-A.json/save-B.json> прохождения начинаются с настоящих сохранений пары (CONTEXT.md §4).
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
// Запасные тексты главы 3: места, куда линия пары не ведёт (pairpaths — хутор, вместе), и общие переходы между участками.
// Их сцены проходятся (участки ниже меряются со всеми сценами), но стандарт ТЕКСТА к ним не применяется. Новые главы
// пишутся только для места пары и без запасных файлов — этот список не пополнять.
const LEGACY = ['chapter3/morning12.ts', 'chapter3/afternoon12.ts', 'chapter3/morning13.ts', 'chapter3/afternoon13.ts',
  'chapter3/excursions.ts', 'chapter3/atmosphere.ts', 'chapter3/routes.ts'];
const writtenIds = new Set(sources.filter((s) => /^chapter\d+\//.test(s.path) && !LEGACY.includes(s.path))
  .flatMap((s) => [...s.src.matchAll(/id: '([a-z0-9_]+)'/g)].map((m) => m[1])));
const isLegacy = (s: Scene) => s.chapter === 'ch3' && !writtenIds.has(s.id);
const byChapter = new Map<string, Scene[]>();
for (const s of newScenes) if (!isLegacy(s)) byChapter.set(s.chapter, [...(byChapter.get(s.chapter) ?? []), s]);
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
/** Подсказка вместо требования: печатается, тест не валит. */
const hint = (ok: boolean, msg: string) => { if (!ok) console.warn(`ПОДСКАЗКА: ${msg}`); };

describe.runIf(byChapter.size > 0)('Подсказки по качеству и технические проверки новых глав', () => {
  for (const [ch, list] of byChapter) {
    const labels = list.flatMap((s) => s.actions.filter((a) => !/wait|_go$/.test(a.id)).map((a) => a.label));
    const texts = textsOf(list);

    it(`${ch}: быт не вытесняет историю — подписей «Проверить/Убрать/Положить…» не больше 6 %`, () => {
      const chores = labels.filter((l) => CHORE.test(l));
      hint(share(chores.length, labels.length) <= 0.06, `${ch}: много бытовых подписей — ${chores.length} из ${labels.length}: ${chores.slice(0, 8).join(' · ')}`);
    });

    it(`${ch}: люди говорят — прямая речь не меньше чем в 25 % текстов`, () => {
      const speech = texts.filter((t) => SPEECH.test(t));
      hint(share(speech.length, texts.length) >= 0.25, `${ch}: мало прямой речи — ${speech.length} из ${texts.length}`);
    });

    it(`${ch}: без словесных тиков — не больше 3 % текстов`, () => {
      const tic = texts.filter((t) => TIC.test(t));
      hint(share(tic.length, texts.length) <= 0.03, `${ch}: частые слова-тики — ${tic.length} из ${texts.length}`);
    });

    it(`${ch}: без заготовок «на все места» («улица или двор»)`, () => {
      const h = texts.filter((t) => HEDGE.test(t)); hint(!h.length, `${ch}: заготовки «улица или двор»: ${h.slice(0, 3).join(' / ')}`);
    });

    it(`${ch}: короткие фразы — в среднем 5–10 слов, длиннее 25 слов — не больше 1 % (в главах 1–2 — 7 слов и 0,2 %)`, () => {
      const words = texts.flatMap((t) => t.split(/(?<=[.!?…])\s+/)).filter((x) => x.length > 2).map((x) => x.split(/\s+/).length);
      const avg = words.reduce((a, b) => a + b, 0) / Math.max(1, words.length);
      hint(avg >= 5 && avg <= 10 && share(words.filter((w) => w > 25).length, words.length) <= 0.01, `${ch}: длина фраз в среднем ${avg.toFixed(1)} слов`);
    });

    it(`${ch}: один текст — в одном месте (повторов между сценами не больше 2 %; в главах 1–2 — 1 на 150–240)`, () => {
      const occ = new Map<string, Set<string>>();
      for (const s of list) for (const b of s.text) if (b.text.length > 30) occ.set(b.text, (occ.get(b.text) ?? new Set()).add(s.id));
      const dups = [...occ].filter(([, v]) => v.size > 1);
      hint(share(dups.length, occ.size) <= 0.02, `${ch}: одинаковые тексты в разных сценах: ${dups.slice(0, 3).map(([t, v]) => `${[...v].join(',')}: ${t.slice(0, 50)}`).join(' / ')}`);
    });

    it(`${ch}: сцены и тексты написаны руками — id каждой сцены и каждый текст есть в исходниках буквально (без генераторов)`, { timeout: 60000 }, () => {
      const generatedScenes = list.filter((s) => !allSource.includes(`'${s.id}'`) && !allSource.includes(`"${s.id}"`)).map((s) => s.id);
      hint(!generatedScenes.length, `${ch}: сцены собраны формулой: ${generatedScenes.slice(0, 6).join(', ')}`);
      const generatedTexts = texts.filter((t) => !allSource.includes(t.slice(0, 40)));
      hint(!generatedTexts.length, `${ch}: тексты склеены из кусков: ${generatedTexts.slice(0, 2).join(' / ')}`);
      const acts = [...new Set(list.flatMap((s) => s.actions.map((a) => a.id)).filter((id) => !id.startsWith('u:')))];
      const generatedActs = acts.filter((id) => !allSource.includes(`'${id}'`) && !allSource.includes(`"${id}"`));
      hint(share(generatedActs.length, acts.length) <= 0.1, `${ch}: id действий собраны формулой: ${generatedActs.slice(0, 6).join(', ')}`);
    });

    it(`${ch}: подписи действий — до 10 слов, без точки в конце`, () => {
      const long = labels.filter((l) => l.split(/\s+/).length > 10 || /\.$/.test(l)); hint(!long.length, `${ch}: длинные подписи кнопок: ${long.slice(0, 3).join(' / ')}`);
    });

    it(`${ch}: в одной сцене не больше 22 действий (в главе 2 — до 21, почти все скрыты условиями)`, () => {
      const many = list.filter((s) => s.actions.length > 22).map((s) => `${s.id}: ${s.actions.length}`); hint(!many.length, `${ch}: очень много кнопок: ${many.join(', ')}`);
    });

    it(`${ch}: сцена «под крышей» не считается улицей (иначе персонаж мокнет и мёрзнет в доме)`, () => {
      const bad = list.filter((s) => s.safe && s.location && c.locations[s.location] && !c.locations[s.location].indoor && !s.ambient).map((s) => s.id);
      expect(bad, 'дать сцене ambient: { outdoor: false, wet: false } или сделать её не safe').toEqual([]);
    });

    // Проход по всем флагам главы медленный и растёт вместе с главой: запас по времени, смысл проверки прежний.
    it(`${ch}: исходы выборов кто-то читает — флагов, которые только ставятся, не больше 15 % (в главе 2 — 11 %)`, { timeout: 60000 }, () => {
      const all = JSON.stringify(c.scenes) + JSON.stringify(c.events) + JSON.stringify(c.joint) + JSON.stringify(c.checkpoints) + JSON.stringify(c.npcs);
      const sets = new Set<string>();
      for (const s of list) for (const m of JSON.stringify(s).matchAll(/"set":"([^"]+)"/g)) sets.add(m[1]);
      const orphans = [...sets].filter((k) => {
        const name = k.replace(/^[^.]*\./, '');
        const uses = all.split(`${name}"`).length - 1 + all.split(`${name}.`).length - 1;
        return uses - (all.split(`"set":"${k}"`).length - 1) <= 0;
      });
      hint(share(orphans.length, sets.size) <= 0.15, `${ch}: исходы, которые потом нигде не видны: ${orphans.slice(0, 8).join(', ')}`);
    });
  }

  it('сцены записаны как в главе 2 (S({…}), at(д, ч, м)), а не JSON-дампом', () => {
    const bad: string[] = [];
    for (const f of newDirs.filter((s) => (!PART_FILES.length || PART_FILES.includes(s.path)) && !LEGACY.includes(s.path))) {
      const quotedKeys = (f.src.match(/"(id|when|text|label|actions|effects)":/g) ?? []).length;
      const rawMinutes = (f.src.match(/\{\s*"?(after|before)"?:\s*\d{4}\s*\}/g) ?? []).length;
      if (quotedKeys > 20 || rawMinutes > 5) bad.push(`${f.path}: ключей в кавычках ${quotedKeys}, минут числом ${rawMinutes}`);
    }
    hint(!bad.length, `файлы в виде JSON-дампа: ${bad.join('; ')}`);
  });

  // ── Прохождение как игрок: те же цифры, что в сводке стенограммы. Главы 1–2 (медианы): шагов 40–59,
  //    прерываний 0–2, экранов с риском 0–7, единственная кнопка 4–7, температура ≥ 36,3. Новые главы — не хуже лучшего из них.
  const lastOld = Math.max(...Object.values(c.scenes).filter((s) => OLD.includes(s.chapter) && s.checkpoint !== undefined).map((s) => s.checkpoint!));
  const newSegs = [...new Set(newScenes.map((s) => Number(s.id.match(/^c(\d+)_/)?.[1])).filter((n) => n > lastOld && c.checkpoints.some((cp) => cp.index === n)))].sort((a, b) => a - b);
  it(`прохождение как игрок: участки ${newSegs.join(', ') || '—'} проходятся без тупиков`, { timeout: 600000 }, () => {
    const runs: SegStats[] = [];
    // Меряются участки, прошедшие через написанные сцены (запасные места — см. LEGACY); без сохранений пары до них
    // доходит не каждая случайная игра, поэтому сидов больше.
    const maxSeed = PART_FILES.length ? (SAVES ? 160 : 80) : SAVES ? 16 : 240, need = PART_FILES.length ? 10 : SAVES ? 16 : 8;
    const enough = () => PART_FILES.length || SAVES ? false : newSegs.every((n) => runs.filter((x) => x.n === n).length >= need);
    for (let seed = 1, found = 0; seed <= maxSeed && (PART_FILES.length || SAVES ? found < need : !enough()); seed++) {
      const segs = playGame({ seed: String(seed), name: 'quality', saves: SAVES }).segments.filter((x) => newSegs.includes(x.n)
        && (PART_FILES.length ? [...x.scenes].some((id) => partIds.has(id)) : [...x.scenes].some((id) => writtenIds.has(id))));
      if (segs.length) found++;
      runs.push(...segs);
    }
    const report: string[] = [];
    for (const n of newSegs) {
      const s = runs.filter((x) => x.n === n);
      if (!s.length) { report.push(`участок ${n}: ни одно прохождение сюда не дошло — часть недостижима или нужна стенограмма с KVEST_WANT`); continue; }
      const f = (k: keyof SegStats) => s.map((x) => x[k] as number);
      // Объём, события и риск — только подсказки: короткий понятный участок лучше длинного «под счётчик».
      hint(median(f('steps')) >= 15, `участок ${n}: у игрока всего ${median(f('steps'))} шагов (медиана) — не слишком ли пусто?`);
      hint(median(f('oneButton')) <= 6, `участок ${n}: много экранов с единственной кнопкой (${median(f('oneButton'))})`);
      const bad = [
        pct(f('minTemp'), 0.1) < 36 && `температура тела падает до ${pct(f('minTemp'), 0.1).toFixed(1)} (где-то «улица» под крышей)`,
        s.some((x) => x.stuck) && `тупик: ${s.filter((x) => x.stuck).map((x) => x.pid + '@' + x.place).join(', ')}`,
      ].filter(Boolean);
      if (bad.length) report.push(`участок ${n} (${s.length} прохождений): ${bad.join('; ')}`);
    }
    expect(report.join('\n')).toBe('');
  });
});
