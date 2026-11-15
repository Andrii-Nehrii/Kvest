import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { S28, flare28, nightFacts, oleDead, set28, snow28, timColony, timDied, timWard, until28, w28 } from './point28';

// Участок 28, линия B: ночь (кто сделал последнее — B выбирает, как это помнит), утро с Касей, похороны (общая сцена),
// куда теперь Касе, Хенрике на кухне.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S28({ ...scene, for: 'any', chapter: 'ch3' });
const morphine: Cond = { has: 'c27_morphine' };
const afterNight = [{ id: 'd', when: timDied, goto: 'c28_b_wash' }, { id: 'w', goto: 'c28_b_empty' }];

export const day28BScenes: Scene[] = [
  B({ id: 'c28_b_night', title: 'Ночь', camp: kitchen14, onEnter: nightFacts,
    text: [
      { when: all(timDied, timColony), text: 'Ночь в домике Уте в колонии. Буржуйка, свеча, Кася на полу у лежанки. Уте вяжет в углу. Ты сидишь у двери.' },
      { when: all(timDied, not(timColony)), text: 'Ночь у постели Тима. Свеча. Кася на полу у изголовья. Ты у двери.' },
      { when: timDied, text: 'Около трёх он перестаёт метаться. Дышит часто и мелко. Потом реже. Потом Кася поднимает на тебя глаза. Он ещё дышит. Но это уже не он: глаза открыты и смотрят на свечу, как те, у лесополосы, смотрят на дорогу.' },
      { when: timDied, text: 'Кася просила: не армия. Ты помнишь, как это было. И никогда не будешь рассказывать подробно.' },
      { when: timWard, text: 'Вечером, в десять, Кася вынесла Тима к «Вольфу» Тобиаса сама. Тим её ещё узнавал. Он помахал тебе из одеяла. Пальцами, не поднимая руки.' },
      { when: timWard, text: 'Ночью ты не спишь. Лежишь и смотришь в потолок. В швейной комнате пусто.' },
    ],
    actions: [
      { id: 'c28_bn_kasia', label: 'Это сделала Кася. Ты {m:держал|держала} её за плечи', when: timDied, minutes: 60, terminal: true, outcomes: afterNight,
        text: 'Кася делает это сама. Ты держишь её за плечи и не смотришь. Потом она долго сидит, положив ладонь ему на лоб. Потом говорит: «Teraz śpi». Теперь он спит. И ложится рядом с ним на пол.', effects: [set28('bn', 'kasia'), w28('tim_end', 'kasia'), until28(5, 30)] },
      { id: 'c28_bn_morphine', label: 'Ты {m:дал|дала} ему обе ампулы, раньше, пока он ещё был собой', when: all(timDied, morphine), minutes: 60, terminal: true, outcomes: afterNight,
        text: 'Вечером, когда он ещё узнавал Касю, ты {m:сделал|сделала} то, о чём Лея сказала «не обе». Кася держала его руку. Он уснул с гармошкой в кулаке. Дальше было тихо. До утра он так и не проснулся.', effects: [set28('bn', 'morphine'), w28('tim_end', 'morphine'), { take: 'c27_morphine', qty: 2 }, { body: 'stress', delta: 5 }, until28(5, 30)] },
      { id: 'c28_bn_tobias', label: 'Ты {m:выпустил|выпустила} ракету. Тобиас приехал через двадцать минут', when: all(timDied, flare28), minutes: 60, terminal: true, outcomes: afterNight,
        text: 'Красный свет над хутором. Через двадцать минут «Вольф» без фар. Тобиас входит, снимает шапку. Просит Касю выйти. Кася не выходит. Тогда он просит тебя увести её. Ты уводишь. Выстрела почти не слышно: он что-то подложил.', effects: [set28('bn', 'tobias'), w28('tim_end', 'tobias'), npc('c15_tobias', 2), until28(5, 30)] },
      { id: 'c28_bn_ute', label: 'Это сделала Уте. Она знала, как', when: timDied, minutes: 60, terminal: true, outcomes: afterNight,
        text: 'Уте откладывает вязание. Говорит Касе по-немецки, тихо, долго. Кася кивает. Уте делает то, что нужно, подушкой, быстро, держа Касю другой рукой. Потом крестит его. Потом садится обратно и снова берёт вязание. Руки у неё не дрожат. Только спицы стучат громче.', effects: [set28('bn', 'ute'), w28('tim_end', 'ute'), npc('c14_ute', 3, 'c28_did_it_for_kasia'), until28(5, 30)] },
      { id: 'c28_bn_ward', label: 'Встать до света и пойти кормить кур', when: timWard, minutes: 60, terminal: true, outcomes: afterNight, ambientDuring: snow28,
        text: 'Куры сидят на насесте, нахохлившись. Ты меняешь воду, сыплешь зерно. Возвращаешься в дом, когда светает.', effects: [set28('bn', 'ward'), until28(5, 30)] },
    ] }),

  B({ id: 'c28_b_wash', title: 'Утро', camp: kitchen14,
    text: [
      { text: 'Утром Кася просит тёплой воды. Она хочет обмыть его сама. Ты приносишь таз, полотенце, чистую рубашку из шкафа Хенрике: Нинина, из детства.' },
      { text: 'За окном фары. Патруль. Говорит {A}. Ты не выходишь.' },
      { text: 'Вода в тазу тёплая, Кася проверяет её локтем, как проверяют для младенца. Полотенце у неё на плече, то, что с утятами, Нинино.' },
    ],
    actions: [
      { id: 'c28_bw_help', label: 'Помочь ей', minutes: 60, terminal: true, goto: 'c28_burial',
        text: 'Вы обмываете его вдвоём. Кася поёт что-то по-польски, вполголоса. Рубашка Нины ему велика в плечах. Кася застёгивает все пуговицы, до верхней.', effects: [set28('bw', 'help'), npc('kasia', 2), until28(8, 50)] },
      { id: 'c28_bw_door', label: 'Стоять у двери, чтобы никто не вошёл', minutes: 60, terminal: true, goto: 'c28_burial',
        text: 'Ты стоишь у двери. Через неё слышно, как Кася поёт. Нина подходит дважды. Ты качаешь головой. Она уходит.', effects: [set28('bw', 'door'), until28(8, 50)] },
    ] }),

  B({ id: 'c28_b_empty', title: 'Пустая комната', camp: kitchen14,
    text: [
      { text: 'Утром ты заходишь в швейную комнату. Диван, сложенные одеяла. На подушке — одна шоколадная монета в золотой фольге. Он оставил. Или Кася оставила.' },
      { text: 'За окном фары. Патруль. Говорит {A}. Ты не выходишь.' },
    ],
    actions: [
      { id: 'c28_be_coin', label: 'Отдать монету Нине', minutes: 20, terminal: true, goto: 'c28_b_kasia',
        text: 'Нина держит монету на ладони и долго не разворачивает.\n\n— Я её не буду есть, — говорит она. — Можно?\n\nМожно.', effects: [set28('be', 'coin'), npc('c7_nina', 1), until28(8, 0)] },
      { id: 'c28_be_keep', label: 'Оставить монету себе', minutes: 15, terminal: true, goto: 'c28_b_kasia',
        text: 'Ты кладёшь монету в карман, к фотографии, если она у тебя есть. Она лёгкая и шуршит.', effects: [set28('be', 'keep'), until28(8, 0)] },
    ] }),

  B({ id: 'c28_b_kasia', title: 'Куда теперь', camp: kitchen14,
    text: [
      { when: timDied, text: 'После похорон Кася сидит на крыльце в пальто. Она не плачет. Она смотрит на дорогу на восток.' },
      { when: timWard, text: 'Кася в Люнебурге, с Тимом. Вернётся ли, ты не знаешь. В сенях на крючке висит её косынка. Она забыла её. Или оставила.' },
      { text: 'Пальто у неё застёгнуто до горла, руки в карманах. На ступеньке рядом лежит Тимова шапка с помпоном. Кася её не трогает, но и не убирает.' },
    ],
    actions: [
      { id: 'c28_bk_stay', label: 'Сказать: оставайся до колонны на восток', when: timDied, minutes: 30, terminal: true, outcomes: [{ id: 'k', when: all(timDied, { npc: 'kasia', alive: true, at: 'hof_luedemann' }, { npc: 'kasia', alive: true }), goto: 'c28_b_kulka' }, { id: 'h', goto: 'c28_henrike' }],
        text: '— Do dziesiątego. Bis zum Zehnten. — Кася кивает. — Ich kann kochen. Und ich kann nähen. Und ich will nicht allein sein. Nicht jetzt.\n\nДо десятого. Я умею готовить. И шить. И я не хочу быть одна. Не сейчас.', effects: [set28('bk', 'stay'), w28('kasia', 'stays'), npc('kasia', 3), until28(10, 50)] },
      { id: 'c28_bk_east', label: 'Спросить, что она будет делать', when: timDied, minutes: 30, terminal: true, outcomes: [{ id: 'k', when: all(timDied, { npc: 'kasia', alive: true, at: 'hof_luedemann' }, { npc: 'kasia', alive: true }), goto: 'c28_b_kulka' }, { id: 'h', goto: 'c28_henrike' }],
        text: '— Nach Hause. — Кася смотрит на восток. — Nach Szczecin. Zu meiner Mutter. Mit den Polen aus Winsen. Am Zehnten. Bis dahin… — Она пожимает плечами. — Bis dahin wo auch immer.\n\nДомой. В Щецин. К маме. С поляками из Винзена. Десятого. А до тех пор… где угодно.', effects: [set28('bk', 'east'), w28('kasia', 'east'), until28(10, 50)] },
      { id: 'c28_bk_scarf', label: 'Повесить её косынку на гвоздь у двери, где висят все куртки', when: timWard, minutes: 15, terminal: true, outcomes: [{ id: 'k', when: all(timDied, { npc: 'kasia', alive: true, at: 'hof_luedemann' }, { npc: 'kasia', alive: true }), goto: 'c28_b_kulka' }, { id: 'h', goto: 'c28_henrike' }],
        text: 'Белая косынка среди курток, шарфов, шапок. Если Кася вернётся, она её найдёт.', effects: [set28('bk', 'scarf'), until28(10, 50)] },
      { id: 'c28_bk_chores', label: 'Заняться домом', when: timWard, minutes: 60, terminal: true, outcomes: [{ id: 'k', when: all(timDied, { npc: 'kasia', alive: true, at: 'hof_luedemann' }, { npc: 'kasia', alive: true }), goto: 'c28_b_kulka' }, { id: 'h', goto: 'c28_henrike' }],
        text: 'Посуда, печь, бельё. До полудня ты не садишься.', effects: [set28('bk', 'chores'), until28(10, 50)] },
    ] }),

  B({ id: 'c28_b_henrike', title: 'Хенрике на кухне', camp: kitchen14,
    text: [
      { text: 'Хенрике снимает с гвоздя свой фартук. Надевает. Завязывает на спине, не глядя. И становится той Хенрике, которую ты помнишь с первого дня.' },
      { text: '— Wer ist die Frau im Mantel? Und wer ist Eva? Und wo ist das Mädchen mit den kurzen Haaren, die meine Strickjacke trägt?\n\nКто та женщина в пальто? И кто такая Эва? И где девушка с короткими волосами, которая носит мою кофту?' },
      { when: oleDead, text: 'Она спрашивает ровно. Как будто, если не спросить, придётся думать об Оле.' },
      { text: 'Картошка у неё в руках очищается одной длинной лентой, как у Эвы. Она этого не замечает, а ты замечаешь.' },
    ],
    actions: [
      { id: 'c28_bh_all', label: 'Рассказать про всех по порядку', minutes: 50, terminal: true, goto: 'c28_b_eva',
        text: 'Ты рассказываешь. Эва и колодец. Лея и её кровь, которая никого не лечит. Кася и Тим. Маркус и Лео. Хенрике слушает и чистит картошку. На Лее она останавливает нож.\n\n— Die ist nicht krank gewesen? Und Ole hat für sie… — Она не договаривает. Чистит дальше.\n\nОна не болела? А Оле за неё…', effects: [set28('bh', 'all'), npc('henrike', 2), until28(14, 0)] },
      { id: 'c28_bh_eva', label: 'Начать с Эвы: она здесь дольше всех', minutes: 40, terminal: true, goto: 'c28_b_eva',
        text: 'Хенрике слушает про Эву, про Хельмута в колодце, про берёзовый крест. Потом идёт к Эве сама, без тебя. Через полчаса из кухни слышно, как они спорят о том, сколько соли класть в картошку. Хорошо спорят.', effects: [set28('bh', 'eva'), npc('henrike', 1), npc('c8_eva', 2), until28(14, 0)] },
      { id: 'c28_bh_book', label: 'Показать тетрадь, куда Нина записывала всё, что ели', minutes: 40, terminal: true, goto: 'c28_b_eva',
        text: 'Хенрике листает Нинину тетрадь. Яйца по дням, картошка, хлеб Кёлер, паёк. Она водит пальцем по строчкам.\n\n— Das Kind hat Buch geführt. Wie Werner.\n\nРебёнок вёл учёт. Как Вернер.\n\nОна закрывает тетрадь и прижимает к груди.', effects: [set28('bh', 'book'), npc('henrike', 2), npc('c7_nina', 1), until28(14, 0)] },
    ] }),

  B({ id: 'c28_b_afternoon', title: 'После обеда', camp: yard14, ambient: snow28,
    text: [
      { text: 'День уходит рано. В три уже сумерки.' },
      { when: any(flag('w.c25_lea_point'), v('w.c24_lea', 'sander')), text: 'Около трёх по дороге идёт Лея, из пункта. Она слышала. Она останавливается у ворот и не входит, пока ты не машешь ей.' },
      { text: 'В доме пахнет воском и хвоей: Нина принесла с опушки еловую лапу и поставила в банку у окна. Ни для чего. Просто так.' },
    ],
    actions: [
      { id: 'c28_ba_lea', label: 'Позвать Лею в дом', when: any(flag('w.c25_lea_point'), v('w.c24_lea', 'sander')), minutes: 60, terminal: true, goto: 'c28_b_lea',
        text: 'Лея садится к печи. Хенрике ставит перед ней чай, не спрашивая, кто она. Потом спрашивает. Лея отвечает. Долго. Хенрике слушает и ни разу не перебивает. Потом говорит:\n\n— Dann haben Sie Ole das Leben gerettet. Auf Umwegen.\n\nЗначит, вы спасли Оле жизнь. Окольными путями.', effects: [set28('ba', 'lea'), npc('c21_lea', 2), npc('henrike', 1), until28(15, 30)] },
      { id: 'c28_ba_nina', label: 'Посидеть с Ниной', minutes: 60, terminal: true, goto: 'c28_b_lea',
        text: 'Нина сидит на лестнице. Ты садишься рядом. Она говорит:\n\n— Хенрике вернулась. Теперь всё будет как раньше?\n\nТы не знаешь, что ответить. Она и не ждёт ответа. Она прислоняется к тебе плечом.', effects: [set28('ba', 'nina'), npc('c7_nina', 2), until28(15, 30)] },
      { id: 'c28_ba_rest', label: 'Лечь: ты не {m:спал|спала} ночь', minutes: 5, terminal: true, goto: 'c28_b_lea',
        text: 'Ты засыпаешь сразу. Тебе ничего не снится. Будит запах ужина.', effects: [set28('ba', 'rest'), until28(17, 50, true)] },
    ] }),
];

