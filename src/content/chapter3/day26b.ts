import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import {
  S26, brandtAlly, brandtByB, brandtHostile, carLoss, dayFacts, dutyB, farm26, jest26, leaFarm26, oleNow, plasmaSpoils, set26, snow26, until26, w26,
} from './point26';

// Участок 26, линия B: смена у Зандер (Пия хуже; правда Брандту, если её решили сказать) или день на хуторе: испорченная плазма,
// семенная картошка «Saat», к вечеру — Оле, если его везут сегодня.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S26({ ...scene, for: 'any', chapter: 'ch3' });
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => B({ ...scene, location: jest26, camp: scene.camp ?? { at: jest26, stock: 'c3_farm_stock', rest: false }, safe: false });
const leaPoint: Cond = any(flag('w.c25_lea_point'), v('w.c24_lea', 'sander'), v('w.c22_lea_at', 'sander'));
const pia: Cond = flag('w.c25_pia');
const plasmaLeft = (fx: (qty: number) => Effect[]): Effect => ({ if: { v: 'w.c21_plasma_used', op: '==', value: 2 }, then: fx(2),
  else: [{ if: { v: 'w.c21_plasma_used', op: '==', value: 1 }, then: fx(3), else: fx(4) }] });
const spoilPlasma: Effect = { if: plasmaSpoils, then: [plasmaLeft((qty) => [{ unstock: 'c21_plasma', qty, at: 'c3_farm_stock' }]), w26('plasma_spoiled', true)] };
const afterPoint = [{ id: 'b', when: brandtByB, goto: 'c26_b_brandt' }, { id: 'w', goto: 'c26_b_walk' }];

