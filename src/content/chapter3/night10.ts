import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { A10, B10, S10, evidence10, fever10, house10, kept10, knows10, night10, ninaKey10, once10 } from './point10';

const toYard: Effect = { restUntil: at(13, 23) };
const toMidnight: Effect = { restUntil: at(13, 23, 40) };
const toDoor: Effect = { restUntil: at(14, 0, 30) };
const toLate: Effect = { restUntil: at(14, 1) };

export const night10Scenes: Scene[] = [
  S10({ id: 'c10_n_porch', for: 'any', chapter: 'ch3', title: 'Крыльцо', camp: house10, ambient: night10,
    text: [
      { text: '{partner} выходит к тебе на крыльцо и закрывает за собой дверь. Из дома слышно, как Хенрике ходит от плиты к двери сына и обратно.' },
      { when: knows10, text: '— Что будем делать? — спрашивает {partner} шёпотом.' },
      { when: not(knows10), text: '— Странный день, — говорит {partner}. — Я весь день не могу понять, что тут происходит.' },
    ],
    actions: [
      { id: 'c10_n_p_nina', label: 'Сказать: сначала Нина, потом Хенрике', when: knows10, minutes: 3, terminal: true, goto: 'c10_n_house',
        text: '{partner} кивает. — Нина сейчас важнее всех, — говорит {pm:он|она}. — Остальные взрослые.', effects: [{ set: '$.c10_porch', value: 'nina' }] },
      { id: 'c10_n_p_henrike', label: 'Сказать: сначала Хенрике, пусть скажет сама', when: knows10, minutes: 3, terminal: true, goto: 'c10_n_house',
        text: '— Пусть сама, — соглашается {partner}. — Иначе она так и будет врать.', effects: [{ set: '$.c10_porch', value: 'henrike' }] },
      { id: 'c10_n_p_hug', label: 'Обнять {partner.acc} и минуту помолчать', minutes: 3, terminal: true, goto: 'c10_n_house',
        text: 'Вы стоите на холодном крыльце, обнявшись. В темноте белеет фургон. Минута проходит, и вы возвращаетесь в дом.', effects: [{ set: '$.c10_porch', value: 'hug' }, { body: 'stress', delta: -3 }] },
      { id: 'c10_n_p_compare', label: 'Сверить, что каждому из вас днём говорила Хенрике', when: not(knows10), minutes: 6, terminal: true, goto: 'c10_n_house',
        effects: [{ set: '$.c10_porch', value: 'compare' }, { set: '$.c10_compared', value: true }],
        outcomes: [
          { id: 'a', when: A10, text: 'Ты рассказываешь про дровяник: Керем стоял у фургона, рукав порван, Денизу ни слова.\n\n{partner} долго смотрит на тебя.\n\n— А мне она сказала: стекло выпало само, рядом никого не было. И что Керем ушёл к девушке в Харбург. С самой среды собирался.\n\nВы молчите. Одна из этих историй — неправда. Или обе.' },
          { id: 'b', text: 'Ты рассказываешь, что слышала на кухне: стекло выпало само, рядом никого, а Керем ушёл к девушке в Харбург.\n\n{partner} долго смотрит на тебя.\n\n— А мне она в дровянике сказала: у фургона стоял Керем. Рукав порван. «Денизу не говори».\n\nВы молчите. Одна из этих историй — неправда. Или обе.' },
        ] },
      { id: 'c10_n_p_talk', label: 'Поговорить о Нине', when: not(knows10), minutes: 4, terminal: true, goto: 'c10_n_house',
        text: '— Ей пятнадцать, — говорит {partner}. — А она сидит одна у фургона, где её отец. И все решают за неё.\n\nВы смотрите на тёмный навес.', effects: [{ set: '$.c10_porch', value: 'talk' }] },
    ] }),

  S10({ id: 'c10_n_house', for: 'any', chapter: 'ch3', title: 'У двери Оле', camp: house10,
    text: [
      { text: 'В доме тихо. Из-под двери Оле — полоска света. Хенрике сидит на табурете у его двери, с тазом на коленях.' },
      { when: fever10, text: 'Она меняет мокрое полотенце. Из комнаты слышно, как Оле стучит зубами.' },
      { when: knows10, text: 'Хенрике поднимает на тебя глаза и всё понимает по твоему лицу. Не встаёт.' },
      { when: not(knows10), text: '— Простыл, — говорит она, не дожидаясь вопроса. — К утру отпустит.' },
      { when: all(not(knows10), flag('$.c10_gave_pills')), text: 'Твоя таблетка подействовала: Оле затих.' },
    ],
    actions: [
      { id: 'c10_n_confront', label: 'Сказать Хенрике, что знаешь про укус', when: knows10, minutes: 3, terminal: true, goto: 'c10_n_confess',
        effects: [{ set: '$.c10_house', value: 'confront' }] },
      { id: 'c10_n_nina_first', label: 'Сначала увести Нину подальше от этой двери', when: knows10, minutes: 10, terminal: true, goto: 'c10_n_confess',
        text: 'Нина не спорит. Ты оставляешь её в дальней комнате и закрываешь дверь. Потом возвращаешься к Хенрике.', effects: [{ set: '$.c10_house', value: 'nina_first' }, { npc: 'c7_nina', trust: 1 }] },
      { id: 'c10_n_press', label: 'Сказать Хенрике, что не веришь в простуду', when: not(knows10), minutes: 4, terminal: true,
        effects: [{ set: '$.c10_house', value: 'press' }],
        outcomes: [
          { id: 'proof', when: evidence10, goto: 'c10_n_confess', text: 'Ты говоришь, что видел{m:|а} сам{m:|а}. Говоришь, что именно. Хенрике слушает, не перебивая. Таз у неё на коленях перестаёт дрожать только тогда, когда она его ставит на пол.' },
          { id: 'no_proof', goto: 'c10_n_henrike', text: '— Не веришь — не верь, — устало говорит Хенрике. — Иди спать. Я посижу.\n\nСказать ей больше тебе нечего. Ты уходишь.', effects: [{ set: '$.c10_press_failed', value: true }, toYard] },
        ] },
      { id: 'c10_n_relieve', label: 'Предложить подменить её у двери', when: not(knows10), minutes: 3, terminal: true, goto: 'c10_n_henrike',
        text: '— Нет. Я сама. — Хенрике криво улыбается, впервые за день. — Иди глянь лучше на девочку.', effects: [{ set: '$.c10_house', value: 'relieve' }, toYard] },
      { id: 'c10_n_go_nina', label: 'Выйти во двор, глянуть на Нину', when: not(knows10), minutes: 2, terminal: true, goto: 'c10_n_henrike',
        effects: [{ set: '$.c10_house', value: 'nina' }, toYard] },
    ] }),

  S10({ id: 'c10_n_confess', for: 'any', chapter: 'ch3', title: 'Признание', camp: house10,
    onEnter: [{ set: '$.c10_knows', value: true }, { set: '$.c10_confession', value: true }, { set: 'w.c10_truth', value: true }],
    text: [{ text: 'Хенрике долго молчит. Потом ставит таз на пол.\n\n— Утром, — говорит она. — Без двадцати десять. Я была в двух шагах. Отбила его. Поздно.\n\nОна говорит ровно, будто читает список.\n\n— Я всем сказала разное. Каждому — так, чтобы не полез проверять. Тебе одно, {partner.dat} — другое. Кёлер выгнала. Керема упустила.\n\nТеперь она смотрит прямо на тебя.\n\n— Он у меня один. По радио сказали: в Йестебурге помогают. Я хотела утром отвезти. Дайте ему эту ночь в его комнате. Я посижу у двери.' }],
    actions: [
      { id: 'c10_n_c_coop', label: 'Сказать, что по её же правилу его надо в курятник', minutes: 3, terminal: true, goto: 'c10_n_ole_look',
        text: 'Хенрике закрывает глаза.\n\n— Моё правило. Я сама его придумала.\n\nОна не спорит. И не соглашается.', effects: [{ set: '$.c10_stance', value: 'coop' }, { npc: 'henrike', trust: -1 }] },
      { id: 'c10_n_c_door', label: 'Согласиться на комнату, но запереть дверь и дежурить', minutes: 3, terminal: true, goto: 'c10_n_ole_look',
        text: 'Хенрике кивает быстро. Слишком быстро.\n\n— Запирайте. Ключ я сама дам.', effects: [{ set: '$.c10_stance', value: 'door' }, { npc: 'henrike', trust: 2 }] },
      { id: 'c10_n_c_jest', label: 'Спросить, правда ли она верит, что в Йестебурге помогут', minutes: 3, terminal: true, goto: 'c10_n_ole_look',
        text: '— Там врачи, — говорит Хенрике и смотрит на свои руки. — Больше мне верить не во что.', effects: [{ set: '$.c10_stance', value: 'ask' }] },
      { id: 'c10_n_c_angry', label: 'Сказать, что она подставила всех, и Нину тоже', minutes: 2, combinable: true, when: once10('angry'),
        text: '— Знаю. — Хенрике не отводит глаз. — Завтра можете уйти с моего двора. Сегодня дайте ему ночь.', effects: [{ set: '$.c10_angry', value: true }, { npc: 'henrike', trust: -3 }] },
    ] }),

  S10({ id: 'c10_n_ole_look', for: 'any', chapter: 'ch3', title: 'Рука', camp: house10,
    text: [{ text: 'Хенрике приоткрывает дверь сына на ладонь. Оле сидит на кровати, укрытый до пояса. Свеча на табурете.\n\nОн видит тебя, понимает, что мать сказала, и молча вытягивает левую руку на свет. Повязка сползла. Под ней — два полукруга, один против другого. Кожа вокруг красная и блестит до самого локтя.' }],
    actions: [
      { id: 'c10_n_o_dress', label: 'Предложить сменить ему повязку в перчатках', minutes: 15, terminal: true, goto: 'c10_n_henrike', enabled: { has: 'nitrile_gloves' }, disabledReason: 'Нужны свои перчатки',
        text: 'Хенрике держит свечу. Ты надеваешь перчатки, промываешь края и заматываешь руку заново, не касаясь раны голыми пальцами. Оле не дёргается. Только смотрит в потолок.\n\n— Спасибо, — говорит он, когда ты заканчиваешь.',
        effects: [{ take: 'nitrile_gloves', qty: 1 }, { set: '$.c10_look', value: 'dressed' }, { npc: 'ole', trust: 3 }, { npc: 'henrike', trust: 2 }, { body: 'stress', delta: 3 }, toYard] },
      { id: 'c10_n_o_look', label: 'Посмотреть и ничего не трогать', minutes: 3, terminal: true, goto: 'c10_n_henrike',
        text: 'Ты смотришь. Оле убирает руку под одеяло.\n\n— Насмотрелся? — спрашивает он без злости. Хенрике закрывает дверь.', effects: [{ set: '$.c10_look', value: 'looked' }, { body: 'stress', delta: 2 }, toYard] },
      { id: 'c10_n_o_close', label: 'Сказать, что видеть не нужно, и закрыть дверь', minutes: 2, terminal: true, goto: 'c10_n_henrike',
        text: 'Хенрике кивает и закрывает дверь. Оле за ней тихо выдыхает, будто ему стало легче.', effects: [{ set: '$.c10_look', value: 'closed' }, toYard] },
    ] }),

  S10({ id: 'c10_n_henrike', for: 'any', chapter: 'ch3', title: 'Кружка', camp: house10,
    text: [
      { when: knows10, text: 'Хенрике садится за стол напротив тебя и ставит две кружки. Себе наливает и не пьёт.\n\n— Его отец умер, когда Оле было двенадцать, — говорит она. — Трактор перевернулся на склоне. Я тогда тоже всем врала: что справлюсь. Справилась.\n\nОна смотрит в кружку.\n\n— Сейчас не справлюсь.' },
      { when: not(knows10), text: 'Хенрике садится за стол напротив тебя и ставит две кружки. Себе наливает и не пьёт.\n\n— Его отец умер, когда Оле было двенадцать, — говорит она. — Трактор перевернулся на склоне. Я тогда всем говорила, что справлюсь. Справилась.\n\nОна смотрит на дверь сына и долго молчит.' },
    ],
    actions: [
      { id: 'c10_h_sit', label: 'Посидеть с ней молча', minutes: 15, activity: 'rest', terminal: true, goto: 'c10_n_yard',
        text: 'Вы сидите. Чай остывает в обеих кружках. Когда ты встаёшь, Хенрике кладёт ладонь тебе на рукав и сразу убирает.', effects: [{ set: '$.c10_hen', value: 'sit' }, { npc: 'henrike', trust: 2 }, toYard] },
      { id: 'c10_h_judge', label: 'Сказать, что врать всем было нельзя', when: knows10, minutes: 4, terminal: true, goto: 'c10_n_yard',
        text: '— Нельзя, — соглашается Хенрике. — А что можно? Отвести его в курятник своими руками?\n\nОна не ждёт ответа.', effects: [{ set: '$.c10_hen', value: 'judge' }, { npc: 'henrike', trust: -1 }, toYard] },
      { id: 'c10_h_tomorrow', label: 'Спросить, что она будет делать утром', when: knows10, minutes: 4, terminal: true, goto: 'c10_n_yard',
        text: '— Повезу его в Йестебург. Сама поведу, если надо. — Она смотрит на тебя. — Или вы отвезёте. Или никто. Утром посмотрим, кто из нас будет в силах.', effects: [{ set: '$.c10_hen', value: 'tomorrow' }, toYard] },
      { id: 'c10_h_ask', label: 'Спросить прямо, что с Оле', when: not(knows10), minutes: 4, terminal: true, goto: 'c10_n_yard',
        text: 'Хенрике поднимает глаза.\n\n— Жар у него, — говорит она. — Утром повезу к врачу. — Голос у неё ровный. Только кружка в руке дрожит.', effects: [{ set: '$.c10_hen', value: 'ask' }, toYard] },
      { id: 'c10_h_leave', label: 'Поблагодарить за чай и выйти', when: not(knows10), minutes: 2, terminal: true, goto: 'c10_n_yard',
        text: 'Хенрике кивает. Когда ты выходишь, она всё ещё смотрит на дверь сына.', effects: [{ set: '$.c10_hen', value: 'leave' }, toYard] },
    ] }),

  S10({ id: 'c10_n_yard', for: 'any', chapter: 'ch3', title: 'У сетки', camp: { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false }, ambient: night10,
    text: [{ text: 'Около одиннадцати ты выходишь во двор за дровами. У дальней сетки, со стороны поля, кто-то стоит. Держится за проволоку обеими руками и раскачивает её. Сетка тихо звенит.\n\nСтук из фургона становится чаще. Будто они слышат друг друга.' }],
    actions: [
      { id: 'c10_y_still', label: 'Замереть и смотреть, не подходя', minutes: 15, terminal: true, goto: 'c10_n_nina',
        text: 'Фигура раскачивает сетку ещё долго. Потом отпускает и уходит вдоль неё в темноту. Стук из фургона затихает не сразу.', effects: [{ set: '$.c10_yard', value: 'still' }, { body: 'stress', delta: 3 }, toMidnight] },
      { id: 'c10_y_lure', label: 'Отвести его фонарём вдоль сетки, подальше от дома', minutes: 20, activity: 'light', terminal: true, goto: 'c10_n_nina',
        text: 'Ты ведёшь пятно света по траве, медленно, к дальнему углу поля. Фигура идёт за светом. В углу ты гасишь фонарь. Он остаётся там, в темноте, и больше не звенит сеткой.', effects: [{ set: '$.c10_yard', value: 'lure' }, { set: 'w.c10_fence_lured', value: true }, { body: 'stress', delta: 2 }, toMidnight] },
      { id: 'c10_y_check', label: 'Проверить, крепко ли держится сетка у калитки', minutes: 15, activity: 'light', terminal: true, goto: 'c10_n_nina',
        text: 'Ты проходишь вдоль сетки с той стороны, где ничего нет. Столбы держатся. У калитки один крюк разогнут, и ты загибаешь его обратно камнем.', effects: [{ set: '$.c10_yard', value: 'check' }, { set: 'w.c10_gate_fixed', value: true }, toMidnight] },
    ] }),

  S10({ id: 'c10_n_nina', for: 'any', chapter: 'ch3', title: 'Полночь', camp: { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: false },
    ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { when: kept10, text: 'К полуночи ты выходишь во двор. Под навесом пусто, одеяло брошено на чурбак. Нина стоит у дверцы кабины.' },
      { when: all(kept10, ninaKey10), text: 'В руке у неё брелок. Она подносит его к замку.' },
      { when: all(kept10, not(ninaKey10)), text: 'Ключа у неё нет. Она стоит у самых досок и шепчет что-то в щель.' },
      { when: not(kept10), text: 'К полуночи в дверь твоей комнаты скребутся. Это Нина, с подушкой в руках.\n\n— Можно я у вас посплю? Там, через стенку, он стонет. — Она кивает на комнату Оле.' },
    ],
    actions: [
      { id: 'c10_n_n_call', label: 'Тихо позвать её по имени', when: kept10, minutes: 4, terminal: true, goto: 'c10_n_door', ambientDuring: night10,
        text: 'Нина вздрагивает и опускает руку.\n\n— Я хотела только ладонь, — говорит она. — Взять его за ладонь. Через щель.\n\nОна возвращается к чурбаку и закутывается в одеяло.', effects: [{ set: '$.c10_nina', value: 'called' }, { npc: 'c7_nina', trust: 1 }, toDoor] },
      { id: 'c10_n_n_grab', label: 'Подбежать и перехватить её руку', when: kept10, minutes: 3, activity: 'moderate', terminal: true, goto: 'c10_n_door', ambientDuring: night10,
        text: 'Ты перехватываешь её руку у самой ручки. Изнутри в доску бьёт так, что сыплется труха. Нина вырывается, потом обмякает и плачет тебе в куртку.', effects: [{ set: '$.c10_nina', value: 'grabbed' }, { body: 'stress', delta: 4 }, toDoor] },
      { id: 'c10_n_n_key', label: 'Протянуть ладонь и попросить ключ', when: all(kept10, B10, ninaKey10), minutes: 4, terminal: true, goto: 'c10_n_door', ambientDuring: night10,
        text: 'Нина долго смотрит на твою ладонь. Потом кладёт в неё ключ. Пальцы у неё ледяные.\n\n— Только не им, — шепчет она.', effects: [{ takeFromNpc: 'c7_nina', type: 'c9_van_key' }, { set: '$.c10_nina', value: 'key' }, toDoor] },
      { id: 'c10_n_n_wait', label: 'Встать рядом и ждать, пока она сама опустит руку', when: kept10, minutes: 10, terminal: true, goto: 'c10_n_door', ambientDuring: night10,
        text: 'Нина стоит долго. Ты рядом, не касаясь её. Потом она опускает руку и садится прямо на землю у колеса.', effects: [{ set: '$.c10_nina', value: 'waited' }, { npc: 'c7_nina', trust: 2 }, toDoor] },
      { id: 'c10_n_n_let', label: 'Пустить её и постелить ей на полу', when: not(kept10), minutes: 5, terminal: true, goto: 'c10_n_door',
        text: 'Нина ложится на пол у твоей кровати, не раздеваясь. Через минуту дышит ровно.', effects: [{ set: '$.c10_nina', value: 'with_me' }, { npc: 'c7_nina', trust: 2 }, toDoor] },
      { id: 'c10_n_n_barn', label: 'Увести её спать в сарай, подальше от этой стены', when: not(kept10), minutes: 10, terminal: true, goto: 'c10_n_door', ambientDuring: night10,
        text: 'В сарае пахнет сеном. Нина зарывается в него вместе с одеялом. — Тут хотя бы не слышно, — говорит она.', effects: [{ set: '$.c10_nina', value: 'barn' }, { npc: 'c7_nina', trust: 1 }, toDoor] },
      { id: 'c10_n_n_calm', label: 'Сказать, что это просто жар и бояться нечего', when: not(kept10), minutes: 3, terminal: true, goto: 'c10_n_door',
        text: 'Нина смотрит на тебя и возвращается к себе. Дверь она оставляет приоткрытой.', effects: [{ set: '$.c10_nina', value: 'calm' }, toDoor] },
    ] }),

  S10({ id: 'c10_n_door', for: 'any', chapter: 'ch3', title: 'Через дверь', camp: house10,
    text: [
      { when: knows10, text: 'После полуночи ты сменяешь Хенрике у двери Оле. Она засыпает прямо на лавке, не разуваясь.\n\nИз комнаты слышно частое дыхание.\n\n— Это ты? — спрашивает Оле через дверь. — Мать спит?\n\nОн говорит медленно, будто каждое слово тяжёлое.\n\n— Я знаю, что будет. Я утром его видел вблизи. Если я стану такой… Пусть Дениз. Не мать. Пообещай.' },
      { when: not(knows10), text: 'После полуночи Хенрике засыпает у двери сына прямо на табурете. Ты садишься рядом на пол.\n\nИз комнаты слышно частое дыхание.\n\n— Это ты? — спрашивает Оле через дверь. — Мать спит?\n\nДолгая пауза.\n\n— Не открывай мне ночью. Что бы я ни говорил. Обещай.' },
    ],
    actions: [
      { id: 'c10_n_d_promise', label: 'Пообещать', when: knows10, minutes: 2, terminal: true, goto: 'c10_n_late',
        text: '— Спасибо, — говорит Оле. Дыхание за дверью становится чуть ровнее.', effects: [{ set: '$.c10_door', value: 'promise' }, { npc: 'ole', trust: 3, remember: '$:c10_promised_deniz_not_mother' }, toLate] },
      { id: 'c10_n_d_why', label: 'Спросить, почему он молчал весь день', when: knows10, minutes: 4, terminal: true, goto: 'c10_n_late',
        text: '— Думал, мать сама меня в курятник отведёт. Своими руками. Она же такая. — Он смеётся и кашляет. — А она весь день врала. Ради меня.', effects: [{ set: '$.c10_door', value: 'why' }, toLate] },
      { id: 'c10_n_d_talk', label: 'Говорить с ним через дверь, пока он не уснёт', minutes: 40, activity: 'rest', terminal: true, goto: 'c10_n_late',
        text: 'Ты рассказываешь что попало: про Гамбург, про то, как вы с {partner.ins} впервые встретились. Оле иногда хмыкает. Потом затихает.', effects: [{ set: '$.c10_door', value: 'talk' }, { npc: 'ole', trust: 2 }, toLate] },
      { id: 'c10_n_d_promise_u', label: 'Пообещать не открывать', when: not(knows10), minutes: 2, terminal: true, goto: 'c10_n_late',
        text: '— Хорошо, — говорит Оле. — Хорошо.', effects: [{ set: '$.c10_door', value: 'promise_u' }, { npc: 'ole', trust: 2 }, toLate] },
      { id: 'c10_n_d_ask_u', label: 'Спросить, почему нельзя открывать', when: not(knows10), minutes: 3, terminal: true, goto: 'c10_n_late',
        text: '— Жар, — говорит Оле после паузы. — Жар у меня. Не открывай.\n\nБольше он ничего не объясняет.', effects: [{ set: '$.c10_door', value: 'ask_u' }, toLate] },
      { id: 'c10_n_d_wake_u', label: 'Разбудить Хенрике и спросить, что с ним', when: not(knows10), minutes: 3, terminal: true, goto: 'c10_n_late',
        text: 'Хенрике открывает глаза и сразу всё слышит в твоём голосе.\n\n— Бредит, — говорит она. — Жар. Иди спать.', effects: [{ set: '$.c10_door', value: 'wake_u' }, toLate] },
    ] }),

  S10({ id: 'c10_n_late', for: 'any', chapter: 'ch3', title: 'Второй час', camp: house10,
    text: [
      { text: 'Второй час ночи. Хенрике дремлет у двери сына. {partner} сидит рядом с тобой на лавке и греет руки о кружку. До рассвета ещё далеко.' },
      { when: kept10, text: 'Нина снова под навесом. Ты видишь в окно край её одеяла.' },
    ],
    actions: [
      { id: 'c10_n_l_decide', label: 'Сесть ближе к {partner.dat} и решать вдвоём', minutes: 3, terminal: true, goto: 'c10_checkpoint', effects: [{ set: '$.c10_finished', value: true }] },
      { id: 'c10_n_l_bolt', label: 'Сначала проверить засов на двери Оле', minutes: 3, terminal: true, goto: 'c10_checkpoint',
        text: 'Засов тугой, ржавый. Ты задвигаешь и снова выдвигаешь его, чтобы проверить. За дверью тихо.', effects: [{ set: '$.c10_finished', value: true }, { set: '$.c10_bolt', value: true }] },
      { id: 'c10_n_l_window', label: 'Выглянуть во двор, всё ли спокойно', minutes: 3, terminal: true, goto: 'c10_checkpoint', ambientDuring: night10,
        text: 'Двор пустой. Фургон стоит тёмный. Где-то далеко, за полем, лает собака и замолкает.', effects: [{ set: '$.c10_finished', value: true }] },
    ] }),

  S10({ id: 'c10_checkpoint', for: 'any', chapter: 'ch3', title: 'До рассвета', checkpoint: 10, universal: false, safe: true,
    text: [{ text: 'До рассвета несколько часов. Нужно решить две вещи: где Оле проведёт остаток ночи и где будет спать Нина.' }], actions: [] }),
];
