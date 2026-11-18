import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { brothersCome, eldersCome, oleHome33 } from './point33';
import { S34, frost34, set34, until34, w34 } from './point34';

// Участок 34, переделка (REWORK_PLAN.md, этап 3): правило зимы КТ33 (`w.c33_rule`) в деле. B в субботу — половник,
// холодная труба соседей или лист работ; A в воскресенье — ключ от кладовки, обмен с Кёлер или бригада на дровах.
// Решения (`w.c34_rule_b`, `w.c34_rule_a`) отзываются в 35–37 и в итоге КТ.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S34({ ...scene, for: 'any', chapter: 'ch3' });
const rule = (x: string): Cond => v('w.c33_rule', x);
const uteColony: Cond = all(v('w.c18_ute', 'colony'), { npc: 'c14_ute', alive: true });
const toSkates = [{ id: 's', goto: 'c34_b_skates' }];
const toYard = [{ id: 'y', goto: 'c34_a_yard' }];
/** Входы: B после «После обеда» в субботу, A после «Весны» в воскресенье. */
export const toRuleB34 = [{ id: 'r', when: flag('w.c33_rule'), goto: 'c34_rb' }, { id: 's', goto: 'c34_b_skates' }];
export const toRuleA34 = [{ id: 'r', when: flag('w.c33_rule'), goto: 'c34_ra' }, { id: 'y', goto: 'c34_a_yard' }];
const paulKnown: Cond = any(v('w.c33_paul', 'let'), v('w.c33_paul', 'talk'), v('w.c33_paul', 'caught'));

