import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
export const segmentDay = (n: number) => (n < 7 ? 12 : 13);
export const segmentEnd = (n: number) => at(segmentDay(n), n % 2 ? 13 : 21);
export const segmentBegin = (n: number) => at(segmentDay(n), n % 2 ? 0 : 13);
export const inSegment = (n: number): Cond => ({ all: [{ cp: n - 1 }, { not: { cp: n } }] });
