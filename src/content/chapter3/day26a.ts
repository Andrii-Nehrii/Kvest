import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, tense14, yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import {
  S26, brandtAlly, brandtHostile, carLoss, dayFacts, dutyA, farm26, jest26, oleNow, rationLoss, set26, snow26, until26, w26,
} from './point26';

// Участок 26, линия A: машину отгоняют к пожарной части (потеря-эхо), смена в дружине или день у фрау Тимм (мясо и молоко),
// разговор с Брандтом (если правду решили сказать, а B не в Йестебурге), засолка, Оле дома.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S26({ ...scene, for: 'any', chapter: 'ch3' });
const lullau = 'c26_lullau';
const L = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => A({ ...scene, location: lullau, camp: scene.camp ?? { at: lullau, stock: 'c3_farm_stock', rest: false }, safe: false });
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => A({ ...scene, location: jest26, camp: scene.camp ?? { at: jest26, stock: 'c3_farm_stock', rest: false }, safe: false });
const knowsTimm: Cond = v('B.c19_brd', 'yes');
const diesel: Cond = any2(flag('w.c19_diesel'), flag('w.c16_diesel'));
const ham: Cond = { stocked: 'c18_ham', qty: 1, at: 'c3_farm_stock' };
const cigs: Cond = { has: 'c19_cigs' };
const meat: Effect[] = [{ give: 'c26_beef', qty: 6 }, { give: 'c26_milk', qty: 5 }, w26('meat_got', true)];
const afterMorning = [{ id: 'car', when: carLoss, goto: 'c26_a_car' }, { id: 'duty', when: dutyA, goto: 'c26_a_duty' }, { id: 'timm', goto: 'c26_a_road' }];
const afterCar = [{ id: 'duty', when: dutyA, goto: 'c26_a_duty' }, { id: 'timm', goto: 'c26_a_road' }];
const afterTimm = [{ id: 't', when: v('w.c25_road', 'letter'), goto: 'c26_a_tractor' }, { id: 'd', goto: 'c26_a_ditch' }];
const afterBrandt = [{ id: 'm', when: flag('w.c26_meat_got'), goto: 'c26_a_salt' }, { id: 'dl', when: dutyA, goto: 'c26_a_home' }, { id: 'h', goto: 'c26_a_yardwork' }];
/** Время дня у Тимм: с утра — до полудня, после смены — до темноты. */
const timmUntil = (morning: [number, number], afternoon: [number, number]): Effect =>
  ({ if: dutyA, then: [until26(afternoon[0], afternoon[1])], else: [until26(morning[0], morning[1])] });

function any2(a: Cond, b: Cond): Cond { return { any: [a, b] }; }

