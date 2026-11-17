import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { henrike42, merle42, nina42, parents42, tree42 } from './point42';

// Участок 43 «Четвёртый адвент»: сб 19.12, 06:30 → КТ43 вс 20.12, 20:30. Знают разное / один решает за другого; порознь на часть.
// Скрытая правда: в ночь оттепели (15/16.12) пост у колонии сорок минут стоял пустым. Ушёл Яннес — на крик Уте: мёртвые были у
// её двери, он отбился. За эти сорок минут двое прошли через ручей к Ханзенам. Яннес признаёт, что ушёл, а почему — не говорит:
// Ханзены заплатили за его сорок минут, прятаться за Уте он не хочет. A узнаёт «кто и когда» (суббота, обход ручья с Лукасом),
// B узнаёт «почему» (воскресенье, Уте). На КТ43 B решает, что A скажет за двор на совете в понедельник.
// B в субботу в Винзене: Мерле и ветклиника, Красный Крест (колонна в Гамбург 28-го для тех, кому нужен инсулин; без Мерле —
// работа в пункте Винзена). На КТ43 A решает за B: отпустить ли её сопровождать Мерле (или работать в Винзене).
export const P43: Cond = all({ cp: 42 }, not({ cp: 43 }));
export const A43: Cond = { me: 'A' };
export const farm43 = 'hof_luedemann';
export const winsen43 = 'c15_winsen';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played42: Cond = any(flag('A.c42_finished'), flag('B.c42_finished'));
const base43: Cond = all(P43, played42, flag('w.c42_church'), { at: farm43 }, { partnerAt: farm43 }, up, { partner: 'active' });
export const point43Available: Cond = base43;

export const henrike43 = henrike42;
export const merle43 = merle42;
export const parents43 = parents42;
export const nina43 = nina42;
export const tree43 = tree42;
export const merleTrip43: Cond = all(merle42, any(v('w.c41_vet', 'both'), v('w.c41_vet', 'one')));
export const ninaTrip43: Cond = all(not(merleTrip43), nina42, any(v('w.c42_school', 'go'), v('w.c42_school', 'herself')));
export const felixMet43: Cond = flag('w.c42_jonas_met');
export const felixFate43 = (x: string): Cond => v('w.c42_jonas_fate', x);
export const felixVouched43: Cond = any(v('w.c42_brandt_jonas', 'vouch'), v('w.c42_brandt_jonas', 'self'));
export const dogs43: Cond = all(not(felixVouched43), not(v('w.c42_sweep', 'no_dogs')));
export const hansenDead43: Cond = v('w.c40_neighbor', 'dead');
export const own43 = (key: string, value: string): Cond => v(`$.c43_${key}`, value);

