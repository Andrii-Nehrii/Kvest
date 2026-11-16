import type { Scene } from '../../engine/content-types';
import { house14, kitchen14, yard14 } from './point14';
import { npc } from './point19';
import { A35, S35, frost35, set35, until35 } from './point35';

// Участок 35, второй круг дотяжки (16.11).
// A: Сабина просит за Матса. B: кого из стариков первым в списки. Оба: Нина про десятое; кто будет кормить скотину, если уедете.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S35({ ...scene, for: 'any', chapter: 'ch3' });
const toAnimals = { goto: 'c35_x_animals' };
const ninaUntil = until35(15, 30);
const oleAlive = { npc: 'ole', alive: true } as const;
const afterAnimals = [{ id: 'a', when: A35, goto: 'c35_a_dusk' }, { id: 'b', goto: 'c35_b_kasia' }];
const animalsUntil = { if: A35, then: [until35(16, 10)], else: [until35(16, 0)] };

export const day35XScenes: Scene[] = [
  X({ id: 'c35_x_a_sabina', title: 'Сабина', location: 'c16_jesteburg', camp: { at: 'c16_jesteburg', stock: 'c3_farm_stock', rest: false }, safe: false, ambient: frost35,
    text: [
      { text: 'У стены пожарной части, где вывешен список на десятое, стоит Сабина, дочь Брандта. Матс держится за её пальто и сосёт варежку.' },
      { text: '— Mein Vater steht nicht auf der Liste. Er sagt, er bleibt. Und ich auch nicht, weil ich seine Tochter bin und er «keine Ausnahmen» macht. Er hört nicht auf mich. Auf Sie vielleicht.\n\nОтца нет в списке. Он говорит, что остаётся. И меня нет, потому что я его дочь, а он «не делает исключений». Меня он не слушает. Может, послушает вас.' },
    ],
    actions: [
      { id: 'c35_xs_promise', label: 'Пообещать поговорить с Брандтом', minutes: 30, terminal: true, goto: 'c35_a_jannik', ambientDuring: frost35,
        text: 'Сабина кивает, быстро, несколько раз. Матс вынимает варежку изо рта и говорит тебе «Tschüss», хотя ты ещё не уходишь. Ты не знаешь, что скажешь Брандту. Знаешь только, что придётся.',
        effects: [set35('xs', 'promise'), until35(11, 0)] },
      { id: 'c35_xs_tobias', label: 'Сказать: про списки решает Тобиас, идите к нему', minutes: 20, terminal: true, goto: 'c35_a_jannik', ambientDuring: frost35,
        text: '— Tobias sagt, er macht keine Listen. Er fährt nur die Laster.\n\nТобиас говорит, что списков не составляет. Он только водит грузовики.\n\nОна всё равно идёт к последнему грузовику, таща Матса за руку. Ты смотришь, как она стоит перед Тобиасом и говорит, а он смотрит в сторону.',
        effects: [set35('xs', 'tobias'), until35(11, 0)] },
      { id: 'c35_xs_no', label: 'Сказать честно: Брандт тебя не послушает', minutes: 15, terminal: true, goto: 'c35_a_jannik',
        text: 'Сабина смотрит на тебя долго, потом поднимает Матса на руки.\n\n— Dann eben nicht. Ich frag trotzdem jeden Tag.\n\nНу и ладно. Я всё равно буду спрашивать каждый день.\n\nОна уходит к караулке, к отцу, прямая, как он.',
        effects: [set35('xs', 'no'), until35(11, 0)] },
    ] }),

  X({ id: 'c35_x_b_elders', title: 'Кто первым', camp: kitchen14,
    text: [
      { text: 'Хенрике кладёт на стол листок Хаазе. Внизу от руки: «Hof Lüdemann: 3 Plätze, Alte/Kranke. Namen bis 8.12». Хутор Людеманов: три места, старые и больные. Имена до восьмого.' },
      { text: 'Стариков на хуторе трое. Фрау Кёрнер с сердцем. Фрау Хаберланд с чемоданом шерсти. Петерсен.' },
      { when: oleAlive, text: 'И Оле. Мест три.' },
      { when: { not: oleAlive }, text: 'Мест три. Ровно по числу. Это не делает решение легче: в листке написано «старые и больные», и больных в округе больше, чем мест.' },
      { text: '— Du warst im Punkt. Du weißt, wer es nicht schafft. Ich kann das nicht entscheiden.\n\nТы {m:был|была} в пункте. Ты знаешь, кто не выдержит. Я не могу это решать.' },
    ],
    actions: [
      { id: 'c35_xe_heart', label: 'Вписать тех, кому хуже всех', minutes: 30, terminal: true, goto: 'c35_b_dusk',
        outcomes: [
          { id: 'o', when: oleAlive, text: 'Ты пишешь три фамилии, начиная с фрау Кёрнер. Те, кого в списке нет, узнают вечером, от тебя {m:самого|самой}. Никто не спорит. Фрау Хаберланд только говорит: «Ich stricke hier weiter». Я тут ещё повяжу. От этого не легче.', effects: [set35('xe', 'heart'), until35(14, 30)] },
          { id: 'n', text: 'Три места, три старика. Ты пишешь все три фамилии и долго смотришь на листок: так просто не бывает. Хенрике читает его через плечо и ничего не говорит.', effects: [set35('xe', 'heart'), until35(14, 30)] },
        ] },
      { id: 'c35_xe_ask', label: 'Спросить самих стариков, кто хочет ехать', minutes: 40, terminal: true, goto: 'c35_b_dusk',
        text: 'Ты собираешь их на кухне. Петерсен говорит сразу: «Ich bleibe. Hier habe ich Arbeit». Я остаюсь. Здесь у меня работа. Фрау Хаберланд говорит, что поедет, куда скажут. Кёрнер молчит и смотрит в окно. Список пишется сам собой и не становится от этого легче.',
        effects: [set35('xe', 'ask'), until35(14, 30)] },
      { id: 'c35_xe_okafor', label: 'Оставить решение Окафору: он врач', minutes: 25, terminal: true, goto: 'c35_b_dusk',
        text: 'Хенрике смотрит на тебя и кивает: так честнее. Листок отправляется в колонию с Ниной. Через час Нина приносит его обратно. Почерк Окафора, аккуратный, как в истории болезни: три фамилии, против каждой диагноз. Ты читаешь и не споришь.',
        effects: [set35('xe', 'okafor'), until35(14, 30)] },
    ] }),

  X({ id: 'c35_x_nina', title: 'Десятое', camp: house14,
    text: [
      { text: 'Нина ловит тебя на лестнице. Она уже знает про десятое: в доме это знают все.' },
      { text: '— Если поедем, кто будет кормить кур? — говорит она по-русски. — И корову. И коз Уте. — Пауза. — А если не поедем, мы что, тут умрём?' },
    ],
    actions: [
      { id: 'c35_xn_truth', label: 'Сказать честно: пока не знаем', minutes: 20, terminal: true, ...toAnimals,
        text: '— Пока не знаем, — говоришь ты.\n\nНина кивает. Это ей понятнее, чем любое обещание. «Тогда я пока покормлю», — говорит она и идёт к курятнику с миской.',
        effects: [set35('xn', 'truth'), npc('c7_nina', 1), ninaUntil] },
      { id: 'c35_xn_promise', label: 'Пообещать: куда бы ни было, ты едешь с нами', minutes: 20, terminal: true, ...toAnimals,
        text: 'Нина смотрит на тебя снизу вверх, проверяя, не врёшь ли. Потом обнимает, быстро, крепко, и отпускает, будто ничего не было. Ты только что пообещал{m:|а} то, за что придётся отвечать.',
        effects: [set35('xn', 'promise'), npc('c7_nina', 2), ninaUntil] },
      { id: 'c35_xn_ask', label: 'Спросить: а ты сама чего хочешь?', minutes: 25, terminal: true, ...toAnimals,
        text: 'Нина думает долго. Потом говорит: «Чтобы все были вместе. Где — неважно». И после паузы: «Ну, чтоб тепло было». Ты запоминаешь её ответ. Сегодня вечером его стоит повторить вслух.',
        effects: [set35('xn', 'ask'), npc('c7_nina', 1), ninaUntil] },
    ] }),

  X({ id: 'c35_x_animals', title: 'Скотина', camp: yard14, ambient: frost35,
    text: [
      { text: 'В хлеву корова тянется мордой к твоему рукаву. Козы Уте толкаются у кормушки. Куры на насесте, нахохлившись. Сена до февраля, если не жадничать.' },
      { text: 'Если десятого уехать хоть кому-то, их надо на кого-то оставить. Если уехать всем, решать надо сейчас.' },
    ],
    actions: [
      { id: 'c35_xa_jannes', label: 'Договориться с Яннесом: если уедем, он будет ходить', minutes: 35, terminal: true, outcomes: afterAnimals, ambientDuring: frost35,
        text: 'Яннес выслушивает, сунув руки в карманы, и кивает раньше, чем ты договариваешь. «Ich komm zweimal am Tag. Morgens und abends. Mutter auch». Я буду приходить два раза в день. Утром и вечером. И мать тоже. Вы жмёте руки, как на рынке.',
        effects: [set35('xa', 'jannes'), npc('c14_jannes', 2), animalsUntil] },
      { id: 'c35_xa_henrike', label: 'Спросить Хенрике: это её скотина, ей решать', minutes: 30, terminal: true, outcomes: afterAnimals,
        text: 'Хенрике отвечает сразу, будто ждала вопроса: «Die Kuh bleibt, solange ich bleibe. Und ich bleibe». Корова остаётся, пока остаюсь я. А я остаюсь. Потом, тише: «Wenn ihr fahrt, fahrt. Ich bin hier geboren».',
        effects: [set35('xa', 'henrike'), npc('henrike', 1), animalsUntil] },
      { id: 'c35_xa_count', label: 'Пересчитать сено и корм: на сколько хватит без вас', minutes: 30, activity: 'light', terminal: true, outcomes: afterAnimals, ambientDuring: frost35,
        text: 'Ты считаешь тюки на сеновале, мешки с зерном, мешок с картофельными очистками. Выходит: корове до середины февраля, козам до конца января, курам дольше. Цифры ты записываешь на дверном косяке хлева карандашом. Кто бы ни остался, пусть видит.',
        effects: [set35('xa', 'count'), animalsUntil] },
    ] }),
];
