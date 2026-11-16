import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { not } from './world3';
import { kitchen14, yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import { S35, frost35, set35, until35, w35 } from './point35';

// Участок 35, третий проход (до уровня 19–20): солдат Хаазе спрашивает про ружьё (A) и про медиков (B); вечером A готовит Corsa,
// B собирает сумку «на всякий случай». Всё это — задел решений 36-й.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S35({ ...scene, for: 'any', chapter: 'ch3' });
const gun: Cond = { stocked: 'c19_flinte', qty: 1, at: 'c3_farm_stock' };
const carHome: Cond = { itemAt: 'opel_corsa', place: 'hof_luedemann' };

export const day35GScenes: Scene[] = [
  X({ id: 'c35_a_soldier', title: 'Солдат', camp: yard14, ambient: frost35,
    text: [
      { text: 'Хаазе уже в машине, а солдат с автоматом задерживается у ворот. Молодой, лет двадцати, с обветренным лицом. Он спрашивает тихо, не для протокола: оружие на хуторе есть? Ружьё, карабин? Через неделю это будет важно. Он не говорит, почему.' },
      { when: not(gun), text: 'Ружья в доме нет: его забрали ещё при обыске. Но он не знает об этом.' },
    ],
    actions: [
      { id: 'c35_as2_truth', label: 'Сказать правду: есть старая двустволка', when: gun, minutes: 20, terminal: true, outcomes: [{ id: 'a', goto: 'c35_a_tobias' }],
        text: 'Солдат кивает и ничего не записывает. «Gut. Behaltet sie. Und habt Patronen». Хорошо. Оставьте её. И держите патроны. Он уходит к машине быстро, будто сказал лишнее.', effects: [set35('as2', 'truth'), w35('gun_told', 'truth'), until35(9, 30)] },
      { id: 'c35_as2_lie', label: 'Сказать: нет, всё сдали', minutes: 20, terminal: true, outcomes: [{ id: 'a', goto: 'c35_a_tobias' }],
        text: 'Солдат смотрит на тебя, потом на сарай, потом снова на тебя. «Schade», — говорит он. Жаль. И уходит. Ты не понимаешь, что это значило.', effects: [set35('as2', 'lie'), w35('gun_told', 'lie'), until35(9, 30)] },
      { id: 'c35_as2_ask', label: 'Спросить: а почему через неделю?', minutes: 20, terminal: true, outcomes: [{ id: 'a', goto: 'c35_a_tobias' }],
        text: 'Солдат молчит. Потом говорит, глядя мимо: «Weil dann keiner mehr kommt, wenn ihr ruft». Потому что тогда никто не приедет, если позовёте. Хаазе сигналит из машины. Солдат бежит.', effects: [set35('as2', 'ask'), w35('gun_told', 'hint'), until35(9, 30)] },
      { id: 'c35_as_show', label: 'Показать ему сарай и трактор: пусть пишет, что видит', minutes: 20, terminal: true, outcomes: [{ id: 'a', goto: 'c35_a_tobias' }],
        text: 'Ты открываешь сарай. Солдат смотрит на трактор, на канистры, на пустую бочку. Пишет. Потом поднимает глаза: «Und das Auto?» А машина? Ты киваешь на навес. Он пишет и это. Всё, что он видит, теперь в его списке. Всё, чего не видит, — нет.', effects: [set35('as', 'show'), w35('a_showed_all', true), until35(9, 30)] },
    ] }),

  X({ id: 'c35_b_soldier', title: 'Медики', camp: kitchen14,
    text: [
      { text: 'Хаазе, уже стоя у машины, оборачивается к тебе с планшетом. Ему сказали, что на хуторе есть кто-то, кто работает в пункте у доктора Зандер. Медицинские навыки он записывает отдельно: «Für die Planung». Для планирования.' },
      { text: 'Ручка у него не пишет на морозе. Он дышит на неё и пишет снова, выдавливая буквы.' },
    ],
    actions: [
      { id: 'c35_bs3_tell', label: 'Сказать: да, это я. Перевязки, уход', minutes: 20, terminal: true, goto: 'c35_b_point',
        text: 'Хаазе записывает твоё имя в отдельную графу. Подчёркивает. «Danke». Ты не знаешь, хорошо это или плохо — быть в отдельной графе.', effects: [set35('bs3', 'tell'), w35('b_listed_med', true), until35(9, 30)] },
      { id: 'c35_bs3_down', label: 'Сказать: так, помогаю немного, ничего особенного', minutes: 20, terminal: true, goto: 'c35_b_point',
        text: 'Хаазе смотрит на тебя поверх очков и пишет что-то короткое. Может быть, «nein». Может быть, твоё имя. Ты не видишь.', effects: [set35('bs3', 'down'), w35('b_listed_med', 'maybe'), until35(9, 30)] },
      { id: 'c35_bs3_okafor', label: 'Сказать: настоящий медбрат у нас Окафор, он в колонии', minutes: 20, terminal: true, goto: 'c35_b_point',
        text: 'Хаазе записывает: «Okafor, Krankenpfleger». Ты сразу жалеешь, что {m:сказал|сказала}. Потом думаешь: а может, ему это поможет с пропуском. Ты не знаешь.', effects: [set35('bs3', 'okafor'), w35('okafor_listed', true), until35(9, 30)] },
    ] }),

  X({ id: 'c35_a_car', title: 'Машина', camp: yard14, ambient: frost35, onEnter: [until35(17, 0)],
    text: [
      { when: carHome, text: 'Corsa стоит под навесом в инее. Если понадобится уезжать — на восток, на север, куда угодно — на ней. Бак почти пуст. Аккумулятор на морозе садится за две ночи.' },
      { when: not(carHome), text: 'Под навесом пусто, Corsa всё ещё у пожарной части. Если понадобится уезжать, то на чём? На тракторе, на фургоне братьев, пешком.' },
      { when: v('$.c35_ag', 'stay'), text: '«Мы никуда не уходим», — сказал{m:|а} ты. Теперь, глядя на навес, ты повторяешь это про себя, проверяя, веришь ли.' },
    ],
    actions: [
      { id: 'c35_ac2_battery', label: 'Снять аккумулятор и унести в дом, в тепло', when: carHome, minutes: 30, terminal: true, goto: 'c35_supper',
        text: 'Гаечный ключ, клеммы, тяжёлая коробка. Аккумулятор ставишь у печки, на газету. Хенрике смотрит и понимает больше, чем ты сказал{m:|а}.', effects: [set35('ac2', 'battery'), w35('car_ready', 'battery'), until35(17, 40)] },
      { id: 'c35_ac2_kerem', label: 'Сходить к Керему: спросить бензина в долг', minutes: 50, terminal: true, goto: 'c35_supper', ambientDuring: frost35,
        text: 'Керем выслушивает и чешет затылок. «Fünf Liter. Mehr hat keiner. Und du schuldest mir dann zwei Hühner». Пять литров. Больше нет ни у кого. И ты мне будешь {m:должен|должна} двух кур. Канистру он приносит сам, через полчаса.', effects: [set35('ac2', 'kerem'), w35('car_ready', 'fuel'), { give: 'can_petrol_10', fuel: 5 }, npc('kerem', 1), until35(17, 50)] },
      { id: 'c35_ac2_leave', label: 'Оставить как есть: никуда мы не едем', minutes: 15, terminal: true, goto: 'c35_supper',
        text: 'Ты проводишь рукой по крыше, стираешь иней. Машина как машина. Никуда вы не едете. Пока.', effects: [set35('ac2', 'leave'), until35(17, 20)] },
      { id: 'c35_ac2_walk', label: 'Прикинуть, сколько пешком до Винзена и до Гестхахта', when: not(carHome), minutes: 30, terminal: true, goto: 'c35_supper',
        text: 'Ты считаешь по карте: до Винзена восемнадцать, до Гестхахта тридцать. По снегу, с рюкзаками. Два дня. Ты складываешь карту и долго держишь её в руках.', effects: [set35('ac2', 'walk'), w35('car_ready', 'walk'), until35(17, 30)] },
    ] }),

  X({ id: 'c35_b_bag', title: 'Сумка', camp: kitchen14, onEnter: [until35(17, 0)],
    text: [
      { text: 'Перед ужином ты достаёшь из-под кровати рюкзак. Просто посмотреть. Что взять, если ехать на две недели. Что оставить, если не ехать.' },
      { text: 'Молния заедает на середине, как и тогда, в ноябре. На дне то, что ты так и не {m:разобрал|разобрала}: зарядка, носки, расчёска.' },
    ],
    actions: [
      { id: 'c35_bb3_pack', label: 'Собрать сумку медсестры: бинты, перчатки, термометр, сахар', minutes: 40, terminal: true, goto: 'c35_supper',
        text: 'Бинты, две пары перчаток, термометр из аптечки Хенрике, кубики сахара в целлофане, ножницы. Сумка выходит маленькой и тяжёлой. Ты ставишь её у двери. Если не поедешь — разберёшь.', effects: [set35('bb3', 'pack'), w35('b_bag', 'packed'), until35(17, 40)] },
      { id: 'c35_bb3_warm', label: 'Сложить только тёплое: если ехать, то хотя бы не мёрзнуть', minutes: 30, terminal: true, goto: 'c35_supper',
        text: 'Свитер, вторые носки, шапка Нины, если она её отдала, рукавицы. Рюкзак наполовину. Остальное — потом. Если будет «потом».', effects: [set35('bb3', 'warm'), w35('b_bag', 'warm'), until35(17, 30)] },
      { id: 'c35_bb3_no', label: 'Задвинуть рюкзак обратно', minutes: 10, terminal: true, goto: 'c35_supper',
        text: 'Рюкзак уезжает под кровать. Пыль на нём остаётся нетронутой. Это тоже решение.', effects: [set35('bb3', 'no'), until35(17, 10)] },
    ] }),
];
