import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, flag, keeper, not, npcHere } from './world3';
const S = (s: Scene) => s;
const C = all({ cp: 5 }, not({ cp: 6 }));
const fresh = (id: string) => not(flag(`$.${id}`));
const pair = all(flag('w.together'), { partnerAt: 'hof_luedemann' }, { partner: 'active' });
const henrike = npcHere('henrike', 'hof_luedemann');
const ole = npcHere('ole', 'hof_luedemann');
const deniz = npcHere('deniz', 'hof_luedemann');
const kerem = npcHere('kerem', 'hof_luedemann');
const guest = npcHere('c3_koehler', 'hof_luedemann');
const pawel = npcHere('pawel', 'hof_luedemann');
const result = (value: string): Cond => ({ v: 'w.c3_f6', op: '==', value });
const alarm = all(C, { after: at(12, 18, 40) }, { before: at(12, 19, 20) }, deniz, kerem, guest, fresh('c6_fcart.done'), not(flag('w.c3_f6_done')));
const wait: ActionDef = { id: 'c6_fwait', label: 'Передохнуть у печи до следующего часа', minutes: 60, activity: 'rest', repeatable: true,
  text: 'Хенрике проходит мимо твоего места. — Сиди, пока не зову. — Ты откидываешь голову к стене.' };

