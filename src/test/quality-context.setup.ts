import { afterAll, expect, vi } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { GameState } from '../engine/types';

// Обычный случайный старт разводит пару по разным линиям и не покрывает новую часть.
// Только для проверки качества задаём синтетический старт ПЕРЕД главой 3: оба участника
// и нужные люди на месте. Проверка сама проходит написанные участки; её утверждения не меняются.
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
  // Переносим существующую машину вместе с людьми, без создания её копии.
  const car = Object.values(base.items).find(i => i.type === 'opel_corsa' && i.qty > 0);
  if (car) car.at = { kind: 'place', id: 'hof_luedemann' };
  const key = Object.values(base.items).find(i => i.type === 'car_keys' && i.qty > 0);
  if (key) key.at = { kind: 'char', id: 'A' };
  const dir = mkdtempSync(join(tmpdir(), 'kvest-quality-'));
  for (const me of ['A', 'B']) writeFileSync(join(dir, `save-${me}.json`), JSON.stringify({ me, base, state: base, segment: [] }));
  process.env.KVEST_PAIR = dir;
  // Меняется только вход штатного проигрывателя: предшествующие общие ответы
  // ведут к текущей линии пары. Все личные действия остаются случайными.
  // Оригинальный playGame исполняет всю историю с этими входами; утверждения
  // quality.test.ts остаются прежними.
  // Другие исходы и отрицательные случаи отдельно проходят point7/point8/матрицу.
  vi.doMock('../content/playtest', async () => {
    const actual = await vi.importActual<typeof import('../content/playtest')>('../content/playtest');
    return { ...actual, playGame: (options: Parameters<typeof actual.playGame>[0]) => actual.playGame({
      ...options, answers: {
        c3_midday5: 'relieve', c3_l_road6: 'divert', c3_new_night6: 'own_sleep',
        c3_new_van7: 'quiet', c3_new_depart7: 'car', ...options.answers,
      },
    }) };
  });
  afterAll(() => { delete process.env.KVEST_PAIR; rmSync(dir, { recursive: true, force: true }); });
}
