import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P17, albers17, ninaAway, ninaHere, sweep17 } from './point16';

const tractorHere: Cond = { any: [flag('w.c16_tractor'), flag('w.c17_tractor')] };

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
  { id: 'c17_no_tractor', when: all(finished17, { not: tractorHere }), text: 'Трактор Хенрике так и стоит у Дениза. Без него колонию за одну ночь не перевезти.' },
  { id: 'c17_tractor', when: all(finished17, flag('w.c17_tractor')), text: '{A} пригнал трактор Хенрике из Бухгольца. Патруль у переезда его видел.' },
  { id: 'c17_barn', when: all(finished17, flag('w.c17_barn_ready')), text: 'Длинный сарай за курятником вычищен: шесть стойл, кольца в стене держат.' },
  { id: 'c17_trailer', when: all(finished17, flag('w.c17_trailer_ready')), text: 'Прицеп к трактору починен: колесо держит, борт сколочен. Четверо влезут, если плотно.' },
  { id: 'c17_brandt_soft', when: all(finished17, v('B.c17_brandt_b', 'soft')), text: 'Брандт услышал имена. Одного из семерых, господина Штамера, он знал: тот учил его физкультуре.' },
  { id: 'c17_brandt_hard', when: all(finished17, v('B.c17_brandt_b', 'hard')), text: '{B} сказала Брандту правду про ночь, когда Кай ушёл. «Другие бы соврали», — сказал он. Но теперь он знает, что цепь не держит.' },
  { id: 'c17_margit_calm', when: all(finished17, flag('w.c17_margit_calm')), text: 'У сарая играет радио Хенрике. Под шлягеры Маргит затихает.' },
  { id: 'c17_nina_koehler', when: all(finished17, flag('w.c17_nina_with_koehler')), text: 'Нина ходила к отцу с Кёлер, без вас. Вернулась тихая и сразу ушла к себе.' },
  { id: 'c17_pit', when: all(finished17, { any: [flag('w.c17_pit'), flag('A.c17_knows_pit'), flag('B.c17_bpt')] }), text: 'За теплицей в колонии выкопана длинная яма. «На всякий случай, — сказала Уте. — Чтобы никто не бросил их в грузовик».' },
  { id: 'c17_ute_ready', when: all(finished17, flag('B.c17_ute_ready')), text: 'Уте сказала {B.dat}: «Я готова к тому, чтобы это сделал не кто-то другой».' },
  { id: 'c17_water', when: all(finished17, { any: [flag('w.c17_water_hauled'), flag('w.c16_water_hauled')] }), text: 'В колонию возили воду на тракторе, бочкой. Яннес теперь машет трактору с насыпи.' },
  { id: 'c17_mats', when: all(finished17, flag('B.c17_bvm')), text: '{B} видела внука Брандта. Жара у мальчика нет уже сутки. Точно не знает никто.' },
  { id: 'c17_marcus', when: all(finished17, flag('A.c17_avm')), text: 'Маркус и Лео ушли из Йестебурга пешком на восток, в Целле.' },
  { id: 'c17_wiring', when: all(finished17, flag('w.c17_wiring')), text: 'Яннес протянул провод от генератора по стене, как надо. Две розетки на кухне.' },
  { id: 'c17_arrest', when: all(finished17, flag('w.c17_arrest_warned')), text: 'Офицер сказал прямо: кто завтра встанет на пути, будет задержан. Гражданские тоже.' },
  { id: 'c17_tobias_six', when: all(finished17, flag('w.c17_tobias_six')), text: 'Тобиас сказал {B.dat}: свою мать он завтра в шесть утра сделает сам. Раньше всех.' },
  { id: 'c17_nina_wants', when: all(finished17, flag('w.c17_nina_wants')), text: 'Нина сказала: завтра она хочет быть у колонии, даже если вы скажете «нет».' },
  { id: 'c17_nina_wish', when: all(finished17, flag('w.c17_nina_wish')), text: 'Нина: «Чтобы его не застрелили чужие. Всё остальное я переживу».' },
  { id: 'c17_diesel', when: all(finished17, flag('w.c17_diesel')), text: 'В ящике за сиденьем трактора канистра солярки от Дениза, двадцать литров.' },
  { id: 'c17_gate', when: all(finished17, flag('w.c17_gate_fixed')), text: 'На задней калитке теперь два крючка.' },
  { id: 'c17_margit', when: all(finished17, albers17('take')), text: 'В сарае на цепи Маргит Альберс. Тобиас обещал забрать её в четверг.' },
];

export const point17Colony: JointDecision = {
  id: 'c3_new_colony17', checkpoint: 17, canParticipate: P17,
  prompt: { default: 'Завтра в восемь к колонии придут Брандт и солдаты. Если на хуторе есть трактор, можно этой ночью перевезти всех семерых к себе на прицепе, в две ходки. Можно утром стоять у калитки колонии рядом с Уте, уговорить Уте попрощаться со всеми самой до утра, без солдат, или не вмешиваться. Если не сойдётесь: хутор или прощание вместе с калиткой — калитка, в остальных случаях — не вмешиваетесь.' },
  options: [
    { id: 'move', label: { default: 'Ночью перевезти колонию на хутор на тракторе' }, when: tractorHere,
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
