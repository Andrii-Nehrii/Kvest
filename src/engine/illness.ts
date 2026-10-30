// Болезни. Законы возбудителя — СКРЫТЫЕ правила мира (docs/hidden/WORLD_BIBLE.md, §2).
// Они постоянны: новые главы не имеют права менять эти числа задним числом.
// Игрок видит только симптомы; название «pathogen» в интерфейс не выводится.
import { unit } from './rng';
import { hourOfDay } from './time';
import type { Body, Illness, Minutes } from './types';

export interface IllnessDef {
  fever(ill: Illness): number;
  symptoms(ill: Illness, t: Minutes): string[];
  progress(ill: Illness, body: Body, t: Minutes, seedKey: string): { note?: string; death?: string } | void;
  infect?(id: string, t: Minutes, key: string): Illness;
}

const H = 60;
const between = (key: string, lo: number, hi: number) => lo + unit(key) * (hi - lo);

/** Сколько длится стадия возбудителя (минуты). */
function pathogenStageLength(stage: number, key: string): number {
  switch (stage) {
    case 0: return Math.round(between(`${key}:s0`, 8 * H, 30 * H));   // инкубация
    case 1: return Math.round(between(`${key}:s1`, 6 * H, 12 * H));   // продром
    case 2: return Math.round(between(`${key}:s2`, 6 * H, 18 * H));   // острая
    case 3: return Math.round(between(`${key}:s3`, 24 * H, 48 * H));  // выздоровление (редкий исход)
    default: return 24 * H;
  }
}

/** Доля носителей, у которых иммунитет обрывает инфекцию на острой стадии. */
export const PATHOGEN_ABORTIVE_RATE = 0.06;

export const ILLNESSES: Record<string, IllnessDef> = {
  pathogen: {
    infect(id, t, key) {
      const fate = unit(`${key}:fate`) < PATHOGEN_ABORTIVE_RATE ? 'abortive' : 'turn';
      return { id, kind: 'pathogen', stage: 0, since: t, severity: 0, nextAt: t + pathogenStageLength(0, key), fate };
    },
    fever(ill) {
      if (ill.stage === 1) return 1.2 + ill.severity * 0.4;
      if (ill.stage === 2) return 2.5 + ill.severity * 1.0;
      if (ill.stage === 3) return Math.max(0, 1.8 * (1 - ill.severity));
      return 0;
    },
    symptoms(ill) {
      if (ill.stage === 1) return ['Головная боль', 'Ломота в теле', 'Свет режет глаза'];
      if (ill.stage === 2) return ['Мысли путаются', 'Вспышки беспричинной злости', 'Больно глотать'];
      if (ill.stage === 3) return ['Сильная слабость после жара'];
      return [];
    },
    progress(ill, body, t, seedKey) {
      const key = `${seedKey}:${ill.id}`;
      if (ill.stage >= 1 && ill.stage <= 2 && ill.nextAt) {
        const len = pathogenStageLength(ill.stage, key);
        ill.severity = Math.min(1, Math.max(0, 1 - (ill.nextAt - t) / len));
      }
      if (ill.stage === 2) body.stress = Math.min(100, body.stress + 0.5);
      if (ill.nextAt === undefined || t < ill.nextAt) return;
      if (ill.stage === 0) { ill.stage = 1; ill.nextAt = t + pathogenStageLength(1, key); return { note: 'Голова тяжёлая, ломит суставы. Похоже на начало простуды.' }; }
      if (ill.stage === 1) { ill.stage = 2; ill.nextAt = t + pathogenStageLength(2, key); return { note: 'Жар растёт. Сложно удерживать мысль.' }; }
      if (ill.stage === 2) {
        if (ill.fate === 'abortive') {
          ill.stage = 3; ill.severity = 0; ill.nextAt = t + pathogenStageLength(3, key);
          const h = hourOfDay(t);
          return { note: `${h < 6 || h >= 22 ? 'Ночью жар' : 'Жар'} внезапно спал. Тело как после долгой болезни.` };
        }
        return { death: 'неизвестная болезнь' };
      }
      if (ill.stage === 3) {
        body.rolled.pathogenImmune = true;
        ill.stage = -1;
        return { note: 'Слабость отступает.' };
      }
    },
  },
  cold: {
    fever: (ill) => (ill.stage === 1 ? 0.5 + ill.severity * 0.5 : 0),
    symptoms: (ill) => (ill.stage === 1 ? ['Насморк, першит в горле'] : []),
    progress(ill, _b, t) {
      if (ill.stage === 0) { ill.stage = 1; ill.nextAt = t + 4 * 24 * H; }
      else if (ill.nextAt && t >= ill.nextAt) ill.stage = -1;
    },
  },
  flu: {
    fever: (ill) => (ill.stage === 1 ? 1.6 + ill.severity * 0.9 : 0),
    symptoms: (ill) => (ill.stage === 1 ? ['Ломота, слабость', 'Сухой кашель'] : []),
    progress(ill, _b, t, seedKey) {
      if (ill.stage === 0) {
        ill.stage = 1;
        ill.severity = unit(`${seedKey}:${ill.id}:sev`);
        ill.nextAt = t + Math.round(between(`${seedKey}:${ill.id}:len`, 3, 6) * 24 * H);
      } else if (ill.nextAt && t >= ill.nextAt) ill.stage = -1;
    },
  },
};

export function newIllness(kind: string, id: string, t: Minutes, key: string): Illness {
  const def = ILLNESSES[kind];
  if (def?.infect) return def.infect(id, t, key);
  return { id, kind, stage: 0, since: t, severity: 0 };
}