export const day34WScenes: Scene[] = [
  X({ id: 'c34_rb', title: 'Правило', camp: kitchen14,
    text: [
      // Котёл
      { when: rule('pot'), text: 'К четырём Хенрике снимает с гвоздя половник и протягивает тебе.\n\n— Heute teilst du aus. Ich will sehen, wie du zählst.\n\nСегодня раздаёшь ты. Хочу посмотреть, как ты считаешь.' },
      { when: rule('pot'), text: 'Котёл: картофельная похлёбка, в ней на всех два кольца колбасы, нарезанные тонко, как монеты. К плите выстраивается очередь с мисками.' },
      { when: all(rule('pot'), eldersCome), text: 'Старик Петерсен, опираясь на палку, просит второй половник: «Für meine Frau, sie liegt». Для жены, она лежит. Час назад ты {m:видел|видела} его жену на крыльце колонии. Она не лежала.' },
      { when: all(rule('pot'), brothersCome), text: 'Дениз и Керем после дров съели бы вдвое. Они встали последними и молчат, и это хуже, чем если бы просили.' },
      { when: all(rule('pot'), not(eldersCome), not(brothersCome)), text: 'Нина держит две миски. Вторая не для неё: она всё время косится на дверь, за которой кто-то ждёт на морозе.' },
      // По дворам
      { when: rule('yards'), text: 'С тех пор как каждый двор ест своё, на кухне у Хенрике готовят на шестерых, а не на пятнадцать. Тише. И как-то стыдно.' },
      { when: all(rule('yards'), eldersCome), text: 'Над домиком Петерсенов в колонии с утра нет дыма. Ты идёшь туда с пустым ведром, будто за водой. Фрау Петерсен сидит в пальто у холодной печки, перед ней кружка кипятка и два сухаря на блюдце.\n\n— Wir kommen zurecht, — говорит она. — Wirklich.\n\nМы справляемся. Правда.' },
      { when: all(rule('yards'), not(eldersCome), uteColony), text: 'Над домиком Уте у насыпи с утра нет дыма. Ты идёшь туда будто за водой. Уте вяжет в пальто у холодной печки. Яннес спит под двумя одеялами, днём.\n\n— Holz ist alle. Morgen holt Jannes neues. Wir kommen zurecht.\n\nДрова кончились. Завтра Яннес принесёт. Мы справляемся.' },
      { when: all(rule('yards'), not(eldersCome), not(uteColony)), text: 'Над флигелем, где ночуют те, кто не в доме, с утра нет дыма. Ты заходишь: печка холодная, на столе пустая кастрюля, вымытая до блеска. Никто не просил. Никто и не попросит.' },
      // Отработка
      { when: rule('work'), text: 'На двери кухни лист Хенрике: кто сегодня на чём. Почерк крупный, без ошибок, как в школьной ведомости.' },
      { when: all(rule('work'), eldersCome), text: 'Петерсен записан на воду. С палкой. В окно видно, как он ставит вёдра на лёд у колонки и не может нагнуться за третьим. Стоит и смотрит на него.' },
      { when: all(rule('work'), not(eldersCome), brothersCome), text: 'Керем записан на ночной обход третью ночь подряд: он пришёл последним. Сейчас он спит сидя, у печки, с открытым ртом.' },
      { when: all(rule('work'), not(eldersCome), not(brothersCome)), text: 'Нина записана на воду и на кур: из тех, кто остался, на хутор она пришла последней. У неё обветренные руки, и она прячет их в рукава.' },
    ],
    actions: [
      { id: 'c34_rb_equal', label: 'Ровно по половнику каждому, без исключений', when: rule('pot'), minutes: 40, terminal: true, outcomes: toSkates,
        text: 'Половник, миска, следующий. Половник, миска, следующий. Колбасу ты делишь так, что каждому выходит по два кружка. Петерсен, если он здесь, уходит с одной миской и не благодарит. Хенрике смотрит до конца и говорит: «Gerecht. Und kalt». Справедливо. И холодно.',
        effects: [set34('rb', 'equal'), w34('rule_b', 'equal'), until34(35, 16, 20)] },
      { id: 'c34_rb_need', label: 'Сначала детям и старикам, остальным что останется', when: rule('pot'), minutes: 40, terminal: true, outcomes: toSkates,
        text: 'Ты наливаешь детям доверху, старикам с колбасой, остальным по краю. На дне остаётся на полтора половника: тебе и {partner.dat}. Дениз, если он здесь, ухмыляется и говорит: «Sozialismus». Но ест молча и миску вылизывает хлебом.',
        effects: [set34('rb', 'need'), w34('rule_b', 'need'), { body: 'hunger', delta: 8 }, until34(35, 16, 20)] },
      { id: 'c34_rb_henrike', label: 'Вернуть половник Хенрике: её дом, её счёт', when: rule('pot'), minutes: 30, terminal: true, outcomes: toSkates,
        text: 'Хенрике забирает половник без слова. Раздаёт быстро и уверенно. Колбаса достаётся Нине и Оле, если он дома, и ещё одному кругу — тебе. Никто ничего не говорит. Ты {m:видел|видела}, кому и сколько.',
        effects: [set34('rb', 'henrike'), w34('rule_b', 'henrike'), npc('henrike', 1), until34(35, 16, 10)] },
      { id: 'c34_rb_secret', label: 'Принести им кастрюлю супа, не спрашивая Хенрике', when: rule('yards'), minutes: 40, terminal: true, outcomes: toSkates, ambientDuring: frost34,
        text: 'Ты наливаешь в бидон из своей доли и из доли {partner.gen}, обматываешь полотенцем и несёшь через двор. Тебе говорят спасибо так, будто ты {m:принёс|принесла} не суп, а лекарство. На обратном пути ты видишь в окне кухни Хенрике. Она тоже тебя видит.',
        effects: [set34('rb', 'secret'), w34('rule_b', 'secret'), { body: 'hunger', delta: 10 }, until34(35, 16, 20)] },
      { id: 'c34_rb_raise', label: 'Сказать Хенрике: это правило их уморит', when: rule('yards'), minutes: 30, terminal: true, outcomes: toSkates,
        text: 'Хенрике слушает, вытирая руки, и думает долго.\n\n— Sonntags essen alle hier. An meinem Tisch. Das ist kein Gesetz, das ist Sonntag.\n\nПо воскресеньям едят все здесь. За моим столом. Это не закон, это воскресенье.\n\nПравило осталось. Но завтра за столом будет тесно.',
        effects: [set34('rb', 'raise'), w34('rule_b', 'sunday'), npc('henrike', 1), until34(35, 16, 10)] },
      { id: 'c34_rb_trade', label: 'Предложить им работу за еду: штопать, чинить, перебирать', when: rule('yards'), minutes: 40, terminal: true, outcomes: toSkates,
        text: 'Через час на кухне у Хенрике сидят двое из соседнего двора и перебирают картошку на гнилую и хорошую. Им платят мисками. Это честно, и все это понимают, и никто не смотрит друг другу в глаза.',
        effects: [set34('rb', 'trade'), w34('rule_b', 'trade'), until34(35, 16, 20)] },
      { id: 'c34_rb_cover', label: 'Взять его работу на себя и вписать себя в лист', when: rule('work'), minutes: 50, activity: 'moderate', terminal: true, outcomes: toSkates, ambientDuring: frost34,
        text: 'Ты забираешь вёдра, ставишь на место, вписываешь своё имя карандашом поверх чужого. Хенрике видит исправление вечером. Ничего не говорит. Утром рядом с твоим именем стоит галочка её рукой.',
        effects: [set34('rb', 'cover'), w34('rule_b', 'cover'), { body: 'fatigue', delta: 6 }, until34(35, 16, 30)] },
      { id: 'c34_rb_sit', label: 'Переписать лист: старикам и детям — работа под крышей', when: rule('work'), minutes: 40, terminal: true, outcomes: toSkates,
        text: 'Ты садишься с Хенрике над листом. Вода, дрова, обход — молодым. Штопка, картошка, куры — тем, кто не может на морозе. Хенрике спорит о каждой строчке, потом соглашается со всеми. Новый лист висит на двери к ужину.',
        effects: [set34('rb', 'sit'), w34('rule_b', 'sit'), npc('henrike', 1), until34(35, 16, 20)] },
      { id: 'c34_rb_rule', label: 'Оставить как есть: правило для всех', when: rule('work'), minutes: 20, terminal: true, outcomes: toSkates,
        text: 'Ты отходишь от окна. Правило есть правило: его не ты {m:придумал|придумала}, но ты за него {m:голосовал|голосовала}. Через десять минут вёдра стоят у двери кухни, полные. Как он их донёс, ты не знаешь.',
        effects: [set34('rb', 'rule'), w34('rule_b', 'rule'), until34(35, 16, 0)] },
    ] }),

  X({ id: 'c34_ra', title: 'Счёт', camp: yard14, ambient: frost34,
    text: [
      // Котёл: ключ от кладовки
      { when: rule('pot'), text: 'В четыре Хенрике отдаёт тебе ключ от кладовки, тяжёлый, на шнурке.\n\n— Du zählst ab jetzt. Ich traue meinen Augen nicht mehr.\n\nТеперь считаешь ты. Я больше не доверяю своим глазам.' },
      { when: rule('pot'), text: 'Ты пересчитываешь полки. Мешки, банки, хлеб. По её тетради хлеба должно быть шесть буханок. Их пять. Крошки на полу ведут к двери чёрного хода.' },
      { when: all(rule('pot'), ninaFarm), text: 'Вечером, когда ты выходишь к колодцу, Нина стоит у сарая с узелком под курткой.' },
      // По дворам: обмен
      { when: rule('yards'), text: 'В четыре в ворота стучит фрау Кёлер. В корзине десяток яиц, под яйцами чистое полотенце.\n\n— Jeder Hof für sich, sagt man jetzt. Gut. Dann handeln wir. Zehn Eier gegen Kartoffeln. Wie viel?\n\nКаждый двор сам за себя, говорят теперь. Хорошо. Тогда торгуем. Десять яиц за картошку. Сколько?' },
      { when: all(rule('yards'), paulKnown), text: 'За её спиной Пауль, внук. На тебя он не смотрит.' },
      // Отработка: бригада
      { when: rule('work'), text: 'В четыре по листу Хенрике у тебя бригада на дровах: пилить берёзы у лесополосы, пока светло. Тебе дали двоих из тех, кто пришёл последним.' },
      { when: all(rule('work'), brothersCome), text: 'Керем садится на чурку и не встаёт.\n\n— Ich bin hier kein Knecht. Ich hab in Buchholz eine Werkstatt gehabt. Ich säg nicht für ein Abendbrot.\n\nЯ здесь не батрак. У меня в Бухгольце была мастерская. Я не пилю за ужин.' },
      { when: all(rule('work'), not(brothersCome), oleHome33), text: 'Вторым в бригаду записался Оле. Сам. Он стоит в тулупе, серый, с пилой, и ждёт, что ты скажешь.\n\n— Ich bin auch neu. Seit Lüneburg bin ich neu. Also säge ich.\n\nЯ тоже новый. После Люнебурга я новый. Значит, пилю.' },
      { when: all(rule('work'), not(brothersCome), not(oleHome33)), text: 'Второй в бригаде — Нина. Ей пятнадцать, пила больше её руки. Она надела рукавицы Хенрике и ждёт.' },
    ],
    actions: [
      { id: 'c34_ra_nina', label: 'Подойти к Нине и спросить прямо', when: all(rule('pot'), ninaFarm), minutes: 30, terminal: true, outcomes: toYard, ambientDuring: frost34,
        text: 'Нина не отпирается.\n\n— Это для Кёлер. У неё кончилось всё. Пауль ходил за дровами к вам, потому что у них даже печку нечем... Я одну. Одну буханку.\n\nОна протягивает тебе узелок: половина хлеба, вторую уже отнесла. Ты стоишь с этим хлебом и не знаешь, кто из вас прав.',
        effects: [set34('ra', 'nina'), w34('rule_a', 'nina'), npc('c7_nina', 1), until34(36, 16, 40)] },
      { id: 'c34_ra_count', label: 'Промолчать и пересчитать ещё раз завтра', when: rule('pot'), minutes: 20, terminal: true, outcomes: toYard,
        text: 'Ты запираешь кладовку и вешаешь ключ на шею. Завтра пересчитаешь. И послезавтра. Где-то на хуторе кто-то ест больше своей доли, и ты теперь знаешь об этом один.',
        effects: [set34('ra', 'count'), w34('rule_a', 'silent'), until34(36, 16, 20)] },
      { id: 'c34_ra_henrike', label: 'Сказать Хенрике: буханки не хватает', when: rule('pot'), minutes: 20, terminal: true, outcomes: toYard,
        text: 'Хенрике выслушивает и идёт в сарай за замком. Навесной, ржавый, от старой калитки. Вечером на двери кладовки висит замок. Нина за ужином не поднимает глаз от тарелки.',
        effects: [set34('ra', 'henrike'), w34('rule_a', 'lock'), npc('henrike', 1), { if: ninaFarm, then: [npc('c7_nina', -1)] }, until34(36, 16, 20)] },
      { id: 'c34_ra_fair', label: 'Дать по совести: пять кило за десяток', when: rule('yards'), minutes: 25, terminal: true, outcomes: toYard,
        text: 'Ты насыпаешь пять килограммов. Кёлер взвешивает мешок рукой и кивает: так было до всего этого, так и сейчас. Уходя, оставляет полотенце из-под яиц. «Für die Kleine». Для малой.',
        effects: [set34('ra', 'fair'), w34('rule_a', 'fair'), { place: 'eggs', at: 'c3_farm_stock', qty: 10 }, { unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }, until34(36, 16, 30)] },
      { id: 'c34_ra_hard', label: 'Дать два кило: каждый двор сам за себя', when: rule('yards'), minutes: 20, terminal: true, outcomes: toYard,
        text: 'Ты насыпаешь два килограмма. Кёлер смотрит на мешок, потом на тебя. Отдаёт яйца. «So ist das jetzt», — говорит она. Так теперь. И уходит, не попрощавшись, и Пауль за ней.',
        effects: [set34('ra', 'hard'), w34('rule_a', 'hard'), { place: 'eggs', at: 'c3_farm_stock', qty: 10 }, { unstock: 'potatoes', qty: 2, at: 'c3_farm_stock' }, until34(36, 16, 25)] },
      { id: 'c34_ra_gift', label: 'Дать картошки и не брать яиц', when: rule('yards'), minutes: 25, terminal: true, outcomes: toYard,
        text: 'Ты насыпаешь пять килограммов и отодвигаешь корзину с яйцами. Кёлер не понимает. Потом понимает и злится: она не нищая. Потом берёт мешок. Яйца всё равно оставляет на крыльце. Два из них треснули на морозе.',
        effects: [set34('ra', 'gift'), w34('rule_a', 'gift'), { place: 'eggs', at: 'c3_farm_stock', qty: 8 }, { unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }, until34(36, 16, 30)] },
      { id: 'c34_ra_talk', label: 'Уговорить: пилим вместе, ужин общий, без счёта', when: rule('work'), minutes: 60, activity: 'heavy', terminal: true, outcomes: toYard, ambientDuring: frost34,
        text: 'Ты не споришь. Берёшь пилу за одну ручку и протягиваешь вторую. Минуту ничего не происходит. Потом вторая ручка дёргается. До темноты вы валите две берёзы и распиливаете на чурки. Про лист никто не вспоминает.',
        effects: [set34('ra', 'talk'), w34('rule_a', 'together'), { body: 'fatigue', delta: 8 }, until34(36, 17, 0)] },
      { id: 'c34_ra_spare', label: 'Отпустить: я распилю сам', when: rule('work'), minutes: 60, activity: 'heavy', terminal: true, outcomes: toYard, ambientDuring: frost34,
        text: 'Ты пилишь {m:один|одна}. Берёза, вторая. Руки гудят. На лист Хенрике ты потом смотришь иначе: правило работает, пока кто-то делает чужую часть и молчит.',
        effects: [set34('ra', 'spare'), w34('rule_a', 'alone'), { body: 'fatigue', delta: 12 }, until34(36, 17, 0)] },
      { id: 'c34_ra_enforce', label: 'Сказать: по листу — значит по листу', when: rule('work'), minutes: 60, activity: 'heavy', terminal: true, outcomes: toYard, ambientDuring: frost34,
        text: 'Ты повторяешь это два раза, ровно. Встают, пилят. Плохо, зло, но пилят. Вечером на кухне тот, кого ты {m:заставил|заставила}, ест отдельно, у окна.',
        effects: [set34('ra', 'enforce'), w34('rule_a', 'enforce'), { body: 'fatigue', delta: 6 }, until34(36, 17, 0)] },
    ] }),
];
