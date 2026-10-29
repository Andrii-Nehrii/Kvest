import { evalCond } from './conditions';
import type { Check } from './content-types';
import { clamp, round } from './rng';
import { caps, me, type Ctx } from './world';

// Проверка навыка: черты × текущие способности тела + обстоятельства против сложности.

export function checkChance(ctx: Ctx, check: Check): number {
  const ch = me(ctx);
  const traitAvg = check.traits.reduce((a, k) => a + ch.traits[k], 0) / Math.max(1, check.traits.length);
  const k = caps(ctx);
  const capList = check.uses ?? ['focus'];
  const capFactor = capList.reduce((a, c) => a * k[c], 1) ** (1 / capList.length);
  const bonus = (check.mods ?? []).filter((m) => evalCond(ctx, m.when)).reduce((a, m) => a + m.bonus, 0);
  const points = traitAvg * 2 * capFactor + bonus;
  return round(clamp(0.5 + (points - check.difficulty) * 0.1, 0.02, 0.98));
}

