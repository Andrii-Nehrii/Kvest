import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import {
  B19, S19, colonyGone, colonyStands, barnChained, byGirl, cold19, day19, evaHere, girlHere, henrikeHome, npc, own19, set19, textByGirl, until, uteHere, w19, wernerAlive,
} from './point19';

// Участок 19, линия B: четверг в Йестебурге с Кёлер. Пайки по списку, пункт, Матс, Брандт, записки, дорога обратно.
const village = 'c16_jesteburg';
const sammel = 'c13_sammel';
const lane = 'c7_farm_lane';
const indoorV = { tempC: 12, outdoor: false, wet: false };
const fed: Effect[] = [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -35 }];
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S19({ ...scene, for: 'any', chapter: 'ch3', safe: scene.safe ?? false,
  actions: scene.actions.map(a => ({ ...a, when: all(B19, a.when ?? { always: true }) })) });
/** B есть в списке на пайки: «все» или «двое»; при «хозяева» её нет. */
const listedB: Cond = any(v('w.c18_list', 'all'), v('w.c18_list', 'two'));
const ration: Effect[] = [{ give: 'bread' }, { give: 'canned_beans' }];
const lockerMiss = 'Колёсики щёлкают. Ты тянешь дужку. Она не поддаётся.';
const companion: Cond = any(own19('bk', 'nina'), own19('bk', 'girl'));
const toQueue = [{ id: 'road', when: own19('bk', 'road'), goto: 'c19_b_road' }, { id: 'field', goto: 'c19_b_field' }];
const afterBrandt = [{ id: 'hanna', when: v('w.c18_seat', 'hanna'), goto: 'c19_b_hanna' }, { id: 'board', goto: 'c19_b_board' }];

