import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { P33, eldersCome, eldersInHouse, okaforComes } from './point33';

export const finished33: Cond = all(P33, any(flag('A.c33_finished'), flag('B.c33_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished33, when), text });

// Сверка в пятницу в восемь вечера.
export const point33Notes: MergeNote[] = [
  N('c33_a_elders', v('w.c33_a_elders', 'promise'), '{A} пообещал Окафору присматривать за стариками, пока тот будет с колонной.'),
  N('c33_tracks', any(flag('w.c33_yard_tracks'), flag('w.c33_yard_guest')), 'В пустом дворе у насыпи кто-то ночует. Следы, пустая банка.'),
  N('c33_kasia_hair', v('w.c33_kasia_hair', 'short'), '{B} остригла Касю коротко, как стригли Тима.'),
  N('c33_korner_night', flag('w.c33_korner_night'), 'Ночью у фрау Кёрнер был приступ: дышала сидя, держалась за грудь. До утра обошлось.'),
  N('c33_pump_fixed', v('w.c33_pump', 'fixed'), 'Колонку отогрели и утеплили: качает. В бочке двадцать литров.'),
  N('c33_pump_half', v('w.c33_pump', 'half'), 'Колонку отогреть не вышло: промёрзло глубже. Десять литров ржавой воды.'),
  N('c33_pump_ute', v('w.c33_pump', 'ute'), 'Воду возили бочкой от колодца Уте: сорок литров. Колонка стоит замёрзшая.'),
  N('c33_pump_snow', v('w.c33_pump', 'snow'), 'Весь день топили снег: пятнадцать литров, а дров ушло много.'),
  N('c33_room', v('w.c33_room', 'given'), 'Свою комнату наверху вы отдали старикам. Сами спите на сеновале над хлевом.'),
  N('c33_korner', v('w.c33_korner_pills', 'none'), 'У фрау Кёрнер кончились таблетки от сердца. Достать не удалось. Без них неделя, может, две.'),
  N('c33_fence', flag('w.c33_fence_burned'), 'Старый забор у огорода, который ставил муж Хенрике, ушёл в печь, чтобы топить снег.'),
  N('c33_paul', v('w.c33_paul', 'work'), 'Внук фрау Кёлер, Пауль, воровал у вас дрова. Теперь будет приходить колоть.'),
  N('c33_elders_house', all(eldersCome, eldersInHouse), 'Старики из Бармбека живут в доме, в комнате наверху.'),
  N('c33_elders_garden', all(eldersCome, not(eldersInHouse)), 'Старики из Бармбека живут в домике Уте в колонии у насыпи.'),
  N('c33_okafor', okaforComes, 'Окафор с ними. Десятого он собирается с колонной Красного Креста за Мерле.'),
  N('c33_case', v('w.c33_case', 'open'), 'В чемодане фрау Хаберланд нашлись шерсть, кофе в зёрнах и двадцать ампул физраствора.'),
  N('c33_case_forced', v('w.c33_case', 'forced'), 'Чемодан фрау Хаберланд вскрыли ножом. Шерсть и кофе целы, из ампул физраствора уцелело девять.'),
  N('c33_column', flag('w.c33_heard_column'), 'По радио Красного Креста: колонна на Аренсбург — десятого декабря, из Гестхахта, в семь утра. Сопровождающие — с пропуском.'),
];

export const point33Winter: JointDecision = {
  id: 'c3_new_winter33', checkpoint: 33, canParticipate: P33,
  prompt: { default: 'Как жить до весны. Можно общий котёл на всех, кто на хуторе и рядом. Можно по дворам: каждый ест своё. Можно общий, но кто пришёл последним, отрабатывает: дрова, вода, скотина. Разные ответы — общий, но с работой.' },
  options: [
    { id: 'pot', label: { default: 'Общий котёл на всех' }, effects: [{ set: 'w.c33_rule', value: 'pot' }],
      text: 'Один котёл на всех. Хенрике будет делить сама.' },
    { id: 'yards', label: { default: 'По дворам: каждый своё' }, effects: [{ set: 'w.c33_rule', value: 'yards' }],
      text: 'Каждый двор ест своё. Хутор — хутору, соседи — себе.' },
    { id: 'work', label: { default: 'Общий, но новые отрабатывают' }, effects: [{ set: 'w.c33_rule', value: 'work' }],
      text: 'Котёл общий. Кто пришёл последним, берёт на себя дрова, воду и скотину.' },
  ],
  compromises: [{ pair: ['pot', 'yards'], result: 'work' }, { pair: ['pot', 'work'], result: 'work' }, { pair: ['yards', 'work'], result: 'work' }],
  arbiters: [{ id: 'c33_rule_work', when: P33, winner: 'work', text: 'Вы не сходитесь. Общий котёл, но новые отрабатывают.' }],
  default: 'work',
};
