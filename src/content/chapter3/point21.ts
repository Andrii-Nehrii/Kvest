import type { NpcDef, Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { colonyGone, evaHere, npc, tableOnly, uteHere } from './point19';

// Участок 21: пятница 20.11, после КТ20 → КТ21 суббота 21.11, 07:30. План — docs/hidden/STOCK_PLAN.md §7.
// Три входа сходятся к одному утру на хуторе: колонна у Гарльсторфа (C), вечер дома (F), спасение партнёра (R).
export const P21: Cond = all({ cp: 20 }, not({ cp: 21 }));
export const A21: Cond = { me: 'A' };
export const B21: Cond = { me: 'B' };
const farm = 'hof_luedemann';
export const convoy = 'c21_convoy';
export const lue21 = 'c18_lueneburg';
/** Линия пары после КТ18: хозяева в Люнебурге, колонии нет, Нина на хуторе. Остальное — запасной экран. */
export const canon21: Cond = all(v('w.c18_henrike', 'stays'), colonyGone, not(uteHere), ninaFarm);
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const partnerUp: Cond = { partner: 'active' };
export const partnerDown: Cond = { partner: 'incapacitated' };
const played20: Cond = any(flag('A.c20_finished'), flag('B.c20_finished'));
/** У колонны: оба на ногах, приехали на своей машине. */
export const stageC: Cond = all(P21, canon21, played20, v('w.c20_convoy', 'go'), { at: convoy }, { partnerAt: convoy }, up, partnerUp);
/** Вечер на хуторе: оба на ногах (остались или вернулись из Люнебурга в объезд). */
export const stageF: Cond = all(P21, canon21, played20, { at: farm }, { partnerAt: farm }, up, partnerUp);
/** Спасение: партнёр без сознания, ты на ногах. */
export const stageR: Cond = all(P21, canon21, played20, { at: farm }, { partnerAt: farm }, up, partnerDown);
/** Остались в Люнебурге: оба на ногах или один без сознания. */
export const stageL: Cond = all(P21, canon21, played20, { at: lue21 }, { partnerAt: lue21 }, up);
export const point21Available: Cond = any(stageC, stageF, stageR, stageL);
/** Спасающий на хуторе: он же читает сцены кухни с гостьей. */
export const rescuer: Cond = flag('$.c21_rescuer');
/** Партнёра выхаживали этой ночью (на хуторе или в Люнебурге). */
export const nursed: Cond = flag('$.c21_nursed');
/** Из Люнебурга ехали в пятницу (к колонне или домой в объезд). */
export const fromLue: Cond = v('w.c19_trip', 'go');
export const own21 = (key: string, value: string): Cond => v(`$.c21_${key}`, value);

export const dusk21 = { tempC: 3, outdoor: true, wet: false };
export const night21 = { tempC: -1, outdoor: true, wet: false };
export const car21 = { tempC: 12, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? farm, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S21 = wrap(P21);
export const set21 = (key: string, value: string | boolean): Effect => ({ set: `$.c21_${key}`, value });
export const w21 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c21_${key}`, value });
export const until21 = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare21: Effect = { camp: { kind: 'prepare', quiet: true } };
/** Знакомство с Леей и Мальте на своей линии: карточка в «Людях», оба — на хуторе. */
export const meetLea: Effect[] = [{ introduceNpc: 'c21_lea' }, { set: '$.met.c21_lea', value: true }];
export const meetMalte: Effect[] = [{ introduceNpc: 'c21_malte' }, { set: '$.met.c21_malte', value: true }];
/** Оба гостя уже под крышей хутора. */
export const guestsHome: Effect[] = [...meetLea, ...meetMalte, { npc: 'c21_lea', moveTo: farm }, { npc: 'c21_malte', moveTo: farm }];
export const lea = (trust: number, remember?: string): Effect => npc('c21_lea', trust, remember);
export const malte = (trust: number, remember?: string): Effect => npc('c21_malte', trust, remember);
/** Игрок сам понял или услышал, кто она: замена для Оле. */
export const knowsLea: Cond = any(flag('$.c21_lea_known'), flag('w.c19_lea_name'), flag('w.c20_lea_name'), flag('w.c20_lea_known'));
/** Кто встречает у ворот, если вечером пары не было. */
export const ninaInCharge: Cond = any(v('w.c20_in_charge', 'nina'), not(evaHere));
const smokeKey: Cond = v('w.c18_smoke', 'key');
const finish: Effect = { set: '$.c21_finished', value: true };

export const npcs21: Record<string, NpcDef> = {
  c21_lea: {
    id: 'c21_lea', name: 'Лея', introducedByStory: true,
    intro: 'Девушка в армейской парке с повязкой Красного Креста. Перевязывала раненых с колонны. Руки у неё точные.',
    hidden: { goals: ['Не попасть на донорскую койку', 'Вернуться в Ганновер за матерью и братом'], fears: ['Что узнают правду', 'Что её укусят'],
      secrets: ['Она не болела: в октябре лежала с лептоспирозом, переболевшей её записал штабной врач', 'Её плазма не действует'] },
    initial: { alive: true, location: convoy, status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
  c21_malte: {
    id: 'c21_malte', name: 'Мальте', introducedByStory: true,
    intro: 'Шофёр колонны из Ганновера, резервист из Целле. Сломана голень. Когда больно, говорит без остановки.',
    hidden: { goals: ['Не попасть под суд за потерянного донора', 'Добраться до семьи в Целле'], fears: ['Что ногу отнимут'],
      secrets: ['Знает, что колонна была не помощью, а остатком', 'В кармане лист накладной с припиской штабсарцта'] },
    initial: { alive: true, location: convoy, status: 'injured', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
};

const afterGate = 'c21_h_supper';
const withLea: Cond = any(B21, rescuer);
const withMalte: Cond = all(A21, not(rescuer));
const afterRoom = [{ id: 'r', when: rescuer, goto: 'c21_r_night' }, { id: 'p', goto: 'c21_h_alone' }];

// ───────────── Общая ночь дома и утро субботы ─────────────
export const shared21: Scene[] = [
  S21({ id: 'c21_h_gate', for: 'any', chapter: 'ch3', title: 'Девять вечера', camp: yard14, ambient: night21, onEnter: guestsHome,
    text: [
      { text: 'Фары выхватывают ворота хутора. В окне кухни горит свет.' },
      { when: ninaInCharge, text: 'Нина выходит с фонарём раньше, чем глохнет мотор. Она светит в машину, видит чужих на заднем сиденье и молча отодвигает засов.' },
      { when: not(ninaInCharge), text: 'Эва выходит на крыльцо с фонарём и кочергой. Кочергу она опускает, когда узнаёт машину. Нина отодвигает засов.' },
      { text: 'Мальте на заднем сиденье дышит сквозь зубы. Девушка в армейской парке держит его ногу на коленях и не выпускает сумку-холодильник, зажатую между ступнями.\n\n— Ist das euer Hof? — спрашивает она.\n\nЭто ваш двор?' },
    ],
    actions: [
      { id: 'c21_hg_carry', label: 'Вынести Мальте на руках', when: A21, minutes: 15, activity: 'heavy', terminal: true, goto: afterGate,
        text: 'Ты подсовываешь руки ему под спину и под колени. Он тяжелее, чем выглядит, и на каждом твоём шаге говорит: «Scheiße». На кухне ты опускаешь его на лавку у печи. Спина у тебя мокрая.', effects: [set21('hg', 'carry'), { body: 'fatigue', delta: 6 }, malte(1), until21(20, 21, 25)] },
      { id: 'c21_hg_stretcher', label: 'Принести из сеней носилки', when: all(A21, flag('w.c20_stretcher')), minutes: 15, activity: 'moderate', terminal: true, goto: afterGate,
        text: 'Две жерди и мешки из-под картошки. Утром ты {m:надеялся|надеялась}, что они не пригодятся. Нина берётся за задние концы и несёт, закусив губу. Мальте на носилках в первый раз за вечер замолкает.', effects: [set21('hg', 'stretcher'), malte(2), npc('c7_nina', 1), until21(20, 21, 25)] },
      { id: 'c21_hg_ask', label: 'Сначала спросить Нину, что было без вас', when: A21, minutes: 20, activity: 'moderate', terminal: true, goto: afterGate,
        text: '— Ничего, — говорит Нина. — В семь по полю шли двое. Мимо. Я свет не зажигала, пока не услышала вашу машину.\n\nПотом вы вдвоём выносите Мальте. Она держит его ноги так осторожно, будто они стеклянные.', effects: [set21('hg', 'ask'), { body: 'fatigue', delta: 4 }, npc('c7_nina', 2), until21(20, 21, 25)] },
      { id: 'c21_hg_lea', label: 'Провести её в дом через кухню', when: B21, minutes: 15, terminal: true, goto: afterGate,
        text: 'В сенях она останавливается и смотрит на крючки с куртками, на сапоги в ряд, на детский рюкзак Нины. Потом снимает парку. Под ней гражданский свитер, слишком тонкий для ноября.\n\n— Ihr seid viele, — говорит она. Вас много.', effects: [set21('hg', 'lea'), lea(1), until21(20, 21, 25)] },
      { id: 'c21_hg_bag', label: 'Сначала отнести её сумку в холодную кладовку', when: B21, minutes: 15, terminal: true, goto: afterGate,
        text: 'Она отдаёт сумку не сразу. Идёт за тобой до кладовки, сама ставит её на каменный пол, в самый тёмный угол, и трогает стену ладонью.\n\n— Gut. Kalt genug.\n\nХорошо. Достаточно холодно.', effects: [set21('hg', 'bag'), lea(2), until21(20, 21, 25)] },
      { id: 'c21_hg_eva', label: 'Попросить Эву согреть воды и найти чистые простыни', when: all(B21, evaHere), minutes: 15, terminal: true, goto: afterGate,
        text: 'Эва не задаёт вопросов. Через пять минут на плите стоит выварка, а на столе лежит стопка простыней из шкафа Хенрике.\n\n— Für das Bein, — говорит она. Для ноги. И рвёт верхнюю простыню на полосы, не дожидаясь разрешения.', effects: [set21('hg', 'eva'), npc('c8_eva', 2), until21(20, 21, 25)] },
    ] }),

  S21({ id: 'c21_h_supper', for: 'any', chapter: 'ch3', title: 'Поздний ужин', camp: kitchen14,
    text: [
      { text: 'На плите с вечера стоит картошка под крышкой. Мальте лежит на лавке у печи, нога на свёрнутом одеяле. Девушка ест стоя, у окна, и после каждой ложки смотрит на дверь.' },
      { when: evaHere, text: 'Эва подкладывает ей вторую порцию молча, как подкладывают своим.' },
    ],
    actions: [
      { id: 'c21_hs_eat', label: 'Поесть горячего', minutes: 20, terminal: true, goto: 'c21_h_room', ...tableOnly,
        text: 'Картошка с луком, тёплая. Только теперь ты замечаешь, что руки у тебя пахнут соляркой и чужой кровью.', effects: [set21('hs', 'eat'), meal('eat'), until21(20, 21, 55)] },
      { id: 'c21_hs_pack', label: 'Отдать свою порцию Мальте', minutes: 10, terminal: true, goto: 'c21_h_room', ...tableOnly,
        text: 'Мальте ест лёжа, с ложки, и между ложками рассказывает про жену в Целле, которая готовит картошку точно так же, только с тмином.', effects: [set21('hs', 'gave'), { camp: { kind: 'meal', mode: 'give', communal: true } }, malte(2), until21(20, 21, 55)] },
      { id: 'c21_hs_tea', label: 'Только чай: кусок не лезет', minutes: 10, terminal: true, goto: 'c21_h_room',
        text: 'Ты пьёшь чай у плиты. В животе пусто и тяжело сразу.', effects: [set21('hs', 'tea'), until21(20, 21, 55)] },
    ] }),

  S21({ id: 'c21_h_room', for: 'any', chapter: 'ch3', title: 'Кому где спать', camp: house14,
    text: [
      { when: withLea, text: 'Девушка стоит посреди кухни с сумкой в руке и ждёт, куда её поведут. Нина смотрит на неё с лестницы.\n\n— Wo soll ich hin? — спрашивает она тебя. Куда мне?' },
      { when: all(withLea, smokeKey), text: 'В доме есть швейная комната рядом с вашей, сеновал над хлевом и коптильня на чердаке, которая запирается на ключ.' },
      { when: all(withLea, not(smokeKey)), text: 'В доме есть швейная комната рядом с вашей и сеновал над хлевом.' },
      { when: withMalte, text: '{B} уводит девушку наверх. Ты остаёшься на кухне с Мальте. Он лежит с открытыми глазами и смотрит в потолок.' },
    ],
    actions: [
      { id: 'c21_hr_sewing', label: 'Постелить ей в швейной комнате, за стеной', when: withLea, minutes: 15, terminal: true, outcomes: afterRoom,
        text: 'Ты стелешь на диване простыню и даёшь ей кофту Хенрике. Она садится на край, как садятся в приёмной.\n\n— Ich bin Lea, — говорит она вдруг. — Das darfst du wissen. Sonst niemand in Uniform.\n\nЯ Лея. Тебе можно знать. Людям в форме — нет.', effects: [set21('hr', 'sewing'), w21('lea_bed', 'sewing'), set21('lea_known', true), lea(3), until21(20, 22, 20)] },
      { id: 'c21_hr_loft', label: 'Отвести её на сеновал: подальше от окон на дорогу', when: withLea, minutes: 20, terminal: true, outcomes: afterRoom, ambientDuring: night21,
        text: 'На сеновале пахнет пылью и холодным сеном. Ты оставляешь ей два одеяла и фонарь. Она сразу гасит его.\n\n— Besser so. Ich bin Lea. Sag es keinem in Uniform.\n\nТак лучше. Я Лея. Не говори никому в форме.', effects: [set21('hr', 'loft'), w21('lea_bed', 'loft'), set21('lea_known', true), lea(1), until21(20, 22, 20)] },
      { id: 'c21_hr_smoke', label: 'Запереть её на ночь в коптильне, для её же спокойствия', when: all(withLea, smokeKey), minutes: 20, terminal: true, outcomes: afterRoom,
        text: 'Она смотрит на ключ в твоей руке, потом на железную дверцу.\n\n— Wie ein Schinken, — говорит она без улыбки. Как окорок.\n\nОна входит сама. Ключ поворачивается туго. Из-за дверцы она называет своё имя: Лея. И просит не говорить его людям в форме.', effects: [set21('hr', 'smoke'), w21('lea_bed', 'smoke'), set21('lea_known', true), lea(-2, 'c21_locked_me'), until21(20, 22, 20)] },
      { id: 'c21_hr_pill', label: 'Дать Мальте таблетку и устроить его у печи', when: withMalte, minutes: 15, terminal: true, goto: 'c21_h_alone',
        outcomes: [
          { id: 'pill', when: { has: 'ibuprofen' }, text: 'Он глотает таблетку без воды и долго держит твою руку.\n\n— Wenn die mich fragen, wo sie ist, — говорит он тихо, — was sag ich dann?\n\nЕсли они спросят меня, где она, что мне сказать?\n\nТы не сразу понимаешь, о ком он.', effects: [set21('hr', 'pill'), { take: 'ibuprofen' }, malte(3)] },
          { id: 'none', text: 'Таблеток у тебя нет. Ты подкладываешь ему под ногу вторую подушку и подбрасываешь в печь полено.\n\n— Wenn die mich fragen, wo sie ist, — говорит он тихо, — was sag ich dann?\n\nЕсли они спросят меня, где она, что мне сказать?', effects: [set21('hr', 'pill'), malte(1)] },
        ], effects: [until21(20, 22, 20)] },
      { id: 'c21_hr_who', label: 'Спросить Мальте, кто она такая', when: withMalte, minutes: 15, terminal: true, goto: 'c21_h_alone',
        text: 'Мальте смотрит на лестницу и понижает голос.\n\n— Sanitäterin? Nee. Das ist die Spenderin. Wegen der sind wir überhaupt gefahren. Drei Laster für ein Mädchen.\n\nСанитарка? Нет. Это донор. Из-за неё мы вообще ехали. Три грузовика ради одной девчонки.\n\nОн закрывает глаза.\n\n— Und ich hab sie verloren. Auf dem Papier.\n\nИ я её потерял. По бумагам.', effects: [set21('hr', 'who'), set21('lea_known', true), set21('malte_told', true), malte(1), until21(20, 22, 20)] },
      { id: 'c21_hr_lock', label: 'Запереть ворота и обойти двор', when: withMalte, minutes: 20, terminal: true, goto: 'c21_h_alone', ambientDuring: night21,
        text: 'Засов, цепь, задняя калитка. На востоке, над лесом, небо всё ещё чуть светлее, чем должно быть. По дороге на Йестебург ползут две пары фар, медленно, с остановками у каждого двора.', effects: [set21('hr', 'lock'), set21('saw_search', true), until21(20, 22, 20)] },
    ] }),

  S21({ id: 'c21_h_alone', for: 'any', chapter: 'ch3', title: 'Вдвоём', camp: house14,
    text: [
      { text: 'Половина одиннадцатого. Дом затихает. Вы сидите на лестнице, на третьей ступеньке, там, где обычно сидит Нина.' },
      { when: A21, text: '{B} держит кружку обеими руками и смотрит наверх, туда, где легла гостья.' },
      { when: B21, text: '{A} трёт ладони о колени. На правом рукаве у него тёмное пятно, уже подсохшее.' },
      { when: all(A21, v('$.c21_fp', 'off')), text: 'Телефон лежит выключенным в кармане куртки. Керем ждёт ответа и не дождётся.' },
    ],
    actions: [
      { id: 'c21_ha_tell', label: 'Рассказать свой вечер с начала', minutes: 20, terminal: true, goto: 'c21_h_night',
        text: 'Ты рассказываешь по порядку. Вслух всё оказывается короче, чем было. {partner} слушает и один раз трогает тебя за колено.', effects: [set21('ha', 'tell'), { body: 'stress', delta: -3 }, until21(20, 22, 45)] },
      { id: 'c21_ha_ask', label: 'Спросить, что {pm:он|она} думает про гостью', minutes: 15, terminal: true, goto: 'c21_h_night',
        outcomes: [
          { id: 'a', when: A21, text: '— Она боится, — говорит {B}. — Только я не пойму, чего. Не их. Чего-то другого.\n\nНаверху скрипит половица и замирает.', effects: [set21('ha', 'ask')] },
          { id: 'b', text: '— Её ищут, — говорит {A}. — Всерьёз. Если найдут у нас, спросят с нас.\n\nОн говорит это ровно, как говорят о погоде.', effects: [set21('ha', 'ask')] },
        ], effects: [until21(20, 22, 45)] },
      { id: 'c21_ha_sit', label: 'Просто посидеть рядом', minutes: 15, terminal: true, goto: 'c21_h_night',
        text: 'Вы сидите плечом к плечу. Внизу тикают часы Хенрике. Сегодня вы оба дома и оба целы. Этого хватает на четверть часа.', effects: [set21('ha', 'sit'), { body: 'stress', delta: -2 }, until21(20, 22, 45)] },
    ] }),

  S21({ id: 'c21_h_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14,
    text: [
      { text: 'В одиннадцать по полю за дорогой проходит луч фары-искателя. Он задерживается на вашей крыше, на сарае, на груше. Потом уходит дальше.' },
      { when: v('$.c21_ha', 'tell'), text: 'Рассказанное вслух уже не так давит. Ты лежишь и слушаешь дом.' },
      { when: v('$.c21_ha', 'ask'), text: 'Ты лежишь и перебираешь, что {partner} {pm:сказал|сказала} про гостью.' },
      { when: v('$.c21_ha', 'sit'), text: 'После лестницы, плечом к плечу, лежать в темноте не так страшно.' },
    ],
    actions: [
      { id: 'c21_hn_sleep', label: 'Спать', minutes: 5, terminal: true, goto: 'c21_x_night',
        text: 'Ты засыпаешь в одежде, не дослушав, как стихают шаги внизу.', effects: [set21('hn', 'sleep'), until21(21, 2, 40, true)] },
      { id: 'c21_hn_kitchen', label: 'Лечь внизу, на лавке рядом с Мальте', when: A21, minutes: 5, terminal: true, goto: 'c21_x_night',
        text: 'Печь греет бок. Около двух Мальте начинает говорить во сне, отчётливо, как диктует:\n\n— Zweihundertzwölf. Zweihundertzwölf, und null.\n\nДвести двенадцать. Двести двенадцать, и ноль.\n\nУтром он этого не помнит.', effects: [set21('hn', 'kitchen'), set21('heard_212', true), malte(1), until21(21, 2, 40, true)] },
      { id: 'c21_hn_listen', label: 'Полежать без сна и послушать дом', when: B21, minutes: 5, terminal: true, goto: 'c21_x_night',
        text: 'Около полуночи ты слышишь ровное щёлканье. Ножницы. Ты идёшь на звук.\n\nОна сидит на краю постели, спиной к двери, и режет косу, прядь за прядью, на ощупь. Тебя она не замечает. Или делает вид.', effects: [set21('hn', 'listen'), set21('saw_hair', true), until21(21, 0, 30), until21(21, 2, 40, true)] },
      { id: 'c21_hn_watch', label: 'Посидеть у окна до часу', minutes: 5, terminal: true, goto: 'c21_x_night',
        text: 'Фары возвращаются ещё дважды. В половине первого они останавливаются у двора Кёлер, и там долго горит свет. К вам сегодня не сворачивают.', effects: [set21('hn', 'watch'), set21('saw_search', true), until21(21, 1, 0), until21(21, 2, 40, true)] },
    ] }),

  S21({ id: 'c21_h_dawn', for: 'any', chapter: 'ch3', title: 'Иней', camp: yard14, ambient: night21,
    text: [
      { text: 'Половина седьмого. Двор белый от инея, лужи схватило коркой. Над лесом на востоке больше ничего не светится.' },
      { when: v('$.c21_hn', 'sleep'), text: 'После ночной тревоги ты {m:уснул|уснула} снова, сразу, и до утра без снов.' },
      { when: v('$.c21_xn', 'ditch'), text: 'В канаве за задней калиткой, под инеем, лежит ночной гость. Пальцы у него ещё шевелятся. Откос обледенел: оттуда ему не выбраться.' },
      { when: v('$.c21_xn', 'fight'), text: 'У задней калитки на истоптанном снегу лежит разбитый фонарь. Ночной гость лежит рядом, лицом вниз, и больше не двигается.' },
      { when: any(v('$.c21_xn', 'prop'), v('$.c21_xn', 'sleeve')), text: 'Тачка стоит у задней калитки, вбитая под перекладину. В щели между досками видна белая рубашка: он стоит там, привалившись к калитке, и не двигается.' },
      { when: v('$.c21_xn', 'watch'), text: 'У задней калитки, привалившись к доскам, стоит ночной гость. На нём иней, как на столбе. Когда к нему подходят, он медленно поворачивает голову.' },
      { when: all(A21, v('$.c21_xw', 'wrap')), text: 'Колонка качает с первого раза: солома и мешки её спасли.' },
      { when: all(A21, flag('$.c21_xw'), not(v('$.c21_xw', 'wrap'))), text: 'Колонку за ночь прихватило. Первое ведро идёт с ледяной крошкой, и ручку приходится раскачивать минут пять.' },
      { when: v('$.c21_hn', 'watch'), text: 'Глаза режет: до часу ты {m:просидел|просидела} у окна, следя за фарами.' },
      { when: v('w.c21_lea_bed', 'smoke'), text: 'Ключ от коптильни висит на гвозде у двери, где его оставили. Когда его поворачивают, она выходит сразу, будто стояла за дверцей всю ночь. Волосы у неё теперь короткие, неровные на затылке. На полу коптильни лежит свёрнутая в газету светлая коса.' },
      { when: not(v('w.c21_lea_bed', 'smoke')), text: 'Гостья уже на ногах. Она стоит у курятника в кофте Хенрике и смотрит, как куры выходят на мороз. Волосы у неё теперь короткие, неровные на затылке.' },
    ],
    actions: [
      { id: 'c21_hd_road', label: 'Выйти к воротам и посмотреть на дорогу', minutes: 15, terminal: true, goto: 'c21_h_breakfast',
        text: 'У двора Кёлер стоит армейский «Вольф». Двое солдат ходят вокруг пекарни и заглядывают в сарай. Потом садятся и едут к следующему двору. Между ними и вами ещё три хозяйства.', effects: [set21('hd', 'road'), set21('saw_search', true), until21(21, 6, 55)] },
      { id: 'c21_hd_gate', label: 'Закончить с тем, у калитки, пока он не оттаял', when: any(v('$.c21_xn', 'watch'), v('$.c21_xn', 'prop'), v('$.c21_xn', 'sleeve')), minutes: 20, activity: 'moderate', terminal: true, goto: 'c21_h_breakfast', ambientDuring: night21,
        text: 'Ты берёшь из сарая топор. Он стоит, примёрзнув босыми ногами к земле, и только поворачивает голову, когда калитка открывается. Ты не даёшь себе думать. Потом оттаскиваешь его за изгородь, в канаву, и забрасываешь снегом. Руки ты моешь долго, у колонки, ледяной водой.', effects: [set21('hd', 'gate'), { body: 'stress', delta: 5 }, { body: 'fatigue', delta: 4 }, until21(21, 6, 55)] },
      { id: 'c21_hd_wood', label: 'Наколоть дров и затопить', when: all(A21, not(v('$.c21_xw', 'wood'))), minutes: 20, activity: 'moderate', terminal: true, goto: 'c21_h_breakfast',
        text: 'Колун звенит на морозе. К седьмому полену ты согреваешься. Мальте с лавки командует, куда ставить чурку, и первый раз за сутки смеётся.', effects: [set21('hd', 'wood'), malte(1), until21(21, 6, 55)] },
      { id: 'c21_hd_hens', label: 'Подойти к ней у курятника', when: B21, minutes: 15, terminal: true, goto: 'c21_h_breakfast',
        text: 'Она держит в руках рыжую несушку и раздвигает ей перья под крылом.\n\n— Milben. Nicht schlimm. Asche ins Stroh, dann wird das.\n\nКлещи. Не страшно. Золы в солому, и пройдёт.\n\nКурица сидит у неё на руках смирно, как кошка.', effects: [set21('hd', 'hens'), lea(2), until21(21, 6, 55)] },
      { id: 'c21_hd_bag', label: 'Проверить сумку в кладовке', when: B21, minutes: 10, terminal: true, goto: 'c21_h_breakfast',
        text: 'На крышке сумки приклеена полоска с тремя окошками. Два белых, одно зелёное. Внутри под пакетами со льдом, который уже стал водой, лежат прозрачные мешки с жёлтой жидкостью и узкая коробка шприц-ручек.', effects: [set21('hd', 'bag'), set21('saw_bag', true), until21(21, 6, 55)] },
    ] }),

  S21({ id: 'c21_h_breakfast', for: 'any', chapter: 'ch3', title: 'Завтрак', camp: kitchen14,
    text: [
      { text: 'Каша, чай, вчерашний хлеб. За столом на двоих больше, чем вчера.' },
      { text: 'Гостья ест быстро и не поднимает глаз. Мальте ест лёжа и говорит за всех.' },
      { text: 'Нина ставит перед гостьей свою кружку, с отбитой ручкой, самую большую в доме.' },
      { when: v('$.c21_hd', 'road'), text: 'Ты знаешь то, чего за столом не знает никто: «Вольф» ходит по дворам, и до вас осталось три хозяйства.' },
      { when: v('$.c21_hd', 'bag'), text: 'Ты думаешь о полоске на крышке сумки: два белых окошка, одно зелёное.' },
      { when: all(nursed, partnerUp), text: '{partner} сидит у печи, в одеяле, и держит кружку обеими руками. Ложку {pm:он|она} пока роняет. Но ест {pm:сам|сама}.' },
      { when: all(nursed, partnerDown), text: '{partner} спит за стеной. Дышит ровно. Гостья уже дважды ходила слушать.' },
    ],
    actions: [
      { id: 'c21_hb_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, goto: 'c21_checkpoint', ...tableOnly,
        text: 'Ты ешь и считаешь тарелки. Их на две больше, чем фамилий в списке у патруля.', effects: [set21('hb', 'eat'), meal('eat'), finish, until21(21, 7, 30)] },
      { id: 'c21_hb_pack', label: 'Взять свою порцию с собой', minutes: 5, terminal: true, goto: 'c21_checkpoint', ...tableOnly,
        text: 'Ты заворачиваешь хлеб и кашу в бумагу. День будет длинным.', effects: [set21('hb', 'pack'), meal('pack'), finish, until21(21, 7, 30)] },
      { id: 'c21_hb_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c21_checkpoint',
        text: 'Ты пьёшь чай стоя, у окна, откуда видно дорогу.', effects: [set21('hb', 'tea'), finish, until21(21, 7, 30)] },
      { id: 'c21_hb_guest', label: 'Сесть рядом с гостьей и ничего не спрашивать', minutes: 10, terminal: true, goto: 'c21_checkpoint',
        text: 'Гостья косится на тебя и продолжает есть. Через минуту пододвигает тебе хлеб. Ни слова. Это больше, чем вчера.', effects: [set21('hb', 'guest'), finish, until21(21, 7, 30)] },
    ] }),

  S21({ id: 'c21_checkpoint', for: 'any', chapter: 'ch3', title: 'Суббота, половина восьмого', checkpoint: 21, universal: false, camp: house14,
    text: [{ when: v('$.c21_hb', 'pack'), text: 'Свёрток с кашей и хлебом лежит в кармане твоей куртки.' }, { when: v('$.c21_hb', 'tea'), text: 'Есть ты так и не {m:стал|стала}. Не до того.' }, { when: v('$.c21_hb', 'eat'), text: 'Каша ещё греет изнутри.' }, { text: 'Половина восьмого. На кухне пахнет кашей и йодом. В девять патруль дойдёт до ваших ворот. Вы закрываете дверь в сени и решаете, что будет с вашей гостьей и с её сумкой.' }], actions: [] }),
];
