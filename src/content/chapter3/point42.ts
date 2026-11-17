import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { npc, tableOnly } from './point19';
import { merleFarm39, parents39 } from './point39';
import { henrike41, jorg41 } from './point41';

// Участок 42 «Свечи»: чт 17.12, 07:00 → КТ42 пт 18.12, 20:30. Чистый сюжет: решения про людей. План — STOCK_PLAN.md §10.4.
// A: лесополоса и ёлка, землянка и Феликс (срочник, сбежавший из ложбины в ноябре; яйца из курятника с 19-й), ружьё, сосед Ханзен,
// пятница — ров с Брандтом (облава в субботу), снова Феликс или венок, подарок, баня, звезда, эфир (Томас при thomas34).
// B: Мерле и счёт инсулина (или Нина), выпечка, разговор, школа в Винзене, звёзды из соломы, Уте, Ханзены, Лея/письма;
// пятница — Мерле ночью (или колодец), тетрадь понедельников Хенрике и визит к одному из списка, подарок, баня.
export const P42: Cond = all({ cp: 41 }, not({ cp: 42 }));
export const A42: Cond = { me: 'A' };
export const farm42 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played41: Cond = any(flag('A.c41_finished'), flag('B.c41_finished'));
const base42: Cond = all(P42, played41, flag('w.c40_after'), { at: farm42 }, { partnerAt: farm42 }, up, { partner: 'active' });
export const point42Available: Cond = base42;

export const henrike42: Cond = henrike41;
export const merle42: Cond = merleFarm39;
export const parents42: Cond = all(merleFarm39, parents39);
export const nina42: Cond = ninaFarm;
export const xmas42 = (x: string): Cond => v('w.c41_xmas', x);
export const tree42: Cond = not(xmas42('none'));
export const jorgStays42: Cond = all(jorg41, v('w.c41_jorg', 'stay'));
export const jorgGoes42: Cond = all(jorg41, v('w.c41_jorg', 'go'));
export const vet42 = (x: string): Cond => v('w.c41_vet', x);
export const jonasMet42: Cond = flag('w.c42_jonas_met');
export const hansenDead42: Cond = v('w.c40_neighbor', 'dead');
export const hansenHere42: Cond = flag('w.c41_gerdes_stay');
export const own42 = (key: string, value: string): Cond => v(`$.c42_${key}`, value);

