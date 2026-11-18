import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { oleHome33 } from './point33';
import { pawel34 } from './point34';

// Участок 36: вторник 8.12, 06:00 → КТ36 21:00. Жребий: порознь на часть; находка (A). План — STOCK_PLAN.md §10.2.
// Утром по радио: колонна Красного Креста на север идёт одним рейсом десятого (мост в Гестхахте для гражданских до 18:00).
// A — в Люнебург: отдаёт Тобиасу ответ, который за него дала B; казарма пустеет; кейс Ройтера (код 212); списки Хаазе.
// B — в Винзен: регистрация медсестрой или отказ, колонна Павла, урок Нины, Окафор и инсулин Мерле.
export const P36: Cond = all({ cp: 35 }, not({ cp: 36 }));
export const A36: Cond = { me: 'A' };
export const B36: Cond = { me: 'B' };
export const farm36 = 'hof_luedemann';
export const jest36 = 'c16_jesteburg';
export const winsen36 = 'c15_winsen';
export const lue36 = 'c18_lueneburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point36Available: Cond = all(P36, { at: farm36 }, { partnerAt: farm36 }, up, { partner: 'active' }, flag('w.c35_way'));
export const own36 = (key: string, value: string): Cond => v(`$.c36_${key}`, value);

export const way36 = (x: string): Cond => v('w.c35_way', x);
export const north36 = (x: string): Cond => v('w.c35_north', x);
export const east36 = (x: string): Cond => v('w.c35_east', x);
export const jannikYes: Cond = flag('w.c35_jannik');
/** Кто едет на север десятого (STOCK_PLAN §10.1 п. 2). */
export const bNorth36: Cond = any(north36('go'), north36('together'), all(way36('north'), jannikYes));
export const aNorth36: Cond = all(jannikYes, any(north36('together'), way36('north')));
export const henrike36: Cond = { npc: 'henrike', alive: true, at: farm36 };
export const tobias36: Cond = { npc: 'c15_tobias', alive: true };
export const lea36: Cond = all({ npc: 'c21_lea', alive: true }, any({ npc: 'c21_lea', at: farm36 }, { npc: 'c21_lea', at: jest36 }));
export const kasia36: Cond = { npc: 'kasia', alive: true, at: farm36 };
export const pawel36: Cond = pawel34;
export const insulinHome36: Cond = { stocked: 'c21_insulin', qty: 1, at: 'c3_farm_stock' };
export const ninaWinsen36: Cond = v('w.c32_nina', 'winsen');
/** Кася уходит десятого: обещание {B} в 35-й, отданное место — или сама записалась к полякам в 29-й / решила в 31-й. */
export const kasiaGoes36: Cond = any(v('w.c35_kasia_east', 'promised'), east36('give'), v('w.c29_kasia_road', 'list'), v('w.c31_kasia_advice', 'go'));

