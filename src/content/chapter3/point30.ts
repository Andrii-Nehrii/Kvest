import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';

// Участок 30: понедельник 30.11 → КТ30 вторник 1.12, 04:00. КЛЮЧЕВАЯ: большая опасная сцена (жребий). План — STOCK_PLAN.md §9.
// Опасность без боя: мороз −9, лёд, темнота. Три входа по КТ29: впадина (join), свой край у насыпи (guard или leave),
// третий грузовик за соляркой (leave + later). У каждого — своя цепочка из трёх звеньев; два предупреждения до тяжёлого.
// Третье звено при двух ошибках подряд — выбывание (рана об лёд, кровь, холод). Страховка жизни держит, пока второй на ногах.
export const P30: Cond = all({ cp: 29 }, not({ cp: 30 }));
export const A30: Cond = { me: 'A' };
export const B30: Cond = { me: 'B' };
export const farm30 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point30Available: Cond = all(P30, { at: farm30 }, up, flag('w.c29_sweep'), flag('w.c29_diesel'));
const sweep = (x: string): Cond => v('w.c29_sweep', x);
export const entryJoin: Cond = sweep('join');
/** К грузовику ночью едут на тракторе Хенрике, если он есть. */
export const tractor30: Cond = flag('w.c16_tractor');
export const entryFuel: Cond = all(sweep('leave'), v('w.c29_diesel', 'later'), tractor30);
export const entryHome: Cond = not(any(entryJoin, entryFuel));
export const guardHome: Cond = sweep('guard');
export const hollow30 = 'c21_convoy';
export const own30 = (key: string, value: string): Cond => v(`$.c30_${key}`, value);
/** Первое звено закончилось плохо (ушиб, мокрые ноги, порванная перчатка) — второе опаснее. */
export const worse1: Cond = flag('$.c30_hurt1');
/** Второе звено закончилось плохо — третье ведёт к выбыванию. */
export const worse2: Cond = flag('$.c30_hurt2');
export const mittens: Cond = flag('$.c30_mittens');
export const dry: Cond = flag('$.c30_dry');
export const rope: Cond = flag('$.c30_rope');

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm30, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S30 = wrap(P30);
export const set30 = (key: string, value: string | boolean): Effect => ({ set: `$.c30_${key}`, value });
export const w30 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c30_${key}`, value });
export const until30 = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare30: Effect = { camp: { kind: 'prepare', quiet: true } };
/** У костра, в движении, одетые: мороз −9 ощущается мягче. Мокрое и лёд — отдельно. */
export const frost30 = { tempC: -2, outdoor: true, wet: false };
export const frostWet30 = { tempC: -9, outdoor: true, wet: true };
/** Первое звено: терпимо. */
export const hurt1 = (what: 'wet' | 'bruise' | 'glove'): Effect[] => what === 'wet'
  ? [set30('hurt1', true), { body: 'stress', delta: 3 }, { body: 'fatigue', delta: 4 }]
  : what === 'bruise'
    ? [set30('hurt1', true), { injure: 'bruise', site: 'leftLeg', severity: 2 }, { body: 'stress', delta: 3 }]
    : [set30('hurt1', true), { injure: 'scratch', site: 'hands', severity: 1 }, { body: 'stress', delta: 2 }];
/** Второе звено: тяжело, но на ногах. */
export const hurt2: Effect[] = [set30('hurt2', true), { injure: 'cut', site: 'hands', severity: 3, bleeding: 1 }, { body: 'bloodLoss', delta: 18 }, { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 6 }];
/** Третье звено: выбывание. Рана об лёд, кровь, холод. Страховка жизни — пока партнёр на ногах; спасать — в точке 31. */
export const down30: Effect[] = [{ injure: 'laceration', site: 'head', severity: 4, bleeding: 3 }, { body: 'bloodLoss', delta: 58 }, { body: 'stress', delta: 10 }, set30('down', true), w30('down', true)];
const finish: Effect = { set: '$.c30_finished', value: true };

export const shared30: Scene[] = [
  S30({ id: 'c30_monday', for: 'any', chapter: 'ch3', title: 'Понедельник', camp: yard14, ambient: frost30,
    text: [
      { text: 'Мороз минус девять, ясно. Снег скрипит, воздух режет нос. Радио обещает к ночи минус двенадцать.' },
      { when: entryJoin, text: 'В десять вечера вас ждут у пожарной части. Впадина.' },
      { when: all(entryHome, guardHome), text: 'Ночью вы держите дворы у насыпи. Если с впадины побегут — сюда, по льду ручья.' },
      { when: all(entryHome, not(guardHome)), text: 'Вы решили не участвовать. Но ворота придётся держать: тех, кого выгонят с впадины, мороз гонит к теплу.' },
      { when: entryFuel, text: 'Ночью, когда дружина уйдёт к впадине, у пожарной части никого не останется. Третий грузовик с колонны. Бочки.' },
      { text: 'Хенрике смотрит, как вы собираетесь, и говорит одно:\n\n— Zweite Handschuhe. Trockene Socken. Und keiner geht allein aufs Eis.\n\nВторые рукавицы. Сухие носки. И никто не ходит по льду один.' },
    ],
    actions: [
      { id: 'c30_mo_kit', label: 'Собраться как следует: вторые рукавицы, сухие носки, верёвка', minutes: 60, terminal: true, goto: 'c30_dusk',
        text: 'Рукавицы Уте, серые с красной полосой, во внутренний карман. Сухие носки в целлофане. Моток верёвки через плечо. Фонарь, батарейки. Хенрике проверяет каждую вещь сама, как перед школой.', effects: [set30('mo', 'kit'), set30('mittens', true), set30('dry', true), set30('rope', true), until30(30, 17, 0)] },
      { id: 'c30_mo_sleep', label: 'Выспаться днём: ночь будет длинной', minutes: 60, terminal: true, goto: 'c30_dusk',
        text: 'Ты спишь до сумерек, тяжело, без снов. Встаёшь {m:отдохнувшим|отдохнувшей}. Рукавицы ищешь уже в темноте и находишь одну пару.', effects: [set30('mo', 'sleep'), set30('dry', true), { body: 'fatigue', delta: -15 }, until30(30, 16, 30, true)] },
      { id: 'c30_mo_work', label: 'Сначала дела по дому, сборы потом', minutes: 60, activity: 'moderate', terminal: true, goto: 'c30_dusk',
        text: 'Дрова, вода из колодца, куры. К сумеркам руки красные и мокрые от снега. Собираешься бегом, что под руку попало.', effects: [set30('mo', 'work'), { body: 'fatigue', delta: 6 }, until30(30, 17, 0)] },
    ] }),

  S30({ id: 'c30_dusk', for: 'any', chapter: 'ch3', title: 'Перед ночью', camp: kitchen14,
    text: [
      { text: 'Ужин рано, в пять. Хенрике кормит всех плотно: картошка, солонина, если есть, хлеб, горячий чай с мёдом.' },
      { text: 'Нина сидит молча. Потом спрашивает: «Вы вернётесь?» Как спрашивают дети, которые уже знают, что ответ может быть разным.' },
    ],
    actions: [
      { id: 'c30_du_eat', label: 'Поесть плотно', minutes: 30, terminal: true, outcomes: [{ id: 'j', when: entryJoin, goto: 'c30_j_road' }, { id: 'f', when: entryFuel, goto: 'c30_f_road' }, { id: 'h', goto: 'c30_h_post' }], ...tableOnly,
        text: 'Ты ешь, пока не становится тяжело. Холод любит пустой живот. Хенрике подкладывает ещё.', effects: [set30('du', 'eat'), meal('eat'), { body: 'hunger', delta: -15 }, until30(30, 21, 0)] },
      { id: 'c30_du_nina', label: 'Ответить Нине: вернёмся', minutes: 20, terminal: true, outcomes: [{ id: 'j', when: entryJoin, goto: 'c30_j_road' }, { id: 'f', when: entryFuel, goto: 'c30_f_road' }, { id: 'h', goto: 'c30_h_post' }],
        text: 'Нина кивает. Не верит. Но кивает. Потом приносит тебе термос с чаем и ставит у двери.', effects: [set30('du', 'nina'), npc('c7_nina', 1), until30(30, 21, 0)] },
    ] }),

  S30({ id: 'c30_night_end', for: 'any', chapter: 'ch3', title: 'Четыре утра', camp: house14,
    text: [
      { text: 'К четырём всё кончается. Впадина горит: дружина подожгла солому и старые покрышки по краю. Зарево видно отовсюду. Те, кто внизу, медленно идут к огню и останавливаются у него. Мороз делает остальное.' },
      { when: flag('w.c30_down'), text: 'В доме на кухонном столе — тот, кого принесли. Хенрике греет воду. Лея, если она здесь, моет руки до локтей.' },
    ],
    actions: [
      { id: 'c30_ne_sit', label: 'Сесть у печи и не двигаться', minutes: 20, terminal: true, goto: 'c30_checkpoint',
        text: 'Тепло. Руки отходят с болью. Ты сидишь и смотришь в огонь. Это кончилось.', effects: [set30('ne', 'sit'), finish, until30(31, 4, 0)] },
      { id: 'c30_ne_count', label: 'Пересчитать всех', minutes: 20, terminal: true, goto: 'c30_checkpoint',
        text: 'Хенрике. Нина. Эва. Оле, если он жив. Лея, Кася, если они здесь. Ты считаешь по головам. Потом ещё раз.', effects: [set30('ne', 'count'), finish, until30(31, 4, 0)] },
    ] }),

  S30({ id: 'c30_checkpoint', for: 'any', chapter: 'ch3', title: 'Вторник, четыре утра', checkpoint: 30, universal: false, camp: house14,
    text: [{ text: 'Четыре утра. Зарево над Гарльсторфом бледнеет. Вы решаете, что делать с тем, что принесла эта ночь.' }], actions: [] }),
];

