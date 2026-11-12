import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import {
  A19, B19, S19, carHere, cold19, day19, henrikeHome, jannesHere, jensBarn, letter, npc, own19, set19, until, w19,
} from './point19';

// Участок 19, добавленный объём (12.11, по оценке владельца «объём маленький»): новые события на обеих линиях и общий вечер.
// Линия A: собака у ворот, следы на инее (Нина и сарай или курятник), молодой из патруля, тяга в печи, телега Брандта,
// сумка почтальона. Линия B — ниже. Вечер вместе: стук у ворот, перед ужином, вдвоём.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S19({ ...scene, for: 'any', chapter: 'ch3',
  actions: scene.actions.map(a => ({ ...a, when: all(A19, a.when ?? { always: true }) })) });
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S19({ ...scene, for: 'any', chapter: 'ch3', safe: scene.safe ?? false,
  actions: scene.actions.map(a => ({ ...a, when: all(B19, a.when ?? { always: true }) })) });
const both = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S19({ ...scene, for: 'any', chapter: 'ch3' });

const village = 'c16_jesteburg';
const sammel = 'c13_sammel';
const lane = 'c7_farm_lane';
const indoorV = { tempC: 12, outdoor: false, wet: false };

const dogHere: Cond = any(v('w.c19_dog', 'house'), v('w.c19_dog', 'gate'));
/** Солярка ещё под навозом и A об этом знает. */
const buried: Cond = all(letter, any(v('w.c19_diesel', 'marked'), not(flag('w.c19_diesel'))));
const afterCart = [{ id: 'pit', when: buried, goto: 'c19_a_cart2' }, { id: 'well', goto: 'c19_a_well' }];
const giveAway = (type: string, qty: number): Effect => ({ if: { stocked: type, qty, at: 'c3_farm_stock' },
  then: [{ unstock: type, qty, at: 'c3_farm_stock' }, { take: type, qty }] });
const useBandage: Effect = { if: { has: 'bandages' }, then: [{ take: 'bandages' }] };
const hasMeds: Cond = any({ has: 'c18_insulin' }, { has: 'c17_vet_pen' });
const loseMeds: Effect[] = [
  { if: { has: 'c18_insulin' }, then: [{ take: 'c18_insulin' }, w19('insulin_lost', true)] },
  { if: { has: 'c17_vet_pen' }, then: [{ take: 'c17_vet_pen' }, w19('pen_lost', true)] },
];

