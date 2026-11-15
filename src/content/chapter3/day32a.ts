import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import {
  S32, cold32, deniz32, fed32, finish32, frost32, gerdStairs, jest32, kerem32, mailbag32, mapA, own32, pKnown32, set32, truck32, until32,
  volunteerA, w32, ws32,
} from './point32';

// Участок 32, линия A: Бухгольц. Центр — Герд на лестнице и решение A (нить первого дня: `A.ignored_ilse`, `A.left_ilse`).
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S32({ ...scene, for: 'any', chapter: 'ch3' });
const trip = (at: string, rest: false | 'sleep' = false) => ({ at, stock: 'c3_farm_stock', rest });
const both: Cond = all(deniz32, kerem32);
const keremOnly: Cond = all(kerem32, not(deniz32));
const denizOnly: Cond = all(deniz32, not(kerem32));
const ilseLeft: Cond = any(flag('A.left_ilse'), flag('A.ignored_ilse'));
const ilseFate = (x: string): Cond => v('w.c18_ilse', x);
const gerdWritten: Cond = flag('w.c20_gerd_written');
const brockNote: Cond = any(flag('w.c19_brockmann_note'), flag('w.c19_brockmann_answer'));
const listed: Cond = flag('w.c22_deniz_listed');
const gerdDone: Cond = any(own32('st', 'end'), own32('st', 'kerem'));
const gerdLocked: Cond = own32('st', 'lock');

