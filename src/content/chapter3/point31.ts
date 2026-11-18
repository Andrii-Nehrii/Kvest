import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { entryJoin } from './point30';
import { afterSupper31 } from './house28';

// Участок 31: вторник 1.12, 04:00 → КТ31 20:00. Передышка после ночи 30-й (или спасение выбывшего); находка A. План — STOCK_PLAN.md §9.
// Нормальный день: A — ящик из третьего грузовика, братья Айдын, машина; B — Нина и Винзен, доктор Зандер на обходе.
// Спасение: партнёр без сознания с ночи; к вечеру он приходит в себя при любом пути, хороший путь — раньше и легче.
export const P31: Cond = all({ cp: 30 }, not({ cp: 31 }));
export const A31: Cond = { me: 'A' };
export const B31: Cond = { me: 'B' };
export const farm31 = 'hof_luedemann';
export const jest31 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const partnerUp31: Cond = { partner: 'active' };
export const partnerDown31: Cond = { partner: 'incapacitated' };
const played30: Cond = any(flag('A.c30_finished'), flag('B.c30_finished'), flag('A.c30_down'), flag('B.c30_down'));
const base31: Cond = all(P31, played30, flag('w.c30_after'), { at: farm31 }, { partnerAt: farm31 }, up);
/** Обычный день: оба на ногах. */
export const stageN31: Cond = all(base31, partnerUp31);
/** Спасение: партнёр без сознания с ночи. */
export const stageR31: Cond = all(base31, partnerDown31);
export const point31Available: Cond = any(stageN31, stageR31);
/** Эта линия выхаживает партнёра. */
export const rescuer31: Cond = flag('$.c31_rescuer');
/** Партнёра выхаживали (для общих сцен вечера). */
export const nursedA: Cond = flag('B.c31_rescuer');
export const nursedB: Cond = flag('A.c31_rescuer');
export const own31 = (key: string, value: string): Cond => v(`$.c31_${key}`, value);

