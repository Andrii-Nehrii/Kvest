import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { carHere, npc, tableOnly } from './point19';
import {
  S22, bAway, bag22, day22, debt22, dirkHere, herChoice, keremComes, leaMoves, malte22, search22, set22, until22, w22,
  wayHide, wayJest, wayTobias,
} from './point22';

// Участок 22, линия A: патруль в девять, Тобиас наедине, Яннес, три разговора с Мальте, Керем, гонец Брандта, следы у груши.
// Половина правды A: плазма не вылечила никого, колонн больше не будет (`$.c22_a_truth`).
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S22({ ...scene, for: 'any', chapter: 'ch3' });
const sawZero: Cond = flag('w.c21_a_saw_zero');
const sawNote: Cond = flag('w.c21_a_saw_note');
const listAll: Cond = any(v('w.c18_list', 'all'), flag('w.c18_list_checked'));
const pump: Cond = any(flag('A.c21_jannes_pump'), flag('B.c21_jannes_pump'), flag('w.c17_pump'));
const uteGrave: Cond = flag('w.c21_ute_grave');
const ninaTold: Cond = any(flag('w.c18_nina_told'), flag('w.c21_nina_told'));
const ninaCap: Cond = flag('w.c21_nina_cap');
const truthA = set22('a_truth', true);
const plasmaLeft = (fx: (qty: number) => Effect[]): Effect => ({ if: { v: 'w.c21_plasma_used', op: '==', value: 2 }, then: fx(2),
  else: [{ if: { v: 'w.c21_plasma_used', op: '==', value: 1 }, then: fx(3), else: fx(4) }] });
const plasmaOut = plasmaLeft((qty) => [{ unstock: 'c21_plasma', qty, at: 'c3_farm_stock' }]);
/** Сумку, которую решили отдать Тобиасу, A выносит к воротам сам. */
const bagToTobias: Effect = { if: bag22('lueneburg'), then: [plasmaOut, { unstock: 'c21_insulin', qty: 10, at: 'c3_farm_stock' }, w22('bag_gone', true)],
  else: [{ if: bag22('keep'), then: [plasmaOut, w22('plasma_gone', true)] }] };
const atGate: Effect[] = [leaMoves, bagToTobias];
const toPatrol = [{ id: 'd', when: wayHide, goto: 'c22_x_a_deal' }, { id: 'p', goto: 'c22_a_patrol' }];
const toMalte1 = [{ id: 'c', when: carHere, goto: 'c22_x_a_car' }, { id: 'm', goto: 'c22_a_malte1' }];
const afterLunch = [{ id: 'k', when: keremComes, goto: 'c22_a_kerem' }, { id: 'p', goto: 'c22_a_pump' }];

