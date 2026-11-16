import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { brothersCome, eldersCome } from './point33';
import { S34, frost34, jest34, lea34, set34, until34, w34 } from './point34';

// Участок 34, третий проход (до уровня 19–20): суббота — братья зовут на чай (A), подарки в сапоги (B); воскресенье — обменный
// рынок у церкви (у каждого свой), поздний вечер (A — слова Тобиаса, B — Лея после списков или радио с Ниной).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S34({ ...scene, for: 'any', chapter: 'ch3' });
const jestCamp = { at: jest34, stock: 'c3_farm_stock', rest: false as const };
const eggs10: Cond = { stocked: 'eggs', qty: 10, at: 'c3_farm_stock' };
const coffee: Cond = { has: 'c33_coffee' };
const owl: Cond = { has: 'c25_owl' };
const socks: Cond = { has: 'c31_socks' };
const heard: Cond = any(flag('w.c34_tobias_warned'), flag('w.c34_heard_new'));

export const day34GScenes: Scene[] = [
  X({ id: 'c34_a_tea', title: 'Чай у насыпи', camp: yard14, ambient: frost34,
    text: [
      { when: brothersCome, text: 'В пятом часу Керем зовёт тебя через забор: у них в пустом дворе у насыпи чай, по-турецки, в стаканчиках, и пахлава из последнего мёда. Дениз сказал: сегодня праздник у немцев, значит, и у них.' },
      { when: not(brothersCome), text: 'В пятом часу Уте машет тебе с дороги: у неё в колонии топится печь и есть чайник. Сегодня Николаус, говорит она, нельзя сидеть по домам поодиночке.' },
      { when: v('w.c34_courier', 'killed'), text: 'Ты долго трёшь руки снегом. Руки чистые. Ты всё равно трёшь.' },
      { when: v('w.c34_courier', 'left'), text: 'Из-за лесополосы, если прислушаться, слышно, как он скребёт лёд. Или тебе так кажется.' },
    ],
    actions: [
      { id: 'c34_at2_go', label: 'Пойти на час', minutes: 40, terminal: true, goto: 'c34_eve',
        text: 'Чай крепкий, сладкий, обжигает пальцы через стекло. Разговор про всё и ни про что: футбол, моторы, кто как жил до. Перед уходом тебе суют в карман два куска пахлавы, завёрнутых в бумагу: «Für die Stiefel». Для сапог.', effects: [set34('at2', 'go'), { if: brothersCome, then: [npc('deniz', 1, 'c34_tea'), npc('kerem', 1)], else: [npc('c14_ute', 1, 'c34_tea')] }, { give: 'c34_sweets' }, until34(35, 17, 0)] },
      { id: 'c34_at2_bring', label: 'Пойти и принести с собой яиц от Хенрике', minutes: 40, terminal: true, goto: 'c34_eve',
        text: 'Хенрике даёт шесть яиц и говорит: «Nicht mit leeren Händen». Не с пустыми руками. Тебя встречают так, будто ты {m:принёс|принесла} золото. Обратно идёшь с полной кружкой чая в руках, расплёскивая на снег.', effects: [set34('at2', 'bring'), { unstock: 'eggs', qty: 6, at: 'c3_farm_stock' }, { if: brothersCome, then: [npc('deniz', 2, 'c34_brought_eggs')], else: [npc('c14_ute', 2, 'c34_brought_eggs')] }, until34(35, 17, 0)] },
      { id: 'c34_at2_no', label: 'Отказаться: дома дела', minutes: 10, terminal: true, goto: 'c34_eve',
        text: 'Тебе машут: в другой раз. Ты смотришь, как в их окне горит свет, и идёшь колоть лучину.', effects: [set34('at2', 'no'), until34(35, 16, 30)] },
    ] }),

  X({ id: 'c34_b_gifts', title: 'Подарки', camp: kitchen14,
    text: [
      { text: 'Пока все заняты, ты перебираешь свои вещи. В сапоги ставят яблоки, это решено. Но можно добавить что-то своё. Немного, но настоящее.' },
      { when: ninaFarm, text: 'Сапог Нины стоит с краю, чуть в стороне от остальных.' },
      { when: eldersCome, text: 'Валенки Петерсена огромные, подшитые кожей на пятках.' },
      { text: 'На столе бумажки, ножницы, огрызки цветных карандашей, найденных у Нины в пенале. Пахнет яблоками и клеем из муки.' },
    ],
    actions: [
      { id: 'c34_bg_owl', label: 'Положить деревянную сову в сапог Нины', when: owl, minutes: 20, terminal: true, goto: 'c34_eve',
        text: 'Сова ложится на дно, клювом вверх. Утром Нина найдёт её раньше яблока.', effects: [set34('bg', 'owl'), { take: 'c25_owl' }, w34('owl_nina', true), npc('c7_nina', 2, 'c34_owl'), until34(35, 17, 0)] },
      { id: 'c34_bg_coffee', label: 'Отдать банку кофе Хенрике: ей одной, утром', when: coffee, minutes: 20, terminal: true, goto: 'c34_eve',
        text: 'Ты ставишь банку у её чашки на полке. Утром по кухне пойдёт запах, которого здесь не было с октября.', effects: [set34('bg', 'coffee'), { take: 'c33_coffee' }, w34('coffee_henrike', true), npc('henrike', 2, 'c34_coffee'), until34(35, 17, 0)] },
      { id: 'c34_bg_socks', label: 'Положить шерстяные носки в валенки Петерсена', when: socks, minutes: 20, terminal: true, goto: 'c34_eve',
        text: 'Носки двойной вязки помещаются в один валенок целиком. Петерсен найдёт их утром и, может быть, даже не поймёт, от кого.', effects: [set34('bg', 'socks'), { take: 'c31_socks' }, w34('socks_petersen', true), until34(35, 17, 0)] },
      { id: 'c34_bg_draw', label: 'Нарисовать на бумажках по смешной картинке для каждого сапога', minutes: 40, terminal: true, goto: 'c34_eve',
        text: 'Курица в шапке Хенрике. Корова с косами Нины. Трактор с лицом Оле. Ты рисуешь плохо, но смешно. Бумажки ложатся в сапоги рядом с местом для яблок.', effects: [set34('bg', 'draw'), w34('drawings', true), until34(35, 17, 0)] },
    ] }),

  X({ id: 'c34_a_market', title: 'У церкви', location: jest34, camp: jestCamp, ambient: frost34,
    text: [
      { text: 'После списков у церковной ограды стихийный рынок: кто что принёс. Свечи, гвозди, ламповое масло, сало, пачка соли, детские ботинки. Денег никто не берёт. Только обмен.' },
      { when: { has: 'c34_koehler_parcel' }, text: 'Кёлер стоит у ограды с пустой корзиной. Коробка с её фамилией у тебя под мышкой.' },
    ],
    actions: [
      { id: 'c34_am_koehler', label: 'Отдать Кёлер посылку от сына', when: { has: 'c34_koehler_parcel' }, minutes: 30, terminal: true, goto: 'c34_a_way',
        text: 'Ты протягиваешь коробку. Кёлер читает обратный адрес и садится прямо на край ограды. Распечатывает при всех. Внутри шерстяной шарф, банка мёда и записка. Записку она читает, шевеля губами, и прячет на груди.\n\n— Er hat am siebten geschrieben. Am siebten war er noch gesund.\n\nОн написал седьмого. Седьмого он ещё был здоров.\n\nБанку мёда она суёт тебе в руки и назад не берёт.', effects: [set34('am', 'koehler'), { take: 'c34_koehler_parcel' }, { give: 'c34_honey' }, w34('koehler_parcel', true), npc('c3_koehler', 3, 'c34_parcel'), until34(36, 12, 30)] },
      { id: 'c34_am_oil', label: 'Выменять ламповое масло на десяток яиц', when: eggs10, minutes: 20, terminal: true, goto: 'c34_a_way',
        text: 'Старик из Люллау взвешивает яйца на ладони, по одному, и отдаёт бутыль масла. Теперь у Хенрике лампа будет гореть по вечерам, а не только до ужина.', effects: [set34('am', 'oil'), { unstock: 'eggs', qty: 10, at: 'c3_farm_stock' }, { give: 'c34_lamp_oil' }, until34(36, 12, 30)] },
      { id: 'c34_am_nails', label: 'Выменять гвозди и петли на свою работу: обещать починить сарай', minutes: 20, terminal: true, goto: 'c34_a_way',
        text: 'Женщина из Йестебурга отдаёт коробку гвоздей и две дверные петли. Взамен ты обещаешь прийти в среду и навесить ей дверь сарая. Обещание она записывает в блокнот: она так делает со всеми.', effects: [set34('am', 'nails'), { give: 'c34_nails' }, w34('owes_door', true), until34(36, 12, 30)] },
      { id: 'c34_am_look', label: 'Только посмотреть и уйти', minutes: 10, terminal: true, goto: 'c34_a_way',
        text: 'Ты проходишь вдоль ограды. У кого-то детские ботинки, совсем новые, с биркой. Ты не спрашиваешь, откуда.', effects: [set34('am', 'look'), until34(36, 12, 20)] },
    ] }),

  X({ id: 'c34_b_market', title: 'У церкви', location: jest34, camp: jestCamp, ambient: frost34,
    text: [
      { text: 'Когда ты выходишь от пастора, у ограды ещё меняются: свечи, мыло, детские вещи, сахар кусками. Жена пастора уже стоит у калитки и собирает то, что можно отдать к Рождеству сиротам из пункта.' },
    ],
    actions: [
      { id: 'c34_bm_orphans', label: 'Отдать жене пастора что-нибудь своё для сирот', minutes: 20, terminal: true, goto: 'c34_home',
        text: 'Ты отдаёшь перчатки, вторые, тёплые. Жена пастора пишет в тетрадь: «Lüdemann-Hof, Handschuhe». Рядом длинный столбец. Ваш хутор там уже есть: Хенрике отдала носки ещё в среду.', effects: [set34('bm', 'orphans'), w34('orphans', true), until34(36, 13, 40)] },
      { id: 'c34_bm_soap', label: 'Выменять кусок мыла на вязание', minutes: 20, terminal: true, goto: 'c34_home',
        text: 'Кусок настоящего мыла, пахнущего лавандой, за обещание связать пару варежек. Женщина записывает твоё имя. Мыло ты кладёшь в карман и весь день чувствуешь запах.', effects: [set34('bm', 'soap'), { give: 'c34_soap' }, w34('owes_mittens', true), until34(36, 13, 40)] },
      { id: 'c34_bm_listen', label: 'Постоять у ограды и послушать, о чём говорят', minutes: 20, terminal: true, goto: 'c34_home',
        text: 'Говорят о колоннах, о десятом, о том, что армия что-то грузит в Люнебурге уже третий день. Кто-то говорит: уходят. Кто-то: ерунда. Ты слушаешь и запоминаешь, кто что сказал.', effects: [set34('bm', 'listen'), w34('heard_rumor', true), until34(36, 13, 40)] },
    ] }),

  X({ id: 'c34_a_night', title: 'Поздно', camp: house14, onEnter: [until34(36, 19, 30)],
    text: [
      { text: 'В доме ложатся рано. Ты сидишь у печи с тетрадью. Ночь ясная, на небе половинка луны.' },
      { when: flag('w.c34_tobias_warned'), text: 'Ты думаешь о словах Тобиаса: если в понедельник спросят, кто здесь живёт, говорить правду. Но только то, о чём спросят.' },
      { when: flag('w.c34_heard_new'), text: 'Ты думаешь о том, что сказал Тобиас в машине: в понедельник приедет кто-то новый, сверху, со списком. Список — вот проблема.' },
      { when: not(heard), text: 'Тобиас приезжал «просто посмотреть» и ничего не сказал. Он никогда так не приезжал. Завтра понедельник.' },
      { when: any(v('w.c34_courier', 'killed'), v('w.c34_courier', 'ended')), text: 'Стоит закрыть глаза, и перед тобой жилет с бейджем.' },
      { when: v('$.c34_du', 'eat'), text: 'Ужин был сытный: картошка с салом и печёные яблоки на сладкое. Тепло ещё держится внутри.' },
      { when: v('$.c34_du', 'partner'), text: 'Вы просидели рядом весь вечер, почти не разговаривая. Плечо помнит.' },
    ],
    actions: [
      { id: 'c34_al2_write', label: 'Записать слова Тобиаса слово в слово', when: heard, minutes: 25, terminal: true, goto: 'c34_checkpoint',
        text: 'Ты пишешь по-немецки, как помнишь, слово в слово. Внизу ставишь дату и время. Тетрадь — под подушку.', effects: [set34('al2', 'write'), set34('wrote_tobias', true), until34(36, 20, 0)] },
      { id: 'c34_al2_diary', label: 'Записать, что было за два дня', when: not(heard), minutes: 25, terminal: true, goto: 'c34_checkpoint',
        text: 'Ты пишешь коротко, по-русски: сапоги, списки, кто что сказал. Если что-то случится, пусть хоть это останется. Тетрадь — под подушку.', effects: [set34('al2', 'diary'), until34(36, 20, 0)] },
      { id: 'c34_al2_henrike', label: 'Сказать Хенрике про понедельник', minutes: 25, terminal: true, goto: 'c34_checkpoint',
        text: 'Хенрике слушает и складывает в столбик в своей тетради: кто живёт, кто откуда, кто болел.\n\n— Wenn sie kommen, sollen sie es von mir hören. Nicht von den Nachbarn.\n\nЕсли приедут, пусть услышат от меня. Не от соседей.', effects: [set34('al2', 'henrike'), w34('henrike_ready', true), npc('henrike', 1), until34(36, 20, 0)] },
      { id: 'c34_al2_partner', label: 'Сказать {partner.dat}: завтра будь осторожнее со словами', minutes: 25, terminal: true, goto: 'c34_checkpoint',
        text: '{partner} кивает. Вы шёпотом договариваетесь, кто что скажет, если спросят. Это смешно и страшно одновременно, как в школе перед контрольной.', effects: [set34('al2', 'partner'), w34('agreed_story', true), until34(36, 20, 0)] },
    ] }),

  X({ id: 'c34_b_night', title: 'Поздно', camp: house14, onEnter: [until34(36, 19, 30)],
    text: [
      { when: lea34, text: 'Лея сидит на крыльце, без куртки, на морозе. После списков она ни с кем не говорила. Ты выходишь к ней.' },
      { when: not(lea34), text: 'Нина сидит у приёмника и крутит ручку: ищет частоту Красного Креста, где днём читали списки. Сквозь шипение пробивается музыка, потом голоса.' },
      { text: 'Кто-то тихо плачет в колонии, за насыпью, и ветер доносит звук обрывками. Потом затихает.' },
      { when: v('$.c34_du', 'eat'), text: 'Ужин был сытный: картошка с салом и печёные яблоки на сладкое. Тепло ещё держится внутри.' },
      { when: v('$.c34_du', 'partner'), text: 'Вы просидели рядом весь вечер, почти не разговаривая. Плечо помнит.' },
    ],
    actions: [
      { id: 'c34_bl5_coat', label: 'Набросить ей на плечи свою куртку и сесть рядом', when: lea34, minutes: 25, terminal: true, goto: 'c34_checkpoint', ambientDuring: frost34,
        text: 'Лея не сопротивляется. Через полчаса говорит: «Ich bleibe bei der Zander. Bis zum Frühling. Dann gehe ich». Я останусь у Зандер. До весны. Потом пойду. И уходит в дом первой.', effects: [set34('bl5', 'coat'), w34('lea_spring', true), npc('c21_lea', 2, 'c34_sat_porch'), until34(36, 20, 0)] },
      { id: 'c34_bl5_tea', label: 'Принести ей горячего чаю и уйти: ей надо одной', when: lea34, minutes: 15, terminal: true, goto: 'c34_checkpoint',
        text: 'Ты ставишь кружку рядом с ней на ступеньку и уходишь. Утром кружка вымыта и стоит на полке.', effects: [set34('bl5', 'tea'), npc('c21_lea', 1), until34(36, 19, 50)] },
      { id: 'c34_bl5_radio', label: 'Сесть к Нине и слушать вместе', when: not(lea34), minutes: 25, terminal: true, goto: 'c34_checkpoint',
        text: 'Вы ловите голос диктора Красного Креста на минуту, потом он тонет в шипении. Нина записывает в тетрадь то, что успела: «Kolonne… Zehnter… Geesthacht». Колонна, десятое, Гестхахт.', effects: [set34('bl5', 'radio'), w34('nina_radio', true), npc('c7_nina', 1), until34(36, 20, 0)] },
      { id: 'c34_bl5_bed', label: 'Отправить Нину спать', when: not(lea34), minutes: 15, terminal: true, goto: 'c34_checkpoint',
        text: 'Нина выключает приёмник без спора. Тишина в кухне громче шипения.', effects: [set34('bl5', 'bed'), until34(36, 19, 50)] },
      { id: 'c34_bl5_go', label: 'Оставить её и лечь', when: lea34, minutes: 10, terminal: true, goto: 'c34_checkpoint',
        text: 'Ты закрываешь дверь. Через окно видно, как Лея сидит на ступеньке, пока не гаснет свет в доме.', effects: [set34('bl5', 'go'), until34(36, 19, 40)] },
    ] }),
];
