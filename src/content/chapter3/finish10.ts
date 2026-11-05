import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { P10, kept10 } from './point10';

export const finished10: Cond = all(P10, flag('A.c10_finished'), flag('B.c10_finished'));
const oleHere: Cond = { npc: 'ole', alive: true, at: 'hof_luedemann' };
const nina: Cond = { npc: 'c7_nina', alive: true };

export const point10Notes: MergeNote[] = [
  { id: 'c10_told_a', when: all(finished10, flag('A.c10_knows'), not(flag('B.c10_knows'))), effects: [{ set: 'w.c10_truth', value: true }],
    text: '{A} рассказывает, что узнал: утром Йенс укусил Оле, а Хенрике это скрыла.' },
  { id: 'c10_told_b', when: all(finished10, flag('B.c10_knows'), not(flag('A.c10_knows'))), effects: [{ set: 'w.c10_truth', value: true }],
    text: '{B} рассказывает, что узнала: утром Йенс укусил Оле, а Хенрике это скрыла.' },
  { id: 'c10_key_b', when: all(finished10, { npcHas: 'c7_nina', type: 'c9_van_key' }), effects: [{ set: 'w.c9_key_holder', value: 'nina' }] },
  { id: 'c10_key_taken', when: all(finished10, { v: 'B.c10_nina', op: '==', value: 'key' }), effects: [{ set: 'w.c9_key_holder', value: 'B' }],
    text: 'Запасной ключ от фургона теперь у {B.gen}.' },
];

export const point10Ole: JointDecision = {
  id: 'c3_new_ole10', checkpoint: 10, canParticipate: P10,
  prompt: { default: 'У Оле жар. Хенрике дремлет у его двери и просит оставить сына в комнате. Правило хутора, которое она сама придумала: больных — в старый курятник. Разные ответы — комната, запертая снаружи, и дежурство по очереди.' },
  options: [
    { id: 'coop', label: { default: 'Перевести Оле в старый курятник и запереть до утра' }, feasible: oleHere,
      effects: [{ set: 'w.c10_ole', value: 'coop' }, { npc: 'ole', moveTo: 'farm_coop', remember: 'c10_they_locked_me_in_the_coop' }, { npc: 'henrike', remember: 'c10_my_son_in_the_coop' }],
      text: 'Оле идёт в курятник сам, держась за стену. Хенрике несёт за ним одеяло и кувшин воды. Щеколда входит в паз со стуком. Хенрике садится снаружи, прямо на землю, спиной к двери.' },
    { id: 'door', label: { default: 'Оставить в комнате, запереть снаружи и дежурить по очереди' }, feasible: oleHere,
      effects: [{ set: 'w.c10_ole', value: 'door' }, { npc: 'henrike', remember: 'c10_they_let_him_stay_inside' }],
      text: 'Вы задвигаете засов на двери Оле снаружи. Первым дежурит {A}, под утро его сменит {B}. Хенрике остаётся на табурете у двери.' },
    { id: 'sleep', label: { default: 'Поверить, что это жар, и лечь спать' },
      effects: [{ set: 'w.c10_ole', value: 'sleep' }],
      text: 'Вы ложитесь. Хенрике остаётся у двери сына. Засов никто не задвигает.' },
  ],
  compromises: [
    { pair: ['coop', 'door'], result: 'door' }, { pair: ['coop', 'sleep'], result: 'door' }, { pair: ['door', 'sleep'], result: 'door' },
  ],
  arbiters: [{ id: 'c10_default_door', when: P10, winner: 'door', text: 'Вы сходитесь на середине: комната, засов снаружи и дежурство.' }],
  default: 'door',
};

export const point10Nina: JointDecision = {
  id: 'c3_new_nina10', checkpoint: 10, canParticipate: P10,
  prompt: { default: 'Где Нина проведёт остаток ночи? В доме тепло, но комната Оле через стенку. В сарае холодно и далеко от всех. Разные ответы — в доме, у печи.' },
  options: [
    { id: 'house', label: { default: 'В доме, на кухне у печи' }, effects: [{ set: 'w.c10_nina', value: 'house' }, { if: nina, then: [{ npc: 'c7_nina', set: { c10_sleep: 'house' } }] }],
      text: 'Нина ложится на лавке у печи, под двумя одеялами.' },
    { id: 'barn', label: { default: 'В сарае, вместе с вами, подальше от дома' }, effects: [{ set: 'w.c10_nina', value: 'barn' }, { if: nina, then: [{ npc: 'c7_nina', set: { c10_sleep: 'barn' } }] }],
      text: 'Вы втроём уходите в сарай. Нина зарывается в сено между вами.' },
    { id: 'van', label: { default: 'Под навесом у фургона, как она просит' }, when: kept10, feasible: kept10,
      effects: [{ set: 'w.c10_nina', value: 'van' }, { if: nina, then: [{ npc: 'c7_nina', set: { c10_sleep: 'van' } }] }],
      text: 'Нина остаётся под навесом на чурбаке, в двух одеялах. Отсюда до досок три шага.' },
  ],
  compromises: [
    { pair: ['house', 'barn'], result: 'house' }, { pair: ['house', 'van'], result: 'house' }, { pair: ['barn', 'van'], result: 'house' },
  ],
  arbiters: [{ id: 'c10_nina_house', when: P10, winner: 'house', text: 'Пока вы спорите, Нина засыпает на лавке у печи.' }],
  default: 'house',
};
