import type { Outcome, Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { npc } from './point19';
import { v } from './point18';
import {
  S28, hostile28, nightFacts, offList, oleDead, patrolNone, patrolTobias, patrolTruth, set28, snow28, timDied, timWard, until28, vanHidden, w28, wesselFired,
} from './point28';

// Участок 28, линия A: рассвет, патруль в шесть (A говорит то, что решила B), Вессель, Оле на кухне, двор после всего.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S28({ ...scene, for: 'any', chapter: 'ch3' });
const viaBurial = (list: Outcome[]): Outcome[] => list.flatMap(o => [
  { ...o, id: `${o.id}_b`, when: all(o.when ?? { always: true }, timDied), goto: 'c28_burial' }, { ...o, goto: 'c28_a_wessel' }]);
const afterPatrol = [{ id: 'b', when: timDied, goto: 'c28_burial' }, { id: 'w', goto: 'c28_a_wessel' }];

export const day28AScenes: Scene[] = [
  A({ id: 'c28_a_dawn', title: 'Рассвет', camp: yard14, ambient: snow28, onEnter: nightFacts,
    text: [
      { when: timDied, text: 'В половине шестого {B} выходит на крыльцо. Садится на ступеньку. Ты садишься рядом. Она говорит одно слово: «Всё». Ты не спрашиваешь, как. Она скажет сама. Или не скажет.' },
      { when: timWard, text: 'Вечером, в десять, приезжал Тобиас. Кася вынесла Тима к «Вольфу» сама, завёрнутого в одеяло, и села рядом с ним. В Люнебург. Обратно, за стекло. Тим её ещё узнавал.' },
      { text: 'Через полчаса — патруль.' },
    ],
    actions: [
      { id: 'c28_ad_sit', label: 'Посидеть с ней молча, пока не рассветёт', minutes: 25, terminal: true, goto: 'c28_a_patrol', ambientDuring: snow28,
        text: 'Вы сидите. Небо на востоке сереет. Где-то за лесополосой каркает ворона. {B} кладёт голову тебе на плечо, на минуту, и поднимается.', effects: [set28('ad', 'sit'), until28(6, 0)] },
      { id: 'c28_ad_gate', label: 'Идти к воротам: встретить патруль первым', minutes: 20, terminal: true, goto: 'c28_a_patrol', ambientDuring: snow28,
        text: 'Ты идёшь к воротам. Отодвигаешь засов. Стоишь. Дорога пустая. Пока.', effects: [set28('ad', 'gate'), until28(6, 0)] },
    ] }),

  A({ id: 'c28_a_patrol', title: 'Шесть утра', camp: yard14, ambient: snow28,
    text: [
      { text: 'В шесть фары. «Вольф» и армейский джип. Тобиас и лейтенант, молодой, в очках, с планшетом. За ними двое солдат.' },
      { when: flag('w.c27_tobias_delay'), text: 'Нет. Не в шесть. В семь. «Вольф» не заводился. В такой мороз в это любой поверит.' },
      { text: 'Говорить будешь ты. Что сказать, решала {B}.' },
      { when: patrolTruth, text: 'Правду.' },
      { when: patrolNone, text: '«Никого нет».' },
      { when: patrolTobias, text: 'Только Тобиасу.' },
    ],
    actions: [
      { id: 'c28_ap_say', label: 'Сказать, как решили', minutes: 40, terminal: true,
        outcomes: viaBurial([
          { id: 'truth_dead', when: all(patrolTruth, timDied), text: 'Ты говоришь: мальчик был здесь. Ночью он умер. Утром его похоронят. Лейтенант смотрит на тебя поверх очков. Пишет. Долго.\n\n— Ich muss den Leichnam sehen.\n\nЯ должен увидеть тело.\n\nТобиас ведёт его к Касе. Через пять минут лейтенант выходит бледный и садится в джип, не говоря ни слова.', effects: [set28('ap', 'say')] },
          { id: 'none_dead', when: all(patrolNone, timDied), text: 'Ты говоришь: никого нет. Лейтенант кивает солдатам. Они идут по двору. Через десять минут один из них зовёт от сарая. Лейтенант идёт туда. Возвращается. Записывает. Смотрит на тебя.\n\n— Lüdemann-Hof. Zweiter Verstoß.\n\nХутор Людеманов. Второе нарушение.', effects: [set28('ap', 'say')] },
          { id: 'tob_dead', when: all(patrolTobias, timDied), text: 'Ты отводишь Тобиаса в сторону и говоришь ему одному. Он кивает. Идёт к лейтенанту, говорит что-то, показывает на дом, на снег, на часы. Лейтенант колеблется, потом машет рукой: дальше. Джип уезжает. Тобиас остаётся.\n\n— Ich habe gesagt: hier war ein krankes Kind, es ist tot, ich habe es selbst gesehen. Das stimmt ja.\n\nЯ сказал: здесь был больной ребёнок, он умер, я сам видел. Это ведь правда.', effects: [set28('ap', 'say')] },
          { id: 'ward', text: 'Лейтенант слушает и сверяет с планшетом.\n\n— Der Junge ist seit gestern Abend wieder auf Station. Gut. Dann sind wir hier fertig.\n\nМальчик со вчерашнего вечера снова в отделении. Хорошо. Тогда здесь всё.\n\nДжип уезжает. Тобиас задерживается на минуту, кивает тебе и уезжает следом.', effects: [set28('ap', 'say')] },
        ]), effects: [until28(7, 30)] },
      { id: 'c28_ap_tobias', label: 'Сказать, как решили, и посмотреть Тобиасу в глаза', minutes: 40, terminal: true, outcomes: afterPatrol,
        text: 'Ты говоришь. Тобиас стоит за спиной лейтенанта и смотрит на тебя. Он всё понимает. Когда джип уезжает, он задерживается у ворот.\n\n— Ihr habt es so gemacht, wie ihr es konntet. Mehr kann keiner.\n\nВы сделали, как могли. Больше никто не может.', effects: [set28('ap', 'tobias'), npc('c15_tobias', 2), until28(7, 30)] },
    ] }),

  A({ id: 'c28_a_wessel', title: 'Вессель', camp: yard14, ambient: snow28,
    text: [
      { when: wesselFired, text: 'Солдаты нашли фургон за сеновалом. Лейтенант записал номер. Вессель стоит у фургона без ушанки.\n\n— Das war es. Kein Wagen mehr. Den holen sie heute Nachmittag.\n\nВсё. Фургона больше нет. Его заберут днём.' },
      { when: all(vanHidden, not(wesselFired)), text: 'Фургон за сеновалом не нашли. Вессель снимает брезент и заводит мотор.\n\n— Ich fahre nach Lüneburg. Frühschicht. Als wäre nichts. — Он смотрит на дом. — Es war nichts. Oder?\n\nЕду в Люнебург. Утренняя смена. Как будто ничего. Ничего ведь не было?' },
      { when: not(vanHidden), text: 'Вессель уехал ещё вчера, до света. На снегу у ворот остались следы шин, уже припорошённые.' },
      { when: v('$.c28_ad', 'sit'), text: 'Утром, на рассвете, ты сидел{m:|а} с Касей молча, пока не пришли. Она это помнит: держится ближе к тебе, чем к остальным.' },
    ],
    actions: [
      { id: 'c28_aw_stay', label: 'Предложить Весселю остаться до колонны на восток', when: wesselFired, minutes: 30, terminal: true, goto: 'c28_henrike',
        text: 'Вессель думает долго.\n\n— Bis zum Zehnten. Dann gehe ich mit den Polen. Zu Fuß, wenn es sein muss. — Он надевает ушанку. — Ich kann Wäsche waschen. Und fahren. Wenn ihr mal wieder einen Wagen habt.\n\nДо десятого. Потом уйду с поляками. Пешком, если придётся. Я умею стирать. И водить. Если у вас снова будет машина.', effects: [set28('aw', 'stay'), w28('wessel', 'stays'), npc('c27_wessel', 3), until28(11, 50)] },
      { id: 'c28_aw_go', label: 'Пожать руку и отпустить', when: wesselFired, minutes: 20, terminal: true, goto: 'c28_henrike',
        text: 'Вессель уходит к дороге пешком, с рюкзаком. Ушанку он надевает у ворот. На повороте оборачивается и машет.', effects: [set28('aw', 'go'), { npc: 'c27_wessel', moveTo: 'c15_winsen' }, until28(11, 50)] },
      { id: 'c28_aw_thanks', label: 'Сказать ему: ничего не было. Спасибо', when: all(vanHidden, not(wesselFired)), minutes: 20, terminal: true, goto: 'c28_henrike',
        text: '— Nichts, — повторяет Вессель. Ничего. — Gut.\n\nФургон уезжает. В зеркале он не смотрит на дом.', effects: [set28('aw', 'thanks'), { npc: 'c27_wessel', moveTo: 'c18_lueneburg' }, until28(11, 50)] },
      { id: 'c28_aw_yard', label: 'Взяться за двор: дела не ждут', when: not(vanHidden), minutes: 60, activity: 'moderate', terminal: true, goto: 'c28_henrike', ambientDuring: snow28,
        text: 'Дрова, вода, куры. Руки делают сами. До полудня ты не думаешь ни о чём. Почти.', effects: [set28('aw', 'yard'), until28(11, 50)] },
    ] }),

  A({ id: 'c28_a_ole', title: 'Оле на кухне', camp: kitchen14,
    text: [
      { when: not(oleDead), text: 'Оле сидит у печи, в одеяле, с кружкой. Он смотрит на тебя, когда ты входишь, и кивает на табурет.\n\n— Hast du die Flinte gefunden? Mit dem Zettel?\n\nРужьё нашёл? По листку?' },
      { when: oleDead, text: 'На кухне Хенрике. Она сидит за столом и листает тетрадь Оле. Ты садишься напротив.' },
    ],
    actions: [
      { id: 'c28_ao_gun', label: 'Рассказать, что стало с ружьём', when: not(oleDead), minutes: 30, terminal: true, goto: 'c28_a_tell',
        text: 'Ты рассказываешь. Оле слушает, кивает.\n\n— Vater hätte es auch so gemacht. Oder schlimmer. — Он улыбается углом рта. — Und der Schrank oben? Hast du das Wort?\n\nОтец бы сделал так же. Или хуже. А шкаф наверху? Слово угадал?', effects: [set28('ao', 'gun'), npc('ole', 2), until28(13, 40)] },
      { id: 'c28_ao_mia', label: 'Спросить про малышку у окна', when: not(oleDead), minutes: 30, terminal: true, goto: 'c28_a_tell',
        text: '— Mia. — Оле смотрит в кружку. — Sie hat am Dienstag gefragt, ob ich morgen komme. Ich hab ja gesagt. Und dann bin ich umgefallen. Ich weiß nicht, was mit ihr ist.\n\nМия. Во вторник спросила, приду ли я завтра. Я сказал: да. А потом упал. Не знаю, что с ней.', effects: [set28('ao', 'mia'), npc('ole', 1), { body: 'stress', delta: 2 }, until28(13, 40)] },
      { id: 'c28_ao_book', label: 'Спросить Хенрике про тетрадь', when: oleDead, minutes: 30, terminal: true, goto: 'c28_a_tell',
        text: 'Хенрике показывает последнюю страницу. Почерк Оле, неровный: «Do. Letztes Mal. Für Mia». Четверг. Последний раз. Для Мии.\n\n— Er hat es selbst entschieden. — Хенрике закрывает тетрадь. — Ihr habt ihm gesagt, er soll selbst entscheiden. Er hat.\n\nОн решил сам. Вы сказали ему решать самому. Он решил.', effects: [set28('ao', 'book'), { body: 'stress', delta: 4 }, until28(13, 40)] },
      { id: 'c28_ao_sit', label: 'Просто сесть рядом', minutes: 30, terminal: true, goto: 'c28_a_tell',
        text: 'Ты садишься. Печь гудит. Часы отстают на четыре минуты. Никто не встаёт их поправить.', effects: [set28('ao', 'sit'), until28(13, 40)] },
    ] }),

  A({ id: 'c28_a_afternoon', title: 'После обеда', camp: yard14, ambient: snow28,
    text: [
      { text: 'День короткий. К трём уже сумерки.' },
      { when: offList, text: 'В два звонит велосипед. Лукас. Бумага: «Lüdemann-Hof — von der Liste gestrichen. Brandt». Вычеркнуты из списка. Он уезжает, не дожидаясь.' },
      { when: all(not(offList), flag('w.c28_list')), text: 'В два звонит велосипед. Лукас. Бумага: «Lüdemann-Hof — halbe Ration bis 15.12. Zweiter Verstoß». Половина пайка до пятнадцатого. Второе нарушение.' },
    ],
    actions: [
      { id: 'c28_aa_cross', label: 'Сделать крест для могилы', when: timDied, minutes: 60, activity: 'light', terminal: true, goto: 'c28_a_roof',
        text: 'Две берёзовые жерди, проволока, гвоздь. Ты выжигаешь раскалённым гвоздём на перекладине: «TIM». Кася смотрит, как ты работаешь, и не уходит, пока ты не заканчиваешь.', effects: [set28('aa', 'cross'), w28('tim_cross', true), npc('kasia', 2), until28(15, 30)] },
      { id: 'c28_aa_ole_room', label: 'Помочь Хенрике разобрать вещи Оле', when: oleDead, minutes: 60, terminal: true, goto: 'c28_a_roof',
        text: 'Хенрике складывает рубашки Оле стопкой. Кубки за футбол оставляет на полке. Плакат с трактором — на стене. Шкаф наверху она закрывает и долго держит руку на дверце.', effects: [set28('aa', 'ole_room'), npc('henrike', 2), until28(15, 30)] },
      { id: 'c28_aa_wood', label: 'Колоть дрова', minutes: 80, activity: 'heavy', terminal: true, goto: 'c28_a_roof', ambientDuring: snow28,
        text: 'Колун поднимается и падает. Поленница растёт. К сумеркам у тебя болят плечи, и это хорошо: болит что-то, что можно назвать.', effects: [set28('aa', 'wood'), { body: 'fatigue', delta: 10 }, { body: 'stress', delta: -3 }, until28(15, 30)] },
      { id: 'c28_aa_brandt', label: 'Сходить к Брандту поговорить про список', when: hostile28, minutes: 150, terminal: true, goto: 'c28_supper', ambientDuring: snow28,
        text: 'Брандт принимает тебя в караулке, стоя. Слушает, не перебивая.\n\n— Ich habe gesagt: wer lügt, fliegt. Ihr habt gelogen oder nicht?\n\nЯ сказал: кто врёт, вылетает. Вы врали или нет?\n\nОн отворачивается к окну. Разговор окончен. Домой ты идёшь в темноте.', effects: [set28('aa', 'brandt'), { body: 'fatigue', delta: 4 }, until28(17, 55)] },
    ] }),
];

