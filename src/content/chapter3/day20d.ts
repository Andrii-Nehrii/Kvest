import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { tense14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { A19, B19, S20, barnChained, girlHere, henrikeHome, jannesHere, npc, own20, set20, until, uteHere, w20 } from './point19';

// Участок 20: большая опасная сцена (серия 19–24) в обеих ветках. Правила — TECHNIQUES.md §3.1.
// Ошибки копятся через реальное положение: вышел наружу ($.c20_out), уже ранен ($.c20_d2 = hurt / jam), рукав, помощники.
// Третье звено — только у того, кто уже снаружи и уже пострадал или остался без второго выстрела. Предупреждения — в тексте сцен.
const out = (): Effect => set20('out', true);
const isOut: Cond = flag('$.c20_out');
const worse: Cond = any(own20('d2', 'hurt'), own20('d2', 'jam'));
const jacketBad: Cond = all(flag('w.c19_jacket_torn'), not(flag('w.c20_jacket_sewn')), not(flag('w.c20_jacket_taped')));
const helpers: Cond = any(jannesHere, flag('w.c20_volker_stays'));
const gun: Cond = { has: 'c19_flinte' };
const knowsBarrel: Cond = any(flag('w.c20_left_barrel'), flag('w.c19_left_barrel'));
const gateFixed: Cond = flag('w.c20_gate_fixed');
/** Подготовка из добавленных сцен 19–20: собака у ворот, увиденные утром в лесополосе, знание дверей и закрытые ворота прачечной. */
const dogWarn: Cond = any(v('w.c19_dog', 'house'), v('w.c19_dog', 'gate'));
const woodSeen: Cond = any(flag('w.c20_wood_seen'), flag('w.c20_wood_warned'));
const knowsDoors: Cond = flag('$.c20_knows_doors');
const lueGateClosed: Cond = v('w.c20_lue_gate', 'closed');
const uteBarn: Cond = all(barnChained, uteHere);
/** Тяжёлое ранение третьего звена: потеря сознания. Страховка жизни держит, пока второй на ногах; спасать — в точке 21. */
const down = (site: 'leftLeg' | 'rightArm' | 'torso'): Effect[] => [
  { injure: 'laceration', site, severity: 4, bleeding: 3 }, { body: 'bloodLoss', delta: 58 }, { body: 'stress', delta: 10 }, w20('down', true),
];
const hurt = (site: 'leftArm' | 'rightArm' | 'leftLeg'): Effect[] => [{ injure: 'cut', site, severity: 2, bleeding: 2 }, { body: 'stress', delta: 5 }, set20('d2', 'hurt')];
const farm = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S20({ ...scene, for: 'any', chapter: 'ch3', camp: tense14, safe: false });
const lue = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S20({ ...scene, for: 'any', chapter: 'ch3', location: 'c18_lueneburg', camp: { at: 'c18_lueneburg', stock: 'c3_farm_stock', rest: false }, safe: false });
const yard = { tempC: 3, outdoor: true, wet: true };
const lueYard = { tempC: 4, outdoor: true, wet: false };

export const day20DScenes: Scene[] = [
  // ───────────── Хутор: люди с автобана через заднее поле ─────────────
  farm({ id: 'c20_f_d_alarm', title: 'С поля', ambient: yard,
    text: [
      { text: 'С заднего крыльца кричат, высоко, на одной ноте. Ты выглядываешь во двор.' },
      { text: 'Из лесополосы на поле выходят люди. Шестеро. Сначала цепочкой, потом кучей. Двое бегут, неловко, рывками, как бегут пьяные. Остальные идут. Прямо на хутор, на крик кур. До задней изгороди метров четыреста.' },
      { when: dogWarn, text: 'Бруно залаял у ворот на минуту раньше крика. Эту минуту у тебя никто не отнимет.' },
      { when: all(A19, woodSeen), text: 'Те самые, из ложбины у ручья. Ты их узнаёшь по курткам поверх рубашек.' },
      { when: barnChained, text: 'В длинном сарае разом звенят цепи. Все семь колец.' },
      { when: uteBarn, text: 'Уте там, в сарае, с вёдрами.' },
      { when: henrikeHome, text: 'Хенрике уже на крыльце, с кочергой в руке.\n\n— Alle ins Haus! Keiner geht raus!\n\nВсе в дом! Никто не выходит!' },
      { when: all(not(henrikeHome), uteHere, not(barnChained)), text: 'Уте за твоей спиной говорит негромко, по-учительски:\n\n— Ins Haus. Alle. Die Tür zu.\n\nВ дом. Все. Дверь закрыть.' },
      { when: all(not(henrikeHome), not(all(uteHere, not(barnChained)))), text: 'Кто-то в доме кричит: «Alle rein!» Все внутрь.' },
    ],
    actions: [
      { id: 'c20_fd1_door', label: 'Загнать всех в дом и запереть дверь', when: A19, minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Ты задвигаешь засов и подпираешь дверь скамьёй. Окна кухни выходят во двор. Отсюда видно всё.', effects: [set20('d1', 'door'), until(20, 14, 20)] },
      { id: 'c20_fd1_up', label: 'Увести всех наверх, подальше от окон', when: all(B19, any(ninaFarm, girlHere)), minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Ты гонишь всех на второй этаж и сажаешь на пол у дальней стены. Никто не плачет.', effects: [set20('d1', 'up'), until(20, 14, 20)] },
      { id: 'c20_fd1_gun', label: 'Взять ружьё и встать в дверях', when: all(A19, gun), minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Ружьё за шкафом, патроны в банке с пуговицами. Ты заряжаешь оба ствола в сенях, руки слушаются плохо. Встаёшь в дверях, плечом к косяку.', effects: [set20('d1', 'gun'), until(20, 14, 20)] },
      { id: 'c20_fd1_fork', label: 'Схватить вилы и бежать к задней калитке', when: A19, minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Вилы у курятника. Ты бежишь через двор по грязи. Сзади кричат, чтобы ты {m:вернулся|вернулась}.', effects: [set20('d1', 'fork'), out(), until(20, 14, 20)] },
      { id: 'c20_fd1_barn', label: 'Бежать к сараю за Уте', when: all(A19, uteBarn), minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Ты бежишь к длинному сараю. Изнутри грохот цепей и голос Уте: она поёт им, громко, сбиваясь.', effects: [set20('d1', 'barn'), out(), until(20, 14, 20)] },
      { id: 'c20_fd1_poker', label: 'Взять кочергу и выйти во двор', when: B19, minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Кочерга тяжёлая, с налипшей сажей. Ты выходишь на крыльцо. Двое бегущих уже у изгороди.', effects: [set20('d1', 'out'), out(), until(20, 14, 20)] },
      { id: 'c20_fd1_water', label: 'Поставить кипяток и встать у окна второго этажа', when: B19, minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Выварка со стиркой ещё горячая. Ты тащишь ведро наверх, расплёскивая на ступени, и открываешь окно над задним двором.', effects: [set20('d1', 'water'), until(20, 14, 20)] },
      { id: 'c20_fd1_rail', label: 'Бить в рельс у ворот: звать на помощь', when: B19, minutes: 5, terminal: true, goto: 'c20_f_d_fence',
        text: 'Обрезок рельса висит у ворот на цепи, Хенрике звала им к обеду. Ты бьёшь ломом, раз за разом. Звон катится по полю. Двое из шестерых поворачивают головы на звук.', effects: [set20('d1', 'rail'), w20('rail', true), until(20, 14, 20)] },
    ] }),

  farm({ id: 'c20_f_d_fence', title: 'У изгороди', ambient: yard,
    text: [
      { when: gateFixed, text: 'Задняя калитка держит: второй засов. Двое бьются в неё плечами, раз, ещё раз. Третий идёт вдоль сетки к курятнику, ищет, где ниже.' },
      { when: not(gateFixed), text: 'Задняя калитка распахивается от первого толчка. Двое уже во дворе, между поленницей и курятником. Куры кричат так, что закладывает уши.' },
      { when: barnChained, text: 'Дверь длинного сарая трясётся: изнутри рвутся на цепях.' },
      { when: uteBarn, text: 'Уте внутри. Её пение перешло в крик.' },
      { when: all(gun, A19), text: '— Nicht schießen! — кричит кто-то из дома. — Dann kommen alle von der Autobahn!\n\nНе стреляй! Тогда придут все с автобана!' },
      { when: all(isOut, not(gun)), text: '— Komm zurück! — кричат из дома. Вернись!' },
      { when: all(isOut, jacketBad), text: 'Распоротый рукав куртки болтается и цепляется за всё подряд.' },
    ],
    actions: [
      { id: 'c20_fd2_watch', label: 'Остаться за дверью и смотреть', when: A19, minutes: 10, terminal: true, goto: 'c20_f_d_end',
        text: 'Ты смотришь через кухонное окно. Сетка курятника рвётся. Перья. Куры мечутся по двору, двое ловят их руками, неуклюже, как дети. Ты держишь засов и не двигаешься.', effects: [set20('d2', 'watch'), w20('coop_lost', true)] },
      { id: 'c20_fd2_door', label: 'Держать дверь изнутри', when: B19, minutes: 10, terminal: true, goto: 'c20_f_d_end',
        text: 'Ты стоишь, навалившись на дверь спиной. Снаружи что-то скребётся о доски, потом уходит. Наверху тихо.', effects: [set20('d2', 'door')] },      { id: 'c20_fd2_shoot', label: 'Стрелять', when: all(A19, gun), minutes: 5, risky: true, terminal: true, goto: 'c20_f_d_end',
        outcomes: [
          { id: 'known', when: knowsBarrel, text: 'Ты бьёшь из правого. Первый падает в грязь у поленницы. Левый ты не пробуешь: знаешь. Перезаряжаешь правый, пальцы как деревянные. Второй выстрел, второй падает. Звон в ушах долгий.', effects: [set20('d2', 'shot'), w20('shots', true), { take: 'c19_shells', qty: 2 }] },
          { id: 'jam', text: 'Первый выстрел, и он падает в грязь у поленницы. Второй — сухой щелчок. Левый курок не взвёлся. Второй уже у курятника и поворачивает к крыльцу, к тебе.', effects: [set20('d2', 'jam'), out(), w20('shots', true), { take: 'c19_shells', qty: 1 }, { body: 'stress', delta: 4 }] },
        ] },
      { id: 'c20_fd2_hold', label: 'Держать калитку вдвоём с тем, кто рядом', when: all(A19, helpers, any(own20('d1', 'fork'), own20('d1', 'barn'))), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_f_d_end',
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['strength'], mods: [{ when: gateFixed, bonus: 2 }, { when: dogWarn, bonus: 1 }, { when: woodSeen, bonus: 1 }] }, text: 'Вы наваливаетесь на калитку вдвоём. Доски гнутся внутрь, но засов держит. Через щель видно лицо, серое, с открытым ртом. Ты не смотришь в глаза.', effects: [set20('d2', 'hold')] },
          { id: 'cut', text: 'Калитка подаётся. Ты отлетаешь на проволоку изгороди, и она распарывает тебе руку от локтя до запястья. Кровь тёплая и быстрая. Тот, что был за калиткой, уже во дворе.', effects: hurt('leftArm') },
        ] },
      { id: 'c20_fd2_fork', label: 'Отталкивать их вилами', when: all(A19, isOut, not(own20('d1', 'barn'))), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_f_d_end',
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 3, uses: ['strength', 'mobility'], mods: [{ when: jacketBad, bonus: -2 }, { when: helpers, bonus: 1 }, { when: woodSeen, bonus: 1 }] }, text: 'Ты бьёшь черенком в грудь, не зубьями. Первый садится в грязь. Второй наваливается на вилы всем весом, и ты отступаешь, шаг за шагом, к курятнику. Он не чувствует, что ему больно. Ты чувствуешь за двоих.', effects: [set20('d2', 'fork')] },
          { id: 'cut', text: 'Рукав цепляется за зубья. Пока ты дёргаешь его, второй хватает тебя за плечо и тянет на себя. Ты вырываешься и падаешь на проволоку у курятника. Ладонь и предплечье распороты. Кровь идёт по пальцам и капает в грязь.', effects: hurt('rightArm') },
        ] },
      { id: 'c20_fd2_ute_a', label: 'Вывести Уте из сарая через переднюю дверь', when: all(A19, own20('d1', 'barn')), minutes: 10, risky: true, terminal: true, goto: 'c20_f_d_end',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 3, uses: ['mobility'] }, text: 'Уте стоит в проходе между стойлами и поёт, не останавливаясь. Ты берёшь её за плечи и выводишь. Она идёт и поёт до самой двери дома. Там замолкает и садится на пол.', effects: [set20('d2', 'ute'), w20('ute_saved', true), npc('c14_ute', 3)] },
          { id: 'cut', text: 'В дверях сарая тебя сбивает с ног тот, что пришёл вдоль сетки. Ты падаешь на скобу засова, и она рвёт тебе руку. Уте бьёт его ведром по голове, раз, другой, и тащит тебя за рукав к дому.', effects: [...hurt('leftArm'), w20('ute_saved', true), npc('c14_ute', 3)] },
        ] },
      { id: 'c20_fd2_water', label: 'Лить кипяток из окна', when: all(B19, own20('d1', 'water')), minutes: 5, terminal: true, goto: 'c20_f_d_end',
        text: 'Ты опрокидываешь ведро. Пар. Тот, что под окном, не кричит, только мотает головой и идёт дальше, вдоль стены, к курятнику. Боли он не чувствует. Но от двери отошёл.', effects: [set20('d2', 'water')] },
      { id: 'c20_fd2_ute', label: 'Бежать к сараю и вывести Уте через переднюю дверь', when: all(B19, uteBarn), minutes: 10, risky: true, terminal: true, goto: 'c20_f_d_end',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты бежишь вдоль стены дома, пригнувшись. Передняя дверь сарая, Уте с ведром в руках. Ты хватаешь её за рукав и тянешь, и она бежит за тобой, не выпуская ведро. Засов кухни за вами.', effects: [set20('d2', 'ute'), out(), w20('ute_saved', true), npc('c14_ute', 3)] },
          { id: 'fall', text: 'На мокрых досках у сарая ноги разъезжаются. Ты падаешь на бок, ведро Уте катится по двору. Уте выходит сама, поднимает тебя за воротник и тащит к дому. Она сильнее, чем кажется. Колено разбито.', effects: [set20('d2', 'hurt'), out(), w20('ute_saved', true), { injure: 'bruise', site: 'leftLeg', severity: 2 }, { body: 'stress', delta: 4 }] },
        ] },
      { id: 'c20_fd2_poker', label: 'Отгонять кочергой того, что у курятника', when: all(B19, isOut), minutes: 10, risky: true, terminal: true, goto: 'c20_f_d_end',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 4, uses: ['strength', 'mobility'] }, text: 'Ты бьёшь его по руке, по колену. Он поворачивается к тебе медленно, как будто вспоминает, кто ты. Ты пятишься к крыльцу и стучишь кочергой по железному баку. Он идёт на звук, мимо тебя.', effects: [set20('d2', 'poker')] },
          { id: 'cut', text: 'Он перехватывает кочергу. Ты дёргаешь на себя и падаешь, и железо ребром проходит тебе по предплечью. Ты отползаешь на четвереньках к крыльцу. Рукав намокает красным.', effects: hurt('leftArm') },
        ] },
    ] }),

  farm({ id: 'c20_f_d_end', title: 'Курятник', ambient: yard,
    text: [
      { text: 'Во дворе ещё бродят, между курятником и поленницей. Один залез в курятник через порванную сетку, и оттуда летят перья.' },
      { when: flag('w.c20_shots'), text: 'Двое лежат у поленницы, там, где их застали выстрелы.' },
      { when: own20('d2', 'jam'), text: 'Ружьё бесполезно, пока не перезарядишь правый. Тот, второй, в десяти шагах от тебя.' },
      { when: own20('d2', 'hurt'), text: 'Рука горит. Кровь не останавливается: капает с пальцев в грязь, часто.' },
      { when: all(isOut, worse), text: 'Из дома кричат уже не «вернись», а твоё имя.' },
    ],
    actions: [
      { id: 'c20_fd3_back', label: 'Отступить в дом и закрыть дверь', minutes: 5, terminal: true, goto: 'c20_f_tobias',
        text: 'Ты отступаешь. Засов, скамья. Через окно видно, как во дворе мечутся куры и те, кто их ловит.', effects: [set20('d3', 'back'), { if: not(flag('w.c20_coop_saved')), then: [w20('coop_lost', true)] }] },
      { id: 'c20_fd3_chase', label: 'Выгнать того, что в курятнике', when: all(isOut, A19), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_f_tobias',
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 4, uses: ['strength', 'mobility'], mods: [{ when: jacketBad, bonus: -2 }, { when: helpers, bonus: 1 }] }, text: 'Ты распахиваешь дверцу и бьёшь, пока он не перестаёт подниматься. Потом стоишь, держась за косяк. Половина кур жива и забилась под насест.', effects: [set20('d3', 'chase'), w20('coop_saved', true), { body: 'stress', delta: 4 }] },
          { id: 'down', when: worse, text: 'Ты распахиваешь дверцу. Он вылетает на тебя, всем весом. Вы падаете на стойку курятника, и что-то острое входит тебе в бедро, глубоко. Ты пытаешься встать. Двор качается и уходит вбок.\n\nПоследнее, что ты слышишь, — выстрелы со стороны дороги.', effects: [set20('d3', 'down'), ...down('leftLeg')] },
          { id: 'bruise', text: 'Он вылетает на тебя из дверцы. Ты падаешь в грязь, он на тебя. Ты бьёшь его локтем, коленом, сбрасываешь и откатываешься. Он остаётся в курятнике. Ты встаёшь не сразу.', effects: [set20('d3', 'bruise'), w20('coop_lost', true), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 5 }] },
        ] },
      { id: 'c20_fd3_poker', label: 'Добить того, что у крыльца', when: all(isOut, B19), minutes: 10, risky: true, terminal: true, goto: 'c20_f_tobias',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 4, uses: ['strength', 'mobility'] }, text: 'Ты бьёшь сверху, двумя руками, как колют дрова. Он садится и больше не встаёт. Кочерга гнётся. Ты роняешь её и долго не можешь разжать пальцы.', effects: [set20('d3', 'poker'), { body: 'stress', delta: 5 }] },
          { id: 'down', when: worse, text: 'Ты замахиваешься, и раненая рука не держит. Кочерга выскальзывает. Он толкает тебя в грудь, ты летишь со ступенек спиной на скребок для обуви. Острый край входит под рёбра. Небо над двором серое и очень далёкое.\n\nПотом выстрелы. Потом ничего.', effects: [set20('d3', 'down'), ...down('torso')] },
          { id: 'fall', text: 'Ты замахиваешься и бьёшь мимо. Он толкает тебя, ты падаешь на ступени крыльца, больно, всем боком. Дверь открывается, тебя втаскивают внутрь за куртку.', effects: [set20('d3', 'fall'), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 4 }] },
        ] },
      { id: 'c20_fd3_bandage', label: 'Перетянуть руку и ждать', when: own20('d2', 'hurt'), minutes: 10, terminal: true, goto: 'c20_f_tobias',
        text: 'Ты затягиваешь ремень выше локтя зубами и одной рукой. Кровь идёт медленнее. Во дворе ещё ходят, но ты уже не двигаешься с места.', effects: [set20('d3', 'bandage'), { treat: 'basic' }, w20('coop_lost', true)] },
    ] }),

  // ───────────── Люнебург: ворота прачечной ─────────────
  lue({ id: 'c20_g_breach', title: 'Двор прачечной', ambient: lueYard,
    text: [
      { when: not(all(A19, lueGateClosed)), text: 'Оле ещё стоит у стены, когда со стороны прачечной кричит женщина. Ворота хозяйственного двора, открытые утром для фургона, так и стоят нараспашку. Между фургонами идут четверо в больничных рубашках. Один почти бежит.' },
      { when: all(A19, lueGateClosed), text: 'Оле ещё стоит у стены, когда со стороны прачечной кричит женщина. Ворота хозяйственного двора, которые ты {m:закрыл|закрыла} в полдень, снова стоят нараспашку: вернулся фургон прачечной, и шофёр бросил их, как было утром. Клин так и лежит у тебя в кармане. Между фургонами идут четверо в больничных рубашках. Один почти бежит.' },
      { text: 'Солдат на вышке вскидывает винтовку и опускает. Между ним и ними женщины с корзинами белья.' },
      { text: '— Alle rein! Weg vom Hof! — кричит фельдфебель с крыльца штаба. Все внутрь! Прочь со двора!' },
      { text: 'Оле держится за стену. Идти быстро он не может.' },
    ],
    actions: [
      { id: 'c20_gb1_in', label: 'Уйти в штаб и держать дверь', when: A19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Ты взлетаешь на крыльцо штаба и встаёшь у стеклянной двери. Отсюда видно весь двор.', effects: [set20('d1', 'in'), until(20, 14, 25)] },
      { id: 'c20_gb1_kids', label: 'Бежать к детской: закрыть стеклянную дверь', when: B19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Коридор, лестница, второй этаж. Сестра у детской уже держит дверь, но замка на ней нет, только ручка.', effects: [set20('d1', 'kids'), until(20, 14, 25)] },
      { id: 'c20_gb1_gate', label: 'Бежать закрывать ворота прачечной', when: A19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Ты бежишь через двор наискосок, мимо фургонов. Створки тяжёлые, железные. Одна стоит на клине.', effects: [set20('d1', 'gate'), out(), until(20, 14, 25)] },
      { id: 'c20_gb1_pole', label: 'Схватить шест для белья и встать между ними и женщинами', when: A19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Шест длинный, с рогулькой на конце. Ты встаёшь у верёвок с бельём. Женщины бегут за твоей спиной к корпусу.', effects: [set20('d1', 'pole'), out(), until(20, 14, 25)] },
      { id: 'c20_gb1_peters', label: 'Поднять фрау Петерс: она упала у верёвок', when: B19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Фрау Петерс лежит на боку среди рассыпанного белья и пытается встать. Ты бежишь к ней через двор.', effects: [set20('d1', 'peters'), out(), until(20, 14, 25)] },
      { id: 'c20_gb1_ole_b', label: 'Увести Оле в донорский блок', when: B19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Ты подставляешь Оле плечо. Он тяжело наваливается и шепчет: «Langsam». Медленно. Медленно не получается.', effects: [set20('d1', 'ole'), w20('ole_safe', true), until(20, 14, 25)] },
      { id: 'c20_gb1_door', label: 'Закрыть изнутри дверь женского корпуса', when: B19, minutes: 5, terminal: true, goto: 'c20_g_breach2',
        text: 'Ты влетаешь в корпус последней и захлопываешь дверь. Засов тугой. Снаружи ещё кричат.', effects: [set20('d1', 'door'), until(20, 14, 25)] },
    ] }),

  lue({ id: 'c20_g_breach2', title: 'Между фургонами', ambient: lueYard,
    text: [
      { text: 'Двое уже у верёвок с бельём. Простыни путаются у них на плечах, как сети. Третий у крыльца штаба. Четвёртый, тот, что бегал, у ворот.' },
      { text: '— Weg da! Ich kann nicht schießen! — кричит солдат с вышки. Уйдите! Я не могу стрелять!' },
      { when: own20('d1', 'door'), text: 'В дверь корпуса колотят снаружи. Не так, как они. Кулаками, и кричат по-немецки: «Aufmachen!» Открой!' },
    ],
    actions: [
      { id: 'c20_gb2_gate', label: 'Сбить клин и закрыть ворота', when: all(A19, own20('d1', 'gate')), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_g_breach3',
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['strength'], mods: [{ when: lueGateClosed, bonus: 2 }, { when: knowsDoors, bonus: 1 }] }, text: 'Клин выбивается с третьего пинка. Ты наваливаешься на створку, и она идёт, со скрежетом, по бетону. Щеколда падает. Снаружи, на поле, стоят ещё двое. Сюда они уже не войдут.', effects: [set20('d2', 'gate'), w20('lue_gate', true)] },
          { id: 'cut', text: 'Клин не поддаётся. Тот, что бегал, врезается в тебя сбоку, и ты бьёшься рукой о щеколду. Рукав распорот, ладонь тоже. Ты отпихиваешь его ногой и прижимаешься к створке. Кровь течёт в рукав.', effects: hurt('rightArm') },
        ] },
      { id: 'c20_gb2_pole', label: 'Отталкивать их шестом от женщин', when: all(A19, own20('d1', 'pole')), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_g_breach3',
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'agility'], difficulty: 3, uses: ['strength', 'mobility'], mods: [{ when: knowsDoors, bonus: 1 }] }, text: 'Рогулька упирается первому в грудь. Ты толкаешь, он идёт на тебя, ты толкаешь снова. За спиной хлопает дверь корпуса: последние внутри.', effects: [set20('d2', 'pole')] },
          { id: 'cut', text: 'Шест ломается о плечо первого, как спичка. Обломок рвёт тебе ладонь. Ты отступаешь, держа руку у груди, и спотыкаешься о корзину с бельём.', effects: hurt('leftArm') },
        ] },
      { id: 'c20_gb2_ole', label: 'Затащить Оле внутрь и закрыть дверь', when: all(B19, own20('d1', 'ole')), minutes: 10, terminal: true, goto: 'c20_g_breach3',
        text: 'Дверь, засов. Оле сползает по стене на пол и сидит, закрыв глаза. Губы у него синие. Он жив.', effects: [set20('d2', 'ole'), npc('ole', 2), npc('henrike', 2)] },
      { id: 'c20_gb2_watch', label: 'Смотреть через стекло двери', when: all(A19, own20('d1', 'in')), minutes: 10, terminal: true, goto: 'c20_g_breach3',
        text: 'Через стекло видно, как третий поднимается по ступенькам штаба. Ты держишь ручку двери обеими руками. Он упирается лбом в стекло, прямо напротив твоего лица.', effects: [set20('d2', 'watch'), { body: 'stress', delta: 4 }] },
      { id: 'c20_gb2_peters', label: 'Тащить фрау Петерс к корпусу', when: all(B19, own20('d1', 'peters')), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_g_breach3',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['strength', 'mobility'], mods: [{ when: knowsDoors, bonus: 1 }] }, text: 'Ты поднимаешь её под мышки. Она лёгкая и цепкая. Вы ковыляете к корпусу, и кто-то изнутри распахивает дверь и втаскивает вас обеих.', effects: [set20('d2', 'peters'), w20('peters_saved', true)] },
          { id: 'cut', text: 'Ты тянешь её, она тяжелее, чем кажется. Один из тех, у верёвок, поворачивается к вам. Ты толкаешь фрау Петерс к двери и падаешь сама, ладонями на разбитое стекло от упавшей банки. Руки в крови.', effects: [...hurt('leftArm'), w20('peters_saved', true)] },
        ] },
      { id: 'c20_gb2_kids', label: 'Держать дверь детской вместе с сестрой', when: all(B19, own20('d1', 'kids')), minutes: 10, terminal: true, goto: 'c20_g_breach3',
        text: 'Вы держите ручку вдвоём. Внизу кричат и стреляют. Девочка у окна садится в кровати и смотрит на тебя. Ты улыбаешься ей. Не знаешь, как это у тебя получается.', effects: [set20('d2', 'kids'), w20('kids_door', true)] },
      { id: 'c20_gb2_open', label: 'Открыть и впустить тех, кто стучит', when: all(B19, own20('d1', 'door')), minutes: 10, risky: true, terminal: true, goto: 'c20_g_breach3',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 2, uses: ['mobility'], mods: [{ when: knowsDoors, bonus: 1 }] }, text: 'Ты отодвигаешь засов. Внутрь влетают две женщины и мальчик. Ты захлопываешь дверь за ними, и в неё сразу же глухо бьёт что-то тяжёлое. Засов держит.', effects: [set20('d2', 'open'), w20('let_in', true)] },
          { id: 'cut', text: 'Ты открываешь. Две женщины и мальчик проскакивают внутрь, и в щель протискивается рука в больничном рукаве. Ты наваливаешься на дверь, и край двери рвёт тебе пальцы. Засов задвигает кто-то другой.', effects: [...hurt('leftArm'), w20('let_in', true)] },
        ] },
      { id: 'c20_gb2_keep', label: 'Не открывать', when: all(B19, own20('d1', 'door')), minutes: 10, terminal: true, goto: 'c20_g_breach3',
        text: 'Ты держишь засов. Кулаки снаружи стучат, потом кричат, потом перестают. Ты не знаешь, ушли они или нет.', effects: [set20('d2', 'keep'), w20('kept_out', true), { body: 'stress', delta: 6 }] },
    ] }),

  lue({ id: 'c20_g_breach3', title: 'Солдаты', ambient: lueYard,
    text: [
      { text: 'Из караулки бегут солдаты. Два выстрела, третий. Двое у верёвок падают на белые простыни.' },
      { text: 'Тот, что бегал, сцепился у фургона с молодым солдатом. Винтовка между ними, никто не может её развернуть. Солдат кричит.' },
      { when: all(B19, not(flag('w.c20_ole_safe'))), text: 'Оле так и стоит у стены. Четвёртый идёт к нему.' },
    ],
    actions: [
      { id: 'c20_gb3_stay', label: 'Оставаться там, где ты есть', minutes: 10, terminal: true, goto: 'c20_g_after',
        outcomes: [
          { id: 'a', when: A19, text: 'Ещё два выстрела. Потом тишина и хриплый голос фельдфебеля. Двор усыпан бельём и гильзами. У стены кто-то лежит, вокруг уже стоят люди. Отсюда не видно, кто.', effects: [set20('d3', 'stay')] },
          { id: 'safe', when: flag('w.c20_ole_safe'), text: 'Ещё два выстрела. Потом тишина и голос фельдфебеля, хриплый. Двор усыпан бельём и гильзами.', effects: [set20('d3', 'stay')] },
          { id: 'ole', text: 'Ещё два выстрела. Потом тишина. Оле лежит у стены, там, где стоял. Лицо разбито о бетон, рука прокушена через рукав. Хенрике бежит к нему через весь двор, без пальто.', effects: [set20('d3', 'stay'), w20('ole_hurt', true), { npc: 'ole', status: 'injured' }, { body: 'stress', delta: 5 }] },
        ] },      { id: 'c20_gb3_pull', label: 'Оттащить его от солдата', when: all(isOut, any(A19, flag('w.c20_ole_safe'))), minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c20_g_after',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'melee'], difficulty: 4, uses: ['strength', 'mobility'] }, text: 'Ты хватаешь его за ворот рубашки и рвёшь на себя. Он отпускает винтовку и поворачивается к тебе. Солдат успевает. Выстрел в упор, у самого твоего плеча. В ушах звенит до вечера.', effects: [set20('d3', 'pull'), w20('saved_soldier', true), { body: 'stress', delta: 5 }] },
          { id: 'down', when: worse, text: 'Ты хватаешь его, и раненая рука не держит. Он разворачивается, вы падаете вместе, и твоя голова бьётся о бампер фургона. Потом что-то острое, край номерного знака, под рёбрами. Ты слышишь выстрел очень далеко.\n\nПотом тихо.', effects: [set20('d3', 'down'), ...down('torso')] },
          { id: 'fall', text: 'Ты хватаешь его за плечо, он стряхивает тебя, как куртку. Ты падаешь на бетон. Солдат сам выкручивает винтовку и стреляет. Ты лежишь, пока кто-то не поднимает тебя за локоть.', effects: [set20('d3', 'fall'), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 4 }] },
        ] },
      { id: 'c20_gb3_ole', label: 'Бежать к Оле', when: all(B19, not(flag('w.c20_ole_safe'))), minutes: 10, risky: true, terminal: true, goto: 'c20_g_after',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты успеваешь раньше. Хватаешь Оле за куртку и тянешь за угол, к двери донорского блока. Четвёртого снимают с вышки, когда он поворачивает за вами.', effects: [set20('d3', 'ole'), w20('ole_safe', true), npc('ole', 3, 'c20_pulled_me_in'), npc('henrike', 3)] },
          { id: 'late', text: 'Ты не успеваешь. Четвёртый сбивает Оле с ног, и они падают вместе. Выстрел с вышки. Ты подбегаешь, когда всё уже кончилось. Оле лежит на боку, лицо разбито о бетон, рука прокушена через рукав. Он смотрит на тебя и говорит: «Ich bin doch immun». Я же с иммунитетом. И смеётся, страшно.', effects: [set20('d3', 'late'), w20('ole_hurt', true), { npc: 'ole', status: 'injured' }, { body: 'stress', delta: 6 }] },
        ] },
    ] }),
];
