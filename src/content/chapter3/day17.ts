import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import {
  A16 as A17, B16 as B17, S17, albers17, brandt, garden16, jannes, jensAlive, koehler, nina, ninaAway, ninaHere, night16, day16, sweep17, tobias, ute, village16,
} from './point16';

// Участок 17: ночь 16/17 и утро 17.11, до КТ17 (13:00).
const any = (...xs: Cond[]): Cond => ({ any: xs });
const warn = sweep17('warn'), toBrandt = sweep17('brandt'), stayOut = sweep17('stay');
const home = any(toBrandt, stayOut);
const take = albers17('take'), refused = albers17('no');
const split = (a: string, b: string) => [{ id: 'a', when: A17, goto: a }, { id: 'b', goto: b }];
const garden = 'c15_garden';
const field = 'c10_field';
const village = 'c16_jesteburg';
const lane = 'c7_farm_lane';
const cold = night16;
const toDawn: Effect = { restUntil: at(17, 6, 25), sleeping: true };
const toBreakfast: Effect = { restUntil: at(17, 7, 30) };
const toKoehler: Effect = { restUntil: at(17, 9) };
const toNoon: Effect = { restUntil: at(17, 12, 20) };
const toYard: Effect = { restUntil: at(17, 11, 50) };
const toCp: Effect = { restUntil: at(17, 13) };
const afterBreakfast = [
  { id: 'can', when: all(A17, { has: 'can_petrol_10' }, flag('$.c16_fuel')), goto: 'c17_a_can' },
  { id: 'brandt', when: all(A17, toBrandt), goto: 'c17_a_vgo' },
  { id: 'a', when: A17, goto: 'c17_a_pump' },
  { id: 'b', goto: 'c17_b_koehler', effects: [toKoehler] },
];
const toJens = [{ id: 'jens', when: jensAlive, goto: 'c17_b_jens' }, { id: 'back', goto: 'c17_b_back' }];
const afterCan = [{ id: 'brandt', when: toBrandt, goto: 'c17_a_vgo' }, { id: 'a', goto: 'c17_a_pump' }];

