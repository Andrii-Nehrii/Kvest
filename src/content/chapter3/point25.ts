import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { tableOnly } from './point19';
import { wayTobias } from './point22';

// Участок 25: вторник 24.11, 06:00 → КТ25 21:00. План — docs/hidden/STOCK_PLAN.md §9; жребий — порознь на часть.
// A с фургоном прачечной в Люнебурге (Оле, Хенрике, Алерс), B — хутор и Йестебург. Состояние Оле считается из базы КТ24.
export const P25: Cond = all({ cp: 24 }, not({ cp: 25 }));
export const A25: Cond = { me: 'A' };
export const B25: Cond = { me: 'B' };
export const farm25 = 'hof_luedemann';
export const lue25 = 'c18_lueneburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point25Available: Cond = all(P25, { at: farm25 }, up, flag('w.c24_message'));
/** Оле во вторник утром: прочитал правду и перестал сдавать; Лею положили вместо него; или сдавал каждый день и упал. */
export const oleStopped: Cond = v('w.c22_letter', 'truth');
export const oleRelieved: Cond = all(not(oleStopped), wayTobias, not(flag('w.c23_lea_exposed')));
export const oleCollapsed: Cond = all(not(oleStopped), not(oleRelieved));
export const oleAlive: Cond = { npc: 'ole', alive: true };
export const henrikeLue25: Cond = all({ npc: 'henrike', alive: true }, any({ npc: 'henrike', alive: true, at: lue25 }, v('w.c18_henrike', 'stays')));
export const leaLue25: Cond = wayTobias;
export const leaExposed: Cond = all(wayTobias, flag('w.c23_lea_exposed'));
export const kasiaHere25: Cond = all({ npc: 'kasia', alive: true }, flag('w.nowaks_gone'));
export const hasPage: Cond = any({ has: 'c22_page' }, { has: 'c22_page_copy' });
const msg = (x: string): Cond => v('w.c24_message', x);
export const msgCome = msg('come');
export const msgStay = msg('stay');
export const msgTruth = msg('truth');

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm25, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S25 = wrap(P25);
export const set25 = (key: string, value: string | boolean): Effect => ({ set: `$.c25_${key}`, value });
export const w25 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c25_${key}`, value });
export const until25 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(24, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare25: Effect = { camp: { kind: 'prepare', quiet: true } };
export const snow25 = { tempC: -2, outdoor: true, wet: false };
/** Состояние Оле пишут обе линии одинаково — из базы. */
export const oleState: Effect = { if: oleStopped, then: [w25('ole_state', 'stopped')],
  else: [{ if: oleRelieved, then: [w25('ole_state', 'relieved')], else: [w25('ole_state', 'collapsed')] }] };
const finish: Effect = { set: '$.c25_finished', value: true };

export const shared25: Scene[] = [
  S25({ id: 'c25_supper', for: 'any', chapter: 'ch3', title: 'Вечер вторника', camp: kitchen14,
    text: [
      { when: B25, text: 'В шесть {A} возвращается. Снег на плечах, щёки серые от холода. Он садится к печи и долго не снимает куртку.' },
      { when: A25, text: 'В шесть ты дома. Снег на плечах, щёки онемели от холода. Ты садишься к печи и долго не снимаешь куртку: пальцы не слушаются пуговиц.' },
      { when: A25, text: 'Дома пахнет картошкой и сырыми валенками. Нина ставит перед тобой кружку раньше, чем ты успеваешь сесть.' },
      { when: B25, text: 'Ты ставишь перед ним тарелку. Он смотрит на неё, как будто забыл, что это.' },
      { when: v('$.c25_br', 'stove'), text: 'В комнате Оле тепло: обогреватель гудит с обеда. Хенрике, если он приедет, это заметит.' },
      { when: v('$.c25_br', 'sit'), text: 'На кровати Оле осталась вмятина там, где ты сидел{m:|а}. Ты её не поправил{m:|а}.' },
      { when: v('$.c25_bd', 'cook'), text: 'Ужин сегодня вкуснее обычного: ты {m:потратил|потратила} на него последний лук. Нина ест медленно, чтобы растянуть.' },
      { when: v('$.c25_bd', 'gate'), text: 'Ты {m:простоял|простояла} у ворот час, пока не замёрзли ноги, и {m:увидел|увидела} фары из-за поворота раньше всех.' },
      { when: v('$.c25_ak2', 'truth'), text: 'Ты сказал{m:|а} детям в Люнебурге, что Оле устал. Одна девочка потом долго махала тебе в окно.' },
      { when: all(B25, v('w.c25_pantry_rule', 'even')), text: 'Нина раскладывает по тетради: всем одинаково. Ложка в ложку.' },
      { when: all(B25, v('w.c25_pantry_rule', 'work')), text: 'Нина накладывает тебе больше, чем себе, и смотрит, не возразишь ли. Ты сегодня колол{m:|а} дрова.' },
      { when: all(B25, v('w.c25_pantry_rule', 'kids')), text: 'Лео ест Нинино яйцо и не знает, что оно Нинино.' },
      { when: A25, text: 'Тепло печи доходит до тебя не сразу: сначала до лица, потом до рук, до ног в последнюю очередь.' },
    ],
    actions: [
      { id: 'c25_su_eat', label: 'Поесть со всеми', minutes: 30, terminal: true, goto: 'c25_evening', ...tableOnly,
        text: 'Картошка, капуста, хлеб. За столом говорит только Нина: про кур, про снег, про то, что Лео нарисовал её с косой, хотя у неё нет косы.', effects: [set25('su', 'eat'), meal('eat'), until25(18, 45)] },
      { id: 'c25_su_tea', label: 'Только чай', minutes: 15, terminal: true, goto: 'c25_evening',
        text: 'Ты пьёшь чай и ждёшь, когда все разойдутся.', effects: [set25('su', 'tea'), until25(18, 30)] },
    ] }),

  S25({ id: 'c25_evening', for: 'any', chapter: 'ch3', title: 'Письмо Хенрике', camp: house14,
    text: [
      { when: B25, text: 'Наверху, при свече, вы садитесь на кровать. {A} достаёт из внутреннего кармана сложенный лист: почерк Хенрике, крупный, с наклоном.' },
      { when: A25, text: 'Наверху, при свече, вы садитесь на кровать. Ты достаёшь из внутреннего кармана сложенный лист: почерк Хенрике, крупный, с наклоном.' },
      { text: '«Kommt ihn holen. Freitag. Oder ich bringe ihn. H.»\n\nПриезжайте за ним. В пятницу. Или я привезу его сама. Х.' },
      { when: oleCollapsed, text: 'Под подписью другой рукой, торопливо, приписка Алерс: «Noch eine Abnahme bringt ihn um». Ещё один забор его убьёт.' },
      { text: 'Свеча коптит. Ты снимаешь нагар пальцами, быстро, не обжигаясь: научил{m:ся|ась} за эту неделю.' },
    ],
    actions: [
      { id: 'c25_ev_tell', label: 'Рассказать друг другу день, по очереди', minutes: 40, terminal: true, outcomes: [{ id: 'a', when: A25, goto: 'c25_a_late' }, { id: 'b', goto: 'c25_b_late' }],
        text: 'Сначала говорит {A}, потом ты. Или наоборот. Два дня в одном: казарма и пункт, Оле и девочка в задней комнате. Свеча догорает до половины.', effects: [set25('ev', 'tell'), { body: 'stress', delta: -2 }, finish, until25(20, 0)] },
      { id: 'c25_ev_short', label: 'Сказать только главное и лечь', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: A25, goto: 'c25_a_late' }, { id: 'b', goto: 'c25_b_late' }],
        text: 'Вы говорите по одной фразе. Больше сегодня не помещается.', effects: [set25('ev', 'short'), finish, until25(20, 0)] },
    ] }),

  S25({ id: 'c25_checkpoint', for: 'any', chapter: 'ch3', title: 'Вторник, девять вечера', checkpoint: 25, universal: false, camp: house14,
    text: [{ text: 'Девять вечера. Письмо Хенрике лежит на подушке. Вы решаете две вещи: что делать с Оле и что делать с тем, что знаете про плазму.' }], actions: [] }),
];