export const day26AScenes: Scene[] = [
  A({ id: 'c26_a_morning', title: 'Среда', camp: yard14, ambient: snow26, onEnter: dayFacts,
    text: [
      { text: 'Утро серое, без солнца. Снег лежит плотно, подмёрз сверху. На дороге следы трактора.' },
      { when: carLoss, text: 'В семь у ворот звонит велосипед. Лукас, сын пожарного, рука на перевязи. Он протягивает бумагу и не смотрит в глаза.\n\n«Verwarnte Personen führen keine Fahrzeuge. Fahrzeug Opel Corsa, Lüdemann-Hof, ist heute bis 9 Uhr am Feuerwehrhaus abzugeben. Brandt».\n\nПредупреждённые лица не управляют транспортом. Opel Corsa, хутор Людеманов, сдать сегодня до девяти у пожарной части.' },
      { when: carLoss, text: '«Verwarnt am 18.11». Это за колонию. За то, что ты стоял{m:|а} в калитке.' },
      { when: rationLoss, text: 'В семь у ворот звонит велосипед. Лукас протягивает бумагу: «Lüdemann-Hof — halbe Ration bis 8.12. Grund: Verweigerung am 19.11». Половина пайка до восьмого декабря. Причина: отказ девятнадцатого.' },
      { when: dutyA, text: 'В восемь у пожарной части тебя ждёт дружина. Ты обещал{m:|а} Брандту человека со двора. Этот человек — ты.' },
      { when: carLoss, text: 'Лукасу лет четырнадцать. Перевязь у него из клетчатого шарфа, явно маминого. Пока ты читаешь, он переминается у калитки и держит наготове огрызок карандаша: расписаться в получении.\n\n— Tut mir leid, — говорит он в сторону. — Ich bring nur die Zettel.\n\nПростите. Я только разношу бумажки.' },
    ],
    actions: [
      { id: 'c26_am_go', label: 'Собраться сразу', minutes: 20, terminal: true, outcomes: afterMorning,
        text: 'Куртка, шапка, рукавицы. Нина суёт тебе в карман два варёных яйца, ещё тёплых.', effects: [set26('am', 'go'), until26(7, 30)] },
      { id: 'c26_am_coffee', label: 'Сначала выпить кофе у печи', minutes: 30, terminal: true, outcomes: afterMorning,
        text: 'Кофе остался на донышке банки, на две кружки. Одну ты пьёшь сам{m:|а}, вторую оставляешь {B.dat}. Горький, горячий.', effects: [set26('am', 'coffee'), { body: 'fatigue', delta: -3 }, until26(7, 40)] },
      { id: 'c26_am_paper', label: 'Прочитать бумагу ещё раз, медленно', when: any2(carLoss, rationLoss), minutes: 20, terminal: true, outcomes: afterMorning,
        text: 'Ты читаешь. Подпись Брандта, печать пожарной дружины, дата. Всё по форме. Против этой формы у тебя нет ничего, кроме злости.', effects: [set26('am', 'paper'), { body: 'stress', delta: 2 }, until26(7, 30)] },
    ] }),

  A({ id: 'c26_a_car', title: 'Ключи', camp: yard14, safe: false, ambient: snow26,
    text: [
      { text: 'Ты едешь в Йестебург на второй передаче, медленно, как на похоронах. У пожарной части уже стоят три машины: «Гольф», пикап, старый «Пассат». На стёклах бумажки с фамилиями.' },
      { text: 'Ключи принимает Тобиас. Он не смотрит тебе в глаза.\n\n— Ich pass auf ihn auf. Keiner fährt damit. Versprochen.\n\nЯ за ней присмотрю. Никто на ней не поедет. Обещаю.' },
      { text: 'Тобиас пишет на бумажке номер и фамилию, привязывает её проволокой к ключам и вешает на доску, где уже висят чужие связки с такими же бумажками. Под доской на табурете дремлет дружинник с ружьём на коленях. Охрана.' },
      { when: v('$.c26_am', 'paper'), text: 'Бумагу Брандта ты {m:сложил|сложила} вчетверо и {m:убрал|убрала} во внутренний карман. Если когда-нибудь будут спрашивать, по какому праву, она будет при тебе.' },
      { when: v('$.c26_am', 'go'), text: 'Бумагу Брандта ты {m:оставил|оставила} на кухонном столе. Нина, наверное, уже прочла.' },
    ],
    actions: [
      { id: 'c26_ac_keys', label: 'Отдать ключи молча', minutes: 20, terminal: true, outcomes: afterCar,
        text: 'Ключи с брелоком аптеки ложатся в его ладонь. Он вешает их на гвоздь в караулке, рядом с другими, и записывает в журнал.', effects: [set26('ac', 'keys'), { drive: 'opel_corsa', km: 4, to: jest26 }, { take: 'car_keys' }, w26('car_tobias', true), until26(8, 30)] },
      { id: 'c26_ac_fuel', label: 'Попросить: пусть бензин останется в баке, не сливать', minutes: 25, terminal: true, outcomes: afterCar,
        text: '— Steht nicht auf dem Zettel, — говорит Тобиас. В бумаге этого нет. — Also bleibt er drin. Bis einer was anderes schreibt.\n\nЗначит, остаётся. Пока кто-нибудь не напишет иначе.', effects: [set26('ac', 'fuel'), { drive: 'opel_corsa', km: 4, to: jest26 }, { take: 'car_keys' }, w26('car_fuel_kept', true), until26(8, 35)] },
      { id: 'c26_ac_back', label: 'Спросить, когда вернут', minutes: 25, terminal: true, outcomes: afterCar,
        text: '— Wenn Brandt es sagt. — Тобиас пожимает плечами. — Oder wenn Brandt nichts mehr sagt.\n\nКогда Брандт скажет. Или когда Брандт больше ничего не будет говорить.', effects: [set26('ac', 'back'), { drive: 'opel_corsa', km: 4, to: jest26 }, { take: 'car_keys' }, until26(8, 35)] },
    ] }),

  J({ id: 'c26_a_duty', title: 'Дружина', ambient: snow26,
    text: [
      { text: 'У пожарной части шестеро. Двое старше шестидесяти, двое подростков, ты и рыжеусый пожарный, тот, что вёл тебя к машине в среду. Пила, два топора, тракторный прицеп.' },
      { text: 'Едете к лесу за Ханштедтом, за дровами для школы. Дорога идёт по холму. С холма видно автобан.' },
      { text: 'Внизу, у придорожной стоянки, впадина. Бывший карьер, заросший берёзой. Она серая. Не от снега. Серая от людей. Они стоят плотно, плечом к плечу, лицами в одну сторону, к дороге. Их там сотни.' },
    ],
    actions: [
      { id: 'c26_ad_work', label: 'Работать и не смотреть вниз', minutes: 210, activity: 'heavy', terminal: true, goto: 'c26_a_road',
        text: 'Пила визжит. Ты рубишь сучья, грузишь, снова рубишь. Рыжеусый работает рядом, молча, и один раз подаёт тебе руку, когда ты оступаешься на мёрзлом склоне. К полудню прицеп полный.', effects: [set26('ad', 'work'), w26('hollow_seen', true), { body: 'fatigue', delta: 12 }, { set: '$.c26_duty_done', value: true }, until26(12, 30)] },
      { id: 'c26_ad_count', label: 'Остановиться и посчитать, сколько их', minutes: 210, activity: 'heavy', terminal: true, goto: 'c26_a_road',
        text: 'Ты считаешь десятками. На трёхстах сбиваешься. Рыжеусый становится рядом.\n\n— Jeden Tag mehr. Die kommen von der Autobahn und bleiben da unten. Als ob sie auf was warten.\n\nКаждый день больше. Приходят с автобана и остаются там. Будто чего-то ждут.\n\nПотом вы работаете до полудня.', effects: [set26('ad', 'count'), w26('hollow_seen', true), w26('hollow_counted', true), { body: 'fatigue', delta: 12 }, { body: 'stress', delta: 3 }, { set: '$.c26_duty_done', value: true }, until26(12, 30)] },
      { id: 'c26_ad_talk', label: 'Спросить рыжеусого про среду', minutes: 210, activity: 'heavy', terminal: true, goto: 'c26_a_road',
        text: '— Befehl war Befehl. — Он бросает полено в прицеп. — Ich heiße Uwe. Und es tut mir leid. Das sage ich einmal.\n\nПриказ был приказ. Меня зовут Уве. И мне жаль. Говорю это один раз.\n\nВы работаете до полудня бок о бок. Впадину внизу он не обсуждает.', effects: [set26('ad', 'talk'), w26('hollow_seen', true), w26('uwe', true), { body: 'fatigue', delta: 12 }, { set: '$.c26_duty_done', value: true }, until26(12, 30)] },
    ] }),

  A({ id: 'c26_a_road', title: 'Дорога в Люллау', camp: tense14, safe: false, ambient: snow26,
    text: [
      { text: 'До Люллау три километра полем. Там, говорят, режут скот: кормов до весны не хватит.' },
      { when: knowsTimm, text: '{B} в четверг ехала с хозяйкой из Люллау в пикапе. Та звала, если будет солярка.' },
      { when: not(flag('w.c26_hollow_seen')), text: 'Дорога идёт по холму. С холма видно автобан. Внизу, у стоянки, впадина, серая от людей. Они стоят плотно, лицами к дороге. Сотни.' },
      { text: 'Снег на поле подмёрз коркой и проламывается под каждым шагом. Над Люллау поднимается дым, прямой, как нитка: там топят. Где-то лает собака, одна на всю округу.' },
    ],
    actions: [
      { id: 'c26_ar_go', label: 'Идти дальше, не останавливаясь', minutes: 40, terminal: true, goto: 'c26_a_anke', ambientDuring: snow26,
        text: 'Ты идёшь быстро. Впадину видно ещё минут десять, пока дорога не уходит за лес.', effects: [set26('ar', 'go'), w26('hollow_seen', true), { move: lullau }, timmUntil([9, 30], [13, 15])] },
      { id: 'c26_ar_look', label: 'Остановиться на холме и посмотреть', minutes: 50, terminal: true, goto: 'c26_a_anke', ambientDuring: snow26,
        text: 'Ты стоишь на холме. Они не двигаются. Иногда кто-то с краю делает шаг вперёд, и вся масса чуть качается, как вода в ведре. Ветер дует от них. Пахнет.', effects: [set26('ar', 'look'), w26('hollow_seen', true), { body: 'stress', delta: 3 }, { move: lullau }, timmUntil([9, 40], [13, 25])] },
      { id: 'c26_ar_down', label: 'Спуститься по лесополосе поближе к стоянке', minutes: 15, activity: 'moderate', terminal: true, goto: 'c26_a_hollow', ambientDuring: snow26,
        text: 'Ты сворачиваешь с дороги в лесополосу.', effects: [set26('ar', 'down'), until26(9, 0)] },
      { id: 'c26_ar_glass', label: 'Посмотреть в бинокль Оле', when: { has: 'c24_binoculars' }, minutes: 50, terminal: true, goto: 'c26_a_anke', ambientDuring: snow26,
        text: 'В бинокль видно лица. Ты опускаешь его и поднимаешь снова. За толпой, на краю стоянки, три армейских грузовика под снегом. У третьего откинут тент, под ним бочки. Синие.', effects: [set26('ar', 'glass'), w26('hollow_seen', true), w26('trucks_seen', true), { move: lullau }, timmUntil([9, 40], [13, 25])] },
    ] }),

  L({ id: 'c26_a_timm', title: 'Фрау Тимм', ambient: snow26,
    text: [
      { text: 'Двор в Люллау большой, хлев на сорок голов, половина стойл пустые. Во дворе на козлах висит туша бычка, уже ободранная. Пар идёт от неё в холодный воздух.' },
      { text: 'Хозяйка, та самая, в стёганом жилете, точит нож о брусок.\n\n— Lüdemann? — Она не удивляется. — Ich hab gedacht, ihr kommt früher. Ich schlachte, solange noch Futter da ist. Fleisch hab ich. Hände nicht. Diesel auch nicht.\n\nЛюдеманы? Я думала, вы раньше придёте. Режу, пока ещё есть корм. Мясо у меня есть. Рук нет. Солярки тоже.' },
      { text: 'Из хлева пахнет навозом, кровью и тёплым сеном. Над дверью прибита подкова концами вниз, под ней свежая надпись мелом: «40 → 20». Головы. Было и осталось.' },
    ],
    actions: [
      { id: 'c26_at_work', label: 'Предложить руки: полдня работы', minutes: 180, activity: 'heavy', terminal: true, outcomes: afterTimm,
        text: 'Ты разделываешь тушу под её команды: здесь, по суставу, не пилой. Носишь куски в холодную кладовку. Засыпаешь солью. Руки красные от мяса и холода. Через три часа она заворачивает тебе шесть кило в мешковину и наливает пять литров молока в бидон.\n\n— Kommt wieder. Ich hab noch zwei.\n\nПриходите ещё. У меня ещё два.', effects: [set26('at', 'work'), ...meat, w26('timm_again', true), { body: 'fatigue', delta: 14 }, timmUntil([12, 45], [16, 15])] },
      { id: 'c26_at_diesel', label: 'Пообещать солярку: пять литров, завтра', when: diesel, minutes: 40, terminal: true, outcomes: afterTimm,
        text: '— Morgen? — Она смотрит на тебя долго. — Gut. Lüdemanns haben ihr Wort immer gehalten. Henrike sowieso.\n\nЗавтра? Хорошо. Людеманы всегда держали слово. Хенрике уж точно.\n\nОна заворачивает мясо и молоко сразу, не дожидаясь солярки.', effects: [set26('at', 'diesel'), ...meat, w26('diesel_owed', true), timmUntil([10, 30], [14, 0])] },
      { id: 'c26_at_ham', label: 'Предложить в обмен копчёный окорок', when: ham, minutes: 40, terminal: true, outcomes: afterTimm,
        text: '— Geräuchert? Von Henrike? — Она нюхает воздух, как будто окорок уже здесь. — Ein Stück Schinken gegen frisches Fleisch. Ihr seid verrückt. Aber gut.\n\nКопчёный? От Хенрике? Кусок окорока за свежее мясо. Вы с ума сошли. Но ладно.\n\nОкорок ты принесёшь в пятницу. Мясо она даёт сейчас.', effects: [set26('at', 'ham'), ...meat, w26('ham_owed', true), timmUntil([10, 30], [14, 0])] },
      { id: 'c26_at_cigs', label: 'Предложить блок сигарет', when: cigs, minutes: 30, terminal: true, outcomes: afterTimm,
        text: 'Она берёт блок и прячет под жилет.\n\n— Mein Mann hat geraucht. Ich nicht. Aber Zigaretten sind jetzt Geld.\n\nМуж курил. Я — нет. Но сигареты теперь деньги.', effects: [set26('at', 'cigs'), { take: 'c19_cigs' }, ...meat, timmUntil([10, 20], [13, 50])] },
      { id: 'c26_at_no', label: 'Сказать: платить нечем. Уйти', minutes: 20, terminal: true, outcomes: afterTimm,
        text: 'Она кивает и возвращается к ножу.\n\n— Kommt wieder, wenn ihr was habt. Oder wenn ihr Hände habt.\n\nПриходите, когда будет что-то. Или когда будут руки.\n\nМолока она всё-таки наливает тебе литр, в банку. Бесплатно. «Für das Kind». Для ребёнка.', effects: [set26('at', 'no'), { give: 'c26_milk', qty: 1 }, timmUntil([10, 0], [13, 40])] },
    ] }),

  J({ id: 'c26_a_brandt', title: 'Брандт', ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'Ты заходишь в пожарную часть. Брандт сидит в караулке над списками. Сабина стоит у окна с термосом.' },
      { when: v('w.c25_truth', 'brandt'), text: 'Ты просишь его выйти. Он смотрит на тебя, на дочь, и не встаёт.\n\n— Was du zu sagen hast, kannst du vor ihr sagen.\n\nЧто хочешь сказать, можешь сказать при ней.' },
      { when: v('w.c25_truth', 'all'), text: 'Во дворе раздают пайки. Человек сорок в очереди. Ты встаёшь на ящик у ворот, чтобы тебя было слышно.' },
      { text: 'Ты говоришь. Про Ройтера и двести двенадцать. Про ноль. Про то, что плазма только откладывает. Про то, что Матс не болел.' },
      { when: brandtAlly, text: 'Брандт молчит долго. Потом снимает каску и кладёт на стол.\n\n— Dann räumen wir die Senke. Das ist wenigstens echt. Das kann man anfassen.\n\nТогда расчистим впадину. Это хотя бы настоящее. Это можно потрогать.\n\nСабина за его спиной закрывает глаза.' },
      { when: brandtHostile, text: 'Брандт встаёт. Медленно.\n\n— Wer das weitererzählt, fliegt von der Liste. Du auch. Raus.\n\nКто будет это пересказывать, вылетит из списка. Ты тоже. Вон.' },
      { when: all(not(brandtAlly), not(brandtHostile)), text: 'Брандт садится обратно. Снимает каску. Смотрит на неё в руках, как на чужую.\n\n— Sabine hat es mir am Sonntag gesagt. Ich habe ihr nicht geglaubt. — Он не поднимает глаз. — Geht. Alle. Geht nach Hause.\n\nСабина сказала мне это в воскресенье. Я ей не поверил. Идите. Все. Идите по домам.' },
    ],
    actions: [
      { id: 'c26_ab_stay', label: 'Остаться ещё на минуту', minutes: 20, terminal: true, outcomes: afterBrandt,
        text: 'Ты стоишь. Сабина подходит к отцу и кладёт руку ему на плечо. Он не отстраняется. Ты уходишь, стараясь не хлопнуть дверью.', effects: [set26('ab', 'stay'), { move: farm26 }, until26(16, 30)] },
      { id: 'c26_ab_go', label: 'Уйти сразу', minutes: 10, terminal: true, outcomes: afterBrandt,
        text: 'Ты выходишь. Во дворе тихо. Даже очередь за пайками замолчала.', effects: [set26('ab', 'go'), { move: farm26 }, until26(16, 20)] },
    ] }),

  A({ id: 'c26_a_salt', title: 'Мясо', camp: kitchen14,
    text: [
      { text: 'Шесть кило мяса на кухонном столе. Нина смотрит на него, как на чудо. Эва уже достаёт соль, банки, бочонок из подвала.' },
      { text: 'Мяса много. Больше, чем вы съедите за неделю. Меньше, чем хватит на зиму.' },
    ],
    actions: [
      { id: 'c26_as_all', label: 'Засолить всё: на зиму', minutes: 50, activity: 'light', terminal: true, outcomes: [{ id: 'dl', when: dutyA, goto: 'c26_a_home' }, { id: 'y', goto: 'c26_a_yardwork' }],
        text: 'Соль, перец из пакетика, лавровый лист, который Эва нашла в шкафу Хенрике. Мясо ложится в бочонок слоями. Эва придавливает его камнем.\n\n— Sechs Wochen. Dann ist es gut.\n\nШесть недель. Тогда будет готово.', effects: [set26('as', 'all'), w26('meat', 'salt'), { take: 'c26_beef', qty: 5 }, { place: 'c26_salt_beef', at: 'c3_farm_stock', qty: 5 }, { take: 'c26_beef', qty: 1 }, until26(14, 0)] },
      { id: 'c26_as_share', label: 'Треть — Уте и Кёлер, остальное засолить', minutes: 50, terminal: true, outcomes: [{ id: 'dl', when: dutyA, goto: 'c26_a_home' }, { id: 'y', goto: 'c26_a_yardwork' }],
        text: 'Два куска ты заворачиваешь в газету. Нина бегом относит один к Кёлер, второй — к насыпи, Уте. Возвращается раскрасневшаяся.\n\n— Кёлер сказала: завтра хлеб. Уте ничего не сказала. Она плакала.', effects: [set26('as', 'share'), w26('meat', 'share'), { take: 'c26_beef', qty: 6 }, { place: 'c26_salt_beef', at: 'c3_farm_stock', qty: 3 }, npc('c3_koehler', 2), npc('c14_ute', 2), until26(14, 0)] },
      { id: 'c26_as_point', label: 'Половину — в пункт Зандер, для больных', minutes: 40, terminal: true, outcomes: [{ id: 'dl', when: dutyA, goto: 'c26_a_home' }, { id: 'y', goto: 'c26_a_yardwork' }],
        text: 'Три кило ты заворачиваешь отдельно. Завтра {B} отнесёт в пункт: бульон для тех, кто в жару. Остальное — в бочонок.', effects: [set26('as', 'point'), w26('meat', 'point'), { take: 'c26_beef', qty: 6 }, { place: 'c26_salt_beef', at: 'c3_farm_stock', qty: 2 }, w26('broth_for_point', true), until26(13, 50)] },
    ] }),

  A({ id: 'c26_a_yardwork', title: 'Двор', camp: yard14, ambient: snow26,
    text: [
      { text: 'После обеда — двор. Снег на крыше сарая тяжёлый, мокрый снизу. Если не сбросить, стропила не выдержат.' },
      { when: flag('w.c26_hollow_seen'), text: 'Ты работаешь и думаешь о впадине. О сотнях лиц, повёрнутых к дороге.' },
      { text: 'Лестница у сарая обледенела: на каждой перекладине приходится сбивать лёд каблуком. С крыши виден весь хутор сразу: дым из трубы, Нинины следы к курятнику, колея от ворот.' },
    ],
    actions: [
      { id: 'c26_ay_roof', label: 'Залезть на крышу сарая и сбросить снег', minutes: 80, activity: 'heavy', terminal: true, goto: 'c26_a_postman', ambientDuring: snow26,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Лопата, лестница, верёвка вокруг пояса. Снег уходит пластами, с шорохом. Через час крыша чёрная, мокрая. Стропила целы.', effects: [set26('ay', 'roof'), w26('roof_clear', true), { body: 'fatigue', delta: 8 }] },
          { id: 'slip', text: 'На середине нога едет по мокрому шиферу. Верёвка держит. Ты висишь секунду, пока не находишь опору. Ладонь ободрана о край. Снег ты всё-таки сбрасываешь, медленнее.', effects: [set26('ay', 'roof'), w26('roof_clear', true), { injure: 'scratch', site: 'hands', severity: 1 }, { body: 'fatigue', delta: 10 }, { body: 'stress', delta: 2 }] },
        ], effects: [until26(14, 40)] },
      { id: 'c26_ay_fence', label: 'Подлатать изгородь у задней калитки', minutes: 70, activity: 'moderate', terminal: true, goto: 'c26_a_postman', ambientDuring: snow26,
        text: 'Две жерди сгнили у земли. Ты меняешь их на новые из сарая, прибиваешь, натягиваешь проволоку. Изгородь не остановит того, кто захочет пройти. Но заставит его потратить время.', effects: [set26('ay', 'fence'), w26('fence_fixed', true), { body: 'fatigue', delta: 6 }, until26(14, 30)] },
      { id: 'c26_ay_nina', label: 'Позвать Нину и научить её колоть дрова', minutes: 60, activity: 'moderate', terminal: true, goto: 'c26_a_postman', ambientDuring: snow26,
        text: 'Колун для неё тяжёлый. Ты показываешь: не силой, а весом, и смотреть на трещину. С пятого раза полено раскалывается. Нина смотрит на половинки так, будто сама их родила.', effects: [set26('ay', 'nina'), npc('c7_nina', 2), until26(14, 20)] },
    ] }),

  A({ id: 'c26_a_postman', title: 'Почтальон', camp: yard14, ambient: snow26,
    text: [
      { text: 'Около трёх Нина зовёт тебя к окну наверху.\n\n— Вон. У лесополосы. Почтальон.\n\nНа краю поля, у берёз, стоит один. В белом. Лицом к хутору. Он стоит так ровно, что его можно принять за столб.' },
      { when: { has: 'c24_binoculars' }, text: 'В бинокль видно лицо: молодое, гладкое, на виске пластырь от капельницы. На запястье браслет.' },
    ],
    actions: [
      { id: 'c26_ap_leave', label: 'Оставить: стоит и стоит', minutes: 20, terminal: true, goto: 'c26_a_nina',
        text: '— Он всегда так стоит, — говорит Нина. — С понедельника. Утром приходит, вечером уходит. Как на работу.\n\nОна говорит это спокойно. Ты — не {m:спокоен|спокойна}.', effects: [set26('ap', 'leave'), w26('postman', true), until26(15, 50)] },
      { id: 'c26_ap_watch', label: 'Смотреть, куда он уйдёт вечером', minutes: 50, terminal: true, goto: 'c26_a_nina',
        text: 'Ты стоишь у окна, пока не начинает темнеть. В половине четвёртого он поворачивается и уходит вдоль лесополосы, на восток. К автобану. К впадине.', effects: [set26('ap', 'watch'), w26('postman', true), w26('postman_east', true), until26(15, 50)] },
      { id: 'c26_ap_noise', label: 'Выйти и постучать по ведру: увести его подальше', minutes: 40, terminal: true, goto: 'c26_a_nina', ambientDuring: snow26,
        text: 'Ты идёшь вдоль изгороди и стучишь палкой по ведру. Он поворачивает голову на звук. Делает шаг. Ещё. Ты уводишь его вдоль поля, к дороге на Ханштедт, и там бросаешь ведро. Обратно ты идёшь быстро и ни разу не оглядываешься.', effects: [set26('ap', 'noise'), w26('postman', true), w26('postman_led', true), { body: 'stress', delta: 3 }, until26(15, 50)] },
    ] }),

  A({ id: 'c26_a_home', title: 'Дома', camp: yard14, ambient: snow26,
    text: [
      { when: oleNow, text: 'У ворот стоит «Вольф». Тобиас помогает выйти Оле. Тот держится за дверцу, потом за Тобиаса, потом за тебя. Хенрике выходит с другой стороны с двумя сумками и не даёт никому их взять.' },
      { when: not(oleNow), text: 'Во дворе Нина кормит кур. Снег на крыше сарая подтаял и снова схватился сосульками.' },
      { when: carLoss, text: 'Под навесом пусто. Только масляное пятно на снегу там, где стояла Corsa.' },
      { when: not(oleNow), text: 'Небо на западе жёлтое и холодное. Куры уходят в курятник сами, раньше обычного: к ночи будет мороз.' },
    ],
    actions: [
      { id: 'c26_ah_ole', label: 'Довести Оле до лавки у печи', when: oleNow, minutes: 30, terminal: true, goto: 'c26_supper',
        text: 'Оле идёт медленно. На крыльце он останавливается и смотрит на двор: груша, курятник, колодец, Нина с ведром. Говорит одно слово: «Hof». Хутор. Потом садится на лавку и закрывает глаза. Нина приносит ему кружку и стоит рядом, не уходя.', effects: [set26('ah', 'ole'), npc('ole', 2), npc('henrike', 2), until26(18, 25)] },
      { id: 'c26_ah_tobias', label: 'Поблагодарить Тобиаса', when: oleNow, minutes: 20, terminal: true, goto: 'c26_supper',
        text: '— Er wollte. Selbst. Im letzten Moment. — Тобиас садится обратно за руль. — Und die Ärztin hat gesagt: wenn er bleibt, stirbt er. Das hat geholfen.\n\nОн сам захотел. В последний момент. А врач сказала: останется — умрёт. Это помогло.', effects: [set26('ah', 'tobias'), npc('c15_tobias', 2), until26(18, 20)] },
      { id: 'c26_ah_wood', label: 'Натаскать дров на ночь', minutes: 40, activity: 'moderate', terminal: true, outcomes: [{ id: 'l', when: all(not(oleNow), { before: at(25, 17, 30) }), goto: 'c26_a_lamp' }, { id: 's', goto: 'c26_supper' }], ambientDuring: snow26,
        text: 'Шесть охапок. Дрова в поленнице подмёрзли друг к другу, приходится отбивать их колуном.', effects: [set26('ah', 'wood'), until26(17, 10)] },
      { id: 'c26_ah_sit', label: 'Посидеть на крыльце', minutes: 20, terminal: true, outcomes: [{ id: 'l', when: all(not(oleNow), { before: at(25, 17, 30) }), goto: 'c26_a_lamp' }, { id: 's', goto: 'c26_supper' }], ambientDuring: snow26,
        text: 'Ты сидишь и смотришь, как темнеет. Ноги гудят после поля.', effects: [set26('ah', 'sit'), { body: 'stress', delta: -2 }, until26(17, 10)] },
      { id: 'c26_ah_gate', label: 'Обойти изгородь и проверить заднюю калитку', when: not(oleNow), minutes: 30, terminal: true, outcomes: [{ id: 'l', when: { before: at(25, 17, 30) }, goto: 'c26_a_lamp' }, { id: 's', goto: 'c26_supper' }], ambientDuring: snow26,
        text: 'Калитка держится на одной петле и на проволоке. Ты подвязываешь её второй проволокой, крест-накрест, и подпираешь жердью. У изгороди следы: босые, старые, присыпанные. Кто-то ходил здесь позавчера.', effects: [set26('ah', 'gate'), w26('gate_fixed', true), until26(16, 50)] },
    ] }),
];
