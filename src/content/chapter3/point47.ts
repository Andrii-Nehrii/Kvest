import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { brothersCome, oleHome33 } from './point33';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v, ninaFarm } from './point18';
import { kasiaLate } from './house28';
import { npc, tableOnly } from './point19';
import { felix46, hamburg46, henrike46, merle46 } from './point46';

// Участок 47 «Лесополоса»: сб 26.12, 06:30 → КТ47 вс 27.12, 20:00. Опасность (на кону настоящая потеря), ресурс — еда, находка A.
// Суббота: Брандт прочёсывает лесополосу перед Сильвестром (следы и шаги из 46-й), все дворы шлют людей. Порознь на часть:
// A — в цепи через лесополосу к брошенному Вальдхофу Штёверов (охотничий шкаф с замком из четырёх зверей — подсказка на вывеске
// над крыльцом в обязательной сцене «Поляна»; погреб — еда для берега; сарай с сеном и фонарь; дележ у Брандта), B — медпункт
// на краю лесополосы (раны, укус у Карстена Тиде и его сын Бьёрн, мёртвый, которого цепь выгнала из леса к палатке).
// Цепочка опасности на каждой линии: синяк → кровь → выбывание (`$.c47_hurt1`, `$.c47_hurt2`, `down47`); осторожный не выбывает.
// Воскресенье вместе: ответ Брандту о Сильвестре (`w.c46_silvester`), сборы к колонне 28-го, Яннес у фрау Ханзен.
// КТ47: доля еды из Вальдхофа (`c3_new_cellar47`) и ночные посты до Нового года (`c3_new_posts47`).
export const P47: Cond = all({ cp: 46 }, not({ cp: 47 }));
export const A47: Cond = { me: 'A' };
export const farm47 = 'hof_luedemann';
export const jest47 = 'c16_jesteburg';
export const wood47 = 'c47_wood';
export const waldhof47 = 'c47_waldhof';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played46: Cond = any(flag('A.c46_finished'), flag('B.c46_finished'));
const base47: Cond = all(P47, played46, { at: farm47 }, { partnerAt: farm47 }, up, { partner: 'active' });
export const point47Available: Cond = base47;

export const henrike47 = henrike46;
export const merle47 = merle46;
export const felix47 = felix46;
export const hamburg47 = hamburg46;
export const silvester47 = (x: string): Cond => v('w.c46_silvester', x);
export const own47 = (key: string, value: string): Cond => v(`$.c47_${key}`, value);
export const worse1: Cond = flag('$.c47_hurt1');
export const worse2: Cond = flag('$.c47_hurt2');

