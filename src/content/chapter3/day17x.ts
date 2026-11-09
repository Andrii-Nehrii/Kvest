import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { S17, albers17, brandt, day16, jannes, koehler, nina, ninaHere, tobias, ute, village16 } from './point16';
import { kitchen14 } from './point14';

// Развилки участка 17 (дополнение 09.11): утро A — колония / трактор / хутор; утро B — колония / Брандт / хутор.
const any = (...xs: Cond[]): Cond => ({ any: xs });
const take = albers17('take');
const tractorHere: Cond = any(flag('w.c16_tractor'), flag('w.c17_tractor'));
const toYard: Effect = { restUntil: at(17, 11, 50) };
const toBreakfast2: Effect = { restUntil: at(17, 7, 30) };
const village = 'c16_jesteburg';
export const afterSms = [
  { id: 'can', when: all({ has: 'can_petrol_10' }, flag('$.c16_fuel')), goto: 'c17_a_can' },
  { id: 'brandt', when: { v: 'w.c16_sweep', op: '==', value: 'brandt' } as Cond, goto: 'c17_a_vgo' },
  { id: 'a', goto: 'c17_a_choice' },
];
const split = (a: string, b: string) => [{ id: 'a', when: { me: 'A' } as Cond, goto: a }, { id: 'b', goto: b }];
const road = 'b75_road';

