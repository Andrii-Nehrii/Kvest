// Глава 1 — линия B, Hamburg-Barmbek-Süd. Места (прихожая, лестница, улица, киоск, магазин, аптека,
// вокзал, двор, Новаки, Окафор) работают в обоих участках: текст и действия зависят от времени.
import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { bTail, buy, radioOutcomes, SEG2 } from './common';

const S = (s: Scene) => s;
const PWR = 'w.power.hh';
const merleHome: Cond = { npc: 'merle', at: 'b_flat' };
const nowaksHome: Cond = { npc: 'dariusz', at: 'b_nowak' };
const okaforHome: Cond = { npc: 'okafor', at: 'b_okafor' };
const evening: Cond = { after: at(10, 16, 30) };
const open = (until: number): Cond => ({ before: until });
const tail = bTail;

export const bTownScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────── Прихожая (бывшая заглушка b_tbc — id сохранён ради сохранений) ─────────────
  S({
    id: 'b_tbc', for: 'B', chapter: 'ch1', location: 'b_flat', title: 'Прихожая',
    text: [
      { when: { all: [{ visited: 'b_okafor' }, { not: { visited: 'b_tbc', times: 2 } }, merleHome] },
        text: 'Ты закрываешь дверь на оба замка и стоишь в прихожей, прислушиваясь к площадке. Мерле выглядывает из кухни: «Ну? Кто там был?»' },
      { when: { any: [{ visited: 'b_tbc', times: 2 }, { not: { visited: 'b_okafor' } }] },
        text: 'Прихожая: куртки на крючках, велосипедный шлем на полке, ключи в миске у зеркала.' },
      { when: { not: { flag: '$.door_chained' } }, text: 'На двери — цепочка, которую вы ни разу не накидывали.' },
      { when: { flag: '$.door_chained' }, text: 'Цепочка накинута. Под ручку подставлен стул — смешно, но спокойнее.' },
      { when: { all: [{ flag: '$.okafor_knock2' }, { not: { visited: 'b_okafor_flat' } }, okaforHome] },
        text: 'В дверь стучат — негромко, три раза. «Это Окафор. Простите. Можно вас на минуту?»' },
      { when: evening, text: 'В прихожей темно. Ты не включаешь свет — так лучше слышно лестницу.' },
    ],
    actions: [
      { id: 'tell_merle', label: 'Рассказать Мерле про Окафора', minutes: 5, combinable: true,
        when: { all: [{ visited: 'b_okafor' }, merleHome, { not: { flag: '$.told_merle_okafor' } }] },
        outcomes: [
          { id: 'night', when: { knows: 'f_okafor_night' }, text: 'Мерле слушает, и улыбка у неё сползает. — Кусались. В больнице. Санитара. — Она садится на табуретку прямо в прихожей. — Окей. Окей. Мне нужно… мне нужно что-то сделать руками.', effects: [{ set: '$.told_merle_okafor', value: true }, { npc: 'merle', trust: 3 }] },
          { id: 'blood', text: '— Кровь? Не его? И ты вышла к нему? — Мерле качает головой. — Ты ненормальная. Добрая ненормальная.', effects: [{ set: '$.told_merle_okafor', value: true }, { npc: 'merle', trust: 2 }] },
        ] },
      { id: 'barricade', label: 'Придвинуть к двери комод из прихожей', minutes: 15, activity: 'heavy', combinable: true, repeatable: true,
        when: { all: [SEG2, { not: { flag: '$.barricaded' } }] },
        outcomes: [
          { id: 'merle', when: merleHome, text: 'Вдвоём с Мерле вы толкаете комод по паркету — он визжит, оставляя царапины. Мерле смеётся сквозь слёзы: «Хозяйка нас убьёт». Комод стоит поперёк двери. Отодвинуть его изнутри — минута. Снаружи — не выйдет.',
            effects: [{ set: '$.barricaded', value: true }, { npc: 'merle', trust: 3 }] },
          { id: 'alone', check: { traits: ['strength'], difficulty: 3, uses: ['strength'] }, text: 'Одна ты сдвигаешь комод сантиметр за сантиметром, упираясь спиной. Через четверть часа он стоит у двери. Спина ноет.',
            effects: [{ set: '$.barricaded', value: true }, { body: 'fatigue', delta: 8 }] },
          { id: 'fail', text: 'Комод не двигается. Ты упираешься, тянешь, толкаешь — он только скрипит. Одной не справиться.', effects: [{ body: 'fatigue', delta: 6 }] },
        ] },
      { id: 'chain', label: 'Накинуть цепочку и подпереть дверь стулом', minutes: 2, combinable: true, when: { not: { flag: '$.door_chained' } },
        text: 'Цепочка входит в паз с сухим щелчком. Ты подставляешь под ручку стул спинкой — как в кино. Неизвестно, поможет ли, но руки перестают дрожать.',
        effects: [{ set: '$.door_chained', value: true }] },
      { id: 'okafor_open', label: 'Открыть Окафору', minutes: 1, terminal: true, goto: 'b_okafor_flat',
        when: { all: [{ flag: '$.okafor_knock2' }, { not: { visited: 'b_okafor_flat' } }, okaforHome] } },
      { id: 'room', label: 'Пойти к себе в комнату', minutes: 1, terminal: true, goto: 'b_wake' },
      { id: 'kitchen', label: 'Пойти на кухню', minutes: 1, terminal: true, goto: 'b_kitchen' },
      { id: 'out', label: 'Выйти на лестницу', minutes: 1, terminal: true, goto: 'b_stairs' },
      ...tail(),
    ],
  }),

  // ───────────── Лестница ─────────────
  S({
    id: 'b_stairs', for: 'B', chapter: 'ch1', location: 'b_stairs', title: 'Лестница',
    text: [
      { when: { not: evening }, text: 'Лестница старого дома: истёртые ступени, деревянные перила, лампа на таймере щёлкает и гаснет через минуту. Внизу хлопает входная дверь.' },
      { when: { all: [nowaksHome, { not: evening }] }, text: 'Этажом ниже, из-за двери Новаков, — голоса, детский плач, грохот передвигаемой мебели.' },
      { when: { not: nowaksHome }, text: 'Дверь Новаков этажом ниже приоткрыта. В квартире пусто; на ручке висит забытая детская варежка.' },
      { when: evening, text: 'На лестнице темно: кто-то выкрутил лампу. Снизу тянет сквозняком — входная дверь не закрыта до конца.' },
    ],
    actions: [
      { id: 'nowak', label: 'Спуститься к Новакам', minutes: 1, terminal: true, goto: 'b_nowak', when: nowaksHome },
      { id: 'okafor_knock', label: 'Постучать к Окафору', minutes: 2, combinable: true,
        when: { all: [okaforHome, { before: at(10, 10, 15) }, { not: { visited: 'b_okafor_flat' } }] },
        text: 'Тишина. Потом глухо, из глубины квартиры, — храп. Он спит после смены.' },
      { id: 'okafor_flat', label: 'Постучать к Окафору', minutes: 1, terminal: true, goto: 'b_okafor_flat',
        when: { all: [okaforHome, { after: at(10, 10, 15) }] } },
      { id: 'okafor_gone', label: 'Постучать к Окафору', minutes: 1, combinable: true,
        when: { all: [{ not: okaforHome }, { visited: 'b_okafor_flat' }, { not: { flag: '$.knew_okafor_gone' } }] },
        text: 'Тишина. На двери — записка печатными буквами: «Bin in der Klinik. Katze: Futter unter der Spüle. Danke. E.O.»',
        effects: [{ set: '$.knew_okafor_gone', value: true }] },
      { id: 'street', label: 'Спуститься и выйти на улицу', minutes: 2, terminal: true, goto: 'b_street' },
      { id: 'yard', label: 'Выйти во двор через чёрный ход', minutes: 2, terminal: true, goto: 'b_yard' },
      { id: 'home', label: 'Вернуться в квартиру', minutes: 1, terminal: true, goto: 'b_tbc' },
      ...tail(),
    ],
  }),

  // ───────────── Новаки ─────────────
  S({
    id: 'b_nowak', for: 'B', chapter: 'ch1', location: 'b_nowak', title: 'Новаки',
    text: [
      { when: { not: { visited: 'b_nowak', times: 2 } }, text: 'Дверь открывает Кася — в одной руке телефон, в другой детская куртка. Коридор за её спиной заставлен сумками и коробками. Тим, восьмилетний, сидит на рюкзаке в обнимку с клеткой, в которой шуршит хомяк. Из комнаты — голос Дариуша, по-польски, сердито, в телефон.' },
      { when: { visited: 'b_nowak', times: 2 }, text: 'У Новаков всё больше коробок и всё меньше слов. Дариуш выносит сумки, Кася считает что-то на пальцах, Тим кормит хомяка морковкой.' },
      { when: { after: at(10, 13, 15) }, text: 'Фургон Дариуша уже стоит у подъезда с открытыми дверями. — Через полчаса едем, — говорит Кася, не глядя на часы. — Через полчаса.' },
    ],
    actions: [
      { id: 'ask', label: 'Спросить, куда они собираются', minutes: 6, combinable: true,
        text: '— К родителям Дариуша, под Щецин. Выезжаем в два. По A1, через Ahrensburg, потом на A20. — Кася понижает голос. — Дариуш говорит, в Польше хотя бы не врут по радио. Я не знаю. Я просто хочу, чтобы Тим был подальше отсюда.',
        effects: [{ learn: 'f_nowak_plan' }, { npc: 'kasia', trust: 3 }] },
      { id: 'help', label: 'Помочь им собраться — носить сумки к фургону', minutes: 30, activity: 'moderate', combinable: true,
        when: { not: { flag: '$.helped_nowaks' } },
        text: 'Четыре этажа вниз, четыре вверх. Сумки тяжёлые, коробки неудобные, руки ноют уже на третьей. Дариуш сначала молча забирает у тебя самое тяжёлое, потом молча придерживает дверь. На последней ходке он говорит: «Dziękuję». И по-немецки, отдельно: «Danke. Wirklich.»',
        effects: [{ set: '$.helped_nowaks', value: true }, { npc: 'dariusz', trust: 12, remember: '$:helped_pack' }, { npc: 'kasia', trust: 8 }] },
      { id: 'tim', label: 'Посидеть с Тимом, пока взрослые собираются', minutes: 20, combinable: true,
        when: { not: { flag: '$.sat_with_tim' } },
        text: 'Хомяка зовут Пан Кулька. Тим рассказывает, что хомяки впадают в спячку, если холодно, и что в фургоне холодно, поэтому Пан Кулька поедет у него под курткой. — А ты поедешь с нами? — спрашивает он. Ты не знаешь, что ответить. Кася, проходя мимо, гладит тебя по плечу.',
        effects: [{ set: '$.sat_with_tim', value: true }, { npc: 'kasia', trust: 12, remember: '$:sat_with_tim' }, { body: 'stress', delta: -4 }] },
      { id: 'merle', label: 'Спросить, не возьмут ли они Мерле до Ahrensburg', minutes: 5, combinable: true,
        when: { all: [{ flag: '$.merle_plan_known' }, merleHome, { not: { flag: 'w.nowak_take_merle' } }, { not: { flag: '$.asked_merle_ride' } }] },
        outcomes: [
          { id: 'yes', when: { npc: 'dariusz', trust: ['>=', 12] }, text: 'Дариуш думает секунду. — Ahrensburg — это по пути. Одна сзади, на матрасах. Пусть берёт одну сумку. И в два — чтобы стояла внизу. Ждать не буду.',
            effects: [{ set: 'w.nowak_take_merle', value: true }, { set: '$.asked_merle_ride', value: true }, { learn: 'f_merle_ride' }] },
          { id: 'talked', check: { traits: ['persuasion'], difficulty: 5, mods: [{ when: { npc: 'kasia', trust: ['>=', 10] }, bonus: 2 }] },
            text: 'Дариуш качает головой, но Кася что-то быстро говорит ему по-польски, показывая на тебя. Он вздыхает. — Ладно. Одна. Сзади. В два.',
            effects: [{ set: 'w.nowak_take_merle', value: true }, { set: '$.asked_merle_ride', value: true }, { learn: 'f_merle_ride' }] },
          { id: 'no', text: '— Места нет, — Дариуш кивает на коробки. — Прости. Правда нет.', effects: [{ set: '$.asked_merle_ride', value: true }] },
        ] },
      { id: 'merle2', label: 'Ещё раз спросить про Мерле — теперь, когда помогла', minutes: 3, combinable: true,
        when: { all: [{ flag: '$.asked_merle_ride' }, { flag: '$.helped_nowaks' }, merleHome, { not: { flag: 'w.nowak_take_merle' } }, { not: { flag: '$.asked_merle_ride2' } }] },
        text: 'Дариуш вытирает лоб и смотрит на тебя иначе, чем час назад. — Ладно. Одна сзади, на матрасах. В два. Ждать не буду.',
        effects: [{ set: 'w.nowak_take_merle', value: true }, { set: '$.asked_merle_ride2', value: true }, { learn: 'f_merle_ride' }] },
      { id: 'self', label: 'Спросить, нашлось бы место и для тебя', minutes: 3, combinable: true,
        when: { all: [{ flag: 'w.nowak_take_merle' }, { not: { flag: '$.asked_self_ride' } }] },
        text: '— Ты? — Дариуш оглядывает тебя. — Ты лёгкая. Если с Мерле — влезете обе. До Ahrensburg, дальше — сами.',
        effects: [{ set: '$.asked_self_ride', value: true }, { set: 'w.nowak_take_b', value: true }, { learn: 'f_nowak_ride_b' }] },
      { id: 'pump', label: 'Попросить у Дариуша насос для велосипеда', minutes: 2, combinable: true,
        when: { all: [{ not: { has: 'bike_pump' } }, { not: { flag: '$.bike_ready' } }] },
        text: '— Насос? — Дариуш роется в коробке с инструментами, протягивает тебе старый ручной насос с универсальной головкой. — Бери. Мне уже не нужен.',
        effects: [{ give: 'bike_pump' }, { npc: 'dariusz', trust: 2 }] },
      { id: 'warn', label: 'Рассказать им, что говорил Окафор', minutes: 3, combinable: true,
        when: { all: [{ knows: 'f_okafor_night' }, { not: { flag: '$.warned_nowaks' } }] },
        text: 'Кася бледнеет и машинально притягивает к себе Тима. Дариуш слушает, потом говорит что-то короткое по-польски — ругательство, судя по лицу Каси. — Тем более едем, — говорит он. — Тем более.',
        effects: [{ set: '$.warned_nowaks', value: true }, { npc: 'dariusz', trust: 5 }, { npc: 'kasia', trust: 5 }] },
      { id: 'back', label: 'Подняться обратно', minutes: 1, terminal: true, goto: 'b_stairs' },
    ],
  }),

  // ───────────── Улица ─────────────
  S({
    id: 'b_street', for: 'B', chapter: 'ch1', location: 'b_street', title: 'Улица',
    text: [
      { when: { before: at(10, 9, 40) }, text: 'Улица: мокрый асфальт, листья каштанов, машины бампер к бамперу. Люди идут быстрее обычного — с пакетами, с рюкзаками. На перекрёстке стоит полицейская машина с включённой мигалкой. У киоска на углу — очередь.' },
      { when: { all: [{ after: at(10, 9, 40) }, { before: at(10, 12, 0) }] }, text: 'С севера, низко над крышами, проходит вертолёт. Полицейских машин больше; одна с воем проносится в сторону Rübenkamp — туда, где клиника. Люди на тротуаре останавливаются и смотрят ей вслед.' },
      { when: { all: [{ after: at(10, 12, 0) }, { not: evening }] }, text: 'На улице меньше людей и больше машин — набитых, с сумками на крышах. Кто-то бегает от подъезда к машине с открытым багажником. Киоск торгует через окошко.' },
      { when: evening, text: 'Улица под фонарями пустая. Ставни киоска опущены. Ветер гонит по тротуару пакет; где-то за домами — звон стекла и чей-то смех, громкий и неуместный.' },
    ],
    actions: [
      { id: 'kiosk', label: 'Подойти к киоску на углу', minutes: 2, terminal: true, goto: 'b_kiosk', when: open(at(10, 17, 30)) },
      { id: 'market', label: 'Дойти до супермаркета у Hamburger Straße', minutes: 8, move: true, terminal: true, goto: 'b_market', when: open(at(10, 16, 30)) },
      { id: 'pharmacy', label: 'Дойти до аптеки у вокзала', minutes: 10, move: true, terminal: true, goto: 'b_pharmacy', when: open(at(10, 16, 30)) },
      { id: 'station', label: 'Дойти до вокзала Barmbek', minutes: 10, move: true, terminal: true, goto: 'b_station', when: open(at(10, 16, 30)) },
      { id: 'police', label: 'Спросить полицейских у машины, что происходит', minutes: 4, combinable: true, when: open(at(10, 13, 0)),
        text: '— Gehen Sie nach Hause, junge Frau, — полицейский даже не опускает рацию. — Mehr kann ich Ihnen nicht sagen. — Его напарник смотрит в сторону вокзала и не моргает.',
        effects: [{ learn: 'f_police_home' }] },
      { id: 'look_dark', label: 'Постоять у подъезда, оглядеться', minutes: 4, combinable: true, when: { all: [SEG2, evening] },
        outcomes: [
          { id: 'figure', when: { after: at(10, 17, 30) }, text: 'На другой стороне улицы, у автобусной остановки, кто-то стоит, покачиваясь. Мужчина в одной рубашке, без куртки, под дождём. Он поворачивает голову на звук твоих шагов — медленно, всем корпусом, — и делает шаг к проезжей части. Ты уже за дверью, прежде чем успеваешь подумать.', effects: [{ learn: 'f_turned_seen_b' }, { body: 'stress', delta: 10 }] },
          { id: 'quiet', text: 'Тихо. Окна домов напротив светятся через одно. В одном кто-то стоит и тоже смотрит на улицу — вы встречаетесь взглядами, и он задёргивает штору.' },
        ] },
      { id: 'home', label: 'Вернуться в дом', minutes: 2, terminal: true, goto: 'b_stairs' },
      ...tail(),
    ],
  }),

  // ───────────── Киоск ─────────────
  S({
    id: 'b_kiosk', for: 'B', chapter: 'ch1', location: 'b_kiosk', title: 'Киоск Фарида',
    text: [
      { text: 'Фарид, пожилой хозяин киоска с аккуратной седой бородой, сегодня без своей утренней шутки. Торгует быстро, считает в уме. На окошке скотчем: «Nur Bar». Над его головой бормочет маленький телевизор — бегущая строка, кадры с вертолёта.' },
      { when: { after: at(10, 14, 0) }, text: 'Полки за его спиной наполовину пусты. Воды больше нет.' },
    ],
    actions: [
      buy('water', 'Купить воды — четыре бутылки по 0,5 л', 4, null, [{ give: 'water_05', qty: 4 }], { when: { before: at(10, 14, 0) } }),
      buy('snacks', 'Шоколад и хлебцы', 4, null, [{ give: 'chocolate', qty: 2 }, { give: 'crackers' }]),
      buy('batteries', 'Батарейки и свечи', 6, null, [{ give: 'batteries_aa' }, { give: 'candles' }]),
      buy('headlamp', 'Налобный фонарик — последний, с полки над кассой', 9, null, [{ give: 'headlamp', charge: 100 }], { when: { not: { has: 'headlamp' } } }),
      buy('map', 'Бумажный план города', 5, null, [{ give: 'city_map' }], { when: { not: { hasTag: 'map' } } }),
      { id: 'talk', label: 'Перекинуться парой слов с Фаридом', minutes: 5, combinable: true,
        outcomes: [
          { id: 'late', when: { after: at(10, 9, 40) }, text: '— В клинике на Rübenkamp стреляли, — Фарид протягивает сдачу. — Сосед видел: пациент бросился на охранника. Укусил. Охранник стрелял. — Он качает головой. — Пятьдесят лет живу, такого не было. Иди домой, дочка.', effects: [{ learn: 'f_barmbek_shooting', kind: 'rumor' }] },
          { id: 'early', text: '— Мой племянник — таксист, — Фарид понижает голос. — Ночью возил людей от UKE. Говорит, там больные кусаются. Кусаются, понимаешь? — Он пожимает плечами. — Может, врёт. Он всегда врёт.', effects: [{ learn: 'f_rumor_uke', kind: 'rumor' }] },
        ] },
      { id: 'tv', label: 'Посмотреть новости на его телевизоре', minutes: 5, combinable: true, outcomes: radioOutcomes() },
      { id: 'back', label: 'Отойти от киоска', minutes: 1, terminal: true, goto: 'b_street' },
    ],
  }),

  // ───────────── Супермаркет ─────────────
  S({
    id: 'b_market', for: 'B', chapter: 'ch1', location: 'b_market', title: 'Супермаркет',
    text: [
      { when: { before: at(10, 15, 0) }, text: 'Супермаркет у Hamburger Straße. У входа давка: охранник пускает по пятнадцать человек, очередь змеится по тротуару под дождём. Кто-то держит над головой упаковку туалетной бумаги вместо зонта.' },
      { when: { after: at(10, 15, 0) }, text: 'Супермаркет закрыт: ставни опущены наполовину, на асфальте — раздавленные яйца и пустая тележка на боку.' },
    ],
    actions: [
      { id: 'queue', label: 'Встать в очередь', minutes: 35, activity: 'light', terminal: true, goto: 'b_market_in', risky: true,
        when: { all: [{ before: at(10, 15, 0) }, { not: { visited: 'b_market_in' } }] },
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 2, uses: ['mobility'] }, text: 'Когда охранник открывает двери, очередь рвётся вперёд. Ты успеваешь нырнуть под чей-то локоть и оказываешься внутри — мокрая, но целая.' },
          { id: 'bruise', chance: 0.6, text: 'Двери открываются, и толпа вносит тебя внутрь. Чей-то локоть врезается под рёбра так, что темнеет в глазах. Ты внутри. Дышать больно.', effects: [{ injure: 'bruise', site: 'torso', severity: 1 }] },
          { id: 'sprain', text: 'Двери открываются, толпа рвётся вперёд, кто-то наступает тебе на ногу, ты подворачиваешь лодыжку на пороге и чудом не падаешь. Внутри. Нога ноет.', effects: [{ injure: 'sprain', site: 'feet', severity: 1 }] },
        ] },
      { id: 'back', label: 'Уйти', minutes: 1, terminal: true, goto: 'b_street' },
    ],
  }),
  S({
    id: 'b_market_in', for: 'B', chapter: 'ch1', location: 'b_market', title: 'В магазине',
    text: [{ text: 'Внутри — как в последний день перед Рождеством, только никто не улыбается. Полки с водой почти пусты, у консервов люди хватают что попало. Кассы работают; терминалы думают долго, но карты пропускают.' }],
    actions: [
      buy('water', 'Воды — две бутылки по 1,5 л, последние', 2, PWR, [{ give: 'water_15', qty: 2 }]),
      buy('cans', 'Консервы и макароны', 8, PWR, [{ give: 'canned_tomatoes', qty: 2 }, { give: 'canned_beans', qty: 2 }, { give: 'pasta' }]),
      buy('cooler', 'Термосумку и аккумулятор холода', 6, PWR, [{ give: 'cooler_bag' }], { when: { not: { has: 'cooler_bag' } } }),
      buy('batteries', 'Батарейки и свечи', 6, PWR, [{ give: 'batteries_aa' }, { give: 'candles' }]),
      buy('snacks', 'Шоколад, орехи, хлебцы', 5, PWR, [{ give: 'chocolate', qty: 2 }, { give: 'crackers' }]),
      buy('meds', 'Ибупрофен и пластыри', 6, PWR, [{ give: 'ibuprofen', qty: 10 }, { give: 'plasters' }]),
      { id: 'old_man', label: 'Помочь старику, у которого рассыпались покупки', minutes: 5, combinable: true, when: { not: { flag: '$.helped_old_man' } },
        text: 'Пакет у него лопнул, банки раскатились под ноги толпе. Ты собираешь их на корточках, пока вокруг переступают. Он кладёт тебе в ладонь яблоко — «für die Hilfe» — и долго не отпускает руку.',
        effects: [{ give: 'apple' }, { set: '$.helped_old_man', value: true }, { body: 'stress', delta: -2 }] },
      { id: 'out', label: 'Отстоять очередь в кассу и выйти', minutes: 20, terminal: true, goto: 'b_street',
        text: 'Кассирша не поднимает глаз. Терминал думает, думает — «Zahlung erfolgt». Снаружи дождь кажется почти уютным.' },
    ],
  }),

  // ───────────── Аптека ─────────────
  S({
    id: 'b_pharmacy', for: 'B', chapter: 'ch1', location: 'b_pharmacy', title: 'Аптека',
    text: [
      { when: open(at(10, 16, 30)), text: 'Аптека у вокзала. Очередь до угла; внутри три провизора в масках. На двери от руки: «Bitte nur dringende Fälle — Lieferung heute ausgefallen».' },
      { when: evening, text: 'Аптека закрыта. На стекле — утренний лист и под ним новый: «Kein Insulin, kein Paracetamol mehr».' },
    ],
    actions: [
      { id: 'queue', label: 'Отстоять очередь', minutes: 30, activity: 'light', terminal: true, goto: 'b_pharmacy_in', when: open(at(10, 16, 30)),
        text: 'Полчаса под дождём. Мужчина перед тобой кашляет в рукав, и очередь вокруг него сама собой расступается на шаг.' },
      { id: 'back', label: 'Уйти', minutes: 1, terminal: true, goto: 'b_street' },
    ],
  }),
  S({
    id: 'b_pharmacy_in', for: 'B', chapter: 'ch1', location: 'b_pharmacy', title: 'У прилавка',
    text: [{ text: 'Провизор — женщина лет пятидесяти, на бейдже «Frau Kaya», глаза красные от недосыпа — смотрит на тебя поверх маски. — Was brauchen Sie?' }],
    actions: [
      { id: 'insulin', label: 'Выкупить по карточке Мерле её рецепт на инсулин', minutes: 10, combinable: true,
        when: { all: [{ has: 'health_card' }, { not: { flag: '$.insulin_bought' } }] },
        enabled: { any: [{ has: 'bank_card' }, { has: 'cash_eur', qty: 10 }] }, disabledReason: 'Нужно 10 € доплаты — картой или наличными',
        text: 'Frau Kaya вставляет карточку в считыватель и долго смотрит в экран. — Есть. Одна упаковка, пять ручек. И иглы. — Она уходит в подсобку и возвращается с коробкой. — Больше не дам, даже если попросите. Это из последней поставки. Доплата десять евро.',
        effects: [{ give: 'insulin_pen', qty: 5 }, { give: 'pen_needles' }, { set: '$.insulin_bought', value: true }, { learn: 'f_insulin_got' },
          { if: { has: 'bank_card' }, then: [], else: [{ take: 'cash_eur', qty: 10 }] }] },
      { id: 'no_card', label: 'Спросить про инсулин для соседки — без рецепта', minutes: 3, combinable: true,
        when: { all: [{ knows: 'f_merle_insulin' }, { not: { has: 'health_card' } }, { not: { flag: '$.insulin_bought' } }, { not: { flag: '$.asked_insulin' } }] },
        text: '— Ohne Rezept — nein. — Она смягчается. — У неё электронный рецепт? Тогда принесите её карточку. Рецепт — там.',
        effects: [{ learn: 'f_merle_erezept' }, { set: '$.asked_insulin', value: true }] },
      { id: 'ask', label: 'Спросить, что слышно про больницы', minutes: 4, combinable: true,
        text: '— Утром пришла рассылка: людей с укусами в аптеку не пускать, сразу на сто двенадцать. С укусами! — Frau Kaya качает головой. — Двадцать лет работаю. Что это, по-вашему? Собаки? Это не собаки.',
        effects: [{ learn: 'f_pharmacy_bite' }] },
      buy('pills', 'Парацетамол и ибупрофен', 8, PWR, [{ give: 'paracetamol', qty: 10 }, { give: 'ibuprofen', qty: 6 }]),
      buy('dress', 'Бинты и антисептик', 9, PWR, [{ give: 'bandages' }, { give: 'disinfectant' }]),
      buy('gloves', 'Одноразовые перчатки, упаковка', 4, PWR, [{ give: 'nitrile_gloves', qty: 10 }], { when: { not: { has: 'nitrile_gloves' } } }),
      buy('cooler', 'Термосумку для лекарств', 8, PWR, [{ give: 'cooler_bag' }], { when: { not: { has: 'cooler_bag' } } }),
      { id: 'out', label: 'Поблагодарить и выйти', minutes: 2, terminal: true, goto: 'b_street' },
    ],
  }),

  // ───────────── Вокзал ─────────────
  S({
    id: 'b_station', for: 'B', chapter: 'ch1', location: 'b_station', title: 'Вокзал Barmbek',
    text: [
      { text: 'Вокзал Barmbek: эстакада S-Bahn, вход в U3. У турникетов — двое полицейских в жилетах, один говорит в рацию. На платформе S1 стоит поезд с открытыми дверями, пустой. Табло: «Zugausfall». Люди с чемоданами переминаются, кто-то ругается в телефон.' },
      { when: { after: at(10, 9, 40) }, text: 'Над вокзалом низко кружит вертолёт. Полицейские машины одна за другой уходят по Fuhlsbüttler Straße на север, к Rübenkamp.' },
      { when: { after: at(10, 11, 40) }, text: 'Вход в U-Bahn перекрыт лентой: «Betrieb eingestellt». Поезда больше не ходят — никакие.' },
    ],
    actions: [
      { id: 'police', label: 'Спросить полицию, когда пойдут поезда', minutes: 4, combinable: true,
        text: '— Heute wohl nicht mehr, — полицейский смотрит мимо тебя. — Gehen Sie nach Hause. Bitte.',
        effects: [{ learn: 'f_trains_disrupted' }] },
      { id: 'listen', label: 'Послушать, о чём говорят люди', minutes: 10, combinable: true,
        outcomes: [
          { id: 'late', when: { after: at(10, 9, 40) }, text: '«…в клинике на Rübenkamp стреляли, пациент бросился на охранника…» — «…UKE закрыли, никого не впускают и не выпускают…» — «…мне сестра из Wilhelmsburg пишет: у них на улице лежит человек, и никто не подходит…»', effects: [{ learn: 'f_barmbek_shooting', kind: 'rumor' }, { learn: 'f_rumor_uke', kind: 'rumor' }] },
          { id: 'early', text: '«…на Hauptbahnhof полицейская операция, потому и стоим…» — «…я в Lübeck к матери, а теперь как?..» — «…в UKE, говорят, бешенство…»', effects: [{ learn: 'f_rumor_uke', kind: 'rumor' }, { learn: 'f_trains_disrupted' }] },
        ] },
      { id: 'lady', label: 'Помочь пожилой женщине, которая растерянно смотрит на табло', minutes: 12, combinable: true, when: { not: { flag: '$.helped_lady' } },
        text: 'Ей нужно в Wandsbek, к сестре. Автобус, может, и ходит — вы вместе доходите до остановки и читаете расписание, которое ничего не значит. Она суёт тебе в карман шоколадку и упрямо говорит, что пойдёт пешком. Три километра. Ты смотришь ей вслед.',
        effects: [{ give: 'chocolate' }, { set: '$.helped_lady', value: true }] },
      { id: 'back', label: 'Вернуться домой', minutes: 10, move: true, terminal: true, goto: 'b_street', effects: [{ move: 'b_street' }] },
    ],
  }),

  // ───────────── Двор и велосипед ─────────────
  S({
    id: 'b_yard', for: 'B', chapter: 'ch1', location: 'b_yard', title: 'Задний двор',
    text: [
      { text: 'Задний двор: велопарковка под навесом, мусорные контейнеры, мокрый каштан. Твой велосипед на месте, пристёгнутый к дуге.', when: { not: evening } },
      { text: 'Заднее колесо мягкое, почти спущенное.', when: { all: [{ flag: '$.bike_flat' }, { not: { flag: '$.bike_ready' } }] } },
      { text: 'Шины тугие, цепь чистая. Можно ехать.', when: { flag: '$.bike_ready' } },
      { text: 'Во дворе темно. Свет из окон ложится на мокрую траву квадратами. За контейнерами что-то шуршит — крыса, наверное. Наверное.', when: evening },
    ],
    actions: [
      { id: 'check', label: 'Осмотреть велосипед', minutes: 3, combinable: true, when: { not: { flag: '$.bike_flat' } },
        text: 'Заднее колесо почти спущено — не прокол, просто ниппель травит, как всегда. Насоса у тебя нет. У Дариуша точно есть: он вечно что-то чинит во дворе.',
        effects: [{ set: '$.bike_flat', value: true }, { learn: 'f_bike_flat' }] },
      { id: 'pump', label: 'Накачать колесо', minutes: 6, activity: 'moderate', combinable: true,
        when: { all: [{ has: 'bike_pump' }, { not: { flag: '$.bike_ready' } }] },
        text: 'Насос старый, но честный. Двести качков, перерыв, ещё сто. Колесо твердеет. Ты затягиваешь колпачок ниппеля плоскогубцами из ящика Дариуша — пусть держит.',
        effects: [{ set: '$.bike_ready', value: true }, { set: '$.bike_flat', value: true }, { learn: 'f_bike_ready' }] },
      { id: 'lights', label: 'Поменять батарейки в велосипедных фонарях', minutes: 4, combinable: true,
        when: { all: [{ flag: '$.bike_ready' }, { has: 'batteries_aa' }, { not: { flag: '$.bike_lights' } }] },
        text: 'Передний фонарь светил еле-еле. Теперь — белое пятно на мокром асфальте шагов на двадцать.',
        effects: [{ take: 'batteries_aa' }, { set: '$.bike_lights', value: true }] },
      { id: 'go_anyway', label: 'Всё-таки ехать к {partner.dat} — сейчас', minutes: 2, terminal: true, goto: 'b2_go', risky: true,
        when: { all: [SEG2, { flag: '$.bike_ready' }, { v: 'w.plan_b', op: '==', value: 'wait' }, { not: evening }] },
        effects: [{ set: 'w.plan_b', value: 'to_a' }, { set: '$.went_anyway', value: true }, { set: '$.partner_coming', value: false }] },
      { id: 'home', label: 'Вернуться в дом', minutes: 1, terminal: true, goto: 'b_stairs' },
      ...tail(),
    ],
  }),

  // ───────────── Окафор у себя ─────────────
  S({
    id: 'b_okafor_flat', for: 'B', chapter: 'ch1', location: 'b_okafor', title: 'Окафор',
    onEnter: [{ set: '$.met.okafor', value: true }],
    text: [
      { when: { not: { visited: 'b_okafor_flat', times: 2 } }, text: 'Окафор уже переоделся — серый свитер, мокрые после душа волосы. Глаза красные. — Вы слышали? В нашей клинике… стреляли. — Он держится за косяк. — Мне дозвонился коллега. Двое раненых. Охранник, которого… укусили, и пациент.' },
      { when: { visited: 'b_okafor_flat', times: 2 }, text: 'Окафор открывает не сразу — сначала смотрит в глазок. В квартире пахнет кофе и антисептиком. Рыжий кот трётся о его ноги.' },
    ],
    actions: [
      { id: 'listen', label: 'Выслушать его', minutes: 10, combinable: true, when: { not: { knows: 'f_okafor_colleague' } },
        outcomes: [
          { id: 'secret', when: { npc: 'okafor', trust: ['>=', 15] },
            text: 'Он садится на подлокотник кресла. — Позавчера у нас была… коллега. Её укусил пациент в приёмном — несильно. Перевязали. Через сутки, на смене, она набросилась на врача. Молча. Мы решили — нервный срыв, переутомление. — Он смотрит на свои руки. — Сегодня ночью я видел ещё троих таких. Я в «срыв» больше не верю.',
            effects: [{ learn: 'f_okafor_colleague' }, { npc: 'okafor', trust: 5 }] },
          { id: 'guarded', text: 'Он говорит про смену, про раненых, про то, что «никто ничего не понимает». Но где-то посередине замолкает и переводит разговор на кота. Что-то он не договаривает.',
            effects: [{ npc: 'okafor', trust: 3 }] },
        ] },
      { id: 'stay', label: 'Уговорить его не возвращаться сегодня в клинику', minutes: 6, combinable: true, group: 'okafor_work',
        when: { all: [okaforHome, { not: { flag: '$.okafor_decided' } }] },
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 4, mods: [{ when: { npc: 'okafor', trust: ['>=', 20] }, bonus: 2 }, { when: { knows: 'f_okafor_colleague' }, bonus: 1 }] },
            text: 'Окафор долго молчит. — Вы правы. Если я заболею — я никому не помогу. Если я… — Он не договаривает. — Я останусь. До утра. Потом посмотрим.',
            effects: [{ npc: 'okafor', set: { back_to_work: false }, trust: 6, remember: '$:asked_stay' }, { set: '$.okafor_decided', value: true }, { set: 'w.okafor_stays', value: true }] },
          { id: 'no', text: '— Там мои люди, — тихо говорит Окафор. — Я двадцать два года там. Если я не приду, кто придёт? — Он не спорит. Он просто уже решил.',
            effects: [{ npc: 'okafor', set: { back_to_work: true }, remember: '$:asked_stay' }, { set: '$.okafor_decided', value: true }] },
        ] },
      { id: 'go', label: 'Сказать, что понимаешь, если он вернётся к своим', minutes: 3, combinable: true, group: 'okafor_work',
        when: { all: [okaforHome, { not: { flag: '$.okafor_decided' } }] },
        text: 'Окафор кивает — благодарно, будто ты сняла с него что-то тяжёлое. — В час дня я поеду. Если не вернусь до утра… — он протягивает тебе ключ на кольце с брелоком-рыбкой, — у меня кот. Его зовут Фуфу. Не смейтесь.',
        effects: [{ npc: 'okafor', set: { back_to_work: true }, trust: 5, remember: '$:understood' }, { set: '$.okafor_decided', value: true }, { give: 'okafor_key' }] },
      { id: 'kit', label: 'Разобрать с ним аптечку и научиться обрабатывать раны', minutes: 25, combinable: true,
        when: { all: [SEG2, okaforHome, { not: { flag: '$.okafor_kit' } }] },
        text: 'Окафор раскладывает на столе всё, что принёс с работы за годы: бинты, салфетки, антисептик, пинцет, стерильные полоски. — Сначала — промыть. Долго, много воды. Потом антисептик. Потом закрыть. Перчатки — всегда, — он протягивает тебе пару. — Всегда, слышите? — Часть он отдаёт тебе.',
        effects: [{ set: '$.okafor_kit', value: true }, { give: 'bandages' }, { give: 'disinfectant' }, { give: 'nitrile_gloves', qty: 4 }, { learn: 'f_wound_care' }, { npc: 'okafor', trust: 5 }] },
      { id: 'merle', label: 'Попросить его присмотреть за Мерле, если с ней что-то случится', minutes: 3, combinable: true,
        when: { all: [{ knows: 'f_merle_insulin' }, okaforHome, { not: { flag: '$.okafor_merle' } }] },
        text: '— Диабет первого типа? — Окафор сразу становится другим — собранным, профессиональным. — Если будет слабость, пот, спутанность — сладкое, сразу. Сок, сахар. Если не поможет — стучите. В любое время.',
        effects: [{ set: '$.okafor_merle', value: true }, { npc: 'okafor', trust: 3, set: { watches_merle: true } }, { learn: 'f_hypo_signs' }] },
      { id: 'back', label: 'Вернуться к себе', minutes: 1, terminal: true, goto: 'b_tbc' },
    ],
  }),
].map((s) => [s.id, s]));
