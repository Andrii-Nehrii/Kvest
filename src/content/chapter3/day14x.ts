import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { flag } from './world3';
import { S14, day14, dusk14, house14, indoor14, kitchen14, tense14, yard14 } from './point14';

// Дополнение участка 14 (06.11): по десять сцен на линию. Вставлены между сценами day14.ts.
const toLunch: Effect = { restUntil: at(15, 13) };
const toDusk: Effect = { restUntil: at(15, 16, 40) };
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const jannes = (trust: number): Effect => ({ npc: 'c14_jannes', trust });
const koehler = (trust: number): Effect => ({ npc: 'c3_koehler', trust });
const own = (key: string, value: string): Cond => ({ v: `$.c14_${key}`, op: '==', value });
const neighbor = 'c3_neighbor';

export const day14xScenes: Scene[] = [
  // ───────────── A ─────────────
  S14({ id: 'c14_a_well', for: 'any', chapter: 'ch3', title: 'Колодец', camp: yard14, ambient: day14,
    text: [{ text: 'До обеда час. Ведро у колодца пустое, бочка у кухонной двери тоже: вчера воду носили Дениз с Керемом. Теперь некому, кроме вас.' }],
    actions: [
      { id: 'c14_aw_barrel', label: 'Натаскать полную бочку', minutes: 40, activity: 'heavy', terminal: true, goto: 'c14_lunch',
        text: 'Двенадцать вёдер. Цепь скрипит, ручка ворота обжигает ладони холодом. К последнему ведру спина мокрая, хотя на улице шесть градусов. Бочка полная. До завтра хватит.', effects: [{ set: '$.c14_well', value: 'barrel' }, toLunch] },
      { id: 'c14_aw_half', label: 'Наполнить бочку наполовину и передохнуть', minutes: 20, activity: 'moderate', terminal: true, goto: 'c14_lunch',
        text: 'Шесть вёдер. Ты садишься на край колодца. Отсюда видно весь двор: фургон, сарай, Нину у навеса. И пустую дорогу.', effects: [{ set: '$.c14_well', value: 'half' }, toLunch] },
      { id: 'c14_aw_chain', label: 'Сначала посмотреть, почему скрипит цепь', minutes: 25, activity: 'light', terminal: true, goto: 'c14_lunch',
        text: 'Ось ворота сухая и рыжая. Ты находишь в сарае банку с машинным маслом и мажешь. Цепь замолкает. Пара вёдер — и вода идёт легче.', effects: [{ set: '$.c14_well', value: 'chain' }, toLunch] },
    ] }),

  S14({ id: 'c14_a_shed', for: 'any', chapter: 'ch3', title: 'Ключ с синей ниткой', camp: yard14, ambient: day14,
    text: [{ text: 'Ключ с синей ниткой подходит к сараю с инструментом. Внутри пахнет бензином и яблоками. Верстак, тиски, косы на стене. На полке моток верёвки, фонарь без батареек, коробка гвоздей. В углу пустая канистра.' }],
    actions: [
      { id: 'c14_as_rope', label: 'Взять моток верёвки', minutes: 4, terminal: true, goto: 'c14_a_van',
        text: 'Верёвка толстая, льняная, старая, но крепкая. Ты вешаешь моток на плечо. Пригодится. Ночью, может быть, особенно.', effects: [{ set: '$.c14_shed', value: 'rope' }, { give: 'rope', qty: 1 }] },
      { id: 'c14_as_nails', label: 'Взять гвозди и молоток: доски на фургоне', minutes: 4, terminal: true, goto: 'c14_a_van',
        text: 'Ты кладёшь в карман горсть гвоздей и берёшь молоток. Доски на окне кабины держатся, но одна внизу отходит. Это видно даже отсюда.', effects: [{ set: '$.c14_shed', value: 'nails' }] },
      { id: 'c14_as_look', label: 'Просто оглядеться и запереть', minutes: 3, terminal: true, goto: 'c14_a_van',
        text: 'На верстаке банка с самодельными бирками: «Oles Schrauben», «Nicht anfassen», «Für Kerem». Ты запираешь сарай.', effects: [{ set: '$.c14_shed', value: 'look' }] },
    ] }),

  S14({ id: 'c14_a_cart', for: 'any', chapter: 'ch3', title: 'Варежка', location: neighbor, ambient: indoor14,
    text: [{ text: 'Ты присаживаешься у тачки. На дне одеяло, в пятнах земли и чего-то тёмного. К ручке на шнурке привязана детская варежка. Синяя, с оленем. Одна.' },
      { when: flag('$.c14_saw_list'), text: 'Ты вспоминаешь зачёркнутую строку на картонке: «Itzenbüttel — Kind ✗».' }],
    actions: [
      { id: 'c14_ac_mitten', label: 'Потрогать варежку', minutes: 3, terminal: true, goto: 'c14_a_ktea',
        text: 'Варежка мокрая и холодная. Внутри, в пальце, что-то твёрдое. Маленькая пластмассовая лошадка. Ты кладёшь варежку обратно, как висела.', effects: [{ set: '$.c14_cart', value: 'mitten' }] },
      { id: 'c14_ac_blanket', label: 'Поднять край одеяла', minutes: 3, terminal: true, goto: 'c14_a_ktea',
        text: 'Под одеялом ремни, свёрнутые аккуратно, по-хозяйски. И пустая миска. Собачья, с надписью «Bello».', effects: [{ set: '$.c14_cart', value: 'blanket' }] },
      { id: 'c14_ac_out', label: 'Выйти из сарая: Кёлер зовёт', minutes: 2, terminal: true, goto: 'c14_a_ktea',
        text: 'Кёлер стоит на крыльце и машет тебе рукой. Нож она наконец положила.', effects: [{ set: '$.c14_cart', value: 'out' }] },
    ] }),

  S14({ id: 'c14_a_ktea', for: 'any', chapter: 'ch3', title: 'Чай у Кёлер', location: neighbor, ambient: indoor14,
    text: [{ text: 'Кёлер зовёт тебя на кухню. На плите чайник, на столе хлеб под полотенцем. На стене фотография: она и мужчина её лет, похожий на неё, в рабочем комбинезоне. У двери на крючке мужская куртка, большая.\n\n— Bruder, — говорит Кёлер, проследив твой взгляд. — Mein Bruder. Er ist in Hamburg. Bei seiner Tochter.\n\nБрат. Он в Гамбурге, у дочери.' }],
    actions: [
      { id: 'c14_akt_bread', label: 'Выпить чаю и взять хлеб, если даёт', minutes: 25, terminal: true, goto: 'c14_a_jannes',
        text: 'Чай горький, из сушёной мяты. Кёлер отрезает тебе толстый ломоть ржаного и заворачивает в бумагу.\n\n— Für unterwegs. — В дорогу.\n\nКуртку брата на крючке она обходит, когда идёт к плите. Будто это не куртка, а человек.', effects: [{ set: '$.c14_ktea', value: 'bread' }, { give: 'c9_koehler_bread', qty: 1 }, koehler(1), { restUntil: at(15, 15) }] },
      { id: 'c14_akt_coat', label: 'Спросить, почему куртка брата здесь', minutes: 20, terminal: true, goto: 'c14_a_jannes',
        text: 'Кёлер долго молчит, глядя на крючок у двери.\n\n— Er hat sie vergessen, — говорит она. Забыл.\n\nПотом встаёт и уходит в комнату. Возвращается через пять минут с сухими глазами и говорит про погоду.', effects: [{ set: '$.c14_ktea', value: 'coat' }, { set: '$.c14_coat_seen', value: true }, { restUntil: at(15, 15) }] },
      { id: 'c14_akt_barn', label: 'Отказаться: надо дождаться тех, из сарая', minutes: 15, terminal: true, goto: 'c14_a_jannes',
        text: '— Dann warte hier, — говорит Кёлер. — Am Fenster. Von hier sieht man die Scheune.\n\nТогда жди здесь, у окна. Отсюда видно сарай.\n\nТы ждёшь у окна. Чай остывает в чашке.', effects: [{ set: '$.c14_ktea', value: 'barn' }, { restUntil: at(15, 15) }] },
    ] }),

  S14({ id: 'c14_a_jannes3', for: 'any', chapter: 'ch3', title: 'В одиннадцать', location: neighbor, ambient: indoor14,
    text: [{ text: 'Яннес провожает тебя до дыры в сетке.\n\n— Если ваши скажут «да», — говорит он, — нужен кто-то сильный. Держать дверь. Мама с шестом, я с тачкой. Третьего у нас нет.' }],
    actions: [
      { id: 'c14_aj3_yes', label: 'Сказать: если решим «да», я подержу дверь', minutes: 4, terminal: true, goto: 'c14_a_back',
        text: 'Яннес кивает и протягивает руку. Пожатие крепкое.\n\n— Перчатки я принесу, — говорит он. — Толстые. Сварочные.', effects: [{ set: '$.c14_jannes3', value: 'yes' }, jannes(1), { restUntil: at(15, 15, 50) }] },
      { id: 'c14_aj3_break', label: 'Спросить, что будет, если он вырвется', minutes: 5, terminal: true, goto: 'c14_a_back',
        text: 'Яннес отводит полу куртки. На ремне нож в ножнах.\n\n— Мама не знает, — говорит он. — И не узнает. Да?', effects: [{ set: '$.c14_jannes3', value: 'break' }, jannes(1), { restUntil: at(15, 15, 50) }] },
      { id: 'c14_aj3_no', label: 'Сказать: ничего не обещаю', minutes: 3, terminal: true, goto: 'c14_a_back',
        text: '— Честно, — говорит Яннес. — Ладно. Мигните, как решите.', effects: [{ set: '$.c14_jannes3', value: 'no' }, { restUntil: at(15, 15, 50) }] },
    ] }),

  S14({ id: 'c14_a_hens', for: 'any', chapter: 'ch3', title: 'Куры на ночь', camp: yard14, ambient: dusk14,
    text: [{ text: 'Темнеет. Оле говорил: куры утром и вечером. Ты загоняешь их в курятник. Считаешь. Девять. Утром Нина говорила: десять.' }],
    actions: [
      { id: 'c14_ah_search', label: 'Поискать десятую', minutes: 12, activity: 'light', terminal: true, goto: 'c14_a_fence',
        text: 'Ты находишь её под крыльцом, на гнезде. Под ней два яйца, тёплые. Курица ругается, но даёт себя вынести.', effects: [{ set: '$.c14_hens', value: 'search' }, { give: 'eggs', qty: 2 }, { stock: 'eggs', qty: 2, at: 'c3_farm_stock' }] },
      { id: 'c14_ah_close', label: 'Закрыть девять: десятая сама придёт', minutes: 5, terminal: true, goto: 'c14_a_fence',
        text: 'Ты задвигаешь заслонку. Из-под крыльца недовольно квохчут. Значит, живая.', effects: [{ set: '$.c14_hens', value: 'close' }] },
      { id: 'c14_ah_water', label: 'Налить свежей воды и закрыть', minutes: 8, activity: 'light', terminal: true, goto: 'c14_a_fence',
        text: 'Поилка пустая. Ты наливаешь из ведра, задвигаешь заслонку. Куры возятся на насесте и затихают.', effects: [{ set: '$.c14_hens', value: 'water' }] },
    ] }),

  S14({ id: 'c14_a_fence', for: 'any', chapter: 'ch3', title: 'Задняя калитка', camp: yard14, ambient: dusk14,
    text: [{ text: 'Задняя калитка в поле держится на крючке. Через неё сегодня приходила женщина с велосипедом. Через неё ночью, может быть, придут снова. С тачкой.' }],
    actions: [
      { id: 'c14_afn_wire', label: 'Закрутить крючок проволокой', minutes: 10, activity: 'light', terminal: true, goto: 'c14_a_road',
        text: 'Ты закручиваешь проволоку в три оборота. Теперь калитку снаружи не открыть, только сломать. Изнутри — плоскогубцами. Плоскогубцы ты кладёшь на столб.', effects: [{ set: '$.c14_fence', value: 'wire' }] },
      { id: 'c14_afn_can', label: 'Повесить на калитку банку с камнями', minutes: 8, terminal: true, goto: 'c14_a_road',
        text: 'Консервная банка, три камешка, бечёвка. Если кто-то тронет калитку, будет слышно в доме. Ты проверяешь: слышно.', effects: [{ set: '$.c14_fence', value: 'can' }] },
      { id: 'c14_afn_leave', label: 'Оставить как есть', minutes: 2, terminal: true, goto: 'c14_a_road',
        text: 'Ты оставляешь крючок. Если решите «да», калитку всё равно придётся открыть.', effects: [{ set: '$.c14_fence', value: 'leave' }] },
    ] }),

  S14({ id: 'c14_a_road', for: 'any', chapter: 'ch3', title: 'Машина на дороге', camp: yard14, ambient: dusk14,
    text: [{ text: 'Со стороны Йестебурга по дороге едет машина. Фары жёлтые, низкие. Внедорожник. У вашей калитки он сбавляет ход, почти останавливается. За стеклом белеет лицо. Потом машина уезжает дальше, к Бендесторфу.' }],
    actions: [
      { id: 'c14_ard_wave', label: 'Помахать рукой', minutes: 3, terminal: true, goto: 'c14_a_rest',
        text: 'Из окна машины поднимается рука. Не машет. Просто поднимается и опускается. Как «я тебя видел».', effects: [{ set: '$.c14_road', value: 'wave' }] },
      { id: 'c14_ard_hide', label: 'Отойти в тень сарая', minutes: 3, terminal: true, goto: 'c14_a_rest',
        text: 'Ты стоишь в тени и не дышишь. Машина уходит. Фары долго видны над полем, потом гаснут за деревьями.', effects: [{ set: '$.c14_road', value: 'hide' }] },
      { id: 'c14_ard_time', label: 'Запомнить время и машину', minutes: 2, terminal: true, goto: 'c14_a_rest',
        text: 'Пять часов. Внедорожник, как утром у патруля. Номера ты не {m:разглядел|разглядела}. Только то, что внутри был один человек.', effects: [{ set: '$.c14_road', value: 'time' }] },
    ] }),

  S14({ id: 'c14_a_cellar2', for: 'any', chapter: 'ch3', title: 'Подвал', camp: house14,
    text: [{ text: 'Нина кричит из кухни: на ужин нужна картошка и что-нибудь сладкое. Длинный ключ поворачивается туго. В подвале холодно и пахнет землёй.' },
      { when: own('keys', 'cellar'), text: 'Коробка «Für Nina» стоит на нижней полке, где стояла.' }],
    actions: [
      { id: 'c14_acl_plums', label: 'Взять картошку и банку слив', minutes: 8, terminal: true, goto: 'c14_a_gun',
        text: 'Ты набираешь полное ведро картошки и берёшь банку слив, самую большую. На крышке почерком Хенрике: «2025. Für den Winter». На зиму.', effects: [{ set: '$.c14_cellar2', value: 'plums' }] },
      { id: 'c14_acl_box', label: 'Взять и коробку «Für Nina»', minutes: 8, terminal: true, goto: 'c14_a_gun',
        text: 'Ты несёшь наверх ведро и коробку. Нина видит надпись, берёт коробку и уходит с ней наверх, ничего не сказав. Через минуту сверху слышно, как она плачет. Тихо.', effects: [{ set: '$.c14_cellar2', value: 'box' }, nina(1)] },
      { id: 'c14_acl_count', label: 'Пересчитать картошку на неделю вперёд', minutes: 12, terminal: true, goto: 'c14_a_gun',
        text: 'Шесть ящиков. Если по полкило на человека в день, на троих — недели на три. Если придут ещё люди — меньше. Ты закрываешь подвал на два оборота.', effects: [{ set: '$.c14_cellar2', value: 'count' }] },
    ] }),

  S14({ id: 'c14_a_bottle', for: 'any', chapter: 'ch3', title: 'Бутылка', camp: yard14, ambient: dusk14,
    text: [{ text: 'После ужина ты выходишь во двор. У колодца Нина наливает воду в пластиковую бутылку. Потом вторую. Увидев тебя, она замирает с бутылкой в руке.\n\n— Это ему, — говорит она. — Как каждую ночь. Ты же знаешь.' }],
    actions: [
      { id: 'c14_ab2_help', label: 'Помочь донести', minutes: 8, terminal: true, goto: 'c14_evening',
        text: 'Ты несёшь вторую бутылку. Нина вставляет горлышко в воронку и льёт медленно. Из кабины слышно, как он глотает. Громко, жадно.\n\nНина слушает с закрытыми глазами.', effects: [{ set: '$.c14_bottle', value: 'help' }, nina(1)] },
      { id: 'c14_ab2_wait', label: 'Сказать: подожди, сначала решим', minutes: 4, terminal: true, goto: 'c14_evening',
        text: 'Нина смотрит на тебя. Потом ставит бутылки на край колодца.\n\n— Ладно, — говорит она. — Решайте. Он подождёт. Он умеет ждать.', effects: [{ set: '$.c14_bottle', value: 'wait' }] },
      { id: 'c14_ab2_watch', label: 'Ничего не говорить и смотреть', minutes: 8, terminal: true, goto: 'c14_evening',
        text: 'Нина идёт к фургону. Свет из окна кухни лежит на её спине. Она льёт воду и что-то шепчет в доски. Потом возвращается и проходит мимо тебя, не поднимая глаз.', effects: [{ set: '$.c14_bottle', value: 'watch' }] },
    ] }),

  // ───────────── B ─────────────
  S14({ id: 'c14_b_room', for: 'any', chapter: 'ch3', title: 'Комната Нины', camp: house14,
    text: [{ text: 'Нина спит в швейной комнате Хенрике, на раскладушке между машинкой и шкафом с тканями. На подоконнике велосипедный шлем и зарядка без телефона. Нина сидит на раскладушке и показывает тебе экран.\n\nПоследнее сообщение от «Papa», 11 ноября, 14:52: «Komme später, Schatz. Noch eine Lieferung in Jesteburg. Iss was.»\n\nПриду позже, солнышко. Ещё одна доставка в Йестебурге. Поешь что-нибудь.' }],
    actions: [
      { id: 'c14_br2_sit', label: 'Сесть рядом', minutes: 15, terminal: true, goto: 'c14_lunch',
        text: 'Нина листает переписку назад. «Купи молока». «Где ты?». «Тренировка в шесть». Обычные слова. Она показывает тебе каждое, как фотографию.', effects: [{ set: '$.c14_room', value: 'sit' }, nina(1), toLunch] },
      { id: 'c14_br2_ate', label: 'Спросить, поела ли она тогда', minutes: 10, terminal: true, goto: 'c14_lunch',
        text: 'Нина смотрит на тебя и вдруг смеётся.\n\n— Нет. Чипсы. — Она вытирает глаза. — Он бы ругался.', effects: [{ set: '$.c14_room', value: 'ate' }, nina(1), toLunch] },
      { id: 'c14_br2_help', label: 'Предложить разобрать её вещи', minutes: 20, activity: 'light', terminal: true, goto: 'c14_lunch',
        text: 'Вы раскладываете её рюкзак. Две футболки, джинсы, зарядка, щётка, тетрадь по биологии. Тетрадь Нина зачем-то взяла с собой. «Там домашка на четверг», — говорит она.', effects: [{ set: '$.c14_room', value: 'help' }, toLunch] },
    ] }),

  S14({ id: 'c14_b_well', for: 'any', chapter: 'ch3', title: 'Вода', camp: yard14, ambient: day14,
    text: [{ text: 'Нина несёт от колодца два ведра, проливая на джинсы. Руки у неё красные от холода и ссаженные на костяшках.\n\n— Хенрике сказала: сырую не пить, — говорит она. — А куда её ещё девать?' }],
    actions: [
      { id: 'c14_bwl_take', label: 'Забрать у неё одно ведро', minutes: 10, activity: 'moderate', terminal: true, goto: 'c14_b_phone',
        text: 'Вы несёте вёдра вдвоём. Нина идёт быстрее, чтобы успеть первой. Воду вы выливаете в большую кастрюлю на плите: кипятить.', effects: [{ set: '$.c14_bwl', value: 'take' }, nina(1)] },
      { id: 'c14_bwl_hands', label: 'Посмотреть на её костяшки', minutes: 5, terminal: true, goto: 'c14_b_phone',
        text: 'Ссадины свежие, от досок. На правой руке заноза. Ты вытаскиваешь её ногтями. Нина не морщится.\n\n— Это от фургона, — говорит она, хотя ты не {m:спрашивал|спрашивала}.', effects: [{ set: '$.c14_bwl', value: 'hands' }] },
      { id: 'c14_bwl_boil', label: 'Поставить воду кипятить', minutes: 8, activity: 'light', terminal: true, goto: 'c14_b_phone',
        text: 'Ты ставишь кастрюлю на плиту, подкладываешь дров. Нина смотрит на огонь и греет руки над кастрюлей.', effects: [{ set: '$.c14_bwl', value: 'boil' }] },
    ] }),

  S14({ id: 'c14_b_laundry', for: 'any', chapter: 'ch3', title: 'Бельё', camp: yard14, ambient: day14,
    text: [{ text: 'В тазу у крыльца бельё, которое Хенрике замочила вчера и не успела развесить. Рубашки Оле, её фартук, наволочки. Нина берёт рубашку и держит на вытянутых руках.\n\n— Она его так любит, — говорит Нина. — Даже когда орёт.' }],
    actions: [
      { id: 'c14_bl2_hang', label: 'Развесить бельё вместе', minutes: 20, activity: 'light', terminal: true, goto: 'c14_b_winsen',
        text: 'Вы натягиваете верёвку между яблоней и сараем. Рубашки Оле висят рядком, рукавами вниз, как будто он сам стоит во дворе. Нина прищепляет последнюю и отходит посмотреть.', effects: [{ set: '$.c14_laundry', value: 'hang' }, nina(1)] },
      { id: 'c14_bl2_dry', label: 'Отнести в дом, к печке: на улице не высохнет', minutes: 15, activity: 'light', terminal: true, goto: 'c14_b_winsen',
        text: 'Ты развешиваешь бельё на верёвке над плитой. Кухня наполняется паром и запахом мыла. Будто Хенрике никуда не уезжала.', effects: [{ set: '$.c14_laundry', value: 'dry' }] },
      { id: 'c14_bl2_ask', label: 'Спросить, как они её приняли, когда она приехала', minutes: 10, terminal: true, goto: 'c14_b_winsen',
        text: '— Оле хотел прогнать. — Нина пожимает плечами. — А Хенрике сказала: «Сначала поешь». Я тогда два дня не ела. Она смотрела, как я ем, и молчала.', effects: [{ set: '$.c14_laundry', value: 'ask' }, nina(1)] },
    ] }),

  S14({ id: 'c14_b_winsen', for: 'any', chapter: 'ch3', title: 'Лена', camp: yard14, ambient: day14,
    text: [{ text: 'Нина садится на ступеньку крыльца.\n\n— Лена пишет, — говорит она. — Подруга. У неё мама живая, и у них иногда свет. Её мама сказала: пусть Нина приезжает. Насовсем.\n\nОна вертит телефон в руках.\n\n— А я тут. С папой.' }],
    actions: [
      { id: 'c14_bwn_good', label: 'Сказать: это хорошее предложение', minutes: 5, terminal: true, goto: 'c14_b_ute',
        text: '— Я знаю. — Нина кивает. — Это хорошее. Я просто не могу сейчас про хорошее.', effects: [{ set: '$.c14_winsen', value: 'good' }, { restUntil: at(15, 15) }] },
      { id: 'c14_bwn_after', label: 'Сказать: решишь потом, не сегодня', minutes: 5, terminal: true, goto: 'c14_b_ute',
        text: '— Потом, — повторяет Нина. — Ладно. Потом. — Она пишет Лене что-то короткое и прячет телефон.', effects: [{ set: '$.c14_winsen', value: 'after' }, nina(1), { restUntil: at(15, 15) }] },
      { id: 'c14_bwn_stay', label: 'Сказать: можешь остаться с нами', minutes: 5, terminal: true, goto: 'c14_b_ute',
        text: 'Нина поднимает глаза.\n\n— Правда? — И сразу отворачивается. — Ты {m:сказал|сказала}. Я запомню.', effects: [{ set: '$.c14_winsen', value: 'stay' }, nina(2), { restUntil: at(15, 15) }] },
    ] }),

  S14({ id: 'c14_b_after_ute', for: 'any', chapter: 'ch3', title: 'Она хорошая?', camp: yard14, ambient: day14,
    text: [{ text: 'Нина смотрит, как Уте уходит через поле, ведя велосипед. Зелёный дождевик долго виден на фоне чёрной пашни.\n\n— Она хорошая? — спрашивает Нина. — Ну, по-честному. Ты же {m:взрослый|взрослая}.' }],
    actions: [
      { id: 'c14_bau_good', label: 'Сказать: хорошая. Но не всё видит', minutes: 4, terminal: true, goto: 'c14_b_van2',
        text: 'Нина думает.\n\n— Как мама, — говорит она. — Мама тоже не всё видела. Поэтому и ушла. — Она не объясняет, а ты не спрашиваешь.', effects: [{ set: '$.c14_au', value: 'good' }, nina(1)] },
      { id: 'c14_bau_dunno', label: 'Сказать честно: не знаю', minutes: 3, terminal: true, goto: 'c14_b_van2',
        text: '— Я тоже не знаю, — говорит Нина. — Но она пришла. Остальные только писали.', effects: [{ set: '$.c14_au', value: 'dunno' }] },
      { id: 'c14_bau_you', label: 'Спросить, что думает она сама', minutes: 4, terminal: true, goto: 'c14_b_van2',
        text: '— Она пахнет как наша школа. — Нина улыбается краешком рта. — Мелом и кофе. Я ей верю. Глупо, да?', effects: [{ set: '$.c14_au', value: 'you' }, nina(1)] },
    ] }),

  S14({ id: 'c14_b_van2', for: 'any', chapter: 'ch3', title: 'В щель', camp: tense14, ambient: day14,
    text: [{ text: 'Нина уходит в дом. Ты остаёшься у навеса {m:один|одна}. Фонарик у тебя в кармане. Щель между досками на уровне глаз, там, где воронка.' }],
    actions: [
      { id: 'c14_bv2_look', label: 'Посветить и посмотреть', minutes: 4, risky: true, terminal: true, goto: 'c14_b_dusk',
        text: 'Луч выхватывает из темноты руль, пустые бутылки на полу, рукав куртки. Потом лицо. Близко, у самых досок. Серое, худое, с потрескавшимися губами. Глаза открыты и смотрят на свет.\n\nУдар в доски, прямо в луч. Ты отскакиваешь. Фонарь чуть не падает.', effects: [{ set: '$.c14_van2', value: 'look' }, { set: '$.c14_saw_jens', value: true }, { body: 'stress', delta: 4 }, toDusk] },
      { id: 'c14_bv2_listen', label: 'Не светить, только послушать', minutes: 6, terminal: true, goto: 'c14_b_dusk',
        text: 'Ты стоишь у досок. Внутри дышат. Медленно, с присвистом. Потом шорох, будто кто-то трётся плечом о дверь. И снова дыхание.', effects: [{ set: '$.c14_van2', value: 'listen' }, toDusk] },
      { id: 'c14_bv2_go', label: 'Уйти в дом', minutes: 2, terminal: true, goto: 'c14_b_dusk',
        text: 'Ты уходишь. У крыльца оборачиваешься. Под навесом темно и тихо, и от этого не легче.', effects: [{ set: '$.c14_van2', value: 'go' }, toDusk] },
    ] }),

  S14({ id: 'c14_b_candles', for: 'any', chapter: 'ch3', title: 'Без света', camp: house14, ambient: dusk14,
    text: [{ text: 'В доме темнеет быстрее, чем на улице. Электричества нет с понедельника. На кухне керосиновая лампа Хенрике, на полке коробка свечей.' }],
    actions: [
      { id: 'c14_bc2_lamp', label: 'Зажечь лампу на кухне', minutes: 6, terminal: true, goto: 'c14_b_rest',
        text: 'Фитиль коптит, потом выравнивается. Жёлтый круг на столе. Вокруг него кухня снова становится жилой. Керосина в лампе на донышке.', effects: [{ set: '$.c14_candles', value: 'lamp' }] },
      { id: 'c14_bc2_candle', label: 'Зажечь одну свечу, экономить', minutes: 4, terminal: true, goto: 'c14_b_rest',
        text: 'Одна свеча в банке на подоконнике. Света хватает, чтобы не натыкаться на стулья. Нина приходит на огонёк и садится рядом, как мотылёк.', effects: [{ set: '$.c14_candles', value: 'candle' }, nina(1)] },
      { id: 'c14_bc2_dark', label: 'Посидеть в темноте у печки', minutes: 8, activity: 'rest', terminal: true, goto: 'c14_b_rest',
        text: 'Печка светит щелями дверцы. Красные полоски на полу. Тихо так, что слышно, как в курятнике возятся куры.', effects: [{ set: '$.c14_candles', value: 'dark' }, { body: 'stress', delta: -1 }] },
    ] }),

  S14({ id: 'c14_b_bath', for: 'any', chapter: 'ch3', title: 'Голову помыть', camp: house14,
    text: [{ text: 'Нина стоит в дверях кухни с полотенцем на плече.\n\n— Можно я голову помою? — спрашивает она. — С тех пор как приехала, не мыла. Я сама воду нагрею.' }],
    actions: [
      { id: 'c14_bb2_help', label: 'Нагреть воду и полить ей из ковша', minutes: 25, activity: 'light', terminal: true, goto: 'c14_b_album',
        text: 'Ты греешь две кастрюли. Нина наклоняется над тазом, ты льёшь из ковша. Вода темнеет от пыли и дорожной грязи.\n\n— Папа мне косы плёл, — говорит Нина из-под полотенца. — Когда маленькая была. Кривые. Я всё равно носила.', effects: [{ set: '$.c14_bath', value: 'help' }, nina(2)] },
      { id: 'c14_bb2_self', label: 'Сказать: конечно, грей сама', minutes: 15, terminal: true, goto: 'c14_b_album',
        text: 'Нина возится у плиты, гремит кастрюлями. Через двадцать минут выходит с мокрой головой, в полотенце-тюрбане. Улыбается. Первый раз за день не через силу.', effects: [{ set: '$.c14_bath', value: 'self' }] },
      { id: 'c14_bb2_water', label: 'Сказать: воды мало, давай завтра', minutes: 3, terminal: true, goto: 'c14_b_album',
        text: '— Ладно. — Нина вешает полотенце обратно. — Завтра. — Она не спорит. Просто уходит наверх.', effects: [{ set: '$.c14_bath', value: 'water' }, nina(-1)] },
    ] }),

  S14({ id: 'c14_b_album', for: 'any', chapter: 'ch3', title: 'Альбом', camp: house14,
    text: [{ text: 'В комнате Хенрике на комоде лежит фотоальбом в бархатной обложке. Нина открывает его без спроса. Хенрике молодая, в свадебном платье, рядом высокий мужчина с усами. Тот же мужчина на тракторе. У него на плечах мальчик лет пяти, в вязаной шапке с помпоном.\n\n— Это Оле? — Нина фыркает. — Маленький! А это кто, с усами?' }],
    actions: [
      { id: 'c14_bal_close', label: 'Закрыть альбом: это не наше', minutes: 3, terminal: true, goto: 'c14_b_letter',
        text: 'Нина кивает и закрывает. Кладёт обратно ровно, как лежал. Даже поправляет угол.', effects: [{ set: '$.c14_album', value: 'close' }] },
      { id: 'c14_bal_look', label: 'Полистать дальше', minutes: 8, terminal: true, goto: 'c14_b_letter',
        text: 'Мальчик растёт: в школьной форме, с велосипедом, с удочкой. Мужчина с усами есть на всех фотографиях, пока мальчику не исполняется лет пятнадцать. Дальше только двое: Хенрике и Оле. Потом пустые страницы.\n\nНина закрывает альбом первой.', effects: [{ set: '$.c14_album', value: 'look' }, { set: '$.c14_saw_father', value: true }] },
      { id: 'c14_bal_hat', label: 'Заметить шапку на мальчике', minutes: 5, terminal: true, goto: 'c14_b_letter',
        text: 'Шапка вязаная, с помпоном. Почти такая же, только большая, висит в прихожей на гвозде. Ты {m:думал|думала}, это шапка Оле. Может, и его. А может, того, с усами.', effects: [{ set: '$.c14_album', value: 'hat' }, { set: '$.c14_saw_father', value: true }] },
    ] }),

  S14({ id: 'c14_b_phone2', for: 'any', chapter: 'ch3', title: 'Сообщение', camp: kitchen14,
    text: [{ text: 'После ужина телефон Нины вздрагивает на столе. Она читает и поворачивает экран к тебе.\n\n«Wir sind bereit. Drei Mal Licht: wir kommen. Zwei Mal: wir bleiben weg. Egal was ihr sagt — Nina, es ist nicht deine Schuld. Ute.»\n\nМы готовы. Три раза свет — придём. Два — не придём. Что бы вы ни решили, Нина, ты не виновата. Уте.' }],
    actions: [
      { id: 'c14_bp2_hug', label: 'Обнять Нину', minutes: 4, terminal: true, goto: 'c14_evening',
        text: 'Нина утыкается тебе в плечо. Мокрые после мытья волосы пахнут хозяйственным мылом.', effects: [{ set: '$.c14_phone2', value: 'hug' }, nina(1)] },
      { id: 'c14_bp2_reply', label: 'Сказать: ответь ей «спасибо»', minutes: 4, terminal: true, goto: 'c14_evening',
        text: 'Нина пишет одно слово. Потом стирает и пишет длиннее. Потом снова стирает и отправляет одно: «Danke».', effects: [{ set: '$.c14_phone2', value: 'reply' }] },
      { id: 'c14_bp2_quiet', label: 'Ничего не говорить', minutes: 3, terminal: true, goto: 'c14_evening',
        text: 'Нина кладёт телефон экраном вниз. Потом снова переворачивает. Потом кладёт в карман, чтобы не видеть.', effects: [{ set: '$.c14_phone2', value: 'quiet' }] },
    ] }),
];

