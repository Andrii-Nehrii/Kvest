import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { tobias36 } from './point36';
import { merleFarm39 } from './point39';
import { leaLate } from './house28';

// Участок 40: понедельник 14.12, 06:00 → КТ40 среда 16.12, 07:00. КЛЮЧЕВАЯ: большая опасная сцена; ресурсы (еда); человек из прошлого.
// План — STOCK_PLAN.md §10.4. Воскресный совет — в начале, промоткой. Понедельник — склад казармы (кто едет — по КТ39) или хутор.
// Вторник, 05:00 — армия уходит (мел на борту последнего грузовика: «LETZTER 1512» — подсказка к находке A в 41-й). Днём оттепель,
// к ночи впадина на ногах. Ночь: A — снаружи (пост у Зеве или забор), B — дом и двор. У каждого цепочка из трёх звеньев, два
// предупреждения до тяжёлого; выбывание — только третье звено после двух ошибок. Укусов игрокам нет. Если на КТ39 решили уйти
// с армией — понедельник, вечер у Тобиаса, КТ40 в казарме, дальше заглушка.
export const P40: Cond = all({ cp: 39 }, not({ cp: 40 }));
export const A40: Cond = { me: 'A' };
export const B40: Cond = { me: 'B' };
export const farm40 = 'hof_luedemann';
export const lue40 = 'c18_lueneburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point40Available: Cond = all(P40, { at: farm40 }, { partnerAt: farm40 }, up, { partner: 'active' }, flag('w.c39_council'));
export const own40 = (key: string, value: string): Cond => v(`$.c40_${key}`, value);

export const armyGo40: Cond = all(v('w.c39_army', 'go'), tobias36);
/** На склад едет: оба (both) или A (one). */
export const depotMe40: Cond = any(v('w.c39_depot', 'both'), all(A40, v('w.c39_depot', 'one')));
export const strangers40: Cond = v('w.c39_strangers', 'barn');
export const merle40: Cond = merleFarm39;
export const henrike40: Cond = { npc: 'henrike', alive: true, at: farm40 };
export const watchSeeve40: Cond = not(v('w.c38_watch', 'no'));
export const torch40: Cond = any({ has: 'c39_crank_torch' }, { has: 'flashlight' }, { has: 'headlamp' });
export const flares40: Cond = { has: 'c38_flares' };
export const alarm40: Cond = any(v('w.c37_alarm', 'cans'), v('w.c37_alarm', 'bell'), flag('w.c38_second_wire'));
export const barnSafe40: Cond = flag('w.c39_barn_boarded');
export const fence40: Cond = flag('w.c39_fence_up');
export const guardAll40: Cond = any(v('w.c39_council', 'guard'), v('w.c39_council', 'brandt'));
/** Первое звено кончилось плохо — второе опаснее; второе плохо — третье ведёт к выбыванию. */
export const worse1: Cond = flag('$.c40_hurt1');
export const worse2: Cond = flag('$.c40_hurt2');

