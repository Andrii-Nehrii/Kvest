import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { any, ninaFarm, v } from './point18';
import {
  A19, B19, S20, barnChained, cold19, day19, evaHere, girlHere, henrikeHome, janaHere, npc, own20, set20, tableOnly, tractorHere, until, uteHere, volkerHere, w20,
} from './point19';

// Участок 20, хутор: пятница дома. Список, почта, Брандт, радио, известие о конвое.
const F = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S20({ ...scene, for: 'any', chapter: 'ch3' });
const rain = { tempC: 5, outdoor: true, wet: true };
const guests: Cond = v('w.c19_list', 'guests');
const post: Cond = flag('w.c18_post');
const ilseStill: Cond = all(v('w.c18_ilse', 'kept'), any(v('w.c19_ilse', 'water'), v('w.c19_ilse', 'fork'), not(flag('w.c19_ilse'))));
const gunHere: Cond = any(v('w.c19_gun_plan', 'keep'), all(v('w.c19_gun', 'house'), not(flag('w.c19_gun_plan'))));
const afterBreakfast = [{ id: 'patrol', when: all(A19, guests), goto: 'c20_f_a_patrol' }, { id: 'work', when: A19, goto: 'c20_f_a_work' },
  { id: 'van', when: post, goto: 'c20_f_b_van' }, { id: 'koehler', goto: 'c20_f_b_koehler' }];
const afterMorningA = [{ id: 'volker', when: volkerHere, goto: 'c20_f_a_volker' }, { id: 'booth', when: ilseStill, goto: 'c20_f_a_booth' },
  { id: 'barn', when: barnChained, goto: 'c20_f_a_barn' }, { id: 'brandt', goto: 'c20_f_brandt' }];
const afterNoon = [{ id: 'a', when: A19, goto: 'c20_f_a_afternoon' }, { id: 'nina', when: ninaFarm, goto: 'c20_f_b_nina' }, { id: 'girl', when: girlHere, goto: 'c20_f_b_girl' }, { id: 'b', goto: 'c20_f_b_ute' }];

