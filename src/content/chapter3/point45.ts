import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc } from './point19';
import { felixAround44, henrike44, julian44, merle44, nilsHelped } from './point44';

// Участок 45 «Двадцать третье»: ср 23.12, 05:45 → КТ45 чт 24.12, 17:00 (сочельник, сумерки). Порознь на всю точку.
// Причина ясна обоим с вечера: Лукас привёз записку. Нильс просит {A} вторым на два дня — рождественские посылки по деревням
// у Эльбы (Эльбмарш), ночёвка в пожарной части Драге. Винзенский пункт просит медсестру с хутора на два дня: грипп в спортзале,
// две сестры слегли (при Мерле и колонне — заодно подтвердить её место до 24-го). Линии независимы по расчёту; встречаются у калитки
// в 16:30 четверга. КТ45: работа с Нильсом с января (`c3_new_nils45`) и позвать ли его на сочельник (`c3_new_guest45`).
export const P45: Cond = all({ cp: 44 }, not({ cp: 45 }));
export const A45: Cond = { me: 'A' };
export const farm45 = 'hof_luedemann';
export const jest45 = 'c16_jesteburg';
export const winsen45 = 'c15_winsen';
export const marsch45 = 'c45_marsch';
export const drage45 = 'c45_drage';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played44: Cond = any(flag('A.c44_finished'), flag('B.c44_finished'));
const base45: Cond = all(P45, played44, { at: farm45 }, { partnerAt: farm45 }, up, { partner: 'active' });
export const point45Available: Cond = base45;

export const henrike45 = henrike44;
export const merle45 = merle44;
export const julian45 = julian44;
export const felix45 = felixAround44;
export const nilsFriend45: Cond = nilsHelped;
export const nilsPassed45: Cond = v('A.city_crash', 'passed');
/** Мерле едет 28-го в Гамбург и {B} с ней (КТ43 + подпись в 44-й). */
export const hamburg45: Cond = all(merle44, flag('w.c44_hamburg_trip'));
/** Мерле остаётся на хуторе (ветеринарный инсулин). */
export const merleHome45: Cond = all(merle44, not(hamburg45));
export const job45 = (x: string): Cond => v('w.c43_job', x);
export const own45 = (key: string, value: string): Cond => v(`$.c45_${key}`, value);

