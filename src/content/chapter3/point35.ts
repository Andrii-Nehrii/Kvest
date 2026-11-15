import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { brothersCome, eldersCome, okaforComes, oleHome33 } from './point33';

// Участок 35: понедельник 7.12, 06:00 → КТ35 21:00. КЛЮЧЕВАЯ, финал запаса. Крупное: знают разное / один решает за другого;
// человек из прошлого (Янник, первый день A). План — STOCK_PLAN.md §9.
// Скрытая правда: армия уходит из Люнебурга 15.12 за Эльбу; Тобиасу разрешено взять «своих» — два места (знает только A).
// Колонна Красного Креста на север берёт одну медсестру вместо заболевшей и довезёт до Аренсбурга, к Мерле (знает только B).
// Утром — человек со списком из Люнебурга (обе линии), потом порознь до обеда, вечером — дом говорит своё.
export const P35: Cond = all({ cp: 34 }, not({ cp: 35 }));
export const A35: Cond = { me: 'A' };
export const B35: Cond = { me: 'B' };
export const farm35 = 'hof_luedemann';
export const jest35 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point35Available: Cond = all(P35, { at: farm35 }, { partnerAt: farm35 }, up, { partner: 'active' }, flag('w.c34_lean'));
export const own35 = (key: string, value: string): Cond => v(`$.c35_${key}`, value);

export const henrike35: Cond = { npc: 'henrike', alive: true, at: farm35 };
export const tobias35: Cond = { npc: 'c15_tobias', alive: true };
export const jannik35: Cond = { npc: 'jannik', alive: true };
/** Первый день: A не пустил Янника в машину (канон пары) или пустил. */
export const jannikRefused: Cond = v('A.met_jannik', 'refused');
export const jannikTaken: Cond = all(flag('A.met_jannik'), not(jannikRefused));
export const lea35: Cond = all({ npc: 'c21_lea', alive: true }, any({ npc: 'c21_lea', at: farm35 }, { npc: 'c21_lea', at: jest35 }));
export const kasia35: Cond = { npc: 'kasia', alive: true, at: farm35 };
export const ute35: Cond = { npc: 'c14_ute', alive: true };
export const lean35 = (x: string): Cond => v('w.c34_lean', x);

