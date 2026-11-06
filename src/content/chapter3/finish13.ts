import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P13 } from './point12';

export const finished13: Cond = all(P13, flag('A.c13_finished'), flag('B.c13_finished'));
const carHere: Cond = { itemAt: 'opel_corsa', place: 'hof_luedemann' };
const marcusHere: Cond = { npc: 'c12_marcus', alive: true, at: 'hof_luedemann' };
const brothersHere: Cond = all({ npc: 'deniz', alive: true, at: 'hof_luedemann' }, { npc: 'kerem', alive: true, at: 'hof_luedemann' });

export const point13Notes: MergeNote[] = [
  { id: 'c13_morning', when: finished13, effects: [{ set: 'w.c13_leo_found', value: true }],
    text: 'Утром Лео нашёлся сам, а врач отпустила Маркуса. Теперь вы оба знаете, чьи это были зубы.' },
  { id: 'c13_paper', when: all(finished13, { any: [{ v: 'B.c13_form', op: '==', value: 'truth' }, { v: 'B.c13_form', op: '==', value: 'leo' }] }),
    text: 'У Маркуса во внутреннем кармане бумага от врача: для постов, чтобы их с Лео не разлучили.' },
];

export const point13Leo: JointDecision = {
  id: 'c3_new_leo13', checkpoint: 13, canParticipate: P13,
  prompt: { default: 'Маркус хочет довести Лео до бабушки в Целле. Пешком это дня три. Можно отпустить их вдвоём, довезти на Corsa до пункта в Йестебурге, откуда идут автобусы на восток, или оставить Лео на хуторе, пока Маркус сходит за бабушкой. Разные ответы — решит сам Лео.' },
  options: [
    { id: 'marcus', label: { default: 'Отпустить их вдвоём к бабушке' },
      effects: [{ set: 'w.c13_leo', value: 'marcus' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', moveTo: 'c8_east_road' }] }, { if: { npc: 'c12_leo', alive: true }, then: [{ npc: 'c12_leo', moveTo: 'c8_east_road' }] }],
      text: 'Маркус жмёт вам руки, левой. Лео машет зайцем от калитки. Две фигуры уходят по полевой дороге на восток, маленькая и большая. У поворота маленькая берёт большую за рукав.' },
    { id: 'drive', label: { default: 'Довезти их на Corsa до пункта в Йестебурге: 9 км туда и обратно' },
      when: all(marcusHere, carHere, { fuelIn: 'opel_corsa', liters: 1.2 }),
      feasible: all({ has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 18 }),
      effects: [{ journey: { to: 'c13_sammel', km: 9, minutes: 20, vehicle: 'opel_corsa' } },
        { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', moveTo: 'c13_sammel' }] }, { if: { npc: 'c12_leo', alive: true }, then: [{ npc: 'c12_leo', moveTo: 'c13_sammel' }] },
        { journey: { to: 'hof_luedemann', km: 9, minutes: 20, vehicle: 'opel_corsa' } },
        { set: 'w.c13_leo', value: 'drive' }],
      text: 'Лео сидит на заднем сиденье с зайцем, Маркус рядом, рукой ему за плечи. У пункта в Йестебурге очередь и автобус с табличкой «Lüneburg — Uelzen — Celle». Маркус выходит первым. Лео оборачивается у дверей автобуса и машет. Вы возвращаетесь на хутор молча.' },
    { id: 'farm', label: { default: 'Оставить Лео на хуторе, пока Маркус сходит за бабушкой' },
      effects: [{ set: 'w.c13_leo', value: 'farm' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', moveTo: 'c8_east_road' }] }],
      text: 'Маркус долго сидит на корточках перед Лео и что-то объясняет. Лео кивает, не глядя на него. Маркус уходит один. Лео стоит у калитки, пока его видно, и потом ещё немного.' },
  ],
  compromises: [
    { pair: ['marcus', 'drive'], result: 'marcus' }, { pair: ['marcus', 'farm'], result: 'marcus' }, { pair: ['drive', 'farm'], result: 'marcus' },
  ],
  arbiters: [{ id: 'c13_leo_decides', when: P13, winner: 'marcus', text: 'Вы не сходитесь. Тогда Лео сам берёт Маркуса за рукав, тот, где бинт.' }],
  default: 'marcus',
};

export const point13Road: JointDecision = {
  id: 'c3_new_road13', checkpoint: 13, canParticipate: P13,
  prompt: { default: 'Дениз и Керем уходят в мастерскую в Бухгольце, двадцать километров. Можно отпустить их пешком или отвезти на Corsa и вернуться. Разные ответы — пешком.' },
  options: [
    { id: 'walk', label: { default: 'Братья идут пешком, вы остаётесь на хуторе' },
      effects: [{ set: 'w.c13_road', value: 'walk' }, { if: brothersHere, then: [{ npc: 'deniz', moveTo: 'deniz_workshop' }, { npc: 'kerem', moveTo: 'deniz_workshop' }] }],
      text: 'Дениз и Керем уходят по дороге на Бухгольц. У поворота Керем оборачивается и поднимает руку. Дениз не оборачивается.' },
    { id: 'drive', label: { default: 'Отвезти братьев в Бухгольц и вернуться' },
      when: all(brothersHere, carHere, { fuelIn: 'opel_corsa', liters: 2.6 }),
      feasible: all({ has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 40 }),
      effects: [{ journey: { to: 'deniz_workshop', km: 20, minutes: 35, vehicle: 'opel_corsa' } },
        { npc: 'deniz', moveTo: 'deniz_workshop' }, { npc: 'kerem', moveTo: 'deniz_workshop' },
        { journey: { to: 'hof_luedemann', km: 20, minutes: 35, vehicle: 'opel_corsa' } },
        { set: 'w.c13_road', value: 'drive' }, { npc: 'deniz', remember: 'c13_they_drove_us' }],
      text: 'У мастерской железные ворота и целая крыша, как и говорил Дениз. Керем выгружает рюкзаки, Дениз жмёт вам руки. «Если что — вы знаете, где мы». Обратно вы едете вдвоём.' },
  ],
  compromises: [
    { pair: ['walk', 'drive'], result: 'walk' },
  ],
  arbiters: [{ id: 'c13_nobody_leaves', when: P13, winner: 'walk', text: 'Вы не сходитесь. Братья уходят пешком.' }],
  default: 'walk',
};