export const frost36 = { tempC: -8, outdoor: true, wet: false };
/** Кузов под брезентом: ветра нет, но холодно. */
export const tarp36 = { tempC: -2, outdoor: false, wet: false };
export const hall36 = { tempC: 11, outdoor: false, wet: false };
export const cab36 = { tempC: 4, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm36, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S36 = wrap(P36);
export const set36 = (key: string, value: string | boolean): Effect => ({ set: `$.c36_${key}`, value });
export const w36 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c36_${key}`, value });
export const until36 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(38, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare36: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed36: Effect[] = [{ body: 'hunger', delta: -35 }, { body: 'thirst', delta: -30 }];
const finish: Effect = { set: '$.c36_finished', value: true };
const split = [{ id: 'a', when: A36, goto: 'c36_a_go' }, { id: 'b', goto: 'c36_b_go' }];

export const shared36: Scene[] = [
  S36({ id: 'c36_dawn', for: 'any', chapter: 'ch3', title: 'Вторник', camp: kitchen14,
    text: [
      { text: 'Минус двенадцать. Печь за ночь остыла, и первым делом Хенрике бьёт кочергой по колоснику, чтобы ссыпалась зола. Дом просыпается от этого звука.' },
      { when: all(A36, north36('go')), text: 'Вчера ты {m:решил|решила} за неё: пусть едет на север без тебя. Утром это решение выглядит тяжелее. Она спит, отвернувшись к стене, и одеяло у неё натянуто до уха.' },
      { when: all(A36, north36('together')), text: 'Вчера ты {m:решил|решила}: на север вдвоём, если Янник возьмёт второго. Утром ты первым делом думаешь, хватит ли у Corsa бензина до Винзена.' },
      { when: all(A36, north36('no')), text: 'Вчера ты {m:решил|решила} за неё: на север она не поедет. Она ничего тебе на это не сказала. Утром ты всё ещё ждёшь, что скажет.' },
      { when: all(B36, east36('yes')), text: 'Вчера ты {m:решил|решила} за него: Тобиасу он скажет «да». Два места за Эльбу. Сегодня ему идти и говорить это вслух.' },
      { when: all(B36, east36('no')), text: 'Вчера ты {m:решил|решила} за него: Тобиасу он скажет «нет». Сегодня ему идти и говорить это вслух. Тебе кажется, он не спал.' },
      { when: all(B36, east36('give')), text: 'Вчера ты {m:решил|решила} за него: пусть Тобиас возьмёт вместо вас Касю и Эву. Сегодня ему идти и просить об этом.' },
      { when: v('w.c33_rule', 'yards'), text: 'С тех пор как каждый двор ест своё, на кухне у Хенрике по утрам тише. Кастрюля меньше.' },
      { when: v('w.c33_rule', 'pot'), text: 'Один котёл на всех. Хенрике считает порции вслух, чтобы все слышали.' },
      { when: v('w.c33_rule', 'work'), text: 'На двери кухни лист: кто сегодня на чём. Пришедшие последними — первые в списке.' },
      { when: way36('stay'), text: 'Вы решили зимовать здесь. Хенрике об этом знает. Она ставит на стол на одну кружку больше, чем вчера, как будто решение кого-то прибавило.' },
      { when: way36('north'), text: 'Вы решили ехать на север, за Мерле. Хенрике об этом знает и ничего не спрашивает. Только достала с полки термос и поставила у двери.' },
      { when: way36('east'), text: 'Вы решили уходить на восток. Хенрике об этом знает. Она режет хлеб и не поднимает глаз.' },
    ],
    actions: [
      { id: 'c36_dw_eat', label: 'Сесть со всеми завтракать', minutes: 45, terminal: true, goto: 'c36_radio', ...tableOnly,
        text: 'Каша с салом, чай. За столом тихо: каждый думает о десятом по-своему. Хенрике следит, чтобы никто не встал голодным.', effects: [set36('dw', 'eat'), meal('eat'), until36(7, 0)] },
      { id: 'c36_dw_partner', label: 'Поговорить с {partner.ins} до завтрака, во дворе', minutes: 45, terminal: true, goto: 'c36_radio', ambientDuring: frost36,
        text: 'Вы стоите у колодца, пар изо рта. Говорите про вчерашнее: кто за кого что решил и почему. Не всё получается сказать. Но вы стоите рядом, и это тоже разговор.', effects: [set36('dw', 'partner'), set36('talked', true), { body: 'stress', delta: -3 }, until36(7, 0)] },
      { id: 'c36_dw_barn', label: 'Сначала скотина: корова, куры', minutes: 45, activity: 'moderate', terminal: true, goto: 'c36_radio', ambientDuring: frost36,
        text: 'В хлеву тепло и пахнет сеном. Корова поворачивает голову и смотрит, кто пришёл. Ведро воды, охапка сена, проверить курятник: куница больше не приходила. Когда ты возвращаешься, каша на плите ещё тёплая.', effects: [set36('dw', 'barn'), npc('henrike', 1), meal('eat'), until36(7, 0)] },
    ] }),

  S36({ id: 'c36_radio', for: 'any', chapter: 'ch3', title: 'Радио', camp: kitchen14,
    text: [
      { text: 'Семь часов. Хенрике включает приёмник на подоконнике: Красный Крест читает объявления. Голос женский, усталый, ровный.' },
      { text: '— …Kolonne Nord: Abfahrt Donnerstag, zehnter Dezember, sechs Uhr, Schule Winsen. Die Bundeswehr schließt die Elbbrücke Geesthacht für Zivilisten am zehnten um achtzehn Uhr. Die Kolonne fährt nur eine Tour: Ahrensburg und zurück am selben Tag. Ich wiederhole: nur eine Tour.\n\nКолонна «Север»: выезд в четверг, десятого декабря, в шесть утра от школы Винзена. Бундесвер закрывает мост через Эльбу в Гестхахте для гражданских десятого в восемнадцать часов. Колонна идёт одним рейсом: Аренсбург и обратно в тот же день. Повторяю: одним рейсом.' },
      { text: 'За столом все поворачиваются к приёмнику. Две недели, о которых говорили вчера, превратились в один день.' },
      { when: pawel36, text: '— …Kolonne Ost, Paweł: Abfahrt zehnter Dezember, sieben Uhr, Schulhof Winsen. Über Geesthacht.\n\nКолонна «Восток», Павел: выезд десятого, в семь, школьный двор Винзена. Через Гестхахт.' },
      { when: bNorth36, text: 'Значит, на север — на один день. Утром туда, к вечеру обратно. Если мост не закроют раньше.' },
      { when: insulinHome36, text: 'Хенрике смотрит на кладовку, где в коробке из-под чая лежат шприц-ручки из синей сумки. Ничего не говорит.' },
    ],
    actions: [
      { id: 'c36_rd_listen', label: 'Дослушать до конца: вдруг назовут кого-то из знакомых', minutes: 30, terminal: true, outcomes: split,
        text: 'Дальше идут имена: кто кого ищет, кто где. Чужие фамилии, чужие деревни. Хартман не называют. Под конец диктор читает: «Aus Ahrensburg, Sporthalle: Insulin wird knapp. Wer kann, bringt mit». Из Аренсбурга, спортзал: инсулин на исходе. Кто может, привезите.', effects: [set36('rd', 'listen'), w36('heard_insulin', true), { body: 'stress', delta: 1 }, until36(7, 45)] },
      { id: 'c36_rd_write', label: 'Записать время и частоту на листок у двери', minutes: 20, terminal: true, outcomes: split,
        text: 'Ты записываешь на обороте старого календаря: «Do 10.12 — 6:00 Winsen. Brücke bis 18:00». Хенрике прикалывает листок кнопкой к двери. Теперь каждый, кто выходит, видит, сколько осталось.', effects: [set36('rd', 'write'), w36('note_door', true), until36(7, 45)] },
      { id: 'c36_rd_off', label: 'Выключить: батарейки на исходе', minutes: 15, terminal: true, outcomes: split,
        text: 'Ты поворачиваешь ручку, и в кухне становится тихо. Батарейки в приёмнике последние, а до десятого ещё два дня новостей.', effects: [set36('rd', 'off'), w36('radio_saved', true), until36(7, 45)] },
    ] }),

  S36({ id: 'c36_yard', for: 'any', chapter: 'ch3', title: 'Вечер во дворе', camp: yard14, ambient: frost36, onEnter: [until36(17, 0)],
    text: [
      { text: 'Пять часов. Уже темно. Над хутором низкое небо, и мороз к ночи крепчает. В окне кухни горит лампа.' },
      { when: A36, text: '{partner} возвращается из Винзена пешком от поворота. Шапка в инее, нос красный. В руке сумка, которой утром не было.' },
      { when: B36, text: '{partner} уже дома и ждёт тебя у ворот. Куртка в известковой пыли, на рукаве сажа. Видно, что день у него был длинный.' },
      { when: all(A36, flag('$.c36_case_open')), text: 'В рюкзаке у тебя то, что было в кейсе Ройтера. Ты ещё не решил{m:|а}, как об этом рассказать.' },
      { when: all(A36, flag('w.c36_lea_list')), text: 'Во внутреннем кармане — листок с двумя фамилиями. Хартман. Хартман.' },
      { when: all(B36, flag('w.c36_nurse_signed')), text: 'В кармане у тебя бумага с печатью Красного Креста. Твоё имя, «Krankenschwester (Aushilfe)», дата: десятое.' },
      { when: all(B36, v('w.c36_nurse', 'lea')), text: 'Удостоверение на десятое теперь выписано на Лею. Ты ещё не знаешь, как к этому отнесутся дома.' },
    ],
    actions: [
      { id: 'c36_yd_all', label: 'Рассказать всё, что было за день', minutes: 40, terminal: true, goto: 'c36_supper',
        text: 'Вы стоите у сарая и рассказываете по очереди. Люнебург. Винзен. Кто что сказал, кто что просил. Ты {m:замёрз|замёрзла} до костей, но уходить в дом не хочется: в доме вы будете не одни.', effects: [set36('yd', 'all'), set36('shared', true), until36(18, 0)] },
      { id: 'c36_yd_main', label: 'Рассказать главное, остальное потом', minutes: 25, terminal: true, goto: 'c36_supper',
        text: 'Ты говоришь коротко: что решили, что изменилось. Подробности оставляешь на ночь. {partner} кивает и делает так же.', effects: [set36('yd', 'main'), until36(18, 0)] },
      { id: 'c36_yd_work', label: 'Сначала дела: дрова на ночь, вода', minutes: 40, activity: 'moderate', terminal: true, goto: 'c36_supper',
        text: 'Два ведра воды, охапка дров к печи. Разговор идёт сам, между делом: кто что видел, кто кого встретил. Так даже легче.', effects: [set36('yd', 'work'), { body: 'fatigue', delta: 4 }, until36(18, 0)] },
    ] }),

  S36({ id: 'c36_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14, onEnter: [until36(18, 0)],
    text: [
      { text: 'Ужин. Картошка в мундире, квашеная капуста, по ломтю хлеба. За столом говорят про десятое, и каждый — про своё.' },
      { when: all(v('w.c33_rule', 'pot'), v('w.c34_rule_a', 'silent')), text: 'Ключ от кладовки висит у тебя на шее третий день. Каждое утро ты пересчитываешь полки. Буханки сходятся. Почти.' },
      { when: v('w.c34_rule_b', 'secret'), text: 'Бидон, в котором ты {m:носил|носила} суп соседям, стоит у двери вымытым. На нём записка карандашом: «Danke. Wir haben Holz». Спасибо. У нас есть дрова.' },
      { when: v('w.c34_rule_a', 'gift'), text: 'На крыльце снова корзина от Кёлер: шесть яиц и банка квашеной капусты. Без записки. Долги здесь отдают, даже когда их не было.' },
      { when: ninaFarm, text: 'Нина рассказывает, что в школе дали задание: написать, где ты будешь на Рождество. Она написала: «Hier». Здесь.' },
      { when: all(evaHere, east36('give')), text: 'Эва уже знает, что ей может достаться место в армейском грузовике за Эльбу. Она не говорит ни «да», ни «нет». Только чаще обычного трогает крестик под воротником.' },
      { when: all(kasia36, not(kasiaGoes36)), text: 'Кася ест молча. Губная гармошка Тима лежит рядом с её тарелкой.' },
      { when: all(kasia36, kasiaGoes36), text: 'Кася говорит Хенрике, что десятого, наверное, уйдёт. Хенрике кивает.\n\n— Das war klar, Kind. Seit Wochen.\n\nЭто было ясно, девочка. Уже который день.' },
      { when: lea36, text: 'Лея сидит с краю и чистит ногти ножом. Когда речь заходит о колонне, она выходит покурить.' },
      { when: oleHome33, text: 'Оле сидит во главе стола. Он ещё бледный, но ест уже сам и слушает внимательно.' },
      { when: way36('east'), text: 'Кто-то спрашивает у вас, правда ли вы уходите. Ответа ждут все.' },
    ],
    actions: [
      { id: 'c36_su_eat', label: 'Есть и слушать', minutes: 60, terminal: true, goto: 'c36_night', ...tableOnly,
        text: 'Ты ешь медленно. Каждый говорит своё, и никто не говорит главного. Хенрике в конце собирает тарелки и ставит на плиту чайник: это значит, что сегодня ещё посидят.', effects: [set36('su', 'eat'), meal('eat'), until36(19, 30)] },
      { id: 'c36_su_answer', label: 'Ответить всем прямо: что вы решили и почему', minutes: 60, terminal: true, goto: 'c36_night',
        text: 'Ты говоришь, как есть. Решение не всем нравится, это видно по лицам. Но теперь никто не шепчется у тебя за спиной. Хенрике кладёт тебе в тарелку ещё картофелину.', effects: [set36('su', 'answer'), meal('eat'), npc('henrike', 1), until36(19, 30)] },
      { id: 'c36_su_count', label: 'Поесть наскоро и пойти с Хенрике в кладовку считать, что останется', minutes: 60, terminal: true, goto: 'c36_night', ...tableOnly,
        text: 'В кладовке холодно, как на улице. Хенрике светит лампой, ты считаешь: мешки картошки, банки, сало, мука. Она записывает в тетрадь столбиком и в конце подчёркивает дважды. До весны хватит, если никто не придёт. Придут.', effects: [set36('su', 'count'), meal('eat'), w36('counted', true), npc('henrike', 1), until36(19, 30)] },
    ] }),

  S36({ id: 'c36_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14, onEnter: [until36(19, 30)],
    text: [
      { text: 'Половина восьмого. Дом затихает рано: печь в кухне прогорает, лампу прикручивают. Наверху кто-то кашляет и переворачивается.' },
      { when: all(A36, north36('go')), text: 'Ты лежишь и думаешь о послезавтрашнем утре: школа в Винзене, белые грузовики, она садится в кабину, а ты остаёшься на снегу.' },
      { when: all(B36, bNorth36), text: 'Ты думаешь о послезавтрашнем дне: мост, Аренсбург, Мерле. Туда и обратно, один день. Если всё пойдёт как надо.' },
      { when: all(A36, east36('yes'), tobias36), text: 'Ты думаешь о пятнадцатом: пять утра, ворота казармы, два места. Ты сказал{m:|а} «да», потому что так решила она. Теперь это и твоё «да».' },
    ],
    actions: [
      { id: 'c36_ni_talk', label: 'Поговорить вдвоём, пока все спят', minutes: 60, terminal: true, goto: 'c36_checkpoint',
        text: 'Шёпотом, лицом к лицу. Про то, кто за кого что решил, и как это было, решать за другого. Обиды не говорятся вслух, но вы их слышите. Под конец ты берёшь {partner.acc} за руку, и так вы засыпаете.', effects: [set36('ni', 'talk'), set36('night_talk', true), { body: 'stress', delta: -6 }, finish, until36(21, 0)] },
      { id: 'c36_ni_pack', label: 'Разобрать вещи: что понадобится десятого', minutes: 60, terminal: true, goto: 'c36_checkpoint',
        text: 'Носки, перчатки, фонарик, бинт, сухари. Ты раскладываешь всё на кровати и складываешь обратно. Две вещи лишние. Одной не хватает, и ты не знаешь, какой.', effects: [set36('ni', 'pack'), set36('packed', true), finish, until36(21, 0)] },
      { id: 'c36_ni_sleep', label: 'Лечь пораньше: завтра длинный день', minutes: 60, terminal: true, goto: 'c36_checkpoint',
        text: 'Ты засыпаешь быстро, как будто проваливаешься. Последнее, что слышишь, — как Хенрике в кухне заводит часы.', effects: [set36('ni', 'sleep'), { body: 'fatigue', delta: -10 }, finish, until36(21, 0, true)] },
    ] }),

  S36({ id: 'c36_checkpoint', for: 'any', chapter: 'ch3', title: 'Вторник, девять вечера', checkpoint: 36, universal: false, camp: house14,
    text: [{ text: 'Девять вечера. До десятого — один день.' }], actions: [] }),
];