export const day20FScenes: Scene[] = [
  F({ id: 'c20_f_dawn', title: 'Пять утра', camp: house14,
    text: [
      { text: 'Вы снимаете куртки. Чайник закипает второй раз. До рассвета больше двух часов, и в доме все спят.' },
      { when: v('w.c18_friday', 'go'), text: 'В среду вы собирались ехать за Оле. Не поехали.' },
    ],
    actions: [
      { id: 'c20_fd_sleep', label: 'Лечь ещё на два часа', minutes: 5, terminal: true, goto: 'c20_f_breakfast',
        text: 'Ты ложишься в одежде поверх одеяла и засыпаешь, едва закрыв глаза.', effects: [set20('fd', 'sleep'), until(20, 7, 0, true)] },
      { id: 'c20_fd_stretcher', label: 'Сделать носилки из двух жердей и мешков', when: A19, minutes: 90, activity: 'moderate', terminal: true, goto: 'c20_f_breakfast',
        text: 'Две жерди от старой изгороди, три мешка из-под картошки, проволока. Ты продеваешь жерди в мешки и проверяешь, ложась сверху. Держит. Носилки стоят в сенях. Ты надеешься, что они не понадобятся.', effects: [set20('fd', 'stretcher'), w20('stretcher', true), until(20, 7, 0)] },
      { id: 'c20_fd_stove', label: 'Затопить и обойти двор', when: A19, minutes: 60, activity: 'light', terminal: true, goto: 'c20_f_breakfast', ambientDuring: cold19,
        text: 'Плита разгорается со второй спички. Во дворе тихо. На инее у задней калитки свежие следы босых ног, уходят к полю. Ночью кто-то стоял у калитки. Потом ушёл.', effects: [set20('fd', 'stove'), w20('prints', true), until(20, 7, 0)] },
      { id: 'c20_fd_porridge', label: 'Сварить кашу на всех', when: B19, minutes: 60, activity: 'light', terminal: true, goto: 'c20_f_breakfast',
        text: 'Ты варишь овсянку в самой большой кастрюле Хенрике и мешаешь, чтобы не пригорела. Когда дом просыпается, на плите уже всё готово.', effects: [set20('fd', 'porridge'), npc('henrike', 1), until(20, 7, 0)] },
      { id: 'c20_fd_porch', label: 'Посидеть на крыльце, пока светает', when: B19, minutes: 60, terminal: true, goto: 'c20_f_breakfast', ambientDuring: cold19,
        text: 'Ты сидишь, завернувшись в плед Хенрике. Поле светлеет полосами. Около шести по дальней кромке проходят двое, к шоссе. Ты провожаешь их глазами.', effects: [set20('fd', 'porch'), { body: 'stress', delta: -1 }, until(20, 7, 0)] },
    ] }),

  F({ id: 'c20_f_breakfast', title: 'Завтрак', camp: kitchen14,
    text: [
      { text: 'Пятница, двадцатое. За окном моросит. Каша, хлеб, чай.' },
      { when: henrikeHome, text: 'Хенрике смотрит на часы чаще обычного. В полдень в Люнебург должен прийти транспорт с заменой для Оле.' },
      { when: not(henrikeHome), text: 'В полдень в Люнебург должен прийти транспорт с заменой для Оле. Вы оба думаете об этом и не говорите вслух.' },
    ],
    actions: [
      { id: 'c20_fb_eat', label: 'Поесть со всеми', minutes: 25, terminal: true, outcomes: afterBreakfast, ...tableOnly,
        text: 'Ты ешь не торопясь. Дождь стучит по жести навеса.', effects: [set20('fb', 'eat'), meal('eat'), until(20, 8, 15)] },
      { id: 'c20_fb_pack', label: 'Взять порцию с собой', minutes: 5, terminal: true, outcomes: afterBreakfast, ...tableOnly,
        text: 'Ты заворачиваешь хлеб с кашей в бумагу.', effects: [set20('fb', 'pack'), meal('pack'), until(20, 8, 15)] },
      { id: 'c20_fb_tea', label: 'Только чай', minutes: 10, terminal: true, outcomes: afterBreakfast,
        text: 'Ты пьёшь чай у окна.', effects: [set20('fb', 'tea'), until(20, 8, 15)] },
    ] }),

  // ───────────── A: утро ─────────────
  F({ id: 'c20_f_a_patrol', title: 'Гости', camp: yard14, ambient: rain,
    text: [
      { text: 'В половине девятого у ворот тот же солдат с планшетом, что вчера. Он находит свою вчерашнюю заметку.\n\n— Gäste. Abreise Freitag. — Он смотрит на окна. — Heute ist Freitag.\n\nГости. Отъезд в пятницу. Сегодня пятница.' },
      { when: evaHere, text: 'Эва стоит в дверях кухни с полотенцем и не двигается.' },
      { when: janaHere, text: 'Яна стоит в дверях кухни с полотенцем и не двигается.' },
    ],
    actions: [
      { id: 'c20_fap_add', label: 'Сказать правду: они остаются, впишите', minutes: 20, terminal: true, outcomes: afterMorningA,
        text: 'Солдат вздыхает и вбивает фамилии.\n\n— Warum nicht gleich? — Почему не сразу? — Montag will Brandt jeden sehen.\n\nВ понедельник Брандт хочет видеть каждого.', effects: [set20('fap', 'add'), w20('list', 'all'), until(20, 9, 0)] },
      { id: 'c20_fap_lie', label: 'Сказать: уходят после обеда', minutes: 10, terminal: true, outcomes: afterMorningA,
        text: 'Солдат долго смотрит на тебя. Потом пишет: «Abreise Fr. Nachmittag». И ниже ещё что-то, мелко. Что — ты не видишь.', effects: [set20('fap', 'lie'), w20('list', 'lie2'), until(20, 8, 50)] },
    ] }),

  F({ id: 'c20_f_a_work', title: 'Утро во дворе', camp: yard14, ambient: rain,
    text: [
      { text: 'Морось превращается в дождь. День, когда ничего не надо делать срочно. Таких было мало.' },
      { when: tractorHere, text: 'Трактор под навесом.' },
    ],
    actions: [
      { id: 'c20_faw_stretcher', label: 'Сделать носилки из жердей и мешков', when: not(own20('fd', 'stretcher')), minutes: 80, activity: 'moderate', terminal: true, outcomes: afterMorningA,
        text: 'Две жерди от старой изгороди, три мешка, проволока. Ты проверяешь, ложась сверху. Держит. Носилки стоят в сенях. Хорошо бы не пригодились.', effects: [set20('faw', 'stretcher'), w20('stretcher', true), until(20, 9, 45)] },
      { id: 'c20_faw_tractor', label: 'Перебрать и смазать трактор', when: tractorHere, minutes: 80, activity: 'moderate', terminal: true, outcomes: afterMorningA,
        text: 'Масло, фильтр, клеммы аккумулятора в зелёной корке. Ты чистишь их наждаком. Трактор заводится с первого раза и ровно стучит под навесом.', effects: [set20('faw', 'tractor'), w20('tractor_serviced', true), until(20, 9, 45)] },
      { id: 'c20_faw_diesel', label: 'Выкопать солярку к субботнему обмену', when: v('w.c19_diesel', 'marked'), minutes: 50, activity: 'heavy', terminal: true, outcomes: afterMorningA,
        text: 'Под дождём навоз пахнет ещё сильнее. Канистра выходит из кучи с чавканьем. Литров четырнадцать. Ты ставишь её под навес, подальше от дома.', effects: [set20('faw', 'diesel'), { set: 'w.c19_diesel', value: 'can' }, { give: 'can_diesel_20', fuel: 14 }, until(20, 9, 30)] },
      { id: 'c20_faw_wood', label: 'Наколоть дров на неделю', minutes: 80, activity: 'heavy', terminal: true, outcomes: afterMorningA,
        text: 'Полтора часа ты колешь, пока не перестаёшь чувствовать руки. Поленница у стены сарая выросла на полметра.', effects: [set20('faw', 'wood'), { place: 'firewood', at: 'c3_farm_stock', qty: 20 }, until(20, 9, 45)] },
    ] }),

  F({ id: 'c20_f_a_volker', title: 'Фолькер уходит', camp: yard14, ambient: rain,
    text: [
      { text: 'Фолькер стоит у ворот с тележкой. Брезент натянут, молоток привязан сверху.\n\n— Das Dach hält, — говорит он. — Danke für die Nacht. Zwei Nächte.\n\nКрыша держит. Спасибо за ночь. За две ночи.' },
    ],
    actions: [
      { id: 'c20_fav_stay', label: 'Предложить остаться: работы на хуторе много', minutes: 15, terminal: true, goto: 'c20_f_brandt',
        text: 'Фолькер смотрит на дорогу, туда, где Тоштедт. Долго.\n\n— Bis Montag, — говорит он. — Dann muss ich weiter.\n\nДо понедельника. Потом мне надо дальше.\n\nТележку он закатывает обратно под навес.', effects: [set20('fav', 'stay'), w20('volker_stays', true), until(20, 11, 0)] },
      { id: 'c20_fav_ask', label: 'Спросить ещё раз, кто у него в Тоштедте', when: flag('w.c19_volker_asked'), minutes: 20, terminal: true, goto: 'c20_f_brandt',
        text: 'Он отвечает не сразу и не тебе, а тележке.\n\n— Meine Frau hatte Fieber. Ich habe abgeschlossen. Von außen. Und bin gegangen.\n\nУ жены был жар. Я запер дверь. Снаружи. И ушёл.\n\nОн берётся за ручку тележки и уходит, не попрощавшись.', effects: [set20('fav', 'ask'), w20('volker_truth', true), w20('volker_gone', true), { body: 'stress', delta: 2 }, until(20, 11, 0)] },
      { id: 'c20_fav_bread', label: 'Дать ему хлеба в дорогу и отпустить', minutes: 15, terminal: true, goto: 'c20_f_brandt',
        text: 'Ты выносишь горбушку и два яйца, сваренных вкрутую. Фолькер кладёт их в нагрудный карман и уходит в сторону Тоштедта, под дождём, не оглядываясь.', effects: [set20('fav', 'bread'), w20('volker_gone', true), until(20, 11, 0)] },
    ] }),

  F({ id: 'c20_f_a_booth', title: 'Будка, второй день', location: 'c10_field', camp: tense14, ambient: rain,
    text: [
      { text: 'Ты снова идёшь к будке обходчика. Дождь стучит по крыше будки. Стук изнутри слышен и сквозь него.' },
      { when: v('w.c19_ilse', 'fork'), text: 'Камертон у тебя в кармане. Вчера она слушала.' },
    ],
    actions: [
      { id: 'c20_fab_water', label: 'Снова налить ей воды', minutes: 50, move: true, terminal: true, goto: 'c20_f_brandt',
        text: 'Она пьёт так же, как вчера. Ты стоишь под дождём у окна. Это может продолжаться неделю. Месяц. Ты не знаешь, сколько ты так сможешь.', effects: [set20('fab', 'water'), { body: 'stress', delta: 2 }, until(20, 11, 0)] },
      { id: 'c20_fab_end', label: 'Закончить это', minutes: 60, move: true, activity: 'heavy', terminal: true, goto: 'c20_f_brandt',
        text: 'Ты долго стоишь у двери. Потом отваливаешь шпалу. Хоронишь её у насыпи, где земля мягче, и стоишь над холмиком, пока не промокаешь насквозь.', effects: [set20('fab', 'end'), { set: 'w.c19_ilse', value: 'ended' }, { body: 'stress', delta: 6 }, until(20, 11, 15)] },
      { id: 'c20_fab_leave', label: 'Постоять у окна и уйти', minutes: 40, move: true, terminal: true, goto: 'c20_f_brandt',
        text: 'Ты не входишь. Стоишь, пока стук не становится ровным, как метроном, и уходишь.', effects: [set20('fab', 'leave'), until(20, 10, 50)] },
    ] }),

  F({ id: 'c20_f_a_barn', title: 'Длинный сарай', camp: tense14, ambient: rain,
    text: [
      { text: 'В длинном сарае пахнет соломой и мокрым деревом. На цепях беспокойно: дождь стучит по крыше, и они поворачивают головы на звук.' },
      { when: uteHere, text: 'Уте ходит вдоль стойл с ведром и говорит с каждым по имени.' },
    ],
    actions: [
      { id: 'c20_fba_chains', label: 'Проверить все кольца и замки', minutes: 50, activity: 'moderate', terminal: true, goto: 'c20_f_brandt',
        text: 'Ты дёргаешь каждое кольцо. Одно шатается: дерево вокруг подгнило. Ты перебиваешь его на полметра выше, в крепкую балку. В понедельник Брандт будет дёргать тоже.', effects: [set20('fba', 'chains'), w20('barn_checked', true), until(20, 11, 0)] },
      { id: 'c20_fba_ute', label: 'Помочь Уте с вёдрами', when: uteHere, minutes: 50, activity: 'moderate', terminal: true, goto: 'c20_f_brandt',
        text: 'Ты носишь воду, Уте разливает. На Кае, если он здесь, она задерживается дольше. Говорит ему про дождь и про грушу у ворот, что она в этом году не уродила.', effects: [set20('fba', 'ute'), npc('c14_ute', 2), until(20, 11, 0)] },
      { id: 'c20_fba_leave', label: 'Закрыть дверь и уйти', minutes: 10, terminal: true, goto: 'c20_f_brandt',
        text: 'Ты задвигаешь засов. Звон цепи за дверью не прекращается.', effects: [set20('fba', 'leave'), until(20, 10, 30)] },
    ] }),

  // ───────────── B: утро ─────────────
  F({ id: 'c20_f_b_van', title: 'Фургон прачечной', location: 'c7_farm_lane', ambient: rain,
    text: [
      { text: 'В половине десятого у почтового ящика Людеманов тормозит белый фургон. Из кабины машет рукой шофёр.' },
      { when: { npc: 'pawel', alive: true }, text: 'Павел. Он протягивает тебе конверт из окна.\n\n— Z Lüneburga. Od pani Henrike.\n\nИз Люнебурга. От пани Хенрике.' },
      { when: not({ npc: 'pawel', alive: true }), text: 'Гюнтер, в ватнике. Он протягивает тебе конверт из окна: из Люнебурга.' },
      { when: not(henrikeHome), text: 'Почерк Хенрике, крупный: «Оле держится. Сегодня в полдень привезут замену. Тогда он поедет домой. Я с ним. Х.»' },
      { when: henrikeHome, text: 'Почерк Оле, корявый, с наклоном назад: «Mama. Ich komme, wenn die Neue da ist. Nicht vorher. O.» Мама. Я приеду, когда будет новая. Не раньше.' },
    ],
    actions: [
      { id: 'c20_fbv_letter', label: 'Отдать письмо для Оле', when: v('w.c18_friday', 'write'), minutes: 15, terminal: true, goto: 'c20_f_b_wash',
        text: 'Шесть строк из тетради Хенрике, которые вы писали вдвоём в среду. Последняя: «Дом стоит. Приезжай, когда решишь сам». Конверт уходит в сумку с бельём.', effects: [set20('fbv', 'letter'), w20('letter_sent', true), until(20, 10, 0)] },
      { id: 'c20_fbv_write', label: 'Написать несколько строк Хенрике и Оле', minutes: 20, terminal: true, goto: 'c20_f_b_wash',
        text: 'Ты пишешь прямо на коленях, на обороте конверта: куры живы, крыша держит, в доме люди, ждём. Шофёр терпеливо ждёт с работающим мотором.', effects: [set20('fbv', 'write'), w20('letter_sent', true), until(20, 10, 0)] },
      { id: 'c20_fbv_road', label: 'Спросить шофёра про дорогу на Люнебург', minutes: 15, terminal: true, goto: 'c20_f_b_wash',
        text: 'Шофёр показывает рукой на юго-восток.\n\n— Unter Garlstorf ist seit gestern Stau auf der Autobahn. Leute in Krankenhauskitteln. Ich fahre über Winsen.\n\nПод Гарльсторфом со вчерашнего дня пробка на автобане. Люди в больничных халатах. Я еду через Винзен.', effects: [set20('fbv', 'road'), w20('road_warned', true), until(20, 9, 50)] },
    ] }),

  F({ id: 'c20_f_b_koehler', title: 'Кёлер с хлебом', camp: yard14, ambient: rain,
    text: [
      { text: 'В половине десятого у калитки Кёлер под зонтом, с корзиной. В корзине две буханки, накрытые полотенцем.\n\n— Für euch. Ich backe heute für alle Höfe an der Bahn.\n\nДля вас. Я сегодня пеку на все дворы у насыпи.' },
      { text: '— Brandt fährt heute alle Höfe ab, — добавляет она. — Er sucht Genesene. Und Autos.\n\nБрандт сегодня объезжает все дворы. Ищет переболевших. И машины.' },
    ],
    actions: [
      { id: 'c20_fbk_take', label: 'Взять хлеб и позвать её на чай', minutes: 30, terminal: true, goto: 'c20_f_b_wash',
        text: 'Кёлер пьёт чай на краешке стула, в пальто. Про брата она говорит одно: «Er hat gesungen, früher. Laut». Раньше он пел. Громко.', effects: [set20('fbk', 'take'), { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }, npc('c3_koehler', 2), until(20, 10, 15)] },
      { id: 'c20_fbk_pay', label: 'Отдать ей за хлеб что-нибудь своё', minutes: 15, terminal: true, goto: 'c20_f_b_wash',
        text: 'Ты протягиваешь ей свечу из своего рюкзака. Кёлер вертит её в руках и кладёт в корзину.\n\n— Für Werner, — говорит она. Для Вернера.', effects: [set20('fbk', 'pay'), { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }, { if: { has: 'candles' }, then: [{ take: 'candles' }] }, npc('c3_koehler', 1), until(20, 10, 0)] },
      { id: 'c20_fbk_brandt', label: 'Спросить, что Брандт делает с теми, кто отказывается', minutes: 15, terminal: true, goto: 'c20_f_b_wash',
        text: '— Nichts, — говорит Кёлер. Ничего. — Sie stehen nur nicht mehr auf der Liste.\n\nПросто их больше нет в списке.\n\nОна ставит хлеб на крыльцо и уходит к следующему двору.', effects: [set20('fbk', 'brandt'), w20('refuse_list', true), { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }, until(20, 9, 50)] },
    ] }),

  F({ id: 'c20_f_b_wash', title: 'Стирка', camp: house14,
    text: [
      { text: 'В пятницу стирают. Так было у Хенрике, так и осталось. Таз на табурете у печки, вода греется в выварке.' },
      { when: flag('w.c19_jacket_torn'), text: 'На спинке стула висит куртка {A.gen} с распоротым рукавом.' },
    ],
    actions: [
      { id: 'c20_fbw_sew', label: 'Зашить рукав куртки', when: flag('w.c19_jacket_torn'), minutes: 45, activity: 'light', terminal: true, goto: 'c20_f_brandt',
        text: 'Нитки нашлись в шкатулке Хенрике, суровые. Ты шьёшь в два слоя, мелким стежком. Красиво не выходит, но дыры больше нет.', effects: [set20('fbw', 'sew'), w20('jacket_sewn', true), until(20, 11, 0)] },
      { id: 'c20_fbw_wash', label: 'Постирать на всех, с мылом', when: flag('w.c19_soap'), minutes: 70, activity: 'moderate', terminal: true, goto: 'c20_f_brandt',
        text: 'Хозяйственное мыло пахнет детством. Ты стираешь до красных рук. Через час над печкой на верёвке висят носки, рубашки и чья-то наволочка.', effects: [set20('fbw', 'wash'), { body: 'stress', delta: -2 }, until(20, 11, 0)] },
      { id: 'c20_fbw_plain', label: 'Постирать своё, сколько успеешь', minutes: 50, activity: 'light', terminal: true, goto: 'c20_f_brandt',
        text: 'Без мыла вода только серая. Но джинсы хотя бы не пахнут казармой.', effects: [set20('fbw', 'plain'), until(20, 11, 0)] },
      { id: 'c20_fbw_rest', label: 'Оставить стирку и прилечь', minutes: 50, activity: 'rest', terminal: true, goto: 'c20_f_brandt',
        text: 'Ты ложишься на час. Слышно, как в соседней комнате кто-то полощет бельё и тихо поёт.', effects: [set20('fbw', 'rest'), { body: 'fatigue', delta: -6 }, until(20, 11, 0)] },
    ] }),

  // ───────────── Вместе: Брандт ─────────────
  F({ id: 'c20_f_brandt', title: 'Брандт', camp: yard14, ambient: rain,
    text: [
      { text: 'В одиннадцать к воротам подъезжает пожарный «Мерседес». Брандт выходит сам, в каске, хотя каска сейчас ни к чему.' },
      { text: '— Ich fahre alle Höfe ab. Wer von euch hat es überstanden?\n\nОбъезжаю все дворы. Кто у вас переболел?' },
      { when: barnChained, text: 'Он идёт к длинному сараю, не спрашивая. Заглядывает в щель, считает. Возвращается.\n\n— Montag kontrolliere ich. Heute schaue ich nur.\n\nВ понедельник проверка. Сегодня только смотрю.' },
      { text: 'Потом кивает на Corsa под навесом.\n\n— Und euer Auto. Wenn heute Abend was ist, brauche ich jedes Fahrzeug.\n\nИ ваша машина. Если вечером что-то случится, мне нужна каждая.' },
    ],
    actions: [
      { id: 'c20_fbr_none', label: 'Сказать: у нас никто не переболел', minutes: 10, terminal: true, goto: 'c20_f_radio',
        text: 'Брандт записывает в блокнот: «Lüdemann — keine». Подчёркивает. Потом смотрит на тебя поверх блокнота.\n\n— Und Ole? Der zählt auch.\n\nА Оле? Он тоже считается.', effects: [set20('fbr', 'none'), until(20, 11, 30)] },
      { id: 'c20_fbr_why', label: 'Спросить, зачем ему машины вечером', minutes: 15, terminal: true, goto: 'c20_f_radio',
        text: '— Falls der Transport hängt, — говорит Брандт. Если транспорт застрянет. — Er kommt über Garlstorf. Zwölf Kilometer von hier. Ich hole meine Kinder nicht mit Pferden.\n\nОн идёт через Гарльсторф. В двенадцати километрах. Я не собираюсь возить детей на лошадях.', effects: [set20('fbr', 'why'), w20('brandt_cars', true), until(20, 11, 30)] },
      { id: 'c20_fbr_refuse', label: 'Спросить, что будет с теми, кто откажется ехать в Люнебург', when: B19, minutes: 15, terminal: true, goto: 'c20_f_radio',
        text: 'Брандт закрывает блокнот.\n\n— Niemand wird gezwungen. — Пауза. — Aber Rationen gibt es für die, die helfen.\n\nНикого не заставляют. Но пайки — тем, кто помогает.', effects: [set20('fbr', 'refuse'), w20('refuse_list', true), npc('c16_brandt', -1), until(20, 11, 30)] },
      { id: 'c20_fbr_barn', label: 'Показать ему сарай как следует', when: all(A19, barnChained), minutes: 25, terminal: true, goto: 'c20_f_radio',
        text: 'Ты открываешь дверь настежь. Брандт идёт вдоль стойл, дёргает кольца, одно за другим.\n\n— Gut gemacht, — говорит он сухо. — Montag trotzdem.\n\nХорошо сделано. Всё равно в понедельник.', effects: [set20('fbr', 'barn'), npc('c16_brandt', 2), until(20, 11, 45)] },
      { id: 'c20_fbr_silent', label: 'Промолчать', minutes: 10, terminal: true, goto: 'c20_f_radio',
        text: 'Брандт ждёт ответа, не дожидается и садится в машину. «Мерседес» уезжает к следующему двору.', effects: [set20('fbr', 'silent'), until(20, 11, 30)] },
    ] }),

  F({ id: 'c20_f_radio', title: 'Радио в полдень', camp: kitchen14,
    text: [
      { text: 'В двенадцать на кухне включают радио Хенрике. NDR Info, средние волны, треск.' },
      { text: '«…Hilfstransport aus Hannover verspätet sich. Die A7 zwischen Egestorf und Garlstorf ist in Richtung Norden gesperrt. Wir bitten die Bevölkerung, den Bereich zu meiden…»' },
      { text: 'Транспорт из Ганновера задерживается. A7 между Эгесторфом и Гарльсторфом перекрыта на север. Населению просьба не приближаться.' },
    ],
    actions: [
      { id: 'c20_fr_listen', label: 'Слушать дальше', minutes: 20, terminal: true, goto: 'c20_f_noon',
        text: 'Дальше передают список пунктов, где принимают переболевших. Люнебург первый. Йестебург четвёртый. Про транспорт больше ни слова.', effects: [set20('fr', 'listen'), until(20, 12, 50)] },
      { id: 'c20_fr_off', label: 'Выключить', minutes: 5, terminal: true, goto: 'c20_f_noon',
        text: 'Ты поворачиваешь ручку. В кухне становится тихо, только дождь и часы.', effects: [set20('fr', 'off'), until(20, 12, 50)] },
      { id: 'c20_fr_tell', label: 'Пойти сказать остальным', minutes: 15, terminal: true, goto: 'c20_f_noon',
        outcomes: [
          { id: 'henrike', when: henrikeHome, text: 'Хенрике выслушивает и садится на табурет.\n\n— Dann kommt der Junge heute nicht.\n\nЗначит, сегодня мальчик не приедет.\n\nБольше она ничего не говорит до обеда.', effects: [set20('fr', 'tell'), npc('henrike', 1)] },
          { id: 'ute', when: uteHere, text: 'Уте кивает, будто ждала этого.\n\n— Autobahn, — говорит она. — Da sind sie alle hingegangen. Zum Lärm.\n\nАвтобан. Туда они все и пошли. На шум.', effects: [set20('fr', 'tell')] },
          { id: 'none', text: 'Ты говоришь тем, кто на кухне. Никто не отвечает. Все смотрят на радио, хотя оно уже молчит.', effects: [set20('fr', 'tell')] },
        ], effects: [until(20, 12, 50)] },
    ] }),

  F({ id: 'c20_f_noon', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Картошка, хлеб Кёлер, суп из того, что есть. За столом говорят про дождь и про кур. Про автобан не говорит никто.' },
    ],
    actions: [
      { id: 'c20_fn_eat', label: 'Поесть', minutes: 25, terminal: true, outcomes: afterNoon, ...tableOnly,
        text: 'Ты ешь, и еда кажется вкуснее, чем вчера. Может быть, потому что вечер неизвестно какой.', effects: [set20('fn', 'eat'), meal('eat'), until(20, 13, 40)] },
      { id: 'c20_fn_pack', label: 'Отложить порцию на вечер', minutes: 5, terminal: true, outcomes: afterNoon, ...tableOnly,
        text: 'Ты заворачиваешь картошку в бумагу и кладёшь в карман куртки.', effects: [set20('fn', 'pack'), meal('pack'), until(20, 13, 40)] },
      { id: 'c20_fn_skip', label: 'Только хлеб', minutes: 10, terminal: true, outcomes: afterNoon,
        text: 'Ты отламываешь кусок и выходишь на крыльцо.', effects: [set20('fn', 'skip'), until(20, 13, 30)] },
    ] }),

  F({ id: 'c20_f_a_afternoon', title: 'После обеда', camp: yard14, ambient: rain,
    text: [{ text: 'Дождь стихает. Небо над полем светлеет к западу, а с востока, со стороны автобана, тяжёлое и серое.' }],
    actions: [
      { id: 'c20_faa_gun', label: 'Разобрать и проверить ружьё', when: gunHere, minutes: 40, terminal: true, goto: 'c20_f_tobias',
        text: 'Ты раскладываешь ружьё на газете. Правый ствол ходит чисто. Левый курок взводится через раз: пружина устала. Значит, по-настоящему у тебя один выстрел, и потом второй, если повезёт.', effects: [set20('faa', 'gun'), w20('left_barrel', true), until(20, 14, 20)] },
      { id: 'c20_faa_gate', label: 'Укрепить заднюю калитку', minutes: 40, activity: 'moderate', terminal: true, goto: 'c20_f_tobias',
        text: 'Ты прибиваешь поперечину и вешаешь второй засов. Если кто-то снова встанет у калитки ночью, она хотя бы не откроется от толчка.', effects: [set20('faa', 'gate'), w20('gate_fixed', true), until(20, 14, 20)] },
      { id: 'c20_faa_sleep', label: 'Поспать час', minutes: 5, terminal: true, goto: 'c20_f_tobias',
        text: 'Ты ложишься и засыпаешь сразу. Тело берёт своё, пока дают.', effects: [set20('faa', 'sleep'), until(20, 14, 20, true)] },
    ] }),

  F({ id: 'c20_f_b_nina', title: 'Нина', camp: house14,
    text: [{ text: 'Нина сидит на подоконнике в своей комнате и смотрит на восток.\n\n— Da hinten ist die Autobahn, oder? — спрашивает она. Там автобан, да? — Papa hat da immer geflucht. Stau.\n\nПапа всегда там ругался. Пробки.' }],
    actions: [
      { id: 'c20_fbn_sit', label: 'Сесть рядом и смотреть вместе', minutes: 30, terminal: true, goto: 'c20_f_tobias',
        text: 'Вы смотрите на серое небо над лесом. Нина рассказывает, как отец пел в машине и путал слова. Ты смеёшься. Она тоже, впервые за неделю.', effects: [set20('fbn', 'sit'), npc('c7_nina', 2), { body: 'stress', delta: -2 }, until(20, 14, 20)] },
      { id: 'c20_fbn_task', label: 'Попросить её помочь собрать аптечку', minutes: 30, terminal: true, goto: 'c20_f_tobias',
        text: 'Нина раскладывает на кровати всё, что есть: бинты, пластыри, таблетки. Пишет на каждой упаковке фломастером, от чего. Получается аккуратно, как в тетради.', effects: [set20('fbn', 'task'), w20('kit_ready', true), npc('c7_nina', 1), until(20, 14, 20)] },
    ] }),

  F({ id: 'c20_f_b_girl', title: 'Новенькая', camp: house14,
    text: [
      { when: evaHere, text: 'Эва стоит у окна кухни с недочищенной картофелиной в руке.\n\n— Wenn ihr heute Abend wegfahrt, nehmt mich mit. Ich kann Wunden verbinden. Ich habe meinem Vater die Hand verbunden, als es passiert ist.\n\nЕсли вечером поедете, возьмите меня. Я умею перевязывать. Я перевязывала отцу руку, когда это случилось.' },
      { when: janaHere, text: 'Яна стоит у окна кухни с недочищенной картофелиной в руке.\n\n— Wenn ihr heute Abend wegfahrt, nehmt mich mit. Ich kann Wunden verbinden. Ich habe Erste Hilfe gemacht, für den Führerschein.\n\nЕсли вечером поедете, возьмите меня. Я умею перевязывать. Сдавала первую помощь на права.' },
    ],
    actions: [
      { id: 'c20_fbg_no', label: 'Сказать: ты нужна здесь, на хуторе', minutes: 15, terminal: true, goto: 'c20_f_tobias',
        text: 'Она кивает слишком быстро. Картофелину дочищает уже молча, но не отворачивается.', effects: [set20('fbg', 'no'), until(20, 14, 10)] },
      { id: 'c20_fbg_maybe', label: 'Сказать: если поедем — решим вместе', minutes: 15, terminal: true, goto: 'c20_f_tobias',
        text: '— Gut, — говорит она. Хорошо. И идёт искать свою куртку, на всякий случай.', effects: [set20('fbg', 'maybe'), w20('girl_ready', true), until(20, 14, 10)] },
    ] }),

  F({ id: 'c20_f_b_ute', title: 'Уте', camp: house14,
    text: [
      { when: uteHere, text: 'Уте сидит у печки и вяжет. Не поднимая глаз от спиц, говорит:\n\n— Du schaust den ganzen Tag nach Osten. Wie ich früher nach der Elf.\n\nТы весь день смотришь на восток. Как я раньше на одиннадцатый.' },
      { when: not(uteHere), text: 'В доме тихо. Ты стоишь у окна и смотришь на восток, туда, где за лесом автобан.' },
    ],
    actions: [
      { id: 'c20_fbu_sit', label: 'Сесть рядом', when: uteHere, minutes: 30, terminal: true, goto: 'c20_f_tobias',
        text: 'Уте вяжет и рассказывает, как Кай в молодости гнал машину ночью из Гамбурга, потому что она рожала Яннеса. Сто восемьдесят по автобану. «Er hat geflucht wie ein Kutscher». Ругался, как извозчик.', effects: [set20('fbu', 'sit'), npc('c14_ute', 2), until(20, 14, 20)] },
      { id: 'c20_fbu_ask', label: 'Спросить, как она выдерживала ждать', when: uteHere, minutes: 20, terminal: true, goto: 'c20_f_tobias',
        text: '— Gar nicht, — говорит Уте. Никак. — Man wartet und hält es nicht aus. Beides gleichzeitig.\n\nЖдёшь и не выдерживаешь. Одновременно.', effects: [set20('fbu', 'ask'), until(20, 14, 10)] },
      { id: 'c20_fbu_window', label: 'Постоять у окна', when: not(uteHere), minutes: 20, terminal: true, goto: 'c20_f_tobias',
        text: 'Над лесом поднимается тонкая серая струйка дыма. Может быть, кто-то топит печь. Может быть, нет.', effects: [set20('fbu', 'window'), until(20, 14, 10)] },
    ] }),

  // ───────────── Вместе: известие ─────────────
  F({ id: 'c20_f_tobias', title: 'Известие', camp: yard14, ambient: day19,
    text: [
      { text: 'Без двадцати три у ворот тормозит «Вольф». Тобиас не глушит мотор.\n\n— Der Transport steht seit zehn Uhr vierzig an der Ausfahrt Garlstorf. Personen auf der Fahrbahn, ein LKW umgekippt. Seit Viertel nach zwölf kein Funk.\n\nТранспорт с десяти сорока стоит на съезде у Гарльсторфа. Люди на проезжей части, грузовик перевернулся. С четверти первого связи нет.' },
      { text: '— Brandt sammelt um vier an der Feuerwehr alle mit Autos. — Он смотрит на Corsa. — Zwölf Kilometer. Ich sage nicht, dass ihr müsst.\n\nБрандт в четыре собирает у пожарной части всех, у кого машины. Двенадцать километров. Я не говорю, что вы обязаны.' },
    ],
    actions: [
      { id: 'c20_ft_lea', label: 'Спросить, что с донором из Ганновера', minutes: 10, terminal: true, goto: 'c20_f_prepare',
        text: '— Keiner weiß es. Sie saß im zweiten LKW. — Тобиас трёт глаза. — Wenn sie noch da ist, ist sie wichtiger als alles andere auf dem Laster.\n\nНикто не знает. Она сидела во втором грузовике. Если она ещё там, она важнее всего остального в кузове.', effects: [set20('ft', 'lea'), w20('lea_second_truck', true), until(20, 14, 55)] },
      { id: 'c20_ft_who', label: 'Спросить, кто ещё поедет', minutes: 10, terminal: true, goto: 'c20_f_prepare',
        text: '— Brandt, drei Feuerwehrleute, zwei Bauern mit Treckern. Und wir, zwei Wagen. — Он пожимает плечами. — Mehr nicht.\n\nБрандт, трое пожарных, двое фермеров на тракторах. И мы, две машины. Больше никого.', effects: [set20('ft', 'who'), until(20, 14, 55)] },
      { id: 'c20_ft_water', label: 'Вынести ему воды и промолчать', minutes: 10, terminal: true, goto: 'c20_f_prepare',
        text: 'Тобиас пьёт из горлышка, возвращает бутылку и уезжает к следующему двору. В зеркале ты видишь, как он поднимает руку.', effects: [set20('ft', 'water'), npc('c15_tobias', 1), until(20, 14, 55)] },
    ] }),

  F({ id: 'c20_f_prepare', title: 'Перед вечером', camp: house14,
    text: [
      { text: 'До сумерек полтора часа. Что бы вы ни решили, лучше быть готовыми.' },
      { when: all(flag('w.c19_jacket_torn'), not(flag('w.c20_jacket_sewn'))), text: 'Рукав куртки {A.gen} всё ещё распорот.' },
    ],
    actions: [
      { id: 'c20_fp_gear', label: 'Собрать всё нужное: фонарь, верёвку, бинты, воду', minutes: 25, terminal: true, goto: 'c20_checkpoint',
        text: 'Ты складываешь у двери: фонарь с запасными батарейками, верёвку, бинты, две бутылки воды, перчатки. Проверяешь фонарь. Светит.', effects: [set20('fp', 'gear'), w20('gear_ready', true), { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
      { id: 'c20_fp_patch', label: 'Наскоро заклеить рукав {A.gen} скотчем', when: all(B19, flag('w.c19_jacket_torn'), not(flag('w.c20_jacket_sewn'))), minutes: 15, terminal: true, goto: 'c20_checkpoint',
        text: 'Армированный скотч в три слоя. Не шов, но ткань больше не расходится.', effects: [set20('fp', 'patch'), w20('jacket_taped', true), { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
      { id: 'c20_fp_eat', label: 'Поесть и согреться: вечер будет длинным', minutes: 25, terminal: true, goto: 'c20_checkpoint',
        text: 'Ты доедаешь то, что было, и пьёшь горячий чай, пока не перестают мёрзнуть пальцы.', effects: [set20('fp', 'eat'), { body: 'hunger', delta: -15 }, { body: 'thirst', delta: -20 }, { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
      { id: 'c20_fp_sit', label: 'Посидеть пять минут молча', minutes: 10, terminal: true, goto: 'c20_checkpoint',
        text: 'Ты садишься на ступеньку крыльца. Где-то на востоке, далеко, коротко гудит сирена и замолкает.', effects: [set20('fp', 'sit'), { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
    ] }),
];