export const farm6Scenes: Scene[] = [
 S({ id: 'c6_farm', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Вторая смена', safe: true, ambient: { outdoor: false, wet: false, tempC: 18 },
  text: [
   { when: all({ before: at(12, 17) }, henrike, fresh('c6_history_seen')), text: 'Хенрике останавливает тебя возле печи. — Куртку оставь. Поговорим сначала. — С твоего места она снимает свои рукавицы.' },
   { when: all({ after: at(12, 17) }, not(flag('w.c3_f6_done')), henrike), text: 'Хенрике зажигает лампу и закрывает ставню. — После ужина за ворота не ходить. — Дениза она зовёт из сеней.' },
   { when: all(flag('w.c3_farm_rest5'), fresh('c6_frest_echo'), henrike), text: 'Хенрике сама ставит ведро возле таза. — Отдохнули? — Ты поднимаешься, но она уже уходит за вторым.' },
   { when: all({ v: 'w.c3_trip5', op: '==', value: 'relieve' }, pawel, fresh('c6_fwork_echo')), text: 'Павел просыпается, когда ты возвращаешься с водой. — Я думал, уже вечер. — Он снова ложится.' },
   { when: all(flag('$.c6_fletter.sent'), pawel, fresh('c6_fletter.echo')), text: 'Павел спрашивает, доставилось ли сообщение. Ты показываешь экран: отметки нет. — Может, ещё дойдёт. — Телефон он оставляет рядом.' },
   { when: all(flag('$.c6_fbrace_lost'), ole, not(flag('w.c3_f6_done'))), text: 'Оле ставит треснувший брус к стене. — Вот столько и держал. — Он показывает ладонями ширину щели у ворот.' },
   { when: all(flag('$.c6_fvisitor.done'), guest, fresh('c6_fcart.done'), not(flag('w.c3_f6_done'))), text: 'Кёлер ждёт Хенрике возле тележки. Мешок накрывает своим пальто. — Про ночь спроси, — просит она тебя. — Пока я всё не отдала.' },
   { when: all(flag('$.c6_fsupper.gave'), guest, fresh('c6_fsupper.echo')), text: 'Кёлер возвращает тебе вымытую миску. — Свою посуду я не довезла. — Она проводит пальцем по краю и отдаёт.' },
   { when: all(result('gate'), deniz), text: 'Дениз прижимает створку спиной. — Теперь у меня работа до утра. — Керем приносит ему стул. Сесть здесь нельзя.' },
   { when: all(result('flour'), guest), text: 'Кёлер выскребает муку из сгиба мешка. Дениз предлагает помочь. — Ботинками не ходи, — говорит она. Он отступает.' },
   { when: all(result('missed'), deniz), text: 'Дениз пробует встать и садится обратно. Керем держит его ботинок: нога в него не входит. Оба смотрят на развязанный шнурок.' },
   { when: all({ after: at(12, 16, 30) }, { before: at(12, 17) }, henrike), text: 'Хенрике отводит тебе место у печи. — До ужина посиди. Потом позову. — Ты оставляешь обувь возле своих вещей.' },
   { when: all({ after: at(12, 20) }, { before: at(12, 21) }, henrike), text: 'Хенрике показывает на печь. — Можно лечь. Только в девять сначала договоримся, где кто спит. — Она оставляет лампу на столе.' },
   { when: all({ after: at(12, 21) }, henrike), text: 'Хенрике ждёт вас у лампы. — Пора решать про ночь. Потом спать. — Ты пододвигаешь место для {partner.gen}.' },
  ], onEnter: [
   { if: all({ v: 'w.c3_trip5', op: '==', value: 'relieve' }, fresh('c6_promise_cost')), then: [{ set: '$.c6_promise_cost', value: true }, { wait: 55, activity: 'moderate' }, { body: 'fatigue', delta: 8 }] },
  ], actions: [
   { id: 'c6_fpair_go', label: 'Поговорить с {partner.ins} без хозяйки', minutes: 2, terminal: true, goto: 'c6_fpair', when: all(pair, fresh('c6_fpair.done')) },
   { id: 'c6_fvisitor_go', label: 'К женщине с тележкой', minutes: 2, terminal: true, goto: 'c6_visitor', when: all({ after: at(12, 14) }, guest, henrike, fresh('c6_fvisitor.done')) },
   { id: 'c6_fpawel_go', label: 'Посидеть с Павлом', minutes: 2, terminal: true, goto: 'c6_fpawel', when: all(pawel, fresh('c6_fpawel.done')) },
   { id: 'c6_fhenrike_go', label: 'Спросить хозяйку про чужой ночлег', minutes: 2, terminal: true, goto: 'c6_fhenrike', when: all(henrike, fresh('c6_fhenrike.done'), flag('$.c6_fvisitor.done')) },
   { id: 'c6_fbrace_go', label: 'К Оле у падающего бруса', minutes: 1, terminal: true, goto: 'c6_fbrace', when: all({ after: at(12, 16, 10) }, { before: at(12, 18, 40) }, ole, fresh('c6_fbrace.done')) },
   { id: 'c6_fsupper_go', label: 'Разделить ужин с {partner.ins}', minutes: 2, terminal: true, goto: 'c6_fsupper', when: all(pair, { after: at(12, 17) }, fresh('c6_fsupper.done')) },
   { id: 'c6_fbrothers_go', label: 'К братьям у машины', minutes: 2, terminal: true, goto: 'c6_fbrothers', when: all(deniz, kerem, fresh('c6_fbrothers.done'), { before: at(12, 18, 40) }) },
   { id: 'c6_fafter_go', label: 'К тем, кто остался у ворот', minutes: 2, terminal: true, goto: 'c6_fafter', when: all(flag('w.c3_f6_done'), fresh('c6_fafter.done')) },
   { id: 'c6_fnight_go', label: 'Ответить женщине перед сном', minutes: 2, terminal: true, goto: 'c6_fnight', when: all(guest, { after: at(12, 19, 20) }, fresh('c6_fnight.done')) },
   { id: 'c6_fpump_shift', label: 'Час чинить насос с Денизом', minutes: 0, combinable: true, when: all(deniz, { before: at(12, 16) }, { has: 'c3_hose' }, not(flag('proj.c3_pump.done')), fresh('c6_fpump_shift')), text: 'Дениз примеряет шланг к насосу. — Подержи. Если польётся, тоже держи. — Ты упираешься ногой в основание, пока он затягивает хомут.', effects: once('c6_fpump_shift', [{ work: 'c3_pump', hours: 1 }]) },
   wait, cpAction(6),
  ] }),
 S({ id: 'c6_fpair', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Сначала вдвоём', calm: true, ambient: { outdoor: false, tempC: 18 },
  text: [{ text: '{partner} ждёт, пока хозяйка уйдёт. — Ты опять всем пообещаешь, а потом у тебя руки не разжать. — {pm:Он|Она} показывает на место возле печи. — Я хочу сегодня лечь с тобой.' }], actions: [
   { id: 'c6_fpair_ask', label: 'Спросить, что было хуже всего', minutes: 8, when: fresh('c6_fpair_ask'), text: '— У двери. Я не знал{pm:|а}, что ты собираешься делать. — {partner} смотрит тебе в лицо. — Можно было хотя бы сказать.', effects: once('c6_fpair_ask') },
   { id: 'c6_fpair_need', label: 'Сказать, что тоже нужен отдых', minutes: 8, when: fresh('c6_fpair_need'), text: 'Ты говоришь, что ноги держат только до лавки. {partner} освобождает тебе место. — Тогда так ей и скажем. Вдвоём.', effects: once('c6_fpair_need') },
   { id: 'c6_fpair_stay', label: 'Пообещать сначала советоваться с {partner.ins}', minutes: 10, terminal: true, goto: 'c6_farm', text: '— Не разрешения просить, — уточняет {partner}. — Дать мне услышать. — Ты соглашаешься. Руку {pm:он|она} убирает с твоего рукава сам{pm:|а}.', effects: once('c6_fpair.done', [{ set: '$.c6_fpair.promised', value: true }, { body: 'stress', delta: -4 }]) },
   { id: 'c6_fpair_no', label: 'Сказать, что ждать сможешь не всегда', minutes: 8, terminal: true, goto: 'c6_farm', text: '{partner} кивает. — Тогда не обещай. — Вы сидите рядом, пока Хенрике не возвращается. Вставать {pm:он|она} начинает раньше тебя.', effects: once('c6_fpair.done', [{ body: 'stress', delta: 5 }]) },
  ] }),
 S({ id: 'c6_visitor', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Женщина у калитки', calm: true,
  text: [
   { text: 'Женщина придерживает тележку коленом. — Элке Кёлер. От соседа. Муку на дрова меняю. — Хенрике смотрит на завязанный мешок. — И про ночь хотела спросить, — добавляет женщина.' },
   { when: pair, text: '{partner} подходит с твоей стороны калитки. — Нам за неё решать нельзя. — Кёлер слышит. — Я хозяйку и спрашиваю.' },
  ], actions: [
   { id: 'c6_fvisitor_home', label: 'Спросить, почему она не ночует дома', minutes: 8, when: fresh('c6_fvisitor_home'), text: '— Над пекарней жила. Хозяин закрыл. Меня не спросил. — Кёлер проверяет узел на мешке. — Это моё. Не из его кладовой.', effects: once('c6_fvisitor_home') },
   { id: 'c6_fvisitor_flour', label: 'Спросить, хватит ли муки ей самой', minutes: 6, when: fresh('c6_fvisitor_flour'), text: '— Сырую есть? — Кёлер смотрит на Хенрике. — Мне печка нужна. Я испеку на всех. Только не забирайте мешок целиком.', effects: once('c6_fvisitor_flour') },
   { id: 'c6_fvisitor_check', label: 'Предложить осмотр до разговора о ночлеге', minutes: 12, terminal: true, goto: 'c6_farm', text: 'Хенрике сама просит женщину поднять рукава. Кёлер показывает обе руки. — Мука не от этого дешевле. — Мешок она держит между вами.', effects: [...once('c6_fvisitor.done'), { set: '$.c6_visitor.result', value: 'inspect' }, { set: 'w.c3_koehler_met', value: true }, { set: 'w.c3_guest_checked', value: true }, { npc: 'henrike', trust: 3 }, { npc: 'c3_koehler', remember: 'c3_examined' }] },
   { id: 'c6_fvisitor_trade', label: 'Помочь с обменом, ночлег пока не обещать', minutes: 25, terminal: true, goto: 'c6_farm', text: 'Хенрике отбирает дрова сама. Кёлер пересыпает муку в её миску, потом туго перевязывает мешок. — Остальное моё. До вечера подумайте.', enabled: { stocked: 'firewood', qty: 8, at: 'c3_farm_stock' }, disabledReason: 'Восьми килограммов дров в запасе нет', effects: [...once('c6_fvisitor.done'), { set: '$.c6_visitor.result', value: 'exchange' }, { if: keeper(), then: [{ set: 'w.c3_koehler_met', value: true }, { unstock: 'firewood', qty: 8, at: 'c3_farm_stock' }, { stock: 'c3_flour', qty: 1, at: 'c3_farm_stock' }, { npc: 'c3_koehler', remember: 'c3_traded_flour' }] }] },
   { id: 'c6_fvisitor_wait', label: 'Попросить хозяйку выслушать её вечером', minutes: 10, terminal: true, goto: 'c6_farm', text: '— До темноты жди во дворе, — говорит Хенрике. Кёлер снимает с тележки пальто. — Только не забудьте, что я здесь. — Надевает его поверх фартука.', effects: [...once('c6_fvisitor.done'), { set: '$.c6_visitor.result', value: 'night' }, { if: keeper(), then: [{ set: 'w.c3_koehler_met', value: true }, { npc: 'c3_koehler', remember: 'c3_asked_to_wait' }] }] },
  ] }),
 S({ id: 'c6_fpawel', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Без ответа', calm: true, ambient: { outdoor: false, tempC: 18 },
  text: [
   { text: 'Павел сидит у печи с телефоном. — Посмотри, что написал. Она же поймёт, что вру. — Он показывает тебе черновик.' },
   { when: pair, text: '{partner} садится у другого конца лавки. — Напиши, что хочешь её услышать. — Павел стирает первое слово.' },
  ], actions: [
   { id: 'c6_fletter_read', label: 'Спросить, что он уже написал', minutes: 8, when: fresh('c6_fletter_read'), text: '— Что рука болит. Что кормят. — Павел поворачивает экран к себе. — Про Оле не писал. Она спросит, зачем я тут остался.', effects: once('c6_fletter_read') },
   { id: 'c6_fletter_home', label: 'Спросить, как он собирался домой', minutes: 8, when: fresh('c6_fletter_home'), text: '— В воскресенье автобус. Я билет сдал. Работы ещё на неделю было. — Павел смотрит на свою ладонь. — Думал, больше привезу.', effects: once('c6_fletter_home') },
   { id: 'c6_fletter_send', label: 'Отправить его слова, не обещая ответа', minutes: 12, terminal: true, goto: 'c6_farm', when: { network: 'sms' }, text: 'Ты показываешь Павлу сообщение перед отправкой. Он просит убрать «не волнуйся». — Это хуже всего. — После нажатия телефон остаётся у него на колене.', effects: once('c6_fpawel.done', [{ set: '$.c6_fletter.sent', value: true }, { npc: 'pawel', remember: 'c3_message_again' }]) },
   { id: 'c6_fletter_wait', label: 'Сохранить черновик и посидеть с ним', minutes: 15, terminal: true, goto: 'c6_farm', text: 'Павел кладёт телефон экраном вниз. — Побудь. А то она позвонит, я начну сразу всё рассказывать. — Ты остаёшься до следующего звука из сеней.', effects: once('c6_fpawel.done', [{ body: 'stress', delta: -3 }]) },
  ] }),
 S({ id: 'c6_fhenrike', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Кого хватит кормить', calm: true, ambient: { outdoor: false, tempC: 18 },
  text: [{ text: 'Хенрике отводит тебя от окна. — Печь ей нужна. Мне тоже. У меня дом полный людей, а носить воду некому. — За стеклом Кёлер поправляет мешок на тележке.' }], actions: [
   { id: 'c6_fhenrike_ask', label: 'Спросить, зачем она пустила вас', minutes: 8, when: fresh('c6_fhenrike_ask'), text: '— Вас я уже видела. И работать видела. — Она показывает на дверь. — А эту я только сегодня услышала. Не проси сразу верить одинаково.', effects: once('c6_fhenrike_ask') },
   { id: 'c6_fhenrike_food', label: 'Предложить делиться своей едой', minutes: 8, when: fresh('c6_fhenrike_food'), text: '— Сначала между собой решите, — говорит Хенрике. — Один отдаст, второй потом ко мне голодный придёт. — Она зовёт {partner.acc}, но ответа за тебя не даёт.', effects: once('c6_fhenrike_food') },
   { id: 'c6_fhenrike_end', label: 'Отложить обещание до общего разговора', minutes: 6, terminal: true, goto: 'c6_farm', text: 'Хенрике возвращается к окну. — До ночи ответ нужен. Не завтра. — Ты видишь, как она показывает Кёлер на лавку у стены.', effects: once('c6_fhenrike.done') },
  ] }),
 S({ id: 'c6_fbrace', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Подставить плечо', universal: false, ambient: { outdoor: true },
  text: [
   { text: 'Оле удерживает поперечину коленом. Один конец соскальзывает с опоры. — Подхвати. — Между брусом и столбом уже зажало край его куртки.' },
   { when: pair, text: '{partner} хватает тебя за пояс. — С той стороны давит. Пальцы убери. — Оле не может развернуться посмотреть.' },
  ], actions: [
   { id: 'c6_fbrace_ask', label: 'Спросить, куда сдвинуть опору', minutes: 1, when: fresh('c6_fbrace_ask'), text: '— К столбу. Ногой. — Ты пробуешь, брус идёт следом. Оле перестаёт командовать. — Подожди.', effects: once('c6_fbrace_ask') },
   { id: 'c6_fbrace_hold', label: 'Принять брус плечом, освободить Оле', minutes: 18, risky: true, terminal: true, goto: 'c6_farm', effects: once('c6_fbrace.done'), outcomes: [
    { id: 'held', check: { traits: ['strength'], difficulty: 4, uses: ['strength'] }, text: 'Ты поднимаешь конец плечом. Оле вытаскивает куртку и забивает клин. — Отходи. — Руку он держит под брусом, пока ты не выйдешь.', effects: [{ injure: 'bruise', site: 'leftArm', severity: 1 }, { npc: 'ole', remember: 'c3_brace_held' }] },
    { id: 'slipped', text: 'Брус съезжает тебе на предплечье. Оле толкает его от тебя; вы оба падаете к стене. Клин остаётся в его кулаке.', effects: [{ injure: 'bruise', site: 'leftArm', severity: 2 }, { set: '$.c6_fbrace_lost', value: true }] },
   ] },
   { id: 'c6_fbrace_help', label: 'Оттащить Оле, пожертвовать поперечиной', minutes: 12, terminal: true, goto: 'c6_farm', text: 'Ты тянешь Оле за ворот. Брус падает концом на камень и трескается. — Я держал, — говорит Оле. Куртку из твоей руки вынимает осторожно.', effects: once('c6_fbrace.done', [{ set: '$.c6_fbrace_lost', value: true }, { npc: 'ole', trust: -2 }]) },
  ] }),
 S({ id: 'c6_fbrothers', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'У машины', calm: true, ambient: { outdoor: true },
  text: [{ text: 'Керем просит Дениза идти спать. — Сама свою тележку вывезет. — Брат закрывает багажник. — Двор чужой. Помочь можем. — Керем встаёт у него на пути.' }], actions: [
   { id: 'c6_fbrothers_ask', label: 'Спросить Керема, почему он сердится', minutes: 8, when: fresh('c6_fbrothers_ask'), text: '— Он без конца чужие машины чинит. Сейчас тележку. Потом ещё что-нибудь. А мы здесь даже не в доме спим. — Дениз смотрит на него. — Я слышу.', effects: once('c6_fbrothers_ask') },
   { id: 'c6_fbrothers_deniz', label: 'Спросить Дениза, собирается ли он уезжать', minutes: 8, when: fresh('c6_fbrothers_deniz'), text: '— На ночь никуда. — Дениз поворачивается к брату. — И утром без разговора не уйдём. — Керем смотрит на ключи в его руке.', effects: once('c6_fbrothers_deniz') },
   { id: 'c6_fbrothers_back', label: 'Предложить братьям договорить без тебя', minutes: 10, terminal: true, goto: 'c6_farm', text: 'Ты отходишь к кухне. Дениз зовёт Керема сесть в машину. Брат садится с другой стороны; дверь оставляет открытой.', effects: once('c6_fbrothers.done') },
  ] }),
 S({ id: 'c6_fsupper', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'За общей едой', calm: true, ambient: { outdoor: false, tempC: 18 },
  text: [{ text: '{partner} садится рядом с тобой. — Есть хочу так, что даже разговаривать не могу. — Хенрике спрашивает, сколько положить. {partner} смотрит на тебя: отвечать каждому.' }], actions: [
   { id: 'c6_fsupper_ask', label: 'Спросить, оставили ли еду гостье', minutes: 6, when: fresh('c6_fsupper_ask'), text: '— Позвала. Не идёт, — отвечает Хенрике. — Говорит, сперва про ночь. — {partner} двигает миску от края. — Боится, что поест и уже должна.', effects: once('c6_fsupper_ask') },
   { id: 'c6_fsupper_eat', label: 'Поесть и оставить силы на вечер', minutes: 25, terminal: true, goto: 'c6_farm', enabled: { stocked: 'oats', qty: 0.25, at: 'c3_farm_stock' }, disabledReason: 'Овсянки на твою порцию не осталось', text: 'Ты подставляешь миску. {partner} ест рядом, перестав задавать вопросы. Хенрике садится к вам, когда половина уже съедена.', effects: once('c6_fsupper.done', [{ unstock: 'oats', qty: 0.25, at: 'c3_farm_stock' }, { body: 'hunger', delta: -35 }, { body: 'thirst', delta: -15 }]) },
   { id: 'c6_fsupper_give', label: 'Отнести свою порцию женщине во двор', minutes: 15, terminal: true, goto: 'c6_farm', enabled: { stocked: 'oats', qty: 0.25, at: 'c3_farm_stock' }, disabledReason: 'Порции в общем запасе нет', text: 'Кёлер принимает миску обеими руками. — От меня теперь что? — Ты говоришь, что ничего. Она ест стоя возле тележки.', effects: once('c6_fsupper.done', [{ unstock: 'oats', qty: 0.25, at: 'c3_farm_stock' }, { set: '$.c6_fsupper.gave', value: true }, { npc: 'c3_koehler', remember: 'c3_supper_given' }]) },
   { id: 'c6_fsupper_skip', label: 'Посидеть рядом, ничего не брать', minutes: 15, terminal: true, goto: 'c6_farm', text: '{partner} спрашивает, не оставить ли тебе половину. Ты отказываешься. Хенрике убирает пустую миску, прежде чем спор начнётся снова.', effects: once('c6_fsupper.done') },
  ] }),
 S({ id: 'c6_fcart', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'В воротах', universal: false, ambient: { outdoor: true },
  text: [
   { text: 'Тележка опрокидывается в проёме. Дениз падает, ось прижимает ему ногу к столбу. Керем тянет брата за плечи. — Не идёт! — С дороги приближается человек, не отвечая на окрики.' },
   { when: fresh('c6_fvisitor.done'), text: 'Женщина хватается за мешок. — Элке Кёлер. Вы хоть имя запомните! — Она смотрит прямо на тебя.' },
   { text: 'Хенрике упирается в створку. — Груз уберите! — На тележке большой пекарский мешок муки. Кёлер ловит твою руку: — Это всё, что у меня есть.' },
   { when: all(pair, fresh('c6_fpair.promised')), text: '{partner} держит вторую створку. — Под колесо не лезь. Разрежь мешок! — Кёлер поворачивается к {pm:нему|ней}. — Ты своё отдай.' },
   { when: all(pair, flag('$.c6_fpair.promised')), text: '{partner} держит вторую створку. — Скажи мне. Под колесо полезешь или мешок резать? — Кёлер не отпускает твою руку.' },
  ], actions: [
   { id: 'c6_fcart_pull', label: 'Отжать тележку вместе со створкой', minutes: 8, risky: true, terminal: true, goto: 'c6_fafter', effects: [...once('c6_fcart.done'), { if: keeper(), then: [{ set: 'w.c3_f6', value: 'gate' }, { set: 'w.c3_f6_done', value: true }, { set: 'w.c3_f6_gate_lost', value: true }, { npc: 'deniz', remember: 'c3_pulled_from_cart' }] }], outcomes: [
    { id: 'guest', when: not(keeper()), text: 'Ты подставляешь плечо под раму. {partner} остаётся возле Дениза, Керем подхватывает брата. Рука у тебя немеет раньше, чем тележка поддаётся.', effects: [{ injure: 'bruise', site: 'leftArm', severity: 2 }] },
    { id: 'lifted', check: { traits: ['strength'], difficulty: 5, uses: ['strength'] }, text: 'Ты поднимаешь раму плечом. Створка выламывается из петли, Керем вытаскивает брата. Хенрике валит тележку поперёк прохода. Чужие пальцы уже скребут по доскам.', effects: [{ injure: 'bruise', site: 'leftArm', severity: 1 }, { body: 'stress', delta: 12 }] },
    { id: 'hurt', text: 'Рама срывается тебе на руку. Керем тянет брата, пока ты держишь её второй. Створка падает наружу; Хенрике закрывает проём тележкой.', effects: [{ injure: 'sprain', site: 'leftArm', severity: 2 }, { body: 'stress', delta: 18 }] },
   ] },
   { id: 'c6_fcart_cut', label: 'Разрезать мешок, высыпать муку в грязь', minutes: 6, terminal: true, goto: 'c6_fafter', text: 'Хенрике даёт тебе нож. Мука сыплется под колесо; Дениз выкатывает облегчённую тележку с ноги. Керем захлопывает ворота перед чужим лицом. Кёлер опускается возле разрезанного мешка.', effects: [...once('c6_fcart.done'), { body: 'stress', delta: 14 }, { if: keeper(), then: [{ set: 'w.c3_f6', value: 'flour' }, { set: 'w.c3_f6_done', value: true }, { set: 'w.c3_f6_flour_lost', value: true }, { npc: 'c3_koehler', remember: 'c3_cut_my_flour' }, { npc: 'deniz', remember: 'c3_saved_with_flour' }] }] },
  ] }),
 S({ id: 'c6_fafter', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'После ворот', calm: true,
  text: [
   { when: result('gate'), text: 'Дениз встаёт, пробует наступить на ногу. — Ходит. — Хенрике показывает на пустую петлю. — А это до утра держать будем. — Он возвращается к створке.' },
   { when: result('flour'), text: 'Кёлер зажимает разрез на мешке обеими руками. Дениз говорит, что отдаст свою еду. — Сколько? — спрашивает она. Он оглядывается на брата.' },
   { when: result('missed'), text: 'Керем кладёт ногу брата на свёрнутую куртку. — Не двигай. — Дениз просит снять ботинок. Керем развязывает шнурок, руки у него трясутся.' },
   { when: all(not(keeper()), fresh('c6_fafter.done')), text: '{partner} проверяет, можешь ли ты поднять руку. Ты просишь рассказать, что стало с Денизом. {pm:Он|Она} отводит тебя от ворот.' },
  ], actions: [
   { id: 'c6_fafter_ask', label: 'Спросить Дениза, может ли он идти', minutes: 5, when: all(deniz, fresh('c6_fafter_ask')), text: 'Дениз просит не тянуть его за руку. — Сам встану. Если не смогу, скажу. — Керем остаётся на корточках перед ним.', effects: once('c6_fafter_ask') },
   { id: 'c6_fafter_guest', label: 'Выслушать женщину, не перебивая', minutes: 8, when: all(guest, fresh('c6_fafter_guest')), text: '— Я утром ещё думала, куда пойду дальше. — Кёлер говорит тебе, не хозяйке. — А вы думаете, что я только переночевать прошу. Мне идти некуда.', effects: once('c6_fafter_guest') },
   { id: 'c6_fafter_end', label: 'Вернуться с ними к дому', minutes: 8, terminal: true, goto: 'c6_farm', text: 'Хенрике открывает кухню. — По одному. Я вижу, кто идёт. — Ты ждёшь, пока Керем пропустит брата.', effects: once('c6_fafter.done', [{ set: '$.c6_frest_echo', value: true }, { set: '$.c6_fwork_echo', value: true }]) },
  ] }),
 S({ id: 'c6_fnight', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Просьба на ночь', calm: true, ambient: { outdoor: false, tempC: 18 },
  text: [
   { when: all(fresh('c6_fvisitor.done'), fresh('c6_fcart.done')), text: 'Женщина у кухонной двери протягивает руку. — Элке Кёлер. Вы меня днём не услышали. Сейчас можно?' },
   { text: 'Кёлер останавливает тебя перед кухней. — Я осмотра не боюсь. Я боюсь лечь снаружи и не проснуться. — Хенрике слышит её из дома.' },
   { when: pair, text: '{partner} подходит к тебе. — Если наше место — сначала скажи мне. — Кёлер ждёт, не вмешиваясь.' },
  ], actions: [
   { id: 'c6_fnight_check', label: 'Попросить хозяйку провести осмотр', minutes: 12, when: all(henrike, fresh('c6_fnight_check'), not(flag('w.c3_guest_checked'))), text: 'Хенрике выводит женщину к лампе. — Рукава выше. Обе руки. — Кёлер исполняет и спрашивает, можно ли теперь войти. Хозяйка смотрит на вас.', effects: [...once('c6_fnight_check'), { set: 'w.c3_guest_checked', value: true }, { npc: 'henrike', trust: 3 }] },
   { id: 'c6_fnight_ask', label: 'Спросить, на что она согласна', minutes: 8, when: fresh('c6_fnight_ask'), text: '— На сарай согласна. На работу согласна. На то, чтобы каждый вечер просить заново, — нет. — Кёлер снимает фартук. Под ним обычное тёмное платье.', effects: once('c6_fnight_ask') },
   { id: 'c6_fnight_end', label: 'Позвать {partner.acc} и хозяйку решать вместе', minutes: 8, terminal: true, goto: 'c6_farm', text: 'Ты просишь Хенрике выслушать вас обоих. Она впускает Кёлер на кухню до конца разговора. — Стоя не спят. Садись.', effects: once('c6_fnight.done', [{ if: keeper(), then: [{ set: 'w.c3_koehler_met', value: true }] }]) },
  ] }),
].map((scene): Scene => scene.id === 'c6_fcart' ? scene : ({ ...scene, actions: [
 { id: 'c6_fcart_go', label: 'К крику Дениза у ворот', minutes: 1, terminal: true, goto: 'c6_fcart', when: alarm },
 ...scene.actions.map((a) => ({ ...a, when: all(a.when ?? { always: true }, not(alarm)), effects: [...(a.effects ?? []), ...(scene.id === 'c6_farm' ? [
  { set: '$.c6_frest_echo', value: true }, { set: '$.c6_fwork_echo', value: true },
  { if: flag('$.c6_fletter.sent'), then: [{ set: '$.c6_fletter.echo', value: true }] },
  { if: flag('$.c6_fsupper.gave'), then: [{ set: '$.c6_fsupper.echo', value: true }] },
 ] as import('../../engine/types').Effect[] : [])] })),
] }));

