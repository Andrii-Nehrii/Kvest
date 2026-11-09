import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { kitchen14, yard14 } from './point14';
import { S16, brandt, day16, dusk16, jannes, jensAlive, nina, ninaAway, ninaHere, ute, village16 } from './point16';
import { kitchen14 as kitchen16 } from './point14';

// Развилки участка 16 (дополнение 09.11): у A — деревня или трактор, у B — хутор или колония. Плюс Нина/Лена.
const village = 'c16_jesteburg';
const road = 'b75_road';
const toHomeTractor: Effect = { restUntil: at(16, 17, 10) };
const toDinner16: Effect = { restUntil: at(16, 18, 30) };
const toTobias16: Effect = { restUntil: at(16, 19, 30) };
const deniz = (trust: number): Effect => ({ npc: 'deniz', trust });
const kerem = (trust: number): Effect => ({ npc: 'kerem', trust });

export const day16xScenes: Scene[] = [
  // ───────────── A: Керем у ворот — развилка ─────────────
  S16({ id: 'c16_a_kerem0', for: 'any', chapter: 'ch3', title: 'Керем', location: village, camp: village16, ambient: day16,
    text: [
      { text: 'У ворот пожарной части кто-то окликает тебя по имени. Керем. С тележкой из супермаркета, в ней две пустые канистры.\n\n— Ты живой! — Он хлопает тебя по плечу. — Дениз послал. Солярку на еду меняли, всё сменяли.' },
      { text: 'Потом, тише:\n\n— Слушай. Трактор Хенрике у нас в мастерской стоит. Оле пригнал неделю назад, сцепление. Всё сделали. Ключ в замке, солярки на полдня. Пойдёшь со мной сейчас — к темноте будешь дома на тракторе. Семь километров.' },
      { text: 'У бочки с огнём громко говорят про укушенного мальчика и про колонию у насыпи.' },
    ],
    actions: [
      { id: 'c16_ak0_go', label: 'Пойти с Керемом за трактором', minutes: 5, terminal: true, goto: 'c16_a_tw_road',
        text: 'Керем разворачивает тележку.\n\n— Вот это я понимаю, — говорит он. — Дениз обрадуется. Он про Хенрике каждый день спрашивает.', effects: [{ set: '$.c16_route', value: 'tractor' }, { set: 'w.c16_tractor_known', value: true }, kerem(1)] },
      { id: 'c16_ak0_stay', label: 'Остаться: сначала узнать, что тут говорят про колонию', minutes: 4, terminal: true, goto: 'c16_a_stove',
        text: '— Ну, потом, — говорит Керем. — Трактор не убежит. — Он машет рукой и катит тележку к дороге на Бухгольц.', effects: [{ set: '$.c16_route', value: 'village' }, { set: 'w.c16_tractor_known', value: true }] },
      { id: 'c16_ak0_hosts', label: 'Рассказать ему про Хенрике и Оле и остаться', minutes: 8, terminal: true, goto: 'c16_a_stove',
        text: 'Керем слушает и долго молчит.\n\n— Кровь берут, — повторяет он. — У тех, кто выжил. — Он смотрит на канистры. — Дениз скажет: нехорошо это. Когда у людей кровь берут, а не спрашивают.\n\nОн уходит к дороге на Бухгольц, оглядываясь.', effects: [{ set: '$.c16_route', value: 'village' }, { set: 'w.c16_tractor_known', value: true }, kerem(2)] },
    ] }),

  // ───────────── A: путь за трактором ─────────────
  S16({ id: 'c16_a_tw_road', for: 'any', chapter: 'ch3', title: 'Семь километров', location: road, ambient: day16,
    text: [{ text: 'Вы идёте по обочине B75. Тележка дребезжит на каждой выбоине. Машин почти нет. Один раз мимо проезжает военный грузовик, и Керем по привычке отводит глаза.\n\n— В Бухгольце больница пустая, — говорит он. — Совсем. Кто мог, ушёл. Кто не мог… позавчера разбрелись по дорогам. В рубашках.' }],
    actions: [
      { id: 'c16_atr_deniz', label: 'Спросить, как там Дениз', minutes: 85, activity: 'moderate', move: true, terminal: true, goto: 'c16_a_tw_post',
        text: '— Злится, — говорит Керем. — На всех. На армию, на погоду, на меня. Значит, нормально. — Он улыбается. — Когда Дениз молчит, тогда плохо.', effects: [{ set: '$.c16_atr', value: 'deniz' }, kerem(1)] },
      { id: 'c16_atr_shirts', label: 'Спросить про тех, в рубашках', minutes: 85, activity: 'moderate', move: true, terminal: true, goto: 'c16_a_tw_post',
        text: '— С браслетами, — говорит Керем. — Пластиковые, на руке. Дениз одного видел у заправки. Босиком по льду шёл и не мёрз.\n\nОн показывает на запястье, где у тебя часы.', effects: [{ set: '$.c16_atr', value: 'shirts' }, { set: '$.c16_heard_bands', value: true }] },
      { id: 'c16_atr_fast', label: 'Идти быстро, чтобы успеть до темноты', minutes: 70, activity: 'heavy', move: true, terminal: true, goto: 'c16_a_tw_post',
        text: 'Ты задаёшь темп. Керем не жалуется, только тележка дребезжит чаще. К мастерской вы подходите взмокшие, хотя на улице пять градусов.', effects: [{ set: '$.c16_atr', value: 'fast' }, { body: 'fatigue', delta: 4 }] },
    ] }),

  S16({ id: 'c16_a_tw_deniz', for: 'any', chapter: 'ch3', title: 'Мастерская', location: 'deniz_workshop', ambient: { tempC: 10, outdoor: false, wet: false },
    text: [
      { text: 'Дениз вытирает руки тряпкой и смотрит на тебя, будто ты опоздал{m:|а} на неделю.\n\n— Наконец-то, — говорит он. — Я уже думал, придётся самому гнать. А у меня бензина нет даже на зажигалку.' },
      { text: 'Трактор стоит в боксе, зелёный, старый, с одной фарой. На сиденье подушка, сшитая из мешка: Хенрике шила.' },
    ],
    actions: [
      { id: 'c16_atd_hosts', label: 'Рассказать Денизу про Хенрике и Оле', minutes: 15, terminal: true, goto: 'c16_a_tw_diesel',
        text: 'Дениз слушает, не перебивая. Потом бросает тряпку на верстак.\n\n— Плазма, — говорит он. — Значит, Оле теперь как бензин. Его сливают. — Пауза. — Передай Хенрике, если увидишь: Дениз сказал, пусть забирает сына и едет домой. Он сам знает, как с армией.\n\nКак — он не объясняет.', effects: [{ set: '$.c16_atd', value: 'hosts' }, deniz(2)] },
      { id: 'c16_atd_drive', label: 'Попросить показать, как с ним обращаться', minutes: 15, terminal: true, goto: 'c16_a_tw_diesel',
        text: '— Сцепление новое, не дёргай, — говорит Дениз. — Тормоз левый тянет. Фара одна, вторую Оле разбил ещё летом. — Он стучит по капоту. — И не гони. Он старше тебя.', effects: [{ set: '$.c16_atd', value: 'drive' }, { set: '$.c16_knows_tractor', value: true }, deniz(1)] },
      { id: 'c16_atd_come', label: 'Позвать Дениза и Керема на хутор', minutes: 10, terminal: true, goto: 'c16_a_tw_diesel',
        text: 'Дениз качает головой.\n\n— Мастерская — это всё, что у меня есть, — говорит он. — Уйду — растащат. — Потом добавляет: — Но если что-то сломается — везите. Хенрике я должен.\n\nКерем за его спиной разводит руками: вот такой у меня брат.', effects: [{ set: '$.c16_atd', value: 'come' }, deniz(1), kerem(1)] },
    ] }),

  S16({ id: 'c16_a_tw_drive', for: 'any', chapter: 'ch3', title: 'Одна фара', location: road, ambient: dusk16,
    text: [
      { text: 'Трактор заводится с полоборота и трясётся так, что стучат зубы. Ты едешь по B75 в сумерках, двадцать километров в час. Единственная фара светит криво, в обочину.' },
      { text: 'За поворотом на Йестебург посреди дороги идёт человек. Босиком. Больничная рубашка развязана на спине. Он поворачивается на рёв мотора и идёт прямо на свет.' },
    ],
    actions: [
      { id: 'c16_atdr_around', label: 'Объехать его по обочине и ехать дальше', minutes: 15, terminal: true, goto: 'c16_a_tw_cross',
        text: 'Ты съезжаешь на обочину. Колесо проваливается в канаву, трактор кренится и выбирается. Человек в рубашке разворачивается вслед за звуком. В зеркале он стоит посреди дороги, всё меньше. В сторону деревни.', effects: [{ set: '$.c16_atdr', value: 'around' }, { body: 'stress', delta: 2 }, toHomeTractor] },
      { id: 'c16_atdr_look', label: 'Остановиться и посветить ему на руки', minutes: 10, risky: true, terminal: true, goto: 'c16_a_tw_cross',
        text: 'Ты тормозишь, не глуша мотор. Фара бьёт ему в грудь. На запястье пластиковый браслет. Ты успеваешь прочитать: «Klinikum Buchholz».\n\nОн бросается на фару. Ты давишь на газ. Трактор дёргается, и человек остаётся за спиной.', effects: [{ set: '$.c16_atdr', value: 'look' }, { set: '$.c16_saw_band', value: true }, { body: 'stress', delta: 4 }, toHomeTractor] },
      { id: 'c16_atdr_field', label: 'Свернуть в поле и увести его рёвом от деревни', minutes: 30, risky: true, terminal: true, goto: 'c16_a_tw_cross',
        text: 'Ты сворачиваешь на полевую дорогу и сбавляешь ход. Человек идёт за рёвом. Километр, другой. У леса ты даёшь газу, и трактор уходит. Он останется там, в поле, далеко от деревни. Пока.', effects: [{ set: '$.c16_atdr', value: 'field' }, { set: 'w.c16_wanderer_led', value: true }, { body: 'fatigue', delta: 3 }, toHomeTractor] },
    ] }),

  S16({ id: 'c16_a_tw_home', for: 'any', chapter: 'ch3', title: 'Трактор во дворе', camp: yard14, ambient: dusk16,
    text: [
      { text: 'Ты въезжаешь во двор, и куры в курятнике поднимают крик. Мотор глохнет. Становится так тихо, что слышно, как остывает металл.' },
      { when: ninaHere, text: 'Нина выбегает на крыльцо и замирает.\n\n— Трактор Оле! — говорит она. — Он меня на нём один раз в школу довёз. Весь класс смотрел в окно.' },
    ],
    actions: [
      { id: 'c16_ath_canopy', label: 'Поставить под навес, рядом с фургоном', minutes: 8, terminal: true, goto: 'c16_a_gatefix',
        text: 'Трактор встаёт под навес, бок о бок с пустым фургоном. Ты кладёшь ключ на гвоздь у двери кухни, где висят все ключи хутора.', effects: [{ set: '$.c16_ath', value: 'canopy' }, { set: 'w.c16_tractor', value: true }] },
      { id: 'c16_ath_check', label: 'Проверить бак и трос в ящике', minutes: 12, terminal: true, goto: 'c16_a_gatefix',
        text: 'Солярки в баке на треть. В ящике под сиденьем трос, перчатки и пачка печенья, просроченная с весны. Оле. За трактором прицепная тележка так и стоит у сарая, где её отцепили неделю назад.', effects: [{ set: '$.c16_ath', value: 'check' }, { set: 'w.c16_tractor', value: true }, { set: 'w.c16_trailer_seen', value: true }] },
    ] }),

  // ───────────── A: колокол в деревне ─────────────
  S16({ id: 'c16_a_bell', for: 'any', chapter: 'ch3', title: 'Колокол', location: village, camp: village16, ambient: day16,
    text: [{ text: 'Брандт не успевает закрыть тетрадь: на церкви бьёт колокол. Три раза, пауза, ещё три. Люди у столов бросают всё и бегут к краю деревни, за огороды.\n\nНа краю поля, у садовых участков, стоит босой человек в больничной рубашке. Он поворачивает голову на колокол. Двое мужчин уже идут к нему с вилами. Парень с повязкой — с топором.' }],
    actions: [
      { id: 'c16_abl_help', label: 'Взять у кого-нибудь вилы и встать рядом', minutes: 15, risky: true, terminal: true, goto: 'c16_a_boy',
        text: 'Ты прижимаешь его вилами к забору вместе с мужиком в пуховике. Человек в рубашке не чувствует зубьев, давит вперёд. Парень с повязкой бьёт топором. Один раз. Потом долго стоит, не поднимая глаз.\n\nНа запястье у убитого пластиковый браслет: «Klinikum Buchholz. Station 4». Брандт наклоняется, читает и выпрямляется очень медленно.', effects: [{ set: '$.c16_bell', value: 'help' }, { set: '$.c16_saw_band', value: true }, { injure: 'bruise', site: 'leftArm', severity: 1 }, { body: 'stress', delta: 4 }, brandt(2)] },
      { id: 'c16_abl_watch', label: 'Смотреть с дороги', minutes: 12, terminal: true, goto: 'c16_a_boy',
        text: 'Ты стоишь у дороги. Всё кончается быстро: вилы, топор, тишина. Брандт наклоняется над телом, долго смотрит на руку убитого и выпрямляется очень медленно. Потом идёт к пункту, не оглядываясь.\n\nКто-то рядом говорит: «Krankenhaus. Schon der zweite».', effects: [{ set: '$.c16_bell', value: 'watch' }, { set: '$.c16_saw_band', value: true }, { body: 'stress', delta: 2 }] },
      { id: 'c16_abl_away', label: 'Не ходить туда: идти прямо в пункт', minutes: 6, terminal: true, goto: 'c16_a_boy',
        text: 'Колокол замолкает, пока ты идёшь к школе. Потом кто-то кричит, коротко. Потом тишина.', effects: [{ set: '$.c16_bell', value: 'away' }] },
    ] }),

  // ───────────── B: в колонию с Яннесом ─────────────
  S16({ id: 'c16_b_cw_road', for: 'any', chapter: 'ch3', title: 'С тачкой по шпалам', location: 'c10_field', ambient: day16,
    text: [{ text: 'Вы толкаете тачку с канистрами вдвоём. На подъёме к насыпи колесо вязнет, и вы оба упираетесь плечами. Яннес молчит. Потом, на шпалах, начинает говорить сам.\n\n— Ich wollte Elektriker werden, — говорит он. — Lehrstelle in Winsen. Ab Januar.\n\nХотел стать электриком. Место в Винзене. С января.' }],
    actions: [
      { id: 'c16_bcw_ute', label: 'Спросить, как мама держится', minutes: 40, activity: 'heavy', move: true, terminal: true, goto: 'c16_b_cw_ute',
        text: '— Sie singt, — говорит Яннес. — Den ganzen Tag. Früher hat sie nie gesungen.\n\nОна поёт. Целыми днями. Раньше никогда не пела.', effects: [{ set: '$.c16_bcw', value: 'ute' }, jannes(1)] },
      { id: 'c16_bcw_job', label: 'Сказать, что электрики теперь нужнее всех', minutes: 40, activity: 'heavy', move: true, terminal: true, goto: 'c16_b_cw_ute',
        text: 'Яннес фыркает. Потом, через сто шагов:\n\n— Ihr habt einen Generator. Ich hab das Tuckern gehört. Wenn was ist — ich kann Kabel.\n\nУ вас генератор. Я слышал, как он тарахтит. Если что — я умею с проводами.', effects: [{ set: '$.c16_bcw', value: 'job' }, { set: 'w.c16_jannes_wires', value: true }, jannes(2)] },
      { id: 'c16_bcw_quiet', label: 'Просто толкать и молчать', minutes: 35, activity: 'heavy', move: true, terminal: true, goto: 'c16_b_cw_ute',
        text: 'Вы толкаете молча. Это хорошее молчание, рабочее. У будки обходчика Яннес первый раз за день улыбается: тачка сама катится под уклон.', effects: [{ set: '$.c16_bcw', value: 'quiet' }] },
    ] }),

  S16({ id: 'c16_b_cw_ute', for: 'any', chapter: 'ch3', title: 'Песня', location: 'c15_garden', ambient: day16,
    onEnter: [{ set: '$.met.c14_ute', value: true }],
    text: [{ text: 'В колонии Уте сидит на табуретке у одиннадцатого домика, у открытой ставни, и поёт. Старая песня, медленная. Кай на матрасе раскачивается в такт. Или не в такт.\n\nЦепи на его ноге нет. Вокруг пояса верёвка, завязанная бантиком.\n\nУте видит тебя и не перестаёт петь. Только кивает: садись.' }],
    actions: [
      { id: 'c16_bcu_chain', label: 'Попросить её надеть цепь обратно', minutes: 8, risky: true, terminal: true, goto: 'c16_b_cw_nine',
        text: 'Уте допевает куплет.\n\n— Die Kette tut ihm weh, — говорит она. — Sieh doch. Am Knöchel.\n\nЦепь ему больно. Посмотри. На щиколотке.\n\nТы смотришь. Рана красная, мокрая. Уте гладит верёвку, как поводок.\n\n— Morgen gehen wir spazieren, — говорит она. — Er und ich. Wie früher.\n\nЗавтра мы пойдём гулять. Он и я. Как раньше.', effects: [{ set: '$.c16_bcu', value: 'chain' }, { set: '$.c16_heard_walk', value: true }, ute(-1)] },
      { id: 'c16_bcu_song', label: 'Сесть рядом и дослушать песню', minutes: 12, terminal: true, goto: 'c16_b_cw_nine',
        text: 'Ты садишься на ступеньку. Песня про реку и мельницу. Уте поёт до конца, все куплеты. Кай раскачивается. На последней строчке он поворачивает голову на её голос.\n\n— Siehst du? — шепчет Уте. — Er hört mich.\n\nВидишь? Он меня слышит.', effects: [{ set: '$.c16_bcu', value: 'song' }, ute(2)] },
      { id: 'c16_bcu_walk', label: 'Спросить, что она задумала', minutes: 8, terminal: true, goto: 'c16_b_cw_nine',
        text: 'Уте смотрит на тебя долго.\n\n— Spazieren gehen, — говорит она. — Einmal ohne Kette. Bevor die anderen kommen.\n\nПогулять. Один раз без цепи. Пока не пришли другие.\n\nОна улыбается, и от этой улыбки тебе становится холодно.', effects: [{ set: '$.c16_bcu', value: 'walk' }, { set: '$.c16_heard_walk', value: true }] },
    ] }),

  S16({ id: 'c16_b_cw_nine', for: 'any', chapter: 'ch3', title: 'Домики', location: 'c15_garden', ambient: dusk16,
    text: [
      { when: jensAlive, text: 'Перед уходом ты проходишь мимо двенадцатого домика. В щель ставни видно: Йенс сидит на матрасе в Нининой шапке, набекрень. Он поворачивает голову на твои шаги.' },
      { text: 'В девятом домике сидит женщина в цветастом платке, руки на коленях, как в приёмной у врача.\n\n— Frau Albers, — говорит Яннес. — Ihr Sohn ist Soldat. Der mit dem Fahrrad.\n\nФрау Альберс. Её сын — солдат. Тот, что на велосипеде.' },
    ],
    actions: [
      { id: 'c16_bcn_jens', label: 'Постоять у двенадцатого', when: jensAlive, minutes: 8, terminal: true, goto: 'c16_b_cw_back',
        text: 'Ты стоишь у ставни. Йенс поворачивается то к тебе, то к ветру в голых ветках. Миска у него полная: вода, которую вы привезли.', effects: [{ set: '$.c16_bcn', value: 'jens' }, { set: '$.c16_saw_jens', value: true }] },
      { id: 'c16_bcn_albers', label: 'Поздороваться с фрау Альберс', minutes: 6, terminal: true, goto: 'c16_b_cw_back',
        text: '— Guten Tag, Frau Albers, — говоришь ты. Она поворачивает голову на голос. Платок сползает на плечо. Яннес поправляет его концом шеста, осторожно, как поправляют ребёнку шапку.', effects: [{ set: '$.c16_bcn', value: 'albers' }, jannes(1)] },
      { id: 'c16_bcn_go', label: 'Идти: темнеет', minutes: 3, terminal: true, goto: 'c16_b_cw_back',
        text: 'Солнце уже за насыпью. Яннес провожает тебя до калитки колонии.', effects: [{ set: '$.c16_bcn', value: 'go' }] },
    ] }),

  S16({ id: 'c16_b_cw_back', for: 'any', chapter: 'ch3', title: 'Затемно', location: 'c10_field', ambient: dusk16,
    text: [{ text: 'Обратно ты идёшь по шпалам {m:один|одна}, с фонарём Яннеса. Красное стекло. «Белым не свети, — сказал он. — Они идут на белый».\n\nХутор показывается в темноте не сразу: только окно кухни. Курятник никто не закрыл.' }],
    actions: [
      { id: 'c16_bcb_hens', label: 'Сначала закрыть кур', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c16_b_dusk',
        text: 'Ты пересчитываешь кур в темноте, на ощупь. Десять. Задвигаешь засов. Яйца собирать уже поздно.', effects: [{ set: '$.c16_bcb', value: 'hens' }, { restUntil: at(16, 17, 10) }] },
      { id: 'c16_bcb_house', label: 'Скорее в дом', minutes: 30, activity: 'moderate', move: true, terminal: true, goto: 'c16_b_dusk',
        text: 'Ты идёшь прямо в дом. Курятник остаётся открытым. Потом, позже.', effects: [{ set: '$.c16_bcb', value: 'house' }, { set: 'w.c16_coop_open', value: true }, { restUntil: at(16, 17) }] },
    ] }),


  // ───────────── дополнительные сцены путей ─────────────
  S16({ id: 'c16_a_leo', for: 'any', chapter: 'ch3', title: 'Маркус', location: 'c13_sammel', ambient: { tempC: 12, outdoor: false, wet: false },
    text: [{ text: 'У дальней стены тебя ловит за рукав Маркус. Лео спит на раскладушке, обняв зайца.\n\n— Бабушка не отвечает, — говорит Маркус. Тихо, по-английски вперемешку с немецким. — Третий день. Здесь говорят: Целле закрыт. Я всё равно пойду. Завтра. С ним.\n\nОн смотрит на тебя так, будто ты можешь запретить.' }],
    actions: [
      { id: 'c16_alo_map', label: 'Отдать ему свою карту области', when: { has: 'road_map' }, minutes: 6, terminal: true, goto: 'c16_a_doctor',
        text: 'Маркус разворачивает карту на раскладушке и долго водит пальцем: Йестебург, Ханштедт, Целле. Девяносто километров. Он складывает её по сгибам, аккуратно, как документ.\n\n— Я верну, — говорит он. Вы оба знаете, что нет.', effects: [{ set: '$.c16_alo', value: 'map' }, { take: 'road_map', qty: 1 }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', trust: 3 }] }] },
      { id: 'c16_alo_wait', label: 'Уговорить подождать, пока бабушка ответит', minutes: 8, terminal: true, goto: 'c16_a_doctor',
        text: 'Маркус слушает и трёт лицо ладонями.\n\n— Ещё два дня, — говорит он наконец. — Потом пойду. Если не ответит.\n\nЛео во сне переворачивается и роняет зайца. Маркус поднимает его, не глядя, и кладёт обратно.', effects: [{ set: '$.c16_alo', value: 'wait' }, { set: 'w.c16_marcus_waits', value: true }] },
      { id: 'c16_alo_farm', label: 'Сказать: если не дойдёте — приходите на хутор', minutes: 6, terminal: true, goto: 'c16_a_doctor',
        text: 'Маркус кивает. Потом ещё раз, будто не расслышал с первого.\n\n— Хутор, — повторяет он. — Хорошо. Я запомню дорогу.', effects: [{ set: '$.c16_alo', value: 'farm' }, { set: 'w.c16_marcus_invited', value: true }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', trust: 2 }] }] },
    ] }),

  S16({ id: 'c16_a_tw_cross', for: 'any', chapter: 'ch3', title: 'Переезд', location: 'c10_field', ambient: dusk16,
    text: [{ text: 'Домой ты сворачиваешь на полевую дорогу вдоль насыпи: так короче. У колонии на насыпи стоит Яннес с двумя пустыми вёдрами и смотрит на трактор, открыв рот. Потом бежит вниз, к дороге.\n\n— Насос сломан, — кричит он сквозь мотор. — Ручей далеко. Вы можете… с бочкой?' }],
    actions: [
      { id: 'c16_atc_haul', label: 'Привезти ему бочку воды с хутора', minutes: 45, activity: 'moderate', terminal: true, goto: 'c16_a_tw_home',
        text: 'Ты гонишь трактор на хутор, грузишь на прицеп пустую бочку, наливаешь из колодца и везёшь обратно по полевой дороге. Яннес разливает воду по вёдрам и не говорит ни слова. Только на прощание кладёт ладонь на тёплый капот.', effects: [{ set: '$.c16_atc', value: 'haul' }, { set: 'w.c16_water_hauled', value: true }, jannes(3), ute(1), { body: 'fatigue', delta: 3 }] },
      { id: 'c16_atc_tomorrow', label: 'Крикнуть: завтра!', minutes: 3, terminal: true, goto: 'c16_a_tw_home',
        text: 'Яннес показывает большой палец и бежит обратно на насыпь, вёдра бьют его по коленям.', effects: [{ set: '$.c16_atc', value: 'tomorrow' }, jannes(1)] },
      { id: 'c16_atc_drive', label: 'Помахать и ехать дальше: темнеет', minutes: 2, terminal: true, goto: 'c16_a_tw_home',
        text: 'Яннес останавливается на полдороге. Опускает вёдра на землю и смотрит тебе вслед.', effects: [{ set: '$.c16_atc', value: 'drive' }, jannes(-1)] },
    ] }),

  S16({ id: 'c16_b_merle', for: 'any', chapter: 'ch3', title: 'Мерле', camp: kitchen16,
    text: [
      { text: 'Телефон вибрирует ещё раз. Мерле. Ты не видел{m:|а} её имя на экране с самого Бармбека.\n\n«Живые. Аренсбург. У папы есть ток по ночам. Инсулин до пятницы, аптеки пустые. Ты как? Где ты?»' },
      { when: { not: { flag: 'w.c16_gen' } }, text: 'Заряда мало. На длинный ответ не хватит.' },
    ],
    actions: [
      { id: 'c16_bm_doctor', label: 'Ответить: спрошу у врача в пункте про инсулин', minutes: 6, terminal: true, goto: 'c16_dinner',
        text: '«Спрошу. В Йестебурге есть врач. Держись». Ответ приходит через минуту: смайлик, который Мерле всегда ставила, когда ей было страшно. Шутка, которой никто не смеётся.', effects: [{ set: '$.c16_bm', value: 'doctor' }, { set: 'w.c16_merle_insulin', value: true }, { charge: 'phone', delta: -1 }, { npc: 'merle', trust: 2 }, toDinner16] },
      { id: 'c16_bm_where', label: 'Рассказать, где ты и что у вас', minutes: 10, terminal: true, goto: 'c16_dinner',
        text: 'Ты пишешь длинно: хутор, куры, генератор. Про колонию не пишешь. Мерле отвечает: «Хутор?! Ты? Курица?!» — и потом, через минуту: «Я рада. Правда».', effects: [{ set: '$.c16_bm', value: 'where' }, { charge: 'phone', delta: -2 }, { npc: 'merle', trust: 1 }, toDinner16] },
      { id: 'c16_bm_later', label: 'Ответить потом: сейчас ужин', minutes: 2, terminal: true, goto: 'c16_dinner',
        text: 'Ты пишешь одно слово: «Живая». Остальное потом. Если будет заряд.', effects: [{ set: '$.c16_bm', value: 'later' }, toDinner16] },
    ] }),


  S16({ id: 'c16_glow', for: 'any', chapter: 'ch3', title: 'Огни в поле', camp: yard14, ambient: dusk16,
    text: [
      { text: 'В четверть девятого со стороны Итценбюттеля хлопает выстрел. Потом ещё два. Над полем, далеко, качаются огоньки: фонари, факелы, кто-то идёт цепью и кричит.' },
      { when: { flag: 'w.c16_wanderer_led' }, text: 'Ты знаешь, кого они ищут. Того, в больничной рубашке, которого ты увёл{m:|а} трактором в поле.' },
    ],
    actions: [
      { id: 'c16_gl_gate', label: 'Выйти к калитке с фонарём и смотреть', minutes: 20, terminal: true, goto: 'c16_night',
        text: 'Ты стоишь у калитки, свет держишь вниз. Огоньки сходятся в одном месте у леса. Ещё один выстрел. Потом огоньки медленно идут обратно, к деревне. Кто-то смеётся. Нервно, слишком громко.', effects: [{ set: '$.c16_gl', value: 'gate' }, { body: 'stress', delta: 2 }] },
      { id: 'c16_gl_jannes', label: 'Написать Яннесу: в поле люди с ружьями', minutes: 5, terminal: true, goto: 'c16_night',
        text: 'Ответ приходит сразу: «Gesehen. Licht aus. Danke». Видел. Свет погасили. Спасибо.\n\nВ стороне колонии гаснет единственный огонёк.', effects: [{ set: '$.c16_gl', value: 'jannes' }, { set: 'w.c16_warned_jannes', value: true }, { charge: 'phone', delta: -1 }, jannes(1)] },
      { id: 'c16_gl_dark', label: 'Погасить свет в доме и сидеть тихо', minutes: 20, terminal: true, goto: 'c16_night',
        text: 'Ты гасишь лампу и сидишь у окна в темноте. Огоньки качаются над полем, сходятся, расходятся. Через двадцать минут их нет. В доме так тихо, что слышно, как тикают часы Хенрике.', effects: [{ set: '$.c16_gl', value: 'dark' }] },
    ] }),

  S16({ id: 'c16_a_tw_diesel', for: 'any', chapter: 'ch3', title: 'Канистра', location: 'deniz_workshop', ambient: { tempC: 10, outdoor: false, wet: false },
    text: [{ text: 'Когда ты уже садишься на трактор, Керем выкатывает из угла канистру.\n\n— Двадцать литров солярки, — говорит он. — Брат сказал: Хенрике осенью картошкой отдаст. Или не отдаст. Бери.' }],
    actions: [
      { id: 'c16_atdi_take', label: 'Взять канистру', minutes: 5, terminal: true, goto: 'c16_a_tw_drive',
        text: 'Канистра тяжёлая. Ты ставишь её в ящик за сиденьем и привязываешь ремнём. Дениз из бокса машет тряпкой: езжай.', effects: [{ set: '$.c16_atdi', value: 'take' }, { set: 'w.c16_diesel', value: true }, deniz(1)] },
      { id: 'c16_atdi_no', label: 'Отказаться: им самим нужнее', minutes: 3, terminal: true, goto: 'c16_a_tw_drive',
        text: 'Керем пожимает плечами и закатывает канистру обратно.\n\n— Гордые все, — говорит Дениз из бокса. — Хенрике научила.', effects: [{ set: '$.c16_atdi', value: 'no' }, deniz(2)] },
    ] }),


  S16({ id: 'c16_dishes', for: 'any', chapter: 'ch3', title: 'Посуда', camp: kitchen16,
    text: [
      { text: 'После ужина вы моете посуду вдвоём, в тазу, тёплой водой из чайника. Ты моешь, {partner} вытирает. Как дома. Как будто где-то ещё есть «дома».' },
      { when: ninaHere, text: 'Нина ушла наверх. Слышно, как скрипит раскладушка.' },
    ],
    actions: [
      { id: 'c16_ds_winter', label: 'Заговорить о том, как вы тут перезимуете', minutes: 15, terminal: true, goto: 'c16_tobias',
        text: 'Вы считаете вслух: картошка, дрова, куры, бензин. Цифры выходят то хорошие, то плохие. Потом {partner} говорит: «Перезимуем». И ты почему-то веришь.', effects: [{ set: '$.c16_ds', value: 'winter' }, { body: 'stress', delta: -1 }, toTobias16] },
      { id: 'c16_ds_before', label: 'Вспомнить, как всё было до', minutes: 15, terminal: true, goto: 'c16_tobias',
        text: 'Вы вспоминаете ерунду: кофейню у вокзала, кто из вас вечно терял ключи, тот дурацкий фильм, на котором вы оба уснули. Смеётесь тихо, чтобы не разбудить Нину. Или чтобы не спугнуть.', effects: [{ set: '$.c16_ds', value: 'before' }, { body: 'stress', delta: -2 }, toTobias16] },
      { id: 'c16_ds_quiet', label: 'Мыть молча, плечом к плечу', minutes: 10, terminal: true, goto: 'c16_tobias',
        text: 'Вы не говорите ни слова. Тарелка, полотенце, полка. Плечо {partner.gen} касается твоего. Этого хватает.', effects: [{ set: '$.c16_ds', value: 'quiet' }, toTobias16] },
    ] }),

  S16({ id: 'c16_a_tw_post', for: 'any', chapter: 'ch3', title: 'Пост на въезде', location: 'b75_road', ambient: day16,
    text: [{ text: 'На въезде в Бухгольц поперёк дороги стоят два мусорных контейнера. За ними трое в светоотражающих жилетах, один с охотничьим ружьём. Керема они знают и машут. На тебя смотрят дольше.\n\n— Aus Jesteburg? — спрашивает тот, что с ружьём. — Was gibt\'s da?\n\nИз Йестебурга? Что там?' }],
    actions: [
      { id: 'c16_atp_news', label: 'Рассказать про укушенного мальчика и колокол', minutes: 8, terminal: true, goto: 'c16_a_tw_deniz',
        text: 'Мужчина с ружьём кивает на каждое слово.\n\n— Krankenhaus, — говорит он. — Das sind die aus dem Krankenhaus. Wir haben gestern zwei.\n\nБольница. Это те, из больницы. Мы вчера двоих.\n\nОн не договаривает, что «двоих».', effects: [{ set: '$.c16_atp', value: 'news' }, { set: '$.c16_heard_bands', value: true }] },
      { id: 'c16_atp_short', label: 'Сказать коротко: всё спокойно', minutes: 4, terminal: true, goto: 'c16_a_tw_deniz',
        text: '— Ruhig, — повторяет мужчина с недоверием. — Ruhig gibt\'s nicht mehr.\n\nСпокойно. Спокойно больше не бывает.\n\nНо отодвигает контейнер.', effects: [{ set: '$.c16_atp', value: 'short' }] },
    ] }),

  // ───────────── B: Нина или Лена ─────────────
  S16({ id: 'c16_b_nina2', for: 'any', chapter: 'ch3', title: 'Нина хочет сейчас', camp: kitchen14,
    text: [
      { when: ninaHere, text: 'Нина спускается в куртке, с письмом в кармане.\n\n— Я не буду ждать среды, — говорит она. — Я сейчас схожу. Туда и обратно. До темноты успею. Яннес как раз пойдёт назад.' },
      { when: ninaAway, text: 'Звонит незнакомый номер из Винзена. Женщина, торопливо, по-немецки: мама Лены.\n\n— Nina weint nachts. Sie will Mittwoch zu ihrem Vater. Kann sie zu euch kommen? Oder kommt ihr sie holen?\n\nНина плачет по ночам. В среду она хочет к отцу. Можно ей к вам? Или вы за ней приедете?' },
    ],
    actions: [
      { id: 'c16_bn2_go', label: 'Отпустить её с Яннесом', when: ninaHere, minutes: 5, terminal: true, goto: 'c16_b_bread',
        text: 'Нина обнимает тебя быстро, на бегу, и догоняет тачку у калитки. Ты смотришь, как они вдвоём поднимаются на насыпь. Возвращается она в сумерках одна, с красным фонарём, и сразу уходит к себе.', effects: [{ set: '$.c16_bn2', value: 'go' }, { set: 'w.c16_nina_went', value: true }, nina(2)] },
      { id: 'c16_bn2_no', label: 'Не отпускать: скоро стемнеет', when: ninaHere, minutes: 5, terminal: true, goto: 'c16_b_bread',
        text: 'Нина смотрит на тебя, потом на окно. Снимает куртку и вешает на крючок, очень аккуратно.\n\n— Ладно, — говорит она. — Ты тоже взрослая. Как все.', effects: [{ set: '$.c16_bn2', value: 'no' }, nina(-1)] },
      { id: 'c16_bn2_tomorrow', label: 'Пообещать сходить с ней завтра днём', when: ninaHere, minutes: 6, terminal: true, goto: 'c16_b_bread',
        text: '— Завтра, — повторяет Нина. — Днём. С тобой. — Она проверяет, не шутка ли. — Ладно. Только по-настоящему.', effects: [{ set: '$.c16_bn2', value: 'tomorrow' }, { set: '$.c16_nina_promised', value: true }, nina(1)] },
      { id: 'c16_bn2_come', label: 'Сказать: мы её заберём', when: ninaAway, minutes: 6, terminal: true, goto: 'c16_b_bread',
        text: 'Мама Лены выдыхает в трубку.\n\n— Danke. Ich sag\'s ihr.\n\nСпасибо. Я ей скажу.\n\nТы кладёшь трубку и только потом думаешь про бензин.', effects: [{ set: '$.c16_bn2', value: 'come' }, { set: 'w.c16_lena_promise', value: true }, { charge: 'phone', delta: -1 }] },
      { id: 'c16_bn2_wait', label: 'Попросить подержать Нину у себя до четверга', when: ninaAway, minutes: 6, terminal: true, goto: 'c16_b_bread',
        text: '— Bis Donnerstag, — повторяет мама Лены. — Okay. Aber ihr sagt ihr es selbst.\n\nДо четверга. Ладно. Но говорите ей сами.\n\nПотом трубку берёт Нина. Молчит в неё и отключается.', effects: [{ set: '$.c16_bn2', value: 'wait' }, { charge: 'phone', delta: -1 }, nina(-1)] },
      { id: 'c16_bn2_nina', label: 'Попросить дать трубку Нине', when: ninaAway, minutes: 10, terminal: true, goto: 'c16_b_bread',
        text: 'Нина говорит тихо, будто прячется.\n\n— Я хочу его увидеть. Один раз. Пока его не… — Она не договаривает. — Ты же понимаешь.\n\nТы понимаешь. И говоришь, что вы решите вдвоём сегодня вечером.', effects: [{ set: '$.c16_bn2', value: 'nina' }, { charge: 'phone', delta: -2 }, nina(1)] },
    ] }),
];

