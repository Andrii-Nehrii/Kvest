import type { Scene } from '../../engine/content-types';
import { all } from './world3';
import { S10, night10, once10, partnerSearch10 } from './point10';

const field = 'c10_field';
const hut = { tempC: 9, outdoor: false, wet: false };
const knows = [{ set: '$.c10_knows', value: true }, { set: '$.c10_from_kerem', value: true }, { set: 'w.c10_truth', value: true }];

export const night10SScenes: Scene[] = [
  S10({ id: 'c10_s_gate', for: 'any', chapter: 'ch3', title: 'Калитка', ambient: night10,
    text: [
      { text: 'У калитки вас догоняет Хенрике. Без куртки, в одном свитере, руки скрещены на груди.\n\n— Куда вы ночью? — говорит она. — Керем взрослый. Захочет — сам придёт. А вас потом тоже искать.' },
      { text: 'Дениз молча проверяет фонарь. Включает, выключает.' },
    ],
    actions: [
      { id: 'c10_s_g_go', label: 'Сказать, что всё равно пойдёшь', minutes: 3, terminal: true, goto: 'c10_s_path',
        text: '— Тогда до полуночи назад, — говорит Хенрике. — Калитку закрою на засов. Стучите три раза.\n\nОна уходит в дом и не оглядывается.', effects: [{ set: '$.c10_gate', value: 'go' }] },
      { id: 'c10_s_g_why', label: 'Спросить, почему она против', minutes: 3, terminal: true, goto: 'c10_s_path',
        text: '— Потому что ночь, — отвечает Хенрике. Смотрит она при этом не на тебя, а на Дениза.\n\n— Пошли, — говорит Дениз и открывает калитку.', effects: [{ set: '$.c10_gate', value: 'why' }] },
      { id: 'c10_s_g_promise', label: 'Пообещать вернуться до полуночи', minutes: 2, terminal: true, goto: 'c10_s_path',
        text: 'Хенрике кивает. Потом вдруг берёт тебя за рукав.\n\n— Если он вам что наговорит — он с утра не в себе. Напугался. Помни это.\n\nОна отпускает рукав и уходит.', effects: [{ set: '$.c10_gate', value: 'promise' }, { npc: 'henrike', trust: 1 }] },
    ] }),

  S10({ id: 'c10_s_path', for: 'any', chapter: 'ch3', title: 'Старая ветка', location: field, ambient: night10,
    text: [
      { text: 'Полевая дорога идёт вдоль насыпи старой ветки. Рельсы давно сняли, в траве остались шпалы. Дениз светит под ноги и молчит. За спиной гаснут окна хутора.\n\n— Сорок минут, — говорит он. — Если не потерять дорогу.' },
      { when: partnerSearch10, text: '{partner} идёт за тобой след в след.' },
    ],
    actions: [
      { id: 'c10_s_light', label: 'Идти быстро, с фонарём', minutes: 20, activity: 'moderate', terminal: true, goto: 'c10_s_ditch',
        text: 'Луч прыгает по шпалам. Вы идёте быстро. Хутор за спиной становится точкой, потом пропадает совсем.', effects: [{ set: '$.c10_path', value: 'light' }] },
      { id: 'c10_s_dark', label: 'Предложить погасить фонарь и идти по насыпи без света', minutes: 25, activity: 'moderate', terminal: true, goto: 'c10_s_ditch',
        text: 'Глаза привыкают. Насыпь светлее поля. Вы идёте медленнее, зато вас не видно издалека.', effects: [{ set: '$.c10_path', value: 'dark' }] },
      { id: 'c10_s_talk', label: 'Идти и спросить Дениза о брате', minutes: 20, activity: 'moderate', terminal: true, goto: 'c10_s_ditch',
        text: '— Он в детстве темноты боялся, — говорит Дениз. — Сейчас сидит где-то один в темноте. Потому что я его не слушал.', effects: [{ set: '$.c10_path', value: 'talk' }, { npc: 'deniz', trust: 1 }] },
      { id: 'c10_s_q_henrike', label: 'Спросить, что ему утром сказала Хенрике', minutes: 2, combinable: true, when: once10('q_henrike'),
        text: '— Что Оле порезался, когда одеяло поправлял. — Дениз оглядывается на тебя. — А тебе?\n\nТы отвечаешь. Дениз долго молчит и идёт дальше, не оборачиваясь.', effects: [{ set: '$.c10_q_henrike', value: true }] },
    ] }),

  S10({ id: 'c10_s_ditch', for: 'any', chapter: 'ch3', title: 'Канава', location: field, ambient: night10,
    text: [{ text: 'Насыпь обрывается у мелиоративной канавы. Мостик из двух досок сгнил. Одна провалилась, вторая висит над чёрной водой и чуть покачивается.\n\nДениз светит вниз, прикрыв фонарь ладонью. Воды по колено. Может, выше.' }],
    actions: [
      { id: 'c10_s_d_plank', label: 'Перейти по уцелевшей доске', minutes: 4, risky: true, terminal: true, goto: 'c10_s_figure',
        text: 'Доска прогибается и стонет под ногой. Ты идёшь боком, мелкими шагами. На том берегу Дениз хватает тебя за куртку и тянет на себя.\n\nПотом переходит сам. Доска за ним с плеском уходит в воду.', effects: [{ set: '$.c10_ditch', value: 'plank' }, { body: 'stress', delta: 3 }] },
      { id: 'c10_s_d_wade', label: 'Перейти вброд', minutes: 6, activity: 'moderate', terminal: true, goto: 'c10_s_figure', ambientDuring: { tempC: 4, outdoor: true, wet: true },
        text: 'Вода ледяная. Она заливается в ботинки и сразу забирает ноги до колен. Дно мягкое, тянет вниз. На том берегу ты выливаешь воду из ботинок. Пальцы уже не слушаются шнурков.', effects: [{ set: '$.c10_ditch', value: 'wade' }] },
      { id: 'c10_s_d_pipe', label: 'Искать переход дальше вдоль канавы', minutes: 15, activity: 'light', terminal: true, goto: 'c10_s_figure',
        text: 'Метров через триста канава ныряет в трубу под полевой дорогой. Вы переходите сухими. Дениз смотрит на часы и ничего не говорит.', effects: [{ set: '$.c10_ditch', value: 'pipe' }] },
    ] }),

  S10({ id: 'c10_s_figure', for: 'any', chapter: 'ch3', title: 'На насыпи', location: field, ambient: night10,
    text: [{ text: 'Дениз вдруг гасит фонарь и хватает тебя за рукав.\n\nВпереди на насыпи кто-то стоит. Неподвижно, спиной к вам. Ветер приносит запах сырости и чего-то кислого.\n\nЧеловек поворачивает голову на звук ваших шагов. Делает шаг. Нога у него не сгибается.' }],
    actions: [
      { id: 'c10_s_fig_wait', label: 'Замереть в темноте и ждать, пока он уйдёт', minutes: 15, activity: 'rest', terminal: true, goto: 'c10_s_road',
        text: 'Он стоит долго. Потом спускается с насыпи и бредёт в поле, туда, где ничего нет. Вы ждёте, пока он не растворится в темноте, и идёте дальше.', effects: [{ set: '$.c10_figure', value: 'wait' }, { body: 'stress', delta: 4 }] },
      { id: 'c10_s_fig_round', label: 'Обойти его полем, по мокрой пахоте', minutes: 20, activity: 'heavy', terminal: true, goto: 'c10_s_road', ambientDuring: { tempC: 4, outdoor: true, wet: true },
        text: 'Ноги тонут в пахоте. Вы обходите его метров за сто. Он поворачивается вслед за звуком, но с насыпи не сходит.', effects: [{ set: '$.c10_figure', value: 'round' }, { body: 'stress', delta: 2 }] },
      { id: 'c10_s_fig_stone', label: 'Бросить камень далеко вправо и проскочить', minutes: 8, activity: 'moderate', terminal: true, goto: 'c10_s_road',
        text: 'Камень стучит по шпалам далеко справа. Фигура дёргается туда. Вы проходите мимо, пригнувшись, почти бегом.', effects: [{ set: '$.c10_figure', value: 'stone' }, { body: 'stress', delta: 3 }] },
    ] }),

  S10({ id: 'c10_s_road', for: 'any', chapter: 'ch3', title: 'Колонна', location: 'b75_road', ambient: night10,
    text: [{ text: 'Насыпь выводит к большой дороге. Вы уже видите будку, когда со стороны Харбурга нарастает гул. По дороге идут грузовики с выключенными фарами, только синие огни мигают на кабинах. Пять, шесть машин. На юг, к Йестебургу.' }],
    actions: [
      { id: 'c10_s_road_hide', label: 'Пригнуться в кювете и переждать', minutes: 6, activity: 'rest', terminal: true, goto: 'c10_s_car', ambientDuring: { tempC: 4, outdoor: true, wet: true },
        text: 'Вода в кювете ледяная. Колонна проходит над головой, обдавая вас выхлопом. Когда гул стихает, Дениз первым поднимается на ноги.', effects: [{ set: '$.c10_road', value: 'hide' }] },
      { id: 'c10_s_road_count', label: 'Остаться у насыпи и посчитать машины', minutes: 5, terminal: true, goto: 'c10_s_car',
        text: 'Семь грузовиков и санитарная машина в хвосте. На борту последнего белой краской: «Sammelstelle Jesteburg». Пункт сбора.', effects: [{ set: '$.c10_road', value: 'count' }, { set: '$.c10_saw_convoy', value: true }] },
      { id: 'c10_s_road_wave', label: 'Посветить им фонарём', minutes: 4, terminal: true, goto: 'c10_s_car',
        text: 'Луч скользит по брезенту. Ни одна машина не тормозит. С последней кто-то коротко светит в ответ, прямо в глаза, и колонна уходит.', effects: [{ set: '$.c10_road', value: 'wave' }, { body: 'stress', delta: 2 }] },
    ] }),

  S10({ id: 'c10_s_car', for: 'any', chapter: 'ch3', title: 'Машина на обочине', location: 'b75_road', ambient: night10,
    text: [{ text: 'Там, где прошла колонна, на обочине стоит легковушка. Передними колёсами в кювете, задние двери открыты. В салоне никого. На заднем сиденье детское кресло, в нём пакет с яблоками.\n\nКлюч торчит в замке зажигания.' }],
    actions: [
      { id: 'c10_s_c_radio', label: 'Повернуть ключ и включить радио', minutes: 8, terminal: true, goto: 'c10_s_hut',
        text: 'Приборы загораются тускло, аккумулятор почти сел. Сквозь треск пробивается диктор. Читает по бумаге, без выражения:\n\n«…Sammelstelle Jesteburg. Gebissene werden isoliert und beobachtet. Meldungen über eine Behandlung in den ersten vierundzwanzig Stunden sind falsch. Es gibt kein Medikament.»\n\nУкушенных изолируют и наблюдают. Про лечение в первые сутки — неправда. Лекарства нет.\n\nДениз выключает радио, пока аккумулятор не сел совсем.',
        effects: [{ set: '$.c10_car', value: 'radio' }, { set: '$.c10_heard_bulletin', value: true }] },
      { id: 'c10_s_c_glove', label: 'Проверить бардачок', minutes: 5, terminal: true, goto: 'c10_s_hut',
        text: 'В бардачке документы на машину, детская соска и пачка влажных салфеток. Под ними бутылка воды. Воду ты берёшь. Соску кладёшь обратно.',
        effects: [{ set: '$.c10_car', value: 'glove' }, { give: 'water_05', qty: 1 }] },
      { id: 'c10_s_c_pass', label: 'Пройти мимо', minutes: 2, terminal: true, goto: 'c10_s_hut',
        text: 'Дениз не смотрит в её сторону. Ты оглядываешься один раз. Детское кресло белеет в темноте.', effects: [{ set: '$.c10_car', value: 'pass' }] },
    ] }),

  S10({ id: 'c10_s_hut', for: 'any', chapter: 'ch3', title: 'Будка обходчика', location: 'b75_road', ambient: night10,
    text: [{ text: 'Будка обходчика стоит в двадцати шагах от дороги. Окно заколочено изнутри, под дверью полоска света. Дениз стучит: два раза, потом три.\n\n— Керем. Это я.\n\nЗа дверью долго тихо. Потом скрипит засов.' }],
    actions: [
      { id: 'c10_s_hut_in', label: 'Зайти вслед за Денизом', minutes: 2, terminal: true, goto: 'c10_s_kerem', effects: [{ set: '$.c10_hut', value: 'in' }] },
      { id: 'c10_s_hut_watch', label: 'Остаться у двери и смотреть на дорогу', minutes: 6, activity: 'rest', terminal: true, goto: 'c10_s_kerem',
        text: 'Через щель слышно, как Дениз обнимает брата и ругает его одновременно. Потом Керем сам зовёт тебя внутрь.', effects: [{ set: '$.c10_hut', value: 'watch' }] },
    ] }),

  S10({ id: 'c10_s_kerem', for: 'any', chapter: 'ch3', title: 'Без двадцати десять', location: 'b75_road', ambient: hut,
    onEnter: knows,
    text: [{ text: 'Внутри пахнет свечой и мышами. Керем сидит на своём рюкзаке, обхватив колени.\n\n— Говори уже, — говорит Дениз и садится рядом с ним на пол.\n\nИ Керем говорит. Утром ветер сорвал одеяло с окна фургона. Оле пошёл поправить. Йенс выбил стекло и схватил его за руку. Укусил через свитер, в левое предплечье. Хенрике отбила его черенком лопаты. Керем всё видел с сеновала.\n\n— Она просила меня молчать. «Он у меня один». А Оле сказал: скажешь — вылетишь за ворота.\n\nКерем смотрит на брата.\n\n— Я тебе пытался сказать.' }],
    actions: [
      { id: 'c10_s_k_deniz', label: 'Посмотреть на Дениза', minutes: 3, terminal: true, goto: 'c10_s_supper',
        text: 'Дениз смотрит в пол.\n\n— Мне она сказала: порезался, — говорит он тихо. — Я ей поверил. Я гвозди забивал, пока он там с этим ходил.', effects: [{ set: '$.c10_kerem', value: 'deniz' }] },
      { id: 'c10_s_k_hold', label: 'Сесть рядом с Керемом и дать ему договорить', minutes: 10, activity: 'rest', terminal: true, goto: 'c10_s_supper',
        text: 'Керем говорит ещё долго: как Оле держал руку, как Хенрике кипятила воду, как он сам собирал рюкзак трясущимися руками. Потом замолкает и впервые за вечер пьёт воду.', effects: [{ set: '$.c10_kerem', value: 'hold' }, { npc: 'kerem', trust: 3 }] },
      { id: 'c10_s_k_back', label: 'Сказать, что надо сейчас же возвращаться: там Нина', minutes: 2, terminal: true, goto: 'c10_s_supper',
        text: '— Идите, — кивает Керем. — Только поешь сначала, Дениз. Ты с обеда ничего.', effects: [{ set: '$.c10_kerem', value: 'back' }] },
      { id: 'c10_s_k_when', label: 'Спросить, во сколько это было', minutes: 1, combinable: true, when: once10('q_when'),
        text: '— Без двадцати десять. Я на часы посмотрел, когда слез. Сам не знаю зачем.', effects: [{ set: '$.c10_q_when', value: true }] },
      { id: 'c10_s_k_sure', label: 'Спросить, точно ли это укус, а не стекло', minutes: 1, combinable: true, when: once10('q_sure'),
        text: '— Я видел, как он вцепился зубами в рукав. Потом кровь. Стекло так не кусает.', effects: [{ set: '$.c10_q_sure', value: true }] },
    ] }),

  S10({ id: 'c10_s_supper', for: 'any', chapter: 'ch3', title: 'Половина хлеба', location: 'b75_road', ambient: hut,
    text: [{ text: 'Дениз достаёт из рюкзака хлеб, ломает пополам и суёт брату. Керем ест жадно, крошки сыплются на колени. С утра у него ничего не было.\n\nПотом он поднимает на тебя глаза.\n\n— Ты ей скажешь, что это я рассказал?' }],
    actions: [
      { id: 'c10_s_sp_open', label: 'Сказать, что скажешь как есть', minutes: 3, terminal: true, goto: 'c10_s_stay',
        text: 'Керем долго жуёт.\n\n— Ну и пусть знает, — говорит он наконец. — Мне там всё равно больше не жить.', effects: [{ set: '$.c10_source', value: 'open' }] },
      { id: 'c10_s_sp_hide', label: 'Пообещать, что его имени не назовёшь', minutes: 3, terminal: true, goto: 'c10_s_stay',
        text: '— Спасибо. — Керем отворачивается к заколоченному окну. — Дениз вот назовёт. Он не умеет молчать.\n\nДениз фыркает, но не спорит.', effects: [{ set: '$.c10_source', value: 'hide' }, { npc: 'kerem', trust: 2 }] },
      { id: 'c10_s_sp_later', label: 'Сказать, что сейчас важно другое', minutes: 3, terminal: true, goto: 'c10_s_stay',
        text: '— Тебе другое, — говорит Керем. — А мне с ней потом в глаза смотреть.\n\nОн доедает хлеб и больше не спрашивает.', effects: [{ set: '$.c10_source', value: 'later' }] },
      { id: 'c10_s_sp_bread', label: 'Отдать ему хлеб Кёлер', when: { has: 'c9_koehler_bread' }, minutes: 2, combinable: true,
        text: 'Керем смотрит на полбуханки, потом на тебя.\n\n— Это Кёлер пекла? — Он отламывает кусок, остальное прячет в рюкзак. — Брату оставлю. Он не скажет, что голодный.', effects: [{ handOver: 'c9_koehler_bread', toNpc: 'kerem' }, { npc: 'kerem', trust: 1 }] },
    ] }),

  S10({ id: 'c10_s_stay', for: 'any', chapter: 'ch3', title: 'До рассвета', location: 'b75_road', ambient: hut,
    text: [{ text: 'Керем качает головой, когда Дениз тянет его за рукав.\n\n— Я туда не пойду. Не ночью. Утром — может быть.\n\nДениз смотрит на брата, потом на тебя.\n\n— Я его второй раз одного не оставлю. Останусь здесь до рассвета. А вам надо назад. Там девчонка. И там Оле.\n\nОн протягивает тебе свой фонарь.' }],
    actions: [
      { id: 'c10_s_go_now', label: 'Взять фонарь и идти назад сейчас', minutes: 2, terminal: true, goto: 'c10_s_back', effects: [{ set: '$.c10_stay', value: 'go' }] },
      { id: 'c10_s_persuade', label: 'Попробовать уговорить Керема идти с вами', minutes: 6, terminal: true, goto: 'c10_s_back',
        text: '— Нет, — повторяет Керем. Но на прощание обнимает тебя. Дениз запирает за вами дверь.', effects: [{ set: '$.c10_stay', value: 'persuade' }, { npc: 'kerem', trust: 1 }] },
      { id: 'c10_s_promise', label: 'Пообещать Денизу, что до утра никто никого не тронет', minutes: 2, terminal: true, goto: 'c10_s_back',
        text: '— Не обещай за всех, — говорит Дениз. — Просто будь там.', effects: [{ set: '$.c10_stay', value: 'promise' }, { npc: 'deniz', trust: 1 }] },
    ] }),

  S10({ id: 'c10_s_back', for: 'any', chapter: 'ch3', title: 'Обратно', location: field, ambient: night10,
    text: [{ text: 'Назад идти дольше. Фонарь Дениза светит слабее, батарейки садятся. Огни хутора то появляются, то пропадают за деревьями. На насыпи никого.' }],
    actions: [
      { id: 'c10_s_back_fast', label: 'Идти быстро, не останавливаясь', minutes: 35, activity: 'moderate', terminal: true, goto: 'c10_s_lights',
        text: 'Последние сотни метров ты почти бежишь. В окне комнаты Оле горит свеча.', effects: [{ set: '$.c10_back', value: 'fast' }] },
      { id: 'c10_s_back_words', label: 'Идти и обдумать, что сказать Хенрике', minutes: 45, activity: 'moderate', terminal: true, goto: 'c10_s_lights',
        text: 'Ты перебираешь слова, с которых начнёшь. У сарая понимаешь, что не выбрал{m:|а} ни одного.', effects: [{ set: '$.c10_back', value: 'words' }] },
      { id: 'c10_s_back_pair', label: 'Договориться с {partner.ins}, кто с кем говорит дома', when: all(partnerSearch10), minutes: 40, activity: 'moderate', terminal: true, goto: 'c10_s_lights',
        text: 'Вы решаете: один идёт к Хенрике, другой — к Нине. Так никто не останется один.', effects: [{ set: '$.c10_back', value: 'pair' }] },
    ] }),

  S10({ id: 'c10_s_lights', for: 'any', chapter: 'ch3', title: 'Фонарь у курятника', ambient: night10,
    text: [
      { text: 'У сарая ты останавливаешься. Во дворе горит фонарь. Не в доме — у старого курятника, на дальнем краю двора.\n\nХенрике стоит у его двери. Задвигает щеколду. Отодвигает. Снова задвигает, медленно, будто проверяет, как она ходит.' },
      { when: partnerSearch10, text: '{partner} замирает рядом с тобой.' },
    ],
    actions: [
      { id: 'c10_s_l_call', label: 'Окликнуть её', minutes: 3, terminal: true, goto: 'c10_n_porch',
        text: 'Хенрике вздрагивает, фонарь качается у неё в руке.\n\n— Нашли? — спрашивает она.\n\n— Нашли.\n\nОна смотрит на тебя долго. Потом опускает щеколду в паз и уходит в дом. Фонарь остаётся висеть на крюке у курятника.', effects: [{ set: '$.c10_lights', value: 'call' }] },
      { id: 'c10_s_l_watch', label: 'Смотреть из темноты, пока она не уйдёт', minutes: 8, activity: 'rest', terminal: true, goto: 'c10_n_porch',
        text: 'Хенрике кладёт ладонь на доски. Потом прислоняется к двери лбом. Так она стоит минуту, другую. Потом гасит фонарь и идёт к дому, держась за перила.', effects: [{ set: '$.c10_lights', value: 'watch' }, { body: 'stress', delta: 2 }] },
      { id: 'c10_s_l_round', label: 'Обойти двор с другой стороны', minutes: 6, terminal: true, goto: 'c10_n_porch',
        text: 'Ты идёшь вдоль сетки, за сараем, и выходишь к крыльцу с тёмной стороны. Когда оглядываешься, фонаря у курятника уже нет.', effects: [{ set: '$.c10_lights', value: 'round' }] },
    ] }),
];
