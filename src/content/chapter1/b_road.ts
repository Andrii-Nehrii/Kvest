// Глава 1 — линия B после КТ 1: проводы Новаков и Мерле, ожидание дома и ночной стук в дверь;
// дорога на велосипеде через Старый Эльбский тоннель, порт и Wilhelmsburg — к Harburg и дальше в Buchholz;
// поездка в Ahrensburg. КТ 1 и КТ 2.
import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { bTail, radioAction, seg2Enter } from './common';

const S = (s: Scene) => s;
const tail = bTail;
const planB = (v: string): Cond => ({ v: 'w.plan_b', op: '==', value: v });
const travels: Cond = { any: [planB('to_a'), planB('harburg')] };
const atHome: Cond = { any: [{ at: 'b_flat' }, { at: 'b_stairs' }, { at: 'b_yard' }, { at: 'b_street' }, { at: 'b_nowak' }, { at: 'b_okafor' }, { at: 'b_kiosk' }] };
const merleHome: Cond = { npc: 'merle', at: 'b_flat' };
const merleGoing: Cond = { all: [{ flag: 'w.nowak_take_merle' }, merleHome, { not: { flag: '$.merle_stays' } }] };
const okaforHome: Cond = { npc: 'okafor', at: 'b_okafor' };
const onBike: Cond = { all: [{ flag: '$.bike_ready' }, { not: { flag: '$.bike_lost' } }] };
const cordon: Cond = { flag: 'w.harburg_cordon' };
const rain = { outdoor: true, wet: true };

/** Сколько едет B: на велосипеде или пешком (если велосипед потерян). Усталость и травмы удлиняют путь (move). */
const legMinutes = (bike: number, foot: number): Pick<ActionDef, 'outcomes' | 'minutes' | 'move'> => ({
  minutes: bike, move: true,
  outcomes: [
    { id: 'bike', when: onBike },
    { id: 'foot', effects: [{ wait: foot - bike, activity: 'moderate' }] },
  ],
});

const backToPlace: ActionDef[] = [
  ['b_flat', 'b_tbc'], ['b_stairs', 'b_stairs'], ['b_yard', 'b_yard'], ['b_street', 'b_street'], ['b_nowak', 'b_stairs'], ['b_okafor', 'b_tbc'],
  ['b_kiosk', 'b_kiosk'], ['b_market', 'b_street'], ['b_pharmacy', 'b_street'], ['b_station', 'b_station'],
  // Если КТ 1 случилась поздно — уже после отъезда с Новаками.
  ['b_van', 'b2_van'], ['ahrensburg', 'b2_ahrensburg'],
].map(([loc, scene]) => ({ id: `back_${loc}`, label: 'Вернуться к делам', minutes: 1, terminal: true, goto: scene, when: { all: [{ not: travels }, { at: loc }] } }));

