import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc } from './point19';
import { eldersCome, okaforComes } from './point33';
import { bNorth36, insulinHome36, kasia36, kasiaGoes36, lea36, way36 } from './point36';
import {
  S37, barn37, frost37, henrike37, lostDiesel37, lostFood37, lostGen37, set37, until37, w37,
} from './point37';

// Участок 37, линия B: Кася собирается (могила Тима), реквизиция из хлева, старики, корова, сумка медсестры (или аптечка дома),
// ручки инсулина для Мерле, Лея, Хенрике наедине; Нина; письмо; хлеб в дорогу; Окафор; подвал; сборы.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S37({ ...scene, for: 'any', chapter: 'ch3' });
const kasiaLeaves: Cond = all(kasia36, kasiaGoes36);
const timGrave: Cond = all(kasia36, v('w.c27_tim', 'farm'));
const toGrave = [{ id: 'g', when: timGrave, goto: 'c37_b_grave' }, { id: 't', goto: 'c37_b_truck' }];
const toLea = [{ id: 'l', when: lea36, goto: 'c37_b_lea' }, { id: 'h', goto: 'c37_b_henrike' }];
const pens = (n: number): Cond => ({ stocked: 'c21_insulin', qty: n, at: 'c3_farm_stock' });

export const day37BScenes: Scene[] = [
  X({ id: 'c37_b_kasia', title: 'Рюкзак', camp: kitchen14,
    text: [
      { when: kasiaLeaves, text: 'Кася сидит на кровати над раскрытым рюкзаком. Сверху лежит детский свитер, синий, с оленями. Тима. Она держит его на коленях и не может решить, класть или нет.' },
      { when: all(kasia36, not(kasiaGoes36)), text: 'Кася штопает носки у окна, все подряд, чьи найдёт. Она остаётся. Говорит, что так решила ещё в воскресенье, а вслух сказала только сейчас.' },
      { when: all(not(kasia36), evaHere), text: 'Эва перебирает свой узел: всё, что у неё есть, помещается в одну наволочку. Она складывает и раскладывает, как будто от порядка что-то зависит.' },
      { when: all(not(kasia36), not(evaHere)), text: 'Хенрике достаёт из сундука в сенях вещи: шерстяные носки, рукавицы, шарф. Раскладывает на лавке, чтобы каждый, кто завтра едет, взял своё.' },
    ],
    actions: [
      { id: 'c37_bk_sweater', label: 'Сказать Касе: возьми свитер', when: kasiaLeaves, minutes: 40, terminal: true, outcomes: toGrave,
        text: 'Кася кивает и кладёт свитер на самое дно, под всё. «Żeby się nie zgubił». Чтобы не потерялся. Застёгивает рюкзак и долго держит руку на застёжке.', effects: [set37('bk', 'sweater'), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 1 }] }, until37(7, 30)] },
      { id: 'c37_bk_help', label: 'Помочь Касе уложить рюкзак так, чтобы не тянул плечи', when: kasiaLeaves, minutes: 40, terminal: true, outcomes: toGrave,
        text: 'Тяжёлое — к спине, лёгкое — наверх, мягкое — между. Кася смотрит, как ты укладываешь, и в конце говорит: «Jak mama». Как мама. Она плачет без звука и тут же вытирает лицо рукавом.', effects: [set37('bk', 'help'), w37('kasia_pack', true), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 2 }] }, until37(7, 30)] },
      { id: 'c37_bk_stay', label: 'Спросить Касю, уверена ли она', when: kasiaLeaves, minutes: 40, terminal: true, outcomes: toGrave,
        text: '— Nie. — Кася улыбается криво. Нет. — Ale tam jest mama Dariusza. I groby moich. Tu jest tylko Tim.\n\nНо там мать Дариуша. И могилы моих. Здесь — только Тим.', effects: [set37('bk', 'stay'), until37(7, 30)] },
      { id: 'c37_bk_socks', label: 'Сесть штопать рядом с Касей', when: all(kasia36, not(kasiaGoes36)), minutes: 40, terminal: true, outcomes: toGrave,
        text: 'Вы штопаете вдвоём, молча. У Каси стежки мелкие и ровные, у тебя как получится. Она поправляет тебе нитку, не говоря ни слова.', effects: [set37('bk', 'socks'), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 1 }] }, until37(7, 30)] },
      { id: 'c37_bk_eva', label: 'Помочь Эве сложить узел', when: all(not(kasia36), evaHere), minutes: 40, terminal: true, outcomes: toGrave,
        text: 'Эва складывает, ты держишь углы. В узле фотография в рамке, без стекла: Хельмут, молодой, у машины. Эва кладёт её лицом вниз, между двумя кофтами.', effects: [set37('bk', 'eva'), { if: { npc: 'c8_eva', alive: true }, then: [{ npc: 'c8_eva', trust: 1 }] }, until37(7, 30)] },
      { id: 'c37_bk_chest', label: 'Разобрать с Хенрике тёплые вещи', when: all(not(kasia36), not(evaHere)), minutes: 40, terminal: true, outcomes: toGrave,
        text: 'Носки на всех, рукавицы на всех, кроме одной пары. Хенрике отдаёт свою: «Ich bleibe ja drinnen». Я-то в доме остаюсь.', effects: [set37('bk', 'chest'), npc('henrike', 1), until37(7, 30)] },
    ] }),

  X({ id: 'c37_b_grave', title: 'Яблоня', camp: yard14, ambient: frost37,
    text: [
      { text: 'За сараем, под яблоней, холмик в снегу и крест из двух реек. Кася стоит у него в куртке нараспашку.' },
      { when: kasiaLeaves, text: 'Она говорит, не оборачиваясь: «Kto mu będzie przynosił jabłka?» Кто ему будет приносить яблоки?' },
      { when: not(kasiaLeaves), text: 'Она приходит сюда каждое утро. Сегодня позвала тебя.' },
    ],
    actions: [
      { id: 'c37_bg_promise', label: 'Пообещать: мы будем приходить', minutes: 30, terminal: true, goto: 'c37_b_truck', ambientDuring: frost37,
        text: 'Кася кивает. Достаёт из кармана сморщенное яблоко с чердака и кладёт на холмик. Потом застёгивает куртку и идёт к дому. Ты остаёшься ещё на минуту.', effects: [set37('bg', 'promise'), w37('tim_grave_promise', true), { if: { npc: 'kasia', alive: true }, then: [{ npc: 'kasia', trust: 2 }] }, until37(8, 0)] },
      { id: 'c37_bg_stand', label: 'Просто постоять рядом', minutes: 30, terminal: true, goto: 'c37_b_truck', ambientDuring: frost37,
        text: 'Вы стоите рядом, пока снег не начинает скрипеть под ногами от холода. Кася берёт тебя под руку. Так вы и возвращаетесь к дому.', effects: [set37('bg', 'stand'), { body: 'stress', delta: -2 }, until37(8, 0)] },
      { id: 'c37_bg_harmonica', label: 'Попросить её сыграть Тиму на гармошке', minutes: 30, terminal: true, goto: 'c37_b_truck', ambientDuring: frost37,
        text: 'Кася качает головой: не умеет. Потом всё равно подносит гармошку к губам. Две ноты, туда-обратно, как дышат. Над сараем взлетает ворона.', effects: [set37('bg', 'harmonica'), until37(8, 0)] },
    ] }),

  X({ id: 'c37_b_truck', title: 'Из хлева', camp: yard14, ambient: barn37,
    text: [
      { text: 'Ты в хлеву, у коровы, когда к воротам подъезжает армейский грузовик. В щель между досками видно: Хаазе с бумагой, трое солдат, {partner} у ворот.' },
      { when: lostGen37, text: 'Солдаты идут к сараю. Через пять минут выкатывают генератор Дениза на тележке. Дениз стоит рядом и курит, не глядя.' },
      { when: lostDiesel37, text: 'Солдаты идут к сараю и выносят канистру солярки из третьего грузовика. Двадцать литров. Трактор теперь до весны.' },
      { when: lostFood37, text: 'Солдаты выносят из кладовки мешки с картошкой. Два. Хенрике считает их вслух, сжав губы.' },
    ],
    actions: [
      { id: 'c37_bt_out', label: 'Выйти и встать рядом с {partner.ins}', minutes: 30, terminal: true, goto: 'c37_b_elders', ambientDuring: frost37,
        text: 'Ты выходишь из хлева, вытирая руки о штаны, и встаёшь рядом. Ничего не говоришь. Солдаты оглядываются на тебя. Так их двое против троих, и это почему-то важно.', effects: [set37('bt', 'out'), until37(8, 40)] },
      { id: 'c37_bt_stay', label: 'Остаться с коровой: она нервничает от шума', minutes: 30, terminal: true, goto: 'c37_b_elders',
        text: 'Корова переступает и косит глазом на дверь. Ты гладишь её по шее и говоришь всякую чепуху, пока грузовик не уезжает.', effects: [set37('bt', 'stay'), until37(8, 40)] },
      { id: 'c37_bt_hens', label: 'Загнать кур в курятник и закрыть: на всякий случай', minutes: 30, terminal: true, goto: 'c37_b_elders', ambientDuring: frost37,
        text: 'Ты загоняешь кур в курятник и задвигаешь засов. Через минуту к курятнику подходит рыжий солдат, дёргает дверь, смотрит на засов и уходит. Ты слышишь, как он ругается.', effects: [set37('bt', 'hens'), w37('hens_locked', true), until37(8, 40)] },
    ] }),

  X({ id: 'c37_b_elders', title: 'Наверху', camp: kitchen14,
    text: [
      { when: eldersCome, text: 'Наверху у Петерсенов: у старика распухло колено, он не может спуститься. Фрау Кёрнер говорит, что её таблетки от давления кончаются в субботу.' },
      { when: all(not(eldersCome), evaHere), text: 'Эва кашляет третий день. Говорит, что ерунда. Кашель сухой, по ночам.' },
      { when: all(not(eldersCome), not(evaHere), ninaFarm), text: 'Нина чихает и шмыгает носом. Температуры нет, но глаза красные.' },
      { when: all(not(eldersCome), not(evaHere), not(ninaFarm)), text: 'У Хенрике распухли пальцы: на морозе суставы болят так, что она не может сжать подойник.' },
    ],
    actions: [
      { id: 'c37_be_look', label: 'Осмотреть как следует, не торопясь', minutes: 45, terminal: true, goto: 'c37_b_milk',
        text: 'Ты смотришь, щупаешь, расспрашиваешь. Ничего страшного, но запускать нельзя: тепло, покой, питьё, что есть в аптечке. Ты записываешь на листке, кому что и когда, и прикалываешь на дверь.', effects: [set37('be', 'look'), w37('care_note', true), until37(9, 30)] },
      { id: 'c37_be_pills', label: 'Отдать таблетки из своей сумки', minutes: 30, terminal: true, goto: 'c37_b_milk',
        text: 'Ты отдаёшь, что у тебя есть подходящего. Тебе самой в дорогу останется меньше. Зато здесь будет чем.', effects: [set37('be', 'pills'), w37('pills_given', true), until37(9, 15)] },
      { id: 'c37_be_zander', label: 'Сказать: завтра в Винзене спрошу у Красного Креста', minutes: 30, terminal: true, goto: 'c37_b_milk',
        text: 'Ты записываешь на ладони, что спросить. В Винзене завтра будут все. Может, там найдётся.', effects: [set37('be', 'zander'), w37('ask_winsen', true), until37(9, 15)] },
    ] }),

  X({ id: 'c37_b_milk', title: 'Корова', camp: yard14, safe: false, ambient: barn37,
    text: [
      { text: 'Хенрике просит подоить корову: пальцы у неё сегодня не гнутся. Корова стоит в стойле, тёплая, и смотрит на тебя без всякого доверия.' },
      { when: henrike37, text: '— Von links. Und nicht zögern. Sie merkt, wenn du Angst hast.\n\nСлева. И не тянуть. Она чувствует, когда боишься.' },
    ],
    actions: [
      { id: 'c37_bm_go', label: 'Сесть и доить, как сказала Хенрике', minutes: 40, risky: true, terminal: true, goto: 'c37_b_bag',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'medicine'], difficulty: 3, uses: ['focus'] },
            text: 'Сначала не выходит ничего. Потом тонкая струйка, потом ровно. Подойник наполняется на треть. Корова жуёт и больше не косится. Хенрике кивает от двери.',
            effects: [set37('bm', 'go'), w37('milked', true), npc('henrike', 1), until37(10, 15)] },
          { id: 'kick',
            text: 'Корова переступает и бьёт задней ногой. Ты успеваешь отдёрнуться, но копыто задевает голень. Подойник летит, молоко в соломе. Хенрике ругается, не на тебя, на корову, и доит сама, морщась от боли в пальцах.',
            effects: [set37('bm', 'kick'), { injure: 'bruise', site: 'rightLeg', severity: 1 }, { body: 'stress', delta: 5 }, until37(10, 15)] },
        ] },
      { id: 'c37_bm_warm', label: 'Сначала погреть руки и поговорить с ней', minutes: 50, terminal: true, goto: 'c37_b_bag',
        text: 'Ты греешь руки под мышками, потом кладёшь ладонь корове на бок и говоришь с ней по-русски. Она перестаёт переступать. Доишь медленно, зато подойник полный.', effects: [set37('bm', 'warm'), w37('milked', true), until37(10, 25)] },
      { id: 'c37_bm_henrike', label: 'Попросить Хенрике держать хвост и показывать', when: henrike37, minutes: 45, terminal: true, goto: 'c37_b_bag',
        text: 'Хенрике держит хвост и командует. Через десять минут у тебя получается. Она говорит: «Nächste Woche kannst du es allein». На следующей неделе сможешь сама.', effects: [set37('bm', 'henrike'), w37('milked', true), npc('henrike', 1), until37(10, 20)] },
    ] }),

  X({ id: 'c37_b_bag', title: 'Сумка', camp: kitchen14,
    text: [
      { when: bNorth36, text: 'Завтра ты медсестра в первой машине. Сумка Зандер лежит на столе: бинты, шприцы, жаропонижающее, термоодеяла. Места в ней мало, а взять хочется всё.' },
      { when: not(bNorth36), text: 'Завтра ты никуда не едешь. Значит, аптечка хутора — на тебе. Хенрике выставила на стол коробку из-под обуви: всё, что в доме есть от болезней.' },
    ],
    actions: [
      { id: 'c37_bb_med', label: 'Уложить только медицинское: в дороге это главное', when: bNorth36, minutes: 40, terminal: true, goto: 'c37_b_pens',
        text: 'Бинты, шприцы, жгут, термоодеяла, жаропонижающее. Ни одной лишней вещи. Сумка закрывается легко.', effects: [set37('bb', 'med'), w37('nurse_bag', 'med'), until37(11, 0)] },
      { id: 'c37_bb_food', label: 'Оставить место для еды и термоса: в Аренсбурге голодно', when: bNorth36, minutes: 40, terminal: true, goto: 'c37_b_pens',
        text: 'Ты вынимаешь часть бинтов и кладёшь хлеб, сало, сахар, термос. Кому-то в спортзале это нужнее таблеток.', effects: [set37('bb', 'food'), w37('nurse_bag', 'food'), until37(11, 0)] },
      { id: 'c37_bb_sort', label: 'Разобрать домашнюю аптечку и подписать', when: not(bNorth36), minutes: 40, terminal: true, goto: 'c37_b_pens',
        text: 'Просроченное в сторону, остальное по кучкам: от боли, от жара, от живота, для ран. Ты подписываешь каждую кучку на клочке картона. Хенрике смотрит и говорит: «Ordnung». Порядок.', effects: [set37('bb', 'sort'), w37('farm_kit', true), until37(11, 0)] },
      { id: 'c37_bb_okafor', label: 'Собрать сумку для Окафора: ему ехать одному', when: all(not(bNorth36), okaforComes), minutes: 40, terminal: true, goto: 'c37_b_pens',
        text: 'Бинты, жаропонижающее, термоодеяло, хлеб. Ты завязываешь сумку и пишешь на бирке: «Okafor». Он поймёт.', effects: [set37('bb', 'okafor'), w37('okafor_bag', true), until37(11, 0)] },
    ] }),

  X({ id: 'c37_b_pens', title: 'Ручки', camp: kitchen14,
    text: [
      { when: insulinHome36, text: 'Коробка из-под чая в кладовке. Внутри шприц-ручки из синей сумки, аккуратно, в ряд. Холодные, как и должно быть.' },
      { when: all(insulinHome36, bNorth36), text: 'Завтра ты увидишь Мерле. Сколько взять — решаешь ты.' },
      { when: all(insulinHome36, not(bNorth36)), text: 'Завтра на север едет Окафор. Если передать — то через него.' },
      { when: not(insulinHome36), text: 'Инсулина на хуторе нет. Есть сахар: Хенрике держит кусковой в жестянке на верхней полке. При гипогликемии это первое, что нужно.' },
    ],
    actions: [
      { id: 'c37_bp_four', label: 'Взять четыре ручки: Мерле на месяц', when: all(pens(4), bNorth36), minutes: 25, terminal: true, outcomes: toLea,
        text: 'Четыре ручки в шерстяном носке, носок — во внутренний карман, к телу. Чтобы не замёрзли. В коробке остаётся меньше, чем было.', effects: [set37('bp', 'four'), { unstock: 'c21_insulin', qty: 4, at: 'c3_farm_stock' }, { give: 'c21_insulin', qty: 4 }, w37('pens_north', 4), until37(11, 30)] },
      { id: 'c37_bp_two', label: 'Взять две: остальное пусть ждёт здесь', when: all(pens(2), bNorth36), minutes: 25, terminal: true, outcomes: toLea,
        text: 'Две ручки в носке, во внутреннем кармане. Если Мерле приедет сюда, остальные будут её ждать. Если не приедет — у неё две недели.', effects: [set37('bp', 'two'), { unstock: 'c21_insulin', qty: 2, at: 'c3_farm_stock' }, { give: 'c21_insulin', qty: 2 }, w37('pens_north', 2), until37(11, 30)] },
      { id: 'c37_bp_okafor', label: 'Отложить две ручки для Окафора: пусть отвезёт', when: all(pens(2), not(bNorth36)), minutes: 25, terminal: true, outcomes: toLea,
        text: 'Две ручки в носке, носок в коробку, на коробке: «Merle. Von uns». Завтра утром отдать Окафору. Холод в дороге им не страшен, страшно тепло.', effects: [set37('bp', 'okafor'), { unstock: 'c21_insulin', qty: 2, at: 'c3_farm_stock' }, w37('pens_okafor', 2), until37(11, 30)] },
      { id: 'c37_bp_keep', label: 'Оставить все здесь: Мерле приедет — будет её', when: insulinHome36, minutes: 20, terminal: true, outcomes: toLea,
        text: 'Ты закрываешь коробку. Если Мерле приедет, всё здесь. Если нет — ты не знаешь. Ты убираешь коробку на холодную полку и долго не отходишь.', effects: [set37('bp', 'keep'), w37('pens_kept', true), until37(11, 30)] },
      { id: 'c37_bp_sugar', label: 'Попросить у Хенрике кусковой сахар для Мерле', when: not(insulinHome36), minutes: 20, terminal: true, outcomes: toLea,
        text: 'Хенрике отсыпает в бумажку восемь кусков. «Für das Mädchen». Для девочки. Ты сворачиваешь кулёк и кладёшь в карман.', effects: [set37('bp', 'sugar'), w37('sugar_merle', true), until37(11, 30)] },
      { id: 'c37_bp_note', label: 'Записать для Мерле, где искать инсулин: аптеки, ветклиники', when: not(insulinHome36), minutes: 25, terminal: true, outcomes: toLea,
        text: 'Ты пишешь на листке всё, что знаешь: аптеки Аренсбурга, больница, армейский медпункт. В конце, подумав, добавляешь: «Ветклиника. Для собак тоже бывает инсулин». Сама не знаешь, откуда это помнишь.', effects: [set37('bp', 'note'), w37('vet_idea', true), until37(11, 30)] },
    ] }),

  X({ id: 'c37_b_lea', title: 'Лея', camp: kitchen14,
    text: [
      { when: v('w.c36_nurse', 'lea'), text: 'Лея пришла из пункта. Завтра она едет медсестрой вместо тебя. Садится напротив и кладёт на стол руки.\n\n— Sag mir, was ich wissen muss. Ich bin Tierärztin, keine Krankenschwester.\n\nСкажи, что мне надо знать. Я ветеринар, не медсестра.' },
      { when: all(not(v('w.c36_nurse', 'lea')), flag('w.c36_lea_list')), text: 'Лея пришла из пункта. Она знает про список: Берген, второе декабря. Садится напротив.\n\n— Er hat mir die Liste gebracht. Was hältst du davon? Ehrlich.\n\nОн принёс мне список. Что ты думаешь? Честно.' },
      { when: all(not(v('w.c36_nurse', 'lea')), not(flag('w.c36_lea_list'))), text: 'Лея пришла из пункта за бинтами. Садится на минуту у печи и рассказывает, ни к кому не обращаясь, про кота Мозеса: рыжий, наглый, остался в Ганновере у соседки.' },
    ],
    actions: [
      { id: 'c37_bl_teach', label: 'Объяснить главное: давление, пульс, как ставить капельницу', when: v('w.c36_nurse', 'lea'), minutes: 40, terminal: true, goto: 'c37_b_henrike',
        text: 'Лея слушает, кивает, переспрашивает. Схватывает быстрее, чем ты объясняешь. В конце говорит: «Wie beim Hund. Nur dass der Hund nicht redet». Как у собаки. Только собака не разговаривает. И впервые за день улыбается.', effects: [set37('bl', 'teach'), npc('c21_lea', 2), w37('lea_taught', true), until37(12, 15)] },
      { id: 'c37_bl_sorry', label: 'Сказать: прости, что не спросила', when: v('w.c36_nurse', 'lea'), minutes: 30, terminal: true, goto: 'c37_b_henrike',
        text: 'Лея пожимает плечами. «Hättest du gefragt, hätte ich Ja gesagt. Aber du hättest fragen sollen». Если бы спросила, я бы сказала «да». Но спросить надо было. Ей этого достаточно.', effects: [set37('bl', 'sorry'), npc('c21_lea', 1), until37(12, 5)] },
      { id: 'c37_bl_bergen', label: 'Сказать честно: живы второго — уже много, но до Бергена далеко', when: all(not(v('w.c36_nurse', 'lea')), flag('w.c36_lea_list')), minutes: 35, terminal: true, goto: 'c37_b_henrike',
        text: 'Лея кивает. «Achtzig Kilometer. Ohne Armee. Im Dezember». Восемьдесят километров. Без армии. В декабре. Она говорит это как задачу, не как приговор. Потом встаёт и уходит в пункт.', effects: [set37('bl', 'bergen'), npc('c21_lea', 1), until37(12, 10)] },
      { id: 'c37_bl_moses', label: 'Спросить про кота', when: all(not(v('w.c36_nurse', 'lea')), not(flag('w.c36_lea_list'))), minutes: 30, terminal: true, goto: 'c37_b_henrike',
        text: 'Лея рассказывает: как Мозес однажды съел полкило фарша и ничуть не раскаялся. Как спал у Финна на голове. Она говорит о брате впервые. Потом замолкает и уходит за бинтами.', effects: [set37('bl', 'moses'), npc('c21_lea', 1), until37(12, 5)] },
      { id: 'c37_bl_tea', label: 'Налить ей чаю и не расспрашивать', minutes: 25, terminal: true, goto: 'c37_b_henrike',
        text: 'Лея пьёт чай обеими руками. Молчит. Уходит, кивнув. Иногда это лучшее, что можно сделать.', effects: [set37('bl', 'tea'), until37(12, 0)] },
    ] }),

  X({ id: 'c37_b_henrike', title: 'Хенрике', camp: kitchen14,
    text: [
      { text: 'Перед обедом Хенрике зовёт тебя в свою комнату. Там холодно и пахнет лавандой. Она садится на кровать и показывает тебе на стул.' },
      { when: flag('w.c35_henrike_promise'), text: '— Ich hab dir gesagt: vor der Saat. Wenn ihr geht, sagt es vor der Saat. Das gilt. Aber ich will es heute hören, wenn du es schon weißt.\n\nЯ тебе сказала: до сева. Если уйдёте, скажите до сева. Это в силе. Но я хочу услышать сегодня, если ты уже знаешь.' },
      { when: not(flag('w.c35_henrike_promise')), text: '— Ich will wissen, wer im Frühjahr hier ist. Damit ich weiß, für wie viele ich die Saat zähle.\n\nЯ хочу знать, кто весной будет здесь. Чтобы знать, на сколько человек считать семена.' },
    ],
    actions: [
      { id: 'c37_bh_stay', label: 'Сказать: мы остаёмся', when: not(way36('east')), minutes: 35, terminal: true, goto: 'c37_lunch',
        text: 'Хенрике кивает. Встаёт, открывает шкаф и достаёт с верхней полки толстую тетрадь в клеёнке: «Saatbuch». Книга посевов. Кладёт тебе на колени. «Dann lern das». Тогда учи.', effects: [set37('bh', 'stay'), w37('saatbuch', true), npc('henrike', 2, 'c37_said_we_stay'), until37(13, 0)] },
      { id: 'c37_bh_dunno', label: 'Сказать честно: ещё не знаем', minutes: 35, terminal: true, goto: 'c37_lunch',
        text: 'Хенрике смотрит в окно. «Ehrlich ist besser als nett». Честно лучше, чем мило. Потом встаёт: обед стынет.', effects: [set37('bh', 'dunno'), until37(13, 0)] },
      { id: 'c37_bh_east', label: 'Сказать: мы, наверное, уйдём', when: way36('east'), minutes: 35, terminal: true, goto: 'c37_lunch',
        text: 'Хенрике долго молчит. Потом говорит: «Dann geht mit Gott. Und schreibt». Тогда идите с Богом. И пишите. Она не плачет. Ты уходишь первой, чтобы не видеть, как она будет сидеть одна.', effects: [set37('bh', 'east'), w37('told_henrike_east', true), until37(13, 0)] },
      { id: 'c37_bh_ask', label: 'Спросить, чего хочет она', minutes: 35, terminal: true, goto: 'c37_lunch',
        text: '— Ich? — Хенрике усмехается. Я? — Dass Ole gesund wird. Dass ihr bleibt. Dass im März die Kartoffeln in die Erde kommen. In der Reihenfolge? Weiß ich nicht.\n\nЧтобы Оле выздоровел. Чтобы вы остались. Чтобы в марте картошка ушла в землю. В каком порядке? Не знаю.', effects: [set37('bh', 'ask'), npc('henrike', 1), until37(13, 0)] },
    ] }),

  X({ id: 'c37_b_nina', title: 'Нина', camp: kitchen14,
    text: [
      { when: ninaFarm, text: 'Нина сидит за столом с учебником, но не читает. Увидев тебя, спрашивает по-русски: «Завтра можно с вами в Винзен? Проводить. Школы всё равно не будет, все в колонне».' },
      { when: all(ninaFarm, v('w.c36_nina_bike', 'farm')), text: 'Синий велосипед стоит в сенях, у стены. Нина уже накачала шины.' },
      { when: not(ninaFarm), text: 'Нинина кровать в углу застелена, на подушке тетрадь. Нина в Винзене, у Лены. Завтра ты её увидишь у школы, если поедешь.' },
    ],
    actions: [
      { id: 'c37_bn_yes', label: 'Сказать Нине: можно, но держаться рядом', when: ninaFarm, minutes: 35, terminal: true, goto: 'c37_b_letter',
        text: 'Нина кивает так сильно, что падает учебник. «Обещаю». Потом серьёзно, по-немецки: «Versprochen». Ты знаешь, что она будет держаться рядом. Ровно до первого интересного.', effects: [set37('bn', 'yes'), w37('nina_winsen', true), npc('c7_nina', 1), until37(14, 45)] },
      { id: 'c37_bn_no', label: 'Сказать: нет, останешься с Хенрике', when: ninaFarm, minutes: 30, terminal: true, goto: 'c37_b_letter',
        text: 'Нина сжимает губы. «Ладно». Не ладно. Но спорить она не стала, и это значит, что поняла почему.', effects: [set37('bn', 'no'), until37(14, 40)] },
      { id: 'c37_bn_task', label: 'Дать Нине дело: завтра она за старшую на кухне у Хенрике', when: ninaFarm, minutes: 35, terminal: true, goto: 'c37_b_letter',
        text: 'Нина смотрит на тебя подозрительно, потом соглашается. «За старшую — это хорошо». Она уже прикидывает, кому что поручит.', effects: [set37('bn', 'task'), npc('c7_nina', 1), npc('henrike', 1), until37(14, 45)] },
      { id: 'c37_bn_note', label: 'Написать Нине записку: передать завтра у школы', when: not(ninaFarm), minutes: 30, terminal: true, goto: 'c37_b_letter',
        text: 'Ты пишешь коротко, по-русски: что всё в порядке, что Хенрике передаёт привет, что корова дала сегодня полный подойник. Нине будет приятно, что про корову.', effects: [set37('bn', 'note'), w37('nina_note', true), until37(14, 40)] },
    ] }),

  X({ id: 'c37_b_letter', title: 'Письмо', camp: kitchen14,
    text: [
      { text: 'Завтра в Винзене будет почта Красного Креста. Письмо можно передать туда, где почты нет уже месяц.' },
      { when: flag('w.c36_lea_list'), text: 'В Берген, в лагерь, ходят машины Красного Креста. Раз в неделю, говорят.' },
    ],
    actions: [
      { id: 'c37_bw_merle', label: 'Написать Мерле: всё, что не влезло в десять слов', minutes: 30, terminal: true, goto: 'c37_b_bread',
        text: 'Ты пишешь две страницы. Про хутор, про корову, про то, как скучаешь. В конце: «Приезжай. Или не приезжай. Но береги себя». Складываешь вчетверо, надписываешь: «Merle H., Ahrensburg, Sporthalle».', effects: [set37('bw', 'merle'), { give: 'c32_merle_letter' }, until37(15, 15)] },
      { id: 'c37_bw_bergen', label: 'Написать в Берген, матери Леи: что Лея жива и где она', when: flag('w.c36_lea_list'), minutes: 30, terminal: true, goto: 'c37_b_bread',
        text: '«Frau Hartmann, Ihre Tochter Lea lebt. Sie ist in Jesteburg, beim Doktor Sander». Фрау Хартман, ваша дочь Лея жива. Она в Йестебурге, у доктора Зандер. Ты не {m:спросил|спросила} Лею. Но некоторые письма лучше отправить, чем обсуждать.', effects: [set37('bw', 'bergen'), w37('bergen_letter', true), until37(15, 15)] },
      { id: 'c37_bw_none', label: 'Не писать: что ни напиши, всё не то', minutes: 20, terminal: true, goto: 'c37_b_bread',
        text: 'Ты берёшь лист, пишешь первую строчку и зачёркиваешь. Вторую тоже. Лист уходит в печку.', effects: [set37('bw', 'none'), until37(15, 5)] },
    ] }),

  X({ id: 'c37_b_bread', title: 'Хлеб', camp: kitchen14,
    text: [
      { text: 'Хенрике замешивает тесто на завтра: хлеб в дорогу тем, кто уходит, и тем, кто вернётся ночью. Мука ржаная, Кёлер, последний мешок.' },
      { when: v('w.c36_gift', 'ham'), text: 'Окорок завёрнут и лежит у двери. Хенрике говорит, что к нему нужен хлеб, иначе это не еда, а мясо.' },
      { when: v('w.c36_gift', 'none'), text: 'В дорогу решили не давать ничего. Хенрике месит тесто молча. Потом говорит: «Brot ist nichts. Brot zählt nicht». Хлеб — это ничего. Хлеб не считается.' },
    ],
    actions: [
      { id: 'c37_bd_knead', label: 'Месить вместе с Хенрике', minutes: 45, activity: 'moderate', terminal: true, goto: 'c37_b_okafor',
        text: 'Тесто тугое и липкое, руки в нём по локоть. Хенрике месит рядом, ритмично, и рассказывает, как её мать пекла на сорок человек на свадьбу. Шесть буханок. Две — тем, кто уходит.', effects: [set37('bd', 'knead'), w37('bread', 6), npc('henrike', 1), until37(16, 0)] },
      { id: 'c37_bd_more', label: 'Уговорить испечь на две буханки больше: мука ещё будет', minutes: 45, activity: 'moderate', terminal: true, goto: 'c37_b_okafor',
        text: 'Хенрике смотрит на мешок с мукой, на тебя. «Noch wird sie sein. Hoffentlich». Ещё будет. Надеюсь. Восемь буханок. Мешок пустеет на треть.', effects: [set37('bd', 'more'), w37('bread', 8), until37(16, 0)] },
      { id: 'c37_bd_watch', label: 'Следить за печью, пока Хенрике месит', minutes: 45, terminal: true, goto: 'c37_b_okafor',
        text: 'Ты подкладываешь дрова, чтобы жар был ровный. Хенрике учит: если рука в печи выдерживает до десяти — пора сажать. Ты держишь до восьми. Пора.', effects: [set37('bd', 'watch'), w37('bread', 6), until37(16, 0)] },
    ] }),

  X({ id: 'c37_b_okafor', title: 'Окафор', camp: yard14, ambient: frost37,
    text: [
      { when: okaforComes, text: 'Окафор пришёл из колонии к вечеру. Стоит у колодца в длинной куртке, руки в карманах.' },
      { when: all(okaforComes, bNorth36), text: '— Tomorrow you and I. First car. I will do the old ones, you the young ones. Agreed?\n\nЗавтра ты и я. Первая машина. Я беру стариков, ты — молодых. Договорились?' },
      { when: all(okaforComes, not(bNorth36)), text: '— Tomorrow I go alone. If I am not back by seven in the evening, the bridge is closed. Then I stay there. Tell Mrs Lüdemann.\n\nЗавтра я еду один. Если к семи вечера меня нет, мост закрыт. Тогда я остаюсь там. Скажи фрау Людеман.' },
      { when: not(okaforComes), text: 'Окафор далеко, в колонии у Уте, или уже в Винзене. Завтра он поедет на север. Ты стоишь у колодца и думаешь, что ему сказать, если увидишь.' },
    ],
    actions: [
      { id: 'c37_bo_agree', label: 'Договориться: кто что делает в машине', when: all(okaforComes, bNorth36), minutes: 30, terminal: true, goto: 'c37_b_cellar', ambientDuring: frost37,
        text: 'Вы стоите и договариваетесь: кто колет, кто перевязывает, кто говорит с солдатами на мосту. Окафор говорит: «You talk. They listen to a young woman more than to an old man with an accent». Говоришь ты. Молодую женщину они слушают охотнее, чем старика с акцентом. Он не шутит.', effects: [set37('bo', 'agree'), w37('nurse_plan', true), npc('okafor', 1), until37(16, 30)] },
      { id: 'c37_bo_promise', label: 'Пообещать: если к семи его нет — мы приедем в Винзен', when: all(okaforComes, not(bNorth36)), minutes: 30, terminal: true, goto: 'c37_b_cellar', ambientDuring: frost37,
        text: 'Окафор качает головой: «No. If the bridge is closed, nothing helps». Нет. Если мост закрыт, ничего не поможет. Но руку твою не отпускает дольше, чем надо.', effects: [set37('bo', 'promise'), npc('okafor', 1), until37(16, 30)] },
      { id: 'c37_bo_merle', label: 'Попросить: скажи Мерле, что я её жду', when: okaforComes, minutes: 30, terminal: true, goto: 'c37_b_cellar', ambientDuring: frost37,
        text: 'Окафор кивает. «I will tell her. In German, so she believes». Скажу. По-немецки, чтобы поверила.', effects: [set37('bo', 'merle'), w37('merle_waited', true), until37(16, 30)] },
      { id: 'c37_bo_note', label: 'Написать Окафору записку и передать через Кёлер', when: not(okaforComes), minutes: 25, terminal: true, goto: 'c37_b_cellar', ambientDuring: frost37,
        text: 'Ты пишешь коротко, по-английски: удачи, береги себя, привези её, если сможешь. Кёлер завтра едет в Винзен, она передаст.', effects: [set37('bo', 'note'), until37(16, 25)] },
    ] }),

  X({ id: 'c37_b_cellar', title: 'Подвал', camp: kitchen14, ambient: barn37,
    text: [
      { text: 'Хенрике спускается в подвал с лампой и зовёт тебя: посчитать, что останется, когда одни уедут, а другие приедут.' },
      { when: lostFood37, text: 'Там, где утром стояли два мешка картошки, пусто. Хенрике переступает через пустое место, будто его нет.' },
      { when: lostGen37, text: 'Без генератора лампа керосиновая. Её свет не достаёт до дальних полок.' },
      { when: lostDiesel37, text: 'На полке, где стояла канистра солярки, тёмное пятно на досках. Пахнет соляркой.' },
    ],
    actions: [
      { id: 'c37_bc_count', label: 'Считать вслух, Хенрике записывает', minutes: 30, terminal: true, goto: 'c37_radio', ambientDuring: barn37,
        text: 'Картошка, капуста, банки, сало, мука. Ты считаешь, она пишет. В конце Хенрике подчёркивает итог и говорит: «Wenn das Mädchen kommt — reicht es. Wenn noch drei kommen — reicht es bis Februar». Если девочка приедет — хватит. Если ещё трое — до февраля.', effects: [set37('bc', 'count'), w37('stock_counted', true), until37(17, 0)] },
      { id: 'c37_bc_hide', label: 'Предложить спрятать часть запасов за ложную стенку: на всякий случай', minutes: 30, terminal: true, goto: 'c37_radio', ambientDuring: barn37,
        text: 'Хенрике смотрит на тебя, потом показывает в угол: там, за старым шкафом, ниша. Её отец прятал там зерно в сорок пятом. Вы переносите туда два мешка и шесть банок. Шкаф встаёт на место.', effects: [set37('bc', 'hide'), w37('cache', true), until37(17, 0)] },
      { id: 'c37_bc_rot', label: 'Перебрать картошку: вынуть гнилую, пока не пошла дальше', minutes: 30, activity: 'moderate', terminal: true, goto: 'c37_radio', ambientDuring: barn37,
        text: 'Руки мёрзнут, гнилая картошка пахнет так, что першит в горле. Ведро гнилой — в компост. Остальное лежит ровно, сухо. Хенрике довольна.', effects: [set37('bc', 'rot'), w37('potatoes_sorted', true), until37(17, 0)] },
    ] }),

  X({ id: 'c37_b_pack', title: 'Сборы', camp: kitchen14,
    text: [
      { when: bNorth36, text: 'Завтра в половине пятого подъём. Сумка медсестры у двери. Удостоверение во внутреннем кармане.' },
      { when: all(not(bNorth36), way36('east')), text: 'Рюкзак, большой, на всё, лежит на кровати. Его ещё можно разобрать обратно.' },
      { when: all(not(bNorth36), not(way36('east'))), text: 'Завтра проводы. Ты собираешь маленькую сумку: термос, хлеб, варежки запасные.' },
      { when: any(v('$.c37_bp', 'four'), v('$.c37_bp', 'two')), text: 'Носок с ручками инсулина ты проверяешь второй раз. Он на месте.' },
    ],
    actions: [
      { id: 'c37_bk2_light', label: 'Собраться налегке', minutes: 40, terminal: true, goto: 'c37_supper',
        text: 'Всё самое нужное — в одну сумку. Если что-то забудешь, значит, оно не было нужным.', effects: [set37('bk2', 'light'), set37('packed', 'light'), until37(18, 30)] },
      { id: 'c37_bk2_full', label: 'Собрать всё ценное: мало ли', minutes: 40, terminal: true, goto: 'c37_supper',
        text: 'Документы, тёплое, нож, фотографии с телефона, которые уже не посмотришь без зарядки. Тяжело. Но спокойнее.', effects: [set37('bk2', 'full'), set37('packed', 'full'), until37(18, 30)] },
      { id: 'c37_bk2_partner', label: 'Сесть рядом с {partner.ins} и собираться вместе', minutes: 40, terminal: true, goto: 'c37_supper',
        text: 'Вы собираетесь вместе, переговариваясь: кто что берёт, у кого фонарик, кто будит. Так проще. Так кажется, что завтра будет обычный день.', effects: [set37('bk2', 'partner'), { body: 'stress', delta: -3 }, until37(18, 30)] },
    ] }),
];
