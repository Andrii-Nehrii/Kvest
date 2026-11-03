import type { ContactDef } from '../../engine/content-types';

export const contacts3: Record<string, ContactDef> = {
  c3_jens: {
    id: 'c3_jens', name: 'Йенс', fromCheckpoint: 5,
    intro: 'Приехал к воротам хутора на белом развозном фургоне. Попросил воды и помощи.',
    knownWhen: { visited: 'c6_l_arrival' },
  },
};
