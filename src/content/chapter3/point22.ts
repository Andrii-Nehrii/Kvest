import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';

// Участок 22: суббота 21.11, 07:30 → КТ22 21:00. План — docs/hidden/STOCK_PLAN.md §8.
// Крупный приём: знают разное, один решает за другого. A весь день с патрулём, Мальте и бумагами; B — с Леей (или без неё).
// Все развилки, которые видят обе линии, считаются из базы КТ21: телефоны не знают решений друг друга до вечера.
export const P22: Cond = all({ cp: 21 }, not({ cp: 22 }));
export const A22: Cond = { me: 'A' };
export const B22: Cond = { me: 'B' };
export const farm22 = 'hof_luedemann';
const lea21 = (x: string): Cond => v('w.c21_lea', x);
/** Решала она сама (ответ «спросить её»): заперли или чуть не выдали — уходит к Тобиасу; о ней уже доложили — идёт к врачу в Йестебург. */
const askTobias: Cond = any(v('w.c21_lea_bed', 'smoke'), v('B.c21_bc', 'out'), v('A.c21_fi', 'keep'), v('B.c21_fi', 'keep'));
const askJest: Cond = v('w.c21_dirk', 'reported');
export const wayTobias: Cond = any(lea21('tobias'), all(lea21('ask'), askTobias));
export const wayJest: Cond = any(lea21('brandt'), all(lea21('ask'), not(askTobias), askJest));
export const wayHide: Cond = not(any(wayTobias, wayJest));
/** Её выбор, а не ваш. */
export const herChoice: Cond = lea21('ask');
/** В девять патруль обыскивает двор: о ней доложили или Дирк доложит сам. */
export const search22: Cond = all(wayHide, any(v('w.c21_dirk', 'reported'), all(v('w.c21_dirk', 'slept'), not(flag('w.c21_dirk_promised')))));
/** Тобиас помнит долг: под грушей, кивок у колонны. */
export const debt22: Cond = any(flag('w.c18_tobias_favor'), flag('w.c21_tobias_nod'));
export const bag22 = (x: string): Cond => v('w.c21_bag', x);
/** B днём уходит в Йестебург: с Леей или с сумкой. */
export const bAway: Cond = any(wayJest, bag22('point'));
export const dirkHere: Cond = v('w.c21_dirk', 'slept');
export const dogHere22: Cond = any(v('w.c19_dog', 'house'), v('w.c19_dog', 'gate'));
export const evaHere22: Cond = v('w.c18_seat', 'eva');
export const keremComes: Cond = all({ npc: 'kerem', alive: true }, any(flag('w.c21_kerem_comes'), flag('w.c19_fuel_offer')));
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point22Available: Cond = all(P22, { at: farm22 }, up, flag('w.c21_lea'), flag('w.c21_bag'));

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm22, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S22 = wrap(P22);
export const set22 = (key: string, value: string | boolean): Effect => ({ set: `$.c22_${key}`, value });
export const w22 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c22_${key}`, value });
export const until22 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(21, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare22: Effect = { camp: { kind: 'prepare', quiet: true } };
export const lea22 = (trust: number, remember?: string): Effect => npc('c21_lea', trust, remember);
export const malte22 = (trust: number, remember?: string): Effect => npc('c21_malte', trust, remember);
export const day22 = { tempC: 4, outdoor: true, wet: false };
export const dusk22 = { tempC: 1, outdoor: true, wet: false };
/** Куда уходит Лея: обе линии двигают её одинаково, так что мир сходится. */
export const leaMoves: Effect = { if: { npc: 'c21_lea', alive: true }, then: [{ if: wayTobias, then: [{ npc: 'c21_lea', moveTo: 'c18_lueneburg' }],
  else: [{ if: wayJest, then: [{ npc: 'c21_lea', moveTo: 'c16_jesteburg' }] }] }] };
const finish: Effect = { set: '$.c22_finished', value: true };

// ───────────── Общий вечер ─────────────
export const shared22: Scene[] = [
  S22({ id: 'c22_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: dusk22,
    text: [
      { text: 'Половина шестого. Солнце село за лесополосой час назад, так и не согрев. Лужи во дворе снова схватывает по краям.' },
      { when: all(A22, bAway), text: '{B} вернулась из Йестебурга незадолго до темноты. Одна. Она долго стояла у ворот, прежде чем войти.' },
      { when: all(B22, bAway), text: 'Из Йестебурга ты {m:вернулся|вернулась} незадолго до темноты. Ноги гудят. У ворот ждал {A}, не делая вид, что вышел просто так.' },
      { when: wayHide, text: 'Из окна швейной комнаты на двор смотрит Лея. Увидев, что на неё смотрят, она отходит от стекла.' },
    ],
    actions: [
      { id: 'c22_dk_hens', label: 'Загнать кур и закрыть курятник', minutes: 25, activity: 'light', terminal: true, goto: 'c22_radio', ambientDuring: dusk22,
        text: 'Куры идут неохотно: по одной, с остановками у каждой лужи. Ты пересчитываешь их в дверях. Все. Задвижку ты закрываешь на проволоку, как научила Хенрике.', effects: [set22('dk', 'hens'), until22(18, 50)] },
      { id: 'c22_dk_gate', label: 'Обойти изгородь до темноты', when: A22, minutes: 30, activity: 'moderate', terminal: true, goto: 'c22_radio', ambientDuring: dusk22,
        text: 'Изгородь цела. У задней калитки иней на траве примят, но только там, где ты ходил{m:|а} днём. Засов, второй засов, цепь.', effects: [set22('dk', 'gate'), until22(18, 50)] },
      { id: 'c22_dk_lamp', label: 'Заправить лампу и поставить чайник', minutes: 20, terminal: true, goto: 'c22_radio',
        text: 'Керосина осталось на палец. Ты наливаешь половину и ставишь лампу на середину стола, чтобы свет доставал до всех углов. Чайник на плите начинает тихо петь.', effects: [set22('dk', 'lamp'), until22(18, 50)] },
      { id: 'c22_dk_sit', label: 'Посидеть на крыльце, пока совсем не стемнеет', minutes: 20, terminal: true, goto: 'c22_radio', ambientDuring: dusk22,
        text: 'Холод заползает под куртку. Над лесом на западе ещё долго светится узкая жёлтая полоса. Ты сидишь, пока она не гаснет, и только тогда понимаешь, что весь день не садился{m:|ась}.', effects: [set22('dk', 'sit'), { body: 'stress', delta: -2 }, until22(18, 50)] },
    ] }),

  S22({ id: 'c22_radio', for: 'any', chapter: 'ch3', title: 'Семь часов', camp: kitchen14,
    text: [
      { text: 'В семь на кухне включают радио. Батарейки садятся, голос диктора то уплывает, то возвращается.' },
      { text: '«…Bewohner der Landkreise Harburg und Lüneburg werden aufgefordert, ihre Höfe nicht zu verlassen. Die Versorgung erfolgt über die Sammelstellen. Ab Montag…»\n\nЖителей округов Харбург и Люнебург просят не покидать свои дворы. Снабжение — через пункты сбора. С понедельника…' },
      { text: 'Дальше треск. Нина крутит ручку, но ловит только музыку: кто-то в Гамбурге всё ещё ставит пластинки.' },
    ],
    actions: [
      { id: 'c22_rd_music', label: 'Оставить музыку', minutes: 15, terminal: true, goto: 'c22_supper',
        text: 'Играет что-то старое, с трубой. Нина делает громче. Мальте на лавке отбивает такт здоровой ногой и фальшиво подпевает. Никто его не останавливает.', effects: [set22('rd', 'music'), { body: 'stress', delta: -2 }, until22(19, 20)] },
      { id: 'c22_rd_search', label: 'Искать дальше: может, повторят', minutes: 15, terminal: true, goto: 'c22_supper',
        text: 'Через десять минут повторяют. «Ab Montag werden mobile Teams die Höfe aufsuchen. Personen, die die Krankheit überstanden haben, melden sich bitte freiwillig».\n\nС понедельника мобильные группы будут объезжать дворы. Лиц, перенёсших болезнь, просят явиться добровольно.\n\nНина выключает радио сама.', effects: [set22('rd', 'search'), w22('radio_monday', true), until22(19, 20)] },
      { id: 'c22_rd_off', label: 'Выключить: батарейки нужнее', minutes: 5, terminal: true, goto: 'c22_supper',
        text: 'Ты щёлкаешь ручкой. В тишине слышно, как на плите шипит вода, убежавшая из кастрюли.', effects: [set22('rd', 'off'), until22(19, 10)] },
    ] }),

  S22({ id: 'c22_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужинают при одной лампе: картошка, капуста, по куску хлеба Кёлер. Мальте ест лёжа и говорит больше всех.' },
      { when: wayHide, text: 'Лея сидит с краю, ближе к двери. Ест она медленно и каждый раз, когда за окном что-то стукнет, перестаёт жевать.' },
      { when: not(wayHide), text: 'На табурете у двери, где вчера сидела гостья, никто не сидит. Нина дважды на него посмотрела.' },
      { when: evaHere22, text: 'Эва раскладывает всем поровну и себе — последней.' },
    ],
    actions: [
      { id: 'c22_su_eat', label: 'Поесть со всеми', minutes: 25, terminal: true, goto: 'c22_evening', ...tableOnly,
        text: 'Ты ешь и слушаешь Мальте. Он рассказывает, как в армии чистил картошку на сто человек. Половина слов — ругательства, но смешно.', effects: [set22('su', 'eat'), meal('eat'), until22(20, 0)] },
      { id: 'c22_su_pack', label: 'Отложить порцию на ночь', minutes: 10, terminal: true, goto: 'c22_evening', ...tableOnly,
        text: 'Ты накрываешь тарелку другой тарелкой и ставишь на холодный подоконник.', effects: [set22('su', 'pack'), meal('pack'), until22(19, 50)] },
      { id: 'c22_su_tea', label: 'Только чай', minutes: 15, terminal: true, goto: 'c22_evening',
        text: 'Ты пьёшь чай и смотришь, как остальные едят. Есть не хочется. Хочется, чтобы этот день уже кончился.', effects: [set22('su', 'tea'), { body: 'thirst', delta: -10 }, until22(19, 50)] },
    ] }),

  S22({ id: 'c22_evening', for: 'any', chapter: 'ch3', title: 'Вдвоём', camp: house14,
    text: [
      { text: 'Около девяти дом затихает. Вы сидите наверху, на краю кровати. За стеной ворочается Нина.' },
      { when: A22, text: 'Ты весь день {m:был|была} при патруле, при бумагах, при Мальте. Того, что ты сегодня {m:узнал|узнала}, {B} не знает.' },
      { when: B22, text: 'Ты весь день {m:провёл|провела} с Леей. Или с тем, что она после себя оставила. Того, что ты сегодня {m:узнал|узнала}, {A} не знает.' },
      { when: all(A22, flag('$.c22_a_truth')), text: 'Ни одного выздоровевшего. И колонн больше не будет.' },
      { when: all(B22, flag('$.c22_b_truth')), text: 'Она не болела. Её кровь никого не лечит.' },
    ],
    actions: [
      { id: 'c22_ev_all', label: 'Рассказать всё, с начала', minutes: 30, terminal: true, goto: 'c22_checkpoint',
        text: 'Ты рассказываешь всё, по порядку, как было, и не смягчаешь. {partner} слушает молча. В конце {pm:он|она} долго смотрит в стену, потом берёт тебя за руку.', effects: [set22('share', 'all'), { body: 'stress', delta: -3 }, finish, until22(21, 0)] },
      { id: 'c22_ev_main', label: 'Рассказать только главное', minutes: 15, terminal: true, goto: 'c22_checkpoint',
        text: 'Ты говоришь одну фразу. Без подробностей и без того, откуда знаешь. {partner} ждёт продолжения. Продолжения нет.', effects: [set22('share', 'main'), finish, until22(21, 0)] },
      { id: 'c22_ev_keep', label: 'Оставить пока при себе', minutes: 15, terminal: true, goto: 'c22_checkpoint',
        text: 'Ты говоришь про кур, про ужин, про то, что завтра воскресенье. {partner} кивает. По глазам видно: {pm:он|она} понимает, что ты чего-то не говоришь.', effects: [set22('share', 'keep'), { body: 'stress', delta: 2 }, finish, until22(21, 0)] },
    ] }),

  S22({ id: 'c22_checkpoint', for: 'any', chapter: 'ch3', title: 'Суббота, девять вечера', checkpoint: 22, universal: false, camp: house14,
    text: [{ text: 'Девять вечера. Лампа на столе прикручена до синего огонька. Завтра утром кому-то из вас говорить с Тобиасом, а кому-то писать в Люнебург. Решать будете друг за друга.' }], actions: [] }),
];
