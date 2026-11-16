import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { entryJoin } from './point30';
import {
  S31, afterBox, after31, brothers31, carDue31, deniz31, ditch31, farm31, frost31, henrike31, jest31, kerem31, ole31, set31, until31, w31,
} from './point31';

// Участок 31, линия A в обычный день: ящик из кабины, братья Айдын, машина или двор.
// Находка: замок с тремя колёсиками; подсказка — мел на заднем борту в обязательной сцене «Трос» («KOL 7», «ab H 19.11.») → 7-1-9.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S31({ ...scene, for: 'any', chapter: 'ch3' });
const barn = { at: farm31, stock: 'c3_farm_stock', rest: false as const };
const brothersBoth: Cond = all(deniz31, kerem31);
const denizOnly: Cond = all(deniz31, not(kerem31));
const keremOnly: Cond = all(kerem31, not(deniz31));
const afterDeniz = [{ id: 'car', when: carDue31, goto: 'c31_a_car' }, { id: 'yard', goto: 'c31_a_yard' }];
const opened = (how: 'open' | 'broken') => [set31('box', how), w31('box', how)];

export const day31AScenes: Scene[] = [
  A({ id: 'c31_a_box', title: 'Ящик', camp: barn,
    text: [
      { text: 'Ящик ты заносишь в сарай. Серый, армейский, с ручками по бокам, тяжелее, чем выглядит. На крышке трафаретом номер и орёл.' },
      { text: 'Замок навесной, на три колёсика с цифрами от нуля до девяти. Сейчас на них три нуля.' },
      { text: 'Внутри, если тряхнуть, что-то мягкое и что-то металлическое.' },
    ],
    actions: [
      { id: 'c31_ab_719', label: 'Набрать 7-1-9', minutes: 10, terminal: true, goto: 'c31_a_open',
        text: 'Колёсики щёлкают под ногтем. Семь. Один. Девять. Дужка выходит из корпуса с мягким звуком, будто её только и ждали.', effects: [set31('ab', '719'), ...opened('open'), until31(10, 45)] },
      { id: 'c31_ab_197', label: 'Набрать 1-9-7', minutes: 10, terminal: true, goto: 'c31_a_box2',
        text: 'Один. Девять. Семь. Дужка не идёт.', effects: [set31('ab', '197')] },
      { id: 'c31_ab_911', label: 'Набрать 9-1-1', minutes: 10, terminal: true, goto: 'c31_a_box2',
        text: 'Девять. Один. Один. Дужка не идёт.', effects: [set31('ab', '911')] },
      { id: 'c31_ab_117', label: 'Набрать 1-1-7', minutes: 10, terminal: true, goto: 'c31_a_box2',
        text: 'Один. Один. Семь. Дужка не идёт.', effects: [set31('ab', '117')] },
      { id: 'c31_ab_break', label: 'Сбить замок ломом', minutes: 30, activity: 'moderate', terminal: true, goto: 'c31_a_broke',
        text: 'Лом Хенрике висит у двери. Замок крепкий, армейский. Ты бьёшь по дужке, потом поддеваешь петлю. На десятом ударе петля отрывается вместе с куском крышки. Внутри что-то хрустнуло.', effects: [set31('ab', 'break'), ...opened('broken'), { body: 'fatigue', delta: 3 }, until31(11, 0)] },
      { id: 'c31_ab_leave', label: 'Не трогать: пусть стоит', minutes: 5, terminal: true, outcomes: afterBox,
        text: 'Ты задвигаешь ящик под верстак. Чужое. Пусть стоит.', effects: [set31('ab', 'leave'), w31('box', 'left'), until31(10, 45)] },
    ] }),

  A({ id: 'c31_a_box2', title: 'Ящик', camp: barn,
    text: [{ text: 'Ты крутишь колёсики дальше, наугад, пока пальцы не начинают мёрзнуть. Ноль-ноль-один, ноль-ноль-два. Так можно до вечера. Сорок минут уходит впустую.' }],
    actions: [
      { id: 'c31_a2_break', label: 'Сбить замок ломом', minutes: 30, activity: 'moderate', terminal: true, goto: 'c31_a_broke',
        text: 'Ты снимаешь со стены лом Хенрике. Бьёшь по дужке, потом поддеваешь петлю. На десятом ударе петля отрывается вместе с куском крышки. Внутри что-то хрустнуло.', effects: [set31('a2', 'break'), ...opened('broken'), { body: 'fatigue', delta: 3 }, until31(11, 40)] },
      { id: 'c31_a2_leave', label: 'Бросить: пусть стоит', minutes: 5, terminal: true, outcomes: afterBox,
        text: 'Ты задвигаешь ящик под верстак. Не сегодня.', effects: [set31('a2', 'leave'), w31('box', 'left'), until31(11, 20)] },
      { id: 'c31_a2_ole', label: 'Спросить Хенрике: может, она знает код', minutes: 20, terminal: true, outcomes: afterBox,
        text: 'Хенрике смотрит на ящик и пожимает плечами: «Das ist von Werners Leuten. Nicht von uns». Это от людей Вернера. Не наше. Потом, подумав, говорит: у мужа на учениях код всегда был год выпуска. На крышке выбито: 1997. Ты пробуешь. Не подходит. Ящик остаётся закрытым до другого раза.', effects: [set31('a2', 'ask'), w31('box', 'asked'), until31(11, 20)] },
    ] }),

  A({ id: 'c31_a_open', title: 'Что внутри', camp: barn,
    text: [
      { text: 'Сверху два комплекта зимнего белья в целлофане, армейского, серого, с начёсом. Под ними спиртовка, складная, с коробкой сухого спирта. На самом дне в планшете карта района, вся в карандаше.' },
      { text: 'Кружки, стрелки, цифры. Посты: Ханштедт, Хольм-Зеппензен, мост у Винзена. У каждого кружка время смены и частота. Кто-то вёл эту карту неделю, аккуратно, мелким почерком.' },
    ],
    actions: [
      { id: 'c31_ao_all', label: 'Забрать всё', minutes: 10, terminal: true, outcomes: afterBox,
        text: 'Бельё ты кладёшь в рюкзак. Спиртовку и карту — в карман куртки. Ящик пустой задвигаешь под верстак.', effects: [set31('ao', 'all'), { give: 'c31_thermals', qty: 2 }, { give: 'c31_burner' }, { give: 'c31_post_map' }, until31(11, 0)] },
      { id: 'c31_ao_give', label: 'Один комплект белья отдать Хенрике: пусть решит, кому', when: henrike31, minutes: 15, terminal: true, outcomes: afterBox,
        text: 'Хенрике разворачивает целлофан, щупает начёс большим пальцем, как ткань на рынке, и молча уносит в дом. Вечером ты видишь его на верёвке у печи: она уже выстирала.', effects: [set31('ao', 'give'), { give: 'c31_thermals', qty: 1 }, { give: 'c31_burner' }, { give: 'c31_post_map' }, { place: 'c31_thermals', at: 'c3_farm_stock', qty: 1 }, npc('henrike', 2, 'c31_gave_thermals'), until31(11, 0)] },
    ] }),

  A({ id: 'c31_a_broke', title: 'Что внутри', camp: barn,
    text: [
      { text: 'Сверху два комплекта зимнего белья в целлофане, серого, с начёсом. Под ними спиртовка, складная. Была: лом прошёл сквозь крышку и смял её в лепёшку, коробка сухого спирта лопнула, белые таблетки раскрошились по дну.' },
      { text: 'На самом дне в планшете карта района, вся в карандаше. Кружки, стрелки, цифры. Посты, время смены, частоты.' },
      { text: 'Петли погнулись, крышка открывается с визгом. Изнутри пахнет нафталином и машинным маслом.' },
    ],
    actions: [
      { id: 'c31_ak_take', label: 'Забрать бельё и карту', minutes: 10, terminal: true, outcomes: afterBox,
        text: 'Смятую спиртовку ты бросаешь обратно в ящик. Бельё и карту забираешь.', effects: [set31('ak', 'take'), { give: 'c31_thermals', qty: 2 }, { give: 'c31_post_map' }, until31(11, 50)] },
      { id: 'c31_ak_map', label: 'Забрать только карту, бельё отдать Уве и Яннесу', minutes: 15, terminal: true, outcomes: afterBox,
        text: 'Карту ты убираешь за пазуху. Бельё относишь в колонию: Уве ночью стоял в цепи в одной куртке, а у Яннеса дыра на пятке. Уте берёт свёрток и долго держит, не разворачивая.', effects: [set31('ak', 'give'), { give: 'c31_post_map' }, npc('c14_ute', 2, 'c31_thermals'), until31(11, 55)] },
      { id: 'c31_ak_back', label: 'Закрыть крышку: вещи не наши', minutes: 5, terminal: true, outcomes: afterBox,
        text: 'Ты закрываешь погнутую крышку, насколько она закрывается, и задвигаешь ящик под верстак. Чужое. Пусть лежит.', effects: [set31('ak', 'back'), until31(11, 45)] },
    ] }),

  A({ id: 'c31_a_deniz', title: 'Братья', camp: yard14, ambient: frost31, onEnter: [until31(12, 30)],
    text: [
      { when: brothersBoth, text: 'В половине первого у ворот тормозит белый «Транзит» Дениза. Из кабины вылезают оба брата Айдын, Дениз в комбинезоне, Керем, прихрамывая.' },
      { when: denizOnly, text: 'В половине первого у ворот тормозит белый «Транзит». Дениз один, в комбинезоне, с термосом.' },
      { when: keremOnly, text: 'В половине первого у ворот тарахтит мопед Керема. Керем один, прихрамывает сильнее, чем в прошлый раз.' },
      { when: not(brothers31), text: 'В половине первого у ворот останавливается «Вольф» Тобиаса. Тобиас не выходит, только опускает стекло.' },
      { when: all(brothers31, ditch31, after31('home')), text: '— Wo liegt er? — спрашивают вместо приветствия. Где он лежит? Про трактор в канаве уже знает весь Йестебург.' },
      { when: all(ditch31, after31('share')), text: 'Трактор утром вытащили солдаты Тобиаса, «Вольфом» на тросе. Он стоит во дворе с помятым прицепом.' },
      { when: all(ditch31, after31('leave')), text: 'Трактор лежит в канаве, как лежал. Вы решили не трогать его до оттепели.' },
      { when: brothers31, text: '— Wir machen die Werkstatt zu, — говорят они. Мастерскую закрываем. — In Buchholz ist es still. Kein Strom, keine Leute. Die meisten von denen sind zur Autobahn, auf den Lärm. In den Häusern ist noch Zeug. Werkzeug, der Generator. Zwei Tage, Mittwoch, Donnerstag. Kommst du mit?\n\nВ Бухгольце тихо. Ни тока, ни людей. Большинство тех ушло к автобану, на шум. В домах ещё много всего. Инструмент, генератор. Два дня, среда и четверг. Поедешь с нами?' },
      { when: all(brothers31, flag('w.c22_deniz_listed')), text: 'Почему бросают, не говорят. Но ты помнишь: Дениз в списке Брандта, среди тех, кто болел и выздоровел.' },
      { when: all(brothers31, flag('w.c22_fuel_debt')), text: 'Про канистру, которую Керем оставил в долг, никто не вспоминает. Пока.' },
      { when: not(brothers31), text: '— Die Zander braucht einen Generator für die Station. In Buchholz, in der Werkstatt von den Aydıns, steht einer. Zwei Tage. Denk drüber nach.\n\nЗандер нужен генератор для пункта. В Бухгольце, в мастерской Айдынов, есть один. Два дня. Подумай.' },
      { when: v('$.c31_au2', 'no'), text: 'Уве ты {m:отказал|отказала}. Шланг так и лежит у него на лавке, рваный.' },
    ],
    actions: [
      { id: 'c31_ad_tractor', label: 'Тянуть трактор вместе', when: all(brothers31, ditch31, after31('home')), minutes: 120, activity: 'heavy', terminal: true, outcomes: afterDeniz, ambientDuring: frost31,
        text: 'Трос от «Транзита», доски под колёса, лопаты. Два часа на морозе. Трактор выползает из канавы рывками, как больная корова. Прицеп ставите на колёса вчетвером. Фара разбита, крыло смято, но мотор заводится с третьего раза.', effects: [set31('ad', 'tractor'), npc('deniz', 1), npc('kerem', 1), { body: 'fatigue', delta: 10 }, until31(14, 45)] },
      { id: 'c31_ad_ask', label: 'Спросить, что сейчас в Бухгольце', when: brothers31, minutes: 60, terminal: true, outcomes: afterDeniz,
        text: 'Рассказывают коротко. Вокзал пуст, на путях стоит поезд с выбитыми окнами. Больница закрыта, двери нараспашку. В супермаркете на Бремер-штрассе вынесли всё, даже полки.\n\n— Bei dir in der Straße stehen die Häuser noch, — говорит Дениз. — Fenster ganz. Ich bin vorbeigefahren.\n\nНа твоей улице дома стоят. Окна целы. Я проезжал мимо.', effects: [set31('ad', 'ask'), set31('heard_buchholz', true), until31(14, 0)] },
      { id: 'c31_ad_yes', label: 'Сказать сразу: поеду', when: brothers31, minutes: 30, terminal: true, outcomes: afterDeniz,
        text: 'Дениз кивает, как будто иначе и быть не могло. Керем хлопает тебя по плечу.\n\n— Um sieben. Zieh dich warm an. In der Werkstatt ist es kälter als draußen.\n\nВ семь. Одевайся тепло. В мастерской холоднее, чем на улице.', effects: [set31('ad', 'yes'), npc('deniz', 2, 'c31_said_yes'), npc('kerem', 1), until31(13, 30)] },
      { id: 'c31_ad_think', label: 'Сказать: подумаю до вечера', minutes: 20, terminal: true, outcomes: afterDeniz,
        text: 'Тебе отвечают, что до вечера время есть. Фургон уезжает, оставив на снегу два чёрных следа.', effects: [set31('ad', 'think'), until31(13, 15)] },
    ] }),

  A({ id: 'c31_a_car', title: 'Ключи', location: farm31, camp: yard14, ambient: frost31, onEnter: [until31(15, 0)],
    text: [
      { text: 'В три у калитки снова Лукас.\n\n— Brandt sagt, ihr könnt euer Auto holen. Heute.\n\nБрандт говорит, можете забрать машину. Сегодня.' },
      { text: 'До Йестебурга четыре километра по морозу. Пожарная часть, караулка, гвоздь с ключами.' },
    ],
    actions: [
      { id: 'c31_ac_go', label: 'Идти за машиной', minutes: 50, activity: 'moderate', terminal: true, goto: 'c31_a_brandt', ambientDuring: frost31,
        text: 'Ты идёшь пешком. Дорога укатана до блеска. Над впадиной у Гарльсторфа ещё стоит дым, серый, ровный, как от фабрики.', effects: [set31('ac', 'go'), { move: jest31 }, until31(16, 0)] },
      { id: 'c31_ac_tomorrow', label: 'Сказать Лукасу: завтра. Сегодня ноги не держат', minutes: 10, terminal: true, goto: 'c31_a_yard',
        text: 'Лукас кивает и уезжает. Машина постоит ещё день у пожарной части. Ничего с ней не будет. Наверное.', effects: [set31('ac', 'tomorrow'), w31('car_tomorrow', true), until31(15, 10)] },
      { id: 'c31_ac_nina', label: 'Взять с собой Нину: пусть прокатится обратно', minutes: 50, activity: 'moderate', terminal: true, goto: 'c31_a_brandt', ambientDuring: frost31,
        text: 'Нина одевается за две минуты и идёт рядом, подпрыгивая, чтобы не отстать. Всю дорогу она говорит о том, как поедет обратно на переднем сиденье и будет переключать радио, хотя радио не ловит ничего, кроме шипения.', effects: [set31('ac', 'nina'), { npc: 'c7_nina', trust: 1 }, until31(16, 0)] },
    ] }),

  A({ id: 'c31_a_brandt', title: 'Брандт', location: jest31, camp: { at: jest31, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: { tempC: 8, outdoor: false, wet: false },
    text: [
      { text: 'В караулке пахнет мазью и мокрой шерстью. Брандт сидит у печки. Правая рука замотана бинтом до запястья, как варежкой.' },
      { text: 'Ключи с брелоком аптеки он снимает с гвоздя левой рукой, неловко, и протягивает тебе.' },
      { when: entryJoin, text: '— Danke. Für heute Nacht.\n\nСпасибо. За эту ночь.\n\nОн говорит это так, будто слово чужое и тяжёлое.' },
      { when: not(entryJoin), text: '— Danke. Dass ihr den Rand gehalten habt.\n\nСпасибо. Что держали край.\n\nОн говорит это так, будто слово чужое и тяжёлое.' },
      { when: flag('w.c26_car_fuel_kept'), text: 'Бензин в баке остался, как и обещал Тобиас. Ещё три литра доливают из канистры дружины.' },
      { when: not(flag('w.c26_car_fuel_kept')), text: 'Бак почти пуст. Три литра доливают из канистры дружины: до дома хватит, дальше — сами.' },
      { when: v('$.c31_ac', 'go'), text: 'Расписку никто не спросил. Ключи легли тебе в ладонь, тёплые от печки.' },
    ],
    actions: [
      { id: 'c31_ak_keys', label: 'Взять ключи и ехать', minutes: 20, terminal: true, goto: 'c31_a_yard',
        text: 'Corsa заводится со второго раза. Печка дует холодом, потом тёплым. Через десять минут ты загоняешь её под навес.', effects: [set31('ak', 'keys'), { give: 'car_keys' }, { refuel: 'opel_corsa', liters: 3 }, { drive: 'opel_corsa', km: 4, to: farm31 }, w31('car_back', true), until31(16, 30)] },
      { id: 'c31_ak_hinnerk', label: 'Спросить про Хиннерка', minutes: 30, terminal: true, goto: 'c31_a_yard',
        text: '— Hinnerk Möller. Zweiundsechzig. Feuerwehr seit neunzehnhundertachtzig. — Брандт смотрит на свою руку. — Er hat mir gesagt, ich soll nicht vorgehen. Ich bin vorgegangen. Er hat mich zurückgezogen. Und ist selber gerutscht.\n\nХиннерк Мёллер. Шестьдесят два. В пожарной с восьмидесятого. Он сказал мне не лезть вперёд. Я полез. Он меня оттащил. И сам поскользнулся.\n\nДальше вы молчите. Потом ты берёшь ключи и едешь домой.', effects: [set31('ak', 'hinnerk'), npc('c16_brandt', 1, 'c31_asked_hinnerk'), { give: 'car_keys' }, { refuel: 'opel_corsa', liters: 3 }, { drive: 'opel_corsa', km: 4, to: farm31 }, w31('car_back', true), until31(16, 50)] },
    ] }),

  A({ id: 'c31_a_yard', title: 'Двор', camp: house14,
    text: [
      { text: 'Вторая половина дня короткая. В четыре уже сумерки.' },
      { when: ole31, text: 'Оле сидит на лавке у печи и пытается чинить свою шапку. Пальцы его не слушаются.' },
      { text: 'Во дворе ещё пахнет гарью: ветер всю ночь нёс дым от впадины, и снег у забора серый.' },
    ],
    actions: [
      { id: 'c31_ay_wood', label: 'Наколоть дров на два дня вперёд', minutes: 60, activity: 'heavy', terminal: true, goto: 'c31_a_pack', ambientDuring: frost31,
        text: 'Ты колешь, пока не темнеет. Поленница у стены растёт. Если завтра уезжать, это то, что после тебя останется.', effects: [set31('ay', 'wood'), { body: 'fatigue', delta: 6 }, until31(17, 0)] },
      { id: 'c31_ay_ole', label: 'Сесть с Оле', when: ole31, minutes: 60, terminal: true, goto: 'c31_a_pack',
        text: 'Ты берёшь у него шапку и иголку. Он смотрит, как ты шьёшь, и говорит:\n\n— Du nähst wie ein Soldat. Grob, aber hält.\n\nШьёшь как солдат. Грубо, но держится.', effects: [set31('ay', 'ole'), npc('ole', 1), until31(17, 0)] },
      { id: 'c31_ay_map', label: 'Разложить на столе карту из ящика', when: { has: 'c31_post_map' }, minutes: 60, terminal: true, goto: 'c31_a_pack',
        text: 'Ты разглаживаешь карту ладонью. Йестебург, Бухгольц, Винзен, Люнебург. Карандашные кружки вдоль дорог. Ты долго смотришь на дорогу до Бухгольца. Там кружков нет.', effects: [set31('ay', 'map'), set31('read_map', true), until31(17, 0)] },
      { id: 'c31_ay_sleep', label: 'Лечь на час', minutes: 60, terminal: true, goto: 'c31_a_pack',
        text: 'Ты засыпаешь сразу. Просыпаешься, когда Хенрике гремит кастрюлей.', effects: [set31('ay', 'sleep'), until31(17, 0, true)] },
    ] }),
];

/** Карта стоит в линии A и может пригодиться позже. */
export const readMap31: Cond = any(v('A.c31_ay', 'map'), flag('A.c31_read_map'));
