import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { flag, not } from './world3';
import { kitchen14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import { S27, inShed, leaNear, set27, until27, w27 } from './point27';

// Участок 27, линия B: с Касей и Тимом. Половина B: сколько осталось (часы, не больше суток) и о чём просит Кася.
// Находка: жестяная коробка Тима с велосипедным замком на пять букв; слово — кличка хомяка из утренней сцены (KULKA).
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S27({ ...scene, for: 'any', chapter: 'ch3', location: undefined });
const where = (house: string, shed: string) => [{ when: not(inShed), text: house }, { when: inShed, text: shed }];
const truthB = set27('b_truth', true);
const boxOpen = flag('$.c27_box_open');
const tried = (w: string): Cond => flag(`$.c27_try_${w}`);
const WORDS = ['TATUS', 'KULKA', 'BALON', 'MAMUS'] as const;
const opened: Effect[] = [{ give: 'c27_photo' }, w27('box', 'open'), set27('box_open', true)];
const boxActions = (scene: string): ActionDef[] => [
  ...WORDS.map((w): ActionDef => w === 'KULKA'
    ? { id: `${scene}_${w.toLowerCase()}`, label: `Набрать «${w}»`, when: not(tried(w)), minutes: 10, terminal: true, goto: 'c27_b_lea',
      text: 'Колёсики встают, замок щёлкает. Внутри — губная гармошка, синяя, с облезлой краской. Три шоколадные монеты в золотой фольге. И фотография: дом в Бармбеке, лестница у подъезда, на ступеньках все. Новаки. Окафор с котом на руках. Мерле в огромном шарфе. И ты, сбоку, с пакетом из магазина, смотришь не в камеру.\n\nТим берёт гармошку в кулак и не отпускает. Кася отдаёт фотографию тебе.\n\n— Weź. Nimm du. Ich kann sie nicht ansehen.\n\nВозьми. Я не могу на неё смотреть.', effects: [...opened, until27(9, 40)] }
    : { id: `${scene}_${w.toLowerCase()}`, label: `Набрать «${w}»`, when: not(tried(w)), minutes: 10, terminal: true, goto: 'c27_b_box2',
      text: 'Колёсики встают. Замок не поддаётся. Тим смотрит на тебя и чуть заметно качает головой: нет.', effects: [set27(`try_${w}`, true)] }),
  { id: `${scene}_stone`, label: 'Дать Касе разбить коробку камнем', minutes: 15, terminal: true, goto: 'c27_b_lea',
    text: 'Кася бьёт камнем по замку. Раз, два. Крышка гнётся. На третий раз отлетает. Гармошка цела. Монеты целы. Фотография разорвана по краю, наискось: половины лестницы нет. Кася отдаёт тебе то, что осталось.', effects: [{ give: 'c27_photo_torn' }, w27('box', 'broken'), until27(9, 40)] },
  { id: `${scene}_leave`, label: 'Оставить коробку закрытой: это его', minutes: 5, terminal: true, goto: 'c27_b_lea',
    text: 'Ты кладёшь коробку Тиму на одеяло. Он накрывает её ладонью. Что внутри, знает только он.', effects: [w27('box', 'closed'), until27(9, 30)] },
];

export const day27BScenes: Scene[] = [
  B({ id: 'c27_b_tim', title: 'Тим', camp: kitchen14,
    text: [
      ...where('Тима кладут в швейной комнате, на диван. Печь за стеной греет. Кася садится на пол у изголовья.', 'Тима кладут в отдельном сарае, на сено, на два одеяла. Ты затапливаешь старую печку-буржуйку. Кася садится рядом на перевёрнутое ведро.'),
      { text: 'Тим смотрит на тебя. Глаза ясные. Жар отступил: это бывает, говорила сестра в Люнебурге. Ясный промежуток.\n\n— Ty jesteś z dołu. Von unten. Du hast Pan Kulka gestreichelt.\n\nТы снизу. Ты {m:гладил|гладила} Пана Кульку.' },
      { text: 'У него на груди, под одеялом, что-то твёрдое. Жестяная коробка из-под печенья, с велосипедным замком на пять колёсиков.' },
      { when: v('$.c27_k', 'ask'), text: 'Что случилось, Вессель рассказал в двух фразах, пока вы несли мальчика в дом. Ты помнишь каждое слово.' },
      { when: v('$.c27_k', 'take'), text: 'Руки ещё помнят вес мальчика: лёгкий, горячий, как грелка.' },
    ],
    actions: [
      { id: 'c27_bt_book', label: 'Найти книжку и читать вслух', minutes: 60, terminal: true, goto: 'c27_b_kasia',
        text: 'В шкафу Хенрике — детская книжка, с картинками, про ежа, который потерял шапку. По-немецки. Ты читаешь медленно, с ошибками. Тим поправляет тебя шёпотом. На последней странице он смеётся: ёж нашёл шапку на голове у совы.', effects: [set27('bt', 'book'), npc('c27_tim', 3), npc('kasia', 2), until27(7, 0)] },
      { id: 'c27_bt_barmbek', label: 'Рассказывать про Бармбек: дом, лестница, двор', minutes: 60, terminal: true, goto: 'c27_b_kasia',
        text: 'Ты рассказываешь: про лифт, который застревал между третьим и четвёртым, про Окафора и его кота, про пекарню на углу. Тим перебивает: «Und der Kiosk? Bei Farid?» А киоск? У Фарида? Ты рассказываешь про киоск. Он засыпает на Фариде, с улыбкой.', effects: [set27('bt', 'barmbek'), npc('c27_tim', 2), npc('kasia', 3, 'c27_you_told_him_home'), until27(7, 0)] },
      { id: 'c27_bt_quiet', label: 'Сидеть рядом молча и держать его за руку', minutes: 60, terminal: true, goto: 'c27_b_kasia',
        text: 'Рука горячая и маленькая. Он держится за твой палец, как младенец. Кася смотрит на вас и тихо плачет, не вытирая лица.', effects: [set27('bt', 'quiet'), npc('c27_tim', 1), until27(7, 0)] },
    ] }),

  B({ id: 'c27_b_kasia', title: 'Кася', camp: kitchen14,
    text: [
      { text: 'Кася выходит с тобой в сени. Говорит по-немецки, медленно, подбирая слова, иногда переходя на польский.' },
      { text: '— Die Ärztin hat gesagt: Stunden. Vielleicht ein Tag. Nicht mehr. Er ist jetzt klar, das kommt manchmal am Ende. Dann kommt das Fieber zurück. Und dann… dann ist er nicht mehr er.\n\nВрач сказала: часы. Может быть, сутки. Не больше. Сейчас он в ясном сознании, так иногда бывает в конце. Потом жар вернётся. А потом… потом это будет уже не он.' },
      { text: '— Ich will nicht, dass er hinter Glas stirbt. Unter Fremden. Ich will, dass er bei Leuten ist, die er kennt. Und danach… — Она берёт тебя за руку. — Danach soll es nicht die Armee machen. Bitte. Du warst bei ihm am ersten Tag. Du.\n\nЯ не хочу, чтобы он умер за стеклом. Среди чужих. Я хочу, чтобы он был с теми, кого знает. А потом… Потом пусть это сделает не армия. Пожалуйста. Ты {m:был|была} с ним в первый день. Ты.' },
      { text: 'Кася в том же свитере, что вчера. Глаза красные, но сухие. Она держит в руках кружку с остывшим чаем и не пьёт.' },
    ],
    actions: [
      { id: 'c27_bk_promise', label: 'Пообещать: ты будешь рядом до конца', minutes: 20, terminal: true, goto: 'c27_b_box',
        text: 'Кася кивает. Не благодарит. Просто кивает, как будто подписали договор. Возвращается к Тиму и садится на прежнее место.', effects: [set27('bk', 'promise'), truthB, w27('b_promised_kasia', true), npc('kasia', 3, 'c27_promised'), until27(7, 30)] },
      { id: 'c27_bk_ask', label: 'Сказать: решать будем вдвоём, с {A.ins}', minutes: 20, terminal: true, goto: 'c27_b_box',
        text: '— Natürlich. — Кася отпускает твою руку. — Zu zweit. Wie Dariusz und ich. Früher.\n\nКонечно. Вдвоём. Как мы с Дариушем. Раньше.\n\nО Дариуше она больше не говорит. Ты не спрашиваешь.', effects: [set27('bk', 'ask'), truthB, until27(7, 30)] },
      { id: 'c27_bk_dariusz', label: 'Спросить, где Дариуш', minutes: 25, terminal: true, goto: 'c27_b_box',
        text: '— In Lüneburg. Auf dem Feld hinter der Kaserne. Am zwanzigsten. — Кася говорит ровно. — Er hat den Wagen gegen die Wand gefahren, damit die von der Wäscherei nicht reinkommen. Tim weiß es nicht. Er glaubt, Papa ist im Osten und holt Benzin.\n\nВ Люнебурге. На поле за казармой. Двадцатого. Он загнал машину в стену, чтобы те, со стороны прачечной, не прошли. Тим не знает. Он думает, папа на востоке и везёт бензин.', effects: [set27('bk', 'dariusz'), truthB, w27('dariusz_dead', true), until27(7, 40)] },
    ] }),

  B({ id: 'c27_b_box', title: 'Коробка', camp: kitchen14,
    text: [
      { text: 'Тим проснулся. Он держит на груди жестяную коробку и дёргает замок слабыми пальцами.\n\n— Mama hat das Wort vergessen. Ich weiß es. Aber ich sag es nicht. Rate.\n\nМама забыла слово. Я знаю. Но не скажу. Угадай.' },
      { text: 'Пять колёсиков с буквами. Сейчас набрано «AAAAA». Кася виновато пожимает плечами.' },
    ],
    actions: boxActions('c27_bx') }),

  B({ id: 'c27_b_box2', title: 'Ещё раз', camp: kitchen14,
    text: [
      { text: 'Тим смотрит, как ты крутишь колёсики. Улыбается краем рта. Устал. Глаза закрываются и открываются.' },
    ],
    actions: boxActions('c27_bx2') }),

  B({ id: 'c27_b_lea', title: 'Сколько', camp: kitchen14,
    text: [
      { when: leaNear, text: 'В десять приходит Лея. Из пункта, по снегу, пешком: Нина сбегала за ней на рассвете. Она снимает куртку, моет руки и садится к Тиму. Смотрит зрачки, слушает дыхание, щупает лимфоузлы на шее. Долго.\n\nВыходит к тебе в сени.\n\n— Stunden. Heute Abend kommt das Fieber. Heute Nacht… — Она не договаривает.\n\nЧасы. Вечером вернётся жар. Ночью…' },
      { when: not(leaNear), text: 'В десять Эва приносит манную кашу в маленькой кастрюле.\n\n— Ich koche ihm Grießbrei. Den mögen alle Kinder. Auch die kranken.\n\nЯ сварила ему манку. Её любят все дети. И больные тоже.\n\nТим съедает три ложки и отворачивается.' },
      { when: leaNear, text: 'Лея сидит на краю кровати и считает пульс по часам, шевеля губами. Потом записывает на ладони шариковой ручкой.' },
    ],
    actions: [
      { id: 'c27_bl_ask', label: 'Спросить: можно хоть что-то сделать?', minutes: 20, terminal: true, goto: 'c27_b_fufu',
        outcomes: [
          { id: 'lea', when: leaNear, text: '— Ihm nicht weh tun lassen. Das ist alles. — Лея достаёт из кармана две ампулы. — Morphin. Von Sander. Für heute Nacht. Eine. Wenn er unruhig wird. Nicht beide.\n\nНе дать ему мучиться. Это всё. Морфин. От Зандер. На ночь. Одну. Если станет беспокойным. Не обе.', effects: [set27('bl', 'ask'), { give: 'c27_morphine', qty: 2 }, w27('morphine', true)] },
          { id: 'eva', text: 'Эва качает головой.\n\n— Nur da sein. Mehr kann man nicht.\n\nТолько быть рядом. Больше нельзя.', effects: [set27('bl', 'ask')] },
        ], effects: [truthB, until27(10, 30)] },
      { id: 'c27_bl_kasia', label: 'Пойти к Касе и посидеть с ней', minutes: 40, terminal: true, goto: 'c27_b_fufu',
        text: 'Ты садишься рядом с Касей на пол. Вы молчите. Тим спит. Иногда он вздрагивает во сне и зовёт кого-то по-польски. Кася гладит его по голове, не просыпаясь сама, кажется.', effects: [set27('bl', 'kasia'), truthB, npc('kasia', 2), until27(11, 0)] },
      { id: 'c27_bl_nina', label: 'Выйти к Нине: она весь день у двери', minutes: 30, terminal: true, goto: 'c27_b_fufu',
        text: 'Нина сидит у двери на корточках.\n\n— Можно мне к нему? На минуту?\n\nТы пускаешь. Она садится у дивана и показывает Тиму свою тетрадь: клетку, ядро, митохондрию. Он смотрит и говорит: «Wie eine Pizza». Как пицца. Нина смеётся сквозь слёзы.', effects: [set27('bl', 'nina'), truthB, npc('c7_nina', 2), npc('c27_tim', 1), until27(10, 50)] },
    ] }),

  B({ id: 'c27_b_fever', title: 'Полдень', camp: kitchen14,
    text: [
      { text: 'К полудню жар возвращается. Тим горячий, сухой, дышит часто. Он ещё узнаёт Касю. Тебя — через раз.' },
      { when: boxOpen, text: 'Гармошка у него в кулаке. Иногда он подносит её к губам и дует. Звук тихий, одна нота.' },
      { text: 'Окно приоткрыто на щель: нужен воздух. Занавеска шевелится. На подоконнике стоит стакан воды с трубочкой.' },
    ],
    actions: [
      { id: 'c27_bf_cool', label: 'Обтирать его мокрым полотенцем', minutes: 120, terminal: true, goto: 'c27_b_eva',
        text: 'Холодная вода, полотенце, лоб, шея, запястья. Снова. Снова. Жар не уходит. Но Тим дышит ровнее, пока ты это делаешь. Ты не останавливаешься два часа.', effects: [set27('bf', 'cool'), { body: 'fatigue', delta: 6 }, until27(12, 0)] },
      { id: 'c27_bf_sing', label: 'Петь ему, что помнишь', minutes: 120, terminal: true, goto: 'c27_b_eva',
        text: 'Ты поёшь по-русски, колыбельную. Кася узнаёт мелодию: у поляков есть похожая. Она начинает подпевать по-польски. Две колыбельные на одну мелодию. Тим засыпает.', effects: [set27('bf', 'sing'), npc('kasia', 2), until27(12, 0)] },
      { id: 'c27_bf_kasia', label: 'Отправить Касю поспать, сесть вместо неё', minutes: 120, terminal: true, goto: 'c27_b_eva',
        text: 'Кася не хочет. Потом соглашается на час. Спит на полу у стены, свернувшись, в пальто. Ты сидишь у Тима. Он открывает глаза, смотрит на тебя и спрашивает: «Wo ist Mama?» Ты показываешь. Он кивает и снова закрывает глаза.', effects: [set27('bf', 'kasia'), npc('kasia', 3), { body: 'fatigue', delta: 4 }, until27(12, 0)] },
    ] }),

  B({ id: 'c27_b_ute', title: 'Уте', camp: kitchen14,
    text: [
      { text: 'В три приходит Уте. Сама, никто не звал. В двух платках, с вязанием.\n\n— Ich weiß, wie man wartet, — говорит она Касе, по-немецки, медленно. Я знаю, как ждать.' },
      { text: 'Она садится рядом с Касей на пол и начинает вязать. Кася смотрит на спицы. Через минуту её плечи опускаются.' },
      { text: 'Уте приносит с собой холод и запах печного дыма. Валенки она снимает у порога и проходит к Тиму в носках, бесшумно.' },
    ],
    actions: [
      { id: 'c27_bu_leave', label: 'Оставить их вдвоём и выйти подышать', minutes: 60, terminal: true, goto: 'c27_b_dusk',
        text: 'Ты стоишь на крыльце. Снег. Тишина. В сарае курицы. В доме двое матерей сидят у постели ребёнка. Одна уже похоронила сына. Другая скоро похоронит.', effects: [set27('bu', 'leave'), { body: 'stress', delta: -2 }, until27(15, 30)] },
      { id: 'c27_bu_stay', label: 'Сесть с ними третьей', minutes: 90, terminal: true, goto: 'c27_b_dusk',
        text: 'Вы сидите втроём. Уте вяжет. Кася держит руку Тима. Ты держишь Касю за плечо. Никто не говорит. За окном темнеет.', effects: [set27('bu', 'stay'), npc('c14_ute', 2), npc('kasia', 2), until27(16, 0)] },
      { id: 'c27_bu_eva', label: 'Помочь Эве на кухне: людей много', minutes: 60, terminal: true, goto: 'c27_b_dusk',
        text: 'Эва режет картошку. Ты чистишь лук. Эва говорит, не поднимая головы: «Gut, dass ihr sie aufgenommen habt. Gut». Хорошо, что вы их приняли. Хорошо.', effects: [set27('bu', 'eva'), npc('c8_eva', 1), until27(15, 30)] },
    ] }),

  B({ id: 'c27_b_dusk', title: 'Сумерки', camp: kitchen14,
    text: [
      { text: 'К пяти Тим больше не узнаёт Касю. Смотрит на неё и мимо. Дышит быстро. Пальцы перебирают одеяло, как будто ищут что-то.' },
      { text: 'Кася встаёт и выходит к тебе. Лицо сухое.\n\n— Jetzt. Es ist soweit. Nicht heute Nacht. Bald. — Она смотрит тебе в глаза. — Du hast gesagt, du bist da. Bis zum Ende. Und danach.\n\nСейчас. Уже. Не ночью. Скоро. Ты {m:обещал|обещала}, что будешь рядом. До конца. И после.' },
      { when: not(flag('w.c27_b_promised_kasia')), text: 'Ты не {m:обещал|обещала}. Она помнит иначе. Ты не поправляешь.' },
      { text: 'Свет за окном уходит быстро. Там, где лежит Тим, зажигают свечу. Кася садится ближе и берёт его руку.' },
      { when: v('$.c27_bu', 'leave'), text: 'На крыльце ты {m:простоял|простояла} полчаса. Мороз выдул из головы всё, кроме одного.' },
    ],
    actions: [
      { id: 'c27_bd_stay', label: 'Сказать: я здесь', minutes: 60, terminal: true, goto: 'c27_supper',
        text: 'Кася кивает и возвращается к Тиму. Ты идёшь за ней и садишься у двери. Тим дышит. Часы на кухне отстают на четыре минуты.', effects: [set27('bd', 'stay'), truthB, until27(18, 25)] },
      { id: 'c27_bd_a', label: 'Сказать: сейчас позову {A.acc}, решим вместе', minutes: 40, terminal: true, goto: 'c27_supper',
        text: 'Кася кивает. Она не спорит. Она просто возвращается к Тиму. Ты идёшь искать {A.acc} и находишь его во дворе, у «Вольфа» Тобиаса.', effects: [set27('bd', 'a'), truthB, until27(18, 0)] },
      { id: 'c27_bd_hold', label: 'Взять его на руки, пока он ещё узнаёт', minutes: 30, terminal: true, goto: 'c27_supper',
        text: 'Ты поднимаешь его вместе с одеялом. Он лёгкий, как свёрток с бельём. Он смотрит на тебя, потом на Касю, потом снова на тебя, и говорит одно слово: «Lift». Лифт. Ты не понимаешь. Кася понимает и закрывает лицо руками.', effects: [set27('bd', 'hold'), npc('kasia', 2), { body: 'stress', delta: 3 }, until27(18, 0)] },
    ] }),
];

