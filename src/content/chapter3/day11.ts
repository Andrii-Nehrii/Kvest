import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { flag, not } from './world3';
import { A11, S11, day11, kept11, kitchen11, once11, wound11, yard11 } from './point11';

const meal = (mode: 'eat' | 'pack') => ({ camp: { kind: 'meal' as const, mode, communal: true } });
const toPatrol: Effect = { restUntil: at(14, 9, 30) };
const toNoon: Effect = { restUntil: at(14, 10, 40) };
const next = [{ id: 'a', when: A11, goto: 'c11_a_coop' }, { id: 'b', goto: 'c11_b_henrike' }];

export const day11Scenes: Scene[] = [
  S11({ id: 'c11_breakfast', for: 'any', chapter: 'ch3', title: 'Каша', camp: kitchen11,
    text: [{ text: 'Хенрике к столу не выходит. Кашу варит Нина: молча, сосредоточенно, как будто от этого что-то зависит. Дениз режет хлеб. Керем греет руки о кружку и не поднимает глаз.\n\nИз окна виден курятник. Оттуда изредка доносится удар, и все за столом замирают.' }],
    actions: [
      { id: 'c11_bf_eat', label: 'Поесть со всеми', minutes: 15, terminal: true, outcomes: next, enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Каша пригорела снизу. Её всё равно доедают до дна.', effects: [meal('eat')] },
      { id: 'c11_bf_pack', label: 'Взять свою порцию с собой', minutes: 3, terminal: true, outcomes: next, enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Нина накладывает кашу в банку и молча протягивает тебе.', effects: [meal('pack')] },
      { id: 'c11_bf_hen', label: 'Отнести тарелку Хенрике к курятнику', minutes: 5, terminal: true, outcomes: next,
        text: 'Хенрике берёт тарелку и ставит рядом с собой на землю. Есть она не будет. Но тарелку не отодвигает.', effects: [{ set: '$.c11_bf', value: 'henrike' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_bf_nina', label: 'Похвалить Нинину кашу', minutes: 1, combinable: true, when: once11('praise'),
        text: 'Нина пожимает плечами. — Папа говорил, у меня руки не оттуда. — Она почти улыбается.', effects: [{ set: '$.c11_praise', value: true }, { npc: 'c7_nina', trust: 1 }] },
    ] }),

  S11({ id: 'c11_a_coop', for: 'A', chapter: 'ch3', title: 'Караул', camp: yard11, ambient: day11,
    text: [{ text: 'Ты сменяешь Хенрике у курятника. Дениз садится рядом на перевёрнутое ведро. Хенрике уходит в дом, но через каждые десять минут выглядывает в окно.\n\nЗа дверью то тихо, то Оле бросается на неё всем телом, и щеколда звякает.' }],
    actions: [
      { id: 'c11_a_c_gap', label: 'Посмотреть в щель', minutes: 5, terminal: true, goto: 'c11_a_patrol',
        text: 'Оле лежит на соломе. Грудь ходит часто-часто. Глаза открыты и смотрят в потолок. Когда ты наклоняешься, он рывком бросается к двери. Ты отшатываешься.\n\n— Не надо, — говорит Дениз. — Я уже смотрел.', effects: [{ set: '$.c11_coop', value: 'gap' }, { body: 'stress', delta: 4 }, toPatrol] },
      { id: 'c11_a_c_deniz', label: 'Поговорить с Денизом', minutes: 20, activity: 'rest', terminal: true, goto: 'c11_a_patrol',
        text: '— Знаешь, что самое паршивое? — говорит Дениз. — Я ей верил. Если бы она сейчас вышла и сказала, что это порез, — я бы, может, и сейчас поверил.\n\nОн долго молчит.\n\n— Я бы на её месте тоже врал. Вот что паршиво.', effects: [{ set: '$.c11_coop', value: 'deniz' }, { npc: 'deniz', trust: 2 }, toPatrol] },
      { id: 'c11_a_c_quiet', label: 'Сидеть молча и считать удары', minutes: 20, activity: 'rest', terminal: true, goto: 'c11_a_patrol',
        text: 'Ты считаешь. Двадцать за первые десять минут. Двенадцать за следующие. Шесть. Дениз тоже считает: ты видишь, как шевелятся его губы.', effects: [{ set: '$.c11_coop', value: 'count' }, toPatrol] },
    ] }),

  S11({ id: 'c11_a_patrol', for: 'A', chapter: 'ch3', title: 'Патруль', camp: yard11, ambient: day11,
    text: [{ text: 'В половине десятого у калитки останавливается армейский внедорожник. Из него выходит солдат с планшетом. Второй остаётся за рулём.\n\n— Хутор Людеманов? — Солдат сверяется с планшетом. — Пункт в Йестебурге принимает раненых и укушенных. Есть у вас такие? Укрывать запрещено.\n\nДениз смотрит на тебя. Хенрике в окне замерла.' }],
    actions: [
      { id: 'c11_p_lie', label: 'Сказать, что больных нет', minutes: 4, terminal: true, goto: 'c11_quarrel',
        text: 'Солдат смотрит на курятник, на тебя. Записывает что-то.\n\n— Завтра вернёмся с врачом. Проверим всех, — говорит он и садится в машину.', effects: [{ set: '$.c11_patrol', value: 'lie' }, { npc: 'henrike', trust: 3 }, toNoon] },
      { id: 'c11_p_truth', label: 'Сказать, что есть укушенный, и попросить врача', minutes: 5, terminal: true, goto: 'c11_quarrel',
        text: 'Солдат отступает на шаг от калитки.\n\n— Привезите сами. Или завтра заберём. — Он медлит. — Если ещё будет кого.\n\nХенрике в окне отворачивается.', effects: [{ set: '$.c11_patrol', value: 'truth' }, { npc: 'henrike', trust: -4 }, toNoon] },
      { id: 'c11_p_ask', label: 'Спросить, что с укушенными делают в пункте', minutes: 5, terminal: true, goto: 'c11_quarrel',
        text: '— Изолируют. Наблюдают. — Солдат пожимает плечами. — Лечить нечем. Говорят, у кого-то жар проходит сам. Один на двадцать, может. Врачи сами не верят.\n\nОн ждёт ответа на свой вопрос. Ты молчишь. Он записывает название хутора и уезжает.', effects: [{ set: '$.c11_patrol', value: 'ask' }, { set: '$.c11_heard_one_in_twenty', value: true }, toNoon] },
    ] }),

  S11({ id: 'c11_b_henrike', for: 'B', chapter: 'ch3', title: 'Табурет у курятника', camp: yard11, ambient: day11,
    text: [
      { text: 'Хенрике снова сидит у курятника, на табурете из кухни. Ты садишься рядом на ящик.\n\n— Ты меня презираешь, — говорит она. Это не вопрос.' },
      { when: wound11('bite'), text: 'Укушенную руку она держит на коленях, обмотанную полотенцем.' },
      { when: wound11('scratch'), text: 'На тыльной стороне ладони у неё три красные полосы.' },
    ],
    actions: [
      { id: 'c11_b_h_honest', label: 'Сказать честно: тебе было страшно из-за её вранья', minutes: 5, terminal: true, goto: 'c11_b_nina',
        text: 'Хенрике кивает.\n\n— Мне тоже. Только я врала, а ты нет. Вот и вся разница.', effects: [{ set: '$.c11_bh', value: 'honest' }, { npc: 'henrike', trust: 1 }, toPatrol] },
      { id: 'c11_b_h_mother', label: 'Сказать, что понимаешь: он её сын', minutes: 5, terminal: true, goto: 'c11_b_nina',
        text: '— Понимаешь, — повторяет Хенрике. — У тебя детей нет. Не понимаешь. — Она тут же касается твоей руки. — Прости. Спасибо, что сидишь.', effects: [{ set: '$.c11_bh', value: 'mother' }, { npc: 'henrike', trust: 2 }, toPatrol] },
      { id: 'c11_b_h_wound', label: 'Предложить перевязать ей руку в перчатках', when: not(wound11('none')), minutes: 15, terminal: true, goto: 'c11_b_nina',
        enabled: { has: 'nitrile_gloves' }, disabledReason: 'Нужны свои перчатки',
        text: 'Ты надеваешь перчатки и перевязываешь руку заново. Хенрике смотрит, как ты работаешь.\n\n— Если это то же самое, — говорит она, — то меня туда же. К нему. Не спорь.', effects: [{ take: 'nitrile_gloves', qty: 1 }, { set: '$.c11_bh', value: 'wound' }, { npc: 'henrike', trust: 3 }, toPatrol] },
      { id: 'c11_b_h_quiet', label: 'Ничего не отвечать и посидеть рядом', minutes: 20, activity: 'rest', terminal: true, goto: 'c11_b_nina',
        text: 'Вы сидите молча. Удары за дверью становятся реже. Хенрике считает их шёпотом.', effects: [{ set: '$.c11_bh', value: 'quiet' }, toPatrol] },
    ] }),

  S11({ id: 'c11_b_nina', for: 'B', chapter: 'ch3', title: 'Домой', camp: yard11, ambient: day11,
    text: [
      { text: 'Нина находит тебя у колодца.\n\n— Я сегодня домой поеду, — говорит она. — Мне тут нечего делать.' },
      { when: kept11, text: '— А папа пусть стоит. Я потом. Я не могу сейчас.' },
      { when: not(kept11), text: '— Папу надо домой отвезти. В сад. Вы же обещали помочь? Кто-нибудь обещал.' },
      { text: 'Она смотрит на курятник.\n\n— В чате говорили: бывает, проходит. Может, у него пройдёт?' },
    ],
    actions: [
      { id: 'c11_b_n_stay', label: 'Попросить её остаться хотя бы до завтра', minutes: 5, terminal: true, goto: 'c11_quarrel',
        text: '— До завтра, — повторяет Нина. — Ладно. До завтра.', effects: [{ set: '$.c11_bn', value: 'stay' }, { npc: 'c7_nina', trust: 1 }, toNoon] },
      { id: 'c11_b_n_drive', label: 'Пообещать уговорить остальных отвезти её завтра', minutes: 4, terminal: true, goto: 'c11_quarrel',
        text: 'Нина кивает и впервые за утро смотрит тебе прямо в глаза.\n\n— Вы правда спросите? Не как взрослые?', effects: [{ set: '$.c11_bn', value: 'drive' }, { npc: 'c7_nina', trust: 2 }, toNoon] },
      { id: 'c11_b_n_hope', label: 'Сказать, что не знаешь, проходит ли', minutes: 3, terminal: true, goto: 'c11_quarrel',
        text: '— Никто не знает, — говорит Нина. — Все только делают вид.', effects: [{ set: '$.c11_bn', value: 'hope' }, toNoon] },
    ] }),

  S11({ id: 'c11_quarrel', for: 'any', chapter: 'ch3', title: 'При всех', camp: yard11, ambient: day11,
    text: [{ text: 'Ближе к одиннадцати Керем подходит к курятнику. Хенрике поднимает на него глаза.\n\n— Вы меня заставили молчать, — говорит Керем громко, чтобы слышали все. — Я ночевал в будке с крысами. А он тут мог кого угодно…\n\n— Мог, — говорит Хенрике. — Не смог. Вы его заперли.\n\nДениз встаёт между ними, но смотрит на вас: скажите что-нибудь.' }],
    actions: [
      { id: 'c11_q_kerem', label: 'Встать на сторону Керема: он имел право знать', minutes: 4, terminal: true, goto: 'c11_noon',
        text: 'Керем кивает тебе и отходит к колодцу. Хенрике отворачивается к двери курятника.', effects: [{ set: '$.c11_q', value: 'kerem' }, { npc: 'kerem', trust: 3 }, { npc: 'henrike', trust: -2 }, { restUntil: at(14, 11) }] },
      { id: 'c11_q_henrike', label: 'Сказать Керему, что сейчас не время', minutes: 4, terminal: true, goto: 'c11_noon',
        text: '— Не время, — повторяет Керем. — У вас никогда не время. — Он уходит в сарай. Хенрике смотрит тебе вслед, но ничего не говорит.', effects: [{ set: '$.c11_q', value: 'henrike' }, { npc: 'kerem', trust: -2 }, { npc: 'henrike', trust: 2 }, { restUntil: at(14, 11) }] },
      { id: 'c11_q_both', label: 'Сказать: виноваты все, кто молчал, и мы тоже', minutes: 5, terminal: true, goto: 'c11_noon',
        text: 'Становится тихо. Керем смотрит на тебя, потом на Хенрике. Хенрике первой опускает глаза.\n\n— Ладно, — говорит Керем. — Ладно.', effects: [{ set: '$.c11_q', value: 'both' }, { npc: 'kerem', trust: 1 }, { npc: 'henrike', trust: 1 }, { restUntil: at(14, 11) }] },
    ] }),

  S11({ id: 'c11_noon', for: 'any', chapter: 'ch3', title: 'Тишина', camp: yard11, ambient: day11,
    text: [
      { text: 'К одиннадцати удары в курятнике стихают. Совсем.\n\nХенрике сидит у двери, не шевелясь. Дениз встаёт с ведра.\n\n— Тишина — это хорошо или плохо? — спрашивает Керем.\n\nНикто не знает.' },
      { when: flag('$.c11_heard_one_in_twenty'), text: 'Ты вспоминаешь солдата у калитки. «Один на двадцать, может».' },
    ],
    actions: [
      { id: 'c11_noon_go', label: 'Подойти к курятнику', minutes: 3, terminal: true, goto: 'c11_wake', effects: [{ set: '$.c11_noon', value: 'go' }, { restUntil: at(14, 11, 10) }] },
      { id: 'c11_noon_partner', label: 'Встать рядом с {partner.ins}', minutes: 3, terminal: true, goto: 'c11_wake', effects: [{ set: '$.c11_noon', value: 'partner' }, { body: 'stress', delta: -1 }, { restUntil: at(14, 11, 10) }] },
      { id: 'c11_noon_nina', label: 'Увести Нину подальше от двери', minutes: 3, terminal: true, goto: 'c11_wake', effects: [{ set: '$.c11_noon', value: 'nina' }, { npc: 'c7_nina', trust: 1 }, { restUntil: at(14, 11, 10) }] },
    ] }),
];
