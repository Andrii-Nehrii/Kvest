import type { NpcDef } from '../../engine/content-types';

export const npcs8: Record<string, NpcDef> = {
  c8_ruth: {
    id: 'c8_ruth', name: 'Рут', introducedByStory: true,
    intro: 'Везёт соседей на микроавтобусе. Остановилась у дороги к Йестебургу.',
    hidden: { goals: ['Не потерять ни одного пассажира', 'Довезти людей на восток до темноты'], fears: ['Уехать, оставив человека на остановке'] },
    initial: { alive: true, location: 'c7_farm_lane', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    initialItems: [{ type: 'c8_roll', qty: 6 }, { type: 'water_05', qty: 4 }], agenda: [],
  },
  c8_eva: {
    id: 'c8_eva', name: 'Ева', introducedByStory: true,
    intro: 'Пассажирка Рут. Её муж Хельмут отошёл за водой.',
    hidden: { goals: ['Дождаться мужа', 'Не потерять место и вещи'], fears: ['Выйти из автобуса и остаться одной'] },
    initial: { alive: true, location: 'c7_farm_lane', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    initialItems: [{ type: 'c8_helmut_coat', qty: 1 }], agenda: [],
  },
  c8_helmut: {
    id: 'c8_helmut', name: 'Хельмут', introducedByStory: true,
    intro: 'Муж Евы. Отошёл от микроавтобуса за водой к старому колодцу.',
    initial: { alive: false, location: 'c8_well_path', status: 'dead', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    initialItems: [{ type: 'c8_helmut_wallet', qty: 1 }, { type: 'empty_bottle_15', qty: 1 }], agenda: [],
  },
};
