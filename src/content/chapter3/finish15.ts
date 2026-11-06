import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P15 } from './point14';

export const finished15: Cond = all(P15, flag('A.c15_finished'), flag('B.c15_finished'));
const carHere: Cond = { itemAt: 'opel_corsa', place: 'hof_luedemann' };

export const point15Notes: MergeNote[] = [
  { id: 'c15_letter', when: all(finished15, flag('B.c15_henrike_letter')),
    text: 'Письмо Хенрике лежит на кухонном столе, придавленное солонкой: «Хутор ваш, пока не вернёмся».' },
];

point15Notes.push(
  { id: 'c15_canisters', when: all(finished15, { v: 'A.c15_water', op: '==', value: 'colony' }),
    text: 'У задней калитки стоят две полные канистры, сорок литров. Налиты для колонии, на случай если решите помогать.' },
  { id: 'c15_bag_packed', when: all(finished15, { v: 'B.c15_bag', op: '==', value: 'leave' }),
    text: 'Нинин рюкзак так и стоит у двери швейной комнаты, застёгнутый.' },
  { id: 'c15_house_key', when: all(finished15, { v: 'A.c15_lock', op: '==', value: 'nina' }),
    text: 'Ключ от дома, который Нине отдали вчера вечером, она не вернула. Носит на шнурке, рядом с ключом от фургона.' },
  { id: 'c15_bag_empty', when: all(finished15, { v: 'B.c15_bag', op: '==', value: 'unpack' }),
    text: 'Нинин рюкзак пустой лежит под раскладушкой. Тетрадь по биологии на подоконнике.' },
);

export const point15Nina: JointDecision = {
  id: 'c3_new_nina15', checkpoint: 15, canParticipate: P15,
  prompt: { default: 'Нине пятнадцать. В Винзене у её подруги живая мама и иногда бывает свет, Нину туда звали. Можно оставить её на хуторе с вами или отвезти в Винзен на Corsa, восемнадцать километров туда и столько же обратно. Разные ответы — Нина остаётся.' },
  options: [
    { id: 'stay', label: { default: 'Нина остаётся с вами на хуторе' },
      effects: [{ set: 'w.c15_nina', value: 'stay' }, { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust: 2, remember: 'c15_they_kept_me' }] }],
      text: 'Нина выслушивает и кивает. Потом уходит наверх и через минуту спускается без куртки. Вешает её на крючок у двери, рядом с вашими.' },
    { id: 'winsen', label: { default: 'Отвезти Нину к подруге в Винзен и вернуться' },
      when: all(carHere, { fuelIn: 'opel_corsa', liters: 2.4 }),
      feasible: all({ has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 36 }),
      effects: [{ journey: { to: 'c15_winsen', km: 18, minutes: 30, vehicle: 'opel_corsa' } },
        { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', moveTo: 'c15_winsen', remember: 'c15_they_took_me_home' }] },
        { journey: { to: 'hof_luedemann', km: 18, minutes: 30, vehicle: 'opel_corsa' } },
        { set: 'w.c15_nina', value: 'winsen' }],
      text: 'Нина всю дорогу смотрит в окно. У дома подруги её ждут на крыльце: женщина в фартуке и девочка в Нининой толстовке. Нина выходит, потом возвращается к машине и стучит в стекло.\n\n— По средам, — говорит она. — Колония. Не забудьте.\n\nОбратно вы едете вдвоём.' },
  ],
  compromises: [{ pair: ['stay', 'winsen'], result: 'stay' }],
  arbiters: [{ id: 'c15_nina_stays', when: P15, winner: 'stay', text: 'Вы не сходитесь. Нина остаётся на хуторе.' }],
  default: 'stay',
};

export const point15Garden: JointDecision = {
  id: 'c3_new_garden15', checkpoint: 15, canParticipate: P15,
  prompt: { default: 'В колонии у насыпи Уте держит семерых обращённых. Им нужна вода, двадцать вёдер в день. Можно помогать по средам водой и едой, не вмешиваться или сказать врачу из пункта, где колония. Разные ответы — не вмешиваться.' },
  options: [
    { id: 'help', label: { default: 'Помогать по средам: вода и немного еды' },
      effects: [{ set: 'w.c15_garden', value: 'help' }, { if: { npc: 'c14_ute', alive: true }, then: [{ npc: 'c14_ute', trust: 2, remember: 'c15_they_help' }] }, { if: { npc: 'c14_jannes', alive: true }, then: [{ npc: 'c14_jannes', trust: 1 }] }],
      text: 'Ты пишешь Яннесу: «По средам. Вода». Через минуту приходит ответ, одно слово: «Danke». Потом ещё одно, от Уте, с её телефона: «Ich wusste es».\n\nЯ так и знала.' },
    { id: 'away', label: { default: 'Не вмешиваться' },
      effects: [{ set: 'w.c15_garden', value: 'away' }],
      text: 'Вы никому ничего не пишете. Колония у насыпи остаётся там, где была. Четыре километра по шпалам.' },
    { id: 'tell', label: { default: 'Сказать врачу из пункта, где колония' },
      effects: [{ set: 'w.c15_garden', value: 'tell' }, { if: { npc: 'c15_tobias', alive: true }, then: [{ npc: 'c15_tobias', trust: -3, remember: 'c15_they_told' }] }, { if: { npc: 'c14_ute', alive: true }, then: [{ npc: 'c14_ute', remember: 'c15_they_told' }] }],
      text: 'Днём мимо хутора проезжает патрульная машина. Не Тобиас. Вы останавливаете её и говорите старшему: колония у насыпи, семеро, на цепях. Он записывает и долго смотрит на вас. Что будет дальше, вы не знаете.' },
  ],
  compromises: [
    { pair: ['help', 'away'], result: 'away' }, { pair: ['help', 'tell'], result: 'away' }, { pair: ['away', 'tell'], result: 'away' },
  ],
  arbiters: [{ id: 'c15_garden_away', when: P15, winner: 'away', text: 'Вы не сходитесь. Вы не вмешиваетесь.' }],
  default: 'away',
};
