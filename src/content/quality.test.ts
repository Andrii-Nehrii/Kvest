// Качество текста и устройства НОВЫХ глав (ch3 и дальше) против эталона — глав 1–2.
// Пороги сняты с глав 1–2 (их значения — в комментариях). Тест не доказывает качество, но ловит то, что уже
// находили на проверках: быт вместо истории, людей без речи, флаги «на будущее», которые никто не читает,
// словесные тики, «улицу» на кухне, JSON-дампы вместо сцен. Как читать и чинить — docs/hidden/CHAPTER_GUIDE.md §8.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Scene } from '../engine/content-types';
import { content as c } from './index';

// Частичный прогон не заменяет общий: без переменной проверяется вся новая глава.
const PART = process.env.KVEST_QUALITY_PART;
const parts: Record<string, { scenes: string[]; files: string[] }> = {
  farm5: { scenes: ['c5_farm', 'c5_cellar', 'c5_well', 'c5_gate', 'c5_spilled', 'c5_bread'], files: ['chapter3/farm5.ts'] },
};
if (PART && !parts[PART]) throw new Error(`Неизвестная часть: ${PART}`);
const selection = PART ? parts[PART] : undefined;
const OLD = ['ch1', 'ch2'];
const newScenes = Object.values(c.scenes).filter((s) => !OLD.includes(s.chapter) && s.checkpoint === undefined && (!selection || selection.scenes.includes(s.id)));
const byChapter = new Map<string, Scene[]>();
for (const s of newScenes) byChapter.set(s.chapter, [...(byChapter.get(s.chapter) ?? []), s]);
// Заглушка «продолжение следует» в конце написанной части — не глава.
for (const [ch, list] of byChapter) if (!selection && list.length < 5) byChapter.delete(ch);

/** Подписи «бытовых мелочей». В главах 1–2 таких подписей 3–4 %. */
const CHORE = /^(Проверить|Осмотреть|Посмотреть|Убрать|Положить|Поправить|Подложить|Вымыть|Сменить|Отнести|Подать|Придержать|Подержать|Перенести|Поставить|Разобрать|Протереть|Закрепить|Снять|Освободить|Вычистить|Подтянуть|Прибить|Сложить|Переложить|Отодвинуть|Подвинуть)(?=\s)/;
/** Прямая речь: реплика после тире в начале фразы или в «ёлочках». В главах 1–2 — 29–36 % текстов. */
const SPEECH = /(^|[.!?…]\s+)— [А-ЯЁA-Z]|«[А-ЯЁA-Z]/;
/** Словесные тики, найденные на проверках главы 3. В главах 1–2 — 1–3 % текстов. */
const TIC = /больше не |Ты ждёшь|не касаясь|сухой|сухую|сухое|сухим|сухая/;

const textsOf = (list: Scene[]) => [...new Set(list.flatMap((s) => [
  ...s.text.map((b) => b.text),
  ...s.actions.flatMap((a) => [a.text ?? '', ...(a.outcomes ?? []).map((o) => o.text ?? '')]),
]).filter((t) => t.length > 30))];
const share = (part: number, all: number) => (all ? part / all : 0);

