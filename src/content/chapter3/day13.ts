import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import {
  A12 as A13, B12 as B13, S13, dawn13, guests13, home12, house12, kept12, kitchen12, meal, own12, own13,
  promiseA13, promiseB13, report12, tense12, wound12, yard12,
} from './point12';

const any = (...xs: Cond[]): Cond => ({ any: xs });
const once = (key: string): Cond => not(flag(`$.c13_${key}`));
const toBreakfast: Effect = { restUntil: at(15, 8) };
const toPatrol: Effect = { restUntil: at(15, 9) };
const toNoon: Effect = { restUntil: at(15, 11, 30) };
const notBite = not(wound12('bite'));
const day13 = { tempC: 4, outdoor: true, wet: false };
const marcus = (trust: number): Effect => ({ npc: 'c12_marcus', trust });
const leo = (trust: number): Effect => ({ npc: 'c12_leo', trust });
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const split = (a: string, b: string) => [{ id: 'a', when: A13, goto: a }, { id: 'b', goto: b }];
const toldMarcus = any(promiseA13('promise'), promiseA13('honest'));

export const day13Scenes: Scene[] = [
  S13({ id: 'c13_dawn', for: 'any', chapter: 'ch3', title: 'Лео!', camp: tense12, ambient: dawn13,
    text: [
      { text: 'Тебя будит голос во дворе. Мужской, сорванный:\n\n— Лео! Лео!\n\nМаркус стоит посреди двора в одной рубашке. На траве иней. Он поворачивается то к калитке, то к полю, то к сараю.' },
      { when: guests13('split'), text: 'Кладовку отперли в пять. Матрас рядом с Ниной пустой, окно в комнате приоткрыто.' },
      { when: guests13('together'), text: 'На сеновале его куртка ещё тёплая. Мальчика рядом нет.' },
      { when: guests13('watch'), text: 'Дениз у лестницы трёт лицо ладонями. «Я не спал, — повторяет он. — Я не спал».' },
    ],
    actions: [
      { id: 'c13_d_out', label: 'Выбежать во двор', minutes: 2, terminal: true, outcomes: split('c13_a_yard', 'c13_b_nina'),
        text: 'Холод обжигает лицо. Маркус оборачивается на звук двери с такой надеждой, что тебе становится стыдно.', effects: [{ set: '$.c13_dawn', value: 'out' }] },
      { id: 'c13_d_partner', label: 'Растолкать {partner.acc}', minutes: 2, terminal: true, effects: [{ set: '$.c13_dawn', value: 'partner' }],
        outcomes: [
          { id: 'a', when: A13, goto: 'c13_a_yard', text: '{partner} уже натягивает куртку. — Иди во двор, — говорит {pm:он|она}. — Я посмотрю в доме.' },
          { id: 'b', goto: 'c13_b_nina', text: '{partner} уже натягивает куртку. — Я во двор, — говорит {pm:он|она}. — Посмотри в доме.' },
        ] },
      { id: 'c13_d_nina', label: 'Сначала посмотреть, где Нина', minutes: 3, terminal: true, outcomes: split('c13_a_yard', 'c13_b_nina'),
        text: 'Нина в доме, под одеялом с головой. Дышит слишком ровно для спящей.', effects: [{ set: '$.c13_dawn', value: 'nina' }] },
    ] }),

  // ───────────── Линия A: поиски, насыпь ─────────────
  S13({ id: 'c13_a_yard', for: 'any', chapter: 'ch3', title: 'Двор на рассвете', camp: tense12, ambient: dawn13,
    text: [{ text: 'Вы обходите двор втроём: ты, Маркус, Дениз. Колодец. Дровяник — Дениз светит туда фонарём и идёт дальше. Курятник. У фургона Маркус останавливается и смотрит на доски.\n\n— Он не мог… туда? — Голос у него ломается.\n\nПотом он вдруг выпрямляется.\n\n— Будка. Там его заяц остался. Он без зайца не спит.' }],
    actions: [
      { id: 'c13_ay_go', label: 'Взять фонарь и идти с ним к насыпи', minutes: 3, terminal: true, goto: 'c13_a_field',
        text: 'Ты хватаешь фонарь с крыльца. Маркус уже у калитки.', effects: [{ set: '$.c13_ay', value: 'go' }] },
      { id: 'c13_ay_deniz', label: 'Попросить Дениза ещё раз обыскать двор и идти', minutes: 3, terminal: true, goto: 'c13_a_field',
        text: 'Дениз кивает.\n\n— Найду — крикну. Отсюда до насыпи слышно.', effects: [{ set: '$.c13_ay', value: 'deniz' }] },
      { id: 'c13_ay_van', label: 'Сначала проверить доски на фургоне', when: kept12, minutes: 4, terminal: true, goto: 'c13_a_field',
        text: 'Доски целы, проволока на месте. Изнутри — стук, ровный, как всегда. Маркус выдыхает и бежит к калитке.', effects: [{ set: '$.c13_ay', value: 'van' }] },
    ] }),

  S13({ id: 'c13_a_field', for: 'any', chapter: 'ch3', title: 'Полевая дорога', location: 'c10_field', ambient: dawn13,
    text: [{ text: 'Полевая дорога белая от инея. Маркус идёт так быстро, что ты едва поспеваешь. Правую руку он прижимает к груди. Впереди серая насыпь, будка на ней — тёмный квадрат.' }],
    actions: [
      { id: 'c13_af_hand', label: 'Спросить, что у него с рукой', minutes: 20, activity: 'moderate', move: true, terminal: true, goto: 'c13_a_hut',
        effects: [{ set: '$.c13_af', value: 'hand' }],
        outcomes: [
          { id: 'told', when: toldMarcus, text: '— Дойдём — покажу, — говорит Маркус, не сбавляя шага. — Тебе покажу.' },
          { id: 'no', text: '— Ты ж мне не веришь, — говорит Маркус, не сбавляя шага. — Вот и не спрашивай.' },
        ] },
      { id: 'c13_af_quiet', label: 'Идти рядом молча', minutes: 20, activity: 'moderate', move: true, terminal: true, goto: 'c13_a_hut',
        text: 'Ты идёшь рядом. Маркус что-то бормочет себе под нос. Имя, потом снова имя. Не «Лео». Другое, женское.', effects: [{ set: '$.c13_af', value: 'quiet' }] },
      { id: 'c13_af_yard', label: 'Сказать, что мальчик мог спрятаться и во дворе', minutes: 20, activity: 'moderate', move: true, terminal: true, goto: 'c13_a_hut',
        text: '— Мог, — говорит Маркус. — А мог и сюда. Не проверю — не прощу себе.', effects: [{ set: '$.c13_af', value: 'yard' }] },
    ] }),

  S13({ id: 'c13_a_hut', for: 'any', chapter: 'ch3', title: 'Будка', location: 'c10_field', ambient: dawn13,
    text: [
      { text: 'Будка пустая. На лавке лежат плюшевый заяц с одним ухом и смятое одеяло. Лео здесь нет.\n\nМаркус садится на лавку и берёт зайца. Сидит так долго, что ты начинаешь мёрзнуть.\n\nПотом он разматывает бинт.' },
      { when: not(toldMarcus), text: 'Молча, ни слова не говоря, он протягивает тебе ладонь.' },
      { text: 'На ладони две дуги, с двух сторон, полукругом. Маленькие. Следы зубов в корке, уже затянувшиеся по краям.\n\n— Это он, — говорит Маркус. — Зубами. Когда я его от неё оттаскивал.' },
      { when: toldMarcus, text: 'И рассказывает. Анке, мама Лео, пришла с работы в среду с перевязанной рукой. Сказала: порез, бокал разбила. Он поверил. В ночь на пятницу Лео закричал в коридоре. Маркус выбежал. Анке была на мальчике, и это уже была не Анке.\n\n— Я её остановил, — говорит он. — Чем было. Он всё видел. — Маркус смотрит на ладонь. — Он меня кусал, а я всё равно его нёс. Три квартала нёс.' },
      { when: own12('well', 'posts'), text: 'Ты вспоминаешь колодец: «На постах детей сортируют. Кто с кем».' },
      { when: all(not(toldMarcus), flag('$.c12_compared')), text: 'Ты вспоминаешь, что {partner} рассказывал{pm:|а} за ужином. «Я его укусил. Сильно».' },
    ],
    actions: [
      { id: 'c13_ah_clock', label: 'Напомнить: у Оле жар начался в тот же вечер', minutes: 6, terminal: true, goto: 'c13_a_back',
        text: '— А у тебя третий день ничего, — говоришь ты.\n\n— Третий день, — повторяет Маркус. Он смотрит на свою ладонь, как на чужую. — Я каждый час трогаю лоб. Каждый час.\n\nОн закрывает лицо здоровой рукой. Плечи у него трясутся.', effects: [{ set: '$.c13_hut', value: 'clock' }, marcus(2)] },
      { id: 'c13_ah_hold', label: 'Сесть рядом и положить руку ему на плечо', minutes: 8, terminal: true, goto: 'c13_a_back',
        text: 'Маркус не отстраняется. Плечо под твоей рукой мелко дрожит, как от холода. Вы сидите, пока на насыпи не становится совсем светло.', effects: [{ set: '$.c13_hut', value: 'hold' }, marcus(2)] },
      { id: 'c13_ah_why', label: 'Спросить, зачем он назвался отцом', minutes: 6, terminal: true, goto: 'c13_a_back',
        text: '— На постах детей без родителей сажают отдельно. Я слышал. — Он трёт глаза. — А «я живу с его мамой» — кто проверит? И что я скажу? Что я с ней сделал?', effects: [{ set: '$.c13_hut', value: 'why' }] },
    ] }),

  S13({ id: 'c13_a_back', for: 'any', chapter: 'ch3', title: 'Нашёлся', camp: yard12, ambient: dawn13,
    onEnter: [{ set: '$.c13_a_knows', value: true }],
    text: [{ text: 'Обратно вы почти бежите. У калитки стоит Дениз и машет фонарём над головой.\n\n— Нашёлся! В дровянике сидел! Всю ночь!\n\nНа крыльце {partner}. Лео рядом, держится за {pm:его|её} рукав. Маркус останавливается в трёх шагах. Лео смотрит на него и не двигается с места.' }],
    actions: [
      { id: 'c13_ab_push', label: 'Подтолкнуть Маркуса вперёд', minutes: 3, terminal: true, goto: 'c13_a_bandage',
        text: 'Маркус делает шаг. Лео прячется за {partner.acc}. Маркус останавливается.\n\n— Ладно, — говорит он. — Ладно. Главное, здесь.', effects: [{ set: '$.c13_ab', value: 'push' }] },
      { id: 'c13_ab_stand', label: 'Подняться на крыльцо к {partner.dat}', minutes: 3, terminal: true, goto: 'c13_a_bandage',
        text: 'Ты поднимаешься на крыльцо. {partner} тихо говорит тебе:\n\n— Он не от Маркуса прятался. Он думает, что заразил его. Укусом. Как мама.', effects: [{ set: '$.c13_ab', value: 'stand' }] },
      { id: 'c13_ab_tell', label: 'Сказать Лео, что Маркус искал его на насыпи', minutes: 3, terminal: true, goto: 'c13_a_bandage',
        text: 'Лео смотрит на зайца в руке Маркуса. Маркус протягивает ему зайца. Лео берёт его быстро, не касаясь пальцев, и снова отступает. Но зайца прижимает к щеке.', effects: [{ set: '$.c13_ab', value: 'tell' }, leo(1)] },
    ] }),

  S13({ id: 'c13_a_bandage', for: 'any', chapter: 'ch3', title: 'Бинт', camp: yard12, ambient: day13,
    text: [
      { text: 'У колодца Маркус пытается замотать ладонь заново. Одной рукой и зубами. Бинт грязный, конец всё время выскальзывает.' },
      { when: flag('$.c12_saw_sides'), text: 'Те самые пятна с двух сторон, которые ты вчера видел{m:|а} у фургона. Теперь ты знаешь, чьи это зубы.' },
      { when: own12('arms', 'unwrap'), text: 'Вчера у калитки ты требовал{m:|а} размотать эту руку. Маркус об этом не вспоминает.' },
    ],
    actions: [
      { id: 'c13_abd_help', label: 'Промыть ему руку и перевязать своей аптечкой', when: { has: 'first_aid' }, minutes: 10, terminal: true, goto: 'c13_a_brothers',
        text: 'Ты льёшь антисептик на ладонь. Маркус шипит сквозь зубы, но руку не отдёргивает. Края укуса чистые, без красноты. Ты бинтуешь туго, как учили. Маркус сжимает и разжимает пальцы.\n\n— Как новая, — говорит он. Первый раз за утро почти улыбается.',
        effects: [{ set: '$.c13_abd', value: 'help' }, { use: 'dressing' }, { charge: 'disinfectant', delta: -10 }, marcus(2)] },
      { id: 'c13_abd_hold', label: 'Подержать конец бинта, пока он мотает', minutes: 6, terminal: true, goto: 'c13_a_brothers',
        text: 'Ты держишь конец. Маркус мотает, крутясь вокруг собственной руки. Выходит криво, но держится.\n\n— Он тоже так держал, — говорит Маркус. — В будке. Позавчера.', effects: [{ set: '$.c13_abd', value: 'hold' }, marcus(1)] },
      { id: 'c13_abd_leo', label: 'Позвать Лео: пусть поможет сам', minutes: 8, terminal: true, goto: 'c13_a_brothers',
        text: 'Лео подходит не сразу. Останавливается в шаге, смотрит на ладонь, на следы своих зубов. Потом берёт конец бинта двумя пальцами и держит, не дыша, пока Маркус мотает.', effects: [{ set: '$.c13_abd', value: 'leo' }, leo(1), marcus(1)] },
    ] }),

  S13({ id: 'c13_a_brothers', for: 'any', chapter: 'ch3', title: 'Перед дорогой', camp: yard12, ambient: day13,
    text: [
      { text: 'Дениз и Керем выносят рюкзаки к калитке.\n\n— Солдаты обещали утром, — говорит Дениз. — Не хочу, чтобы догнали на дороге и завернули обратно. Дождёмся их. Потом уйдём.' },
      { when: home12('leave'), text: '— А вы — с нами, — говорит Керем. — Так ведь?' },
      { when: { v: '$.c11_brothers', op: '==', value: 'yes' }, text: '— Если повезёшь, — говорит Керем, — то после солдат.' },
    ],
    actions: [
      { id: 'c13_abr_bags', label: 'Отнести их рюкзаки к машине', minutes: 10, activity: 'light', terminal: true, goto: 'c13_a_nina',
        text: 'Рюкзаки тяжёлые. Керем кладёт свой у заднего колеса Corsa и хлопает по крыше.\n\n— Пусть пока тут постоит.', effects: [{ set: '$.c13_abr', value: 'bags' }, { npc: 'kerem', trust: 1 }] },
      { id: 'c13_abr_kerem', label: 'Спросить Керема, что ему вчера сказал Оле', minutes: 6, terminal: true, goto: 'c13_a_nina',
        text: '— Сказал: «Живи уже». — Керем усмехается. — Я ему то же самое.', effects: [{ set: '$.c13_abr', value: 'kerem' }] },
      { id: 'c13_abr_fuel', label: 'Заглянуть в бак и прикинуть дорогу', minutes: 5, terminal: true, goto: 'c13_a_nina',
        text: 'Стрелка чуть выше четверти. До Бухгольца и обратно хватит. До Йестебурга и обратно тоже. До Целле — только в одну сторону.', effects: [{ set: '$.c13_abr', value: 'fuel' }] },
    ] }),

  S13({ id: 'c13_a_nina', for: 'any', chapter: 'ch3', title: 'Нина спрашивает', camp: yard12, ambient: day13,
    text: [
      { when: kept12, text: 'Нина ловит тебя у навеса. Из кабины фургона стучат, ровно, как всегда.\n\n— Солдаты приедут, — говорит она. — Они его увидят. Они же его… да?' },
      { when: not(kept12), text: 'Нина ловит тебя за домом, у яблони.\n\n— Солдаты приедут, — говорит она. — Они про папу спросят. Что вы им скажете?' },
    ],
    actions: [
      { id: 'c13_an_truth', label: 'Сказать правду: скорее всего, да', minutes: 5, terminal: true, goto: 'c13_breakfast',
        text: 'Нина кивает, будто ждала именно этого. — Тогда пусть лучше Дениз, — говорит она. — Не чужие. Только не сегодня.', effects: [{ set: '$.c13_an', value: 'truth' }, nina(1), toBreakfast] },
      { id: 'c13_an_talk', label: 'Пообещать, что сам{m:|а} поговоришь с солдатами', minutes: 4, terminal: true, goto: 'c13_breakfast',
        text: '— Ты? — Нина смотрит недоверчиво. Потом пожимает плечами. — Ну попробуй.', effects: [{ set: '$.c13_an', value: 'talk' }, toBreakfast] },
      { id: 'c13_an_ask', label: 'Спросить, чего хочет она сама', minutes: 6, terminal: true, goto: 'c13_breakfast',
        text: 'Нина долго молчит.\n\n— Домой, — говорит она. — Чтобы всё было как раньше. — Она шмыгает носом. — Ладно. Это я так.', effects: [{ set: '$.c13_an', value: 'ask' }, nina(2), toBreakfast] },
    ] }),

  // ───────────── Линия B: дровяник ─────────────
  S13({ id: 'c13_b_nina', for: 'any', chapter: 'ch3', title: 'Нина знает', camp: house12,
    text: [
      { when: guests13('split'), text: 'Нина лежит, отвернувшись к стене, одеяло до макушки. Рядом на матрасе вмятина от второго человека. Холодная.' },
      { when: not(guests13('split')), text: 'Нина лежит, отвернувшись к стене. Её телефон на подоконнике, экраном вниз. Под одеялом она дышит слишком ровно.' },
    ],
    actions: [
      { id: 'c13_bn_ask', label: 'Сесть на край кровати и спросить прямо, где Лео', minutes: 4, terminal: true, goto: 'c13_b_woodshed',
        effects: [{ set: '$.c13_bn', value: 'ask' }],
        outcomes: [
          { id: 'promise', when: promiseB13('promise'), text: 'Нина садится.\n\n— Ты ему обещала, — говорит она. — Не отдавать. Помнишь? Он в дровянике, за поленницей. Сам пошёл. Я одеяло отнесла.' },
          { id: 'honest', when: promiseB13('honest'), text: 'Нина садится.\n\n— Ты {m:сказал|сказала}, что его спросят. Вот и спроси. Он в дровянике, за поленницей. Сам пошёл.' },
          { id: 'trust', when: { npc: 'c7_nina', trust: ['>=', 6] }, text: 'Нина садится.\n\n— В дровянике. За поленницей. Только не ори на него.' },
          { id: 'no', text: '— Не знаю, — говорит Нина в стену. — Ушёл. Сам.\n\nПод кроватью стоят её кроссовки. Мокрые, в щепках и коре.' },
        ] },
      { id: 'c13_bn_wait', label: 'Сесть рядом и ждать, пока заговорит', minutes: 8, terminal: true, goto: 'c13_b_woodshed',
        text: 'Ты сидишь. Во дворе кричит Маркус. Нина вздрагивает на каждый крик. На пятом не выдерживает:\n\n— В дровянике. Он боится, что Маркус… Не знаю чего. Он не говорит.', effects: [{ set: '$.c13_bn', value: 'wait' }, nina(1)] },
      { id: 'c13_bn_shoes', label: 'Посмотреть на её кроссовки у кровати', minutes: 2, terminal: true, goto: 'c13_b_woodshed',
        text: 'Кроссовки мокрые, на подошвах щепки и кора. Дровяник.\n\nНина поворачивается и смотрит на тебя. Не врёт. Просто молчит.', effects: [{ set: '$.c13_bn', value: 'shoes' }] },
    ] }),

  S13({ id: 'c13_b_woodshed', for: 'any', chapter: 'ch3', title: 'За поленницей', camp: tense12, ambient: dawn13,
    text: [{ when: flag('$.c12_bb_choc'), text: 'У входа валяется обёртка от твоей шоколадки. Он съел её здесь, ночью.' }, { text: 'В дровянике пахнет смолой и холодом. Дениз проходил здесь с фонарём — и прошёл мимо. За дальней поленницей, в щели между дровами и стеной, — одеяло Нины. Из-под одеяла торчит мокрая кроссовка.\n\nВо дворе снова кричат: «Лео!» Кроссовка вздрагивает.' }],
    actions: [
      { id: 'c13_bw_sit', label: 'Сесть на чурбак рядом и ничего не говорить', minutes: 8, activity: 'rest', terminal: true, goto: 'c13_b_leo',
        text: 'Ты садишься. Долго тихо. Потом из-под одеяла:\n\n— Ist er krank?\n\nОн болен?', effects: [{ set: '$.c13_bw', value: 'sit' }, leo(1)] },
      { id: 'c13_bw_name', label: 'Тихо позвать его по имени', minutes: 3, terminal: true, goto: 'c13_b_leo',
        text: 'Одеяло отодвигается. Глаза красные, губы синие.\n\n— Ist er krank? — шепчет Лео.\n\nОн болен?', effects: [{ set: '$.c13_bw', value: 'name' }] },
      { id: 'c13_bw_marcus', label: 'Сказать, что Маркус его ищет', minutes: 3, terminal: true, goto: 'c13_b_leo',
        text: 'Лео ещё глубже вжимается в щель.\n\n— Nein. Nein. — Потом совсем тихо: — Ist er krank?\n\nОн болен?', effects: [{ set: '$.c13_bw', value: 'marcus' }, leo(-1)] },
    ] }),

  S13({ id: 'c13_b_leo', for: 'any', chapter: 'ch3', title: 'Зуб', camp: tense12, ambient: dawn13,
    text: [{ text: 'Ты не сразу понимаешь, о чём он. Лео высовывает руку из-под одеяла и трогает передний зуб. Зуб шатается.\n\n— Ich hab ihn gebissen. Wie Mama mich beißen wollte. — Он плачет без звука. — Jetzt wird er wie Mama. Wegen mir.\n\nЯ его укусил. Как мама хотела укусить меня. Теперь он станет как мама. Из-за меня.' },
      { when: own12('said', 'before'), text: 'Ты вспоминаешь вчерашнее: «Мама сказала, это просто порез».' }],
    actions: [
      { id: 'c13_bl_teeth', label: 'Сказать, что от его зубов не болеют', minutes: 6, terminal: true, goto: 'c13_b_out',
        text: 'Лео смотрит на тебя и не верит.\n\n— Echt?\n\n— Правда.\n\nОн выбирается из-под одеяла и вдруг обнимает тебя за шею. Так крепко, что больно.', effects: [{ set: '$.c13_bl', value: 'teeth' }, leo(2)] },
      { id: 'c13_bl_mama', label: 'Спросить, что случилось с мамой', minutes: 6, terminal: true, goto: 'c13_b_out',
        text: '— Mama war nicht mehr Mama. — Лео смотрит в пол. — Sie hat mich nicht erkannt. Marcus hat sie… mit dem Hammer.\n\nМама была уже не мама. Она меня не узнала. Маркус её… молотком.\n\nОн говорит это ровно, как выученный урок.', effects: [{ set: '$.c13_bl', value: 'mama' }, { body: 'stress', delta: 3 }] },
      { id: 'c13_bl_hold', label: 'Обнять его вместе с одеялом', minutes: 8, terminal: true, goto: 'c13_b_out',
        text: 'Он весь ледяной. Ты держишь его, пока он не перестаёт трястись. Во дворе снова зовут: «Лео!» Голос уже далеко, у насыпи.', effects: [{ set: '$.c13_bl', value: 'hold' }, leo(1)] },
    ] }),

  S13({ id: 'c13_b_out', for: 'any', chapter: 'ch3', title: 'Из дровяника', camp: yard12, ambient: dawn13,
    text: [{ text: 'Лео сидит у тебя на коленях, завёрнутый в одеяло. Во дворе тихо: Маркус и {partner} ушли к насыпи. У калитки ждёт Дениз.' }],
    actions: [
      { id: 'c13_bo_stove', label: 'Отнести его в дом, к печке', minutes: 8, terminal: true, goto: 'c13_b_ole',
        text: 'Нина уже растопила плиту. Лео сидит у огня и держит ладони над конфоркой. Нина садится рядом, плечом к плечу.', effects: [{ set: '$.c13_bo', value: 'stove' }] },
      { id: 'c13_bo_gate', label: 'Выйти с ним к калитке: пусть Маркус увидит сразу', minutes: 25, terminal: true, goto: 'c13_b_ole',
        text: 'Вы ждёте у калитки. Лео смотрит на поле. Когда на дороге появляются две фигуры, он сжимает твой рукав. Дениз кричит им и машет фонарём. Лео уводит тебя на крыльцо: ближе подойти он не может.', effects: [{ set: '$.c13_bo', value: 'gate' }, marcus(1)] },
      { id: 'c13_bo_nina', label: 'Сначала к Нине: пусть она тоже услышит', minutes: 10, terminal: true, goto: 'c13_b_ole',
        text: 'Ты рассказываешь Нине. Она слушает, глядя на Лео. Потом говорит: «Значит, я вчера…» — и не договаривает. Снимает свои носки и надевает ему.', effects: [{ set: '$.c13_bo', value: 'nina' }, nina(1)] },
    ] }),

  S13({ id: 'c13_b_ole', for: 'any', chapter: 'ch3', title: 'Оле и Лео', camp: kitchen12,
    text: [{ text: 'Оле сидит на кухне. Сам дошёл, держась за стену. Рука на столе распухшая, в бинтах. Лео смотрит на неё не отрываясь.\n\n— Чего смотришь, — говорит Оле. — Укусили. Сижу. Живой.' }],
    actions: [
      { id: 'c13_bol_tell', label: 'Попросить Оле рассказать Лео, как это было', minutes: 10, terminal: true, goto: 'c13_b_van',
        text: 'Оле говорит медленно, подбирая простые слова. Укусили. Горел. Потом проснулся.\n\n— А Маркус твой, — Оле кивает на двор, — не горит. Третий день. Я бы уже горел.\n\nЛео в первый раз смотрит Оле в глаза.', effects: [{ set: '$.c13_bol', value: 'tell' }, { npc: 'ole', trust: 1 }, leo(1)] },
      { id: 'c13_bol_away', label: 'Увести Лео: ему такое рано', minutes: 4, terminal: true, goto: 'c13_b_van',
        text: '— Рано, — соглашается Оле. — Нам всем рано. — Он отворачивается к окну.', effects: [{ set: '$.c13_bol', value: 'away' }] },
      { id: 'c13_bol_ask', label: 'Спросить Оле, что он думает про Маркуса', minutes: 5, terminal: true, goto: 'c13_b_van',
        text: '— Человек два дня тащит пацана, который его укусил. — Оле пожимает здоровым плечом. — Чего тут думать.', effects: [{ set: '$.c13_bol', value: 'ask' }] },
    ] }),

  S13({ id: 'c13_b_van', for: 'any', chapter: 'ch3', title: 'Под навесом', camp: yard12, ambient: day13,
    text: [
      { when: kept12, text: 'Лео выходит за тобой во двор и останавливается под навесом. Из кабины фургона стучат. Ровно, раз в несколько секунд. На чурбаке у досок сидит Нина.\n\n— Ist das auch eine Mama? — спрашивает Лео шёпотом.\n\nТам тоже мама?' },
      { when: not(kept12), text: 'Лео выходит за тобой во двор. Нина сидит под яблоней за домом, на перевёрнутом ящике. Лео смотрит на неё издалека.\n\n— Warum sitzt sie da?\n\nПочему она там сидит?' },
      { when: own12('bo', 'yes'), text: 'Вчера Оле сказал ему: «Я — это я». Лео, кажется, запомнил каждое слово.' },
    ],
    actions: [
      { id: 'c13_bv_truth', label: 'Сказать правду: там её папа, и он уже не вернётся', minutes: 6, terminal: true, goto: 'c13_breakfast',
        text: 'Лео слушает. Потом подходит к Нине и садится рядом с ней. Молча. Нина не прогоняет. Через минуту она обнимает его одной рукой, не глядя.', effects: [{ set: '$.c13_bv', value: 'truth' }, nina(1), leo(1), toBreakfast] },
      { id: 'c13_bv_nina', label: 'Позвать Нину завтракать вместе с вами', minutes: 5, terminal: true, goto: 'c13_breakfast',
        text: 'Нина поднимается не сразу. Проходя мимо Лео, она треплет его по голове. — Пошли в дом, мелкий. Холодно.', effects: [{ set: '$.c13_bv', value: 'nina' }, nina(1), toBreakfast] },
      { id: 'c13_bv_away', label: 'Увести Лео в дом', minutes: 3, terminal: true, goto: 'c13_breakfast',
        text: 'Лео идёт за тобой и всё время оглядывается. На крыльце он берёт тебя за руку. Сам.', effects: [{ set: '$.c13_bv', value: 'away' }, leo(1), toBreakfast] },
    ] }),

  // ───────────── Общий завтрак и патруль ─────────────
  S13({ id: 'c13_breakfast', for: 'any', chapter: 'ch3', title: 'Завтрак', camp: kitchen12,
    text: [
      { text: 'Завтрак — овсянка на воде и последние яйца. Все за одним столом. Лео сидит между Ниной и {B.ins}. Маркус напротив. Он не ест. Смотрит, как ест Лео.' },
      { when: wound12('bite'), text: 'Курятник молчит с рассвета. Дениз носил туда воду и вернулся бледный.' },
      { when: all(report12('report'), notBite), text: 'У двери стоят две сумки: Оле и Хенрике.' },
      { when: all(report12('family'), notBite), text: 'Оле смотрит в окно на дорогу. «Пусть приезжают, — говорит он. — Сам выйду».' },
      { when: all(report12('secret'), notBite), text: 'Хенрике смотрит на часы каждые пять минут.' },
    ],
    actions: [
      { id: 'c13_bf_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, outcomes: split('c13_a_before', 'c13_b_photo'), enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Овсянка пресная, яйцо одно на двоих. Лео ест и косится на Маркуса. Маркус делает вид, что не замечает.', effects: [meal('eat')] },
      { id: 'c13_bf_pack', label: 'Попросить отложить свою порцию', minutes: 3, terminal: true, outcomes: split('c13_a_before', 'c13_b_photo'), enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Нина накладывает твою овсянку в банку.', effects: [meal('pack')] },
      { id: 'c13_bf_skip', label: 'Выпить только кипятку', minutes: 10, terminal: true, outcomes: split('c13_a_before', 'c13_b_photo'),
        text: 'Ты греешь руки о кружку. В окне — пустая дорога.' },
      { id: 'c13_bf_tell', label: 'Рассказать {partner.dat}, что узнал{m:|а} утром', when: once('bf_tell'), minutes: 5, combinable: true,
        effects: [{ set: '$.c13_bf_tell', value: true }],
        outcomes: [
          { id: 'a_full', when: all(A13, toldMarcus), text: 'Ты рассказываешь про будку. Ладонь, две дуги маленьких зубов. Анке, «порез, бокал разбила». Ночь на пятницу.\n\n{partner} кивает.\n\n— А он думает, что заразил его, — говорит {pm:он|она}. — Укусом. Как мама. Поэтому и прятался.' },
          { id: 'a', when: A13, text: 'Ты рассказываешь про будку. Ладонь, две дуги маленьких зубов. «Когда я его от неё оттаскивал».\n\n{partner} кивает.\n\n— А он думает, что заразил его, — говорит {pm:он|она}. — Укусом. Как мама. Поэтому и прятался.' },
          { id: 'b_full', when: toldMarcus, text: 'Ты рассказываешь про дровяник. Лео не от Маркуса прятался. Он думает, что заразил его своим укусом, как мама.\n\n{partner} долго молчит. Потом рассказывает про будку: ладонь, две дуги маленьких зубов. Анке пришла с работы с перевязанной рукой и сказала: порез.' },
          { id: 'b', text: 'Ты рассказываешь про дровяник. Лео не от Маркуса прятался. Он думает, что заразил его своим укусом, как мама.\n\n{partner} долго молчит. Потом говорит: в будке Маркус показал ладонь. Там две дуги маленьких зубов.' },
        ] },
    ] }),

  S13({ id: 'c13_b_photo', for: 'any', chapter: 'ch3', title: 'Фотография', camp: house12,
    text: [
      { text: 'После завтрака Лео собирает свой рюкзак. Пижама, машинка без колеса. Потом достаёт фотографию с пляжа и долго на неё смотрит. Мама, Маркус и он сам.\n\nОн протягивает фотографию тебе.\n\n— Gib sie ihm. Ich kann nicht.\n\nОтдай ему. Я не могу.' },
      { when: own12('bag', 'look'), text: 'Ты уже видел{m:|а} её вчера. «Ostsee. Mama + Marcus + Leo».' },
    ],
    actions: [
      { id: 'c13_bp_give', label: 'Отнести фотографию Маркусу', minutes: 6, terminal: true, goto: 'c13_b_before',
        text: 'Маркус берёт фотографию здоровой рукой. Смотрит долго. Потом убирает во внутренний карман, к сердцу, и застёгивает пуговицу.\n\n— Он сам дал? — спрашивает он.\n\n— Сам.', effects: [{ set: '$.c13_bp', value: 'give' }, marcus(2)] },
      { id: 'c13_bp_together', label: 'Сказать: давай отдадим вместе', minutes: 8, terminal: true, goto: 'c13_b_before',
        text: 'Вы идёте вдвоём. У крыльца Лео останавливается и дальше не идёт. Маркус выходит сам и садится на ступеньку, чтобы быть с ним одного роста. Лео отдаёт фотографию, не глядя ему в лицо, и убегает в дом.', effects: [{ set: '$.c13_bp', value: 'together' }, leo(1), marcus(1)] },
      { id: 'c13_bp_keep', label: 'Положить её обратно в рюкзак: пусть отдаст, когда сможет', minutes: 3, terminal: true, goto: 'c13_b_before',
        text: 'Лео смотрит, как фотография исчезает в кармашке на молнии. Кивает. Застёгивает молнию сам.', effects: [{ set: '$.c13_bp', value: 'keep' }, leo(1)] },
    ] }),

  S13({ id: 'c13_a_before', for: 'any', chapter: 'ch3', title: 'До машин', camp: yard12, ambient: day13,
    text: [
      { when: all(report12('report'), notBite), text: 'Хенрике выносит к калитке две сумки и кладёт тебе на ладонь связку ключей.\n\n— Дом. Сарай. Курятник. Куры — утром и вечером. Сырую воду из колодца не пить. — Она сжимает твои пальцы на ключах. — И не врать мне, когда вернусь.' },
      { when: all(report12('secret'), notBite), text: 'Хенрике тянет тебя за рукав к калитке.\n\n— Солдатам скажем: нас здесь столько, сколько они увидят во дворе. Оле ушёл с Керемом позавчера. Запомнил{m:|а}?' },
      { when: all(report12('family'), notBite), text: 'Оле пытается застегнуть чистую рубашку одной рукой. Не выходит.\n\n— Застегни, — говорит он тебе. — Выйду к ним сам. Пусть посмотрят, как выглядит этот один из двадцати.' },
      { when: wound12('bite'), text: 'У курятника тихо. Дениз стоит у двери с лопатой и не смотрит в щель.\n\n— Солдаты приедут, пусть они, — говорит он. — Я не смогу. Её — не смогу.' },
    ],
    actions: [
      { id: 'c13_ab4_yes', label: 'Сказать, что сделаешь, как просят', minutes: 5, terminal: true, goto: 'c13_patrol', effects: [{ set: '$.c13_before', value: 'yes' }, toPatrol],
        outcomes: [
          { id: 'report', when: all(report12('report'), notBite), text: 'Ты прячешь ключи во внутренний карман. Хенрике кивает и идёт за сыном.' },
          { id: 'secret', when: all(report12('secret'), notBite), text: '— Оле ушёл с Керемом, — повторяешь ты. Хенрике кивает: «Так».' },
          { id: 'family', when: all(report12('family'), notBite), text: 'Ты застёгиваешь пуговицы. Оле стоит смирно, как ребёнок перед школой. «Спасибо» он не говорит, только кивает.' },
          { id: 'bite', text: 'Ты встаёшь рядом с Денизом. Вдвоём ждать легче.' },
        ] },
      { id: 'c13_ab4_no', label: 'Сказать, что так нельзя', minutes: 5, terminal: true, goto: 'c13_patrol', effects: [{ set: '$.c13_before', value: 'no' }, toPatrol],
        outcomes: [
          { id: 'report', when: all(report12('report'), notBite), text: '— Поздно, — говорит Хенрике. — Сказали — значит, сказали. Я сама так хочу. Держи ключи.' },
          { id: 'secret', when: all(report12('secret'), notBite), text: '— Тогда молчи, — говорит Хенрике. — Говорить буду я. Ты просто молчи.' },
          { id: 'family', when: all(report12('family'), notBite), text: '— Можно, — говорит Оле. — Я решил. Застёгивай.' },
          { id: 'bite', text: 'Дениз пожимает плечами. «А как можно?» Ответа нет ни у кого.' },
        ] },
      { id: 'c13_ab4_partner', label: 'Найти {partner.acc} и встать вместе', minutes: 5, terminal: true, goto: 'c13_patrol',
        text: '{partner} выходит на крыльцо с Лео. Вы встаёте рядом, плечом к плечу.', effects: [{ set: '$.c13_before', value: 'partner' }, toPatrol] },
    ] }),

  S13({ id: 'c13_b_before', for: 'any', chapter: 'ch3', title: 'До машин', camp: house12,
    text: [
      { when: all(report12('report'), notBite), text: 'Хенрике собирает сумку Оле. Руки её не слушаются: свитер, бритва, снова свитер.\n\n— Помоги, — говорит она. Не просит. Говорит.' },
      { when: all(report12('secret'), notBite), text: 'Хенрике и Нина стелют на чердаке одеяла. Оле лезет по лестнице одной рукой, ругаясь сквозь зубы. Лео смотрит снизу.' },
      { when: all(report12('family'), notBite), text: 'Оле стоит перед зеркалом и пытается причесаться левой рукой. Хенрике сидит на кровати и молчит. Она так и не согласилась.' },
      { when: wound12('bite'), text: 'Оле сидит у окна, выходящего на курятник. Он не спрашивает. Ты не говоришь.' },
    ],
    actions: [
      { id: 'c13_bb4_help', label: 'Помочь', minutes: 10, terminal: true, goto: 'c13_patrol', effects: [{ set: '$.c13_before', value: 'help' }, { npc: 'henrike', trust: 1 }, toPatrol],
        outcomes: [
          { id: 'report', when: all(report12('report'), notBite), text: 'Ты складываешь свитер вдвое, кладёшь бритву в носок, носок — в ботинок. Хенрике смотрит и кивает: «Правильно».' },
          { id: 'secret', when: all(report12('secret'), notBite), text: 'Ты подсаживаешь Оле снизу. Он шипит от боли, но залезает. Наверху тесно и пахнет пылью.' },
          { id: 'family', when: all(report12('family'), notBite), text: 'Ты причёсываешь Оле. Он терпит, глядя в потолок. Хенрике на кровати отворачивается.' },
          { id: 'bite', text: 'Ты садишься рядом с Оле. Он кладёт здоровую руку тебе на плечо и так сидит.' },
        ] },
      { id: 'c13_bb4_leo', label: 'Объяснить Лео, что сейчас приедут солдаты', minutes: 5, terminal: true, goto: 'c13_patrol',
        text: 'Лео слушает, держась за край стола.\n\n— Nehmen sie Marcus mit?\n\nЗаберут Маркуса? Ты не знаешь, что ответить.', effects: [{ set: '$.c13_before', value: 'leo' }, toPatrol] },
      { id: 'c13_bb4_nina', label: 'Спросить Нину, что она скажет солдатам о себе', minutes: 5, terminal: true, goto: 'c13_patrol',
        text: '— Что мне восемнадцать, — говорит Нина. — И что я тут работаю. — Она смотрит в окно на фургон. — Я никуда не поеду.', effects: [{ set: '$.c13_before', value: 'nina' }, toPatrol] },
    ] }),

  S13({ id: 'c13_patrol', for: 'any', chapter: 'ch3', title: 'Ärmel hoch', camp: tense12, ambient: day13,
    text: [
      { text: 'В девять у калитки останавливаются две машины: вчерашний внедорожник и белый фургон с красным крестом. Из фургона выходит женщина лет пятидесяти, в камуфляжной куртке поверх свитера, с сумкой через плечо. Врач.\n\n— Ärmel hoch, — говорит солдат. — Alle. Auch die Kinder.\n\nВсе выстраиваются во дворе. Рукава до локтя.' },
      { when: all(report12('secret'), notBite), text: 'Солдат считает людей вслух и записывает. Потом смотрит на окно чердака.' },
      { when: all(report12('family'), notBite), text: 'Оле выходит последним, в чистой рубашке, и сам закатывает рукав.' },
      { when: all(report12('report'), notBite), text: 'Оле с Хенрике стоят у калитки с сумками.' },
      { when: wound12('bite'), text: 'Из курятника слышны удары. Солдат снимает автомат с плеча.' },
    ],
    actions: [
      { id: 'c13_p_marcus', label: 'Встать рядом с Маркусом', when: A13, minutes: 2, terminal: true, goto: 'c13_a_doctor', effects: [{ set: '$.c13_p', value: 'marcus' }, marcus(1)] },
      { id: 'c13_p_gate', label: 'Встать ближе к солдату', when: A13, minutes: 2, terminal: true, goto: 'c13_a_doctor', effects: [{ set: '$.c13_p', value: 'gate' }] },
      { id: 'c13_p_partner_a', label: 'Встать рядом с {partner.ins}', when: A13, minutes: 2, terminal: true, goto: 'c13_a_doctor', effects: [{ set: '$.c13_p', value: 'partner' }] },
      { id: 'c13_p_hold', label: 'Держать Лео за руку', when: B13, minutes: 2, terminal: true, goto: 'c13_b_doctor', effects: [{ set: '$.c13_p', value: 'hold' }] },
      { id: 'c13_p_crouch', label: 'Присесть к Лео и сказать, что всё будет хорошо', when: B13, minutes: 2, terminal: true, goto: 'c13_b_doctor', effects: [{ set: '$.c13_p', value: 'crouch' }] },
      { id: 'c13_p_nina', label: 'Встать рядом с Ниной', when: B13, minutes: 2, terminal: true, goto: 'c13_b_doctor', effects: [{ set: '$.c13_p', value: 'nina' }] },
    ] }),

  S13({ id: 'c13_a_doctor', for: 'any', chapter: 'ch3', title: 'Врач', camp: tense12, ambient: day13,
    text: [{ text: 'Врач идёт вдоль строя. У Маркуса она останавливается.\n\n— Abwickeln.\n\nМаркус разматывает бинт. Врач берёт его ладонь и поворачивает к свету. Солдат за её спиной делает шаг вперёд.\n\n— Biss, — говорит врач. — Wann?\n\nИ тут от крыльца срывается Лео. Он бежит через двор, вцепляется Маркусу в рукав, в тот, где бинт, и кричит врачу прямо в лицо:\n\n— Ich war das! Ich! Ich hab ihn gebissen!\n\nВрач смотрит на мальчика. Потом приседает.\n\n— Mach mal den Mund auf.' }],
    actions: [
      { id: 'c13_ad_temp', label: 'Сказать врачу: позавчера ночью, и жара нет', minutes: 3, terminal: true, goto: 'c13_cleared',
        text: '— Vorgestern Nacht, — говоришь ты. — Позавчера ночью. Вчера вечером мерили: тридцать шесть и восемь.\n\nВрач кивает, не отрываясь от зубов Лео, будто сверяет с чем-то в голове.', effects: [{ set: '$.c13_ad', value: 'temp' }, marcus(1)] },
      { id: 'c13_ad_stand', label: 'Встать между солдатом и Маркусом', minutes: 3, terminal: true, goto: 'c13_cleared', risky: true,
        text: 'Солдат смотрит на тебя сверху вниз.\n\n— Zurück.\n\nТы не двигаешься. Врач, не оборачиваясь, поднимает руку:\n\n— Lass mal. Warte.', effects: [{ set: '$.c13_ad', value: 'stand' }, marcus(2), { body: 'stress', delta: 3 }] },
      { id: 'c13_ad_watch', label: 'Молчать и смотреть на Лео', minutes: 3, terminal: true, goto: 'c13_cleared',
        text: 'Лео держит рукав Маркуса обеими руками. Маркус стоит не шевелясь, как будто рукав может порваться.', effects: [{ set: '$.c13_ad', value: 'watch' }] },
    ] }),

  S13({ id: 'c13_b_doctor', for: 'any', chapter: 'ch3', title: 'Врач', camp: tense12, ambient: day13,
    text: [
      { text: 'Врач идёт вдоль строя. Смотрит руки Нины, твои, руки Лео — быстро, привычно. У Маркуса она останавливается. Он разматывает бинт. Солдат за её спиной делает шаг вперёд.\n\n— Biss, — говорит врач.\n\nЛео рядом с тобой перестаёт дышать.' },
      { when: own13('p', 'hold'), text: 'Его ладонь в твоей вдруг выкручивается, как рыба.' },
      { when: own13('p', 'crouch'), text: 'Он отталкивает тебя обеими руками.' },
      { when: own13('p', 'nina'), text: 'Он срывается с места раньше, чем Нина успевает его поймать.' },
      { text: 'Лео бежит через двор, вцепляется Маркусу в рукав и кричит:\n\n— Ich war das! Ich hab ihn gebissen!\n\nВрач приседает перед ним. «Mach mal den Mund auf».' },
    ],
    actions: [
      { id: 'c13_bd_tell', label: 'Подойти и сказать врачу: это правда, он сам рассказал', minutes: 3, terminal: true, goto: 'c13_cleared',
        text: '— Er hat es mir erzählt, — говоришь ты. — Gestern.\n\nВрач смотрит на тебя, потом снова на зубы мальчика.', effects: [{ set: '$.c13_bd', value: 'tell' }, leo(1)] },
      { id: 'c13_bd_leo', label: 'Подойти и встать рядом с Лео', minutes: 3, terminal: true, goto: 'c13_cleared',
        text: 'Ты кладёшь руку Лео на плечо. Он не оборачивается. Держит рукав.', effects: [{ set: '$.c13_bd', value: 'leo' }, leo(1)] },
      { id: 'c13_bd_stay', label: 'Остаться на месте', minutes: 3, terminal: true, goto: 'c13_cleared',
        text: 'Ты стоишь. Нина рядом шепчет: «Ну давай. Давай же».', effects: [{ set: '$.c13_bd', value: 'stay' }] },
    ] }),

  S13({ id: 'c13_cleared', for: 'any', chapter: 'ch3', title: 'Kindergebiss', camp: yard12, ambient: day13,
    onEnter: [
      { if: all(report12('report'), notBite), then: [{ npc: 'ole', moveTo: 'c13_sammel', remember: 'c13_taken_for_study' }, { npc: 'henrike', moveTo: 'c13_sammel', remember: 'c13_went_with_ole' }, { set: 'w.c13_hosts_gone', value: true }] },
      { if: all(report12('family'), notBite), then: [{ npc: 'ole', set: { c13_registered: true } }] },
      { if: wound12('bite'), then: [{ npc: 'henrike', moveTo: 'c13_sammel', status: 'sick' }, { set: 'w.c13_henrike_taken', value: true }] },
      { npc: 'c12_marcus', set: { c13_cleared: true } },
    ],
    text: [
      { text: 'Врач выпрямляется.\n\n— Kindergebiss, — говорит она солдату. — Zweieinhalb Tage, kein Fieber. Das ist nichts.\n\nДетский укус. Два с половиной дня, жара нет. Ничего.\n\nСолдат отступает. Маркус опускается на корточки, и Лео обнимает его за шею. Крепко. Маркус держит его левой рукой, а правую, разбинтованную, отводит в сторону — подальше от мальчика.' },
      { when: all(report12('report'), notBite), text: 'Потом врач подходит к Оле. Долго смотрит руку. Долго слушает Хенрике.\n\n— Sie kommen mit. Beide.\n\nХенрике кивает, будто ждала. Сумки уже у калитки. Белый фургон увозит их через десять минут.' },
      { when: all(report12('family'), notBite), text: 'Потом врач подходит к Оле. Он сам протягивает ей руку. Врач смотрит, записывает, берёт кровь в пробирку.\n\n— Wir kommen wieder. Bleiben Sie hier.\n\nОле кивает. Хенрике впервые за утро садится — прямо на ступеньку.' },
      { when: all(report12('secret'), notBite), text: 'Солдат ещё раз считает людей и снова смотрит на окно чердака. Врач трогает его за локоть: «Wir sind fertig hier». Он пожимает плечами и записывает число.' },
      { when: all(wound12('scratch'), not(report12('report'))), text: 'Царапину Хенрике врач смотрит последней.\n\n— Wann?\n\n— Вчера в пять утра.\n\n— Fieber?\n\n— Нет.\n\n— Noch nicht sicher. Bis heute Abend messen. — Ещё не точно. Мерить до вечера.' },
      { when: all(wound12('scratch'), report12('report')), text: 'Царапину Хенрике врач смотрит прямо у фургона. «Noch nicht sicher», — говорит она и помогает Хенрике подняться в машину.' },
      { when: wound12('bite'), text: 'У курятника солдат стоит с автоматом наготове. Врач заглядывает в щель и долго молчит.\n\n— Wir nehmen sie mit.\n\nХенрике выводят двое, в перчатках до локтя. Белый фургон увозит её. Оле смотрит ему вслед из окна и не двигается.' },
      { when: kept12, text: 'У фургона под навесом солдат слушает стук и смотрит на доски.\n\n— Bis morgen ist das erledigt. Sonst machen wir das.\n\nНина делает шаг к нему. Маркус молча кладёт ей руку на плечо.' },
    ],
    actions: [
      { id: 'c13_c_marcus', label: 'Подойти к Маркусу и Лео', minutes: 5, terminal: true, goto: 'c13_after',
        text: 'Маркус поднимает на тебя глаза поверх головы мальчика. Ничего не говорит. Лео не отпускает его шею.', effects: [{ set: '$.c13_c', value: 'marcus' }, marcus(1)] },
      { id: 'c13_c_partner', label: 'Найти глазами {partner.acc}', minutes: 3, terminal: true, goto: 'c13_after',
        text: '{partner} стоит у крыльца и смотрит на тебя. Вы оба одновременно выдыхаете.', effects: [{ set: '$.c13_c', value: 'partner' }, { body: 'stress', delta: -3 }] },
      { id: 'c13_c_nina', label: 'Подойти к Нине', minutes: 4, terminal: true, goto: 'c13_after',
        text: 'Нина смотрит на Маркуса и Лео. «Я думала, он…» — говорит она и не договаривает. Потом утыкается тебе в плечо.', effects: [{ set: '$.c13_c', value: 'nina' }, nina(1)] },
    ] }),

  S13({ id: 'c13_after', for: 'any', chapter: 'ch3', title: 'Что дальше', camp: yard12, ambient: day13,
    text: [
      { text: 'Машины уезжают. Двор вдруг кажется очень большим.\n\nМаркус сидит на крыльце, Лео у него на коленях, с зайцем. Маркус перебинтовывает руку, и Лео держит конец бинта.\n\n— В Целле, — говорит Маркус. — К бабушке. Пешком дня три. Или…\n\nОн не договаривает и смотрит на Corsa.' },
      { text: 'Дениз и Керем закидывают рюкзаки на плечи.\n\n— Ну, — говорит Дениз. — Нам пора. Если подвезёте — скажите сейчас.' },
      { when: flag('w.c13_hosts_gone'), text: 'Хенрике оставила вам ключи. Хутор теперь на вас.' },
    ],
    actions: [
      { id: 'c13_af_partner', label: 'Сесть с {partner.ins} на ступеньки и решить', minutes: 5, terminal: true, goto: 'c13_checkpoint',
        effects: [{ set: '$.c13_finished', value: true }, toNoon] },
      { id: 'c13_af_marcus', label: 'Спросить Маркуса, чего хочет он сам', when: A13, minutes: 4, terminal: true, goto: 'c13_checkpoint',
        text: '— Я? — Маркус смотрит на Лео. — Довести его. А там как он скажет.', effects: [{ set: '$.c13_finished', value: true }, toNoon] },
      { id: 'c13_af_leo', label: 'Спросить Лео, чего хочет он', when: B13, minutes: 4, terminal: true, goto: 'c13_checkpoint',
        text: 'Лео смотрит на Маркуса. Потом на тебя.\n\n— Mit Marcus.\n\nС Маркусом.', effects: [{ set: '$.c13_finished', value: true }, toNoon] },
    ] }),

  S13({ id: 'c13_checkpoint', for: 'any', chapter: 'ch3', title: 'Кто поведёт Лео', checkpoint: 13, universal: false,
    text: [{ text: 'Нужно решить две вещи: как Лео с Маркусом доберутся до бабушки и что делать вам, когда братья уходят.' }], actions: [] }),
];
