// Детерминированная случайность и хэши. Одинаковые входы → одинаковые результаты
// на Android и iPhone, поэтому повторная синхронизация даёт тот же мир.

/** 53-битный хэш строки (cyrb53). */
export function hash53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** Число в [0, 1), полностью определяемое ключом. */
export function unit(key: string): number {
  return hash53(key) / 9007199254740992;
}

/** Канонический JSON: ключи объектов отсортированы, undefined отброшены. */
export function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isFinite(value)) return 'null';
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).filter((k) => obj[k] !== undefined).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonical(obj[k])).join(',') + '}';
}

export function stateHash(value: unknown): string {
  const s = canonical(value);
  return hash53(s, 1).toString(16).padStart(14, '0') + hash53(s, 2).toString(16).padStart(14, '0');
}

/** Короткий код для сверки миров глазами: «4F2A-91C0». */
export function shortHash(hash: string): string {
  return (hash.slice(0, 4) + '-' + hash.slice(4, 8)).toUpperCase();
}

export function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

/** Округление, чтобы плавающая точка не давала разные хэши на разных устройствах. */
export function round(x: number, digits = 3): number {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}
