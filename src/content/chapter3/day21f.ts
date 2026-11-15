import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { carHere, evaHere, npc, tableOnly } from './point19';
import {
  A21, B21, S21, dusk21, fromLue, guestsHome, knowsLea, lea, malte, night21, rescuer, set21, until21, w21,
} from './point21';

// Участок 21, вход F: вечер на хуторе (остались или вернулись из Люнебурга в объезд). В 18:45 трое с колонны приходят полем.
// Порознь на часть: A — дорога и двор, B — кухня. Сцены кухни с Леей читает и спасающий из входа R (флаг $.c21_rescuer).
const F = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S21({ ...scene, for: 'any', chapter: 'ch3' });
/** Тот, кто на кухне с Леей: B в обычный вечер, спасающий — в точке спасения. */
const inKitchen: Cond = any(B21, rescuer);
const pairUp: Cond = not(rescuer);
const dog: Cond = any(v('w.c19_dog', 'house'), v('w.c19_dog', 'gate'));
const strips: Cond = v('w.c19_b_stitch', 'strips');
const ninaTold: Cond = flag('w.c18_nina_told');
const gunHand: Cond = { has: 'c19_flinte' };
const afterDusk = [{ id: 'a', when: A21, goto: 'c21_f_a_jannes' }, { id: 'b', goto: 'c21_f_b_eva' }];
const afterLight = [{ id: 'a', when: A21, goto: 'c21_f_a_lane' }, { id: 'b', goto: 'c21_f_b_table' }];
const afterCousin = [{ id: 'r', when: rescuer, goto: 'c21_r_dirk' }, { id: 'f', goto: 'c21_f_late' }];

