import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { felix47, henrike47, merle47 } from './point47';
import { julian45 } from './point45';

// Участок 48 «Двадцать восьмое»: пн 28.12, 05:30 → КТ48 вт 29.12, 20:00. Передышка после лесополосы; порознь на часть.
// Вторник: хутор (сборы к Сильвестру на площади, беженцы из Гамбурга у калитки, Бьёрн, прорубь) или больница в Эппендорфе у {B}.
// Три расклада, по состоянию после КТ47:
//   спасение — один выбыл в 47-й: второй (`c48_r_*`, `day48r.ts`) выхаживает, к вечеру выбывший приходит в себя; колонна уходит
//              без вас (Мерле — с матерью, если родители на хуторе, иначе одна с Нильсом);
//   колонна  — Мерле подписала (`w.c44_hamburg_trip`) и оба на ногах: на рассвете вместе в Винзен, у школы прощание; B уезжает
//              с колонной в Гамбург на неделю (`day48b.ts`, `c48_hb_*`: Харбургский мост, пропуск Тобиаса, город-острова,
//              больница в Эппендорфе), A возвращается (`day48a.ts`, `c48_ha_*`) — и дальше общий день хутора без {B};
//   обычный  — оба дома: утром порознь (A — к Нильсу в Йестебург с письмом Тобиасу и едой для Винзена по КТ46/КТ47, к Брандту;
//              B — дом, Люллау, фрау Ханзен), после обеда вместе: Бьёрн Тиде, посты по КТ47, сборы к Сильвестру.
// КТ48: Бьёрн Тиде (`c3_new_bjorn48`) и, если {B} в Гамбурге, — вернуться с первой колонной или остаться до весны (`c3_new_uke48`).
export const P48: Cond = all({ cp: 47 }, not({ cp: 48 }));
export const A48: Cond = { me: 'A' };
export const farm48 = 'hof_luedemann';
export const jest48 = 'c16_jesteburg';
export const winsen48 = 'c15_winsen';
export const uke48 = 'c48_uke';
export const harburg48 = 'c48_harburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const partnerUp48: Cond = { partner: 'active' };
export const partnerDown48: Cond = { partner: 'incapacitated' };
const played47: Cond = any(flag('A.c47_finished'), flag('B.c47_finished'), flag('A.c47_down'), flag('B.c47_down'));
const base48: Cond = all(P48, played47, { at: farm48 }, { partnerAt: farm48 }, up);
export const point48Available: Cond = all(base48, any(partnerUp48, partnerDown48));

export const henrike48 = henrike47;
export const merle48 = merle47;
export const felix48 = felix47;
export const julian48 = julian45;
export const parents48: Cond = all(merle47, flag('w.c38_parents'));
/** Колонна: Мерле подписала, оба на ногах. */
export const hamburg48: Cond = all(merle47, flag('w.c44_hamburg_trip'), not(flag('A.c47_down')), not(flag('B.c47_down')));
export const normal48: Cond = all(not(flag('A.c47_down')), not(flag('B.c47_down')), not(hamburg48));
export const rescuer48: Cond = flag('$.c48_rescuer');
/** Партнёр выбыл в 47-й (флаг с КТ47; к утру он может уже открывать глаза, но участок 48 за него ведёт второй). */
export const partnerWasDown48: Cond = any(all(A48, flag('B.c47_down')), all(not(A48), flag('A.c47_down')));
export const bjornAlive48: Cond = all(flag('w.c47_karsten'), not(v('w.c47_karsten', 'hidden')));
export const silvester48 = (x: string): Cond => v('w.c46_silvester', x);
export const posts48 = (x: string): Cond => v('w.c47_posts', x);
export const cellar48 = (x: string): Cond => v('w.c47_cellar', x);
export const letter48: Cond = any(v('w.c46_answer', 'thanks'), v('w.c46_answer', 'ask'));
export const own48 = (key: string, value: string): Cond => v(`$.c48_${key}`, value);

