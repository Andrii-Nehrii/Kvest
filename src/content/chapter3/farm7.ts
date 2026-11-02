import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, flag, keeper, not, npcHere } from './world3';
const S = (s: Scene) => s;
const C = all({ cp: 6 }, not({ cp: 7 }));
const fresh = (id: string) => not(flag(`$.${id}`));
const pair = all(flag('w.together'), { partnerAt: 'hof_luedemann' }, { partner: 'active' });
const h = npcHere('henrike', 'hof_luedemann');
const o = npcHere('ole', 'hof_luedemann');
const k = npcHere('c3_koehler', 'hof_luedemann');
const d = npcHere('deniz', 'hof_luedemann');
const b = npcHere('kerem', 'hof_luedemann');
const p = npcHere('pawel', 'hof_luedemann');
const day = { after: at(13, 6) };
const house = { outdoor: false, wet: false, tempC: 18 };
const end = (value: string): Cond => ({ v: 'w.c3_f7', op: '==', value });
const alarm = all(C, { after: at(13, 11, 10) }, { before: at(13, 11, 45) }, k, h, fresh('c7_fshed.done'), not(flag('w.c3_f7_done')));
const wait: ActionDef = { id: 'c7_fwait', label: 'Передохнуть до следующего часа', minutes: 60, activity: 'rest', repeatable: true, text: 'Хенрике просит пока не выходить во двор. Ты садишься у окна, откуда видна ограда.' };
export const farm7Scenes: Scene[] = [
 S({ id: 'c7_farm', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Четвёртое утро', safe: true, ambient: house,
  text: [
   { when: { before: at(13, 6) }, text: 'Хенрике показывает на часы. — До утра спите. Ночью только ко мне стучать. — Ты можешь лечь; дверь она оставляет приоткрытой.' },
   { when: all(day, { before: at(13, 9) }), text: 'Хенрике отставляет кастрюлю от огня. — Сначала поешьте. Потом расскажете, как спали. — Место возле неё свободно.' },
   { when: all({ after: at(13, 9, 10) }, { before: at(13, 11, 10) }), text: 'Хенрике держит ключ от отдельного сарая. — Его пока не трогать. Воды отнесём. — Оле выходит из кухни, не ответив матери.' },
   { when: all({ after: at(13, 11, 45) }, { before: at(13, 13) }), text: 'Хенрике просит собраться у стола к часу. — По одному больше не решаем. — Ты оставляешь место для {partner.gen}.' },
   { when: end('kill'), text: 'Хенрике ставит возле сарая ведро. Мочить тряпку Оле берётся сам. — Не сюда, — говорит он, когда ты подходишь.' },
   { when: end('lock'), text: 'За дверью сарая скребут по доскам. Кёлер спрашивает, где теперь её вещи. Хенрике просит пока ничего не забирать.' },
   { when: end('missed'), text: 'Кёлер держит распухшую кисть на коленях. Оле пробует попросить прощения. Она просит принести воды.' },
   { when: all({ after: at(13, 12, 20) }, { npc: 'kerem', alive: true, at: 'b75_road' }, d), text: 'Дениз выходит без куртки и смотрит на поворот. — Ушёл. — Он возвращается за ключами, но садится возле тебя.' },
   { when: { after: at(13, 13) }, text: 'Хенрике зовёт вас обоих. — Всё, садитесь. — Она не гасит свет над столом.' },
  ], actions: [
   { id: 'c7_fsleep', label: 'Поспать рядом с {partner.ins}', minutes: 0, repeatable: true, when: { before: at(13, 6) }, effects: [{ sleep: 600 }], text: '{partner} находит твою руку под одеялом. — Разбуди, если пойдёшь. — Ты закрываешь глаза раньше, чем успеваешь ответить.' },
   { id: 'c7_fmeal', label: 'Позавтракать у хозяйки', minutes: 25, when: all(day, fresh('c7_fmeal')), enabled: { stocked: 'oats', qty: 0.25, at: 'c3_farm_stock' }, disabledReason: 'Хлопьев на порцию не осталось', text: 'Хенрике двигает к тебе миску. — Не дели сейчас. Кому не хватит, я вижу. — Ложку ты берёшь другой рукой.', effects: once('c7_fmeal', [{ unstock: 'oats', qty: 0.25, at: 'c3_farm_stock' }, { take: 'oats', qty: 0.25 }, { body: 'hunger', delta: -30 }]) },
   { id: 'c7_fpair_go', label: 'Поговорить с {partner.ins} о ночи', minutes: 2, terminal: true, goto: 'c7_fpair', when: all(day, pair, fresh('c7_fpair.done')) },
   { id: 'c7_fditch_go', label: 'Посмотреть, кого узнал Оле', minutes: 2, terminal: true, goto: 'c7_fditch', when: all({ after: at(13, 7, 10) }, { before: at(13, 9) }, o, fresh('c7_fditch.done')) },
   { id: 'c7_frules_go', label: 'Спросить Хенрике о человеке в сарае', minutes: 2, terminal: true, goto: 'c7_frules', when: all({ after: at(13, 9, 10) }, h, fresh('c7_frules.done')) },
   { id: 'c7_fpawel_go', label: 'Выслушать Павла у печи', minutes: 2, terminal: true, goto: 'c7_fpawel', when: all(day, p, fresh('c7_fpawel.done')) },
   { id: 'c7_fguest_go', label: 'Спросить Кёлер о сегодняшнем дне', minutes: 2, terminal: true, goto: 'c7_fguest', when: all(day, k, fresh('c7_fguest.done'), { before: at(13, 11, 10) }) },
   { id: 'c7_fleg_go', label: 'Поговорить с Денизом о ноге', minutes: 2, terminal: true, goto: 'c7_fleg', when: all(day, d, fresh('c7_fleg.done')) },
   { id: 'c7_fbrothers_go', label: 'Окликнуть Керема с сумкой', minutes: 2, terminal: true, goto: 'c7_fbrothers', when: all({ after: at(13, 9, 30) }, b, d, fresh('c7_fbrothers.done'), { before: at(13, 12, 20) }) },
   { id: 'c7_fafter_go', label: 'К тем, кто остался возле сарая', minutes: 2, terminal: true, goto: 'c7_fafter', when: all(flag('w.c3_f7_done'), fresh('c7_fafter.done')) },
   { id: 'c7_flunch_go', label: 'Выслушать хозяйку перед связью', minutes: 2, terminal: true, goto: 'c7_flunch', when: all({ after: at(13, 12) }, h, fresh('c7_flunch.done')) },
   wait, cpAction(7),
  ] }),
 S({ id: 'c7_fpair', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Как спали', calm: true, ambient: house,
  text: [{ text: '{partner} ждёт, пока ты сядешь. — Слушай. Я не против помогать. Я против узнавать последн{pm:им|ей}, где мне сегодня спать. — {pm:Он|Она} придвигает твою обувь к печи.' }], actions: [
   { id: 'c7_fpair_ask', label: 'Спросить, чего {partner} хочет сегодня', minutes: 8, when: fresh('c7_fpair_ask'), text: '— Одного часа вдвоём. Не караулить кого-нибудь, не ждать, пока ты вернёшься. Просто вдвоём. — {partner} смотрит, будешь ли ты обещать сразу.', effects: once('c7_fpair_ask') },
   { id: 'c7_fpair_tell', label: 'Сказать, что тоже не хочешь решать один', minutes: 8, when: fresh('c7_fpair_tell'), text: 'Ты говоришь, что вчера у ворот тоже хотел{m:|а} спросить. {partner} кивает. — Тогда сегодня спроси. Пока не началось.', effects: once('c7_fpair_tell') },
   { id: 'c7_fpair_yes', label: 'Договориться о часе после полудня', minutes: 10, terminal: true, goto: 'c7_farm', text: '{partner} называет время. Ты повторяешь вслух. — Вот так понятнее, — говорит {pm:он|она}. — Я буду ждать тебя здесь.', effects: once('c7_fpair.done', [{ set: '$.c7_fpair.hour', value: true }]) },
   { id: 'c7_fpair_no', label: 'Признаться, что пока не можешь обещать', minutes: 10, terminal: true, goto: 'c7_farm', text: '{partner} отпускает твою руку. — Ладно. Тогда я сам{pm:|а} решу, чем займусь. — На этот раз {pm:он|она} уходит из комнаты перв{pm:ым|ой}.', effects: once('c7_fpair.done', [{ body: 'stress', delta: 4 }]) },
  ] }),
 S({ id: 'c7_fditch', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Человек у ограды', universal: false, ambient: { outdoor: true },
  text: [{ text: 'Оле показывает на человека в канаве. Лоб разбит, на спине мокрая почтовая сумка. Хенрике окликает его: — Мартин! — Он поворачивается на её голос.' }, { when: pair, text: '{partner} придерживает тебя за локоть. — Сначала пусть ответит. — Хенрике зовёт его ещё раз.' }], actions: [
   { id: 'c7_fditch_ask', label: 'Спросить Хенрике, кто он', minutes: 5, when: fresh('c7_fditch_ask'), text: '— Почту возил. Двадцать лет. — Хенрике узнаёт сумку, хотя мужчина прикрывает её локтем. — Мартин Ребер. Он нас всех знает.', effects: once('c7_fditch_ask') },
   { id: 'c7_fditch_close', label: 'Спуститься и помочь ему подняться', minutes: 12, risky: true, terminal: true, goto: 'c7_farm', effects: once('c7_fditch.done'), outcomes: [
    { id: 'step', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] }, text: 'Ты берёшь его за локоть через рукав. Он тянет тебя слишком сильно. Оле перехватывает твою куртку сверху. — Назад.', effects: [{ injure: 'bruise', site: 'hands', severity: 1 }] },
    { id: 'fall', text: 'Ты съезжаешь по мокрому склону. Мужчина хватает твою куртку; Оле вытаскивает тебя вместе с ним. На ногу ты наступаешь не сразу.', effects: [{ injure: 'sprain', site: 'leftLeg', severity: 1 }] },
   ] },
   { id: 'c7_fditch_wait', label: 'Остаться за оградой, позвать его голосом', minutes: 12, terminal: true, goto: 'c7_farm', text: 'Ты спрашиваешь, понимает ли он тебя. Мартин закрывает глаза от света. Хенрике велит Оле принести воду. — До осмотра отдельно.', effects: once('c7_fditch.done', [{ npc: 'henrike', trust: -1 }]) },
  ] }),
 S({ id: 'c7_frules', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Кого знают', calm: true, ambient: house,
  text: [{ text: 'Хенрике отвела Мартину отдельный сарай. — Дверь закрыта. Если найдём врача — посмотрит. — Оле спрашивает, какой врач. Она кладёт ключ на стол.' }], actions: [
   { id: 'c7_frules_ask', label: 'Спросить, почему ему она доверяет', minutes: 8, when: fresh('c7_frules_ask'), text: '— Я ему не доверяю. Я его знаю. — Хенрике смотрит на тебя. — Он мне лекарства привозил, когда болела. Сам предложил. Сейчас ему помочь надо.', effects: once('c7_frules_ask') },
   { id: 'c7_frules_pawel', label: 'Напомнить о вчерашнем страхе за Павла', minutes: 8, when: fresh('c7_frules_pawel'), text: 'Хенрике не отвечает сразу. — Про Павла ты прав{m:|а}. — Ключ она передвигает от себя. — Но отсюда его на дорогу не вытолкну.', effects: once('c7_frules_pawel') },
   { id: 'c7_frules_help', label: 'Предложить передавать воду без входа', minutes: 12, terminal: true, goto: 'c7_farm', text: 'Хенрике показывает маленькое окно в стене сарая. — Только отсюда. Дверь не открывать. — Оле забирает ключ со стола.', effects: once('c7_frules.done') },
  ] }),
 S({ id: 'c7_fpawel', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Сказать своим голосом', calm: true, ambient: house,
  text: [{ text: 'Павел включает запись, но говорить не начинает. — Писать могу что хочешь. А голос она услышит. — Он просит тебя остаться, пока попробует.' }], actions: [
   { id: 'c7_fpawel_ask', label: 'Спросить, чего он боится сказать', minutes: 8, when: fresh('c7_fpawel_ask'), text: '— Что хочу домой. Она тоже хочет. А как — ни я, ни она. — Павел нажимает запись и сразу останавливает.', effects: once('c7_fpawel_ask') },
   { id: 'c7_fpawel_words', label: 'Предложить начать с её имени', minutes: 8, when: fresh('c7_fpawel_words'), text: 'Павел называет жену по имени и замолкает. Потом просит включить ещё раз. — Первое не стирай. Там я нормально сказал.', effects: once('c7_fpawel_words') },
   { id: 'c7_fpawel_record', label: 'Посидеть рядом, пока он запишет', minutes: 18, terminal: true, goto: 'c7_farm', text: 'Павел записывает, где лежит его одежда и кто помогает с рукой. Прослушивать не хочет. — Вот это оставим. — Ответа на вчерашнее сообщение пока нет.', effects: once('c7_fpawel.done', [{ set: '$.c7_fpawel.recorded', value: true }]) },
   { id: 'c7_fpawel_leave', label: 'Оставить телефон ему и выйти', minutes: 5, terminal: true, goto: 'c7_farm', text: '— Ладно, сам. — Павел отворачивает экран. Из-за двери ты слышишь первое слово, потом кашель.', effects: once('c7_fpawel.done') },
  ] }),
 S({ id: 'c7_fguest', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Не просить заново', calm: true, ambient: house,
  text: [{ text: 'Кёлер просит хозяйку дать ей работу. — Только скажите, на сколько остаюсь. А то всё утро боюсь занять лишнее место. — Хенрике отодвигает ей табурет ногой.' }], actions: [
   { id: 'c7_fguest_ask', label: 'Спросить, что она умеет кроме печи', minutes: 8, when: fresh('c7_fguest_ask'), text: '— В больнице полы мыла. До пекарни. — Кёлер смотрит на твой рукав. — Рану промыть могу. Решать, что это за рана, — нет.', effects: once('c7_fguest_ask') },
   { id: 'c7_fguest_loss', label: 'Спросить про её мешок', minutes: 8, when: all(flag('w.c3_f6_flour_lost'), fresh('c7_fguest_loss')), text: '— Деньги в кармане ещё есть. А муки нет. — Кёлер разводит ладони. — Вот что теперь кому предложишь?', effects: once('c7_fguest_loss') },
   { id: 'c7_fguest_end', label: 'Пойти с ней к хозяйке за работой', minutes: 12, terminal: true, goto: 'c7_farm', text: 'Хенрике даёт ей чистое ведро. — Потом воду отнесёшь. Через окно. Ключ у Оле. — Кёлер повторяет, что дверь не откроет.', effects: once('c7_fguest.done') },
  ] }),
 S({ id: 'c7_fleg', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Можно ли уехать', calm: true, ambient: house,
  text: [{ when: { npcVar: 'deniz', key: 'c3_cart_leg' }, text: 'Дениз сидит с ногой на лавке. — Вчера не проверил ось. Зато теперь все знают, где она. — Керему шутка не нравится.' }, { when: not({ npcVar: 'deniz', key: 'c3_cart_leg' }), text: 'Дениз просит тебя посмотреть, как он наступает на ногу. — Керем говорит, хромаю. Я говорю, пол кривой. — Он проходит до двери ещё раз.' }], actions: [
   { id: 'c7_fleg_ask', label: 'Спросить, сможет ли он вести машину', minutes: 8, when: fresh('c7_fleg_ask'), text: '— Пока не поедем, не узнаю. Проверять на вас не хочу. — Дениз прячет ключи. — Сначала пешком до ворот.', effects: once('c7_fleg_ask') },
   { id: 'c7_fleg_brother', label: 'Спросить, о чём они с братом спорят', minutes: 8, when: fresh('c7_fleg_brother'), text: '— Он хочет уехать. Я тоже хочу. Только ему кажется, я тут освоился. — Дениз зовёт Керема, потом вспоминает, что просил его не мешать.', effects: once('c7_fleg_brother') },
   { id: 'c7_fleg_walk', label: 'Пройти с ним до ворот и обратно', minutes: 18, terminal: true, goto: 'c7_farm', text: 'Ты подстраиваешь шаг под Дениза. Он просит обойти одну лужу и останавливается у другой. Назад идти предлагает первым.', effects: once('c7_fleg.done') },
  ] }),
 S({ id: 'c7_fbrothers', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'До полудня', calm: true, ambient: house,
  text: [{ text: 'Керем складывает вещи. — Если опять ждать, так скажите до чего. — Дениз сидит у двери. — До разговора. До полудня. — Брат проверяет часы.' }], actions: [
   { id: 'c7_fbrothers_ask', label: 'Спросить Керема, куда он собрался', minutes: 8, when: fresh('c7_fbrothers_ask'), text: '— К дороге. Там машины идут. Можно спросить, что дальше. — Он смотрит на брата. — Не отсюда же смотреть всю жизнь.', effects: once('c7_fbrothers_ask') },
   { id: 'c7_fbrothers_wait', label: 'Попросить его дождаться общего решения', minutes: 10, terminal: true, goto: 'c7_farm', text: '— До двенадцати. Потом я сам. — Керем кладёт сумку под лавку, ближе к выходу. Дениз ничего не добавляет.', effects: [...once('c7_fbrothers.done'), { set: '$.c7_requested_wait', value: true }, { npc: 'kerem', remember: 'c3_asked_to_wait_until_noon' }] },
   { id: 'c7_fbrothers_go', label: 'Сказать, что удерживать его не станешь', minutes: 8, terminal: true, goto: 'c7_farm', text: 'Керем кивает тебе. — Брату объясни. — Дениз смотрит на тебя, пока Керем поднимает сумку.', effects: once('c7_fbrothers.done', [{ body: 'stress', delta: 5 }]) },
  ] }),
 S({ id: 'c7_fshed', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'У маленького окна', universal: false, ambient: { outdoor: true },
  text: [{ text: 'Мужчина в сарае держит Кёлер за кисть через маленькое окно. Она упирается ногами в стену. — Он не отпускает! — Оле подбегает с ломом.' }, { text: 'Хенрике хватает сына за рукав. — Мартин! Ты меня слышишь? — Мужчина тянет руку Кёлер к открытому рту. Оле просит мать отойти.' }, { when: pair, text: '{partner} держит Кёлер за пояс. — Руку сломаем. Откройте дверь или делайте что-нибудь! — Поднять её {pm:он|она} уже не может.' }], actions: [
   { id: 'c7_fshed_hit', label: 'Взять лом, ударить человека через окно', minutes: 6, risky: true, terminal: true, goto: 'c7_fafter', effects: [...once('c7_fshed.done'), { if: keeper(), then: [{ set: 'w.c3_f7', value: 'kill' }, { set: 'w.c3_f7_done', value: true }, { npc: 'c3_mailman', alive: false }, { npc: 'henrike', remember: 'c3_killed_martin' }] }], outcomes: [
    { id: 'guest', when: not(keeper()), text: 'Ты прижимаешь ломом его руку к раме. {partner} становится ближе к окну. Кёлер вырывается, тебя бьёт локтем по губе.', effects: [{ injure: 'bruise', site: 'head', severity: 1 }] },
    { id: 'hit', check: { traits: ['strength'], difficulty: 4, uses: ['strength'] }, text: 'Ты бьёшь по его виску. Кёлер падает назад; ты успеваешь подхватить её плечом. Хенрике называет его по имени ещё раз.', effects: [{ injure: 'bruise', site: 'hands', severity: 1 }, { body: 'stress', delta: 20 }] },
    { id: 'hurt', text: 'Ты бьёшь, лом скользит по раме. Второй удар приходится выше. Кёлер отползает от стены; кисть ты разжимаешь с помощью Оле.', effects: [{ injure: 'sprain', site: 'rightArm', severity: 2 }, { body: 'stress', delta: 25 }] },
   ] },
   { id: 'c7_fshed_lock', label: 'Сломать раму, запереть сарай целиком', minutes: 8, terminal: true, goto: 'c7_fafter', outcomes: [{ id: 'guest', when: not(keeper()), text: 'Ты оттаскиваешь Кёлер от окна, пока Оле отжимает чужие пальцы ломом. {partner} остаётся у сарая. Женщина цепляется за твою куртку.' }, { id: 'owner', text: 'Оле отжимает его пальцы ломом, ты оттаскиваешь Кёлер. Хенрике захлопывает дверь перед мужчиной. Окно Оле закрывает доской. Ключ она отдаёт сыну.' }], effects: [...once('c7_fshed.done'), { body: 'fatigue', delta: 8 }, { if: keeper(), then: [{ set: 'w.c3_f7', value: 'lock' }, { set: 'w.c3_f7_done', value: true }, { set: 'w.c3_f7_shed_lost', value: true }, { npc: 'c3_mailman', moveTo: 'c3_farm_shed', set: { locked: true } }, { npc: 'c3_koehler', remember: 'c3_pulled_from_window' }] }] },
  ] }),
 S({ id: 'c7_fafter', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'У стены сарая', calm: true, ambient: { outdoor: true },
  text: [{ when: end('kill'), text: 'Хенрике снимает с гвоздя почтовую сумку. — Его жена за ней придёт. — Она пытается застегнуть замок, не глядя внутрь.' }, { when: end('lock'), text: 'Кёлер просит достать её пальто из сарая. Оле показывает ключ. — Не сейчас. — Она остаётся возле стены, обняв себя за плечи.' }, { when: end('missed'), text: 'Кисть Кёлер распухает на глазах. — Дверью. Не зубами, — повторяет она. Оле стоит рядом с ключом, не зная, куда его деть.' }, { when: not(keeper()), text: '{partner} отводит тебя к дому. — Ты как? — Кёлер просит дать и тебе присесть.' }], actions: [
   { id: 'c7_fafter_ask', label: 'Спросить Кёлер, цела ли рука', minutes: 6, when: fresh('c7_fafter_ask'), text: 'Она шевелит пальцами по одному. — Вот этим не могу. — Оле наклоняется посмотреть. Кёлер отодвигается от него.', effects: once('c7_fafter_ask') },
   { id: 'c7_fafter_h', label: 'Спросить Хенрике, что теперь делать', minutes: 8, when: fresh('c7_fafter_h'), text: '— В дом. Всем. — Хенрике смотрит на твою руку. — Знаю. Сначала руки. — Она идёт за водой сама.', effects: once('c7_fafter_h') },
   { id: 'c7_fafter_end', label: 'Проводить их к кухне', minutes: 8, terminal: true, goto: 'c7_farm', text: 'Ты идёшь последн{m:им|ей}. Оле ждёт у двери, пока все войдут. — Теперь запру. — Он показывает матери засов.', effects: once('c7_fafter.done') },
  ] }),
 S({ id: 'c7_flunch', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Что обещали', calm: true, ambient: house,
  text: [{ text: 'Хенрике ставит между вами воду. — Сейчас решим, что до ночи. А не каждый сам себе. — {partner} просит тебя сесть рядом.' }], actions: [
   { id: 'c7_flunch_ask', label: 'Спросить, чего ждёт от вас хозяйка', minutes: 8, when: fresh('c7_flunch_ask'), text: '— Честного ответа. Если уходите — скажите. Если останетесь — тоже. — Хенрике отодвигает от тебя пустое ведро.', effects: once('c7_flunch_ask') },
   { id: 'c7_flunch_end', label: 'Выслушать {partner.acc} перед общим решением', minutes: 12, terminal: true, goto: 'c7_farm', text: '{partner} придвигается ближе. Ты ждёшь, пока {pm:он|она} закончит. Хенрике впервые за утро не перебивает.', effects: once('c7_flunch.done') },
  ] }),
].map((scene): Scene => scene.id === 'c7_fshed' ? scene : ({ ...scene, actions: [
 { id: 'c7_fshed_go', label: 'К крику Кёлер у сарая', minutes: 1, terminal: true, goto: 'c7_fshed', when: alarm },
 ...scene.actions.map(a => ({ ...a, when: all(a.when ?? { always: true }, not(alarm)) })),
] }));
export const farm7Events: WorldEvent[] = [
 { id: 'ev_f7_return', at: at(13, 7, 10), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, o), effects: [], news: [{ channel: 'direct', text: 'Оле зовёт мать к ограде. Вчерашний человек сидит в канаве, прижав сумку к груди. Хозяйка узнаёт его.' }] },
 { id: 'ev_f7_brothers', at: at(13, 9, 30), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, b, d), effects: [], news: [{ channel: 'direct', text: 'Керем собирается к дороге. Дениз просит его дождаться разговора со всеми. Сумку брат не ставит.' }] },
 { id: 'ev_f7_shed', at: at(13, 11, 10), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, k, h), effects: [], news: [{ channel: 'direct', text: 'Кёлер кричит возле сарая. Оле требует у матери ключ. По стене несколько раз ударяет пустое ведро.' }] },
 { id: 'ev_f7_missed', at: at(13, 11, 45), scope: 'world', when: all(C, keeper(), k, not(flag('w.c3_f7_done'))), effects: [{ set: 'w.c3_f7', value: 'missed' }, { set: 'w.c3_f7_done', value: true }, { set: 'w.c3_f7_shed_lost', value: true }] },
];