export const henrike31: Cond = { npc: 'henrike', alive: true, at: farm31 };
export const ole31: Cond = all({ npc: 'ole', alive: true, at: farm31 }, not(flag('w.c27_ole_last')));
export const lea31: Cond = { npc: 'c21_lea', alive: true, at: farm31 };
export const kasia31: Cond = { npc: 'kasia', alive: true, at: farm31 };
export const deniz31: Cond = { npc: 'deniz', alive: true };
export const kerem31: Cond = { npc: 'kerem', alive: true };
/** Кто-то из братьев Айдын жив: они и приезжают. */
export const brothers31: Cond = any(deniz31, kerem31);
export const ditch31: Cond = v('w.c30_tractor', 'ditch');
export const after31 = (x: string): Cond => v('w.c30_after', x);
/** Трактор вытаскивают сегодня: братья (всё — дому) или солдаты Тобиаса (половину — дружине). */
export const tractorOut31: Cond = all(ditch31, any(all(after31('home'), brothers31), after31('share')));
/** Corsa возвращают сегодня: её забрали в 26-й, и пара была на впадине или Брандт на её стороне. Машина должна стоять у пожарной части. */
export const carBack31: Cond = all(v('w.c26_car', 'taken'), any(entryJoin, v('w.c26_brandt', 'ally')), { itemAt: 'opel_corsa', place: jest31 });
export const frost31 = { tempC: -4, outdoor: true, wet: false };
/** Итоги дня, которые обе линии записывают одинаково (из состояния КТ30). Машину забирает A в обычный день; спасающий никуда не уходит. */
export const dayFacts31: Effect[] = [
  { if: tractorOut31, then: [{ set: 'w.c31_tractor_out', value: true }] },
  { if: all(carBack31, not(flag('$.c31_rescuer'))), then: [{ set: 'w.c31_car_due', value: true }] },
];
export const carDue31: Cond = flag('w.c31_car_due');

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm31, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S31 = wrap(P31);
export const set31 = (key: string, value: string | boolean): Effect => ({ set: `$.c31_${key}`, value });
export const w31 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c31_${key}`, value });
export const until31 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(31, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare31: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c31_finished', value: true };

/** После буксира: A — к ящику, B — к стирке, спасающий B — обратно к постели. Спасающий A тоже идёт к ящику (полчаса в сарае). */
export const afterTow = [
  { id: 'a', when: A31, goto: 'c31_a_box' },
  { id: 'r', when: rescuer31, goto: 'c31_r_noon' },
  { id: 'b', goto: 'c31_y_b_boots' },
];
/** После ящика: спасающий — к постели, остальные — к братьям. */
export const afterBox = [{ id: 'r', when: rescuer31, goto: 'c31_r_noon' }, { id: 'd', goto: 'c31_a_bag' }];

export const shared31: Scene[] = [
  S31({ id: 'c31_dawn', for: 'any', chapter: 'ch3', title: 'Четыре утра', camp: house14,
    text: [
      { text: 'Зарево над Гарльсторфом бледнеет, и его уже не отличить от рассвета, которого ещё нет. В доме все спят где упали: на лавке, на полу у печи, в креслах.' },
      { when: henrike31, text: 'Хенрике не спит. Сидит на кухне в пальто и держит кружку двумя руками.' },
    ],
    actions: [
      { id: 'c31_da_sleep', label: 'Лечь и спать, сколько дадут', minutes: 10, terminal: true, goto: 'c31_morning',
        text: 'Ты ложишься не раздеваясь. Сон приходит сразу, тяжёлый, как мокрое одеяло.', effects: [set31('da', 'sleep'), until31(7, 30, true)] },
      { id: 'c31_da_henrike', label: 'Сесть с Хенрике, пока не начнёт клонить', when: henrike31, minutes: 40, terminal: true, goto: 'c31_morning',
        text: 'Она наливает тебе из термоса. Молчит долго. Потом говорит, не глядя:\n\n— Mein Mann hat immer gesagt: nach dem Frost kommt der Matsch. Und im Matsch sieht man, was der Frost kaputt gemacht hat.\n\nМуж всегда говорил: после мороза приходит слякоть. И в слякоти видно, что мороз поломал.\n\nВ шестом часу ты засыпаешь прямо за столом.', effects: [set31('da', 'henrike'), npc('henrike', 1), until31(7, 30, true)] },
      { id: 'c31_da_list', label: 'Записать в тетрадь, что было ночью, пока помнишь', minutes: 30, terminal: true, goto: 'c31_morning',
        text: 'Ты пишешь коротко, по часам. Кто где стоял. Что сломалось. Что принесли. На середине буквы начинают расползаться, и ты бросаешь.', effects: [set31('da', 'list'), until31(7, 30, true)] },
    ] }),

  S31({ id: 'c31_morning', for: 'any', chapter: 'ch3', title: 'Утро после', camp: kitchen14,
    text: [
      { text: 'Половина восьмого. Ясно, минус четыре. После ночи кажется, что тепло.' },
      { text: 'Около восьми к воротам на велосипеде подъезжает Лукас, сын пожарного. Рука у него всё ещё на перевязи. Он не заходит, говорит через калитку.' },
      { text: '— Hinnerk ist nicht zurückgekommen. Vom Rand. Sie haben ihn heute früh gefunden.\n\nХиннерк не вернулся. С края. Его нашли утром.' },
      { text: '— Und Brandt hat sich die Finger erfroren. Drei Stück. Die Zander sagt, vielleicht bleiben sie dran.\n\nА Брандт отморозил пальцы. Три. Зандер говорит, может, и не отнимут.' },
      { text: 'Впадину выжгли наполовину. Остальных, говорит Лукас, доберёт мороз. Солдаты с утра считают ящики и стаскивают машины.' },
      { when: entryJoin, text: 'Хиннерк стоял в цепи через три человека от края. Ты помнишь его голос, но не лицо.' },
      { when: flag('w.c30_boy_saved'), text: 'Мальчишка, которого вытащили с края, жив. Пальцы на ногах у него чёрные, но он жив.' },
      { when: all(evaHere, nursedA), text: 'Эва уже перекрестилась за Хиннерка и теперь крестится, глядя на дверь комнаты, где лежит {A}.' },
      { when: all(evaHere, nursedB), text: 'Эва уже перекрестилась за Хиннерка и теперь крестится, глядя на дверь комнаты, где лежит {B}.' },
      { text: 'Солнце встаёт красное, и снег во дворе розовеет, будто ночью ничего не было.' },
    ],
    actions: [
      { id: 'c31_mo_eat', label: 'Позавтракать', minutes: 30, terminal: true, goto: 'c31_x_nina', ...tableOnly,
        text: 'Каша на воде, хлеб, чай. Ты ешь медленно. Руки после ночи держат ложку не сразу.', effects: [set31('mo', 'eat'), meal('eat'), until31(8, 30)] },
      { id: 'c31_mo_lukas', label: 'Выйти к Лукасу и спросить, как остальные', minutes: 20, terminal: true, goto: 'c31_x_nina', ambientDuring: frost31,
        text: 'Лукас перечисляет, загибая пальцы здоровой руки. У одного разбито лицо. У двоих отморожены ноги. Один солдат пропал, но он, может, просто уехал со своими.\n\n— Papa lebt, — говорит он в конце. Папа жив. И уезжает, не прощаясь.', effects: [set31('mo', 'lukas'), until31(8, 30)] },
      { id: 'c31_mo_quiet', label: 'Посидеть молча', minutes: 30, terminal: true, goto: 'c31_x_nina',
        text: 'Ты сидишь. Хиннерк. Ты не знаешь, был ли он женат. Ты даже фамилии его не знаешь.', effects: [set31('mo', 'quiet'), { body: 'stress', delta: -2 }, until31(8, 30)] },
    ] }),

  S31({ id: 'c31_tow', for: 'any', chapter: 'ch3', title: 'Трос', camp: yard14, ambient: frost31,
    text: [
      { text: 'В половине десятого по дороге от Гарльсторфа ползёт армейский тягач. На тросе за ним — грузовик с колонны, третий, тот, что лежал в канаве. Кабина смята набок, тент порван, колёса стоят криво.' },
      { text: 'У ваших ворот трос лопается со звуком выстрела. Грузовик сползает к обочине и встаёт.' },
      { text: 'Двое солдат вылезают из тягача, ругаются, смотрят на обрывок. Один идёт к воротам: нет ли верёвки покрепче и кипятка.' },
      { text: 'Грузовик стоит у забора, задним бортом к дому. Борт исписан мелом: крупно «KOL 7», ниже, мельче, «ab H 19.11.». Ещё ниже кто-то нарисовал сердце и вывел печатными буквами: «MAMA ICH KOMM WEIHNACHTEN».' },
      { when: henrike31, text: 'Хенрике смотрит на сердце и уходит в дом, не сказав ни слова.' },
      { when: A31, text: 'Второй солдат лезет в кабину и долго возится под смятым сиденьем. Вытаскивает серый армейский ящик с навесным замком, ставит на снег и смотрит в бумагу.\n\n— Steht nicht auf der Liste, — говорит он тебе. Нет в списке. — Der Fahrer braucht nichts mehr. Ich schleppe das nicht nach Jesteburg.\n\nВодителю уже ничего не нужно. Я это в Йестебург не потащу.\n\nОн толкает ящик ногой к твоим ботинкам.' },
    ],
    actions: [
      { id: 'c31_tw_water', label: 'Вынести им кипятку', minutes: 30, terminal: true, outcomes: afterTow,
        text: 'Ты выносишь чайник и две кружки. Солдаты пьют стоя, обжигаясь. Младший говорит «danke» три раза подряд, будто у него только это слово и осталось.', effects: [set31('tw', 'water'), ...dayFacts31, until31(10, 30)] },
      { id: 'c31_tw_rope', label: 'Принести верёвку из сарая и помочь вязать', minutes: 40, activity: 'moderate', terminal: true, outcomes: afterTow,
        text: 'Верёвку Хенрике, старую, просмолённую, вы вяжете вдвое. Пальцы на морозе деревенеют. Тягач трогается, верёвка трещит, но держит. Грузовик уползает к Йестебургу, и мел на борту уменьшается до белого пятна.', effects: [set31('tw', 'rope'), ...dayFacts31, { body: 'fatigue', delta: 3 }, until31(10, 30)] },
      { id: 'c31_tw_watch', label: 'Смотреть с крыльца', minutes: 20, terminal: true, outcomes: afterTow,
        text: 'Ты стоишь на крыльце, пока солдаты вяжут свою верёвку. Через полчаса грузовик уползает. На снегу у забора остаётся тёмное пятно масла.', effects: [set31('tw', 'watch'), ...dayFacts31, until31(10, 30)] },
      { id: 'c31_tw_push', label: 'Встать к колесу и толкать, пока тянут', minutes: 60, activity: 'heavy', risky: true, terminal: true, outcomes: afterTow, ambientDuring: frost31,
        text: 'Ты упираешься плечом в заднее колесо. Трос натягивается, звенит. Колесо проворачивается на льду, брызгает снежной кашей в лицо, потом цепляется. Трактор выползает из кювета рывком, и ты падаешь лицом в снег, туда, где только что было колесо. Встаёшь мокрый по пояс спереди. Дениз хохочет и хлопает тебя по спине.', effects: [set31('tw', 'push'), { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 2 }, until31(10, 30)] },
    ] }),

  S31({ id: 'c31_evening', for: 'any', chapter: 'ch3', title: 'Ужин во вторник', camp: kitchen14,
    text: [
      { text: 'Ужин поздний: все собираются, когда совсем стемнело. Суп из всего, что было, и хлеб.' },
      { when: all(nursedA, flag('$.c31_rescuer'), partnerUp31), text: '{A} сидит у печи, завёрнутый в одеяло, с повязкой на голове. Ест сам, медленно, и после каждой ложки отдыхает.' },
      { when: all(nursedB, flag('$.c31_rescuer'), partnerUp31), text: '{B} сидит у печи, завёрнутая в одеяло, с повязкой на голове. Ест сама, медленно, и после каждой ложки отдыхает.' },
      { when: brothers31, text: 'Разговор за столом один: Бухгольц. Братья Айдын бросают мастерскую и зовут {A.acc} на два дня, в среду и четверг, вывезти инструмент и генератор. Доктору Зандер генератор нужен для пункта.' },
      { when: not(brothers31), text: 'Разговор за столом один: доктору Зандер для пункта нужен генератор, и в Бухгольце, в пустой мастерской, он есть. Кто-то должен съездить на два дня.' },
      { when: ninaFarm, text: 'Нина ждёт, пока взрослые договорят, и говорит своё: в Винзене открылась школа. В среду туда идёт армейский грузовик, в четверг обратно. Доктору Зандер оттуда нужны лекарства Красного Креста.' },
      { when: not(ninaFarm), text: 'И ещё одно: в среду в Винзен идёт армейский грузовик, в четверг обратно. Доктору Зандер оттуда нужны лекарства Красного Креста. Нина в Винзене, она будет ждать.' },
      { when: carDue31, text: 'Под навесом снова стоит Corsa.' },
      { when: flag('w.c31_tractor_out'), text: 'Трактор Хенрике стоит во дворе. Прицеп помят, фара разбита, но он заводится.' },
      { when: v('$.c31_da', 'list'), text: 'Записи ночи лежат в тетради. Ты {m:перечитал|перечитала} их днём и {m:понял|поняла}, что половину уже не помнишь. Хорошо, что записано.' },
      { when: v('$.c31_mo', 'lukas'), text: 'Лукас заезжает ещё раз, под вечер: отец просил передать спасибо, что спросили про всех. Так никто не делал.' },
      { when: v('$.c31_ad', 'think'), text: 'Братья Айдын ждут ответа. Дениз дважды присылает Керема спросить: ну что, едешь?' },
      { when: v('$.c31_ad', 'ask'), text: 'Ты пересказываешь за столом то, что Дениз говорил про Бухгольц: вокзал, больница, твоя улица. Хенрике слушает и качает головой.' },
      { when: flag('w.c31_hose_fixed'), text: 'Уве передал через Лукаса: насос на машине теперь держит. Если что — приедут.' },
      { text: 'На столе картошка в мундире и квашеная капуста. После вчерашней ночи никто не ест быстро. Чай разливают всем одинаково, до краёв.' },
      { when: v('$.c31_bp', 'letters'), text: 'Письма лежат в кармане, три конверта без марок. Кому-то из них, может быть, повезёт дойти.' },
      { when: v('$.c31_bp', 'sleep'), text: 'Ты {m:лёг|легла} пораньше, но сон не шёл. К ужину ты {m:спустился|спустилась} раньше всех.' },
    ],
    actions: [
      { id: 'c31_ev_eat', label: 'Поесть', minutes: 40, terminal: true, outcomes: afterSupper31, ...tableOnly,
        text: 'Суп горячий. Ты ешь, пока тепло не доходит до пальцев ног.', effects: [set31('ev', 'eat'), meal('eat'), finish, until31(19, 30)] },
      { id: 'c31_ev_partner', label: 'Сесть рядом с {partner.ins}', minutes: 40, terminal: true, outcomes: afterSupper31,
        text: 'Ты садишься рядом. Под столом ваши колени касаются. Вы почти не разговариваете. После такой ночи и такого дня это и не нужно.', effects: [set31('ev', 'partner'), { body: 'stress', delta: -3 }, finish, until31(19, 30)] },
      { id: 'c31_ev_plan', label: 'Разложить на столе, кто куда завтра едет и с чем', minutes: 40, terminal: true, outcomes: afterSupper31,
        text: 'Вы раскладываете на столе: карта, листки, ключи. Кто куда, во сколько, с кем, что взять, что привезти. Хенрике смотрит через плечо и молча дописывает на краю листа: «Salz». Соль. Нина записывает всё в свою тетрадь, на отдельной странице, и подписывает: «Mittwoch».', effects: [set31('ev', 'plan'), w31('plan_written', true), until31(19, 30)] },
    ] }),

  S31({ id: 'c31_checkpoint', for: 'any', chapter: 'ch3', title: 'Вторник, вечер', checkpoint: 31, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Завтра в семь армейский грузовик идёт на Винзен, а на Бухгольц уходит фургон. Кто куда едет, решается сейчас.' }], actions: [] }),
];
