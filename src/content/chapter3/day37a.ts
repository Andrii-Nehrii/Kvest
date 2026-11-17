import type { Scene } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any } from './point18';
import { evaHere, npc } from './point19';
import { brothersCome, oleHome33 } from './point33';
import { aNorth36, bNorth36, east36, lea36, tobias36, way36 } from './point36';
import {
  S37, barn37, frost37, henrike37, listedMed37, lostDiesel37, lostFood37, lostGen37, set37, until37, w37,
} from './point37';

// Участок 37, линия A: колодец; реквизиция у ворот (эхо: генератор / солярка / картошка); бумага Хаазе для B;
// солдат и куры; дрова; Брандт и дежурства на Зеве; сигнал на тропе; полдень; Янник или семенная картошка; Corsa к утру;
// сосед; сумерки у ручья; Оле (или Эва, Дениз); сборы.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S37({ ...scene, for: 'any', chapter: 'ch3' });
const loss: Effect[] = [
  { if: lostGen37, then: [w37('lost', 'generator')] },
  { if: lostDiesel37, then: [w37('lost', 'diesel'), { if: { has: 'can_diesel_20' }, then: [{ take: 'can_diesel_20' }] }] },
  { if: lostFood37, then: [w37('lost', 'food'), { if: { stocked: 'potatoes', qty: 50, at: 'c3_farm_stock' }, then: [{ unstock: 'potatoes', qty: 50, at: 'c3_farm_stock' }] }] },
];

