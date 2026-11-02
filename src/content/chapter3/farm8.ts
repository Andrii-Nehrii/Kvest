import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, flag, keeper, not, npcHere } from './world3';
const S = (s: Scene) => s;
const C = all({ cp: 7 }, not({ cp: 8 }));
const fresh = (id: string) => not(flag(`$.${id}`));
const pair = all(flag('w.together'), { partnerAt: 'hof_luedemann' }, { partner: 'active' });
const h = npcHere('henrike', 'hof_luedemann');
const o = npcHere('ole', 'hof_luedemann');
const d = npcHere('deniz', 'hof_luedemann');
const k = npcHere('c3_koehler', 'hof_luedemann');
const p: Cond = all({ npc: 'pawel', alive: true }, { any: [{ npc: 'pawel', at: 'hof_luedemann' }, { npc: 'pawel', at: 'farm_coop' }] });
const b = npcHere('kerem', 'hof_luedemann');
const house = { outdoor: false, wet: false, tempC: 18 };
const end = (value: string): Cond => ({ v: 'w.c3_f8', op: '==', value });
const alarm = all(C, h, o, { after: at(13, 18, 40) }, { before: at(13, 19, 15) }, fresh('c8_fsmoke.done'), not(flag('w.c3_f8_done')));
const back: ActionDef = { id: 'c8_fback', label: 'Вернуться к остальным', minutes: 2, terminal: true, goto: 'c8_farm' };
const wait: ActionDef = { id: 'c8_fwait', label: 'Передохнуть до следующего часа', minutes: 60, activity: 'rest', repeatable: true, text: 'Ты садишься у стены. Оле тихо спрашивает, не нужно ли кому воды. Ты отвечаешь, не вставая.' };
export const farm8Scenes: Scene[] = [
 S({ id: 'c8_fshift', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Обещанный день', calm: true, ambient: { outdoor: true },
  text: [{ when: flag('w.c3_f7_guard'), text: 'Оле передаёт вам ключ. — Полтора часа. Дверь не открывать. — Он идёт к дому, несколько раз оборачиваясь.' }, { when: { v: 'w.c3_trip7', op: '==', value: 'search' }, text: 'Дениз показывает поворот, который виден от ограды. — Дальше не побегу. Тут подождём. — Ты ставишь воду у его ног.' }], actions: [
   { id: 'c8_fshift_guard', label: 'Отстоять обещанную смену у сарая', minutes: 90, terminal: true, goto: 'c8_farm', when: flag('w.c3_f7_guard'), text: 'Оле возвращается, когда ты уже несколько раз проверил{m:|а} часы. — Не открывали? — Ты отдаёшь ключ, не вставая сразу.', effects: once('c8_guard_cost', [{ body: 'fatigue', delta: 6 }]) },
   { id: 'c8_fshift_search', label: 'Подождать Керема вместе с Денизом', minutes: 75, terminal: true, goto: 'c8_farm', when: { v: 'w.c3_trip7', op: '==', value: 'search' }, text: 'У поворота никого нет. Дениз просит оставить здесь воду и вернуться к дому. — До темноты ещё выйдем. — Он оглядывается последним.', effects: once('c8_search_cost', [{ body: 'fatigue', delta: 4 }]) },
  ] }),
 S({ id: 'c8_farm', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'До ночи', safe: true, ambient: house,
  text: [
   { when: all({ before: at(13, 16) }, fresh('c8_fsmoke.done')), text: 'Хенрике оставляет для вас свободную лавку. — Пока тихо, отдыхайте. — Она работает в другом конце кухни.' },
   { when: all({ after: at(13, 16) }, fresh('c8_fsmoke.done'), not(flag('w.c3_f8_done'))), text: 'Оле приносит матери пальто. — Надень. И сядь хоть ненадолго. — Хенрике берёт пальто, но остаётся на ногах.' },
   { when: all({ after: at(13, 14, 20) }, p, fresh('c8_fpawel.done')), text: 'Павел зовёт тебя, не отходя от своего места. На телефоне сообщение: «Мы дома. Когда ты вернёшься?» Он просит прочесть вслух.' },
   { when: all({ after: at(13, 18, 20) }, b, fresh('c8_freturned.done'), fresh('c8_freturned_ask'), fresh('c8_freturned_water')), text: 'Керем стоит у двери с пустой бутылкой. Дениз просит его войти. — Сперва не ругай, — говорит брат. Бутылку он ставит на пол.' },
   { when: all(end('window'), fresh('c8_faftermath_echo')), text: 'Из разбитого окна тянет по полу. Хенрике сидит в своём пальто и смотрит на осколки. — Там сегодня не ляжете. — Оле закрывает дверь кухни.' },
   { when: all(end('door'), fresh('c8_faftermath_echo')), text: 'Хенрике не даёт снять с неё пальто: болит плечо. Оле спрашивает, сколько ей налить воды. Она впервые отвечает: — Немного.' },
   { when: all(end('missed'), fresh('c8_faftermath_echo')), text: 'Хенрике держит руку у груди. Оле просит её не вставать. В окно кухни он вставляет кусок картона, но тот выгибается от ветра.' },
   { when: all({ after: at(13, 20) }, { before: at(13, 21) }, { any: [flag('w.c3_f8_done'), flag('$.c8_fsmoke.done')] }), text: 'Оле зовёт всех к ночному разговору. До девяти можно посидеть в соседней комнате. Лечь там всем не хватит места.' },
   { when: { after: at(13, 21) }, text: '{partner} ждёт тебя у вещей. — Давай вместе. — Оле освобождает вам место возле матери.' },
  ], actions: [
   { id: 'c8_fpair_go', label: 'Найти час для {partner.gen}', minutes: 2, terminal: true, goto: 'c8_fpair', when: all(pair, fresh('c8_fpair.done')) },
   { id: 'c8_fguest_go', label: 'Посидеть с Кёлер после утра', minutes: 2, terminal: true, goto: 'c8_fguest', when: all(k, fresh('c8_fguest.done')) },
   { id: 'c8_fhenrike_go', label: 'Спросить хозяйку, когда она отдохнёт', minutes: 2, terminal: true, goto: 'c8_fhenrike', when: all(h, fresh('c8_fhenrike.done'), { before: at(13, 18, 40) }) },
   { id: 'c8_fpawel_go', label: 'Прочесть ответ Павлу', minutes: 2, terminal: true, goto: 'c8_fpawel', when: all(p, { after: at(13, 14, 20) }, fresh('c8_fpawel.done')) },
   { id: 'c8_fattic_go', label: 'Отнести телефон Павла повыше', minutes: 2, terminal: true, goto: 'c8_fattic', when: all(p, { after: at(13, 15) }, { before: at(13, 17) }, fresh('c8_fattic.done')) },
   { id: 'c8_fole_go', label: 'Выслушать Оле без хозяйки', minutes: 2, terminal: true, goto: 'c8_fole', when: all(o, { after: at(13, 16, 10) }, fresh('c8_fole.done')) },
   { id: 'c8_fdeniz_go', label: 'Посидеть с Денизом у окна', minutes: 2, terminal: true, goto: 'c8_fdeniz', when: all(d, { before: at(13, 18) }, fresh('c8_fdeniz.done')) },
   { id: 'c8_freturned_go', label: 'Выслушать вернувшегося Керема', minutes: 2, terminal: true, goto: 'c8_freturned', when: all(b, d, { after: at(13, 18, 20) }, fresh('c8_freturned.done')) },
   { id: 'c8_fafter_go', label: 'К Хенрике после дыма', minutes: 2, terminal: true, goto: 'c8_fafter', when: all(flag('w.c3_f8_done'), fresh('c8_fafter.done')) },
   { id: 'c8_fnight_go', label: 'Сесть с {partner.ins} перед ночлегом', minutes: 2, terminal: true, goto: 'c8_fnight', when: all(pair, { any: [flag('w.c3_f8_done'), flag('$.c8_fsmoke.done')] }, fresh('c8_fnight.done')) },
   back, wait, cpAction(8),
  ] }),
 S({ id: 'c8_fpair', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Ваш час', calm: true, ambient: house,
  text: [{ text: '{partner} просит закрыть дверь. — Не потому, что от людей прячемся. Я хочу тебя слышать, когда ты нормально говоришь. — Ты садишься напротив.' }], actions: [
   { id: 'c8_fpair_ask', label: 'Спросить, что {partner} запомнит об этом доме', minutes: 8, when: fresh('c8_fpair_ask'), text: '— Как она спрашивала, ели ли мы. Каждый раз. — {partner} смотрит на закрытую дверь. — Даже когда злилась.', effects: once('c8_fpair_ask') },
   { id: 'c8_fpair_tell', label: 'Сказать, чего больше всего хочется самому', minutes: 8, when: fresh('c8_fpair_tell'), text: 'Ты говоришь, что хочешь лечь и знать, где {partner}. {pm:Он|Она} протягивает руку. — Здесь. Сейчас здесь.', effects: once('c8_fpair_tell') },
   { id: 'c8_fpair_hour', label: 'Остаться вдвоём на час', minutes: 60, terminal: true, goto: 'c8_farm', text: 'За дверью несколько раз проходят. {partner} не отпускает твою руку, когда ты поднимаешь голову. Потом вы оба перестаёте считать шаги.', effects: once('c8_fpair.done', [{ body: 'stress', delta: -8 }, { body: 'fatigue', delta: -5 }]) },
   { id: 'c8_fpair_short', label: 'Попросить перенести час на ночь', minutes: 8, terminal: true, goto: 'c8_farm', text: '{partner} долго молчит. — Тогда ночью не исчезай. — Дверь {pm:он|она} открывает сам{pm:|а}.', effects: once('c8_fpair.done', [{ body: 'stress', delta: 5 }]) },
  ] }),
 S({ id: 'c8_fguest', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Остаться человеком', calm: true, ambient: house,
  text: [{ when: { npcVar: 'c3_koehler', key: 'c3_shed_hand' }, text: 'Кёлер придерживает миску локтем. — Не надо за меня ложку держать. Подвинь только. — Она ищет край здоровой рукой.' }, { when: not({ npcVar: 'c3_koehler', key: 'c3_shed_hand' }), text: 'Кёлер показывает пальцы Оле. — Двигаются. Хватит смотреть. — Он отходит, оставив ей свою кружку.' }], actions: [
   { id: 'c8_fguest_ask', label: 'Спросить, останется ли она здесь', minutes: 8, when: fresh('c8_fguest_ask'), text: '— Если сама решу. Если скажут, что раз спасли, теперь должна всё, — уйду. — Она просит передать это хозяйке без добавлений.', effects: once('c8_fguest_ask') },
   { id: 'c8_fguest_flour', label: 'Спросить, что она хочет сделать завтра', minutes: 8, when: fresh('c8_fguest_flour'), outcomes: [{ id: 'flour', when: { stocked: 'c3_flour', qty: 1, at: 'c3_farm_stock' }, text: '— Хлеб. Муки хоть немного осталось. — Кёлер просит не смеяться. — Умею. Хочу хоть это сама.' }, { id: 'none', text: '— Хлеб, если муку достанем. Сейчас картошку почищу. — Кёлер просит дать ей свой нож.' }], effects: once('c8_fguest_flour') },
   { id: 'c8_fguest_end', label: 'Передать её слова хозяйке как есть', minutes: 12, terminal: true, goto: 'c8_farm', text: 'Ты повторяешь сказанное. Хенрике отвечает из кухни: — Слышала сама. — Кёлер поворачивается к двери. — Тогда хорошо.', effects: once('c8_fguest.done') },
  ] }),
 S({ id: 'c8_fhenrike', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Кто решает', calm: true, ambient: house,
  text: [{ text: 'Хенрике просит тебя подержать рукав, пока застегнёт манжету. — Оле опять про отдых? Скажи ему: вечером. — Пуговицу она не сразу попадает в петлю.' }], actions: [
   { id: 'c8_fhenrike_ask', label: 'Спросить, что ещё осталось сделать', minutes: 8, when: fresh('c8_fhenrike_ask'), text: '— Чтобы все легли. Чтобы дверь заперли. Чтобы никто не пошёл сам. — Она смотрит на тебя. — Вот это всё и осталось.', effects: once('c8_fhenrike_ask') },
   { id: 'c8_fhenrike_son', label: 'Сказать, что Оле тоже боится за неё', minutes: 8, when: fresh('c8_fhenrike_son'), text: '— Знаю. Потому и слушать тяжело. — Хенрике просит отпустить рукав. — Дай самой застегнуть.', effects: once('c8_fhenrike_son') },
   { id: 'c8_fhenrike_end', label: 'Попросить её хотя бы поесть с вами', minutes: 15, terminal: true, goto: 'c8_farm', text: 'Хенрике обещает прийти, когда закончит на кухне. — Зови, если долго. — Твою миску она ставит рядом со своей.', effects: once('c8_fhenrike.done') },
  ] }),
 S({ id: 'c8_fpawel', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Дома', calm: true, ambient: house,
  text: [{ when: { npc: 'pawel', alive: true, at: 'farm_coop' }, text: 'Ты останавливаешься у курятника. Павел показывает телефон через окно. В дом его пока не пустили.' }, { text: 'Павел показывает сообщение. — «Мы дома». — Он повторяет два слова. Дальше жена спрашивает, когда он вернётся. На это читать вслух просит тебя.' }], actions: [
   { id: 'c8_fpawel_ask', label: 'Спросить, что он хочет ответить', minutes: 8, when: fresh('c8_fpawel_ask'), text: '— Что уже еду. — Павел смотрит на тебя. — Не буду так. — Стирает первую строчку.', effects: once('c8_fpawel_ask') },
   { id: 'c8_fpawel_help', label: 'Предложить сказать, что ищет дорогу', minutes: 8, when: fresh('c8_fpawel_help'), text: '— Она спросит, какую. — Павел думает, потом пишет сам: «Пока не знаю». Показывает тебе, прежде чем сохранить.', effects: once('c8_fpawel_help') },
   { id: 'c8_fpawel_end', label: 'Остаться, пока он ответит своими словами', minutes: 15, terminal: true, goto: 'c8_farm', text: 'Павел набирает медленно, одной рукой. В конце добавляет, что запись пришлёт следом. — Там голос мой. Пусть слышит.', effects: once('c8_fpawel.done', [{ set: '$.c8_fpawel.answered', value: true }]) },
  ] }),
 S({ id: 'c8_fattic', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Выше ловит', universal: false, ambient: { outdoor: false, wet: false, tempC: 9 },
  text: [{ text: 'На верхней ступеньке телефон начинает отправлять запись Павла. Ты поднимаешь его выше. Лестница отходит от стены; {partner} перехватывает её снизу.' }], actions: [
   { id: 'c8_fattic_ask', label: 'Попросить {partner.acc} проверить нижнюю ступень', minutes: 2, when: fresh('c8_fattic_ask'), text: '— Треснула. Не стой на ней. — {partner} прижимает лестницу к стене. Телефон всё ещё показывает отправку.', effects: once('c8_fattic_ask') },
   { id: 'c8_fattic_hold', label: 'Дождаться отправки, держась одной рукой', minutes: 12, risky: true, terminal: true, goto: 'c8_farm', effects: once('c8_fattic.done'), outcomes: [
    { id: 'sent', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] }, text: 'Ты передаёшь телефон вниз, увидев отметку отправки. {partner} принимает сначала его, потом твою руку. Последнюю ступень ты переступаешь.', effects: [{ body: 'fatigue', delta: 5 }] },
    { id: 'fall', text: 'Ступенька ломается. {partner} удерживает лестницу, но ты бьёшься голенью о край. Телефон {pm:он|она} ловит раньше тебя.', effects: [{ injure: 'bruise', site: 'leftLeg', severity: 2 }] },
   ] },
   { id: 'c8_fattic_back', label: 'Спуститься, отложить отправку', minutes: 8, terminal: true, goto: 'c8_farm', text: '{partner} помогает тебе слезть. — Она уже написала. Ответит и потом. — Телефон вы возвращаете Павлу без новой отметки.', effects: once('c8_fattic.done') },
  ] }),
 S({ id: 'c8_fole', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Отпустить мать', calm: true, ambient: house,
  text: [{ text: 'Оле просит тебя поговорить с матерью. — Мне она говорит: маленький ещё. Вам, может, послушает. — Он держит её пальто на вытянутой руке.' }], actions: [
   { id: 'c8_fole_ask', label: 'Спросить, сколько она сегодня спала', minutes: 8, when: fresh('c8_fole_ask'), text: '— Не знаю. Я лёг, она ещё ходила. Встал — уже ходила. — Оле снимает пальто с руки. — Мне бы это не разрешила.', effects: once('c8_fole_ask') },
   { id: 'c8_fole_rule', label: 'Спросить, сможет ли он решать вместо неё', minutes: 8, when: fresh('c8_fole_rule'), text: '— Если надо. — Оле ждёт, будешь ли спорить. Потом добавляет: — Только чтоб она рядом была.', effects: once('c8_fole_rule') },
   { id: 'c8_fole_end', label: 'Пойти с ним позвать хозяйку отдыхать', minutes: 12, terminal: true, goto: 'c8_farm', text: 'Хенрике берёт у сына пальто. — Вечером надену. Доволен? — Он просит её хотя бы сесть. Ты остаёшься рядом с ним.', effects: once('c8_fole.done') },
  ] }),
 S({ id: 'c8_fdeniz', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'У поворота', calm: true, ambient: house,
  text: [{ text: 'Дениз сидит так, чтобы видеть дорогу. — Скажет: не ждал. Я скажу: ждал. Опять целый разговор. — Он просит не занимать соседнее место.' }], actions: [
   { id: 'c8_fdeniz_ask', label: 'Спросить, что он скажет брату первым', minutes: 8, when: fresh('c8_fdeniz_ask'), text: '— Чтобы вошёл. — Дениз улыбается краем рта. — А дальше испорчу, конечно. — Он снова смотрит в окно.', effects: once('c8_fdeniz_ask') },
   { id: 'c8_fdeniz_end', label: 'Посидеть рядом, не закрывая ему дорогу', minutes: 15, terminal: true, goto: 'c8_farm', text: 'Ты садишься с другой стороны. Дениз спрашивает, не затекла ли у тебя рука. Пока ты отвечаешь, он впервые поворачивается к тебе.', effects: once('c8_fdeniz.done') },
  ] }),
 S({ id: 'c8_freturned', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Сначала войди', calm: true, ambient: house,
  text: [{ when: all(fresh('c8_freturned_ask'), fresh('c8_freturned_water')), text: 'Керем ждёт, пока брат договорит. Дениз говорит только: — Войди. — Керем ставит сумку на пол, не снимая с плеча лямку.' }, { when: { any: [flag('$.c8_freturned_ask'), flag('$.c8_freturned_water')] }, text: 'Керем садится рядом с братом. Дениз отодвигает сумку, чтобы не мешала ногам. Вопросы теперь можно задавать тише.' }], actions: [
   { id: 'c8_freturned_ask', label: 'Спросить, что он узнал у дороги', minutes: 8, when: fresh('c8_freturned_ask'), text: '— Что все едут к тем, у кого есть крыша. — Керем смотрит на брата. — Я им говорил: у нас есть. — Лямку он наконец снимает.', effects: once('c8_freturned_ask') },
   { id: 'c8_freturned_water', label: 'Спросить, нашёл ли он оставленную воду', minutes: 8, when: fresh('c8_freturned_water'), text: 'Керем кивает на бутылку. — По ней понял, что ждали. — Дениз берёт её с пола и ставит между вами.', effects: once('c8_freturned_water') },
   { id: 'c8_freturned_end', label: 'Дать братьям остаться рядом', minutes: 12, terminal: true, goto: 'c8_farm', text: 'Ты отходишь. Дениз освобождает место у стены; Керем садится к нему, не спрашивая. Сумку ставят между собой.', effects: once('c8_freturned.done') },
  ] }),
 S({ id: 'c8_fsmoke', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'За кухонной дверью', universal: false, ambient: { outdoor: false },
  text: [{ text: 'Из-под кухонной двери идёт дым. Хенрике не отвечает. Оле толкает створку; она приоткрывается и упирается в тело матери. Запертое изнутри окно выходит во двор.' }, { when: pair, text: '{partner} прижимает к лицу рукав. — Через окно вытащим. Дверью её придавишь. — Оле снова зовёт мать.' }], actions: [
   { id: 'c8_fsmoke_call', label: 'Окликнуть Хенрике через щель', minutes: 1, when: fresh('c8_fsmoke_call'), text: 'Ты зовёшь её по имени. Она кашляет у самого пола, пытается подняться и снова сползает. Оле просит тебя не ждать.', effects: once('c8_fsmoke_call') },
   { id: 'c8_fsmoke_window', label: 'Разбить окно, вытащить её во двор', minutes: 7, risky: true, terminal: true, goto: 'c8_fafter', effects: [...once('c8_fsmoke.done'), { if: keeper(), then: [{ set: 'w.c3_f8', value: 'window' }, { set: 'w.c3_f8_done', value: true }, { set: 'w.c3_f8_window_broken', value: true }, { npc: 'henrike', remember: 'c3_pulled_through_window' }] }], outcomes: [
    { id: 'guest', when: not(keeper()), text: 'Ты отбиваешь стекло у рамы. {partner} лезет внутрь, Оле принимает мать во дворе. Твой рукав цепляется за оставшийся осколок.', effects: [{ injure: 'cut', site: 'hands', severity: 1, bleeding: 0.1 }] },
    { id: 'clean', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] }, text: 'Ты выбиваешь стекло, снимаешь острые края рукавом. Оле помогает вытащить мать. Она хватается за тебя обеими руками и начинает кашлять.', effects: [{ injure: 'bruise', site: 'hands', severity: 1 }, { body: 'stress', delta: 12 }] },
    { id: 'cut', text: 'Стекло прорезает ладонь, пока ты держишь раму. Оле вытаскивает мать поверх твоего плеча. Ты отпускаешь дерево только во дворе.', effects: [{ injure: 'cut', site: 'hands', severity: 2, bleeding: 0.15 }, { body: 'stress', delta: 15 }] },
   ] },
   { id: 'c8_fsmoke_door', label: 'Отжать дверь, рискуя придавить её плечо', minutes: 8, risky: true, terminal: true, goto: 'c8_fafter', outcomes: [{ id: 'guest', when: not(keeper()), text: 'Ты упираешься в створку плечом. {partner} остаётся у щели, откуда слышен кашель. Оле просит держать, пока он оттащит мать.' }, { id: 'owner', text: 'Ты проталкиваешь створку плечом. Хенрике вскрикивает, когда её прижимает к стене. Оле вытаскивает её за ворот; ты раскрываешь окно изнутри. Лечь она может только на один бок.' }], effects: [...once('c8_fsmoke.done'), { injure: 'sprain', site: 'rightArm', severity: 1 }, { body: 'stress', delta: 15 }, { if: keeper(), then: [{ set: 'w.c3_f8', value: 'door' }, { set: 'w.c3_f8_done', value: true }, { npc: 'henrike', status: 'injured', set: { c3_smoke_shoulder: true }, remember: 'c3_door_shoulder' }] }] },
  ] }),
 S({ id: 'c8_fafter', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Тебе сколько налить', calm: true, ambient: house,
  text: [{ text: 'Оле усаживает мать в соседней комнате. В кухонной печи он закрывает подачу воздуха, кухню проветривает. Дым перестаёт идти. Хенрике просит его сесть.' }, { when: { npcVar: 'henrike', key: 'c3_smoke_shoulder' }, text: 'Хенрике держит руку у груди. — Пальто не снимай. — Оле просит тебя помочь подоткнуть ей под спину одеяло.' }, { when: not(keeper()), text: '{partner} отводит тебя от кухонной двери. — Сначала сядь. — Оле освобождает место и тебе.' }], actions: [
   { id: 'c8_fafter_ask', label: 'Спросить Хенрике, может ли она дышать', minutes: 8, when: fresh('c8_fafter_ask'), text: 'Она кивает, потом поднимает ладонь: говорить пока не может. Оле ждёт, пока пройдёт кашель. — Тебе сколько налить?', effects: once('c8_fafter_ask') },
   { id: 'c8_fafter_ole', label: 'Спросить Оле, что нужно сейчас', minutes: 8, when: fresh('c8_fafter_ole'), text: '— Чтоб она не вставала. — Он смотрит на мать. — Пока я отойду. — Хенрике кивает тебе, уже не ему.', effects: once('c8_fafter_ole') },
   { id: 'c8_fafter_end', label: 'Посидеть с ней, пока Оле принесёт воду', minutes: 18, terminal: true, goto: 'c8_farm', text: 'Хенрике спрашивает, все ли вошли. Ты называешь тех, кого видел{m:|а}. Она перестаёт поворачиваться к двери.', effects: once('c8_fafter.done') },
  ] }),
 S({ id: 'c8_fnight', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Сегодня вместе', calm: true, ambient: house,
  text: [{ text: '{partner} просит дать руку. — Теперь давай без нового геройства. Что на ночь решим — так и ляжем. — {pm:Он|Она} смотрит, не прячешь ли ты ладонь.' }], actions: [
   { id: 'c8_fnight_ask', label: 'Спросить, сможет ли {partner} здесь остаться', minutes: 8, when: fresh('c8_fnight_ask'), text: '— С тобой — да. Но давай не обещать всем, что утром всё исправим. — {partner} ждёт твоего ответа.', effects: once('c8_fnight_ask') },
   { id: 'c8_fnight_end', label: 'Договориться отвечать только за посильное', minutes: 12, terminal: true, goto: 'c8_farm', text: 'Ты повторяешь, что сегодня можешь сделать. {partner} добавляет своё. Вы идёте к Оле вместе.', effects: once('c8_fnight.done') },
  ] }),
].map((scene): Scene => scene.id === 'c8_fsmoke' ? scene : ({ ...scene, actions: [
 { id: 'c8_fsmoke_go', label: 'К дыму из кухни', minutes: 1, terminal: true, goto: 'c8_fsmoke', when: alarm, effects: scene.id === 'c8_freturned' ? [{ set: '$.c8_freturned.done', value: true }] : [] },
 ...scene.actions.filter(a => !(scene.id === 'c8_farm' && a.id === 'c8_fback')).map(a => ({ ...a, when: all(a.when ?? { always: true }, not(alarm)), effects: [...(a.effects ?? []), ...(scene.id === 'c8_farm' ? [{ if: flag('w.c3_f8_done'), then: [{ set: '$.c8_faftermath_echo', value: true }] }] as import('../../engine/types').Effect[] : [])] })),
] }));
export const farm8Events: WorldEvent[] = [
 { id: 'ev_f8_reply', at: at(13, 14, 20), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, p), effects: [], news: [{ channel: 'direct', text: 'Павел зовёт к себе: жена написала. Он прочёл сообщение, но просит прочесть ему ещё раз.' }] },
 { id: 'ev_f8_ole', at: at(13, 16, 10), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, o), effects: [], news: [{ channel: 'direct', text: 'Оле ищет, с кем поговорить о матери. Она снова обещала отдохнуть вечером и снова вернулась на кухню.' }] },
 { id: 'ev_f8_smoke', at: at(13, 18, 40), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, h, o), effects: [], news: [{ channel: 'direct', text: 'Оле толкает кухонную дверь. Из щели идёт дым, мать не отвечает. Он зовёт на помощь.' }] },
 { id: 'ev_f8_missed', at: at(13, 19, 15), scope: 'world', when: all(C, keeper(), h, not(flag('w.c3_f8_done'))), effects: [{ set: 'w.c3_f8', value: 'missed' }, { set: 'w.c3_f8_done', value: true }, { set: 'w.c3_f8_window_broken', value: true }] },
];
