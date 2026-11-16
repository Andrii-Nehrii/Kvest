import type { NpcDef, Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { oleCollapsed } from './point25';

// Участок 27: четверг 26.11, 05:00 → КТ27 22:00. КЛЮЧЕВАЯ. План — STOCK_PLAN.md §9.
// Жребий: знают разное / один решает за другого; запертая находка B (жестяная коробка Тима, слово — кличка хомяка из утренней сцены).
// Кася Новак увезла Тима из детской Люнебурга в фургоне прачечной (шофёр — Вессель) и приехала к единственным, кого здесь знает.
export const P27: Cond = all({ cp: 26 }, not({ cp: 27 }));
export const A27: Cond = { me: 'A' };
export const B27: Cond = { me: 'B' };
export const farm27 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const kasiaHere27: Cond = all({ npc: 'kasia', alive: true }, flag('w.nowaks_gone'));
export const point27Available: Cond = all(P27, { at: farm27 }, up, flag('w.c26_plan'), kasiaHere27);
const plan = (x: string): Cond => v('w.c26_plan', x);
/** Ворота закрыты: их приводит Уте, и место им — в отдельном сарае. Иначе — в доме. */
export const inShed: Cond = plan('door');
export const planGo: Cond = plan('go');
export const brandt27 = (x: string): Cond => v('w.c26_brandt', x);
export const leaNear: Cond = any(flag('w.c25_lea_point'), v('w.c24_lea', 'sander'), v('w.c22_lea_at', 'sander'), all(v('w.c21_lea', 'hide'), not(flag('w.c24_lea'))));
export const oleHome27: Cond = any(flag('w.c26_ole_home'), { npc: 'ole', alive: true, at: farm27 });
/** Оле в Люнебурге, упал во вторник, Алерс не запретила, решали «пусть сам»: в четверг он даёт «последний раз». Весть придёт в пятницу. */
export const oleLast: Cond = all(not(oleHome27), oleCollapsed, v('w.c25_ole', 'his'), not(flag('w.c25_ole_banned')), { npc: 'ole', alive: true });

export const npcs27: Record<string, NpcDef> = {
  c27_tim: {
    id: 'c27_tim', name: 'Тим', introducedByStory: true,
    intro: 'Сын Каси и Дариуша Новаков, соседей из Бармбека. Восемь лет. Из детской палаты Люнебурга.',
    hidden: { goals: ['Чтобы мама не плакала'], fears: ['Темноты', 'Что Пан Кулька замёрз'], secrets: ['Знает, что болен. Не говорит, чтобы мама не плакала'] },
    initial: { alive: true, location: farm27, status: 'sick', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
  c27_wessel: {
    id: 'c27_wessel', name: 'Вессель', introducedByStory: true,
    intro: 'Шофёр фургона прачечной из Люнебурга. Полный, в ушанке. Его жена была донором в Бухгольце.',
    hidden: { goals: ['Не потерять фургон', 'Найти жену'], fears: ['Что его снимут с маршрута'], secrets: ['Жену увезли 12.11 вместе с отделением'] },
    initial: { alive: true, location: farm27, status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
    agenda: [],
  },
};

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm27, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S27 = wrap(P27);
export const set27 = (key: string, value: string | boolean): Effect => ({ set: `$.c27_${key}`, value });
export const w27 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c27_${key}`, value });
export const until27 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(26, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare27: Effect = { camp: { kind: 'prepare', quiet: true } };
export const snow27 = { tempC: -4, outdoor: true, wet: false };
/** Утро обе линии записывают одинаково: кто приехал, где лежит Тим, что с Оле. */
const morningFacts: Effect[] = [
  { introduceNpc: 'c27_tim' }, { introduceNpc: 'c27_wessel' }, { set: '$.met.c27_tim', value: true }, { set: '$.met.c27_wessel', value: true },
  { npc: 'kasia', moveTo: farm27 },
  { if: inShed, then: [w27('bed', 'shed'), { npc: 'c27_tim', moveTo: 'c3_farm_shed' }, { npc: 'kasia', moveTo: 'c3_farm_shed' }], else: [w27('bed', 'house')] },
  { if: oleLast, then: [w27('ole_last', true)] },
];
const finish: Effect = { set: '$.c27_finished', value: true };

export const shared27: Scene[] = [
  S27({ id: 'c27_knock', for: 'any', chapter: 'ch3', title: 'Пять утра', camp: yard14, ambient: snow27, onEnter: morningFacts,
    text: [
      { when: plan('ready'), text: 'В пять в ворота стучат. Не кулаком: ладонью, часто, как стучат, когда боятся разбудить. За воротами в темноте стоит белый фургон с погашенными фарами.' },
      { when: inShed, text: 'В пять под окном свистят в два пальца. Яннес. Он запыхался.\n\n— Bei Mutter am Tor. Eine Frau mit einem Kind. Sie sagt, sie kennt euch. Euer Tor ist zu.\n\nУ матери у калитки. Женщина с ребёнком. Говорит, что знает вас. Ваши ворота закрыты.\n\nЧерез десять минут Уте сама приводит их по снегу к вашей задней калитке. «Ihr habt zu. Ich nicht. Aber ich habe kein Bett». Вы закрыты. Я — нет. Но у меня нет кровати.' },
      { when: planGo, text: 'В половине пятого {B} уходит к пекарне Кёлер, к фургону на Люнебург. Через двадцать минут она возвращается, и не одна. За ней по снегу идёт белый фургон с погашенными фарами.' },
      { text: 'Из фургона выходит Вессель, шофёр прачечной. Он держит на руках что-то, завёрнутое в больничное одеяло. Следом, путаясь в полах пальто, — женщина в белой косынке. Кася Новак.' },
      { text: 'Из одеяла выглядывает лицо. Мальчик лет восьми. Глаза блестят. Губы сухие. Он смотрит на {B.acc} и узнаёт.\n\n— Gdzie jest Pan Kulka? — спрашивает он по-польски, хрипло. Потом по-немецки, для всех: — Wo ist Pan Kulka? Ist er noch warm?\n\nГде Пан Кулька? Ему ещё тепло?\n\nПан Кулька — его хомяк. В первый день он ехал у Тима под курткой.' },
      { text: 'Кася смотрит на вас и говорит одно слово:\n\n— Barmbek.\n\nКак пароль. Как будто это всё объясняет. Для неё — объясняет.' },
      { text: 'Изо рта у всех пар: в сенях холодно, как на улице. Лампа в руке у Эвы дрожит, и тени прыгают по стенам. С фургона за воротами капает талый снег.' },
    ],
    actions: [
      { id: 'c27_k_take', label: 'Взять мальчика у Весселя и нести в тепло', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: A27, goto: 'c27_a_van' }, { id: 'b', goto: 'c27_b_tim' }],
        text: 'Он лёгкий, легче, чем должен быть восьмилетний. Сквозь одеяло чувствуется жар. Тим не плачет. Он держит в кулаке край одеяла и смотрит на снег.', effects: [set27('k', 'take'), until27(5, 30)] },
      { id: 'c27_k_kasia', label: 'Обнять Касю', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: A27, goto: 'c27_a_van' }, { id: 'b', goto: 'c27_b_tim' }],
        text: 'Кася стоит, как столб, когда ты её обнимаешь. Потом обмякает. От неё пахнет хлоркой и дорогой. Она говорит в твоё плечо по-польски что-то, чего ты не понимаешь. Потом по-немецки: «Danke». И ещё раз.', effects: [set27('k', 'kasia'), npc('kasia', 2), until27(5, 30)] },
      { id: 'c27_k_ask', label: 'Спросить Весселя, что случилось', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: A27, goto: 'c27_a_van' }, { id: 'b', goto: 'c27_b_tim' }],
        text: '— Die Ärztin hat es den Müttern gesagt. Gestern Abend. — Вессель передаёт одеяло в чужие руки, осторожно. — Die da hat ihn aus dem Bett genommen und ist in meinen Wagen gestiegen. Unter die Säcke. Ich hab es gemerkt, als ich schon auf der Brücke war.\n\nВрач сказала матерям. Вчера вечером. Эта вынула его из кровати и залезла ко мне в фургон. Под мешки. Я заметил, когда уже был на мосту.', effects: [set27('k', 'ask'), until27(5, 30)] },
    ] }),

  S27({ id: 'c27_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин в половине седьмого. Эва сварила суп на всех и манную кашу отдельно, в маленькой кастрюле, для Тима. Каша стоит на краю плиты нетронутая.' },
      { when: all(A27, v('$.c27_xg', 'all')), text: 'На полке у плиты, на блюдце, лежит градусник из фургона. Эва никому не даёт его трогать.' },
      { when: all(A27, v('$.c27_xm', 'truth')), text: 'Банка мёда Уте стоит на столе. Ложку из неё берут только для швейной.' },
      { when: inShed, text: 'Кася в сарае. Она не придёт к столу. Нина относит ей миску и возвращается без неё.' },
      { when: not(inShed), text: 'Дверь в комнату, где лежит Тим, прикрыта. Оттуда не доносится ни звука. Кася не выходит.' },
      { when: v('$.c27_ac', 'wood'), text: 'Дров наколото до темноты: на эту ночь и на две следующих.' },
      { when: v('$.c27_ac', 'watch'), text: 'Ты весь день {m:просидел|просидела} у окна наверху. Дорога была пустой. Это тоже новость.' },
      { when: v('$.c27_ad', 'water'), text: 'Воды натаскано и в дом, и в комнату к Касе с Тимом: на всю ночь.' },
      { when: v('$.c27_bf', 'cool'), text: 'Полотенце у кровати Тима ещё мокрое. Ты {m:менял|меняла} его весь день. Жар не ушёл, но и не поднялся.' },
      { when: v('$.c27_avl', 'road'), text: 'Утром ты {m:постоял|постояла} у ворот и {m:посмотрел|посмотрела} на дорогу. Брандт видел. Он ничего не сказал.' },
    ],
    actions: [
      { id: 'c27_su_eat', label: 'Поесть: ночь будет длинной', minutes: 25, terminal: true, goto: 'c27_evening', ...tableOnly,
        text: 'Ты ешь, не чувствуя вкуса. За столом никто не говорит. Даже Нина.', effects: [set27('su', 'eat'), meal('eat'), until27(19, 0)] },
      { id: 'c27_su_kasia', label: 'Отнести свою порцию Касе', minutes: 20, terminal: true, goto: 'c27_evening', ...tableOnly,
        text: 'Кася берёт миску, ставит на пол рядом с собой и не притрагивается. Она держит Тима за руку. Ты оставляешь миску и уходишь.', effects: [set27('su', 'kasia'), { camp: { kind: 'meal', mode: 'give', communal: true } }, npc('kasia', 1), until27(18, 55)] },
      { id: 'c27_su_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c27_evening',
        text: 'Ты пьёшь чай стоя, у окна. На дороге темно.', effects: [set27('su', 'tea'), until27(18, 45)] },
    ] }),

  S27({ id: 'c27_evening', for: 'any', chapter: 'ch3', title: 'Перед ночью', camp: house14,
    text: [
      { text: 'К девяти вы сидите вдвоём на лестнице. На третьей ступеньке, где обычно сидит Нина.' },
      { when: A27, text: 'Ты знаешь, что будет утром. Патруль, бумага, второе нарушение. {B} знает другое: сколько у него осталось. Вы говорите шёпотом.' },
      { when: B27, text: 'Ты знаешь, сколько у него осталось. И о чём просила Кася. {A} знает другое: что будет утром с домом. Вы говорите шёпотом.' },
      { text: 'Свеча на столе догорает до половины. Эва ставит рядом вторую, не зажигая: на всякий случай.' },
      { text: 'Внизу Эва моет посуду так тихо, что слышно, как капает вода с тарелок.' },
    ],
    actions: [
      { id: 'c27_ev_all', label: 'Рассказать всё, что знаешь', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c27_a_late' }, { id: 'b', goto: 'c27_b_late' }],
        text: 'Ты рассказываешь. {partner} слушает. Потом рассказывает {pm:он|она}. Две половины одного дня. Вместе они хуже, чем каждая по отдельности.', effects: [set27('ev', 'all'), finish, until27(20, 0)] },
      { id: 'c27_ev_main', label: 'Сказать только главное', minutes: 15, terminal: true, outcomes: [{ id: 'a', when: { me: 'A' }, goto: 'c27_a_late' }, { id: 'b', goto: 'c27_b_late' }],
        text: 'Ты говоришь одну фразу. {partner} кивает. Подробностей {pm:он|она} не просит. Сегодня их и так слишком много.', effects: [set27('ev', 'main'), finish, until27(20, 0)] },
    ] }),

  S27({ id: 'c27_checkpoint', for: 'any', chapter: 'ch3', title: 'Четверг, десять вечера', checkpoint: 27, universal: false, camp: house14,
    text: [{ text: 'Десять вечера. Кася ждёт ответа. Утром в шесть придёт патруль. Решать будете друг за друга: каждый знает то, чего не знает другой.' }], actions: [] }),
];
