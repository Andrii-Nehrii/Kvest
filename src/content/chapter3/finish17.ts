import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P17, albers17, ninaAway, ninaHere, sweep17 } from './point16';

export const finished17: Cond = all(P17, flag('A.c17_finished'), flag('B.c17_finished'));
const v = (key: string, value: string): Cond => ({ v: key, op: '==', value });
const carHere: Cond = { itemAt: 'opel_corsa', place: 'hof_luedemann' };

// Сверка в полдень: каждый рассказывает своё утро. Видят оба.
export const point17Notes: MergeNote[] = [
  { id: 'c17_ute_truth', when: all(finished17, { any: [flag('B.c17_ute_truth'), sweep17('stay'), sweep17('brandt')] }),
    text: 'Кая этой ночью Уте выпустила сама. Хотела, чтобы он хоть раз ушёл свободно, а не в клетку к Брандту. Он пошёл не в лес, а к людям.' },
  { id: 'c17_move_asked', when: all(finished17, flag('w.c17_move_asked')),
    text: 'Уте спросила, взяли бы вы их к себе на хутор. Всех семерых. У вас колодец и сараи.' },
  { id: 'c17_brandt_yes', when: all(finished17, v('A.c17_brandt', 'convinced')),
    text: '{A} был у Брандта. Тот поверил, что внука укусили не с насыпи. В среду он всё равно придёт, но без солдат: поговорить с Уте, если вы будете рядом.' },
  { id: 'c17_brandt_doubt', when: all(finished17, v('A.c17_brandt', 'doubt')),
    text: '{A} был у Брандта. Доказательств не хватило. Среда, восемь, с солдатами. «Если хотите быть там, приходите».' },
  { id: 'c17_seven', when: all(finished17, flag('w.c17_brandt_seven')), text: 'Брандт обещал {A.dat}: в среду в семь, за час до солдат, он придёт к колонии посмотреть сам. Полчаса, не больше.' },
  { id: 'c17_grandson', when: all(finished17, v('A.c17_ab2', 'grandson')), text: 'Внука Брандта зовут Матс. Он хотел стать пожарным.' },
  { id: 'c17_pump', when: all(finished17, flag('w.c17_pump')), text: 'Колонка в колонии снова качает. Рычаг — ваш лом, обмотанный проволокой.' },
  { id: 'c17_jannes_wish', when: all(finished17, flag('A.c17_jannes_wish')),
    text: 'Яннес сказал {A.dat}: он хочет, чтобы это кончилось. Без солдат. Чтобы мама не смотрела.' },
  { id: 'c17_koehler_wed', when: all(finished17, flag('B.c17_koehler_wed')), text: 'Кёлер в среду будет у четвёртой парцеллы. Держать брата за руку, кто бы ни пришёл.' },
  { id: 'c17_nina_said', when: all(finished17, flag('w.c17_nina_said')), text: 'Нина прочитала отцу письмо через стекло. «Я всё сказала», — говорит она. Больше она ничего не объясняет.' },
  { id: 'c17_sperr', when: all(finished17, flag('A.c17_patrol')), text: 'Патруль остановил {A.acc} на полевой дороге. С восьми утра у насыпи закрытая зона: «Оставайтесь дома».' },
  { id: 'c17_hen', when: all(finished17, flag('w.c17_hen_koehler')), text: 'Курицу, которая убилась ночью о сетку, вы отложили для Кёлер.' },
  { id: 'c17_margit', when: all(finished17, albers17('take')), text: 'В сарае на цепи Маргит Альберс. Тобиас обещал забрать её в четверг.' },
];

