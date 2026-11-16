import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { wayHide } from './point22';

// Участок 24: понедельник 23.11, 06:00 → КТ24 19:30. План — docs/hidden/STOCK_PLAN.md §9 (потеря-эхо жребий не дал: последствия — только
// прямые итоги обхода). Мелкое по жребию — запертая находка A (шкаф Оле, подсказка — фото в ужине 23-й).
// Обход Брандта виден обеим линиям одинаково: всё, что он находит, считается из базы КТ23; вещи меняются только на линии A.
export const P24: Cond = all({ cp: 23 }, not({ cp: 24 }));
export const A24: Cond = { me: 'A' };
export const B24: Cond = { me: 'B' };
export const farm24 = 'hof_luedemann';
const mon = (x: string): Cond => v('w.c23_monday', x);
export const monOpen = mon('open');
export const monHide = mon('hide');
export const monShut = mon('shut');
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point24Available: Cond = all(P24, { at: farm24 }, up, flag('w.c23_monday'));
/** Канистра Керема при доме (у A в руках или в подвале), а не закопана в поле и не слита в бак. */
export const canHome: Cond = all(any(flag('w.c22_fuel_traded'), flag('w.c22_fuel_debt')), not(v('w.c23_fuel_spot', 'field')), not(v('w.c23_fuel_spot', 'tank')));
export const gunHome: Cond = any(flag('w.c19_gun'), flag('w.c19_gun_declared'));
/** Канистру находят: открыли сами, или прятали в подвале (собака чует бензин), или не прятали вовсе. */
export const fuelTaken: Cond = all(canHome, not(monShut), any(monOpen, v('w.c23_fuel_spot', 'cellar'), not(flag('w.c23_fuel_spot'))));
/** Ружьё: открыли — на учёт; спрятали под пол — не нашли; висит на гвозде — сдали; не прятали — нашли и забрали. */
export const gunListed: Cond = all(gunHome, monOpen);
export const gunHanded: Cond = all(gunHome, monHide, v('w.c23_gun_spot', 'hand'));
export const gunFound: Cond = all(gunHome, monHide, not(flag('w.c23_gun_spot')));
export const gunHidden: Cond = all(gunHome, monHide, v('w.c23_gun_spot', 'floor'));
/** Лея: в нише подвала её не находят; в остальных местах собака лает, и она выходит сама. */
export const leaFound: Cond = all(wayHide, not(monShut), any(monOpen, not(v('w.c22_hide', 'cellar'))));
export const sanderVouch: Cond = any(flag('w.c22_bag_sander'), flag('w.c22_b_helped_point'), flag('w.c19_doc_trust'), v('w.c22_lea_at', 'sander'));
const guests = (x: string): Cond => v('w.c23_guests', x);
export const marcusListed: Cond = all({ npc: 'c12_marcus', alive: true }, guests('in'), not(monShut));
export const marcusTaken: Cond = all({ npc: 'c12_marcus', alive: true }, guests('shed'), not(monShut));
export const halfRation: Cond = any(monShut, all(gunFound, flag('w.c19_gun_lie')));

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm24, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S24 = wrap(P24);
export const set24 = (key: string, value: string | boolean): Effect => ({ set: `$.c24_${key}`, value });
export const w24 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c24_${key}`, value });
export const until24 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(23, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare24: Effect = { camp: { kind: 'prepare', quiet: true } };
export const snow24 = { tempC: -1, outdoor: true, wet: false };
const brandt = (trust: number, remember?: string): Effect => ({ if: { npc: 'c16_brandt', alive: true }, then: [{ npc: 'c16_brandt', trust, ...(remember ? { remember } : {}) }] });
const finish: Effect = { set: '$.c24_finished', value: true };

/** Итог обхода: люди — на обеих линиях одинаково (переменные мира и перемещения), вещи — только у A. */
const gatePeople: Effect[] = [
  { introduceNpc: 'c16_brandt' }, { set: '$.met.c16_brandt', value: true },
  { if: leaFound, then: [{ if: sanderVouch, then: [w24('lea', 'sander')], else: [w24('lea', 'brandt')] }, { if: { npc: 'c21_lea', alive: true }, then: [{ npc: 'c21_lea', moveTo: 'c16_jesteburg' }] }] },
  { if: marcusTaken, then: [w24('marcus', 'taken'), { npc: 'c12_marcus', moveTo: 'c16_jesteburg' }, { if: { npc: 'c12_leo', alive: true }, then: [{ npc: 'c12_leo', moveTo: farm24 }] }] },
  { if: marcusListed, then: [w24('marcus', 'listed')] },
  { if: halfRation, then: [w24('ration', 'half')] },
  { if: monShut, then: [w24('refused', true)] },
];
const plasmaLeft = (fx: (qty: number) => Effect[]): Effect => ({ if: { v: 'w.c21_plasma_used', op: '==', value: 2 }, then: fx(2),
  else: [{ if: { v: 'w.c21_plasma_used', op: '==', value: 1 }, then: fx(3), else: fx(4) }] });
const gateThings: Effect = { if: A24, then: [
  { if: fuelTaken, then: [{ take: 'can_petrol_10' }, w24('fuel_taken', true)] },
  { if: any(gunHanded, gunFound), then: [{ take: 'c19_flinte' }, { if: { stocked: 'c19_flinte', qty: 1, at: 'c3_farm_stock' }, then: [{ unstock: 'c19_flinte', qty: 1, at: 'c3_farm_stock' }] }] },
  { if: gunFound, then: [w24('gun', 'found')] }, { if: gunHanded, then: [w24('gun', 'handed')] }, { if: gunListed, then: [w24('gun', 'listed')] },
  { if: all(leaFound, v('w.c21_bag', 'wait')), then: [plasmaLeft((qty) => [{ unstock: 'c21_plasma', qty, at: 'c3_farm_stock' }]), w24('plasma_taken', true)] },
] };
export const gateFx: Effect[] = [...gatePeople, gateThings];

export const graveDay: Cond = all(flag('w.c23_grave_dug'), { npc: 'c14_ute', alive: true });
/** Кто идёт к насыпи: A — если не отказал Яннесу в 23-й, B — если обещала Уте прийти спеть или сказать слова. */
export const graveGo: Cond = all(graveDay, any(all(A24, not(v('w.c23_kai', 'alone'))), all(B24, any(v('$.c23_bt', 'yes'), v('$.c23_bt', 'words')))));

export const shared24: Scene[] = [
  S24({ id: 'c24_morning', for: 'any', chapter: 'ch3', title: 'Понедельник', camp: yard14, ambient: snow24,
    text: [
      { text: 'Шесть утра. Темно. Снег за ночь подсыпал, свежий, по щиколотку.' },
      { when: { npc: 'c14_ute', alive: true }, text: 'У насыпи, далеко, мелькает фонарь. Уте и Яннес переносят Кая сами, вдвоём.' },
      { text: 'В десять придёт Брандт. До десяти — дом.' },
    ],
    actions: [
      { id: 'c24_mo_pit', label: 'Пойти к яме: Уте и Яннес там одни', when: graveDay, minutes: 15, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_pit' }, { id: 'b', goto: 'c24_grave' }], ambientDuring: snow24,
        text: 'Ты одеваешься в темноте и идёшь на свет фонаря, через поле, по снегу. Уте видит тебя первой и ничего не говорит. Только кивает.', effects: [set24('mo', 'pit'), until24(6, 15)] },
      { id: 'c24_mo_stove', label: 'Растопить печь и поставить воду', minutes: 30, terminal: true, goto: 'c24_malte',
        text: 'Печь разгорается неохотно: дрова отсырели в поленнице под снегом. К семи на кухне тепло, на плите булькает каша.', effects: [set24('mo', 'stove'), until24(7, 30)] },
      { id: 'c24_mo_snow', label: 'Расчистить двор от снега', minutes: 40, activity: 'moderate', terminal: true, goto: 'c24_malte', ambientDuring: snow24,
        text: 'Лопата скребёт по брусчатке. От крыльца к воротам, к колодцу, к курятнику. Когда ты заканчиваешь, становится светло.', effects: [set24('mo', 'snow'), until24(7, 40)] },
      { id: 'c24_mo_sleep', label: 'Полежать ещё час', minutes: 5, terminal: true, goto: 'c24_malte',
        text: 'Ты лежишь с закрытыми глазами и слушаешь, как внизу Нина гремит кастрюлями. Час проходит как пять минут.', effects: [set24('mo', 'sleep'), until24(7, 30, true)] },
    ] }),

  S24({ id: 'c24_grave', for: 'any', chapter: 'ch3', title: 'Шесть утра', location: 'c15_garden', camp: { at: 'c15_garden', stock: 'c3_farm_stock', rest: false }, safe: false, ambient: snow24,
    text: [
      { when: B24, text: 'Ещё темно. У ямы за теплицей горит один фонарь. Яннес и Уте уже здесь. Уте стоит в стороне, спиной к яме, и смотрит на насыпь.' },
      { when: all(A24, v('w.c23_kai', 'tractor')), text: 'Брезент с Каем лежит в тележке. Ты ведёшь трактор к насыпи шагом, Яннес идёт рядом и держит край, чтобы не сползло.' },
      { when: all(A24, not(v('w.c23_kai', 'tractor'))), text: 'Вы с Яннесом несёте Кая к насыпи на брезенте. Он лёгкий. Яннес идёт впереди и ни разу не оступается.' },
      { when: all(B24, not(v('w.c23_kai', 'alone'))), text: 'Ты стоишь рядом с Уте. Она держит тебя за руку так крепко, что немеют пальцы. За спиной у ямы шорох брезента, короткая ругань {A.gen}, потом глухой удар. Ты не оборачиваешься. Уте тоже.' },
      { when: all(B24, v('w.c23_kai', 'alone')), text: 'Ты стоишь рядом с Уте. Она держит тебя за руку так крепко, что немеют пальцы. За спиной шорох брезента и тяжёлое дыхание Яннеса: он поднимает брата один.' },
      { text: 'Могила под ольхой. Снег вокруг неё утоптан. Уте кладёт на край вязаную шапку с помпоном.' },
      { text: 'Снег на лопатах липкий, тяжёлый. Над колонией стоит тишина, только где-то за насыпью каркает ворона, и её слышно далеко-далеко.' },
    ],
    actions: [
      { id: 'c24_gr_sing', label: 'Спеть, что помнишь', when: B24, minutes: 30, terminal: true, goto: 'c24_malte', ambientDuring: snow24,
        text: 'Ты поёшь первое, что приходит: колыбельную, которую пела тебе мама, по-русски. Голос срывается на второй строчке. Ты допеваешь. Уте не понимает ни слова. Она плачет и кивает в такт.', effects: [set24('gr', 'sing'), w24('kai_sung', true), npc('c14_ute', 3, 'c24_sang_for_kai'), until24(7, 30)] },
      { id: 'c24_gr_words', label: 'Сказать несколько слов', when: B24, minutes: 25, terminal: true, goto: 'c24_malte', ambientDuring: snow24,
        text: 'Ты говоришь по-немецки, медленно, простыми словами: что не знала Кая, но знаешь его мать и брата, и что этого достаточно, чтобы знать, каким он был. Уте повторяет за тобой последнюю фразу, шёпотом.', effects: [set24('gr', 'words'), npc('c14_ute', 2), until24(7, 25)] },
      { id: 'c24_gr_fill', label: 'Засыпать могилу вместе с Яннесом', when: A24, minutes: 30, activity: 'heavy', terminal: true, goto: 'c24_malte', ambientDuring: snow24,
        text: 'Земля мёрзлая сверху и мягкая внутри. Вы засыпаете молча. Яннес ставит в изголовье палку с привязанной к ней жестяной табличкой: «KAI». Буквы выбиты гвоздём.', effects: [set24('gr', 'fill'), { body: 'fatigue', delta: 5 }, npc('c14_jannes', 2), until24(7, 30)] },
      { id: 'c24_gr_ute', label: 'Подойти к Уте', when: A24, minutes: 25, terminal: true, goto: 'c24_malte', ambientDuring: snow24,
        text: 'Уте не оборачивается. Она говорит, глядя на насыпь:\n\n— Danke. Jetzt kann ich wieder schlafen. Glaube ich.\n\nСпасибо. Теперь я снова смогу спать. Думаю.', effects: [set24('gr', 'ute'), npc('c14_ute', 2), until24(7, 25)] },
    ] }),

  S24({ id: 'c24_malte', for: 'any', chapter: 'ch3', title: 'За Мальте', camp: yard14, ambient: snow24, onEnter: [{ if: { npc: 'c21_malte', alive: true }, then: [{ npc: 'c21_malte', moveTo: 'c18_lueneburg' }] }],
    text: [
      { text: 'В восемь у ворот армейский грузовик. Двое солдат с носилками. Фельдфебель Крузе не приехал: прислал бумагу.' },
      { text: 'Мальте выходит сам, на костыле, в куртке, застёгнутой до горла. На крыльце он оборачивается к дому.' },
      { when: A24, text: '— Hohenweg zwölf, — говорит он тебе. Хоэнвег, двенадцать. — Nicht vergessen.\n\nНе забудь.' },
      { when: B24, text: '— Sag der Sanitäterin danke. Wo auch immer sie ist. — Он подмигивает. — Ich hab sie nie gesehen.\n\nСкажи санитарке спасибо. Где бы она ни была. Я её никогда не видел.' },
      { text: 'Мальте одет во всё чужое: куртку Хенрикиного мужа, шапку Оле, Нинины варежки на резинке. Он смеётся над собой и всё равно держится за косяк дольше, чем нужно.' },
    ],
    actions: [
      { id: 'c24_ml_help', label: 'Довести его до грузовика', minutes: 15, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_prep' }, { id: 'b', goto: 'c24_b_prep' }], ambientDuring: snow24,
        text: 'Он опирается на тебя всем весом. У борта солдаты подхватывают его, как мешок. Мальте ругается и смеётся одновременно. Борт закрывается. Он машет из-под брезента костылём.', effects: [set24('ml', 'help'), until24(8, 30)] },
      { id: 'c24_ml_bread', label: 'Сунуть ему в карман хлеб и яблоко', minutes: 10, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_prep' }, { id: 'b', goto: 'c24_b_prep' }],
        text: '— Bestechung, — говорит Мальте. Взятка. — Angenommen.\n\nПринято.\n\nОн уезжает, держа яблоко в руке, как гранату.', effects: [set24('ml', 'bread'), until24(8, 25)] },
      { id: 'c24_ml_wave', label: 'Помахать с крыльца', minutes: 10, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_prep' }, { id: 'b', goto: 'c24_b_prep' }],
        text: 'Грузовик разворачивается в снегу и уезжает к Йестебургу. Мальте не машет в ответ: он уже смотрит вперёд, на дорогу.', effects: [set24('ml', 'wave'), until24(8, 20)] },
    ] }),

  S24({ id: 'c24_gate', for: 'any', chapter: 'ch3', title: 'Брандт у ворот', camp: tense14, safe: false, ambient: snow24,
    text: [
      { text: 'В десять у ворот трактор с прицепом и пожарный «Мерседес». Шестеро дружинников, у двоих ружья, у одного на поводке овчарка. Впереди — Брандт, в каске, с папкой под мышкой.' },
      { when: monShut, text: 'Ворота заперты. Брандт стучит в калитку костяшками, вежливо, три раза.\n\n— Lüdemann-Hof. Brandt. Aufmachen, bitte.\n\nХутор Людеманов. Брандт. Откройте, пожалуйста.' },
      { when: not(monShut), text: 'Ворота открыты. Брандт входит первым, вытирает сапоги о решётку, как в гостях, и открывает папку.' },
      { text: 'Он читает вслух, ровно, не поднимая глаз. Список дома. Кто записан. Что заявлено. Кто был «verwarnt».' },
      { when: all(flag('w.c18_a_held'), A24), text: '«Verwarnt am 18.11.» Это про тебя.' },
      { when: all(flag('w.c18_a_held'), B24), text: '«Verwarnt am 18.11.» Это про {A.acc}.' },
      { when: all(not(monShut), fuelTaken), text: 'Овчарка тянет в сени, к лестнице в подвал. Через минуту дружинник выносит канистру. «Für die Fahrzeuge der Wehr». Для машин дружины. Брандт делает пометку.' },
      { when: all(not(monShut), not(fuelTaken), v('w.c23_fuel_spot', 'tank')), text: 'Брандт заглядывает в бак Corsa фонариком и кивает: «Ein Fahrzeug, ein Tank». Одна машина, один бак. Это не запас. Это машина.' },
      { when: gunListed, text: 'Ружьё вы показываете сами. Брандт записывает номер на стволе. «Bleibt bei euch. Registriert». Остаётся у вас. Записано.' },
      { when: gunHanded, text: 'Ружьё висит на гвозде у двери. Дружинник снимает его, Брандт пишет расписку. Расписку он отдаёт, не глядя.' },
      { when: gunFound, text: 'Дружинник находит ружьё за шкафом. Брандт смотрит на него, потом на вас.\n\n— Am Donnerstag hieß es: keine Waffe im Haus.\n\nВ четверг было сказано: оружия в доме нет.' },
      { when: leaFound, text: 'Овчарка рвётся с поводка и лает. Не на подвал. Туда, где прячется Лея. Прежде чем дружинники успевают двинуться, она выходит сама. Руки на виду.\n\n— Sanitäterin. Von der Kolonne. Ich habe den Fahrer gepflegt.\n\nСанитарка. С колонны. Я ухаживала за шофёром.' },
      { when: all(leaFound, sanderVouch), text: 'Брандт смотрит на неё долго. Потом кивает дружиннику: «Zur Ärztin. Die sucht Hände. Frau Doktor Sander bürgt für Leute vom Lüdemann-Hof».\n\nК врачу. Ей нужны руки. Доктор Зандер ручается за людей с хутора Людеманов.' },
      { when: all(leaFound, not(sanderVouch)), text: 'Брандт смотрит на неё долго. Потом говорит, мягко:\n\n— Sanitäterin. Gut. In der Schule brauchen wir genau so jemanden. Kommen Sie mit.\n\nСанитарка. Хорошо. В школе нам как раз такой человек нужен. Пойдёмте.' },
      { when: marcusTaken, text: 'Овчарка тянет к отдельному сараю. Дружинники выводят Маркуса, руки за голову. Лео за ним, в валенках Хенрике. Брандт смотрит на руку Маркуса, на шрамы.\n\n— Nicht auf der Liste. Und gebissen. Der kommt mit. Zur Beobachtung.\n\nНе в списке. И укушен. Пойдёт с нами. Под наблюдение.' },
      { when: marcusListed, text: 'Маркус показывает руку сам, не дожидаясь. Брандт смотрит на шрамы, на число в его записке: «9 Tage, kein Fieber». Записывает в список. «Gast. Bis Dienstag».' },
      { when: monShut, text: 'Брандт стоит у калитки и ждёт. Потом закрывает папку.\n\n— Wie ihr wollt. Wer nicht aufmacht, steht nicht auf der Liste. Wer nicht auf der Liste steht, bekommt halbe Ration.\n\nКак хотите. Кто не открывает, того нет в списке. Кого нет в списке, тот получает половину пайка.' },
      { when: all(halfRation, not(monShut)), text: '— Gelogen am Donnerstag. Halbe Ration für zwei Wochen.\n\nСоврали в четверг. Половина пайка на две недели.' },
    ],
    actions: [
      { id: 'c24_gt_calm', label: 'Отвечать спокойно, коротко, по пунктам', minutes: 40, terminal: true, goto: 'c24_bus',
        text: 'Ты отвечаешь на каждый вопрос одной фразой. Брандт пишет. Ни разу не повышает голос, ни он, ни ты. В конце он закрывает папку и смотрит на тебя внимательнее, чем до того.\n\n— Ordentlich, — говорит он. Аккуратно.', effects: [set24('gt', 'calm'), ...gateFx, brandt(1), until24(10, 45)] },
      { id: 'c24_gt_argue', label: 'Спросить, по какому праву', minutes: 40, terminal: true, goto: 'c24_bus',
        text: '— Nach dem Recht von dem, der euch Brot gibt, — говорит Брандт. По праву того, кто даёт вам хлеб. — Und nach dem Recht von dem, der nachts mit dem Trecker die Straße abfährt, damit ihr schlafen könnt.\n\nИ по праву того, кто ночью объезжает дорогу на тракторе, чтобы вы могли спать.\n\nОн пишет что-то на полях. Мелко.', effects: [set24('gt', 'argue'), ...gateFx, brandt(-2, 'c24_they_argued'), until24(10, 45)] },
      { id: 'c24_gt_silent', label: 'Молчать и смотреть, что они делают', minutes: 40, terminal: true, goto: 'c24_bus',
        text: 'Ты стоишь у крыльца и смотришь. Дружинники ходят по дому, по сараю, по погребу. Один уносит с собой яблоко из ящика. Брандт этого не видит. Или делает вид.', effects: [set24('gt', 'silent'), ...gateFx, until24(10, 45)] },
    ] }),

  S24({ id: 'c24_bus', for: 'any', chapter: 'ch3', title: 'Автобус', camp: yard14, ambient: snow24,
    text: [
      { text: 'Перед уходом Брандт задерживается у ворот. Достаёт из папки ещё один лист.' },
      { text: '— Der Bus nach Lüneburg steht am Feuerwehrhaus. Für die Genesenen. Freiwillig. Doppelte Ration für die Familie. — Он смотрит на дом. — Wer war bei euch krank?\n\nАвтобус в Люнебург стоит у пожарной части. Для переболевших. Добровольно. Двойной паёк семье. Кто у вас болел?' },
      { when: flag('w.c23_mats_clean'), text: 'Матс у церкви кидал снежки. Брандт собирает кровь для внука, который не болел.' },
      { text: '— Und ab Mittwoch braucht die Schule Hände. Jeder Hof einen Menschen. Wer, entscheidet ihr. Bis heute Abend.\n\nА со среды школе нужны руки. С каждого двора по человеку. Кто — решайте сами. До вечера.' },
    ],
    actions: [
      { id: 'c24_bs_none', label: 'Сказать: у нас никто не болел', minutes: 10, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_after' }, { id: 'b', goto: 'c24_b_village' }],
        text: '— Gut, — говорит Брандт. — Dann seid ihr gesund. Das ist auch was wert.\n\nХорошо. Значит, вы здоровы. Это тоже чего-то стоит.\n\nОн уходит к трактору. Овчарка оглядывается на дом.', effects: [set24('bs', 'none'), until24(11, 0)] },
      { id: 'c24_bs_mats', label: 'Сказать: ваш внук тоже не болел', when: flag('w.c23_mats_clean'), minutes: 15, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_after' }, { id: 'b', goto: 'c24_b_village' }],
        text: 'Брандт останавливается. Медленно поворачивается.\n\n— Wer hat dir das gesagt?\n\nКто тебе это сказал?\n\nТы молчишь. Он долго смотрит на тебя. Потом уходит, не сказав больше ни слова. Шаг у него тяжелее, чем был.', effects: [set24('bs', 'mats'), w24('brandt_told_mats', true), brandt(-1, 'c24_they_know_mats'), until24(11, 0)] },
      { id: 'c24_bs_ask', label: 'Спросить, что делают с переболевшими в Люнебурге', minutes: 15, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_after' }, { id: 'b', goto: 'c24_b_village' }],
        text: '— Blut abnehmen. Zweimal die Woche. Wie beim Roten Kreuz früher. — Брандт пожимает плечами. — Und sie kriegen zu essen. Mehr als hier.\n\nБерут кровь. Дважды в неделю. Как раньше в Красном Кресте. И их кормят. Больше, чем здесь.', effects: [set24('bs', 'ask'), until24(11, 0)] },
    ] }),

  S24({ id: 'c24_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин в шесть. За столом на одного меньше: на лавке у печи, где лежал Мальте, теперь только свёрнутое одеяло.' },
      { when: v('w.c24_lea', 'sander'), text: 'Леи нет: она в пункте у доктора Зандер. Её табурет у двери Нина отодвинула к стене.' },
      { when: v('w.c24_lea', 'brandt'), text: 'Леи нет: её увели в школу Брандта. Нина весь ужин молчит.' },
      { when: v('w.c24_marcus', 'taken'), text: 'Лео сидит рядом с {B.ins} и не ест. Каждые две минуты он смотрит на дверь.' },
      { when: v('w.c24_ration', 'half'), text: 'Порции меньше, чем вчера. Нина режет хлеб тоньше, чем умеет.' },
      { when: v('$.c24_aa', 'tidy'), text: 'В доме снова порядок, будто обыска не было. Только шкаф Оле стоит не на месте: его двигали.' },
      { when: v('$.c24_ad', 'wood'), text: 'Дров в сенях на всю ночь.' },
      { when: v('$.c24_bb', 'sit'), text: 'Ты так и не {m:отогрел|отогрела} руки до конца. Нина ставит тебе кружку с кипятком, просто чтобы держать.' },
      { when: v('$.c24_bk2', 'no'), text: 'Женщина на Кирхвег, которой ты сказал{m:|а} «ничего нет», стояла у калитки до темноты. Тебе это рассказала Кёлер.' },
      { when: v('$.c24_ml', 'bread'), text: 'Мальте, наверное, уже съел хлеб и яблоко. Ты думаешь об этом дольше, чем хотел{m:|а} бы.' },
    ],
    actions: [
      { id: 'c24_su_eat', label: 'Поесть со всеми', minutes: 25, terminal: true, goto: 'c24_evening', ...tableOnly,
        text: 'Ты ешь медленно. Картошка, капуста, по ломтику окорока. Никто не говорит о Брандте. Все думают о нём.', effects: [set24('su', 'eat'), meal('eat'), until24(18, 40)] },
      { id: 'c24_su_give', label: 'Отдать половину своей порции Нине', minutes: 20, terminal: true, goto: 'c24_evening', ...tableOnly,
        text: 'Ты перекладываешь половину своей картошки Нине на тарелку. Она смотрит на тебя, потом на картошку, и ест, не споря. Ей пятнадцать, она растёт.', effects: [set24('su', 'give'), meal('eat'), { body: 'hunger', delta: 10 }, npc('c7_nina', 1), until24(18, 35)] },
      { id: 'c24_su_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c24_evening',
        text: 'Ты пьёшь чай и смотришь на пустую лавку у печи.', effects: [set24('su', 'tea'), until24(18, 30)] },
    ] }),

  S24({ id: 'c24_evening', for: 'any', chapter: 'ch3', title: 'Что осталось', camp: house14,
    text: [
      { text: 'После ужина вы садитесь за стол вдвоём, с листком. Что взяли. Что осталось. Кто где.' },
      { when: A24, text: 'Завтра утром фургон прачечной идёт в Люнебург. Одно место. Оле просил, чтобы приехал тот, кому он писал листок. Это ты.' },
      { when: B24, text: 'Завтра утром фургон прачечной идёт в Люнебург. Одно место. Оле просил, чтобы приехал тот, кому он писал листок. Это {A}.' },
      { text: 'А со среды школе Брандта нужен человек с вашего двора.' },
      { text: 'Лампа прикручена до маленького огонька: керосин берегут. В полутьме лица кажутся старше, а голоса тише.' },
    ],
    actions: [
      { id: 'c24_ev_count', label: 'Пересчитать всё, что осталось', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_late' }, { id: 'b', goto: 'c24_b_late' }],
        text: 'Картошка, мука, яйца, окорок. Бензин в баке. Вы пишете цифры столбиком. Получается меньше, чем вы думали утром, и больше, чем вы боялись днём.', effects: [set24('ev', 'count'), finish, until24(19, 0)] },
      { id: 'c24_ev_ole', label: 'Говорить про Оле: что ему сказать завтра', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_late' }, { id: 'b', goto: 'c24_b_late' }],
        text: 'Вы говорите долго. Про письмо, про плазму, про Хенрике. Слова для Оле на завтра вы произносите вслух, примеряя. Ни одни не подходят.', effects: [set24('ev', 'ole'), finish, until24(19, 0)] },
      { id: 'c24_ev_rest', label: 'Посидеть молча', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: A24, goto: 'c24_a_late' }, { id: 'b', goto: 'c24_b_late' }],
        text: 'Вы сидите молча. За окном снова пошёл снег.', effects: [set24('ev', 'rest'), { body: 'stress', delta: -2 }, finish, until24(19, 0)] },
    ] }),

  S24({ id: 'c24_checkpoint', for: 'any', chapter: 'ch3', title: 'Понедельник, половина восьмого', checkpoint: 24, universal: false, camp: house14,
    text: [{ text: 'Половина восьмого вечера. Брандт ждёт ответа до вечера: кто пойдёт в школу. А завтра утром {A} едет в Люнебург, и надо решить, что он скажет Оле.' }], actions: [] }),
];
