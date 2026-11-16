import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, tense14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { wayHide } from './point22';
import { S24, halfRation, leaFound, marcusTaken, monShut, set24, snow24, until24, w24 } from './point24';

// Участок 24, линия B: утро с Леей или Лео, ворота (общая сцена), деревня с Кёлер: паёк, школа Брандта, пункт, Кирхвег.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S24({ ...scene, for: 'any', chapter: 'ch3' });
const jest = 'c16_jesteburg';
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => B({ ...scene, location: jest, camp: scene.camp ?? { at: jest, stock: 'c3_farm_stock', rest: false }, safe: false });
const leaHome: Cond = wayHide;
const guestsShed: Cond = v('w.c23_guests', 'shed');
const leaSchool: Cond = any(v('w.c24_lea', 'brandt'), v('w.c22_lea_at', 'brandt'));
const leaPoint: Cond = any(v('w.c24_lea', 'sander'), v('w.c22_lea_at', 'sander'));
const leaJestNow: Cond = any(leaSchool, leaPoint);

export const day24BScenes: Scene[] = [
  B({ id: 'c24_b_prep', title: 'До десяти', camp: kitchen14,
    text: [
      { when: all(leaHome, not(monShut)), text: 'Лея сидит на краю кровати в швейной комнате, уже одетая. Она знает про понедельник.\n\n— Wenn der Hund kommt, gehe ich raus. Selbst. Ich will nicht, dass sie euch wegen mir etwas wegnehmen.\n\nЕсли придёт собака, я выйду. Сама. Не хочу, чтобы из-за меня у вас что-то отобрали.' },
      { when: all(leaHome, monShut), text: 'Лея стоит у окна и смотрит на запертые ворота.\n\n— Ihr macht nicht auf? Wegen mir?\n\nВы не откроете? Из-за меня?' },
      { when: all(not(leaHome), guestsShed), text: 'В отдельном сарае Маркус и Лео сидят на сене под одеялами. Лео рисует на дощатой стене угольком: дом, трубу, дым.' },
      { when: all(not(leaHome), not(guestsShed)), text: 'На кухне Эва чистит картошку, Нина считает чашки. Обычное утро. Только все говорят тише.' },
    ],
    actions: [
      { id: 'c24_bp_stay', label: 'Сказать Лее: сиди тихо, пока не позовём', when: leaHome, minutes: 30, terminal: true, goto: 'c24_b_kitchen',
        text: 'Лея кивает. Но по тому, как она зашнуровывает ботинки, видно: решать она будет сама.', effects: [set24('bp', 'stay'), until24(9, 15)] },
      { id: 'c24_bp_coat', label: 'Дать ей куртку Хенрике и повязку Красного Креста', when: all(leaHome, not(monShut)), minutes: 25, terminal: true, goto: 'c24_b_kitchen',
        text: 'Повязку ты достаёшь из её парки. Красный крест на белом, грязный по краям. Лея повязывает её на рукав куртки Хенрике, медленно, как форму.\n\n— Wenn schon, dann so. — Если уж выходить, то так.', effects: [set24('bp', 'coat'), w24('lea_armband', true), npc('c21_lea', 2), until24(9, 15)] },
      { id: 'c24_bp_leo', label: 'Посидеть с Лео в сарае', when: all(not(leaHome), guestsShed), minutes: 30, terminal: true, goto: 'c24_b_kitchen',
        text: 'Ты садишься на сено рядом. Лео показывает рисунок: дом, трубу, четверых. Маркус смотрит в щель между досками на дорогу и не оборачивается.', effects: [set24('bp', 'leo'), npc('c12_leo', 1), until24(9, 15)] },
      { id: 'c24_bp_tea', label: 'Поставить чайник: Брандту предложат чаю', when: not(leaHome), minutes: 20, terminal: true, goto: 'c24_b_kitchen',
        text: 'Ты ставишь чайник и достаёшь лучшие чашки Хенрике, с синим ободком. Если уж придут, пусть увидят, что здесь живут люди.', effects: [set24('bp', 'tea'), w24('tea_ready', true), until24(9, 10)] },
    ] }),

  B({ id: 'c24_b_kitchen', title: 'Кто что скажет', camp: kitchen14,
    text: [
      { text: 'Нина садится напротив, Эва у плиты.' },
      { text: '— Если меня спросят, кто я, — говорит Нина, — я скажу правду. Дочь Йенса. Сирота. Живу здесь. Это ведь правда?\n\nЭто правда.' },
      { when: { npc: 'c8_eva', alive: true }, text: 'Эва вытирает руки.\n\n— Ich stehe auf der Liste. Ich habe nichts zu verstecken. Außer meinem Mann im Brunnen.\n\nЯ в списке. Мне нечего прятать. Кроме мужа в колодце.' },
    ],
    actions: [
      { id: 'c24_bk_nina', label: 'Сказать Нине: говори правду, коротко', minutes: 20, terminal: true, goto: 'c24_gate',
        text: 'Нина кивает и повторяет вслух по-немецки: «Nina. Tochter von Jens. Ich wohne hier». Три раза, пока не получается ровно.', effects: [set24('bk', 'nina'), npc('c7_nina', 1), until24(9, 50)] },
      { id: 'c24_bk_upstairs', label: 'Отправить Нину наверх: с Брандтом будут говорить взрослые', minutes: 15, terminal: true, goto: 'c24_gate',
        text: '— Опять наверх, — говорит Нина. Но идёт. С лестницы, сквозь балясины, будет видно всё.', effects: [set24('bk', 'upstairs'), npc('c7_nina', -1), until24(9, 50)] },
      { id: 'c24_bk_eva', label: 'Попросить Эву встретить Брандта у дверей: её он знает', when: { npc: 'c8_eva', alive: true }, minutes: 15, terminal: true, goto: 'c24_gate',
        text: 'Эва снимает фартук и надевает его снова.\n\n— Gut. Ich mache ihm Tee. Wer Tee trinkt, schreit nicht.\n\nХорошо. Я сделаю ему чай. Кто пьёт чай, тот не кричит.', effects: [set24('bk', 'eva'), npc('c8_eva', 1), until24(9, 50)] },
    ] }),

  // ───────────── Деревня ─────────────
  J({ id: 'c24_b_village', title: 'Очередь за пайком', ambient: snow24,
    text: [
      { text: 'Кёлер ждёт у калитки с корзиной. Четыре километра по снегу. Она идёт быстро, по-деревенски, и говорит про тесто.' },
      { text: 'У пожарной части очередь. Дружинник с папкой выкликает дворы. Рядом стоит автобус с запотевшими окнами. В нём сидят трое из деревни. Одна женщина держит на коленях сумку и смотрит прямо перед собой.' },
      { when: halfRation, text: '— Lüdemann-Hof. Halbe Ration. Zwei Wochen.\n\nХутор Людеманов. Половина пайка. Две недели.\n\nДружинник отсчитывает буханку, полкило крупы, банку тушёнки. Кёлер молча кладёт в твою корзину свою половину буханки.' },
      { when: not(halfRation), text: '— Lüdemann-Hof. Volle Ration.\n\nХутор Людеманов. Полный паёк.\n\nДве буханки, кило крупы, две банки тушёнки, пакет сухого молока.' },
      { text: 'Очередь за пайком длинная, люди стоят молча, переминаясь. Женщина впереди держит за руку мальчика, и он считает вслух снежинки на её рукаве.' },
      { when: v('$.c24_bs', 'ask'), text: 'Брандт так и не ответил тебе, что делают с переболевшими в Люнебурге. Только посмотрел и закрыл папку.' },
      { when: v('$.c24_bs', 'none'), text: '«У нас никто не болел», — сказал{m:|а} ты. Брандт записал это, не поднимая глаз.' },
    ],
    actions: [
      { id: 'c24_bv_take', label: 'Забрать паёк и идти дальше', minutes: 30, terminal: true, outcomes: [{ id: 's', when: any(leaJestNow, marcusTaken), goto: 'c24_b_school' }, { id: 'p', goto: 'c24_b_point' }],
        text: 'Ты укладываешь паёк в корзину. Корзина тяжёлая. Кёлер берёт её за вторую ручку.', effects: [set24('bv', 'take'), { if: halfRation, then: [{ give: 'c16_bread', qty: 1 }, { give: 'oats', qty: 1 }], else: [{ give: 'c16_bread', qty: 2 }, { give: 'oats', qty: 2 }] }, until24(12, 0)] },
      { id: 'c24_bv_bus', label: 'Подойти к автобусу и спросить женщину с сумкой', minutes: 40, terminal: true, outcomes: [{ id: 's', when: any(leaJestNow, marcusTaken), goto: 'c24_b_school' }, { id: 'p', goto: 'c24_b_point' }],
        text: '— Ich war im Oktober krank. Eine Woche. — Женщина не поворачивает головы. — Mein Mann ist tot. Meine Tochter kriegt doppelte Ration. Das ist alles.\n\nЯ болела в октябре. Неделю. Муж умер. Дочь получит двойной паёк. Вот и всё.\n\nПаёк ты забираешь потом, последней.', effects: [set24('bv', 'bus'), w24('bus_woman', true), { if: halfRation, then: [{ give: 'c16_bread', qty: 1 }, { give: 'oats', qty: 1 }], else: [{ give: 'c16_bread', qty: 2 }, { give: 'oats', qty: 2 }] }, until24(12, 10)] },
    ] }),

  J({ id: 'c24_b_school', title: 'Школа', ambient: snow24,
    text: [
      { text: 'Двери спортзала открыты. Внутри тепло: у шведской стенки гудит печка-буржуйка. Шесть кроватей, на двух уже кто-то лежит, под капельницами.' },
      { when: leaSchool, text: 'Лея стоит у третьей кровати в белом халате поверх свитера. Не лежит. Стоит. Увидев тебя, она чуть заметно качает головой: не сейчас.' },
      { when: marcusTaken, text: 'Маркус сидит на скамейке у стены, отдельно, с градусником под мышкой. Рядом дружинник. Маркус видит тебя и спрашивает одними губами: «Leo?»' },
      { when: all(leaPoint, not(marcusTaken)), text: 'Леи здесь нет. Дружинник у дверей говорит: санитарка у доктора Зандер, в пункте у пожарной части.' },
    ],
    actions: [
      { id: 'c24_bs_leo', label: 'Сказать Маркусу: Лео у нас, с ним всё в порядке', when: marcusTaken, minutes: 20, terminal: true, goto: 'c24_b_point',
        text: 'Маркус закрывает глаза. Кивает. Дружинник смотрит на тебя, но не мешает.\n\n— Drei Tage, — говорит Маркус. — Wenn kein Fieber, lassen sie mich raus. Hat der Brandt gesagt.\n\nТри дня. Если не будет жара, отпустят. Брандт сказал.', effects: [set24('bs', 'leo'), w24('marcus_three_days', true), npc('c12_marcus', 2), until24(12, 40)] },
      { id: 'c24_bs_lea', label: 'Подойти к Лее, пока никто не смотрит', when: leaSchool, minutes: 20, terminal: true, goto: 'c24_b_point',
        text: '— Sie nehmen mir nichts ab. Noch nicht, — шепчет Лея. Не берут у меня кровь. Пока. — Brandt will warten, bis Mats Fieber hat. Mats hat kein Fieber. Er wird keins kriegen.\n\nБрандт хочет подождать, пока у Матса будет жар. У Матса нет жара. И не будет.\n\nОна возвращается к кровати, будто вы не разговаривали.', effects: [set24('bs', 'lea'), w24('lea_waits', true), npc('c21_lea', 2), until24(12, 40)] },
      { id: 'c24_bs_look', label: 'Постоять у двери и уйти', minutes: 10, terminal: true, goto: 'c24_b_point',
        text: 'Ты стоишь у двери. Капельница у второй кровати капает медленно, жёлтым. Тебя никто не замечает. Ты уходишь.', effects: [set24('bs', 'look'), until24(12, 30)] },
    ] }),

  J({ id: 'c24_b_point', title: 'Пункт', camp: tense14,
    text: [
      { text: 'В пункте у пожарной части доктор Зандер перевязывает старика с обмороженными пальцами.' },
      { when: leaPoint, text: 'У второго стола работает Лея. Без халата, в свитере, рукава закатаны. Видит тебя и улыбается. Здесь она улыбается.' },
      { text: 'Зандер, не оборачиваясь:\n\n— Sie. Die mit den Händen. Ab Mittwoch braucht Brandt von jedem Hof einen Menschen. Wenn das Ihrer ist — kommen Sie zu mir. Nicht in die Schule.\n\nВы. Та, что с руками. Со среды Брандту нужен человек с каждого двора. Если от вас пойдёте вы — приходите ко мне. Не в школу.' },
      { when: v('$.c24_bs', 'look'), text: 'В школу ты так и не {m:вошёл|вошла}. Постоял{m:|а} у двери и {m:ушёл|ушла}, и теперь это идёт за тобой.' },
    ],
    actions: [
      { id: 'c24_bpo_yes', label: 'Сказать: если от нас пойду я — приду к вам', minutes: 15, terminal: true, goto: 'c24_b_girl',
        text: 'Зандер кивает, будто вы подписали договор.\n\n— Sieben Uhr. Und bringen Sie Handschuhe mit, wenn Sie welche haben.\n\nВ семь. И принесите перчатки, если есть.', effects: [set24('bpo', 'yes'), w24('sander_wants_b', true), until24(13, 0)] },
      { id: 'c24_bpo_help', label: 'Остаться на час и помочь', minutes: 60, terminal: true, goto: 'c24_b_girl',
        text: 'Час проходит в бинтах и тазах. Старик с пальцами, ребёнок с ожогом, дружинник с порезом на ладони. В конце Зандер протягивает тебе кружку чая и галету.\n\n— Mittwoch. Sieben Uhr.\n\nСреда. Семь утра.', effects: [set24('bpo', 'help'), w24('sander_wants_b', true), w24('b_helped_point', true), { body: 'fatigue', delta: 4 }, until24(13, 50)] },
      { id: 'c24_bpo_girl', label: 'Спросить про заднюю комнату', minutes: 20, terminal: true, goto: 'c24_b_girl',
        text: '— Ein Mädchen, neun. Gebissen am Freitag. — Зандер смотрит на дверь. — Das Fieber kam am Samstag. Ich habe nichts mehr, was es aufhält.\n\nДевочка, девять лет. Укушена в пятницу. Жар пришёл в субботу. Мне больше нечем это задержать.', effects: [set24('bpo', 'girl'), w24('girl_back_room', true), { body: 'stress', delta: 2 }, until24(13, 0)] },
    ] }),

  J({ id: 'c24_b_kirch', title: 'Кирхвег, 4', ambient: snow24,
    text: [
      { text: 'По дороге назад ты сворачиваешь на Кирхвег. Дом четыре. Ставни закрыты. На двери записка: «Bitte klopfen. Laut». Пожалуйста, стучите. Громко.' },
      { text: 'Открывает пожилой мужчина в двух свитерах.\n\n— Meine Frau hat seit Mittwoch nichts. Die Ärztin hat auch nichts. Haben Sie… Sie sehen aus, als hätten Sie was.\n\nУ жены со среды ничего. У врача тоже ничего. У вас… Вы выглядите так, будто у вас что-то есть.' },
      { text: 'Дома, в кладовке, за банками с огурцами — десять шприц-ручек.' },
    ],
    actions: [
      { id: 'c24_bk2_three', label: 'Пообещать принести три ручки завтра', minutes: 15, terminal: true, goto: 'c24_b_back',
        text: 'Мужчина берёт тебя за руку обеими руками.\n\n— Drei. Das ist eine Woche. Danke.\n\nТри. Это неделя. Спасибо.\n\nТы уходишь и думаешь о Мерле. Десять минус три — семь.', effects: [set24('bk2', 'three'), w24('kirch_three', true), until24(13, 40)] },
      { id: 'c24_bk2_one', label: 'Сказать: одну. Больше не могу', minutes: 15, terminal: true, goto: 'c24_b_back',
        text: '— Eine, — повторяет мужчина. Одну. — Zwei Tage. Gut. Zwei Tage sind zwei Tage.\n\nДва дня. Хорошо. Два дня — это два дня.', effects: [set24('bk2', 'one'), w24('kirch_one', true), until24(13, 35)] },
      { id: 'c24_bk2_no', label: 'Сказать: у меня ничего нет', minutes: 10, terminal: true, goto: 'c24_b_back',
        text: 'Мужчина кивает и закрывает дверь. Медленно. Записку на двери он не снимает.', effects: [set24('bk2', 'no'), { body: 'stress', delta: 3 }, until24(13, 25)] },
    ] }),

  B({ id: 'c24_b_back', title: 'Дорога домой', camp: kitchen14,
    text: [
      { text: 'Обратно вы с Кёлер идёте медленнее. Корзина тяжелее. Снег снова пошёл.' },
      { text: '— Weißt du, — говорит Кёлер, — mein Werner hat immer gesagt: auf dem Land überlebt man nicht allein. Man überlebt zusammen oder gar nicht.\n\nЗнаешь, мой Вернер всегда говорил: в деревне в одиночку не выживешь. Выживают вместе или никак.' },
      { when: v('w.c24_marcus', 'taken'), text: 'Дома тебя ждёт Лео. Он стоит у ворот в валенках Хенрике, с рисунком в руке.' },
    ],
    actions: [
      { id: 'c24_bb_koehler', label: 'Отдать Кёлер половину буханки обратно', when: halfRation, minutes: 15, terminal: true, outcomes: [{ id: 'split', when: halfRation, goto: 'c24_b_split' }, { id: 'ute', goto: 'c24_y_b_nina' }],
        text: '— Nein, — говорит Кёлер. — Ich backe. Ihr nicht.\n\nНет. Пеку я. Не вы.\n\nОна уходит к своей калитке, не оборачиваясь.', effects: [set24('bb', 'koehler'), npc('c3_koehler', 2), until24(14, 50)] },
      { id: 'c24_bb_leo', label: 'Взять у Лео рисунок', when: v('w.c24_marcus', 'taken'), minutes: 15, terminal: true, outcomes: [{ id: 'split', when: halfRation, goto: 'c24_b_split' }, { id: 'ute', goto: 'c24_y_b_nina' }],
        text: 'На рисунке дом, труба, дым. У дома пятеро: двое больших, двое средних, один маленький. Маленький держит за руку того, что повыше. Подписано: «Marcus kommt wieder». Маркус вернётся.', effects: [set24('bb', 'leo'), w24('leo_drawing', true), npc('c12_leo', 2), until24(14, 50)] },
      { id: 'c24_bb_stock', label: 'Разложить паёк по полкам', minutes: 20, terminal: true, outcomes: [{ id: 'split', when: halfRation, goto: 'c24_b_split' }, { id: 'ute', goto: 'c24_y_b_nina' }],
        text: 'Хлеб в ларь, крупу в банки, тушёнку на верхнюю полку. Нина записывает в тетрадь, сколько чего. Её почерк ровнее твоего.', effects: [set24('bb', 'stock'), npc('c7_nina', 1), until24(14, 50)] },
      { id: 'c24_bb_sit', label: 'Сесть у печи и отогреть руки', minutes: 20, terminal: true, outcomes: [{ id: 'split', when: halfRation, goto: 'c24_b_split' }, { id: 'ute', goto: 'c24_y_b_nina' }],
        text: 'Пальцы отходят медленно, с болью. Ты сидишь, пока их не перестаёт ломить.', effects: [set24('bb', 'sit'), { body: 'stress', delta: -1 }, until24(14, 50)] },
    ] }),
  B({ id: 'c24_b_dusk', title: 'До ужина', camp: kitchen14,
    text: [
      { text: 'Темнеет. В доме топится печь, и от тепла клонит в сон.' },
      { when: all(leaHome, not(leaFound)), text: 'Лея выходит из своего укрытия только к сумеркам. Волосы в паутине, на коленях пыль. Брандт её не нашёл.' },
      { when: flag('w.c24_kirch_three'), text: 'Три шприц-ручки для Кирхвег надо отложить отдельно. Завтра кто-то должен их отнести.' },
    ],
    actions: [
      { id: 'c24_bd_lea', label: 'Отряхнуть Лею и посадить к печи', when: all(leaHome, not(leaFound)), minutes: 30, terminal: true, goto: 'c24_y_b_goats',
        text: 'Лея садится к печи и протягивает к огню руки. Пальцы у неё дрожат, и она прячет их между колен.\n\n— Der Hund hat zweimal geschnüffelt. An der Wand. Zweimal.\n\nСобака дважды нюхала. У стены. Дважды.', effects: [set24('bd', 'lea'), npc('c21_lea', 2), until24(16, 20)] },
      { id: 'c24_bd_pens', label: 'Отложить три ручки в отдельную коробку', when: flag('w.c24_kirch_three'), minutes: 15, terminal: true, goto: 'c24_y_b_goats',
        text: 'Три ручки — в жестяную коробку из-под чая. Остальные семь — обратно за банки. Ты подписываешь коробку карандашом: «Kirchweg 4».', effects: [set24('bd', 'pens'), w24('pens_set_aside', true), until24(16, 20)] },
      { id: 'c24_bd_nap', label: 'Лечь на час', minutes: 5, terminal: true, goto: 'c24_y_b_goats',
        text: 'Ты засыпаешь поверх одеяла и просыпаешься от запаха картошки.', effects: [set24('bd', 'nap'), until24(16, 20, true)] },
      { id: 'c24_bd_nina', label: 'Посидеть с Ниной над её тетрадью', minutes: 40, terminal: true, goto: 'c24_y_b_goats',
        text: 'Нина решает задачи по математике из учебника за восьмой класс. Сама, для себя. Ты помогаешь с одной. Вторую она решает быстрее тебя и смотрит снисходительно.', effects: [set24('bd', 'nina'), npc('c7_nina', 1), { body: 'stress', delta: -2 }, until24(16, 20)] },
    ] }),
];
