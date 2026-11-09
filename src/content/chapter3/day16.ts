import type { Outcome, Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import {
  A16, B16, S16, brandt, day16, dusk16, garden16, jannes, jensAlive, koehler, nina, ninaAway, ninaHere, own16, tobias, ute, village16,
} from './point16';

// Участок 16: 16.11, после КТ15 (13:00) до КТ16 (21:30). A — в Йестебург и обратно, B — хутор.
const any = (...xs: Cond[]): Cond => ({ any: xs });
const help = garden16('help'), away = garden16('away'), tell = garden16('tell');
const quiet = any(help, away);
const split = (a: string, b: string) => [{ id: 'a', when: A16, goto: a }, { id: 'b', goto: b }];
const toVillage: Effect = { restUntil: at(16, 14, 20) };
const toBrandt: Effect = { restUntil: at(16, 15, 30) };
const toKoehler: Effect = { restUntil: at(16, 14, 30) };
const toJannes: Effect = { restUntil: at(16, 15, 10) };
const toDusk: Effect = { restUntil: at(16, 17) };
const toDinner: Effect = { restUntil: at(16, 18, 30) };
const toGate: Effect = { restUntil: at(16, 17, 30) };
const toLeave: Effect = { restUntil: at(16, 16) };
const toCp: Effect = { restUntil: at(16, 21, 30) };
const village = 'c16_jesteburg';
const lane = 'c7_farm_lane';
const sammel = 'c13_sammel';
// Чем A платит на обмене: своё, не общий запас хутора.
const pay = (then: string, texts: Record<'potato' | 'pills' | 'cash', string>, extra: Effect[] = []): Outcome[] => [
  { id: 'potato', when: all(own16('goods', 'potato'), { has: 'potatoes' }), goto: then, text: texts.potato, effects: [{ take: 'potatoes', qty: 3 }, ...extra] },
  { id: 'pills', when: all(own16('goods', 'pills'), { has: 'ibuprofen' }), goto: then, text: texts.pills, effects: [{ take: 'ibuprofen', qty: 2 }, ...extra] },
  { id: 'cash', when: { has: 'cash_eur' }, goto: then, text: texts.cash, effects: [{ take: 'cash_eur', qty: 15 }, ...extra] },
  { id: 'none', goto: then, text: 'Тебе нечего предложить. Женщина за столом пожимает плечами и отворачивается к следующему.' },
];

export const day16Scenes: Scene[] = [
  // ───────────── Общий разговор ─────────────
  S16({ id: 'c16_plan', for: 'any', chapter: 'ch3', title: 'Что теперь', camp: kitchen14,
    text: [
      { text: 'Вы сидите на кухне Хенрике, как будто она вышла на минуту. Часы на стене тикают громче, чем днём раньше.' },
      { text: 'Хутор теперь ваш, и всё на нём тоже. Бензина в Corsa на несколько поездок. У телефонов треть заряда. В сарае под брезентом стоит генератор Хенрике, пустой.' },
      { text: 'Кёлер говорила, что в Йестебурге по понедельникам меняются у пожарной части. С двух до пяти. Три километра.' },
      { when: A16, text: 'Идти лучше тебе: ты знаешь дорогу до пункта. {partner} остаётся на хуторе.' },
      { when: B16, text: '{A} пойдёт в деревню. Ты остаёшься на хуторе.' },
    ],
    actions: [
      { id: 'c16_pl_go', label: 'Собраться в Йестебург', when: A16, minutes: 5, terminal: true, goto: 'c16_a_pack',
        text: '{partner} кивает и подвигает к тебе кружку с остатком чая. Допивай.', effects: [{ set: '$.c16_pl', value: 'go' }] },
      { id: 'c16_pl_list', label: 'Сначала составить с {partner.ins} список', when: A16, minutes: 10, terminal: true, goto: 'c16_a_pack',
        text: 'Вы пишете на обороте календаря Хенрике: «Бензин. Батарейки. Соль. Новости». {partner} дописывает внизу: «Вернись до темноты».', effects: [{ set: '$.c16_pl', value: 'list' }] },
      { id: 'c16_pl_stay', label: 'Проводить {A.acc} до калитки', when: B16, minutes: 5, terminal: true, goto: 'c16_b_house',
        text: 'У калитки {A} оборачивается и поднимает руку. Потом дорога уходит за деревья, и {pm:его|её} больше не видно.', effects: [{ set: '$.c16_pl', value: 'stay' }] },
      { id: 'c16_pl_fuel', label: 'Попросить {A.acc} узнать про бензин для генератора', when: B16, minutes: 6, terminal: true, goto: 'c16_b_house',
        text: '— Литра три, — говоришь ты. — Хоть на вечер. — {A} кивает. Ты видишь, что {pm:он|она} уже прикидывает, на что менять.', effects: [{ set: '$.c16_pl', value: 'fuel' }] },
    ] }),

  // ───────────── Линия A: деревня ─────────────
  S16({ id: 'c16_a_pack', for: 'any', chapter: 'ch3', title: 'Что взять', camp: yard14, ambient: day16,
    text: [{ text: 'Деньги в деревне, говорила Кёлер, берут неохотно. Меняют то, что можно съесть, сжечь или выпить.\n\nОбщий запас ты не трогаешь: он на всех. Берёшь своё.' }],
    actions: [
      { id: 'c16_ap_potato', label: 'Взять свою картошку', when: { has: 'potatoes' }, minutes: 4, terminal: true, goto: 'c16_a_road',
        text: 'Три кило в пакете оттягивают рюкзак. Картошка с поля Хенрике. Здесь её узнают.', effects: [{ set: '$.c16_goods', value: 'potato' }] },
      { id: 'c16_ap_pills', label: 'Взять ибупрофен', when: { has: 'ibuprofen' }, minutes: 3, terminal: true, goto: 'c16_a_road',
        text: 'Таблетки сейчас дороже хлеба. Ты кладёшь две дозы во внутренний карман, отдельно от остальных.', effects: [{ set: '$.c16_goods', value: 'pills' }] },
      { id: 'c16_ap_cash', label: 'Взять деньги: вдруг ещё берут', minutes: 2, terminal: true, goto: 'c16_a_road',
        text: 'Купюры мятые, пахнут бензином из бардачка. Неделю назад на них можно было купить что угодно.', effects: [{ set: '$.c16_goods', value: 'cash' }] },
    ] }),

  S16({ id: 'c16_a_road', for: 'any', chapter: 'ch3', title: 'Дорога', location: lane, ambient: day16,
    text: [
      { text: 'Дорога к Йестебургу пустая. На обочине сгоревшая машина, давно остывшая. На берёзе у поворота фанера, написано краской: «Fremde bitte bei der Feuerwehr melden».\n\nЧужих просят отмечаться у пожарной части.' },
      { text: 'У последнего двора перед деревней старик чинит забор. Прибивает доску, не глядя на тебя.\n\n— Vom Lüdemann-Hof? — спрашивает он. — Wie geht\'s Henrike?\n\nС хутора Людеманов? Как там Хенрике?' },
    ],
    actions: [
      { id: 'c16_ar_truth', label: 'Сказать правду: уехала с Оле в пункт', minutes: 6, terminal: true, goto: 'c16_a_gate',
        text: 'Старик опускает молоток и смотрит на тебя поверх забора.\n\n— Mit dem Jungen, — говорит он. — Ja. Die lässt ihn nicht allein. — Снова начинает прибивать. — Grüßen Sie sie. Wenn sie wiederkommt.\n\nС сыном. Его она одного не оставит. Передайте привет, когда вернётся.', effects: [{ set: '$.c16_road', value: 'truth' }, toVillage] },
      { id: 'c16_ar_fine', label: 'Сказать: всё хорошо', minutes: 3, terminal: true, goto: 'c16_a_gate',
        text: '— Gut, — говорит старик. — Gut. — И смотрит тебе вслед дольше, чем нужно.', effects: [{ set: '$.c16_road', value: 'fine' }, toVillage] },
      { id: 'c16_ar_ask', label: 'Спросить, что в деревне', minutes: 6, terminal: true, goto: 'c16_a_gate',
        text: '— Brandt, — говорит старик, будто это ответ. — Der hat alles im Griff. Schreibt jeden auf. — Он сплёвывает гвоздь в ладонь. — Wie früher bei der Feuerwehr.\n\nБрандт. У него всё под контролем. Записывает каждого. Как раньше в пожарной команде.', effects: [{ set: '$.c16_road', value: 'ask' }, toVillage] },
    ] }),

  S16({ id: 'c16_a_gate', for: 'any', chapter: 'ch3', title: 'Йестебург', location: village, camp: village16, ambient: day16,
    text: [
      { text: 'Красные ворота пожарной части подняты. Машин внутри нет, вместо них столы в два ряда. Люди с сумками и тачками. У входа бочка с огнём, вокруг греют руки.' },
      { text: 'На входе парень лет двадцати с повязкой на рукаве и школьной тетрадью.\n\n— Name? Woher?' },
    ],
    actions: [
      { id: 'c16_ag_hof', label: 'Назваться и сказать: с хутора Людеманов', minutes: 3, terminal: true, goto: 'c16_a_market',
        text: 'Парень записывает и поднимает голову от тетради.\n\n— Henrikes Hof? — Он выпрямляется, будто вспомнил, что надо стоять ровно. — Dann gehen Sie rein.\n\nХутор Хенрике? Тогда проходите.', effects: [{ set: '$.c16_gate', value: 'hof' }] },
      { id: 'c16_ag_name', label: 'Назвать только имя', minutes: 3, terminal: true, goto: 'c16_a_market',
        text: '— Und woher? — Ты пожимаешь плечами. Парень смотрит на тебя, потом записывает: «Fremd». Чужой. Пропускает.', effects: [{ set: '$.c16_gate', value: 'name' }] },
      { id: 'c16_ag_why', label: 'Спросить, зачем этот список', minutes: 4, terminal: true, goto: 'c16_a_market',
        text: '— Damit wir wissen, wer lebt, — говорит парень. Без вызова. Будто объясняет дорогу. — Und wer nicht mehr.\n\nЧтобы знать, кто жив. И кто уже нет.\n\nТы называешь имя и хутор. Он записывает аккуратно, печатными буквами.', effects: [{ set: '$.c16_gate', value: 'why' }] },
    ] }),

  S16({ id: 'c16_a_market', for: 'any', chapter: 'ch3', title: 'Обмен', location: village, camp: village16, ambient: day16,
    text: [
      { text: 'На столах свечи, соль в банках, батарейки россыпью, мешок лука, детские сапоги. Мужчина с усами продаёт бензин из канистры, разливая через воронку в чужую тару. Табличка на картоне: «1 Liter — 6 Eier».' },
      { text: 'В углу подросток сидит у автомобильного аккумулятора с пучком проводов. «Handy laden: 30 Min — 1 Ei». Возле него очередь из четырёх человек.' },
      { when: { v: '$.c16_pl', op: '==', value: 'list' }, text: 'Список на обороте календаря у тебя в кармане. «Бензин. Батарейки. Соль. Новости».' },
    ],
    actions: [
      { id: 'c16_am_fuel', label: 'Сменять на бензин в свою канистру', when: { has: 'can_petrol_10' }, minutes: 15, terminal: true,
        outcomes: pay('c16_a_kerem0', {
          potato: 'Усатый взвешивает пакет на руке, заглядывает внутрь.\n\n— Lüdemann-Kartoffeln, — говорит он. — Die kenn ich. Zwei Liter.\n\nКартошка Людеманов. Знаю. Два литра.\n\nБензин булькает в канистру через воронку.',
          pills: 'Усатый вертит таблетки в пальцах. Смотрит на дату.\n\n— Für meine Frau, — говорит он. — Zwei Liter.\n\nДля жены. Два литра.',
          cash: 'Усатый долго смотрит на купюры. Потом всё-таки берёт.\n\n— Noch, — говорит он. — Nächste Woche nicht mehr.\n\nПока беру. На следующей неделе уже нет.\n\nДва литра булькают в канистру.',
        }, [{ fillCan: 'can_petrol_10', liters: 2 }, { set: '$.c16_fuel', value: true }]) },
      { id: 'c16_am_phone', label: 'Встать в очередь зарядить телефон', minutes: 35, terminal: true,
        outcomes: pay('c16_a_kerem0', {
          potato: 'Подросток соглашается на картошку, хотя хотел яйцо. Полчаса ты стоишь у его стола и смотришь, как растут проценты.',
          pills: 'Подросток соглашается на таблетку, хотя хотел яйцо. Полчаса ты стоишь у его стола и смотришь, как растут проценты.',
          cash: 'Подросток берёт деньги, морщась. Полчаса ты стоишь у его стола и смотришь, как растут проценты.',
        }, [{ charge: 'phone', delta: 18 }, { set: '$.c16_phone', value: true }]) },
      { id: 'c16_am_look', label: 'Ничего не менять, походить и послушать', minutes: 15, terminal: true, goto: 'c16_a_kerem0',
        text: 'Ты обходишь столы. Меняют без торга, быстро. Все друг друга знают. Чужих тут видно сразу: они слишком долго рассматривают.', effects: [{ set: '$.c16_market', value: 'look' }] },
    ] }),

  S16({ id: 'c16_a_stove', for: 'any', chapter: 'ch3', title: 'У бочки', location: village, camp: village16, ambient: day16,
    text: [
      { text: 'У бочки с огнём греются трое. Женщина в пуховике говорит громко, чтобы слышали все.' },
      { text: '— In Itzenbüttel. Gestern Abend. Ein Junge, elf Jahre. Ins Bein gebissen.\n\nВ Итценбюттеле. Вчера вечером. Мальчик, одиннадцать лет. Укусили за ногу.' },
      { when: quiet, text: '— An der Bahn, — говорит мужчина рядом. — Da hält eine Frau Kranke. An Ketten. Wie Hunde.\n\nУ насыпи. Там одна женщина держит больных. На цепях. Как собак.' },
      { when: tell, text: '— An der Bahn, — говорит мужчина рядом. — Die Armee hat\'s Brandt heute gesagt. Jemand vom Lüdemann-Hof hat\'s gemeldet.\n\nУ насыпи. Армия сегодня сказала Брандту. Кто-то с хутора Людеманов сообщил.\n\nНикто не смотрит на тебя. Пока.' },
      { text: '— Mittwoch räumt Brandt die Schienen, — говорит третий. — Mit der Armee.\n\nВ среду Брандт с армией очистит насыпь.' },
    ],
    actions: [
      { id: 'c16_as_listen', label: 'Молча греть руки и слушать', minutes: 8, terminal: true, goto: 'c16_a_brandt',
        text: 'Говорят про мальчика, про его мать, про то, что врач в пункте сделал, что мог. Про колонию больше ни слова. Будто уже решено.', effects: [{ set: '$.c16_stove', value: 'listen' }] },
      { id: 'c16_as_boy', label: 'Спросить, где сейчас мальчик', minutes: 5, terminal: true, goto: 'c16_a_brandt',
        text: '— Im Punkt, — говорит женщина в пуховике. — In der Schulturnhalle. Mit seiner Mutter.\n\nВ пункте. В школьном спортзале. С матерью.', effects: [{ set: '$.c16_stove', value: 'boy' }] },
      { id: 'c16_as_defend', label: 'Сказать: они на цепях и никого не кусают', minutes: 5, risky: true, terminal: true, goto: 'c16_a_brandt',
        text: 'Трое поворачиваются к тебе разом.\n\n— Woher wissen Sie das? — спрашивает женщина.\n\nОткуда вы знаете?\n\nТы не отвечаешь. Мужчина в куртке пожарного у ворот смотрит на тебя поверх голов. Потом идёт к бочке.', effects: [{ set: '$.c16_stove', value: 'defend' }, { body: 'stress', delta: 2 }] },
    ] }),

  S16({ id: 'c16_a_brandt', for: 'any', chapter: 'ch3', title: 'Брандт', location: village, camp: village16, ambient: day16,
    onEnter: [{ introduceNpc: 'c16_brandt' }, { set: '$.met.c16_brandt', value: true }],
    text: [
      { text: 'Мужчина лет шестидесяти, седые усы, тёмно-синяя куртка пожарной команды. На груди вышито: «Brandt». В руке такая же школьная тетрадь, только толще.\n\n— Sie sind vom Lüdemann-Hof, — говорит он. Не спрашивает.\n\nВы с хутора Людеманов.' },
      { when: own16('road', 'fine'), text: '— Der alte Wiese sagt, Henrike geht\'s gut. — Он смотрит на тебя. — Henrike ist in Lüneburg. Das weiß ich vom Doktor.\n\nСтарый Визе говорит, у Хенрике всё хорошо. Хенрике в Люнебурге. Я знаю от врача.' },
      { when: own16('stove', 'defend'), text: '— An Ketten, sagen Sie. Und Sie wissen das woher?\n\nНа цепях, говорите. А вы откуда знаете?' },
      { when: tell, text: '— Danke für die Meldung, — говорит он. — Mittwoch, acht Uhr. Mit den Soldaten. Wir machen das ordentlich.\n\nСпасибо, что сообщили. В среду, в восемь. С солдатами. Сделаем всё как положено.' },
      { when: quiet, text: '— Heute früh hat mir jemand gesagt, wo. Mittwoch, acht Uhr. Mit den Soldaten. — Он открывает тетрадь. — Sie wohnen daneben. Was haben Sie gesehen?\n\nСегодня утром мне сказали, где это. В среду, в восемь, с солдатами. Вы живёте рядом. Что вы видели?' },
    ],
    actions: [
      { id: 'c16_ab_lie', label: 'Сказать, что вы ничего не знаете', minutes: 4, terminal: true, goto: 'c16_a_bell',
        text: 'Брандт закрывает тетрадь.\n\n— Wie Sie meinen. — Ни злости, ни удивления. — Der Junge liegt im Punkt. Falls Sie\'s sich ansehen wollen.\n\nКак скажете. Мальчик лежит в пункте. Если захотите посмотреть.', effects: [{ set: '$.c16_ab', value: 'lie' }, brandt(-1), toBrandt] },
      { id: 'c16_ab_truth', label: 'Рассказать, как там на самом деле', minutes: 10, terminal: true, goto: 'c16_a_bell',
        text: 'Ты рассказываешь: цепи, шлемы, вёдра воды, имена на дверях. Женщина, которая с каждым здоровается.\n\nБрандт слушает, не перебивая. Потом говорит:\n\n— Und wenn einer sich losreißt? — Он кивает в сторону школы. — Gehen Sie hin. Sehen Sie sich den Jungen an. Dann reden wir weiter.\n\nА если один сорвётся? Сходите туда. Посмотрите на мальчика. Потом поговорим.', effects: [{ set: '$.c16_ab', value: 'truth' }, brandt(2), toBrandt] },
      { id: 'c16_ab_boy', label: 'Спросить, точно ли мальчика укусил кто-то оттуда', minutes: 6, terminal: true, goto: 'c16_a_bell',
        text: '— Wer denn sonst? — Брандт не повышает голоса. — Von dort sind es drei Kilometer.\n\nА кто ещё? Оттуда три километра.\n\nПауза.\n\n— Gehen Sie in den Punkt. Fragen Sie die Mutter. Sie wird Ihnen dasselbe sagen.\n\nСходите в пункт. Спросите мать. Она скажет то же самое.', effects: [{ set: '$.c16_ab', value: 'boy' }, brandt(1), toBrandt] },
    ] }),

  S16({ id: 'c16_a_boy', for: 'any', chapter: 'ch3', title: 'Спортзал', location: sammel, ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'Спортзал школы пахнет хлоркой и мокрой шерстью. Раскладушки рядами под баскетбольными кольцами.' },
      { when: all({ v: 'w.c13_leo', op: '==', value: 'drive' }, { npc: 'c12_leo', alive: true, at: 'c13_sammel' }), text: 'Вчера вы привезли сюда Маркуса и Лео. Лео сидит на раскладушке у дальней стены, с зайцем на коленях, и машет тебе. Маркус спит рядом, сидя, прислонившись к стене.' },
      { text: 'Мальчик лежит у шведской стенки. Нога забинтована от колена до щиколотки. Рядом мать, сидит на полу, держит его за руку.\n\n— Sonntagabend, — говорит она, когда ты спрашиваешь. — An der Bushaltestelle. Ein Mann, barfuß. Im Krankenhaushemd. Er hatte ein Armband.\n\nВ воскресенье вечером. На остановке. Мужчина, босой. В больничной рубашке. С браслетом на руке.\n\nОна достаёт из кармана куртки пластиковую ленту с застёжкой. Сорвала, когда отбивала сына. «Klinikum Buchholz. Station 4».' },
    ],
    actions: [
      { id: 'c16_aby_band', label: 'Попросить браслет: показать Брандту', minutes: 5, terminal: true, goto: 'c16_a_mother',
        text: 'Мать смотрит на браслет, потом на тебя.\n\n— Nehmen Sie, — говорит она. — Ich will ihn nicht mehr sehen.\n\nВозьмите. Не хочу его больше видеть.\n\nБраслет лёгкий. Застёжка сломана.', effects: [{ set: '$.c16_aby', value: 'band' }, { give: 'c16_wristband', qty: 1 }] },
      { id: 'c16_aby_photo', label: 'Сфотографировать браслет', minutes: 3, terminal: true, goto: 'c16_a_mother',
        text: 'Ты фотографируешь браслет на её ладони. Надпись читается. Дата поступления тоже: «09.11».', effects: [{ set: '$.c16_aby', value: 'photo' }, { charge: 'phone', delta: -1 }] },
      { id: 'c16_aby_look', label: 'Только посмотреть и запомнить', minutes: 3, terminal: true, goto: 'c16_a_mother',
        text: 'Station 4. Klinikum Buchholz. Девятое ноября. Ты повторяешь про себя, пока не запоминаешь.', effects: [{ set: '$.c16_aby', value: 'look' }] },
    ] }),

  S16({ id: 'c16_a_mother', for: 'any', chapter: 'ch3', title: 'Мать', location: sammel, ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { text: 'Колония у насыпи в другой стороне, за путями. Тот, кто укусил мальчика, пришёл не оттуда. Он пришёл из больницы в Бухгольце, босиком, по холоду.' },
      { text: 'Мальчик открывает глаза и смотрит на тебя. Лоб у него мокрый.' },
    ],
    actions: [
      { id: 'c16_am_who', label: 'Спросить мать, знает ли она Брандта', minutes: 5, terminal: true, outcomes: [{ id: 'leo', when: all({ v: 'w.c13_leo', op: '==', value: 'drive' }, { npc: 'c12_leo', alive: true, at: 'c13_sammel' }, { npc: 'c12_marcus', alive: true, at: 'c13_sammel' }), goto: 'c16_a_leo' }, { id: 'doc', goto: 'c16_a_doctor' }],
        text: 'Женщина смеётся, коротко и устало.\n\n— Das ist mein Vater, — говорит она. — Er hat mich heute früh dreimal gefragt, ob es von der Bahn war. Ich habe gesagt: weiß nicht.\n\nЭто мой отец. Сегодня утром трижды спрашивал, не с насыпи ли это. Я сказала: не знаю.', effects: [{ set: '$.c16_mother', value: 'who' }] },
      { id: 'c16_am_pills', label: 'Отдать ей ибупрофен для мальчика', when: { has: 'ibuprofen' }, minutes: 3, terminal: true, outcomes: [{ id: 'leo', when: all({ v: 'w.c13_leo', op: '==', value: 'drive' }, { npc: 'c12_leo', alive: true, at: 'c13_sammel' }, { npc: 'c12_marcus', alive: true, at: 'c13_sammel' }), goto: 'c16_a_leo' }, { id: 'doc', goto: 'c16_a_doctor' }],
        text: 'Она берёт таблетки обеими руками.\n\n— Danke, — говорит она. — Gegen das Fieber.\n\nСпасибо. От температуры.\n\nТы не говоришь, что от этой температуры не помогает. Она и сама знает.', effects: [{ set: '$.c16_mother', value: 'pills' }, { take: 'ibuprofen', qty: 2 }] },
      { id: 'c16_am_leave', label: 'Пожелать им удачи и уйти', minutes: 2, terminal: true, outcomes: [{ id: 'leo', when: all({ v: 'w.c13_leo', op: '==', value: 'drive' }, { npc: 'c12_leo', alive: true, at: 'c13_sammel' }, { npc: 'c12_marcus', alive: true, at: 'c13_sammel' }), goto: 'c16_a_leo' }, { id: 'doc', goto: 'c16_a_doctor' }],
        text: 'Мать кивает, не глядя. Мальчик провожает тебя глазами до самой двери.', effects: [{ set: '$.c16_mother', value: 'leave' }] },
    ] }),

  S16({ id: 'c16_a_back', for: 'any', chapter: 'ch3', title: 'Обратно', location: lane, ambient: dusk16,
    text: [
      { text: 'Ты выходишь из деревни в четыре. Солнце уже за лесом. До темноты полчаса, до хутора три километра.' },
      { text: 'Слева, за полем, видна насыпь. По ней можно дойти до колонии, а оттуда по шпалам домой. Почти вдвое дольше.' },
    ],
    actions: [
      { id: 'c16_aba_road', label: 'Идти домой по дороге, пока светло', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c16_a_home',
        text: 'Ты идёшь быстро. На последнем километре темнеет совсем. Хутор узнаёшь по окну кухни.', effects: [{ set: '$.c16_aba', value: 'road' }] },
      { id: 'c16_aba_rails', label: 'Свернуть к насыпи и зайти к Уте', minutes: 50, activity: 'moderate', move: true, terminal: true, goto: 'c16_a_colony',
        text: 'Ты идёшь через поле к насыпи. По шпалам до колонии ещё двадцать минут. Над одной из крыш поднимается дым.', effects: [{ set: '$.c16_aba', value: 'rails' }] },
    ] }),

  S16({ id: 'c16_a_colony', for: 'any', chapter: 'ch3', title: 'Одиннадцать', location: 'c15_garden', ambient: dusk16,
    text: [
      { text: 'В колонии тихо. Яннеса не видно. Из домика одиннадцать слышно пение. Женский голос, старая песня, по-немецки.' },
      { text: 'Ставня открыта. Уте сидит на табуретке у самой цепи. Кай на матрасе раскачивается. Цепи на ноге у него нет. Вокруг пояса верёвка, привязанная к трубе батареи.\n\n— Er hat mich angesehen, — говорит Уте, не оборачиваясь. — Heute. Zweimal.\n\nОн на меня посмотрел. Сегодня. Два раза.' },
    ],
    actions: [
      { id: 'c16_aco_warn', label: 'Сказать ей про среду и Брандта', minutes: 8, terminal: true, goto: 'c16_a_home',
        text: 'Уте слушает и продолжает гладить верёвку, как поводок.\n\n— Mittwoch, — повторяет она. — Dann gehen wir vorher spazieren. Er und ich.\n\nВ среду. Тогда мы погуляем раньше. Он и я.\n\nОбратно ты идёшь по шпалам почти в темноте. Это «погуляем» идёт за тобой всю дорогу.', effects: [{ set: '$.c16_col', value: 'warn' }, ute(1), { restUntil: at(16, 18, 10) }] },
      { id: 'c16_aco_chain', label: 'Сказать, чтобы надела цепь обратно', minutes: 6, risky: true, terminal: true, goto: 'c16_a_home',
        text: '— Die Kette tut ihm weh, — говорит Уте. Голос ровный. — Er hat eine Wunde am Knöchel. Sehen Sie?\n\nЦепь натирает ему. У него рана на щиколотке. Видите?\n\nТы видишь. И видишь, что верёвка завязана бантиком.', effects: [{ set: '$.c16_col', value: 'chain' }, ute(-1), { restUntil: at(16, 18, 10) }] },
      { id: 'c16_aco_leave', label: 'Уйти, не мешая', minutes: 3, terminal: true, goto: 'c16_a_home',
        text: 'Ты отходишь от ставни. Песня продолжается. Ты слышишь её, пока не выходишь на насыпь.', effects: [{ set: '$.c16_col', value: 'leave' }, { restUntil: at(16, 18, 10) }] },
    ] }),

  S16({ id: 'c16_a_home', for: 'any', chapter: 'ch3', title: 'Дома', camp: yard14, ambient: dusk16,
    text: [
      { text: 'Во дворе темно. На кухне горит свет. Ты стоишь у калитки минуту, прежде чем войти.' },
      { when: { has: 'c16_wristband' }, text: 'Браслет лежит в кармане. Ты то и дело трогаешь его пальцами.' },
      { when: flag('$.c16_fuel'), text: 'Канистра с двумя литрами оттянула руку. Ты ставишь её у сарая.' },
    ],
    actions: [
      { id: 'c16_ah_in', label: 'Войти в дом и помочь {partner.dat} с ужином', minutes: 2, terminal: true, goto: 'c16_a_gatefix',
        text: 'Ты отогреваешься у печки, потом чистишь картошку. {partner} рассказывает про свой день, ты слушаешь вполуха: в голове ещё деревня.', effects: [{ set: '$.c16_ah', value: 'in' }, toGate] },
      { id: 'c16_ah_gate', label: 'Сначала проверить заднюю калитку', minutes: 6, terminal: true, goto: 'c16_a_gatefix',
        text: 'Крючок на месте. За калиткой поле, за полем насыпь. Ни огонька.', effects: [{ set: '$.c16_ah', value: 'gate' }, toGate] },
    ] }),

  // ───────────── Линия B: хутор ─────────────
  S16({ id: 'c16_b_house', for: 'any', chapter: 'ch3', title: 'Тихий дом', camp: kitchen14,
    text: [
      { when: all(ninaHere, jensAlive), text: 'Нина сидит наверху на раскладушке и пишет что-то в тетради по биологии. Когда ты заглядываешь, она закрывает тетрадь, но не прячет.\n\n— Это папе, — говорит она. — На среду. Можно я спрошу, как правильно?' },
      { when: all(ninaHere, not(jensAlive)), text: 'Нина сидит наверху на раскладушке и пишет что-то в тетради по биологии. Когда ты заглядываешь, она закрывает тетрадь, но не прячет.\n\n— Это папе, — говорит она. — Положу под яблоню. Можно я спрошу, как правильно?' },
      { when: ninaAway, text: 'Без Нины в доме тихо. Её кружка стоит на краю стола. Телефон вибрирует: «Angekommen. Lena hat ein Bett für mich. Danke für alles».\n\nДоехала. У Лены есть для меня кровать. Спасибо за всё.' },
    ],
    actions: [
      { id: 'c16_bh_help', label: 'Помочь Нине с письмом', when: ninaHere, minutes: 15, terminal: true, goto: 'c16_b_gen',
        text: '— «Ich vermisse dich» или «Du fehlst mir»? — спрашивает Нина. — Это одно и то же. Только второе — как будто дырка.\n\nОна пишет второе.', effects: [{ set: '$.c16_bh', value: 'help' }, nina(1)] },
      { id: 'c16_bh_leave', label: 'Сказать: пиши сама, как чувствуешь', when: ninaHere, minutes: 4, terminal: true, goto: 'c16_b_gen',
        text: 'Нина кивает и снова открывает тетрадь. Когда ты выходишь, она уже пишет, наклонив голову так низко, что волосы касаются страницы.', effects: [{ set: '$.c16_bh', value: 'leave' }] },
      { id: 'c16_bh_reply', label: 'Ответить Нине', when: ninaAway, minutes: 4, terminal: true, goto: 'c16_b_gen',
        effects: [{ set: '$.c16_bh', value: 'reply' }, { charge: 'phone', delta: -1 }, nina(1)],
        text: 'Ты пишешь: «Мы рядом. Если что — звони». Ответ приходит сразу: «Mittwoch komme ich zu Papa. Holt ihr mich ab?»\n\nВ среду я хочу к папе. Заберёте меня?' },
      { id: 'c16_bh_cup', label: 'Убрать её кружку на полку', when: ninaAway, minutes: 2, terminal: true, goto: 'c16_b_gen',
        text: 'Ты моешь кружку и ставишь на полку, ручкой наружу, как стояла. Потом телефон вибрирует ещё раз: «Holt ihr mich Mittwoch ab? Für Papa».\n\nЗаберёте меня в среду? К папе.', effects: [{ set: '$.c16_bh', value: 'cup' }] },
    ] }),

  S16({ id: 'c16_b_gen', for: 'any', chapter: 'ch3', title: 'Генератор', camp: yard14, ambient: day16,
    text: [
      { text: 'Генератор стоит в сарае под брезентом. Красный, на колёсах, с ручкой, как у тачки. На баке мелом рука Дениза: «Öl prüfen!! D.»\n\nБак пустой. Бензин есть только в Corsa.' },
    ],
    actions: [
      { id: 'c16_bg_oil', label: 'Сначала проверить масло, как написал Дениз', minutes: 12, activity: 'light', terminal: true, goto: 'c16_b_gen2',
        text: 'Щуп сухой. На полке банка моторного масла, Хенрике подписала: «Für den Generator». Ты доливаешь, пока щуп не темнеет до риски.', effects: [{ set: '$.c16_oil', value: true }] },
      { id: 'c16_bg_look', label: 'Просто сдёрнуть брезент и посмотреть', minutes: 5, terminal: true, goto: 'c16_b_gen2',
        text: 'Под брезентом пыль и мышиный помёт. Шнур стартера целый. Свеча на месте. Выглядит так, будто вчера работал.', effects: [{ set: '$.c16_oil', value: false }] },
    ] }),

  S16({ id: 'c16_b_gen2', for: 'any', chapter: 'ch3', title: 'Бензин', camp: yard14, ambient: day16,
    text: [
      { text: 'В сарае на крюке висит прозрачный шланг. Хенрике, видно, сливала из трактора, пока трактор был.\n\nТри литра из Corsa — вечер со светом и зарядкой и ещё утро. И на три литра меньше в баке.' },
      { when: { v: 'B.c15_fuel', op: '==', value: 'count' }, text: 'Утром ты считал{m:|а}: Винзен туда и обратно, или Бухгольц, или дважды Йестебург. На всё сразу не хватит.' },
    ],
    actions: [
      { id: 'c16_bg2_siphon', label: 'Слить из Corsa три литра', minutes: 20, activity: 'light', terminal: true, goto: 'c16_b_cellar',
        text: 'Ты засасываешь бензин через шланг и сразу сплёвываешь. Вкус держится во рту полчаса. Три литра в ведре, потом в бак генератора. Заведёшь, когда стемнеет.', effects: [{ set: '$.c16_gen', value: 'siphon' }, { siphon: 'opel_corsa', liters: 3 }, { set: 'w.c16_gen', value: true }, { body: 'stress', delta: 1 } ] },
      { id: 'c16_bg2_keep', label: 'Не трогать машину: бензин на дорогу', minutes: 3, terminal: true, goto: 'c16_b_cellar',
        text: 'Ты накрываешь генератор брезентом обратно. Вечером будут свечи. Машина важнее.', effects: [{ set: '$.c16_gen', value: 'keep' } ] },
    ] }),

  S16({ id: 'c16_b_koehler', for: 'any', chapter: 'ch3', title: 'Мука', camp: yard14, ambient: day16,
    onEnter: [{ set: '$.met.c3_koehler', value: true }],
    text: [
      { when: own16('cel', 'know'), text: 'Понедельник. «Elke K. — Mo». Теперь ты знаешь, почему она пришла именно сегодня.' },
      { text: 'В половине третьего у калитки фрау Кёлер. С ней детские санки, на санках мешок.\n\n— Mehl, — говорит она. — Roggen. Für Eier.\n\nМука. Ржаная. На яйца.' },
      { text: 'Под глазами у неё тёмные круги. Она не смотрит на насыпь. Старается не смотреть.' },
    ],
    actions: [
      { id: 'c16_bk_trade', label: 'Сменять шесть яиц на кило муки', when: { stocked: 'eggs', qty: 1, at: 'c3_farm_stock' }, minutes: 8, terminal: true, goto: 'c16_b_koehler2',
        text: 'Кёлер укладывает яйца в шапку, по одному, как в гнездо. Мешочек муки ты ставишь в кладовку.', effects: [{ set: '$.c16_bk', value: 'trade' }, { unstock: 'eggs', qty: 1, at: 'c3_farm_stock' }, { take: 'eggs', qty: 1 }, { place: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, koehler(1)] },
      { id: 'c16_bk_gift', label: 'Отдать яйца просто так', when: { stocked: 'eggs', qty: 1, at: 'c3_farm_stock' }, minutes: 6, terminal: true, goto: 'c16_b_koehler2',
        text: 'Кёлер держит яйца и не уходит.\n\n— Nein, — говорит она. — So nicht. — И всё-таки оставляет мешочек муки на крыльце. Не спрашивает.\n\nНет. Так не надо.', effects: [{ set: '$.c16_bk', value: 'gift' }, { unstock: 'eggs', qty: 1, at: 'c3_farm_stock' }, { take: 'eggs', qty: 1 }, { place: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, koehler(2)] },
      { id: 'c16_bk_share', label: 'Отдать понедельничную долю, как Хенрике', when: all(own16('cel', 'share'), { stocked: 'potatoes', qty: 1, at: 'c3_farm_stock' }), minutes: 8, terminal: true, goto: 'c16_b_koehler2',
        text: 'Ты выносишь картошку в пакете. Кёлер смотрит на пакет, потом на тебя.\n\n— Henrike hat dir das gesagt? — Голос у неё садится. — Sie hat nie darüber geredet. Nie.\n\nХенрике тебе сказала? Она никогда об этом не говорила. Никогда.\n\nМешок муки она оставляет у двери. Не спрашивает.', effects: [{ set: '$.c16_bk', value: 'share' }, { unstock: 'potatoes', qty: 1, at: 'c3_farm_stock' }, { take: 'potatoes', qty: 1 }, { place: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, koehler(3)] },
      { id: 'c16_bk_tea', label: 'Позвать её на кухню согреться', minutes: 15, terminal: true, goto: 'c16_b_koehler2',
        text: 'Кёлер садится у печки и снимает перчатки. Пальцы у неё белые от холода. Мешок она оставляет у двери, будто забыла.', effects: [{ set: '$.c16_bk', value: 'tea' }, { place: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, koehler(1)] },
    ] }),

  S16({ id: 'c16_b_koehler2', for: 'any', chapter: 'ch3', title: 'Я сказала', camp: kitchen14,
    text: [
      { when: quiet, text: 'Кёлер долго молчит. Потом говорит, глядя в стол:\n\n— Heute früh war Brandt bei mir. Wegen des Jungen in Itzenbüttel. Ich habe ihm gesagt, wo die Kolonie ist.\n\nСегодня утром у меня был Брандт. Из-за мальчика в Итценбюттеле. Я сказала ему, где колония.\n\nОна поднимает глаза.\n\n— Mein Bruder ist da. Parzelle vier. Ich weiß nicht, was ich wollte.\n\nТам мой брат. Четвёртая парцелла. Не знаю, чего я хотела.' },
      { when: tell, text: 'Кёлер говорит, глядя в стол:\n\n— Brandt war heute früh bei mir. Er wusste es schon. Von der Armee. Er hat nur gefragt, wer dort ist. Ich habe gesagt: mein Bruder. Parzelle vier.\n\nУтром у меня был Брандт. Он уже знал. От армии. Спросил только, кто там. Я сказала: мой брат. Четвёртая парцелла.\n\nПро вас она ничего не говорит. Но знает. Это видно.' },
      { text: '— Ich will ihn sehen, — говорит она. — Vor Mittwoch. Einmal. Allein schaffe ich das nicht.\n\nХочу его увидеть. До среды. Один раз. Одна не смогу.' },
    ],
    actions: [
      { id: 'c16_bk2_go', label: 'Пообещать сходить с ней завтра утром', minutes: 4, terminal: true, goto: 'c16_b_jannes',
        text: 'Кёлер кивает и надевает перчатки.\n\n— Um neun, — говорит она. — Ich komme her.\n\nВ девять. Я приду сюда.', effects: [{ set: '$.c16_bk2', value: 'go' }, set17('koehler_walk', true), koehler(2), toJannes] },
      { id: 'c16_bk2_why', label: 'Спросить, зачем она сказала Брандту', when: quiet, minutes: 6, terminal: true, goto: 'c16_b_jannes',
        text: '— Weil er Kinder hat. Enkel. — Кёлер мнёт перчатку. — Und weil ich jede Nacht höre, wie die Ketten klirren. Bis hierher. Das ist nicht wahr, ich weiß. Ich höre es trotzdem.\n\nПотому что у него внуки. И потому что каждую ночь слышу, как звенят цепи. Досюда. Я знаю, что это неправда. Всё равно слышу.\n\nУходя, она говорит: «Morgen um neun. Wenn ihr mitkommt». Завтра в девять, если пойдёте со мной.', effects: [{ set: '$.c16_bk2', value: 'why' }, set17('koehler_walk', true), koehler(1), toJannes] },
      { id: 'c16_bk2_nina', label: 'Напомнить, что там отец Нины', when: jensAlive, minutes: 5, risky: true, terminal: true, goto: 'c16_b_jannes',
        text: 'Кёлер вздрагивает.\n\n— Ich weiß, — говорит она тихо. — Ich weiß.\n\nЗнаю. Знаю.\n\nОна уходит, не допив чай. У калитки останавливается и, не оборачиваясь, говорит: «Morgen um neun». Завтра в девять.', effects: [{ set: '$.c16_bk2', value: 'nina' }, set17('koehler_walk', true), koehler(-1), toJannes] },
    ] }),

  S16({ id: 'c16_b_jannes', for: 'any', chapter: 'ch3', title: 'Канистры', camp: yard14, ambient: day16,
    onEnter: [{ set: '$.met.c14_jannes', value: true }],
    text: [
      { text: 'В начале четвёртого к задней калитке подходит Яннес. Тачка, на ней четыре пустые канистры.\n\n— Die Pumpe ist kaputt, — говорит он. — Der Schwengel. Abgebrochen. Heute brauchen sie Wasser.\n\nНасос сломался. Ручка отломилась. А воду им нужно сегодня.' },
      { when: help, text: '— Ich weiß, ihr habt Mittwoch gesagt, — добавляет он. — Aber heute.\n\nЗнаю, вы говорили про среду. Но нужно сегодня.' },
      { when: away, text: '— Ich weiß, ihr wollt nichts damit zu tun haben, — говорит он. — Ich frage trotzdem.\n\nЗнаю, вы не хотите в это лезть. Всё равно спрашиваю.' },
      { when: tell, text: 'Он не здоровается.\n\n— Mittags war ein Wagen da. Haben alles aufgeschrieben. Mama hat ihnen Kaffee angeboten.\n\nВ обед приезжала машина. Всё записали. Мама предложила им кофе.' },
      { when: { v: 'A.c15_water', op: '==', value: 'colony' }, text: 'У задней калитки стоят две полные канистры, которые {A} налил{pm:|а} вчера. На всякий случай.' },
    ],
    actions: [
      { id: 'c16_bj_ready', label: 'Отдать две полные канистры у калитки', when: { v: 'A.c15_water', op: '==', value: 'colony' }, minutes: 5, terminal: true, goto: 'c16_b_jannes2',
        text: 'Яннес грузит канистры на тачку и смотрит на тебя.\n\n— Ihr habt das vorbereitet? — Он не ждёт ответа. — Danke.\n\nВы это заранее приготовили? Спасибо.', effects: [{ set: '$.c16_bj', value: 'ready' }, jannes(2), ute(1)] },
      { id: 'c16_bj_fill', label: 'Наполнить его канистры из колодца', minutes: 30, activity: 'heavy', terminal: true, goto: 'c16_b_jannes2',
        text: 'Вы качаете по очереди. Ведро, воронка, канистра. Яннес работает молча и быстро. Восемьдесят литров. Тачка просаживается на колесе.', effects: [{ set: '$.c16_bj', value: 'fill' }, jannes(2), ute(1)] },
      { id: 'c16_bj_no', label: 'Отказать: колодец один, а зима длинная', minutes: 4, terminal: true, goto: 'c16_b_jannes2',
        text: 'Яннес кивает, будто так и думал.\n\n— Okay, — говорит он. — Dann hole ich vom Bach.\n\nЛадно. Тогда наберу в ручье.\n\nОн разворачивает тачку, но не уходит.', effects: [{ set: '$.c16_bj', value: 'no' }, jannes(-1)] },
    ] }),

  S16({ id: 'c16_b_jannes2', for: 'any', chapter: 'ch3', title: 'Про маму', camp: yard14, ambient: day16,
    text: [{ text: 'Яннес стоит у калитки и мнёт в руках пустую пачку от сигарет.\n\n— Mama hat Papa die Kette vom Bein genommen, — говорит он. — Letzte Nacht. Nur noch ein Seil um den Bauch. Sie sagt, er hat sie angesehen.\n\nМама сняла с папы цепь с ноги. Вчера ночью. Только верёвка вокруг пояса. Говорит, он на неё посмотрел.\n\nОн смотрит на свои ботинки.\n\n— Sagt ihr nicht, dass ich es erzählt habe.\n\nНе говорите ей, что это я рассказал.' }],
    actions: [
      { id: 'c16_bj2_go', label: 'Пойти с ним в колонию: помочь довезти воду', when: not(own16('bj', 'no')), minutes: 4, terminal: true, goto: 'c16_b_cw_road',
        text: 'Яннес смотрит на тебя, потом на дом.\n\n— Echt? — говорит он. Правда? — И подвигается, чтобы ты взял{m:ся|ась} за вторую ручку тачки.', effects: [{ set: '$.c16_bj2', value: 'go' }, { set: '$.c16_route', value: 'colony' }, jannes(2)] },
      { id: 'c16_bj2_promise', label: 'Пообещать молчать', minutes: 3, terminal: true, goto: 'c16_b_nina2',
        text: 'Яннес кивает и уходит через поле. Тачка скрипит. Ты смотришь, пока он не поднимается на насыпь.', effects: [{ set: '$.c16_bj2', value: 'promise' }, jannes(1)] },
      { id: 'c16_bj2_chain', label: 'Сказать: надень цепь обратно сам, ночью', minutes: 5, risky: true, terminal: true, goto: 'c16_b_nina2',
        text: '— Sie schläft bei ihm, — говорит Яннес. — Auf dem Stuhl. Wie soll ich?\n\nОна спит при нём. На стуле. Как я надену?\n\nОн уходит, не попрощавшись.', effects: [{ set: '$.c16_bj2', value: 'chain' }] },
      { id: 'c16_bj2_knife', label: 'Спросить, что он сделает, если отец сорвётся', minutes: 5, terminal: true, goto: 'c16_b_nina2',
        text: 'Яннес кладёт ладонь на нож на поясе. Потом убирает.\n\n— Ich weiß es nicht, — говорит он. — Ehrlich. Ich weiß es nicht.\n\nНе знаю. Честно. Не знаю.', effects: [{ set: '$.c16_bj2', value: 'knife' }, jannes(1)] },
    ] }),

  S16({ id: 'c16_b_hens', for: 'any', chapter: 'ch3', title: 'До темноты', camp: yard14, ambient: dusk16,
    text: [
      { text: 'Солнце садится за насыпь. Куры сами идут в курятник, все десять, по одной, будто их кто-то считает.' },
      { when: ninaHere, text: 'Нина выходит на крыльцо в куртке и смотрит туда же, куда ты. На насыпь.' },
    ],
    actions: [
      { id: 'c16_bhe_eggs', label: 'Собрать яйца и закрыть курятник', minutes: 15, activity: 'light', terminal: true, goto: 'c16_b_dusk',
        text: 'В гнёздах шесть яиц, одно ещё тёплое. Ты закрываешь курятник на засов. Хенрике так делала каждый вечер. Теперь ты.', effects: [{ set: '$.c16_bhe', value: 'eggs' }, { place: 'eggs', qty: 1, at: 'c3_farm_stock' }, toDusk] },
      { id: 'c16_bhe_wood', label: 'Натаскать дров на ночь', minutes: 20, activity: 'moderate', terminal: true, goto: 'c16_b_dusk',
        text: 'Ты носишь, пока у печи не вырастает поленница по колено. Последнюю охапку уже в темноте, на ощупь.', effects: [{ set: '$.c16_bhe', value: 'wood' }, toDusk] },
      { id: 'c16_bhe_rails', label: 'Посмотреть с крыльца на насыпь', minutes: 10, terminal: true, goto: 'c16_b_dusk',
        effects: [{ set: '$.c16_bhe', value: 'rails' }, toDusk],
        text: 'По насыпи ползёт красный огонёк. Яннес везёт тачку домой. Огонёк останавливается, потом ползёт дальше.' },
    ] }),

  S16({ id: 'c16_b_dusk', for: 'any', chapter: 'ch3', title: 'Свет', camp: house14,
    text: [
      { when: flag('w.c16_gen'), text: 'Ты дёргаешь шнур. Раз, другой. На третий генератор кашляет и начинает тарахтеть, ровно и громко. На кухне загорается лампа. Розетки снова работают.' },
      { when: all(flag('w.c16_gen'), not(flag('$.c16_oil'))), text: 'Из выхлопа идёт сизый дым, пахнет горелым маслом. Дениз не зря писал.' },
      { when: all(flag('w.c16_gen'), ninaHere), text: 'Нина смеётся, впервые за два дня. Ставит телефон на зарядку и смотрит на него, как на огонь.' },
      { when: not(flag('w.c16_gen')), text: 'Темнеет быстро. Генератор молчит в сарае под брезентом. В доме только печь.' },
    ],
    actions: [
      { id: 'c16_bd_lamp', label: 'Поставить телефоны на зарядку и накрыть на стол', when: flag('w.c16_gen'), minutes: 10, terminal: true, goto: 'c16_b_utesms',
        text: 'Ты ставишь на стол тарелки и смотришь, как на экране ползут проценты. До десяти часов можно не экономить.', effects: [{ set: '$.c16_bd', value: 'lamp' } ] },
      { id: 'c16_bd_candle', label: 'Зажечь свечу', when: { has: 'candles' }, minutes: 3, terminal: true, goto: 'c16_b_utesms',
        text: 'Свеча горит ровно. На стенах кухни качаются тени. Ты ставишь её на стол, туда, где обычно сидела Хенрике.', effects: [{ set: '$.c16_bd', value: 'candle' }, { take: 'candles', qty: 1 } ] },
      { id: 'c16_bd_stove', label: 'Открыть дверцу печи и сидеть при её свете', minutes: 5, terminal: true, goto: 'c16_b_utesms',
        text: 'Огонь в печи даёт мало света, но тёплого. Ты сидишь на корточках у дверцы, пока не затекают ноги.', effects: [{ set: '$.c16_bd', value: 'stove' } ] },
    ] }),

  // ───────────── Вечер вдвоём ─────────────
  S16({ id: 'c16_dinner', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { when: A16, text: '{partner} уже накрыл{pm:|а} на стол. На плите кастрюля с картошкой. Ты садишься, не снимая свитера: руки ещё не отошли.' },
      { when: B16, text: '{A} вернул{pm:ся|ась} затемно, с инеем на шапке. Садится к столу, не снимая свитера.' },
      { when: ninaHere, text: 'Нина режет хлеб Кёлер тонкими ломтями, ровно, как в булочной.' },
      { when: ninaAway, text: 'За столом два стула. Третий отодвинут к стене.' },
      { text: 'Вы рассказываете друг другу про день. Сначала коротко. Потом подробнее.' },
    ],
    actions: [
      { id: 'c16_d_eat', label: 'Есть и рассказывать', minutes: 25, terminal: true, goto: 'c16_dishes', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Картошка горячая, соль крупная, Хенрике держала её в банке из-под кофе. Ты ешь и говоришь с набитым ртом. Никто не делает замечаний.', effects: [{ set: '$.c16_d', value: 'eat' }, meal('eat') ] },
      { id: 'c16_d_pack', label: 'Отложить свою порцию на завтра', minutes: 5, terminal: true, goto: 'c16_dishes', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Ты накрываешь свою тарелку другой тарелкой. Завтра будет длинный день.', effects: [{ set: '$.c16_d', value: 'pack' }, meal('pack') ] },
      { id: 'c16_d_tea', label: 'Только чай и разговор', minutes: 15, terminal: true, goto: 'c16_dishes',
        text: 'Ты держишь кружку обеими руками и говоришь. {partner} слушает, подперев щёку кулаком.', effects: [{ set: '$.c16_d', value: 'tea' } ] },
    ] }),

  S16({ id: 'c16_tobias', for: 'any', chapter: 'ch3', title: 'Красный огонёк у калитки', camp: yard14, ambient: dusk16,
    text: [
      { text: 'В половине восьмого у калитки звякает велосипедный звонок. Красный задний фонарь мигает в темноте. Тобиас. Без автомата, в гражданской куртке.' },
      { when: tell, text: 'Он не здоровается и не улыбается.\n\n— Ihr habt es gemeldet, — говорит он. — Jetzt kommt Brandt. Mittwoch, acht Uhr. Mit meinem Zug. Ich muss mit.\n\nВы сообщили. Теперь придёт Брандт. В среду, в восемь. С моим взводом. Я должен быть там.' },
      { when: quiet, text: '— Mittwoch, acht Uhr, — говорит он вместо приветствия. — Brandt und mein Zug. Jemand hat Brandt gesagt, wo. Ich muss mit.\n\nВ среду, в восемь. Брандт и мой взвод. Кто-то сказал Брандту, где это. Я должен быть там.' },
      { text: 'Он держится за руль обеими руками.\n\n— Meine Mutter, — говорит он. — Parzelle neun. Nehmt sie. Nur bis Donnerstag. In eure Scheune. Ich bringe sie morgen früh, vor dem Dienst.\n\nМоя мать. Девятая парцелла. Возьмите её. Только до четверга. К себе в сарай. Я привезу её завтра рано утром, до службы.' },
    ],
    actions: [
      { id: 'c16_to_listen', label: 'Подойти ближе', minutes: 3, terminal: true, outcomes: split('c16_a_tobias', 'c16_b_tobias'), effects: [{ set: '$.c16_to', value: 'listen' } ] },
      { id: 'c16_to_partner', label: 'Встать рядом с {partner.ins}', minutes: 3, terminal: true, outcomes: split('c16_a_tobias', 'c16_b_tobias'),
        text: '{partner} стоит у тебя за плечом. Ты чувствуешь {pm:его|её} тепло через куртку.', effects: [{ set: '$.c16_to', value: 'partner' } ] },
    ] }),

  S16({ id: 'c16_a_tobias', for: 'any', chapter: 'ch3', title: 'Одну', camp: yard14, ambient: dusk16,
    text: [
      { text: 'Тобиас ждёт ответа и не торопит.' },
      { when: { v: '$.c16_mother', op: '==', value: 'who' }, text: 'Ты вспоминаешь женщину на полу в спортзале. «Das ist mein Vater». Брандт ищет, кто укусил его внука.' },
      { when: { has: 'c16_wristband' }, text: 'Браслет из больницы лежит у тебя в кармане. «Station 4».' },
    ],
    actions: [
      { id: 'c16_at_others', label: 'Спросить про остальных в колонии', minutes: 5, terminal: true, goto: 'c16_a_barn',
        text: '— Ich kann nur eine tragen, — говорит Тобиас. — Ich bin nicht stolz darauf.\n\nЯ могу унести только одну. Я этим не горжусь.', effects: [{ set: '$.c16_at', value: 'others' }, tobias(1)],
        outcomes: [{ id: 'jens', when: jensAlive, text: 'Йенс тоже там. Он не говорит этого вслух. Ты тоже.' }] },
      { id: 'c16_at_brandt', label: 'Спросить, можно ли остановить Брандта', minutes: 6, terminal: true, goto: 'c16_a_barn',
        text: '— Brandt ist kein Schlächter, — говорит Тобиас. — Er hat Angst um seinen Enkel. — Он смотрит на насыпь. — Wenn ihm einer beweist, dass es nicht von dort kam… vielleicht. Vielleicht wartet er.\n\nБрандт не мясник. Он боится за внука. Если ему докажут, что это не оттуда… может быть. Может, подождёт.', effects: [{ set: '$.c16_at', value: 'brandt' }, tobias(1)] },
      { id: 'c16_at_decide', label: 'Сказать: решим вдвоём и ответим', minutes: 3, terminal: true, goto: 'c16_a_barn',
        text: 'Тобиас кивает.\n\n— Bis sechs, — говорит он. — Um halb sieben stehe ich hier. Mit ihr oder ohne.\n\nДо шести. В половине седьмого я буду здесь. С ней или без неё.', effects: [{ set: '$.c16_at', value: 'decide' }] },
    ] }),

  S16({ id: 'c16_b_tobias', for: 'any', chapter: 'ch3', title: 'Маргит', camp: yard14, ambient: dusk16,
    text: [{ text: 'Тобиас достаёт из нагрудного кармана фотографию в пластике. Женщина на велосипеде, в цветастом платке, смеётся, отвернувшись от камеры.\n\n— Margit, — говорит он. — Sie hat mir auf diesem Weg das Radfahren beigebracht.\n\nМаргит. Она учила меня кататься на велосипеде. На этой дороге.' }],
    actions: [
      { id: 'c16_bt_photo', label: 'Попросить подержать фотографию', minutes: 4, terminal: true, goto: 'c16_b_barn',
        text: 'Фотография тёплая от кармана. На обороте ручкой: «Sommer 2009». Ты отдаёшь. Тобиас прячет её, не глядя.', effects: [{ set: '$.c16_bt', value: 'photo' }, tobias(1)] },
      { id: 'c16_bt_no', label: 'Спросить, что будет, если вы откажете', minutes: 5, terminal: true, goto: 'c16_b_barn',
        text: '— Dann mache ich es Mittwoch selbst, — говорит Тобиас. — Vor Brandt. Ich will nicht, dass sie es machen.\n\nТогда в среду сделаю сам. До Брандта. Не хочу, чтобы это сделали они.', effects: [{ set: '$.c16_bt', value: 'no' }] },
      { id: 'c16_bt_jens', label: 'Спросить, что будет с Йенсом', when: jensAlive, minutes: 5, terminal: true, goto: 'c16_b_barn',
        text: 'Тобиас смотрит мимо тебя, на окно кухни.\n\n— Jens auch, — говорит он. — Alle sieben.\n\nЙенс тоже. Все семеро.', effects: [{ set: '$.c16_bt', value: 'jens' }],
        outcomes: [{ id: 'nina', when: ninaHere, text: 'Пауза.\n\n— Ich weiß, wer oben schläft.\n\nЯ знаю, кто у вас наверху спит.' }] },
    ] }),

  S16({ id: 'c16_night', for: 'any', chapter: 'ch3', title: 'До ночи', camp: house14,
    text: [
      { text: 'Красный огонёк уезжает в сторону Бендесторфа. Во дворе снова темно.' },
      { when: flag('w.c16_gen'), text: 'Генератор тарахтит в сарае. До десяти.' },
      { when: ninaHere, text: 'Наверху у Нины горит свет. Её дверь приоткрыта.' },
      { text: 'Сарай, где можно держать человека на цепи. Ночь, за которую можно дойти до колонии. Утро, когда Брандт открывает ворота пожарной части. Решать вам двоим.' },
    ],
    actions: [
      { id: 'c16_n_sit', label: 'Сесть с {partner.ins} за стол и решить', minutes: 5, terminal: true, goto: 'c16_checkpoint',
        effects: [{ set: '$.c16_finished', value: true }, toCp] },
      { id: 'c16_n_nina', label: 'Сначала подняться к Нине', when: ninaHere, minutes: 8, terminal: true, goto: 'c16_checkpoint',
        text: 'Нина спит одетая, письмо отцу лежит у неё на груди. Ты гасишь свет.', effects: [{ set: '$.c16_finished', value: true }, nina(1), toCp] },
      { id: 'c16_n_gate', label: 'Сначала проверить заднюю калитку', minutes: 6, terminal: true, goto: 'c16_checkpoint',
        text: 'Крючок на месте. За полем, на насыпи, ни огонька. Только где-то далеко лает собака.', effects: [{ set: '$.c16_finished', value: true }, toCp] },
    ] }),


  S16({ id: 'c16_a_doctor', for: 'any', chapter: 'ch3', title: 'Врач', location: sammel, ambient: { tempC: 12, outdoor: false, wet: false },
    text: [{ text: 'У выхода из спортзала за партой сидит врач пункта. Та же женщина с собранными в узел волосами, что принимала Хенрике. Перед ней стопка бумаг и термос.\n\n— Lüdemann, — говорит она, узнав тебя. — Der Junge mit den Antikörpern. Die Mutter ist mit ihm in Lüneburg. Jeden Tag geht ein Wagen hin.\n\nЛюдеманы. Парень с антителами. Мать с ним в Люнебурге. Туда каждый день ходит машина.' }],
    actions: [
      { id: 'c16_ado_note', label: 'Написать Хенрике записку', minutes: 10, terminal: true, goto: 'c16_a_back',
        text: 'Врач даёт тебе листок из блокнота. Ты пишешь коротко: Нина с вами, хутор в порядке, куры живы, как Оле? Врач складывает листок вчетверо и кладёт в конверт с надписью «Lüneburg».\n\n— Morgen hin, übermorgen zurück. Wenn sie antwortet.\n\nЗавтра туда, послезавтра обратно. Если ответит.', effects: [{ set: '$.c16_doc', value: 'note' }, toLeave] },
      { id: 'c16_ado_blood', label: 'Спросить, зачем у Оле берут кровь', minutes: 6, terminal: true, goto: 'c16_a_back',
        text: 'Врач долго смотрит на тебя.\n\n— Plasma, — говорит она. — Von denen, die es überstanden haben. Für die Forschung. Freiwillig, sagen sie. — Она закручивает крышку термоса. — Ich sage nur, was man mir sagt.\n\nПлазма. От тех, кто переболел. Для исследований. Добровольно, говорят. Я говорю только то, что мне говорят.', effects: [{ set: '$.c16_doc', value: 'blood' }, toLeave] },
      { id: 'c16_ado_go', label: 'Кивнуть и выйти', minutes: 2, terminal: true, goto: 'c16_a_back',
        text: 'Врач уже смотрит в бумаги. У неё в очереди трое.', effects: [{ set: '$.c16_doc', value: 'go' }, toLeave] },
    ] }),

  S16({ id: 'c16_a_gatefix', for: 'any', chapter: 'ch3', title: 'Задняя калитка', camp: yard14, ambient: dusk16,
    text: [
      { when: { before: at(16, 17, 45) }, text: 'До ужина ещё час.' },
      { text: 'Задняя калитка держится на крючке и честном слове. За ней поле, за полем насыпь.' },
      { when: { v: 'A.c14_fence', op: '==', value: 'can' }, text: 'Банка с камнями, которую ты повесил{m:|а} вчера, всё ещё висит на перекладине.' },
    ],
    actions: [
      { id: 'c16_agf_board', label: 'Прибить поперёк доску и скрутить проволокой', minutes: 30, activity: 'moderate', terminal: true,
        outcomes: [{ id: 'n', when: ninaHere, goto: 'c16_a_nina' }, { id: 'd', goto: 'c16_dinner', effects: [toDinner] }],
        text: 'Ты прибиваешь доску от старого ящика поперёк калитки и скручиваешь проволокой со столбом. Теперь её не открыть, не размотав. Изнутри это пять секунд. Снаружи, в темноте, не поймёшь как.', effects: [{ set: '$.c16_gatefix', value: 'board' }] },
      { id: 'c16_agf_can', label: 'Повесить банку с камнями, чтобы звенела', when: not({ v: 'A.c14_fence', op: '==', value: 'can' }), minutes: 10, terminal: true,
        outcomes: [{ id: 'n', when: ninaHere, goto: 'c16_a_nina' }, { id: 'd', goto: 'c16_dinner', effects: [toDinner] }],
        text: 'Консервная банка, три камня, бечёвка. Ты трогаешь калитку пальцем. Банка звякает на весь двор.', effects: [{ set: '$.c16_gatefix', value: 'can' }] },
      { id: 'c16_agf_leave', label: 'Оставить как есть', minutes: 2, terminal: true,
        outcomes: [{ id: 'n', when: ninaHere, goto: 'c16_a_nina' }, { id: 'd', goto: 'c16_dinner', effects: [toDinner] }],
        text: 'Крючок на месте. Пока этого хватало.', effects: [{ set: '$.c16_gatefix', value: 'none' }] },
    ] }),

  S16({ id: 'c16_a_nina', for: 'any', chapter: 'ch3', title: 'В среду', camp: yard14, ambient: dusk16,
    text: [{ text: 'Нина выходит к поленнице с охапкой газет на растопку.\n\n— В среду я пойду в колонию, — говорит она. — Ты со мной?' }],
    actions: [
      { id: 'c16_an_yes', label: 'Пообещать: пойдём вместе', minutes: 4, terminal: true, goto: 'c16_dinner',
        text: 'Нина кивает и уносит газеты в дом. На пороге оборачивается: «Обещал{m:|а}». И закрывает дверь.', effects: [{ set: '$.c16_an', value: 'yes' }, nina(1), toDinner] },
      { id: 'c16_an_truth', label: 'Сказать правду: в среду туда придут солдаты', minutes: 8, terminal: true, goto: 'c16_dinner',
        text: 'Нина слушает, не перебивая. Газеты в руках мнутся.\n\n— Тогда я пойду во вторник, — говорит она. — Завтра. — Пауза. — Спасибо, что сказал{m:|а}. Взрослые обычно не говорят.', effects: [{ set: '$.c16_an', value: 'truth' }, { set: 'w.c16_nina_knows', value: true }, nina(2), toDinner] },
      { id: 'c16_an_later', label: 'Сказать: в среду и посмотрим', minutes: 3, terminal: true, goto: 'c16_dinner',
        text: '— «Посмотрим» — это «нет», — говорит Нина. Без обиды. Просто сообщает.', effects: [{ set: '$.c16_an', value: 'later' }, toDinner] },
    ] }),

  S16({ id: 'c16_a_barn', for: 'any', chapter: 'ch3', title: 'Сарай', camp: yard14, ambient: dusk16,
    text: [{ text: 'После Тобиаса ты заходишь в сарай с фонарём. Сено, старый плуг, мешки. В балке под крышей железное кольцо: сюда когда-то привязывали телёнка. Стены из досок, щели в палец.' }],
    actions: [
      { id: 'c16_ab_ring', label: 'Проверить кольцо и балку на прочность', minutes: 10, terminal: true, goto: 'c16_glow',
        text: 'Ты повисаешь на кольце всем весом. Балка скрипит, но держит. Кольцо вбито насквозь. Если понадобится, выдержит.', effects: [{ set: '$.c16_barn', value: 'ring' }] },
      { id: 'c16_ab_straw', label: 'Отгрести сено от стены у кольца', minutes: 15, activity: 'light', terminal: true, goto: 'c16_glow',
        text: 'Ты отгребаешь сено вилами, расчищаешь круг у кольца. Под сеном пол из досок, сухой. Ты сам{m:|а} не знаешь, зачем делаешь это до того, как вы решили.', effects: [{ set: '$.c16_barn', value: 'straw' }] },
      { id: 'c16_ab_out', label: 'Постоять и выйти', minutes: 3, terminal: true, goto: 'c16_glow',
        text: 'Ты стоишь, светя на кольцо, и выходишь. Пусть сначала будет решение.', effects: [{ set: '$.c16_barn', value: 'out' }] },
    ] }),

  S16({ id: 'c16_b_cellar', for: 'any', chapter: 'ch3', title: 'Тетрадь в подвале', camp: kitchen14,
    // Подвал Хенрике («картошки на три недели») до сих пор жил только в тексте: теперь он в общем запасе хутора.
    onEnter: [{ place: 'potatoes', qty: 150, at: 'c3_farm_stock' }],
    text: [{ text: 'Шесть ящиков картошки вдоль стены, Хенрике писала: на три недели. Ты спускаешься за ведром и замечаешь на полке над ящиками тетрадь.' }, { text: 'Школьная тетрадь в клеточку. Почерк Хенрике. Даты, имена, цифры. Последняя страница:\n\n«Elke K. — Mo: 2 kg Kartoffeln, 6 Eier».\n\nЭлке Кёлер. По понедельникам. Строчка повторяется на каждой странице, с сентября. Сегодня понедельник.' }],
    actions: [
      { id: 'c16_bcel_share', label: 'Отложить понедельничную долю, как Хенрике', minutes: 8, terminal: true, goto: 'c16_b_koehler',
        text: 'Ты насыпаешь картошку в пакет и ставишь у двери. Хенрике не стала бы спрашивать, хватит ли самим. Наверное, считала и это.', effects: [{ set: '$.c16_cel', value: 'share' }, toKoehler] },
      { id: 'c16_bcel_know', label: 'Запомнить и поставить тетрадь на место', minutes: 4, terminal: true, goto: 'c16_b_koehler',
        text: 'Ты ставишь тетрадь обратно, корешком наружу. Так, как она стояла.', effects: [{ set: '$.c16_cel', value: 'know' }, toKoehler] },
      { id: 'c16_bcel_read', label: 'Пролистать тетрадь целиком', minutes: 12, terminal: true, goto: 'c16_b_koehler',
        text: 'Имена повторяются: Кёлер, «Familie Bahr», «der Junge vom Bahnwärter». Хенрике кормила полдеревни и никому об этом не говорила. На последней странице, внизу, мелко: «Wenn ich nicht da bin — weiter so». Если меня не будет — продолжайте.', effects: [{ set: '$.c16_cel', value: 'know' }, { set: '$.c16_cel_all', value: true }, toKoehler] },
    ] }),

  S16({ id: 'c16_b_bread', for: 'any', chapter: 'ch3', title: 'Тесто', camp: kitchen14,
    text: [
      { when: { stocked: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, text: 'Мука Кёлер стоит в кладовке. Печь горячая. До темноты два часа.' },
      { when: all(ninaHere, { stocked: 'c16_flour', qty: 1, at: 'c3_farm_stock' }), text: '— Я умею, — говорит Нина. — Папа пёк по воскресеньям. Не очень. Но я помню, как.' },
      { when: not({ stocked: 'c16_flour', qty: 1, at: 'c3_farm_stock' }), text: 'Печь горячая. До темноты два часа. Ужин сам себя не сварит.' },
    ],
    actions: [
      { id: 'c16_bb_bake', label: 'Испечь хлеб из муки Кёлер', when: { stocked: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, minutes: 70, activity: 'light', terminal: true, goto: 'c16_b_hens',
        text: 'Вода, соль, мука, закваски нет, значит, на соде из банки Хенрике. Тесто липнет к пальцам. Два кирпичика в печь. Через час кухня пахнет так, что хочется плакать.', effects: [{ set: '$.c16_bb', value: 'bake' }, { unstock: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, { take: 'c16_flour', qty: 1 }, { place: 'c16_bread', qty: 2, at: 'c3_farm_stock' }, nina(1)] },
      { id: 'c16_bb_keep', label: 'Оставить муку на чёрный день', when: { stocked: 'c16_flour', qty: 1, at: 'c3_farm_stock' }, minutes: 3, terminal: true, goto: 'c16_b_hens',
        text: 'Ты ставишь мешочек повыше, на полку с банками. Мука хранится долго. Чёрный день тоже может быть долгим.', effects: [{ set: '$.c16_bb', value: 'keep' }] },
      { id: 'c16_bb_peel', label: 'Начистить картошки к ужину', minutes: 20, terminal: true, goto: 'c16_b_hens',
        text: 'Ты чистишь картошку над ведром, тонко, как учила Хенрике: «Кожура — тоже еда, её свиньи едят». Свиней нет. Кожура всё равно тонкая.', effects: [{ set: '$.c16_bb', value: 'peel' }] },
    ] }),

  S16({ id: 'c16_b_utesms', for: 'any', chapter: 'ch3', title: 'Сообщение', camp: kitchen14,
    text: [{ text: 'Телефон вибрирует. Незнакомый номер, но ты знаешь, чей. Уте.\n\n«Morgen ist Spaziergang. Macht euch keine Sorgen. U.»\n\nЗавтра прогулка. Не беспокойтесь. У.' }],
    actions: [
      { id: 'c16_bus_ask', label: 'Спросить, какая прогулка', minutes: 4, terminal: true, goto: 'c16_b_merle',
        text: 'Ответ приходит через минуту: «Er und ich. Wie früher. Am Bach entlang». Он и я. Как раньше. Вдоль ручья.', effects: [{ set: '$.c16_us', value: 'ask' }, { charge: 'phone', delta: -1 } ] },
      { id: 'c16_bus_chain', label: 'Ответить: только на цепи', minutes: 3, terminal: true, goto: 'c16_b_merle',
        text: '«Nur an der Kette, bitte». Только на цепи, пожалуйста.\n\nДве серые галочки. Прочитано. Ответа нет.', effects: [{ set: '$.c16_us', value: 'chain' }, { charge: 'phone', delta: -1 } ] },
      { id: 'c16_bus_keep', label: 'Не отвечать и показать {A.dat} за ужином', minutes: 2, terminal: true, goto: 'c16_b_merle',
        text: 'Ты кладёшь телефон экраном вниз. «Не беспокойтесь» — от этого почему-то беспокойнее всего.', effects: [{ set: '$.c16_us', value: 'keep' } ] },
    ] }),

  S16({ id: 'c16_b_barn', for: 'any', chapter: 'ch3', title: 'Радио', camp: yard14, ambient: dusk16,
    text: [{ text: 'Ты заходишь в сарай с фонарём: посмотреть, о чём просил Тобиас. Кольцо в балке, сено, старый плуг. На полке у двери транзисторный приёмник Хенрике, весь в паутине. Батареек в нём нет.' }],
    actions: [
      { id: 'c16_bba_radio', label: 'Вставить свои батарейки и взять приёмник', when: { has: 'batteries_aa' }, minutes: 8, terminal: true, goto: 'c16_glow',
        text: 'Батарейки встают туго. Ты крутишь ручку. Шипение, обрывок шлягера, мужской голос: «…Lüneburg… Registrierung…» — и снова шлягер. Приёмник работает.', effects: [{ set: '$.c16_bba', value: 'radio' }, { take: 'batteries_aa', qty: 1 }, { give: 'radio', qty: 1, charge: 100 }] },
      { id: 'c16_bba_clean', label: 'Расчистить место у кольца', minutes: 15, activity: 'light', terminal: true, goto: 'c16_glow',
        text: 'Ты отгребаешь сено от стены и подметаешь доски. Ещё ничего не решено. Но так будет проще, если решите.', effects: [{ set: '$.c16_bba', value: 'clean' }] },
      { id: 'c16_bba_out', label: 'Закрыть сарай и вернуться в дом', minutes: 3, terminal: true, goto: 'c16_glow',
        text: 'Ты закрываешь дверь сарая на щеколду. Внутри темно и пахнет сеном. Как будто ничего не изменилось.', effects: [{ set: '$.c16_bba', value: 'out' }] },
    ] }),

  S16({ id: 'c16_checkpoint', for: 'any', chapter: 'ch3', title: 'Среда', checkpoint: 16, universal: false,
    text: [{ text: 'Брать ли в сарай мать Тобиаса и что делать до среды, решаете вы вдвоём.' }], actions: [] }),
];

function set17(key: string, value: boolean): Effect {
  return { set: `$.c16_${key}`, value };
}
