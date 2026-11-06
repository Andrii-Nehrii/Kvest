import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { flag } from './world3';
import { S15, day14, house14, jens15, kitchen14, leo14, night14, tense14, yard14 } from './point14';

// Дополнение участка 15 (06.11): по 13–14 сцен на линию. Вставлены между сценами day15.ts.
const any = (...xs: Cond[]): Cond => ({ any: xs });
const give = jens15('give'), end = jens15('end'), gate = jens15('gate');
const dead = any(end, gate);
const toSoldier: Effect = { restUntil: at(16, 7, 40) };
const toNoon: Effect = { restUntil: at(16, 12, 30) };
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const jannes = (trust: number): Effect => ({ npc: 'c14_jannes', trust });
const cold = night14;
// Вечер перед ночью у всех веток: время до одиннадцати (или до половины десятого) и переход в свою ветку.
const toNight: Effect = { if: end, then: [{ restUntil: at(15, 21, 30) }], else: [{ restUntil: at(15, 22, 55) }] };
const nightA = [{ id: 'g', when: give, goto: 'c15_g_gate' }, { id: 'e', when: end, goto: 'c15_e_a_gun' }, { id: 'k', goto: 'c15_k_gate' }];
const nightB = [{ id: 'g', when: give, goto: 'c15_g_gate' }, { id: 'e', when: end, goto: 'c15_e_b_nina' }, { id: 'k', goto: 'c15_k_gate' }];

