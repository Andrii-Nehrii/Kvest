import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { S31, frost31, set31, until31 } from './point31';
import { evaRole, kasiaRoad } from './house28';

// Участок 31, переделка (REWORK_PLAN.md, этап 1): после ужина у каждого — своя сцена с тем, кто живёт в доме.
// Эва: слово Хенрике до весны (A), список хозяйств Брандта (B). Кася: могила или топор или совет (A), письмо в Винзен (B).
// Лея: кухня-пункт и чужой из Гарльсторфа (A), поручение в Винзен (B).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S31({ ...scene, for: 'any', chapter: 'ch3' });
const w31 = (key: string, value: string | boolean): { set: string; value: string | boolean } => ({ set: `w.c31_${key}`, value });
const toLateA = [{ id: 'l', goto: 'c31_a_late' }];
const toLateB = [{ id: 'l', goto: 'c31_b_late' }];
/** Хенрике и Эва помирились в 29-й (корова вдвоём, стол, разговор в хлеву) или делят плиту. */
const reconciled: Cond = any(v('w.c29_women', 'barn'), v('w.c29_women', 'table'), v('w.c29_women', 'told'), evaRole('split'));
const timColony = v('w.c27_tim', 'colony');
const letter = any(v('w.c29_kasia_letter', 'truth'), v('w.c29_kasia_letter', 'alive'));
const rule = (x: string): Cond => v('w.c29_lea_rule', x);

