import { afterAll, expect } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { GameState } from '../engine/types';

// Обычный случайный старт разводит пару по разным линиям и не покрывает новую часть.
// Только для проверки качества задаём синтетический старт ПЕРЕД главой 3: оба участника
// и нужные люди на месте. Проверка сама проходит участки 5–6; её утверждения не меняются.
// Сквозные тесты, матрица мест и совместимость по-прежнему начинают со своих исходных данных.
// Явный KVEST_PAIR (настоящие сохранения) всегда имеет приоритет. Сохранений игроков здесь нет.
if (expect.getState().testPath?.endsWith('/src/content/quality.test.ts') && !process.env.KVEST_PAIR) {
  const release = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
  const base = structuredClone(release.legs.find(x => x.base.checkpoint === 4)!.base);
  base.pairId = 'quality-chapter3';
  Object.assign(base.vars, { 'w.together': true, 'w.day3': 'stay', 'w.farm_welcome': true });
  for (const id of ['pawel', 'henrike', 'ole']) base.npcs[id].location = 'hof_luedemann';
  for (const pid of ['A', 'B'] as const) {
    base.chars[pid].location = 'hof_luedemann';
    base.chars[pid].scene = 'c5_start';
    base.vars[`seg.loc.${pid}`] = 'hof_luedemann';
  }
  const dir = mkdtempSync(join(tmpdir(), 'kvest-quality-'));
  for (const me of ['A', 'B']) writeFileSync(join(dir, `save-${me}.json`), JSON.stringify({ me, base, state: base, segment: [] }));
  process.env.KVEST_PAIR = dir;
  afterAll(() => { delete process.env.KVEST_PAIR; rmSync(dir, { recursive: true, force: true }); });
}
