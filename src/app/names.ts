// Падежи имени для текста («позвонить Лене», «с Игорем»). Догадка по окончанию — игрок может поправить.
// Формы хранятся в сохранении, поэтому правка правил не меняет уже начатые игры.
//
// Порядок слов: имя, затем отчество и/или фамилия («Анна Иванова», «Андрей Петрович Петров»);
// «Иванова Анна» тоже узнаётся. Двойные имена и фамилии через дефис склоняются по частям.
// Латиница и чужие окончания (Max, Нелли, Агнес, Шевченко) не склоняются.
import type { NameForms } from '../engine/types';

type Gender = 'm' | 'f';
/** Окончания: родительный, дательный, винительный, творительный, предложный. */
type Ends = readonly [string, string, string, string, string];

const VOWELS = 'аеёиоуыэюяіїє';
const VELAR = 'гкх';
const HUSH = 'жшщч';
const CONSONANT = /[бвгґджзйклмнпрстфхцчшщ]$/;
const CYR_END = /[а-яёіїєґ]$/;
/** Буквы, которых нет в русском: имя записано по-украински — и окончания украинские. */
const UKR = /[іїєґ]/;
/** Частицы в именах и фамилиях не склоняются: «Людвиг ван Бетховен», «Мамед оглы». */
const PARTICLES = new Set(['фон', 'де', 'ван', 'дер', 'ди', 'да', 'дель', 'ла', 'ле', 'оф', 'аль', 'эль', 'ибн', 'бен', 'бин', 'оглы', 'кызы']);
/** Беглая гласная и ё → е: Лев → Льва, Павел → Павла, Пётр → Петра. */
const STEMS: Record<string, string> = { 'лев': 'льв', 'павел': 'павл', 'пётр': 'петр', 'петр': 'петр' };
/** Украинские мужские имена на -о склоняются как Петр: Петро → Петра, с Петром. */
const UKR_O = new Set(['петро', 'павло', 'дмитро', 'михайло', 'данило', 'гаврило', 'кирило', 'левко']);
/** Отчества с ударным окончанием: с Ильичом, но с Петровичем. */
const ICH_STRESSED = new Set(['ильич', 'кузьмич', 'лукич', 'фомич', 'саввич']);

const same = (w: string): NameForms => ({ nom: w, gen: w, dat: w, acc: w, ins: w, pre: w });

const isUpper = (w: string) => w.length > 1 && w === w.toUpperCase() && w !== w.toLowerCase();

/** Регистр как у исходного слова: «ЛЕВ» → «ЛЬВ», «Лев» → «Льв». */
function matchCase(src: string, low: string): string {
  if (isUpper(src)) return low.toUpperCase();
  if (src[0] && src[0] !== src[0].toLowerCase()) return low[0].toUpperCase() + low.slice(1);
  return low;
}

function decl(w: string, stem: string, e: Ends): NameForms {
  const up = isUpper(w);
  const f = (s: string) => stem + (up ? s.toUpperCase() : s);
  return { nom: w, gen: f(e[0]), dat: f(e[1]), acc: f(e[2]), ins: f(e[3]), pre: f(e[4]) };
}

/** Мужское на согласный: Марк → Марка, с Марком; Игорёк → Игорька; Сашок → Сашка. */
function consonantStem(w: string, lw: string): string {
  if (STEMS[lw]) return matchCase(w, STEMS[lw]);
  if (lw.length > 3 && /[бвгдзклмнпрстфх]ёк$/.test(lw)) return w.slice(0, -2) + (isUpper(w) ? 'ЬК' : 'ьк');
  if (lw.length > 4 && /[жш]ок$/.test(lw)) return w.slice(0, -2) + (isUpper(w) ? 'К' : 'к');
  return w;
}

