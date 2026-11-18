import type { Cond } from '../../engine/types';
import { all } from './world3';
import { any, v } from './point18';
import { evaHere } from './point19';

// Кто живёт в доме после КТ28 (`w.c28_house`): условия для своих сцен в 29–31 и откликов дальше. План — REWORK_PLAN.md.
const farm = 'hof_luedemann';
export const house28 = (x: string): Cond => v('w.c28_house', x);
export const evaIn: Cond = all(house28('eva'), evaHere, { npc: 'c8_eva', alive: true });
export const kasiaIn: Cond = all(house28('kasia'), any({ npc: 'kasia', alive: true, at: farm }, { npc: 'kasia', alive: true, at: 'c3_farm_shed' }));
export const leaIn: Cond = all(house28('lea'), { npc: 'c21_lea', alive: true, at: farm });
export const houseAny: Cond = any(evaIn, kasiaIn, leaIn);
/** Не выбранные, но живущие на хуторе. */
export const evaOut: Cond = all(evaHere, { npc: 'c8_eva', alive: true }, { not: house28('eva') });
export const kasiaOut: Cond = all(any({ npc: 'kasia', alive: true, at: farm }, { npc: 'kasia', alive: true, at: 'c3_farm_shed' }), { not: house28('kasia') });
export const leaOut: Cond = all({ npc: 'c21_lea', alive: true, at: farm }, { not: house28('lea') });
export const evaRole = (x: string): Cond => v('w.c29_eva_role', x);
export const kasiaRoad = (x: string): Cond => v('w.c29_kasia_road', x);
export const leaPatient = (x: string): Cond => v('w.c29_lea_patient', x);
export const leaRoad = (x: string): Cond => v('w.c29_lea_road', x);

/** Вечер субботы в 29-й: после Керема (A) и после венка (B) — к своей сцене дома. */
export const toHouseA29 = [{ id: 'he', when: evaIn, goto: 'c29_ha_eva' }, { id: 'hk', when: kasiaIn, goto: 'c29_ha_kasia' }, { id: 'hl', when: leaIn, goto: 'c29_ha_lea' }, { id: 'n', goto: 'c29_night' }];
export const toHouseB29 = [{ id: 'he', when: evaIn, goto: 'c29_hb_eva' }, { id: 'hk', when: kasiaIn, goto: 'c29_hb_kasia' }, { id: 'hl', when: leaIn, goto: 'c29_hb_lea' }, { id: 'n', goto: 'c29_night' }];
/** Вторая половина дня в 30-й: перед сумерками — к тому, кто живёт в доме. */
export const toHouse30 = [{ id: 'h', when: houseAny, goto: 'c30_hs' }, { id: 'd', goto: 'c30_dusk' }];
/** После ужина в 31-й (оба на ногах): к своей сцене с тем, кто живёт в доме, потом — поздний вечер линии. */
const meA: Cond = { me: 'A' };
const up: Cond = { partner: 'active' };
export const afterSupper31 = [
  { id: 'hae', when: all(meA, up, evaIn), goto: 'c31_ha_eva' }, { id: 'hak', when: all(meA, up, kasiaIn), goto: 'c31_ha_kasia' },
  { id: 'hal', when: all(meA, up, leaIn), goto: 'c31_ha_lea' }, { id: 'a', when: meA, goto: 'c31_a_late' },
  { id: 'hbe', when: all(up, evaIn), goto: 'c31_hb_eva' }, { id: 'hbk', when: all(up, kasiaIn), goto: 'c31_hb_kasia' },
  { id: 'hbl', when: all(up, leaIn), goto: 'c31_hb_lea' }, { id: 'b', goto: 'c31_b_late' },
];
/** Дальние отклики (39–50): Кася не ушла десятого и живёт на хуторе; Лея на хуторе. */
export const kasiaLate: Cond = any({ npc: 'kasia', alive: true, at: farm }, { npc: 'kasia', alive: true, at: 'c3_farm_shed' });
export const leaLate: Cond = { npc: 'c21_lea', alive: true, at: farm };
