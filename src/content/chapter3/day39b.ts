import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc } from './point19';
import { eldersCome, oleHome33 } from './point33';
import { lea36 } from './point36';
import {
  S39, army39, bed39, frost39, henrike39, merleFarm39, merleNorth39, oleDead39, parents39, pens39, set39, until39, w39,
} from './point39';

// Участок 39, линия B. Пятница: Мерле и счёт инсулина (или весть с той стороны), сундук на чердаке (находка: код 0-7-3 — седьмое
// марта, день рождения Оле), кухня (Биргит и Хенрике), школа для Нины, пункт Зандер, колония; вечер. Суббота: баня, Эва (или Лея),
// Хенрике и книга посевов, план для Мерле на случай, если ручки кончатся.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S39({ ...scene, for: 'any', chapter: 'ch3' });
const merleHasMany: Cond = any(pens39(3), flag('w.c38_pens_to_merle'));

export const day39BScenes: Scene[] = [
  // ═════════════ Пятница ═════════════
  X({ id: 'c39_b_merle', title: 'Счёт', camp: kitchen14,
    text: [
      { when: merleFarm39, text: 'Мерле раскладывает на столе всё, что у неё есть: ручки, иголки, глюкометр с тремя полосками. Считает вслух, по-деловому, как будто это чужое.' },
      { when: all(merleFarm39, merleHasMany), text: '— Mit euren Pens — bis Februar. Vielleicht März, wenn ich brav bin. — Она смотрит на тебя. — Ich bin nie brav.\n\nС вашими ручками — до февраля. Может, до марта, если буду паинькой. Я никогда не паинька.' },
      { when: all(merleFarm39, not(merleHasMany)), text: '— Neun Tage. Zehn, wenn ich weniger esse. Und dann… — Она пожимает плечами. — Dann wird es interessant.\n\nДевять дней. Десять, если буду меньше есть. А потом… потом будет интересно.' },
      { when: merleNorth39, text: 'Мерле осталась за Эльбой. Ты сидишь над её письмом, которое не успела отдать, и не знаешь, что с ним делать.' },
      { when: all(not(merleFarm39), not(merleNorth39)), text: 'Утро. Хенрике просит помочь с хлебом: гостей больше, муки меньше.' },
    ],
    actions: [
      { id: 'c39_bm_plan', label: 'Составить с Мерле план: дозы, еда, сахар на случай', when: merleFarm39, minutes: 60, terminal: true, goto: 'c39_b_attic',
        text: 'Вы пишете на листе: когда колоть, сколько, что есть, что делать, если плохо. Сахар в кармане всегда. Мерле прикалывает лист над своей кроватью. «Wie im Krankenhaus. Nur netter». Как в больнице. Только милее.', effects: [set39('bm', 'plan'), w39('merle_plan', true), { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 2 }] }, until39(41, 9, 0)] },
      { id: 'c39_bm_cold', label: 'Найти для ручек холодное место: подвал, не мороз', when: merleFarm39, minutes: 60, terminal: true, goto: 'c39_b_attic',
        text: 'Инсулин нельзя морозить и нельзя греть. В подвале плюс четыре — то, что надо. Ты ставишь коробку на полку у двери, подписываешь. Хенрике кладёт рядом градусник: сама проверять будет.', effects: [set39('bm', 'cold'), w39('pens_cellar', true), npc('henrike', 1), until39(41, 9, 0)] },
      { id: 'c39_bm_joke', label: 'Просто посидеть с ней и посмеяться', when: merleFarm39, minutes: 60, terminal: true, goto: 'c39_b_attic',
        text: 'Вы смеётесь над чем-то из Бармбека, над соседом с третьего этажа, над тем, как Мерле однажды заперла кота в посудомойке. Смех громкий, Хенрике заглядывает из коридора и уходит, улыбаясь.', effects: [set39('bm', 'joke'), { body: 'stress', delta: -6 }, until39(41, 9, 0)] },
      { id: 'c39_bm_letter', label: 'Отдать письмо в Красный Крест: может, дойдёт через реку', when: merleNorth39, minutes: 60, terminal: true, goto: 'c39_b_attic',
        text: 'Красный Крест ещё связывается с Аренсбургом по рации, а письма собирает «на весну». Ты отдаёшь письмо водителю пикапа. «Frühjahr», — говорит он. Весной.', effects: [set39('bm', 'letter'), w39('merle_letter_sent', true), until39(41, 9, 0)] },
      { id: 'c39_bm_keep', label: 'Оставить письмо у себя: отдать при встрече', when: merleNorth39, minutes: 45, terminal: true, goto: 'c39_b_attic',
        text: 'Ты кладёшь письмо в книгу, между страницами. Весной мост откроют. Или лёд встанет. Тогда отдашь {m:сам|сама}.', effects: [set39('bm', 'keep'), until39(41, 9, 0)] },
      { id: 'c39_bm_bread', label: 'Помочь Хенрике с хлебом', when: all(not(merleFarm39), not(merleNorth39)), minutes: 60, terminal: true, goto: 'c39_b_attic',
        text: 'Тесто, руки, мука. Хенрике месит рядом и рассказывает про весну. Час проходит быстро.', effects: [set39('bm', 'bread'), npc('henrike', 1), until39(41, 9, 0)] },
    ] }),

  X({ id: 'c39_b_attic', title: 'Сундук', camp: kitchen14,
    text: [
      { text: 'Хенрике посылает тебя на чердак за одеялами. Под скатом крыши, за трубой, стоит деревянный сундук, крашеный, с цветами на крышке. На петлях — кодовый замок, велосипедный, на три колёсика.' },
      { when: bed39('attic'), text: 'Мерле теперь спит здесь, у трубы. Сундук стоит в ногах её кровати, как часть мебели.' },
      { text: 'На крышке, выцарапано гвоздём, детскими буквами: «OLE. NICHT ÖFFNEN». Оле. Не открывать.' },
      { when: henrike39, text: 'Хенрике снизу кричит: «Die Decken liegen links! Den Kasten lass, der ist von Ole, den Code weiß nur er». Одеяла слева! Сундук оставь, он Оле, код знает только он.' },
    ],
    actions: [
      { id: 'c39_ba_073', label: 'Набрать 0-7-3', minutes: 15, terminal: true, goto: 'c39_b_open',
        text: 'Ноль, семь, три. Седьмое марта. Замок щёлкает и раскрывается.', effects: [set39('ba', '073'), set39('chest_open', true), w39('chest', 'open'), until39(41, 9, 30)] },
      { id: 'c39_ba_703', label: 'Набрать 7-0-3', minutes: 15, terminal: true, goto: 'c39_b_attic2',
        text: 'Семь, ноль, три. Замок не поддаётся.', effects: [set39('ba', '703'), until39(41, 9, 30)] },
      { id: 'c39_ba_307', label: 'Набрать 3-0-7', minutes: 15, terminal: true, goto: 'c39_b_attic2',
        text: 'Три, ноль, семь. Ничего.', effects: [set39('ba', '307'), until39(41, 9, 30)] },
      { id: 'c39_ba_999', label: 'Набрать 9-9-9: год рождения, девяносто девятый', minutes: 15, terminal: true, goto: 'c39_b_attic2',
        text: 'Девять, девять, девять. Колёсики проворачиваются впустую.', effects: [set39('ba', '999'), until39(41, 9, 30)] },
      { id: 'c39_ba_leave', label: 'Не трогать: это Оле', minutes: 10, terminal: true, goto: 'c39_b_kitchen',
        text: 'Ты берёшь одеяла и спускаешься. Сундук остаётся под скатом, с цветами на крышке.', effects: [set39('ba', 'leave'), w39('chest', 'left'), until39(41, 9, 30)] },
    ] }),

  X({ id: 'c39_b_attic2', title: 'Замок', camp: kitchen14,
    text: [
      { text: 'Колёсики тугие, ржавые. Замок старый, велосипедный: такой можно сбить молотком, если не жалко сундук.' },
      { when: oleHome33, text: 'Внизу слышен голос Оле. Можно спросить его самого.' },
    ],
    actions: [
      { id: 'c39_b2_073', label: 'Набрать 0-7-3', minutes: 15, terminal: true, goto: 'c39_b_open',
        text: 'Ноль, семь, три. Замок раскрывается.', effects: [set39('b2', '073'), set39('chest_open', true), w39('chest', 'open'), until39(41, 9, 45)] },
      { id: 'c39_b2_ole', label: 'Спуститься и спросить Оле', when: oleHome33, minutes: 20, terminal: true, goto: 'c39_b_open',
        text: 'Оле смотрит на тебя удивлённо, потом смеётся, впервые за долгое время. «Mein Geburtstag. Null-sieben-drei. Ich war elf». Мой день рождения. Ноль-семь-три. Мне было одиннадцать. Он сам поднимается и открывает.', effects: [set39('b2', 'ole'), set39('chest_open', true), w39('chest', 'ole'), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: 2 }] }, until39(41, 9, 50)] },
      { id: 'c39_b2_hammer', label: 'Сбить замок молотком', minutes: 15, terminal: true, goto: 'c39_b_open',
        text: 'Два удара, дужка лопается. Звон на весь дом. Хенрике поднимается по лестнице, видит сундук и молча спускается обратно. Крышка теперь не закрывается.', effects: [set39('b2', 'hammer'), set39('chest_open', true), w39('chest', 'broken'), npc('henrike', -1, 'c39_broke_ole_chest'), until39(41, 9, 45)] },
      { id: 'c39_b2_leave', label: 'Оставить', minutes: 10, terminal: true, goto: 'c39_b_kitchen',
        text: 'Ты берёшь одеяла. Сундук пусть ждёт своего хозяина.', effects: [set39('b2', 'leave'), w39('chest', 'left'), until39(41, 9, 40)] },
    ] }),

  X({ id: 'c39_b_open', title: 'Что было у Оле', camp: kitchen14,
    text: [
      { text: 'Внутри пахнет нафталином и детством. Деревянные санки, разобранные, с полозьями, перевязанными бечёвкой. Фонарик с ручкой-динамо: крутишь — светит. Коробка свечей. Альбом с рисунками: трактор, корова, мама.' },
      { when: oleDead39, text: 'На последнем рисунке — мальчик и мужчина держатся за руки у ворот. Подписано: «Papa und ich». Папа и я. Оле больше нет. Отца нет давно.' },
      { when: not(oleDead39), text: 'На последнем рисунке — мальчик и мужчина у ворот. Подписано: «Papa und ich». Отца Оле ты не {m:видел|видела} ни разу. Никто о нём не говорит.' },
    ],
    actions: [
      { id: 'c39_bo_take', label: 'Взять санки и фонарик: пригодятся. Альбом — Хенрике', minutes: 30, terminal: true, goto: 'c39_b_kitchen',
        text: 'Санки ты собираешь во дворе: полозья, перекладины, верёвка. Тяжёлые, но крепкие. Фонарик жужжит, когда крутишь ручку. Альбом ты отдаёшь Хенрике. Она садится с ним у окна и не встаёт полчаса.', effects: [set39('bo', 'take'), { give: 'c39_crank_torch' }, w39('sled', true), { give: 'c39_candles' }, npc('henrike', 2, 'c39_gave_album'), until39(41, 10, 15)] },
      { id: 'c39_bo_ole', label: 'Отнести всё Оле: это его', when: oleHome33, minutes: 30, terminal: true, goto: 'c39_b_kitchen',
        text: 'Оле листает альбом, не поднимая глаз. Потом отдаёт тебе фонарик и показывает на санки: «Nehmt sie. Ich bin zu groß». Берите. Я вырос. Альбом он уносит к себе.', effects: [set39('bo', 'ole'), { give: 'c39_crank_torch' }, w39('sled', true), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: 2 }] }, until39(41, 10, 15)] },
      { id: 'c39_bo_close', label: 'Закрыть сундук обратно: не твоё', minutes: 20, terminal: true, goto: 'c39_b_kitchen',
        text: 'Ты закрываешь крышку. Детство Оле остаётся в сундуке. Внизу никто не спрашивает, что там было.', effects: [set39('bo', 'close'), until39(41, 10, 5)] },
    ] }),

  X({ id: 'c39_b_kitchen', title: 'Две хозяйки', camp: kitchen14,
    text: [
      { when: parents39, text: 'На кухне Биргит переставила кастрюли. Хенрике переставила обратно. Биргит снова. Ни слова не сказано. Воздух можно резать ножом.' },
      { when: all(not(parents39), evaHere), text: 'Эва и Хенрике спорят, класть ли в суп лавровый лист. Спорят третий день. Сегодня — громче.' },
      { when: all(not(parents39), not(evaHere), eldersCome), text: 'Фрау Кёрнер спустилась на кухню помогать и уронила миску. Хенрике собирает осколки и говорит, что ничего. Фрау Кёрнер плачет.' },
      { when: all(not(parents39), not(evaHere), not(eldersCome)), text: 'Хенрике одна на кухне, режет капусту. Нож ходит быстро. Она не оборачивается, когда ты входишь.' },
    ],
    actions: [
      { id: 'c39_bk_rules', label: 'Предложить разделить: утро — одна, вечер — другая', minutes: 60, terminal: true, goto: 'c39_b_nina',
        text: 'Обе смотрят на тебя, как на {m:сумасшедшего|сумасшедшую}. Потом друг на друга. Потом Хенрике говорит: «Morgens ich». Утром я. И вопрос закрыт. На двери кухни появляется ещё один лист.', effects: [set39('bk', 'rules'), w39('kitchen_rules', true), until39(41, 11, 15)] },
      { id: 'c39_bk_stay', label: 'Остаться помогать и не вмешиваться', minutes: 60, terminal: true, goto: 'c39_b_nina',
        text: 'Ты чистишь картошку и молчишь. Через полчаса они начинают разговаривать: сначала о картошке, потом о детях, потом о мужьях. К обеду смеются вместе.', effects: [set39('bk', 'stay'), until39(41, 11, 15)] },
      { id: 'c39_bk_henrike', label: 'Увести Хенрике во двор под предлогом', when: henrike39, minutes: 60, terminal: true, goto: 'c39_b_nina',
        text: 'Ты зовёшь Хенрике посмотреть на корову. Во дворе она говорит: «Es ist mein Haus. Und ich weiß, dass das dumm ist». Это мой дом. И я знаю, что это глупо. Вы стоите у хлева, пока она не остывает.', effects: [set39('bk', 'henrike'), npc('henrike', 2), until39(41, 11, 15)] },
    ] }),

  X({ id: 'c39_b_nina', title: 'Школа', camp: kitchen14,
    text: [
      { when: ninaFarm, text: 'Школа в Винзене закрыта: грузовики больше не ходят. Нина сидит над учебником, который знает наизусть.' },
      { when: not(ninaFarm), text: 'Нины на хуторе нет. Дочь соседа приходит за молоком и спрашивает, не знаешь ли ты, будет ли где-нибудь школа.' },
    ],
    actions: [
      { id: 'c39_bn_school', label: 'Устроить школу на кухне: два часа каждое утро', minutes: 60, terminal: true, goto: 'c39_lunch',
        text: 'Немецкий, счёт, география по старой карте Хенрике. Нина делает вид, что ей скучно, и отвечает на всё первой. К концу урока у вас расписание на неделю.', effects: [set39('bn', 'school'), w39('farm_school', true), { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust: 2 }] }, until39(41, 12, 15)] },
      { id: 'c39_bn_merle', label: 'Попросить Мерле вести рисование', when: all(ninaFarm, merleFarm39), minutes: 60, terminal: true, goto: 'c39_lunch',
        text: 'Мерле садится с Ниной за стол, даёт ей карандаш и говорит: «Zeichne die Kuh. Aber so, wie sie sich fühlt». Нарисуй корову. Но такой, какой она себя чувствует. Нина рисует до обеда и не отрывается.', effects: [set39('bn', 'merle'), w39('farm_school', true), { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 1 }] }, until39(41, 12, 15)] },
      { id: 'c39_bn_later', label: 'Сказать: после пятнадцатого подумаем', minutes: 30, terminal: true, goto: 'c39_lunch',
        text: 'Нина кивает, не поднимая глаз от учебника. Она уже привыкла, что всё — после пятнадцатого.', effects: [set39('bn', 'later'), until39(41, 11, 45)] },
    ] }),

  X({ id: 'c39_b_zander', title: 'Пункт', location: 'c16_jesteburg', camp: { at: 'c16_jesteburg', stock: 'c3_farm_stock', rest: false }, ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'Пункт Зандер. Половина шкафов пуста: армия забрала своё. Зандер сидит за столом и пишет список того, что осталось.' },
      { text: '— Ab Dienstag bin ich der Kreis. Ein Arzt für sechstausend Leute. — Она поднимает глаза. — Ich brauche jemanden zweimal die Woche. Nicht für Geld. Es gibt kein Geld.\n\nСо вторника я — весь округ. Один врач на шесть тысяч человек. Мне нужен кто-то два раза в неделю. Не за деньги. Денег нет.' },
    ],
    actions: [
      { id: 'c39_bz_yes', label: 'Согласиться: вторник и пятница', minutes: 60, terminal: true, goto: 'c39_b_ute',
        text: 'Зандер пишет на листке твоё имя и два дня. Протягивает ключ от шкафа с перевязочным. «Der zweite Schlüssel. Den hatte Lea». Второй ключ. Он был у Леи.', effects: [set39('bz', 'yes'), w39('b_point', true), { give: 'c39_point_key' }, until39(41, 15, 15)] },
      { id: 'c39_bz_once', label: 'Сказать: раз в неделю, больше не получится', minutes: 60, terminal: true, goto: 'c39_b_ute',
        text: 'Зандер кивает. «Einmal ist besser als keinmal». Раз лучше, чем ни разу. Записывает: пятница.', effects: [set39('bz', 'once'), w39('b_point', 'once'), until39(41, 15, 15)] },
      { id: 'c39_bz_no', label: 'Отказаться: на хуторе теперь больные свои', minutes: 45, terminal: true, goto: 'c39_b_ute',
        text: 'Зандер не уговаривает. «Verstehe». Понимаю. Даёт тебе с собой бинты и флакон йода: для своих.', effects: [set39('bz', 'no'), until39(41, 15, 0)] },
    ] }),

  X({ id: 'c39_b_ute', title: 'Колония', camp: yard14, ambient: frost39,
    text: [
      { text: 'На обратном пути — садовая колония у насыпи. В домике у Уте дымит труба. Уте выходит на крыльцо в валенках.' },
      { when: bed39('colony'), text: 'В соседнем домике теперь живёт Мерле. Из её трубы дым идёт неровно: печка капризная.' },
      { text: '— Wenn es taut, läuft hier alles voll. Der Graben kommt hoch, — говорит Уте. Когда растает, тут всё зальёт. Канава поднимется.' },
    ],
    actions: [
      { id: 'c39_bu_help', label: 'Помочь Уте поднять дрова и мешки повыше', minutes: 60, activity: 'moderate', terminal: true, goto: 'c39_dusk', ambientDuring: frost39,
        text: 'Мешки с картошкой на полки, дрова на козлы. Час работы. Уте даёт тебе с собой банку варенья: «Für die Kranke». Для больной. Она про Мерле или про кого-то ещё — не уточняет.', effects: [set39('bu', 'help'), npc('c14_ute', 2), until39(41, 16, 30)] },
      { id: 'c39_bu_merle', label: 'Зайти к Мерле, растопить ей печку', when: bed39('colony'), minutes: 60, terminal: true, goto: 'c39_dusk', ambientDuring: frost39,
        text: 'Печка дымит, потому что заслонка наполовину закрыта. Ты открываешь, подкладываешь. Через полчаса в домике тепло. Мерле сидит в одеяле и говорит: «Ich wohne in einem Gartenhaus. Wie eine Gartenzwergin». Я живу в садовом домике. Как садовый гном.', effects: [set39('bu', 'merle'), { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 1 }] }, until39(41, 16, 30)] },
      { id: 'c39_bu_talk', label: 'Поговорить с Уте и Яннесом про вторник', minutes: 45, terminal: true, goto: 'c39_dusk', ambientDuring: frost39,
        text: 'Яннес говорит, что видел ночью огни на насыпи: кто-то шёл с фонарями к впадине. Мародёры или дружина. Уте говорит: «Oder Narren». Или дураки.', effects: [set39('bu', 'talk'), w39('lights_seen', true), until39(41, 16, 15)] },
    ] }),

  X({ id: 'c39_b_evening', title: 'Пятничный вечер', camp: kitchen14,
    text: [
      { when: merleFarm39, text: 'Мерле зовёт тебя к себе: показать блокнот. В нём хутор — весь, по комнатам, с людьми. И ты. Ты на рисунке смеёшься.' },
      { when: merleNorth39, text: 'Вечер. Ты сидишь у печки и думаешь о спортзале за рекой. О том, как Мерле стояла у ворот без шапки.' },
      { when: all(not(merleFarm39), not(merleNorth39)), text: 'Вечер. Хенрике штопает, Нина читает вслух. Ты сидишь у печки, и тебе хорошо, хотя не должно быть.' },
    ],
    actions: [
      { id: 'c39_be_talk', label: 'Говорить до полуночи', minutes: 90, terminal: true, goto: 'c39_b_late',
        text: 'Обо всём и ни о чём. О Бармбеке, о ноябре, о том, что будет весной. Под конец глаза закрываются сами.', effects: [set39('be', 'talk'), { if: merleFarm39, then: [{ npc: 'merle', trust: 1 }] }, { body: 'stress', delta: -5 }, until39(41, 21, 30)] },
      { id: 'c39_be_write', label: 'Написать что-нибудь в тетрадь: для себя', minutes: 60, terminal: true, goto: 'c39_b_late',
        text: 'Ты пишешь, что было за день. Коротко. Число, погода, кто приехал, кто уехал. Если когда-нибудь спросят, как это было, — вот.', effects: [set39('be', 'write'), w39('b_diary', true), until39(41, 21, 30)] },
      { id: 'c39_be_sleep', label: 'Лечь пораньше', minutes: 60, terminal: true, goto: 'c39_b_late',
        text: 'Ты засыпаешь, едва {m:лёг|легла}. Снится Бармбек: лестница, кот, Мерле в дверях.', effects: [set39('be', 'sleep'), { body: 'fatigue', delta: -8 }, until39(41, 21, 30)] },
    ] }),

  X({ id: 'c39_b_late', title: 'Перед сном', camp: house14,
    text: [
      { text: 'Половина десятого. Ты выходишь во двор перед сном. Тихо. Ветер сменился на западный, сырой. С крыши над крыльцом капает: одна капля, другая.' },
      { when: merleFarm39, text: 'В окне чердака горит свеча: Мерле не спит. Колет вечернюю дозу, наверное.' },
    ],
    actions: [
      { id: 'c39_b_late_gate', label: 'Проверить ворота и тропу к ручью', minutes: 30, terminal: true, goto: 'c39_sat', ambientDuring: frost39,
        text: 'Засов, калитка, проволока с банками. Всё на месте. У ручья тихо. Ты стоишь минуту, слушаешь капель, и идёшь спать.', effects: [{ set: '$.c39_late', value: 'gate' }, until39(42, 8, 0, true)] },
      { id: 'c39_b_late_drip', label: 'Постоять и послушать капель', minutes: 30, terminal: true, goto: 'c39_sat', ambientDuring: frost39,
        text: 'Кап. Кап. Кап. Звук весны в середине декабря. Он не радует. Ты идёшь в дом и долго не можешь уснуть.', effects: [{ set: '$.c39_late', value: 'drip' }, { body: 'stress', delta: 2 }, until39(42, 8, 0, true)] },
      { id: 'c39_b_late_bed', label: 'Сразу в постель', minutes: 20, terminal: true, goto: 'c39_sat',
        text: 'Ты возвращаешься в тепло и засыпаешь, едва коснувшись подушки.', effects: [{ set: '$.c39_late', value: 'bed' }, { body: 'fatigue', delta: -4 }, until39(42, 8, 0, true)] },
    ] }),

  // ═════════════ Суббота ═════════════
  X({ id: 'c39_b_sat', title: 'Баня', camp: kitchen14,
    text: [
      { text: 'Суббота — банный день. Хенрике с утра греет воду в котле. Корыто в кухне за занавеской, по очереди. Дети первые, потом старики.' },
    ],
    actions: [
      { id: 'c39_bs_last', label: 'Мыться в последнюю очередь: всех пропустить', minutes: 90, terminal: true, goto: 'c39_b_eva',
        text: 'Вода к твоей очереди уже тёплая, не горячая. Но мыло лавандовое, и полотенце чистое. Ты сидишь в корыте, пока вода не остывает совсем.', effects: [set39('bs', 'last'), { body: 'stress', delta: -6 }, until39(42, 10, 30)] },
      { id: 'c39_bs_help', label: 'Носить воду и мыть детей', minutes: 90, activity: 'moderate', terminal: true, goto: 'c39_b_eva',
        text: 'Вёдра, ковш, Нина, которая визжит от горячей воды, соседская девочка, которая не визжит. Ты {m:мокрый|мокрая} насквозь, но {m:чистый|чистая} — почти.', effects: [set39('bs', 'help'), { body: 'fatigue', delta: 5 }, npc('henrike', 1), until39(42, 10, 30)] },
      { id: 'c39_bs_first', label: 'Помыться сразу, пока вода горячая', minutes: 75, terminal: true, goto: 'c39_b_eva',
        text: 'Горячая вода. Первый раз за две недели. Ты сидишь, закрыв глаза. Потом встаёшь и помогаешь остальным.', effects: [set39('bs', 'first'), { body: 'stress', delta: -8 }, until39(42, 10, 15)] },
    ] }),

  X({ id: 'c39_b_eva', title: 'Уходящие', camp: kitchen14,
    text: [
      { when: v('w.c37_eva', 'army'), text: 'Эва собирает узел к понедельнику: вечером к Тобиасу, во вторник в пять — с армией за Эльбу. Узел лежит на кровати, она сидит рядом.' },
      { when: all(not(v('w.c37_eva', 'army')), lea36), text: 'Лея заходит за последними вещами из пункта. Она уходит в среду, в Берген, если ничего не случится.' },
      { when: all(not(v('w.c37_eva', 'army')), not(lea36)), text: 'В комнате, где жила Кася, теперь пусто. Хенрике просит разобрать то, что она оставила.' },
      { when: army39, text: 'Во вторник в пять — ворота казармы. Вы уходите с армией. Хенрике знает. Она не говорит об этом ни слова.' },
    ],
    actions: [
      { id: 'c39_be2_help', label: 'Помочь собраться', when: any(v('w.c37_eva', 'army'), lea36), minutes: 60, terminal: true, goto: 'c39_lunch2',
        text: 'Узел, ещё узел, бутерброды в бумагу. Ты складываешь чужие вещи аккуратнее, чем свои. Тебя благодарят коротко. Так легче.', effects: [set39('be2', 'help'), until39(42, 12, 0)] },
      { id: 'c39_be2_stay', label: 'Попробовать отговорить', when: any(v('w.c37_eva', 'army'), lea36), minutes: 60, terminal: true, goto: 'c39_lunch2',
        text: 'Ты говоришь. Тебя выслушивают. Ответ один: «Ich habe entschieden». Я решила. Ты больше не уговариваешь.', effects: [set39('be2', 'stay'), until39(42, 12, 0)] },
      { id: 'c39_be2_kasia', label: 'Разобрать вещи Каси', when: all(not(v('w.c37_eva', 'army')), not(lea36)), minutes: 60, terminal: true, goto: 'c39_lunch2',
        text: 'Носки, расчёска, детская книжка с польскими буквами. Ты складываешь всё в коробку и подписываешь: «Kasia». Весной, может быть, она вернётся.', effects: [set39('be2', 'kasia'), until39(42, 12, 0)] },
      { id: 'c39_be2_army', label: 'Собрать свои десять килограммов', when: army39, minutes: 60, terminal: true, goto: 'c39_lunch2',
        text: 'Ты собираешь и разбираешь. Каждая вещь, которую оставляешь, — кусок месяца, прожитого здесь.', effects: [set39('be2', 'army'), w39('b_packed_army', true), until39(42, 12, 0)] },
    ] }),

  X({ id: 'c39_b_henrike', title: 'Книга посевов', camp: kitchen14,
    text: [
      { text: 'После обеда Хенрике садится у окна с толстой тетрадью в клеёнке: «Saatbuch». Книга посевов. Её отец, её мать, она сама — каждый год, что и когда.' },
      { when: flag('w.c37_saatbuch'), text: 'Она уже показывала её тебе в среду. Сегодня открывает на чистой странице: двадцать седьмой год.' },
      { when: henrike39, text: '— Wenn es taut, kommen sie. Aber nach dem Tauwetter kommt der März. Und im März muss das hier stimmen.\n\nКогда растает, они придут. Но после оттепели будет март. И в марте вот это должно быть правильно.' },
    ],
    actions: [
      { id: 'c39_bh_write', label: 'Записывать под её диктовку', minutes: 60, terminal: true, goto: 'c39_b_merle2',
        text: 'Картофель — первая неделя апреля, если земля оттает. Семенной — двенадцать мешков. Капуста — рассада в доме с марта. Ты пишешь, Хенрике диктует, и впервые за месяц кажется, что весна будет.', effects: [set39('bh', 'write'), w39('saat_2027', true), npc('henrike', 2, 'c39_wrote_saatbuch'), until39(42, 15, 0)] },
      { id: 'c39_bh_thaw', label: 'Спросить: что делать во вторник, если придут', minutes: 60, terminal: true, goto: 'c39_b_merle2',
        text: 'Хенрике закрывает тетрадь. «Türen zu. Licht aus. Keiner geht allein raus. Und wer draußen ist, kommt rein, bevor es dunkel wird». Двери закрыть. Свет погасить. Один никто не выходит. А кто снаружи — заходит до темноты. Она говорит это как молитву.', effects: [set39('bh', 'thaw'), w39('thaw_rules', true), until39(42, 15, 0)] },
      { id: 'c39_bh_listen', label: 'Просто слушать', minutes: 45, terminal: true, goto: 'c39_b_merle2',
        text: 'Хенрике листает страницы и рассказывает: этот год был мокрый, этот сухой, этот — когда умерла мать. Ты слушаешь. Она не просит ничего.', effects: [set39('bh', 'listen'), npc('henrike', 1), until39(42, 14, 45)] },
    ] }),

  X({ id: 'c39_b_merle2', title: 'План на потом', camp: kitchen14,
    text: [
      { when: all(merleFarm39, not(merleHasMany)), text: 'Мерле считает снова. Девять дней. Восемь. Ты думаешь, где взять инсулин, когда ручки кончатся.' },
      { when: all(merleFarm39, merleHasMany), text: 'Мерле считает снова: до февраля. Потом — неизвестно. Ты думаешь, где взять инсулин в феврале.' },
      { when: all(merleFarm39, lea36), text: 'Лея, услышав, говорит между делом: «Schweineinsulin. Für Hunde. Gibt es in jeder Tierklinik. Winsen hat eine». Свиной инсулин. Для собак. Есть в любой ветклинике. В Винзене есть.' },
      { when: not(merleFarm39), text: 'Красный Крест передаёт по радио списки: кто где. Ты слушаешь, не надеясь. Знакомых имён нет.' },
    ],
    actions: [
      { id: 'c39_bm2_vet', label: 'Запомнить про ветклинику в Винзене', when: all(merleFarm39, lea36), minutes: 45, terminal: true, goto: 'c39_radio',
        text: 'Ты записываешь на листке над кроватью Мерле: «Tierklinik Winsen. Schweineinsulin, U-40». Мерле читает и морщится: «Hundeinsulin. Toll». Собачий инсулин. Отлично. Но листок не снимает.', effects: [set39('bm2', 'vet'), w39('vet_known', true), until39(42, 16, 0)] },
      { id: 'c39_bm2_ration', label: 'Договориться с Мерле: экономить с сегодняшнего дня', when: merleFarm39, minutes: 45, terminal: true, goto: 'c39_radio',
        text: 'Меньше хлеба, больше капусты, сахар только на крайний случай. Мерле соглашается легко: «Ich wollte eh abnehmen». Я всё равно хотела похудеть. Шутит. Ей страшно.', effects: [set39('bm2', 'ration'), w39('merle_saving', true), until39(42, 16, 0)] },
      { id: 'c39_bm2_ask', label: 'Спросить у всех за столом: у кого есть знакомые аптекари', when: merleFarm39, minutes: 45, terminal: true, goto: 'c39_radio',
        text: 'Петерсен вспоминает аптекаря из Ханштедта. Хенрике — фельдшера, который лечил коров. Уве или Оле говорит: в больнице Бухгольца должны быть холодильники. Список растёт. Ни одного точного адреса.', effects: [set39('bm2', 'ask'), w39('insulin_leads', true), until39(42, 16, 0)] },
      { id: 'c39_bm2_listen', label: 'Дослушать списки до конца', when: not(merleFarm39), minutes: 45, terminal: true, goto: 'c39_radio',
        text: 'Имена, имена, имена. Под конец — «Brockmann, Thomas, Toronto, sucht…» Ищет. Ты вздрагиваешь. Это ответ на ваше письмо или новый запрос — не понять.', effects: [set39('bm2', 'listen'), w39('thomas_heard', true), until39(42, 16, 0)] },
    ] }),
];

