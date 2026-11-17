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
  c22_lukas: {
    id: 'c22_lukas', name: 'Лукас', fromCheckpoint: 21,
    intro: 'Сын пожарного, лет четырнадцати. Носит по дворам бумаги и поручения Брандта, водит трактор пожарной части.',
    knownWhen: { any: [{ visited: 'c22_a_runner' }, { visited: 'c25_y_b_stove' }, { visited: 'c41_a_bodies' }, { visited: 'c41_r_doc' }, { visited: 'c42_a_gun' }, { visited: 'c42_a_trench' }] },
  },
  c39_jorg: {
    id: 'c39_jorg', name: 'Йорг', fromCheckpoint: 38,
    intro: 'Пришёл к воротам хутора с двумя детьми, просил ночлега. Младшая простужена.',
    knownWhen: { any: [{ v: '$.c39_bg', op: '==', value: 'barn' }, { all: [{ v: 'w.c39_strangers', op: '==', value: 'barn' }, { any: [{ visited: 'c40_m_barn' }, { visited: 'c40_b_barn' }, { visited: 'c41_a_jorg' }, { visited: 'c41_b_jorg' }] }] }] },
  },
  c40_hansen: {
    id: 'c40_hansen', name: 'Фрау Ханзен', fromCheckpoint: 39,
    intro: 'Соседка за полем, у насыпи. Муж у неё лежачий после удара.',
    knownWhen: { any: [{ all: [{ visited: 'c40_m_neighbor' }, { not: { flag: 'w.c37_neighbor_saved' } }] }, { visited: 'c40_b_neighbor' }, { visited: 'c41_b_gerdes' }, { visited: 'c42_a_hansen' }, { visited: 'c42_b_hansen' }] },
  },
  c42_jonas: {
    id: 'c42_jonas', name: 'Йонас Ридель', fromCheckpoint: 41,
    intro: 'Солдат-срочник, девятнадцать лет. С ноября жил в яме под поваленным дубом в лесополосе за полем.',
    knownWhen: { visited: 'c42_a_jonas' },
  },
  c42_bahr: {
    id: 'c42_bahr', name: 'Коринна Бар', fromCheckpoint: 41,
    intro: 'Мать двоих маленьких детей, Пауля и Мии. Последний дом у Люллау. Хенрике кормила их по понедельникам.',
    knownWhen: { flag: '$.met.c42_bahr' },
  },
  c42_lars: {
    id: 'c42_lars', name: 'Ларс', fromCheckpoint: 41,
    intro: 'Сын обходчика, одиннадцать лет. Живёт с бабушкой в будке у переезда. Хенрике кормила его по понедельникам.',
    knownWhen: { flag: '$.met.c42_lars' },
  },
  c35_haase: {
    id: 'c35_haase', name: 'Оберлейтенант Хаазе', fromCheckpoint: 34,
    intro: 'Офицер комендатуры Люнебурга, в очках, с планшетом. Переписывал жильцов хутора для зимнего снабжения.',
    knownWhen: { visited: 'c35_list' },
  },
  c34_gerdes: {
    id: 'c34_gerdes', name: 'Фрау Гердес', fromCheckpoint: 33,
    intro: 'Ищет мужа, развозчика посылок. Десятого ноября он не вернулся домой.',
    knownWhen: { visited: 'c34_a_post' },
  },
  c34_sabina: {
    id: 'c34_sabina', name: 'Сабина', fromCheckpoint: 33,
    intro: 'Дочь Брандта, мать Матса.',
    knownWhen: { visited: 'c34_b_warm' },
  },
  c34_mats: {
    id: 'c34_mats', name: 'Матс', fromCheckpoint: 33,
    intro: 'Внук Брандта, мальчик лет девяти. Провалился под лёд на мельничном пруду в Йестебурге.',
    knownWhen: { visited: 'c34_b_pond' },
  },
  c3_jens: {
    id: 'c3_jens', name: 'Йенс', fromCheckpoint: 5,
    intro: 'Приехал к воротам хутора на белом развозном фургоне. Попросил воды и помощи.',
    knownWhen: { visited: 'c6_l_arrival' },
  },
};
