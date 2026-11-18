import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { brothersCome, oleHome33 } from './point33';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v, ninaFarm } from './point18';
import { npc, tableOnly } from './point19';
import { felix47, henrike47, merle47 } from './point47';
import { julian45 } from './point45';

// Участок 49 «Тридцатое»: ср 30.12, 06:00 → КТ49 чт 31.12, 13:00. Последний будний день года и утро Сильвестра.
// Расклады после КТ48:
//   оба дома (в том числе после ранения в 47-й: раненый — `hurt49`, швы, без тяжёлого и холода): утро порознь — A в Йестебурге
//   (`day49a.ts`: Брандт, ракеты Лукаса, южная дорога), B в колонии (`day49b.ts`: Бьёрн по `w.c48_bjorn`, фрау Ханзен), раненый
//   дома (доктор Зандер, кухня); после обеда вместе — следы у Тиде, карьер, баня, вечер, ночь; 31-го — берлинеры, обход, совет
//   у Брандта, полдень;
//   порознь (`w.c48_hamburg`): A — то же утро и карьер, потом в Винзен к рации (две минуты в восемь), ночь в спортзале, утром
//   назад к совету; B — Эппендорф (`day49b.ts`, `c49_hb_*`): палата, Мерле, бумаги в Красном Кресте у Мессе, город, рация.
// Голоса по рации каждый слышит обрывками: настоящие слова друг друга — в сводке КТ49.
// КТ49: следы и карьер (`c3_new_tracks49`, кто на хуторе); полночь (`c3_new_midnight49`, оба дома) или Мерле (`c3_new_merle49`).
export const P49: Cond = all({ cp: 48 }, not({ cp: 49 }));
export const A49: Cond = { me: 'A' };
export const farm49 = 'hof_luedemann';
export const jest49 = 'c16_jesteburg';
export const winsen49 = 'c15_winsen';
export const uke49 = 'c48_uke';
export const wood49 = 'c47_wood';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played48: Cond = any(flag('A.c48_finished'), flag('B.c48_finished'));
export const split49: Cond = flag('w.c48_hamburg');
const home49: Cond = all(not(split49), { at: farm49 }, { partnerAt: farm49 });
const apart49: Cond = all(split49, any(all(A49, { at: farm49 }, { partnerAt: uke49 }), all(not(A49), { at: uke49 }, { partnerAt: farm49 })));
export const point49Available: Cond = all(P49, played48, up, { partner: 'active' }, any(home49, apart49));

export const henrike49 = henrike47;
export const felix49 = felix47;
export const julian49 = julian45;
/** Мерле на хуторе: в Гамбург не ездила. */
export const merleHome49: Cond = all(merle47, not(flag('w.c44_hamburg_trip')));
export const parents49: Cond = all(merle47, flag('w.c38_parents'));
/** {A} на хуторе, {B} в Эппендорфе. */
export const alone49: Cond = all(A49, split49);
/** Я выбыл(а) в 47-й: швы на голове. */
export const hurt49: Cond = any(all(A49, flag('A.c47_down')), all(not(A49), flag('B.c47_down')));
export const partnerHurt49: Cond = any(all(A49, flag('B.c47_down')), all(not(A49), flag('A.c47_down')));
export const plain49: Cond = all(not(split49), not(flag('A.c47_down')), not(flag('B.c47_down')));
export const bjornAlive49: Cond = all(flag('w.c47_karsten'), not(v('w.c47_karsten', 'hidden')));
export const bjorn49 = (x: string): Cond => all(bjornAlive49, v('w.c48_bjorn', x));
export const silvester49 = (x: string): Cond => v('w.c46_silvester', x);
export const posts49 = (x: string): Cond => v('w.c47_posts', x);
export const uke49is = (x: string): Cond => v('w.c48_uke', x);
export const own49 = (key: string, value: string): Cond => v(`$.c49_${key}`, value);
export const brandtKnows49: Cond = flag('w.c49_brandt_knows');