export const day22AScenes: Scene[] = [
  A({ id: 'c22_a_yard', title: 'Утро во дворе', camp: yard14, ambient: day22,
    text: [
      { text: 'Без четверти восемь. Иней на крыше сарая начинает таять с южной стороны. Изо рта идёт пар.' },
      { when: dirkHere, text: 'Дверь сарая открыта. Ефрейтор Зоммер сидит на колоде, зашнуровывает ботинки и не может попасть шнурком в петлю.\n\n— Um neun ist der Tobias hier, — говорит он, не поднимая головы. В девять Тобиас будет здесь. — Ich muss ihm was sagen. Das weißt du.\n\nМне придётся ему кое-что сказать. Ты это знаешь.' },
      { when: all(dirkHere, flag('w.c21_dirk_promised')), text: 'Он обещал вам одну ночь. Ночь кончилась.' },
      { when: not(dirkHere), text: 'Мальте сидит на лавке у крыльца, нога в доске вытянута вперёд, лицо к солнцу. Нина вынесла ему одеяло и кружку.' },
      { when: any(bag22('lueneburg'), bag22('keep')), text: 'Синяя сумка стоит в сенях, у двери. Её отдадут в девять.' },
    ],
    actions: [
      { id: 'c22_ay_dirk_ask', label: 'Спросить Дирка, что он скажет', when: dirkHere, minutes: 15, terminal: true, goto: 'c22_a_patrol',
        outcomes: [
          { id: 'kept', when: flag('w.c21_dirk_promised'), text: '— Dass ich die Nacht hier geschlafen habe. Mehr hat er nicht gefragt, — говорит Дирк. Что я ночевал здесь. Больше он не спрашивал. — Und wenn er fragt, lüge ich nicht.\n\nА если спросит, врать не стану.\n\nОн встаёт и проверяет автомат, не глядя на дом.', effects: [set22('ay', 'dirk_ask')] },
          { id: 'tell', text: '— Alles, — говорит Дирк. Всё. — Dass die Spenderin bei euch ist. Dass ihr sie versteckt. Ich will euch nichts. Aber das ist ein Befehl.\n\nЧто донор у вас. Что вы её прячете. Я вам ничего плохого не хочу. Но это приказ.', effects: [set22('ay', 'dirk_ask')] },
        ], effects: [until22(9, 0)] },
      { id: 'c22_ay_dirk_food', label: 'Вынести ему хлеба и горячего чаю', when: dirkHere, minutes: 15, terminal: true, outcomes: toPatrol,
        text: 'Он ест стоя, быстро, крошки сыплются на автомат. Кружку возвращает обеими руками.\n\n— Danke. Das macht es nicht leichter. Für keinen von uns.\n\nСпасибо. Легче от этого не станет. Никому из нас.', effects: [set22('ay', 'dirk_food'), { body: 'stress', delta: 1 }, { if: wayHide, then: [until22(8, 35)], else: [until22(9, 0)] }] },
      { id: 'c22_ay_wood', label: 'Наколоть дров, пока есть время', minutes: 30, activity: 'moderate', terminal: true, outcomes: toPatrol, ambientDuring: day22,
        text: 'Колун звенит на морозе. После десятого полена спина согревается и в голове становится пусто. Это хорошо.', effects: [set22('ay', 'wood'), { body: 'stress', delta: -1 }, { if: wayHide, then: [until22(8, 35)], else: [until22(9, 0)] }] },
      { id: 'c22_ay_malte', label: 'Сесть рядом с Мальте на лавку', when: not(dirkHere), minutes: 30, terminal: true, outcomes: toPatrol, ambientDuring: day22,
        text: '— Weißt du, was das Schlimmste ist? — говорит Мальте. Знаешь, что хуже всего? — Ich kann nicht weglaufen. Wenn die Montag kommen, lieg ich hier wie ein Paket.\n\nЯ не могу убежать. Когда они придут в понедельник, я буду лежать тут, как посылка.\n\nОн смеётся. Невесело.', effects: [set22('ay', 'malte'), malte22(1), { if: wayHide, then: [until22(8, 35)], else: [until22(9, 0)] }] },
      { id: 'c22_ay_road', label: 'Выйти к воротам и смотреть на дорогу', minutes: 20, terminal: true, outcomes: toPatrol, ambientDuring: day22,
        text: 'На дороге к Йестебургу пусто. У двора Кёлер из трубы идёт дым: тесто подошло, пекарня работает. Хоть что-то в округе идёт по часам.', effects: [set22('ay', 'road'), { if: wayHide, then: [until22(8, 35)], else: [until22(9, 0)] }] },
    ] }),

  A({ id: 'c22_a_patrol', title: 'Девять часов', camp: tense14, ambient: day22,
    text: [
      { text: 'Ровно в девять у ворот останавливается «Вольф». Тобиас и двое солдат. Один из них — пожарный с рыжими усами, в армейской куртке поверх своей.' },
      { when: wayTobias, text: 'Тобиас не выходит из машины сразу. Он смотрит на дом. Потом на тебя.\n\n— Ihr habt sie, — говорит он. Не вопрос. У вас она.' },
      { when: all(wayTobias, herChoice), text: 'Лея выходит из дома сама, с сумкой через плечо. Ей никто не говорил, что пора. Она решила это ночью, за стенкой, пока вы спорили.' },
      { when: all(wayTobias, not(herChoice)), text: 'Из дома выходит {B}. Рядом с ней Лея, в куртке Хенрике, с сумкой через плечо. Волосы у неё до ушей, и Тобиас узнаёт её не сразу.' },
      { when: wayHide, text: '— Gestern Abend sind drei von der Kolonne Richtung Jesteburg gegangen. Eine Frau, ein Soldat, ein Verletzter. Nicht angekommen.\n\nВчера вечером трое с колонны пошли к Йестебургу. Женщина, солдат, раненый. Не дошли.' },
      { when: all(wayHide, search22), text: 'За его спиной стоит Дирк Зоммер. Он смотрит в землю.\n\n— Wir schauen uns um, — говорит Тобиас. Мы осмотримся. — Zwanzig Minuten.\n\nДвадцать минут.' },
      { when: all(wayHide, v('$.c22_ym', 'agree')), text: 'Мальте с лавки говорит своё, слово в слово, как договорились: ночью, полем, спал. Голос у него скучный, как у человека, которому всё равно.' },
      { when: all(wayHide, v('$.c22_ym', 'quiet')), text: 'Мальте лежит, отвернувшись к стене. Когда к нему обращаются, он морщится от боли, и ему верят.' },
      { when: all(wayHide, v('$.c22_ym', 'truth')), text: 'Мальте на все вопросы отвечает одно: «Ich hab geschlafen». Я спал. Это правда, и это слышно.' },
      { when: wayJest, text: '— Wo ist deine Frau? — спрашивает Тобиас. Где твоя жена? — Und wo ist die Sanitäterin von gestern? Der Kruse hat «Lüdemann-Hof, zwei Personen» geschrieben.\n\nИ где вчерашняя санитарка? Крузе записал: «хутор Людеманов, двое».' },
      { when: any(bag22('lueneburg'), bag22('keep')), text: 'Синяя сумка стоит у твоих ног.' },
    ],
    actions: [
      { id: 'c22_ap_open', label: 'Молча открыть ворота', when: wayTobias, minutes: 20, terminal: true, goto: 'c22_a_tobias',
        text: 'Ты открываешь. Лея проходит мимо тебя и на секунду останавливается.\n\n— Danke für die Nacht.\n\nСпасибо за ночь.\n\nОна садится на заднее сиденье «Вольфа» сама. Пожарный с рыжими усами захлопывает за ней дверь и отводит глаза.', effects: [set22('ap', 'open'), ...atGate, until22(9, 25)] },
      { id: 'c22_ap_sorry', label: 'Сказать ей: прости', when: wayTobias, minutes: 20, terminal: true, goto: 'c22_a_tobias',
        text: '— Wofür? — говорит Лея. За что? — Ihr habt mich nicht gefunden. Ihr habt mich aufgehoben. Das ist was anderes.\n\nВы меня не нашли. Вы меня подобрали. Это другое.\n\nОна садится в машину. Через стекло она смотрит не на тебя, а на окно швейной комнаты.', effects: [set22('ap', 'sorry'), ...atGate, until22(9, 25)] },
      { id: 'c22_ap_ask', label: 'Спросить Тобиаса, что с ней будет', when: wayTobias, minutes: 20, terminal: true, goto: 'c22_a_tobias',
        text: '— Lüneburg. Donorblock. Ein Bett neben Ole.\n\nЛюнебург. Донорский блок. Койка рядом с Оле.\n\nОн молчит, потом добавляет тише:\n\n— Und Ole fährt heim. Das hat man ihm versprochen.\n\nА Оле поедет домой. Ему это обещали.', effects: [set22('ap', 'ask'), ...atGate, until22(9, 25)] },
      { id: 'c22_ap_night', label: 'Сказать: санитарка ушла ночью, полем, на Ханштедт', when: wayHide, minutes: 25, terminal: true, goto: 'c22_a_tobias',
        outcomes: [
          { id: 'search', when: search22, text: 'Тобиас слушает и кивает. Потом кивает солдатам. Те идут в дом. Ты стоишь у ворот с пожарным. Он закуривает и не предлагает тебе.\n\nЧерез двадцать минут они выходят. В сарай, на сеновал и в погреб заглядывали. Пустые руки.\n\n— Nichts, — говорит один. Ничего.\n\nТобиас смотрит на тебя дольше, чем нужно.', effects: [set22('ap', 'night'), w22('searched', true)] },
          { id: 'debt', when: debt22, text: 'Тобиас слушает. На слове «Ханштедт» он поднимает глаза.\n\n— Hanstedt. Gut. Das schreibe ich so auf.\n\nХанштедт. Хорошо. Так и запишу.\n\nОн пишет. Пожарный за его спиной смотрит на окна и ничего не говорит.', effects: [set22('ap', 'night'), w22('tobias_wrote', 'hanstedt')] },
          { id: 'plain', text: 'Тобиас записывает. Не спорит. Перед тем как сесть в машину, он говорит, не оборачиваясь:\n\n— Montag kommen Hunde aus Lüneburg. Die suchen nicht nach Worten.\n\nВ понедельник приедут собаки из Люнебурга. Им слова не нужны.', effects: [set22('ap', 'night'), w22('dogs_warned', true)] },
        ], effects: [...atGate, until22(9, 30)] },
      { id: 'c22_ap_none', label: 'Сказать: никакой санитарки здесь не было', when: wayHide, minutes: 25, terminal: true, goto: 'c22_a_tobias',
        outcomes: [
          { id: 'search', when: search22, text: 'Дирк за спиной Тобиаса поднимает голову. Тобиас даже не оборачивается к нему.\n\n— Wir schauen trotzdem, — говорит он. Мы всё равно посмотрим.\n\nДвадцать минут ты слушаешь, как в доме открывают шкафы. Они выходят ни с чем. Тобиас садится в машину, не попрощавшись.', effects: [set22('ap', 'none'), w22('searched', true), w22('tobias_lied_to', true), npc('c15_tobias', -2)] },
          { id: 'plain', text: '— Kruse hat «Lüdemann-Hof» geschrieben, — говорит Тобиас. Крузе написал «хутор Людеманов».\n\nТы молчишь. Он ждёт ещё немного, потом убирает блокнот.\n\n— Wie du willst.\n\nКак хочешь.', effects: [set22('ap', 'none'), w22('tobias_lied_to', true), npc('c15_tobias', -1)] },
        ], effects: [...atGate, until22(9, 30)] },
      { id: 'c22_ap_why', label: 'Спросить, зачем она им', when: any(wayHide, wayJest), minutes: 25, terminal: true, goto: 'c22_a_tobias',
        outcomes: [
          { id: 'search', when: search22, text: '— Weil acht Kinder in Lüneburg ohne sie sterben, — говорит Тобиас. Потому что восемь детей в Люнебурге без неё умрут.\n\nОн кивает солдатам. Двадцать минут обыска. Они выходят ни с чем. Тобиас долго смотрит на тебя, потом на окно швейной комнаты, и садится в машину.', effects: [set22('ap', 'why'), w22('searched', true)] },
          { id: 'plain', text: '— Weil acht Kinder in Lüneburg ohne sie sterben, — говорит Тобиас. Потому что восемь детей в Люнебурге без неё умрут. — Und weil Ole sonst nie heimkommt.\n\nИ потому что иначе Оле никогда не вернётся домой.\n\nОн ждёт. Ты не отвечаешь. Он убирает блокнот.', effects: [set22('ap', 'why')] },
        ], effects: [...atGate, until22(9, 30)] },
      { id: 'c22_ap_doctor', label: 'Сказать: жена повела её в Йестебург, к врачу', when: wayJest, minutes: 20, terminal: true, goto: 'c22_a_tobias',
        text: 'Тобиас смотрит на дорогу к Йестебургу, как будто может их там увидеть.\n\n— Zu Fuß? Vier Kilometer. — Он садится в машину и сразу выходит обратно. — Nein. Brandt holt sie. Ich hab ihm das nicht weggenommen.\n\nПешком? Четыре километра. Нет. Пусть Брандт её забирает. Я у него этого не отнимал.', effects: [set22('ap', 'doctor'), w22('tobias_left_to_brandt', true), ...atGate, until22(9, 25)] },
      { id: 'c22_ap_water', label: 'Сказать: жена ушла за водой к колонке, санитарки нет', when: wayJest, minutes: 20, terminal: true, goto: 'c22_a_tobias',
        text: '— Mit einem Rucksack? Um halb neun? — Тобиас показывает на просёлок: на инее две цепочки следов. Одни маленькие, городские. — Die Spur führt nach Jesteburg. Lüg mich nicht an. Ich hab dir am Birnbaum nicht gelogen.\n\nС рюкзаком? В половине девятого? Следы ведут в Йестебург. Не ври мне. Я тебе под грушей не врал.', effects: [set22('ap', 'water'), w22('tobias_lied_to', true), npc('c15_tobias', -2), ...atGate, until22(9, 25)] },
    ] }),

  A({ id: 'c22_a_tobias', title: 'Тобиас наедине', camp: yard14, ambient: day22,
    text: [
      { text: 'Солдаты курят у машины. Тобиас отходит с тобой к груше. Под грушей холмик, обложенный камнями. Его мать. Он стоит к холмику спиной, чтобы не смотреть.' },
      { text: '— Ich war gestern bei Ole. Er fragt, ob sie lebt. Nur das. «Lebt sie?» Und dann: «Wenn sie kommt, fahr ich heim».\n\nЯ вчера был у Оле. Он спрашивает, жива ли она. Только это. «Она жива?» И потом: «Если она приедет, я поеду домой».' },
      { when: wayTobias, text: '— Jetzt fährt er heim, — говорит Тобиас. Теперь поедет. — Ich bringe ihn Montag selbst.\n\nВ понедельник я сам его привезу.' },
      { text: '— Montag kommt ein Bus aus Lüneburg. Alle, die genesen sind, werden abgeholt. Und Hunde. Und Brandt will Benzin, Waffen und Namen.\n\nВ понедельник приходит автобус из Люнебурга. Всех переболевших заберут. И собаки. А Брандту нужны бензин, оружие и имена.' },
    ],
    actions: [
      { id: 'c22_at_zero', label: 'Рассказать ему про лист из чемодана: двести двенадцать и ноль', when: sawZero, minutes: 20, terminal: true, goto: 'c22_a_jannes',
        text: 'Тобиас слушает, не перебивая. Потом снимает перчатку и трёт лицо голой рукой.\n\n— Null.\n\nНоль.\n\n— Dann holen die am Montag Leute ab, damit sie die anderen ein bisschen länger leben lassen. Und ich fahre den Bus.\n\nЗначит, в понедельник забирают людей, чтобы другие пожили чуть дольше. А автобус веду я.\n\nОн надевает перчатку.\n\n— Das hast du mir nicht gesagt. Verstanden?\n\nТы мне этого не говорил. Понял?', effects: [set22('at', 'zero'), w22('tobias_knows_zero', true), truthA, npc('c15_tobias', 2), until22(10, 0)] },
      { id: 'c22_at_bus', label: 'Спросить, куда повезут переболевших', minutes: 15, terminal: true, goto: 'c22_a_jannes',
        text: '— Lüneburg. Blut abgeben. Zweimal die Woche. Dafür doppelte Ration für die Familie.\n\nЛюнебург. Сдавать кровь. Дважды в неделю. Зато двойной паёк семье.\n\nОн говорит это ровно, как читает с листа.\n\n— Freiwillig, steht da.\n\nДобровольно, так написано.', effects: [set22('at', 'bus'), w22('bus_known', true), until22(9, 55)] },
      { id: 'c22_at_ole', label: 'Спросить, как Оле выглядит', minutes: 15, terminal: true, goto: 'c22_a_jannes',
        text: '— Wie ein Mann, der jeden Tag einen halben Liter abgibt. — Тобиас смотрит на грушу. — Er hat aufgehört, Witze zu machen. Das ist schlecht. Ole hat immer Witze gemacht.\n\nКак человек, который каждый день сдаёт пол-литра. Он перестал шутить. Это плохо. Оле всегда шутил.', effects: [set22('at', 'ole'), { body: 'stress', delta: 2 }, until22(9, 55)] },
      { id: 'c22_at_grave', label: 'Сказать, что холмик под грушей вы бережёте', minutes: 10, terminal: true, goto: 'c22_a_jannes',
        text: 'Тобиас поворачивается к холмику. Камни уложены ровно, один к одному. Между ними кто-то воткнул сухую ветку вереска.\n\n— Das war die Kleine, oder? Nina.\n\nЭто малая, да? Нина.\n\nОн долго молчит.\n\n— Sag ihr danke.\n\nСкажи ей спасибо.', effects: [set22('at', 'grave'), npc('c15_tobias', 2), npc('c7_nina', 1), until22(9, 50)] },
    ] }),

  A({ id: 'c22_a_jannes', title: 'Костыль', camp: yard14, ambient: day22,
    text: [
      { text: 'В десять у ворот появляется Яннес. В руках у него две ясеневые палки, гладкие, со снятой корой, и моток изоленты.' },
      { text: '— Für den mit dem Bein. Mutter hat gesagt, ein Mann ohne Krücke ist wie ein Hof ohne Zaun.\n\nДля того, что с ногой. Мать сказала: мужик без костыля — что двор без забора.' },
      { when: uteGrave, text: 'Он мнётся и смотрит в сторону насыпи.\n\n— Und… Mutter fragt, ob ihr am Montag mit Spaten kommt. Wegen Kai. Bevor der Boden friert.\n\nИ ещё… Мать спрашивает, придёте ли вы в понедельник с лопатами. Из-за Кая. Пока земля не замёрзла.' },
    ],
    actions: [
      { id: 'c22_aj_make', label: 'Сделать костыль вместе с ним', minutes: 40, activity: 'light', terminal: true, outcomes: toMalte1,
        text: 'Перекладину вы делаете из обрезка черенка, обматываете тряпкой и изолентой. Яннес работает молча и аккуратно, как отец, наверное, учил. Мальте пробует костыль у печи, делает три шага и садится, мокрый от пота.\n\n— Wie neu. Ich tanze Montag.\n\nКак новый. В понедельник станцую.', effects: [set22('aj', 'make'), w22('crutch', true), npc('c14_jannes', 2), malte22(2), until22(11, 10)] },
      { id: 'c22_aj_grave', label: 'Пообещать прийти в понедельник с лопатами', when: uteGrave, minutes: 20, terminal: true, outcomes: toMalte1,
        text: 'Яннес кивает и сразу отворачивается.\n\n— Früh. Bevor die Soldaten wach sind. Die mögen das nicht.\n\nРано. Пока солдаты не проснулись. Им такое не нравится.\n\nПалки он оставляет у крыльца. Костыль Мальте собирает к вечеру сам.', effects: [set22('aj', 'grave'), w22('grave_promised', true), w22('crutch', true), npc('c14_jannes', 3), npc('c14_ute', 2), until22(10, 50)] },
      { id: 'c22_aj_pump', label: 'Спросить его про ваш насос', when: pump, minutes: 30, terminal: true, outcomes: toMalte1,
        text: 'Яннес оживает сразу, как будто только этого и ждал.\n\n— Die Membran. Ich hab das gehört, als ich am Zaun stand. Ich kann das. Ich wollte Elektriker werden.\n\nМембрана. Я слышал, когда стоял у забора. Я умею. Я хотел стать электриком.\n\nОн обещает прийти завтра с инструментом. Палки остаются у крыльца.', effects: [set22('aj', 'pump'), w22('jannes_pump', true), w22('crutch', true), npc('c14_jannes', 2), until22(11, 0)] },
      { id: 'c22_aj_send', label: 'Поблагодарить и отправить домой', minutes: 10, terminal: true, outcomes: toMalte1,
        text: 'Яннес уходит быстро, руки в карманах. Палки остаются у крыльца. К обеду Нина, ругаясь, обматывает перекладину тряпкой сама.', effects: [set22('aj', 'send'), w22('crutch', true), until22(10, 40)] },
    ] }),

  A({ id: 'c22_a_malte1', title: 'Целле', camp: kitchen14,
    text: [
      { text: 'Мальте лежит на лавке у печи. Костыль стоит рядом, на расстоянии вытянутой руки, как ружьё.' },
      { text: '— Setz dich. Ich muss reden, sonst denke ich.\n\nСадись. Мне надо говорить, иначе я начинаю думать.' },
      { text: 'Он говорит про Целле. Про дом с зелёными ставнями на Хоэнвег. Про жену, которая работает в аптеке. Про Яну, ей девять, и Морица, ему шесть.' },
    ],
    actions: [
      { id: 'c22_am_photo', label: 'Попросить показать фотографию', minutes: 20, terminal: true, goto: 'c22_a_malte2',
        text: 'Фотография у него в бумажнике, мятая, с загнутым углом. Девочка без двух передних зубов и мальчик в каске пожарного, на три размера больше головы.\n\n— Der Helm ist von mir. Er will Fahrer werden. Wie ich.\n\nКаска моя. Он хочет быть водителем. Как я.\n\nМальте убирает фотографию раньше, чем ты успеваешь её как следует рассмотреть.', effects: [set22('am', 'photo'), malte22(2), until22(11, 35)] },
      { id: 'c22_am_celle', label: 'Спросить, пустят ли его в Целле', minutes: 20, terminal: true, goto: 'c22_a_malte2',
        text: '— Mich schon. Ich bin von da. — Он смотрит в потолок. — Wenn ich bis zum Kontrollpunkt komme. Mit dem Bein. Achtzig Kilometer.\n\nМеня-то пустят. Я оттуда. Если я доберусь до поста. С такой ногой. Восемьдесят километров.\n\nОн показывает рукой на костыль, как на шутку, которая не удалась.', effects: [set22('am', 'celle'), w22('celle_far', true), until22(11, 35)] },
      { id: 'c22_am_listen', label: 'Просто слушать', minutes: 25, terminal: true, goto: 'c22_a_malte2',
        text: 'Ты слушаешь. Про то, как он чинил Яне велосипед и потерял гайку в траве. Про то, как Мориц боится темноты, но не признаётся. Мальте говорит долго, и с каждой минутой голос у него ровнее.', effects: [set22('am', 'listen'), malte22(1), { body: 'stress', delta: -1 }, until22(11, 40)] },
    ] }),

  A({ id: 'c22_a_malte2', title: 'Остаток', camp: kitchen14,
    text: [
      { text: 'Нина выходит из кухни с ведром. Мальте провожает её глазами и понижает голос.' },
      { text: '— Weißt du, was die Kolonne war? Keine Hilfe. Das war der Rest. Alles, was in Hannover noch im Lager stand. Danach kommt nichts. Das hat der Reuter selbst gesagt, am Funk, als er dachte, ich schlafe.\n\nЗнаешь, чем была колонна? Не помощью. Это был остаток. Всё, что ещё стояло на складах в Ганновере. После неё ничего не будет. Ройтер сам это сказал по рации, когда думал, что я сплю.' },
      { when: flag('A.c21_heard_last'), text: '«После нас никто больше не приедет». Ты уже слышал{m:|а} это вчера, по рации.' },
    ],
    actions: [
      { id: 'c22_a2_why', label: 'Спросить, зачем тогда было везти её в Люнебург', minutes: 20, terminal: true, goto: 'c22_a_malte3',
        text: '— Weil man den Kindern was geben muss. Und den Müttern. Und den Leuten in Uniform, die das jeden Tag ansehen. — Мальте закрывает глаза. — Plasma ist was. Auch wenn es nicht hilft. Nichts ist schlimmer.\n\nПотому что детям надо что-то давать. И матерям. И людям в форме, которые на это каждый день смотрят. Плазма — это хоть что-то. Даже если не помогает. Ничего — хуже.', effects: [set22('a2', 'why'), truthA, until22(12, 0)] },
      { id: 'c22_a2_doubt', label: 'Сказать: ты шофёр. Откуда тебе знать', minutes: 15, terminal: true, goto: 'c22_a_malte3',
        text: 'Мальте не обижается.\n\n— Stimmt. Ich bin Fahrer. Ich fahre, was man mir auflädt. Und ich lese die Frachtbriefe. Das macht jeder Fahrer, sonst bist du dumm.\n\nВерно. Я шофёр. Я вожу то, что мне грузят. И читаю накладные. Это делает каждый шофёр, иначе ты дурак.\n\nОн хлопает себя по нагрудному карману.', effects: [set22('a2', 'doubt'), until22(11, 55)] },
      { id: 'c22_a2_quiet', label: 'Промолчать', minutes: 15, terminal: true, goto: 'c22_a_malte3',
        text: 'Ты молчишь. Мальте кивает, как будто молчание — тоже ответ, и правильный.\n\n— Ja. Ich hab auch zwei Tage nichts gesagt.\n\nДа. Я тоже два дня молчал.', effects: [set22('a2', 'quiet'), malte22(1), until22(11, 55)] },
    ] }),

  A({ id: 'c22_a_malte3', title: 'Накладная', camp: kitchen14,
    text: [
      { text: 'Мальте достаёт из нагрудного кармана сложенный вчетверо лист. Желтоватая бумага, бланк накладной. Внизу, на свободном месте, синей ручкой, с нажимом — несколько строк.' },
      { text: '«Plasmatherapie: n = 212. Genesen: 0. Verlängerung der Latenz um 6–14 Tage. Gemeldet 17.11. Antwort: weitermachen, bis Ersatz da ist. Keine weiteren Lieferungen aus Hannover. R.»\n\nЛечение плазмой: 212 человек. Выздоровели: 0. Отсрочка на 6–14 дней. Доложено 17.11. Ответ: продолжать, пока нет замены. Новых поставок из Ганновера не будет.' },
      { when: sawNote, text: 'Тот же почерк, что на приписке в чемодане. Слово в слово, только здесь больше.' },
      { when: all(sawZero, not(sawNote)), text: '«Двести двенадцать, выздоровели: ноль». Это ты видел{m:|а} вчера в чемодане. Теперь — с подписью.' },
      { text: '— Das hat er mir in die Tasche gesteckt. Am Donnerstag. «Falls mir was passiert, Jessen». Jetzt ist ihm was passiert.\n\nЭто он сунул мне в карман. В четверг. «Если со мной что-то случится, Йессен». Теперь с ним что-то случилось.' },
    ],
    actions: [
      { id: 'c22_a3_take', label: 'Взять лист себе', minutes: 15, terminal: true, goto: 'c22_a_lunch',
        text: '— Nimm. Ich will das nicht mehr am Herzen tragen. Im wörtlichen Sinn.\n\nБери. Не хочу больше носить это у сердца. В прямом смысле.\n\nЛист ты убираешь во внутренний карман. Он лёгкий. Карман от него тяжелеет.', effects: [set22('a3', 'take'), w22('page', 'a'), truthA, { give: 'c22_page' }, malte22(1), until22(12, 30)] },
      { id: 'c22_a3_copy', label: 'Переписать в блокнот, лист оставить ему', minutes: 20, terminal: true, goto: 'c22_a_lunch',
        text: 'Ты переписываешь слово в слово, с цифрами, на обороте Нининой тетрадной страницы. Мальте следит, чтобы ты не ошибся в числах.\n\n— Gut. Dann gibt es zwei. Einer kommt immer durch.\n\nХорошо. Значит, их два. Один всегда дойдёт.', effects: [set22('a3', 'copy'), w22('page', 'copy'), truthA, { give: 'c22_page_copy' }, until22(12, 30)] },
      { id: 'c22_a3_leave', label: 'Сказать: оставь у себя. Это твоё', minutes: 10, terminal: true, goto: 'c22_a_lunch',
        text: 'Мальте складывает лист обратно, медленно, по старым сгибам.\n\n— Meins. Ja. Wie das Bein.\n\nМоё. Да. Как нога.\n\nОн кладёт его в карман и застёгивает пуговицу.', effects: [set22('a3', 'leave'), w22('page', 'malte'), truthA, until22(12, 30)] },
    ] }),

  A({ id: 'c22_a_lunch', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед в половине первого: суп из вчерашней картошки с луком, хлеб.' },
      { when: bAway, text: 'Место {B.gen} за столом пустое. Нина ставит её тарелку на плиту, под крышку.' },
      { when: all(wayHide, not(bAway)), text: 'Лея ест быстро и молча, сидя боком к окну. {B} сидит рядом с ней. Они о чём-то говорили утром: это видно по тому, как обе не смотрят друг на друга.' },
    ],
    actions: [
      { id: 'c22_al_eat', label: 'Поесть горячего', minutes: 25, terminal: true, outcomes: afterLunch, ...tableOnly,
        text: 'Суп горячий и густой. Ты ешь и чувствуешь, как отпускает плечи, сведённые с девяти утра.', effects: [set22('al', 'eat'), meal('eat'), until22(13, 0)] },
      { id: 'c22_al_pack', label: 'Взять хлеб с собой и вернуться к делам', minutes: 5, terminal: true, outcomes: afterLunch, ...tableOnly,
        text: 'Ты заворачиваешь свою порцию в бумагу и кладёшь в карман куртки.', effects: [set22('al', 'pack'), meal('pack'), until22(12, 45)] },
      { id: 'c22_al_tea', label: 'Только чай', minutes: 10, terminal: true, outcomes: afterLunch,
        text: 'Ты пьёшь чай стоя, у окна. Отсюда видно ворота и дорогу.', effects: [set22('al', 'tea'), until22(12, 45)] },
    ] }),

  A({ id: 'c22_a_kerem', title: 'Мопед', camp: yard14, ambient: day22,
    text: [
      { text: 'В начале второго с поля доносится треск мопеда. Керем едет по меже, вдоль лесополосы, не по дороге. Шлем у него привязан к багажнику: в шлеме он не слышит, что вокруг.' },
      { text: '— In Buchholz ist das Krankenhaus leer, — говорит он, не слезая. В Бухгольце больница пустая. — Ganz leer. Station vier steht offen. Die Betten sind gemacht. Keiner drin.\n\nСовсем. Четвёртое отделение настежь. Кровати застелены. В них никого.' },
      { when: flag('w.c19_fuel_offer'), text: 'На багажнике у него канистра. Пять литров, как договаривались.' },
    ],
    actions: [
      { id: 'c22_ak_trade', label: 'Обменять, как договаривались', when: flag('w.c19_fuel_offer'), minutes: 20, terminal: true, goto: 'c22_a_runner',
        outcomes: [
          { id: 'schnaps', when: all(flag('w.c19_schnaps'), not(flag('w.c19_schnaps_traded'))), text: 'Бутылка шнапса из подвала Людеманов уходит в рюкзак Керема, канистра — тебе в руки. Керем подмигивает.\n\n— Deniz sagt: für den Winter. Ich sage: für heute Abend.\n\nДениз говорит: на зиму. А я говорю: на сегодняшний вечер.', effects: [set22('ak', 'trade'), w22('schnaps_traded', true), { give: 'can_petrol_10', fuel: 5 }, w22('fuel_traded', true)] },
          { id: 'diesel', when: flag('w.c19_diesel'), text: 'Ты выносишь из сарая канистру солярки. Керем взвешивает её в руке, кивает и отдаёт свою.\n\n— Fünf gegen zehn. Deniz wird singen.\n\nПять за десять. Дениз запоёт.', effects: [set22('ak', 'trade'), w22('diesel_traded', true), { give: 'can_petrol_10', fuel: 5 }, w22('fuel_traded', true)] },
          { id: 'none', text: 'Ты показываешь пустые руки. Керем смотрит на тебя, потом на дом.\n\n— Schon gut. Nächstes Mal. Den Kanister lasse ich trotzdem da. Deniz zieht mir das Fell über die Ohren.\n\nЛадно. В следующий раз. Канистру я всё равно оставлю. Дениз с меня шкуру спустит.', effects: [set22('ak', 'trade'), { give: 'can_petrol_10', fuel: 5 }, w22('fuel_debt', true), npc('kerem', 2)] },
        ], effects: [until22(14, 25)] },
      { id: 'c22_ak_news', label: 'Расспросить про Бухгольц', minutes: 25, terminal: true, goto: 'c22_a_runner',
        text: '— Brandts Leute haben alle Waffen eingesammelt. Bei uns auch. Und eine Liste gemacht, wer krank war und gesund geworden ist. Deniz steht drauf. Er war im Oktober eine Woche krank. Grippe. Aber jetzt steht er drauf.\n\nЛюди Брандта собрали всё оружие. У нас тоже. И составили список: кто болел и выздоровел. Дениз в нём. В октябре он неделю болел. Грипп. А теперь он в списке.', effects: [set22('ak', 'news'), w22('deniz_listed', true), until22(14, 25)] },
      { id: 'c22_ak_malte', label: 'Спросить, может ли он отвезти раненого в Целле', minutes: 20, terminal: true, goto: 'c22_a_runner',
        text: 'Керем смотрит на мопед, на свою ногу, на дорогу.\n\n— Achtzig Kilometer? Hinten drauf, mit dem Bein? Der fällt mir in der ersten Kurve runter. — Он думает. — Aber Deniz hat den Transit. Wenn er Diesel hätte…\n\nВосемьдесят километров? Сзади, с такой ногой? Он свалится на первом повороте. Но у Дениза есть «Транзит». Будь у него солярка…', effects: [set22('ak', 'malte'), w22('transit_idea', true), until22(14, 25)] },
    ] }),

  A({ id: 'c22_a_pump', title: 'Насос', camp: yard14, ambient: day22,
    text: [
      { text: 'После обеда ты наконец добираешься до насоса. Ручка ходит пусто, как будто внутри ничего нет. Вода в ведро идёт тонкой струйкой и кончается.' },
      { text: 'Мальте кричит из окна кухни, что у них в автопарке такие насосы чинили изолентой и молитвой.' },
    ],
    actions: [
      { id: 'c22_au_fix', label: 'Разобрать и посмотреть, что внутри', minutes: 50, activity: 'moderate', terminal: true, goto: 'c22_x_a_crutch', ambientDuring: day22,
        outcomes: [
          { id: 'ok', check: { traits: ['technical'], difficulty: 3, uses: ['focus'] }, text: 'Кожаная манжета на поршне ссохлась и треснула. Ты вырезаешь новую из старого голенища, смазываешь салом и собираешь обратно. Третий качок — и вода идёт толстой струёй, ледяная, со ржавчиной.', effects: [set22('au', 'fixed'), w22('pump_fixed', true)] },
          { id: 'half', text: 'Внутри ты находишь треснувшую манжету. Новую вырезаешь из голенища, но она выходит кривой. Вода идёт, но тонко, и надо качать вдвое дольше. До весны, может, и хватит.', effects: [set22('au', 'half')] },
        ], effects: [until22(13, 40)] },
      { id: 'c22_au_bucket', label: 'Наносить воды из колодца в бочку на вечер', minutes: 40, activity: 'heavy', terminal: true, goto: 'c22_x_a_crutch', ambientDuring: day22,
        text: 'Шестнадцать вёдер. Бочка в сенях полная. Плечи гудят. Насос подождёт до завтра.', effects: [set22('au', 'bucket'), { body: 'fatigue', delta: 4 }, until22(13, 40)] },
      { id: 'c22_au_leave', label: 'Оставить до Яннеса: он разбирается', minutes: 10, terminal: true, goto: 'c22_x_a_crutch',
        text: 'Ты ставишь ведро вверх дном на насос, чтобы не забыли, что он сломан.', effects: [set22('au', 'leave'), until22(13, 40)] },
    ] }),

  A({ id: 'c22_a_runner', title: 'Бумага на понедельник', camp: yard14, ambient: day22,
    text: [
      { text: 'В половине третьего у ворот звонит велосипедный звонок. Парнишка лет шестнадцати, правая рука на перевязи, на левом рукаве повязка дружинника. Это тот, что вчера лежал в прицепе Брандта.' },
      { text: 'Он протягивает листок, отпечатанный под копирку.\n\n«Montag, 23.11., 10 Uhr, Feuerwehrhaus Jesteburg. Pflicht für jeden Hof: 1) Angabe aller Treibstoffvorräte. 2) Abgabe aller Schusswaffen. 3) Namen aller Personen, die die Krankheit überstanden haben. — Brandt»\n\nПонедельник, 23.11, 10:00, пожарная часть Йестебурга. Обязательно для каждого двора: 1) указать все запасы топлива; 2) сдать всё огнестрельное оружие; 3) имена всех, кто перенёс болезнь. — Брандт' },
      { when: listAll, text: 'Внизу от руки приписано: «Lüdemann-Hof: 6 Pers. lt. Liste». Хутор Людеманов, шестеро по списку.' },
    ],
    actions: [
      { id: 'c22_ar_sign', label: 'Расписаться в получении', minutes: 10, terminal: true, goto: 'c22_a_tracks',
        text: 'Парнишка подставляет планшет. Ты расписываешься. Он смотрит на твою подпись так, как будто запоминает.\n\n— Danke. Die meisten schimpfen.\n\nСпасибо. Большинство ругается.', effects: [set22('ar', 'sign'), w22('paper', 'signed'), { give: 'c22_brandt_paper' }, until22(14, 40)] },
      { id: 'c22_ar_ask', label: 'Спросить, зачем Брандту переболевшие', minutes: 15, terminal: true, goto: 'c22_a_tracks',
        text: '— Für Mats, — говорит парнишка сразу. Для Матса. И краснеет. — Und für die anderen Kinder. Der Brandt sagt: wenn Lüneburg ihre Spenderin hat, haben wir unsere eigene. Aus dem Dorf.\n\nИ для других детей. Брандт говорит: если у Люнебурга есть свой донор, у нас будет свой. Из деревни.', effects: [set22('ar', 'ask'), w22('brandt_donors', true), truthA, { give: 'c22_brandt_paper' }, until22(14, 45)] },
      { id: 'c22_ar_arm', label: 'Спросить, как его рука', minutes: 15, terminal: true, goto: 'c22_a_tracks',
        text: '— Gebrochen. Nicht gebissen. — Он говорит это быстро, как пароль. — Der Vater hat dreimal nachgesehen. Ich bin Lukas.\n\nСломана. Не укус. Отец три раза смотрел. Я Лукас.\n\nЛисток он всё-таки оставляет, прижав камнем на столбе ворот.', effects: [set22('ar', 'arm'), w22('lukas', true), { give: 'c22_brandt_paper' }, until22(14, 45)] },
      { id: 'c22_ar_no', label: 'Не брать листок', minutes: 10, terminal: true, goto: 'c22_a_tracks',
        text: '— Dann lege ich ihn hin. — Парнишка кладёт листок на столб ворот и придавливает камнем. — Der Brandt fragt nicht, ob man ihn liest.\n\nТогда положу. Брандт не спрашивает, читали или нет.', effects: [set22('ar', 'no'), w22('paper', 'refused'), until22(14, 40)] },
    ] }),

  A({ id: 'c22_a_tracks', title: 'Следы у груши', camp: yard14, ambient: day22,
    text: [
      { text: 'Около трёх ты обходишь двор сзади. На мокрой земле у задней калитки — следы. Босые, длинные, с вывернутыми пальцами. Они идут вдоль изгороди до груши, топчутся вокруг холмика с камнями и уходят обратно в поле.' },
      { text: 'Следы свежие. Ночью было минус два: ночные вмёрзли бы. Эти оставлены после полудня. Пока вы обедали.' },
    ],
    actions: [
      { id: 'c22_ak2_follow', label: 'Пройти по следам до лесополосы', minutes: 30, activity: 'moderate', terminal: true, goto: 'c22_a_nina', ambientDuring: day22,
        text: 'Следы идут прямо, не петляя, до лесополосы. Там, в канаве, лежит больничная рубашка, разорванная по шву. Дальше следов нет: дальше сухая трава. Ты стоишь и слушаешь. Ветер. Ворона. Больше ничего.', effects: [set22('ak2', 'follow'), w22('shirt_found', true), { body: 'stress', delta: 2 }, until22(15, 40)] },
      { id: 'c22_ak2_wire', label: 'Натянуть проволоку с банками вдоль задней изгороди', when: not(flag('w.c21_wire')), minutes: 40, activity: 'moderate', terminal: true, goto: 'c22_a_nina', ambientDuring: day22,
        text: 'Проволока, шесть банок, в каждой гайка. Грубо, зато слышно из дома. Последнюю банку ты вешаешь у груши.', effects: [set22('ak2', 'wire'), w22('wire', true), until22(15, 45)] },
      { id: 'c22_ak2_rake', label: 'Заровнять следы граблями, чтобы Нина не увидела', minutes: 15, terminal: true, goto: 'c22_a_nina',
        text: 'Ты проходишь граблями вдоль изгороди. Земля снова ровная. Холмик под грушей ты поправляешь руками: два камня сдвинуты. Один ты долго держишь в руке, прежде чем положить на место.', effects: [set22('ak2', 'rake'), until22(15, 20)] },
      { id: 'c22_ak2_bell', label: 'Повесить на калитку старый колокольчик из сарая', minutes: 20, terminal: true, goto: 'c22_a_nina',
        text: 'Колокольчик коровий, медный, с отбитым краем. Звенит глухо. Но если калитку дёрнут ночью, в доме услышат.', effects: [set22('ak2', 'bell'), w22('bell', true), until22(15, 25)] },
    ] }),

  A({ id: 'c22_a_nina', title: 'Нина', camp: house14,
    text: [
      { text: 'Нина сидит на лестнице, на третьей ступеньке, с тетрадью на коленях. Она не пишет. Она ждёт тебя.' },
      { when: ninaCap, text: '— Завтра воскресенье, — говорит она. — Ты {m:обещал|обещала}.\n\nОтцовская кепка висит в сенях на её крючке.' },
      { when: all(ninaTold, not(ninaCap)), text: '— Те, на дороге, — говорит она. — Которые босиком. Папа тоже теперь так ходит?' },
      { when: not(ninaTold), text: '— Она останется? — спрашивает Нина. — Лея. Или вы её тоже отдадите, как всех?' },
    ],
    actions: [
      { id: 'c22_an_sunday', label: 'Сказать: завтра пойдём, засветло, как обещал', when: ninaCap, minutes: 20, terminal: true, goto: 'c22_x_a_koehler',
        text: 'Нина кивает и закрывает тетрадь.\n\n— В десять. Пока солдаты на обходе у Кёлер.\n\nОна уже всё рассчитала. Ты не споришь.', effects: [set22('an', 'sunday'), w22('cap_walk', 'sunday'), npc('c7_nina', 2), until22(16, 0)] },
      { id: 'c22_an_no', label: 'Сказать: нет. Он не ходит. Его больше нет', when: all(ninaTold, not(ninaCap)), minutes: 20, terminal: true, goto: 'c22_x_a_koehler',
        text: '— Я знаю, — говорит Нина. — Я просто хотела, чтобы кто-нибудь сказал «нет».\n\nОна прислоняется головой к перилам. Ты сидишь рядом, пока у неё не перестают дрожать колени.', effects: [set22('an', 'no'), npc('c7_nina', 2), until22(16, 0)] },
      { id: 'c22_an_lea', label: 'Объяснить ей про Лею, как есть', when: not(ninaTold), minutes: 25, terminal: true, goto: 'c22_x_a_koehler',
        text: 'Ты объясняешь: кто она, почему её ищут, что такое донорский блок. Нина слушает, наклонив голову.\n\n— Значит, у неё внутри лекарство, — говорит она. — А её за это хотят держать на привязи. Как Йенса.\n\nЕй пятнадцать. Она видит связи, которых ты не {m:хотел|хотела} видеть.', effects: [set22('an', 'lea'), w22('nina_lea', true), npc('c7_nina', 1), until22(16, 0)] },
      { id: 'c22_an_work', label: 'Позвать её помогать с курами', minutes: 25, terminal: true, goto: 'c22_x_a_koehler',
        text: 'Нина идёт с тобой. Пока вы чистите насест, она рассказывает, какая курица у кого ворует корм. Всех кур она знает по именам. Ты — ни одной.', effects: [set22('an', 'work'), npc('c7_nina', 1), until22(16, 0)] },
    ] }),
];
