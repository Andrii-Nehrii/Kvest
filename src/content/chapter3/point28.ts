import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';

// Участок 28: пятница 27.11, 05:30 → КТ28 20:00. Передышка, чистый сюжет. План — STOCK_PLAN.md §9.
// Ночью Тим умер (на хуторе или в колонии) или его увезли обратно (ward). Патруль в шесть. В полдень возвращается Хенрике.
export const P28: Cond = all({ cp: 27 }, not({ cp: 28 }));
export const A28: Cond = { me: 'A' };
export const B28: Cond = { me: 'B' };
export const farm28 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point28Available: Cond = all(P28, { at: farm28 }, up, flag('w.c27_tim'), flag('w.c27_patrol'));
const tim = (x: string): Cond => v('w.c27_tim', x);
export const timFarm = tim('farm');
export const timColony = tim('colony');
export const timWard = tim('ward');
/** Тим умер здесь, этой ночью: на хуторе или в колонии. */
export const timDied = any(timFarm, timColony);
const patrol = (x: string): Cond => v('w.c27_patrol', x);
export const patrolTruth = patrol('truth');
export const patrolNone = patrol('none');
export const patrolTobias = patrol('tobias');
export const hostile28: Cond = v('w.c26_brandt', 'hostile');
/** Вторая ложь при враждебном Брандте — дом вычеркнут из списка; правда при враждебном или ложь при прочих — полпайка. */
export const offList: Cond = all(timDied, patrolNone, hostile28);
export const halfList: Cond = all(timDied, not(offList), any(all(patrolTruth, hostile28), patrolNone));
export const vanHidden: Cond = v('w.c27_van', 'hidden');
/** Весселя снимают с фургона, если патруль находит фургон: сказали правду или соврали при враждебном Брандте. */
export const wesselFired: Cond = all(vanHidden, any(patrolTruth, all(patrolNone, hostile28)));
export const oleDead: Cond = flag('w.c27_ole_last');
export const oleWasHome: Cond = flag('w.c26_ole_home');
export const henrikeWasHome: Cond = any(oleWasHome, { npc: 'henrike', alive: true, at: farm28 });
export const flare28: Cond = flag('w.c27_tobias_flare');

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm28, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S28 = wrap(P28);
export const set28 = (key: string, value: string | boolean): Effect => ({ set: `$.c28_${key}`, value });
export const w28 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c28_${key}`, value });
export const until28 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(27, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare28: Effect = { camp: { kind: 'prepare', quiet: true } };
export const snow28 = { tempC: -5, outdoor: true, wet: false };
/** Итоги ночи и утра — одинаково на обеих линиях. */
export const nightFacts: Effect[] = [
  { if: timDied, then: [w28('tim', 'dead'), { if: { npc: 'c27_tim', alive: true }, then: [{ npc: 'c27_tim', alive: false }] }] },
  { if: timWard, then: [w28('tim', 'ward'), { if: { npc: 'c27_tim', alive: true }, then: [{ npc: 'c27_tim', moveTo: 'c18_lueneburg' }] }, { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', moveTo: 'c18_lueneburg' }] }] },
  { if: offList, then: [w28('list', 'off'), { set: 'w.c24_ration', value: 'half' }] },
  { if: halfList, then: [w28('list', 'half'), { set: 'w.c24_ration', value: 'half' }] },
  { if: wesselFired, then: [w28('wessel', 'fired')] },
  { if: oleDead, then: [w28('ole', 'dead'), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', alive: false }] }], else: [w28('ole', 'home'), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', moveTo: farm28 }] }] },
  { if: { npc: 'henrike', alive: true }, then: [{ npc: 'henrike', moveTo: farm28 }] },
];
const finish: Effect = { set: '$.c28_finished', value: true };

export const shared28: Scene[] = [
  S28({ id: 'c28_burial', for: 'any', chapter: 'ch3', title: 'Под грушей', camp: yard14, ambient: snow28,
    text: [
      { when: timFarm, text: 'Могилу копают под грушей, рядом с холмиком, обложенным камнями. Земля мёрзлая на две ладони. {A} и Вессель бьют её ломом по очереди. Нина стоит у крыльца с Леиной кружкой в руках.' },
      { when: timColony, text: 'Могилу копают у насыпи, рядом с Каем, под той же ольхой. Уте сама показывает место. Яннес молча берёт вторую лопату.' },
      { text: 'Кася несёт Тима сама, завёрнутого в одеяло Уве или в простыню Хенрике. Не даёт никому. Опускает тоже сама, встав на колени на край.' },
      { when: { has: 'c27_photo' }, text: 'Фотография дома в Бармбеке у {B.gen} в кармане. На ней Тим, маленький, на нижней ступеньке.' },
    ],
    actions: [
      { id: 'c28_bu_say', label: 'Сказать несколько слов', minutes: 40, terminal: true, outcomes: [{ id: 'a', when: A28, goto: 'c28_a_wessel' }, { id: 'b', goto: 'c28_b_kasia' }], ambientDuring: snow28,
        text: 'Ты говоришь коротко. Что не знал{m:|а} его долго. Что он смеялся над ежом, который нашёл шапку на голове у совы. Что он спрашивал, тепло ли Пану Кульке. Кася стоит рядом и держит тебя за рукав.', effects: [set28('bu', 'say'), npc('kasia', 2), until28(9, 40)] },
      { id: 'c28_bu_harm', label: 'Положить ему гармошку', when: flag('w.c27_box'), minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A28, goto: 'c28_a_wessel' }, { id: 'b', goto: 'c28_b_kasia' }], ambientDuring: snow28,
        text: 'Кася кивает. Гармошка ложится ему на грудь, синяя, облезлая. Земля падает на неё с глухим звуком. Ты будешь помнить этот звук.', effects: [set28('bu', 'harm'), until28(9, 30)] },
      { id: 'c28_bu_quiet', label: 'Стоять молча', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A28, goto: 'c28_a_wessel' }, { id: 'b', goto: 'c28_b_kasia' }], ambientDuring: snow28,
        text: 'Никто ничего не говорит. Только лопаты, только снег. Уте в конце крестит холмик, по-старому, три раза.', effects: [set28('bu', 'quiet'), until28(9, 30)] },
    ] }),

  S28({ id: 'c28_henrike', for: 'any', chapter: 'ch3', title: 'Хенрике', camp: yard14, ambient: snow28,
    text: [
      { when: all(not(henrikeWasHome), not(oleDead)), text: 'В полдень у ворот армейский грузовик. Из кабины выходит Хенрике. Потом, медленно, держась за дверцу, Оле. Серый, худой, в куртке, которая висит на нём, как на вешалке. От ворот до крыльца он идёт сам. Хенрике не помогает: идёт рядом и смотрит, как будто готова поймать.' },
      { when: oleDead, text: 'В полдень у ворот армейский грузовик. Из кабины выходит Хенрике. Одна. В руках у неё вязаная шапка Оле и тетрадь в клеёнчатой обложке.\n\nОна проходит мимо вас к крыльцу. На крыльце останавливается.\n\n— Donnerstag. Zum letzten Mal, hat er gesagt. Für die Kleine am Fenster. Er ist nicht mehr aufgewacht.\n\nВ четверг. В последний раз, сказал он. Для малышки у окна. Он больше не проснулся.' },
      { when: henrikeWasHome, text: 'Хенрике дома с среды. Сегодня, после похорон, она в первый раз обходит дом целиком. Медленно. Молча.' },
      { text: 'Она идёт по дому, как по чужому. Чужие куртки на гвоздях в сенях. Валенки не по размеру. Пустые насесты: кур меньше. Коптильня. Подвал, ящики «Saat». Половица в швейной. Её кухонные часы, которые отстают на четыре минуты.' },
    ],
    actions: [
      { id: 'c28_he_follow', label: 'Идти за ней и отвечать на каждый взгляд', minutes: 50, terminal: true, outcomes: [{ id: 'a', when: A28, goto: 'c28_a_ole' }, { id: 'b', goto: 'c28_b_henrike' }],
        text: 'Ты идёшь за ней. У каждой двери она останавливается, и ты объясняешь. Чьи куртки. Куда делись куры. Кто спал на лавке у печи. Она слушает, кивает и идёт дальше. Ни разу не перебивает.', effects: [set28('he', 'follow'), npc('henrike', 2), until28(13, 0)] },
      { id: 'c28_he_leave', label: 'Оставить её одну: это её дом', minutes: 40, terminal: true, outcomes: [{ id: 'a', when: A28, goto: 'c28_a_ole' }, { id: 'b', goto: 'c28_b_henrike' }],
        text: 'Ты уходишь на кухню. Сверху слышно, как она ходит по комнатам. Останавливается. Снова ходит. Долго стоит в комнате Оле.', effects: [set28('he', 'leave'), npc('henrike', 1), until28(12, 50)] },
    ] }),

  S28({ id: 'c28_supper', for: 'any', chapter: 'ch3', title: 'Поминальный стол', camp: kitchen14,
    text: [
      { text: 'В шесть Хенрике садится во главе стола. На своё место. Его все эти дни никто не занимал: Нина следила.' },
      { when: oleDead, text: 'Рядом с ней пустой стул. На нём шапка Оле.' },
      { when: not(oleDead), text: 'Рядом с ней Оле. Ест мало, медленно. Каждый раз, когда он берёт ложку, Хенрике перестаёт есть сама.' },
      { when: timDied, text: 'Кася сидит в конце стола. Ест, потому что Эва поставила перед ней тарелку и не уходит, пока она не возьмёт ложку.' },
      { text: 'Хенрике поднимает рюмку с корном. Одну на всех, по кругу.\n\n— Für die, die nicht mehr da sind. Und für die, die noch da sind. Das ist schwerer.\n\nЗа тех, кого больше нет. И за тех, кто ещё есть. Это труднее.' },
    ],
    actions: [
      { id: 'c28_su_eat', label: 'Выпить, когда до тебя дойдёт рюмка, и поесть', minutes: 40, terminal: true, goto: 'c28_evening', ...tableOnly,
        text: 'Корн обжигает. Ты передаёшь рюмку дальше. Картошка, солонина, если есть, капуста. За столом говорят тихо, про тех, кого нет. По очереди. Каждый — одну историю.', effects: [set28('su', 'eat'), meal('eat'), until28(19, 0)] },
      { id: 'c28_su_story', label: 'Рассказать свою историю про тех, кого нет', minutes: 40, terminal: true, goto: 'c28_evening', ...tableOnly,
        text: 'Ты рассказываешь, когда доходит очередь. Коротко. Хенрике слушает, не поднимая глаз. Когда ты заканчиваешь, она кивает: так кивают, когда история рассказана правильно.', effects: [set28('su', 'story'), meal('eat'), npc('henrike', 2), until28(19, 10)] },
      { id: 'c28_su_tea', label: 'Только чай', minutes: 20, terminal: true, goto: 'c28_evening',
        text: 'Ты не пьёшь. Ты держишь рюмку и передаёшь дальше. Хенрике видит и ничего не говорит.', effects: [set28('su', 'tea'), until28(18, 50)] },
    ] }),

  S28({ id: 'c28_evening', for: 'any', chapter: 'ch3', title: 'Хенрике спрашивает', camp: house14,
    text: [
      { text: 'Когда стол убран, Хенрике остаётся сидеть. Зовёт вас двоих.' },
      { text: '— Ihr habt den Hof gehalten. Das sage ich einmal. — Она смотрит на свои руки. — Jetzt bin ich wieder da. Und ich frage euch: wie soll es weitergehen? Ich entscheide. Aber ich frage.\n\nВы удержали хутор. Говорю это один раз. Теперь я снова здесь. И я спрашиваю вас: как будет дальше? Решать буду я. Но я спрашиваю.' },
    ],
    actions: [
      { id: 'c28_ev_think', label: 'Попросить ночь подумать', minutes: 20, terminal: true, goto: 'c28_checkpoint',
        text: '— Bis morgen früh, — говорит Хенрике. До утра. — Länger warte ich nicht. Ich bin alt.\n\nДольше не жду. Я старая.', effects: [set28('ev', 'think'), finish, until28(20, 0)] },
      { id: 'c28_ev_thank', label: 'Сказать: спасибо, что спрашиваете', minutes: 20, terminal: true, goto: 'c28_checkpoint',
        text: 'Хенрике смотрит на тебя поверх очков.\n\n— Ich habe es von Werner gelernt. Er hat immer gefragt. Und dann hat er gemacht, was er wollte.\n\nЯ научилась у Вернера. Он всегда спрашивал. А потом делал, как хотел.\n\nОна почти улыбается.', effects: [set28('ev', 'thank'), npc('henrike', 1), finish, until28(20, 0)] },
    ] }),

  S28({ id: 'c28_checkpoint', for: 'any', chapter: 'ch3', title: 'Пятница, восемь вечера', checkpoint: 28, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Хенрике ждёт ответа. Кем вы будете в этом доме до весны. И кого из нынешних жильцов попросите оставить.' }], actions: [] }),
];
