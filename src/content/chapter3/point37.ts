import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { brothersCome, eldersCome, okaforComes, oleHome33 } from './point33';
import { aNorth36, bNorth36, east36, kasia36, kasiaGoes36, lea36, pawel36, tobias36, way36 } from './point36';

// Участок 37: среда 9.12, 06:00 → КТ37 21:00. Жребий: потеря-эхо (без опасности). План — STOCK_PLAN.md §10.3.
// Вместе на хуторе, у каждого свои дела. Утром реквизиция Хаазе для отхода армии: что заберут — по старым решениям
// (генератор, если ему всё рассказали в 35-й; иначе канистра солярки из третьего грузовика; иначе центнер картошки).
// Реквизицию встречает A у ворот (мир меняется только на его линии); B видит её из хлева.
export const P37: Cond = all({ cp: 36 }, not({ cp: 37 }));
export const A37: Cond = { me: 'A' };
export const B37: Cond = { me: 'B' };
export const farm37 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point37Available: Cond = all(P37, { at: farm37 }, { partnerAt: farm37 }, up, { partner: 'active' }, flag('w.c36_merle'));
export const own37 = (key: string, value: string): Cond => v(`$.c37_${key}`, value);

/** Эхо: что заберёт реквизиция (одинаково на обеих линиях, по состоянию до участка). */
export const lostGen37: Cond = flag('w.c35_list_full');
export const lostDiesel37: Cond = all(not(lostGen37), flag('w.c30_fuel_got'));
export const lostFood37: Cond = all(not(lostGen37), not(flag('w.c30_fuel_got')));
export const listedMed37: Cond = all(any(flag('w.c35_b_listed_med'), v('w.c35_b_listed_med', 'maybe')), not(flag('w.c36_b_card_pulled')));
export const leaveAsked37: Cond = any(all(way36('east'), pawel36), all(east36('yes'), tobias36));
export const henrike37: Cond = { npc: 'henrike', alive: true, at: farm37 };
export const merle37 = (x: string): Cond => v('w.c36_merle', x);
export const gift37 = (x: string): Cond => v('w.c36_gift', x);

