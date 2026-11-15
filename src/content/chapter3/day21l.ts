import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import {
  A21, B21, S21, car21, guestsHome, lea, lue21, malte, night21, nursed, partnerDown, set21, until21, w21,
} from './point21';

// Участок 21, вход L: вечер и ночь в казарме Люнебурга (остались ждать или один без сознания), на рассвете — домой.
// Порознь на часть: A — двор, спортзал, солдаты; B — детская, женский корпус, донорский блок.
// Спасение здесь проще, чем на хуторе: врач рядом. Цена — своя кровь или ночь работы.
const farm = 'hof_luedemann';
const hall = { tempC: 14, outdoor: false, wet: false };
const yard = { tempC: 2, outdoor: true, wet: false };
const campL = { at: lue21, stock: 'c3_farm_stock', rest: false } as const;
const L = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S21({ ...scene, for: 'any', chapter: 'ch3', location: scene.location ?? lue21,
  camp: scene.camp ?? campL, safe: scene.safe ?? false, ambient: scene.ambient ?? hall });
const partnerUp: Cond = { partner: 'active' };
const henrikeHere: Cond = { npc: 'henrike', alive: true, at: lue21 };
const oleHurt: Cond = flag('w.c20_ole_hurt');
const carLue: Cond = { itemAt: 'opel_corsa', place: lue21 };
/** За рулём A; если он выбыл — та, что его выхаживала. */
const driver: Cond = any(A21, nursed);
const passenger: Cond = not(driver);
const blood = (delta: number): Effect => ({ body: 'bloodLoss', delta, target: '@partner' });
const drink = (delta: number): Effect => ({ body: 'thirst', delta, target: '@partner' });
const fed: Effect[] = [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -30 }];
const afterDusk = [{ id: 'a', when: A21, goto: 'c21_l_a_ole' }, { id: 'b', goto: 'c21_l_b_ward' }];
const afterWard = [{ id: 'h', when: henrikeHere, goto: 'c21_l_b_henrike' }, { id: 'n', goto: 'c21_l_supper' }];
const afterTrucks = [{ id: 'n', when: nursed, goto: 'c21_l_n_night' }, { id: 'a', when: A21, goto: 'c21_l_a_tobias' }, { id: 'b', goto: 'c21_l_b_ole' }];
/** Ночью из бака, оставленного за шлагбаумом, отливают. Если до дома не хватает, сержант даёт пять литров под подпись Хенрике. */
const fuelAtDawn: Effect[] = [
  { if: all(driver, carLue, not(flag('w.c21_car_yard'))), then: [{ siphon: 'opel_corsa', liters: 1.5 }, w21('l_siphoned', true)] },
  { if: all(driver, carLue, not({ fuelFor: 'opel_corsa', km: 42 })), then: [{ refuel: 'opel_corsa', liters: 5 }, w21('l_fuel_debt', true)] },
];
/** Дорога домой: A ведёт, B едет; спасающий везёт партнёра сам. */
const homeDrive: Effect[] = [
  { if: nursed, then: [{ takeFromPartner: 'car_keys' }, { carryPartner: { to: farm, km: 40, minutes: 65, vehicle: 'opel_corsa' } }],
    else: [{ if: A21, then: [{ drive: 'opel_corsa', km: 40, to: farm }], else: [{ move: farm }] }] },
  until21(21, 6, 35),
];
/** К утру врач ставит ещё одну бутылку, если партнёр так и не очнулся. */
const dawnDrip: Effect = { if: partnerDown, then: [blood(-25), drink(-40)] };

