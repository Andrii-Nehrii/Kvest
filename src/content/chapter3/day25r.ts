import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { flag, not } from './world3';
import { npc } from './point19';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { S25, set25, snow25, until25, w25 } from './point25';

// Участок 25, переработка 16.11 (до уровня 17–20).
// A: обмен у задних ворот казармы (пятнадцатое декабря) → на обратной дороге у «Поло» в канаве выходит обращённый (риск) →
// если взял Анке и Йонаса — пост в Ханштедте.
// B: в сумерках у ворот, пока ждёшь фургон, на дороге человек (риск; всё кончается до приезда фургона).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S25({ ...scene, for: 'any', chapter: 'ch3' });
const van = { tempC: -2, outdoor: true, wet: true };
const meantStop: Cond = v('$.c25_ar', 'stop');
const korn: Cond = { has: 'c24_korn' };

export const day25RScenes: Scene[] = [
  X({ id: 'c25_a_trade', title: 'Задние ворота', location: 'c18_lueneburg', ambient: snow25,
    text: [
      { text: 'У задних ворот казармы, за мусорными баками, двое солдат курят и меняются. На крышке бака разложено: сигареты, батарейки, блистеры с таблетками, пачка чая.' },
      { text: 'Один кивает тебе, не вынимая сигареты изо рта:\n\n— Was hast du? Wir nehmen alles, was man trinken oder anziehen kann.\n\nЧто у тебя есть? Берём всё, что можно выпить или надеть.' },
      { text: 'На блистере написано «Amoxicillin». Дома в пункте у Зандер такого нет совсем.' },
    ],
    actions: [
      { id: 'c25_at3_korn', label: 'Отдать флягу корна Оле за таблетки и батарейки', when: korn, minutes: 15, terminal: true, outcomes: [{ id: 'cab', when: flag('$.c24_cabinet'), goto: 'c25_a_cabinet' }, { id: 'yard', goto: 'c25_a_yard' }],
        text: 'Солдат отвинчивает крышку, нюхает и улыбается во весь рот. Блистер и батарейки ложатся тебе в ладонь. Оле, наверное, обиделся бы. А может, и нет.',
        effects: [set25('at3', 'korn'), { take: 'c24_korn' }, { give: 'c25_amoxi' }, { give: 'batteries_aa' }, until25(14, 20)] },
      { id: 'c25_at3_gloves', label: 'Отдать свои перчатки за полоску таблеток', minutes: 15, terminal: true, outcomes: [{ id: 'cab', when: flag('$.c24_cabinet'), goto: 'c25_a_cabinet' }, { id: 'yard', goto: 'c25_a_yard' }],
        text: 'Солдат примеряет перчатки, сжимает кулак, кивает. Блистер на десять таблеток. Обратно ты поедешь с руками в карманах. Это недорого.',
        effects: [set25('at3', 'gloves'), w25('a_no_gloves', true), { give: 'c25_amoxi' }, until25(14, 20)] },
      { id: 'c25_at3_ask', label: 'Спросить, что будет пятнадцатого', minutes: 15, terminal: true, outcomes: [{ id: 'cab', when: flag('$.c24_cabinet'), goto: 'c25_a_cabinet' }, { id: 'yard', goto: 'c25_a_yard' }],
        text: 'Солдат перестаёт улыбаться.\n\n— Wer hat was von fünfzehnten gesagt?\n\nКто тебе сказал про пятнадцатое?\n\nВторой бросает окурок в снег:\n\n— Wir packen. Mehr sag ich nicht. Und du hast nichts gehört.\n\nМы пакуемся. Больше ничего не скажу. И ты ничего не слышал{m:|а}.',
        effects: [set25('at3', 'ask'), w25('heard_pack', true), until25(14, 20)] },
      { id: 'c25_at3_pass', label: 'Пройти мимо: ты и так в чужом списке', minutes: 5, terminal: true, outcomes: [{ id: 'cab', when: flag('$.c24_cabinet'), goto: 'c25_a_cabinet' }, { id: 'yard', goto: 'c25_a_yard' }],
        text: 'Ты проходишь мимо. Солдат пожимает плечами. Сзади слышно, как они смеются над чем-то своим.',
        effects: [set25('at3', 'pass'), until25(14, 10)] },
    ] }),

  X({ id: 'c25_a_polo', title: 'Из поля', location: 'c7_farm_lane', ambient: van,
    text: [
      { when: meantStop, text: 'Ты говоришь «halt» так, что Вессель тормозит, ругаясь. Ты выскакиваешь в мокрый снег.' },
      { when: not(meantStop), text: 'Вессель тормозит, но мотор не глушит. Ты выскакиваешь в мокрый снег с хлебом в руке.' },
      { text: 'Женщину зовут Анке. Мальчику на заднем сиденье шесть, его зовут Йонас. Они второй день в канаве, едут в Люллау, к свекрови.' },
      { text: 'Пока она говорит, со стороны поля, на свет фар, выходит человек. Без шапки, в одной рубашке, в такой мороз. Идёт прямо, не разбирая дороги, по колено в снегу.' },
      { text: 'Вессель жмёт на клаксон. Человек поворачивает голову на звук и идёт быстрее.' },
    ],
    actions: [
      { id: 'c25_ap2_take', label: 'Схватить мальчика и бегом к фургону, Анке следом', minutes: 15, activity: 'heavy', risky: true, terminal: true, ambientDuring: van,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, goto: 'c25_a_check', text: 'Ты выдёргиваешь Йонаса из машины вместе с одеялом. Анке бежит следом, теряя сумку в снегу. Задняя дверь фургона, мешки, ребёнок, Анке, ты. Вессель трогается раньше, чем ты захлопываешь дверь. Сзади по стеклу шлёпает ладонь, и всё.', effects: [set25('ap2', 'take'), { set: 'w.c25_road', value: 'lift' }] },
          { id: 'slip', goto: 'c25_a_check', text: 'На обочине ты оступаешься и падаешь на колено вместе с мальчиком. Человек уже в трёх шагах. Анке бьёт его сумкой по голове, раз, другой, и он заваливается в канаву. Вы вваливаетесь в фургон. Колено горит, джинсы порваны. Йонас не плачет. Он смотрит на маму так, будто видит её впервые.', effects: [set25('ap2', 'slip'), { set: 'w.c25_road', value: 'lift' }, { injure: 'bruise', site: 'leftLeg', severity: 2 }, { body: 'stress', delta: 5 }] },
        ], effects: [until25(17, 30)] },
      { id: 'c25_ap2_iron', label: 'Взять монтировку из кабины и встать между ним и машиной', minutes: 15, activity: 'heavy', risky: true, terminal: true, ambientDuring: van,
        outcomes: [
          { id: 'ok_stop', when: meantStop, check: { traits: ['melee', 'strength'], difficulty: 3, uses: ['strength'] }, goto: 'c25_a_check', text: 'Монтировка тяжёлая и холодная. Ты ждёшь, пока он подойдёт, и бьёшь один раз, как учили на ринге: всем телом. Он падает лицом в снег. Анке уже несёт мальчика к фургону.', effects: [set25('ap2', 'iron'), { set: 'w.c25_road', value: 'lift' }] },
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 3, uses: ['strength'] }, goto: 'c25_supper', text: 'Монтировка тяжёлая и холодная. Ты ждёшь, пока он подойдёт, и бьёшь один раз, всем телом. Он падает лицом в снег. Анке пишет на обороте чека, прислонив его к крыше машины: «Timm, Lüllau. Anke und Jonas leben. Sind in Pattensen, im Graben. Holt uns». Ты отдаёшь ей хлеб. Она запирает двери изнутри. Фургон сигналит.', effects: [set25('ap2', 'iron'), { set: 'w.c25_road', value: 'letter' }, { give: 'c25_timm_note' }] },
          { id: 'slip', goto: 'c25_supper', text: 'Ты замахиваешься, и нога уезжает на льду обочины. Удар приходится в плечо. Он хватает тебя за рукав, тянет, и вы оба падаете в снег. Ты бьёшь снизу, ещё и ещё, пока он не затихает. Анке в машине кричит. Когда ты поднимаешься, она уже пишет записку и суёт её тебе в окно: «Timm, Lüllau. Holt uns». Вессель орёт, чтобы ты {m:садился|садилась}.', effects: [set25('ap2', 'slip'), { set: 'w.c25_road', value: 'letter' }, { give: 'c25_timm_note' }, { injure: 'bruise', site: 'rightArm', severity: 2 }, { body: 'stress', delta: 6 }] },
        ], effects: [until25(17, 35)] },
      { id: 'c25_ap2_lock', label: 'Велеть им запереться в «Поло», а самому — в фургон', minutes: 10, terminal: true, goto: 'c25_supper', ambientDuring: van,
        text: '— Türen zu! Nicht aufmachen! — кричишь ты. Двери закрыть! Не открывать! Анке захлопывает дверь и бьёт по кнопке замка. Ты прыгаешь в кабину. В зеркале он подходит к «Поло» и кладёт ладони на стекло, за которым мальчик. В последний момент Анке успела сунуть тебе в руку записку: «Timm, Lüllau. Holt uns».',
        effects: [set25('ap2', 'lock'), { set: 'w.c25_road', value: 'letter' }, w25('polo_besieged', true), { give: 'c25_timm_note' }, { body: 'stress', delta: 6 }, until25(17, 35)] },
    ] }),

  X({ id: 'c25_a_check', title: 'Пост в Ханштедте', location: 'c7_farm_lane', ambient: van,
    text: [
      { text: 'У Ханштедта шлагбаум. Тот же солдат с фонарём, что утром. Он обходит фургон и стучит в заднюю дверь.' },
      { text: 'Анке сидит на мешках, Йонас спит у неё на коленях. Если солдат откроет дверь, в фургоне будет на двоих больше, чем в его бумаге.' },
      { text: 'Вессель смотрит на тебя в зеркало. Он ничего не говорит. Он уже всё сказал у «Поло».' },
    ],
    actions: [
      { id: 'c25_ac2_bags', label: 'Завалить их мешками с бельём', minutes: 15, risky: true, terminal: true, goto: 'c25_supper', ambientDuring: van,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 3, uses: ['focus'] }, text: 'Ты наваливаешь мешки, и Анке с мальчиком исчезают под ними. Солдат открывает дверь, светит, видит бельё и тебя. Кивает и машет: проезжайте. Под мешками кто-то тихо всхлипывает. Шлагбаум уже за спиной.', effects: [set25('ac2', 'bags')] },
          { id: 'found', text: 'Йонас просыпается под мешками и чихает. Солдат светит туда, где чихнуло, долго. Потом говорит Весселю, а не тебе: «Das schreibe ich auf. Dich. Nicht die». Это я запишу. Тебя. Не их. И машет: езжай.', effects: [set25('ac2', 'found'), w25('wessel_written', true)] },
        ], effects: [until25(17, 50)] },
      { id: 'c25_ac2_truth', label: 'Открыть самому: женщина с ребёнком из канавы, в Люллау', minutes: 15, terminal: true, goto: 'c25_supper', ambientDuring: van,
        text: 'Ты открываешь дверь сам. Солдат светит на спящего ребёнка, на Анке, на тебя. Спрашивает фамилию, записывает. «Timm. Lüllau». Потом выключает фонарь.\n\n— Weiterfahren. Und nächstes Mal sagt ihr es vorher.\n\nПроезжайте. И в следующий раз говорите заранее.',
        effects: [set25('ac2', 'truth'), w25('timm_listed', true), until25(17, 50)] },
      { id: 'c25_ac2_talk', label: 'Выйти к нему самому и заговорить, пока он не открыл', minutes: 15, terminal: true, goto: 'c25_supper', ambientDuring: van,
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3 }, text: 'Ты выходишь из кабины и встаёшь у задней двери. Говоришь про снег, про Люнебург, про Оле Людемана, донора, которого видел{m:|а} утром. Солдат слушает, кивает, смотрит на часы. Он замёрз. Он машет: езжайте. Дверь он так и не открывает.', effects: [set25('ac2', 'talk')] },
          { id: 'no', text: 'Ты выходишь и начинаешь говорить. Солдат отодвигает тебя рукой, не слушая, и открывает дверь. Светит. Смотрит долго. Потом записывает: «Wessel, Wäscherei. Zwei ohne Papier». Вессель, прачечная. Двое без бумаг.', effects: [set25('ac2', 'caught'), w25('wessel_written', true)] },
        ], effects: [until25(17, 50)] },
    ] }),

  X({ id: 'c25_b_gate', title: 'На дороге', camp: yard14, ambient: snow25,
    text: [
      { when: v('$.c25_bd', 'gate'), text: 'У ворот темно и тихо. Снег падает крупно. Ты держишь фонарь опущенным, светишь под ноги.' },
      { when: not(v('$.c25_bd', 'gate')), text: 'В начале шестого от окна кухни зовут: «Там кто-то идёт». Ты выходишь на крыльцо с фонарём.' },
      { text: 'На дороге, со стороны Йестебурга, кто-то идёт. Не фургон: шагом, один. Ты поднимаешь фонарь. Человек в куртке дорожника, без шапки, ступает неровно, как пьяный.' },
      { text: 'Он идёт на свет. Прямо на тебя.' },
    ],
    actions: [
      { id: 'c25_bg3_dark', label: 'Выключить фонарь и замереть', minutes: 20, risky: true, terminal: true, goto: 'c25_supper', ambientDuring: snow25,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 3, uses: ['focus'] }, text: 'Ты гасишь фонарь и замираешь в темноте. Он доходит до ворот, останавливается. Дышит хрипло, совсем рядом, за досками. Потом идёт дальше, к колонии, на свет в окне у Уте. Ты стоишь, пока шаги не стихают. Потом бежишь в дом. Через полчаса от колонии доносится стук лома о лёд: Яннес не спал.', effects: [set25('bg3', 'dark'), w25('b_gate', 'passed')] },
          { id: 'heard', text: 'Ты гасишь фонарь, но под ногой хрустит наст. Он поворачивается на звук и наваливается на ворота. Цепь звенит. Ты отступаешь к дому спиной, шаг за шагом. Он трясёт ворота, долго. Потом из темноты выходит Яннес с ломом: услышал цепь от колонии.', effects: [set25('bg3', 'heard'), w25('b_gate', 'jannes'), { body: 'stress', delta: 6 }] },
        ], effects: [until25(17, 40)] },
      { id: 'c25_bg3_fork', label: 'Взять вилы от сарая и встать у ворот', minutes: 20, activity: 'heavy', risky: true, terminal: true, goto: 'c25_supper', ambientDuring: snow25,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'melee'], difficulty: 4, uses: ['strength'] }, text: 'Он упирается грудью в ворота и тянет руки через доски. Ты бьёшь вилами между досок, в грудь, потом выше. Он оседает в снег по ту сторону. Ты стоишь с вилами, пока руки не перестают трястись. Фар на повороте всё ещё нет.', effects: [set25('bg3', 'fork'), w25('b_gate', 'b')] },
          { id: 'weak', text: 'Ты бьёшь вилами между досок, но он не падает. Он хватается за черенок и тянет к себе. Ты отпускаешь вилы и отскакиваешь. Из-за угла выбегает Нина с колотушкой для белья и кричит так, что от колонии бежит Яннес. Он заканчивает это ломом.', effects: [set25('bg3', 'weak'), w25('b_gate', 'jannes'), { body: 'stress', delta: 7 }] },
        ], effects: [until25(17, 40)] },
      { id: 'c25_bg3_back', label: 'Уйти в дом и запереть дверь', minutes: 15, terminal: true, goto: 'c25_supper',
        text: 'Ты уходишь в дом и задвигаешь засов. Через окно видно, как он стоит у ворот и трясёт их, раз, другой. Потом уходит вдоль забора к колонии. Ты не знаешь, что будет, если фургон приедет, пока он там. Через полчаса от колонии доносится стук лома о лёд. Потом тишина.',
        effects: [set25('bg3', 'back'), w25('b_gate', 'house'), until25(17, 40)] },
    ] }),

  // ═════════════ A: шкаф Оле ═════════════
  X({ id: 'c25_a_cabinet', title: 'Шкаф', location: 'c18_lueneburg', ambient: snow25,
    text: [
      { text: 'Перед самым отъездом Оле ловит тебя за рукав у двери блока.' },
      { when: v('$.c24_cabinet', 'left'), text: '— Oben, in meinem Zimmer. Der grüne Schrank. Hast du ihn gesehen?\n\nНаверху, в моей комнате. Зелёный шкаф. Ты его видел{m:|а}?\n\nТы видел{m:|а}. И замок с четырьмя кольцами тоже.' },
      { when: v('$.c24_cabinet', 'open'), text: '— Oben, in meinem Zimmer. Der grüne Schrank. Hast du ihn gesehen?\n\nНаверху, в моей комнате. Зелёный шкаф. Ты его видел{m:|а}?\n\nТы его открыл{m:|а}. Бинокль у тебя.' },
      { when: v('$.c24_cabinet', 'broken'), text: '— Oben, in meinem Zimmer. Der grüne Schrank. Hast du ihn gesehen?\n\nНаверху, в моей комнате. Зелёный шкаф. Ты его видел{m:|а}?\n\nЗамок от него валяется на полу. Ты сбил{m:|а} его колуном.' },
      { when: not(v('$.c24_cabinet', 'left')), text: 'Оле ждёт ответа. Он ещё не знает.' },
    ],
    actions: [
      { id: 'c25_acb_word', label: 'Спросить слово от замка', when: v('$.c24_cabinet', 'left'), minutes: 10, terminal: true, goto: 'c25_a_yard',
        text: 'Оле улыбается впервые за день.\n\n— Asta. Wie der Hund. Mutter weiß es nicht. Nimm das Fernglas, wenn ihr es braucht. Den Rest — nur wenn es sein muss.\n\nАста. Как собака. Мать не знает. Бери бинокль, если нужен. Остальное — только если иначе никак.',
        effects: [set25('acb', 'word'), w25('ole_word', true), npc('ole', 1), until25(14, 30)] },
      { id: 'c25_acb_keep', label: 'Сказать: стоит, где стоял. Никто не трогал', when: v('$.c24_cabinet', 'left'), minutes: 5, terminal: true, goto: 'c25_a_yard',
        text: 'Оле кивает. Видно, что ему спокойнее. Он не говорит, что там. Ты не спрашиваешь.',
        effects: [set25('acb', 'keep'), npc('ole', 1), until25(14, 25)] },
      { id: 'c25_acb_confess', label: 'Сказать как есть: открыл{m:|а}, когда шёл обыск', when: any(v('$.c24_cabinet', 'open'), v('$.c24_cabinet', 'broken')), minutes: 10, terminal: true, goto: 'c25_a_yard',
        text: 'Оле слушает молча. Про обыск, про собаку, про то, что Брандт пришёл в десять. Потом говорит:\n\n— Lieber du als Brandt.\n\nЛучше ты, чем Брандт.\n\nИ всё. Больше он к этому не возвращается.',
        effects: [set25('acb', 'confess'), npc('ole', 1, 'c25_cabinet_truth'), until25(14, 30)] },
      { id: 'c25_acb_brandt', label: 'Сказать: дружина Брандта вскрыла', when: v('$.c24_cabinet', 'broken'), minutes: 10, terminal: true, goto: 'c25_a_yard',
        text: 'Оле сжимает зубы так, что ходят желваки.\n\n— Brandt. Natürlich.\n\nБрандт. Ну конечно.\n\nТы видишь, что он это запомнит. Надолго. Неправда уже не твоя: она теперь его.',
        effects: [set25('acb', 'lie'), w25('ole_blames_brandt', true), { body: 'stress', delta: 4 }, until25(14, 30)] },
      { id: 'c25_acb_later', label: 'Сказать: расскажу, когда вернёшься', minutes: 5, terminal: true, goto: 'c25_a_yard',
        text: 'Оле смотрит на тебя внимательно, как смотрят на человека, который что-то недоговаривает.\n\n— Gut. Freitag.\n\nЛадно. В пятницу.',
        effects: [set25('acb', 'later'), until25(14, 25)] },
    ] }),

  // ═════════════ B: торт к пятнице ═════════════
  X({ id: 'c25_b_cake', title: 'Мука', camp: kitchen14,
    text: [
      { when: ninaFarm, text: 'Нина стоит у ларя с мукой и смотрит внутрь, как в колодец.\n\n— Если Оле в пятницу вернётся, надо испечь пирог, — говорит она по-русски. — С яблоками. Как Хенрике печёт. Я помню, сколько чего.' },
      { when: not(ninaFarm), text: 'Эва стоит у ларя с мукой.\n\n— Wenn der Junge Freitag kommt, backen wir. Das macht man so.\n\nЕсли парень в пятницу вернётся, надо печь. Так положено.' },
      { text: 'Муки на дне ларя на две недели хлеба. Если тонко.' },
    ],
    actions: [
      { id: 'c25_bc_yes', label: 'Разрешить: пирог к пятнице, из последней муки', when: { stocked: 'c3_flour', qty: 1, at: 'c3_farm_stock' }, minutes: 20, terminal: true, goto: 'c25_b_room',
        text: 'Килограмм муки отсыпают в миску, банку яблок поднимают из погреба. Пирог будут печь в четверг вечером, чтобы к пятнице был мягкий. Хлеба на неделю будет меньше. Пирог будет один.',
        effects: [set25('bc', 'yes'), w25('cake', true), { unstock: 'c3_flour', qty: 1, at: 'c3_farm_stock' }, { if: ninaFarm, then: [{ npc: 'c7_nina', trust: 2 }] }, until25(15, 20)] },
      { id: 'c25_bc_small', label: 'Сказать: маленький, на полкило, без сахара', minutes: 20, terminal: true, goto: 'c25_b_room',
        text: 'Договорились на маленький, на сковороде, с одним яблоком. Это будет не пирог Хенрике. Но это будет пирог.',
        effects: [set25('bc', 'small'), w25('cake', 'small'), until25(15, 15)] },
      { id: 'c25_bc_no', label: 'Отказать: мука на хлеб, а Оле обрадуется и без пирога', minutes: 10, terminal: true, goto: 'c25_b_room',
        text: 'Крышка ларя закрывается. Ты права, и все это понимают. От этого не легче.',
        effects: [set25('bc', 'no'), { if: ninaFarm, then: [{ npc: 'c7_nina', trust: -1 }] }, until25(15, 10)] },
    ] }),

  // ═════════════ A: зал списков ═════════════
  X({ id: 'c25_a_lists', title: 'Зал списков', location: 'c18_lueneburg', ambient: { tempC: 8, outdoor: false, wet: false },
    text: [
      { text: 'Зал списков — бывший актовый зал. Вдоль стен на верёвках висят листы: «Lebend», «Vermisst», «Verstorben», «Helfer DRK». Живы, пропали без вести, умерли, помощники Красного Креста. Люди ходят вдоль стен медленно, как в музее.' },
      { when: flag('w.c20_gerd_written'), text: 'На листе «Vermisst» — «Brockmann, Gerd» и твоя приписка карандашом: «10.11, лестница. Болен». Кто-то обвёл её ручкой.' },
      { when: any(v('A.met_jannik', 'refused'), flag('A.met_jannik')), text: 'На листе «Helfer DRK» строчка: «Jannik W., 22, Harburg — Fahrer, Kolonne Geesthacht». Студент из Харбурга. Из пробки на трассе в первый день.' },
      { text: 'У входа стол, на нём карандаш на верёвочке и пустой лист: «Wer sucht wen». Кто кого ищет.' },
    ],
    actions: [
      { id: 'c25_al3_names', label: 'Вписать себя и {B.acc}: хутор Людеманов, живы', minutes: 15, terminal: true, goto: 'c25_a_ole2',
        text: 'Ты пишешь печатными буквами: два имени, «Lüdemann-Hof bei Jesteburg», «leben». Если кто-то из прежней жизни ищет, теперь найдёт. Если кто-то не тот ищет, тоже найдёт.',
        effects: [set25('al3', 'names'), w25('listed_alive', true), until25(12, 30)] },
      { id: 'c25_al3_gerd', label: 'Дописать про Герда: «обратился»', when: flag('w.c20_gerd_written'), minutes: 15, terminal: true, goto: 'c25_a_ole2',
        text: 'Ты дописываешь под своей припиской одно слово: «erkrankt — gewandelt». Заболел — обратился. Карандаш крошится. Кто-то в Торонто или в Гамбурге прочтёт это и перестанет ждать. Или не прочтёт никогда.',
        effects: [set25('al3', 'gerd'), w25('gerd_turned_written', true), until25(12, 30)] },
      { id: 'c25_al3_jannik', label: 'Запомнить строчку про Янника', when: any(v('A.met_jannik', 'refused'), flag('A.met_jannik')), minutes: 10, terminal: true, goto: 'c25_a_ole2',
        text: 'Колонна Красного Креста, Гестхахт. Ты повторяешь про себя: Янник, двадцать два, Харбург, водитель. В первый день вы встретились в пробке на трассе. Теперь у него своя машина, с красным крестом.',
        effects: [set25('al3', 'jannik'), w25('jannik_seen', true), until25(12, 25)] },
      { id: 'c25_al3_walk', label: 'Пройти вдоль стен и уйти', minutes: 15, terminal: true, goto: 'c25_a_ole2',
        text: 'Фамилии, фамилии, фамилии. Ты не знаешь ни одной. У двери женщина водит пальцем по листу «Verstorben» и шепчет каждое имя вслух, как молитву.',
        effects: [set25('al3', 'walk'), until25(12, 25)] },
    ] }),

  X({ id: 'c25_a_swerve', title: 'На дороге', location: 'c7_farm_lane', ambient: van,
    text: [
      { text: 'Через километр после «Поло» из снега на дорогу выходит человек. Без шапки, в одной рубашке. Прямо в свет фар.' },
      { text: 'Вессель бьёт по тормозам. Фургон несёт боком по мокрому снегу.' },
    ],
    actions: [
      { id: 'c25_as3_wheel', label: 'Схватиться за руль вместе с ним', minutes: 10, risky: true, terminal: true, goto: 'c25_supper', ambientDuring: van,
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'driving'], difficulty: 3, uses: ['mobility'] }, text: 'Вы выкручиваете руль вдвоём. Фургон проходит в метре от человека, задевает его зеркалом и выравнивается. В зеркале он стоит посреди дороги и поворачивается вслед. Вессель дышит так, будто бежал.', effects: [set25('as3', 'wheel'), w25('swerve', 'missed')] },
          { id: 'hit', text: 'Руль вырывается из рук. Глухой удар, фургон подпрыгивает. Ты бьёшься плечом о дверь. Вессель не останавливается. Только у Йестебурга говорит: «Der linke Scheinwerfer ist hin». Левая фара разбита. Больше ничего.', effects: [set25('as3', 'hit'), w25('swerve', 'hit'), { injure: 'bruise', site: 'rightArm', severity: 1 }, { body: 'stress', delta: 5 }] },
        ], effects: [until25(17, 50)] },
      { id: 'c25_as3_brace', label: 'Упереться ногами и держаться', minutes: 10, risky: true, terminal: true, goto: 'c25_supper', ambientDuring: van,
        outcomes: [
          { id: 'ok', check: { traits: ['endurance'], difficulty: 2 }, text: 'Фургон разворачивает поперёк дороги и бросает в сугроб на обочине. Человек проходит мимо капота, не глядя, и уходит в поле. Вессель долго сидит, положив лоб на руль. Потом выталкивает фургон из сугроба задним ходом.', effects: [set25('as3', 'brace'), w25('swerve', 'ditch')] },
          { id: 'hurt', text: 'Фургон бросает в сугроб, тебя — лбом в стекло. Перед глазами звёзды. Когда они гаснут, человека на дороге уже нет. Вессель трогает твой лоб пальцем в перчатке без пальцев и говорит: «Wird blau». Будет синяк.', effects: [set25('as3', 'hurt'), w25('swerve', 'ditch'), { injure: 'bruise', site: 'head', severity: 1 }, { body: 'stress', delta: 4 }] },
        ], effects: [until25(17, 55)] },
      { id: 'c25_as3_gas', label: 'Крикнуть: «Gas!» Не тормозить', minutes: 10, terminal: true, goto: 'c25_supper', ambientDuring: van,
        text: 'Вессель отпускает тормоз и давит на газ. Удар глухой, тяжёлый, как в мешок с песком. Фургон выравнивается. Вессель молчит до самого Йестебурга. У пекарни он выходит, смотрит на разбитую фару и на бампер, долго. Потом идёт в кабину спать, не попрощавшись.',
        effects: [set25('as3', 'gas'), w25('swerve', 'hit'), { body: 'stress', delta: 4 }, until25(17, 45)] },
    ] }),
];
