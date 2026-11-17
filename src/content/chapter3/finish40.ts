import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { lea36 } from './point36';
import { P40 } from './point40';

export const finished40: Cond = all(P40, any(flag('A.c40_finished'), flag('B.c40_finished'), flag('A.c40_down'), flag('B.c40_down')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished40, when), text });
const meA: Cond = { me: 'A' };
const home: Cond = not(flag('w.c40_left_army'));
/** Старик Ханзен не пережил ночь: совет разошёлся, никто не предупредил, не перевёз, не дал сигнала. */
const gerdesDies: Cond = all(home, v('w.c39_council', 'yards'), not(flag('w.c40_warned')), not(flag('w.c40_gerdes_moved')), not(flag('w.c40_a_signal_early')), not(flag('w.c40_patrol_came')));

// Сверка в среду утром, после первой ночи без армии.
export const point40Notes: MergeNote[] = [
  { id: 'c40_gerdes_fate', when: all(finished40, meA, gerdesDies), effects: [{ set: 'w.c40_neighbor', value: 'dead' }] },
  N('c40_army', home, 'Во вторник в пять утра армия ушла за Эльбу. Последний грузовик — с мелом на брезенте.'),
  N('c40_share', any(v('w.c40_share', 'normal'), v('w.c40_share', 'big')), 'Со склада казармы привезли долю двора: мука, тушёнка, армейские пайки.'),
  N('c40_share_big', v('w.c40_share', 'big'), 'Брандт дал сверх списка: ещё мешок муки и коробку сахара. «Для девушки».'),
  N('c40_grabbed', flag('w.c40_grabbed'), 'Когда Брандт открыл остатки, у склада была давка. Оттуда вынесли ещё мешок муки и свечи.'),
  N('c40_child', flag('w.c40_child_saved'), 'В давке у склада из-под ног толпы вытащили мальчика.'),
  N('c40_volker_yard', v('w.c40_volker', 'yard'), '{A} вписал в лист вашего двора Фолькера, кровельщика из Тоштедта, того, кого не пустили в ноябре. Теперь вы квиты.'),
  N('c40_volker_fed', v('w.c40_volker', 'fed'), '{A} поделился с Фолькером, кровельщиком из Тоштедта, своей долей.'),
  N('c40_peters_farm', v('w.c40_peters', 'farm'), '{B} привезла со склада фрау Петерс — ту старушку с гамбургского вокзала. Она теперь на хуторе.'),
  N('c40_peters', any(v('w.c40_peters', 'helped'), v('w.c40_peters', 'met')), 'У склада {B} встретила старушку с гамбургского вокзала, первого дня. Хильда Петерс. Она живёт в женском корпусе, который закрывают.'),
  N('c40_down_a', flag('A.c40_down'), 'Ночью {A} упал во дворе и ударился головой. Его принесли в дом без сознания.'),
  N('c40_down_b', flag('B.c40_down'), 'Ночью {B} упала во дворе и ударилась головой. Её принесли в дом без сознания.'),
  N('c40_signal', flag('w.c40_a_signal_early'), '{A} ударил в колокол у Зеве в девять вечера, раньше всех. Округ не спал.'),
  N('c40_patrol', flag('w.c40_patrol_came'), 'По красной ракете {A.gen} приехала дружина Брандта.'),
  N('c40_fence', flag('w.c40_fence_held'), 'Забор у сарая выдержал.'),
  N('c40_yard', flag('w.c40_yard_lost'), 'Ночью двор отдали: все ушли в дом. Забор у сарая сломан.'),
  N('c40_barn', flag('w.c40_barn_saved'), 'В сарай ночью пробрались двое. Детей Йорга вынесли в дом целыми.'),
  N('c40_kid_hurt', v('w.c40_strangers_kid', 'hurt'), 'Младшая дочь Йорга упала с сеновала, когда в сарай вошли. Сломана рука.'),
  N('c40_door', flag('w.c40_door_held'), 'Дверь кухни выдержала.'),
  N('c40_runner', flag('w.c40_runner_saved'), 'Ночью кто-то из домашних выбежал во двор. Его вернули.'),
  N('c40_henrike', flag('w.c40_henrike_hurt'), 'Хенрике выбежала во двор сама и поскользнулась на крыльце. Запястье распухло: возможно, перелом.'),
  N('c40_cow', v('w.c40_cow', 'lost'), 'Корова погибла: хлев не был закрыт. Молока больше не будет.'),
  N('c40_gerdes_moved', flag('w.c40_gerdes_moved'), 'Старика Ханзена до темноты перевезли на хутор. Он жив.'),
  N('c40_gerdes_warned', all(flag('w.c40_warned'), not(flag('w.c40_gerdes_moved'))), 'Ханзенов успели предупредить. Они пересидели ночь в погребе.'),
  N('c40_gerdes_dead', v('w.c40_neighbor', 'dead'), 'Старик Ханзен не пережил ночь. До них не дошёл никто.'),
  N('c40_left', flag('w.c40_left_army'), 'Вы ушли с армией за Эльбу.'),
];

