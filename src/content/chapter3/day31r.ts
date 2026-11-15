import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { ninaFarm } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { meal } from './point12';
import {
  A31, B31, S31, brothers31, ditch31, after31, frost31, henrike31, lea31, own31, partnerDown31, partnerUp31, set31, until31,
} from './point31';

// Участок 31, спасение: партнёр без сознания с ночи (рана головы об лёд, кровь, холод). Спасающий на ногах — выбывший жив.
// Хороший путь: греть медленно, сухое, сладкое тёплое питьё. Плохой: к самой печи и растирать / спиртное — хуже и дольше,
// доктор Зандер утром поправляет. К вечеру выбывший приходит в себя при любом пути.
const R = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S31({ ...scene, for: 'any', chapter: 'ch3' });
const treat = (how: 'basic' | 'proper'): Effect => ({ treat: how, target: '@partner' });
const blood = (delta: number): Effect => ({ body: 'bloodLoss', delta, target: '@partner' });
const drink = (delta: number): Effect => ({ body: 'thirst', delta, target: '@partner' });
/** Капельница доктора Зандер, если к её приходу партнёр всё ещё без сознания. */
const drip: Effect = { if: partnerDown31, then: [blood(-25), drink(-40)] };
const badWay: Cond = not(own31('rb', 'slow'));