export const day32AScenes: Scene[] = [
  // ═════════════ Среда ═════════════
  A({ id: 'c32_a_van', title: 'Фургон', camp: yard14, ambient: frost32,
    text: [
      { when: deniz32, text: 'Половина седьмого, ещё темно. У ворот урчит белый «Транзит». Дениз за рулём, в комбинезоне поверх куртки.' },
      { when: both, text: 'Керем на пассажирском месте сдвигается к середине, освобождая тебе окно.' },
      { when: keremOnly, text: 'У ворот урчит фургон, чужой, с надписью пекарни. За рулём Керем: «Транзит» брата он водит, как свой, только лучше.' },
      { when: not(any(deniz32, kerem32)), text: 'У ворот урчит фургон пожарной дружины. За рулём Яннес: Зандер очень нужен генератор.' },
      { when: all(deniz32, volunteerA), text: '— Hab ich doch gesagt, — говорит Дениз, ни к кому не обращаясь. Я же говорил.' },
      { when: all(deniz32, not(volunteerA)), text: '— Hat Henrike dich geschickt? — спрашивает Дениз и сам себе кивает. Тебя Хенрике послала? — Egal. Hände sind Hände.\n\nНеважно. Руки есть руки.' },
      { text: 'Хенрике передаёт в окно свёрток: хлеб, сало, термос.\n\n— Bis Donnerstag. Und bringt die Säge mit, die Deniz mir schuldet.\n\nДо четверга. И привезите пилу, которую мне должен Дениз.' },
    ],
    actions: [
      { id: 'c32_av_window', label: 'Сесть у окна и смотреть на дорогу', minutes: 30, terminal: true, goto: 'c32_a_road', ambientDuring: truck32,
        text: 'Фургон выползает на дорогу. Хутор в зеркале становится тёмным пятном, потом его закрывает лес.', effects: [set32('av', 'window'), { move: 'c7_farm_lane' }, until32(32, 7, 15)] },
      { id: 'c32_av_map', label: 'Достать карту постов и показать Денизу', when: mapA, minutes: 30, terminal: true, goto: 'c32_a_road', ambientDuring: truck32,
        text: 'Ты разворачиваешь карту на коленях. Дениз косится, хмыкает и тычет пальцем в кружок у Холм-Зеппензена.\n\n— Da stehen sie seit Montag. Und hier? Nichts? Dann fahren wir hier.\n\nТам они с понедельника. А тут? Ничего? Тогда едем тут.', effects: [set32('av', 'map'), set32('avoided_post', true), { move: 'c7_farm_lane' }, until32(32, 7, 15)] },
      { id: 'c32_av_sleep', label: 'Устроиться сзади на мешках и доспать', minutes: 30, terminal: true, goto: 'c32_a_road', ambientDuring: truck32,
        text: 'Сзади пахнет маслом и резиной. Ты ложишься на мешки с ветошью и засыпаешь под стук инструмента в ящиках.', effects: [set32('av', 'sleep'), { body: 'fatigue', delta: -6 }, { move: 'c7_farm_lane' }, until32(32, 7, 15, true)] },
    ] }),

  A({ id: 'c32_a_road', title: 'Дорога', location: 'c7_farm_lane', camp: trip('c7_farm_lane'), safe: false, ambient: truck32,
    text: [
      { when: flag('$.c32_avoided_post'), text: 'Вы едете лесными дорогами, через Тостедтский лес, без постов. Дважды приходится вылезать и оттаскивать с дороги упавшую сосну. Один раз за деревьями на поляне что-то двигается, медленно, в сторону шума, но вы уже проехали.' },
      { when: not(flag('$.c32_avoided_post')), text: 'У Холм-Зеппензена шлагбаум из бревна и двое в форме. Один светит фонарём в кабину и сверяет лица со списком на планшете.' },
      { when: all(not(flag('$.c32_avoided_post')), listed), text: '— Aydın, Deniz. Genesen, — читает он вслух и смотрит на Дениза дольше, чем на остальных. Выздоровевший. — Wohin?\n\nКуда?' },
      { when: all(not(flag('$.c32_avoided_post')), not(listed)), text: '— Wohin? — спрашивает он. Куда?' },
      { when: v('$.c32_av', 'window'), text: 'Хутор в зеркале давно исчез. Ты всё ещё смотришь назад.' },
      { when: v('$.c32_av', 'sleep'), text: 'Ты просыпаешься на мешках от того, что фургон тормозит.' },
    ],
    actions: [
      { id: 'c32_ar_quiet', label: 'Молчать и смотреть вперёд', minutes: 60, terminal: true, goto: 'c32_a_town',
        text: 'Говорят за тебя. Шлагбаум, или сосна, или поворот остаются позади. К половине девятого впереди серые крыши Бухгольца.', effects: [set32('ar', 'quiet'), { move: ws32 }, until32(32, 8, 30)] },
      { id: 'c32_ar_paper', label: 'Показать бумагу пункта: генератор для доктора Зандер', when: not(flag('$.c32_avoided_post')), minutes: 60, terminal: true, goto: 'c32_a_town',
        text: 'Ты протягиваешь записку с печатью дружины. Солдат читает, переворачивает, читает ещё раз.\n\n— Sanitätsstelle. Gut. Rückfahrt bis Donnerstag Abend, sonst steht ihr auf der Liste.\n\nМедпункт. Хорошо. Обратно до вечера четверга, иначе будете в списке.\n\nШлагбаум поднимают.', effects: [set32('ar', 'paper'), { move: ws32 }, until32(32, 8, 30)] },
      { id: 'c32_ar_talk', label: 'Спросить солдат, что в Бухгольце', when: not(flag('$.c32_avoided_post')), minutes: 60, terminal: true, goto: 'c32_a_town',
        text: '— Leer, — говорит солдат. Пусто. — Die meisten sind Richtung Autobahn. Aber im Krankenhaus… geht nicht ins Krankenhaus.\n\nБольшинство ушли к автобану. А в больнице… не ходите в больницу.', effects: [set32('ar', 'talk'), set32('warned_hospital', true), { move: ws32 }, until32(32, 8, 30)] },
    ] }),

  A({ id: 'c32_a_town', title: 'Бухгольц', location: ws32, camp: trip(ws32), ambient: cold32,
    text: [
      { text: 'Город стоит, как стоял. Только тихо. Ни одного дыма из труб. На Брёмер-штрассе распахнутые двери магазинов, на перекрёстке у вокзала — автобус поперёк дороги, без стёкол. На тротуаре чей-то чемодан, раскрытый, пустой.' },
      { text: 'Мастерская Айдынов на окраине, за заправкой. Ворота заперты на цепь. Внутри всё как было: подъёмник, верстак, календарь с девушкой на стене за октябрь. Холоднее, чем на улице.' },
      { when: deniz32, text: '— Generator zuerst, — говорит Дениз. Сначала генератор. — Dann das Werkzeug. Dann sehen wir.\n\nПотом инструмент. Потом посмотрим.' },
    ],
    actions: [
      { id: 'c32_at_gen', label: 'Грузить генератор', minutes: 150, activity: 'heavy', terminal: true, ambientDuring: cold32,
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 4 }, text: 'Генератор на сто сорок килограммов. Доски, ремни, трое мужчин. На последнем рывке ты держишь угол один, пока братья подкладывают брус. Он встаёт в кузов ровно.', goto: 'c32_a_street', effects: [...fed32(15), set32('at', 'gen'), w32('generator', true), { body: 'fatigue', delta: 10 }, until32(32, 12, 30)] },
          { id: 'hurt', text: 'Генератор на сто сорок килограммов. На последнем рывке ремень соскальзывает, угол бьёт тебя по пальцам. Генератор всё-таки встаёт в кузов. Пальцы распухают, но шевелятся.', goto: 'c32_a_street', effects: [...fed32(15), set32('at', 'gen'), w32('generator', true), { injure: 'bruise', site: 'hands', severity: 2 }, { body: 'fatigue', delta: 12 }, until32(32, 12, 30)] },
        ] },
      { id: 'c32_at_tools', label: 'Разбирать инструмент, пока братья грузят генератор', minutes: 150, activity: 'moderate', terminal: true, goto: 'c32_a_street',
        text: 'Ключи, головки, домкраты, сварка, болгарка, коробки с крепежом. Ты раскладываешь по ящикам и подписываешь мелом. Дениз проходит мимо и одобрительно хлопает по ящику: у тебя порядок, как у немца.\n\nГенератор братья поднимают сами, ругаясь в три голоса.', effects: [...fed32(15), set32('at', 'tools'), w32('generator', true), w32('tools_sorted', true), npc('deniz', 1), until32(32, 12, 30)] },
      { id: 'c32_at_cars', label: 'Обойти машины во дворе: слить солярку', minutes: 150, activity: 'moderate', terminal: true, goto: 'c32_a_street', ambientDuring: frost32,
        text: 'Шланг, канистра, вкус солярки во рту. Из шести машин во дворе у двух баки уже пустые: кто-то был здесь до вас. Из остальных набирается двадцать литров, а с твоим шлангом и канистрами — тридцать. Генератор тем временем стоит в кузове.', effects: [...fed32(15), set32('at', 'cars'), w32('generator', true), { if: flag('A.c31_hose'), then: [w32('diesel_found', 30)], else: [w32('diesel_found', 20)] }, until32(32, 12, 30)] },
    ] }),

  A({ id: 'c32_a_house', title: 'Свой подъезд', location: 'a_street', camp: trip('a_street'), safe: false, ambient: frost32,
    text: [
      { text: 'Твоя улица. Трёхэтажный дом из красного кирпича. Окна целы, как и говорил Дениз. Дверь подъезда приоткрыта, в щель намело снега.' },
      { text: 'Ты стоишь у двери минуту. С первого дня ты здесь не был{m:|а}.' },
      { when: gerdStairs, text: 'На площадке между первым и вторым этажом стоит Герд Брокман. В том же свитере, что и утром десятого. Повязка на руке почернела. Он стоит лицом к стене, к почтовым ящикам, и медленно поворачивает голову на звук открывшейся двери.' },
      { when: all(gerdStairs, ilseLeft), text: 'Утром десятого Ильзе стояла на этой лестнице и ждала, что ты зайдёшь. Ты не {m:зашёл|зашла}.' },
      { when: all(gerdStairs, gerdWritten), text: 'В Люнебурге, в зале списков, ты написал{m:|а} рядом с его фамилией: «Treppenhaus. Erkrankt». Вот она, лестница.' },
      { when: not(gerdStairs), text: 'На лестнице пусто. На ступенях между первым и вторым этажом бурые следы, затёртые, старые. Почтовые ящики раскрыты.' },
    ],
    actions: [
      { id: 'c32_as_end', label: 'Закончить это', when: gerdStairs, minutes: 20, risky: true, terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 4 }, text: 'Он идёт к тебе по ступеням, медленно, держась за перила. Ты ждёшь, пока он сойдёт на площадку. Один удар монтировкой Дениза. Второй не нужен.\n\nТы стоишь над ним и не знаешь, что сказать. Потом поправляешь ему свитер, как поправляла бы Ильзе.', goto: 'c32_a_flat', effects: [set32('st', 'end'), w32('gerd', 'ended'), { npc: 'gerd', alive: false }, { body: 'stress', delta: 6 }, until32(32, 13, 30)] },
          { id: 'kerem', text: 'Ты бьёшь, но ступенька скользкая, удар уходит в перила. Он хватает тебя за рукав, тянет, рот открыт. Керем снизу, двумя руками, ломом. Всё.\n\n— Geht schon, — говорит Керем и не смотрит на тебя. Ладно. Бывает.', goto: 'c32_a_flat', effects: [set32('st', 'kerem'), w32('gerd', 'ended'), { npc: 'gerd', alive: false }, { injure: 'bruise', site: 'leftArm', severity: 2 }, { body: 'stress', delta: 8 }, npc('kerem', 1), until32(32, 13, 30)] },
        ] },
      { id: 'c32_as_lock', label: 'Запереть его на лестнице: вставить в ручку двери лом и уйти', when: gerdStairs, minutes: 15, terminal: true, goto: 'c32_a_brock',
        text: 'Ты тянешь дверь на себя, пока она не закрывается до щелчка. Кладёшь в скобу ручки обрезок трубы из кузова. Изнутри, через минуту, мягкий удар в дверь. Потом ещё один. Наверх, в свою квартиру, ты сегодня не попадёшь. Квартира Брокманов на первом этаже, у неё свой вход со двора.', effects: [set32('st', 'lock'), w32('gerd', 'locked'), until32(32, 13, 15)] },
      { id: 'c32_as_pass', label: 'Подняться мимо него, держась у стены', when: gerdStairs, minutes: 20, risky: true, terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'stealth'], difficulty: 4 }, text: 'Ты идёшь вдоль стены, не дыша. Он поворачивается на шорох слишком медленно. Ты уже на втором этаже, ключ в замке, дверь за спиной.', goto: 'c32_a_flat', effects: [set32('st', 'pass'), w32('gerd', 'left'), until32(32, 13, 30)] },
          { id: 'fail', text: 'Ступенька скрипит. Он поворачивается и идёт на тебя, руки вперёд. Ты отступаешь вниз, на улицу, и захлопываешь дверь подъезда. Изнутри мягкий удар. Твоя квартира остаётся там, наверху.', goto: 'c32_a_brock', effects: [set32('st', 'fail'), w32('gerd', 'left'), { body: 'stress', delta: 5 }, until32(32, 13, 15)] },
        ] },
      { id: 'c32_as_up', label: 'Подняться к себе', when: not(gerdStairs), minutes: 10, terminal: true, goto: 'c32_a_flat',
        text: 'Ступени, перила, твоя дверь. Ключ входит туго, замок замёрз. Потом поддаётся.', effects: [set32('st', 'empty'), until32(32, 13, 15)] },
    ] }),

  A({ id: 'c32_a_flat', title: 'Квартира', location: 'a_flat', camp: trip('a_flat'), ambient: cold32,
    text: [
      { text: 'В квартире холодно и пахнет пылью. На столе кружка с засохшим чаем, рядом телефон на зарядке, которой нет. Всё так, будто ты {m:вышел|вышла} на пять минут три недели назад.' },
      { text: 'Внизу сигналит фургон: долго здесь нельзя. Взять можно столько, сколько унесёшь за раз.' },
      { when: flag('A.c31_home_keys'), text: 'Ключ от почтового ящика на той же связке. В ящике три письма, все от десятого ноября. Ты не открываешь их. Кладёшь в карман.' },
      { when: gerdDone, text: 'Внизу, на площадке, лежит Герд, накрытый курткой Керема.' },
    ],
    actions: [
      { id: 'c32_af_papers', label: 'Документы и папку с бумагами', minutes: 30, terminal: true, goto: 'c32_a_brock',
        text: 'Паспорт, свидетельства, страховка, договор аренды, диплом. Всё, что доказывает, что ты был{m:|а}. Ты не уверен{m:|а}, что это кому-то ещё понадобится. Но кладёшь в рюкзак.', effects: [set32('af', 'papers'), { give: 'c32_papers' }, until32(32, 14, 15)] },
      { id: 'c32_af_warm', label: 'Зимнее: свитера, термобельё, вторые ботинки', minutes: 30, terminal: true, goto: 'c32_a_brock',
        text: 'Ты набиваешь сумку свитерами, носками, шапками. Вторые ботинки связываешь шнурками и вешаешь на шею. На хуторе это наденут все, кому подойдёт.', effects: [set32('af', 'warm'), { give: 'c32_sweaters' }, until32(32, 14, 15)] },
      { id: 'c32_af_photos', label: 'Фотографии со стены и пару книг', minutes: 30, terminal: true, goto: 'c32_a_brock',
        text: 'Ты снимаешь фотографии со стены, одну за другой, и вынимаешь из рамок. Книги берёшь не те, что любишь, а те, что тоньше. На пороге оглядываешься. Пустые прямоугольники на обоях светлее остальной стены.', effects: [set32('af', 'photos'), { give: 'c32_photos' }, { body: 'stress', delta: -3 }, until32(32, 14, 15)] },
    ] }),

  A({ id: 'c32_a_brock', title: 'Брокманы', location: 'a_brockmann', camp: trip('a_brockmann'), ambient: cold32,
    text: [
      { text: 'Квартира Брокманов на первом этаже, вход со двора. Дверь не заперта. Ковры, часы с маятником, остановившиеся на без десяти восемь. Фотографии внуков на серванте.' },
      { text: 'На холодильнике под магнитом в виде кленового листа открытка: «Toronto. Merry Christmas, Mum & Dad! Thomas». Прошлогодняя. На подоконнике старый приёмник, рядом блокнот Ильзе: столбик частот, против одной подчёркнуто дважды: «DRK».' },
      { when: ilseFate('kept'), text: 'Ильзе сейчас в будке обходчика на полпути к колонии. Её камертон лежит у вас на столе на хуторе.' },
      { when: ilseFate('ended'), text: 'Ильзе больше нет. Её камертон лежит у вас на столе на хуторе.' },
      { when: brockNote, text: 'Их сын ищет их через Красный Крест. Записка висела на остановке в Йестебурге.' },
    ],
    actions: [
      { id: 'c32_ab_freq', label: 'Переписать частоту Красного Креста и взять открытку Томаса', minutes: 30, terminal: true, goto: 'c32_a_dusk',
        text: 'Частоту ты переписываешь в свою тетрадь. Открытку снимаешь с холодильника. Адрес на обороте: Торонто, улица, номер. Если когда-нибудь будет почта.', effects: [set32('ab', 'freq'), w32('drk_freq', true), { give: 'c32_toronto_card' }, until32(32, 15, 0)] },
      { id: 'c32_ab_mail', label: 'Разложить письма из почтовой сумки по ящикам', when: mailbag32, minutes: 45, terminal: true, goto: 'c32_a_dusk', ambientDuring: frost32,
        text: 'Ты обходишь улицу с сумкой почтальона. Счета, открытки, письмо из налоговой, детский рисунок в конверте. Ящики, где дверцы сорваны, ты пропускаешь. Где целы — опускаешь письмо и закрываешь. Никто не прочитает. Но письмо дома.\n\nПоследнее письмо в сумке адресовано Брокманам. Из Торонто. Ты кладёшь его на их кухонный стол, под часы.', effects: [set32('ab', 'mail'), w32('mail_delivered', true), until32(32, 15, 15)] },
      { id: 'c32_ab_radio', label: 'Взять приёмник Ильзе', minutes: 20, terminal: true, goto: 'c32_a_dusk',
        text: 'Приёмник тяжёлый, деревянный, с большой ручкой настройки. Батарейки внутри живые. Сквозь треск — голос по-немецки, сводка Красного Креста: пункты, колонны, номера телефонов, которых больше нет.', effects: [set32('ab', 'radio'), w32('drk_freq', true), { give: 'c32_ilse_radio' }, until32(32, 14, 45)] },
      { id: 'c32_ab_leave', label: 'Ничего не трогать', minutes: 10, terminal: true, goto: 'c32_a_dusk',
        text: 'Ты закрываешь за собой дверь, как закрывают в доме, где спят.', effects: [set32('ab', 'leave'), until32(32, 14, 30)] },
    ] }),

  A({ id: 'c32_a_dusk', title: 'Больница', location: 'a_street', camp: trip('a_street'), ambient: frost32, onEnter: [until32(32, 15, 30)],
    text: [
      { text: 'Половина четвёртого. Через час стемнеет.' },
      { when: kerem32, text: 'Керем показывает на больницу на холме: в окнах ни огонька.\n\n— Die Apotheke da drin. Wenn noch was da ist, braucht die Zander das mehr als wir.\n\nТам аптека. Если что-то осталось, Зандер это нужнее, чем нам.' },
      { when: flag('$.c32_warned_hospital'), text: 'Солдат на посту сказал: не ходите в больницу.' },
      { when: pKnown32, text: 'Четвёртое отделение. Шестьдесят одна фамилия, и у каждой «P».' },
    ],
    actions: [
      { id: 'c32_ad_ward', label: 'Пойти с Керемом в больницу', minutes: 20, risky: true, terminal: true, goto: 'c32_a_ward',
        text: 'Вы идёте пешком, через парковку, где стоят машины скорой помощи с открытыми дверями.', effects: [set32('ad', 'ward'), { move: 'a_hospital' }] },
      { id: 'c32_ad_back', label: 'Вернуться в мастерскую до темноты', minutes: 30, terminal: true, goto: 'c32_a_night',
        text: 'Ты возвращаешься, пока ещё видно дорогу. Керем идёт рядом и молчит. Ему тоже не хотелось.', effects: [set32('ad', 'back'), { move: ws32 }, until32(32, 16, 30)] },
    ] }),

  A({ id: 'c32_a_ward', title: 'Четвёртое отделение', location: 'a_hospital', camp: trip('a_hospital'), safe: false, ambient: cold32,
    text: [
      { text: 'Двери приёмного распахнуты. На полу бумаги, перчатки, опрокинутая каталка. Тишина такая, что слышно, как где-то капает.' },
      { text: 'Аптека на первом этаже взломана и пуста. Табличка на лестнице: «Station 4 →». Двери отделения раскрыты настежь, на одной следы ладоней, бурые.' },
      { text: 'В сестринской на столе журнал. Таблица: фамилия, дата, «Plasma ml», и в последнем столбце крестик или ничего. Холодильник с надписью «Studie» открыт и пуст. В конце коридора за стеклянной дверью кто-то стоит. Не двигается.' },
    ],
    actions: [
      { id: 'c32_aw_page', label: 'Вырвать страницу журнала и уйти', minutes: 15, terminal: true, goto: 'c32_a_night',
        text: 'Бумага рвётся громко. За стеклянной дверью фигура поворачивает голову. Вы уходите быстро, не бегом. На парковке Керем говорит: «Nie wieder». Больше никогда.', effects: [set32('aw', 'page'), w32('ward_page', true), { give: 'c32_ward_page' }, { move: ws32 }, until32(32, 17, 0)] },
      { id: 'c32_aw_look', label: 'Прочитать журнал здесь, при фонаре', minutes: 30, terminal: true, goto: 'c32_a_night',
        text: 'Ты листаешь при фонаре. Шестьдесят одна фамилия. Плазма с девятого октября по девятое ноября. У двадцати трёх в последнем столбце крестик. Последняя запись: «10.11. Alle Proben verworfen». Все образцы уничтожены. Почерк прыгает.\n\nКогда поднимаешь голову, фигура за стеклом стоит вплотную к двери.', effects: [set32('aw', 'look'), w32('ward_read', true), { body: 'stress', delta: 5 }, { move: ws32 }, until32(32, 17, 15)] },
      { id: 'c32_aw_leave', label: 'Уйти сразу', minutes: 10, terminal: true, goto: 'c32_a_night',
        text: 'Ты разворачиваешься, не дочитав и строки. Керем не спорит.', effects: [set32('aw', 'leave'), { move: ws32 }, until32(32, 16, 45)] },
    ] }),

  A({ id: 'c32_a_night', title: 'Ночь в мастерской', location: ws32, camp: trip(ws32, 'sleep'), ambient: cold32, onEnter: [until32(32, 18, 0)],
    text: [
      { text: 'В мастерской буржуйка из газового баллона, труба в форточку. Дениз жарит на ней колбасу из заморозки соседнего магазина: на улице минус, морозилка не нужна.' },
      { when: both, text: 'Братья говорят по-турецки, потом, заметив тебя, переходят на немецкий. Разговор один: оставаться здесь или ехать на хутор насовсем.' },
      { when: both, text: '— Hier ist nichts mehr, — говорит Керем. Здесь больше ничего нет.\n\n— Hier ist meine Werkstatt, — говорит Дениз. Здесь моя мастерская. — Und Brandt hat seine Liste. Da stehe ich drauf.\n\nА у Брандта список. И я в нём.' },
      { when: denizOnly, text: 'Дениз говорит сам с собой больше, чем с тобой. Здесь его мастерская. Там — список Брандта.' },
      { when: flag('A.c31_food3'), text: 'Окорок Хенрике Дениз режет на троих и долго нюхает. «Sie hat mich nie gemocht. Aber sie räuchert wie eine Göttin». Она меня никогда не любила. Но коптит как богиня.' },
      { when: keremOnly, text: 'Керем спрашивает: на хуторе есть место для одного, который хромает?' },
    ],
    actions: [
      { id: 'c32_an_farm', label: 'Сказать: на хуторе вам будут рады', minutes: 60, terminal: true, goto: 'c32_a_letters',
        text: 'Дениз долго молчит, переворачивая колбасу.\n\n— Henrike hat genug Mäuler.\n\nУ Хенрике и так ртов хватает.\n\nНо Керем смотрит на брата так, будто ты сказал{m:|а} то, что он сам хотел.', effects: [set32('an', 'farm'), npc('kerem', 1), ...fed32(30), until32(32, 19, 30)] },
      { id: 'c32_an_near', label: 'Сказать: у насыпи пустой двор, рядом, но своё', minutes: 60, terminal: true, goto: 'c32_a_letters',
        text: '— Ein eigener Hof, — повторяет Дениз. Свой двор. — Mit einem Tor, das man zumachen kann.\n\nС воротами, которые можно закрыть.\n\nОн впервые за вечер улыбается.', effects: [set32('an', 'near'), npc('deniz', 1), ...fed32(30), until32(32, 19, 30)] },
      { id: 'c32_an_listen', label: 'Только слушать', minutes: 60, terminal: true, goto: 'c32_a_letters',
        text: 'Ты ешь и слушаешь. Это их решение. Но они смотрят на тебя каждый раз, когда упоминают хутор.', effects: [set32('an', 'listen'), ...fed32(30), until32(32, 19, 30)] },
    ] }),

  A({ id: 'c32_a_sleep', title: 'Ночь', location: ws32, camp: trip(ws32, 'sleep'), ambient: cold32,
    text: [{ text: 'Спят по очереди: кто-то должен подкидывать в буржуйку и слушать улицу. Ночью по шоссе проходит что-то тяжёлое, с лязгом. Потом снова тихо.' }],
    actions: [
      { id: 'c32_az_first', label: 'Дежурить первым', minutes: 30, terminal: true, goto: 'c32_a_noise',
        text: 'Ты сидишь у буржуйки до часу. Подкидываешь доски от поддонов. Слушаешь, как дышат братья. В час будишь Керема и проваливаешься в сон.', effects: [set32('az', 'first'), until32(32, 23, 0)] },
      { id: 'c32_az_last', label: 'Спать сразу, дежурить под утро', minutes: 30, terminal: true, goto: 'c32_a_noise',
        text: 'Ты засыпаешь сразу. В четыре Дениз трясёт тебя за плечо. До рассвета ты сидишь у огня и смотришь, как светлеет окно.', effects: [set32('az', 'last'), until32(33, 4, 30, true)] },
    ] }),

  // ═════════════ Четверг ═════════════
  A({ id: 'c32_a_thu', title: 'Четверг', location: ws32, camp: trip(ws32), ambient: cold32,
    text: [
      { text: 'Утро серое. Фургон гружёный, рессоры просели. Остаётся время на одно дело, потом домой.' },
      { when: gerdLocked, text: 'Твой подъезд заперт обрезком трубы. Герд там, на лестнице.' },
      { when: own32('st', 'fail'), text: 'Твоя квартира так и осталась наверху, за спиной Герда.' },
    ],
    actions: [
      { id: 'c32_aq_saw', label: 'Найти пилу, которую Дениз должен Хенрике', minutes: 60, terminal: true, goto: 'c32_a_back',
        text: 'Пила висит за подъёмником, бензиновая, «Штиль», с цепью в масле. Дениз хлопает себя по лбу.\n\n— Henrike bringt mich um. Sag ihr, ich hab sie geschärft.\n\nХенрике меня убьёт. Скажи ей, что я её наточил.\n\nОн её не точил. Он точит её сейчас, двадцать минут, при тебе.', effects: [set32('aq', 'saw'), w32('saw', true), { give: 'c32_saw' }, until32(33, 9, 30)] },
      { id: 'c32_aq_door', label: 'Вернуться к подъезду', when: any(gerdLocked, own32('st', 'fail')), minutes: 60, terminal: true, goto: 'c32_a_back', ambientDuring: frost32,
        text: 'Ты стоишь у двери подъезда. Изнутри тихо. Потом мягкий удар, как будто кто-то прислонился. Ты пишешь мелом на двери: «Gerd Brockmann. 10.11.» И ниже: «Nicht öffnen». Не открывать.', effects: [set32('aq', 'door'), w32('gerd_door', true), until32(33, 9, 30)] },
      { id: 'c32_aq_market', label: 'Обойти с Керемом супермаркет у развязки', minutes: 90, activity: 'moderate', terminal: true, goto: 'c32_a_back', ambientDuring: frost32,
        text: 'Полки пусты, как и говорили. Но на складе за пластиковой завесой, под упавшим стеллажом, — коробки соли, никому не нужной, и упаковка свечей. Соль на хуторе пойдёт на мясо. Свечи — на всё.', effects: [set32('aq', 'market'), w32('salt', true), { place: 'c32_salt', at: 'c3_farm_stock', qty: 5 }, until32(33, 10, 0)] },
    ] }),

  A({ id: 'c32_a_back', title: 'Обратно', location: ws32, camp: trip(ws32), ambient: truck32, onEnter: [until32(33, 10, 30)],
    text: [
      { text: 'Половина одиннадцатого. Дениз в последний раз обходит мастерскую, трогает верстак, подъёмник. Вешает замок на ворота, хотя внутри больше ничего нет.' },
    ],
    actions: [
      { id: 'c32_ak_pharm', label: 'Попросить Дениза заехать к аптеке на Брёмер-штрассе', minutes: 20, terminal: true, goto: 'c32_a_pharmacy', ambientDuring: truck32,
        text: 'Дениз морщится, но сворачивает. «Fünf Minuten. Nicht mehr». Пять минут. Не больше.', effects: [set32('ak', 'pharm'), until32(33, 10, 50)] },
      { id: 'c32_ak_drive', label: 'Сесть за руль самому: Дениз не спал полночи', minutes: 120, terminal: true, goto: 'c32_a_point', ambientDuring: truck32,
        text: 'Дениз отдаёт ключи без спора и засыпает, едва фургон трогается. Ты ведёшь медленно: гружёный «Транзит» тянет в кюветы на каждом повороте. На посту ты показываешь бумагу пункта, и вас пропускают. Дениз просыпается у Йестебурга и говорит: «Gut gefahren». Хорошо доехали.', effects: [set32('ak', 'drive'), npc('deniz', 2, 'c32_drove_van'), { move: jest32 }, until32(33, 13, 0)] },
      { id: 'c32_ak_go', label: 'Ехать', minutes: 120, terminal: true, goto: 'c32_a_point', ambientDuring: truck32,
        text: 'Дорога обратно медленнее: фургон гружёный. На повороте к Йестебургу Дениз сбавляет ход и долго смотрит в зеркало, на Бухгольц.', effects: [set32('ak', 'go'), { move: jest32 }, until32(33, 13, 0)] },
    ] }),

  A({ id: 'c32_a_point', title: 'Генератор', location: jest32, camp: trip(jest32), ambient: cold32,
    text: [
      { text: 'У пожарной части фургон разгружают в четыре руки. Яннес, электрик, ходит вокруг генератора, как вокруг коня на ярмарке.' },
      { when: v('w.c26_brandt', 'ally'), text: 'Брандт выходит из караулки с забинтованной рукой и жмёт тебе руку левой.' },
      { when: v('w.c26_brandt', 'hostile'), text: 'Брандт смотрит из окна караулки и не выходит.' },
      { when: all(flag('w.c32_diesel_found'), not(v('w.c32_night_thieves', 'drained'))), text: 'Солярку из Бухгольца Дениз ставит рядом с генератором: без неё он железо.' },
      { when: all(flag('w.c32_diesel_found'), v('w.c32_night_thieves', 'drained')), text: 'Солярки для генератора нет: всё, что слили в Бухгольце, ушло в бак фургона после ночных гостей. Яннес чешет затылок: без топлива генератор железо.' },
      { when: v('w.c32_vogt', 'took'), text: 'Герр Фогт с кошкой в корзине выходит из кабины, оглядывается и говорит Зандер: «Ich bin nicht krank. Ich bin nur alt». Я не болен. Я просто старый. Зандер даёт ему раскладушку у печки.' },
      { when: v('w.c32_pharmacy', 'taken'), text: 'Сумку из аптеки ты отдаёшь Зандер прямо в руки. Она перебирает пакеты молча, потом говорит: «Das reicht für einen Monat». Этого хватит на месяц.' },
      { when: v('w.c32_pharmacy', 'noted'), text: 'Ты говоришь Яннесу про аптеку на Брёмер-штрассе: нижние полки полные. Он записывает. Когда-нибудь кто-нибудь туда съездит.' },
      { when: v('$.c32_ab', 'leave'), text: 'Квартиру Брокманов ты оставил{m:|а}, как была. Часы с маятником так и стоят на без десяти восемь.' },
      { when: v('$.c32_aw', 'leave'), text: 'Журнал четвёртого отделения ты так и не прочитал{m:|а}. Иногда кажется, что это было правильно.' },
    ],
    actions: [
      { id: 'c32_ap_wire', label: 'Помочь Яннесу подключить', minutes: 180, activity: 'moderate', terminal: true, goto: 'c32_a_home',
        text: 'Кабель, щиток, заземление на штыре в мёрзлой земле. Яннес ругается на щиток, на мороз, на тебя. В четыре генератор заводится. Под потолком спортзала загораются лампы. Кто-то на раскладушке плачет.', effects: [set32('ap', 'wire'), w32('generator_point', true), until32(33, 16, 30)] },
      { id: 'c32_ap_home', label: 'Отдать и ехать домой', minutes: 60, terminal: true, goto: 'c32_a_home',
        text: 'Ты подписываешь бумагу, что генератор передан пункту. Дениз подписывает ниже. Яннес машет вам вслед, не отрываясь от щитка.', effects: [set32('ap', 'home'), w32('generator_point', true), until32(33, 15, 0)] },
    ] }),

  A({ id: 'c32_a_home', title: 'Ворота', location: 'hof_luedemann', camp: yard14, ambient: frost32, onEnter: [until32(33, 17, 0)],
    text: [
      { text: 'Хутор. Дым из трубы. Пять часов, уже темно.' },
      { when: flag('w.c32_saw'), text: 'Хенрике берёт пилу, пробует цепь пальцем и смотрит на Дениза так, что тот отступает к фургону.' },
    ],
    actions: [
      { id: 'c32_ah_unload', label: 'Разгрузить своё и ждать у ворот', minutes: 50, terminal: true, goto: 'c32_checkpoint',
        text: 'Сумки, ящик с инструментом. Ты стоишь у ворот и смотришь на дорогу со стороны Йестебурга. Скоро шесть.', effects: [set32('ah', 'unload'), finish32, until32(33, 18, 0)] },
      { id: 'c32_ah_tea', label: 'Сесть на кухне с горячим', minutes: 50, terminal: true, goto: 'c32_checkpoint',
        text: 'Хенрике ставит перед тобой кружку, не спрашивая. Тепло доходит до пальцев не сразу.', effects: [set32('ah', 'tea'), ...fed32(15), finish32, until32(33, 18, 0)] },
    ] }),
];
