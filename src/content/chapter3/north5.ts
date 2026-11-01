import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, flag, not, keeper } from './world3';
const S = (s: Scene) => s;
const AM = all({ after: at(12, 6) }, { before: at(12, 13) });
const NIGHT: Cond = { before: at(12, 6) };
const C = all({ cp: 4 }, not({ cp: 5 }));
const pair = all(flag('w.together'), { partnerAt: 'north_gym' }, { partner: 'active' });
const fresh = (id: string) => not(flag(`$.${id}`));
const res = (v: string): Cond => ({ v: 'w.c3_n5', op: '==', value: v });
const danger = all(C, { after: at(12, 11) }, { before: at(12, 11, 50) }, fresh('c5_nfire.done'), not(flag('w.c3_n5_done')));
const child = all(AM, { after: at(12, 7, 10) }, fresh('c5_child.done'));
const local = all(AM, { after: at(12, 8) }, fresh('c5_local.done'));
const back: ActionDef = { id: 'c5_nback', label: 'Вернуться к своим вещам', minutes: 2, terminal: true, goto: 'c5_north' };
const wait: ActionDef = { id: 'c5_wait', label: 'Переждать час', minutes: 60, activity: 'rest', repeatable: true, text: 'Ты остаёшься у своих вещей. Соседи говорят всё тише.' };
const toChild: ActionDef = { id: 'c5_child_approach', label: 'Подойти к мальчику у матов', minutes: 1, terminal: true, goto: 'c5_child', when: child };
const toLocal: ActionDef = { id: 'c5_local_approach', label: 'Ответить людям у входа', minutes: 1, terminal: true, goto: 'c5_local', when: local };
export const north5Scenes: Scene[] = [
 S({ id: 'c5_north', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Спортзал', safe: true,
  text: [
   { when: NIGHT, text: 'Кто-то ложится на мат в соседнем ряду. Он долго снимает ботинки, придерживая их шнурки. Ты отворачиваешься, чтобы дать ему раздеться.' },
   { when: all(AM, { before: at(12, 9, 20) }), text: 'Хинрихсен обходит ряды с пустым термосом. — Проснулись — подойдите. Не буду кричать через весь зал. — Она замечает открытые глаза, но проходит дальше.' },
   { when: all({ after: at(12, 9, 20) }, { before: at(12, 11) }), text: 'У кухни сдвигают очередь. Женщина с мальчиком держит одну миску на двоих. Пожарный просит пока не подходить к котлу.' },
   { when: all({ after: at(12, 11) }, fresh('c5_nfire.done'), not(flag('w.c3_n5_done'))), text: 'Из зала видно, как люди бегут к кухне. Чужой мат у выхода пуст, но вмятина под головой ещё не расправилась.' },
   { when: all(flag('$.c5_nfire.done'), not(flag('w.c3_n5_done'))), text: 'У кухни пожарные перекликаются за щитом. Ты остаёшься с другой стороны, пока оттуда не вынесут последнего человека.' },
   { when: res('fight'), text: 'Навес кухни держится на одной стойке. Хинрихсен сидит у стены, прижав к себе обожжённый рукав. На раздаче вместо неё стоит пожарный.' },
   { when: res('close'), text: 'К кухне никого не пускают. Хинрихсен закрывает лицо ладонями, когда спрашивают про обед. От куртки у неё идёт пар.' },
   { when: res('leave'), text: 'Хинрихсен увели в раздевалку. На дверной ручке висит её красная куртка. Пустой рукав касается пола.' },
   { when: res('missed'), text: 'Из раздевалки выносят закопчённый термос. Кто-то спрашивает, где дежурная. Ему показывают не ту дверь.' },
   { when: { v: '$.c5_local.result', op: '==', value: 'work' }, text: 'Местный мужчина зовёт тебя по имени, когда передаёт ящик. Вчера он спрашивал только, откуда ты.' },
   { when: { v: '$.c5_local.result', op: '==', value: 'talk' }, text: 'У входа мужчина тащит ящик один. На тебя он смотрит поверх его края.' },
   { when: { v: '$.c5_child.result', op: '==', value: 'mother' }, text: 'Мать мальчика сидит возле пустой миски. Ты слышишь, как она обещает ему поесть позже.' },
   { when: flag('$.c5_child.done'), text: 'Мальчик машет тебе из соседнего ряда. Мать прижимает его руку к груди, чтобы он не разбудил лежащих.' },
   { when: all(pair, NIGHT), text: '{partner} складывает ваши вещи ближе друг к другу. — Сюда чужим не наступить. — Ты освобождаешь место для {pm:его|её} ног.' },
  ], actions: [
   { id: 'c5_sleep', label: 'Лечь рядом со своими вещами', minutes: 0, repeatable: true, when: NIGHT, effects: [{ sleep: 600 }], text: 'Ты ложишься на край мата. Сосед убирает ботинки из прохода, не спрашивая, твои ли они.' },
   { id: 'c5_north_reg', label: 'Подойти к Хинрихсен', minutes: 2, terminal: true, goto: 'c5_nregister', when: all(AM, fresh('c5_nfire.done'), not(flag('w.c3_n5_done')), fresh('c5_north_reg')) },
   { id: 'c5_north_food', label: 'Взять свой завтрак у пожарного', minutes: 20, when: all(AM, { before: at(12, 11) }, fresh('c5_north_food')), text: 'Пожарный наливает в миску и придерживает её снизу. — Горячая. — Ты успеваешь перехватить край до того, как он отпускает.', effects: once('c5_north_food', [{ body: 'hunger', delta: -22 }, { body: 'thirst', delta: -12 }]) },
   { id: 'c5_north_partner', label: 'Поговорить с {partner.ins} вполголоса', minutes: 12, when: all(pair, fresh('c5_north_partner')), text: '— Дома я мог{pm:|ла} бы закрыть дверь, — говорит {partner}. Ты показываешь на вещи между матами. {pm:Он|Она} придвигает к себе твою ладонь.', effects: once('c5_north_partner', [{ body: 'stress', delta: -5 }]) },
   { id: 'c5_north_pots', label: 'Сменить пожарного у раздачи', minutes: 35, when: all(AM, { before: at(12, 11) }, fresh('c5_north_pots')), text: 'Он отдаёт тебе половник и отходит на три шага. Там стоит его телефон. Пожарный слушает гудки, пока ты разливаешь завтрак. В очередь он возвращается с пустой миской.', effects: once('c5_north_pots', [{ body: 'fatigue', delta: 4 }]) },
   { id: 'c5_north_door', label: 'К людям у дверей', minutes: 2, terminal: true, goto: 'c5_north_door', when: AM },
   { id: 'c5_north_rest', label: 'Спросить Хинрихсен, когда она спала', minutes: 2, terminal: true, goto: 'c5_nquiet', when: all(AM, fresh('c5_nfire.done'), not(flag('w.c3_n5_done')), fresh('c5_nquiet.done')) },
   { id: 'c5_nmeal_go', label: 'К последней миске у кухни', minutes: 1, terminal: true, goto: 'c5_nmeal', when: all(AM, { after: at(12, 9, 20) }, { before: at(12, 11) }, fresh('c5_nmeal.done')) },
   toChild, toLocal, wait, cpAction(5),
  ] }),
 S({ id: 'c5_nregister', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'У дежурной', calm: true,
  text: [{ text: 'Хинрихсен ставит термос возле твоих ног. — Вот ваши имена. Рядом пусто. — Она закрывает ладонью чужие строки.' }, { when: pair, text: '{partner} подходит с другой стороны. — Мы можем по очереди. — Хинрихсен поворачивает лист так, чтобы вы видели оба.' }],
  actions: [
   { id: 'c5_nreg_people', label: 'Спросить, сколько людей прибыло ночью', minutes: 7, when: fresh('c5_nreg_people'), text: '— Семеро. Я записала восемь, пока один ходил за женой. — Хинрихсен вычёркивает лишнюю палочку. — Она не пришла. — Зачёркнутое имя остаётся читаемым.', effects: once('c5_nreg_people') },
   { id: 'c5_nreg_hours', label: 'Выяснить, когда нужна смена', minutes: 6, when: fresh('c5_nreg_hours'), text: 'Хинрихсен показывает на утро и вечер. — В обед я ещё здесь. — Ты спрашиваешь про ночь. Она переворачивает страницу: ночная строка тоже её.', effects: once('c5_nreg_hours') },
   { id: 'c5_nreg_work', label: 'Вписать себя на вечер', minutes: 8, terminal: true, goto: 'c5_north', text: 'Ты пишешь своё имя рядом с её. — Не стирай моё, — просит Хинрихсен. — Мне надо будет проверить, что ты {m:пришёл|пришла}. — Она оставляет тебе карандаш.', effects: [...once('c5_north_reg'), { set: '$.c5_nshift', value: true }] },
   { id: 'c5_nreg_no', label: 'Не обещать смену до разговора вдвоём', minutes: 5, terminal: true, goto: 'c5_north', text: '— Тогда не обещай, — отвечает Хинрихсен. Пустую клетку она обводит, но твоего имени не вычёркивает. Ты возвращаешь карандаш остриём к себе.', effects: once('c5_north_reg') },
  ] }),
 S({ id: 'c5_child', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Один ботинок', universal: false,
  text: [{ text: 'Мальчик сидит на свёрнутом мате. На одной ноге ботинок, на другой чужой носок. — Мама сказала никуда не ходить. — Он смотрит под скамейку, не вставая.' }, { when: pair, text: '{partner} опускается возле него на корточки. — Мы тебя видим. Далеко не пойдём. — Мальчик берёт {pm:его|её} за рукав.' }], actions: [
   { id: 'c5_child_ask', label: 'Спросить, где он снимал обувь', minutes: 5, when: fresh('c5_child_ask'), text: '— Не я снимал. Мне сняли, пока спал. — Он показывает на мать в очереди. Трогает пустой носок, чтобы показать, какая нога.', effects: once('c5_child_ask') },
   { id: 'c5_child_search', label: 'Найти ботинок, не уводя мальчика', minutes: 25, terminal: true, goto: 'c5_north', text: 'Под чужой раскладушкой лежат три непарных ботинка. Ты приносишь все. Мальчик выбирает свой, а два других просит пока оставить возле него.', effects: [...once('c5_child.done'), { set: '$.c5_child.result', value: 'search' }, { body: 'fatigue', delta: 3 }] },
   { id: 'c5_child_crackers', label: 'Оставить ему свою пачку хлебцев', minutes: 8, terminal: true, goto: 'c5_north', enabled: { has: 'crackers' }, disabledReason: 'Хлебцев при тебе нет', text: 'Он не открывает пачку, пока ты не отходишь. Мать подходит и берёт его за подбородок. Мальчик показывает сперва на тебя, потом на хлебцы.', effects: [...once('c5_child.done'), { set: '$.c5_child.result', value: 'crackers' }, { take: 'crackers' }] },
   { id: 'c5_child_portion', label: 'Позвать мать из очереди', minutes: 10, terminal: true, goto: 'c5_north', text: 'Женщина выходит, оставив пустую миску на полу. До мальчика идёт быстро. В очередь её уже не пускают; она поднимает миску и возвращается к нему.', effects: [...once('c5_child.done'), { set: '$.c5_child.result', value: 'mother' }, { body: 'stress', delta: 4 }] },
 ] }),
 S({ id: 'c5_north_door', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Внутренняя сторона двери', calm: true,
  text: [{ text: 'Местный житель держит створку, чтобы с улицы внесли ящик. — Не тяните, тепло уйдёт. — Вошедший мужчина ставит ящик прямо на его ногу. Оба извиняются одновременно.' }, { when: flag('$.c5_nshift'), text: 'Хинрихсен оставила возле двери вторую ручку. На приклеенном листке твоё имя стоит в вечерней смене.' }], actions: [
   { id: 'c5_north_local', label: 'Спросить местного о дороге', minutes: 10, when: fresh('c5_north_local'), text: 'Он достаёт из кармана ключи от машины. — Здесь жил всю жизнь. А вчера ехал домой через поле. — Ты спрашиваешь про А7. Он убирает ключи, не ответив.', effects: once('c5_north_local') },
   { id: 'c5_north_clear', label: 'Помочь освободить дверь для носилок', minutes: 20, risky: true, when: fresh('c5_north_clear'), outcomes: [
    { id: 'room', check: { traits: ['technical'], difficulty: 3, uses: ['focus'] }, text: 'Ты расклиниваешь нижний ролик. Мужчина удерживает тяжёлую дверь за ручку. — Теперь мою ногу, — просит он. Он толкает ящик коленом.', effects: once('c5_north_clear', [{ body: 'fatigue', delta: 3 }]) },
    { id: 'pinch', text: 'Ролик срывается, дверь прижимает твои пальцы. Мужчина оттягивает её плечом. Ящик он оставляет на проходе, пока ты не разожмёшь руку.', effects: once('c5_north_clear', [{ injure: 'bruise', site: 'hands', severity: 1 }]) },
   ] },
   { id: 'c5_north_repair', label: 'Поработать с местным у входа', minutes: 25, repeatable: true, when: AM, text: 'Он держит петлю двери, а ты крутишь отвёртку. Вошедшие проходят по одному, стараясь вас не задеть. На вопрос про оплату мужчина указывает на зал: — Там спят.', effects: [{ body: 'fatigue', delta: 4 }] },
   toChild, toLocal, back, wait, cpAction(5),
 ] }),
 S({ id: 'c5_local', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Кто здесь работает', universal: false,
  text: [{ text: 'Двое местных ставят пустые ящики возле кухни. — Нашим тоже есть надо, — говорит один. — А их всё везут. — Второй придерживает ящик, пока тот не соскользнул.' }, { when: pair, text: '{partner} становится рядом с тобой. — Мы тоже таскали. — Мужчина смотрит на ваши руки, проверяя.' }], actions: [
   { id: 'c5_local_ask', label: 'Спросить, кого они называют своими', minutes: 6, when: fresh('c5_local_ask'), text: '— Кого знаю. — Он показывает на мальчика с непарной обувью. — Этого вчера не знал. Теперь знаю. — Второй молча протягивает ему следующий ящик.', effects: once('c5_local_ask') },
   { id: 'c5_local_work', label: 'Встать рядом и принять ящики', minutes: 30, terminal: true, goto: 'c5_north', text: 'Ты берёшь нижний край. Мужчина не сразу выпускает свой. Через три ходки он уже не ждёт, пока ты попросишь подвинуться.', effects: [...once('c5_local.done'), { set: '$.c5_local.result', value: 'work' }, { body: 'fatigue', delta: 6 }] },
   { id: 'c5_local_talk', label: 'Возразить, не обещая работу за всех', minutes: 12, terminal: true, goto: 'c5_north', text: '— А я за всех и не прошу, — отвечает он. Вы стоите друг напротив друга. Второй берёт ящик один, прижимая его к животу.', effects: [...once('c5_local.done'), { set: '$.c5_local.result', value: 'talk' }, { body: 'stress', delta: 5 }] },
   { id: 'c5_local_support', label: 'Отдать местным свою пачку еды', minutes: 8, terminal: true, goto: 'c5_north', enabled: { has: 'oats' }, disabledReason: 'Пачки хлопьев при тебе нет', text: 'Он прячет пачку между ящиками. — Не мне, на кухню. — Ты видишь, что он оставил её на своей стороне.', effects: [...once('c5_local.done'), { set: '$.c5_local.result', value: 'food' }, { take: 'oats' }] },
 ] }),
 S({ id: 'c5_nquiet', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Пустой термос', calm: true,
  text: [{ text: 'Хинрихсен сидит на краю скамьи, не снимая куртки. Ты ставишь возле неё термос. Она протягивает руку и только потом замечает, что он пустой.' }, { when: pair, text: '{partner} садится с другой стороны. Хинрихсен смотрит на вас обоих, как будто вы пришли жаловаться.' }], actions: [
   { id: 'c5_nquiet_before', label: 'Спросить, работала ли она в этой школе', minutes: 8, when: fresh('c5_nquiet_before'), text: '— Нет. Прививала здесь детей раз в год. — Она проводит пальцем по скамье. — Они тогда тоже боялись. Садились с родителями.', effects: once('c5_nquiet_before') },
   { id: 'c5_nquiet_sleep', label: 'Предложить ей поспать до обеда', minutes: 8, when: fresh('c5_nquiet_sleep'), text: '— Во сне я не слышу, когда зовут. — Ты говоришь, что разбудишь. Хинрихсен закрывает термос. — Все так говорят. Потом стесняются.', effects: once('c5_nquiet_sleep') },
   { id: 'c5_nquiet_stay', label: 'Посидеть, пока она допишет имена', minutes: 15, terminal: true, goto: 'c5_north', text: 'Она не пишет. Вы сидите, пока из зала не зовут дежурную. Хинрихсен поднимается первой, опершись о твоё колено.', effects: once('c5_nquiet.done', [{ body: 'stress', delta: -3 }]) },
   { id: 'c5_nquiet_return', label: 'Вернуть ей термос и уйти', minutes: 3, terminal: true, goto: 'c5_north', text: 'Хинрихсен провожает тебя взглядом. Термос держит обеими руками. Крышку больше не отвинчивает.', effects: once('c5_nquiet.done') },
 ] }),
 S({ id: 'c5_nmeal', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Последний половник', universal: false,
  text: [{ text: 'Пожарный держит половник над последней миской. Мать мальчика стоит за тобой. — Кто первый, тому первый, — говорит он, но на неё не смотрит.' }, { when: pair, text: '{partner} трогает тебя за рукав. — А потом нам? — Пожарный поворачивает миску ручкой к тебе.' }], actions: [
   { id: 'c5_nmeal_ask', label: 'Спросить, когда сварят ещё', minutes: 5, when: fresh('c5_nmeal_ask'), text: 'Пожарный показывает на мешок крупы за навесом. — Когда принесут воду. — Пустое ведро стоит рядом с его ботинком.', effects: once('c5_nmeal_ask') },
   { id: 'c5_nmeal_take', label: 'Взять свою порцию', minutes: 20, terminal: true, goto: 'c5_north', text: 'Ты ешь, отойдя к стене. Женщина уносит пустую миску. Мальчик спрашивает, почему они опять идут в зал.', effects: once('c5_nmeal.done', [{ body: 'hunger', delta: -25 }]) },
   { id: 'c5_nmeal_give', label: 'Уступить миску женщине с мальчиком', minutes: 10, terminal: true, goto: 'c5_north', text: 'Она берёт миску обеими руками, чтобы не расплескать. Мальчик ест первым. Ты возвращаешься к своим вещам с половником, который забыл{m:|а} отдать.', effects: once('c5_nmeal.done', [{ body: 'stress', delta: 4 }]) },
 ] }),
 S({ id: 'c5_nfire', for: 'any', chapter: 'ch3', location: 'north_gym', title: 'Красный рукав', universal: false,
  text: [{ text: 'Горящий навес опускается на кухню. Рука Хинрихсен зажата между стойкой и котлом. — Газ! — кричит пожарный с другой стороны. Пламя уже касается шланга.' }, { when: pair, text: '{partner} тянет тебя за одежду. — Сначала её. — Хинрихсен просит держать стойку, не понимая, кто рядом.' }], actions: [
   { id: 'c5_nfire_fight', label: 'Поднять стойку и перекрыть газ', minutes: 12, terminal: true, goto: 'c5_north', risky: true,
    effects: [...once('c5_nfire.done'), { if: keeper(), then: [{ set: 'w.c3_n5', value: 'fight' }, { set: 'w.c3_n5_done', value: true }, { npc: 'c3_hinrichsen', status: 'injured', remember: 'saved_at_kitchen' }] }],
    outcomes: [
     { id: 'guest_cutoff', when: not(keeper()), check: { traits: ['technical', 'agility'], difficulty: 4, uses: ['mobility', 'focus'] }, text: 'Ты подставляешь плечо под стойку. {partner} исчезает за красным рукавом дежурной. Пожарный вытаскивает тебя из-под навеса; ладонь прилипла к металлу.', effects: [{ injure: 'burn', site: 'hands', severity: 1 }, { body: 'fatigue', delta: 9 }] },
     { id: 'guest_burn', when: not(keeper()), text: 'Ты хватаешь стойку обеими руками и сразу выпускаешь. Пожарный закрывает тебя курткой. Из-под неё видны только ботинки {partner.gen}.', effects: [{ injure: 'burn', site: 'hands', severity: 2 }, { body: 'stress', delta: 16 }] },
     { id: 'cutoff', check: { traits: ['technical', 'agility'], difficulty: 4, uses: ['mobility', 'focus'] }, text: 'Ты прижимаешь рукав к вентилю и крутишь до упора. Хинрихсен выскальзывает из-под стойки. Пожарный закрывает котёл крышкой. Рукав тлеет уже на тебе.', effects: [{ injure: 'burn', site: 'hands', severity: 1 }, { body: 'fatigue', delta: 9 }] },
     { id: 'burn', text: 'Вентиль не поворачивается. Ты тянешь стойку, освобождая руку дежурной. Пожарный сбивает тебя на землю и накрывает курткой. Пламя пробегает по твоим пальцам. За спиной пожарного гаснет огонь.', effects: [{ injure: 'burn', site: 'hands', severity: 2 }, { body: 'stress', delta: 16 }] },
    ] },
   { id: 'c5_nfire_close', label: 'Вытащить дежурную, оставить кухню огню', minutes: 8, terminal: true, goto: 'c5_north', outcomes: [{ id: 'guest', when: not(keeper()), text: 'Ты подхватываешь Хинрихсен под локоть. {partner} держит её с другой стороны. Пожарный просит отойти; ты пятишься, не выпуская рукава.' }, { id: 'host', text: 'Ты тянешь Хинрихсен за красный рукав. Пожарный отпускает стойку и закрывает проход щитом. За ним остаётся котёл и мешки крупы.' }], effects: [...once('c5_nfire.done'), { body: 'stress', delta: 10 }, { if: keeper(), then: [{ set: 'w.c3_n5', value: 'close' }, { set: 'w.c3_n5_done', value: true }, { set: 'w.c3_north_kitchen_lost', value: true }, { npc: 'c3_hinrichsen', status: 'injured' }] }] },
   { id: 'c5_nfire_leave', label: 'Увести людей от навеса', minutes: 6, terminal: true, goto: 'c5_north', outcomes: [{ id: 'guest', when: not(keeper()), text: 'Ты разворачиваешь очередь к залу. Из дыма зовут дежурную. Ты держишь дверь, пока последний человек не пройдёт мимо тебя.' }, { id: 'host', text: 'Ты разворачиваешь очередь к залу. Из дыма Хинрихсен выносит пожарный, держа под мышки. Твоя рука уже лежит на дверной ручке.' }], effects: [...once('c5_nfire.done'), { body: 'stress', delta: 16 }, { if: keeper(), then: [{ set: 'w.c3_n5', value: 'leave' }, { set: 'w.c3_n5_done', value: true }, { set: 'w.c3_north_kitchen_lost', value: true }, { npc: 'c3_hinrichsen', status: 'injured', set: { smoke: true } }] }] },
 ] }),
].map((scene): Scene => scene.id === 'c5_nfire' ? scene : ({ ...scene, actions: [
 { id: 'c5_nfire_go', label: 'Крик у горящей кухни', minutes: 1, terminal: true, goto: 'c5_nfire', when: danger },
 ...scene.actions.map(a => ({ ...a, when: all(a.when ?? { always: true }, not(danger)) })),
] }));
export const north5Events: WorldEvent[] = [
 { id: 'ev_n5_child', at: at(12, 7, 10), scope: 'world', interrupt: true, when: all(C, { at: 'north_gym' }, { before: at(12, 13) }), effects: [], news: [{ channel: 'direct', text: 'Мальчик у матов зовёт мать. Он не плачет, но люди уже просыпаются.' }] },
 { id: 'ev_n5_local', at: at(12, 8), scope: 'world', interrupt: true, when: all(C, { at: 'north_gym' }, { before: at(12, 13) }), effects: [], news: [{ channel: 'direct', text: 'У двери спорят о работе. Хинрихсен просит не кричать возле спящих.' }] },
 { id: 'ev_n5_fire', at: at(12, 11), scope: 'world', interrupt: true, when: all(C, { at: 'north_gym' }, { before: at(12, 11, 50) }), effects: [], news: [{ channel: 'direct', text: 'Кухонный навес падает на котёл. Дежурная кричит, чтобы перекрыли газ.' }] },
 { id: 'ev_n5_missed', at: at(12, 11, 50), scope: 'world', when: all(C, { at: 'north_gym' }, keeper(), not(flag('w.c3_n5_done'))), effects: [{ set: 'w.c3_n5', value: 'missed' }, { set: 'w.c3_n5_done', value: true }, { set: 'w.c3_north_kitchen_lost', value: true }] },
];
