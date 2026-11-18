import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import { brothersCome, oleHome33 } from './point33';
import { tractorRuns } from './point38';
import {
  S40, alarm40, fence40, flares40, guardAll40, hurt1, hurt2, set40, strangers40, thaw40, torch40, until40, w40, watchSeeve40,
  worse1, worse2, down40,
} from './point40';

// Участок 40, линия A: вторник (вода во дворе, Брандт, снаряжение, Зеве днём) и ночь оттепели снаружи — пост у Зеве или забор
// хутора. Цепочка: один к воде без света → один у забора / бежать к Ханзенам в темноте → через двор в темноте. Предупреждения:
// напарник на посту («не ходи один к воде»), потом крик «к дому!». Осторожный путь есть всегда и стоит своего.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S40({ ...scene, for: 'any', chapter: 'ch3' });
const rope = flag('$.c40_rope');
const mate = oleHome33;
const gap = not(flag('w.c40_gerdes_moved'));

export const day40AScenes: Scene[] = [
  // ═════════════ Вторник ═════════════
  X({ id: 'c40_a_mud', title: 'Вода во дворе', camp: yard14, safe: false, ambient: thaw40,
    text: [
      { text: 'К семи двор превращается в пруд. Вода с поля идёт к хлеву, под дверь. Снег на глазах становится серой кашей.' },
      { when: tractorRuns, text: 'Трактор стоит у сарая. Колёса уже наполовину в жиже.' },
    ],
    actions: [
      { id: 'c40_am_ditch', label: 'Прокопать канаву от хлева к полю', minutes: 120, activity: 'heavy', risky: true, terminal: true, goto: 'c40_a_brandt', ambientDuring: thaw40,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'endurance'], difficulty: 3, uses: ['mobility'] },
            text: 'Лопата, мокрый снег, мёрзлая земля под ним. Через два часа вода уходит из-под двери хлева в канаву и дальше, в поле. Ты {m:мокрый|мокрая} насквозь, но хлев сухой.',
            effects: [set40('am', 'ditch'), w40('drain', true), { body: 'fatigue', delta: 12 }, until40(45, 9, 0)] },
          { id: 'back',
            text: 'На втором часу лопата упирается в камень, ты дёргаешь, и в пояснице что-то стреляет. Канаву докапывают без тебя. Ты стоишь, держась за забор, и не можешь разогнуться.',
            effects: [set40('am', 'back'), w40('drain', true), { injure: 'sprain', site: 'torso', severity: 1 }, { body: 'stress', delta: 4 }, until40(45, 9, 0)] },
        ] },
      { id: 'c40_am_tractor', label: 'Отогнать трактор на сухое, пока не засосало', when: tractorRuns, minutes: 60, terminal: true, goto: 'c40_a_brandt', ambientDuring: thaw40,
        text: 'Мотор заводится со второго раза. Колёса буксуют, жижа летит до окон, но трактор выползает на бугор за сараем. Там он и простоит до сухой погоды.', effects: [set40('am', 'tractor'), w40('tractor_safe', true), until40(45, 9, 0)] },
      { id: 'c40_am_sand', label: 'Положить мешки с песком у двери хлева', minutes: 90, activity: 'heavy', terminal: true, goto: 'c40_a_brandt', ambientDuring: thaw40,
        text: 'Песок из кучи у сарая, мешки, какие есть. Вал у двери хлева по колено. Вода обходит его и уходит вдоль стены.', effects: [set40('am', 'sand'), w40('barn_sandbags', true), { body: 'fatigue', delta: 8 }, until40(45, 9, 0)] },
    ] }),

  X({ id: 'c40_a_brandt', title: 'Брандт под дождём', camp: yard14, ambient: thaw40,
    text: [
      { text: 'В девять у ворот джип пожарной части. Брандт в плащ-палатке, вода течёт с капюшона.' },
      { when: v('w.c26_brandt', 'ally'), text: 'Он выходит из машины и жмёт тебе руку. Мокрую, грязную. Не замечает.' },
      { when: v('w.c26_brandt', 'hostile'), text: 'Он не выходит. Говорит через опущенное стекло, коротко.' },
      { text: '— Heute Nacht. Die Seeve geht auf. Bei Hansens ist niemand, der wach bleibt. Wenn sie da durchkommen, sind sie bei euch.\n\nСегодня ночью. Зеве вскроется. У Ханзенов некому не спать. Если пройдут там, будут у вас.' },
    ],
    actions: [
      { id: 'c40_ab_gap', label: 'Сказать: Ханзенов возьмём на себя', minutes: 45, terminal: true, goto: 'c40_a_gear', ambientDuring: thaw40,
        text: 'Брандт кивает. «Dann habt ihr zwei Stellen. Schafft ihr das?» Тогда у вас два места. Справитесь? Ты не знаешь. Ты говоришь «да».', effects: [set40('ab', 'gap'), w40('took_gap', true), npc('c16_brandt', 1), until40(45, 10, 30)] },
      { id: 'c40_ab_men', label: 'Попросить у Брандта одного человека на ночь', minutes: 45, terminal: true, goto: 'c40_a_gear', ambientDuring: thaw40,
        text: '— Hab keinen. — Брандт смотрит на дорогу. Нет у меня. — Aber der Junge, Lukas, läuft heute die Bäche ab. Ich sag ihm, er soll bei euch zweimal vorbei.\n\nНо мальчишка, Лукас, сегодня обходит ручьи. Скажу ему, чтобы заглянул к вам дважды.', effects: [set40('ab', 'men'), w40('lukas_round', true), until40(45, 10, 30)] },
      { id: 'c40_ab_signal', label: 'Договориться о сигнале: ракета — значит, прорвались', minutes: 45, terminal: true, goto: 'c40_a_gear', ambientDuring: thaw40,
        text: '— Rot heißt: kommt. Grün haben wir nicht. — Брандт почти улыбается. Красная — значит, идите. Зелёных у нас нет. Он записывает в блокнот: «Lüdemann: Rakete».', effects: [set40('ab', 'signal'), w40('rocket_signal', true), until40(45, 10, 30)] },
    ] }),

  X({ id: 'c40_a_gear', title: 'Снаряжение', camp: kitchen14,
    text: [
      { text: 'Ты раскладываешь на лавке всё, что пойдёт с тобой ночью.' },
      { when: torch40, text: 'Фонарь есть.' },
      { when: not(torch40), text: 'Фонаря нет. Есть керосиновая лампа Хенрике, но под дождём она погаснет.' },
      { when: flares40, text: 'Сигнальные ракеты в кармане.' },
    ],
    actions: [
      { id: 'c40_ag_rope', label: 'Взять верёвку и багор: если кто-то окажется в воде', minutes: 45, terminal: true, goto: 'c40_tue_noon',
        text: 'Верёвка с сеновала, двадцать метров, и багор с пожарного щита. Тяжело, но если придётся вытаскивать — будет чем.', effects: [set40('ag', 'rope'), set40('rope', true), until40(45, 12, 0)] },
      { id: 'c40_ag_dry', label: 'Приготовить сухую смену и сапоги повыше', minutes: 45, terminal: true, goto: 'c40_tue_noon',
        text: 'Шерстяное бельё, вторые носки, резиновые сапоги Оле, великоватые, но высокие. Всё в мешок у двери. Если промокнешь — будет во что переодеться.', effects: [set40('ag', 'dry'), set40('dry', true), until40(45, 12, 0)] },
      { id: 'c40_ag_crank', label: 'Проверить фонарь и крутить его, пока не зарядится', when: torch40, minutes: 45, terminal: true, goto: 'c40_tue_noon',
        text: 'Фонарь светит ровно. Ты кладёшь его во внутренний карман, к телу, чтобы не отсырел.', effects: [set40('ag', 'crank'), set40('light_ready', true), until40(45, 12, 0)] },
    ] }),

  X({ id: 'c40_a_ice', title: 'Зеве днём', camp: yard14, safe: false, ambient: thaw40,
    text: [
      { text: 'Ты идёшь посмотреть на ручей, пока светло. Зеве не узнать: лёд встал торосами, между льдинами чёрная вода, течение тащит ветки.' },
      { when: not(flag('w.c39_reeds_cleared')), text: 'У камышей пусто. Вмёрзшего, который стоял там с прошлой недели, нет. Лёд вокруг того места разломан. Его унесло. Или он ушёл.' },
      { when: flag('w.c39_reeds_cleared'), text: 'Там, где вы вырубили вмёрзшего, торчит из воды палка с красной тряпкой.' },
      { text: 'На другом берегу, на мокром снегу, следы. Много. Свежие.' },
    ],
    actions: [
      { id: 'c40_ai_fence', label: 'Подпереть забор со стороны ручья', when: not(fence40), minutes: 90, activity: 'heavy', terminal: true, goto: 'c40_dusk', ambientDuring: thaw40,
        text: 'Колья, сетка, проволока. Земля раскисла, колья входят легко и так же легко шатаются. Ты подпираешь их камнями. Забор выглядит хлипко. Но он есть.', effects: [set40('ai', 'fence'), w40('fence_up', true), { body: 'fatigue', delta: 8 }, until40(45, 16, 0)] },
      { id: 'c40_ai_cans', label: 'Натянуть проволоку с банками ещё раз: старую порвало', minutes: 60, terminal: true, goto: 'c40_dusk', ambientDuring: thaw40,
        text: 'Проволока, банки, камешки. Поперёк тропы и вдоль берега. Ты задеваешь её нарочно: грохот слышен у дома даже сквозь дождь.', effects: [set40('ai', 'cans'), w40('cans_new', true), until40(45, 16, 0)] },
      { id: 'c40_ai_ford', label: 'Отметить брод, где они перейдут: там будешь смотреть ночью', minutes: 60, terminal: true, goto: 'c40_dusk', ambientDuring: thaw40,
        text: 'Ниже по течению, у старой ивы, ручей мелкий: там они и выйдут. Ты вбиваешь кол с белой тряпкой. Ночью он будет виден, если посветить.', effects: [set40('ai', 'ford'), w40('ford_marked', true), until40(45, 16, 0)] },
      { id: 'c40_ai_poles', label: 'Воткнуть вешки с тряпками вдоль берега: ночью будет видно край', minutes: 60, terminal: true, goto: 'c40_dusk', ambientDuring: thaw40,
        text: 'Шесть палок с белыми тряпками вдоль кромки. В темноте их будет видно с поста. Где вешка — там берег, дальше вода.', effects: [set40('ai', 'poles'), until40(45, 16, 0)] },
    ] }),

  // ═════════════ Ночь ═════════════
  X({ id: 'c40_a_n1', title: 'Пост', camp: yard14, safe: false, ambient: thaw40, onEnter: [until40(45, 20, 0)],
    text: [
      { when: watchSeeve40, text: 'Восемь вечера. Пост у Зеве: шалаш из веток, с которого течёт, и колокол на столбе. Дождь, темнота, грохот льда.' },
      { when: not(watchSeeve40), text: 'Восемь вечера. Ты у забора за сараем, с той стороны, где ручей. Дождь, темнота, грохот льда.' },
      { when: mate, text: 'Оле рядом, в плащ-палатке, с ружьём. Он говорит, не поворачивая головы: «Nicht allein ans Wasser. Egal, was du hörst». Не ходи к воде один. Что бы ни услышал{m:|а}.' },
      { when: all(not(mate), brothersCome), text: 'Рядом Дениз: вызвался сам. Он говорит: «Nicht allein ans Wasser». Не ходи к воде один.' },
      { when: all(not(mate), not(brothersCome), strangers40), text: 'Рядом Йорг: вызвался сам. Он говорит: «Nicht allein ans Wasser». Не ходи к воде один.' },
      { when: all(not(mate), not(brothersCome), not(strangers40)), text: 'Рядом Яннес из колонии: Уте прислала. Он говорит: «Nicht allein ans Wasser». Не ходи к воде один.' },
      { text: 'Около девяти внизу у воды плеск. Не как от льдины. Мерный. Потом ещё.' },
    ],
    actions: [
      { id: 'c40_an1_bell', label: 'Ударить в колокол сразу: пусть все проснутся', minutes: 60, terminal: true, goto: 'c40_a_n2', ambientDuring: thaw40,
        // Совет дворов КТ39 решает, кто ответит на колокол (REWORK_PLAN.md, этап 4).
        outcomes: [
          { id: 'guard', when: v('w.c39_council', 'guard'), text: 'Три удара, ещё три. Через поле отвечает колокол у Уте, потом у Кёлер, потом далеко, у пожарной части. Общая стража, как решили в воскресенье. Через четверть часа к вашему забору выходят Уве и двое мужиков с вилами и фонарём.\n\n— Wo? — только и спрашивает Уве. Где?', effects: [w40('neighbors', 'came')] },
          { id: 'brandt', when: v('w.c39_council', 'brandt'), text: 'Три удара, ещё три. Далеко у пожарной части отвечает колокол. Через полчаса по дороге проходят фары: дружина Брандта едет по своему листу постов. К вашему забору никто не сворачивает. Брандт старший, Брандт и решает, где нужнее.', effects: [w40('neighbors', 'brandt')] },
          { id: 'yards', text: 'Три удара, ещё три. С хутора отвечает стук по кастрюле. Через поле тишина. У Кёлер в окне гаснет свет. Каждый двор сам за себя: так разошлись в воскресенье, так и есть.', effects: [w40('neighbors', 'none')] },
        ], effects: [set40('an1', 'bell'), w40('a_signal_early', true), w40('warned', true), until40(45, 22, 0)] },
      { id: 'c40_an1_look', label: 'Спуститься к воде и посмотреть', minutes: 60, risky: true, terminal: true, goto: 'c40_a_n2', ambientDuring: thaw40,
        outcomes: [
          { id: 'ok', when: torch40, check: { traits: ['agility'], difficulty: 3, uses: ['focus'] },
            text: 'Ты светишь фонарём вниз. У брода, по колено в воде, идут фигуры. Пять, шесть. Медленно, качаясь, к вашему берегу. Ты карабкаешься наверх, пока они не повернули головы на свет.',
            effects: [set40('an1', 'look'), w40('a_saw', true), until40(45, 22, 0)] },
          { id: 'wet',
            text: 'В темноте ты не видишь края. Берег уходит из-под ног, и ты съезжаешь в воду по пояс. Ледяная вода, течение тянет. Ты выбираешься, цепляясь за корни. {m:Мокрый|Мокрая} до пояса, руки не слушаются. Внизу кто-то идёт по воде. Ты не видишь, кто.',
            effects: [set40('an1', 'look'), ...hurt1('wet'), until40(45, 22, 0)] },
        ] },
      { id: 'c40_an1_wait', label: 'Ждать и слушать', minutes: 60, terminal: true, goto: 'c40_a_n2', ambientDuring: thaw40,
        text: 'Ты стоишь, не двигаясь. Плеск, плеск. Потом тишина. Потом снова, ближе. Дождь заливает за воротник.', effects: [set40('an1', 'wait'), until40(45, 22, 0)] },
    ] }),

  X({ id: 'c40_a_n2', title: 'Забор', camp: yard14, safe: false, ambient: thaw40,
    text: [
      { text: 'Десять вечера. Они выходят из темноты к забору у сарая. Мокрые, медленные, в рваных больничных рубашках поверх курток. Пятеро. За ними ещё.' },
      { when: alarm40, text: 'Банки на проволоке гремят. В доме загорается лампа и тут же гаснет.' },
      { when: worse1, text: 'Ты {m:мокрый|мокрая} до пояса. Зубы стучат так, что не слышно дождя. Пальцы еле держат лом.' },
      { when: mate, text: 'Оле кричит тебе: «Zurück! Zum Haus! Sofort!» Назад! К дому! Немедленно!' },
      { when: not(mate), text: 'Твой напарник кричит: «Zurück! Zum Haus!» Назад! К дому!' },
      { when: fence40, text: 'Забор, который вы подпирали, качается, но держит.' },
      { when: v('w.c40_neighbors', 'came'), text: 'Уве и его двое стоят рядом с тобой у забора. Вилы, лом, фонарь. Вчетвером забор — это уже стена.' },
      { when: v('w.c40_neighbors', 'none'), text: 'У забора ты и напарник. Больше никого. Через поле у соседей темно и тихо, и это хуже любого шума.' },
      { when: v('w.c40_neighbors', 'brandt'), text: 'Фары дружины ушли к мосту. Здесь только вы.' },
    ],
    actions: [
      { id: 'c40_an2_uwe', label: 'Держать забор вместе с людьми Уве', when: v('w.c40_neighbors', 'came'), minutes: 45, terminal: true, goto: 'c40_a_n3', ambientDuring: thaw40,
        text: 'Вы стоите вчетвером. Уве бьёт вилами через сетку, коротко, как бросают сено. Ты ломом. Напарник светит. Пятеро, шестеро. Забор качается и держит. Когда последний затихает, Уве вытирает вилы о мокрую траву.\n\n— Das war der Zaun. Jetzt seid ihr dran, wenn es bei uns läutet.\n\nЭто был забор. Теперь, если зазвонит у нас, — ваша очередь.\n\nОни уходят к своему двору бегом.', effects: [set40('an2', 'uwe'), w40('fence_held', true), w40('owe_uwe', true), { body: 'fatigue', delta: 6 }, until40(46, 0, 30)] },
      { id: 'c40_an2_back', label: 'Отступить к дому со всеми и запереть дверь', minutes: 45, terminal: true, goto: 'c40_a_n3', ambientDuring: thaw40,
        text: 'Вы бежите к дому, напарник последним, спиной вперёд. Дверь, засов, стол к двери. Снаружи слышно, как ломается забор у сарая. Двор теперь их.', effects: [set40('an2', 'back'), w40('yard_lost', true), until40(46, 0, 30)] },
      { id: 'c40_an2_hold', label: 'Держать забор: бить ломом тех, кто лезет', minutes: 45, risky: true, terminal: true, goto: 'c40_a_n3', ambientDuring: thaw40,
        outcomes: [
          { id: 'hurt', when: worse1, text: 'Ты замахиваешься, и мокрые пальцы разжимаются. Лом скользит. Тот, кто перевалился через сетку, хватает тебя за рукав и тянет. Ты падаешь на колени, и сетка рвёт тебе руку от локтя до кисти. Кровь горячая на холодной руке. Оле оттаскивает тебя за ворот.', effects: [set40('an2', 'hold'), ...hurt2, until40(46, 0, 30)] },
          { id: 'ok', check: { traits: ['strength', 'melee'], difficulty: 3, uses: ['strength'] }, text: 'Лом входит. Он падает назад, на тех, кто за ним. Второй, третий. Забор держит. Ты стоишь, тяжело дыша, и не чувствуешь рук.', effects: [set40('an2', 'hold'), w40('fence_held', true)] },
          { id: 'hurt2', text: 'Лом застревает в сетке. Тебя тянут через неё за рукав, проволока рвёт руку. Ты вырываешься, оставив рукав. Кровь.', effects: [set40('an2', 'hold'), ...hurt2] },
        ], effects: [until40(46, 0, 30)] },
      { id: 'c40_an2_gerdes', label: 'Бежать к Ханзенам предупредить: у них дыра', when: gap, minutes: 45, risky: true, terminal: true, goto: 'c40_a_n3', ambientDuring: thaw40,
        outcomes: [
          { id: 'ok', when: torch40, check: { traits: ['agility', 'endurance'], difficulty: 3, uses: ['mobility'] },
            text: 'Ты бежишь через поле, светя под ноги. У Ханзенов темно. Ты колотишь в дверь, пока фрау Ханзен не открывает. Вдвоём вы тащите старика в погреб и закрываете люк. Потом ты бежишь обратно.',
            effects: [set40('an2', 'gerdes'), w40('warned', true), { body: 'fatigue', delta: 8 }, until40(46, 0, 30)] },
          { id: 'fall', when: worse1,
            text: 'В темноте ты не видишь канавы. Падаешь в воду, лицом вниз, руками в ледяную жижу. Выбираешься, {m:мокрый|мокрая} целиком. До Ханзенов ты всё-таки добегаешь и колотишь в дверь, пока не открывают. Обратно ты идёшь, шатаясь.',
            effects: [set40('an2', 'gerdes'), w40('warned', true), ...hurt2, until40(46, 0, 30)] },
          { id: 'slip',
            text: 'Ты бежишь без света, наугад. Падаешь дважды. До Ханзенов добегаешь, {m:мокрый|мокрая} и в грязи, и колотишь в дверь. Фрау Ханзен открывает с кочергой в руках.',
            effects: [set40('an2', 'gerdes'), w40('warned', true), ...hurt1('bruise'), until40(46, 0, 30)] },
        ] },
      { id: 'c40_an2_flare', label: 'Пустить красную ракету', when: flares40, minutes: 30, terminal: true, goto: 'c40_a_n3', ambientDuring: thaw40,
        text: 'Ракета уходит вверх с шипением и вспыхивает над полем красным. Всё видно: забор, сарай, фигуры, идущие к дому. Через десять минут со стороны дороги свет фар: дружина Брандта.', effects: [set40('an2', 'flare'), { take: 'c38_flares' }, w40('warned', true), w40('patrol_came', true), until40(46, 0, 30)] },
    ] }),

  X({ id: 'c40_a_n3', title: 'Через двор', camp: yard14, safe: false, ambient: thaw40,
    text: [
      { text: 'Полночь. Из сарая крик. Детский.' },
      { when: strangers40, text: 'Там Йорг с детьми. Дверь сарая распахнута, внутри темно, Йорг кричит и бьёт чем-то по железу.' },
      { when: not(strangers40), text: 'Там кто-то есть. Может, Нина побежала к корове. Может, кто-то из соседских. Отсюда не видно.' },
      { when: worse2, text: 'Рука не держит. Кровь пропитала рукав и стекает в ладонь. Перед глазами плывёт.' },
      { text: 'Между домом и сараем тридцать метров двора. Темнота, грязь по щиколотку, вода.' },
    ],
    actions: [
      { id: 'c40_an3_shout', label: 'Кричать из дома, звать, стучать — и не выходить', minutes: 30, terminal: true, goto: 'c40_a_after',
        text: 'Ты кричишь, стучишь, светишь в окно. Крик в сарае обрывается. Потом снова: Йорг кричит, жив. Когда приходит дружина, в сарае один мёртвый обращённый и Йорг с топором. Младшую он не удержал на руках: она упала с сеновала. Сломана рука.', effects: [set40('an3', 'shout'), w40('strangers_kid', 'hurt'), until40(46, 2, 30)] },
      { id: 'c40_an3_run', label: 'Бежать через двор к сараю', minutes: 30, risky: true, terminal: true, goto: 'c40_a_after', ambientDuring: thaw40,
        outcomes: [
          { id: 'down', when: worse2, text: 'Ты бежишь. Нога уходит в грязи. Раненая рука не успевает. Ты падаешь лицом вниз, виском о край корыта у колодца. Белая вспышка. Потом ничего.\n\nПоследнее, что ты слышишь, — кто-то кричит твоё имя.', effects: [set40('an3', 'run'), ...down40] },
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 4, uses: ['mobility'] }, text: 'Ты добегаешь. В сарае двое: один у двери, второй тянется к сеновалу, где дети. Ты бьёшь первого, кто-то из мужчин — второго. Детей вы выносите в дом на руках.', effects: [set40('an3', 'run'), w40('barn_saved', true), w40('strangers_kid', 'safe')] },
          { id: 'slip', text: 'Ты падаешь на полпути, встаёшь, бежишь. В сарае уже справились без тебя: кто-то с вилами. Ты стоишь в дверях, задыхаясь, {m:весь|вся} в грязи.', effects: [set40('an3', 'run'), { body: 'fatigue', delta: 8 }, w40('strangers_kid', 'safe')] },
        ], effects: [until40(46, 2, 30)] },
      { id: 'c40_an3_light', label: 'Идти с фонарём и с кем-то вдвоём, не бегом', when: torch40, minutes: 30, terminal: true, goto: 'c40_a_after', ambientDuring: thaw40,
        text: 'Фонарь, напарник за спиной. Вы идёте быстро, но не бегом, светя под ноги. В сарае один, у сеновала. Вдвоём вы справляетесь. Дети целы. Йорг сидит на соломе и не может разжать пальцы на топоре.', effects: [set40('an3', 'light'), w40('barn_saved', true), w40('strangers_kid', 'safe'), until40(46, 2, 30)] },
      { id: 'c40_an3_rope', label: 'Кинуть верёвку из окна и тянуть их к дому', when: rope, minutes: 30, terminal: true, goto: 'c40_a_after', ambientDuring: thaw40,
        text: 'Верёвка до сарая не долетает, но Йорг выбегает, хватает конец, и вы тянете его с детьми к дому, через грязь. Дверь, засов. Все внутри.', effects: [set40('an3', 'rope'), w40('strangers_kid', 'safe'), until40(46, 2, 30)] },
    ] }),

  X({ id: 'c40_a_after', title: 'К утру', camp: kitchen14,
    text: [
      { text: 'Половина третьего. Дождь слабеет. Во дворе тихо. У забора и у сарая лежат те, кто дошёл. Кто-то из дружины ходит с фонарём и считает.' },
      { when: worse2, text: 'Рука перевязана полотенцем Хенрике. Ты сидишь у печи и не можешь согреться.' },
      { when: guardAll40, text: 'Колокол у пожарной части бьёт отбой: три долгих удара. Значит, у других дворов тоже кончилось.' },
    ],
    actions: [
      { id: 'c40_aa_help', label: 'Выйти помочь дружине: оттащить тела от колодца', minutes: 60, activity: 'heavy', terminal: true, goto: 'c40_night_end', ambientDuring: thaw40,
        text: 'Перчатки, багор, тачка. Тела за сарай, подальше от колодца. Дружинник считает вслух. Девять у вас. Ты считаешь вместе с ним и сбиваешься.', effects: [set40('aa', 'help'), { body: 'fatigue', delta: 8 }, until40(46, 5, 0)] },
      { id: 'c40_aa_dry', label: 'Переодеться в сухое и сесть у печи', minutes: 60, terminal: true, goto: 'c40_night_end',
        text: 'Сухое бельё, шерстяные носки, кружка горячего. Руки отходят с болью. Ты сидишь и смотришь в огонь.', effects: [set40('aa', 'dry'), { body: 'stress', delta: -4 }, until40(46, 5, 0)] },
      { id: 'c40_aa_count', label: 'Пересчитать своих', minutes: 60, terminal: true, goto: 'c40_night_end',
        text: 'Хенрике, Нина, все, кто в доме. Ты обходишь комнаты с лампой. Все. Ты садишься на ступеньку и не встаёшь долго.', effects: [set40('aa', 'count'), until40(46, 5, 0)] },
    ] }),
];

