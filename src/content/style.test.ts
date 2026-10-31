// Механические ошибки текстов, которые легко пропустить глазами: шаблоны, род в общих сценах, подписи действий.
// Смысловые ошибки этот тест не ловит — для них чек-лист в docs/hidden/CHAPTER_GUIDE.md.
import { describe, expect, it } from 'vitest';
import type { Scene } from '../engine/content-types';
import { content as c } from './index';

/** Тексты сцены: блоки, подписи и тексты действий, исходы. */
function texts(s: Scene): { where: string; text: string; label?: boolean }[] {
  const out: { where: string; text: string; label?: boolean }[] = s.text.map((t, i) => ({ where: `${s.id}#${i}`, text: t.text }));
  for (const a of s.actions) {
    out.push({ where: `${s.id}/${a.id}`, text: a.label, label: true });
    if (a.text) out.push({ where: `${s.id}/${a.id}`, text: a.text });
    for (const o of a.outcomes ?? []) if (o.text) out.push({ where: `${s.id}/${a.id}/${o.id}`, text: o.text });
  }
  return out;
}

const PLACEHOLDER = /\{([^}]*)\}/g;
const VALID = /^(?:(?:name|partner|A|B)(?:\.(?:nom|gen|dat|acc|ins|pre))?|(?:m|pm):[^|]*\|[^|]*)$/;
/** Глагол прошедшего времени о читающем без шаблона: «Ты видела», «ты не успел». */
const GENDERED_YOU = /(?<![а-яёА-ЯЁ{|])[Тт]ы\s+(?:(?:не|уже|ещё|только|почти|даже|так|и)\s+)*[а-яё]+(?:л|ла|лся|лась)(?![а-яё{])/;
const NEW_CHAPTERS = (s: Scene) => s.chapter !== 'ch1';

describe('тексты: механические ошибки', () => {
  it('шаблоны в фигурных скобках — только известные ({partner.gen}, {m:..|..}, {pm:..|..})', () => {
    const bad: string[] = [];
    for (const s of Object.values(c.scenes)) for (const t of texts(s)) for (const m of t.text.matchAll(PLACEHOLDER)) if (!VALID.test(m[1])) bad.push(`${t.where}: {${m[1]}}`);
    expect(bad).toEqual([]);
  });

  it('в новостях событий нет шаблонов — там они не подставляются', () => {
    const bad = c.events.flatMap((e) => (e.news ?? []).filter((n) => n.text.includes('{')).map((n) => `${e.id}: ${n.text.slice(0, 60)}`));
    expect(bad).toEqual([]);
  });

  it('в общих сценах (for: any) род читающего — через {m:..|..}', () => {
    const bad: string[] = [];
    for (const s of Object.values(c.scenes).filter((x) => x.for === 'any')) {
      for (const t of texts(s)) {
        const m = GENDERED_YOU.exec(t.text);
        if (m) bad.push(`${t.where}: «${m[0]}»`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('подписи действий новых глав — короткие, без точки в конце', () => {
    const bad: string[] = [];
    for (const s of Object.values(c.scenes).filter(NEW_CHAPTERS)) {
      for (const t of texts(s).filter((x) => x.label)) {
        if (/[.]$/.test(t.text) || t.text.length > 90) bad.push(`${t.where}: ${t.text}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('слова «зомби» в игре нет', () => {
    const bad: string[] = [];
    for (const s of Object.values(c.scenes)) for (const t of texts(s)) if (/зомби/i.test(t.text)) bad.push(t.where);
    for (const f of Object.values(c.facts)) if (/зомби/i.test(f.text)) bad.push(f.id);
    expect(bad).toEqual([]);
  });
});
