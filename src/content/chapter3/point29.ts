import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { tableOnly } from './point19';

// Участок 29: суббота 28.11, 07:00 → КТ29 воскресенье 29.11, 19:00. Первый адвент. План — STOCK_PLAN.md §9.
// Жребий: чистый сюжет + потеря-эхо: Фолькера в 18-й не пустили (только вода) — кровельщика нет, крыша курятника рушится под снегом.
export const P29: Cond = all({ cp: 28 }, not({ cp: 29 }));
export const A29: Cond = { me: 'A' };
export const B29: Cond = { me: 'B' };
export const farm29 = 'hof_luedemann';
export const jest29 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point29Available: Cond = all(P29, { at: farm29 }, up, flag('w.c28_place'), flag('w.c28_house'));
export const oleAlive29: Cond = all({ npc: 'ole', alive: true }, not(flag('w.c27_ole_last')));
export const brandt29 = (x: string): Cond => v('w.c26_brandt', x);
export const place29 = (x: string): Cond => v('w.c28_place', x);
/** Потеря-эхо: Фолькеру в 18-й дали воды и не пустили — кровельщика на хуторе нет. */
export const roofLoss: Cond = all(v('A.c18_kn', 'water'), not(flag('w.c18_lodger')));
export const volkerSeen: Cond = any(flag('A.met.c18_volker'), flag('B.met.c18_volker'));
export const dutyB29: Cond = v('w.c24_duty', 'b');

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm29, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S29 = wrap(P29);
export const set29 = (key: string, value: string | boolean): Effect => ({ set: `$.c29_${key}`, value });
export const w29 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c29_${key}`, value });
export const until29 = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare29: Effect = { camp: { kind: 'prepare', quiet: true } };
export const frost29 = { tempC: -6, outdoor: true, wet: false };
export const day29 = { tempC: -2, outdoor: true, wet: false };
const finish: Effect = { set: '$.c29_finished', value: true };
const coopFacts: Effect[] = [{ if: roofLoss, then: [w29('coop_roof', 'fallen'), w29('hens_lost', 3)] }, w29('pump_frozen', true)];
const toChurch = [{ id: 'a', when: A29, goto: 'c29_a_church' }, { id: 'b', goto: 'c29_b_church' }];

export const shared29: Scene[] = [
  S29({ id: 'c29_night', for: 'any', chapter: 'ch3', title: 'Ночь на воскресенье', camp: house14, ambient: indoor16,
    text: [
      { text: 'Ночью минус шесть. Окна изнутри затягивает инеем, узорами, как в детстве. Печь не остывает до утра только потому, что Хенрике встаёт в три и подбрасывает.' },
      { when: roofLoss, text: 'Около двух со двора доносится треск. Глухой, долгий. Потом тишина. Потом кудахтанье, отчаянное, на весь двор.' },
      { text: 'Мороз трещит в брёвнах. Где-то во дворе хлопает незакрытая дверь сарая, раз, другой, и затихает.' },
      { when: v('$.c29_be', 'rest'), text: 'После часа у печи ноги отогрелись. Ты сидишь и слушаешь, как трещат дрова.' },
    ],
    actions: [
      { id: 'c29_n_sleep', label: 'Спать', minutes: 5, terminal: true, goto: 'c29_coop',
        text: 'Ты засыпаешь под стук спиц: Хенрике вяжет у печи, ей не спится.', effects: [set29('n', 'sleep'), until29(29, 7, 0, true)] },
      { id: 'c29_n_out', label: 'Выйти на треск с фонарём', when: roofLoss, minutes: 5, terminal: true, goto: 'c29_coop', ambientDuring: frost29,
        text: 'Крыша курятника просела посередине. Снег провалился внутрь вместе с прогнившими досками. Куры жмутся в угол. Ты загоняешь их в сарай по одной, в темноте. Трёх не находишь. Утром найдёшь.', effects: [set29('n', 'out'), { body: 'fatigue', delta: 4 }, until29(29, 2, 40), until29(29, 7, 0, true)] },
    ] }),

  S29({ id: 'c29_coop', for: 'any', chapter: 'ch3', title: 'Утро адвента', camp: yard14, ambient: frost29, onEnter: coopFacts,
    text: [
      { text: 'Воскресенье. Первый адвент. Хенрике ставит на стол венок из еловых веток с четырьмя свечами. Одну зажигает. Спичку держит, пока не обожжёт пальцы.' },
      { text: 'Колонка во дворе замёрзла. Ручка не ходит. Воду придётся носить из колодца, растапливать снег.' },
      { when: roofLoss, text: 'Крыша курятника просела под снегом. Три курицы под досками, мёртвые, окоченевшие. Рубероид, который Фолькер оставил у столба, так и стоит свёрнутым: прибить его было некому.' },
      { when: v('w.c29_wreath', 'forest'), text: 'На столе венок из еловых лап, кривой, с четырьмя свечами. Одна горит.' },
      { when: v('w.c29_wreath', 'yew'), text: 'На столе венок из тиса, тёмный, с четырьмя свечами. Одна горит. Хенрике трогает ветку и улыбается.' },
      { when: v('$.c29_ap', 'wrap'), text: 'Колонка у сарая укутана соломой и мешковиной, как ты {m:сделал|сделала} вчера. Пока качает.' },
      { when: v('$.c29_as', 'wood'), text: 'Поленница у стены высокая, на неделю. Субботняя работа видна.' },
      { when: all(v('$.c29_n', 'sleep'), roofLoss), text: 'Ночью ты спал{m:|а} и ничего не слышал{m:|а}. Теперь всё это видно при свете.' },
      { when: all(v('$.c29_n', 'out'), roofLoss), text: 'Ночью ты {m:выходил|выходила} на треск с фонарём. Теперь, при свете, видно то, что ночью было только тенями.' },
    ],
    actions: [
      { id: 'c29_c_church', label: 'Собираться в церковь: в десять собрание', minutes: 60, terminal: true, outcomes: toChurch, ambientDuring: day29,
        text: 'Четыре километра по снегу. Идут все, кто может: Хенрике, Нина, Эва. Кто не может, остаётся у печи.', effects: [set29('c', 'church'), { move: jest29 }, until29(29, 9, 50)] },
      { id: 'c29_c_hens', label: 'Сначала разобрать курятник и унести мёртвых кур', when: roofLoss, minutes: 70, activity: 'moderate', terminal: true, outcomes: toChurch, ambientDuring: day29,
        text: 'Три курицы. Хенрике ощипывает их сама, быстро, на кухне: суп. Ничего не пропадёт. Потом вы идёте в церковь, опаздывая.', effects: [set29('c', 'hens'), { place: 'c29_hen', at: 'c3_farm_stock', qty: 3 }, { move: jest29 }, until29(29, 10, 0)] },
    ] }),

  S29({ id: 'c29_assembly', for: 'any', chapter: 'ch3', title: 'Собрание', location: jest29, camp: { at: jest29, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: { tempC: 4, outdoor: false, wet: false },
    text: [
      { text: 'Церковь полна. Холодно так, что пар изо рта. Пастор зажигает первую свечу на большом венке у алтаря и отходит в сторону.' },
      { when: brandt29('ally'), text: 'Перед алтарём встаёт Брандт. Без каски. Говорит долго, глухо. Про плазму. Про двести двенадцать и ноль. Про внука, который не болел. Про впадину у Гарльсторфа, где их сотни.\n\n— In der ersten Frostnacht räumen wir die Senke. Mit der Bundeswehr. Wer mitkommt, meldet sich bei mir.\n\nВ первую морозную ночь мы расчистим впадину. С бундесвером. Кто пойдёт — ко мне.' },
      { when: brandt29('broken'), text: 'Брандта нет. Собрание ведут пастор и Кёлер. Кёлер говорит, что знает: про плазму, про впадину, про всё. Потом встаёт Тобиас в форме и предлагает: в первую морозную ночь — на впадину, с солдатами. Те, внизу, на морозе медленные.' },
      { when: brandt29('hostile'), text: 'Брандт стоит у алтаря и требует тишины. Про пайки, про список, про порядок. Потом встаёт женщина из Люнебурга, та, что пришла пешком, с ребёнком на руках, и говорит про детскую палату, про плазму, про ноль. Брандт пытается её перебить. Не может.' },
      { when: all(not(brandt29('ally')), not(brandt29('broken')), not(brandt29('hostile'))), text: 'Собрание ведёт пастор. Потом встаёт Брандт. Говорит про пайки. Потом встаёт женщина из Люнебурга, пешком пришедшая, и говорит про плазму. Про ноль. В церкви становится так тихо, что слышно, как трещит свеча.' },
      { when: all(A29, v('$.c29_ac', 'speak')), text: 'Потом встаёшь ты. Говоришь по-немецки, медленно, с ошибками. Про колонию в среду. Про ямы с известью. Про впадину, которую видел{m:|а} с холма. Тебя слушают. Никто не перебивает.' },
      { when: all(B29, v('$.c29_bc', 'speak')), text: 'Ханна выходит вперёд, к алтарю. Ты встаёшь рядом. Она говорит про детскую, про столбики температур, про ноль. Голос у неё срывается дважды. Ты держишь её за локоть, и она договаривает.' },
      { text: 'К концу собрания все знают. Правда сказана вслух. Её не забрать обратно.' },
      { when: flag('w.c28_hollow_reported'), text: 'Брандт показывает на карте впадину и старый мост. «Der Lüdemann-Hof hat es zuerst gemeldet». Хутор Людеманов сообщил первым. Несколько голов поворачиваются к вам.' },
      { when: all(v('$.c29_c', 'church'), roofLoss), text: 'Курятник ты так и не {m:разобрал|разобрала}: ушёл{m:|ла} в церковь сразу. Мёртвые куры ждут.' },
      { when: v('$.c29_c', 'hens'), text: 'Руки ещё пахнут курятником, хотя ты {m:мыл|мыла} их дважды.' },
    ],
    actions: [
      { id: 'c29_as_go', label: 'Выйти на воздух', minutes: 20, terminal: true, outcomes: [{ id: 'v', when: all(roofLoss, volkerSeen), goto: 'c29_volker' }, { id: 'h', goto: 'c29_home' }],
        text: 'На паперти мороз и солнце. Люди стоят группами и говорят вполголоса. Кто-то плачет. Кто-то смеётся, слишком громко.', effects: [set29('as', 'go'), w29('truth_public', true), until29(29, 12, 20)] },
    ] }),

  S29({ id: 'c29_volker', for: 'any', chapter: 'ch3', title: 'Фолькер', location: jest29, camp: { at: jest29, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: day29,
    text: [
      { text: 'У церковной ограды стоит Фолькер. Тот, с тележкой и рубероидом. Он видит вас и подходит сам.' },
      { text: '— Die Postfrau aus Tostedt war da. — Он смотрит мимо. — Meine Frau hat noch eine Woche gelebt. Nachdem ich die Tür zugemacht habe. Eine Woche. Sie hat geklopft.\n\nПочтальонша из Тоштедта была здесь. Моя жена прожила ещё неделю. После того, как я закрыл дверь. Неделю. Она стучала.' },
      { text: '— Ich gehe hin. Allein. — Он надевает шапку. — Euer Hühnerdach. Ich hätte es gemacht. Aber ihr hattet keinen Platz. Das ist in Ordnung. Ich hätte auch keinen gehabt.\n\nЯ пойду туда. Один. Ваша крыша курятника. Я бы её сделал. Но у вас не было места. Это нормально. У меня бы тоже не было.' },
    ],
    actions: [
      { id: 'c29_v_food', label: 'Дать ему хлеба в дорогу', minutes: 15, terminal: true, goto: 'c29_home',
        text: 'Он берёт хлеб и кивает. Уходит по дороге на запад, к Тоштедту, с пустой тележкой. Не оборачивается.', effects: [set29('v', 'food'), w29('volker_gone', true), until29(29, 12, 40)] },
      { id: 'c29_v_stay', label: 'Позвать его на хутор: сейчас место есть', minutes: 15, terminal: true, goto: 'c29_home',
        text: 'Фолькер качает головой.\n\n— Zu spät. Für mich. Nicht für euch.\n\nПоздно. Для меня. Не для вас.\n\nОн уходит на запад.', effects: [set29('v', 'stay'), w29('volker_gone', true), until29(29, 12, 40)] },
      { id: 'c29_v_quiet', label: 'Промолчать', minutes: 10, terminal: true, goto: 'c29_home',
        text: 'Вы молчите. Он кивает, будто этого и ждал, и уходит.', effects: [set29('v', 'quiet'), w29('volker_gone', true), until29(29, 12, 30)] },
    ] }),

  S29({ id: 'c29_home', for: 'any', chapter: 'ch3', title: 'Свеча', camp: kitchen14,
    text: [
      { text: 'Обратно идут молча. Дома Хенрике зажигает первую свечу на венке снова: она погасла от сквозняка.' },
      { when: oleAlive29, text: 'Оле сидит у печи. Спрашивает: «Und?» И? Нина рассказывает ему всё, захлёбываясь. Он слушает и кивает.' },
      { when: not(oleAlive29), text: 'На лавке у печи лежит шапка Оле. Хенрике её не убирает.' },
    ],
    actions: [
      { id: 'c29_h_eat', label: 'Пообедать со всеми', minutes: 40, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c29_a_uwe' }, { id: 'b', goto: 'c29_b_pastor' }], ...tableOnly,
        text: 'Суп из кур, если они погибли ночью, или картошка с солониной. Хенрике режет хлеб толсто, по-воскресному.', effects: [set29('h', 'eat'), meal('eat'), until29(29, 14, 0)] },
      { id: 'c29_h_rest', label: 'Лечь на час: ноги не держат', minutes: 5, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c29_a_uwe' }, { id: 'b', goto: 'c29_b_pastor' }],
        text: 'Ты засыпаешь, едва коснувшись подушки.', effects: [set29('h', 'rest'), until29(29, 14, 30, true)] },
    ] }),

  S29({ id: 'c29_evening', for: 'any', chapter: 'ch3', title: 'Вечер адвента', camp: house14,
    text: [
      { text: 'Вечером на кухне собираются все. Свеча на венке горит. Тобиас заходит в шесть, без шапки, и садится к печи, не спрашивая.' },
      { text: '— Die Nacht auf Dienstag. Minus zehn, sagt das Radio. Die Senke. Wer mitkommt, ist um zehn am Feuerwehrhaus. — Он смотрит на вас. — Und wer nicht mitkommt, hält die Höfe am Bahndamm. Wenn wir sie aufscheuchen, laufen sie dahin.\n\nВ ночь на вторник. Минус десять, говорит радио. Впадина. Кто идёт — в десять у пожарной части. А кто не идёт — держит дворы у насыпи. Если мы их спугнём, они побегут туда.' },
      { when: flag('w.c29_tracks_north'), text: 'Ты рассказываешь про следы у опушки: много, в одну сторону, на север. Тобиас слушает и кивает: он знает.' },
      { when: v('$.c29_au', 'how'), text: 'Ты уже знаешь от Уве, как всё будет устроено: факелы, солома, край. Опасен только край.' },
      { when: flag('w.c29_candles_round'), text: 'Сегодня на семи дальних дворах горят свечи. Ты {m:разносил|разносила} их сам{m:|а}.' },
      { text: 'Вечер тёмный, ранний. Свеча на венке горит ровно. Хенрике разливает чай с мёдом, по ложке на кружку, не больше.' },
      { when: v('$.c29_bh2', 'no'), text: 'Ханне ты {m:отказал|отказала}. Сил нет, и это правда. Но правда от этого не легче.' },
    ],
    actions: [
      { id: 'c29_ev_ask', label: 'Спросить Тобиаса, сколько их там', minutes: 30, terminal: true, goto: 'c29_checkpoint',
        text: '— Vierhundert. Fünfhundert. Keiner hat gezählt. — Тобиас греет руки. — Bei minus zehn sind sie langsam. Wie Fliegen im Herbst. Aber es sind viele.\n\nЧетыреста. Пятьсот. Никто не считал. При минус десяти они медленные. Как мухи осенью. Но их много.', effects: [set29('ev', 'ask'), w29('hollow_count', true), finish, until29(29, 19, 0)] },
      { id: 'c29_ev_diesel', label: 'Спросить, что дадут тем, кто пойдёт', minutes: 30, terminal: true, goto: 'c29_checkpoint',
        text: '— Brandt hat den dritten Laster von der Kolonne. Diesel, Fässer. Wer mitgeht, kriegt was. Oder ihr holt es euch später. Wenn keiner mehr fragt.\n\nУ Брандта третий грузовик с колонны. Солярка, бочки. Кто пойдёт, получит. Или возьмёте сами потом. Когда никто уже не будет спрашивать.', effects: [set29('ev', 'diesel'), w29('diesel_known', true), finish, until29(29, 19, 0)] },
      { id: 'c29_ev_quiet', label: 'Слушать молча', minutes: 30, terminal: true, goto: 'c29_checkpoint',
        text: 'Ты слушаешь. Свеча горит. Хенрике вяжет. Нина засыпает на лавке, положив голову Эве на колени.', effects: [set29('ev', 'quiet'), finish, until29(29, 19, 0)] },
    ] }),

  S29({ id: 'c29_checkpoint', for: 'any', chapter: 'ch3', title: 'Воскресенье, семь вечера', checkpoint: 29, universal: false, camp: house14,
    text: [{ when: v('$.c29_ev', 'quiet'), text: 'Ты просидел{m:|а} весь вечер молча, слушая других. Теперь твоя очередь говорить.' }, { text: 'Семь вечера. Свеча на венке догорела до половины. В ночь на вторник — впадина. Вы решаете, где будете в ту ночь. И что попросить за это.' }], actions: [] }),
];
