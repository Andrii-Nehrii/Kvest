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
import { kasiaLate } from './house28';

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
const split = [{ id: 'a', when: A35, goto: 'c35_a_soldier' }, { id: 'b', goto: 'c35_b_soldier' }];

export const shared35: Scene[] = [
  S35({ id: 'c35_dawn', for: 'any', chapter: 'ch3', title: 'Понедельник', camp: kitchen14,
    text: [
      { text: 'Минус четырнадцать. Окна изнутри в ледяных папоротниках. Хенрике растапливает плиту в темноте, на ощупь, и ставит воду.' },
      { when: v('w.c34_rule_b', 'equal'), text: 'За завтраком каждому ровно по половнику. Так теперь заведено с субботы. Никто не спорит. Никто и не благодарит.' },
      { when: v('w.c34_rule_b', 'need'), text: 'За завтраком детям и старикам наливают первыми. Остальным — что осталось. С субботы так. Дениз называет это социализмом, но первым встаёт к дровам.' },
      { when: v('w.c34_rule_b', 'henrike'), text: 'За завтраком половник снова у Хенрике. Она раздаёт быстро и уверенно, и все делают вид, что не видят, кому сколько.' },
      { when: v('w.c34_rule_b', 'sunday'), text: 'Вчера за воскресным столом сидело четырнадцать человек. Хенрике достала скатерть. Сегодня понедельник, и снова каждый двор сам по себе.' },
      { when: all(v('w.c34_rule_b', 'secret'), { me: 'B' }), text: 'Хенрике за завтраком ставит перед тобой миску на треть полнее обычного. «Wer für zwei teilt, isst für einen nicht genug». Кто делит на двоих, тот сам не наедается. Больше она ничего не говорит.' },
      { when: all(v('w.c34_rule_b', 'secret'), { me: 'A' }), text: 'Хенрике за завтраком ставит перед {B.ins} миску на треть полнее обычного. Ты не сразу понимаешь почему. Потом вспоминаешь субботний бидон.' },
      { when: v('w.c34_rule_b', 'trade'), text: 'Соседи с утра уже на кухне: перебирают картошку за миску. Работа за еду. Честно. Всем немного неловко.' },
      { when: v('w.c34_rule_b', 'rule'), text: 'У колонки на льду чьи-то следы и след от упавшего ведра. Правило есть правило.' },
      { when: v('w.c34_rule_b', 'sit'), text: 'На двери кухни новый лист: молодым — вода, дрова, обход; остальным — штопка, картошка, куры. Его никто не обсуждает. Значит, работает.' },
      { when: v('w.c34_rule_a', 'lock'), text: 'На двери кладовки висит ржавый замок от старой калитки. Нина проходит мимо него, не поднимая глаз.' },
      { when: v('w.c34_rule_a', 'nina'), text: 'Нина за завтраком ест половину своей порции, вторую заворачивает в тряпку и прячет в рукав.' },
      { when: v('w.c34_rule_a', 'hard'), text: 'Кёлер вчера прошла мимо ваших ворот и не кивнула. Каждый двор сам за себя.' },
      { when: v('w.c34_rule_a', 'together'), text: 'Поленница за сараем выросла на две берёзы. Ужин вчера был общий, без всякого листа.' },
      { when: v('w.c34_rule_a', 'enforce'), text: 'Тот, кого вчера заставили пилить, сегодня встал раньше всех и ушёл к колонке. Молча. На {A.acc} он не смотрит.' },
      { when: lean35('stay'), text: 'Вчера вы решили смотреть на хутор. Сегодня утром хутор выглядит так, будто знает об этом.' },
      { when: lean35('east'), text: 'Вчера вы решили смотреть на восток. До десятого три дня.' },
      { when: lean35('north'), text: 'Вчера вы решили смотреть на север. До десятого три дня.' },
      { when: all({ me: 'A' }, v('A.c34_wish', 'stay')), text: 'Ты помнишь, что сказал{m:|а} в субботу ночью: сюда, здесь, картошка весной. Сегодня это звучит иначе.' },
      { when: all({ me: 'A' }, v('A.c34_wish', 'east')), text: 'Ты помнишь, что сказал{m:|а} в субботу ночью: на восток. Тогда это было мечтой. До десятого три дня.' },
      { when: all({ me: 'A' }, v('A.c34_wish', 'north')), text: 'Ты помнишь, что сказал{m:|а} в субботу ночью: на север, за Эльбу. Тогда это было просто словом.' },
      { when: all({ me: 'B' }, v('B.c34_wish', 'stay')), text: 'Ты помнишь, что сказал{m:|а} в субботу ночью: сюда, здесь. Тогда было легко это сказать.' },
      { when: all({ me: 'B' }, v('B.c34_wish', 'east')), text: 'Ты помнишь, что сказал{m:|а} в субботу ночью: на восток. Ты всё ещё так думаешь. Или нет.' },
      { when: all({ me: 'B' }, v('B.c34_wish', 'north')), text: 'Ты помнишь, что сказал{m:|а} в субботу ночью: на север. Мерле там. Это не изменилось.' },
      { text: 'Хенрике режет хлеб на доске, придерживая буханку у груди, как делала её мать. Нож ходит ровно. Чайник на плите начинает петь.' },
    ],
    actions: [
      { id: 'c35_da_eat', label: 'Позавтракать', minutes: 60, terminal: true, goto: 'c35_list', ...tableOnly,
        text: 'Каша, чай с мёдом. Ты ешь медленно. День будет длинным, это чувствуется уже сейчас.', effects: [set35('da', 'eat'), meal('eat'), until35(8, 0)] },
      { id: 'c35_da_yard', label: 'Выйти во двор, пока все спят', minutes: 60, terminal: true, goto: 'c35_list', ambientDuring: frost35,
        text: 'Звёзды бледнеют. Снег скрипит так громко, что слышно, наверное, в Йестебурге. Ты стоишь посреди двора и смотришь, как на востоке сереет.', effects: [set35('da', 'yard'), { body: 'stress', delta: -2 }, until35(8, 0)] },
      { id: 'c35_da_nina', label: 'Разбудить Нину пораньше: помочь ей собрать учебники', minutes: 30, terminal: true, goto: 'c35_list',
        text: 'Нина просыпается сразу, будто не спала. Учебники, тетради, пенал с огрызками карандашей. Она складывает всё в рюкзак очень аккуратно и говорит, не поднимая глаз: «Если вы уедете, я всё равно буду ходить в школу. Через снег». Ты не знаешь, что на это сказать.', effects: [set35('da', 'nina'), { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust: 1 }] }, until35(8, 0)] },
    ] }),

  S35({ id: 'c35_list', for: 'any', chapter: 'ch3', title: 'Список', camp: yard14, ambient: frost35,
    text: [
      { text: 'В восемь у ворот незнакомый армейский джип. Из него выходит офицер в очках, с планшетом под мышкой, и солдат с автоматом за спиной.' },
      { text: '— Oberleutnant Haase, Kommandantur Lüneburg. Erfassung für die Winterversorgung. Wer wohnt hier? Name, Alter, Beruf. Wer war krank und ist genesen?\n\nОберлейтенант Хаазе, комендатура Люнебурга. Учёт для зимнего снабжения. Кто здесь живёт? Имя, возраст, профессия. Кто болел и выздоровел?' },
      { when: flag('w.c34_tobias_warned'), text: 'Тобиас сказал: говорить правду. Но только то, о чём спросят.' },
      { when: flag('w.c34_heard_new'), text: 'Кто-то новый, сверху, со списком. Список — вот проблема. Не он.' },
      { when: flag('w.c34_heard_major'), text: 'Брандт предупреждал: офицер из комендатуры будет считать, кто может работать и у кого есть машина.' },
      { text: 'Офицер пишет быстро, мелким почерком, не поднимая головы. Солдат у джипа притоптывает на морозе и дует в кулак. Хенрике стоит в дверях, сложив руки на фартуке.' },
      { when: v('$.c35_da', 'yard'), text: 'Ты {m:вышел|вышла} во двор ещё затемно, пока все спали. Снег скрипел так громко, что казалось, разбудишь дом. Теперь ты знаешь, как выглядит хутор, когда на нём никого нет.' },
      { when: v('$.c35_da', 'eat'), text: 'После каши тепло в животе, и стоять на морозе у джипа не так тоскливо.' },
    ],
    actions: [
      { id: 'c35_li_asked', label: 'Отвечать коротко: только на вопросы', minutes: 60, terminal: true, outcomes: split,
        text: 'Имя. Возраст. Профессия. Не болел{m:|а}. Хаазе пишет, не поднимая глаз. Про остальных отвечает Хенрике, сухо, как на почте. Через сорок минут джип уезжает к соседям.', effects: [set35('li', 'asked'), until35(9, 0)] },
      { id: 'c35_li_all', label: 'Рассказать всё: кто откуда, кто чем может помочь', minutes: 60, terminal: true, outcomes: split,
        text: 'Ты рассказываешь подробно. Кто врач, кто медбрат, кто механик. Хаазе впервые поднимает глаза и смотрит на тебя внимательно. Записывает больше, чем спрашивал. Особенно — профессии.', effects: [set35('li', 'all'), w35('list_full', true), until35(9, 0)] },
      { id: 'c35_li_ration', label: 'Сказать, что хутор вычеркнули из списка Брандта', when: any(v('w.c28_list', 'off'), v('w.c24_ration', 'half')), minutes: 60, terminal: true, outcomes: split,
        text: 'Хаазе впервые поднимает голову.\n\n— Gestrichen? Von wem? — Ты объясняешь. Он слушает и стучит ручкой по планшету. — Die Liste der Gemeinde ist nicht meine Liste. Wer hier wohnt und arbeitet, wird von der Kommandantur versorgt. Punkt.\n\nВычеркнули? Кто? Список общины — не мой список. Кто здесь живёт и работает, того снабжает комендатура. Точка.\n\nОн пишет отдельную строчку и подчёркивает её дважды. Хенрике за твоей спиной выдыхает так, будто держала воздух с самой пятницы.', effects: [set35('li', 'ration'), w35('army_ration', true)] },
      { id: 'c35_li_why', label: 'Спросить, зачем этот учёт', minutes: 60, terminal: true, outcomes: split,
        text: '— Für die Versorgung, — говорит Хаазе. Для снабжения. — Und für die Planung.\n\nИ для планирования.\n\nКакого — не говорит. Солдат за его спиной отводит глаза.', effects: [set35('li', 'why'), set35('suspects', true), until35(9, 0)] },
    ] }),

  S35({ id: 'c35_supper', for: 'any', chapter: 'ch3', title: 'Дом говорит', camp: kitchen14, onEnter: [until35(18, 0)],
    text: [
      { text: 'Ужин. За столом все, кто за эти недели стал своим. Новость про десятое разошлась по дому сама, как запах дыма: кто-то уходит, кто-то остаётся, кто-то ещё не знает.' },
      { when: all(kasiaLate, v('w.c29_kasia_road', 'list')), text: 'Кася складывает рюкзак уже третий вечер подряд. Вынимает всё и кладёт обратно. До десятого три дня.' },
      { when: all(kasiaLate, flag('w.c31_kasia_axe')), text: 'Поленница у сарая с понедельника заметно выше. Кася колет по утрам, пока все спят.' },
      { when: all({ npc: 'c8_eva', alive: true }, v('w.c31_eva_spring', 'tense')), text: 'Эва и Хенрике готовят молча, каждая у своего края плиты. «До Рождества», — сказала Хенрике. Все считают дни.' },
      { when: ninaFarm, text: 'Нина говорит первой, не поднимая глаз от тарелки:\n\n— Если вы уйдёте, я останусь с Хенрике. Я уже решила. Не спорьте.' },
      { when: v('w.c32_nina', 'winsen'), text: 'Нинин стул пустой. Хенрике и сегодня поставила ей кружку.' },
      { when: evaHere, text: 'Эва крестит хлеб, прежде чем резать, и говорит, ни к кому не обращаясь: «Wer geht, der geht. Wer bleibt, muss essen». Кто уходит — уходит. Кто остаётся — должен есть.' },
      { when: kasia35, text: 'Кася сидит рядом с тобой. Губная гармошка Тима у неё в кармане: ты видишь край.' },
      { when: all(kasia35, v('w.c27_tim', 'farm')), text: 'Тим похоронен за сараем, под яблоней. Кася ходит туда каждое утро.' },
      { when: lea35, text: 'Лея говорит, что останется при пункте, у Зандер. «Bis jemand nach Hannover fährt. Dann frage ich nicht mehr». Пока кто-нибудь не поедет в Ганновер. Тогда спрашивать больше не буду.' },
      { when: brothersCome, text: 'Дениз стучит пальцем по столу: «Wer auch immer geht — der Traktor läuft jetzt. Das ist schon mal was». Кто бы ни уходил — трактор теперь работает. Уже кое-что.' },
      { when: oleHome33, text: 'Оле сидит во главе стола, впервые за месяц. Ест мало. Смотрит на всех по очереди.' },
      { when: flag('w.c27_ole_last'), text: 'Место во главе стола пустое. Хенрике не садится на него и никому не даёт.' },
      { when: all(okaforComes, { has: 'c34_merle_letter' }), text: 'Окафор протягивает руку через стол, и ты отдаёшь ему письмо для Мерле. Он кладёт его во внутренний карман, к пропуску, и застёгивает пуговицу.' },
      { when: okaforComes, text: 'Окафор пришёл из колонии к ужину. Он говорит мало. Перед ним на столе бумага с печатью Зандер: пропуск сопровождающего.' },
      { when: eldersCome, text: 'Старики Петерсены держатся за руки под столом.' },
      { when: all(v('w.c22_letter', 'truth'), henrike35), text: 'Письмо, которое вы отправили в Люнебург, с правдой про плазму, Хенрике хранит в переднике до сих пор. Сейчас достаёт его, разглаживает на столе и кладёт рядом с хлебом. Не говорит ничего.' },
      { when: v('w.c25_truth', 'all'), text: 'Про плазму и списки теперь знает вся округа. Кто-то из-за этого с вами не здоровается. Кто-то, наоборот, приносит яйца.' },
      { when: v('$.c34_ba', 'letter'), text: 'Фрау Кёрнер держит под подушкой письмо мужу, которое ты записывал{m:|а} с её слов. Ты видишь край конверта.' },
      { when: flag('w.c34_sugar_merle'), text: 'Сахарные кубики в укладке Окафора лежат отдельно, в целлофане. Для неё.' },
      { when: v('$.c35_li', 'all'), text: 'Хаазе утром записал профессии всех за этим столом. Окафор говорит, что в таких списках он уже бывал. Ничего хорошего из них не выходило.' },
      { when: v('$.c35_li', 'why'), text: 'Утром ты {m:спросил|спросила} Хаазе, зачем учёт. Он не ответил. Это тоже ответ, говорит Хенрике.' },
      { when: v('$.c35_ah', 'alone'), text: 'Суп, который Хенрике оставила тебе на плите, ты {m:съел|съела} холодным, думая о двух местах за Эльбой.' },
      { when: v('$.c35_ad', 'keep'), text: 'Ты держишь слово, данное Тобиасу. Оно тяжелее, чем казалось утром.' },
      { when: flag('w.c35_b_listed_med'), text: 'В списке Хаазе твоё имя теперь в отдельной графе: медицинские навыки.' },
      { when: v('w.c35_b_bag', 'packed'), text: 'У двери стоит маленькая тяжёлая сумка. Все видят её и никто не спрашивает.' },
      { text: 'На столе картошка, капуста, хлеб Кёлер и, впервые за неделю, банка тушёнки на всех. Лампа горит в полную силу: Хенрике сказала, сегодня можно.' },
      { when: v('$.c35_ac2', 'leave'), text: 'Машину ты так и {m:оставил|оставила} под навесом. Ключ висит на гвозде в сенях, ни к чему.' },
      { when: v('$.c35_bb3', 'no'), text: 'Рюкзак ты задвинул{m:|а} обратно под кровать. Решать за ужином всё равно придётся вслух.' },
    ],
    actions: [
      { id: 'c35_su_eat', label: 'Есть и слушать всех', minutes: 90, terminal: true, outcomes: [{ id: 'a', when: A35, goto: 'c35_a_late' }, { id: 'b', goto: 'c35_b_late' }], ...tableOnly,
        text: 'Ты ешь и слушаешь. Каждый говорит своё. Никто не говорит «останьтесь». Никто не говорит «уходите». Хенрике в конце встаёт, собирает тарелки и говорит одно слово: «Morgen». Завтра.', effects: [set35('su', 'eat'), meal('eat'), finish, until35(20, 0)] },
      { id: 'c35_su_speak', label: 'Сказать всем, что думаешь', minutes: 90, terminal: true, outcomes: [{ id: 'a', when: A35, goto: 'c35_a_late' }, { id: 'b', goto: 'c35_b_late' }],
        text: 'Ты встаёшь. Говоришь недолго. За столом тихо. Когда садишься, Хенрике кладёт руку тебе на плечо, и это всё.', effects: [set35('su', 'speak'), npc('henrike', 1), finish, until35(20, 0)] },
      { id: 'c35_su_partner', label: 'Выйти с {partner.ins} на крыльцо', minutes: 90, terminal: true, outcomes: [{ id: 'a', when: A35, goto: 'c35_a_late' }, { id: 'b', goto: 'c35_b_late' }], ambientDuring: frost35,
        text: 'Мороз. Звёзды. Пар изо рта. Вы стоите рядом и долго молчите. Потом каждый рассказывает то, что узнал сегодня. Или то, что может рассказать.', effects: [set35('su', 'partner'), set35('porch', true), finish, until35(20, 0)] },
    ] }),

  S35({ id: 'c35_checkpoint', for: 'any', chapter: 'ch3', title: 'Понедельник, девять вечера', checkpoint: 35, universal: false, camp: house14,
    text: [{ text: 'Девять вечера. До десятого три дня. Каждый знает свою половину. Решать — за себя и за другого.' }], actions: [] }),
];