export const dark48 = { tempC: -8, outdoor: true, wet: false };
export const day48 = { tempC: -5, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm48, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S48 = wrap(P48);
export const set48 = (key: string, value: string | boolean): Effect => ({ set: `$.c48_${key}`, value });
export const w48 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c48_${key}`, value });
export const until48 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(58, h, m), ...(sleeping ? { sleeping: true } : {}) });
/** Вторник, 29.12. */
export const tue48 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(59, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare48: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed48 = (n = 30): Effect[] => [{ body: 'hunger', delta: -n }, { body: 'thirst', delta: -25 }];
export const trip48 = (where: string, rest: false | 'sleep' = false) => ({ at: where, stock: 'c3_farm_stock', rest });
const finish: Effect = { set: '$.c48_finished', value: true };
const toWinsen: Effect = { move: winsen48 };
const fromDawn = [
  { id: 'r', when: partnerWasDown48, goto: 'c48_r_bed' },
  { id: 'h', when: hamburg48, goto: 'c48_h_road' },
  { id: 'a', when: A48, goto: 'c48_na_nils' },
  { id: 'b', goto: 'c48_nb_morning' },
];
const fromSchool = [{ id: 'a', when: A48, goto: 'c48_ha_market' }, { id: 'b', goto: 'c48_hb_bus' }];
/** Общий день хутора после обеда — оба дома или {A} без уехавшей {B}. */
const alone48: Cond = all(A48, hamburg48);

export const shared48: Scene[] = [
  S48({ id: 'c48_dawn', for: 'any', chapter: 'ch3', title: 'Двадцать восьмое', camp: kitchen14,
    text: [
      { text: 'Половина шестого. Темно и тихо, мороз под минус восемь. На плите чайник начинает шуметь. Двадцать восьмое декабря.' },
      { when: partnerWasDown48, text: '{partner} лежит на кровати Хенрике с повязкой на голове. Ты сидишь рядом с вечера.' },
      { when: hamburg48, text: 'У двери два рюкзака и синяя сумка-холодильник. Мерле уже одета и сидит на лавке в куртке, держа сумку на коленях. В семь — школа в Винзене.' },
      { when: all(hamburg48, parents48), text: 'Биргит заплетает Мерле косу, как маленькой. Уве стоит у окна и смотрит в темноту.' },
      { when: normal48, text: 'В шесть Нильс уходит из Йестебурга в Винзен, к колонне. Если что-то передать — сейчас.' },
    ],
    actions: [
      { id: 'c48_dw_eat', label: 'Позавтракать в темноте, при одной лампе', minutes: 15, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, чай, хлеб. Ешь быстро и почти не жуёшь. За окном ни огонька.', effects: [set48('dw', 'eat'), meal('eat'), until48(5, 45)] },
      { id: 'c48_dw_tea', label: 'Только кружку горячего: есть не хочется', minutes: 15, terminal: true, outcomes: fromDawn,
        text: 'Кружка обжигает ладони. Ты пьёшь стоя, глядя в окно на чёрный двор.', effects: [set48('dw', 'tea'), { body: 'hunger', delta: -8 }, { body: 'thirst', delta: -15 }, until48(5, 45)] },
      { id: 'c48_dw_kids', label: 'Заглянуть к спящим детям и подоткнуть одеяла', minutes: 15, terminal: true, outcomes: fromDawn,
        text: 'Дети спят вповалку, кто-то раскрылся. Ты подтыкаешь одеяла, кладёшь в печку полено и тихо закрываешь дверь. Младший во сне говорит что-то про санки.', effects: [set48('dw', 'kids'), until48(5, 45)] },
      { id: 'c48_dw_henrike', label: 'Помочь Хенрике растопить плиту', when: henrike48, minutes: 15, terminal: true, outcomes: fromDawn,
        text: 'Щепа, бумага, два полена. Хенрике дует в топку, ты держишь заслонку. Огонь берётся. Она говорит, не поворачиваясь: «Heute wird ein langer Tag». Сегодня будет длинный день.', effects: [set48('dw', 'henrike'), npc('henrike', 1), { body: 'hunger', delta: -15 }, until48(5, 45)] },
    ] }),

  // ── Колонна: прощание у школы ──
  S48({ id: 'c48_h_road', for: 'any', chapter: 'ch3', title: 'В Винзен', camp: yard14, ambient: dark48,
    text: [
      { text: 'Лукас ждёт у калитки на тракторе с прицепом: на прицеп — рюкзаки, Мерле и всех, кто едет провожать. Фары трактора режут темноту на два жёлтых коридора.' },
      { when: parents48, text: 'Биргит садится рядом с Мерле и держит её за руку всю дорогу. Уве остаётся у калитки: кому-то надо остаться.' },
    ],
    actions: [
      { id: 'c48_hr_hold', label: 'Сидеть рядом с {partner.ins} и молчать', minutes: 60, terminal: true, goto: 'c48_h_school', ambientDuring: dark48,
        text: 'Прицеп трясёт на мёрзлой колее. {partner} сидит рядом, плечо к плечу. Слова кончились ещё вчера вечером. Это не страшно.', effects: [set48('hr', 'hold'), toWinsen, until48(6, 50)] },
      { id: 'c48_hr_merle', label: 'Сесть к Мерле: ей страшнее всех, хоть она и не признаётся', minutes: 60, terminal: true, goto: 'c48_h_school', ambientDuring: dark48,
        text: 'Мерле говорит про больницу, как про школу: что взяла, что спросит у врача, где будет спать. Голос ровный. Пальцы на сумке-холодильнике белые.', effects: [set48('hr', 'merle'), npc('merle', 1), toWinsen, until48(6, 50)] },
      { id: 'c48_hr_lukas', label: 'Стоять за кабиной и смотреть вперёд, на дорогу', minutes: 60, terminal: true, goto: 'c48_h_school', ambientDuring: dark48,
        text: 'Ветер в лицо, мороз щиплет. Лукас поёт под нос, сбиваясь на каждом ухабе. На подъезде к Винзену уже видно огни: у школы горят фонари колонны.', effects: [set48('hr', 'lukas'), toWinsen, until48(6, 50)] },
    ] }),

  S48({ id: 'c48_h_school', for: 'any', chapter: 'ch3', title: 'Колонна', location: winsen48, camp: trip48(winsen48), ambient: dark48,
    text: [
      { text: 'Двор школы в Винзене. Две машины Красного Креста с гамбургскими номерами, старый рейсовый автобус с крестом на боку, впереди джип дружины до моста. Вибке с тетрадью у дверей автобуса, Нильс с термосом у первой машины.' },
      { text: 'Сто человек провожающих, двадцать едущих. Кто-то плачет громко, кто-то не плачет вовсе. Пар изо ртов висит над двором.' },
      { text: 'Вибке выкрикивает фамилии. Мерле. Потом {B}.' },
    ],
    actions: [
      { id: 'c48_hs_hug', label: 'Обнять и не говорить «прощай»', minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: dark48,
        text: 'Вы стоите обнявшись, пока Вибке не кричит фамилию во второй раз. Ни один не говорит «прощай». Говорите: «через неделю». Как будто это близко.', effects: [set48('hs', 'hug'), { body: 'stress', delta: 5 }, w48('hamburg', true), until48(7, 20)] },
      { id: 'c48_hs_pass', label: 'Ещё раз проверить, что пропуск Тобиаса в нагрудном кармане у {B.gen}', when: flag('w.c46_pass'), minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: dark48,
        text: 'Пропуск в нагрудном кармане у {B.gen}, пуговица застёгнута, сверху ладонь. На двоих. Значит, обратно можно вернуться и не одной. Это шутка. Почти.', effects: [set48('hs', 'pass'), w48('pass_with_b', true), w48('hamburg', true), until48(7, 20)] },
      { id: 'c48_hs_nils', label: 'Подойти вдвоём к Нильсу', minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: dark48,
        text: 'Нильс жмёт руки обоим. «Ich bring sie hin. Und ich bring sie zurück. Wenn die Brücke will». Довезу. И привезу обратно. Если мост захочет. Он наливает вам по глотку из термоса: кофе, настоящий.', effects: [set48('hs', 'nils'), w48('hamburg', true), until48(7, 20)] },
      { id: 'c48_hs_letter', label: 'Отдать Нильсу письмо Тобиасу: пусть уйдёт с почтой из Гамбурга', when: letter48, minutes: 25, terminal: true, outcomes: fromSchool, ambientDuring: dark48,
        text: 'Нильс прячет конверт во внутренний карман куртки. «Lauenburg. Über die Feldpost. Dauert, kommt aber». Лауэнбург. Через полевую почту. Долго, но дойдёт.', effects: [set48('hs', 'letter'), w48('letter_sent', true), w48('hamburg', true), until48(7, 20)] },
    ] }),

  // ── После обеда — хутор: оба (обычный день) или {A} один ──
  S48({ id: 'c48_n_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14,
    text: [
      { when: alone48, text: 'Обед. За столом на два места меньше: нет {B.gen} и Мерле. Тарелки никто не убирает, они просто стоят пустые, пока Хенрике не ставит на одну из них хлеб.' },
      { when: normal48, text: 'Обед. Оба дома, после полдня порознь. За столом говорят про колонну: ушла ли, пустили ли через мост. Никто не знает.' },
      { when: felix48, text: 'Феликс ест молча и ловит каждое слово про мост: за мостом его часть.' },
    ],
    actions: [
      { id: 'c48_nl_eat', label: 'Обедать со всеми', minutes: 45, terminal: true, goto: 'c48_n_bjorn', ...tableOnly,
        text: 'Суп с картошкой из Вальдхофа, хлеб, чай. Картошка мелкая и сладкая от мороза. Ты ешь и думаешь, что в погребе у Штёверов она пролежала бы до весны.', effects: [set48('nl', 'eat'), meal('eat'), until48(13, 15)] },
      { id: 'c48_nl_tell', label: 'Рассказать за столом, что видел{m:|а} утром', minutes: 45, terminal: true, goto: 'c48_n_bjorn', ...tableOnly,
        text: 'Ты рассказываешь, и тебя слушают, не перебивая. Хенрике кивает на каждую новость, как будто ставит галочки в тетради.', effects: [set48('nl', 'tell'), meal('eat'), until48(13, 15)] },
      { id: 'c48_nl_quick', label: 'Поесть на ходу: дел много', minutes: 30, terminal: true, goto: 'c48_n_bjorn',
        text: 'Ломоть хлеба с салом, кружка чая. Ты ешь стоя у двери и уже в куртке.', effects: [set48('nl', 'quick'), { body: 'hunger', delta: -20 }, until48(13, 0)] },
    ] }),

  S48({ id: 'c48_n_bjorn', for: 'any', chapter: 'ch3', title: 'Хутор Тиде', location: 'c3_neighbor', camp: trip48('c3_neighbor'), ambient: day48,
    text: [
      { text: 'После обеда — к хутору Тиде за колонией: два километра по полю. Брандт просил кого-нибудь заглянуть.' },
      { when: bjornAlive48, text: 'Бьёрн колет дрова у сарая, в отцовской куртке, которая ему велика. Видит вас и не останавливается. Колет, пока не кончаются чурки. Потом садится на колоду.' },
      { when: bjornAlive48, text: '— Brandt sagt, ich soll zu jemandem ziehen. Ich will nicht zu jemandem. Das ist unser Hof.\n\nБрандт говорит, мне надо к кому-то переехать. Я не хочу к кому-то. Это наш двор.' },
      { when: not(bjornAlive48), text: 'Двор Тиде пуст. Дверь дома заколочена крест-накрест, на ней мелом: «Tiede — 27.12.» За сараем два холмика под свежим снегом. Брандт сделал, что надо было сделать.' },
    ],
    actions: [
      { id: 'c48_nbj_sit', label: 'Сесть рядом на колоду и помолчать', when: bjornAlive48, minutes: 50, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'Вы сидите. Бьёрн смотрит на поле. Потом говорит, что отец учил его колоть «по годовым кольцам, а не поперёк». Что он ещё не плакал. Что, наверное, будет. Потом встаёт и собирает дрова в охапку.', effects: [set48('nbj', 'sit'), w48('bjorn_visited', true), until48(14, 30)] },
      { id: 'c48_nbj_ask', label: 'Спросить, есть ли у него еда и чем он топит', when: bjornAlive48, minutes: 50, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'Еды — на неделю, если не наедаться. Дров — на месяц. Куры есть, шесть штук. Воды — колодец. Он перечисляет, как отец перечислял бы. Он справится. Неделю. Может, две. Дальше ты не знаешь.', effects: [set48('nbj', 'ask'), w48('bjorn_visited', true), w48('bjorn_stock', true), until48(14, 30)] },
      { id: 'c48_nbj_stack', label: 'Помочь ему сложить поленницу под навес', when: bjornAlive48, minutes: 50, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'Вы складываете дрова вдвоём, ряд за рядом, корой вверх. Бьёрн работает молча и быстро, как отец. Когда заканчиваете, он смотрит на поленницу и говорит: «Bis März». До марта.', effects: [set48('nbj', 'stack'), until48(14, 30)] },
      { id: 'c48_nbj_letter', label: 'Спросить про письмо, которое оставил ему отец', when: all(bjornAlive48, v('w.c47_karsten_end', 'told')), minutes: 50, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'Бьёрн достаёт из нагрудного кармана сложенный листок и не разворачивает. «Er schreibt, ich soll den Hof nicht verkaufen. Wem denn?» Он пишет, чтобы я не продавал двор. Кому? И смеётся, коротко, сквозь зубы. Листок он кладёт обратно, к сердцу.', effects: [set48('nbj', 'letter'), w48('bjorn_visited', true), until48(14, 30)] },
      { id: 'c48_nbj_grave', label: 'Постоять у холмиков за сараем', when: not(bjornAlive48), minutes: 40, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'Два холмика, один длиннее, другой короче. Без табличек. Ты стоишь, пока не начинают мёрзнуть руки, и думаешь о шарфе, которым было замотано предплечье. Потом идёшь назад, не оглядываясь.', effects: [set48('nbj', 'grave'), { body: 'stress', delta: 6 }, until48(14, 20)] },
      { id: 'c48_nbj_house', label: 'Проверить, заперт ли дом, и заколотить окно, которое разбито', when: not(bjornAlive48), minutes: 40, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'Окно в кухне разбито, в доме намело снега. Ты прибиваешь доску крест-накрест. Пусть дом Тиде стоит закрытым, пока кто-то не решит, чей он теперь.', effects: [set48('nbj', 'house'), until48(14, 20)] },
      { id: 'c48_nbj_hens', label: 'Забрать кур с пустого двора, чтобы не замёрзли', when: not(bjornAlive48), minutes: 50, terminal: true, goto: 'c48_n_posts', ambientDuring: day48,
        text: 'В курятнике Тиде шесть кур, голодных и злых. Ты ловишь их в мешок по одной. Брандт потом скажет, что правильно. Хенрике скажет, что их нечем кормить. Обе правды.', effects: [set48('nbj', 'hens'), w48('tiede_hens', true), until48(14, 30)] },
    ] }),

  S48({ id: 'c48_n_posts', for: 'any', chapter: 'ch3', title: 'Посты', camp: yard14, ambient: day48,
    text: [
      { when: posts48('double'), text: 'До Нового года — по двое на посту. Значит, смены чаще и длиннее, и спать придётся урывками. Список на гвозде у двери кухни переписывают в третий раз.' },
      { when: posts48('bell'), text: 'Решили: на посту один, а от колокола у Зеве до кухни — верёвка. Двести метров верёвки по столбам и кустам, чтобы дёрнуть — и в доме звякнуло.' },
      { when: posts48('brandt'), text: 'Брандт дал двоих из дружины на посты у Зеве до Нового года. В обмен ваш двор в Сильвестр — на страже у площади. Дружинники уже стоят у шалаша и курят.' },
      { when: not(flag('w.c47_posts')), text: 'Посты до Нового года остаются как были: один у Зеве, смены по три часа.' },
      { when: alone48, text: 'Без {B.gen} на одну пару рук меньше. Это чувствуется в каждой смене.' },
    ],
    actions: [
      { id: 'c48_np_rope', label: 'Тянуть верёвку от колокола к дому', when: posts48('bell'), minutes: 90, terminal: true, goto: 'c48_n_prep', ambientDuring: day48, activity: 'moderate',
        text: 'Моток бельевой верёвки, гвозди, крючки на столбах. Через полтора часа ты дёргаешь у колокола, и в кухне звякает колокольчик от коровы Берты. Хенрике выглядывает в окно и машет рукой: слышно.', effects: [set48('np', 'rope'), w48('rope', true), { body: 'fatigue', delta: 5 }, until48(16, 0)] },
      { id: 'c48_np_list', label: 'Переписать список смен так, чтобы никто не стоял две ночи подряд', minutes: 60, terminal: true, goto: 'c48_n_prep',
        text: 'Ты считаешь людей, ночи, часы. Не сходится. Пересчитываешь. Кто-то всё равно стоит две ночи подряд — ты вписываешь себя.', effects: [set48('np', 'list'), w48('shift_list', true), until48(15, 45)] },
      { id: 'c48_np_shelter', label: 'Утеплить шалаш у Зеве: лапник, мешковина, старое одеяло', minutes: 75, terminal: true, goto: 'c48_n_prep', ambientDuring: day48, activity: 'moderate',
        text: 'Лапник в два слоя, мешковина сверху, одеяло на пень. Внутри шалаша теперь можно сидеть, не стуча зубами. Почти.', effects: [set48('np', 'shelter'), w48('shelter_warm', true), { body: 'fatigue', delta: 4 }, until48(16, 0)] },
      { id: 'c48_np_guards', label: 'Отнести дружинникам у шалаша горячего', when: posts48('brandt'), minutes: 60, terminal: true, goto: 'c48_n_prep', ambientDuring: day48,
        text: 'Двое дружинников из Ханштедта, незнакомые. Пьют, благодарят, рассказывают, что у Брандта после лесополосы до ночи горел свет в дежурке. Чай пьют до дна.', effects: [set48('np', 'guards'), until48(15, 45)] },
    ] }),

  S48({ id: 'c48_n_prep', for: 'any', chapter: 'ch3', title: 'К Сильвестру', camp: yard14, ambient: day48,
    text: [
      { text: 'До Сильвестра три дня. На хуторе готовятся, кто как понимает.' },
      { when: silvester48('go'), text: 'Ваш двор идёт к пожарной части весь, стража вокруг площади ваша. Нужны фонари, топоры, верёвка, и кто-то, кто останется у дома.' },
      { when: silvester48('some'), text: 'К пожарной части идёт часть двора. Кто — ещё не решили. Кто остаётся — тот у колокола.' },
      { when: silvester48('stay'), text: 'Ваш двор в Сильвестр дома. Брандт это запомнил. Значит, дома должно быть так, чтобы никто не пожалел.' },
      { when: silvester48('quiet'), text: 'Брандт согласился: без фейерверка, три поста со стороны леса. Один из постов — ваш.' },
      { when: flag('w.c47_owe_brandt'), text: 'И ещё долг за мешок из Вальдхофа: в Сильвестр ваш двор стоит в страже. Без разговоров.' },
    ],
    actions: [
      { id: 'c48_npr_lamps', label: 'Проверить фонари и сделать два факела про запас', minutes: 60, terminal: true, goto: 'c48_n_dusk',
        text: 'Фонари заряжены, керосин в лампах. Два факела из палок, тряпок и смолы. Ты ставишь их в сенях, в угол. Надеешься, что не понадобятся. Знаешь, что надеяться мало.', effects: [set48('npr', 'lamps'), w48('torches', true), until48(16, 45)] },
      { id: 'c48_npr_kids', label: 'Сделать с детьми бумажные фонарики на окна', minutes: 60, terminal: true, goto: 'c48_n_dusk',
        text: 'Цветная бумага из школьных тетрадей, клей из муки, свечные огарки внутрь. Фонарики выходят кривые и яркие. Дети спорят, чей кривее.', effects: [set48('npr', 'kids'), { body: 'stress', delta: -5 }, until48(16, 45)] },
      { id: 'c48_npr_food', label: 'Посчитать с Хенрике, что поставить на стол в Сильвестр', when: henrike48, minutes: 60, terminal: true, goto: 'c48_n_dusk',
        text: 'Хенрике хочет «Berliner», пончики, как каждый год. Масла нет. Яиц три. Муки — есть. «Dann eben ohne Füllung». Тогда без начинки. Ты записываешь, и она вдруг улыбается: «Wie im Krieg, hat meine Mutter gesagt». Как в войну, говорила мама.', effects: [set48('npr', 'food'), npc('henrike', 1), until48(16, 45)] },
      { id: 'c48_npr_julian', label: 'Спросить Юлиана, где он будет в Сильвестр', when: julian48, minutes: 60, terminal: true, goto: 'c48_n_dusk',
        text: 'Юлиан пожимает плечами: с бабушкой, в будке у переезда. Бабушка спит в девять. «Und dann bin ich wach. Allein». А потом я не сплю. Один. Он говорит это без жалобы, как про погоду.', effects: [set48('npr', 'julian'), w48('julian_alone', true), until48(16, 45)] },
    ] }),

  S48({ id: 'c48_n_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: day48,
    text: [
      { text: 'Сумерки наступают в четыре. Небо над лесополосой зеленоватое, потом синее. На посту у Зеве зажигают фонарь.' },
      { when: alone48, text: 'Ты стоишь у калитки и смотришь на север. Гамбург где-то там, за лесом, за Эльбой. Отсюда его не видно. Колонна, если всё хорошо, давно там.' },
      { when: normal48, text: 'Вы стоите у калитки вдвоём. Колонна ушла без вас. Наверное, уже там. Наверное.' },
    ],
    actions: [
      { id: 'c48_nd_post', label: 'Сходить на пост у Зеве до темноты', minutes: 60, terminal: true, goto: 'c48_n_supper', ambientDuring: day48,
        text: 'На посту тихо. Колокол в инее, верёвка натянута или нет — как решили. Ты стоишь рядом со сменой и смотришь на тот берег. Ничего. Только ветер шевелит камыш.', effects: [set48('nd', 'post'), until48(17, 30)] },
      { id: 'c48_nd_walk', label: 'Пройтись вдоль поля, пока видно', when: normal48, minutes: 60, terminal: true, goto: 'c48_n_supper', ambientDuring: day48,
        text: 'Вы идёте по насту вдоль поля, след в след. {partner} говорит про Бьёрна, ты — про посты. Потом оба замолкаете, и это тоже разговор.', effects: [set48('nd', 'walk'), { body: 'stress', delta: -4 }, until48(17, 30)] },
      { id: 'c48_nd_wood', label: 'Наносить дров на ночь', minutes: 45, terminal: true, goto: 'c48_n_supper', ambientDuring: day48, activity: 'heavy',
        text: 'Четыре охапки к печке, две к плите. Мороз крепчает, поленья звенят, как стекло.', effects: [set48('nd', 'wood'), { body: 'fatigue', delta: 4 }, until48(17, 30)] },
      { id: 'c48_nd_north', label: 'Постоять у калитки и смотреть на север', when: alone48, minutes: 45, terminal: true, goto: 'c48_n_supper', ambientDuring: day48,
        text: 'Ты стоишь, пока небо не становится чёрным. На севере, над лесом, едва заметное зарево: Гамбург, где-то горит или где-то светится. Ты не знаешь, что из двух. Хочешь думать, что светится.', effects: [set48('nd', 'north'), until48(17, 15)] },
    ] }),

  S48({ id: 'c48_n_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин. Лампа, суп, хлеб. За окном мороз под минус десять.' },
      { when: all(henrike48, flag('w.c41_radio')), text: 'В восемь, после ужина, Хенрике включит рацию из ящика связиста: Красный Крест Винзена читает новости.' },
    ],
    actions: [
      { id: 'c48_ns_eat', label: 'Ужинать со всеми', minutes: 50, terminal: true, goto: 'c48_n_night', ...tableOnly,
        text: 'Суп, хлеб, чай. Разговор вялый, усталый. Кто-то засыпает за столом.', effects: [set48('ns', 'eat'), meal('eat'), until48(18, 45)] },
      { id: 'c48_ns_kids', label: 'Уложить детей и посидеть с ними', minutes: 50, terminal: true, goto: 'c48_n_night',
        text: 'Ты сидишь на краю матраса, пока дети не засыпают. Младший спрашивает, правда ли в Гамбурге есть электричество. Ты говоришь, что правда. Он засыпает довольный.', effects: [set48('ns', 'kids'), { body: 'hunger', delta: -20 }, until48(18, 45)] },
      { id: 'c48_ns_bread', label: 'Поесть у печки хлеба с салом, без разговоров', minutes: 50, terminal: true, goto: 'c48_n_night',
        text: 'Хлеб, сало, луковица, кружка чая. Ты ешь у печки, глядя в огонь. Тепло доходит до пальцев только к концу.', effects: [set48('ns', 'bread'), until48(18, 45)] },
      { id: 'c48_ns_felix', label: 'Сесть к Феликсу: он сегодня совсем молчит', when: felix48, minutes: 50, terminal: true, goto: 'c48_n_night', ...tableOnly,
        text: 'Феликс говорит наконец: если мост в Харбурге открыт для колонны, значит, армия где-то рядом. Его часть. Его, наверное, ищут. Или нет. «Ich weiß nicht, was schlimmer ist». Не знаю, что хуже.', effects: [set48('ns', 'felix'), meal('eat'), until48(18, 45)] },
    ] }),

  S48({ id: 'c48_n_night', for: 'any', chapter: 'ch3', title: 'Вечер', camp: house14,
    text: [
      { text: 'Дом затихает. Лампа на столе. До Сильвестра три дня.' },
      { when: all(flag('w.c41_radio'), alone48), text: 'В восемь рация хрипит, потом голос Вибке, усталый и ровный: «Die Kolonne ist in Eppendorf angekommen. Alle. Ich wiederhole: alle». Колонна прибыла в Эппендорф. Все. Повторяю: все.' },
      { when: all(not(flag('w.c41_radio')), alone48), text: 'Рации нет. Ты не знаешь, доехала ли колонна. Узнаешь, когда узнаешь.' },
    ],
    actions: [
      { id: 'c48_nn_talk', label: 'Поговорить с {partner.ins} о том, что дальше', when: normal48, minutes: 60, terminal: true, goto: 'c48_t_dawn',
        text: 'Про Бьёрна, про Сильвестр, про посты, про январь. Шёпотом, лицом к лицу. Кое-что решаете сразу, кое-что — нет.', effects: [set48('nn', 'talk'), tue48(7, 0, true)] },
      { id: 'c48_nn_write', label: 'Написать {partner.dat} письмо, которое отдашь через неделю', when: alone48, minutes: 60, terminal: true, goto: 'c48_t_dawn',
        text: 'Ты пишешь при лампе про день: Бьёрн, верёвка, фонари, пустая тарелка за столом. Не пишешь, что страшно. Складываешь и кладёшь под подушку {partner.gen}.', effects: [set48('nn', 'write'), w48('a_letter', true), tue48(7, 0, true)] },
      { id: 'c48_nn_sleep', label: 'Лечь пораньше', minutes: 60, terminal: true, goto: 'c48_t_dawn',
        text: 'Ты засыпаешь сразу. Снится мост, длинный, без конца, и по нему кто-то идёт тебе навстречу.', effects: [set48('nn', 'sleep'), { body: 'fatigue', delta: -6 }, tue48(7, 0, true)] },
      { id: 'c48_nn_window', label: 'Постоять у окна', minutes: 60, terminal: true, goto: 'c48_t_dawn',
        text: 'Снег, звёзды, фонарь на посту у Зеве. Где-то за всем этим — город. Ты стоишь, пока лампа за спиной не начинает чадить.', effects: [set48('nn', 'window'), tue48(7, 0, true)] },
    ] }),

  // ═════════════ Вторник, 29.12 — хутор (и спасение после ночи) ═════════════
  S48({ id: 'c48_t_dawn', for: 'any', chapter: 'ch3', title: 'Вторник', camp: kitchen14,
    text: [
      { text: 'Вторник, двадцать девятое. Ночью был сильный мороз: на стёклах изнутри папоротники инея. До Сильвестра два дня.' },
      { when: alone48, text: 'Вторая ночь без {B.gen}. Кровать кажется шире, чем она есть.' },
      { when: partnerWasDown48, text: '{partner} проспал{pm:|а} ночь спокойно. Утром попросил{pm:|а} воды и съел{pm:|а} две ложки каши. Голова в бинтах, взгляд мутный, но твой.' },
      { when: normal48, text: 'Утро как утро: печь, вода, куры. И Сильвестр, который приближается, как погода.' },
    ],
    actions: [
      { id: 'c48_td_eat', label: 'Позавтракать со всеми', minutes: 40, terminal: true, outcomes: [{ id: 'r', when: rescuer48, goto: 'c48_rt_bed' }, { id: 'n', goto: 'c48_t_square' }], ...tableOnly,
        text: 'Каша, хлеб, чай. За столом Хенрике раздаёт дела на день, загибая пальцы. Сильвестр стоит в каждом её слове.', effects: [set48('td', 'eat'), meal('eat'), tue48(8, 30)] },
      { id: 'c48_td_chores', label: 'Сначала двор: вода, куры, дрова', minutes: 45, terminal: true, outcomes: [{ id: 'r', when: rescuer48, goto: 'c48_rt_bed' }, { id: 'n', goto: 'c48_t_square' }], ambientDuring: day48, activity: 'moderate',
        text: 'Ворот колодца примёрз, ты отбиваешь лёд топором. Куры сидят нахохлившись. Дрова звенят. Завтрак тебе оставили на краю плиты.', effects: [set48('td', 'chores'), { body: 'hunger', delta: -20 }, tue48(8, 30)] },
      { id: 'c48_td_window', label: 'Выпить чаю у окна и посмотреть, какая погода к Сильвестру', minutes: 30, terminal: true, outcomes: [{ id: 'r', when: rescuer48, goto: 'c48_rt_bed' }, { id: 'n', goto: 'c48_t_square' }],
        text: 'Небо чистое, мороз, ни облачка. Хенрике говорит: «Klares Wetter zu Silvester. Gut fürs Feuer, schlecht für die Füße». Ясно к Сильвестру. Хорошо для огня, плохо для ног.', effects: [set48('td', 'window'), { body: 'hunger', delta: -10 }, tue48(8, 30)] },
      { id: 'c48_td_radio', label: 'Послушать утренние новости по рации', when: flag('w.c41_radio'), minutes: 40, terminal: true, outcomes: [{ id: 'r', when: rescuer48, goto: 'c48_rt_bed' }, { id: 'n', goto: 'c48_t_square' }],
        text: 'Вибке читает: мост в Харбурге работает до Нового года, после — «nur Kolonnen mit Papieren». Только колонны с бумагами. В Винзене кончился парацетамол. В Ханштедте родилась девочка. Хенрике повторяет за ней «девочка» и улыбается в кружку.', effects: [set48('td', 'radio'), w48('heard_bridge_close', true), { body: 'hunger', delta: -15 }, tue48(8, 30)] },
    ] }),

  S48({ id: 'c48_t_square', for: 'any', chapter: 'ch3', title: 'Площадь', location: jest48, camp: trip48(jest48), ambient: day48,
    text: [
      { text: 'В Йестебурге на площади у пожарной части всё готово к Сильвестру, кроме самого Сильвестра. Куча дров выше гаража, котёл для супа на треноге, лавки из школы. Брандт ходит с блокнотом и кричит на всех одинаково.' },
      { when: any(silvester48('go'), flag('w.c47_owe_brandt')), text: 'Брандт показывает вам ваши места на карте: два поста на углах площади, один — у выхода к лесополосе. «Ab acht. Bis eins». С восьми. До часу.' },
      { when: silvester48('quiet'), text: 'Три поста со стороны леса уже размечены: колья с тряпками. Один — ваш.' },
      { when: silvester48('stay'), text: 'Брандт видит тебя и отворачивается к котлу. Ваш двор в Сильвестр дома. Но дрова на площадь приносят все.' },
    ],
    actions: [
      { id: 'c48_tq_posts', label: 'Обойти с Брандтом посты и посмотреть, откуда видно лесополосу', minutes: 90, terminal: true, goto: 'c48_t_stranger', ambientDuring: day48,
        text: 'С угла у аптеки лесополоса видна целиком, с угла у школы — нет. Ты говоришь это Брандту. Он смотрит, хмыкает и переставляет кол на десять шагов. «Gut gesehen». Хорошо замечено.', effects: [set48('tq', 'posts'), w48('post_moved', true), { move: 'hof_luedemann' }, tue48(10, 45)] },
      { id: 'c48_tq_wood', label: 'Таскать дрова к куче с дружинниками', minutes: 90, terminal: true, goto: 'c48_t_stranger', ambientDuring: day48, activity: 'heavy',
        text: 'Охапка за охапкой. Дружинники шутят, что такую кучу видно будет из Гамбурга. Кто-то отвечает: «Hoffentlich nicht nur aus Hamburg». Надеюсь, не только из Гамбурга. Все замолкают.', effects: [set48('tq', 'wood'), { body: 'fatigue', delta: 6 }, { move: 'hof_luedemann' }, tue48(10, 45)] },
      { id: 'c48_tq_soup', label: 'Помочь жене Брандта с котлом и списком продуктов', minutes: 90, terminal: true, goto: 'c48_t_stranger', ambientDuring: day48,
        text: 'Горох, сало, картошка — от каждого двора по списку. Жена Брандта считает быстро и не смотрит в бумагу. «Zweihundert Teller. Wenn alle kommen». Двести тарелок. Если все придут. Потом добавляет тише: «Und wenn keiner kommt, ist es auch gut». А если никто не придёт — тоже хорошо.', effects: [set48('tq', 'soup'), { move: 'hof_luedemann' }, tue48(10, 45)] },
      { id: 'c48_tq_lukas', label: 'Найти Лукаса: где у него на самом деле ракеты', minutes: 90, terminal: true, goto: 'c48_t_stranger', ambientDuring: day48,
        text: 'Лукас ведёт тебя за гараж и, оглядываясь, показывает: ракеты под брезентом, в бочке. Три штуки. Он смотрит на тебя: скажешь? Ты молчишь. Решать это — не сейчас. Но ты знаешь, где они.', effects: [set48('tq', 'lukas'), w48('know_rockets', true), { move: 'hof_luedemann' }, tue48(10, 45)] },
    ] }),

  S48({ id: 'c48_t_stranger', for: 'any', chapter: 'ch3', title: 'У калитки', camp: yard14, ambient: day48,
    text: [
      { text: 'В одиннадцать у калитки стоят трое: мужчина, женщина и девочка лет десяти, с санками, на санках узел и чемодан. Лица обветренные. Пришли пешком из Гамбурга, по мосту в Харбурге, вчера утром, пока пускают.' },
      { text: '— Nach Lüneburg. Zu meiner Schwester. Wir brauchen nur Wasser. Und vielleicht… eine Nacht.\n\nВ Люнебург. К моей сестре. Нам нужна только вода. И, может быть… одна ночь.' },
      { when: alone48, text: 'Ты спрашиваешь про колонну. Женщина кивает: да, видели. Автобус с крестом прошёл мост утром, перед ними. Всех пропустили. Ты не знаешь, почему от этих слов так отпускает в груди.' },
    ],
    actions: [
      { id: 'c48_ts_night', label: 'Пустить на ночь в сарай, дать поесть', minutes: 60, terminal: true, goto: 'c48_t_noon', ambientDuring: day48,
        text: 'Сено в сарае, одеяла, миска супа на троих. Хенрике ворчит, что еды и так мало, и сама приносит девочке хлеб с вареньем. Мужчина благодарит так, что становится неловко. Ночью они уйдут дальше на юг.', effects: [set48('ts', 'night'), w48('strangers', 'night'), { body: 'hunger', delta: 5 }, tue48(12, 0)] },
      { id: 'c48_ts_food', label: 'Дать воды и хлеба в дорогу, но не оставлять', minutes: 45, terminal: true, goto: 'c48_t_noon', ambientDuring: day48,
        text: 'Фляга воды, полбуханки, кусок сала. Мужчина прячет всё в узел. Девочка смотрит на окна дома, где тепло, и ничего не говорит. Они уходят к дороге на Люнебург.', effects: [set48('ts', 'food'), w48('strangers', 'food'), tue48(11, 45)] },
      { id: 'c48_ts_news', label: 'Расспросить, как сейчас в Гамбурге', minutes: 60, terminal: true, goto: 'c48_t_noon', ambientDuring: day48,
        text: 'Острова, говорит мужчина. В Эппендорфе свет, в порту — свет, в Барбеке, Бармбеке, Винтерхуде — нет. Сенат закроет мост после Нового года, все об этом знают, поэтому и бегут. «Wer drüben ist, bleibt drüben. Bis Ostern». Кто там — тот там. До Пасхи.', effects: [set48('ts', 'news'), w48('heard_bridge_close', true), w48('strangers', 'food'), tue48(12, 0)] },
      { id: 'c48_ts_brandt', label: 'Отправить к Брандту в Йестебург: у него списки', minutes: 30, terminal: true, goto: 'c48_t_noon', ambientDuring: day48,
        text: 'Ты объясняешь дорогу к пожарной части. Мужчина кивает. Женщина смотрит на тебя так, что ты потом весь день вспоминаешь этот взгляд. Они уходят.', effects: [set48('ts', 'brandt'), w48('strangers', 'brandt'), tue48(11, 30)] },
    ] }),

  S48({ id: 'c48_t_noon', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед. Хенрике пересчитывает едоков, как каждый день. Число меняется: кто ушёл, кто пришёл, кто уехал.' },
      { when: partnerWasDown48, text: '{partner} сидит на кухне, закутанн{pm:ый|ая} в одеяло, первый раз со вчера. Ложку держит сам{pm:|а}. Медленно.' },
    ],
    actions: [
      { id: 'c48_tn_eat', label: 'Обедать со всеми', minutes: 45, terminal: true, goto: 'c48_t_bjorn', ...tableOnly,
        text: 'Суп с картошкой и салом. Хлеб. За столом обсуждают беженцев из Гамбурга, мост, Сильвестр. Кто-то говорит, что после Нового года будет легче. Никто не верит, но все кивают.', effects: [set48('tn', 'eat'), meal('eat'), tue48(13, 15)] },
      { id: 'c48_tn_feed', label: 'Покормить {partner.acc} с ложки, если надо', when: partnerWasDown48, minutes: 45, terminal: true, goto: 'c48_t_bjorn', ...tableOnly,
        text: 'Не надо. {partner} отбирает у тебя ложку и ест сам{pm:|а}, хмуро и упрямо. Ты смеёшься. Первый раз за три дня.', effects: [set48('tn', 'feed'), meal('eat'), { body: 'stress', delta: -6 }, tue48(13, 15)] },
      { id: 'c48_tn_quick', label: 'Поесть быстро и снова к делам', minutes: 30, terminal: true, goto: 'c48_t_bjorn',
        text: 'Хлеб с салом, кружка чая, стоя. Дела не ждут: Сильвестр ближе с каждым часом.', effects: [set48('tn', 'quick'), { body: 'hunger', delta: -20 }, tue48(13, 0)] },
      { id: 'c48_tn_stove', label: 'Поесть у печки остатков от вчерашнего', minutes: 30, terminal: true, goto: 'c48_t_bjorn',
        text: 'Холодная картошка, обжаренная на сале, кусок хлеба. У печки тепло и тихо, разговоры за столом долетают обрывками.', effects: [set48('tn', 'stove'), tue48(13, 0)] },
      { id: 'c48_tn_window', label: 'Поесть у окна, глядя на дорогу', minutes: 30, terminal: true, goto: 'c48_t_bjorn',
        text: 'Миска на подоконнике, дорога за стеклом белая и пустая. Ты ешь медленно. По дороге никто не идёт, и это хорошо.', effects: [set48('tn', 'window'), tue48(13, 0)] },
    ] }),

  S48({ id: 'c48_t_bjorn', for: 'any', chapter: 'ch3', title: 'Гость', camp: yard14, ambient: day48,
    text: [
      { when: bjornAlive48, text: 'После обеда у калитки — Бьёрн Тиде, в отцовской куртке, с пилой в руке. «Brandt sagt, ihr habt eine Zweimannsäge. Meine ist kaputt». Брандт говорит, у вас есть двуручная пила. Моя сломалась. Он смотрит мимо тебя, на дом, где дым из трубы.' },
      { when: not(bjornAlive48), text: 'После обеда у калитки — Лукас с листком: Брандт переписывает, кто в Сильвестр где стоит. Ваш двор в листке есть. Лукас ждёт, пока ты прочитаешь, и переминается.' },
    ],
    actions: [
      { id: 'c48_tb_saw', label: 'Отдать пилу и предложить помочь распилить', when: bjornAlive48, minutes: 75, terminal: true, goto: 'c48_t_ice', ambientDuring: day48, activity: 'heavy',
        text: 'Вы идёте к Тиде вдвоём и пилите час, молча, в такт. Пила поёт. Потом Бьёрн говорит: «Papa hat immer zu schnell gezogen. Du auch». Папа всегда тянул слишком быстро. Ты тоже. Ты замедляешься. Он кивает.', effects: [set48('tb', 'saw'), w48('bjorn_helped', true), { body: 'fatigue', delta: 6 }, tue48(14, 45)] },
      { id: 'c48_tb_in', label: 'Позвать его в дом погреться и поесть', when: bjornAlive48, minutes: 60, terminal: true, goto: 'c48_t_ice',
        text: 'Бьёрн долго топчется у порога, потом входит. Хенрике ставит перед ним тарелку, не спрашивая. Он ест, не поднимая головы. Дети смотрят на него, как на взрослого. Уходя, он говорит «danke» в пол.', effects: [set48('tb', 'in'), w48('bjorn_fed', true), tue48(14, 30)] },
      { id: 'c48_tb_give', label: 'Отдать пилу и сказать: приходи, если что', when: bjornAlive48, minutes: 30, terminal: true, goto: 'c48_t_ice', ambientDuring: day48,
        text: 'Бьёрн берёт пилу, кивает и уходит. На полпути оборачивается, как будто хочет что-то сказать. Не говорит. Идёт дальше.', effects: [set48('tb', 'give'), tue48(14, 0)] },
      { id: 'c48_tb_list', label: 'Прочитать список и вписать своё имя, где не хватает', when: not(bjornAlive48), minutes: 45, terminal: true, goto: 'c48_t_ice', ambientDuring: day48,
        text: 'В списке дыра у выхода к лесополосе, с одиннадцати до часу. Ты вписываешь себя. Лукас смотрит на это и уважительно присвистывает.', effects: [set48('tb', 'list'), w48('signed_post', true), tue48(14, 15)] },
      { id: 'c48_tb_lukas', label: 'Позвать Лукаса на чай', when: not(bjornAlive48), minutes: 45, terminal: true, goto: 'c48_t_ice',
        text: 'Лукас пьёт чай с сахаром и рассказывает, что видел вчера беженцев из Гамбурга, «целую семью, с санками». Что Брандт пустил их в пожарную часть. Что все бегут на юг, а колонна ездит на север. «Verkehrte Welt». Мир вверх ногами.', effects: [set48('tb', 'lukas'), tue48(14, 15)] },
      { id: 'c48_tb_send', label: 'Отправить Лукаса обратно с ответом для Брандта', when: not(bjornAlive48), minutes: 45, terminal: true, goto: 'c48_t_ice',
        text: 'Ты пишешь на обороте листка: кто и где будет в Сильвестр, честно. Лукас прячет листок в рукавицу и убегает. Брандт прочтёт и, может быть, кивнёт.', effects: [set48('tb', 'send'), tue48(14, 15)] },
    ] }),

  S48({ id: 'c48_t_ice', for: 'any', chapter: 'ch3', title: 'Прорубь', camp: yard14, ambient: day48,
    text: [
      { text: 'Колодец после оттепели мутный, вода только для кипячения, а на стирку и баню к Сильвестру нужно много. Хенрике хочет прорубь на Зеве, у мостков, как в старые годы.' },
      { when: partnerWasDown48, text: '{partner} смотрит в окно, как вы собираетесь, и злится, что не может с вами.' },
    ],
    actions: [
      { id: 'c48_ti_cut', label: 'Рубить прорубь у мостков, где лёд толстый', minutes: 75, terminal: true, goto: 'c48_t_dusk', ambientDuring: day48, activity: 'heavy',
        text: 'Пешня, топор, лопата. Лёд толщиной в ладонь, чистый, с пузырьками. Через час прорубь готова, вода чёрная и тихая. Ты ставишь рядом кол с красной тряпкой: чтобы ночью никто не шагнул.', effects: [set48('ti', 'cut'), w48('ice_hole', true), { body: 'fatigue', delta: 6 }, tue48(15, 45)] },
      { id: 'c48_ti_snow', label: 'Предложить топить снег в котле: проще и безопаснее', minutes: 75, terminal: true, goto: 'c48_t_dusk',
        text: 'Хенрике фыркает, но соглашается. Котёл на плите, снег вёдрами, вода получается мягкая, серая, с хвоинками. На баню хватит. На стирку — если не жадничать.', effects: [set48('ti', 'snow'), tue48(15, 45)] },
      { id: 'c48_ti_kids', label: 'Увести детей кататься с горки, пока взрослые заняты', minutes: 75, terminal: true, goto: 'c48_t_dusk',
        text: 'Горка за сараем, санки, крышка от бочки. Дети визжат, ты съезжаешь с ними дважды и возвращаешься с мокрой спиной и пустой головой.', effects: [set48('ti', 'kids'), tue48(15, 45)] },
      { id: 'c48_ti_watch', label: 'Пойти с Феликсом: он рубит, ты смотришь на тот берег', when: felix48, minutes: 75, terminal: true, goto: 'c48_t_dusk', ambientDuring: day48,
        text: 'Феликс рубит, ты стоишь с топором и смотришь на камыши на том берегу. Тихо. Один раз шевелится — ворона. Феликс говорит, не оборачиваясь: «Danke fürs Aufpassen». Спасибо, что смотришь.', effects: [set48('ti', 'watch'), w48('ice_hole', true), tue48(15, 45)] },
    ] }),

  S48({ id: 'c48_t_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: day48,
    text: [
      { text: 'Сумерки. В колонии зажигают свечи на окнах, по одной, по две. На посту у Зеве — фонарь. До Сильвестра — сутки и ещё одни.' },
      { when: alone48, text: 'Ты ловишь себя на том, что второй день разговариваешь с {B.ins} в голове. Отвечает. Всегда то, что ты хочешь услышать.' },
      { when: partnerWasDown48, text: '{partner} первый раз выходит на крыльцо, держась за косяк. Стоит минуту, смотрит на снег, на тебя. Потом обратно в тепло.' },
    ],
    actions: [
      { id: 'c48_tk_lanterns', label: 'Развесить бумажные фонарики на окна', minutes: 60, terminal: true, goto: 'c48_t_eve',
        text: 'Фонарики из тетрадной бумаги, огарки внутри. Ты вешаешь их на гвоздики над окнами. В сумерках дом становится похож на открытку, мятую и счастливую.', effects: [set48('tk', 'lanterns'), tue48(17, 15)] },
      { id: 'c48_tk_porch', label: 'Постоять на крыльце рядом с {partner.ins}', when: partnerWasDown48, minutes: 45, terminal: true, goto: 'c48_t_eve', ambientDuring: day48,
        text: 'Вы стоите на крыльце, ты держишь {partner.acc} под локоть. Минуту. Две. {partner} говорит: «Сильвестр без меня». Ты говоришь: «Сильвестр с тобой. Дома». Вы возвращаетесь в тепло.', effects: [set48('tk', 'porch'), { body: 'stress', delta: -6 }, tue48(17, 0)] },
      { id: 'c48_tk_walk', label: 'Пройтись с {partner.ins} до поста и обратно', when: normal48, minutes: 60, terminal: true, goto: 'c48_t_eve', ambientDuring: day48,
        text: 'До поста и обратно, по тропе. Вы говорите про Бьёрна, про беженцев, про мост. Потом молчите. Звёзды выходят по одной, как свечи в колонии.', effects: [set48('tk', 'walk'), { body: 'stress', delta: -4 }, tue48(17, 15)] },
      { id: 'c48_tk_north', label: 'Выйти к калитке и смотреть на север', when: alone48, minutes: 45, terminal: true, goto: 'c48_t_eve', ambientDuring: day48,
        text: 'Север тёмный. Над лесом, где Гамбург, едва заметно светлее. Ты стоишь, пока не начинают мёрзнуть руки, и говоришь вслух: «Ещё шесть дней». Ворона на столбе смотрит на тебя, как на дурака.', effects: [set48('tk', 'north'), tue48(17, 0)] },
      { id: 'c48_tk_wood', label: 'Сложить у крыльца дрова на два дня вперёд', minutes: 60, terminal: true, goto: 'c48_t_eve', ambientDuring: day48, activity: 'heavy',
        text: 'Две поленницы у крыльца, под навес. В Сильвестр никому не придётся бегать к сараю в темноте.', effects: [set48('tk', 'wood'), w48('wood_ready', true), { body: 'fatigue', delta: 4 }, tue48(17, 15)] },
    ] }),

  S48({ id: 'c48_t_eve', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин. За окном мороз под минус двенадцать. Хенрике пробует тесто для берлинеров на завтра: без масла, без начинки, зато пятьдесят штук.' },
      { when: v('w.c48_strangers', 'night'), text: 'Девочка из Гамбурга сидит с детьми на полу у печки и учит их считалке на гамбургском. Дети путаются и хохочут.' },
    ],
    actions: [
      { id: 'c48_te_eat', label: 'Ужинать со всеми', minutes: 50, terminal: true, goto: 'c48_t_night', ...tableOnly,
        text: 'Суп, хлеб, по ложке капусты. Разговор про завтрашние берлинеры, про то, кому достанется с горчицей. Хенрике обещает одну такую. Кому — секрет.', effects: [set48('te', 'eat'), meal('eat'), tue48(18, 45)] },
      { id: 'c48_te_dough', label: 'Помочь Хенрике с тестом', when: henrike48, minutes: 50, terminal: true, goto: 'c48_t_night', ...tableOnly,
        text: 'Тесто тёплое, живое, дышит под полотенцем. Хенрике показывает, как защипывать края. У тебя выходит криво. «Die Krummen schmecken besser». Кривые вкуснее. Она защипывает свои ровно.', effects: [set48('te', 'dough'), meal('eat'), npc('henrike', 1), tue48(18, 45)] },
      { id: 'c48_te_kids', label: 'Посидеть с детьми у печки', minutes: 50, terminal: true, goto: 'c48_t_night',
        text: 'Дети спрашивают, что такое Сильвестр, если нет фейерверка. Ты говоришь: это когда все вместе ждут полуночи и не спят. Младший решает, что не уснёт. Засыпает через десять минут, у тебя на коленях.', effects: [set48('te', 'kids'), { body: 'hunger', delta: -20 }, tue48(18, 45)] },
      { id: 'c48_te_bread', label: 'Поесть хлеба с чаем у печки и слушать, как спорят про берлинеры', minutes: 50, terminal: true, goto: 'c48_t_night',
        text: 'Хлеб, чай, кусок сала. За спиной спорят, кому достанется берлинер с горчицей. Ты не участвуешь. Тебе и так хорошо.', effects: [set48('te', 'bread'), tue48(18, 45)] },
    ] }),

  S48({ id: 'c48_t_night', for: 'any', chapter: 'ch3', title: 'Вечер вторника', camp: house14,
    text: [
      { text: 'Дом затихает. Лампа, печь, мороз за окном. Завтра — последний день года.' },
      { when: all(alone48, flag('w.c41_radio')), text: 'По рации вечером — ничего про Эппендорф. Значит, всё как было. Ты так решаешь.' },
    ],
    actions: [
      { id: 'c48_tt_talk', label: 'Поговорить с {partner.ins} о Сильвестре и о январе', when: any(normal48, partnerWasDown48), minutes: 60, terminal: true, goto: 'c48_checkpoint',
        text: 'Про Бьёрна, про посты, про беженцев, про мост, который закроют. Шёпотом. Многое придётся решать вместе. Прямо сейчас.', effects: [set48('tt', 'talk'), finish, tue48(20, 0)] },
      { id: 'c48_tt_letter', label: 'Дописать письмо {partner.dat}, начатое вчера', when: alone48, minutes: 60, terminal: true, goto: 'c48_checkpoint',
        text: 'Ещё страница: беженцы у калитки, прорубь, тесто Хенрике. Ты пишешь мелко, чтобы влезло. Пишешь «скоро» и зачёркиваешь. Пишешь «четвёртого».', effects: [set48('tt', 'letter'), w48('a_letter', true), finish, tue48(20, 0)] },
      { id: 'c48_tt_sleep', label: 'Лечь пораньше', minutes: 60, terminal: true, goto: 'c48_checkpoint',
        text: 'Ты засыпаешь сразу. Ночью снится мост и чей-то голос по рации, который называет твоё имя.', effects: [set48('tt', 'sleep'), { body: 'fatigue', delta: -6 }, finish, tue48(20, 0)] },
      { id: 'c48_tt_post', label: 'Отнести на пост горячего и постоять со сменой', minutes: 60, terminal: true, goto: 'c48_checkpoint', ambientDuring: day48,
        text: 'Термос, хлеб. Смена у Зеве — Яннес или сосед. Вы стоите рядом, пьёте по очереди из одной крышки и молчите. На том берегу ничего. Так и должно быть.', effects: [set48('tt', 'post'), finish, tue48(20, 0)] },
    ] }),

  S48({ id: 'c48_checkpoint', for: 'any', chapter: 'ch3', title: 'Понедельник, вечер', checkpoint: 48, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Двадцать девятое декабря. До Сильвестра два дня.' }], actions: [] }),
];
