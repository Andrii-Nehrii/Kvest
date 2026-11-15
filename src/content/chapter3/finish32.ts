import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P32, okaforHere32 } from './point32';

export const finished32: Cond = all(P32, any(flag('A.c32_finished'), flag('B.c32_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished32, when), text });

// Сверка в четверг, шесть вечера: главное из линии партнёра, не всё.
export const point32Notes: MergeNote[] = [
  N('c32_a_gen', flag('w.c32_generator_point'), '{A} вернулся из Бухгольца. Генератор из мастерской Айдынов стоит в пункте у пожарной части.'),
  N('c32_a_gerd_end', v('w.c32_gerd', 'ended'), 'На лестнице его старого подъезда стоял Герд Брокман, сосед снизу. Теперь его там нет.'),
  N('c32_a_gerd_lock', v('w.c32_gerd', 'locked'), 'На лестнице его старого подъезда стоит Герд Брокман, сосед снизу. Дверь подъезда заперта снаружи.'),
  N('c32_a_gerd_left', v('w.c32_gerd', 'left'), 'На лестнице его старого подъезда так и стоит Герд Брокман, сосед снизу.'),
  N('c32_a_ward', any(flag('w.c32_ward_page'), flag('w.c32_ward_read')), 'В больнице Бухгольца, в четвёртом отделении, журнал: плазма с октября, шестьдесят одна фамилия. Последняя запись 10 ноября: все образцы уничтожены.'),
  N('c32_a_brothers', flag('A.c32_finished'), 'Братья Айдын закрыли мастерскую. Где им жить дальше — не решено.'),
  N('c32_b_okafor', all(flag('B.c32_finished'), okaforHere32), '{B} нашла в Винзене Окафора, соседа из Бармбека, и с ним одиннадцать жильцов их дома. Он просит места на хуторе для троих стариков. Сам собирается за Мерле с колонной Красного Креста около десятого.'),
  N('c32_b_neighbors', all(flag('B.c32_finished'), not(okaforHere32)), '{B} нашла в Винзене одиннадцать жильцов своего дома в Бармбеке. Окафора с ними нет. Старики Петерсены и фрау Кёрнер просят угол на хуторе.'),
  N('c32_b_merle', flag('w.c32_merle_column'), 'Мерле в Аренсбурге. Инсулина у неё до десятых чисел. Туда можно только с колонной Красного Креста.'),
  N('c32_b_meds', flag('w.c32_meds_point'), 'Лекарства из Винзена — в пункте у доктора Зандер. Инсулина среди них нет.'),
  N('c32_nina_stays', v('w.c32_nina', 'winsen'), 'Нина осталась в Винзене, у подруги, до Рождества. Там школа.'),
  N('c32_nina_back', all(v('w.c32_nina', 'farm'), flag('B.c32_nina_with')), 'Нина вернулась с {B.ins} из Винзена.'),
  N('c32_nina_home', all(v('w.c32_nina', 'farm'), not(flag('B.c32_nina_with'))), 'Нина вернулась из Винзена насовсем.'),
];

export const point32Okafor: JointDecision = {
  id: 'c3_new_okafor32', checkpoint: 32, canParticipate: P32,
  prompt: { default: 'Трое стариков из дома в Бармбеке просят места на хуторе: в спортзале им до весны не дожить. Можно звать их на хутор (кто где будет спать, решит Хенрике). Можно поселить рядом, в домике Уте или у соседей. Можно помогать едой и не брать. Разные ответы — рядом.' },
  options: [
    { id: 'farm', label: { default: 'Звать на хутор' }, effects: [{ set: 'w.c32_okafor', value: 'farm' }],
      text: 'Стариков позовут на хутор. Где кому спать, решит Хенрике.' },
    { id: 'near', label: { default: 'Поселить рядом, не в доме' }, effects: [{ set: 'w.c32_okafor', value: 'near' }],
      text: 'Стариков поселят рядом, не в доме: в домике Уте или в пустом дворе.' },
    { id: 'away', label: { default: 'Помогать едой, не брать' }, effects: [{ set: 'w.c32_okafor', value: 'away' }],
      text: 'Брать не будут. С каждой оказией в Винзен поедет мешок картошки.' },
  ],
  compromises: [{ pair: ['farm', 'near'], result: 'near' }, { pair: ['farm', 'away'], result: 'near' }, { pair: ['near', 'away'], result: 'near' }],
  arbiters: [{ id: 'c32_okafor_near', when: P32, winner: 'near', text: 'Вы не сходитесь. Рядом, не в доме.' }],
  default: 'near',
};

export const point32Deniz: JointDecision = {
  id: 'c3_new_deniz32', checkpoint: 32, canParticipate: P32,
  prompt: { default: 'Братья Айдын закрыли мастерскую в Бухгольце. Можно звать их на хутор. Можно предложить пустой двор у насыпи: рядом, но своё. Можно оставить как есть: они вернутся в мастерскую. Разные ответы — двор у насыпи.' },
  options: [
    { id: 'farm', label: { default: 'Звать на хутор' }, effects: [{ set: 'w.c32_deniz', value: 'farm' }],
      text: 'Братьев позовут на хутор, с фургоном и инструментом.' },
    { id: 'near', label: { default: 'Пустой двор у насыпи' }, effects: [{ set: 'w.c32_deniz', value: 'near' }],
      text: 'Братьям предложат пустой двор у насыпи. Рядом, но своё.' },
    { id: 'stay', label: { default: 'Пусть решают сами' }, effects: [{ set: 'w.c32_deniz', value: 'stay' }],
      text: 'Звать не будут. Братья решат сами.' },
  ],
  compromises: [{ pair: ['farm', 'near'], result: 'near' }, { pair: ['farm', 'stay'], result: 'near' }, { pair: ['near', 'stay'], result: 'near' }],
  arbiters: [{ id: 'c32_deniz_near', when: P32, winner: 'near', text: 'Вы не сходитесь. Двор у насыпи.' }],
  default: 'near',
};
