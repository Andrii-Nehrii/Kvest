import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { v } from './point18';
import { npc } from './point19';
import {
  S25, hasPage, henrikeLue25, kasiaHere25, leaExposed, leaLue25, lue25, msgCome, msgStay, msgTruth, oleCollapsed, oleRelieved,
  oleState, oleStopped, set25, snow25, until25, w25,
} from './point25';

// Участок 25, линия A: фургон прачечной, казарма Люнебурга: Оле (по состоянию), Хенрике, Алерс, Лея (если её отдали), кухня, обратно.
const A = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S25({ ...scene, for: 'any', chapter: 'ch3', location: lue25,
  camp: scene.camp ?? { at: lue25, stock: 'c3_farm_stock', rest: false }, safe: false });
const van = { tempC: 8, outdoor: false, wet: false };
const yard = { tempC: -1, outdoor: true, wet: false };
const reported: Cond = v('w.c11_report', 'report');
const gerd: Cond = flag('w.c20_gerd_written');
const oleAliveVisible: Cond = { npc: 'ole', alive: true };
const afterAhlers = [{ id: 'l', when: leaLue25, goto: 'c25_a_lea' }, { id: 'k', goto: 'c25_a_kitchen' }];

export const day25AScenes: Scene[] = [
  S25({ id: 'c25_a_van', for: 'any', chapter: 'ch3', title: 'Фургон прачечной', camp: { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false }, safe: false, ambient: snow25,
    onEnter: [oleState],
    text: [
      { text: 'Без четверти семь у пекарни Кёлер стоит белый фургон с выцветшей надписью «Wäscherei Lüneburg». Шофёр, полный мужчина в ушанке, курит у капота и не торопит.' },
      { text: '— Wessel, — говорит он и протягивает руку в перчатке без пальцев. — Vorne ist warm. Hinten sind die Säcke. Such dir was aus.\n\nВессель. Впереди тепло. Сзади мешки. Выбирай.' },
      { text: 'Фургон старый, «Ивеко» с ржавыми арками. В кабине пахнет табаком и мятными леденцами: банка с ними приклеена скотчем к приборной панели.' },
    ],
    actions: [
      { id: 'c25_av_front', label: 'Сесть впереди и разговаривать', minutes: 60, terminal: true, goto: 'c25_a_post', ambientDuring: van,
        text: 'Вессель едет через Винзен, медленно, по снегу. Говорит всю дорогу. Про то, что в Винзене поляки с консервного завода собирают колонну домой, на восток: «um den zehnten Dezember», около десятого декабря. Про то, что Эльбу у Лауэнбурга держат военные. Про то, что пятнадцатого армия уходит из Люнебурга, «so heißt es», так говорят.\n\n— Und dann? — спрашиваешь ты.\n\n— Dann sind wir dran. Wir alle.\n\nА потом? — Потом наша очередь. Всех.', effects: [set25('av', 'front'), w25('east_convoy', true), w25('army_leaves', true), until25(7, 30)] },
      { id: 'c25_av_back', label: 'Сесть сзади, на мешки, и поспать', minutes: 60, activity: 'rest', terminal: true, goto: 'c25_a_post', ambientDuring: van,
        text: 'Мешки с бельём мягкие и пахнут хлоркой. Ты засыпаешь на первом повороте и просыпаешься от того, что фургон стоит. Шлагбаум.', effects: [set25('av', 'back'), { body: 'fatigue', delta: -8 }, until25(8, 10, true)] },
      { id: 'c25_av_window', label: 'Сесть впереди и смотреть в окно', minutes: 60, terminal: true, goto: 'c25_a_post', ambientDuring: van,
        text: 'Поля белые. У Винзена на обочине стоят брошенные машины под снегом, как грибы. У одной открыта дверь, и в салон намело. На мосту через Ильменау двое солдат проверяют документы и машут: прачечная, проезжай.', effects: [set25('av', 'window'), until25(7, 30)] },
    ] }),

  A({ id: 'c25_a_gate', title: 'Шлагбаум', ambient: yard,
    text: [
      { text: 'Тот же сержант у шлагбаума. Тот же ящик с ячейками для телефонов. Только снег на нём новый.' },
      { text: '— Lüdemann? Der Ole? — Сержант кивает на донорский блок. — Er wartet seit sechs. Er hat gesagt, einer kommt.\n\nЛюдеман? Оле? Ждёт с шести. Сказал, что кто-то приедет.' },
      { when: v('$.c25_av', 'front'), text: 'Вессель всю дорогу говорил. Теперь ты знаешь про него больше, чем про многих соседей.' },
      { text: 'За шлагбаумом казарма: красный кирпич, белые рамы, на плацу ни души. Над донорским блоком из трубы идёт дым: там топят лучше, чем везде.' },
    ],
    actions: [
      { id: 'c25_ag_go', label: 'Сдать телефон и идти сразу', minutes: 10, terminal: true, goto: 'c25_a_ole',
        text: 'Телефон уходит в ячейку. Жетон холодит шею.', effects: [set25('ag', 'go'), { phonePower: false }, until25(8, 25)] },
      { id: 'c25_ag_ask', label: 'Спросить сержанта, как он', minutes: 15, terminal: true, goto: 'c25_a_ole',
        outcomes: [
          { id: 'col', when: oleCollapsed, text: '— Heute früh umgekippt. Beim Abnehmen. Die Ärztin hat ihn selbst getragen.\n\nСегодня утром упал. Прямо на заборе. Врач сама его несла.', effects: [set25('ag', 'ask')] },
          { id: 'stop', when: oleStopped, text: '— Er gibt nichts mehr. Seit Montag. Hat einen Brief gekriegt. Seitdem sitzt er angezogen auf dem Bett.\n\nБольше не сдаёт. С понедельника. Получил письмо. С тех пор сидит одетый на кровати.', effects: [set25('ag', 'ask')] },
          { id: 'rel', text: '— Er darf sich ausruhen. Seit Samstag hat er eine Nachbarin. Die neue Spenderin.\n\nЕму дают отдохнуть. С субботы у него соседка. Новый донор.', effects: [set25('ag', 'ask')] },
        ], effects: [{ phonePower: false }, until25(8, 30)] },
      { id: 'c25_ag_henrike', label: 'Попросить сержанта сказать Хенрике, что ты приехал{m:|а}', minutes: 15, terminal: true, goto: 'c25_a_ole', ambientDuring: snow25,
        text: 'Сержант кивает и кричит что-то в окно караулки. Пока ты сдаёшь телефон, по коридору блока уже стучат каблуки. Хенрике знает. Теперь она будет ждать в коридоре.', effects: [set25('ag', 'henrike'), until25(8, 45)] },
    ] }),

  A({ id: 'c25_a_ole', title: 'Оле',
    text: [
      { when: oleCollapsed, text: 'Оле лежит на койке под двумя одеялами. Лицо серое, губы синеватые. На сгибе локтя пластырь поверх пластыря, синяк до запястья. Он поворачивает голову, узнаёт тебя и улыбается одной половиной рта.\n\n— Du. Gut. Ich hab schon gedacht, Mutter hat dich erfunden.\n\nТы. Хорошо. Я уже думал, мать тебя выдумала.' },
      { when: oleStopped, text: 'Оле сидит на койке одетый, в куртке, ботинки зашнурованы. На тумбочке лежит письмо {B.gen}, разглаженное ладонью.\n\n— Ich hab es dreimal gelesen. Dann hab ich der Schwester gesagt: nicht mehr. Sie hat geweint. Ich nicht.\n\nЯ перечитал три раза. Потом сказал сестре: больше нет. Она плакала. Я — нет.' },
      { when: oleRelieved, text: 'Оле сидит на койке у окна и смотрит во двор. Цвет лица у него лучше, чем ты помнишь. На соседней койке аккуратно сложено одеяло.\n\n— Sie ist im Abnahmeraum. Lea. Seit Samstag jeden Tag. — Он не оборачивается. — Ich darf Freitag gehen. Und ich weiß nicht, ob ich will.\n\nОна в процедурной. Лея. С субботы каждый день. В пятницу мне можно уйти. И я не знаю, хочу ли.' },
      { when: oleStopped, text: 'Палата на четверых, но три койки пустые, матрасы свёрнуты. На подоконнике кружка с засохшим чаем и нетронутая пачка печенья. Скулы у Оле торчат, как у старика.' },
    ],
    actions: [
      { id: 'c25_ao_come', label: 'Сказать, как решили: поехали домой', when: msgCome, minutes: 30, terminal: true, goto: 'c25_a_henrike',
        outcomes: [
          { id: 'col', when: oleCollapsed, text: '— Heim. — Оле закрывает глаза. — Ja. Ich glaube, diesmal ja. Ich kann nicht mal den Becher halten.\n\nДомой. Да. Кажется, на этот раз да. Я даже кружку держать не могу.', effects: [set25('ao', 'come'), w25('ole_agrees', true), npc('ole', 2)] },
          { id: 'stop', when: oleStopped, text: '— Ich bin seit gestern angezogen. — Он показывает на ботинки. — Ich hab nur gewartet, dass einer das sagt. Nicht Mutter. Einer von euch.\n\nЯ со вчерашнего дня одет. Я только ждал, чтобы кто-то это сказал. Не мать. Кто-то из вас.', effects: [set25('ao', 'come'), w25('ole_agrees', true), npc('ole', 3)] },
          { id: 'rel', text: '— Und sie? — Оле кивает на сложенное одеяло. — Sie liegt jetzt da, wo ich lag. Für nichts, wenn ich eure Zettel richtig verstehe. Und ich fahre heim und esse Kartoffeln.\n\nА она? Она теперь лежит там, где лежал я. Ни за что, если я правильно понимаю ваши записки. А я поеду домой есть картошку.', effects: [set25('ao', 'come'), w25('ole_guilt', true)] },
        ], effects: [until25(9, 10)] },
      { id: 'c25_ao_stay', label: 'Сказать, как решили: решай сам. Дом ждёт', when: msgStay, minutes: 30, terminal: true, goto: 'c25_a_henrike',
        outcomes: [
          { id: 'col', when: oleCollapsed, text: '— Selbst. — Он смеётся и кашляет. — Das sagen alle. Die Ärztin auch. Und dann kommt die Kleine vom Fenster und fragt, ob ich morgen wieder da bin.\n\nСам. Все так говорят. Врач тоже. А потом приходит малышка от окна и спрашивает, буду ли я тут завтра.', effects: [set25('ao', 'stay'), w25('ole_torn', true)] },
          { id: 'stop', when: oleStopped, text: '— Hab ich schon. — Оле показывает на ботинки. — Entschieden. Am Montag. Ich warte nur auf den Freitag, damit Mutter nicht allein fahren muss.\n\nУже решил. В понедельник. Я жду пятницы только чтобы мать не ехала одна.', effects: [set25('ao', 'stay'), npc('ole', 2)] },
          { id: 'rel', text: '— Freitag, — говорит Оле. Пятница. — Wenn ich bis Freitag nicht verrückt werde.\n\nЕсли до пятницы не сойду с ума.', effects: [set25('ao', 'stay')] },
        ], effects: [until25(9, 10)] },
      { id: 'c25_ao_truth', label: 'Сказать, как решили: всё, что знаем про плазму', when: msgTruth, minutes: 40, terminal: true, goto: 'c25_a_henrike',
        outcomes: [
          { id: 'stop', when: oleStopped, text: 'Ты рассказываешь. Он слушает, кивая: половину он уже знает из письма. На словах «двести двенадцать и ноль» он перестаёт кивать.\n\n— Null. Dann war das alles für eine Woche. Für jedes Kind eine Woche.\n\nНоль. Значит, всё это было ради недели. Каждому ребёнку по неделе.', effects: [set25('ao', 'truth'), w25('ole_knows_zero', true)] },
          { id: 'any', text: 'Ты рассказываешь всё: Ройтер, двести двенадцать, ноль, новых поставок не будет. Оле слушает, не перебивая. В конце он долго смотрит в потолок.\n\n— Eine Woche. Jedes Mal eine Woche. — Он поворачивает голову к тебе. — Und die Kinder? Wissen die das?\n\nНеделя. Каждый раз неделя. А дети? Они знают?', effects: [set25('ao', 'truth'), w25('ole_knows_zero', true), { body: 'stress', delta: 2 }] },
        ], effects: [until25(9, 20)] },
      { id: 'c25_ao_hand', label: 'Ничего не говорить. Сесть рядом и взять за руку', minutes: 30, terminal: true, goto: 'c25_a_henrike',
        text: 'Рука у него холодная и лёгкая, как у старика. Он не отнимает её. Вы сидите так, пока в дверях не появляется сестра с градусником.', effects: [set25('ao', 'hand'), npc('ole', 1), until25(9, 10)] },
      { id: 'c25_ao_ask', label: 'Спросить, чего хочет он сам', minutes: 30, terminal: true, goto: 'c25_a_henrike',
        text: 'Оле долго смотрит в окно.\n\n— Nach Hause. Aber nicht ohne Mutter. Und nicht, bevor die Kinder hier jemanden haben.\n\nДомой. Но не без матери. И не раньше, чем у детей здесь кто-то будет.\n\nОн говорит это так, будто давно решил и ждал только, чтобы кто-то спросил.', effects: [set25('ao', 'ask'), w25('ole_wish_known', true), npc('ole', 1), until25(9, 10)] },
    ] }),

  A({ id: 'c25_a_henrike', title: 'Хенрике в коридоре',
    text: [
      { text: 'Хенрике ждёт в коридоре, на стуле у стены. В руках тетрадь Оле, та, где даты и цифры. Она встаёт, когда ты выходишь.' },
      { when: reported, text: '— Ihr habt ihn gemeldet. Am vierzehnten. Ohne euch wäre er nie hier.\n\nВы его сдали. Четырнадцатого. Без вас он бы здесь не оказался.\n\nОна говорит это первый раз. Без злости. Как констатацию.' },
      { when: not(reported), text: '— Er hat es selbst entschieden. Wie sein Vater. Die Lüdemanns entscheiden immer selbst und sterben dann daran.\n\nОн решил это сам. Как его отец. Людеманы всегда решают сами, а потом от этого умирают.' },
      { when: not(henrikeLue25), text: 'Хенрике здесь нет. На стуле у стены лежит только её вязание.' },
      { when: henrikeLue25, text: 'Пальто на ней застёгнуто не на те пуговицы. Она этого не замечает. Ты делаешь вид, что тоже не замечаешь.' },
    ],
    actions: [
      { id: 'c25_ah_yes', label: 'Сказать: да. Мы его сдали', when: all(reported, henrikeLue25), minutes: 20, terminal: true, goto: 'c25_a_ahlers',
        text: 'Хенрике кивает.\n\n— Gut. Dass du es sagst. — Она отдаёт тебе тетрадь. — Nimm. Ich will die Zahlen nicht mehr sehen.\n\nХорошо. Что ты это говоришь. Возьми. Не хочу больше видеть эти цифры.', effects: [set25('ah', 'yes'), { give: 'c25_ole_book' }, npc('henrike', 1, 'c25_admitted'), until25(9, 40)] },
      { id: 'c25_ah_why', label: 'Объяснить, почему тогда так решили', when: all(reported, henrikeLue25), minutes: 30, terminal: true, goto: 'c25_a_ahlers',
        text: 'Ты говоришь про царапину, про жар, про то, что боялись за Нину. Хенрике слушает и смотрит в тетрадь.\n\n— Ich weiß. Ich hätte dasselbe getan. Das ist ja das Schlimme.\n\nЗнаю. Я бы сделала то же самое. Это и плохо.', effects: [set25('ah', 'why'), npc('henrike', 2), until25(9, 50)] },
      { id: 'c25_ah_sit', label: 'Сесть рядом с ней на соседний стул', when: henrikeLue25, minutes: 20, terminal: true, goto: 'c25_a_ahlers',
        text: 'Вы сидите рядом. Мимо ходят сёстры с лотками. Хенрике держит тетрадь на коленях, закрытой, и гладит обложку.\n\n— Freitag, — говорит она в конце. — Freitag bringe ich ihn. Mit euch oder ohne.\n\nВ пятницу. В пятницу я его заберу. С вами или без.', effects: [set25('ah', 'sit'), npc('henrike', 1), until25(9, 40)] },
      { id: 'c25_ah_none', label: 'Пойти дальше, к врачу', when: not(henrikeLue25), minutes: 10, terminal: true, goto: 'c25_a_ahlers',
        text: 'Ты проходишь по коридору к кабинету Алерс.', effects: [set25('ah', 'none'), until25(9, 25)] },
    ] }),

  A({ id: 'c25_a_ahlers', title: 'Доктор Алерс',
    text: [
      { text: 'Доктор Алерс пишет карты на подоконнике. Седая коса, очки на кончике носа. Она не поднимает головы.' },
      { when: hasPage, text: 'Ты кладёшь перед ней лист с припиской Ройтера.' },
      { when: not(hasPage), text: 'Ты пересказываешь ей приписку Ройтера: двести двенадцать, ноль, новых поставок не будет.' },
      { text: 'Она читает. Или слушает. Снимает очки.\n\n— Ich weiß es seit Buchholz. Station vier. Wir haben es dort angefangen, als der Strom noch da war.\n\nЯ знаю это с Бухгольца. Четвёртое отделение. Мы начали это там, пока был ток.' },
      { text: '— Plasma habe ich bis Donnerstag. Dann ist nichts mehr. Dann muss ich es den Müttern sagen.\n\nПлазмы у меня до четверга. Потом ничего. Потом придётся сказать матерям.' },
      { text: 'В кабинете холодно: батарея ледяная, обогреватель на полу выключен. На стене детские рисунки на кнопках: солнце, дом, человек с красным крестом на груди.' },
    ],
    actions: [
      { id: 'c25_aa_wait', label: 'Обещать молчать до четверга', minutes: 20, terminal: true, outcomes: afterAhlers,
        text: '— Danke. — Она надевает очки. — Bis Donnerstag haben die Kinder noch Hoffnung. Hoffnung ist auch eine Therapie. Eine schlechte, aber die einzige.\n\nСпасибо. До четверга у детей ещё есть надежда. Надежда — тоже лечение. Плохое, но единственное.', effects: [set25('aa', 'wait'), w25('ahlers_thursday', 'wait'), until25(10, 20)] },
      { id: 'c25_aa_help', label: 'Предложить: скажем вместе, когда придёт время', minutes: 25, terminal: true, outcomes: afterAhlers,
        text: 'Алерс долго смотрит на тебя.\n\n— Sie haben keine Ahnung, was Sie anbieten. — Пауза. — Donnerstag, zwölf Uhr. Wenn Sie da sind, sind Sie da.\n\nВы понятия не имеете, что предлагаете. Четверг, двенадцать часов. Если будете здесь — будете.', effects: [set25('aa', 'help'), w25('ahlers_thursday', 'help'), until25(10, 25)] },
      { id: 'c25_aa_ole', label: 'Спросить только про Оле', minutes: 20, terminal: true, outcomes: afterAhlers,
        text: '— Er gibt nichts mehr. Ab heute. Das entscheide ich, nicht er. — Алерс пишет что-то в карту и подчёркивает. — Nehmen Sie ihn Freitag mit. Bis dahin päpple ich ihn auf. Mit Zucker und Ruhe. Mehr habe ich nicht.\n\nОн больше не сдаёт. С сегодняшнего дня. Это решаю я, а не он. Заберите его в пятницу. До тех пор я его откормлю. Сахаром и покоем. Больше у меня ничего нет.', effects: [set25('aa', 'ole'), w25('ole_banned', true), until25(10, 20)] },
    ] }),

  A({ id: 'c25_a_lea', title: 'Лея',
    text: [
      { when: leaExposed, text: 'Лею ты находишь в лазарете, в белом халате, со шприцем в руке. Не на койке донора. Она делает укол старику и только потом поворачивается.\n\n— Sie wissen es. Seit Sonntag. Euer Tobias. — Она не спрашивает, ты ли это сделал. — Jetzt bin ich Sanitäterin. Echt. Meine Mutter steht nicht mehr auf der Liste in Hannover. Das hat der Kommandant gleich erledigt.\n\nОни знают. С воскресенья. Ваш Тобиас. Теперь я санитарка. Настоящая. Мама больше не в списке в Ганновере. Комендант сразу это сделал.' },
      { when: not(leaExposed), text: 'Лея лежит в процедурной, на донорской койке. Трубка от сгиба локтя ведёт в пакет на стойке. Пакет наполняется медленно, тёмным.\n\nОна видит тебя и не поднимает глаз.\n\n— Sie haben meine Plasma am Samstag zwei Kindern gegeben. Am Sonntag hatten beide wieder Fieber. Höher.\n\nВ субботу мою плазму влили двоим детям. В воскресенье у обоих опять был жар. Выше.' },
    ],
    actions: [
      { id: 'c25_al_sorry', label: 'Сказать: прости', minutes: 15, terminal: true, goto: 'c25_a_kitchen',
        text: '— Wofür? — Она закрывает глаза. — Ihr wart die Einzigen, die mich gefragt haben.\n\nЗа что? Вы единственные, кто меня спрашивал.', effects: [set25('al', 'sorry'), npc('c21_lea', 1), until25(10, 45)] },
      { id: 'c25_al_out', label: 'Спросить, хочет ли она отсюда уйти', when: not(leaExposed), minutes: 20, terminal: true, goto: 'c25_a_kitchen',
        text: '— Jeden Tag. — Она смотрит на пакет. — Aber dann verliert meine Mutter den Platz. Und Finn. Ich habe gerechnet. Ein halber Liter am Tag gegen ein Bett für zwei. Das ist ein guter Kurs.\n\nКаждый день. Но тогда мама потеряет место. И Финн. Я посчитала. Пол-литра в день против кровати на двоих. Хороший курс.', effects: [set25('al', 'out'), w25('lea_stays_for_family', true), until25(10, 50)] },
      { id: 'c25_al_work', label: 'Спросить, хорошо ли ей теперь', when: leaExposed, minutes: 15, terminal: true, goto: 'c25_a_kitchen',
        text: '— Gut? — Она почти смеётся. — Ich bin müde. Ich nähe zwölf Stunden. Aber ich nähe. Und keiner hängt mich an einen Schlauch.\n\nХорошо? Я устала. Шью по двенадцать часов. Но я шью. И никто не вешает меня на трубку.', effects: [set25('al', 'work'), npc('c21_lea', 2), until25(10, 45)] },
    ] }),

  A({ id: 'c25_a_kitchen', title: 'Столовая',
    text: [
      { text: 'В столовой дают перловку с тушёнкой. Ты садишься с краю.' },
      { when: kasiaHere25, text: 'Женщина на раздаче смотрит на тебя дольше, чем на других. Светлые волосы под косынкой, польский акцент.\n\n— Pan jest od niej? Z Barmbeku? — И сразу по-немецки: — Sie sind doch von ihr. Aus Barmbek. Sie hat mir von Ihnen erzählt. Kasia. Nowak.\n\nВы ведь от неё? Из Бармбека? Она мне про вас рассказывала. Кася. Новак.' },
      { when: not(kasiaHere25), text: 'За соседним столом двое солдат обсуждают пятнадцатое декабря: «Abzug». Отход. Один говорит — на Шверин, другой — на Ганновер. Оба не верят ни в то, ни в другое.' },
      { when: gerd, text: 'Ты вспоминаешь зал списков. «Brockmann, Gerd» и твою приписку рядом: «10.11, лестница. Болен».' },
      { text: 'Столовая устроена в бывшем спортзале, на полу ещё видна баскетбольная разметка. Солдаты едят быстро, не снимая курток, ложки стучат в одном ритме.' },
    ],
    actions: [
      { id: 'c25_ak_kasia', label: 'Поговорить с Касей', when: kasiaHere25, minutes: 30, terminal: true, goto: 'c25_a_kids',
        text: 'Кася ставит тебе двойную порцию и садится напротив, на минуту.\n\n— Tim ist hier. Mein Sohn. In der Kinderstation. Er hatte Plasma. Jetzt hat er wieder Fieber.\n\nТим здесь. Мой сын. В детской. Ему давали плазму. Теперь у него снова жар.\n\nОна встаёт раньше, чем ты успеваешь ответить. Её зовут на раздачу.', effects: [set25('ak', 'kasia'), w25('kasia_tim', true), { body: 'hunger', delta: -40 }, until25(11, 30)] },
      { id: 'c25_ak_eat', label: 'Поесть и послушать солдат', minutes: 25, terminal: true, goto: 'c25_a_kids',
        text: 'Перловка горячая. Солдаты за соседним столом переходят на шёпот, когда входит фельдфебель. Пятнадцатое декабря. Ты запоминаешь.', effects: [set25('ak', 'eat'), w25('army_leaves', true), { body: 'hunger', delta: -40 }, until25(11, 25)] },
      { id: 'c25_ak_lists', label: 'Пойти в зал списков', minutes: 40, terminal: true, goto: 'c25_a_kids',
        text: 'Стены зала списков обклеены до потолка. Новые листы поверх старых. Ты ищешь фамилии с хутора, с Бармбека, с Бухгольца. Находишь одну: «Weber, Merle — Arensburg — versorgt». Подруга {B.gen}. Обеспечена. Дата — двадцатое.', effects: [set25('ak', 'lists'), w25('merle_listed_20', true), until25(11, 40)] },
    ] }),

  A({ id: 'c25_a_kids', title: 'Детская',
    text: [
      { text: 'Сестра детской палаты ловит тебя в коридоре и ведёт за собой, не спрашивая. Восемь кроватей. Над каждой лист с температурой. Столбики после плазмы вниз, потом вверх, выше прежнего.' },
      { text: 'Девочка у окна приподнимается на локте.\n\n— Bist du von Ole? Er hat gesagt, einer kommt. Kommt er morgen wieder?\n\nТы от Оле? Он сказал, что кто-то приедет. Он завтра придёт?' },
      { text: 'Игрушек на тумбочках больше, чем детей: их приносят сёстры из дома.' },
    ],
    actions: [
      { id: 'c25_ak2_yes', label: 'Сказать: придёт', minutes: 25, terminal: true, goto: 'c25_a_lists',
        text: 'Девочка ложится обратно и закрывает глаза, довольная. Сестра смотрит на тебя поверх её головы долго и ничего не говорит. Потом отворачивается к окну.', effects: [set25('ak2', 'yes'), w25('girl_promised', true), until25(12, 30)] },
      { id: 'c25_ak2_truth', label: 'Сказать: Оле устал. Ему надо домой', minutes: 25, terminal: true, goto: 'c25_a_lists',
        text: 'Девочка думает.\n\n— Dann soll er nach Hause. Ich bin auch müde. — Она поворачивается на бок. — Sag ihm, er soll sein Pferd grüßen.\n\nТогда пусть едет домой. Я тоже устала. Скажи, чтобы передал привет своей лошади.\n\nУ Людеманов нет лошади. Ты не поправляешь.', effects: [set25('ak2', 'truth'), until25(12, 30)] },
      { id: 'c25_ak2_nurse', label: 'Спросить сестру, сколько у неё ещё плазмы', minutes: 20, terminal: true, goto: 'c25_a_lists',
        text: '— Bis Donnerstag. Sechs Beutel. Acht Kinder. — Сестра поправляет девочке одеяло. — Ich habe den Plan geschrieben. Ich schreibe auch den nächsten. Wer zuerst.\n\nДо четверга. Шесть пакетов. Восемь детей. План писала я. И следующий напишу я. Кому первым.', effects: [set25('ak2', 'nurse'), { body: 'stress', delta: 2 }, until25(12, 20)] },
    ] }),

  A({ id: 'c25_a_ole2', title: 'Двор казармы', ambient: yard,
    text: [
      { text: 'После обеда Оле разрешают выйти во двор. Он идёт медленно, держась за стену, потом за тебя. Снег скрипит. Оле щурится на белое.' },
      { text: '— Wie geht es dem Hof? Der Pumpe? Den Hühnern? Nina?\n\nКак хутор? Насос? Куры? Нина?' },
      { text: 'Двор расчищен лопатами до асфальта. Оле останавливается каждые десять шагов и делает вид, что разглядывает ворон на крыше.' },
    ],
    actions: [
      { id: 'c25_ao2_all', label: 'Рассказать всё по порядку: дом, люди, Брандт', minutes: 60, terminal: true, goto: 'c25_a_trade', ambientDuring: yard,
        text: 'Ты рассказываешь долго. Оле слушает, кивает, иногда переспрашивает: какая курица? где поставили крест? кто такой Маркус? На Брандте он останавливается.\n\n— Der Brandt hat Vater beim Schützenfest unter den Tisch getrunken. Zweimal. Er ist kein schlechter Mensch. Er ist ein Mensch, der Angst hat.\n\nБрандт дважды перепил отца на празднике стрелков. Он не плохой человек. Он человек, которому страшно.', effects: [set25('ao2', 'all'), npc('ole', 2), until25(14, 30)] },
      { id: 'c25_ao2_nina', label: 'Рассказать про Нину', minutes: 40, terminal: true, goto: 'c25_a_trade', ambientDuring: yard,
        text: 'Про то, как она водит Corsa. Как решает задачи для себя. Как перевязывает лучше тебя. Оле смеётся, впервые за день, и закашливается.\n\n— Die wird mal Ärztin. Oder Bürgermeisterin. Oder beides.\n\nОна станет врачом. Или бургомистром. Или и тем и другим.', effects: [set25('ao2', 'nina'), npc('ole', 1), until25(14, 10)] },
      { id: 'c25_ao2_quiet', label: 'Просто ходить рядом молча', minutes: 40, terminal: true, goto: 'c25_a_trade', ambientDuring: yard,
        text: 'Вы делаете три круга по двору. Оле дышит тяжело, но идёт сам. На третьем круге он останавливается у ворот прачечной и смотрит на поле.\n\n— Danke, dass du nichts sagst. Hier reden alle die ganze Zeit.\n\nСпасибо, что молчишь. Здесь все всё время говорят.', effects: [set25('ao2', 'quiet'), npc('ole', 1), until25(14, 10)] },
    ] }),

  A({ id: 'c25_a_yard', title: 'Перед дорогой', ambient: yard,
    text: [
      { text: 'В три Вессель сигналит у шлагбаума. Мешки с чистым бельём уже в фургоне.' },
      { when: henrikeLue25, text: 'Хенрике выходит к шлагбауму без пальто, с листком в руке. Сложенным вчетверо.\n\n— Für zu Hause. Lies es da. Nicht hier.\n\nДля дома. Прочитаешь там. Не здесь.' },
      { when: oleAliveVisible, text: 'В окне донорского блока стоит Оле. Поднимает руку. Не машет. Просто держит ладонь на стекле.' },
      { text: 'Небо низкое, серое, и уже темнеет, хотя только три.' },
    ],
    actions: [
      { id: 'c25_ay_go', label: 'Сесть в фургон', minutes: 10, terminal: true, goto: 'c25_a_back',
        text: 'Фургон трогается. В зеркале шлагбаум опускается.', effects: [set25('ay', 'go'), { if: henrikeLue25, then: [{ give: 'c25_henrike_letter' }] }, until25(15, 15)] },
      { id: 'c25_ay_wave', label: 'Поднять руку в ответ', minutes: 10, terminal: true, goto: 'c25_a_back',
        text: 'Ты поднимаешь ладонь. Оле кивает и отходит от окна. Фургон трогается.', effects: [set25('ay', 'wave'), npc('ole', 1), { if: henrikeLue25, then: [{ give: 'c25_henrike_letter' }] }, until25(15, 15)] },
      { id: 'c25_ay2_hug', label: 'Вернуться к Хенрике и обнять её', minutes: 10, terminal: true, goto: 'c25_a_back', ambientDuring: snow25,
        text: 'Ты возвращаешься от фургона. Хенрике стоит прямо, руки по швам. Когда ты её обнимаешь, она не обнимает в ответ. Но и не отстраняется. Потом говорит тебе в плечо: «Geh. Er hupt». Иди. Он сигналит.', effects: [set25('ay2', 'hug'), npc('henrike', 2, 'c25_hug'), until25(15, 0)] },
    ] }),

  A({ id: 'c25_a_back', title: 'Обратно', ambient: van,
    text: [
      { text: 'Обратно Вессель едет молча. Снег идёт крупный, мокрый, дворники не справляются.' },
      { text: 'У Винзена он останавливается без причины, глушит мотор и сидит минуту, положив руки на руль.\n\n— Meine Frau war Donorin. In Buchholz. Station vier. — Он заводит мотор. — Erzähl das keinem.\n\nМоя жена была донором. В Бухгольце. Четвёртое отделение. Никому не рассказывай.' },
      { text: 'Дворники скрипят. Печка в кабине гонит тёплый воздух только в ноги: колени горят, уши мёрзнут.' },
      { text: 'Мимо проплывают тёмные деревни. Ни одного окна со светом.' },
    ],
    actions: [
      { id: 'c25_ab_ask', label: 'Спросить, где она сейчас', minutes: 80, terminal: true, goto: 'c25_y_a_post',
        text: '— Weiß ich nicht. — Вессель смотрит на дорогу. — Am zwölften haben sie die Station geräumt. Mit Bussen. Wohin, hat keiner gesagt.\n\nНе знаю. Двенадцатого отделение вывезли. Автобусами. Куда — никто не сказал.\n\nДо хутора вы больше не разговариваете.', effects: [set25('ab', 'ask'), w25('wessel_wife', true), { move: 'hof_luedemann' }, until25(16, 0)] },
      { id: 'c25_ab_quiet', label: 'Промолчать', minutes: 80, terminal: true, goto: 'c25_y_a_post',
        text: 'Ты молчишь. Он, кажется, благодарен. У поворота на хутор он высаживает тебя и машет, не оборачиваясь.', effects: [set25('ab', 'quiet'), { move: 'hof_luedemann' }, until25(16, 0)] },
      { id: 'c25_ab2_tell', label: 'Рассказать ему, что знаешь про четвёртое отделение', minutes: 20, terminal: true, goto: 'c25_y_a_post',
        text: 'Ты рассказываешь про лист с полями, исписанными от руки, про «212», про то, что плазма только продлевает. Вессель слушает и не перебивает. На повороте у Винзена он говорит, не глядя:\n\n— Dann war sie umsonst dort.\n\nЗначит, она была там зря.\n\nИ больше ничего до самого Паттензена.', effects: [set25('ab2', 'tell'), w25('wessel_knows', true), until25(16, 40)] },
    ] }),
];