export const day37AScenes: Scene[] = [
  X({ id: 'c37_a_ice', title: 'Колодец', camp: yard14, ambient: frost37,
    text: [
      { text: 'Ручка насоса у колодца не идёт: за ночь в трубе встал лёд. Ведро на верёвке тоже не опустить — сверху корка в палец.' },
      { when: flag('w.c33_pump'), text: 'Насос отогревали четыре дня назад. Мороз взял своё снова.' },
    ],
    actions: [
      { id: 'c37_ai_kettle', label: 'Отогреть кипятком, чайник за чайником', minutes: 50, terminal: true, goto: 'c37_a_truck', ambientDuring: frost37,
        text: 'Пятый чайник, шестой. Труба шипит, потом булькает. Ручка идёт. Два ведра в дом, два в хлев. Руки красные от пара и мороза сразу.', effects: [set37('ai', 'kettle'), until37(7, 50)] },
      { id: 'c37_ai_straw', label: 'Отогреть и укутать трубу соломой с навозом: чтобы не мёрзла', minutes: 60, activity: 'moderate', terminal: true, goto: 'c37_a_truck', ambientDuring: frost37,
        text: 'Кипяток, потом солома, сверху навоз, всё перевязано мешковиной. Пахнет так, что Хенрике морщится с крыльца. Но к вечеру труба тёплая на ощупь. Теперь, может, до конца морозов.', effects: [set37('ai', 'straw'), w37('pump_wrapped', true), { body: 'fatigue', delta: 5 }, until37(7, 55)] },
      { id: 'c37_ai_snow', label: 'Не трогать: натаскать снега в котёл', minutes: 45, activity: 'moderate', terminal: true, goto: 'c37_a_truck', ambientDuring: frost37,
        text: 'Ведро снега — кружка воды. Ты таскаешь, пока котёл на плите не наполняется. Хенрике смотрит и молчит: снег тоже вода.', effects: [set37('ai', 'snow'), { body: 'fatigue', delta: 4 }, until37(7, 45)] },
    ] }),

  X({ id: 'c37_a_truck', title: 'Реквизиция', camp: yard14, ambient: frost37,
    text: [
      { text: 'В восемь к воротам подъезжает армейский грузовик. Хаазе выходит из кабины с планшетом, за ним трое солдат. Он показывает бумагу с печатью: «Requirierung für den Abzug».' },
      { when: lostGen37, text: '— Stromaggregat, Diesel. Sie haben ihn selbst angegeben. — Хаазе показывает строчку в карточке. — Er wird in Mölln gebraucht.\n\nГенератор, дизельный. Вы сами его записали. Он нужен в Мёльне.' },
      { when: lostDiesel37, text: '— Ein Kanister Diesel aus dem dritten LKW an der Raststätte. Bundeswehreigentum. — Хаазе не поднимает глаз. — Wir wissen, dass er hier ist.\n\nКанистра солярки из третьего грузовика у стоянки. Имущество бундесвера. Мы знаем, что она здесь.' },
      { when: lostFood37, text: '— Verpflegung. Ein Zentner Kartoffeln pro Hof. — Хаазе ставит галочку. — Für die Truppe auf dem Marsch.\n\nПродовольствие. Центнер картошки с хутора. Для войск на марше.' },
      { when: henrike37, text: 'Хенрике стоит на крыльце, руки под фартуком. Лицо каменное.' },
    ],
    actions: [
      { id: 'c37_at_give', label: 'Отдать молча', minutes: 30, terminal: true, goto: 'c37_a_haase',
        text: 'Солдаты грузят. Ты стоишь рядом и смотришь. Хаазе расписывается в своей бумаге и уже поворачивается к машине.', effects: [set37('at', 'give'), ...loss, until37(8, 40)] },
      { id: 'c37_at_receipt', label: 'Потребовать расписку: что, сколько, кто взял', minutes: 35, terminal: true, goto: 'c37_a_haase',
        text: 'Хаазе смотрит на тебя поверх очков, потом отрывает листок и пишет. «Quittung». Расписка. Номер части, подпись, печать. «Bringt euch nichts. Aber bitte». Толку вам от неё никакого. Но пожалуйста.', effects: [set37('at', 'receipt'), w37('receipt', true), ...loss, until37(8, 40)] },
      { id: 'c37_at_argue', label: 'Спорить: дому зимовать, без этого нельзя', minutes: 35, terminal: true, goto: 'c37_a_haase',
        text: 'Ты говоришь долго. Хаазе слушает, не перебивая. Потом говорит: «Ich verstehe. Ändert nichts». Я понимаю. Это ничего не меняет. Солдаты грузят, пока ты говоришь. Хенрике на крыльце качает головой: не надо.', effects: [set37('at', 'argue'), ...loss, { body: 'stress', delta: 5 }, until37(8, 40)] },
      { id: 'c37_at_tobias', label: 'Назвать Тобиаса: ты ему помогал{m:|а}, он за вас поручится', when: tobias36, minutes: 35, terminal: true, goto: 'c37_a_haase',
        text: 'Хаазе кивает: он знает. «Feldwebel Tobias hat für euch gebürgt. Deshalb nehmen wir nur das». Фельдфебель Тобиас за вас поручился. Поэтому берём только это. Ты понимаешь, что без Тобиаса взяли бы больше.', effects: [set37('at', 'tobias'), ...loss, w37('tobias_vouched', true), until37(8, 40)] },
    ] }),

  X({ id: 'c37_a_haase', title: 'Бумага', camp: yard14, ambient: frost37,
    text: [
      { when: listedMed37, text: 'Хаазе достаёт из планшета ещё одну бумагу и протягивает тебе.\n\n— Für Ihre Partnerin. Freiwillige Meldung. Sanitätspersonal fährt am Fünfzehnten mit uns, mit Verpflegung und Unterkunft. Fünf Uhr, Kasernentor.\n\nДля вашей подруги. Добровольная запись. Медперсонал пятнадцатого едет с нами, с питанием и жильём. Пять утра, ворота казармы.' },
      { when: not(listedMed37), text: 'Хаазе уже у кабины. Обернувшись, спрашивает: есть ли на хуторе оружие и знают ли соседи, что пятнадцатого они будут одни.' },
    ],
    actions: [
      { id: 'c37_ah_take', label: 'Взять бумагу для неё', when: listedMed37, minutes: 20, terminal: true, goto: 'c37_a_soldier',
        text: 'Бумага плотная, с гербом. Ты складываешь её вдвое и кладёшь в карман. Решать не тебе. Пусть прочтёт сама.', effects: [set37('ah', 'take'), w37('draft_paper', 'given'), until37(9, 10)] },
      { id: 'c37_ah_refuse', label: 'Сказать: она никуда с вами не поедет', when: listedMed37, minutes: 20, terminal: true, goto: 'c37_a_soldier',
        text: 'Хаазе убирает бумагу обратно. «Wie Sie meinen. Es ist freiwillig». Как скажете. Это добровольно. Ты отвечаешь за неё. Она об этом не знает.', effects: [set37('ah', 'refuse'), w37('draft_paper', 'refused'), until37(9, 10)] },
      { id: 'c37_ah_burn', label: 'Взять и бросить в печку, когда он уедет', when: listedMed37, minutes: 20, terminal: true, goto: 'c37_a_soldier',
        text: 'Хаазе уезжает. Ты стоишь у плиты и смотришь, как герб чернеет и сворачивается. Никто не видел. Тебе от этого не легче.', effects: [set37('ah', 'burn'), w37('draft_paper', 'burned'), { body: 'stress', delta: 3 }, until37(9, 10)] },
      { id: 'c37_ah_gun', label: 'Сказать про ружьё и что соседи знают', when: not(listedMed37), minutes: 20, terminal: true, goto: 'c37_a_soldier',
        text: '— Gut. Patronen trocken halten. Und nicht nachts auf Schatten schießen. — Хаазе кивает. — Das ist kein Befehl. Nur ein Rat.\n\nХорошо. Патроны держать сухими. И не стрелять ночью по теням. Это не приказ. Только совет.', effects: [set37('ah', 'gun'), until37(9, 10)] },
      { id: 'c37_ah_no', label: 'Сказать: оружия нет', when: not(listedMed37), minutes: 20, terminal: true, goto: 'c37_a_soldier',
        text: 'Хаазе пожимает плечами. Ему уже всё равно: через шесть дней это не его округ.', effects: [set37('ah', 'no'), until37(9, 10)] },
    ] }),

  X({ id: 'c37_a_soldier', title: 'Куры', camp: yard14, ambient: frost37,
    text: [
      { text: 'Пока Хаазе пишет в кабине, один из солдат, рыжий, лет двадцати, заглядывает в курятник. Выходит с курицей под мышкой. Курица орёт.' },
      { text: '— Für die Kameraden, — говорит он, ухмыляясь. Для ребят. — Die Alte merkt das nicht.\n\nСтаруха не заметит.' },
      { when: henrike37, text: 'Хенрике заметила. Она уже спускается с крыльца.' },
    ],
    actions: [
      { id: 'c37_as_stop', label: 'Встать у него на дороге: положи', minutes: 20, risky: true, terminal: true, goto: 'c37_a_after',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'persuasion'], difficulty: 3, uses: ['focus'] },
            text: 'Ты стоишь и смотришь на него. Он ухмыляется, потом перестаёт. Курица летит в снег и бежит к курятнику, хлопая крыльями. Рыжий сплёвывает и идёт к грузовику.',
            effects: [set37('as', 'stop'), npc('henrike', 1), until37(9, 40)] },
          { id: 'push',
            text: 'Он толкает тебя плечом, сильно, ты поскальзываешься и падаешь на лёд у колодца, ударившись боком. Курица остаётся у него. Из кабины выходит Хаазе, говорит одно слово, и рыжий бросает курицу. Но бок болит при каждом вдохе.',
            effects: [set37('as', 'push'), { injure: 'bruise', site: 'torso', severity: 1 }, { body: 'stress', delta: 6 }, until37(9, 40)] },
        ] },
      { id: 'c37_as_haase', label: 'Позвать Хаазе', minutes: 20, terminal: true, goto: 'c37_a_after',
        text: 'Ты окликаешь Хаазе. Он смотрит из кабины, потом на рыжего. Одно слово: «Zurück». Назад. Курица летит в снег. Рыжий проходит мимо тебя и тихо говорит: «Petze». Стукач.', effects: [set37('as', 'haase'), until37(9, 40)] },
      { id: 'c37_as_let', label: 'Пусть берёт: одна курица — не война', minutes: 15, terminal: true, goto: 'c37_a_after',
        text: 'Ты отворачиваешься. Хенрике останавливается на ступеньке и смотрит на тебя. Ничего не говорит. Курица уезжает в кузове.', effects: [set37('as', 'let'), w37('hen_lost', true), npc('henrike', -1, 'c37_let_hen_go'), until37(9, 40)] },
    ] }),

  X({ id: 'c37_a_after', title: 'После', camp: kitchen14,
    text: [
      { text: 'Грузовик уезжает. На снегу у ворот следы шин, окурок и перо.' },
      { when: lostGen37, text: 'Там, где стоял генератор, на полу сарая чистый прямоугольник без пыли. Дениз смотрит на него и молчит.' },
      { when: lostDiesel37, text: 'Канистры нет. Трактор стоит с полупустым баком, и до весны его заправить нечем.' },
      { when: lostFood37, text: 'В кладовке на два мешка меньше. Хенрике смотрит на пустое место на полу и считает в уме.' },
      { when: oleHome33, text: 'Оле стоит у окна. Кулаки сжаты. «Sechs Tage noch. Dann sind sie weg, und wir haben nichts mehr, was sie holen können». Ещё шесть дней. Потом их нет, и у нас больше нечего забирать.' },
    ],
    actions: [
      { id: 'c37_af_plan', label: 'Сказать: четырнадцатого со склада казармы будут раздавать. Вернём', when: flag('w.c36_depot_seen'), minutes: 30, terminal: true, goto: 'c37_a_wood',
        text: 'Хенрике слушает и кивает медленно. «Am Vierzehnten. Gut. Dann fährt einer». Четырнадцатого. Хорошо. Значит, кто-то поедет. Она записывает в тетрадь на полях: «14 — Kaserne».', effects: [set37('af', 'plan'), w37('depot_plan', true), until37(10, 15)] },
      { id: 'c37_af_henrike', label: 'Сесть рядом с Хенрике', when: henrike37, minutes: 30, terminal: true, goto: 'c37_a_wood',
        text: 'Хенрике сидит у стола и разглаживает ладонью клеёнку. Ты садишься рядом. Она говорит, не глядя: «Mein Vater hat das neunzehnhundertfünfundvierzig auch erlebt. Die einen nehmen, die anderen nehmen. Der Hof bleibt». Мой отец это пережил в сорок пятом. Одни берут, другие берут. Хутор остаётся.', effects: [set37('af', 'henrike'), npc('henrike', 1), { body: 'stress', delta: -2 }, until37(10, 15)] },
      { id: 'c37_af_work', label: 'Ничего не говорить, просто взяться за работу', minutes: 25, terminal: true, goto: 'c37_a_wood',
        text: 'Говорить нечего. Работы много. Ты берёшь колун.', effects: [set37('af', 'work'), until37(10, 15)] },
    ] }),

  X({ id: 'c37_a_wood', title: 'Дрова', camp: yard14, safe: false, ambient: frost37,
    text: [
      { text: 'Дрова на неделю, на две — пока все здесь, их уходит втрое больше. Чурбаки смёрзлись в поленнице, их приходится отбивать от кучи обухом.' },
      { when: brothersCome, text: 'Керем пилит, Дениз складывает. Тебе достаётся колун.' },
    ],
    actions: [
      { id: 'c37_aw_fast', label: 'Колоть быстро, с размаху: сегодня ещё много дел', minutes: 45, activity: 'heavy', risky: true, terminal: true, goto: 'c37_a_brandt', ambientDuring: frost37,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['mobility'] },
            text: 'Колун ходит ровно, поленья разлетаются. Через сорок минут гора колотых дров, а у тебя пар валит из-под шапки.',
            effects: [set37('aw', 'fast'), { body: 'fatigue', delta: 10 }, until37(11, 0)] },
          { id: 'cut',
            text: 'Смёрзшийся чурбак отскакивает, колун соскальзывает по краю и бьёт плашмя по пальцам левой руки. Ноготь чернеет на глазах, на костяшке рассечена кожа. Кровь капает на снег. Дениз даёт тебе чистый платок и молча забирает колун.',
            effects: [set37('aw', 'cut'), { injure: 'cut', site: 'hands', severity: 1, bleeding: 2 }, { body: 'stress', delta: 5 }, until37(11, 0)] },
        ] },
      { id: 'c37_aw_slow', label: 'Колоть спокойно, каждый чурбак ставить ровно', minutes: 45, activity: 'heavy', terminal: true, goto: 'c37_a_brandt', ambientDuring: frost37,
        text: 'Поставить, прицелиться, ударить. Поставить. Медленнее, зато ни одного скользящего удара. Куча растёт не так быстро, как хотелось бы.', effects: [set37('aw', 'slow'), { body: 'fatigue', delta: 8 }, until37(11, 0)] },
      { id: 'c37_aw_saw', label: 'Попросить у Хенрике пилу: распилить, а не колоть', when: { has: 'c32_saw' }, minutes: 45, terminal: true, goto: 'c37_a_brandt', ambientDuring: frost37,
        text: 'Пила визжит на весь двор. Чурбаки ложатся ровными кругами. Колоть их после пилы — одно удовольствие.', effects: [set37('aw', 'saw'), { body: 'fatigue', delta: 6 }, until37(11, 0)] },
    ] }),

  X({ id: 'c37_a_brandt', title: 'Дежурства', camp: yard14, ambient: frost37,
    text: [
      { text: 'В одиннадцать к воротам подъезжает на тракторе Лукас, сын пожарного. Привёз от Брандта лист: дежурства по дворам после пятнадцатого.' },
      { when: flag('w.c36_seeve_watch'), text: 'Ваш хутор в листе первым: «Seeve — Lüdemann-Hof». Рядом твоё имя.' },
      { when: not(flag('w.c36_seeve_watch')), text: 'Ваш хутор в листе где-то в середине. Ночи распределены: по одной в неделю на двор.' },
      { text: 'Лукас ждёт, что ты скажешь. Брандту нужно знать, какой сигнал будет у вашего двора.' },
    ],
    actions: [
      { id: 'c37_ab_bell', label: 'Сигнал — колокол: снять старый с хлева и повесить у ворот', minutes: 35, terminal: true, goto: 'c37_a_wire',
        text: 'Лукас записывает: «Glocke». Колокол. Колокол на хлеву тронут ржавчиной, но звенит, если ударить молотком. Его слышно до насыпи.', effects: [set37('ab', 'bell'), w37('signal', 'bell'), until37(11, 40)] },
      { id: 'c37_ab_shots', label: 'Сигнал — три выстрела', when: any(flag('w.c19_gun'), flag('w.c35_gun_told')), minutes: 30, terminal: true, goto: 'c37_a_wire',
        text: 'Лукас записывает: «Drei Schüsse». Три выстрела. Патронов у вас мало. Три — это много.', effects: [set37('ab', 'shots'), w37('signal', 'shots'), until37(11, 40)] },
      { id: 'c37_ab_runner', label: 'Сигнал — гонец: кто-то бежит к соседям', minutes: 30, terminal: true, goto: 'c37_a_wire',
        text: 'Лукас пишет, но с сомнением. «Bis der Läufer da ist, ist es vorbei», — говорит он. Пока гонец добежит, всё кончится. Но записывает.', effects: [set37('ab', 'runner'), w37('signal', 'runner'), until37(11, 40)] },
    ] }),

  X({ id: 'c37_a_wire', title: 'Тропа у ручья', camp: yard14, ambient: frost37,
    text: [
      { text: 'Тропа от ручья Зеве к хутору идёт через лесополосу, мимо сарая. Если кто-то придёт ночью со стороны впадины, то по ней.' },
      { text: 'В сарае лежит моток проволоки от Керема, пустые консервные банки, старый коровий колокольчик.' },
    ],
    actions: [
      { id: 'c37_aw2_cans', label: 'Натянуть проволоку с банками поперёк тропы', minutes: 40, activity: 'moderate', terminal: true, goto: 'c37_a_noon', ambientDuring: frost37,
        text: 'Проволока на высоте колена, от берёзы до столба. Банки по три, с камешками внутри. Ты задеваешь проволоку ногой нарочно: грохот слышен у дома. Хорошо.', effects: [set37('aw2', 'cans'), w37('alarm', 'cans'), until37(12, 15)] },
      { id: 'c37_aw2_bell', label: 'Повесить коровий колокольчик на калитку у сарая', minutes: 30, terminal: true, goto: 'c37_a_noon', ambientDuring: frost37,
        text: 'Колокольчик звякает при каждом движении калитки. Тихо, но ночью в доме услышат, если не спать крепко.', effects: [set37('aw2', 'bell'), w37('alarm', 'bell'), until37(12, 15)] },
      { id: 'c37_aw2_none', label: 'Не надо: мороз, они вялые', minutes: 20, terminal: true, goto: 'c37_a_noon', ambientDuring: frost37,
        text: 'Минус девять. Обращённые на таком морозе еле ползают. Ты возвращаешься в дом. Проволока остаётся в сарае.', effects: [set37('aw2', 'none'), until37(12, 15)] },
    ] }),

  X({ id: 'c37_a_noon', title: 'Полдень', camp: yard14, ambient: frost37,
    text: [
      { when: all(lea36, flag('w.c36_lea_promise')), text: 'К воротам подходит Лея, из пункта. Она не заходит во двор, ждёт у калитки.\n\n— Du hast gesagt, du hilfst. Wann?\n\nТы {m:сказал|сказала}, что поможешь. Когда?' },
      { when: all(not(all(lea36, flag('w.c36_lea_promise'))), brothersCome), text: 'Керем зовёт тебя к фургону. Он хочет завтра поехать в Винзен со всеми: говорят, на рынке меняют бензин на работу.\n\n— Fährst du mit? Zu zweit kriegen wir mehr.\n\nПоедешь со мной? Вдвоём больше выменяем.' },
      { when: all(not(all(lea36, flag('w.c36_lea_promise'))), not(brothersCome)), text: 'Хенрике зовёт тебя в подвал: надо переложить картошку, чтобы нижние мешки не подмёрзли от стены.' },
    ],
    actions: [
      { id: 'c37_an_after15', label: 'Сказать Лее: после пятнадцатого, когда станет ясно, что на дорогах', when: all(lea36, flag('w.c36_lea_promise')), minutes: 30, terminal: true, goto: 'c37_lunch',
        text: 'Лея кивает. «Gut. Ich zähle». Хорошо. Я считаю. Она уходит. Ты понимаешь: она будет считать дни, и каждый будет на твоей совести.', effects: [set37('an', 'after15'), w37('lea_date', 'after15'), until37(13, 0)] },
      { id: 'c37_an_now', label: 'Сказать: если очень надо — завтра, с колонной Павла до Гестхахта, а дальше сама', when: all(lea36, flag('w.c36_lea_promise')), minutes: 30, terminal: true, goto: 'c37_lunch',
        text: 'Лея смотрит на тебя долго. «Bergen liegt im Osten. Nicht im Norden». Берген на востоке. Не на севере. Потом добавляет: «Aber danke, dass du nicht lügst». Но спасибо, что не врёшь.', effects: [set37('an', 'now'), until37(13, 0)] },
      { id: 'c37_an_kerem', label: 'Согласиться: поехать с Керемом', when: all(not(all(lea36, flag('w.c36_lea_promise'))), brothersCome, not(aNorth36)), minutes: 30, terminal: true, goto: 'c37_lunch',
        text: 'Керем хлопает тебя по плечу. «Morgen um sechs». Завтра в шесть. Он уже прикидывает, что можно предложить за бензин: руки, инструмент, свечи.', effects: [set37('an', 'kerem'), w37('with_kerem', true), until37(13, 0)] },
      { id: 'c37_an_no', label: 'Отказаться: завтра и так длинный день', when: all(not(all(lea36, flag('w.c36_lea_promise'))), brothersCome), minutes: 20, terminal: true, goto: 'c37_lunch',
        text: 'Керем пожимает плечами: «Dann allein». Тогда один.', effects: [set37('an', 'no'), until37(13, 0)] },
      { id: 'c37_an_cellar', label: 'Перекладывать картошку в подвале', when: not(all(lea36, flag('w.c36_lea_promise'))), minutes: 40, activity: 'moderate', terminal: true, goto: 'c37_lunch', ambientDuring: barn37,
        text: 'Мешок за мешком, от стены к середине. Нижние и правда подмёрзли с одного бока. Хенрике отбирает подмёрзшую картошку в отдельное ведро: на ужин, пока не сгнила.', effects: [set37('an', 'cellar'), { body: 'fatigue', delta: 6 }, npc('henrike', 1), until37(13, 0)] },
    ] }),

  X({ id: 'c37_a_after2', title: 'После обеда', camp: yard14, ambient: frost37,
    text: [
      { when: aNorth36, text: 'В два у поворота к колонии останавливается машина Красного Креста. За рулём Янник. Он машет тебе: «Name, Blutgruppe, Ausweis. Für die Liste». Имя, группа крови, документ. Для списка.' },
      { when: not(aNorth36), text: 'Хенрике зовёт тебя в амбар. На полу в углу двенадцать мешков, завязанных синей бечёвкой: семенная картошка. Её не едят.\n\n— Der Nachbar will zwei Säcke. Für Diesel. Was meinst du?\n\nСосед хочет два мешка. За солярку. Что думаешь?' },
    ],
    actions: [
      { id: 'c37_a2_register', label: 'Записаться у Янника', when: aNorth36, minutes: 30, terminal: true, goto: 'c37_a_car',
        text: 'Янник пишет на колене, на обороте накладной. «Zweiter Wagen, Beifahrer. Sechs Uhr. Und — danke, dass ihr mitkommt». Вторая машина, рядом с водителем. В шесть. И — спасибо, что едете.', effects: [set37('a2', 'register'), w37('a_registered', true), npc('jannik', 1), until37(14, 45)] },
      { id: 'c37_a2_talk', label: 'Записаться и спросить, как там, на том берегу', when: aNorth36, minutes: 40, terminal: true, goto: 'c37_a_car',
        text: 'Янник курит в открытое окно. Аренсбург — спортзал на четыреста человек, говорит он. Солдаты на въезде, проверка, у всех температуру меряют. Люди спят на матах. Кто болен — в отдельном корпусе, оттуда никто не выходит. «Holt sie raus, wenn ihr könnt». Забирайте её, если можете.', effects: [set37('a2', 'talk'), w37('a_registered', true), w37('ahrensburg_known', true), until37(14, 45)] },
      { id: 'c37_a2_keep', label: 'Сказать: семенную не трогать', when: not(aNorth36), minutes: 30, terminal: true, goto: 'c37_a_car',
        text: 'Хенрике кивает, будто ждала. «Recht hast du. Ohne Saat kein Herbst». Правильно. Без семян нет осени. Солярки не будет. Зато будет весна.', effects: [set37('a2', 'keep'), npc('henrike', 1), until37(14, 45)] },
      { id: 'c37_a2_trade', label: 'Сказать: один мешок, не два', when: not(aNorth36), minutes: 30, terminal: true, goto: 'c37_a_car',
        text: 'Хенрике думает долго. Потом кивает: «Einer. Und er gibt zehn Liter, nicht fünf». Один. И пусть даёт десять литров, не пять. Вечером сосед привозит канистру. Мешок уходит на его тачке.', effects: [set37('a2', 'trade'), w37('seed_traded', true), until37(14, 45)] },
      { id: 'c37_a2_two', label: 'Сказать: два, без солярки трактор встал', when: not(aNorth36), minutes: 30, terminal: true, goto: 'c37_a_car',
        text: 'Хенрике смотрит на мешки, потом на тебя. «Zwei. Wenn du meinst». Два. Если ты так считаешь. Голос ровный. Ты не уверен{m:|а}, что она согласна.', effects: [set37('a2', 'two'), w37('seed_traded', 'two'), npc('henrike', -1), until37(14, 45)] },
    ] }),

  X({ id: 'c37_a_car', title: 'Corsa к утру', camp: yard14, ambient: frost37,
    text: [
      { text: 'Завтра в пять утра машина должна завестись. При минус десяти аккумулятор за ночь садится вдвое.' },
      { when: flag('w.c36_corsa_bumper'), text: 'Бампер, треснувший на мосту через Луэ, ты прикручиваешь проволокой.' },
    ],
    actions: [
      { id: 'c37_ac_battery', label: 'Снять аккумулятор и унести на ночь в дом, к печке', minutes: 40, terminal: true, goto: 'c37_a_neighbor', ambientDuring: frost37,
        text: 'Ключ на десять, клеммы, аккумулятор тяжёлый, как ведро воды. Ты ставишь его на газету у печки. Хенрике смотрит: «Wie mein Mann. Jeden Winter». Как мой муж. Каждую зиму.', effects: [set37('ac', 'battery'), w37('car_warm', true), until37(15, 30)] },
      { id: 'c37_ac_run', label: 'Завести и погонять мотор полчаса: подзарядить', minutes: 40, terminal: true, goto: 'c37_a_neighbor', ambientDuring: frost37,
        text: 'Мотор работает, выхлоп белый. Полчаса — и аккумулятор бодрее. Бензина меньше, на стрелке это почти не видно.', effects: [set37('ac', 'run'), w37('car_warm', true), until37(15, 30)] },
      { id: 'c37_ac_cover', label: 'Накрыть капот старым одеялом и надеяться', minutes: 25, terminal: true, goto: 'c37_a_neighbor', ambientDuring: frost37,
        text: 'Одеяло на капот, сверху брезент, по углам кирпичи. Может, хватит. Может, нет.', effects: [set37('ac', 'cover'), until37(15, 15)] },
    ] }),

  X({ id: 'c37_a_neighbor', title: 'Сосед', camp: yard14, ambient: frost37,
    text: [
      { text: 'У ворот топчется сосед с ближнего двора, у насыпи. Пожилой, в шапке с ушами. Он здоровается и сразу спрашивает:' },
      { text: '— Stimmt das mit dem Fünfzehnten? Dass die Soldaten abhauen? In Jesteburg reden alle davon.\n\nПравда это, про пятнадцатое? Что солдаты уходят? В Йестебурге все говорят.' },
      { when: flag('w.c36_fence_told'), text: 'Ты знаешь, откуда пошёл слух: от забора казармы в Люнебурге.' },
    ],
    actions: [
      { id: 'c37_ab2_truth', label: 'Сказать: правда, пятнадцатого. Готовьтесь', minutes: 30, terminal: true, goto: 'c37_a_dusk',
        text: 'Сосед кивает, будто так и думал. «Dann muss ich die Tochter holen. Die ist allein in Hanstedt». Тогда надо забрать дочь. Она одна в Ханштедте. Он уходит быстро, почти бегом.', effects: [set37('ab2', 'truth'), w37('neighbor_warned', true), until37(16, 0)] },
      { id: 'c37_ab2_brandt', label: 'Сказать: в воскресенье совет у Брандта, там всё скажут', minutes: 25, terminal: true, goto: 'c37_a_dusk',
        text: 'Сосед морщится: «Brandt». Но кивает. «Sonntag. Gut». Воскресенье. Хорошо.', effects: [set37('ab2', 'brandt'), until37(16, 0)] },
      { id: 'c37_ab2_dunno', label: 'Сказать: не знаю', minutes: 20, terminal: true, goto: 'c37_a_dusk',
        text: 'Сосед смотрит на тебя внимательно. Он тебе не верит. Уходит, не прощаясь.', effects: [set37('ab2', 'dunno'), until37(15, 55)] },
    ] }),

  X({ id: 'c37_a_dusk', title: 'Ручей', camp: yard14, safe: false, ambient: frost37,
    text: [
      { text: 'Смеркается. Ты идёшь к ручью Зеве за сараем: посмотреть, как он выглядит перед твоими будущими ночами.' },
      { text: 'Лёд на ручье серый, в снегу. У камышей, вмёрзший по пояс, стоит обращённый. Неподвижный, с открытыми глазами. Иней на ресницах. Мёртвый ли — не понять.' },
    ],
    actions: [
      { id: 'c37_ad_check', label: 'Подойти и проверить палкой', minutes: 25, risky: true, terminal: true, goto: 'c37_a_ole', ambientDuring: frost37,
        outcomes: [
          { id: 'dead', check: { traits: ['agility', 'stealth'], difficulty: 2, uses: ['mobility'] },
            text: 'Ты тычешь палкой в плечо. Твёрдо, как полено. Замёрз насмерть. Значит, мороз их и убивает тоже, не только держит. Ты уходишь, не оглядываясь, но запоминаешь место.',
            effects: [set37('ad', 'check'), w37('frozen_dead', true), until37(16, 30)] },
          { id: 'ice',
            text: 'На полпути лёд у берега проседает, и ты по щиколотку в воде. Выдёргиваешь ногу. Обращённый не двигается. Ты пятишься к берегу и уходишь, мокрая нога сразу дубеет. Потом, у печки, понимаешь: так и не узнал{m:|а}, живой он или нет.',
            effects: [set37('ad', 'ice'), { body: 'stress', delta: 5 }, { body: 'fatigue', delta: 3 }, until37(16, 30)] },
        ] },
      { id: 'c37_ad_mark', label: 'Не подходить, вбить на берегу палку с тряпкой: отметить', minutes: 20, terminal: true, goto: 'c37_a_ole', ambientDuring: frost37,
        text: 'Палка с красной тряпкой на берегу. Издалека её видно с крыльца. Если он стоит там завтра так же — мёртвый. Если нет — значит, нет.', effects: [set37('ad', 'mark'), w37('reeds_marked', true), until37(16, 30)] },
      { id: 'c37_ad_back', label: 'Уйти тихо, рассказать дома', minutes: 15, terminal: true, goto: 'c37_a_ole', ambientDuring: frost37,
        text: 'Ты уходишь, не поворачиваясь к ручью спиной, пока не скрывается за сараем. Дома рассказываешь. Хенрике говорит: «Im Frühjahr taut er auf». Весной оттает.', effects: [set37('ad', 'back'), until37(16, 25)] },
    ] }),

  X({ id: 'c37_a_ole', title: 'Разговор', camp: kitchen14,
    text: [
      { when: oleHome33, text: 'Оле ждёт тебя у сарая. Он держит отцовское ружьё, переломленное, и показывает на патроны в жестяной банке.\n\n— Wenn ich nicht kann — du. Mutter schießt nicht. Sie hat es nie gekonnt.\n\nЕсли я не смогу — ты. Мать не стреляет. Никогда не умела.' },
      { when: all(not(oleHome33), evaHere), text: 'Эва сидит на кухне у окна, сложив руки на коленях. Пальто на ней застёгнуто до горла, хотя в кухне тепло.\n\n— Fünfzehnter, — говорит она. — Er hat zwei Plätze gesagt. Wenn ich gehe, bin ich wieder allein. Wenn ich bleibe, auch.\n\nПятнадцатое. Он сказал: два места. Если поеду — опять одна. Если останусь — тоже.' },
      { when: all(not(oleHome33), not(evaHere)), text: 'Хенрике сидит у плиты над тетрадью: что съедено за неделю, что осталось. Она поворачивает тетрадь к тебе: посмотри.' },
    ],
    actions: [
      { id: 'c37_ao_take', label: 'Взять ружьё и проверить, как ходит курок', when: oleHome33, minutes: 25, terminal: true, goto: 'c37_radio',
        text: 'Ружьё тяжёлое, приклад гладкий от рук. Ты переламываешь, смотришь стволы на свет, закрываешь. Оле кивает: «Gut. Jetzt weißt du, wo es steht». Хорошо. Теперь ты знаешь, где оно стоит.', effects: [set37('ao', 'take'), w37('gun_shown', true), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: 2 }] }, until37(17, 0)] },
      { id: 'c37_ao_ole', label: 'Сказать Оле: ты сможешь сам', when: oleHome33, minutes: 25, terminal: true, goto: 'c37_radio',
        text: 'Оле усмехается краем рта. «Vielleicht». Может быть. Он уносит ружьё обратно за шкаф. Но на пороге оборачивается: «Trotzdem. Du weißt jetzt, wo es steht». Всё равно. Ты теперь знаешь, где оно.', effects: [set37('ao', 'ole'), w37('gun_shown', true), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: 1 }] }, until37(17, 0)] },
      { id: 'c37_ao_eva_stay', label: 'Сказать Эве: оставайся, здесь ты не одна', when: all(not(oleHome33), evaHere), minutes: 25, terminal: true, goto: 'c37_radio',
        text: 'Эва долго смотрит в окно. Потом расстёгивает верхнюю пуговицу пальто. «Gut. Dann bleibe ich. Aber ich koche». Хорошо. Тогда остаюсь. Но готовлю я.', effects: [set37('ao', 'eva_stay'), w37('eva', 'stay'), { if: { npc: 'c8_eva', alive: true }, then: [{ npc: 'c8_eva', trust: 2 }] }, until37(17, 0)] },
      { id: 'c37_ao_eva_go', label: 'Сказать Эве: поезжай, за Эльбой безопаснее', when: all(not(oleHome33), evaHere, east36('give')), minutes: 25, terminal: true, goto: 'c37_radio',
        text: 'Эва кивает, как будто ты подтвердил{m:|а} то, что она уже решила. «Dann fahre ich. Am Fünfzehnten». Тогда поеду. Пятнадцатого. Пальто она так и не расстёгивает.', effects: [set37('ao', 'eva_go'), w37('eva', 'army'), until37(17, 0)] },
      { id: 'c37_ao_book', label: 'Посмотреть тетрадь Хенрике', when: all(not(oleHome33), not(evaHere)), minutes: 25, terminal: true, goto: 'c37_radio',
        text: 'Столбики, даты, цифры. В конце страницы Хенрике написала: «Bis März, wenn keiner kommt». До марта, если никто не придёт. И ниже, мельче: «Es kommt immer einer». Кто-нибудь всегда приходит.', effects: [set37('ao', 'book'), npc('henrike', 1), until37(17, 0)] },
    ] }),

  X({ id: 'c37_a_pack', title: 'Сборы', camp: kitchen14,
    text: [
      { when: aNorth36, text: 'Завтра на север, на целый день. Рюкзак лежит на кровати открытый.' },
      { when: all(not(aNorth36), bNorth36), text: 'Завтра ты провожаешь её до школы в Винзене. Обратно — один{m:|а}, вечером — снова в Винзен, встречать колонну.' },
      { when: all(not(aNorth36), not(bNorth36)), text: 'Завтра проводы в Винзене. Утром туда, потом обратно, к делам. Колонна с севера вернётся к ночи.' },
      { when: way36('east'), text: 'Рядом с рюкзаком — большой, на всё. Его ещё можно не брать.' },
    ],
    actions: [
      { id: 'c37_ap_light', label: 'Собрать лёгкий рюкзак: вода, еда, аптечка, фонарь', minutes: 40, terminal: true, goto: 'c37_supper',
        text: 'Термос, хлеб, сало, бинт, фонарик, запасные носки. Всё помещается, и рюкзак не тянет плечи. В дороге это важнее всего.', effects: [set37('ap', 'light'), set37('packed', 'light'), until37(18, 30)] },
      { id: 'c37_ap_full', label: 'Собрать всё самое ценное: на случай, если не вернёмся', minutes: 40, terminal: true, goto: 'c37_supper',
        text: 'Документы, тёплое, нож, всё, что может пригодиться, если дороги назад не будет. Рюкзак тяжёлый. Ты ставишь его у двери и стараешься на него не смотреть.', effects: [set37('ap', 'full'), set37('packed', 'full'), until37(18, 30)] },
      { id: 'c37_ap_partner', label: 'Помочь собраться {partner.dat}', minutes: 40, terminal: true, goto: 'c37_supper',
        text: 'Вы собираете вещи вместе: её и свои. Спорите о термосе, о носках, о том, класть ли шоколад. Это первый за день разговор, в котором вы смеётесь.', effects: [set37('ap', 'partner'), { body: 'stress', delta: -3 }, until37(18, 30)] },
    ] }),
];
