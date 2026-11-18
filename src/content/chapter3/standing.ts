import type { MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';

// Накопленное отношение к вашему двору — Брандта (дружина, совет) и колонии у насыпи (Уте, Яннес и соседи).
// Складывается из решений с ноября и считается на сверке КТ47 (решения до 47-й) и КТ49 (решения 49-й), один раз — в строке A.
// Проверяется в важные моменты 48–50: кто где стоит, кого Брандт слушает и кто поднимет тревогу в новогоднюю ночь.
// Сыгранные точки (до 20-й) не затронуты: здесь только чтение их переменных.
const once: Cond = any({ me: 'A' }, all({ me: 'B' }, { partner: 'dead' }));
const B = 'w.c48_rep_brandt', C = 'w.c48_rep_colony';
const add = (key: string, value: number): Effect => ({ add: key, value });
const n = (id: string, when: Cond, effects: Effect[]): MergeNote => ({ id, when: all(once, when), effects });

export const repNotes48: MergeNote[] = [
  // Брандт
  n('rep48_b_truth', v('w.c25_truth', 'brandt'), [add(B, 1)]),
  n('rep48_b_truth_all', v('w.c25_truth', 'all'), [add(B, -1)]),
  n('rep48_b_monday_open', v('w.c23_monday', 'open'), [add(B, 1)]),
  n('rep48_b_monday_shut', v('w.c23_monday', 'shut'), [add(B, -1)]),
  n('rep48_b_sweep', v('w.c29_sweep', 'join'), [add(B, 1)]),
  n('rep48_b_sweep_leave', v('w.c29_sweep', 'leave'), [add(B, -1)]),
  n('rep48_b_council39', v('w.c39_council', 'brandt'), [add(B, 1)]),
  n('rep48_b_trench', flag('w.c41_trench_men'), [add(B, 1)]),
  n('rep48_b_council43', any(v('w.c43_council', 'truth'), v('w.c43_council', 'yard')), [add(B, 1)]),
  n('rep48_b_council43_silent', v('w.c43_council', 'silent'), [add(B, -1)]),
  n('rep48_b_silvester', any(v('w.c46_silvester', 'go'), v('w.c46_silvester', 'quiet')), [add(B, 1)]),
  n('rep48_b_silvester_stay', v('w.c46_silvester', 'stay'), [add(B, -1)]),
  n('rep48_b_food_less', v('w.c47_food', 'less'), [add(B, 1)]),
  n('rep48_b_food_more', v('w.c47_food', 'more'), [add(B, -1)]),
  n('rep48_b_colony_move', v('w.c17_colony', 'move'), [add(B, -1)]),
  // Колония
  n('rep48_c_garden', v('w.c15_garden', 'help'), [add(C, 1)]),
  n('rep48_c_garden_tell', v('w.c15_garden', 'tell'), [add(C, -1)]),
  n('rep48_c_jens', v('w.c14_jens', 'give'), [add(C, 1)]),
  n('rep48_c_warn', v('w.c16_sweep', 'warn'), [add(C, 1)]),
  n('rep48_c_colony', any(v('w.c17_colony', 'stand'), v('w.c17_colony', 'move')), [add(C, 1)]),
  n('rep48_c_stand44', any(v('A.c44_co', 'stand'), v('B.c44_co', 'stand')), [add(C, 1)]),
  n('rep48_c_verdict', v('w.c44_verdict', 'yard'), [add(C, 1)]),
  n('rep48_c_tree', flag('w.c42_ute_tree'), [add(C, 1)]),
  n('rep48_c_invited', flag('w.c44_ute_invited'), [add(C, 1)]),
  n('rep48_c_friend', flag('w.c47_colony_friend'), [add(C, 1)]),
];

export const repNotes49: MergeNote[] = [
  n('rep49_b_hollow', flag('w.c49_brandt_hollow'), [add(B, 1)]),
  n('rep49_b_volunteer', any(v('A.c49_mq', 'volunteer'), v('B.c49_mq', 'volunteer')), [add(B, 1)]),
  n('rep49_b_rockets', flag('w.c49_brandt_rockets'), [add(B, 1)]),
  n('rep49_c_told', flag('w.c49_colony_told'), [add(C, 1)]),
  n('rep49_c_potatoes', flag('w.c49_ute_potatoes'), [add(C, 1)]),
];

/** Брандт считает ваш двор своим: за месяц вы не раз стояли рядом. */
export const brandtHigh: Cond = { v: B, op: '>=', value: 3 };
/** Брандт помнит, что вы шли поперёк. */
export const brandtLow: Cond = { v: B, op: '<=', value: 0 };
/** Колония считает вас своими: Уте с декабря держит свою ночную смену и поднимет тревогу. */
export const colonyHigh: Cond = { v: C, op: '>=', value: 4 };
export const colonyLow: Cond = { v: C, op: '<=', value: 0 };
export const notBrandtHigh: Cond = not(brandtHigh);
