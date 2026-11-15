import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P30, entryFuel, entryHome, entryJoin } from './point30';

export const finished30: Cond = all(P30, any(flag('A.c30_finished'), flag('B.c30_finished'), flag('A.c30_down'), flag('B.c30_down')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished30, when), text });
const w = (key: string): Cond => flag(`w.c30_${key}`);

// Сверка во вторник в четыре утра.
export const point30Notes: MergeNote[] = [
  N('c30_hollow', entryJoin, 'Ночью дружина и солдаты подожгли край впадины у Гарльсторфа. Вы были там.'),
  N('c30_home', entryHome, 'Ночью вы держали свой край. Тех, кого выгнали с впадины, мороз гнал к дворам у насыпи.'),
  N('c30_fuel_run', entryFuel, 'Ночью, пока дружина была на впадине, вы ездили на тракторе к третьему грузовику за соляркой.'),
  N('c30_down_a', flag('A.c30_down'), '{A} без сознания: упал головой на лёд, много крови, переохлаждение. Его принесли в дом.'),
  N('c30_down_b', flag('B.c30_down'), '{B} без сознания: упала головой на лёд, много крови, переохлаждение. Её принесли в дом.'),
  N('c30_boy', w('boy_saved'), 'Мальчишку из цепи, который повис на краю впадины, вытащили.'),
  N('c30_fuel', w('fuel_got'), 'Дома двадцатилитровая канистра солярки из третьего грузовика.'),
  N('c30_tractor', v('w.c30_tractor', 'ditch'), 'Трактор Хенрике лежит в канаве, прицеп набок. До оттепели его не вытащить без помощи.'),
  N('c30_flare', w('flare_used'), 'Ракету Тобиаса выпустили над ручьём: на той стороне вышли с фонарями.'),
];

export const point30After: JointDecision = {
  id: 'c3_new_after30', checkpoint: 30, canParticipate: P30,
  prompt: { default: 'Ночь кончилась. Можно всё добытое оставить дому, а трактор, если он в канаве, вытаскивать днём с Денизом. Можно половину отдать дружине или в пункт и просить дружину помочь с трактором. Можно ничего не трогать до оттепели. Разные ответы — дому.' },
  options: [
    { id: 'home', label: { default: 'Всё — дому, трактор вытаскивать с Денизом' }, effects: [{ set: 'w.c30_after', value: 'home' }],
      text: 'Всё, что принесла ночь, остаётся дому. Если трактор в канаве, днём позовёте Дениза.' },
    { id: 'share', label: { default: 'Половину — дружине или в пункт, просить помощи' }, effects: [{ set: 'w.c30_after', value: 'share' }],
      text: 'Половину отдадите. Взамен попросите дружину помочь с тем, что сломалось.' },
    { id: 'leave', label: { default: 'Ничего не трогать до оттепели' }, effects: [{ set: 'w.c30_after', value: 'leave' }],
      text: 'До оттепели — ничего. Отлежаться, отогреться, пересчитать.' },
  ],
  compromises: [{ pair: ['home', 'share'], result: 'home' }, { pair: ['home', 'leave'], result: 'home' }, { pair: ['share', 'leave'], result: 'home' }],
  arbiters: [{ id: 'c30_after_home', when: P30, winner: 'home', text: 'Вы не сходитесь. Всё — дому.' }],
  default: 'home',
};
