import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { brothersCome, oleHome33 } from './point33';
import { thomas34 } from './point34';
import { cowLost41 } from './point41';
import {
  S42, fri42, hansenDead42, hansenHere42, henrike42, jonasMet42, nina42, own42, set42, thu42, tree42, until42, w42,
} from './point42';

// Участок 42, линия A. Четверг: лесополоса и ёлка, следы со стоптанным каблуком (курятник с 19-й), землянка и Йонас, что ему
// сказать, ёлка дома, объявления Красного Креста (служба в сочельник, школа в Винзене, Томас), ружьё на стражу, Ханзены, партнёр,
// вечерние дела. Пятница: ров у Зеве, Брандт и облава с собаками, работа на рву, снова Йонас (письмо матери) или венок, подарок,
// баня, звезда, эфир.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S42({ ...scene, for: 'any', chapter: 'ch3' });
const jonas = (x: string) => v('w.c42_jonas', x);
const thomasAnswered = any(v('w.c34_thomas', 'truth'), v('w.c34_thomas', 'gentle'));
const toldBrandt = any(v('w.c42_brandt_jonas', 'vouch'), v('w.c42_brandt_jonas', 'self'));

export const day42AScenes: Scene[] = [
  // ═════════════ Четверг ═════════════
  X({ id: 'c42_a_belt', title: 'Лесополоса', camp: yard14, ambient: thu42,
    text: [
      { text: 'Лесополоса за полем — полкилометра по раскисшей меже. Топор, ножовка, верёвка.' },
      { when: oleHome33, text: 'Оле идёт с тобой, с топором на плече. У канавы он сворачивает к своим силкам: «Ruf, wenn du was brauchst». Позови, если что.' },
      { when: tree42, text: 'Хенрике сказала: ель, не выше двери.' },
      { when: not(tree42), text: 'Ёлку решили не ставить. Но сушняк на растопку нужен всегда.' },
    ],
    actions: [
      { id: 'c42_ab_spruce', label: 'Искать ель у канавы: маленькую, ровную', when: tree42, minutes: 40, terminal: true, goto: 'c42_a_tracks', ambientDuring: thu42,
        text: 'Ели у канавы растут тесно, кривые, с голыми боками. Ровная находится в глубине, там, где ещё лежит снег.', effects: [set42('ab', 'spruce'), until42(47, 8, 30)] },
      { id: 'c42_ab_pine', label: 'Срезать верхушку сосны: выше и пушистее, но надо лезть', when: tree42, minutes: 40, activity: 'moderate', terminal: true, goto: 'c42_a_tracks', ambientDuring: thu42,
        text: 'Ты присматриваешь сосну с густой макушкой и лезешь по сучьям. Сверху видно хутор, дым из трубы и следы на снегу в глубине лесополосы. Свежие.', effects: [set42('ab', 'pine'), until42(47, 8, 30)] },
      { id: 'c42_ab_mistle', label: 'Сначала посмотреть омелу на старых тополях', minutes: 40, terminal: true, goto: 'c42_a_tracks', ambientDuring: thu42,
        text: 'На тополе у канавы висят шары омелы. Ты сбиваешь одну ветку палкой. Белые ягоды, восковые листья. Под омелой, говорят, целуются.', effects: [set42('ab', 'mistle'), set42('mistle', true), until42(47, 8, 30)] },
      { id: 'c42_ab_wood', label: 'Собирать сушняк', when: not(tree42), minutes: 40, activity: 'moderate', terminal: true, goto: 'c42_a_tracks', ambientDuring: thu42,
        text: 'Сухие ветки, обломки, кора. Две вязанки. В глубине лесополосы, у ёлок, ты замечаешь на снегу следы.', effects: [set42('ab', 'wood'), until42(47, 8, 30)] },
    ] }),

  X({ id: 'c42_a_tracks', title: 'Следы', camp: yard14, ambient: thu42,
    text: [
      { text: 'Там, где снег ещё лежит под елями, видны следы. Свежие, утренние. Сапоги большие, каблук у правого стоптан.' },
      { when: v('w.c19_coop', 'gift'), text: 'Такие же следы были у курятника в ноябре. Тогда ты оставил{m:|а} два яйца на столбе изгороди.' },
      { when: any(v('w.c19_coop', 'bell'), v('w.c19_coop', 'left')), text: 'Такие же были у курятника в ноябре, когда пропадали яйца.' },
      { text: 'Следы уходят к поваленному дубу. Оттуда тянет дымом.' },
    ],
    actions: [
      { id: 'c42_at_follow', label: 'Идти по следам тихо', minutes: 20, terminal: true, goto: 'c42_a_dugout', ambientDuring: thu42,
        text: 'Ты идёшь по следам, наступая в них же, чтобы не хрустеть. Дым всё ближе.', effects: [set42('at', 'follow'), until42(47, 8, 50)] },
      { id: 'c42_at_call', label: 'Окликнуть издалека: «Hallo? Ich tu nichts»', minutes: 20, terminal: true, goto: 'c42_a_dugout', ambientDuring: thu42,
        text: '«Hallo? Ich tu nichts!» Эй? Я ничего не сделаю! Голос глохнет в ёлках. Дым вдруг пропадает.', effects: [set42('at', 'call'), until42(47, 8, 50)] },
      { id: 'c42_at_back', label: 'Не лезть: забрать своё и уйти', minutes: 20, terminal: true, goto: 'c42_a_tree', ambientDuring: thu42,
        text: 'Чужой дым — чужое дело. Ты поворачиваешь обратно к канаве. Спиной чувствуешь, что на тебя смотрят.', effects: [set42('at', 'back'), until42(47, 8, 50)] },
    ] }),

  X({ id: 'c42_a_dugout', title: 'Под дубом', camp: yard14, ambient: thu42,
    text: [
      { when: own42('at', 'follow'), text: 'Под корнями поваленного дуба — яма, накрытая брезентом и лапником. У входа тлеет костерок, рядом яичная скорлупа. Брезент откидывается.' },
      { when: own42('at', 'call'), text: 'У поваленного дуба шипит залитый костёр. Из-под корней хриплый молодой голос: «Bleib da stehen». Стой там. Брезент откидывается.' },
      { text: 'Парень лет двадцати, худой, в армейских штанах и чужом пуховике. Борода клочьями. В руке топорик. Он держит его неумело, как инструмент, а не как оружие.' },
    ],
    actions: [
      { id: 'c42_ad_hands', label: 'Показать пустые руки и сказать, откуда ты', minutes: 20, terminal: true, goto: 'c42_a_jonas', ambientDuring: thu42,
        text: '«Hof Lüdemann. Da drüben». Хутор Людеманов, вон там. Ты показываешь рукой. Он смотрит на твои руки, потом на хутор. Топорик опускается.', effects: [set42('ad', 'hands'), until42(47, 9, 10)] },
      { id: 'c42_ad_army', label: 'Сразу сказать: армия ушла', minutes: 20, terminal: true, goto: 'c42_a_jonas', ambientDuring: thu42,
        text: '«Die Armee ist weg. Seit Dienstag». Армия ушла. С вторника. Он не верит. Ты повторяешь медленнее. Он садится на корень, как будто ноги перестали держать.', effects: [set42('ad', 'army'), w42('jonas_knows', true), until42(47, 9, 10)] },
      { id: 'c42_ad_wait', label: 'Отступить на шаг и ждать, пока заговорит сам', minutes: 20, terminal: true, goto: 'c42_a_jonas', ambientDuring: thu42,
        text: 'Ты отступаешь и молчишь. Минута. Он первым опускает топорик.\n\n— Habt ihr… Brot?\n\nУ вас… есть хлеб?', effects: [set42('ad', 'wait'), until42(47, 9, 10)] },
    ] }),

  X({ id: 'c42_a_jonas', title: 'Йонас', camp: yard14, ambient: thu42,
    text: [
      { text: '— Jonas. Jonas Riedel.\n\nОн говорит быстро, будто боится не успеть. Девятнадцать лет, срочная служба с июля. Четырнадцатого ноября их отделение держало дорогу у ложбины под Гарльсторфом.' },
      { text: '— Dann kamen sie aus dem Tal. Haller hat geschrien, wir sollen laufen. Ich bin gelaufen. Die anderen nicht.\n\nПотом они пришли из ложбины. Халлер кричал, чтобы мы бежали. Я побежал. Остальные нет.' },
      { text: 'С тех пор он здесь. Месяц. Ночью — к курятникам, днём — в яме. Фельдъегерей он боится больше, чем мёртвых: за дезертирство — трибунал.' },
      { when: flag('w.c21_haller_told'), text: 'Ты помнишь ранец с выжженной фамилией и солдата у колонны, которому ты рассказал{m:|а} про ложбину.' },
    ],
    actions: [
      { id: 'c42_aj_army', label: 'Сказать: армии нет, искать его некому', when: not(flag('w.c42_jonas_knows')), minutes: 30, terminal: true, goto: 'c42_a_offer', ambientDuring: thu42,
        text: '«Keiner sucht dich. Die sind über die Elbe». Тебя никто не ищет. Они за Эльбой.\n\nЙонас смеётся, коротко и странно. Потом плачет, не закрывая лица. Ты ждёшь.', effects: [set42('aj', 'army'), w42('jonas_knows', true), until42(47, 9, 40)] },
      { id: 'c42_aj_eggs', label: 'Спросить про яйца из курятников', when: not(v('w.c19_coop', 'gift')), minutes: 30, terminal: true, goto: 'c42_a_offer', ambientDuring: thu42,
        text: '— Das war ich. Tut mir leid. Immer nur eins.\n\nЭто был я. Простите. Всегда только одно.\n\nОн говорит, что ни разу не взял курицу, хотя мог. «Dann merkt man es». Тогда заметят.', effects: [set42('aj', 'eggs'), until42(47, 9, 40)] },
      { id: 'c42_aj_gift', label: 'Спросить, нашёл ли он тогда два яйца на столбе', when: v('w.c19_coop', 'gift'), minutes: 30, terminal: true, goto: 'c42_a_offer', ambientDuring: thu42,
        text: 'Он поднимает глаза.\n\n— Das warst du? Ich dachte, das ist eine Falle. Ich habe sie trotzdem gegessen.\n\nЭто был{m:|а} ты? Я думал, это ловушка. Всё равно съел.\n\nПервый раз за разговор он улыбается.', effects: [set42('aj', 'gift'), until42(47, 9, 40)] },
      { id: 'c42_aj_haller', label: 'Спросить про Халлера', minutes: 30, terminal: true, goto: 'c42_a_offer', ambientDuring: thu42,
        text: '— Er hatte zwei Kinder. Jeden Abend hat er Fotos gezeigt. — Йонас смотрит в костёр. — Ich hätte bleiben sollen.\n\nУ него было двое детей. Каждый вечер показывал фотографии. Мне надо было остаться.\n\nТы говоришь: «Dann wärst du tot». Тогда тебя бы уже не было. Он не отвечает.', effects: [set42('aj', 'haller'), until42(47, 9, 40)] },
      { id: 'c42_aj_bread', label: 'Отдать ему хлеб из кармана', minutes: 30, terminal: true, goto: 'c42_a_offer', ambientDuring: thu42,
        text: 'Он ест так, что тебе приходится отвернуться. Крошки собирает с ладони. Потом говорит «danke» и долго смотрит на пустую ладонь.', effects: [set42('aj', 'bread'), until42(47, 9, 40)] },
    ] }),

  X({ id: 'c42_a_offer', title: 'Что дальше', camp: yard14, ambient: thu42,
    text: [
      { text: 'Йонас спрашивает, что ты будешь делать. Скажешь кому-нибудь? Позовёшь людей?' },
      { text: 'Здесь ему до весны не дотянуть: ночью опять морозы, дым видно с дороги, а у каждого двора теперь свои люди с вилами.' },
    ],
    actions: [
      { id: 'c42_ao_come', label: 'Позвать на хутор: погреться, поесть, а там видно будет', minutes: 20, terminal: true, goto: 'c42_a_tree', ambientDuring: thu42,
        text: '— Heute nicht. Morgen vielleicht.\n\nНе сегодня. Может, завтра.\n\nТы объясняешь дорогу: поле, изгородь, калитка с банками. «Klopf zweimal». Постучи два раза.', effects: [set42('ao', 'come'), w42('jonas', 'invited'), w42('jonas_met', true), until42(47, 10, 0)] },
      { id: 'c42_ao_promise', label: 'Обещать прийти завтра с одеялом и едой', minutes: 20, terminal: true, goto: 'c42_a_tree', ambientDuring: thu42,
        text: 'Он кивает. «Morgen. Mittags». Завтра. В обед. Ты запоминаешь место: дуб, яма, тропа от канавы.', effects: [set42('ao', 'promise'), w42('jonas', 'promise'), w42('jonas_met', true), until42(47, 10, 0)] },
      { id: 'c42_ao_brandt', label: 'Сказать: в пожарной части записывают всех, пусть придёт сам', minutes: 20, terminal: true, goto: 'c42_a_tree', ambientDuring: thu42,
        text: '— Brandt?\n\nОн бледнеет. Ты объясняешь: Брандт не армия, Брандт пожарный. Ему нужны руки на рву, а не дезертиры. Йонас молчит. «Ich überlege». Я подумаю.', effects: [set42('ao', 'brandt'), w42('jonas', 'brandt'), w42('jonas_met', true), until42(47, 10, 0)] },
      { id: 'c42_ao_secret', label: 'Пообещать молчать и уйти', minutes: 20, terminal: true, goto: 'c42_a_tree', ambientDuring: thu42,
        text: '«Ich sage keinem was». Я никому не скажу. Он смотрит долго, потом кивает. Ты уходишь и не оборачиваешься, чтобы ему было спокойнее.', effects: [set42('ao', 'secret'), w42('jonas', 'secret'), w42('jonas_met', true), until42(47, 10, 0)] },
    ] }),

  X({ id: 'c42_a_tree', title: 'Домой', camp: yard14, ambient: thu42,
    text: [
      { when: tree42, text: 'Ель выбрана. Теперь срезать, связать и дотащить по раскисшей меже.' },
      { when: all(tree42, own42('ab', 'pine')), text: 'Макушка сосны оказывается выше, чем казалась снизу. Но красивая.' },
      { when: not(tree42), text: 'Сушняк в вязанках. Осталось дотащить до дома.' },
    ],
    actions: [
      { id: 'c42_atr_cut', label: 'Срезать низко, чтобы ствол влез в ведро, и нести на плече', when: tree42, minutes: 40, activity: 'heavy', terminal: true, goto: 'c42_a_stand', ambientDuring: thu42,
        text: 'Ножовка идёт туго, смола липнет к пальцам. Ель падает мягко, в снег. Ты несёшь её на плече макушкой назад, как учила Хенрике: чтобы не обломать.', effects: [set42('atr', 'cut'), w42('tree', true), { body: 'fatigue', delta: 6 }, until42(47, 11, 0)] },
      { id: 'c42_atr_drag', label: 'Волочь за ствол по снегу', when: tree42, minutes: 35, terminal: true, goto: 'c42_a_stand', ambientDuring: thu42,
        text: 'Ель едет по снегу и грязи. Домой она приезжает мокрая, с обломанной нижней лапой. Хенрике поджимает губы. Потом говорит: «Wird schon». Сойдёт.', effects: [set42('atr', 'drag'), w42('tree', true), until42(47, 10, 55)] },
      { id: 'c42_atr_two', label: 'Срезать две: вторую — Уте в колонию', when: tree42, minutes: 50, activity: 'heavy', terminal: true, goto: 'c42_a_stand', ambientDuring: thu42,
        text: 'Две ели, одну за другой. Вторую ты оставляешь у калитки колонии. Через час с той стороны машут: Уте нашла.', effects: [set42('atr', 'two'), w42('tree', true), w42('ute_tree', true), npc('c14_ute', 1), { body: 'fatigue', delta: 8 }, until42(47, 11, 10)] },
      { id: 'c42_atr_wood', label: 'Отнести сушняк в сени', when: not(tree42), minutes: 35, activity: 'moderate', terminal: true, goto: 'c42_a_stand', ambientDuring: thu42,
        text: 'Две вязанки на спине, как у старухи из сказки. В сенях ты складываешь их у стены. Сухие ветки трещат.', effects: [set42('atr', 'wood'), until42(47, 10, 55)] },
      { id: 'c42_atr_branch', label: 'Сломать одну еловую ветку и взять с собой', when: not(tree42), minutes: 35, terminal: true, goto: 'c42_a_stand', ambientDuring: thu42,
        text: 'Одна ветка, пушистая, с двумя шишками. Дома ты ставишь её в банку с водой на подоконник и ничего никому не говоришь.', effects: [set42('atr', 'branch'), w42('branch', true), until42(47, 10, 55)] },
    ] }),

  X({ id: 'c42_a_stand', title: 'Ёлка', camp: kitchen14,
    text: [
      { when: all(tree42, flag('w.c42_tree')), text: 'Ель стоит в ведре с песком в углу кухни. Голая, мокрая, пахнет на весь дом. Вокруг неё уже дети.' },
      { when: all(tree42, nina42), text: 'Нина держит коробку из сундука Оле: соломенные звёзды, прошлогодние, помятые.' },
      { when: not(tree42), text: 'В кухне тихо. Нина сидит у окна с книгой и не читает.' },
    ],
    actions: [
      { id: 'c42_as_kids', label: 'Держать ведро, пока дети вешают звёзды', when: tree42, minutes: 40, terminal: true, goto: 'c42_a_radio1',
        text: 'Ты держишь, дети вешают. Кривовато, по три звезды на одной ветке и ни одной на другой. Никто не поправляет.', effects: [set42('as', 'kids'), until42(47, 11, 45)] },
      { id: 'c42_as_candles', label: 'Поставить на ветки настоящие свечи', when: tree42, minutes: 40, terminal: true, goto: 'c42_a_radio1',
        text: 'Восемь свечек в жестяных прищепках. Хенрике ставит рядом ведро с водой и говорит: «Nur wenn jemand daneben sitzt». Только если кто-то сидит рядом. Зажигать будут в сочельник.', effects: [set42('as', 'candles'), w42('tree_candles', true), until42(47, 11, 45)] },
      { id: 'c42_as_apples', label: 'Повесить яблоки и грецкие орехи, как в детстве у Хенрике', when: tree42, minutes: 40, terminal: true, goto: 'c42_a_radio1',
        text: 'Красные яблоки на нитках, орехи, обёрнутые фольгой от шоколадок. Хенрике сначала молчит. Потом поправляет одно яблоко и отворачивается к плите.', effects: [set42('as', 'apples'), npc('henrike', 1), until42(47, 11, 45)] },
      { id: 'c42_as_nina', label: 'Сесть рядом с Ниной', when: all(not(tree42), nina42), minutes: 40, terminal: true, goto: 'c42_a_radio1',
        text: 'Нина говорит, не поворачиваясь: «Ist schon okay. Wirklich». Всё нормально. Правда.\n\nТы не споришь. Вы сидите и смотрите в окно, на поле и мокрую лесополосу.', effects: [set42('as', 'nina'), npc('c7_nina', 1), until42(47, 11, 45)] },
      { id: 'c42_as_rest', label: 'Посидеть пять минут у печи', minutes: 30, terminal: true, goto: 'c42_a_radio1',
        text: 'Ты садишься к печи. Руки пахнут смолой и мокрой корой. Пять минут никто тебя не зовёт.', effects: [set42('as', 'rest'), { body: 'stress', delta: -3 }, until42(47, 11, 40)] },
    ] }),

  X({ id: 'c42_a_radio1', title: 'Объявления', camp: kitchen14,
    text: [
      { text: 'В полдень Красный Крест Винзена читает объявления. Приёмник на подоконнике, вокруг собираются все, кто в доме.' },
      { text: '— …Heiligabend, sechzehn Uhr, Gottesdienst in Sankt Martin, Jesteburg. Die Kirche ist kalt, bringen Sie Decken mit. Ab vierten Januar Schule für Kinder aus dem Landkreis in Winsen, mit Übernachtung, Bus montags…\n\nВ сочельник, в четыре, служба в церкви Святого Мартина в Йестебурге. В церкви холодно, берите одеяла. С четвёртого января — школа для детей округа в Винзене, с ночёвкой, автобус по понедельникам.' },
      { when: thomas34, text: '— …und am Freitag um achtzehn Uhr: Grüße aus Toronto. Thomas Brockmann liest Antworten vor.\n\nИ в пятницу в шесть: приветы из Торонто. Томас Брокман читает ответы.' },
    ],
    actions: [
      { id: 'c42_ar_write', label: 'Записать всё и повесить на дверь', minutes: 30, terminal: true, goto: 'c42_lunch',
        text: 'Ты пишешь крупно на обороте листа Хенрике: сочельник, 16:00, церковь, одеяла. Школа — 4 января, Винзен. Нина подходит, читает и долго стоит у двери.', effects: [set42('ar', 'write'), w42('school_known', true), w42('church_known', true), until42(47, 12, 30)] },
      { id: 'c42_ar_henrike', label: 'Позвать Хенрике дослушать', when: henrike42, minutes: 30, terminal: true, goto: 'c42_lunch',
        text: 'Хенрике слушает, вытирая руки о фартук. Про церковь говорит: «Da war ich seit Ostern nicht». Я там с Пасхи не была. Про школу молчит и смотрит на Нину или на детей.', effects: [set42('ar', 'henrike'), w42('school_known', true), w42('church_known', true), until42(47, 12, 30)] },
      { id: 'c42_ar_off', label: 'Дослушать и выключить: беречь батарейки', minutes: 25, terminal: true, goto: 'c42_lunch',
        text: 'Ты выключаешь. В кухне сразу становится слышно, как капает с крыши.', effects: [set42('ar', 'off'), w42('school_known', true), w42('church_known', true), until42(47, 12, 25)] },
    ] }),

  X({ id: 'c42_a_gun', title: 'Ружьё', camp: kitchen14,
    text: [
      { text: 'После обеда приходит Лукас. Брандт ставит ночную стражу у Зеве: по двое с каждого берега. Нужно ружьё. Лукас знает, что у Людеманов оно есть.' },
      { when: oleHome33, text: 'Оле стоит у шкафа, где ружьё старого Людемана, и смотрит на тебя. Патронов шесть.' },
      { when: not(oleHome33), text: 'Хенрике смотрит на шкаф, где стоит ружьё старого Людемана. Патронов шесть. «Entscheide du». Решай ты.' },
    ],
    actions: [
      { id: 'c42_ag_give', label: 'Отдать ружьё на стражу, с патронами', minutes: 30, terminal: true, goto: 'c42_a_bring',
        text: 'Лукас берёт ружьё бережно, как чужого ребёнка. Пишет расписку на клочке: «1 Flinte, 6 Patronen, Lüdemann». Ружьё уходит со двора.', effects: [set42('ag', 'give'), w42('gun', 'guard'), npc('c16_brandt', 1), until42(47, 13, 45)] },
      { id: 'c42_ag_keep', label: 'Оставить дома: дом важнее', minutes: 30, terminal: true, goto: 'c42_a_bring',
        text: 'Лукас не спорит. «Dann eben Mistgabeln». Значит, вилы. У двери оборачивается: «Brandt merkt sich das». Брандт это запомнит.', effects: [set42('ag', 'keep'), w42('gun', 'home'), until42(47, 13, 45)] },
      { id: 'c42_ag_me', label: 'Отдать только вместе с собой: стрелять буду я', minutes: 30, terminal: true, goto: 'c42_a_bring',
        text: 'Лукас думает и кивает. «Montag, Mittwoch, Freitag. Ab acht». Понедельник, среда, пятница. С восьми. Ты теперь в списке стражи. С ружьём.', effects: [set42('ag', 'me'), w42('gun', 'me'), until42(47, 13, 45)] },
    ] }),

  X({ id: 'c42_a_bring', title: 'Узел', camp: kitchen14,
    text: [
      { when: all(jonasMet42, any(jonas('promise'), jonas('invited'))), text: 'Ты собираешь для Йонаса: старое одеяло из сарая, шерстяные носки, хлеб, кусок сала. Узел получается заметный.' },
      { when: all(jonasMet42, henrike42, any(jonas('promise'), jonas('invited'))), text: 'Хенрике смотрит, как ты складываешь носки в мешок.' },
      { when: not(all(jonasMet42, any(jonas('promise'), jonas('invited')))), text: 'Хенрике просит наколоть лучины на все праздники и сложить в сенях.' },
    ],
    actions: [
      { id: 'c42_abr_tell', label: 'Рассказать Хенрике про парня в лесополосе', when: all(jonasMet42, henrike42), minutes: 30, terminal: true, goto: 'c42_a_hansen',
        text: 'Хенрике слушает, не перебивая. Потом снимает с полки растянутый свитер Оле. «Ole merkt das nicht». Оле не заметит. Свитер ложится в мешок поверх носков.', effects: [set42('abr', 'tell'), w42('henrike_knows', true), until42(47, 14, 20)] },
      { id: 'c42_abr_quiet', label: 'Сказать, что это для бедных при пожарной части', when: all(jonasMet42, henrike42, any(jonas('promise'), jonas('invited'))), minutes: 30, terminal: true, goto: 'c42_a_hansen',
        text: 'Хенрике кивает и ничего не спрашивает. Но когда ты завязываешь мешок, в нём оказывается ещё банка тушёнки. Ты не видел{m:|а}, когда она её положила.', effects: [set42('abr', 'quiet'), until42(47, 14, 20)] },
      { id: 'c42_abr_hide', label: 'Спрятать узел в сарае до завтра', when: all(jonasMet42, any(jonas('promise'), jonas('invited'))), minutes: 20, terminal: true, goto: 'c42_a_hansen',
        text: 'Узел за мешками с отрубями. Никто не видел. Тебе неприятно, как легко это получилось.', effects: [set42('abr', 'hide'), until42(47, 14, 10)] },
      { id: 'c42_abr_kindling', label: 'Колоть лучину', minutes: 40, activity: 'moderate', terminal: true, goto: 'c42_a_hansen',
        text: 'Тонкие полешки, лучина, береста в коробку. На праздники хватит. Руки пахнут смолой.', effects: [set42('abr', 'kindling'), until42(47, 14, 30)] },
    ] }),

  X({ id: 'c42_a_hansen', title: 'Ханзены', camp: yard14, ambient: thu42,
    text: [
      { when: hansenDead42, text: 'Фрау Ханзен одна в доме за полем. Под яблоней свежая земля, в изголовье — воткнутая палка.' },
      { when: all(not(hansenDead42), hansenHere42), text: 'Старик Ханзен сидит в комнате стариков у окна, небритый неделю. Он просит, не глядя на тебя:\n\n— Zu Weihnachten will ich ordentlich aussehen.\n\nНа Рождество хочу выглядеть прилично.' },
      { when: all(not(hansenDead42), not(hansenHere42)), text: 'Ханзены дома, за полем. Фрау Ханзен машет тебе с крыльца: в сенях у них кончились дрова.' },
    ],
    actions: [
      { id: 'c42_ah_cross', label: 'Сделать крест из дубовых досок', when: hansenDead42, minutes: 60, activity: 'moderate', terminal: true, goto: 'c42_a_partner', ambientDuring: thu42,
        text: 'Две доски, гвозди, нож. Ты вырезаешь имя, которое она диктует по буквам: «K-L-A-U-S». Крест встаёт под яблоней. Фрау Ханзен трогает его ладонью и уходит в дом, не прощаясь. Это у неё вместо «спасибо».', effects: [set42('ah', 'cross'), w42('hansen_cross', true), until42(47, 15, 30)] },
      { id: 'c42_ah_coffee', label: 'Посидеть с ней на кухне', when: hansenDead42, minutes: 60, terminal: true, goto: 'c42_a_partner',
        text: 'Цикорий, пирог, который она испекла мужу к Рождеству и теперь не знает, для кого. Ты съедаешь кусок. Она смотрит, как ты ешь, и ей от этого легче.', effects: [set42('ah', 'coffee'), { body: 'hunger', delta: -10 }, until42(47, 15, 30)] },
      { id: 'c42_ah_shave', label: 'Побрить старика', when: all(not(hansenDead42), hansenHere42), minutes: 60, terminal: true, goto: 'c42_a_partner',
        text: 'Горячая вода, помазок, его собственная бритва с костяной ручкой. Ты бреешь медленно. На поворотах щеки он не дышит. Потом смотрит в зеркальце: «Jetzt bin ich wieder ich». Теперь я снова я.', effects: [set42('ah', 'shave'), w42('hansen_shaved', true), until42(47, 15, 30)] },
      { id: 'c42_ah_talk', label: 'Послушать, что он рассказывает', when: all(not(hansenDead42), hansenHere42), minutes: 60, terminal: true, goto: 'c42_a_partner',
        text: 'Зима сорок седьмого. Ему пять. Голод, лёд на Эльбе, мать меняет обручальное кольцо на мешок картошки. «Wir haben das auch überlebt». Мы и это пережили. Он говорит это тебе или себе.', effects: [set42('ah', 'talk'), until42(47, 15, 30)] },
      { id: 'c42_ah_wood', label: 'Отвезти им дров на тачке', when: all(not(hansenDead42), not(hansenHere42)), minutes: 60, activity: 'heavy', terminal: true, goto: 'c42_a_partner', ambientDuring: thu42,
        text: 'Три тачки через поле. Старик ругается из кровати, что не может помочь. Фрау Ханзен даёт тебе банку сливового варенья и не берёт её обратно.', effects: [set42('ah', 'wood'), { body: 'fatigue', delta: 8 }, until42(47, 15, 30)] },
      { id: 'c42_ah_visit', label: 'Зайти и спросить, как старик', when: all(not(hansenDead42), not(hansenHere42)), minutes: 60, terminal: true, goto: 'c42_a_partner',
        text: 'Кашель меньше, жара нет. Старик спрашивает, будет ли у вас ёлка. «Dann komme ich gucken. Wenn ich darf». Тогда приду посмотреть. Если можно.', effects: [set42('ah', 'visit'), until42(47, 15, 30)] },
    ] }),

  X({ id: 'c42_a_partner', title: 'Вдвоём', camp: yard14, ambient: thu42,
    text: [
      { text: '{partner} возвращается через поле к четырём. Щёки красные от холода, в руках чья-то пустая кастрюля.' },
    ],
    actions: [
      { id: 'c42_ap_mistle', label: 'Достать омелу и поднять над головой', when: flag('$.c42_mistle'), minutes: 30, terminal: true, goto: 'c42_a_barn', ambientDuring: thu42,
        text: '{partner} смотрит вверх, на ветку с белыми ягодами, потом на тебя. «Это что?» Ты объясняешь. {pm:Он|Она} смеётся. Потом перестаёт смеяться.', effects: [set42('ap', 'mistle'), { body: 'stress', delta: -6 }, until42(47, 16, 0)] },
      { id: 'c42_ap_walk', label: 'Пройтись вдвоём вдоль изгороди до канавы', minutes: 30, terminal: true, goto: 'c42_a_barn', ambientDuring: thu42,
        text: 'До канавы и обратно, медленно. Вы говорите о пустяках: какие были ёлки в детстве, кто какой подарок помнит. Лучшие полчаса за неделю.', effects: [set42('ap', 'walk'), { body: 'stress', delta: -4 }, until42(47, 16, 0)] },
      { id: 'c42_ap_jonas', label: 'Рассказать про Йонаса', when: jonasMet42, minutes: 30, terminal: true, goto: 'c42_a_barn', ambientDuring: thu42,
        text: '{partner} слушает и спрашивает одно: «Ему есть где спать?» Ты отвечаешь честно: в яме под дубом. {partner} долго смотрит на лесополосу.', effects: [set42('ap', 'jonas'), until42(47, 16, 0)] },
      { id: 'c42_ap_tea', label: 'Забрать кастрюлю и поставить чайник', minutes: 30, terminal: true, goto: 'c42_a_barn',
        text: 'Чайник закипает, пока {partner} снимает сапоги. Вы пьёте у печи плечом к плечу, пока вас не зовут.', effects: [set42('ap', 'tea'), until42(47, 16, 0)] },
    ] }),

  X({ id: 'c42_a_barn', title: 'Вечерние дела', camp: yard14, ambient: thu42,
    text: [
      { text: 'Темнеет в половине пятого. До ужина надо успеть с хлевом и курами.' },
      { when: all(not(cowLost41), flag('w.c40_henrike_hurt')), text: 'Хенрике с лубком на руке доить не может. Корова мычит в хлеву уже полчаса.' },
    ],
    actions: [
      { id: 'c42_abn_milk', label: 'Подоить корову', when: not(cowLost41), minutes: 45, terminal: true, goto: 'c42_thu_eve',
        text: 'Корова косится, но стоит. Молоко бьёт в ведро неровно. Хенрике командует от двери: «Ruhig. Nicht ziehen. Drücken». Спокойно. Не тянуть. Жать. К концу получается.', effects: [set42('abn', 'milk'), until42(47, 17, 0)] },
      { id: 'c42_abn_hens', label: 'Закрыть кур и собрать яйца', minutes: 30, terminal: true, goto: 'c42_thu_eve', ambientDuring: thu42,
        text: 'Семь яиц в шапке. Курятник на засов. Под сеткой новых дыр нет.', effects: [set42('abn', 'hens'), until42(47, 16, 45)] },
      { id: 'c42_abn_round', label: 'Обойти изгородь до темноты', minutes: 30, terminal: true, goto: 'c42_thu_eve', ambientDuring: thu42,
        text: 'Борона у дыры, проволока, банки. Всё на месте. В лесополосе ни огонька.', effects: [set42('abn', 'round'), until42(47, 16, 45)] },
    ] }),

  // ═════════════ Пятница ═════════════
  X({ id: 'c42_a_trench', title: 'Ров', camp: yard14, ambient: fri42,
    text: [
      { text: 'В семь у ворот Лукас с лопатой на плече. Брандт собирает всех, кто может копать: ров вдоль Зеве, от моста до колонии. Земля после оттепели мягкая. Пока не замёрзла снова, надо копать.' },
    ],
    actions: [
      { id: 'c42_atc_go', label: 'Идти копать', minutes: 90, activity: 'heavy', terminal: true, goto: 'c42_a_brandt', ambientDuring: fri42,
        text: 'Лопата, глина, вода в ботинках. Рядом копают человек двадцать: соседи, пожарные, мальчишки. Через час ров по колено.', effects: [set42('atc', 'go'), { body: 'fatigue', delta: 10 }, until42(48, 9, 0)] },
      { id: 'c42_atc_coffee', label: 'Сначала сварить на всех цикорий в термосах, потом копать', minutes: 90, activity: 'moderate', terminal: true, goto: 'c42_a_brandt', ambientDuring: fri42,
        text: 'Два термоса цикория с сахаром. Когда ты разливаешь, люди на рву разгибаются и улыбаются. Брандт пьёт стоя и кивает тебе.', effects: [set42('atc', 'coffee'), npc('c16_brandt', 1), until42(48, 9, 0)] },
      { id: 'c42_atc_late', label: 'Сначала вода и хлев, на ров — к девяти', minutes: 90, terminal: true, goto: 'c42_a_brandt', ambientDuring: fri42,
        text: 'Вода, дрова, хлев. На ров ты приходишь, когда первый участок уже выкопан. Брандт смотрит на часы, но ничего не говорит.', effects: [set42('atc', 'late'), until42(48, 9, 0)] },
    ] }),

  X({ id: 'c42_a_brandt', title: 'Брандт', camp: yard14, ambient: fri42,
    text: [
      { text: 'В перерыв Брандт садится рядом на перевёрнутую тачку. Говорит тихо, только тебе.' },
      { text: '— Bei Meyers und bei Hansens fehlen Eier. Seit Wochen. Die Spuren gehen in den Windschutzstreifen. Am Samstag gehen die Männer mit Hunden durch.\n\nУ Майеров и у Ханзенов пропадают яйца. Неделями. Следы ведут в лесополосу. В субботу мужики пройдут её с собаками.' },
      { when: jonasMet42, text: 'Ты думаешь о Йонасе в яме под дубом.' },
    ],
    actions: [
      { id: 'c42_abt_vouch', label: 'Рассказать про Йонаса и поручиться за него', when: jonasMet42, minutes: 30, terminal: true, goto: 'c42_a_dig', ambientDuring: fri42,
        text: '— Ein Soldat? — Брандт молчит долго. — Gut. Kein Hund. Aber am Montag steht er hier am Graben. Sonst gehen wir doch.\n\nСолдат? Хорошо. Без собак. Но в понедельник он стоит здесь, на рву. Иначе всё-таки пойдём.', effects: [set42('abt', 'vouch'), w42('brandt_jonas', 'vouch'), until42(48, 9, 30)] },
      { id: 'c42_abt_silent', label: 'Промолчать', when: jonasMet42, minutes: 30, terminal: true, goto: 'c42_a_dig', ambientDuring: fri42,
        text: 'Ты киваешь и молчишь. Брандт смотрит на тебя чуть дольше, чем нужно. Потом встаёт: «Weiter». Дальше.', effects: [set42('abt', 'silent'), w42('brandt_jonas', 'silent'), until42(48, 9, 30)] },
      { id: 'c42_abt_self', label: 'Сказать: я схожу туда сам, без собак', when: jonasMet42, minutes: 30, terminal: true, goto: 'c42_a_dig', ambientDuring: fri42,
        text: '— Du weißt was. — Это не вопрос. — Bis Samstag früh. Dann Hunde.\n\nТы что-то знаешь. До утра субботы. Потом собаки.', effects: [set42('abt', 'self'), w42('brandt_jonas', 'self'), until42(48, 9, 30)] },
      { id: 'c42_abt_join', label: 'Сказать, что пойдёшь в субботу с ними', when: not(jonasMet42), minutes: 30, terminal: true, goto: 'c42_a_dig', ambientDuring: fri42,
        text: 'Брандт записывает. «Sieben Uhr, an der Brücke». Семь утра, у моста.', effects: [set42('abt', 'join'), w42('sweep', 'join'), until42(48, 9, 30)] },
      { id: 'c42_abt_against', label: 'Сказать: с собаками — это охота на человека', when: not(jonasMet42), minutes: 30, terminal: true, goto: 'c42_a_dig', ambientDuring: fri42,
        text: '— Und wenn es einer von denen ist? — Брандт кивает на поле.\n\nА если это один из них?\n\nТы говоришь: мёртвые не таскают яйца по одному. Брандт думает. «Vielleicht. Dann ohne Hunde». Может быть. Тогда без собак.', effects: [set42('abt', 'against'), w42('sweep', 'no_dogs'), until42(48, 9, 30)] },
      { id: 'c42_abt_eggs', label: 'Сказать, что у вас яйца тоже пропадали', when: not(jonasMet42), minutes: 30, terminal: true, goto: 'c42_a_dig', ambientDuring: fri42,
        text: 'Брандт дописывает ваш двор в блокнот. Список длинный. «Einer. Höchstens zwei», — говорит он. Один. Самое большее двое.', effects: [set42('abt', 'eggs'), until42(48, 9, 30)] },
    ] }),

  X({ id: 'c42_a_dig', title: 'До обеда', camp: yard14, ambient: fri42,
    text: [
      { text: 'После перерыва копаете дальше. Ров уходит к колонии. Лопата то и дело звякает о камни.' },
      { when: brothersCome, text: 'Дениз копает рядом и травит анекдоты, которых никто не понимает. Смеются все.' },
    ],
    actions: [
      { id: 'c42_adg_steady', label: 'Копать ровно, без перекуров', minutes: 150, activity: 'heavy', terminal: true, goto: 'c42_fri_lunch', ambientDuring: fri42,
        text: 'К полудню ваш участок по пояс. Спину не разогнуть. Брандт проходит вдоль рва и молча кладёт тебе руку на плечо.', effects: [set42('adg', 'steady'), { body: 'fatigue', delta: 12 }, until42(48, 12, 15)] },
      { id: 'c42_adg_kids', label: 'Поставить мальчишек носить глину и показать, как', minutes: 150, activity: 'moderate', terminal: true, goto: 'c42_fri_lunch', ambientDuring: fri42,
        text: 'Три пацана с вёдрами. Сначала носят наполовину, потом полными. К полудню они спорят, кто больше. Ты считаешь за всех и каждому говоришь, что больше всех носил он.', effects: [set42('adg', 'kids'), { body: 'fatigue', delta: 8 }, until42(48, 12, 15)] },
      { id: 'c42_adg_lukas', label: 'Копать в паре с Лукасом и расспросить его', minutes: 150, activity: 'heavy', terminal: true, goto: 'c42_fri_lunch', ambientDuring: fri42,
        text: 'Лукас до ноября чинил тракторы. Теперь у пожарной части три трактора и ни одной запчасти. Он рассказывает, как снимает детали с одного, чтобы ехал другой. Смеётся. Ты тоже.', effects: [set42('adg', 'lukas'), { body: 'fatigue', delta: 10 }, until42(48, 12, 15)] },
    ] }),

  X({ id: 'c42_a_jonas2', title: 'Снова под дубом', camp: yard14, ambient: fri42,
    text: [
      { text: 'После обеда ты идёшь в лесополосу. Иней на ветках растаял, с елей капает.' },
      { when: jonas('invited'), text: 'Ты надеял{m:ся|ась}, что он придёт сам. Он не пришёл.' },
      { text: 'У дуба никого, брезент откинут. Потом шорох, и Йонас выходит из-за ёлок: проверял, один ли ты.' },
    ],
    actions: [
      { id: 'c42_aj2_give', label: 'Отдать одеяло, носки и еду', minutes: 40, terminal: true, goto: 'c42_a_letter', ambientDuring: fri42,
        text: 'Он раскладывает всё на брезенте, как в магазине. Носки надевает сразу, поверх своих. «Danke». Потом достаёт из кармана сложенный листок.', effects: [set42('aj2', 'give'), w42('jonas_kit', true), until42(48, 14, 0)] },
      { id: 'c42_aj2_brandt', label: 'Рассказать про Брандта и понедельник', when: toldBrandt, minutes: 40, terminal: true, goto: 'c42_a_letter', ambientDuring: fri42,
        text: 'Йонас слушает про собак и про ров. «Also Graben oder Hunde». Значит, ров или собаки. Он почти улыбается. «Dann Graben». Тогда ров. Потом достаёт из кармана сложенный листок.', effects: [set42('aj2', 'brandt'), w42('jonas_ditch', true), until42(48, 14, 0)] },
      { id: 'c42_aj2_warn', label: 'Предупредить: в субботу пройдут с собаками', when: not(toldBrandt), minutes: 40, terminal: true, goto: 'c42_a_letter', ambientDuring: fri42,
        text: 'Йонас бледнеет. «Morgen?» Завтра? Ты киваешь. Он смотрит на яму, на брезент, на дорогу. Идти ему некуда. Потом достаёт из кармана сложенный листок.', effects: [set42('aj2', 'warn'), w42('jonas_warned', true), until42(48, 14, 0)] },
      { id: 'c42_aj2_bring', label: 'Позвать с собой прямо сейчас', minutes: 40, terminal: true, goto: 'c42_a_letter', ambientDuring: fri42,
        text: 'Он стоит долго. Потом сворачивает брезент, засыпает костёр землёй и достаёт из кармана сложенный листок, прежде чем идти.', effects: [set42('aj2', 'bring'), w42('jonas_came', true), until42(48, 14, 0)] },
    ] }),

  X({ id: 'c42_a_letter', title: 'Письмо', camp: yard14, ambient: fri42,
    text: [
      { text: '— Für meine Mutter. Hannover, Linden. Über das Rote Kreuz. Wenn das geht.\n\nДля мамы. Ганновер, Линден. Через Красный Крест. Если можно.' },
      { when: flag('w.c42_jonas_came'), text: 'Вы идёте через поле вдвоём: впереди ты, он на шаг сзади, как привык ходить в строю.' },
    ],
    actions: [
      { id: 'c42_al_take', label: 'Взять письмо и пообещать отправить', minutes: 20, terminal: true, goto: 'c42_a_gift', ambientDuring: fri42,
        text: 'Ты кладёшь письмо во внутренний карман, к телефону. Йонас смотрит, куда ты его убираешь, и кивает.', effects: [set42('al', 'take'), w42('jonas_letter', true), until42(48, 14, 30)] },
      { id: 'c42_al_ask', label: 'Спросить, что он написал', minutes: 20, terminal: true, goto: 'c42_a_gift', ambientDuring: fri42,
        text: '— Dass ich lebe. Und dass ich weggelaufen bin. Beides.\n\nЧто я жив. И что я сбежал. И то и другое.\n\nТы берёшь письмо.', effects: [set42('al', 'ask'), w42('jonas_letter', true), until42(48, 14, 30)] },
      { id: 'c42_al_self', label: 'Сказать: отнеси сам, в Винзене есть пункт', minutes: 20, terminal: true, goto: 'c42_a_gift', ambientDuring: fri42,
        text: '— Selbst?\n\nОн смотрит на письмо и прячет его обратно в карман. «Vielleicht». Может быть. Тебе кажется, что это «может быть» ближе к «да».', effects: [set42('al', 'self'), until42(48, 14, 30)] },
    ] }),

  X({ id: 'c42_a_wreath', title: 'Венок', camp: kitchen14,
    text: [
      { text: 'Хенрике приносит проволочный обруч: на завтра нужен венок, четвёртый адвент. Еловые лапы — те, что остались со вчерашнего.' },
    ],
    actions: [
      { id: 'c42_aw_kids', label: 'Плести с детьми', minutes: 60, terminal: true, goto: 'c42_a_gift',
        text: 'Детские руки в смоле, иголки по всему полу, кто-то командует. Венок выходит кривой и пышный. Хенрике ставит в него четыре свечи и не поправляет ни одной ветки.', effects: [set42('aw', 'kids'), until42(48, 14, 30)] },
      { id: 'c42_aw_self', label: 'Сплести как следует, {m:самому|самой}', minutes: 60, terminal: true, goto: 'c42_a_gift',
        text: 'Ветка к ветке, проволока туго. Через час венок ровный, как из магазина. Хенрике кивает: «Wie bei meiner Mutter». Как у моей матери.', effects: [set42('aw', 'self'), npc('henrike', 1), until42(48, 14, 30)] },
      { id: 'c42_aw_coop', label: 'Оставить венок другим и посидеть у курятника: кто таскает яйца', minutes: 60, terminal: true, goto: 'c42_a_gift', ambientDuring: fri42,
        text: 'Час за сараем с термосом. Никого. Только у изгороди на инее — старые следы. Каблук у правого стоптан. Они ведут в лесополосу.', effects: [set42('aw', 'coop'), w42('coop_watch', true), until42(48, 14, 30)] },
    ] }),

  X({ id: 'c42_a_gift', title: 'Подарок', camp: kitchen14,
    text: [
      { text: 'До Рождества шесть дней. Магазинов нет. Если хочешь что-то подарить {partner.dat}, делать придётся {m:самому|самой}.' },
    ],
    actions: [
      { id: 'c42_agf_carve', label: 'Вырезать из липы маленькую фигурку', minutes: 60, terminal: true, goto: 'c42_a_bath',
        text: 'Нож Оле, липовый брусок из сарая. Получается то ли кот, то ли лиса. Ты прячешь её в карман куртки.', effects: [set42('agf', 'carve'), w42('a_gift', 'carve'), until42(48, 15, 30)] },
      { id: 'c42_agf_boots', label: 'Прошить {partner.dat} ботинки: подошва отходит', minutes: 60, terminal: true, goto: 'c42_a_bath',
        text: 'Клей давно кончился. Ты прошиваешь подошву шилом и вощёной ниткой, стежок за стежком. Ботинки ставишь обратно так, чтобы никто не заметил.', effects: [set42('agf', 'boots'), w42('a_gift', 'boots'), until42(48, 15, 30)] },
      { id: 'c42_agf_letter', label: 'Написать письмо: то, что вслух не скажешь', minutes: 60, terminal: true, goto: 'c42_a_bath',
        text: 'Три листа. Первый ты сжигаешь в печи. Второй и третий складываешь вчетверо и прячешь в книгу на полке.', effects: [set42('agf', 'letter'), w42('a_gift', 'letter'), until42(48, 15, 30)] },
    ] }),

  X({ id: 'c42_a_bath', title: 'Банный день', camp: yard14, ambient: fri42,
    text: [
      { text: 'Пятница — банный день. Корыто посреди кухни, котёл на плите. Чтобы помылись все, нужно натаскать и нагреть воды на двадцать вёдер.' },
    ],
    actions: [
      { id: 'c42_aba_water', label: 'Таскать воду из колодца', minutes: 60, activity: 'heavy', terminal: true, goto: 'c42_a_star', ambientDuring: fri42,
        text: 'Двадцать вёдер. Ведро ледяное, дужка режет пальцы. Зато потом твоя очередь в горячей воде, и ты сидишь в корыте, пока вода не остывает.', effects: [set42('aba', 'water'), { body: 'fatigue', delta: 6 }, until42(48, 16, 30)] },
      { id: 'c42_aba_wood', label: 'Колоть дрова под котёл', minutes: 60, activity: 'heavy', terminal: true, goto: 'c42_a_star', ambientDuring: fri42,
        text: 'Колун, чурбак, полено. Котёл съедает больше, чем ты успеваешь наколоть. К четырём все чистые, а ты {m:мокрый|мокрая} от пота. Твоя очередь последняя, вода уже тёплая, не горячая.', effects: [set42('aba', 'wood'), { body: 'fatigue', delta: 6 }, until42(48, 16, 30)] },
      { id: 'c42_aba_kids', label: 'Мыть детей, пока взрослые таскают', minutes: 60, terminal: true, goto: 'c42_a_star',
        text: 'Визг, мыло в глазах, полкухни в воде. Дети выходят из корыта красные и сразу лезут к печи. Тебе достаётся вода после всех.', effects: [set42('aba', 'kids'), until42(48, 16, 30)] },
    ] }),

  X({ id: 'c42_a_star', title: 'Звезда', camp: kitchen14,
    text: [
      { when: all(tree42, flag('w.c42_tree')), text: 'Ёлка украшена, не хватает верхушки. Кто-то из детей приносит звезду, вырезанную из фольги от шоколадки.' },
      { when: not(all(tree42, flag('w.c42_tree'))), text: 'Кто-то из детей вырезал из фольги звезду и не знает, куда её деть.' },
    ],
    actions: [
      { id: 'c42_ast_kid', label: 'Поднять ребёнка: пусть наденет сам', when: all(tree42, flag('w.c42_tree')), minutes: 30, terminal: true, goto: 'c42_a_radio2',
        text: 'Ты поднимаешь, ребёнок тянется, звезда садится набок. Все хлопают. Набок так набок.', effects: [set42('ast', 'kid'), until42(48, 17, 50)] },
      { id: 'c42_ast_henrike', label: 'Отдать звезду Хенрике', when: all(tree42, flag('w.c42_tree'), henrike42), minutes: 30, terminal: true, goto: 'c42_a_radio2',
        text: 'Хенрике надевает звезду, стоя на табуретке, которую держишь ты. Слезает и говорит: «Mein Vater hat das immer gemacht». Мой отец всегда это делал.', effects: [set42('ast', 'henrike'), npc('henrike', 1), until42(48, 17, 50)] },
      { id: 'c42_ast_branch', label: 'Привязать звезду к ветке в банке', when: flag('w.c42_branch'), minutes: 30, terminal: true, goto: 'c42_a_radio2',
        text: 'Нитка, звезда, ветка. На подоконнике теперь что-то вроде ёлки. Никто не говорит, что это ёлка.', effects: [set42('ast', 'branch'), until42(48, 17, 50)] },
      { id: 'c42_ast_window', label: 'Повесить звезду на окно', minutes: 30, terminal: true, goto: 'c42_a_radio2',
        text: 'Звезда на нитке за стеклом. Вечером, когда зажгут свечи, её будет видно с дороги.', effects: [set42('ast', 'window'), until42(48, 17, 50)] },
    ] }),

  X({ id: 'c42_a_radio2', title: 'Эфир', camp: kitchen14,
    text: [
      { when: thomas34, text: 'Без десяти шесть. Приёмник на подоконнике. Красный Крест Винзена обещал Торонто.' },
      { when: all(thomas34, thomasAnswered), text: 'Если твой ответ дошёл, Томас его прочёл.' },
      { when: all(thomas34, not(thomasAnswered)), text: 'Ты ему так и не ответил{m:|а}.' },
      { when: not(thomas34), text: 'Шесть вечера. Красный Крест читает рождественские приветы: от тех, кто уехал, тем, кто остался.' },
    ],
    actions: [
      { id: 'c42_ar2_thomas', label: 'Слушать Томаса', when: thomas34, minutes: 45, terminal: true, goto: 'c42_fri_eve',
        outcomes: [
          { id: 'truth', when: v('w.c34_thomas', 'truth'),
            text: '— …an den Mann vom Lüdemann-Hof: Danke für die Wahrheit. Ich habe es gewusst. Jetzt kann ich sie begraben. Wenigstens hier, in meinem Kopf…\n\nМужчине с хутора Людеманов: спасибо за правду. Я знал. Теперь я могу их похоронить. Хотя бы здесь, у себя в голове.\n\nГолос срывается. Потом он читает другие имена.',
            effects: [set42('ar2', 'truth'), w42('thomas_heard', true), until42(48, 18, 30)] },
          { id: 'gentle', when: v('w.c34_thomas', 'gentle'),
            text: '— …an den Mann vom Lüdemann-Hof: Danke. Sie sind zusammen gegangen, schreiben Sie. Mehr wollte ich nicht wissen…\n\nМужчине с хутора Людеманов: спасибо. Вы пишете, они ушли вместе. Больше я ничего не хотел знать.\n\nТы сидишь у приёмника и не знаешь, хорошо ли {m:сделал|сделала}, что смягчил{m:|а}.',
            effects: [set42('ar2', 'gentle'), w42('thomas_heard', true), until42(48, 18, 30)] },
          { id: 'none',
            text: '— …Ilse und Gerd Brockmann, Buchholz. Wenn jemand etwas weiß…\n\nИльзе и Герд Брокман, Бухгольц. Если кто-то что-то знает.\n\nОн просит снова. Каждую пятницу, наверное.',
            effects: [set42('ar2', 'none'), w42('thomas_asks', true), until42(48, 18, 30)] },
        ] },
      { id: 'c42_ar2_reply', label: 'Записать, куда передать ответ Томасу', when: all(thomas34, not(thomasAnswered)), minutes: 45, terminal: true, goto: 'c42_fri_eve',
        text: 'Ты записываешь на ладони: «Rotes Kreuz Winsen, Suchdienst». Поисковая служба. Ответ можно передать в понедельник. Если решишься.', effects: [set42('ar2', 'reply'), w42('thomas_reply', true), until42(48, 18, 30)] },
      { id: 'c42_ar2_names', label: 'Слушать имена', when: not(thomas34), minutes: 45, terminal: true, goto: 'c42_fri_eve',
        text: 'Ханна из Мюнстера — маме в Букстехуде: я жива. Петер — Кларе: жди. Имена, имена. Ты не знаешь ни одного и всё равно слушаешь до конца.', effects: [set42('ar2', 'names'), until42(48, 18, 30)] },
      { id: 'c42_ar2_off', label: 'Не слушать: помочь накрыть на стол', minutes: 30, terminal: true, goto: 'c42_fri_eve',
        text: 'Ты расставляешь тарелки. Приёмник бормочет на подоконнике, и ты не разбираешь слов.', effects: [set42('ar2', 'off'), until42(48, 18, 20)] },
    ] }),
];
