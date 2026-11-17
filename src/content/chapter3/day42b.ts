import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { brothersCome } from './point33';
import { pens39 } from './point39';
import {
  S42, farm42, fri42, hansenDead42, hansenHere42, henrike42, jorgStays42, merle42, nina42, parents42, set42, thu42, tree42,
  until42, vet42, w42,
} from './point42';

// Участок 42, линия B. Четверг: Мерле и счёт инсулина (или Нина, или Хенрике), выпечка, разговор наедине, школа в Винзене, звёзды
// из соломы, Уте и приглашение, Ханзены, Лея (письмо) или открытки, свечи. Пятница: Мерле без ужина (или замёрзший колодец),
// тетрадь понедельников Хенрике, дорога, Бары или Юлиан у переезда, подарок, портрет или велосипед Нины, баня, гости на адвент.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S42({ ...scene, for: 'any', chapter: 'ch3' });
const petersFarm: Cond = v('w.c40_peters', 'farm');
const leaGone42: Cond = flag('w.c41_lea_gone');
const leaHome42: Cond = all({ npc: 'c21_lea', alive: true, at: farm42 }, not(leaGone42));
const visit = (x: string): Cond => v('w.c42_visit', x);
const bahr: Cond = any(visit('bahr'), visit('both'));
const lars: Cond = any(visit('lars'), visit('both'));
const withHenrike: Cond = flag('$.c42_with_henrike');

