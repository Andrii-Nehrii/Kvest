import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { v } from './point18';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { npc, tableOnly } from './point19';
import { wayHide, wayJest, wayTobias } from './point22';

// Участок 23: воскресенье 22.11, ночь после КТ22 → КТ23 20:00. План — docs/hidden/STOCK_PLAN.md §9.
// Передышка (жребий); мелкое — люди из прошлого: Маркус и Лео приходят к воротам в полдень.
export const P23: Cond = all({ cp: 22 }, not({ cp: 23 }));
export const A23: Cond = { me: 'A' };
export const B23: Cond = { me: 'B' };
export const farm23 = 'hof_luedemann';
export const leaHere23: Cond = wayHide;
export const leaLue23: Cond = wayTobias;
export const leaJest23: Cond = wayJest;
export const marcusAlive: Cond = { npc: 'c12_marcus', alive: true };
export const leoAlive: Cond = { npc: 'c12_leo', alive: true };
export const guestsCome: Cond = all(marcusAlive, leoAlive);
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point23Available: Cond = all(P23, { at: farm23 }, up, flag('w.c22_letter'), flag('w.c22_tobias'));

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm23, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S23 = wrap(P23);
export const set23 = (key: string, value: string | boolean): Effect => ({ set: `$.c23_${key}`, value });
export const w23 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c23_${key}`, value });
export const until23 = (h: number, m = 0, sleeping = false, d = 22): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare23: Effect = { camp: { kind: 'prepare', quiet: true } };
export const snow23 = { tempC: -2, outdoor: true, wet: false };
export const night23 = { tempC: -3, outdoor: true, wet: false };
/** В полдень Маркус и Лео у ворот: обе линии вводят их одинаково. */
export const guestsArrive: Effect = { if: guestsCome, then: [{ npc: 'c12_marcus', moveTo: farm23 }, { npc: 'c12_leo', moveTo: farm23 }, { set: '$.met.c23_guests', value: true }] };
const finish: Effect = { set: '$.c23_finished', value: true };
const sleepTill = until23(6, 30, true);

export const shared23: Scene[] = [
  S23({ id: 'c23_night', for: 'any', chapter: 'ch3', title: 'Ночь на воскресенье', camp: house14,
    text: [
      { text: 'Около десяти дом гасит последнюю лампу. За окном тихо так, что слышно, как в печи оседают угли.' },
      { when: all(leaHere23, not(flag('w.c22_lea_sleep'))), text: 'За стеной ворочается Лея. Потом затихает.' },
      { when: all(leaHere23, v('w.c22_lea_sleep', 'nina')), text: 'Из Нининой комнаты до полуночи слышен шёпот, потом смех, сдавленный подушкой. Потом тишина.' },
      { when: all(leaHere23, v('w.c22_lea_sleep', 'door')), text: 'Внизу, у задней двери, Лея дважды за ночь проверяет засов. Ты слышишь, как он лязгает, и оба раза просыпаешься.' },
      { when: all(leaHere23, v('w.c22_lea_sleep', 'both')), text: 'Внизу, в швейной, Нина и Лея спят на одной постели на полу. Утром Нину находят у Леи под боком.' },
      { text: 'Мальте внизу на лавке храпит, с присвистом, как чайник.' },
      { text: 'Под одеялом холодно, пока не надышишь. За окном что-то шуршит по стеклу, мягко, без перерыва: это пошёл снег, первый.' },
    ],
    actions: [
      { id: 'c23_n_sleep', label: 'Спать', minutes: 5, terminal: true, outcomes: [{ id: 'a', when: A23, goto: 'c23_a_snow' }, { id: 'b', goto: 'c23_b_snow' }],
        text: 'Ты засыпаешь, едва коснувшись подушки. Снится дорога, по которой ты идёшь и никак не дойдёшь.', effects: [set23('n', 'sleep'), sleepTill] },
      { id: 'c23_n_watch', label: 'Посидеть у окна до часу', minutes: 5, terminal: true, outcomes: [{ id: 'a', when: A23, goto: 'c23_a_snow' }, { id: 'b', goto: 'c23_b_snow' }],
        text: 'Около полуночи за стеклом начинает что-то сыпаться. Мелкое, сухое, белое. Крупа. Первый снег. К часу двор становится светлее, чем был днём. Ты ложишься.', effects: [set23('n', 'watch'), set23('saw_snow', true), until23(1, 0), sleepTill] },
      { id: 'c23_n_talk', label: 'Шёпотом договорить то, что не договорили', minutes: 5, terminal: true, outcomes: [{ id: 'a', when: A23, goto: 'c23_a_snow' }, { id: 'b', goto: 'c23_b_snow' }],
        text: 'Вы лежите в темноте лицом друг к другу. Говорите шёпотом, про всё и ни про что: про квартиру в Бармбеке, про то, какой сегодня день недели, про то, что завтра будет трудно. Засыпаете на полуслове.', effects: [set23('n', 'talk'), { body: 'stress', delta: -3 }, sleepTill] },
    ] }),

  S23({ id: 'c23_supper', for: 'any', chapter: 'ch3', title: 'Воскресный ужин', camp: kitchen14,
    text: [
      { text: 'В шесть за столом не хватает места. Табуреты, ящик из-под яблок, лавка. Картошка, капуста, по ломтю окорока на каждого: Нина решила, что сегодня можно.' },
      { when: guestsCome, text: 'Лео сидит между Ниной и тобой и ест, не поднимая головы. На второй картофелине он засыпает, прямо над тарелкой. Маркус перекладывает его к себе на колени и доедает одной рукой.' },
      { when: leaHere23, text: 'Лея сидит с краю, у двери. Сегодня она улыбнулась два раза, и оба раза Нине.' },
      { when: all(leaHere23, v('w.c22_lea_hair', 'dyed')), text: 'За ушами у неё до сих пор коричневые разводы от краски. Нина оттирает их мокрым полотенцем, как младшей, и очень этим горда.' },
      { text: 'Над столом, рядом с календарём, висит выцветшая фотография в рамке: мальчик лет девяти обнимает за шею овчарку. Внизу карандашом: «Ole, 9, mit Asta». Ты смотрел{m:|а} на неё десятки раз и ни разу не видел{m:|а}.' },
      { when: v('$.c23_n', 'talk'), text: 'Ночью вы договорили то, что не договорили. С утра между вами легче, и это видно даже Нине.' },
      { when: v('$.c23_am', 'cough'), text: 'Маркус сказал: Лео кашляет с Гамбурга, третью неделю. Ты смотришь, как мальчик ест, и прислушиваешься.' },
    ],
    actions: [
      { id: 'c23_su_eat', label: 'Поесть со всеми', minutes: 30, terminal: true, goto: 'c23_evening', ...tableOnly,
        text: 'Ты ешь медленно. Окорок солёный и пахнет дымом. Мальте рассказывает, как в армии они жарили сосиски на выхлопной трубе. Смеётся даже Маркус.', effects: [set23('su', 'eat'), meal('eat'), until23(18, 45)] },
      { id: 'c23_su_give', label: 'Отдать свой окорок Лео: пусть проснётся к нему', when: guestsCome, minutes: 25, terminal: true, goto: 'c23_evening', ...tableOnly,
        text: 'Ты кладёшь свой ломоть на тарелку Лео. Маркус смотрит на тебя поверх его головы и коротко кивает. Больше за вечер он с тобой не говорит. Но этот кивок ты запомнишь.', effects: [set23('su', 'give'), { camp: { kind: 'meal', mode: 'give', communal: true } }, npc('c12_marcus', 2), npc('c12_leo', 1), until23(18, 40)] },
      { id: 'c23_su_tea', label: 'Только чай', minutes: 15, terminal: true, goto: 'c23_evening',
        text: 'Ты пьёшь чай и смотришь на фотографию над столом. Мальчик и собака. Оба смотрят в объектив так, будто им обещали что-то хорошее.', effects: [set23('su', 'tea'), { body: 'thirst', delta: -10 }, until23(18, 30)] },
    ] }),

  S23({ id: 'c23_evening', for: 'any', chapter: 'ch3', title: 'Вечер', camp: house14,
    text: [
      { text: 'После ужина Нина моет посуду, Маркус вытирает. Они не разговаривают, но работают так, будто делали это вместе годами.' },
      { text: 'Завтра понедельник. В десять Брандт будет ждать в пожарной части. А раньше, может быть, придёт сам.' },
      { text: 'Снег за окном падает крупными хлопьями. Во дворе всё стало белым и тихим, и следы на нём видны до самой калитки.' },
      { when: v('$.c23_su', 'eat'), text: 'После ужина клонит в сон.' },
    ],
    actions: [
      { id: 'c23_ev_list', label: 'Пройтись вдвоём по списку: что есть в доме, что увидит Брандт', minutes: 40, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c23_a_watch' }, { id: 'b', goto: 'c23_b_leo2' }],
        text: 'Вы садитесь у стола с листком. Канистра. Солярка. Ружьё. Окорок. Люди. Сумка в кладовке. Каждую строчку вы читаете вслух дважды, и каждый раз кажется, что вы что-то забыли.', effects: [set23('ev', 'list'), finish, until23(19, 30)] },
      { id: 'c23_ev_out', label: 'Выйти вдвоём во двор, на снег', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c23_a_watch' }, { id: 'b', goto: 'c23_b_leo2' }], ambientDuring: night23,
        text: 'Снег скрипит. Небо очистилось, видны звёзды, много, как за городом в детстве. Над лесом на востоке ничего не светится. Вы стоите, пока не замерзают уши, и говорите только о звёздах.', effects: [set23('ev', 'out'), { body: 'stress', delta: -3 }, finish, until23(19, 30)] },
      { id: 'c23_ev_sleep', label: 'Лечь пораньше: завтра длинный день', minutes: 15, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c23_a_watch' }, { id: 'b', goto: 'c23_b_leo2' }],
        text: 'Ты поднимаешься наверх {m:первым|первой}. Снизу слышно, как Маркус что-то негромко говорит спящему Лео. Ты не разбираешь слов.', effects: [set23('ev', 'sleep'), finish, until23(19, 30)] },
    ] }),

  S23({ id: 'c23_checkpoint', for: 'any', chapter: 'ch3', title: 'Воскресенье, восемь вечера', checkpoint: 23, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Снег за окном перестал. Вы сидите на кухне и решаете две вещи: что будет с теми, кто пришёл сегодня, и как вы встретите завтра Брандта.' }], actions: [] }),
];