export const frost35 = { tempC: -6, outdoor: true, wet: false };
export const hall35 = { tempC: 10, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm35, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S35 = wrap(P35);
export const set35 = (key: string, value: string | boolean): Effect => ({ set: `$.c35_${key}`, value });
export const w35 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c35_${key}`, value });
export const until35 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(37, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare35: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c35_finished', value: true };
const split = [{ id: 'a', when: A35, goto: 'c35_a_tobias' }, { id: 'b', goto: 'c35_b_point' }];

export const shared35: Scene[] = [
  S35({ id: 'c35_dawn', for: 'any', chapter: 'ch3', title: 'Понедельник', camp: kitchen14,
    text: [
      { text: 'Минус четырнадцать. Окна изнутри в ледяных папоротниках. Хенрике растапливает плиту в темноте, на ощупь, и ставит воду.' },
      { when: lean35('stay'), text: 'Вчера вы решили смотреть на хутор. Сегодня утром хутор выглядит так, будто знает об этом.' },
      { when: lean35('east'), text: 'Вчера вы решили смотреть на восток. До десятого три дня.' },
      { when: lean35('north'), text: 'Вчера вы решили смотреть на север. До десятого три дня.' },
    ],
    actions: [
      { id: 'c35_da_eat', label: 'Позавтракать', minutes: 60, terminal: true, goto: 'c35_list', ...tableOnly,
        text: 'Каша, чай с мёдом. Ты ешь медленно. День будет длинным, это чувствуется уже сейчас.', effects: [set35('da', 'eat'), meal('eat'), until35(8, 0)] },
      { id: 'c35_da_yard', label: 'Выйти во двор, пока все спят', minutes: 60, terminal: true, goto: 'c35_list', ambientDuring: frost35,
        text: 'Звёзды бледнеют. Снег скрипит так громко, что слышно, наверное, в Йестебурге. Ты стоишь посреди двора и смотришь, как на востоке сереет.', effects: [set35('da', 'yard'), { body: 'stress', delta: -2 }, until35(8, 0)] },
    ] }),

  S35({ id: 'c35_list', for: 'any', chapter: 'ch3', title: 'Список', camp: yard14, ambient: frost35,
    text: [
      { text: 'В восемь у ворот незнакомый армейский джип. Из него выходит офицер в очках, с планшетом под мышкой, и солдат с автоматом за спиной.' },
      { text: '— Oberleutnant Haase, Kommandantur Lüneburg. Erfassung für die Winterversorgung. Wer wohnt hier? Name, Alter, Beruf. Wer war krank und ist genesen?\n\nОберлейтенант Хаазе, комендатура Люнебурга. Учёт для зимнего снабжения. Кто здесь живёт? Имя, возраст, профессия. Кто болел и выздоровел?' },
      { when: flag('w.c34_tobias_warned'), text: 'Тобиас сказал: говорить правду. Но только то, о чём спросят.' },
      { when: flag('w.c34_heard_new'), text: 'Кто-то новый, сверху, со списком. Список — вот проблема. Не он.' },
    ],
    actions: [
      { id: 'c35_li_asked', label: 'Отвечать коротко: только на вопросы', minutes: 60, terminal: true, outcomes: split,
        text: 'Имя. Возраст. Профессия. Не болел{m:|а}. Хаазе пишет, не поднимая глаз. Про остальных отвечает Хенрике, сухо, как на почте. Через сорок минут джип уезжает к соседям.', effects: [set35('li', 'asked'), until35(9, 0)] },
      { id: 'c35_li_all', label: 'Рассказать всё: кто откуда, кто чем может помочь', minutes: 60, terminal: true, outcomes: split,
        text: 'Ты рассказываешь подробно. Кто врач, кто медбрат, кто механик. Хаазе впервые поднимает глаза и смотрит на тебя внимательно. Записывает больше, чем спрашивал. Особенно — профессии.', effects: [set35('li', 'all'), w35('list_full', true), until35(9, 0)] },
      { id: 'c35_li_why', label: 'Спросить, зачем этот учёт', minutes: 60, terminal: true, outcomes: split,
        text: '— Für die Versorgung, — говорит Хаазе. Для снабжения. — Und für die Planung.\n\nИ для планирования.\n\nКакого — не говорит. Солдат за его спиной отводит глаза.', effects: [set35('li', 'why'), set35('suspects', true), until35(9, 0)] },
    ] }),

  S35({ id: 'c35_supper', for: 'any', chapter: 'ch3', title: 'Дом говорит', camp: kitchen14, onEnter: [until35(18, 0)],
    text: [
      { text: 'Ужин. За столом все, кто за эти недели стал своим. Новость про десятое разошлась по дому сама, как запах дыма: кто-то уходит, кто-то остаётся, кто-то ещё не знает.' },
      { when: ninaFarm, text: 'Нина говорит первой, не поднимая глаз от тарелки:\n\n— Если вы уйдёте, я останусь с Хенрике. Я уже решила. Не спорьте.' },
      { when: v('w.c32_nina', 'winsen'), text: 'Нинин стул пустой. Хенрике и сегодня поставила ей кружку.' },
      { when: evaHere, text: 'Эва крестит хлеб, прежде чем резать, и говорит, ни к кому не обращаясь: «Wer geht, der geht. Wer bleibt, muss essen». Кто уходит — уходит. Кто остаётся — должен есть.' },
      { when: kasia35, text: 'Кася сидит рядом с тобой. Губная гармошка Тима у неё в кармане: ты видишь край.' },
      { when: all(kasia35, v('w.c27_tim', 'farm')), text: 'Тим похоронен за сараем, под яблоней. Кася ходит туда каждое утро.' },
      { when: lea35, text: 'Лея говорит, что останется при пункте, у Зандер. «Bis jemand nach Hannover fährt. Dann frage ich nicht mehr». Пока кто-нибудь не поедет в Ганновер. Тогда спрашивать больше не буду.' },
      { when: brothersCome, text: 'Дениз стучит пальцем по столу: «Wer auch immer geht — der Traktor läuft jetzt. Das ist schon mal was». Кто бы ни уходил — трактор теперь работает. Уже кое-что.' },
      { when: oleHome33, text: 'Оле сидит во главе стола, впервые за месяц. Ест мало. Смотрит на всех по очереди.' },
      { when: flag('w.c27_ole_last'), text: 'Место во главе стола пустое. Хенрике не садится на него и никому не даёт.' },
      { when: okaforComes, text: 'Окафор пришёл из колонии к ужину. Он говорит мало. Перед ним на столе бумага с печатью Зандер: пропуск сопровождающего.' },
      { when: eldersCome, text: 'Старики Петерсены держатся за руки под столом.' },
      { when: all(v('w.c22_letter', 'truth'), henrike35), text: 'Письмо, которое вы отправили в Люнебург, с правдой про плазму, Хенрике хранит в переднике до сих пор. Сейчас достаёт его, разглаживает на столе и кладёт рядом с хлебом. Не говорит ничего.' },
      { when: v('w.c25_truth', 'all'), text: 'Про плазму и списки теперь знает вся округа. Кто-то из-за этого с вами не здоровается. Кто-то, наоборот, приносит яйца.' },
    ],
    actions: [
      { id: 'c35_su_eat', label: 'Есть и слушать всех', minutes: 120, terminal: true, goto: 'c35_checkpoint', ...tableOnly,
        text: 'Ты ешь и слушаешь. Каждый говорит своё. Никто не говорит «останьтесь». Никто не говорит «уходите». Хенрике в конце встаёт, собирает тарелки и говорит одно слово: «Morgen». Завтра.', effects: [set35('su', 'eat'), meal('eat'), finish, until35(21, 0)] },
      { id: 'c35_su_speak', label: 'Сказать всем, что думаешь', minutes: 120, terminal: true, goto: 'c35_checkpoint',
        text: 'Ты встаёшь. Говоришь недолго. За столом тихо. Когда садишься, Хенрике кладёт руку тебе на плечо, и это всё.', effects: [set35('su', 'speak'), npc('henrike', 1), finish, until35(21, 0)] },
      { id: 'c35_su_partner', label: 'Выйти с {partner.ins} на крыльцо', minutes: 120, terminal: true, goto: 'c35_checkpoint', ambientDuring: frost35,
        text: 'Мороз. Звёзды. Пар изо рта. Вы стоите рядом и долго молчите. Потом каждый рассказывает то, что узнал сегодня. Или то, что может рассказать.', effects: [set35('su', 'partner'), set35('porch', true), finish, until35(21, 0)] },
    ] }),

  S35({ id: 'c35_checkpoint', for: 'any', chapter: 'ch3', title: 'Понедельник, девять вечера', checkpoint: 35, universal: false, camp: house14,
    text: [{ text: 'Девять вечера. До десятого три дня. Каждый знает свою половину. Решать — за себя и за другого.' }], actions: [] }),
];
