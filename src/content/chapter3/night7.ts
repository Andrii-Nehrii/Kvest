import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import { all, not } from './world3';
import { A7, B7, S7, atHome, kitchen7, room7, urgent7, togetherWatch, once7 } from './point7';

export const night7Scenes: Scene[] = [
  S7({
    id: 'c7_start', for: 'any', chapter: 'ch3', title: 'Ночь впереди', camp: kitchen7, universal: false,
    // Этот вход уже входит в базу КТ6. Новые эффекты — только у первого действия.
    text: [
      { text: 'Хенрике убирает со стола и разрешает взять из запаса свою долю припасов. Ключ от фургона лежит у неё в кармане. Йенс остался за оградой; до утра нужно следить, чтобы он не вышел к тем двоим. Утром придётся решить, как выбираться самим.' },
      { when: { v: 'w.c6_r_night', op: '==', value: 'beside' }, text: 'Вы остались с Павлом в кухне. До часа наблюдает {B}, потом — {A}; второй спит у печки. Павел ещё не обещал остаться после рассвета.' },
      { when: { v: 'w.c6_r_night', op: '==', value: 'own_sleep' }, text: 'Вы выбрали сон вдвоём. Хенрике и Оле смотрят за двором. Павел ушёл в сарай и собирается утром выйти один.' },
      { when: { v: 'w.c6_r_night', op: '==', value: 'go_with' }, text: 'Вы ночуете рядом с Павлом в сарае и обещали утром уйти вместе, когда проверите выход. До часа не спит {B}, потом — {A}. За оградой смотрят хозяева.' },
      { when: { v: 'w.c6_r_night', op: '==', value: 'barn_only' }, text: 'Вы ночуете с Павлом в сарае, но дорогу не обещали. {B} первой остаётся бодрствовать, {A} сменит её после часа. У ворот дежурят хозяева.' },
    ],
    actions: [
      { id: 'c7_begin_exit', label: 'Сначала договориться, каким путём утром выходить', minutes: 4, terminal: true,
        effects: [{ set: 'w.c7_new_story', value: true }, { camp: { kind: 'prepare', quiet: true } }, { set: '$.c7_priority', value: 'exit' }],
        outcomes: [
          { id: 'a', when: A7, text: 'Хенрике просит Оле показать тебе дорожку и оба выхода. «Только за ограду сейчас не ходим», — говорит она.', goto: 'c7_a_lamp' },
          { id: 'b', text: 'Хенрике разрешает утром открыть заднюю сетку, если ворота будут заняты. Снаружи вы с ней сейчас не пойдёте. Из-за стола тебя зовёт Павел: он зацепился повязкой за рукав.', goto: 'c7_b_hand' },
        ] },
      { id: 'c7_begin_pawel', label: 'Проверить, как устроился Павел с больной рукой', minutes: 4, terminal: true,
        text: 'Павел раскладывает вещи одной рукой. Увидев тебя, освобождает место рядом. «Сюда садись. К двери я не придвигаюсь».',
        effects: [{ set: 'w.c7_new_story', value: true }, { camp: { kind: 'prepare', quiet: true } }, { set: '$.c7_priority', value: 'pawel' }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_lamp' }, { id: 'b', goto: 'c7_b_hand' }] },
      { id: 'c7_begin_host', label: 'Прежде чем лечь, помочь Хенрике закончить смену', minutes: 6, terminal: true,
        text: 'Ты берёшь на себя уборку у входа. Хенрике наконец отставляет холодную кружку и садится. Через минуту спрашивает, кто сегодня разбудит вас, если станет хуже.',
        effects: [{ set: 'w.c7_new_story', value: true }, { camp: { kind: 'prepare', quiet: true } }, { set: '$.c7_priority', value: 'host' }, { npc: 'henrike', trust: 2, remember: '$:c7_helped_before_sleep' }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_lamp' }, { id: 'b', goto: 'c7_b_hand' }] },
    ],
  }),
  S7({
    id: 'c7_settle', for: 'any', chapter: 'ch3', title: 'Перед первой сменой', camp: kitchen7,
    onEnter: [{ set: '$.met.henrike', value: true }, { set: '$.met.ole', value: true }, { set: '$.met.pawel', value: true }],
    text: [
      { text: 'Хенрике показывает, где оставила еду на поздний ужин. Оле стоит у окна и ест прямо из миски. Если кому-то осталось поесть, лучше сейчас: потом свет у стола погасят.' },
      { when: { camp: 'tableMeal' }, text: 'Твоя порция ещё здесь. {partner} садится рядом, освобождая край стола.' },
      { when: not({ camp: 'tableMeal' }), text: 'Свободной порции для тебя не осталось. В кухне можно побыть с остальными или воспользоваться своими припасами.' },
    ],
    actions: [
      { id: 'c7_late_eat', label: 'Поесть с остальными перед дежурством', minutes: 10, terminal: true, goto: 'c7_shift', enabled: { camp: 'tableMeal' }, disabledReason: 'Твоя порция уже использована или не выделена',
        text: 'Оле подвигает соль. Вы едите тихо, прислушиваясь к двору. Павел первым просит разбудить его, если понадобится помощь.', effects: [{ camp: { kind: 'meal', mode: 'eat', communal: true } }] },
      { id: 'c7_late_pack', label: 'Забрать оставшуюся порцию на ночную смену', minutes: 3, terminal: true, goto: 'c7_shift', enabled: { camp: 'tableMeal' }, disabledReason: 'Свободной порции нет',
        text: 'Ты забираешь свою еду. Хенрике просит утром вернуть посуду. Пока еда остаётся при тебе.', effects: [{ camp: { kind: 'meal', mode: 'pack', communal: true } }] },
      { id: 'c7_late_talk', label: 'Не брать еду; немного посидеть рядом с партнёром', minutes: 5, terminal: true, goto: 'c7_shift',
        text: 'Вы садитесь у края стола. {partner} касается твоей руки, прежде чем встать. На ночь вы знаете, где искать друг друга.', effects: [{ body: 'stress', delta: -2 }] },
      { id: 'c7_late_signal', label: 'Договориться, что на тревогу зовут всех по именам', minutes: 2, combinable: true, when: once7('names'),
        text: 'Хенрике повторяет ваши имена и показывает, где спит каждый. «Не кричите просто: помогите. Я должна знать, кого будить».', effects: [{ set: '$.c7_names', value: true }] },
    ],
  }),
  S7({
    id: 'c7_shift', for: 'any', chapter: 'ch3', title: 'До полуночи', camp: room7,
    text: [
      { when: all(A7, togetherWatch), text: 'Первой остаётся бодрствовать {B}. Тебе можно поспать до своей смены. Снаружи тихо; Хенрике договорилась разбудить обоих, если Йенс начнёт выходить.' },
      { when: all(B7, togetherWatch), text: 'Ты на первой смене. {A} может лечь, Павел уже укрыл руку курткой. Из дома за двором смотрит Хенрике; тебя просят не выходить на шум в одиночку.' },
      { when: not(togetherWatch), text: 'Вы ложитесь вдвоём в пристройке. За двором следят хозяева. Хенрике показывает, как открыть внутреннюю дверь в темноте, и просит не ставить под неё сумки.' },
    ],
    actions: [
      { id: 'c7_shift_agreed', label: 'Занять своё место и придерживаться выбранной смены', minutes: 0, terminal: true, goto: 'c7_alarm',
        effects: [{ if: all(B7, togetherWatch), then: [{ restUntil: at(13, 0, 30) }], else: [{ restUntil: at(13, 0, 30), sleeping: true }] }, { set: '$.c7_shift', value: 'agreed' }],
        text: 'Свет над столом гасят. Ты остаёшься на своём месте до первого резкого звука со двора.' },
      { id: 'c7_shift_awake', label: 'Не засыпать; посидеть в тишине и прислушиваться', minutes: 0, terminal: true, goto: 'c7_alarm',
        text: 'Ты не раздеваешься и остаёшься сидеть. За стеной несколько раз кашляют. Прежде чем дремота возьмёт своё, со двора слышится гудок.',
        effects: [{ restUntil: at(13, 0, 30) }, { set: '$.c7_shift', value: 'awake' }] },
      { id: 'c7_shift_replace', label: 'Попросить Хенрике подменить тебя и попробовать уснуть', minutes: 0, terminal: true, goto: 'c7_alarm', when: all(B7, togetherWatch), enabled: atHome('henrike'), disabledReason: 'Хенрике нет рядом',
        text: 'Хенрике соглашается и остаётся у окна. Ты слышишь, как она устраивает стул поудобнее. Спустя некоторое время она будит тебя за плечо.',
        effects: [{ restUntil: at(13, 0, 30), sleeping: true }, { set: '$.c7_shift', value: 'replaced' }, { npc: 'henrike', trust: -1, remember: '$:c7_extra_shift' }] },
    ],
  }),
  S7({
    id: 'c7_alarm', for: 'any', chapter: 'ch3', title: 'Гудок', camp: urgent7, safe: false,
    text: [
      { text: 'Йенс давит на гудок. Звук обрывается и начинается снова. В кабине горит свет; он держится за руль, пытаясь встать. Хенрике зовёт вас обоих.' },
      { when: { v: 'w.c6_l_road_result', op: '==', value: 'quiet' }, text: 'Двое, которых вы оставили у фургона, сразу придвигаются к двери. Один бьёт ладонью по стеклу. Йенс не отнимает руку от руля.' },
      { when: { v: 'w.c6_l_road_result', op: '==', value: 'divert' }, text: 'Двое отходят от дальней сетки и идут на новый звук, к фургону. За часы наблюдения Хенрике успела устать. Теперь она просит Оле не уходить из виду.' },
      { when: { v: 'w.c6_l_road_result', op: '==', value: 'call' }, text: 'Двое у передних ворот поворачиваются и идут к фургону. Подход к калитке освобождается, но за ними приходится следить: они ещё совсем рядом.' },
    ],
    actions: [
      { id: 'c7_alarm_name', label: 'Откликнуться по имени и сказать, что вы уже идёте к окну', minutes: 1, terminal: true,
        text: 'Ты зовёшь Йенса. Гудок смолкает. В наступившей тишине слышно, как Оле открывает внутреннюю дверь.', effects: [{ set: '$.c7_alarm', value: 'name' }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_distance' }, { id: 'b', goto: 'c7_b_window' }] },
      { id: 'c7_alarm_host', label: 'Попросить Хенрике говорить с ним, приготовиться помочь', minutes: 1, terminal: true,
        text: 'Хенрике говорит из окна, чтобы Йенс отпустил руль. Ты надеваешь обувь. Он слышит её не с первого раза.', effects: [{ set: '$.c7_alarm', value: 'host' }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_distance' }, { id: 'b', goto: 'c7_b_window' }] },
      { id: 'c7_alarm_partner', label: 'Сначала убедиться, что партнёр тоже проснулся', minutes: 2, terminal: true,
        text: 'Ты находишь {partner.acc} у двери. Вы выходите из комнаты вместе. Хенрике уже говорит с Йенсом; каждый новый гудок заставляет её начинать заново.', effects: [{ set: '$.c7_alarm', value: 'partner' }, { body: 'stress', delta: -1 }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_distance' }, { id: 'b', goto: 'c7_b_window' }] },
    ],
  }),
  S7({
    id: 'c7_turnover', for: 'any', chapter: 'ch3', title: 'Вторая смена', camp: room7,
    text: [
      { text: 'Гудок больше не звучит. Хенрике ставит на стол часы и проверяет, закрыта ли внутренняя дверь. Йенс в кабине, за ним всё ещё нужно смотреть.' },
      { when: all(A7, togetherWatch), text: 'Теперь твоя смена. {B.dat} можно лечь. Павел просыпается и спрашивает, всё ли ещё выходите с рассветом; ответа о дороге он ждёт утром.' },
      { when: all(B7, togetherWatch), text: 'Ты передаёшь смену {A.dat}. Он слышит, где смотреть за фургоном и кому кричать при движении. Теперь можно лечь.' },
      { when: not(togetherWatch), text: 'Ваш сон снова остаётся на долю хозяев. Хенрике не просит вас остаться, но Оле уже трёт лицо ладонями.' },
    ],
    actions: [
      { id: 'c7_turnover_agreed', label: 'Отдохнуть или дежурить по уже выбранному порядку', minutes: 0, terminal: true, goto: 'c7_morning',
        text: 'Ты устраиваешься на вторую часть ночи. К рассвету в доме слышны шаги и скрип печной дверцы.',
        effects: [{ if: all(A7, togetherWatch), then: [{ restUntil: at(13, 6, 30) }], else: [{ restUntil: at(13, 6, 30), sleeping: true }] }, { set: '$.c7_second', value: 'agreed' }] },
      { id: 'c7_turnover_help', label: 'Остаться у окна, чтобы дать другому поспать', minutes: 0, terminal: true, goto: 'c7_morning',
        text: 'Ты предлагаешь остальным лечь, а {m:сам|сама} остаёшься на стуле у окна. На сером стекле понемногу проступает отражение кухни.', effects: [{ restUntil: at(13, 6, 30) }, { set: '$.c7_second', value: 'own' }, { npc: 'henrike', trust: 2, remember: '$:c7_took_morning_watch' }] },
      { id: 'c7_turnover_sleep', label: 'Попросить подмену и лечь до рассвета', minutes: 0, terminal: true, goto: 'c7_morning', when: all(A7, togetherWatch), enabled: atHome('henrike'), disabledReason: 'Нужен человек, который примет смену',
        text: 'Хенрике принимает смену. Ты ложишься, не снимая тёплых вещей. Утром она всё ещё сидит у окна.', effects: [{ restUntil: at(13, 6, 30), sleeping: true }, { set: '$.c7_second', value: 'sleep' }, { npc: 'henrike', trust: -2, remember: '$:c7_took_their_watch' }] },
    ],
  }),
  S7({
    id: 'c7_morning', for: 'any', chapter: 'ch3', title: 'Перед рассветом', camp: { ...kitchen7, well: true },
    text: [
      { text: 'На кухне пахнет кашей. Павел уже одет. Сумку он поставил у двери, раненую руку держит на груди. У фургона снаружи тихо; Йенс не отвечает Хенрике на вопрос, проснулся ли он.' },
      { when: { v: 'w.c6_r_night', op: '==', value: 'go_with' }, text: 'Вы обещали идти с Павлом. Сначала нужно проверить выход: двое с дороги ещё где-то у машины.' },
      { when: not({ v: 'w.c6_r_night', op: '==', value: 'go_with' }), text: 'Павел ждёт, когда станет видно дорогу. «Покажете выход — пойду», — говорит он Хенрике.' },
    ],
    actions: [
      { id: 'c7_morning_window', label: 'Сначала посмотреть на машину из кухни', minutes: 2, terminal: true, goto: 'c7_breakfast',
        text: 'Стекло кабины запотело изнутри. Силуэт Йенса виден на сиденье. Хенрике просит не открывать дверь машины, пока он не ответит.', effects: [{ set: '$.c7_morning', value: 'window' }] },
      { id: 'c7_morning_pawel', label: 'Сказать Павлу, что сейчас проверите выход', minutes: 2, terminal: true, goto: 'c7_breakfast',
        text: 'Павел кивает и садится, не убирая сумку от двери. «Только вернись сказать. Не уходи там молча», — просит он.', effects: [{ set: '$.c7_morning', value: 'pawel' }] },
      { id: 'c7_morning_partner', label: 'Найти партнёра и сначала вместе подойти к столу', minutes: 3, terminal: true, goto: 'c7_breakfast',
        text: '{partner} уже на кухне. Вы садитесь рядом. Хенрике отставляет кашу от края печки: «Сначала поешьте. Потом решайте».', effects: [{ set: '$.c7_morning', value: 'partner' }, { body: 'stress', delta: -2 }] },
      { id: 'c7_morning_sleep', label: 'Спросить, кто этой ночью почти не спал', minutes: 2, combinable: true, when: once7('who_slept'),
        text: 'Хенрике показывает на Оле. Он смотрит на часы и говорит, что прежде ворот проверит ещё и заднюю сетку. Ты просишь его сначала допить чай.', effects: [{ set: '$.c7_who_slept', value: true }] },
    ],
  }),
  S7({
    id: 'c7_breakfast', for: 'any', chapter: 'ch3', title: 'Завтрак', camp: { ...kitchen7, well: true },
    text: [
      { when: { camp: 'tableMeal' }, text: 'Хенрике разливает горячее и делит еду на всех, кто остался в доме. Павел ест левой рукой. Оле сидит напротив него; сегодня они оба слишком устали спорить.' },
      { when: not({ camp: 'tableMeal' }), text: 'Остальные заканчивают завтрак. Свободной порции для тебя сейчас нет: ты уже {m:распорядился|распорядилась} своей либо продуктов не хватило. Можно поесть то, что осталось при тебе, и собрать вещи.' },
    ],
    actions: [
      { id: 'c7_breakfast_eat', label: 'Позавтракать со всеми перед выходом', minutes: 10, terminal: true, goto: 'c7_partner', enabled: { camp: 'tableMeal' }, disabledReason: 'Доступной порции нет',
        text: 'Ты ешь за столом. Павел просит передать хлеб и первым вспоминает, что до большой дороги всё-таки несколько километров.', effects: [{ camp: { kind: 'meal', mode: 'eat', communal: true } }] },
      { id: 'c7_breakfast_pack', label: 'Взять свою готовую порцию в дорогу', minutes: 4, terminal: true, goto: 'c7_partner', enabled: { camp: 'tableMeal' }, disabledReason: 'Эта порция уже использована или не выделена',
        text: 'Хенрике отдаёт тебе оставленную еду. Ты убираешь её в свои вещи. Павел проверяет крышку и возвращает без замечаний.', effects: [{ camp: { kind: 'meal', mode: 'pack', communal: true } }] },
      { id: 'c7_breakfast_skip', label: 'Пока не есть; помочь убрать со стола', minutes: 4, terminal: true, goto: 'c7_partner',
        text: 'Ты освобождаешь край стола под сумки. {partner} подходит к тебе. Хенрике отставляет нетронутую миску подальше от края.', effects: [{ set: '$.c7_skipped_breakfast', value: true }] },
      { id: 'c7_breakfast_stock', label: 'Спросить Хенрике, сколько ещё можно кормить столько людей', minutes: 2, combinable: true, when: once7('stock'),
        text: '«Картошки пока хватает. Только ещё людей приведёте — сперва со мной поговорите», — отвечает Хенрике. Она прикрывает опустевшую кастрюлю крышкой.', effects: [{ set: '$.c7_stock', value: true }] },
    ],
  }),
  S7({
    id: 'c7_partner', for: 'any', chapter: 'ch3', title: 'Две минуты вдвоём', camp: room7,
    text: [
      { text: 'Вы выходите в коридор. Из кухни слышно, как Павел ставит миску на стол. {partner} просит сначала сказать, {m:готов ли ты сам|готова ли ты сама} выходить после этой ночи. Вопрос о машине подождёт две минуты.' },
      { when: A7, text: 'Ты видишь, что у неё дрожат пальцы, когда она застёгивает куртку. Она ждёт ответа, а не нового задания для себя.' },
      { when: B7, text: 'Он долго ищет второй рукав, хотя куртка у него в руках. Когда ты помогаешь, он останавливается и смотрит на тебя.' },
    ],
    actions: [
      { id: 'c7_partner_limit', label: 'Договориться, что к больному за ограду поодиночке не пойдёте', minutes: 3, terminal: true,
        text: '«Если попросят идти одному — откажемся», — говоришь ты. {partner} кивает и просит сказать об этом за столом. Вы возвращаетесь в кухню вместе.', effects: [{ set: '$.c7_pair', value: 'limit' }, { body: 'stress', delta: -3 }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_first_call' }, { id: 'b', goto: 'c7_b_silence' }] },
      { id: 'c7_partner_close', label: 'Попросить немного побыть рядом без обсуждения плана', minutes: 4, terminal: true,
        text: 'Вы стоите рядом у тёплой стены. {partner} опускает голову тебе на плечо. Из кухни зовёт Хенрике. Вы возвращаетесь вместе.', effects: [{ set: '$.c7_pair', value: 'close' }, { body: 'stress', delta: -5 }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_first_call' }, { id: 'b', goto: 'c7_b_silence' }] },
      { id: 'c7_partner_truth', label: 'Рассказать о своих ночных решениях, не требуя одобрения', minutes: 3, terminal: true,
        text: 'Ты рассказываешь свою часть. {partner} просит дать время подумать и обещает сказать о несогласии до общего ответа. В коридор выходит Оле: Йенс больше не отзывается.', effects: [{ set: '$.c7_pair', value: 'truth' }],
        outcomes: [{ id: 'a', when: A7, goto: 'c7_a_first_call' }, { id: 'b', goto: 'c7_b_silence' }] },
    ],
  }),
];