export const day31HScenes: Scene[] = [
  // ───────────── Эва ─────────────
  X({ id: 'c31_ha_eva', title: 'Слово Хенрике', camp: yard14, ambient: frost31,
    text: [
      { text: 'После ужина Хенрике выходит с тобой во двор, будто бы проверить засов. Засов в порядке. Она стоит и смотрит на окно швейной, где горит свет.' },
      { when: reconciled, text: '— Die Frau bleibt, — говорит она. — Bis zum Frühling. Dann sehen wir. Ich sage es dir, damit du es weißt. Nicht, damit du was sagst.\n\nЭта женщина остаётся. До весны. А там посмотрим. Я говорю тебе, чтобы ты {m:знал|знала}. Не чтобы ты что-то {m:говорил|говорила}.' },
      { when: not(reconciled), text: '— Zwei Frauen in einer Küche, — говорит она. — Das geht bis Weihnachten. Nicht bis zum Frühling. Eine von uns wird gehen müssen. Und es ist mein Haus.\n\nДве женщины на одной кухне. До Рождества так можно. До весны — нет. Одной из нас придётся уйти. И это мой дом.' },
      { when: v('w.c29_cow', 'saved'), text: '— Die Kuh hat sie gerettet. Das vergesse ich nicht.\n\nКорову спасла она. Этого я не забуду.' },
      { when: v('w.c29_cow', 'quarter'), text: '— Die Kuh gibt ein Drittel weniger. Das hätte nicht sein müssen. Aber sie hat es allein versucht. Die ganze Nacht.\n\nКорова даёт на треть меньше. Этого могло не быть. Но она пыталась одна. Всю ночь.' },
    ],
    actions: [
      { id: 'c31_hae_need', label: 'Сказать: Эва нужна этому дому', minutes: 20, terminal: true,
        outcomes: [
          { id: 'yes', when: reconciled, goto: 'c31_a_late', text: 'Хенрике кивает, будто ты {m:подтвердил|подтвердила} то, что она и так знала.\n\n— Ja. Und sie weiß es nicht. Sag es ihr nicht. Sonst wird sie frech.\n\nДа. И она этого не знает. Не говори ей. А то обнаглеет.\n\nВ голосе почти смех.',
            effects: [set31('hae', 'need'), w31('eva_spring', 'yes'), npc('henrike', 1), until31(19, 55)] },
          { id: 'tense', goto: 'c31_a_late', text: '— Nötig, — повторяет Хенрике. — Ich bin auch nötig. Dreißig Jahre nötig.\n\nНужна. Я тоже нужна. Тридцать лет нужна.\n\nОна уходит в дом первой. Засов так и остаётся непроверенным.',
            effects: [set31('hae', 'need'), w31('eva_spring', 'tense'), npc('henrike', -1), until31(19, 50)] },
        ] },
      { id: 'c31_hae_ask', label: 'Спросить, что ей на самом деле мешает', minutes: 25, terminal: true, outcomes: toLateA,
        text: 'Хенрике думает долго.\n\n— Sie ist jünger. Sie kocht besser. Und das Kind lacht über ihre Witze. — Пауза. — Das ist alles. Das ist dumm, ich weiß.\n\nОна моложе. Она лучше готовит. И девочка смеётся над её шутками. Вот и всё. Это глупо, я знаю.\n\nОна говорит это и сразу выглядит легче. Как будто сняла тяжёлую корзину.',
        effects: [set31('hae', 'ask'), w31('eva_spring', 'talk'), npc('henrike', 2), until31(19, 55)] },
      { id: 'c31_hae_quiet', label: 'Промолчать: это их дело', minutes: 10, terminal: true, outcomes: toLateA,
        text: 'Ты молчишь. Хенрике тоже. Потом она трогает засов, который проверять не нужно, и уходит в дом.',
        effects: [set31('hae', 'quiet'), w31('eva_spring', 'silent'), until31(19, 45)] },
    ] }),

  X({ id: 'c31_hb_eva', title: 'Хозяйство', camp: kitchen14,
    text: [
      { text: 'Эва ждёт тебя в швейной с листком в руках. Бланк из ратуши Йестебурга, который раздавали на собрании: «Haushalt — Personen — Zuteilung». Хозяйство, люди, паёк.' },
      { text: '— Brandt schreibt Haushalte auf. Ich gehöre zu keinem. Helmut ist tot, und ich bin nirgends. Auf dem Papier bin ich nirgends.\n\nБрандт записывает хозяйства. Я ни к какому не отношусь. Хельмут умер, а я нигде. На бумаге я нигде.' },
      { when: flag('w.c29_eva_mitts'), text: 'На печке за её спиной сохнут серые варежки. После ночи они стали жёсткими и пахнут дымом.' },
    ],
    actions: [
      { id: 'c31_hbe_henrike', label: 'Пойти к Хенрике: пусть впишет Эву в хозяйство Людеман', minutes: 20, terminal: true,
        outcomes: [
          { id: 'sign', when: any(reconciled, v('w.c31_eva_spring', 'yes'), v('w.c31_eva_spring', 'talk')), goto: 'c31_b_late', text: 'Хенрике надевает очки, читает бланк от начала до конца. Потом пишет: «Lüdemann, Henrike. Lüdemann-Hof: Eva Hollmann, Witwe». И расписывается так, что продавливает бумагу.\n\nЭва смотрит на свою фамилию на чужом хозяйстве и не может ничего сказать.',
            effects: [set31('hbe', 'henrike'), w31('eva_list', 'farm'), npc('c8_eva', 2), until31(19, 55)] },
          { id: 'later', goto: 'c31_b_late', text: '— Morgen, — говорит Хенрике, не поднимая глаз от вязания. Завтра.\n\nЭва забирает бланк и кладёт в наволочку, к часам Хельмута. «Morgen» у Хенрике может значить что угодно.',
            effects: [set31('hbe', 'henrike'), w31('eva_list', 'later'), until31(19, 50)] },
        ] },
      { id: 'c31_hbe_own', label: 'Помочь вписать её отдельно: вдова, своё хозяйство', minutes: 20, terminal: true, outcomes: toLateB,
        text: '«Hollmann, Eva. Witwe. Eine Person». Ты пишешь печатными буквами. Своя карточка, свой паёк, ничья. Эва благодарит. Потом сидит над бланком и говорит: «Eine Person. Das sieht so wenig aus». Один человек. Как это мало выглядит.',
        effects: [set31('hbe', 'own'), w31('eva_list', 'own'), npc('c8_eva', 1), until31(19, 50)] },
      { id: 'c31_hbe_wait', label: 'Сказать: подождём до весны, бумага не горит', minutes: 10, terminal: true, outcomes: toLateB,
        text: 'Эва кивает и убирает бланк. Но ты видишь: она перечитывает его ещё раз, прежде чем убрать.',
        effects: [set31('hbe', 'wait'), w31('eva_list', 'none'), until31(19, 45)] },
    ] }),

  // ───────────── Кася ─────────────
  X({ id: 'c31_ha_kasia', title: 'Камень', camp: yard14, ambient: frost31,
    text: [
      { when: not(timColony), text: 'После ужина Кася выходит к груше. Ты выходишь следом: одной у могилы в темноте плохо.' },
      { when: timColony, text: 'После ужина Кася стоит у ворот, лицом к насыпи, где под ольхой лежит Тим. Ты выходишь следом.' },
      { when: v('w.c28_tim_cross', 'stone'), text: 'На плоском камне при свете фонаря видно имя и ежа, нацарапанного гвоздём. Иней набился в царапины, и ёж белый.' },
      { when: kasiaRoad('list'), text: '— Am Zehnten gehe ich. Und er bleibt hier. Wer redet dann mit ihm?\n\nДесятого я уйду. А он останется здесь. Кто тогда будет с ним разговаривать?' },
      { when: kasiaRoad('stay'), text: '— Ich bleibe bis zum Frühling. Und ich will nicht nur nähen. Zeig mir, wie man Holz hackt. Tim hat immer gesagt, ich halte die Axt wie eine Gabel.\n\nЯ остаюсь до весны. И не хочу только шить. Покажи, как колоть дрова. Тим всегда говорил, что я держу топор, как вилку.' },
      { when: not(any(kasiaRoad('list'), kasiaRoad('stay'))), text: '— Würdest du gehen? An meiner Stelle? Sag es einfach. Ich mache dann das Gegenteil, oder auch nicht.\n\nТы бы {m:ушёл|ушла}? На моём месте? Просто скажи. А я потом сделаю наоборот. Или нет.' },
    ],
    actions: [
      { id: 'c31_hak_promise', label: 'Пообещать: я буду к нему приходить', when: kasiaRoad('list'), minutes: 20, terminal: true, outcomes: toLateA,
        text: '— Jeden Tag?\n\nКаждый день?\n\n— Каждое воскресенье, — говоришь ты, потому что не хочешь врать.\n\nКася кивает. Воскресенье её устраивает больше. Каждый день — это было бы враньё, и она бы это поняла.',
        effects: [set31('hak', 'promise'), w31('kasia_grave', 'sunday'), npc('kasia', 2), until31(19, 55)] },
      { id: 'c31_hak_drawing', label: 'Сказать: гармошку возьми, а ежа оставь ему', when: kasiaRoad('list'), minutes: 20, terminal: true, outcomes: toLateA,
        text: 'Кася думает. Потом кивает. Завтра рисунок в рамке или без переедет из комнаты под лестницей в жестяную коробку под камень. «Dann hat er was zu gucken». Пусть ему будет на что смотреть.',
        effects: [set31('hak', 'drawing'), w31('kasia_grave', 'drawing'), npc('kasia', 1), until31(19, 55)] },
      { id: 'c31_hak_axe', label: 'Учить её колоть дрова прямо сейчас, при фонаре', when: kasiaRoad('stay'), minutes: 25, terminal: true, outcomes: toLateA, ambientDuring: frost31,
        text: 'Колода, полено, топор. Не замахиваться из-за головы. Смотреть на место, куда бьёшь, а не на топор. Первые три раза Кася попадает в колоду. Четвёртое полено раскалывается пополам, со звоном. Она стоит над ним и смеётся, впервые с похорон, громко, на весь двор.',
        effects: [set31('hak', 'axe'), w31('kasia_axe', true), npc('kasia', 2), { body: 'fatigue', delta: 2 }, until31(19, 55)] },
      { id: 'c31_hak_tomorrow', label: 'Сказать: завтра, при свете', when: kasiaRoad('stay'), minutes: 10, terminal: true, outcomes: toLateA,
        text: '— Morgen, — повторяет Кася. — Gut. Morgen. Ich habe Zeit. Ich habe jetzt viel Zeit.\n\nЗавтра. Хорошо. Время у меня есть. Теперь у меня много времени.',
        effects: [set31('hak', 'tomorrow'), until31(19, 45)] },
      { id: 'c31_hak_go', label: 'Сказать: я бы {m:ушёл|ушла} домой', when: not(any(kasiaRoad('list'), kasiaRoad('stay'))), minutes: 20, terminal: true, outcomes: toLateA,
        text: 'Кася слушает. Потом достаёт из кармана огрызок карандаша, тот самый, Мирека, и долго вертит в пальцах.\n\n— Dann mit Kuli, — говорит она. — Am Zehnten.\n\nТогда ручкой. Десятого.',
        effects: [set31('hak', 'go'), w31('kasia_advice', 'go'), npc('kasia', 1), until31(19, 55)] },
      { id: 'c31_hak_stay', label: 'Сказать: я бы {m:остался|осталась} с ним до весны', when: not(any(kasiaRoad('list'), kasiaRoad('stay'))), minutes: 20, terminal: true, outcomes: toLateA,
        text: 'Кася смотрит на могилу.\n\n— Bis zum Frühling. Dann ist die Erde weich. Dann kann ich ihm Blumen pflanzen.\n\nДо весны. Тогда земля мягкая. Тогда я смогу посадить ему цветы.',
        effects: [set31('hak', 'stay'), w31('kasia_advice', 'stay'), npc('kasia', 2), until31(19, 55)] },
    ] }),

  X({ id: 'c31_hb_kasia', title: 'Конверт', camp: kitchen14,
    text: [
      { when: letter, text: 'Кася ждёт тебя у лестницы с конвертом. На конверте адрес по-польски и ниже, печатными буквами, по-немецки: «Stettin».' },
      { when: not(letter), text: 'Кася ждёт тебя у лестницы с листком, сложенным вчетверо. Она дописала его сегодня, пока вас не было ночью и пока ждала утром. Три строчки.' },
      { text: '— Wenn einer von euch nach Winsen fährt. Mirek ist am Bahnhof, im alten Lokschuppen, bei den Polen. Er nimmt Post mit, wenn sie gehen.\n\nЕсли кто-то из вас поедет в Винзен. Мирек на вокзале, в старом депо, у поляков. Он возьмёт почту, когда они пойдут.' },
      { when: kasiaRoad('list'), text: '— Ich könnte es selbst mitnehmen. Aber ich will, dass es vor mir ankommt. Dass sie es weiß, bevor ich vor der Tür stehe.\n\nЯ могла бы отнести сама. Но я хочу, чтобы письмо пришло раньше меня. Чтобы она знала, прежде чем я встану у двери.' },
    ],
    actions: [
      { id: 'c31_hbk_take', label: 'Взять письмо и пообещать отдать Миреку в руки', minutes: 15, terminal: true, outcomes: toLateB,
        text: 'Ты кладёшь конверт во внутренний карман, к документам. Кася смотрит, куда именно, и кивает: правильно, там не потеряется.',
        effects: [set31('hbk', 'take'), w31('kasia_mail', 'promised'), npc('kasia', 2), until31(19, 50)] },
      { id: 'c31_hbk_try', label: 'Сказать честно: возьму, но обещать не могу', minutes: 15, terminal: true, outcomes: toLateB,
        text: '— Gut. Ehrlich ist besser. — Она отдаёт конверт. — Wenn es nicht geht, bring es zurück. Nicht wegwerfen.\n\nХорошо. Честно лучше. Если не выйдет, принеси обратно. Не выбрасывай.',
        effects: [set31('hbk', 'try'), w31('kasia_mail', 'try'), npc('kasia', 1), until31(19, 50)] },
      { id: 'c31_hbk_pack', label: 'Спросить, что она возьмёт с собой', when: kasiaRoad('list'), minutes: 20, terminal: true, outcomes: toLateB,
        text: 'Кася загибает пальцы. Гармошка. Рисунок или нет, ещё не решила. Тёплые носки, которые связала Хенрике. Фотография, где они втроём с Дариушем на Эльбе. И больше ничего: Мирек сказал, один рюкзак. Хомяка она не возьмёт. Это она говорит отдельно и быстро.',
        effects: [set31('hbk', 'pack'), w31('kasia_mail', 'self'), until31(19, 50)] },
    ] }),

  // ───────────── Лея ─────────────
  X({ id: 'c31_ha_lea', title: 'Чужой', camp: yard14, ambient: frost31,
    text: [
      { when: rule('all'), text: 'За день на кухне у Леи перебывало семь человек: трое из цепи с белыми пальцами, мальчишка с ожогом, две старухи с кашлем, Кёлер на перевязку. Хенрике варила им чай и пересчитывала бинты. Бинтов осталось на два дня.' },
      { when: rule('village'), text: 'За день на кухне у Леи перебывало четверо, все из Люллау и Вёрме. Лея записывала каждого на крышке коробки. Двоих из Гарльсторфа Хенрике у ворот отправила в Йестебург.' },
      { when: rule('ours'), text: 'За день к Лее не пустили никого. Двоих она отправила в Йестебург, не открывая сумки. Один вернулся злой и долго стоял у ворот.' },
      { when: not(any(rule('all'), rule('village'), rule('ours'))), text: 'За день к Лее приходили двое. Она смотрела их в сенях, на сундуке, быстро и молча.' },
      { text: 'В восемь в ворота стучат. Мужчина из Гарльсторфа, с той стороны впадины. Правая нога обмотана мешком поверх сапога. Он прошёл четыре километра по полю.\n\n— Die Zehen. Ich spüre sie nicht mehr. Seit gestern Nacht.\n\nПальцы. Я их не чувствую. С прошлой ночи.' },
    ],
    actions: [
      { id: 'c31_hal_in', label: 'Впустить его: Лея посмотрит', minutes: 25, terminal: true, outcomes: toLateA,
        text: 'Лея разматывает мешок на кухне, на табурете. Два пальца белые, твёрдые. Она не растирает. Опускает ногу в таз с тёплой водой и держит его руку, пока он не перестаёт стонать. Потом говорит тебе одними губами: два пальца он потеряет. Остальные будут жить.',
        effects: [set31('hal', 'in'), w31('lea_far', 'in'), npc('c21_lea', 1), { if: rule('ours'), then: [npc('henrike', -1)] }, { body: 'stress', delta: 3 }, until31(19, 55)] },
      { id: 'c31_hal_barn', label: 'Отвести его в хлев и позвать туда Лею', minutes: 25, terminal: true, outcomes: toLateA,
        text: 'В хлеву Лея светит фонарём на ногу и качает головой. Тепло нужно сейчас, а не через полчаса. Она греет его ногу у себя под курткой, на животе, морщась от холода. «So macht man das», — говорит она тебе. Так делают.',
        effects: [set31('hal', 'barn'), w31('lea_far', 'barn'), npc('c21_lea', 1), until31(19, 55)] },
      { id: 'c31_hal_send', label: 'Отправить его в Йестебург: правило есть правило', minutes: 10, terminal: true, outcomes: toLateA,
        text: 'Он не спорит. Поворачивается и уходит по дороге, хромая. Лея стоит у окна кухни и смотрит ему вслед, пока он не скрывается за поворотом. Тебе она ничего не говорит.',
        effects: [set31('hal', 'send'), w31('lea_far', 'sent'), npc('c21_lea', -1), { body: 'stress', delta: 4 }, until31(19, 45)] },
    ] }),

  X({ id: 'c31_hb_lea', title: 'Поручение', camp: kitchen14,
    text: [
      { text: 'Лея садится к тебе на лавку с огрызком карандаша и бумажкой.' },
      { when: any(rule('all'), rule('village')), text: '— Binden, Jod, Fäden. Wenn einer nach Winsen fährt: das Rote Kreuz ist in der alten Sparkasse. Sag, es ist für Lüllau. Sag meinen Namen nicht, sag Sanders Namen.\n\nБинты, йод, нитки. Если кто-то поедет в Винзен: Красный Крест в старой сберкассе. Скажи, что это для Люллау. Моё имя не называй, называй имя Зандер.' },
      { when: any(v('w.c29_lea_road', 'convoy'), v('w.c29_lea_road', 'spring')), text: '— Und frag beim Militär nach Hannover. Ob Konvois fahren. Wann. Ob sie Leute mitnehmen.\n\nИ спроси у военных про Ганновер. Ходят ли колонны. Когда. Берут ли людей.' },
      { when: v('w.c29_lea_road', 'stay'), text: '— Ich gehe ja nicht. Aber ich will wissen, ob die Post nach Hannover geht. Ein Brief an Mama. Nur das.\n\nЯ ведь не ухожу. Но хочу знать, идёт ли почта в Ганновер. Письмо маме. Только это.' },
    ],
    actions: [
      { id: 'c31_hbl_bandage', label: 'Взять её список и обещать зайти в Красный Крест', minutes: 15, terminal: true, outcomes: toLateB,
        text: 'Список короткий, по-медицински точный: сколько метров, какой номер нити, какой процент йода. Ты складываешь его вдвое и кладёшь к своим документам.',
        effects: [set31('hbl', 'bandage'), w31('lea_errand', 'bandages'), npc('c21_lea', 1), until31(19, 50)] },
      { id: 'c31_hbl_hannover', label: 'Обещать спросить у военных про Ганновер', minutes: 15, terminal: true, outcomes: toLateB,
        text: 'Лея кивает и вдруг отводит глаза.\n\n— Und wenn sie sagen, Linden gibt es nicht mehr… sag es mir trotzdem. Nicht schonen.\n\nА если скажут, что Линдена больше нет… всё равно скажи. Не жалей.',
        effects: [set31('hbl', 'hannover'), w31('lea_errand', 'hannover'), npc('c21_lea', 2), until31(19, 50)] },
      { id: 'c31_hbl_unknown', label: 'Сказать: ещё не знаю, кто из нас поедет', minutes: 10, terminal: true, outcomes: toLateB,
        text: '— Klar. — Лея складывает бумажку и прячет в карман парки. — Dann gebe ich sie dem, der fährt.\n\nКонечно. Тогда отдам тому, кто поедет.',
        effects: [set31('hbl', 'unknown'), until31(19, 45)] },
    ] }),
];