export const bRoadScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────── КТ 1 ─────────────
  S({
    id: 'b_cp1', for: 'B', chapter: 'ch1', checkpoint: 1, title: 'Полдень', universal: false,
    text: [
      { when: { phoneUsable: true }, text: 'Гудки. Ты садишься прямо там, где стоишь, и закрываешь глаза, чтобы слышать только их. Третий. Четвёртый…' },
      { when: { not: { phoneUsable: true } }, text: 'Полдень. Телефон мёртв, и ты не знаешь, что с {partner.ins}. Можно только решить, что делать дальше, — и надеяться, что {pm:он|она} решит так же.' },
    ],
    actions: [],
  }),

  // ───────────── После КТ 1 ─────────────
  S({
    id: 'b2_after_call', for: 'B', chapter: 'ch1', title: 'После звонка',
    onEnter: [...seg2Enter, { if: { v: 'w.plan_a', op: '==', value: 'to_b' }, then: [{ set: '$.partner_coming', value: true }] }],
    text: [
      { when: { all: [planB('wait'), { flag: '$.partner_coming' }] }, text: 'Решено: {partner} едет за тобой. Сорок километров — в обычный день сорок минут. Сегодня — кто знает. Тебе остаётся ждать и быть готовой выйти, как только {pm:он|она} позвонит в дверь.' },
      { when: planB('harburg'), text: 'Решено: Harburg, вокзал, на полпути. Для тебя это — через весь город и через Эльбу, которую перекрыли. Поезда не ходят. Остаётся велосипед.' },
      { when: planB('to_a'), text: 'Решено: ты выбираешься к {partner.dat} в Buchholz. Сорок километров. На велосипеде, под дождём, через Эльбу.' },
      { when: { all: [planB('wait'), { not: { flag: '$.partner_coming' } }] }, text: 'Решено: до утра каждый остаётся у себя. Разумно. Невыносимо.' },
      { when: { all: [merleGoing, { before: at(10, 14, 0) }] }, text: 'Мерле в своей комнате уже складывает рюкзак: в два — Новаки.' },
    ],
    actions: [
      { id: 'go', label: 'Собраться в дорогу', minutes: 1, terminal: true, goto: 'b2_go', when: travels },
      ...backToPlace,
    ],
  }),

  // ───────────── Проводы Новаков ─────────────
  S({
    id: 'b2_farewell', for: 'B', chapter: 'ch1', location: 'b_street', title: 'Проводы', ambient: rain,
    onEnter: [{ set: '$.farewell_seen', value: true }],
    text: [
      { text: 'Фургон у подъезда, задние двери распахнуты. Дариуш втискивает последнюю сумку, Кася держит Тима за руку, Тим прижимает к груди клетку с Паном Кулькой, накрытую шарфом.' },
      { when: merleGoing, text: 'Мерле стоит у фургона с рюкзаком и смотрит на тебя. — Поехали с нами, — говорит она. — Пожалуйста. Мама будет рада. У них дом, печка, погреб. Там тихо.' },
      { when: { all: [{ flag: 'w.nowak_take_merle' }, { flag: '$.merle_stays' }] }, text: 'Мерле стоит рядом с тобой на крыльце, обхватив себя руками. Она остаётся.' },
    ],
    actions: [
      { id: 'insulin', label: 'Отдать Мерле инсулин из аптеки', minutes: 2, combinable: true, when: { all: [merleGoing, { has: 'insulin_pen' }] },
        text: 'Мерле прячет коробку во внутренний карман куртки, застёгивает молнию до горла и долго держит на ней ладонь.',
        effects: [{ take: 'insulin_pen', qty: 5 }, { take: 'pen_needles' }, { npc: 'merle', trust: 20, remember: '$:insulin', set: { insulin_days: 24 } }] },
      { id: 'cooler', label: 'Отдать ей термосумку для инсулина', minutes: 1, combinable: true, when: { all: [merleGoing, { has: 'cooler_bag' }] },
        text: '— Ты лучшая, — говорит Мерле. — Невыносимо правильная, но лучшая.',
        effects: [{ take: 'cooler_bag' }, { npc: 'merle', trust: 5, set: { cooler: true } }] },
      { id: 'persuade', label: 'Уговорить Мерле остаться с тобой', minutes: 5, combinable: true, when: { all: [merleGoing, { not: { flag: '$.tried_merle_stay' } }] },
        outcomes: [
          { id: 'stays', check: { traits: ['persuasion'], difficulty: 5, mods: [{ when: { npc: 'merle', trust: ['>=', 20] }, bonus: 2 }, { when: { flag: '$.partner_coming' }, bonus: 1 }] },
            text: 'Мерле долго смотрит на фургон, на Тима, на тебя. Потом снимает рюкзак. — Ладно. Но если {partner} приедет — вы берёте меня с собой. Куда угодно.',
            effects: [{ set: '$.merle_stays', value: true }, { set: '$.tried_merle_stay', value: true }, { npc: 'merle', trust: 5, remember: '$:asked_stay' }] },
          { id: 'goes', text: '— Не могу, — Мерле мотает головой. — Это мама. Ты бы тоже поехала. — Она обнимает тебя.', effects: [{ set: '$.tried_merle_stay', value: true }] },
        ] },
      { id: 'go_with', label: 'Поехать с ними в Ahrensburg', minutes: 5, terminal: true, goto: 'b2_van', risky: true,
        when: { all: [merleGoing, { flag: 'w.nowak_take_b' }] },
        text: 'Решение занимает секунду, и ты не уверена, что это ты его приняла. Рюкзак — в фургон, ты — следом, на матрасы между коробками. Мерле сжимает твою руку. Двери захлопываются.',
        effects: [{ set: '$.went_ahrensburg', value: true }, { npc: 'merle', moveTo: 'b_van', trust: 15 }, { npc: 'dariusz', moveTo: 'b_van' }, { npc: 'kasia', moveTo: 'b_van' }, { set: 'w.nowaks_gone', value: true }] },
      { id: 'goodbye', label: 'Обнять их и помахать вслед', minutes: 6, terminal: true, goto: 'b_street',
        text: 'Кася целует тебя в обе щёки и суёт в руки буханку хлеба — «у нас всё равно не влезет». Тим машет из окна кабины клеткой. Фургон моргает аварийкой на углу — и исчезает.',
        effects: [{ give: 'bread' }, { npc: 'dariusz', moveTo: 'gone_east' }, { npc: 'kasia', moveTo: 'gone_east' }, { set: 'w.nowaks_gone', value: true },
          { if: merleGoing, then: [{ npc: 'merle', moveTo: 'ahrensburg' }, { set: '$.merle_left', value: true }] }] },
    ],
  }),
  S({
    id: 'b2_van', for: 'B', chapter: 'ch1', location: 'b_van', title: 'В фургоне', ambient: { outdoor: false, tempC: 12 },
    text: [
      { text: 'Сзади темно и пахнет картоном. Через маленькое окошко в перегородке видно затылки Дариуша и Каси и дворники. Фургон ползёт по Wandsbeker Chaussee рывками. Мерле лежит на матрасе рядом и смотрит в потолок.' },
    ],
    actions: [
      { id: 'sms', label: 'Подумать, как сказать {partner.dat}, где ты', minutes: 3, combinable: true,
        text: 'Ты пишешь и стираешь, пишешь и стираешь. Сеть то появляется, то исчезает.' },
      { id: 'merle', label: 'Поговорить с Мерле', minutes: 15, combinable: true,
        text: 'Мерле рассказывает про родительский дом: сад, яблоня, подвал с вареньем, отец, который всё чинит сам. Про то, как в детстве боялась темноты. — Сейчас тоже боюсь, — говорит она. — Но с тобой меньше.',
        effects: [{ npc: 'merle', trust: 6 }, { body: 'stress', delta: -5 }] },
      { id: 'tim', label: 'Посмотреть на Тима и Пана Кульку', minutes: 5, combinable: true,
        text: 'Тим спит, привалившись к матери. Хомяк выбрался из-под шарфа и сидит у него на ладони, умываясь, будто в мире ничего не случилось.' },
      { id: 'ride', label: 'Терпеть дорогу до Ahrensburg', minutes: 150, combinable: true, activity: 'rest', terminal: true, goto: 'b2_ahrensburg',
        text: 'Двадцать километров — два с половиной часа. A1 стоит, Дариуш съезжает на просёлки, ругается, возвращается. Один раз фургон резко тормозит, коробки валятся на вас; снаружи кто-то кричит и бьёт ладонью в борт. Дариуш давит на газ. Когда двери наконец открываются, уже темно.',
        effects: [{ move: 'ahrensburg' }, { npc: 'merle', moveTo: 'ahrensburg' }, { npc: 'dariusz', moveTo: 'gone_east' }, { npc: 'kasia', moveTo: 'gone_east' }] },
    ],
  }),
  S({
    id: 'b2_ahrensburg', for: 'B', chapter: 'ch1', location: 'ahrensburg', title: 'Ahrensburg', safe: true,
    text: [
      { text: 'Дом родителей Мерле — на тихой улице с живыми изгородями: кирпич, белые рамы, свет в окнах. Отец, высокий и молчаливый, выходит к калитке с фонарём, мать — следом, в фартуке, и обнимает Мерле так, будто та вернулась с войны. Потом — тебя, не спрашивая, кто ты.' },
      { text: 'В доме тепло, пахнет супом. Радио на кухне. Работает отопление: в Ahrensburg свет есть.' },
    ],
    actions: [
      { id: 'eat', label: 'Поесть горячего', minutes: 20, combinable: true, when: { not: { flag: '$.ate_ahrensburg' } },
        text: 'Суп с фрикадельками, хлеб, чай с мёдом. Мать Мерле подкладывает тебе ещё, не слушая возражений.',
        effects: [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -25 }, { body: 'stress', delta: -10 }, { set: '$.ate_ahrensburg', value: true }] },
      { id: 'dry', label: 'Высушить вещи у батареи', minutes: 30, combinable: true, activity: 'rest',
        text: 'Кроссовки на батарее, джинсы на стуле. Мать Мерле приносит тебе свой спортивный костюм — на размер больше. Ты не помнишь, когда в последний раз было так хорошо и так страшно одновременно.' },
      radioAction('radio', 'Послушать радио на кухне'),
      { id: 'cp2', label: 'Лечь спать в комнате Мерле', minutes: 5, terminal: true, goto: 'b_cp2', when: { after: at(10, 18, 0) },
        text: 'Мерле засыпает мгновенно. Ты долго лежишь с открытыми глазами, держа телефон на груди.' },
      ...tail(),
    ],
  }),

  // ───────────── Ночной стук ─────────────
  S({
    id: 'b2_svenja', for: 'B', chapter: 'ch1', location: 'b_flat', title: 'Стук в дверь',
    onEnter: [{ set: '$.met.svenja', value: true }, { body: 'stress', delta: 10 }],
    text: [
      { text: 'В глазок: девушка лет двадцати, в домашних штанах и куртке поверх футболки, босиком. Правой рукой она зажимает левое предплечье; между пальцами — кровь, много. Она оглядывается на лестницу вниз. — Bitte. Ich wohne im Vorderhaus, im Erdgeschoss. Svenja. Мой сосед… он с ума сошёл. Он меня укусил. Пожалуйста, откройте.' },
    ],
    actions: [
      { id: 'let_in', label: 'Открыть и впустить её', minutes: 5, terminal: true, goto: 'b_tbc', risky: true,
        text: 'Ты снимаешь цепочку. Свенья вваливается в прихожую и садится на пол. На предплечье — полукруг следов зубов, глубокий, кровь течёт по пальцам на паркет. — Он стоял у меня под дверью час, — говорит она, стуча зубами. — Потом сломал её.',
        effects: [{ npc: 'svenja', moveTo: 'b_flat', status: 'injured', set: { bitten: true }, trust: 30, remember: '$:let_in' }, { set: '$.svenja_done', value: 'let_in' }] },
      { id: 'chain', label: 'Приоткрыть на цепочку и передать ей бинт и воду', minutes: 4, terminal: true, goto: 'b_tbc',
        enabled: { any: [{ hasTag: 'dressing' }, { hasTag: 'cloth' }] }, disabledReason: 'Нечего передать — нет бинта или ткани',
        text: 'Через щель ты передаёшь бинт и бутылку воды. Свенья хватает их и плачет. — Danke. Danke. Куда мне? — Ты не знаешь, что ответить. Она уходит вверх по лестнице — там, на чердаке, говорят, ночуют какие-то студенты.',
        effects: [{ if: { hasTag: 'dressing' }, then: [{ use: 'dressing' }], else: [{ takeTag: 'cloth' }] }, { npc: 'svenja', moveTo: 'b_attic', status: 'injured', set: { bitten: true }, trust: 10 }, { set: '$.svenja_done', value: 'chain' }] },
      { id: 'okafor', label: 'Постучать в стену Окафору — он медбрат', minutes: 6, terminal: true, goto: 'b_tbc', when: okaforHome,
        text: 'Окафор выходит на площадку в перчатках — он, кажется, ждал чего-то такого. Смотрит на руку Свеньи, на её лицо, на тебя. — Я возьму её к себе, — говорит он ровно. — Вы — закройтесь. — Дверь напротив закрывается за ними.',
        effects: [{ npc: 'svenja', moveTo: 'b_okafor', status: 'injured', set: { bitten: true } }, { npc: 'okafor', trust: 5, set: { has_svenja: true } }, { set: '$.svenja_done', value: 'okafor' }] },
      { id: 'refuse', label: 'Не открывать', minutes: 5, terminal: true, goto: 'b_tbc',
        text: 'Ты стоишь, прижав ладонь ко рту, и не открываешь. Свенья стучит ещё, потом просто сидит под дверью и плачет. Потом шаги — вниз. Хлопает дверь подъезда. Через минуту на улице кто-то кричит. Ты не подходишь к окну.',
        effects: [{ npc: 'svenja', moveTo: 'b_street', status: 'injured', set: { bitten: true }, trust: -20, remember: '$:refused' }, { set: '$.svenja_done', value: 'refused' }, { body: 'stress', delta: 10 }] },
    ],
  }),

  // ───────────── В дорогу ─────────────
  S({
    id: 'b2_go', for: 'B', chapter: 'ch1', title: 'Сборы',
    text: [
      { text: 'Велосипед, рюкзак, дождевик. Каждый килограмм — на твоих ногах; каждая лишняя минута — минус минута светлого времени. Закат в половине пятого.' },
      { when: { all: [merleHome, atHome, { not: { flag: '$.merle_bye' } }] }, text: 'Мерле стоит в дверях комнаты и смотрит, как ты собираешься. — Ты с ума сошла, — говорит она. И потом: — Возьми мой шлем.' },
      { when: { not: onBike }, text: 'Велосипед не готов. Без него — только пешком.' },
    ],
    actions: [
      { id: 'pack', label: 'Собрать рюкзак: вода, еда, пауэрбанк, тёплое', minutes: 8, combinable: true, when: atHome,
        text: 'Вода, хлебцы, шоколад, пластыри, пауэрбанк, зарядка, зажигалка. Дождевик — сверху, шапка — в карман. Рюкзак лёгкий. Так и надо.',
        effects: ['backpack', 'water_05', 'water_15', 'crackers', 'chocolate', 'plasters', 'bandages', 'powerbank', 'charger', 'lighter', 'rain_jacket', 'beanie',
          'bank_card', 'cash_eur', 'jeans', 'hoodie', 'sneakers', 'headlamp', 'city_map'].map((pickup) => ({ pickup, place: 'b_flat' })) },
      { id: 'helmet', label: 'Взять шлем Мерле', minutes: 1, combinable: true, when: { all: [merleHome, atHome, { not: { has: 'bike_helmet' } }] },
        text: 'Шлем мятно-зелёный, с наклейкой «Kein Bock». Мерле застёгивает его тебе под подбородком сама.',
        effects: [{ give: 'bike_helmet' }, { npc: 'merle', trust: 3 }] },
      { id: 'merle_bye', label: 'Попрощаться с Мерле', minutes: 5, combinable: true, when: { all: [merleHome, atHome, { not: { flag: '$.merle_bye' } }] },
        outcomes: [
          { id: 'going', when: { all: [merleGoing, { not: { flag: 'w.nowaks_gone' } }] }, text: '— Я в два — с Новаками, — Мерле шмыгает носом. — Встретимся, когда всё кончится. Обещай. — Ты обещаешь.', effects: [{ set: '$.merle_bye', value: true }] },
          { id: 'staying', text: '— Я останусь тут, — Мерле пожимает плечами. — Окафор рядом. Холодильник работает. Всё нормально. — Ничего не нормально, и вы обе это знаете.', effects: [{ set: '$.merle_bye', value: true }] },
        ] },
      { id: 'okafor', label: 'Постучать к Окафору — сказать, что уходишь', minutes: 6, combinable: true, when: { all: [okaforHome, atHome, { not: { flag: '$.okafor_bye' } }] },
        text: '— Через Эльбу? — Окафор думает. — Мосты закрыты. Старый тоннель у Landungsbrücken — пешеходный, его не закрывают никогда. Потом порт, Wilhelmsburg… — Он протягивает тебе пачку перчаток. — Не подходите ни к кому, кто ведёт себя странно. Ни к кому. Даже если просят о помощи. Особенно если просят.',
        effects: [{ set: '$.okafor_bye', value: true }, { learn: 'f_old_tunnel' }, { give: 'nitrile_gloves', qty: 4 }] },
      { id: 'ride', label: 'Вывести велосипед со двора — и в путь', minutes: 3, combinable: true, terminal: true, goto: 'b2_ride', enabled: onBike, disabledReason: 'Велосипед не готов',
        effects: [{ move: 'b_yard' }] },
      { id: 'stay', label: 'Передумать и остаться', minutes: 1, terminal: true, goto: 'b_tbc',
        effects: [{ set: '$.stayed_after_all', value: true }] },
    ],
  }),
  S({
    id: 'b2_ride', for: 'B', chapter: 'ch1', location: 'hh_alster', title: 'Через город', ambient: rain,
    text: [
      { text: 'Hamburger Straße, Mundsburg, вниз к Alster. Город — как воскресенье после конца света: машины стоят у обочин с открытыми дверями, людей мало, все идут быстро и не смотрят друг на друга. На Lombardsbrücke — два полицейских катера на воде и что-то тёмное между ними.' },
      { when: { not: onBike }, text: 'Пешком это всё — вдвое дольше.' },
    ],
    actions: [
      { id: 'on', label: 'Ехать к Landungsbrücken', minutes: 25, terminal: true, goto: 'b2_chain', move: true,
        outcomes: [
          { id: 'foot', when: { not: onBike }, text: 'Пешком через весь центр — почти полтора часа.', effects: [{ wait: 60, activity: 'moderate' }], goto: 'b2_landungsbruecken' },
          { id: 'map', when: { hasTag: 'map' }, text: 'План города в непромокаемом кармане дождевика. Через Neustadt, мимо Michel — и вниз, к воде.' },
          { id: 'phone', when: { network: 'data' }, text: 'Карта в телефоне грузится урывками, но грузится. Ты едешь, поглядывая на экран на каждом светофоре.', effects: [{ charge: 'phone', delta: -3 }] },
          { id: 'lost', text: 'Без карты ты дважды сворачиваешь не туда — в перекрытую улицу у Rathaus, в тупик у Fleet. Полчаса лишних.', effects: [{ wait: 30, activity: 'moderate' }] },
        ] },
      { id: 'back', label: 'Повернуть назад, домой', minutes: 30, move: true, terminal: true, goto: 'b_street', effects: [{ move: 'b_street' }] },
    ],
  }),
  S({
    id: 'b2_chain', for: 'B', chapter: 'ch1', location: 'hh_neustadt', title: 'Цепь', ambient: rain,
    text: [
      { text: 'У Rödingsmarkt цепь со скрежетом слетает, педали проворачиваются впустую, и ты едва не падаешь на мокрую брусчатку. Дождь, пальцы не гнутся от холода.' },
      { when: { not: { flag: '$.chain_fixed' } }, text: 'Через дорогу — велосипедная мастерская с наполовину опущенной решёткой. Внутри горит свет; парень в фартуке смотрит на тебя через стекло.' },
    ],
    actions: [
      { id: 'fix', label: 'Надеть цепь самой', minutes: 12, combinable: true, when: { not: { flag: '$.chain_fixed' } },
        outcomes: [
          { id: 'ok', check: { traits: ['technical', 'agility'], difficulty: 3, uses: ['focus'] }, text: 'Звёздочка, натяжитель, провернуть педаль — цепь со щелчком садится на место. Руки по локоть в смазке, зато едет.',
            effects: [{ set: '$.chain_fixed', value: 'self' }] },
          { id: 'stuck', text: 'Цепь заклинивает между звёздочкой и рамой. Ты тянешь, дёргаешь, ругаешься, полчаса сидишь на корточках под дождём — и наконец вытаскиваешь её. Едет. Пальцы разбиты о зубья.',
            effects: [{ set: '$.chain_fixed', value: 'self' }, { wait: 25, activity: 'light' }, { injure: 'scratch', site: 'hands', severity: 1, bleeding: 0.5 }] },
        ] },
      { id: 'shop', label: 'Постучать в мастерскую через дорогу', minutes: 10, combinable: true, when: { not: { flag: '$.chain_fixed' } },
        outcomes: [
          { id: 'paid', when: { has: 'cash_eur', qty: 10 }, text: 'Парень поднимает решётку ровно настолько, чтобы протащить велосипед. Пять минут — цепь на месте, смазана, натяжение подтянуто. — Zehn Euro? — спрашивает он почти виновато. — Я сам не знаю, зачем ещё открыт. — Отдавая велосипед, он молча прикручивает к рулю свой фонарь: «Нужнее тебе».',
            effects: [{ take: 'cash_eur', qty: 10 }, { set: '$.chain_fixed', value: 'shop' }, { set: '$.bike_lights', value: true }] },
          { id: 'free', text: 'Парень поднимает решётку ровно настолько, чтобы протащить велосипед. Пять минут — цепь на месте, смазана. Денег он не просит. — Куда ты в такую погоду? — Ты отвечаешь. Он молча прикручивает к рулю свой фонарь: «Нужнее тебе».',
            effects: [{ set: '$.chain_fixed', value: 'shop' }, { set: '$.bike_lights', value: true }] },
        ] },
      { id: 'on', label: 'Ехать дальше, к Landungsbrücken', minutes: 12, move: true, terminal: true, goto: 'b2_landungsbruecken', when: { flag: '$.chain_fixed' },
        outcomes: [
          { id: 'lights', when: { flag: '$.bike_lights' }, text: 'Мимо Michel — и вниз, к воде. Фонарь на руле выхватывает из дождя мокрую брусчатку.' },
          { id: 'plain', text: 'Мимо Michel — и вниз, к воде.' },
        ] },
    ],
  }),
  S({
    id: 'b2_landungsbruecken', for: 'B', chapter: 'ch1', location: 'hh_landungsbruecken', title: 'Landungsbrücken', ambient: rain,
    text: [
      { text: 'Landungsbrücken. Понтоны пусты, паромы стоят у причалов с погашенными огнями. Купол Старого Эльбского тоннеля — позеленевшая медь, двери распахнуты. Лифты для машин стоят. На пешеходном лифте — «Außer Betrieb». Вниз — винтовая лестница, двадцать четыре метра.' },
      { when: onBike, text: 'Велосипед придётся нести.' },
    ],
    actions: [
      { id: 'carry', label: 'Снести велосипед по лестнице самой', minutes: 15, activity: 'heavy', terminal: true, goto: 'b2_old_tunnel', when: onBike, risky: true,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'endurance'], difficulty: 3, uses: ['strength'] }, text: 'Ступенька, ступенька, ступенька. Руль бьёт по коленке, педаль — по голени. На середине ты садишься отдохнуть, на дне — тоже. Руки дрожат.' },
          { id: 'slip', text: 'На мокрой ступеньке нога уходит вперёд. Ты падаешь на спину, велосипед — на тебя. Минуту лежишь, глядя в купол. Ничего не сломано. Голень разбита в кровь.', effects: [{ injure: 'cut', site: 'leftLeg', severity: 1 }, { injure: 'bruise', site: 'torso', severity: 1 }] },
        ] },
      { id: 'walk', label: 'Спуститься по лестнице', minutes: 5, terminal: true, goto: 'b2_old_tunnel', when: { not: onBike },
        text: 'Двадцать четыре метра вниз по винтовой лестнице. Внизу — гул вентиляторов и запах сырости.' },
      { id: 'help', label: 'Попросить помочь мужчину в оранжевом жилете', minutes: 10, terminal: true, goto: 'b2_old_tunnel', when: onBike,
        text: 'Докер, судя по жилету, лет пятидесяти. Он молча берёт твой велосипед за раму и спускается, будто несёт сумку с продуктами. Внизу ставит его на колёса. — Через порт — по Hachmannkai, не по главной. И не останавливайся, — говорит он и уходит назад, наверх.',
        effects: [{ learn: 'f_port_route' }] },
    ],
  }),
  S({
    id: 'b2_old_tunnel', for: 'B', chapter: 'ch1', location: 'old_elbtunnel', title: 'Старый Эльбский тоннель', ambient: { outdoor: false, tempC: 11 },
    text: [
      { text: 'Кафельная труба под Эльбой, четыреста с лишним метров. Тусклые лампы, капает с потолка, шаги и шорох шин отдаются эхом. Впереди — несколько человек с сумками, идут на юг, как и ты.' },
      { when: { not: { flag: '$.tunnel_man' } }, text: 'На середине, у стены, сидит мужчина, обхватив колени, и раскачивается. Рядом — пустая бутылка воды.' },
    ],
    actions: [
      { id: 'check', label: 'Спросить, всё ли с ним в порядке', minutes: 5, combinable: true, when: { not: { flag: '$.tunnel_man' } }, risky: true,
        text: 'Он поднимает голову. Глаза блестят от жара, губы сухие. — Mir ist so kalt, — шепчет он. — So kalt. Ich will nur nach Hause. — Он не тянется к тебе. Он просто дрожит.',
        effects: [{ set: '$.tunnel_man', value: 'talked' }] },
      { id: 'give', label: 'Оставить ему воду и таблетку от жара', minutes: 2, combinable: true,
        when: { all: [{ flag: '$.tunnel_man' }, { hasTag: 'painkiller' }, { hasTag: 'drink' }, { not: { flag: '$.tunnel_gave' } }] },
        text: 'Ты ставишь рядом с ним бутылку и кладёшь таблетку на крышку. Он смотрит на тебя так, будто не понимает, зачем. — Danke, — говорит он наконец.',
        effects: [{ takeTag: 'painkiller' }, { takeTag: 'drink' }, { set: '$.tunnel_gave', value: true }] },
      { id: 'pass', label: 'Не останавливаясь, ехать к южному выходу', minutes: 10, activity: 'moderate', terminal: true, goto: 'b2_steinwerder',
        effects: [{ if: { not: { flag: '$.tunnel_man' } }, then: [{ set: '$.tunnel_man', value: 'passed' }] }] },
    ],
  }),
  S({
    id: 'b2_steinwerder', for: 'B', chapter: 'ch1', location: 'steinwerder', title: 'Порт', ambient: rain,
    text: [
      { text: 'Steinwerder. Пустые терминалы, краны над головой — как скелеты динозавров, ряды контейнеров до горизонта. Ветер с Эльбы бьёт в бок, дождь сечёт лицо. Где-то за складами воет сирена, долго, на одной ноте, и никто её не выключает.' },
      { when: { knows: 'f_port_route' }, text: 'Hachmannkai — пустая служебная дорога вдоль воды. Докер был прав: здесь никого.' },
    ],
    actions: [
      { id: 'shelter', label: 'Переждать ливень под навесом склада', minutes: 15, combinable: true, activity: 'rest',
        text: 'Под навесом пахнет мазутом. Ты съедаешь половину шоколадки и смотришь, как вода льётся с крыши сплошной стеной. Где-то в глубине склада что-то лязгает — раз, другой. Ты уезжаешь раньше, чем дождь кончится.' },
      { id: 'on', label: 'Ехать на юг, к Wilhelmsburg', minutes: 12, move: true, terminal: true, goto: 'b2_courier',
        outcomes: [
          { id: 'foot', when: { not: onBike }, effects: [{ wait: 40, activity: 'moderate' }], goto: 'b2_wilhelmsburg' },
          { id: 'bike' },
        ] },
    ],
  }),
  S({
    id: 'b2_courier', for: 'B', chapter: 'ch1', location: 'steinwerder', title: 'Рельсы', ambient: rain,
    onEnter: [{ body: 'stress', delta: 5 }],
    text: [
      { text: 'На Reiherstieg, там, где дорогу пересекают портовые рельсы, на боку лежит грузовой велосипед, заднее колесо ещё медленно вертится. Рядом на асфальте сидит мужчина лет сорока в светоотражающем жилете курьера и прижимает к груди руку. Запястье выгнуто так, как запястья не выгибаются. — Bin auf den Schienen weggerutscht, — говорит он сквозь зубы. — Scheißregen.' },
    ],
    actions: [
      { id: 'splint', label: 'Наложить шину на запястье', minutes: 15, combinable: true, when: { not: { flag: '$.courier_done' } },
        enabled: { any: [{ hasTag: 'dressing' }, { hasTag: 'cloth' }] }, disabledReason: 'Нужен бинт или хоть какая-то ткань',
        outcomes: [
          { id: 'ok', check: { traits: ['medicine'], difficulty: 3, mods: [{ when: { knows: 'f_wound_care' }, bonus: 1 }] },
            text: 'Картонная вставка из его сумки вместо лангеты, бинт поверх — туго, но не до синевы. Он белеет, но не кричит. Когда всё готово, он долго дышит, потом говорит: — Слушай. Я по рации слышал, у нас диспетчер полицию слушает. В полшестого мост на Harburg закроют. Совсем. Успевай. — И отстёгивает от своего руля фонарь: — Бери. Мне сегодня уже не ехать.',
            effects: [{ if: { hasTag: 'dressing' }, then: [{ use: 'dressing' }], else: [{ takeTag: 'cloth' }] }, { set: '$.courier_done', value: 'splint' },
              { set: '$.bike_lights', value: true }, { learn: 'f_bridge_warning' }] },
          { id: 'clumsy', text: 'Ты бинтуешь как умеешь. Он кричит, когда ты задеваешь кость, потом извиняется — за крик. Повязка держится. — Спасибо… Слушай: в полшестого мост на Harburg закроют, я по рации слышал. Не застрянь.',
            effects: [{ if: { hasTag: 'dressing' }, then: [{ use: 'dressing' }], else: [{ takeTag: 'cloth' }] }, { set: '$.courier_done', value: 'splint' },
              { learn: 'f_bridge_warning' }, { body: 'stress', delta: 4 }] },
        ] },
      { id: 'pill', label: 'Дать ему обезболивающее', minutes: 2, combinable: true, when: { all: [{ hasTag: 'painkiller' }, { not: { flag: '$.courier_pill' } }] },
        text: 'Он глотает таблетку без воды и благодарно кивает.',
        effects: [{ takeTag: 'painkiller' }, { set: '$.courier_pill', value: true }] },
      { id: 'call', label: 'Попробовать вызвать ему 112', minutes: 4, combinable: true, when: { all: [{ phoneUsable: true }, { not: { flag: '$.courier_called' } }] },
        outcomes: [
          { id: 'through', when: { network: 'voice' }, text: 'Ты дозваниваешься с третьей попытки. Диспетчер выслушивает и говорит, что машин нет и не будет. «Er soll zu Fuß zur nächsten Wache.» Курьер смеётся, и от смеха ему становится больно.',
            effects: [{ set: '$.courier_called', value: true }, { charge: 'phone', delta: -1 }] },
          { id: 'busy', text: '«Netz besetzt». Ещё раз — то же самое.', effects: [{ set: '$.courier_called', value: true }, { charge: 'phone', delta: -1 }] },
        ] },
      { id: 'on', label: 'Ехать дальше, к Wilhelmsburg', minutes: 12, move: true, terminal: true, goto: 'b2_wilhelmsburg',
        effects: [{ if: { not: { flag: '$.courier_done' } }, then: [{ set: '$.courier_done', value: 'left' }, { body: 'stress', delta: 6 }] }],
        outcomes: [
          { id: 'helped', when: { v: '$.courier_done', op: '==', value: 'splint' }, text: 'Он машет тебе здоровой рукой, пока ты не скрываешься за складами.' },
          { id: 'left', text: 'Ты оглядываешься один раз. Он всё сидит на рельсах, прижимая руку к груди.' },
        ] },
    ],
  }),
  S({
    id: 'b2_wilhelmsburg', for: 'B', chapter: 'ch1', location: 'wilhelmsburg', title: 'Wilhelmsburg', ambient: rain,
    text: [
      { text: 'Wilhelmsburg. Улицы пустые, окна многоэтажек — тёмные. На перекрёстке перевёрнут мусорный бак, витрина булочной разбита. У остановки стоит машина с распахнутыми дверями; сигнализация орёт и орёт, и никто к ней не подходит.' },
      { when: { not: { flag: '$.passed_gang' } }, text: 'Дальше, у въезда на мост к Harburg, на тротуаре — трое парней в капюшонах. Один сидит на капоте. Они смотрят на дорогу. На тебя.' },
      { when: { after: at(10, 16, 30) }, text: 'Темнеет. Фонари здесь не горят.' },
    ],
    actions: [
      { id: 'detour', label: 'Объехать их дворами, тихо', minutes: 1, terminal: true, goto: 'b2_bridge', when: { not: { flag: '$.passed_gang' } },
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'agility'], difficulty: 3, uses: ['mobility', 'focus'] }, text: 'Дворами, между гаражами, по детской площадке, через дыру в заборе. Когда ты снова выезжаешь на дорогу, троица осталась далеко позади и даже не обернулась.',
            effects: [{ set: '$.passed_gang', value: 'sneaked' }, { wait: 20, activity: 'moderate' }] },
          { id: 'seen', text: '— Hey! Schönes Rad! — Тебя заметили. Один уже бежит наперерез.', effects: [{ wait: 10, activity: 'moderate' }], goto: 'b2_robbery' },
        ] },
      { id: 'past', label: 'Проскочить мимо на скорости', minutes: 1, terminal: true, goto: 'b2_bridge', when: { all: [{ not: { flag: '$.passed_gang' } }, onBike] }, risky: true,
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'endurance'], difficulty: 4, uses: ['mobility'] }, text: 'Ты встаёшь на педали. Свист, крик за спиной, кто-то хватает воздух у твоего рюкзака — мимо. Ты не оглядываешься до самого моста.',
            effects: [{ set: '$.passed_gang', value: 'rode' }, { wait: 8, activity: 'heavy' }] },
          { id: 'caught', text: 'Ты разгоняешься — и чья-то рука хватает руль. Велосипед летит в одну сторону, ты — в другую.',
            effects: [{ injure: 'bruise', site: 'leftLeg', severity: 2 }, { injure: 'scratch', site: 'hands', severity: 1, bleeding: 1 }], goto: 'b2_robbery' },
        ] },
      { id: 'talk', label: 'Остановиться и заговорить с ними первой', minutes: 1, terminal: true, goto: 'b2_bridge', when: { not: { flag: '$.passed_gang' } }, risky: true,
        outcomes: [
          { id: 'ok_h', when: planB('harburg'), check: { traits: ['persuasion'], difficulty: 4 }, text: '— Меня парень ждёт у вокзала в Harburg, — говоришь ты. — Мосты закрыты. Как тут лучше проехать? — Парни переглядываются. Тот, что на капоте, смеётся. — Романтика. Через Kornweide и на старый мост. И не стой тут, тут сегодня всякие ходят.',
            effects: [{ set: '$.passed_gang', value: 'talked' }, { wait: 10, activity: 'light' }] },
          { id: 'ok', when: { not: planB('harburg') }, check: { traits: ['persuasion'], difficulty: 4 }, text: '— Мне к парню в Buchholz, — говоришь ты. — Мосты закрыты. Как тут лучше на Harburg? — Парни переглядываются. Тот, что на капоте, смеётся. — Buchholz. Ну ты даёшь. Через Kornweide и на старый мост. И не стой тут, тут сегодня всякие ходят.',
            effects: [{ set: '$.passed_gang', value: 'talked' }, { wait: 10, activity: 'light' }] },
          { id: 'bad', text: 'Ты начинаешь говорить, а они уже обступают тебя с трёх сторон.', goto: 'b2_robbery' },
        ] },
    ],
  }),
  S({
    id: 'b2_robbery', for: 'B', chapter: 'ch1', location: 'wilhelmsburg', title: 'Трое', ambient: rain,
    onEnter: [{ body: 'stress', delta: 15 }, { set: '$.passed_gang', value: 'robbed' }],
    text: [{ text: 'Их трое, они моложе, чем казалось издалека, — лет по семнадцать. Один держит твой велосипед за руль, второй — за багажник. Третий стоит ближе всех. — Rad. Handy. Schnell.' }],
    actions: [
      { id: 'give_bike', label: 'Отдать велосипед', minutes: 3, terminal: true, goto: 'b2_bridge', when: onBike,
        text: 'Ты отступаешь на шаг и поднимаешь руки. Они уходят, не оглядываясь, — один на твоём велосипеде, двое бегом рядом. Ты стоишь под дождём с рюкзаком, и до Harburg — ещё три километра. Пешком.',
        effects: [{ set: '$.bike_lost', value: true }, { set: '$.on_foot', value: true }, { wait: 35, activity: 'moderate' }] },
      { id: 'money', label: 'Предложить деньги вместо велосипеда', minutes: 4, terminal: true, goto: 'b2_bridge', when: { has: 'cash_eur', qty: 10 },
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 4 }, text: 'Ты протягиваешь все наличные. Третий пересчитывает, хмыкает. — Ладно. Катись. — Руль отпускают.',
            effects: [{ take: 'cash_eur', qty: 100 }, { wait: 10, activity: 'moderate' }] },
          { id: 'both', text: 'Деньги забирают. И велосипед — тоже. — Danke schön, — говорит третий, и они смеются.',
            effects: [{ take: 'cash_eur', qty: 100 }, { set: '$.bike_lost', value: true }, { set: '$.on_foot', value: true }, { wait: 35, activity: 'moderate' }] },
        ] },
      { id: 'scream', label: 'Закричать и рвануть велосипед на себя', minutes: 3, terminal: true, goto: 'b2_bridge', risky: true, when: onBike,
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 6, uses: ['strength', 'mobility'] }, text: 'Ты кричишь так, что сама глохнешь, и дёргаешь руль. Тот, что держал, от неожиданности отпускает. Ты уже на седле. Сзади — мат, шаги, потом отстают.',
            effects: [{ wait: 8, activity: 'heavy' }] },
          { id: 'hit', text: 'Тебя бьют — коротко, в лицо, не со всей силы, но тебе хватает. Ты сидишь на асфальте. Велосипеда нет. Телефон — на месте: его, кажется, не заметили.',
            effects: [{ injure: 'bruise', site: 'head', severity: 2 }, { set: '$.bike_lost', value: true }, { set: '$.on_foot', value: true }, { wait: 35, activity: 'moderate' }] },
        ] },
    ],
  }),
  S({
    id: 'b2_bridge', for: 'B', chapter: 'ch1', location: 'wilhelmsburg', title: 'Мост на Harburg', ambient: rain,
    text: [
      { when: { not: cordon }, text: 'Старый мост через Süderelbe — стальные арки, ржавые заклёпки, внизу чёрная вода. На том берегу — Harburg: свет, машины, сирены.' },
      { when: cordon, text: 'Старый мост через Süderelbe перекрыт: две полицейские машины поперёк, люди в шлемах. Громкоговоритель: «Harburg ist abgesperrt. Kehren Sie um.» Перед заграждением — человек двадцать: кричат, просят, показывают паспорта.' },
      { when: { not: onBike }, text: 'Ноги гудят. Пешком всё дольше, чем кажется.' },
    ],
    actions: [
      { id: 'cross', label: 'Перейти на ту сторону', terminal: true, goto: 'b2_harburg', when: { not: cordon }, ...legMinutes(8, 20) },
      { id: 'beg', label: 'Уговорить полицейских пропустить', minutes: 15, combinable: true, when: { all: [cordon, { not: { flag: '$.tried_cordon' } }] },
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 6, mods: [{ when: { injured: 'any' }, bonus: 1 }] }, text: 'Молодой полицейский долго смотрит на тебя — мокрую, с разбитой губой или без, одну. Потом оглядывается на старшего и отодвигает барьер на полметра. — Schnell. Und Sie haben mich nicht gesehen.',
            effects: [{ set: '$.tried_cordon', value: 'passed' }], goto: 'b2_harburg' },
          { id: 'no', text: '— Nein. Keiner kommt durch. — Он даже не смотрит на тебя.', effects: [{ set: '$.tried_cordon', value: 'refused' }] },
        ] },
      { id: 'sneak', label: 'Пройти по нижнему пешеходному ярусу, пока полиция занята толпой', minutes: 20, combinable: true, when: { all: [cordon, { not: { flag: '$.tried_sneak' } }] }, risky: true,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 5, uses: ['focus', 'mobility'] }, text: 'Ты спускаешься по служебной лесенке под пролёт, держась за мокрые перила. Над головой — крики и громкоговоритель. Через пять минут ты на той стороне.',
            effects: [{ set: '$.tried_sneak', value: 'passed' }], goto: 'b2_harburg' },
          { id: 'caught', text: 'Фонарь бьёт в лицо. «Zurück!» Тебя выводят обратно, к толпе, держа за локоть.', effects: [{ set: '$.tried_sneak', value: 'caught' }, { body: 'stress', delta: 6 }] },
        ] },
      { id: 'night', label: 'Искать, где переждать ночь здесь, в Wilhelmsburg', minutes: 20, terminal: true, goto: 'b_cp2', when: cordon,
        text: 'Ты находишь подъезд с выбитым замком, поднимаешься на последний этаж и садишься на ступеньки у чердачной двери. Внизу кто-то ходит. Потом перестаёт.',
        effects: [{ move: 'wilhelmsburg_stairs' }] },
    ],
  }),
  S({
    id: 'b2_harburg', for: 'B', chapter: 'ch1', location: 'harburg', title: 'Harburg', ambient: rain,
    onEnter: [{ set: '$.reached_harburg', value: true }],
    text: [
      { text: 'Harburg. После пустого порта и тёмного Wilhelmsburg здесь почти шумно: машины, полиция, люди с сумками, свет витрин.' },
      { when: cordon, text: 'Громкоговорители повторяют одно и то же: «Bleiben Sie in Ihren Häusern». Улицы перекрыты лентами.' },
      { when: planB('harburg'), text: 'Вокзал — в десяти минутах. Там вы договорились.' },
      { when: planB('to_a'), text: 'До Buchholz — ещё двадцать километров на юг, по Bremer Straße и дальше вдоль трассы.' },
    ],
    actions: [
      { id: 'station', label: 'Ехать к вокзалу — на встречу', minutes: 1, terminal: true, goto: 'b_cp2', when: planB('harburg'),
        effects: [{ wait: 10, activity: 'moderate' }, { move: 'harburg_station' }, { set: 'B.at_hbg', value: true }],
        text: 'Площадь перед вокзалом. Ты останавливаешься, тяжело дыша, и ищешь глазами — машину, фигуру, лицо.' },
      { id: 'south', label: 'Ехать дальше, на юг, к Buchholz', terminal: true, goto: 'b2_b75', when: { not: planB('harburg') }, ...legMinutes(5, 10) },
      { id: 'south2', label: 'Не ждать — ехать дальше, к Buchholz', terminal: true, goto: 'b2_b75', when: planB('harburg'), ...legMinutes(5, 10) },
      { id: 'bakery', label: 'Зайти погреться в булочную, которая ещё работает', minutes: 20, activity: 'rest', combinable: true,
        when: { all: [{ before: at(10, 18, 0) }, { not: { flag: '$.hbg_bakery' } }, { has: 'cash_eur', qty: 4 }] },
        text: 'В булочной тепло и пахнет корицей. Хозяйка, не спрашивая, ставит перед тобой чай и пирожок и берёт четыре евро. Ты держишь чашку обеими руками, пока пальцы снова не начинают слушаться. Часы над прилавком торопятся.',
        effects: [{ set: '$.hbg_bakery', value: true }, { take: 'cash_eur', qty: 4 }, { body: 'thirst', delta: -20 }, { body: 'hunger', delta: -15 }, { body: 'stress', delta: -6 }] },
      { id: 'rest', label: 'Посидеть на скамейке под навесом остановки', minutes: 15, activity: 'rest', combinable: true,
        text: 'Ноги дрожат. Ты пьёшь воду маленькими глотками, глядя на поток машин, которые стоят на юг. Рядом садится старушка с таксой и молча протягивает тебе мятную конфету.' },
      ...tail(),
    ],
  }),
  S({
    id: 'b2_b75', for: 'B', chapter: 'ch1', location: 'b75_road', title: 'Дорога на юг', ambient: rain,
    text: [
      { text: 'Bremer Straße, потом велодорожка вдоль трассы. Справа ползут машины — на юг, всё на юг, — красные огни до горизонта. Слева — поле, тёмное и мокрое. Дождь не кончается.' },
      { when: { daylight: false }, text: 'Темно. Свет фар стоящих машин слепит; велодорожку видно на десять метров вперёд.' },
      { when: { all: [{ daylight: false }, { not: { flag: '$.bike_lights' } }, { not: { has: 'headlamp' } }] }, text: 'Без нормального фонаря ты едешь почти на ощупь.' },
      { when: { v: '$.b75', op: '==', value: 1 }, text: 'Указатель: «Buchholz 9».' },
    ],
    actions: [
      { id: 'ride', label: 'Ехать дальше', minutes: 45, combinable: true, move: true, activity: 'heavy', repeatable: true, when: { v: '$.b75', op: '<', value: 2 },
        effects: [{ add: '$.b75', value: 1 }],
        outcomes: [
          { id: 'foot', when: { not: onBike }, text: 'Шаг, шаг, шаг. Обочина, лужи, фары. Ты считаешь столбики — до ста и заново.', effects: [{ wait: 65, activity: 'heavy' }] },
          { id: 'dark_fall', when: { all: [{ daylight: false }, { not: { flag: '$.bike_lights' } }, { not: { has: 'headlamp' } }, { not: { flag: '$.fell_b75' } }] },
            text: 'Яма в темноте. Переднее колесо уходит вниз, ты летишь через руль на мокрый асфальт. Минуту лежишь. Ладони содраны, колено горит. Велосипед цел. Едешь дальше, медленнее.',
            effects: [{ injure: 'scratch', site: 'hands', severity: 2, bleeding: 1 }, { injure: 'bruise', site: 'leftLeg', severity: 1 }, { set: '$.fell_b75', value: true }, { wait: 5, activity: 'heavy' }] },
          { id: 'bike2', when: { v: '$.b75', op: '>=', value: 1 }, text: 'Последние километры. Ноги горят, колени не гнутся, из-под капюшона течёт за шиворот. Огни Buchholz впереди не приближаются — и вдруг оказываются совсем рядом.' },
          { id: 'bike', text: 'Педали, дождь, педали. Где-то на середине ты перестаёшь чувствовать пальцы на руле.' },
        ] },
      { id: 'ride_offer', label: 'Принять предложение мужчины на пикапе подвезти', minutes: 30, terminal: true, goto: 'b2_arrive_a',
        when: { all: [{ v: '$.b75', op: '>=', value: 1 }, { not: { flag: '$.refused_pickup' } }] }, risky: true,
        text: 'Пикап свернул на обочину рядом с тобой, водитель опустил стекло: «Nach Buchholz? Steig ein, ich fahr eh hin». Пожилой, в кепке, на приборной панели — фото внуков.',
        outcomes: [
          { id: 'bike', when: onBike, text: 'Велосипед — в кузов. Он едет по обочине мимо пробки и рассказывает про своих кур. Высаживает тебя у вокзала Buchholz и уезжает, не взяв денег.' },
          { id: 'foot', text: 'Ты забираешься в тёплую кабину. Он едет по обочине мимо пробки и рассказывает про своих кур. Высаживает тебя у вокзала Buchholz и уезжает, не взяв денег.' },
        ],
        effects: [{ move: 'a_street' }] },
      { id: 'refuse_offer', label: 'Отказаться от предложения подвезти', minutes: 1, combinable: true,
        when: { all: [{ v: '$.b75', op: '>=', value: 1 }, { not: { flag: '$.refused_pickup' } }] },
        text: 'Ты мотаешь головой. Водитель пожимает плечами и уезжает по обочине. Может, зря.',
        effects: [{ set: '$.refused_pickup', value: true }] },
      { id: 'arrive', label: 'Въехать в Buchholz', minutes: 10, terminal: true, goto: 'b2_arrive_a', when: { v: '$.b75', op: '>=', value: 2 },
        effects: [{ move: 'a_street' }] },
      { id: 'stop', label: 'Сил больше нет — переждать ночь в автобусной будке', minutes: 10, terminal: true, goto: 'b_cp2', when: { after: at(10, 19, 0) },
        text: 'Стеклянная будка остановки, скамейка, мусорка. Ты сворачиваешься на скамейке, обняв рюкзак.',
        effects: [{ move: 'b75_road' }] },
    ],
  }),
  S({
    id: 'b2_arrive_a', for: 'B', chapter: 'ch1', location: 'a_street', title: 'Buchholz', ambient: rain,
    onEnter: [{ set: '$.reached_buchholz', value: true }],
    text: [
      { text: 'Buchholz. Его улица — ты была здесь сто раз и ни разу в такой темноте. Дом из красного кирпича, двор, мусорные баки. Окна второго этажа — тёмные. Или тебе так кажется.' },
      { when: { flag: 'w.power_off_again' }, text: 'Фонари не горят. Во всём квартале — ни огонька, только свечи кое-где в окнах.' },
    ],
    actions: [
      { id: 'door', label: 'Подойти к двери и позвонить', minutes: 2, terminal: true, goto: 'b_cp2',
        effects: [{ set: 'B.at_a_door', value: true }] },
    ],
  }),

  // ───────────── КТ 2 ─────────────
  S({
    id: 'b_cp2', for: 'B', chapter: 'ch1', checkpoint: 2, title: 'Ночь', universal: false,
    // Ожидание партнёра (сведение часов) — под крышей: у двери, под навесом подъезда, а не под дождём.
    ambient: { outdoor: false, wet: false },
    text: [
      { when: { at: 'a_street' }, text: 'Ты жмёшь кнопку звонка. Ещё раз. И стучишь — кулаком, по-настоящему.' },
      { when: { at: 'harburg_station' }, text: 'Ты стоишь у вокзала Harburg и вглядываешься в каждую машину.' },
      { when: { any: [{ at: 'b_flat' }, { at: 'b_stairs' }, { at: 'b_yard' }, { at: 'b_street' }] }, text: 'Ночь в Barmbek. Ты сидишь в темноте, прислушиваясь к лестнице, к улице, к собственному телефону.' },
      { when: { at: 'ahrensburg' }, text: 'Ночь в Ahrensburg. За окном — сад и тишина, такая плотная, что слышно, как капает с яблони.' },
      { when: { at: 'wilhelmsburg_stairs' }, text: 'Ночь на чужой лестнице в Wilhelmsburg. Ты не спишь. Ты считаешь шаги внизу.' },
      { when: { at: 'b75_road' }, text: 'Ночь на остановке у трассы. Машины стоят и светят фарами в дождь.' },
      { when: { not: { any: ['a_street', 'harburg_station', 'b_flat', 'b_stairs', 'b_yard', 'b_street', 'ahrensburg', 'wilhelmsburg_stairs', 'b75_road'].map((l) => ({ at: l })) } },
        text: 'Ночь застаёт тебя не дома. Ты находишь угол, где тебя не видно с улицы, и ждёшь утра, прислушиваясь к каждому звуку и к собственному телефону.' },
    ],
    actions: [],
  }),
  S({
    id: 'b_ch2', for: 'B', chapter: 'ch2', title: 'Продолжение следует', universal: false,
    text: [{ text: 'Здесь заканчивается первая часть истории — первые сутки. Продолжение (дни 2–4: где жить, чем жить, кому верить) — в следующих главах. Всё, что ты успела, сохранено.' }],
    actions: [],
  }),
].map((s) => [s.id, s]));
