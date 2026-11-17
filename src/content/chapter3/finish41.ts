import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P41, jorg41, merle41 } from './point41';

export const finished41: Cond = all(P41, any(flag('A.c41_finished'), flag('B.c41_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished41, when), text });

// Сверка в среду, восемь вечера.
export const point41Notes: MergeNote[] = [
  N('c41_rescued_a', flag('B.c41_rescuer'), '{A} пришёл в себя к вечеру. Голова зашита, восемь швов. Слабый, но ест сам.'),
  N('c41_rescued_b', flag('A.c41_rescuer'), '{B} пришла в себя к вечеру. Голова зашита, восемь швов. Слабая, но ест сама.'),
  N('c41_pyre', flag('w.c41_pyre'), 'Тела у ручья и у сарая сожгли за сараем. Девять.'),
  N('c41_box', any(v('w.c41_box', 'open'), v('w.c41_box', 'broken')), '{A} открыл ящик связиста у переезда: армейская рация, запасной аккумулятор, пайки, карта с частотами.'),
  N('c41_radio_brandt', v('w.c41_radio', 'brandt'), 'Рацию из ящика связиста {A} отдал Брандту: для связи между дворами.'),
  N('c41_winsen', any(flag('w.c41_heard_winsen'), flag('w.c41_winsen_news')), 'По рации слышно Винзен: школа открыта, лекарства во вторник и пятницу. У кого есть инсулин — просят сообщить.'),
  N('c41_thomas', flag('w.c41_thomas_voice'), 'В эфире — Торонто: «Thomas, VE3, calling Germany, Lüneburg district…»'),
  N('c41_trench', any(flag('w.c41_trench'), flag('w.c41_trench_men'), flag('w.c41_council_ditch')), 'Брандт роет ров вдоль ручьёв, до Рождества. С пятницы — по двое с каждого двора.'),
  N('c41_beef', flag('w.c41_beef'), 'Корову разделали: мясо в соли, в погребе. Сорок килограммов.'),
  N('c41_henrike', flag('w.c41_henrike_splint'), 'Запястье Хенрике, похоже, сломано: лубок на шесть недель. Доить она не сможет.'),
  N('c41_lea_gone', flag('w.c41_lea_gone'), 'Лея ушла в Берген, искать мать и брата.'),
  N('c41_volker', flag('w.c41_volker_here'), 'Фолькер пришёл из Люнебурга и остался: работает за еду и угол. Желоб на сарае уже висит.'),
  N('c41_gerdes_funeral', flag('w.c41_gerdes_funeral'), 'Старика Ханзена похоронили у него в саду, под яблоней.'),
  N('c41_gerdes_stay', flag('w.c41_gerdes_stay'), 'Ханзены остаются на хуторе до весны.'),
  N('c41_brothers', flag('w.c41_brothers_join'), 'Братья Айдын говорят: в следующий раз — к вам. Вместе лучше.'),
  N('c41_ute', flag('w.c41_ute_xmas'), 'Уте зовёт на Рождество.'),
  N('c41_gap', flag('w.c41_gap'), 'Дыру в изгороди у канавы, через которую прошли ночью, закрыли.'),
  N('c41_signal_gate', v('w.c41_signal', 'gate'), 'Рельс от Брандта висит у ворот, ракета — в сенях на гвозде.'),
  N('c41_signal_barn', v('w.c41_signal', 'barn'), 'Рельс от Брандта висит под коньком сарая, молоток там же.'),
  N('c41_signal_porch', v('w.c41_signal', 'porch'), 'Рельс от Брандта — у крыльца, ракета — в ящике кухонного стола.'),
  N('c41_boil', flag('w.c41_boil'), 'Колодец после оттепели мутный: воду теперь только кипятить. Ведро у плиты.'),
  N('c41_chlor', flag('w.c41_well_chlor'), 'В колодец бросили хлорки. Два дня вода будет пахнуть бассейном.'),
  N('c41_cellar', any(flag('w.c41_cellar_dry'), flag('w.c41_cellar_sealed')), 'В погреб натекла талая вода. Картошку спасли.'),
  N('c41_roster_pairs', v('w.c41_roster', 'pairs'), 'С этой ночи — дежурства по двое, по три часа. Список на столе в кухне.'),
  N('c41_roster_strong', v('w.c41_roster', 'strong'), 'Ночью дежурят те, кто покрепче. Список на столе в кухне.'),
  N('c41_roster_bell', v('w.c41_roster', 'bell'), 'Этой ночью дежурных нет: разбудит колокол.'),
];

export const point41Xmas: JointDecision = {
  id: 'c3_new_xmas41', checkpoint: 41, canParticipate: P41,
  prompt: { default: 'До Рождества восемь дней. Праздновать по-настоящему — ёлка, курица, позвать соседей; тихо, только свои — или не праздновать вовсе: беречь еду и силы. Разные ответы — тихо.' },
  options: [
    { id: 'feast', label: { default: 'По-настоящему: ёлка, стол, соседи' }, effects: [{ set: 'w.c41_xmas', value: 'feast' }],
      text: 'На Рождество — ёлка, стол и соседи.' },
    { id: 'quiet', label: { default: 'Тихо, только свои' }, effects: [{ set: 'w.c41_xmas', value: 'quiet' }],
      text: 'Рождество — тихо, только свои.' },
    { id: 'none', label: { default: 'Не праздновать: беречь еду' }, effects: [{ set: 'w.c41_xmas', value: 'none' }],
      text: 'Рождество праздновать не будете. Еда и силы нужнее.' },
  ],
  compromises: [{ pair: ['feast', 'quiet'], result: 'quiet' }, { pair: ['feast', 'none'], result: 'quiet' }, { pair: ['quiet', 'none'], result: 'quiet' }],
  arbiters: [{ id: 'c41_xmas_quiet', when: P41, winner: 'quiet', text: 'Вы не сходитесь. Тихо, только свои.' }],
  default: 'quiet',
};

export const point41Jorg: JointDecision = {
  id: 'c3_new_jorg41', checkpoint: 41, canParticipate: all(P41, jorg41),
  prompt: { default: 'Йорг с детьми: оставить их на хуторе до весны — лишние рты, но и лишние руки, — или пусть идут в Тоштедт, пока дороги не раскисли совсем. Разные ответы — пусть идут.' },
  options: [
    { id: 'stay', label: { default: 'Оставить до весны' }, effects: [{ set: 'w.c41_jorg', value: 'stay' }],
      text: 'Йорг с детьми остаётся до весны.' },
    { id: 'go', label: { default: 'Пусть идут в Тоштедт' }, effects: [{ set: 'w.c41_jorg', value: 'go' }],
      text: 'Утром Йорг с детьми уходит в Тоштедт.' },
  ],
  compromises: [{ pair: ['stay', 'go'], result: 'go' }],
  arbiters: [{ id: 'c41_jorg_go', when: P41, winner: 'go', text: 'Вы не сходитесь. Йорг уходит.' }],
  default: 'go',
};

export const point41Vet: JointDecision = {
  id: 'c3_new_vet41', checkpoint: 41, canParticipate: all(P41, merle41),
  prompt: { default: 'Инсулина у Мерле меньше, чем казалось. В ветклинике Винзена может быть свиной инсулин для собак. Ехать в субботу вдвоём, одному — или пока не ехать: дороги после оттепели опасны. Разные ответы — едет один.' },
  options: [
    { id: 'both', label: { default: 'Ехать вдвоём' }, effects: [{ set: 'w.c41_vet', value: 'both' }],
      text: 'В субботу в Винзен — вдвоём.' },
    { id: 'one', label: { default: 'Едет один' }, effects: [{ set: 'w.c41_vet', value: 'one' }],
      text: 'В субботу в Винзен едет один из вас.' },
    { id: 'no', label: { default: 'Пока не ехать' }, effects: [{ set: 'w.c41_vet', value: 'no' }],
      text: 'В Винзен пока не едете.' },
  ],
  compromises: [{ pair: ['both', 'one'], result: 'one' }, { pair: ['both', 'no'], result: 'one' }, { pair: ['one', 'no'], result: 'one' }],
  arbiters: [{ id: 'c41_vet_one', when: P41, winner: 'one', text: 'Вы не сходитесь. Едет один.' }],
  default: 'one',
};
