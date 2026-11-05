import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P9 } from './point9';

export const finished9: Cond = all(P9, flag('A.c9_finished'), flag('B.c9_finished'));
const atFarm: Cond = all({ at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' });
const denizHere: Cond = { npc: 'deniz', alive: true, at: 'hof_luedemann' };
const nina: Cond = { npc: 'c7_nina', alive: true };

// Сводка не пересказывает, что каждому говорила хозяйка: сравнивать должны сами игроки.
export const point9Notes: MergeNote[] = [
  { id: 'c9_day', when: finished9, effects: [{ set: 'w.c9_deniz_search', value: true }, { set: 'w.c9_nina_here', value: true }],
    text: 'Вы снова вместе на кухне. Кёлер ушла в шесть. Нина остаётся на ночь. Дениз зашнуровывает ботинки у двери.' },
  { id: 'c9_key_b', when: all(finished9, { v: 'B.c9_key', op: '==', value: 'mine' }), effects: [{ set: 'w.c9_key_holder', value: 'B' }],
    text: 'Запасной ключ от фургона Нина отдала {B.dat}.' },
  { id: 'c9_key_nina', when: all(finished9, { npcHas: 'c7_nina', type: 'c9_van_key' }), effects: [{ set: 'w.c9_key_holder', value: 'nina' }] },
];

export const point9Jens: JointDecision = {
  id: 'c3_new_jens9', checkpoint: 9, canParticipate: P9,
  prompt: { default: 'Хенрике и Оле требуют прекратить это сегодня: окно выбито, на доски надежды мало. Нина просит одну ночь рядом с отцом. Дениз сделает это только с согласия вас обоих и до того, как уйдёт. Разные ответы оставят Йенса в кабине до утра.' },
  options: [
    { id: 'keep', label: { default: 'Дать Нине эту ночь: Йенс до утра в заколоченной кабине' },
      effects: [{ set: 'w.c9_jens', value: 'kept' }, { if: nina, then: [{ npc: 'c7_nina', set: { c9_night_by_van: true }, remember: 'c9_they_gave_me_the_night' }] },
        { npc: 'henrike', remember: 'c9_jens_kept_against_me' }],
      text: 'Хенрике молча уходит в дом. Оле хлопает дверью сарая. Нина надевает вторую куртку и садится на чурбак под навесом, лицом к фургону.' },
    { id: 'end', label: { default: 'Согласиться: Дениз прекращает это сегодня, Нина прощается первой' },
      when: P9, feasible: all(atFarm, denizHere),
      effects: [{ set: 'w.c9_jens', value: 'dead' }, { set: 'w.c7_jens', value: 'dead' }, { set: 'w.c7_van_watch', value: false },
        { body: 'stress', delta: 8, target: 'A' }, { body: 'stress', delta: 8, target: 'B' },
        { if: nina, then: [{ npc: 'c7_nina', remember: 'c9_they_agreed_to_end_it' }] }, { npc: 'deniz', remember: 'c9_i_ended_jens' }, { npc: 'henrike', remember: 'c9_jens_ended' },
        { waitTogether: 20 }],
      text: 'Нина стоит у фургона и что-то говорит в щель между досками. Потом отходит к калитке и закрывает уши руками. Хенрике отдаёт Денизу ключ. Дениз открывает дверцу. Вы слышите глухой удар, потом второй. Потом тишина. Дениз долго моет руки у колодца.' },
  ],
  compromises: [],
  arbiters: [{ id: 'c9_no_end_without_both', when: P9, winner: 'keep', text: 'Без согласия обоих Дениз отказывается. Йенс остаётся в кабине до утра.' }],
  default: 'keep',
};

const search = (who: 'A' | 'B'): JointDecision => {
  const decider = who === 'A' ? 'B' : 'A';
  const able: Cond = who === 'A' ? { cap: 'canAct', op: '>=', value: 1 } : { partner: 'active' };
  return {
    id: `c3_new_search9${who.toLowerCase()}`, checkpoint: 9, canParticipate: all(P9, { me: decider }),
    soloReason: 'Здесь каждый решал за другого.',
    prompt: { default: `Дениз сейчас уйдёт искать Керема: полевая дорога в темноте до будки у большой дороги, туда и обратно часа два. Хенрике просит никого не ходить. Пойдёт ли {${who}} с Денизом? Это решаешь ты, а не {${who}}. В это же время {${who}} решает такой же вопрос о тебе.` },
    options: [
      { id: 'go', label: { default: `Пусть {${who}} идёт с Денизом` }, feasible: all(able, denizHere),
        effects: [{ set: `w.c9_search_${who}`, value: 'go' }], text: `{${who}} надевает куртку потеплее и выходит с Денизом в темноту.` },
      { id: 'stay', label: { default: `Пусть {${who}} останется на хуторе` },
        effects: [{ set: `w.c9_search_${who}`, value: 'stay' }], text: `{${who}} остаётся на хуторе.` },
    ],
    arbiters: [{ id: `c9_cannot_go_${who}`, when: P9, winner: 'stay', text: `{${who}} не может идти: остаётся на хуторе.` }],
    default: 'stay',
  };
};
export const point9SearchA = search('A');
export const point9SearchB = search('B');
