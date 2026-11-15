import type { Scene } from '../../engine/content-types';
import { yard14 } from './point14';
import { ninaFarm } from './point18';
import { S25, set25, until25 } from './point25';

// Участок 25, дополнение (проверка объёма 15.11): дорога обратно у A и человек у ворот у B. Оба выбора откликаются в 26-й.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S25({ ...scene, for: 'any', chapter: 'ch3' });
const van = { tempC: 8, outdoor: false, wet: false };
const snow = { tempC: -2, outdoor: true, wet: true };

export const day25EScenes: Scene[] = [
  X({ id: 'c25_a_road', title: 'Обочина', location: 'c7_farm_lane', ambient: van,
    text: [
      { text: 'За Паттензеном, в поле у поворота, стоит красный «Поло», задом в канаве. Рядом женщина в светлой куртке машет обеими руками. На заднем сиденье сквозь мокрое стекло видно детскую шапку.' },
      { text: '— Nicht anhalten, — говорит Вессель, не сбавляя хода. Не останавливаемся. — Fremde im Wagen, und ich bin den Wagen los. Kontrolle in Hanstedt.\n\nЧужие в машине — и я без машины. В Ханштедте проверка.' },
    ],
    actions: [
      { id: 'c25_ar_stop', label: 'Заставить его остановиться и взять их до Йестебурга', minutes: 30, terminal: true, goto: 'c25_supper', ambientDuring: snow,
        text: 'Ты говоришь «halt» так, что Вессель тормозит, ругаясь. Женщину зовут Анке, мальчика — Йонас, ему шесть. Они едут в Люллау, к свекрови, второй день. Сзади, на мешках с бельём, мальчик засыпает сразу. У поста в Ханштедте солдат светит фонарём в кузов, видит спящего ребёнка и машет: проезжайте. Вессель молчит до самого Йестебурга. У пекарни Кёлер говорит одно: «Nächstes Mal fragst du vorher». В следующий раз спрашивай заранее.', effects: [set25('ar', 'stop'), { set: 'w.c25_road', value: 'lift' }, until25(17, 50)] },
      { id: 'c25_ar_letter', label: 'Остановиться на минуту: отдать хлеб и взять у неё записку', minutes: 20, terminal: true, goto: 'c25_supper', ambientDuring: snow,
        text: 'Вессель тормозит, но мотор не глушит. Ты выскакиваешь в мокрый снег. Женщина плачет и пишет на обороте чека, прислонив его к крыше машины: «Timm, Lüllau. Anke und Jonas leben. Sind in Pattensen, im Graben. Holt uns». Ты отдаёшь ей свой хлеб из кармана. Фургон уже сигналит.', effects: [set25('ar', 'letter'), { set: 'w.c25_road', value: 'letter' }, { give: 'c25_timm_note' }, until25(17, 50)] },
      { id: 'c25_ar_drive', label: 'Промолчать: он прав', minutes: 10, terminal: true, goto: 'c25_supper',
        text: 'Ты смотришь в зеркало. Женщина ещё машет, потом опускает руки. Через поворот её уже не видно. Вессель включает радио, там шипение. Он его не выключает.', effects: [set25('ar', 'drive'), { set: 'w.c25_road', value: 'drove' }, { body: 'stress', delta: 4 }, until25(17, 50)] },
    ] }),

  X({ id: 'c25_b_stranger', title: 'Человек у ворот', camp: yard14, ambient: { tempC: -2, outdoor: true, wet: false }, onEnter: [until25(16, 30)],
    text: [
      { text: 'В половине пятого у ворот стоит мужчина лет пятидесяти, в городском пальто, с портфелем. Пальто мокрое по колено. Он кашляет в кулак, долго, и только потом говорит.' },
      { text: '— Entschuldigung. Ich komme aus Harburg. Nur eine Nacht. Im Stall, egal wo. Ich bin nicht krank. Das ist nur die Kälte.\n\nИзвините. Я из Харбурга. Только одну ночь. В хлеву, где угодно. Я не болен. Это просто холод.' },
      { when: ninaFarm, text: 'Нина стоит за твоей спиной в дверях и держится за косяк.' },
    ],
    actions: [
      { id: 'c25_bx_shed', label: 'Пустить в сарай, дать поесть и одеяло', minutes: 40, terminal: true, goto: 'c25_b_dusk',
        text: 'Ты стелешь ему солому в отдельном сарае, приносишь одеяло, хлеб и кружку горячего чая. Он благодарит тебя по имени, хотя ты его не {m:называл|называла}: услышал, как зовёт Нина. Засов на двери сарая ты задвигаешь снаружи. Он слышит и не возражает.', effects: [set25('bx', 'shed'), { set: 'w.c25_stranger', value: 'shed' }, until25(17, 0)] },
      { id: 'c25_bx_point', label: 'Дать хлеба и отправить в пункт к Зандер', minutes: 30, terminal: true, goto: 'c25_b_dusk',
        text: 'Ты объясняешь дорогу: четыре километра, пожарная часть, там врач и раскладушки. Даёшь хлеб на дорогу. Он кивает, кашляет и уходит по колее в сторону Йестебурга. Шагает медленно, как человек, у которого всё болит.', effects: [set25('bx', 'point'), { set: 'w.c25_stranger', value: 'point' }, until25(16, 55)] },
      { id: 'c25_bx_no', label: 'Отказать: у нас дети в доме', minutes: 15, terminal: true, goto: 'c25_b_dusk',
        text: '— Verstehe, — говорит он. Понимаю. И уходит, не споря, не к Йестебургу, а через поле, к колонии у насыпи. Ты долго смотришь ему вслед. Нина за спиной выдыхает.', effects: [set25('bx', 'no'), { set: 'w.c25_stranger', value: 'no' }, { body: 'stress', delta: 3 }, until25(16, 45)] },
    ] }),
];