export const day17xScenes: Scene[] = [
  // ───────────── A: выбор утра ─────────────
  S17({ id: 'c17_a_choice', for: 'any', chapter: 'ch3', title: 'Утро', camp: yard14, ambient: day16,
    text: [
      { text: 'После завтрака ты стоишь во дворе и считаешь, на что хватит утра. Завтра в восемь у насыпи будут солдаты. До этого одно утро и один вечер.' },
      { text: 'В колонии сломан насос: Яннес возит воду тачкой. Дорога на Бухгольц свободна до самой мастерской.' },
      { when: flag('w.c16_tractor'), text: 'Под навесом стоит трактор Хенрике. У сарая прицепная тележка.' },
      { when: all(flag('w.c16_tractor_known'), not(flag('w.c16_tractor'))), text: 'Трактор Хенрике ждёт у Дениза. Семь километров туда пешком, обратно на тракторе.' },
    ],
    actions: [
      { id: 'c17_ach_pump', label: 'Идти в колонию чинить насос', minutes: 3, terminal: true, goto: 'c17_a_pump',
        text: 'Ты берёшь лом, мультитул и моток проволоки из сарая.', effects: [{ set: '$.c17_ach', value: 'pump' }] },
      { id: 'c17_ach_tractor', label: 'Сходить в Бухгольц за трактором', when: all(flag('w.c16_tractor_known'), not(flag('w.c16_tractor'))), minutes: 3, terminal: true, goto: 'c17_a_tr_road',
        text: 'Ты наливаешь чай в термос Хенрике и выходишь на дорогу. Семь километров. К обеду вернёшься на колёсах.', effects: [{ set: '$.c17_ach', value: 'tractor' }] },
      { id: 'c17_ach_farm', label: 'Остаться: готовить хутор к тому, что решите', minutes: 3, terminal: true, goto: 'c17_a_f_barn',
        text: 'Ты остаёшься. Кто бы что ни решил к полудню, сараи и тележка должны быть готовы раньше.', effects: [{ set: '$.c17_ach', value: 'farm' }] },
    ] }),

  // ───────────── A: трактор ─────────────
  S17({ id: 'c17_a_tr_road', for: 'any', chapter: 'ch3', title: 'B75', location: road, ambient: day16,
    text: [{ text: 'На B75 пусто. На обочине у заправки кто-то сложил из бетонных блоков стену в человеческий рост и написал на ней краской: «Hier wohnen Menschen». Здесь живут люди.\n\nЗа стеной поднимается дым. Тебя окликают с крыши: женский голос, без злобы.\n\n— Wohin?' }],
    actions: [
      { id: 'c17_atr_answer', label: 'Ответить: в Бухгольц, к Денизу Айдыну', minutes: 85, activity: 'moderate', move: true, terminal: true, goto: 'c17_a_tr_deniz',
        text: '— Zu Aydın? — Голос смягчается. — Der hat unser Auto gemacht. Grüß ihn.\n\nК Айдыну? Он нам машину чинил. Передавай привет.\n\nДальше ты идёшь, чувствуя спиной её взгляд, пока стена не скрывается за поворотом.', effects: [{ set: '$.c17_atr', value: 'answer' }] },
      { id: 'c17_atr_wave', label: 'Помахать и пройти мимо, не останавливаясь', minutes: 80, activity: 'moderate', move: true, terminal: true, goto: 'c17_a_tr_deniz',
        text: 'Ты машешь и идёшь, не сбавляя шага. С крыши ничего не говорят. Только когда ты уже далеко, слышишь, как там смеются. Не над тобой. Просто смеются.', effects: [{ set: '$.c17_atr', value: 'wave' }] },
    ] }),

  S17({ id: 'c17_a_tr_deniz', for: 'any', chapter: 'ch3', title: 'Дениз', location: 'deniz_workshop', ambient: { tempC: 10, outdoor: false, wet: false },
    text: [{ text: 'Дениз открывает бокс, не дожидаясь стука. Трактор стоит внутри, зелёный, с одной фарой.\n\n— Керем сказал, ты придёшь, — говорит он. — Вчера сказал. Ты не пришёл{m:|а}. Я уж думал, тебя съели.' }],
    actions: [
      { id: 'c17_atd_ask', label: 'Рассказать про колонию и среду', minutes: 15, terminal: true, outcomes: [{ id: 'dz', when: { not: { flag: 'w.c16_diesel' } }, goto: 'c17_a_tr_diesel' }, { id: 'go', goto: 'c17_a_tr_stop' }],
        text: 'Дениз слушает, вытирая руки.\n\n— Семеро на цепях, — говорит он. — И вы хотите их спасать или хоронить. — Пауза. — Прицеп у Хенрике есть. На прицеп влезет четверо, если плотно. Две ходки. — Он смотрит на тебя. — Я ничего не говорил.', effects: [{ set: '$.c17_atd', value: 'ask' }, { set: '$.c17_knows_trailer', value: true }, { npc: 'deniz', trust: 1 }] },
      { id: 'c17_atd_go', label: 'Взять трактор и сразу ехать', minutes: 8, terminal: true, outcomes: [{ id: 'dz', when: { not: { flag: 'w.c16_diesel' } }, goto: 'c17_a_tr_diesel' }, { id: 'go', goto: 'c17_a_tr_stop' }],
        text: '— Сцепление не дёргай, — говорит Дениз вслед. — И фара одна, не забудь.', effects: [{ set: '$.c17_atd', value: 'go' }] },
    ] }),

  S17({ id: 'c17_a_tr_drive', for: 'any', chapter: 'ch3', title: 'На тракторе', location: 'c10_field', ambient: day16,
    text: [{ text: 'Трактор трясёт так, что термос в ящике под сиденьем звенит. У переезда поперёк дороги военный грузовик. Офицер поднимает руку.\n\n— Wohin mit dem Traktor?\n\nКуда с трактором?' }],
    actions: [
      { id: 'c17_atdr_truth', label: 'Сказать: домой, на хутор Людеманов', minutes: 10, terminal: true, goto: 'c17_yard',
        text: 'Офицер смотрит в планшет, потом на тебя.\n\n— Lüdemann. — Он кивает. — Morgen ab acht ist hier Sperrgebiet. Mit dem Traktor erst recht.\n\nЛюдеманы. Завтра с восьми здесь закрытая зона. С трактором тем более.\n\nОн отходит в сторону. Ты проезжаешь, чувствуя взгляды солдат в кузове.', effects: [{ set: '$.c17_atdr', value: 'truth' }, { set: 'w.c17_tractor', value: true }, { set: '$.c17_patrol', value: 'tractor' }, toYard] },
      { id: 'c17_atdr_plough', label: 'Сказать: пахать, пока земля не замёрзла', minutes: 10, terminal: true, goto: 'c17_yard',
        text: '— Pflügen. Im November. — Офицер усмехается. — Na dann. — И машет рукой. — Morgen ab acht ist hier Sperrgebiet.\n\nПахать. В ноябре. Ну-ну. Завтра с восьми здесь закрытая зона.', effects: [{ set: '$.c17_atdr', value: 'plough' }, { set: 'w.c17_tractor', value: true }, { set: '$.c17_patrol', value: 'tractor' }, toYard] },
    ] }),

  // ───────────── A: хутор ─────────────
  S17({ id: 'c17_a_f_barn', for: 'any', chapter: 'ch3', title: 'Длинный сарай', camp: yard14, ambient: day16,
    text: [
      { text: 'За курятником длинный сарай, где когда-то стояли коровы. Шесть стойл с железными кольцами в стене, кормушки, сено под крышей.' },
      { when: take, text: 'В малом сарае звенит цепь: Маргит ходит по кругу.' },
    ],
    actions: [
      { id: 'c17_afb_stalls', label: 'Вычистить стойла и проверить кольца', minutes: 90, activity: 'heavy', terminal: true, goto: 'c17_a_f_cart',
        text: 'Ты выгребаешь старую солому вилами, пока не начинает ломить спину. Кольца в стене вбиты насквозь, в каждом можно повиснуть. Шесть стойл. Седьмого нет. Ты не думаешь, зачем считаешь.', effects: [{ set: '$.c17_afb', value: 'stalls' }, { set: 'w.c17_barn_ready', value: true }, { body: 'fatigue', delta: 5 }] },
      { id: 'c17_afb_well', label: 'Натаскать воды в поилки', minutes: 50, activity: 'heavy', terminal: true, goto: 'c17_a_f_cart',
        text: 'Колодец, ведро, поилка. Двадцать вёдер, как говорил Яннес. Ты проверяешь, сколько это на самом деле. Это много.', effects: [{ set: '$.c17_afb', value: 'well' }, { set: '$.c17_knows_water', value: true }] },
      { id: 'c17_afb_look', label: 'Только осмотреться и прикинуть', minutes: 15, terminal: true, goto: 'c17_a_f_cart',
        text: 'Ты обходишь сарай. Крыша течёт в одном углу, дверь не закрывается до конца. Если что-то решите, работы на день.', effects: [{ set: '$.c17_afb', value: 'look' }] },
    ] }),

  S17({ id: 'c17_a_f_cart', for: 'any', chapter: 'ch3', title: 'Тележка', camp: yard14, ambient: day16,
    text: [
      { when: tractorHere, text: 'Прицепная тележка у сарая стоит на спущенном колесе. Борт треснул. Под днищем гнездо из листьев.' },
      { when: not(tractorHere), text: 'Прицепная тележка у сарая стоит на спущенном колесе. Без трактора она просто ящик на колёсах. Тачка Хенрике рядом, с новой камерой.' },
    ],
    actions: [
      { id: 'c17_afc_fix', label: 'Подкачать колесо и сколотить борт', when: tractorHere, minutes: 60, activity: 'moderate', terminal: true, goto: 'c17_a_f_gen',
        text: 'Насосом Нины колесо держит. Борт ты сколачиваешь из доски от старого ящика. Тележка снова тележка. На неё влезет четверо, если плотно. Ты думаешь это и сразу перестаёшь думать.', effects: [{ set: '$.c17_afc', value: 'fix' }, { set: 'w.c17_trailer_ready', value: true }] },
      { id: 'c17_afc_barrow', label: 'Смазать тачку и проверить колесо', minutes: 20, activity: 'light', terminal: true, goto: 'c17_a_f_gen',
        text: 'Тачка катится ровно, без скрипа. Одного человека на ней увезти можно. Как Йенса.', effects: [{ set: '$.c17_afc', value: 'barrow' }] },
      { id: 'c17_afc_leave', label: 'Оставить как есть', minutes: 3, terminal: true, goto: 'c17_a_f_gen',
        text: 'Пусть стоит. Сначала решение.', effects: [{ set: '$.c17_afc', value: 'leave' }] },
    ] }),

  S17({ id: 'c17_a_f_after', for: 'any', chapter: 'ch3', title: 'Перед полуднем', camp: yard14, ambient: day16,
    text: [
      { when: take, text: 'Из малого сарая слышно, как Маргит мычит. Ровно, на одной ноте. Тобиас сказал: любила шлягеры.' },
      { when: all(not(take), ninaHere), text: 'Нина сидит на крыльце и смотрит на насыпь. Рядом с ней пустая банка из-под слив.' },
      { when: all(not(take), not(ninaHere)), text: 'Во дворе тихо. Генератор молчит, куры копаются у забора.' },
    ],
    actions: [
      { id: 'c17_afa_margit', label: 'Посидеть у Маргит и поговорить с ней', when: take, minutes: 20, terminal: true, goto: 'c17_yard',
        text: 'Ты садишься на перевёрнутое ведро у двери сарая и рассказываешь Маргит про погоду, про кур, про то, что Тобиас приедет в четверг. Она поворачивает голову на голос. Мычание стихает.', effects: [{ set: '$.c17_afa', value: 'margit' }, tobias(1), toYard] },
      { id: 'c17_afa_nina', label: 'Сесть рядом с Ниной', when: all(not(take), ninaHere), minutes: 20, terminal: true, goto: 'c17_yard',
        text: '— Ты бы своего забрал{m:|а}? — спрашивает Нина, не поворачиваясь. — Если бы он был там. Забрал{m:|а} бы к себе?\n\nТы не отвечаешь сразу. Она и не ждёт.', effects: [{ set: '$.c17_afa', value: 'nina' }, nina(1), toYard] },
      { id: 'c17_afa_rest', label: 'Посидеть на солнце', minutes: 20, activity: 'rest', terminal: true, goto: 'c17_yard',
        text: 'Солнца нет, но ты всё равно сидишь, закрыв глаза. Руки гудят после вил.', effects: [{ set: '$.c17_afa', value: 'rest' }, { body: 'stress', delta: -2 }, toYard] },
    ] }),


  // ───────────── дополнительные сцены путей ─────────────
  S17({ id: 'c17_a_dig', for: 'any', chapter: 'ch3', title: 'Яма за теплицей', location: 'c15_garden', ambient: day16,
    text: [{ text: 'За теплицей Яннес копает. Яма уже по колено, длинная, широкая. Лопата звякает о камни.\n\n— Mama hat gesagt: für alle Fälle, — говорит он, не поднимая головы. — Für Mittwoch.\n\nМама сказала: на всякий случай. На среду.\n\nОн втыкает лопату и протягивает тебе вторую.' }],
    actions: [
      { id: 'c17_adg_help', label: 'Взять лопату и копать с ним', minutes: 60, activity: 'heavy', terminal: true, goto: 'c17_a_back2',
        text: 'Вы копаете молча, по очереди. Глина, камни, корни яблони. Когда яма доходит тебе до пояса, Яннес говорит: «Genug». Хватит. И садится на край, свесив ноги.\n\n— Sie weiß es, — говорит он. — Sie weiß es die ganze Zeit.\n\nОна знает. Всё это время знает.', effects: [{ set: '$.c17_adg', value: 'help' }, { set: 'w.c17_pit', value: true }, jannes(2), { body: 'fatigue', delta: 6 }] },
      { id: 'c17_adg_ute', label: 'Найти Уте и спросить, зачем', minutes: 10, terminal: true, goto: 'c17_a_back2',
        text: 'Уте развешивает бельё между домиками. Наволочки, носки, мужской свитер.\n\n— Damit niemand sie in einen Laster wirft, — говорит она. — Wenn es so kommt. Dann liegen sie hier. Unter den Apfelbäumen.\n\nЧтобы никто не бросил их в грузовик. Если до этого дойдёт. Тогда они будут лежать здесь. Под яблонями.', effects: [{ set: '$.c17_adg', value: 'ute' }, { set: '$.c17_knows_pit', value: true }, ute(1)] },
      { id: 'c17_adg_no', label: 'Отказаться: это не твоя яма', minutes: 3, terminal: true, goto: 'c17_a_back2',
        text: 'Яннес кивает, будто так и думал, и снова берётся за лопату. Звяк о камень провожает тебя до калитки колонии.', effects: [{ set: '$.c17_adg', value: 'no' }, jannes(-1)] },
    ] }),

  S17({ id: 'c17_a_tr_stop', for: 'any', chapter: 'ch3', title: 'У колонии', location: 'c10_field', ambient: day16,
    text: [{ text: 'Обратно ты едешь полевой дорогой вдоль насыпи. У колонии Яннес бежит наперерез трактору с пустыми вёдрами.\n\n— Насос сломан! — кричит он сквозь мотор. — Бочку бы! Хоть одну!' }],
    actions: [
      { id: 'c17_ats_haul', label: 'Съездить за бочкой воды и привезти', minutes: 50, activity: 'moderate', terminal: true, goto: 'c17_a_tr_drive',
        text: 'Ты доезжаешь до хутора, цепляешь прицеп, наливаешь бочку из колодца и возвращаешься. Яннес разливает воду по вёдрам, не говоря ни слова. Уте выходит из домика, вытирает руки и кланяется тебе. Как на сцене.', effects: [{ set: '$.c17_ats', value: 'haul' }, { set: 'w.c17_water_hauled', value: true }, jannes(2), ute(2)] },
      { id: 'c17_ats_no', label: 'Крикнуть, что вечером, и ехать', minutes: 3, terminal: true, goto: 'c17_a_tr_drive',
        text: 'Яннес опускает вёдра и смотрит тебе вслед.', effects: [{ set: '$.c17_ats', value: 'no' }] },
    ] }),

  S17({ id: 'c17_a_f_gen', for: 'any', chapter: 'ch3', title: 'Провода', camp: kitchen14,
    text: [
      { when: { flag: 'w.c16_jannes_wires' }, text: 'В одиннадцатом часу во двор заходит Яннес, с мотком провода на плече.\n\n— Ihr habt einen Generator, — говорит он. — Ich hab gesagt, ich kann Kabel.\n\nУ вас генератор. Я же говорил, что умею с проводами.' },
      { when: { not: { flag: 'w.c16_jannes_wires' } }, text: 'В сарае генератор Хенрике. Провод от него тянется к дому через двор, по земле. Изоляция в двух местах протёрта до меди.' },
    ],
    actions: [
      { id: 'c17_afg_jannes', label: 'Протянуть с Яннесом провод по стене, как надо', when: { flag: 'w.c16_jannes_wires' }, minutes: 50, activity: 'light', terminal: true, goto: 'c17_a_f_after',
        text: 'Яннес работает быстро и молча, как Дениз. Провод уходит под крышу навеса, через окно на кухню. Две розетки на одной доске.\n\n— Fertig, — говорит он. — Jetzt brennt euch nichts ab.\n\nГотово. Теперь у вас ничего не сгорит.\n\nУходя, он оглядывается на сарай с кольцом и ничего не спрашивает.', effects: [{ set: '$.c17_afg', value: 'jannes' }, { set: 'w.c17_wiring', value: true }, jannes(2)] },
      { id: 'c17_afg_tape', label: 'Замотать провод изолентой', minutes: 20, activity: 'light', terminal: true, goto: 'c17_a_f_after',
        text: 'Ты заматываешь медь изолентой, в три слоя. Не красиво, но держит. Хенрике бы сказала: криво.', effects: [{ set: '$.c17_afg', value: 'tape' }] },
      { id: 'c17_afg_leave', label: 'Не трогать', minutes: 2, terminal: true, goto: 'c17_a_f_after',
        text: 'Работало вчера — сработает и сегодня. Наверное.', effects: [{ set: '$.c17_afg', value: 'leave' }] },
    ] }),

  S17({ id: 'c17_a_v_marcus', for: 'any', chapter: 'ch3', title: 'Маркус и Лео', location: 'c16_jesteburg', ambient: day16,
    text: [{ text: 'У ворот пожарной части тебя окликают. Маркус, с рюкзаком, и Лео в Нининой толстовке, с зайцем.\n\n— Мы уходим, — говорит Маркус. — В Целле. Сегодня. Здесь говорят: завтра всё перекроют.' }],
    actions: [
      { id: 'c17_avm_food', label: 'Отдать им свою отложенную еду', when: { has: 'c3_meal' }, minutes: 5, terminal: true, goto: 'c17_a_vback',
        text: 'Маркус берёт свёрток и не говорит «спасибо». Говорит Лео: «Скажи». Лео машет тебе зайцем.', effects: [{ set: '$.c17_avm', value: 'food' }, { take: 'c3_meal', qty: 1 }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', trust: 3 }] }] },
      { id: 'c17_avm_farm', label: 'Позвать их на хутор до четверга', minutes: 8, terminal: true, goto: 'c17_a_vback',
        text: 'Маркус смотрит на Лео. Лео смотрит на зайца.\n\n— Нет, — говорит Маркус. — Если остановимся, больше не пойдём. Я себя знаю.\n\nОн жмёт тебе руку. Левой. Правая всё ещё в бинте.', effects: [{ set: '$.c17_avm', value: 'farm' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', trust: 2 }] }] },
      { id: 'c17_avm_bye', label: 'Попрощаться', minutes: 4, terminal: true, goto: 'c17_a_vback',
        text: 'Они уходят по дороге на восток, маленький и большой. У поворота маленький оборачивается и поднимает зайца над головой.', effects: [{ set: '$.c17_avm', value: 'bye' }] },
    ] }),

  S17({ id: 'c17_b_v_mats', for: 'any', chapter: 'ch3', title: 'Матс', location: 'c13_sammel', ambient: { tempC: 12, outdoor: false, wet: false },
    text: [{ text: 'Брандт сам ведёт вас в спортзал. У шведской стенки на раскладушке мальчик лет одиннадцати, нога в бинтах. Рядом женщина, похожая на Брандта: тот же подбородок.\n\n— Sonntag, zweiundzwanzig Uhr, — говорит Брандт. — Jetzt ist Dienstag. Sie verstehen was davon?\n\nВоскресенье, десять вечера. Сейчас вторник. Вы в этом что-нибудь понимаете?' }],
    actions: [
      { id: 'c17_bvm_honest', label: 'Сказать честно: жара нет, это хорошо, но не точно', minutes: 10, terminal: true, goto: 'c17_b_v_back',
        text: 'Ты говоришь, что знаешь: жара нет уже сутки. Это хорошо. Но точно не знает никто.\n\nМать мальчика кивает, будто ей сказали время автобуса. Брандт отворачивается к окну.\n\n— Danke, — говорит он стеклу. — Für «nicht sicher».\n\nСпасибо. За «не точно».', effects: [{ set: '$.c17_bvm', value: 'honest' }, brandt(2)] },
      { id: 'c17_bvm_hope', label: 'Сказать: раз жара нет, всё обойдётся', minutes: 6, terminal: true, goto: 'c17_b_v_back',
        text: 'Мать мальчика закрывает лицо ладонями и плачет, долго, беззвучно. Брандт кладёт руку ей на плечо. Тебе он ничего не говорит.', effects: [{ set: '$.c17_bvm', value: 'hope' }, brandt(1)] },
      { id: 'c17_bvm_wound', label: 'Попросить посмотреть рану', minutes: 12, terminal: true, goto: 'c17_b_v_back',
        outcomes: [
          { id: 'skill', check: { traits: ['medicine'], difficulty: 3 }, text: 'Мать разматывает бинт. Следы зубов на икре, края розовые, чистые. Ни красноты, ни гноя. Ты говоришь, как есть: рана заживает правильно.\n\nБрандт смотрит на тебя по-новому.', effects: [{ set: '$.c17_bvm', value: 'wound' }, brandt(3)] },
          { id: 'plain', text: 'Мать разматывает бинт. Следы зубов, розовые края. Ты не врач и не знаешь, что тут правильно, а что нет. Ты так и говоришь.', effects: [{ set: '$.c17_bvm', value: 'wound' }, brandt(1)] },
        ] },
    ] }),

  S17({ id: 'c17_b_f_cook', for: 'any', chapter: 'ch3', title: 'Суп', camp: kitchen14,
    text: [
      { when: { stocked: 'c17_hen', qty: 1, at: 'c3_farm_stock' }, text: 'В холодной кладовке висит ощипанная курица. Та, что ночью убилась о сетку.' },
      { when: { not: { stocked: 'c17_hen', qty: 1, at: 'c3_farm_stock' } }, text: 'На кухне тихо. До обеда два часа. Завтра будет длинный день, и есть, скорее всего, будет некогда.' },
    ],
    actions: [
      { id: 'c17_bfc_soup', label: 'Сварить из неё бульон на завтра', when: { stocked: 'c17_hen', qty: 1, at: 'c3_farm_stock' }, minutes: 90, activity: 'light', terminal: true, goto: 'c17_b_f_ute',
        text: 'Курица, луковица, морковь из погреба, соль. Кухня пахнет так, как пахнет в детстве, когда болеешь и тебя не пускают в школу. Ты разливаешь бульон по банкам и ставишь в холод. Три банки на завтра.', effects: [{ set: '$.c17_bfc', value: 'soup' }, { unstock: 'c17_hen', qty: 1, at: 'c3_farm_stock' }, { take: 'c17_hen', qty: 1 }, { place: 'c3_meal', qty: 3, at: 'c3_farm_stock' }] },
      { id: 'c17_bfc_koehler', label: 'Отложить курицу для Кёлер', when: { stocked: 'c17_hen', qty: 1, at: 'c3_farm_stock' }, minutes: 3, terminal: true, goto: 'c17_b_f_ute',
        text: 'Ты заворачиваешь курицу в чистое полотенце и кладёшь у двери. Кёлер пройдёт мимо, когда будет возвращаться.', effects: [{ set: '$.c17_bfc', value: 'koehler' }, { set: 'w.c17_hen_koehler', value: true }] },
      { id: 'c17_bfc_potato', label: 'Наварить картошки на завтра', minutes: 40, activity: 'light', terminal: true, goto: 'c17_b_f_ute',
        text: 'Ты варишь целую кастрюлю картошки в мундире и оставляешь остывать. Завтра её можно будет есть холодной, на ходу.', effects: [{ set: '$.c17_bfc', value: 'potato' }] },
    ] }),

  S17({ id: 'c17_b_pit', for: 'any', chapter: 'ch3', title: 'За теплицей', location: 'c15_garden', ambient: day16,
    text: [{ text: 'За теплицей кто-то выкопал длинную яму. Края свежие, глина ещё мокрая. Рядом воткнуты две лопаты.\n\nУте видит, куда ты смотришь.\n\n— Für alle Fälle, — говорит она. — Damit niemand sie in einen Laster wirft.\n\nНа всякий случай. Чтобы никто не бросил их в грузовик.' }],
    actions: [
      { id: 'c17_bpt_hand', label: 'Взять её за руку', minutes: 5, terminal: true, goto: 'c17_b_back',
        text: 'Рука у Уте сухая и горячая. Она не отнимает её, пока ты сам{m:|а} не отпускаешь.', effects: [{ set: '$.c17_bpt', value: 'hand' }, ute(2)] },
      { id: 'c17_bpt_ask', label: 'Спросить: значит, вы готовы их отпустить?', minutes: 8, terminal: true, goto: 'c17_b_back',
        text: 'Уте долго смотрит на яму.\n\n— Ich bin bereit, dass jemand anders es nicht macht, — говорит она. — Das ist nicht dasselbe.\n\nЯ готова к тому, чтобы это сделал не кто-то другой. Это не одно и то же.', effects: [{ set: '$.c17_bpt', value: 'ask' }, { set: '$.c17_ute_ready', value: true }] },
      { id: 'c17_bpt_go', label: 'Отвернуться и идти', minutes: 3, terminal: true, goto: 'c17_b_back',
        text: 'Ты отворачиваешься. Кёлер ждёт у калитки колонии.', effects: [{ set: '$.c17_bpt', value: 'go' }] },
    ] }),


  // ───────────── перед полуднем: проверка дворов у насыпи (обе линии) ─────────────
  S17({ id: 'c17_check', for: 'any', chapter: 'ch3', title: 'Проверка', camp: yard14, ambient: day16,
    text: [
      { text: 'Ровно в двенадцать у калитки тормозит военный грузовик. Из кабины выпрыгивает молодой офицер с планшетом, за ним трое солдат. Последним из кузова слезает Тобиас и встаёт у колеса, не глядя на дом.\n\n— Kontrolle. Alle Höfe an der Bahn, — говорит офицер. — Wer wohnt hier?\n\nПроверка. Все дворы у насыпи. Кто здесь живёт?' },
      { when: take, text: 'В малом сарае звякает цепь. Один раз. Потом тихо.' },
    ],
    actions: [
      { id: 'c17_chk_go', label: 'Выйти к ним', minutes: 2, terminal: true, outcomes: split('c17_a_check', 'c17_b_check'), effects: [{ set: '$.c17_chk', value: 'go' }] },
      { id: 'c17_chk_partner', label: 'Встать рядом с {partner.ins}', minutes: 2, terminal: true, outcomes: split('c17_a_check', 'c17_b_check'),
        text: 'Ты встаёшь рядом. Плечо к плечу.', effects: [{ set: '$.c17_chk', value: 'partner' }] },
    ] }),

  S17({ id: 'c17_a_check', for: 'any', chapter: 'ch3', title: 'Офицер', camp: yard14, ambient: day16,
    text: [{ text: 'Офицер обходит двор, заглядывает под навес, в пустую кабину фургона. Записывает. Солдаты стоят у калитки и курят.\n\n— Und die Scheunen? — спрашивает он тебя.\n\nА сараи?' }],
    actions: [
      { id: 'c17_ach2_hosts', label: 'Сказать: хозяева в Люнебурге, мы присматриваем', minutes: 8, terminal: true, goto: 'c17_check_after',
        text: '— Lüneburg, — повторяет офицер и что-то отмечает. — Plasma? — Ты киваешь. Он смотрит на тебя внимательнее. — Gut. Die sind wichtig.\n\nЛюнебург. Плазма? Хорошо. Они важные.\n\nК сараям он так и не идёт.', effects: [{ set: '$.c17_ach2', value: 'hosts' }] },
      { id: 'c17_ach2_brandt', label: 'Сказать: мы записаны у Брандта', when: { any: [{ v: '$.c16_gate', op: '==', value: 'hof' }, { v: '$.c16_gate', op: '==', value: 'why' }, flag('$.c17_ab')] }, minutes: 6, terminal: true, goto: 'c17_check_after',
        text: '— Brandt, — говорит офицер. — Dann wissen Sie, was morgen ist.\n\nБрандт. Тогда вы знаете, что будет завтра.\n\nОн закрывает планшет. Тобиас у колеса впервые поднимает глаза.', effects: [{ set: '$.c17_ach2', value: 'brandt' }, tobias(1)] },
      { id: 'c17_ach2_tomorrow', label: 'Спросить, что будет завтра у насыпи', minutes: 8, risky: true, terminal: true, goto: 'c17_check_after',
        text: '— Ab acht Sperrgebiet. Die Anlage wird geräumt, — говорит офицер ровно, как прогноз погоды. — Wer sich in den Weg stellt, wird festgenommen. Auch Zivilisten.\n\nС восьми закрытая зона. Объект очистят. Кто встанет на пути, будет задержан. Гражданские тоже.\n\nОн смотрит на тебя, пока ты не отводишь взгляд.', effects: [{ set: '$.c17_ach2', value: 'tomorrow' }, { set: 'w.c17_arrest_warned', value: true }] },
    ] }),

  S17({ id: 'c17_b_check', for: 'any', chapter: 'ch3', title: 'Сарай', camp: yard14, ambient: day16,
    text: [
      { when: take, text: 'Пока {A} говорит с офицером, ты стоишь у малого сарая. За дверью Маргит. Если она замычит, если звякнет цепь…' },
      { when: albers17('no'), text: 'Пока {A} говорит с офицером, ты стоишь у колодца. Тобиас у колеса грузовика смотрит на тебя и сразу отводит глаза.' },
      { when: ninaHere, text: 'Нина в окне второго этажа. Ты делаешь ей знак: не выходи.' },
    ],
    actions: [
      { id: 'c17_bch_radio', label: 'Сделать радио громче', when: all(take, { has: 'radio' }), minutes: 6, terminal: true, goto: 'c17_check_after',
        text: 'Ты прибавляешь звук. Шлягер с аккордеоном на весь двор. Солдат у калитки ухмыляется. Офицер морщится и больше не смотрит в сторону сараев. За дверью тихо.', effects: [{ set: '$.c17_bch', value: 'radio' }, tobias(2)] },
      { id: 'c17_bch_door', label: 'Встать спиной к двери сарая', when: take, minutes: 6, risky: true, terminal: true, goto: 'c17_check_after',
        text: 'Ты прислоняешься к двери спиной, будто устал{m:|а}. За доской слышно дыхание. Тобиас у грузовика бледнеет и громко спрашивает офицера про бензин. Офицер отвлекается.', effects: [{ set: '$.c17_bch', value: 'door' }, { body: 'stress', delta: 3 }, tobias(1)] },
      { id: 'c17_bch_water', label: 'Вынести солдатам воды', minutes: 6, terminal: true, goto: 'c17_check_after',
        text: 'Ты выносишь ведро колодезной воды и кружку. Солдаты пьют по очереди, молодые, с обветренными губами. Один говорит «danke» по-русски: «спасибо». У него бабушка из Омска.', effects: [{ set: '$.c17_bch', value: 'water' }] },
      { id: 'c17_bch_tobias', label: 'Подойти к Тобиасу', when: albers17('no'), minutes: 6, terminal: true, goto: 'c17_check_after',
        text: '— Ich mache es morgen früh selbst, — говорит он, не поворачивая головы. — Um sechs. Vor allen.\n\nЯ сделаю это завтра рано утром сам. В шесть. Раньше всех.\n\nОн говорит это тебе, не матери. Она в колонии, в девятом домике.', effects: [{ set: '$.c17_bch', value: 'tobias' }, { set: 'w.c17_tobias_six', value: true }] },
    ] }),

  S17({ id: 'c17_check_after', for: 'any', chapter: 'ch3', title: 'Уехали', camp: yard14, ambient: day16,
    text: [{ text: 'Грузовик уезжает в сторону следующего двора. Тобиас сидит в кузове спиной к кабине и смотрит на ваш дом, пока его видно.' },
      { when: take, text: 'В малом сарае снова звякает цепь. Маргит ходит по кругу.' }],
    actions: [
      { id: 'c17_cha_breathe', label: 'Выдохнуть и пойти на кухню', minutes: 5, terminal: true, goto: 'c17_noon',
        text: 'На кухне ты долго держишь руки под холодной водой. Потом ещё дольше вытираешь.', effects: [{ set: '$.c17_cha', value: 'breathe' }, { body: 'stress', delta: -1 }] },
      { id: 'c17_cha_talk', label: 'Сказать {partner.dat}, что ты успел{m:|а} увидеть', minutes: 8, terminal: true, goto: 'c17_noon',
        text: 'Вы стоите у калитки и говорите вполголоса. У каждого своё: планшет, сарай, лицо Тобиаса. Вместе выходит больше.', effects: [{ set: '$.c17_cha', value: 'talk' }] },
    ] }),

  // ───────────── утро: сообщения и дела перед главным ─────────────
  S17({ id: 'c17_a_sms', for: 'any', chapter: 'ch3', title: 'Сообщение', camp: kitchen14,
    text: [
      { when: take, text: 'Телефон вибрирует. Тобиас: «Wie geht es ihr?» Как она?' },
      { when: albers17('no'), text: 'Телефон вибрирует. Тобиас: «Ich verstehe. Morgen früh mache ich es selbst. Vor Brandt.» Я понимаю. Завтра утром сделаю сам. До Брандта.' },
    ],
    actions: [
      { id: 'c17_asm_calm', label: 'Ответить: спокойно, пьёт', when: take, minutes: 3, terminal: true, outcomes: afterSms,
        text: '«Ruhig. Sie trinkt.» Через минуту: «Danke. Danke. Danke.» Три раза, как будто одного мало.', effects: [{ set: '$.c17_asm', value: 'calm' }, { charge: 'phone', delta: -1 }, tobias(2)] },
      { id: 'c17_asm_photo', label: 'Сфотографировать сарай снаружи и отправить', when: take, minutes: 5, terminal: true, outcomes: afterSms,
        text: 'Дверь сарая, солома у порога, миска. Тобиас долго не отвечает. Потом присылает фото: велосипед у стены казармы. Больше ничего.', effects: [{ set: '$.c17_asm', value: 'photo' }, { charge: 'phone', delta: -1 }, tobias(1)] },
      { id: 'c17_asm_sorry', label: 'Ответить: прости нас', when: albers17('no'), minutes: 3, terminal: true, outcomes: afterSms,
        text: '«Es tut uns leid». Ответ: «Ihr habt Jens genommen. Das reicht». Вы взяли Йенса. Этого хватит.\n\nТы не знаешь, упрёк это или нет.', effects: [{ set: '$.c17_asm', value: 'sorry' }, { charge: 'phone', delta: -1 }] },
      { id: 'c17_asm_silent', label: 'Не отвечать', minutes: 2, terminal: true, outcomes: afterSms,
        text: 'Ты кладёшь телефон экраном вниз. Две серые галочки, наверное, уже стоят. Прочитано.', effects: [{ set: '$.c17_asm', value: 'silent' }] },
    ] }),

  S17({ id: 'c17_b_morning', for: 'any', chapter: 'ch3', title: 'До девяти', camp: yard14, ambient: day16,
    text: [
      { when: take, text: 'До прихода Кёлер полтора часа. В малом сарае Маргит ходит по кругу на длину цепи. Миска у кольца пустая.' },
      { when: albers17('no'), text: 'До прихода Кёлер полтора часа. Двор после ночи кажется чужим: следы на инее, открытая кабина фургона.' },
    ],
    actions: [
      { id: 'c17_bmo_margit', label: 'Налить Маргит воды ковшом на палке', when: take, minutes: 15, terminal: true, goto: 'c17_b_koehler',
        text: 'Ковш на палке. Маргит пьёт жадно, проливая на платок. Шлем мешает, вода течёт по подбородку. Она не замечает.', effects: [{ set: '$.c17_bmo', value: 'margit' }, { restUntil: at(17, 9) }] },
      { id: 'c17_bmo_eggs', label: 'Собрать яйца и покормить кур', minutes: 20, activity: 'light', terminal: true, goto: 'c17_b_koehler',
        text: 'Четыре яйца. Ещё тёплые. Куры бегут за тобой по двору, как за Хенрике.', effects: [{ set: '$.c17_bmo', value: 'eggs' }, { place: 'eggs', qty: 1, at: 'c3_farm_stock' }, { restUntil: at(17, 9) }] },
      { id: 'c17_bmo_nina', label: 'Посидеть с Ниной на кухне', when: ninaHere, minutes: 20, terminal: true, goto: 'c17_b_koehler',
        text: 'Нина режет хлеб и молчит. Потом говорит, не поднимая глаз:\n\n— Если завтра солдаты… я хочу быть там. Не дома. Даже если вы скажете «нет».', effects: [{ set: '$.c17_bmo', value: 'nina' }, { set: 'w.c17_nina_wants', value: true }, nina(1), { restUntil: at(17, 9) }] },
    ] }),

  S17({ id: 'c17_b_f_ute', for: 'any', chapter: 'ch3', title: 'Уте у калитки', camp: yard14, ambient: day16,
    text: [{ text: 'В половине одиннадцатого у калитки стоит Уте. В пальто, с велосипедом. Она пришла сама, через поле.\n\n— Ich wollte die Scheunen sehen, — говорит она. — Nur sehen. Ich frage noch nichts.\n\nЯ хотела посмотреть сараи. Только посмотреть. Я ещё ничего не прошу.' }],
    actions: [
      { id: 'c17_bfu_show', label: 'Показать ей длинный сарай', minutes: 20, terminal: true, goto: 'c17_b_f_msg',
        text: 'Уте ходит вдоль стойл и трогает кольца в стене, одно за другим. Шесть. Считает вслух. Потом стоит у последнего и говорит:\n\n— Sieben. Einer müsste draußen. — Пауза. — Nein. Ich frage noch nichts.\n\nСемь. Одному пришлось бы снаружи. Нет. Я ещё ничего не прошу.', effects: [{ set: '$.c17_bfu', value: 'show' }, { set: 'w.c17_move_asked', value: true }, ute(2)] },
      { id: 'c17_bfu_tea', label: 'Позвать её на чай вместо сарая', minutes: 20, terminal: true, goto: 'c17_b_f_msg',
        text: 'Уте пьёт чай на кухне Хенрике и смотрит в окно, на сараи. Говорит про Кая: как он запирал дверь на два оборота. Про сарай больше не спрашивает.', effects: [{ set: '$.c17_bfu', value: 'tea' }, ute(1)] },
      { id: 'c17_bfu_no', label: 'Сказать: не сейчас, решим с {A.ins}', minutes: 5, terminal: true, goto: 'c17_b_f_msg',
        text: 'Уте кивает, разворачивает велосипед и уходит через поле. Не оглядывается.', effects: [{ set: '$.c17_bfu', value: 'no' }] },
    ] }),

  S17({ id: 'c17_a_tr_diesel', for: 'any', chapter: 'ch3', title: 'Солярка', location: 'deniz_workshop', ambient: { tempC: 10, outdoor: false, wet: false },
    text: [{ text: 'Когда ты уже садишься на трактор, Дениз выкатывает из угла канистру.\n\n— Двадцать литров солярки, — говорит он. — Хенрике осенью картошкой отдаст. Или не отдаст. Бери.' }],
    actions: [
      { id: 'c17_atdi_take', label: 'Взять канистру', minutes: 5, terminal: true, goto: 'c17_a_tr_stop',
        text: 'Канистра тяжёлая, ты ставишь её в ящик за сиденьем. Дениз хлопает по капоту, как по лошади.', effects: [{ set: '$.c17_atdi', value: 'take' }, { set: 'w.c17_diesel', value: true }, { npc: 'deniz', trust: 1 }] },
      { id: 'c17_atdi_no', label: 'Отказаться: Денизу нужнее', minutes: 3, terminal: true, goto: 'c17_a_tr_stop',
        text: 'Дениз смотрит на тебя, потом закатывает канистру обратно в угол.\n\n— Гордые все, — говорит он. — Хенрике научила.', effects: [{ set: '$.c17_atdi', value: 'no' }, { npc: 'deniz', trust: 2 }] },
    ] }),


  S17({ id: 'c17_dawn2', for: 'any', chapter: 'ch3', title: 'Перед завтраком', camp: kitchen14,
    text: [
      { when: ninaHere, text: 'Нина сидит на кухне одетая, будто не ложилась. Перед ней чашка с остывшим чаем.\n\n— Завтра, — говорит она. — Что вы решили? Только не говорите «посмотрим».' },
      { when: { not: ninaHere }, text: 'Телефон вибрирует. Нина из Винзена: «Was passiert morgen? Lena sagt, die Soldaten fahren zur Bahn». Что будет завтра? Лена говорит, солдаты едут к насыпи.' },
    ],
    actions: [
      { id: 'c17_d2_truth', label: 'Сказать правду: ещё не решили, решим к обеду', minutes: 6, terminal: true, goto: 'c17_breakfast',
        text: 'Нина кивает.\n\n— К обеду, — повторяет она. — Ладно. Я подожду. Я хорошо жду.', effects: [{ set: '$.c17_d2', value: 'truth' }, nina(1), toBreakfast2] },
      { id: 'c17_d2_calm', label: 'Сказать: мы будем рядом, что бы ни было', minutes: 5, terminal: true, goto: 'c17_breakfast',
        text: '— Рядом, — повторяет Нина. — Это не ответ. — Пауза. — Но хорошо.', effects: [{ set: '$.c17_d2', value: 'calm' }, nina(1), toBreakfast2] },
      { id: 'c17_d2_ask', label: 'Спросить, чего хочет она', minutes: 8, terminal: true, goto: 'c17_breakfast',
        text: 'Нина думает долго.\n\n— Чтобы его не застрелили чужие, — говорит она. — Чужие — это самое плохое. Всё остальное я переживу.', effects: [{ set: '$.c17_d2', value: 'ask' }, { set: 'w.c17_nina_wish', value: true }, toBreakfast2] },
    ] }),

  // ───────────── B: Кёлер к Брандту ─────────────
  S17({ id: 'c17_b_v_road', for: 'any', chapter: 'ch3', title: 'К Брандту', location: 'c7_farm_lane', ambient: day16,
    text: [{ text: 'Кёлер идёт быстро, будто боится передумать. Хлеб для брата она прижимает к груди.\n\n— Ich sage es ihm ins Gesicht, — повторяет она. — Dass ich es ihm gesagt habe und dass es falsch war.\n\nСкажу ему в лицо. Что сказала ему и что зря.' }],
    actions: [
      { id: 'c17_bvr_listen', label: 'Слушать, как она репетирует', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c17_b_v_brandt',
        text: 'Кёлер повторяет фразу шёпотом, на разные лады. На третий раз голос перестаёт дрожать.', effects: [{ set: '$.c17_bvr', value: 'listen' }, koehler(1)] },
      { id: 'c17_bvr_doubt', label: 'Спросить, не сделает ли это хуже', minutes: 40, activity: 'moderate', move: true, terminal: true, goto: 'c17_b_v_brandt',
        text: '— Schlimmer? — Кёлер останавливается. — Schlimmer als Soldaten mit Gewehren vor meinem Bruder?\n\nХуже? Хуже, чем солдаты с винтовками перед моим братом?\n\nДальше она идёт ещё быстрее.', effects: [{ set: '$.c17_bvr', value: 'doubt' }] },
    ] }),

  S17({ id: 'c17_b_v_brandt', for: 'any', chapter: 'ch3', title: 'Брандт и Кёлер', location: village, camp: village16, ambient: day16,
    onEnter: [{ introduceNpc: 'c16_brandt' }, { set: '$.met.c16_brandt', value: true }],
    text: [
      { text: 'Брандт сидит в глубине гаража над картой района. Седые усы, куртка пожарной команды. Увидев Кёлер, он встаёт.\n\n— Elke.\n\nКёлер не садится.\n\n— Ich habe dir gesagt, wo sie sind, — говорит она. — Mein Bruder ist da. Werner. Du kennst ihn. Du hast vierzig Jahre seine Brötchen gegessen.\n\nЯ сказала тебе, где они. Там мой брат. Вернер. Ты его знаешь. Ты сорок лет ел его булочки.' },
      { text: 'Брандт молчит. Потом смотрит на тебя.\n\n— Und Sie?' },
    ],
    actions: [
      { id: 'c17_bvb_names', label: 'Рассказать, как Уте зовёт каждого по имени', minutes: 12, terminal: true, goto: 'c17_b_v_mats',
        text: 'Ты рассказываешь: вёдра, миски, ставни. «Opa Gerd. Frau Albers. Herr Stamer». Уте здоровается с каждым каждое утро.\n\nБрандт садится. Тяжело, как старик.\n\n— Gerd Stamer war mein Lehrer, — говорит он. — Sport.\n\nГерд Штамер был моим учителем. Физкультуры.', effects: [{ set: '$.c17_bvb', value: 'names' }, { set: '$.c17_brandt_b', value: 'soft' }, brandt(2)] },
      { id: 'c17_bvb_see', label: 'Позвать его прийти завтра в семь и посмотреть самому', minutes: 10, terminal: true, goto: 'c17_b_v_mats',
        text: 'Брандт смотрит на Кёлер, на тебя, на карту.\n\n— Um sieben, — говорит он. — Eine Stunde vor den Soldaten. Eine halbe Stunde. Elke, du kommst mit.\n\nВ семь. За час до солдат. Полчаса. Элке, ты пойдёшь со мной.', effects: [{ set: '$.c17_bvb', value: 'see' }, { set: '$.c17_brandt_b', value: 'see' }, { set: 'w.c17_brandt_seven', value: true }, brandt(1), koehler(2)] },
      { id: 'c17_bvb_kai', label: 'Честно сказать про ночь, когда один ушёл', minutes: 10, risky: true, terminal: true, goto: 'c17_b_v_mats',
        text: 'Брандт слушает, и лицо у него каменеет.\n\n— Also doch, — говорит он. — Einer ist rausgekommen.\n\nЗначит, всё-таки. Один вышел.\n\nПотом, после паузы:\n\n— Danke, dass Sie es sagen. Die anderen hätten gelogen.\n\nСпасибо, что сказали. Другие бы соврали.', effects: [{ set: '$.c17_bvb', value: 'kai' }, { set: '$.c17_brandt_b', value: 'hard' }, brandt(1)] },
    ] }),

  S17({ id: 'c17_b_v_back', for: 'any', chapter: 'ch3', title: 'Обратно', location: 'c7_farm_lane', ambient: day16,
    text: [{ text: 'На обратной дороге Кёлер молчит. У поворота к своему двору останавливается и отдаёт тебе хлеб в полотенце.\n\n— Bring ihn Werner, — говорит она. — Wenn ihr hingeht. Ich gehe morgen.\n\nОтнеси его Вернеру, если пойдёте. Я пойду завтра.' }],
    actions: [
      { id: 'c17_bvk_take', label: 'Взять хлеб', minutes: 35, activity: 'moderate', move: true, terminal: true, goto: 'c17_yard',
        text: 'Хлеб ещё тёплый. Ты несёшь его домой, прижав к груди, как она.', effects: [{ set: '$.c17_bvk', value: 'take' }, { give: 'c9_koehler_bread', qty: 1 }, toYard] },
      { id: 'c17_bvk_no', label: 'Сказать: отнесёте вместе, завтра', minutes: 35, activity: 'moderate', move: true, terminal: true, goto: 'c17_yard',
        text: 'Кёлер кивает и забирает хлеб обратно. Уходит, не оглядываясь, очень прямо.', effects: [{ set: '$.c17_bvk', value: 'no' }, koehler(1), toYard] },
    ] }),

  // ───────────── B: хутор ─────────────
  S17({ id: 'c17_b_f_home', for: 'any', chapter: 'ch3', title: 'Без тебя', camp: yard14, ambient: day16,
    text: [
      { text: 'Кёлер уходит по шпалам к колонии. Ты смотришь ей вслед из калитки.' },
      { when: flag('w.c17_nina_with_koehler'), text: 'Нина идёт рядом с ней, с письмом в кармане. Ты разрешил{m:|а}. Или не запретил{m:|а}.' },
      { when: take, text: 'В малом сарае звенит цепь.' },
    ],
    actions: [
      { id: 'c17_bfh_radio', label: 'Поставить у сарая радио для Маргит', when: all(take, { has: 'radio' }), minutes: 15, terminal: true, goto: 'c17_b_f_cook',
        text: 'Ты ставишь приёмник на ящик у двери и ищешь волну. Шлягер, ужасный, с аккордеоном. Мычание в сарае стихает. Через минуту цепь перестаёт звенеть.', effects: [{ set: '$.c17_bfh', value: 'radio' }, { set: 'w.c17_margit_calm', value: true }, tobias(1)] },
      { id: 'c17_bfh_water', label: 'Налить Маргит воды', when: take, minutes: 10, terminal: true, goto: 'c17_b_f_cook',
        text: 'Ковш на палке, как у Уте. Маргит пьёт, наклонившись к миске, жадно, проливая на платок.', effects: [{ set: '$.c17_bfh', value: 'water' }] },
      { id: 'c17_bfh_barn', label: 'Вычистить длинный сарай', minutes: 80, activity: 'heavy', terminal: true, goto: 'c17_b_f_cook',
        text: 'Шесть стойл, кольца в стене. Ты выгребаешь солому, пока не начинают дрожать руки. Если что-то решите, место будет.', effects: [{ set: '$.c17_bfh', value: 'barn' }, { set: 'w.c17_barn_ready', value: true }, { body: 'fatigue', delta: 5 }] },
      { id: 'c17_bfh_hens', label: 'Заняться курами и яйцами', minutes: 20, activity: 'light', terminal: true, goto: 'c17_b_f_cook',
        text: 'Пять яиц, одно с двумя желтками, ты знаешь по весу. Хенрике говорила: к счастью. Ты кладёшь его отдельно.', effects: [{ set: '$.c17_bfh', value: 'hens' }, { place: 'eggs', qty: 1, at: 'c3_farm_stock' }] },
    ] }),

  S17({ id: 'c17_b_f_msg', for: 'any', chapter: 'ch3', title: 'Гонец', camp: yard14, ambient: day16,
    text: [{ text: 'В одиннадцатом часу к калитке подъезжает на велосипеде парень с повязкой, тот, что записывает всех у пожарной части.\n\n— Herr Brandt lässt fragen, — говорит он и достаёт тетрадь. — Wie viele sind es? Und wer?\n\nГосподин Брандт спрашивает: сколько их? И кто?' }],
    actions: [
      { id: 'c17_bfm_names', label: 'Назвать тех, кого знаешь по имени', minutes: 10, terminal: true, goto: 'c17_yard',
        text: 'Ты называешь, кого знаешь: Кай, Вернер, фрау Альберс, господин Штамер.\n\nПарень записывает печатными буквами. На «Штамер» он поднимает голову.\n\n— Herr Stamer? Unser Sportlehrer?\n\nГосподин Штамер? Наш физрук?', effects: [{ set: '$.c17_bfm', value: 'names' }, { set: '$.c17_brandt_b', value: 'soft' }, brandt(1), toYard] },
      { id: 'c17_bfm_come', label: 'Передать: пусть придёт в семь и посмотрит сам', minutes: 6, terminal: true, goto: 'c17_yard',
        text: 'Парень записывает слово в слово и уезжает. Через час приходит SMS с незнакомого номера: «Um sieben. Brandt». В семь.', effects: [{ set: '$.c17_bfm', value: 'come' }, { set: 'w.c17_brandt_seven', value: true }, toYard] },
      { id: 'c17_bfm_no', label: 'Сказать: пусть спросит сам', minutes: 4, terminal: true, goto: 'c17_yard',
        text: 'Парень пожимает плечами, записывает «verweigert», отказались, и уезжает. Колесо велосипеда скрипит до самого поворота.', effects: [{ set: '$.c17_bfm', value: 'no' }, brandt(-1), toYard] },
    ] }),
];