export const day26BScenes: Scene[] = [
  B({ id: 'c26_b_morning', title: 'Среда', camp: kitchen14, onEnter: [...dayFacts, spoilPlasma],
    text: [
      { text: 'Утро серое. Нина уже у плиты: каша, чай. Снег за окном не идёт, но и не тает.' },
      { when: carLoss, text: 'В семь у ворот звонит велосипед: бумага от Брандта. {A} читает её, складывает и молча идёт к машине. Её забирают. За колонию. За восемнадцатое.' },
      { when: dutyB, text: 'В семь тебя ждут в пункте у доктора Зандер. Ты {m:обещал|обещала}.' },
      { when: all(not(dutyB), plasmaSpoils), text: 'В кладовке полоска на синей сумке стала жёлтой целиком. Срок вышел.' },
    ],
    actions: [
      { id: 'c26_bm_point', label: 'Идти в пункт', when: dutyB, minutes: 60, terminal: true, goto: 'c26_b_point', ambientDuring: snow26,
        text: 'Четыре километра. На полпути начинает светать. У поворота на Йестебург ты обгоняешь двух женщин с санками: на санках мешок картошки и ребёнок.', effects: [set26('bm', 'point'), until26(7, 50)] },
      { id: 'c26_bm_pantry', label: 'Пойти в кладовку к сумке', when: all(not(dutyB), flag('w.c26_plasma_spoiled')), minutes: 20, terminal: true, goto: 'c26_b_pantry',
        text: 'Ты открываешь кладовку. Холодно. Сумка стоит, где стояла.', effects: [set26('bm', 'pantry'), until26(7, 30)] },
      { id: 'c26_bm_home', label: 'Взяться за дом', when: all(not(dutyB), not(flag('w.c26_plasma_spoiled'))), minutes: 30, terminal: true, goto: 'c26_b_seed',
        text: 'Посуда, печь, вода. Дом большой, людей много, работы ещё больше.', effects: [set26('bm', 'home'), until26(8, 0)] },
    ] }),

  // ───────────── Смена у Зандер ─────────────
  J({ id: 'c26_b_point', title: 'Смена',
    text: [
      { text: 'Доктор Зандер даёт тебе халат на два размера больше и список. Перевязки, температуры, вода. Ты работаешь до полудня, не садясь.' },
      { when: leaPoint, text: 'Лея за вторым столом. Она шьёт рваную рану на ладони у дружинника и разговаривает с раной: «So. Brav». Дружинник смотрит на неё, как на ведьму.' },
      { when: pia, text: 'В задней комнате Пия. Жар выше. Кукла с разными глазами лежит у неё на груди.' },
      { when: not(pia), text: 'В задней комнате девочка девяти лет, укушенная в пятницу. Жар выше. У неё на груди тряпичная кукла.' },
    ],
    actions: [
      { id: 'c26_bp_work', label: 'Работать по списку', minutes: 240, activity: 'moderate', terminal: true, outcomes: afterPoint,
        text: 'Перевязка, термометр, вода, следующий. К полудню у тебя болят спина и руки, а в списке не осталось ни одной строчки. Зандер расписывается в твоём листке, как в табеле.', effects: [set26('bp', 'work'), w26('b_shift', true), { body: 'fatigue', delta: 10 }, until26(12, 0)] },
      { id: 'c26_bp_pia', label: 'Между делами заходить к девочке в заднюю комнату', minutes: 240, activity: 'moderate', terminal: true, outcomes: afterPoint,
        text: 'Ты заходишь к ней каждые полчаса. Пить, лоб, одеяло. На пятый раз она уже не открывает глаза, только сжимает куклу. Зандер видит тебя в дверях и говорит тихо:\n\n— Morgen kommt sie in den abgeschlossenen Raum. Ich will nicht, dass Sie dann hier sind.\n\nЗавтра её переведут в запертую комнату. Я не хочу, чтобы вы тогда были здесь.', effects: [set26('bp', 'pia'), w26('b_shift', true), w26('pia_worse', true), { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 4 }, until26(12, 0)] },
      { id: 'c26_bp_lea', label: 'Работать в паре с Леей', when: leaPoint, minutes: 240, activity: 'moderate', terminal: true, outcomes: afterPoint,
        text: 'Вы с Леей работаете в четыре руки. Она шьёт, ты держишь и подаёшь. К полудню вы понимаете друг друга без слов. В перерыв она говорит, грея руки о кружку:\n\n— Ich gehe nicht nach Hannover. Noch nicht. Hier bin ich wenigstens nützlich. Und hier sticht mich keiner.\n\nЯ не пойду в Ганновер. Пока. Здесь от меня хоть есть польза. И здесь меня никто не колет.', effects: [set26('bp', 'lea'), w26('b_shift', true), w26('lea_stays_point', true), npc('c21_lea', 2), { body: 'fatigue', delta: 8 }, until26(12, 0)] },
    ] }),

  J({ id: 'c26_b_brandt', title: 'Брандт', ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'В полдень ты идёшь в караулку. Брандт над списками. Сабина у окна. Она видит тебя и не уходит.' },
      { when: v('w.c25_truth', 'all'), text: 'Нет. Не в караулку. Во двор, где раздают пайки. Человек сорок в очереди. Ты встаёшь на ящик у ворот.' },
      { text: 'Ты говоришь. Про двести двенадцать. Про ноль. Про то, что плазма только откладывает. Про то, что Матс не болел.' },
      { when: brandtAlly, text: 'Брандт молчит. Потом снимает каску и кладёт на стол.\n\n— Dann räumen wir die Senke. Das ist wenigstens echt.\n\nТогда расчистим впадину. Это хотя бы настоящее.' },
      { when: brandtHostile, text: 'Брандт встаёт.\n\n— Wer das weitererzählt, fliegt von der Liste. Du auch. Raus.\n\nКто будет это пересказывать, вылетит из списка. Ты тоже. Вон.' },
      { when: all(not(brandtAlly), not(brandtHostile)), text: 'Брандт сидит, глядя на свои руки.\n\n— Sabine hat es mir am Sonntag gesagt. — Он снимает каску. — Geht. Alle. Geht nach Hause.\n\nСабина сказала мне это в воскресенье. Идите. Все. Идите по домам.' },
    ],
    actions: [
      { id: 'c26_bb_sabine', label: 'Посмотреть на Сабину', minutes: 15, terminal: true, goto: 'c26_b_walk',
        text: 'Сабина стоит у окна с термосом. Она не плачет. Она кивает тебе один раз, коротко. Спасибо или прощай — не понять.', effects: [set26('bb', 'sabine'), until26(12, 40)] },
      { id: 'c26_bb_go', label: 'Уйти', minutes: 10, terminal: true, goto: 'c26_b_walk',
        text: 'Ты выходишь во двор. Снег скрипит. За спиной тихо.', effects: [set26('bb', 'go'), until26(12, 30)] },
    ] }),

  B({ id: 'c26_b_walk', title: 'Домой', camp: yard14, ambient: snow26,
    text: [
      { text: 'Обратно ты идёшь медленно. Четыре километра. Ноги не слушаются.' },
      { text: 'На краю поля, у лесополосы, стоит один. В белом. Лицом к дороге. Не двигается. Ты идёшь дальше, не меняя шага, и не оборачиваешься, пока не доходишь до поворота.' },
    ],
    actions: [
      { id: 'c26_bw_go', label: 'Дойти до дома и сесть у печи', minutes: 60, terminal: true, goto: 'c26_b_afternoon', ambientDuring: snow26,
        text: 'Дома Нина снимает с тебя куртку, как с ребёнка, и ставит перед тобой тарелку.', effects: [set26('bw', 'go'), meal('eat'), until26(14, 0)] },
      { id: 'c26_bw_tell', label: 'Дома сразу сказать Нине, что {m:видел|видела}', minutes: 70, terminal: true, goto: 'c26_b_afternoon', ambientDuring: snow26,
        text: 'Нина слушает и кивает.\n\n— Я тоже видела. Позавчера. Он стоит там каждый день. Я назвала его Почтальоном.\n\nОна не шутит.', effects: [set26('bw', 'tell'), w26('postman', true), until26(14, 10)] },
    ] }),

  // ───────────── Хутор ─────────────
  B({ id: 'c26_b_pantry', title: 'Плазма', camp: kitchen14,
    text: [
      { text: 'Полоска на синей сумке жёлтая. Внутри мешки с жёлтой жидкостью, мутной. На дне одного осадок.' },
      { when: leaFarm26, text: 'Лея стоит за спиной. Смотрит на мешки.\n\n— Kaputt. Das ist jetzt nur noch Wasser mit Eiweiß. Gieß es weg. Nicht in den Ausguss. In den Schnee. Hinter den Stall.\n\nИспорчено. Теперь это просто вода с белком. Вылей. Не в раковину. В снег. За хлевом.' },
    ],
    actions: [
      { id: 'c26_bpa_pour', label: 'Вылить в снег за хлевом', minutes: 20, terminal: true, goto: 'c26_b_seed', ambientDuring: snow26,
        text: 'Ты режешь мешки ножом над сугробом. Жёлтое уходит в снег, оставляя пятна. Нина смотрит с крыльца. Потом приносит лопату и закапывает пятна снегом, молча.', effects: [set26('bpa', 'pour'), npc('c7_nina', 1), until26(8, 0)] },
      { id: 'c26_bpa_keep', label: 'Оставить сумку: вдруг ещё пригодится', minutes: 10, terminal: true, goto: 'c26_b_seed',
        text: 'Ты закрываешь сумку. Мешки внутри мутные, бесполезные. Но выбросить их — как выбросить чью-то надежду. Даже если она уже испорчена.', effects: [set26('bpa', 'keep'), until26(7, 45)] },
    ] }),

  B({ id: 'c26_b_seed', title: '«Saat»', camp: kitchen14,
    text: [
      { text: 'В подвале, сзади слева, стоят ящики с надписью мелом: «Saat». Семенная картошка. Хенрике сказала: не трогать ни при каком голоде.' },
      { text: 'Эва держит за руку Нину. У Нины в другой руке миска, в миске шесть картофелин.\n\n— Ich hab sie erwischt, — говорит Эва. Я её поймала. — Sie sagt, sie wollte nur gucken.\n\nОна говорит, только посмотреть хотела.' },
      { text: 'Нина смотрит в пол.\n\n— В ящике под лестницей осталось на четыре дня. Я посчитала. А тут их сотни.' },
    ],
    actions: [
      { id: 'c26_bs_back', label: 'Сказать Нине: положи обратно. Это весна', minutes: 20, terminal: true, goto: 'c26_b_afternoon',
        text: 'Нина кладёт картофелины обратно по одной, аккуратно, как яйца.\n\n— Весна, — повторяет она. — Если мы до неё доживём.', effects: [set26('bs', 'back'), w26('seed_kept', true), until26(10, 0)] },
      { id: 'c26_bs_six', label: 'Сказать: эти шесть — сегодня. Остальное не трогать', minutes: 20, terminal: true, goto: 'c26_b_afternoon',
        text: 'Эва поджимает губы, но молчит. Нина уносит миску на кухню. Шесть картофелин из весны. Сегодня это суп.', effects: [set26('bs', 'six'), w26('seed_used', true), npc('c8_eva', -1), until26(10, 0)] },
      { id: 'c26_bs_count', label: 'Спуститься и пересчитать, сколько там всего', minutes: 40, terminal: true, goto: 'c26_b_afternoon',
        text: 'Восемь ящиков. Примерно по двадцать кило. Сто шестьдесят кило. Если сажать — гектар. Если есть — две недели на всех. Ты записываешь цифры на стене мелом, под надписью «Saat».', effects: [set26('bs', 'count'), w26('seed_counted', true), until26(10, 20)] },
    ] }),

  B({ id: 'c26_b_afternoon', title: 'После обеда', camp: kitchen14,
    text: [
      { when: oleNow, text: 'К четырём должен приехать Оле. Хенрике вчера передала через Тобиаса: «Morgen». Нина весь день смотрит на дорогу.' },
      { when: not(oleNow), text: 'Тихий час. Нина делает уроки. Эва вяжет. В доме пахнет супом и мокрыми валенками.' },
    ],
    actions: [
      { id: 'c26_ba_room', label: 'Приготовить Оле место у печи', when: oleNow, minutes: 40, terminal: true, goto: 'c26_b_ole',
        text: 'Лавка у печи, где лежал Мальте. Ты стелешь два одеяла и подушку. Нина приносит грелку и ставит на табурет кружку. Пустую. На случай.', effects: [set26('ba', 'room'), until26(15, 50)] },
      { id: 'c26_ba_hens', label: 'Почистить курятник с Ниной', when: not(oleNow), minutes: 60, activity: 'light', terminal: true, goto: 'c26_b_eggs',
        text: 'Вы выгребаете старую подстилку и стелете свежую солому. Куры ходят вокруг и ругаются. Нина ругается в ответ, по-немецки, так же.', effects: [set26('ba', 'hens'), npc('c7_nina', 1), until26(15, 30)] },
      { id: 'c26_ba_sleep', label: 'Поспать час', minutes: 5, terminal: true, outcomes: [{ id: 'o', when: oleNow, goto: 'c26_b_ole' }, { id: 'e', goto: 'c26_b_eggs' }],
        text: 'Ты засыпаешь сразу. Снится пункт: термометры, бинты, кукла с разными глазами.', effects: [set26('ba', 'sleep'), until26(15, 50, true)] },
    ] }),

  B({ id: 'c26_b_ole', title: 'Оле дома', camp: yard14, ambient: snow26,
    text: [
      { text: 'Около четырёх у ворот «Вольф». Тобиас помогает выйти Оле. Тот держится за дверцу, потом за Тобиаса. Хенрике выходит с другой стороны с двумя сумками.' },
      { text: 'Нина стоит на крыльце. Она не бежит к нему. Она ждёт, пока он подойдёт сам. Он подходит. Она обнимает его за пояс и долго не отпускает.' },
    ],
    actions: [
      { id: 'c26_bo_henrike', label: 'Забрать у Хенрике сумки', minutes: 20, terminal: true, goto: 'c26_b_eggs',
        text: 'Хенрике отдаёт сумки не сразу. Потом отдаёт обе и, освободив руки, вдруг обнимает тебя. Коротко, крепко, по-людемановски.\n\n— Danke. Für alles. Auch für das, was ich nicht weiß.\n\nСпасибо. За всё. И за то, чего я не знаю.', effects: [set26('bo', 'henrike'), npc('henrike', 3, 'c26_hugged'), until26(16, 30)] },
      { id: 'c26_bo_ole', label: 'Подставить Оле плечо до лавки', minutes: 25, terminal: true, goto: 'c26_b_eggs',
        text: 'Оле опирается на тебя. Он лёгкий, как подросток. На крыльце он останавливается.\n\n— Die Pumpe läuft? — Насос работает?\n\nТы говоришь, что да. Он кивает, будто это главное.', effects: [set26('bo', 'ole'), npc('ole', 2), until26(16, 30)] },
    ] }),

  B({ id: 'c26_b_eggs', title: 'Яйца', camp: yard14, ambient: snow26,
    text: [
      { text: 'Перед ужином ты заходишь в курятник. В гнёздах три яйца. Тёплые.' },
      { text: 'Три яйца на десять ртов.' },
    ],
    actions: [
      { id: 'c26_be_nina', label: 'Отдать Нине: пусть решит сама', minutes: 15, terminal: true, goto: 'c26_supper',
        text: 'Нина держит яйца в ладонях и думает.\n\n— Оле, — говорит она. — Одно Оле. Два — в суп. Так честно.', effects: [set26('be', 'nina'), { place: 'eggs', at: 'c3_farm_stock', qty: 3 }, npc('c7_nina', 1), until26(18, 20)] },
      { id: 'c26_be_stock', label: 'Положить в кладовку', minutes: 10, terminal: true, goto: 'c26_supper',
        text: 'Три яйца ложатся в миску к остальным. Нина записывает в тетрадь: «25.11 — 3».', effects: [set26('be', 'stock'), { place: 'eggs', at: 'c3_farm_stock', qty: 3 }, until26(18, 15)] },
    ] }),
];

export const farmB26 = farm26;
export const tableB26 = tableOnly;