export const wed45 = { tempC: -6, outdoor: true, wet: false };
export const thu45 = { tempC: -3, outdoor: true, wet: false };
export const cab45 = { tempC: 12, outdoor: false, wet: false };
export const hall45 = { tempC: 15, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm45, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S45 = wrap(P45);
export const set45 = (key: string, value: string | boolean): Effect => ({ set: `$.c45_${key}`, value });
export const w45 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c45_${key}`, value });
export const until45 = (d: 53 | 54, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare45: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed45 = (n = 30): Effect[] => [{ body: 'hunger', delta: -n }, { body: 'thirst', delta: -25 }];
/** Выезд и ночёвка вне хутора: без общего стола, сон — только где сказано. */
export const trip45 = (where: string, rest: false | 'sleep' = false) => ({ at: where, stock: 'c3_farm_stock', rest });
const finish: Effect = { set: '$.c45_finished', value: true };
const split = [{ id: 'a', when: A45, goto: 'c45_a_truck' }, { id: 'b', goto: 'c45_b_road' }];

export const shared45: Scene[] = [
  S45({ id: 'c45_dawn', for: 'any', chapter: 'ch3', title: 'Двадцать третье', camp: kitchen14,
    text: [
      { text: 'Без четверти шесть. В кухне горит одна лампа. На столе записка, которую вчера в десятом часу привёз Лукас, придавленная солонкой.' },
      { text: '«Nils fragt nach {A}. Elbmarsch, Pakete, zwei Tage. Abholung 6:30 am Hof.» И ниже другим почерком: «Grippe in der Schule, zwei Schwestern liegen. Wir brauchen die Schwester vom Lüdemann-Hof, Mittwoch und Donnerstag. Bus 7:00 ab Feuerwache. — W.»\n\nНильс просит {A.acc}: Эльбмарш, посылки, два дня, заберёт в 6:30 у хутора. Грипп в школе, две сестры слегли. Нужна медсестра с хутора Людеманов, среда и четверг. Автобус в 7:00 от пожарной части.' },
      { when: henrike45, text: 'Хенрике уже у плиты. Она говорит, не оборачиваясь: «Zum Heiligabend seid ihr zurück. Sonst gibt es keinen». К сочельнику вернётесь. Иначе его не будет.' },
      { when: hamburg45, text: 'Мерле сидит у печи, листок с подписью сложен вдвое. Место в колонне держат до двадцать четвёртого. Отвезти листок в Винзен — сегодня.' },
    ],
    actions: [
      { id: 'c45_dw_tea', label: 'Выпить чаю вдвоём, пока все спят', minutes: 30, terminal: true, outcomes: split,
        text: 'Две кружки, хлеб с салом. Вы едите стоя у плиты и почти не говорите. Потом {partner} ставит кружку и говорит: «До завтра». Как будто это недалеко.', effects: [set45('dw', 'tea'), { body: 'hunger', delta: -20 }, { body: 'thirst', delta: -20 }, until45(53, 6, 20)] },
      { id: 'c45_dw_sign', label: 'Договориться о знаке: кто вернётся первым, зажжёт свечу в окне', minutes: 30, terminal: true, outcomes: split,
        text: 'Свеча в кухонном окне, со стороны дороги. Кто вернётся первым, тот и зажжёт. {partner} кивает и кладёт огарок на подоконник, чтобы не искать.', effects: [set45('dw', 'sign'), w45('candle_sign', true), { body: 'hunger', delta: -10 }, until45(53, 6, 20)] },
      { id: 'c45_dw_scarf', label: 'Отдать {partner.dat} свой шарф: там, куда {pm:он|она} едет, холоднее', minutes: 30, terminal: true, outcomes: split,
        text: 'Шарф ещё тёплый. {partner} заматывает его два раза и ничего не говорит. Потом всё-таки говорит: «Пахнет тобой». И уходит собирать сумку.', effects: [set45('dw', 'scarf'), { body: 'hunger', delta: -10 }, until45(53, 6, 20)] },
      { id: 'c45_dw_henrike', label: 'Спросить Хенрике, что успеть к сочельнику без вас', when: henrike45, minutes: 30, terminal: true, outcomes: split,
        text: 'Хенрике перечисляет: курица, ёлка в комнате, свечи, стол. «Das schaffen wir. Ihr bringt nur euch selbst mit». Это мы успеем. Вы привезите только себя. И суёт тебе в карман два сухаря.', effects: [set45('dw', 'henrike'), npc('henrike', 1), { body: 'hunger', delta: -15 }, until45(53, 6, 20)] },
    ] }),

  S45({ id: 'c45_meet', for: 'any', chapter: 'ch3', title: 'Сочельник', camp: yard14, ambient: thu45,
    text: [
      { text: 'Половина пятого. Сумерки синие, снег скрипит. Из трубы дым, в кухне свет. Двадцать четвёртое декабря.' },
      { when: flag('w.c45_candle_sign'), text: 'В кухонном окне горит свеча. Огарок на подоконнике, как договаривались.' },
      { text: 'У калитки вы видите друг друга одновременно. Два дня, две дороги. Рассказывать — потом. Сейчас — просто постоять.' },
      { when: julian45, text: 'Юлиан машет из курятника и делает вид, что не смотрит.' },
    ],
    actions: [
      { id: 'c45_mt_hug', label: 'Обнять {partner.acc} прямо у калитки', minutes: 30, terminal: true, goto: 'c45_checkpoint', ambientDuring: thu45,
        text: 'Куртки холодные, щёки холодные. Вы стоите, пока из дома не стучат в окно: заходите, суп остынет.', effects: [set45('mt', 'hug'), { body: 'stress', delta: -6 }, finish, until45(54, 17, 0)] },
      { id: 'c45_mt_one', label: 'Спросить одно: «Всё хорошо?»', minutes: 30, terminal: true, goto: 'c45_checkpoint', ambientDuring: thu45,
        text: '{partner} думает секунду дольше, чем нужно. Потом кивает: «Расскажу». Вы идёте к дому рядом, плечом к плечу.', effects: [set45('mt', 'one'), { body: 'stress', delta: -4 }, finish, until45(54, 17, 0)] },
      { id: 'c45_mt_wash', label: 'Сначала умыться горячей водой: два дня дороги на лице', minutes: 30, terminal: true, goto: 'c45_checkpoint',
        text: 'Таз, горячая вода из чайника, кусок мыла. Ты смываешь с лица два дня. В зеркале — ты, только старше на два дня.', effects: [set45('mt', 'wash'), { body: 'stress', delta: -3 }, finish, until45(54, 17, 0)] },
      { id: 'c45_mt_felix', label: 'Позвать Феликса помочь занести вещи', when: felix45, minutes: 30, terminal: true, goto: 'c45_checkpoint', ambientDuring: thu45,
        text: 'Феликс выходит в одной рубашке и уносит сумки, не спрашивая. На пороге оборачивается: «Frohe Weihnachten». Счастливого Рождества. Говорит это первым в доме.', effects: [set45('mt', 'felix'), finish, until45(54, 17, 0)] },
    ] }),

  S45({ id: 'c45_checkpoint', for: 'any', chapter: 'ch3', title: 'Сочельник', checkpoint: 45, universal: false, camp: kitchen14,
    text: [{ text: 'Пять часов. Сочельник начинается.' }], actions: [] }),
];