export const day19BScenes: Scene[] = [
  B({ id: 'c19_b_morning', title: 'До девяти', camp: house14, safe: true,
    text: [
      { text: 'До прихода Кёлер час с небольшим. В доме все чем-то заняты, и тебе тоже хочется быть занятой.' },
      ...textByGirl({ text: '{g}а моет посуду, хотя её никто не просил. Тарелки она ставит слишком громко.' }),
    ],
    actions: [
      { id: 'c19_bm_stock', label: 'Пересчитать запас и записать, чего не хватает', minutes: 40, terminal: true, goto: 'c19_b_koehler',
        text: 'Ты спускаешься в подвал с тетрадью Хенрике. Картошка, вода в канистрах, полмешка муки. Мыла нет совсем. Спичек две коробки. Соли на неделю. Ты вырываешь листок и кладёшь в карман: вдруг в Йестебурге что-то будет.', effects: [set19('bm', 'stock'), w19('needs_list', true), until(19, 9, 0)] },
      ...byGirl({ id: 'c19_bm_girl', label: 'Поговорить с {g}ой за посудой', when: girlHere, minutes: 40, terminal: true, goto: 'c19_b_koehler',
        text: 'Ты вытираешь, она моет. Через десять минут она рассказывает про ферму дяди под Целле, где доила коров каждое лето. Через двадцать — что у неё никого не осталось. Тарелки она больше не швыряет.', effects: [set19('bm', 'girl'), { if: evaHere, then: [npc('c8_eva', 2)] }, until(19, 9, 0)] }),
      { id: 'c19_bm_henrike', label: 'Спросить Хенрике, что взять в Йестебурге', when: henrikeHome, minutes: 30, terminal: true, goto: 'c19_b_koehler',
        text: 'Хенрике думает, загибая пальцы.\n\n— Seife. Streichhölzer. Und frag im Punkt, ob der Junge Post hat.\n\nМыло. Спички. И спроси в пункте, нет ли писем от мальчика.', effects: [set19('bm', 'henrike'), npc('henrike', 1), until(19, 9, 0)] },
      { id: 'c19_bm_rest', label: 'Посидеть с кружкой у окна', minutes: 30, activity: 'rest', terminal: true, goto: 'c19_b_koehler',
        text: 'Ты сидишь у окна и смотришь, как светлеет поле. После казармы тишина кажется громкой.', effects: [set19('bm', 'rest'), { body: 'stress', delta: -1 }, until(19, 9, 0)] },
    ] }),

  B({ id: 'c19_b_koehler', title: 'Кёлер', camp: yard14, ambient: day19, safe: true,
    text: [
      { text: 'Ровно в девять у калитки фрау Кёлер. Пустая корзина, платок, пальто, застёгнутое до горла.' },
      { when: wernerAlive, text: '— Werner hat mich heute angesehen, — говорит она вместо приветствия. — Glaube ich.\n\nВернер сегодня на меня посмотрел. Мне кажется.' },
      { when: not(wernerAlive), text: 'Платок у неё чёрный. Про брата она не говорит, и ты не спрашиваешь.' },
      { text: '— Zur Feuerwehr. Rationen. Gehst du mit? — Пойдёшь со мной за пайком?' },
    ],
    actions: [
      { id: 'c19_bk_road', label: 'Пойти по дороге, в обход', minutes: 55, move: true, terminal: true, goto: 'c19_b_road',
        text: 'Дорога длиннее, зато по ней ездят. Кёлер идёт быстро, мелкими шагами, и корзина у неё не качается.', effects: [set19('bk', 'road'), until(19, 9, 55)] },
      { id: 'c19_bk_field', label: 'Пойти напрямик вдоль насыпи', minutes: 40, move: true, terminal: true, goto: 'c19_b_field',
        text: 'Через поле вдвое короче. Кёлер сворачивает туда сама, будто так и собиралась.', effects: [set19('bk', 'field'), until(19, 9, 40)] },
      { id: 'c19_bk_nina', label: 'Взять с собой Нину', when: ninaFarm, minutes: 55, move: true, terminal: true, outcomes: toQueue,
        text: 'Нина собирается за минуту. По дороге она держится рядом с Кёлер и спрашивает её про хлеб: сколько муки, сколько воды, почему ржаной.', effects: [set19('bk', 'nina'), npc('c7_nina', 1), until(19, 9, 55)] },
      ...byGirl({ id: 'c19_bk_girl', label: 'Взять с собой {g}у: ей нужен паёк', when: girlHere, minutes: 55, move: true, terminal: true, outcomes: toQueue,
        text: '{g}а надевает свой рюкзак, хотя он пустой. Без него она, кажется, не умеет выходить из дома.', effects: [set19('bk', 'girl'), until(19, 9, 55)] }),
    ] }),

  B({ id: 'c19_b_road', title: 'Остановка', location: lane, ambient: day19,
    text: [
      { text: 'У автобусной остановки на въезде в Йестебург стекло всё в записках. Бумага разная: тетрадные листы, обёртки, картон. «Ищу маму. Lena, 7 Jahre». «Kai, wir sind in Celle». «Wer hat Herrn Wiese gesehen?»' },
      { text: 'Внизу, в углу, листок с печатью Красного Креста: «Thomas Brockmann (Toronto) sucht Ilse und Gerd Brockmann, Buchholz i.d.N. Bitte Nachricht an DRK-Suchdienst».' },
      { when: flag('w.c18_ilse_listed'), text: 'Брокман, Ильзе. Это имя ты {m:переписывал|переписывала} на ладонь со стены в Люнебурге.' },
    ],
    actions: [
      { id: 'c19_br_answer', label: 'Написать на обороте, что знаешь про Ильзе', when: flag('w.c18_ilse_listed'), minutes: 15, terminal: true, goto: 'c19_b_bridge',
        text: 'Ты пишешь коротко, карандашом Кёлер: «Ilse Brockmann — Liste Klinikum Buchholz, Station 4, gesehen in Lüneburg, 18.11.» Кёлер читает через плечо и ничего не говорит. Ты прикалываешь листок обратно.', effects: [set19('br', 'answer'), w19('brockmann_answer', true), until(19, 10, 10)] },
      { id: 'c19_br_take', label: 'Снять листок и унести {A.dat}', minutes: 10, terminal: true, goto: 'c19_b_bridge',
        text: 'Ты аккуратно отгибаешь кнопку. Брокман — фамилия соседей {A.gen} по подъезду. Он должен это увидеть.', effects: [set19('br', 'take'), w19('brockmann_note', true), until(19, 10, 5)] },
      { id: 'c19_br_own', label: 'Оставить свою записку: для тех, кто из Бармбека', minutes: 15, terminal: true, goto: 'c19_b_bridge',
        text: 'Ты пишешь своё имя, улицу в Бармбеке и как найти хутор: Йестебург, поворот у почтового ящика Людеманов. Если кто-то из дома дойдёт сюда, он прочитает.', effects: [set19('br', 'own'), w19('barmbek_note', true), until(19, 10, 10)] },
      { id: 'c19_br_go', label: 'Не останавливаться', minutes: 5, terminal: true, goto: 'c19_b_bridge',
        text: 'Кёлер уже ушла вперёд. Ты догоняешь её у поворота.', effects: [set19('br', 'go'), until(19, 10, 0)] },
    ] }),

  B({ id: 'c19_b_field', title: 'Вдоль насыпи', location: 'c10_field', ambient: day19,
    text: [
      { when: colonyStands, text: 'Тропа идёт мимо садовой колонии. На калитке теперь армейская лента и табличка от руки: «Unter Aufsicht der Feuerwehr Jesteburg». Под надзором пожарной части. Внутри кто-то поёт.' },
      { when: barnChained, text: 'Колония стоит пустая. Двери домиков открыты, ветер хлопает одной из них. На двенадцатом кто-то нарисовал мелом крест.' },
      { when: colonyGone, text: 'За теплицей колонии холмики в ряд. На каждом бирка от ключа на проволоке. Кёлер замедляет шаг.' },
    ],
    actions: [
      { id: 'c19_bf_stop', label: 'Остановиться с Кёлер у калитки', minutes: 20, terminal: true, goto: 'c19_b_bridge',
        text: 'Кёлер стоит, держась за штакетник. Потом крестится, неловко, будто давно не делала этого. Дальше она идёт молча, но ближе к тебе.', effects: [set19('bf', 'stop'), npc('c3_koehler', 2), until(19, 10, 5)] },
      { id: 'c19_bf_on', label: 'Идти дальше, не глядя', minutes: 10, terminal: true, goto: 'c19_b_bridge',
        text: 'Ты смотришь под ноги. Тропа мёрзлая, в колеях лёд. Кёлер догоняет тебя только у первых домов.', effects: [set19('bf', 'on'), until(19, 9, 55)] },
    ] }),

  B({ id: 'c19_b_queue', title: 'Пайки', location: village, ambient: day19,
    text: [
      { text: 'Очередь у пожарной части тянется до церкви. Впереди стол, двое солдат, ящики. Один солдат держит планшет со списками, второй выдаёт: полбуханки, банка фасоли на человека.' },
      { text: '— Nur persönlich, — повторяет солдат каждому. — Nur wer auf der Liste steht.\n\nТолько лично. Только кто в списке.' },
      { when: all(listedB, v('w.c18_list', 'two')), text: 'Ты в списке. Вас там двое.' },
      { when: all(listedB, v('w.c18_list', 'all')), text: 'Ты в списке, и весь ваш дом тоже. Только пришла ты одна.' },
      { when: not(listedB), text: 'Солдат ищет твою фамилию долго. Потом поднимает глаза.\n\n— Lüdemann-Hof. Hier stehen nur Lüdemann, Henrike und Lüdemann, Ole. Sie sind Gast.\n\nХутор Людеманов. Тут только Хенрике и Оле Людеман. Вы — гость.' },
      { text: 'Перед тобой женщина с тремя детьми. Младший спит у неё на руках.' },
    ],
    actions: [
      { id: 'c19_bq_take', label: 'Взять свой паёк', when: listedB, minutes: 60, terminal: true, goto: 'c19_b_crush',
        text: 'Полбуханки, банка фасоли, штамп в списке. Ты убираешь всё в сумку Кёлер.', effects: [set19('bq', 'take'), ...ration, until(19, 11, 0)] },
      { id: 'c19_bq_more', label: 'Попросить паёк и на тех, кто остался дома', when: listedB, minutes: 70, risky: true, terminal: true, goto: 'c19_b_crush',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3 }, text: 'Ты говоришь спокойно: дома лежачий, дома ребёнок, идти им сорок минут по полю. Солдат смотрит на очередь, на тебя, вздыхает и даёт ещё одну банку и полбуханки.\n\n— Einmal. Nächstes Mal persönlich.\n\nОдин раз. В следующий раз лично.', effects: [set19('bq', 'more'), ...ration, ...ration] },
          { id: 'no', text: '— Nein, — говорит солдат. — Dann kommt jeder mit Geschichten.\n\nНет. Тогда каждый придёт с историями.\n\nТы берёшь свой паёк и отходишь.', effects: [set19('bq', 'more_no'), ...ration] },
        ], effects: [until(19, 11, 10)] },
      { id: 'c19_bq_give', label: 'Отдать свой паёк женщине с детьми', when: listedB, minutes: 60, terminal: true, goto: 'c19_b_crush',
        text: 'Ты получаешь свои полбуханки и банку и сразу кладёшь их в её сумку. Она смотрит на тебя, как на сумасшедшую, потом быстро кивает. Кёлер видела. Всю дорогу до пункта она держит тебя под руку.', effects: [set19('bq', 'give'), npc('c3_koehler', 2), until(19, 11, 0)] },
      { id: 'c19_bq_argue', label: 'Сказать: я там живу и работаю, впишите', when: not(listedB), minutes: 60, risky: true, terminal: true, goto: 'c19_b_crush',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3 }, text: 'Солдат молчит, потом вписывает твою фамилию от руки в конец страницы. Отдельно, мелко.\n\n— Bis Montag. Dann entscheidet Brandt.\n\nДо понедельника. Дальше решает Брандт.', effects: [set19('bq', 'argue'), w19('b_listed', true), ...ration] },
          { id: 'no', text: '— Gast ist Gast, — говорит солдат. Гость есть гость. — Der Nächste.\n\nСледующий.', effects: [set19('bq', 'argue_no')] },
        ], effects: [until(19, 11, 0)] },
      { id: 'c19_bq_koehler', label: 'Попросить Кёлер сказать за тебя', when: all(not(listedB), { npc: 'c3_koehler', alive: true, trust: ['>=', 4] }), minutes: 60, terminal: true, goto: 'c19_b_crush',
        text: '— Die gehört zu mir, — говорит Кёлер солдату. Она со мной. — Ich backe für euch Brot seit Montag.\n\nЯ пеку вам хлеб с понедельника.\n\nСолдат вписывает тебя от руки, не споря.', effects: [set19('bq', 'koehler'), w19('b_listed', true), npc('c3_koehler', 1), ...ration, until(19, 11, 0)] },
      { id: 'c19_bq_leave', label: 'Уйти без пайка', when: not(listedB), minutes: 50, terminal: true, goto: 'c19_b_crush',
        text: 'Ты отходишь от стола. Кёлер молча перекладывает половину своего хлеба в твою сумку. Ты не успеваешь отказаться.', effects: [set19('bq', 'leave'), { give: 'bread' }, npc('c3_koehler', 1), until(19, 11, 0)] },
    ] }),

  B({ id: 'c19_b_aid', title: 'Пункт', location: sammel, ambient: indoorV,
    text: [
      { text: 'В спортзале школы пункт. Раскладушки вдоль шведской стенки, за ширмой — врач. Женщина с волосами, собранными в узел. Она кивает тебе, как знакомой: людей с хутора Людеманов здесь знают.' },
      { text: 'За второй ширмой на раскладушке мальчик лет четырнадцати. Над ним на стойке жёлтый пакет. Рядом вторая раскладушка, пустая, одеяло сложено углом.' },
      { text: '— Plasma aus Lüneburg, — говорит врач, заметив твой взгляд. — Kam Dienstag. Reicht bis Freitag. Dann kommt hoffentlich die Neue.\n\nПлазма из Люнебурга. Пришла во вторник. Хватит до пятницы. Потом, надеюсь, придёт новая.' },
    ],
    actions: [
      { id: 'c19_ba_help', label: 'Предложить помочь час: перевязки, кружки, бельё', minutes: 40, activity: 'light', terminal: true, goto: 'c19_b_stitch',
        text: 'Врач даёт тебе перчатки и таз. Ты моешь кружки, меняешь бинт старику с порезанной ладонью и держишь за руку женщину, пока ей зашивают бровь. Между делом врач записывает твоё имя в блокнот.\n\n— Wenn ihr was braucht, kommt zu mir. Nicht zum Soldaten.\n\nЕсли что-то понадобится, идите ко мне. Не к солдату.', effects: [set19('ba', 'help'), w19('doc_trust', true), until(19, 12, 10)] },
      { id: 'c19_ba_ask', label: 'Спросить, что делает плазма', minutes: 15, terminal: true, goto: 'c19_b_mats',
        text: 'Врач смотрит на мальчика за ширмой.\n\n— Sie hält. Das Fieber geht runter, sie reden wieder. — Пауза. — Wie lange sie hält, weiß niemand. Fragen Sie in Lüneburg, nicht mich.\n\nОна держит. Жар падает, они снова говорят. Сколько держит — не знает никто. Спрашивайте в Люнебурге, не меня.', effects: [set19('ba', 'ask'), w19('plasma_holds', true), until(19, 11, 30)] },
      { id: 'c19_ba_pen', label: 'Отдать ей коровий пенициллин из аптечки', when: { has: 'c17_vet_pen' }, minutes: 15, terminal: true, goto: 'c19_b_mats',
        text: 'Врач встряхивает флакон и смотрит на свет.\n\n— Für Wunden ist das Gold, — говорит она. Для ран это золото.\n\nОна записывает твоё имя в блокнот и подчёркивает дважды.\n\n— Was ihr braucht — kommt zu mir.\n\nЧто понадобится — приходите ко мне.', effects: [set19('ba', 'pen'), w19('doc_trust', true), { take: 'c17_vet_pen' }, until(19, 11, 30)] },
      { id: 'c19_ba_post', label: 'Спросить, нет ли писем от Оле', minutes: 10, terminal: true, goto: 'c19_b_mats',
        outcomes: [
          { id: 'letter', when: flag('w.c18_post'), text: 'Врач качает головой.\n\n— Die Post kommt jetzt mit dem Wäschewagen. Dienstag und Freitag. Morgen also.\n\nПочта теперь ездит с фургоном прачечной. По вторникам и пятницам. Значит, завтра.', effects: [set19('ba', 'post')] },
          { id: 'none', text: 'Врач перебирает конверты в коробке из-под обуви.\n\n— Lüdemann… Nein. Heute nichts.\n\nНет. Сегодня ничего.', effects: [set19('ba', 'post')] },
        ], effects: [until(19, 11, 20)] },
    ] }),

  B({ id: 'c19_b_mats', title: 'Мальчик в спортзале', location: sammel, ambient: indoorV,
    text: [
      { text: 'В другом конце зала мальчик лет одиннадцати гоняет мяч о шведскую стенку. Нога у него ещё в бинте, но бегает он почти не хромая. Женщина на скамейке следит за ним, не отрываясь.' },
      { when: flag('B.c17_bvm'), text: 'Матс, внук Брандта. Во вторник он лежал на раскладушке. Женщина — его мать. Она узнаёт тебя и машет рукой.' },
      { when: not(flag('B.c17_bvm')), text: 'Соседка по очереди говорит тебе на ухо: это Матс, внук Брандта. В воскресенье его укусили.' },
      { text: '— Plasma, — говорит мать, когда ты садишься рядом. — Am Montag. Seitdem fieberfrei. Papa sagt, das hat ihn gerettet.\n\nПлазма. В понедельник. С тех пор без жара. Папа говорит, это его и спасло.' },
    ],
    actions: [
      { id: 'c19_bmt_when', label: 'Спросить, был ли у него жар до плазмы', minutes: 15, terminal: true, goto: 'c19_b_brandt',
        text: 'Мать думает.\n\n— Nein. Nie. Gott sei Dank. Er war nur müde vom Schreck.\n\nНет. Ни разу. Слава богу. Он просто устал от страха.\n\nТы киваешь. Жара не было ни разу. Значит, плазме было нечего сбивать.', effects: [set19('bmt', 'when'), w19('mats_doubt', true), until(19, 12, 15)] },
      { id: 'c19_bmt_glad', label: 'Сказать, как ты рада', minutes: 10, terminal: true, goto: 'c19_b_brandt',
        text: 'Мать улыбается и вытирает глаза краем рукава.\n\n— Wenn die Neue kommt, kriegen alle Kinder Plasma. Papa sorgt dafür.\n\nКогда приедет новая, плазму получат все дети. Папа об этом позаботится.', effects: [set19('bmt', 'glad'), npc('c16_brandt', 1), until(19, 12, 10)] },
      { id: 'c19_bmt_ball', label: 'Поймать мяч и отдать ему', minutes: 10, terminal: true, goto: 'c19_b_brandt',
        text: 'Мяч отскакивает от стенки к тебе. Ты отдаёшь его Матсу. Он кивает серьёзно, по-взрослому, и снова лупит в стенку изо всех сил.', effects: [set19('bmt', 'ball'), until(19, 12, 10)] },
    ] }),

  B({ id: 'c19_b_brandt', title: 'Брандт на ступенях', location: village, ambient: day19,
    text: [
      { text: 'В двенадцать на ступенях пожарной части Брандт с мегафоном. Очередь затихает.' },
      { text: '— Ab Montag melden sich hier alle, die es überstanden haben. Genesene. Ihr Blut rettet Kinder. Wie meinen Enkel. — Он делает паузу. — Morgen kommt ein Transport aus Hannover nach Lüneburg. Mit Plasma und Ersatz. Wer Fahrzeuge hat, meldet sich bei mir.\n\nС понедельника здесь отмечаются все, кто переболел. Их кровь спасает детей. Как моего внука. Завтра из Ганновера в Люнебург придёт транспорт. С плазмой и заменой. У кого есть машины — ко мне.' },
      { when: flag('B.met.c16_brandt'), text: 'Он находит тебя глазами в толпе и коротко кивает.' },
    ],
    actions: [
      { id: 'c19_bb_ask', label: 'Спросить вслух, сколько у донора берут в день', minutes: 15, terminal: true, outcomes: afterBrandt,
        text: 'В толпе оборачиваются. Брандт опускает мегафон.\n\n— So viel, wie nötig ist, — говорит он без мегафона. Сколько нужно.\n\nОн спускается со ступеней первым. Разговор окончен.', effects: [set19('bb', 'ask'), npc('c16_brandt', -1), until(19, 12, 30)] },
      { id: 'c19_bb_ninth', label: 'Подойти и рассказать ему про девятый день', when: flag('w.c18_ninth_day'), minutes: 20, terminal: true, outcomes: afterBrandt,
        text: 'Брандт слушает, не перебивая. Про мужа Ханны, про Оле.\n\n— Das ist schlimm, — говорит он. — Aber drei Kinder gegen einen Mann. Das ist Krieg.\n\nЭто плохо. Но трое детей против одного мужчины. Это война.\n\nОн хлопает тебя по плечу, как своего, и уходит к машинам.', effects: [set19('bb', 'ninth'), w19('brandt_told_ninth', true), until(19, 12, 40)] },
      { id: 'c19_bb_silent', label: 'Промолчать', minutes: 10, terminal: true, outcomes: afterBrandt,
        text: 'Люди расходятся. Кто-то говорит рядом, что Брандт хороший человек. Кто-то — что у него теперь своя армия.', effects: [set19('bb', 'silent'), until(19, 12, 20)] },
    ] }),

  B({ id: 'c19_b_hanna', title: 'Ханна', location: village, ambient: day19,
    text: [
      { text: 'У церкви тебя окликают. Ханна, из грузовика и из очереди за кашей. Мальчик держится за её пальто.\n\n— Wir wohnen bei meiner Schwägerin, — говорит она. — Danke für den Platz.\n\nМы живём у моей золовки. Спасибо за место.' },
      { text: 'Она смотрит на ступени пожарной части, где только что был Брандт.\n\n— Sie haben meinen Mann auch «gebraucht». Er hat jeden Tag nach dem Mädchen gefragt, das sein Blut bekommen hat. Am neunten Tag hat er nicht mehr gefragt.\n\nМоего мужа тоже «ждали». Каждый день он спрашивал про девочку, которой давали его кровь. На девятый день спрашивать перестал.' },
    ],
    actions: [
      { id: 'c19_bh_bread', label: 'Отдать мальчику свой хлеб', when: { has: 'bread' }, minutes: 15, terminal: true, goto: 'c19_b_market',
        text: 'Мальчик берёт полбуханки двумя руками и прижимает к куртке. Ханна ничего не говорит. Только сжимает твою руку, коротко.', effects: [set19('bh', 'bread'), { take: 'bread' }, until(19, 13, 0)] },
      { id: 'c19_bh_girl', label: 'Спросить, что стало с той девочкой', minutes: 20, terminal: true, goto: 'c19_b_market',
        text: '— Ich weiß es nicht. Niemand hat es mir gesagt. — Ханна поправляет мальчику шапку. — Ich habe auch nicht gefragt. Ich hatte Angst vor der Antwort.\n\nНе знаю. Мне никто не сказал. Я и не спрашивала. Боялась ответа.', effects: [set19('bh', 'girl'), w19('hanna_girl', true), until(19, 13, 0)] },
      { id: 'c19_bh_go', label: 'Пожелать им удачи', minutes: 10, terminal: true, goto: 'c19_b_market',
        text: 'Ханна кивает. Мальчик машет тебе варежкой, пока вы не скрываетесь за углом.', effects: [set19('bh', 'go'), until(19, 12, 50)] },
    ] }),

  B({ id: 'c19_b_board', title: 'Доска у пункта', location: village, ambient: day19,
    text: [
      { text: 'У входа в пожарную часть доска объявлений. Расписание воды, график электричества, приказ о комендантском часе. Ниже от руки: «Tausche Kinderschuhe Gr. 30 gegen Kerzen». «Suche Insulin, zahle gut». «Hund entlaufen, Labrador, hört auf Bruno».' },
      { when: flag('w.c18_insulin'), text: '«Ищу инсулин, хорошо заплачу». Две шприц-ручки лежат у тебя в сумке, завёрнутые в перчатку.' },
    ],
    actions: [
      { id: 'c19_bbd_insulin', label: 'Найти того, кто ищет инсулин', when: all(flag('w.c18_insulin'), { has: 'c18_insulin' }), minutes: 25, terminal: true, goto: 'c19_b_market',
        text: 'Внизу листка адрес: Kirchweg 4. Дверь открывает пожилой мужчина в двух свитерах. Его жена лежит в комнате с задёрнутыми шторами. Ты не отдаёшь ручки сразу. Ты только запоминаешь адрес и говоришь, что придёшь, если сможешь.', effects: [w19('board_dog', true), set19('bbd', 'insulin'), w19('insulin_address', true), until(19, 13, 0)] },
      { id: 'c19_bbd_trade', label: 'Предложить обмен по своему списку нужного', when: flag('w.c19_needs_list'), minutes: 25, terminal: true, goto: 'c19_b_market',
        text: 'Ты дописываешь внизу свой листок: «Suche Seife und Streichhölzer. Lüdemann-Hof». Через десять минут к тебе подходит женщина с кошёлкой и молча протягивает кусок хозяйственного мыла. За это она просит одно: передать Брандту, что её сын не переболел и никуда не поедет.', effects: [w19('board_dog', true), set19('bbd', 'trade'), w19('soap', true), until(19, 13, 0)] },
      { id: 'c19_bbd_read', label: 'Прочитать всё до конца', minutes: 15, terminal: true, goto: 'c19_b_market',
        text: 'В самом низу, под приказом, листок без подписи, печатными буквами: «Fragt, wohin die Genesenen aus Buchholz gekommen sind». Спросите, куда делись переболевшие из Бухгольца. Кто-то уже сорвал половину.', effects: [w19('board_dog', true), set19('bbd', 'read'), w19('buchholz_question', true), until(19, 12, 50)] },
    ] }),

  B({ id: 'c19_b_lunch', title: 'Суп', location: village, ambient: indoorV,
    text: [
      { text: 'В гараже пожарной части разливают суп из большого котла: тем, кто в списке, с хлебом. Остальным — без.' },
      { when: companion, text: 'Твоя спутница ест быстро и смотрит, не дадут ли ещё.' },
    ],
    actions: [
      { id: 'c19_bl_soup', label: 'Встать за супом', minutes: 30, terminal: true, goto: 'c19_b_funeral',
        text: 'Суп жидкий, но горячий. В нём плавает морковь и что-то, похожее на тушёнку. Ты съедаешь всё.', effects: [set19('bl', 'soup'), ...fed, until(19, 13, 30)] },
      { id: 'c19_bl_own', label: 'Съесть свой хлеб на скамейке', when: { has: 'bread' }, minutes: 20, terminal: true, goto: 'c19_b_funeral',
        text: 'Ты отламываешь от пайка и ешь на скамейке у колонки. Кёлер садится рядом и делает вид, что не голодна.', effects: [set19('bl', 'own'), { take: 'bread' }, ...fed, until(19, 13, 30)] },
      { id: 'c19_bl_skip', label: 'Не есть: дома поешь', minutes: 10, terminal: true, goto: 'c19_b_funeral',
        text: 'Ты пьёшь воду из колонки. В животе тянет, но до дома три часа.', effects: [set19('bl', 'skip'), until(19, 13, 20)] },
    ] }),

  B({ id: 'c19_b_bakery', title: 'Пекарня Кёлер', location: village, ambient: indoorV,
    text: [
      { text: 'Кёлер живёт за церковью, в доме с вывеской «Bäckerei Köhler seit 1962». Внутри холодно, но печь в пекарне горячая: она печёт для улицы, сколько хватает муки.' },
      { when: wernerAlive, text: '— Werner hat hier gestanden, — говорит она и кладёт ладонь на край стола. — Vierzig Jahre.\n\nВернер стоял тут. Сорок лет.' },
      { when: not(wernerAlive), text: 'На столе два фартука. Один она надевает. Второй так и лежит, аккуратно сложенный.' },
    ],
    actions: [
      { id: 'c19_bkb_knead', label: 'Встать рядом и месить тесто', minutes: 70, activity: 'moderate', terminal: true, goto: 'c19_b_locker',
        text: 'Тесто тяжёлое и липкое. Через полчаса у тебя горят плечи. Кёлер поправляет тебя одним словом: «Faust». Кулаком. Когда ты уходишь, она заворачивает тебе в полотенце буханку, ещё тёплую.', effects: [set19('bkb', 'knead'), { give: 'c16_bread' }, npc('c3_koehler', 2), until(19, 14, 45)] },
      { id: 'c19_bkb_talk', label: 'Посидеть с ней, пока хлеб в печи', minutes: 50, terminal: true, goto: 'c19_b_locker',
        text: 'Кёлер рассказывает про Вернера: как он ставил тесто в три ночи и пел. Голос у него был громкий, на всю улицу. Ты слушаешь. Буханку она всё равно заворачивает, «für den Weg». В дорогу.', effects: [set19('bkb', 'talk'), { give: 'c16_bread' }, npc('c3_koehler', 1), until(19, 14, 30)] },
      { id: 'c19_bkb_go', label: 'Поблагодарить и идти домой, пока светло', minutes: 10, terminal: true, goto: 'c19_b_ride',
        text: 'Кёлер провожает тебя до калитки и стоит, пока ты не сворачиваешь.', effects: [set19('bkb', 'go'), until(19, 13, 50)] },
    ] }),

    // Находка B (серия 19–24): шкафчик Вернера; код — год на вывеске пекарни, который был в тексте сцены выше.
  B({ id: 'c19_b_locker', title: 'Задняя комната', location: village, ambient: indoorV,
    text: [
      { text: 'Кёлер просит принести из задней комнаты мешок муки. Там холодно и пахнет мышами. За мешками у стены стоит железный шкафчик, какие бывают в раздевалках. На дверце выцветшая буква «W.» и кодовый замок на четыре цифры.' },
      { text: 'Из щели у дверцы пахнет кофе. Настоящим, молотым. Этого запаха не было с понедельника.' },
      { text: 'Кёлер стоит в дверях с полотенцем в руках.\n\n— Werners Spind. Den Code hat er keinem gesagt. Nicht mal mir.\n\nШкафчик Вернера. Код он никому не говорил. Даже мне.' },
    ],
    actions: [
      { id: 'c19_bl_1958', label: 'Набрать 1-9-5-8', minutes: 3, terminal: true, goto: 'c19_b_locker2', text: lockerMiss, effects: [set19('blk', 'miss')] },
      { id: 'c19_bl_1962', label: 'Набрать 1-9-6-2', minutes: 3, terminal: true, goto: 'c19_b_ride',
        text: 'Замок щёлкает. Кёлер ахает за спиной.\n\nВнутри банка кофе, полкило, нераспечатанная. Блок сигарет. Пакет сахара. Губная гармошка в коробке и фотография: двое детей у этой самой пекарни, под той же вывеской.\n\nКёлер забирает гармошку и фотографию и садится на мешок.\n\n— Nimm den Kaffee und die Zigaretten. Werner hat nie geraucht. Die waren zum Tauschen. — Она вытирает глаза. — Den Zucker backe ich für die Kinder.\n\nВозьми кофе и сигареты. Вернер никогда не курил, это на обмен. Сахар я испеку детям.',
        effects: [set19('blk', 'code'), w19('locker', 'open'), { give: 'coffee' }, { give: 'c19_cigs' }, npc('c3_koehler', 3, 'c19_opened_werner_locker')] },
      { id: 'c19_bl_1975', label: 'Набрать 1-9-7-5', minutes: 3, terminal: true, goto: 'c19_b_locker2', text: lockerMiss, effects: [set19('blk', 'miss')] },
      { id: 'c19_bl_2006', label: 'Набрать 2-0-0-6', minutes: 3, terminal: true, goto: 'c19_b_locker2', text: lockerMiss, effects: [set19('blk', 'miss')] },
      { id: 'c19_bl_flour', label: 'Взять муку и не трогать чужое', minutes: 5, terminal: true, goto: 'c19_b_ride',
        text: 'Ты взваливаешь мешок на плечо. Запах кофе тянется за тобой до самой печи.', effects: [set19('blk', 'none')] },
    ] }),

  B({ id: 'c19_b_locker2', title: 'Шкафчик', location: village, ambient: indoorV,
    text: [{ text: 'Дужка не поддаётся. Кёлер молча смотрит от двери. Комбинаций десять тысяч, а до темноты три часа дороги.' }],
    actions: [
      { id: 'c19_bl2_break', label: 'Сбить замок молотком', minutes: 15, terminal: true, goto: 'c19_b_ride',
        text: 'Замок слетает с третьего удара. Кёлер вздрагивает на каждом.\n\nВнутри кофе, сигареты, сахар, губная гармошка и фотография. Кёлер забирает всё, кроме сигарет, и прижимает к себе.\n\n— Die Zigaretten. Werner hat nicht geraucht, — говорит она, не глядя на тебя. Сигареты возьми. Вернер не курил. — Und jetzt geh bitte.\n\nА теперь иди, пожалуйста.',
        effects: [set19('blk', 'break'), w19('locker', 'broken'), { give: 'c19_cigs' }, npc('c3_koehler', -2, 'c19_broke_werner_locker')] },
      { id: 'c19_bl2_leave', label: 'Оставить и отнести муку', minutes: 5, terminal: true, goto: 'c19_b_ride',
        text: 'Ты взваливаешь мешок на плечо. Кёлер у двери кивает, будто так и надо.\n\n— Er hat ihn mitgenommen, den Code, — говорит она. Он унёс его с собой.', effects: [set19('blk', 'left')] },
    ] }),

