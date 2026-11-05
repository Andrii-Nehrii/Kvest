import type { NpcDef } from '../../engine/content-types';

// Нина — тот же id, что и прежняя карточка-контакт: после личной встречи карточка становится моделируемым человеком.
export const npcs9: Record<string, NpcDef> = {
  c7_nina: {
    id: 'c7_nina', name: 'Нина', introducedByStory: true,
    intro: 'Дочь Йенса, пятнадцать лет. Приехала на велосипеде из Винзена искать отца.',
    hidden: { goals: ['Побыть рядом с отцом', 'Не дать его убить без неё'], fears: ['Что взрослые решат всё за неё'], secrets: ['У неё запасной ключ от фургона'] },
    initial: { alive: true, location: 'hof_luedemann', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    initialItems: [{ type: 'c9_van_key', qty: 1 }], agenda: [],
  },
};