export const thu42 = { tempC: 3, outdoor: true, wet: false };
export const fri42 = { tempC: 0, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm42, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S42 = wrap(P42);
export const set42 = (key: string, value: string | boolean): Effect => ({ set: `$.c42_${key}`, value });
export const w42 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c42_${key}`, value });
export const until42 = (d: 47 | 48, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare42: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c42_finished', value: true };
const fromDawn = [{ id: 'a', when: A42, goto: 'c42_a_belt' }, { id: 'b', goto: 'c42_b_count' }];
const fromLunch = [{ id: 'a', when: A42, goto: 'c42_a_gun' }, { id: 'b', goto: 'c42_b_ute' }];
const fromFri = [{ id: 'a', when: A42, goto: 'c42_a_trench' }, { id: 'b', goto: 'c42_b_night' }];
const fromFriLunch = [{ id: 'a', when: all(A42, jonasMet42), goto: 'c42_a_jonas2' }, { id: 'aw', when: A42, goto: 'c42_a_wreath' }, { id: 'b', goto: 'c42_b_gift' }];

export const shared42: Scene[] = [
  S42({ id: 'c42_dawn', for: 'any', chapter: 'ch3', title: 'Четверг', camp: kitchen14,
    text: [
      { text: 'Четверг, семь утра. Дождь кончился ночью. Над полем низкие облака, плюс три. В кухне пахнет кашей и мокрыми сапогами.' },
      { when: xmas42('feast'), text: 'На двери кухни новый лист, почерком Хенрике: «Weihnachten». Под ним столбиком: ёлка, гусь — зачёркнуто, курица, свечи, гости.' },
      { when: xmas42('quiet'), text: 'На двери кухни новый лист, почерком Хенрике: «Weihnachten — still». Под ним три строчки: ёлка, свечи, суп.' },
      { when: xmas42('none'), text: 'Про Рождество решили: не праздновать. Хенрике кивнула и больше об этом не говорит. Нина тоже.' },
      { when: jorgGoes42, text: 'Йорг с детьми уже у ворот, с тачкой. Тоштедт — двадцать километров. Младшая сидит на мешках, рука в косынке.' },
      { when: jorgStays42, text: 'Йорг колет дрова с рассвета. Его дети сидят у печи и смотрят, как Хенрике мешает кашу.' },
    ],
    actions: [
      { id: 'c42_dw_eat', label: 'Позавтракать со всеми', minutes: 40, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша на молоке, хлеб, чай. За столом говорят о будничном: дрова, вода, кто куда. После вчерашнего это почти праздник.', effects: [set42('dw', 'eat'), meal('eat'), until42(47, 7, 40)] },
      { id: 'c42_dw_jorg', label: 'Проводить Йорга до поворота', when: jorgGoes42, minutes: 40, terminal: true, outcomes: fromDawn, ambientDuring: thu42,
        text: 'Ты толкаешь тачку до поворота на Ханштедт. Там Йорг забирает её и жмёт тебе руку. Дети машут, пока видно. Младшая машет здоровой рукой.', effects: [set42('dw', 'jorg'), { body: 'hunger', delta: -8 }, until42(47, 7, 40)] },
      { id: 'c42_dw_henrike', label: 'Помочь Хенрике с кашей и посудой', when: henrike42, minutes: 40, terminal: true, outcomes: fromDawn,
        text: 'Ты моешь, Хенрике вытирает. Она говорит, не глядя: «Weihnachten ohne Armee. Wie früher. Nur ohne alles andere». Рождество без армии. Как раньше. Только без всего остального.', effects: [set42('dw', 'henrike'), meal('eat'), npc('henrike', 1), until42(47, 7, 40)] },
      { id: 'c42_dw_tea', label: 'Чай у печи и сразу за дела', minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Кружка чая, кусок хлеба стоя. Ты уходишь, пока остальные ещё сидят.', effects: [set42('dw', 'tea'), { body: 'hunger', delta: -12 }, until42(47, 7, 30)] },
    ] }),

  S42({ id: 'c42_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14, onEnter: [until42(47, 12, 30)],
    text: [
      { text: 'Обед. Суп с перловкой. За окном опять моросит.' },
      { when: tree42, text: 'В углу кухни стоит ёлка из лесополосы, в ведре с песком. Пахнет лесом. Все смотрят на неё чаще, чем надо.' },
      { when: merle42, text: 'Мерле перед едой колет инсулин в живот, быстро, не отворачиваясь. Дети уже не смотрят: привыкли.' },
    ],
    actions: [
      { id: 'c42_lu_eat', label: 'Обедать и слушать, у кого как прошло утро', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'У каждого своё утро. Ты слушаешь и ешь. Суп горячий, хлеб вчерашний.', effects: [set42('lu', 'eat'), meal('eat'), until42(47, 13, 15)] },
      { id: 'c42_lu_tell', label: 'Рассказать за столом про своё утро', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Ты рассказываешь коротко. Хенрике слушает, держа ложку на весу. Кто-то задаёт вопрос, кто-то молчит.', effects: [set42('lu', 'tell'), meal('eat'), until42(47, 13, 15)] },
      { id: 'c42_lu_bread', label: 'Взять хлеб с собой', minutes: 30, terminal: true, outcomes: fromLunch,
        text: 'Хлеб в карман, кружку супа залпом.', effects: [set42('lu', 'bread'), { body: 'hunger', delta: -12 }, until42(47, 13, 0)] },
    ] }),

  S42({ id: 'c42_thu_eve', for: 'any', chapter: 'ch3', title: 'Вечер четверга', camp: kitchen14, onEnter: [until42(47, 18, 30)],
    text: [
      { text: 'Вечер. Лампа, печь. Дождь стучит по доскам на окнах. Тепло.' },
      { when: tree42, text: 'На ёлке висят соломенные звёзды и красные яблоки. Дети то и дело их поправляют.' },
      { when: xmas42('none'), text: 'На подоконнике в банке стоит еловая ветка. Кто её принёс, никто не говорит.' },
      { when: parents42, text: 'Биргит вяжет, Уве крутит ручку приёмника. Каждые пять минут он говорит: «Nichts». Ничего.' },
    ],
    actions: [
      { id: 'c42_te_eat', label: 'Ужинать со всеми', minutes: 60, terminal: true, goto: 'c42_thu_night', ...tableOnly,
        text: 'Картошка с луком, квашеная капуста. Разговор идёт о мелочах. Ты ловишь себя на том, что смеёшься.', effects: [set42('te', 'eat'), meal('eat'), until42(47, 19, 30)] },
      { id: 'c42_te_sing', label: 'Попросить Хенрике спеть что-нибудь рождественское', when: henrike42, minutes: 60, terminal: true, goto: 'c42_thu_night', ...tableOnly,
        text: 'Хенрике отнекивается, потом поёт тихо, не поднимая глаз от миски: «Es ist ein Ros entsprungen». На втором куплете подпевает кто-то ещё. Ты не знаешь слов, но слушаешь до конца.', effects: [set42('te', 'sing'), meal('eat'), { body: 'stress', delta: -5 }, npc('henrike', 1), until42(47, 19, 30)] },
      { id: 'c42_te_stove', label: 'Поесть у печи, без разговоров', minutes: 45, terminal: true, goto: 'c42_thu_night',
        text: 'Миска на коленях, спина к тёплой печи. Голоса за столом сливаются в один.', effects: [set42('te', 'stove'), { body: 'hunger', delta: -20 }, until42(47, 19, 30)] },
    ] }),

  S42({ id: 'c42_thu_night', for: 'any', chapter: 'ch3', title: 'Перед сном', camp: house14,
    text: [
      { text: 'Половина восьмого. Дом затихает рано. С крыши капает, на лугу кричит какая-то птица.' },
    ],
    actions: [
      { id: 'c42_tn_talk', label: 'Лечь рядом с {partner.ins} и поговорить про день', minutes: 30, terminal: true, goto: 'c42_fri_dawn',
        text: 'Шёпотом, лицом к лицу. Каждый рассказывает своё. Где-то на середине ты понимаешь, что {partner} уже спит.', effects: [set42('tn', 'talk'), until42(48, 6, 30, true)] },
      { id: 'c42_tn_yard', label: 'Выйти на крыльцо подышать перед сном', minutes: 30, terminal: true, goto: 'c42_fri_dawn', ambientDuring: thu42,
        text: 'Облака разошлись. Звёзды, много. Холодает: к утру будет иней. Ты стоишь, пока не начинают мёрзнуть уши, и идёшь спать.', effects: [set42('tn', 'yard'), until42(48, 6, 30, true)] },
      { id: 'c42_tn_sleep', label: 'Сразу спать', minutes: 20, terminal: true, goto: 'c42_fri_dawn',
        text: 'Ты засыпаешь, не дослушав, как Хенрике запирает дверь.', effects: [set42('tn', 'sleep'), { body: 'fatigue', delta: -4 }, until42(48, 6, 30, true)] },
    ] }),

  S42({ id: 'c42_fri_dawn', for: 'any', chapter: 'ch3', title: 'Пятница', camp: kitchen14, onEnter: [until42(48, 6, 30)],
    text: [
      { text: 'Пятница. Ночью подморозило: на лужах тонкий лёд, трава белая. Небо ясное, бледное. Ноль градусов.' },
      { text: 'Хенрике отрывает листок календаря и говорит: «Morgen ist der vierte Advent». Завтра четвёртый адвент.' },
    ],
    actions: [
      { id: 'c42_fd_eat', label: 'Позавтракать', minutes: 40, terminal: true, outcomes: fromFri, ...tableOnly,
        text: 'Каша, яйцо на двоих, чай. Солнце встаёт прямо в окно кухни, первый раз за неделю.', effects: [set42('fd', 'eat'), meal('eat'), until42(48, 7, 10)] },
      { id: 'c42_fd_frost', label: 'Выйти посмотреть на иней', minutes: 30, terminal: true, outcomes: fromFri, ambientDuring: fri42,
        text: 'Каждая травинка в белом. Изгородь, проволока, банки на ней — всё в инее. Тихо так, что слышно, как в Йестебурге бьют часы на церкви.', effects: [set42('fd', 'frost'), { body: 'hunger', delta: -8 }, until42(48, 7, 10)] },
      { id: 'c42_fd_tea', label: 'Чай и хлеб на ходу', minutes: 30, terminal: true, outcomes: fromFri,
        text: 'Кружка, хлеб, шарф. День короткий.', effects: [set42('fd', 'tea'), { body: 'hunger', delta: -12 }, until42(48, 7, 0)] },
    ] }),

  S42({ id: 'c42_fri_lunch', for: 'any', chapter: 'ch3', title: 'Обед в пятницу', camp: kitchen14, onEnter: [until42(48, 12, 30)],
    text: [
      { text: 'Обед. Солнце уже ушло за сарай. Гороховый суп и хлеб.' },
      { when: parents42, text: 'Биргит раздаёт суп и каждому говорит «Mahlzeit», как в столовой на работе. Уве смеётся.' },
    ],
    actions: [
      { id: 'c42_fl_eat', label: 'Обедать со всеми', minutes: 45, terminal: true, outcomes: fromFriLunch, ...tableOnly,
        text: 'Суп густой, ложка стоит. Ты съедаешь две миски и чувствуешь, как отходят пальцы.', effects: [set42('fl', 'eat'), meal('eat'), until42(48, 13, 15)] },
      { id: 'c42_fl_plan', label: 'Обсудить за столом, кто что делает к воскресенью', minutes: 45, terminal: true, outcomes: fromFriLunch, ...tableOnly,
        text: 'Венок, баня, дрова, кухня. Хенрике распределяет, как на поле. Никто не спорит: так проще.', effects: [set42('fl', 'plan'), meal('eat'), until42(48, 13, 15)] },
      { id: 'c42_fl_bread', label: 'Поесть стоя и вернуться к делам', minutes: 30, terminal: true, outcomes: fromFriLunch,
        text: 'Миска у окна, три минуты. Дела ждут.', effects: [set42('fl', 'bread'), { body: 'hunger', delta: -15 }, until42(48, 13, 0)] },
      { id: 'c42_fl_stove', label: 'Подкинуть дров и посидеть у плиты', minutes: 30, terminal: true, outcomes: fromFriLunch,
        text: 'Два полена в топку, дверца, жар в лицо. Пять минут ты сидишь на корточках у плиты и ни о чём не думаешь.', effects: [set42('fl', 'stove'), until42(48, 13, 0)] },
      { id: 'c42_fl_dishes', label: 'Мыть посуду, пока остальные едят', minutes: 30, terminal: true, outcomes: fromFriLunch,
        text: 'Миски в таз, тёплая вода, мыло. Ты слушаешь, о чём говорят за спиной, и не оборачиваешься.', effects: [set42('fl', 'dishes'), until42(48, 13, 0)] },
    ] }),

  S42({ id: 'c42_fri_eve', for: 'any', chapter: 'ch3', title: 'Вечер пятницы', camp: kitchen14, onEnter: [until42(48, 18, 30)],
    text: [
      { text: 'Вечер. Все чистые после бани, волосы мокрые. В кухне жарко. На столе венок из еловых веток и три свечи из четырёх: четвёртую зажгут завтра.' },
      { when: xmas42('none'), text: 'Хенрике всё-таки поставила на стол свечи. «Das ist kein Feiern. Das ist Licht». Это не праздник. Это свет.' },
    ],
    actions: [
      { id: 'c42_fe_eat', label: 'Ужинать при свечах', minutes: 60, terminal: true, goto: 'c42_fri_night', ...tableOnly,
        text: 'Свечи, суп, хлеб. Свет только от них и от печки. Лица у всех другие: мягче.', effects: [set42('fe', 'eat'), meal('eat'), until42(48, 19, 45)] },
      { id: 'c42_fe_story', label: 'Попросить каждого рассказать про своё лучшее Рождество', minutes: 60, terminal: true, goto: 'c42_fri_night', ...tableOnly,
        text: 'Начинает Хенрике: снег до окон, отец везёт ёлку на санях. Потом все по очереди. Когда доходит до тебя, ты рассказываешь своё. Тихо. Все слушают.', effects: [set42('fe', 'story'), meal('eat'), { body: 'stress', delta: -6 }, until42(48, 19, 45)] },
      { id: 'c42_fe_watch', label: 'Смотреть на свечи с чашкой чая', minutes: 60, terminal: true, goto: 'c42_fri_night',
        text: 'Ты сидишь у края стола с кружкой. Свечи горят ровно. Ты думаешь о тех, кто сидел бы за этим столом месяц назад.', effects: [set42('fe', 'watch'), { body: 'hunger', delta: -15 }, until42(48, 19, 45)] },
      { id: 'c42_fe_kids', label: 'Читать детям вслух у печи', minutes: 60, terminal: true, goto: 'c42_fri_night',
        text: 'Книжка из сундука Оле, растрёпанная, про медвежонка зимой. Ты читаешь по-немецки, с ошибками. Дети поправляют хором и не дают закрыть книгу, пока не кончится.', effects: [set42('fe', 'kids'), { body: 'stress', delta: -4 }, until42(48, 19, 45)] },
      { id: 'c42_fe_window', label: 'Поставить на подоконник свечу для тех, кого нет', minutes: 60, terminal: true, goto: 'c42_fri_night',
        text: 'Ещё одна свеча, отдельно от венка. Хенрике замечает и молча придвигает её ближе к стеклу, чтобы было видно с дороги.', effects: [set42('fe', 'window'), until42(48, 19, 45)] },
    ] }),

  S42({ id: 'c42_fri_night', for: 'any', chapter: 'ch3', title: 'Пятница, ночь', camp: house14,
    text: [
      { text: 'Свечи задули. Дом засыпает. За окном мороз и звёзды.' },
    ],
    actions: [
      { id: 'c42_fn_talk', label: 'Поговорить с {partner.ins} о Рождестве', minutes: 45, terminal: true, goto: 'c42_checkpoint',
        text: 'Вы лежите в темноте и говорите о том, каким будет сочельник. Кого позвать. Что надеть. Глупости. Важные глупости.', effects: [set42('fn', 'talk'), finish, until42(48, 20, 30)] },
      { id: 'c42_fn_sleep', label: 'Уснуть', minutes: 45, terminal: true, goto: 'c42_checkpoint',
        text: 'Ты засыпаешь под тиканье часов в кухне.', effects: [set42('fn', 'sleep'), { body: 'fatigue', delta: -6 }, finish, until42(48, 20, 30)] },
      { id: 'c42_fn_gift', label: 'Проверить, хорошо ли спрятан подарок', minutes: 45, terminal: true, goto: 'c42_checkpoint',
        text: 'В темноте, на ощупь, ты проверяешь тайник. На месте. Ты ложишься и улыбаешься в подушку, сам{m:|а} не зная чему.', effects: [set42('fn', 'gift'), finish, until42(48, 20, 30)] },
    ] }),

  S42({ id: 'c42_checkpoint', for: 'any', chapter: 'ch3', title: 'Пятница, вечер', checkpoint: 42, universal: false, camp: house14,
    text: [{ text: 'Половина девятого. Завтра четвёртый адвент. До Рождества шесть дней.' }], actions: [] }),
];