export const day42BScenes: Scene[] = [
  // ═════════════ Четверг ═════════════
  X({ id: 'c42_b_count', title: 'Счёт', camp: kitchen14,
    text: [
      { when: merle42, text: 'Мерле сидит на кровати с блокнотом. Ручки инсулина лежат перед ней в ряд. Она считает третий раз.' },
      { when: all(merle42, pens39(4)), text: 'Ручек из синей сумки хватит на несколько недель. Мерле всё равно считает: привычка.' },
      { when: all(merle42, not(pens39(4))), text: 'До Нового года хватит. Дальше — нет.' },
      { when: all(merle42, any(vet42('both'), vet42('one'))), text: 'В субботу — Винзен, ветклиника. В блокноте её почерком: «U-40? Spritzen? Wie viel Einheiten?» У-40? Шприцы? Сколько единиц?' },
      { when: all(merle42, vet42('no')), text: 'В Винзен решили пока не ехать. Мерле ничего не сказала. Только стала считать чаще.' },
      { when: all(not(merle42), nina42), text: 'Нина сидит у печи и штопает варежку. Иголка всё время выскальзывает из пальцев.' },
      { when: all(not(merle42), not(nina42)), text: 'Хенрике пишет на обороте календаря список к Рождеству. Список короткий.' },
    ],
    actions: [
      { id: 'c42_bc_count', label: 'Посчитать вместе с Мерле', when: merle42, minutes: 40, terminal: true, goto: 'c42_b_bake',
        text: 'Единицы, дни, ручки. Ты пишешь, Мерле проверяет. Цифра выходит та же, что у неё. Она закрывает блокнот.\n\n— Okay. Dann ist das so.\n\nЛадно. Значит, так.', effects: [set42('bc', 'count'), npc('merle', 1), until42(47, 8, 20)] },
      { id: 'c42_bc_food', label: 'Спросить, что ей есть, чтобы растянуть инсулин', when: merle42, minutes: 40, terminal: true, goto: 'c42_b_bake',
        text: 'Меньше хлеба, больше капусты, яйца, мясо, если есть. Мерле говорит это Хенрике сама. Хенрике кивает и откладывает в сторону два яйца. Каждый день, говорит она.', effects: [set42('bc', 'food'), w42('merle_diet', true), until42(47, 8, 20)] },
      { id: 'c42_bc_draw', label: 'Спросить про её рисунки', when: merle42, minutes: 40, terminal: true, goto: 'c42_b_bake',
        text: 'Блокнот почти весь изрисован: кухня, Хенрике, дети у печи, двор.\n\n— Für Weihnachten. Für jeden ein Bild.\n\nНа Рождество. Каждому по рисунку.\n\nТвой она не показывает.', effects: [set42('bc', 'draw'), until42(47, 8, 20)] },
      { id: 'c42_bc_mitten', label: 'Показать Нине, как штопать', when: all(not(merle42), nina42), minutes: 40, terminal: true, goto: 'c42_b_bake',
        text: 'Грибок из перегоревшей лампочки, нитка в два сложения. Нина повторяет за тобой, хмурясь. Дырка закрывается. «Das konnte ich nie». У меня так никогда не получалось.', effects: [set42('bc', 'mitten'), npc('c7_nina', 1), until42(47, 8, 20)] },
      { id: 'c42_bc_list', label: 'Помочь Хенрике со списком', when: all(not(merle42), not(nina42)), minutes: 40, terminal: true, goto: 'c42_b_bake',
        text: 'Свечи, курица, мука, яблоки. Хенрике вычёркивает то, чего нет, и пишет рядом, чем заменить. Список остаётся таким же длинным.', effects: [set42('bc', 'list'), until42(47, 8, 20)] },
      { id: 'c42_bc_tea', label: 'Принести всем чаю и уйти к делам', minutes: 30, terminal: true, goto: 'c42_b_bake',
        text: 'Кружки на поднос, по кружке каждому. Спасибо говорят все, даже те, кто обычно молчит.', effects: [set42('bc', 'tea'), until42(47, 8, 10)] },
      { id: 'c42_bc_stove', label: 'Растопить печь наверху, пока все внизу', minutes: 30, terminal: true, goto: 'c42_b_bake',
        text: 'Сухие поленья, растопка, спичка. Через полчаса наверху можно сидеть без куртки, и туда сразу перебирается кто-то с книгой.', effects: [set42('bc', 'stove'), until42(47, 8, 10)] },
    ] }),

  X({ id: 'c42_b_bake', title: 'Тесто', camp: kitchen14,
    text: [
      { when: tree42, text: 'Хенрике достаёт формочки для печенья: звёзды, сердца, ёлки. Муки мало, масла ещё меньше, сахара полбанки.' },
      { when: not(tree42), text: 'Хенрике печёт хлеб. Обычный, на неделю. Формочки для печенья лежат в ящике, она их не достаёт.' },
      { when: petersFarm, text: 'Фрау Петерс закатывает рукава: «Ich kann Kipferl. Auch ohne Butter». Я умею рогалики. Даже без масла.' },
    ],
    actions: [
      { id: 'c42_bb_stars', label: 'Печь звёзды для детей', when: tree42, minutes: 60, terminal: true, goto: 'c42_b_talk',
        text: 'Тонкое тесто, формочки, противень. Детей отгоняют от плиты каждые пять минут. К десяти банка полная, половина звёзд подгорела с одного края. Их съедают первыми.', effects: [set42('bb', 'stars'), w42('cookies', true), until42(47, 9, 30)] },
      { id: 'c42_bb_peters', label: 'Учиться у фрау Петерс', when: petersFarm, minutes: 60, terminal: true, goto: 'c42_b_talk',
        text: 'Рогалики на смальце, «wie im Krieg», как в войну, говорит она. Пальцы у неё кривые от артрита и быстрые. Получается почти как настоящее.', effects: [set42('bb', 'peters'), w42('cookies', true), until42(47, 9, 30)] },
      { id: 'c42_bb_save', label: 'Уговорить отложить муку на хлеб', minutes: 60, terminal: true, goto: 'c42_b_talk',
        text: 'Хенрике соглашается: хлеб важнее. Печенья будет одна маленькая партия, для детей. Ты месишь хлебное тесто, пока не начинают болеть запястья.', effects: [set42('bb', 'save'), until42(47, 9, 30)] },
      { id: 'c42_bb_bread', label: 'Месить хлеб с Хенрике', when: not(tree42), minutes: 60, terminal: true, goto: 'c42_b_talk',
        text: 'Вы месите в четыре руки. Хенрике говорит, что в детстве на Рождество пекли штоллен на всю деревню. «Und jetzt Brot. Ist auch gut». А теперь хлеб. Тоже хорошо.', effects: [set42('bb', 'bread'), npc('henrike', 1), until42(47, 9, 30)] },
      { id: 'c42_bb_kids', label: 'Позвать детей месить и лепить', minutes: 60, terminal: true, goto: 'c42_b_talk',
        text: 'Мука на полу, на носах, на рукавах. Дети лепят кривые звёзды и свои инициалы. Хенрике делает вид, что сердится.', effects: [set42('bb', 'kids'), until42(47, 9, 30)] },
    ] }),

  X({ id: 'c42_b_talk', title: 'Наедине', camp: house14,
    text: [
      { when: merle42, text: 'Мерле зовёт тебя на чердак, где теперь стоит её кровать, и закрывает дверь.\n\n— Wenn es ausgeht… ich will nicht, dass die Kinder das sehen.\n\nЕсли кончится… я не хочу, чтобы дети это видели.' },
      { when: merle42, text: 'Она знает, как это бывает: сначала жажда, потом рвота, потом сон, из которого не будят. Диабет у неё с девяти лет.' },
      { when: all(not(merle42), nina42), text: 'Нина сидит на лестнице. Когда ты проходишь, она спрашивает:\n\n— Wird es irgendwann wieder wie vorher?\n\nКогда-нибудь будет как раньше? Не сейчас. Когда-нибудь.' },
      { when: all(not(merle42), not(nina42)), text: 'Хенрике садится напротив и вытирает руки о фартук.\n\n— Im Frühjahr müssen wir säen. Wer bleibt?\n\nВесной надо сеять. Кто останется?' },
    ],
    actions: [
      { id: 'c42_bt_promise', label: 'Пообещать: если что, ты отвезёшь её в Люнебург, в больницу', when: merle42, minutes: 60, terminal: true, goto: 'c42_b_school',
        text: '— Versprochen?\n\nОбещаешь?\n\nТы обещаешь. Работает ли больница в Люнебурге, неизвестно. Вы {m:оба|обе} это знаете.', effects: [set42('bt', 'promise'), w42('merle_promise', true), npc('merle', 2), until42(47, 10, 30)] },
      { id: 'c42_bt_fight', label: 'Сказать: до этого не дойдёт, найдём инсулин', when: merle42, minutes: 60, terminal: true, goto: 'c42_b_school',
        text: '— Und wenn nicht?\n\nА если нет?\n\nТы говоришь: тогда ещё раз, и ещё. Мерле смотрит на тебя, как на ребёнка. Потом обнимает. «Okay. Du bist für den Optimismus zuständig». Ладно. Оптимизм — по твоей части.', effects: [set42('bt', 'fight'), npc('merle', 1), until42(47, 10, 30)] },
      { id: 'c42_bt_listen', label: 'Выслушать, ничего не обещая', when: merle42, minutes: 60, terminal: true, goto: 'c42_b_school',
        text: 'Она говорит долго: про маму, про школу, про то, что всегда боялась не смерти, а больниц. Ты слушаешь. Потом она вытирает лицо рукавом.\n\n— Danke, dass du nichts gesagt hast.\n\nСпасибо, что ничего не сказал{m:|а}.', effects: [set42('bt', 'listen'), npc('merle', 2), until42(47, 10, 30)] },
      { id: 'c42_bt_yes', label: 'Сказать Нине: да, когда-нибудь будет', when: all(not(merle42), nina42), minutes: 60, terminal: true, goto: 'c42_b_school',
        text: 'Нина кивает и смотрит на тебя, проверяя, веришь ли ты сам{m:|а}. Ты выдерживаешь взгляд. Она уходит наверх, и через минуту оттуда слышно, как она что-то напевает.', effects: [set42('bt', 'yes'), npc('c7_nina', 1), until42(47, 10, 30)] },
      { id: 'c42_bt_true', label: 'Сказать честно: как раньше не будет, но жить будем', when: all(not(merle42), nina42), minutes: 60, terminal: true, goto: 'c42_b_school',
        text: 'Нина долго молчит. Потом говорит: «Gut. Dann weiß ich das». Хорошо. Теперь я знаю. И спрашивает, можно ли ей помогать тебе с аптечкой.', effects: [set42('bt', 'true'), npc('c7_nina', 2), until42(47, 10, 30)] },
      { id: 'c42_bt_stay', label: 'Сказать Хенрике: мы останемся до весны', when: all(not(merle42), not(nina42)), minutes: 60, terminal: true, goto: 'c42_b_school',
        text: 'Хенрике кивает, как будто подписала договор. Потом достаёт из ящика пакет с семенами и раскладывает его на столе: морковь, свёкла, лук. «Dann planen wir». Тогда планируем.', effects: [set42('bt', 'stay'), npc('henrike', 2), until42(47, 10, 30)] },
      { id: 'c42_bt_unsure', label: 'Сказать честно: пока не знаем', when: all(not(merle42), not(nina42)), minutes: 60, terminal: true, goto: 'c42_b_school',
        text: 'Хенрике не обижается. «Ehrlich ist besser». Честно — лучше. Но пакет с семенами она так и не достаёт.', effects: [set42('bt', 'unsure'), until42(47, 10, 30)] },
      { id: 'c42_bt_hug', label: 'Обнять и ничего не говорить', when: not(merle42), minutes: 60, terminal: true, goto: 'c42_b_school',
        text: 'Ты обнимаешь, крепко, и молчишь. Слов не нужно. Через минуту тебя отпускают первыми.', effects: [set42('bt', 'hug'), until42(47, 10, 30)] },
    ] }),

  X({ id: 'c42_b_school', title: 'Школа', camp: kitchen14,
    text: [
      { when: nina42, text: 'Утром Лукас сказал у ворот: с четвёртого января в Винзене откроют школу для детей округа. С ночёвкой, автобус по понедельникам. Нина с тех пор ходит за тобой из комнаты в комнату.' },
      { when: nina42, text: '— Ich war in der Neunten. Ich will nicht sitzenbleiben, nur weil die Welt untergeht.\n\nЯ была в девятом. Не хочу остаться на второй год только потому, что мир кончился.' },
      { when: all(not(nina42), jorgStays42), text: 'Дети Йорга сидят за кухонным столом без дела. Старший спрашивает, будет ли школа.' },
      { when: all(not(nina42), not(jorgStays42)), text: 'Соседские дети, которых Уте днём присылает посидеть в тепле, сидят за столом без дела.' },
    ],
    actions: [
      { id: 'c42_bs_for', label: 'Пообещать Нине поговорить со всеми, чтобы её отпустили', when: nina42, minutes: 45, terminal: true, goto: 'c42_b_cards',
        text: 'Нина сжимает тебе руку, сильно. Потом убегает наверх, и слышно, как она вытряхивает из рюкзака учебники.', effects: [set42('bs', 'for'), w42('school_known', true), w42('nina_school', 'for'), npc('c7_nina', 2), until42(47, 11, 15)] },
      { id: 'c42_bs_wait', label: 'Сказать: сначала Рождество, потом решим вместе', when: nina42, minutes: 45, terminal: true, goto: 'c42_b_cards',
        text: 'Нина кивает слишком быстро. «Klar». Ясно. Ты понимаешь: теперь она будет ждать каждого разговора.', effects: [set42('bs', 'wait'), w42('school_known', true), until42(47, 11, 15)] },
      { id: 'c42_bs_math', label: 'Позаниматься с ней математикой прямо сейчас', when: nina42, minutes: 45, terminal: true, goto: 'c42_b_cards',
        text: 'Учебник за девятый класс, задачи на проценты. Ты помнишь больше, чем думал{m:|а}. Нина решает быстрее тебя и делает вид, что нет.', effects: [set42('bs', 'math'), w42('school_known', true), npc('c7_nina', 1), until42(47, 11, 15)] },
      { id: 'c42_bs_letters', label: 'Позаниматься с детьми: буквы и счёт', when: not(nina42), minutes: 45, terminal: true, goto: 'c42_b_cards',
        text: 'Мел, вместо доски — крышка от бочки. Младший пишет своё имя и показывает всем по очереди. Старший делает вид, что ему скучно, и решает всё.', effects: [set42('bs', 'letters'), until42(47, 11, 15)] },
      { id: 'c42_bs_beans', label: 'Дать им задачи с фасолью', when: not(nina42), minutes: 45, terminal: true, goto: 'c42_b_cards',
        text: 'Семь фасолин, отнять три. Двенадцать поделить на четверых. Фасоль катается по столу. Через полчаса считают все, даже Хенрике, проходя мимо.', effects: [set42('bs', 'beans'), until42(47, 11, 15)] },
    ] }),

  X({ id: 'c42_b_cards', title: 'Солома и бумага', camp: kitchen14,
    text: [
      { when: tree42, text: 'Солома из сарая, ножницы, белые нитки. Хенрике показывает, как вязать соломенную звезду: восемь лучей, перевязать в середине, распушить.' },
      { when: not(tree42), text: 'Хенрике достаёт мешок с обрезками бумаги. Не для Рождества, говорит она. Чтобы у детей были заняты руки.' },
    ],
    actions: [
      { id: 'c42_bcd_stars', label: 'Вязать звёзды с детьми', minutes: 60, terminal: true, goto: 'c42_lunch',
        text: 'Звёзды выходят кривые, каждая следующая лучше предыдущей. Самый маленький вяжет, придерживая нитку зубами. К обеду их двадцать.', effects: [set42('bcd', 'stars'), w42('stars', true), until42(47, 12, 30)] },
      { id: 'c42_bcd_cards', label: 'Делать открытки соседям и тем, кто в пункте', minutes: 60, terminal: true, goto: 'c42_lunch',
        text: 'Цветные карандаши, картон от коробок, «Frohe Weihnachten» печатными буквами. Шесть открыток: Уте, Ханзенам, Брандту, доктору Зандер, Кёлер и ещё одна, пока без имени.', effects: [set42('bcd', 'cards'), w42('cards', true), until42(47, 12, 30)] },
      { id: 'c42_bcd_chain', label: 'Клеить бумажную цепь через всю кухню', minutes: 60, terminal: true, goto: 'c42_lunch',
        text: 'Клей из муки и воды, полоски бумаги. Цепь растёт от плиты к двери, потом к окну. Хенрике ворчит, что мука, и сама подаёт полоски.', effects: [set42('bcd', 'chain'), until42(47, 12, 30)] },
    ] }),

  X({ id: 'c42_b_ute', title: 'Колония', camp: yard14, ambient: thu42,
    text: [
      { text: 'После обеда ты идёшь в колонию к Уте, через мокрое поле, по доскам, брошенным на грязь.' },
      { text: 'Уте укрывает грядки соломой. Увидев тебя, вытирает руки о штаны.\n\n— Weihnachten. Ihr kommt doch? Am ersten Feiertag, mittags. Ich habe noch ein Huhn.\n\nРождество. Вы ведь придёте? В первый день праздника, к обеду. У меня ещё есть курица.' },
      { when: flag('w.c41_ute_xmas'), text: 'Она уже звала через Яннеса. Теперь хочет услышать ответ.' },
    ],
    actions: [
      { id: 'c42_bu_yes', label: 'Сказать: придём', minutes: 45, terminal: true, goto: 'c42_b_hansen', ambientDuring: thu42,
        text: 'Уте кивает, будто иначе и быть не могло. Даёт тебе с собой банку гусиного жира: «Für die Kartoffeln». Для картошки.', effects: [set42('bu', 'yes'), w42('ute', 'go'), npc('c14_ute', 1), until42(47, 14, 15)] },
      { id: 'c42_bu_invite', label: 'Позвать её к вам: у вас дом больше', minutes: 45, terminal: true, goto: 'c42_b_hansen', ambientDuring: thu42,
        text: 'Уте думает. «Dann bringe ich das Huhn». Тогда я принесу курицу. Договорились.', effects: [set42('bu', 'invite'), w42('ute', 'invite'), npc('c14_ute', 1), until42(47, 14, 15)] },
      { id: 'c42_bu_both', label: 'Предложить: сочельник у вас, первый день у неё', minutes: 45, terminal: true, goto: 'c42_b_hansen', ambientDuring: thu42,
        text: 'Уте смеётся. «Wie eine richtige Familie». Как настоящая семья. И пишет на клочке бумаги: 24 — bei euch, 25 — bei mir.', effects: [set42('bu', 'both'), w42('ute', 'both'), npc('c14_ute', 2), until42(47, 14, 15)] },
      { id: 'c42_bu_help', label: 'Помочь с соломой и расспросить про колонию', minutes: 45, activity: 'moderate', terminal: true, goto: 'c42_b_hansen', ambientDuring: thu42,
        text: 'Вы укрываете грядки. Уте рассказывает про колонию до ноября: шашлыки, споры о заборах, кто чей кот. «Jetzt streitet keiner mehr». Теперь никто не спорит. Про Рождество она больше не спрашивает: ждёт.', effects: [set42('bu', 'help'), until42(47, 14, 15)] },
    ] }),

  X({ id: 'c42_b_hansen', title: 'Ханзены', camp: yard14, ambient: thu42,
    text: [
      { when: hansenDead42, text: 'На обратном пути ты заходишь к фрау Ханзен. Она сидит на кухне в пальто: печь не топлена.' },
      { when: all(not(hansenDead42), hansenHere42), text: 'Дома старик Ханзен зовёт тебя в комнату стариков. У него дело.\n\n— Meine Frau hat am Sonntag Geburtstag. Ich habe nichts für sie.\n\nУ жены в воскресенье день рождения. У меня для неё ничего нет.' },
      { when: all(not(hansenDead42), not(hansenHere42)), text: 'На обратном пути ты заходишь к Ханзенам. Старик в кровати, фрау Ханзен штопает у окна. Пахнет лекарством и яблоками.' },
    ],
    actions: [
      { id: 'c42_bh_stove', label: 'Растопить ей печь и показать, как', when: hansenDead42, minutes: 60, activity: 'moderate', terminal: true, goto: 'c42_b_lea',
        text: 'Сухие поленья, растопка, спичка. Через полчаса на кухне тепло. Фрау Ханзен снимает пальто. «Er hat immer Feuer gemacht». Печь всегда топил он. Ты показываешь ей, как, медленно, два раза.', effects: [set42('bh', 'stove'), until42(47, 15, 30)] },
      { id: 'c42_bh_invite', label: 'Позвать её к вам на Рождество', when: hansenDead42, minutes: 60, terminal: true, goto: 'c42_b_lea',
        text: 'Она долго молчит. Потом: «Nur wenn ich etwas mitbringen darf». Только если можно что-то принести. Ты говоришь: можно.', effects: [set42('bh', 'invite'), w42('hansen_invited', true), until42(47, 15, 30)] },
      { id: 'c42_bh_frame', label: 'Помочь ему с подарком для жены', when: all(not(hansenDead42), hansenHere42), minutes: 60, terminal: true, goto: 'c42_b_lea',
        text: 'Вы вдвоём перебираете его вещи: часы без ремешка, свадебная фотография в треснувшей рамке. Ты склеиваешь рамку столярным клеем. Он заворачивает её в газету, руки трясутся.', effects: [set42('bh', 'frame'), w42('hansen_gift', true), until42(47, 15, 30)] },
      { id: 'c42_bh_story', label: 'Попросить рассказать, как они познакомились', when: all(not(hansenDead42), hansenHere42), minutes: 60, terminal: true, goto: 'c42_b_lea',
        text: 'Танцы в Ханштедте, шестьдесят третий год. Она наступила ему на ногу и не извинилась. «Da wusste ich es». Тут я и понял. Он смеётся и кашляет одновременно.', effects: [set42('bh', 'story'), until42(47, 15, 30)] },
      { id: 'c42_bh_med', label: 'Послушать старику лёгкие и оставить лекарство', when: all(not(hansenDead42), not(hansenHere42)), minutes: 60, terminal: true, goto: 'c42_b_lea',
        text: 'Хрипов меньше, жара нет. Ты оставляешь жаропонижающее на всякий случай и объясняешь фрау Ханзен, когда давать. Она записывает на обороте конверта.', effects: [set42('bh', 'med'), until42(47, 15, 30)] },
      { id: 'c42_bh_sit', label: 'Посидеть с фрау Ханзен у окна', when: all(not(hansenDead42), not(hansenHere42)), minutes: 60, terminal: true, goto: 'c42_b_lea',
        text: 'Она штопает, ты держишь моток. Она рассказывает про внуков в Бремене, от которых ничего с ноября. Потом замолкает, и вы просто сидите.', effects: [set42('bh', 'sit'), until42(47, 15, 30)] },
      { id: 'c42_bh_card', label: 'Оставить им открытку и горсть печенья', minutes: 60, terminal: true, goto: 'c42_b_lea',
        text: 'Открытка с кривой звездой, печенье в бумаге. Фрау Ханзен ставит открытку на буфет, на самое видное место.', effects: [set42('bh', 'card'), until42(47, 15, 30)] },
    ] }),

  X({ id: 'c42_b_lea', title: 'Письма', camp: kitchen14,
    text: [
      { when: leaGone42, text: 'Дома на твоей подушке письмо. Почерк Леи, мелкий, с наклоном. Его передал Лукас: Лея оставила письмо в пожарной части, когда уходила.' },
      { when: leaGone42, text: '«…Wenn ich sie finde, komme ich im Frühjahr mit ihnen. Wenn nicht, komme ich allein. Danke, dass ihr mich nicht verraten habt.»\n\n«…Если найду их, весной приду с ними. Если нет — приду одна. Спасибо, что вы меня не выдали».' },
      { when: leaHome42, text: 'Лея сидит на крыльце и курит. Её рюкзак так и стоит у двери: она его не распаковывает.' },
      { when: all(not(leaGone42), not(leaHome42)), text: 'Дома тихо. На столе бумага и карандаш. Можно написать тем, кого нет рядом.' },
    ],
    actions: [
      { id: 'c42_bl_answer', label: 'Написать Лее ответ и отдать Лукасу: вдруг догонит', when: leaGone42, minutes: 45, terminal: true, goto: 'c42_b_dusk',
        text: 'Полстраницы. Что вы её ждёте. Что её место за столом никто не занял. Что весной нужны руки. Лукас обещает отдать водителю, который ездит на Целле.', effects: [set42('bl', 'answer'), w42('lea_letter', true), until42(47, 16, 30)] },
      { id: 'c42_bl_keep', label: 'Спрятать письмо в свою тетрадь', when: leaGone42, minutes: 30, terminal: true, goto: 'c42_b_dusk',
        text: 'Ты кладёшь письмо между страницами, где записаны все, кого не стало. Сюда оно не подходит. Ты перекладываешь его в начало.', effects: [set42('bl', 'keep'), until42(47, 16, 15)] },
      { id: 'c42_bl_sit', label: 'Сесть рядом с Леей', when: leaHome42, minutes: 45, terminal: true, goto: 'c42_b_dusk', ambientDuring: thu42,
        text: 'Лея рассказывает, как дома на Рождество мама пекла пряники, а Финн съедал глазурь, пока никто не видит. Потом замолкает. «Im Frühjahr», — говорит она. Весной. Ты не спрашиваешь, что весной.', effects: [set42('bl', 'sit'), npc('c21_lea', 1), until42(47, 16, 30)] },
      { id: 'c42_bl_unpack', label: 'Сказать: распакуй рюкзак, ты дома', when: leaHome42, minutes: 45, terminal: true, goto: 'c42_b_dusk', ambientDuring: thu42,
        text: 'Лея смотрит на тебя долго. Потом несёт рюкзак наверх. Вечером на гвозде у её кровати висит куртка, а на подоконнике стоит фотография: женщина и мальчик на велосипеде.', effects: [set42('bl', 'unpack'), w42('lea_unpacked', true), npc('c21_lea', 2), until42(47, 16, 30)] },
      { id: 'c42_bl_koehler', label: 'Написать открытку Кёлер в пункт', when: all(not(leaGone42), not(leaHome42)), minutes: 45, terminal: true, goto: 'c42_b_dusk',
        text: 'Ты пишешь коротко: живы, хутор держится, спасибо за всё с ноября. Открытку отнесёт Лукас в понедельник.', effects: [set42('bl', 'koehler'), until42(47, 16, 30)] },
      { id: 'c42_bl_diary', label: 'Записать в тетрадь этот день', when: all(not(leaGone42), not(leaHome42)), minutes: 45, terminal: true, goto: 'c42_b_dusk',
        text: '«17 декабря. Печенье. Звёзды. Уте зовёт на Рождество». Первая запись за месяц, в которой никто не умер.', effects: [set42('bl', 'diary'), until42(47, 16, 30)] },
      { id: 'c42_bl_window', label: 'Посидеть с письмом у окна, ничего не делая', minutes: 45, terminal: true, goto: 'c42_b_dusk',
        text: 'Поле, лесополоса, дым над колонией. Бумага лежит на коленях. Полчаса ты просто сидишь, и никто тебя не трогает.', effects: [set42('bl', 'window'), until42(47, 16, 30)] },
    ] }),

  X({ id: 'c42_b_dusk', title: 'Свечи', camp: kitchen14,
    text: [
      { text: 'Сумерки. Хенрике ставит на подоконник свечу, как вчера. Рядом ещё две: кто-то добавляет каждый вечер.' },
    ],
    actions: [
      { id: 'c42_bd_light', label: 'Зажечь ещё одну', minutes: 30, terminal: true, goto: 'c42_thu_eve',
        text: 'Четыре огонька на подоконнике. С дороги их видно, наверное, до самой колонии.', effects: [set42('bd', 'light'), until42(47, 17, 0)] },
      { id: 'c42_bd_ask', label: 'Спросить Хенрике, для кого её свеча', when: henrike42, minutes: 45, terminal: true, goto: 'c42_thu_eve',
        text: 'Хенрике молчит. Потом:\n\n— Für die, die ich montags gefüttert habe. Und nicht mehr füttern kann.\n\nДля тех, кого я кормила по понедельникам. И больше не могу.\n\nОна достаёт из ящика тетрадь в клеёнке и кладёт обратно. «Morgen. Morgen zeige ich dir». Завтра покажу.', effects: [set42('bd', 'ask'), w42('notebook_hint', true), until42(47, 17, 15)] },
      { id: 'c42_bd_kids', label: 'Позвать детей посмотреть на огоньки', minutes: 30, terminal: true, goto: 'c42_thu_eve',
        text: 'Дети прилипают к стеклу. Самый маленький считает свечи, сбивается и начинает снова. Пусть считает.', effects: [set42('bd', 'kids'), until42(47, 17, 0)] },
    ] }),

  // ═════════════ Пятница ═════════════
  X({ id: 'c42_b_night', title: 'Чердак', camp: house14,
    text: [
      { when: merle42, text: 'Мерле не спустилась к завтраку. Ты поднимаешься на чердак. Она сидит на кровати мокрая от пота, руки трясутся. Говорит медленно, путает слова.' },
      { when: merle42, text: 'На табурете нетронутая тарелка со вчерашнего ужина. Второй раз за неделю.' },
      { when: not(merle42), text: 'Колодец за ночь затянуло льдом. Хенрике стоит над ним с ведром и ломом и не знает, с какой стороны начать.' },
    ],
    actions: [
      { id: 'c42_bn_sugar', label: 'Сахар в воде, сразу, и сидеть рядом, пока не отпустит', when: merle42, minutes: 30, terminal: true, goto: 'c42_b_portion',
        text: 'Три ложки сахара в кружке. Она пьёт с твоей помощью и проливает половину. Через десять минут руки перестают дрожать. Через двадцать она говорит: «Scheiße». Значит, ей лучше.', effects: [set42('bn', 'sugar'), w42('merle_low', true), until42(48, 7, 40)] },
      { id: 'c42_bn_juice', label: 'Достать сок из её рюкзака: тот, что на чёрный день', when: merle42, minutes: 30, terminal: true, goto: 'c42_b_portion',
        text: 'Банка сока на самом дне рюкзака. Чёрный день — сегодня. Мерле пьёт, закрыв глаза. Через четверть часа узнаёт тебя по имени.', effects: [set42('bn', 'juice'), w42('merle_low', true), until42(48, 7, 40)] },
      { id: 'c42_bn_birgit', label: 'Позвать Биргит', when: parents42, minutes: 30, terminal: true, goto: 'c42_b_portion',
        text: 'Биргит прибегает с сахаром в кулаке. Делает всё быстро: руки помнят. Потом садится на пол у кровати и плачет, тихо, чтобы Мерле не видела.', effects: [set42('bn', 'birgit'), w42('merle_low', true), until42(48, 7, 40)] },
      { id: 'c42_bn_ice', label: 'Сколоть лёд вместе с Хенрике', when: not(merle42), minutes: 30, activity: 'moderate', terminal: true, goto: 'c42_b_notebook', ambientDuring: fri42,
        text: 'Лом, удар, ещё удар. Лёд толстый, в палец. Ведро уходит вниз с плеском. Хенрике держит верёвку и кивает тебе: «Danke. Ich wollte dich was fragen». Спасибо. Я хотела тебя кое о чём спросить.', effects: [set42('bn', 'ice'), until42(48, 7, 40)] },
      { id: 'c42_bn_kettle', label: 'Принести с плиты кипятку и растопить лёд', when: not(merle42), minutes: 30, terminal: true, goto: 'c42_b_notebook', ambientDuring: fri42,
        text: 'Чайник кипятку в лунку. Лёд шипит и проседает. Хенрике смеётся: «Klug». Умно. Потом говорит, что хотела тебя кое о чём спросить.', effects: [set42('bn', 'kettle'), until42(48, 7, 40)] },
      { id: 'c42_bn_stay', label: 'Сесть рядом и ждать, держа за руку', when: merle42, minutes: 30, terminal: true, goto: 'c42_b_notebook',
        text: 'Ты сидишь рядом и не уходишь. Потом приносишь сахар. Потом снова сидишь. Мерле приходит в себя медленнее, чем могла бы, но приходит.', effects: [set42('bn', 'stay'), until42(48, 7, 40)] },
      { id: 'c42_bn_well', label: 'Набрать воды из бочки под водостоком', when: not(merle42), minutes: 30, terminal: true, goto: 'c42_b_notebook',
        text: 'Бочка под желобом тоже замёрзла сверху, но тонко. Ты пробиваешь корку кулаком и набираешь два ведра. Хенрике смотрит и смеётся: «So geht das auch». И так можно.', effects: [set42('bn', 'well'), until42(48, 7, 40)] },
    ] }),

  X({ id: 'c42_b_portion', title: 'Порция', camp: house14,
    text: [
      { text: 'Мерле лежит, укрытая до подбородка.\n\n— Sag Henrike nichts. Bitte. Die Kinder brauchen das mehr.\n\nНе говори Хенрике. Пожалуйста. Детям нужнее.' },
      { text: 'Вчера она отдала свой ужин. С инсулином так нельзя: доза уже в крови, а есть нечего.' },
    ],
    actions: [
      { id: 'c42_bp_tell', label: 'Всё равно сказать Хенрике', minutes: 30, terminal: true, goto: 'c42_b_notebook',
        text: 'Хенрике выслушивает и сама поднимается на чердак. Что она говорит Мерле, тебе не слышно. Но к обеду у Мерле своя тарелка, и Хенрике стоит рядом, пока та не доест.', effects: [set42('bp', 'tell'), w42('merle_portion', 'henrike'), until42(48, 8, 10)] },
      { id: 'c42_bp_word', label: 'Промолчать, но взять с неё слово есть', minutes: 30, terminal: true, goto: 'c42_b_notebook',
        text: 'Мерле даёт слово. Ты не уверен{m:|а}, что она его сдержит. Ты решаешь садиться за стол рядом с ней.', effects: [set42('bp', 'word'), w42('merle_portion', 'promise'), npc('merle', 1), until42(48, 8, 10)] },
      { id: 'c42_bp_share', label: 'Сказать: тогда половину своего хлеба буду отдавать тебе', minutes: 30, terminal: true, goto: 'c42_b_notebook',
        text: 'Мерле сердится, потом сдаётся. Половина твоего хлеба теперь её. Так честнее: тебе не надо колоть себе в живот четыре раза в день.', effects: [set42('bp', 'share'), w42('merle_portion', 'share'), npc('merle', 2), until42(48, 8, 10)] },
    ] }),

  X({ id: 'c42_b_notebook', title: 'Понедельники', camp: kitchen14,
    text: [
      { text: 'Хенрике кладёт на стол тетрадь в клеёнчатой обложке.' },
      { when: flag('$.c16_cel_all'), text: 'Ты видел{m:|а} её в подвале в ноябре. «Если меня не будет — продолжайте».' },
      { text: '«Montags». По понедельникам. Двенадцать лет она кормила по понедельникам тех, кому не хватало: одиноких стариков, многодетных, мальчишку обходчика. Против каждого — даты и пометки: «Suppe», «Brot», «Eier».' },
      { text: '— Wer lebt noch? Ich weiß es nicht. Ich habe Angst nachzusehen.\n\nКто ещё жив? Я не знаю. Мне страшно проверять.' },
      { text: 'Три адреса рядом. Кёлер в пункте Йестебурга жива, это вы знаете. Семья Бар у Люллау: мать и двое маленьких. Мальчишка обходчика у переезда, Юлиан, одиннадцать лет, живёт с бабушкой.' },
    ],
    actions: [
      { id: 'c42_bnb_bahr', label: 'Пойти к Барам: там маленькие дети', minutes: 40, terminal: true, goto: 'c42_b_pack',
        text: 'Хенрике кивает. Показывает на карте в тетради: Люллау, последний дом у леса. «Corinna. Und Erik und Mia». Коринна. И Эрик, и Миа.', effects: [set42('bnb', 'bahr'), w42('visit', 'bahr'), until42(48, 8, 50)] },
      { id: 'c42_bnb_lars', label: 'Пойти к Юлиану у переезда', minutes: 40, terminal: true, goto: 'c42_b_pack',
        text: 'Хенрике кивает. «Der Junge hat immer die Schüssel zurückgebracht. Gespült». Мальчишка всегда возвращал миску. Вымытую.', effects: [set42('bnb', 'lars'), w42('visit', 'lars'), until42(48, 8, 50)] },
      { id: 'c42_bnb_both', label: 'Успеть к обоим, пусть и ненадолго', minutes: 40, terminal: true, goto: 'c42_b_pack',
        text: 'Хенрике смотрит на часы, потом на тебя. «Dann schnell». Тогда быстро. Пять километров по кругу, до обеда.', effects: [set42('bnb', 'both'), w42('visit', 'both'), until42(48, 8, 50)] },
      { id: 'c42_bnb_henrike', label: 'Уговорить Хенрике пойти с тобой к Юлиану', when: henrike42, minutes: 40, terminal: true, goto: 'c42_b_pack',
        text: 'Хенрике отказывается. Потом молча снимает фартук. «Wenn er tot ist, will ich es selbst sehen». Если он умер, хочу увидеть сама.', effects: [set42('bnb', 'henrike'), set42('with_henrike', true), w42('visit', 'lars'), npc('henrike', 2), until42(48, 8, 50)] },
    ] }),

  X({ id: 'c42_b_pack', title: 'Корзина', camp: kitchen14,
    text: [
      { text: 'Что взять с собой? Хенрике открывает кладовку и смотрит на тебя: решай.' },
    ],
    actions: [
      { id: 'c42_bpk_soup', label: 'Суп в бидоне, хлеб и яйца', minutes: 30, terminal: true, goto: 'c42_b_road',
        text: 'Бидон, завёрнутый в одеяло, буханка, шесть яиц в шапке. Тяжело, но горячее в мороз — лучше всего.', effects: [set42('bpk', 'soup'), until42(48, 9, 20)] },
      { id: 'c42_bpk_sweet', label: 'Печенье, свечу и хлеб', minutes: 30, terminal: true, goto: 'c42_b_road',
        text: 'Банка печенья или то, что от него осталось, свеча из связки, буханка. Еда и немного праздника.', effects: [set42('bpk', 'sweet'), until42(48, 9, 20)] },
      { id: 'c42_bpk_warm', label: 'Тёплые вещи из сундука Оле и хлеб', minutes: 30, terminal: true, goto: 'c42_b_road',
        text: 'Два детских свитера, шапка, шерстяные носки, буханка. Хенрике сама достаёт из сундука ещё варежки.', effects: [set42('bpk', 'warm'), until42(48, 9, 20)] },
    ] }),

  X({ id: 'c42_b_road', title: 'Дорога', camp: yard14, ambient: fri42,
    text: [
      { when: visit('bahr'), text: 'До Люллау два километра по полевой дороге. Иней хрустит под ногами.' },
      { when: visit('lars'), text: 'До переезда три километра вдоль насыпи. Иней хрустит под ногами.' },
      { when: visit('both'), text: 'Сначала к Барам у Люллау, оттуда вдоль насыпи к переезду. Иней хрустит под ногами.' },
      { when: withHenrike, text: 'Хенрике идёт рядом и молчит.' },
      { when: all(withHenrike, flag('w.c40_henrike_hurt')), text: 'Руку в лубке она держит у груди.' },
      { text: 'На полпути у обочины стоит брошенная машина: двери открыты, внутри иней.' },
    ],
    actions: [
      { id: 'c42_brd_fast', label: 'Пройти мимо быстрым шагом', minutes: 45, activity: 'moderate', terminal: true, goto: 'c42_b_visit', ambientDuring: fri42,
        text: 'Ты идёшь быстро, не глядя на машину. Через десять минут становится жарко, и ты расстёгиваешь куртку.', effects: [set42('brd', 'fast'), until42(48, 10, 15)] },
      { id: 'c42_brd_look', label: 'Заглянуть в машину', minutes: 45, terminal: true, goto: 'c42_b_visit', ambientDuring: fri42,
        text: 'В салоне пусто. Детское кресло, на полу плюшевый заяц с одним глазом. Ты берёшь зайца. {m:Сам|Сама} не знаешь зачем.', effects: [set42('brd', 'look'), set42('hare', true), until42(48, 10, 15)] },
      { id: 'c42_brd_rail', label: 'Идти по насыпи: там суше', minutes: 45, terminal: true, goto: 'c42_b_visit', ambientDuring: fri42,
        text: 'По шпалам идти неудобно, шаг то длинный, то короткий. Зато сухо. Рельсы ржавые: поездов не было с ноября.', effects: [set42('brd', 'rail'), until42(48, 10, 15)] },
    ] }),

  X({ id: 'c42_b_visit', title: 'Дверь', camp: yard14, ambient: fri42,
    onEnter: [{ if: bahr, then: [{ set: '$.met.c42_bahr', value: true }] }, { if: lars, then: [{ set: '$.met.c42_lars', value: true }] }],
    text: [
      { when: bahr, text: 'Дом Баров — последний у Люллау, ставни закрыты. Дверь открывает мальчик лет шести. За ним мать, худая, в двух свитерах, с девочкой на руках.\n\n— Frau Lüdemann schickt Sie? Montags kam sie immer. Dann nicht mehr.\n\nВас прислала фрау Людеман? Она всегда приходила по понедельникам. Потом перестала.' },
      { when: visit('lars'), text: 'Будка обходчика у переезда, из трубы дым. Мальчишка колет дрова колуном больше себя. В окне — бабушка в платке.' },
      { when: all(visit('lars'), not(withHenrike)), text: '— Die Frau mit der Suppe ist tot, oder?\n\nТётя с супом умерла, да?' },
      { when: all(visit('lars'), withHenrike), text: 'Юлиан видит Хенрике и роняет колун. Потом подходит и молча утыкается ей в куртку. Хенрике гладит его по шапке.' },
    ],
    actions: [
      { id: 'c42_bv_mondays', label: 'Отдать всё и сказать: по понедельникам кто-то будет приходить снова', minutes: 30, terminal: true, goto: 'c42_b_visit2', ambientDuring: fri42,
        text: 'Ты не обещаешь суп каждый раз. Обещаешь, что кто-то придёт. На тебя смотрят так, будто это и есть суп.', effects: [set42('bv', 'mondays'), w42('mondays', true), until42(48, 10, 45)] },
      { id: 'c42_bv_invite', label: 'Позвать их на Рождество на хутор', minutes: 30, terminal: true, goto: 'c42_b_visit2', ambientDuring: fri42,
        text: 'Сначала не верят. Потом спрашивают, во сколько. Ты говоришь: в сочельник, к темноте, и что дорогу ты покажешь.', effects: [set42('bv', 'invite'), w42('visit_invited', true), until42(48, 10, 45)] },
      { id: 'c42_bv_need', label: 'Спросить, что им нужнее всего', minutes: 30, terminal: true, goto: 'c42_b_visit2', ambientDuring: fri42,
        outcomes: [
          { id: 'bahr', when: bahr, text: '— Holz. Und dass jemand weiß, dass wir hier sind.\n\nДрова. И чтобы кто-то знал, что мы здесь.\n\nТы записываешь в тетрадь Хенрике: «Bahr — Holz». Первая новая строчка за месяц.', effects: [set42('bv', 'need'), w42('bahr_wood', true), until42(48, 10, 45)] },
          { id: 'lars', text: '— Batterien. Für Omas Hörgerät.\n\nБатарейки. Для бабушкиного слухового аппарата.\n\nТы записываешь в тетрадь Хенрике: «Julian — Batterien, klein, rund». Первая новая строчка за месяц.', effects: [set42('bv', 'need'), w42('lars_batteries', true), until42(48, 10, 45)] },
        ] },
    ] }),

  X({ id: 'c42_b_visit2', title: 'Перед уходом', camp: yard14, ambient: fri42,
    text: [
      { when: bahr, text: 'Эрик дёргает тебя за рукав.\n\n— Kommt der Weihnachtsmann trotzdem? Auch wenn alles kaputt ist?\n\nДед Мороз всё равно придёт? Даже если всё сломалось?' },
      { when: visit('both'), text: 'К переезду ты успеваешь ненадолго. Юлиан колет дрова колуном больше себя и, увидев бидон, роняет колун. Провожая тебя до насыпи, он просит:' },
      { when: visit('lars'), text: 'Юлиан провожает тебя до насыпи. У рельсов он останавливается:' },
      { when: lars, text: '— Kann ich bei euch arbeiten? Für Essen. Oma bleibt hier, die geht nicht weg.\n\nМожно я буду у вас работать? За еду. Бабушка останется здесь, она никуда не уйдёт.' },
    ],
    actions: [
      { id: 'c42_bv2_yes', label: 'Сказать Эрику: придёт обязательно', when: bahr, minutes: 30, terminal: true, goto: 'c42_b_back', ambientDuring: fri42,
        text: 'Эрик кивает очень серьёзно и бежит рассказать сестре. Мать смотрит на тебя поверх его головы. Теперь это и твоё дело.', effects: [set42('bv2', 'yes'), w42('weihnachtsmann', true), until42(48, 11, 15)] },
      { id: 'c42_bv2_instead', label: 'Сказать Эрику: в этом году придёт кто-то вместо него', when: bahr, minutes: 30, terminal: true, goto: 'c42_b_back', ambientDuring: fri42,
        text: 'Эрик думает. «Du?» Ты? Ты пожимаешь плечами. Он принимает это как «да».', effects: [set42('bv2', 'instead'), w42('weihnachtsmann', true), until42(48, 11, 15)] },
      { id: 'c42_bv2_work', label: 'Сказать Юлиану: приходи в понедельник, работа найдётся', when: lars, minutes: 30, terminal: true, goto: 'c42_b_back', ambientDuring: fri42,
        text: 'Юлиан кивает и сразу спрашивает, во сколько. В семь, говоришь ты. Он повторяет: «Sieben». Семь. Как будто записывает.', effects: [set42('bv2', 'work'), w42('lars_work', true), until42(48, 11, 15)] },
      { id: 'c42_bv2_ask', label: 'Сказать Юлиану: спрошу у Хенрике', when: all(lars, not(withHenrike)), minutes: 30, terminal: true, goto: 'c42_b_back', ambientDuring: fri42,
        text: 'Юлиан кивает: взрослые всегда спрашивают у кого-то ещё. Он возвращается к дровам раньше, чем ты успеваешь отойти.', effects: [set42('bv2', 'ask'), until42(48, 11, 15)] },
      { id: 'c42_bv2_hare', label: 'Отдать плюшевого зайца из машины', when: flag('$.c42_hare'), minutes: 30, terminal: true, goto: 'c42_b_back', ambientDuring: fri42,
        text: 'Ты достаёшь зайца из кармана. Его берут осторожно, как живого, и сразу проверяют, на месте ли второй глаз. Глаза нет. Зайца это не портит.', effects: [set42('bv2', 'hare'), until42(48, 11, 15)] },
      { id: 'c42_bv2_list', label: 'Записать в тетрадь Хенрике, что видел{m:|а}', minutes: 30, terminal: true, goto: 'c42_b_back',
        text: 'Ты пишешь коротко: кто живёт, сколько их, что нужно. Под последней строчкой Хенрике ставишь дату. Тетрадь снова в работе.', effects: [set42('bv2', 'list'), until42(48, 11, 15)] },
    ] }),

  X({ id: 'c42_b_back', title: 'Обратно', camp: yard14, ambient: fri42,
    text: [
      { text: 'Обратная дорога. Солнце низкое, тени длинные, хотя ещё нет полудня.' },
      { when: withHenrike, text: 'Хенрике всю дорогу молчит. У ворот хутора она говорит: «Montags. Weiter». По понедельникам. Дальше.' },
    ],
    actions: [
      { id: 'c42_bbk_think', label: 'Идти и думать о тетради', minutes: 60, terminal: true, goto: 'c42_fri_lunch', ambientDuring: fri42,
        text: 'Двенадцать лет по понедельникам. Ты думаешь, сколько таких тетрадей было в округе. И сколько людей, которые не знают, что их кто-то записывал.', effects: [set42('bbk', 'think'), until42(48, 12, 15)] },
      { id: 'c42_bbk_wood', label: 'Собирать по дороге хворост', minutes: 60, activity: 'moderate', terminal: true, goto: 'c42_fri_lunch', ambientDuring: fri42,
        text: 'Сухие ветки вдоль насыпи, вязанка за спиной. Домой ты приходишь с дровами, как будто так и задумывал{m:|а}.', effects: [set42('bbk', 'wood'), until42(48, 12, 15)] },
      { id: 'c42_bbk_rest', label: 'Посидеть пять минут на пне у дороги', minutes: 60, terminal: true, goto: 'c42_fri_lunch', ambientDuring: fri42,
        text: 'Пень сухой, солнце в лицо. Пять минут ни о чём не думать. Потом встать и идти.', effects: [set42('bbk', 'rest'), { body: 'stress', delta: -3 }, until42(48, 12, 15)] },
    ] }),

  X({ id: 'c42_b_gift', title: 'Подарок', camp: kitchen14,
    text: [
      { text: 'До Рождества шесть дней. Магазинов нет. Подарок для {partner.gen} придётся делать {m:самому|самой}.' },
    ],
    actions: [
      { id: 'c42_bgf_socks', label: 'Связать носки из распущенного свитера', minutes: 60, terminal: true, goto: 'c42_b_portrait',
        text: 'Старый свитер распускается легко. Хенрике показывает, как вязать пятку. За час — полноска. Остальное — по вечерам, пока никто не видит.', effects: [set42('bgf', 'socks'), w42('b_gift', 'socks'), until42(48, 14, 15)] },
      { id: 'c42_bgf_drawing', label: 'Попросить Мерле нарисовать вас двоих, а рамку сделать {m:самому|самой}', when: merle42, minutes: 60, terminal: true, goto: 'c42_b_portrait',
        text: 'Мерле соглашается сразу. Пока она рисует по памяти, ты выпиливаешь рамку из планки от ящика и шкуришь углы. Мерле не показывает рисунок до конца.', effects: [set42('bgf', 'drawing'), w42('b_gift', 'drawing'), until42(48, 14, 15)] },
      { id: 'c42_bgf_letter', label: 'Написать письмо: то, что вслух не скажешь', minutes: 60, terminal: true, goto: 'c42_b_portrait',
        text: 'Два листа мелким почерком. Ты складываешь их вчетверо и прячешь в карман рюкзака, где лежат документы.', effects: [set42('bgf', 'letter'), w42('b_gift', 'letter'), until42(48, 14, 15)] },
    ] }),

  X({ id: 'c42_b_portrait', title: 'Час до бани', camp: kitchen14,
    text: [
      { when: merle42, text: 'Мерле сажает тебя у окна: «Stillsitzen. Zwanzig Minuten». Сиди смирно. Двадцать минут. Пока она рисует, можно говорить.' },
      { when: all(not(merle42), nina42), text: 'Нина притащила из сарая свой велосипед. Заднее колесо — восьмёркой с ноября. «Bis Januar muss der fahren». К январю он должен ездить.' },
      { when: all(not(merle42), not(nina42)), text: 'Хенрике чистит подсвечники золой. Их шесть, медные, потемневшие.' },
    ],
    actions: [
      { id: 'c42_bpt_dream', label: 'Спросить, кем она хотела стать', when: merle42, minutes: 60, terminal: true, goto: 'c42_b_bath',
        text: '— Illustratorin. Kinderbücher. — Карандаш не останавливается. — Vielleicht immer noch.\n\nИллюстратором. Детские книги. Может, и сейчас ещё.\n\nОна поворачивает блокнот. Ты на рисунке смотришь в окно, и вид у тебя такой, будто ты чего-то ждёшь.', effects: [set42('bpt', 'dream'), npc('merle', 1), until42(48, 15, 15)] },
      { id: 'c42_bpt_self', label: 'Рассказать ей про себя', when: merle42, minutes: 60, terminal: true, goto: 'c42_b_bath',
        text: 'Ты рассказываешь, где {m:был|была} десятого ноября утром и о чём {m:думал|думала}. Мерле рисует и слушает. На рисунке у тебя оказывается улыбка, которой, тебе кажется, не было.', effects: [set42('bpt', 'self'), npc('merle', 1), until42(48, 15, 15)] },
      { id: 'c42_bpt_wheel', label: 'Выправлять колесо вдвоём', when: all(not(merle42), nina42), minutes: 60, terminal: true, goto: 'c42_b_bath',
        text: 'Колесо в тиски, спицы ключом, по четверти оборота. Нина крутит, ты смотришь, где бьёт. Через час восьмёрка становится почти нулём.', effects: [set42('bpt', 'wheel'), w42('nina_bike', true), npc('c7_nina', 1), until42(48, 15, 15)] },
      { id: 'c42_bpt_ole', label: 'Снять колесо со старого велосипеда Оле', when: all(not(merle42), nina42), minutes: 60, terminal: true, goto: 'c42_b_bath',
        text: 'Велосипед Оле висит в сарае на крюке, ржавый. Колесо целое. Нина ставит его сама, ты только держишь. «Ole merkt das nicht», — говорит она голосом Хенрике.', effects: [set42('bpt', 'ole'), w42('nina_bike', true), until42(48, 15, 15)] },
      { id: 'c42_bpt_brass', label: 'Чистить подсвечники вместе с Хенрике', when: all(not(merle42), not(nina42)), minutes: 60, terminal: true, goto: 'c42_b_bath',
        text: 'Зола, тряпка, руки чёрные до запястий. Медь начинает светиться. Хенрике говорит, что подсвечники были у её бабушки.', effects: [set42('bpt', 'brass'), until42(48, 15, 15)] },
      { id: 'c42_bpt_quiet', label: 'Помолчать и посмотреть в окно', minutes: 45, terminal: true, goto: 'c42_b_bath',
        text: 'Поле, лесополоса, дым над колонией. Солнце садится в начале четвёртого. Ты смотришь, пока не зовут.', effects: [set42('bpt', 'quiet'), { body: 'stress', delta: -3 }, until42(48, 15, 0)] },
    ] }),

  X({ id: 'c42_b_bath', title: 'Банный день', camp: kitchen14,
    text: [
      { text: 'Пятница — банный день. Корыто посреди кухни, котёл на плите, очередь. Хенрике назначает тебя распорядителем: кто за кем.' },
    ],
    actions: [
      { id: 'c42_bba_kids', label: 'Сначала дети, потом старики, потом все', minutes: 75, terminal: true, goto: 'c42_b_guests',
        text: 'Визг, мыло в глазах, полкухни в воде. Дети вылезают красные и сразу к печи. Старикам ты подливаешь кипятку. Тебе достаётся вода после всех, но ещё тёплая.', effects: [set42('bba', 'kids'), until42(48, 16, 30)] },
      { id: 'c42_bba_old', label: 'Сначала старики и Мерле: им холоднее всех', minutes: 75, terminal: true, goto: 'c42_b_guests',
        text: 'Кто-то ворчит, что дети ждут. Ты не уступаешь. Старики выходят из-за занавески розовые и благодарные. Дети моются потом и даже не замечают разницы.', effects: [set42('bba', 'old'), until42(48, 16, 30)] },
      { id: 'c42_bba_last', label: 'Себя — {m:последним|последней}, в остывшую воду', minutes: 75, terminal: true, goto: 'c42_b_guests',
        text: 'Ты сидишь в корыте, когда все уже разошлись. Вода чуть тёплая. За занавеской тикают часы. Это твои десять минут.', effects: [set42('bba', 'last'), { body: 'stress', delta: -4 }, until42(48, 16, 30)] },
    ] }),

  X({ id: 'c42_b_guests', title: 'Завтра адвент', camp: kitchen14,
    text: [
      { text: 'Завтра четвёртый адвент. Хенрике хочет позвать кого-нибудь на кофе с печеньем, по-старому, в три часа. Кого — решать тебе.' },
    ],
    actions: [
      { id: 'c42_bgs_neighbors', label: 'Ханзенов и Уте', minutes: 45, terminal: true, goto: 'c42_fri_eve',
        text: 'Ты пишешь две записки. Хенрике кладёт их в карман фартука: отнесёт утром сама.', effects: [set42('bgs', 'neighbors'), w42('advent_guests', 'neighbors'), until42(48, 17, 30)] },
      { id: 'c42_bgs_brothers', label: 'Братьев Айдын: они у себя одни', when: brothersCome, minutes: 45, terminal: true, goto: 'c42_fri_eve',
        text: 'Хенрике поднимает брови, потом кивает. «Die Jungs essen viel». Мальчики много едят. И ставит в духовку ещё один противень.', effects: [set42('bgs', 'brothers'), w42('advent_guests', 'brothers'), until42(48, 17, 30)] },
      { id: 'c42_bgs_none', label: 'Никого: только свои, все устали', minutes: 45, terminal: true, goto: 'c42_fri_eve',
        text: 'Хенрике не спорит. «Dann für uns». Тогда для нас. Печенье в банке остаётся до завтра.', effects: [set42('bgs', 'none'), w42('advent_guests', 'none'), until42(48, 17, 30)] },
    ] }),
];
