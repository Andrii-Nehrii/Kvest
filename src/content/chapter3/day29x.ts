import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { S29, day29, dutyB29, frost29, jest29, oleAlive29, place29, set29, until29, w29 } from './point29';

// Участок 29, обе линии в субботу и перед собранием. A — работа по новому порядку, ружьё (Оле) или шапка (Хенрике), колонка;
// B — смена в пункте (пневмония, обморожение) или дом, Хенрике; в воскресенье — у церкви: A с дружиной, B с матерями из Люнебурга.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S29({ ...scene, for: 'any', chapter: 'ch3' });
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: jest29, camp: scene.camp ?? { at: jest29, stock: 'c3_farm_stock', rest: false }, safe: false });
const gunHome: Cond = any({ has: 'c19_flinte' }, { stocked: 'c19_flinte', qty: 1, at: 'c3_farm_stock' });
const leaPoint = any(flag('w.c25_lea_point'), v('w.c24_lea', 'sander'), v('w.c22_lea_at', 'sander'));

export const day29Scenes: Scene[] = [
  // ───────────── A: суббота ─────────────
  X({ id: 'c29_a_sat', title: 'Суббота', camp: yard14, ambient: day29,
    text: [
      { when: place29('family'), text: 'Хенрике раздаёт работу за завтраком, как раньше. Тебе — дрова и хлев. Она не спрашивает, согласен ли ты. Ты свой.' },
      { when: place29('hands'), text: 'Во флигеле своя печка и свой порядок. Хенрике приходит в восемь и говорит, что нужно сделать за день. По-деловому, как с работником. Это проще, чем ты думал{m:|а}.' },
      { when: place29('guests'), text: 'Хенрике не раздаёт вам работу. Вы гости. Ты всё равно идёшь колоть дрова: сидеть без дела невыносимо.' },
      { text: 'Во дворе ещё темно. Хенрике выходит к сараю с фонарём, и луч выхватывает из темноты то грушу, то поленницу, то свежий холмик.' },
    ],
    actions: [
      { id: 'c29_as_barn', label: 'Вычистить хлев и перестелить солому', minutes: 150, activity: 'heavy', terminal: true, goto: 'c29_a_gun', ambientDuring: day29,
        text: 'Навоз, вилы, тачка. Солома из сарая. К полудню хлев чистый, руки не разгибаются. Хенрике заглядывает, смотрит и молча кивает.', effects: [set29('as', 'barn'), { body: 'fatigue', delta: 10 }, npc('henrike', 1), until29(28, 10, 0)] },
      { id: 'c29_as_wood', label: 'Пилить и колоть дрова на неделю вперёд', minutes: 150, activity: 'heavy', terminal: true, goto: 'c29_a_gun', ambientDuring: day29,
        text: 'Козлы, пила, колун. Березовые чурки звенят на морозе. К полудню поленница у стены выше окна. Мороз обещают сильнее.', effects: [set29('as', 'wood'), { body: 'fatigue', delta: 10 }, w29('wood_week', true), until29(28, 10, 0)] },
      { id: 'c29_as_ask', label: 'Спросить Хенрике, что нужнее всего', minutes: 30, terminal: true, goto: 'c29_a_gun',
        text: '— Wasser, — говорит Хенрике сразу. Вода. — Die Pumpe friert diese Nacht ein. Ich spüre es in den Knien.\n\nНасос этой ночью замёрзнет. Я чувствую коленями.\n\nТы носишь воду до обеда: бочка, вёдра, кастрюли. Всё, во что можно налить.', effects: [set29('as', 'ask'), w29('water_stored', true), { body: 'fatigue', delta: 6 }, until29(28, 10, 0)] },
    ] }),

  X({ id: 'c29_a_gun', title: 'Ружьё отца', camp: kitchen14,
    text: [
      { when: all(oleAlive29, gunHome), text: 'После обеда Оле зовёт тебя к печи. На коленях у него отцовская двустволка, разобранная, на тряпке.\n\n— Vater hat es mir mit zwölf gezeigt. Jetzt zeige ich es dir. Der linke Lauf klemmt. Das ist kein Fehler. Das ist ein Charakter.\n\nОтец показал мне в двенадцать. Теперь я покажу тебе. Левый ствол заедает. Это не поломка. Это характер.' },
      { when: all(oleAlive29, not(gunHome)), text: 'После обеда Оле зовёт тебя к печи.\n\n— Die Flinte ist weg, hat Mutter gesagt. Gut. Dann zeige ich dir was anderes. Fallen. Für Kaninchen. Vater hat davon gelebt, im Winter 79.\n\nРужья нет, мать сказала. Ладно. Тогда покажу другое. Силки. На кроликов. Отец этим жил зимой семьдесят девятого.' },
      { when: not(oleAlive29), text: 'После обеда Хенрике зовёт тебя в комнату Оле. Она держит в руках его вязаную шапку.\n\n— Nimm sie. Er hätte gewollt, dass jemand sie trägt, der draußen arbeitet. Nicht dass sie im Schrank liegt.\n\nВозьми. Он бы хотел, чтобы её носил кто-то, кто работает на улице. А не чтобы она лежала в шкафу.' },
      { text: 'Ружьё старое, с потёртым прикладом, отполированным чужими руками до блеска. Пахнет маслом и железом. На ложе вырезаны две буквы.' },
    ],
    actions: [
      { id: 'c29_ag_learn', label: 'Учиться внимательно', when: oleAlive29, minutes: 90, terminal: true, goto: 'c29_a_wreath',
        text: 'Ты слушаешь и повторяешь. Оле объясняет медленно, отдыхая между фразами. К третьему разу у тебя получается без подсказки. Он кивает.\n\n— Gut. Jetzt bist du ein Lüdemann. Fast.\n\nХорошо. Теперь ты Людеман. Почти.', effects: [set29('ag', 'learn'), w29('ole_taught', true), npc('ole', 2), until29(28, 14, 0)] },
      { id: 'c29_ag_talk', label: 'Слушать и спрашивать про отца', when: oleAlive29, minutes: 90, terminal: true, goto: 'c29_a_wreath',
        text: 'Оле рассказывает про Вернера. Как он стрелял лис, которые таскали кур. Как держал хутор в семьдесят девятом, когда снег лёг на шесть недель. Как плакал, когда продал последнюю корову. Хенрике у плиты слушает и не перебивает.', effects: [set29('ag', 'talk'), npc('ole', 2), npc('henrike', 1), until29(28, 14, 0)] },
      { id: 'c29_ag_cap', label: 'Взять шапку и надеть', when: not(oleAlive29), minutes: 30, terminal: true, goto: 'c29_a_wreath',
        text: 'Шапка чуть мала и пахнет чужими волосами. Хенрике смотрит на тебя в ней и отворачивается к окну. Плечи у неё вздрагивают один раз.', effects: [set29('ag', 'cap'), { give: 'c29_ole_cap' }, w29('ole_cap', true), npc('henrike', 2), until29(28, 13, 0)] },
      { id: 'c29_ag_no', label: 'Сказать: оставьте её себе', when: not(oleAlive29), minutes: 20, terminal: true, goto: 'c29_a_wreath',
        text: 'Хенрике кивает и кладёт шапку обратно, на подушку Оле.\n\n— Vielleicht hast du recht. Noch nicht.\n\nМожет, ты и прав{m:|а}. Ещё рано.', effects: [set29('ag', 'no'), until29(28, 12, 50)] },
    ] }),

  X({ id: 'c29_a_pump', title: 'Колонка', camp: yard14, ambient: frost29,
    text: [
      { text: 'К вечеру мороз крепчает. Ручка колонки ходит туго, со скрипом. Потом перестаёт ходить совсем.' },
      { text: 'Рычаг колонки обледенел и не идёт. Под носиком висит сосулька толщиной в палец.' },
    ],
    actions: [
      { id: 'c29_ap_wrap', label: 'Укутать колонку соломой и мешковиной', minutes: 40, terminal: true, goto: 'c29_a_kerem',
        text: 'Солома, мешки, бечёвка. Колонка становится похожа на пугало. Хенрике выходит посмотреть и говорит: «Zu spät. Aber gut gemeint». Поздно. Но с добрыми намерениями.', effects: [set29('ap', 'wrap'), until29(28, 18, 0)] },
      { id: 'c29_ap_fire', label: 'Развести у колонки костёр и отогреть', minutes: 60, activity: 'moderate', terminal: true, goto: 'c29_a_kerem',
        outcomes: [
          { id: 'ok', check: { traits: ['technical'], difficulty: 3, uses: ['focus'] }, text: 'Костёр, ведро горячей воды, тряпка на трубу. Через час ручка поддаётся. Вода идёт, ржавая, потом чистая. Ты сливаешь её из трубы до последней капли, чтобы ночью не замёрзло снова.', effects: [set29('ap', 'fire'), w29('pump_saved', true)] },
          { id: 'no', text: 'Костёр греет снаружи, лёд внутри не берёт. Через час ты сдаёшься. До весны или до оттепели — колодец и снег.', effects: [set29('ap', 'fire')] },
        ], effects: [until29(28, 18, 0)] },
      { id: 'c29_ap_leave', label: 'Оставить до оттепели', minutes: 10, terminal: true, goto: 'c29_a_kerem',
        text: 'Колодец есть. Снега полно. Перезимуете.', effects: [set29('ap', 'leave'), until29(28, 17, 30)] },
    ] }),

  // ───────────── B: суббота ─────────────
  X({ id: 'c29_b_sat', title: 'Суббота', camp: kitchen14,
    text: [
      { when: dutyB29, text: 'В семь — пункт у Зандер. Суббота, но болезни выходных не знают.' },
      { when: not(dutyB29), text: 'Суббота на хуторе. Хенрике раздаёт работу. Тебе — кухня и Нина.' },
      { text: 'На кухне ещё темно, только печь светится в щель заслонки. Хенрике ставит чайник молча, чтобы не разбудить остальных.' },
    ],
    actions: [
      { id: 'c29_bs_go', label: 'Идти в пункт', when: dutyB29, minutes: 60, terminal: true, goto: 'c29_b_point', ambientDuring: day29,
        text: 'Четыре километра по скрипучему снегу. Мороз щиплет щёки. Ты приходишь к семи, и Зандер уже ждёт с халатом в руках.', effects: [set29('bs', 'go'), { move: jest29 }, until29(28, 7, 50)] },
      { id: 'c29_bs_kitchen', label: 'Взяться за кухню', when: not(dutyB29), minutes: 150, activity: 'light', terminal: true, goto: 'c29_b_cellar',
        text: 'Хенрике учит тебя печь хлеб из того, что есть: ржаная мука Кёлер, вода, соль, закваска из банки на подоконнике. Тесто липнет к рукам. Хенрике смеётся. Первый раз с тех пор, как вернулась.', effects: [set29('bs', 'kitchen'), w29('bread_learned', true), npc('henrike', 2), until29(28, 10, 0)] },
      { id: 'c29_bs_nina', label: 'Сесть с Ниной за уроки', when: not(dutyB29), minutes: 120, terminal: true, goto: 'c29_b_cellar',
        text: 'Нина решает задачи на проценты. Потом пишет сочинение на немецком: «Mein Winter». Мою зиму. Ты читаешь через плечо. Там про кур, про Тима, про хомяка. Она закрывает тетрадь рукой.', effects: [set29('bs', 'nina'), npc('c7_nina', 2), until29(28, 9, 30)] },
    ] }),

  J({ id: 'c29_b_point', title: 'Первая зимняя', ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'В пункте двое новых. Старик из Ханштедта: кашляет, хрипит, горячий. Пневмония. И мальчик лет двенадцати с белыми, как воск, пальцами ног: шёл два дня в кедах.' },
      { when: leaPoint, text: 'Лея уже моет мальчику ноги в тазу с тёплой водой. Не горячей. Говорит ему по-немецки, ровно, про собак, которые отморозили лапы и потом бегали.' },
      { text: 'В пункте холодно: печь растопили только к восьми. Зандер в пальто поверх халата, и пар изо рта у неё, когда она говорит.' },
      { when: v('$.c29_bs', 'go'), text: 'До пункта ты {m:дошёл|дошла} затемно, по следам саней. Зандер кивнула тебе с порога, не здороваясь: некогда.' },
    ],
    actions: [
      { id: 'c29_bp_boy', label: 'Помогать с мальчиком', minutes: 180, terminal: true, goto: 'c29_b_ask',
        text: 'Тёплая вода, полотенце, снова вода. Кожа розовеет медленно. Два пальца остаются белыми. Зандер смотрит и качает головой: может, не спасти. Мальчик не плачет. Он держит тебя за руку и рассказывает, как шёл.', effects: [set29('bp', 'boy'), { body: 'fatigue', delta: 6 }, until29(28, 11, 0)] },
      { id: 'c29_bp_old', label: 'Сидеть со стариком', minutes: 180, terminal: true, goto: 'c29_b_ask',
        text: 'Старика зовут Эрих. Он был машинистом. Он рассказывает про паровозы, задыхаясь, и ты подаёшь ему воду. Зандер говорит тебе тихо: антибиотиков нет. Ты продолжаешь подавать воду.', effects: [set29('bp', 'old'), { body: 'stress', delta: 2 }, until29(28, 11, 0)] },
    ] }),

  X({ id: 'c29_b_henrike', title: 'Хенрике', camp: kitchen14,
    text: [
      { text: 'После обеда Хенрике садится напротив тебя за кухонный стол. Без дела. Это на неё не похоже.' },
      { text: '— Erzähl mir von dem Mädchen. Von Nina. Was sie gemacht hat, als ich weg war. Alles.\n\nРасскажи мне про девочку. Про Нину. Что она делала, пока меня не было. Всё.' },
      { text: 'Хенрике сидит у окна с Нининой тетрадью по немецкому и проверяет диктант красным карандашом. Ошибок мало. Она всё равно хмурится.' },
    ],
    actions: [
      { id: 'c29_bh_all', label: 'Рассказать всё', minutes: 90, terminal: true, goto: 'c29_b_eve',
        text: 'Ты рассказываешь. Про отца в сарае. Про кепку. Про тетрадь, куда она записывала яйца. Про то, как она водила машину. Про ночь с Тимом, когда она не плакала. Хенрике слушает и смотрит в окно, где Нина кормит кур.\n\n— Die ist mehr Lüdemann als Ole war.\n\nОна больше Людеман, чем был Оле.', effects: [set29('bh', 'all'), npc('henrike', 2), until29(28, 16, 0)] },
      { id: 'c29_bh_ask', label: 'Спросить, оставит ли она Нину', minutes: 60, terminal: true, goto: 'c29_b_eve',
        text: '— Lassen? — Хенрике смотрит на тебя, будто ты {m:сказал|сказала} глупость. — Das Kind gehört zum Hof. Das hat Werner entschieden, als er Jens die Wohnung über der Garage gegeben hat. Vor zehn Jahren.\n\nОставить? Ребёнок принадлежит хутору. Это решил Вернер, когда отдал Йенсу квартиру над гаражом. Десять лет назад.', effects: [set29('bh', 'ask'), w29('nina_stays', true), until29(28, 15, 30)] },
    ] }),

  X({ id: 'c29_b_eve', title: 'Вечер субботы', camp: kitchen14,
    text: [
      { text: 'К вечеру мороз. Окна затягивает узорами. Хенрике достаёт с чердака коробку с адвентским венком: еловые ветки, четыре свечи, красная лента. Нина плетёт его на кухонном столе.' },
      { text: 'Нина разложила на столе лапник, проволоку и четыре свечи, красные, кривые, отлитые из огарков. Пахнет хвоей так, что кружится голова.' },
    ],
    actions: [
      { id: 'c29_be_help', label: 'Помочь Нине с венком', minutes: 60, terminal: true, goto: 'c29_night',
        text: 'Ветки колются. Лента путается. Нина ругается по-русски, тихо, чтобы Хенрике не поняла. Хенрике всё равно понимает и смеётся.', effects: [set29('be', 'help'), npc('c7_nina', 1), until29(28, 18, 0)] },
      { id: 'c29_be_rest', label: 'Отдохнуть у печи', minutes: 60, terminal: true, goto: 'c29_night',
        text: 'Ты сидишь у печи и смотришь, как Нина плетёт. Впервые за неделю ничего не болит, кроме ног.', effects: [set29('be', 'rest'), { body: 'fatigue', delta: -4 }, until29(28, 18, 0)] },
    ] }),

  // ───────────── Воскресенье у церкви ─────────────
  J({ id: 'c29_a_church', title: 'У церкви', ambient: day29,
    text: [
      { text: 'У церкви толпа. Дружинники Брандта в куртках поверх пиджаков. Солдаты Тобиаса у ворот. Уве кивает тебе издалека.' },
      { text: 'Тобиас подходит сам.\n\n— Du warst in der Kolonie. Am Mittwoch. Wenn du heute was sagst, hören sie zu. Dich haben sie gesehen.\n\nТы {m:был|была} в колонии. В среду. Если ты сегодня что-то скажешь, тебя послушают. Тебя видели.' },
      { text: 'У церкви людей больше, чем ты думал{m:|а}. Многих ты не знаешь: пришли из соседних деревень.' },
    ],
    actions: [
      { id: 'c29_ac_speak', label: 'Решить: скажу про колонию и про впадину', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Тобиас кивает и уходит внутрь. Ты стоишь ещё минуту на морозе, подбирая немецкие слова.', effects: [set29('ac', 'speak'), w29('a_spoke', true), until29(29, 10, 0)] },
      { id: 'c29_ac_listen', label: 'Решить: буду слушать', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: '— Auch gut, — говорит Тобиас. Тоже хорошо. — Zuhören ist selten geworden.\n\nСлушать — редкость теперь.', effects: [set29('ac', 'listen'), until29(29, 10, 0)] },
    ] }),

  J({ id: 'c29_b_church', title: 'Матери', ambient: day29,
    text: [
      { text: 'У ограды стоят женщины, которых ты не знаешь. Пришли пешком из Люнебурга, по снегу, с детьми на руках и на санках. Матери из детской палаты.' },
      { text: 'Одна узнаёт тебя. Ханна, из кузова, с мальчиком. Мальчик держится за её юбку и кашляет.\n\n— Die Ärztin hat es uns am Mittwoch gesagt. Wir sind gegangen. Alle, die noch gehen konnten.\n\nВрач сказала нам в среду. Мы ушли. Все, кто ещё мог идти.' },
      { text: 'У церкви толпятся люди, стоят кучками, по дворам. Матери держат детей за руки крепче обычного. Колокол молчит.' },
    ],
    actions: [
      { id: 'c29_bc_speak', label: 'Сказать Ханне: я встану рядом, если вы будете говорить', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Ханна кивает. Она говорила с ними всю дорогу. Говорить будет она. Ты будешь стоять рядом.', effects: [set29('bc', 'speak'), w29('b_stood', true), until29(29, 10, 0)] },
      { id: 'c29_bc_boy', label: 'Осмотреть мальчика', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Лоб прохладный. Горло красное. Кашель от холода. Ты говоришь Ханне: «Erkältet». Простыл. Она выдыхает так, будто держала воздух с Люнебурга.', effects: [set29('bc', 'boy'), until29(29, 10, 0)] },
    ] }),
];
