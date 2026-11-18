import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { meal } from './point12';
import { brothersCome, oleHome33 } from './point33';
import { lea36 } from './point36';
import {
  S41, after41, cowLost41, gerdesDead41, henrike41, jorg41, lea41, merle41, own41, partnerDown41, partnerUp41, set41,
  until41, w41, wet41,
} from './point41';

// Участок 41. A: тела у ручья, ружьё, костёр, брошенный пост (находка — ящик связиста, 1512), день по КТ40, братья, ремонт, трактор,
// Лея (по КТ40) или Фолькер, Йорг, Зеве в сумерках, дрова, приёмник. B: раны, Хенрике, корова (мясо, если погибла), Мерле, день по КТ40,
// фрау Петерс, Йорг и дети, Ханзены, дети после ночи, Зандер, стирка, письмо. R (спасение): тепло, доктор Зандер, полдень, гости,
// перевязка, сумерки, пробуждение.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S41({ ...scene, for: 'any', chapter: 'ch3' });
const treat = (how: 'basic' | 'proper'): Effect => ({ treat: how, target: '@partner' });
const blood = (delta: number): Effect => ({ body: 'bloodLoss', delta, target: '@partner' });
const drink = (delta: number): Effect => ({ body: 'thirst', delta, target: '@partner' });
const drip: Effect = { if: partnerDown41, then: [blood(-25), drink(-40)] };
const leaHere: Cond = all(lea36, any(lea41('walk'), lea41('go'), lea41('stay')));
const volkerYard: Cond = v('w.c40_volker', 'yard');
const petersFarm: Cond = v('w.c40_peters', 'farm');

