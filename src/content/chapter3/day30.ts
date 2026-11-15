import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { not } from './world3';
import { tense14 } from './point14';
import { npc } from './point19';
import {
  A30, S30, down30, dry, frost30, frostWet30, guardHome, hollow30, hurt1, hurt2, mittens, rope, set30, until30, w30, worse1, worse2,
} from './point30';

// Участок 30: три входа, у каждого игрока своя цепочка. Звено 1 — терпимо; звено 2 при ошибке в первом — тяжело;
// звено 3 при ошибке во втором — выбывание. Осторожный путь в каждом звене есть и стоит своего (меньше пользы, чей-то упрёк, холод без дела).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S30({ ...scene, for: 'any', chapter: 'ch3', camp: scene.camp ?? tense14, safe: false });
const H = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: hollow30, camp: { at: hollow30, stock: 'c3_farm_stock', rest: false } });
const jest = 'c16_jesteburg';
const F = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: jest, camp: { at: jest, stock: 'c3_farm_stock', rest: false } });
const leaHere: Cond = { npc: 'c21_lea', alive: true };
const split = (a: string, b: string) => [{ id: 'a', when: A30, goto: a }, { id: 'b', goto: b }];

export const day30Scenes: Scene[] = [
  // ═════════════ Впадина (join) ═════════════
  X({ id: 'c30_j_road', title: 'К пожарной части', ambient: frost30,
    text: [
      { text: 'В десять у пожарной части человек тридцать. Дружина, солдаты Тобиаса, двое с овчарками. Факелы из палок и тряпок в солярке. Вилы, багры. Брандт без каски.' },
      { text: 'Тобиас делит: цепь с факелами — к краю впадины; сани и врачи — сзади, у костра. Лея и доктор Зандер уже у саней.' },
    ],
    actions: [
      { id: 'c30_jr_go', label: 'Идти со всеми', minutes: 60, terminal: true, outcomes: split('c30_j_a1', 'c30_j_b1'), ambientDuring: frost30,
        text: 'Колонна идёт по полю молча. Скрип снега. Факелы чадят. Через час с холма видно впадину: тёмная масса внизу, неподвижная. От неё идёт пар.', effects: [set30('jr', 'go'), { move: hollow30 }, until30(30, 23, 10)] },
    ] }),

  H({ id: 'c30_j_a1', title: 'Цепь', ambient: frost30,
    text: [
      { text: 'Цепь растягивается по краю впадины. Ты между Уве и мальчишкой лет шестнадцати. Внизу, в десяти метрах, стоят они. Сотни. Вялые, серые. Некоторые поворачивают головы на огонь.' },
      { text: 'Уве, не глядя на тебя:\n\n— Nicht vorgehen. Der Rand ist Eis unter dem Schnee. Wer rutscht, liegt unten.\n\nНе выходи вперёд. Край — лёд под снегом. Кто поскользнётся, окажется внизу.' },
      { when: not(mittens), text: 'Пальцы в одной паре рукавиц уже не чувствуют древка.' },
    ],
    actions: [
      { id: 'c30_ja1_hold', label: 'Стоять в цепи, держать факел', minutes: 60, terminal: true, goto: 'c30_j_a2', ambientDuring: frost30,
        text: 'Ты стоишь. Час. Факел догорает, тебе дают новый. Внизу они медленно идут к огню и останавливаются у края. Мороз тянет из них остатки тепла. Ничего не происходит. Это и есть работа.', effects: [set30('ja1', 'hold'), { body: 'fatigue', delta: 4 }, until30(31, 0, 20)] },
      { id: 'c30_ja1_step', label: 'Спуститься на шаг и поджечь солому у края', minutes: 40, risky: true, terminal: true, goto: 'c30_j_a2', ambientDuring: frost30,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты спускаешься боком, по-лыжному. Солома вспыхивает. Ты карабкаешься обратно. Уве молча хватает тебя за воротник и вытягивает последний метр.', effects: [set30('ja1', 'step')] },
          { id: 'slip', text: 'Нога уходит. Ты съезжаешь на два метра вниз по ледяному склону, ударяешься коленом о камень. Уве и мальчишка вытягивают тебя за верёвку. Штанина мокрая до бедра, колено горит.', effects: [set30('ja1', 'step'), ...hurt1('bruise')] },
        ], effects: [until30(31, 0, 0)] },
      { id: 'c30_ja1_back', label: 'Отойти к костру: руки не держат факел', when: not(mittens), minutes: 60, terminal: true, goto: 'c30_j_a2',
        text: 'Ты отдаёшь факел и уходишь к костру. Кто-то смотрит тебе вслед с презрением. Пальцы отходят с болью. Через час ты возвращаешься в цепь.', effects: [set30('ja1', 'back'), { body: 'stress', delta: 2 }, until30(31, 0, 20)] },
    ] }),

  H({ id: 'c30_j_a2', title: 'Рукав', ambient: frost30,
    text: [
      { text: 'Около часу внизу начинается движение. Огонь их согрел. Несколько поднимаются по склону, медленно, цепляясь за наст. Цепь отталкивает их баграми.' },
      { when: worse1, text: 'Колено не держит. Мокрая штанина задубела на морозе, как жесть.' },
      { text: 'Один выходит прямо на тебя. Протягивает руку. Пальцы цепляются за рукав.' },
    ],
    actions: [
      { id: 'c30_ja2_pull', label: 'Рвануться назад, вырвать рукав', minutes: 20, terminal: true, goto: 'c30_j_a3',
        text: 'Ты дёргаешься назад. Рукав трещит. Мальчишка рядом бьёт багром, и рука отпускает. Тот, внизу, съезжает обратно по склону.', effects: [set30('ja2', 'pull'), until30(31, 1, 20)] },
      { id: 'c30_ja2_fight', label: 'Ударить вилами, стоя на краю', minutes: 20, risky: true, terminal: true, goto: 'c30_j_a3',
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Ты замахиваешься, и колено подламывается. Ты падаешь на край, на руки. Лёд режет ладонь сквозь перчатку, глубоко. Кровь горячая на снегу. Уве за шиворот оттаскивает тебя назад.', effects: [set30('ja2', 'fight'), ...hurt2] },
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['strength'] }, text: 'Вилы входят. Он падает назад, увлекая за собой второго. Ты стоишь на краю, тяжело дыша. Уве смотрит на тебя и ничего не говорит.', effects: [set30('ja2', 'fight')] },
          { id: 'hurt2', text: 'Вилы застревают. Тебя тянет вниз. Ты отпускаешь черенок и падаешь на колени. Ладонь распорота о лёд. Мальчишка оттаскивает тебя за капюшон.', effects: [set30('ja2', 'fight'), ...hurt2] },
        ], effects: [until30(31, 1, 20)] },
      { id: 'c30_ja2_call', label: 'Крикнуть Уве и отступить за его спину', minutes: 20, terminal: true, goto: 'c30_j_a3',
        text: 'Уве делает шаг вперёд, багор, толчок. Тот съезжает вниз. Уве не оборачивается.\n\n— Gut gemacht. Nicht geschämt.\n\nПравильно. Не стыдно.', effects: [set30('ja2', 'call'), until30(31, 1, 20)] },
    ] }),

  H({ id: 'c30_j_a3', title: 'Огонь', ambient: frost30,
    text: [
      { text: 'В два Брандт велит поджигать покрышки по всему краю. Цепь отходит на десять шагов. Пламя встаёт стеной. Внизу движение: они идут к огню, все сразу.' },
      { when: worse2, text: 'Рука не держит. Кровь пропитала перчатку и замёрзла коркой. Голова плывёт.' },
      { text: 'Справа кто-то кричит: мальчишка в цепи поскользнулся у самого края и висит, держась за куст.' },
    ],
    actions: [
      { id: 'c30_ja3_rope', label: 'Бросить ему верёвку', when: rope, minutes: 20, terminal: true, goto: 'c30_night_end',
        text: 'Верёвка ложится рядом с ним. Он хватает. Вы с Уве тянете вдвоём. Мальчишка выползает на край, белый, трясущийся, и говорит «Danke» три раза подряд.', effects: [set30('ja3', 'rope'), w30('boy_saved', true), { move: 'hof_luedemann' }, until30(31, 3, 50)] },
      { id: 'c30_ja3_go', label: 'Бежать к нему по краю', minutes: 20, risky: true, terminal: true, goto: 'c30_night_end',
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты бежишь. Раненая рука не держит равновесия. Нога уходит на льду. Ты падаешь лицом вниз, на склон, головой о камень, и катишься в темноту, к теплу и движению внизу.\n\nПоследнее, что ты слышишь, — Уве кричит твоё имя и чей-то выстрел.', effects: [set30('ja3', 'go'), ...down30] },
          { id: 'ok', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] }, text: 'Ты падаешь на живот у края и хватаешь его за запястье. Уве хватает тебя за ноги. Втроём вы откатываетесь от края.', effects: [set30('ja3', 'go'), w30('boy_saved', true), { move: 'hof_luedemann' }] },
          { id: 'slip', text: 'Ты падаешь на живот у края и тянешься, но не достаёшь. Солдат с багром успевает раньше. Ты лежишь на снегу и не можешь встать минуту.', effects: [set30('ja3', 'go'), { body: 'fatigue', delta: 6 }, { move: 'hof_luedemann' }] },
        ], effects: [until30(31, 3, 50)] },
      { id: 'c30_ja3_shout', label: 'Звать солдат с баграми и стоять на месте', minutes: 20, terminal: true, goto: 'c30_night_end',
        text: 'Ты кричишь. Двое солдат с баграми подбегают раньше, чем мальчишка разжимает пальцы. Его вытягивают. Ты стоишь, где стоял{m:|а}. Никто тебя не упрекает. Никто не хвалит.', effects: [set30('ja3', 'shout'), { move: 'hof_luedemann' }, until30(31, 3, 50)] },
    ] }),

  H({ id: 'c30_j_b1', title: 'Сани', ambient: frost30,
    text: [
      { text: 'У костра сани, носилки, бидон с горячим чаем. Доктор Зандер в двух куртках. Лея рядом.' },
      { text: 'Первым приводят пожарного с белыми пальцами: снял рукавицы, чтобы зажечь факел. Зандер:\n\n— Nicht reiben. Warmes Wasser. Nicht heißes. Und Sie — die Handschuhe an, sonst sind Sie die Nächste.\n\nНе растирать. Тёплая вода. Не горячая. А вы — рукавицы надеть, иначе следующей будете вы.' },
    ],
    actions: [
      { id: 'c30_jb1_water', label: 'Греть ему руки в тёплой воде, в рукавицах', minutes: 60, terminal: true, goto: 'c30_j_b2',
        text: 'Ты держишь его руки в котелке с тёплой водой. {m:Сам|Сама} в рукавицах, неудобно, медленно. Пальцы у него розовеют. Он плачет от боли, как ребёнок, и извиняется.', effects: [set30('jb1', 'water'), until30(31, 0, 20)] },
      { id: 'c30_jb1_bare', label: 'Снять рукавицы: так быстрее', minutes: 50, risky: true, terminal: true, goto: 'c30_j_b2',
        outcomes: [
          { id: 'ok', check: { traits: ['endurance'], difficulty: 3, uses: ['focus'] }, text: 'Быстрее. Его пальцы розовеют. Твои — белеют. Ты успеваешь натянуть рукавицы, пока не поздно.', effects: [set30('jb1', 'bare')] },
          { id: 'cold', text: 'Быстрее. Его пальцы розовеют. Твои — уже нет. Когда ты натягиваешь рукавицы, пальцы не гнутся. Мокрые руки на морозе.', effects: [set30('jb1', 'bare'), ...hurt1('glove')] },
        ], effects: [until30(31, 0, 10)] },
      { id: 'c30_jb1_tea', label: 'Разносить чай цепи', minutes: 60, terminal: true, goto: 'c30_j_b2', ambientDuring: frost30,
        text: 'Бидон, кружки, туда и обратно вдоль цепи. Люди пьют, не снимая рукавиц, обжигаясь. Ты возвращаешься к костру, когда бидон пустеет.', effects: [set30('jb1', 'tea'), { body: 'fatigue', delta: 4 }, until30(31, 0, 20)] },
    ] }),

  H({ id: 'c30_j_b2', title: 'Раненый на льду', ambient: frost30,
    text: [
      { text: 'Около часу кто-то кричит с края: упал человек. Его тащат на брезенте двое, медленно, по наледи у ручья.' },
      { when: worse1, text: 'Твои пальцы не гнутся. Держать что-то сложно.' },
      { when: leaHere, text: 'Лея кладёт руку тебе на плечо: — Nicht übers Eis. Die tragen ihn her. Warte.\n\nНе по льду. Его принесут. Подожди.' },
      { when: not(leaHere), text: 'Зандер, не оборачиваясь: — Bleiben Sie hier. Die bringen ihn.\n\nОставайтесь здесь. Его принесут.' },
    ],
    actions: [
      { id: 'c30_jb2_wait', label: 'Ждать у саней, готовить носилки', minutes: 30, terminal: true, goto: 'c30_j_b3',
        text: 'Ты стелешь одеяла на носилки, греешь воду. Раненого приносят через десять минут: рука, кровь, но в сознании. Зандер работает быстро.', effects: [set30('jb2', 'wait'), until30(31, 1, 20)] },
      { id: 'c30_jb2_run', label: 'Бежать им навстречу по льду ручья', minutes: 30, risky: true, terminal: true, goto: 'c30_j_b3', ambientDuring: frostWet30,
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Лёд трещит. Ты проваливаешься по колено в чёрную воду. Хватаешься за край, и онемевшие пальцы не держат: падаешь на руки, лёд режет ладонь. Тебя вытаскивают двое с брезентом, бросив раненого на минуту.', effects: [set30('jb2', 'run'), ...hurt2] },
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты добегаешь, берёшься за угол брезента. Вчетвером быстрее. Лёд держит.', effects: [set30('jb2', 'run')] },
          { id: 'wet', text: 'Лёд проваливается под одной ногой. Ты выдёргиваешь её, мокрую до колена. Добегаешь, берёшься за брезент. Нога горит, потом немеет.', effects: [set30('jb2', 'run'), ...hurt2] },
        ], effects: [until30(31, 1, 20)] },
      { id: 'c30_jb2_lea', label: 'Спросить Лею, что нужно приготовить', when: leaHere, minutes: 30, terminal: true, goto: 'c30_j_b3',
        text: '— Wärme. Bandagen. Und Ruhe. Du hast Ruhe. Das ist am wichtigsten.\n\nТепло. Бинты. И спокойствие. У тебя есть спокойствие. Это главное.', effects: [set30('jb2', 'lea'), npc('c21_lea', 1), until30(31, 1, 20)] },
    ] }),

  H({ id: 'c30_j_b3', title: 'Последний час', ambient: frost30,
    text: [
      { text: 'В два загораются покрышки по всему краю. Жар доходит даже сюда. Внизу движение. У саней тесно: раненые, обмороженные, двое без сознания.' },
      { when: worse2, text: 'Ты почти не чувствуешь ног. Руки дрожат так, что бинт не ложится.' },
      { text: 'Со стороны впадины по склону, мимо цепи, ползёт один. К теплу. К саням.' },
    ],
    actions: [
      { id: 'c30_jb3_shout', label: 'Кричать солдатам и отводить раненых от саней', minutes: 20, terminal: true, goto: 'c30_night_end',
        text: 'Солдат с багром успевает. Ты отводишь двоих раненых к костру. Зандер кивает тебе: правильно.', effects: [set30('jb3', 'shout'), { move: 'hof_luedemann' }, until30(31, 3, 50)] },
      { id: 'c30_jb3_cover', label: 'Встать между ним и ранеными', minutes: 20, risky: true, terminal: true, goto: 'c30_night_end',
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты встаёшь. Ноги не держат. Он хватает тебя за щиколотку, и ты падаешь назад, на полозья саней, затылком о железо. Мир становится белым, потом чёрным.\n\nПоследнее, что ты слышишь, — Лея кричит по-немецки, и кто-то стреляет.', effects: [set30('jb3', 'cover'), ...down30] },
          { id: 'ok', check: { traits: ['endurance'], difficulty: 3, uses: ['strength'] }, text: 'Ты встаёшь и не отходишь. Солдат успевает раньше, чем он доползает. Ты садишься прямо в снег, потому что ноги не держат.', effects: [set30('jb3', 'cover'), { move: 'hof_luedemann' }] },
          { id: 'fall', text: 'Ты встаёшь и падаешь на колени. Солдат успевает. Тебя поднимают под руки.', effects: [set30('jb3', 'cover'), { body: 'fatigue', delta: 6 }, { move: 'hof_luedemann' }] },
        ], effects: [until30(31, 3, 50)] },
      { id: 'c30_jb3_fire', label: 'Остаться у костра и греть руки', minutes: 20, terminal: true, goto: 'c30_night_end',
        text: 'Ты сидишь у костра. Кто-то другой отводит раненых. Ты смотришь, как горят покрышки. Руки отходят. Это всё, что ты можешь сейчас.', effects: [set30('jb3', 'fire'), { move: 'hof_luedemann' }, until30(31, 3, 50)] },
    ] }),

  // ═════════════ Солярка (leave + later) ═════════════
  X({ id: 'c30_f_road', title: 'Трактор', camp: tense14, ambient: frost30,
    text: [
      { text: 'В одиннадцать дружина уходит к впадине. Деревня пустая. Трактор Хенрике заводится с третьего раза, дымит на морозе.' },
      { text: 'Хенрике стоит у ворот, кутаясь в шаль.\n\n— Nicht über den Graben. Den kurzen Weg nicht. Der ist Eis.\n\nНе через канаву. Короткой дорогой не надо. Там лёд.' },
    ],
    actions: [
      { id: 'c30_fr_long', label: 'Ехать длинной дорогой, через Йестебург', minutes: 50, terminal: true, outcomes: split('c30_f_a1', 'c30_f_b1'), ambientDuring: frost30,
        text: 'Трактор ползёт по укатанной дороге. Пятьдесят минут холода. Фары выхватывают пустые дворы.', effects: [set30('fr', 'long'), { move: jest }, until30(30, 23, 50)] },
      { id: 'c30_fr_short', label: 'Ехать короткой, полем, через канаву', minutes: 25, risky: true, terminal: true, outcomes: split('c30_f_a1', 'c30_f_b1'), ambientDuring: frost30,
        text: 'Трактор переваливает через канаву, задние колёса скользят, но выезжают. Ты выдыхаешь. Хенрике была права. В этот раз обошлось.', effects: [set30('fr', 'short'), set30('hurt1', true), { body: 'stress', delta: 4 }, { move: jest }, until30(30, 23, 30)] },
    ] }),

  F({ id: 'c30_f_a1', title: 'Бочки', ambient: frost30,
    text: [
      { text: 'Третий грузовик стоит за пожарной частью, под брезентом. Замок на борту сбит давно. Внутри шесть бочек по двести литров. Две пустые.' },
      { text: 'Бочку не поднять. Надо сливать в канистры, шлангом, ртом.' },
      { when: worse1, text: 'Руки ещё дрожат после канавы.' },
    ],
    actions: [
      { id: 'c30_fa1_can', label: 'Сливать медленно, в канистры, ничего не пролить', minutes: 60, terminal: true, goto: 'c30_f_a2',
        text: 'Шланг, канистры, руки в солярке. Сорок литров. Медленно, тихо. Солярка на морозе густая, как мёд.', effects: [set30('fa1', 'can'), w30('diesel_taken', 40), until30(31, 1, 0)] },
      { id: 'c30_fa1_roll', label: 'Скатить целую бочку на прицеп по доскам', minutes: 40, risky: true, terminal: true, goto: 'c30_f_a2',
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 4, uses: ['strength'] }, text: 'Бочка катится по доскам, тяжело, со скрипом. Ты удерживаешь. На прицепе. Двести литров.', effects: [set30('fa1', 'roll'), w30('diesel_taken', 200)] },
          { id: 'slip', text: 'Бочка срывается с досок, катится мимо прицепа, бьётся о колесо. Пробка выскакивает. Ты затыкаешь её телом, пока не находишь тряпку. Солярка на тебе, на руках, в рукавах. {m:Мокрый|Мокрая}. На морозе.', effects: [set30('fa1', 'roll'), w30('diesel_taken', 120), ...hurt1('wet')] },
        ], effects: [until30(31, 0, 40)] },
    ] }),

  F({ id: 'c30_f_a2', title: 'Сторож', ambient: frost30,
    text: [
      { text: 'Со стороны караулки фонарь. Старик-сторож, тот, кого оставили. Он идёт медленно, с ружьём.' },
      { when: worse1, text: 'Одежда в солярке задубела. Тебя трясёт.' },
      { text: '— Wer da?\n\nКто там?' },
    ],
    actions: [
      { id: 'c30_fa2_talk', label: 'Выйти и сказать честно: Людеман-хоф, за соляркой', minutes: 20, terminal: true, goto: 'c30_f_a3',
        text: 'Старик светит тебе в лицо. Долго.\n\n— Lüdemann. Hab ich mir gedacht. Nehmt, was ihr habt, und verschwindet. Ich habe nichts gesehen. Und zwei Kanister lasst ihr mir.\n\nЛюдеман. Так и думал. Берите, что взяли, и исчезайте. Я ничего не видел. И две канистры оставьте мне.', effects: [set30('fa2', 'talk'), w30('diesel_taken', 20), until30(31, 1, 30)] },
      { id: 'c30_fa2_hide', label: 'Спрятаться за грузовиком и ждать', minutes: 30, risky: true, terminal: true, goto: 'c30_f_a3', ambientDuring: frost30,
        outcomes: [
          { id: 'cold', when: worse1, text: 'Ты лежишь в снегу за колесом. Сторож ходит вокруг грузовика двадцать минут. В мокрой одежде тебя бьёт так, что стучат зубы. Он уходит. Ты встаёшь и не чувствуешь ног.', effects: [set30('fa2', 'hide'), ...hurt2] },
          { id: 'ok', text: 'Сторож обходит грузовик, светит под брезент, ничего не видит и уходит. Ты лежишь ещё пять минут, на всякий случай.', effects: [set30('fa2', 'hide')] },
        ], effects: [until30(31, 1, 40)] },
    ] }),

  F({ id: 'c30_f_a3', title: 'Обратно', ambient: frost30,
    text: [
      { text: 'Обратно. Трактор, прицеп, канистры. Хенрике сказала: не через канаву.' },
      { when: worse2, text: 'Руки на руле не держат. Ноги не чувствуют педалей.' },
    ],
    actions: [
      { id: 'c30_fa3_long', label: 'Длинной дорогой, медленно', minutes: 60, terminal: true, goto: 'c30_night_end', ambientDuring: frost30,
        text: 'Час по морозу. Дома Хенрике открывает ворота, не спрашивая. Солярку снимают на руках, в сарай.', effects: [set30('fa3', 'long'), w30('fuel_got', true), { give: 'can_diesel_20', fuel: 20 }, { move: 'hof_luedemann' }, until30(31, 3, 40)] },
      { id: 'c30_fa3_short', label: 'Короткой, через канаву: быстрее в тепло', minutes: 30, risky: true, terminal: true, goto: 'c30_night_end', ambientDuring: frost30,
        outcomes: [
          { id: 'down', when: worse2, text: 'Канава. Трактор кренится. Руки не удерживают руль. Колесо уходит в лёд, прицеп ложится набок, тянет за собой. Ты вылетаешь из кабины лицом в лёд канавы. Чёрная вода, холод, потом ничего.', effects: [set30('fa3', 'short'), w30('tractor', 'ditch'), ...down30] },
          { id: 'ok', check: { traits: ['driving'], difficulty: 4, uses: ['focus'] }, text: 'Трактор переваливает канаву, кренится, выравнивается. Ты дома за двадцать минут.', effects: [set30('fa3', 'short'), w30('fuel_got', true), { give: 'can_diesel_20', fuel: 20 }, { move: 'hof_luedemann' }] },
          { id: 'ditch', text: 'Колесо уходит в лёд. Трактор встаёт косо, прицеп набок. Канистры катятся в канаву. Ты выбираешься из кабины, {m:мокрый|мокрая} по пояс, и идёшь домой пешком. Трактор останется до оттепели.', effects: [set30('fa3', 'short'), w30('tractor', 'ditch'), { body: 'fatigue', delta: 10 }, { move: 'hof_luedemann' }] },
        ], effects: [until30(31, 3, 40)] },
    ] }),

  F({ id: 'c30_f_b1', title: 'Фонарь', ambient: frost30,
    text: [
      { text: 'Ты держишь фонарь, пока {A} возится с бочками. Деревня мёртвая. Только караулка светится.' },
      { text: 'У забора пожарной части стоит один. В белом. Лицом к вам. Почтальон? Нет. Другой.' },
    ],
    actions: [
      { id: 'c30_fb1_watch', label: 'Держать его в луче и предупредить {A.acc}', minutes: 40, terminal: true, goto: 'c30_f_b2', ambientDuring: frost30,
        text: 'Ты светишь на него. Он не двигается. Мороз сделал его медленным. Ты не сводишь луч, пока {A} не заканчивает.', effects: [set30('fb1', 'watch'), until30(31, 0, 50)] },
      { id: 'c30_fb1_noise', label: 'Отвести его подальше, стуча по забору', minutes: 40, risky: true, terminal: true, goto: 'c30_f_b2', ambientDuring: frost30,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 3, uses: ['focus'] }, text: 'Ты стучишь палкой по прутьям и идёшь вдоль забора. Он идёт за звуком. Ты уводишь его за угол и возвращаешься бегом.', effects: [set30('fb1', 'noise')] },
          { id: 'slip', text: 'Ты стучишь и идёшь, и на углу поскальзываешься, падаешь на бок, фонарь катится в сугроб. Он идёт на звук, медленно. Ты находишь фонарь и отбегаешь, хромая.', effects: [set30('fb1', 'noise'), ...hurt1('bruise')] },
        ], effects: [until30(31, 0, 50)] },
    ] }),

  F({ id: 'c30_f_b2', title: 'Сторож', ambient: frost30,
    text: [
      { text: 'Со стороны караулки фонарь. Сторож с ружьём.' },
      { when: worse1, text: 'Бедро болит после падения.' },
    ],
    actions: [
      { id: 'c30_fb2_talk', label: 'Выйти к нему {m:первым|первой} и говорить', minutes: 20, terminal: true, goto: 'c30_f_b3',
        text: 'Старик узнаёт тебя по пункту.\n\n— Die vom Doktor. Gut. Nehmt und geht. Ich habe nichts gesehen.\n\nТа, что у доктора. Ладно. Берите и уходите. Я ничего не видел.', effects: [set30('fb2', 'talk'), until30(31, 1, 30)] },
      { id: 'c30_fb2_run', label: 'Бежать к трактору, предупредить', minutes: 20, risky: true, terminal: true, goto: 'c30_f_b3',
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Ты бежишь. Бедро подводит. Ты падаешь на лёд у колеса, руками вперёд. Ладонь распорота о кромку прицепа. Кровь на снегу. Сторож уже здесь и светит.', effects: [set30('fb2', 'run'), ...hurt2] },
          { id: 'ok', text: 'Ты добегаешь. {A} гасит фонарь. Сторож проходит мимо.', effects: [set30('fb2', 'run')] },
        ], effects: [until30(31, 1, 30)] },
    ] }),

  F({ id: 'c30_f_b3', title: 'Обратно', ambient: frost30,
    text: [
      { text: 'Обратно. Ты в прицепе, среди канистр. Трактор трясёт.' },
      { when: worse2, text: 'Рука в крови. Перед глазами плывёт.' },
    ],
    actions: [
      { id: 'c30_fb3_hold', label: 'Держаться и держать канистры', minutes: 60, terminal: true, goto: 'c30_night_end', ambientDuring: frost30,
        text: 'Ты держишься. Канистры бьются о борт. Дома Хенрике снимает тебя с прицепа, как ребёнка.', effects: [set30('fb3', 'hold'), { move: 'hof_luedemann' }, until30(31, 3, 40)] },
      { id: 'c30_fb3_stand', label: 'Встать в прицепе и светить дорогу', minutes: 60, risky: true, terminal: true, goto: 'c30_night_end', ambientDuring: frost30,
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты встаёшь. На повороте прицеп кренится. Ноги не держат. Ты вылетаешь через борт, головой о мёрзлую землю. Потом тишина.', effects: [set30('fb3', 'stand'), ...down30] },
          { id: 'ok', text: 'Ты стоишь, держась за борт, и светишь. Дорога видна. Дома через сорок минут.', effects: [set30('fb3', 'stand'), { move: 'hof_luedemann' }] },
        ], effects: [until30(31, 3, 40)] },
    ] }),

  // ═════════════ Свой край (guard / leave) ═════════════
  X({ id: 'c30_h_post', title: 'Пост', camp: tense14, ambient: frost30,
    text: [
      { when: guardHome, text: 'В одиннадцать вы на краю поля у насыпи. Яннес, Уте, двое из колонии. Костёр в бочке. Ручей замёрз, по льду можно пройти до самых дворов.' },
      { when: not(guardHome), text: 'В одиннадцать вы у ворот. Свет погашен. Над Гарльсторфом зарево: дружина подожгла солому.' },
      { text: 'Уте, если она здесь, или Хенрике у ворот:\n\n— Keiner geht allein aufs Eis. Hört ihr? Keiner.\n\nНикто не ходит по льду один. Слышите? Никто.' },
    ],
    actions: [
      { id: 'c30_hp_go', label: 'Занять места', minutes: 60, terminal: true, outcomes: split('c30_h_a1', 'c30_h_b1'), ambientDuring: frost30,
        text: 'Час проходит в тишине. Мороз. Звёзды. Зарево над лесом. Потом на льду ручья появляются фигуры.', effects: [set30('hp', 'go'), until30(31, 0, 0)] },
    ] }),

  X({ id: 'c30_h_a1', title: 'Лёд ручья', ambient: frost30,
    text: [
      { text: 'По льду ручья идут трое. Медленно, спотыкаясь. Их выгнали с впадины, и они идут к теплу: к вашим окнам, к дыму из трубы.' },
      { text: 'Яннес рядом с багром: — Nicht aufs Eis. Am Ufer bleiben.\n\nНе на лёд. Оставаться на берегу.' },
    ],
    actions: [
      { id: 'c30_ha1_bank', label: 'Ждать на берегу с вилами', minutes: 40, terminal: true, goto: 'c30_h_a2', ambientDuring: frost30,
        text: 'Ты стоишь на берегу. Они подходят. Яннес и ты отталкиваете первого обратно на лёд. Он падает и не встаёт. Мороз.', effects: [set30('ha1', 'bank'), until30(31, 0, 40)] },
      { id: 'c30_ha1_ice', label: 'Выйти на лёд навстречу, пока они далеко', minutes: 30, risky: true, terminal: true, goto: 'c30_h_a2', ambientDuring: frostWet30,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Лёд держит. Ты встречаешь первого вилами на середине ручья и возвращаешься, пока двое других далеко.', effects: [set30('ha1', 'ice')] },
          { id: 'wet', text: 'Лёд трещит у берега. Ты проваливаешься по колено. Выдёргиваешь ногу, мокрую, тяжёлую. Возвращаешься на берег. Через минуту штанина звенит, как жесть.', effects: [set30('ha1', 'ice'), ...hurt1('wet')] },
        ], effects: [until30(31, 0, 30)] },
      { id: 'c30_ha1_dry', label: 'Переобуться в сухое, пока есть минута', when: dry, minutes: 20, terminal: true, goto: 'c30_h_a2',
        text: 'Ты меняешь носки у костра. Ноги снова чувствуют землю. Яннес смотрит и кивает: правильно.', effects: [set30('ha1', 'dry'), until30(31, 0, 20)] },
    ] }),

  X({ id: 'c30_h_a2', title: 'Двое', ambient: frost30,
    text: [
      { text: 'Двое оставшихся выходят на берег у колонии. Один идёт к домику Уте, на свет свечи.' },
      { when: worse1, text: 'Нога в мокром. Ты почти не чувствуешь пальцев.' },
    ],
    actions: [
      { id: 'c30_ha2_group', label: 'Идти втроём, с Яннесом и мужиком из колонии', minutes: 30, terminal: true, goto: 'c30_h_a3',
        text: 'Втроём вы отталкиваете его от домика. Он падает в снег и больше не поднимается.', effects: [set30('ha2', 'group'), until30(31, 1, 20)] },
      { id: 'c30_ha2_alone', label: 'Бежать к домику одному: так быстрее', minutes: 30, risky: true, terminal: true, goto: 'c30_h_a3',
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Ты бежишь. Нога в мокром не слушается. Ты падаешь у самого крыльца, руками на лёд. Ладонь распорота. Он оборачивается на тебя. Яннес успевает.', effects: [set30('ha2', 'alone'), ...hurt2] },
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['strength'] }, text: 'Ты добегаешь {m:первым|первой} и сбиваешь его с ног вилами. Яннес подбегает следом.', effects: [set30('ha2', 'alone')] },
          { id: 'hurt2', text: 'Ты добегаешь, но он разворачивается к тебе. Ты отшатываешься и падаешь на ледяные ступени. Ладонь распорота. Яннес успевает.', effects: [set30('ha2', 'alone'), ...hurt2] },
        ], effects: [until30(31, 1, 20)] },
    ] }),

  X({ id: 'c30_h_a3', title: 'Последний', ambient: frost30,
    text: [
      { text: 'Около двух на лёд выходит ещё один. Дальше, у моста. Идёт к дворам на той стороне.' },
      { when: worse2, text: 'Рука в крови, замёрзшей коркой. Голова плывёт. Тебя трясёт.' },
    ],
    actions: [
      { id: 'c30_ha3_stay', label: 'Остаться у костра: он идёт не сюда', minutes: 60, terminal: true, goto: 'c30_night_end',
        text: 'Ты сидишь у костра. Он уходит по льду к мосту, к тем дворам. Что там — не твоё. Яннес не смотрит на тебя.', effects: [set30('ha3', 'stay'), until30(31, 3, 40)] },
      { id: 'c30_ha3_ice', label: 'Пойти за ним по льду к мосту', minutes: 40, risky: true, terminal: true, goto: 'c30_night_end', ambientDuring: frostWet30,
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты идёшь по льду. Раненая рука, мокрые ноги. На середине лёд проламывается. Ты уходишь в чёрную воду по грудь, бьёшься головой о кромку. Холод. Потом ничего.', effects: [set30('ha3', 'ice'), ...down30] },
          { id: 'ok', check: { traits: ['endurance'], difficulty: 4, uses: ['mobility'] }, text: 'Ты догоняешь его у моста. Вилы. Он падает. Ты возвращаешься по берегу, не по льду.', effects: [set30('ha3', 'ice')] },
          { id: 'wet', text: 'Лёд трещит. Ты отступаешь к берегу, {m:мокрый|мокрая} по колено. Он уходит. Ты возвращаешься к костру.', effects: [set30('ha3', 'ice'), { body: 'fatigue', delta: 8 }] },
        ], effects: [until30(31, 3, 40)] },
      { id: 'c30_ha3_flare', label: 'Выпустить ракету: пусть на той стороне знают', when: { has: 'c20_flare' }, minutes: 20, terminal: true, goto: 'c30_night_end',
        text: 'Красный свет над ручьём. На той стороне зажигаются окна. Кто-то выходит с фонарём. Его встретят.', effects: [set30('ha3', 'flare'), { take: 'c20_flare' }, w30('flare_used', true), until30(31, 3, 40)] },
    ] }),

  X({ id: 'c30_h_b1', title: 'Двор Уте', ambient: frost30,
    text: [
      { text: 'Ты у домика Уте, в колонии, с Ниной и Уте. Или у ворот хутора с Хенрике. Свеча в окне. Внутри тепло, это видно по пару из трубы.' },
      { text: 'Уте: — Die Kerze aus. Licht ruft sie.\n\nСвечу погасить. Свет их зовёт.' },
    ],
    actions: [
      { id: 'c30_hb1_dark', label: 'Погасить свет и ждать в темноте', minutes: 60, terminal: true, goto: 'c30_h_b2',
        text: 'Темнота. Холод. Ты слышишь, как по льду ручья шаркают шаги. Мимо. Ещё мимо.', effects: [set30('hb1', 'dark'), until30(31, 0, 40)] },
      { id: 'c30_hb1_out', label: 'Выйти на крыльцо посмотреть', minutes: 40, risky: true, terminal: true, goto: 'c30_h_b2', ambientDuring: frost30,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 3, uses: ['focus'] }, text: 'Ты стоишь на крыльце, в тени. Видно лёд ручья и троих на нём. Они идут не сюда.', effects: [set30('hb1', 'out')] },
          { id: 'slip', text: 'Крыльцо обледенело. Ты поскальзываешься и падаешь со ступеней в снег. Бок, бедро. Встаёшь, хромая.', effects: [set30('hb1', 'out'), ...hurt1('bruise')] },
        ], effects: [until30(31, 0, 30)] },
    ] }),

  X({ id: 'c30_h_b2', title: 'Стук', ambient: frost30,
    text: [
      { text: 'Около часу в дверь стучат. Не рукой: всем телом, медленно, как волна.' },
      { when: worse1, text: 'Бедро ноет после падения.' },
    ],
    actions: [
      { id: 'c30_hb2_brace', label: 'Подпереть дверь столом и ждать', minutes: 30, terminal: true, goto: 'c30_h_b3',
        text: 'Вы с Уте двигаете стол. Стук продолжается. Потом слабеет. Потом шаги уходят.', effects: [set30('hb2', 'brace'), until30(31, 1, 20)] },
      { id: 'c30_hb2_window', label: 'Выглянуть в окно с фонарём', minutes: 30, risky: true, terminal: true, goto: 'c30_h_b3',
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Ты светишь. Стекло лопается, рука в проёме. Ты дёргаешься назад, бедро подводит, и падаешь на осколки. Ладонь распорота. Уте закрывает ставню.', effects: [set30('hb2', 'window'), ...hurt2] },
          { id: 'ok', text: 'Ты светишь. Он у двери, спиной. Отходит на свет фонаря, медленно, и ты уводишь луч в сторону. Он идёт за лучом.', effects: [set30('hb2', 'window')] },
        ], effects: [until30(31, 1, 20)] },
    ] }),

  X({ id: 'c30_h_b3', title: 'До рассвета', ambient: frost30,
    text: [
      { text: 'Около двух тишина. Потом крик со стороны насыпи: голос Яннеса или {A.gen}.' },
      { when: worse2, text: 'Рука в крови. Голова плывёт.' },
    ],
    actions: [
      { id: 'c30_hb3_wait', label: 'Остаться внутри с Ниной и Уте', minutes: 60, terminal: true, goto: 'c30_night_end',
        text: 'Ты остаёшься. Нина держит тебя за руку. Через полчаса стучат, но по-человечески: три раза, пауза. Свои.', effects: [set30('hb3', 'wait'), until30(31, 3, 40)] },
      { id: 'c30_hb3_run', label: 'Бежать на крик через двор', minutes: 30, risky: true, terminal: true, goto: 'c30_night_end', ambientDuring: frost30,
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты бежишь через двор в темноте. Нога уходит на льду. Ты падаешь головой на край колодезного сруба. Всё белое. Потом чёрное.', effects: [set30('hb3', 'run'), ...down30] },
          { id: 'ok', text: 'Ты добегаешь до насыпи. Там всё уже кончилось. Яннес сидит в снегу и смеётся, задыхаясь.', effects: [set30('hb3', 'run')] },
        ], effects: [until30(31, 3, 40)] },
    ] }),
];

