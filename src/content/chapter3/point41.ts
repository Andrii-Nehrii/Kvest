import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { npc, tableOnly } from './point19';
import { merleFarm39 } from './point39';

// Участок 41: среда 16.12, 07:00 → КТ41 20:00. Передышка после опасности; запертая находка (A). План — STOCK_PLAN.md §10.4.
// Обычный день (оба на ногах): тела у ручья и костёр, находка у брошенного поста (ящик связиста, код 1512 — мел на борту последнего
// грузовика во вторник), день по КТ40 (свой двор / соседи / совет), Лея уходит (КТ40), Йорг, Ханзены, корова, Хенрике.
// Спасение (партнёр без сознания с ночи): как в 31-й — тепло, сухое, доктор Зандер, к вечеру приходит в себя. Находки у спасающего нет.
export const P41: Cond = all({ cp: 40 }, not({ cp: 41 }));
export const A41: Cond = { me: 'A' };
export const B41: Cond = { me: 'B' };
export const farm41 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const partnerUp41: Cond = { partner: 'active' };
export const partnerDown41: Cond = { partner: 'incapacitated' };
const played40: Cond = any(flag('A.c40_finished'), flag('B.c40_finished'), flag('A.c40_down'), flag('B.c40_down'));
const base41: Cond = all(P41, played40, flag('w.c40_after'), { at: farm41 }, { partnerAt: farm41 }, up);
export const stageN41: Cond = all(base41, partnerUp41);
export const stageR41: Cond = all(base41, partnerDown41);
export const point41Available: Cond = any(stageN41, stageR41);
export const rescuer41: Cond = flag('$.c41_rescuer');
export const nursedA41: Cond = flag('B.c41_rescuer');
export const nursedB41: Cond = flag('A.c41_rescuer');
export const own41 = (key: string, value: string): Cond => v(`$.c41_${key}`, value);

export const henrike41: Cond = { npc: 'henrike', alive: true, at: farm41 };
export const merle41: Cond = merleFarm39;
export const jorg41: Cond = all(v('w.c39_strangers', 'barn'), not(flag('w.c40_left_army')));
export const cowLost41: Cond = v('w.c40_cow', 'lost');
export const gerdesDead41: Cond = v('w.c40_neighbor', 'dead');
export const after41 = (x: string): Cond => v('w.c40_after', x);
export const lea41 = (x: string): Cond => v('w.c40_lea', x);

