import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P31 } from './point31';

export const finished31: Cond = all(P31, any(flag('A.c31_finished'), flag('B.c31_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished31, when), text });

// Сверка во вторник в восемь вечера. Главное из линии партнёра, не всё.
export const point31Notes: MergeNote[] = [
  N('c31_toes', any(v('w.c31_toes', 'held'), v('w.c31_toes', 'talked')), 'В пункте мальчишке из цепи сняли два пальца на ноге. {B} была рядом и держала его.'),
  N('c31_widow', flag('w.c31_widow'), 'Приходила вдова Хиннерка, Гизела Мёллер. Завтра похороны.'),
  N('c31_hose', any(flag('w.c31_hose_fixed'), flag('w.c31_hose_given')), 'Пожарным помогли со шлангом для насоса: машина снова может качать воду.'),
  N('c31_early', flag('w.c31_early_start'), 'Братья Айдын выезжают на Бухгольц в шесть, а не в семь: меньше постов.'),
  N('c31_woke_a', flag('B.c31_rescuer'), '{A} пришёл в себя к полудню. Девять швов над ухом, слабость, голова кружится, но он сидит и ест сам. Всю ночь и весь день с ним была {B}.'),
  N('c31_woke_b', flag('A.c31_rescuer'), '{B} пришла в себя к полудню. Девять швов над ухом, слабость, голова кружится, но она сидит и ест сама. Всю ночь и весь день с ней был {A}.'),
  N('c31_rub', any(v('A.c31_rb', 'rub'), v('B.c31_rb', 'rub')), 'Ночью растирали ноги у самой печи. Утром доктор Зандер это остановила. На ступнях пузыри, неделю будет больно ходить.'),
  N('c31_hinnerk', finished31, 'С края впадины не вернулся пожарный Хиннерк Мёллер. У Брандта отморожены пальцы правой руки.'),
  N('c31_car', flag('w.c31_car_back'), 'Corsa снова дома: Брандт отдал ключи сам. В баке несколько литров.'),
  N('c31_tractor', flag('w.c31_tractor_out'), 'Трактор вытащили из канавы. Прицеп помят, фара разбита, но мотор заводится.'),
  N('c31_rounds', flag('B.c31_did_rounds'), '{B} весь день ходила с доктором Зандер по дворам.'),
];

const whoA: Cond = all(P31, any({ me: 'A' }, { partner: 'incapacitated' }));
const whoB: Cond = all(P31, any({ me: 'B' }, { partner: 'incapacitated' }));

export const point31TripA: JointDecision = {
  id: 'c3_new_trip31a', checkpoint: 31, canParticipate: whoA,
  prompt: { default: 'В среду утром на Бухгольц уходит фургон: на два дня, вывезти из пустой мастерской инструмент и генератор для пункта. Можно вызваться самому. Если нет — Хенрике и доктор Зандер всё равно попросят {A.acc} поехать: генератор нужен, а других рук нет.' },
  options: [
    { id: 'yes', label: { default: 'Вызваться самому' }, effects: [{ set: 'w.c31_a', value: 'yes' }],
      text: '{A} едет в Бухгольц сам, по своей воле.' },
    { id: 'sent', label: { default: 'Не вызываться: пусть просят' }, effects: [{ set: 'w.c31_a', value: 'sent' }],
      text: 'Утром Хенрике скажет: надо. И {A} поедет, потому что надо.' },
  ],
  arbiters: [{ id: 'c31_a_sent', when: P31, winner: 'sent', text: 'Решить не успели. Утром Хенрике скажет: надо.' }],
  default: 'sent',
  soloReason: 'Отвечал он: ехать ему.',
};

export const point31TripB: JointDecision = {
  id: 'c3_new_trip31b', checkpoint: 31, canParticipate: whoB,
  prompt: { default: 'В среду в Винзен идёт армейский грузовик, обратно в четверг. Доктору Зандер оттуда нужны лекарства Красного Креста, и Нина хочет поехать. Можно вызваться самой. Если нет — доктор Зандер всё равно попросит {B.acc} отвезти её список.' },
  options: [
    { id: 'yes', label: { default: 'Вызваться самой' }, effects: [{ set: 'w.c31_b', value: 'yes' }],
      text: '{B} едет в Винзен сама, по своей воле.' },
    { id: 'sent', label: { default: 'Не вызываться: пусть просят' }, effects: [{ set: 'w.c31_b', value: 'sent' }],
      text: 'Утром доктор Зандер даст список и скажет: больше некому. И {B} поедет.' },
  ],
  arbiters: [{ id: 'c31_b_sent', when: P31, winner: 'sent', text: 'Решить не успели. Утром доктор Зандер скажет: больше некому.' }],
  default: 'sent',
  soloReason: 'Отвечала она: ехать ей.',
};
