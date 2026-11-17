import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { npc, tableOnly } from './point19';
import { okaforComes, oleHome33, tractor33 } from './point33';
import { aNorth36, bNorth36, jannikYes, kasia36, kasiaGoes36, pawel36 } from './point36';

// Участок 38: четверг 10.12, 04:30 → КТ38 23:30. Жребий: порознь на часть. План — STOCK_PLAN.md §10.4.
// Утром в Винзене уходят обе колонны. Кто едет на север (B — по КТ35, A — если Янник берёт второго) — мост, Аренсбург, Мерле и
// обратно до 18:00. Кто остаётся — проводы (по КТ37) и день на хуторе. Если на КТ37 решили уйти с Павлом — оба уходят на восток,
// КТ38 на северном берегу, дальше заглушка. Мерле приезжает или нет — по состоянию до участка (одинаково на обеих линиях).
export const P38: Cond = all({ cp: 37 }, not({ cp: 38 }));
export const A38: Cond = { me: 'A' };
export const B38: Cond = { me: 'B' };
export const farm38 = 'hof_luedemann';
export const winsen38 = 'c15_winsen';
export const bridge38 = 'c38_bridge';
export const ahr38 = 'c38_ahrensburg';
export const moelln38 = 'c38_moelln';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point38Available: Cond = all(P38, { at: farm38 }, { partnerAt: farm38 }, up, { partner: 'active' }, flag('w.c37_send'));
export const own38 = (key: string, value: string): Cond => v(`$.c38_${key}`, value);

export const leavePawel38: Cond = v('w.c37_leave', 'pawel');
export const leaveArmy38: Cond = v('w.c37_leave', 'army');
/** Я еду на север. */
export const northMe38: Cond = all(not(leavePawel38), any(all(A38, aNorth36), all(B38, bNorth36)));
/** Партнёр едет на север. */
export const northPartner38: Cond = all(not(leavePawel38), any(all(A38, bNorth36), all(B38, aNorth36)));
export const bothNorth38: Cond = all(not(leavePawel38), aNorth36, bNorth36);
export const send38 = (x: string): Cond => v('w.c37_send', x);
export const toWinsen38: Cond = any(leavePawel38, northMe38, send38('both'), send38('morning'));
export const okafor38: Cond = { npc: 'okafor', alive: true };
/** Мерле приезжает на хутор: позвали, не просили остаться, и кто-то за ней поехал. */
export const merleComes38: Cond = all(not(leavePawel38), { npc: 'merle', alive: true }, any(v('w.c36_merle', 'all'), v('w.c36_merle', 'merle')),
  not(v('w.c36_merle_msg', 'stay')), any(bNorth36, aNorth36, all(okaforComes, okafor38), flag('w.c36_merle_seat')));
export const parentsCome38: Cond = all(merleComes38, v('w.c36_merle', 'all'), any(flag('w.c36_merle_seat'), jannikYes, bNorth36));
export const kasiaDeparts38: Cond = all(kasia36, kasiaGoes36, pawel36, any(flag('w.c36_kasia_listed'), flag('w.c36_kasia_seat')));
export const henrike38: Cond = { npc: 'henrike', alive: true, at: farm38 };
export const pensFarm38: Cond = { stocked: 'c21_insulin', qty: 1, at: 'c3_farm_stock' };
/** Трактор на ходу: не в кювете с 30-й (или вытащен) и с соляркой (не отдана на реквизиции 37-й или добыта снова). */
export const tractorRuns: Cond = all(tractor33, any(not(v('w.c37_lost', 'diesel')), flag('w.c37_seed_traded'), flag('w.c38_diesel_from_army')));

