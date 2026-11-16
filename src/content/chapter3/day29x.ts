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
      { text: 'Во дворе ещё темно. Хенрике выходит к сараю с фонарём, и луч выхватывает из темноты то грушу, то поленницу.' },
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
      { when: all(oleAlive29, gunHome), text: 'Ружьё старое, с потёртым прикладом, отполированным чужими руками до блеска. Пахнет маслом и железом. На ложе вырезаны две буквы.' },
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
      { id: 'c29_ag2_nina', label: 'Спросить, можно ли научить и Нину', when: oleAlive29, minutes: 60, terminal: true, goto: 'c29_a_wreath',
        text: 'Оле долго молчит. Потом зовёт Нину сам. Показывает ей, как переламывать стволы, как проверять, что пусто, как держать к полу. Стрелять не даёт. «Erst im Frühling. Wenn du sechzehn bist». Весной. Когда будет шестнадцать. Нина кивает так серьёзно, что Оле отворачивается, чтобы не улыбнуться.', effects: [set29('ag2', 'nina'), w29('nina_gun_lesson', true), npc('c7_nina', 1), until29(28, 13, 30)] },
    ] }),

  X({ id: 'c29_a_pump', title: 'Колонка', camp: yard14, ambient: frost29,
    text: [
      { text: 'К вечеру мороз крепчает. Ручка колонки ходит туго, со скрипом. Потом перестаёт ходить совсем.' },
    ],
    actions: [
      { id: 'c29_ap_wrap', label: 'Укутать колонку соломой и мешковиной', minutes: 40, terminal: true, goto: 'c29_a_list',
        text: 'Солома, мешки, бечёвка. Колонка становится похожа на пугало. Хенрике выходит посмотреть и говорит: «Zu spät. Aber gut gemeint». Поздно. Но с добрыми намерениями.', effects: [set29('ap', 'wrap'), until29(28, 16, 30)] },
      { id: 'c29_ap_fire', label: 'Развести у колонки костёр и отогреть', minutes: 60, activity: 'moderate', terminal: true, goto: 'c29_a_list',
        outcomes: [
          { id: 'ok', check: { traits: ['technical'], difficulty: 3, uses: ['focus'] }, text: 'Костёр, ведро горячей воды, тряпка на трубу. Через час ручка поддаётся. Вода идёт, ржавая, потом чистая. Ты сливаешь её из трубы до последней капли, чтобы ночью не замёрзло снова.', effects: [set29('ap', 'fire'), w29('pump_saved', true)] },
          { id: 'no', text: 'Костёр греет снаружи, лёд внутри не берёт. Через час ты сдаёшься. До весны или до оттепели — колодец и снег.', effects: [set29('ap', 'fire')] },
        ], effects: [until29(28, 16, 30)] },
      { id: 'c29_ap_leave', label: 'Оставить до оттепели', minutes: 10, terminal: true, goto: 'c29_a_list',
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
      { id: 'c29_bs2_ice', label: 'Идти напрямик, по льду Зееве: на полчаса короче', minutes: 60, risky: true, terminal: true, goto: 'c29_b_point', ambientDuring: frost29,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Лёд на Зееве серый и гулкий. Ты идёшь у самого берега, где мелко, и слушаешь каждый шаг. Под мостом лёд тёмный, ты обходишь его по корням ольхи. В пункт приходишь первой, раньше Зандер.', effects: [set29('bs2', 'ice')] },
          { id: 'wet', text: 'Под мостом лёд тёмный, и нога уходит в воду по щиколотку, потом по колено. Ты выбираешься на берег, хватаясь за корни. Ботинок полон ледяной воды. До пункта ещё километр, и ты бежишь, чтобы не замёрзнуть. Зандер молча ставит твои ботинки к печке и даёт свои шерстяные носки.', effects: [set29('bs2', 'wet'), { body: 'stress', delta: 4 }, { body: 'fatigue', delta: 6 }] },
        ], effects: [until29(28, 7, 50)] },
      { id: 'c29_bs2_nina', label: 'Взять Нину проводить до поворота: ей полезно пройтись', minutes: 60, terminal: true, goto: 'c29_b_point', ambientDuring: frost29,
        text: 'Нина идёт рядом и рассказывает про венок, который будет плести, про свечи, про то, что Хенрике обещала научить её печь штолен. У поворота она машет тебе варежкой и бежит назад по своим следам.', effects: [set29('bs2', 'nina'), npc('c7_nina', 1), until29(28, 7, 55)] },
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
      { id: 'c29_bp2_frost', label: 'Отогревать дружиннику обмороженные пальцы', minutes: 120, terminal: true, goto: 'c29_b_ask',
        text: 'Пальцы у парня белые, восковые. Зандер показывает: не растирать, в тёплую воду, не горячую, медленно. Он кричит, когда кровь возвращается, и ругается, и извиняется за ругань. К одиннадцати пальцы розовые. Два, может быть, придётся отнять. Может быть, нет.', effects: [set29('bp2', 'frost'), w29('b_frostbite_known', true), until29(28, 11, 0)] },
    ] }),

  X({ id: 'c29_b_henrike', title: 'Хенрике', camp: kitchen14,
    text: [
      { text: 'После обеда Хенрике садится напротив тебя за кухонный стол. Без дела. Это на неё не похоже.' },
      { text: '— Erzähl mir von dem Mädchen. Von Nina. Was sie gemacht hat, als ich weg war. Alles.\n\nРасскажи мне про девочку. Про Нину. Что она делала, пока меня не было. Всё.' },
    ],
    actions: [
      { id: 'c29_bh_all', label: 'Рассказать всё', minutes: 90, terminal: true, goto: 'c29_b_eve',
        text: 'Ты рассказываешь. Про отца в сарае. Про кепку. Про тетрадь, куда она записывала яйца. Про то, как она водила машину. Про ночь с Тимом, когда она не плакала. Хенрике слушает и смотрит в окно, где Нина кормит кур.\n\n— Die ist mehr Lüdemann als Ole war.\n\nОна больше Людеман, чем был Оле.', effects: [set29('bh', 'all'), npc('henrike', 2), until29(28, 16, 0)] },
      { id: 'c29_bh_ask', label: 'Спросить, оставит ли она Нину', minutes: 60, terminal: true, goto: 'c29_b_eve',
        text: '— Lassen? — Хенрике смотрит на тебя, будто ты {m:сказал|сказала} глупость. — Das Kind gehört zum Hof. Das hat Werner entschieden, als er Jens die Wohnung über der Garage gegeben hat. Vor zehn Jahren.\n\nОставить? Ребёнок принадлежит хутору. Это решил Вернер, когда отдал Йенсу квартиру над гаражом. Десять лет назад.', effects: [set29('bh', 'ask'), w29('nina_stays', true), until29(28, 15, 30)] },
      { id: 'c29_bh2_milk', label: 'Попросить её научить тебя доить', minutes: 60, terminal: true, goto: 'c29_b_eve',
        text: 'Хенрике смотрит на тебя, как на несерьёзную. Потом ведёт в хлев. Ставит скамеечку, ведро, показывает: не тянуть, а сжимать, сверху вниз. Корова косится. Через полчаса у тебя в ведре на донышке. «Für den Anfang». Для начала. Это похвала.', effects: [set29('bh2', 'milk'), npc('henrike', 2, 'c29_milk'), until29(28, 16, 0)] },
    ] }),

  X({ id: 'c29_b_eve', title: 'Вечер субботы', camp: kitchen14,
    text: [
      { text: 'К вечеру мороз. Окна затягивает узорами. Хенрике достаёт с чердака коробку с адвентским венком: еловые ветки, четыре свечи, красная лента. Нина плетёт его на кухонном столе.' },
    ],
    actions: [
      { id: 'c29_be_help', label: 'Помочь Нине с венком', minutes: 60, terminal: true, goto: 'c29_night',
        text: 'Ветки колются. Лента путается. Нина ругается по-русски, тихо, чтобы Хенрике не поняла. Хенрике всё равно понимает и смеётся.', effects: [set29('be', 'help'), npc('c7_nina', 1), until29(28, 18, 0)] },
      { id: 'c29_be_rest', label: 'Отдохнуть у печи', minutes: 60, terminal: true, goto: 'c29_night',
        text: 'Ты сидишь у печи и смотришь, как Нина плетёт. Впервые за неделю ничего не болит, кроме ног.', effects: [set29('be', 'rest'), { body: 'fatigue', delta: -4 }, until29(28, 18, 0)] },
      { id: 'c29_be3_flour', label: 'Сходить к Кёлер за мукой: Хенрике обещала Нине штолен', minutes: 60, terminal: true, goto: 'c29_night', ambientDuring: frost29,
        text: 'Кёлер отсыпает полкило муки и щепоть изюма из жестяной банки, последнего. «Für den Stollen. Advent ist Advent». На штолен. Адвент есть адвент. Обратно ты идёшь в темноте, и над деревней в двух окнах уже горят свечи.', effects: [set29('be3', 'flour'), w29('stollen', true), { stock: 'c3_flour', qty: 1, at: 'c3_farm_stock' }, npc('c3_koehler', 1), until29(28, 17, 30)] },
    ] }),

  // ───────────── Воскресенье у церкви ─────────────
  J({ id: 'c29_a_church', title: 'У церкви', ambient: day29,
    text: [
      { text: 'У церкви толпа. Дружинники Брандта в куртках поверх пиджаков. Солдаты Тобиаса у ворот. Уве кивает тебе издалека.' },
      { text: 'Тобиас подходит сам.\n\n— Du warst in der Kolonie. Am Mittwoch. Wenn du heute was sagst, hören sie zu. Dich haben sie gesehen.\n\nТы {m:был|была} в колонии. В среду. Если ты сегодня что-то скажешь, тебя послушают. Тебя видели.' },
    ],
    actions: [
      { id: 'c29_ac_speak', label: 'Решить: скажу про колонию и про впадину', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Тобиас кивает и уходит внутрь. Ты стоишь ещё минуту на морозе, подбирая немецкие слова.', effects: [set29('ac', 'speak'), w29('a_spoke', true), until29(29, 10, 0)] },
      { id: 'c29_ac_listen', label: 'Решить: буду слушать', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: '— Auch gut, — говорит Тобиас. Тоже хорошо. — Zuhören ist selten geworden.\n\nСлушать — редкость теперь.', effects: [set29('ac', 'listen'), until29(29, 10, 0)] },
      { id: 'c29_ac_hanna', label: 'Решить: встану рядом с той, кто первой скажет правду', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Ты не будешь говорить сам{m:|а}. Но если кто-то встанет, ты встанешь рядом. Так решаешь ты, стоя на паперти и глядя, как люди стряхивают снег с шапок.', effects: [set29('ac', 'stand'), until29(29, 10, 10)] },
    ] }),

  J({ id: 'c29_b_church', title: 'Матери', ambient: day29,
    text: [
      { text: 'У ограды стоят женщины, которых ты не знаешь. Пришли пешком из Люнебурга, по снегу, с детьми на руках и на санках. Матери из детской палаты.' },
      { text: 'Одна узнаёт тебя. Ханна, из кузова, с мальчиком. Мальчик держится за её юбку и кашляет.\n\n— Die Ärztin hat es uns am Mittwoch gesagt. Wir sind gegangen. Alle, die noch gehen konnten.\n\nВрач сказала нам в среду. Мы ушли. Все, кто ещё мог идти.' },
    ],
    actions: [
      { id: 'c29_bc_speak', label: 'Сказать Ханне: я встану рядом, если вы будете говорить', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Ханна кивает. Она говорила с ними всю дорогу. Говорить будет она. Ты будешь стоять рядом.', effects: [set29('bc', 'speak'), w29('b_stood', true), until29(29, 10, 0)] },
      { id: 'c29_bc_boy', label: 'Осмотреть мальчика', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Лоб прохладный. Горло красное. Кашель от холода. Ты говоришь Ханне: «Erkältet». Простыл. Она выдыхает так, будто держала воздух с Люнебурга.', effects: [set29('bc', 'boy'), until29(29, 10, 0)] },
      { id: 'c29_bc_door', label: 'Встать у двери и смотреть, кто как слушает', minutes: 10, terminal: true, goto: 'c29_assembly',
        text: 'Ты становишься у двери, за последней скамьёй. Отсюда видно всех: кто сидит прямо, кто опустил голову, кто держит ребёнка на коленях крепче, чем надо.', effects: [set29('bc', 'door'), until29(29, 10, 0)] },
    ] }),
  S29({ id: 'c29_a_list', for: 'any', chapter: 'ch3', title: 'Список Тобиаса', camp: yard14, ambient: frost29,
    text: [
      { text: 'В половине пятого у ворот останавливается «Вольф». Тобиас не выходит. Опускает стекло и протягивает в окно планшет с листом. Сверху от руки: «Räumung Garlstorf. Freiwillige». Расчистка Гарльсторфа. Добровольцы.' },
      { text: '— Noch nichts Festes. Nur wer überhaupt kommen würde. Morgen in der Kirche sage ich mehr.\n\nПока ничего твёрдого. Только кто вообще пришёл бы. Завтра в церкви скажу больше.' },
      { text: 'На листе семь фамилий. Кёлер-младший. Двое из дружины. Яннес.' },
    ],
    actions: [
      { id: 'c29_al4_sign', label: 'Вписать себя', minutes: 15, terminal: true, goto: 'c29_a_kerem',
        text: 'Ты пишешь свою фамилию восьмой, печатными буквами. Тобиас смотрит на неё и кивает. «Dann weiß ich, mit wem ich rechne». Тогда я знаю, на кого рассчитывать. Ты ещё ничего не решил{m:|а}. Но имя на листе уже есть.', effects: [set29('al4', 'sign'), w29('a_signed', true), npc('c15_tobias', 1), until29(28, 17, 0)] },
      { id: 'c29_al4_ask', label: 'Спросить, что нужно будет делать и что дадут', minutes: 20, terminal: true, goto: 'c29_a_kerem',
        text: '— Feuer machen. Kette halten. Nicht allein aufs Eis. — Тобиас считает на пальцах. — Und wer kommt, kriegt Diesel aus dem dritten Lastwagen. Brandt hat es versprochen. Ich nicht.\n\nРазводить огонь. Держать цепь. Не ходить одному на лёд. Кто придёт, получит солярку из третьего грузовика. Брандт обещал. Не я.', effects: [set29('al4', 'ask'), w29('sweep_details', true), until29(28, 17, 0)] },
      { id: 'c29_al4_wait', label: 'Сказать: сначала поговорю дома', minutes: 10, terminal: true, goto: 'c29_a_kerem',
        text: 'Тобиас кивает, будто другого и не ждал. «Richtig. Zu zweit». Правильно. Вдвоём. Стекло поднимается. «Вольф» уходит к соседнему двору.', effects: [set29('al4', 'wait'), until29(28, 16, 50)] },
    ] }),
];
