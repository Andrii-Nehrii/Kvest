import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { A18, S18, any, brandtGood, cold18, colony17, day18, ilseTurned, jens18, margitFarm, ninaFarm, npc, own, v } from './point18';

// Участок 18, линия A: хутор и колония в одиночку. Четыре ветки по ответу КТ17.
const garden = 'c15_garden';
const move = colony17('move'), end = colony17('end'), stand = colony17('stand'), away = colony17('away');
const set = (key: string, value: string | boolean): Effect => ({ set: `$.c18_${key}`, value });
const w = (key: string, value: string | boolean | number): Effect => ({ set: `w.c18_${key}`, value });
const until = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
const tableOnly = { enabled: { camp: 'tableMeal' } as Cond, disabledReason: 'Своя порция уже использована или не выделена' };
const koehlerThere: Cond = flag('B.c17_koehler_wed');
const seen: Cond = own('m4', 'wait');
const afterSupper = [{ id: 'courier', goto: 'c18_a_courier' }];
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S18({ ...scene, for: 'any', chapter: 'ch3',
  actions: scene.actions.map(a => ({ ...a, when: all(A18, a.when ?? { always: true }) })) });

export const day18AScenes: Scene[] = [
  A({ id: 'c18_a_alone', title: 'Двор', camp: yard14, ambient: day18,
    text: [
      { text: 'Грузовик уходит по дороге на Йестебург. Во дворе остаётся запах солярки. До завтрашних восьми утра семнадцать часов.' },
      { when: move, text: 'Трактор стоит под навесом. Прицеп рядом. Этой ночью две ходки, и вместо {B.gen} с тобой будет только Яннес.' },
      { when: end, text: 'Вечером ты должен был идти к Уте вдвоём с {B.ins}. Теперь говорить придётся одному.' },
      { when: stand, text: 'Завтра в половине восьмого у калитки колонии ты будешь стоять один.' },
      { when: away, text: 'Вы решили не вмешиваться. Это легче решить вдвоём, чем высидеть одному.' },
    ],
    actions: [
      { id: 'c18_aa_yard', label: 'Проверить двор: сарай, кольца, обе калитки', minutes: 90, activity: 'moderate', terminal: true, goto: 'c18_a_nina',
        text: 'Ты обходишь всё по порядку. Кольца в стене длинного сарая держат твой вес. Заднюю калитку ты подпираешь доской изнутри. Руки заняты, и голове от этого легче.', effects: [set('prep', 'yard'), until(17, 16, 40)] },
      { id: 'c18_aa_sleep', label: 'Лечь и поспать до сумерек', minutes: 5, terminal: true, goto: 'c18_a_nina',
        text: 'Ты ложишься поверх одеяла, в свитере. Половина кровати пустая. Ты засыпаешь на своей.', effects: [set('prep', 'sleep'), until(17, 16, 40, true)] },
      { id: 'c18_aa_ute', label: 'Дойти до колонии и сказать Уте, что ты теперь один', minutes: 95, activity: 'moderate', move: true, terminal: true, goto: 'c18_a_nina',
        text: 'Уте слушает на ступеньке одиннадцатого домика.\n\n— Allein, — повторяет она. — Daran gewöhnt man sich nicht.\n\nОдин. К этому не привыкаешь.\n\nОна даёт тебе с собой банку смородинового варенья. Обратно ты идёшь быстро.', effects: [set('prep', 'ute'), npc('c14_ute', 2), until(17, 16, 40)] },
    ] }),

  A({ id: 'c18_a_nina', title: 'Нина', camp: house14,
    text: [
      { when: ninaFarm, text: 'Нина сидит на лестнице, на третьей ступеньке. Она видела грузовик из окна.\n\n— Sie kommt wieder? — спрашивает она.\n\nОна вернётся?' },
      { when: not(ninaFarm), text: 'Телефон лежит на подоконнике кухни, там ловит одна полоска. От Нины сообщение из Винзена: «Was ist morgen?» Что завтра?' },
    ],
    actions: [
      { id: 'c18_an_truth', label: 'Сказать как есть: завтра к вечеру, если пустят', minutes: 10, terminal: true, goto: 'c18_a_call',
        text: '— Завтра к вечеру. Если машину выпустят, — говоришь ты.\n\n— Если, — повторяет Нина. Она кивает. Взрослые говорили ей «точно» слишком много раз.', effects: [set('an', 'truth'), npc('c7_nina', 2)] },
      { id: 'c18_an_sure', label: 'Сказать: вернётся, конечно', minutes: 5, terminal: true, goto: 'c18_a_call',
        text: '— Конечно, — говоришь ты.\n\nНина смотрит на тебя дольше, чем нужно, и ничего не отвечает.', effects: [set('an', 'sure')] },
      { id: 'c18_an_work', label: 'Дать ей дело на вечер', minutes: 10, terminal: true, goto: 'c18_a_call',
        text: 'Ты просишь её вечером закрыть кур и записать в тетрадь Хенрике, сколько осталось картошки. Она отвечает одно слово: «Ja». Но встаёт сразу.', when: ninaFarm, effects: [set('an', 'work'), npc('c7_nina', 1)] },
    ] }),

  A({ id: 'c18_a_koehler', title: 'Кёлер у ворот', camp: yard14, ambient: cold18,
    text: [
      { text: 'В пять у ворот стоит Кёлер с пустой сумкой. Она пришла не за едой.' },
      { when: koehlerThere, text: '— Morgen um halb acht bin ich bei Werner, — говорит она. — Ich wollte nur wissen, ob ich dort jemanden kenne.\n\nЗавтра в половине восьмого я у Вернера. Хотела только знать, будет ли там кто-то знакомый.' },
      { when: not(koehlerThere), text: '— Ich gehe morgen nicht hin, — говорит она. — Ich kann das nicht sehen. Sagen Sie mir danach, wie es war?\n\nЯ завтра не пойду. Не могу это видеть. Вы скажете мне потом, как это было?' },
    ],
    actions: [
      { id: 'c18_ak_promise', label: 'Пообещать прийти к ней после', minutes: 10, terminal: true, goto: 'c18_a_supper',
        text: 'Ты обещаешь. Она кивает и уходит по дороге, не оглядываясь. Сумка бьёт её по колену.', effects: [set('ak', 'promise'), npc('c3_koehler', 2, 'c18_promised_word'), until(17, 18, 40)] },
      { id: 'c18_ak_plan', label: 'Сказать ей, что вы решили на завтра', minutes: 10, terminal: true, goto: 'c18_a_supper',
        text: 'Ты говоришь, что вы решили. Она слушает и трогает пальцем засов ворот.\n\n— Gut, dass ich es weiß, — говорит она наконец. Хорошо, что я знаю.', effects: [set('ak', 'plan'), npc('c3_koehler', 1), until(17, 18, 40)] },
      { id: 'c18_ak_bread', label: 'Положить ей в сумку хлеба и ничего не обещать', minutes: 5, terminal: true, goto: 'c18_a_supper',
        text: 'Ты выносишь полкирпича хлеба. Она берёт и держит его двумя руками, как держат чужого ребёнка.', effects: [set('ak', 'bread'), npc('c3_koehler', 1), until(17, 18, 40)] },
    ] }),

  A({ id: 'c18_a_supper', title: 'Ужин на одного', camp: kitchen14,
    text: [
      { text: 'На столе две тарелки. Одну ты убираешь обратно на полку.' },
      { text: 'На подоконнике лежит тетрадь Хенрике, раскрытая на последней записи. Её рукой, наискось: «Schinken hängt, wo es zieht. Schlüssel beim Salz».' },
      { when: ninaFarm, text: 'Нина ест напротив и читает что-то в телефоне под столом.' },
    ],
    actions: [
      { id: 'c18_as_eat', label: 'Поесть', minutes: 20, terminal: true, outcomes: afterSupper, ...tableOnly,
        text: 'Картошка с луком. Ты доедаешь всё: ночь или утро будут длинными.', effects: [set('as', 'eat'), meal('eat')] },
      { id: 'c18_as_pack', label: 'Взять порцию с собой', minutes: 5, terminal: true, outcomes: afterSupper, ...tableOnly,
        text: 'Ты складываешь картошку в банку и заворачиваешь её в шарф, чтобы не остыла сразу.', effects: [set('as', 'pack'), meal('pack')] },
      { id: 'c18_as_skip', label: 'Не есть: не лезет', minutes: 5, terminal: true, outcomes: afterSupper,
        text: 'Ты выпиваешь стакан воды и моешь за собой пустую тарелку.', effects: [set('as', 'skip')] },
    ] }),

  // ───────────── move: ночь с трактором ─────────────
  A({ id: 'c18_m_hitch', title: 'Прицеп', camp: yard14, ambient: cold18,
    text: [
      { text: 'В девять Яннес уже во дворе. Он пришёл по шпалам без фонаря. Вдвоём вы накидываете дышло прицепа на крюк.' },
      { when: own('prep', 'yard'), text: 'Сарай готов с вечера: солома, кольца, вода в вёдрах.' },
      { text: '— Wen zuerst? — спрашивает Яннес. Кого первым?' },
    ],
    actions: [
      { id: 'c18_m1_quiet', label: 'Первым рейсом самых тихих', minutes: 60, activity: 'moderate', terminal: true, goto: 'c18_m_load',
        text: 'Тихие дадут вам привыкнуть. Яннес кивает и лезет на крыло трактора.', effects: [set('m1', 'quiet'), until(17, 21, 40)] },
      { id: 'c18_m1_kai', label: 'Первым рейсом Кая: он уже уходил', minutes: 60, activity: 'moderate', terminal: true, goto: 'c18_m_load',
        text: '— Gut, — говорит Яннес. — Dann hat Mama nichts mehr, worauf sie warten kann.\n\nХорошо. Тогда маме больше нечего будет ждать.', effects: [set('m1', 'kai'), npc('c14_jannes', 1), until(17, 21, 40)] },
    ] }),

  A({ id: 'c18_m_load', title: 'Первая ходка', location: garden, camp: tense14, ambient: cold18,
    text: [
      { text: 'Уте ждёт у калитки с ключами от цепей на шнурке. На каждом ключе бирка с номером домика.' },
      { text: 'Борт прицепа высотой по грудь. Обращённого надо подвести, развернуть спиной и принять вдвоём. Шлемы Уте надела всем заранее.' },
    ],
    actions: [
      { id: 'c18_m2_slow', label: 'Вести по одному, вдвоём с Яннесом', minutes: 110, activity: 'heavy', terminal: true, goto: 'c18_m_barn',
        text: 'По одному выходит долго. Каждого вы ведёте за пояс с двух сторон, Уте идёт впереди и поёт. К полуночи четверо сидят в прицепе, привязанные к бортам.', effects: [set('m2', 'slow'), until(17, 23, 50)] },
      { id: 'c18_m2_fast', label: 'Вести по двое: ночь короткая', minutes: 60, activity: 'heavy', risky: true, terminal: true, goto: 'c18_m_barn',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3 }, text: 'Вы ведёте по двое. Один раз шлем бьёт тебя в плечо, но ты удерживаешь пояс. Четверо в прицепе на час раньше.', effects: [set('m2', 'fast'), until(17, 22, 50)] },
          { id: 'fail', text: 'У борта второй разворачивается раньше, чем ты {m:перехватил|перехватила} пояс. Шлем приходится тебе в предплечье, зубы под забралом щёлкают по рукаву. Ткань цела. Рука немеет до локтя. Дальше вы ведёте по одному.', effects: [set('m2', 'hurt'), { injure: 'bruise', site: 'leftArm', severity: 2 }, { body: 'stress', delta: 3 }, until(17, 23, 50)] },
        ] },
    ] }),

  A({ id: 'c18_m_barn', title: 'Длинный сарай', camp: tense14, ambient: cold18,
    text: [
      { text: 'Трактор идёт по полевой дороге на второй передаче. В сарае вы сажаете четверых на цепи, по одному на стойло.' },
      { when: ninaFarm, text: 'Нина стоит в дверях кухни в куртке поверх пижамы. В сарай она не идёт.' },
      { text: 'Уте проверяет каждый замок. Потом смотрит на тебя: ей ехать обратно или остаться с этими?' },
    ],
    actions: [
      { id: 'c18_m3_stay', label: 'Оставить Уте в сарае с первыми', minutes: 20, terminal: true, goto: 'c18_m_second',
        text: 'Уте садится на перевёрнутое ведро в проходе и начинает петь, тихо, чтобы слышали все четверо. Вы с Яннесом уезжаете вдвоём.', effects: [set('m3', 'stay'), npc('c14_ute', 1), until(18, 1, 30)] },
      { id: 'c18_m3_back', label: 'Взять Уте обратно: без неё не погрузить', minutes: 20, terminal: true, goto: 'c18_m_second',
        text: 'Уте запирает сарай снаружи и садится на крыло трактора. Четверо за стеной возятся в соломе. Ты надеешься, что кольца выдержат.', effects: [set('m3', 'back'), until(18, 1, 30)] },
    ] }),

  A({ id: 'c18_m_second', title: 'Фары у переезда', location: garden, camp: tense14, ambient: cold18,
    text: [
      { text: 'Без двадцати пять последние трое сидят в прицепе. Колония пустая. Двери домиков открыты.' },
      { when: own('m3', 'stay'), text: 'Без Уте вы провозились на час дольше.' },
      { when: own('co', 'ask'), text: 'Про пять часов ты знаешь с вечера. На первой ходке вы с Яннесом бросили через дренажную канаву две доски.' },
      { text: 'Яннес трогает тебя за плечо. У переезда, на полевой дороге, стоят две пары фар. Оцепление пришло на три часа раньше, чем говорил патруль.' },
    ],
    actions: [
      { id: 'c18_m4_field', label: 'Ехать через поле без фар', minutes: 70, activity: 'heavy', risky: true, terminal: true, goto: 'c18_m_morning',
        outcomes: [
          { id: 'ok', check: { traits: ['driving', 'technical'], difficulty: 3, mods: [{ when: own('co', 'ask'), bonus: 2 }] }, text: 'Ты ведёшь трактор по мёрзлой пашне на первой передаче. Борозды бьют в руль. Яннес идёт впереди и показывает рукой. В шесть вы во дворе. Все семеро.', effects: [set('m4', 'field'), w('moved', 7), until(18, 8, 40, true)] },
          { id: 'fail', text: 'Правое колесо прицепа уходит в дренажную канаву. Ось ложится на землю. Дальше вы ведёте троих пешком, на верёвках. У самой дороги один рвёт верёвку и уходит в темноту к лесу. Яннес бежит следом и возвращается один.\n\n— Herr Stamer, — говорит он. — Er war immer der Schnellste.\n\nГосподин Штамер. Он всегда был самый быстрый.', effects: [set('m4', 'lost'), w('moved', 6), w('stamer_lost', true), w('trailer_lost', true), { body: 'stress', delta: 4 }, until(18, 8, 40, true)] },
        ] },
      { id: 'c18_m4_wait', label: 'Заглушить мотор и ждать, пока фары уйдут', minutes: 150, terminal: true, goto: 'c18_m_morning',
        text: 'Вы сидите в тёмном прицепе с тремя привязанными. Фары стоят до семи. Потом одна машина уходит к Итценбюттелю, и ты заводишь мотор. На дороге вас видит патруль у будки обходчика. Никто не останавливает. Но солдат долго смотрит вслед.', effects: [set('m4', 'wait'), w('moved', 7), { body: 'fatigue', delta: 12 }, until(18, 8, 40)] },
      { id: 'c18_m4_leave', label: 'Вернуть троих в домики и уехать порожним', minutes: 60, activity: 'heavy', terminal: true, goto: 'c18_m_morning',
        text: 'Вы снова сажаете троих на цепи. Уте не говорит ничего. Порожний трактор патруль пропускает: трактор Хенрике тут знают. Дома четверо. У насыпи осталось трое.', effects: [set('m4', 'leave'), w('moved', 4), npc('c14_ute', -2), until(18, 8, 40, true)] },
    ] }),

  A({ id: 'c18_m_morning', title: 'Следы на инее', camp: tense14, ambient: day18, onEnter: [until(18, 9, 20)],
    text: [
      { text: 'Двадцать минут десятого. У ворот стоят Брандт, офицер и двое солдат. От насыпи до сарая по инею идут две колеи.' },
      { when: { v: 'w.c18_moved', op: '==', value: 4 }, text: 'Час назад у насыпи стреляли. Три раза, с промежутками.' },
      { when: seen, text: '— Вас видели в семь утра с прицепом, — говорит офицер. Он не спрашивает.' },
      { when: brandtGood, text: 'Брандт смотрит не на тебя, а на сарай. Он уже понял.' },
      { text: '— Aufmachen, — говорит офицер. Открывайте.' },
    ],
    actions: [
      { id: 'c18_m5_open', label: 'Открыть сарай самому и показать', minutes: 30, terminal: true, goto: 'c18_a_tobias',
        outcomes: [
          { id: 'spared', when: brandtGood, text: 'Ты открываешь сам. Цепи, солома, вёдра, Уте в проходе. Брандт идёт вдоль стойл и дёргает каждое кольцо.\n\n— Auf meine Verantwortung, — говорит он офицеру. — Jeden Montag komme ich kontrollieren. Geht einer, gehen alle.\n\nПод мою ответственность. Каждый понедельник проверка. Уйдёт один — уйдут все.\n\nОфицер пишет что-то в планшет и уводит солдат.', effects: [set('m5', 'open'), w('colony', 'farm'), w('ute', 'farm'), npc('c16_brandt', 3), npc('c14_ute', 3)] },
          { id: 'cleared', text: 'Ты открываешь сам. Офицер смотрит на цепи недолго.\n\n— Raus hier. Alle Zivilisten.\n\nВсе гражданские, вон.\n\nВас выводят за ворота. Уте идёт сама, прямая. Потом из сарая считают выстрелы. Трактор офицер записывает в планшет: изъят до распоряжения.', effects: [set('m5', 'open'), w('colony', 'cleared'), w('ute', 'farm'), w('tractor_lost', true), { body: 'stress', delta: 5 }] },
        ] },
      { id: 'c18_m5_deal', label: 'Предложить: пусть решают семьи, до полудня', when: not(seen), minutes: 40, terminal: true, goto: 'c18_a_tobias',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3 }, text: '— Дайте семьям время до полудня, — говоришь ты. — Потом делайте, что должны.\n\nОфицер смотрит на Брандта. Брандт кивает. К полудню приходят Кёлер и ещё двое из деревни. Кто-то прощается и уходит. Кёлер остаётся и говорит, что будет ходить к брату каждый день. Троих оставляют под её и твоё слово. Остальных уводят за сарай.', effects: [set('m5', 'deal'), w('colony', 'families'), w('ute', 'farm'), npc('c3_koehler', 3)] },
          { id: 'no', text: '— Nein, — говорит офицер. — Kein Markt.\n\nНе базар.\n\nВас выводят за ворота. Из сарая считают выстрелы. Трактор записан в планшет: изъят до распоряжения.', effects: [set('m5', 'deal'), w('colony', 'cleared'), w('ute', 'farm'), w('tractor_lost', true), { body: 'stress', delta: 5 }] },
        ] },
      { id: 'c18_m5_block', label: 'Не открывать и встать в воротах', minutes: 30, risky: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Ты стоишь в воротах. Солдат берёт тебя за локоть, второй бьёт прикладом под рёбра, коротко, без злости. Ты приходишь в себя на скамье у пожарной части в Йестебурге. В одиннадцать тебя отпускают с бумагой: задержан за сопротивление, предупреждён. Домой семь километров пешком. Сарай пуст, трактора под навесом нет.', effects: [set('m5', 'block'), w('colony', 'cleared'), w('ute', 'held'), w('a_held', true), w('tractor_lost', true), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 6 }, until(18, 11, 30)] },
    ] }),

  // ───────────── end: вечер у Уте ─────────────
  A({ id: 'c18_e_walk', title: 'Одиннадцатый домик', location: garden, camp: tense14, ambient: cold18,
    text: [
      { text: 'Без двадцати восемь ты у колонии. Яннес сидит у теплицы на перевёрнутой тачке и встаёт, когда видит, что ты один.' },
      { text: 'Уте вяжет на ступеньке при свече. За её спиной в темноте звякает цепь.\n\n— Wo ist {B}? — спрашивает она.' },
    ],
    actions: [
      { id: 'c18_e1_strangers', label: 'Сказать: завтра это сделают чужие', minutes: 20, terminal: true, goto: 'c18_e_night',
        text: '— Завтра в восемь это сделают люди, которые не знают их имён, — говоришь ты.\n\nУте долго считает петли. Потом откладывает вязание.\n\n— Dann lieber ich. Ich weiß, was sie mögen.\n\nТогда лучше я. Я знаю, что каждый из них любит.', effects: [set('e1', 'strangers'), npc('c14_ute', 1)] },
      { id: 'c18_e1_jannes', label: 'Сказать, чего хочет Яннес', when: flag('A.c17_jannes_wish'), minutes: 20, terminal: true, goto: 'c18_e_night',
        text: '— Яннес хочет, чтобы это кончилось. Без солдат. И без тебя, — говоришь ты.\n\nУте поворачивается к теплице. Яннес не отводит глаз.\n\n— Er hat es dir gesagt und nicht mir, — говорит она. Тебе сказал, а не мне. И встаёт.', effects: [set('e1', 'jannes'), npc('c14_jannes', 2), npc('c14_ute', -1)] },
      { id: 'c18_e1_sit', label: 'Сесть рядом и молчать', minutes: 40, terminal: true, goto: 'c18_e_night',
        text: 'Ты садишься на ступеньку ниже. Она довязывает ряд.\n\n— Du musst nichts sagen. Ich weiß, warum du da bist.\n\nМожешь ничего не говорить. Я знаю, зачем ты здесь.', effects: [set('e1', 'sit'), npc('c14_ute', 2)] },
    ] }),

  A({ id: 'c18_e_night', title: 'По одному', location: garden, camp: tense14, ambient: cold18,
    text: [
      { text: 'Уте заходит в каждый домик одна. С собой у неё молоток забойщика из сарая Кёлер, завёрнутый в полотенце. Перед каждой дверью она стоит и поёт, каждому своё.' },
      { when: jens18, text: 'В двенадцатый она заходит четвёртой. Оттуда она выносит Нинино письмо и кладёт его в карман пальто.' },
      { when: not(margitFarm), text: 'В девятый она не заходит. — Das ist nicht meine Mutter, — говорит она. Это не моя мать.' },
    ],
    actions: [
      { id: 'c18_e2_lamp', label: 'Держать фонарь у каждой двери', minutes: 180, terminal: true, goto: 'c18_e_kai',
        text: 'Ты стоишь с красным фонарём у каждой двери. Внутрь не светишь. Когда она выходит, ты светишь ей под ноги на ступеньки. Руки у неё не дрожат до пятого домика.', effects: [set('e2', 'lamp'), npc('c14_ute', 2), { body: 'stress', delta: 4 }, until(18, 1, 40)] },
      { id: 'c18_e2_dig', label: 'Носить и закапывать с Яннесом', minutes: 180, activity: 'heavy', terminal: true, goto: 'c18_e_kai',
        text: 'Вы с Яннесом носите на двери, снятой с петель, к яме за теплицей. Земля сверху смёрзлась, под коркой мягкая. Яннес на каждый холмик кладёт бирку от ключа.', effects: [set('e2', 'dig'), npc('c14_jannes', 2), { body: 'stress', delta: 3 }, until(18, 1, 40)] },
      { id: 'c18_e2_gate', label: 'Ждать у калитки: это её люди', minutes: 180, terminal: true, goto: 'c18_e_kai',
        text: 'Ты стоишь у калитки спиной к домикам и смотришь на насыпь. Слышно только пение. Потом и его не слышно.', effects: [set('e2', 'gate'), until(18, 1, 40)] },
    ] }),

  A({ id: 'c18_e_kai', title: 'Кай', location: garden, camp: tense14, ambient: cold18,
    text: [
      { text: 'Остался одиннадцатый. Уте стоит перед дверью с полотенцем в руке и не поёт.\n\n— Ich kann nicht, — говорит она. — Bei ihm weiß ich kein Lied mehr.\n\nНе могу. Для него у меня не осталось песни.' },
      { text: 'Яннес смотрит на тебя. Он ничего не просит.' },
    ],
    actions: [
      { id: 'c18_e3_self', label: 'Взять у неё молоток и войти самому', minutes: 15, terminal: true, goto: 'c18_e_morning',
        text: 'Ты берёшь полотенце из её руки. Внутри пахнет шерстью и яблоками. Кай поворачивает к тебе голову в шлеме. Ты делаешь это быстро, как она: один раз.\n\nКогда ты выходишь, Уте стоит на том же месте. Она снимает с тебя шапку и надевает обратно, ровнее.', effects: [set('e3', 'self'), w('kai', 'a'), npc('c14_ute', 2, 'c18_did_kai'), npc('c14_jannes', 2), { body: 'stress', delta: 8 }, until(18, 7, 30, true)] },
      { id: 'c18_e3_jannes', label: 'Кивнуть Яннесу', minutes: 15, terminal: true, goto: 'c18_e_morning',
        text: 'Яннес берёт полотенце. Его нет три минуты. Он выходит, садится на ступеньку и надевает перчатки, хотя работа кончилась. Уте кладёт руку ему на затылок.', effects: [set('e3', 'jannes'), w('kai', 'jannes'), npc('c14_jannes', -2, 'c18_let_me_do_it'), { body: 'stress', delta: 3 }, until(18, 7, 30, true)] },
      { id: 'c18_e3_leave', label: 'Оставить Кая до утра', minutes: 10, terminal: true, goto: 'c18_e_morning',
        text: '— Тогда утром, — говоришь ты.\n\nУте садится на ступеньку и берёт вязание. Утром придут те, кому не нужна песня.', effects: [set('e3', 'leave'), w('kai', 'soldiers'), until(18, 7, 30, true)] },
    ] }),

  A({ id: 'c18_e_morning', title: 'Восемь утра', location: garden, camp: tense14, ambient: day18,
    text: [
      { text: 'В восемь у калитки колонии Брандт, офицер и шестеро солдат. За теплицей свежие холмики с бирками. Двери домиков открыты.' },
      { when: own('e3', 'leave'), text: 'Одиннадцатый заперт. Тобиас идёт туда один и возвращается через минуту. Уте не оборачивается на звук.' },
      { text: 'Офицер считает холмики и сверяет со списком. Брандт снимает каску.' },
    ],
    actions: [
      { id: 'c18_e4_farm', label: 'Позвать Уте и Яннеса на хутор', minutes: 40, move: true, terminal: true, goto: 'c18_a_tobias',
        text: '— У нас есть комната, — говоришь ты.\n\nУте берёт вязание, термос и связку ключей с бирками. Яннес несёт её чемодан. По шпалам вы идёте втроём.', effects: [set('e4', 'farm'), w('colony', 'ended'), w('ute', 'farm'), npc('c14_ute', 2), npc('c14_jannes', 2), until(18, 11, 30)] },
      { id: 'c18_e4_names', label: 'Отдать офицеру список с именами', minutes: 40, move: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Ты диктуешь имена по биркам, офицер пишет. Теперь это люди с фамилиями, а не «семь единиц». Уте остаётся в одиннадцатом. Яннес провожает тебя до будки обходчика.', effects: [set('e4', 'names'), w('colony', 'ended'), w('ute', 'colony'), w('names_listed', true), until(18, 11, 30)] },
      { id: 'c18_e4_go', label: 'Уйти молча', minutes: 35, move: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Ты уходишь по шпалам. На полпути оборачиваешься: Уте стоит у калитки и смотрит не на солдат, а тебе вслед.', effects: [set('e4', 'go'), w('colony', 'ended'), w('ute', 'colony'), until(18, 11, 30)] },
    ] }),

  // ───────────── stand / away: ночь дома ─────────────
  A({ id: 'c18_h_evening', title: 'Вечер', camp: house14,
    text: [
      { text: 'Генератор стучит в сарае. Ты набираешь номер {B.gen}. «Der Teilnehmer ist nicht erreichbar». Абонент недоступен.' },
      { when: stand, text: 'Будильник стоит на шесть.' },
    ],
    actions: [
      { id: 'c18_h1_write', label: 'Всё равно написать ей', minutes: 10, terminal: true, goto: 'c18_h_night',
        text: 'Ты пишешь три строчки и стираешь две. Остаётся: «Дома всё стоит. Жду». Одна серая галочка.', effects: [set('h1', 'write'), { body: 'stress', delta: -1 }, until(18, 2, 20, true)] },
      { id: 'c18_h1_round', label: 'Обойти двор и лечь', minutes: 20, terminal: true, goto: 'c18_h_night',
        text: 'Куры закрыты. Обе калитки на крючках. Ты ложишься на её половину.', effects: [set('h1', 'round'), until(18, 2, 20, true)] },
      { id: 'c18_h1_radio', label: 'Послушать радио Хенрике', minutes: 30, terminal: true, goto: 'c18_h_night',
        text: 'NDR Info на средних волнах. Сводка: в округе Харбург «завершается санитарная обработка мест содержания». Потом читают список больниц, принимающих доноров. Люнебург третий.', effects: [set('h1', 'radio'), until(18, 2, 20, true)] },
    ] }),

  A({ id: 'c18_h_night', title: 'Двадцать минут третьего', camp: tense14, ambient: cold18,
    text: [
      { text: 'Тебя будит стук в кухонное окно. Яннес, без шапки.\n\n— Mama hat wieder die Tür aufgemacht. Sie sitzt bei ihm, ohne Kette. Ich traue mich nicht rein.\n\nМама опять открыла дверь. Сидит с ним, без цепи. Я боюсь входить.' },
    ],
    actions: [
      { id: 'c18_h2_go', label: 'Идти с ним сейчас', minutes: 120, activity: 'moderate', move: true, terminal: true, outcomes: [{ id: 's', when: stand, goto: 'c18_s_gate' }, { id: 'w', goto: 'c18_w_home' }],
        text: 'Вы идёте по шпалам почти бегом. Уте сидит на полу одиннадцатого рядом с Каем и держит его руку в варежке. Он смотрит в стену. Ты застёгиваешь цепь на его щиколотке сам. Уте не мешает.\n\n— Eine Nacht ohne, — говорит она. — Mehr wollte ich nicht.\n\nОдну ночь без неё. Больше я ничего не хотела.', effects: [set('h2', 'go'), npc('c14_jannes', 3), { body: 'fatigue', delta: 8 }, until(18, 6, 30, true)] },
      { id: 'c18_h2_rope', label: 'Дать ему верёвку и объяснить, как', minutes: 15, terminal: true, outcomes: [{ id: 's', when: stand, goto: 'c18_s_gate' }, { id: 'w', goto: 'c18_w_home' }],
        text: 'Ты показываешь петлю на своём запястье: накинуть сзади, затянуть, вывести мать. Яннес повторяет дважды и уходит в темноту. Ты не спишь до пяти.', effects: [set('h2', 'rope'), npc('c14_jannes', 1), until(18, 6, 30, true)] },
      { id: 'c18_h2_bed', label: 'Оставить его ночевать на кухне', minutes: 15, terminal: true, outcomes: [{ id: 's', when: stand, goto: 'c18_s_gate' }, { id: 'w', goto: 'c18_w_home' }],
        text: '— Это её ночь, — говоришь ты. — Ложись тут.\n\nЯннес ложится на лавку у печи в куртке. Засыпает сразу, как ребёнок.', effects: [set('h2', 'bed'), w('jannes_slept', true), until(18, 6, 30, true)] },
    ] }),

  A({ id: 'c18_s_gate', title: 'Семь утра', location: garden, camp: tense14, ambient: cold18,
    text: [
      { text: 'В семь ты у калитки колонии. Уте сидит на ступеньке одиннадцатого в пальто, застёгнутом на все пуговицы.' },
      { when: koehlerThere, text: 'У четвёртого домика стоит Кёлер. Через порог она держит брата за руку в рабочей рукавице.' },
      { when: flag('w.c17_brandt_seven'), text: 'Брандт приходит по шпалам один, в каске, без оружия. — Eine halbe Stunde, — говорит он. Полчаса.' },
      { when: not(flag('w.c17_brandt_seven')), text: 'До восьми час. На насыпи пока никого.' },
    ],
    actions: [
      { id: 'c18_s1_show', label: 'Провести Брандта по домикам', when: flag('w.c17_brandt_seven'), minutes: 30, terminal: true, goto: 'c18_s_eight',
        text: 'Ты показываешь ему цепи, кольца, колонку. В одиннадцатом Кай сидит на полу в шлеме. Брандт смотрит на него долго.\n\n— Wie alt ist er?\n\n— Achtundfünfzig.\n\n— Wie ich, — говорит Брандт. Как я.', effects: [set('s1', 'show'), npc('c16_brandt', 2)] },
      { id: 'c18_s1_ute', label: 'Дать говорить Уте', when: flag('w.c17_brandt_seven'), minutes: 30, terminal: true, goto: 'c18_s_eight',
        text: 'Уте говорит с Брандтом долго и тихо. Ты стоишь в стороне и понимаешь половину. В конце Брандт сморкается в клетчатый платок.', effects: [set('s1', 'ute'), npc('c16_brandt', 1), npc('c14_ute', 1)] },
      { id: 'c18_s1_door', label: 'Встать в калитке и ждать', when: not(flag('w.c17_brandt_seven')), minutes: 55, terminal: true, goto: 'c18_s_eight',
        text: 'Ты стоишь в калитке. Иней на столбике тает под ладонью. Яннес приносит тебе кружку кипятка и встаёт рядом.', effects: [set('s1', 'door'), npc('c14_jannes', 1)] },
      { id: 'c18_s1_step', label: 'Сесть с Уте на ступеньку', when: not(flag('w.c17_brandt_seven')), minutes: 55, terminal: true, goto: 'c18_s_eight',
        text: 'Ты садишься рядом. Она наливает тебе из термоса в крышку.\n\n— Dein Mädchen hätte gefragt, ob ich Angst habe, — говорит она. — Ich habe keine.\n\nТвоя девочка спросила бы, страшно ли мне. Мне не страшно.', effects: [set('s1', 'step'), npc('c14_ute', 2)] },
    ] }),

  A({ id: 'c18_s_eight', title: 'Восемь', location: garden, camp: tense14, ambient: day18,
    text: [
      { text: 'Ровно в восемь на насыпи два грузовика. Офицер, шестеро солдат, Тобиас с планшетом. Офицер останавливается в трёх шагах.\n\n— Treten Sie zur Seite.\n\nОтойдите.' },
    ],
    actions: [
      { id: 'c18_s2_aside', label: 'Отойти', minutes: 40, terminal: true, goto: 'c18_s_after',
        outcomes: [
          { id: 'spared', when: all(brandtGood, any(own('s1', 'show'), own('s1', 'ute'))), text: 'Ты отходишь. Брандт встаёт на твоё место.\n\n— Die bleiben. Auf meine Verantwortung. Eine Woche.\n\nЭти остаются. Под мою ответственность. Неделя.\n\nОфицер смотрит на часы, на Брандта и пишет в планшет.', effects: [set('s2', 'aside'), w('colony', 'spared'), npc('c16_brandt', 2)] },
          { id: 'cleared', text: 'Ты отходишь. Солдаты идут по домикам парами. Уте поёт у одиннадцатого, пока её не отводят за плечи. Выстрелы ты считаешь, хотя не хотел.', effects: [set('s2', 'aside'), w('colony', 'cleared'), { body: 'stress', delta: 6 }] },
        ] },
      { id: 'c18_s2_hour', label: 'Попросить час: пусть семьи сделают сами', minutes: 80, terminal: true, goto: 'c18_s_after',
        outcomes: [
          { id: 'ok', when: any(koehlerThere, brandtGood, { npc: 'c15_tobias', alive: true, trust: ['>=', 3] }), text: '— Eine Stunde, — говорит офицер. Час.\n\nСолдаты садятся на рельсы и закуривают. Уте идёт по домикам с полотенцем в руке и поёт перед каждой дверью. В одиннадцатый она заходит последней и остаётся там до конца часа.', effects: [set('s2', 'hour'), w('colony', 'families'), npc('c14_ute', 2)] },
          { id: 'no', text: '— Nein.\n\nТебя отодвигают плечом. Солдаты идут по домикам парами.', effects: [set('s2', 'hour'), w('colony', 'cleared'), { body: 'stress', delta: 6 }] },
        ] },
      { id: 'c18_s2_stay', label: 'Остаться в калитке', minutes: 30, risky: true, terminal: true, goto: 'c18_s_after',
        outcomes: [
          { id: 'spared', when: all(brandtGood, any(own('s1', 'show'), own('s1', 'ute'))), text: 'Ты не двигаешься. Рядом встаёт Брандт. Потом Яннес.\n\n— Die bleiben. Auf meine Verantwortung, — говорит Брандт. Эти остаются. Под мою ответственность.\n\nОфицер долго смотрит на вас троих. Потом машет солдатам: назад.', effects: [set('s2', 'stay'), w('colony', 'spared'), npc('c16_brandt', 3), npc('c14_jannes', 2)] },
          { id: 'held', text: 'Ты не двигаешься. Приклад приходится под рёбра, коротко. Тебя ведут к грузовику, и из кузова ты слышишь остальное. В Йестебурге тебя держат на скамье у пожарной части до одиннадцати и отпускают с бумагой: задержан, предупреждён.', effects: [set('s2', 'stay'), w('colony', 'cleared'), w('a_held', true), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 7 }, until(18, 11, 0)] },
        ] },
    ] }),

  A({ id: 'c18_s_after', title: 'После', location: garden, camp: tense14, ambient: day18,
    text: [
      { when: v('w.c18_colony', 'spared'), text: 'Грузовики уходят. Колония стоит. Уте открывает дверь одиннадцатого и садится на порог.' },
      { when: v('w.c18_colony', 'families'), text: 'Солдаты закапывают сами, быстро. Яннес втыкает в каждый холмик бирку от ключа.' },
      { when: all(v('w.c18_colony', 'cleared'), not(flag('w.c18_a_held'))), text: 'Грузовики уходят. Двери домиков открыты. Уте сидит на земле у теплицы, Яннес держит её за плечи.' },
      { when: flag('w.c18_a_held'), text: 'Обратно ты идёшь мимо колонии. Двери домиков открыты. Уте сидит на земле у теплицы, Яннес держит её за плечи.' },
    ],
    actions: [
      { id: 'c18_s3_farm', label: 'Позвать Уте и Яннеса на хутор', when: not(v('w.c18_colony', 'spared')), minutes: 45, move: true, terminal: true, goto: 'c18_a_tobias',
        text: '— У нас есть комната, — говоришь ты.\n\nУте поднимается не сразу. Она берёт только вязание и ключи с бирками.', effects: [set('s3', 'farm'), w('ute', 'farm'), npc('c14_ute', 2), npc('c14_jannes', 2), until(18, 11, 40)] },
      { id: 'c18_s3_leave', label: 'Побыть рядом и уйти', when: not(v('w.c18_colony', 'spared')), minutes: 45, move: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Ты сидишь рядом на корточках, пока не затекают ноги. Потом Яннес кивает тебе: иди.', effects: [set('s3', 'leave'), w('ute', 'colony'), until(18, 11, 40)] },
      { id: 'c18_s3_help', label: 'Остаться и перепроверить цепи', when: v('w.c18_colony', 'spared'), minutes: 90, activity: 'moderate', move: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Вы с Яннесом обходите все семь колец. Два ты перебиваешь заново. У Брандта неделя, и она должна пройти тихо.', effects: [set('s3', 'help'), w('ute', 'colony'), w('chains_checked', true), npc('c14_jannes', 2), until(18, 11, 40)] },
      { id: 'c18_s3_home', label: 'Идти домой спать', when: v('w.c18_colony', 'spared'), minutes: 45, move: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Ты идёшь по шпалам и два раза ловишь себя на том, что спишь на ходу.', effects: [set('s3', 'home'), w('ute', 'colony'), until(18, 11, 40)] },
    ] }),

  A({ id: 'c18_w_home', title: 'Восемь часов', camp: tense14, ambient: day18,
    text: [
      { text: 'В восемь ты стоишь во дворе и слушаешь. Сначала ничего. Потом от насыпи доходят выстрелы, по одному, с промежутками. Ты не считаешь. Потом понимаешь, что всё-таки сосчитал.' },
      { text: 'В половине девятого у ворот Яннес с мешком из-под картошки. В мешке вязание Уте.\n\n— Sie sitzt an der Grube und steht nicht auf.\n\nОна сидит у ямы и не встаёт.' },
    ],
    actions: [
      { id: 'c18_w1_fetch', label: 'Идти с ним за Уте', minutes: 150, activity: 'moderate', move: true, terminal: true, goto: 'c18_a_tobias',
        text: 'Уте сидит на краю ямы, ноги внутри. Ты садишься рядом и ничего не говоришь, пока она сама не протягивает руку, чтобы её подняли. До хутора вы ведёте её с двух сторон.', effects: [set('w1', 'fetch'), w('colony', 'cleared'), w('ute', 'farm'), npc('c14_ute', 2), npc('c14_jannes', 3), until(18, 11, 40)] },
      { id: 'c18_w1_keep', label: 'Оставить Яннеса у себя, за Уте не ходить', minutes: 30, terminal: true, goto: 'c18_a_tobias',
        text: '— Ты остаёшься тут, — говоришь ты. — Она придёт, когда сможет.\n\nЯннес кладёт мешок на лавку. К одиннадцати он три раза выходит к воротам смотреть на дорогу.', effects: [set('w1', 'keep'), w('colony', 'cleared'), w('ute', 'colony'), w('jannes_home', true), npc('c14_jannes', 1), until(18, 11, 40)] },
      { id: 'c18_w1_send', label: 'Дать ему хлеба и отправить к матери', minutes: 15, terminal: true, goto: 'c18_a_tobias',
        text: 'Ты выносишь хлеб и банку воды. Яннес берёт, не глядя на тебя, и уходит. Мешок с вязанием остаётся у ворот. Ты заносишь его в дом.', effects: [set('w1', 'send'), w('colony', 'cleared'), w('ute', 'colony'), npc('c14_jannes', -3, 'c18_sent_back'), until(18, 11, 40)] },
    ] }),

  // ───────────── общее: день после ─────────────
  A({ id: 'c18_a_tobias', title: 'Тобиас', camp: yard14, ambient: day18, onEnter: [until(18, 11, 40)],
    text: [
      { text: 'Без двадцати двенадцать у ворот останавливается армейский «Вольф». Тобиас выходит один и оставляет планшет на сиденье.' },
      { when: margitFarm, text: '— Ich hole sie heute. Nicht morgen, — говорит он. — Ich mache es selbst. Hinter eurem Schuppen, wenn ihr erlaubt.\n\nЗаберу её сегодня, не завтра. Сделаю сам. За вашим сараем, если позволите.' },
      { when: not(margitFarm), text: '— Ich habe es um sechs gemacht. Allein, — говорит он. — Ich wollte, dass es jemand weiß, der nicht Uniform trägt.\n\nЯ сделал это в шесть. Один. Хотел, чтобы знал кто-то не в форме.' },
    ],
    actions: [
      { id: 'c18_at_with', label: 'Пойти с ним за сарай', when: margitFarm, minutes: 30, terminal: true, goto: 'c18_a_pear',
        text: 'Ты держишь цепь, пока он снимает с матери шлем и приглаживает ей волосы. Потом ты отворачиваешься. Копаете вдвоём, под грушей.', effects: [set('at', 'with'), w('margit', 'pear'), npc('c15_tobias', 3, 'c18_stood_with_me'), { body: 'stress', delta: 3 }] },
      { id: 'c18_at_alone', label: 'Дать ему лопату и оставить одного', when: margitFarm, minutes: 30, terminal: true, goto: 'c18_a_ilse',
        text: 'Ты выносишь лопату и уходишь в дом. Через сорок минут лопата стоит у крыльца, вымытая.', effects: [set('at', 'alone'), w('margit', 'pear'), npc('c15_tobias', 1)] },
      { id: 'c18_at_listen', label: 'Выслушать его', when: not(margitFarm), minutes: 20, terminal: true, goto: 'c18_a_ilse',
        text: 'Он рассказывает коротко: шлем снял, волосы пригладил, сказал «Mama». Она повернулась на голос. Он говорит, что этого ему хватит на всю жизнь.', effects: [set('at', 'listen'), npc('c15_tobias', 2, 'c18_listened')] },
      { id: 'c18_at_ask', label: 'Спросить про колонну из Люнебурга', when: not(margitFarm), minutes: 10, terminal: true, goto: 'c18_a_ilse',
        text: '— Kommt um fünf, wenn die Straße frei ist, — говорит он. Придёт в пять, если дорога свободна. Потом садится в машину, так и не сказав того, зачем приехал.', effects: [set('at', 'ask'), { body: 'stress', delta: -1 }] },
    ] }),

  A({ id: 'c18_a_pear', title: 'Под грушей', camp: yard14, ambient: day18,
    text: [
      { text: 'Тобиас ровняет холмик лопатой и долго стоит, опершись на черенок. Потом вытирает ладони о брюки.' },
      { text: 'На заднем сиденье «Вольфа» лежат её вещи: пальто, сумка, дамский велосипед с корзинкой на руле. Утром их отдали ему в пункте в Йестебурге.' },
      { text: '— Ich schulde euch was, — говорит он. — Ich weiß nicht, wie lange ich hier noch fahre. Aber einmal kann ich etwas tun. Sag mir, was.\n\nЯ вам должен. Не знаю, сколько ещё буду здесь ездить. Но один раз могу что-то сделать. Скажи что.' },
    ],
    actions: [
      { id: 'c18_apr_list', label: 'Попросить: пусть всех, кто живёт на хуторе, впишут в список на паёк', minutes: 15, terminal: true, goto: 'c18_a_ilse',
        text: '— Alle, die ihr nennt. Heute noch, — говорит Тобиас. — Ich rufe an und sage «geprüft». Dann fragt keiner.\n\nВсех, кого вы назовёте. Сегодня же. Я позвоню и скажу «проверено». Тогда никто не спросит.\n\nОн записывает фамилию Людеманов на ладони шариковой ручкой.', effects: [set('apr', 'list'), w('tobias_favor', 'list'), npc('c15_tobias', 1)] },
      { id: 'c18_apr_word', label: 'Попросить: пусть говорит вам первым всё, что узнает', minutes: 15, terminal: true, goto: 'c18_a_ilse',
        text: '— Was ich weiß, wisst ihr. Vor Brandt, — говорит Тобиас. Что знаю я, будете знать вы. Раньше Брандта.\n\nОн протягивает руку. Ладонь у него в земле, как у тебя.', effects: [set('apr', 'word'), w('tobias_favor', 'word'), npc('c15_tobias', 2, 'c18_promised_word')] },
      { id: 'c18_apr_none', label: 'Сказать, что он ничего не должен', minutes: 15, terminal: true, goto: 'c18_a_ilse',
        text: '— Nichts, — говоришь ты. — Sie war deine Mutter.\n\nНичего. Она была твоей матерью.\n\nТобиас молчит. Потом снимает с заднего сиденья велосипед и прислоняет к груше.\n\n— Mamas Rad. Auf diesem Weg hat sie es mir beigebracht. Es soll fahren, nicht im Keller stehen.\n\nМамин велосипед. На этой дороге она меня учила. Пусть ездит, а не стоит в подвале.\n\nОн уезжает, не оборачиваясь.', effects: [set('apr', 'none'), w('tobias_favor', 'none'), w('margit_bike', true), { place: 'bicycle', at: 'hof_luedemann', qty: 1 }, npc('c15_tobias', 3, 'c18_owed_nothing')] },
    ] }),

  A({ id: 'c18_a_ilse', title: 'У задней калитки', camp: tense14, ambient: day18,
    text: [
      { text: 'Вскоре после полудня куры поднимают крик. У задней калитки стоит женщина в больничной рубашке и вязаной кофте поверх. Босая. На запястье пластиковый браслет.' },
      { when: ilseTurned, text: 'Кофту ты узнаёшь раньше, чем лицо. Серая, с перламутровыми пуговицами. Ильзе Брокман, соседка снизу. От твоего подъезда досюда одиннадцать километров. Она шла неделю.' },
      { when: all(ilseTurned, any(flag('A.ignored_ilse'), flag('A.left_ilse'))), text: 'Во вторник, в первый день, ты {m:оставил|оставила} её одну. Теперь она стоит перед калиткой и стучит в неё лбом, ровно, как метроном.' },
      { when: not(ilseTurned), text: 'Ей лет шестьдесят. На браслете: «Klinikum Buchholz, Station 4». Она стучит в калитку лбом, ровно, как метроном.' },
    ],
    actions: [
      { id: 'c18_ai_keep', label: 'Увести её в пустую будку обходчика и запереть', minutes: 80, activity: 'heavy', risky: true, move: true, terminal: true, goto: 'c18_a_nina2',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 2 }, text: 'Ты накидываешь петлю сзади и ведёшь её по шпалам. Она идёт легко, как шла всю неделю. В будке ты привязываешь верёвку к печной дверце и подпираешь дверь шпалой. Из кармана кофты выпадает камертон в замшевом чехле.', effects: [set('ai', 'keep'), w('ilse', 'kept'), { give: 'c18_fork' }] },
          { id: 'fail', text: 'Петля соскальзывает. Она разворачивается, и ты отталкиваешь её обеими руками. Она падает на рельс затылком и больше не встаёт. Из кармана кофты выпадает камертон в замшевом чехле.', effects: [set('ai', 'fell'), w('ilse', 'ended'), { give: 'c18_fork' }, { body: 'stress', delta: 6 }] },
        ] },
      { id: 'c18_ai_post', label: 'Отвести её к посту у переезда', minutes: 70, activity: 'moderate', move: true, terminal: true, goto: 'c18_a_nina2',
        text: 'Ты ведёшь её на верёвке до переезда. Солдат записывает номер браслета в тетрадь: «Vierundzwanzig von einundsechzig». Двадцать четвёртая из шестидесяти одного. Тебя просят отойти и не оборачиваться.', effects: [set('ai', 'post'), w('ilse', 'post'), { body: 'stress', delta: 2 }] },
      { id: 'c18_ai_end', label: 'Сделать это самому, здесь', minutes: 40, activity: 'heavy', terminal: true, goto: 'c18_a_nina2',
        text: 'Ты берёшь колун у поленницы. Потом долго стоишь над ней. В кармане кофты лежит камертон в замшевом чехле. Ты хоронишь её за курятником, лицом к дороге на Бухгольц.', effects: [set('ai', 'end'), w('ilse', 'ended'), { give: 'c18_fork' }, { body: 'stress', delta: 7 }] },
    ] }),

  A({ id: 'c18_a_noon', title: 'На кухне', camp: kitchen14,
    text: [
      { text: 'На кухне тепло. Ты не помнишь, когда ел.' },
      { when: all(ninaFarm, jens18, v('w.c18_colony', 'cleared')), text: 'Нина сидит за столом перед пустой чашкой. Она слышала выстрелы и ни о чём не спрашивает.' },
      { when: all(ninaFarm, jens18, any(v('w.c18_colony', 'spared'), v('w.c18_colony', 'farm'))), text: 'Нина сидит за столом. — Er ist noch da? — спрашивает она. Он ещё есть? Ты киваешь, и она закрывает лицо рукавом.' },
      { when: any(flag('w.c18_ute'), flag('w.c18_jannes_home')), text: 'В доме теперь слышно чужие шаги наверху.' },
    ],
    actions: [
      { id: 'c18_ano_eat', label: 'Поесть и лечь', minutes: 25, terminal: true, goto: 'c18_a_knock', ...tableOnly,
        text: 'Ты ешь стоя, у плиты. Потом ложишься, не раздеваясь.', effects: [set('ano', 'eat'), meal('eat'), until(18, 16, 5, true)] },
      { id: 'c18_ano_sleep', label: 'Лечь сразу', minutes: 5, terminal: true, goto: 'c18_a_knock',
        text: 'Ты ложишься поверх одеяла в ботинках и засыпаешь раньше, чем вспоминаешь их снять.', effects: [set('ano', 'sleep'), until(18, 16, 5, true)] },
      { id: 'c18_ano_koehler', label: 'Сначала дойти до Кёлер, как обещал', when: own('ak', 'promise'), minutes: 60, activity: 'moderate', terminal: true, goto: 'c18_a_knock',
        text: 'Кёлер открывает сразу, будто стояла за дверью. Ты рассказываешь всё, что видел, не смягчая. Она слушает стоя. Потом заворачивает тебе с собой шесть яиц в газету.', effects: [set('ano', 'koehler'), npc('c3_koehler', 3, 'c18_kept_word'), { place: 'eggs', at: 'c3_farm_stock', qty: 1 }, until(18, 16, 5, true)] },
    ] }),

  A({ id: 'c18_a_wait', title: 'К пяти', camp: yard14, ambient: cold18,
    text: [
      { text: 'Половина пятого. Колонна из Люнебурга должна быть к пяти.' },
      { when: flag('w.c18_lodger'), text: 'На сеновале Фолькер раскатывает спальник и стучит чем-то железным.' },
    ],
    actions: [
      { id: 'c18_aw_stove', label: 'Затопить и согреть воды к её приезду', minutes: 30, terminal: true, goto: 'c18_a_patrol',
        text: 'Ты греешь два ведра и ставишь таз у печи. После суток в казарме горячая вода ей будет нужнее разговоров.', effects: [set('aw', 'stove'), until(18, 17, 0)] },
      { id: 'c18_aw_road', label: 'Выйти встречать на дорогу', minutes: 30, terminal: true, goto: 'c18_a_patrol',
        text: 'Ты стоишь у столба с почтовым ящиком Людеманов. Пальцы ног мёрзнут через десять минут. Ты не уходишь.', effects: [set('aw', 'road'), until(18, 17, 0)] },
      { id: 'c18_aw_write', label: 'Записать утро на бумаге, пока помнишь', minutes: 30, terminal: true, goto: 'c18_a_patrol',
        text: 'Ты пишешь в тетради Хенрике, с обратной стороны: время, кто пришёл, что сказал. Выходит полторы страницы. Вслух столько ты бы не выговорил.', effects: [set('aw', 'write'), { body: 'stress', delta: -2 }, until(18, 17, 0)] },
    ] }),
];
