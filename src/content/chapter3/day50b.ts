import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { S50, bite50, clean50, door50, fed50, ny50, rain50, set50, slip50, trip50, uke50, until50, w50 } from './point50';

// Участок 50, линия B. Дома — первое утро: фрау Ханзен и ящик её мужа (запертая находка: дата; подсказка — в той же сцене:
// отметка воды на косяке «16.2.1962» и «родился дважды, второй раз на крыше, когда пришла вода»), колония.
// Эппендорф: смена, чай у Вольтерс, ужин с «Dinner for One» по радио, вечер, пение, полночь (`w.c49_b_midnight`: в отделении
// с Вольтерс или на крыше с Мерле), утро; чемодан старика из восьмой (число; подсказка — в 49-й: калитка садового домика «214»),
// Мерле по КТ49 (`w.c49_merle`), Альстер в оттепель, Вольтерс о четвёртом или о весне.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S50({ ...scene, for: 'any', chapter: 'ch3' });
const hosp = (rest: false | 'sleep' = false) => ({ at: uke50, stock: 'c48_uke', rest });
const U = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: uke50, camp: scene.camp ?? hosp(), safe: true });
const ward = { tempC: 20, outdoor: false, wet: false };
const toFarm: Effect = { move: 'hof_luedemann' };
const back: Cond = v('w.c48_uke', 'back');
const spring: Cond = v('w.c48_uke', 'spring');
const merleHome: Cond = v('w.c49_merle', 'home');
const roof: Cond = not(v('w.c49_b_midnight', 'ward'));
const boxOpen: Effect[] = [set50('box', 'open'), w50('box', 'open')];
const caseOpen: Effect[] = [set50('case', 'open'), w50('case', 'open')];