export const frost38 = { tempC: -7, outdoor: true, wet: false };
export const barn38 = { tempC: 6, outdoor: false, wet: false };
export const hall38 = { tempC: 12, outdoor: false, wet: false };
export const cab38 = { tempC: 2, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm38, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S38 = wrap(P38);
export const set38 = (key: string, value: string | boolean): Effect => ({ set: `$.c38_${key}`, value });
export const w38 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c38_${key}`, value });
export const until38 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(40, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare38: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed38: Effect[] = [{ body: 'hunger', delta: -35 }, { body: 'thirst', delta: -30 }];
const finish: Effect = { set: '$.c38_finished', value: true };
const fromDawn = [{ id: 's', when: toWinsen38, goto: 'c38_school' }, { id: 'g', goto: 'c38_gate' }];
const fromSchool = [{ id: 'p', when: leavePawel38, goto: 'c38_p_board' }, { id: 'n', when: northMe38, goto: 'c38_n_board' }, { id: 'w', goto: 'c38_s_wave' }];
const meetMerle: Effect[] = [{ if: merleComes38, then: [{ set: '$.met.merle', value: true }] }, { if: parentsCome38, then: [{ set: '$.met.uwe', value: true }, { set: '$.met.birgit', value: true }] }];

export const shared38: Scene[] = [
  S38({ id: 'c38_dawn', for: 'any', chapter: 'ch3', title: 'Десятое', camp: kitchen14,
    text: [
      { text: 'Половина пятого. Будильник Хенрике звенит в кухне, долго, пока она не накрывает его ладонью. Темно. Минус одиннадцать.' },
      { when: leavePawel38, text: 'Сегодня вы уходите. Насовсем. Рюкзаки у двери, большие, на всё. Хенрике варит кофе из последней банки и ставит две кружки: вам.' },
      { when: all(northMe38, bothNorth38), text: 'Сегодня вы оба едете на север. Туда и обратно, до шести вечера, пока мост открыт.' },
      { when: all(northMe38, not(bothNorth38)), text: 'Сегодня ты едешь на север без {partner.gen}. Туда и обратно, до шести вечера, пока мост открыт.' },
      { when: northPartner38, text: 'Сегодня {partner} едет на север без тебя. Ты встаёшь вместе с ней, чтобы проводить.' },
      { when: all(not(leavePawel38), not(northMe38), not(northPartner38)), text: 'Сегодня уходят другие. Вы остаётесь. Но вставать всё равно в темноте: проводы.' },
      { when: kasiaDeparts38, text: 'Кася уже одета и сидит на лавке у двери, с рюкзаком на коленях.' },
    ],
    actions: [
      { id: 'c38_dw_eat', label: 'Позавтракать, пока горячее', minutes: 30, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, хлеб, кофе. Ешь быстро, обжигаясь. За окном ещё ночь, только над лесом чуть светлее.', effects: [set38('dw', 'eat'), meal('eat'), until38(5, 15)] },
      { id: 'c38_dw_pack', label: 'Взять еду с собой и проверить вещи ещё раз', minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Хлеб с салом в бумагу, термос, перчатки. Ты проверяешь карманы: всё на месте. Хенрике суёт тебе ещё два яйца, сваренных вкрутую: «Für unterwegs». В дорогу.', effects: [set38('dw', 'pack'), meal('pack'), until38(5, 15)] },
      { id: 'c38_dw_coffee', label: 'Выпить кофе у печи, пока остальные собираются', minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Кофе из последней банки, горький и крепкий. Ты пьёшь его стоя у печи и смотришь, как остальные ищут варежки.', effects: [set38('dw', 'coffee'), until38(5, 15)] },
      { id: 'c38_dw_henrike', label: 'Подойти к Хенрике и обнять её', when: henrike38, minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Хенрике замирает, потом обнимает тебя одной рукой: в другой половник. От неё пахнет дымом и молоком. «Ja, ja. Geht schon». Ну-ну. Идите уже.', effects: [set38('dw', 'henrike'), npc('henrike', 1), meal('eat'), until38(5, 15)] },
    ] }),

  S38({ id: 'c38_gate', for: 'any', chapter: 'ch3', title: 'У ворот', camp: yard14, ambient: frost38, onEnter: [until38(5, 45)],
    text: [
      { text: 'Без четверти шесть. У поворота к колонии светят фары пикапа Красного Креста. Прощаются у ворот: в Винзен вы не едете.' },
      { when: northPartner38, text: '{partner} садится в кузов с сумкой медсестры. Оборачивается. Машет. Пикап трогается.' },
      { when: kasiaDeparts38, text: 'Кася обнимает Хенрике, потом тебя. Быстро, крепко. И не оглядывается.' },
      { when: okaforComes, text: 'Окафор едет с пикапом в Винзен: оттуда на север. Он кивает тебе с подножки.' },
    ],
    actions: [
      { id: 'c38_ga_wave', label: 'Махать, пока фары не скроются за лесом', minutes: 25, terminal: true, goto: 'c38_g_morning', ambientDuring: frost38,
        text: 'Ты стоишь и машешь в темноту. Красные огоньки уходят за лесополосу. Потом тишина и пар изо рта.', effects: [set38('ga', 'wave'), until38(6, 15)] },
      { id: 'c38_ga_run', label: 'Догнать пикап и сунуть в кузов термос', minutes: 25, activity: 'moderate', terminal: true, goto: 'c38_g_morning', ambientDuring: frost38,
        text: 'Ты бежишь по снегу и забрасываешь термос в кузов на ходу. Кто-то ловит. Ты возвращаешься, запыхавшись, и только во дворе понимаешь, что термос был последний.', effects: [set38('ga', 'run'), { body: 'fatigue', delta: 3 }, until38(6, 15)] },
      { id: 'c38_ga_in', label: 'Сразу в дом: долгие проводы — лишние слёзы', minutes: 20, terminal: true, goto: 'c38_g_morning',
        text: 'Ты закрываешь ворота раньше, чем пикап доезжает до поворота. Так проще. Хенрике у плиты ничего не говорит, только наливает тебе ещё кофе.', effects: [set38('ga', 'in'), until38(6, 10)] },
    ] }),

  S38({ id: 'c38_g_morning', for: 'any', chapter: 'ch3', title: 'Утро', camp: yard14, ambient: frost38,
    text: [
      { text: 'Светает медленно. Хутор кажется пустым, хотя людей в нём почти столько же. Тише стало потому, что все ждут.' },
      { when: henrike38, text: 'Хенрике выходит с подойником. Пальцы у неё сегодня гнутся.' },
    ],
    actions: [
      { id: 'c38_gm_barn', label: 'Скотина: вода, сено, курятник', minutes: 60, activity: 'moderate', terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_quiet' }, { id: 'b', goto: 'c38_fb_quiet' }], ambientDuring: barn38,
        text: 'Ведро, охапка, засов. Корова тычется мордой в плечо. Куры квохчут, не выходя. Работа не думает о десятом.', effects: [set38('gm', 'barn'), until38(8, 30)] },
      { id: 'c38_gm_sleep', label: 'Лечь ещё на час: день будет длинный', minutes: 60, activity: 'rest', terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_quiet' }, { id: 'b', goto: 'c38_fb_quiet' }],
        text: 'Ты ложишься поверх одеяла, не раздеваясь, и проваливаешься сразу. Просыпаешься, когда в окне уже белое небо.', effects: [set38('gm', 'sleep'), { body: 'fatigue', delta: -8 }, until38(8, 30)] },
      { id: 'c38_gm_road', label: 'Пройти до дороги: посмотреть, идут ли машины', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_quiet' }, { id: 'b', goto: 'c38_fb_quiet' }], ambientDuring: frost38,
        text: 'На дороге к Йестебургу тихо. Потом проходят два армейских грузовика, на север, быстро, с брезентом, завязанным наглухо. Отход начинается раньше пятнадцатого.', effects: [set38('gm', 'road'), w38('saw_trucks', true), until38(8, 30)] },
    ] }),

  S38({ id: 'c38_school', for: 'any', chapter: 'ch3', title: 'Школьный двор', location: winsen38, camp: { at: winsen38, stock: 'c3_farm_stock', rest: false }, ambient: frost38, onEnter: [until38(6, 0)],
    text: [
      { text: 'Шесть утра. Школьный двор Винзена в свете фар: три белых грузовика Красного Креста, колонна легковушек с мешками на крышах, два армейских бронированных джипа сопровождения. Пар от выхлопов висит над двором облаком.' },
      { when: pawel36, text: 'Павел ходит вдоль своей колонны и стучит по крышам машин: заводите. Увидев вас, поднимает руку.' },
      { when: kasiaDeparts38, text: 'Кася садится в микроавтобус к польской семье с двумя детьми. Губная гармошка Тима висит у неё на шнурке на шее.' },
      { when: all(okaforComes, okafor38), text: 'Окафор стоит у первой машины Красного Креста с папкой. Он кивает тебе.' },
      { when: v('w.c36_nurse', 'lea'), text: 'Лея в куртке Красного Креста не по размеру курит у второй машины. Увидев тебя, тушит сигарету.' },
      { when: v('w.c36_gift', 'potatoes'), text: 'Мешок картошки с хутора уже в кузове. На нём мелом написано: «Lüdemann».' },
      { when: v('w.c36_gift', 'ham'), text: 'Окорок с хутора, завёрнутый в холстину, Павел прячет под сиденье своей машины.' },
    ],
    actions: [
      { id: 'c38_sc_pawel', label: 'Попрощаться с Павлом', when: all(pawel36, not(leavePawel38)), minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: frost38,
        text: 'Павел жмёт тебе руку обеими руками. «Dziękuję za wszystko. Pani Henrike — pozdrowienia. Wiosną… może». Спасибо за всё. Пани Хенрике — привет. Весной… может быть. Он садится в серый «Пассат», и машина отъезжает в хвост колонны.', effects: [set38('sc', 'pawel'), npc('pawel', 1), until38(6, 45)] },
      { id: 'c38_sc_kasia', label: 'Подойти к Касе', when: kasiaDeparts38, minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: frost38,
        text: 'Кася опускает стекло. Ты не знаешь, что сказать, и говоришь: «Пиши». По-русски. Она понимает. «Napiszę». Напишу. Стекло поднимается.', effects: [set38('sc', 'kasia'), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 1 }] }, until38(6, 45)] },
      { id: 'c38_sc_okafor', label: 'Подойти к Окафору', when: all(okaforComes, okafor38), minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: frost38,
        text: 'Окафор смотрит на часы, потом на тебя. «Six o’clock tonight. If the bridge holds». В шесть вечера. Если мост выдержит. Он не шутит. Он никогда не шутит о времени.', effects: [set38('sc', 'okafor'), until38(6, 45)] },
      { id: 'c38_sc_stand', label: 'Стоять в стороне и смотреть', minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: frost38,
        text: 'Ты стоишь у забора. Люди обнимаются, кто-то плачет, кто-то ругается из-за места. Армейский джип мигает фарами: пора.', effects: [set38('sc', 'stand'), until38(6, 45)] },
    ] }),

  S38({ id: 'c38_s_wave', for: 'any', chapter: 'ch3', title: 'Проводы', location: winsen38, camp: { at: winsen38, stock: 'c3_farm_stock', rest: false }, ambient: frost38,
    text: [
      { text: 'В семь колонны трогаются. Сначала джип, потом белые грузовики, потом легковушки Павла. Двор пустеет за десять минут. На снегу остаются масляные пятна и обрывок верёвки.' },
      { when: northPartner38, text: '{partner} сидит в кабине первой машины, рядом с водителем. Через стекло видно, как она поправляет шапку. Потом её не видно.' },
      { when: send38('both'), text: 'Вечером, в семь, колонна с севера вернётся сюда. Вы договорились встречать.' },
    ],
    actions: [
      { id: 'c38_sw_pickup', label: 'Вернуться на хутор пикапом в восемь', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_quiet' }, { id: 'b', goto: 'c38_fb_quiet' }], ambientDuring: cab38,
        text: 'Пикап идёт назад полупустой. Водитель молчит, ты тоже. За окном светлеет поле.', effects: [set38('sw', 'pickup'), until38(8, 30)] },
      { id: 'c38_sw_walk', label: 'Постоять, пока не стихнет шум моторов, и только потом уехать', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_quiet' }, { id: 'b', goto: 'c38_fb_quiet' }], ambientDuring: cab38,
        text: 'Шум моторов уходит на север, к Гестхахту, становится тише, тише, пропадает. Ты стоишь ещё минуту в тишине. Потом бежишь к пикапу: он уже сигналит.', effects: [set38('sw', 'walk'), { body: 'stress', delta: -2 }, until38(8, 30)] },
      { id: 'c38_sw_post', label: 'Зайти на почту Красного Креста, пока не уехал пикап', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_quiet' }, { id: 'b', goto: 'c38_fb_quiet' }],
        text: 'В учительской лежат ящики с письмами по алфавиту. Ты отдаёшь то, что надо отдать, и смотришь на ящик «L». Для хутора ничего нет. Пикап сигналит.', effects: [set38('sw', 'post'), { if: { has: 'c36_reuter_letter' }, then: [{ take: 'c36_reuter_letter' }, w38('reuter_posted', true)] }, until38(8, 30)] },
    ] }),

  S38({ id: 'c38_evening', for: 'any', chapter: 'ch3', title: 'Вечер', camp: yard14, ambient: frost38, onEnter: [until38(20, 30)],
    text: [
      { text: 'Половина девятого. Во дворе фары: пикап Красного Креста довёз до ворот тех, кто вернулся с севера.' },
      { when: merleComes38, text: 'Из кузова, держась за борт, спускается Мерле. Худая, в чужой куртке, с рюкзаком. Она стоит во дворе и смотрит на дом, как будто не верит, что дом настоящий.' },
      { when: parentsCome38, text: 'За ней — Уве и Биргит. Уве с двумя сумками, Биргит с кастрюлей, завёрнутой в полотенце. Привезла еду. Конечно, привезла.' },
      { when: all(not(merleComes38), any(bNorth36, aNorth36)), text: 'Мерле в кузове нет. Она осталась за Эльбой.' },
      { when: all(not(merleComes38), not(bNorth36), not(aNorth36)), text: 'Из кузова спрыгивает Окафор, потом Лея. Больше никого.' },
      { when: all(B38, merleComes38), text: 'Мерле видит тебя и сначала не двигается. Потом бросает рюкзак в снег.' },
    ],
    actions: [
      { id: 'c38_ev_hug', label: 'Встретить всех во дворе, обнять кого можно', minutes: 30, terminal: true, goto: 'c38_late', ambientDuring: frost38,
        text: 'Объятия, холодные куртки, чьи-то слёзы на твоей щеке, может, свои. Хенрике стоит на крыльце с лампой и командует: «Rein. Alle rein. Es ist kalt». В дом. Все в дом. Холодно.', effects: [set38('ev', 'hug'), ...meetMerle, { body: 'stress', delta: -6 }, until38(21, 15)] },
      { id: 'c38_ev_bags', label: 'Взять сумки и сразу в тепло', minutes: 30, terminal: true, goto: 'c38_late', ambientDuring: frost38,
        text: 'Ты хватаешь сумки и несёшь в дом. Разговоры потом. Сейчас главное — тепло и горячее.', effects: [set38('ev', 'bags'), ...meetMerle, until38(21, 15)] },
      { id: 'c38_ev_partner', label: 'Сначала найти {partner.acc}', minutes: 30, terminal: true, goto: 'c38_late', ambientDuring: frost38,
        text: 'Во дворе суета, фары, люди. Ты находишь {partner.acc} и просто стоишь рядом, держась за рукав. Целый день. Вы оба здесь.', effects: [set38('ev', 'partner'), ...meetMerle, { body: 'stress', delta: -8 }, until38(21, 15)] },
    ] }),

  S38({ id: 'c38_late', for: 'any', chapter: 'ch3', title: 'Поздний ужин', camp: kitchen14, onEnter: [until38(21, 15)],
    text: [
      { text: 'В кухне тесно и жарко. Хенрике поставила на стол всё, что было: картошку, хлеб, сало, огурцы.' },
      { when: parentsCome38, text: 'Биргит снимает полотенце с кастрюли: гороховый суп, ещё тёплый. Хенрике смотрит на суп, на Биргит, и впервые за месяц смеётся вслух.' },
      { when: merleComes38, text: 'Мерле ест медленно, считая что-то в уме. Перед едой она отходит в угол и колет себе в живот ручку инсулина, отвернувшись.' },
      { when: all(merleComes38, pensFarm38), text: 'Хенрике приносит из кладовки коробку из-под чая и ставит перед Мерле. Мерле открывает её и долго не может ничего сказать.' },
      { when: all(merleComes38, not(pensFarm38)), text: 'Мерле говорит, что ручек у неё на неделю. Может, на девять дней. Она шутит про это, и никто не смеётся.' },
      { when: ninaFarm, text: 'Нина сидит рядом с Мерле и смотрит на неё во все глаза: новенькая.' },
      { when: v('w.c27_tim', 'farm'), text: 'Кто-то ставит на подоконник тарелку с хлебом, как каждый вечер с тех пор, как под яблоней похоронен Тим. Мерле не спрашивает зачем. Потом спросит.' },
      { when: oleHome33, text: 'Оле пересчитывает приехавших, кивает и уходит спать раньше всех.\n\n— Morgen reden wir über Holz.\n\nЗавтра поговорим про дрова.' },
    ],
    actions: [
      { id: 'c38_la_eat', label: 'Есть и слушать рассказы с той стороны', minutes: 60, terminal: true, goto: 'c38_night', ...tableOnly,
        text: 'Рассказывают все сразу: про мост, про очередь, про спортзал на четыреста человек, про солдат с градусниками. Ты ешь и слушаешь, и постепенно день складывается целиком.', effects: [set38('la', 'eat'), meal('eat'), until38(22, 30)] },
      { id: 'c38_la_merle', label: 'Сесть рядом с Мерле', when: merleComes38, minutes: 60, terminal: true, goto: 'c38_night', ...tableOnly,
        text: 'Мерле прислоняется к тебе плечом, как будто это само собой. Говорит тихо: «Ich dachte, ich sterbe da. Nicht an Zucker. An Langeweile». Я думала, я там умру. Не от сахара. От скуки. Шутит. Значит, живая.', effects: [set38('la', 'merle'), meal('eat'), { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 2 }] }, until38(22, 30)] },
      { id: 'c38_la_tea', label: 'Сесть с краю с кружкой чая', minutes: 60, terminal: true, goto: 'c38_night',
        text: 'Ты сидишь с краю, греешь руки о кружку и слушаешь. Голоса, смех, звон ложек. Дом полный.', effects: [set38('la', 'tea'), { body: 'stress', delta: -3 }, until38(22, 30)] },
      { id: 'c38_la_serve', label: 'Помогать Хенрике у плиты', when: henrike38, minutes: 60, terminal: true, goto: 'c38_night',
        text: 'Ты подливаешь, режешь хлеб, моешь кружки, потому что кружек меньше, чем людей. Хенрике шепчет тебе.\n\n— Wie Weihnachten. Nur ohne Baum.\n\nКак Рождество. Только без ёлки.', effects: [set38('la', 'serve'), meal('eat'), npc('henrike', 1), until38(22, 30)] },
    ] }),

  S38({ id: 'c38_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14,
    text: [
      { text: 'Половина одиннадцатого. Дом затихает не сразу: шёпот, скрип кроватей, кто-то ищет второе одеяло.' },
      { when: merleComes38, text: 'Где спать Мерле, пока не решили. Сегодня — на лавке в кухне, у печки, под двумя одеялами.' },
      { when: all(not(merleComes38), any(bNorth36, aNorth36)), text: 'Ты думаешь о спортзале на четыреста человек за Эльбой. О том, что мост теперь закрыт.' },
    ],
    actions: [
      { id: 'c38_ni_talk', label: 'Рассказать {partner.dat} свой день, шёпотом', minutes: 30, terminal: true, goto: 'c38_checkpoint',
        text: 'Ты рассказываешь, {partner} рассказывает. Два дня в одном. Под конец вы засыпаете на полуслове.', effects: [set38('ni', 'talk'), finish, until38(23, 30)] },
      { id: 'c38_ni_watch', label: 'Выйти проверить ворота и тропу', minutes: 30, terminal: true, goto: 'c38_checkpoint', ambientDuring: frost38,
        text: 'Ворота заперты. На тропе от ручья тихо, снег не тронут. На востоке, над Люнебургом, зарево: что-то жгут. Ты возвращаешься и долго не можешь согреть руки.', effects: [set38('ni', 'watch'), w38('glow', true), finish, until38(23, 30)] },
      { id: 'c38_ni_sleep', label: 'Уснуть сразу', minutes: 30, terminal: true, goto: 'c38_checkpoint',
        text: 'Ты проваливаешься в сон, едва коснувшись подушки. Длинный день.', effects: [set38('ni', 'sleep'), { body: 'fatigue', delta: -6 }, finish, until38(23, 30)] },
    ] }),

  S38({ id: 'c38_checkpoint', for: 'any', chapter: 'ch3', title: 'Десятое, ночь', checkpoint: 38, universal: false, camp: house14,
    text: [{ text: 'Половина двенадцатого. Мост через Эльбу закрыт. Все, кто вернулся, — дома.' }], actions: [] }),
];
