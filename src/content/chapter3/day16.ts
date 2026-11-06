import type { Scene } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { not } from './world3';
import { A16, S16, day16, garden16, jens16, kitchen16, nina16, own16, yard16 } from './point16';

// Черновик участка 16 (06.11, начато до 12:00). Не подключён: index.ts, routes.ts, kt5.ts — при дописывании.
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const split = (a: string, b: string) => [{ id: 'a', when: A16, goto: a }, { id: 'b', goto: b }];

export const day16Scenes: Scene[] = [
  S16({ id: 'c16_noon', for: 'any', chapter: 'ch3', title: 'После решения', camp: kitchen16,
    text: [
      { when: nina16('stay'), text: 'Нина вешает куртку на крючок у двери, рядом с вашими. Потом снимает и вешает снова, ровнее.' },
      { when: nina16('winsen'), text: 'Вы вернулись из Винзена вдвоём. В швейной комнате пустая раскладушка, на подоконнике забытая тетрадь по биологии.' },
      { when: garden16('help'), text: 'Яннес ответил одним словом: «Danke». Уте — вторым: «Ich wusste es».' },
      { when: garden16('tell'), text: 'Патрульная машина уехала в сторону насыпи. Обратно её пока не видно.' },
      { when: garden16('away'), text: 'Про колонию у насыпи больше никто не говорит. От этого она не становится дальше.' },
      { when: jens16('give'), text: 'Под навесом пустая кабина. Дверь кто-то закрыл.' },
      { when: not(jens16('give')), text: 'Под яблоней холмик и доска с выцарапанными буквами.' },
    ],
    actions: [
      { id: 'c16_n_table', label: 'Сесть за стол и съесть, что осталось', minutes: 15, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: 'Хлеб Кёлер, сливы из банки. Ешь молча. В доме тихо так, что слышно часы Хенрике.', effects: [{ set: '$.c16_noon', value: 'table' }] },
      { id: 'c16_n_partner', label: 'Постоять с {partner.ins} на крыльце', minutes: 5, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: 'Вы стоите рядом. Дорога пустая. Над насыпью кружат вороны.', effects: [{ set: '$.c16_noon', value: 'partner' }, { body: 'stress', delta: -1 }] },
      { id: 'c16_n_nina', label: 'Спросить Нину, как она', when: nina16('stay'), minutes: 5, terminal: true, outcomes: split('c16_a_yard', 'c16_b_house'),
        text: '— Нормально. — Нина пожимает плечами. — Просто странно. Вчера было зачем вставать ночью. А сегодня нет.', effects: [{ set: '$.c16_noon', value: 'nina' }, nina(1)] },
    ] }),

  S16({ id: 'c16_a_yard', for: 'any', chapter: 'ch3', title: 'Двор', camp: yard16, ambient: day16,
    text: [
      { text: 'Во дворе пусто. Куры копаются у поленницы. Corsa стоит у сарая, на стекле подсохшие разводы от инея.' },
      { when: { v: 'A.c15_water', op: '==', value: 'colony' }, text: 'У задней калитки две полные канистры. Сорок литров. Ты налил{m:|а} их утром.' },
      { when: garden16('help'), text: 'Яннес написал: «Mittwoch. Ab zehn». В среду, с десяти.' },
    ],
    actions: [
      { id: 'c16_ay_rails', label: 'Подняться на насыпь и посмотреть в сторону колонии', minutes: 30, activity: 'moderate', terminal: true, goto: 'c16_a_yard2',
        text: 'С насыпи видны крыши садовых домиков за рощей. Над одной поднимается дым, тонкий, ровный. Больше ничего не видно. Ты стоишь, пока не начинают мёрзнуть пальцы.', effects: [{ set: '$.c16_yard', value: 'rails' }] },
      { id: 'c16_ay_car', label: 'Проверить Corsa: бензин, колёса', minutes: 15, terminal: true, goto: 'c16_a_yard2',
        text: 'Стрелка ниже четверти. Левое заднее колесо мягкое. Насос в багажнике есть, запаски нет. Если ехать куда-то далеко — то один раз.', effects: [{ set: '$.c16_yard', value: 'car' }] },
      { id: 'c16_ay_van', label: 'Заглянуть под навес', minutes: 8, terminal: true, goto: 'c16_a_yard2',
        effects: [{ set: '$.c16_yard', value: 'van' }],
        outcomes: [
          { id: 'g', when: jens16('give'), text: 'Кабина пустая и чистая. На козырьке пусто: рисунок кто-то снял. Ключ торчит в замке. Фургон теперь просто фургон. Чей — непонятно.' },
          { id: 'x', text: 'Кабина пустая и чистая. Доски с окна сняты, сложены у стены. Одной не хватает: она стоит под яблоней, с буквами.' },
        ] },
    ] }),

  S16({ id: 'c16_b_house', for: 'any', chapter: 'ch3', title: 'Дом', camp: kitchen16,
    text: [
      { when: nina16('stay'), text: 'Нина сидит на подоконнике в швейной комнате и смотрит на поле. На коленях тетрадь по биологии, открытая на той же странице, что и вчера.\n\n— В среду я пойду туда, — говорит она, не оборачиваясь. — С вами или без.' },
      { when: nina16('winsen'), text: 'На кухонном столе вибрирует твой телефон. Незнакомый номер с кодом Винзена. Голос Нины, торопливый:\n\n— Это я. С телефона Лениной мамы. Я доехала. Тут свет. Два часа в день. — Пауза. — А у вас как? Тихо?' },
    ],
    actions: [
      { id: 'c16_bh_with', label: 'Сказать: в среду пойдём вместе', when: nina16('stay'), minutes: 4, terminal: true, goto: 'c16_b_house2',
        text: 'Нина кивает и наконец переворачивает страницу.\n\n— Вместе, — говорит она. — Вы двое и я. Ладно.', effects: [{ set: '$.c16_house', value: 'with' }, nina(1)] },
      { id: 'c16_bh_school', label: 'Спросить про тетрадь', when: nina16('stay'), minutes: 6, terminal: true, goto: 'c16_b_house2',
        text: '— Фотосинтез. — Нина фыркает. — Домашка на четверг. Какой четверг. — Она закрывает тетрадь, но с подоконника её не убирает.', effects: [{ set: '$.c16_house', value: 'school' }] },
      { id: 'c16_bh_quiet', label: 'Сказать: тихо. Скучаем', when: nina16('winsen'), minutes: 5, terminal: true, goto: 'c16_b_house2',
        text: 'Нина молчит. Слышно, как кто-то рядом с ней говорит по-немецки и смеётся.\n\n— Я тоже, — говорит она быстро. — Поливайте кур. В смысле, кормите. Ну, вы поняли.', effects: [{ set: '$.c16_house', value: 'quiet' }, nina(1)] },
      { id: 'c16_bh_colony', label: 'Сказать ей про колонию и среду', when: nina16('winsen'), minutes: 6, terminal: true, goto: 'c16_b_house2',
        text: '— В среду, — повторяет Нина. — Я доеду. На велике. Двадцать километров — это ничего. — Пауза. — Не говорите Лениной маме.', effects: [{ set: '$.c16_house', value: 'colony' }] },
    ] }),

  S16({ id: 'c16_a_yard2', for: 'any', chapter: 'ch3', title: 'Пустая канистра', camp: yard16, ambient: day16,
    text: [
      { text: 'В три у задней калитки стоит Яннес. В руке пустая канистра, на плече вторая.' },
      { when: garden16('help'), text: '— Я знаю, договорились на среду, — говорит он. — Но у нас насос сдох. На колодце. Утром ещё качал, теперь нет.' },
      { when: garden16('away'), text: '— Я знаю, вы не хотели лезть, — говорит он. — Я бы не пришёл. Но у нас насос сдох. На колодце. А их семеро.' },
      { when: garden16('tell'), text: '— Солдаты были, — говорит он. — Переписали всех, по домикам. Уехали. А потом насос сдох. Как назло. — Он смотрит на тебя. — Это вы им сказали?' },
    ],
    actions: [
      { id: 'c16_ay2_fill', label: 'Налить ему обе канистры из колодца', minutes: 25, activity: 'moderate', terminal: true, goto: 'c16_a_pump',
        text: 'Сорок литров. Яннес держит канистры, ты качаешь. Он считает вёдра вслух, как Нина считала кур.\n\n— На сегодня хватит, — говорит он. — Завтра опять.', effects: [{ set: '$.c16_yard2', value: 'fill' }] },
      { id: 'c16_ay2_fix', label: 'Предложить сходить и посмотреть насос', minutes: 5, terminal: true, goto: 'c16_a_pump',
        text: 'Яннес смотрит на тебя, будто не поверил.\n\n— Сейчас? — Потом кивает. — Пошли. Там прокладка, наверное. Или поршень. Папа бы за минуту сделал.', effects: [{ set: '$.c16_yard2', value: 'fix' }, { set: '$.c16_to_colony', value: true }] },
      { id: 'c16_ay2_no', label: 'Сказать: не можем, у самих впритык', minutes: 4, terminal: true, goto: 'c16_a_pump',
        text: 'Яннес кивает. Без обиды.\n\n— Понятно. — Он поворачивается уходить. У калитки останавливается. — Тогда до вечера дотянем. Потом не знаю.', effects: [{ set: '$.c16_yard2', value: 'no' }] },
    ] }),

  S16({ id: 'c16_b_house2', for: 'any', chapter: 'ch3', title: 'Кёлер просит', camp: kitchen16,
    text: [
      { text: 'В дверь стучат. Фрау Кёлер, в пальто поверх халата, с маленьким мешком муки в руках.\n\n— Mehl, — говорит она. — Für euch. — И, не отдавая мешок: — Ich muss Sie etwas fragen.\n\nМука. Для вас. Мне надо вас кое о чём спросить.' },
      { text: '— Mein Bruder ist in der Kolonie. Seit Sonntag. Ich war noch nicht da. Allein kann ich nicht. Kommen Sie mit? Heute. Bevor es dunkel wird.\n\nМой брат в колонии. С воскресенья. Я ещё не ходила. Одна не могу. Пойдёте со мной? Сегодня. Пока светло.' },
    ],
    actions: [
      { id: 'c16_bh2_go', label: 'Сказать: пойду с вами', minutes: 4, terminal: true, goto: 'c16_b_koehler',
        text: 'Кёлер кладёт муку на стол и долго вытирает руки о пальто, хотя они сухие.\n\n— Danke, — говорит она. — In einer Stunde. Ich muss mich umziehen.\n\nЧерез час. Мне надо переодеться.', effects: [{ set: '$.c16_house2', value: 'go' }, { set: '$.c16_to_colony', value: true }, { npc: 'c3_koehler', trust: 2 }] },
      { id: 'c16_bh2_later', label: 'Сказать: в среду, вместе со всеми', minutes: 4, terminal: true, goto: 'c16_b_koehler',
        text: '— Mittwoch, — повторяет Кёлер. — Gut. Bis Mittwoch halte ich durch.\n\nДо среды я продержусь.\n\nМуку она всё-таки оставляет.', effects: [{ set: '$.c16_house2', value: 'later' }] },
      { id: 'c16_bh2_why', label: 'Спросить, почему она сказала про Гамбург', minutes: 5, terminal: true, goto: 'c16_b_koehler',
        text: 'Кёлер вздрагивает.\n\n— Weil es leichter war, — говорит она. — Hamburg ist weit. Die Kolonie ist zwanzig Minuten.\n\nПотому что так было легче. Гамбург далеко. А колония — двадцать минут пешком.', effects: [{ set: '$.c16_house2', value: 'why' }, { npc: 'c3_koehler', trust: 1 }] },
    ] }),

  S16({ id: 'c16_a_pump', for: 'any', chapter: 'ch3', title: 'Насос', camp: yard16, ambient: day16,
    text: [
      { when: own16('yard2', 'fix'), text: 'Колодец в колонии — старая ручная колонка на бетонной плите, крашеная зелёным. Ручка ходит вхолостую. Яннес откручивает крышку: внутри кожаная манжета, растрескавшаяся в труху.\n\nИз ближних домиков слышно, как звенят цепи. Кто-то стучит в дверь, ровно, раз в несколько секунд.' },
      { when: not(own16('yard2', 'fix')), text: 'Яннес уходит по шпалам с канистрами. Ты смотришь ему вслед, пока он не становится точкой. Потом идёшь к дому. До темноты часа полтора.' },
    ],
    actions: [
      { id: 'c16_ap_tube', label: 'Вырезать новую манжету из старой велосипедной камеры', when: own16('yard2', 'fix'), minutes: 40, activity: 'moderate', terminal: true, goto: 'c16_a_dusk',
        text: 'Камеру Яннес приносит из домика одиннадцать: «Папина. Он всё хранил». Ты вырезаешь кольцо ножом, Яннес держит. Вторая попытка садится. Ручка идёт туго, потом из носика плюёт ржавой водой. Потом чистой.\n\nЯннес смеётся, впервые при тебе.', effects: [{ set: '$.c16_pump', value: 'tube' }, { set: 'w.c16_pump_fixed', value: true }, { npc: 'c14_jannes', trust: 2 }] },
      { id: 'c16_ap_leather', label: 'Предложить кожу со старого ремня', when: own16('yard2', 'fix'), minutes: 50, activity: 'moderate', terminal: true, goto: 'c16_a_dusk',
        text: 'Ремень Яннес снимает с себя. Кожа толстая, режется плохо. Манжета выходит кривой, но держит. Вода идёт тонкой струйкой.\n\n— На неделю хватит, — говорит Яннес, подтягивая штаны верёвкой. — Потом что-нибудь придумаем.', effects: [{ set: '$.c16_pump', value: 'leather' }, { set: 'w.c16_pump_fixed', value: true }, { npc: 'c14_jannes', trust: 1 }] },
      { id: 'c16_ap_home', label: 'Вернуться в дом', when: not(own16('yard2', 'fix')), minutes: 5, terminal: true, goto: 'c16_a_dusk',
        text: 'Дома тихо. Ты ставишь чайник и садишься у окна, которое выходит на поле и насыпь.', effects: [{ set: '$.c16_pump', value: 'home' }] },
      { id: 'c16_ap_follow', label: 'Догнать Яннеса и помочь донести', when: not(own16('yard2', 'fix')), minutes: 50, activity: 'moderate', terminal: true, goto: 'c16_a_dusk',
        text: 'Ты догоняешь его у будки обходчика и забираешь одну канистру. Яннес не спорит. До колонии вы идёте молча. У калитки он говорит: «Останься на чай. Мама будет рада». Уже темнеет.', effects: [{ set: '$.c16_pump', value: 'follow' }, { set: '$.c16_to_colony', value: true }, { npc: 'c14_jannes', trust: 1 }] },
    ] }),

  S16({ id: 'c16_a_dusk', for: 'any', chapter: 'ch3', title: 'Черновик', camp: yard16, ambient: day16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
  S16({ id: 'c16_b_koehler', for: 'any', chapter: 'ch3', title: 'Брат', camp: kitchen16,
    text: [
      { when: own16('house2', 'go'), text: 'Кёлер приходит через час в чёрном пальто и с аккуратно уложенными волосами, как в церковь. В руках банка мёда.\n\n— Für ihn, — говорит она. — Er hat Honig geliebt.\n\nДля него. Он любил мёд.\n\nВы идёте по шпалам. Кёлер держит тебя под руку и через каждые сто шагов останавливается.' },
      { when: not(own16('house2', 'go')), text: 'Кёлер уходит. На столе мешок муки, на мешке её почерком: «Danke». За окном садится солнце.' },
    ],
    actions: [
      { id: 'c16_bk_hold', label: 'Держать её под руку и не торопить', when: own16('house2', 'go'), minutes: 45, activity: 'moderate', terminal: true, goto: 'c16_b_dusk',
        text: 'Вы идёте долго. У будки обходчика Кёлер садится на лавку и сидит пять минут, глядя в пол. Потом встаёт сама.\n\n— Weiter, — говорит она. Дальше.\n\nК колонии вы подходите, когда уже темнеет.', effects: [{ set: '$.c16_bk', value: 'hold' }, { set: '$.c16_to_colony', value: true }, { npc: 'c3_koehler', trust: 1 }] },
      { id: 'c16_bk_talk', label: 'Расспросить её о брате по дороге', when: own16('house2', 'go'), minutes: 45, activity: 'moderate', terminal: true, goto: 'c16_b_dusk',
        text: '— Werner. Lokführer. Сорок лет водил поезда по этой самой ветке. — Кёлер показывает на рельсы. — Он гудел мне, когда проезжал мимо дома. Два коротких.\n\nК колонии вы подходите, когда уже темнеет.', effects: [{ set: '$.c16_bk', value: 'talk' }, { set: '$.c16_to_colony', value: true }, { set: '$.c16_werner', value: true }] },
      { id: 'c16_bk_bread', label: 'Испечь из её муки лепёшки на вечер', when: not(own16('house2', 'go')), minutes: 50, activity: 'light', terminal: true, goto: 'c16_b_dusk',
        text: 'Мука, вода, щепоть соли, сковорода. Первые две лепёшки подгорают, остальные получаются. Кухня пахнет хлебом, как давно не пахла.', effects: [{ set: '$.c16_bk', value: 'bread' }] },
      { id: 'c16_bk_window', label: 'Посидеть у окна, глядя на насыпь', when: not(own16('house2', 'go')), minutes: 30, activity: 'rest', terminal: true, goto: 'c16_b_dusk',
        text: 'Солнце садится за насыпью. На рельсах никого. Потом по шпалам проходит человек с канистрами. Яннес, кажется. Или нет.', effects: [{ set: '$.c16_bk', value: 'window' }] },
    ] }),

  // Дальше по плану: c16_a_dusk / c16_b_dusk — вечер (колония или хутор), ночь, утро, КТ16.
  S16({ id: 'c16_b_dusk', for: 'any', chapter: 'ch3', title: 'Черновик', camp: kitchen16,
    text: [{ text: 'Черновик сцены.' }], actions: [] }),
];
