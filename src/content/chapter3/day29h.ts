import type { Scene } from '../../engine/content-types';
import { flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import { koehler } from './point16';
import { S29, frost29, set29, until29, w29 } from './point29';
import { evaRole, kasiaOut, leaOut, evaOut, kasiaRoad } from './house28';

// Участок 29, переделка (REWORK_PLAN.md, этап 1): кто живёт в доме после КТ28. Вечер субботы у каждого — своя пара сцен:
// Эва — две хозяйки у одной плиты (A), ночь в швейной и часы (B); Кася — комната под лестницей и гармошка (A), список
// поляков на десятое и письмо матери (B); Лея — Кёлер с разрезанной ладонью (A), Ганновер и ночная учёба (B).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S29({ ...scene, for: 'any', chapter: 'ch3' });
const timColony = v('w.c27_tim', 'colony');
const kulkaNina = v('w.c28_kulka', 'nina');
const postman = flag('w.c26_postman');

export const day29HScenes: Scene[] = [
  // ───────────── Эва ─────────────
  X({ id: 'c29_ha_eva', title: 'Две хозяйки', camp: kitchen14, onEnter: [until29(28, 17, 0)],
    text: [
      { text: 'Со вчерашнего вечера Эва живёт в доме, в бывшей швейной за кухней. Узел у неё маленький: всё, что у неё есть, помещается в наволочку. Утром она встала первой, затопила плиту и вымыла пол в сенях. Хенрике это видела и ничего не сказала.' },
      { text: 'В пять ты заходишь на кухню за ведром. У плиты стоит Эва с ножом и мешком картошки. У той же плиты стоит Хенрике с кастрюлей. Плита одна.' },
      { text: '— In meinem Topf gibt es samstags Erbsen, — говорит Хенрике. — Seit dreißig Jahren.\n\nВ моей кастрюле по субботам горох. Тридцать лет.' },
      { text: '— Und ich koche, oder ich gehe, — отвечает Эва, не поднимая глаз от картошки. — Ich bin kein Gast. Ich will kein Gast sein.\n\nА я готовлю, или я ухожу. Я не гостья. Не хочу быть гостьей.' },
      { text: 'Обе смотрят на тебя. Нина у двери делает вид, что её здесь нет.' },
      { when: kasiaOut, text: 'Кася осталась там, где спала до сих пор, и сегодня ни разу не зашла в дом без дела.' },
      { when: leaOut, text: 'Лея с утра ушла в пункт к Зандер и сказала, что вернётся затемно. Рюкзак у неё теперь всегда собран.' },
    ],
    actions: [
      { id: 'c29_hae_henrike', label: 'Сказать: кухня — Хенрике, Эве — хлев и шитьё', minutes: 40, terminal: true, goto: 'c29_ha_eva2',
        text: 'Хенрике коротко кивает. Эва кладёт нож, вытирает руки о фартук.\n\n— Gut. Kühe habe ich gemolken, bevor ich lesen konnte.\n\nХорошо. Коров я доила раньше, чем научилась читать.\n\nОна уходит в хлев. В окно видно, как там зажигается фонарь. За ужином горох, как всегда. Эва ест мало и вдруг говорит, что у чёрной коровы горячее вымя. Хенрике впервые смотрит на неё с интересом.',
        effects: [set29('hae', 'henrike'), w29('eva_role', 'barn'), npc('henrike', 1), until29(28, 17, 40)] },
      { id: 'c29_hae_eva', label: 'Попросить Хенрике уступить Эве плиту', minutes: 40, terminal: true, goto: 'c29_ha_eva2',
        text: 'Хенрике развязывает фартук и вешает его на гвоздь.\n\n— Bitte. Dann sehen wir.\n\nПожалуйста. Посмотрим.\n\nОна уходит в хлев и до ужина не возвращается. Эва варит картофельный суп с майораном из бумажного кулька, который носит с собой с самого автобуса. Кухня пахнет по-другому. Хенрике съедает две тарелки, молчит и моет кастрюлю сама.\n\n— Теперь она неделю будет злиться, — шепчет тебе Нина по-русски.',
        effects: [set29('hae', 'eva'), w29('eva_role', 'kitchen'), npc('c8_eva', 2), npc('henrike', -1), until29(28, 17, 40)] },
      { id: 'c29_hae_split', label: 'Предложить: утром готовит Хенрике, вечером Эва', minutes: 40, terminal: true, goto: 'c29_ha_eva2',
        text: 'Женщины переглядываются.\n\n— Abends, — говорит Хенрике. — Aber mein Topf bleibt mein Topf.\n\nВечером. Но моя кастрюля остаётся моей.\n\n— Dann hole ich meinen eigenen, — говорит Эва.\n\nТогда принесу свою.\n\nНа чердаке она находит мятую эмалированную кастрюлю с отбитой ручкой. К ужину на столе два супа, гороховый и картофельный. Нина ест оба.',
        effects: [set29('hae', 'split'), w29('eva_role', 'split'), npc('c8_eva', 1), until29(28, 17, 40)] },
    ] }),

  X({ id: 'c29_ha_eva2', title: 'Хлев', camp: yard14, ambient: frost29, onEnter: [until29(28, 19, 0)],
    text: [
      { when: evaRole('barn'), text: 'В семь Эва зовёт тебя в хлев. Чёрная корова стоит, поджав заднюю ногу, и косится. Эва держит ладонь на вымени.\n\n— Heiß. Hier, das Viertel. Wenn wir nichts machen, ist es morgen hart wie Holz. Alle drei Stunden ausmelken. Die ganze Nacht. Und kalte Lappen.\n\nГорячее. Вот эта четверть. Если ничего не делать, завтра будет твёрдым, как дерево. Каждые три часа сдаивать. Всю ночь. И холодные тряпки.' },
      { when: evaRole('kitchen'), text: 'В семь ты идёшь в хлев проверить воду. В темноте на скамеечке для дойки сидит Хенрике. Без фонаря. Руки под фартуком.\n\n— Dreißig Jahre, — говорит она, не оборачиваясь. — Werner hat nie gefragt, was es gibt. Er hat gegessen.\n\nТридцать лет. Вернер никогда не спрашивал, что на ужин. Он ел.' },
      { when: evaRole('split'), text: 'В семь Эва ловит тебя у двери хлева. В руках у неё мятая кастрюля и гвоздь.\n\n— Wo hänge ich den hin? Henrikes Haken sind alle voll. Ich will nur einen. Einen Platz.\n\nКуда мне её повесить? Крюки Хенрике все заняты. Мне нужен только один. Одно место.' },
    ],
    actions: [
      { id: 'c29_hae2_milk', label: 'Взять ночные дойки на себя вместе с ней', when: evaRole('barn'), minutes: 60, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Вы ставите будильник на десять, на час и на четыре. Ты держишь фонарь и ведро, Эва сдаивает. Молоко из больной четверти с хлопьями, его выливают в навоз. К четырём утра вымя мягче. Эва гладит корову по шее и говорит с ней по-померански.',
        effects: [set29('hae2', 'milk'), w29('cow', 'saved'), npc('c8_eva', 2), { body: 'fatigue', delta: 8 }, until29(28, 20, 0)] },
      { id: 'c29_hae2_henrike', label: 'Позвать Хенрике: корова её', when: evaRole('barn'), minutes: 40, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Хенрике приходит в шали поверх ночной рубашки. Щупает вымя, ругается по-нижненемецки. Потом садится на вторую скамеечку, и две женщины до полуночи сменяют друг друга, почти не разговаривая. Утром ты видишь их на кухне: одна наливает другой кофе.',
        effects: [set29('hae2', 'henrike'), w29('cow', 'saved'), w29('women', 'barn'), npc('henrike', 1), npc('c8_eva', 1), until29(28, 19, 40)] },
      { id: 'c29_hae2_leave', label: 'Сказать: справишься сама, мне завтра рано', when: evaRole('barn'), minutes: 15, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Эва кивает и отворачивается к корове. Ночью ты слышишь, как хлопает дверь хлева, раз, другой. Утром одна четверть твёрдая. Корова будет доиться на три соска.',
        effects: [set29('hae2', 'leave'), w29('cow', 'quarter'), until29(28, 19, 15)] },
      { id: 'c29_hae2_back', label: 'Уговорить Хенрике вернуться к столу', when: evaRole('kitchen'), minutes: 30, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: '— Die Frau braucht die Küche mehr als Sie, — говоришь ты. — Aber der Tisch ist Ihrer.\n\nЭтой женщине кухня нужнее, чем вам. Но стол — ваш.\n\nХенрике долго молчит. Потом встаёт, отряхивает фартук от соломы и идёт в дом. Садится во главе стола и говорит Эве, что суп пересолен. Эва отвечает, что горох был пресный. Обе почти улыбаются.',
        effects: [set29('hae2', 'back'), w29('women', 'table'), npc('henrike', 1), until29(28, 19, 30)] },
      { id: 'c29_hae2_sit', label: 'Сесть рядом и молчать', when: evaRole('kitchen'), minutes: 45, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Ты садишься на перевёрнутое ведро. Корова жуёт. Через четверть часа Хенрике начинает говорить: как Вернер умер в поле, на тракторе, в августе, и как она три дня варила на одного, по привычке, на двоих. Потом замолкает и говорит: «Gut. Soll sie kochen». Хорошо. Пусть варит.',
        effects: [set29('hae2', 'sit'), w29('women', 'told'), npc('henrike', 2), until29(28, 19, 45)] },
      { id: 'c29_hae2_truth', label: 'Сказать прямо: без дела Эва сломается', when: evaRole('kitchen'), minutes: 20, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: '— Ich weiß, — говорит Хенрике. Знаю. — Ich war auch so. Nach Werner.\n\nЯ тоже такой была. После Вернера.\n\nОна остаётся сидеть в темноте. В дом приходит, когда все уже легли.',
        effects: [set29('hae2', 'truth'), until29(28, 19, 20)] },
      { id: 'c29_hae2_shelf', label: 'Сделать Эве полку у плиты', when: evaRole('split'), minutes: 60, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Обрезок доски с сеновала, два уголка, четыре шурупа. Ты вешаешь полку слева от плиты, где на стене пустое место и старый след от календаря. Эва ставит на неё свою кастрюлю, кулёк майорана и часы Хельмута. Хенрике проходит мимо, проводит пальцем по полке, смотрит на палец. Пыли нет.',
        effects: [set29('hae2', 'shelf'), w29('eva_shelf', true), npc('c8_eva', 2), { body: 'fatigue', delta: 3 }, until29(28, 20, 0)] },
      { id: 'c29_hae2_hook', label: 'Освободить ей крюк Хенрике у двери', when: evaRole('split'), minutes: 15, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Ты снимаешь с крайнего крюка старую сетку для лука, пустую, и вешаешь туда кастрюлю Эвы. Утром сетка висит на прежнем месте, а кастрюля стоит на полу у плиты. Никто ничего не говорит.',
        effects: [set29('hae2', 'hook'), until29(28, 19, 15)] },
    ] }),

  X({ id: 'c29_hb_eva', title: 'Наволочка', camp: kitchen14, onEnter: [until29(28, 19, 0)],
    text: [
      { text: 'Эва зовёт тебя в бывшую швейную. Узкая кровать, машинка «Зингер» под чехлом, окно во двор. Эва вытряхивает на одеяло наволочку: часы Хельмута на ремешке, фотография без рамки, кулёк майорана, клубок серой шерсти, спицы.' },
      { text: '— Er hat alle Uhren vier Minuten vorgestellt. Damit ich nicht zu spät komme. Ich kam trotzdem immer zu spät.\n\nОн все часы ставил на четыре минуты вперёд. Чтобы я не опаздывала. Я всё равно всегда опаздывала.' },
      { text: 'Она садится на кровать и смотрит на дверь.\n\n— Ich habe noch nie allein in einem Zimmer geschlafen. Erst bei den Eltern, dann mit Helmut. Dann im Bus. Dann bei euch, alle zusammen.\n\nЯ никогда не спала одна в комнате. Сначала у родителей, потом с Хельмутом. Потом в автобусе. Потом у вас, все вместе.' },
    ],
    actions: [
      { id: 'c29_hbe_stay', label: 'Посидеть, пока она не уснёт', minutes: 60, terminal: true, goto: 'c29_hb_eva2',
        text: 'Ты садишься на табурет у машинки. Эва ложится одетой, лицом к тебе, и долго смотрит. Потом закрывает глаза. Дыхание у неё выравнивается через сорок минут. Ты встаёшь, и половица скрипит. Эва не просыпается.',
        effects: [set29('hbe', 'stay'), w29('eva_night', 'stayed'), npc('c8_eva', 2), { body: 'fatigue', delta: 2 }, until29(28, 20, 0)] },
      { id: 'c29_hbe_lamp', label: 'Оставить открытой дверь на кухню и лампу', minutes: 20, terminal: true, goto: 'c29_hb_eva2',
        text: 'Ты подпираешь дверь табуретом и ставишь керосиновую лампу на кухонный стол, фитиль на самый низ. Из швейной видно и огонёк, и угол печи. Хенрике ворчит про керосин, но лампу не гасит.',
        effects: [set29('hbe', 'lamp'), w29('eva_night', 'lamp'), npc('c8_eva', 1), until29(28, 19, 20)] },
      { id: 'c29_hbe_nina', label: 'Позвать Нину ночевать в швейной', minutes: 25, terminal: true, goto: 'c29_hb_eva2',
        text: '— А она не храпит? — спрашивает Нина по-русски. — Ладно.\n\nНина приносит своё одеяло и кошку, которая приходит сама. Эва стелет ей на сундуке и подтыкает одеяло так, как, наверное, подтыкала бы своей дочери.',
        effects: [set29('hbe', 'nina'), w29('eva_night', 'nina'), npc('c8_eva', 1), npc('c7_nina', 1), until29(28, 19, 25)] },
    ] }),

  X({ id: 'c29_hb_eva2', title: 'Часы', camp: kitchen14, onEnter: [until29(28, 21, 0)],
    text: [
      { text: 'В девять ты выходишь на кухню попить. Эва сидит у плиты, на коленях клубок, на столе часы Хельмута. Кухонные часы над дверью сняты со стены. Эва переводит их стрелку на четыре минуты вперёд.' },
      { text: '— Damit ihr nicht zu spät kommt. Wenn ihr nachts raus müsst.\n\nЧтобы вы не опаздывали. Если ночью придётся выходить.\n\nСпицы у неё уже стучат. Серая шерсть. Варежка.' },
      { text: '— Für wen? — спрашиваешь ты.\n\nДля кого?\n\n— Für den, der raus muss.\n\nДля того, кому выходить.' },
    ],
    actions: [
      { id: 'c29_hbe2_yarn', label: 'Держать ей пряжу', minutes: 60, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Ты держишь моток на вытянутых руках, Эва сматывает. Потом вяжет дальше. К одиннадцати готова первая варежка, к полуночи вторая. Она говорит, что к понедельнику будут две пары. Ты ей веришь.',
        effects: [set29('hbe2', 'yarn'), w29('eva_mitts', 2), w29('eva_clock', true), npc('c8_eva', 1), { body: 'fatigue', delta: 2 }, until29(28, 22, 0)] },
      { id: 'c29_hbe2_helmut', label: 'Спросить про Хельмута', minutes: 45, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Она рассказывает, не переставая вязать. Хельмут был часовщиком в Ильцене, потом, когда часовщики стали не нужны, развозил газеты. Никогда не ругался. Боялся собак. Пошёл за водой, потому что она попросила.\n\n— Weil ich gefragt habe, — повторяет она. — Verstehst du?\n\nПотому что я попросила. Понимаешь?\n\nК полуночи у неё одна варежка и половина второй.',
        effects: [set29('hbe2', 'helmut'), w29('eva_mitts', 1), w29('eva_clock', true), npc('c8_eva', 2), until29(28, 21, 45)] },
      { id: 'c29_hbe2_bed', label: 'Уговорить её лечь и вернуть часы на место', minutes: 15, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Ты вешаешь кухонные часы обратно, как было, без лишних минут. Эва не спорит. Она сворачивает вязание и уходит к себе. Дверь в швейную остаётся приоткрытой.',
        effects: [set29('hbe2', 'bed'), { body: 'fatigue', delta: -2 }, until29(28, 21, 15)] },
    ] }),

  // ───────────── Кася ─────────────
  X({ id: 'c29_ha_kasia', title: 'Комната под лестницей', camp: kitchen14, onEnter: [until29(28, 17, 0), { npc: 'kasia', moveTo: 'hof_luedemann' }],
    text: [
      { text: 'Хенрике отдала Касе комнату под лестницей: там раньше стояли банки с огурцами. Банки перенесли в подвал, комнату вымыли, поставили раскладушку.' },
      { text: 'Ты помогаешь перенести вещи. Их немного: сумка, одеяло, пакет с одеждой Тима. Губная гармошка. Рисунок на тетрадном листе: ёж с огромными иголками, подпись кривыми буквами «PAN JEŻ».' },
      { when: not(kulkaNina), text: 'И клетка с Паном Кулькой. Хомяк спит в вате и не знает, что переехал.' },
      { text: 'Кася держит рисунок обеими руками.\n\n— Darf ich das an die Wand machen? Es ist Henrikes Haus.\n\nМожно я повешу это на стену? Это дом Хенрике.' },
      { when: evaOut, text: 'Эва осталась спать там, где спала. Утром она молча отдала Касе свою вторую наволочку.' },
      { when: leaOut, text: 'Лея с утра в пункте у Зандер. Рюкзак у неё теперь всегда собран.' },
    ],
    actions: [
      { id: 'c29_hak_nail', label: 'Повесить рисунок самому, не спрашивая', minutes: 20, terminal: true, goto: 'c29_ha_kasia2',
        text: 'Ты находишь в кармане гвоздь и забиваешь его каблуком сапога. Ёж висит над раскладушкой, чуть косо. Вечером Хенрике заглядывает в комнату, смотрит на рисунок и поправляет его одним пальцем. «Schief». Криво. Больше ничего.',
        effects: [set29('hak', 'nail'), w29('kasia_wall', 'hung'), npc('kasia', 1), until29(28, 17, 30)] },
      { id: 'c29_hak_ask', label: 'Спросить Хенрике', minutes: 30, terminal: true, goto: 'c29_ha_kasia2',
        text: 'Хенрике приходит, вытирая руки. Долго смотрит на ежа. Потом уходит в комнату и возвращается с рамкой: из неё вынута фотография, и ты успеваешь увидеть мужчину в кепке у трактора.\n\n— Werner hängt auch ohne Rahmen, — говорит она и отдаёт рамку Касе. — Der Junge braucht einen.\n\nВернер провисит и без рамки. Мальчику она нужна.\n\nКася не может сказать ни слова. Хенрике уходит раньше, чем она успевает.',
        effects: [set29('hak', 'ask'), w29('kasia_wall', 'framed'), npc('kasia', 2), npc('henrike', 1), until29(28, 17, 40)] },
      { id: 'c29_hak_self', label: 'Сказать: решай сама', minutes: 15, terminal: true, goto: 'c29_ha_kasia2',
        text: 'Кася кивает. Сворачивает рисунок вчетверо и кладёт под подушку.\n\n— Später. Wenn ich weiß, ob ich bleibe.\n\nПотом. Когда буду знать, остаюсь ли.',
        effects: [set29('hak', 'self'), w29('kasia_wall', 'pillow'), until29(28, 17, 20)] },
    ] }),

  X({ id: 'c29_ha_kasia2', title: 'Гармошка', camp: yard14, ambient: frost29, onEnter: [until29(28, 19, 30)],
    text: [
      { when: not(timColony), text: 'В половине восьмого со двора доносится губная гармошка. Кася стоит под грушей, у могилы Тима, и играет. Одну и ту же песенку, детскую, три ноты вверх, три вниз. Сбивается и начинает сначала.' },
      { when: timColony, text: 'В половине восьмого со двора доносится губная гармошка. Кася стоит у ворот, лицом туда, где у насыпи под ольхой лежит Тим, и играет. Одну и ту же детскую песенку. Сбивается и начинает сначала.' },
      { text: 'Мороз. Звук летит далеко, над полем, до самой лесополосы.' },
      { when: postman, text: 'У лесополосы, где каждый день стоит Почтальон, белое пятно поворачивается. Медленно. На звук.' },
    ],
    actions: [
      { id: 'c29_hak2_stop', label: 'Попросить её перестать: звук слышно до леса', minutes: 10, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Кася опускает гармошку. Смотрит на тебя так, будто ты {m:ударил|ударила} её. Потом кивает: понимает. Уходит в дом, мимо тебя, не говоря ни слова. Ночью из-под лестницы не слышно ничего.',
        effects: [set29('hak2', 'stop'), npc('kasia', -1), until29(28, 19, 40)] },
      { id: 'c29_hak2_inside', label: 'Увести её в дом: пусть играет на кухне', minutes: 40, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'На кухне тепло, и гармошка звучит иначе, глуше. Нина садится рядом и через полчаса подбирает песенку на расчёске с бумажкой. Хенрике вяжет и делает вид, что не слушает. На второй раз она отбивает ритм спицей по краю стола.',
        effects: [set29('hak2', 'inside'), npc('kasia', 2), npc('c7_nina', 1), until29(28, 20, 15)] },
      { id: 'c29_hak2_let', label: 'Не мешать ей и встать рядом', minutes: 40, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }], ambientDuring: frost29,
        text: 'Ты встаёшь рядом. Кася играет, пока не немеют губы. Потом прячет гармошку в рукав и говорит: «Danke». Вы идёте в дом.',
        effects: [set29('hak2', 'let'), npc('kasia', 2), { if: postman, then: [w29('postman_close', true)] }, until29(28, 20, 15)] },
    ] }),

  X({ id: 'c29_hb_kasia', title: 'Список на десятое', camp: yard14, ambient: frost29, onEnter: [until29(28, 19, 0)],
    text: [
      { text: 'В семь у ворот останавливается велосипед. Мужчина в ватнике и вязаной шапке, с папкой под мышкой. Поляк из Винзена: Мирек, он говорит по-немецки медленно и правильно, как по учебнику.' },
      { text: '— Wir gehen am Zehnten. Nach Osten, über Lauenburg, dann Schwerin, Stettin. Sechzig Leute. Ich schreibe die Liste.\n\nМы уходим десятого. На восток, через Лауэнбург, потом Шверин, Щецин. Шестьдесят человек. Я пишу список.' },
      { when: v('w.c28_kasia', 'east'), text: 'Он показывает лист: «Katarzyna Nowak» записано карандашом в середине.' },
      { when: not(v('w.c28_kasia', 'east')), text: 'Он показывает лист. Имени Каси там нет. «Ich habe gehört, hier ist eine Frau aus Stettin». Мне сказали, здесь живёт женщина из Щецина.' },
      { text: 'Кася стоит за твоим плечом. Ты чувствуешь, как она держится за твой рукав.\n\n— Was sagst du? Du kennst mich von zu Hause.\n\nЧто скажешь? Ты знаешь меня по дому.' },
    ],
    actions: [
      { id: 'c29_hbk_go', label: 'Сказать: езжай домой, к маме', minutes: 30, terminal: true, goto: 'c29_hb_kasia2',
        text: 'Кася кивает несколько раз, быстро. Мирек обводит её имя ручкой, поверх карандаша.\n\n— Am Zehnten, um sechs. Bahnhof Winsen. Ein Rucksack, nicht mehr.\n\nДесятого, в шесть. Вокзал Винзена. Один рюкзак, не больше.\n\nОн уезжает. Кася стоит у ворот, пока велосипед не скрывается.',
        effects: [set29('hbk', 'go'), w29('kasia_road', 'list'), npc('kasia', 1), until29(28, 19, 30)] },
      { id: 'c29_hbk_stay', label: 'Попросить её остаться до весны: зимой дорога убьёт', minutes: 30, terminal: true, goto: 'c29_hb_kasia2',
        text: '— Sechzig Leute zu Fuß im Dezember, — говоришь ты. — Wie viele kommen an?\n\nШестьдесят человек пешком в декабре. Сколько дойдёт?\n\nМирек не спорит. Он сам об этом думал. Кася долго молчит, потом берёт у него карандаш и сама вычёркивает своё имя. Или не вписывает. Рука у неё не дрожит.\n\n— Im Frühling, — говорит она. — Mit Tims Stein. Весной. С камнем Тима.',
        effects: [set29('hbk', 'stay'), w29('kasia_road', 'stay'), npc('kasia', 2), until29(28, 19, 30)] },
      { id: 'c29_hbk_self', label: 'Сказать: решай сама', minutes: 30, terminal: true, goto: 'c29_hb_kasia2',
        text: 'Кася отпускает твой рукав. Мирек ждёт. Наконец она говорит: «Mit Bleistift». Карандашом. Мирек пишет её имя карандашом и уезжает, сказав, что до девятого его можно стереть.',
        effects: [set29('hbk', 'self'), w29('kasia_road', 'self'), until29(28, 19, 30)] },
    ] }),

  X({ id: 'c29_hb_kasia2', title: 'Письмо', camp: kitchen14, onEnter: [until29(28, 20, 0)],
    text: [
      { text: 'В восемь Кася садится за кухонный стол с листом из тетради Нины. Пишет по-польски, мелко, и останавливается на третьей строчке.' },
      { when: kasiaRoad('list'), text: '— Mama muss wissen, dass ich komme. Und warum ich allein komme.\n\nМама должна знать, что я еду. И почему еду одна.' },
      { when: kasiaRoad('stay'), text: '— Mama muss wissen, dass ich lebe. Und dass ich im Frühling komme. Und… — Она не договаривает.\n\nМама должна знать, что я жива. Что приеду весной. И…' },
      { when: kasiaRoad('self'), text: '— Ich weiß nicht mal, was ich schreiben soll. Komme ich? Komme ich nicht?\n\nЯ даже не знаю, что писать. Еду? Не еду?' },
      { text: 'Она смотрит на тебя.\n\n— Wie schreibt man, dass ein Kind tot ist? An seine Oma?\n\nКак написать, что ребёнок умер? Его бабушке?' },
    ],
    actions: [
      { id: 'c29_hbk2_truth', label: 'Помочь ей написать правду про Тима', minutes: 60, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Ты не знаешь польского. Вы пишете вместе, по-немецки, и Кася переводит каждую фразу вслух, прежде чем написать. Выходит восемь строк. Про Тима две. Она подписывает, складывает лист вчетверо и долго держит в руке, прежде чем положить в конверт.',
        effects: [set29('hbk2', 'truth'), w29('kasia_letter', 'truth'), npc('kasia', 2), { body: 'stress', delta: 3 }, until29(28, 21, 0)] },
      { id: 'c29_hbk2_later', label: 'Предложить пока написать только: я жива', minutes: 30, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: '«Jestem żywa». Я жива. Кася пишет это крупно, на весь лист, и больше ничего. Про Тима — потом, говорит она. Глаза в глаза. Ты не споришь.',
        effects: [set29('hbk2', 'later'), w29('kasia_letter', 'alive'), npc('kasia', 1), until29(28, 20, 30)] },
      { id: 'c29_hbk2_none', label: 'Сказать: не сегодня, уже поздно', minutes: 15, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Кася складывает пустой лист и убирает его в тетрадь. Уходит к себе под лестницу. Через стенку тихо: она не плачет, она просто сидит.',
        effects: [set29('hbk2', 'none'), until29(28, 20, 15)] },
    ] }),

  // ───────────── Лея ─────────────
  X({ id: 'c29_ha_lea', title: 'Кёлер', camp: yard14, ambient: frost29, onEnter: [until29(28, 17, 0)],
    text: [
      { text: 'Со вчерашнего вечера Лея живёт в кладовке за кухней: Хенрике убрала оттуда мешки и поставила топчан. Сумку с красным крестом Лея разобрала на полке, по порядку: бинты, шовный материал, две ампулы, ножницы, жгут.' },
      { text: 'В пять в ворота колотят. Зять Кёлер, без шапки, белый.\n\n— Sie ist an der Pumpe ausgerutscht. Die Hand. Bis auf den Knochen. Ihr habt doch die vom Roten Kreuz?\n\nОна поскользнулась у колонки. Рука. До кости. У вас же та, из Красного Креста?' },
      { text: 'Кёлер сидит в тележке, завёрнутая в одеяло. Ладонь замотана кухонным полотенцем, полотенце насквозь красное. Губы синие. Лея уже стоит в дверях с сумкой.\n\n— Auf den Tisch. Licht. Heißes Wasser.\n\nНа стол. Свет. Горячую воду.' },
      { text: 'Хенрике за её спиной молчит. Чужих в дом после темноты у неё не пускают.' },
      { when: evaOut, text: 'Эва осталась спать там, где спала. Сейчас она стоит у плиты и уже ставит воду, не дожидаясь, кто что решит.' },
      { when: kasiaOut, text: 'Кася выглядывает из двери и прячется обратно.' },
    ],
    actions: [
      { id: 'c29_hal_house', label: 'Внести Кёлер в дом, на кухонный стол', minutes: 60, terminal: true, goto: 'c29_ha_lea2',
        text: 'Вы вносите её вдвоём с зятем. Лея моет руки так долго, что ты успеваешь сосчитать до шестидесяти. Шьёт при двух лампах. Двенадцать швов. Кёлер не кричит, только один раз говорит «Herrgott». Хенрике сначала стоит у двери, потом молча забирает у тебя лампу и держит сама, ровно, пока Лея не завязывает последний узел.',
        effects: [set29('hal', 'house'), w29('lea_patient', 'house'), npc('c21_lea', 2), koehler(2), until29(28, 18, 10)] },
      { id: 'c29_hal_barn', label: 'Шить в хлеву, при фонаре: Хенрике не пускает чужих', minutes: 70, terminal: true, goto: 'c29_ha_lea2',
        text: 'В хлеву плюс четыре. Лея шьёт на перевёрнутом ящике, ты держишь фонарь, зять держит руку тёщи. Пальцы у Леи коченеют, она дважды останавливается и дышит на них. Десять швов, неровных. «Wird halten», — говорит она. Выдержит. Кёлер увозят. Лея долго моет руки в ведре с тёплой водой и не смотрит на дом.',
        effects: [set29('hal', 'barn'), w29('lea_patient', 'barn'), koehler(1), { body: 'fatigue', delta: 2 }, until29(28, 18, 20)] },
      { id: 'c29_hal_point', label: 'Везти Кёлер к Зандер в Йестебург', when: flag('w.c16_tractor'), minutes: 120, terminal: true, goto: 'c29_ha_lea2', ambientDuring: frost29,
        text: 'Пять километров в темноте, по льду, тележка за трактором. В пункте Зандер шьёт сама и ворчит, что рану надо было промыть сразу. Обратно ты едешь {m:один|одна}. Пальцы на руле не гнутся. Дома Лея сидит на кухне с разложенной сумкой. Встречает тебя одним вопросом: «Wie viele Stiche?» Сколько швов? И больше ни о чём не спрашивает.',
        effects: [set29('hal', 'point'), w29('lea_patient', 'point'), npc('c21_lea', -1), koehler(1), { body: 'fatigue', delta: 6 }, until29(28, 19, 20)] },
    ] }),

  X({ id: 'c29_ha_lea2', title: 'Правила', camp: kitchen14, onEnter: [until29(28, 19, 30)],
    text: [
      { when: v('w.c29_lea_patient', 'house'), text: 'В половине восьмого зять Кёлер возвращается с корзиной: шесть яиц, банка смальца, кусок мыла. И с вопросом: у соседей девочка кашляет третью неделю, можно ли завтра привести.' },
      { when: v('w.c29_lea_patient', 'barn'), text: 'В половине восьмого Лея пересчитывает бинты на полке. Сбивается, начинает сначала.\n\n— Wenn das im Dorf rumgeht, kommen sie alle. Jede Nacht. In den Stall oder ins Haus, aber sie kommen.\n\nЕсли это разойдётся по деревне, придут все. Каждую ночь. В хлев или в дом, но придут.' },
      { when: v('w.c29_lea_patient', 'point'), text: 'Лея сидит над сумкой. Две ампулы, восемь бинтов, одна катушка шовной нити.\n\n— Das reicht für zwei Wochen. Für uns. Wenn ich jedem helfe, reicht es für drei Tage.\n\nЭтого хватит на две недели. Нам. Если помогать каждому — на три дня.' },
      { text: 'Хенрике садится за стол напротив.\n\n— Wer kommt in mein Haus? Das muss heute gesagt werden.\n\nКто приходит в мой дом? Это надо сказать сегодня.' },
    ],
    actions: [
      { id: 'c29_hal2_all', label: 'Сказать: помогать всем, кто постучит', minutes: 30, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Лея поднимает глаза. Хенрике думает долго.\n\n— Alle. Gut. Aber nicht nachts. Nachts nur, wenn Blut ist.\n\nВсех. Хорошо. Но не ночью. Ночью — только если кровь.\n\nЛея кивает. На полке за её спиной бинтов на три дня.',
        effects: [set29('hal2', 'all'), w29('lea_rule', 'all'), npc('c21_lea', 2), until29(28, 20, 0)] },
      { id: 'c29_hal2_village', label: 'Сказать: только своя деревня', minutes: 30, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: '— Lüllau und Wörme, — говорит Хенрике. — Wer von weiter kommt, geht nach Jesteburg.\n\nЛюллау и Вёрме. Кто дальше — тот в Йестебург.\n\nЛея записывает это на крышке коробки с бинтами. Почерк у неё мелкий, медицинский.',
        effects: [set29('hal2', 'village'), w29('lea_rule', 'village'), npc('henrike', 1), npc('c21_lea', 1), until29(28, 20, 0)] },
      { id: 'c29_hal2_ours', label: 'Сказать: бинты — для своих', minutes: 20, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Лея долго смотрит на тебя. Потом закрывает сумку.\n\n— Dann bin ich hier nur für euch.\n\nЗначит, я здесь только для вас.\n\nОна говорит это спокойно, без обиды. Но сумку убирает на верхнюю полку, где её не видно с порога.',
        effects: [set29('hal2', 'ours'), w29('lea_rule', 'ours'), npc('c21_lea', -1), npc('henrike', 1), until29(28, 19, 50)] },
    ] }),

  X({ id: 'c29_hb_lea', title: 'Ганновер', camp: kitchen14, onEnter: [until29(28, 19, 0)],
    text: [
      { text: 'В кладовке Лея расстелила на топчане дорожную карту Нижней Саксонии, мятую, с кофейным пятном на Люнебургской пустоши. Карандашом проведена линия: Йестебург, Зольтау, Целле, Ганновер. Сто двадцать километров.' },
      { text: '— Mama und Finn. Er ist zwölf. Im Oktober waren sie in der Wohnung in Linden. Seitdem nichts.\n\nМама и Финн. Ему двенадцать. В октябре они были в квартире в Линдене. С тех пор ничего.' },
      { text: 'Она проводит пальцем по линии.\n\n— Im Frühling gehe ich. Oder früher, wenn ein Konvoi fährt. Sander sagt, die Armee braucht Sanitäter für Hannover.\n\nВесной пойду. Или раньше, если пойдёт колонна. Зандер говорит, армии нужны санитары для Ганновера.' },
      { text: 'Она смотрит на тебя.\n\n— Was würdest du machen? Ehrlich.\n\nЧто бы ты {m:сделал|сделала}? Честно.' },
    ],
    actions: [
      { id: 'c29_hbl_spring', label: 'Пообещать: весной пойдём с тобой хотя бы до Целле', minutes: 40, terminal: true, goto: 'c29_hb_lea2',
        text: 'Лея молчит. Потом складывает карту так, чтобы линия осталась сверху.\n\n— Bis Celle. — Она повторяет это ещё раз. — Das ist mehr, als mir jemand versprochen hat. Seit Oktober.\n\nДо Целле. Это больше, чем мне кто-то обещал. С октября.',
        effects: [set29('hbl', 'spring'), w29('lea_road', 'spring'), npc('c21_lea', 3), until29(28, 19, 40)] },
      { id: 'c29_hbl_convoy', label: 'Сказать: проси Зандер записать тебя в колонну', minutes: 40, terminal: true, goto: 'c29_hb_lea2',
        text: '— Mit der Armee, — говорит Лея. — Die fragen nicht, wer ich bin. Die fragen, ob ich Blut sehen kann.\n\nС армией. Там не спрашивают, кто я. Спрашивают, могу ли я смотреть на кровь.\n\nОна обводит Ганновер кружком. Завтра она спросит Зандер. Ты понимаешь, что тогда она может уйти уже в декабре.',
        effects: [set29('hbl', 'convoy'), w29('lea_road', 'convoy'), npc('c21_lea', 1), until29(28, 19, 40)] },
      { id: 'c29_hbl_stay', label: 'Сказать честно: я бы {m:остался|осталась} до весны здесь', minutes: 40, terminal: true, goto: 'c29_hb_lea2',
        text: '— Hier, — повторяет Лея. Она обводит взглядом кладовку: полки, топчан, свою сумку на гвозде. — Gebraucht werden ist auch ein Ort, oder?\n\nБыть нужной — это тоже место, да?\n\nОна убирает карту в рюкзак, на самое дно. Рюкзак впервые за неделю остаётся незавязанным.',
        effects: [set29('hbl', 'stay'), w29('lea_road', 'stay'), npc('c21_lea', 2), until29(28, 19, 40)] },
    ] }),

  X({ id: 'c29_hb_lea2', title: 'Шкура', camp: kitchen14, onEnter: [until29(28, 20, 0)],
    text: [
      { text: 'В восемь Лея приносит из коптильни кусок свиной шкуры, жёсткой, с салом. Кладёт на разделочную доску.\n\n— Wenn ich weg bin, oder wenn ich die bin, die blutet, muss es jemand können. Komm.\n\nЕсли меня не будет или если кровить буду я, кто-то должен уметь. Иди сюда.' },
      { text: 'Иглодержатель, пинцет, нить. Она показывает: вкол под прямым углом, выкол на той же глубине, узел хирургический, три раза.' },
    ],
    actions: [
      { id: 'c29_hbl2_learn', label: 'Учиться, пока не получится ровно', minutes: 75, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Первые пять швов криво. Шестой Лея распарывает сама. На двенадцатом она смотрит и кивает. На двадцатом говорит: «Das würde ich nehmen». Такой бы я взяла. Пальцы у тебя болят, а на шкуре два ровных ряда.',
        effects: [set29('hbl2', 'learn'), w29('b_sutures', true), npc('c21_lea', 1), { body: 'fatigue', delta: 3 }, until29(28, 21, 15)] },
      { id: 'c29_hbl2_finn', label: 'Шить и слушать про Финна', minutes: 60, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Финн собирает модели самолётов. Финн боится темноты, но врёт, что нет. Финн звонил ей в октябре в последний раз и спросил, можно ли он возьмёт её наушники. Она сказала «нет». Лея рассказывает и поправляет тебе руку с иглой, не глядя. Швы выходят неровные. Ты запоминаешь, как вязать узел.',
        effects: [set29('hbl2', 'finn'), w29('b_sutures', true), npc('c21_lea', 2), until29(28, 21, 0)] },
      { id: 'c29_hbl2_no', label: 'Сказать: не могу смотреть на это, прости', minutes: 10, terminal: true, outcomes: [{ id: 'n', goto: 'c29_night' }],
        text: 'Лея пожимает плечами и убирает шкуру.\n\n— Dann muss ich eben nicht bluten.\n\nЗначит, мне просто нельзя кровить.\n\nОна шутит. Почти.',
        effects: [set29('hbl2', 'no'), until29(28, 20, 10)] },
    ] }),
];
