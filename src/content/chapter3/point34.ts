import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { eldersCome, eldersInHouse, okaforComes } from './point33';

// Участок 34: суббота 5.12, 08:00 → КТ34 воскресенье 6.12, 20:00. Чистый сюжет (жребий: человек из прошлого). План — STOCK_PLAN.md §9.
// Суббота: день работы, Тобиас прощается раньше времени, вечер Николауса, час вдвоём (личное желание `$.c34_wish`).
// Воскресенье (второй адвент): сапоги, служба и списки Красного Креста в Йестебурге — весть из Торонто для Ильзе Брокман
// (по записке B из 19-й), Павел зовёт на восток, Лея и Целле. Ответ Томасу диктует A (только его линия).
export const P34: Cond = all({ cp: 33 }, not({ cp: 34 }));
export const A34: Cond = { me: 'A' };
export const B34: Cond = { me: 'B' };
export const farm34 = 'hof_luedemann';
export const jest34 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point34Available: Cond = all(P34, { at: farm34 }, { partnerAt: farm34 }, up, { partner: 'active' }, flag('w.c33_rule'));
export const own34 = (key: string, value: string): Cond => v(`$.c34_${key}`, value);

export const henrike34: Cond = { npc: 'henrike', alive: true, at: farm34 };
export const tobias34: Cond = { npc: 'c15_tobias', alive: true };
export const lea34: Cond = all({ npc: 'c21_lea', alive: true }, any({ npc: 'c21_lea', at: farm34 }, { npc: 'c21_lea', at: jest34 }));
export const pawel34: Cond = all({ npc: 'pawel', alive: true }, any(flag('A.met.pawel'), flag('B.met.pawel')));
/** Записка Красного Креста о Брокманах: B ответила в 19-й, где видела имя Ильзе, — ответ придёт на хутор. */
export const thomas34: Cond = flag('w.c19_brockmann_answer');
export const coins34: Cond = any(v('w.c27_box', 'open'), v('w.c27_box', 'broken'));
export const ilse34 = (x: string): Cond => v('w.c18_ilse', x);
/** Машину ещё не вернули: возвращают сегодня (едет за ней A). Одинаково в обеих линиях. */
export const carDue34: Cond = all(v('w.c26_car', 'taken'), not(flag('w.c31_car_back')), { itemAt: 'opel_corsa', place: jest34 }, { npc: 'c15_tobias', alive: true });