export const frost37 = { tempC: -9, outdoor: true, wet: false };
export const barn37 = { tempC: 6, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm37, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S37 = wrap(P37);
export const set37 = (key: string, value: string | boolean): Effect => ({ set: `$.c37_${key}`, value });
export const w37 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c37_${key}`, value });
export const until37 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(39, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare37: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c37_finished', value: true };
const split = [{ id: 'a', when: A37, goto: 'c37_a_ice' }, { id: 'b', goto: 'c37_b_kasia' }];
const afterLunch = [{ id: 'a', when: A37, goto: 'c37_a_after2' }, { id: 'b', goto: 'c37_b_nina' }];
const afterRadio = [{ id: 'a', when: A37, goto: 'c37_a_pack' }, { id: 'b', goto: 'c37_b_pack' }];

export const shared37: Scene[] = [
  S37({ id: 'c37_dawn', for: 'any', chapter: 'ch3', title: 'Среда', camp: kitchen14,
    text: [
      { text: 'Минус девять, с востока ветер. Он гонит по двору сухой снег и свистит в щели над дверью. Хенрике завесила дверь старым одеялом.' },
      { when: merle37('all'), text: 'Вчера вы решили: звать Мерле и её родителей. Хенрике выслушала и сказала только: «Dann wird’s eng». Тогда будет тесно.' },
      { when: merle37('merle'), text: 'Вчера вы решили: звать Мерле. Хенрике уже прикидывает, куда поставить ещё одну кровать.' },
      { when: merle37('stay'), text: 'Вчера вы решили: Мерле не звать, ей лучше за Эльбой. Утром это решение всё ещё кажется правильным. Почти.' },
      { when: gift37('ham'), text: 'Окорок из коптильни висит на гвозде у двери, завёрнутый в холстину. Завтра он уедет.' },
      { when: gift37('potatoes'), text: 'У двери стоит мешок картошки, перевязанный бечёвкой. Завтра он уедет.' },
      { when: flag('w.c36_saw_card'), text: 'Сегодня девятое. В карточке у Хаазе было написано: реквизиция.' },
      { when: all(B37, flag('w.c36_b_wet_foot')), text: 'Нога, которой ты вчера провалилась в канаву, к утру красная и чешется. Пальцы слушаются.' },
    ],
    actions: [
      { id: 'c37_dw_eat', label: 'Позавтракать со всеми', minutes: 45, terminal: true, outcomes: split, ...tableOnly,
        text: 'Каша, хлеб, чай. Ветер воет в трубе, и Хенрике прикрывает заслонку наполовину. За столом говорят о завтрашнем утре, о том, кто во сколько встаёт.', effects: [set37('dw', 'eat'), meal('eat'), until37(6, 45)] },
      { id: 'c37_dw_partner', label: 'Посидеть с {partner.ins} у печки, пока все спят', minutes: 45, terminal: true, outcomes: split,
        text: 'Вы сидите на лавке у печи, плечо к плечу. Говорите мало. Завтра у каждого будет свой день, и сегодня — последний обычный.', effects: [set37('dw', 'partner'), { body: 'stress', delta: -3 }, meal('eat'), until37(6, 45)] },
      { id: 'c37_dw_early', label: 'Выпить чаю стоя и сразу за дела', minutes: 30, terminal: true, outcomes: split,
        text: 'Кружка чаю, кусок хлеба в карман. Дел сегодня больше, чем часов.', effects: [set37('dw', 'early'), { body: 'hunger', delta: -10 }, until37(6, 45)] },
    ] }),

  S37({ id: 'c37_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14, onEnter: [until37(13, 0)],
    text: [
      { text: 'Обед. Суп из капусты и картошки, по ломтю хлеба. Ветер стих к полудню, и в окне кухни видно, как над полем висит ровная белая дымка.' },
      { when: lostGen37, text: 'Без генератора дом сегодня вечером будет тёмным. Хенрике достала из чулана керосиновую лампу и чистит стекло.' },
      { when: lostDiesel37, text: 'Солярки нет. Трактор стоит в сарае, и Хенрике говорит про него, как про больного: «Der steht jetzt bis Frühjahr». Теперь стоит до весны.' },
      { when: lostFood37, text: 'В кладовке на мешок меньше. Хенрике переписала столбик в тетради и подчеркнула новую цифру два раза.' },
      { when: all(kasia36, kasiaGoes36), text: 'Кася почти не ест. Её рюкзак стоит у двери, собранный.' },
      { when: lea36, text: 'Лея пришла из пункта к обеду. Она ест быстро и молча, как в столовой.' },
    ],
    actions: [
      { id: 'c37_lu_eat', label: 'Есть со всеми', minutes: 45, terminal: true, outcomes: afterLunch, ...tableOnly,
        text: 'Суп горячий, хлеб чёрствый. Говорят о мелочах: кто где спит завтра ночью, сколько брать хлеба в дорогу. О главном никто.', effects: [set37('lu', 'eat'), meal('eat'), until37(14, 0)] },
      { id: 'c37_lu_henrike', label: 'Спросить Хенрике, как она будет без армии', when: henrike37, minutes: 45, terminal: true, outcomes: afterLunch,
        text: 'Хенрике дует на ложку. «Wie vorher. Meine Großmutter hatte auch keine Armee. Nur Nachbarn. Und einen Hund». Как раньше. У моей бабушки тоже не было армии. Только соседи. И собака. Она смотрит на тебя: «Den Hund haben wir nicht».', effects: [set37('lu', 'henrike'), meal('eat'), npc('henrike', 1), until37(14, 0)] },
      { id: 'c37_lu_short', label: 'Поесть на ходу, дела ждут', minutes: 30, terminal: true, outcomes: afterLunch,
        text: 'Ты берёшь миску к окну и ешь стоя. На дворе работа, и до темноты три часа.', effects: [set37('lu', 'short'), meal('eat'), until37(14, 0)] },
    ] }),

  S37({ id: 'c37_radio', for: 'any', chapter: 'ch3', title: 'Радио', camp: kitchen14, onEnter: [until37(17, 0)],
    text: [
      { text: 'Пять часов. Хенрике включает приёмник: последние объявления перед завтрашним днём.' },
      { when: v('B.c36_bk', 'batt'), text: 'Батарейки свежие: голос в приёмнике громкий и чистый.' },
      { text: '— …Kolonne Nord: morgen sechs Uhr, Schule Winsen. Rückkehr bis achtzehn Uhr über Geesthacht. Danach ist die Brücke zu.\n\nКолонна «Север»: завтра в шесть, школа Винзена. Возвращение до восемнадцати через Гестхахт. Потом мост закрыт.' },
      { text: '— …Nachrichten aus Polen: Die polnische Regierung hat die Grenze an der Oder seit Montag geschlossen. Rückkehrer werden in Lagern bei Szczecin registriert.\n\nНовости из Польши: польское правительство с понедельника закрыло границу на Одере. Возвращающихся регистрируют в лагерях под Щецином.' },
      { when: pawel36, text: 'Через минуту — короткое: «Kolonne Ost fährt trotzdem. Paweł». Колонна «Восток» едет всё равно. Павел.' },
    ],
    actions: [
      { id: 'c37_ra_listen', label: 'Дослушать до конца', minutes: 30, terminal: true, outcomes: afterRadio,
        text: 'Дальше — сводки: где есть хлеб, где вода, кто кого ищет. В самом конце диктор говорит: «Die Kommandantur Lüneburg dankt der Bevölkerung». Комендатура Люнебурга благодарит население. Это звучит как прощание.', effects: [set37('ra', 'listen'), until37(17, 45)] },
      { id: 'c37_ra_kasia', label: 'Посмотреть на Касю: она слышала про границу', when: all(kasia36, kasiaGoes36), minutes: 30, terminal: true, outcomes: afterRadio,
        text: 'Кася сидит неподвижно. Потом говорит по-польски, тихо, сама себе: «To nic. Poczekam pod Szczecinem». Ничего. Подожду под Щецином. Ты кладёшь ей руку на плечо. Она не отстраняется.', effects: [set37('ra', 'kasia'), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 1 }] }, until37(17, 45)] },
      { id: 'c37_ra_off', label: 'Выключить и пойти собираться', minutes: 20, terminal: true, outcomes: afterRadio,
        text: 'Ты выключаешь приёмник посреди фразы. Всё нужное сказано. Остальное — завтра.', effects: [set37('ra', 'off'), until37(17, 40)] },
    ] }),

  S37({ id: 'c37_supper', for: 'any', chapter: 'ch3', title: 'Последний ужин', camp: kitchen14, onEnter: [until37(18, 30)],
    text: [
      { text: 'Ужин. Хенрике сварила картошку с салом и луком, поставила на стол банку огурцов из подвала. Сегодня можно.' },
      { when: lostGen37, text: 'Керосиновая лампа коптит, и лица за столом жёлтые. Генератор уехал утром в кузове Хаазе.' },
      { when: ninaFarm, text: 'Нина режет хлеб, потому что Хенрике ей разрешила, и очень старается, чтобы ломти были ровные.' },
      { when: evaHere, text: 'Эва сидит прямо, как в церкви. Она говорит мало, но каждому подкладывает.' },
      { when: all(kasia36, kasiaGoes36), text: 'Кася кладёт на стол губную гармошку Тима и просит Нину сыграть. Нина не умеет. Играет всё равно, три ноты, туда и обратно.' },
      { when: brothersCome, text: 'Дениз рассказывает анекдот про трёх солдат и корову. Смеётся один Керем. Потом все.' },
      { when: oleHome33, text: 'Оле молчит весь ужин. В конце встаёт и говорит: «Wer morgen fährt — kommt zurück. Das ist ein Befehl». Кто завтра едет — возвращается. Это приказ. И садится.' },
      { when: okaforComes, text: 'Окафор пришёл к ужину и сидит у печи. Он ест медленно и смотрит на всех, будто запоминает.' },
      { when: eldersCome, text: 'Петерсен поднимает кружку с чаем, как бокал. Фрау Кёрнер шикает на него, но поднимает свою.' },
    ],
    actions: [
      { id: 'c37_su_eat', label: 'Есть и смотреть на всех', minutes: 60, terminal: true, goto: 'c37_farewell', ...tableOnly,
        text: 'Ты ешь и смотришь. Хенрике у плиты. Огурцы хрустят. Кто-то смеётся. Ты запоминаешь этот вечер, хотя не знаешь, зачем.', effects: [set37('su', 'eat'), meal('eat'), until37(19, 45)] },
      { id: 'c37_su_toast', label: 'Встать и сказать спасибо Хенрике', when: henrike37, minutes: 60, terminal: true, goto: 'c37_farewell', ...tableOnly,
        text: 'Ты встаёшь. Говоришь коротко: за дом, за хлеб, за то, что пустила. Хенрике машет рукой: хватит. Но потом отворачивается к плите и долго стоит спиной.', effects: [set37('su', 'toast'), meal('eat'), npc('henrike', 2, 'c37_thanked'), until37(19, 45)] },
      { id: 'c37_su_serve', label: 'Помогать Хенрике у плиты, поесть потом', minutes: 60, terminal: true, goto: 'c37_farewell',
        text: 'Ты разносишь миски, подливаешь чай. Ешь {m:последним|последней}, стоя у плиты, из той же кастрюли. Хенрике толкает тебя локтем: «Setz dich doch». Да сядь ты.', effects: [set37('su', 'serve'), meal('eat'), npc('henrike', 1), until37(19, 45)] },
    ] }),

  S37({ id: 'c37_farewell', for: 'any', chapter: 'ch3', title: 'Проводы', camp: yard14, ambient: frost37,
    text: [
      { text: 'После ужина все выходят во двор. Небо ясное, звёзды мелкие и злые. Мороз к ночи крепчает.' },
      { when: all(kasia36, kasiaGoes36), text: 'Кася обнимает Хенрике у крыльца. Долго. Хенрике гладит её по спине, как гладят ребёнка.' },
      { when: all(evaHere, east36('give')), text: 'Эва стоит в стороне, в пальто, застёгнутом до горла. Она ещё не сказала, поедет ли с армией пятнадцатого.' },
      { when: aNorth36, text: 'Завтра вы оба едете на север. Хенрике дала вам с собой термос и велела вернуться к ужину.' },
      { when: all(bNorth36, not(aNorth36)), text: 'Завтра она едет на север без тебя. Туда и обратно, к ночи. Хенрике дала ей термос.' },
    ],
    actions: [
      { id: 'c37_fw_stars', label: 'Постоять с {partner.ins} и посмотреть на звёзды', minutes: 30, terminal: true, goto: 'c37_night', ambientDuring: frost37,
        text: 'Вы стоите у колодца, пока не начинают мёрзнуть ноги. Над лесополосой падает звезда. Никто из вас не говорит, что загадал{m:|а}.', effects: [set37('fw', 'stars'), { body: 'stress', delta: -4 }, until37(20, 30)] },
      { id: 'c37_fw_kasia', label: 'Подойти к Касе', when: all(kasia36, kasiaGoes36), minutes: 30, terminal: true, goto: 'c37_night', ambientDuring: frost37,
        text: 'Кася берёт тебя за обе руки. «Dziękuję. Za Tima. Za wszystko». Спасибо. За Тима. За всё. Потом отпускает и уходит в дом, не оглядываясь.', effects: [set37('fw', 'kasia'), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 2 }] }, until37(20, 30)] },
      { id: 'c37_fw_check', label: 'Обойти двор: ворота, сарай, курятник', minutes: 30, activity: 'light', terminal: true, goto: 'c37_night', ambientDuring: frost37,
        text: 'Ворота заперты, сарай закрыт, в курятнике тихо. За сараем, у ручья, тоже тихо. Снег под фонарём синий. Ты возвращаешься в дом {m:последним|последней}.', effects: [set37('fw', 'check'), until37(20, 30)] },
    ] }),

  S37({ id: 'c37_night', for: 'any', chapter: 'ch3', title: 'Ночь перед десятым', camp: house14,
    text: [
      { text: 'Дом засыпает. На кухне тикают часы. Будильник Хенрике заведён на половину пятого.' },
      { when: leaveAsked37, text: 'Сегодня ночью надо решить окончательно: остаётесь вы или уходите. Сказать «да» Павлу или Тобиасу — значит, сюда уже не вернуться.' },
    ],
    actions: [
      { id: 'c37_ni_talk', label: 'Говорить шёпотом, пока не решите', minutes: 30, terminal: true, goto: 'c37_checkpoint',
        text: 'Шёпотом, под одеялом, лицом к лицу. Вы перебираете всё: хутор, Мерле, Хенрике, мост, восток. Иногда замолкаете надолго. Потом снова.', effects: [set37('ni', 'talk'), finish, until37(21, 0)] },
      { id: 'c37_ni_hold', label: 'Просто лежать рядом', minutes: 30, terminal: true, goto: 'c37_checkpoint',
        text: 'Слова кончились. Вы лежите рядом, и ты слушаешь, как дышит {partner}. Ровно, медленно. Завтра будет завтра.', effects: [set37('ni', 'hold'), { body: 'stress', delta: -5 }, finish, until37(21, 0)] },
      { id: 'c37_ni_sleep', label: 'Уснуть сразу: вставать в половине пятого', minutes: 30, terminal: true, goto: 'c37_checkpoint',
        text: 'Ты закрываешь глаза и считаешь удары часов на кухне. На девятом проваливаешься.', effects: [set37('ni', 'sleep'), { body: 'fatigue', delta: -8 }, finish, until37(21, 0)] },
    ] }),

  S37({ id: 'c37_checkpoint', for: 'any', chapter: 'ch3', title: 'Среда, девять вечера', checkpoint: 37, universal: false, camp: house14,
    text: [{ text: 'Девять вечера. Завтра десятое.' }], actions: [] }),
];