/** Оттепель: плюс три, дождь по снегу. Одетым по погоде — терпимо; вода — отдельно. */
export const thaw40 = { tempC: 2, outdoor: true, wet: false };
export const frost40 = { tempC: -2, outdoor: true, wet: false };
export const hall40 = { tempC: 11, outdoor: false, wet: false };
export const cab40 = { tempC: 4, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm40, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S40 = wrap(P40);
export const set40 = (key: string, value: string | boolean): Effect => ({ set: `$.c40_${key}`, value });
export const w40 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c40_${key}`, value });
/** День 44 — понедельник 14.12, 45 — вторник, 46 — среда. */
export const until40 = (d: 44 | 45 | 46, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare40: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed40: Effect[] = [{ body: 'hunger', delta: -35 }, { body: 'thirst', delta: -30 }];
/** Первое звено: терпимо. */
export const hurt1 = (what: 'wet' | 'bruise'): Effect[] => what === 'wet'
  ? [set40('hurt1', true), { body: 'stress', delta: 4 }, { body: 'fatigue', delta: 6 }]
  : [set40('hurt1', true), { injure: 'bruise', site: 'leftLeg', severity: 2 }, { body: 'stress', delta: 3 }];
/** Второе звено: тяжело, но на ногах. */
export const hurt2: Effect[] = [set40('hurt2', true), { injure: 'cut', site: 'leftArm', severity: 3, bleeding: 1 }, { body: 'bloodLoss', delta: 18 }, { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 6 }];
/** Третье звено: выбывание. Удар головой, кровь, холод. Выбывшего приносят в дом. Спасать — в 41-й. */
/** Выбывание: рана, кровь; кто принёс в дом, тот и перевязал наскоро, а Хенрике смотрит за лежачим, если вы оба не встали
 *  (иначе двойное выбывание в одну ночь кончалось бы смертью обоих по дороге к общей точке). */
export const down40: Effect[] = [{ injure: 'laceration', site: 'head', severity: 4, bleeding: 3 }, { body: 'bloodLoss', delta: 58 }, { body: 'stress', delta: 10 }, set40('down', true), w40('down', true), { move: farm40 }, { treat: 'basic' }, { set: '$.caredBy', value: 'henrike' }];
const finish: Effect = { set: '$.c40_finished', value: true };
const fromDawn = [{ id: 'd', when: depotMe40, goto: 'c40_d_road' }, { id: 'm', goto: 'c40_m_merle' }];
const fromTue = [{ id: 'a', when: A40, goto: 'c40_a_mud' }, { id: 'b', goto: 'c40_b_barn' }];
const fromNoon = [{ id: 'a', when: A40, goto: 'c40_a_ice' }, { id: 'b', goto: 'c40_b_neighbor' }];
const fromEve = [{ id: 'a', when: A40, goto: 'c40_a_n1' }, { id: 'b', goto: 'c40_b_n1' }];
const toArmy = [{ id: 'army', when: armyGo40, goto: 'c40_army' }, { id: 'n', goto: 'c40_mon_night' }];

export const shared40: Scene[] = [
  // ═════════════ Понедельник ═════════════
  S40({ id: 'c40_dawn', for: 'any', chapter: 'ch3', title: 'Понедельник', camp: kitchen14,
    text: [
      { text: 'Минус один. Ветер с запада, сырой, тяжёлый. На крыше сарая снег осел и потемнел. Хенрике растапливает плиту и говорит, что к ночи будет дождь.' },
      { when: v('w.c39_council', 'guard'), text: 'Вчера на совете в пожарной части решили: общая стража. Каждый двор — по очереди на ручьях, сигнал — колокол. Брандт сказал «gut» и больше ничего.' },
      { when: v('w.c39_council', 'brandt'), text: 'Вчера на совете Брандта выбрали старшим. Он поблагодарил и сразу раздал листы: кто где стоит ночью, кто за кем следит.' },
      { when: v('w.c39_council', 'yards'), text: 'Вчера совет разошёлся ни с чем: половина дворов за Брандта, половина каждый за себя. Колокол у пожарной части — общий. Остальное — как сумеете.' },
      { when: armyGo40, text: 'Сегодня вечером — к Тобиасу. Завтра в пять — ворота казармы. Рюкзаки стоят у двери. Хенрике на них не смотрит.' },
      { when: all(depotMe40, not(armyGo40)), text: 'Сегодня склад казармы. Брандт делит с двенадцати. Ехать двадцать пять километров в одну сторону.' },
    ],
    actions: [
      { id: 'c40_dw_eat', label: 'Позавтракать как следует', minutes: 45, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, хлеб, по яйцу. Хенрике кладёт тебе лишнюю ложку сала: день длинный.', effects: [set40('dw', 'eat'), meal('eat'), until40(44, 7, 0)] },
      { id: 'c40_dw_radio', label: 'Послушать радио: что говорит армия напоследок', minutes: 45, terminal: true, outcomes: fromDawn,
        text: 'Армейская частота говорит коротко: «Abzug planmäßig. Die Kommandantur dankt». Отход по плану. Комендатура благодарит. Потом шипение. Больше эта частота ничего не скажет.', effects: [set40('dw', 'radio'), { body: 'hunger', delta: -8 }, until40(44, 7, 0)] },
      { id: 'c40_dw_yard', label: 'Обойти двор, пока не рассвело', minutes: 45, terminal: true, outcomes: fromDawn, ambientDuring: thaw40,
        text: 'Фонарик, сапоги, проволока с банками. Всё на месте. На дороге за воротами следы шин: ночью проходила колонна. Ты возвращаешься в кухню, когда начинает сереть.', effects: [{ set: '$.c40_dw', value: 'yard' }, until40(44, 7, 0)] },
      { id: 'c40_dw_wake', label: 'Обойти дом и разбудить тех, кто ещё спит', minutes: 45, terminal: true, outcomes: fromDawn,
        text: 'Ты стучишь в двери, трогаешь плечи, ставишь чайник на плиту. Через десять минут в кухне все. Сонные лица, кружки, никто не говорит о ночи.', effects: [{ set: '$.c40_dw', value: 'wake' }, until40(44, 7, 0)] },
      { id: 'c40_dw_rules', label: 'Повторить с домом правила Хенрике на ночь', when: henrike40, minutes: 45, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Двери закрыть. Свет погасить. Один никто не выходит. Кто снаружи — заходит до темноты. Ты повторяешь вслух, и все кивают. Нина записывает в тетрадь.', effects: [set40('dw', 'rules'), w40('rules_known', true), meal('eat'), until40(44, 7, 0)] },
    ] }),

  S40({ id: 'c40_mon_evening', for: 'any', chapter: 'ch3', title: 'Последний вечер армии', camp: kitchen14, onEnter: [until40(44, 17, 30)],
    text: [
      { text: 'Вечер. Около нуля. С крыши течёт. Хенрике варит суп.' },
      { when: all(leaLate, v('w.c32_hannover', 'lists')), text: 'Лея перечитывает листок из Винзена про Лангенхаген. «Каждый второй вторник». Сегодня она уже дважды смотрела на календарь.' },
      { when: all(leaLate, v('w.c29_lea_road', 'spring')), text: 'Лея между делом спрашивает, правда ли вы пойдёте с ней весной до Целле. Слишком между делом.' },
      { when: all(leaLate, v('w.c29_lea_road', 'stay')), text: 'Лея раскладывает бинты по полке. Её рюкзак висит на гвозде пустой.' },
      { when: flag('w.c40_share'), text: 'Мешки со склада стоят в сенях. Хенрике обходит их кругом, считает и записывает в тетрадь, не говоря ни слова.' },
      { when: all(tobias36, not(armyGo40)), text: 'В семь у ворот «Вольф». Тобиас не выходит: опускает стекло и машет. «Morgen um fünf. Dann seid ihr dran». Завтра в пять. Дальше вы сами. Машина уезжает к Люнебургу.' },
      { when: armyGo40, text: 'В семь у ворот «Вольф». Тобиас выходит и ждёт у машины, не торопя. Пора.' },
    ],
    actions: [
      { id: 'c40_me_eat', label: 'Ужинать со всеми', when: not(armyGo40), minutes: 60, terminal: true, outcomes: toArmy, ...tableOnly,
        text: 'Суп, хлеб. Разговоры тихие. Завтра армии не будет. Никто не говорит, что это значит, но все об этом думают.', effects: [set40('me', 'eat'), meal('eat'), until40(44, 19, 30)] },
      { id: 'c40_me_count', label: 'Помочь Хенрике разложить привезённое по полкам', when: all(not(armyGo40), henrike40), minutes: 60, terminal: true, outcomes: toArmy,
        text: 'Мука — в ларь, банки — на полку в подвале, соль — в жестянку. Хенрике пишет. В конце говорит: «Bis Februar. Wenn keiner mehr kommt». До февраля. Если больше никто не придёт.', effects: [set40('me', 'count'), npc('henrike', 1), meal('eat'), until40(44, 19, 30)] },
      { id: 'c40_me_window', label: 'Посидеть у окна: последний вечер армии по соседству', when: not(armyGo40), minutes: 60, terminal: true, outcomes: toArmy,
        text: 'На дороге к Люнебургу — огни: колонны идут всю ночь. Где-то там Тобиас грузит свои ящики. Ты смотришь, пока огни не начинают сливаться.', effects: [{ set: '$.c40_me', value: 'window' }, until40(44, 19, 30)] },
      { id: 'c40_me_letters', label: 'Написать пару строк Тобиасу: передать утром у ворот казармы', when: not(armyGo40), minutes: 60, terminal: true, outcomes: toArmy,
        text: 'Карандаш, листок из тетради. Спасибо за склад, за предупреждения, за то, что был человеком. Сложить вчетверо, в карман куртки.', effects: [{ set: '$.c40_me', value: 'letters' }, until40(44, 19, 30)] },
      { id: 'c40_me_go', label: 'Сесть к Тобиасу в машину', when: armyGo40, minutes: 60, terminal: true, outcomes: toArmy,
        text: 'Хенрике обнимает вас у ворот, по очереди, и уходит в дом, не оглядываясь. Нина стоит в окне. «Вольф» трогается.', effects: [set40('me', 'go'), w40('left_army', true), until40(44, 19, 30)] },
    ] }),

  S40({ id: 'c40_mon_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14,
    text: [
      { text: 'Ночь на вторник. С крыши течёт непрерывно. Снег за окном серый. Где-то на насыпи кричит сова.' },
    ],
    actions: [
      { id: 'c40_mn_sleep', label: 'Спать', minutes: 30, terminal: true, goto: 'c40_tue',
        text: 'Ты засыпаешь под капель. Просыпаешься от гула моторов: ещё темно.', effects: [set40('mn', 'sleep'), until40(45, 4, 45, true)] },
      { id: 'c40_mn_talk', label: 'Поговорить с {partner.ins} о завтрашней ночи', minutes: 45, terminal: true, goto: 'c40_tue',
        text: 'Кто где будет стоять, кто кого зовёт, где фонарь, где ракеты. Вы договариваетесь шёпотом. Потом засыпаете. Будит гул моторов.', effects: [set40('mn', 'talk'), w40('plan_night', true), until40(45, 4, 45, true)] },
      { id: 'c40_mn_kit', label: 'Собрать у кровати всё на завтрашнюю ночь', minutes: 45, terminal: true, goto: 'c40_tue',
        text: 'Фонарь, сапоги, куртка, нож, ракета, если есть. Всё у кровати, в том порядке, в каком будешь хватать в темноте. Только после этого ложишься.', effects: [set40('mn', 'kit'), until40(45, 4, 45, true)] },
    ] }),

  // ═════════════ Вторник ═════════════
  S40({ id: 'c40_tue', for: 'any', chapter: 'ch3', title: 'Армия уходит', camp: yard14, ambient: thaw40,
    text: [
      { text: 'Без пятнадцати пять. По дороге на север идёт колонна: фары, рёв, брызги из-под колёс. Снег на обочинах превратился в кашу. Моросит.' },
      { text: 'Последний грузовик проходит мимо ворот медленно. На брезенте мелом, крупно: «LETZTER — 1512». Последний. Пятнадцатое двенадцатого. Солдат в кузове машет рукой.' },
      { text: 'Потом тишина. Только капли с крыши и шорох дождя по снегу. Плюс два.' },
    ],
    actions: [
      { id: 'c40_tu_wave', label: 'Помахать в ответ', minutes: 30, terminal: true, outcomes: fromTue, ambientDuring: thaw40,
        text: 'Ты машешь, пока красные огни не пропадают за лесом. Потом стоишь ещё минуту. Хенрике выходит на крыльцо в накинутом пальто и говорит: «So. Jetzt wir». Так. Теперь мы.', effects: [set40('tu', 'wave'), until40(45, 6, 0)] },
      { id: 'c40_tu_count', label: 'Пересчитать машины: вдруг кто-то отстал', minutes: 30, terminal: true, outcomes: fromTue, ambientDuring: thaw40,
        text: 'Тридцать восемь. Последняя с мелом на брезенте. Никто не отстал. Ты записываешь цифру на ладони, сам{m:|а} не зная зачем.', effects: [set40('tu', 'count'), until40(45, 6, 0)] },
      { id: 'c40_tu_back', label: 'Не смотреть: в дом, к печке', minutes: 20, terminal: true, outcomes: fromTue,
        text: 'Ты закрываешь дверь, не дожидаясь последней машины. Гул слышен ещё долго. Потом нет.', effects: [set40('tu', 'back'), until40(45, 6, 0)] },
    ] }),

  S40({ id: 'c40_tue_noon', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14, onEnter: [until40(45, 12, 0)],
    text: [
      { text: 'Обед. Дождь не перестаёт. По двору течёт ручей, вода стоит в колеях. Плюс четыре.' },
      { text: 'Лукас забегает на минуту, мокрый до нитки: с насыпи видно, что во впадине у Гарльсторфа шевелится. Не всё. Но шевелится.' },
    ],
    actions: [
      { id: 'c40_tn_eat', label: 'Есть и слушать Лукаса', minutes: 45, terminal: true, outcomes: fromNoon, ...tableOnly,
        text: 'Лукас рассказывает быстро: снег во впадине сошёл, лёд на ручье трещит, Брандт велел всем дворам звонить, если что. Ты ешь и не чувствуешь вкуса.', effects: [set40('tn', 'eat'), meal('eat'), w40('warned_lukas', true), until40(45, 13, 0)] },
      { id: 'c40_tn_ask', label: 'Спросить Лукаса: сколько их там', minutes: 45, terminal: true, outcomes: fromNoon,
        text: '— Weiß nicht. Viele. Sie liegen noch. Aber sie liegen nicht mehr still.\n\nНе знаю. Много. Ещё лежат. Но уже не спокойно.\n\nОн уходит, не допив чай.', effects: [set40('tn', 'ask'), w40('warned_lukas', true), { body: 'hunger', delta: -10 }, until40(45, 13, 0)] },
      { id: 'c40_tn_window', label: 'Смотреть из окна, как вода заливает двор', minutes: 45, terminal: true, outcomes: fromNoon,
        text: 'Вода стоит у крыльца, в ней плавает солома. С поля тянет сыростью. Ты отмечаешь мелом на столбе ворот, докуда дошло. Через полчаса вода выше метки.', effects: [{ set: '$.c40_tn', value: 'window' }, until40(45, 13, 0)] },
      { id: 'c40_tn_boots', label: 'Сменить мокрые носки и просушить сапоги у плиты', minutes: 45, terminal: true, outcomes: fromNoon,
        text: 'Носки на верёвку над плитой, сапоги носками к огню, в каждый — комок газеты. Через час ноги сухие. Это тоже подготовка.', effects: [{ set: '$.c40_tn', value: 'boots' }, until40(45, 13, 0)] },
    ] }),

  S40({ id: 'c40_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: thaw40, onEnter: [until40(45, 16, 0)],
    text: [
      { text: 'Четыре часа, а уже темно. Дождь сильнее, ветер рвёт ставни. На Зеве лёд ломается с глухим грохотом, как будто кто-то роняет мебель.' },
      { text: 'У пожарной части в Йестебурге бьёт колокол: три удара. Пробный. Брандт проверяет, слышно ли.' },
      { when: henrike40, text: 'Хенрике обходит двор с лампой: курятник, сарай, хлев. Закрывает всё, что закрывается. Потом встаёт в дверях кухни: «Ab jetzt keiner allein». С этой минуты — никто один.' },
    ],
    actions: [
      { id: 'c40_du_help', label: 'Обойти двор вместе с Хенрике', minutes: 45, terminal: true, goto: 'c40_eve', ambientDuring: thaw40,
        text: 'Засов на хлеву, щеколда на курятнике, ворота на цепь. Ты держишь лампу, Хенрике проверяет. В конце она говорит: «Gut. Mehr können wir nicht». Больше мы ничего не можем.', effects: [set40('du', 'help'), w40('yard_closed', true), until40(45, 17, 0)] },
      { id: 'c40_du_listen', label: 'Постоять у ворот и послушать ручей', minutes: 30, terminal: true, goto: 'c40_eve', ambientDuring: thaw40,
        text: 'Грохот льда, шум воды, дождь. И что-то ещё, далеко, ниже по течению: всплеск, другой. Может, льдина. Может, нет.', effects: [set40('du', 'listen'), w40('heard_splash', true), until40(45, 17, 0)] },
      { id: 'c40_du_in', label: 'В дом: просушить одежду к ночи', minutes: 45, terminal: true, goto: 'c40_eve',
        text: 'Ты развешиваешь у печи всё, что намокло днём, и переодеваешься в сухое. К ночи сухая одежда — это половина дела.', effects: [set40('du', 'in'), set40('dry', true), until40(45, 17, 0)] },
    ] }),

  S40({ id: 'c40_eve', for: 'any', chapter: 'ch3', title: 'Ужин без армии', camp: kitchen14, onEnter: [until40(45, 17, 30)],
    text: [
      { text: 'Ужин рано, при одной лампе. Ставни закрыты. Дождь стучит по стеклу. Все за столом говорят тише обычного.' },
      { when: flag('w.c40_army_back'), text: 'Утром вы были у моста через Эльбу. Теперь — за этим столом, и рюкзаки стоят у двери нераспакованные, как в понедельник.' },
      { when: watchSeeve40, text: 'Сегодня ночь вашего двора у Зеве. С восьми.' },
      { when: strangers40, text: 'Йорг с детьми ужинает с вами. Девочке лучше: жар спал. Йорг говорит, что ночью будет спать в сарае с топором.' },
      { when: merle40, text: 'Мерле колет вечернюю дозу и прячет ручку в нагрудный карман. «Falls wir rennen müssen». На случай, если придётся бежать.' },
    ],
    actions: [
      { id: 'c40_ev_eat', label: 'Поесть горячего: ночь будет длинной', minutes: 60, terminal: true, outcomes: fromEve, ...tableOnly,
        text: 'Суп, хлеб, чай с сахаром. Хенрике следит, чтобы ты доел{m:|а}. Сытый человек меньше мёрзнет.', effects: [set40('ev', 'eat'), meal('eat'), set40('fed', true), until40(45, 19, 30)] },
      { id: 'c40_ev_plan', label: 'Договориться за столом: кто где ночью, какой сигнал', minutes: 60, terminal: true, outcomes: fromEve, ...tableOnly,
        text: 'Кто у окна, кто у двери, кто с детьми. Один удар по кастрюле — проснуться, два — все в кухню. Даже Нина повторяет без ошибок.', effects: [set40('ev', 'plan'), meal('eat'), w40('house_plan', true), until40(45, 19, 30)] },
      { id: 'c40_ev_quick', label: 'Перекусить стоя и собираться', minutes: 40, terminal: true, outcomes: fromEve,
        text: 'Хлеб, сало, кружка чая. Ты собираешься, пока другие едят.', effects: [set40('ev', 'quick'), { body: 'hunger', delta: -15 }, until40(45, 19, 30)] },
      { id: 'c40_ev_gear', label: 'Проверить фонарь, батарейки и сапоги', minutes: 40, terminal: true, outcomes: fromEve,
        text: 'Фонарь горит. Запасные батарейки — в нагрудный карман. Сапоги сухие изнутри, носки вторые. Ты не знаешь, что пригодится ночью, и берёшь всё.', effects: [{ set: '$.c40_ev', value: 'gear' }, until40(45, 19, 30)] },
      { id: 'c40_ev_kids', label: 'Уложить детей пораньше и посидеть с ними', minutes: 40, terminal: true, outcomes: fromEve,
        text: 'Дети спорят, что ещё рано. Ты не споришь в ответ, а сидишь на краю кровати, пока младшая не засыпает. Старшие делают вид, что спят.', effects: [{ set: '$.c40_ev', value: 'kids' }, until40(45, 19, 30)] },
    ] }),

  S40({ id: 'c40_night_end', for: 'any', chapter: 'ch3', title: 'Рассвет', camp: kitchen14, onEnter: [until40(46, 5, 0)],
    text: [
      { text: 'Пять утра. Дождь стих. Над полем серый туман. С насыпи видно: у ручья, на лугах, лежат тела. Те, кто дошёл до дворов, и те, кого остановили.' },
      { when: flag('w.c40_down'), text: 'В кухне на столе — тот, кого принесли ночью. Хенрике греет воду и молча раскладывает чистые полотенца.' },
      { when: v('w.c40_cow', 'lost'), text: 'Корова мертва. Хлев открыт настежь, внутри темно. Хенрике стоит в дверях хлева и не входит.' },
      { when: v('w.c40_neighbor', 'dead'), text: 'Со стороны насыпи идёт Лукас. По его лицу всё понятно раньше, чем он говорит: старика Ханзена не успели.' },
      { when: v('w.c40_strangers_kid', 'safe'), text: 'Дети Йорга спят в кухне на лавке, под одним одеялом. Йорг сидит рядом с топором на коленях и не спит.' },
    ],
    actions: [
      { id: 'c40_ne_sit', label: 'Сесть у печи', minutes: 30, terminal: true, goto: 'c40_checkpoint',
        text: 'Тепло. Руки отходят с болью. Ты сидишь и смотришь в огонь. Ночь кончилась.', effects: [set40('ne', 'sit'), finish, until40(46, 6, 30)] },
      { id: 'c40_ne_count', label: 'Пересчитать всех', minutes: 30, terminal: true, goto: 'c40_checkpoint',
        text: 'Хенрике. Нина. Остальные, по одному. Кто спит, кто сидит у печи. Ты считаешь по головам. Потом ещё раз.', effects: [set40('ne', 'count'), finish, until40(46, 6, 30)] },
      { id: 'c40_ne_out', label: 'Выйти посмотреть на двор', minutes: 30, terminal: true, goto: 'c40_checkpoint', ambientDuring: thaw40,
        text: 'Грязь, вода, следы. Сломанная проволока с банками. Ворота целы. Ты стоишь посреди двора, пока не начинают дрожать колени.', effects: [set40('ne', 'out'), finish, until40(46, 6, 30)] },
    ] }),

  S40({ id: 'c40_checkpoint', for: 'any', chapter: 'ch3', title: 'Среда, утро', checkpoint: 40, universal: false, camp: house14,
    text: [{ text: 'Семь утра. Первая ночь без армии кончилась.' }], actions: [] }),

  // ═════════════ Ветка ухода с армией ═════════════
  S40({ id: 'c40_army', for: 'any', chapter: 'ch3', title: 'Казарма', location: lue40, camp: { at: lue40, stock: 'c3_farm_stock', rest: 'sleep' }, ambient: hall40,
    text: [
      { text: 'Казарма в Люнебурге, ночь. Пустые коридоры, раскладушки в спортзале для тех, кого армия берёт с собой. Человек сорок: медсёстры, механики, их семьи.' },
      { text: 'Тобиас приносит вам два одеяла и садится рядом. «Um vier wecke ich euch. Um fünf sind wir weg». В четыре разбужу. В пять нас здесь нет.' },
    ],
    actions: [
      { id: 'c40_ar_sleep', label: 'Попробовать уснуть', minutes: 30, terminal: true, goto: 'c40_am_convoy',
        text: 'Ты лежишь и слушаешь, как дышат сорок человек. Под утро засыпаешь.', effects: [set40('ar', 'sleep'), until40(45, 4, 0, true)] },
      { id: 'c40_ar_talk', label: 'Говорить с Тобиасом до утра', minutes: 30, terminal: true, goto: 'c40_am_convoy',
        text: 'Тобиас рассказывает про Мёльн, про то, что будет за рекой. Ничего хорошего, ничего страшного. Просто другое. Около трёх он замолкает на полуслове: уснул сидя.', effects: [set40('ar', 'talk'), npc('c15_tobias', 1), { body: 'fatigue', delta: 4 }, until40(45, 4, 0)] },
    ] }),

];
