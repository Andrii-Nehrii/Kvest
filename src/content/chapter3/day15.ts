import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import {
  A14 as A15, S15, day14, house14, jens15, kitchen14, leo14, nina15, night14, soldier14, tense14, yard14,
} from './point14';
import { meal } from './point12';

const any = (...xs: Cond[]): Cond => ({ any: xs });
const toSleep: Effect = { restUntil: at(16, 6, 30), sleeping: true };
const toBreakfast: Effect = { restUntil: at(16, 7) };
const toSoldier: Effect = { restUntil: at(16, 7, 40) };
const toNoon: Effect = { restUntil: at(16, 12, 30) };
const toCp: Effect = { restUntil: at(16, 13) };
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const ute = (trust: number): Effect => ({ npc: 'c14_ute', trust });
const jannes = (trust: number): Effect => ({ npc: 'c14_jannes', trust });
const tobias = (trust: number): Effect => ({ npc: 'c15_tobias', trust });
const give = jens15('give'), end = jens15('end'), gate = jens15('gate');
const withNina = nina15('with'), inHouse = nina15('house');
const dead = any(end, gate);
const split = (a: string, b: string) => [{ id: 'a', when: A15, goto: a }, { id: 'b', goto: b }];
const garden = 'c15_garden';
const cold = night14;