export const day19XScenes: Scene[] = [
  // ───────────── A: утро ─────────────
  A({ id: 'c19_a_dog', title: 'У ворот', camp: yard14, ambient: cold19,
    text: [
      { text: 'Ты выносишь золу из плиты к воротам. У столба сидит собака.' },
      { text: 'Светлый лабрадор, худой, бока втянуты. На шее ошейник с обрывком поводка. Он не лает. Смотрит на ведро, потом на тебя, и стучит хвостом по инею.' },
      { text: 'Передние лапы в бурой корке. На бляшке ошейника выбито: «BRUNO».' },
    ],
    actions: [
      { id: 'c19_dg_house', label: 'Впустить и накормить', minutes: 15, terminal: true, goto: 'c19_a_tracks',
        outcomes: [
          { id: 'h', when: henrikeHome, text: 'Ты выскребаешь ему кашу со дна сковороды. Он съедает в четыре глотка и вылизывает миску, пока та не начинает ездить по крыльцу. Потом идёт за тобой на кухню и ложится у плиты.\n\nХенрике смотрит на него поверх очков.\n\n— Wenn er an die Hühner geht, ist er weg.\n\nЕсли полезет к курам, вылетит.' },
          { id: 'n', text: 'Ты выскребаешь ему кашу со дна сковороды. Он съедает в четыре глотка и вылизывает миску, пока та не начинает ездить по крыльцу. Потом идёт за тобой на кухню и ложится у плиты, как будто всегда там лежал.' },
        ], effects: [set19('dg', 'house'), w19('dog', 'house')] },
      { id: 'c19_dg_gate', label: 'Посадить на цепь у ворот: пусть сторожит', minutes: 15, terminal: true, goto: 'c19_a_tracks',
        text: 'Старая цепь висит в сарае на гвозде: собаки у Людеманов не было лет десять. Ты пристёгиваешь её к ошейнику и ставишь рядом таз с водой. Бруно ложится на мешок и смотрит на дорогу. Через минуту поднимает голову на ворону и рычит. Сторож.', effects: [set19('dg', 'gate'), w19('dog', 'gate')] },
      { id: 'c19_dg_paws', label: 'Сначала промыть ему лапы', minutes: 25, terminal: true, goto: 'c19_a_tracks',
        text: 'Ты промываешь лапы тёплой водой над тазом. В подушечке левой сидит осколок стекла размером с ноготь. Бруно скулит, но не дёргается. Когда ты вытаскиваешь стекло, он лижет тебе запястье. Дальше он ходит за тобой по двору, на шаг позади.', effects: [set19('dg', 'paws'), w19('dog', 'house'), { body: 'stress', delta: -1 }] },
      { id: 'c19_dg_away', label: 'Прогнать: лишний рот', minutes: 5, terminal: true, goto: 'c19_a_tracks',
        text: 'Ты замахиваешься ведром. Он отбегает на десять шагов и садится снова. Только после второго раза уходит в поле, к насыпи, и всё время оглядывается.', effects: [set19('dg', 'away'), w19('dog', 'gone')] },
    ] }),

  A({ id: 'c19_a_tracks', title: 'Следы на инее', camp: yard14, ambient: cold19,
    text: [
      { text: 'Трава за домом белая от инея. Через неё тянется цепочка следов, тёмных, чётких. Свежих: иней в них ещё не нарос.' },
      { when: jensBarn, text: 'Следы небольшие, от кроссовок. Они идут от заднего крыльца к длинному сараю и обратно. Два раза туда, два раза обратно.' },
      { when: not(jensBarn), text: 'Следы большие, от сапог, каблук у правого стоптан. Они приходят с поля через дыру в изгороди, идут к курятнику и уходят обратно. На сетке курятника клок серой шерсти от свитера. В гнёздах на четыре яйца меньше, чем вчера.' },
      { when: v('w.c19_dog', 'house'), text: 'Бруно нюхает след и садится, глядя на тебя.' },
    ],
    actions: [
      { id: 'c19_atr_barn', label: 'Пойти по следам к сараю', when: jensBarn, minutes: 5, terminal: true, goto: 'c19_a_barn',
        text: 'Засов длинного сарая отодвинут до половины. Замок висит на петле открытым.', effects: [set19('atr', 'barn')] },
      { id: 'c19_atr_nina', label: 'Найти Нину и спросить прямо', when: all(jensBarn, ninaFarm), minutes: 20, terminal: true, goto: 'c19_a_letter',
        text: 'Нина сидит на кровати, заплетает косу и не поднимает глаз.\n\n— Er ist ruhig, wenn ich da bin, — говорит она. — Ganz ruhig. Sag es Ute nicht. Und Henrike nicht.\n\nОн спокойный, когда я рядом. Совсем спокойный. Не говори Уте. И Хенрике не говори.\n\nОна доплетает косу до конца и только тогда смотрит на тебя.', effects: [set19('atr', 'nina'), w19('ring', 'asked'), npc('c7_nina', 1, 'c19_barn_asked')] },
      { id: 'c19_atr_leave', label: 'Не лезть: это её отец', when: jensBarn, minutes: 2, terminal: true, goto: 'c19_a_letter',
        text: 'Ты проходишь мимо. К обеду иней растает, и следов не останется.', effects: [set19('atr', 'leave'), w19('ring', 'unknown')] },
      { id: 'c19_atr_bell', label: 'Повесить на сетку пустые банки: пусть гремят', when: not(jensBarn), minutes: 20, terminal: true, goto: 'c19_a_letter',
        text: 'Ты связываешь проволокой шесть консервных банок и вешаешь их над дырой в сетке. Тронешь — гремит на весь двор.', effects: [set19('atr', 'bell'), w19('coop', 'bell')] },
      { id: 'c19_atr_gift', label: 'Оставить два яйца на столбе у дыры', when: not(jensBarn), minutes: 10, terminal: true, goto: 'c19_a_letter',
        text: 'Ты кладёшь два яйца в гнездо из сена на столбе изгороди, у самой дыры. Кто бы он ни был, пусть видит: тут не стреляют. Тот, кто снёс яйца, вряд ли согласился бы.', effects: [set19('atr', 'gift'), w19('coop', 'gift')] },
      { id: 'c19_atr_nail', label: 'Заколотить дыру в изгороди', when: not(jensBarn), minutes: 30, activity: 'moderate', terminal: true, goto: 'c19_a_letter',
        text: 'Две доски от старого корыта, гвозди из банки. Дыра закрыта. Изгородь длинная, и дыр в ней, наверное, ещё много.', effects: [set19('atr', 'nail'), w19('coop', 'nailed')] },
      { id: 'c19_atr_skip', label: 'Не тратить на это утро', when: not(jensBarn), minutes: 2, terminal: true, goto: 'c19_a_letter',
        text: 'Четыре яйца. Есть дела поважнее.', effects: [set19('atr', 'skip'), w19('coop', 'left')] },
    ] }),

  A({ id: 'c19_a_barn', title: 'Длинный сарай', camp: tense14, ambient: cold19,
    text: [
      { text: 'В сарае темно и тепло от тел. Пахнет навозом и чем-то сладким, больничным. Когда ты входишь, цепи звякают все разом.' },
      { text: 'Йенс в дальнем стойле. Он стоит, держась за жердь, и смотрит на дверь, на свет. Перед стойлом на перевёрнутом ящике сложенное одеяло, огарок свечи в банке и пустая кружка.' },
      { text: 'Кольцо его цепи вкручено в столб. Ты трогаешь его, и оно шевелится в дереве. Вокруг свежая щепа. Кольцо выкручивали, виток за витком: чтобы цепь была длиннее. Чтобы он мог сесть.' },
    ],
    actions: [
      { id: 'c19_aba_fix', label: 'Вкрутить кольцо обратно до упора', minutes: 15, activity: 'moderate', terminal: true, goto: 'c19_a_letter',
        text: 'Ты вкручиваешь кольцо ломом, оборот за оборотом. Йенс дёргается на каждый оборот. Цепь становится короче на ладонь, теперь он может только стоять. Одеяло ты оставляешь на ящике.', effects: [set19('aba', 'fix'), w19('ring', 'fixed'), npc('c7_nina', -1, 'c19_ring_fixed')] },
      { id: 'c19_aba_post', label: 'Перенести кольцо в целый дубовый столб, цепь оставить длинной', minutes: 35, activity: 'heavy', risky: true, terminal: true, goto: 'c19_a_letter',
        outcomes: [
          { id: 'ok', check: { traits: ['technical', 'strength'], difficulty: 3, uses: ['strength'], mods: [{ when: { has: 'gloves' }, bonus: 1 }] }, text: 'Ты выкручиваешь кольцо совсем, держа цепь ногой, и вкручиваешь его в соседний столб, дубовый, на уровне колена. Цепь той же длины. Сесть он может. Вырвать — нет.', effects: [set19('aba', 'post'), w19('ring', 'moved'), npc('c7_nina', 1, 'c19_ring_moved')] },
          { id: 'fail', text: 'Дуб не поддаётся: кольцо идёт криво и застревает на половине. Ты возвращаешь его в старый столб и вкручиваешь до упора, сбивая ладони о лом. Цепь стала короче.', effects: [set19('aba', 'fail'), w19('ring', 'fixed'), { injure: 'bruise', site: 'hands', severity: 1 }, npc('c7_nina', -1, 'c19_ring_fixed')] },
        ] },
      { id: 'c19_aba_leave', label: 'Ничего не трогать', minutes: 5, terminal: true, goto: 'c19_a_letter',
        text: 'Ты выходишь и прикрываешь дверь, засов задвигаешь до половины, как было. Кольцо держится в столбе на трёх витках из десяти.', effects: [set19('aba', 'leave'), w19('ring', 'loose')] },
      { id: 'c19_aba_jannes', label: 'Позвать Яннеса: пусть посмотрит сам', when: jannesHere, minutes: 15, terminal: true, goto: 'c19_a_letter',
        text: 'Яннес смотрит на кольцо, потом на одеяло.\n\n— Jede Nacht? — спрашивает он. Каждую ночь?\n\nОн вкручивает кольцо до упора, молча и зло, и забирает одеяло с собой.', effects: [set19('aba', 'jannes'), w19('ring', 'fixed'), w19('nina_barn_told', true), npc('c7_nina', -2, 'c19_ring_fixed')] },
    ] }),

  // ───────────── A: до обеда ─────────────
  A({ id: 'c19_a_soldier', title: 'Молодой', camp: yard14, ambient: day19,
    text: [
      { text: 'Старший идёт к машине говорить по рации. Молодой остаётся у ворот. Ему лет девятнадцать, уши красные от холода, автомат висит на нём неловко, как чужой.' },
      { text: '— Haben Sie was Heißes? — спрашивает он тихо. — Wir sind seit fünf unterwegs.\n\nЕсть что-нибудь горячее? Мы с пяти на ногах.' },
      { text: 'И, глядя на дорогу:\n\n— Am Montag fahren wir die Höfe ab. Diesel, Benzin. Für die Fahrzeuge.\n\nВ понедельник объезжаем дворы. Солярка, бензин. Для машин.' },
      { when: flag('w.c19_gun_lie'), text: '— Opa hatte auch eine, — добавляет он, ни к кому не обращаясь. — Im Keller. Am Montag suchen sie mit Hund.\n\nУ деда тоже было. В подвале. В понедельник будут искать с собакой.' },
    ],
    actions: [
      { id: 'c19_as_tea', label: 'Вынести ему горячего чаю', minutes: 10, terminal: true, goto: 'c19_a_flue',
        text: 'Он пьёт, обжигаясь, и держит кружку двумя руками в перчатках с обрезанными пальцами. Говорит, что он из Харбурга, что мать там и связи с ней нет с субботы. Отдавая кружку, он говорит «danke» так, будто это длинное слово.', effects: [set19('as', 'tea'), w19('search_known', true)] },
      { id: 'c19_as_trade', label: 'Предложить бутылку шнапса', when: flag('w.c19_schnaps'), minutes: 10, terminal: true, goto: 'c19_a_flue',
        text: 'Он оглядывается на машину. Бутылка исчезает под курткой. Взамен из подсумка появляются упаковка батареек и индивидуальный перевязочный пакет.\n\n— Für den Notfall, — говорит он. На крайний случай.', effects: [set19('as', 'trade'), w19('search_known', true), w19('schnaps_traded', true), { give: 'batteries_aa' }, { give: 'bandages' }] },
      { id: 'c19_as_ask', label: 'Спросить, что ещё будут искать', minutes: 10, terminal: true, goto: 'c19_a_flue',
        text: '— Alles, was fährt und schießt. — Он мнётся. — Und die Genesenen kommen auf eine Liste. Bus am Montag. Freiwillig, sagt Brandt.\n\nВсё, что ездит и стреляет. А переболевших — в список. Автобус в понедельник. Добровольно, говорит Брандт.\n\nСлово «freiwillig» он произносит так, будто сам в него не верит.', effects: [set19('as', 'ask'), w19('search_known', true), w19('monday_bus', true)] },
      { id: 'c19_as_send', label: 'Сказать, чтобы шёл греться в машину', minutes: 2, terminal: true, goto: 'c19_a_flue',
        text: 'Он кивает и уходит. Старший уже заводит мотор.', effects: [set19('as', 'send'), w19('search_known', true)] },
    ] }),

  A({ id: 'c19_a_flue', title: 'Тяга', camp: kitchen14,
    text: [
      { text: 'Перед обедом растапливают плиту, и через минуту кухня полна дыма. Он идёт не в трубу, а обратно: из-под конфорок, серыми языками. У всех слезятся глаза.' },
      { when: henrikeHome, text: 'Хенрике машет полотенцем у открытой дверцы.\n\n— Die Dohlen, — говорит она. — Jedes Jahr.\n\nГалки. Каждый год.' },
      { when: not(henrikeHome), text: 'Кто-то распахивает дверь во двор. Дым тянется наружу, а плита гаснет.' },
      { text: 'Труба общая: в неё же уходит печь в комнате наверху, где спят. Если тяга такая днём, ночью дыму будет некуда деться.' },
    ],
    actions: [
      { id: 'c19_af_brush', label: 'Залезть на крышу и прочистить трубу гирей на верёвке', minutes: 45, activity: 'heavy', risky: true, terminal: true, goto: 'c19_a_noon',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'technical'], difficulty: 3, uses: ['strength', 'mobility'], mods: [{ when: { has: 'gloves' }, bonus: 1 }, { when: own19('ar', 'slip'), bonus: -1 }] }, text: 'Черепица скользкая, но у трубы есть скоба. Ты опускаешь в трубу гирю от старых весов на бельевой верёвке, поднимаешь, опускаешь. Внизу с грохотом падает в топку гнездо, сажа и дохлая галка. Снизу кричат, что тянет.', effects: [set19('af', 'brush'), w19('flue', 'clean')] },
          { id: 'slip', text: 'На обратном пути нога уходит с обледенелой черепицы. Ты съезжаешь до водостока и висишь на нём, пока снизу не подставляют лестницу. Колено разбито, ладонь содрана о жёлоб. Гнездо застряло ниже, чем достала гиря.', effects: [set19('af', 'slip'), w19('flue', 'half'), { injure: 'bruise', site: 'leftLeg', severity: 2 }] },
        ], effects: [until(19, 12, 45)] },
      { id: 'c19_af_burn', label: 'Выжечь сажу: сухие поленья и картофельные очистки', minutes: 25, terminal: true, goto: 'c19_a_noon',
        text: 'Ты забиваешь топку сухими поленьями, сверху сыплешь картофельные очистки, как делали в деревнях. Труба гудит, из неё летят искры и чёрные хлопья. Через двадцать минут дым идёт куда надо. Не до конца, но идёт.', effects: [set19('af', 'burn'), w19('flue', 'burnt'), until(19, 12, 45)] },
      { id: 'c19_af_cold', label: 'Сказать всем: ночью наверху не топить', minutes: 5, terminal: true, goto: 'c19_a_noon',
        text: 'Ты закрываешь заслонку печи наверху и говоришь вслух, для всех: ночью не топить. Будет холодно. Зато все проснутся.', effects: [set19('af', 'cold'), w19('flue', 'cold'), until(19, 12, 45)] },
      { id: 'c19_af_leave', label: 'Проветрить и заняться делом', minutes: 5, terminal: true, goto: 'c19_a_noon',
        text: 'Ты открываешь окна настежь. Через полчаса дым выходит, плиту растапливают снова, осторожно. Вроде бы тянет.', effects: [set19('af', 'leave'), w19('flue', 'left'), until(19, 12, 45)] },
    ] }),

  // ───────────── A: после обеда ─────────────
  A({ id: 'c19_a_cart', title: 'Телега из деревни', camp: yard14, ambient: day19,
    text: [
      { text: 'После обеда к воротам подъезжает трактор с прицепом. На прицепе мешки, два молочных бидона и клетка с курами. Двое мужчин с повязками пожарной дружины. Старший показывает бумагу с печатью.' },
      { text: '— Für die Küche im Punkt. Kartoffeln, Eier, was ihr habt. Und Treibstoff, wenn welcher da ist. Anordnung Brandt.\n\nДля кухни в пункте. Картошка, яйца, что есть. И топливо, если есть. Распоряжение Брандта.' },
      { text: 'Второй, помоложе, уже ходит по двору. Заглядывает под навес, в сарай с дровами. Останавливается за длинным сараем у навозной кучи и пробует её вилами.' },
      { when: v('w.c19_diesel', 'marked'), text: 'В трёх шагах от него торчит твоя палка.' },
    ],
    actions: [
      { id: 'c19_act_potato', label: 'Отдать мешок картошки: для супа людям', minutes: 20, activity: 'moderate', terminal: true, outcomes: afterCart,
        text: 'Вы грузите мешок вдвоём. Старший ставит в бумаге галочку: «Lüdemann, 20 kg».\n\n— Brandt vergisst das nicht, — говорит он. Брандт такое не забывает.', effects: [set19('act', 'potato'), w19('cart', 'potatoes'), giveAway('potatoes', 20), npc('c16_brandt', 1)] },
      { id: 'c19_act_eggs', label: 'Дать дюжину яиц и отправить дальше', minutes: 10, terminal: true, outcomes: afterCart,
        text: 'Ты выносишь два лотка. Старший пересчитывает, будто ему могли недодать, и пишет: «Eier, 12». Второй не уходит от навоза.', effects: [set19('act', 'eggs'), w19('cart', 'eggs'), giveAway('eggs', 2)] },
      { id: 'c19_act_refuse', label: 'Сказать: здесь самим не хватает', minutes: 10, terminal: true, outcomes: afterCart,
        text: '— Hier essen zwölf Leute von einem Hof, — говоришь ты. Здесь с одного двора едят двенадцать человек.\n\nСтарший пишет в бумаге одно слово. Ты читаешь его вверх ногами: «verweigert». Отказал.', effects: [set19('act', 'refuse'), w19('cart', 'refused'), npc('c16_brandt', -2)] },
    ] }),

  A({ id: 'c19_a_cart2', title: 'Вилы', camp: yard14, ambient: day19,
    text: [
      { text: 'Молодой втыкает вилы в кучу, вынимает, переходит на шаг. Ещё раз. Он идёт вдоль кучи, как по грядке.' },
      { text: 'До того места, где лежит солярка Оле, ему шагов пять.' },
    ],
    actions: [
      { id: 'c19_ac2_hen', label: 'Позвать его к курятнику: отдать курицу, что не несётся', minutes: 15, terminal: true, goto: 'c19_a_well',
        text: '— Komm mal, — зовёшь ты. — Die da legt nicht mehr. Nehmt sie für die Suppe.\n\nИди сюда. Вот эта больше не несётся. Берите в суп.\n\nОн бросает вилы и идёт ловить. Курица бегает от него по двору минут десять. Когда трактор отъезжает, вилы так и стоят в куче, в пяти шагах от канистры.', effects: [set19('ac2', 'hen'), w19('cart_hen', true)] },
      { id: 'c19_ac2_truth', label: 'Сказать прямо: там солярка Оле, для трактора', minutes: 15, terminal: true, goto: 'c19_a_well',
        text: 'Старший долго смотрит на тебя, потом пишет: «Diesel, ca. 14 l, Lüdemann, für Trecker».\n\n— Das entscheidet Brandt. Montag.\n\nЭто решит Брандт. В понедельник.\n\nСолярку они не трогают. Но теперь она на бумаге.', effects: [set19('ac2', 'truth'), w19('diesel_declared', true), npc('c16_brandt', 1)] },
      { id: 'c19_ac2_wait', label: 'Молчать и смотреть', minutes: 10, risky: true, terminal: true, goto: 'c19_a_well',
        outcomes: [
          { id: 'miss', check: { traits: ['persuasion'], difficulty: 3, uses: ['focus'] }, text: 'Ты стоишь у ворот и говоришь со старшим о погоде, о курах, о чём угодно. Молодой втыкает вилы в ладони от того места, сплёвывает и уходит к трактору. У тебя мокрая спина.', effects: [set19('ac2', 'miss')] },
          { id: 'found', text: 'Вилы звенят о железо. Молодой разгребает навоз руками и вытаскивает канистру, чёрную, в соломе.\n\n— Für die Fahrzeuge, — говорит старший и вписывает в бумагу. Для машин.\n\nКанистра уезжает на прицепе, между бидонами.', effects: [set19('ac2', 'found'), w19('diesel', 'taken'), w19('diesel_taken', true)] },
        ] },
    ] }),

  // ───────────── A: вечер у переезда ─────────────
  A({ id: 'c19_a_mailbag', title: 'Сумка', location: 'c10_field', camp: tense14, ambient: cold19,
    text: [
      { text: 'Канистра стоит у ног. Почтальон затих: смотрит на тебя через треснувшее стекло и не моргает.' },
      { text: 'На заднем сиденье, под осколками, жёлтая почтовая сумка. Клапан расстёгнут, письма высыпались и намокли. Заднее стекло выбито. До сумки можно дотянуться, если просунуть руку по плечо.' },
    ],
    actions: [
      { id: 'c19_amb_bag', label: 'Достать сумку через заднее окно', minutes: 10, risky: true, terminal: true, goto: 'c19_eve',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'], mods: [{ when: { has: 'gloves' }, bonus: 1 }] }, text: 'Ты ложишься на холодный бок машины и шаришь рукой по сиденью. Почтальон дёргается на ремне, пальцы скребут по подголовнику в двух ладонях от твоего локтя. Ремень сумки, рывок, и она у тебя. Тяжёлая, мокрая. Сверху лежит открытка с небоскрёбами: «Liebe Mama, lieber Papa…» Адрес в Бухгольце, твоя улица. Брокман.', effects: [set19('amb', 'bag'), w19('mailbag', true), w19('mail_card', true)] },
          { id: 'cut', text: 'Осколок в раме входит в ладонь, когда ты дёргаешь ремень. Сумка цепляется и остаётся внутри. Почтальон бьётся о стекло рядом с твоей рукой. Ты отдёргиваешь руку и отходишь. С пальцев капает.', effects: [set19('amb', 'cut'), { injure: 'cut', site: 'hands', severity: 1, bleeding: 1 }, { body: 'stress', delta: 2 }] },
        ] },
      { id: 'c19_amb_floor', label: 'Подобрать то, что выпало на землю', minutes: 10, terminal: true, goto: 'c19_eve',
        text: 'У двери в мёрзлой траве несколько конвертов. Два счёта, рекламная газета и открытка с небоскрёбами: «Liebe Mama, lieber Papa, ich komme zu Weihnachten…» Дорогие мама и папа, я приеду на Рождество. Адрес в Бухгольце, твоя улица. Брокман. Подпись: Thomas.', effects: [set19('amb', 'floor'), w19('mail_card', true)] },
      { id: 'c19_amb_end', label: 'Закончить это', when: any({ has: 'crowbar' }, { has: 'hammer' }), minutes: 15, terminal: true, goto: 'c19_eve',
        text: 'Ты бьёшь через выбитое заднее стекло. Один раз, второй. Стук прекращается. В тишине слышно, как из шланга капает бензин. Сумку ты достаёшь потом, медленно, не глядя вперёд.', effects: [set19('amb', 'end'), w19('postman', 'end'), w19('mailbag', true), w19('mail_card', true), { body: 'stress', delta: 4 }] },
      { id: 'c19_amb_go', label: 'Уйти, пока видно дорогу', minutes: 2, terminal: true, goto: 'c19_eve',
        text: 'Ты поднимаешь канистру и уходишь. Через двадцать шагов стук начинается снова.', effects: [set19('amb', 'go')] },
    ] }),

  // ───────────── B: Йестебург ─────────────
  B({ id: 'c19_b_bridge', title: 'Мост через Зееве', location: village, ambient: day19,
    text: [
      { text: 'На мосту через Зееве поперёк дороги стоит телега, на ней мешки с песком. Пост дружины: старик в зелёной охотничьей куртке с ружьём на ремне и двое подростков с повязками.' },
      { text: '— Taschen auf, — говорит старик, не грубо, устало. — Medikamente werden im Punkt abgegeben. Anordnung Brandt.\n\nСумки открыть. Лекарства сдаются в пункт. Распоряжение Брандта.' },
      { text: 'Перед тобой женщина с рюкзаком. Подросток вынимает у неё из бокового кармана пачку таблеток и кладёт в ящик из-под пива. Женщина смотрит на ящик, как на гроб.' },
      { when: { has: 'c18_insulin' }, text: 'Две шприц-ручки лежат у тебя в сумке, завёрнутые в перчатку.' },
      { when: { has: 'c17_vet_pen' }, text: 'Флаконы с коровьим пенициллином на дне сумки.' },
    ],
    actions: [
      { id: 'c19_bbr_open', label: 'Открыть сумку', minutes: 15, terminal: true, goto: 'c19_b_queue',
        outcomes: [
          { id: 'meds', when: hasMeds, text: 'Подросток перебирает вещи двумя пальцами и находит перчатку. Разворачивает. Старик кивает на ящик.\n\n— Kriegt der Punkt. Die wissen, wer es braucht.\n\nОтдадим в пункт. Там знают, кому нужнее.\n\nПротестовать некому: очередь за тобой ждёт.', effects: [set19('bbr', 'lost'), ...loseMeds, { body: 'stress', delta: 2 }] },
          { id: 'clean', text: 'Подросток перебирает вещи двумя пальцами и возвращает сумку.\n\n— Weiter.\n\nДальше.', effects: [set19('bbr', 'open')] },
        ] },
      { id: 'c19_bbr_koehler', label: 'Пусть Кёлер скажет за тебя', when: { npc: 'c3_koehler', alive: true, trust: ['>=', 3] }, minutes: 10, terminal: true, goto: 'c19_b_queue',
        text: 'Кёлер берёт старика за рукав.\n\n— Heinz. Die ist mit mir.\n\nХайнц. Она со мной.\n\nСтарик смотрит на тебя, на неё и машет рукой: проходите. Сорок лет он покупал у неё булочки.', effects: [set19('bbr', 'koehler'), npc('c3_koehler', 1)] },
      { id: 'c19_bbr_pocket', label: 'Пока стоите, переложить лекарства во внутренний карман', when: hasMeds, minutes: 15, risky: true, terminal: true, goto: 'c19_b_queue',
        outcomes: [
          { id: 'ok', check: { traits: ['stealth'], difficulty: 3, uses: ['focus'] }, text: 'Ты делаешь вид, что ищешь платок, и перекладываешь свёрток под куртку. Подросток роется в сумке, находит там только хлеб и тетрадный листок. Дальше.', effects: [set19('bbr', 'pocket')] },
          { id: 'caught', text: 'Ты не успеваешь застегнуть куртку. Второй подросток хлопает тебя по боку, как в аэропорту, и вынимает свёрток.\n\n— Na also, — говорит старик. Ну вот.\n\nКёлер отворачивается. Ей стыдно, и непонятно за кого.', effects: [set19('bbr', 'caught'), ...loseMeds, npc('c3_koehler', -1), { body: 'stress', delta: 3 }] },
        ] },
      { id: 'c19_bbr_ford', label: 'Сказать Кёлер, что ты догонишь, и перейти речку по камням ниже моста', when: hasMeds, minutes: 25, risky: true, move: true, terminal: true, goto: 'c19_b_queue',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ниже моста Зееве мелкая и быстрая. Камни скользкие, но ты переходишь, не замочив ничего, кроме одного ботинка. Кёлер ждёт тебя у церкви и ничего не спрашивает.', effects: [set19('bbr', 'ford')] },
          { id: 'wet', text: 'На середине камень поворачивается под ногой. Ты садишься в воду по пояс. Сумку удаётся удержать над головой. До пожарной части ты идёшь {m:мокрый|мокрая}, и холод забирается под рёбра.', effects: [set19('bbr', 'wet'), w19('b_wet', true), { body: 'stress', delta: 2 }, { body: 'fatigue', delta: 5 }] },
        ] },
    ] }),

  B({ id: 'c19_b_crush', title: 'Давка', location: village, ambient: day19,
    text: [
      { text: 'К половине двенадцатого в ящиках у стола показывается дно. Солдат кричит, что на всех хватит, но очередь ему уже не верит. Задние напирают.' },
      { text: 'Рядом с тобой старуха в платке прижимает к груди сетку с хлебом и банкой. Мужчина в рабочей куртке дёргает сетку на себя, молча, как дёргают застрявшую дверь.' },
    ],
    actions: [
      { id: 'c19_bcr_grab', label: 'Схватить его за рукав', minutes: 10, risky: true, terminal: true, goto: 'c19_b_aid',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'persuasion'], difficulty: 3, uses: ['strength'] }, text: 'Ты вцепляешься ему в рукав и кричишь, громко, по-русски, первое, что приходит в голову. Он оборачивается, видит лица вокруг, бросает сетку и уходит, расталкивая людей. Старуха не говорит ни слова. Только кивает тебе, мелко и часто.', effects: [set19('bcr', 'ok'), w19('crush', 'held')] },
          { id: 'push', text: 'Он отмахивается, не глядя. Локтем. Ты падаешь на брусчатку, на ладони и колено. Когда ты поднимаешься, ни мужчины, ни сетки нет. Ладони ободраны, колено ноет.', effects: [set19('bcr', 'push'), w19('crush', 'fell'), { injure: 'bruise', site: 'leftLeg', severity: 1 }, { injure: 'scratch', site: 'hands', severity: 1 }, { body: 'stress', delta: 3 }] },
        ] },
      { id: 'c19_bcr_shout', label: 'Звать солдата', minutes: 10, terminal: true, goto: 'c19_b_aid',
        text: '— Hier! Hilfe!\n\nСолдат поворачивается, но между вами двадцать человек. Мужчина уже далеко, сетка у него под курткой. Старуха стоит с пустыми руками и смотрит туда, где он скрылся.', effects: [set19('bcr', 'shout'), w19('crush', 'shout')] },
      { id: 'c19_bcr_beans', label: 'Отдать старухе свою банку фасоли', when: { has: 'canned_beans' }, minutes: 10, terminal: true, goto: 'c19_b_aid',
        text: 'Сетку он уносит. Ты вкладываешь старухе в руки свою банку. Она держит её, как держат чужого ребёнка: осторожно, на вытянутых руках. Кёлер видит это и ничего не говорит.', effects: [set19('bcr', 'beans'), w19('crush', 'beans'), { take: 'canned_beans' }, npc('c3_koehler', 1)] },
      { id: 'c19_bcr_away', label: 'Прижать к себе сумку и выбраться из толпы', minutes: 10, terminal: true, goto: 'c19_b_aid',
        text: 'Ты выбираешься к стене, прижимая сумку локтем. За спиной кто-то кричит, кто-то плачет. Когда ты оборачиваешься, старухи уже не видно.', effects: [set19('bcr', 'away'), w19('crush', 'away'), { body: 'stress', delta: 1 }] },
    ] }),

  B({ id: 'c19_b_stitch', title: 'Рваная рана', location: sammel, ambient: indoorV,
    text: [
      { text: 'Под конец часа в зал вводят мужчину с рукой, замотанной курткой. Колючая проволока: предплечье распорото от локтя почти до кисти, второй порез поменьше выше, на плече.' },
      { text: '— Halten, — говорит тебе врач и показывает на руку. — Und das Licht.\n\nДержите. И свет.\n\nПотом, уже с иглой в пальцах, кивает на плечо:\n\n— Die kleine können Sie. Streifen. Ich zeige es einmal.\n\nМаленькую можете вы. Полосками. Я покажу один раз.' },
    ],
    actions: [
      { id: 'c19_bst_strips', label: 'Закрыть маленькую рану полосками, как она покажет', minutes: 20, risky: true, terminal: true, goto: 'c19_b_mats',
        outcomes: [
          { id: 'ok', check: { traits: ['medicine'], difficulty: 2, uses: ['focus'] }, text: 'Она показывает: промыть, свести края пальцами, полоску поперёк, следующую через полсантиметра. У тебя дрожат руки на первой и не дрожат на четвёртой. Врач смотрит на твою работу дольше, чем на свою.\n\n— Gut. Das vergessen Sie nicht mehr.\n\nХорошо. Это вы уже не забудете.', effects: [set19('bst', 'ok'), w19('b_stitch', 'strips'), w19('doc_trust', true)] },
          { id: 'shaky', text: 'Края расходятся, как только ты убираешь пальцы. Вторая полоска ложится криво. Врач молча забирает у тебя пинцет и переклеивает. Ты держишь свет и стараешься запомнить, как она это делает.', effects: [set19('bst', 'shaky'), w19('b_stitch', 'seen'), { body: 'stress', delta: 2 }] },
        ] },
      { id: 'c19_bst_hold', label: 'Держать руку и свет, смотреть', minutes: 20, terminal: true, goto: 'c19_b_mats',
        text: 'Ты держишь фонарь и смотришь, как игла входит и выходит, ровно, через сантиметр. Мужчина смотрит в потолок и считает вслух по-польски. На двенадцатом стежке врач говорит «fertig». Готово.', effects: [set19('bst', 'hold'), w19('b_stitch', 'seen')] },
      { id: 'c19_bst_out', label: 'Выйти: темнеет в глазах', minutes: 10, terminal: true, goto: 'c19_b_mats',
        text: 'Ты успеваешь дойти до шведской стенки и сесть на пол. Женщина с соседней раскладушки даёт тебе воды. Через пять минут проходит.', effects: [set19('bst', 'out'), { body: 'stress', delta: 2 }] },
    ] }),

  B({ id: 'c19_b_market', title: 'Обмен у гаража', location: village, ambient: day19,
    text: [
      { text: 'За пожарной частью, у гаражей, меняются. Никто не называет это рынком. Прямо на капотах и ящиках лежат свечи, детские сапоги, банки, мотки проволоки, кофе в зёрнах, таблетки для воды. Деньги никто не берёт.' },
      { text: 'Мужчина в очках меняет мыло и спички на еду. Девочка лет десяти продаёт комиксы и плачет, когда их листают и кладут обратно.' },
      { when: flag('w.c19_needs_list'), text: 'Листок из подвала Хенрике у тебя в кармане: мыло, спички, соль.' },
    ],
    actions: [
      { id: 'c19_bmk_wurst', label: 'Поменять колбасу на мыло и спички', when: { has: 'c18_wurst' }, minutes: 15, terminal: true, goto: 'c19_b_lunch',
        text: 'Мужчина в очках нюхает колбасу долго, как вино. Потом кладёт на капот два куска хозяйственного мыла и три коробка спичек.\n\n— Geräuchert? Selbst? Wenn ihr mehr habt — ich bin jeden Donnerstag hier.\n\nКопчёная? Сами? Если будет ещё — я тут каждый четверг.', effects: [set19('bmk', 'wurst'), { take: 'c18_wurst' }, { give: 'c19_soap' }, { give: 'c19_matches' }, w19('market_thursday', true)] },
      { id: 'c19_bmk_beans', label: 'Поменять банку фасоли на свечи', when: { has: 'canned_beans' }, minutes: 15, terminal: true, goto: 'c19_b_lunch',
        text: 'Свечи хозяйственные, белые, три штуки в бумаге. За банку фасоли женщина отдаёт их, не торгуясь, и сразу прячет банку в коляску под одеяло, где спит ребёнок.', effects: [set19('bmk', 'beans'), { take: 'canned_beans' }, { give: 'candles' }] },
      { id: 'c19_bmk_fuel', label: 'Спросить, кто меняет бензин', minutes: 15, terminal: true, goto: 'c19_b_lunch',
        text: 'Мужчина в очках смеётся, потом перестаёт.\n\n— Der alte Harms, an der Tankstelle in Itzenbüttel. Einen Liter für ein Huhn. Lebend. Aber er hat einen Hund und eine Schrotflinte, und er mag keine Fremden.\n\nСтарый Хармс, на заправке в Итценбюттеле. Литр за курицу. Живую. Но у него собака и дробовик, и чужих он не любит.', effects: [set19('bmk', 'fuel'), w19('harms_known', true)] },
      { id: 'c19_bmk_cash', label: 'Отдать пятьдесят евро старику за коробок спичек', when: { has: 'cash_eur' }, minutes: 10, terminal: true, goto: 'c19_b_lunch',
        text: 'Старик берёт синюю бумажку, разглаживает её на колене и смотрит на свет.\n\n— Für meinen Enkel, — говорит он. — Damit er weiß, wie Geld aussah.\n\nДля внука. Чтобы знал, как выглядели деньги.\n\nКоробок спичек он отдаёт тебе вместе с улыбкой, какой ты давно ни у кого не {m:видел|видела}.', effects: [set19('bmk', 'cash'), { give: 'c19_matches' }] },
      { id: 'c19_bmk_look', label: 'Ничего не менять: только посмотреть, что берут', minutes: 10, terminal: true, goto: 'c19_b_lunch',
        text: 'Ты обходишь ряд дважды. Дороже всего здесь сапоги, бензин и антибиотики. Дешевле всего — книги и деньги.', effects: [set19('bmk', 'look')] },
    ] }),

  B({ id: 'c19_b_funeral', title: 'У церкви', location: village, ambient: day19,
    text: [
      { text: 'За церковью, на старом кладбище, хоронят. Три ямы, три свёртка в белых простынях на досках. Ни пастора, ни гробов. Читает вслух пожилая женщина в пальто с меховым воротником; люди говорят, это жена Брандта.' },
      { text: 'Двое мужчин с лопатами ждут, опираясь на черенки. Земля сверху смёрзлась, внизу она рыжая и мокрая.' },
    ],
    actions: [
      { id: 'c19_bfn_dig', label: 'Взять третью лопату и помочь засыпать', minutes: 30, activity: 'heavy', terminal: true, goto: 'c19_b_bakery',
        text: 'Лопата тяжелее, чем кажется, а земля тяжелее лопаты. Мужчины не говорят тебе ни слова, только один кивает, когда вы заканчиваете третью яму. Кёлер ждёт у ограды и смотрит на тебя по-новому.', effects: [set19('bfn', 'dig'), npc('c3_koehler', 1), { body: 'fatigue', delta: 5 }] },
      { id: 'c19_bfn_ask', label: 'Спросить могильщика, от чего они умерли', minutes: 15, terminal: true, goto: 'c19_b_bakery',
        text: 'Могильщик вытирает лоб рукавом.\n\n— Die zwei da hatten Plasma. Dienstag. Ging ihnen besser, die haben gelacht, gegessen. Gestern Nacht… — Он втыкает лопату в землю. — Und der dritte hatte keins. Bei dem ging es schneller.\n\nУ этих двоих была плазма. Во вторник. Им стало лучше, они смеялись, ели. А вчера ночью… А у третьего не было. У него просто быстрее.', effects: [set19('bfn', 'ask'), w19('plasma_doubt', true)] },
      { id: 'c19_bfn_stand', label: 'Постоять до конца молитвы', minutes: 15, terminal: true, goto: 'c19_b_bakery',
        text: 'Ты стоишь со всеми. Женщина читает по бумажке, сбиваясь на именах: каждое из них она видит в первый раз. На последнем имени она останавливается и читает его дважды.', effects: [set19('bfn', 'stand'), { body: 'stress', delta: 1 }] },
      { id: 'c19_bfn_pass', label: 'Пройти мимо', minutes: 5, terminal: true, goto: 'c19_b_bakery',
        text: 'Ты прибавляешь шаг. Голос женщины слышно до самой пекарни.', effects: [set19('bfn', 'pass')] },
    ] }),

  B({ id: 'c19_b_ride', title: 'Пикап', location: lane, ambient: cold19,
    text: [
      { text: 'За последними домами тебя догоняет пикап с прицепом для скота. Едет медленно, объезжая ямы. Останавливается рядом.' },
      { text: 'За рулём женщина лет шестидесяти в стёганом жилете, в кузове овчарка. Окно опускается.\n\n— Nach Lüllau? Ich kann dich bis zur Abzweigung mitnehmen.\n\nВ сторону Люллау? Могу подвезти до развилки.' },
    ],
    actions: [
      { id: 'c19_brd_yes', label: 'Сесть и сказать, где живёшь', minutes: 10, terminal: true, goto: 'c19_b_back',
        text: 'В кабине пахнет собакой и коровами. Женщина держит руль одной рукой.\n\n— Lüdemann? Henrike? Ich hab Milch, jeden Tag, mehr als ich los werde. Ich brauch Diesel. Wenn ihr was habt, sag Bescheid.\n\nЛюдеманы? Хенрике? У меня молоко, каждый день, девать некуда. Мне нужна солярка. Если у вас есть, скажи.\n\nОна высаживает тебя у развилки и машет, не оборачиваясь.', effects: [set19('brd', 'yes'), w19('milk_offer', true), { body: 'fatigue', delta: -3 }] },
      { id: 'c19_brd_lie', label: 'Сесть, но сказать, что живёшь в Йестебурге', minutes: 10, terminal: true, goto: 'c19_b_back',
        text: '— Bei Köhler, — говоришь ты. У Кёлер.\n\nЖенщина смотрит на тебя сбоку, но ничего не говорит. У развилки ты выходишь и ждёшь, пока пикап скроется, прежде чем свернуть к хутору.', effects: [set19('brd', 'lie'), { body: 'fatigue', delta: -3 }] },
      { id: 'c19_brd_no', label: 'Поблагодарить и идти пешком', minutes: 30, move: true, terminal: true, goto: 'c19_b_back',
        text: 'Женщина пожимает плечами и уезжает. Овчарка смотрит на тебя из кузова до самого поворота. Ты идёшь, перекладывая сумку с плеча на плечо.', effects: [set19('brd', 'no'), { body: 'fatigue', delta: 3 }] },
    ] }),

  // ───────────── Вечер вместе ─────────────
  both({ id: 'c19_knock', title: 'Стук у ворот', camp: yard14, ambient: cold19,
    text: [
      { text: 'Без двадцати шесть, уже в темноте, кто-то стучит палкой по штакетнику у ворот. Негромко, вежливо.' },
      { text: '— Hallo? Bitte. Wir wollen nichts Böses.\n\nПожалуйста. Мы ничего плохого не хотим.' },
      { text: 'Мужчина, женщина и мальчик лет двенадцати с садовой тачкой. В тачке узлы и переноска с кошкой. Они из Харбурга, идут в Люнебург: там, говорят, кормят. Левая кисть мужчины замотана полотенцем, на полотенце бурое пятно.' },
      { text: '— Glas, — говорит он сразу и поднимает руку к свету. — Ein Fenster. Kein Biss.\n\nСтекло. Окно. Не укус.' },
      { when: dogHere, text: 'Бруно лает у ворот хрипло, на одной ноте, пока ты на него не шикаешь.' },
      { when: B19, text: '{A} уже у ворот с фонарём.' },
    ],
    actions: [
      { id: 'c19_kn_loft', label: 'Пустить на сеновал до утра', when: A19, minutes: 20, terminal: true, goto: 'c19_prep',
        text: 'Ты ведёшь их к сеновалу над старым хлевом, подальше от длинного сарая. Мужчина благодарит три раза. Женщина ничего не говорит, только кладёт руку мальчику на затылок.', effects: [set19('kn', 'loft'), w19('knock', 'loft'), until(19, 18, 0)] },
      { id: 'c19_kn_hand', label: 'Сначала размотать руку и посмотреть при фонаре', when: A19, minutes: 25, terminal: true, goto: 'c19_prep',
        text: 'Ты разматываешь полотенце. Порез через всю ладонь, глубокий, края ровные. Стекло. Он не врёт. Ты промываешь руку водой из чайника и заматываешь заново, чистым, а потом ведёшь их на сеновал над хлевом.', effects: [set19('kn', 'hand'), w19('knock', 'loft'), useBandage, until(19, 18, 0)] },
      { id: 'c19_kn_food', label: 'Вынести хлеба и воды, но во двор не пускать', when: A19, minutes: 15, terminal: true, goto: 'c19_prep',
        text: 'Ты передаёшь через штакетник хлеб и бутылку воды. Мужчина кивает, будто так и думал. Они уходят по дороге к шоссе. Тачка скрипит, пока её слышно.', effects: [set19('kn', 'food'), w19('knock', 'food'), until(19, 18, 0)] },
      { id: 'c19_kn_no', label: 'Сказать через ворота: идите дальше', when: A19, minutes: 5, terminal: true, goto: 'c19_prep',
        text: '— Weiter, — говоришь ты. — Hier ist kein Platz.\n\nДальше. Тут места нет.\n\nОни не спорят. Тачка скрипит, удаляясь. Мальчик оборачивается один раз.', effects: [set19('kn', 'no'), w19('knock', 'no'), until(19, 18, 0)] },
      { id: 'c19_kn_soup', label: 'Налить в банку горячего супа и вынести им', when: B19, minutes: 15, terminal: true, goto: 'c19_prep',
        text: 'Ты переливаешь остатки супа в банку из-под огурцов и несёшь к воротам, обжигая пальцы через рукав. Женщина берёт банку обеими руками и не отдаёт мальчику, пока не попробует сама, не слишком ли горячо.', effects: [set19('kn', 'soup'), until(19, 18, 0)] },
      { id: 'c19_kn_kit', label: 'Взять аптечку и посмотреть его руку', when: B19, minutes: 20, terminal: true, goto: 'c19_prep',
        outcomes: [
          { id: 'learned', when: flag('w.c19_b_stitch'), text: 'Ты разматываешь полотенце так, как днём в спортзале: от края к центру. Порез через ладонь, ровный. Стекло, он не врёт. Ты промываешь, сводишь края и бинтуешь туго и чисто. Мужчина смотрит на повязку и на тебя.\n\n— Sind Sie Ärztin?\n\nВы врач?', effects: [set19('kn', 'kit')] },
          { id: 'plain', text: 'Ты разматываешь полотенце. Ладонь распорота ровно, похоже на стекло. Ты промываешь, как умеешь, и бинтуешь. Повязка выходит толстая и неловкая, но держит.', effects: [set19('kn', 'kit')] },
        ], effects: [useBandage, until(19, 18, 0)] },
      { id: 'c19_kn_nina', label: 'Остаться у окна с Ниной', when: all(B19, ninaFarm), minutes: 15, terminal: true, goto: 'c19_prep',
        text: 'Нина стоит рядом и смотрит на мальчика у ворот.\n\n— Er hat eine Katze, — шепчет она. У него кошка.\n\nЭто первое, что она говорит тебе за вечер.', effects: [set19('kn', 'nina'), npc('c7_nina', 1), until(19, 18, 0)] },
      { id: 'c19_kn_watch', label: 'Смотреть с крыльца', when: B19, minutes: 10, terminal: true, goto: 'c19_prep',
        text: 'Ты стоишь на крыльце, обхватив себя руками. У ворот говорят негромко, по-немецки. Мальчик гладит кошку через решётку переноски.', effects: [set19('kn', 'watch'), until(19, 18, 0)] },
    ] }),

  both({ id: 'c19_prep', title: 'Перед ужином', camp: { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief' },
    text: [
      { text: 'До ужина полчаса. На плите греется вода, в доме пахнет мокрой шерстью и дымом.' },
      { when: v('w.c18_friday', 'go'), text: 'Завтра до рассвета в дорогу.' },
      { text: 'Все в доме чем-то заняты. Ты тоже.' },
    ],
    actions: [
      { id: 'c19_pr_gun', label: 'Почистить ружьё', when: all(A19, { has: 'c19_flinte' }), minutes: 30, terminal: true, goto: 'c19_supper',
        text: 'Ты разбираешь вертикалку на кухонном столе, на газете. Масло, ветошь, шомпол. Правый ствол чистый. Левый курок взводится туго и иногда срывается с полувзвода. Ты пробуешь пять раз. Дважды срывается. Значит, в деле надеяться можно только на правый.', effects: [set19('pr', 'gun'), w19('left_barrel', true), until(19, 18, 45)] },
      { id: 'c19_pr_car', label: 'Прогреть Corsa и подкачать колёса', when: all(A19, carHere), minutes: 25, ambientDuring: cold19, terminal: true, goto: 'c19_supper',
        text: 'Мотор схватывает со второго раза. Ты держишь его на холостых, пока не перестаёт дрожать стрелка. Заднее левое колесо мягкое. Ножной насос из сарая, двести качков, пока не согреваешься.', effects: [set19('pr', 'car'), w19('car_ready', true), until(19, 18, 45)] },
      { id: 'c19_pr_cloth', label: 'Нарезать бинтов из старой простыни и прокипятить', minutes: 35, terminal: true, goto: 'c19_supper',
        text: 'Простыня из сундука, льняная, мягкая от стирок. Ты рвёшь её на полосы в ладонь шириной и кипятишь в кастрюле. Потом сушишь у плиты и скатываешь. Выходит шесть рулонов.', effects: [set19('pr', 'cloth'), { give: 'bandages' }, until(19, 18, 45)] },
      { id: 'c19_pr_wash', label: 'Вымыться горячей водой, пока она есть', minutes: 30, activity: 'rest', terminal: true, goto: 'c19_supper',
        text: 'Таз, ковш, кусок мыла размером со спичечный коробок. Вода остывает быстро, но ты успеваешь. Впервые за день перестают болеть плечи.', effects: [set19('pr', 'wash'), { body: 'stress', delta: -2 }, { body: 'fatigue', delta: -3 }, until(19, 18, 45)] },
      { id: 'c19_pr_cards', label: 'Сыграть с Ниной в карты', when: ninaFarm, minutes: 30, terminal: true, goto: 'c19_supper',
        text: 'Нина играет в «Мау-мау» молча и всерьёз и выигрывает три раза из четырёх. На четвёртый тебе кажется, что она поддалась.', effects: [set19('pr', 'cards'), npc('c7_nina', 1), { body: 'stress', delta: -2 }, until(19, 18, 45)] },
      { id: 'c19_pr_album', label: 'Посидеть с Хенрике над её альбомом', when: henrikeHome, minutes: 30, terminal: true, goto: 'c19_supper',
        text: 'Хенрике показывает фотографии. Оле на тракторе в шесть лет. Оле в форме пожарного кружка. Оле с какой-то девушкой; эту страницу она перелистывает быстро.\n\n— Er war nie krank, — говорит она. — Nie.\n\nОн никогда не болел. Никогда.', effects: [set19('pr', 'album'), npc('henrike', 1), until(19, 18, 45)] },
    ] }),

  both({ id: 'c19_alone', title: 'Вдвоём', camp: house14,
    text: [
      { text: 'После ужина вы впервые за день одни: наверху, в вашей комнате, при одной свече. Внизу гремят посудой.' },
      { text: 'День у каждого был свой. Можно рассказать. Можно просто лечь.' },
    ],
    actions: [
      { id: 'c19_al2_gun', label: 'Рассказать про подвал и листок Оле', when: all(A19, flag('w.c19_gun')), minutes: 15, terminal: true, goto: 'c19_night',
        text: 'Ты рассказываешь шёпотом: часы, маленькая дверь, четыре патрона. Про «Брандту ничего не говорить». Свеча трещит. Лица в темноте не видно.', effects: [set19('told', 'gun'), { body: 'stress', delta: -1 }, until(19, 20, 40)] },
      { id: 'c19_al2_barn', label: 'Рассказать про Нину и сарай', when: all(A19, flag('w.c19_ring')), minutes: 15, terminal: true, goto: 'c19_night',
        text: 'Ты рассказываешь про следы на инее и про кольцо в столбе. Вслух это звучит так, будто выдаёшь чужую тайну.', effects: [set19('told', 'barn'), { body: 'stress', delta: -1 }, until(19, 20, 40)] },
      { id: 'c19_al2_fuel', label: 'Рассказать про универсал у переезда', when: all(A19, any(flag('w.c19_siphoned'), flag('w.c19_mail_card'))), minutes: 15, terminal: true, goto: 'c19_night',
        text: 'Ты рассказываешь про почтальона на ремне. Про шланг и вкус бензина. Руки до сих пор пахнут им, сколько ни мой.', effects: [set19('told', 'fuel'), { body: 'stress', delta: -1 }, until(19, 20, 40)] },
      { id: 'c19_al2_plasma', label: 'Рассказать про похороны у церкви', when: all(B19, flag('w.c19_plasma_doubt')), minutes: 15, terminal: true, goto: 'c19_night',
        text: 'Ты повторяешь слова могильщика так точно, как можешь. «Им стало лучше. Они смеялись». Потом долго молчишь {m:сам|сама}.', effects: [set19('told', 'plasma'), { body: 'stress', delta: -1 }, until(19, 20, 40)] },
      { id: 'c19_al2_monday', label: 'Рассказать про Брандта на ступенях', when: B19, minutes: 15, terminal: true, goto: 'c19_night',
        text: 'Ты рассказываешь про мегафон и про «ab Montag». Про Матса с мячом. Про мальчика с жёлтым пакетом. Свеча догорает до половины.', effects: [set19('told', 'monday'), { body: 'stress', delta: -1 }, until(19, 20, 40)] },
      { id: 'c19_al2_wound', label: 'Рассказать про рану в спортзале', when: all(B19, flag('w.c19_b_stitch')), minutes: 15, terminal: true, goto: 'c19_night',
        text: 'Ты показываешь на собственной руке: промыть, свести края, полоска поперёк. Руки помнят лучше, чем голова.', effects: [set19('told', 'wound'), { body: 'stress', delta: -1 }, until(19, 20, 40)] },
      { id: 'c19_al2_quiet', label: 'Ничего не рассказывать: просто лечь рядом', minutes: 10, terminal: true, goto: 'c19_night',
        text: 'Ты задуваешь свечу. В темноте слышно, как дышит дом: печь, половицы, ветер в трубе.', effects: [set19('told', 'quiet'), { body: 'stress', delta: -2 }, until(19, 20, 40)] },
    ] }),
];