export const frost34 = { tempC: -4, outdoor: true, wet: false };
export const church34 = { tempC: 9, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm34, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S34 = wrap(P34);
export const set34 = (key: string, value: string | boolean): Effect => ({ set: `$.c34_${key}`, value });
export const w34 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c34_${key}`, value });
/** День 35 — суббота 5.12, день 36 — воскресенье 6.12. */
export const until34 = (d: 35 | 36, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare34: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c34_finished', value: true };
const dayFacts34: Effect[] = [{ if: carDue34, then: [w34('car_due', true)] }];
export const carComing34: Cond = flag('w.c34_car_due');
const afterNoon = [{ id: 'car', when: all(A34, carComing34), goto: 'c34_a_car' }, { id: 'a', when: A34, goto: 'c34_a_after' }, { id: 'b', goto: 'c34_b_after' }];

export const shared34: Scene[] = [
  // ═════════════ Суббота ═════════════
  S34({ id: 'c34_sat', for: 'any', chapter: 'ch3', title: 'Суббота', camp: yard14, ambient: frost34,
    text: [
      { text: 'Утро тихое, морозное и ясное. Над полями поднимается солнце, маленькое и белое. Впервые за неделю никуда не надо ехать.' },
      { when: v('w.c33_rule', 'work'), text: 'Хенрике вывесила на двери кухни лист: кто сегодня на дровах, кто на воде, кто со скотиной. Последние пришедшие — первые в списке. Братья Айдын и старики Петерсены читают его вместе и спорят, кому что.' },
      { when: v('w.c33_rule', 'pot'), text: 'Хенрике вывесила на двери кухни лист: сколько чего осталось. Цифры подчёркнуты. Один котёл на всех — значит, каждый видит, сколько в нём.' },
      { when: v('w.c33_rule', 'yards'), text: 'Каждый двор теперь ест своё. С утра у соседнего двора дымит отдельная труба. Хенрике смотрит на неё долго и ничего не говорит.' },
      { when: eldersInHouse, text: 'Наверху, в комнате стариков, кто-то тихо включает приёмник: марш, потом новости, потом снова марш.' },
    ],
    actions: [
      { id: 'c34_sa_wood', label: 'Пилить дрова пилой Хенрике', when: { has: 'c32_saw' }, minutes: 210, activity: 'heavy', terminal: true, goto: 'c34_noon', ambientDuring: frost34,
        text: 'Пила заводится с третьего рывка и визжит на весь двор. За утро ты распиливаешь три старых сосны с опушки. Хенрике выходит, смотрит на поленницу и кивает: до Нового года хватит.', effects: [set34('sa', 'saw'), ...dayFacts34, { body: 'fatigue', delta: 10 }, until34(35, 12, 0)] },
      { id: 'c34_sa_axe', label: 'Колоть дрова', minutes: 210, activity: 'heavy', terminal: true, goto: 'c34_noon', ambientDuring: frost34,
        text: 'Колун, чурбак, полено. Колун, чурбак, полено. К полудню рубашка мокрая под курткой, а поленница выросла на ладонь.', effects: [set34('sa', 'axe'), ...dayFacts34, { body: 'fatigue', delta: 12 }, until34(35, 12, 0)] },
      { id: 'c34_sa_barn', label: 'Чистить хлев с Хенрике', when: henrike34, minutes: 210, activity: 'moderate', terminal: true, goto: 'c34_noon',
        text: 'Навоз, вилы, свежая солома. Корова смотрит на тебя с подозрением. Хенрике работает молча, а в конце говорит: «Du machst das schon wie eine von hier». Ты делаешь это уже как здешняя.', effects: [set34('sa', 'barn'), ...dayFacts34, npc('henrike', 1), until34(35, 12, 0)] },
      { id: 'c34_sa_elders', label: 'Посидеть со стариками из Бармбека', when: eldersCome, minutes: 210, terminal: true, goto: 'c34_noon',
        text: 'Петерсен рассказывает, как в шестьдесят втором, в наводнение, вода стояла у них на лестнице по второй этаж. Тогда тоже думали, что конец. Фрау Кёрнер вяжет и поправляет его на каждой дате.', effects: [set34('sa', 'elders'), ...dayFacts34, { body: 'stress', delta: -4 }, until34(35, 12, 0)] },
    ] }),

  S34({ id: 'c34_noon', for: 'any', chapter: 'ch3', title: 'Тобиас', camp: kitchen14,
    text: [
      { text: 'Обед. Суп, хлеб, по яйцу на каждого.' },
      { when: tobias34, text: 'В час у ворот «Вольф». Тобиас заходит на кухню, не снимая шапки, садится на край лавки и долго греет руки о кружку.' },
      { when: tobias34, text: '— Ich wollte nur mal schauen. Wie es euch geht.\n\nЯ просто хотел посмотреть. Как вы тут.\n\nОн никогда не приезжал «просто посмотреть». Он смотрит на каждого по очереди: на Хенрике, на Нину, если она здесь, на вас. Как запоминает.' },
      { when: all(tobias34, carComing34), text: '— Und euer Auto. Brandt hat unterschrieben. Ich nehme einen von euch mit, dann fahrt ihr es selbst.\n\nИ ваша машина. Брандт подписал. Я возьму одного из вас с собой, сами и пригоните.' },
      { when: not(tobias34), text: 'После обеда приезжает Лукас: Тобиаса перевели. Куда — не говорят. Он оставил для вас записку: «Passt auf euch auf. T.» Берегите себя.' },
    ],
    actions: [
      { id: 'c34_no_eat', label: 'Поесть и слушать', minutes: 60, terminal: true, outcomes: afterNoon, ...tableOnly,
        text: 'Ты ешь. Тобиас пьёт чай маленькими глотками и рассказывает ни о чём: о погоде, о собаке Брандта, которая боится снега.', effects: [set34('no', 'eat'), meal('eat'), until34(35, 14, 0)] },
      { id: 'c34_no_ask', label: 'Спросить Тобиаса прямо: что случилось?', when: tobias34, minutes: 60, terminal: true, outcomes: afterNoon,
        text: 'Тобиас ставит кружку.\n\n— Nichts. Noch nichts. — Он встаёт. — Wenn am Montag jemand kommt und fragt, wer hier wohnt — dann sagt die Wahrheit. Aber nur das, was gefragt wird.\n\nНичего. Пока ничего. Если в понедельник кто-то приедет и спросит, кто здесь живёт, — говорите правду. Но только то, о чём спросят.\n\nБольше он ничего не говорит.', effects: [set34('no', 'ask'), w34('tobias_warned', true), npc('c15_tobias', 1, 'c34_asked'), until34(35, 14, 0)] },
      { id: 'c34_no_thanks', label: 'Поблагодарить его за всё', when: tobias34, minutes: 60, terminal: true, outcomes: afterNoon,
        text: 'Ты говоришь «спасибо». За колонну, за записки, за то, что тогда, ночью, он не стрелял. Тобиас краснеет, как мальчишка, и уходит к «Вольфу» слишком быстро. У машины оборачивается и поднимает руку.', effects: [set34('no', 'thanks'), npc('c15_tobias', 2, 'c34_thanked'), until34(35, 14, 0)] },
    ] }),

  S34({ id: 'c34_eve', for: 'any', chapter: 'ch3', title: 'Николаус', camp: kitchen14, onEnter: [until34(35, 17, 0)],
    text: [
      { text: 'Вечером Хенрике выставляет у двери в сени сапоги. Все, какие есть в доме. Сегодня ночь Николауса: утром в сапогах должно что-то оказаться.' },
      { when: ninaFarm, text: 'Нина говорит, что ей пятнадцать и это для маленьких. Смеётся над собой. Потом всё-таки ставит свой сапог у двери, с краю, и отворачивается, чтобы никто не видел.' },
      { when: v('w.c32_nina', 'winsen'), text: 'Хенрике ставит у двери и маленькие резиновые сапоги Нины. Её здесь нет. Хенрике их всё равно ставит.' },
      { when: eldersCome, text: 'Старики Петерсены поют. Сначала тихо, потом громче: «Lasst uns froh und munter sein». Фрау Кёрнер отбивает такт ложкой о стол.' },
      { when: okaforComes, text: 'Окафор не знает слов и подпевает без слов. Фуфу сидит у него на коленях и смотрит на свечу.' },
      { when: evaHere, text: 'Эва крестит сапоги, все по очереди.' },
    ],
    actions: [
      { id: 'c34_ev_boot', label: 'Поставить и свой сапог', minutes: 60, terminal: true, goto: 'c34_two',
        text: 'Ты ставишь свой сапог рядом с остальными. Глупо. Хорошо.', effects: [set34('ev', 'boot'), { body: 'stress', delta: -4 }, until34(35, 19, 0)] },
      { id: 'c34_ev_sing', label: 'Петь со всеми', minutes: 60, terminal: true, goto: 'c34_two',
        text: 'Слов ты не знаешь. Петерсен диктует тебе их по строчке, как в школе. На третьем куплете ты уже поёшь.', effects: [set34('ev', 'sing'), { body: 'stress', delta: -5 }, until34(35, 19, 0)] },
      { id: 'c34_ev_gift', label: 'Положить что-нибудь в чужие сапоги, пока никто не видит', minutes: 60, terminal: true, goto: 'c34_two',
        text: 'Ты дожидаешься, пока все уйдут из сеней. В каждый чужой сапог — по яблоку из подвала. Хенрике видит тебя из кухни. Ничего не говорит. Только прикладывает палец к губам.', effects: [set34('ev', 'gift'), set34('gave_apples', true), npc('henrike', 1), until34(35, 19, 0)] },
    ] }),

  S34({ id: 'c34_two', for: 'any', chapter: 'ch3', title: 'Час вдвоём', camp: house14,
    text: [
      { text: 'Поздно вечером вы остаётесь вдвоём. Наверху, в комнате, свеча на подоконнике. За стеной кто-то храпит. Впервые за много дней вам некуда спешить.' },
      { text: '{partner} спрашивает тихо, глядя в потолок: а если бы можно было куда угодно — куда? Не сейчас. Вообще.' },
    ],
    actions: [
      { id: 'c34_tw_stay', label: 'Сказать: сюда. Здесь. Пережить зиму и посадить картошку', minutes: 60, terminal: true, goto: 'c34_sun',
        text: 'Ты говоришь это и удивляешься сам{m:|а}: это правда. Хутор, печь, Хенрике со своими списками. {partner} молчит долго. Потом находит твою руку.', effects: [set34('wish', 'stay'), { body: 'stress', delta: -6 }, until34(35, 22, 0), until34(36, 7, 30, true)] },
      { id: 'c34_tw_east', label: 'Сказать: на восток. Туда, где, говорят, есть ток и закон', minutes: 60, terminal: true, goto: 'c34_sun',
        text: 'Ты говоришь про колонну, про Павла, про то, что где-то, может быть, всё по-прежнему. {partner} слушает и не перебивает. Потом говорит: «Может быть». Это не «нет».', effects: [set34('wish', 'east'), { body: 'stress', delta: -4 }, until34(35, 22, 0), until34(36, 7, 30, true)] },
      { id: 'c34_tw_north', label: 'Сказать: на север. За Эльбу. К тем, кто там остался', minutes: 60, terminal: true, goto: 'c34_sun',
        text: 'Ты говоришь про Гамбург, про Мерле, про дом, где на лестнице когда-то была вся ваша жизнь. {partner} поворачивается к тебе и долго смотрит в темноте.', effects: [set34('wish', 'north'), { body: 'stress', delta: -4 }, until34(35, 22, 0), until34(36, 7, 30, true)] },
      { id: 'c34_tw_none', label: 'Не отвечать. Просто лежать рядом', minutes: 60, terminal: true, goto: 'c34_sun',
        text: 'Ты не отвечаешь. {partner} не переспрашивает. Свеча догорает, и вы засыпаете, так и не решив, куда.', effects: [set34('wish', 'none'), { body: 'stress', delta: -6 }, until34(35, 22, 0), until34(36, 7, 30, true)] },
    ] }),

  // ═════════════ Воскресенье ═════════════
  S34({ id: 'c34_sun', for: 'any', chapter: 'ch3', title: 'Второй адвент', camp: kitchen14,
    text: [
      { text: 'Утром в сапогах у двери — по яблоку из подвала.' },
      { when: coins34, text: 'И в каждом, ещё глубже, по шоколадной монете в золотой фольге. Монеты Тима из его коробки.' },
      { when: all(coins34, { npc: 'kasia', alive: true, at: farm34 }), text: 'Кася раскладывала их ночью, по одной, и теперь делает вид, что спит.' },
      { when: not(coins34), text: 'И в каждом, ещё глубже, по горсти лесных орехов. Хенрике собирала их в сентябре и прятала до этого утра.' },
      { when: ninaFarm, text: 'Нина достаёт яблоко из своего сапога и держит его двумя руками, как что-то очень хрупкое.' },
      { text: 'Сегодня второй адвент. В Йестебурге служба в десять, а после неё у пожарной части читают списки Красного Креста.' },
    ],
    actions: [
      { id: 'c34_su_go', label: 'Идти в Йестебург со всеми', minutes: 120, terminal: true, goto: 'c34_church', ambientDuring: frost34,
        text: 'Вы идёте пешком, все вместе, по укатанной дороге. Старики едут на тракторной тележке, укутанные в одеяла.', effects: [set34('su', 'go'), { move: jest34 }, until34(36, 10, 0)] },
      { id: 'c34_su_eat', label: 'Сначала позавтракать, потом догнать', minutes: 120, terminal: true, goto: 'c34_church', ...tableOnly,
        text: 'Ты ешь наспех, стоя. Догоняешь своих уже у въезда в Йестебург.', effects: [set34('su', 'eat'), meal('eat'), { move: jest34 }, until34(36, 10, 0)] },
    ] }),

  S34({ id: 'c34_church', for: 'any', chapter: 'ch3', title: 'Списки', location: jest34, camp: { at: jest34, stock: 'c3_farm_stock', rest: false }, ambient: church34,
    text: [
      { text: 'Церковь полна. Пастор говорит коротко, о терпении. Две свечи на венке. После службы все идут к пожарной части. Лукас забирается на ящик с листом в руках и читает в мегафон, что передал Красный Крест по радио: кого ищут, кто нашёлся.' },
      { when: thomas34, text: '— …Für Ilse und Gerd Brockmann, Buchholz, oder wer von ihnen weiß, über den Lüdemann-Hof bei Jesteburg: Nachricht aus Toronto. Thomas Brockmann fragt, ob seine Eltern leben. Er bittet um Antwort über das DRK.\n\nДля Ильзе и Герда Брокман из Бухгольца или для тех, кто о них знает, через хутор Людеманов у Йестебурга: весть из Торонто. Томас Брокман спрашивает, живы ли его родители. Просит ответить через Красный Крест.' },
      { when: thomas34, text: 'Люди оглядываются на вас. Ответ можно продиктовать сегодня, у стола Красного Креста в пункте.' },
      { when: pawel34, text: '— …Paweł, an die Leute vom Lüdemann-Hof: Kolonne nach Osten am zehnten Dezember ab Winsen. Platz für zwei. Er wartet.\n\nПавел — людям с хутора Людеманов: колонна на восток десятого декабря из Винзена. Место на двоих. Он ждёт.' },
      { when: lea34, text: '— …Hartmann, Lea, Hannover: in den Listen von Celle sind Margit und Finn Hartmann nicht verzeichnet.\n\nХартман, Лея, Ганновер: в списках Целле Маргит и Финн Хартман не значатся.\n\nЛея стоит рядом с тобой. Она не плачет. Она очень прямо стоит.' },
      { when: okaforComes, text: '— …Kolonne nach Ahrensburg: zehnter Dezember, sieben Uhr, Geesthacht. Begleitpersonen melden sich bei Dr. Zander.\n\nКолонна на Аренсбург: десятого декабря, семь утра, Гестхахт. Сопровождающим — к доктору Зандер. Окафор рядом с тобой кивает сам себе.' },
    ],
    actions: [
      { id: 'c34_ch_thomas', label: 'Пойти к столу Красного Креста: отвечать Томасу', when: all(A34, thomas34), minutes: 30, terminal: true, goto: 'c34_a_thomas',
        text: 'У стола в пункте женщина с карандашом. Перед ней бланк: «An: Thomas Brockmann, Toronto. Von: …». Она ждёт, что ты скажешь.', effects: [set34('ch', 'thomas')] },
      { id: 'c34_ch_lea', label: 'Встать рядом с Леей', when: lea34, minutes: 60, terminal: true, goto: 'c34_home',
        text: 'Ты стоишь рядом. Ничего не говоришь. Через минуту Лея говорит сама:\n\n— Nicht verzeichnet heißt nicht tot. Heißt nur: nicht dort.\n\nНе значатся — не значит мертвы. Значит только: не там.\n\nИ берёт тебя под руку на обратном пути.', effects: [set34('ch', 'lea'), npc('c21_lea', 2, 'c34_stood_by'), until34(36, 12, 30)] },
      { id: 'c34_ch_home', label: 'Идти домой', minutes: 60, terminal: true, goto: 'c34_home', ambientDuring: frost34,
        text: 'Обратно идут медленно, молча. Каждый несёт услышанное, как воду в ладонях.', effects: [set34('ch', 'home'), until34(36, 12, 30)] },
    ] }),

  S34({ id: 'c34_home', for: 'any', chapter: 'ch3', title: 'Воскресенье', camp: kitchen14, onEnter: [until34(36, 13, 0)],
    text: [
      { text: 'Воскресный обед. Хенрике достаёт из подвала банку вишнёвого компота, последнюю, и разливает всем по полстакана.' },
      { when: pawel34, text: 'За столом говорят про колонну на восток. Место на двоих. Хенрике не говорит ничего, только режет хлеб тоньше обычного.' },
      { when: okaforComes, text: 'Окафор говорит, что пойдёт десятого за Мерле. Если Зандер даст пропуск. Если не даст — тоже пойдёт.' },
    ],
    actions: [
      { id: 'c34_ho_eat', label: 'Поесть', minutes: 60, terminal: true, goto: 'c34_dusk', ...tableOnly,
        text: 'Компот кислый и сладкий сразу. Пахнет летом.', effects: [set34('ho', 'eat'), meal('eat'), until34(36, 15, 0)] },
      { id: 'c34_ho_walk', label: 'Выйти пройтись вдоль поля', minutes: 90, terminal: true, goto: 'c34_dusk', ambientDuring: frost34,
        text: 'Поле белое до самого леса. Следы зайца, следы лисы, следы трактора. Ты идёшь до межевого камня и обратно. Думать там легче.', effects: [set34('ho', 'walk'), { body: 'stress', delta: -3 }, until34(36, 15, 0)] },
    ] }),

  S34({ id: 'c34_dusk', for: 'any', chapter: 'ch3', title: 'Вечер', camp: kitchen14, onEnter: [until34(36, 17, 0)],
    text: [
      { text: 'Вечер второго адвента. Две свечи на венке, который сплела Нина. За окном снова мороз.' },
      { text: 'Десятое декабря. Колонна на восток. Колонна на север. Или хутор и зима. Никто не говорит этого вслух, но думают все.' },
    ],
    actions: [
      { id: 'c34_du_eat', label: 'Поужинать', minutes: 60, terminal: true, goto: 'c34_checkpoint', ...tableOnly,
        text: 'Картошка с салом. Ты ешь и смотришь, как горят две свечи.', effects: [set34('du', 'eat'), meal('eat'), finish, until34(36, 20, 0)] },
      { id: 'c34_du_partner', label: 'Сесть рядом с {partner.ins}', minutes: 60, terminal: true, goto: 'c34_checkpoint',
        text: 'Ты садишься рядом. {partner} не спрашивает, о чём ты думаешь. Знает.', effects: [set34('du', 'partner'), { body: 'stress', delta: -3 }, finish, until34(36, 20, 0)] },
    ] }),

  S34({ id: 'c34_checkpoint', for: 'any', chapter: 'ch3', title: 'Воскресенье, вечер', checkpoint: 34, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. До десятого четыре дня. Куда вы смотрите — пока только смотрите.' }], actions: [] }),
];
