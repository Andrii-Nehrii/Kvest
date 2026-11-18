import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P44 } from './point44';

export const finished44: Cond = all(P44, any(flag('A.c44_finished'), flag('B.c44_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished44, when), text });

// Сверка во вторник, половина девятого вечера.
export const point44Notes: MergeNote[] = [
  N('c44_v_double', v('w.c44_verdict', 'double'), 'Совет: Яннес остаётся в страже, двойные смены до Рождества.'),
  N('c44_v_yard', v('w.c44_verdict', 'yard'), 'Совет: смены Яннеса у Зеве взял ваш двор, до весны. Брандт сказал, что запомнит.'),
  N('c44_v_half', all(v('w.c44_verdict', 'half'), any(flag('w.c44_verdict_eased'))), 'Совет: Яннесу — половина пайка. После разговора с {A.ins} Брандт сократил срок до пятницы.'),
  N('c44_v_half2', all(v('w.c44_verdict', 'half'), { not: { flag: 'w.c44_verdict_eased' } }), 'Совет: Яннесу — половина пайка до Нового года.'),
  N('c44_eve_shift', flag('w.c44_a_eve_shift'), '{A} обещал Яннесу взять его смену у Зеве в сочельник.'),
  N('c44_nils', flag('w.c44_nils_friend'), 'Нильс, водитель колонны Красного Креста из Гамбурга, — тот, кого {A} вытащил из «гольфа» в первый день. Он привёз хутору кофе и батарейки.'),
  N('c44_julian', flag('w.c44_julian_ok'), 'Юлиан от переезда работает на хуторе с понедельника. Хенрике сказала: этого оставим.'),
  N('c44_hamburg', flag('w.c44_hamburg_trip'), 'Мерле подписала листок: двадцать восьмого она едет в Гамбург. {B} едет с ней, на неделю, если мост откроют.'),
  N('c44_merle_stays', all(flag('w.c44_merle_stays'), { not: { flag: 'w.c44_hamburg_trip' } }), 'Мерле остаётся на хуторе, на ветеринарном инсулине. Пять флаконов — около месяца.'),
  N('c44_leg', v('w.c44_jannes_leg', 'treated'), '{B} перевязала Яннесу ногу: рваная рана от сетки, не укус.'),
  N('c44_hansen', flag('w.c44_hansen_talk'), 'Фрау Ханзен согласна поговорить с Яннесом. После Рождества.'),
  N('c44_church', flag('w.c44_church_help'), 'Церковь Святого Мартина к сочельнику готова: печка растоплена, скамьи стоят.'),
  N('c44_hen', v('w.c44_hen', 'killed'), 'Курица к сочельнику ощипана и висит в холодной кладовке.'),
  N('c44_hen_spared', v('w.c44_hen', 'spared'), 'Рыжую курицу пожалели. В сочельник суп будет с перловкой.'),
];

export const point44Eve: JointDecision = {
  id: 'c3_new_eve44', checkpoint: 44, canParticipate: P44,
  prompt: { default: 'Кого звать за стол в сочельник. Всех, кого звали за эти дни: соседей, Феликса, Юлиана с бабушкой. Только соседей, с кем уже договорились. Или только своих, тихо. Разные ответы — только соседей.' },
  options: [
    { id: 'open', label: { default: 'Всех, кого звали' }, effects: [{ set: 'w.c44_eve', value: 'open' }],
      text: 'В сочельник за столом — все, кого звали. Будет тесно.' },
    { id: 'near', label: { default: 'Соседей, с кем уже договорились' }, effects: [{ set: 'w.c44_eve', value: 'near' }],
      text: 'В сочельник за столом — свои и соседи, с кем договорились.' },
    { id: 'home', label: { default: 'Только своих' }, effects: [{ set: 'w.c44_eve', value: 'home' }],
      text: 'В сочельник — только свои.' },
  ],
  compromises: [{ pair: ['open', 'near'], result: 'near' }, { pair: ['open', 'home'], result: 'near' }, { pair: ['near', 'home'], result: 'near' }],
  arbiters: [{ id: 'c44_eve_near', when: P44, winner: 'near', text: 'Вы не сходитесь. Свои и соседи.' }],
  default: 'near',
};

export const point44Post: JointDecision = {
  id: 'c3_new_post44', checkpoint: 44, canParticipate: P44,
  prompt: { default: 'В сочельник с девяти до полуночи пост у Зеве держит ваш двор. Стоит {A}, стоит {B} или вы просите другого: Феликса, Оле или кого-то из соседей. Разные ответы — просите другого.' },
  options: [
    { id: 'a', label: { default: 'Стоит {A}' }, effects: [{ set: 'w.c44_post', value: 'a' }],
      text: 'В сочельник с девяти до полуночи на посту у Зеве — {A}.' },
    { id: 'b', label: { default: 'Стоит {B}' }, effects: [{ set: 'w.c44_post', value: 'b' }],
      text: 'В сочельник с девяти до полуночи на посту у Зеве — {B}.' },
    { id: 'other', label: { default: 'Попросить другого' }, effects: [{ set: 'w.c44_post', value: 'other' }],
      text: 'На пост в сочельник попросите другого. Вы оба — за столом.' },
  ],
  compromises: [{ pair: ['a', 'b'], result: 'other' }, { pair: ['a', 'other'], result: 'other' }, { pair: ['b', 'other'], result: 'other' }],
  arbiters: [{ id: 'c44_post_other', when: P44, winner: 'other', text: 'Вы не сходитесь. Попросите другого.' }],
  default: 'other',
};
