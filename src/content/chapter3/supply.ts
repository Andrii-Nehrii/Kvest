import type { MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';

// Еда хутора в точках запаса (с КТ20; сыгранные точки не затронуты: до КТ20 список пуст).
// Склад к 19-й — то, что пара свезла сама; без пополнения общий стол пустеет к 26–27-й, а тексты говорят о сытном столе.
// Два источника, одинаково на обоих телефонах (заметка сверки, один раз — в строке A, а без A — в строке B):
//   бурт Хенрике за сараем — картошка на зиму, по дню на точку (по два — на двухдневные участки);
//   паёк по списку Брандта — с КТ24 (`w.c24_ration`): полный — армейский суточный паёк на троих, половинный — на одного.
const once: Cond = any({ me: 'A' }, all({ me: 'B' }, { partner: 'dead' }));
// Сколько суток длится участок n+1 (по КТ в kt5.ts): 29, 32, 34, 39, 42–45, 47–49 — по двое, 40-й — четыре утра (с 43-го по 46-й день). Новой многодневной точке — добавить сюда.
const DAYS: Record<number, number> = { 28: 2, 31: 2, 33: 2, 38: 2, 39: 4, 41: 2, 42: 2, 43: 2, 44: 2, 46: 2, 47: 2, 48: 2 };
const days = (n: number) => DAYS[n] ?? 1;
// С КТ32 за столом девять-десять человек, пайка Брандта может не быть: бурт открывают шире (22 кг в сутки — около 3/4 нужного на десятерых).
const potatoes = (n: number): Effect => ({ place: 'potatoes', at: 'c3_farm_stock', qty: (n >= 32 ? 22 : 14) * days(n) });
// Вычеркнутый из списка Брандта (КТ28 `off`) хутор пайка не получает; учёт комендатуры в 35-й (`w.c35_army_ration`) ставит его
// на армейское снабжение — полный паёк, кто бы ни вычеркнул.
const off: Cond = v('w.c28_list', 'off');
const army: Cond = flag('w.c35_army_ration');
const full: Cond = any(army, all(flag('w.c24_ration'), not(v('w.c24_ration', 'half')), not(off)));
const half: Cond = all(v('w.c24_ration', 'half'), not(off), not(army));

export function supplyNotes(n: number): MergeNote[] {
  if (n < 20) return [];
  const notes: MergeNote[] = [];
  if (n === 20) notes.push({ id: 'c20_supply_clamp', when: once, text: 'За сараем, под соломой и слоем земли, — бурт Хенрике: картошка на зиму. Хватит, если брать понемногу. Она сама так сказала.', effects: [potatoes(n)] });
  else notes.push({ id: `c${n}_supply_clamp`, when: once, effects: [potatoes(n)] });
  if (n >= 24) {
    notes.push({ id: `c${n}_supply_full`, when: all(once, full), effects: [{ place: 'c24_epa', at: 'c3_farm_stock', qty: 3 * days(n) }] });
    notes.push({ id: `c${n}_supply_half`, when: all(once, half), effects: [{ place: 'c24_epa', at: 'c3_farm_stock', qty: days(n) }] });
  }
  if (n === 24) notes.push({ id: 'c24_supply_text', when: all(once, flag('w.c24_ration')), text: 'По списку Брандта хутору положен паёк: армейские суточные наборы в зелёной плёнке. Их привозят к воротам вместе с хлебом.' });
  return notes;
}
