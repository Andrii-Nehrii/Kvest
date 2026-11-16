import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { ninaFarm, v } from './point18';
import { npc } from './point19';
import { S29, day29, frost29, jest29, set29, until29, w29 } from './point29';

// Участок 29, дополнение (проверка объёма 15.11). Суббота: A — Керем приходит за долгом или с обменом; B — в пункте просьбы Эриха
// и мальчика (отклик — списки 34-й) или подвал с Хенрике. Воскресенье после обеда: A — Уве зовёт в цепь (верёвка к 30-й);
// B — матери из церкви составляют список пропавших детей.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S29({ ...scene, for: 'any', chapter: 'ch3' });
const debt: Cond = flag('w.c22_fuel_debt');
const kerem: Cond = { npc: 'kerem', alive: true };
const child26: Cond = flag('w.c26_child');
const potatoes: Cond = { stocked: 'potatoes', qty: 10, at: 'c3_farm_stock' };

export const day29EScenes: Scene[] = [
  X({ id: 'c29_a_kerem', title: 'Керем', camp: yard14, ambient: day29, onEnter: [until29(28, 15, 30)],
    text: [
      { when: kerem, text: 'В половине четвёртого у ворот тарахтит мопед. Керем, без шлема, в ушанке, с пустой канистрой на багажнике.' },
      { when: all(kerem, debt), text: '— Die Kanister, — говорит он и улыбается виновато. — Deniz fragt jeden Tag. Fünf Liter. Ich hab gesagt, ihr seid gute Leute. Jetzt muss ich es beweisen.\n\nКанистра. Дениз спрашивает каждый день. Пять литров. Я сказал, что вы хорошие люди. Теперь мне надо это доказать.' },
      { when: all(kerem, not(debt)), text: '— Ich hab was für euch, — говорит он и снимает с багажника мешок. Внутри ножовка, ящик гвоздей и моток проволоки. — Gegen Kartoffeln. Bei uns gibt es nur noch Nudeln.\n\nУ меня для вас кое-что есть. За картошку. У нас остались одни макароны.' },
      { when: not(kerem), text: 'В половине четвёртого у ворот никого. Ветер гонит снег вдоль забора. Колонка стоит, укутанная или нет, и молчит.' },
    ],
    actions: [
      { id: 'c29_ak_pay', label: 'Отдать картошкой: мешок за долг или за инструмент', when: all(kerem, potatoes), minutes: 60, terminal: true, goto: 'c29_night',
        text: 'Ты насыпаешь из кладовки двенадцать килограммов. Керем взвешивает мешок рукой, кивает. «Deniz wird sagen, zu wenig. Ich sage: genau richtig». Дениз скажет — мало. А я скажу — в самый раз. Он пристёгивает мешок к багажнику и чуть не падает на первом же повороте.', effects: [set29('ak', 'pay'), w29('kerem', 'paid'), { unstock: 'potatoes', qty: 12, at: 'c3_farm_stock' }, { if: not(debt), then: [{ give: 'c29_wire' }] }, npc('kerem', 2), until29(28, 17, 30)] },
      { id: 'c29_ak_wait', label: 'Попросить подождать до весны', when: kerem, minutes: 40, terminal: true, goto: 'c29_night',
        text: '— Bis Frühling? — Керем чешет затылок под ушанкой. — Gut. Aber dann mit Zinsen. Ein Huhn.\n\nДо весны? Ладно. Но тогда с процентами. Одна курица.\n\nОн смеётся, но не совсем шутит. Уезжает с пустым багажником.', effects: [set29('ak', 'wait'), w29('kerem', 'later'), until29(28, 17, 0)] },
      { id: 'c29_ak_tea', label: 'Позвать его в дом, на чай, и поговорить про Бухгольц', when: kerem, minutes: 60, terminal: true, goto: 'c29_night',
        text: 'Керем пьёт чай, обхватив кружку двумя руками. Рассказывает: в Бухгольце пусто, мастерская мёрзнет, Дениз не спит ночами, слушает улицу. «Er redet davon, wegzugehen. Er sagt es nicht, aber er redet davon». Он говорит об отъезде. Не говорит прямо, но говорит. Про канистру в этот раз никто не вспоминает.', effects: [set29('ak', 'tea'), w29('kerem', 'talked'), npc('kerem', 1, 'c29_tea'), until29(28, 17, 30)] },
      { id: 'c29_ak_gate', label: 'Проверить ворота и лечь пораньше', when: not(kerem), minutes: 30, terminal: true, goto: 'c29_night',
        text: 'Засов, калитка, цепь на воротах. Темнеет рано. Ты ложишься до шести и засыпаешь сразу.', effects: [set29('ak', 'gate'), until29(28, 17, 30)] },
    ] }),

  X({ id: 'c29_b_ask', title: 'Две просьбы', location: jest29, camp: { at: jest29, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: { tempC: 14, outdoor: false, wet: false },
    text: [
      { text: 'В одиннадцать Зандер уходит к Брандту. В пункте остаёшься ты и двое на раскладушках.' },
      { text: 'Эрих, старик из Ханштедта, зовёт тебя пальцем. Между приступами кашля просит написать письмо дочери. Она в Гамбурге, в Ральштедте. Красный Крест возит письма по воскресеньям.' },
      { text: 'Мальчик с белыми пальцами ног смотрит на тебя с соседней раскладушки. Его мама потерялась на вокзале в Харбурге, десятого. Он не знает, жива ли она. Он хочет, чтобы его имя прочитали по радио.' },
      { when: child26, text: 'В дверях стоит мама того четырёхлетнего мальчика с жаром. Принесла десяток яиц, для тебя. Мальчик бегает.' },
      { text: 'На столе у Зандер лежит стопка бумаг, исписанных разными почерками: просьбы, жалобы, адреса. Сверху кто-то положил варежку, забытую или оставленную как пресс-папье.' },
      { when: v('$.c29_bp', 'old'), text: 'Старик держал тебя за руку, пока не уснул. Пальцы у него сухие, лёгкие, как у птицы.' },
      { when: v('$.c29_bp', 'boy'), text: 'Мальчик перестал плакать, когда ты {m:показал|показала} ему фокус с монеткой. В первый раз за утро.' },
    ],
    actions: [
      { id: 'c29_ba_erich', label: 'Писать письмо Эриха', minutes: 90, terminal: true, goto: 'c29_b_henrike',
        text: 'Он диктует долго, с паузами. Про паровозы, про её мать, про то, что не сердится за тот разговор в двенадцатом году. Подписывает сам, рука дрожит. Ты относишь письмо на стол Красного Креста, в стопку на воскресенье.', effects: [set29('ba', 'erich'), w29('erich_letter', true), { if: child26, then: [{ give: 'eggs', qty: 10 }] }, { move: 'hof_luedemann' }, until29(28, 13, 30)] },
      { id: 'c29_ba_boy', label: 'Записать имя мальчика и его мамы для Красного Креста', minutes: 90, terminal: true, goto: 'c29_b_henrike',
        text: 'Мальчика зовут Финн Бреде, ему двенадцать. Маму — Сабина Бреде. Ты пишешь печатными буквами, как просит бланк, и ещё рост, цвет куртки, что она была в красной шапке. Мальчик следит за каждой буквой.', effects: [set29('ba', 'boy'), w29('boy_listed', true), { if: child26, then: [{ give: 'eggs', qty: 10 }] }, { move: 'hof_luedemann' }, until29(28, 13, 30)] },
      { id: 'c29_ba_both', label: 'Успеть и то и другое, бегом', minutes: 90, terminal: true, goto: 'c29_b_henrike',
        text: 'Ты пишешь письмо Эриха урывками, между заполнением бланка для мальчика. Получается коротко, торопливо, Эрих недоволен и ничего не говорит. Бланк для мальчика ты заполняешь с ошибкой в фамилии и замечаешь это только дома.', effects: [set29('ba', 'both'), w29('erich_letter', true), w29('boy_listed', 'typo'), { if: child26, then: [{ give: 'eggs', qty: 10 }] }, { move: 'hof_luedemann' }, until29(28, 13, 30)] },
    ] }),

  X({ id: 'c29_b_cellar', title: 'Подвал', camp: kitchen14, onEnter: [until29(28, 11, 30)],
    text: [
      { text: 'Хенрике зовёт тебя в подвал с керосиновой лампой и тетрадью. Считать. Картошка в ларе, морковь в песке, банки на полках, мешок муки. Она пишет столбиком, ты называешь.' },
      { when: flag('w.c26_jars_left'), text: 'Банки с тушёнкой с чердака стоят там, где вы их оставили под мешковиной. Хенрике снимает мешковину, смотрит на тебя. «Ihr habt sie nicht angefasst». Вы их не тронули. Она это запомнит.' },
      { when: flag('w.c26_jars'), text: 'Банки с тушёнкой с чердака стоят на полке в кладовке. Хенрике пересчитывает их и записывает отдельно.' },
      { text: 'В конце она закрывает тетрадь и говорит тихо: «Wenn alle hierbleiben — reicht es bis Februar. Nicht bis zum Säen». Если все останутся — хватит до февраля. Не до сева.' },
    ],
    actions: [
      { id: 'c29_bc2_reserve', label: 'Предложить отложить мешок картошки отдельно, на чёрный день', minutes: 60, terminal: true, goto: 'c29_b_henrike',
        text: 'Хенрике смотрит на тебя долго. Потом кивает и сама тащит мешок за ларь, в дальний угол, под старую дверь. «Das weiß nur ich und du». Это знаем только я и ты.', effects: [set29('bc2', 'reserve'), w29('reserve', true), npc('henrike', 2, 'c29_reserve_secret'), until29(28, 13, 0)] },
      { id: 'c29_bc2_share', label: 'Сказать: тогда надо делиться с соседями сейчас, пока есть', minutes: 60, terminal: true, goto: 'c29_b_henrike',
        text: '— Jetzt? — Хенрике хмурится. — Wenn wir jetzt geben, haben wir im Februar nichts. Und die Nachbarn auch nicht.\n\nСейчас? Если отдадим сейчас, в феврале не будет ничего. И у соседей тоже.\n\nНо в тетради она ставит на полях галочку против картошки. Ты не знаешь, что это значит.', effects: [set29('bc2', 'share'), w29('share_mind', true), until29(28, 13, 0)] },
      { id: 'c29_bc2_count', label: 'Только считать и молчать', minutes: 60, terminal: true, goto: 'c29_b_henrike',
        text: 'Ты считаешь. Она пишет. Лампа коптит. Когда вы поднимаетесь наверх, Хенрике выглядит старше, чем утром.', effects: [set29('bc2', 'count'), until29(28, 13, 0)] },
    ] }),

  X({ id: 'c29_a_uwe', title: 'Уве', camp: yard14, ambient: frost29, onEnter: [until29(29, 15, 0)],
    text: [
      { text: 'В три к воротам приходит Уве, пожарный, тот, что был с вами на колонне. В руках моток верёвки, за спиной багор.' },
      { text: '— Tobias kommt heute Abend. Er wird fragen, wer mitgeht. Ich wollte vorher wissen, ob du dabei bist. In der Kette braucht man Leute, die nicht weglaufen.\n\nТобиас придёт вечером. Он спросит, кто идёт. Я хотел знать заранее, будешь ли ты. В цепи нужны люди, которые не побегут.' },
      { when: v('$.c29_h', 'eat'), text: 'После обеда тепло и сонно. Венок на столе пахнет хвоей.' },
      { when: v('$.c29_h', 'rest'), text: 'Час сна не помог: ноги тяжёлые, голова ватная.' },
    ],
    actions: [
      { id: 'c29_au_yes', label: 'Сказать: если пойдём, я буду рядом с тобой', minutes: 60, terminal: true, goto: 'c29_evening',
        text: 'Уве кивает и протягивает тебе моток верёвки. «Nimm. Wenn einer rutscht, ist das das Einzige, was hilft». Бери. Если кто поскользнётся, только это и поможет. Потом показывает, как вязать петлю, которая не затягивается на руке.', effects: [set29('au', 'yes'), { set: 'A.c29_rope', value: true }, npc('c3_koehler', 0), until29(29, 17, 30)] },
      { id: 'c29_au_how', label: 'Спросить, как всё будет устроено', minutes: 60, terminal: true, goto: 'c29_evening',
        text: '— Fackeln. Stroh am Rand. Wir zünden an, sie gehen zum Feuer, bleiben stehen. Der Frost macht den Rest. — Уве смотрит на поле. — Gefährlich ist nur der Rand. Unter dem Schnee ist Eis. Wer vorgeht, liegt unten.\n\nФакелы. Солома по краю. Поджигаем, они идут к огню, останавливаются. Остальное сделает мороз. Опасен только край. Под снегом лёд. Кто выйдет вперёд, окажется внизу.', effects: [set29('au', 'how'), { set: 'A.c29_edge_known', value: true }, until29(29, 17, 30)] },
      { id: 'c29_au_no', label: 'Сказать: решим вдвоём, не сейчас', minutes: 30, terminal: true, goto: 'c29_evening',
        text: 'Уве пожимает плечами. «Klar. Zu zweit». Конечно. Вдвоём. Уходит к соседнему двору, с тем же вопросом и той же верёвкой.', effects: [set29('au', 'no'), until29(29, 17, 0)] },
    ] }),

  X({ id: 'c29_b_hanna', title: 'Список', camp: kitchen14, onEnter: [until29(29, 15, 0)],
    text: [
      { text: 'После обеда приходят две женщины из церкви, Ханна и вторая, в очках. У них школьная тетрадь. Они составляют список: дети, пропавшие с десятого, из Йестебурга, Люллау, Ханштедта. Красный Крест обещал читать имена по радио.' },
      { text: '— Sie schreiben schön, — говорит Ханна. У вас красивый почерк. — Und Sie waren in der Station. Sie wissen, wie man fragt.\n\nИ вы были в пункте. Вы знаете, как спрашивать.' },
      { when: ninaFarm, text: 'Нина слушает с лестницы и спускается на одну ступеньку.' },
      { text: 'Ханна держит тетрадь обеими руками, как держат молитвенник. Список длинный. Половина фамилий незнакомые.' },
      { when: v('$.c29_bp3', 'tea'), text: 'Фрау Хольм ушла одна, с корзиной. Ты смотришь ей вслед, пока она не скрывается за поворотом.' },
      { when: v('$.c29_bp3', 'own'), text: 'Свою свечу ты {m:отдал|отдала} фрау Хольм. Теперь на венке у Нины будет на одну меньше. Нина уже знает и не спорит.' },
    ],
    actions: [
      { id: 'c29_bh2_write', label: 'Сесть с ними и переписывать набело', minutes: 120, terminal: true, goto: 'c29_evening',
        text: 'Двадцать три имени. Возраст, во что одеты, где видели последний раз. На восьмом имени у второй женщины начинают дрожать руки: это её внук. Ты пишешь дальше, не поднимая головы. В конце Ханна забирает тетрадь и прижимает к груди, как икону.', effects: [set29('bh2', 'write'), w29('kids_list', true), until29(29, 17, 30)] },
      { id: 'c29_bh2_nina', label: 'Позвать Нину: пусть пишет она, у неё глаза моложе', when: ninaFarm, minutes: 120, terminal: true, goto: 'c29_evening',
        text: 'Нина пишет медленно, очень аккуратно, высунув кончик языка. Ханна поправляет немецкие буквы. К концу Нина сама задаёт вопросы: какого цвета шапка, была ли собака. Когда женщины уходят, она говорит тебе: «Я буду их слушать. По радио. Каждое воскресенье».', effects: [set29('bh2', 'nina'), w29('kids_list', true), npc('c7_nina', 2, 'c29_wrote_list'), until29(29, 17, 30)] },
      { id: 'c29_bh2_no', label: 'Отказаться: сил нет', minutes: 30, terminal: true, goto: 'c29_evening',
        text: 'Ханна кивает: понимаю. И уходит со своей тетрадью к Кёлер. Ты сидишь на кухне и смотришь на дверь, за которой они ушли.', effects: [set29('bh2', 'no'), until29(29, 17, 0)] },
    ] }),
];
