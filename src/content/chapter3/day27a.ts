import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { S27, brandt27, inShed, oleHome27, set27, snow27, until27, w27 } from './point27';

// Участок 27, линия A: фургон и Вессель, записка Тобиаса (патруль в шесть утра), деревня по `w.c26_brandt`, Нина, Тобиас в четыре.
// Половина A: что будет с домом и с Весселем, если мальчика найдут; второй раз — «вон из списка».
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S27({ ...scene, for: 'any', chapter: 'ch3' });
const held: Cond = flag('w.c18_a_held');
const leoDrawing: Cond = any(flag('w.c24_leo_drawing'), { has: 'c25_leo_drawing' });
const truthA = set27('a_truth', true);
const afterVillage = [{ id: 'w', when: v('w.c27_van', 'hidden'), goto: 'c27_a_wessel' }, { id: 'n', goto: 'c27_a_nina' }];

export const day27AScenes: Scene[] = [
  A({ id: 'c27_a_van', title: 'Фургон', camp: yard14, ambient: snow27,
    text: [
      { text: 'Вессель стоит у фургона и курит, прикрывая огонёк ладонью. Рассветёт через два часа.' },
      { text: '— In Lüneburg suchen sie schon. Ein Kind aus der Station, mit der Mutter weg. Das ist kein Kinderstreich für die. Das ist „ein infizierter Transport“.\n\nВ Люнебурге уже ищут. Ребёнок из палаты, с матерью. Для них это не детская шалость. Это «вывоз инфицированного».' },
      { text: '— Und mich nehmen sie vom Wagen, wenn sie es rausfinden. Kein Wagen, keine Ration. Und keine Fahrt nach Osten im Dezember.\n\nА меня снимут с фургона, если узнают. Нет фургона — нет пайка. И никакой поездки на восток в декабре.' },
      { text: 'Фургон весь в грязи по самые окна. На боку выцветшая надпись прачечной, и под ней кто-то нацарапал гвоздём: «Danke Wessel». Мотор ещё горячий, от капота идёт пар.' },
      { when: v('$.c27_k', 'ask'), text: 'Что случилось, Вессель рассказал в двух фразах, пока вы несли мальчика в дом. Остальное — сейчас, у фургона.' },
      { when: v('$.c27_k', 'take'), text: 'Руки ещё помнят вес мальчика: лёгкий, горячий, как грелка. Ты донёс{m:|ла} его до кровати и только там понял{m:|а}, что он не открыл глаз.' },
    ],
    actions: [
      { id: 'c27_av_hide', label: 'Загнать фургон за сеновал, под брезент', minutes: 30, activity: 'moderate', terminal: true, goto: 'c27_x_a_cargo',
        text: 'Фургон встаёт за сеновалом, носом к лесополосе. Вы накрываете его брезентом от трактора, края придавливаете жердями. С дороги не видно. С воздуха — может быть.', effects: [set27('av', 'hide'), w27('van', 'hidden'), npc('c27_wessel', 2), until27(6, 20)] },
      { id: 'c27_av_back', label: 'Сказать Весселю: уезжай сейчас, до света. Ты ничего не видел', minutes: 20, terminal: true, goto: 'c27_x_a_cargo',
        text: 'Вессель смотрит на дом, на окно, где горит лампа.\n\n— Ich habe nichts gesehen. Ich habe Wäsche gefahren. — Он бросает окурок в снег. — Viel Glück. Euch allen.\n\nЯ ничего не видел. Я возил бельё. Удачи. Вам всем.\n\nФургон уезжает без фар. В Люнебург он вернётся к утренней смене, как будто ничего не было.', effects: [set27('av', 'back'), w27('van', 'gone'), { npc: 'c27_wessel', moveTo: 'c18_lueneburg' }, npc('c27_wessel', 3, 'c27_they_sent_me_back'), until27(6, 0)] },
      { id: 'c27_av_ask', label: 'Спросить, почему он не развернулся на мосту', minutes: 25, terminal: true, goto: 'c27_x_a_cargo',
        text: '— Weil meine Frau auch in so einem Bett lag. In Buchholz. Und keiner hat sie rausgeholt. — Он затягивается. — Das ist alles. Mehr Gründe hab ich nicht.\n\nПотому что моя жена тоже лежала в такой кровати. В Бухгольце. И никто её не вынес. Вот и всё. Других причин у меня нет.\n\nФургон вы всё-таки загоняете за сеновал.', effects: [set27('av', 'ask'), w27('van', 'hidden'), npc('c27_wessel', 2), until27(6, 20)] },
    ] }),

  A({ id: 'c27_a_note', title: 'Записка', camp: kitchen14, onEnter: [until27(8, 0)],
    text: [
      { text: 'В восемь у ворот звонит велосипед. Лукас, сын пожарного. Он передаёт сложенный листок и уезжает, не дожидаясь ответа.' },
      { text: 'Почерк Тобиаса, торопливый:\n\n«Sie suchen einen Jungen aus Lüneburg. Patrouille geht die Höfe ab. Bei euch morgen um sechs. Ich komme heute um vier. Allein, wenn ich kann. Verbrennt das. T.»\n\nИщут мальчика из Люнебурга. Патруль идёт по дворам. У вас завтра в шесть. Я приду сегодня в четыре. Один, если смогу. Сожгите.' },
      { when: held, text: 'Ты {m:предупреждён|предупреждена}. Восемнадцатого. Второй раз — это не бумага. Это список. Без списка нет пайка. Без пайка в доме, где кормят одиннадцать человек, — две недели.' },
      { text: 'Листок мятый, сложенный вчетверо, ещё тёплый от кармана Лукаса.' },
    ],
    actions: [
      { id: 'c27_an_burn', label: 'Сжечь записку в печи', minutes: 10, terminal: true, goto: 'c27_x_a_milk',
        text: 'Бумага вспыхивает и сворачивается. Ты смотришь, пока не остаётся пепел. Слова ты запомнил{m:|а}.', effects: [set27('an', 'burn'), truthA, until27(8, 20)] },
      { id: 'c27_an_keep', label: 'Сохранить: {B} должна это видеть', minutes: 10, terminal: true, goto: 'c27_x_a_milk',
        text: 'Ты убираешь записку во внутренний карман. Если её найдут, Тобиасу конец. Ты знаешь это и всё равно не сжигаешь.', effects: [set27('an', 'keep'), truthA, { give: 'c27_tobias_note' }, until27(8, 15)] },
      { id: 'c27_an_count', label: 'Сесть и пересчитать, что потеряет дом', minutes: 30, terminal: true, goto: 'c27_x_a_milk',
        text: 'Паёк — половина или ничего. Машина уже у Брандта. Защита — никакой: кто вне списка, к тому могут прийти за чем угодно. Нина. Эва. Оле, если вернётся. Ты пишешь цифры на полях бумаги Брандта и зачёркиваешь.', effects: [set27('an', 'count'), truthA, { body: 'stress', delta: 3 }, until27(8, 40)] },
    ] }),

  A({ id: 'c27_a_village', title: 'Деревня', camp: yard14, ambient: snow27, onEnter: [until27(10, 0)],
    text: [
      { when: brandt27('ally'), text: 'В десять у ворот Уве, рыжеусый пожарный. Без каски, без ружья. С одеялом под мышкой.\n\n— Brandt sagt: bis morgen früh sieht keiner was. Danach kann er nichts mehr. — Он отдаёт одеяло. — Für den Kleinen. Von meiner Frau.\n\nБрандт говорит: до завтрашнего утра никто ничего не видит. Потом он ничего не сможет. Для малыша. От моей жены.' },
      { when: brandt27('hostile'), text: 'В десять у ворот «Мерседес» пожарной части. Брандт сам. С ним двое с ружьями. Он не выходит из машины. Опускает стекло.\n\n— Ich habe gehört, ihr habt Besuch aus Lüneburg. — Пауза. — Morgen um sechs. Und dann will ich keine Lügen hören.\n\nЯ слышал, у вас гости из Люнебурга. Завтра в шесть. И тогда я не хочу слышать вранья.' },
      { when: all(not(brandt27('ally')), not(brandt27('hostile'))), text: 'Из деревни никто не приходит. В десять мимо ворот проезжает трактор, не сбавляя хода. Тракторист смотрит прямо перед собой.' },
    ],
    actions: [
      { id: 'c27_avl_thanks', label: 'Поблагодарить Уве', when: brandt27('ally'), minutes: 15, terminal: true, outcomes: afterVillage,
        text: '— Nicht mir. — Уве уже уходит. — Der Alte hat seit Mittwoch nicht geschlafen. Er sitzt bei Mats und guckt ihn an.\n\nНе мне. Старик со среды не спит. Сидит у Матса и смотрит на него.', effects: [set27('avl', 'thanks'), w27('uwe_blanket', true), until27(10, 20)] },
      { id: 'c27_avl_silent', label: 'Выдержать его взгляд и промолчать', when: brandt27('hostile'), minutes: 15, terminal: true, outcomes: afterVillage,
        text: 'Брандт смотрит. Ты смотришь. Он поднимает стекло первым. Машина уезжает.', effects: [set27('avl', 'silent'), w27('brandt_warned', true), until27(10, 20)] },
      { id: 'c27_avl_ask', label: 'Спросить Брандта, что будет с мальчиком, если его найдут', when: brandt27('hostile'), minutes: 15, terminal: true, outcomes: afterVillage,
        text: '— Das entscheidet die Armee. Nicht ich. — Брандт смотрит на дом. — Ich entscheide nur, wer auf der Liste steht.\n\nЭто решает армия. Не я. Я решаю только, кто в списке.', effects: [set27('avl', 'ask'), w27('brandt_warned', true), truthA, until27(10, 20)] },
      { id: 'c27_avl_road', label: 'Постоять у ворот и посмотреть на дорогу', when: all(not(brandt27('ally')), not(brandt27('hostile'))), minutes: 20, terminal: true, outcomes: afterVillage,
        text: 'Дорога пустая. Деревня молчит. Это не значит, что она не знает. Это значит, что ей всё равно. Или страшно.', effects: [set27('avl', 'road'), until27(10, 20)] },
    ] }),

  A({ id: 'c27_a_wessel', title: 'Вессель на сеновале', camp: yard14, ambient: snow27,
    text: [
      { text: 'Вессель сидит на сеновале, у фургона, на перевёрнутом ящике. Курит. Ушанка на коленях.' },
      { text: '— Ich kann nicht zurück, — говорит он, не оборачиваясь. — Und ich kann nicht hierbleiben. Und nach Osten fahren die Polen ohne mich, wenn ich keinen Wagen habe.\n\nНазад я не могу. Остаться здесь тоже. А на восток поляки уедут без меня, если у меня не будет машины.' },
      { text: 'Сено вокруг него не примято: он так и не ложился. Окурки он складывает в консервную банку, аккуратно, чтобы не было пожара.' },
    ],
    actions: [
      { id: 'c27_aw_stay', label: 'Сказать: оставайся, пока не решится', minutes: 30, terminal: true, goto: 'c27_a_nina',
        text: 'Вессель кивает и тушит окурок о подошву.\n\n— Bis morgen früh. Dann sehen wir.\n\nДо завтрашнего утра. Там посмотрим.\n\nОн снимает с фургона брезент, достаёт из кабины термос и протягивает тебе. Кофе. Настоящий.', effects: [set27('aw', 'stay'), { body: 'fatigue', delta: -3 }, npc('c27_wessel', 2), until27(11, 0)] },
      { id: 'c27_aw_wife', label: 'Спросить про жену', minutes: 30, terminal: true, goto: 'c27_a_nina',
        text: '— Renate. Sie hat in der Kantine von Station vier gearbeitet. Dann war sie krank, und dann war sie gesund, und dann hieß sie Spenderin. — Он смотрит на свои руки. — Am zwölften haben sie die Station mit Bussen geräumt. Ich war auf Tour. Ich weiß nicht mal, in welche Richtung.\n\nРената. Работала в столовой четвёртого отделения. Потом заболела, потом выздоровела, и потом её стали звать донором. Двенадцатого отделение вывезли автобусами. Я был в рейсе. Даже не знаю, в какую сторону.', effects: [set27('aw', 'wife'), w27('renate', true), npc('c27_wessel', 2), until27(11, 0)] },
      { id: 'c27_aw_east', label: 'Спросить про колонну на восток', minutes: 30, terminal: true, goto: 'c27_a_nina',
        text: '— Zehnter Dezember. Von der Konservenfabrik in Winsen. Polen, Tschechen, ein paar Deutsche, die da Verwandte haben. — Вессель пожимает плечами. — Die nehmen jeden mit Wagen und Benzin. Ohne Wagen nur, wenn man was kann. Ärzte, Mechaniker.\n\nДесятого декабря. От консервного завода в Винзене. Поляки, чехи, несколько немцев, у которых там родня. Берут всех, у кого машина и бензин. Без машины — только если что-то умеешь. Врачей, механиков.', effects: [set27('aw', 'east'), w27('east_known', true), until27(11, 0)] },
    ] }),

  A({ id: 'c27_a_nina', title: 'Нина', camp: kitchen14,
    text: [
      { text: 'Нина сидит на лестнице, на третьей ступеньке. Не плачет. Смотрит на дверь, за которой Тим.' },
      { text: '— Он станет как те? — спрашивает она тебя. — Как папа? Скоро?' },
      { when: leoDrawing, text: 'В руках у неё рисунок Лео: дом, труба, пятеро.' },
      { text: 'Голос у неё ровный. Она уже спрашивала у Эвы. Теперь спрашивает тебя, как спрашивают последнего, кто может сказать правду.' },
    ],
    actions: [
      { id: 'c27_ann_truth', label: 'Сказать правду: да. Скоро', minutes: 20, terminal: true, goto: 'c27_a_pear',
        text: 'Нина кивает. Долго молчит.\n\n— Тогда я не буду туда ходить. Чтобы он помнил меня как раньше. Ну, как вчера. Он меня вчера не знал. Но всё равно.\n\nОна уходит наверх тихо, по одной ступеньке.', effects: [set27('ann', 'truth'), npc('c7_nina', 1), until27(11, 0)] },
      { id: 'c27_ann_hold', label: 'Обнять её и ничего не говорить', minutes: 20, terminal: true, goto: 'c27_a_pear',
        text: 'Ты садишься рядом и обнимаешь её. Нина сначала каменная, потом утыкается тебе в плечо. Вы сидите, пока внизу Эва не начинает греметь кастрюлями.', effects: [set27('ann', 'hold'), npc('c7_nina', 2), until27(11, 0)] },
      { id: 'c27_ann_task', label: 'Дать ей дело: пусть отнесёт Касе чаю', minutes: 15, terminal: true, goto: 'c27_a_pear',
        text: 'Нина берёт кружку обеими руками и идёт. Через минуту возвращается без кружки.\n\n— Кася сказала спасибо. По-польски. Я поняла.', effects: [set27('ann', 'task'), npc('c7_nina', 1), npc('kasia', 1), until27(10, 45)] },
    ] }),

  A({ id: 'c27_a_chores', title: 'День', camp: yard14, ambient: snow27,
    text: [
      { text: 'День тянется. Куры, дрова, вода. Обычные дела, которые надо делать, даже когда в доме умирает ребёнок.' },
      { when: oleHome27, text: 'Оле сидит у печи, бледный, с кружкой. Он смотрит на дверь комнаты, где Тим, и молчит. Он видел таких детей. Каждый день.' },
      { when: flag('w.c27_ole_last'), text: 'Ты думаешь об Оле. В Люнебурге. Ему сказали «решай сам». Ты не знаешь, что он решил.' },
      { text: 'В доме тихо по-особому: все ходят на цыпочках, даже Эва. Только часы тикают, как будто им никто не сказал.' },
      { when: v('$.c27_ap4', 'no'), text: 'Под грушей ты так ничего и не {m:тронул|тронула}. Не пока он жив.' },
      { text: 'Колун стоит у колоды, воткнутый в чурку. Ты берёшься за него просто чтобы занять руки.' },
    ],
    actions: [
      { id: 'c27_ac_wood', label: 'Колоть дрова до темноты', minutes: 60, activity: 'heavy', terminal: true, goto: 'c27_a_broth', ambientDuring: snow27,
        text: 'Колун поднимается и падает. Поднимается и падает. Ты не считаешь поленья. Ты не думаешь. К четырём поленница выше тебя.', effects: [set27('ac', 'wood'), { body: 'fatigue', delta: 12 }, { body: 'stress', delta: -3 }, until27(13, 0)] },
      { id: 'c27_ac_ole', label: 'Сесть рядом с Оле', when: oleHome27, minutes: 60, terminal: true, goto: 'c27_a_broth',
        text: '— Die Kleine am Fenster in Lüneburg, — говорит Оле, не глядя на тебя. Малышка у окна в Люнебурге. — Sie hieß Mia. Ich hab ihr jeden Tag einen Witz erzählt. Am Dienstag hab ich keinen mehr gewusst.\n\nЕё звали Мия. Я каждый день рассказывал ей анекдот. Во вторник ни одного не вспомнил.\n\nВы сидите до четырёх. Говорить больше не нужно.', effects: [set27('ac', 'ole'), npc('ole', 2), until27(13, 0)] },
      { id: 'c27_ac_watch', label: 'Сидеть у окна наверху и смотреть на дорогу', minutes: 60, terminal: true, goto: 'c27_a_broth',
        text: 'Дорога пустая. Один раз проезжает трактор. Один раз проходит женщина с санками. В три у лесополосы встаёт Почтальон, лицом к хутору. Стоит до сумерек.', effects: [set27('ac', 'watch'), until27(13, 0)] },
      { id: 'c27_ac_water', label: 'Натаскать воды в бак и нагреть: Касе и мальчику помыться', minutes: 70, activity: 'moderate', terminal: true, goto: 'c27_a_broth', ambientDuring: snow27,
        text: 'Восемь вёдер от колонки, бак на плиту. К часу вода горячая. Кася моет Тима тёплой тряпкой, медленно, как маленького, а ты стоишь за дверью и держишь полотенце. Потом она моется сама, впервые за неделю, и выходит в чужой кофте другой женщиной.', effects: [set27('ac', 'water'), npc('kasia', 1), { body: 'fatigue', delta: 6 }, until27(13, 0)] },
    ] }),

  A({ id: 'c27_a_tobias', title: 'Тобиас', camp: yard14, ambient: snow27,
    text: [
      { text: 'В четыре «Вольф». Тобиас один. Он глушит мотор и сидит минуту, держа руки на руле. Потом выходит.' },
      { text: '— Wie lange noch?\n\nСколько ещё?\n\nТы не знаешь. Это знает {B}.' },
      { text: '— Morgen um sechs kommt die Patrouille. Mit mir. Und mit einem Leutnant aus Lüneburg. Der hat einen Befehl: das Kind zurückbringen oder „vor Ort entscheiden“. — Тобиас смотрит на дом. — Ich kann den Leutnant eine Stunde aufhalten. Nicht mehr.\n\nЗавтра в шесть придёт патруль. Со мной. И с лейтенантом из Люнебурга. У него приказ: вернуть ребёнка или «решить на месте». Я могу задержать лейтенанта на час. Не больше.' },
      { text: '— Und wenn es heute Nacht soweit ist — holt mich. Nicht Brandt. Nicht die Armee. Mich. Ich mache das so, dass die Mutter es nicht sieht.\n\nА если это случится сегодня ночью, позовите меня. Не Брандта. Не армию. Меня. Я сделаю так, чтобы мать не видела.' },
    ],
    actions: [
      { id: 'c27_at_promise', label: 'Пообещать: если ночью — позовём тебя', minutes: 20, terminal: true, goto: 'c27_a_dusk',
        text: 'Тобиас кивает. Даёт тебе ракету, красную, в картонном цилиндре.\n\n— Wenn ihr mich braucht. Ich sehe sie von der Wache.\n\nЕсли понадоблюсь. Я увижу из караулки.', effects: [set27('at', 'promise'), w27('tobias_flare', true), { give: 'c20_flare' }, truthA, npc('c15_tobias', 2), until27(16, 40)] },
      { id: 'c27_at_hour', label: 'Попросить задержать лейтенанта до семи', minutes: 20, terminal: true, goto: 'c27_a_dusk',
        text: '— Bis sieben. — Тобиас считает на пальцах. — Ich sage, der Wolf springt nicht an. Bei dem Frost glaubt das jeder.\n\nДо семи. Скажу, что «Вольф» не заводится. В такой мороз в это любой поверит.', effects: [set27('at', 'hour'), w27('tobias_delay', true), truthA, npc('c15_tobias', 1), until27(16, 30)] },
      { id: 'c27_at_why', label: 'Спросить, почему он это делает', minutes: 25, terminal: true, goto: 'c27_a_dusk',
        text: '— Meine Mutter liegt unter eurem Birnbaum. — Тобиас надевает перчатку. — Das ist der ganze Grund. Und dass ich morgen früh nicht derjenige sein will, der „vor Ort entscheidet“.\n\nМоя мать лежит под вашей грушей. Вот и вся причина. И ещё: завтра утром я не хочу быть тем, кто «решает на месте».', effects: [set27('at', 'why'), truthA, npc('c15_tobias', 2), until27(16, 40)] },
    ] }),
  A({ id: 'c27_a_dusk', title: 'Сумерки', camp: yard14, ambient: snow27,
    text: [
      { when: not(inShed), text: 'Темнеет. В окне швейной комнаты горит свеча. Там Кася, Тим и {B}.' },
      { when: inShed, text: 'Темнеет. В щели сарая горит свеча. Там Кася, Тим и {B}.' },
      { text: 'Ты стоишь во дворе и не знаешь, куда себя деть.' },
      { text: 'Из трубы поднимается дым, ровный, как в обычный день. В курятнике шуршат куры, устраиваясь на ночь. Мир делает вид, что ничего не происходит.' },
      { when: flag('w.c27_tobias_flare'), text: 'Красная ракета Тобиаса лежит у тебя в кармане: картонный цилиндр, тёплый от руки. Ты то и дело трогаешь его пальцами, как трогают ключи перед дорогой.' },
      { when: flag('w.c27_tobias_delay'), text: 'Тобиас обещал задержать лейтенанта на час. Час — это немного. Это всё, что у вас есть.' },
    ],
    actions: [
      { id: 'c27_ad_kasia', label: 'Зайти к Касе', minutes: 40, terminal: true, goto: 'c27_a_hut',
        text: 'Кася поднимает на тебя глаза. Тим дышит часто и мелко.\n\n— Nicht die Armee, — говорит она тебе. Только это. — Bitte. Nicht die.\n\nНе армия. Пожалуйста. Не они.\n\nТы стоишь в дверях, пока {B} не кивает тебе: иди.', effects: [set27('ad', 'kasia'), truthA, npc('kasia', 1), until27(17, 20)] },
      { id: 'c27_ad_water', label: 'Натаскать воды и дров на ночь, к ним и в дом', minutes: 60, activity: 'moderate', terminal: true, goto: 'c27_a_hut', ambientDuring: snow27,
        text: 'Два ведра воды к двери, охапка дров к печи. Ещё два, ещё охапка. Ты носишь, пока не перестаёт хватать места. Это единственное, что ты сейчас можешь сделать руками.', effects: [set27('ad', 'water'), { body: 'fatigue', delta: 5 }, until27(17, 20)] },
      { id: 'c27_ad_gate', label: 'Проверить ворота и калитку', minutes: 30, terminal: true, goto: 'c27_a_hut', ambientDuring: snow27,
        text: 'Засов, цепь, колокольчик на задней калитке. Дорога пустая. У лесополосы никого: Почтальон ушёл до темноты.', effects: [set27('ad', 'gate'), until27(17, 20)] },
    ] }),
];

export const shedA27 = inShed;