export const day15xScenes: Scene[] = [
  // ───────────── Вечер A ─────────────
  S15({ id: 'c15_a_e1', for: 'any', chapter: 'ch3', title: 'Перед ночью', camp: house14,
    text: [
      { when: give, text: 'До одиннадцати долго. Ты раскладываешь на кухонном столе то, что может понадобиться ночью: фонарь, верёвку, рабочие перчатки Оле. Всё это кажется слишком маленьким для того, что будет.' },
      { when: end, text: 'Ты сидишь на кухне. Записка Хенрике лежит на столе. «Для Йенса, если придётся». Её почерк кажется сейчас очень спокойным.' },
      { when: gate, text: 'Засов задвинут. Ты сидишь на кухне и слушаешь, как тикают часы Хенрике. Решили. Теперь только ждать утра.' },
    ],
    actions: [
      { id: 'c15_ae1_lamp', label: 'Проверить фонарь', minutes: 5, terminal: true, goto: 'c15_a_e2',
        text: 'Батарейки садятся: луч жёлтый, слабый. Ты вынимаешь их, греешь в ладонях и вставляешь обратно. Чуть ярче. На час хватит.', effects: [{ set: '$.c15_e1', value: 'lamp' }] },
      { id: 'c15_ae1_eat', label: 'Доесть то, что осталось с ужина', minutes: 10, terminal: true, goto: 'c15_a_e2',
        text: 'Холодная картошка, ломоть хлеба. Ты ешь, не чувствуя вкуса. Нина смотрит из дверей и говорит: «Правильно. Ночью есть захочется».', effects: [{ set: '$.c15_e1', value: 'eat' }, { body: 'hunger', delta: -5 }] },
      { id: 'c15_ae1_sit', label: 'Просто посидеть', minutes: 15, activity: 'rest', terminal: true, goto: 'c15_a_e2',
        text: 'Ты сидишь, положив руки на стол. Огонь в плите потрескивает. За окном совсем темно.', effects: [{ set: '$.c15_e1', value: 'sit' }, { body: 'stress', delta: -1 }] },
    ] }),

  S15({ id: 'c15_a_e2', for: 'any', chapter: 'ch3', title: 'Под навесом', camp: tense14, ambient: cold,
    text: [
      { text: 'Ты выходишь во двор. Мороз, небо ясное, звёзд столько, сколько в городе не бывает. Под навесом темно.' },
      { when: give, text: 'Последняя ночь фургона здесь. Из кабины один слабый удар.' },
      { when: end, text: 'Из кабины один слабый удар. Ты знаешь, что сделаешь через час.' },
      { when: gate, text: 'Из кабины один слабый удар. Утром приедут солдаты.' },
    ],
    actions: [
      { id: 'c15_ae2_talk', label: 'Сказать ему что-нибудь', minutes: 5, terminal: true, goto: 'c15_a_e3',
        text: 'Ты не знаешь, что говорят в таких случаях. Говоришь: «Нина в порядке. Мы за ней смотрим». Голос в темноте звучит чужим.\n\nИз кабины тихо.', effects: [{ set: '$.c15_e2', value: 'talk' }] },
      { id: 'c15_ae2_knock', label: 'Постучать в ответ', minutes: 3, terminal: true, goto: 'c15_a_e3',
        text: 'Ты стучишь два раза. Изнутри — шорох, потом удар, совсем рядом с твоей ладонью. И снова тихо.', effects: [{ set: '$.c15_e2', value: 'knock' }] },
      { id: 'c15_ae2_stars', label: 'Постоять и посмотреть на небо', minutes: 8, terminal: true, goto: 'c15_a_e3',
        text: 'Ты стоишь, задрав голову, пока не начинает ломить шею. Где-то очень далеко гудит самолёт. Первый за неделю.', effects: [{ set: '$.c15_e2', value: 'stars' }, { body: 'stress', delta: -2 }] },
    ] }),

  S15({ id: 'c15_a_e3', for: 'any', chapter: 'ch3', title: 'Окно Нины', camp: yard14, ambient: cold,
    text: [{ text: 'Ты поворачиваешься к дому. В окне второго этажа Нина. Стоит, прижавшись лбом к стеклу, и смотрит на навес. Тебя она не видит. Или видит, но не подаёт вида.' }],
    actions: [
      { id: 'c15_ae3_wave', label: 'Помахать ей', minutes: 3, terminal: true, outcomes: nightA,
        text: 'Нина поднимает руку. Не машет. Просто держит ладонь на стекле, пока ты не уходишь со двора.', effects: [{ set: '$.c15_e3', value: 'wave' }, nina(1), toNight] },
      { id: 'c15_ae3_go', label: 'Подняться к ней', minutes: 10, terminal: true, outcomes: nightA,
        text: 'Нина сидит на раскладушке, обхватив колени.\n\n— Я не боюсь, — говорит она сразу. — Просто не хочу, чтобы было уже. И не хочу, чтобы не было.', effects: [{ set: '$.c15_e3', value: 'go' }, nina(1), toNight] },
      { id: 'c15_ae3_in', label: 'Вернуться в дом, не мешать', minutes: 2, terminal: true, outcomes: nightA,
        text: 'Ты заходишь в дом. На лестнице слышно, как наверху скрипит половица. Нина ходит от окна к двери и обратно.', effects: [{ set: '$.c15_e3', value: 'in' }, toNight] },
    ] }),

  // ───────────── Вечер B ─────────────
  S15({ id: 'c15_b_e1', for: 'any', chapter: 'ch3', title: 'Косы', camp: house14,
    text: [{ text: 'Нина садится перед тобой на табурет, спиной.\n\n— Заплети мне, — говорит она. — Как папа. Две косы. Можно криво.' },
      { when: any({ v: 'B.c14_bath', op: '==', value: 'help' }, { v: 'B.c14_bath', op: '==', value: 'self' }), text: 'Волосы у неё чистые после вчерашнего мытья, пахнут мылом Хенрике.' }],
    actions: [
      { id: 'c15_be1_braid', label: 'Заплести две косы', minutes: 15, terminal: true, goto: 'c15_b_e2',
        text: 'Ты плетёшь медленно. Одна коса выходит ровной, вторая кривой. Нина трогает обе руками.\n\n— Кривая лучше, — говорит она. — Как у него.', effects: [{ set: '$.c15_be1', value: 'braid' }, nina(2)] },
      { id: 'c15_be1_one', label: 'Заплести одну, на большее не хватает умения', minutes: 10, terminal: true, goto: 'c15_b_e2',
        text: 'Одна коса, толстая, до лопаток. Нина держит кончик в кулаке и долго не отпускает.', effects: [{ set: '$.c15_be1', value: 'one' }, nina(1)] },
      { id: 'c15_be1_talk', label: 'Расчесать и спросить, как он это делал', minutes: 12, terminal: true, goto: 'c15_b_e2',
        text: '— Ругался. — Нина смеётся. — Говорил: «Halt still, Krake». Стой смирно, осьминог. Я всё время вертелась.', effects: [{ set: '$.c15_be1', value: 'talk' }, nina(1)] },
    ] }),

  S15({ id: 'c15_b_e2', for: 'any', chapter: 'ch3', title: 'Чай', camp: kitchen14,
    text: [{ text: 'Ты ставишь чайник. Три кружки. Нина держит свою обеими руками, и кружка всё равно дрожит.' }],
    actions: [
      { id: 'c15_be2_honey', label: 'Положить ей в чай ложку мёда из шкафа', minutes: 5, terminal: true, goto: 'c15_b_e3',
        text: 'Мёд засахарился. Ты отковыриваешь ложкой кусок и бросаешь ей в кружку. Нина размешивает долго, до звона.', effects: [{ set: '$.c15_be2', value: 'honey' }, nina(1)] },
      { id: 'c15_be2_hands', label: 'Накрыть её руки своими', minutes: 5, terminal: true, goto: 'c15_b_e3',
        text: 'Нина не убирает рук. Кружка перестаёт дрожать.', effects: [{ set: '$.c15_be2', value: 'hands' }, nina(1)] },
      { id: 'c15_be2_drink', label: 'Пить молча', minutes: 10, terminal: true, goto: 'c15_b_e3',
        text: 'Вы пьёте молча. Чай горячий и горький. Часы на стене тикают громче обычного.', effects: [{ set: '$.c15_be2', value: 'drink' }] },
    ] }),

  S15({ id: 'c15_b_e3', for: 'any', chapter: 'ch3', title: 'Расскажи', camp: kitchen14,
    text: [{ text: '— Расскажи что-нибудь, — просит Нина. — Не про сейчас. Про раньше. Как ты {m:жил|жила} до всего.' }],
    actions: [
      { id: 'c15_be3_wg', label: 'Рассказать про квартиру в Бармбеке', minutes: 15, terminal: true, outcomes: nightB,
        text: 'Ты рассказываешь про общую кухню, про соседку, которая подписывала маркером свою кастрюлю, про сломанный звонок. Нина слушает, подперев щёку.\n\n— У нас тоже кастрюля была подписана, — говорит она. — Папина. «Nicht für Nina».', effects: [{ set: '$.c15_be3', value: 'wg' }, nina(1), toNight] },
      { id: 'c15_be3_way', label: 'Рассказать, как добиралась сюда', minutes: 15, terminal: true, outcomes: nightB,
        text: 'Ты рассказываешь про первый день. Про пробки, про людей, которые шли пешком по шоссе. Нина слушает и вдруг говорит:\n\n— Значит, ты тоже ехала к кому-то. Как я к папе.', effects: [{ set: '$.c15_be3', value: 'way' }, nina(1), toNight] },
      { id: 'c15_be3_no', label: 'Сказать: давай просто посидим', minutes: 10, activity: 'rest', terminal: true, outcomes: nightB,
        text: 'Нина кивает и кладёт голову на руки. Ты смотришь, как огонь в плите отражается в её глазах.', effects: [{ set: '$.c15_be3', value: 'no' }, toNight] },
    ] }),

  // ───────────── Ночь: по одной сцене в каждую ветку ─────────────
  S15({ id: 'c15_g_a_return', for: 'any', chapter: 'ch3', title: 'Пустая кабина', camp: tense14, ambient: cold,
    text: [{ text: 'Ты возвращаешься во двор один. Дверь кабины распахнута, внутри темно. Пахнет кисло и тяжело. На сиденье пустая бутылка-воронка.' }],
    actions: [
      { id: 'c15_gar2_close', label: 'Закрыть дверь кабины', minutes: 3, terminal: true, goto: 'c15_sleep',
        text: 'Дверь закрывается с глухим стуком. Звук разносится по двору. Ты ждёшь ответного удара изнутри. Его нет.', effects: [{ set: '$.c15_gar2', value: 'close' }] },
      { id: 'c15_gar2_open', label: 'Оставить открытой: пусть проветрится', minutes: 2, terminal: true, goto: 'c15_sleep',
        text: 'Ты оставляешь дверь открытой. Холодный воздух выдует запах к утру. Или нет.', effects: [{ set: '$.c15_gar2', value: 'open' }] },
      { id: 'c15_gar2_bottle', label: 'Забрать бутылку-воронку', minutes: 3, terminal: true, goto: 'c15_sleep',
        text: 'Ты берёшь бутылку. Лёгкая, пустая. Ты ставишь её на подоконник кухни. Утром Нина увидит её и решит сама, что с ней делать.', effects: [{ set: '$.c15_gar2', value: 'bottle' }] },
    ] }),

  S15({ id: 'c15_g_b_cab', for: 'any', chapter: 'ch3', title: 'Одеяло', camp: house14,
    text: [{ text: 'Нина уснула. Ты выглядываешь в окно. Под навесом темно, дверь кабины открыта. Во дворе {partner} стоит у фургона и смотрит на пустое сиденье.' }],
    actions: [
      { id: 'c15_gbc_blanket', label: 'Укрыть Нину ещё одним одеялом', minutes: 4, terminal: true, goto: 'c15_sleep',
        text: 'Нина во сне сжимает край одеяла и бормочет что-то по-немецки. Одно слово. Ты не разбираешь какое.', effects: [{ set: '$.c15_gbc', value: 'blanket' }, nina(1)] },
      { id: 'c15_gbc_wave', label: 'Помахать {partner.dat} из окна', minutes: 3, terminal: true, goto: 'c15_sleep',
        text: '{partner} поднимает голову, видит тебя в окне и кивает. Потом медленно идёт к дому.', effects: [{ set: '$.c15_gbc', value: 'wave' }] },
      { id: 'c15_gbc_bed', label: 'Лечь сразу', minutes: 2, terminal: true, goto: 'c15_sleep',
        text: 'Ты ложишься. Ноги гудят, руки до сих пор помнят тяжесть фонаря.', effects: [{ set: '$.c15_gbc', value: 'bed' }] },
    ] }),

  S15({ id: 'c15_e_a_wrap', for: 'any', chapter: 'ch3', title: 'Одеяло', camp: tense14, ambient: cold,
    text: [{ when: { v: '$.c14_shed', op: '==', value: 'rope' }, text: 'Верёвка из сарая Оле висит на гвозде у двери. Пригодилась.' }, { text: 'Его нельзя оставлять в кабине до утра. Ты открываешь дверь. Свет фонаря держишь низко, чтобы не видеть лишнего. Нужны перчатки и одеяло. Кровь — это всё ещё опасно.' }],
    actions: [
      { id: 'c15_eaw_gloves', label: 'Надеть перчатки Оле и завернуть его в одеяло', minutes: 25, activity: 'heavy', terminal: true, goto: 'c15_sleep',
        effects: [{ set: '$.c15_eaw', value: 'gloves' }, { body: 'stress', delta: 3 }],
        outcomes: [
          { id: 'j', when: flag('w.c15_jannes_stayed'), text: 'Яннес держит фонарь и подаёт верёвку. Вы заворачиваете Йенса в одеяло, обвязываете в двух местах и кладёте под навесом, у стены. Перчатки ты сжигаешь в плите. Руки моешь долго, до красноты.' },
          { id: 'a', text: 'Ты заворачиваешь его в одеяло один. Он лёгкий, совсем лёгкий. Обвязываешь верёвкой и кладёшь под навесом, у стены. Перчатки сжигаешь в плите. Руки моешь долго, до красноты.' },
        ] },
      { id: 'c15_eaw_fast', label: 'Завернуть его быстро, не глядя', minutes: 15, activity: 'heavy', terminal: true, goto: 'c15_sleep',
        text: 'Ты действуешь быстро, отвернувшись. Одеяло, верёвка, два узла. Под навесом, у стены. Потом долго стоишь у колодца и льёшь воду на руки, пока они не немеют.', effects: [{ set: '$.c15_eaw', value: 'fast' }, { body: 'stress', delta: 2 }] },
    ] }),

  S15({ id: 'c15_e_b_room', for: 'any', chapter: 'ch3', title: 'Пока не уснёт', camp: house14,
    text: [{ text: 'Уте уходит. Нина поднимается к себе и останавливается в дверях.\n\n— Посиди, пока я не усну, — говорит она. — Как в детстве. Только не говори ничего.' }],
    actions: [
      { id: 'c15_ebr_sit', label: 'Сесть на пол у раскладушки', minutes: 25, activity: 'rest', terminal: true, goto: 'c15_sleep',
        text: 'Ты сидишь на полу, спиной к швейной машинке. Нина дышит неровно, потом всё ровнее. Её рука свешивается с раскладушки. Ты держишь её, пока не затекает плечо.', effects: [{ set: '$.c15_ebr', value: 'sit' }, nina(2)] },
      { id: 'c15_ebr_door', label: 'Сесть в дверях, чтобы ей было видно', minutes: 20, activity: 'rest', terminal: true, goto: 'c15_sleep',
        text: 'Ты садишься на порог. Нина лежит лицом к тебе с открытыми глазами. Потом глаза закрываются. Потом снова открываются, проверить. Потом закрываются насовсем.', effects: [{ set: '$.c15_ebr', value: 'door' }, nina(1)] },
    ] }),

  S15({ id: 'c15_k_a_note', for: 'any', chapter: 'ch3', title: 'Записка', camp: tense14, ambient: cold,
    text: [{ text: 'У тебя в руке листок, сложенный вчетверо. «Parzelle 12». Почерк ровный, школьный. Нина стоит на крыльце и смотрит на твою руку.' }],
    actions: [
      { id: 'c15_kan2_give', label: 'Отдать записку Нине сейчас', minutes: 3, terminal: true, goto: 'c15_k_a_jannes',
        text: 'Нина берёт листок, читает и прячет в карман джинсов. Ничего не говорит. Уходит в дом.', effects: [{ set: '$.c15_kan2', value: 'give' }, nina(1)] },
      { id: 'c15_kan2_keep', label: 'Оставить у себя до утра', minutes: 2, terminal: true, goto: 'c15_k_a_jannes',
        text: 'Ты убираешь листок во внутренний карман. Утром. Сейчас это будет как надежда, а надежды нет.', effects: [{ set: '$.c15_kan2', value: 'keep' }] },
      { id: 'c15_kan2_table', label: 'Положить на кухонный стол: пусть решит сама', minutes: 3, terminal: true, goto: 'c15_k_a_jannes',
        text: 'Ты кладёшь листок под солонку. Утром его там не будет. Ты знаешь это заранее.', effects: [{ set: '$.c15_kan2', value: 'table' }] },
    ] }),

  S15({ id: 'c15_k_b_room', for: 'any', chapter: 'ch3', title: 'Закрытая дверь', camp: house14,
    text: [{ text: 'Дверь комнаты Нины закрыта. Ты стоишь в коридоре. Из-за двери тихо, потом шорох бумаги. Потом снова тихо.' }],
    actions: [
      { id: 'c15_kbr_knock', label: 'Постучать', minutes: 4, terminal: true, goto: 'c15_k_b_night',
        text: '— Не надо, — говорит Нина из-за двери. — Я не плачу. Правда. Иди спать.\n\nГолос ровный. Слишком ровный.', effects: [{ set: '$.c15_kbr', value: 'knock' }, { restUntil: at(16, 3), sleeping: true }] },
      { id: 'c15_kbr_say', label: 'Сказать через дверь: я рядом, если что', minutes: 3, terminal: true, goto: 'c15_k_b_night',
        text: 'Тишина. Потом:\n\n— Я знаю.\n\nТы уходишь к себе и долго не можешь уснуть.', effects: [{ set: '$.c15_kbr', value: 'say' }, nina(1), { restUntil: at(16, 3), sleeping: true }] },
      { id: 'c15_kbr_go', label: 'Уйти спать', minutes: 2, terminal: true, goto: 'c15_k_b_night',
        text: 'Ты засыпаешь сразу, как будто тебя выключили.', effects: [{ set: '$.c15_kbr', value: 'go' }, { restUntil: at(16, 3), sleeping: true }] },
    ] }),

  // ───────────── Утро ─────────────
  S15({ id: 'c15_a_m1', for: 'any', chapter: 'ch3', title: 'После завтрака', camp: yard14, ambient: day14,
    text: [
      { text: 'После завтрака ты выходишь во двор. Солнце низкое, иней на крыше сарая начинает таять и капать.' },
      { when: give, text: 'От задней калитки через поле тянется колея тачки. На солнце она темнеет.' },
      { when: end, text: 'Под навесом лежит свёрток. Ты не смотришь туда. Смотришь.' },
      { when: gate, text: 'Из кабины стучат. Реже, чем вчера.' },
    ],
    actions: [
      { id: 'c15_am1_shovel', label: 'Найти в сарае лопату', when: dead, minutes: 5, terminal: true, goto: 'c15_a_m2',
        text: 'Лопата стоит за дверью сарая, штык ржавый, черенок отполирован руками Оле. Ты ставишь её у крыльца.', effects: [{ set: '$.c15_m1', value: 'shovel' }] },
      { id: 'c15_am1_tracks', label: 'Пройти по колее до калитки', when: give, minutes: 6, terminal: true, goto: 'c15_a_m2',
        text: 'Колея ровная, без петель. Тачку катили уверенно. У калитки на столбе висит красное стёклышко от налобного фонаря. Яннес забыл.', effects: [{ set: '$.c15_m1', value: 'tracks' }] },
      { id: 'c15_am1_hens', label: 'Выпустить кур', minutes: 6, activity: 'light', terminal: true, goto: 'c15_a_m2',
        text: 'Куры вываливаются из курятника всей толпой и сразу разбегаются по двору. Десять. Все.', effects: [{ set: '$.c15_m1', value: 'hens' }] },
    ] }),

  S15({ id: 'c15_a_m2', for: 'any', chapter: 'ch3', title: 'Ладони', camp: yard14, ambient: day14,
    text: [{ text: 'Ты моешь руки у колодца. Вода ледяная. На ладонях ссадины от ночи, под ногтями грязь. Руки чужие, как после долгой работы.' }],
    actions: [
      { id: 'c15_am2_scrub', label: 'Отмыть как следует, с мылом', minutes: 10, terminal: true, goto: 'c15_soldier',
        text: 'Ты трёшь руки хозяйственным мылом, пока кожа не начинает гореть. Потом ещё раз. Становится немного легче. Не рукам.', effects: [{ set: '$.c15_m2', value: 'scrub' }, { body: 'stress', delta: -1 }, toSoldier] },
      { id: 'c15_am2_quick', label: 'Сполоснуть и вытереть о штаны', minutes: 3, terminal: true, goto: 'c15_soldier',
        text: 'Ты вытираешь руки о штаны. На дороге звенит велосипедный звонок.', effects: [{ set: '$.c15_m2', value: 'quick' }, toSoldier] },
      { id: 'c15_am2_face', label: 'Умыть и лицо', minutes: 6, terminal: true, goto: 'c15_soldier',
        text: 'Холод бьёт по лицу, как пощёчина. Ты стоишь, опершись о край колодца, пока вода не стечёт за воротник.', effects: [{ set: '$.c15_m2', value: 'face' }, toSoldier] },
    ] }),

  S15({ id: 'c15_b_m1', for: 'any', chapter: 'ch3', title: 'Посуда', camp: kitchen14,
    text: [{ text: 'Ты моешь посуду после завтрака. Нина вытирает. Она молчит, но вытирает каждую тарелку очень долго, как будто от этого что-то зависит.' },
      { when: leo14, text: 'Лео ставит тарелки на полку, встав на табурет.' }],
    actions: [
      { id: 'c15_bm1_talk', label: 'Спросить, спала ли она', minutes: 5, terminal: true, goto: 'c15_b_m2',
        effects: [{ set: '$.c15_bm1', value: 'talk' }],
        outcomes: [
          { id: 'g', when: give, text: '— Спала. — Нина ставит тарелку. — Мне снилось, что он везёт меня в школу. И опаздывает. Как всегда.' },
          { id: 'd', text: '— Немного. — Нина ставит тарелку. — Мне ничего не снилось. Это хорошо, наверное.' },
        ] },
      { id: 'c15_bm1_quiet', label: 'Мыть молча', minutes: 10, terminal: true, goto: 'c15_b_m2',
        text: 'Вы домываете молча. Нина вешает полотенце на крючок и поправляет, чтобы висело ровно.', effects: [{ set: '$.c15_bm1', value: 'quiet' }] },
      { id: 'c15_bm1_rest', label: 'Предложить ей отдохнуть, ты домоешь', minutes: 8, terminal: true, goto: 'c15_b_m2',
        text: '— Нет. — Нина берёт следующую тарелку. — Мне надо что-нибудь делать руками. Иначе я думаю.', effects: [{ set: '$.c15_bm1', value: 'rest' }] },
    ] }),

  S15({ id: 'c15_b_m2', for: 'any', chapter: 'ch3', title: 'Окно', camp: kitchen14,
    text: [{ text: 'Нина стоит у окна и смотрит на навес.' },
      { when: give, text: 'Кабина пустая, дверь открыта.' },
      { when: end, text: 'У стены под навесом свёрток в одеяле.' },
      { when: gate, text: 'Из кабины слабый удар. Нина вздрагивает каждый раз.' }],
    actions: [
      { id: 'c15_bm2_stand', label: 'Встать рядом', minutes: 5, terminal: true, goto: 'c15_soldier',
        text: 'Нина берёт тебя под руку и так стоит. На дороге звенит велосипедный звонок.', effects: [{ set: '$.c15_bm2', value: 'stand' }, nina(1), toSoldier] },
      { id: 'c15_bm2_away', label: 'Отвести её от окна', minutes: 4, terminal: true, goto: 'c15_soldier',
        text: 'Нина не сопротивляется. Садится за стол спиной к окну. Через минуту оборачивается. На дороге звенит велосипедный звонок.', effects: [{ set: '$.c15_bm2', value: 'away' }, toSoldier] },
      { id: 'c15_bm2_curtain', label: 'Задёрнуть занавеску', minutes: 3, terminal: true, goto: 'c15_soldier',
        text: 'Нина сама отдёргивает занавеску обратно.\n\n— Не надо, — говорит она. — Я хочу видеть.\n\nНа дороге звенит велосипедный звонок.', effects: [{ set: '$.c15_bm2', value: 'curtain' }, toSoldier] },
    ] }),

  // ───────────── A днём ─────────────
  S15({ id: 'c15_a_t2', for: 'any', chapter: 'ch3', title: 'Велосипед', camp: yard14, ambient: day14,
    text: [{ text: 'Тобиас садится на велосипед и уезжает в сторону Бендесторфа. Автомат за спиной покачивается. У поворота он оборачивается и поднимает руку. Не машет. Просто поднимает.' }],
    actions: [
      { id: 'c15_at2_wave', label: 'Поднять руку в ответ', minutes: 2, terminal: true, outcomes: [{ id: 'g', when: give, goto: 'c15_a_go' }, { id: 'x', goto: 'c15_a_grave' }],
        text: 'Он кивает и скрывается за деревьями.', effects: [{ set: '$.c15_t2', value: 'wave' }] },
      { id: 'c15_at2_think', label: 'Стоять и думать о том, что он сказал', minutes: 6, terminal: true, outcomes: [{ id: 'g', when: give, goto: 'c15_a_go' }, { id: 'x', goto: 'c15_a_grave' }],
        text: 'Одиннадцать. Он считает. И каждому даёт время до завтра. Ты стоишь у калитки, пока не начинают мёрзнуть пальцы.', effects: [{ set: '$.c15_t2', value: 'think' }] },
      { id: 'c15_at2_partner', label: 'Найти глазами {partner.acc}', minutes: 3, terminal: true, outcomes: [{ id: 'g', when: give, goto: 'c15_a_go' }, { id: 'x', goto: 'c15_a_grave' }],
        text: '{partner} стоит на крыльце с письмом в руке. Вы смотрите друг на друга. Слов не нужно.', effects: [{ set: '$.c15_t2', value: 'partner' }] },
    ] }),

  S15({ id: 'c15_a_kai', for: 'any', chapter: 'ch3', title: 'Одиннадцать', location: 'c15_garden', ambient: day14,
    text: [{ text: 'Яннес ведёт тебя к домику одиннадцать. Ставни закрыты. Он открывает одну.\n\nВнутри мужчина в свитере, тот самый, с видео. Седой, небритый. Сидит на полу у печки и раскачивается. Цепь от щиколотки к трубе.\n\n— Папа, — говорит Яннес. Ровно, как «доброе утро». Мужчина поворачивается на голос. Потом на скрип ставни.' }],
    actions: [
      { id: 'c15_ak_hand', label: 'Положить руку Яннесу на плечо', minutes: 4, terminal: true, goto: 'c15_a_back',
        text: 'Яннес не оборачивается. Закрывает ставню.\n\n— Он чинил мне велосипед каждую неделю, — говорит он. — Я специально ломал, чтобы он чинил.', effects: [{ set: '$.c15_kai', value: 'hand' }, jannes(2)] },
      { id: 'c15_ak_ask', label: 'Спросить, что он сам думает делать дальше', minutes: 5, terminal: true, goto: 'c15_a_back',
        text: '— Носить воду. — Яннес пожимает плечами. — Пока мама носит. А потом посмотрим. — Он смотрит на нож у себя на поясе. — Потом посмотрим.', effects: [{ set: '$.c15_kai', value: 'ask' }, jannes(1)] },
      { id: 'c15_ak_away', label: 'Отойти: это не твоё', minutes: 2, terminal: true, goto: 'c15_a_back',
        text: 'Ты отходишь. Яннес стоит у ставни ещё минуту. Потом догоняет вас у калитки колонии.', effects: [{ set: '$.c15_kai', value: 'away' }] },
    ] }),

  S15({ id: 'c15_a_ninad', for: 'any', chapter: 'ch3', title: 'У холмика', camp: yard14, ambient: day14,
    text: [{ text: 'Нина остаётся у яблони одна. Сидит на корточках перед холмиком и что-то раскладывает на земле. Камешки. Ровным рядом.' }],
    actions: [
      { id: 'c15_and_stones', label: 'Принести ей камешков с дороги', minutes: 10, terminal: true, goto: 'c15_a_after',
        text: 'Ты набираешь горсть гладких камешков у обочины. Нина берёт их по одному и выкладывает дальше. Ряд становится буквой. «P».', effects: [{ set: '$.c15_nd', value: 'stones' }, nina(1)] },
      { id: 'c15_and_wait', label: 'Подождать в стороне', minutes: 10, terminal: true, goto: 'c15_a_after',
        text: 'Ты стоишь у сарая. Нина раскладывает камешки, потом встаёт, отряхивает колени и идёт к тебе. Глаза сухие.', effects: [{ set: '$.c15_nd', value: 'wait' }] },
      { id: 'c15_and_go', label: 'Оставить её и пойти мыть лопату', minutes: 5, terminal: true, goto: 'c15_a_after',
        text: 'Ты уходишь к колодцу. Обернувшись, видишь, что Нина легла на траву рядом с холмиком и смотрит в небо.', effects: [{ set: '$.c15_nd', value: 'go' }] },
    ] }),

  S15({ id: 'c15_a_n0', for: 'any', chapter: 'ch3', title: 'Дрова', camp: yard14, ambient: day14,
    text: [{ text: 'Поленница у кухни почти пустая. Ночью было холодно, плиту топили до утра. Колун стоит у чурбака.' }],
    actions: [
      { id: 'c15_an0_chop', label: 'Наколоть дров на два дня', minutes: 40, activity: 'heavy', terminal: true, goto: 'c15_a_n1',
        text: 'Ты колешь, пока не перестаёшь думать. Удар, полено пополам, следующее. Через сорок минут у кухни новая поленница. Руки гудят, голова пустая и ясная.', effects: [{ set: '$.c15_n0', value: 'chop' }] },
      { id: 'c15_an0_some', label: 'Наколоть на вечер', minutes: 15, activity: 'moderate', terminal: true, goto: 'c15_a_n1',
        text: 'Десяток поленьев. На вечер хватит. Завтра снова.', effects: [{ set: '$.c15_n0', value: 'some' }] },
      { id: 'c15_an0_rest', label: 'Сесть на чурбак и отдохнуть', minutes: 15, activity: 'rest', terminal: true, goto: 'c15_a_n1',
        text: 'Ты сидишь на чурбаке, вытянув ноги. Солнце греет спину. По двору бродят куры и что-то клюют в траве.', effects: [{ set: '$.c15_n0', value: 'rest' }, { body: 'stress', delta: -1 }] },
    ] }),

  S15({ id: 'c15_a_n1', for: 'any', chapter: 'ch3', title: 'Сообщение', camp: yard14, ambient: day14,
    text: [
      { when: give, text: 'Телефон вибрирует. Яннес: «Er hat gegessen. Mama sagt: danke an euch zwei». Он поел. Мама говорит: спасибо вам обоим.' },
      { when: end, text: 'Телефон вибрирует. Незнакомый номер: «Mama hat für Jens eine Kerze angezündet. Jannes». Мама зажгла свечу для Йенса. Яннес.' },
      { when: gate, text: 'Телефон вибрирует. Незнакомый номер: «Hab gehört. Tut mir leid für Nina. Jannes». Слышал. Жаль Нину. Яннес.' },
    ],
    actions: [
      { id: 'c15_an1_reply', label: 'Ответить', minutes: 4, terminal: true, goto: 'c15_a_n2',
        text: 'Ты пишешь: «Danke. Für alles». Спасибо. За всё. Сообщение уходит со второй попытки.', effects: [{ set: '$.c15_n1', value: 'reply' }, { charge: 'phone', delta: -1 }, jannes(1)] },
      { id: 'c15_an1_save', label: 'Сохранить номер', minutes: 2, terminal: true, goto: 'c15_a_n2',
        text: 'Ты сохраняешь номер: «Яннес, колония». Мало ли.', effects: [{ set: '$.c15_n1', value: 'save' }] },
      { id: 'c15_an1_nina', label: 'Показать сообщение Нине', minutes: 4, terminal: true, goto: 'c15_a_n2',
        text: 'Нина читает и долго смотрит на экран. Потом возвращает телефон.\n\n— Он хороший, — говорит она. — Яннес. Он в школе за мной в очереди в столовую стоял. Я и не знала, как его зовут.', effects: [{ set: '$.c15_n1', value: 'nina' }, nina(1)] },
    ] }),

  S15({ id: 'c15_a_n2', for: 'any', chapter: 'ch3', title: 'Нина спрашивает', camp: yard14, ambient: day14,
    text: [{ text: 'Нина садится рядом с тобой на ступеньку.\n\n— Мне Лена пишет, — говорит она. — Подруга, из Винзена. Её мама говорит: пусть Нина живёт у нас. Насовсем. У них свет бывает. И школа рядом, если откроют.\n\nОна смотрит на тебя.\n\n— Ты бы как сделал{m:|а}?' }],
    actions: [
      { id: 'c15_an2_winsen', label: 'Сказать: там семья, это важно', minutes: 5, terminal: true, goto: 'c15_noon',
        text: 'Нина кивает.\n\n— Семья, — повторяет она. — У меня теперь только Лена. И вы. — Она встаёт. — Решите вдвоём. Я послушаю.', effects: [{ set: '$.c15_n2', value: 'winsen' }, toNoon] },
      { id: 'c15_an2_stay', label: 'Сказать: можешь остаться с нами', minutes: 5, terminal: true, goto: 'c15_noon',
        text: 'Нина отворачивается. Потом говорит, не поворачиваясь:\n\n— Это ты сейчас так говоришь. А потом устанешь.\n\nНо голову кладёт тебе на плечо.', effects: [{ set: '$.c15_n2', value: 'stay' }, nina(2), toNoon] },
      { id: 'c15_an2_ask', label: 'Спросить, чего хочет она', minutes: 5, terminal: true, goto: 'c15_noon',
        text: '— Чтобы меня кто-нибудь ждал, — говорит Нина. — Всё равно где. Чтобы я пришла, а там свет горит.', effects: [{ set: '$.c15_n2', value: 'ask' }, nina(1), toNoon] },
    ] }),

  // ───────────── B днём ─────────────
  S15({ id: 'c15_b_hut', for: 'any', chapter: 'ch3', title: 'Будка', location: 'c10_field', ambient: day14,
    text: [{ text: 'Ты идёшь по колее тачки до насыпи. На шпалах иней почти сошёл. Будка обходчика открыта. Внутри на лавке аккуратно сложенное одеяло, на крюке красная тряпка. На подоконнике банка, в ней записка.\n\n«Für die Leute vom Hof. Danke. U.»\n\nЛюдям с хутора. Спасибо. У.' }],
    actions: [
      { id: 'c15_bht_take', label: 'Взять записку', minutes: 25, activity: 'moderate', move: true, terminal: true, goto: 'c15_b_koehler',
        text: 'Ты кладёшь записку в карман. Обратно идёшь медленно. С насыпи хутор виден целиком: крыша, сарай, навес, крошечная фигурка у колодца.', effects: [{ set: '$.c15_bht', value: 'take' }, { set: '$.c15_ute_note', value: true }, { restUntil: at(16, 9, 50) }] },
      { id: 'c15_bht_leave', label: 'Оставить как есть', minutes: 25, activity: 'moderate', move: true, terminal: true, goto: 'c15_b_koehler',
        text: 'Ты ставишь банку обратно. Пусть будет здесь. Для тех, кто пойдёт следующим.', effects: [{ set: '$.c15_bht', value: 'leave' }, { restUntil: at(16, 9, 50) }] },
      { id: 'c15_bht_rails', label: 'Пройти по шпалам дальше, в сторону колонии', minutes: 30, activity: 'moderate', move: true, terminal: true, goto: 'c15_b_koehler',
        text: 'Ты идёшь по шпалам минут десять. Вдалеке, за деревьями, видны крыши садовых домиков. Над одной поднимается дым. Ты разворачиваешься. Это не твоя дорога. Пока.', effects: [{ set: '$.c15_bht', value: 'rails' }, { restUntil: at(16, 9, 50) }] },
    ] }),

  S15({ id: 'c15_b_burial', for: 'any', chapter: 'ch3', title: 'Втроём', camp: yard14, ambient: day14,
    text: [{ text: '{partner} машет тебе с края двора. Яма готова. Нина стоит рядом, руки в карманах. Свёрток в одеяле лежит на краю.\n\n— Помоги, — говорит {partner}. — Втроём.' }],
    actions: [
      { id: 'c15_bbu_help', label: 'Взяться за край одеяла', minutes: 15, activity: 'moderate', terminal: true, goto: 'c15_b_koehler',
        text: 'Вы опускаете его втроём. Медленно. Нина держит за край у головы и отпускает последней. Потом сама бросает первую горсть земли.', effects: [{ set: '$.c15_bbu', value: 'help' }, nina(1), { restUntil: at(16, 9, 50) }] },
      { id: 'c15_bbu_nina', label: 'Встать рядом с Ниной и держать её', minutes: 15, terminal: true, goto: 'c15_b_koehler',
        text: 'Ты стоишь за спиной у Нины, обняв её за плечи. Она смотрит, не отрываясь, пока {partner} засыпает яму. Только раз шепчет: «Drei Minuten».', effects: [{ set: '$.c15_bbu', value: 'nina' }, nina(2), { restUntil: at(16, 9, 50) }] },
      { id: 'c15_bbu_flowers', label: 'Сначала поискать, что положить сверху', minutes: 15, terminal: true, goto: 'c15_b_koehler',
        text: 'Цветов в ноябре нет. Ты приносишь ветку яблони с последними сморщенными яблоками. Нина кладёт её на холмик и поправляет, чтобы лежала ровно.', effects: [{ set: '$.c15_bbu', value: 'flowers' }, nina(1), { restUntil: at(16, 9, 50) }] },
    ] }),

  S15({ id: 'c15_b_fuel', for: 'any', chapter: 'ch3', title: 'Бак', camp: yard14, ambient: day14,
    text: [{ text: 'Ты садишься в Corsa и поворачиваешь ключ на одно деление, чтобы не заводить. Стрелка бензина чуть ниже четверти.\n\nДо Винзена восемнадцать километров. Туда и обратно — почти три литра.' }],
    actions: [
      { id: 'c15_bf_count', label: 'Посчитать, на что ещё хватит', minutes: 6, terminal: true, goto: 'c15_b_n2',
        text: 'Винзен туда и обратно. Или Бухгольц. Или дважды Йестебург. На всё сразу — нет. Ты записываешь цифры на обороте письма Хенрике.', effects: [{ set: '$.c15_fuel', value: 'count' }] },
      { id: 'c15_bf_can', label: 'Поискать в сарае канистру', minutes: 8, terminal: true, goto: 'c15_b_n2',
        text: 'Канистра есть, пустая. На дне пахнет бензином. Оле, видно, слил всё в трактор ещё неделю назад. Трактора во дворе нет.', effects: [{ set: '$.c15_fuel', value: 'can' }] },
      { id: 'c15_bf_off', label: 'Выключить и не думать об этом сейчас', minutes: 2, terminal: true, goto: 'c15_b_n2',
        text: 'Ты поворачиваешь ключ обратно. Стрелка падает на ноль. Тишина в машине густая, как вата.', effects: [{ set: '$.c15_fuel', value: 'off' }] },
    ] }),

  S15({ id: 'c15_b_n2', for: 'any', chapter: 'ch3', title: 'Лена звонит', camp: kitchen14,
    text: [{ text: 'На кухонном столе вибрирует телефон Нины: она забыла его, уходя. На экране «Lena ❤». Звонок. Потом сообщение: «Mama sagt, wir holen dich, wenn ihr nicht könnt. Ruf an!»\n\nМама говорит: заберём тебя, если вы не сможете. Позвони!' }],
    actions: [
      { id: 'c15_bn2x_answer', label: 'Ответить на следующий звонок', minutes: 6, terminal: true, goto: 'c15_noon',
        text: 'Звонок раздаётся снова. Ты отвечаешь. Девичий голос, быстрый, испуганный: «Nina?» Ты объясняешь, как можешь: Нина в порядке, перезвонит. Лена говорит «danke» три раза подряд.', effects: [{ set: '$.c15_bn2x', value: 'answer' }, toNoon] },
      { id: 'c15_bn2x_leave', label: 'Не трогать: это её телефон', minutes: 2, terminal: true, goto: 'c15_noon',
        text: 'Телефон вибрирует ещё раз и замолкает. Ты кладёшь его экраном вниз, как кладёт Нина.', effects: [{ set: '$.c15_bn2x', value: 'leave' }, toNoon] },
      { id: 'c15_bn2x_note', label: 'Оставить записку: «Звонила Лена»', minutes: 3, terminal: true, goto: 'c15_noon',
        text: 'Ты пишешь на обрывке бумаги и кладёшь под телефон. Буквы выходят крупные, как у Хенрике.', effects: [{ set: '$.c15_bn2x', value: 'note' }, toNoon] },
    ] }),
];

