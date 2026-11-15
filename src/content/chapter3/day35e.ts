import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { okaforComes, oleHome33 } from './point33';
import { S35, frost35, jest35, kasia35, set35, until35, w35 } from './point35';

// Участок 35, дополнение (проверка объёма 15.11). A: Брандт просит остаться и держать округ; Оле (или Хенрике) — вещь в дорогу.
// B: Окафор наедине — что она ему скажет (это узнает A перед решением за неё); Кася хочет на восток (к ответу B за A о местах Тобиаса).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S35({ ...scene, for: 'any', chapter: 'ch3' });
const jestCamp = { at: jest35, stock: 'c3_farm_stock', rest: false as const };
const brandt: Cond = { npc: 'c16_brandt', alive: true };
const oleDead: Cond = flag('w.c27_ole_last');

export const day35EScenes: Scene[] = [
  X({ id: 'c35_a_brandt', title: 'Брандт', location: jest35, camp: jestCamp, ambient: frost35, onEnter: [until35(13, 0)],
    text: [
      { when: brandt, text: 'Когда ты уходишь с площади, тебя окликают из караулки. Брандт сидит у печки, рука в бинте поверх перчатки. На столе карта округа, вся в красном карандаше.' },
      { when: brandt, text: '— Tobias hat es dir gesagt. Ich sehe es an deinem Gesicht. — Он не спрашивает. — Ich bleibe. Einer muss. Und ich brauche Leute, die die Nacht an der Senke gesehen haben. Bleib. Hilf mir den Kreis halten.\n\nТобиас тебе сказал. Вижу по лицу. Я остаюсь. Кто-то должен. И мне нужны люди, которые видели ту ночь у впадины. Останься. Помоги мне удержать округ.' },
      { when: not(brandt), text: 'У караулки пусто. На двери приколота бумага: «Wehrleitung: Lukas Möller i.V.». Сыну пожарного пятнадцать лет. Он стоит у двери и смотрит на тебя, как будто ты что-то должен ему сказать.' },
      { text: 'Брандт сидит в караулке один, перед ним остывший кофе и стопка списков, перевязанная бечёвкой. На подоконнике лежит его каска, вверх дном, как миска.' },
    ],
    actions: [
      { id: 'c35_ab_yes', label: 'Сказать: если останемся, я с тобой', when: brandt, minutes: 40, terminal: true, goto: 'c35_a_home',
        text: 'Брандт кивает, тяжело, как будто это слово стоило ему больше, чем тебе. Протягивает левую руку. «Dann bist du ab heute bei der Wehr». Тогда с сегодняшнего дня ты в дружине. Записывает твоё имя в журнал первым на новой странице.', effects: [set35('ab', 'yes'), w35('brandt_ask', 'yes'), npc('c16_brandt', 2, 'c35_a_promised'), until35(13, 40)] },
      { id: 'c35_ab_no', label: 'Сказать честно: не знаю, останемся ли мы', when: brandt, minutes: 30, terminal: true, goto: 'c35_a_home',
        text: '— Ehrlich, — говорит Брандт. Честно. — Das ist mehr, als die meisten sagen. — Он отворачивается к карте. — Bis zum Vierzehnten. Dann ist es egal.\n\nЭто больше, чем говорит большинство. До четырнадцатого. Потом будет всё равно.', effects: [set35('ab', 'no'), w35('brandt_ask', 'maybe'), until35(13, 30)] },
      { id: 'c35_ab_why', label: 'Спросить: почему ты остаёшься? Тебя же возьмут', when: brandt, minutes: 40, terminal: true, goto: 'c35_a_home',
        text: 'Брандт долго смотрит на свою руку.\n\n— Meine Frau liegt hier. Mein Sohn auch. Seit Oktober. Und Hinnerk. Und der Junge von der Kolonie. — Он поднимает глаза. — Wohin soll ich denn?\n\nЗдесь лежит моя жена. И сын. С октября. И Хиннерк. И мальчишка из колонии. Куда мне идти?\n\nТы впервые видишь его без каски, без мегафона, без списка. Старый уставший человек.', effects: [set35('ab', 'why'), w35('brandt_ask', 'heard'), npc('c16_brandt', 1), until35(13, 40)] },
      { id: 'c35_ab_lukas', label: 'Сказать Лукасу: держись, мы рядом', when: not(brandt), minutes: 30, terminal: true, goto: 'c35_a_home',
        text: 'Лукас кивает слишком быстро. «Danke». Ему пятнадцать, и он теперь отвечает за округ. Ты уходишь и оглядываешься: он всё ещё стоит у двери.', effects: [set35('ab', 'lukas'), until35(13, 30)] },
    ] }),

  X({ id: 'c35_a_gift', title: 'В дорогу', camp: kitchen14, onEnter: [until35(16, 30)],
    text: [
      { when: oleHome33, text: 'Оле подзывает тебя к лавке. В руках у него старые часы на цепочке, отцовские, с треснувшим стеклом.\n\n— Wenn ihr geht. Damit ihr wisst, wann Frühling ist. — Он улыбается краем рта. — Sie gehen fünf Minuten nach. Immer schon.\n\nЕсли пойдёте. Чтобы знали, когда весна. Отстают на пять минут. Всегда отставали.' },
      { when: oleDead, text: 'Хенрике выносит из спальни серую вязаную шапку Оле и кладёт на стол перед тобой.\n\n— Wenn ihr geht. Er hätte gewollt, dass sie weiter warm hält.\n\nЕсли пойдёте. Он бы хотел, чтобы она и дальше грела.' },
      { when: all(not(oleHome33), not(oleDead)), text: 'Хенрике выносит из кладовки старую кожаную флягу мужа и ставит на стол перед тобой.\n\n— Wenn ihr geht. Für unterwegs.\n\nЕсли пойдёте. В дорогу.' },
      { text: 'На кухне пахнет яблоками и воском. Вещь лежит на столе между вами, и ты не сразу решаешься до неё дотронуться.' },
    ],
    actions: [
      { id: 'c35_ag_take', label: 'Взять и поблагодарить', minutes: 30, terminal: true, goto: 'c35_a_car',
        text: 'Вещь лёгкая и тяжёлая одновременно. Ты убираешь её во внутренний карман, ближе к телу.', effects: [set35('ag', 'take'), w35('gift', 'taken'), { give: 'c35_keepsake' }, until35(16, 50)] },
      { id: 'c35_ag_spring', label: 'Сказать: пусть полежит до весны. Мы вернёмся за ней', minutes: 30, terminal: true, goto: 'c35_a_car',
        text: 'Тебе кивают и убирают вещь обратно. Туда, где она лежала. «Bis zum Säen», — говорят тебе. До сева. Это звучит как договор.', effects: [set35('ag', 'spring'), w35('gift', 'spring'), npc('henrike', 1, 'c35_until_spring'), until35(16, 50)] },
      { id: 'c35_ag_stay', label: 'Сказать: мы никуда не уходим', minutes: 30, terminal: true, goto: 'c35_a_car',
        text: 'Тебе смотрят в глаза долго. Потом вещь убирают. «Wir werden sehen». Посмотрим.', effects: [set35('ag', 'stay'), w35('gift', 'stay'), until35(16, 50)] },
    ] }),

  X({ id: 'c35_b_okafor2', title: 'Окафор наедине', location: jest35, camp: jestCamp, ambient: { tempC: 10, outdoor: false, wet: false }, onEnter: [until35(11, 0)],
    text: [
      { when: okaforComes, text: 'Окафор провожает тебя до крыльца пункта и не уходит. Стоит, держит шапку.\n\n— Мерле было девятнадцать, когда она въехала к нам. Её мама плакала на лестнице. Я сказал ей: присмотрю. Двадцать слов, как в радиограмме. Я их помню.' },
      { when: okaforComes, text: '— Я пойду в любом случае. Но с вами было бы… — Он ищет слово по-русски. — Спокойнее. Для неё. Она вас знает. Меня она немножко боится.' },
      { when: not(okaforComes), text: 'На крыльце пункта тебя догоняет Зандер.\n\n— Wenn Sie fahren, fahren Sie mit Fremden. Zwei Wochen. Überlegen Sie das nicht im Kopf. Überlegen Sie es im Bauch.\n\nЕсли поедете, поедете с чужими. Две недели. Решайте это не головой. Животом.' },
      { text: 'Окафор сидит на ящике у стены, в куртке, с котом в коробке у ног. Он выглядит так, как выглядят люди, которые уже всё решили и теперь только ждут.' },
    ],
    actions: [
      { id: 'c35_bo2_go', label: 'Сказать: я поеду. Если {partner} отпустит', minutes: 60, terminal: true, goto: 'c35_b_henrike',
        text: 'Тебе кивают. Без улыбки. Как кивают человеку, который сказал что-то, что потом придётся сделать. Ты идёшь домой и всю дорогу повторяешь про себя: «если отпустит».', effects: [set35('bo2', 'go'), w35('b_will', 'go'), until35(12, 30)] },
      { id: 'c35_bo2_unsure', label: 'Сказать честно: не знаю. Мне страшно', minutes: 60, terminal: true, goto: 'c35_b_henrike',
        text: '— Страшно — это правильно, — отвечают тебе. — Кому не страшно, тех я бы не взял.\n\nДомой ты идёшь медленно, по самой кромке дороги, где снег не укатан.', effects: [set35('bo2', 'unsure'), w35('b_will', 'unsure'), until35(12, 30)] },
      { id: 'c35_bo2_other', label: 'Сказать: пусть поедет кто-то другой. Я {m:нужен|нужна} здесь', minutes: 45, terminal: true, goto: 'c35_b_henrike',
        text: 'Тебе не возражают. Только кивают и говорят: «Тогда найдём другого». Ты знаешь, что другого нет. Они тоже знают.', effects: [set35('bo2', 'other'), w35('b_will', 'stay'), until35(12, 15)] },
    ] }),

  X({ id: 'c35_b_kasia', title: 'Кася', camp: yard14, ambient: frost35, onEnter: [until35(15, 30)],
    text: [
      { when: kasia35, text: 'Кася находит тебя у курятника. Она держит в руках губную гармошку Тима, как талисман.\n\n— Павел едет на восток. Там Польша. Там бабушка, в Белостоке, если жива. Я хочу туда. Не сейчас. Когда-нибудь. — Она смотрит на тебя снизу вверх. — Ты поможешь?' },
      { when: not(kasia35), text: 'У курятника тебя ждёт Нина. Или Эва. Кто-то всегда ждёт у курятника: там тепло и можно говорить, не глядя друг на друга. Тебя спрашивают одно: «Вы уйдёте?»' },
      { text: 'Кася сидит на лестнице с вязанием на коленях. Спицы не двигаются. На верхней ступеньке стоит Тимова шапка с помпоном.' },
    ],
    actions: [
      { id: 'c35_bk2_help', label: 'Пообещать: если будет место — она поедет первой', when: kasia35, minutes: 60, terminal: true, goto: 'c35_b_bag',
        text: 'Кася кивает и прячет гармошку. Потом говорит: «Тим бы тоже хотел». И уходит в дом, не оглядываясь, очень прямая.', effects: [set35('bk2', 'help'), w35('kasia_east', 'promised'), npc('kasia', 2, 'c35_b_promised_east'), until35(16, 50)] },
      { id: 'c35_bk2_wait', label: 'Сказать: сейчас опасно. До весны здесь', when: kasia35, minutes: 60, terminal: true, goto: 'c35_b_bag',
        text: 'Кася слушает и не спорит. «До весны», — повторяет она, как будто запоминает дату.', effects: [set35('bk2', 'wait'), w35('kasia_east', 'spring'), until35(16, 50)] },
      { id: 'c35_bk2_home', label: 'Сказать: твоё место здесь, с нами', when: kasia35, minutes: 60, terminal: true, goto: 'c35_b_bag',
        text: 'Кася смотрит на тебя долго. Потом кивает. Но гармошку не убирает: держит, пока ты не уходишь.', effects: [set35('bk2', 'home'), w35('kasia_east', 'here'), npc('kasia', 1), until35(16, 50)] },
      { id: 'c35_bk2_truth', label: 'Ответить честно: не знаю', when: not(kasia35), minutes: 45, terminal: true, goto: 'c35_b_bag',
        text: 'Тебе кивают. «Hauptsache, ihr sagt es vorher». Главное — скажите заранее. Ты киваешь в ответ.', effects: [set35('bk2', 'truth'), until35(16, 30)] },
      { id: 'c35_bk2_no', label: 'Сказать: нет. Никуда', when: not(kasia35), minutes: 45, terminal: true, goto: 'c35_b_bag',
        text: 'Тебя обнимают, неловко, через куртку. Ты не знаешь, сказал{m:|а} ли ты правду.', effects: [set35('bk2', 'no'), until35(16, 30)] },
    ] }),
];

