import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P14 } from './point14';

export const finished14: Cond = all(P14, flag('A.c14_finished'), flag('B.c14_finished'));

// Сводка не пересказывает, что видел каждый: сверять должны сами игроки.
export const point14Notes: MergeNote[] = [
  { id: 'c14_both_told', when: all(finished14, flag('A.c14_compared'), flag('B.c14_compared')),
    text: 'Нина всё слышала с лестницы. Она не спорит и ни о чём не просит. Просто сидит на ступеньке и ждёт.' },
  { id: 'c14_photo', when: all(finished14, { v: 'B.c14_photo', op: '==', value: 'show' }),
    text: 'Перед тем как решать, {B} показывает {A.dat} фотографию с Нининого телефона. Мужчина в кабине фургона, в шапке набекрень, смеётся во весь рот.' },
];

export const point14Jens: JointDecision = {
  id: 'c3_new_jens14', checkpoint: 14, canParticipate: P14,
  prompt: { default: 'В одиннадцать Уте и Яннес придут с тачкой за Йенсом, если Нина мигнёт три раза. Можно отдать его им, сделать всё самим до их прихода, ружьём Оле, или мигнуть два раза, закрыть ворота и оставить это солдатам. Разные ответы — ворота на засов: без согласия обоих ничего не делаете.' },
  options: [
    { id: 'give', label: { default: 'Отдать Йенса Уте и Яннесу' },
      effects: [{ set: 'w.c14_jens', value: 'give' }, { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', remember: 'c14_they_said_yes' }] }],
      text: 'Нина подходит к окну и мигает фонариком. Раз. Два. Три. С насыпи отвечают: раз, два, три.\n\nКлюч от фургона ложится на стол между вами.' },
    { id: 'end', label: { default: 'Сделать всё самим до их прихода' },
      effects: [{ set: 'w.c14_jens', value: 'end' }, { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', remember: 'c14_they_ended_it' }] }],
      text: 'Нина долго смотрит на вас. Потом подходит к окну и мигает два раза.\n\n— Только я сначала с ним поговорю, — говорит она. — Сама. Это можно?' },
    { id: 'gate', label: { default: 'Мигнуть два раза и оставить это солдатам' },
      effects: [{ set: 'w.c14_jens', value: 'gate' }, { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', remember: 'c14_they_said_no' }] }],
      text: 'Нина слушает молча. Потом идёт к окну и мигает два раза. Огонёк на насыпи долго не гаснет, будто там не верят. Потом гаснет.\n\nНина задвигает засов на задней калитке сама.' },
  ],
  compromises: [
    { pair: ['give', 'end'], result: 'gate' }, { pair: ['give', 'gate'], result: 'gate' }, { pair: ['end', 'gate'], result: 'gate' },
  ],
  arbiters: [{ id: 'c14_nobody_decides', when: P14, winner: 'gate', text: 'Вы не сходитесь. Ворота на засов: без согласия обоих ничего не делаете.' }],
  default: 'gate',
};

export const point14Nina: JointDecision = {
  id: 'c3_new_nina14', checkpoint: 14, canParticipate: P14,
  prompt: { default: 'Нина хочет быть рядом, что бы ни случилось. Можно согласиться или оставить её этой ночью в доме, с одним из вас. Разные ответы — Нина рядом: без согласия обоих её не запирают.' },
  options: [
    { id: 'with', label: { default: 'Нина будет рядом' },
      effects: [{ set: 'w.c14_nina', value: 'with' }, { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust: 1 }] }],
      text: 'Нина кивает. Надевает куртку прямо сейчас, хотя до ночи ещё долго.' },
    { id: 'house', label: { default: 'Нина ночью в доме, с одним из вас' },
      effects: [{ set: 'w.c14_nina', value: 'house' }],
      text: 'Нина сжимает губы.\n\n— Ладно, — говорит она. — Но окно я открою. Чтобы слышать.' },
  ],
  compromises: [{ pair: ['with', 'house'], result: 'with' }],
  arbiters: [{ id: 'c14_nina_decides', when: P14, winner: 'with', text: 'Вы не сходитесь. Нина будет рядом: без согласия обоих её не запирают.' }],
  default: 'with',
};