export const wet41 = { tempC: 5, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm41, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S41 = wrap(P41);
export const set41 = (key: string, value: string | boolean): Effect => ({ set: `$.c41_${key}`, value });
export const w41 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c41_${key}`, value });
export const until41 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(46, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare41: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c41_finished', value: true };
const fromDawn = [{ id: 'r', when: partnerDown41, goto: 'c41_r_bed' }, { id: 'a', when: A41, goto: 'c41_a_bodies' }, { id: 'b', goto: 'c41_b_wounds' }];
const fromLunch = [{ id: 'r', when: rescuer41, goto: 'c41_r_visit' }, { id: 'a', when: A41, goto: 'c41_a_repair' }, { id: 'b', goto: 'c41_b_jorg' }];
const fromBrandt = [{ id: 'r', when: rescuer41, goto: 'c41_r_dusk' }, { id: 'a', when: A41, goto: 'c41_a_seeve' }, { id: 'b', goto: 'c41_b_dusk' }];

export const shared41: Scene[] = [
  S41({ id: 'c41_dawn', for: 'any', chapter: 'ch3', title: 'Среда', camp: kitchen14,
    text: [
      { text: 'Семь утра. Туман над лугами. Дождь кончился, с крыши ещё капает. Плюс пять. Пахнет мокрой землёй, дымом и чем-то сладковатым, о чём никто не говорит.' },
      { when: partnerDown41, text: '{partner} лежит на кровати Хенрике, с повязкой на голове. Лицо белое. Дышит. Ты сидишь рядом с ночи.' },
      { when: partnerUp41, text: 'В кухне все, кто дожил до утра. Хенрике раздаёт кашу молча. Никто не просит добавки и никто не отказывается.' },
      { when: cowLost41, text: 'Из хлева не мычат. Тишина оттуда громче всего остального.' },
      { when: gerdesDead41, text: 'Фрау Ханзен сидит у печи, в чужом пальто. Её привёл Лукас на рассвете. Она не плачет.' },
    ],
    actions: [
      { id: 'c41_dw_eat', label: 'Поесть: день будет длинный', minutes: 40, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, хлеб, чай. Ты ешь, не чувствуя вкуса. Тело просит есть само.', effects: [set41('dw', 'eat'), meal('eat'), until41(7, 40)] },
      { id: 'c41_dw_partner', label: 'Сесть рядом с {partner.ins}', minutes: 40, terminal: true,
        outcomes: [{ id: 'down', when: partnerDown41, text: 'Ты садишься на край кровати и держишь руку, которая лежит поверх одеяла, холодная и неподвижная. Пальцы не отвечают. Пульс есть.', goto: 'c41_r_bed' }, { id: 'a', when: A41, text: 'Ты садишься рядом. Плечо к плечу. Ничего не говоришь. {partner} тоже. Так и едите.', goto: 'c41_a_bodies' }, { id: 'b', text: 'Ты садишься рядом. Плечо к плечу. Ничего не говоришь. {partner} тоже. Так и едите.', goto: 'c41_b_wounds' }], effects: [set41('dw', 'partner'), { body: 'stress', delta: -4 }, { body: 'hunger', delta: -10 }, until41(7, 40)] },
      { id: 'c41_dw_henrike', label: 'Помочь Хенрике у плиты', when: henrike41, minutes: 40, terminal: true, outcomes: fromDawn,
        text: 'Ты раздаёшь миски. Хенрике говорит, не глядя: «Wir leben. Das ist heute alles». Мы живы. Сегодня это всё.', effects: [set41('dw', 'henrike'), meal('eat'), npc('henrike', 1), until41(7, 40)] },
      { id: 'c41_dw_porch', label: 'Выйти на крыльцо подышать: в доме тяжело', minutes: 40, terminal: true, outcomes: fromDawn, ambientDuring: wet41,
        text: 'Туман, капель, мокрая земля. На лугу у ручья тёмные пятна, к ним не хочется присматриваться. Ты дышишь, пока не начинают мёрзнуть руки, и возвращаешься.', effects: [set41('dw', 'porch'), until41(7, 40)] },
    ] }),

  S41({ id: 'c41_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14, onEnter: [until41(12, 15)],
    text: [
      { text: 'Обед. Суп из того, что есть. За столом впервые за сутки говорят громко: кто что видел ночью, у кого как.' },
      { when: cowLost41, text: 'В супе мясо. Говядина. Хенрике кладёт каждому по куску и говорит: «Sie hat uns ihr Leben lang gefüttert. Heute auch». Она кормила нас всю жизнь. Сегодня тоже.' },
      { when: merle41, text: 'Мерле ест, держа ложку двумя пальцами, и считает углеводы вслух, шёпотом.' },
    ],
    actions: [
      { id: 'c41_lu_eat', label: 'Есть и слушать', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Ты слушаешь, как каждый рассказывает свою ночь. Ни одна не похожа на твою. Все похожи друг на друга.', effects: [set41('lu', 'eat'), meal('eat'), until41(13, 0)] },
      { id: 'c41_lu_tell', label: 'Рассказать свою ночь', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Ты рассказываешь. За столом тихо. Когда заканчиваешь, кто-то молча пододвигает тебе хлеб.', effects: [set41('lu', 'tell'), meal('eat'), { body: 'stress', delta: -3 }, until41(13, 0)] },
      { id: 'c41_lu_bread', label: 'Взять хлеб и уйти к делам', minutes: 30, terminal: true, outcomes: fromLunch,
        text: 'Хлеб в карман, кружку залпом. Дела не ждут, и думать о ночи не хочется.', effects: [set41('lu', 'bread'), { body: 'hunger', delta: -12 }, until41(13, 0)] },
      { id: 'c41_lu_window', label: 'Посидеть у окна с кружкой: есть не хочется', minutes: 45, terminal: true, outcomes: fromLunch,
        text: 'Кружка тёплая, в окне поле. Есть не хочется. Хенрике ставит рядом хлеб и не уходит, пока ты не откусываешь.', effects: [set41('lu', 'window'), until41(13, 0)] },
      { id: 'c41_lu_kids', label: 'Посидеть с детьми, пока взрослые едят', minutes: 45, terminal: true, outcomes: fromLunch,
        text: 'Дети едят на лавке у печи и задают вопросы, на которые за столом не отвечают. Ты отвечаешь на один, самый простой. Остальные пусть подождут.', effects: [set41('lu', 'kids'), until41(13, 0)] },
    ] }),

  S41({ id: 'c41_brandt', for: 'any', chapter: 'ch3', title: 'Брандт', camp: yard14, ambient: wet41, onEnter: [until41(15, 30)],
    text: [
      { text: 'В половине четвёртого у ворот джип пожарной части. Брандт объезжает дворы. Небритый, глаза красные.' },
      { text: '— Siebzehn bei uns an den Bächen. Zwei Höfe haben es nicht geschafft: die Behrens an der Brücke und der Alte bei Hanstedt. Wir sind trotzdem mehr, als ich dachte.\n\nСемнадцать у нас на ручьях. Два двора не выдержали: Беренсы у моста и старик под Ханштедтом. Нас всё равно больше, чем я думал.' },
      { when: gerdesDead41, text: 'Он снимает шапку перед фрау Ханзен и долго держит её в руках.' },
      { when: flag('w.c40_patrol_came'), text: 'Он кивает тебе: «Die Rakete. Gut gemacht». Ракета. Правильно сделал{m:|а}.' },
    ],
    actions: [
      { id: 'c41_br_thanks', label: 'Поблагодарить его за колокол и дружину', minutes: 45, terminal: true, outcomes: fromBrandt, ambientDuring: wet41,
        text: 'Брандт пожимает плечами. «Das war nicht ich. Das waren alle». Это был не я. Это были все. Но руку тебе жмёт крепко.', effects: [set41('br', 'thanks'), npc('c16_brandt', 1), until41(16, 15)] },
      { id: 'c41_br_next', label: 'Спросить: что дальше, если оттепель продержится', minutes: 45, terminal: true, outcomes: fromBrandt, ambientDuring: wet41,
        text: '— Dann kommen die, die noch im Tal liegen. Die Hälfte hat der Frost erledigt. Die andere Hälfte nicht. — Он смотрит на поле. — Wir graben einen Graben. Bis Weihnachten.\n\nТогда придут те, кто ещё лежит во впадине. Половину добил мороз. Другую нет. Мы роем ров. До Рождества.', effects: [set41('br', 'next'), w41('trench', true), until41(16, 15)] },
      { id: 'c41_br_men', label: 'Предложить ему людей с вашего двора на ров', minutes: 45, terminal: true, outcomes: fromBrandt, ambientDuring: wet41,
        text: 'Брандт записывает в блокнот: «Lüdemann — zwei Mann, ab Freitag». Людеман — двое, с пятницы. «Danke. Das vergesse ich nicht». Спасибо. Этого я не забуду.', effects: [set41('br', 'men'), w41('trench_men', true), npc('c16_brandt', 2), until41(16, 15)] },
    ] }),

  S41({ id: 'c41_evening', for: 'any', chapter: 'ch3', title: 'Вечер', camp: kitchen14, onEnter: [until41(18, 0)],
    text: [
      { text: 'Вечер. Лампа, печь, ужин. Дождь снова начинается, тихо. Никто не говорит о ночи. Говорят о Рождестве: через восемь дней.' },
      { when: all(nursedA41, rescuer41), text: '{A} сидит у печи, завёрнутый в одеяло, с повязкой на голове. Ест сам, медленно.' },
      { when: all(nursedB41, rescuer41), text: '{B} сидит у печи, завёрнутая в одеяло, с повязкой на голове. Ест сама, медленно.' },
      { when: ninaFarm, text: 'Нина спрашивает, будет ли ёлка. Хенрике смотрит на неё долго и говорит: «Ja». Да.' },
    ],
    actions: [
      { id: 'c41_ev_eat', label: 'Ужинать со всеми', minutes: 60, terminal: true, goto: 'c41_night', ...tableOnly,
        text: 'Картошка, капуста, хлеб. Тепло. Ты ешь и впервые за двое суток чувствуешь вкус.', effects: [set41('ev', 'eat'), meal('eat'), until41(19, 30)] },
      { id: 'c41_ev_xmas', label: 'Заговорить о Рождестве: что будем делать', minutes: 60, terminal: true, goto: 'c41_night', ...tableOnly,
        text: 'Все говорят сразу: ёлка из лесополосы, свечи из сундука, гусь, которого нет, курица, которая есть. Хенрике смеётся. В первый раз за неделю.', effects: [set41('ev', 'xmas'), meal('eat'), { body: 'stress', delta: -5 }, until41(19, 30)] },
      { id: 'c41_ev_rest', label: 'Поесть у печи и молчать', minutes: 45, terminal: true, goto: 'c41_night',
        text: 'Ты сидишь у печи с миской на коленях. Голоса за столом. Это и есть отдых.', effects: [set41('ev', 'rest'), { body: 'hunger', delta: -20 }, until41(19, 30)] },
      { id: 'c41_ev_dishes', label: 'Мыть посуду, пока все едят', minutes: 45, terminal: true, goto: 'c41_night',
        text: 'Таз, горячая вода, мыло. За спиной говорят о Рождестве, о ёлке, о курице. Ты слушаешь спиной и моешь одну и ту же миску дольше, чем нужно.', effects: [set41('ev', 'dishes'), until41(19, 30)] },
      { id: 'c41_ev_wood', label: 'Принести дров на ночь, пока все за столом', minutes: 45, terminal: true, goto: 'c41_night',
        text: 'Три охапки из сеней к печи, ещё одна про запас. Когда ты возвращаешься, за столом спорят о ёлке, и тебе оставлена миска.', effects: [set41('ev', 'wood'), until41(19, 30)] },
    ] }),

  S41({ id: 'c41_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14,
    text: [
      { text: 'Дом затихает рано. Все устали так, что засыпают сидя. Колокол у пожарной части молчит.' },
    ],
    actions: [
      { id: 'c41_ni_talk', label: 'Поговорить с {partner.ins} перед сном', minutes: 30, terminal: true, goto: 'c41_checkpoint',
        text: 'Шёпотом, лицом к лицу. О ночи, о тех, кого не стало, о том, что вы оба здесь. Потом молчите. Потом спите.', effects: [set41('ni', 'talk'), finish, until41(20, 0)] },
      { id: 'c41_ni_sleep', label: 'Уснуть сразу', minutes: 30, terminal: true, goto: 'c41_checkpoint',
        text: 'Ты засыпаешь, не успев раздеться. Без снов.', effects: [set41('ni', 'sleep'), { body: 'fatigue', delta: -8 }, finish, until41(20, 0)] },
      { id: 'c41_ni_check', label: 'Проверить засов и окна, прежде чем лечь', minutes: 30, terminal: true, goto: 'c41_checkpoint',
        text: 'Засов, ставни, проволока с банками. Всё на месте. Ты возвращаешься в постель и засыпаешь, едва коснувшись подушки.', effects: [set41('ni', 'check'), finish, until41(20, 0)] },
    ] }),

  S41({ id: 'c41_checkpoint', for: 'any', chapter: 'ch3', title: 'Среда, вечер', checkpoint: 41, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. До Рождества восемь дней.' }], actions: [] }),
];