export const point40After: JointDecision = {
  id: 'c3_new_after40', checkpoint: 40, canParticipate: all(P40, home),
  prompt: { default: 'Утро после первой ночи без армии. С чего начать день: свой хутор — забор, сарай, раненые; соседи — у кого хуже, хоронить, чинить; или совет у Брандта — договориться, как дальше, пока все помнят эту ночь. Разные ответы — свой хутор.' },
  options: [
    { id: 'farm', label: { default: 'Свой хутор: забор, сарай, раненые' }, effects: [{ set: 'w.c40_after', value: 'farm' }],
      text: 'День начинается с вашего двора.' },
    { id: 'neighbors', label: { default: 'Соседи: помочь тем, у кого хуже' }, effects: [{ set: 'w.c40_after', value: 'neighbors' }],
      text: 'День начинается у соседей: у кого хуже, туда и идёте.' },
    { id: 'council', label: { default: 'Совет у Брандта: как дальше' }, effects: [{ set: 'w.c40_after', value: 'council' }],
      text: 'Днём — совет в пожарной части: как жить дальше без армии.' },
  ],
  compromises: [{ pair: ['farm', 'neighbors'], result: 'farm' }, { pair: ['farm', 'council'], result: 'farm' }, { pair: ['neighbors', 'council'], result: 'farm' }],
  arbiters: [{ id: 'c40_after_farm', when: P40, winner: 'farm', text: 'Вы не сходитесь. Сначала свой двор.' }],
  default: 'farm',
};

export const point40Lea: JointDecision = {
  id: 'c3_new_lea40', checkpoint: 40, canParticipate: all(P40, home, lea36, v('w.c39_lea_date', 'wednesday')),
  prompt: { default: 'Сегодня Лея уходит в Берген, как сказала: с вами или одна. После такой ночи дороги опасны вдвойне. Проводить её до Ханштедта, отпустить одну — или уговорить остаться до весны. Разные ответы — отпустить.' },
  options: [
    { id: 'walk', label: { default: 'Проводить до Ханштедта' }, effects: [{ set: 'w.c40_lea', value: 'walk' }],
      text: 'Лею проводят до Ханштедта.' },
    { id: 'go', label: { default: 'Отпустить одну' }, effects: [{ set: 'w.c40_lea', value: 'go' }],
      text: 'Лея уходит одна.' },
    { id: 'stay', label: { default: 'Уговорить остаться до весны' }, effects: [{ set: 'w.c40_lea', value: 'stay' }],
      text: 'Лею уговаривают остаться до весны.' },
  ],
  compromises: [{ pair: ['walk', 'go'], result: 'go' }, { pair: ['walk', 'stay'], result: 'go' }, { pair: ['go', 'stay'], result: 'go' }],
  arbiters: [{ id: 'c40_lea_go', when: P40, winner: 'go', text: 'Вы не сходитесь. Лея уходит одна.' }],
  default: 'go',
};
