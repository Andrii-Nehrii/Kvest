import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import {
  A19, B19, S20, barnChained, byGirl, evaHere, girlHere, henrikeHome, jensBarn, npc, own20, set20, textByGirl, until, uteHere, w20,
} from './point19';
import { afterMorningA } from './day20f';

// Участок 20, добавленный объём (12.11, по оценке владельца «объём маленький»).
// Люнебург: плац на рассвете, вещи Оле, склад (A), обход и койка для замены (B), сетка прачечной (A), шарф (B), сирена,
// после прорыва и просьба Алерс. Хутор: утро после 19-й, лесополоса (A), жар у новенькой и кладовка (B), двор после нападения.
const lue = 'c18_lueneburg';
const lueCamp = { at: lue, stock: 'c3_farm_stock', rest: false } as const;
const yardAir = { tempC: 4, outdoor: true, wet: false };
const rain = { tempC: 5, outdoor: true, wet: true };
const L = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S20({ ...scene, for: 'any', chapter: 'ch3', location: lue, camp: scene.camp ?? lueCamp, safe: false });
const F = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S20({ ...scene, for: 'any', chapter: 'ch3' });
const henrikeLue: Cond = { npc: 'henrike', alive: true, at: lue };
const flueBad: Cond = any(v('w.c19_flue', 'left'), v('w.c19_flue', 'half'));
const heavyHead: Effect = { if: flueBad, then: [{ body: 'fatigue', delta: 5 }, { body: 'stress', delta: 1 }] };
const dogHere: Cond = any(v('w.c19_dog', 'house'), v('w.c19_dog', 'gate'));
const hurt: Cond = own20('d2', 'hurt');
const girlNpc = (trust: number): Effect => ({ if: evaHere, then: [npc('c8_eva', trust)] });
const giveAway = (type: string, qty: number): Effect => ({ if: { stocked: type, qty, at: 'c3_farm_stock' },
  then: [{ unstock: type, qty, at: 'c3_farm_stock' }, { take: type, qty }] });
const toVan = [{ id: 'van', when: flag('w.c18_post'), goto: 'c20_f_b_van', effects: [until(20, 9, 30)] }, { id: 'koehler', goto: 'c20_f_b_koehler', effects: [until(20, 9, 30)] }];
const toRain = [{ id: 'rain', goto: 'c20_f_b_rain' }];
const afterYard = [{ id: 'a', when: A19, goto: 'c20_f_a_house' }, { id: 'b', goto: 'c20_f_b_food' }];

