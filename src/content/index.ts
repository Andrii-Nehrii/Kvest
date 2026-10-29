// Сборка сюжета беты. Новые главы подключаются сюда же (сцены, события, NPC, решения).
import type { CharacterTemplate, CheckpointDef, Content, JointDecision } from '../engine/content-types';
import { at } from '../engine/time';
import { openingScenes } from './chapter1/opening';
import { items } from './items';
import { events, facts, messages, npcs } from './people';
import { locations, network, weather } from './world';

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

const joint: Record<string, JointDecision> = {
  // Черновик КТ 1 — сцены, которые к ней ведут, пишутся в следующих сессиях.
  meet: {
    id: 'meet', checkpoint: 1,
    prompt: { default: 'Связь рвётся. Нужно решить, как вы будете добираться друг до друга.' },
    options: [
      { id: 'a_to_b', label: { A: 'Я еду за тобой в Гамбург', B: 'Пусть {partner} приедет за мной', default: 'A едет за B' },
        effects: [{ set: 'w.plan_meet', value: 'a_to_b' }], text: 'План: машина едет в Гамбург.' },
      { id: 'b_to_a', label: { A: 'Пусть {partner} выбирается ко мне', B: 'Я выбираюсь к {partner.dat}', default: 'B едет к A' },
        effects: [{ set: 'w.plan_meet', value: 'b_to_a' }], text: 'План: выбираться из города на юг.' },
      { id: 'meet_harburg', label: { default: 'Встречаемся на полпути, у Harburg' }, feasible: { not: { flag: 'w.harburg_cordon' } },
        effects: [{ set: 'w.plan_meet', value: 'harburg' }], text: 'План: встреча у Harburg.' },
      { id: 'wait', label: { default: 'Каждый пережидает у себя до утра' },
        effects: [{ set: 'w.plan_meet', value: 'wait' }], text: 'План: переждать до утра.' },
    ],
    compromises: [
      { pair: ['a_to_b', 'b_to_a'], result: 'meet_harburg', when: { all: [{ not: { flag: 'w.harburg_cordon' } }, { v: 'w.rail', op: '!=', value: 'stopped' }] } },
    ],
    arbiters: [
      { id: 'rail', when: { v: 'w.rail', op: '==', value: 'stopped' }, winner: 'a_to_b',
        text: 'Поезда на юг стоят — из города без машины не выбраться. Решила дорога.' },
      { id: 'jam', when: { flag: 'w.elbe_jam' }, winner: 'wait', text: 'Мосты через Эльбу стоят в пробке — до темноты не успеть никому.' },
    ],
    default: 'wait',
    rememberedBy: ['merle', 'ilse'],
  },
};

const checkpoints: CheckpointDef[] = [
  { index: 1, title: 'Первая связь', joint: ['meet'], next: { A: [{ scene: 'a_tbc' }], B: [{ scene: 'b_tbc' }] } },
];

export const content: Content = {
  version: 'beta-0.1',
  epochLabel: '10.11.2026',
  items, locations, routes: [],
  scenes: { ...openingScenes },
  facts, npcs, events, joint, checkpoints, messages, characters,
  initialVars: {
    'w.power.buchholz': 'off', 'w.power.buchholz.since': at(10, 5, 10),
    'w.rail': 'running', 'w.elbe_jam': false,
    // Кого персонажи знают с самого начала (соседи).
    'A.met.ilse': true, 'A.met.gerd': true, 'B.met.merle': true, 'B.met.okafor': true, 'B.met.dariusz': true, 'B.met.kasia': true,
  },
  initialPlaceItems: [
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
