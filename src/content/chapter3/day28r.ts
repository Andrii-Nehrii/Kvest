import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, not } from './world3';
import { yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import { S28, patrolNone, patrolTobias, patrolTruth, set28, snow28, timDied, until28, w28 } from './point28';

// Участок 28, переработка 16.11 (до уровня 17–20).
// A: крыша курятника под снегом (риск; если очистить — в ночь на адвент она не рухнет: `w.c28_coop_cleared` в roofLoss 29-й).
// B: шофёр армейского грузовика, привёзшего Хенрике, требует бумагу о мальчике (риск разговора).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S28({ ...scene, for: 'any', chapter: 'ch3' });
const sagging: Cond = all(v('A.c18_kn', 'water'), not({ flag: 'w.c18_lodger' }));

export const day28RScenes: Scene[] = [
  X({ id: 'c28_a_coop', title: 'Курятник', camp: yard14, ambient: snow28,
    text: [
      { when: sagging, text: 'Слезая с сарая, ты видишь крышу курятника сверху. Она прогнулась посередине, как гамак. Рубероид, который весной прибили наспех, натянут, как барабан. Ещё один снегопад, и он не выдержит.' },
      { when: not(sagging), text: 'Слезая с сарая, ты видишь крышу курятника сверху. Снега на ней по колено. Держит. Пока держит.' },
      { text: 'Внутри куры. Под ними насест. Если крыша рухнет ночью, под досками будет полкурятника.' },
    ],
    actions: [
      { id: 'c28_ac2_climb', label: 'Залезть и сбросить снег, пока светло', minutes: 40, activity: 'heavy', risky: true, terminal: true, goto: 'c28_supper', ambientDuring: snow28,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты ползёшь по крыше на коленях, распределяя вес, и сталкиваешь снег лопатой, пласт за пластом. Крыша скрипит под тобой, но держит. Когда снег сброшен, она медленно, со вздохом, распрямляется. Почти.', effects: [set28('ac2', 'climb'), w28('coop_cleared', true)] },
          { id: 'fall', text: 'На середине крыша проседает под коленом, и ты съезжаешь вместе с пластом снега вниз, в сугроб у стены. Удар выбивает воздух из груди. Ты лежишь и смотришь в небо. Потом встаёшь и доделываешь с земли, длинной жердью. Снег сброшен. Бок болит при каждом вдохе.', effects: [set28('ac2', 'fell'), w28('coop_cleared', true), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 4 }] },
        ], effects: [until28(17, 0)] },
      { id: 'c28_ac2_prop', label: 'Подпереть крышу изнутри двумя жердями', minutes: 50, activity: 'moderate', terminal: true, goto: 'c28_supper',
        text: 'Две жерди от старой изгороди, под среднюю балку, клином в землю. Куры ругаются и не дают работать. Крыша опирается на жерди, как старик на палки. Снег на ней остаётся. Но теперь ему есть на что давить.',
        effects: [set28('ac2', 'prop'), w28('coop_cleared', true), until28(17, 10)] },
      { id: 'c28_ac2_leave', label: 'Не сейчас: день и так длинный', minutes: 5, terminal: true, goto: 'c28_supper',
        text: 'Ты слезаешь и идёшь в дом. Крыша курятника остаётся под снегом. Утром посмотришь.',
        effects: [set28('ac2', 'leave'), until28(16, 30)] },
    ] }),

  X({ id: 'c28_b_army', title: 'Бумага', camp: yard14, ambient: snow28,
    text: [
      { text: 'Армейский грузовик, на котором приехала Хенрике, всё ещё стоит у ворот. Шофёр, ефрейтор с усталым лицом, ходит вокруг с планшетом. Наконец подходит к тебе.' },
      { text: '— Ich brauche noch eine Unterschrift. Für den Jungen. Nowak, Tim. Der Leutnant will wissen, wo er ist. Lebend oder nicht.\n\nМне нужна ещё одна подпись. Про мальчика. Новак, Тим. Лейтенант хочет знать, где он. Живой или нет.' },
      { when: patrolTruth, text: 'Утром у ворот патрулю сказали правду. Ефрейтор, наверное, знает. Он спрашивает, чтобы записать.' },
      { when: patrolNone, text: 'Утром у ворот патрулю сказали: никого нет. Теперь эта ложь стоит перед тобой с планшетом.' },
      { when: patrolTobias, text: 'Утром сказали только Тобиасу. Что Тобиас написал в своей бумаге, ты не знаешь.' },
    ],
    actions: [
      { id: 'c28_ba2_grave', label: 'Отвести его к груше и показать', when: timDied, minutes: 25, risky: true, terminal: true, goto: 'c28_b_afternoon', ambientDuring: snow28,
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 2 }, text: 'Ефрейтор стоит у свежего холмика под грушей и снимает шапку. Потом пишет: «Nowak, Tim. Verstorben 27.11. Begraben Lüdemann-Hof». Умер. Похоронен. Подписывает сам, без тебя. «Mehr muss der Leutnant nicht wissen». Больше лейтенанту знать не нужно.', effects: [set28('ba2', 'grave'), w28('tim_written', 'grave')] },
          { id: 'ask', text: 'Ефрейтор стоит у холмика и спрашивает: кто? Как? Когда? Ты отвечаешь не на всё. Он пишет долго, мелко. Потом говорит, не глядя: «Das geht zum Leutnant. Was er daraus macht, weiß ich nicht». Это пойдёт к лейтенанту. Что он с этим сделает, не знаю.', effects: [set28('ba2', 'asked'), w28('tim_written', 'full'), { body: 'stress', delta: 4 }] },
        ], effects: [until28(15, 0)] },
      { id: 'c28_ba2_tobias', label: 'Сказать: всё знает Тобиас. Спросите у него', minutes: 15, terminal: true, goto: 'c28_b_afternoon',
        text: 'Ефрейтор пожимает плечами и пишет: «Siehe Gefr. Albers». См. ефрейтора Альберса. Ставит точку. «Dann soll der Junge das unterschreiben». Пусть тогда парень и подписывает. Он уезжает. Тобиасу придётся отвечать за вас ещё раз.',
        effects: [set28('ba2', 'tobias'), w28('tim_written', 'tobias'), npc('c15_tobias', -1), until28(14, 50)] },
      { id: 'c28_ba2_lie', label: 'Сказать: женщина с мальчиком ушла ночью, на восток', minutes: 15, risky: true, terminal: true, goto: 'c28_b_afternoon',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 4 }, text: 'Ты говоришь ровно и смотришь ему в глаза. Ефрейтор записывает: «Abgängig. Richtung Osten». Ушли. На восток. Потом поднимает глаза на грушу, на свежий снег под ней. Долго. И уезжает.', effects: [set28('ba2', 'lie'), w28('tim_written', 'lie')] },
          { id: 'seen', text: 'Ты говоришь, и в этот момент из дома выходит Кася в чёрном платке Хенрике. Ефрейтор смотрит на неё, на грушу, на тебя. Ничего не пишет. Только говорит: «Lügen Sie den Leutnant nicht an. Mich ist egal». Лейтенанту не врите. Мне всё равно.', effects: [set28('ba2', 'caught'), w28('tim_written', 'caught'), { body: 'stress', delta: 6 }] },
        ], effects: [until28(14, 50)] },
    ] }),
];