export const day20XScenes: Scene[] = [
  // ───────────── Люнебург, общее утро ─────────────
  L({ id: 'c20_g_dawn', title: 'Плац', ambient: yardAir,
    text: [
      { text: 'На плацу горят прожекторы. Ворота открываются, и въезжает грузовик ночного патруля, забрызганный грязью до брезента.' },
      { text: 'Солдаты откидывают борт. Двоих в больничных рубашках сгружают на брезент у стены, как мешки. Третьего, солдата с замотанным предплечьем, ведут под руки к отдельному бараку за сеткой. Он не сопротивляется. Только повторяет одно и то же:\n\n— Es war nur ein Kratzer. Nur ein Kratzer.\n\nЭто была только царапина. Только царапина.' },
      { when: henrikeLue, text: 'Хенрике останавливается и смотрит, пока её не берут под руку.' },
      { when: flueBad, text: 'Голова у тебя тяжёлая с ночи, во рту привкус железа. В машине было легче, чем дома.' },
    ],
    actions: [
      { id: 'c20_gd_ask', label: 'Спросить сержанта, откуда они', minutes: 10, terminal: true, goto: 'c20_g_ole',
        text: '— Von der B4. Bei Melbeck. — Сержант сплёвывает. — Die laufen Richtung Stadt. Jede Nacht mehr. Die Bänder sind alle vom Klinikum Buchholz.\n\nС B4, у Мельбека. Идут в сторону города. Каждую ночь больше. Браслеты у всех из больницы Бухгольца.', effects: [set20('gd', 'ask'), set20('warned', true), heavyHead] },
      { id: 'c20_gd_look', label: 'Подойти посмотреть на браслеты', minutes: 10, terminal: true, goto: 'c20_g_ole',
        text: 'На запястье ближнего белый браслет: «Klinikum Buchholz, Station 4». В углу шариковой ручкой, мелко, буква «P». Ты отходишь, пока солдат не оборачивается.', effects: [set20('gd', 'look'), set20('warned', true), w20('saw_p_band', true), { body: 'stress', delta: 2 }, heavyHead] },
      { id: 'c20_gd_henrike', label: 'Увести Хенрике в тепло', when: henrikeLue, minutes: 10, terminal: true, goto: 'c20_g_ole',
        text: 'Хенрике идёт послушно, не оборачиваясь. В дверях донорского блока она поправляет платок и говорит: «Er darf das nicht sehen». Он не должен этого видеть.', effects: [set20('gd', 'henrike'), npc('henrike', 1), heavyHead] },
      { id: 'c20_gd_away', label: 'Отвернуться и идти дальше', minutes: 5, terminal: true, goto: 'c20_g_ole',
        text: 'Ты смотришь под ноги, на мокрый асфальт плаца. Голос того солдата слышно до самых дверей.', effects: [set20('gd', 'away'), heavyHead] },
    ] }),

  L({ id: 'c20_g_locker', title: 'Вещи Оле',
    text: [
      { text: 'Оле просит принести из казармы его вещи: свитер, бритву, книгу. Дневальный пускает вас в мужскую казарму на пять минут и стоит в дверях.' },
      { text: 'Шкафчик Оле у окна. Всё сложено так, как складывают люди, которые служили: стопкой, по краю. Свитер, бритва, книга про тракторы. Под книгой тетрадь в клетку.' },
      { text: 'В тетради даты и цифры. «11.11 — 450». «13.11 — 450». «15.11 — 450». Потом каждый день, а «17.11» дважды. Последняя строка вчерашняя, почерк поплыл: «19.11 — 500. Schwindlig». Голова кружится.' },
    ],
    actions: [
      { id: 'c20_gl_take', label: 'Забрать тетрадь вместе с вещами', when: A19, minutes: 10, terminal: true, goto: 'c20_g_breakfast',
        text: 'Ты кладёшь тетрадь под свитер. Дневальный смотрит в коридор и ничего не видит.', effects: [set20('gl', 'take'), w20('ole_book', true), until(20, 8, 0)] },
      { id: 'c20_gl_back', label: 'Положить тетрадь на место', when: A19, minutes: 5, terminal: true, goto: 'c20_g_breakfast',
        text: 'Ты кладёшь тетрадь обратно, под книгу, ровно так, как она лежала. Это его счёт, не твой.', effects: [set20('gl', 'back'), until(20, 8, 0)] },
      { id: 'c20_gl_count', label: 'Пересчитать, сколько раз за девять дней', when: B19, minutes: 10, terminal: true, goto: 'c20_g_breakfast',
        text: 'Ты считаешь, ведя пальцем по строкам. Девять раз за девять дней. Почти четыре литра. В буклете, который лежал в Бармбеке на почте, было написано: «не чаще раза в неделю».', effects: [set20('gl', 'count'), w20('b_book', true), { body: 'stress', delta: 2 }, until(20, 8, 0)] },
      { id: 'c20_gl_close', label: 'Закрыть шкафчик: это не ваше', minutes: 5, terminal: true, goto: 'c20_g_breakfast',
        text: 'Ты берёшь свитер, бритву и книгу. Тетрадь остаётся лежать в шкафчике. Дверца закрывается с лязгом.', effects: [set20('gl', 'close'), until(20, 8, 0)] },
    ] }),

  // ───────────── Люнебург, A ─────────────
  L({ id: 'c20_g_a_cargo', title: 'Склад', ambient: yardAir,
    text: [
      { text: 'На обратном пути через плац тебя окликает фельдфебель у открытого грузовика.\n\n— Sie da! Zehn Minuten anpacken? Gibt was dafür.\n\nЭй, вы! Помочь десять минут? Кое-что за это дадим.' },
      { text: 'В кузове коробки: армейские пайки в зелёной плёнке, бинты, упаковки воды. Таскать на склад, за сетку. Двое солдат уже таскают, третьего не хватает.' },
    ],
    actions: [
      { id: 'c20_gc_work', label: 'Таскать и взять, что дадут', minutes: 25, activity: 'moderate', terminal: true, goto: 'c20_g_ahlers',
        text: 'Двадцать минут ты бегаешь с коробками по скользкому плацу. Под конец фельдфебель суёт тебе в руки два пайка.\n\n— Für die Rückfahrt.\n\nНа обратную дорогу.', effects: [set20('gc', 'work'), { give: 'c20_epa', qty: 2 }, { body: 'fatigue', delta: 4 }] },
      { id: 'c20_gc_steal', label: 'Таскать, а пачку бинтов спрятать под куртку', minutes: 25, activity: 'moderate', risky: true, terminal: true, goto: 'c20_g_ahlers',
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 4, uses: ['focus'] }, text: 'Пачка бинтов уходит под куртку, когда фельдфебель отворачивается расписаться. Под конец он даёт тебе ещё и паёк. Бинты давят на рёбра всю дорогу до блока.', effects: [set20('gc', 'steal'), { give: 'bandages', qty: 2 }, { give: 'c20_epa' }, { body: 'fatigue', delta: 4 }] },
          { id: 'caught', text: 'Фельдфебель хлопает тебя по куртке, как по дверце машины. Пачка падает на плац.\n\n— Raus. Und lass dich hier nicht mehr sehen.\n\nВон. И чтоб я тебя здесь больше не видел.\n\nСолдаты у грузовика смотрят тебе в спину.', effects: [set20('gc', 'caught'), w20('cargo_caught', true), { body: 'stress', delta: 3 }] },
        ] },
      { id: 'c20_gc_fuel', label: 'Таскать, а вместо пайка попросить бензина', minutes: 25, activity: 'moderate', terminal: true, goto: 'c20_g_ahlers',
        text: 'Фельдфебель смеётся.\n\n— Benzin? Gibt’s nur für Brandt.\n\nБензин? Только для Брандта.\n\nНо потом наливает из бидона в пластиковую бутылку полтора литра. Ты относишь бутылку к машине и выливаешь в бак, через воронку из листка бумаги.', effects: [set20('gc', 'fuel'), { refuel: 'opel_corsa', liters: 1.5 }, { body: 'fatigue', delta: 4 }] },
      { id: 'c20_gc_no', label: 'Сказать, что тебя ждут у врача', minutes: 5, terminal: true, goto: 'c20_g_ahlers',
        text: 'Фельдфебель машет рукой и кричит кому-то другому.', effects: [set20('gc', 'no')] },
    ] }),

  L({ id: 'c20_g_a_fence', title: 'Ворота прачечной', ambient: yardAir,
    text: [
      { text: 'Возвращаясь через хозяйственный двор, ты замечаешь то, на что утром не {m:смотрел|смотрела}. Задние ворота двора, на поле, стоят открытыми на деревянном клине: для фургона прачечной, который вернётся днём.' },
      { text: 'За воротами поле, за полем лесополоса и шоссе. Часового нет: он у шлагбаума, по ту сторону корпусов. Между верёвками с бельём ходят женщины с корзинами.' },
    ],
    actions: [
      { id: 'c20_gf_close', label: 'Закрыть ворота и заложить засов', minutes: 15, activity: 'moderate', terminal: true, goto: 'c20_g_siren',
        text: 'Створки тяжёлые, железные, петли визжат. Ты выбиваешь клин ногой, сводишь створки и задвигаешь засов. Клин суёшь в карман куртки. Одна из женщин у верёвок смотрит на тебя и кивает.', effects: [set20('gf', 'close'), w20('lue_gate', 'closed')] },
      { id: 'c20_gf_tell', label: 'Сказать дежурному у шлагбаума', minutes: 15, terminal: true, goto: 'c20_g_siren',
        text: 'Дежурный записывает в журнал, не поднимая головы.\n\n— Wird gemeldet.\n\nБудет доложено.\n\nТы смотришь, как он закрывает журнал и кладёт сверху бутерброд.', effects: [set20('gf', 'tell'), w20('lue_gate', 'told')] },
      { id: 'c20_gf_doors', label: 'Запомнить, где какие двери и что запирается', minutes: 10, terminal: true, goto: 'c20_g_siren',
        text: 'Дверь штаба железная, с засовом изнутри. Детская стеклянная, на ручке. Женский корпус деревянный, на щеколде. Донорский блок железный. Ты повторяешь это про себя, как таблицу умножения.', effects: [set20('gf', 'doors'), set20('knows_doors', true)] },
      { id: 'c20_gf_go', label: 'Не твоё дело: у них есть солдаты', minutes: 2, terminal: true, goto: 'c20_g_siren',
        text: 'Ты проходишь мимо. Клин под створкой мокрый и тёмный.', effects: [set20('gf', 'go')] },
    ] }),

  // ───────────── Люнебург, B ─────────────
  L({ id: 'c20_g_b_round', title: 'Обход',
    text: [
      { text: 'Сестра из детской собирается на обход с градусником и тетрадью и кивает тебе:\n\n— Halten Sie die Liste.\n\nПодержите список.' },
      { text: 'Восемь кроватей. Восемь фамилий, у каждой столбик чисел: температура утром и вечером. И буква «P» с датой. У кого-то «P» одна, у кого-то три.' },
      { text: 'Девочка у окна улыбается тебе и спрашивает, когда придёт новая плазма. У неё тридцать семь и две. Три дня назад было сорок.' },
    ],
    actions: [
      { id: 'c20_gr_read', label: 'Пока сестра меряет, прочитать столбики до конца', minutes: 15, terminal: true, goto: 'c20_g_b_drk',
        text: 'Ты ведёшь пальцем по строкам. После каждой «P» температура падает. Через два дня поднимается снова, чуть выше прежнего. Ещё «P», и снова падает. Промежутки с каждым разом короче. У мальчика в углу последняя «P» была вчера вечером. Сегодня утром у него тридцать восемь и девять.', effects: [set20('gr', 'read'), w20('b_chart', true), { body: 'stress', delta: 2 }] },
      { id: 'c20_gr_kids', label: 'Держать список и разговаривать с детьми', minutes: 15, terminal: true, goto: 'c20_g_b_drk',
        text: 'Ты называешь каждому его число, как хорошую новость. Дети спрашивают про собак, про снег и когда домой. Девочка у окна дарит тебе звезду, сложенную из обёртки от пластыря.', effects: [set20('gr', 'kids'), { body: 'stress', delta: -1 }] },
      { id: 'c20_gr_ask', label: 'Спросить, почему у мальчика в углу снова жар', minutes: 10, terminal: true, goto: 'c20_g_b_drk',
        text: 'Сестра понижает голос и смотрит на дверь.\n\n— Die Abstände werden kürzer. Bei allen. Sagen Sie das nicht den Müttern.\n\nПромежутки становятся короче. У всех. Не говорите матерям.', effects: [set20('gr', 'ask'), w20('b_chart', true)] },
    ] }),

  L({ id: 'c20_g_b_bed', title: 'Койка для замены',
    text: [
      { text: 'В донорском блоке сестра перестилает пустую койку рядом с Оле: свежая простыня, подушка, второе одеяло. На спинке уже висит табличка: «Lea, Hannover».' },
      { text: '— Für die Neue, — говорит сестра. — Wenn sie kommt.\n\nДля новенькой. Если приедет.' },
      { text: 'Оле лежит лицом к стене. На сгибе локтя у него пластырь на пластыре.' },
    ],
    actions: [
      { id: 'c20_gbb_help', label: 'Помочь перестелить', minutes: 10, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты держишь углы, пока сестра заправляет. Простыня пахнет хлоркой. Сестра говорит, что Лее двадцать четыре, что она ветеринар и что в Ганновере у неё остался кот, которого некому кормить.', effects: [set20('gbb', 'help'), w20('lea_known', true)] },
      { id: 'c20_gbb_gift', label: 'Положить ей под подушку шоколадку', when: { has: 'chocolate' }, minutes: 5, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты кладёшь плитку под подушку, углом к стене. Пусть первое, что она найдёт здесь, будет не игла.', effects: [set20('gbb', 'gift'), { take: 'chocolate' }, w20('lea_gift', true)] },
      { id: 'c20_gbb_ole', label: 'Сесть к Оле, пока сестра занята', minutes: 15, terminal: true, goto: 'c20_g_ahlers',
        text: 'Оле не поворачивается.\n\n— Sie hat einen Namen, — говорит он стене. — Ich wollte keinen Namen wissen.\n\nУ неё есть имя. Я не хотел знать имени.\n\nТы сидишь рядом, пока он не засыпает.', effects: [set20('gbb', 'ole'), npc('ole', 1)] },
      { id: 'c20_gbb_go', label: 'Не мешать', minutes: 5, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты выходишь в коридор. За спиной сестра взбивает подушку, долго, как будто от этого что-то зависит.', effects: [set20('gbb', 'go')] },
    ] }),

  L({ id: 'c20_g_b_scarf', title: 'Шарф',
    text: [
      { text: 'У стеклянной двери детской стоят матери. Внутрь им нельзя: только персоналу, и то по часам. Они смотрят через стекло молча, по очереди.' },
      { text: 'Одна из них, в мужской куртке до колен, узнаёт тебя: утром ты {m:выходил|выходила} оттуда. Она протягивает полосатый вязаный шарф с кисточками.\n\n— Für Jonas. Bett drei. Er friert immer am Hals. Bitte.\n\nДля Йонаса. Третья кровать. У него всегда мёрзнет шея. Пожалуйста.' },
    ],
    actions: [
      { id: 'c20_gsc_take', label: 'Взять шарф и отнести', minutes: 10, terminal: true, goto: 'c20_g_b_donor',
        text: 'Сестра у двери хмурится, потом встряхивает шарф над ведром и сама повязывает его мальчику на третьей кровати. Мать за стеклом прижимает ладонь к стеклу и не убирает, пока ты не выходишь.', effects: [set20('gsc', 'take'), { body: 'stress', delta: -1 }] },
      { id: 'c20_gsc_ask', label: 'Спросить, сколько Йонас уже здесь', minutes: 10, terminal: true, goto: 'c20_g_b_donor',
        outcomes: [
          { id: 'chart', when: flag('w.c20_b_chart'), text: '— Seit Montag. Dreimal Plasma. — Она улыбается. — Er isst wieder.\n\nС понедельника. Три раза плазма. Он снова ест.\n\nТретья кровать. Ты помнишь её столбик: три «P», и промежутки всё короче. Шарф ты берёшь молча.', effects: [set20('gsc', 'ask')] },
          { id: 'plain', text: '— Seit Montag. Dreimal Plasma. — Она улыбается. — Er isst wieder.\n\nС понедельника. Три раза плазма. Он снова ест.\n\nШарф ты относишь, и сестра повязывает его мальчику сама.', effects: [set20('gsc', 'ask')] },
        ] },
      { id: 'c20_gsc_rule', label: 'Сказать, что нельзя: вещи снаружи не пускают', minutes: 5, terminal: true, goto: 'c20_g_b_donor',
        text: 'Она кивает, будто знала. Шарф она наматывает себе на руку, виток за витком, и остаётся стоять у стекла.', effects: [set20('gsc', 'rule')] },
    ] }),

  // ───────────── Люнебург, общее: сирена и после ─────────────
  L({ id: 'c20_g_siren', title: 'Сирена', ambient: yardAir,
    text: [
      { text: 'Около полудня над казармой воет сирена. Длинный гудок, короткий, длинный. Люди на плацу замирают, потом бегут к корпусам. Солдат у столовой машет руками:\n\n— Rein! Alle rein!\n\nВнутрь! Все внутрь!' },
      { text: 'Через три минуты сирена смолкает. Громкоговоритель на столбе хрипит: «Übung. Ende der Übung». Учения. Конец учений.' },
      { text: 'Люди выходят обратно медленно и переглядываются. В день, когда ждут транспорт, учения просто так не устраивают.' },
    ],
    actions: [
      { id: 'c20_gs_watch', label: 'Смотреть, куда бегут солдаты', minutes: 10, terminal: true, goto: 'c20_g_wait',
        text: 'Двое бегут к задним воротам прачечной, двое к детской, остальные к шлагбауму. Ворота прачечной проверяют пинком: заперты или нет. Ты запоминаешь.', effects: [set20('gs', 'watch'), set20('knows_doors', true)] },
      { id: 'c20_gs_ask', label: 'Спросить солдата, зачем учения', minutes: 10, terminal: true, goto: 'c20_g_wait',
        text: '— Die Kolonne steht. Bei Garlstorf, — бросает он на бегу. И сразу: — Das hab ich nicht gesagt.\n\nКолонна стоит. У Гарльсторфа. Этого я не говорил.', effects: [set20('gs', 'ask'), w20('heard_garlstorf', true)] },
      { id: 'c20_gs_henrike', label: 'Держаться рядом с Хенрике', when: henrikeLue, minutes: 10, terminal: true, goto: 'c20_g_wait',
        text: 'Хенрике стоит у стены прямая, как в церкви. Когда сирена смолкает, она говорит:\n\n— Er ist im Block. Der Block hat eine Eisentür.\n\nОн в блоке. У блока железная дверь.', effects: [set20('gs', 'henrike'), npc('henrike', 1)] },
      { id: 'c20_gs_sit', label: 'Сесть на ступеньки и переждать', minutes: 5, terminal: true, goto: 'c20_g_wait',
        text: 'Ты сидишь на мокрых ступеньках, пока не начинает ломить колени. Сердце успокаивается не сразу.', effects: [set20('gs', 'sit'), { body: 'stress', delta: 1 }] },
    ] }),

  L({ id: 'c20_g_after', title: 'После', ambient: yardAir,
    text: [
      { text: 'Через четверть часа во дворе прачечной тихо. Солдаты ходят между верёвками и стреляют туда, где шевелится. Простыни на верёвках в бурых брызгах.' },
      { text: 'У стены корпуса сидят люди и смотрят на свои руки. Сестра из детской обходит их с фонариком и задирает каждому рукава.' },
      { when: hurt, text: 'Рука у тебя перетянута чем попало. Под тряпкой горячо и мокро.' },
    ],
    actions: [
      { id: 'c20_ga_check', label: 'Дать сестре осмотреть себя', minutes: 10, terminal: true, goto: 'c20_g_ahlers2',
        outcomes: [
          { id: 'hurt', when: hurt, text: 'Сестра светит на руки, на шею, задирает штанины.\n\n— Kein Biss. Glas oder Draht?\n\nНе укус. Стекло или проволока?\n\nОна снимает твою тряпку, промывает, стягивает края полосками и бинтует туго. Кровь проступает пятном и останавливается.', effects: [set20('ga2', 'check'), { treat: 'basic' }] },
          { id: 'ok', text: 'Сестра светит на руки, на шею, задирает штанины.\n\n— Nichts. Gut. Nächster.\n\nНичего. Хорошо. Следующий.', effects: [set20('ga2', 'check')] },
        ] },
      { id: 'c20_ga_carry', label: 'Помогать носить раненых в блок', minutes: 15, activity: 'heavy', terminal: true, goto: 'c20_g_ahlers2',
        text: 'Носилки скользкие. Женщина с порванной щекой держит тебя за рукав всю дорогу до блока и не отпускает, когда её кладут на стол.', effects: [set20('ga2', 'carry'), { body: 'fatigue', delta: 6 }, { body: 'stress', delta: 3 }] },
      { id: 'c20_ga_wash', label: 'Отмыть руки у колонки', minutes: 10, terminal: true, goto: 'c20_g_ahlers2',
        text: 'Вода ледяная. Ты трёшь руки, пока они не краснеют и не перестают пахнуть железом.', effects: [set20('ga2', 'wash'), { body: 'stress', delta: -1 }] },
    ] }),

  L({ id: 'c20_g_ahlers2', title: 'Алерс просит', ambient: yardAir,
    text: [
      { text: 'Доктор Алерс выходит на крыльцо блока без халата, в рубашке с закатанными рукавами. На рукавах кровь.' },
      { text: '— Wer Blutgruppe Null hat und stehen kann — zu mir. Zwei Soldaten. Jetzt.\n\nУ кого первая группа и кто стоит на ногах — ко мне. Двое солдат. Сейчас.' },
      { text: 'Вечером, может быть, ехать. Туда, где на шоссе стоит конвой.' },
    ],
    actions: [
      { id: 'c20_ga2_give', label: 'Пойти и сдать кровь', when: not(flag('w.c20_b_blood')), minutes: 20, terminal: true, goto: 'c20_g_car',
        text: 'Игла, жгут, двенадцать минут. Солдат на соседнем столе молодой и белый как простыня. Когда ты встаёшь, комната кренится, и Алерс держит тебя за локоть.\n\n— Zucker. Und heute Abend nicht fahren.\n\nСахар. И вечером не за руль.', effects: [set20('ga2b', 'give'), { body: 'bloodLoss', delta: 9 }, { body: 'fatigue', delta: 8 }] },
      { id: 'c20_ga2_light', label: 'Предложить держать свет и подавать', minutes: 20, terminal: true, goto: 'c20_g_car',
        text: 'Ты держишь лампу над столом, пока она шьёт. Руки у неё не дрожат. Дрожат у тебя, и свет пляшет, и она не говорит ни слова.', effects: [set20('ga2b', 'light'), { body: 'stress', delta: 2 }] },
      { id: 'c20_ga2_no', label: 'Не идти: вечером вам нужны силы', minutes: 5, terminal: true, goto: 'c20_g_car',
        text: 'К Алерс выходят трое из женского корпуса. Она кивает им и уводит внутрь. Ты стоишь у стены и смотришь на дверь.', effects: [set20('ga2b', 'no')] },
      { id: 'c20_ga2_again', label: 'Показать локоть: кровь сегодня уже брали', when: all(B19, flag('w.c20_b_blood')), minutes: 5, terminal: true, goto: 'c20_g_car',
        text: 'Алерс смотрит на твой локоть и коротко кивает.\n\n— Dann setzen Sie sich hin, bevor Sie umfallen.\n\nТогда сядьте, пока не упали.', effects: [set20('ga2b', 'again')] },
    ] }),

  // ───────────── Хутор: утро ─────────────
  F({ id: 'c20_f_morning', title: 'Утро', camp: yard14, ambient: rain,
    text: [
      { text: 'Светает серо и мокро. С навеса капает, во дворе стоят лужи.' },
      { when: v('w.c19_coop', 'gift'), text: 'На столбе изгороди, где вчера лежали два яйца, висит заяц. Освежёванный, аккуратно, на бечёвке. Яиц нет.' },
      { when: v('w.c19_knock', 'loft'), text: 'Сеновал над хлевом пуст: семья из Харбурга ушла затемно. На двери хлева мелом, печатными буквами: «DANKE. B75 BEI LOHOF: BÄUME QUER». Спасибо. На B75 у Лохофа завалено деревьями.' },
      { when: flueBad, text: 'Голова тяжёлая с ночи, во рту привкус железа. Наверху кого-то тошнит. В комнатах пахнет печкой.' },
      { when: dogHere, text: 'Бруно встречает тебя у двери и хвостом сбивает с вешалки шапку.' },
    ],
    actions: [
      { id: 'c20_fm_hare', label: 'Снять зайца и отнести в кладовку', when: all(A19, v('w.c19_coop', 'gift')), minutes: 10, terminal: true, goto: 'c20_f_breakfast',
        text: 'Заяц тяжёлый, жирный, разделан умелой рукой. Тот, кто таскал яйца, умеет ставить силки. Ты вешаешь зайца в кладовке на крюк.', effects: [set20('fm', 'hare'), { place: 'c20_hare', at: 'c3_farm_stock', qty: 1 }, w20('hare', true), heavyHead] },
      { id: 'c20_fm_note', label: 'Переписать надпись с двери в тетрадь', when: v('w.c19_knock', 'loft'), minutes: 5, terminal: true, goto: 'c20_f_breakfast',
        text: 'Ты переписываешь буквы в тетрадь Хенрике, на последнюю страницу. Лохоф — это на B75, между вами и Йестебургом.', effects: [set20('fm', 'note'), w20('lohof_known', true), heavyHead] },
      { id: 'c20_fm_air', label: 'Открыть окна наверху и вывести всех во двор подышать', when: flueBad, minutes: 15, terminal: true, goto: 'c20_f_breakfast',
        text: 'Ты распахиваешь окна настежь. Люди спускаются по одному, белые, держась за перила. Через полчаса на холоде всем легче. Тебе тоже. Печь наверху сегодня не топят.', effects: [set20('fm', 'air'), w20('aired', true), { body: 'fatigue', delta: 2 }] },
      { id: 'c20_fm_dog', label: 'Пройти с Бруно вдоль изгороди', when: dogHere, minutes: 15, terminal: true, goto: 'c20_f_breakfast',
        text: 'Бруно тянет к задней калитке и долго нюхает землю у столбов. Шерсть на загривке у него стоит дыбом. Ночью тут кто-то стоял.', effects: [set20('fm', 'dog'), w20('prints', true), heavyHead] },
      { id: 'c20_fm_wash', label: 'Умыться ледяной водой', minutes: 10, terminal: true, goto: 'c20_f_breakfast',
        text: 'Вода обжигает лицо. Голова проясняется, руки краснеют.', effects: [set20('fm', 'wash'), { body: 'fatigue', delta: -2 }, heavyHead] },
      { id: 'c20_fm_tea', label: 'Выпить чаю на крыльце', minutes: 10, terminal: true, goto: 'c20_f_breakfast',
        text: 'Ты пьёшь чай под навесом и смотришь, как дождь рябит лужи. Поле пустое.', effects: [set20('fm', 'tea'), heavyHead] },
    ] }),

  // ───────────── Хутор, A: лесополоса ─────────────
  F({ id: 'c20_f_a_wood', title: 'Лесополоса', camp: yard14, ambient: rain,
    text: [
      { text: 'Ты идёшь вдоль задней изгороди с мотком проволоки. Дождь ненадолго стихает, над полем поднимается туман.' },
      { text: 'У лесополосы, метрах в четырёхстах, что-то светлеет. Не олени: олени так не стоят. Фигуры, пять или шесть, в тумане их трудно сосчитать. Они стоят в ложбине у ручья, неподвижно, как коровы под дождём.' },
    ],
    actions: [
      { id: 'c20_faw2_close', label: 'Подобраться ближе по канаве и посмотреть', when: A19, minutes: 20, terminal: true, goto: 'c20_f_a_wood2',
        text: 'Канава вдоль поля полна воды по щиколотку. Ты идёшь пригнувшись.', effects: [set20('faw2', 'close'), { body: 'stress', delta: 2 }] },
      { id: 'c20_faw2_hens', label: 'Вернуться и запереть кур: они орут на всё поле', when: A19, minutes: 20, terminal: true, outcomes: afterMorningA,
        text: 'Ты загоняешь кур внутрь по одной, под их возмущённый крик, и закрываешь заслонку. Без кур двор становится тихим, как чужой.', effects: [set20('faw2', 'hens'), w20('hens_in', true)] },
      { id: 'c20_faw2_tell', label: 'Сказать всем в доме: в лесополосе люди из больницы', when: A19, minutes: 15, terminal: true, outcomes: afterMorningA,
        text: 'Ты говоришь на кухне, негромко, чтобы не испугать детей. Никто не задаёт вопросов. Кто-то молча ставит у двери вилы и кочергу.', effects: [set20('faw2', 'tell'), w20('wood_warned', true)] },
      { id: 'c20_faw2_ignore', label: 'Это далеко. Они стоят', when: A19, minutes: 5, terminal: true, outcomes: afterMorningA,
        text: 'Ты доделываешь изгородь, не поднимая головы. Когда смотришь снова, туман уже лёг, и лесополосы не видно.', effects: [set20('faw2', 'ignore')] },
    ] }),

  F({ id: 'c20_f_a_wood2', title: 'Ложбина', location: 'c10_field', camp: tense14, ambient: rain, safe: false,
    text: [
      { text: 'В ста метрах от ложбины ты ложишься на край канавы. Трава мокрая, холод сразу проходит сквозь куртку.' },
      { text: 'Шестеро. Больничные рубашки, у двоих поверх них куртки. Стоят лицом к ветру, к хутору. Один качается с пятки на носок. В траве у их ног лежит армейский рюкзак, зелёный, полный, с флягой на ремне.' },
      { text: 'Ветер от них к тебе. Пока.' },
    ],
    actions: [
      { id: 'c20_fw2_back', label: 'Отползти и вернуться: увиденного хватит', when: A19, minutes: 20, terminal: true, outcomes: afterMorningA,
        text: 'Ты отползаешь задом, не поднимая головы, до самого поворота канавы. До хутора идёшь быстро и только у изгороди оборачиваешься.', effects: [set20('fw2', 'back'), w20('wood_seen', true)] },
      { id: 'c20_fw2_count', label: 'Лежать и смотреть, куда они смотрят', when: A19, minutes: 20, terminal: true, outcomes: afterMorningA,
        text: 'Они смотрят на хутор. На курятник. Каждый раз, когда там кричат куры, шестеро поворачивают головы разом, как стрелки компаса. Потом снова замирают.', effects: [set20('fw2', 'count'), w20('wood_seen', true), w20('hens_noise_known', true), { body: 'fatigue', delta: 2 }] },
      { id: 'c20_fw2_bag', label: 'Подобраться за рюкзаком', when: A19, minutes: 25, risky: true, terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'agility'], difficulty: 4, uses: ['mobility'] }, goto: 'c20_f_a_wood3', text: 'Ты ползёшь, считая про себя до ста. Ремень рюкзака, рывок. Ближний поворачивает голову, но на ворону. Ты отползаешь с рюкзаком, пока они не скрываются за кромкой ложбины.', effects: [set20('fw2', 'bag'), w20('wood_bag', true)] },
          { id: 'run', goto: 'c20_f_a_wood3', text: 'Ветер меняется. Ближний поворачивается к тебе и идёт, сразу быстро. Ты бежишь по канаве, поскальзываешься и подворачиваешь ногу. До изгороди ты добегаешь, хромая. У ручья он отстаёт и возвращается к своим.', effects: [set20('fw2', 'run'), w20('ankle', true), { injure: 'sprain', site: 'leftLeg', severity: 2 }, { body: 'stress', delta: 4 }] },
        ], effects: [w20('wood_seen', true)] },
    ] }),

  F({ id: 'c20_f_a_wood3', title: 'У изгороди', camp: yard14, ambient: rain,
    text: [
      { when: flag('w.c20_wood_bag'), text: 'Ты садишься на корточки за поленницей и расстёгиваешь рюкзак. Два армейских пайка в зелёной плёнке, фляга, сигнальная ракета в картонном цилиндре и чужие шерстяные носки. На клапане выжжено: «Gefr. Haller».' },
      { when: not(flag('w.c20_wood_bag')), text: 'Ты садишься на колоду за поленницей. Щиколотка распухает прямо на глазах, ботинок жмёт. Наступать больно.' },
    ],
    actions: [
      { id: 'c20_fw3_stock', label: 'Отнести пайки в кладовку, ракету оставить себе', when: all(A19, flag('w.c20_wood_bag')), minutes: 10, terminal: true, outcomes: afterMorningA,
        text: 'Пайки ложатся на полку к банкам. Ракету ты суёшь во внутренний карман: там она и останется, пока не понадобится.', effects: [set20('fw3', 'stock'), { place: 'c20_epa', at: 'c3_farm_stock', qty: 2 }, { give: 'c20_flare' }] },
      { id: 'c20_fw3_keep', label: 'Оставить всё у себя: вечером может пригодиться', when: all(A19, flag('w.c20_wood_bag')), minutes: 5, terminal: true, outcomes: afterMorningA,
        text: 'Рюкзак ты вешаешь в сенях на свой крюк. Носки выбрасываешь в печь.', effects: [set20('fw3', 'keep'), { give: 'c20_epa', qty: 2 }, { give: 'c20_flare' }] },
      { id: 'c20_fw3_wrap', label: 'Туго перебинтовать ногу и посидеть с ней в холодной воде', when: all(A19, not(flag('w.c20_wood_bag'))), minutes: 25, activity: 'rest', terminal: true, outcomes: afterMorningA,
        text: 'Ведро холодной воды из колонки, потом бинт восьмёркой, туго. Через двадцать минут нога болит тише. Ходить можно. Бегать — вряд ли.', effects: [set20('fw3', 'wrap'), { treat: 'basic' }, { body: 'stress', delta: -1 }] },
      { id: 'c20_fw3_on', label: 'Не обращать внимания: работы полно', when: all(A19, not(flag('w.c20_wood_bag'))), minutes: 5, terminal: true, outcomes: afterMorningA,
        text: 'Ты затягиваешь шнурки потуже и встаёшь. Первые шаги даются тяжело, потом нога привыкает. Или ты к ней.', effects: [set20('fw3', 'on')] },
    ] }),

  // ───────────── Хутор, B: жар и кладовка ─────────────
  F({ id: 'c20_f_b_fever', title: 'Жар', camp: house14,
    text: [
      ...textByGirl({ text: '{g}а не встаёт к завтраку. Ты поднимаешься к ней: она лежит, укрывшись с головой, и её трясёт. Лоб горячий и сухой.' }),
      { text: '— Ich bin nicht gebissen, — говорит она сразу, не открывая глаз. — Nirgends. Guck nach.\n\nМеня не кусали. Нигде. Посмотри.' },
      { when: henrikeHome, text: 'Внизу Хенрике говорит громко, чтобы слышали наверху:\n\n— Nicht im Haus. In die Scheune.\n\nНе в доме. В сарай.' },
      { when: not(henrikeHome), text: 'Внизу кто-то спрашивает, не перевести ли её в сарай. Громко, чтобы слышали наверху.' },
      { text: 'Насморк, кашель, ломит кости. В ноябре так болеют каждый год. Только кто теперь помнит, как болеют в ноябре.' },
    ],
    actions: [
      { id: 'c20_fbv_check', label: 'Осмотреть её всю, как она просит', minutes: 20, terminal: true, outcomes: toRain,
        text: 'Руки, шея, ноги, спина. Ни царапины. Только старый синяк на бедре, жёлтый, недельный. На лестнице ты говоришь об этом вслух, чтобы слышали все.', effects: [set20('fbv', 'check'), w20('girl_checked', true), girlNpc(2)] },
      { id: 'c20_fbv_pills', label: 'Дать парацетамол и горячего чаю', when: { has: 'paracetamol' }, minutes: 15, terminal: true, outcomes: toRain,
        text: 'Она пьёт таблетку с чаем, стуча зубами о кружку. Через час её перестаёт трясти, и она засыпает, свернувшись, как ребёнок.', effects: [set20('fbv', 'pills'), { take: 'paracetamol' }, w20('girl_checked', true), girlNpc(1)] },
      { id: 'c20_fbv_attic', label: 'Перевести её под крышу, отдельно от всех', minutes: 15, terminal: true, outcomes: toRain,
        text: 'Ты стелешь ей на старом диване под крышей, ставишь рядом ведро и воду. Она смотрит, как ты закрываешь дверь, и ничего не говорит.', effects: [set20('fbv', 'attic'), w20('girl_attic', true), girlNpc(-1)] },
    ] }),

  F({ id: 'c20_f_b_pantry', title: 'Кладовка', camp: kitchen14,
    text: [
      { text: 'На полу кладовки под мешком овсянки белая дорожка. Мешок прогрызен в углу, снизу. Картонка с макаронами на полке погрызена тоже. По всей нижней полке свежий мышиный помёт.' },
      { text: 'Запасов на полках на неделю, может, на две. Если делить с мышами, меньше.' },
    ],
    actions: [
      { id: 'c20_fbp_tins', label: 'Пересыпать крупу и макароны в банки и вёдра с крышками', minutes: 30, activity: 'light', terminal: true, goto: 'c20_f_brandt',
        text: 'Банки из-под огурцов, два ведра с крышками, старый молочный бидон. Ты пересыпаешь всё, что лежало в бумаге и картоне. Полки пустеют, бидон тяжелеет. Мышам остаётся только дорожка.', effects: [set20('fbp', 'tins'), w20('pantry', 'tins')] },
      { id: 'c20_fbp_hang', label: 'Подвесить мешки на крюки под потолком', minutes: 20, activity: 'moderate', terminal: true, goto: 'c20_f_brandt',
        text: 'Крюки для окороков торчат из балки над дверью. Ты подвешиваешь на них мешки на проволоке, встав на табурет. Мешки покачиваются, как колокола.', effects: [set20('fbp', 'hang'), w20('pantry', 'hung')] },
      { id: 'c20_fbp_trap', label: 'Поставить ловушку: ведро с водой и бутылка на проволоке', minutes: 20, terminal: true, goto: 'c20_f_brandt',
        text: 'Старый деревенский способ: ведро, вода, бутылка на проволоке поперёк, кусочек сала на бутылке. Работает ли он, станет ясно утром.', effects: [set20('fbp', 'trap'), w20('pantry', 'trap')] },
      { id: 'c20_fbp_leave', label: 'Потом: сегодня не до мышей', minutes: 2, terminal: true, goto: 'c20_f_brandt',
        text: 'Ты закрываешь дверь кладовки плотнее. За ней что-то шуршит.', effects: [set20('fbp', 'leave'), w20('pantry', 'left'), giveAway('oats', 1)] },
    ] }),

  F({ id: 'c20_f_b_rain', title: 'Бочки', camp: yard14, ambient: rain,
    text: [
      { text: 'Дождь идёт с ночи, ровный, без ветра. Водосточная труба на углу дома оторвалась от стены, и вода хлещет из неё прямо в подвальное окошко.' },
      { when: v('w.c19_well', 'broken'), text: 'Колонка во дворе со вчерашнего дня не качает. Воды в канистрах на день.' },
      { when: not(v('w.c19_well', 'broken')), text: 'В сарае стоят две пустые бочки из-под капусты и оцинкованная ванна.' },
    ],
    actions: [
      { id: 'c20_fbr_barrels', label: 'Подставить под трубы бочки и ванну', minutes: 30, activity: 'moderate', terminal: true, outcomes: toVan,
        text: 'Ты выкатываешь бочки из сарая и ставишь под водостоки, ванну под оторванную трубу. Через час в них уже по колено. Пить её только кипячёной, но мыться, стирать и поить кур можно сразу.', effects: [set20('fbr', 'barrels'), { place: 'water_l', at: 'c3_farm_stock', qty: 15 }, w20('rain_water', true)] },
      { id: 'c20_fbr_pipe', label: 'Прикрутить трубу на место, пока подвал не залило', minutes: 25, activity: 'moderate', risky: true, terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['technical', 'agility'], difficulty: 3, uses: ['mobility'] }, text: 'Лестница, проволока, два старых хомута из сарая. Ты стягиваешь трубу у стены, и вода уходит туда, куда должна, в канаву у дороги. В подвальном окошке стоит лужа, но не больше.', effects: [set20('fbr', 'pipe'), w20('pipe_fixed', true)] },
          { id: 'slip', text: 'На третьей ступеньке нога соскальзывает с мокрой перекладины. Ты сползаешь вниз, обдирая ладони, и бьёшься коленом о бочку. Труба так и висит. Ты стоишь под дождём и смотришь, как вода уходит в подвал.', effects: [set20('fbr', 'slip'), w20('cellar_wet', true), { injure: 'bruise', site: 'leftLeg', severity: 1 }, { injure: 'scratch', site: 'hands', severity: 1 }] },
        ], effects: [until(20, 9, 30)] },
      { id: 'c20_fbr_skip', label: 'Не мокнуть: дождь как дождь', minutes: 2, terminal: true, outcomes: toVan,
        text: 'Ты закрываешь дверь. Вода из трубы так и льёт в подвальное окошко.', effects: [set20('fbr', 'skip'), w20('cellar_wet', true)] },
    ] }),

  // ───────────── Хутор, общее: полдень ─────────────
  F({ id: 'c20_f_wire', title: 'На проволоке', camp: yard14, ambient: rain,
    text: [
      { text: 'Двое ушли вдоль забора. Через десять минут с дороги доносится визг железа. Один из них застрял на углу выгона в колючей проволоке, у самой дороги. Он рвётся, проволока звенит, столб качается.' },
      { when: flag('w.c20_steered'), text: 'Это тот, что шёл за тобой к канаве.' },
      { text: 'По этой дороге ходят Кёлер, патруль, дети с соседнего двора.' },
    ],
    actions: [
      { id: 'c20_fwr_end', label: 'Пойти с вилами и закончить это', when: A19, minutes: 20, activity: 'moderate', terminal: true, goto: 'c20_f_radio',
        text: 'Он висит на проволоке грудью и тянется к тебе обеими руками. Ты бьёшь черенком, потом ещё раз, пока он не перестаёт тянуться. Проволока ещё долго гудит. Руки у тебя трясутся до самого крыльца.', effects: [set20('fwr', 'end'), w20('wire', 'ended'), { body: 'stress', delta: 3 }, until(20, 12, 35)] },
      { id: 'c20_fwr_cut', label: 'Перекусить проволоку издалека и отпустить его в поле', when: A19, minutes: 20, terminal: true, goto: 'c20_f_radio',
        text: 'Ты подходишь сбоку, к соседнему столбу, и перекусываешь нижнюю нитку кусачками. Проволока со звоном уходит. Он падает в канаву, поднимается и идёт через поле к лесополосе, не оглядываясь.', effects: [set20('fwr', 'cut'), w20('wire', 'freed'), until(20, 12, 35)] },
      { id: 'c20_fwr_sign', label: 'Написать на воротах «Achtung» и оставить патрулю', when: A19, minutes: 10, terminal: true, goto: 'c20_f_radio',
        text: 'Ты пишешь мелом на воротах крупно: «ACHTUNG! ECKE WEIDE!» Внимание! Угол выгона! Звон проволоки слышно и со двора.', effects: [set20('fwr', 'sign'), w20('wire', 'sign'), until(20, 12, 35)] },
      { id: 'c20_fwr_kids', label: 'Увести детей от окон, пока это слышно', when: all(B19, any(ninaFarm, girlHere)), minutes: 15, terminal: true, goto: 'c20_f_radio',
        text: 'Ты уводишь их на кухню, к плите, и ставишь чайник, чтобы шумел. Нина делает вид, что не слышит звона. У неё не получается.', effects: [set20('fwr', 'kids'), until(20, 12, 35)] },
      { id: 'c20_fwr_watch', label: 'Смотреть с крыльца', when: B19, minutes: 10, terminal: true, goto: 'c20_f_radio',
        text: 'Отсюда видно только столб, который качается, и мокрую рубашку на проволоке. Ты смотришь, пока не начинает тошнить, и уходишь в дом.', effects: [set20('fwr', 'watch'), { body: 'stress', delta: 1 }, until(20, 12, 35)] },
      { id: 'c20_fwr_road', label: 'Выйти к дороге и встать так, чтобы предупредить прохожих', when: B19, minutes: 20, ambientDuring: rain, terminal: true, goto: 'c20_f_radio',
        text: 'Ты стоишь у почтового ящика под дождём, в двадцати шагах от угла. Мимо никто не проходит. Только раз вдалеке, у поворота, мелькает велосипедист и сворачивает, увидев тебя.', effects: [set20('fwr', 'road'), { body: 'stress', delta: 1 }, until(20, 12, 35)] },
    ] }),

  // ───────────── Хутор, общее: двор после нападения ─────────────
  F({ id: 'c20_f_yard', title: 'Двор', camp: yard14, ambient: rain,
    text: [
      { text: '«Вольф» уезжает. Во дворе остаётся то, что надо убрать до темноты: те, кто лежит у поленницы и у курятника, мёртвые куры, перья, сорванная сетка.' },
      { when: all(jensBarn, v('w.c19_ring', 'loose')), text: 'Дверь длинного сарая трясётся не так, как раньше. Изнутри в неё бьются не на цепи: кольцо Йенса вырвано из столба. Засов держит.' },
      { when: all(barnChained, not(all(jensBarn, v('w.c19_ring', 'loose')))), text: 'В длинном сарае ещё звенят цепи, но уже реже.' },
      { when: uteHere, text: 'Уте сидит на крыльце и смотрит на свои руки.' },
    ],
    actions: [
      { id: 'c20_fy_burn', label: 'Стащить тела на край поля и сжечь', when: A19, minutes: 30, activity: 'heavy', terminal: true, outcomes: afterYard,
        text: 'Ты стаскиваешь их по одному, за ноги, на брезенте. Дрова из поленницы, сверху старая солома. Огонь берётся неохотно, под дождём. Дым жирный и чёрный, его видно, наверное, до самого шоссе.', effects: [set20('fy', 'burn'), w20('bodies', 'burnt'), giveAway('firewood', 8), { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 3 }] },
      { id: 'c20_fy_ditch', label: 'Оттащить в канаву за изгородью и забросать землёй', when: A19, minutes: 25, activity: 'heavy', terminal: true, outcomes: afterYard,
        text: 'Канава за изгородью полна воды. Ты сталкиваешь их туда и забрасываешь землёй с краёв, пока не перестаёт быть видно рубашки. Лопата скользит в руках.', effects: [set20('fy', 'ditch'), w20('bodies', 'ditch'), { body: 'fatigue', delta: 7 }, { body: 'stress', delta: 3 }] },
      { id: 'c20_fy_hens', label: 'Сначала собрать мёртвых кур и ощипать, пока тёплые', when: A19, minutes: 30, terminal: true, outcomes: afterYard,
        text: 'Три курицы целые, остальных уже не собрать. Ты ощипываешь их над ведром на крыльце, перо липнет к мокрым пальцам. Тела у поленницы ждут. До темноты час.', effects: [set20('fy', 'hens'), w20('bodies', 'left'), { place: 'c17_hen', at: 'c3_farm_stock', qty: 3 }] },
      { id: 'c20_fy_check', label: 'Осмотреть всех, кто был снаружи', when: B19, minutes: 15, terminal: true, outcomes: afterYard,
        text: 'Руки, шеи, лица, при свете из окна кухни. Ссадины, синяки, чья-то сбитая костяшка. Ни одного укуса. Ты проверяешь ещё раз, медленнее.', effects: [set20('fy', 'check'), { body: 'stress', delta: -1 }] },
      { id: 'c20_fy_kids', label: 'Посидеть наверху с Ниной', when: all(B19, ninaFarm, not(girlHere)), minutes: 15, terminal: true, outcomes: afterYard,
        text: 'Они сидят на полу у дальней стены, как ты их {m:оставил|оставила}, и не хотят вставать. Ты садишься рядом. Нина кладёт голову тебе на плечо, будто случайно.', effects: [set20('fy', 'kids'), npc('c7_nina', 1), { body: 'stress', delta: -1 }] },
      ...byGirl({ id: 'c20_fy_kng', label: 'Посидеть наверху с Ниной и {g}ой', when: all(B19, ninaFarm), minutes: 15, terminal: true, outcomes: afterYard,
        text: 'Они сидят на полу у дальней стены, как ты их {m:оставил|оставила}, и не хотят вставать. Ты садишься рядом. Нина кладёт голову тебе на плечо, будто случайно.', effects: [set20('fy', 'kids'), npc('c7_nina', 1), { body: 'stress', delta: -1 }] }),
      ...byGirl({ id: 'c20_fy_kg', label: 'Посидеть наверху с {g}ой', when: all(B19, not(ninaFarm)), minutes: 15, terminal: true, outcomes: afterYard,
        text: '{g}а сидит на полу у дальней стены, как ты её {m:оставил|оставила}. Ты садишься рядом. Она говорит про коров, про дорогу, про что угодно, лишь бы говорить.', effects: [set20('fy', 'kids'), { if: evaHere, then: [npc('c8_eva', 1)] }, { body: 'stress', delta: -1 }] }),
      { id: 'c20_fy_net', label: 'Связать сетку курятника проволокой', when: B19, minutes: 20, terminal: true, outcomes: afterYard,
        text: 'Сетка порвана в трёх местах. Ты стягиваешь края проволокой, обдирая пальцы. Выжившие куры жмутся на насесте и молчат.', effects: [set20('fy', 'net'), w20('coop_tied', true)] },
    ] }),
];
