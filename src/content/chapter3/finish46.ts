import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P46, tobias46 } from './point46';

export const finished46: Cond = all(P46, any(flag('A.c46_finished'), flag('B.c46_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished46, when), text });

// Сверка вечером Рождества. Главное из полудня порознь и из ночи на посту; подарки остаются между вами.
export const point46Notes: MergeNote[] = [
  N('c46_pass', flag('w.c46_pass'), 'В жестяной коробке с документами — пропуск Тобиаса через мост в Харбурге: на двоих, без имён, до конца января.'),
  N('c46_post_water', v('w.c46_post_dead', 'water'), 'В сочельник на посту у Зеве видели мёртвого на том берегу. Он ушёл под лёд у промоины.'),
  N('c46_post_forest', v('w.c46_post_dead', 'forest'), 'В сочельник на посту у Зеве видели мёртвого на том берегу. Он ушёл вдоль реки к лесополосе. На столбе отмечено мелом.'),
  N('c46_post_killed', v('w.c46_post_dead', 'killed'), 'В сочельник на посту у Зеве мёртвого с того берега убили на льду у промоины.'),
  N('c46_tracks', any(flag('w.c46_tracks_seen'), flag('w.c46_a_saw_one'), flag('w.c46_b_saw_edge')), 'У лесополосы по дороге в Йестебург — свежие следы, неровные, без пары. Уходят в кусты.'),
  N('c46_saw', flag('w.c46_a_saw_one'), 'В лесополосе {A} видел одного: стоит между стволами, неподвижно, по колено в снегу.'),
  N('c46_brandt', flag('w.c46_a_asked_risk'), 'Брандт ждёт ответа до воскресенья: держит ли ваш двор стражу вокруг площади в Сильвестр.'),
  N('c46_rockets', flag('w.c46_a_rockets'), 'У Лукаса остались ракеты с прошлого года. Он хочет фейерверк.'),
  N('c46_jannes', flag('w.c46_a_jannes_warn'), 'Яннес: с оттепели лесополоса не пустая, он слышит их по ночам. Огонь и музыка для него — приглашение.'),
  N('c46_jannes_plan', flag('w.c46_a_jannes_plan'), 'Яннес готов к Сильвестру, если со стороны леса будут три поста с колоколом и без фейерверка.'),
  N('c46_truck', flag('w.c46_truck_fixed'), 'Мотор грузовика Нильса к двадцать восьмому починен: {A} помог.'),
  N('c46_merle', flag('w.c46_merle_meter'), 'У Мерле теперь глюкометр: сахар по цифрам, а не по самочувствию.'),
  N('c46_gerda', flag('w.c46_letter_given'), 'Письмо Хенрике из Любека — от двоюродной сестры Герды: жива, с внуком, в школе у порта.'),
  N('c46_mia', any(v('w.c46_b_mia', 'treated'), v('w.c46_b_mia', 'syrup'), v('w.c46_b_mia', 'amoxi')), 'У маленькой Мии Бар в Люллау воспалилось ухо. {B} сбила жар и показала Коринне, что делать.'),
  N('c46_corinna', flag('w.c46_b_corinna_fear'), 'Коринна Бар боится Сильвестра у пожарной части: двоих детей не унести бегом. Эрик туда хочет.'),
  N('c46_hansen', flag('w.c46_hansen_sunday'), 'Фрау Ханзен ждёт Яннеса в воскресенье после обеда. Пусть не говорит, пусть колет дрова.'),
  N('c46_hansen_view', flag('w.c46_b_hansen_view'), 'Фрау Ханзен в Сильвестр останется дома.'),
];

export const point46Silvester: JointDecision = {
  id: 'c3_new_silvester46', checkpoint: 46, canParticipate: P46,
  prompt: { default: 'Сильвестр через шесть дней. Брандт зовёт все дворы к пожарной части: огонь, суп, музыка — и хочет, чтобы ваш двор держал стражу вокруг площади. Идти всем и держать стражу; пойти части, остальным беречь хутор; остаться дома и не идти; или уговорить Брандта сделать праздник тише. Разные ответы — пойдёт часть.' },
  options: [
    { id: 'go', label: { default: 'Идти всем и держать стражу' }, effects: [{ set: 'w.c46_silvester', value: 'go' }],
      text: 'В Сильвестр ваш двор у пожарной части: стража вокруг площади.' },
    { id: 'some', label: { default: 'Пойдёт часть, остальные берегут хутор' }, effects: [{ set: 'w.c46_silvester', value: 'some' }],
      text: 'В Сильвестр к пожарной части пойдёт часть двора. Остальные — дома, у колокола.' },
    { id: 'stay', label: { default: 'Остаться дома' }, effects: [{ set: 'w.c46_silvester', value: 'stay' }],
      text: 'В Сильвестр ваш двор дома. Брандту скажете в воскресенье.' },
    { id: 'quiet', label: { default: 'Уговорить Брандта: тише, без фейерверка, посты у леса' }, effects: [{ set: 'w.c46_silvester', value: 'quiet' }],
      text: 'В воскресенье пойдёте к Брандту: праздник — да, но без фейерверка и с постами со стороны леса.' },
  ],
  compromises: [{ pair: ['go', 'stay'], result: 'some' }, { pair: ['go', 'some'], result: 'some' }, { pair: ['some', 'stay'], result: 'some' },
    { pair: ['quiet', 'go'], result: 'quiet' }, { pair: ['quiet', 'some'], result: 'quiet' }, { pair: ['quiet', 'stay'], result: 'some' }],
  arbiters: [{ id: 'c46_silvester_some', when: P46, winner: 'some', text: 'Вы не сходитесь. Пойдёт часть двора.' }],
  default: 'some',
};

export const point46Answer: JointDecision = {
  id: 'c3_new_answer46', checkpoint: 46, canParticipate: all(P46, tobias46, flag('w.c46_tobias_letter')),
  prompt: { default: 'Письмо Тобиасу уйдёт с колонной двадцать восьмого. Только спасибо и что вы живы; попросить его о помощи — лекарства, инсулин, что армия может дать на этом берегу; или не отвечать вовсе. Разные ответы — только спасибо.' },
  options: [
    { id: 'thanks', label: { default: 'Спасибо и что мы живы' }, effects: [{ set: 'w.c46_answer', value: 'thanks' }],
      text: 'Тобиасу напишете коротко: спасибо, вы живы, Эльба пусть держит.' },
    { id: 'ask', label: { default: 'Попросить помощи' }, effects: [{ set: 'w.c46_answer', value: 'ask' }],
      text: 'Тобиаса попросите о помощи: лекарства, инсулин — что сможет переправить.' },
    { id: 'none', label: { default: 'Не отвечать' }, effects: [{ set: 'w.c46_answer', value: 'none' }],
      text: 'Тобиасу не ответите. Армия ушла — пусть уходит.' },
  ],
  compromises: [{ pair: ['thanks', 'ask'], result: 'thanks' }, { pair: ['thanks', 'none'], result: 'thanks' }, { pair: ['ask', 'none'], result: 'thanks' }],
  arbiters: [{ id: 'c46_answer_thanks', when: P46, winner: 'thanks', text: 'Вы не сходитесь. Только спасибо.' }],
  default: 'thanks',
};