export const frost47 = { tempC: -7, outdoor: true, wet: false };
export const sun47 = { tempC: -4, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm47, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S47 = wrap(P47);
export const set47 = (key: string, value: string | boolean): Effect => ({ set: `$.c47_${key}`, value });
export const w47 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c47_${key}`, value });
export const until47 = (d: 56 | 57, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare47: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed47 = (n = 30): Effect[] => [{ body: 'hunger', delta: -n }, { body: 'thirst', delta: -25 }];
/** Первое звено: терпимо. */
export const hurt1: Effect[] = [set47('hurt1', true), { injure: 'bruise', site: 'leftLeg', severity: 2 }, { body: 'stress', delta: 4 }, { body: 'fatigue', delta: 6 }];
/** Второе звено: тяжело, но на ногах. */
export const hurt2: Effect[] = [set47('hurt2', true), { injure: 'cut', site: 'leftArm', severity: 3, bleeding: 1 }, { body: 'bloodLoss', delta: 18 }, { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 6 }];
/** Третье звено: выбывание. Удар головой, кровь, холод. Выбывшего приносят домой. Спасать — в 48-й. */
export const down47: Effect[] = [{ injure: 'laceration', site: 'head', severity: 4, bleeding: 3 }, { body: 'bloodLoss', delta: 58 }, { body: 'stress', delta: 10 }, set47('down', true), w47('down', true), { move: farm47 }];
/** Рискованный ход: при двух прежних ранах — выбывание; иначе ловкость решает, а при неудаче — следующее звено. */
export const risk47 = (id: string, down: string, ok: string, second: string, first: string, okEffects: Effect[] = []) => [
  { id: `${id}_down`, when: worse2, text: down, effects: down47 },
  { id: `${id}_ok`, check: { traits: ['agility' as const, 'strength' as const], difficulty: 5, uses: ['mobility' as const] }, text: ok, effects: okEffects },
  { id: `${id}_2`, when: worse1, text: second, effects: hurt2 },
  { id: `${id}_1`, text: first, effects: hurt1 },
];
const finish: Effect = { set: '$.c47_finished', value: true };
const toJest: Effect = { move: jest47 };
const toFarm: Effect = { move: farm47 };
const split = [{ id: 'a', when: A47, goto: 'c47_a_line' }, { id: 'b', goto: 'c47_b_edge' }];

export const shared47: Scene[] = [
  S47({ id: 'c47_dawn', for: 'any', chapter: 'ch3', title: 'Суббота', camp: kitchen14,
    text: [
      { text: 'Шесть утра, ещё темно. В калитку стучит Лукас, без шапки, с красными ушами. Брандт собирает людей: в восемь — у лесополосы, прочёсывать. От каждого двора — кто может держать топор или вилы. И медсестру — на край, с бинтами.' },
      { text: '— Nach gestern Nacht. Am Waldstreifen haben zwei Höfe Spuren gesehen. Brandt sagt: vor Silvester muss da Ruhe sein.\n\nПосле прошлой ночи. У лесополосы два двора видели следы. Брандт говорит: до Сильвестра там должно быть тихо.' },
      { when: henrike47, text: 'Хенрике молча ставит на стол хлеб и сало и наливает две кружки. Потом третью, для Лукаса.' },
    ],
    actions: [
      { id: 'c47_dw_eat', label: 'Плотно позавтракать: день будет длинный', minutes: 40, terminal: true, outcomes: split, ...tableOnly,
        text: 'Хлеб, сало, горячая каша, чай. Ты ешь, не чувствуя вкуса, и смотришь, как светлеет окно. {partner} напротив делает то же самое.', effects: [set47('dw', 'eat'), meal('eat'), until47(56, 7, 15)] },
      { id: 'c47_dw_gear', label: 'Собрать снаряжение: фонарь, верёвка, перчатки, нож', minutes: 40, terminal: true, outcomes: split,
        text: 'Фонарь заряжен, верёвка смотана, перчатки толстые, нож на поясе. Ты раскладываешь всё на лавке и проверяешь дважды. {partner} смотрит и молча кладёт тебе в карман ещё бинт.', effects: [set47('dw', 'gear'), w47('geared', true), { body: 'hunger', delta: -15 }, until47(56, 7, 15)] },
      { id: 'c47_dw_talk', label: 'Договориться с {partner.ins}: никуда в одиночку, ни при каком раскладе', minutes: 40, terminal: true, outcomes: split,
        text: '— Ни в одиночку. Ни за кем. Ни за чем. — Ты говоришь это и чувствуешь себя глупо. {partner} кивает и не смеётся. «И ты тоже». Вы жмёте руки, как перед экзаменом.', effects: [set47('dw', 'talk'), w47('promise', true), { body: 'hunger', delta: -15 }, until47(56, 7, 15)] },
      { id: 'c47_dw_henrike', label: 'Спросить Хенрике, что за двор в конце лесополосы', when: henrike47, minutes: 40, terminal: true, outcomes: split,
        text: 'Вальдхоф. Штёверы. Старик был охотник, держал кружок, по воскресеньям стрелял на опушке. Уехали в ноябре к дочери в Целле, на машине, ночью. «Der Keller war immer voll. Stöver hat nie was weggegeben». Погреб у них всегда был полный. Штёвер никогда ничего не отдавал.', effects: [set47('dw', 'henrike'), w47('know_waldhof', true), { body: 'hunger', delta: -15 }, until47(56, 7, 15)] },
    ] }),

  // ── Субботний вечер, вместе (каждый знает только своё) ──
  S47({ id: 'c47_eve', for: 'any', chapter: 'ch3', title: 'Вечер субботы', camp: kitchen14,
    text: [
      { text: 'Стемнело в четыре. В кухне тепло, на плите кипит вода. Сапоги у двери в снегу и в грязи, куртки на крючках пахнут лесом и дымом.' },
      { text: 'Брандт прислал Лукаса сказать: лесополоса пройдена. Кого нашли — сожгли на опушке. Завтра утром — к нему, с ответом про Сильвестр.' },
      { when: worse1, text: 'Нога ноет. Синяк на полбедра, жёлтый по краям.' },
      { when: worse2, text: 'Рука под повязкой горит. Кровь остановилась, но пальцы слушаются плохо.' },
    ],
    actions: [
      { id: 'c47_ev_wash', label: 'Отмыться горячей водой и переодеться', minutes: 45, terminal: true, goto: 'c47_supper',
        text: 'Таз, мыло, горячая вода. Лес, дым и чужой страх смываются не сразу. Ты меняешь воду дважды.', effects: [set47('ev', 'wash'), { body: 'stress', delta: -5 }, until47(56, 17, 30)] },
      { id: 'c47_ev_wound', label: 'Перевязать как следует свою руку', when: worse2, minutes: 45, terminal: true, goto: 'c47_supper',
        text: 'Ты разматываешь бинт. Порез глубокий, но чистый. Хенрике держит лампу, ты промываешь, стягиваешь края пластырем, бинтуешь заново. Больно до слёз. Потом лучше.', effects: [set47('ev', 'wound'), { treat: 'basic' }, until47(56, 17, 30)] },
      { id: 'c47_ev_tell', label: 'Рассказать {partner.dat}, что было у тебя', minutes: 45, terminal: true, goto: 'c47_supper',
        text: 'Ты рассказываешь, и {partner} слушает, не перебивая. Потом рассказывает своё. Два разных дня, на расстоянии километра друг от друга.', effects: [set47('ev', 'tell'), until47(56, 17, 30)] },
      { id: 'c47_ev_sit', label: 'Сесть у печки и просто сидеть', minutes: 45, terminal: true, goto: 'c47_supper',
        text: 'Ты сидишь, вытянув ноги к огню. Руки ещё помнят топор или бинты. Кто-то ставит рядом кружку чая. Ты не видишь, кто.', effects: [set47('ev', 'sit'), { body: 'fatigue', delta: -5 }, until47(56, 17, 30)] },
    ] }),

  S47({ id: 'c47_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин. За столом мало говорят. Дети, которые весь день сидели дома под присмотром Хенрике, чувствуют это и тоже молчат.' },
      { when: kasiaLate, text: 'Кася чинит у лампы варежки, все подряд, чьи найдёт на печке. Говорит, что руки должны быть заняты, иначе думают сами.' },
      { when: all(ninaFarm, any(flag('w.c23_nina_bandage'), flag('w.c35_b_handover'))), text: 'Нина перевязывает сбитые руки тем, кто вернулся из лесополосы: туго, ровно, как её учили. Никто не просит её отойти.' },
      { when: oleHome33, text: 'Оле слушает, кто что видел в лесополосе, и молчит. Потом встаёт проверить засов, второй раз за вечер.' },
      { when: ninaFarm, text: 'Нина весь день просидела с младшими и рассказывала им, что взрослые ушли искать кошку. Дети делают вид, что верят. Нина делает вид, что верит им.' },
      { when: flag('w.c45_dog'), text: 'Луна обходит всех, кто вернулся из лесополосы, и нюхает руки. На одних задерживается дольше и тихо рычит. Потом уходит под лавку.' },
      { when: all({ npc: 'c21_lea', alive: true, at: 'hof_luedemann' }, not(flag('w.c41_lea_gone'))), text: 'Лея перевязывает тем, кто пришёл из лесополосы, сбитые руки. Молча, быстро, как будто всю жизнь только это и делала.' },
      { when: all(v('w.c39_strangers', 'barn'), not(flag('w.c40_left_army')), v('w.c41_jorg', 'stay')), text: 'Йорг весь день колол дрова за двоих и ни о чём не спрашивал. Только за ужином спрашивает одно: все ли вернулись.' },
      { when: hamburg47, text: 'Мерле складывает рюкзак в углу. Послезавтра в семь — школа в Винзене. Завтра последний день.' },
    ],
    actions: [
      { id: 'c47_su_eat', label: 'Поужинать со всеми', minutes: 50, terminal: true, goto: 'c47_sat_night', ...tableOnly,
        text: 'Картошка, капуста, по ломтю хлеба. Ты ешь и понемногу оттаиваешь изнутри.', effects: [set47('su', 'eat'), meal('eat'), until47(56, 19, 0)] },
      { id: 'c47_su_kids', label: 'Рассказать детям что-нибудь смешное, чтобы они перестали молчать', minutes: 50, terminal: true, goto: 'c47_sat_night',
        text: 'Ты рассказываешь, как Лукас утром прибежал без шапки и как у него от холода уши стали как у кролика. Младший смеётся первым. Потом все.', effects: [set47('su', 'kids'), { body: 'hunger', delta: -15 }, { body: 'stress', delta: -4 }, until47(56, 19, 0)] },
      { id: 'c47_su_bread', label: 'Поесть хлеба с салом у печки, без разговоров', minutes: 40, terminal: true, goto: 'c47_sat_night',
        text: 'Хлеб, сало, луковица, кружка чая. Ты ешь у печки, глядя в огонь. Никто не трогает. Это лучший ужин за неделю, хотя он хуже всех.', effects: [set47('su', 'bread'), { body: 'hunger', delta: -25 }, until47(56, 19, 0)] },
      { id: 'c47_su_merle', label: 'Посидеть с Мерле над её рюкзаком', when: hamburg47, minutes: 50, terminal: true, goto: 'c47_sat_night',
        text: 'Мерле показывает, что взяла. Ты добавляешь варежки и пачку сухарей. Она говорит: «Ich hab keine Angst. Ich hab nur keine Lust». Мне не страшно. Мне просто не хочется.', effects: [set47('su', 'merle'), { body: 'hunger', delta: -20 }, until47(56, 19, 0)] },
      { id: 'c47_su_count', label: 'Перебрать, что принесли из леса, и записать', minutes: 50, terminal: true, goto: 'c47_sat_night',
        text: 'Ты записываешь на обороте календаря, что прибавилось и что убыло за день. Цифры маленькие. Но столбец прихода длиннее, чем был утром.', effects: [set47('su', 'count'), { body: 'hunger', delta: -20 }, until47(56, 19, 0)] },
    ] }),

  S47({ id: 'c47_sat_night', for: 'any', chapter: 'ch3', title: 'Ночь на воскресенье', camp: house14,
    text: [
      { text: 'Дом засыпает рано. За окном мороз и звёзды. Со стороны лесополосы тихо. Совсем.' },
    ],
    actions: [
      { id: 'c47_sn_sleep', label: 'Спать', minutes: 30, terminal: true, goto: 'c47_sun',
        text: 'Ты засыпаешь сразу. Ночью снится лес, в котором все деревья стоят спиной.', effects: [set47('sn', 'sleep'), { body: 'fatigue', delta: -6 }, until47(57, 8, 0, true)] },
      { id: 'c47_sn_listen', label: 'Полежать и послушать тишину со стороны леса', minutes: 45, terminal: true, goto: 'c47_sun',
        text: 'Ты лежишь и слушаешь. Ничего. Ветка, скрип снега под чьими-то шагами на посту. Колокол молчит. Ты засыпаешь, так и не дождавшись звука, которого ждёшь.', effects: [set47('sn', 'listen'), until47(57, 8, 0, true)] },
      { id: 'c47_sn_partner', label: 'Обнять {partner.acc} и не отпускать', minutes: 45, terminal: true, goto: 'c47_sun',
        text: 'Ты прижимаешься к {partner.dat} спиной к груди или лицом к плечу, как получится. {partner} дышит ровно. Ты засыпаешь под это дыхание.', effects: [set47('sn', 'partner'), { body: 'stress', delta: -6 }, until47(57, 8, 0, true)] },
    ] }),

  // ═════════════ Воскресенье ═════════════
  S47({ id: 'c47_sun', for: 'any', chapter: 'ch3', title: 'Воскресенье', camp: kitchen14,
    text: [
      { text: 'Воскресенье, двадцать седьмое. Солнце. Над лесополосой поднимается тонкий дым: на опушке догорает то, что вчера жгли.' },
      { text: 'Брандт ждёт с ответом до обеда.' },
    ],
    actions: [
      { id: 'c47_sd_eat', label: 'Позавтракать', minutes: 40, terminal: true, goto: 'c47_brandt', ...tableOnly,
        text: 'Каша, чай. После вчерашнего каша кажется праздником.', effects: [set47('sd', 'eat'), meal('eat'), toJest, until47(57, 9, 55)] },
      { id: 'c47_sd_yard', label: 'Сначала обойти двор: куры, вода, забор', minutes: 45, terminal: true, goto: 'c47_brandt', ambientDuring: sun47,
        text: 'Куры, вода, засов на сарае. У забора со стороны поля следов нет. Ты проверяешь проволоку с банками: целая. Возвращаешься к завтраку, оставленному на краю плиты.', effects: [set47('sd', 'yard'), { body: 'hunger', delta: -20 }, toJest, until47(57, 9, 55)] },
      { id: 'c47_sd_rest', label: 'Полежать ещё полчаса: тело просит', minutes: 45, terminal: true, goto: 'c47_brandt',
        text: 'Ты лежишь и смотришь в потолок. Тело ноет в местах, о которых ты не {m:знал|знала}. Потом встаёшь и ешь, что оставили.', effects: [set47('sd', 'rest'), { body: 'fatigue', delta: -6 }, { body: 'hunger', delta: -15 }, toJest, until47(57, 9, 55)] },
    ] }),

  S47({ id: 'c47_brandt', for: 'any', chapter: 'ch3', title: 'К Брандту', location: jest47, camp: { at: jest47, stock: 'c3_farm_stock', rest: false }, ambient: sun47,
    text: [
      { text: 'Пожарная часть. Поленница для Сильвестра уже выше крыши гаража. Брандт сидит в дежурке с картой лесополосы, на которой крестиками отмечено вчерашнее.' },
      { when: flag('w.c41_trench_men'), text: 'Брандт встречает вас иначе, чем остальных: двое с вашего двора копали ров за ручьями перед Рождеством. Он тогда сказал, что не забудет. Не забыл.' },
      { when: flag('w.c45_fenja_radio'), text: 'Между делом Брандт говорит, не поднимая глаз от карты: по рации из Винзена — нашёлся мужчина из Драге, который искал жену и детей. Лежал с переломом в школе, без документов. Его везут к ним после Нового года.' },
      { when: silvester47('go'), text: 'Вы говорите: двор будет, стража вокруг площади — ваша. Брандт кивает, будто иначе и быть не могло, и вписывает вас в список.' },
      { when: silvester47('some'), text: 'Вы говорите: придёт часть двора, остальные останутся у колокола. Брандт морщится. «Halb ist auch was». Половина — тоже что-то.' },
      { when: silvester47('stay'), text: 'Вы говорите: ваш двор в Сильвестр дома. Брандт долго смотрит на вас. «Dann macht es ein anderer». Тогда сделает другой. Запоминает. Это видно.' },
      { when: silvester47('quiet'), text: 'Вы говорите про фейерверк, про лесополосу, про три поста с колоколом со стороны леса. Брандт слушает, барабаня пальцами по карте. Потом смотрит на крестики. «Nach gestern… Gut. Kein Feuerwerk. Drei Posten. Aber das Feuer bleibt». После вчерашнего… Ладно. Без фейерверка. Три поста. Но огонь остаётся.' },
    ],
    actions: [
      { id: 'c47_br_map', label: 'Посмотреть на карту: где вчера кого нашли', minutes: 45, terminal: true, goto: 'c47_pack',
        text: 'Семь крестиков. Пять в лесополосе, один у Вальдхофа, один у самой дороги. Брандт ставит восьмой карандашом, со знаком вопроса: там видели, но не нашли. Это у дерева с обломанной веткой.', effects: [set47('br', 'map'), w47('map_seen', true), toFarm, until47(57, 11, 30)] },
      { id: 'c47_br_posts', label: 'Спросить, кто будет на постах в Сильвестр со стороны леса', minutes: 45, terminal: true, goto: 'c47_pack',
        text: 'Брандт перечисляет: Яннес, двое с колонии, кто-то от Вессельса. «Und einer von euch, wenn ihr wollt». И один из вас, если хотите. Он не настаивает. Это хуже, чем если бы настаивал.', effects: [set47('br', 'posts'), toFarm, until47(57, 11, 30)] },
      { id: 'c47_br_lukas', label: 'Отвести Брандта в сторону: про ракеты Лукаса', minutes: 45, terminal: true, goto: 'c47_pack',
        text: 'Брандт не знал. Он идёт в гараж и выносит оттуда коробку с ракетами, под мышкой, как кота. Лукас смотрит ему вслед с таким лицом, что тебе почти стыдно. Почти.', effects: [set47('br', 'lukas'), w47('rockets_taken', true), toFarm, until47(57, 11, 30)] },
      { id: 'c47_br_home', label: 'Сказать, что нужно, и сразу домой', minutes: 30, terminal: true, goto: 'c47_pack', ambientDuring: sun47,
        text: 'Коротко, по делу. Брандт кивает. Вы выходите на мороз, и через полчаса уже видна крыша хутора.', effects: [set47('br', 'home'), toFarm, until47(57, 11, 15)] },
    ] }),

  S47({ id: 'c47_pack', for: 'any', chapter: 'ch3', title: 'Сборы', camp: kitchen14,
    text: [
      { when: hamburg47, text: 'После обеда — последние сборы. Завтра в семь колонна: Мерле и {B}. Рюкзаки у двери, сумка-холодильник на подоконнике, флаконы в вате.' },
      { when: not(hamburg47), text: 'После обеда — дела на неделю: дрова, вода, проволока у забора, лампы. До Нового года четыре дня.' },
    ],
    actions: [
      { id: 'c47_pk_lunch', label: 'Пообедать со всеми', minutes: 50, terminal: true, goto: 'c47_hansen', ...tableOnly,
        text: 'Суп и хлеб. За столом обсуждают Сильвестр так, будто он уже прошёл, и спорят, кто что видел.', effects: [set47('pk', 'lunch'), meal('eat'), until47(57, 13, 30)] },
      { id: 'c47_pk_bags', label: 'Проверить рюкзаки к колонне ещё раз', when: hamburg47, minutes: 60, terminal: true, goto: 'c47_hansen',
        text: 'Носки, свитер, бельё, флаконы, шприцы, листок с единицами, пропуск Тобиаса в нагрудный карман. Ты проверяешь всё и застёгиваешь клапан. Потом расстёгиваешь и проверяешь снова.', effects: [set47('pk', 'bags'), w47('bags_ready', true), { body: 'hunger', delta: -15 }, until47(57, 13, 30)] },
      { id: 'c47_pk_wood', label: 'Наколоть дров на неделю вперёд', minutes: 60, terminal: true, goto: 'c47_hansen', ambientDuring: sun47, activity: 'heavy',
        text: 'Колода, топор, мёрзлые чурки. Поленница растёт. Если кто-то уедет на неделю, дров должно хватить на всех, кто остаётся.', effects: [set47('pk', 'wood'), { body: 'fatigue', delta: 6 }, { body: 'hunger', delta: -10 }, until47(57, 13, 30)] },
      { id: 'c47_pk_lamps', label: 'Заправить лампы и проверить фонари на неделю', minutes: 60, terminal: true, goto: 'c47_hansen',
        text: 'Керосин по лампам, фитили подрезать, фонарь-динамо покрутить, пока не загорится ровно. В доме будет свет, кто бы ни уехал. Ты ставишь лампы в ряд на полке, как солдатиков.', effects: [set47('pk', 'lamps'), { body: 'hunger', delta: -10 }, until47(57, 13, 30)] },
      { id: 'c47_pk_wire', label: 'Подтянуть проволоку с банками вдоль забора со стороны леса', minutes: 60, terminal: true, goto: 'c47_hansen', ambientDuring: sun47,
        text: 'Проволока провисла от снега. Ты натягиваешь её заново и вешаешь ещё шесть банок с камешками. Если кто-то пойдёт ночью от лесополосы, дом проснётся.', effects: [set47('pk', 'wire'), w47('wire', true), { body: 'hunger', delta: -10 }, until47(57, 13, 30)] },
    ] }),

  S47({ id: 'c47_hansen', for: 'any', chapter: 'ch3', title: 'Воскресенье после обеда', camp: yard14, ambient: sun47,
    text: [
      { when: flag('w.c46_hansen_sunday'), text: 'После обеда к воротам приходит Яннес, с топором на плече, хромая. Он идёт к фрау Ханзен колоть дрова, как она велела. Ему страшно, это видно. «Kommt jemand mit? Nur bis zur Tür». Кто-нибудь пойдёт? Только до двери.' },
      { when: not(flag('w.c46_hansen_sunday')), text: 'После обеда хутор отдыхает. Солнце низкое, снег блестит. Дети катаются с горки за сараем. Кто-то из соседей идёт по дороге и машет.' },
    ],
    actions: [
      { id: 'c47_hs_jannes', label: 'Проводить Яннеса до двери фрау Ханзен', when: flag('w.c46_hansen_sunday'), minutes: 90, terminal: true, goto: 'c47_dusk', ambientDuring: sun47,
        text: 'Ты идёшь с ним до калитки Ханзенов. Дальше он один. Фрау Ханзен открывает, смотрит на него, на топор, и молча показывает на поленницу. Яннес колет час. Она выходит с двумя кружками. Ты уходишь, не дождавшись, что будет дальше. Это не твоё.', effects: [set47('hs', 'jannes'), w47('jannes_hansen', true), npc('c14_jannes', 1), until47(57, 15, 30)] },
      { id: 'c47_hs_kids', label: 'Пойти к детям на горку', minutes: 90, terminal: true, goto: 'c47_dusk', ambientDuring: sun47, activity: 'moderate',
        text: 'Горка за сараем укатана до блеска. Ты съезжаешь на крышке от бочки, и дети визжат от восторга. Через час у тебя мокрая спина и ни одной мысли в голове.', effects: [set47('hs', 'kids'), { body: 'stress', delta: -8 }, until47(57, 15, 30)] },
      { id: 'c47_hs_partner', label: 'Пройтись с {partner.ins} вдоль поля, пока светло', minutes: 90, terminal: true, goto: 'c47_dusk', ambientDuring: sun47,
        text: 'Вы идёте по краю поля, по насту, и разговариваете обо всём, кроме завтрашнего. Потом всё-таки о завтрашнем. Солнце садится, пока вы поворачиваете обратно.', effects: [set47('hs', 'partner'), { body: 'stress', delta: -5 }, until47(57, 15, 30)] },
      { id: 'c47_hs_sleep', label: 'Поспать час', minutes: 90, terminal: true, goto: 'c47_dusk',
        text: 'Ты засыпаешь сразу, не раздеваясь, поверх одеяла. Просыпаешься в сумерках от запаха супа.', effects: [set47('hs', 'sleep'), { body: 'fatigue', delta: -10 }, until47(57, 15, 30)] },
    ] }),

  S47({ id: 'c47_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: sun47,
    text: [
      { text: 'Солнце садится в четыре. Небо над лесополосой красное, потом лиловое. Дым на опушке погас. Пост у Зеве сменяется: на тропе к реке огонёк фонаря.' },
    ],
    actions: [
      { id: 'c47_dk_post', label: 'Сходить на пост у Зеве, отнести горячего тому, кто стоит', minutes: 60, terminal: true, goto: 'c47_sun_eve', ambientDuring: sun47,
        text: 'Термос, хлеб в тряпке. На посту — сосед с колонии. Он пьёт и рассказывает, что ночью было тихо, первый раз за неделю. «Nach gestern. Da hat jemand aufgeräumt». После вчерашнего. Кто-то прибрался.', effects: [set47('dk', 'post'), until47(57, 17, 30)] },
      { id: 'c47_dk_laundry', label: 'Помочь Хенрике с бельём: котёл, мыло, верёвка в сенях', when: henrike47, minutes: 60, terminal: true, goto: 'c47_sun_eve',
        text: 'Котёл на плите, бельё в мыльной пене, палка, чтобы мешать. Хенрике выжимает, ты развешиваешь в сенях. Простыни пахнут мылом и холодом. Хенрике говорит: «Wer wegfährt, nimmt was Sauberes mit». Кто уезжает, берёт с собой чистое.', effects: [set47('dk', 'laundry'), npc('henrike', 1), until47(57, 17, 30)] },
      { id: 'c47_dk_letter', label: 'Перечитать письмо Тобиаса у окна', when: flag('w.c46_tobias_letter'), minutes: 45, terminal: true, goto: 'c47_sun_eve',
        text: '«Die Elbe hält». Эльба держит. Ты перечитываешь письмо и думаешь, что Тобиас сейчас тоже смотрит на закат, только с того берега. Пропуск лежит в коробке. До конца января.', effects: [set47('dk', 'letter'), until47(57, 17, 30)] },
      { id: 'c47_dk_wood', label: 'Сложить поленницу ровно, пока светло', minutes: 60, terminal: true, goto: 'c47_sun_eve', ambientDuring: sun47, activity: 'moderate',
        text: 'Поленья — корой вверх, ряд к ряду, чтобы снег не набивался. Работа, в которой не надо думать. Когда заканчиваешь, уже темно, и в кухне зажгли лампу.', effects: [set47('dk', 'wood'), { body: 'fatigue', delta: 3 }, until47(57, 17, 30)] },
    ] }),

  S47({ id: 'c47_sun_eve', for: 'any', chapter: 'ch3', title: 'Вечер воскресенья', camp: kitchen14,
    text: [
      { text: 'Вечер. Последний вечер перед двадцать восьмым. В кухне тепло, на столе лампа и суп.' },
      { when: brothersCome, text: 'Заходят Дениз с Керемом: узнать, все ли целы после субботы. Сидят недолго, пьют чай стоя, как в мастерской.' },
      { when: hamburg47, text: 'Мерле сидит у печки с глюкометром или без и смотрит в огонь. Биргит гладит её по волосам, как маленькую.' },
      { when: felix47, text: 'Феликс чистит топор у порога, медленно, как оружие.' },
    ],
    actions: [
      { id: 'c47_se_eat', label: 'Ужинать со всеми', minutes: 50, terminal: true, goto: 'c47_last', ...tableOnly,
        text: 'Суп, хлеб, чай. Хенрике или кто-то из взрослых говорит короткую молитву, которую раньше не говорили. Никто не смеётся.', effects: [set47('se', 'eat'), meal('eat'), until47(57, 18, 45)] },
      { id: 'c47_se_list', label: 'Составить список дел на неделю для тех, кто остаётся', minutes: 50, terminal: true, goto: 'c47_last',
        text: 'Ты пишешь на листке: посты, вода, куры, дрова, Сильвестр. Имена напротив каждого дела. Листок вешаешь на гвоздь у двери кухни. Хенрике читает и исправляет одно имя.', effects: [set47('se', 'list'), w47('week_list', true), { body: 'hunger', delta: -20 }, until47(57, 18, 45)] },
      { id: 'c47_se_henrike', label: 'Посидеть с Хенрике, пока все заняты', when: henrike47, minutes: 50, terminal: true, goto: 'c47_last', ...tableOnly,
        text: 'Хенрике говорит про Герду и Любек, про то, что весной, может быть, поедет. Потом машет рукой: «Ach. Frühling. Wer weiß». Весна. Кто знает. И наливает тебе ещё супа.', effects: [set47('se', 'henrike'), meal('eat'), npc('henrike', 1), until47(57, 18, 45)] },
    ] }),

  S47({ id: 'c47_last', for: 'any', chapter: 'ch3', title: 'Перед сном', camp: house14,
    text: [
      { text: 'Дом затихает. Завтра двадцать восьмое. Лампа на столе, за окном мороз.' },
      { when: hamburg47, text: 'Рюкзаки у двери. Будильник на шесть.' },
    ],
    actions: [
      { id: 'c47_ls_talk', label: 'Поговорить с {partner.ins} о вчерашнем и о завтрашнем', minutes: 60, terminal: true, goto: 'c47_checkpoint',
        text: 'Про лесополосу, про погреб, про тех, кого вчера жгли на опушке. Про колонну, про пропуск. Говорите долго. Не всё сказано, но главное — да.', effects: [set47('ls', 'talk'), finish, until47(57, 20, 0)] },
      { id: 'c47_ls_sleep', label: 'Лечь пораньше', minutes: 60, terminal: true, goto: 'c47_checkpoint',
        text: 'Ты засыпаешь, как только касаешься подушки. Два дня в одном теле.', effects: [set47('ls', 'sleep'), { body: 'fatigue', delta: -6 }, finish, until47(57, 20, 0)] },
      { id: 'c47_ls_window', label: 'Постоять у окна, глядя на лесополосу', minutes: 60, terminal: true, goto: 'c47_checkpoint',
        text: 'Лесополоса чёрная на белом. Тихо. Где-то там вчера была цепь, и крик, и дым. Сейчас — ничего. Ты стоишь, пока не замечаешь, что держишь руки сжатыми в кулаки.', effects: [set47('ls', 'window'), finish, until47(57, 20, 0)] },
    ] }),

  S47({ id: 'c47_checkpoint', for: 'any', chapter: 'ch3', title: 'Воскресенье, вечер', checkpoint: 47, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Двадцать седьмое декабря.' }], actions: [] }),
];