export const day31RScenes: Scene[] = [
  R({ id: 'c31_r_bed', title: 'У печи', camp: tense14, safe: false, onEnter: [set31('rescuer', true)],
    text: [
      { text: '{partner} лежит на кровати Хенрике, в мокрой одежде, которую никто не успел снять. Повязка на голове тёмная. Лицо белое, губы синие. Дрожи нет, и это хуже, чем если бы {pm:он трясся|она тряслась}.' },
      { when: henrike31, text: 'Хенрике режет ножницами рукав куртки, потому что расстегнуть молнию не получается: пальцы не слушаются ни у кого.' },
      { when: lea31, text: 'Лея держит запястье {partner.gen} и считает про себя, шевеля губами.' },
      { when: evaHere, text: 'Эва несёт из кладовки бутылку шнапса и миску со снегом.\n\n— Mit Schnee abreiben, und einen Schluck. So hat man das immer gemacht.\n\nРастереть снегом и глоток. Так всегда делали.' },
      { when: not(evaHere), text: 'Кто-то из соседей, кто принёс {partner.acc}, говорит от двери: растереть бы снегом, да водки глоток.' },
    ],
    actions: [
      { id: 'c31_rb_slow', label: 'Снять мокрое, завернуть в одеяла, тёплые бутылки к груди и под мышки', minutes: 30, terminal: true, goto: 'c31_r_doc',
        text: 'Ты режешь мокрое, не жалея. Сухое бельё, два одеяла, сверху перина Хенрике. Бутылки с тёплой, не горячей, водой в полотенцах — под мышки, к груди. Кровать ты оставляешь там, где она стоит, в трёх шагах от печи. Тепло должно приходить изнутри, медленно.', effects: [set31('rb', 'slow'), treat('basic'), blood(-3), until31(6, 30)] },
      { id: 'c31_rb_rub', label: 'Придвинуть кровать к самой печи и растирать руки и ноги', minutes: 30, activity: 'moderate', terminal: true, goto: 'c31_r_doc',
        text: 'Вы двигаете кровать вплотную к печи. Ты растираешь {partner.gen} ступни и ладони, сильно, до красноты. Кожа под твоими руками горячеет пятнами. {partner} стонет и пытается отдёрнуть руку. Тебе кажется, что это хорошо.', effects: [set31('rb', 'rub'), treat('basic'), { body: 'stress', delta: 4 }, until31(6, 30)] },
      { id: 'c31_rb_schnaps', label: 'Влить глоток шнапса, чтобы согреть', minutes: 20, terminal: true, goto: 'c31_r_doc',
        text: 'Ты приподнимаешь {partner.acc} за плечи и подносишь стакан. Половина течёт по подбородку, {pm:он|она} кашляет. Щёки на минуту розовеют. Потом белеют снова, сильнее прежнего.', effects: [set31('rb', 'schnaps'), treat('basic'), { body: 'stress', delta: 3 }, until31(6, 30)] },
    ] }),

  R({ id: 'c31_r_doc', title: 'Доктор', camp: tense14, safe: false,
    text: [
      { text: 'В половине седьмого у ворот «Вольф». Тобиас привёз доктора Зандер: она объезжает дворы после ночи. Маленькая, в мужском свитере под курткой. Смотрит на {partner.acc}, потом на тебя.' },
      { when: own31('rb', 'rub'), text: '— Weg vom Ofen! Nicht reiben! — Она сама оттаскивает кровать от печи. — Die Haut ist wie Glas. Und das kalte Blut aus den Beinen geht direkt ins Herz.\n\nОт печи! Не растирать! Кожа как стекло. А холодная кровь из ног идёт прямо в сердце.' },
      { when: own31('rb', 'schnaps'), text: '— Kein Alkohol. — Она нюхает стакан и выплёскивает в ведро. — Der macht die Adern weit, und die Wärme geht raus. Er wärmt nur die Seele.\n\nНикакого спиртного. Оно расширяет сосуды, и тепло уходит наружу. Греет только душу.' },
      { when: own31('rb', 'slow'), text: '— Gut. Genau so. — Она трогает бутылку под мышкой. — Nicht heißer machen.\n\nХорошо. Именно так. Горячее не надо.' },
      { text: 'Она разматывает повязку на голове. Рана длинная, над ухом, края разошлись.' },
    ],
    actions: [
      { id: 'c31_rd_lamp', label: 'Держать лампу, пока она шьёт', minutes: 60, terminal: true, goto: 'c31_tow',
        text: 'Ты держишь лампу. Зандер шьёт быстро, мелко, и что-то говорит по-немецки, не тебе. Девять швов. Потом ставит капельницу, подвешивает бутылку на гвоздь для календаря.\n\n— Mittags wacht {pm:er|sie} auf. Dann süß und warm, löffelweise.\n\nК обеду очнётся. Тогда сладкое и тёплое, с ложки.', effects: [set31('rd', 'lamp'), treat('proper'), drip, until31(9, 30)] },
      { id: 'c31_rd_ask', label: 'Спросить, что делать дальше', minutes: 60, terminal: true, goto: 'c31_tow',
        text: '— Warm halten. Nicht zu warm. Trinken, wenn schluckt. Zucker. Wenn Fieber kommt — holen Sie mich.\n\nДержать в тепле. Не слишком. Поить, когда глотает. Сахар. Если поднимется температура — зовите меня.\n\nПока она говорит, руки её шьют рану, девять швов, и ставят капельницу на гвоздь для календаря.', effects: [set31('rd', 'ask'), set31('doc_advice', true), treat('proper'), drip, until31(9, 30)] },
      { id: 'c31_rd_out', label: 'Выйти: смотреть не можешь', minutes: 60, terminal: true, goto: 'c31_tow', ambientDuring: frost31,
        text: 'Ты стоишь на крыльце, на морозе, пока она шьёт. Тобиас курит рядом и молчит. Потом говорит:\n\n— Sie hat schon Schlimmeres zusammengeflickt. Heute Nacht.\n\nОна этой ночью и похуже зашивала.\n\nКогда ты возвращаешься, над кроватью висит капельница на гвозде для календаря.', effects: [set31('rd', 'out'), treat('proper'), drip, npc('c15_tobias', 1), until31(9, 30)] },
    ] }),

  R({ id: 'c31_r_noon', title: 'Полдень', camp: house14, onEnter: [until31(12, 0)],
    text: [
      { when: partnerUp31, text: 'В полдень ты слышишь своё имя. {partner} смотрит на тебя из-под перины. Глаза мутные, но {pm:он|она} узнаёт.\n\n— Холодно, — говорит {pm:он|она}. И потом: — Где я?' },
      { when: partnerDown31, text: 'Полдень. {partner} не открывает глаз. Но губы уже не синие, и пальцы на одеяле тёплые.' },
      { when: all(badWay, partnerUp31), text: 'Ступни под одеялом красные, в пузырях там, где ты растирал{m:|а}. Зандер оставила мазь.' },
    ],
    actions: [
      { id: 'c31_rn_tea', label: 'Поить сладким чаем с ложки', minutes: 60, terminal: true, goto: 'c31_r_visit',
        text: 'Сахар, тёплая вода, ложка. {partner} глотает с трудом, с паузами. Ты считаешь ложки. На двадцатой {pm:он|она} отворачивается: хватит.', effects: [set31('rn', 'tea'), blood(-4), drink(-30), until31(13, 30)] },
      { id: 'c31_rn_tell', label: 'Рассказать, что было ночью', when: partnerUp31, minutes: 60, terminal: true, goto: 'c31_r_visit',
        text: 'Ты рассказываешь тихо: лёд, кто нёс, кто держал лампу, доктор. {partner} слушает с закрытыми глазами. На середине ты замечаешь, что {pm:он|она} держит тебя за палец, как ребёнок.', effects: [set31('rn', 'tell'), blood(-2), drink(-10), { body: 'stress', delta: -3 }, until31(13, 30)] },
      { id: 'c31_rn_sit', label: 'Сидеть рядом и не отходить', minutes: 60, terminal: true, goto: 'c31_r_visit',
        text: 'Ты сидишь. Капельница давно кончилась, на гвозде висит пустая бутылка. За окном светло и тихо. Ты засыпаешь сидя и просыпаешься от того, что {partner} шевелится.', effects: [set31('rn', 'sit'), blood(-3), drink(-15), until31(13, 30, true)] },
    ] }),

  R({ id: 'c31_r_visit', title: 'Гости', camp: yard14, ambient: frost31, onEnter: [until31(14, 0)],
    text: [
      { when: brothers31, text: 'Около двух у ворот «Транзит» Дениза. Братья Айдын слышали про ночь и приехали сами.' },
      { when: all(brothers31, ditch31, after31('home')), text: 'Трактор, говорят, вытащат без тебя, вдвоём, тросом. Так и делают, пока ты стоишь в дверях.' },
      { when: all(brothers31, A31), text: '— In Buchholz ist es still, — говорит Дениз. — Wir räumen die Werkstatt. Werkzeug, Generator. Mittwoch und Donnerstag. Wir hätten dich gern dabei. Aber ich sehe ja, was hier los ist.\n\nВ Бухгольце тихо. Освобождаем мастерскую. Инструмент, генератор. Среда и четверг. Мы бы тебя взяли. Но я же вижу, что тут.' },
      { when: all(brothers31, B31), text: '— In Buchholz ist es still, — говорит Дениз. — Wir räumen die Werkstatt. Mittwoch und Donnerstag. Wenn er wieder steht, nehmen wir ihn mit. Sag ihm das.\n\nВ Бухгольце тихо. Освобождаем мастерскую. Среда и четверг. Если он встанет, возьмём его с собой. Передай ему.' },
      { when: not(brothers31), text: 'Около двух заезжает Тобиас. Говорит, что Зандер нужен генератор для пункта, в Бухгольце есть один, в пустой мастерской. И уезжает.' },
      { when: all(ninaFarm, B31), text: 'Потом на кухне Нина садится рядом и шёпотом, чтобы не разбудить, рассказывает про Лену из Винзена: там открылась школа, в среду туда идёт армейский грузовик. Она просится с тобой. Не сейчас. Когда {partner} встанет.' },
      { when: all(ninaFarm, A31), text: 'Потом на кухне Нина рассказывает про подругу из Винзена: там открылась школа, в среду туда идёт армейский грузовик. Она хочет поехать с {partner.ins}. Когда {pm:он|она} встанет.' },
    ],
    actions: [
      { id: 'c31_rv_out', label: 'Выйти к ним и поговорить', minutes: 90, terminal: true, goto: 'c31_r_guests', ambientDuring: frost31,
        text: 'Ты стоишь во дворе на морозе, пока не перестаёшь чувствовать уши. Новости, кто как, кто где. Тебе нужно было постоять с живыми людьми, которые ни о чём не просят.', effects: [set31('rv', 'out'), npc('deniz', 1), until31(15, 30)] },
      { id: 'c31_rv_eat', label: 'Поесть на кухне, пока есть минута', minutes: 30, terminal: true, goto: 'c31_r_guests', ...tableOnly,
        text: 'Хенрике ставит перед тобой миску и стоит рядом, пока ты не съешь всё. Ты не помнишь, когда ел{m:|а} последний раз. Кажется, вчера.', effects: [set31('rv', 'eat'), meal('eat'), until31(15, 0)] },
      { id: 'c31_rv_back', label: 'Вернуться к постели', minutes: 60, terminal: true, goto: 'c31_r_guests',
        text: 'Ты киваешь всем сразу и уходишь обратно в комнату. {partner} спит. Ты садишься и смотришь, как поднимается одеяло.', effects: [set31('rv', 'back'), blood(-2), until31(15, 0)] },
    ] }),

  R({ id: 'c31_r_dusk', title: 'Сумерки', camp: kitchen14,
    text: [
      { when: partnerUp31, text: 'К сумеркам {partner} садится в кровати сам{pm:|а}. Голова кружится, {pm:он|она} держится за спинку. Просит есть.' },
      { when: partnerDown31, text: 'К сумеркам {partner} всё ещё спит. Дышит ровно. Лоб тёплый, не горячий.' },
    ],
    actions: [
      { id: 'c31_rk_soup', label: 'Принести бульону', minutes: 60, terminal: true, goto: 'c31_evening',
        text: 'Бульон из курицы, которую Хенрике держала на чёрный день. Ты кормишь с ложки, хотя {partner} говорит, что может сам{pm:|а}. Не может.', effects: [set31('rk', 'soup'), blood(-3), drink(-20), until31(18, 0)] },
      { id: 'c31_rk_wash', label: 'Умыть и переодеть в сухое', minutes: 60, terminal: true, goto: 'c31_evening',
        text: 'Тёплая вода, полотенце. Ты смываешь с {partner.gen} лица засохшую кровь вокруг повязки, осторожно, по сантиметру. Под кровью оказывается знакомое лицо, только очень усталое.', effects: [set31('rk', 'wash'), blood(-2), { body: 'stress', delta: -2 }, until31(18, 0)] },
    ] }),
];
