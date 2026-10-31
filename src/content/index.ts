// Сборка сюжета беты. Новые главы подключаются сюда же (сцены, события, NPC, решения).
import type { CharacterTemplate, Content, Scene } from '../engine/content-types';
import type { Cond } from '../engine/types';
import { SEG2 } from './chapter1/common';
import { at } from '../engine/time';
import { aRoadScenes } from './chapter1/a_road';
import { aTownScenes } from './chapter1/a_town';
import { bRoadScenes } from './chapter1/b_road';
import { bTownScenes } from './chapter1/b_town';
import { checkpoints, joint } from './chapter1/kt';
import { CONTACT_AFTER, openingScenes } from './chapter1/opening';
import { items } from './items';
import { events, facts, messages, npcs } from './people';
import { locations, network, weather } from './world';
import { awayScenes, chapterEntry, nightRoutes } from './chapter2/away';
import { dayRoutes, dayScenes, withDay } from './chapter2/day';
import { checkpoint3, checkpoint4, joint3 } from './chapter2/kt3';
import { nightScenes } from './chapter2/night';
import { agenda2, events2, facts2, locations2, npcs2 } from './chapter2/world2';
import type { NpcDef } from '../engine/content-types';

import { incidentEvents3, scenes3 } from './chapter3';
import { checkpoints3, jointChapter3 } from './chapter3/kt5';
import { agenda3, bases3, events3, facts3, locations3, projects3, stock3, npcs3 } from './chapter3/world3';

const characters: Record<'A' | 'B', CharacterTemplate> = {
  A: {
    pid: 'A', gender: 'm', startScene: 'a_wake', startLocation: 'a_flat',
    traits: { strength: 4, endurance: 4, agility: 3, melee: 4, medicine: 1, driving: 3, stealth: 2, persuasion: 3, technical: 2 },
    startItems: [{ type: 'phone', charge: 31 }, { type: 'keys_home' }],
  },
  B: {
    pid: 'B', gender: 'f', startScene: 'b_wake', startLocation: 'b_flat',
    traits: { strength: 1, endurance: 2, agility: 3, melee: 0, medicine: 2, driving: 2, stealth: 3, persuasion: 3, technical: 1 },
    startItems: [{ type: 'phone', charge: 64 }, { type: 'keys_home' }],
  },
};

/** Черты, которые игрок может менять при создании персонажа (физические — нет). */
export const EDITABLE_TRAITS = ['medicine', 'driving', 'stealth', 'persuasion', 'technical'] as const;
export const TRAIT_BUDGET = 3;

/**
 * Переходы между местами (действия, уводящие из сцены) по умолчанию повторяемы — иначе после первого
 * «Пойти на кухню» дорога туда исчезала бы навсегда — и совместимы с другими действиями (в плане они
 * всё равно только последние: «собрать рюкзак, потом выйти»). Исключения помечаются явно (false).
 */
function withRepeatableMoves(scenes: Record<string, Scene>): Record<string, Scene> {
  return Object.fromEntries(Object.entries(scenes).map(([id, s]) => [id, {
    ...s, actions: s.actions.map((a) => (a.terminal || a.goto ? { ...a, repeatable: a.repeatable ?? true, combinable: a.combinable ?? true } : a)),
  }]));
}

/** Участок 1 затянулся после 14:00 — в местах с переходом к КТ 1 остаётся только он (плюс повседневное). */
const LATE_SEG1: Cond = { all: [{ not: SEG2 }, { after: at(10, 14, 0) }] };
// Довести Брокманов до машины / отвезти домой: пока они на руках у A, переход к КТ 1 скрыт (a_town.ts, brockFirst).
const KEEP_LATE = new Set(['cp1_call', 'cp1_noon', 'keys_up', 'to_car', 'brock_back', 'home_brock']);
function withLateSegment1(scenes: Record<string, Scene>): Record<string, Scene> {
  return Object.fromEntries(Object.entries(scenes).map(([id, s]) => {
    if (!s.actions.some((a) => a.id === 'cp1_call')) return [id, s];
    return [id, { ...s, actions: s.actions.map((a) => (KEEP_LATE.has(a.id) ? a : { ...a, when: a.when ? { all: [{ not: LATE_SEG1 }, a.when] } : { not: LATE_SEG1 } })) }];
  }));
}

/** Планы NPC следующих глав дописываются в конец их agenda: прежние пункты не меняются. */
function withAgenda(base: Record<string, NpcDef>, extra: Record<string, NpcDef['agenda']>): Record<string, NpcDef> {
  return Object.fromEntries(Object.entries(base).map(([id, n]) => [id, extra[id] ? { ...n, agenda: [...n.agenda, ...extra[id]] } : n]));
}