// Второй проход (15.11): поздний вечер после ужина, у каждого своё — до девяти, до решений друг за друга.
export const day35LateScenes: Scene[] = [
  X({ id: 'c35_a_late', title: 'Поздно вечером', camp: kitchen14, onEnter: [until35(20, 0)],
    text: [
      { text: 'После ужина Хенрике моет посуду одна. Остальные разошлись. На кухне только ты, она и тиканье часов.' },
      { when: flag('w.c35_tobias_offer'), text: 'Ты знаешь то, чего не знает она: пятнадцатого армия уходит. Тобиас просил молчать.' },
      { when: flag('w.c35_army_known'), text: 'Ты знаешь то, чего не знает она: пятнадцатого армия уходит.' },
      { text: 'Мороз щиплет лицо. Звёзды над насыпью крупные, и Млечный Путь видно целиком, от края до края.' },
      { when: v('$.c35_su', 'eat'), text: 'Ты {m:просидел|просидела} весь ужин, слушая всех. Голоса ещё звучат в голове, перебивая друг друга.' },
      { when: v('$.c35_su', 'partner'), text: 'На крыльце вы простояли молча, пока не замёрзли. Этого разговора хватило без слов.' },
    ],
    actions: [
      { id: 'c35_al_tell', label: 'Сказать Хенрике про пятнадцатое', when: any(flag('w.c35_tobias_offer'), flag('w.c35_army_known')), minutes: 40, terminal: true, goto: 'c35_checkpoint',
        text: 'Хенрике дослушивает, не оборачиваясь от раковины. Ставит последнюю тарелку на сушилку. Вытирает руки.\n\n— Dann bleibt der Brandt allein mit dem Kreis. Und wir mit dem Hof. — Она поворачивается. — Danke, dass du es mir gesagt hast. Nicht erst am Vierzehnten.\n\nТогда Брандт останется с округом один. А мы — с хутором. Спасибо, что сказал{m:|а}. Не четырнадцатого.', effects: [set35('al', 'tell'), w35('told_henrike', true), npc('henrike', 2, 'c35_told_army'), until35(21, 0)] },
      { id: 'c35_al_dry', label: 'Взять полотенце и вытирать посуду молча', minutes: 40, terminal: true, goto: 'c35_checkpoint',
        text: 'Вы стоите рядом. Она моет, ты вытираешь. Ни слова. Когда последняя кружка на полке, Хенрике кладёт ладонь тебе на щёку, на секунду, и уходит спать.', effects: [set35('al', 'dry'), npc('henrike', 1), until35(21, 0)] },
      { id: 'c35_al_out', label: 'Выйти во двор, к колонке, подышать', minutes: 40, terminal: true, goto: 'c35_checkpoint', ambientDuring: frost35,
        text: 'Звёзды. Мороз. Колонка, укутанная или нет. Окна дома светятся одно за другим и гаснут. Ты стоишь, пока не гаснет последнее.', effects: [set35('al', 'out'), until35(21, 0)] },
    ] }),

  X({ id: 'c35_b_late', title: 'Поздно вечером', camp: kitchen14, onEnter: [until35(20, 0)],
    text: [
      { text: 'После ужина ты садишься за кухонный стол с тетрадью. Если уезжать на две недели, кто-то должен знать то, что знаешь ты: кому какие таблетки, кто кашляет по ночам, где лежат бинты.' },
      { when: ninaFarm, text: 'Нина садится напротив, подперев щёку, и смотрит, как ты пишешь.' },
      { text: 'В доме пахнет мокрыми валенками и печёной картошкой. Где-то наверху Нина шепчет хомяку что-то по-немецки.' },
      { when: v('$.c35_su', 'eat'), text: 'Ты {m:просидел|просидела} весь ужин, слушая всех. Голоса ещё звучат в голове, перебивая друг друга.' },
      { when: v('$.c35_su', 'partner'), text: 'На крыльце вы простояли молча, пока не замёрзли. Этого разговора хватило без слов.' },
    ],
    actions: [
      { id: 'c35_bl_list', label: 'Записать всё для Хенрике: люди, лекарства, что делать', minutes: 40, terminal: true, goto: 'c35_checkpoint',
        text: 'Фрау Кёрнер — половина таблетки утром. Петерсену — бинт на ногу через день. Оле — печень и покой. Две страницы мелким почерком. Ты кладёшь тетрадь на полку над плитой, где Хенрике держит свою.', effects: [set35('bl', 'list'), w35('b_handover', true), until35(21, 0)] },
      { id: 'c35_bl_nina', label: 'Учить Нину: перевязка, температура, когда звать Зандер', when: ninaFarm, minutes: 40, terminal: true, goto: 'c35_checkpoint',
        text: 'Ты показываешь на её руке, как бинтовать, как трогать лоб тыльной стороной ладони, как считать пульс по часам. Нина повторяет всё с первого раза. В конце спрашивает: «Это на случай, если ты уедешь?» Ты не отвечаешь. Она кивает: поняла.', effects: [set35('bl', 'nina'), w35('b_handover', 'nina'), npc('c7_nina', 2, 'c35_learned_care'), until35(21, 0)] },
      { id: 'c35_bl_close', label: 'Закрыть тетрадь: ещё ничего не решено', minutes: 30, terminal: true, goto: 'c35_checkpoint',
        text: 'Ты закрываешь тетрадь. Писать «на случай» — значит уже решить. Ты ещё не {m:решил|решила}.', effects: [set35('bl', 'close'), until35(21, 0)] },
    ] }),
];
