import type { ContactDef } from '../../engine/content-types';

export const contacts3: Record<string, ContactDef> = {
  c8_helmut: {
    id: 'c8_helmut', name: 'Хельмут', fromCheckpoint: 7,
    intro: 'Муж Евы. Отошёл от микроавтобуса за водой к старому колодцу.',
    knownWhen: { flag: '$.met.c8_helmut' },
  },
  c7_nina: {
    id: 'c7_nina', name: 'Нина', fromCheckpoint: 6,
    intro: 'Йенс назвал её человеком, с которым живёт. Просил передать ей сообщение.',
    knownWhen: { any: [{ visited: 'c7_b_recipient' }, { flag: 'w.c7_nina_shared' }, { flag: 'w.c8_nina_shared' }] },
  },
  c18_volker: {
    id: 'c18_volker', name: 'Фолькер', fromCheckpoint: 17,
    intro: 'Кровельщик из Тоштедта. Идёт пешком с ручной тележкой и просит ночлег за работу.',
    knownWhen: { any: [{ flag: '$.met.c18_volker' }, { flag: 'w.c18_lodger' }] },
  },
  c18_jana: {
    id: 'c18_jana', name: 'Яна', fromCheckpoint: 17,
    intro: 'Девушка лет двадцати из женского корпуса в Люнебурге. Умеет доить и шить.',
    knownWhen: { any: [{ flag: '$.met.c18_jana' }, { v: 'w.c18_seat', op: '==', value: 'jana' }] },
  },
  c18_hanna: {
    id: 'c18_hanna', name: 'Ханна', fromCheckpoint: 17,
    intro: 'Ехала в Люнебург в одном кузове с тобой, с мальчиком лет шести.',
    knownWhen: { any: [{ v: '$.c18_bt', op: '==', value: 'woman' }, { visited: 'c18_b_queue' }] },
  },
  c18_ahlers: {
    id: 'c18_ahlers', name: 'Доктор Алерс', fromCheckpoint: 17,
    intro: 'Врач донорского блока в казарме Люнебурга. Седая коса, карты заполняет на подоконнике.',
    knownWhen: { visited: 'c18_b_doctor' },
  },
  c18_peters: {
    id: 'c18_peters', name: 'Фрау Петерс', fromCheckpoint: 17,
    intro: 'Старая женщина в мужском свитере из третьего ряда женского корпуса. В казарме с тринадцатого.',
    knownWhen: { visited: 'c18_b_block' },
  },
  c3_jens: {
    id: 'c3_jens', name: 'Йенс', fromCheckpoint: 5,
    intro: 'Приехал к воротам хутора на белом развозном фургоне. Попросил воды и помощи.',
    knownWhen: { visited: 'c6_l_arrival' },
  },
};
