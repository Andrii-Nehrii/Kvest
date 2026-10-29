// Падежи имени для текста («позвонить Лене», «с Игорем»). Догадка по окончанию — игрок может поправить.
import type { NameForms } from '../engine/types';

export function guessForms(raw: string, gender: 'm' | 'f'): NameForms {
  const n = raw.trim();
  const stem = n.slice(0, -1);
  const last = n.slice(-1).toLowerCase();
  const prev = n.slice(-2, -1).toLowerCase();
  const soft = 'гкхжшщч'.includes(prev);
  if (last === 'а') return { nom: n, gen: stem + (soft ? 'и' : 'ы'), dat: stem + 'е', acc: stem + 'у', ins: stem + (('жшщчц'.includes(prev)) ? 'ей' : 'ой'), pre: stem + 'е' };
  if (last === 'я') {
    if (prev === 'и') return { nom: n, gen: stem + 'и', dat: stem + 'и', acc: stem + 'ю', ins: stem + 'ей', pre: stem + 'и' };
    return { nom: n, gen: stem + 'и', dat: stem + 'е', acc: stem + 'ю', ins: stem + 'ей', pre: stem + 'е' };
  }
  if (gender === 'f') return { nom: n, gen: n, dat: n, acc: n, ins: n, pre: n };
  if (last === 'й') return { nom: n, gen: stem + 'я', dat: stem + 'ю', acc: stem + 'я', ins: stem + 'ем', pre: stem + 'е' };
  if (last === 'ь') return { nom: n, gen: stem + 'я', dat: stem + 'ю', acc: stem + 'я', ins: stem + 'ем', pre: stem + 'е' };
  if (/[бвгджзклмнпрстфхцчшщ]$/i.test(n)) {
    const ins = 'жшщчц'.includes(last) ? 'ем' : 'ом';
    return { nom: n, gen: n + 'а', dat: n + 'у', acc: n + 'а', ins: n + ins, pre: n + 'е' };
  }
  return { nom: n, gen: n, dat: n, acc: n, ins: n, pre: n };
}

export const FORM_LABELS: Record<keyof NameForms, string> = {
  nom: 'кто?', gen: 'кого? нет…', dat: 'кому?', acc: 'кого? вижу…', ins: 'с кем?', pre: 'о ком?',
};