export const day21LScenes: Scene[] = [
  // ───────────── Оба на ногах: вечер ─────────────
  L({ id: 'c21_l_dusk', title: 'Никто не едет', ambient: yard,
    text: [
      { text: 'Вы остаётесь. В четыре от шлагбаума уходят две армейские машины. В кузовах сидят солдаты в касках, между ними ящики с бинтами. Гражданских не берут.' },
      { when: henrikeHere, text: 'Хенрике стоит у ворот и смотрит им вслед, пока задние огни не теряются за поворотом.' },
      { text: 'Во дворе прачечной всё ещё собирают простыни. В корпусах зажигают лампы. Генератор дают только донорскому блоку и детской.' },
    ],
    actions: [
      { id: 'c21_ld_yard', label: 'Помочь убрать двор прачечной', when: A21, minutes: 45, activity: 'moderate', terminal: true, outcomes: afterDusk,
        text: 'Гильзы вы сметаете в ведро. Простыни, которые уже не отстирать, складываете у котельной. Под одной лежит детская сандалия. Ты ставишь её на подоконник, подошвой вниз, как ставят в прихожей.', effects: [set21('ld', 'yard'), { body: 'stress', delta: 1 }, { body: 'fatigue', delta: 3 }, until21(20, 16, 30)] },
      { id: 'c21_ld_car', label: 'Перегнать Corsa во двор, под фонарь', when: all(A21, carLue, { has: 'car_keys' }), minutes: 20, terminal: true, outcomes: afterDusk,
        text: 'Сержант у шлагбаума долго смотрит на твой номер, потом на тебя.\n\n— Bis morgen früh. Schlüssel bleibt bei Ihnen.\n\nДо утра. Ключ остаётся у вас.\n\nТы ставишь машину под единственный фонарь, который горит всю ночь.', effects: [set21('ld', 'car'), w21('car_yard', true), until21(20, 16, 30)] },
      { id: 'c21_ld_gate', label: 'Постоять у шлагбаума с сержантом', when: A21, minutes: 20, terminal: true, outcomes: afterDusk,
        text: 'Сержант курит в кулак.\n\n— Die fahren mit zwölf Mann. Zurück kommen sie mit vierzig Verletzten. Und wohin damit?\n\nОни едут вдвенадцатером. Вернутся с сорока ранеными. И куда их?\n\nОн кивает на спортзал.\n\n— Da, wo ihr schlafen wolltet.\n\nТуда, где вы собирались спать.', effects: [set21('ld', 'gate'), set21('l_gym_known', true), until21(20, 16, 30)] },
      { id: 'c21_ld_kids', label: 'Пойти в детскую: там не хватает рук', when: B21, minutes: 45, terminal: true, outcomes: afterDusk,
        text: 'Сестра детской палаты даёт тебе таз и губку и ничего не спрашивает. Ты обтираешь горячие лбы, один за другим. Девочка у окна не открывает глаз. Но когда ты убираешь губку, она ловит твоё запястье и держит.', effects: [set21('ld', 'kids'), { body: 'stress', delta: 1 }, until21(20, 16, 30)] },
      { id: 'c21_ld_peters', label: 'Найти фрау Петерс', when: all(B21, flag('w.c20_peters_saved')), minutes: 30, terminal: true, outcomes: afterDusk,
        text: 'Фрау Петерс сидит на своей койке в третьем ряду, колено перевязано.\n\n— Das war nicht das letzte Mal, Kind. Die kommen wieder. Die gehen dahin, wo es hell ist.\n\nЭто было не в последний раз, детка. Они придут снова. Они идут туда, где светло.\n\nОна подвигается и хлопает ладонью по одеялу рядом с собой.', effects: [set21('ld', 'peters'), { body: 'stress', delta: -1 }, until21(20, 16, 30)] },
      { id: 'c21_ld_bench', label: 'Сесть рядом с Хенрике на скамью', when: all(B21, henrikeHere), minutes: 30, terminal: true, outcomes: afterDusk,
        text: 'Хенрике сидит прямо, руки на коленях.\n\n— Ich habe ihm das Stricken beigebracht, als er sechs war. Damit er stillsitzt.\n\nЯ научила его вязать, когда ему было шесть. Чтобы сидел смирно.\n\nОна смотрит на дверь блока.\n\n— Jetzt sitzt er still.\n\nТеперь он сидит смирно.', effects: [set21('ld', 'bench'), npc('henrike', 1), until21(20, 16, 30)] },
      { id: 'c21_ld_rest', label: 'Лечь на свободную койку в женском корпусе', when: B21, minutes: 45, activity: 'rest', terminal: true, outcomes: afterDusk,
        text: 'Койка чужая, одеяло пахнет хлоркой. Ты закрываешь глаза и видишь двор прачечной. Открываешь. Закрываешь снова. На третий раз получается уснуть.', effects: [set21('ld', 'rest'), { body: 'fatigue', delta: -6 }, until21(20, 16, 30)] },
    ] }),

  L({ id: 'c21_l_a_ole', title: 'Оле',
    text: [
      { when: oleHurt, text: 'Оле лежит в донорском блоке лицом к стене. Половина лица у него синяя, рука в бинтах до локтя. Сегодня у него не брали.' },
      { when: not(oleHurt), text: 'Оле сидит на койке в донорском блоке и чинит ремешок часов иголкой. На сгибе локтя у него пластырь поверх пластыря.' },
      { text: 'Соседняя койка застелена свежим бельём. Она для той, что должна была приехать сегодня.' },
      { text: '— Kommt sie? — спрашивает он.\n\nОна приедет?' },
    ],
    actions: [
      { id: 'c21_lo_truth', label: 'Сказать, что знаешь: колонна стоит, связи нет', minutes: 15, terminal: true, goto: 'c21_l_a_gym',
        text: '— Dann kommt sie nicht, — говорит Оле.\n\nЗначит, не приедет. Он говорит это спокойно, как говорят о поезде.\n\n— Schon gut. Ich hab nicht gepackt.\n\nНичего. Я и не собирал вещи.', effects: [set21('lo', 'truth'), npc('ole', 1), until21(20, 17, 15)] },
      { id: 'c21_lo_hope', label: 'Сказать: за ней поехали две машины', minutes: 15, terminal: true, goto: 'c21_l_a_gym',
        text: '— Zwei Wagen, — повторяет он. — Für mich sind sie damals mit einem gekommen.\n\nЗа мной тогда приехали на одной.\n\nОн почти улыбается.', effects: [set21('lo', 'hope'), until21(20, 17, 15)] },
      { id: 'c21_lo_promise', label: 'Повторить обещание: будет замена — увезём тебя сами', when: v('w.c20_ole', 'promise'), minutes: 15, terminal: true, goto: 'c21_l_a_gym',
        text: '— Sag das nicht so laut.\n\nНе говори так громко.\n\nОн показывает глазами на койку у окна. Там лежит старик и смотрит в потолок.\n\n— Den holt keiner.\n\nЗа ним никто не приедет.', effects: [set21('lo', 'promise'), npc('ole', 2), until21(20, 17, 15)] },
      { id: 'c21_lo_sit', label: 'Молча сесть на край койки', minutes: 20, terminal: true, goto: 'c21_l_a_gym',
        text: 'Ты садишься. Он долго молчит.\n\n— Die Küchenuhr zu Hause geht vier Minuten nach. Hat Mutter sie gestellt?\n\nКухонные часы дома отстают на четыре минуты. Мать их подвела?\n\nТы не знаешь. Он кивает, будто это и есть ответ.', effects: [set21('lo', 'sit'), set21('clock_slow', true), npc('ole', 1), until21(20, 17, 15)] },
    ] }),

  L({ id: 'c21_l_a_gym', title: 'Сорок коек',
    text: [
      { text: 'В пять фельдфебель с красной повязкой собирает мужчин у спортзала.\n\n— Vierzig Betten. In einer Stunde.\n\nСорок коек. За час.' },
      { text: 'В зале лежат маты, стоит гимнастический конь, под потолком висят баскетбольные кольца. На полу разметка, по которой больше никто не играет.' },
    ],
    actions: [
      { id: 'c21_lg_cots', label: 'Таскать койки со склада', minutes: 50, activity: 'heavy', terminal: true, goto: 'c21_l_supper',
        text: 'Койки складные, армейские, по двадцать кило. Ты носишь по две. Рядом работает мужчина в очках, бывший учитель. На десятой ходке он говорит:\n\n— Früher hab ich hier Zirkeltraining gegeben.\n\nРаньше я вёл тут круговую тренировку.\n\nСмеётся он один.', effects: [set21('lg', 'cots'), { body: 'fatigue', delta: 6 }, until21(20, 18, 15)] },
      { id: 'c21_lg_lamps', label: 'Развесить лампы и протянуть шнур от генератора', minutes: 40, activity: 'moderate', terminal: true, goto: 'c21_l_supper',
        text: 'Шнура хватает на шесть ламп. Ты вешаешь их над проходом, через одну. Фельдфебель щёлкает рубильником. Свет жёлтый и слабый.\n\n— Reicht zum Nähen.\n\nШить хватит.', effects: [set21('lg', 'lamps'), until21(20, 18, 15)] },
      { id: 'c21_lg_ask', label: 'Спросить фельдфебеля, что будет, если донора не привезут', minutes: 30, activity: 'moderate', terminal: true, goto: 'c21_l_supper',
        text: '— Dann nehmen sie die, die schon liegen. Öfter.\n\nТогда будут брать у тех, кто уже лежит. Чаще.\n\nОн смотрит на тебя.\n\n— Sie haben doch einen da drin.\n\nУ вас ведь там кто-то свой.\n\nКойку он суёт тебе в руки сам.', effects: [set21('lg', 'ask'), w21('l_more', true), { body: 'stress', delta: 2 }, { body: 'fatigue', delta: 3 }, until21(20, 18, 15)] },
    ] }),

  L({ id: 'c21_l_b_ward', title: 'Пять ампул',
    text: [
      { text: 'В детской восемь кроватей. Над каждой висит лист с температурой.' },
      { when: flag('w.c20_b_chart'), text: 'Эти столбики ты уже видела днём: после плазмы вниз, потом снова вверх, выше прежнего.' },
      { text: 'Сестра считает пакеты в лотке. Их пять.\n\n— Für heute Nacht. Wenn der Transport nicht kommt, war es das.\n\nНа эту ночь. Если транспорт не придёт, это всё.' },
    ],
    actions: [
      { id: 'c21_lw_window', label: 'Сесть к девочке у окна', minutes: 30, terminal: true, outcomes: afterWard,
        text: 'Она спрашивает, идёт ли на улице снег. Снега нет. Ты говоришь, что на лужах лёд.\n\n— Dann kommt er bald, — говорит она и закрывает глаза.\n\nЗначит, скоро пойдёт.', effects: [set21('lw', 'window'), set21('l_girl', true), until21(20, 17, 15)] },
      { id: 'c21_lw_count', label: 'Спросить сестру, кому достанутся пять', minutes: 15, terminal: true, outcomes: afterWard,
        text: '— Den Kleinsten zuerst. So steht es im Plan.\n\nСначала самым маленьким. Так написано в плане.\n\nОна не поднимает глаз.\n\n— Den Plan habe ich geschrieben.\n\nПлан писала я.', effects: [set21('lw', 'count'), { body: 'stress', delta: 2 }, until21(20, 17, 15)] },
      { id: 'c21_lw_wash', label: 'Перемыть лотки и прокипятить шприцы', minutes: 40, activity: 'light', terminal: true, outcomes: afterWard,
        text: 'Ты кипятишь, она раскладывает. Через полчаса она впервые садится, прямо на пол, спиной к батарее, и закрывает глаза. На четыре минуты. Ты их считаешь.', effects: [set21('lw', 'wash'), until21(20, 17, 15)] },
    ] }),

  L({ id: 'c21_l_b_henrike', title: 'Свёрток',
    text: [
      { text: 'Хенрике находит тебя в коридоре женского корпуса. В руках у неё свёрток, перевязанный бечёвкой.\n\n— Für Nina. Strümpfe. Ich habe sie hier gestrickt, nachts.\n\nДля Нины. Чулки. Я вязала их тут, ночами.' },
      { text: '— Und sag ihr nicht, dass ich geweint habe. Sag, ich habe geschimpft.\n\nИ не говори ей, что я плакала. Скажи, что ругалась.' },
    ],
    actions: [
      { id: 'c21_lh_take', label: 'Взять свёрток и пообещать', minutes: 10, terminal: true, goto: 'c21_l_supper',
        text: 'Свёрток тёплый: она держала его под пальто. Ты убираешь его во внутренний карман.\n\n— Geschimpft, — повторяешь ты.\n\nХенрике кивает и сразу уходит.', effects: [set21('lh', 'take'), { give: 'c21_socks' }, npc('henrike', 1), until21(20, 18, 15)] },
      { id: 'c21_lh_farm', label: 'Взять и рассказать ей, как дела на хуторе', minutes: 30, terminal: true, goto: 'c21_l_supper',
        text: 'Ты рассказываешь про кур, про насос, про Нинину тетрадь. Хенрике слушает и поправляет: не так кормите, не туда ставите вёдра. К концу она почти сердится. Так ей легче.', effects: [set21('lh', 'farm'), { give: 'c21_socks' }, npc('henrike', 2), until21(20, 18, 15)] },
      { id: 'c21_lh_ole', label: 'Взять и спросить, сколько у Оле взяли сегодня', minutes: 15, terminal: true, goto: 'c21_l_supper',
        text: '— Heute nichts. Wegen dem da draußen.\n\nСегодня ничего. Из-за того, что было во дворе.\n\nОна поправляет бечёвку на свёртке, хотя он уже у тебя в руках.\n\n— Morgen doppelt, hat die Ärztin gesagt. Nicht zu mir. Ich habe es durch die Tür gehört.\n\nЗавтра вдвое, сказала врач. Не мне. Я слышала через дверь.', effects: [set21('lh', 'ole'), { give: 'c21_socks' }, w21('l_double', true), { body: 'stress', delta: 1 }, until21(20, 18, 15)] },
    ] }),

  L({ id: 'c21_l_supper', title: 'Столовая',
    text: [
      { text: 'В столовой дают перловый суп и по куску хлеба. Очередь стоит молча. За соседним столом женщина кормит с ложки солдата с забинтованными руками.' },
      { when: all(A21, partnerUp), text: '{B} садится напротив. Под глазами у неё серо.' },
      { when: all(B21, partnerUp), text: '{A} садится напротив. Руки у него в ссадинах.' },
      { when: partnerDown, text: 'Ты ешь {m:один|одна}. Место напротив пустое.' },
    ],
    actions: [
      { id: 'c21_lu_eat', label: 'Съесть всё', minutes: 20, terminal: true, goto: 'c21_l_wait',
        text: 'Суп жидкий, но горячий. Хлебом ты вытираешь миску досуха.', effects: [set21('lu', 'eat'), ...fed, until21(20, 18, 50)] },
      { id: 'c21_lu_give', label: 'Отдать хлеб женщине с солдатом', minutes: 20, terminal: true, goto: 'c21_l_wait',
        text: 'Она берёт хлеб, не глядя, и сразу ломает его солдату в суп. Он ест и смотрит на свои бинты.', effects: [set21('lu', 'give'), { body: 'hunger', delta: -28 }, { body: 'thirst', delta: -30 }, { body: 'stress', delta: -1 }, until21(20, 18, 50)] },
      { id: 'c21_lu_fast', label: 'Только суп, быстро', minutes: 10, terminal: true, goto: 'c21_l_wait',
        text: 'Ты выпиваешь суп через край, стоя. Хлеб кладёшь в карман и съедаешь по дороге, сам{m:|а} не заметив.', effects: [set21('lu', 'fast'), ...fed, until21(20, 18, 50)] },
    ] }),

  L({ id: 'c21_l_wait', title: 'Темнота', ambient: yard,
    text: [
      { text: 'После ужина делать нечего. Только ждать.' },
      { text: 'В девять генератор глушат на час: берегут солярку. Казарма сидит в темноте и слушает дорогу.' },
    ],
    actions: [
      { id: 'c21_lx_road', label: 'Сидеть у шлагбаума и смотреть на шоссе', minutes: 30, terminal: true, goto: 'c21_l_trucks',
        text: 'В половине десятого на западе появляются огни. Сначала две пары фар, потом четыре. Потом ты сбиваешься. Ползут они очень медленно.', effects: [set21('lx', 'road'), until21(20, 22, 0)] },
      { id: 'c21_lx_ole', label: 'Пойти в блок и посидеть с Оле', minutes: 30, terminal: true, goto: 'c21_l_trucks',
        text: 'Оле не спит. Вы сидите в темноте. Он рассказывает, как в девять лет упал с груши и сломал ключицу. Мать несла его до машины и ругалась всю дорогу.\n\n— Wenn sie schimpft, hat sie Angst.\n\nКогда она ругается, ей страшно.', effects: [set21('lx', 'ole'), npc('ole', 1), until21(20, 22, 0)] },
      { id: 'c21_lx_nap', label: 'Лечь на час, пока тихо', minutes: 30, activity: 'rest', terminal: true, goto: 'c21_l_trucks',
        text: 'Ты ложишься на скамью в коридоре, под чужое пальто. Будит тебя не шум, а свет: генератор включили раньше срока.', effects: [set21('lx', 'nap'), { body: 'fatigue', delta: -8 }, until21(20, 22, 0, true)] },
    ] }),

  L({ id: 'c21_l_trucks', title: 'Десять вечера', ambient: yard,
    text: [
      { text: 'В десять шлагбаум поднимают. Въезжают армейские грузовики, за ними трактор с прицепом, за трактором автобус без стёкол. В кузовах лежат и сидят вплотную.' },
      { text: '— Tragen! Alle, die stehen können!\n\nНести! Все, кто стоит на ногах!' },
      { text: 'Писарь с планшетом идёт вдоль бортов и выкрикивает одно и то же:\n\n— Hartmann, Lea! Spenderin aus Hannover!\n\nНикто не отвечает. У каждой машины он кричит снова.' },
    ],
    actions: [
      { id: 'c21_lt_carry', label: 'Носить лежачих в спортзал', when: A21, minutes: 50, activity: 'heavy', terminal: true, outcomes: afterTrucks,
        text: 'Ты носишь до одиннадцати. Солдат, шофёр, ещё солдат. Один держит в кулаке собственный зуб и не отдаёт. Сорок коек кончаются раньше, чем раненые.', effects: [set21('lt', 'carry'), { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 2 }, until21(20, 23, 0)] },
      { id: 'c21_lt_crates', label: 'Разгружать белые ящики с крестами', when: A21, minutes: 40, activity: 'moderate', terminal: true, outcomes: afterTrucks,
        text: 'Ящиков два. Третий, говорят, уехал на тракторе в Йестебург. Холодильники в них молчат с полудня.\n\nПоследним с грузовика снимают плоский стальной чемодан с оборванной цепочкой. Его не дают никому. Лейтенант несёт сам, двумя руками, прямо в штаб. На крышке трафаретом: «STUDIE P — Hannover».', effects: [set21('lt', 'crates'), w21('l_case_seen', true), { body: 'fatigue', delta: 4 }, until21(20, 23, 0)] },
      { id: 'c21_lt_table', label: 'Встать к столу у входа: резать рукава и мыть раны', when: B21, minutes: 50, activity: 'moderate', terminal: true, outcomes: afterTrucks,
        text: 'Ты режешь, моешь, подаёшь. Доктор Алерс шьёт и не поднимает головы. Шофёр с рукой на ремне спрашивает у каждого, кто проходит:\n\n— Jessen. Malte Jessen. Der lag im ersten Laster.\n\nЙессен. Мальте Йессен. Он был в первом грузовике.\n\nЕго напарника никто не привёз.', effects: [set21('lt', 'table'), set21('l_jessen', true), { body: 'fatigue', delta: 5 }, { body: 'stress', delta: 2 }, until21(20, 23, 0)] },
      { id: 'c21_lt_kids', label: 'Бежать в детскую: ящики пришли', when: B21, minutes: 40, terminal: true, outcomes: afterTrucks,
        text: 'Сестра уже знает. Она стоит в дверях палаты и ждёт. Приносят в одиннадцать: шесть пакетов на восемь кроватей.\n\n— Sechs, — говорит она.\n\nИ начинает с самых маленьких, как в плане. Девочка у окна шестая. Двум старшим мальчикам сестра поправляет одеяла и ничего не говорит.', effects: [set21('lt', 'kids'), w21('l_kids_six', true), { body: 'stress', delta: 2 }, until21(20, 23, 0)] },
      { id: 'c21_lt_clerk', label: 'Спросить писаря, кого он ищет', minutes: 15, terminal: true, outcomes: afterTrucks,
        text: '— Vermisst. Beifahrersitz leer, kein Blut.\n\nПропала без вести. Сиденье пустое, крови нет.\n\nОн что-то вычёркивает и пишет рядом.\n\n— Ohne sie haben wir zwei Kisten. Das reicht bis Montag.\n\nБез неё у нас два ящика. Этого хватит до понедельника.', effects: [set21('lt', 'clerk'), set21('l_monday', true), set21('lea_known', true), until21(20, 23, 0)] },
    ] }),

  L({ id: 'c21_l_a_tobias', title: 'Тобиас', ambient: yard,
    text: [
      { text: 'Тобиас сидит на подножке грузовика и не может расстегнуть ремешок каски. Пальцы его не слушаются.' },
      { text: '— Die Spenderin lebt. Spuren hinter der Leitplanke, kleine Schuhe. Sie ist weggelaufen. Vor uns.\n\nДонор жива. Следы за отбойником, маленькие ботинки. Она сбежала. От нас.' },
      { text: '— Morgen früh gehe ich die Höfe ab. Jeden. Auch euren.\n\nЗавтра утром я обойду дворы. Каждый. Ваш тоже.' },
      { when: flag('w.c20_promise_lea'), text: 'Ты обещал Оле узнать, что с ней. Теперь ты хотя бы знаешь, что она жива.' },
    ],
    actions: [
      { id: 'c21_la_strap', label: 'Расстегнуть ему ремешок', minutes: 10, terminal: true, goto: 'c21_l_sleep',
        text: 'Ты расстёгиваешь. Он снимает каску и держит её на коленях, как миску.\n\n— Wenn sie bei euch auftaucht, sag es mir. Nicht dem Brandt. Mir.\n\nЕсли она объявится у вас, скажи мне. Не Брандту. Мне.', effects: [set21('la', 'strap'), set21('l_tobias_asked', true), set21('lea_known', true), npc('c15_tobias', 1), until21(20, 23, 25)] },
      { id: 'c21_la_why', label: 'Спросить, почему она сбежала', minutes: 10, terminal: true, goto: 'c21_l_sleep',
        text: '— Weil sie weiß, wie der vor ihr aussah.\n\nПотому что она знает, как выглядел тот, кто был до неё.\n\nОн смотрит на дверь донорского блока.\n\n— Ich wäre auch gelaufen.\n\nЯ бы тоже сбежал.', effects: [set21('la', 'why'), set21('tobias_doubt', true), set21('lea_known', true), until21(20, 23, 25)] },
      { id: 'c21_la_ole', label: 'Сказать: Оле должен услышать это от вас, а не от писаря', minutes: 15, terminal: true, goto: 'c21_l_sleep',
        text: '— Ich weiß.\n\nОн встаёт, качается и идёт к блоку сам. Через окно ты видишь, как он садится на край койки и говорит. Оле слушает и кивает. Потом отворачивается к стене.', effects: [set21('la', 'ole'), set21('lea_known', true), npc('c15_tobias', 1), npc('ole', 1), until21(20, 23, 25)] },
    ] }),

  L({ id: 'c21_l_b_ole', title: 'Сложенная простыня',
    text: [
      { text: 'В донорском блоке горит одна лампа. Оле сидит на койке одетый.\n\n— Sie kommt nicht. Ich hab den Schreiber durchs Fenster gehört.\n\nОна не приедет. Я слышал писаря через окно.' },
      { text: '— Dann bleibe ich.\n\nТогда я остаюсь.' },
      { text: 'Свежую простыню с соседней койки он снял и сложил вчетверо.' },
      { when: flag('w.c20_lea_gift'), text: 'Твою шоколадку он положил сверху.\n\n— Die gehört ihr. Heb sie auf.\n\nЭто её. Сбереги.' },
    ],
    actions: [
      { id: 'c21_lb_choc', label: 'Забрать шоколадку', when: flag('w.c20_lea_gift'), minutes: 10, terminal: true, goto: 'c21_l_sleep',
        text: 'Ты кладёшь её в карман куртки. Оле смотрит на пустую простыню.\n\n— Wenn du sie siehst: sag ihr, das Bett war gemacht.\n\nЕсли увидишь её, скажи: постель была застелена.', effects: [set21('lb', 'choc'), set21('l_choc', true), set21('lea_known', true), until21(20, 23, 25)] },
      { id: 'c21_lb_debt', label: 'Сказать: ты никому не должен', minutes: 10, terminal: true, goto: 'c21_l_sleep',
        text: '— Den Kindern schon.\n\nДетям должен.\n\n— Ich hab es der Kleinen am Fenster versprochen. Die zählt meine Beutel.\n\nЯ обещал маленькой у окна. Она считает мои пакеты.', effects: [set21('lb', 'debt'), set21('lea_known', true), npc('ole', 1), until21(20, 23, 25)] },
      { id: 'c21_lb_mother', label: 'Сказать: мать ждёт тебя здесь четвёртый день', minutes: 10, terminal: true, goto: 'c21_l_sleep',
        text: '— Sie soll heimfahren. Sag ihr das. Auf mich hört sie nicht.\n\nПусть едет домой. Скажи ей. Меня она не слушает.\n\nОн знает, что тебя она тоже не послушает.', effects: [set21('lb', 'mother'), set21('lea_known', true), until21(20, 23, 25)] },
      { id: 'c21_lb_sit', label: 'Сесть рядом и ничего не говорить', minutes: 20, terminal: true, goto: 'c21_l_sleep',
        text: 'Ты сидишь. Через десять минут он кладёт голову тебе на плечо, тяжело, как ребёнок, и засыпает сидя. Ты не двигаешься, пока не затекает рука.', effects: [set21('lb', 'sit'), set21('lea_known', true), npc('ole', 2), { body: 'stress', delta: -1 }, until21(20, 23, 25)] },
    ] }),

  L({ id: 'c21_l_sleep', title: 'Где спать',
    text: [
      { text: 'Спортзал занят ранеными. В женском корпусе на полу лежат те, кого привезли в автобусе. Сержант у шлагбаума пожимает плечами.\n\n— Wo Platz ist.\n\nГде найдёте место.' },
    ],
    actions: [
      { id: 'c21_ls_car', label: 'Спать в машине, под всеми одеялами', when: carLue, minutes: 10, terminal: true, goto: 'c21_l_leave', ambientDuring: { tempC: 5, outdoor: false, wet: false },
        text: 'Стёкла изнутри покрываются инеем. Вы спите сидя, головами друг к другу. В четыре тебя будит холод в ногах.', effects: [set21('ls', 'car'), until21(21, 5, 0, true)] },
      { id: 'c21_ls_block', label: 'Лечь на полу в коридоре блока, у батареи', minutes: 10, terminal: true, goto: 'c21_l_leave',
        text: 'Батарея чуть тёплая. Мимо всю ночь ходят с носилками, и каждый раз кто-то перешагивает через твои ноги. Ты спишь кусками.', effects: [set21('ls', 'block'), { body: 'stress', delta: 1 }, until21(21, 5, 0, true)] },
      { id: 'c21_ls_work', label: 'Не ложиться: в спортзале не хватает рук', minutes: 10, terminal: true, goto: 'c21_l_leave',
        text: 'Ты носишь воду, держишь лампу, меняешь тазы. В три доктор Алерс сама отбирает у тебя таз.\n\n— Zwei Stunden. Das ist ein Befehl.\n\nДва часа. Это приказ.\n\nТы засыпаешь на стуле у стены, не дойдя до койки.', effects: [set21('ls', 'work'), w21('l_night_work', true), { body: 'fatigue', delta: 6 }, until21(21, 3, 0), until21(21, 5, 0, true)] },
    ] }),

  // ───────────── Один без сознания: блок доктора Алерс ─────────────
  L({ id: 'c21_l_n_table', title: 'Стол', onEnter: [set21('nursed', true)],
    text: [
      { text: '{partner} лежит на столе в донорском блоке. Доктор Алерс шьёт, не поднимая головы. Сестра держит лампу.' },
      { text: 'Лицо у {partner.gen} серое. На своё имя {pm:он|она} не отвечает.' },
      { text: 'Алерс завязывает последний узел и только тогда смотрит на тебя.\n\n— Ich habe zwei Konserven. Eine kriegt {pm:er|sie}. Die fehlt morgen jemand anderem.\n\nУ меня две банки крови. Одну получит {pm:он|она}. Завтра её не хватит кому-то другому.' },
      { text: '— Geben Sie mir etwas zurück. Blut oder Hände. Mir ist beides recht.\n\nВерните мне что-нибудь. Кровь или руки. Меня устроит и то и другое.' },
    ],
    actions: [
      { id: 'c21_ln_blood', label: 'Сдать свою кровь взамен', minutes: 40, terminal: true, goto: 'c21_l_n_bed',
        text: 'Игла, жгут, двенадцать минут. Твой пакет она подписывает и уносит в холодильник. Чужой вешает над столом. Красное идёт по трубке медленно.\n\nКогда ты встаёшь, пол уходит вбок. Сестра ловит тебя за локоть.', effects: [set21('ln', 'blood'), w21('l_paid', 'blood'), { treat: 'proper', target: '@partner' }, blood(-22), drink(-30), { body: 'bloodLoss', delta: 9 }, { body: 'fatigue', delta: 8 }, until21(20, 16, 30)] },
      { id: 'c21_ln_hands', label: 'Обещать ей ночь работы', minutes: 30, terminal: true, goto: 'c21_l_n_bed',
        text: '— Gut. Ab zehn. Da kommen sie von der Autobahn.\n\nХорошо. С десяти. Тогда привезут с автобана.\n\nБанку она вешает над столом сама. Красное идёт по трубке медленно. Ты считаешь капли, пока не сбиваешься.', effects: [set21('ln', 'hands'), w21('l_paid', 'hands'), { treat: 'proper', target: '@partner' }, blood(-22), drink(-30), until21(20, 16, 30)] },
      { id: 'c21_ln_none', label: 'Сказать: мне нечем платить', minutes: 30, terminal: true, goto: 'c21_l_n_bed',
        text: 'Алерс смотрит на тебя долго. Потом вешает над столом бутылку с прозрачной жидкостью.\n\n— Dann Kochsalz. Das hält {pm:ihn|sie} am Leben. Aufwachen dauert länger.\n\nТогда физраствор. Жить будет. Приходить в себя — дольше.', effects: [set21('ln', 'none'), w21('l_paid', 'none'), { treat: 'proper', target: '@partner' }, blood(-10), drink(-30), until21(20, 16, 30)] },
    ] }),

  L({ id: 'c21_l_n_bed', title: 'Койка',
    text: [
      { text: '{partner.acc} перекладывают на койку у стены. Через две койки лежит Оле.' },
      { when: oleHurt, text: 'Половина лица у него синяя. Он смотрит на вас одним глазом и ничего не спрашивает.' },
      { when: not(oleHurt), text: 'Он приподнимается на локте.\n\n— Was ist passiert?\n\nЧто случилось?' },
      { when: henrikeHere, text: 'Хенрике приходит через минуту, без пальто. Она трогает лоб {partner.gen} тыльной стороной ладони, как трогают детям.\n\n— Kalt. Decken. Mehr Decken.\n\nХолодный. Одеяла. Ещё одеял.' },
    ],
    actions: [
      { id: 'c21_lk_warm', label: 'Собрать одеяла со свободных коек и укрыть', minutes: 30, terminal: true, goto: 'c21_l_supper',
        text: 'Четыре одеяла, одно на другое. Ты подтыкаешь края, как тебе когда-то подтыкали в детстве. Через час пальцы у {partner.gen} перестают быть ледяными.', effects: [set21('lk', 'warm'), blood(-2), until21(20, 18, 15)] },
      { id: 'c21_lk_ole', label: 'Рассказать Оле, что было во дворе', minutes: 30, terminal: true, goto: 'c21_l_supper',
        text: 'Ты рассказываешь коротко. Оле слушает и смотрит на соседнюю койку.\n\n— Ich pass auf. Geh was essen. Ich kann ja sowieso nicht weg.\n\nЯ присмотрю. Иди поешь. Я всё равно никуда не денусь.', effects: [set21('lk', 'ole'), npc('ole', 2), until21(20, 18, 15)] },
      { id: 'c21_lk_sit', label: 'Сесть рядом и держать за руку', minutes: 40, terminal: true, goto: 'c21_l_supper',
        text: 'Рука тяжёлая и холодная. Ты держишь её в обеих своих и говоришь всё подряд: про дорогу, про хутор, про то, что куры без вас не кормлены. Один раз пальцы в твоей ладони вздрагивают.', effects: [set21('lk', 'sit'), { body: 'stress', delta: -2 }, until21(20, 18, 15)] },
    ] }),

  L({ id: 'c21_l_n_night', title: 'У койки',
    text: [
      { text: 'К полуночи в блоке тесно: раненых с автобана кладут в проходе. Писарь заглядывает и сюда, со своим планшетом и своим вопросом. Донора не привезли.' },
      { when: v('w.c21_l_paid', 'hands'), text: 'Ты обещал{m:|а} Алерс ночь работы. Она находит тебя сама и молча даёт таз.' },
      { when: partnerUp, text: '{partner} уже открывал{pm:|а} глаза. Узнал{pm:|а} тебя и уснул{pm:|а} опять, теперь по-настоящему.' },
      { when: partnerDown, text: '{partner} не приходит в себя. Но губы уже не серые.' },
    ],
    actions: [
      { id: 'c21_lz_work', label: 'Отработать обещанное: вода, тазы, лампа', when: v('w.c21_l_paid', 'hands'), minutes: 10, terminal: true, goto: 'c21_l_leave',
        text: 'Ты носишь воду и держишь лампу до трёх. Каждый раз, проходя мимо койки, трогаешь одеяло: поднимается, опускается. В три Алерс отбирает у тебя таз.\n\n— Genug. Wir sind quitt.\n\nХватит. Мы в расчёте.\n\nПеред рассветом она сама меняет бутылку над койкой.', effects: [set21('lz', 'work'), w21('l_night_work', true), { body: 'fatigue', delta: 8 }, blood(-3), until21(21, 3, 0), dawnDrip, until21(21, 5, 0, true)] },
      { id: 'c21_lz_spoon', label: 'Не спать: поить с ложки каждый час', when: not(v('w.c21_l_paid', 'hands')), minutes: 10, terminal: true, goto: 'c21_l_leave',
        text: 'Каждый час ты подносишь ложку к {pm:его|её} губам. В третьем часу {pm:он|она} глотает сам{pm:|а}, не просыпаясь. Перед рассветом сестра меняет бутылку над койкой и кивает тебе: иди ложись.', effects: [set21('lz', 'spoon'), blood(-4), drink(-40), until21(21, 3, 30), dawnDrip, until21(21, 5, 0, true)] },
      { id: 'c21_lz_chair', label: 'Спать на стуле у койки', when: not(v('w.c21_l_paid', 'hands')), minutes: 10, terminal: true, goto: 'c21_l_leave',
        text: 'Ты засыпаешь, положив голову на край матраса. Дважды просыпаешься и слушаешь: дышит. Перед рассветом сестра меняет бутылку над койкой и тебя не будит.', effects: [set21('lz', 'chair'), blood(-2), drink(-20), until21(21, 3, 30, true), dawnDrip, until21(21, 5, 0, true)] },
    ] }),

  // ───────────── Рассвет: домой ─────────────
  L({ id: 'c21_l_leave', title: 'Пять утра', ambient: yard,
    text: [
      { when: henrikeHere, text: 'В пять тебя трясёт за плечо Хенрике.\n\n— Fahrt heim. Der Hof ist allein mit dem Kind.\n\nЕзжайте домой. Хутор стоит один, с ребёнком.\n\n— Ich bleibe. Solange er bleibt.\n\nЯ останусь. Пока он остаётся.' },
      { when: not(henrikeHere), text: 'В пять тебя будит сержант.\n\n— Wer einen Hof hat, fährt jetzt. Bevor die Straße voll ist.\n\nУ кого есть двор, едет сейчас. Пока дорога пустая.' },
      { when: all(nursed, partnerUp), text: '{partner} сидит на койке, в одеяле. Встаёт {pm:он|она} со второй попытки, держась за твоё плечо.\n\n— {pm:Er|Sie} fährt nicht, — говорит Алерс. За руль не садиться. — Und zwei Wochen nichts Schweres.\n\nИ две недели ничего тяжёлого.' },
      { when: all(nursed, partnerDown), text: '{partner} всё ещё спит. Алерс щупает пульс и кивает.\n\n— Stabil. Zu Hause ist es wärmer als hier. Nehmen Sie {pm:ihn|sie} mit.\n\nСтабильно. Дома теплее, чем тут. Забирайте.\n\nДвое санитаров несут {pm:его|её} к машине на одеяле.' },
      { when: all(driver, carLue, not(flag('w.c21_car_yard'))), text: 'Крышка бензобака у Corsa открыта. На асфальте тёмное пятно и окурок. Ночью из бака отлили.' },
      { when: all(driver, carLue, not({ fuelFor: 'opel_corsa', km: 42 })), text: 'Сержант выносит канистру.\n\n— Fünf Liter. Frau Lüdemann hat unterschrieben. Dafür wäscht sie eine Woche länger.\n\nПять литров. Фрау Людеман расписалась. Отработает лишней неделей в прачечной.' },
    ],
    actions: [
      { id: 'c21_lv_ole', label: 'Зайти к Оле на минуту', minutes: 10, terminal: true, goto: 'c21_l_road',
        text: 'Оле спит лицом к стене. Ты поправляешь ему одеяло. На тумбочке лежит тетрадь, открытая на сегодняшнем числе. Строчка пока пустая.', effects: [set21('lv', 'ole'), ...fuelAtDawn, { phonePower: true }, until21(21, 5, 25)] },
      { id: 'c21_lv_hug', label: 'Обнять Хенрике', when: henrikeHere, minutes: 5, terminal: true, goto: 'c21_l_road',
        text: 'Секунду она стоит прямо, как столб. Потом обнимает в ответ, крепко, обеими руками.\n\n— Fahrt. Bevor ich es mir anders überlege.\n\nЕзжайте. Пока я не передумала.', effects: [set21('lv', 'hug'), ...fuelAtDawn, { phonePower: true }, npc('henrike', 2), until21(21, 5, 25)] },
      { id: 'c21_lv_go', label: 'Ехать сразу', minutes: 5, terminal: true, goto: 'c21_l_road',
        text: 'Мотор схватывает со второго раза. Шлагбаум поднимают, не спрашивая.', effects: [set21('lv', 'go'), ...fuelAtDawn, { phonePower: true }, until21(21, 5, 25)] },
    ] }),

  L({ id: 'c21_l_road', title: 'Сорок километров', ambient: car21,
    text: [
      { text: 'Вы едете на запад в темноте, в объезд, через Зальцхаузен. Навстречу идут люди с узлами: по двое, по трое, семьями. Все в сторону Люнебурга.' },
      { text: 'У Гарльсторфа над лесом больше ничего не светится. Съезд на автобан перетянут лентой.' },
      { when: driver, text: 'За Ханштедтом на обочине стоит мужчина и держит над головой пустую канистру.' },
      { when: passenger, text: '{A} ведёт молча. Печка гудит и почти не греет.' },
    ],
    actions: [
      { id: 'c21_ly_stop', label: 'Остановиться', when: driver, minutes: 10, terminal: true, goto: 'c21_l_home',
        text: 'Бензина он не просит. Он просит передать: в Эгесторфе, в школе, сорок человек и ни одного врача.\n\n— Sagen Sie es irgendwem. Irgendwem mit Funk.\n\nСкажите кому-нибудь. Кому-нибудь с рацией.\n\nКанистру он опускает, только когда ты повторяешь название вслух.', effects: [set21('ly', 'stop'), w21('egestorf', true), ...homeDrive] },
      { id: 'c21_ly_slow', label: 'Сбавить, но не останавливаться', when: driver, minutes: 5, terminal: true, goto: 'c21_l_home',
        text: 'Он шагает к машине, видит, что ты не тормозишь, и опускает канистру. В зеркале он ещё долго стоит на обочине.', effects: [set21('ly', 'slow'), { body: 'stress', delta: 1 }, ...homeDrive] },
      { id: 'c21_ly_fast', label: 'Ехать: дома Нина одна', when: driver, minutes: 5, terminal: true, goto: 'c21_l_home',
        text: 'Ты не сбавляешь. Фары выхватывают его лицо на секунду: немолодое, небритое. Потом снова темно.', effects: [set21('ly', 'fast'), ...homeDrive] },
      { id: 'c21_ly_count', label: 'Считать, сколько людей идёт навстречу', when: passenger, minutes: 5, terminal: true, goto: 'c21_l_home',
        text: 'До Зальцхаузена ты насчитываешь шестьдесят. Потом бросаешь. Все идут туда, откуда вы уезжаете.', effects: [set21('ly', 'count'), set21('l_sixty', true), ...homeDrive] },
      { id: 'c21_ly_fields', label: 'Смотреть в поля', when: passenger, minutes: 5, terminal: true, goto: 'c21_l_home',
        text: 'У Ханштедта по пашне идут трое в белом. Не к дороге и не к домам: наискось, на запад, туда, где вчера горело. Гореть там уже нечему. Они идут всё равно.', effects: [set21('ly', 'fields'), set21('saw_rails', true), ...homeDrive] },
      { id: 'c21_ly_doze', label: 'Закрыть глаза до дома', when: passenger, minutes: 5, activity: 'rest', terminal: true, goto: 'c21_l_home',
        text: 'Ты засыпаешь на первом километре. Просыпаешься, когда колёса хрустят по гравию просёлка.', effects: [set21('ly', 'doze'), { body: 'fatigue', delta: -4 }, ...homeDrive] },
    ] }),

  L({ id: 'c21_l_home', title: 'У нас гости', location: farm, camp: yard14, safe: true, ambient: night21,
    onEnter: [...guestsHome, { set: '$.met.c21_dirk', value: true }, w21('dirk', 'slept'), w21('lea_bed', 'sewing'), set21('lea_known', true)],
    text: [
      { text: 'Половина седьмого. Двор белый от инея. Нина отодвигает засов раньше, чем глохнет мотор. В руке у неё кочерга.' },
      { text: '— У нас гости, — говорит она вместо «привет». — Трое, с колонны. Пришли в семь вечера, полем, с фонарём. Один со сломанной ногой, его несли на двери. Я пустила. — Она смотрит тебе в лицо. — Правильно?' },
      { text: 'У курятника стоит девушка в кофте Хенрике. Волосы у неё острижены до ушей, неровно, будто на ощупь. На крыльце сидит молодой солдат и спит, привалившись к перилам. Автомат лежит у него на коленях.' },
      { text: '— Это Лея, — говорит Нина. — Она ветеринар. Она вправила тому ногу гладильной доской. А солдату я сказала: ты спишь стоя, ляг. Он лёг.' },
    ],
    actions: [
      { id: 'c21_lq_right', label: 'Сказать: правильно', minutes: 10, terminal: true, goto: 'c21_h_breakfast',
        text: 'Нина выдыхает. Кочергу она ставит к стене и сразу становится на год младше.\n\n— Я боялась, что вы скажете: нет.', effects: [set21('lq', 'right'), w21('iron_board', true), npc('c7_nina', 3, 'c21_trusted_my_call'), until21(21, 6, 55)] },
      { id: 'c21_lq_lea', label: 'Подойти к девушке у курятника', minutes: 15, terminal: true, goto: 'c21_h_breakfast',
        outcomes: [
          { id: 'choc', when: flag('$.c21_l_choc'), text: 'Ты достаёшь из кармана шоколадку и говоришь, откуда она: с койки, которую для неё застелили.\n\nОна долго смотрит на обёртку.\n\n— Dann wisst ihr, wer ich bin.\n\nЗначит, вы знаете, кто я.\n\nШоколадку она берёт. Руки у неё дрожат.', effects: [set21('lq', 'lea'), w21('iron_board', true), lea(3, 'c21_bed_was_made')] },
          { id: 'plain', text: 'Она держит в руках рыжую несушку и раздвигает ей перья под крылом.\n\n— Milben. Nicht schlimm. Asche ins Stroh.\n\nКлещи. Не страшно. Золы в солому.\n\nПотом, не поднимая глаз:\n\n— Euer Mädchen hat mich nicht gefragt, wer ich bin. Ihr werdet fragen.\n\nВаша девочка не спросила, кто я. Вы спросите.', effects: [set21('lq', 'lea'), w21('iron_board', true), lea(1)] },
        ], effects: [until21(21, 6, 55)] },
      { id: 'c21_lq_malte', label: 'Зайти на кухню, к раненому', minutes: 15, terminal: true, goto: 'c21_h_breakfast',
        outcomes: [
          { id: 'jessen', when: flag('$.c21_l_jessen'), text: 'Шофёр лежит на лавке у печи, нога в гладильной доске.\n\n— Jessen? — спрашиваешь ты. — Malte Jessen?\n\nОн приподнимается на локтях. Ты рассказываешь про его напарника с рукой на ремне, который всю ночь спрашивал о нём в Люнебурге.\n\n— Der Rolf lebt, — говорит он и ложится обратно. Рольф жив. И плачет, не закрывая лица.', effects: [set21('lq', 'malte'), w21('iron_board', true), malte(3, 'c21_rolf_alive')] },
          { id: 'plain', text: 'Шофёр лежит на лавке у печи, нога в гладильной доске.\n\n— Malte. Ich bin der Fahrer. Euer Mädchen hat mir die ganze Nacht Tee gebracht. Und Fragen gestellt. Hundert Fragen.\n\nМальте. Я шофёр. Ваша девочка всю ночь носила мне чай. И задавала вопросы. Сто вопросов.', effects: [set21('lq', 'malte'), w21('iron_board', true), malte(1)] },
        ], effects: [until21(21, 6, 55)] },
      { id: 'c21_lq_socks', label: 'Отдать Нине свёрток от Хенрике', when: { has: 'c21_socks' }, minutes: 10, terminal: true, goto: 'c21_h_breakfast',
        text: 'Нина развязывает бечёвку зубами. Чулки серые, толстые, с красной полоской.\n\n— Она ругалась? — спрашивает Нина.\n\n— Ругалась.\n\nНина кивает и прижимает чулки к лицу.', effects: [set21('lq', 'socks'), w21('iron_board', true), w21('nina_socks', true), { take: 'c21_socks' }, npc('c7_nina', 2), until21(21, 6, 55)] },
    ] }),
];
