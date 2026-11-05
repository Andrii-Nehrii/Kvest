import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P11 } from './point11';

export const finished11: Cond = all(P11, flag('A.c11_finished'), flag('B.c11_finished'));

export const point11Notes: MergeNote[] = [
  { id: 'c11_patrol_a', when: all(finished11, { v: 'A.c11_patrol', op: '==', value: 'lie' }), effects: [{ set: 'w.c11_patrol', value: 'lie' }],
    text: '{A} рассказывает про патруль у калитки: он сказал солдатам, что больных нет. Завтра они вернутся с врачом.' },
  { id: 'c11_patrol_t', when: all(finished11, { v: 'A.c11_patrol', op: '==', value: 'truth' }), effects: [{ set: 'w.c11_patrol', value: 'truth' }],
    text: '{A} рассказывает про патруль у калитки: он сказал солдатам, что здесь есть укушенный. Завтра они приедут.' },
  { id: 'c11_patrol_q', when: all(finished11, { v: 'A.c11_patrol', op: '==', value: 'ask' }), effects: [{ set: 'w.c11_patrol', value: 'ask' }],
    text: '{A} рассказывает про патруль у калитки: в пункте укушенных изолируют, лечить нечем. Говорят, у одного из двадцати жар проходит сам.' },
  { id: 'c11_nina_b', when: all(finished11, { v: 'B.c11_bn', op: '==', value: 'drive' }),
    text: '{B} обещала Нине уговорить всех отвезти её завтра домой.' },
];

export const point11Report: JointDecision = {
  id: 'c3_new_report11', checkpoint: 11, canParticipate: P11,
  prompt: { default: 'Оле — первый, о ком вы знаете, что он пережил укус. Врачам в пункте это может быть важно. Но его заберут на обследование и, скорее всего, не отпустят сразу, а Хенрике не отпустит его одного. Разные ответы — решать Хенрике и Оле.' },
  options: [
    { id: 'report', label: { default: 'Сообщить в пункт: врачи должны знать, что так бывает' },
      effects: [{ set: 'w.c11_report', value: 'report' }, { npc: 'henrike', remember: 'c11_they_wanted_to_report' }],
      text: 'Вы говорите Хенрике, что сообщите в пункт. Она долго молчит. Потом говорит: «Тогда я поеду с ним».' },
    { id: 'secret', label: { default: 'Никому не говорить: его заберут, а здесь он нужен' },
      effects: [{ set: 'w.c11_report', value: 'secret' }, { npc: 'henrike', remember: 'c11_they_kept_his_secret' }],
      text: 'Вы говорите Хенрике, что никому не скажете. Она берёт вас обоих за руки, сначала одного, потом другого.' },
    { id: 'family', label: { default: 'Пусть решают сами Хенрике и Оле' },
      effects: [{ set: 'w.c11_report', value: 'family' }],
      text: 'Вы говорите Хенрике: это их решение. Она кивает. «Он проснётся — спросим вместе».' },
  ],
  compromises: [
    { pair: ['report', 'secret'], result: 'family' }, { pair: ['report', 'family'], result: 'family' }, { pair: ['secret', 'family'], result: 'family' },
  ],
  arbiters: [{ id: 'c11_family', when: P11, winner: 'family', text: 'Вы не сходитесь. Решать будут Хенрике и Оле.' }],
  default: 'family',
};

export const point11Home: JointDecision = {
  id: 'c3_new_home11', checkpoint: 11, canParticipate: P11,
  prompt: { default: 'Хенрике врала вам весь вчерашний день. Она сама предлагает вам уйти. Дениз с Керемом собираются в мастерскую в Бухгольце и зовут с собой. Разные ответы — остаться, но жить отдельно.' },
  options: [
    { id: 'stay', label: { default: 'Остаться, но условиться: больше никакой лжи, решаем вместе' },
      effects: [{ set: 'w.c11_home', value: 'stay' }, { npc: 'henrike', trust: 5, remember: 'c11_they_stayed_on_terms' }],
      text: 'Вы говорите Хенрике про условия. Она слушает до конца. «Справедливо», — говорит она и протягивает руку. Сначала тебе, потом партнёру.' },
    { id: 'apart', label: { default: 'Остаться, но жить отдельно, в сарае, со своей дверью' },
      effects: [{ set: 'w.c11_home', value: 'apart' }, { npc: 'henrike', remember: 'c11_they_moved_to_the_barn' }],
      text: 'Вы переносите вещи в сарай. Хенрике не спорит. Вечером она сама приносит вам одеяла и лампу.' },
    { id: 'leave', label: { default: 'Уйти с Денизом и Керемом в мастерскую в Бухгольце' },
      effects: [{ set: 'w.c11_home', value: 'leave' }, { npc: 'deniz', remember: 'c11_they_came_with_us' }, { npc: 'henrike', remember: 'c11_they_left' }],
      text: 'Вы говорите Денизу, что пойдёте с ними. Он кивает: «Завтра утром». Хенрике слышит и ничего не говорит.' },
  ],
  compromises: [
    { pair: ['stay', 'apart'], result: 'apart' }, { pair: ['stay', 'leave'], result: 'apart' }, { pair: ['apart', 'leave'], result: 'apart' },
  ],
  arbiters: [{ id: 'c11_apart', when: P11, winner: 'apart', text: 'Вы не сходитесь. Пока остаётесь, но отдельно, в сарае.' }],
  default: 'apart',
};