/** Имя (и всё, что склоняется как имя: отчество на -вна, фамилия на -а). */
function given(w: string, g: Gender): NameForms {
  const lw = w.toLowerCase();
  if (lw.length < 2 || !CYR_END.test(lw)) return same(w);
  // Прозвища-прилагательные: Рыжий → Рыжего, Белая → Белой (но Аглая → Аглаи, Георгий → Георгия).
  if (lw.length >= 5 && /[^аеёиоуыэюяь]ая$/.test(lw) && lw !== 'аглая') return surname(w, 'f');
  if (lw.length >= 4 && /[^аеёиоуыэюяь]яя$/.test(lw)) return surname(w, 'f');
  if (lw.length >= 4 && (/[^аеёиоуыэюяь]ый$/.test(lw) || /[кхжшчщ]ий$/.test(lw) || /[сц]кой$/.test(lw))) return surname(w, 'm');
  const ukr = UKR.test(lw);
  const last = lw.slice(-1);
  const prev = lw.slice(-2, -1);
  const stem = w.slice(0, -1);
  if (last === 'а') {
    if (VOWELS.includes(prev)) return same(w);
    const hush = HUSH.includes(prev) || prev === 'ц';
    const gen = VELAR.includes(prev) || HUSH.includes(prev) || ukr ? 'и' : 'ы';
    return ukr
      ? decl(w, stem, [gen, 'і', 'у', hush ? 'ею' : 'ою', 'і'])
      : decl(w, stem, [gen, 'е', 'у', hush ? 'ей' : 'ой', 'е']);
  }
  if (last === 'я') {
    if (lw === 'илья') return decl(w, stem, ['и', 'е', 'ю', 'ёй', 'е']);
    if (prev === 'и') return decl(w, stem, ['и', 'и', 'ю', 'ей', 'и']);
    if (prev === 'і') return decl(w, stem, ['ї', 'ї', 'ю', 'єю', 'ї']);
    return ukr ? decl(w, stem, ['і', 'і', 'ю', 'ею', 'і']) : decl(w, stem, ['и', 'е', 'ю', 'ей', 'е']);
  }
  if (last === 'ь') {
    // Любовь, Адель — как «ночь»: Любови, Любовью; винительный совпадает с именительным.
    if (g === 'f') return decl(w, stem, ['и', 'и', 'ь', 'ью', 'и']);
    return decl(w, stem, ['я', 'ю', 'я', 'ем', ukr ? 'і' : 'е']);
  }
  if (g === 'f') return same(w);  // Агнес, Кармен, Нелли
  if (last === 'й') {
    if (prev === 'и') return decl(w, stem, ['я', 'ю', 'я', 'ем', 'и']);   // Юрий → о Юрии
    if (prev === 'і') return decl(w, stem, ['я', 'ю', 'я', 'єм', 'ї']);   // Андрій → з Андрієм
    return decl(w, stem, ['я', 'ю', 'я', 'ем', 'е']);                     // Андрей, Николай
  }
  if (lw === 'ігор') return decl(w, w, ['я', 'ю', 'я', 'ем', 'і']);
  if (CONSONANT.test(lw)) {
    const s = consonantStem(w, lw);
    const soft = HUSH.includes(last) || last === 'ц';
    return decl(w, s, ['а', 'у', 'а', soft ? 'ем' : 'ом', ukr ? 'і' : 'е']);
  }
  if (last === 'о' && UKR_O.has(lw)) return decl(w, stem, ['а', 'у', 'а', 'ом', 'е']);
  return same(w);
}

/** Отчество: Петрович → с Петровичем, Петровна → с Петровной. */
function isPatronymic(w: string, g: Gender): boolean {
  const lw = w.toLowerCase();
  return g === 'm' ? lw.length >= 5 && /ич$/.test(lw) : lw.length >= 6 && /(вна|чна)$/.test(lw);
}

function patronymic(w: string, g: Gender): NameForms {
  const lw = w.toLowerCase();
  if (g === 'm') return decl(w, w, ['а', 'у', 'а', ICH_STRESSED.has(lw) ? 'ом' : 'ем', 'е']);
  return given(w, g);
}

