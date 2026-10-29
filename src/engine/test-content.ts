// Маленький тестовый мир для автоматических тестов движка (не сюжет игры).
import type { Content } from './content-types';
import { at } from './time';

const T0 = at(10, 7, 0);

export const testContent: Content = {
  version: 'test-1',
  epochLabel: 'test',
  items: {
    water: { id: 'water', name: 'бутылка воды 0,5 л', weight: 520, tags: ['drink'], food: { thirst: 30 } },
    bread: { id: 'bread', name: 'бутерброд', weight: 150, tags: ['food'], food: { hunger: 20, minutes: 10 }, spoilsAfter: 2880 },
    phone: { id: 'phone', name: 'смартфон', weight: 200, tags: ['phone'], battery: { drainPerHour: 15, idleDrainPerHour: 2 } },
    charger: { id: 'charger', name: 'зарядка', weight: 60, tags: ['charger'] },
    bandage: { id: 'bandage', name: 'бинт', weight: 30, tags: ['dressing'] },
    disinfectant: { id: 'disinfectant', name: 'антисептик', weight: 120, tags: ['antiseptic'], battery: { drainPerHour: 0, idleDrainPerHour: 0 } },
    jacket: { id: 'jacket', name: 'тёплая куртка', weight: 1200, tags: ['clothing'], clothing: { warmth: 3, biteProtection: 2, slot: 'outer' } },
    crowbar: { id: 'crowbar', name: 'монтировка', weight: 1500, tags: ['tool'] },
    golf: { id: 'golf', name: 'VW Golf', weight: 1300000, tags: ['vehicle'], vehicle: { fuel: 'petrol', tankL: 50, per100km: 6.5, seats: 5 } },
    can_diesel: { id: 'can_diesel', name: 'канистра дизеля 20 л', weight: 1500, tags: ['fuel'], fuelCan: { fuel: 'diesel', capacityL: 20 } },
    can_petrol: { id: 'can_petrol', name: 'канистра бензина 10 л', weight: 1000, tags: ['fuel'], fuelCan: { fuel: 'petrol', capacityL: 10 } },
    rice: { id: 'rice', name: 'рис, 1 кг', weight: 1000, tags: ['staple'], food: { kcal: 3600 } },
    water_l: { id: 'water_l', name: 'вода, литр', weight: 1000, tags: ['water_bulk'] },
    wood: { id: 'wood', name: 'дрова, кг', weight: 1000, tags: ['firewood'] },
    tire: { id: 'tire', name: 'шина 12.4-28', weight: 60000, tags: ['part'] },
  },
  locations: {
    flatA: { id: 'flatA', name: 'квартира A', region: 'hh', indoor: true, power: 'grid', safe: true },
    street: { id: 'street', name: 'улица', region: 'hh', indoor: false, media: ['people'] },
    flatB: { id: 'flatB', name: 'квартира B', region: 'lg', indoor: true, power: 'grid', safe: true, media: ['radio'] },
    shed: { id: 'shed', name: 'сарай', region: 'lg', indoor: true },
  },
  routes: [],
  scenes: {
    a_start: {
      id: 'a_start', for: 'A', chapter: 't', location: 'flatA', safe: true,
      text: [{ text: 'Утро. {name} на кухне.' }],
      actions: [
        { id: 'look', label: 'Осмотреться', minutes: 5, combinable: true, effects: [{ set: '$.looked', value: true }] },
        { id: 'pack', label: 'Собрать рюкзак', minutes: 10, combinable: true, effects: [{ give: 'water', qty: 2 }] },
        { id: 'stay', label: 'Остаться дома', minutes: 30, combinable: true, group: 'plan' },
        { id: 'go', label: 'Выйти на улицу', minutes: 10, move: true, combinable: true, group: 'plan', terminal: true, goto: 'a_street' },
        { id: 'fall', label: 'Споткнуться', minutes: 1, combinable: true, effects: [{ faint: 120 }, { set: 'w.road', value: 'closed' }] },
        { id: 'after_fall', label: 'Позвонить', minutes: 1, combinable: true, when: { cap: 'canAct', op: '==', value: 1 } },
      ],
    },
    a_street: {
      id: 'a_street', for: 'A', chapter: 't', location: 'street',
      text: [{ text: 'Улица.' }],
      actions: [
        { id: 'fight', label: 'Драться', minutes: 2, risky: true, outcomes: [
          { id: 'win', check: { traits: ['melee'], difficulty: 5, uses: ['strength'] }, text: 'Отбился.' },
          { id: 'hurt', text: 'Укусил.', effects: [{ injure: 'bite', site: 'leftArm', severity: 3, exposure: 1 }] },
        ] },
        { id: 'cp', label: 'Дойти до точки', minutes: 20, move: true, goto: 'a_cp1', effects: [{ set: 'w.shop', value: 'looted' }, { add: 'w.panic', value: 2 }] },
      ],
    },
    a_cp1: { id: 'a_cp1', for: 'A', chapter: 't', checkpoint: 1, text: [{ text: 'Точка.' }], actions: [], universal: false },
    b_start: {
      id: 'b_start', for: 'B', chapter: 't', location: 'flatB', safe: true,
      text: [{ text: 'Утро у {name.gen}.' }],
      actions: [
        { id: 'radio', label: 'Слушать радио', minutes: 20, effects: [{ learn: 'f_attacks' }] },
        { id: 'shed', label: 'В сарай', minutes: 5, goto: 'b_shed', effects: [{ drop: 'water', qty: 1 }] },
      ],
    },
    b_shed: {
      id: 'b_shed', for: 'B', chapter: 't', location: 'shed',
      text: [{ text: 'Сарай.' }],
      actions: [
        { id: 'help', label: 'Помочь соседу', minutes: 30, activity: 'moderate', effects: [{ npc: 'nadia', trust: 20, remember: '$:helped' }, { add: 'w.panic', value: 1 }, { set: 'w.road', value: 'open' }] },
        { id: 'cp', label: 'Дальше', minutes: 15, goto: 'b_cp1' },
      ],
    },
    b_cp1: { id: 'b_cp1', for: 'B', chapter: 't', checkpoint: 1, text: [{ text: 'Точка.' }], actions: [], universal: false },
    a_next: { id: 'a_next', for: 'A', chapter: 't2', text: [{ text: 'Дальше A.' }], actions: [] },
    b_next: { id: 'b_next', for: 'B', chapter: 't2', text: [{ text: 'Дальше B.' }], actions: [] },
    b_evac: { id: 'b_evac', for: 'B', chapter: 't2', text: [{ text: 'Эвакуация B.' }], actions: [] },
  },
  facts: {
    f_attacks: { id: 'f_attacks', text: 'По радио: нападения в Гамбурге.', topic: 'новости', truth: 'true' },
  },
  npcs: {
    nadia: {
      id: 'nadia', name: 'Надя', intro: 'Соседка.',
      initial: { alive: true, location: 'shed', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
      agenda: [{ id: 'leave', at: at(10, 9, 0), scope: 'B', when: { npc: 'nadia', trust: ['<', 10] }, effects: [{ npc: 'nadia', moveTo: 'gone', set: { left: true } }] }],
    },
  },
  events: [
    { id: 'ev_news', at: at(10, 7, 30), scope: 'world', effects: [{ set: 'w.phase', value: 1 }], news: [{ channel: 'radio', text: 'Радио: беспорядки.', learn: 'f_attacks', kind: 'rumor' }] },
  ],
  joint: {
    plan: {
      id: 'plan', checkpoint: 1,
      prompt: { default: 'Что делать дальше?' },
      options: [
        { id: 'stay', label: { default: 'Остаться' }, effects: [{ set: 'w.plan', value: 'stay' }], text: 'Остаётесь.' },
        { id: 'evac', label: { default: 'Эвакуироваться' }, feasible: { v: 'w.road', op: '!=', value: 'closed' }, effects: [{ set: 'w.plan', value: 'evac' }], text: 'Уезжаете.' },
        { id: 'guard', label: { default: 'Охрана' }, effects: [{ set: 'w.guard', value: true }], text: 'Охрана.' },
        { id: 'food', label: { default: 'Еда' }, effects: [{ set: 'w.food', value: true }], text: 'Еда.' },
        { id: 'half', label: { default: 'Половина' }, effects: [{ set: 'w.meds', value: 'half' }], text: 'Половина.' },
        { id: 'all', label: { default: 'Всё' }, effects: [{ set: 'w.meds', value: 'all' }], text: 'Всё.' },
        { id: 'none', label: { default: 'Ничего' }, effects: [{ set: 'w.meds', value: 'none' }], text: 'Ничего.' },
      ],
      compatible: [['guard', 'food']],
      compromises: [{ pair: ['all', 'none'], result: 'half', when: { v: 'w.panic', op: '<', value: 5 } }],
      arbiters: [
        { id: 'storm', when: { v: 'w.storm', op: '==', value: true }, winner: 'stay', text: 'Шторм не даёт уехать.' },
      ],
      fallbackWeights: [{ option: 'stay', base: 1 }, { option: 'evac', base: 1, mods: [{ when: { v: 'w.panic', op: '>=', value: 3 }, add: 2 }] }],
      rememberedBy: ['nadia'],
      default: 'stay',
    },
  },
  checkpoints: [
    {
      index: 1, title: 'Первая точка', joint: ['plan'],
      next: {
        A: [{ scene: 'a_next' }],
        B: [{ when: { v: 'w.plan', op: '==', value: 'evac' }, scene: 'b_evac' }, { scene: 'b_next' }],
      },
    },
  ],
  projects: {
    tractor: { id: 'tractor', name: 'Ремонт колеса трактора', hours: 6, traits: ['technical', 'strength'], difficulty: 5, needs: [{ type: 'tire', qty: 1, consumed: true }], onDone: [{ set: 'w.tractor', value: 'ok' }] },
  },
  bases: [{ id: 'farm', name: 'ферма', places: ['flatB', 'shed'], stock: 'shed', waterPerPerson: 3, kcalPerPerson: 2200, heating: { tag: 'firewood', perDay: (t) => (t < 10 ? 15 : 5) } }],
  messages: [{ id: 'ok', label: 'Я в порядке', text: 'Я в порядке, не волнуйся.', learn: 'f_partner_ok' }],
  characters: {
    A: { pid: 'A', gender: 'm', traits: { strength: 4, endurance: 4, agility: 3, melee: 4, medicine: 1, driving: 3, stealth: 2, persuasion: 2, technical: 2 },
      startScene: 'a_start', startLocation: 'flatA', startItems: [{ type: 'phone', charge: 80 }, { type: 'charger' }, { type: 'water' }, { type: 'jacket' }] },
    B: { pid: 'B', gender: 'f', traits: { strength: 2, endurance: 3, agility: 3, melee: 1, medicine: 2, driving: 2, stealth: 3, persuasion: 4, technical: 2 },
      startScene: 'b_start', startLocation: 'flatB', startItems: [{ type: 'phone', charge: 60 }, { type: 'water', qty: 2 }, { type: 'bandage', qty: 2 }] },
  },
  initialVars: { 'w.panic': 0, 'w.phase': 0 },
  mergePolicies: { 'w.panic': 'delta' },
  weather: () => ({ tempC: 6, rain: true, wind: 15 }),
};

export const T_START = T0;

export const testSetup = {
  pairId: 'pair-test',
  seed: 'seed-1',
  startTime: T0,
  players: {
    A: { name: { nom: 'Игорь', gen: 'Игоря', dat: 'Игорю', acc: 'Игоря', ins: 'Игорем', pre: 'Игоре' } },
    B: { name: { nom: 'Лена', gen: 'Лены', dat: 'Лене', acc: 'Лену', ins: 'Леной', pre: 'Лене' } },
  },
};
