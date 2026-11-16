import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14 } from './point14';
import { ninaFarm } from './point18';
import { evaHere, npc } from './point19';
import { S26, brandtByB, dutyA, set26, snow26, until26, w26 } from './point26';

// Участок 26, переработка 16.11 (до уровня 17–20).
// A: спуститься по лесополосе к впадине у стоянки и разглядеть грузовики колонны (риск; солярка в третьем грузовике — задел 30-й).
// B: Нина у ящиков с семенной картошкой («Saat») — голод против весны.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S26({ ...scene, for: 'any', chapter: 'ch3' });
const lullau = 'c26_lullau';
const afterPoint2 = [{ id: 'b', when: brandtByB, goto: 'c26_b_brandt' }, { id: 'w', goto: 'c26_b_walk' }];
const toLullau = (morning: [number, number], afternoon: [number, number]) => ({ if: dutyA, then: [until26(afternoon[0], afternoon[1])], else: [until26(morning[0], morning[1])] });

export const day26RScenes: Scene[] = [
  X({ id: 'c26_a_hollow', title: 'Лесополоса над стоянкой', safe: false, ambient: snow26,
    text: [
      { text: 'Лесополоса спускается с холма почти до самой стоянки. Ты идёшь от ствола к стволу, пригибаясь. Снег под ёлками неглубокий, но скрипит.' },
      { text: 'С опушки впадину видно целиком. Они стоят плотно, сотнями, лицами к дороге, и почти не двигаются: мороз. Над ними поднимается пар, едва заметный.' },
      { text: 'На краю стоянки, за ними, три армейских грузовика колонны, засыпанные снегом по крышу кабин. У третьего откинут тент. Под тентом бочки, синие, с белыми буквами.' },
    ],
    actions: [
      { id: 'c26_ah2_count', label: 'Подобраться ещё ближе и прочитать буквы на бочках', minutes: 30, risky: true, terminal: true, goto: 'c26_a_anke', ambientDuring: snow26,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 3, uses: ['focus'] }, text: 'Ещё сорок шагов, ползком, за сугробом вдоль отбойника. «DIESEL». Шесть бочек, может, восемь. Крайние из толпы стоят в двадцати метрах от тебя и смотрят на дорогу. Ни один не поворачивается. Ты отползаешь назад так же медленно и только в лесу встаёшь на ноги. Колени мокрые насквозь.', effects: [set26('ah2', 'count'), w26('diesel_seen', true), { move: lullau }, toLullau([10, 0], [13, 45])] },
          { id: 'seen', text: 'Под коленом ломается ветка. Трое с краю поворачивают головы, медленно, как совы. Потом делают шаг. Ещё один. Ты отползаешь, потом бежишь вверх по склону, не оглядываясь, проваливаясь по колено. Наверху оглядываешься: они стоят на опушке, там, где кончаются следы, и не идут дальше. Мороз держит их крепче, чем тебя. Буквы ты так и не прочитал{m:|а}.', effects: [set26('ah2', 'seen'), w26('hollow_stirred', true), { body: 'fatigue', delta: 10 }, { body: 'stress', delta: 6 }, { move: lullau }, toLullau([10, 10], [13, 55])] },
        ], effects: [w26('hollow_seen', true)] },
      { id: 'c26_ah2_back', label: 'Хватит: вернуться на дорогу', minutes: 20, terminal: true, goto: 'c26_a_anke', ambientDuring: snow26,
        text: 'Ты запоминаешь: три грузовика, бочки под тентом у третьего. Потом поднимаешься обратно на дорогу тем же следом, ступая в свои ямки.',
        effects: [set26('ah2', 'back'), w26('hollow_seen', true), w26('trucks_seen', true), { move: lullau }, toLullau([9, 45], [13, 30])] },
      { id: 'c26_ah2_draw', label: 'Зарисовать стоянку в блокноте: кто где стоит', minutes: 30, terminal: true, goto: 'c26_a_anke', ambientDuring: snow26,
        text: 'Карандаш замерзает, линии выходят дрожащие. Отбойник, три прямоугольника грузовиков, крестик у третьего. Серое пятно толпы ты штрихуешь, и штриховка занимает полстраницы. Пальцы перестают слушаться к концу.',
        effects: [set26('ah2', 'draw'), w26('hollow_seen', true), w26('trucks_seen', true), w26('hollow_map', true), { move: lullau }, toLullau([10, 0], [13, 45])] },
    ] }),

  X({ id: 'c26_b_seed2', title: 'Saat', camp: kitchen14,
    text: [
      { when: all(ninaFarm, evaHere), text: 'Из подвала доносится голос Эвы, резкий, как никогда. Ты спускаешься. Нина стоит у ящиков с надписью мелом «Saat», с миской в руках. В миске пять картофелин, мелких, с ростками.' },
      { when: all(ninaFarm, not(evaHere)), text: 'В подвале горит свеча. Нина стоит у ящиков с надписью мелом «Saat», с миской в руках. В миске пять картофелин, мелких, с ростками. Она слышит тебя и не оборачивается.' },
      { when: not(ninaFarm), text: 'В подвале у ящиков с надписью мелом «Saat» стоит Эва с миской. В миске пять картофелин, мелких, с ростками.' },
      { when: ninaFarm, text: '— Это же мелкие, — говорит Нина по-русски. — Их всё равно никто не посадит. Посчитай: если сажать, это в апреле. До апреля мы не доживём на одной картошке из того угла.' },
      { when: not(ninaFarm), text: '— Die Kleinen. Die setzt doch keiner. Und bis April…\n\nМелкие. Их всё равно никто не посадит. А до апреля…' },
      { text: 'Семенная картошка Людеманов. Хенрике о ней говорила одно: «Die isst man nicht». Её не едят. Без неё весной в поле будет пусто.' },
    ],
    actions: [
      { id: 'c26_bs3_back', label: 'Высыпать обратно в ящик: это весна', minutes: 15, terminal: true, goto: 'c26_b_letter',
        text: 'Ты забираешь миску и высыпаешь картофелины обратно, ростками вверх. Никто не спорит. Ростки сломались у двух. Их ты всё равно кладёшь в ящик.',
        effects: [set26('bs4', 'back'), w26('seed', 'kept'), { if: ninaFarm, then: [npc('c7_nina', -1)] }, until26(16, 0)] },
      { id: 'c26_bs3_five', label: 'Разрешить эти пять, но больше ни одной', minutes: 15, terminal: true, goto: 'c26_b_letter',
        text: '— Эти пять, — говоришь ты. — И всё. Ящик закрываем.\n\nВы закрываете ящик крышкой и ставите на неё ведро с песком. Пять картофелин идут в суп. Весной ты, может быть, будешь их считать.',
        effects: [set26('bs4', 'five'), w26('seed', 'five'), until26(16, 0)] },
      { id: 'c26_bs3_lock', label: 'Перенести ящики на чердак и сказать всем', minutes: 30, activity: 'moderate', terminal: true, goto: 'c26_b_letter',
        text: 'Два ящика по лестнице на чердак, вдвоём. Там холоднее, но не мёрзнет: у трубы. За ужином ты говоришь при всех: семенная — на чердаке, и её нет. Никто не смотрит тебе в глаза. Это и значит, что поняли.',
        effects: [set26('bs4', 'lock'), w26('seed', 'attic'), { body: 'fatigue', delta: 4 }, until26(16, 10)] },
    ] }),

  X({ id: 'c26_a_tractor', title: 'Трактор из Паттензена', location: 'c26_lullau', safe: false, ambient: snow26,
    text: [
      { text: 'На выезде из Люллау навстречу тарахтит трактор с прицепом. За рулём Хайнер, работник фрау Тимм. В прицепе на соломе, под попоной, сидят двое: женщина в светлой куртке и мальчик в шапке с помпоном.' },
      { text: 'Анке. Йонас. Живые.' },
      { when: flag('w.c25_polo_besieged'), text: 'Хайнер глушит мотор и говорит, не слезая:\n\n— Einer stand die ganze Nacht am Wagen. Hände auf der Scheibe. Sie hat nicht geschlafen. Der Junge schon.\n\nОдин всю ночь стоял у машины. Ладонями на стекле. Она не спала. Мальчик спал.' },
      { when: not(flag('w.c25_polo_besieged')), text: 'Хайнер глушит мотор. Анке смотрит на тебя и сначала не узнаёт. Потом узнаёт.' },
    ],
    actions: [
      { id: 'c26_atr_ride', label: 'Сесть к ним в прицеп и вернуться в Люллау', minutes: 40, terminal: true, goto: 'c26_a_ditch', ambientDuring: snow26,
        text: 'Ты едешь обратно на соломе, рядом с Йонасом. Он держится за твой рукав и молчит. У ворот фрау Тимм выбегает без жилета, в одной кофте. Она обнимает невестку, внука, Хайнера и, по инерции, тебя. Потом приносит из дома две бутылки молока и суёт тебе в руки, не слушая возражений.',
        effects: [set26('atr', 'ride'), w26('timm_family', 'home'), { give: 'c26_milk', qty: 2 }, { body: 'fatigue', delta: 3 }, until26(10, 40)] },
      { id: 'c26_atr_scarf', label: 'Отдать Йонасу свой шарф: он синий от холода', minutes: 10, terminal: true, goto: 'c26_a_ditch', ambientDuring: snow26,
        text: 'Ты наматываешь шарф мальчику до самых глаз. Анке смотрит на тебя и говорит только: «Danke. Für gestern und für heute». Спасибо. За вчера и за сегодня. Трактор трогается. Обратно ты идёшь с открытой шеей, и ветер находит её сразу.',
        effects: [set26('atr', 'scarf'), w26('timm_family', 'home'), { body: 'stress', delta: -3 }, until26(10, 15)] },
      { id: 'c26_atr_wave', label: 'Помахать и идти домой', minutes: 5, terminal: true, goto: 'c26_a_ditch',
        text: 'Ты машешь. Йонас машет в ответ, высунув руку из-под попоны. Трактор уходит к Люллау, и тарахтение долго висит над полем.',
        effects: [set26('atr', 'wave'), w26('timm_family', 'home'), until26(10, 10)] },
    ] }),

  X({ id: 'c26_b_grete', title: 'Кирхвег, 4', location: 'c16_jesteburg', ambient: snow26,
    text: [
      { text: 'По дороге из пункта ты проходишь мимо Кирхвег. У дома четыре на крыльце стоит мужчина в двух свитерах. Он ждал. Он машет тебе.' },
      { when: flag('w.c25_kirch_less'), text: '— Eine hat für drei Tage gereicht. Grete spart. Sie spricht wieder. Sie will Sie sehen.\n\nОдной хватило на три дня. Грета экономит. Она снова говорит. Хочет вас видеть.' },
      { when: not(flag('w.c25_kirch_less')), text: '— Grete steht wieder auf. Seit heute früh. Sie will Sie sehen. Nur kurz.\n\nГрета снова встаёт. С утра. Хочет вас видеть. Ненадолго.' },
    ],
    actions: [
      { id: 'c26_bgr_in', label: 'Зайти к Грете', minutes: 30, terminal: true, goto: 'c26_b_walk',
        text: 'Грета сидит у окна в кресле, укрытая пледом. Она берёт тебя за руку сухими пальцами и долго держит. Потом достаёт из кармана халата брошку, стеклянную, в виде ласточки.\n\n— Für Sie. Ich habe nichts anderes. Und ich will nicht nichts geben.\n\nДля вас. Больше у меня ничего нет. А ничего не отдать я не хочу.',
        effects: [set26('bgr', 'in'), w26('grete_met', true), { body: 'stress', delta: -3 }, until26(12, 50)] },
      { id: 'c26_bgr_note', label: 'Передать через мужа: в субботу зайду', minutes: 10, terminal: true, goto: 'c26_b_walk',
        text: 'Мужчина кивает и повторяет «Samstag» два раза, чтобы не забыть. Ты уходишь. Оборачиваешься у поворота: он всё ещё стоит на крыльце.',
        effects: [set26('bgr', 'note'), w26('grete_saturday', true), until26(12, 35)] },
      { id: 'c26_bgr_no', label: 'Махнуть рукой: нет сил, после смены', minutes: 5, terminal: true, goto: 'c26_b_walk',
        text: 'Ты машешь ему и идёшь дальше. Ноги после смены как чужие. Он понимает. Наверное.',
        effects: [set26('bgr', 'no'), until26(12, 30)] },
    ] }),

  X({ id: 'c26_b_pia', title: 'Пия', location: 'c16_jesteburg', camp: { at: 'c16_jesteburg', stock: 'c3_farm_stock', rest: false }, ambient: { tempC: 14, outdoor: false, wet: false },
    text: [
      { text: 'Перед уходом ты заглядываешь в заднюю комнату. Пия спит, раскинув руки. Щёки пылают, губы сухие. Кукла с разными глазами сползла на пол.' },
      { when: { v: '$.c26_bc', op: '==', value: 'syrup' }, text: 'Сиропа от жара больше нет. Последнюю бутылку ты {m:отдал|отдала} мальчику утром. Правильно {m:отдал|отдала}. От этого не легче.' },
      { text: 'Зандер стоит в дверях с журналом и смотрит на тебя, а не на девочку.' },
    ],
    actions: [
      { id: 'c26_bpi_cool', label: 'Обтереть её прохладной водой и посидеть ещё полчаса', minutes: 40, terminal: true, outcomes: afterPoint2,
        text: 'Тазик, полотенце, вода из банки на подоконнике. Ты обтираешь ей лоб, шею, запястья, обходя повязку. Пия не просыпается, но дышит ровнее. Когда ты уходишь, жар ниже на полградуса. Зандер записывает это в журнал.',
        effects: [set26('bpi', 'cool'), w26('pia', 'cool'), until26(12, 0)] },
      { id: 'c26_bpi_ask', label: 'Спросить Зандер прямо: сколько у неё времени', minutes: 20, terminal: true, outcomes: afterPoint2,
        text: 'Зандер закрывает журнал.\n\n— Bis Freitag. Vielleicht Samstag. Dann muss ich es der Mutter sagen. Und dann muss ich… — Она не договаривает.\n\nДо пятницы. Может, до субботы. Потом придётся сказать матери. А потом придётся…\n\nТы поднимаешь куклу с пола и кладёшь Пие на грудь.',
        effects: [set26('bpi', 'ask'), w26('pia_time', true), { body: 'stress', delta: 3 }, until26(11, 50)] },
      { id: 'c26_bpi_doll', label: 'Поднять куклу и уйти тихо, не будя', minutes: 10, terminal: true, outcomes: afterPoint2,
        text: 'Ты поднимаешь куклу и кладёшь её Пие под руку. Пальцы во сне смыкаются на тряпичной ноге. Ты выходишь на цыпочках.',
        effects: [set26('bpi', 'doll'), until26(11, 45)] },
    ] }),
];