B({ id: 'c19_b_back', title: 'Поле', location: lane, ambient: cold19,
    text: [
      { text: 'Обратно ты идёшь одна. Солнце низко, тени длинные. У поворота к хутору останавливаешься: на поле, между дорогой и насыпью, двое.' },
      { text: 'Больничные рубашки, босые ноги в грязи. Идут медленно, в сторону шоссе. У одного на запястье белеет браслет. До них метров двести. Ветер от них к тебе.' },
      { when: companion, text: 'Твоя спутница останавливается и хватает тебя за рукав.' },
    ],
    actions: [
      { id: 'c19_bbk_wait', label: 'Присесть за живой изгородью и переждать', minutes: 30, terminal: true, goto: 'c19_b_home',
        text: 'Ты сидишь на корточках за кустами боярышника. Ноги затекают, пальцы мёрзнут. Двое проходят в ста метрах, не повернув головы, и уходят к шоссе. Ты ждёшь ещё пять минут.', effects: [set19('bbk', 'wait'), { body: 'stress', delta: 2 }] },
      { id: 'c19_bbk_loop', label: 'Обойти по дороге, длинным кругом', minutes: 45, move: true, terminal: true, goto: 'c19_b_home',
        text: 'Ты возвращаешься до перекрёстка и идёшь к хутору с другой стороны, мимо почтового ящика. Лишние три километра. Двоих на поле ты больше не видишь.', effects: [set19('bbk', 'loop'), { body: 'fatigue', delta: 3 }] },
      { id: 'c19_bbk_run', label: 'Быстро пересечь поле, пока они далеко', minutes: 15, move: true, risky: true, terminal: true, goto: 'c19_b_home',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'stealth'], difficulty: 3, uses: ['mobility'] }, text: 'Ты идёшь быстро, пригнувшись, по краю пашни. Один из двоих поворачивает голову, но не к тебе, а на ворону. Через десять минут ты у калитки.', effects: [set19('bbk', 'run')] },
          { id: 'ditch', text: 'Под инеем дренажная канава. Ты проваливаешься по колено, сумка слетает с плеча в воду. Банку ты нащупываешь, хлеб размок. Двое на поле останавливаются и смотрят в твою сторону. Ты выбираешься и идёшь, не оглядываясь. Они не идут за тобой. Сегодня.', effects: [set19('bbk', 'ditch'), w19('b_wet', true), { body: 'stress', delta: 4 }, { injure: 'bruise', site: 'leftLeg', severity: 1 }, { if: { has: 'bread' }, then: [{ take: 'bread' }] }] },
        ] },
    ] }),

  B({ id: 'c19_b_home', title: 'Калитка', camp: yard14, ambient: cold19, safe: true,
    text: [
      { text: 'Калитка, двор, свет в кухне. Пахнет дымом.' },
      { when: own19('bbk', 'ditch'), text: 'Штанина мокрая до колена и уже дубеет на холоде.' },
      { when: henrikeHome, text: 'Хенрике выходит на крыльцо и смотрит, что у тебя в сумке.' },
      { when: all(not(henrikeHome), uteHere), text: 'Уте выходит на крыльцо в фартуке Хенрике.' },
    ],
    actions: [
      { id: 'c19_bho_stock', label: 'Отнести всё, что принесла, в общий запас', minutes: 15, terminal: true, goto: 'c19_b_afternoon',
        text: 'Ты выкладываешь на полку в кладовке всё, что донесла. Немного, но всё по-честному.', effects: [set19('bho', 'stock'),
          { if: { has: 'canned_beans' }, then: [{ take: 'canned_beans' }, { place: 'canned_beans', at: 'c3_farm_stock', qty: 1 }] },
          { if: { has: 'c16_bread' }, then: [{ take: 'c16_bread' }, { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }] }, until(19, 15, 30)] },
      { id: 'c19_bho_dry', label: 'Сначала переодеться в сухое', when: own19('bbk', 'ditch'), minutes: 20, terminal: true, goto: 'c19_b_afternoon',
        text: 'Ты стягиваешь мокрые джинсы у печки. Кожа на голени красная и чужая. Тепло возвращается медленно.', effects: [set19('bho', 'dry'), { body: 'stress', delta: -1 }, until(19, 15, 30)] },
      { id: 'c19_bho_tell', label: 'Сразу рассказать, что объявил Брандт', minutes: 15, terminal: true, goto: 'c19_b_afternoon',
        text: 'Ты говоришь с порога: понедельник, переболевшие, транспорт из Ганновера, плазма. На кухне становится тихо.', effects: [set19('bho', 'tell'), until(19, 15, 30)] },
    ] }),

  B({ id: 'c19_b_afternoon', title: 'До темноты', camp: house14, safe: true,
    text: [
      { text: 'За окном синеет: солнце садится. Ноги гудят после дороги.' },
      { when: ninaFarm, text: 'Нина сидит на кухне над тетрадью Хенрике и что-то чертит линейкой.' },
      { when: all(uteHere, not(ninaFarm)), text: 'Уте замешивает тесто на столе. Мука у неё до локтей.' },
    ],
    actions: [
      { id: 'c19_baf_nina', label: 'Посмотреть, что чертит Нина', when: ninaFarm, minutes: 40, terminal: true, goto: 'c19_eve',
        text: 'Это таблица: куры по кличкам, яйца по дням, кто болеет. Нина придумала курам имена. Одну зовут Хенрике, потому что она всех клюёт. Ты смеёшься впервые за день, и Нина тоже.', effects: [set19('baf', 'nina'), npc('c7_nina', 2), { body: 'stress', delta: -2 }, until(19, 17, 0)] },
      { id: 'c19_baf_dough', label: 'Встать рядом с Уте и месить', when: uteHere, minutes: 50, activity: 'light', terminal: true, goto: 'c19_eve',
        text: 'Уте показывает, как складывать тесто к себе и от себя. Руки у неё быстрые и сильные. «Kai hat das nie gelernt», — говорит она. Кай так и не научился. Больше она про него ничего не говорит.', effects: [set19('baf', 'dough'), npc('c14_ute', 2), until(19, 17, 0)] },
      { id: 'c19_baf_sleep', label: 'Лечь на час', minutes: 5, terminal: true, goto: 'c19_eve',
        text: 'Ты ложишься в одежде. Засыпаешь под звук чьих-то шагов внизу.', effects: [set19('baf', 'sleep'), until(19, 17, 0, true)] },
      { id: 'c19_baf_note', label: 'Записать, что было в Йестебурге, пока не забылось', minutes: 30, terminal: true, goto: 'c19_eve',
        text: 'Ты пишешь в тетради Хенрике, на последней странице: мальчик с жёлтым пакетом, Матс с мячом, Брандт на ступенях. Слово «плазма» на странице выходит четыре раза.', effects: [set19('baf', 'note'), until(19, 17, 0)] },
    ] }),
];

