import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm } from './point18';
import { npc } from './point19';
import { parents39 } from './point39';
import {
  S40, alarm40, barnSafe40, hurt1, hurt2, merle40, set40, strangers40, thaw40, torch40, until40, w40, worse1, worse2, down40, henrike40,
} from './point40';

// Участок 40, линия B: вторник (сарай, Мерле, дом к ночи, Гердесы) и ночь в доме и во дворе. Цепочка: одна в хлев/сарай с лампой →
// держать дверь → бежать в тёмный двор (за Мерле со спутанным сахаром, или за Ниной к корове). Предупреждения: Хенрике («никто один»),
// потом мужчины в доме («не выходи!»). Осторожный путь есть всегда; его цена — корова или чья-то рана.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S40({ ...scene, for: 'any', chapter: 'ch3' });
const snack: Cond = flag('$.c40_snack');
const cowSafe: Cond = flag('$.c40_cow_secured');
const barnBoarded: Cond = any(barnSafe40, flag('w.c40_barn_boarded'));

export const day40BScenes: Scene[] = [
  // ═════════════ Вторник ═════════════
  X({ id: 'c40_b_barn', title: 'Сарай и хлев', camp: yard14, ambient: thaw40,
    text: [
      { text: 'Утро. Дождь. В хлеву по щиколотку воды: течёт под дверь с поля. Корова стоит в жиже и мычит.' },
      { when: strangers40, text: 'В сарае Йорг собирает детей: перевести бы их в дом на ночь. Девочке лучше, но кашель остался.' },
    ],
    actions: [
      { id: 'c40_bb_cow', label: 'Вывести корову на сухое место в сарае', minutes: 75, activity: 'moderate', terminal: true, goto: 'c40_b_merle', ambientDuring: thaw40,
        text: 'Корова упирается, потом идёт. Сарай тесный, но сухой. Ты устраиваешь её в углу на соломе, ставишь ведро воды. Здесь дверь крепче, чем в хлеву.', effects: [set40('bb', 'cow'), set40('cow_secured', true), until40(45, 9, 0)] },
      { id: 'c40_bb_kids', label: 'Перевести детей Йорга в дом сейчас, не ночью', when: strangers40, minutes: 60, terminal: true, goto: 'c40_b_merle',
        text: 'Дети в кухне, на лавке у печи. Йорг упирается: он с топором в сарае, где мешки. Пусть. Дети в доме, это главное. Хенрике ставит им молоко.', effects: [set40('bb', 'kids'), w40('strangers_kid', 'safe'), until40(45, 9, 0)] },
      { id: 'c40_bb_bail', label: 'Отчерпать воду из хлева', minutes: 75, activity: 'heavy', terminal: true, goto: 'c40_b_merle', ambientDuring: thaw40,
        text: 'Ведро за ведром, через порог. Вода прибывает почти так же быстро, как ты черпаешь. К девяти её по щиколотку меньше. Корова смотрит на тебя с благодарностью или кажется.', effects: [set40('bb', 'bail'), { body: 'fatigue', delta: 10 }, until40(45, 9, 0)] },
    ] }),

  X({ id: 'c40_b_merle', title: 'Сахар', camp: kitchen14,
    text: [
      { when: merle40, text: 'Мерле бледная. Ночью у неё упал сахар: проснулась в поту, руки тряслись. Съела два куска сахара и уснула. Утром говорит об этом, как о погоде.' },
      { when: all(not(merle40), ninaFarm), text: 'Нина не может усидеть на месте. Каждые полчаса бегает к окну смотреть на ручей и на сарай с коровой.' },
      { when: all(not(merle40), not(ninaFarm)), text: 'Хенрике раскладывает по дому свечи и спички: в каждую комнату, в каждый карман.' },
    ],
    actions: [
      { id: 'c40_bm_snack', label: 'Договориться с Мерле: на ночь — еда и сахар у кровати, будить, если что', when: merle40, minutes: 60, terminal: true, goto: 'c40_b_house',
        text: 'Хлеб с маслом на ночь, сахар в кармане, стакан сока на табурете. Мерле закатывает глаза: «Wie im Kindergarten». Как в детском саду. Но соглашается. И просит будить её, если она будет странной.', effects: [set40('bm', 'snack'), set40('snack', true), until40(45, 10, 30)] },
      { id: 'c40_bm_dose', label: 'Уменьшить с ней вечернюю дозу: ночь будет тяжёлая', when: merle40, minutes: 60, terminal: true, goto: 'c40_b_house',
        text: 'Мерле считает, ты проверяешь. Чуть меньше на ночь, чуть больше еды. «Wenn ich morgen hoch bin, ist es deine Schuld». Если завтра сахар будет высокий, это ты виновата. Она улыбается.', effects: [set40('bm', 'dose'), set40('snack', true), until40(45, 10, 30)] },
      { id: 'c40_bm_nina', label: 'Дать Нине дело: следить за свечами и спичками в доме', when: not(merle40), minutes: 60, terminal: true, goto: 'c40_b_house',
        text: 'Нина раскладывает свечи по комнатам и в каждой проверяет спички. Серьёзная, как часовой. Когда она занята, она не бегает к окну.', effects: [set40('bm', 'nina'), w40('nina_busy', true), until40(45, 10, 30)] },
    ] }),

  X({ id: 'c40_b_house', title: 'Дом к ночи', camp: kitchen14,
    text: [
      { text: 'Хенрике говорит: ночью все в кухне и в двух комнатах рядом. Наверх не ходить: с лестницы не убежать.' },
      { when: parents39, text: 'Уве уже снял с петель дверь кладовки, чтобы ею подпереть кухонное окно.' },
    ],
    actions: [
      { id: 'c40_bh_barricade', label: 'Заколотить окна первого этажа досками', minutes: 90, activity: 'heavy', terminal: true, goto: 'c40_tue_noon',
        text: 'Доски от сарая, гвозди, молоток. Кухня становится тёмной, как погреб, только щели светятся. Зато в окно теперь не влезть.', effects: [set40('bh', 'barricade'), w40('house_boarded', true), { body: 'fatigue', delta: 8 }, until40(45, 12, 0)] },
      { id: 'c40_bh_beds', label: 'Перенести постели вниз, детей — в комнату без окон', minutes: 75, activity: 'moderate', terminal: true, goto: 'c40_tue_noon',
        text: 'Матрасы по лестнице, одеяла охапками. Дети в кладовке за кухней: там нет окна. Нина говорит, что она не ребёнок, и ложится у двери кладовки, с другой стороны.', effects: [set40('bh', 'beds'), w40('kids_safe', true), until40(45, 12, 0)] },
      { id: 'c40_bh_med', label: 'Разложить аптечку на столе в кухне: бинты, жгут, вода', minutes: 60, terminal: true, goto: 'c40_tue_noon',
        text: 'Бинты, жгут, антисептик, ножницы, чистые полотенца стопкой. Хенрике смотрит на стол и крестится. Ты не говоришь ничего. Лучше, чтобы не понадобилось.', effects: [set40('bh', 'med'), w40('kit_ready', true), until40(45, 12, 0)] },
    ] }),

  X({ id: 'c40_b_neighbor', title: 'Гердесы', camp: yard14, safe: false, ambient: thaw40,
    text: [
      { when: not(flag('w.c40_gerdes_moved')), text: 'После обеда ты думаешь о Гердесах на насыпи. Старик лежачий. Фрау Гердес одна. Брандт сказал: у них дыра.' },
      { when: flag('w.c40_gerdes_moved'), text: 'Старик Гердес лежит в комнате стариков, укрытый двумя одеялами. Фрау Гердес сидит рядом с вязаньем и не вяжет.' },
      { text: 'По полю к насыпи — пятнадцать минут по мокрому снегу.' },
    ],
    actions: [
      { id: 'c40_bn_move', label: 'Пойти к ним с санями и перевезти к вам до темноты', when: not(flag('w.c40_gerdes_moved')), minutes: 120, activity: 'heavy', risky: true, terminal: true, goto: 'c40_dusk', ambientDuring: thaw40,
        outcomes: [
          { id: 'ok', check: { traits: ['endurance', 'strength'], difficulty: 3, uses: ['mobility'] },
            text: 'Сани по мокрому снегу тянуть тяжело, вдвоём с Йоргом, Денизом или кто пошёл. Старика укладываете на сани, укрываете клеёнкой от дождя. К четырём он у вас, в комнате стариков. Фрау Гердес целует тебе руки.',
            effects: [set40('bn', 'move'), w40('gerdes_moved', true), { body: 'fatigue', delta: 12 }, until40(45, 16, 0)] },
          { id: 'mud',
            text: 'На полпути сани вязнут в раскисшей колее, ты падаешь в грязь лицом. Встаёшь, тянешь дальше. Старика довозите, но ты {m:мокрый|мокрая} до нитки и колено разбито о полоз.',
            effects: [set40('bn', 'move'), w40('gerdes_moved', true), { injure: 'bruise', site: 'rightLeg', severity: 1 }, { body: 'fatigue', delta: 12 }, until40(45, 16, 0)] },
        ] },
      { id: 'c40_bn_warn', label: 'Сходить предупредить: на ночь — в погреб, люк закрыть', when: not(flag('w.c40_gerdes_moved')), minutes: 75, terminal: true, goto: 'c40_dusk', ambientDuring: thaw40,
        text: 'Фрау Гердес слушает и кивает. Погреб у них есть, глубокий, с тяжёлым люком. Старика туда на руках не спустить. Вы спускаете его на одеяле, вчетвером, с соседским парнем.', effects: [set40('bn', 'warn'), w40('warned', true), until40(45, 15, 30)] },
      { id: 'c40_bn_sit', label: 'Посидеть со стариком Гердесом, пока фрау Гердес отдыхает', when: flag('w.c40_gerdes_moved'), minutes: 75, terminal: true, goto: 'c40_dusk',
        text: 'Старик говорит невнятно, после удара. Ты разбираешь: он был путевым обходчиком на этой линии. Он смеётся, когда ты отвечаешь по-немецки с акцентом. Фрау Гердес спит в кресле час. Первый раз за неделю, говорит она потом.', effects: [set40('bn', 'sit'), until40(45, 15, 30)] },
      { id: 'c40_bn_skip', label: 'Не идти: своих надо готовить', when: not(flag('w.c40_gerdes_moved')), minutes: 45, terminal: true, goto: 'c40_dusk',
        text: 'Ты остаёшься. Дел в доме много. Ты не думаешь о Гердесах до самого вечера. Почти.', effects: [set40('bn', 'skip'), until40(45, 15, 0)] },
    ] }),

  // ═════════════ Ночь ═════════════
  X({ id: 'c40_b_n1', title: 'Хлев', camp: kitchen14, onEnter: [until40(45, 20, 0)],
    text: [
      { text: 'Восемь вечера. Кухня, одна лампа, прикрученная до огонька. Все одетые. Дождь по ставням.' },
      { when: henrike40, text: 'Хенрике сидит у двери на табурете, с кочергой на коленях. Говорит, ни на кого не глядя: «Keiner geht allein raus. Keiner». Никто не выходит один. Никто.' },
      { when: alarm40, text: 'Около девяти со стороны ручья гремят банки на проволоке. Потом снова.' },
      { when: not(cowSafe), text: 'Из хлева мычит корова. Громко, не переставая.' },
      { when: all(strangers40, not(flag('w.c40_strangers_kid'))), text: 'Йорг с детьми всё ещё в сарае. Ты видишь в щель ставни: у сарая свет фонаря.' },
    ],
    actions: [
      { id: 'c40_bn1_call', label: 'Позвать мужчин: пусть идут двое, с фонарём', minutes: 60, terminal: true, goto: 'c40_b_n2',
        text: 'Ты будишь Уве, Дениза или Йорга. Двое уходят с фонарём и ломом. Через двадцать минут возвращаются: дети в доме, хлев на засове. Корову не вывели: не успели.', effects: [set40('bn1', 'call'), w40('strangers_kid', 'safe'), until40(45, 22, 0)] },
      { id: 'c40_bn1_go', label: 'Выйти с лампой: забрать детей из сарая или закрыть хлев', minutes: 60, risky: true, terminal: true, goto: 'c40_b_n2', ambientDuring: thaw40,
        outcomes: [
          { id: 'ok', when: torch40, check: { traits: ['agility'], difficulty: 3, uses: ['focus'] },
            text: 'Ты бежишь через двор, светя под ноги. Дверь хлева на засов, корову — в сарай к Йоргу; детей — на руки, в дом. Дверь, засов. Ты стоишь в кухне, {m:мокрый|мокрая} насквозь, и не можешь отдышаться.',
            effects: [set40('bn1', 'go'), set40('cow_secured', true), w40('strangers_kid', 'safe'), until40(45, 22, 0)] },
          { id: 'slip',
            text: 'Лампа гаснет под дождём на полпути. В темноте ты падаешь в жижу у колодца, колено о камень. Встаёшь, на ощупь до сарая. Детей ты всё-таки уводишь в дом. Колено распухает. До хлева ты не {m:дошёл|дошла}.',
            effects: [set40('bn1', 'go'), w40('strangers_kid', 'safe'), ...hurt1('bruise'), until40(45, 22, 0)] },
        ] },
      { id: 'c40_bn1_watch', label: 'Остаться у окна и смотреть в щель', minutes: 60, terminal: true, goto: 'c40_b_n2',
        text: 'Ты смотришь в щель ставни. Дождь, темнота, фонарь у сарая. Потом фонарь гаснет. Ты считаешь удары сердца.', effects: [set40('bn1', 'watch'), until40(45, 22, 0)] },
    ] }),

  X({ id: 'c40_b_n2', title: 'Дверь', camp: kitchen14,
    text: [
      { text: 'Десять. В дверь кухни стучат. Не кулаком. Телом. Медленно, раз за разом. Ручка дёргается.' },
      { when: flag('w.c40_house_boarded'), text: 'Окна забиты, через них не войти. Остаётся дверь.' },
      { when: worse1, text: 'Колено не сгибается. Ты стоишь, перенеся вес на другую ногу.' },
      { when: parents39, text: 'Уве кричит от окна: «Bleib weg von der Tür!» Отойди от двери!' },
      { when: not(parents39), text: 'Кто-то из мужчин кричит: «Bleib drin! Weg von der Tür!» Не выходи! Отойди от двери!' },
    ],
    actions: [
      { id: 'c40_bn2_table', label: 'Подпереть дверь столом и лавкой и отойти', minutes: 45, terminal: true, goto: 'c40_b_n3',
        text: 'Стол, лавка, сундук. Дверь вздрагивает, но держит. Все отходят к печи. Удары продолжаются полчаса. Потом тихо. Потом снова. Потом совсем тихо.', effects: [set40('bn2', 'table'), w40('door_held', true), until40(46, 0, 30)] },
      { id: 'c40_bn2_hold', label: 'Держать дверь плечом вместе с Хенрике', minutes: 45, risky: true, terminal: true, goto: 'c40_b_n3',
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Колено подламывается, ты падаешь у двери. Дверь приоткрывается на ладонь, в щель лезет рука, хватает тебя за рукав и тянет. Ты рвёшься назад, и ногти на чужих пальцах распарывают тебе руку от локтя. Уве захлопывает дверь. Кровь на полу.', effects: [set40('bn2', 'hold'), ...hurt2, until40(46, 0, 30)] },
          { id: 'ok', check: { traits: ['strength', 'endurance'], difficulty: 4, uses: ['strength'] }, text: 'Плечом в дверь, Хенрике рядом, Уве или Дениз за спиной. Дверь вздрагивает от каждого удара, но держит. Через полчаса снаружи тихо.', effects: [set40('bn2', 'hold'), w40('door_held', true)] },
          { id: 'hurt2', text: 'Дверь дёргается, щель, рука. Тебя тянут за рукав, ты рвёшься, рукав трещит, ногти распарывают кожу. Дверь захлопывают за тебя. Кровь.', effects: [set40('bn2', 'hold'), ...hurt2] },
        ], effects: [until40(46, 0, 30)] },
      { id: 'c40_bn2_kids', label: 'Увести детей в кладовку и сидеть с ними', minutes: 45, terminal: true, goto: 'c40_b_n3',
        text: 'Кладовка без окон, темно, пахнет яблоками. Ты сидишь на мешке, дети прижимаются к тебе с двух сторон. Ты тихо рассказываешь им что-то, {m:сам|сама} не помнишь что. Удары в дверь кухни слышны и здесь.', effects: [set40('bn2', 'kids'), w40('kids_calm', true), until40(46, 0, 30)] },
    ] }),

  X({ id: 'c40_b_n3', title: 'Во двор', camp: kitchen14,
    text: [
      { when: all(merle40, not(snack)), text: 'Полночь. Мерле встаёт с лавки, бледная, в поту, с пустыми глазами. Говорит что-то невнятное про автобус и идёт к задней двери. Сахар. Она не понимает, где она. Дверь открыта прежде, чем кто-то успевает встать.' },
      { when: any(not(merle40), snack), text: 'Полночь. Нина вскакивает: «Die Kuh!» Корова! Из сарая или хлева — страшный рёв. Нина бросается к задней двери и выбегает во двор раньше, чем кто-то успевает её схватить.' },
      { when: worse2, text: 'Рука в крови, полотенце намокло. Перед глазами плывёт.' },
      { text: 'Во дворе темно, грязь, дождь. Где-то у забора — они.' },
    ],
    actions: [
      { id: 'c40_bn3_sugar', label: 'Схватить сахар и лампу и выйти не одной: позвать с собой', minutes: 30, terminal: true, goto: 'c40_b_after', ambientDuring: thaw40,
        text: 'Ты хватаешь кулёк сахара, лампу, кричишь, и кто-то выходит с тобой. Вдвоём, спиной к спине, до колодца. Ты суёшь ей в рот сахар, её уводят в дом. Засов. Целы.', effects: [set40('bn3', 'sugar'), w40('runner_saved', true), until40(46, 2, 30)] },
      { id: 'c40_bn3_run', label: 'Бежать за ней в темноту', minutes: 30, risky: true, terminal: true, goto: 'c40_b_after', ambientDuring: thaw40,
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты выбегаешь. Ноги разъезжаются в грязи. Раненая рука не успевает. Ты падаешь, затылком о ступеньку крыльца. Белая вспышка. Потом ничего.\n\nПоследнее, что ты слышишь, — Хенрике кричит твоё имя.', effects: [set40('bn3', 'run'), ...down40] },
          { id: 'ok', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] }, text: 'Ты догоняешь её у колодца и хватаешь за куртку. Тянешь назад, к двери. У забора кто-то идёт к вам, медленно. Вы влетаете в кухню, засов. Все целы.', effects: [set40('bn3', 'run'), w40('runner_saved', true)] },
          { id: 'slip', text: 'Ты падаешь у крыльца, встаёшь, бежишь. Её уже держит Йорг или Дениз, выскочивший следом. Вы втроём заваливаетесь в кухню. Ты {m:весь|вся} в грязи, колени ободраны.', effects: [set40('bn3', 'run'), w40('runner_saved', true), { body: 'fatigue', delta: 6 }] },
        ], effects: [until40(46, 2, 30)] },
      { id: 'c40_bn3_stay', label: 'Кричать ей с порога и не выходить', minutes: 30, terminal: true, goto: 'c40_b_after',
        text: 'Ты кричишь с порога. Хенрике отталкивает тебя и выбегает сама, в одном платке, с кочергой. Она приводит её назад. На крыльце Хенрике поскальзывается и падает на руку. Запястье распухает на глазах.', effects: [set40('bn3', 'stay'), w40('henrike_hurt', true), npc('henrike', -1, 'c40_stayed_inside'), until40(46, 2, 30)] },
    ] }),

  X({ id: 'c40_b_after', title: 'К утру', camp: kitchen14,
    text: [
      { text: 'Половина третьего. Удары в дверь кончились. Колокол у пожарной части бьёт три долгих удара: отбой.' },
      { when: worse2, text: 'Рука перевязана. Кровь всё ещё проступает сквозь бинт. Ты сидишь у печи и не можешь согреться.' },
    ],
    actions: [
      { id: 'c40_ba_treat', label: 'Перевязать всех, кто поранился', minutes: 60, terminal: true, goto: 'c40_night_end',
        text: 'Царапины, ушибы, чьё-то разбитое колено. Ты промываешь, мажешь, перевязываешь. Руки работают сами. Это лучше, чем сидеть.', effects: [set40('ba', 'treat'), { if: { not: barnBoarded }, then: [{ if: { not: cowSafe }, then: [w40('cow', 'lost')] }] }, until40(46, 5, 0)] },
      { id: 'c40_ba_kids', label: 'Уложить детей и сесть рядом', minutes: 60, terminal: true, goto: 'c40_night_end',
        text: 'Дети засыпают, как только перестаёт стучать. Ты сидишь рядом и смотришь на дверь, пока не начинает светать.', effects: [set40('ba', 'kids'), { if: { not: barnBoarded }, then: [{ if: { not: cowSafe }, then: [w40('cow', 'lost')] }] }, until40(46, 5, 0)] },
      { id: 'c40_ba_sleep', label: 'Уснуть сидя у печи', minutes: 60, terminal: true, goto: 'c40_night_end',
        text: 'Ты закрываешь глаза на минуту и открываешь, когда в щели ставен уже серо.', effects: [set40('ba', 'sleep'), { body: 'fatigue', delta: -6 }, { if: { not: barnBoarded }, then: [{ if: { not: cowSafe }, then: [w40('cow', 'lost')] }] }, until40(46, 5, 0)] },
    ] }),
];