export const day21FScenes: Scene[] = [
  F({ id: 'c21_f_dusk', title: 'Сумерки', camp: yard14, ambient: dusk21,
    text: [
      { when: not(fromLue), text: 'Солнце село, так и не показавшись. Во дворе пахнет порохом и мокрым пером. Вы остались дома.' },
      { when: fromLue, text: 'Вы въезжаете во двор в сумерках, с севера, со стороны Винзена. Нина отодвигает засов раньше, чем глохнет мотор.\n\n— Они стояли у задней калитки час, — говорит она вместо «привет». — Шестеро. Потом ушли к шоссе. Я свет не зажигала.' },
      { text: 'На востоке над лесом небо рыжее. Закат был с другой стороны.' },
      { when: all(A21, v('w.c20_bodies', 'left'), not(fromLue)), text: 'Тела у поленницы всё ещё лежат там, где упали.' },
    ],
    actions: [
      { id: 'c21_fd_bodies', label: 'Убрать тела от поленницы, пока видно', when: all(A21, v('w.c20_bodies', 'left'), not(fromLue)), minutes: 40, activity: 'heavy', terminal: true, outcomes: afterDusk, ambientDuring: dusk21,
        text: 'Ты стаскиваешь их на брезенте за изгородь, в канаву, и забрасываешь землёй. Последним идёт парень лет пятнадцати в больничной рубашке с динозаврами. Ты стараешься смотреть на его ботинки.', effects: [set21('fd', 'bodies'), w21('bodies_done', true), { body: 'stress', delta: 3 }, { body: 'fatigue', delta: 6 }, until21(20, 16, 15)] },
      { id: 'c21_fd_wire', label: 'Натянуть вдоль задней изгороди проволоку с банками', when: A21, minutes: 40, activity: 'moderate', terminal: true, outcomes: afterDusk, ambientDuring: dusk21,
        text: 'Проволока, шесть консервных банок, в каждой гайка. Грубо, зато слышно из дома. Нина держит моток и первая же задевает проволоку рукавом. Банки гремят на весь двор. Она смеётся, зажав рот ладонью.', effects: [set21('fd', 'wire'), w21('wire', true), npc('c7_nina', 1), until21(20, 16, 15)] },
      { id: 'c21_fd_roof', label: 'Залезть на крышу сарая и посмотреть на восток', when: A21, minutes: 25, activity: 'moderate', terminal: true, outcomes: afterDusk, ambientDuring: dusk21,
        text: 'С конька видно зарево и под ним синие вспышки, мелкие, как спички. Видно и дорогу на Йестебург: по ней ползут жёлтые тракторные огни. Брандт едет к автобану.', effects: [set21('fd', 'roof'), set21('saw_brandt_go', true), until21(20, 16, 15)] },
      { id: 'c21_fd_car', label: 'Развернуть Corsa носом к воротам', when: all(A21, carHere), minutes: 15, terminal: true, outcomes: afterDusk, ambientDuring: dusk21,
        text: 'Ты ставишь машину так, чтобы выехать без разворота. Ключи кладёшь не в карман, а на гвоздь у двери: если что, их найдёт любой из вас.', effects: [set21('fd', 'car'), until21(20, 16, 15)] },
      { id: 'c21_fd_nina', label: 'Подняться к Нине', when: B21, minutes: 30, terminal: true, outcomes: afterDusk,
        text: 'Нина сидит на кровати с тетрадью по биологии и рисует клетку: ядро, оболочка, стрелки.\n\n— Если школа когда-нибудь откроется, — говорит она, — я буду единственная, кто делал уроки.\n\nТы садишься рядом и подписываешь ей митохондрию.', effects: [set21('fd', 'nina'), npc('c7_nina', 2), { body: 'stress', delta: -1 }, until21(20, 16, 15)] },
      { id: 'c21_fd_lamp', label: 'Заправить лампы и разложить свечи', when: B21, minutes: 30, terminal: true, outcomes: afterDusk,
        text: 'Керосина в бутыли на два пальца. Ты заливаешь обе лампы и кладёшь по свече на каждый подоконник. Если ночью что-то случится, не придётся шарить в темноте.', effects: [set21('fd', 'lamp'), set21('lamps', true), until21(20, 16, 15)] },
      { id: 'c21_fd_rest', label: 'Лечь на полчаса: ночь может быть длинной', when: B21, minutes: 5, terminal: true, outcomes: afterDusk,
        text: 'Ты ложишься поверх одеяла. Сон приходит сразу, без снов.', effects: [set21('fd', 'rest'), until21(20, 16, 15, true)] },
    ] }),

  // ───────────── A до ужина ─────────────
  F({ id: 'c21_f_a_jannes', title: 'Яннес', camp: yard14, ambient: dusk21,
    text: [
      { text: 'У ворот свистят, в два пальца. Яннес. Он бежал: куртка расстёгнута, изо рта пар.' },
      { text: '— Mutter schickt mich. Auf den Gleisen gehen welche. Viele. Vom Bahnhof Buchholz her, Richtung Feuer. Kommst du gucken?\n\nМать послала. По рельсам идут. Много. Со стороны вокзала в Бухгольце, на огонь. Пойдёшь посмотреть?' },
    ],
    actions: [
      { id: 'c21_fj_go', label: 'Дойти с ним до насыпи', minutes: 40, move: true, terminal: true, goto: 'c21_f_a_nina', ambientDuring: dusk21,
        text: 'С насыпи их видно хорошо. Они идут по шпалам гуськом, не оступаясь, человек двадцать. Больничные рубашки, пижамы, один в халате врача. На вас они не смотрят. Все лица повёрнуты к зареву.\n\n— Wie Motten, — говорит Яннес. Как мотыльки.', effects: [set21('fj', 'go'), set21('saw_rails', true), npc('c14_jannes', 2), { body: 'stress', delta: 2 }, until21(20, 17, 5)] },
      { id: 'c21_fj_ute', label: 'Сказать: бери мать и идите ночевать к нам', minutes: 15, terminal: true, goto: 'c21_f_a_nina',
        text: 'Яннес качает головой.\n\n— Sie geht nicht weg von der Elf. Sie sagt, sie hört ihn da noch.\n\nОна не уйдёт от одиннадцатого. Говорит, что всё ещё слышит его там.\n\nОн берёт у тебя из рук горбушку, которую ты не предлагал, и убегает обратно.', effects: [set21('fj', 'ute'), npc('c14_jannes', 1), npc('c14_ute', 1), until21(20, 17, 5)] },
      { id: 'c21_fj_stay', label: 'Сказать: мне нельзя со двора. Сидите тихо и без света', minutes: 10, terminal: true, goto: 'c21_f_a_nina',
        text: '— Machen wir sowieso, — говорит Яннес. Мы и так.\n\nОн смотрит на твой двор, на окна, где за занавеской движется лампа, и уходит не сразу.', effects: [set21('fj', 'stay'), until21(20, 17, 5)] },
    ] }),

  F({ id: 'c21_f_a_nina', title: 'Нина', camp: house14,
    text: [
      { when: not(ninaTold), text: 'Нина ждёт тебя в сенях. Куртка застёгнута до горла.\n\n— Ты сказал: вечером, когда вернётся {B}. Она вернулась в среду. Сегодня пятница.\n\nОна не повышает голос. От этого хуже.' },
      { when: ninaTold, text: 'Нина ждёт тебя в сенях. В руках у неё отцовская кепка с эмблемой службы доставки.\n\n— Я хочу отнести её туда. В двенадцатый. Ты покажешь, где он?' },
    ],
    actions: [
      { id: 'c21_fx_all', label: 'Рассказать ей про среду всё, по порядку', when: not(ninaTold), minutes: 25, terminal: true, goto: 'c21_f_a_phone',
        text: 'Ты рассказываешь: грузовики, офицер, как ты стоял в калитке и где очнулся. Про выстрелы тоже. Нина слушает до конца.\n\n— Я знала, — говорит она. — Я в четверг ходила смотреть. Двери открыты. Я хотела, чтобы ты сам сказал.\n\nОна уходит наверх. Через минуту возвращается и молча ставит тебе чайник.', effects: [set21('fx', 'all'), w21('nina_told', true), npc('c7_nina', 3, 'c21_told_me'), until21(20, 17, 35)] },
      { id: 'c21_fx_short', label: 'Сказать одно: его больше нет', when: not(ninaTold), minutes: 10, terminal: true, goto: 'c21_f_a_phone',
        text: '— Его больше нет, — говоришь ты.\n\n— Я знаю, — говорит Нина. — Я ходила смотреть.\n\nОна стоит ещё секунду, как будто ждёт остального. Остального ты не говоришь.', effects: [set21('fx', 'short'), w21('nina_told', true), npc('c7_nina', 1), until21(20, 17, 35)] },
      { id: 'c21_fx_later', label: 'Сказать: не сегодня. Сегодня не до этого', when: not(ninaTold), minutes: 5, terminal: true, goto: 'c21_f_a_phone',
        text: 'Нина кивает. Расстёгивает куртку, вешает на крючок, аккуратно, петелькой.\n\n— Ладно, — говорит она по-русски. Больше она тебя об этом не спросит.', effects: [set21('fx', 'later'), npc('c7_nina', -3, 'c21_put_me_off'), until21(20, 17, 35)] },
      { id: 'c21_fx_sunday', label: 'Пообещать: в воскресенье, засветло, вдвоём', when: ninaTold, minutes: 10, terminal: true, goto: 'c21_f_a_phone',
        text: '— В воскресенье, — повторяет Нина. Кепку она вешает на свой крючок в сенях, рядом с курткой.', effects: [set21('fx', 'sunday'), w21('nina_cap', true), npc('c7_nina', 2), until21(20, 17, 35)] },
      { id: 'c21_fx_no', label: 'Сказать: там сейчас ходят. Не надо', when: ninaTold, minutes: 10, terminal: true, goto: 'c21_f_a_phone',
        text: 'Нина смотрит на кепку.\n\n— Тогда пусть висит здесь, — говорит она и вешает её на крючок Оле.', effects: [set21('fx', 'no'), until21(20, 17, 35)] },
    ] }),

  F({ id: 'c21_f_a_phone', title: 'Сообщение', camp: house14,
    text: [
      { text: 'Телефон в кармане вздрагивает. Одна полоска сети, первый раз за два дня.' },
      { when: flag('w.c19_fuel_offer'), text: 'Керем: «Samstag gilt. Ich komme mit dem Moped gegen Mittag. Fünf Liter gegen Schnaps oder Diesel. Seid ihr heil? Wir haben das Schießen bis hier gehört».\n\nСуббота в силе. Приеду на мопеде к полудню. Пять литров за шнапс или солярку. Вы целы? Мы слышали стрельбу отсюда.' },
      { when: not(flag('w.c19_fuel_offer')), text: 'Керем: «Seid ihr heil? Wir haben das Schießen bis hier gehört. Deniz fragt, ob euer Trecker läuft».\n\nВы целы? Мы слышали стрельбу отсюда. Дениз спрашивает, на ходу ли ваш трактор.' },
    ],
    actions: [
      { id: 'c21_fp_yes', label: 'Ответить: целы, приезжай', minutes: 5, terminal: true, goto: 'c21_f_a_ready', enabled: { phoneUsable: true }, disabledReason: 'Телефон сел',
        text: 'Сообщение уходит с третьей попытки. Ответ приходит через минуту: поднятый большой палец и слово «Morgen».', effects: [set21('fp', 'yes'), w21('kerem_comes', true), { charge: 'phone', delta: -1 }, until21(20, 17, 45)] },
      { id: 'c21_fp_warn', label: 'Ответить: целы. На дорогах ходят, езжай засветло', minutes: 5, terminal: true, goto: 'c21_f_a_ready', enabled: { phoneUsable: true }, disabledReason: 'Телефон сел',
        text: '«Weiß ich. Ich fahre über die Felder». Знаю. Поеду полями. И потом, отдельным сообщением: «Danke, Bruder».', effects: [set21('fp', 'warn'), w21('kerem_comes', true), npc('kerem', 1), { charge: 'phone', delta: -1 }, until21(20, 17, 45)] },
      { id: 'c21_fp_off', label: 'Не отвечать и выключить телефон', minutes: 2, terminal: true, goto: 'c21_f_a_ready',
        text: 'Ты убираешь телефон. Заряда и так осталось мало.', effects: [set21('fp', 'off'), until21(20, 17, 45)] },
    ] }),

  F({ id: 'c21_f_a_ready', title: 'К ночи', camp: house14,
    text: [
      { text: 'До ужина десять минут. За окном темно так, что стекло отражает кухню.' },
      { when: gunHand, text: 'Двустволка стоит за шкафом. Патроны в банке с пуговицами.' },
    ],
    actions: [
      { id: 'c21_fr_gun', label: 'Зарядить правый ствол и поставить ружьё у двери', when: gunHand, minutes: 10, terminal: true, goto: 'c21_f_supper',
        text: 'Один патрон в правый ствол. Левому ты не веришь. Ружьё встаёт в угол у двери, между зонтом Хенрике и метлой.', effects: [set21('fr', 'gun'), set21('ready', true), until21(20, 18, 0)] },
      { id: 'c21_fr_fork', label: 'Поставить у двери вилы и фонарь', minutes: 10, terminal: true, goto: 'c21_f_supper',
        text: 'Вилы, фонарь, моток верёвки. Ты проверяешь фонарь: светит. Больше у двери ничего не нужно.', effects: [set21('fr', 'fork'), set21('ready', true), until21(20, 18, 0)] },
      { id: 'c21_fr_sit', label: 'Просто посидеть у печи', minutes: 10, terminal: true, goto: 'c21_f_supper',
        text: 'Ты садишься на лавку и вытягиваешь ноги к огню. Десять минут тебя никто ни о чём не просит.', effects: [set21('fr', 'sit'), { body: 'stress', delta: -2 }, until21(20, 18, 0)] },
    ] }),

  // ───────────── B до ужина ─────────────
  F({ id: 'c21_f_b_eva', title: 'Эва', camp: kitchen14,
    text: [
      { when: all(evaHere, flag('w.c20_girl_attic')), text: 'Эва с утра лежит под крышей, отдельно от всех. Ты поднимаешься к ней с кружкой. Она сидит на диване одетая, в платке, со сложенным одеялом на коленях. Жара у неё нет.\n\n— Ich bin gesund. Ich habe gewartet, bis einer kommt und es sagt.\n\nЯ здорова. Я ждала, пока кто-нибудь придёт и скажет это.' },
      { when: all(evaHere, not(flag('w.c20_girl_attic'))), text: 'Эва на кухне чистит картошку на ужин. Нож у неё ходит быстро, кожура падает одной длинной лентой.\n\n— Mein Mann hat immer abgetrocknet, — говорит она, не поднимая головы. Муж всегда вытирал посуду. — Ich weiß gar nicht, wohin jetzt mit dem Handtuch.\n\nЯ теперь и не знаю, куда девать полотенце.' },
      { when: not(evaHere), text: 'На кухне пусто. Картошка на ужин не чищена, вода для посуды остыла. В доме, где утром было шумно, слышно, как тикают часы.' },
    ],
    actions: [
      { id: 'c21_fv_down', label: 'Сказать: спускайтесь. Вы здоровы, и вы нужны внизу', when: all(evaHere, flag('w.c20_girl_attic')), minutes: 15, terminal: true, goto: 'c21_f_b_ute',
        text: 'Эва встаёт сразу, как будто только этого слова и ждала. Одеяло она несёт вниз сама. На кухне она первым делом переставляет кастрюли так, как стояли у неё дома.', effects: [set21('fv', 'down'), npc('c8_eva', 3), until21(20, 16, 50)] },
      { id: 'c21_fv_towel', label: 'Взять у неё полотенце', when: all(evaHere, not(flag('w.c20_girl_attic'))), minutes: 25, terminal: true, goto: 'c21_f_b_ute',
        text: 'Ты вытираешь, она моет. Двадцать минут вы не говорите ни слова. Потом она ставит перед тобой последнюю тарелку и говорит: «So». Вот так.', effects: [set21('fv', 'towel'), npc('c8_eva', 2), until21(20, 16, 50)] },
      { id: 'c21_fv_helmut', label: 'Спросить её про мужа', when: all(evaHere, not(flag('w.c20_girl_attic'))), minutes: 20, terminal: true, goto: 'c21_f_b_ute',
        text: '— Helmut hat Uhren repariert, — говорит Эва. Хельмут чинил часы. — Er hätte eure Küchenuhr längst gestellt. Die geht vier Minuten nach.\n\nОн бы давно поправил ваши кухонные часы. Они отстают на четыре минуты.\n\nТы смотришь на часы Хенрике. Потом на свой телефон. Четыре минуты.', effects: [set21('fv', 'helmut'), set21('clock_slow', true), npc('c8_eva', 2), until21(20, 16, 50)] },
      { id: 'c21_fv_cook', label: 'Начистить картошки и поставить воду', when: not(evaHere), minutes: 30, activity: 'light', terminal: true, goto: 'c21_f_b_ute',
        text: 'Ты чистишь на всех. Нина спускается на звук и молча берёт второй нож.', effects: [set21('fv', 'cook'), npc('c7_nina', 1), until21(20, 16, 50)] },
      { id: 'c21_fv_leave', label: 'Оставить всё как есть и пойти к себе', minutes: 10, terminal: true, goto: 'c21_f_b_ute',
        text: 'Ты поднимаешься в свою комнату и садишься на кровать. Руки у тебя всё ещё пахнут порохом, хотя ты не стреляла.', effects: [set21('fv', 'leave'), until21(20, 16, 50)] },
    ] }),

  F({ id: 'c21_f_b_ute', title: 'Уте', camp: yard14, ambient: dusk21,
    text: [
      { text: 'У калитки стоит Уте. Без фонаря, в двух платках, с узелком.\n\n— Für das Mädchen. — Для девочки.\n\nВ узелке серые варежки с красной полоской, ещё тёплые от её рук.' },
      { text: '— Auf den Gleisen gehen sie. Alle Richtung Feuer. Kai wäre auch gegangen. Er ist immer hingegangen, wo es laut war.\n\nОни идут по рельсам. Все на огонь. Кай тоже пошёл бы. Он всегда шёл туда, где шумно.' },
    ],
    actions: [
      { id: 'c21_fu_tea', label: 'Позвать её на кухню, к печи', minutes: 30, terminal: true, goto: 'c21_f_b_wash',
        text: 'Уте пьёт чай, не снимая платков. Про среду она не говорит. Говорит про Яннеса: он хотел учиться на электрика, место было в Винзене, с января.\n\n— Fragt ihn mal nach eurer Pumpe. Er traut sich nicht, es anzubieten.\n\nСпросите его про ваш насос. Сам он предложить стесняется.', effects: [set21('fu', 'tea'), set21('jannes_pump', true), npc('c14_ute', 2), until21(20, 17, 30)] },
      { id: 'c21_fu_kai', label: 'Спросить, где теперь Кай', minutes: 15, terminal: true, goto: 'c21_f_b_wash',
        text: '— In der Grube hinter dem Gewächshaus. Mit den anderen sechs. Die Soldaten haben Kalk draufgetan.\n\nВ яме за теплицей. С остальными шестью. Солдаты засыпали известью.\n\nОна поправляет платок.\n\n— Ich will ihn da rausholen. Wenn der Boden noch nicht gefroren ist. Allein schaffe ich es nicht.\n\nЯ хочу его оттуда забрать. Пока земля не замёрзла. Одной мне не справиться.', effects: [set21('fu', 'kai'), w21('ute_grave', true), npc('c14_ute', 2), until21(20, 17, 30)] },
      { id: 'c21_fu_eggs', label: 'Вынести ей два яйца из кладовки', when: { stocked: 'eggs', qty: 2, at: 'c3_farm_stock' }, minutes: 10, terminal: true, goto: 'c21_f_b_wash',
        text: 'Уте берёт яйца в обе ладони, как берут птенцов.\n\n— Eins für Jannes, — говорит она. — Eins lege ich ihm hin.\n\nОдно Яннесу. Одно я положу ему.\n\nКому «ему», ты не спрашиваешь.', effects: [set21('fu', 'eggs'), { unstock: 'eggs', qty: 2, at: 'c3_farm_stock' }, { take: 'eggs', qty: 2 }, npc('c14_ute', 3), until21(20, 17, 30)] },
      { id: 'c21_fu_thanks', label: 'Поблагодарить и отнести варежки Нине', minutes: 10, terminal: true, goto: 'c21_f_b_wash',
        text: 'Нина надевает варежки сразу, в доме, и ходит в них до ужина. Красная полоска у неё на запястьях, как браслеты.', effects: [set21('fu', 'thanks'), npc('c7_nina', 1), until21(20, 17, 30)] },
    ] }),

  F({ id: 'c21_f_b_wash', title: 'Крыльцо', camp: yard14, ambient: dusk21,
    text: [
      { when: not(fromLue), text: 'На ступенях заднего крыльца тёмные пятна. Днём здесь стреляли. Завтра это увидит Нина, когда пойдёт к курам.' },
      { when: fromLue, text: 'На заднем крыльце стоят Нинины резиновые сапоги, вымытые и поставленные носками к стене. Рядом лежит кочерга. Она просидела здесь с ней весь день.' },
    ],
    actions: [
      { id: 'c21_fw_scrub', label: 'Отмыть ступени, пока не стемнело совсем', when: not(fromLue), minutes: 25, activity: 'moderate', terminal: true, goto: 'c21_f_supper', ambientDuring: dusk21,
        text: 'Щётка, ведро, зола из печи. Вода в ведре становится бурой с первого раза. С третьего доски только мокрые. Руки ломит от холода.', effects: [set21('fw', 'scrub'), { body: 'stress', delta: -1 }, until21(20, 18, 0)] },
      { id: 'c21_fw_check', label: 'Ещё раз осмотреть всех, кто был во дворе', when: not(fromLue), minutes: 25, terminal: true, goto: 'c21_f_supper',
        text: 'Руки, шеи, щиколотки, при лампе, по одному. Нина закатывает рукава сама, не дожидаясь. Ссадины, синяк, заноза. Ни одного укуса. Ты проверяешь и себя, перед зеркалом в сенях.', effects: [set21('fw', 'check'), { body: 'stress', delta: -2 }, until21(20, 18, 0)] },
      { id: 'c21_fw_poker', label: 'Отнести кочергу на место и сказать Нине спасибо', when: fromLue, minutes: 15, terminal: true, goto: 'c21_f_supper',
        text: '— Я не боялась, — говорит Нина. — Я считала. Они ушли на счёте четыре тысячи двести.\n\nКочергу она забирает у тебя и вешает на крюк у печи сама.', effects: [set21('fw', 'poker'), npc('c7_nina', 2), until21(20, 18, 0)] },
      { id: 'c21_fw_sit', label: 'Сесть на ступеньку и подышать', minutes: 15, terminal: true, goto: 'c21_f_supper', ambientDuring: dusk21,
        text: 'Холод лезет сквозь джинсы. Над лесом на востоке стоит рыжее зарево, и на его фоне видно, как летят птицы. Прочь оттуда.', effects: [set21('fw', 'sit'), until21(20, 18, 0)] },
    ] }),

  // ───────────── Вместе: ужин, Кёлер, фонарь ─────────────
  F({ id: 'c21_f_supper', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужинают в шесть, при одной лампе. Картошка в мундире, лук, поджаренный дочерна, чай.' },
      { text: 'За столом говорят тихо, как в доме, где кто-то спит. Никто не спит. Нина дважды встаёт проверить засов.' },
    ],
    actions: [
      { id: 'c21_fs_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, goto: 'c21_f_news', ...tableOnly,
        text: 'Ты ешь медленно. Картошка обжигает пальцы, и это почему-то приятно.', effects: [set21('fs', 'eat'), meal('eat'), until21(20, 18, 25)] },
      { id: 'c21_fs_pack', label: 'Отложить свою порцию на ночь', minutes: 5, terminal: true, goto: 'c21_f_news', ...tableOnly,
        text: 'Ты накрываешь тарелку другой тарелкой и ставишь на холодный подоконник.', effects: [set21('fs', 'pack'), meal('pack'), until21(20, 18, 25)] },
      { id: 'c21_fs_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c21_f_news',
        text: 'Ты пьёшь чай и слушаешь, как стучат ложки.', effects: [set21('fs', 'tea'), { body: 'thirst', delta: -10 }, until21(20, 18, 25)] },
    ] }),

  F({ id: 'c21_f_news', title: 'Кёлер у ворот', camp: yard14, ambient: night21,
    text: [
      { text: 'После ужина в ворота стучат: три раза, пауза, ещё раз. Кёлер. Фонарь у неё спрятан под фартуком, под мышкой буханка.' },
      { text: '— Brandt ist mit zwei Treckern zur Autobahn. Alle Männer mit. Im Dorf sind nur Frauen und der Pastor.\n\nБрандт уехал к автобану с двумя тракторами. Все мужчины с ним. В деревне остались женщины и пастор.' },
      { text: 'Хлеб она отдаёт через калитку и не уходит.\n\n— Wenn heute Nacht einer an eure Tür klopft. Einer von der Kolonne. Macht ihr auf?\n\nЕсли сегодня ночью к вам постучат. Кто-то с колонны. Вы откроете?' },
    ],
    actions: [
      { id: 'c21_fn_yes', label: 'Сказать: откроем', minutes: 10, terminal: true, goto: 'c21_f_light',
        text: '— Ich auch, — говорит Кёлер. Я тоже. — Werner hätte aufgemacht. Der hat jedem aufgemacht.\n\nВернер бы открыл. Он всем открывал.\n\nОна уходит в темноту, прикрыв фонарь ладонью.', effects: [set21('fn', 'yes'), npc('c3_koehler', 2), { if: A21, then: [{ place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }] }, until21(20, 18, 40)] },
      { id: 'c21_fn_depends', label: 'Сказать: смотря кому', minutes: 10, terminal: true, goto: 'c21_f_light',
        text: '— Das sagt man immer vorher, — говорит Кёлер. Так всегда говорят заранее. — Und dann steht da ein Kind.\n\nА потом там стоит ребёнок.\n\nОна поправляет фонарь под фартуком и уходит.', effects: [set21('fn', 'depends'), { if: A21, then: [{ place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }] }, until21(20, 18, 40)] },
      { id: 'c21_fn_stay', label: 'Позвать её ночевать: одной в пекарне страшно', minutes: 10, terminal: true, goto: 'c21_f_light',
        text: 'Кёлер качает головой.\n\n— Der Teig geht über Nacht. Wenn ich nicht da bin, backt morgen keiner.\n\nТесто подходит ночью. Не будет меня — утром никто не испечёт.\n\nНо у калитки она стоит ещё минуту. Уходить ей не хочется.', effects: [set21('fn', 'stay'), npc('c3_koehler', 1), { if: A21, then: [{ place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }] }, until21(20, 18, 40)] },
    ] }),

  F({ id: 'c21_f_light', title: 'Фонарь на дороге', camp: tense14, safe: false,
    text: [
      { text: 'Без четверти семь Нина зовёт с лестницы. Шёпотом, но слышно на весь дом.\n\n— Там свет. На дороге.' },
      { text: 'На просёлке, метрах в трёхстах от ворот, мигает фонарь. Три коротких, пауза. Три коротких. Те, из больницы, так не ходят. Так зовут.' },
      { when: dog, text: 'Бруно стоит у двери и не лает. Он слушает.' },
      { text: 'Когда луч качается, в нём видно троих. Двое идут. Третьего несут.' },
    ],
    actions: [
      { id: 'c21_fl_out', label: 'Взять фонарь и выйти им навстречу', when: A21, minutes: 5, terminal: true, outcomes: afterLight, ambientDuring: night21,
        text: 'Ты идёшь по просёлку и светишь себе под ноги, чтобы они видели, откуда ты.', effects: [set21('fl', 'out'), until21(20, 18, 55)] },
      { id: 'c21_fl_gun', label: 'Взять ружьё и выйти', when: all(A21, gunHand), minutes: 5, terminal: true, outcomes: afterLight, ambientDuring: night21,
        text: 'Ружьё ты несёшь стволами вниз. Заряжен правый.', effects: [set21('fl', 'gun'), set21('armed', true), until21(20, 18, 55)] },
      { id: 'c21_fl_call', label: 'Окликнуть от ворот: пусть подойдут сами', when: A21, minutes: 10, terminal: true, outcomes: afterLight, ambientDuring: night21,
        text: '— Wer da? — кричишь ты. Кто там?\n\n— Kolonne! Verwundeter! — отвечают с дороги. Колонна! Раненый!\n\nОни подходят сами, медленно. Дважды останавливаются и ставят ношу на землю.', effects: [set21('fl', 'call'), until21(20, 19, 0)] },
      { id: 'c21_fl_water', label: 'Поставить воду и освободить кухонный стол', when: B21, minutes: 10, terminal: true, outcomes: afterLight,
        text: 'Ты сдвигаешь тарелки, стелешь чистую клеёнку и ставишь выварку на самую горячую конфорку. Что бы там ни несли, понадобится кипяток.', effects: [set21('fl', 'water'), set21('table_ready', true), until21(20, 18, 55)] },
      { id: 'c21_fl_kids', label: 'Отправить Нину наверх', when: B21, minutes: 5, terminal: true, outcomes: afterLight,
        text: '— Я не маленькая, — говорит Нина. Но идёт. На верхней ступеньке она садится так, чтобы видеть кухню между балясинами.', effects: [set21('fl', 'kids'), until21(20, 18, 55)] },
      { id: 'c21_fl_porch', label: 'Выйти на крыльцо с лампой, чтобы им было куда идти', when: B21, minutes: 10, terminal: true, outcomes: afterLight, ambientDuring: night21,
        text: 'Ты стоишь на крыльце и держишь лампу над головой. Фонарь на дороге перестаёт мигать и начинает приближаться.', effects: [set21('fl', 'porch'), until21(20, 18, 55)] },
    ] }),

  // ───────────── A: дорога и двор ─────────────
  F({ id: 'c21_f_a_lane', title: 'Трое', camp: tense14, safe: false, ambient: night21, onEnter: guestsHome,
    text: [
      { text: 'Девушка в армейской парке, с повязкой Красного Креста и синей сумкой через плечо. Молодой солдат без каски, автомат за спиной. Между ними на снятой с петель двери лежит человек с ногой, примотанной к доске.' },
      { text: '— Nicht schießen, — говорит солдат раньше, чем ты открываешь рот. Не стреляйте. — Wir sind von der Kolonne. Seit Mittag unterwegs.\n\nМы с колонны. Идём с полудня.' },
      { when: flag('$.c21_armed'), text: 'Он смотрит на ружьё, потом тебе в лицо, и медленно убирает руку с ремня автомата.' },
      { text: 'Человек на двери поворачивает голову.\n\n— Malte. Ich bin der Fahrer. Und mir ist kalt.\n\nМальте. Я шофёр. И мне холодно.' },
    ],
    actions: [
      { id: 'c21_fa_take', label: 'Взяться за дверь вместо девушки', minutes: 15, activity: 'heavy', terminal: true, goto: 'c21_f_a_dirk',
        text: 'Свой край она отдаёт не сразу: пальцы у неё свело. Дверь дубовая, с латунной ручкой. Ты несёшь и думаешь, с какого дома они её сняли.', effects: [set21('fa', 'take'), lea(2), malte(1), { body: 'fatigue', delta: 5 }, until21(20, 19, 20)] },
      { id: 'c21_fa_stretcher', label: 'Сбегать за носилками', when: flag('w.c20_stretcher'), minutes: 15, activity: 'moderate', terminal: true, goto: 'c21_f_a_dirk',
        text: 'Две жерди и мешки из-под картошки. Мальте перекладывают втроём. На носилках он в первый раз за вечер перестаёт стонать. Дверь остаётся на обочине, ручкой вверх.', effects: [set21('fa', 'stretcher'), malte(2), lea(1), until21(20, 19, 20)] },
      { id: 'c21_fa_why', label: 'Спросить, почему они шли сюда, а не в деревню', minutes: 20, activity: 'moderate', terminal: true, goto: 'c21_f_a_dirk',
        text: '— Weil hier Licht war, — говорит солдат. Потому что здесь был свет.\n\nДевушка смотрит в сторону.\n\n— Und weil sie gesagt hat: nicht ins Dorf. Sie ist Sanitäterin. Die wird schon wissen, warum.\n\nИ потому что она сказала: только не в деревню. Она санитарка. Ей виднее.\n\nПотом ты берёшься за свободный угол двери.', effects: [set21('fa', 'why'), set21('lea_doubt', true), { body: 'fatigue', delta: 3 }, until21(20, 19, 25)] },
    ] }),

  F({ id: 'c21_f_a_dirk', title: 'Ефрейтор', camp: tense14, safe: false, ambient: night21, onEnter: [{ set: '$.met.c21_dirk', value: true }, set21('lea_known', true)],
    text: [
      { text: 'Мальте вносят на кухню. Девушка идёт за ним и не оглядывается. Солдат остаётся на крыльце.' },
      { text: '— Gefreiter Sommer. Dirk, — говорит он и протягивает руку, как на построении. — Ich muss weiter. Nach Jesteburg, zur Wache. Ich muss melden, wo die Spenderin ist.\n\nЕфрейтор Зоммер. Дирк. Мне надо дальше. В Йестебург, в караулку. Я должен доложить, где донор.' },
      { text: 'Он понижает голос.\n\n— Die da drin ist keine Sanitäterin. Das ist Hartmann. Die, wegen der wir gefahren sind. Sie hat dem toten Sani die Jacke ausgezogen und ist mit uns mit. Ich hab so getan, als merke ich nichts.\n\nТа, что в доме, не санитарка. Это Хартман. Та, из-за которой мы ехали. Она сняла куртку с мёртвого санитара и пошла с нами. Я делал вид, что не замечаю.' },
      { text: 'Он качается на ногах. Под глазами у него чёрное.' },
    ],
    actions: [
      { id: 'c21_fk_sleep', label: 'Сказать: ты спишь стоя. Ляг в сарае до утра', minutes: 10, terminal: true, goto: 'c21_f_a_mother',
        text: 'Он спорит ровно столько, сколько нужно, чтобы не было стыдно. Потом идёт за тобой в сарай, ложится на солому в ботинках и засыпает раньше, чем ты закрываешь дверь. Автомат он кладёт под себя.', effects: [set21('fk', 'sleep'), w21('dirk', 'slept'), until21(20, 19, 40)] },
      { id: 'c21_fk_wait', label: 'Попросить: доложи утром. Дай ей одну ночь', minutes: 10, terminal: true, goto: 'c21_f_a_mother',
        text: '— Eine Nacht, — повторяет он. Одну ночь.\n\nОн смотрит в окно кухни, где девушка уже режет на Мальте штанину.\n\n— Sie hat ihm das Bein gerichtet. Mit einem Türblatt und ihrem Gürtel. Gut. Morgen früh.\n\nОна вправила ему ногу. Дверью и своим ремнём. Ладно. Утром.', effects: [set21('fk', 'wait'), w21('dirk', 'slept'), w21('dirk_promised', true), until21(20, 19, 40)] },
      { id: 'c21_fk_needle', label: 'Спросить, что с ней сделают, когда он доложит', minutes: 10, terminal: true, goto: 'c21_f_a_mother',
        text: '— Lüneburg. An die Nadel. Jeden Tag ein halber Liter, bis sie umfällt. So war es bei dem vor ihr, in Hannover.\n\nЛюнебург. На иглу. Каждый день по пол-литра, пока не упадёт. Так было с тем, кто был до неё, в Ганновере.\n\nОн трёт лицо.\n\n— Ich melde es trotzdem. Aber erst morgen. Ich kann nicht mehr laufen.\n\nЯ всё равно доложу. Но утром. Идти я больше не могу.', effects: [set21('fk', 'needle'), w21('dirk', 'slept'), set21('needle_known', true), until21(20, 19, 40)] },
      { id: 'c21_fk_go', label: 'Показать ему дорогу на Йестебург', minutes: 10, terminal: true, goto: 'c21_f_a_mother',
        text: 'Просёлок, почтовый ящик, налево по шоссе. Он повторяет вслух и уходит. Его фонарь ещё долго качается на дороге. К полуночи в Йестебурге будут знать, где она.', effects: [set21('fk', 'go'), w21('dirk', 'reported'), until21(20, 19, 40)] },
    ] }),

  F({ id: 'c21_f_a_mother', title: 'Ещё двое', camp: tense14, safe: false, ambient: night21,
    text: [
      { text: 'Ты идёшь от сарая и слышишь с дороги голос. Женский, высокий:\n\n— Hallo? Ist da jemand? Bitte!' },
      { text: 'У ворот стоит женщина с ребёнком на руках. Ребёнку года три, он спит, уткнувшись ей в шею. На ней офисные туфли. Одна без каблука.' },
      { text: '— Unser Auto steht auf der A7. Seit gestern. Mein Mann ist Hilfe holen gegangen.\n\nНаша машина стоит на A7. Со вчерашнего дня. Муж ушёл за помощью.\n\nКогда он ушёл, она не договаривает.' },
    ],
    actions: [
      { id: 'c21_fm_water', label: 'Вынести воды и показать дорогу на Йестебург', minutes: 15, terminal: true, goto: 'c21_f_a_fence',
        text: 'Она пьёт, потом поит ребёнка, не будя. Ты объясняешь: четыре километра, пожарная часть, там свет и суп. Она повторяет «Feuerwehr» и идёт. Туфлю без каблука она несёт в руке.', effects: [set21('fm', 'water'), w21('a_mother', 'fed'), until21(20, 20, 0)] },
      { id: 'c21_fm_in', label: 'Впустить на ночь: в сарае есть солома', minutes: 15, terminal: true, goto: 'c21_f_a_fence',
        text: 'Она входит боком, прикрывая ребёнку голову ладонью, как входят в чужую церковь. В сарае садится на солому в дальнем углу и не ложится.\n\n— Ich heiße Katrin. Das ist Emil.', effects: [set21('fm', 'in'), w21('a_mother', 'in'), until21(20, 20, 0)] },
      { id: 'c21_fm_no', label: 'Сказать: у нас самих раненый. Идите в деревню', minutes: 5, terminal: true, goto: 'c21_f_a_fence',
        text: 'Она кивает сразу, будто другого и не ждала.\n\n— Welche Richtung?\n\nВ какую сторону?\n\nТы показываешь. Она уходит без воды. Ребёнок так и не просыпается.', effects: [set21('fm', 'no'), w21('a_mother', 'no'), { body: 'stress', delta: 2 }, until21(20, 19, 55)] },
    ] }),

  F({ id: 'c21_f_a_fence', title: 'Обход', camp: tense14, safe: false, ambient: night21,
    text: [
      { text: 'Ты обходишь изгородь с фонарём. Иней хрустит под ногами.' },
      { when: flag('w.c21_wire'), text: 'Проволока с банками натянута и молчит.' },
      { text: 'У задней калитки ты останавливаешься. По полю вдоль лесополосы движутся огни: два фонаря, за ними третий. Люди. Идут от автобана к Йестебургу и не сворачивают.' },
      { text: 'Потом ты замечаешь ещё одного. Без фонаря. Он идёт за ними шагах в ста, быстро и неровно. Он в белом.' },
    ],
    actions: [
      { id: 'c21_ff_shout', label: 'Крикнуть им через поле: сзади!', minutes: 10, terminal: true, goto: 'c21_f_a_kitchen',
        text: 'Ты кричишь во весь голос. Фонари останавливаются и разворачиваются. Тот, в белом, поворачивает на твой крик и идёт теперь через пашню, к тебе. Люди бегут. Ты запираешь калитку на оба засова.\n\nОн доходит до сетки и упирается в неё лбом. Он простоит так до утра.', effects: [set21('ff', 'shout'), w21('fence_guest', true), { body: 'stress', delta: 3 }, until21(20, 20, 15)] },
      { id: 'c21_ff_flash', label: 'Трижды посветить им в спину', minutes: 5, terminal: true, goto: 'c21_f_a_kitchen',
        text: 'Три вспышки. Один фонарь оборачивается, луч шарит по полю и находит белое. Они бегут. Тот идёт за ними так же, не быстрее и не медленнее. Они успеют. Ты гасишь фонарь, пока он не повернул на свет.', effects: [set21('ff', 'flash'), until21(20, 20, 15)] },
      { id: 'c21_ff_quiet', label: 'Не шуметь: свой двор дороже', minutes: 5, terminal: true, goto: 'c21_f_a_kitchen',
        text: 'Ты стоишь в темноте и смотришь, как расстояние между фонарями и белым сокращается. Потом их закрывает лесополоса. Ты слушаешь ещё минуту. Ничего.', effects: [set21('ff', 'quiet'), { body: 'stress', delta: 3 }, until21(20, 20, 15)] },
    ] }),

  F({ id: 'c21_f_a_kitchen', title: 'Кухня', camp: kitchen14,
    text: [
      { text: 'На кухне жарко и пахнет йодом. Мальте лежит на столе, штанина разрезана до бедра. Девушка моет руки в тазу, до локтей, долго, как моют перед операцией.' },
      { text: '— Du. Du bist stark. Halt ihn an den Schultern. Er wird sich wehren.\n\nТы. Ты сильный. Держи его за плечи. Он будет вырываться.' },
      { text: '{B} стоит у изголовья с лампой. Нина смотрит с лестницы сквозь балясины.' },
    ],
    actions: [
      { id: 'c21_fq_hold', label: 'Держать, как она сказала', minutes: 20, activity: 'moderate', terminal: true, goto: 'c21_f_late',
        text: 'Ты наваливаешься ему на плечи. Она считает до трёх и дёргает на «два». Мальте выгибается под твоими руками, как рыба. Потом затихает.\n\n— Danke, — говорит она тебе. И Мальте: — Brav.\n\nУмница.', effects: [set21('fq', 'hold'), lea(2), malte(1), until21(20, 20, 40)] },
      { id: 'c21_fq_talk', label: 'Держать и говорить с ним', minutes: 20, activity: 'moderate', terminal: true, goto: 'c21_f_late',
        text: 'Ты держишь и спрашиваешь, как зовут его детей. Яна и Мориц. На «Морице» она дёргает. Имя он договаривает сквозь вой. Потом лежит мокрый и повторяет оба имени, пока она мотает бинт.', effects: [set21('fq', 'talk'), malte(3), until21(20, 20, 40)] },
      { id: 'c21_fq_pill', label: 'Сначала дать ему таблетку и выждать', when: { has: 'ibuprofen' }, minutes: 25, terminal: true, goto: 'c21_f_late',
        text: 'Таблетка действует плохо. Но Мальте в неё верит. Когда девушка дёргает, он кричит вполсилы.\n\n— Placebo, — говорит она тебе тихо, одним углом рта. — Aber gut gemacht.\n\nПлацебо. Но ты правильно сделал.', effects: [set21('fq', 'pill'), { take: 'ibuprofen' }, malte(2), lea(1), until21(20, 20, 40)] },
    ] }),

  // ───────────── Кухня: тот, кто с Леей (B или спасающий) ─────────────
  F({ id: 'c21_f_b_table', title: 'Кухонный стол', camp: kitchen14, onEnter: guestsHome,
    text: [
      { text: 'Их вносят на кухню боком, вместе с дверью. На двери лежит человек с ногой, примотанной к доске. Следом идёт девушка в армейской парке, с повязкой Красного Креста и синей сумкой через плечо. Кухню она оглядывает за секунду: плита, стол, вода, свет.\n\n— Auf den Tisch. Kopf zum Fenster.\n\nНа стол. Головой к окну.' },
      { text: 'Она снимает парку, закатывает рукава свитера и первым делом ставит сумку на пол, в самый холодный угол, у двери в сени.\n\n— Wer von euch kann Blut sehen?\n\nКто из вас может смотреть на кровь?' },
    ],
    actions: [
      { id: 'c21_ft_me', label: 'Сказать: я', when: inKitchen, minutes: 5, terminal: true, goto: 'c21_f_b_set',
        text: '— Gut. Schere. Heißes Wasser. Und halt mir die Lampe.\n\nХорошо. Ножницы. Горячую воду. И держи мне лампу.\n\nОна говорит это, уже разрезая штанину.', effects: [set21('ft', 'me'), lea(2), until21(20, 19, 10)] },
      { id: 'c21_ft_strips', label: 'Сказать: я умею стягивать раны полосками', when: all(B21, strips), minutes: 5, terminal: true, goto: 'c21_f_b_set',
        text: 'Она поднимает голову.\n\n— Dann machst du den Arm. Ich mache das Bein.\n\nТогда рука твоя. Нога моя.\n\nНа предплечье у шофёра длинный порез от стекла. Ты сводишь края. Она один раз смотрит через плечо и ничего не поправляет.', effects: [set21('ft', 'strips'), lea(3, 'c21_strips'), until21(20, 19, 10)] },
      { id: 'c21_ft_eva', label: 'Позвать Эву: она умеет перевязывать', when: all(inKitchen, evaHere), minutes: 5, terminal: true, goto: 'c21_f_b_set',
        text: 'Эва входит, вытирая руки о фартук, и встаёт у стола так, будто стояла тут всегда. Девушка смотрит на её руки.\n\n— Sie haben das schon gemacht.\n\nВы это уже делали.\n\n— Einmal, — говорит Эва. Один раз.\n\nТы держишь лампу над ними обеими.', effects: [set21('ft', 'eva'), npc('c8_eva', 2), lea(1), until21(20, 19, 10)] },
    ] }),

  F({ id: 'c21_f_b_set', title: 'Рейка', camp: kitchen14,
    text: [
      { text: 'Голень она ощупывает двумя пальцами, как ощупывают лапу.\n\n— Geschlossen. Glück gehabt. Ich brauche etwas Gerades. So lang wie mein Arm.\n\nЗакрытый. Повезло. Мне нужно что-нибудь прямое. Длиной с мою руку.' },
      { text: 'Мальте смотрит в потолок и говорит без остановки: про Целле, про дом с зелёными ставнями, про то, что ехал слишком быстро.' },
      { text: 'Радио на подоконнике сквозь треск читает сводку: «…Kolonne bei Garlstorf geborgen. Eine Person wird vermisst…»\n\nКолонна у Гарльсторфа эвакуирована. Один человек числится пропавшим.\n\nДевушка на секунду перестаёт дышать. Потом дышит снова.' },
    ],
    actions: [
      { id: 'c21_fe_board', label: 'Принести гладильную доску Хенрике', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_bag',
        text: 'Доска узкая, обтянута вытертой фланелью. Девушка примеряет её к ноге.\n\n— Perfekt. Sag der Besitzerin, sie kriegt es in acht Wochen zurück.\n\nИдеально. Скажи хозяйке: через восемь недель получит обратно.\n\nОна впервые почти улыбается.', effects: [set21('fe', 'board'), w21('iron_board', true), lea(1), until21(20, 19, 35)] },
      { id: 'c21_fe_slat', label: 'Выломать рейку из ящика для картошки', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_bag',
        text: 'Рейка шершавая, пахнет землёй. Ты обматываешь её полотенцем, чтобы не тёрла. Девушка кивает.\n\n— Du denkst mit.\n\nТы соображаешь.', effects: [set21('fe', 'slat'), lea(2), until21(20, 19, 35)] },
      { id: 'c21_fe_radio', label: 'Выключить радио', when: inKitchen, minutes: 5, terminal: true, goto: 'c21_f_b_bag',
        text: 'Ты поворачиваешь ручку. Она поднимает на тебя глаза и сразу опускает. Прямое она находит сама, в углу у печи: кочерга.\n\n— Geht auch.\n\nТоже годится.', effects: [set21('fe', 'radio'), set21('saw_radio', true), lea(1), until21(20, 19, 35)] },
    ] }),

  F({ id: 'c21_f_b_bag', title: 'Синяя сумка', camp: kitchen14,
    text: [
      { text: 'Пока греется вода, она приседает у сумки, трогает крышку тыльной стороной ладони и смотрит на полоску с тремя окошками.\n\n— Wo ist es bei euch am kältesten?\n\nГде у вас холоднее всего?' },
      { text: 'Она откидывает крышку. Внутри четыре прозрачных пакета с жёлтой жидкостью и узкая коробка шприц-ручек. Лёд давно стал водой.' },
    ],
    actions: [
      { id: 'c21_fg_pantry', label: 'Отнести сумку в кладовку, на каменный пол', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_note',
        text: 'Она идёт за тобой, сама ставит сумку в тёмный угол и трогает стену ладонью.\n\n— Gut. Hier hält das Plasma fünf Tage.\n\nХорошо. Здесь плазма проживёт пять дней.', effects: [set21('fg', 'pantry'), set21('bag_known', true), lea(1), until21(20, 19, 50)] },
      { id: 'c21_fg_what', label: 'Спросить, откуда это у неё', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_note',
        text: '— Aus dem zweiten Laster. Die großen Kisten haben sie bewacht. Die kleine Tasche stand unter meinem Sitz.\n\nИз второго грузовика. Большие ящики охраняли. А маленькая сумка стояла у меня под сиденьем.\n\nОна закрывает крышку.\n\n— Plasma und Insulin. Ich wusste nicht, wem ich es geben soll. Also habe ich es getragen.\n\nПлазма и инсулин. Я не знала, кому отдать. Поэтому несла.', effects: [set21('fg', 'what'), set21('bag_known', true), until21(20, 19, 50)] },
      { id: 'c21_fg_merle', label: 'Сказать: у меня подруга на инсулине, за Эльбой', when: B21, minutes: 10, terminal: true, goto: 'c21_f_b_note',
        text: 'Она перестаёт считать пульс у шофёра.\n\n— Wie lange hat sie noch?\n\nСколько у неё осталось?\n\nТы считаешь вслух: десятого было на девять дней. Она считает тоже.\n\n— Dann ist es seit gestern knapp.\n\nТогда со вчерашнего дня у неё в обрез.\n\n«Возьми» она не говорит. Сумку относит в кладовку сама и ставит в самый дальний угол.', effects: [set21('fg', 'merle'), set21('bag_known', true), set21('told_merle', true), lea(1), { body: 'stress', delta: 2 }, until21(20, 19, 50)] },
    ] }),

  F({ id: 'c21_f_b_note', title: 'Записка в Целле', camp: kitchen14,
    text: [
      { text: 'Мальте ловит тебя за рукав.\n\n— Schreibst du was auf? Für meine Frau. Falls die mich Montag abholen und ich nicht nach Celle komme.\n\nЗапишешь кое-что? Для жены. На случай, если в понедельник меня заберут и до Целле я не доеду.' },
      { text: 'Он диктует адрес. Потом долго молчит.' },
    ],
    actions: [
      { id: 'c21_fo_write', label: 'Записать слово в слово', when: inKitchen, minutes: 15, terminal: true, goto: 'c21_f_b_id',
        text: '«Sag den Kindern, ich bin nicht zu schnell gefahren. Sag es ihnen trotzdem». Скажи детям, что я не гнал. Всё равно скажи.\n\nТы пишешь на обороте листка из Нининой тетради. Он складывает листок вчетверо и отдаёт тебе обратно.\n\n— Behalt du ihn. Ich verliere alles.\n\nПусть будет у тебя. Я всё теряю.', effects: [set21('fo', 'write'), w21('malte_note', true), { give: 'c21_malte_note' }, malte(3), until21(20, 20, 10)] },
      { id: 'c21_fo_self', label: 'Сказать: сам ей скажешь. Через восемь недель', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_id',
        text: '— Acht Wochen, — повторяет Мальте. Восемь недель.\n\nОн смеётся и сразу морщится.\n\n— Du bist wie meine Frau. Die lässt mich auch nie jammern.\n\nТы как моя жена. Она тоже не даёт мне поныть.', effects: [set21('fo', 'self'), malte(2), until21(20, 20, 10)] },
      { id: 'c21_fo_why', label: 'Спросить, почему его должны забрать', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_id',
        text: 'Мальте смотрит на девушку. Она стоит к вам спиной и точит ножницы о край кружки.\n\n— Weil einer schuld sein muss. Und der Reuter ist tot.\n\nПотому что кто-то должен быть виноват. А Ройтер мёртв.', effects: [set21('fo', 'why'), set21('malte_blame', true), malte(1), until21(20, 20, 10)] },
    ] }),

  F({ id: 'c21_f_b_id', title: 'Билет', camp: kitchen14, onEnter: [set21('lea_known', true)],
    text: [
      { when: pairUp, text: 'В восемь со двора возвращается {A}. Она ставит его к плечам Мальте, тебя с лампой к изголовью. Считает до трёх и дёргает на «два».' },
      { when: rescuer, text: 'Она ставит тебя к плечам Мальте. Считает до трёх и дёргает на «два». Он выгибается под твоими руками и затихает.' },
      { text: 'Потом она мотает бинт, туго, виток к витку.\n\n— Fertig. Der läuft wieder. In acht Wochen.\n\nГотово. Будет ходить. Через восемь недель.' },
      { text: 'Она тянется за паркой и роняет её. Из кармана на пол выпадает зелёная пластиковая карточка, лицом вверх. Фотография: та же девушка, с длинной светлой косой.\n\n«Hartmann, Lea. Tierärztliche Hochschule Hannover».' },
      { text: 'Она смотрит на карточку. Потом на тебя.' },
      { when: knowsLea, text: 'Лея. Замена для Оле. Та, которую сегодня ждали в Люнебурге.' },
    ],
    actions: [
      { id: 'c21_fi_give', label: 'Поднять и молча отдать ей', when: inKitchen, minutes: 5, terminal: true, goto: 'c21_f_b_nina',
        text: 'Она берёт карточку двумя пальцами и убирает не в карман, а в ботинок.\n\n— Danke. — И тише: — Ich nähe eigentlich Hunde.\n\nВообще-то я шью собак.', effects: [set21('fi', 'give'), lea(2), until21(20, 20, 45)] },
      { id: 'c21_fi_ask', label: 'Спросить: это тебя сегодня ждали в Люнебурге?', when: inKitchen, minutes: 5, terminal: true, goto: 'c21_f_b_nina',
        text: '— Ja. Und ich bin froh, dass der Laster umgekippt ist. Das ist das Schlimmste, was ich je gesagt habe.\n\nДа. И я рада, что грузовик перевернулся. Хуже этого я в жизни ничего не говорила.\n\nКарточку она забирает у тебя из пальцев.', effects: [set21('fi', 'ask'), set21('lea_glad', true), lea(1), until21(20, 20, 45)] },
      { id: 'c21_fi_keep', label: 'Положить карточку себе в карман', when: inKitchen, minutes: 5, terminal: true, goto: 'c21_f_b_nina',
        text: '— Gib sie mir.\n\nОтдай.\n\nТы не отдаёшь. Она стоит с протянутой рукой, потом опускает её.\n\n— Dann weißt du jetzt, wie ich heiße. Mehr nützt sie dir nicht.\n\nТогда ты теперь знаешь, как меня зовут. Больше от неё толку нет.', effects: [set21('fi', 'keep'), { give: 'c21_lea_id' }, lea(-2, 'c21_took_my_id'), until21(20, 20, 45)] },
    ] }),

  F({ id: 'c21_f_b_nina', title: 'Тетрадь', camp: kitchen14,
    text: [
      { text: 'Нина спускается с лестницы и встаёт в дверях кухни. В руках у неё тетрадь по биологии.\n\n— Sie sind Ärztin? — спрашивает она по-немецки. Вы врач?\n\n— Tierärztin. Fast, — говорит гостья. Ветеринар. Почти.\n\nНина открывает тетрадь на странице с клеткой и молча протягивает.' },
      { when: evaHere, text: 'Эва у плиты говорит тебе вполголоса, не оборачиваясь:\n\n— Die läuft weg. Heute Nacht oder morgen. Ich kenne den Blick.\n\nЭта сбежит. Сегодня ночью или завтра. Я знаю этот взгляд.' },
    ],
    actions: [
      { id: 'c21_fb_let', label: 'Оставить их вдвоём с тетрадью', when: inKitchen, minutes: 15, terminal: true, goto: 'c21_f_b_cousin',
        text: 'Через десять минут из кухни слышно, как гостья объясняет, чем митохондрия отличается от ядра, и что-то рисует на полях. Нина смеётся. В этом доме давно так не смеялись.', effects: [set21('fb', 'let'), npc('c7_nina', 2), lea(2), until21(20, 21, 5)] },
      { id: 'c21_fb_bed', label: 'Отправить Нину спать', when: inKitchen, minutes: 10, terminal: true, goto: 'c21_f_b_cousin',
        text: 'Нина уходит наверх, прижав тетрадь к груди. Гостья смотрит ей вслед.\n\n— Wie alt?\n\nСколько ей?\n\n— Fünfzehn.\n\n— Und ihre Eltern?\n\nА родители?\n\nТы качаешь головой. Больше она не спрашивает.', effects: [set21('fb', 'bed'), lea(1), until21(20, 21, 5)] },
      { id: 'c21_fb_eva', label: 'Спросить Эву, что это за взгляд', when: all(inKitchen, evaHere), minutes: 10, terminal: true, goto: 'c21_f_b_cousin',
        text: '— So hat mein Mann geguckt, bevor er zum Brunnen ging, — говорит Эва. Так смотрел мой муж, прежде чем пошёл к колодцу. — Als hätte er schon etwas beschlossen.\n\nБудто уже что-то решил.\n\nОна вытирает руки и больше об этом не говорит.', effects: [set21('fb', 'eva'), set21('eva_warned', true), npc('c8_eva', 1), until21(20, 21, 5)] },
    ] }),

  F({ id: 'c21_f_b_cousin', title: 'Кузина', camp: kitchen14,
    text: [
      { text: 'Гостья стоит у окна кухни и смотрит на дорогу. Далеко по дороге ползут фары, с остановками у каждого двора.' },
      { text: '— Wenn Soldaten kommen, — говорит она, не оборачиваясь, — bin ich deine Cousine. Aus Harburg. Geht das?\n\nЕсли придут солдаты, я твоя кузина. Из Харбурга. Можно?' },
    ],
    actions: [
      { id: 'c21_fc_yes', label: 'Сказать: можно', when: inKitchen, minutes: 5, terminal: true, outcomes: afterCousin,
        text: '— Wie heißt deine Cousine?\n\nКак зовут твою кузину?\n\nТы называешь первое имя, какое приходит в голову. Она повторяет его дважды, как пароль.', effects: [set21('fc', 'yes'), set21('cousin', true), lea(3, 'c21_cousin'), until21(20, 21, 15)] },
      { id: 'c21_fc_list', label: 'Сказать: у патруля список всех, кто живёт в доме', when: inKitchen, minutes: 5, terminal: true, outcomes: afterCousin,
        text: '— Dann stehe ich nicht drauf, — говорит она. Значит, меня в нём нет. — Zum ersten Mal bin ich froh, auf einer Liste nicht zu stehen.\n\nПервый раз в жизни я рада, что меня нет в списке.\n\nОт окна она отходит.', effects: [set21('fc', 'list'), lea(1), until21(20, 21, 15)] },
      { id: 'c21_fc_why', label: 'Спросить: от кого ты прячешься?', when: inKitchen, minutes: 5, terminal: true, outcomes: afterCousin,
        text: '— Von einer Nadel, — говорит она. От иглы. И, помолчав: — Und von etwas, das ich dir morgen sage. Wenn ich morgen noch hier bin.\n\nИ от того, что я скажу тебе завтра. Если завтра я ещё буду здесь.', effects: [set21('fc', 'why'), set21('lea_tomorrow', true), lea(1), until21(20, 21, 15)] },
    ] }),

  F({ id: 'c21_f_late', title: 'Чай в десять', camp: kitchen14,
    text: [
      { text: 'К десяти на кухне остаются все, кто не спит. Мальте дремлет на лавке у печи. Гостья сидит на табурете у двери, с кружкой, в парке, наброшенной на плечи.' },
      { text: 'Нина смотрит на неё через стол и спрашивает по-немецки, прямо, как умеют в пятнадцать:\n\n— Die suchen dich, oder? Mich haben sie auch gesucht. Am Anfang.\n\nТебя ищут, да? Меня тоже искали. Сначала.' },
      { text: 'На кухне становится слышно часы.' },
    ],
    actions: [
      { id: 'c21_ft_let', label: 'Не вмешиваться: пусть ответит сама', minutes: 15, terminal: true, goto: 'c21_h_room',
        text: '— Ja, — говорит гостья. Да. — Und was hast du gemacht?\n\nА ты что сделала?\n\n— Ich bin hiergeblieben, — говорит Нина. Я осталась здесь.\n\nГостья смотрит в кружку. Потом на вас обоих.', effects: [set21('fz', 'let'), set21('lea_known', true), npc('c7_nina', 1), until21(20, 21, 40)] },
      { id: 'c21_ft_stop', label: 'Остановить Нину: не сегодня', minutes: 10, terminal: true, goto: 'c21_h_room',
        text: '— Нина, — говоришь ты.\n\nНина пожимает плечами и утыкается в кружку. Гостья выдыхает. Но смотрит на Нину так, будто хотела ответить.', effects: [set21('fz', 'stop'), lea(1), until21(20, 21, 40)] },
      { id: 'c21_ft_answer', label: 'Ответить за гостью: здесь её никто искать не будет', minutes: 10, terminal: true, goto: 'c21_h_room',
        text: 'Ты говоришь это твёрже, чем чувствуешь. Гостья поднимает на тебя глаза.\n\n— Das kannst du nicht versprechen.\n\nЭтого ты обещать не можешь.\n\nНо плечи у неё опускаются.', effects: [set21('fz', 'answer'), set21('lea_known', true), lea(2, 'c21_spoke_for_me'), until21(20, 21, 40)] },
    ] }),
];