describe.runIf(byChapter.size > 0)('качество новых глав (эталон — главы 1–2)', () => {
  if (selection) it('все сцены выбранной части существуют', () => {
    expect(newScenes.map(s => s.id).sort()).toEqual([...selection.scenes].sort());
  });
  for (const [ch, list] of byChapter) {
    const labels = list.flatMap((s) => s.actions.filter((a) => !/wait|_go$/.test(a.id)).map((a) => a.label));
    const texts = textsOf(list);

    it(`${ch}: быт не вытесняет историю — подписей «Проверить/Убрать/Положить…» не больше 6 %`, () => {
      const chores = labels.filter((l) => CHORE.test(l));
      expect(share(chores.length, labels.length), `${chores.length} из ${labels.length}, например: ${chores.slice(0, 12).join(' · ')}`).toBeLessThanOrEqual(0.06);
    });

    it(`${ch}: люди говорят — прямая речь не меньше чем в 25 % текстов`, () => {
      const speech = texts.filter((t) => SPEECH.test(t));
      expect(share(speech.length, texts.length), `${speech.length} из ${texts.length}`).toBeGreaterThanOrEqual(0.25);
    });

    it(`${ch}: без словесных тиков — не больше 3 % текстов`, () => {
      const tic = texts.filter((t) => TIC.test(t));
      expect(share(tic.length, texts.length), `${tic.length} из ${texts.length}, например: ${tic.slice(0, 5).join(' / ')}`).toBeLessThanOrEqual(0.03);
    });

    it(`${ch}: подписи действий — до 10 слов, без точки в конце`, () => {
      const bad = labels.filter((l) => { const w = l.split(/\s+/).length; return w > 10 || /\.$/.test(l); });
      expect(bad).toEqual([]);
    });

    it(`${ch}: в одной сцене не больше 22 действий (в главе 2 — до 21, и почти все скрыты условиями)`, () => {
      const bad = list.filter((s) => s.actions.length > 22).map((s) => `${s.id}: ${s.actions.length}`);
      expect(bad).toEqual([]);
    });

    it(`${ch}: сцена «под крышей» не считается улицей (иначе персонаж мокнет и мёрзнет в доме)`, () => {
      // Место с indoor: false — двор/улица. Если сцена в нём — в доме, ночлеге, погребе, надо задать ambient.
      const bad = list.filter((s) => s.safe && s.location && c.locations[s.location] && !c.locations[s.location].indoor && !s.ambient).map((s) => s.id);
      expect(bad, 'дать сцене ambient: { outdoor: false, wet: false } или сделать её не safe').toEqual([]);
    });

    it(`${ch}: исходы выборов кто-то читает — флагов, которые только ставятся, не больше 15 %`, () => {
      const all = JSON.stringify(c.scenes) + JSON.stringify(c.events) + JSON.stringify(c.joint) + JSON.stringify(c.checkpoints) + JSON.stringify(c.npcs);
      const sets = new Set<string>();
      for (const s of list) for (const m of JSON.stringify(s).matchAll(/"set":"([^"]+)"/g)) sets.add(m[1]);
      const orphans = [...sets].filter((k) => {
        const name = k.replace(/^[^.]*\./, '');
        const uses = all.split(`${name}"`).length - 1 + all.split(`${name}.`).length - 1;
        const writes = all.split(`"set":"${k}"`).length - 1;
        return uses - writes <= 0;
      });
      expect(share(orphans.length, sets.size), `не читаются: ${orphans.slice(0, 20).join(', ')}`).toBeLessThanOrEqual(0.15);
    });
  }

  it('сцены записаны как в главе 2 (S({…}), at(д, ч, м)), а не JSON-дампом', () => {
    const dirs = readdirSync(new URL('./', import.meta.url)).filter((d) => /^chapter\d+$/.test(d) && Number(d.slice(7)) >= 3);
    const bad: string[] = [];
    for (const d of dirs) for (const f of readdirSync(new URL(`./${d}/`, import.meta.url))) {
      if (selection && !selection.files.includes(`${d}/${f}`)) continue;
      const url = new URL(`./${d}/${f}`, import.meta.url);
      if (!statSync(url).isFile()) continue;
      const src = readFileSync(url, 'utf8');
      const quotedKeys = (src.match(/"(id|when|text|label|actions|effects)":/g) ?? []).length;
      const rawMinutes = (src.match(/\{"(after|before)": \d{4}\}/g) ?? []).length;
      if (quotedKeys > 20 || rawMinutes > 5) bad.push(`${d}/${f}: ключей в кавычках ${quotedKeys}, минут числом ${rawMinutes}`);
    }
    expect(bad).toEqual([]);
  });
});
