import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import {
  S44, felixAround44, henrike44, julian44, mon44, set44, tue44, until44, w44,
} from './point44';

// Участок 44, линия A. Понедельник: утро до совета (ров с Феликсом, Юлиан, колония, слова для совета), дорога и совет — общие;
// после обеда Яннес по решению совета, Феликс или Юлиан, сумерки (Нильс с батарейками, если друг). Вторник: курица к Рождеству,
// ёлка, подарок, церковь в Йестебурге (или ров), пост на сочельник, сумерки.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S44({ ...scene, for: 'any', chapter: 'ch3' });
const verdict = (x: string) => v('w.c44_verdict', x);
const feast = v('w.c41_xmas', 'feast');

export const day44AScenes: Scene[] = [
  // ═════════════ Понедельник ═════════════
  X({ id: 'c44_a_morning', title: 'До совета', camp: yard14, ambient: mon44,
    text: [
      { text: 'До совета три часа. Снег скрипит, дым из трубы стоит столбом.' },
      { when: felixAround44, text: 'Феликс у калитки, с лопатой на плече. На ров он идёт впервые и, кажется, боится больше, чем в яме под дубом.' },
      { when: julian44, text: 'Юлиан уже в курятнике: Хенрике дала ему ведро и показала, где зерно. Работает быстро и молча, как взрослый.' },
    ],
    actions: [
      { id: 'c44_am_ditch', label: 'Проводить Феликса до рва и покопать с ним час', when: felixAround44, minutes: 90, activity: 'heavy', terminal: true, goto: 'c44_road', ambientDuring: mon44,
        text: 'На рву человек пятнадцать. Феликса встречают молча, потом кто-то протягивает ему кружку. Через час он копает, как все, и уже не оглядывается.', effects: [set44('am', 'ditch'), npc('c16_brandt', 1), until44(51, 8, 50)] },
      { id: 'c44_am_julian', label: 'Показать Юлиану, как колоть растопку', when: julian44, minutes: 75, activity: 'moderate', terminal: true, goto: 'c44_road', ambientDuring: mon44,
        text: 'Топорик, полено, щепа. Юлиан повторяет движения за тобой и сразу просит дать попробовать самому. К девяти у него в ящике растопка на неделю и ни одного пореза.', effects: [set44('am', 'julian'), w44('julian_taught', true), until44(51, 8, 50)] },
      { id: 'c44_am_colony', label: 'Сходить к колонии: посмотреть, как Яннес', minutes: 75, terminal: true, goto: 'c44_road', ambientDuring: mon44,
        text: 'Яннес колет дрова у домика Уте, как в субботу. Увидев тебя, кивает и продолжает. Ничего не говорит. Уте выглядывает из окна и прячется. Ты уходишь, так и не решив, зачем приходил{m:|а}.', effects: [set44('am', 'colony'), until44(51, 8, 45)] },
      { id: 'c44_am_words', label: 'Записать на листке, что сказать на совете', minutes: 60, terminal: true, goto: 'c44_road',
        text: 'Три строчки, зачёркнуто, снова три. В итоге на листке остаётся одно слово, и ты складываешь его вчетверо. Остальное ты помнишь.', effects: [set44('am', 'words'), until44(51, 8, 45)] },
    ] }),

  X({ id: 'c44_a_jannes', title: 'После совета', camp: yard14, ambient: mon44,
    text: [
      { when: verdict('double'), text: 'После обеда к воротам приходит Яннес. Двойные смены до Рождества — это каждая ночь. Он стоит, переминаясь на больной ноге.\n\n— Kannst du eine Nacht übernehmen? Nur eine. Heiligabend.\n\nВозьмёшь одну ночь? Только одну. Сочельник.' },
      { when: verdict('yard'), text: 'После обеда к воротам приходит Яннес. Говорит сразу, без приветствия:\n\n— Ihr habt meine Schichten genommen. Zwei davon nehme ich zurück. Das ist nicht verhandelbar.\n\nВы взяли мои смены. Две я забираю обратно. Это не обсуждается.' },
      { when: verdict('half'), text: 'После обеда к воротам приходит Уте. Половина пайка до Нового года — это для Яннеса половина хлеба. Она не просит. Она стоит и смотрит на тебя.' },
    ],
    actions: [
      { id: 'c44_aj_take', label: 'Взять его смену в сочельник', when: verdict('double'), minutes: 45, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Яннес кивает. «Dann bin ich bei Ute. Das erste Weihnachten ohne…» Тогда я у Уте. Первое Рождество без… Он не договаривает. Ты не спрашиваешь, без кого.', effects: [set44('aj', 'take'), w44('a_eve_shift', true), npc('c14_jannes', 2), until44(51, 14, 0)] },
      { id: 'c44_aj_other', label: 'Сказать: в сочельник не могу, возьму в пятницу', when: verdict('double'), minutes: 45, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Яннес пожимает плечами. «Freitag auch gut». Пятница тоже хорошо. Он уходит, хромая, и ты смотришь ему вслед дольше, чем нужно.', effects: [set44('aj', 'other'), until44(51, 14, 0)] },
      { id: 'c44_aj_agree', label: 'Согласиться: две смены его, остальные ваши', when: verdict('yard'), minutes: 45, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Вы жмёте руки у ворот. Яннес говорит: «Und danke. Für Montag». И спасибо. За понедельник. Это больше слов, чем ты слышал{m:|а} от него за месяц.', effects: [set44('aj', 'agree'), npc('c14_jannes', 2), until44(51, 14, 0)] },
      { id: 'c44_aj_refuse', label: 'Сказать: смены наши, тебе нужна нога', when: verdict('yard'), minutes: 45, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Яннес смотрит на свою ногу, потом на тебя. «Stur wie Henrike». Упрямый, как Хенрике. Но не спорит. Уходит, и в походке у него что-то меняется.', effects: [set44('aj', 'refuse'), until44(51, 14, 0)] },
      { id: 'c44_aj_bread', label: 'Отдать Уте половину своего хлеба на неделю', when: verdict('half'), minutes: 45, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Ты заворачиваешь в полотенце буханку и кусок сала. Уте берёт, не благодаря. Потом, у калитки, всё-таки говорит: «Er wird es nicht essen, wenn er weiß, von wem». Он не станет есть, если узнает, от кого. Ты говоришь: значит, не узнает.', effects: [set44('aj', 'bread'), w44('a_fed_jannes', true), until44(51, 14, 0)] },
      { id: 'c44_aj_brandt', label: 'Сходить к Брандту: пусть паёк урежут нашему двору, не ему', when: verdict('half'), minutes: 60, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Брандт слушает у пожарной части, курит. «Ihr seid verrückt. Alle beide». Вы с ума сошли. Оба. Потом вычёркивает что-то в блокноте. «Halbe Ration für ihn bis Freitag. Nicht Neujahr». Половина до пятницы. Не до Нового года.', effects: [set44('aj', 'brandt'), w44('verdict_eased', true), npc('c16_brandt', -1), until44(51, 14, 15)] },
      { id: 'c44_aj_send', label: 'Сказать Уте: решение совета есть решение совета', when: verdict('half'), minutes: 30, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Уте кивает, будто ждала именно этого. Уходит по своей тропе, не оглядываясь. Тропа ровная, как по линейке.', effects: [set44('aj', 'send'), until44(51, 13, 45)] },
      { id: 'c44_aj_walk', label: 'Проводить до тропы и ничего не говорить', minutes: 30, terminal: true, goto: 'c44_a_afternoon', ambientDuring: mon44,
        text: 'Вы идёте до края поля молча. У тропы ты останавливаешься. Дальше человек идёт один и не оглядывается.', effects: [set44('aj', 'walk'), until44(51, 13, 45)] },
    ] }),

  X({ id: 'c44_a_afternoon', title: 'Вторая половина дня', camp: yard14, ambient: mon44,
    text: [
      { when: felixAround44, text: 'Феликс возвращается со рва раньше: Брандт отпустил его на час. Ладони в мозолях, под ногтями глина.' },
      { when: all(not(felixAround44), julian44), text: 'Юлиан закончил с курами, с дровами и с водой и спрашивает, что дальше. Ему одиннадцать, и он не умеет сидеть.' },
      { when: all(not(felixAround44), not(julian44)), text: 'После обеда двор, мороз, низкое солнце. До сумерек два часа.' },
    ],
    actions: [
      { id: 'c44_aa_felix', label: 'Перевязать Феликсу ладони и расспросить про ров', when: felixAround44, minutes: 60, terminal: true, goto: 'c44_a_dusk',
        text: 'Бинт, мазь, тёплая вода. Феликс рассказывает про ров так, будто это первая работа в его жизни. Может, так и есть: до армии была школа, после — яма под дубом.', effects: [set44('aa', 'felix'), until44(51, 15, 30)] },
      { id: 'c44_aa_felixgun', label: 'Показать Феликсу ружьё и где патроны: он умеет', when: all(felixAround44, v('w.c42_gun', 'home')), minutes: 60, terminal: true, goto: 'c44_a_dusk',
        text: 'Феликс разбирает ружьё на кухонном столе быстро и точно, как учили. Собирает. Кладёт. «Ich schieße nicht mehr, wenn ich nicht muss». Я больше не стреляю, если не надо. Ты веришь.', effects: [set44('aa', 'felixgun'), w44('felix_gun', true), until44(51, 15, 30)] },
      { id: 'c44_aa_julian', label: 'Отвести Юлиана домой и посмотреть на его бабушку', when: julian44, minutes: 75, terminal: true, goto: 'c44_a_dusk', ambientDuring: mon44,
        text: 'Будка обходчика у переезда, бабушка в платке у печи. Слуховой аппарат молчит: батареек нет. Она говорит громко, как глухие, и благодарит тебя три раза за то, чего ты ещё не сделал{m:|а}.', effects: [set44('aa', 'julian'), w44('a_saw_julian_home', true), until44(51, 15, 45)] },
      { id: 'c44_aa_wood', label: 'Наколоть дров на праздники', minutes: 60, activity: 'heavy', terminal: true, goto: 'c44_a_dusk', ambientDuring: mon44,
        text: 'Колун, чурбак, полено. Поленница растёт на ряд. После совета хорошо делать что-то, где всё понятно.', effects: [set44('aa', 'wood'), { body: 'fatigue', delta: 6 }, until44(51, 15, 30)] },
      { id: 'c44_aa_snow', label: 'Расчистить дорожки к колодцу и курятнику', minutes: 60, activity: 'heavy', terminal: true, goto: 'c44_a_dusk', ambientDuring: mon44,
        text: 'Лопата, снег по колено, мягкий. Дорожки ровные, по краям сугробы. Куры смотрят из окошка курятника, как на чудо.', effects: [set44('aa', 'snow'), until44(51, 15, 30)] },
    ] }),

  X({ id: 'c44_a_dusk', title: 'Сумерки', camp: yard14, ambient: mon44,
    text: [
      { when: flag('w.c44_nils_friend'), text: 'В сумерках у ворот тормозит белый грузовик Красного Креста. Нильс высовывается из кабины и протягивает тебе свёрток: «Für den Hof. Aus Hamburg». Для хутора. Из Гамбурга.' },
      { when: not(flag('w.c44_nils_friend')), text: 'Сумерки. По дороге на Йестебург проезжает белый грузовик Красного Креста и не останавливается.' },
      { text: 'Куры, вода, засов. До ужина час.' },
    ],
    actions: [
      { id: 'c44_ad_open', label: 'Развернуть свёрток Нильса', when: flag('w.c44_nils_friend'), minutes: 30, terminal: true, goto: 'c44_mon_eve', ambientDuring: mon44,
        text: 'Кофе, настоящий, полфунта. Плитка шоколада. И упаковка маленьких круглых батареек, которые никому на хуторе не нужны. Нильс пожимает плечами: «Hab ich gefunden. Vielleicht braucht wer». Нашёл. Может, кому-то нужно.', effects: [set44('ad', 'open'), { give: 'c44_coffee' }, w44('batteries', true), until44(51, 16, 45)] },
      { id: 'c44_ad_chores', label: 'Закрыть кур и натаскать воды', minutes: 45, terminal: true, goto: 'c44_mon_eve', ambientDuring: mon44,
        text: 'Шесть яиц, четыре ведра, засов. Мороз крепчает, снег под ногами звенит.', effects: [set44('ad', 'chores'), until44(51, 17, 0)] },
      { id: 'c44_ad_partner', label: 'Найти {partner.acc} и постоять вдвоём на крыльце', minutes: 30, terminal: true, goto: 'c44_mon_eve', ambientDuring: mon44,
        text: 'Вы стоите на крыльце, пока не начинают мёрзнуть пальцы. Совет позади. Кое о чём вы не договорили. Но стоите рядом.', effects: [set44('ad', 'partner'), { body: 'stress', delta: -4 }, until44(51, 16, 45)] },
      { id: 'c44_ad_lamp', label: 'Повесить фонарь у калитки на ночь', minutes: 30, terminal: true, goto: 'c44_mon_eve', ambientDuring: mon44,
        text: 'Фонарь на крюк, фитиль ниже. Если кто-то пойдёт ночью к посту, свет будет видно от самой дороги.', effects: [set44('ad', 'lamp'), until44(51, 16, 45)] },
    ] }),

  // ═════════════ Вторник ═════════════
  X({ id: 'c44_a_hen', title: 'Курица', camp: yard14, ambient: tue44,
    text: [
      { when: feast, text: 'Хенрике выбрала рыжую. Курица сидит в корзине, накрытая мешком, и молчит. Топор у колоды. «Machst du das? Ich kann das nicht mehr gut». Сделаешь? Я уже плохо это умею.' },
      { when: not(feast), text: 'Утро. Снег перестал. Дел к сочельнику столько, что Хенрике пишет их на двери столбиком.' },
    ],
    actions: [
      { id: 'c44_ah_do', label: 'Сделать быстро, как учили', when: feast, minutes: 45, terminal: true, goto: 'c44_a_tree', ambientDuring: tue44,
        text: 'Один удар. Ты держишь, пока не перестаёт биться. Руки потом долго пахнут перьями. Хенрике ощипывает молча, у печи, и не смотрит на тебя: так легче обоим.', effects: [set44('ah', 'do'), w44('hen', 'killed'), until44(52, 8, 30)] },
      { id: 'c44_ah_ole', label: 'Попросить сделать того, кто умеет', when: feast, minutes: 45, terminal: true, goto: 'c44_a_tree', ambientDuring: tue44,
        text: 'Хенрике кивает и зовёт кого-то из мужчин. Ты не смотришь. Через десять минут курица у печи, перья в мешке.', effects: [set44('ah', 'ole'), w44('hen', 'killed'), until44(52, 8, 30)] },
      { id: 'c44_ah_spare', label: 'Уговорить оставить рыжую: суп будет и без неё', when: feast, minutes: 45, terminal: true, goto: 'c44_a_tree', ambientDuring: tue44,
        text: 'Хенрике долго смотрит на тебя, потом на курицу. «Weich bist du». Мягкий{m:|ая} ты. Но мешок снимает. Рыжая уходит в курятник, переваливаясь. Суп будет с перловкой.', effects: [set44('ah', 'spare'), w44('hen', 'spared'), until44(52, 8, 30)] },
      { id: 'c44_ah_list', label: 'Взять у Хенрике список дел и начать сверху', when: not(feast), minutes: 45, terminal: true, goto: 'c44_a_tree',
        text: 'Дрова, вода, снег с крыши, лавки в кухню. Ты начинаешь сверху и вычёркиваешь по одному. К девяти — три строчки.', effects: [set44('ah', 'list'), until44(52, 8, 30)] },
      { id: 'c44_ah_roof', label: 'Сбросить снег с крыши сарая, пока не продавил', when: not(feast), minutes: 60, activity: 'heavy', terminal: true, goto: 'c44_a_tree', ambientDuring: tue44,
        text: 'Лестница, лопата, мокрая черепица. Снег уходит пластами и ухает вниз. Внизу кто-то из детей визжит от восторга.', effects: [set44('ah', 'roof'), { body: 'fatigue', delta: 6 }, until44(52, 8, 45)] },
      { id: 'c44_ah_kids', label: 'Вывести детей во двор лепить снеговика', when: not(feast), minutes: 60, terminal: true, goto: 'c44_a_tree', ambientDuring: tue44,
        text: 'Снег липкий, катится сам. К девяти у калитки стоит снеговик с угольками вместо глаз и морковкой из погреба. Хенрике ворчит про морковку и улыбается.', effects: [set44('ah', 'kids'), until44(52, 8, 45)] },
    ] }),

  X({ id: 'c44_a_tree', title: 'Ёлка', camp: kitchen14,
    text: [
      { when: flag('w.c42_tree'), text: 'Ёлку переносят из кухни в большую комнату, где будет сочельник. Ведро с песком тяжёлое, игрушки норовят упасть.' },
      { when: not(flag('w.c42_tree')), text: 'Ёлки в доме нет. Хенрике достаёт из сундука старые еловые ветки из воска и ставит их в вазу. «So ging es früher auch». Так раньше тоже было.' },
    ],
    actions: [
      { id: 'c44_at_carry', label: 'Перенести ёлку и закрепить, чтобы не упала', minutes: 60, activity: 'moderate', terminal: true, goto: 'c44_a_gift', when: flag('w.c42_tree'),
        text: 'Ведро на подставку, верхушку проволокой к крюку в потолке. Ёлка стоит ровно. Дети вешают обратно то, что упало при переноске.', effects: [set44('at', 'carry'), until44(52, 9, 45)] },
      { id: 'c44_at_candles', label: 'Проверить свечи на ветках и поставить рядом ведро с водой', minutes: 45, terminal: true, goto: 'c44_a_gift', when: flag('w.c42_tree'),
        text: 'Каждую свечу отдельно: держится ли, не под веткой ли. Две переставляешь. Ведро с водой и тряпка — у ствола. В сочельник будет светло и не страшно.', effects: [set44('at', 'candles'), until44(52, 9, 30)] },
      { id: 'c44_at_vase', label: 'Помочь Хенрике с ветками в вазе', when: not(flag('w.c42_tree')), minutes: 45, terminal: true, goto: 'c44_a_gift',
        text: 'Ветки из воска пахнут старым сундуком. Ты расставляешь их в вазе так, как говорит Хенрике. Получается почти ёлка.', effects: [set44('at', 'vase'), until44(52, 9, 30)] },
      { id: 'c44_at_benches', label: 'Принести лавки из сарая для гостей', minutes: 60, activity: 'moderate', terminal: true, goto: 'c44_a_gift',
        text: 'Две лавки из сарая, пыльные, с паутиной. Ты отмываешь их у колодца и вносишь в дом. Хенрике считает места вслух. Хватает впритык.', effects: [set44('at', 'benches'), until44(52, 9, 45)] },
      { id: 'c44_at_star', label: 'Повесить на окно звезду из фольги', minutes: 60, terminal: true, goto: 'c44_a_gift',
        text: 'Звезда на нитке за стеклом. Вечером, при свечах, она будет блестеть на всю дорогу.', effects: [set44('at', 'star'), until44(52, 9, 45)] },
    ] }),

  X({ id: 'c44_a_gift', title: 'Подарок', camp: kitchen14,
    text: [
      { when: v('w.c42_a_gift', 'carve'), text: 'Фигурка из липы ждёт в кармане куртки: то ли кот, то ли лиса. Ей не хватает глаз и хвоста.' },
      { when: v('w.c42_a_gift', 'boots'), text: 'Ботинки {partner.gen} прошиты. Но шнурки истлели: подарок не закончен.' },
      { when: v('w.c42_a_gift', 'letter'), text: 'Письмо лежит в книге на полке. Ты перечитываешь его и думаешь, не слишком ли.' },
      { when: not(flag('w.c42_a_gift')), text: 'До сочельника два дня. Подарка для {partner.gen} у тебя нет.' },
    ],
    actions: [
      { id: 'c44_ag_finish', label: 'Закончить подарок', when: flag('w.c42_a_gift'), minutes: 75, terminal: true, goto: 'c44_tue_lunch',
        text: 'Ещё час работы, и всё: глаза, шнурки или последняя строчка. Ты заворачиваешь подарок в газету и прячешь туда, где {partner} не найдёт.', effects: [set44('ag', 'finish'), w44('a_gift_done', true), until44(52, 11, 15)] },
      { id: 'c44_ag_make', label: 'Сделать что-нибудь из того, что есть', when: not(flag('w.c42_a_gift')), minutes: 90, terminal: true, goto: 'c44_tue_lunch',
        text: 'Обрезок кожи, нож, шило. Получается чехол для ножа, грубый, но крепкий. Ты прячешь его в сарае за мешками.', effects: [set44('ag', 'make'), w44('a_gift_done', true), until44(52, 11, 30)] },
      { id: 'c44_ag_henrike', label: 'Сделать подарок Хенрике: починить ей очки', when: henrike44, minutes: 60, terminal: true, goto: 'c44_tue_lunch',
        text: 'Дужка держится на нитке уже месяц. Тонкая проволока, плоскогубцы, капля смолы. Очки сидят ровно. Ты кладёшь их ей на место, где она их ищет каждое утро.', effects: [set44('ag', 'henrike'), npc('henrike', 1), until44(52, 11, 0)] },
      { id: 'c44_ag_kids', label: 'Вырезать детям по маленькой фигурке из липы', minutes: 60, terminal: true, goto: 'c44_tue_lunch',
        text: 'Нож, обрезки липы, час работы. Получаются ёжик, рыба и что-то, что ты называешь лошадью. Ты прячешь их в карман.', effects: [set44('ag', 'kids'), until44(52, 11, 0)] },
    ] }),

  X({ id: 'c44_a_church', title: 'Церковь', camp: yard14, ambient: tue44,
    text: [
      { when: any(v('w.c42_church', 'all'), v('w.c42_church', 'some')), text: 'Пастор из Йестебурга просит помочь: в церкви Святого Мартина надо поставить скамьи, растопить печку и натаскать дров на сочельник. Лукас ждёт с трактором у ворот.' },
      { when: v('w.c42_church', 'home'), text: 'В церковь в сочельник вы не идёте. Но Лукас у ворот спрашивает, не поможет ли кто пастору с дровами: печка там старая, а людей не хватает.' },
    ],
    actions: [
      { id: 'c44_ac_go', label: 'Поехать помочь пастору', minutes: 120, activity: 'moderate', terminal: true, goto: 'c44_a_post', ambientDuring: tue44,
        text: 'Церковь холодная, как погреб. Вы растапливаете железную печку, расставляете скамьи, носите дрова. Пастор, старик в двух пальто, говорит тебе «Gott segne dich» и смущается, как будто сказал лишнее.', effects: [set44('ac', 'go'), w44('church_help', true), until44(52, 15, 15)] },
      { id: 'c44_ac_ditch', label: 'Сказать: нужнее на рву, и пойти копать', minutes: 120, activity: 'heavy', terminal: true, goto: 'c44_a_post', ambientDuring: tue44,
        text: 'На рву человек десять. Земля промёрзла, копаете ломами. К трём ров дошёл до колонии. Брандт проходит вдоль и пересчитывает лопаты.', effects: [set44('ac', 'ditch'), { body: 'fatigue', delta: 10 }, until44(52, 15, 15)] },
      { id: 'c44_ac_home', label: 'Остаться дома: здесь дел не меньше', minutes: 90, terminal: true, goto: 'c44_a_post',
        text: 'Вода, дрова, снег с дорожки, лавки, скатерть. К трём дом готов принимать гостей, хотя гостей ещё никто не позвал окончательно.', effects: [set44('ac', 'home'), until44(52, 15, 0)] },
    ] }),

  X({ id: 'c44_a_post', title: 'Пост на Зеве', camp: yard14, ambient: tue44,
    text: [
      { text: 'По дороге назад — пост вашего двора у Зеве: шалаш, колокол, пень. В сочельник тут тоже кто-то должен стоять, с девяти до полуночи.' },
      { when: verdict('yard'), text: 'Смены Яннеса теперь ваши. Значит, и сочельник — ваш.' },
      { text: 'На столбе у колокола — зарубки ножом, по одной за каждую отстоянную ночь. Их уже больше двадцати. У последних трёх кто-то нацарапал крестик. Ты не знаешь, что он значит, и спросить не у кого.' },
    ],
    actions: [
      { id: 'c44_ap_fix', label: 'Подлатать шалаш: еловый лапник, брезент', minutes: 60, activity: 'moderate', terminal: true, goto: 'c44_a_dusk2', ambientDuring: tue44,
        text: 'Лапник на каркас, брезент сверху, камни по углам. Внутри можно сидеть и не замёрзнуть за три часа. Почти.', effects: [set44('ap', 'fix'), w44('post_fixed', true), until44(52, 16, 15)] },
      { id: 'c44_ap_wood', label: 'Притащить к посту сухих дров и спрятать под брезент', minutes: 60, activity: 'moderate', terminal: true, goto: 'c44_a_dusk2', ambientDuring: tue44,
        text: 'Две вязанки сухих поленьев под брезентом, спички в банке. Если в сочельник будет мороз, у поста будет огонь.', effects: [set44('ap', 'wood'), until44(52, 16, 15)] },
      { id: 'c44_ap_look', label: 'Постоять у ручья и послушать', minutes: 30, terminal: true, goto: 'c44_a_dusk2', ambientDuring: tue44,
        text: 'Лёд толстый, тишина. На другом берегу следов нет. Только заячьи. Ты стоишь, пока не начинают мёрзнуть ноги.', effects: [set44('ap', 'look'), until44(52, 15, 45)] },
    ] }),

  X({ id: 'c44_a_dusk2', title: 'Сумерки во вторник', camp: yard14, ambient: tue44,
    text: [
      { text: 'Сумерки. Двор в снегу, окна кухни жёлтые. Из трубы пахнет печеньем.' },
      { text: 'Последний вечер, когда можно ещё что-то успеть. Завтра сочельник наступит, готов ты или нет: свечи, стол, люди, пост у реки.' },
      { when: felixAround44, text: 'Феликс сидит на крыльце, уставший, и смотрит на окна. «So hat es bei uns auch gerochen», — говорит он. У нас дома тоже так пахло.' },
    ],
    actions: [
      { id: 'c44_ad2_felix', label: 'Сесть рядом с Феликсом', when: felixAround44, minutes: 45, terminal: true, goto: 'c44_tue_eve', ambientDuring: tue44,
        text: 'Вы сидите молча. Потом он говорит, что письмо дошло, наверное, или скоро дойдёт, и что мать будет плакать в сочельник, читая. «Aber gut weinen». Но хорошо плакать.', effects: [set44('ad2', 'felix'), until44(52, 17, 15)] },
      { id: 'c44_ad2_chores', label: 'Закрыть кур и сарай', minutes: 30, terminal: true, goto: 'c44_tue_eve', ambientDuring: tue44,
        text: 'Засов, проволока, банки. Курятник, сарай, калитка. Всё.', effects: [set44('ad2', 'chores'), until44(52, 17, 0)] },
      { id: 'c44_ad2_partner', label: 'Позвать {partner.acc} посмотреть на окна снаружи', minutes: 30, terminal: true, goto: 'c44_tue_eve', ambientDuring: tue44,
        text: 'Вы стоите во дворе и смотрите на свой дом, как чужие. Жёлтые окна, дым, тени за занавеской. {partner} говорит: «Красиво». Вы не спешите внутрь.', effects: [set44('ad2', 'partner'), { body: 'stress', delta: -5 }, until44(52, 17, 0)] },
      { id: 'c44_ad2_bell', label: 'Дойти до поста у Зеве и проверить колокол', minutes: 30, terminal: true, goto: 'c44_tue_eve', ambientDuring: tue44,
        text: 'Колокол на месте, верёвка не перетёрлась. Ты бьёшь один раз, тихо. Из колонии отвечают тем же. Берег на связи.', effects: [set44('ad2', 'bell'), until44(52, 17, 0)] },
    ] }),
];