const chapter2Scenes: Record<string, Scene> = withDay({
  ...nightScenes, ...awayScenes, ...dayScenes, a_ch2: chapterEntry('a_ch2', 'A'), b_ch2: chapterEntry('b_ch2', 'B'),
});
/** После КТ 3: дорога к решённому месту или день там, где каждый есть. */
const kt3Next = { A: dayRoutes(nightRoutes()), B: dayRoutes(nightRoutes()) };

export const content: Content = {
  version: 'beta-0.1',
  epochLabel: '10.11.2026',
  items: { ...items, c3_hose: { id: 'c3_hose', name: 'шланг с хомутами', weight: 800, tags: ['parts'] } }, locations: { ...locations, ...locations2, ...locations3 }, routes: [],
  scenes: withLateSegment1(withRepeatableMoves({ ...openingScenes, ...aTownScenes, ...aRoadScenes, ...bTownScenes, ...bRoadScenes, ...chapter2Scenes, ...scenes3 })),
  facts: { ...facts, ...facts2, ...facts3 }, npcs: withAgenda({ ...withAgenda(npcs, agenda2), ...npcs2, ...npcs3 }, agenda3), events: [...events, ...events2, ...events3, ...incidentEvents3],
  joint: { ...joint, ...joint3, ...jointChapter3 }, checkpoints: [...checkpoints, checkpoint3(kt3Next), checkpoint4, ...checkpoints3], messages, characters,
  partnerContactAfter: CONTACT_AFTER,
  initialVars: {
    'w.power.buchholz': 'off', 'w.power.buchholz.since': at(10, 5, 10),
    'w.rail': 'running', 'w.elbe_jam': false, 'w.crossings': 'open', 'w.city_trains': 'running', 'w.hosp_buchholz': 'open',
    'w.harburg_cordon': false, 'w.power.hh': 'on', 'w.plan_a': 'none', 'w.plan_b': 'none',
    // Кого персонажи знают с самого начала (соседи).
    'A.met.ilse': true, 'A.met.gerd': true, 'B.met.merle': true, 'B.met.okafor': true, 'B.met.dariusz': true, 'B.met.kasia': true,
  },
  bases: bases3, projects: projects3,
  initialPlaceItems: [
    ...stock3,
    ...['jeans', 'hoodie', 'boots', 'winter_jacket', 'beanie', 'gloves', 'backpack', 'canned_beans', 'crackers', 'chocolate', 'coffee',
      'first_aid', 'disinfectant', 'batteries_aa', 'candles', 'lighter', 'multitool', 'kitchen_knife', 'duct_tape', 'charger', 'bank_card', 'car_keys']
      .map((type) => ({ type, at: 'a_flat' })),
    { type: 'water_15', at: 'a_flat', qty: 2 }, { type: 'water_05', at: 'a_flat' }, { type: 'bread', at: 'a_flat' },
    { type: 'canned_ravioli', at: 'a_flat', qty: 2 }, { type: 'pasta', at: 'a_flat', qty: 2 }, { type: 'apple', at: 'a_flat', qty: 3 },
    { type: 'ibuprofen', at: 'a_flat', qty: 6 }, { type: 'cash_eur', at: 'a_flat', qty: 45 },
    { type: 'flashlight', at: 'a_flat', charge: 70 }, { type: 'powerbank', at: 'a_flat', charge: 40 },
    { type: 'opel_corsa', at: 'a_yard', fuel: 14 },

    ...['jeans', 'hoodie', 'sneakers', 'rain_jacket', 'beanie', 'backpack', 'crackers', 'rice', 'eggs', 'milk', 'chocolate', 'plasters',
      'candles', 'lighter', 'charger', 'bank_card', 'towel', 'trash_bags', 'kitchen_knife', 'pasta', 'water_05']
      .map((type) => ({ type, at: 'b_flat' })),
    { type: 'canned_tomatoes', at: 'b_flat', qty: 2 }, { type: 'apple', at: 'b_flat', qty: 2 },
    { type: 'ibuprofen', at: 'b_flat', qty: 4 }, { type: 'cash_eur', at: 'b_flat', qty: 30 },
    { type: 'powerbank', at: 'b_flat', charge: 80 }, { type: 'bicycle', at: 'b_yard' },
  ],
  mergePolicies: {},
  weather,
  network,
};