export const point17Colony: JointDecision = {
  id: 'c3_new_colony17', checkpoint: 17, canParticipate: P17,
  prompt: { default: 'Завтра в восемь к колонии придут Брандт и солдаты. Можно этой ночью перевезти всех семерых к себе на хутор, утром стоять у калитки колонии рядом с Уте, уговорить Уте попрощаться со всеми самой до утра, без солдат, или не вмешиваться. Если не сойдётесь: хутор или прощание вместе с калиткой — калитка, в остальных случаях — не вмешиваетесь.' },
  options: [
    { id: 'move', label: { default: 'Ночью перевезти колонию на хутор' },
      effects: [{ set: 'w.c17_colony', value: 'move' }, { if: { npc: 'c14_ute', alive: true }, then: [{ npc: 'c14_ute', trust: 3, remember: 'c17_they_took_all' }] }],
      text: 'Ты пишешь Уте: «Heute Nacht. Alle». Сегодня ночью. Всех. Ответ приходит через минуту, одно слово: «Wirklich?» Правда?' },
    { id: 'stand', label: { default: 'Утром стоять у калитки колонии рядом с Уте' },
      effects: [{ set: 'w.c17_colony', value: 'stand' }, { if: { npc: 'c14_ute', alive: true }, then: [{ npc: 'c14_ute', trust: 2, remember: 'c17_they_stand' }] }],
      text: 'Завтра в половине восьмого вы будете у калитки колонии. Что вы скажете Брандту, вы ещё не знаете.' },
    { id: 'end', label: { default: 'Уговорить Уте попрощаться самой, до утра' },
      effects: [{ set: 'w.c17_colony', value: 'end' }, { if: { npc: 'c14_jannes', alive: true }, then: [{ npc: 'c14_jannes', trust: 2, remember: 'c17_they_ended' }] }],
      text: 'Вечером вы пойдёте к Уте. Говорить будете вдвоём. Яннес будет ждать у теплицы: он знает, о чём.' },
    { id: 'away', label: { default: 'Не вмешиваться' },
      effects: [{ set: 'w.c17_colony', value: 'away' }],
      text: 'Вы остаётесь на хуторе. Завтра в восемь вы, наверное, услышите выстрелы. Или не услышите.' },
  ],
  compromises: [
    { pair: ['move', 'stand'], result: 'stand' }, { pair: ['end', 'stand'], result: 'stand' }, { pair: ['move', 'end'], result: 'away' },
    { pair: ['move', 'away'], result: 'away' }, { pair: ['stand', 'away'], result: 'away' }, { pair: ['end', 'away'], result: 'away' },
  ],
  arbiters: [{ id: 'c17_colony_away', when: P17, winner: 'away', text: 'Вы не сходитесь. Вы не вмешиваетесь.' }],
  default: 'away',
};

export const point17Nina: JointDecision = {
  id: 'c3_new_nina17', checkpoint: 17, canParticipate: P17,
  prompt: { default: 'Нина и завтрашнее утро. Если Нина на хуторе: взять её с собой или оставить дома. Если она в Винзене: привезти её сегодня вечером на Corsa, тридцать шесть километров туда и обратно, сказать по телефону или не говорить, пока всё не кончится. Разные ответы — Нина дома (или: сказать по телефону).' },
  options: [
    { id: 'with', label: { default: 'Нина будет с вами' }, when: ninaHere,
      effects: [{ set: 'w.c17_nina', value: 'with' }, { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust: 2 }] }],
      text: 'Нина слушает с лестницы и кивает. Потом идёт наверх и долго выбирает, что надеть. Спускается в своей шапке и в куртке, застёгнутой до подбородка.' },
    { id: 'home', label: { default: 'Нина остаётся дома' }, when: ninaHere,
      effects: [{ set: 'w.c17_nina', value: 'home' }],
      text: 'Нина слушает с лестницы.\n\n— Ладно, — говорит она. — Я уже всё сказала. — И уходит к себе.' },
    { id: 'fetch', label: { default: 'Привезти Нину из Винзена сегодня вечером' }, when: all(ninaAway, carHere, { fuelIn: 'opel_corsa', liters: 2.4 }),
      feasible: all({ has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 36 }),
      effects: [{ journey: { to: 'c15_winsen', km: 18, minutes: 30, vehicle: 'opel_corsa' } },
        { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', moveTo: 'hof_luedemann', trust: 2 }] },
        { journey: { to: 'hof_luedemann', km: 18, minutes: 30, vehicle: 'opel_corsa' } },
        { set: 'w.c17_nina', value: 'fetch' }],
      text: 'Нина ждёт у калитки подруги с рюкзаком, хотя вы не говорили, во сколько приедете. Садится назад и всю дорогу молчит. На хуторе первым делом идёт к своей раскладушке и садится на неё, не раздеваясь.' },
    { id: 'phone', label: { default: 'Сказать Нине по телефону' }, when: ninaAway,
      effects: [{ set: 'w.c17_nina', value: 'phone' }],
      text: 'Ты звонишь. Нина слушает, не перебивая. Потом говорит: «Danke, dass ihr es mir sagt». Спасибо, что говорите. И кладёт трубку первой.' },
    { id: 'later', label: { default: 'Не говорить ей, пока всё не кончится' }, when: ninaAway,
      effects: [{ set: 'w.c17_nina', value: 'later' }],
      text: 'Вы не звоните. Вечером Нина пишет: «Alles gut bei euch?» У вас всё хорошо? Ты долго смотришь на экран и отвечаешь: «Ja».' },
  ],
  compromises: [{ pair: ['with', 'home'], result: 'home' }, { pair: ['fetch', 'phone'], result: 'phone' }, { pair: ['fetch', 'later'], result: 'phone' }, { pair: ['phone', 'later'], result: 'phone' }],
  arbiters: [
    { id: 'c17_nina_home', when: all(P17, ninaHere), winner: 'home', text: 'Вы не сходитесь. Нина остаётся дома.' },
    { id: 'c17_nina_phone', when: all(P17, ninaAway), winner: 'phone', text: 'Вы не сходитесь. Вы говорите Нине по телефону.' },
  ],
  default: 'home',
};