export const frost49 = { tempC: -10, outdoor: true, wet: false };
export const day49 = { tempC: -6, outdoor: true, wet: false };
export const mild49 = { tempC: -3, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm49, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S49 = wrap(P49);
export const set49 = (key: string, value: string | boolean): Effect => ({ set: `$.c49_${key}`, value });
export const w49 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c49_${key}`, value });
/** Среда, 30.12. */
export const until49 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(60, h, m), ...(sleeping ? { sleeping: true } : {}) });
/** Четверг, 31.12. */
export const d31 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(61, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare49: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed49 = (n = 30): Effect[] => [{ body: 'hunger', delta: -n }, { body: 'thirst', delta: -25 }];
export const trip49 = (where: string, rest: false | 'sleep' = false) => ({ at: where, stock: 'c3_farm_stock', rest });
const finish: Effect = { set: '$.c49_finished', value: true };
const toFarm: Effect = { move: farm49 };
const toWood: Effect = { move: wood49 };
const fromDawn = [
  { id: 'r', when: hurt49, goto: 'c49_r_home' },
  { id: 'a', when: A49, goto: 'c49_na_jest' },
  { id: 'b', goto: 'c49_nb_colony' },
];
const fromPit = [{ id: 'w', when: alone49, goto: 'c49_aw_ride' }, { id: 'n', goto: 'c49_n_bath' }];
const afterPit = 'c49_n_return';
const fromTracks = (rest: Partial<{ id: string }> = {}) => [{ id: 'h', when: hurt49, goto: 'c49_r_window' }, { id: 'n', goto: 'c49_n_pit', ...rest }];
const heavy: Cond = not(hurt49);

export const shared49: Scene[] = [
  S49({ id: 'c49_dawn', for: 'any', chapter: 'ch3', title: 'Тридцатое', camp: kitchen14,
    text: [
      { text: 'Шесть утра, тридцатое декабря. За ночь мороз дошёл до минус десяти: дверь на крыльцо приходится толкать плечом. Хенрике уже у плиты, в двух кофтах.' },
      { when: hurt49, text: 'Голова под повязкой гудит, как улей. Швы тянут, когда хмуришься. Вставать можно, только медленно.' },
      { when: partnerHurt49, text: '{partner} сидит на кровати и {pm:сам|сама} натягивает носки. Медленно, но {pm:сам|сама}. Вчера так не получалось.' },
      { when: alone49, text: 'Третье утро без {B.gen}. Рука уже не тянется на её сторону кровати. Почти.' },
      { when: plain49, text: 'Последний будний день года. Завтра Сильвестр, и дел у всех на хуторе на два дня.' },
      { when: merleHome49, text: 'Мерле у окна меряет сахар ветеринарным глюкометром и записывает цифру в тетрадь. Цифра ей не нравится. Тетрадь она закрывает ладонью.' },
    ],
    actions: [
      { id: 'c49_dw_eat', label: 'Позавтракать со всеми, пока каша горячая', minutes: 30, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша на воде, чай, хлеб. За столом тесно и сонно. Кто-то из детей засыпает над миской, и его никто не будит.', effects: [set49('dw', 'eat'), meal('eat'), until49(6, 30)] },
      { id: 'c49_dw_chores', label: 'Сначала двор: куры, вода, дрова', when: heavy, minutes: 30, terminal: true, outcomes: fromDawn, ambientDuring: frost49, activity: 'moderate',
        text: 'Куры сидят нахохлившись и не хотят слезать с насеста. Вода в поилке — лёд, ты разбиваешь его кулаком в рукавице. Дрова звенят, как стекло.', effects: [set49('dw', 'chores'), { body: 'fatigue', delta: 3 }, until49(6, 30)] },
      { id: 'c49_dw_tea', label: 'Кружку горячего у печки и помолчать', minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Ты держишь кружку двумя руками и смотришь в огонь. Хенрике ставит рядом кусок хлеба с салом, ничего не говоря. Ты съедаешь его, сам{m:|а} того не заметив.', effects: [set49('dw', 'tea'), ...fed49(15), until49(6, 30)] },
      { id: 'c49_dw_radio', label: 'Послушать утреннюю сводку по рации', when: flag('w.c41_radio'), minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Треск, обрывки, потом ровный женский голос из Люнебурга: «…ab Neujahr Tauwetter, Regen, bis plus sechs Grad…» С Нового года оттепель, дождь, до плюс шести. Хенрике у плиты перестаёт мешать кашу.', effects: [set49('dw', 'radio'), w49('heard_thaw', true), until49(6, 30)] },
      { id: 'c49_dw_partner', label: 'Помочь {partner.dat} сменить повязку', when: partnerHurt49, minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Бинт присох, и ты отмачиваешь его тёплой водой, по сантиметру. Швы ровные, тёмные, девять штук. {partner} смотрит на тебя снизу и говорит: «Ну как?» Ты говоришь: «Красиво». Почти не врёшь.', effects: [set49('dw', 'bandage'), w49('bandage', true), until49(6, 30)] },
    ] }),

  // ── Раненый дома ──
  S49({ id: 'c49_r_home', for: 'any', chapter: 'ch3', title: 'Доктор Зандер', camp: house14,
    text: [
      { text: 'В восемь приходит доктор Зандер, с саквояжем и снегом на воротнике. Она снимает повязку, смотрит швы под лампой и нюхает бинт.' },
      { text: '— Sauber. Keine Entzündung. — Она загибает пальцы. — Drei Tage nichts Schweres. Nicht in die Kälte. Kein Alkohol an Silvester. Und wenn Ihnen schwindlig wird — hinlegen.\n\nЧисто. Воспаления нет. Три дня ничего тяжёлого. Не на холод. Никакого алкоголя в Сильвестр. Закружится голова — лечь.' },
    ],
    actions: [
      { id: 'c49_rh_when', label: 'Спросить, когда снимут швы', minutes: 30, terminal: true, goto: 'c49_r_visit',
        text: 'Зандер прикидывает: на шестой день, значит, четвёртого. «Dann sehen Sie die Narbe. Kleiner, als Sie denken». Тогда увидите шрам. Меньше, чем думаете. Она убирает ножницы и улыбается первый раз за всё знакомство.', effects: [set49('rh', 'when'), w49('stitches_date', true), until49(8, 45)] },
      { id: 'c49_rh_memory', label: 'Спросить про память: субботу ты помнишь кусками', minutes: 30, terminal: true, goto: 'c49_r_visit',
        text: 'Зандер кивает: сотрясение. Последние минуты перед ударом могут не вернуться никогда. «Das Gehirn schützt sich». Мозг себя бережёт. Ты не уверен{m:|а}, что хочешь их вспомнить.', effects: [set49('rh', 'memory'), until49(8, 45)] },
      { id: 'c49_rh_pay', label: 'Отдать ей банку тушёнки за работу', minutes: 30, terminal: true, goto: 'c49_r_visit',
        text: 'Зандер отказывается. Потом смотрит на банку ещё раз и берёт: «Für die alte Frau Meyer. Die isst sonst nichts». Для старой фрау Майер. Она иначе ничего не ест. Банка уходит в саквояж к бинтам.', effects: [set49('rh', 'pay'), w49('zander_paid', true), until49(8, 45)] },
      { id: 'c49_rh_quiet', label: 'Ничего не спрашивать, только кивать', minutes: 30, terminal: true, goto: 'c49_r_visit',
        text: 'Ты киваешь на каждое слово. Голове от этого хуже, но спорить с Зандер — ещё хуже. Она завязывает свежий бинт тугим узлом, как подарок.', effects: [set49('rh', 'quiet'), until49(8, 45)] },
    ] }),

  S49({ id: 'c49_r_visit', for: 'any', chapter: 'ch3', title: 'Гость', camp: kitchen14,
    text: [
      { text: 'Не успевает Зандер уйти, в дверь стучат. На пороге Яннес, с шапкой в руках, как в церкви.' },
      { text: '— Ich wollte nur sehen. — Он смотрит на повязку и отводит глаза. — Ich war am Samstag zehn Meter weg.\n\nЯ только посмотреть. Я в субботу был в десяти метрах.' },
    ],
    actions: [
      { id: 'c49_rv_sit', label: 'Позвать его сесть и выпить чаю', minutes: 60, terminal: true, goto: 'c49_r_kitchen',
        text: 'Яннес садится на край лавки и держит кружку, не отпивая. Рассказывает про пост у леса, про Уте, про то, что ночью ему снится лесополоса. Потом выпивает чай залпом, холодный, и уходит, ни разу не сказав «прости». Но ты слышишь.', effects: [set49('rv', 'sit'), w49('jannes_visit', true), until49(9, 45)] },
      { id: 'c49_rv_ok', label: 'Сказать ему: «Ты ни при чём»', minutes: 60, terminal: true, goto: 'c49_r_kitchen',
        text: 'Яннес кивает, но не верит. Это видно по тому, как он мнёт шапку. В дверях он говорит: «Silvester steh ich am Wald. Ich pass auf. Für zwei». В Сильвестр я у леса. Буду смотреть. За двоих.', effects: [set49('rv', 'ok'), w49('jannes_visit', true), w49('jannes_for_two', true), until49(9, 45)] },
      { id: 'c49_rv_ask', label: 'Попросить рассказать, что было в субботу: ты не помнишь', minutes: 60, terminal: true, goto: 'c49_r_kitchen',
        text: 'Яннес рассказывает медленно, по шагам: сарай, крик, как тебя несли на воротах от калитки, как Уте рвала простыню на бинты. Ты слушаешь, как про чужого человека. Под конец он говорит: «Du hast nicht geschrien. Gar nicht». Ты не кричал{m:|а}. Совсем.', effects: [set49('rv', 'ask'), w49('jannes_visit', true), until49(9, 45)] },
    ] }),

  S49({ id: 'c49_r_kitchen', for: 'any', chapter: 'ch3', title: 'Кухня', camp: kitchen14,
    text: [
      { text: 'Хенрике сажает тебя на лавку у плиты, как ребёнка, и ставит таз с картошкой. «Sitzen kannst du. Schälen auch». Сидеть можешь. Чистить тоже.' },
      { text: 'За окном все заняты Сильвестром: таскают дрова, чистят фонари, спорят. Все, кроме тебя.' },
    ],
    actions: [
      { id: 'c49_rk_peel', label: 'Чистить картошку и слушать Хенрике', minutes: 135, terminal: true, goto: 'c49_n_lunch',
        text: 'Хенрике рассказывает про зиму семьдесят восьмого: снег по крышу, четыре дня без тока, коровы, которых доили при свечах. «Und alle haben überlebt. Fast alle». И все выжили. Почти все. Про «почти» она не рассказывает. Таз пустеет, ведро очистков растёт.', effects: [set49('rk', 'peel'), npc('henrike', 1), until49(12, 0)] },
      { id: 'c49_rk_lead', label: 'Найти с детьми в комоде старый набор для литья олова', minutes: 135, terminal: true, goto: 'c49_n_lunch',
        text: 'В нижнем ящике комода, под скатертями, — коробка: ложка с деревянной ручкой и шесть оловянных подковок. Bleigießen. Дети не знают, что это. Ты объясняешь: в полночь плавят над свечой, льют в воду, по фигуре гадают на год. Младший сразу хочет «корабль».', effects: [set49('rk', 'lead'), w49('lead_set', true), until49(12, 0)] },
      { id: 'c49_rk_lists', label: 'Переписать набело список постов для Брандта', minutes: 135, terminal: true, goto: 'c49_n_lunch',
        text: 'Фамилии, часы, места. Почерк у тебя от лекарств ползёт вниз, и ты переписываешь дважды. На второй раз замечаешь: у карьера за лесополосой поста нет ни одного. Ты ставишь на полях знак вопроса.', effects: [set49('rk', 'lists'), w49('saw_pit_gap', true), until49(12, 0)] },
      { id: 'c49_rk_sleep', label: 'Лечь и поспать до обеда', minutes: 135, terminal: true, goto: 'c49_n_lunch', activity: 'rest',
        text: 'Ты засыпаешь под стук ножа на кухне и просыпаешься, когда уже накрывают. Голова лёгкая. Почти чужая, но лёгкая.', effects: [set49('rk', 'sleep'), { body: 'fatigue', delta: -15 }, until49(12, 0)] },
    ] }),

  // ── После обеда: вместе ──
  S49({ id: 'c49_n_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед. Гороховый суп, хлеб, по ломтю сала. Хенрике считает едоков вслух и сбивается, потому что кто-то всё время встаёт подлить.' },
      { when: v('w.c33_rule', 'pot'), text: 'Котёл один на всех, как решили в начале декабря. Хенрике до сих пор говорит, что так проще считать.' },
      { when: v('w.c33_rule', 'yards'), text: 'Каждый двор ест своё, как решили в начале декабря. Хенрике подкладывает тем, у кого меньше, и делает вид, что не подкладывает.' },
      { when: v('w.c33_rule', 'work'), text: 'На двери кухни, как с начала декабря, лист: кто сегодня отработал за новых. Твоя фамилия там через день.' },
      { when: alone49, text: 'Рядом с тобой пустой стул. Никто его не занимает. Так решила Хенрике, не сказав ни слова.' },
      { when: hurt49, text: 'Ложку ты держишь {m:сам|сама}. Рука чуть дрожит, но суп до рта доходит.' },
      { when: partnerHurt49, text: '{partner} ест за столом, со всеми. Первый раз с субботы.' },
      { when: bjorn49('take'), text: 'Бьёрн Тиде сидит с краю и ест быстро и молча, ссутулившись, как в чужом доме. Хенрике подкладывает ему, не спрашивая.' },
    ],
    actions: [
      { id: 'c49_nl_eat', label: 'Обедать со всеми', minutes: 40, terminal: true, goto: 'c49_n_tracks', ...tableOnly,
        text: 'Суп густой, ложка стоит. Ты ешь две тарелки. За окном солнце, низкое, и снег от него синий.', effects: [set49('nl', 'eat'), meal('eat'), until49(12, 45)] },
      { id: 'c49_nl_quick', label: 'Поесть быстро и выйти проверить пост', when: heavy, minutes: 30, terminal: true, goto: 'c49_n_tracks', ambientDuring: day49,
        text: 'Суп ты допиваешь стоя, из кружки. На посту у Зеве всё тихо. Часовой показывает тебе на тот берег: пусто. Ты возвращаешься к калитке, и как раз вовремя.', effects: [set49('nl', 'quick'), ...fed49(25), until49(12, 45)] },
      { id: 'c49_nl_bjorn', label: 'Сесть рядом с Бьёрном', when: bjorn49('take'), minutes: 40, terminal: true, goto: 'c49_n_tracks', ...tableOnly,
        text: 'Ты садишься рядом. Бьёрн отодвигается на сантиметр, потом обратно. Под конец говорит в тарелку: «Die Hühner legen nicht. Wegen dem Umzug». Куры не несутся. Из-за переезда. Это первое, что он сказал за обед.', effects: [set49('nl', 'bjorn'), meal('eat'), w49('bjorn_spoke', true), until49(12, 45)] },
      { id: 'c49_nl_kids', label: 'Поесть с детьми на кухне, чтобы взрослым было свободнее', minutes: 40, terminal: true, goto: 'c49_n_tracks',
        text: 'Дети спорят, кто будет лить олово первым. Ты говоришь: кто съест суп. Суп съедают все. Спор остаётся.', effects: [set49('nl', 'kids'), ...fed49(30), until49(12, 45)] },
    ] }),

  S49({ id: 'c49_n_tracks', for: 'any', chapter: 'ch3', title: 'Следы', camp: yard14, ambient: day49,
    text: [
      { text: 'В час у калитки — Яннес, без шапки, красный от бега.' },
      { when: flag('w.c45_dog'), text: 'Луна ещё с утра скулила у калитки, глядя в сторону поля Тиде. Ты думал{m:|а}, просится гулять.' },
      { text: '— Spuren. Bei Tiede, quer übers Feld. Frisch, von heute Nacht. Einer zieht das Bein nach. Die gehen zur Kiesgrube.\n\nСледы. У Тиде, через поле. Свежие, с ночи. Один волочит ногу. Идут к карьеру.' },
      { text: 'Он переводит дыхание и добавляет тише: «Ab Neujahr soll es tauen. Dann wachen die richtig auf». С Нового года обещают оттепель. Тогда они проснутся по-настоящему.' },
      { when: hurt49, text: 'Ты встаёшь из-за стола, и комната плывёт. Зандер сказала: не на холод.' },
      { when: partnerHurt49, text: '{partner} поднимается и садится обратно: голова не пускает. Значит, идёшь без {pm:него|неё}.' },
      { when: alone49, text: 'Лукас с трактором будет в четыре: в Винзен, к рации. До четырёх — три часа.' },
    ],
    actions: [
      { id: 'c49_nt_follow', label: 'Идти с Яннесом по следам: посмотреть, куда ведут', when: heavy, minutes: 45, terminal: true, outcomes: fromTracks(), ambientDuring: day49,
        text: 'Топор за поясом, Яннес с вилами. Вы идёте молча, след в след, чтобы не затоптать чужие.', effects: [set49('nt', 'follow'), w49('knows_thaw', true), toWood, until49(13, 45)] },
      { id: 'c49_nt_felix', label: 'Позвать Феликса: втроём надёжнее', when: all(heavy, felix49), minutes: 45, terminal: true, outcomes: fromTracks(), ambientDuring: day49,
        text: 'Феликс берёт ружьё и не задаёт вопросов. Втроём вы идёте через поле, и ты впервые за неделю не оглядываешься назад: назад смотрит Феликс.', effects: [set49('nt', 'felix'), w49('knows_thaw', true), w49('felix_pit', true), toWood, until49(13, 45)] },
      { id: 'c49_nt_brandt', label: 'Отправить Яннеса к Брандту, а самим идти смотреть', when: heavy, minutes: 45, terminal: true, outcomes: fromTracks(), ambientDuring: day49,
        text: 'Яннес бежит в Йестебург. Ты идёшь к карьеру с топором и с тем, кто оказался рядом. Если там что-то есть, Брандт узнает раньше, чем вы вернётесь.', effects: [set49('nt', 'brandt'), w49('knows_thaw', true), w49('brandt_knows', true), toWood, until49(13, 45)] },
      { id: 'c49_nt_bell', label: 'Сначала предупредить пост у Зеве, потом за Яннесом', when: heavy, minutes: 45, terminal: true, outcomes: fromTracks(), ambientDuring: day49,
        text: 'Часовой на посту кивает и подтягивает верёвку колокола поближе. Ты догоняешь Яннеса у поля Тиде. Следы там такие, как он сказал: три цепочки, одна с бороздой.', effects: [set49('nt', 'bell'), w49('knows_thaw', true), w49('post_warned', true), toWood, until49(13, 45)] },
      { id: 'c49_nt_stay', label: 'Остаться: Зандер запретила', when: hurt49, minutes: 15, terminal: true, outcomes: fromTracks(),
        text: 'Ты садишься обратно. Яннес уходит с теми, кто может. Дверь хлопает, и в кухне становится очень тихо.', effects: [set49('nt', 'stay'), w49('knows_thaw', true), until49(13, 15)] },
    ] }),

  S49({ id: 'c49_n_pit', for: 'any', chapter: 'ch3', title: 'Карьер', location: wood49, camp: trip49(wood49), ambient: day49,
    text: [
      { text: 'Следы идут через поле Тиде к лесополосе, вдоль неё на юг, к старому гравийному карьеру. Три цепочки. Одна волочит ногу: борозда в снегу, как от санок.' },
      { text: 'Карьер — яма шагов в сто шириной. На дне вода подо льдом и ржавый транспортёр. У транспортёра кто-то стоит.' },
      { text: 'Мужчина в летней куртке, весь в инее, как куст. Стоит, наклонившись к вам. Мороз его держит. Только глаза идут за вами, медленно, как стрелка часов.' },
      { text: 'Двух других нет. Их следы уходят по дну карьера дальше, к ельнику на юге.' },
      { when: flag('w.c47_promise'), text: 'Ты помнишь, о чём вы договорились в субботу: никуда в одиночку. Яннес рядом. Это считается.' },
      { when: flag('w.c47_felix_tip'), text: 'В голове голос Феликса из субботней цепи: не под ноги, на просветы между деревьями. Ты смотришь на просветы.' },
    ],
    actions: [
      { id: 'c49_np_end', label: 'Спуститься и закончить это, пока он не может двигаться', minutes: 60, terminal: true, goto: afterPit, ambientDuring: day49, activity: 'heavy',
        text: 'Осыпь шуршит под ногами. Яннес держит вилы наготове. Удар один. Он падает, как падает с верёвки замёрзшее бельё. На запястье под инеем — пластиковый браслет больницы. Харбург. Номер, имени нет.', effects: [set49('np', 'end'), w49('pit_killed', true), w49('pit_bracelet', true), { body: 'stress', delta: 6 }, { body: 'fatigue', delta: 5 }, until49(14, 50)] },
      { id: 'c49_np_mark', label: 'Не трогать: вбить кол с тряпкой и сказать Брандту', minutes: 60, terminal: true, goto: afterPit, ambientDuring: day49,
        text: 'Кол с красной тряпкой на краю карьера, второй — на тропе от лесополосы. Яннес смотрит вниз и говорит: «Bei minus zehn läuft der nicht weg». При минус десяти он никуда не денется. А при плюс шести?', effects: [set49('np', 'mark'), w49('pit_marked', true), w49('brandt_knows', true), until49(14, 50)] },
      { id: 'c49_np_trail', label: 'Пройти по следам двух других до ельника', minutes: 75, terminal: true, goto: afterPit, ambientDuring: day49,
        text: 'Следы уходят в ельник. На краю ты останавливаешься: дальше темно даже днём, снег под ёлками не лежит, следов не видно. Где-то в глубине трещит ветка. Один раз. Потом тихо. Ты отступаешь спиной вперёд, пока ельник не становится просто лесом.', effects: [set49('np', 'trail'), w49('pit_trail', true), { body: 'stress', delta: 5 }, until49(15, 5)] },
      { id: 'c49_np_count', label: 'Обойти карьер по краю и посчитать все следы', minutes: 60, terminal: true, goto: afterPit, ambientDuring: day49,
        text: 'Ты обходишь яму по краю. Кроме трёх свежих цепочек — старые, занесённые, но видные: с оттепели неделю назад. Восемь, может, десять. Карьер — как воронка: всё, что идёт с юга через лес, сползает сюда.', effects: [set49('np', 'count'), w49('pit_counted', true), until49(14, 50)] },
    ] }),

  S49({ id: 'c49_n_return', for: 'any', chapter: 'ch3', title: 'Обратно', location: wood49, camp: trip49(wood49), ambient: day49,
    text: [
      { text: 'Назад идёте быстрее, чем туда. На краю поля Тиде вас ждёт Уте, в двух платках, с ребёнком на руках.' },
      { text: '— Und? — спрашивает она. И сразу, не дожидаясь: — Soll ich es den anderen sagen? Heute? Vor Silvester?\n\nНу? Сказать остальным? Сегодня? Перед Сильвестром?' },
      { when: v('w.c16_sweep', 'warn'), text: 'Ты помнишь ночь в ноябре, когда вы сами шли к ней через поле — предупредить. Теперь она спрашивает у вас то же самое, только наоборот.' },
    ],
    actions: [
      { id: 'c49_nr2_tell', label: 'Сказать: да, пусть колония знает сегодня', minutes: 40, terminal: true, outcomes: fromPit, ambientDuring: day49,
        text: 'Уте кивает и уходит по домикам. Через полчаса в колонии не горит ни одна лишняя свеча, а у каждой двери стоит лопата или вилы. Никто не паникует. Просто все знают.', effects: [set49('nr2', 'tell'), w49('colony_told', true), toFarm, until49(15, 45)] },
      { id: 'c49_nr2_wait', label: 'Попросить подождать до решения Брандта', minutes: 40, terminal: true, outcomes: fromPit, ambientDuring: day49,
        text: 'Уте смотрит на тебя долго. «Bis morgen früh. Nicht länger». До завтрашнего утра. Не дольше. Она уходит, прижимая ребёнка, и оглядывается на лесополосу дважды.', effects: [set49('nr2', 'wait'), toFarm, until49(15, 45)] },
      { id: 'c49_nr2_tiede', label: 'Сделать крюк мимо двора Тиде: всё ли там спокойно', minutes: 40, terminal: true, outcomes: fromPit, ambientDuring: day49,
        text: 'Двор Тиде тихий. Следов у сарая нет, у колодца нет. Только куриные, крестиками. Ты обходишь дом кругом и возвращаешься на тропу. От этого крюка спокойнее, хотя ничего не изменилось.', effects: [set49('nr2', 'tiede'), w49('tiede_checked', true), toFarm, until49(15, 45)] },
      { id: 'c49_nr2_jannes', label: 'Договориться с Яннесом о ночи: кто где стоит', minutes: 40, terminal: true, outcomes: fromPit, ambientDuring: day49,
        text: 'Яннес чертит палкой на снегу: лес, карьер, колония, хутор. «Ich hier. Ihr da. Und wenn die Glocke geht — alle zum Hof». Я здесь. Вы там. А если колокол — все к хутору. Ты повторяешь вслух, чтобы запомнить.', effects: [set49('nr2', 'jannes'), w49('night_plan', true), toFarm, until49(15, 45)] },
    ] }),

  S49({ id: 'c49_r_window', for: 'any', chapter: 'ch3', title: 'Окно', camp: kitchen14,
    text: [
      { text: 'Кухня пустая. Хенрике моет посуду медленнее, чем обычно, и всё время смотрит в окно.' },
    ],
    actions: [
      { id: 'c49_rw_watch', label: 'Сидеть у окна и смотреть на поле Тиде', minutes: 90, terminal: true, goto: 'c49_n_bath',
        text: 'Фигурки на белом поле становятся точками, потом пропадают за лесополосой. Ты считаешь минуты по часам на стене. Через полтора часа точки возвращаются: столько же, сколько ушло. Ты выдыхаешь.', effects: [set49('rw', 'watch'), until49(15, 0)] },
      { id: 'c49_rw_stove', label: 'Держать печку и воду горячими к их возвращению', minutes: 90, terminal: true, goto: 'c49_n_bath',
        text: 'Ты подкладываешь по полену и ставишь два ведра на плиту. Когда они возвращаются, вода уже горячая, а чай заварен. {partner} пьёт стоя и рассказывает коротко: в карьере был один, замёрзший, и вокруг — ещё следы.', effects: [set49('rw', 'stove'), until49(15, 0)] },
      { id: 'c49_rw_kids', label: 'Занять детей, чтобы не висли на окнах', minutes: 90, terminal: true, goto: 'c49_n_bath',
        text: 'Ты показываешь детям, как складывать из газеты шапку. Шапок к возвращению взрослых — восемь. Все кривые. Все надеты.', effects: [set49('rw', 'kids'), until49(15, 0)] },
    ] }),

  S49({ id: 'c49_n_bath', for: 'any', chapter: 'ch3', title: 'Прачечная', camp: kitchen14,
    text: [
      { text: 'В прачечной за домом Хенрике растопила старый котёл. Пар стоит под потолком, окно запотело изнутри, на полу корыто и два таза.' },
      { when: flag('w.c48_ice_hole'), text: 'Воду носят из проруби у мостков: чёрную, ледяную, вёдрами на коромысле.' },
      { when: not(flag('w.c48_ice_hole')), text: 'Воду топят из снега: ведро снега — треть ведра воды. Дети таскают снег наперегонки.' },
      { text: '— Ins neue Jahr geht man sauber, — говорит Хенрике. — Das war so, und das bleibt so.\n\nВ новый год идут чистыми. Так было, так и останется.' },
    ],
    actions: [
      { id: 'c49_nb2_self', label: 'Вымыться самому: долго, до красной кожи', when: heavy, minutes: 70, terminal: true, goto: 'c49_n_dusk',
        text: 'Горячая вода из ковша на голову, мыло, ещё ковш. Карьер стекает с тебя вместе с пеной. Ты сидишь в корыте, пока вода не остывает. Выходишь лёгк{m:им|ой}, как после долгой болезни.', effects: [set49('nb2', 'self'), { body: 'stress', delta: -8 }, { body: 'fatigue', delta: -4 }, until49(17, 0)] },
      { id: 'c49_nb2_kids', label: 'Вымыть детей по очереди', minutes: 70, terminal: true, goto: 'c49_n_dusk',
        text: 'По очереди, в одном корыте. Визг, брызги, мыло в глазах. Последний сидит в воде дольше всех и не хочет вылезать: «Noch ein bisschen». Ещё чуть-чуть. Ты даёшь ему чуть-чуть.', effects: [set49('nb2', 'kids'), { body: 'stress', delta: -4 }, until49(17, 0)] },
      { id: 'c49_nb2_wash', label: 'Постирать, пока есть горячая вода', when: heavy, minutes: 70, terminal: true, goto: 'c49_n_dusk', activity: 'moderate',
        text: 'Рубашки, носки, бельё, пелёнки из колонии. Руки в кипятке краснеют, на морозе белеют. Верёвка через весь чердак, бельё висит рядами. К утру высохнет или замёрзнет.', effects: [set49('nb2', 'wash'), w49('laundry', true), { body: 'fatigue', delta: 5 }, until49(17, 0)] },
      { id: 'c49_nb2_care', label: 'Вымыть {partner.dat} голову, обходя швы', when: partnerHurt49, minutes: 70, terminal: true, goto: 'c49_n_dusk',
        text: '{partner} сидит на табуретке, склонившись над тазом. Ты льёшь из кружки по капле, мимо бинта, разбираешь пальцами слипшиеся волосы. Вода в тазу розовая, потом прозрачная. {partner} говорит в таз: «Спасибо». Глухо. Ты делаешь вид, что не слышишь.', effects: [set49('nb2', 'care'), w49('hair_washed', true), { body: 'stress', delta: -6 }, until49(17, 0)] },
      { id: 'c49_nb2_careful', label: 'Вымыться осторожно, не намочив швы', when: hurt49, minutes: 70, terminal: true, goto: 'c49_n_dusk',
        text: 'Таз, кружка, губка. Голову держишь над краем, как над пропастью. Тёплая вода по плечам — лучшее, что случилось с субботы.', effects: [set49('nb2', 'careful'), { body: 'stress', delta: -6 }, until49(17, 0)] },
    ] }),

  S49({ id: 'c49_n_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: day49,
    text: [
      { text: 'В пять уже темно. На посту у Зеве фонарь, в окнах колонии свечи. Брандт присылает Лукаса со списком на завтра.' },
      { text: 'Лукас читает с листа, запинаясь: в восемь — огонь, в девять — суп, в полночь — колокол и «noch was». Ещё кое-что. На «ещё кое-что» он смотрит в сторону.' },
      { when: brothersCome, text: 'Следом заходит Дениз с фонарём: если ночью у карьера нужен второй, он пойдёт. Говорит это так, будто предлагает подвезти до города.' },
      { when: brandtKnows49, text: 'Внизу листа рукой Брандта: «Kiesgrube — Posten ab 22 Uhr». Карьер — пост с десяти вечера. Кто будет стоять, не написано.' },
    ],
    actions: [
      { id: 'c49_nd_lukas', label: 'Спросить Лукаса прямо, что за «ещё кое-что»', minutes: 45, terminal: true, goto: 'c49_n_supper', ambientDuring: day49,
        text: 'Лукас краснеет до ушей. «Wird man sehen». Увидите. И уходит быстрее, чем пришёл. Ты знаешь его достаточно, чтобы понять: что-то он всё-таки прячет.', effects: [set49('nd', 'lukas'), until49(17, 45)] },
      { id: 'c49_nd_tell', label: 'Рассказать Лукасу про карьер: пусть передаст Брандту', when: not(brandtKnows49), minutes: 45, terminal: true, goto: 'c49_n_supper', ambientDuring: day49,
        text: 'Лукас слушает, открыв рот. Потом бежит в Йестебург, не попрощавшись. Через час на листе будет новая строчка. Брандт узнал. Значит, и все узнают.', effects: [set49('nd', 'tell'), w49('brandt_knows', true), until49(17, 45)] },
      { id: 'c49_nd_shift', label: 'Взять сегодня ночную смену у Зеве', when: heavy, minutes: 45, terminal: true, goto: 'c49_n_supper', ambientDuring: day49,
        text: 'Ты вписываешь себя в лист: с девяти до полуночи. Лукас смотрит на твою фамилию и говорит: «Mutig». Смело. Ты не чувствуешь себя {m:смелым|смелой}. Тебе просто не спится в такие ночи.', effects: [set49('nd', 'shift'), w49('night_shift', true), until49(17, 45)] },
      { id: 'c49_nd_dough', label: 'Помочь Хенрике с тестом для берлинеров', when: henrike49, minutes: 45, terminal: true, goto: 'c49_n_supper',
        text: 'Тесто тугое, руки горят. Хенрике месит со своей стороны и учит тебя считать до ста по-нижненемецки. На «hunnert» тесто готово. Пятьдесят шариков под полотенцем до утра.', effects: [set49('nd', 'dough'), npc('henrike', 1), until49(17, 45)] },
    ] }),

  S49({ id: 'c49_n_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин при двух лампах: керосин берегут к завтрашнему. Картошка с луком, чай, по куску вчерашнего пирога.' },
      { when: oleHome33, text: 'Оле после ужина учит детей заправлять фонари, не проливая керосин. У него получается лучше, чем у Хенрике, и она это молча признаёт.' },
      { when: all({ npc: 'c21_lea', alive: true, at: 'hof_luedemann' }, not(flag('w.c41_lea_gone'))), text: 'Лея после ужина первая идёт мыть посуду. Говорит, что в Бергене весной будет пусто и что ей туда не к спеху.' },
      { when: all(v('w.c39_strangers', 'barn'), not(flag('w.c40_left_army')), v('w.c41_jorg', 'stay')), text: 'Йорг чинит детям санки к Сильвестру: полозья из старой бочки. Дети сидят рядом и подают гвозди.' },
      { when: merleHome49, text: 'Мерле показывает тебе тетрадь: за неделю сахар скачет, как заяц по полю. «Wenn Hamburg nicht geht, dann eben so». Если не Гамбург — значит, так.' },
      { when: bjorn49('take'), text: 'Бьёрн моет за всеми посуду. Его никто не просил. Хенрике смотрит на него и ничего не говорит, и это у неё высшая похвала.' },
      { when: flag('w.c49_pit_killed'), text: 'За столом говорят про браслет из Харбурга. Тихо, чтобы дети не слышали. Дети, конечно, слышат.' },
    ],
    actions: [
      { id: 'c49_ns_eat', label: 'Ужинать со всеми', minutes: 45, terminal: true, goto: 'c49_n_evening', ...tableOnly,
        text: 'Картошка горячая, лук сладкий. Ты ешь и думаешь, что завтра в это время уже будет гореть огонь на площади.', effects: [set49('ns', 'eat'), meal('eat'), until49(18, 45)] },
      { id: 'c49_ns_radio', label: 'Поймать вечернюю сводку по рации', when: flag('w.c41_radio'), minutes: 45, terminal: true, goto: 'c49_n_evening',
        text: 'Люнебург: оттепель с Нового года, дождь, плюс шесть. И ещё: со второго января Харбургский мост закрыт для гражданских. Хенрике выключает рацию и говорит: «Na dann. Frohes Neues». Ну что ж. С Новым годом.', effects: [set49('ns', 'radio'), w49('heard_thaw', true), w49('heard_bridge', true), ...fed49(25), until49(18, 45)] },
      { id: 'c49_ns_merle', label: 'Посидеть с Мерле над её тетрадью', when: merleHome49, minutes: 45, terminal: true, goto: 'c49_n_evening',
        text: 'Вы считаете вместе: сколько флаконов осталось, сколько дней. Выходит до середины февраля, если без ошибок. Мерле закрывает тетрадь и говорит: «Dann Februar». Значит, февраль. Как будто речь о погоде.', effects: [set49('ns', 'merle'), w49('merle_feb', true), ...fed49(25), until49(18, 45)] },
      { id: 'c49_ns_bjorn', label: 'Вытирать посуду рядом с Бьёрном', when: bjorn49('take'), minutes: 45, terminal: true, goto: 'c49_n_evening',
        text: 'Он моет, ты вытираешь. Минут через двадцать он говорит, не поднимая головы: «Papa hat Silvester immer verschlafen». Папа всегда просыпал Сильвестр. И смеётся. Коротко, как кашляет.', effects: [set49('ns', 'bjorn'), w49('bjorn_laughed', true), ...fed49(25), until49(18, 45)] },
      { id: 'c49_ns_kids', label: 'Ужинать с детьми и выспрашивать, что они загадают на олово', minutes: 45, terminal: true, goto: 'c49_n_evening',
        text: 'Старший загадает собаку. Средняя — чтобы мама нашлась. Младший — корабль, всё ещё корабль. Ты не спрашиваешь у средней, где мама. Ты подкладываешь ей картошки.', effects: [set49('ns', 'kids'), ...fed49(30), until49(18, 45)] },
      { id: 'c49_ns_porch', label: 'Поесть на крыльце, глядя на тот берег', when: heavy, minutes: 45, terminal: true, goto: 'c49_n_evening', ambientDuring: frost49,
        text: 'Миска остывает за пять минут. На том берегу Зеве ни огонька, ни звука. Мороз держит. Пока держит.', effects: [set49('ns', 'porch'), ...fed49(25), until49(18, 45)] },
    ] }),

  S49({ id: 'c49_n_evening', for: 'any', chapter: 'ch3', title: 'Вечер', camp: kitchen14,
    text: [
      { text: 'После ужина кухня — самое тёплое место в доме. Хенрике штопает, дети спорят шёпотом, кто завтра первым будет лить олово. В печке гудит.' },
      { when: partnerHurt49, text: '{partner} дремлет у печки в кресле, голова на подушке, рот приоткрыт. Будить жалко.' },
    ],
    actions: [
      { id: 'c49_ne_mend', label: 'Зашить порванную варежку и куртку', minutes: 60, terminal: true, goto: 'c49_n_night',
        text: 'Иголка, нитка, напёрсток Хенрике. Шов выходит кривой, но держит. Хенрике смотрит через очки и говорит: «Das hält bis Ostern». До Пасхи продержится. От неё это почти похвала.', effects: [set49('ne', 'mend'), until49(19, 45)] },
      { id: 'c49_ne_lead', label: 'Показать детям, как плавят олово: на одной подковке', minutes: 60, terminal: true, goto: 'c49_n_night',
        text: 'Ложка над свечой, олово течёт серебряной каплей, шипит в воде. Выходит что-то вроде гриба. Или зонтика. Или дерева. Дети спорят до слёз. Хенрике говорит, что гриб — к деньгам, и спор кончается.', effects: [set49('ne', 'lead'), w49('lead_set', true), until49(19, 45)] },
      { id: 'c49_ne_henrike', label: 'Спросить Хенрике, как раньше встречали Новый год на хуторе', minutes: 60, terminal: true, goto: 'c49_n_night',
        text: 'Хенрике откладывает штопку. Раньше в полночь стреляли из ружья в воздух, с крыльца: так прогоняли зиму. «Diesmal nicht», — говорит она. В этот раз нет. И снова берётся за иголку.', effects: [set49('ne', 'henrike'), npc('henrike', 1), until49(19, 45)] },
      { id: 'c49_ne_nina', label: 'Помочь Нине собрать рюкзак к школе на январь', when: all(ninaFarm, any(v('w.c42_school', 'go'), v('w.c42_school', 'herself'))), minutes: 60, terminal: true, goto: 'c49_n_night',
        text: 'Тетради, носки, мыло, фонарик без батареек, фотография, которую она прячет на дно. Нина говорит, что в Винзене все будут новые и никто не будет знать, кто она. Говорит это, как будто это хорошо. Может, и хорошо.', effects: [set49('ne', 'nina'), w49('nina_packed', true), until49(19, 45)] },
      { id: 'c49_ne_list', label: 'Записать в тетрадь, что надо сделать завтра до обеда', minutes: 60, terminal: true, goto: 'c49_n_night',
        text: 'Берлинеры разнести. Фонари. Верёвка колокола. Брандт в одиннадцать. Факелы. Ты пишешь столбиком, и в конце сам собой добавляется ещё один пункт: «не забыть поесть». Смеёшься над собой и не вычёркиваешь.', effects: [set49('ne', 'list'), until49(19, 45)] },
    ] }),

  S49({ id: 'c49_n_night', for: 'any', chapter: 'ch3', title: 'Последняя ночь года', camp: house14,
    text: [
      { text: 'Дом засыпает рано: завтра всем быть на ногах до часу ночи. Печь потрескивает, на чердаке позванивает замёрзшее бельё.' },
      { when: flag('w.c45_candle_sign'), text: 'Свеча в кухонном окне горит, как договорились двадцать третьего: кто вернётся первым, тот и зажжёт. Её никто не гасит.' },
      { when: flag('w.c49_night_shift'), text: 'В девять — твоя смена у Зеве.' },
    ],
    actions: [
      { id: 'c49_nn_sleep', label: 'Лечь пораньше', minutes: 30, terminal: true, goto: 'c49_m_dawn',
        text: 'Ты засыпаешь сразу, как будто падаешь. Снится карьер, но во сне он летний, с водой и купальщиками.', effects: [set49('nn', 'sleep'), d31(6, 30, true)] },
      { id: 'c49_nn_shift', label: 'Отстоять смену у Зеве до полуночи', when: all(heavy, flag('w.c49_night_shift')), minutes: 30, terminal: true, goto: 'c49_m_dawn', ambientDuring: { tempC: -3, outdoor: true, wet: false },
        text: 'Три часа в шалаше у фонаря, с ногами в соломе. Река под льдом молчит. Один раз на том берегу кто-то идёт вдоль воды: медленно, спотыкаясь. Ты поднимаешь фонарь, и он останавливается. Стоит. Потом уходит в камыши. В полночь тебя сменяют, и ты не рассказываешь никому до утра.', effects: [set49('nn', 'shift'), w49('shift_saw', true), { body: 'fatigue', delta: 8 }, d31(6, 30, true)] },
      { id: 'c49_nn_talk', label: 'Поговорить с {partner.ins} в темноте о завтрашней ночи', when: not(split49), minutes: 30, terminal: true, goto: 'c49_m_dawn',
        text: 'Вы лежите и шёпотом перебираете: где будете в полночь, кто с детьми, кто на посту. Решить ничего не решаете. Под конец {partner} говорит: «Главное — вместе». Ты думаешь, что это и есть решение.', effects: [set49('nn', 'talk'), { body: 'stress', delta: -5 }, d31(6, 30, true)] },
      { id: 'c49_nn_window', label: 'Постоять у окна, пока дом спит', minutes: 30, terminal: true, goto: 'c49_m_dawn',
        text: 'За окном двор, белый под звёздами, и тень сарая. Мороз рисует на стекле папоротники. Последняя ночь года ничем не отличается от остальных. Это почему-то успокаивает.', effects: [set49('nn', 'window'), d31(6, 30, true)] },
    ] }),

  // ── Тридцать первое ──
  S49({ id: 'c49_m_dawn', for: 'any', chapter: 'ch3', title: 'Тридцать первое', camp: kitchen14,
    text: [
      { text: 'Тридцать первое декабря. Хенрике жарит берлинеры с пяти утра: на кухне пахнет горячим жиром и сахаром.' },
      { when: ninaFarm, text: 'Нина обсыпает берлинеры сахаром и считает вслух: пятьдесят. Один надкусан. Значит, сорок девять, говорит Нина и смотрит на Хенрике честными глазами.' },
      { text: 'Пятьдесят штук на противнях. В одном, говорит Хенрике, горчица. «Wer den kriegt, hat Glück im neuen Jahr. Oder Pech. Je nachdem». Кому достанется, тому в новом году повезёт. Или нет. Смотря как.' },
      { text: 'За ночь потеплело до минус трёх. С крыши у крыльца в первый раз за неделю капнуло — и замёрзло на лету.' },
      { when: flag('w.c49_shift_saw'), text: 'Утром ты рассказываешь про того, на том берегу. Хенрике слушает, не переставая переворачивать берлинеры.' },
    ],
    actions: [
      { id: 'c49_md_eat', label: 'Завтракать со всеми, берлинер — к чаю', minutes: 45, terminal: true, goto: 'c49_m_chores', ...tableOnly,
        text: 'Берлинер горячий, жир течёт по пальцам. Без начинки, но сахар хрустит. Горчица досталась не тебе. Ты почти разочарован{m:|а}.', effects: [set49('md', 'eat'), meal('eat'), d31(7, 30)] },
      { id: 'c49_md_sugar', label: 'Помочь Хенрике обсыпать сахаром', when: henrike49, minutes: 45, terminal: true, goto: 'c49_m_chores',
        text: 'Сахар из последнего пакета, в миске, берлинер туда — и на решётку. Хенрике пробует один и морщится: горчица. «Na also. Glück für mich». Ну вот. Везение мне. Она доедает его до конца.', effects: [set49('md', 'sugar'), npc('henrike', 1), ...fed49(25), d31(7, 30)] },
      { id: 'c49_md_radio', label: 'Послушать по рации погоду на ночь', when: flag('w.c41_radio'), minutes: 45, terminal: true, goto: 'c49_m_chores',
        text: '«…in der Nacht Temperaturanstieg auf null Grad, ab Mittag Regen…» Ночью потепление до нуля, с полудня дождь. Хенрике смотрит на тебя поверх противня: значит, в полночь — ноль.', effects: [set49('md', 'radio'), w49('heard_thaw', true), ...fed49(20), d31(7, 30)] },
      { id: 'c49_md_kids', label: 'Отогнать детей от противней', minutes: 45, terminal: true, goto: 'c49_m_chores',
        text: 'Ты ставишь заслон из табуретки и себя. Дети атакуют с флангов. Потери: три берлинера. Хенрике делает вид, что не считает.', effects: [set49('md', 'kids'), ...fed49(20), d31(7, 30)] },
    ] }),

  S49({ id: 'c49_m_chores', for: 'any', chapter: 'ch3', title: 'Двор', camp: yard14, ambient: mild49,
    text: [
      { text: 'Во дворе снег осел и потемнел за ночь. Под ногами хлюпает впервые за неделю. К ночи надо успеть всё, что в оттепель уже не сделать.' },
      { when: posts49('bell'), text: 'Верёвка от колокола у Зеве до кухни провисла под мокрым снегом и звякает от ветра.' },
    ],
    actions: [
      { id: 'c49_mc_rope', label: 'Подтянуть верёвку колокола и проверить, звенит ли в доме', when: posts49('bell'), minutes: 60, terminal: true, goto: 'c49_m_round', ambientDuring: mild49,
        text: 'Ты подтягиваешь верёвку на трёх столбах и дёргаешь у калитки. В кухне звякает колокольчик, и Хенрике в окне показывает большой палец. Работает.', effects: [set49('mc', 'rope'), w49('rope_ok', true), d31(8, 30)] },
      { id: 'c49_mc_gate', label: 'Расчистить калитку и проверить засов', when: heavy, minutes: 60, terminal: true, goto: 'c49_m_round', ambientDuring: mild49, activity: 'moderate',
        text: 'Мокрый снег тяжёлый, лопата гнётся. Засов прихватило льдом, ты отбиваешь его обухом. Теперь калитка закрывается одним движением. Если придётся ночью — успеешь.', effects: [set49('mc', 'gate'), w49('gate_ok', true), { body: 'fatigue', delta: 4 }, d31(8, 30)] },
      { id: 'c49_mc_barrels', label: 'Поставить бочки под водостоки: оттепель даст воду', minutes: 60, terminal: true, goto: 'c49_m_round', ambientDuring: mild49,
        text: 'Две бочки под водостоки, третью — к сараю. С крыши уже капает. Завтра будут полные, и не надо будет рубить прорубь и топить снег.', effects: [set49('mc', 'barrels'), w49('barrels', true), d31(8, 30)] },
      { id: 'c49_mc_lantern', label: 'Повесить фонарь над калиткой на ночь', minutes: 60, terminal: true, goto: 'c49_m_round', ambientDuring: mild49,
        text: 'Крюк, проволока, фонарь со стеклом. Ты вешаешь его так, чтобы свет падал на дорогу, а не на двор. Кто придёт ночью — будет виден раньше, чем увидит.', effects: [set49('mc', 'lantern'), w49('gate_lamp', true), d31(8, 30)] },
    ] }),

  S49({ id: 'c49_m_round', for: 'any', chapter: 'ch3', title: 'Корзинка', camp: yard14, ambient: mild49,
    text: [
      { text: 'Хенрике раскладывает берлинеры по корзинкам, накрывает полотенцами и раздаёт: соседям, на посты, тем, кто один. До одиннадцати успеть обойти.' },
      { when: hurt49, text: 'Тебе она даёт самую лёгкую корзинку и самый близкий адрес. Споришь ты недолго.' },
    ],
    actions: [
      { id: 'c49_mr_julian', label: 'Отнести берлинеры Юлиану в будку у переезда', when: julian49, minutes: 120, terminal: true, goto: 'c49_m_square', ambientDuring: { tempC: 12, outdoor: false, wet: false },
        text: 'Юлиан открывает будку в шапке и шарфе. Бабушка спит в углу. Он берёт берлинер и съедает его за три укуса. Потом спрашивает, можно ли ему ночью прийти к вам: «Nur bis Mitternacht». Только до полуночи. Ты говоришь: можно и после.', effects: [set49('mr', 'julian'), w49('julian_invited', true), d31(10, 30)] },
      { id: 'c49_mr_hansen', label: 'Отнести фрау Ханзен и посидеть у неё', minutes: 120, terminal: true, goto: 'c49_m_square', ambientDuring: { tempC: 12, outdoor: false, wet: false },
        text: 'Фрау Ханзен ставит на стол две рюмки и бутылку яичного ликёра, «von früher». С прежних времён. Ты пьёшь глоток, она — два. Она рассказывает, как в шестьдесят втором вода стояла у неё в кухне по колено. «Und dann war Frühling». А потом была весна.', effects: [set49('mr', 'hansen'), w49('hansen_visit', true), d31(10, 30)] },
      { id: 'c49_mr_post', label: 'Отнести берлинеры и чай на посты', when: heavy, minutes: 120, terminal: true, goto: 'c49_m_square', ambientDuring: mild49, activity: 'moderate',
        text: 'Пост у Зеве, пост у Тиде, пост у колонии. На каждом — один-два замёрзших человека, которые берут берлинер так, будто это медаль. Яннес на своём говорит: «Wenn du heute Nacht am Wald bist — ich bin rechts von dir». Если ночью будешь у леса — я справа от тебя.', effects: [set49('mr', 'post'), w49('posts_fed', true), d31(10, 30)] },
      { id: 'c49_mr_bjorn', label: 'Отнести Бьёрну на его двор', when: any(bjorn49('help'), bjorn49('brandt')), minutes: 120, terminal: true, goto: 'c49_m_square', ambientDuring: mild49, activity: 'moderate',
        text: 'Бьёрн колет дрова и останавливается, только когда ты протягиваешь корзинку. Берёт два берлинера, один кладёт на подоконник: «Für Papa». Для папы. Потом колет дальше. Ты стоишь рядом, пока он не говорит: «Ich komm heute Nacht zum Feuer. Vielleicht». Я приду ночью к огню. Может быть.', effects: [set49('mr', 'bjorn'), w49('bjorn_fire', true), d31(10, 30)] },
      { id: 'c49_mr_tim', label: 'Отнести берлинер и еловую ветку на могилу Тима', when: flag('w.c37_tim_grave_promise'), minutes: 120, terminal: true, goto: 'c49_m_square', ambientDuring: mild49,
        text: 'Холмик под снегом, камни сверху, деревянная табличка, которую кто-то подновил. Ты кладёшь ветку и берлинер на камень. Вы обещали Касе приходить. Ворона на заборе ждёт, пока ты уйдёшь. Пусть.', effects: [set49('mr', 'tim'), w49('tim_grave', true), d31(10, 30)] },
      { id: 'c49_mr_colony', label: 'Отнести в колонию, Уте и детям', minutes: 120, terminal: true, goto: 'c49_m_square', ambientDuring: { tempC: 12, outdoor: false, wet: false },
        text: 'Уте берёт корзинку и сразу раздаёт: детям, соседке, старику в синей шапке. Себе не оставляет. Ты отдаёшь ей свой берлинер из кармана, и она его берёт, потому что ты стоишь и ждёшь.', effects: [set49('mr', 'colony'), w49('ute_fed', true), d31(10, 30)] },
    ] }),

  S49({ id: 'c49_m_square', for: 'any', chapter: 'ch3', title: 'Совет у Брандта', location: jest49, camp: trip49(jest49), ambient: mild49,
    text: [
      { text: 'В одиннадцать Брандт собирает у пожарной части всех, кто ночью стоит на постах: человек двадцать, кто в чём, пар над головами. На капоте джипа — карта с крестами.' },
      { when: hurt49, text: 'До Йестебурга тебя довозит Лукас на прицепе, укутанн{m:ого|ую} в одеяло, как мешок с картошкой.' },
      { text: 'Брандт говорит коротко: огонь в восемь, суп в девять, колокол в полночь. Каждому — его место на карте.' },
      { when: flag('w.c41_trench_men'), text: 'Ров за ручьями, который копал и ваш двор, на карте обведён синим. Брандт стучит по нему пальцем: «Hält». Держит.' },
      { when: v('w.c47_food', 'less'), text: 'Из погреба Вальдхофа вы взяли меньше положенного, чтобы досталось семьям. Брандт это помнит: к вам он обращается так, как обращаются к своим.' },
      { when: v('w.c39_council', 'yards'), text: 'Каждый двор сам за себя, общие только сигналы: так решили дворы в середине декабря. Поэтому у карьера с осени и не стоял никто.' },
      { when: v('w.c39_council', 'brandt'), text: 'Командует Брандт, как решили дворы в середине декабря. Сегодня это заметно: никто не спорит дольше минуты.' },
      { when: v('w.c23_monday', 'hide'), text: 'Ружьё, которое вы спрятали от патруля в ноябре, до сих пор лежит под досками в сарае. Брандт о нём не знает. У карты тебе от этого неуютно.' },
      { when: v('w.c23_monday', 'shut'), text: 'Брандт помнит закрытые ворота в ноябре. К вашему двору он обращается последним.' },
      { when: brandtKnows49, text: '— Kiesgrube. Drei Spuren, alle von Süden. Heute Nacht null Grad, morgen Regen. Ab zehn steht da ein Posten. Freiwillige?\n\nКарьер. Три следа, все с юга. Ночью ноль, завтра дождь. С десяти там пост. Добровольцы?' },
      { when: not(brandtKnows49), text: 'Про карьер он не говорит ни слова. Значит, не знает.' },
      { when: silvester49('stay'), text: 'Тебя он замечает и кивает сухо: ваш двор ночью дома. Но на совет ты {m:пришёл|пришла}, и это он тоже замечает.' },
    ],
    actions: [
      { id: 'c49_mq_noise', label: 'Сказать вслух: огонь и колокол в полночь слышно на десять километров', minutes: 60, terminal: true, goto: 'c49_m_back', ambientDuring: mild49,
        text: 'Становится тихо. Брандт смотрит на тебя долго. «Das weiß ich. Und die Leute brauchen das Feuer trotzdem. Sonst kommen sie nicht durch den Winter». Это я знаю. А людям огонь всё равно нужен. Иначе они не переживут зиму. Кто-то сзади говорит: «Er hat recht». Непонятно, про кого.', effects: [set49('mq', 'noise'), w49('said_noise', true), d31(11, 45)] },
      { id: 'c49_mq_pit', label: 'Сказать про карьер всё, что видел{m:|а}', when: not(brandtKnows49), minutes: 60, terminal: true, goto: 'c49_m_back', ambientDuring: mild49,
        text: 'Брандт слушает, потом ставит на карте ещё один крест, у карьера, и обводит его дважды. «Gut, dass einer was sagt». Хорошо, что хоть кто-то что-то говорит. Добровольцев на карьер находится трое.', effects: [set49('mq', 'pit'), w49('brandt_knows', true), d31(11, 45)] },
      { id: 'c49_mq_hollow', label: 'Напомнить Брандту ноябрьскую облаву на впадине', when: all(v('w.c29_sweep', 'join'), not(brandtKnows49)), minutes: 60, terminal: true, goto: 'c49_m_back', ambientDuring: mild49,
        text: 'Брандт помнит впадину: в ноябре ваш двор ходил туда с его людьми. Он молчит, потом ставит крест у карьера. «Damals hat der Frost auch gehalten. Bis er nicht mehr gehalten hat». Тогда мороз тоже держал. Пока не перестал. С десяти у карьера будет пост.', effects: [set49('mq', 'hollow'), w49('brandt_knows', true), w49('brandt_hollow', true), d31(11, 45)] },
      { id: 'c49_mq_volunteer', label: 'Вызваться на пост у карьера', when: all(heavy, brandtKnows49), minutes: 60, terminal: true, goto: 'c49_m_back', ambientDuring: mild49,
        text: 'Ты поднимаешь руку. Брандт пишет твою фамилию рядом с крестом. «Ab zehn. Mit Fackel und Horn». С десяти. С факелом и рогом. Ещё двое поднимают руки после тебя, глядя в снег.', effects: [set49('mq', 'volunteer'), w49('pit_volunteer', true), d31(11, 45)] },
      { id: 'c49_mq_lukas', label: 'После совета отвести Брандта в сторону — про ракеты Лукаса', when: flag('w.c49_rockets_found'), minutes: 60, terminal: true, goto: 'c49_m_back', ambientDuring: mild49,
        text: 'Брандт выслушивает и вздыхает так, будто ракеты — его собственный сын. «Lukas. Natürlich Lukas». Лукас. Конечно, Лукас. Что он сделает, он не говорит. Но в блокноте появляется строчка.', effects: [set49('mq', 'lukas'), w49('brandt_rockets', true), d31(11, 45)] },
      { id: 'c49_mq_listen', label: 'Молчать и слушать, кто что говорит', minutes: 60, terminal: true, goto: 'c49_m_back', ambientDuring: mild49,
        text: 'Кто-то хочет музыку, кто-то не хочет огня, жена Брандта хочет, чтобы все пришли с мисками. Брандт выслушивает всех и не меняет ничего. Ты понимаешь, что он решил всё ещё в воскресенье.', effects: [set49('mq', 'listen'), d31(11, 45)] },
    ] }),

  S49({ id: 'c49_m_back', for: 'any', chapter: 'ch3', title: 'Дорога домой', location: 'c7_farm_lane', camp: trip49('c7_farm_lane'), ambient: mild49,
    text: [
      { text: 'Домой — по раскисшей дороге. Над полем низкие облака, пахнет мокрым снегом и дымом. Где-то в Йестебурге уже пробуют колокол: один удар, долгий.' },
      { text: 'На обочине у поворота сидит человек с санками и переобувается. Из Гамбурга, на юг. Он кивает, как старому знакомому.' },
    ],
    actions: [
      { id: 'c49_mb_talk', label: 'Остановиться и спросить, куда он идёт на ночь', minutes: 35, terminal: true, goto: 'c49_m_noon', ambientDuring: mild49,
        text: 'В Ханстедт, к брату. До темноты не успеет. Ты объясняешь, где пожарная часть и что там в восемь огонь и суп для всех. Он смеётся: «Silvester mit Fremden. Warum nicht». Сильвестр с чужими. Почему нет.', effects: [set49('mb', 'talk'), w49('stranger_fire', true), toFarm, d31(12, 20)] },
      { id: 'c49_mb_bread', label: 'Отдать ему берлинер из кармана', minutes: 35, terminal: true, goto: 'c49_m_noon', ambientDuring: mild49,
        text: 'Он берёт, смотрит на берлинер, как на чудо, и надкусывает. Горчица. Он кашляет, смеётся и доедает. «Glück für mich». Мне повезло.', effects: [set49('mb', 'bread'), toFarm, d31(12, 20)] },
      { id: 'c49_mb_quick', label: 'Кивнуть и идти дальше: дома ждут', minutes: 30, terminal: true, goto: 'c49_m_noon', ambientDuring: mild49,
        text: 'Ты киваешь в ответ и идёшь, не сбавляя шага. Оглядываешься у калитки: он всё ещё сидит на обочине и смотрит вслед.', effects: [set49('mb', 'quick'), toFarm, d31(12, 15)] },
    ] }),

  S49({ id: 'c49_m_noon', for: 'any', chapter: 'ch3', title: 'Полдень', camp: kitchen14,
    text: [
      { text: 'Дома последние сборы: фонари заправлены, у колокола новая верёвка, дети в третий раз спрашивают, сколько до полуночи.' },
      { when: alone49, text: 'На твоём месте за столом Хенрике оставила два берлинера. Второй — понятно для кого. Ты отодвигаешь его к пустому стулу.' },
      { when: partnerHurt49, text: '{partner} сидит у печки с ложкой и оловянной подковкой и пробует, плавится ли она над свечой. Плавится.' },
    ],
    actions: [
      { id: 'c49_mn_eat', label: 'Обедать со всеми', minutes: 40, terminal: true, goto: 'c49_checkpoint', ...tableOnly,
        text: 'Чечевичный суп: «für Geld im neuen Jahr», к деньгам в новом году, говорит Хенрике. Денег ни у кого нет, но суп съедают до дна.', effects: [set49('mn', 'eat'), meal('eat'), finish, d31(13, 0)] },
      { id: 'c49_mn_nap', label: 'Поспать час: ночь будет длинной', minutes: 40, terminal: true, goto: 'c49_checkpoint', activity: 'rest',
        text: 'Ты ложишься {m:одетым|одетой} поверх одеяла и засыпаешь, пока дети спорят за стеной. Просыпаешься оттого, что кто-то кладёт рядом тёплый берлинер.', effects: [set49('mn', 'nap'), { body: 'fatigue', delta: -10 }, ...fed49(15), finish, d31(13, 0)] },
      { id: 'c49_mn_torches', label: 'Проверить фонари и факелы на ночь', minutes: 40, terminal: true, goto: 'c49_checkpoint',
        text: 'Два фонаря, полные, фитили ровные. Шесть факелов в ведре с песком. Спички в двух местах, в жестянке. Ты проверяешь дважды. На третий раз смеёшься над собой и бросаешь.', effects: [set49('mn', 'torches'), w49('lamps_ready', true), ...fed49(15), finish, d31(13, 0)] },
      { id: 'c49_mn_hats', label: 'Клеить с детьми бумажные колпаки', minutes: 40, terminal: true, goto: 'c49_checkpoint',
        text: 'Колпаки из старых газет, клей из муки и воды. На каждом — имя, криво. На твоём дети пишут «Chef». Ты не споришь.', effects: [set49('mn', 'hats'), ...fed49(15), finish, d31(13, 0)] },
    ] }),

  S49({ id: 'c49_checkpoint', for: 'any', chapter: 'ch3', title: 'Тридцать первое', checkpoint: 49, universal: false, camp: house14,
    text: [{ text: 'Час дня. Тридцать первое декабря. До Нового года одиннадцать часов.' }], actions: [] }),
];