export const day15Scenes: Scene[] = [
  // ───────────── Ночь: отдать ─────────────
  S15({ id: 'c15_g_gate', for: 'any', chapter: 'ch3', title: 'Одиннадцать', camp: tense14, ambient: cold,
    text: [
      { text: 'Без пяти одиннадцать у задней калитки загорается красный огонёк. Налобный фонарь Яннеса, под красным стеклом. За ним тачка. Уте в рабочих перчатках, с шестом на плече. Шлем висит у неё на локте, как сумка.\n\n— Guten Abend, — говорит она тихо. — Jetzt erkläre ich, wer was macht.\n\nДобрый вечер. Сейчас объясню, кто что делает.' },
      { when: withNina, text: 'Нина стоит рядом с тобой в куртке, застёгнутой до подбородка. Сумка с папиными вещами у неё в руке.' },
      { when: inHouse, text: 'Окно Нины на втором этаже открыто настежь. Её силуэт неподвижен.' },
      { text: 'Уте показывает пальцем. Яннес и {A} — у двери кабины. Яннес открывает, {A} держит дверь. Уте — шест и шлем. {B} — свет, низко, только красный. Белый нельзя.' },
    ],
    actions: [
      { id: 'c15_gg_go', label: 'Встать на своё место', minutes: 3, terminal: true,
        outcomes: [{ id: 'a', when: A15, goto: 'c15_g_a_door' }, { id: 'h', when: inHouse, goto: 'c15_g_b_house' }, { id: 'b', goto: 'c15_g_b_light' }],
        text: 'Яннес сжимает тебе плечо, проходя мимо. Пальцы у него ледяные даже через перчатку.', effects: [{ set: '$.c15_gg', value: 'go' }] },
      { id: 'c15_gg_ask', label: 'Спросить Уте, что будет, если он вырвется', minutes: 4, terminal: true,
        outcomes: [{ id: 'a', when: A15, goto: 'c15_g_a_door' }, { id: 'h', when: inHouse, goto: 'c15_g_b_house' }, { id: 'b', goto: 'c15_g_b_light' }],
        text: '— Er ist schwach, — говорит Уте. — Und er ist nicht böse. Er ist nur hungrig und hat Angst.\n\nОн слабый. И он не злой. Он просто голодный, и ему страшно.\n\nЯннес за её спиной молча показывает тебе нож на поясе. Мама его не видит.', effects: [{ set: '$.c15_gg', value: 'ask' }] },
    ] }),

  S15({ id: 'c15_g_a_door', for: 'any', chapter: 'ch3', title: 'Дверь кабины', camp: tense14, ambient: cold,
    text: [{ text: 'Яннес отдаёт тебе кожаные перчатки, толстые, сварочные. Вставляет Нинин ключ в замок кабины.\n\n— Auf drei, — шепчет он. — Du ziehst. Ich gehe weg. Mama macht die Schlinge.\n\nНа три. Ты тянешь дверь. Я отхожу. Петлю делает мама.\n\nОн считает. На «три» ты тянешь дверь на себя.\n\nЗапах бьёт в лицо. Йенс сидит, привалившись к рулю. Худой, как будто его стало вдвое меньше. Губы потрескались до крови. Он поворачивает голову на скрип двери.' }],
    actions: [
      { id: 'c15_gad_hold', label: 'Держать дверь, как сказал Яннес', minutes: 5, terminal: true, goto: 'c15_g_a_cart',
        text: 'Ты держишь дверь. Йенс медленно сползает с сиденья к тебе. Петля на шесте опускается ему на шею, мягко, как шарф. Уте тянет. Йенс подаётся за ней, не к тебе.\n\nШлем Уте надевает одним движением. Будто всю жизнь только этим и занималась.', effects: [{ set: '$.c15_gad', value: 'hold' }] },
      { id: 'c15_gad_pole', label: 'Взяться за шест вместе с Уте: она не удержит', minutes: 5, risky: true, terminal: true, goto: 'c15_g_a_cart',
        text: 'Ты хватаешься за шест рядом с её руками. Йенс дёргается сильнее, чем можно ждать от такого худого. Шест бьёт тебя по предплечью. Больно.\n\nУте не отпускает. Вдвоём вы удерживаете его. Шлем она надевает свободной рукой.\n\n— Danke, — говорит она, не глядя на тебя.', effects: [{ set: '$.c15_gad', value: 'pole' }, { injure: 'bruise', site: 'leftArm', severity: 1 }, ute(1)] },
      { id: 'c15_gad_light', label: 'Посветить ему в лицо, чтобы видеть', minutes: 4, risky: true, terminal: true, goto: 'c15_g_a_cart',
        text: 'Белый луч бьёт Йенсу в глаза. Он кидается на свет, всем телом, через порог кабины.\n\n— Licht aus! — шипит Яннес.\n\nТы гасишь фонарь. Петля уже на шее. Уте держит. Йенс замирает в темноте, будто его выключили.', effects: [{ set: '$.c15_gad', value: 'light' }, { body: 'stress', delta: 4 }, jannes(-1)] },
    ] }),

  S15({ id: 'c15_g_a_cart', for: 'any', chapter: 'ch3', title: 'Тачка', camp: tense14, ambient: cold,
    text: [{ text: 'Йенса укладывают в тачку на одеяло. Ремни через грудь, через колени. Шлем с заклеенным визором делает его похожим на манекен. Он не сопротивляется. В темноте он тихий, как говорила Уте.\n\nУте наклоняется к шлему:\n\n— Jens. Ich bin Ute. Wir gehen jetzt spazieren. Nicht weit.\n\nЙенс. Я Уте. Мы сейчас пойдём гулять. Недалеко.\n\nЯннес берётся за ручки.\n\n— На насыпь крутой подъём, — говорит он. — Поможешь?' }],
    actions: [
      { id: 'c15_gac_push', label: 'Толкать тачку вместе с ним до насыпи', minutes: 25, activity: 'heavy', move: true, terminal: true, goto: 'c15_g_a_rails',
        text: 'Колесо вязнет в борозде. Вы толкаете вдвоём, плечом к плечу. Йенс в тачке покачивается, лёгкий, совсем лёгкий. На подъёме Яннес поскальзывается, и ты один держишь тачку, пока он встаёт. Из-под шлема ни звука.', effects: [{ set: '$.c15_gac', value: 'push' }, jannes(2)] },
      { id: 'c15_gac_light', label: 'Идти впереди и выбирать дорогу', minutes: 25, activity: 'moderate', move: true, terminal: true, goto: 'c15_g_a_rails',
        text: 'Ты идёшь впереди и выбираешь, где суше. Свет держишь низко, к земле. За спиной скрипит колесо и шуршат шаги Уте. Она всю дорогу тихо говорит. Не с вами.', effects: [{ set: '$.c15_gac', value: 'light' }, jannes(1)] },
      { id: 'c15_gac_ute', label: 'Идти сзади, рядом с Уте', minutes: 25, activity: 'moderate', move: true, terminal: true, goto: 'c15_g_a_rails',
        text: 'Уте идёт рядом с тачкой и держит руку на борту. Всю дорогу она тихо говорит со шлемом. Про погоду. Про кур. Про то, что в Винзене дали свет на два часа. Ты понимаешь не всё. Йенс не понимает ничего.', effects: [{ set: '$.c15_gac', value: 'ute' }, ute(1)] },
    ] }),

  S15({ id: 'c15_g_a_rails', for: 'any', chapter: 'ch3', title: 'Насыпь', location: 'c10_field', ambient: cold,
    text: [
      { when: withNina, text: 'На насыпи Нина догоняет тачку. Ставит сумку на одеяло, в ноги отцу. Кладёт ладонь на шлем. Йенс поворачивает голову на её дыхание.\n\n— Tschüss, Papa, — говорит Нина. — Ich komme Mittwoch.\n\nПока, папа. Я приду в среду.' },
      { when: inHouse, text: 'На насыпи Уте открывает сумку, которую ей отдала Нина, и кладёт сверху фото. Лицом вверх.' },
      { text: 'Уте обнимает тебя. От неё пахнет дымом и яблоками.\n\n— Parzelle zwölf, — говорит она. — Ihr könnt immer kommen.\n\nПарцелла двенадцать. Приходите когда угодно.' },
      { text: 'Яннес задерживается на секунду.\n\n— Danke, — говорит он. — Für heute.\n\nСпасибо. За сегодня.' },
    ],
    actions: [
      { id: 'c15_gar_jannes', label: 'Попросить Яннеса написать, когда дойдут', minutes: 3, terminal: true, goto: 'c15_sleep',
        text: 'Яннес кивает и диктует номер. Ты записываешь. Через час сорок, уже в постели, ты получаешь: «Da. Alles ruhig. Er trinkt.»\n\nДошли. Всё тихо. Он пьёт.', effects: [{ set: '$.c15_gar', value: 'jannes' }, jannes(1)] },
      { id: 'c15_gar_watch', label: 'Смотреть, пока огонёк не скроется', minutes: 15, terminal: true, goto: 'c15_sleep',
        text: 'Красный огонёк уходит по шпалам, всё меньше. Скрип колеса стихает раньше, чем гаснет свет. Потом гаснет и свет.', effects: [{ set: '$.c15_gar', value: 'watch' }] },
      { id: 'c15_gar_nina', label: 'Обнять Нину за плечи и вести домой', when: withNina, minutes: 10, terminal: true, goto: 'c15_sleep',
        text: 'Нина идёт рядом и не плачет. Только у калитки останавливается и говорит:\n\n— Он на меня повернулся. Ты видел{m:|а}? — Она не ждёт ответа. — Я знаю, что на дыхание. Всё равно.', effects: [{ set: '$.c15_gar', value: 'nina' }, nina(2)] },
    ] }),

  S15({ id: 'c15_g_b_light', for: 'any', chapter: 'ch3', title: 'Красный свет', camp: tense14, ambient: cold,
    text: [{ text: 'Ты держишь фонарь низко, у колена. Красный свет лежит на земле лужей. Нина стоит рядом, так близко, что ты слышишь, как она дышит.\n\nДверь кабины открывается. На секунду в красном свете — лицо. Худое, серое, с запёкшимися губами. Глаза открыты.\n\n— Papa, — шепчет Нина.\n\nЙенс поворачивает голову к ней. А потом — к скрипу двери. Так же.' }],
    actions: [
      { id: 'c15_gbl_hand', label: 'Взять Нину за руку', minutes: 5, terminal: true, goto: 'c15_g_b_rails',
        text: 'Её пальцы вцепляются в твои. Она не отводит глаз, пока Уте надевает отцу шлем. Только тогда отворачивается и утыкается лбом тебе в плечо.', effects: [{ set: '$.c15_gbl', value: 'hand' }, nina(1), { restUntil: at(15, 23, 25) }] },
      { id: 'c15_gbl_steady', label: 'Держать свет ровно, как просила Уте', minutes: 5, terminal: true, goto: 'c15_g_b_rails',
        text: 'Ты держишь свет ровно. Петля, шлем, ремни. Всё по порядку, как рецепт. Рука у тебя не дрожит. Дрожит потом, когда тачка уже катится к калитке.', effects: [{ set: '$.c15_gbl', value: 'steady' }, ute(1), { restUntil: at(15, 23, 25) }] },
      { id: 'c15_gbl_closer', label: 'Пропустить Нину ближе', minutes: 4, risky: true, terminal: true, goto: 'c15_g_b_rails',
        text: 'Нина делает два шага. Уте, не оборачиваясь, вытягивает руку, и Нина упирается в неё грудью.\n\n— Nicht so nah, Schatz. Gleich. Auf dem Damm.\n\nНе так близко, милая. Сейчас. На насыпи.', effects: [{ set: '$.c15_gbl', value: 'closer' }, { body: 'stress', delta: 3 }, { restUntil: at(15, 23, 25) }] },
    ] }),

  S15({ id: 'c15_g_b_house', for: 'any', chapter: 'ch3', title: 'У окна', camp: house14,
    text: [{ text: 'Вы с Ниной стоите у открытого окна. Внизу, во дворе, красный огонёк. Слышно, как щёлкает замок кабины. Потом скрип двери.\n\nНина вцепляется в подоконник.\n\n— Я хочу вниз, — говорит она. — Можно я вниз? Хотя бы на крыльцо?' }],
    actions: [
      { id: 'c15_gbh_porch', label: 'Пустить её на крыльцо и пойти с ней', minutes: 6, terminal: true, goto: 'c15_g_b_after',
        text: 'Вы стоите на крыльце. Тачку проводят мимо, в десяти шагах. Шлем, одеяло, ремни. Нина поднимает руку. Уте видит и останавливается на секунду, чтобы она успела.', effects: [{ set: '$.c15_gbh', value: 'porch' }, nina(1)] },
      { id: 'c15_gbh_window', label: 'Остаться у окна и обнять её', minutes: 8, terminal: true, goto: 'c15_g_b_after',
        text: 'Ты обнимаешь её сзади. Нина не вырывается. Вы смотрите, как красный огонёк уходит через поле и поднимается на насыпь.\n\n— Он даже не знает, что я тут, — говорит Нина. — Ну и пусть.', effects: [{ set: '$.c15_gbh', value: 'window' }, nina(1)] },
      { id: 'c15_gbh_count', label: 'Считать с ней шаги тачки по скрипу', minutes: 8, terminal: true, goto: 'c15_g_b_after',
        text: 'Скрип, скрип. Нина считает шёпотом по-немецки. На сто двенадцатом скрип стихает. Насыпь.\n\n— Сто двенадцать, — говорит Нина. — Запомню.', effects: [{ set: '$.c15_gbh', value: 'count' }] },
    ] }),

  S15({ id: 'c15_g_b_rails', for: 'any', chapter: 'ch3', title: 'Прощание', location: 'c10_field', ambient: cold,
    text: [{ text: 'На насыпи Нина ставит сумку отцу в ноги и кладёт ладонь на шлем.\n\n— Tschüss, Papa. Ich komme Mittwoch.\n\nПока, папа. Я приду в среду.\n\nУте обнимает Нину. Потом тебя.\n\n— Parzelle zwölf, — говорит она. — Kommt, wann ihr wollt.\n\nПарцелла двенадцать. Приходите, когда захотите.' }],
    actions: [
      { id: 'c15_gbr_home', label: 'Увести Нину домой, пока огонёк не скрылся', minutes: 12, terminal: true, goto: 'c15_g_b_after',
        text: 'Нина идёт, оглядываясь на каждом десятом шаге. У калитки огонька уже не видно. Она всё равно оглядывается.', effects: [{ set: '$.c15_gbr', value: 'home' }] },
      { id: 'c15_gbr_wait', label: 'Стоять с ней, пока не скроется', minutes: 15, terminal: true, goto: 'c15_g_b_after',
        text: 'Вы стоите на шпалах. Огонёк уходит всё дальше и меньше. Нина не моргает. Когда он гаснет за деревьями, она говорит: «Всё». И сама берёт тебя под руку.', effects: [{ set: '$.c15_gbr', value: 'wait' }, nina(1)] },
    ] }),

  S15({ id: 'c15_g_b_after', for: 'any', chapter: 'ch3', title: 'Чайник', camp: kitchen14,
    text: [{ text: 'На кухне Нина ставит чайник и забывает его выключить. Он свистит. Она сидит, глядя на ключ от фургона на столе. Ключ уже не нужен.' }],
    actions: [
      { id: 'c15_gba_tea', label: 'Налить ей чаю и посидеть рядом', minutes: 15, terminal: true, goto: 'c15_sleep',
        text: 'Нина пьёт чай маленькими глотками. Потом кладёт голову на руки прямо на столе. Через пять минут она спит. Ты накрываешь её курткой.', effects: [{ set: '$.c15_gba', value: 'tea' }, nina(1)] },
      { id: 'c15_gba_key', label: 'Спросить, что сделать с ключом', minutes: 4, terminal: true, goto: 'c15_sleep',
        text: 'Нина берёт ключ и снова вешает его на шею.\n\n— Фургон-то папин, — говорит она. — Значит, теперь мой.', effects: [{ set: '$.c15_gba', value: 'key' }] },
    ] }),

  // ───────────── Ночь: сами ─────────────
  S15({ id: 'c15_e_a_gun', for: 'any', chapter: 'ch3', title: 'Ружьё', camp: house14,
    text: [
      { when: { v: 'A.c14_gun', op: '==', value: 'load' }, text: 'Ружьё стоит за шкафом, заряженное с вечера. Ты берёшь его, и оно оказывается тяжелее, чем днём.' },
      { when: { v: 'A.c14_gun', op: '==', value: 'pocket' }, text: 'Патроны весь вечер лежали у тебя в кармане. Теперь ты достаёшь ружьё из-за шкафа и заряжаешь. Щелчок громкий, на весь дом.' },
      { when: not(any({ v: 'A.c14_gun', op: '==', value: 'load' }, { v: 'A.c14_gun', op: '==', value: 'pocket' })), text: 'Ты отодвигаешь шкаф, достаёшь ружьё, берёшь из чашки два патрона. Заряжаешь, как видел{m:|а} у Оле. Щелчок громкий, на весь дом.' },
      { text: 'Половина десятого. Во дворе темно и тихо. Из-под навеса ни звука.' },
    ],
    actions: [
      { id: 'c15_eag_go', label: 'Идти к фургону', minutes: 3, terminal: true, goto: 'c15_e_a_van',
        text: 'Ружьё ты держишь стволом вниз. Так нёс его Оле.', effects: [{ set: '$.c15_eag', value: 'go' }] },
      { id: 'c15_eag_sit', label: 'Сначала посидеть минуту на ступеньках', minutes: 6, terminal: true, goto: 'c15_e_a_van',
        text: 'Ты сидишь с ружьём на коленях. Холод забирается под куртку. Минута превращается в пять. Никто тебя не торопит, и от этого только хуже.', effects: [{ set: '$.c15_eag', value: 'sit' }, { body: 'stress', delta: 2 }] },
    ] }),

  S15({ id: 'c15_e_a_van', for: 'any', chapter: 'ch3', title: 'Нина говорит', camp: tense14, ambient: cold,
    text: [
      { when: withNina, text: 'Нина уже у фургона. Стоит, прижавшись лбом к доскам, и говорит. По-немецки, быстро, вполголоса. Про кур. Про Хенрике. Про мальчика, который укусил Маркуса. Про то, что в Винзене дали свет на два часа.\n\nПотом замолкает. Отходит на шаг.\n\n— Tschüss, Papa, — говорит она. И поворачивается к тебе. — Всё. Я тут постою.' },
      { when: inHouse, text: 'Наверху открыто окно. Оттуда один раз, громко:\n\n— Papa! Tschüss!\n\nИ окно закрывается.' },
      { text: 'Удар в доски. Йенс у щели, где воронка. Он пришёл на голос.' },
    ],
    actions: [
      { id: 'c15_eav_now', label: 'Сейчас, пока он у щели', minutes: 3, terminal: true, goto: 'c15_e_a_shot',
        text: 'Ты поднимаешь ружьё. Ствол в щель между досками, туда, где была воронка. Близко. Так близко, что промахнуться нельзя.', effects: [{ set: '$.c15_eav', value: 'now' }] },
      { id: 'c15_eav_partner', label: 'Посмотреть на {partner.acc}', minutes: 3, terminal: true, goto: 'c15_e_a_shot',
        text: '{partner} стоит у крыльца. Кивает тебе. Один раз, медленно.\n\nТы поднимаешь ружьё. Ствол в щель между досками.', effects: [{ set: '$.c15_eav', value: 'partner' }] },
      { id: 'c15_eav_knock', label: 'Постучать самому, чтобы Нина больше не звала', when: withNina, minutes: 4, terminal: true, goto: 'c15_e_a_shot',
        text: 'Ты стучишь в доски сам, чтобы Нине не пришлось звать его ещё раз. Йенс поворачивается на стук. На твой стук.\n\nТы поднимаешь ружьё.', effects: [{ set: '$.c15_eav', value: 'knock' }, nina(1)] },
    ] }),

  S15({ id: 'c15_e_a_shot', for: 'any', chapter: 'ch3', title: 'Тишина', camp: tense14, ambient: cold,
    text: [{ text: 'Выстрел. Звенит в ушах. Где-то за полем взлетает с криком птица.\n\nПотом тишина. Такой тишины под навесом не было с того дня, как вы приехали. Из кабины больше никто не стучит.' }],
    actions: [
      { id: 'c15_eas_sit', label: 'Сесть на ящик у колеса', minutes: 10, activity: 'rest', terminal: true, goto: 'c15_e_a_ute',
        text: 'Ты сидишь. Ружьё лежит на земле. Руки дрожат так, что ты зажимаешь их между коленями. Через какое-то время рядом садится {partner}. Ничего не говорит.', effects: [{ set: '$.c15_eas', value: 'sit' }, { body: 'stress', delta: 4 }, { restUntil: at(15, 22, 15) }] },
      { id: 'c15_eas_nina', label: 'Пойти к Нине', minutes: 5, terminal: true, goto: 'c15_e_a_ute',
        effects: [{ set: '$.c15_eas', value: 'nina' }, nina(1), { body: 'stress', delta: 3 }, { restUntil: at(15, 22, 15) }],
        outcomes: [
          { id: 'with', when: withNina, text: 'Нина стоит там же, где стояла. Смотрит на тебя.\n\n— Спасибо, — говорит она. Голос ровный. — Что не солдаты. — И только потом садится на землю.' },
          { id: 'house', text: 'Нина сидит на лестнице, зажав уши ладонями. Ты садишься ступенькой ниже. Она опускает руки.\n\n— Уже? — Ты киваешь. — Хорошо.' },
        ] },
      { id: 'c15_eas_cover', label: 'Завесить окно кабины одеялом', minutes: 6, terminal: true, goto: 'c15_e_a_ute',
        text: 'Ты берёшь из сарая старое одеяло и вешаешь его на доски. Чтобы Нина утром не увидела щель. Руки делают это сами.', effects: [{ set: '$.c15_eas', value: 'cover' }, { body: 'stress', delta: 3 }, { restUntil: at(15, 22, 15) }] },
    ] }),

  S15({ id: 'c15_e_a_ute', for: 'any', chapter: 'ch3', title: 'Они всё равно пришли', camp: tense14, ambient: cold,
    text: [{ text: 'Через полчаса у задней калитки звякает звонок. Уте и Яннес. Без тачки.\n\n— Wir haben den Schuss gehört, — говорит Яннес. — Mama wollte trotzdem kommen.\n\nМы слышали выстрел. Мама всё равно хотела прийти.\n\nУте подходит к фургону. Снимает шапку. Стоит молча. Потом говорит, ни к кому не обращаясь:\n\n— Jetzt ist er nirgends mehr angekettet.\n\nТеперь он больше нигде не на цепи.' }],
    actions: [
      { id: 'c15_eau_jannes', label: 'Принять помощь Яннеса: утром копать', minutes: 4, terminal: true, goto: 'c15_sleep',
        text: '— Я останусь, — говорит Яннес. — Утром выкопаем. Вдвоём быстрее. — Он смотрит на мать. — Мама дойдёт сама. Она эту дорогу наизусть знает.', effects: [{ set: '$.c15_eau', value: 'jannes' }, { set: 'w.c15_jannes_stayed', value: true }, jannes(2)] },
      { id: 'c15_eau_go', label: 'Сказать: спасибо, дальше мы сами', minutes: 3, terminal: true, goto: 'c15_sleep',
        text: 'Уте кивает. Надевает шапку. У калитки она оборачивается.\n\n— Ihr habt es gut gemacht, — говорит она. — Ich hätte es nicht gekonnt. Nie.\n\nВы всё сделали правильно. Я бы не смогла. Никогда.', effects: [{ set: '$.c15_eau', value: 'go' }, ute(1)] },
      { id: 'c15_eau_why', label: 'Спросить Уте, почему она не злится', minutes: 5, terminal: true, goto: 'c15_sleep',
        text: '— Weil Nina ruhig ist. — Уте смотрит на окно второго этажа. — Bei mir sind alle ruhig. Nur ich nicht.\n\nПотому что Нина спокойна. У меня все спокойны. Кроме меня.', effects: [{ set: '$.c15_eau', value: 'why' }] },
    ] }),

  S15({ id: 'c15_e_b_nina', for: 'any', chapter: 'ch3', title: 'Последние слова', camp: tense14, ambient: cold,
    text: [
      { when: withNina, text: 'Нина подходит к фургону, и ты идёшь за ней. Она прижимается лбом к доскам и говорит. По-немецки, быстро и тихо. Ты понимаешь отдельные слова: Hühner. Henrike. Licht in Winsen. Куры. Хенрике. Свет в Винзене.\n\nПотом она говорит по-русски, специально для тебя, чтобы ты тоже знал{m:|а}:\n\n— Я ему рассказала, что вы хорошие.' },
      { when: inHouse, text: 'Нина сидит на кровати, одетая, в ботинках. Окно открыто. Внизу, под навесом, светлое пятно фонаря {A.gen}.\n\n— Я крикну ему, — говорит она. — Один раз. Можно?' },
    ],
    actions: [
      { id: 'c15_ebn_hold', label: 'Обнять её за плечи', minutes: 5, terminal: true, goto: 'c15_e_b_shot',
        effects: [{ set: '$.c15_ebn', value: 'hold' }, nina(1)],
        outcomes: [
          { id: 'with', when: withNina, text: 'Нина отходит от досок и встаёт к тебе спиной. Ты обнимаешь её. Она кладёт ладони поверх твоих рук и держит крепко.\n\n— Не отпускай, — говорит она. — Пока не будет.' },
          { id: 'house', text: 'Ты обнимаешь её. Нина высовывается из окна, не вырываясь, и кричит: «Papa! Tschüss!» Потом сама закрывает окно и садится на пол.' },
        ] },
      { id: 'c15_ebn_ears', label: 'Предложить ей закрыть уши', minutes: 3, terminal: true, goto: 'c15_e_b_shot',
        text: '— Нет, — говорит Нина. — Я хочу знать, когда.', effects: [{ set: '$.c15_ebn', value: 'ears' }] },
      { id: 'c15_ebn_away', label: 'Отвести её за дом, к яблоне', when: withNina, minutes: 5, terminal: true, goto: 'c15_e_b_shot',
        text: 'Нина идёт за тобой к яблоне. Встаёт лицом к стволу, руки в карманах. Так стоят, когда считают в прятках.', effects: [{ set: '$.c15_ebn', value: 'away' }] },
    ] }),

  S15({ id: 'c15_e_b_shot', for: 'any', chapter: 'ch3', title: 'Выстрел', camp: tense14, ambient: cold,
    text: [{ text: 'Выстрел. Он громче, чем ты думал{m:|а}. Звенит в зубах. Где-то в поле с криком взлетает птица.\n\nНина вздрагивает всем телом. Один раз. Потом замирает.' }],
    actions: [
      { id: 'c15_ebs_stay', label: 'Стоять с ней, пока она сама не скажет', minutes: 10, terminal: true, goto: 'c15_e_b_ute',
        text: 'Долго никто из вас не двигается. Нина первой отпускает твои руки.\n\n— Всё, — говорит она. — Теперь всё.\n\nГолос у неё совсем взрослый. От этого ещё страшнее.', effects: [{ set: '$.c15_ebs', value: 'stay' }, nina(1), { restUntil: at(15, 22, 15) }] },
      { id: 'c15_ebs_water', label: 'Принести ей воды', minutes: 5, terminal: true, goto: 'c15_e_b_ute',
        text: 'Нина пьёт, стуча зубами о край кружки. Половину проливает на куртку и не замечает.', effects: [{ set: '$.c15_ebs', value: 'water' }, { restUntil: at(15, 22, 15) }] },
      { id: 'c15_ebs_partner', label: 'Посмотреть, как там {partner}', minutes: 5, terminal: true, goto: 'c15_e_b_ute',
        text: '{partner} сидит на ящике у колеса. Ружьё лежит на земле. {pm:Он|Она} поднимает голову, видит тебя и чуть заметно кивает: всё.', effects: [{ set: '$.c15_ebs', value: 'partner' }, { restUntil: at(15, 22, 15) }] },
    ] }),

  S15({ id: 'c15_e_b_ute', for: 'any', chapter: 'ch3', title: 'Уте', camp: kitchen14,
    text: [{ text: 'Через полчаса приходит Уте. Яннес остаётся во дворе. Уте садится рядом с Ниной на кухне и кладёт ей ладонь на щёку.\n\n— Jetzt ist er nirgends mehr angekettet, — говорит она.\n\nТеперь он больше нигде не на цепи.\n\nНина смотрит на неё и наконец плачет. Громко, некрасиво, по-детски.' }],
    actions: [
      { id: 'c15_ebu_leave', label: 'Оставить их вдвоём', minutes: 15, terminal: true, goto: 'c15_sleep',
        text: 'Ты выходишь на крыльцо. Через закрытую дверь слышно, как Уте что-то тихо говорит. Нина отвечает. Потом смеётся сквозь слёзы. Потом снова плачет.', effects: [{ set: '$.c15_ebu', value: 'leave' }, ute(1)] },
      { id: 'c15_ebu_stay', label: 'Остаться и сидеть рядом', minutes: 15, terminal: true, goto: 'c15_sleep',
        text: 'Ты сидишь рядом. Уте гладит Нину по голове и смотрит на тебя поверх её макушки. Без упрёка. Просто смотрит.', effects: [{ set: '$.c15_ebu', value: 'stay' }, nina(1)] },
    ] }),

  // ───────────── Ночь: ворота ─────────────
  S15({ id: 'c15_k_gate', for: 'any', chapter: 'ch3', title: 'Красный огонёк', camp: tense14, ambient: cold,
    text: [
      { text: 'В одиннадцать у задней калитки всё равно загорается красный огонёк. Без тачки. Уте и Яннес.\n\n— Ich wollte es nur von euch hören, — говорит Уте через калитку. — Nicht vom Licht.\n\nЯ хотела услышать это от вас. Не от фонарика.' },
      { when: withNina, text: 'Нина стоит на крыльце, обхватив себя руками.' },
      { when: inHouse, text: 'Окно Нины открыто. Она слушает.' },
    ],
    actions: [
      { id: 'c15_kg_go', label: 'Выйти к калитке', minutes: 3, terminal: true, outcomes: split('c15_k_a_gate', 'c15_k_b_nina'),
        effects: [{ set: '$.c15_kg', value: 'go' }] },
    ] }),

  S15({ id: 'c15_k_a_gate', for: 'any', chapter: 'ch3', title: 'Через калитку', camp: tense14, ambient: cold,
    text: [{ text: 'Ты подходишь к калитке. Засов между вами. Уте смотрит на тебя спокойно, как на ученика, который пришёл с плохой новостью.\n\n— Also? — спрашивает она.\n\nИтак?' }],
    actions: [
      { id: 'c15_kag_no', label: 'Сказать просто: нет', minutes: 3, terminal: true, goto: 'c15_k_a_jannes',
        text: '— Gut, — говорит Уте. Без обиды. Она достаёт из кармана сложенный листок и протягивает через калитку. — Für Nina. Falls ihr es euch anders überlegt.\n\nДля Нины. Если передумаете.\n\nНа листке: «Parzelle 12».', effects: [{ set: '$.c15_kag', value: 'no' }, { set: 'w.c15_note', value: true }] },
      { id: 'c15_kag_why', label: 'Объяснить: на видео он повернулся и на птицу', minutes: 6, terminal: true, goto: 'c15_k_a_jannes',
        text: 'Уте слушает, не перебивая.\n\n— Ja, — говорит она. — Und auf die Tür. Ich weiß. — Она протягивает через калитку сложенный листок. — Für Nina. Falls doch.\n\nДа. И на дверь. Я знаю. Для Нины. Если всё-таки.\n\nНа листке: «Parzelle 12».', effects: [{ set: '$.c15_kag', value: 'why' }, { set: 'w.c15_note', value: true }, ute(1)] },
      { id: 'c15_kag_seven', label: 'Спросить, что будет с её семерыми, когда кончится вода', minutes: 6, risky: true, terminal: true, goto: 'c15_k_a_jannes',
        text: 'Уте долго молчит.\n\n— Dann trage ich mehr, — говорит она.\n\nТогда буду носить больше.\n\nЯннес за её спиной отворачивается.', effects: [{ set: '$.c15_kag', value: 'seven' }, ute(-1), jannes(1)] },
    ] }),

  S15({ id: 'c15_k_a_jannes', for: 'any', chapter: 'ch3', title: 'Яннес задерживается', camp: tense14, ambient: cold,
    text: [{ text: 'Уте уходит к насыпи первой. Яннес остаётся у калитки. Закуривает, прикрывая огонёк ладонью.\n\n— Честно? — говорит он по-немецки. — Gut so. Восьмого я бы не потянул.\n\nОн выдыхает дым.\n\n— Солдаты завтра всё сделают быстро. Они умеют. Только девочку уведите.' }],
    actions: [
      { id: 'c15_kaj_hand', label: 'Пожать ему руку через калитку', minutes: 3, terminal: true, goto: 'c15_k_a_night',
        text: 'Рука у Яннеса тёплая от сигареты. Он сжимает твою дольше, чем нужно. Потом уходит догонять мать.', effects: [{ set: '$.c15_kaj', value: 'hand' }, jannes(1), { restUntil: at(16, 3), sleeping: true }] },
      { id: 'c15_kaj_mother', label: 'Сказать: береги мать', minutes: 3, terminal: true, goto: 'c15_k_a_night',
        text: '— Я только этим и занят, — говорит Яннес. Без злости. Просто факт.', effects: [{ set: '$.c15_kaj', value: 'mother' }, { restUntil: at(16, 3), sleeping: true }] },
    ] }),

  S15({ id: 'c15_k_a_night', for: 'any', chapter: 'ch3', title: 'Три часа ночи', camp: house14,
    text: [{ text: 'Ты засыпаешь сразу. Просыпаешься от тишины: что-то не так.\n\nТри часа. В окно видно навес. На ящике у колеса сидит Нина, завернувшись в одеяло, и что-то говорит в доски. К ней через двор идёт {partner}.' }],
    actions: [
      { id: 'c15_kan_join', label: 'Выйти к ним с термосом', minutes: 20, terminal: true, goto: 'c15_sleep',
        text: 'Ты приносишь термос. Нина берёт кружку, не оборачиваясь. {partner} кивает тебе: иди спать, я тут. Из кабины один раз стучат. Слабо.', effects: [{ set: '$.c15_kan', value: 'join' }, nina(1)] },
      { id: 'c15_kan_let', label: 'Не мешать и лечь обратно', minutes: 2, terminal: true, goto: 'c15_sleep',
        text: 'Ты ложишься. Сквозь сон слышно, как хлопает дверь и кто-то поднимается по лестнице.', effects: [{ set: '$.c15_kan', value: 'let' }] },
    ] }),

  S15({ id: 'c15_k_b_nina', for: 'any', chapter: 'ch3', title: 'Нина', camp: house14,
    text: [
      { when: withNina, text: 'Ты стоишь на крыльце с Ниной. Она смотрит, как у калитки {A} говорит с Уте. Слов не слышно. Уте протягивает {A.dat} листок. Потом уходит к насыпи. Красный огонёк поднимается и гаснет.' },
      { when: inHouse, text: 'Ты сидишь с Ниной у её открытого окна. Внизу у калитки {A} говорит с Уте. Слов не слышно. Уте протягивает {A.dat} листок. Потом уходит к насыпи. Красный огонёк поднимается и гаснет.' },
      { text: '— Вы ей даже не дали сказать, — говорит Нина. — Она так далеко шла.' },
    ],
    actions: [
      { id: 'c15_kbn_sorry', label: 'Сказать: прости', minutes: 3, terminal: true, goto: 'c15_k_b_night',
        text: '— За что? — Нина пожимает плечами. — Вы решили. Я слышала, как вы решали. Честно было. — Она уходит к себе и закрывает дверь. Тихо.', effects: [{ set: '$.c15_kbn', value: 'sorry' }, { restUntil: at(16, 3), sleeping: true }] },
      { id: 'c15_kbn_why', label: 'Объяснить, почему так', minutes: 6, terminal: true, goto: 'c15_k_b_night',
        text: 'Ты объясняешь. Про птицу. Про семерых на цепях. Про воду, которую надо носить каждый день, пока не кончится. Нина слушает до конца.\n\n— Я понимаю, — говорит она. — Я просто не хочу понимать.', effects: [{ set: '$.c15_kbn', value: 'why' }, nina(1), { restUntil: at(16, 3), sleeping: true }] },
      { id: 'c15_kbn_quiet', label: 'Ничего не говорить, просто быть рядом', minutes: 8, terminal: true, goto: 'c15_k_b_night',
        text: 'Вы молчите. Нина первая кладёт голову тебе на плечо. Потом встаёт и уходит спать, не сказав ни слова.', effects: [{ set: '$.c15_kbn', value: 'quiet' }, nina(1), { restUntil: at(16, 3), sleeping: true }] },
    ] }),

  S15({ id: 'c15_k_b_night', for: 'any', chapter: 'ch3', title: 'Пустая кровать', camp: house14,
    text: [{ text: 'Ты просыпаешься в три. Дверь в комнату Нины открыта, кровать пустая. Ботинок у порога нет.\n\nВ окно видно навес. На ящике у колеса сидит Нина, завернувшись в одеяло. Она говорит в доски.' }],
    actions: [
      { id: 'c15_kbt_sit', label: 'Выйти и сесть рядом', minutes: 30, terminal: true, goto: 'c15_sleep',
        text: 'Ты садишься рядом. Нина отдаёт тебе половину одеяла.\n\n— Я ему рассказываю, как будет, — говорит она. — Что утром придут солдаты, и это будет быстро. Чтобы он не боялся. — Она молчит. — Глупо, да?\n\nИз кабины один раз стучат. Совсем тихо.', effects: [{ set: '$.c15_kbt', value: 'sit' }, nina(2), { body: 'sleepDebt', delta: 0.5 }] },
      { id: 'c15_kbt_bring', label: 'Увести её спать: холодно', minutes: 10, terminal: true, goto: 'c15_sleep',
        text: 'Нина не спорит. Встаёт, складывает одеяло. У двери оборачивается к фургону и машет рукой. Как в окно поезда.', effects: [{ set: '$.c15_kbt', value: 'bring' }] },
    ] }),

  // ───────────── Сон и утро ─────────────
  S15({ id: 'c15_sleep', for: 'any', chapter: 'ch3', title: 'Остаток ночи', camp: house14,
    text: [
      { when: give, text: 'Под навесом пусто. Дверь кабины открыта, и её никто не закрывает.' },
      { when: end, text: 'Под навесом тихо. Так тихо, что слышно, как в доме тикают часы Хенрике.' },
      { when: gate, text: 'Из-под навеса изредка стучат. Всё реже.' },
    ],
    actions: [
      { id: 'c15_sl_sleep', label: 'Лечь спать', minutes: 1, terminal: true, goto: 'c15_dawn',
        text: 'Ты проваливаешься в сон, как в воду.', effects: [{ set: '$.c15_slept', value: true }, toSleep] },
    ] }),

  S15({ id: 'c15_dawn', for: 'any', chapter: 'ch3', title: 'Иней', camp: yard14, ambient: cold,
    text: [
      { text: 'Утро ясное и морозное. Иней на траве, на крыше сарая, на перекладине калитки.' },
      { when: give, text: 'Под навесом дверь кабины распахнута. На сиденье одна пустая бутылка-воронка. От задней калитки через поле тянется колея тачки, белая по инею.' },
      { when: all(end, flag('w.c15_jannes_stayed')), text: 'Под навесом лежит длинный свёрток в одеяле. Яннес спит на тюке в сарае, укрывшись курткой.' },
      { when: all(end, not(flag('w.c15_jannes_stayed'))), text: 'Под навесом лежит длинный свёрток в одеяле.' },
      { when: gate, text: 'Из кабины ни звука. Потом один удар. Через минуту — ещё один.' },
    ],
    actions: [
      { id: 'c15_d_hens', label: 'Налить курам воды и собрать яйца', minutes: 15, activity: 'light', terminal: true, goto: 'c15_breakfast',
        text: 'В поилке корка льда. Ты разбиваешь её, наливаешь воды. В гнёздах три яйца. Ты несёшь их на кухню в ладонях, как птенцов.', effects: [{ set: '$.c15_d', value: 'hens' }, { give: 'eggs', qty: 3 }, { stock: 'eggs', qty: 3, at: 'c3_farm_stock' }, toBreakfast] },
      { id: 'c15_d_nina', label: 'Проверить, как Нина', minutes: 5, terminal: true, goto: 'c15_breakfast',
        text: 'Нина спит одетая, поверх одеяла. Ключ от фургона зажат в кулаке. Ты накрываешь её пледом. Она не просыпается.', effects: [{ set: '$.c15_d', value: 'nina' }, toBreakfast] },
      { id: 'c15_d_stove', label: 'Растопить плиту', minutes: 12, activity: 'light', terminal: true, goto: 'c15_breakfast',
        text: 'Дрова сухие, огонь занимается с первой спички. Кухня понемногу оживает. Кто-то должен это делать, если хозяйки нет.', effects: [{ set: '$.c15_d', value: 'stove' }, toBreakfast] },
    ] }),

  S15({ id: 'c15_breakfast', for: 'any', chapter: 'ch3', title: 'Завтрак', camp: kitchen14,
    text: [
      { text: 'Нина спускается в семь. Садится за стол, берёт хлеб и держит его в руке, не откусывая.' },
      { when: leo14, text: 'Лео сидит рядом с ней и ест кашу. Время от времени он молча кладёт голову Нине на плечо.' },
      { when: give, text: '— Яннес написал, — говорит она. — Папа пил всю ночь. — Она смотрит в окно, на пустой навес. — Это ничего не значит. Я знаю. Всё равно.' },
      { when: dead, text: 'Она смотрит в окно, на навес. Потом отворачивается и больше туда не смотрит.' },
      { when: all(A15, { v: 'A.c14_hilde', op: '==', value: 'truth' }), text: 'Ночью пришло сообщение от Хильде: «Ich habe eine Kerze für Anke angezündet». Я зажгла свечу для Анке.' },
      { when: all(A15, { v: 'A.c14_hilde', op: '==', value: 'short' }), text: 'От Хильде ещё одно сообщение, ночное: «Bitte. Anke?» Пожалуйста. Анке?' },
      { when: all(A15, { v: 'A.c14_hilde', op: '==', value: 'later' }), text: 'Хильде писала ещё три раза. Ты так и не ответил{m:|а}. Маркус скажет сам, когда дойдёт.' },
    ],
    actions: [
      { id: 'c15_b_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, goto: 'c15_soldier', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Ты ешь. Нина в конце концов тоже откусывает хлеб. Потом ещё. Съедает весь кусок, будто вспомнила, как это делается.', effects: [meal('eat'), toSoldier] },
      { id: 'c15_b_pack', label: 'Отложить свою порцию на потом', minutes: 3, terminal: true, goto: 'c15_soldier', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Ты заворачиваешь свою порцию в салфетку. День будет длинным.', effects: [meal('pack'), toSoldier] },
      { id: 'c15_b_skip', label: 'Только чай', minutes: 10, terminal: true, goto: 'c15_soldier',
        text: 'Чай горячий и горький. Ты пьёшь его маленькими глотками и смотришь, как Нина смотрит на хлеб.', effects: [toSoldier] },
    ] }),

  S15({ id: 'c15_soldier', for: 'any', chapter: 'ch3', title: 'Один, на велосипеде', camp: yard14, ambient: day14,
    onEnter: [{ introduceNpc: 'c15_tobias' }, { set: '$.met.c15_tobias', value: true }],
    text: [
      { text: 'Без двадцати восемь у калитки звякает велосипедный звонок. Солдат с планшетом. Тот самый. Один, без машины, без каски, автомат за спиной. Щёки красные от холода.\n\n— Morgen, — говорит он. — Ich heiße Tobias. Ich bin allein.\n\nДоброе утро. Меня зовут Тобиас. Я один.' },
      { when: any(give, end), text: '— Die anderen kommen nicht, — добавляет он. — Heute nicht.\n\nОстальные не приедут. Сегодня нет.' },
      { when: all(soldier14('lie'), A15), text: 'Он смотрит на тебя. — Gestern sagten Sie: der Wagen ist leer.\n\nВчера вы сказали: фургон пустой.' },
      { when: all(soldier14('lie'), not(A15)), text: 'Он смотрит на {A.acc}. — Gestern sagten Sie: der Wagen ist leer.\n\nВчера вы сказали: фургон пустой.' },
      { when: give, text: 'Он смотрит на распахнутую кабину, потом на колею по инею к задней калитке.\n\n— Schubkarre, — говорит он. И впервые улыбается. Устало, одними глазами.' },
      { when: end, text: 'Он смотрит на свёрток под навесом. Медленно снимает шапку.' },
      { when: gate, text: 'Из кабины стучат. Тобиас слушает. Потом смотрит на Нину на крыльце.\n\n— Die anderen kommen um zehn, — говорит он. — Ich wollte vorher. Damit es schnell geht. Und leise.\n\nОстальные приедут в десять. Я хотел раньше. Чтобы быстро. И тихо.' },
    ],
    actions: [
      { id: 'c15_so_talk', label: 'Подойти к нему', minutes: 3, terminal: true, outcomes: split('c15_a_tobias', 'c15_b_tobias'),
        effects: [{ set: '$.c15_so', value: 'talk' }] },
      { id: 'c15_so_nina', label: 'Встать рядом с Ниной', minutes: 3, terminal: true, outcomes: split('c15_a_tobias', 'c15_b_tobias'),
        text: 'Нина берёт тебя под руку. Пальцы у неё холодные.', effects: [{ set: '$.c15_so', value: 'nina' }, nina(1)] },
    ] }),

  S15({ id: 'c15_a_tobias', for: 'any', chapter: 'ch3', title: 'Парцелла девять', camp: yard14, ambient: day14,
    text: [
      { when: give, text: 'Тобиас прислоняет велосипед к забору и говорит тебе тихо, чтобы Нина не слышала:\n\n— Frau Reimers. Ja?\n\nТы не отвечаешь. Он кивает, будто ответ ему не нужен.\n\n— Meine Mutter ist auch bei ihr. Parzelle neun. Ich habe sie selbst hingebracht. Auf der Schubkarre. — Он смотрит на колею. — Darum sage ich allen: bis morgen.\n\nМоя мать тоже у неё. Парцелла девять. Сам отвёз. На тачке. Поэтому я всем и говорю: до завтра.' },
      { when: end, text: 'Тобиас стоит у свёртка, шапка в руке.\n\n— Danke, — говорит он тебе. — Dass ich nicht musste.\n\nСпасибо, что мне не пришлось.\n\nПотом, тише:\n\n— Frau Reimers war hier? — Он кивает на велосипедный след у задней калитки. — Ich hätte es euch sagen sollen. Meine Mutter ist bei ihr. Parzelle neun. Darum sage ich allen: bis morgen.\n\nУте была здесь? Надо было мне вам сказать. Моя мать у неё. Парцелла девять. Поэтому я всем и говорю: до завтра.' },
      { when: gate, text: 'Тобиас подходит к тебе.\n\n— Es gibt eine Frau, — говорит он тихо. — In der Kolonie am Damm. Reimers. Sie nimmt sie.\n\nЕсть одна женщина. В колонии у насыпи. Раймерс. Она их берёт.\n\nТы говоришь: знаем. Она приходила. Мы отказали.\n\nОн долго смотрит на тебя.\n\n— Meine Mutter ist bei ihr. Parzelle neun. — Пауза. — Darum sage ich allen: bis morgen.\n\nМоя мать у неё. Парцелла девять. Поэтому я всем и говорю: до завтра.' },
    ],
    actions: [
      { id: 'c15_at_why', label: 'Спросить, почему он всё это делает', minutes: 5, terminal: true, outcomes: [{ id: 'g', when: give, goto: 'c15_a_go' }, { id: 'x', goto: 'c15_a_grave' }],
        text: '— Ich habe schon elf erschossen, — говорит Тобиас. — Elf. Ich zähle. — Он смотрит на свои перчатки. — Jeder Tag, den ich gebe, ist einer weniger.\n\nЯ уже застрелил одиннадцать. Я считаю. Каждый день, который я даю, — это на одного меньше.', effects: [{ set: '$.c15_at', value: 'why' }, tobias(1)] },
      { id: 'c15_at_believe', label: 'Спросить, верит ли он, что они вернутся', minutes: 5, terminal: true, outcomes: [{ id: 'g', when: give, goto: 'c15_a_go' }, { id: 'x', goto: 'c15_a_grave' }],
        text: '— Nein. — Тобиас отвечает сразу. — Aber Mama hat mir das Fahrradfahren beigebracht. Hier, auf diesem Weg.\n\nНет. Но мама учила меня кататься на велосипеде. Здесь, по этой дороге.', effects: [{ set: '$.c15_at', value: 'believe' }, tobias(1)] },
      { id: 'c15_at_secret', label: 'Пообещать, что в части никто не узнает', minutes: 3, terminal: true, outcomes: [{ id: 'g', when: give, goto: 'c15_a_go' }, { id: 'x', goto: 'c15_a_grave' }],
        text: 'Тобиас коротко кивает.\n\n— Ich weiß, — говорит он. — Sonst hätte ich nichts gesagt.\n\nЗнаю. Иначе бы ничего не сказал.', effects: [{ set: '$.c15_at', value: 'secret' }, tobias(2)] },
    ] }),

  S15({ id: 'c15_b_tobias', for: 'any', chapter: 'ch3', title: 'Планшет и письмо', camp: yard14, ambient: day14,
    text: [
      { text: 'Тобиас отдаёт тебе конверт, мятый, с пятном от кофе.\n\n— Von der Frau aus dem Sammelpunkt. Henrike.\n\nОт женщины из пункта. Хенрике.\n\nПланшет он кладёт на перекладину калитки экраном вверх, пока поправляет ремень автомата. На экране список. Хутора и адреса. Напротив вашего: «Hof Lüdemann — Transporter». Дата вчерашняя. А рядом, мелко, тем же почерком: «16.11 — erledigt (R.)».' },
      { when: soldier14('truth'), text: 'Вчера он сказал: «Напишу „завтра вечером“». Написал другое. Ещё вчера.' },
      { when: not(soldier14('truth')), text: 'Это написано вчера. Заранее.' },
    ],
    actions: [
      { id: 'c15_bt_read', label: 'Прочитать письмо Хенрике сразу', minutes: 6, terminal: true, goto: 'c15_b_nina',
        text: '«Оле повезут в Люнебург. Берут кровь, говорят — такие, как он, нужны. Я еду с ним. Хутор ваш, пока не вернёмся. В подвале картошки на три недели, если не кормить всю округу. Курам воды каждый день. Нину не бросайте. Простите, что всё так. Х.»', effects: [{ set: '$.c15_bt', value: 'read' }, { set: '$.c15_henrike_letter', value: true }] },
      { id: 'c15_bt_r', label: 'Спросить Тобиаса, что значит «R.»', minutes: 4, terminal: true, goto: 'c15_b_nina',
        effects: [{ set: '$.c15_bt', value: 'r' }, { set: '$.c15_henrike_letter', value: true }, tobias(1)],
        outcomes: [
          { id: 'give', when: give, text: 'Тобиас быстро забирает планшет.\n\n— Reimers, — говорит он. — Ich wusste, dass sie kommt. Ich habe es ihr gestern selbst geschrieben.\n\nРаймерс. Я знал, что она придёт. Я сам ей вчера написал.\n\nПисьмо Хенрике ты читаешь потом, на кухне.' },
          { id: 'dead', text: 'Тобиас забирает планшет и долго не отвечает.\n\n— Reimers, — говорит он наконец. — Ich habe es ihr gestern selbst geschrieben. Ich dachte, ihr sagt ja.\n\nРаймерс. Я сам ей вчера написал. Думал, вы скажете «да».\n\nПисьмо Хенрике ты читаешь потом, на кухне.' },
        ] },
      { id: 'c15_bt_nina', label: 'Отдать письмо Нине: пусть прочитает первой', minutes: 6, terminal: true, goto: 'c15_b_nina',
        text: 'Нина читает и протягивает тебе листок. Губы у неё дрожат, но она улыбается.\n\n— «Нину не бросайте», — читает она вслух. — Как будто я щенок.', effects: [{ set: '$.c15_bt', value: 'nina' }, { set: '$.c15_henrike_letter', value: true }, nina(1)] },
    ] }),

  S15({ id: 'c15_b_nina', for: 'any', chapter: 'ch3', title: 'А мне куда', camp: kitchen14,
    text: [
      { when: gate, text: 'Тобиас уводит Нину к навесу. Она стоит у досок одна, минуту. Потом отходит и встаёт к нему спиной. Выстрел. Нина не вздрагивает.\n\nКогда Тобиас уезжает, Нина садится на кухне напротив тебя.' },
      { when: any(give, end), text: 'Тобиас уезжает. Нина садится на кухне напротив тебя.' },
      { text: '— Хенрике вам письмо прислала, — говорит она. — Значит, хутор теперь ваш. А мне куда? У подруги в Винзене мама живая. И свет бывает. Она звала. — Нина вертит в пальцах ключ от фургона. — Или тут. С вами. Если можно.' },
    ],
    actions: [
      { id: 'c15_bn_stay', label: 'Сказать: оставайся с нами', minutes: 4, terminal: true, goto: 'c15_b_cab',
        text: 'Нина кивает, будто ей сказали время. Потом отворачивается к окну и долго трёт глаза.\n\n— Ладно, — говорит она. — Только решите вдвоём. По-честному.', effects: [{ set: '$.c15_bn', value: 'stay' }, nina(2)] },
      { id: 'c15_bn_winsen', label: 'Сказать: у подруги семья и свет, это лучше', minutes: 5, terminal: true, goto: 'c15_b_cab',
        text: '— Там и школа рядом, — говорит Нина. — Если откроют. — Она смотрит на навес. — А папа… — Она не договаривает. — Ладно. Подумайте вдвоём.', effects: [{ set: '$.c15_bn', value: 'winsen' }] },
      { id: 'c15_bn_ask', label: 'Спросить, чего хочет она сама', minutes: 5, terminal: true, goto: 'c15_b_cab',
        text: 'Нина думает долго.\n\n— Я хочу, чтобы меня кто-нибудь ждал, — говорит она. — Всё равно где.', effects: [{ set: '$.c15_bn', value: 'ask' }, nina(1)] },
    ] }),

  S15({ id: 'c15_b_cab', for: 'any', chapter: 'ch3', title: 'Кабина', camp: tense14, ambient: day14,
    text: [
      { when: give, text: 'Нина уходит с {A.ins} в колонию: она хочет увидеть, где теперь папа. Ты остаёшься на хуторе {m:один|одна}. Под навесом распахнутая кабина.' },
      { when: dead, text: 'Нина уходит к яблоне, где {A} копает. Ты остаёшься у фургона. Кабину кто-то должен вымыть.' },
      { text: 'Внутри пахнет кисло и тяжело. Ты надеваешь перчатки. На полу бутылки. На солнцезащитном козырьке, под резинкой, детский рисунок: человечек в шапке и маленький человечек у него на плечах. Подпись печатными буквами: «PAPA + NINA».' },
    ],
    actions: [
      { id: 'c15_bc_wash', label: 'Вымыть кабину и снять рисунок для Нины', minutes: 40, activity: 'moderate', terminal: true, goto: 'c15_b_koehler',
        text: 'Ведро, тряпка, колодезная вода. Руки немеют. Ты моешь, пока запах не уходит. Рисунок кладёшь в файл и оставляешь на кухонном столе, у Нининой кружки.', effects: [{ set: '$.c15_bc', value: 'wash' }, { set: '$.c15_drawing', value: true }, { restUntil: at(16, 9, 50) }] },
      { id: 'c15_bc_drawing', label: 'Только снять рисунок, остальное потом', minutes: 5, terminal: true, goto: 'c15_b_koehler',
        text: 'Рисунок выцвел, края загнулись. На обороте ручкой: «Nina, 6 Jahre». Ты убираешь его во внутренний карман.', effects: [{ set: '$.c15_bc', value: 'drawing' }, { set: '$.c15_drawing', value: true }, { restUntil: at(16, 9, 50) }] },
      { id: 'c15_bc_close', label: 'Закрыть кабину и не трогать', minutes: 3, terminal: true, goto: 'c15_b_koehler',
        text: 'Ты закрываешь дверь. Замок щёлкает. Рисунок остаётся там, на козырьке, где Йенс его повесил.', effects: [{ set: '$.c15_bc', value: 'close' }, { restUntil: at(16, 9, 50) }] },
    ] }),

  S15({ id: 'c15_b_koehler', for: 'any', chapter: 'ch3', title: 'Кёлер с хлебом', camp: yard14, ambient: day14,
    onEnter: [{ set: '$.met.c3_koehler', value: true }],
    text: [
      { text: 'Ближе к десяти к калитке подходит фрау Кёлер. В руке у неё свёрток в полотенце.' },
      { when: give, text: '— Die in meiner Scheune sind weg, — говорит она. — Haben mir ein Glas Honig hingestellt. Und einen Zettel: «Danke für die Scheune».\n\nТе, из моего сарая, ушли. Оставили банку мёда и записку: «Спасибо за сарай».\n\nОна качает головой, не веря.' },
      { when: end, text: '— Ich habe den Schuss gehört, — говорит она. — Heute Nacht. Und da dachte ich: Brot.\n\nЯ слышала выстрел ночью. И подумала: хлеб.' },
      { when: gate, text: '— Ich habe den Schuss gehört, — говорит она. — Heute früh. Und da dachte ich: Brot.\n\nЯ слышала утром выстрел. И подумала: хлеб.' },
      { when: { v: 'A.c14_koehler', op: '==', value: 'with' }, text: '— {A} вчера ходил{pm:|а} со мной к сараю, — говорит она. — Ich hatte Angst. Er nicht. Я боялась. А {pm:он|она} нет.' },
      { when: { v: 'A.c14_koehler', op: '==', value: 'saw' }, text: '— Я вчера рассказала {A.dat} про тачку, — говорит она. — Думала, не поверит.' },
      { text: 'Она разворачивает полотенце. Полбуханки ржаного, ещё тёплого, из её печи.' },
    ],
    actions: [
      { id: 'c15_bk_take', label: 'Взять хлеб и поблагодарить', minutes: 4, terminal: true, goto: 'c15_b_cellar',
        text: '— Für das Mädchen, — говорит Кёлер. — Und für euch. — Она уже поворачивается уходить, потом останавливается. — Wenn ihr Mehl braucht. Ich habe noch.\n\nДля девочки. И для вас. Если нужна мука — у меня ещё есть.', effects: [{ set: '$.c15_bk', value: 'take' }, { give: 'c9_koehler_bread', qty: 1 }, { npc: 'c3_koehler', trust: 1 }] },
      { id: 'c15_bk_tea', label: 'Позвать её на чай', minutes: 20, terminal: true, goto: 'c15_b_cellar',
        text: 'Кёлер пьёт чай на кухне Хенрике, оглядываясь, как в чужом доме. Рассказывает про пекарню. Про тесто, которое надо будить в четыре утра. Хлеб она оставляет на столе.\n\n— Ich komme wieder, — говорит она на прощание. Не спрашивает.\n\nЯ ещё приду.', effects: [{ set: '$.c15_bk', value: 'tea' }, { give: 'c9_koehler_bread', qty: 1 }, { stock: 'c9_koehler_bread', qty: 1, at: 'c3_farm_stock' }, { npc: 'c3_koehler', trust: 2 }] },
      { id: 'c15_bk_ask', label: 'Спросить, знала ли она про колонию у насыпи', minutes: 5, terminal: true, goto: 'c15_b_cellar',
        text: 'Кёлер долго молчит.\n\n— Mein Bruder ist da, — говорит она наконец. — Seit Sonntag. Ich war noch nicht da. Ich kann nicht.\n\nТам мой брат. С воскресенья. Я ещё не ходила. Не могу.\n\nОна отдаёт тебе хлеб и уходит быстро, не оглядываясь.', effects: [{ set: '$.c15_bk', value: 'ask' }, { give: 'c9_koehler_bread', qty: 1 }] },
    ] }),

  S15({ id: 'c15_b_cellar', for: 'any', chapter: 'ch3', title: 'Подвал', camp: kitchen14,
    text: [
      { text: 'Ты спускаешься в подвал с письмом Хенрике в руке. «Картошки на три недели, если не кормить всю округу».\n\nЯщики с картошкой, полмешка лука, банки с огурцами и сливами. На нижней полке коробка с надписью маркером: «Für Nina».' },
      { when: flag('$.c15_henrike_letter'), text: 'Хенрике считала на троих. Не на тех, кто ещё придёт.' },
    ],
    actions: [
      { id: 'c15_bce_count', label: 'Пересчитать всё и записать на двери мелом', minutes: 20, activity: 'light', terminal: true, goto: 'c15_b_bike',
        text: 'Ты считаешь ящики, банки, луковицы. Пишешь мелом на внутренней стороне двери: «Картошка — 6 ящ. Лук — ½ м. Огурцы — 9. Сливы — 7». Почерк выходит похожим на почерк Хенрике. Наверное, так здесь пишут все.', effects: [{ set: '$.c15_bce', value: 'count' }] },
      { id: 'c15_bce_box', label: 'Отнести Нине её коробку', minutes: 6, terminal: true, goto: 'c15_b_bike',
        text: 'В коробке шерстяные носки, шапка, шоколадка и записка: «Damit dir nicht kalt ist. H.» Чтобы тебе не было холодно.\n\nТы ставишь коробку на Нинину кровать. Пусть найдёт сама.', effects: [{ set: '$.c15_bce', value: 'box' }, nina(1)] },
      { id: 'c15_bce_jar', label: 'Взять банку слив к обеду', minutes: 4, terminal: true, goto: 'c15_b_bike',
        text: 'Банка холодная, крышка тугая. Ты ставишь её на стол. Нина любит сливы, ты видел{m:|а} вчера.', effects: [{ set: '$.c15_bce', value: 'jar' }] },
    ] }),

  S15({ id: 'c15_b_bike', for: 'any', chapter: 'ch3', title: 'Велосипед Нины', camp: yard14, ambient: day14,
    text: [{ text: 'У сарая стоит велосипед Нины, на котором она приехала из Винзена. Заднее колесо спущено до обода. Цепь сухая и рыжая. С тех пор как она здесь, на нём никто не ездил.' }],
    actions: [
      { id: 'c15_bb_fix', label: 'Подкачать колесо и смазать цепь', minutes: 25, activity: 'light', terminal: true, goto: 'c15_b_hens',
        text: 'Камера держит. Цепь ты смазываешь подсолнечным маслом из кухни: другого нет. Делаешь круг по двору. Велосипед скрипит, но едет. Хоть в Винзен, хоть до колонии у насыпи.', effects: [{ set: '$.c15_bb', value: 'fix' }, { set: 'w.c15_bike_fixed', value: true }] },
      { id: 'c15_bb_shed', label: 'Закатить его в сарай от сырости', minutes: 5, terminal: true, goto: 'c15_b_hens',
        text: 'Ты закатываешь велосипед в сарай и ставишь рядом с Corsa. Пусть стоит в сухом. Куда ему ехать, решит Нина. Или вы.', effects: [{ set: '$.c15_bb', value: 'shed' }] },
    ] }),

  S15({ id: 'c15_b_hens', for: 'any', chapter: 'ch3', title: 'Хозяйство', camp: yard14, ambient: day14,
    text: [
      { text: 'Хутор требует своего: в доме кончаются дрова, а в колодце ведро примёрзло к цепи.' },
      { when: leo14, text: 'Лео ходит за тобой следом, как утёнок, и носит по одному полену.' },
    ],
    actions: [
      { id: 'c15_bh_wood', label: 'Натаскать дров в дом', minutes: 30, activity: 'moderate', terminal: true, goto: 'c15_noon',
        text: 'Ты носишь охапки, пока у плиты не вырастает стенка. Спина ноет. Хенрике бы сказала, что сложено криво.', effects: [{ set: '$.c15_bh', value: 'wood' }, toNoon] },
      { id: 'c15_bh_well', label: 'Отбить ведро и набрать воды на день', minutes: 25, activity: 'moderate', terminal: true, goto: 'c15_noon',
        text: 'Ты обливаешь цепь горячей водой из чайника, и ведро наконец отходит. Три ведра на кухню. Руки красные, но вода есть.', effects: [{ set: '$.c15_bh', value: 'well' }, toNoon] },
      { id: 'c15_bh_rest', label: 'Посидеть на крыльце на солнце', minutes: 20, activity: 'rest', terminal: true, goto: 'c15_noon',
        text: 'Солнце слабое, но греет. Ты сидишь, закрыв глаза. Впервые за много дней никто ничего от тебя не ждёт. Минут двадцать.', effects: [{ set: '$.c15_bh', value: 'rest' }, { body: 'stress', delta: -2 }, toNoon] },
    ] }),

  // ───────────── Линия A днём: колония ─────────────
  S15({ id: 'c15_a_go', for: 'any', chapter: 'ch3', title: 'Нина хочет увидеть', camp: yard14, ambient: day14,
    text: [{ text: 'Тобиас уезжает. Нина выходит во двор в куртке, с рюкзаком.\n\n— Я хочу посмотреть, где он, — говорит она. — Сейчас. Днём. Пойдёшь со мной?\n\nДо колонии четыре километра по шпалам.' }],
    actions: [
      { id: 'c15_ag_walk', label: 'Пойти с ней пешком по шпалам', minutes: 60, activity: 'moderate', move: true, terminal: true, goto: 'c15_a_garden',
        text: 'Вы идёте по шпалам. Нина считает их вслух, потом сбивается и бросает. На полпути вы проходите будку обходчика. Дверь открыта, внутри пусто. Нина заглядывает и молча идёт дальше.', effects: [{ set: '$.c15_ag', value: 'walk' }, nina(1)] },
      { id: 'c15_ag_wait', label: 'Уговорить подождать до среды, как сказала Уте', minutes: 5, terminal: true, goto: 'c15_a_garden',
        text: '— До среды я не доживу, — говорит Нина серьёзно. И уходит к калитке одна. Ты догоняешь её у насыпи.', effects: [{ set: '$.c15_ag', value: 'wait' }, { wait: 55, activity: 'moderate' }] },
    ] }),

  S15({ id: 'c15_a_garden', for: 'any', chapter: 'ch3', title: 'Колония', location: garden, ambient: day14,
    text: [{ text: 'Садовая колония прямо у насыпи. Ряды домиков с крашеными ставнями, голые яблони, теплица с выбитым стеклом. Таблички с номерами на калитках.\n\nУте выходит навстречу с двумя вёдрами воды. Ставит их и обнимает Нину.\n\nИз-за дверей домиков слышно: шорох, скрип, звон цепи. Где-то тихо стучат. На двери домика номер девять — детский рисунок, велосипед.' }],
    actions: [
      { id: 'c15_aga_water', label: 'Взять у Уте вёдра и помочь разнести воду', minutes: 30, activity: 'moderate', terminal: true, goto: 'c15_a_jens',
        text: 'Уте показывает: ведро ставить у порога, дверь приоткрыть шестом, миску подтолкнуть. Она называет каждого по имени: «Opa Gerd. Frau Lüders. Herr Stamer». Здоровается. Никто не отвечает.\n\nУ девятого домика она задерживается дольше. «Frau Albers. Tobias kommt Mittwoch».', effects: [{ set: '$.c15_aga', value: 'water' }, ute(2)] },
      { id: 'c15_aga_look', label: 'Пройти вдоль домиков и посмотреть', minutes: 15, terminal: true, goto: 'c15_a_jens',
        text: 'Ты идёшь по дорожке. В щель одной двери видно: старик в пижаме сидит на полу, прикованный за щиколотку к ножке кровати. Перед ним миска. Он поворачивает голову на твои шаги. Потом на ворону на крыше.', effects: [{ set: '$.c15_aga', value: 'look' }] },
      { id: 'c15_aga_nina', label: 'Держаться рядом с Ниной', minutes: 10, terminal: true, goto: 'c15_a_jens',
        text: 'Нина идёт по дорожке и читает таблички вслух. Девять. Десять. Одиннадцать. Перед двенадцатой она останавливается и берёт тебя за рукав.', effects: [{ set: '$.c15_aga', value: 'nina' }, nina(1)] },
    ] }),

  S15({ id: 'c15_a_jens', for: 'any', chapter: 'ch3', title: 'Двенадцать', location: garden, ambient: day14,
    text: [{ text: 'Домик двенадцать. Уте открывает ставню, не дверь. Внутри на матрасе сидит Йенс. Цепь от щиколотки к трубе батареи. Рядом миска с водой, полная наполовину. На голове шапка из Нининой сумки, надета криво.\n\nНина прижимается к стеклу. Йенс поворачивает голову на стук её ладони.\n\n— Er hat getrunken, — говорит Уте. — Viel.\n\nОн пил. Много.' }],
    actions: [
      { id: 'c15_aj_stay', label: 'Стоять с Ниной, сколько она захочет', minutes: 20, terminal: true, goto: 'c15_a_greenhouse',
        text: 'Нина стоит у стекла долго. Рассказывает ему что-то по-немецки. Йенс поворачивается то к ней, то к вороне на крыше, то к скрипу ставни. Нина видит. Продолжает говорить.\n\nПотом она поворачивается к тебе.\n\n— Пошли, — говорит она. — Ему тут лучше, чем в яме. Правда же?', effects: [{ set: '$.c15_aj', value: 'stay' }, nina(2), { restUntil: at(16, 10, 50) }] },
      { id: 'c15_aj_hat', label: 'Попросить Уте поправить ему шапку', minutes: 8, terminal: true, goto: 'c15_a_greenhouse',
        text: 'Уте берёт шест, открывает дверь и одним точным движением, концом шеста, поправляет шапку. Йенс дёргается к шесту. Цепь звенит и останавливает его.\n\nНина смеётся сквозь слёзы.\n\n— Он её всегда так носил, — говорит она. — Набекрень. Не надо было поправлять.', effects: [{ set: '$.c15_aj', value: 'hat' }, ute(1), { restUntil: at(16, 10, 50) }] },
      { id: 'c15_aj_ute', label: 'Спросить Уте, что будет, когда кончится вода', minutes: 6, risky: true, terminal: true, goto: 'c15_a_greenhouse',
        text: 'Уте смотрит на тебя поверх Нининой головы.\n\n— Dann trage ich mehr, — говорит она.\n\nТогда буду носить больше.\n\nЯннес у теплицы ставит пустое ведро на землю. Очень аккуратно.', effects: [{ set: '$.c15_aj', value: 'ute' }, ute(-1), jannes(1), { restUntil: at(16, 10, 50) }] },
    ] }),

  S15({ id: 'c15_a_greenhouse', for: 'any', chapter: 'ch3', title: 'Теплица', location: garden, ambient: day14,
    text: [{ text: 'Пока Нина прощается с Уте, Яннес подзывает тебя к теплице. Внутри канистры с водой, мешок собачьего корма, рулон ремней. На верстаке точильный камень.\n\n— Ночью мама плакала, — говорит он. — Первый раз за неделю. Хорошо плакала. Говорит: Нина правильная девочка.' }],
    actions: [
      { id: 'c15_agh_knife', label: 'Спросить про нож, который он носит', minutes: 5, terminal: true, goto: 'c15_a_back',
        text: 'Яннес кладёт ладонь на рукоятку.\n\n— Если кто-то сорвётся с цепи, когда мамы нет рядом, — говорит он. — Я знаю, куда бить. Посмотрел в интернете, пока он был. — Он смотрит на домик номер одиннадцать. — Папа. Одиннадцать. Я каждый день прохожу мимо.', effects: [{ set: '$.c15_agh', value: 'knife' }, jannes(1)] },
      { id: 'c15_agh_help', label: 'Спросить, чем им можно помочь', minutes: 5, terminal: true, goto: 'c15_a_back',
        text: '— Водой. — Яннес отвечает сразу. — Колодец здесь один, на краю колонии. Двадцать вёдер в день. Плюс еда. Кормим собачьим кормом, пока есть. — Он пожимает плечами. — Если будете приходить по средам с Ниной, принесите воды. Больше ничего не надо.', effects: [{ set: '$.c15_agh', value: 'help' }, jannes(1)] },
      { id: 'c15_agh_go', label: 'Сказать, что вам пора', minutes: 2, terminal: true, goto: 'c15_a_back',
        text: 'Яннес кивает и снова берётся за вёдра. У калитки колонии Уте машет вам обеими руками, как с вокзальной платформы.', effects: [{ set: '$.c15_agh', value: 'go' }] },
    ] }),

  S15({ id: 'c15_a_back', for: 'any', chapter: 'ch3', title: 'Обратно по шпалам', location: 'c10_field', ambient: day14,
    text: [{ text: 'Обратно вы идёте молча. Шпалы, гравий, шпалы. У будки обходчика Нина останавливается.\n\n— Я ведь буду туда ходить, — говорит она. — По средам. Это далеко.' }],
    actions: [
      { id: 'c15_ab_with', label: 'Сказать: будем ходить вместе', minutes: 50, activity: 'moderate', move: true, terminal: true, goto: 'c15_noon',
        text: 'Нина кивает. Дальше она идёт рядом, плечом к плечу. У задней калитки она говорит: «По средам», — как будто вы о чём-то договорились.', effects: [{ set: '$.c15_ab', value: 'with' }, nina(2), toNoon] },
      { id: 'c15_ab_car', label: 'Сказать: если будет бензин, можно на машине до переезда', minutes: 50, activity: 'moderate', move: true, terminal: true, goto: 'c15_noon',
        text: '— Если будет, — повторяет Нина. Она знает, сколько стоит каждый литр. Все теперь знают.', effects: [{ set: '$.c15_ab', value: 'car' }, toNoon] },
      { id: 'c15_ab_quiet', label: 'Промолчать', minutes: 50, activity: 'moderate', move: true, terminal: true, goto: 'c15_noon',
        text: 'Нина ждёт ответа. Потом перестаёт ждать. Вы доходите до хутора, и только у калитки она говорит: «Ничего. Сама дойду». Без обиды.', effects: [{ set: '$.c15_ab', value: 'quiet' }, toNoon] },
    ] }),

  // ───────────── Линия A днём: яблоня ─────────────
  S15({ id: 'c15_a_grave', for: 'any', chapter: 'ch3', title: 'Под яблоней', camp: yard14, ambient: day14,
    text: [
      { when: end, text: 'Тобиас уезжает. Ты берёшь в сарае лопату.' },
      { when: gate, text: 'Тобиас делает всё сам. Быстро, один выстрел. Помогает тебе завернуть Йенса в одеяло и уезжает, не попрощавшись. Ты берёшь в сарае лопату.' },
      { when: flag('w.c15_jannes_stayed'), text: 'Яннес уже ждёт у сарая со второй лопатой.' },
      { text: 'Земля промёрзла на ладонь. Дальше мягче.\n\nНина выходит во двор и стоит рядом. Она хочет выбрать место сама.' },
    ],
    actions: [
      { id: 'c15_agr_apple', label: 'Копать под яблоней, где выберет Нина', minutes: 80, activity: 'heavy', terminal: true, goto: 'c15_a_marker',
        text: 'Нина показывает на место под старой яблоней, откуда видно калитку. «Чтобы видел, кто приходит». Ты копаешь. Первые полметра даются тяжело. Потом пот, мозоль на ладони, глина. Нина приносит воды. Сама не уходит.', effects: [{ set: '$.c15_agr', value: 'apple' }, nina(1)] },
      { id: 'c15_agr_field', label: 'Копать у края поля: там земля мягче', minutes: 60, activity: 'heavy', terminal: true, goto: 'c15_a_marker',
        text: 'У края поля земля рыхлая, лопата идёт легко. Нина смотрит и молчит. Потом говорит: «Тут хорошо. Тут поле». Ты не уверен{m:|а}, что она так думает.', effects: [{ set: '$.c15_agr', value: 'field' }] },
      { id: 'c15_agr_nina', label: 'Дать Нине тоже копать', minutes: 80, activity: 'heavy', terminal: true, goto: 'c15_a_marker',
        text: 'Нина берёт лопату. Копает неумело, со злостью, будто земля в чём-то виновата. Через десять минут у неё начинают дрожать руки. Ты не забираешь лопату. Она сама отдаёт.\n\n— Хватит, — говорит она. — Я хотела, чтобы я тоже.', effects: [{ set: '$.c15_agr', value: 'nina' }, nina(2)] },
    ] }),

  S15({ id: 'c15_a_marker', for: 'any', chapter: 'ch3', title: 'Имя', camp: yard14, ambient: day14,
    text: [{ text: 'Свёрток опускают втроём. Земля стучит по одеялу, потом звук становится глуше.\n\nНина стоит над холмиком с доской от окна кабины. Той самой, с мокрым пятном от воронки.\n\n— Надо написать, — говорит она. — Только я не знаю что.' }],
    actions: [
      { id: 'c15_am_name', label: 'Предложить: имя и годы', minutes: 15, terminal: true, goto: 'c15_a_after',
        text: 'Нина выцарапывает гвоздём: JENS. Годы она не знает точно и пишет только последний: 2026. Вбивает доску сама, камнем.', effects: [{ set: '$.c15_am', value: 'name' }] },
      { id: 'c15_am_papa', label: 'Сказать: напиши, как сама хочешь', minutes: 15, terminal: true, goto: 'c15_a_after',
        text: 'Нина думает. Потом выцарапывает гвоздём крупно, печатными буквами: PAPA. И ниже, мельче: «drei Minuten». Три минуты.\n\nТы не спрашиваешь. Ты помнишь про яйца всмятку.', effects: [{ set: '$.c15_am', value: 'papa' }, nina(1)] },
      { id: 'c15_am_later', label: 'Сказать: напишем потом, когда будут слова', minutes: 5, terminal: true, goto: 'c15_a_after',
        text: 'Нина кивает и кладёт доску на холмик. Сверху — камень, чтобы не унесло ветром.\n\n— Потом, — соглашается она.', effects: [{ set: '$.c15_am', value: 'later' }] },
    ] }),

  S15({ id: 'c15_a_after', for: 'any', chapter: 'ch3', title: 'У колодца', camp: yard14, ambient: day14,
    text: [
      { text: 'Ты моешь руки у колодца. Вода ледяная, глина въелась в ладони и под ногти. Мозоль лопнула.' },
      { when: flag('w.c15_jannes_stayed'), text: 'Яннес моет лопаты и уходит через поле, к матери. На прощание поднимает руку, не оборачиваясь.' },
      { text: 'Нина подходит и встаёт рядом.\n\n— Тебе было страшно? — спрашивает она. — Ну, тогда. Или сегодня.' },
    ],
    actions: [
      { id: 'c15_aa_yes', label: 'Сказать правду: да', minutes: 4, terminal: true, goto: 'c15_a_gun2',
        text: 'Нина кивает.\n\n— Хорошо, — говорит она. — Если бы нет, я бы тебя боялась.', effects: [{ set: '$.c15_aa', value: 'yes' }, nina(1)] },
      { id: 'c15_aa_her', label: 'Спросить, было ли страшно ей', minutes: 5, terminal: true, goto: 'c15_a_gun2',
        text: 'Нина думает.\n\n— Страшно было, пока он стучал, — говорит она. — Каждую ночь. А теперь просто… — Она ищет слово и не находит. — Теперь тихо.', effects: [{ set: '$.c15_aa', value: 'her' }, nina(1)] },
      { id: 'c15_aa_hands', label: 'Показать ей ладони с мозолями и ничего не говорить', minutes: 3, terminal: true, goto: 'c15_a_gun2',
        text: 'Нина смотрит на твои ладони. Потом приносит из дома бинт и сама, неумело, заматывает лопнувшую мозоль. Закрепляет узелком, как ребёнок.', effects: [{ set: '$.c15_aa', value: 'hands' }, nina(2)] },
    ] }),

  S15({ id: 'c15_a_gun2', for: 'any', chapter: 'ch3', title: 'Ружьё обратно', camp: house14,
    text: [
      { when: end, text: 'Ружьё Оле стоит в прихожей, прислонённое к стене. В нём остался один патрон.' },
      { when: gate, text: 'Ружьё Оле так и стоит за шкафом. Ночью оно не понадобилось.' },
      { text: 'Хенрике оставила его «для Йенса». Йенса больше нет. А ружьё есть.' },
    ],
    actions: [
      { id: 'c15_ag2_back', label: 'Разрядить и поставить за шкаф, как было', minutes: 5, terminal: true, goto: 'c15_noon',
        text: 'Патрон ты кладёшь обратно в чашку без ручки. Ружьё — за шкаф, в чехол из простыни. Как будто ничего не было.', effects: [{ set: '$.c15_ag2', value: 'back' }, toNoon] },
      { id: 'c15_ag2_hide', label: 'Спрятать на чердаке, чтобы Нина не видела', minutes: 10, terminal: true, goto: 'c15_noon',
        text: 'На чердаке пахнет пылью и яблоками. Ты кладёшь ружьё на балку под самой крышей, патроны в жестяную коробку рядом. Нина сюда не полезет. Наверное.', effects: [{ set: '$.c15_ag2', value: 'hide' }, toNoon] },
      { id: 'c15_ag2_keep', label: 'Оставить заряженным у двери: хутор теперь на вас', minutes: 3, risky: true, terminal: true, goto: 'c15_noon',
        text: 'Ты ставишь ружьё у двери, за вешалкой. Если кто-то придёт ночью, оно будет под рукой. Нина проходит мимо, видит его и ничего не говорит.', effects: [{ set: '$.c15_ag2', value: 'keep' }, toNoon] },
    ] }),

  // ───────────── Полдень ─────────────
  S15({ id: 'c15_noon', for: 'any', chapter: 'ch3', title: 'Полдень', camp: kitchen14,
    text: [
      { text: 'К половине первого вы снова на кухне. На столе ржаной хлеб, ещё тёплый, и чайник. Нина сидит между вами.' },
      { when: flag('B.c15_drawing'), text: 'У Нининой кружки лежит рисунок в прозрачном файле: «PAPA + NINA». Нина держит его обеими руками и смотрит, не говоря ни слова.' },
      { when: leo14, text: 'Лео спит на лавке у печки, укрытый курткой Маркуса.' },
      { text: 'Хутор ваш, пока не вернутся хозяева. Нине нужно где-то жить. А в колонии у насыпи семеро ждут воды, и вы теперь знаете, где это.' },
    ],
    actions: [
      { id: 'c15_no_partner', label: 'Сесть с {partner.ins} и решить', minutes: 5, terminal: true, goto: 'c15_checkpoint',
        effects: [{ set: '$.c15_finished', value: true }, toCp] },
      { id: 'c15_no_nina', label: 'Спросить Нину, что она думает', minutes: 5, terminal: true, goto: 'c15_checkpoint',
        text: '— Я думаю, вы решите, — говорит Нина. — А я послушаю. Я теперь всегда слушаю с лестницы.', effects: [{ set: '$.c15_finished', value: true }, toCp] },
      { id: 'c15_no_tea', label: 'Налить всем чаю', minutes: 5, terminal: true, goto: 'c15_checkpoint',
        text: 'Ты наливаешь чай в три кружки. Нина обнимает свою ладонями и греется.', effects: [{ set: '$.c15_finished', value: true }, toCp] },
    ] }),

  S15({ id: 'c15_checkpoint', for: 'any', chapter: 'ch3', title: 'Парцелла девять', checkpoint: 15, universal: false,
    text: [{ text: 'Где будет жить Нина и что делать с колонией у насыпи, решаете вы вдвоём.' }], actions: [] }),
];