export const day17Scenes: Scene[] = [
  // ───────────── Ночь: к Уте ─────────────
  S17({ id: 'c17_w_rails', for: 'any', chapter: 'ch3', title: 'Шпалы ночью', location: field, ambient: cold,
    text: [
      { text: 'Иней на шпалах хрустит под ботинками. Красный свет фонаря лежит под ногами пятном шириной в шаг. Дальше ничего не видно.' },
      { text: 'На полпути будка обходчика. Дверь открыта, как и днём. Внутри никого.' },
      { when: { v: 'A.c16_col', op: '==', value: 'warn' }, text: '«Тогда мы погуляем раньше», — сказала Уте. {A} не может это забыть.' },
    ],
    actions: [
      { id: 'c17_wr_quiet', label: 'Идти молча, след в след', minutes: 45, activity: 'moderate', move: true, terminal: true, goto: 'c17_w_colony',
        text: 'Вы идёте молча. Слышно только гравий и дыхание. Один раз {partner} берёт тебя за рукав: сова снялась с провода над насыпью.', effects: [{ set: '$.c17_wr', value: 'quiet' }] },
      { id: 'c17_wr_talk', label: 'Говорить с {partner.ins} вполголоса', minutes: 45, activity: 'moderate', move: true, terminal: true, goto: 'c17_w_colony',
        text: 'Вы говорите о пустяках: какая была погода в ноябре в прошлом году, кто из вас первый сказал «давай жить вместе». Голоса тонут в темноте через три шага.', effects: [{ set: '$.c17_wr', value: 'talk' }, { body: 'stress', delta: -1 }] },
    ] }),

  S17({ id: 'c17_w_colony', for: 'any', chapter: 'ch3', title: 'Пустая одиннадцать', location: garden, ambient: cold,
    text: [
      { text: 'Дверь домика одиннадцать открыта настежь. На полу верёвка. Бантик развязан.' },
      { text: 'Уте сидит на ступеньке в пальто, с термосом на коленях. Увидев красный свет, она не встаёт.\n\n— Ich habe ihn spazieren geführt, — говорит она. — Nur bis zum Tor. Er hat sich umgedreht und ist gegangen. Jannes sucht ihn.\n\nЯ вывела его погулять. Только до калитки. Он развернулся и ушёл. Яннес его ищет.' },
      { text: 'Красный огонёк Яннеса мигает далеко на насыпи, в сторону Итценбюттеля.' },
    ],
    actions: [
      { id: 'c17_wc_go', label: 'Бежать за Яннесом', when: A17, minutes: 3, terminal: true, goto: 'c17_w_a_track',
        text: '{partner} кивает тебе: иди. Ты бежишь по шпалам на красный огонёк.', effects: [{ set: '$.c17_wc', value: 'go' }] },
      { id: 'c17_wc_rope', label: 'Взять с пола верёвку и бежать', when: A17, minutes: 4, terminal: true, goto: 'c17_w_a_track',
        text: 'Ты сматываешь верёвку на локоть, на бегу. Уте смотрит, как ты её забираешь, и ничего не говорит.', effects: [{ set: '$.c17_wc', value: 'rope' }, { set: '$.c17_has_rope', value: true }] },
      { id: 'c17_wc_sit', label: 'Сесть рядом с Уте', when: B17, minutes: 3, terminal: true, goto: 'c17_w_b_ute',
        text: '{A} уже бежит по шпалам. Ты садишься на ступеньку рядом с Уте. Она подвигается, чтобы тебе хватило места.', effects: [{ set: '$.c17_wc', value: 'sit' }] },
      { id: 'c17_wc_where', label: 'Спросить Уте, когда он ушёл', when: B17, minutes: 4, terminal: true, goto: 'c17_w_b_ute',
        text: '— Vor einer Stunde, — говорит Уте. — Vielleicht mehr.\n\nЧас назад. Может, больше.\n\nОна говорит это спокойно, как время автобуса.', effects: [{ set: '$.c17_wc', value: 'where' }] },
    ] }),

  S17({ id: 'c17_w_a_track', for: 'any', chapter: 'ch3', title: 'Следы', location: field, ambient: cold,
    text: [{ text: 'Яннес ждёт тебя на насыпи. Налобный фонарь под красным стеклом, в руке нож.\n\n— Da, — шепчет он и светит вниз.\n\nНа инее между шпалами следы. Носки, без обуви. Шаги неровные, то шире, то уже. Они ведут к переезду у Итценбюттеля. Там, за полем, в одном доме горит окно.' }],
    actions: [
      { id: 'c17_wt_rails', label: 'Идти по шпалам, по следам', minutes: 20, activity: 'moderate', move: true, terminal: true, goto: 'c17_w_a_kai',
        text: 'Вы идёте по следам. Яннес светит, ты смотришь вперёд. Окно за полем становится больше.', effects: [{ set: '$.c17_wt', value: 'rails' }] },
      { id: 'c17_wt_field', label: 'Срезать полем к дому с окном', minutes: 15, activity: 'moderate', move: true, terminal: true, goto: 'c17_w_a_kai',
        text: 'Пашня мёрзлая, комья под ногами как камни. Ты дважды подворачиваешь ногу. Но к переезду вы выходите раньше, чем он.', effects: [{ set: '$.c17_wt', value: 'field' }, { body: 'fatigue', delta: 3 }] },
      { id: 'c17_wt_knife', label: 'Попросить Яннеса убрать нож', minutes: 18, activity: 'moderate', move: true, terminal: true, goto: 'c17_w_a_kai',
        text: 'Яннес смотрит на нож, будто забыл, что держит. Убирает в ножны. Пальцы у него трясутся.\n\n— Danke, — говорит он. Ты не знаешь, за что.', effects: [{ set: '$.c17_wt', value: 'knife' }, jannes(1)] },
    ] }),

  S17({ id: 'c17_w_a_kai', for: 'any', chapter: 'ch3', title: 'Переезд', location: field, ambient: cold,
    text: [{ text: 'Кай стоит посреди дороги у переезда, под мёртвым фонарём. Свитер, носки, седая щетина. Во дворе за забором лает собака, и он поворачивается на лай. Потом на окно. Потом снова на лай.\n\nВ окне детский силуэт. Кто-то маленький прижимается к стеклу и смотрит на дорогу.' }],
    actions: [
      { id: 'c17_wk_lure', label: 'Постучать ножом по рельсу и увести его звуком', minutes: 50, activity: 'moderate', terminal: true, goto: 'c17_w_a_back',
        text: 'Ты стучишь по рельсу. Кай поворачивается. Делает шаг. Ещё. Ты отходишь и стучишь снова. Так, шаг за стуком, вы уводите его от переезда. Яннес идёт сзади и шёпотом считает.\n\nНа насыпи он накидывает отцу на пояс верёвку.', effects: [{ set: '$.c17_wk', value: 'lure' }, jannes(2), { body: 'stress', delta: 3 }] },
      { id: 'c17_wk_rope', label: 'Подойти сзади с Яннесом и накинуть верёвку', minutes: 40, risky: true, terminal: true, goto: 'c17_w_a_back',
        text: 'Кай оборачивается на хруст инея раньше, чем вы успеваете. Хватает тебя за рукав куртки. Хватка как у тисков. Ты бьёшь его в плечо, и он отлетает на шаг. Яннес набрасывает петлю.\n\nНа рукаве остаются следы пальцев. Под курткой рука ноет до утра.', effects: [{ set: '$.c17_wk', value: 'rope' }, { injure: 'bruise', site: 'rightArm', severity: 1 }, jannes(1), { body: 'stress', delta: 5 }] },
      { id: 'c17_wk_jannes', label: 'Дать Яннесу сделать по-своему', minutes: 45, terminal: true, goto: 'c17_w_a_back',
        text: 'Яннес выходит на дорогу и начинает петь. Ту же песню, что мама. Голос срывается на каждой строчке. Кай поворачивается на голос и идёт к нему. Яннес пятится и поёт, пока не охрипнет.\n\nВерёвку он завязывает сам. Двойным узлом. Не бантиком.', effects: [{ set: '$.c17_wk', value: 'jannes' }, jannes(3)] },
    ] }),

  S17({ id: 'c17_w_a_back', for: 'any', chapter: 'ch3', title: 'Обратно в колонию', location: garden, ambient: cold,
    text: [
      { text: 'Уте встречает вас у калитки колонии. Берёт мужа за руку, как с прогулки, и ведёт в домик.' },
      { text: '— Mama, — говорит Яннес. — Die Kette.\n\nМама. Цепь.\n\nУте долго не двигается. Потом застёгивает цепь на щиколотке сама. Поверх бинта.' },
    ],
    actions: [
      { id: 'c17_wab_help', label: 'Помочь ей проверить замок', minutes: 6, terminal: true, goto: 'c17_w_home',
        text: 'Ты проверяешь замок. Держит. Уте смотрит, как ты дёргаешь цепь, и молчит.', effects: [{ set: '$.c17_wab', value: 'help' }, ute(1)] },
      { id: 'c17_wab_brandt', label: 'Рассказать Уте про внука Брандта и браслет', when: any({ v: '$.c16_mother', op: '==', value: 'who' }, flag('$.c16_aby')), minutes: 8, terminal: true, goto: 'c17_w_home',
        text: 'Уте слушает и кивает.\n\n— Dann soll Brandt kommen, — говорит она. — Ich zeige ihm alle sieben. Mit Namen.\n\nТогда пусть Брандт приходит. Я покажу ему всех семерых. По именам.', effects: [{ set: '$.c17_wab', value: 'brandt' }, ute(1)] },
      { id: 'c17_wab_leave', label: 'Оставить их и найти {partner.acc}', minutes: 3, terminal: true, goto: 'c17_w_home',
        effects: [{ set: '$.c17_wab', value: 'leave' }] },
    ] }),

  S17({ id: 'c17_w_b_ute', for: 'any', chapter: 'ch3', title: 'Уте', location: garden, ambient: cold,
    text: [{ text: 'Уте наливает из термоса чай в крышку и отдаёт тебе. Себе не наливает.\n\n— Einunddreißig Jahre, — говорит она. — Er hat immer die Tür abgeschlossen. Jeden Abend. Zweimal. Ich habe gelacht.\n\nТридцать один год. Он каждый вечер запирал дверь. Два раза. Я смеялась.' }],
    actions: [
      { id: 'c17_wbu_hold', label: 'Обнять её', minutes: 8, terminal: true, goto: 'c17_w_b_nine',
        text: 'Уте не плачет. Она сидит в твоих руках прямо, как на собрании. Только пальцы сжимают твой рукав.', effects: [{ set: '$.c17_wbu', value: 'hold' }, ute(1)] },
      { id: 'c17_wbu_truth', label: 'Спросить: вы отпустили его нарочно?', minutes: 6, terminal: true, goto: 'c17_w_b_nine',
        text: 'Уте смотрит на насыпь.\n\n— Ja, — говорит она. — Einmal sollte er frei gehen. Nicht in Brandts Käfig. Nicht mit Soldaten.\n\nДа. Хоть раз пусть бы шёл свободно. Не в клетке у Брандта. Не с солдатами.\n\nПотом, тише:\n\n— Ich dachte, er geht in den Wald. Wie ein Hund, der alt ist.\n\nЯ думала, он уйдёт в лес. Как старая собака.', effects: [{ set: '$.c17_wbu', value: 'truth' }, { set: '$.c17_ute_truth', value: true }] },
      { id: 'c17_wbu_tea', label: 'Отдать ей чай обратно', minutes: 4, terminal: true, goto: 'c17_w_b_nine',
        text: 'Уте берёт крышку и держит обеими руками. Пьёт маленькими глотками. Через минуту её перестаёт трясти.', effects: [{ set: '$.c17_wbu', value: 'tea' }] },
    ] }),

  S17({ id: 'c17_w_b_wait', for: 'any', chapter: 'ch3', title: 'Ожидание', location: garden, ambient: cold,
    text: [{ text: 'Время идёт медленно. Из домиков доносится шорох и звон цепей. Уте называет их по звуку: «Opa Gerd. Frau Albers. Herr Stamer».' },
      { when: jensAlive, text: 'Из двенадцатого ни звука.' }],
    actions: [
      { id: 'c17_wbw_jens', label: 'Подойти к двенадцатому', when: jensAlive, minutes: 10, terminal: true, goto: 'c17_w_home',
        text: 'Ставня приоткрыта. В красном свете Йенс сидит на матрасе в Нининой шапке, набекрень. Он поворачивает голову на твой свет. Миска рядом пустая.\n\nОколо полуночи на насыпи появляется красный огонёк. Яннес ведёт Кая на верёвке. {A} идёт рядом.', effects: [{ set: '$.c17_wbw', value: 'jens' }, { set: '$.c17_saw_jens', value: true }] },
      { id: 'c17_wbw_gate', label: 'Стоять у калитки и смотреть на насыпь', minutes: 10, terminal: true, goto: 'c17_w_home',
        text: 'Ты стоишь у калитки, пока не немеют пальцы ног. Около полуночи на насыпи появляется красный огонёк. Яннес ведёт Кая на верёвке. {A} идёт рядом.', effects: [{ set: '$.c17_wbw', value: 'gate' }] },
      { id: 'c17_wbw_water', label: 'Разнести с Уте воду по домикам', minutes: 25, activity: 'moderate', terminal: true, goto: 'c17_w_home',
        text: 'Уте показывает: ведро у порога, дверь шестом, миску подтолкнуть. Ты делаешь это семь раз. Нет, шесть: одиннадцатый пустой.\n\nОколо полуночи на насыпи появляется красный огонёк. Яннес ведёт Кая на верёвке. {A} идёт рядом.', effects: [{ set: '$.c17_wbw', value: 'water' }, ute(2)] },
    ] }),

  S17({ id: 'c17_w_home', for: 'any', chapter: 'ch3', title: 'Домой', location: field, ambient: cold,
    text: [{ text: 'Обратно вы идёте вдвоём. Уже не страшно, только холодно. У будки обходчика {partner} останавливается и молча обнимает тебя. Потом вы идёте дальше.' }],
    actions: [
      { id: 'c17_wh_sleep', label: 'Дойти и упасть спать', minutes: 45, activity: 'moderate', move: true, terminal: true, goto: 'c17_dawn',
        text: 'Ты засыпаешь, не раздевшись до конца. Один ботинок так и остаётся на ноге.', effects: [{ set: '$.c17_wh', value: 'sleep' }, toDawn] },
      { id: 'c17_wh_talk', label: 'Постоять у будки и поговорить', minutes: 60, activity: 'moderate', move: true, terminal: true, goto: 'c17_dawn',
        text: 'Вы садитесь на порог будки обходчика, плечом к плечу. Говорите про Уте, про Кая, про то, что сделали бы сами. Потом про другое. Дома ты засыпаешь сразу.', effects: [{ set: '$.c17_wh', value: 'talk' }, { body: 'stress', delta: -3 }, toDawn] },
    ] }),

  // ───────────── Ночь: дома ─────────────
  S17({ id: 'c17_n_a_wake', for: 'any', chapter: 'ch3', title: 'Ночью', camp: house14,
    text: [
      { when: any({ v: 'A.c14_fence', op: '==', value: 'can' }, { v: 'A.c16_gatefix', op: '==', value: 'can' }), text: 'Ты просыпаешься от звона. Банка с камнями на задней калитке. Кто-то трясёт калитку, ровно, без пауз.' },
      { when: not(any({ v: 'A.c14_fence', op: '==', value: 'can' }, { v: 'A.c16_gatefix', op: '==', value: 'can' })), text: 'Ты просыпаешься от кур. Они орут в курятнике все разом. Потом слышно, как скрипит задняя калитка, ровно, без пауз.' },
      { text: 'На часах десять минут третьего.' },
      { when: { v: 'A.c15_ag2', op: '==', value: 'keep' }, text: 'Ружьё Оле стоит у двери, за вешалкой. Ты сам{m:|а} его туда поставил{m:|а}.' },
    ],
    actions: [
      { id: 'c17_naw_light', label: 'Взять фонарь и выйти', minutes: 3, terminal: true, goto: 'c17_n_a_gate',
        text: 'Ты натягиваешь куртку на голое тело. Красная изолента на фонаре, как у Яннеса. Во дворе мороз.', effects: [{ set: '$.c17_naw', value: 'light' }] },
      { id: 'c17_naw_gun', label: 'Взять ружьё у двери', when: { v: 'A.c15_ag2', op: '==', value: 'keep' }, minutes: 3, risky: true, terminal: true, goto: 'c17_n_a_gate',
        text: 'Ружьё холодное. Ты выходишь во двор, держа ствол вниз, как Оле.', effects: [{ set: '$.c17_naw', value: 'gun' }, { body: 'stress', delta: 2 }] },
      { id: 'c17_naw_wake', label: 'Разбудить {partner.acc}', minutes: 3, terminal: true, goto: 'c17_n_a_gate',
        text: '{partner} садится на кровати сразу, будто и не спал{pm:|а}. — Иди, — говорит {pm:он|она}. — Я к окну.', effects: [{ set: '$.c17_naw', value: 'wake' }] },
    ] }),

  S17({ id: 'c17_n_a_gate', for: 'any', chapter: 'ch3', title: 'У задней калитки', camp: tense14, ambient: cold,
    text: [{ text: 'За калиткой стоит человек в свитере и носках. Седая щетина. Вокруг пояса верёвка, её конец волочится по инею.\n\nКай. Ты видел{m:|а} его вчера в колонии, в домике одиннадцать. Он давит на калитку грудью, раз за разом, и поворачивает голову на кур.' },
      { when: { v: 'A.c16_gatefix', op: '==', value: 'board' }, text: 'Доска и проволока держат. Калитка гнётся, но не открывается.' },
      { when: not({ v: 'A.c16_gatefix', op: '==', value: 'board' }), text: 'Крючок прыгает в петле. Ещё немного, и выскочит.' }],
    actions: [
      { id: 'c17_nag_cab', label: 'Увести его стуком в пустую кабину и захлопнуть', minutes: 15, risky: true, terminal: true, goto: 'c17_n_a_jannes',
        text: 'Ты стучишь по борту фургона под навесом. Кай поворачивается. Ты открываешь калитку и отходишь к кабине, стуча на каждом шаге. Он идёт за звуком. У открытой двери ты отступаешь за неё. Кай натыкается на сиденье и валится внутрь. Ты захлопываешь дверь.\n\nКабина снова занята.', effects: [{ set: '$.c17_nag', value: 'cab' }, { body: 'stress', delta: 4 }] },
      { id: 'c17_nag_rope', label: 'Схватить конец верёвки и привязать к столбу', minutes: 10, risky: true, terminal: true, goto: 'c17_n_a_jannes',
        text: 'Ты тянешься через калитку за верёвкой. Кай разворачивается на движение и хватает тебя за рукав. Хватка как тиски. Ты бьёшь его по руке и вырываешься. Верёвка в руке. Ты обматываешь её вокруг столба калитки, раз, другой, третий.\n\nКай стоит, привязанный, и смотрит на кур.', effects: [{ set: '$.c17_nag', value: 'rope' }, { injure: 'bruise', site: 'rightArm', severity: 1 }, { body: 'stress', delta: 5 }] },
      { id: 'c17_nag_wait', label: 'Не открывать и ждать, кто за ним придёт', minutes: 40, terminal: true, goto: 'c17_n_a_jannes',
        text: 'Ты стоишь по эту сторону калитки. Кай по ту. Сорок минут. Он давит, отступает, давит снова. Ты не двигаешься. Ноги в ботинках на босу ногу перестают чувствовать холод.\n\nПотом на насыпи появляется красный огонёк. Бегом.', effects: [{ set: '$.c17_nag', value: 'wait' }, { body: 'fatigue', delta: 4 }] },
    ] }),

  S17({ id: 'c17_n_a_jannes', for: 'any', chapter: 'ch3', title: 'Яннес', camp: tense14, ambient: cold,
    text: [{ text: 'Яннес прибегает через поле, задыхаясь. Налобный фонарь, нож на поясе, рот открыт.\n\n— Mama hat ihn rausgelassen, — говорит он, когда может говорить. — Mit Absicht. Sie sagt, er soll einmal frei gehen. Nicht in Brandts Käfig.\n\nМама его выпустила. Нарочно. Говорит, пусть хоть раз пойдёт свободно. Не в клетке у Брандта.\n\nОн смотрит на отца. Потом на тебя.' }],
    actions: [
      { id: 'c17_naj_walk', label: 'Отвести Кая с ним обратно в колонию', minutes: 90, activity: 'moderate', terminal: true, goto: 'c17_n_a_hen',
        text: 'Вы ведёте Кая по шпалам вдвоём, на верёвке. Час с лишним. У колонии Уте молча берёт мужа за руку и сама застёгивает цепь на щиколотке. Поверх бинта.\n\nДомой ты возвращаешься в пятом часу.', effects: [{ set: '$.c17_naj', value: 'walk' }, jannes(2), ute(1)] },
      { id: 'c17_naj_dawn', label: 'Предложить подождать до рассвета', minutes: 10, terminal: true, goto: 'c17_n_a_hen',
        text: 'Яннес садится на ступеньку крыльца, прямо на иней.\n\n— Bis es hell wird, — соглашается он.\n\nПока не рассветёт.\n\nТы приносишь ему одеяло. Он засыпает сидя. На рассвете он уводит отца по шпалам, на верёвке.', effects: [{ set: '$.c17_naj', value: 'dawn' }, jannes(1)] },
      { id: 'c17_naj_ask', label: 'Спросить, что он теперь скажет матери', minutes: 8, terminal: true, goto: 'c17_n_a_hen',
        text: '— Nichts, — говорит Яннес. — Was soll ich sagen? Dass er lieber zu euren Hühnern wollte als in den Wald?\n\nНичего. Что я ей скажу? Что он пошёл к вашим курам, а не в лес?\n\nОн смеётся, и смех переходит в кашель. Через час он уводит отца по шпалам, на верёвке.', effects: [{ set: '$.c17_naj', value: 'ask' }, jannes(1)] },
    ] }),

  S17({ id: 'c17_n_b_wake', for: 'any', chapter: 'ch3', title: 'Звон', camp: house14,
    text: [
      { text: 'Ты просыпаешься от звона и кур. Внизу хлопает дверь: {A} вышел во двор. В окне качается красный свет фонаря.' },
      { when: ninaHere, text: 'Нина стоит в дверях твоей комнаты в одеяле.\n\n— Кто там? — шепчет она. — Это не… — Она не договаривает.' },
    ],
    actions: [
      { id: 'c17_nbw_nina', label: 'Увести Нину от окна и сесть с ней', when: ninaHere, minutes: 10, terminal: true, goto: 'c17_n_b_watch',
        text: 'Вы сидите на Нининой раскладушке, спиной к окну. Она держит тебя за руку и слушает двор. «Это не папа, — говорит она через минуту. — Папа в колонии. Я знаю».', effects: [{ set: '$.c17_nbw', value: 'nina' }, nina(1)] },
      { id: 'c17_nbw_down', label: 'Взять второй фонарь и выйти на крыльцо', minutes: 5, terminal: true, goto: 'c17_n_b_watch',
        text: 'Ты стоишь на крыльце с фонарём. Свет не включаешь. Отсюда видно калитку и тёмную фигуру за ней.', effects: [{ set: '$.c17_nbw', value: 'down' }] },
      { id: 'c17_nbw_window', label: 'Смотреть из окна', minutes: 5, terminal: true, goto: 'c17_n_b_watch',
        text: 'Ты прижимаешься лбом к холодному стеклу. Двор как на ладони: калитка, навес, красный свет {A.gen}.', effects: [{ set: '$.c17_nbw', value: 'window' }] },
    ] }),

  S17({ id: 'c17_n_b_watch', for: 'any', chapter: 'ch3', title: 'Кто за калиткой', camp: house14,
    text: [{ text: 'За калиткой человек в свитере. Верёвка волочится по инею. Кай. Ты видел{m:|а} его на видео у Уте.\n\nПотом на насыпи появляется красный огонёк, бегом. Яннес. Он и {A} долго стоят у калитки и о чём-то говорят. Кая уводят по шпалам на верёвке.' }],
    actions: [
      { id: 'c17_nbwt_tea', label: 'Сделать чай и ждать {A.acc} на кухне', minutes: 15, terminal: true, goto: 'c17_n_back',
        text: 'Ты ставишь чайник на плиту. Когда {A} возвращается, кружка уже горячая. {pm:Он|Она} держит её, не отпивая, пока не перестают трястись руки.', effects: [{ set: '$.c17_nbwt', value: 'tea' }] },
      { id: 'c17_nbwt_nina', label: 'Посидеть с Ниной, пока не уснёт', when: ninaHere, minutes: 25, terminal: true, goto: 'c17_n_back',
        text: 'Нина засыпает не сразу. Перед сном говорит: «Он к нам пришёл. Почему к нам?» Ты не знаешь, что ответить.', effects: [{ set: '$.c17_nbwt', value: 'nina' }, nina(1)] },
      { id: 'c17_nbwt_sleep', label: 'Лечь обратно', minutes: 5, terminal: true, goto: 'c17_n_back',
        text: 'Ты ложишься, но не спишь. Слушаешь, как скрипит калитка. Потом шаги {A.gen} на лестнице.', effects: [{ set: '$.c17_nbwt', value: 'sleep' }] },
    ] }),

  S17({ id: 'c17_n_back', for: 'any', chapter: 'ch3', title: 'До утра', camp: house14,
    text: [{ text: 'Дом снова затихает. Куры в курятнике бормочут и успокаиваются.' }],
    actions: [
      { id: 'c17_nb_tea', label: 'Сначала выпить горячего', minutes: 10, terminal: true, outcomes: [{ id: 'a', when: A17, goto: 'c17_dawn' }, { id: 'b', goto: 'c17_n_b_gate' }],
        text: 'Чай обжигает пальцы через кружку. Дрожь уходит не сразу, сначала из рук, потом из коленей.', effects: [{ set: '$.c17_nb', value: 'tea' }, { body: 'stress', delta: -1 }, { restUntil: at(17, 6), sleeping: true }] },
      { id: 'c17_nb_sleep', label: 'Спать до рассвета', minutes: 1, terminal: true, outcomes: [{ id: 'a', when: A17, goto: 'c17_dawn' }, { id: 'b', goto: 'c17_n_b_gate' }],
        text: 'Ты засыпаешь, едва коснувшись подушки.', effects: [{ set: '$.c17_nb', value: 'sleep' }, { restUntil: at(17, 6), sleeping: true }] },
    ] }),


  S17({ id: 'c17_n_b_gate', for: 'any', chapter: 'ch3', title: 'Следы', camp: yard14, ambient: cold,
    text: [
      { text: 'Ты встаёшь в шесть, раньше всех, и выходишь к задней калитке. На инее за ней следы в носках, много, по кругу, как у зверя в клетке. На перекладине клок серой шерсти от свитера.' },
      { when: { v: 'A.c16_gatefix', op: '==', value: 'board' }, text: 'Доска, которую {A} прибил вчера, выгнулась, но держит. Проволока натянута струной.' },
      { when: not({ v: 'A.c16_gatefix', op: '==', value: 'board' }), text: 'Крючок на калитке разогнут. Ещё немного, и он бы выскочил.' },
    ],
    actions: [
      { id: 'c17_nbg_fix', label: 'Укрепить калитку, пока все спят', minutes: 20, activity: 'moderate', terminal: true, goto: 'c17_dawn',
        text: 'Ты выпрямляешь крючок молотком и добавляешь второй, выше. Пальцы мёрзнут без перчаток. Когда заканчиваешь, небо над насыпью уже серое.', effects: [{ set: '$.c17_nbg', value: 'fix' }, { set: 'w.c17_gate_fixed', value: true }, { restUntil: at(17, 6, 25) }] },
      { id: 'c17_nbg_wool', label: 'Снять клок шерсти и отнести Уте', minutes: 5, terminal: true, goto: 'c17_dawn',
        text: 'Ты снимаешь шерсть с перекладины и кладёшь в карман. Глупо, наверное. Но Уте вяжет. Или вязала.', effects: [{ set: '$.c17_nbg', value: 'wool' }, { restUntil: at(17, 6, 25) }] },
      { id: 'c17_nbg_back', label: 'Вернуться в тепло', minutes: 3, terminal: true, goto: 'c17_dawn',
        text: 'Ты возвращаешься в дом и ставишь чайник. Следы на инее растают к восьми.', effects: [{ set: '$.c17_nbg', value: 'back' }, { restUntil: at(17, 6, 25) }] },
    ] }),

  // ───────────── Утро ─────────────
  S17({ id: 'c17_dawn', for: 'any', chapter: 'ch3', title: 'Половина седьмого', camp: yard14, ambient: cold,
    text: [
      { text: 'Утро серое, без инея. Ночью потеплело, с крыши капает.' },
      { when: flag('w.c16_gen'), text: 'Генератор заводится с третьего раза. Лампа на кухне, телефоны на зарядке. До половины десятого.' },
      { when: take, text: 'В половине седьмого на дороге скрипит колесо. Тобиас толкает чужую тачку. В тачке человек под одеялом, ремни, мотоциклетный шлем с заклеенным визором. Из-под шлема виден край цветастого платка.' },
      { when: refused, text: 'Без двадцати семь мимо калитки проезжает Тобиас на велосипеде, в форме. Он не сбавляет ход и не поворачивает головы.' },
    ],
    actions: [
      { id: 'c17_dn_albers', label: 'Открыть ему ворота', when: take, minutes: 3, terminal: true, outcomes: split('c17_a_albers', 'c17_b_albers'), effects: [{ set: '$.c17_dn', value: 'albers' }] },
      { id: 'c17_dn_hello', label: 'Сначала поздороваться с Тобиасом', when: take, minutes: 4, terminal: true, outcomes: split('c17_a_albers', 'c17_b_albers'),
        text: '— Morgen, — говорит Тобиас. Голос хриплый, будто он не спал. — Sie hat die Fahrt gut überstanden.\n\nДоброе утро. Дорогу она перенесла хорошо.', effects: [{ set: '$.c17_dn', value: 'hello' }, tobias(1)] },
      { id: 'c17_dn_wave', label: 'Поднять руку ему вслед', when: refused, minutes: 2, terminal: true, goto: 'c17_breakfast',
        text: 'Тобиас не оборачивается. Уже у поворота он поднимает руку. Не машет. Просто поднимает.', effects: [{ set: '$.c17_dn', value: 'wave' }, toBreakfast] },
      { id: 'c17_dn_inside', label: 'Остаться в доме', when: refused, minutes: 2, terminal: true, goto: 'c17_breakfast',
        text: 'Ты не выходишь. Смотришь из-за занавески, пока велосипед не скрывается за деревьями.', effects: [{ set: '$.c17_dn', value: 'inside' }, toBreakfast] },
    ] }),

  S17({ id: 'c17_a_albers', for: 'any', chapter: 'ch3', title: 'Маргит', camp: yard14, ambient: cold,
    text: [{ text: 'Вы с Тобиасом закатываете тачку в сарай. В балке под крышей кольцо, к нему когда-то привязывали телёнка. Тобиас достаёт цепь и замок. Руки у него трясутся так, что ключ дважды падает в солому.\n\n— Mama, — говорит он шлему. — Das ist der Hof von Henrike. Hier bist du sicher.\n\nМама. Это хутор Хенрике. Здесь ты в безопасности.' }],
    actions: [
      { id: 'c17_aa_chain', label: 'Взять у него замок и застегнуть самому', minutes: 10, terminal: true, goto: 'c17_breakfast',
        text: 'Ты застёгиваешь цепь на кольце, потом на щиколотке. Маргит не дёргается. Она поворачивает голову в шлеме на кудахтанье за стеной.\n\nТобиас стоит у двери и смотрит в пол.', effects: [{ set: '$.c17_aa', value: 'chain' }, tobias(2), toBreakfast] },
      { id: 'c17_aa_light', label: 'Держать свет, пока он делает сам', minutes: 12, terminal: true, goto: 'c17_breakfast',
        text: 'Тобиас справляется с третьей попытки. Потом долго стоит на коленях в соломе рядом с матерью. Ты держишь фонарь и смотришь на стену.\n\nНа прощание он говорит тебе: «Donnerstag». В четверг.', effects: [{ set: '$.c17_aa', value: 'light' }, tobias(1), toBreakfast] },
      { id: 'c17_aa_helmet', label: 'Спросить, можно ли снять с неё шлем', minutes: 8, risky: true, terminal: true, goto: 'c17_breakfast',
        text: 'Тобиас качает головой.\n\n— Nicht im Hellen, — говорит он. — Im Hellen ist sie unruhig. Abends. Wenn ihr wollt.\n\nНе при свете. При свете она беспокойная. Вечером. Если захотите.', effects: [{ set: '$.c17_aa', value: 'helmet' }, toBreakfast] },
    ] }),

  S17({ id: 'c17_b_albers', for: 'any', chapter: 'ch3', title: 'Солома', camp: yard14, ambient: cold,
    text: [
      { text: 'Пока {A} и Тобиас закатывают тачку в сарай, ты стелешь свежую солому у стены и ставишь рядом миску с водой. Миску Хенрике держала для кошки. Кошки нет уже неделю.' },
      { when: ninaHere, text: 'Нина стоит в дверях сарая. Смотрит на платок, торчащий из-под шлема.\n\n— У мамы был такой, — говорит она. — Похожий.' },
    ],
    actions: [
      { id: 'c17_ba_water', label: 'Поставить миску ближе, чтобы дотянулась', minutes: 6, terminal: true, goto: 'c17_breakfast',
        text: 'Ты придвигаешь миску на длину цепи. Тобиас видит и кивает тебе. Губы у него сжаты в нитку.', effects: [{ set: '$.c17_ba', value: 'water' }, tobias(1), toBreakfast] },
      { id: 'c17_ba_nina', label: 'Увести Нину в дом', when: ninaHere, minutes: 5, terminal: true, goto: 'c17_breakfast',
        text: 'Нина идёт сама, не споря. На крыльце оборачивается.\n\n— Она теперь как папа была, — говорит она. — У вас под навесом. Только в сарае.', effects: [{ set: '$.c17_ba', value: 'nina' }, nina(1), toBreakfast] },
      { id: 'c17_ba_ask', label: 'Спросить Тобиаса, как она любит, чтобы с ней говорили', minutes: 8, terminal: true, goto: 'c17_breakfast',
        text: '— Sie hat gern Radio gehört, — говорит Тобиас. — Schlager. Furchtbar. — Он почти улыбается. — Wenn ihr ein Radio habt…\n\nЛюбила радио. Шлягеры. Ужасные. Если у вас есть радио…', effects: [{ set: '$.c17_ba', value: 'ask' }, tobias(2), toBreakfast] },
    ] }),

  S17({ id: 'c17_breakfast', for: 'any', chapter: 'ch3', title: 'Завтрак', camp: kitchen14,
    text: [
      { text: 'На столе каша, хлеб Кёлер и чайник. За окном светлеет медленно, будто нехотя.' },
      { when: ninaHere, text: 'Нина ест молча и смотрит в окно, на дорогу к насыпи.' },
      { when: all(ninaAway, jensAlive), text: 'Телефон вибрирует. Нина: «Ist Papa okay? Ich hab schlecht geträumt». Папа в порядке? Мне плохое приснилось.' },
      { when: all(ninaAway, not(jensAlive)), text: 'Телефон вибрирует. Нина: «Bei euch alles okay? Ich hab schlecht geträumt». У вас всё в порядке? Мне плохое приснилось.' },
      { when: take, text: 'Из сарая доносится звон цепи. Потом тишина.' },
      { when: warn, text: 'После ночи на шпалах ноги гудят, а в голове пусто.' },
    ],
    actions: [
      { id: 'c17_bf_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, outcomes: afterBreakfast, enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Каша горячая. Ты съедаешь всё и только потом понимаешь, как был{m:|а} голод{m:ен|на}.', effects: [{ set: '$.c17_bf', value: 'eat' }, meal('eat')] },
      { id: 'c17_bf_pack', label: 'Отложить свою порцию на потом', minutes: 3, terminal: true, outcomes: afterBreakfast, enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Ты заворачиваешь хлеб с кашей в салфетку. Утро будет длинным.', effects: [{ set: '$.c17_bf', value: 'pack' }, meal('pack')] },
      { id: 'c17_bf_tea', label: 'Только чай', minutes: 10, terminal: true, outcomes: afterBreakfast,
        text: 'Ты пьёшь чай и смотришь, как остывает каша в чужих тарелках.', effects: [{ set: '$.c17_bf', value: 'tea' }] },
    ] }),

  S17({ id: 'c17_a_can', for: 'any', chapter: 'ch3', title: 'Канистра', camp: yard14, ambient: day16,
    text: [{ text: 'Два литра из деревни стоят у сарая. На утро генератору или в бак Corsa.' }],
    actions: [
      { id: 'c17_ac_gen', label: 'Залить в генератор: ещё полдня света', minutes: 6, terminal: true, outcomes: afterCan,
        text: 'Бензин уходит в бак генератора с бульканьем. До обеда розетки будут работать, если кто-то останется дома.', effects: [{ set: '$.c17_ac', value: 'gen' }, { fillCan: 'can_petrol_10', liters: -2 }, { set: 'w.c17_gen', value: true }] },
      { id: 'c17_ac_car', label: 'Залить в Corsa', minutes: 6, terminal: true, outcomes: afterCan,
        text: 'Ты заливаешь бензин через горлышко, стараясь не пролить. Стрелка на приборе не сдвигается. Два литра — это не стрелка. Это двадцать пять километров.', effects: [{ set: '$.c17_ac', value: 'car' }, { refuel: 'opel_corsa', liters: 2, fromCan: 'can_petrol_10' }] },
      { id: 'c17_ac_keep', label: 'Оставить в канистре на крайний случай', minutes: 2, terminal: true, outcomes: afterCan,
        text: 'Канистра остаётся у сарая. Крайний случай теперь каждый день. Но ещё не сегодня.', effects: [{ set: '$.c17_ac', value: 'keep' }] },
    ] }),

  // ───────────── A утром: Брандт ─────────────
  S17({ id: 'c17_a_vgo', for: 'any', chapter: 'ch3', title: 'К Брандту', location: lane, ambient: day16,
    text: [
      { text: 'Ты идёшь в Йестебург той же дорогой, что вчера. Старик у забора уже работает. Кивает тебе, не прерываясь.' },
      { when: { has: 'c16_wristband' }, text: 'Браслет в кармане. Ты достаёшь его и перечитываешь: «Klinikum Buchholz. Station 4. 09.11».' },
      { when: { v: '$.c16_aby', op: '==', value: 'photo' }, text: 'Фотография браслета в телефоне. Если хватит заряда.' },
      { when: not(flag('$.c16_aby')), text: 'Доказательств у тебя нет. Только то, что ты видел{m:|а} у бочки и в спортзале.' },
    ],
    actions: [
      { id: 'c17_avg_think', label: 'По дороге решить, что сказать', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c17_a_brandt',
        text: 'Ты повторяешь про себя слова, как перед экзаменом. Немецкие не помогают. Лучше всего держатся простые: «Не оттуда. Посмотрите сами».', effects: [{ set: '$.c17_avg', value: 'think' }, { restUntil: at(17, 9) }] },
      { id: 'c17_avg_sammel', label: 'Сначала зайти в пункт к мальчику', minutes: 55, activity: 'moderate', move: true, terminal: true, goto: 'c17_a_brandt',
        text: 'Мальчик спит. Мать сидит рядом, как вчера. Увидев тебя, она встаёт.\n\n— Er hat die Nacht durchgeschlafen, — говорит она. — Fieber ist weg.\n\nОн проспал всю ночь. Температуры нет.\n\nЭто ничего не значит. Она знает это не хуже тебя. Но улыбается.', effects: [{ set: '$.c17_avg', value: 'sammel' }, { set: '$.c17_boy_better', value: true }, { restUntil: at(17, 9) }] },
    ] }),

  S17({ id: 'c17_a_brandt', for: 'any', chapter: 'ch3', title: 'Пожарная часть', location: village, camp: village16, ambient: day16,
    text: [
      { text: 'Брандт сидит за столом в глубине гаража, над картой района. На карте красным кружком обведена колония у насыпи.\n\n— Sie schon wieder, — говорит он. Не зло.\n\nОпять вы.' },
      { when: { v: '$.c16_ab', op: '==', value: 'lie' }, text: '— Gestern wussten Sie nichts.\n\nВчера вы ничего не знали.' },
      { when: flag('$.c17_boy_better'), text: 'Ты говоришь, что был{m:|а} у его внука. Брандт поднимает голову.' },
    ],
    actions: [
      { id: 'c17_ab_band', label: 'Положить браслет на карту', when: { has: 'c16_wristband' }, minutes: 10, terminal: true, goto: 'c17_a_brandt2',
        text: 'Брандт смотрит на браслет долго. Берёт его. Читает вслух: «Station vier». Кладёт обратно на карту, рядом с красным кружком.\n\n— Neurologie, — говорит он. — Meine Frau lag da. Vor drei Jahren.\n\nНеврология. Там лежала моя жена. Три года назад.', effects: [{ set: '$.c17_ab', value: 'band' }, { set: '$.c17_brandt', value: 'convinced' }, { take: 'c16_wristband' }, brandt(3)] },
      { id: 'c17_ab_photo', label: 'Показать фото браслета', when: { v: '$.c16_aby', op: '==', value: 'photo' }, minutes: 10, terminal: true, goto: 'c17_a_brandt2',
        text: 'Брандт берёт твой телефон и увеличивает снимок двумя пальцами. Неумело, как все, кто привык к кнопкам.\n\n— Station vier, — читает он. — Neun-elf. — Возвращает телефон. — Das hat meine Tochter mir nicht gesagt.\n\nЧетвёртое отделение. Девятое ноября. Этого дочь мне не сказала.', effects: [{ set: '$.c17_ab', value: 'photo' }, { set: '$.c17_brandt', value: 'convinced' }, { charge: 'phone', delta: -1 }, brandt(2)] },
      { id: 'c17_ab_word', label: 'Рассказать, что видел{m:|а}', minutes: 12, terminal: true, goto: 'c17_a_brandt2',
        text: 'Ты рассказываешь: остановка, больничная рубашка, браслет, Бухгольц. Колония в другой стороне, за путями.\n\nБрандт слушает, глядя на карту.\n\n— Das sagt meine Tochter nicht, — говорит он наконец. — Sie sagt: weiß nicht.\n\nДочь так не говорит. Она говорит: не знаю.', effects: [{ set: '$.c17_ab', value: 'word' }, { set: '$.c17_brandt', value: 'doubt' }, brandt(1)] },
      { id: 'c17_ab_see', label: 'Позвать его посмотреть на колонию самому', minutes: 10, terminal: true, goto: 'c17_a_brandt2',
        text: 'Брандт смотрит на тебя поверх очков.\n\n— Allein? — спрашивает он. — Zu denen?\n\nОдному? К ним?\n\nТы говоришь: не одному. С вами. Уте покажет всех, по именам. Брандт долго молчит.\n\n— Morgen um sieben, — говорит он. — Eine Stunde vor den Soldaten. Eine halbe Stunde, nicht mehr.\n\nЗавтра в семь. За час до солдат. Полчаса, не больше.', effects: [{ set: '$.c17_ab', value: 'see' }, { set: '$.c17_brandt', value: 'doubt' }, { set: 'w.c17_brandt_seven', value: true }, brandt(2)] },
    ] }),

  S17({ id: 'c17_a_brandt2', for: 'any', chapter: 'ch3', title: 'Что он решит', location: village, camp: village16, ambient: day16,
    text: [
      { when: { v: '$.c17_brandt', op: '==', value: 'convinced' }, text: 'Брандт складывает карту пополам. Красный кружок остаётся снаружи.\n\n— Dann war es nicht die Bahn, — говорит он. — Gut. — Пауза. — Aber eine Kette hält nicht ewig. Mittwoch komme ich trotzdem. Ohne Soldaten. Mit Frau Reimers reden. Wenn ihr dabei seid.\n\nЗначит, не с насыпи. Хорошо. Но цепь не держит вечно. В среду я всё равно приду. Без солдат. Поговорить с фрау Раймерс. Если вы будете рядом.' },
      { when: { v: '$.c17_brandt', op: '==', value: 'doubt' }, text: 'Брандт молчит, постукивая карандашом по карте.\n\n— Ich habe einen Enkel mit einem Biss im Bein, — говорит он. — Und eine Kolonie mit sieben Bestien an der Bahn. Mittwoch, acht Uhr. — Он смотрит на тебя. — Wenn Sie dabei sein wollen, kommen Sie.\n\nУ меня внук с укусом на ноге. И колония с семью зверями у насыпи. Среда, восемь. Если хотите быть там, приходите.' },
    ],
    actions: [
      { id: 'c17_ab2_come', label: 'Сказать: будем там', minutes: 4, terminal: true, goto: 'c17_a_vback',
        text: 'Брандт кивает и записывает что-то в тетрадь. Наверное, твоё имя.', effects: [{ set: '$.c17_ab2', value: 'come' }, brandt(1)] },
      { id: 'c17_ab2_grandson', label: 'Спросить про внука', minutes: 6, terminal: true, goto: 'c17_a_vback',
        text: '— Er heißt Mats, — говорит Брандт. Впервые за весь разговор у него меняется голос. — Er wollte Feuerwehrmann werden. Wie ich.\n\nЕго зовут Матс. Хотел стать пожарным. Как я.\n\nОн отворачивается к карте.', effects: [{ set: '$.c17_ab2', value: 'grandson' }, brandt(2)] },
      { id: 'c17_ab2_ask', label: 'Попросить подождать хотя бы до четверга', minutes: 6, risky: true, terminal: true, goto: 'c17_a_vback',
        text: '— Bis Donnerstag, — повторяет Брандт. — Warum Donnerstag?\n\nПочему до четверга?\n\nТы не можешь объяснить, что к четвергу Тобиас что-то решит. Ты просто стоишь. Брандт ждёт, потом машет рукой: иди.', effects: [{ set: '$.c17_ab2', value: 'ask' }] },
    ] }),

  S17({ id: 'c17_a_vback', for: 'any', chapter: 'ch3', title: 'Обратно', location: lane, ambient: day16,
    text: [
      { text: 'На обратной дороге тебя обгоняет военный грузовик, потом ещё один. В кузове солдаты, сидят спиной к спине. Один из них поднимает руку. Тобиас.' },
      { when: take, text: 'Он смотрит на тебя, пока грузовик не скрывается за поворотом. Ты понимаешь его без слов: «Как она?»' },
      { when: refused, text: 'Он опускает руку и отворачивается раньше, чем ты успеваешь ответить.' },
    ],
    actions: [
      { id: 'c17_avb_wave', label: 'Поднять руку в ответ', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c17_yard',
        text: 'Ты поднимаешь руку. До хутора идёшь быстро и думаешь о кружке на карте.', effects: [{ set: '$.c17_avb', value: 'wave' }, toYard] },
      { id: 'c17_avb_walk', label: 'Идти, не оборачиваясь', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c17_yard',
        text: 'Ты идёшь, глядя под ноги. Грузовики уезжают в сторону насыпи. Ещё не среда. Пока они просто ездят.', effects: [{ set: '$.c17_avb', value: 'walk' }, toYard] },
    ] }),

  // ───────────── A утром: насос ─────────────
  S17({ id: 'c17_a_pump', for: 'any', chapter: 'ch3', title: 'Насос', location: garden, ambient: day16,
    text: [
      { text: 'Ты идёшь в колонию с ломом и мультитулом: у Яннеса сломан насос. По шпалам сорок минут.' },
      { when: warn, text: 'Днём колония кажется меньше, чем ночью.' },
      { text: 'Колодец на краю колонии, ручная колонка с длинным рычагом. Рычаг обломан у самого шарнира. Яннес сидит рядом на перевёрнутом ведре и курит.\n\n— Sie ist alt, — говорит он про колонку. — Wie alles hier.\n\nОна старая. Как всё тут.' },
    ],
    actions: [
      { id: 'c17_ap_crowbar', label: 'Приладить лом вместо рычага и обмотать проволокой', minutes: 45, activity: 'moderate', terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['technical', 'strength'], difficulty: 3 }, goto: 'c17_a_kai2',
            text: 'Лом входит в шарнир туго, с третьей попытки. Ты обматываешь стык проволокой, виток к витку. Яннес качает. Колонка хрипит, кашляет и даёт воду, рыжую, потом чистую.\n\nЯннес подставляет под струю ладони и пьёт.', effects: [{ set: '$.c17_ap', value: 'fixed' }, { set: 'w.c17_pump', value: true }, jannes(2), ute(1), { restUntil: at(17, 9, 50) }] },
          { id: 'half', goto: 'c17_a_kai2',
            text: 'Лом не держится в шарнире: проволока соскальзывает. Ты пробуешь ещё раз и ещё. В конце концов качать можно, только если второй держит стык руками.\n\n— Besser als der Bach, — говорит Яннес. Лучше, чем ручей.', effects: [{ set: '$.c17_ap', value: 'half' }, { set: 'w.c17_pump', value: true }, jannes(1), { restUntil: at(17, 9, 50) }] },
        ] },
      { id: 'c17_ap_carry', label: 'Не чинить, а помочь натаскать воды из ручья', minutes: 50, activity: 'heavy', terminal: true, goto: 'c17_a_kai2',
        text: 'Ручей в трёхстах метрах, за кустами. Вы носите по два ведра. Двадцать вёдер. Руки к концу не разгибаются.', effects: [{ set: '$.c17_ap', value: 'carry' }, jannes(1), ute(1), { restUntil: at(17, 9, 50) }] },
    ] }),

  S17({ id: 'c17_a_ute', for: 'any', chapter: 'ch3', title: 'Уте днём', location: garden, ambient: day16,
    text: [
      { text: 'Уте выходит из одиннадцатого домика с пустой миской. Кай на цепи, на щиколотке свежий бинт.' },
      { text: '{partner} с Кёлер у четвёртой парцеллы. Кёлер стоит у ставни и не двигается.' },
      { text: '— Mittwoch, — говорит Уте тебе. — Ich gehe nicht weg. Ich stelle mich vor das Tor.\n\nВ среду я не уйду. Встану перед калиткой.' },
    ],
    actions: [
      { id: 'c17_au_brandt', label: 'Рассказать ей про браслет и внука Брандта', when: any({ v: '$.c16_mother', op: '==', value: 'who' }, flag('$.c16_aby')), minutes: 8, terminal: true, goto: 'c17_a_back2',
        text: '— Also nicht von uns, — говорит Уте. — Das wusste ich.\n\nЗначит, не от нас. Я знала.\n\nПотом смотрит на домик одиннадцать и добавляет тише:\n\n— Bis heute Nacht war es so.\n\nДо этой ночи так и было.', effects: [{ set: '$.c17_au', value: 'brandt' }, ute(1)] },
      { id: 'c17_au_move', label: 'Спросить, согласилась бы она увести их отсюда', minutes: 8, terminal: true, goto: 'c17_a_back2',
        text: '— Wohin? — Уте разводит руками. — Zu euch? — Она не смеётся. Смотрит на тебя так, будто проверяет, не шутка ли это. — Ihr habt einen Brunnen. Und Scheunen.\n\nКуда? К вам? У вас колодец. И сараи.', effects: [{ set: '$.c17_au', value: 'move' }, { set: 'w.c17_move_asked', value: true }] },
      { id: 'c17_au_jannes', label: 'Отойти с Яннесом и спросить, чего хочет он', minutes: 8, terminal: true, goto: 'c17_a_back2',
        text: 'Яннес бросает окурок в ведро.\n\n— Dass es aufhört, — говорит он. — Ohne Soldaten. Ohne dass Mama zusieht. — Пауза. — Ich weiß, das geht nicht.\n\nЧтобы это кончилось. Без солдат. Чтобы мама не смотрела. Знаю, так не бывает.', effects: [{ set: '$.c17_au', value: 'jannes' }, { set: '$.c17_jannes_wish', value: true }, jannes(1)] },
    ] }),

  S17({ id: 'c17_a_back2', for: 'any', chapter: 'ch3', title: 'По шпалам', location: field, ambient: day16,
    text: [{ text: 'Ты идёшь обратно один. Лом на плече, руки пахнут ржавчиной. У будки обходчика за спиной слышен мотор: по полевой дороге вдоль насыпи едет военный грузовик.' }],
    actions: [
      { id: 'c17_ab2b_walk', label: 'Идти дальше, не оглядываясь', minutes: 10, activity: 'moderate', move: true, terminal: true, goto: 'c17_a_patrol',
        text: 'Ты не оглядываешься. Мотор всё ближе. Потом грузовик обгоняет тебя и встаёт поперёк дороги.', effects: [{ set: '$.c17_ab2b', value: 'walk' }] },
      { id: 'c17_ab2b_watch', label: 'Остановиться и смотреть', minutes: 10, terminal: true, goto: 'c17_a_patrol',
        text: 'Грузовик останавливается у колонии. Солдаты в кузове смотрят на крыши. Кто-то показывает пальцем. Потом грузовик разворачивается и едет к тебе.', effects: [{ set: '$.c17_ab2b', value: 'watch' }, { body: 'stress', delta: 1 }] },
    ] }),

  // ───────────── B утром: Кёлер ─────────────
  S17({ id: 'c17_b_koehler', for: 'any', chapter: 'ch3', title: 'В девять', camp: yard14, ambient: day16,
    text: [
      { text: 'Ровно в девять у калитки фрау Кёлер. В руках термос и что-то в полотенце. Пахнет свежим хлебом.\n\n— Für meinen Bruder, — говорит она. — Er hat Brot immer gemocht. Er war Bäcker. Wie ich.\n\nДля брата. Он всегда любил хлеб. Он был пекарем. Как я.' },
      { when: all(ninaHere, jensAlive), text: 'Нина стоит на крыльце в куртке.\n\n— Я тоже, — говорит она. — К папе. Это же не среда, это просто так.' },
    ],
    actions: [
      { id: 'c17_bk_go', label: 'Пойти с Кёлер', minutes: 3, terminal: true, goto: 'c17_b_walk',
        text: 'Кёлер берёт тебя под руку, как старую знакомую.', effects: [{ set: '$.c17_bk', value: 'go' }, koehler(1), toKoehler] },
      { id: 'c17_bk_nina', label: 'Взять Нину с собой', when: all(ninaHere, jensAlive), minutes: 3, terminal: true, goto: 'c17_b_walk',
        text: 'Нина бежит наверх за письмом и возвращается, застёгивая куртку на ходу.', effects: [{ set: '$.c17_bk', value: 'nina' }, { set: '$.c17_nina_came', value: true }, nina(2), toKoehler] },
      { id: 'c17_bk_ninahome', label: 'Попросить Нину остаться: присмотреть за двором', when: all(ninaHere, jensAlive), minutes: 4, terminal: true, goto: 'c17_b_walk',
        text: 'Нина смотрит на тебя долго.\n\n— Ладно, — говорит она. — Только письмо отнеси. — Она отдаёт тебе сложенный листок из тетради по биологии.', effects: [{ set: '$.c17_bk', value: 'ninahome' }, { set: '$.c17_letter', value: true }, toKoehler] },
    ] }),

  S17({ id: 'c17_b_walk', for: 'any', chapter: 'ch3', title: 'По шпалам с Кёлер', location: field, ambient: day16,
    text: [
      { text: 'Кёлер идёт медленно, держась за твою руку на каждой обледенелой шпале. Говорит всю дорогу, будто боится замолчать.\n\n— Werner hat die Brötchen gemacht. Ich das Brot. Vierzig Jahre. Am Donnerstag hat ihn ein Kunde gebissen. Ein Stammkunde. Herr Jessen. Wollte Mohnbrötchen.\n\nВернер пёк булочки. Я хлеб. Сорок лет. В четверг его укусил покупатель. Постоянный. Господин Йессен. Хотел булочки с маком.' },
      { when: { v: '$.c17_bk', op: '==', value: 'nina' }, text: 'Нина идёт впереди и считает шпалы. Сбивается и начинает сначала.' },
    ],
    actions: [
      { id: 'c17_bw_listen', label: 'Слушать и не перебивать', minutes: 45, activity: 'moderate', move: true, terminal: true, goto: 'c17_b_werner',
        text: 'Кёлер рассказывает про тесто, про печь, про то, как Вернер пел в четыре утра, пока месил. Фальшиво. Она передразнивает и смеётся. У колонии замолкает.', effects: [{ set: '$.c17_bw', value: 'listen' }, koehler(1)] },
      { id: 'c17_bw_ask', label: 'Спросить, почему она не ходила раньше', minutes: 45, activity: 'moderate', move: true, terminal: true, goto: 'c17_b_werner',
        text: '— Weil ich dachte, wenn ich ihn nicht sehe, ist er noch in der Backstube, — говорит Кёлер. — Mit Mehl im Bart.\n\nПотому что думала: пока я его не вижу, он ещё в пекарне. С мукой в бороде.', effects: [{ set: '$.c17_bw', value: 'ask' }] },
    ] }),

  S17({ id: 'c17_b_werner', for: 'any', chapter: 'ch3', title: 'Четвёртая', location: garden, ambient: day16,
    text: [
      { text: 'Домик четыре. Уте открывает ставню и отходит.\n\nВнутри на стуле сидит крупный мужчина в белом фартуке пекаря. Фартук кто-то выстирал и надел на него. Мука въелась в швы навсегда. Он поворачивает голову на скрип ставни.' },
      { text: 'Кёлер стоит не двигаясь. Потом говорит:\n\n— Er riecht nach Brot. Immer noch.\n\nОн пахнет хлебом. До сих пор.' },
      { when: home, text: 'У колодца на краю колонии {A} возится с колонкой. Яннес держит ведро.' },
    ],
    actions: [
      { id: 'c17_bwe_stand', label: 'Стоять рядом с ней', minutes: 15, terminal: true, goto: 'c17_b_nine',
        text: 'Кёлер разворачивает полотенце и кладёт хлеб на подоконник, у самой ставни. Вернер поворачивается на шорох. Кёлер кивает, будто он сказал «спасибо».', effects: [{ set: '$.c17_bwe', value: 'stand' }, koehler(2)] },
      { id: 'c17_bwe_leave', label: 'Отойти и оставить их вдвоём', minutes: 15, terminal: true, goto: 'c17_b_nine',
        text: 'Ты отходишь к теплице. Издалека видно: Кёлер говорит что-то в ставню, долго. Потом достаёт из кармана муку в бумажном кульке и сыплет на подоконник. Тонкой линией.', effects: [{ set: '$.c17_bwe', value: 'leave' }, koehler(1)] },
      { id: 'c17_bwe_wed', label: 'Спросить, что она будет делать в среду', minutes: 10, terminal: true, goto: 'c17_b_nine',
        text: '— Ich halte seine Hand, — говорит Кёлер. — Egal was. Egal wer.\n\nДержать его за руку. Что бы ни было. Кто бы ни пришёл.', effects: [{ set: '$.c17_bwe', value: 'wed' }, { set: '$.c17_koehler_wed', value: true }] },
    ] }),

  S17({ id: 'c17_b_ute', for: 'any', chapter: 'ch3', title: 'Уте и среда', location: garden, ambient: day16,
    text: [
      { text: 'Уте наливает тебе кофе из термоса. Руки у неё не дрожат.' },
      { when: { v: '$.c17_nbg', op: '==', value: 'wool' }, text: 'Ты отдаёшь ей клок серой шерсти с калитки. Уте долго держит его на ладони, потом прячет в карман фартука.' },
      { when: warn, text: '— Heute Nacht, — говорит она. — Danke. Ihr wart da.\n\nЭтой ночью. Спасибо. Вы пришли.' },
      { when: home, text: '— Er war bei euch, — говорит она. — Heute Nacht. Jannes hat es erzählt. Zu euren Hühnern. — Она качает головой. — Nicht in den Wald. Zu Hühnern.\n\nОн был у вас. Этой ночью. Яннес рассказал. К вашим курам. Не в лес. К курам.' },
      { text: '— Würdet ihr sie nehmen? — спрашивает она вдруг. — Auf euren Hof. Alle sieben. Ihr habt einen Brunnen. Und Scheunen.\n\nВы бы их взяли? К себе на хутор. Всех семерых. У вас колодец. И сараи.' },
    ],
    actions: [
      { id: 'c17_bu_talk', label: 'Сказать: решим с {A.ins}', minutes: 5, terminal: true, outcomes: toJens,
        text: 'Уте кивает. Она не ждала другого ответа. Но и «нет» тоже не ждала.', effects: [{ set: '$.c17_bu', value: 'talk' }, { set: 'w.c17_move_asked', value: true }] },
      { id: 'c17_bu_no', label: 'Сказать честно: вряд ли сможем', minutes: 5, terminal: true, outcomes: toJens,
        text: '— Ich weiß, — говорит Уте. — Ich musste fragen.\n\nЗнаю. Я должна была спросить.', effects: [{ set: '$.c17_bu', value: 'no' }, { set: 'w.c17_move_asked', value: true }] },
      { id: 'c17_bu_truth', label: 'Спросить, отпустила ли она Кая нарочно', when: not(flag('$.c17_ute_truth')), minutes: 6, terminal: true, outcomes: toJens,
        text: 'Уте смотрит на одиннадцатый домик.\n\n— Ja, — говорит она. — Ich wollte, dass er einmal frei geht. Nicht in Brandts Käfig. — Пауза. — Er ist nicht in den Wald gegangen. Er ist zu Menschen gegangen. Das hätte ich wissen müssen.\n\nДа. Хотела, чтобы он хоть раз пошёл свободно. Не в клетку к Брандту. Он пошёл не в лес. Он пошёл к людям. Мне надо было это знать.', effects: [{ set: '$.c17_bu', value: 'truth' }, { set: '$.c17_ute_truth', value: true }, { set: 'w.c17_move_asked', value: true }] },
    ] }),

  S17({ id: 'c17_b_jens', for: 'any', chapter: 'ch3', title: 'Двенадцатая', location: garden, ambient: day16,
    text: [
      { when: not(flag('$.c17_saw_jens')), text: 'Перед уходом ты подходишь к двенадцатому домику. Йенс сидит на матрасе в Нининой шапке, набекрень. Миска полная. Он поворачивает голову на твои шаги.' },
      { when: flag('$.c17_saw_jens'), text: 'Перед уходом ты ещё раз подходишь к двенадцатому домику. Днём Йенс выглядит старше. Шапка всё так же набекрень.' },
      { when: flag('$.c17_nina_came'), text: 'Нина стоит у стекла и читает письмо вслух. По-немецки, медленно, как в школе у доски. Йенс поворачивается то к ней, то к вороне на крыше.' },
    ],
    actions: [
      { id: 'c17_bj_letter', label: 'Положить Нинино письмо на подоконник', when: flag('$.c17_letter'), minutes: 5, terminal: true, goto: 'c17_b_back',
        text: 'Ты кладёшь листок на подоконник и придавливаешь камнем. «Du fehlst mir» видно даже через стекло.', effects: [{ set: '$.c17_bj', value: 'letter' }, nina(1)] },
      { id: 'c17_bj_nina', label: 'Дождаться, пока Нина дочитает', when: flag('$.c17_nina_came'), minutes: 15, terminal: true, goto: 'c17_b_back',
        text: 'Нина дочитывает и складывает листок. Просовывает его в щель ставни. Потом поворачивается к тебе.\n\n— Всё, — говорит она. — Я всё сказала. Теперь можно.\n\nТы не спрашиваешь, что можно.', effects: [{ set: '$.c17_bj', value: 'nina' }, { set: 'w.c17_nina_said', value: true }, nina(2)] },
      { id: 'c17_bj_look', label: 'Постоять минуту и уйти', minutes: 5, terminal: true, goto: 'c17_b_back',
        text: 'Ты стоишь минуту. Йенс поворачивает голову на ворону, на ветер, на тебя. Потом ты уходишь.', effects: [{ set: '$.c17_bj', value: 'look' }] },
    ] }),

  S17({ id: 'c17_b_back', for: 'any', chapter: 'ch3', title: 'Обратно', location: field, ambient: day16,
    text: [
      { text: 'Обратно Кёлер идёт быстрее. Хлеба в руках нет, держаться за тебя ей уже не нужно.' },
      { text: 'По полевой дороге вдоль насыпи ползёт военный грузовик. Солдаты в кузове смотрят на колонию.' },
    ],
    actions: [
      { id: 'c17_bb_koehler', label: 'Проводить Кёлер до её двора', minutes: 50, activity: 'moderate', move: true, terminal: true, goto: 'c17_yard',
        text: 'У своей калитки Кёлер останавливается.\n\n— Danke, — говорит она. — Jetzt kann ich Mittwoch hingehen. Vorher konnte ich nicht.\n\nСпасибо. Теперь в среду я смогу пойти. Раньше не могла.', effects: [{ set: '$.c17_bb', value: 'koehler' }, koehler(1), toYard] },
      { id: 'c17_bb_home', label: 'Идти домой коротким путём', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c17_yard',
        text: 'У поворота к хутору вы расходитесь. Кёлер машет тебе рукой, не оборачиваясь.', effects: [{ set: '$.c17_bb', value: 'home' }, toYard] },
    ] }),

  // ───────────── Полдень ─────────────
  S17({ id: 'c17_noon', for: 'any', chapter: 'ch3', title: 'Полдень', camp: kitchen14,
    text: [
      { text: 'К половине первого вы оба на кухне. На плите суп из картошки и лука. Хлеб Кёлер нарезан.' },
      { when: ninaHere, text: 'Нина сидит на лестнице. Слушает.' },
      { when: take, text: 'В сарае звенит цепь. Маргит ходит по кругу на длину цепи.' },
      { when: garden16('tell'), text: 'Про колонию армии сказали вы. Тобиас знает это. Уте, наверное, тоже.' },
      { text: 'Завтра в восемь у колонии будут Брандт и солдаты. Что делаете вы, решаете вдвоём.' },
    ],
    actions: [
      { id: 'c17_no_eat', label: 'Поесть и решить', minutes: 20, terminal: true, goto: 'c17_checkpoint', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Суп горячий, лук сладкий. Вы едите молча. Потом откладываете ложки одновременно.', effects: [{ set: '$.c17_finished', value: true }, meal('eat'), toCp] },
      { id: 'c17_no_sit', label: 'Сесть с {partner.ins} и решить', minutes: 5, terminal: true, goto: 'c17_checkpoint',
        effects: [{ set: '$.c17_finished', value: true }, toCp] },
      { id: 'c17_no_window', label: 'Сначала постоять у окна', minutes: 5, terminal: true, goto: 'c17_checkpoint',
        text: 'За окном поле, за полем насыпь. Отсюда колонию не видно. Только крыши за рощей.', effects: [{ set: '$.c17_finished', value: true }, toCp] },
    ] }),


  S17({ id: 'c17_n_a_hen', for: 'any', chapter: 'ch3', title: 'Курятник', camp: yard14, ambient: cold,
    text: [{ text: 'Когда всё стихает, ты заглядываешь в курятник с фонарём. Девять кур жмутся на насесте. Десятая лежит у сетки, шея вывернута. Билась о сетку, пока Кай стоял у калитки. Сердце не выдержало или шея.' }],
    actions: [
      { id: 'c17_nah_pluck', label: 'Ощипать её: будет суп', minutes: 30, activity: 'light', terminal: true, goto: 'c17_n_back',
        text: 'Ты ощипываешь курицу на крыльце при красном свете. Перья липнут к пальцам. Хенрике сделала бы это за десять минут. У тебя уходит полчаса.', effects: [{ set: '$.c17_nah', value: 'pluck' }, { place: 'c17_hen', qty: 1, at: 'c3_farm_stock' }] },
      { id: 'c17_nah_bury', label: 'Закопать за курятником', minutes: 15, activity: 'light', terminal: true, goto: 'c17_n_back',
        text: 'Земля мёрзлая сверху, мягкая глубже. Ты закапываешь курицу за курятником. Глупо, наверное. Но есть её ты сейчас не смог{m:|ла} бы.', effects: [{ set: '$.c17_nah', value: 'bury' }] },
      { id: 'c17_nah_koehler', label: 'Отложить для Кёлер: ей нужнее', minutes: 10, terminal: true, goto: 'c17_n_back',
        text: 'Ты заворачиваешь курицу в мешок и вешаешь на гвоздь в холодной кладовке. Утром отнесёшь. Или кто-нибудь отнесёт.', effects: [{ set: '$.c17_nah', value: 'koehler' }, { place: 'c17_hen', qty: 1, at: 'c3_farm_stock' }, { set: 'w.c17_hen_koehler', value: true }] },
    ] }),

  S17({ id: 'c17_w_b_nine', for: 'any', chapter: 'ch3', title: 'Девятая', location: garden, ambient: cold,
    text: [
      { text: 'Уте встаёт, чтобы налить воды в девятый домик. Ты идёшь за ней с фонарём.\n\nВ девятом на кровати сидит женщина в цветастом платке. Маргит Альберс. Руки на коленях, как в приёмной у врача. Она поворачивает голову на красный свет.' },
      { when: albers17('take'), text: '— Morgen früh holt Tobias sie, — говорит Уте. — Zu euch. Das ist gut.\n\nЗавтра рано утром Тобиас её заберёт. К вам. Это хорошо.' },
      { when: albers17('no'), text: '— Tobias wollte sie wegbringen, — говорит Уте. — Niemand nimmt sie.\n\nТобиас хотел её увезти. Никто её не берёт.\n\nОна не упрекает. Просто говорит.' },
    ],
    actions: [
      { id: 'c17_wbn_talk', label: 'Поздороваться с ней, как Уте', minutes: 6, terminal: true, goto: 'c17_w_b_wait',
        text: '— Guten Abend, Frau Albers, — говоришь ты. Голос звучит странно в тишине.\n\nМаргит поворачивает голову на твой голос. Потом на ворону, которая возится на крыше. Уте кивает тебе: правильно.', effects: [{ set: '$.c17_wbn', value: 'talk' }, ute(1)] },
      { id: 'c17_wbn_water', label: 'Подержать ковш, пока Уте наливает', minutes: 6, terminal: true, goto: 'c17_w_b_wait',
        text: 'Ковш на длинной палке. Ты держишь, Уте наливает. Маргит пьёт, наклонившись к миске, жадно, проливая на платок.', effects: [{ set: '$.c17_wbn', value: 'water' }] },
      { id: 'c17_wbn_back', label: 'Вернуться на ступеньку', minutes: 3, terminal: true, goto: 'c17_w_b_wait',
        text: 'Ты возвращаешься на ступеньку одиннадцатого и садишься. Отсюда видно насыпь.', effects: [{ set: '$.c17_wbn', value: 'back' }] },
    ] }),

  S17({ id: 'c17_a_kai2', for: 'any', chapter: 'ch3', title: 'Кай днём', location: garden, ambient: day16,
    text: [
      { text: 'Уте перевязывает Каю щиколотку. Он сидит на матрасе и раскачивается. Яннес держит отца за плечи сзади, через одеяло.' },
      { when: warn, text: 'Днём он кажется меньше, чем ночью у переезда.' },
      { when: home, text: 'Днём он кажется меньше, чем ночью у твоей калитки.' },
      { text: '— Halt das Licht, — просит Уте, не оборачиваясь. — Bitte.\n\nПодержите свет. Пожалуйста.' },
    ],
    actions: [
      { id: 'c17_ak2_light', label: 'Светить ей фонарём на ногу', minutes: 10, terminal: true, goto: 'c17_a_ute',
        text: 'Ты светишь. Рана на щиколотке красная, мокрая. Уте мажет её чем-то из детского тюбика. Кай дёргается на свет, и Яннес прижимает его сильнее.', effects: [{ set: '$.c17_ak2', value: 'light' }, ute(1)] },
      { id: 'c17_ak2_hold', label: 'Сменить Яннеса: у него трясутся руки', minutes: 10, risky: true, terminal: true, goto: 'c17_a_ute',
        text: 'Ты берёшь Кая за плечи через одеяло. Он сильнее, чем кажется. Яннес отходит к двери и закуривает, не сразу попадая сигаретой в огонь зажигалки.', effects: [{ set: '$.c17_ak2', value: 'hold' }, jannes(2), { body: 'stress', delta: 2 }] },
      { id: 'c17_ak2_out', label: 'Подождать снаружи', minutes: 8, terminal: true, goto: 'c17_a_ute',
        text: 'Ты ждёшь у калитки колонии. Из домика слышно, как Уте тихо поёт. Ту же песню.', effects: [{ set: '$.c17_ak2', value: 'out' }] },
    ] }),

  S17({ id: 'c17_a_patrol', for: 'any', chapter: 'ch3', title: 'Патруль', location: field, ambient: day16,
    text: [
      { text: 'Грузовик встаёт поперёк полевой дороги. Из кабины выходит офицер, молодой, с картой в планшете.\n\n— Ausweis. Woher?\n\nДокументы. Откуда?' },
      { text: 'В кузове среди солдат Тобиас. Он смотрит мимо тебя, на насыпь.' },
      { when: garden16('tell'), text: '— Lüdemann-Hof, — читает офицер в планшете. — Sie haben uns die Kolonie gemeldet. Danke.\n\nХутор Людеманов. Вы нам сообщили про колонию. Спасибо.' },
    ],
    actions: [
      { id: 'c17_apt_truth', label: 'Сказать прямо: я чинил{m:|а} им насос', minutes: 8, risky: true, terminal: true, goto: 'c17_yard',
        text: 'Офицер поднимает бровь.\n\n— Pumpe, — повторяет он. — Für die da. — Записывает что-то. — Morgen ab acht ist hier Sperrgebiet. Bleiben Sie zu Hause.\n\nНасос. Для этих. Завтра с восьми здесь закрытая зона. Оставайтесь дома.\n\nТобиас в кузове закрывает глаза.', effects: [{ set: '$.c17_patrol', value: 'truth' }, { body: 'stress', delta: 2 }, toYard] },
      { id: 'c17_apt_walk', label: 'Сказать: гулял{m:|а}, иду домой', minutes: 5, terminal: true, goto: 'c17_yard',
        text: 'Офицер смотрит на лом у тебя на плече.\n\n— Spazieren, — говорит он. — Mit Brecheisen. — Пауза. Потом машет рукой: проезжайте, хотя ехать тебе не на чем. — Morgen ab acht ist hier Sperrgebiet.\n\nГулять. С ломом. Завтра с восьми здесь закрытая зона.', effects: [{ set: '$.c17_patrol', value: 'walk' }, toYard] },
      { id: 'c17_apt_tobias', label: 'Посмотреть на Тобиаса и промолчать', minutes: 6, terminal: true, goto: 'c17_yard',
        text: 'Ты молчишь. Офицер ждёт, потом пожимает плечами и возвращает тебе документы.\n\n— Morgen ab acht ist hier Sperrgebiet.\n\nЗавтра с восьми здесь закрытая зона.\n\nКогда грузовик трогается, Тобиас на секунду поднимает руку. Ниже борта, чтобы не видели.', effects: [{ set: '$.c17_patrol', value: 'tobias' }, tobias(1), toYard] },
    ] }),

  S17({ id: 'c17_b_nine', for: 'any', chapter: 'ch3', title: 'Девятая днём', location: garden, ambient: day16,
    text: [
      { when: albers17('take'), text: 'Девятый домик пустой. Дверь открыта, на кровати аккуратно сложено одеяло. На стене детский рисунок: велосипед.\n\n— Tobias hat sie heute früh geholt, — говорит Уте за твоей спиной. — Zu euch. Danke.\n\nТобиас забрал её сегодня утром. К вам. Спасибо.' },
      { when: albers17('no'), text: 'В девятом домике женщина в цветастом платке сидит на кровати, руки на коленях. На двери детский рисунок: велосипед.\n\n— Margit, — говорит Уте за твоей спиной. — Tobias war heute früh hier. Hat sie lange angesehen. Dann ist er zum Dienst.\n\nМаргит. Тобиас был тут сегодня рано утром. Долго на неё смотрел. Потом ушёл на службу.' },
    ],
    actions: [
      { id: 'c17_bn_drawing', label: 'Рассмотреть рисунок на двери', minutes: 4, terminal: true, goto: 'c17_b_ute',
        text: 'Велосипед нарисован синим фломастером, колёса кривые. Внизу подпись печатными буквами: «TOBI 5 J.». Тоби, пять лет.', effects: [{ set: '$.c17_bn', value: 'drawing' }] },
      { id: 'c17_bn_ute', label: 'Спросить Уте, как она их всех различает', minutes: 6, terminal: true, goto: 'c17_b_ute',
        text: '— Durch die Tür, — говорит Уте. — Frau Albers summt. Herr Stamer klopft. Opa Gerd atmet laut. — Она пожимает плечами. — Wie Kinder im Kindergarten. Man kennt sie am Weinen.\n\nЧерез дверь. Фрау Альберс мычит. Господин Штамер стучит. Дедушка Герд громко дышит. Как дети в саду. Узнаёшь по плачу.', effects: [{ set: '$.c17_bn', value: 'ute' }, ute(1)] },
      { id: 'c17_bn_go', label: 'Идти дальше', minutes: 2, terminal: true, goto: 'c17_b_ute', effects: [{ set: '$.c17_bn', value: 'go' }] },
    ] }),

  S17({ id: 'c17_yard', for: 'any', chapter: 'ch3', title: 'Без десяти двенадцать', camp: yard14, ambient: day16,
    text: [
      { text: 'Без десяти двенадцать вы оба снова во дворе. Солнце так и не вышло.' },
      { when: { v: 'A.c16_doc', op: '==', value: 'note' }, text: 'К калитке подъезжает на велосипеде парень с повязкой, тот, что записывал у пожарной части. Отдаёт сложенный листок.\n\n— Vom Doktor. Aus Lüneburg.\n\nОт врача. Из Люнебурга.\n\nПочерк Хенрике, крупный: «Оле здоров. Берут кровь каждый день, по пол-литра. Говорят, для больных. Домой не отпускают: „пока нужен“. Я с ним. Курам воды. Нину не бросайте. Х.»' },
      { when: all(albers17('take'), ninaHere, not({ v: 'B.c17_bk', op: '==', value: 'nina' })), text: 'Нина выходит из сарая с пустым ковшом на палке.\n\n— Я её поила, — говорит она. — Как папу. Она пьёт так же.' },
      { when: { stocked: 'c17_hen', qty: 1, at: 'c3_farm_stock' }, text: 'В холодной кладовке висит ощипанная курица.' },
    ],
    actions: [
      { id: 'c17_y_partner', label: 'Рассказать {partner.dat} своё утро', minutes: 10, terminal: true, goto: 'c17_noon',
        text: 'Вы рассказываете по очереди, перебивая друг друга. Утро у каждого было своё. Половину ты узнаёшь только сейчас.', effects: [{ set: '$.c17_y', value: 'partner' }, toNoon] },
      { id: 'c17_y_hens', label: 'Сначала дать курам воды', minutes: 10, activity: 'light', terminal: true, goto: 'c17_noon',
        text: 'В поилке снова корка льда, тонкая. Ты разбиваешь её пальцем. Куры смотрят на тебя одним глазом, по очереди.', effects: [{ set: '$.c17_y', value: 'hens' }, toNoon] },
      { id: 'c17_y_sit', label: 'Посидеть на крыльце молча', minutes: 10, activity: 'rest', terminal: true, goto: 'c17_noon',
        text: 'Вы сидите на крыльце рядом. Никто ничего не говорит. Так тоже можно.', effects: [{ set: '$.c17_y', value: 'sit' }, { body: 'stress', delta: -1 }, toNoon] },
    ] }),

  S17({ id: 'c17_checkpoint', for: 'any', chapter: 'ch3', title: 'Колония', checkpoint: 17, universal: false,
    text: [{ text: 'Что вы делаете в среду и где в это время Нина, решаете вдвоём.' }], actions: [] }),
];