/** Фамилия: русские -ов/-ин/-ский склоняются по-своему, женские на согласный — никак. */
function surname(w: string, g: Gender): NameForms {
  const lw = w.toLowerCase();
  if (lw.length < 2 || !CYR_END.test(lw)) return same(w);
  if (/[иы]х$/.test(lw)) return same(w);                               // Черных, Седых
  const prev = lw.slice(-3, -2);                                       // буква перед -ий/-ой/-ая
  if (g === 'm') {
    if (/(ов|ев|ёв|ин|ын)$/.test(lw)) return decl(w, w, ['а', 'у', 'а', 'ым', 'е']);
    if (lw.length >= 5 && /[сц]ький$/.test(lw)) return decl(w, w.slice(0, -2), ['ого', 'ому', 'ого', 'им', 'ому']);
    if (lw.length >= 4 && /[^аеёиоуыэюяь]ий$/.test(lw)) {
      if (VELAR.includes(prev)) return decl(w, w.slice(0, -2), ['ого', 'ому', 'ого', 'им', 'ом']);  // Достоевский
      if (HUSH.includes(prev) || prev === 'н') return decl(w, w.slice(0, -2), ['его', 'ему', 'его', 'им', 'ем']); // Рыжий, Синий
      return decl(w, w.slice(0, -1), ['я', 'ю', 'я', 'ем', 'и']);                                  // Гордий — как Юрий
    }
    if (lw.length >= 5 && /[^аеёиоуыэюяь][ыо]й$/.test(lw)) {
      const i = VELAR.includes(prev) || HUSH.includes(prev) ? 'им' : 'ым';
      return decl(w, w.slice(0, -2), ['ого', 'ому', 'ого', i, 'ом']);                            // Толстой, Белый
    }
    if (/[йь]$/.test(lw)) return decl(w, w.slice(0, -1), ['я', 'ю', 'я', 'ем', 'е']);              // Гайдай, Цой, Гоголь
    if (/[ая]$/.test(lw)) return given(w, g);                                                       // Сковорода
    if (CONSONANT.test(lw)) {
      const last = lw.slice(-1);
      return decl(w, w, ['а', 'у', 'а', HUSH.includes(last) || last === 'ц' ? 'ем' : 'ом', 'е']); // Шевчук, Шмидт
    }
    return same(w);                                                                                 // Шевченко, Гёте
  }
  if (/(ова|ева|ёва|ина|ына)$/.test(lw)) return decl(w, w.slice(0, -1), ['ой', 'ой', 'у', 'ой', 'ой']);
  if (lw.length >= 5 && /[сц]ька$/.test(lw)) return decl(w, w.slice(0, -1), ['ої', 'ій', 'у', 'ою', 'ій']);
  if (lw.length >= 4 && /[жшчщ]ая$/.test(lw)) return decl(w, w.slice(0, -2), ['ей', 'ей', 'ую', 'ей', 'ей']);  // Рыжая
  if (lw.length >= 4 && /[^аеёиоуыэюяь]ая$/.test(lw)) return decl(w, w.slice(0, -2), ['ой', 'ой', 'ую', 'ой', 'ой']);
  if (lw.length >= 4 && /[^аеёиоуыэюяь]яя$/.test(lw)) return decl(w, w.slice(0, -2), ['ей', 'ей', 'юю', 'ей', 'ей']);
  if (/[ая]$/.test(lw)) return given(w, g);
  return same(w);                                                                                   // Шевчук, Гоголь, Дюма
}

/** Слово, которое почти наверняка фамилия, даже если стоит первым. */
function looksLikeSurname(w: string, g: Gender): boolean {
  const lw = w.toLowerCase();
  if (lw.length < 5) return false;
  return g === 'm' ? /(ов|ев|ёв|ский|цкий|ской|цкой)$/.test(lw) : /(ова|ева|ёва|ская|цкая)$/.test(lw);
}

type Role = 'given' | 'surname' | 'patronymic' | 'particle';

function declineWord(word: string, role: Role, g: Gender): NameForms {
  if (role === 'particle') return same(word);
  const parts = word.split('-');
  const forms = parts.map((p, i) => {
    // Жан-Поль → Жан-Поля, но Анна-Мария → Анны-Марии, Римская-Корсакова → Римской-Корсаковой.
    if (role === 'given' && g === 'm' && i < parts.length - 1) return same(p);
    return role === 'surname' ? surname(p, g) : role === 'patronymic' ? patronymic(p, g) : given(p, g);
  });
  return join(forms, '-');
}

function join(forms: NameForms[], sep: string): NameForms {
  const k = (key: keyof NameForms) => forms.map((f) => f[key]).join(sep);
  return { nom: k('nom'), gen: k('gen'), dat: k('dat'), acc: k('acc'), ins: k('ins'), pre: k('pre') };
}

export function guessForms(raw: string, gender: Gender): NameForms {
  const n = raw.replace(/\s+/g, ' ').replace(/ ?- ?/g, '-').trim();
  if (!n) return same('');
  const words = n.split(' ');
  const roles: Role[] = words.map((w, i) => (i === 0 ? 'given' : PARTICLES.has(w.toLowerCase()) ? 'particle'
    : isPatronymic(w, gender) ? 'patronymic' : 'surname'));
  // Фамилия первой («Иванова Анна») или одна фамилия вместо имени («Петров»).
  if (looksLikeSurname(words[0], gender) && (words.length === 1 || (roles[1] === 'surname' && !looksLikeSurname(words[1], gender)))) {
    roles[0] = 'surname';
    if (words.length > 1) roles[1] = 'given';
  }
  return join(words.map((w, i) => declineWord(w, roles[i], gender)), ' ');
}

export const FORM_LABELS: Record<keyof NameForms, string> = {
  nom: 'кто?', gen: 'кого? нет…', dat: 'кому?', acc: 'кого? вижу…', ins: 'с кем?', pre: 'о ком?',
};
