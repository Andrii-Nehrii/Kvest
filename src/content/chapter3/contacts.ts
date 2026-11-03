import type { ContactDef } from '../../engine/content-types';

export const contacts3: Record<string, ContactDef> = {
  c7_nina: {
    id: 'c7_nina', name: 'Нина', fromCheckpoint: 6,
    intro: 'Йенс назвал её человеком, с которым живёт. Просил передать ей сообщение.',
    knownWhen: { any: [{ visited: 'c7_b_recipient' }, { flag: 'w.c7_nina_shared' }] },
  },
  c3_jens: {
    id: 'c3_jens', name: 'Йенс', fromCheckpoint: 5,
    intro: 'Приехал к воротам хутора на белом развозном фургоне. Попросил воды и помощи.',
    knownWhen: { visited: 'c6_l_arrival' },
  },
};