export const farm6Events: WorldEvent[] = [
 { id: 'ev_f6_visitor', at: at(12, 14), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, guest), effects: [], news: [{ channel: 'direct', text: 'У калитки женщина зовёт хозяйку. Колёса тележки гремят по камням; Хенрике просит не открывать без неё.' }] },
 { id: 'ev_f6_brace', at: at(12, 16, 10), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, ole), effects: [], news: [{ channel: 'direct', text: 'Оле зовёт от ворот: брус съехал с опоры, одному не удержать. Он просит кого-нибудь подойти.' }] },
 { id: 'ev_f6_cart', at: at(12, 18, 40), scope: 'world', interrupt: true, when: all(C, { at: 'hof_luedemann' }, deniz, kerem, guest, henrike), effects: [], news: [{ channel: 'direct', text: 'Тележка грохочет в воротах. Дениз кричит, Керем зовёт на помощь. С дороги на крик идёт человек; хозяйка требует закрыть проём.' }] },
 { id: 'ev_f6_cart_missed', at: at(12, 19, 20), scope: 'world', when: all(C, keeper(), deniz, kerem, guest, not(flag('w.c3_f6_done'))), effects: [{ set: 'w.c3_f6', value: 'missed' }, { set: 'w.c3_f6_done', value: true }] },
];