export const day41Scenes: Scene[] = [
  // ═════════════ A ═════════════
  X({ id: 'c41_a_bodies', title: 'Тела', camp: yard14, safe: false, ambient: wet41,
    text: [
      { text: 'Лукас и двое из дружины приходят с тачкой и баграми. У забора, у сарая, на лугу у ручья — девять тел. Мокрые, в грязи, в больничных рубашках.' },
      { text: '— Handschuhe. Und nichts ins Gesicht, — говорит Лукас. Перчатки. И ничего в лицо.' },
    ],
    actions: [
      { id: 'c41_ab_work', label: 'Взять багор и работать со всеми', minutes: 40, activity: 'heavy', terminal: true, goto: 'c41_a_gun', ambientDuring: wet41,
        text: 'Багор, тачка, за сарай. Девять ходок. Ты не смотришь в лица. На шестом ты узнаёшь куртку: такую носил сосед с насыпи до ноября. Ты не говоришь никому.', effects: [set41('ab', 'work'), { body: 'fatigue', delta: 10 }, until41(8, 20)] },
      { id: 'c41_ab_count', label: 'Считать и записывать: кто, где лежал', minutes: 40, terminal: true, goto: 'c41_a_gun', ambientDuring: wet41,
        text: 'Ты пишешь на листе: место, примерный возраст, во что одет. Брандт просил. Если кто-то будет искать своих, хоть что-то останется.', effects: [set41('ab', 'count'), w41('body_list', true), until41(8, 20)] },
      { id: 'c41_ab_gloves', label: 'Сначала найти всем перчатки и мешки на руки', minutes: 40, terminal: true, goto: 'c41_a_gun', ambientDuring: wet41,
        text: 'Перчатки Хенрике, рабочие рукавицы Оле, пакеты поверх. Лукас смеётся, но надевает. Работаете медленнее, зато ни у кого ни царапины в чужой крови.', effects: [set41('ab', 'gloves'), w41('gloves', true), until41(8, 20)] },
    ] }),

  X({ id: 'c41_a_gun', title: 'Патроны', camp: kitchen14,
    text: [
      { when: oleHome33, text: 'Оле сидит на кухне с ружьём на коленях и чистит стволы. Ночью он стрелял четыре раза. Патронов в банке осталось шесть.' },
      { when: not(oleHome33), text: 'Ружьё стоит за шкафом. Ночью из него стреляли. Патронов в банке осталось шесть.' },
    ],
    actions: [
      { id: 'c41_ag_clean', label: 'Почистить ружьё и пересчитать патроны', minutes: 40, terminal: true, goto: 'c41_a_pyre',
        text: 'Шомпол, тряпка, масло. Шесть патронов на подоконнике, в ряд. Шесть. До весны. Ты кладёшь их обратно в банку по одному.', effects: [set41('ag', 'clean'), w41('shells', 6), until41(9, 0)] },
      { id: 'c41_ag_rule', label: 'Договориться: стрелять только в упор, только в крайнем случае', minutes: 40, terminal: true, goto: 'c41_a_pyre',
        text: 'Все кивают. Шесть патронов — это шесть раз. Остальное — лом, вилы, двери. Хенрике говорит: «Und Köpfchen». И голова.', effects: [set41('ag', 'rule'), w41('gun_rule', true), until41(9, 0)] },
      { id: 'c41_ag_brandt', label: 'Решить спросить у Брандта патронов', minutes: 30, terminal: true, goto: 'c41_a_pyre',
        text: 'Ты записываешь на ладони: «Brandt — Patronen». Может, у пожарных остались. Может, нет.', effects: [set41('ag', 'brandt'), w41('ask_shells', true), until41(8, 50)] },
    ] }),

  X({ id: 'c41_a_pyre', title: 'Костёр', camp: yard14, ambient: wet41,
    text: [
      { text: 'Тела за сараем. Земля мокрая, глубоко не выкопать. Лукас приносит канистру солярки и смотрит на тебя: жечь?' },
      { text: 'Девять. Ты не хочешь смотреть им в лица и всё равно смотришь. У одного на руке часы, ещё идут. У женщины в кармане куртки торчит детская варежка. Это были чьи-то люди. Теперь это работа до обеда.' },
    ],
    actions: [
      { id: 'c41_ap_burn', label: 'Жечь: иначе к весне будет зараза', minutes: 40, terminal: true, goto: 'c41_a_post', ambientDuring: wet41,
        text: 'Хворост, солярка, спичка. Дым чёрный, жирный, ветер несёт его на поле. Хенрике закрывает окна. Ты стоишь, пока огонь не берёт как следует. Потом уходишь.', effects: [set41('ap', 'burn'), w41('pyre', true), until41(9, 40)] },
      { id: 'c41_ap_bury', label: 'Закопать, как можно глубже', minutes: 40, activity: 'heavy', terminal: true, goto: 'c41_a_post', ambientDuring: wet41,
        text: 'Лопата в мокрую землю, по колено, дальше вода. Тела в яму, сверху земля и камни. Не по правилам. Но по-человечески.', effects: [set41('ap', 'bury'), { body: 'fatigue', delta: 10 }, until41(9, 40)] },
      { id: 'c41_ap_cross', label: 'Жечь, но сначала постоять минуту молча', minutes: 45, terminal: true, goto: 'c41_a_post', ambientDuring: wet41,
        text: 'Ты стоишь у сложенных тел минуту. Лукас смотрит, потом снимает шапку тоже. Они были людьми до ноября. Потом огонь.', effects: [set41('ap', 'cross'), w41('pyre', true), until41(9, 45)] },
    ] }),

  X({ id: 'c41_a_post', title: 'Брошенный пост', camp: yard14, safe: false, ambient: wet41,
    text: [
      { text: 'У переезда за насыпью армия до понедельника держала пост: будка, мешки с песком, бочка. Лукас говорит, там остался ящик, железный, с замком. Никто не открыл.' },
      { text: 'Ящик под навесом будки: армейский, зелёный, с надписью «Fernmelde». Связь. Кодовый замок на четыре колёсика.' },
      { when: flag('$.c40_tu'), text: 'Ты вспоминаешь мел на брезенте последнего грузовика, во вторник на рассвете.' },
    ],
    actions: [
      { id: 'c41_ap2_1512', label: 'Набрать 1-5-1-2', minutes: 20, terminal: true, goto: 'c41_a_open', ambientDuring: wet41,
        text: 'Один, пять, один, два. Пятнадцатое двенадцатого. Замок щёлкает. Солдаты не мудрили: последний день — последний код.', effects: [set41('ap2', '1512'), set41('box_open', true), w41('box', 'open'), until41(10, 20)] },
      { id: 'c41_ap2_1215', label: 'Набрать 1-2-1-5', minutes: 20, terminal: true, goto: 'c41_a_post2', ambientDuring: wet41,
        text: 'Один, два, один, пять. Замок не поддаётся.', effects: [set41('ap2', '1215'), until41(10, 20)] },
      { id: 'c41_ap2_0500', label: 'Набрать 0-5-0-0: время отъезда', minutes: 20, terminal: true, goto: 'c41_a_post2', ambientDuring: wet41,
        text: 'Ноль, пять, ноль, ноль. Ничего.', effects: [set41('ap2', '0500'), until41(10, 20)] },
      { id: 'c41_ap2_leave', label: 'Не трогать: армейское', minutes: 15, terminal: true, goto: 'c41_a_after', ambientDuring: wet41,
        text: 'Ты оставляешь ящик под навесом. Может, вернутся. Не вернутся. Но это не твоё.', effects: [set41('ap2', 'leave'), w41('box', 'left'), until41(10, 15)] },
    ] }),

  X({ id: 'c41_a_post2', title: 'Замок', camp: yard14, ambient: wet41,
    text: [
      { text: 'Колёсики мокрые, тугие. Замок армейский, крепкий: ломом его не взять, только дужку перепилить.' },
      { text: 'Лукас переминается у будки и поглядывает на насыпь: оттуда видно далеко, и тебя оттуда тоже.' },
    ],
    actions: [
      { id: 'c41_ap3_1512', label: 'Набрать 1-5-1-2', minutes: 20, terminal: true, goto: 'c41_a_open', ambientDuring: wet41,
        text: 'Один, пять, один, два. Замок щёлкает.', effects: [set41('ap3', '1512'), set41('box_open', true), w41('box', 'open'), until41(10, 40)] },
      { id: 'c41_ap3_saw', label: 'Перепилить дужку ножовкой', when: { has: 'c29_wire' }, minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_a_open', ambientDuring: wet41,
        text: 'Ножовка от Керема визжит по закалённой стали. Сорок минут, мозоль на ладони. Дужка лопается. Внутри что-то звякнуло, когда ящик сдвинулся.', effects: [set41('ap3', 'saw'), set41('box_open', true), set41('box_broken', true), w41('box', 'broken'), until41(11, 0)] },
      { id: 'c41_ap3_leave', label: 'Оставить', minutes: 15, terminal: true, goto: 'c41_a_after', ambientDuring: wet41,
        text: 'Ты оставляешь ящик. Может, кто-нибудь знает код. Может, никто.', effects: [set41('ap3', 'leave'), w41('box', 'left'), until41(10, 35)] },
    ] }),

  X({ id: 'c41_a_open', title: 'Ящик связиста', camp: yard14, ambient: wet41,
    text: [
      { text: 'Внутри, в поролоне, — переносная рация армейская, с запасным аккумулятором в пакете. Пачка батареек. Три суточных пайка. Сложенная карта округа с частотами карандашом на полях.' },
      { when: flag('$.c41_box_broken'), text: 'Одна банка из пайка лопнула при ударе. Рация цела.' },
      { text: 'На карте, внизу, рукой: «Rotes Kreuz Winsen — 145,500. Notruf Kreis — 147,300».' },
    ],
    actions: [
      { id: 'c41_ao_all', label: 'Забрать всё', minutes: 30, terminal: true, goto: 'c41_a_after', ambientDuring: wet41,
        text: 'Рация тяжёлая, как кирпич. Ты несёшь ящик домой на плече. Вечером можно будет попробовать: слушать, не говорить.', effects: [set41('ao', 'all'), { give: 'c41_radio' }, { give: 'c24_epa', qty: 3 }, w41('radio', true), until41(10, 50)] },
      { id: 'c41_ao_brandt', label: 'Рацию отдать Брандту: ему нужнее, связь между дворами', minutes: 30, terminal: true, goto: 'c41_a_after', ambientDuring: wet41,
        text: 'Ты отдаёшь рацию Лукасу для Брандта. Пайки забираешь. Вечером Лукас приносит ответ: «Brandt sagt: danke. Er ruft euch, wenn was ist». Брандт говорит спасибо. Позовёт, если что.', effects: [set41('ao', 'brandt'), { give: 'c24_epa', qty: 3 }, w41('radio', 'brandt'), npc('c16_brandt', 2), until41(10, 50)] },
      { id: 'c41_ao_try', label: 'Включить прямо здесь и послушать', minutes: 40, terminal: true, goto: 'c41_a_after', ambientDuring: wet41,
        text: 'Треск, шипение. Ты крутишь на сто сорок пять и пять. Женский голос, усталый: «…Winsen, Rotes Kreuz, für alle: Schule offen, Ärztin da…» Винзен, Красный Крест, всем: школа открыта, врач на месте. Ты стоишь под дождём и слушаешь, пока не начинают мёрзнуть руки.', effects: [set41('ao', 'try'), { give: 'c41_radio' }, { give: 'c24_epa', qty: 3 }, w41('radio', true), w41('heard_winsen', true), until41(11, 0)] },
    ] }),

  X({ id: 'c41_a_after', title: 'День', camp: yard14, ambient: wet41,
    text: [
      { when: after41('farm'), text: 'Утром решили: сначала свой двор. Забор у сарая сломан, проволока порвана, дверь хлева висит на одной петле.' },
      { when: after41('neighbors'), text: 'Утром решили: сначала соседи. У Уте в колонии сорвало дверь сарая. У Ханзенов выбиты окна.' },
      { when: after41('council'), text: 'Утром решили: совет. В полдень в пожарной части собираются те, кто может.' },
    ],
    actions: [
      { id: 'c41_aa_fix', label: 'Чинить: забор, дверь, проволоку', when: after41('farm'), minutes: 45, activity: 'heavy', terminal: true, goto: 'c41_a_brothers', ambientDuring: wet41,
        text: 'Молоток, гвозди, проволока. Дверь хлева на место, забор подпёрт, проволока с банками заново. К полудню двор снова похож на двор.', effects: [set41('aa', 'fix'), w41('yard_fixed', true), { body: 'fatigue', delta: 8 }, until41(11, 35)] },
      { id: 'c41_aa_ute', label: 'Идти к Уте и Ханзенам: чинить у них', when: after41('neighbors'), minutes: 45, activity: 'heavy', terminal: true, goto: 'c41_a_brothers', ambientDuring: wet41,
        text: 'Дверь сарая Уте на петли, окна Ханзенов досками. Яннес помогает, молча. Уте приносит тебе кружку горячего: «Ihr seid gute Nachbarn». Вы хорошие соседи.', effects: [set41('aa', 'ute'), npc('c14_ute', 2), w41('helped_neighbors', true), until41(11, 35)] },
      { id: 'c41_aa_council', label: 'Идти на совет в пожарную часть', when: after41('council'), minutes: 45, terminal: true, goto: 'c41_a_brothers', ambientDuring: wet41,
        text: 'В пожарной части человек тридцать. Брандт говорит коротко: ров вдоль ручьёв, общая стража, ракеты — каждому двору. Голосуют руками. Ты поднимаешь руку вместе со всеми.', effects: [set41('aa', 'council'), w41('council_ditch', true), until41(11, 35)] },
      { id: 'c41_aa_walk', label: 'Сначала обойти всё и записать, что чинить', minutes: 45, terminal: true, goto: 'c41_a_brothers', ambientDuring: wet41,
        text: 'Сарай, хлев, курятник, колодец, изгородь. Ты пишешь на картонке столбиком, что сломано. Список длинный. Ты прибиваешь его к двери сарая, чтобы видели все, и начинаешь сверху.', effects: [set41('aa', 'walk'), w41('repair_list', true), until41(11, 35)] },
      { id: 'c41_aa_breath', label: 'Сначала посидеть пять минут на крыльце: руки ещё дрожат', minutes: 45, terminal: true, goto: 'c41_a_brothers', ambientDuring: wet41,
        text: 'Ты садишься на мокрую ступеньку. Руки на коленях дрожат и не слушаются. Через пять минут перестают. Ты встаёшь и делаешь то, что решили утром, медленнее, чем мог{m:|ла} бы.', effects: [set41('aa', 'breath'), { body: 'stress', delta: -4 }, until41(11, 35)] },
    ] }),

  X({ id: 'c41_a_brothers', title: 'Двор у насыпи', camp: yard14, ambient: wet41,
    text: [
      { when: brothersCome, text: 'Дениз и Керем во дворе у насыпи: у них ночью сорвало ворота, фургон стоит с разбитой фарой. Дениз курит и смотрит на фару.' },
      { when: not(brothersCome), text: 'У насыпи пустой двор, куда никто не заселился. Ночью там выбили все окна. Ты стоишь у забора и думаешь, что было бы, если бы там кто-то жил.' },
    ],
    actions: [
      { id: 'c41_abr_help', label: 'Помочь братьям поставить ворота', when: brothersCome, minutes: 40, activity: 'heavy', terminal: true, goto: 'c41_lunch', ambientDuring: wet41,
        text: 'Ворота тяжёлые, петли гнутые. Втроём вы ставите их на место. Дениз хлопает тебя по плечу: «Wir sind quitt. Wieder mal». Опять квиты.', effects: [set41('abr', 'help'), npc('deniz', 1), until41(12, 15)] },
      { id: 'c41_abr_talk', label: 'Спросить, как прошла их ночь', when: brothersCome, minutes: 30, terminal: true, goto: 'c41_lunch', ambientDuring: wet41,
        text: 'Керем рассказывает: заперлись в подвале, слушали, как ходят сверху. Дениз молчит. Потом говорит: «Nächstes Mal sind wir bei euch. Zusammen ist besser». В следующий раз мы у вас. Вместе лучше.', effects: [set41('abr', 'talk'), w41('brothers_join', true), until41(12, 15)] },
      { id: 'c41_abr_look', label: 'Обойти пустой двор: что там можно взять', when: not(brothersCome), minutes: 40, terminal: true, goto: 'c41_lunch', ambientDuring: wet41,
        text: 'В пустом доме — битое стекло, сырость, мыши. В сарае — два мешка угля и старая печка-буржуйка. Ты отмечаешь: взять, когда будет время.', effects: [set41('abr', 'look'), w41('empty_coal', true), until41(12, 15)] },
      { id: 'c41_abr_back', label: 'Вернуться домой', when: not(brothersCome), minutes: 30, terminal: true, goto: 'c41_lunch', ambientDuring: wet41,
        text: 'Ты идёшь домой вдоль насыпи. На ней следы ночи: сапоги, полосы, бурые пятна в снежной каше.', effects: [set41('abr', 'back'), until41(12, 10)] },
      { id: 'c41_abr_lunch', label: 'Позвать их к вам на обед', when: brothersCome, minutes: 30, terminal: true, goto: 'c41_lunch', ambientDuring: wet41,
        text: 'Дениз отказывается, Керем соглашается за обоих. Через полчаса они сидят у вас на лавке, мокрые, и Хенрике молча ставит им две лишние миски.', effects: [set41('abr', 'lunch'), npc('deniz', 1), until41(12, 15)] },
      { id: 'c41_abr_board', label: 'Заколотить окна пустого дома, чтобы там никто не устроил логово', when: not(brothersCome), minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_lunch', ambientDuring: wet41,
        text: 'Доски от забора, гвозди, молоток. Три окна, дверь. Теперь пустой дом у насыпи не примет ни живых, ни мёртвых.', effects: [set41('abr', 'board'), w41('empty_boarded', true), until41(12, 15)] },
    ] }),

  X({ id: 'c41_a_repair', title: 'Хлев', camp: yard14, ambient: wet41,
    text: [
      { when: all(cowLost41, flag('w.c41_beef')), text: 'В хлеву пусто. Корову разделали утром. Пол вымыт. Пахнет хлоркой.' },
      { when: all(cowLost41, not(flag('w.c41_beef'))), text: 'В хлеву пусто. Пол вымыт. Пахнет хлоркой.' },
      { when: not(cowLost41), text: 'Корова в хлеву жуёт сено, как будто ничего не было.' },
      { text: 'Дверь хлева перекосило: ночью в неё ломились.' },
    ],
    actions: [
      { id: 'c41_ar_door', label: 'Перевесить дверь, поставить второй засов', minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_a_gap', ambientDuring: wet41,
        text: 'Петли, засов, две доски поперёк. Дверь теперь можно выбить только тараном. Корове или пустоте за ней всё равно. Тебе нет.', effects: [set41('ar', 'door'), w41('barn_door', true), until41(13, 40)] },
      { id: 'c41_ar_coop', label: 'Укрепить курятник: куры целы, пусть так и будет', minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_a_gap', ambientDuring: wet41,
        text: 'Сетка, доски, камни по низу. Куры смотрят на тебя одним глазом каждая. Девять кур. Девять яиц в лучший день.', effects: [set41('ar', 'coop'), w41('coop_fixed', true), until41(13, 40)] },
      { id: 'c41_ar_rest', label: 'Посидеть в хлеву пять минут', minutes: 30, terminal: true, goto: 'c41_a_gap',
        text: 'Ты садишься на перевёрнутое ведро. Тихо. Пахнет сеном. Пять минут никто тебя не ищет.', effects: [set41('ar', 'rest'), { body: 'stress', delta: -4 }, until41(13, 30)] },
    ] }),

  X({ id: 'c41_a_gap', title: 'Где прошли', camp: yard14, ambient: wet41,
    text: [
      { text: 'Ты обходишь забор по кругу. Там, где живая изгородь подходит к канаве, ветки сломаны и вдавлены в грязь: ночью здесь прошли несколько. Дыра в рост человека.' },
    ],
    actions: [
      { id: 'c41_ag2_harrow', label: 'Закрыть дыру бороной зубьями наружу', minutes: 25, activity: 'heavy', terminal: true, goto: 'c41_a_tractor', ambientDuring: wet41,
        text: 'Старая борона из-за сарая — на ребро, зубьями к полю. Проволокой к столбам. Кто полезет — повиснет.', effects: [set41('ag2', 'harrow'), w41('gap', 'harrow'), { body: 'fatigue', delta: 5 }, until41(14, 5)] },
      { id: 'c41_ag2_cans', label: 'Натянуть проволоку с банками в два ряда', minutes: 20, terminal: true, goto: 'c41_a_tractor', ambientDuring: wet41,
        text: 'Проволока на уровне колена и на уровне груди, на ней пустые банки с камешками. Не остановит. Но разбудит.', effects: [set41('ag2', 'cans'), w41('gap', 'cans'), until41(14, 0)] },
      { id: 'c41_ag2_ditch', label: 'Углубить канаву перед изгородью', minutes: 25, activity: 'heavy', terminal: true, goto: 'c41_a_tractor', ambientDuring: wet41,
        text: 'Лопата в мокрую глину. Глина тяжёлая, липнет. Канава глубже на штык, и вода сразу заполняет её. Тем лучше: по колено в ледяной воде они ходят медленно.', effects: [set41('ag2', 'ditch'), w41('gap', 'ditch'), { body: 'fatigue', delta: 6 }, until41(14, 5)] },
    ] }),

  X({ id: 'c41_a_tractor', title: 'Машины', camp: yard14, ambient: wet41,
    text: [
      { text: 'Corsa под навесом, по колёса в жиже. Трактор стоит у сарая в грязи. Надо понять, что из этого ещё едет.' },
      { text: 'Без трактора хутор не вывезет дров из лесополосы, а без машины до Винзена — полдня пешком. Бензина в Corsa на донышке, солярки у трактора — полбака. Если что-то из этого встанет до весны, встанет надолго.' },
    ],
    actions: [
      { id: 'c41_at_car', label: 'Завести Corsa и вытащить на сухое', minutes: 20, terminal: true, goto: 'c41_a_lea',
        text: 'Мотор чихает, потом заводится. Колёса буксуют, но машина выползает на гравий у ворот. Живая.', effects: [set41('at', 'car'), w41('car_ok', true), until41(14, 20)] },
      { id: 'c41_at_tractor', label: 'Проверить трактор', when: flag('w.c16_tractor'), minutes: 20, terminal: true, goto: 'c41_a_lea',
        text: 'Трактор стоит, как стоял. Аккумулятор жив, солярки — сколько было. До сухой погоды с бугра его не сдвинуть. И не надо.', effects: [set41('at', 'tractor'), until41(14, 20)] },
      { id: 'c41_at_skip', label: 'Оставить на потом: не до машин', minutes: 15, terminal: true, goto: 'c41_a_lea',
        text: 'Машины подождут. Люди — нет.', effects: [set41('at', 'skip'), until41(14, 15)] },
    ] }),

  X({ id: 'c41_a_lea', title: 'Уходящие', camp: yard14, ambient: wet41,
    text: [
      { when: all(leaHere, lea41('walk')), text: 'Лея стоит у ворот с рюкзаком. Договорились: до Ханштедта — вместе.' },
      { when: all(leaHere, lea41('go')), text: 'Лея стоит у ворот с рюкзаком. Договорились: дальше она одна. Прощаются здесь.' },
      { when: all(leaHere, lea41('stay')), text: 'Лея сидит на крыльце с рюкзаком у ног. Она осталась. Курит и смотрит на дорогу на восток.' },
      { when: all(not(leaHere), volkerYard), text: 'У ворот — Фолькер с тележкой. Он пришёл пешком из Люнебурга: раз он в вашем листе, то и работать будет у вас. За еду и угол.' },
      { when: all(not(leaHere), not(volkerYard)), text: 'По дороге мимо ворот идут люди из Люнебурга на запад: тачки, санки, дети. Один мужчина останавливается и просит воды.' },
    ],
    actions: [
      { id: 'c41_al_walk', label: 'Проводить Лею до Ханштедта', when: all(leaHere, lea41('walk')), minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Шесть километров по мокрой дороге. Лея молчит почти всю дорогу. У Ханштедта она останавливается: «Hier». Здесь. Обнимает тебя одной рукой, быстро. И уходит, не оглядываясь.', effects: [set41('al', 'walk'), w41('lea_gone', true), npc('c21_lea', 2), { body: 'fatigue', delta: 6 }, until41(15, 5)] },
      { id: 'c41_al_go', label: 'Попрощаться у ворот', when: all(leaHere, lea41('go')), minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Лея жмёт тебе руку, как мужчина. «Wenn ich sie finde, schreibe ich». Если найду их, напишу. Ты смотришь ей вслед, пока дорога не поворачивает.', effects: [set41('al', 'go'), w41('lea_gone', true), until41(14, 45)] },
      { id: 'c41_al_stay', label: 'Сесть рядом с Леей на крыльце', when: all(leaHere, lea41('stay')), minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Лея протягивает тебе сигарету. Ты не куришь. Берёшь всё равно. «Im Frühjahr», — говорит она. Весной. Это обещание. Себе.', effects: [set41('al', 'stay'), npc('c21_lea', 1), until41(14, 45)] },
      { id: 'c41_al_volker', label: 'Пустить Фолькера: в сарае есть место', when: all(not(leaHere), volkerYard), minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Фолькер кивает, ставит тележку у сарая и сразу идёт смотреть крышу. «Die Rinne ist hin». Желоб сломан. К вечеру желоб висит на месте. В ноябре вы его не пустили. Теперь он кроет вам крышу.', effects: [set41('al', 'volker'), w41('volker_here', true), until41(14, 45)] },
      { id: 'c41_al_send', label: 'Сказать Фолькеру: места нет, но еды дадим', when: all(not(leaHere), volkerYard), minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Фолькер берёт хлеб и кивает. «Dann Gerdes. Die brauchen einen Mann». Тогда к Ханзенам. Им нужен мужчина. Он уходит через поле с тележкой.', effects: [set41('al', 'send'), w41('volker_gerdes', true), until41(14, 45)] },
      { id: 'c41_al_water', label: 'Дать прохожему воды', when: all(not(leaHere), not(volkerYard)), minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Ведро из колодца, кружка. Мужчина пьёт, его дети тоже. Он говорит, что в Люнебурге после армии остались одни старики и пожарные. Все, кто может, уходят на запад.', effects: [set41('al', 'water'), until41(14, 45)] },
      { id: 'c41_al_work', label: 'Кивнуть издалека и не бросать работу', minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Ты поднимаешь руку от забора. У ворот поднимают руку в ответ. Сегодня каждый занят своим, и это тоже прощание.', effects: [set41('al', 'work'), until41(14, 45)] },
      { id: 'c41_al_write', label: 'Записать в тетрадь: кто, когда, куда', minutes: 25, terminal: true, goto: 'c41_a_jorg', ambientDuring: wet41,
        text: 'Дата, имя, куда. Ты пишешь коротко, карандашом. Если когда-нибудь кто-то придёт спрашивать, у хутора будет ответ.', effects: [set41('al', 'write'), until41(14, 45)] },
    ] }),

  X({ id: 'c41_a_jorg', title: 'Йорг', camp: yard14, ambient: wet41,
    text: [
      { when: jorg41, text: 'Йорг грузит тачку. Говорит, что уходить надо сейчас, пока дорога не раскисла совсем. Сам он ещё не решил.' },
      { when: not(jorg41), text: 'Сосед из колонии, Яннес, приходит за гвоздями и остаётся помочь. Вдвоём быстрее.' },
    ],
    actions: [
      { id: 'c41_aj_stay', label: 'Сказать Йоргу: оставайтесь до весны, работы хватит', when: jorg41, minutes: 25, terminal: true, goto: 'c41_brandt', ambientDuring: wet41,
        text: 'Йорг смотрит на детей, на дом, на тебя. Разгружает тачку обратно. Ничего не говорит. Вечером он колет дрова до темноты.', effects: [set41('aj', 'stay'), w41('jorg_ask', 'stay'), until41(15, 30)] },
      { id: 'c41_aj_go', label: 'Помочь собраться и дать еды в дорогу', when: jorg41, minutes: 25, terminal: true, goto: 'c41_brandt', ambientDuring: wet41,
        text: 'Хлеб, сало, банка тушёнки. Йорг жмёт тебе руку обеими руками. «Tostedt ist nicht weit. Wenn ihr mal da seid…» Тоштедт недалеко. Если будете там…', effects: [set41('aj', 'go'), w41('jorg_ask', 'go'), until41(15, 30)] },
      { id: 'c41_aj_jannes', label: 'Работать с Яннесом', when: not(jorg41), minutes: 25, terminal: true, goto: 'c41_brandt', ambientDuring: wet41,
        text: 'Яннес держит, ты прибиваешь. Он говорит мало. Перед уходом: «Uta sagt, ihr sollt Weihnachten kommen». Уте говорит, чтобы вы пришли на Рождество.', effects: [set41('aj', 'jannes'), w41('ute_xmas', true), until41(15, 30)] },
      { id: 'c41_aj_alone', label: 'Отпустить Яннеса: у Уте дел не меньше', when: not(jorg41), minutes: 25, terminal: true, goto: 'c41_brandt', ambientDuring: wet41,
        text: 'Яннес берёт гвозди и уходит через поле. Ты прибиваешь доски {m:один|одна}, придерживая коленом. Медленнее. Зато у Уте сегодня тоже будет крыша.', effects: [set41('aj', 'alone'), until41(15, 30)] },
      { id: 'c41_aj_wood', label: 'Позвать колоть дрова вместе: за работой легче говорить', minutes: 25, activity: 'heavy', terminal: true, goto: 'c41_brandt', ambientDuring: wet41,
        text: 'Два колуна, одна колода. Говорите мало, колете много. К половине четвёртого поленница выросла на целый ряд, и разговор, которого не было, вроде бы состоялся.', effects: [set41('aj', 'wood'), { body: 'fatigue', delta: 5 }, until41(15, 30)] },
    ] }),

  X({ id: 'c41_a_seeve', title: 'Зеве в сумерках', camp: yard14, safe: false, ambient: wet41,
    text: [
      { text: 'Сумерки. Зеве вышла из берегов: луг под водой, ивы стоят в воде по колено. Лёд унесло. В воде у ивы что-то цепляется за ветки и не тонет.' },
    ],
    actions: [
      { id: 'c41_as_look', label: 'Подойти посмотреть', minutes: 35, risky: true, terminal: true, goto: 'c41_a_wood', ambientDuring: wet41,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 2, uses: ['mobility'] },
            text: 'Ты подходишь по кромке. Обращённый, застрял в ветках, лицом вниз. Не двигается. Утонул. Ты отходишь и отмечаешь место: утром — багром.',
            effects: [set41('as', 'look'), until41(16, 50)] },
          { id: 'mud',
            text: 'Берег раскис, ты съезжаешь в воду по колено. Ледяная. В ветках — обращённый, утонувший. Ты выбираешься и идёшь домой в мокром сапоге.',
            effects: [set41('as', 'mud'), { body: 'stress', delta: 3 }, { body: 'fatigue', delta: 3 }, until41(16, 50)] },
        ] },
      { id: 'c41_as_mark', label: 'Не подходить: вешку на берег, утром разберутся', minutes: 25, terminal: true, goto: 'c41_a_wood', ambientDuring: wet41,
        text: 'Палка с тряпкой на берегу. Утром дружина пройдёт вдоль ручья с баграми. Сегодня хватит.', effects: [set41('as', 'mark'), until41(16, 40)] },
      { id: 'c41_as_home', label: 'Вернуться домой до темноты', minutes: 20, terminal: true, goto: 'c41_a_wood',
        text: 'Ты уходишь, не дожидаясь темноты. Правило Хенрике теперь — твоё правило.', effects: [set41('as', 'home'), until41(16, 35)] },
    ] }),

  X({ id: 'c41_a_wood', title: 'Дрова', camp: yard14, ambient: wet41,
    text: [
      { text: 'Поленница промокла сверху. Сухие дрова — только в сенях, их на два дня.' },
      { text: 'После оттепели обещают мороз: вода в поленнице замёрзнет, и мокрые дрова будут шипеть и не греть. Печь в доме съедает охапку за три часа. Людей в доме больше, чем было в ноябре.' },
    ],
    actions: [
      { id: 'c41_aw_cover', label: 'Накрыть поленницу брезентом и колоть из середины', minutes: 30, activity: 'heavy', terminal: true, goto: 'c41_a_signal', ambientDuring: wet41,
        text: 'Брезент сверху, камни по углам. Из середины поленницы дрова сухие. Ты колешь, пока не темнеет совсем.', effects: [set41('aw', 'cover'), { body: 'fatigue', delta: 8 }, until41(17, 15)] },
      { id: 'c41_aw_dry', label: 'Занести мокрые в дом сушить у печи', minutes: 30, terminal: true, goto: 'c41_a_signal',
        text: 'Охапки у печи, от них пар. В кухне пахнет мокрым деревом. Хенрике ворчит, но не мешает.', effects: [set41('aw', 'dry'), until41(17, 15)] },
      { id: 'c41_aw_skip', label: 'Хватит на сегодня', minutes: 20, terminal: true, goto: 'c41_a_signal',
        text: 'Ты ставишь колун в угол. Руки дрожат от усталости. На сегодня всё.', effects: [set41('aw', 'skip'), { body: 'fatigue', delta: -3 }, until41(17, 5)] },
    ] }),

  X({ id: 'c41_a_signal', title: 'Сигнал', camp: yard14, ambient: wet41,
    text: [
      { text: 'Лукас оставил у ворот то, что Брандт раздаёт дворам: сигнальную ракету в промасленной бумаге и кусок рельса на проволоке. Куда повесить — решать вам.' },
    ],
    actions: [
      { id: 'c41_asg_gate', label: 'Рельс — у ворот, ракету — в сени, у двери', minutes: 20, terminal: true, goto: 'c41_a_radio', ambientDuring: wet41,
        text: 'Рельс на столбе у ворот, рядом железный прут на шнурке. Ракета в сенях на гвозде, над сапогами. Каждый в доме знает, где.', effects: [set41('asg', 'gate'), w41('signal', 'gate'), until41(17, 35)] },
      { id: 'c41_asg_barn', label: 'Рельс — под крышей сарая: оттуда дальше слышно', minutes: 20, activity: 'moderate', terminal: true, goto: 'c41_a_radio', ambientDuring: wet41,
        text: 'Лестница, мокрая черепица, проволока. Рельс висит под коньком сарая: звон оттуда долетит до колонии. Чтобы ударить, надо лезть по лестнице. Ты оставляешь там же молоток.', effects: [set41('asg', 'barn'), w41('signal', 'barn'), until41(17, 35)] },
      { id: 'c41_asg_porch', label: 'Рельс — у крыльца, ракету — в кухонный стол, к дежурному', minutes: 15, terminal: true, goto: 'c41_a_radio', ambientDuring: wet41,
        text: 'Рельс под навесом крыльца. Ракету ты кладёшь в ящик кухонного стола, у лавки, где сидит дежурный. Близко к руке.', effects: [set41('asg', 'porch'), w41('signal', 'porch'), until41(17, 30)] },
    ] }),

  X({ id: 'c41_a_radio', title: 'Эфир', camp: kitchen14,
    text: [
      { when: flag('w.c41_radio'), text: 'Рация из ящика связиста стоит на подоконнике. Батарейки свежие.' },
      { when: not(flag('w.c41_radio')), text: 'Приёмник Хенрике на подоконнике. Армейская частота молчит. Остальные шипят.' },
      { text: 'Вечер после такой ночи. Хочется услышать хоть один голос, который скажет, что у других было так же. Или хуже. Или лучше — тоже хорошо.' },
    ],
    actions: [
      { id: 'c41_ar2_winsen', label: 'Слушать Красный Крест Винзена', minutes: 25, terminal: true, goto: 'c41_evening',
        text: 'Голос координатора с седой косой, ты узнаёшь его: «…für alle Höfe: Medizin in der Schule, Dienstag und Freitag. Wer Insulin hat, bitte melden…» Для всех дворов: лекарства в школе, вторник и пятница. У кого есть инсулин — сообщите.', effects: [set41('ar2', 'winsen'), w41('winsen_news', true), until41(18, 0)] },
      { id: 'c41_ar2_toronto', label: 'Искать Торонто на приёмнике Хенрике, на частоте Уве', when: flag('w.c39_toronto_freq'), minutes: 25, terminal: true, goto: 'c41_evening',
        text: 'Треск, свист, треск. Потом далёкий мужской голос по-английски: «…Thomas, VE3, calling Germany, Lüneburg district…» Связь рвётся. Но он там. Он зовёт.', effects: [set41('ar2', 'toronto'), w41('thomas_voice', true), until41(18, 0)] },
      { id: 'c41_ar2_off', label: 'Выключить: батарейки поберечь', minutes: 15, terminal: true, goto: 'c41_evening',
        text: 'Ты выключаешь. Тишина. За окном капает. Новости подождут до завтра.', effects: [set41('ar2', 'off'), until41(17, 45)] },
      { id: 'c41_ar2_note', label: 'Записать частоты на стене у окна', minutes: 15, terminal: true, goto: 'c41_evening',
        text: 'Карандашом по побелке: Красный Крест — 145,500, тревога округа — 147,300. Теперь их знает любой, кто подойдёт к окну.', effects: [set41('ar2', 'note'), until41(17, 45)] },
    ] }),

  // ═════════════ B ═════════════
  X({ id: 'c41_b_wounds', title: 'Раны', camp: kitchen14,
    text: [
      { text: 'Утро. На кухонном столе аптечка. Очередь: кто с царапиной, кто с ушибом, кто просто посидеть рядом.' },
      { when: v('w.c40_strangers_kid', 'hurt'), text: 'Младшая дочь Йорга держит руку на весу и не плачет. Рука опухла ниже локтя.' },
    ],
    actions: [
      { id: 'c41_bw_all', label: 'Перевязать всех по очереди', minutes: 40, terminal: true, goto: 'c41_b_henrike',
        text: 'Промыть, смазать, перевязать. Следующий. Руки работают сами. В конце очереди ты понимаешь, что у тебя {m:самого|самой} содрана кожа на ладони, и перевязываешь себя.', effects: [set41('bw', 'all'), until41(8, 20)] },
      { id: 'c41_bw_kid', label: 'Наложить девочке шину', when: v('w.c40_strangers_kid', 'hurt'), minutes: 40, terminal: true, goto: 'c41_b_henrike',
        text: 'Две дощечки от ящика, бинт, косынка. Девочка смотрит, как ты работаешь, и не шевелится. Йорг держит её за плечи и не может смотреть.', effects: [set41('bw', 'kid'), w41('kid_splint', true), until41(8, 20)] },
      { id: 'c41_bw_wash', label: 'Сначала вскипятить воду и прокипятить инструмент', minutes: 40, terminal: true, goto: 'c41_b_henrike',
        text: 'Кастрюля, ножницы, пинцет. Пока кипит, ты моешь руки до локтей. Зандер учила: грязь убивает чаще ран.', effects: [set41('bw', 'wash'), w41('clean_kit', true), until41(8, 20)] },
      { id: 'c41_bw_list', label: 'Записать, кто чем ранен: Зандер спросит', minutes: 40, terminal: true, goto: 'c41_b_henrike',
        text: 'Ты пишешь столбиком: имя, что, когда, чем обработано. Список получается длиннее, чем казалось. Зандер такое любит: не надо спрашивать каждого.', effects: [set41('bw', 'list'), until41(8, 20)] },
    ] }),

  X({ id: 'c41_b_henrike', title: 'Хенрике', camp: kitchen14,
    text: [
      { when: flag('w.c40_henrike_hurt'), text: 'Хенрике держит правую руку у груди. Запястье синее, распухшее. Она пытается резать хлеб левой.' },
      { when: not(flag('w.c40_henrike_hurt')), text: 'Хенрике моет пол в сенях. Грязь с сапог, кровь, вода. Моет третий раз.' },
    ],
    actions: [
      { id: 'c41_bh_splint', label: 'Посмотреть запястье и наложить лубок', when: flag('w.c40_henrike_hurt'), minutes: 40, terminal: true, goto: 'c41_b_cow',
        text: 'Перелом, похоже. Без рентгена не сказать. Ты накладываешь лубок из картона и бинта. Хенрике сжимает зубы и говорит одно: «Weiter». Дальше. Шесть недель она не будет доить.', effects: [set41('bh', 'splint'), w41('henrike_splint', true), npc('henrike', 2), until41(9, 0)] },
      { id: 'c41_bh_help', label: 'Забрать у неё ведро и домыть самой', minutes: 40, terminal: true, goto: 'c41_b_cow',
        text: 'Хенрике отдаёт ведро не сразу. Потом садится на лавку и смотрит, как ты моешь. «Danke». Спасибо. Это слово она говорит редко.', effects: [set41('bh', 'help'), npc('henrike', 1), until41(9, 0)] },
      { id: 'c41_bh_sit', label: 'Усадить её и налить чаю', minutes: 30, terminal: true, goto: 'c41_b_cow',
        text: 'Хенрике садится. Пьёт чай. Говорит, глядя в окно: «Mein Vater hat erzählt, wie es 45 war. Ich dachte, er übertreibt». Отец рассказывал, как было в сорок пятом. Я думала, он преувеличивает.', effects: [set41('bh', 'sit'), until41(8, 50)] },
      { id: 'c41_bh_lunch', label: 'Взять обед на себя, чтобы она отдохнула', minutes: 30, terminal: true, goto: 'c41_b_cow',
        text: 'Ты отбираешь у Хенрике нож и ставишь кастрюлю. Хенрике сопротивляется минуту, потом садится на лавку и засыпает сидя, с прямой спиной.', effects: [set41('bh', 'lunch'), until41(8, 50)] },
    ] }),

  X({ id: 'c41_b_cow', title: 'Хлев', camp: yard14, ambient: wet41,
    text: [
      { when: cowLost41, text: 'Корова лежит в хлеву. Хенрике стоит в дверях. Мужчины с ножами ждут её слова. Мясо можно спасти, если сейчас.' },
      { when: not(cowLost41), text: 'Корова в хлеву, живая, испуганная: не даёт подойти. Вымя тугое: её не доили со вчерашнего утра.' },
    ],
    actions: [
      { id: 'c41_bc_meat', label: 'Помочь разделать: мясо на зиму', when: cowLost41, minutes: 40, activity: 'heavy', terminal: true, goto: 'c41_b_merle',
        text: 'Час работы, о которой ты потом не будешь рассказывать. Куски в соль, в бочку, в холодный погреб. Хенрике говорит: «Berta hätte gewollt, dass wir essen». Берта хотела бы, чтобы мы ели. Корову звали Берта. Ты не {m:знал|знала}.', effects: [set41('bc', 'meat'), { place: 'c41_beef', at: 'c3_farm_stock', qty: 40 }, w41('beef', true), until41(9, 40)] },
      { id: 'c41_bc_bury', label: 'Сказать: не есть, закопать', when: cowLost41, minutes: 30, terminal: true, goto: 'c41_b_merle',
        text: 'Хенрике смотрит на тебя долго. Потом кивает. «Vielleicht hast du recht. Vielleicht nicht». Может, ты {m:прав|права}. Может, нет. Корову хоронят за сараем, рядом с костром.', effects: [set41('bc', 'bury'), until41(9, 30)] },
      { id: 'c41_bc_milk', label: 'Успокоить корову и подоить', when: not(cowLost41), minutes: 40, terminal: true, goto: 'c41_b_merle',
        text: 'Ты говоришь с ней тихо, долго, пока она не перестаёт переступать. Доишь медленно. Полное ведро. Хенрике кивает от двери.', effects: [set41('bc', 'milk'), w41('milked', true), until41(9, 40)] },
      { id: 'c41_bc_leave', label: 'Оставить Хенрике и мужчинам', minutes: 20, terminal: true, goto: 'c41_b_merle',
        text: 'Ты уходишь из хлева. Есть вещи, которые лучше делать без тебя.', effects: [set41('bc', 'leave'), until41(9, 20)] },
      { id: 'c41_bc_hay', label: 'Принести сена и чистой воды', when: not(cowLost41), minutes: 20, terminal: true, goto: 'c41_b_merle', ambientDuring: wet41,
        text: 'Охапка сена, ведро воды. Корова пьёт долго, с шумом. Ты стоишь рядом, пока она не начинает жевать.', effects: [set41('bc', 'hay'), until41(9, 20)] },
    ] }),

  X({ id: 'c41_b_merle', title: 'Мерле', camp: kitchen14,
    text: [
      { when: merle41, text: 'Мерле сидит на кровати бледная. Ночью сахар падал дважды. Она считает ручки: на неделю меньше, чем вчера казалось.' },
      { when: not(merle41), text: 'Нина сидит на ступеньке, обхватив колени. Ночью она не спала ни минуты.' },
    ],
    actions: [
      { id: 'c41_bm_plan', label: 'Пересчитать с Мерле дозы на ближайшие дни', when: merle41, minutes: 35, terminal: true, goto: 'c41_b_water',
        text: 'Меньше на ночь, больше днём, сахар у кровати. Мерле записывает. «Eine Woche weniger. Aber eine Woche». На неделю меньше. Но неделя.', effects: [set41('bm', 'plan'), w41('merle_plan', true), until41(10, 15)] },
      { id: 'c41_bm_vet', label: 'Сказать Мерле про ветклинику в Винзене', when: all(merle41, flag('w.c39_vet_known')), minutes: 35, terminal: true, goto: 'c41_b_water',
        text: 'Мерле морщится: «Hundeinsulin». Собачий инсулин. Потом серьёзно: «U-40. Andere Spritzen. Halbe Dosis… nein, doppelte. Ich muss rechnen». У-40. Другие шприцы. Половина дозы… нет, двойная. Надо считать. Она уже считает.', effects: [set41('bm', 'vet'), w41('vet_plan', true), until41(10, 15)] },
      { id: 'c41_bm_nina', label: 'Сесть рядом с Ниной', when: not(merle41), minutes: 35, terminal: true, goto: 'c41_b_water',
        text: 'Нина прижимается к тебе плечом и молчит. Потом говорит по-русски: «Я думала, вы умрёте». Ты обнимаешь её. Больше ничего не говорите.', effects: [set41('bm', 'nina'), npc('c7_nina', 2), until41(10, 15)] },
      { id: 'c41_bm_rest', label: 'Уложить её спать днём', minutes: 30, terminal: true, goto: 'c41_b_water',
        text: 'Одеяло, подушка, задёрнутая занавеска. Засыпает через минуту. Ты сидишь рядом, пока дыхание не становится ровным.', effects: [set41('bm', 'rest'), until41(10, 10)] },
      { id: 'c41_bm_tea', label: 'Принести сладкого чаю и посидеть рядом', minutes: 30, terminal: true, goto: 'c41_b_water',
        text: 'Чай с двумя ложками сахара. Ты сидишь рядом, пока кружка не пустеет. Потом ещё немного.', effects: [set41('bm', 'tea'), until41(10, 10)] },
    ] }),

  X({ id: 'c41_b_water', title: 'Вода', camp: yard14, ambient: wet41,
    text: [
      { text: 'Ведро из колодца мутное, с жёлтым отливом. Талая вода с полей уходит в землю. А на полях со вчерашнего лежит то, о чём не говорят за столом.' },
      { when: henrike41, text: 'Хенрике нюхает воду и выливает под забор: «Nicht trinken. Erst kochen». Не пить. Сначала кипятить.' },
    ],
    actions: [
      { id: 'c41_bwt_boil', label: 'Договориться: всю воду только кипячёной, ведро у плиты', minutes: 30, terminal: true, goto: 'c41_b_after',
        text: 'Ты пишешь мелом на крышке ведра: «KOCHEN». Кипятить. Большая кастрюля теперь всегда на плите. Дров уходит больше. Зато никто не сляжет с животом в доме, где и так все без сил.', effects: [set41('bwt', 'boil'), w41('boil', true), until41(10, 45)] },
      { id: 'c41_bwt_rain', label: 'Подставить бочки под водостоки: дождевая чище колодезной', minutes: 30, activity: 'moderate', terminal: true, goto: 'c41_b_after', ambientDuring: wet41,
        text: 'Две бочки из сарая — под водосток и под желоб. С крыши течёт быстро: к вечеру будет полбочки. Для стирки и мытья хватит. Пить всё равно кипятить.', effects: [set41('bwt', 'rain'), w41('rain_barrels', true), until41(10, 45)] },
      { id: 'c41_bwt_chlor', label: 'Бросить в колодец хлорки, как в учебнике', minutes: 30, terminal: true, goto: 'c41_b_after', ambientDuring: wet41,
        text: 'Полстакана хлорки из канистры Хенрике — в колодец, ведром перемешать. Два дня вода будет пахнуть бассейном. Ты не {m:уверен|уверена}, что пропорция правильная. Но лучше так, чем никак.', effects: [set41('bwt', 'chlor'), w41('well_chlor', true), until41(10, 45)] },
    ] }),

  X({ id: 'c41_b_after', title: 'День', camp: kitchen14,
    text: [
      { when: after41('farm'), text: 'Утром решили: сначала свой двор. В доме всё вверх дном: матрасы на полу, стол у двери, кровь в сенях.' },
      { when: after41('neighbors'), text: 'Утром решили: сначала соседи. У Ханзенов и в колонии нужны руки и бинты.' },
      { when: after41('council'), text: 'Утром решили: совет. Брандт просил прийти и медиков: составить список раненых по дворам.' },
    ],
    actions: [
      { id: 'c41_ba_house', label: 'Привести дом в порядок', when: after41('farm'), minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_b_cellar',
        text: 'Матрасы наверх, стол на место, сени отмыть. К полудню дом снова похож на дом. Только доски на окнах остаются: Хенрике не разрешает снимать.', effects: [set41('ba', 'house'), w41('house_tidy', true), until41(11, 30)] },
      { id: 'c41_ba_neighbors', label: 'Обойти соседей с аптечкой', when: after41('neighbors'), minutes: 40, terminal: true, goto: 'c41_b_cellar',
        text: 'Уте с порезанной рукой, Яннес с вывихнутым пальцем, соседский мальчик с рассечённой бровью. Ты перевязываешь, вправляешь, промываешь. Уте даёт тебе банку мёда. Не берёт обратно.', effects: [set41('ba', 'neighbors'), npc('c14_ute', 2), w41('b_rounds', true), until41(11, 30)] },
      { id: 'c41_ba_council', label: 'Пойти на совет со списком раненых', when: after41('council'), minutes: 40, terminal: true, goto: 'c41_b_cellar',
        text: 'Ты читаешь список вслух в пожарной части: двор, кто, что. Зандер стоит рядом и кивает. Брандт записывает. Список длинный. Никто не перебивает.', effects: [set41('ba', 'council'), w41('wound_list', true), until41(11, 30)] },
      { id: 'c41_ba_sleep', label: 'Сначала поспать час: ночь была без сна', minutes: 40, terminal: true, goto: 'c41_b_cellar',
        text: 'Ты ложишься на лавку в кухне, не раздеваясь. Час без снов. Просыпаешься оттого, что кто-то накрыл тебя курткой. Голова ясная впервые со вчерашнего дня.', effects: [set41('ba', 'sleep'), { body: 'fatigue', delta: -12 }, until41(11, 30)] },
      { id: 'c41_ba_kids', label: 'Сначала накормить детей и уложить их днём', minutes: 40, terminal: true, goto: 'c41_b_cellar',
        text: 'Каша, тёплое молоко, одеяла. Дети засыпают быстро, как будто ждали разрешения. В доме становится тихо, и взрослые начинают говорить в полный голос.', effects: [set41('ba', 'kids'), until41(11, 30)] },
    ] }),

  X({ id: 'c41_b_cellar', title: 'Погреб', camp: kitchen14,
    text: [
      { text: 'В погребе по щиколотку воды. Талая вода нашла щель в стене. Нижний ряд мешков с картошкой стоит в луже.' },
    ],
    actions: [
      { id: 'c41_bce_lift', label: 'Поднять мешки на полки и на ящики', minutes: 25, activity: 'heavy', terminal: true, goto: 'c41_b_peters',
        text: 'Мешок за мешком — на полки, на перевёрнутые ящики, на старую дверь поверх кирпичей. Спина гудит. Нижние мешки мокрые снизу: их — в суп первыми.', effects: [set41('bce', 'lift'), w41('cellar_dry', true), { body: 'fatigue', delta: 6 }, until41(11, 55)] },
      { id: 'c41_bce_bail', label: 'Вычерпать воду и забить щель мешковиной с глиной', minutes: 25, activity: 'moderate', terminal: true, goto: 'c41_b_peters',
        text: 'Ведро за ведром — наверх, во двор. Щель у пола ты затыкаешь мешковиной с глиной. Вода сочится, но медленнее. Мешки пока остаются внизу.', effects: [set41('bce', 'bail'), w41('cellar_sealed', true), until41(11, 55)] },
      { id: 'c41_bce_sort', label: 'Перебрать мокрую картошку: гнилую отдельно', minutes: 25, terminal: true, goto: 'c41_b_peters',
        text: 'Мокрые клубни — на газеты, сушить. Три с гнилью — в ведро для кур. Пальцы немеют от холода. Картошки меньше, чем казалось. Но она целая.', effects: [set41('bce', 'sort'), w41('cellar_sorted', true), until41(11, 55)] },
    ] }),

  X({ id: 'c41_b_peters', title: 'Новая в доме', camp: kitchen14,
    text: [
      { when: petersFarm, text: 'Фрау Петерс, которую ты {m:привёз|привезла} со склада, сидит в кухне в углу и чистит картошку. Быстро. Быстрее всех. Она пережила эту ночь в чужом доме и не жалуется ни словом.' },
      { when: all(not(petersFarm), evaHere), text: 'Эва чистит картошку в углу кухни. Ночью она не выпускала из рук кочергу.' },
      { when: all(not(petersFarm), not(evaHere)), text: 'В кухне в углу груда картошки. Чистить некому: все заняты.' },
    ],
    actions: [
      { id: 'c41_bp_talk', label: 'Сесть рядом и чистить вместе', minutes: 20, terminal: true, goto: 'c41_lunch',
        text: 'Нож, картошка, ведро. Разговор идёт сам: про ночь, про дом, про то, что было до ноября. Через двадцать минут картошки нет, а разговор есть.', effects: [set41('bp', 'talk'), { body: 'stress', delta: -3 }, until41(12, 15)] },
      { id: 'c41_bp_room', label: 'Устроить фрау Петерс место получше', when: petersFarm, minutes: 20, terminal: true, goto: 'c41_lunch',
        text: 'Кровать в комнате стариков, у печной стены. Фрау Петерс садится на неё, гладит одеяло ладонью и говорит: «Wie bei meiner Mutter». Как у мамы. Ей восемьдесят.', effects: [set41('bp', 'room'), w41('peters_room', true), until41(12, 15)] },
      { id: 'c41_bp_skip', label: 'Пройти мимо: дела', minutes: 15, terminal: true, goto: 'c41_lunch',
        text: 'Ты киваешь и проходишь. Картошка подождёт.', effects: [set41('bp', 'skip'), until41(12, 0)] },
      { id: 'c41_bp_soup', label: 'Поставить вариться суп на обед', minutes: 15, terminal: true, goto: 'c41_lunch',
        text: 'Кастрюля, вода, картошка, лук, кость из погреба. Через час по кухне пахнет обедом, и люди начинают заглядывать в дверь.', effects: [set41('bp', 'soup'), until41(12, 0)] },
    ] }),

  X({ id: 'c41_b_jorg', title: 'Йорг и дети', camp: yard14, ambient: wet41,
    text: [
      { when: jorg41, text: 'Йорг сидит на чурбаке у сарая. Дети рядом. Он хочет уходить, пока дорога не раскисла совсем, и боится уходить. Решить не может.' },
      { when: not(jorg41), text: 'У ворот проходят люди из Люнебурга на запад. Женщина с ребёнком на руках останавливается: у ребёнка кашель, нет ли лекарства.' },
    ],
    actions: [
      { id: 'c41_bj_stay', label: 'Сказать Йоргу: оставайтесь, детям нельзя в дорогу', when: jorg41, minutes: 40, terminal: true, goto: 'c41_b_gerdes', ambientDuring: wet41,
        text: 'Йорг смотрит на детей. Кивает. «Bis die Kleine gesund ist». Пока малышка не поправится. Он идёт колоть дрова. Это его способ сказать «спасибо».', effects: [set41('bj', 'stay'), w41('jorg_ask', 'stay'), until41(13, 40)] },
      { id: 'c41_bj_go', label: 'Собрать им лекарства в дорогу', when: jorg41, minutes: 40, terminal: true, goto: 'c41_b_gerdes', ambientDuring: wet41,
        text: 'Таблетки, бинты, бутылка с кипячёной водой. Ты объясняешь Йоргу, что давать и когда. Он повторяет, как школьник.', effects: [set41('bj', 'go'), w41('jorg_ask', 'go'), until41(13, 40)] },
      { id: 'c41_bj_child', label: 'Посмотреть ребёнка и дать сиропа', when: not(jorg41), minutes: 40, terminal: true, goto: 'c41_b_gerdes', ambientDuring: wet41,
        text: 'Кашель сухой, температуры нет. Ты даёшь сироп от кашля из аптечки и говоришь держать в тепле. Женщина уходит, оглядываясь.', effects: [set41('bj', 'child'), until41(13, 40)] },
      { id: 'c41_bj_none', label: 'Сказать, что лекарств нет', when: not(jorg41), minutes: 20, terminal: true, goto: 'c41_b_gerdes',
        text: 'Женщина кивает и идёт дальше. Ты смотришь ей вслед. Сироп у тебя есть. Одна бутылка. Своим.', effects: [set41('bj', 'none'), until41(13, 25)] },
      { id: 'c41_bj_tea', label: 'Вынести горячего чаю и постоять рядом', minutes: 20, terminal: true, goto: 'c41_b_gerdes', ambientDuring: wet41,
        text: 'Кружка в руки. Человек пьёт и смотрит на дорогу. Разговор получается сам: о погоде, о детях, о том, куда ведёт эта дорога.', effects: [set41('bj', 'tea'), until41(13, 25)] },
    ] }),

  X({ id: 'c41_b_gerdes', title: 'Ханзены', camp: yard14, ambient: wet41,
    text: [
      { when: gerdesDead41, text: 'Фрау Ханзен хочет похоронить мужа сегодня, у себя в саду, под яблоней. Ей нужны руки. И кто-то, кто постоит рядом.' },
      { when: all(not(gerdesDead41), flag('w.c40_gerdes_moved')), text: 'Старик Ханзен пережил ночь в комнате стариков. Утром он попросил отвезти его домой. Фрау Ханзен не знает, что сказать.' },
      { when: all(not(gerdesDead41), not(flag('w.c40_gerdes_moved'))), text: 'Фрау Ханзен приходит из-за поля: ночь в погребе пережили. Старик кашляет. Она просит посмотреть.' },
    ],
    actions: [
      { id: 'c41_bg_bury', label: 'Пойти на похороны', when: gerdesDead41, minutes: 40, terminal: true, goto: 'c41_b_zander', ambientDuring: wet41,
        text: 'Мокрая земля, яблоня, несколько человек. Фрау Ханзен читает молитву по памяти, сбивается, начинает снова. Ты стоишь рядом и держишь её под руку.', effects: [set41('bg', 'bury'), w41('gerdes_funeral', true), until41(14, 20)] },
      { id: 'c41_bg_stay', label: 'Уговорить оставить старика у вас до весны', when: all(not(gerdesDead41), flag('w.c40_gerdes_moved')), minutes: 40, terminal: true, goto: 'c41_b_zander',
        text: 'Фрау Ханзен соглашается быстрее, чем ты {m:ожидал|ожидала}. Ей страшно одной. Старик ворчит, но остаётся. В доме ещё на двоих больше.', effects: [set41('bg', 'stay'), w41('gerdes_stay', true), until41(14, 20)] },
      { id: 'c41_bg_home', label: 'Отвезти их домой на санях, как просит старик', when: all(not(gerdesDead41), flag('w.c40_gerdes_moved')), minutes: 40, terminal: true, goto: 'c41_b_zander', ambientDuring: wet41,
        text: 'Сани через поле, по мокрому снегу. Старик дома, в своей кровати. Он улыбается впервые за два дня. Ты оставляешь фрау Ханзен ракету: если что.', effects: [set41('bg', 'home'), until41(14, 20)] },
      { id: 'c41_bg_look', label: 'Посмотреть старика', when: all(not(gerdesDead41), not(flag('w.c40_gerdes_moved'))), minutes: 40, terminal: true, goto: 'c41_b_zander', ambientDuring: wet41,
        text: 'Кашель влажный, температура. Простуда после ночи в сыром погребе, похоже. Ты оставляешь жаропонижающее и велишь поить. Фрау Ханзен кивает на каждое слово.', effects: [set41('bg', 'look'), until41(14, 20)] },
      { id: 'c41_bg_soup', label: 'Отправить Ханзенам кастрюлю горячего супа с Яннесом', when: not(gerdesDead41), minutes: 25, terminal: true, goto: 'c41_b_zander',
        text: 'Кастрюля, обёрнутая полотенцем, крышка привязана бечёвкой. Яннес несёт её через поле осторожно, как вазу. Возвращается с пустой кастрюлей и банкой варенья от фрау Ханзен.', effects: [set41('bg', 'soup'), until41(14, 10)] },
      { id: 'c41_bg_home2', label: 'Не ходить: на похороны пойдут соседи, а тут раненые', when: gerdesDead41, minutes: 25, terminal: true, goto: 'c41_b_zander',
        text: 'Ты остаёшься с аптечкой. Из окна видно, как по полю к яблоне идут несколько тёмных фигур. Ты смотришь, пока они не останавливаются. Потом снова берёшь бинт.', effects: [set41('bg', 'home2'), until41(14, 10)] },
      { id: 'c41_bg_note', label: 'Написать Брандту записку: Ханзенам нужна помощь', minutes: 25, terminal: true, goto: 'c41_b_zander',
        text: 'Три строчки для Брандта: кто, где, что нужно. Лукас заберёт вечером. Хоть кто-то в округе будет знать.', effects: [set41('bg', 'note'), until41(14, 10)] },
    ] }),

  X({ id: 'c41_b_zander', title: 'Доктор', camp: yard14, ambient: wet41,
    text: [
      { text: 'В начале третьего у ворот трактор Лукаса. Доктор Зандер объезжает дворы после ночи. Сапоги в грязи по колено, сумка тяжёлая.' },
      { when: flag('w.c39_b_point'), text: 'Она узнаёт тебя по пункту: «{m:Ah. Mein Helfer|Ah. Meine Helferin}». {m:А, мой помощник|А, моя помощница}.' },
      { when: flag('w.c41_henrike_splint'), text: 'Она смотрит лубок на руке Хенрике, трогает пальцы и кивает: «Ordentlich». Аккуратно.' },
    ],
    actions: [
      { id: 'c41_bz_kit', label: 'Попросить бинтов и йода: свои кончаются', minutes: 30, terminal: true, goto: 'c41_b_kids', ambientDuring: wet41,
        text: 'Зандер отсыпает тебе из сумки: два бинта, пузырёк йода, пачку пластыря. «Mehr habe ich nicht. Ehrlich». Больше нет. Честно.', effects: [set41('bz', 'kit'), { give: 'bandages' }, until41(14, 50)] },
      { id: 'c41_bz_merle', label: 'Рассказать ей про инсулин Мерле', when: merle41, minutes: 30, terminal: true, goto: 'c41_b_kids', ambientDuring: wet41,
        text: '«Insulin…» Зандер трёт глаза. «In Winsen, in der Tierklinik, vielleicht. Ich sage nicht, dass es gut ist. Ich sage, es ist besser als nichts». В Винзене, в ветклинике, может быть. Я не говорю, что это хорошо. Говорю, что лучше, чем ничего.', effects: [set41('bz', 'merle'), w41('zander_merle', true), until41(14, 50)] },
      { id: 'c41_bz_round', label: 'Предложить объехать с ней ещё два двора', minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_b_kids', ambientDuring: wet41,
        text: 'Два двора за ручьём. Ты держишь, она шьёт. Ты промываешь, она смотрит. На обратном пути она говорит: «Wenn das vorbei ist, sollten Sie Medizin studieren». Когда это кончится, вам надо учиться на врача. Ты не знаешь, шутит ли она.', effects: [set41('bz', 'round'), w41('zander_round', true), { body: 'fatigue', delta: 5 }, until41(15, 0)] },
      { id: 'c41_bz_tea', label: 'Напоить её чаем: она еле стоит', minutes: 25, terminal: true, goto: 'c41_b_kids',
        text: 'Зандер пьёт чай стоя, в дверях, не снимая сапог. Три глотка, потом ещё три. «Danke. Ich habe seit gestern früh nicht gesessen». Спасибо. Я не сидела со вчерашнего утра. И не садится.', effects: [set41('bz', 'tea'), until41(14, 45)] },
    ] }),

  X({ id: 'c41_b_kids', title: 'Дети', camp: kitchen14,
    text: [
      { when: ninaFarm, text: 'Нина собрала младших в кладовке и читает им вслух сказку, громко, чтобы не слышать, как во дворе стучат молотками.' },
      { when: all(not(ninaFarm), jorg41), text: 'Дети Йорга сидят на лавке тихо. Слишком тихо для детей.' },
      { when: all(not(ninaFarm), not(jorg41)), text: 'Соседские дети, которых Уте прислала посидеть в тепле, сидят на лавке тихо. Слишком тихо для детей.' },
    ],
    actions: [
      { id: 'c41_bk_join', label: 'Сесть с ними и рассказать что-нибудь своё', minutes: 30, terminal: true, goto: 'c41_brandt',
        text: 'Ты рассказываешь про кота Мерле, который однажды съел шнурок. Дети смеются. Потом смеются громче. Потом просят ещё.', effects: [set41('bk', 'join'), { body: 'stress', delta: -4 }, until41(15, 30)] },
      { id: 'c41_bk_work', label: 'Дать им дело: перебрать фасоль, посчитать свечи', minutes: 30, terminal: true, goto: 'c41_brandt',
        text: 'Фасоль — в одну миску, камешки — в другую. Свечи — по десять в связку. Дети работают серьёзно, как взрослые. Когда руки заняты, голова свободна.', effects: [set41('bk', 'work'), until41(15, 30)] },
      { id: 'c41_bk_out', label: 'Вывести их во двор, на свет', minutes: 30, terminal: true, goto: 'c41_brandt', ambientDuring: wet41,
        text: 'Во дворе мокро, но светло. Дети стоят у крыльца и смотрят на поле. Нина говорит младшим: «Seht ihr? Alles vorbei». Видите? Всё кончилось.', effects: [set41('bk', 'out'), until41(15, 30)] },
    ] }),

  X({ id: 'c41_b_dusk', title: 'Сумерки', camp: kitchen14,
    text: [
      { text: 'Сумерки. Хенрике ставит на подоконник свечу. Не для света. Так делают, говорит она, для тех, кто не дошёл.' },
    ],
    actions: [
      { id: 'c41_bd_candle', label: 'Поставить рядом вторую', minutes: 30, terminal: true, goto: 'c41_b_wash',
        text: 'Две свечи на подоконнике. Хенрике смотрит на них и кивает. Нина приносит третью.', effects: [set41('bd', 'candle'), npc('henrike', 1), until41(16, 45)] },
      { id: 'c41_bd_list', label: 'Записать в тетрадь всех, кого не стало', minutes: 30, terminal: true, goto: 'c41_b_wash',
        text: 'Ты пишешь столбиком. Имена тех, кого {m:знал|знала}. Остальных — как помнишь: «мужчина в синей куртке», «старик с палкой». Кто-то должен помнить.', effects: [set41('bd', 'list'), w41('b_diary', true), until41(16, 45)] },
      { id: 'c41_bd_sit', label: 'Посидеть с Хенрике у окна', minutes: 25, terminal: true, goto: 'c41_b_wash',
        text: 'Вы сидите рядом. Хенрике держит твою руку в своей. Вы смотрите, как темнеет поле.', effects: [set41('bd', 'sit'), { body: 'stress', delta: -4 }, until41(16, 40)] },
    ] }),

  X({ id: 'c41_b_wash', title: 'Стирка', camp: kitchen14,
    text: [
      { text: 'В углу кухни гора одежды: в крови, в грязи, мокрая.' },
      { when: flag('w.c40_henrike_hurt'), text: 'Хенрике одной рукой не справится.' },
    ],
    actions: [
      { id: 'c41_bwa_wash', label: 'Затеять стирку в холодной воде, как учила Хенрике', minutes: 25, activity: 'moderate', terminal: true, goto: 'c41_b_partner',
        text: 'Холодная вода, хозяйственное мыло, кровь отходит. Горячей нельзя: заварит. Руки красные до локтей. Полкорыта отстирано, остальное — завтра. Верёвки на чердаке у трубы прогибаются.', effects: [set41('bwa', 'wash'), w41('laundry', true), { body: 'fatigue', delta: 6 }, until41(17, 10)] },
      { id: 'c41_bwa_burn', label: 'Самое изорванное — в печку', minutes: 20, terminal: true, goto: 'c41_b_partner',
        text: 'Рваная куртка, штаны без колена. В печь. Остальное — в корыто на завтра.', effects: [set41('bwa', 'burn'), until41(17, 5)] },
      { id: 'c41_bwa_later', label: 'Оставить на завтра', minutes: 15, terminal: true, goto: 'c41_b_partner',
        text: 'Гора подождёт. Ты садишься у печи и впервые за день просто сидишь.', effects: [set41('bwa', 'later'), { body: 'fatigue', delta: -3 }, until41(17, 0)] },
    ] }),

  X({ id: 'c41_b_partner', title: 'Минута', camp: yard14, ambient: wet41,
    text: [
      { text: '{partner} во дворе, у поленницы. Руки в грязи, куртка мокрая насквозь. Вы с утра не виделись дольше минуты.' },
    ],
    actions: [
      { id: 'c41_bpt_tea', label: 'Вынести {partner.dat} горячего чаю', minutes: 20, terminal: true, goto: 'c41_b_roster', ambientDuring: wet41,
        text: 'Кружка в обеих руках, пар в лицо. {partner} пьёт и смотрит на тебя поверх кружки. «Живы», — говорит {pm:он|она}. Это не вопрос.', effects: [set41('bpt', 'tea'), { body: 'stress', delta: -3 }, until41(17, 25)] },
      { id: 'c41_bpt_hands', label: 'Посмотреть {partner.gen} руки', minutes: 20, terminal: true, goto: 'c41_b_roster', ambientDuring: wet41,
        text: 'Ладони в ссадинах, мозоль лопнула. Ты промываешь их из ковша прямо во дворе и заклеиваешь пластырем. {partner} терпит и не отнимает рук.', effects: [set41('bpt', 'hands'), until41(17, 25)] },
      { id: 'c41_bpt_stand', label: 'Просто постоять рядом', minutes: 20, terminal: true, goto: 'c41_b_roster', ambientDuring: wet41,
        text: 'Вы стоите плечом к плечу и смотрите на поле. Темнеет. Никто из вас ничего не говорит. Так тоже можно.', effects: [set41('bpt', 'stand'), { body: 'stress', delta: -4 }, until41(17, 25)] },
    ] }),

  X({ id: 'c41_b_roster', title: 'Кто не спит', camp: kitchen14,
    text: [
      { text: 'Брандт просил: каждую ночь у каждого двора кто-то не спит. Хенрике кладёт на стол лист и карандаш: «Mach du das». Сделай ты.' },
    ],
    actions: [
      { id: 'c41_bro_pairs', label: 'По двое, по три часа, все взрослые', minutes: 20, terminal: true, goto: 'c41_evening',
        text: 'Ты расписываешь: по двое, по три часа, с восьми вечера до семи утра. Себя ставишь с двух до пяти, на самые тёмные часы. Никто не спорит.', effects: [set41('bro', 'pairs'), w41('roster', 'pairs'), until41(17, 50)] },
      { id: 'c41_bro_men', label: 'Только те, кто покрепче', minutes: 20, terminal: true, goto: 'c41_evening',
        text: 'Ты пишешь имена тех, кто может держать вилы. Список короткий. Хенрике смотрит на него, молчит, потом дописывает внизу себя.', effects: [set41('bro', 'men'), w41('roster', 'strong'), until41(17, 50)] },
      { id: 'c41_bro_bell', label: 'Сегодня никто: все без сил, разбудит колокол', minutes: 15, terminal: true, goto: 'c41_evening',
        text: 'Ты пишешь: «Heute — Glocke». Сегодня — колокол. Хенрике хмурится, но кивает. Все еле стоят. Одна ночь.', effects: [set41('bro', 'bell'), w41('roster', 'bell'), until41(17, 45)] },
    ] }),

  // ═════════════ Спасение ═════════════
  X({ id: 'c41_r_bed', title: 'У постели', camp: tense14, safe: false, onEnter: [set41('rescuer', true)],
    text: [
      { text: '{partner} лежит на кровати Хенрике. Повязка на голове тёмная. Лицо белое. Одежда мокрая: ночью её не успели снять.' },
      { when: all(henrike41, flag('w.c40_henrike_hurt')), text: 'Хенрике режет ножницами мокрый рукав, левой рукой, неловко.' },
      { when: all(henrike41, not(flag('w.c40_henrike_hurt'))), text: 'Хенрике режет ножницами мокрый рукав.' },
      { when: evaHere, text: 'Эва несёт из кладовки шнапс: «Einen Schluck, das wärmt». Глоток, это греет.' },
    ],
    actions: [
      { id: 'c41_rb_slow', label: 'Снять мокрое, сухое бельё, одеяла, тёплые бутылки под мышки', minutes: 40, terminal: true, goto: 'c41_r_doc',
        text: 'Ты режешь мокрое, не жалея. Сухое бельё, два одеяла, перина. Бутылки с тёплой водой в полотенцах — под мышки и к груди. Через полчаса дыхание ровнее.', effects: [set41('rb', 'slow'), treat('basic'), blood(-3), until41(8, 30)] },
      { id: 'c41_rb_stove', label: 'Придвинуть кровать к печи и растирать руки и ноги', minutes: 40, activity: 'moderate', terminal: true, goto: 'c41_r_doc',
        text: 'Кровать вплотную к печи. Ты растираешь ступни и ладони до красноты. Кожа горячеет под руками. Кажется, помогает.', effects: [set41('rb', 'stove'), blood(-1), until41(8, 30)] },
      { id: 'c41_rb_wound', label: 'Сначала перевязать голову заново', minutes: 40, terminal: true, goto: 'c41_r_doc',
        text: 'Старую повязку — долой, рану промыть кипячёной водой, чистую — туго. Кровь проступает и останавливается. Потом сухое и одеяла.', effects: [set41('rb', 'wound'), treat('proper'), blood(-3), until41(8, 30)] },
    ] }),

  X({ id: 'c41_r_doc', title: 'Доктор', camp: tense14, safe: false,
    text: [
      { text: 'В девять у ворот трактор Лукаса: он привёз доктора Зандер. Она объезжает дворы после ночи, одна на весь округ.' },
      { when: own41('rb', 'stove'), text: '— Weg vom Ofen! — Она сама оттаскивает кровать. Отойдите от печи! — Langsam wärmen. Nie schnell.\n\nГреть медленно. Никогда быстро.' },
      { when: own41('rb', 'slow'), text: '— Gut. Genau so, — говорит она, трогая бутылку под мышкой. Хорошо. Именно так.' },
      { text: 'Она разматывает повязку. Рана над ухом длинная, края разошлись.' },
    ],
    actions: [
      { id: 'c41_rd_lamp', label: 'Держать лампу, пока она шьёт', minutes: 60, terminal: true, goto: 'c41_r_others',
        text: 'Ты держишь лампу. Зандер шьёт быстро, мелко. Восемь швов. Потом капельница на гвозде над кроватью. «Bis Mittag. Dann sehen wir». До полудня. Потом посмотрим.', effects: [set41('rd', 'lamp'), treat('proper'), drip, until41(10, 0)] },
      { id: 'c41_rd_ask', label: 'Спросить, что делать дальше', minutes: 60, terminal: true, goto: 'c41_r_others',
        text: '— Warm, nicht heiß. Trinken, wenn schluckt. Zucker. Wenn Fieber — holen Sie mich. Lukas weiß, wo ich bin.\n\nТепло, не жарко. Поить, когда глотает. Сахар. Если жар — зовите. Лукас знает, где я.', effects: [set41('rd', 'ask'), treat('proper'), drip, until41(10, 0)] },
      { id: 'c41_rd_out', label: 'Выйти: смотреть не можешь', minutes: 60, terminal: true, goto: 'c41_r_others', ambientDuring: wet41,
        text: 'Ты стоишь на крыльце под капелью. Лукас стоит рядом и молчит. Потом говорит: «Sie hat heute Nacht drei zusammengeflickt. Alle leben». Она этой ночью троих зашила. Все живы.', effects: [set41('rd', 'out'), treat('proper'), drip, until41(10, 0)] },
    ] }),

  X({ id: 'c41_r_others', title: 'Остальные', camp: kitchen14,
    text: [
      { text: 'Зандер моет руки над тазом и оглядывает кухню: кто ещё. Ей пора ехать дальше, но в доме есть другие раненые.' },
      { when: flag('w.c40_henrike_hurt'), text: 'Хенрике прячет правую руку за спину.' },
      { when: v('w.c40_strangers_kid', 'hurt'), text: 'Младшая дочь Йорга держит руку на весу.' },
    ],
    actions: [
      { id: 'c41_ro_henrike', label: 'Показать ей руку Хенрике', when: flag('w.c40_henrike_hurt'), minutes: 30, terminal: true, goto: 'c41_r_house',
        text: 'Зандер щупает запястье, Хенрике шипит сквозь зубы. «Gebrochen. Sechs Wochen». Сломано. Шесть недель. Лубок из картона и бинта. Хенрике смотрит на свою руку так, будто та её предала.', effects: [set41('ro', 'henrike'), w41('henrike_splint', true), until41(10, 30)] },
      { id: 'c41_ro_kid', label: 'Подвести к ней девочку Йорга', when: v('w.c40_strangers_kid', 'hurt'), minutes: 30, terminal: true, goto: 'c41_r_house',
        text: 'Зандер ощупывает руку девочки быстро и мягко. «Angebrochen. Schiene, Ruhe». Трещина. Шина, покой. Девочка не плачет. Йорг отворачивается к окну.', effects: [set41('ro', 'kid'), w41('kid_splint', true), until41(10, 30)] },
      { id: 'c41_ro_walk', label: 'Проводить её до трактора и спросить, как в округе', minutes: 30, terminal: true, goto: 'c41_r_house', ambientDuring: wet41,
        text: 'У трактора она закуривает, первый раз при тебе. «Zwölf Verletzte heute Nacht. Zwei schaffen es nicht. {pm:Er|Sie} schon». Двенадцать раненых за ночь. Двое не выживут. {pm:Он|Она} — выживет. Лукас трогает с места.', effects: [set41('ro', 'walk'), until41(10, 30)] },
      { id: 'c41_ro_back', label: 'Поблагодарить и вернуться к постели', minutes: 30, terminal: true, goto: 'c41_r_house',
        text: '«Danke». Зандер кивает, не оборачиваясь. Ты возвращаешься в комнату. Капельница капает.', effects: [set41('ro', 'back'), blood(-2), until41(10, 30)] },
      { id: 'c41_ro_fever', label: 'Спросить, что делать, если ночью поднимется жар', minutes: 30, terminal: true, goto: 'c41_r_house',
        text: '— Kalte Tücher. Trinken. Und wenn das Fieber über neununddreißig geht, holt Lukas mich.\n\nХолодные полотенца. Пить. Если выше тридцати девяти — Лукас привезёт меня.', effects: [set41('ro', 'fever'), until41(10, 30)] },
    ] }),

  X({ id: 'c41_r_house', title: 'Дом', camp: kitchen14,
    text: [
      { text: 'Дом не ждёт: кто-то с порезом, кто-то с вопросом, у кого-то кончились бинты. Все идут к тебе, потому что ты ближе всех.' },
    ],
    actions: [
      { id: 'c41_rh_help', label: 'Помочь всем, кому можно, быстро', minutes: 30, terminal: true, goto: 'c41_r_noon',
        text: 'Бинт, совет, чай. Ты успеваешь почти всё и каждые десять минут заглядываешь в комнату. {partner} дышит.', effects: [set41('rh', 'help'), blood(-2), until41(11, 0)] },
      { id: 'c41_rh_send', label: 'Попросить Хенрике держать дом, а {m:самому|самой} не отходить', minutes: 30, terminal: true, goto: 'c41_r_noon',
        text: 'Хенрике кивает и берёт дом на себя. Ты сидишь у кровати. Капельница капает. Ты считаешь капли.', effects: [set41('rh', 'send'), blood(-3), until41(11, 0)] },
      { id: 'c41_rh_list', label: 'Раздать всем дела по списку и вернуться к постели', minutes: 30, terminal: true, goto: 'c41_r_noon',
        text: 'Вода, дрова, хлев, кухня — по имени против каждого. Список на двери. Никто не спорит. Ты возвращаешься в комнату, и тишина там уже другая.', effects: [set41('rh', 'list'), blood(-3), until41(11, 0)] },
    ] }),

  X({ id: 'c41_r_noon', title: 'Полдень', camp: house14, onEnter: [until41(11, 0)],
    text: [
      { when: partnerUp41, text: 'Около полудня {partner} открывает глаза. Мутные, но {pm:он|она} тебя узнаёт. «Холодно», — говорит {pm:он|она}. По-русски.' },
      { when: partnerDown41, text: 'Полдень. {partner} не открывает глаз. Но губы уже розовые, и пальцы тёплые.' },
    ],
    actions: [
      { id: 'c41_rn_tea', label: 'Поить сладким чаем с ложки', minutes: 60, terminal: true, goto: 'c41_lunch',
        text: 'Сахар, тёплая вода, ложка. Глотает с трудом. Ты считаешь ложки. На двадцатой отворачивается: хватит.', effects: [set41('rn', 'tea'), drink(-25), blood(-2), until41(12, 15)] },
      { id: 'c41_rn_sit', label: 'Сидеть рядом и держать за руку', minutes: 60, terminal: true, goto: 'c41_lunch',
        text: 'Ты сидишь. За окном капает. Ты засыпаешь сидя и просыпаешься от того, что пальцы в твоей руке шевельнулись.', effects: [set41('rn', 'sit'), blood(-2), until41(12, 15)] },
      { id: 'c41_rn_read', label: 'Читать вслух, что попадётся', minutes: 60, terminal: true, goto: 'c41_lunch',
        text: 'Книжка с полки Хенрике: про пчёл, с картинками. Ты читаешь вполголоса, по-немецки, спотыкаясь. Неважно что. Важно, чтобы рядом звучал голос.', effects: [set41('rn', 'read'), blood(-2), until41(12, 15)] },
    ] }),

  X({ id: 'c41_r_visit', title: 'Гости', camp: kitchen14,
    text: [
      { text: 'После обеда приходят: Уте с мёдом, Яннес молча, Лукас с вопросом от Брандта. Все хотят посмотреть и не мешать.' },
      { when: merle41, text: 'Мерле садится у кровати и рисует в блокноте. Потом показывает: двое, один лежит, второй спит сидя на стуле.' },
    ],
    actions: [
      { id: 'c41_rv_talk', label: 'Выйти к гостям на пять минут', minutes: 45, terminal: true, goto: 'c41_r_jacket',
        text: 'Новости, кто как, кто где. Тебе нужно было постоять с живыми людьми, которые не лежат.', effects: [set41('rv', 'talk'), { body: 'stress', delta: -3 }, until41(13, 45)] },
      { id: 'c41_rv_eat', label: 'Поесть, пока кто-то посидит рядом', minutes: 30, terminal: true, goto: 'c41_r_jacket', ...tableOnly,
        text: 'Хенрике ставит миску и стоит рядом, пока ты не съешь всё. Ты не помнишь, когда ел{m:|а} последний раз.', effects: [set41('rv', 'eat'), meal('eat'), until41(13, 35)] },
      { id: 'c41_rv_back', label: 'Вернуться к постели', minutes: 45, terminal: true, goto: 'c41_r_jacket',
        text: 'Ты киваешь всем сразу и уходишь в комнату. {partner} спит. Ты садишься рядом.', effects: [set41('rv', 'back'), blood(-2), until41(13, 45)] },
      { id: 'c41_rv_ute', label: 'Попросить Уте посидеть у постели и выйти на воздух', minutes: 45, terminal: true, goto: 'c41_r_jacket',
        text: 'Уте садится у кровати с вязанием. Ты выходишь на крыльцо и стоишь там десять минут, ни о чём не думая. Потом возвращаешься.', effects: [set41('rv', 'ute'), until41(13, 45)] },
    ] }),

  X({ id: 'c41_r_jacket', title: 'Куртка', camp: kitchen14,
    text: [
      { text: 'Куртка {partner.gen}, в которой {pm:его|её} принесли ночью, висит на спинке стула. Рукав разрезан, спина в бурой корке. В кармане что-то тяжёлое.' },
    ],
    actions: [
      { id: 'c41_rj_sew', label: 'Зашить рукав', minutes: 30, terminal: true, goto: 'c41_r_dressing',
        text: 'Иголка, чёрные нитки из коробки Хенрике. Стежки кривые, но держат. Это первая вещь за день, которую можно починить до конца.', effects: [set41('rj', 'sew'), { body: 'stress', delta: -2 }, until41(14, 15)] },
      { id: 'c41_rj_wash', label: 'Отстирать кровь в холодной воде', minutes: 30, terminal: true, goto: 'c41_r_dressing',
        text: 'Холодная вода, мыло, щётка. Вода в тазу розовеет, потом светлеет. Ты вешаешь куртку у печи, но не вплотную. Как Зандер говорила про людей.', effects: [set41('rj', 'wash'), until41(14, 15)] },
      { id: 'c41_rj_pocket', label: 'Посмотреть, что в кармане', minutes: 30, terminal: true, goto: 'c41_r_dressing',
        text: 'Фонарик, нож, огрызок карандаша, мятый листок со списком дел на понедельник. Обычные вещи. Ты кладёшь их на тумбочку у кровати, чтобы {partner} увидел{pm:|а} их первыми, когда откроет глаза.', effects: [set41('rj', 'pocket'), until41(14, 15)] },
    ] }),

  X({ id: 'c41_r_dressing', title: 'Перевязка', camp: house14,
    text: [
      { text: 'Повязка промокла. Зандер оставила бинты и сказала: менять, когда промокнет.' },
    ],
    actions: [
      { id: 'c41_rdr_clean', label: 'Сменить повязку, промыть вокруг швов', minutes: 45, terminal: true, goto: 'c41_brandt',
        text: 'Кипячёная вода, чистый бинт. Швы держат, краснота небольшая. Ты завязываешь узел и замечаешь, что руки у тебя больше не дрожат.', effects: [set41('rdr', 'clean'), treat('basic'), blood(-3), until41(15, 30)] },
      { id: 'c41_rdr_wait', label: 'Не трогать: пусть подсохнет', minutes: 30, terminal: true, goto: 'c41_brandt',
        text: 'Ты не трогаешь. Зандер сказала: менять, когда промокнет. Промокла не совсем.', effects: [set41('rdr', 'wait'), until41(15, 30)] },
      { id: 'c41_rdr_henrike', label: 'Позвать Хенрике посмотреть: вдвоём спокойнее', when: henrike41, minutes: 30, terminal: true, goto: 'c41_brandt',
        text: 'Хенрике смотрит на повязку, на лицо, на руки. Кивает: «Sauber. Nicht anfassen». Чисто. Не трогать. И кладёт тебе руку на плечо.', effects: [set41('rdr', 'henrike'), until41(15, 30)] },
    ] }),

  X({ id: 'c41_r_dusk', title: 'Сумерки', camp: kitchen14,
    text: [
      { when: partnerUp41, text: 'К сумеркам {partner} садится в кровати сам{pm:|а}. Голова кружится. Просит есть.' },
      { when: partnerDown41, text: 'К сумеркам {partner} всё ещё спит. Дышит ровно. Лоб тёплый, не горячий.' },
    ],
    actions: [
      { id: 'c41_rk_soup', label: 'Принести бульону', minutes: 40, terminal: true, goto: 'c41_r_window',
        text: 'Бульон из курицы, которую Хенрике берегла. Ты кормишь с ложки, хотя {partner} говорит, что может сам{pm:|а}. Не может.', effects: [set41('rk', 'soup'), drink(-20), blood(-3), until41(16, 55)] },
      { id: 'c41_rk_wash', label: 'Умыть и переодеть в сухое', minutes: 40, terminal: true, goto: 'c41_r_window',
        text: 'Тёплая вода, полотенце. Ты смываешь засохшую кровь вокруг повязки, по сантиметру. Под кровью — знакомое лицо.', effects: [set41('rk', 'wash'), treat('basic'), blood(-2), until41(16, 55)] },
      { id: 'c41_rk_sit', label: 'Посидеть рядом, пока совсем не стемнеет', minutes: 40, terminal: true, goto: 'c41_r_window',
        text: 'Окно серое, потом синее, потом чёрное. Ты не зажигаешь лампу. Дыхание рядом ровное, и ты подстраиваешь под него своё.', effects: [set41('rk', 'sit'), blood(-2), until41(16, 55)] },
    ] }),

  X({ id: 'c41_r_window', title: 'Свеча', camp: kitchen14,
    text: [
      { text: 'Хенрике ставит на подоконник свечу. Не для света. Так делают, говорит она, для тех, кто не дошёл.' },
    ],
    actions: [
      { id: 'c41_rwi_second', label: 'Поставить рядом вторую', minutes: 20, terminal: true, goto: 'c41_r_wake',
        text: 'Две свечи на подоконнике. Хенрике смотрит на тебя и кивает. О третьей, которую чуть не пришлось ставить, никто не говорит.', effects: [set41('rwi', 'second'), npc('henrike', 1), until41(17, 15)] },
      { id: 'c41_rwi_back', label: 'Вернуться к постели', minutes: 20, terminal: true, goto: 'c41_r_wake',
        text: 'Ты уходишь в комнату. Огонёк свечи виден в щель двери.', effects: [set41('rwi', 'back'), blood(-2), until41(17, 15)] },
      { id: 'c41_rwi_sit', label: 'Постоять у окна с Хенрике', minutes: 20, terminal: true, goto: 'c41_r_wake',
        text: 'Поле темнеет. В колонии загорается одно окно, потом второе. Живые.', effects: [set41('rwi', 'sit'), { body: 'stress', delta: -3 }, until41(17, 15)] },
    ] }),

  X({ id: 'c41_r_wake', title: 'Разговор', camp: house14,
    text: [
      { when: partnerUp41, text: '{partner} смотрит на тебя долго. Потом спрашивает, что было ночью. И кто ещё.' },
      { when: partnerDown41, text: '{partner} шевелится во сне и что-то говорит. Твоё имя. Или нет.' },
    ],
    actions: [
      { id: 'c41_rw_tell', label: 'Рассказать всё', minutes: 45, terminal: true, goto: 'c41_evening',
        text: 'Ты рассказываешь тихо: двор, кто нёс, кто держал лампу, доктор. Слушают с закрытыми глазами. На середине ты замечаешь, что тебя держат за руку.', effects: [set41('rw', 'tell'), blood(-2), until41(18, 0)] },
      { id: 'c41_rw_later', label: 'Сказать: потом, сейчас спи', minutes: 30, terminal: true, goto: 'c41_evening',
        text: 'Ты поправляешь одеяло. «Потом». Глаза закрываются. Ты сидишь рядом, пока не зовут ужинать.', effects: [set41('rw', 'later'), blood(-2), until41(18, 0)] },
      { id: 'c41_rw_hand', label: 'Ничего не говорить, просто взять за руку', minutes: 30, terminal: true, goto: 'c41_evening',
        text: 'Ты берёшь руку. Пальцы сжимаются в ответ, слабо, но сжимаются. Вопросы подождут.', effects: [set41('rw', 'hand'), blood(-2), until41(18, 0)] },
    ] }),
];