export const day50BScenes: Scene[] = [
  // ═════════════ Дома: фрау Ханзен ═════════════
  X({ id: 'c50_nb_hansen', title: 'Ящик', location: 'c3_neighbor', camp: trip50('c3_neighbor'), ambient: ward,
    text: [
      { text: 'Фрау Ханзен машет тебе с крыльца ещё издали: зайди. В кухне у неё чисто и холодно, на столе — металлическая шкатулка с кодовым замком, четыре колёсика с цифрами.' },
      { text: '— Von meinem Mann. Da ist sein Brief drin, für nach ihm. Und die Bohnen. Ich weiß die Zahl nicht. Er hat sie mir nie gesagt, er hat gelacht: «Die weißt du doch».\n\nОт мужа. Там его письмо, на после него. И фасоль. Я не знаю числа. Он мне его так и не сказал, смеялся: «Ты же его знаешь».' },
      { text: 'Кухня старая. Над плитой табличка «Erbaut 1958». На косяке двери — карандашная черта на высоте колена и подпись «16.2.1962». На стене свадебная фотография, внизу «Mai 1965». На холодильнике газетная вырезка про снежную зиму семьдесят восьмого.' },
      { text: 'Фрау Ханзен вздыхает: — Er hat immer gesagt, er ist zweimal geboren. Einmal bei seiner Mutter. Und einmal auf dem Dach, als das Wasser kam.\n\nОн всегда говорил, что родился дважды. Раз у матери. И раз на крыше, когда пришла вода.' },
    ],
    actions: [
      { id: 'c50_nh_1958', label: 'Покрутить колёсики: 1958', minutes: 15, terminal: true, outcomes: [{ id: 'no', goto: 'c50_nb_box' }],
        text: 'Один, девять, пять, восемь. Тянешь крышку. Не поддаётся.', effects: [set50('try', '1958')] },
      { id: 'c50_nh_1962', label: 'Покрутить колёсики: 1962', minutes: 15, terminal: true, outcomes: [{ id: 'ok', goto: 'c50_nb_open' }],
        text: 'Один, девять, шесть, два. Щелчок. Крышка поднимается. Фрау Ханзен прижимает ладонь ко рту.', effects: [set50('try', '1962'), ...boxOpen] },
      { id: 'c50_nh_1965', label: 'Покрутить колёсики: 1965', minutes: 15, terminal: true, outcomes: [{ id: 'no', goto: 'c50_nb_box' }],
        text: 'Один, девять, шесть, пять. Тянешь крышку. Не поддаётся.', effects: [set50('try', '1965')] },
      { id: 'c50_nh_1978', label: 'Покрутить колёсики: 1978', minutes: 15, terminal: true, outcomes: [{ id: 'no', goto: 'c50_nb_box' }],
        text: 'Один, девять, семь, восемь. Тянешь крышку. Не поддаётся.', effects: [set50('try', '1978')] },
      { id: 'c50_nh_leave', label: 'Сказать, что не возьмёшься: вещь не твоя', minutes: 15, terminal: true, goto: 'c50_nb_colony',
        text: 'Фрау Ханзен кивает: понимает. Шкатулку она ставит обратно на полку, к фотографии. «Vielleicht fällt es mir noch ein». Может, ещё вспомню. И поит тебя чаем, как будто ничего не случилось.', effects: [set50('box', 'left'), w50('box', 'left'), ...fed50(10), ny50(10, 45)] },
    ] }),

  X({ id: 'c50_nb_box', title: 'Шкатулка', location: 'c3_neighbor', camp: trip50('c3_neighbor'), ambient: ward,
    text: [
      { text: 'Фрау Ханзен смотрит на шкатулку, на тебя, снова на шкатулку. Колёсиков четыре, цифр по десять. Наугад — до вечера и дольше.' },
    ],
    actions: [
      { id: 'c50_nbx_henrike', label: 'Сходить за Хенрике: она знала её мужа', minutes: 75, terminal: true, goto: 'c50_nb_colony', ambientDuring: rain50,
        text: 'Хенрике приходит в фартуке, смотрит на косяк двери и смеётся: «Die Flut! Er hat jedem davon erzählt. Jedem». Наводнение! Он всем про него рассказывал. Всем. Один, девять, шесть, два. Щелчок. Ты понимаешь, что ответ висел на косяке перед тобой. Утро ушло на это.', effects: [set50('box', 'henrike'), w50('box', 'open'), set50('box_late', true), ny50(11, 15)] },
      { id: 'c50_nbx_force', label: 'Поддеть замок отвёрткой', minutes: 30, terminal: true, goto: 'c50_nb_open', activity: 'moderate',
        text: 'Отвёртка, рывок. Замок выламывается с куском жести. Крышка отскакивает, конверт внутри надорван наискось, бумажный пакет с фасолью лопается, и половина рассыпается по полу. Фрау Ханзен молча собирает фасоль по зёрнышку.', effects: [set50('box', 'forced'), w50('box', 'forced'), ny50(10, 30)] },
      { id: 'c50_nbx_leave', label: 'Оставить: может, она вспомнит', minutes: 30, terminal: true, goto: 'c50_nb_colony',
        text: 'Ты ставишь шкатулку на полку. Фрау Ханзен говорит: «Er hätte gelacht». Он бы смеялся. И сама смеётся, немного. Потом наливает тебе чаю.', effects: [set50('box', 'left'), w50('box', 'left'), ...fed50(10), ny50(10, 30)] },
    ] }),

  X({ id: 'c50_nb_open', title: 'Письмо', location: 'c3_neighbor', camp: trip50('c3_neighbor'), ambient: ward,
    text: [
      { text: 'В шкатулке: конверт с надписью «Für Erna», бумажный пакет с фасолью, на пакете от руки «Stangenbohnen, eigene Saat», и медаль на выцветшей ленте: «Sturmflut 1962».' },
      { when: flag('$.c50_box_late'), text: 'Хенрике ушла домой, оставив вас вдвоём.' },
      { text: 'Фрау Ханзен держит конверт и не открывает. Говорит: глаза уже не те. Протягивает тебе.' },
    ],
    actions: [
      { id: 'c50_no_read', label: 'Прочитать ей письмо вслух', minutes: 45, terminal: true, goto: 'c50_nb_colony',
        text: 'Почерк крупный, буквы с наклоном. Письмо короткое. Про то, что на крыше в шестьдесят втором он думал только о ней, хотя тогда они не были знакомы. Про фасоль: сажать в мае, у южной стены. Фрау Ханзен слушает с закрытыми глазами. Последнюю строчку ты читаешь дважды: она попросила.', effects: [set50('no', 'read'), w50('hansen_letter', true), ny50(11, 30)] },
      { id: 'c50_no_seeds', label: 'Взять фасоль: она предлагает для вашего огорода', minutes: 45, terminal: true, goto: 'c50_nb_colony',
        text: 'Фрау Ханзен вкладывает пакет тебе в руки и загибает твои пальцы поверх. «Er wollte, dass die wächst. Bei mir wächst nichts mehr». Он хотел, чтобы она росла. У меня уже ничего не растёт. Пакет лёгкий и шуршит. Весной у южной стены сарая.', effects: [set50('no', 'seeds'), w50('seeds', 'farm'), ny50(11, 30)] },
      { id: 'c50_no_colony', label: 'Предложить отдать фасоль в колонию: там у всех грядки', minutes: 45, terminal: true, goto: 'c50_nb_colony',
        text: 'Фрау Ханзен думает и кивает: «Ja. Da sind Kinder». Да. Там дети. Пакет ты несёшь Уте по дороге домой. Уте развязывает, смотрит, нюхает: «Gute Bohnen». Хорошая фасоль. И прячет за пазуху, к сердцу.', effects: [set50('no', 'colony'), w50('seeds', 'colony'), ny50(11, 30)] },
    ] }),

  X({ id: 'c50_nb_colony', title: 'Колония', location: 'c15_garden', camp: trip50('c15_garden'), ambient: rain50,
    text: [
      { text: 'Обратно ты идёшь через колонию, вдоль насыпи. Тропа раскисла, по канаве несётся вода.' },
      { when: bite50, text: 'За крайними домиками двое копают в мокрой земле. Синяя шапка висит на колышке забора. Уте стоит рядом и держит лопату, не копая.' },
      { when: door50, text: 'На двери крайнего домика — царапины и грязные отпечатки ладоней до самой ручки. Хозяйка трёт их тряпкой и не может оттереть.' },
      { when: slip50, text: 'Яннес на крыльце, с зашитым рукавом, курит. Кивает тебе, как после смены.' },
      { when: clean50, text: 'У карьера поднимается дым: тех, ночных, жгут на старых шпалах. В колонии дети бегают по лужам.' },
    ],
    actions: [
      { id: 'c50_nco_help', label: 'Остановиться и помочь, чем можно', minutes: 30, terminal: true, goto: 'c50_ny_lunch', ambientDuring: rain50,
        text: 'Лопата, тряпка, вёдра — что нужно. Работаете молча. Кто-то говорит тебе «danke» и «frohes Neues» в одном предложении, и это не кажется странным.', effects: [set50('nco', 'help'), { body: 'fatigue', delta: 3 }, toFarm, ny50(12, 15)] },
      { id: 'c50_nco_ute', label: 'Обнять Уте', minutes: 30, terminal: true, goto: 'c50_ny_lunch', ambientDuring: rain50,
        text: 'Уте стоит неподвижно, потом обнимает в ответ, крепко, по-мужски. Говорит в плечо: «Frohes Neues». С Новым годом. Как ругательство. И как молитву.', effects: [set50('nco', 'ute'), toFarm, ny50(12, 15)] },
      { id: 'c50_nco_home', label: 'Идти домой, не задерживаясь', minutes: 30, terminal: true, goto: 'c50_ny_lunch', ambientDuring: rain50,
        text: 'Ты киваешь и идёшь дальше. До хутора доходишь мокрой до колен, с пакетом или без, с новостями или без.', effects: [set50('nco', 'home'), toFarm, ny50(12, 15)] },
    ] }),

  // ═════════════ Эппендорф ═════════════
  U({ id: 'c50_hb_shift', title: 'Последняя смена года', ambient: ward,
    text: [
      { text: 'Час дня, тридцать первое. Твои двенадцать коек, восьмая и девятая палаты. За окном дождь: оттепель пришла и в город.' },
      { text: 'Девочке из Харбурга в девятой лучше: сахар четырнадцать, пальцы на ногах розовые, кроме двух. Мать спит на стуле, впервые за двое суток.' },
    ],
    actions: [
      { id: 'c50_hs_girl', label: 'Посидеть с девочкой, пока мать спит', minutes: 150, terminal: true, goto: 'c50_hb_tea',
        text: 'Ей двенадцать, и она хочет стать ветеринаром. Ты рассказываешь ей про ветеринарный инсулин, на котором Мерле прожила месяц. Девочка слушает, как сказку про героиню. Мать просыпается и видит: дочь смеётся.', effects: [set50('hs', 'girl'), w50('b_girl_vet', true), until50(15, 30)] },
      { id: 'c50_hs_round', label: 'Обход по всем двенадцати койкам', minutes: 150, terminal: true, goto: 'c50_hb_tea',
        text: 'Сахар, давление, капельницы, просьбы. Старик в восьмой просит открыть окно: слушает дождь. Женщина на третьей — расчёску. Мужчина на пятой отдаёт тебе письмо сыну: «Mit der nächsten Kolonne». С ближайшей колонной.', effects: [set50('hs', 'round'), { body: 'fatigue', delta: 5 }, until50(15, 30)] },
      { id: 'c50_hs_old', label: 'Сначала к старику: у него сегодня перевязка', minutes: 150, terminal: true, goto: 'c50_hb_tea',
        text: 'Перевязка, чистая рана, сухой бинт. Старик говорит, что завтра попросит тебя кое о чём, «aber erst nächstes Jahr». Но только в следующем году. И подмигивает. До следующего года — одиннадцать часов.', effects: [set50('hs', 'old'), w50('b_old_hint', true), until50(15, 30)] },
    ] }),

  U({ id: 'c50_hb_tea', title: 'Чай у Вольтерс', ambient: ward,
    text: [
      { text: 'Вольтерс зовёт тебя в свою комнату: кровать, шкаф, плитка, на подоконнике кактус. Чай из пакетика на двоих.' },
      { text: '— Dreißig Jahre Silvester auf Station. Ich weiß gar nicht, wie man das anders macht.\n\nТридцать лет Сильвестр в отделении. Я даже не знаю, как это делают по-другому.' },
    ],
    actions: [
      { id: 'c50_ht_ask', label: 'Спросить, есть ли у неё кто-нибудь', minutes: 75, terminal: true, goto: 'c50_hb_dinner',
        text: 'Вольтерс смотрит на кактус. Была сестра в Киле. Связи с ноября нет. «Vielleicht steht sie auch irgendwo auf Station». Может, она тоже где-то в отделении. Вольтерс допивает чай и ставит чашку донышком вверх: так гадают. Не смотрит.', effects: [set50('ht', 'ask'), w50('b_wolters_sister', true), until50(16, 45)] },
      { id: 'c50_ht_home', label: 'Рассказать ей про хутор', minutes: 75, terminal: true, goto: 'c50_hb_dinner',
        text: 'Ты рассказываешь про Хенрике, про кур, про печку и колокол у реки. Вольтерс слушает, не перебивая. В конце говорит: «Da will man ja fast hin». Туда почти хочется. И усмехается своему «почти».', effects: [set50('ht', 'home'), until50(16, 45)] },
      { id: 'c50_ht_quiet', label: 'Молча пить чай: ей тоже нужна тишина', minutes: 75, terminal: true, goto: 'c50_hb_dinner',
        text: 'Вы пьёте молча. Дождь стучит в окно. Вольтерс закрывает глаза на минуту, на две, на пять. Ты не шевелишься, пока она не открывает их сама.', effects: [set50('ht', 'quiet'), { body: 'stress', delta: -5 }, until50(16, 45)] },
    ] }),

  U({ id: 'c50_hb_dinner', title: 'Dinner for One', ambient: ward,
    text: [
      { text: 'В столовой праздничный ужин: картофельный салат с сосисками, по чашке пунша без рома. На стене радио, и в шесть «Radio Hamburg», как каждый год, пускает «Dinner for One». Без картинки, только голоса.' },
      { text: '— The same procedure as last year, Miss Sophie? — The same procedure as every year, James!' },
      { text: 'Дворецкий спотыкается о тигра, и вся столовая хохочет: врачи, сёстры, больные в халатах. Мерле смеётся так, что проливает пунш.' },
    ],
    actions: [
      { id: 'c50_hd_eat', label: 'Ужинать и смеяться со всеми', minutes: 105, terminal: true, goto: 'c50_hb_evening',
        text: 'Ты знаешь каждую реплику наизусть и всё равно смеёшься. На тигре в четвёртый раз смеёшься до слёз. Ты думаешь: на хуторе, наверное, Хенрике сейчас пересказывает то же самое по памяти. Так и есть.', effects: [set50('hd', 'eat'), ...fed50(40), { body: 'stress', delta: -10 }, until50(18, 45)] },
      { id: 'c50_hd_merle', label: 'Сесть рядом с Мерле и считать с ней пунш в хлебных единицах', minutes: 105, terminal: true, goto: 'c50_hb_evening',
        text: 'Пунш на соке, полторы единицы на чашку. Мерле разрешает себе одну. Потом, на тигре, — вторую. «Silvester», — говорит она виновато. Сахар потом будет девять. Не страшно.', effects: [set50('hd', 'merle'), ...fed50(40), until50(18, 45)] },
      { id: 'c50_hd_serve', label: 'Разносить салат тем, кто не может встать', minutes: 105, terminal: true, goto: 'c50_hb_evening',
        text: 'Поднос, тарелки, палаты. Старик в восьмой слушает «Dinner for One» через открытую дверь и повторяет за дворецким: «Same procedure». Девочка из девятой не знает, что это. Ты объясняешь. Объяснить невозможно.', effects: [set50('hd', 'serve'), ...fed50(25), until50(18, 45)] },
    ] }),

  U({ id: 'c50_hb_evening', title: 'Вечер', ambient: ward,
    text: [
      { text: 'Вечер в отделении: свет приглушён, на посту свечка в банке, звёзды из бланков покачиваются от сквозняка. Кто-то в палатах уже спит, кто-то ждёт полночи.' },
    ],
    actions: [
      { id: 'c50_he_write', label: 'Написать {A.dat}: как проходит этот вечер', minutes: 120, terminal: true, goto: 'c50_hb_song',
        text: 'Ты пишешь про «Dinner for One» по радио и про то, что смеялась. Про тигра. Про Вольтерс и её кактус. Про то, как скучаешь, не пишешь: это и так видно по почерку.', effects: [set50('he', 'write'), w50('b_letter_ny', true), until50(20, 45)] },
      { id: 'c50_he_merle', label: 'Играть с Мерле в карты в её палате', minutes: 120, terminal: true, goto: 'c50_hb_song',
        text: 'Колода больничная, без двух карт. Мерле выигрывает шесть партий из семи и говорит, что у неё сахар ровный, а у ровного сахара голова ясная. Седьмую ты выигрываешь. Она уверяет, что поддалась.', effects: [set50('he', 'merle'), { body: 'stress', delta: -6 }, until50(20, 45)] },
      { id: 'c50_he_rest', label: 'Прилечь на два часа перед полночью', minutes: 120, terminal: true, goto: 'c50_hb_song', activity: 'rest',
        text: 'Раскладушка, одеяло, батарея. Ты засыпаешь сразу и просыпаешься от того, что в коридоре кто-то пробует губную гармошку. Без четверти девять.', effects: [set50('he', 'rest'), { body: 'fatigue', delta: -12 }, until50(20, 45)] },
    ] }),

  U({ id: 'c50_hb_song', title: 'Песня', ambient: ward,
    text: [
      { text: 'В девять в коридоре собираются: сёстры, врачи, больные на костылях и в креслах. Губная гармошка, гитара без одной струны. Поют всё подряд: шлягеры, детские песни, что-то из старого кино.' },
      { text: 'Вольтерс стоит у поста, не поёт, но притоптывает.' },
    ],
    actions: [
      { id: 'c50_hg_sing', label: 'Петь со всеми', minutes: 150, terminal: true, outcomes: [{ id: 'r', when: roof, goto: 'c50_hb_roof' }, { id: 'w', goto: 'c50_hb_ward' }],
        text: 'Слов половины песен ты не знаешь и поёшь «ла-ла-ла». Старик из восьмой поёт громче всех, мимо нот, и все ему прощают. На какой-то песне ты замечаешь, что поёшь по-немецки. Без запинки.', effects: [set50('hg', 'sing'), { body: 'stress', delta: -8 }, until50(23, 30)] },
      { id: 'c50_hg_russian', label: 'Спеть одну песню по-русски, когда попросят', minutes: 150, terminal: true, outcomes: [{ id: 'r', when: roof, goto: 'c50_hb_roof' }, { id: 'w', goto: 'c50_hb_ward' }],
        text: 'Тебя просят спеть «что-нибудь своё». Ты поёшь «В лесу родилась ёлочка», потому что только её и помнишь целиком. Никто не понимает слов. Хлопают дольше, чем остальным. Мерле переводит на ходу, сочиняя.', effects: [set50('hg', 'russian'), w50('b_sang', true), until50(23, 30)] },
      { id: 'c50_hg_ward', label: 'Ходить по палатам, пока все поют', minutes: 150, terminal: true, outcomes: [{ id: 'r', when: roof, goto: 'c50_hb_roof' }, { id: 'w', goto: 'c50_hb_ward' }],
        text: 'Кто-то должен быть в палатах. Ты меряешь сахар под пение из коридора, поправляешь одеяла, открываешь окна тем, кто просит. Песни доходят глуше, как через воду. Так даже лучше.', effects: [set50('hg', 'ward'), until50(23, 30)] },
    ] }),

  U({ id: 'c50_hb_roof', title: 'Крыша', ambient: { tempC: 2, outdoor: true, wet: true },
    text: [
      { text: 'Без двадцати двенадцать — крыша. Мокрый битум, ограждение, человек тридцать в куртках поверх халатов. Мерле держит тебя под руку: скользко.' },
      { text: 'Город внизу тёмный, с островами огней. Ни одной ракеты: запрещено. В полночь начинают звонить колокола. Сначала один, где-то у Альстера, потом второй, третий, все церкви Гамбурга. Звон катится по городу, как вода.' },
    ],
    actions: [
      { id: 'c50_hr_sparkler', label: 'Зажечь бенгальский огонь, повернувшись на юг', when: flag('w.c49_b_sparkler'), minutes: 60, terminal: true, goto: 'c50_hb_late', ambientDuring: { tempC: 2, outdoor: true, wet: true },
        text: 'Огонь шипит и брызжет под моросью. Ты держишь его на вытянутой руке, лицом на юг, туда, где за рекой, за Харбургом, за полями — хутор. Пока он горит, ты не думаешь ни о чём. Потом он гаснет, и ты всё равно стоишь.', effects: [set50('hr', 'sparkler'), w50('b_south', true), ny50(0, 40)] },
      { id: 'c50_hr_merle', label: 'Обнять Мерле под колокола', minutes: 60, terminal: true, goto: 'c50_hb_late', ambientDuring: { tempC: 2, outdoor: true, wet: true },
        text: 'Мерле плачет и смеётся одновременно. Говорит: «Letztes Jahr hab ich Silvester verschlafen. Allein. Mit Fieber». В прошлом году я проспала Сильвестр. Одна. С температурой. А в этом — крыша, колокола и ты.', effects: [set50('hr', 'merle'), ny50(0, 40)] },
      { id: 'c50_hr_city', label: 'Смотреть на город и считать колокола', minutes: 60, terminal: true, goto: 'c50_hb_late', ambientDuring: { tempC: 2, outdoor: true, wet: true },
        text: 'Ты насчитываешь одиннадцать колоколов, потом сбиваешься. Звонят с Альстера, с Санкт-Михаэлиса, откуда-то из Альтоны. Город, который ты {m:считал|считала} мёртвым, звонит во все колокола сразу.', effects: [set50('hr', 'city'), ny50(0, 40)] },
      { id: 'c50_hr_south', label: 'Смотреть на юг и сказать в темноту «с Новым годом»', minutes: 60, terminal: true, goto: 'c50_hb_late', ambientDuring: { tempC: 2, outdoor: true, wet: true },
        text: 'Ты говоришь это вслух, по-русски, на юг. Колокола заглушают слова. Это и неважно: кому надо, тот услышит. Ты в это не веришь, но говоришь ещё раз.', effects: [set50('hr', 'south'), w50('b_south', true), ny50(0, 40)] },
    ] }),

  U({ id: 'c50_hb_ward', title: 'Полночь в отделении', ambient: ward,
    text: [
      { text: 'Без пяти двенадцать в отделении только ты, Вольтерс и двенадцать коек. Все остальные на крыше. На посту свечка, на свечке — оплывший воск.' },
      { text: 'В полночь за окнами начинают звонить колокола: один, второй, все церкви Гамбурга. Вольтерс открывает окно в коридоре, и звон входит в отделение вместе с сыростью.' },
    ],
    actions: [
      { id: 'c50_hw_toast', label: 'Поднять с Вольтерс по чашке чая', minutes: 60, terminal: true, goto: 'c50_hb_late',
        text: 'Чай холодный, чашки разные. «Auf die Alten», — говорит Вольтерс. За старух. Вы чокаетесь. Старик в восьмой кричит из палаты: «Und auf die Jungen!» И за молодых! Он не спал.', effects: [set50('hw', 'toast'), w50('b_wolters_toast', true), ny50(0, 40)] },
      { id: 'c50_hw_rooms', label: 'Пройти по палатам и сказать каждому «с Новым годом»', minutes: 60, terminal: true, goto: 'c50_hb_late',
        text: 'Двенадцать коек, двенадцать «Frohes Neues». Кто-то спит, и ты говоришь шёпотом. Девочка из девятой не спит и говорит в ответ: «Ihnen auch, Schwester». И вам тоже, сестра.', effects: [set50('hw', 'rooms'), ny50(0, 40)] },
      { id: 'c50_hw_window', label: 'Встать у открытого окна, лицом на юг', minutes: 60, terminal: true, goto: 'c50_hb_late',
        text: 'Колокола над городом, морось в лицо. Где-то на юге, за рекой, тоже сейчас полночь. Ты стоишь, пока Вольтерс не трогает тебя за локоть: «Zu. Sonst erkälten sich die Patienten». Закрываем. А то больные простынут.', effects: [set50('hw', 'window'), w50('b_south', true), ny50(0, 40)] },
    ] }),

  U({ id: 'c50_hb_late', title: 'Первый час года', camp: hosp('sleep'), ambient: ward,
    text: [
      { text: 'Колокола затихают по одному. Отделение засыпает. В комнате сопровождающих храпят, на подоконнике стоит чья-то недопитая чашка пунша.' },
    ],
    actions: [
      { id: 'c50_hl_sleep', label: 'Спать', minutes: 30, terminal: true, goto: 'c50_hbn_dawn', activity: 'rest',
        text: 'Ты засыпаешь под дождь по карнизу. Первый сон года тебе не снится.', effects: [set50('hl', 'sleep'), ny50(8, 30, true)] },
      { id: 'c50_hl_merle', label: 'Проверить сахар Мерле перед сном', minutes: 30, terminal: true, goto: 'c50_hbn_dawn',
        text: 'Мерле спит, раскинув руки. Ты меряешь осторожно, не будя: восемь и четыре. После двух чашек пунша — подарок. Ты укрываешь её и идёшь спать.', effects: [set50('hl', 'merle'), ny50(8, 30, true)] },
      { id: 'c50_hl_window', label: 'Посидеть у окна, пока не захочется спать', minutes: 30, terminal: true, goto: 'c50_hbn_dawn',
        text: 'Огни Эппендорфа гаснут один за другим. Последний — в окне напротив, где кто-то тоже не спит. Вы смотрите друг на друга через улицу и машете. Потом там гаснет.', effects: [set50('hl', 'window'), ny50(8, 30, true)] },
    ] }),

  U({ id: 'c50_hbn_dawn', title: 'Первое января', ambient: ward,
    text: [
      { text: 'Первое января. Дождь на окнах, туман над крышами. Свет в коридоре включают, как будто ничего не случилось. И правда — ничего.' },
      { text: 'Старик из восьмой машет тебе из палаты: «Frau Schwester! Jetzt ist nächstes Jahr». Сестра! Теперь уже следующий год.' },
    ],
    actions: [
      { id: 'c50_hnd_go', label: 'Сразу к старику', minutes: 30, terminal: true, goto: 'c50_hbn_case',
        text: 'Ты идёшь, не дожидаясь завтрака. Старик сидит в кровати, причёсанный, как на праздник.', effects: [set50('hnd', 'go'), ny50(9, 0)] },
      { id: 'c50_hnd_merle', label: 'Сначала заглянуть к Мерле: какой сахар после пунша', minutes: 30, terminal: true, goto: 'c50_hbn_case',
        text: 'Мерле показывает цифру ещё до того, как ты спрашиваешь: семь и девять. «Trotz Punsch». Несмотря на пунш. И снова прячется под одеяло. Ты идёшь к старику.', effects: [set50('hnd', 'merle'), ny50(9, 0)] },
      { id: 'c50_hnd_eat', label: 'Сначала завтрак, потом к нему', minutes: 30, terminal: true, goto: 'c50_hbn_case',
        text: 'Булочка, кофе, джем. Повариха поздравляет каждого с Новым годом и кладёт лишнюю булочку. Ты несёшь вторую старику.', effects: [set50('hnd', 'eat'), ...fed50(35), ny50(9, 0)] },
    ] }),

  U({ id: 'c50_hbn_case', title: 'Чемодан', ambient: ward,
    text: [
      { text: 'Под кроватью у старика маленький коричневый чемодан с кодовым замком на три колёсика. Его собирала жена, ещё в ноябре, «на всякий случай». Код он знал. Потом был наркоз, и цифры ушли.' },
      { text: '— Da sind Gläser drin. Von meinem Baum. Für Sie, wenn Sie es aufkriegen.\n\nТам банки. С моего дерева. Для вас, если откроете.' },
    ],
    actions: [
      { id: 'c50_hc_214', label: 'Набрать 214', minutes: 15, terminal: true, outcomes: [{ id: 'ok', goto: 'c50_hbn_jars' }],
        text: 'Два, один, четыре. Замок щёлкает. Старик хлопает в ладоши, как ребёнок: «Der Garten! Natürlich, der Garten!» Сад! Ну конечно, сад!', effects: [set50('try', '214'), ...caseOpen] },
      { id: 'c50_hc_412', label: 'Набрать 412', minutes: 15, terminal: true, outcomes: [{ id: 'no', goto: 'c50_hbn_case2' }],
        text: 'Четыре, один, два. Замок не поддаётся.', effects: [set50('try', '412')] },
      { id: 'c50_hc_120', label: 'Набрать 120', minutes: 15, terminal: true, outcomes: [{ id: 'no', goto: 'c50_hbn_case2' }],
        text: 'Один, два, ноль. Замок не поддаётся.', effects: [set50('try', '120')] },
      { id: 'c50_hc_731', label: 'Набрать 731', minutes: 15, terminal: true, outcomes: [{ id: 'no', goto: 'c50_hbn_case2' }],
        text: 'Семь, три, один. Замок не поддаётся.', effects: [set50('try', '731')] },
    ] }),

  U({ id: 'c50_hbn_case2', title: 'Замок', ambient: ward,
    text: [
      { text: 'Старик огорчённо качает головой. Три колёсика, тысяча сочетаний.' },
    ],
    actions: [
      { id: 'c50_hc2_all', label: 'Перебирать по порядку, от 000', minutes: 90, terminal: true, goto: 'c50_hbn_jars',
        text: 'Ноль-ноль-ноль, ноль-ноль-один… Старик считает вслух вместе с тобой и засыпает на сто сорок. На двести четырнадцать замок щёлкает. Ты смотришь на фотографию на тумбочке: калитка, номер 214. Всё это время она стояла перед тобой.', effects: [set50('case', 'brute'), w50('case', 'open'), ny50(10, 45)] },
      { id: 'c50_hc2_force', label: 'Поддеть замок ножницами', minutes: 20, terminal: true, goto: 'c50_hbn_jars', activity: 'moderate',
        text: 'Ножницы, рывок. Замок выскакивает, крышка распахивается, и одна банка выкатывается на пол. Стекло трескается, по линолеуму ползёт густое, янтарное. Старик смотрит на лужу и говорит: «Na ja. Der Boden hat auch Silvester». Ну что ж. У пола тоже Сильвестр.', effects: [set50('case', 'forced'), w50('case', 'forced'), ny50(9, 35)] },
      { id: 'c50_hc2_leave', label: 'Оставить: может, вспомнит', minutes: 15, terminal: true, goto: 'c50_hbn_merle',
        text: 'Ты задвигаешь чемодан обратно под кровать. Старик говорит: «Vielleicht träume ich die Zahl». Может, число мне приснится. И просит открыть окно.', effects: [set50('case', 'left'), w50('case', 'left'), ny50(9, 30)] },
    ] }),

  U({ id: 'c50_hbn_jars', title: 'Боскоп', ambient: ward,
    text: [
      { text: 'В чемодане тапочки, пижама в клетку, пачка писем, перевязанная лентой, и банки с яблочным повидлом. На крышках почерком жены: «Boskoop 2026».' },
      { when: v('w.c50_case', 'forced'), text: 'Целой банка осталась одна.' },
      { text: '— Die eine für die Kleine von nebenan. Und die andere — Sie wissen schon.\n\nОдну — малышке из соседней палаты. А другую — вы сами знаете.' },
    ],
    actions: [
      { id: 'c50_hj_hanna', label: 'Отнести банку девочке в девятую, вторую — Мерле', when: not(v('w.c50_case', 'forced')), minutes: 45, terminal: true, goto: 'c50_hbn_merle',
        text: 'Девочка открывает банку и пробует пальцем, пока мать не видит. Мерле долго считает единицы, потом машет рукой и съедает ложку просто так. «Boskoop», — говорит она, как старик. Ты передаёшь ему: понравилось. Он светится до обеда.', effects: [set50('hj', 'hanna'), w50('jam', 'given'), ny50(10, 45)] },
      { id: 'c50_hj_farm', label: 'Одну — девочке, вторую сберечь для хутора', when: not(v('w.c50_case', 'forced')), minutes: 45, terminal: true, goto: 'c50_hbn_merle',
        text: 'Банку ты заворачиваешь в больничное полотенце и кладёшь на дно рюкзака. Хенрике откроет её, когда ты вернёшься. Или когда вернётся кто-нибудь. Девочка из девятой получает свою и прячет под подушку.', effects: [set50('hj', 'farm'), w50('jam', 'farm'), ny50(10, 45)] },
      { id: 'c50_hj_one', label: 'Отдать уцелевшую банку девочке из девятой', when: v('w.c50_case', 'forced'), minutes: 45, terminal: true, goto: 'c50_hbn_merle',
        text: 'Девочка прячет банку под подушку и обещает съесть по ложке в день. Мерле, узнав, фыркает: «Ich hätte sie auch nicht gekriegt». Мне бы всё равно не досталось. И смеётся.', effects: [set50('hj', 'one'), w50('jam', 'given'), ny50(10, 45)] },
      { id: 'c50_hj_letters', label: 'Спросить старика про письма', minutes: 45, terminal: true, goto: 'c50_hbn_merle',
        text: 'Письма жены, за пятьдесят лет. Каждый раз, когда он уезжал, хоть на день, она писала. Он не читает их, просто держит пачку на коленях. Банки ты раздаёшь, как он сказал: девочке и Мерле. Сколько уцелело.', effects: [set50('hj', 'letters'), w50('jam', 'given'), w50('b_old_letters', true), ny50(10, 45)] },
    ] }),

  U({ id: 'c50_hbn_merle', title: 'Мерле', ambient: ward,
    text: [
      { when: merleHome, text: 'Мерле собирает сумку на четвёртое. Врач выписала ей ручки на два месяца, иглы, полоски. Всё в синей сумке-холодильнике, той самой. Мерле укладывает и перекладывает.' },
      { when: not(merleHome), text: 'Мерле раскладывает вещи в тумбочке: надолго, до марта. Список «Was ich im Frühling mache» приколот к стене кнопкой.' },
    ],
    actions: [
      { id: 'c50_hm_help', label: 'Помочь ей уложить всё как следует', minutes: 60, terminal: true, goto: 'c50_hbn_lunch',
        text: 'Ручки — отдельно, иглы — отдельно, полоски — в коробку от печенья. Ты показываешь, как держать холод в сумке без тока: в мокрой ткани, у окна, в подвале. Мерле записывает в тетрадь. Не просит, просто записывает.', effects: [set50('hm', 'help'), w50('b_merle_packed', true), ny50(11, 45)] },
      { id: 'c50_hm_talk', label: 'Поговорить с ней о весне', minutes: 60, terminal: true, goto: 'c50_hbn_lunch',
        text: 'Весна — это далеко и близко одновременно. Мерле рисует в тетради хутор: дом, сарай, кур, крест на месте колокола. Подписывает: «Henrike, Kaffee, zu viert». Хенрике, кофе, вчетвером. Отрывает лист и отдаёт тебе.', effects: [set50('hm', 'talk'), w50('b_merle_drawing', true), ny50(11, 45)] },
      { id: 'c50_hm_numbers', label: 'Проверить с ней схему ещё раз, по строчке', minutes: 60, terminal: true, goto: 'c50_hbn_lunch',
        text: 'Длинный утром, короткий к еде, хлебные единицы, поправка на холод и на работу. Мерле отвечает без ошибок и сердится, что ты проверяешь. Потом говорит: «Danke, dass du prüfst». Спасибо, что проверяешь.', effects: [set50('hm', 'numbers'), ny50(11, 45)] },
    ] }),

  U({ id: 'c50_hbn_lunch', title: 'Обед', ambient: ward,
    text: [
      { text: 'Обед первого января: суп из вчерашних сосисок, хлеб. В столовой тихо: все не выспались и счастливы этим.' },
    ],
    actions: [
      { id: 'c50_hnl_eat', label: 'Пообедать', minutes: 45, terminal: true, goto: 'c50_hbn_bus',
        text: 'Суп горячий и солёный. Ты съедаешь две тарелки, потому что повариха наливает вторую не спрашивая.', effects: [set50('hnl', 'eat'), ...fed50(40), ny50(12, 45)] },
      { id: 'c50_hnl_old', label: 'Отнести обед старику и посидеть, пока он ест', minutes: 45, terminal: true, goto: 'c50_hbn_bus',
        text: 'Старик ест медленно и рассказывает, как сажал свою яблоню: в шестьдесят восьмом, в день, когда родилась дочь. Ты не спрашиваешь, где дочь. Он сам говорит: в Мюнхене. Связи нет. «Aber der Baum steht». Но дерево стоит.', effects: [set50('hnl', 'old'), ...fed50(30), ny50(12, 45)] },
      { id: 'c50_hnl_sisters', label: 'Сесть с сёстрами и слушать, кто как встретил', minutes: 45, terminal: true, goto: 'c50_hbn_bus',
        text: 'Одна встречала в лифте, застрявшем между этажами. Другая — в морге, «da war es wenigstens ruhig». Там хоть тихо было. Все смеются. Ты рассказываешь про своё, и тоже смеются, по-доброму.', effects: [set50('hnl', 'sisters'), ...fed50(35), ny50(12, 45)] },
    ] }),

  U({ id: 'c50_hbn_bus', title: 'Поздравления', ambient: ward,
    text: [
      { text: 'После обеда по отделению ходят с поздравлениями: больные из соседних палат, сёстры с других этажей, санитар с термосом.' },
      { when: v('w.c45_fokken', 'listed'), text: 'Тамме Фоккен приходит сам, в выглаженной рубашке, с Гезиной под руку. Гезина несёт тебе носок, связанный из бинта. Один.' },
      { when: all(not(v('w.c45_fokken', 'listed')), not(flag('w.c48_b_vouched'))), text: 'Старушка с одышкой из автобуса приходит под руку с санитаром и дарит тебе платок с вышитой буквой. Не твоей. «Macht nichts». Неважно.' },
      { when: all(not(v('w.c45_fokken', 'listed')), flag('w.c48_b_vouched')), text: 'Мужчина с гриппом, которого пропустили на мосту, приходит в чистом свитере и жмёт тебе руку обеими руками.' },
    ],
    actions: [
      { id: 'c50_hbu_thanks', label: 'Принять поздравления и поздравить в ответ', minutes: 30, terminal: true, goto: 'c50_hbn_walk',
        text: 'Ты говоришь «Frohes Neues» столько раз, что слова стираются, как монета. Но каждый раз — всерьёз. Последним поздравляет санитар с термосом и наливает тебе кофе.', effects: [set50('hbu', 'thanks'), ny50(13, 15)] },
      { id: 'c50_hbu_sock', label: 'Спросить, почему носок один', when: v('w.c45_fokken', 'listed'), minutes: 30, terminal: true, goto: 'c50_hbn_walk',
        text: 'Гезина смотрит строго: «Der zweite kommt, wenn Sie wiederkommen». Второй будет, когда вернётесь. Тамме за её спиной разводит руками: спорить бесполезно, пятьдесят лет проверено.', effects: [set50('hbu', 'sock'), w50('b_one_sock', true), ny50(13, 15)] },
      { id: 'c50_hbu_coffee', label: 'Выпить с санитаром кофе у окна', minutes: 30, terminal: true, goto: 'c50_hbn_walk',
        text: 'Санитар рассказывает, что в новогоднюю ночь в приёмный покой привезли только одного: мальчишку, обжёгшегося бенгальским огнём. «Das beste Silvester seit Jahren». Лучший Сильвестр за много лет. Он не шутит.', effects: [set50('hbu', 'coffee'), ...fed50(10), ny50(13, 15)] },
      { id: 'c50_hbu_round', label: 'Обойти соседние палаты с ответными поздравлениями', minutes: 30, terminal: true, goto: 'c50_hbn_walk',
        text: 'Палата за палатой, лицо за лицом. В одной старушка дарит тебе карамельку, в другой мальчик — рисунок с ёлкой. Карманы халата полнеют.', effects: [set50('hbu', 'round'), ny50(13, 15)] },
    ] }),

  X({ id: 'c50_hbn_walk', title: 'Альстер', location: uke50, camp: hosp(), ambient: rain50,
    text: [
      { text: 'После обеда Вольтерс отпускает тебя на два часа: «Raus. Frische Luft. Befehl». Наружу. Свежий воздух. Приказ.' },
      { text: 'Город в оттепель: снег превратился в серую кашу, по улицам текут ручьи. Лёд на Альстере потемнел, по нему уже никто не ходит. На берегу табличка: «Betreten verboten». Выход на лёд запрещён.' },
    ],
    actions: [
      { id: 'c50_hw2_merle', label: 'Взять с собой Мерле', minutes: 75, terminal: true, goto: 'c50_hbn_wolters', ambientDuring: rain50,
        text: 'Мерле идёт медленно, держась за тебя, и вдыхает мокрый воздух, как будто его выдают по талонам. У Альстера останавливается и говорит: «Im Sommer bin ich hier gerudert. Mit einem Jungen. Er hieß Finn». Летом я тут каталась на лодке. С мальчиком. Его звали Фин. Больше она про него ничего не говорит.', effects: [set50('hw2', 'merle'), ny50(14, 30)] },
      { id: 'c50_hw2_alone', label: 'Пойти одной вдоль воды', minutes: 75, terminal: true, goto: 'c50_hbn_wolters', ambientDuring: rain50,
        text: 'Ты идёшь вдоль берега до моста и обратно. Утки сидят на краю льда, у чёрной полыньи. Пожилая пара кормит их хлебом, крошка за крошкой. Ты думаешь, что город, где кормят уток, ещё не умер.', effects: [set50('hw2', 'alone'), { body: 'stress', delta: -6 }, ny50(14, 30)] },
      { id: 'c50_hw2_church', label: 'Дойти до церкви, где вчера звонили', minutes: 75, terminal: true, goto: 'c50_hbn_wolters', ambientDuring: rain50,
        text: 'Церковь открыта. Внутри холодно, пахнет воском. На доске у входа записки: имена, «gesucht», «lebt», «Gott sei Dank». Ищем. Жив. Слава богу. Ты пишешь свою: два имени, хутор, «alle gesund». Все здоровы. Прикалываешь среди других.', effects: [set50('hw2', 'church'), w50('b_church_note', true), ny50(14, 30)] },
    ] }),

  U({ id: 'c50_hbn_wolters', title: 'Вольтерс', ambient: ward,
    text: [
      { when: back, text: 'Вольтерс ждёт тебя на посту с журналом смен. «Am vierten fahren Sie. Das weiß ich. Ich frage trotzdem einmal: wirklich?» Четвёртого вы уезжаете. Я знаю. Всё-таки спрошу один раз: точно?' },
      { when: spring, text: 'Вольтерс ждёт тебя на посту с журналом смен до марта. Твоя фамилия уже вписана карандашом, через день, с ночами. «Bleistift. Falls Sie es sich anders überlegen». Карандашом. Если передумаете.' },
      { when: not(any(back, spring)), text: 'Вольтерс ждёт тебя на посту. Спрашивает, что дальше. Ты не знаешь, что ответить.' },
    ],
    actions: [
      { id: 'c50_hwo_sure', label: 'Ответить твёрдо, как решили', minutes: 60, terminal: true, goto: 'c50_hbn_dusk',
        text: 'Вольтерс кивает, без обиды. «Gut. Dann weiß ich, woran ich bin». Хорошо. Значит, знаю, на что рассчитывать. Она закрывает журнал и вдруг жмёт тебе руку, крепко, как мужчина.', effects: [set50('hwo', 'sure'), ny50(15, 30)] },
      { id: 'c50_hwo_doubt', label: 'Признаться, что сомневаешься', minutes: 60, terminal: true, goto: 'c50_hbn_dusk',
        text: 'Вольтерс снимает очки. «Zweifel ist gut. Wer nicht zweifelt, hat nicht nachgedacht». Сомнение — это хорошо. Кто не сомневается, тот не думал. Она не уговаривает. Она просто ждёт, и это хуже уговоров.', effects: [set50('hwo', 'doubt'), w50('b_doubt', true), ny50(15, 30)] },
      { id: 'c50_hwo_thanks', label: 'Поблагодарить её за эти дни', minutes: 60, terminal: true, goto: 'c50_hbn_dusk',
        text: 'Вольтерс не знает, куда деть руки. Говорит: «Hören Sie auf. Sonst muss ich sentimental werden, und das kann ich nicht». Перестаньте. А то придётся растрогаться, а я этого не умею. И уходит на обход раньше времени.', effects: [set50('hwo', 'thanks'), ny50(15, 30)] },
    ] }),

  U({ id: 'c50_hbn_dusk', title: 'Сумерки', ambient: ward,
    text: [
      { text: 'В четыре уже темнеет. В отделении зажигают свет. За окном дождь, огни, туман. Первый день года кончается так же, как все остальные: обходом.' },
    ],
    actions: [
      { id: 'c50_hnk_round', label: 'Вечерний обход', minutes: 30, terminal: true, goto: 'c50_checkpoint_uke',
        text: 'Двенадцать коек. Сахар, давление. Старик из восьмой спит с пачкой писем на груди. Ты не забираешь её.', effects: [set50('hnk', 'round'), { set: '$.c50_finished', value: true }, ny50(16, 0)] },
      { id: 'c50_hnk_window', label: 'Постоять у окна, лицом на юг', minutes: 30, terminal: true, goto: 'c50_checkpoint_uke',
        text: 'Юг в тумане. Ты стоишь и думаешь о том, что там сейчас тоже сумерки, и печка, и Хенрике с вязанием. Тебе туда хочется так, что сводит пальцы.', effects: [set50('hnk', 'window'), { set: '$.c50_finished', value: true }, ny50(16, 0)] },
      { id: 'c50_hnk_merle', label: 'Посидеть с Мерле', minutes: 30, terminal: true, goto: 'c50_checkpoint_uke',
        text: 'Мерле читает, ты сидишь рядом. Ничего не говорите. За окном темнеет. Это тоже хорошо.', effects: [set50('hnk', 'merle'), { set: '$.c50_finished', value: true }, ny50(16, 0)] },
    ] }),

  X({ id: 'c50_checkpoint_uke', title: 'Новый год', location: uke50, checkpoint: 50, universal: false, camp: hosp('sleep'), ambient: ward,
    text: [{ text: 'Четыре часа дня. Гамбург, Эппендорф. Первое января две тысячи двадцать седьмого года.' }], actions: [] }),
];

