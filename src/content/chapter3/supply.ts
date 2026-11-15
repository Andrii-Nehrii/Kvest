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
const days = (n: number) => (n === 28 || n === 31 ? 2 : 1);
const potatoes = (n: number): Effect => ({ place: 'potatoes', at: 'c3_farm_stock', qty: 14 * days(n) });
const full: Cond = all(flag('w.c24_ration'), not(v('w.c24_ration', 'half')));
const half: Cond = v('w.c24_ration', 'half');

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
