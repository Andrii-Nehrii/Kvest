import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { brothersCome, oleHome33 } from './point33';
import { east36, lea36, tobias36 } from './point36';
import { tractorRuns } from './point38';
import { S39, army39, frost39, merleFarm39, parents39, set39, until39, w39 } from './point39';

// Участок 39, линия A. Пятница: дела по двору, Тобиас прощается, Уве (или Дениз) и зарядка без генератора, вмёрзший у камышей,
// Лея и Берген, соседи перед советом, Corsa; вечер (если не на дежурстве). Суббота: подготовка к складу в понедельник, Зеве перед
// оттепелью, Брандт и совет, сборы (если уходите с армией) или последняя колонна.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S39({ ...scene, for: 'any', chapter: 'ch3' });
const genLost: Cond = v('w.c37_lost', 'generator');
const leaPromise: Cond = all(lea36, any(flag('w.c36_lea_promise'), flag('w.c36_lea_list')));

export const day39AScenes: Scene[] = [
  // ═════════════ Пятница ═════════════
  X({ id: 'c39_a_chores', title: 'Двор', camp: yard14, ambient: frost39,
    text: [
      { text: 'Рук на хуторе стало больше. Дел — тоже. Дрова, вода, хлев, снег с крыши сарая, который просел за неделю.' },
      { when: parents39, text: 'Уве уже на крыше сарая с лопатой. Ему пятьдесят восемь, и он ни у кого не спрашивал.' },
    ],
    actions: [
      { id: 'c39_ac_roof', label: 'Лезть на крышу сарая: снег сбросить', minutes: 60, activity: 'heavy', terminal: true, goto: 'c39_a_tobias', ambientDuring: frost39,
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 3, uses: ['mobility'] },
            text: 'Лестница, крыша, лопата. Снег пластами уходит вниз и ухает во дворе. Через час крыша чёрная, стропила не трещат. Сверху виден весь хутор и дорога до Йестебурга.',
            effects: [set39('ac', 'roof'), { body: 'fatigue', delta: 10 }, until39(41, 9, 0)] },
          { id: 'slide',
            text: 'Пласт снега уходит вместе с тобой. Ты едешь к краю, цепляешься за конёк одной рукой, ноги висят. Кто-то снизу кричит. Ты подтягиваешься. Ладонь ободрана о жесть до крови.',
            effects: [set39('ac', 'slide'), { injure: 'scratch', site: 'hands', severity: 1, bleeding: 1 }, { body: 'stress', delta: 7 }, until39(41, 9, 0)] },
        ], risky: true },
      { id: 'c39_ac_water', label: 'Вода и дрова: самое скучное и самое нужное', minutes: 60, activity: 'moderate', terminal: true, goto: 'c39_a_tobias', ambientDuring: frost39,
        text: 'Ведро за ведром в бочку на кухне. Охапка за охапкой к печке. Через час бочка полная, ящик для дров тоже. Хенрике кивает: вот это работа.', effects: [set39('ac', 'water'), { body: 'fatigue', delta: 6 }, npc('henrike', 1), until39(41, 9, 0)] },
      { id: 'c39_ac_plan', label: 'Расписать на листке, кто что делает каждый день', minutes: 45, terminal: true, goto: 'c39_a_tobias',
        text: 'Лист на двери кухни: дрова, вода, хлев, кухня, дежурство. Против каждого — имена. Кто-то ворчит, кто-то записывается сам. К обеду лист исписан.', effects: [set39('ac', 'plan'), w39('duty_list', true), until39(41, 9, 0)] },
    ] }),

  X({ id: 'c39_a_tobias', title: 'Тобиас', camp: yard14, ambient: frost39,
    text: [
      { when: tobias36, text: 'В девять у ворот «Вольф». Тобиас выходит без шапки, в куртке нараспашку. Глаза красные: не спал.' },
      { when: all(tobias36, army39), text: '— Montag Abend, zu mir. Dienstag, fünf Uhr, Tor. Zwei Plätze, wie gesagt. Ich wollte nur sehen, ob ihr es noch wollt.\n\nВ понедельник вечером — ко мне. Во вторник в пять — ворота. Два места, как сказано. Хотел только посмотреть, хотите ли вы ещё.' },
      { when: all(tobias36, not(army39)), text: '— Ich komme nicht mehr vorbei. Ab morgen packe ich. — Он протягивает руку. — Ich wollte mich verabschieden. Richtig. Nicht im Vorbeifahren.\n\nЯ больше не заеду. С завтрашнего дня собираюсь. Хотел попрощаться. По-настоящему. Не на ходу.' },
      { when: not(tobias36), text: 'В девять у ворот трактор Лукаса. Он привёз от Брандта бумагу: список дворов на совет в воскресенье. И новость: армия уходит из Люнебурга не во вторник, а начиная с понедельника вечера.' },
    ],
    actions: [
      { id: 'c39_at_hand', label: 'Пожать руку и поблагодарить', when: tobias36, minutes: 40, terminal: true, goto: 'c39_a_uwe', ambientDuring: frost39,
        text: 'Рукопожатие долгое. Тобиас говорит.\n\n— Ihr habt mir geholfen, Mensch zu bleiben. Das ist mehr, als ich euch gegeben habe.\n\nВы помогли мне остаться человеком. Это больше, чем я вам дал. Он уезжает, не оглядываясь.', effects: [set39('at', 'hand'), npc('c15_tobias', 2, 'c39_farewell'), until39(41, 10, 0)] },
      { id: 'c39_at_gift', label: 'Отдать ему что-нибудь на память: от хутора', when: tobias36, minutes: 40, terminal: true, goto: 'c39_a_uwe', ambientDuring: frost39,
        text: 'Хенрике выносит банку мёда, завёрнутую в газету. Тобиас держит её в руках, как гранату. Потом смеётся, впервые за всё время.\n\n— Für die Kaserne in Mölln. Die werden neidisch.\n\nДля казармы в Мёльне. Обзавидуются.', effects: [set39('at', 'gift'), npc('c15_tobias', 2), npc('henrike', 1), until39(41, 10, 0)] },
      { id: 'c39_at_ask', label: 'Спросить, что он оставит округу', when: tobias36, minutes: 40, terminal: true, goto: 'c39_a_uwe', ambientDuring: frost39,
        text: 'Тобиас перечисляет: склад — Брандту, две рации — пожарным, бензовоз — нет, бензовоз уходит. «Und meine Telefonnummer, die keiner anrufen kann». И мой номер, по которому никто не дозвонится. Он пишет его на твоей ладони. На всякий случай.', effects: [set39('at', 'ask'), w39('tobias_number', true), until39(41, 10, 0)] },
      { id: 'c39_at_lukas', label: 'Расспросить Лукаса', when: not(tobias36), minutes: 40, terminal: true, goto: 'c39_a_uwe', ambientDuring: frost39,
        text: 'Лукас рассказывает: склад в понедельник с двенадцати, по списку дворов. Брандт будет делить сам. «Wer nicht im Rat war, steht hinten». Кто не был на совете, стоит последним.', effects: [set39('at', 'lukas'), w39('council_matters', true), until39(41, 10, 0)] },
    ] }),

  X({ id: 'c39_a_uwe', title: 'Ток', camp: yard14, ambient: frost39,
    text: [
      { when: genLost, text: 'Без генератора заряжать телефоны нечем. Корса — только если жечь бензин.' },
      { when: all(genLost, parents39), text: 'Уве разглядывает синий велосипед Нины в сенях. «Ein Dynamo, ein Gleichrichter, ein altes Ladekabel. Dann tritt man und lädt». Динамо, выпрямитель, старый зарядный провод. Тогда крутишь педали и заряжаешь.' },
      { when: all(not(genLost), parents39), text: 'Уве обходит генератор Дениза кругом, щупает ремень, слушает мотор. «Der läuft zu fett. Frisst doppelt». Слишком богатая смесь. Жрёт вдвое.' },
      { when: not(parents39), text: 'Дениз или Оле возятся в сарае с тем, что осталось из инструмента. Хотят собрать что-нибудь, что даёт ток без солярки.' },
    ],
    actions: [
      { id: 'c39_au_build', label: 'Помогать собирать, держать, подавать', minutes: 60, terminal: true, goto: 'c39_a_ice',
        text: 'Час возни с проводами, изолентой и ключами. Ты держишь, тебе говорят «nicht so», ты держишь иначе. К концу что-то работает: лампочка мигает, когда крутишь. Это меньше, чем генератор, но больше, чем ничего.', effects: [set39('au', 'build'), w39('dynamo', true), { if: parents39, then: [{ npc: 'uwe', trust: 2 }] }, until39(41, 11, 0)] },
      { id: 'c39_au_learn', label: 'Попросить объяснить, как это работает', minutes: 60, terminal: true, goto: 'c39_a_ice',
        text: 'Объясняют медленно, с рисунком на доске гвоздём. Ты понимаешь половину. Но теперь, если сломается, ты знаешь, где искать. Это важнее.', effects: [set39('au', 'learn'), w39('dynamo', true), w39('a_knows_power', true), until39(41, 11, 0)] },
      { id: 'c39_au_skip', label: 'Оставить мастерам, заняться своим', minutes: 30, terminal: true, goto: 'c39_a_ice',
        text: 'Ты оставляешь их в сарае. Из-за двери слышны ругань и смех. К обеду, говорят, будет готово.', effects: [set39('au', 'skip'), w39('dynamo', true), until39(41, 10, 45)] },
    ] }),

  X({ id: 'c39_a_ice', title: 'Камыши', camp: yard14, safe: false, ambient: frost39,
    text: [
      { text: 'Ты идёшь к ручью. У камышей вмёрзший в лёд по пояс — тот самый, с инеем на ресницах. Стоит, как стоял.' },
      { when: oleHome33, text: 'Оле идёт за тобой с ломом. «Wenn es taut, kommt der raus. Besser jetzt». Когда растает, он выйдет. Лучше сейчас.' },
      { when: not(oleHome33), text: 'Хенрике сказала: весной оттает. Весна во вторник.' },
    ],
    actions: [
      { id: 'c39_ai_out', label: 'Вырубить его изо льда и зарыть в поле', minutes: 60, activity: 'heavy', risky: true, terminal: true, goto: 'c39_lunch', ambientDuring: frost39,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'endurance'], difficulty: 3, uses: ['mobility'] },
            text: 'Лом, лёд, снова лом. Он мёртв: твёрдый, как полено, мороз сделал своё. Вы вытаскиваете тело на берег, в поле. Земля мёрзлая, глубоко не выкопать. Снег, ветки, камни сверху. Хоть что-то.',
            effects: [set39('ai', 'out'), w39('reeds_cleared', true), { body: 'fatigue', delta: 10 }, until39(41, 12, 30)] },
          { id: 'ice',
            text: 'Лёд вокруг него тоньше, чем казалось: под ним родник. Ты проваливаешься по пояс. Ледяная вода выбивает дыхание. Тебя вытаскивают за ворот. Тело остаётся во льду. Ты бежишь домой, мокрый до пояса, и долго сидишь у печки, пока не перестают стучать зубы.',
            effects: [set39('ai', 'ice'), { body: 'stress', delta: 8 }, { body: 'fatigue', delta: 8 }, until39(41, 12, 30)] },
        ] },
      { id: 'c39_ai_mark', label: 'Оставить и поставить вешку: дежурным знать', minutes: 30, terminal: true, goto: 'c39_lunch', ambientDuring: frost39,
        text: 'Красная тряпка на палке у самой воды. Дежурные будут знать, куда смотреть, когда лёд пойдёт.', effects: [set39('ai', 'mark'), w39('reeds_marked', true), until39(41, 12, 0)] },
      { id: 'c39_ai_burn', label: 'Обложить хворостом и сжечь прямо во льду', minutes: 45, terminal: true, goto: 'c39_lunch', ambientDuring: frost39,
        text: 'Хворост, солярка или керосин, спичка. Дым чёрный и вонючий, лёд вокруг шипит. Когда огонь гаснет, во льду остаётся чёрная яма. Хенрике смотрит издали и крестится.', effects: [set39('ai', 'burn'), w39('reeds_cleared', true), until39(41, 12, 15)] },
    ] }),

  X({ id: 'c39_a_lea', title: 'Лея', camp: yard14, ambient: frost39,
    text: [
      { when: leaPromise, text: 'После обеда приходит Лея. В рюкзаке за спиной — всё её имущество, это видно. Она стоит у калитки.\n\n— Bergen. Ich kann nicht bis Frühjahr warten. Montag geht die Armee. Danach fährt keiner mehr irgendwohin.\n\nБерген. Я не могу ждать до весны. В понедельник уходит армия. Потом никто никуда не поедет.' },
      { when: all(lea36, not(leaPromise)), text: 'После обеда приходит Лея: принесла от Зандер бинты и мазь для стариков. Задерживается у калитки дольше, чем нужно.' },
      { when: not(lea36), text: 'После обеда к воротам подходит сосед с насыпи: его дочь просит молока для малышки. И спрашивает, правда ли в воскресенье совет у Брандта.' },
    ],
    actions: [
      { id: 'c39_al_wait', label: 'Уговорить подождать: после пятнадцатого вместе решим, как', when: leaPromise, minutes: 60, terminal: true, goto: 'c39_a_neighbors',
        text: 'Лея слушает. Потом снимает рюкзак и ставит его на снег. «Bis Mittwoch. Dann gehe ich. Mit euch oder allein». До среды. Потом ухожу. С вами или одна.', effects: [set39('al', 'wait'), w39('lea_date', 'wednesday'), npc('c21_lea', 1), until39(41, 14, 45)] },
      { id: 'c39_al_bike', label: 'Предложить ей велосипед Нины до Целле: восемьдесят километров', when: all(leaPromise, v('w.c36_nina_bike', 'farm')), minutes: 60, terminal: true, goto: 'c39_a_neighbors',
        text: 'Лея смотрит на синий велосипед, на тебя. «Das ist Ninas». Это Нинин. Ты говоришь: спросим. Нина, услышав, молчит минуту, потом кивает.\n\n— Пусть едет. Только вернёт.\n\nЛея обещает вернуть. Все знают, что не вернёт.', effects: [set39('al', 'bike'), w39('lea_bike', true), npc('c21_lea', 3, 'c39_got_bike'), npc('c7_nina', 1), until39(41, 14, 45)] },
      { id: 'c39_al_go', label: 'Сказать: если решила — иди. Дать еды на дорогу', when: leaPromise, minutes: 45, terminal: true, goto: 'c39_a_road',
        text: 'Хенрике заворачивает хлеб и сало. Лея берёт, не благодаря: так проще обеим. Она уходит по дороге на восток пешком. Ты смотришь, пока её не скрывает лес.', effects: [set39('al', 'go'), w39('lea_left', true), until39(41, 14, 30)] },
      { id: 'c39_al_tea', label: 'Позвать её в дом погреться', when: all(lea36, not(leaPromise)), minutes: 45, terminal: true, goto: 'c39_a_neighbors',
        text: 'Лея пьёт чай у печки и молчит. Потом говорит.\n\n— Mein Bruder hätte euch gemocht.\n\nМой брат бы вас полюбил. И уходит в пункт.', effects: [set39('al', 'tea'), npc('c21_lea', 1), until39(41, 14, 30)] },
      { id: 'c39_al_neighbor', label: 'Дать соседу молока и сказать про совет', when: not(lea36), minutes: 40, terminal: true, goto: 'c39_a_neighbors',
        text: 'Сосед берёт банку и кивает. «Sonntag. Ich komme». В воскресенье. Приду. У ворот оборачивается: «Und ihr?» А вы?', effects: [set39('al', 'neighbor'), until39(41, 14, 30)] },
    ] }),

  X({ id: 'c39_a_road', title: 'Развилка', location: 'c7_farm_lane', camp: yard14, safe: false, ambient: frost39,
    text: [
      { text: 'Ты провожаешь Лею до развилки за Йестебургом. Дальше дорога на восток, на Ханштедт, потом на Целле. Восемьдесят километров по снегу, который во вторник начнёт таять.' },
      { text: 'У развилки Лея останавливается и достаёт из кармана фотографию: рыжий кот на подоконнике.\n\n— Moses. Falls du nach Hannover kommst. Er beißt.\n\nМозес. Если попадёшь в Ганновер. Он кусается.' },
    ],
    actions: [
      { id: 'c39_ar_photo', label: 'Взять фотографию', minutes: 60, terminal: true, goto: 'c39_a_corsa', ambientDuring: frost39,
        text: 'Ты прячешь фотографию во внутренний карман. Лея кивает и уходит, не оглядываясь, ровным шагом. Ты смотришь, пока дорога не поворачивает за лес.', effects: [set39('ar', 'photo'), w39('moses_photo', true), until39(41, 15, 45)] },
      { id: 'c39_ar_knife', label: 'Отдать ей свой нож: в дороге нужнее', minutes: 60, terminal: true, goto: 'c39_a_corsa', ambientDuring: frost39,
        text: 'Лея взвешивает нож на ладони, проверяет лезвие ногтем. «Danke. Ich bringe ihn zurück». Спасибо. Я его верну. Вы оба знаете, что это значит: она собирается вернуться.', effects: [set39('ar', 'knife'), w39('lea_knife', true), npc('c21_lea', 2), until39(41, 15, 45)] },
      { id: 'c39_ar_walk', label: 'Пройти с ней ещё до Ханштедта', minutes: 75, activity: 'moderate', terminal: true, goto: 'c39_a_corsa', ambientDuring: frost39,
        text: 'Ещё шесть километров вдвоём. Вы почти не говорите. У Ханштедта она останавливается и толкает тебя в плечо: иди обратно, темнеет. Ты возвращаешься уже в сумерках.', effects: [set39('ar', 'walk'), { body: 'fatigue', delta: 8 }, npc('c21_lea', 2), until39(41, 16, 15)] },
    ] }),

  X({ id: 'c39_a_neighbors', title: 'Соседи', camp: yard14, ambient: frost39,
    text: [
      { text: 'Брандт хочет на совете знать, что думают дворы. Ты обходишь соседей у насыпи: три двора, полчаса пешком.' },
      { when: v('w.c25_truth', 'all'), text: 'Про плазму и списки здесь знают все: с ноября. Кто-то из-за этого вам до сих пор не здоровается.' },
      { text: 'У Ханзенов спорят: одни хотят общую стражу, другие говорят, что каждый двор сам за себя. У соседа с дочерью боятся Брандта больше, чем впадины.' },
    ],
    actions: [
      { id: 'c39_an_guard', label: 'Уговаривать за общую стражу: по очереди, все дворы', minutes: 60, terminal: true, goto: 'c39_a_corsa', ambientDuring: frost39,
        text: 'Ты говоришь про ночь у Зеве, про тень на льду, про то, что один двор не услышит другой. Двое кивают. Ханзен молчит. В воскресенье посмотрим.', effects: [set39('an', 'guard'), w39('canvass', 'guard'), until39(41, 15, 45)] },
      { id: 'c39_an_listen', label: 'Только слушать: что люди думают сами', minutes: 60, terminal: true, goto: 'c39_a_corsa', ambientDuring: frost39,
        text: 'Ты слушаешь. Люди говорят охотно, когда их не уговаривают. Боятся всего: впадины, голода, Брандта, друг друга. Ты возвращаешься с полной головой чужих страхов.', effects: [set39('an', 'listen'), w39('canvass', 'listen'), until39(41, 15, 45)] },
      { id: 'c39_an_brandt', label: 'Говорить за Брандта: без него развалимся', minutes: 60, terminal: true, goto: 'c39_a_corsa', ambientDuring: frost39,
        text: 'Ты говоришь, что Брандт хотя бы что-то делает. Соседи смотрят на тебя по-разному. У Ханзенов тебе не предлагают чаю.', effects: [set39('an', 'brandt'), w39('canvass', 'brandt'), until39(41, 15, 45)] },
    ] }),

  X({ id: 'c39_a_corsa', title: 'Машина', camp: yard14, ambient: frost39,
    text: [
      { text: 'Corsa под навесом. Во вторник оттепель, дорога раскиснет. Если что-то случится, машина — единственное, что увезёт быстро.' },
      { when: { has: 'can_petrol_10' }, text: 'Канистра бензина стоит в сарае.' },
    ],
    actions: [
      { id: 'c39_aco_fill', label: 'Залить бензин из канистры в бак', when: { has: 'can_petrol_10' }, minutes: 30, terminal: true, goto: 'c39_dusk', ambientDuring: frost39,
        text: 'Воронка, канистра, бульканье. Стрелка ползёт вверх. Теперь до Йестебурга и обратно хватит не раз.', effects: [set39('aco', 'fill'), { refuel: 'opel_corsa', liters: 8, fromCan: 'can_petrol_10' }, until39(41, 16, 30)] },
      { id: 'c39_aco_turn', label: 'Развернуть машину носом к воротам: чтобы выехать сразу', minutes: 30, terminal: true, goto: 'c39_dusk', ambientDuring: frost39,
        text: 'Задним ходом под навес, носом к воротам. Ключ на гвоздь у двери, где все знают. Если ночью понадобится — без возни.', effects: [set39('aco', 'turn'), w39('car_ready', true), until39(41, 16, 30)] },
      { id: 'c39_aco_leave', label: 'Оставить как есть', minutes: 20, terminal: true, goto: 'c39_dusk',
        text: 'Машина стоит, как стояла. Ты идёшь в дом: темнеет.', effects: [set39('aco', 'leave'), until39(41, 16, 20)] },
    ] }),

  X({ id: 'c39_a_evening', title: 'Пятничный вечер', camp: kitchen14,
    text: [
      { when: merleFarm39, text: 'Мерле сидит у печки с блокнотом и рисует кухню: Хенрике у плиты, кота, которого нет, окно. Ты садишься рядом. Вы почти не знакомы.' },
      { when: all(not(merleFarm39), parents39), text: 'Уве сидит у окна с приёмником и крутит ручку настройки, медленно, как сейф открывает.' },
      { when: all(not(merleFarm39), not(parents39)), text: 'Вечер. Кухня. Все разошлись, у печки только ты и Хенрике со штопкой.' },
    ],
    actions: [
      { id: 'c39_ae_talk', label: 'Поговорить: кто ты, кто я', minutes: 90, terminal: true, goto: 'c39_a_late',
        text: 'Разговор идёт медленно, потом быстрее. Про Бухгольц, про Бармбек, про то, где вы были утром десятого ноября. К полуночи вы знаете друг о друге больше, чем за месяц соседства.', effects: [set39('ae', 'talk'), { if: merleFarm39, then: [{ npc: 'merle', trust: 2 }] }, until39(41, 21, 30)] },
      { id: 'c39_ae_radio', label: 'Слушать с Уве эфир: вдруг кто-то поймается', when: parents39, minutes: 90, terminal: true, goto: 'c39_a_late',
        text: 'Треск, свист, обрывки. Голландская музыка. Потом мужской голос по-английски, медленно: «…this is Toronto calling…». Уве записывает частоту. Может, это Томас. Может, нет.', effects: [set39('ae', 'radio'), w39('toronto_freq', true), until39(41, 21, 30)] },
      { id: 'c39_ae_sleep', label: 'Лечь пораньше', minutes: 60, terminal: true, goto: 'c39_a_late',
        text: 'Ты ложишься в девять и спишь без снов до утра.', effects: [set39('ae', 'sleep'), { body: 'fatigue', delta: -8 }, until39(41, 21, 30)] },
    ] }),

  X({ id: 'c39_a_late', title: 'Перед сном', camp: house14,
    text: [
      { text: 'Половина десятого. Ты выходишь во двор перед сном. Тихо. Ветер сменился на западный, сырой. С крыши над крыльцом капает: одна капля, другая.' },
      { when: merleFarm39, text: 'В окне чердака горит свеча: Мерле не спит. Колет вечернюю дозу, наверное.' },
    ],
    actions: [
      { id: 'c39_a_late_gate', label: 'Проверить ворота и тропу к ручью', minutes: 30, terminal: true, goto: 'c39_sat', ambientDuring: frost39,
        text: 'Засов, калитка, проволока с банками. Всё на месте. У ручья тихо. Ты стоишь минуту, слушаешь капель, и идёшь спать.', effects: [{ set: '$.c39_late', value: 'gate' }, until39(42, 8, 0, true)] },
      { id: 'c39_a_late_drip', label: 'Постоять и послушать капель', minutes: 30, terminal: true, goto: 'c39_sat', ambientDuring: frost39,
        text: 'Кап. Кап. Кап. Звук весны в середине декабря. Он не радует. Ты идёшь в дом и долго не можешь уснуть.', effects: [{ set: '$.c39_late', value: 'drip' }, { body: 'stress', delta: 2 }, until39(42, 8, 0, true)] },
      { id: 'c39_a_late_bed', label: 'Сразу в постель', minutes: 20, terminal: true, goto: 'c39_sat',
        text: 'Ты возвращаешься в тепло и засыпаешь, едва коснувшись подушки.', effects: [{ set: '$.c39_late', value: 'bed' }, { body: 'fatigue', delta: -4 }, until39(42, 8, 0, true)] },
    ] }),

  // ═════════════ Суббота ═════════════
  X({ id: 'c39_a_sat', title: 'К понедельнику', camp: yard14, ambient: frost39,
    text: [
      { text: 'В понедельник склад казармы. Брандт делит по дворам, но везти своё каждый будет сам. Тридцать километров туда и обратно, по снегу, который начнёт таять.' },
      { when: tractorRuns, text: 'Трактор с прицепом — это много. Солярки хватит на один такой рейс.' },
      { when: all(flag('w.c16_tractor'), not(tractorRuns)), text: 'Трактор стоит: то в кювете с той морозной ночи, то без солярки. На него в понедельник не рассчитывать.' },
    ],
    actions: [
      { id: 'c39_as_tractor', label: 'Готовить трактор и прицеп: борта, цепи, брезент', when: tractorRuns, minutes: 75, activity: 'moderate', terminal: true, goto: 'c39_a_seeve', ambientDuring: frost39,
        text: 'Цепи на колёса, борта на прицеп, брезент поверх. Ты лежишь под прицепом на снегу и затягиваешь болты. Если солярки хватит, в понедельник увезёте втрое больше, чем на машине.', effects: [set39('as', 'tractor'), w39('tractor_ready', true), { body: 'fatigue', delta: 6 }, until39(42, 10, 30)] },
      { id: 'c39_as_sled', label: 'Сколотить большие сани: тянуть за машиной или руками', minutes: 75, activity: 'moderate', terminal: true, goto: 'c39_a_seeve', ambientDuring: frost39,
        text: 'Две доски от старых ворот, полозья из жердей, верёвка. Сани выходят тяжёлые, но крепкие. Хенрике говорит: её отец возил на таких молоко на станцию.', effects: [set39('as', 'sled'), w39('big_sled', true), { body: 'fatigue', delta: 6 }, until39(42, 10, 30)] },
      { id: 'c39_as_list', label: 'Составить список: что брать со склада в первую очередь', minutes: 60, terminal: true, goto: 'c39_a_seeve',
        text: 'Мука, жир, соль, консервы, свечи, лекарства. Ты пишешь в столбик, Хенрике вычёркивает лишнее и дописывает «Salz» дважды. Соль. Без соли зимой никак.', effects: [set39('as', 'list'), w39('depot_list', true), until39(42, 10, 30)] },
    ] }),

  X({ id: 'c39_a_seeve', title: 'Перед оттепелью', camp: yard14, safe: false, ambient: frost39,
    text: [
      { text: 'Хенрике сказала утром: когда тает, они просыпаются. Ты идёшь посмотреть на Зеве глазами того, кто знает, что во вторник лёд пойдёт.' },
      { text: 'Тропа от ручья к сараю. Окна хлева низко, рамы старые. Курятник — фанера.' },
    ],
    actions: [
      { id: 'c39_ase_boards', label: 'Забить окна хлева досками', minutes: 75, activity: 'heavy', terminal: true, goto: 'c39_lunch2', ambientDuring: frost39,
        text: 'Доски от старого забора, гвозди, молоток. Корова мычит внутри: темно. Ты оставляешь щель наверху для воздуха. Теперь в хлев можно войти только через дверь.', effects: [set39('ase', 'boards'), w39('barn_boarded', true), { body: 'fatigue', delta: 8 }, until39(42, 12, 30)] },
      { id: 'c39_ase_fence', label: 'Укрепить забор со стороны ручья', minutes: 75, activity: 'heavy', risky: true, terminal: true, goto: 'c39_lunch2', ambientDuring: frost39,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'technical'], difficulty: 3, uses: ['mobility'] },
            text: 'Столбы в мёрзлую землю не вбить, ты подпираешь их камнями и связываешь проволокой. Сетка от старого курятника поверх. Забор выглядит смешно, но держит, когда ты толкаешь плечом.',
            effects: [set39('ase', 'fence'), w39('fence_up', true), { body: 'fatigue', delta: 8 }, until39(42, 12, 30)] },
          { id: 'cut',
            text: 'Проволока выскакивает из рук и хлещет по лицу. Щека рассечена, кровь на снегу. Ты доделываешь, прижимая снег к щеке, но забор выходит кривым.',
            effects: [set39('ase', 'cut'), { injure: 'cut', site: 'head', severity: 1, bleeding: 1 }, { body: 'stress', delta: 5 }, w39('fence_up', true), until39(42, 12, 30)] },
        ] },
      { id: 'c39_ase_path', label: 'Посыпать тропу золой и поставить ещё одну вешку', minutes: 45, terminal: true, goto: 'c39_lunch2', ambientDuring: frost39,
        text: 'Зола на тропе — чтобы в темноте видеть след, если кто-то пройдёт. Вешка у ручья — чтобы видеть с крыльца, где вода. Мелочи. Из них всё и складывается.', effects: [set39('ase', 'path'), w39('path_ash', true), until39(42, 12, 0)] },
    ] }),

  X({ id: 'c39_a_council', title: 'Брандт', camp: yard14, ambient: frost39,
    text: [
      { text: 'После обеда к воротам приезжает Брандт на джипе пожарной части. Не выходит: опускает стекло.' },
      { when: v('w.c26_brandt', 'ally'), text: 'Он кивает тебе, как кивают своим. Вы давно по одну сторону.' },
      { when: v('w.c26_brandt', 'hostile'), text: 'Он смотрит на тебя без тепла. Между вами всё ещё ноябрь. Но он приехал сам.' },
      { when: flag('w.c34_brandt_owes'), text: 'Брандт помнит, что должен {partner.dat}. Это видно по тому, что он вообще остановился.' },
      { text: '— Morgen nach dem Gottesdienst. Ich will wissen, wo ihr steht. Gemeinsame Wache, jeder für sich, oder einer sagt, wo es langgeht. Ich sage dir ehrlich: ich will der eine sein.\n\nЗавтра после службы. Я хочу знать, где вы. Общая стража, каждый сам по себе, или один говорит, куда идти. Скажу честно: я хочу быть этим одним.' },
    ],
    actions: [
      { id: 'c39_aco2_guard', label: 'Сказать: общая стража, но решаем вместе', minutes: 45, terminal: true, goto: 'c39_a_army', ambientDuring: frost39,
        text: 'Брандт кивает медленно. «Gemeinsam ist langsam». Вместе — медленно. Потом пожимает плечами.\n\n— Aber vielleicht richtig.\n\nНо, может, правильно. Стекло поднимается.', effects: [set39('aco2', 'guard'), w39('told_brandt', 'guard'), until39(42, 14, 45)] },
      { id: 'c39_aco2_brandt', label: 'Сказать: пусть командует он, кто-то должен', minutes: 45, terminal: true, goto: 'c39_a_army', ambientDuring: frost39,
        text: 'Брандт смотрит на тебя долго. «Danke. Das sagen nicht viele». Спасибо. Немногие так говорят. Ты не уверен{m:|а}, что сказал{m:|а} правильно. Но он уезжает довольный.', effects: [set39('aco2', 'brandt'), w39('told_brandt', 'brandt'), until39(42, 14, 45)] },
      { id: 'c39_aco2_yards', label: 'Сказать: каждый двор за себя, сигналы — общие', minutes: 45, terminal: true, goto: 'c39_a_army', ambientDuring: frost39,
        text: '— Dann sterben wir einzeln, — говорит Брандт без злости. Тогда умирать будем поодиночке. — Na gut. Morgen.\n\nНу ладно. Завтра.', effects: [set39('aco2', 'yards'), w39('told_brandt', 'yards'), until39(42, 14, 45)] },
    ] }),

  X({ id: 'c39_a_army', title: 'Последнее', camp: kitchen14,
    text: [
      { when: army39, text: 'Во вторник в пять — ворота казармы. Два места. Багаж до десяти килограммов. Ты стоишь над рюкзаком и не можешь решить, что положить первым.' },
      { when: all(not(army39), east36('give')), text: 'Эва, если едет, в понедельник вечером к Тобиасу. Ты помогаешь ей с узлом.' },
      { when: all(not(army39), not(east36('give'))), text: 'По дороге идёт ещё одна армейская колонна. Ты выходишь к воротам, и солдат из последнего грузовика машет тебе рукой. Ты машешь в ответ.' },
    ],
    actions: [
      { id: 'c39_aa_pack', label: 'Собрать десять килограммов самого нужного', when: army39, minutes: 60, terminal: true, goto: 'c39_radio',
        text: 'Документы, тёплое, нож, аптечка, фотографии. Десять килограммов — это мало. Всё остальное остаётся Хенрике. Ты не говоришь ей этого вслух.', effects: [set39('aa', 'pack'), w39('army_packed', true), until39(42, 16, 0)] },
      { id: 'c39_aa_doubt', label: 'Сесть рядом с рюкзаком и не собирать', when: army39, minutes: 60, terminal: true, goto: 'c39_radio',
        text: 'Ты сидишь и смотришь на рюкзак. За окном капает. Хенрике проходит мимо двери и не заходит.', effects: [set39('aa', 'doubt'), { body: 'stress', delta: 5 }, until39(42, 16, 0)] },
      { id: 'c39_aa_eva', label: 'Помочь Эве', when: all(not(army39), east36('give')), minutes: 60, terminal: true, goto: 'c39_radio',
        text: 'Узел, ещё узел. Эва складывает фотографию Хельмута лицом вниз, между кофтами. Говорит: «Er hätte gesagt: fahr». Он бы сказал: поезжай.', effects: [set39('aa', 'eva'), { if: { npc: 'c8_eva', alive: true }, then: [{ npc: 'c8_eva', trust: 1 }] }, until39(42, 16, 0)] },
      { id: 'c39_aa_wave', label: 'Помахать колонне и вернуться к делам', when: all(not(army39), not(east36('give'))), minutes: 45, terminal: true, goto: 'c39_radio', ambientDuring: frost39,
        text: 'Колонна уходит. Ты возвращаешься во двор. Корова, дрова, вода. Армия уходит. Хутор остаётся.', effects: [set39('aa', 'wave'), until39(42, 16, 0)] },
      { id: 'c39_aa_brothers', label: 'Помочь Денизу с фургоном к понедельнику', when: all(not(army39), not(east36('give')), brothersCome), minutes: 60, terminal: true, goto: 'c39_radio',
        text: 'Фургон Дениза капризничает на морозе. Вы час возитесь со свечами и аккумулятором. В конце мотор заводится с первого раза. Дениз хлопает по капоту: «Montag. Lager». Понедельник. Склад.', effects: [set39('aa', 'brothers'), w39('van_ready', true), until39(42, 16, 0)] },
    ] }),
];