export const sat43 = { tempC: -3, outdoor: true, wet: false };
export const sun43 = { tempC: -1, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm43, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S43 = wrap(P43);
export const set43 = (key: string, value: string | boolean): Effect => ({ set: `$.c43_${key}`, value });
export const w43 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c43_${key}`, value });
export const until43 = (d: 49 | 50, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare43: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c43_finished', value: true };
const fromDawn = [{ id: 'a', when: A43, goto: 'c43_a_sweep' }, { id: 'b', goto: 'c43_b_bus' }];
const fromSunDawn = [{ id: 'a', when: A43, goto: 'c43_a_sunday' }, { id: 'b', goto: 'c43_b_ute' }];
const fromCoffee = [{ id: 'a', when: A43, goto: 'c43_a_dusk' }, { id: 'b', goto: 'c43_b_dusk' }];

export const shared43: Scene[] = [
  S43({ id: 'c43_dawn', for: 'any', chapter: 'ch3', title: 'Суббота', camp: kitchen14,
    text: [
      { text: 'Суббота, половина седьмого. Минус три, небо ясное. Окна в морозных листьях, в кухне пахнет кашей и дымом.' },
      { text: 'Сегодня у каждого своё. В семь у моста Брандт собирает людей в лесополосу. В восемь от пожарной части уходит автобус Красного Креста в Винзен: по субботам он ходит туда и обратно.' },
      { when: merleTrip43, text: 'Мерле уже одета. Блокнот с вопросами для ветеринара торчит из кармана куртки.' },
      { when: v('w.c41_vet', 'both'), text: 'В Винзен собирались вдвоём. Но Брандт вчера сказал: в семь у моста нужен каждый, кто знает лесополосу.' },
    ],
    actions: [
      { id: 'c43_dw_eat', label: 'Позавтракать со всеми', minutes: 30, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, хлеб, горячее молоко. Ешь быстро: у каждого свой час.', effects: [set43('dw', 'eat'), meal('eat'), until43(49, 7, 0)] },
      { id: 'c43_dw_partner', label: 'Договориться с {partner.ins}, где встретиться вечером', minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'У ворот, в четыре, когда придёт автобус. Если что-то пойдёт не так — записка на гвозде у двери кухни. Вы говорите это друг другу дважды.', effects: [set43('dw', 'partner'), { body: 'hunger', delta: -8 }, until43(49, 7, 0)] },
      { id: 'c43_dw_henrike', label: 'Помочь Хенрике и взять с собой хлеба', when: henrike43, minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Ты режешь хлеб, Хенрике заворачивает. «Für unterwegs. Und für die, die nichts haben». В дорогу. И для тех, у кого ничего нет.', effects: [set43('dw', 'henrike'), meal('eat'), until43(49, 7, 0)] },
      { id: 'c43_dw_tea', label: 'Чай стоя и сразу за дверь', minutes: 20, terminal: true, outcomes: fromDawn,
        text: 'Кружка чая, кусок хлеба в карман. Мороз хватает за лицо, как только открываешь дверь.', effects: [set43('dw', 'tea'), { body: 'hunger', delta: -10 }, until43(49, 6, 55)] },
    ] }),

  S43({ id: 'c43_sat_eve', for: 'any', chapter: 'ch3', title: 'Вечер субботы', camp: kitchen14, onEnter: [until43(49, 18, 30)],
    text: [
      { text: 'Вечер. Все дома. Печь гудит, на подоконнике три свечи, четвёртую зажгут завтра.' },
      { when: merleTrip43, text: 'Мерле сидит над пузырьком с ветеринарной этикеткой и пересчитывает единицы карандашом. Никто не мешает.' },
      { when: felixFate43('take'), text: 'У двери, на краю лавки, сидит Феликс Ридель. Ест быстро и аккуратно, как в армии. На него поглядывают, но не расспрашивают.' },
    ],
    actions: [
      { id: 'c43_se_eat', label: 'Ужинать со всеми', minutes: 60, terminal: true, goto: 'c43_sat_night', ...tableOnly,
        text: 'Суп, хлеб, квашеная капуста. Каждый рассказывает свою субботу. Твоя похожа на чужую только тем, что тоже была длинной.', effects: [set43('se', 'eat'), meal('eat'), until43(49, 19, 30)] },
      { id: 'c43_se_listen', label: 'Слушать, у кого как прошёл день', minutes: 60, terminal: true, goto: 'c43_sat_night', ...tableOnly,
        text: 'Ты больше слушаешь, чем говоришь. Кто где был, кто что видел. Половину ты бы и не узнал{m:|а}, если бы не сидел{m:|а} сейчас за этим столом.', effects: [set43('se', 'listen'), meal('eat'), until43(49, 19, 30)] },
      { id: 'c43_se_stove', label: 'Поесть у печи и молчать', minutes: 45, terminal: true, goto: 'c43_sat_night',
        text: 'Миска на коленях, спина к печи. Голоса за столом. Ты устал{m:|а} так, что говорить не хочется.', effects: [set43('se', 'stove'), { body: 'hunger', delta: -20 }, until43(49, 19, 30)] },
      { id: 'c43_se_dishes', label: 'Мыть посуду, пока все говорят', minutes: 45, terminal: true, goto: 'c43_sat_night',
        text: 'Таз, тёплая вода, миски. За спиной разговор. Ты слушаешь спиной и не оборачиваешься.', effects: [set43('se', 'dishes'), until43(49, 19, 30)] },
    ] }),

  S43({ id: 'c43_sat_night', for: 'any', chapter: 'ch3', title: 'Ночь на воскресенье', camp: house14,
    text: [
      { text: 'Дом засыпает. За окном мороз, звёзды, тишина. С поля не слышно ничего.' },
    ],
    actions: [
      { id: 'c43_sn_talk', label: 'Рассказать {partner.dat} свой день', minutes: 30, terminal: true, goto: 'c43_sun_dawn',
        text: 'Шёпотом, в темноте. Ты рассказываешь свою субботу. Потом слушаешь. Кое-что из услышанного ты не понимаешь до конца, но не переспрашиваешь: завтра.', effects: [set43('sn', 'talk'), w43('told_night', true), until43(50, 7, 30, true)] },
      { id: 'c43_sn_keep', label: 'Рассказать не всё: кое-что не твоя тайна', minutes: 30, terminal: true, goto: 'c43_sun_dawn',
        text: 'Ты рассказываешь главное. Про одно молчишь: это доверили тебе, и решать не тебе {m:одному|одной}. {partner} слушает и, кажется, тоже о чём-то молчит.', effects: [set43('sn', 'keep'), until43(50, 7, 30, true)] },
      { id: 'c43_sn_sleep', label: 'Сразу спать', minutes: 20, terminal: true, goto: 'c43_sun_dawn',
        text: 'Ты засыпаешь раньше, чем успеваешь что-то сказать.', effects: [set43('sn', 'sleep'), { body: 'fatigue', delta: -4 }, until43(50, 7, 30, true)] },
    ] }),

  S43({ id: 'c43_sun_dawn', for: 'any', chapter: 'ch3', title: 'Четвёртый адвент', camp: kitchen14, onEnter: [until43(50, 7, 30)],
    text: [
      { text: 'Воскресенье. Минус один, низкое небо, редкий снег. Четвёртый адвент.' },
      { text: 'Хенрике ставит на стол венок и зажигает все четыре свечи разом, ещё до завтрака. «Heute alle vier». Сегодня все четыре.' },
      { when: v('w.c42_advent_guests', 'neighbors'), text: 'К трём придут Ханзены и Уте. Хенрике уже достала из буфета чашки с золотым ободком.' },
      { when: v('w.c42_advent_guests', 'brothers'), text: 'К трём придут братья Айдын. Хенрике поставила в духовку второй противень.' },
      { when: any(v('w.c42_advent_guests', 'none'), not(flag('w.c42_advent_guests'))), text: 'Гостей не ждут. Кофе в три будет для своих.' },
    ],
    actions: [
      { id: 'c43_sd_eat', label: 'Позавтракать при свечах', minutes: 45, terminal: true, outcomes: fromSunDawn, ...tableOnly,
        text: 'Каша с яблоком, по яйцу на каждого. Свечи горят днём, и от этого завтрак кажется праздником.', effects: [set43('sd', 'eat'), meal('eat'), until43(50, 8, 15)] },
      { id: 'c43_sd_sing', label: 'Попросить Хенрике спеть что-нибудь к адвенту', when: henrike43, minutes: 45, terminal: true, outcomes: fromSunDawn, ...tableOnly,
        text: 'Хенрике поёт «Tochter Zion» тихо, не поднимая глаз. На втором куплете подпевает кто-то ещё. Дети слушают, открыв рот.', effects: [set43('sd', 'sing'), meal('eat'), npc('henrike', 1), until43(50, 8, 15)] },
      { id: 'c43_sd_tea', label: 'Чай у окна: смотреть на снег', minutes: 30, terminal: true, outcomes: fromSunDawn,
        text: 'Снег идёт редко, крупно, будто нехотя. Ты пьёшь чай и смотришь, как двор становится белым.', effects: [set43('sd', 'tea'), { body: 'hunger', delta: -10 }, until43(50, 8, 0)] },
    ] }),

  S43({ id: 'c43_sun_lunch', for: 'any', chapter: 'ch3', title: 'Обед в воскресенье', camp: kitchen14, onEnter: [until43(50, 12, 30)],
    text: [
      { text: 'Обед. Курица из супа, картошка, подлива. Воскресный обед, как до ноября, только тарелок больше, а курица одна.' },
      { when: henrike43, text: 'Хенрике раскладывает мясо так, что каждому достаётся по кусочку. Себе — шейку.' },
    ],
    actions: [
      { id: 'c43_sl_eat', label: 'Обедать со всеми', minutes: 45, terminal: true, outcomes: [{ id: 'a', when: A43, goto: 'c43_a_prep' }, { id: 'b', goto: 'c43_b_merle2' }], ...tableOnly,
        text: 'Ты ешь медленно. Суп горячий, курица мягкая. За столом спорят, кто в прошлом году съел последний кусок рождественского гуся.', effects: [set43('sl', 'eat'), meal('eat'), until43(50, 13, 15)] },
      { id: 'c43_sl_give', label: 'Отдать свой кусок курицы детям', minutes: 45, terminal: true, outcomes: [{ id: 'a', when: A43, goto: 'c43_a_prep' }, { id: 'b', goto: 'c43_b_merle2' }], ...tableOnly,
        text: 'Ты перекладываешь свой кусок на детскую тарелку. Никто не говорит ни слова. Хенрике потом молча подкладывает тебе картошки.', effects: [set43('sl', 'give'), meal('eat'), until43(50, 13, 15)] },
      { id: 'c43_sl_bread', label: 'Поесть на ходу: к трём ещё много дел', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A43, goto: 'c43_a_prep' }, { id: 'b', goto: 'c43_b_merle2' }],
        text: 'Миска у плиты, пять минут. К трём придут гости, а пол ещё не мыт.', effects: [set43('sl', 'bread'), { body: 'hunger', delta: -15 }, until43(50, 13, 0)] },
      { id: 'c43_sl_dishes', label: 'Мыть посуду, пока остальные едят', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A43, goto: 'c43_a_prep' }, { id: 'b', goto: 'c43_b_merle2' }],
        text: 'Таз, тёплая вода, миски одна за другой. За спиной смеются. Хенрике ставит тебе миску на край стола: «Danach». Потом.', effects: [set43('sl', 'dishes'), until43(50, 13, 0)] },
    ] }),

  S43({ id: 'c43_coffee', for: 'any', chapter: 'ch3', title: 'Кофе в три', camp: kitchen14, onEnter: [until43(50, 15, 0)],
    text: [
      { text: 'Три часа. Кофе из цикория, печенье, четыре свечи в венке. Скатерть, которую Хенрике достаёт два раза в год.' },
      { when: v('w.c42_advent_guests', 'neighbors'), text: 'Фрау Ханзен сидит прямо, как в церкви. Уте принесла банку мёда и всё время смотрит в окно. Яннес не пришёл.' },
      { when: v('w.c42_advent_guests', 'brothers'), text: 'Дениз съедает печенье за печеньем и хвалит каждое. Керем молчит и улыбается.' },
      { when: parents43, text: 'Биргит разливает кофе, как дома: сначала гостям, потом себе.' },
    ],
    actions: [
      { id: 'c43_cf_sit', label: 'Сидеть со всеми и слушать', minutes: 75, terminal: true, outcomes: fromCoffee, ...tableOnly,
        text: 'Разговор о погоде, о курах, о том, кто где был в прошлом году на четвёртый адвент. Ни слова о ноябре. Это отдых.', effects: [set43('cf', 'sit'), meal('eat'), { body: 'stress', delta: -5 }, until43(50, 16, 15)] },
      { id: 'c43_cf_story', label: 'Рассказать что-нибудь смешное из своей прошлой жизни', minutes: 75, terminal: true, outcomes: fromCoffee, ...tableOnly,
        text: 'Ты рассказываешь про первый снег в другом городе, про трамвай и про варежку на рельсах. Смеются все, даже те, кто понял не всё.', effects: [set43('cf', 'story'), meal('eat'), { body: 'stress', delta: -6 }, until43(50, 16, 15)] },
      { id: 'c43_cf_kids', label: 'Увести детей играть, чтобы взрослые поговорили', minutes: 75, terminal: true, outcomes: fromCoffee,
        text: 'Карты, пуговицы, «камень, ножницы, бумага». Через час дети кричат так, что из кухни просят потише. Это хороший знак.', effects: [set43('cf', 'kids'), until43(50, 16, 15)] },
      { id: 'c43_cf_window', label: 'Встать у окна с чашкой: смотреть на снег', minutes: 60, terminal: true, outcomes: fromCoffee,
        text: 'Снег на поле, на изгороди, на лесополосе. За спиной смеются. Ты смотришь, пока чашка не остывает.', effects: [set43('cf', 'window'), until43(50, 16, 0)] },
    ] }),

  S43({ id: 'c43_sun_eve', for: 'any', chapter: 'ch3', title: 'Вечер воскресенья', camp: kitchen14, onEnter: [until43(50, 18, 30)],
    text: [
      { text: 'Вечер. Гости ушли. Венок на столе, свечи догорают. До Рождества четыре дня.' },
      { text: 'Хенрике говорит, ни к кому не обращаясь: «Morgen ist Rat. Brandt will Namen». Завтра совет. Брандт хочет имён.' },
    ],
    actions: [
      { id: 'c43_ev_eat', label: 'Ужинать', minutes: 60, terminal: true, goto: 'c43_sun_night', ...tableOnly,
        text: 'Остатки печенья, суп, хлеб. Ужин тихий. Каждый думает о своём, и все — о завтра.', effects: [set43('ev', 'eat'), meal('eat'), until43(50, 19, 45)] },
      { id: 'c43_ev_ask', label: 'Спросить Хенрике, каких имён хочет Брандт', when: henrike43, minutes: 60, terminal: true, goto: 'c43_sun_night', ...tableOnly,
        text: '— Wer in der Tauwetternacht vom Posten gegangen ist. — Хенрике мешает суп. — Er sagt, jemand war weg. Und deshalb ist der alte Hansen tot. Oder nur das Fenster kaputt. Je nachdem, wen man fragt.\n\nКто в ночь оттепели ушёл с поста. Он говорит, кого-то не было. И поэтому старик Ханзен мёртв. Или только окно разбито. Смотря кого спросить.', effects: [set43('ev', 'ask'), meal('eat'), until43(50, 19, 45)] },
      { id: 'c43_ev_quiet', label: 'Посидеть у печи, пока свечи не догорят', minutes: 60, terminal: true, goto: 'c43_sun_night',
        text: 'Четыре огонька, потом три, потом два. Ты сидишь, пока не гаснет последний. В темноте пахнет воском.', effects: [set43('ev', 'quiet'), { body: 'hunger', delta: -15 }, until43(50, 19, 45)] },
    ] }),

  S43({ id: 'c43_sun_night', for: 'any', chapter: 'ch3', title: 'Перед советом', camp: house14,
    text: [
      { text: 'Ночь перед понедельником. Дом спит. Ты лежишь и думаешь о совете, о Брандте, о том, что знаешь ты и что знает {partner}.' },
    ],
    actions: [
      { id: 'c43_nn_tell', label: 'Рассказать {partner.dat} всё, что знаешь', minutes: 45, terminal: true, goto: 'c43_checkpoint',
        text: 'Ты рассказываешь всё, даже то, о чём обещал{m:|а} молчать. {partner} долго молчит в темноте. Потом говорит: «Теперь мы знаем одно и то же». Не очень понятно, легче от этого или нет.', effects: [set43('nn', 'tell'), w43('all_told', true), finish, until43(50, 20, 30)] },
      { id: 'c43_nn_part', label: 'Рассказать главное, а чужую тайну оставить при себе', minutes: 45, terminal: true, goto: 'c43_checkpoint',
        text: 'Ты говоришь, что знаешь кое-что про ту ночь или про Винзен, но это не твоё. {partner} не настаивает. Вы засыпаете, держась за руки.', effects: [set43('nn', 'part'), finish, until43(50, 20, 30)] },
      { id: 'c43_nn_sleep', label: 'Уснуть: утро вечера мудренее', minutes: 45, terminal: true, goto: 'c43_checkpoint',
        text: 'Ты закрываешь глаза. Завтра будет длинный день.', effects: [set43('nn', 'sleep'), { body: 'fatigue', delta: -6 }, finish, until43(50, 20, 30)] },
    ] }),

  S43({ id: 'c43_checkpoint', for: 'any', chapter: 'ch3', title: 'Воскресенье, вечер', checkpoint: 43, universal: false, camp: house14,
    text: [{ text: 'Половина девятого. Четвёртый адвент кончается. До Рождества четыре дня.' }], actions: [] }),
];

