import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { A11, B11, S11, dawn11, day11, nina11, ole11, once11, tense11, wound11, yard11 } from './point11';

const toDeniz: Effect = { restUntil: at(14, 6, 30) };
// Исход рассвета задан ночным решением КТ10 и одинаков на обеих линиях; выбор игрока — его роль и его риск.
const scripted: Effect[] = [{ if: not(flag('w.c11_dawn_done')), then: [
  { set: 'w.c11_dawn_done', value: true },
  { if: ole11('door'), then: [{ set: 'w.c11_henrike_wound', value: 'scratch' }, { npc: 'henrike', set: { c11_scratched: true } }] },
  { if: ole11('sleep'), then: [{ set: 'w.c11_henrike_wound', value: 'bite' }, { npc: 'henrike', status: 'injured', set: { c11_bitten: true } }] },
  { if: ole11('coop'), then: [{ set: 'w.c11_henrike_wound', value: 'none' }] },
] }];

export const dawn11Scenes: Scene[] = [
  S11({ id: 'c11_dawn', for: 'any', chapter: 'ch3', title: 'Пять утра', camp: tense11, safe: false, ambient: dawn11,
    onEnter: scripted,
    text: [
      { when: ole11('coop'), text: 'Тебя будит грохот. Со стороны старого курятника — удары в дверь, тяжёлые, без ритма. И голос Хенрике: «Оле! Я здесь, Оле!»\n\nТы выбегаешь во двор. Ещё темно. Хенрике стоит у курятника и тянет щеколду обеими руками. Из-за двери не слова — хрип.' },
      { when: all(ole11('door'), A11), text: 'Тебя будит треск дерева и крик {B.gen}. Ты в коридоре раньше, чем успеваешь проснуться.\n\nДверь Оле распахнута, засов висит на одном винте. Оле стоит в проёме — босой, мокрый от пота, глаза пустые. Хенрике держит его за плечи, а он тянется зубами к её руке.' },
      { when: all(ole11('door'), B11), text: 'Засов дёргается. Раз, другой. Из-за двери не слова — хрип. Хенрике просыпается на табурете.\n\nДерево трещит. Дверь распахивается, засов повисает на одном винте. Оле стоит в проёме — босой, мокрый от пота, глаза пустые. Хенрике бросается к нему и хватает за плечи.' },
      { when: ole11('sleep'), text: 'Тебя будит крик Хенрике. Короткий, оборванный.\n\nВ коридоре темно. Дверь Оле открыта. Хенрике сидит на полу у табурета и держится за предплечье. Между пальцами течёт тёмное. Оле стоит над ней. На мать он не смотрит. Он поворачивается на звук твоих шагов.' },
    ],
    actions: [
      { id: 'c11_d_c_grab', label: 'Перехватить её руки на щеколде', when: ole11('coop'), minutes: 5, activity: 'moderate', terminal: true, goto: 'c11_dawn2',
        text: 'Хенрике бьётся у тебя в руках. Потом обмякает. Щеколда остаётся в пазу. Удары за дверью не прекращаются.', effects: [{ set: '$.c11_dawn', value: 'grab' }, { npc: 'henrike', trust: -1 }, { body: 'stress', delta: 6 }] },
      { id: 'c11_d_c_talk', label: 'Встать между ней и дверью и говорить', when: ole11('coop'), minutes: 8, terminal: true, goto: 'c11_dawn2',
        text: 'Ты говоришь что-то — про утро, про Дениза, про то, что Оле сам просил не открывать. Хенрике опускает руки и садится на землю прямо у двери. За дверью бьют и бьют.', effects: [{ set: '$.c11_dawn', value: 'talk' }, { body: 'stress', delta: 4 }] },
      { id: 'c11_d_c_brace', label: 'Упереться в дверь плечом', when: ole11('coop'), minutes: 6, activity: 'moderate', terminal: true, goto: 'c11_dawn2',
        text: 'Дверь вздрагивает от каждого удара у тебя за спиной. Хенрике отпускает щеколду и плачет, уткнувшись тебе в плечо.', effects: [{ set: '$.c11_dawn', value: 'brace' }, { body: 'stress', delta: 5 }] },

      { id: 'c11_d_tackle', label: 'Сбить Оле с ног и прижать к полу', when: all(A11, { any: [ole11('door'), ole11('sleep')] }), minutes: 4, activity: 'heavy', risky: true, terminal: true, goto: 'c11_dawn2',
        text: 'Ты врезаешься в него плечом. Вы падаете вместе. Оле бьётся под тобой и щёлкает зубами у самого уха. Ты прижимаешь его голову к полу локтем, пока {B} не набрасывает одеяло.',
        effects: [{ set: '$.c11_dawn', value: 'tackle' }, { injure: 'bruise', site: 'leftArm', severity: 1 }, { body: 'stress', delta: 8 }] },
      { id: 'c11_d_pull', label: 'Оттащить Хенрике назад', when: all(A11, { any: [ole11('door'), ole11('sleep')] }), minutes: 4, activity: 'moderate', terminal: true, goto: 'c11_dawn2',
        text: 'Ты рвёшь Хенрике на себя. Зубы Оле клацают в воздухе там, где только что была её рука. Он падает на колени, и вы с {B.ins} набрасываете на него одеяло.', effects: [{ set: '$.c11_dawn', value: 'pull' }, { body: 'stress', delta: 6 }] },
      { id: 'c11_d_blanket', label: 'Набросить на него одеяло с лавки', when: { any: [ole11('door'), ole11('sleep')] }, minutes: 4, activity: 'moderate', terminal: true, goto: 'c11_dawn2',
        text: 'Одеяло накрывает Оле с головой. Он запутывается и падает. Вдвоём вы заматываете его, как в мешок. Он бьётся, но всё слабее.', effects: [{ set: '$.c11_dawn', value: 'blanket' }, { body: 'stress', delta: 6 }] },
      { id: 'c11_d_call', label: 'Отскочить и звать {A.acc}', when: all(B11, { any: [ole11('door'), ole11('sleep')] }), minutes: 3, terminal: true, goto: 'c11_dawn2',
        text: 'Ты кричишь так, что не слышишь сама себя. {A} вылетает из комнаты и сбивает Оле с ног. Ты хватаешь одеяло.', effects: [{ set: '$.c11_dawn', value: 'call' }, { body: 'stress', delta: 6 }] },
    ] }),

  S11({ id: 'c11_dawn2', for: 'any', chapter: 'ch3', title: 'Щеколда', camp: yard11, ambient: dawn11,
    onEnter: [{ npc: 'ole', moveTo: 'farm_coop' }, { set: 'w.c11_ole_coop', value: true }],
    text: [
      { when: not(ole11('coop')), text: 'Вы несёте Оле в старый курятник, завёрнутым в одеяло. Он ещё бьётся, но уже слабее. Щеколда входит в паз. Только теперь ты замечаешь, что тебя трясёт.' },
      { when: ole11('coop'), text: 'К шести удары в курятнике становятся реже. Хенрике сидит у двери, прислонившись к ней спиной. Небо на востоке сереет.' },
      { when: wound11('scratch'), text: 'На тыльной стороне ладони у Хенрике три красные полосы от ногтей. Неглубокие. Она смотрит на них так, будто это чужая рука.' },
      { when: wound11('bite'), text: 'Хенрике прижимает к груди руку. На предплечье — полукруг. Такой же, как вчера у сына.\n\n— Не надо на меня так смотреть, — говорит она. — Я знаю.' },
    ],
    actions: [
      { id: 'c11_d2_wash', label: 'Промыть руку Хенрике', when: not(wound11('none')), minutes: 10, terminal: true, goto: 'c11_nina_dawn',
        enabled: { has: 'disinfectant' }, disabledReason: 'Нужен свой антисептик',
        text: 'Ты промываешь рану. Хенрике не морщится. Смотрит, как стекает розовое, и молчит.', effects: [{ charge: 'disinfectant', delta: -10 }, { set: '$.c11_washed', value: true }, { npc: 'henrike', trust: 2 }] },
      { id: 'c11_d2_self', label: 'Проверить, цел{m:|а} ли ты {m:сам|сама}', minutes: 3, terminal: true, goto: 'c11_nina_dawn',
        outcomes: [
          { id: 'hurt', when: { injured: 'any' }, text: 'Ты осматриваешь руки, шею, лицо при свете из окна. Синяки, ссадина от пола. Ни укуса, ни царапины от зубов или ногтей.' },
          { id: 'ok', text: 'Ты осматриваешь руки, шею, лицо при свете из окна. Ни царапины. Только колени дрожат.' },
        ], effects: [{ set: '$.c11_self_check', value: true }] },
      { id: 'c11_d2_sit', label: 'Сесть рядом с Хенрике у курятника', minutes: 10, activity: 'rest', terminal: true, goto: 'c11_nina_dawn',
        text: 'Вы сидите на холодной земле. Хенрике не говорит ни слова. Когда за дверью затихает, она каждый раз задерживает дыхание.', effects: [{ set: '$.c11_d2', value: 'sit' }, { npc: 'henrike', trust: 1 }] },
    ] }),

  S11({ id: 'c11_nina_dawn', for: 'any', chapter: 'ch3', title: 'Нина', camp: yard11, ambient: dawn11,
    text: [
      { when: nina11('house'), text: 'Нина сидит на лавке у печи, поджав ноги. Она всё видела.' },
      { when: nina11('barn'), text: 'Нина стоит в дверях сарая с вилами в руках. Вилы больше неё.' },
      { when: nina11('van'), text: 'Нина под навесом, вжалась между колесом фургона и стеной. Что-то сжимает в кулаке.' },
      { text: '— Это то же самое? — спрашивает она. — Как у папы?' },
    ],
    actions: [
      { id: 'c11_n_truth', label: 'Сказать: да, то же самое', minutes: 3, terminal: true, goto: 'c11_deniz',
        text: 'Нина кивает. Потом опускает голову и долго смотрит себе под ноги.', effects: [{ set: '$.c11_nina', value: 'truth' }, toDeniz] },
      { id: 'c11_n_hold', label: 'Обнять её и ничего не говорить', minutes: 5, terminal: true, goto: 'c11_deniz',
        text: 'Нина стоит, опустив руки. Потом вцепляется тебе в куртку и не отпускает, пока не светает.', effects: [{ set: '$.c11_nina', value: 'hold' }, { npc: 'c7_nina', trust: 2 }, toDeniz] },
      { id: 'c11_n_send', label: 'Отвести её в дом и уложить ещё поспать', minutes: 10, terminal: true, goto: 'c11_deniz',
        text: 'Нина ложится, но не спит. Когда ты оглядываешься в дверях, она смотрит в потолок.', effects: [{ set: '$.c11_nina', value: 'send' }, toDeniz] },
    ] }),

  S11({ id: 'c11_deniz', for: 'any', chapter: 'ch3', title: 'Братья', camp: yard11, ambient: day11,
    text: [
      { text: 'В половине седьмого скрипит калитка. Дениз и Керем, мокрые до колен. Дениз смотрит на курятник, на Хенрике у двери, на вас.\n\n— Уже? — спрашивает он.\n\nКерем остаётся у калитки.' },
      { when: all(flag('$.c10_knows'), flag('$.c10_door')), text: 'Ты помнишь, о чём ночью просил Оле: если станет таким — пусть Дениз. Не мать.' },
      { text: 'Дениз подходит к вам.\n\n— Я сделаю, если надо. Только если вы оба скажете. И пусть она не смотрит.\n\nХенрике поднимает голову.\n\n— Подождите до полудня. Пожалуйста. Хотя бы до полудня.' },
    ],
    actions: [
      { id: 'c11_dz_now', label: 'Сказать Денизу, что тянуть нельзя', minutes: 3, terminal: true, goto: 'c11_check',
        text: 'Дениз кивает.\n\n— Значит, ждём, пока {partner} скажет то же самое. Одного слова мало.', effects: [{ set: '$.c11_view', value: 'now' }, { npc: 'henrike', trust: -2 }, { restUntil: at(14, 7) }] },
      { id: 'c11_dz_noon', label: 'Попросить подождать до полудня, как просит Хенрике', minutes: 3, terminal: true, goto: 'c11_check',
        text: 'Дениз пожимает плечами.\n\n— До полудня так до полудня. Он никуда не денется.\n\nХенрике закрывает глаза.', effects: [{ set: '$.c11_view', value: 'noon' }, { npc: 'henrike', trust: 3 }, { restUntil: at(14, 7) }] },
      { id: 'c11_dz_jest', label: 'Предложить отвезти его в пункт в Йестебурге', minutes: 3, terminal: true, goto: 'c11_check',
        text: '— В таком виде? — Дениз качает головой. — Его там пристрелят у ворот. Если хотите везти — пусть сначала успокоится.', effects: [{ set: '$.c11_view', value: 'jest' }, { restUntil: at(14, 7) }] },
      { id: 'c11_dz_kerem', label: 'Подойти к Керему у калитки', minutes: 2, combinable: true, when: once11('kerem'),
        text: '— Живой, — говорит Керем, прежде чем ты спросишь. — А вы?\n\nОн смотрит на курятник и отворачивается.', effects: [{ set: '$.c11_kerem', value: true }, { npc: 'kerem', trust: 1 }] },
    ] }),

  S11({ id: 'c11_check', for: 'any', chapter: 'ch3', title: 'Рукава', camp: yard11, ambient: day11,
    text: [
      { text: 'Дениз снимает куртку и закатывает рукава до плеч. Поворачивает руки ладонями вверх, потом вниз.\n\n— Правило этого двора, — говорит он. — Кто был рядом — показывает руки. Я тоже покажу, хоть меня тут и не было.' },
      { when: wound11('none'), text: 'Хенрике молча закатывает рукава. Руки чистые, только старые белые шрамы от проволоки.' },
      { when: wound11('scratch'), text: 'Хенрике закатывает рукав сама. Три красные полосы на тыльной стороне ладони.\n\n— Ногти, — говорит Дениз, наклонившись. — Не зубы. До вечера посмотрим.' },
      { when: wound11('bite'), text: 'Хенрике закатывает рукав. Полукруг на предплечье уже налился синевой.\n\n— По твоему правилу — в курятник, — тихо говорит Дениз.\n\n— По моему, — соглашается Хенрике. — Курятник занят. До полудня я здесь. Потом сама решу.' },
      { text: 'Дениз поворачивается к вам.' },
    ],
    actions: [
      { id: 'c11_ck_show', label: 'Закатать рукава и показать руки', minutes: 5, terminal: true, goto: 'c11_breakfast',
        effects: [{ set: '$.c11_check', value: 'show' }, { npc: 'deniz', trust: 1 }],
        outcomes: [
          { id: 'hurt', when: { injured: 'any' }, text: 'Дениз смотрит на синяк у локтя и трогает его пальцем.\n\n— Это пол. Не зубы. — Он кивает и отпускает твою руку.' },
          { id: 'clean', text: 'Дениз осматривает руки до плеч, шею, за ушами. Пальцы у него холодные и шершавые.\n\n— Чисто, — говорит он.' },
        ] },
      { id: 'c11_ck_pair', label: 'Осмотреть друг друга с {partner.ins}', minutes: 8, terminal: true, goto: 'c11_breakfast',
        text: 'Ты осматриваешь {partner.acc}: руки, шею, за ушами, ладони. Медленно, как будто впервые. Потом {partner} осматривает тебя. Дениз стоит рядом и не вмешивается.\n\n— Чисто, — говоришь ты. Он кивает.', effects: [{ set: '$.c11_check', value: 'pair' }, { body: 'stress', delta: -2 }] },
      { id: 'c11_ck_refuse', label: 'Сказать, что не дал{m:|а} себя тронуть', minutes: 4, terminal: true, goto: 'c11_breakfast',
        text: '— Тогда тебе и показать не трудно, — спокойно говорит Дениз. — Мне тоже не нравится. Показывай.\n\nТы показываешь. Чисто. Вы оба делаете вид, что ничего не было.', effects: [{ set: '$.c11_check', value: 'refuse' }, { npc: 'deniz', trust: -1 }] },
    ] }),
];
