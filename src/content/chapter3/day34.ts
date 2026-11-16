import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { brothersCome, eldersCome, okaforComes, oleHome33 } from './point33';
import { S34, frost34, ilse34, jest34, lea34, set34, until34, w34 } from './point34';

// Участок 34: отдельные сцены линий. A — машина с Тобиасом (если её ещё не вернули) или день с братьями; ответ Томасу Брокману.
// B — день со стариками, Окафором и Леей.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S34({ ...scene, for: 'any', chapter: 'ch3' });
const jestCamp = { at: jest34, stock: 'c3_farm_stock', rest: false as const };
const gerd = (x: string) => v('w.c32_gerd', x);

export const day34Scenes: Scene[] = [
  X({ id: 'c34_a_car', title: 'Последний раз с Тобиасом', camp: yard14, ambient: frost34,
    text: [
      { text: 'Ты садишься в «Вольф» рядом с Тобиасом. Он ведёт медленно, хотя дорога пустая. Молчит до самого Йестебурга.' },
      { text: 'У пожарной части он глушит мотор и не выходит.\n\n— Ich hab gefragt, ob ich bleiben kann. Sie sagen nein. Montag kommt jemand Neues. Von oben.\n\nЯ спрашивал, можно ли остаться. Говорят — нет. В понедельник приедет кто-то новый. Сверху.' },
    ],
    actions: [
      { id: 'c34_ac_who', label: 'Спросить, кто', minutes: 30, terminal: true, goto: 'c34_a_drive',
        text: '— Weiß ich nicht. Einer mit einer Liste. — Тобиас смотрит на свои руки на руле. — Die Liste ist das Problem. Nicht er.\n\nНе знаю. Кто-то со списком. Список — вот проблема. Не он.', effects: [set34('ac', 'who'), w34('heard_new', true), { move: jest34 }, until34(35, 14, 45)] },
      { id: 'c34_ac_hand', label: 'Пожать ему руку и не спрашивать', minutes: 30, terminal: true, goto: 'c34_a_drive',
        text: 'Ты протягиваешь руку. Тобиас жмёт её крепко, долго, и наконец улыбается.', effects: [set34('ac', 'hand'), npc('c15_tobias', 1), { move: jest34 }, until34(35, 14, 45)] },
    ] }),

  X({ id: 'c34_a_drive', title: 'Ключи', location: jest34, camp: jestCamp, ambient: { tempC: 8, outdoor: false, wet: false },
    text: [{ text: 'Ключи с брелоком аптеки висят на гвозде в караулке. Тобиас снимает их сам и кладёт тебе в ладонь. В бак из канистры дружины доливают три литра.' }],
    actions: [
      { id: 'c34_ad_drive', label: 'Ехать домой', minutes: 30, terminal: true, goto: 'c34_a_tea',
        text: 'Corsa заводится со второго раза. В зеркале Тобиас стоит у ворот пожарной части и не уходит, пока ты не сворачиваешь.', effects: [set34('ad', 'drive'), { give: 'car_keys' }, { refuel: 'opel_corsa', liters: 3 }, { drive: 'opel_corsa', km: 4, to: 'hof_luedemann' }, w34('car_back', true), until34(35, 15, 30)] },
    ] }),

  X({ id: 'c34_a_after', title: 'После обеда', camp: yard14, ambient: frost34,
    text: [
      { text: 'Короткий день. До сумерек часа три.' },
      { when: brothersCome, text: 'Дениз зовёт тебя посмотреть трактор Хенрике: у него что-то стучит в моторе, и он хочет, чтобы ты {m:держал|держала} фонарь и {m:учился|училась}.' },
      { when: oleHome33, text: 'Оле сидит на крыльце в тулупе и смотрит на поле. Хенрике разрешила ему полчаса.' },
    ],
    actions: [
      { id: 'c34_aa_tractor', label: 'Держать фонарь и учиться у Дениза', when: brothersCome, minutes: 110, terminal: true, goto: 'c34_a_tea',
        text: 'Дениз разбирает, показывает, называет. Свечи, форсунки, ремень. «Das hier musst du hören, nicht sehen». Это надо слышать, а не видеть. К сумеркам стук пропадает.', effects: [set34('aa', 'tractor'), set34('learned_engine', true), npc('deniz', 1), until34(35, 16, 20)] },
      { id: 'c34_aa_ole', label: 'Посидеть с Оле на крыльце', when: oleHome33, minutes: 110, terminal: true, goto: 'c34_a_tea', ambientDuring: frost34,
        text: 'Оле рассказывает про поле: где весной сажать картошку, где рожь, где низина и вода стоит до мая. Как будто передаёт. Ты слушаешь и запоминаешь.', effects: [set34('aa', 'ole'), npc('ole', 2, 'c34_told_field'), until34(35, 16, 20)] },
      { id: 'c34_aa_rest', label: 'Лечь поспать: неделя была длинная', minutes: 110, terminal: true, goto: 'c34_a_tea',
        text: 'Ты спишь днём, глубоко, как в детстве после бассейна.', effects: [set34('aa', 'rest'), { body: 'fatigue', delta: -15 }, until34(35, 16, 20, true)] },
    ] }),

  X({ id: 'c34_b_after', title: 'После обеда', camp: yard14, ambient: frost34,
    text: [
      { text: 'Короткий день. До сумерек часа три.' },
      { when: okaforComes, text: 'Окафор пришёл из колонии со своей сумкой: перевязать Петерсену ногу, посмотреть Оле. Он спрашивает, не поможешь ли.' },
      { when: lea34, text: 'Лея сидит в сенях и чистит сапоги, хотя они чистые.' },
      { when: eldersCome, text: 'Фрау Кёрнер просит помочь ей написать письмо. Кому — не говорит.' },
      { when: eldersCome, text: 'Фрау Кёрнер сидит у печи с листом бумаги на коленях и карандашом в руке. Карандаш не двигается. Очки сползли на кончик носа.' },
    ],
    actions: [
      { id: 'c34_ba_okafor', label: 'Пойти с Окафором', when: okaforComes, minutes: 110, terminal: true, goto: 'c34_b_gifts',
        text: 'Нога у Петерсена отёкшая, синяя у щиколотки. Окафор бинтует и учит тебя, как. Потом показывает, как считать дыхание у спящего. «Wenn ich am Zehnten gehe, muss es hier jemand können». Если десятого я уйду, здесь кто-то должен уметь.', effects: [set34('ba', 'okafor'), set34('learned_care', true), npc('okafor', 2), until34(35, 16, 20)] },
      { id: 'c34_ba_lea', label: 'Сесть рядом с Леей', when: lea34, minutes: 110, terminal: true, goto: 'c34_b_gifts',
        text: 'Лея рассказывает про мать и Финна, про их квартиру в Линдене, про собаку, которую они взяли из приюта прямо перед всем этим. Потом замолкает. Потом говорит: «Danke fürs Zuhören». Спасибо, что слушаешь.', effects: [set34('ba', 'lea'), npc('c21_lea', 2, 'c34_listened'), until34(35, 16, 20)] },
      { id: 'c34_ba_letter', label: 'Помочь фрау Кёрнер с письмом', when: eldersCome, minutes: 110, terminal: true, goto: 'c34_b_gifts',
        text: 'Она диктует медленно. Письмо мужу, который умер в две тысячи девятом. Про хутор, про снег, про то, что её взяли. В конце просит написать: «Ich komme bald». Я скоро. Ты пишешь. Она складывает письмо и кладёт под подушку.', effects: [set34('ba', 'letter'), until34(35, 16, 20)] },
      { id: 'c34_ba_rest', label: 'Лечь поспать: неделя была длинная', minutes: 110, terminal: true, goto: 'c34_b_gifts',
        text: 'Ты спишь днём, глубоко и без снов.', effects: [set34('ba', 'rest'), { body: 'fatigue', delta: -15 }, until34(35, 16, 20, true)] },
    ] }),

  X({ id: 'c34_a_thomas', title: 'Ответ в Торонто', location: jest34, camp: jestCamp, ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'Женщина у стола ждёт с карандашом над бланком. «An: Thomas Brockmann, Toronto».' },
      { when: any(ilse34('kept'), ilse34('ended')), text: 'Ильзе ты видел{m:|а} в ноябре у задней калитки хутора. Обращённой. Её камертон лежит у вас на столе.' },
      { when: gerd('ended'), text: 'Герда ты сам{m:|а} оставил{m:|а} на площадке своего подъезда, под курткой Керема.' },
      { when: any(gerd('locked'), gerd('left')), text: 'Герд всё ещё стоит на лестнице своего подъезда в Бухгольце.' },
      { when: all(not(flag('w.c32_gerd')), flag('w.c20_gerd_written')), text: 'Против фамилии Герда в люнебургском списке стоит «vermisst» и твоя приписка: «Treppenhaus. Erkrankt».' },
      { when: flag('A.left_ilse'), text: 'Утром десятого Ильзе ждала тебя на лестнице.' },
    ],
    actions: [
      { id: 'c34_at_truth', label: 'Продиктовать правду', minutes: 30, terminal: true, goto: 'c34_a_market',
        text: 'Ты диктуешь медленно, по-немецки, как можешь. Что Герда укусили в порту. Что Ильзе была с ним до конца. Что оба заболели. Что их больше нет. Женщина пишет, не поднимая головы. В конце спрашивает, как подписать. Ты называешь своё имя и: «Nachbar». Сосед.', effects: [set34('at', 'truth'), w34('thomas', 'truth'), until34(36, 12, 30)] },
      { id: 'c34_at_gentle', label: 'Продиктовать мягко: умерли, без мучений, вместе', minutes: 30, terminal: true, goto: 'c34_a_market',
        text: '«Ihre Eltern sind gestorben. Zusammen. Sie haben nicht gelitten». Ваши родители умерли. Вместе. Они не мучились. Это неправда. Почти всё. Женщина пишет и не смотрит на тебя. Она пишет такое каждый день.', effects: [set34('at', 'gentle'), w34('thomas', 'gentle'), until34(36, 12, 30)] },
      { id: 'c34_at_none', label: 'Не отвечать', minutes: 15, terminal: true, goto: 'c34_a_market',
        text: 'Ты отходишь от стола. Женщина откладывает бланк в стопку. Такие стопки у неё тоже бывают.', effects: [set34('at', 'none'), w34('thomas', 'none'), until34(36, 12, 15)] },
    ] }),
];
