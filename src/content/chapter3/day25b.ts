import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { wayHide } from './point22';
import { S25, oleState, set25, snow25, until25, w25 } from './point25';

// Участок 25, линия B: без A. Лея (если на хуторе) — в пункт к Зандер; девочка в задней комнате; Кирхвег; Маркус и Лео уходят в Винзен.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S25({ ...scene, for: 'any', chapter: 'ch3' });
const jest = 'c16_jesteburg';
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => B({ ...scene, location: jest, camp: scene.camp ?? { at: jest, stock: 'c3_farm_stock', rest: false }, safe: false });
/** Лея всё ещё на хуторе: прятали, и Брандт её не нашёл. */
const leaFarm: Cond = all(wayHide, not(flag('w.c24_lea')));
const leaSchool: Cond = any(v('w.c24_lea', 'brandt'), v('w.c22_lea_at', 'brandt'));
const marcusTaken: Cond = v('w.c24_marcus', 'taken');
const guestsHere: Cond = all({ npc: 'c12_marcus', alive: true }, any(v('w.c23_guests', 'in'), all(v('w.c23_guests', 'shed'), not(marcusTaken))));
const pens3: Cond = flag('w.c24_kirch_three');
const pens1: Cond = flag('w.c24_kirch_one');
const insulinHome: Cond = { stocked: 'c21_insulin', qty: 1, at: 'c3_farm_stock' };
const evaCross: Cond = all(flag('w.c22_eva_cross'), { npc: 'c8_eva', alive: true });
const toJest = { move: jest };
const toFarm = { move: 'hof_luedemann' };
const afterPoint = [{ id: 'k', when: all(any(pens3, pens1), insulinHome), goto: 'c25_b_kirch' }, { id: 's', when: any(marcusTaken, leaSchool), goto: 'c25_b_school' }, { id: 'h', goto: 'c25_b_board' }];
const afterKirch = [{ id: 's', when: any(marcusTaken, leaSchool), goto: 'c25_b_school' }, { id: 'h', goto: 'c25_b_board' }];

export const day25BScenes: Scene[] = [
  B({ id: 'c25_b_morning', title: 'Без него', camp: kitchen14, onEnter: [oleState],
    text: [
      { text: 'В половине седьмого {A} уходит к пекарне Кёлер, к фургону. Дверь хлопает. В доме становится просторнее и тише, чем хотелось бы.' },
      { when: leaFarm, text: 'Лея сидит на кухне уже одетая, с повязкой Красного Креста на рукаве куртки Хенрике.\n\n— Ich will zur Ärztin. Nach Jesteburg. Als Sanitäterin. Ich kann mich nicht ewig im Keller verstecken. Bringst du mich? Und sagst, dass ich zu euch gehöre?\n\nЯ хочу к врачу. В Йестебург. Санитаркой. Не могу вечно прятаться в подвале. Отведёшь меня? И скажешь, что я ваша?' },
      { when: all(not(leaFarm), any(pens3, pens1)), text: 'На полке в жестяной коробке — шприц-ручки для Кирхвег. Ты {m:обещал|обещала} их отнести.' },
      { when: all(not(leaFarm), not(any(pens3, pens1))), text: 'Нина уже растопила печь. Эва чистит картошку. День как день.' },
      { text: 'Ты стоишь у окна и смотришь, как его фонарь качается по дороге к пекарне, пока не гаснет за поворотом.' },
    ],
    actions: [
      { id: 'c25_bm_lea', label: 'Отвести Лею в пункт и поручиться за неё', when: leaFarm, minutes: 70, terminal: true, goto: 'c25_b_point', ambientDuring: snow25,
        text: 'Вы идёте по дороге, не прячась. У поворота на Йестебург дружинник с велосипедом смотрит на повязку Леи и на тебя. Ты говоришь: «Lüdemann-Hof. Sanitäterin. Zur Ärztin». Он кивает и едет дальше.', effects: [set25('bm', 'lea'), w25('lea_point', true), toJest, { if: { npc: 'c21_lea', alive: true }, then: [{ npc: 'c21_lea', moveTo: jest, trust: 3, remember: 'c25_vouched' }] }, until25(8, 0)] },
      { id: 'c25_bm_wait', label: 'Сказать Лее: подожди до завтра, со мной в пункт пойдёшь в среду', when: leaFarm, minutes: 15, terminal: true, goto: 'c25_b_house',
        text: 'Лея садится обратно. Снимает повязку, складывает, кладёт в карман.\n\n— Morgen. Gut. Noch ein Tag im Keller.\n\nЗавтра. Хорошо. Ещё один день в подвале.', effects: [set25('bm', 'wait'), npc('c21_lea', -1), until25(6, 50)] },
      { id: 'c25_bm_go', label: 'Пойти в Йестебург: к Зандер и на Кирхвег', when: not(leaFarm), minutes: 60, terminal: true, goto: 'c25_b_point', ambientDuring: snow25,
        text: 'Четыре километра по снегу. На полпути тебя обгоняет трактор Брандта с досками для школы. Дружинник на прицепе машет тебе рукавицей, как знакомой.\n\nДорога до Йестебурга занесена, следы только от санок. Ты идёшь по ним, как по рельсам.', effects: [set25('bm', 'go'), toJest, until25(7, 50)] },
      { id: 'c25_bm_home', label: 'Остаться дома: без {A.gen} здесь некому', when: not(leaFarm), minutes: 15, terminal: true, goto: 'c25_b_house',
        text: 'Ты ставишь вторую кастрюлю на плиту. В доме девять ртов. Кто-то должен.', effects: [set25('bm', 'home'), until25(6, 50)] },
    ] }),

  // ───────────── Йестебург ─────────────
  J({ id: 'c25_b_point', title: 'Задняя комната',
    text: [
      { text: 'Доктор Зандер встречает в дверях пункта, с кружкой в руке.' },
      { when: v('$.c25_bm', 'lea'), text: '— Sie gehört zu uns, — говоришь ты. Она наша.\n\nЗандер смотрит на Лею, на повязку, на её руки.\n\n— Das sehe ich. Tisch zwei. Ab sofort.\n\nВижу. Второй стол. С этой минуты.' },
      { text: '— Gut, dass Sie kommen. Die Kleine hinten fragt nach jemandem, der ihr was erzählt. Ihre Mutter ist nicht gekommen. Ich habe keine Zeit zum Erzählen.\n\nХорошо, что вы пришли. Малышка в задней комнате просит, чтобы ей кто-нибудь что-нибудь рассказал. Мать не пришла. А у меня нет времени рассказывать.' },
      { text: 'Девочке девять. Её зовут Пия. Повязка на руке, жар, глаза блестят. На стуле у кровати сидит тряпичная кукла без одной пуговицы-глаза.' },
      { text: 'В пункте натоплено так, что по окнам течёт. На вешалке у двери висят чужие куртки, и от них идёт пар.' },
    ],
    actions: [
      { id: 'c25_bp_sit', label: 'Сесть к Пие и рассказывать', minutes: 90, terminal: true, outcomes: afterPoint,
        text: 'Ты рассказываешь, что помнишь: про Бармбек, про трамвай, про то, как в детстве у тебя была кошка, которая ездила в лифте. Пия слушает, держа куклу за руку. Спрашивает, умеет ли кошка открывать двери. Засыпает на середине. Ты сидишь ещё, пока она не начинает дышать ровно.\n\nПия слушает, приоткрыв рот, и поправляет тебя, когда ты путаешь имя курицы. Под конец она засыпает на середине фразы, держа тебя за палец.', effects: [set25('bp', 'sit'), w25('pia', true), { body: 'stress', delta: 2 }, until25(9, 40)] },
      { id: 'c25_bp_doll', label: 'Пришить кукле глаз пуговицей с твоей куртки', minutes: 40, terminal: true, outcomes: afterPoint,
        text: 'Пуговица с рукава, нитка из аптечки Зандер. Кукла снова смотрит двумя глазами, разными. Пия долго разглядывает её и говорит: «Jetzt sieht sie alles». Теперь она всё видит.\n\nПуговица чёрная, от твоей куртки, на ниточке. Кукла теперь смотрит разными глазами: одним голубым, одним чёрным. Пия говорит, что так даже лучше: она видит и днём, и ночью.', effects: [set25('bp', 'doll'), w25('pia', true), w25('pia_doll', true), until25(8, 50)] },
      { id: 'c25_bp_tables', label: 'Помочь Зандер у столов: там больше народу', minutes: 90, terminal: true, outcomes: afterPoint,
        text: 'Обмороженные, порезы, ожог от печки. Через полтора часа у тебя дрожат руки, и Зандер ставит перед тобой кружку чая с тремя кусками сахара, не спрашивая.\n\nК полудню у тебя ноют ноги, а руки пахнут хлоркой так, что ты чувствуешь её во рту. Зандер дважды говорит тебе «Danke», не оборачиваясь.', effects: [set25('bp', 'tables'), w25('b_helped_point', true), { body: 'fatigue', delta: 5 }, until25(9, 40)] },
    ] }),

  J({ id: 'c25_b_kirch', title: 'Кирхвег, 4', ambient: snow25,
    text: [
      { text: 'Дом четыре. Записка на двери на месте: «Bitte klopfen. Laut».' },
      { text: 'Открывает тот же мужчина в двух свитерах. За его спиной, в полутёмной комнате, на диване лежит женщина под пледом.' },
    ],
    actions: [
      { id: 'c25_bk_give', label: 'Отдать, сколько обещала', minutes: 20, terminal: true, outcomes: afterKirch,
        text: 'Мужчина берёт коробку обеими руками, как берут хлеб в церкви. Женщина на диване приподнимается на локте.\n\n— Danke, — говорит она. Голос слабый. — Ich heiße Grete. Merken Sie sich das.\n\nСпасибо. Меня зовут Грета. Запомните.\n\nМужчина пересчитывает ручки дважды, шевеля губами, и прячет их за пазуху, ближе к телу.', effects: [set25('bk', 'give'), w25('kirch_given', true), { if: pens3, then: [{ unstock: 'c21_insulin', qty: 3, at: 'c3_farm_stock' }], else: [{ unstock: 'c21_insulin', qty: 1, at: 'c3_farm_stock' }] }, until25(10, 10)] },
      { id: 'c25_bk_more', label: 'Отдать на одну больше, чем обещала', minutes: 20, terminal: true, outcomes: afterKirch,
        text: 'Мужчина считает ручки и поднимает на тебя глаза.\n\n— Das ist eine zu viel.\n\nЭто на одну больше.\n\n— Für Grete, — говоришь ты, услышав, как её зовут. Для Греты.\n\nОн смотрит на лишнюю ручку и не берёт сразу. Потом берёт, и пальцы у него дрожат.', effects: [set25('bk', 'more'), w25('kirch_given', true), npc('c3_koehler', 1), { if: pens3, then: [{ unstock: 'c21_insulin', qty: 4, at: 'c3_farm_stock' }], else: [{ unstock: 'c21_insulin', qty: 2, at: 'c3_farm_stock' }] }, until25(10, 10)] },
    ] }),

  J({ id: 'c25_b_school', title: 'Школа',
    text: [
      { text: 'В спортзале школы тепло от буржуйки. Шесть кроватей, на трёх — люди под капельницами.' },
      { when: marcusTaken, text: 'Маркус сидит на скамейке у стены, с градусником. Тот же дружинник рядом. Маркус показывает тебе градусник: 36,7.' },
      { when: leaSchool, text: 'Лея в белом халате ставит капельницу женщине из автобуса. Она видит тебя и коротко кивает: всё так же.' },
    ],
    actions: [
      { id: 'c25_bs_marcus', label: 'Передать Маркусу рисунок Лео', when: marcusTaken, minutes: 20, terminal: true, goto: 'c25_b_board',
        text: 'Маркус разворачивает листок. Дом, пятеро, подпись: «Marcus kommt wieder». Он смотрит долго, потом складывает и убирает в нагрудный карман.\n\n— Donnerstag, — говорит он. Четверг. — Wenn das Thermometer so bleibt.\n\nЕсли градусник останется таким.', effects: [set25('bs', 'marcus'), npc('c12_marcus', 2), until25(11, 0)] },
      { id: 'c25_bs_lea', label: 'Подождать Лею в коридоре', when: leaSchool, minutes: 30, terminal: true, goto: 'c25_b_board',
        text: 'Лея выходит на минуту, вытирая руки.\n\n— Mats hat immer noch kein Fieber. Brandt kommt jeden Morgen und schaut ihn an wie einen kaputten Motor. — Она понижает голос. — Wenn er merkt, dass ich nichts nütze, lässt er mich gehen. Oder nicht.\n\nУ Матса всё ещё нет жара. Брандт каждое утро приходит и смотрит на него, как на сломанный мотор. Когда он поймёт, что от меня никакого толку, он меня отпустит. Или нет.', effects: [set25('bs', 'lea'), npc('c21_lea', 1), until25(11, 10)] },
      { id: 'c25_bs_go', label: 'Постоять у двери и уйти', minutes: 10, terminal: true, goto: 'c25_b_board',
        text: 'Ты стоишь у двери. Капельницы капают. Ты уходишь.', effects: [set25('bs', 'go'), until25(10, 50)] },
    ] }),

  // ───────────── Хутор ─────────────
  B({ id: 'c25_b_house', title: 'Дом', camp: kitchen14,
    text: [
      { text: 'Утро на хуторе без {A.gen}: дрова, вода, куры. Нина делает всё быстрее тебя и не говорит об этом.' },
      { when: leaFarm, text: 'Лея помогает. Молча, ловко. Курам она насыпает корм так, что ни одна не дерётся.' },
      { text: 'Нина носит воду по два ведра, на коромысле, которое нашла на чердаке. Научилась за неделю, и вода у неё не плещется.' },
    ],
    actions: [
      { id: 'c25_bh_wood', label: 'Наколоть дров', minutes: 60, activity: 'moderate', terminal: true, goto: 'c25_b_eva', ambientDuring: snow25,
        text: 'Колун тяжёлый. Первые три полена ты бьёшь мимо. К десятому руки находят ритм. Нина смотрит с крыльца и молча показывает большой палец.\n\nК десятому полену ты находишь ритм. Нина считает вслух и сбивается на немецкий на «zwölf».', effects: [set25('bh', 'wood'), { body: 'fatigue', delta: 5 }, npc('c7_nina', 1), until25(9, 0)] },
      { id: 'c25_bh_water', label: 'Наносить воды в бочку', minutes: 50, activity: 'moderate', terminal: true, goto: 'c25_b_eva', ambientDuring: snow25,
        text: 'Двенадцать вёдер от колонки. Насос ходит туго, но качает. Бочка в сенях полная.\n\nКолонка скрипит. Бочка в сенях наполняется медленно, ведро за ведром, и к концу у тебя гудят плечи.', effects: [set25('bh', 'water'), { body: 'fatigue', delta: 4 }, until25(8, 50)] },
      { id: 'c25_bh_nina', label: 'Посидеть с Ниной над учебником', minutes: 60, terminal: true, goto: 'c25_b_eva',
        text: 'Нина решает задачи по физике: скорость, путь, время. Ты помогаешь с одной. Рядом с этой задачей она ставит в тетради звёздочку. Это, видимо, высшая оценка.\n\nНина пишет решение аккуратно, с подчёркиваниями. Потом рисует на полях курицу. Ты делаешь вид, что не видишь.', effects: [set25('bh', 'nina'), npc('c7_nina', 2), until25(9, 0)] },
    ] }),

  B({ id: 'c25_b_eva', title: 'Крест', camp: yard14, ambient: snow25,
    text: [
      { when: evaCross, text: 'Эва стоит у старого колодца за сараем, где лежит Хельмут. В руках у неё две берёзовые жерди и моток проволоки.\n\n— Kannst du halten? Ich binde.\n\nПодержишь? Я свяжу.' },
      { when: not(evaCross), text: 'У старого колодца за сараем снег лежит ровно. Его никто не трогал с субботы.' },
      { text: 'Колодец старый, кирпичный, крышка придавлена камнями. Куры его обходят стороной. Нина тоже.' },
    ],
    actions: [
      { id: 'c25_be_hold', label: 'Держать, пока Эва вяжет крест', when: evaCross, minutes: 40, terminal: true, outcomes: [{ id: 'p', when: { before: at(25, 10, 40) }, goto: 'c25_b_pantry' }, { id: 'k', goto: 'c25_b_koehler' }],
        text: 'Эва вяжет проволоку крест-накрест, туго, зубами затягивает концы. Крест получается кривой и крепкий. Вы вбиваете его в мёрзлую землю у края колодца камнем. Эва стоит над ним и молчит. Потом говорит:\n\n— Helmut, das ist die Frau, die mir die Schuhe getragen hat. Sei nett zu ihr.\n\nХельмут, это та, что несла мне туфли. Будь с ней вежлив.', effects: [set25('be', 'hold'), w25('eva_cross_done', true), npc('c8_eva', 3, 'c25_cross'), until25(10, 30)] },
      { id: 'c25_be_sweep', label: 'Расчистить снег у колодца', when: not(evaCross), minutes: 20, terminal: true, goto: 'c25_b_pantry', ambientDuring: snow25,
        text: 'Ты расчищаешь снег вокруг колодца. Крышка на месте, придавлена камнями. Больше здесь делать нечего.', effects: [set25('be', 'sweep'), until25(10, 0)] },
      { id: 'c25_be_leave', label: 'Не мешать ей: она хочет одна', when: evaCross, minutes: 10, terminal: true, goto: 'c25_b_pantry',
        text: 'Ты уходишь в дом. Через час Эва возвращается с красными руками и садится к печи. В окно видно: у колодца стоит берёзовый крест.', effects: [set25('be', 'leave'), w25('eva_cross_done', true), until25(10, 0)] },
    ] }),

  B({ id: 'c25_b_lunch', title: 'Обед', location: 'hof_luedemann', camp: kitchen14,
    text: [
      { when: v('$.c25_bm', 'lea'), text: 'Из Йестебурга ты возвращаешься к обеду {m:один|одна}: Лея осталась у Зандер.' },
      { when: v('$.c25_bm', 'go'), text: 'Ты возвращаешься из Йестебурга к обеду, с мокрыми ногами.' },
      { text: 'Суп, хлеб. Место {A.gen} за столом пустое. Нина ставит туда кружку.' },
      { text: 'Хлеб режут тонко-тонко, на просвет, и раскладывают по кругу, как карты.' },
    ],
    actions: [
      { id: 'c25_bl_eat', label: 'Поесть', minutes: 25, terminal: true, outcomes: [{ id: 'g', when: guestsHere, goto: 'c25_b_map' }, { id: 'd', goto: 'c25_b_tobias' }], ...tableOnly,
        text: 'Ты ешь и считаешь, сколько ещё до вечера.', effects: [set25('bl', 'eat'), toFarm, meal('eat'), until25(13, 0)] },
      { id: 'c25_bl_nap', label: 'Лечь на час', minutes: 5, terminal: true, outcomes: [{ id: 'g', when: guestsHere, goto: 'c25_b_map' }, { id: 'd', goto: 'c25_b_tobias' }],
        text: 'Ты засыпаешь сразу и просыпаешься, когда солнце уже ушло с подоконника.', effects: [set25('bl', 'nap'), toFarm, until25(13, 30, true)] },
      { id: 'c25_bl_tea', label: 'Только чай', minutes: 10, terminal: true, outcomes: [{ id: 'g', when: guestsHere, goto: 'c25_b_map' }, { id: 'd', goto: 'c25_b_tobias' }],
        text: 'Ты пьёшь чай у окна. Дорога пустая.', effects: [set25('bl', 'tea'), toFarm, until25(12, 45)] },
    ] }),

  B({ id: 'c25_b_guests', title: 'Винзен', camp: yard14, ambient: snow25, onEnter: [{ if: guestsHere, then: [{ npc: 'c12_marcus', moveTo: 'c15_winsen' }, { npc: 'c12_leo', moveTo: 'c15_winsen' }, w25('guests_left', true)] }],
    text: [
      { text: 'В два Маркус и Лео собираются. Рюкзак, валенки Хенрике, хлеб в газете. До Винзена двадцать километров. Если засветло не дойдут, заночуют в сарае у Гарштедта, где ночевали в пятницу.' },
      { text: 'Лео стоит у калитки и держит в руке сложенный листок.' },
      { when: v('w.c25_guests_way', 'fields'), text: 'Маркус прячет за пазуху страницу из атласа с карандашной линией через поля.' },
      { when: v('w.c25_guests_way', 'lena'), text: 'В кармане у Маркуса записка с адресом Лены, Нининым почерком.' },
      { when: v('w.c25_guests_way', 'road'), text: 'Маркус ещё раз смотрит в сторону шоссе и кивает сам себе.' },
    ],
    actions: [
      { id: 'c25_bg_draw', label: 'Взять у Лео листок', minutes: 15, terminal: true, goto: 'c25_b_tobias', ambientDuring: snow25,
        text: 'На листке дом с трубой, курица, пятеро. Подписано: «Für dich». Для тебя. Лео обхватывает тебя за пояс, быстро, и бежит догонять Маркуса.', effects: [set25('bg', 'draw'), { give: 'c25_leo_drawing' }, npc('c12_leo', 2), until25(14, 20)] },
      { id: 'c25_bg_food', label: 'Дать им ещё хлеба и яиц в дорогу', when: { stocked: 'eggs', qty: 2, at: 'c3_farm_stock' }, minutes: 15, terminal: true, goto: 'c25_b_tobias',
        text: 'Маркус берёт молча. У калитки он оборачивается.\n\n— Wenn ihr mal nach Winsen kommt. Gerbergasse sieben. Mein Bruder heißt Jürgen.\n\nЕсли будете в Винзене. Гербергассе, семь. Брата зовут Юрген.', effects: [set25('bg', 'food'), { unstock: 'eggs', qty: 2, at: 'c3_farm_stock' }, w25('winsen_address', true), npc('c12_marcus', 2), until25(14, 20)] },
      { id: 'c25_bg_walk', label: 'Проводить их до шоссе', minutes: 40, terminal: true, goto: 'c25_b_tobias', ambientDuring: snow25,
        text: 'Вы идёте втроём по снегу. Лео держит тебя за одну руку, Маркуса за другую. У шоссе он отпускает тебя первым. Ты стоишь, пока они не становятся двумя точками.', effects: [set25('bg', 'walk'), npc('c12_leo', 2), npc('c12_marcus', 1), until25(14, 50)] },
    ] }),

  B({ id: 'c25_b_tobias', title: '«Вольф» у ворот', camp: yard14, ambient: snow25,
    text: [
      { text: 'Около трёх у ворот тормозит «Вольф». Тобиас не глушит мотор и не выходит. Опускает стекло.' },
      { text: '— Ist er in Lüneburg? Dein Mann? Bei Ole?\n\nОн в Люнебурге? Твой муж? У Оле?' },
      { when: flag('w.c23_lea_exposed'), text: 'Глаза у Тобиаса красные. С воскресенья он, кажется, не спал.' },
      { text: 'Мотор «Вольфа» тарахтит на холостых, из выхлопной трубы валит белый пар. На заднем сиденье пустые канистры и автомат, накрытый курткой.' },
    ],
    actions: [
      { id: 'c25_bt_ask', label: 'Спросить, может ли он привезти Оле, если понадобится', minutes: 20, terminal: true, goto: 'c25_b_room',
        text: '— Morgen früh fahre ich sowieso nach Lüneburg. Für Brandt, Benzin holen. — Тобиас смотрит на дорогу. — Wenn ihr wollt, bringe ich ihn mit. Wenn er will.\n\nЗавтра утром я всё равно еду в Люнебург. Для Брандта, за бензином. Если хотите, привезу его. Если он захочет.', effects: [set25('bt', 'ask'), w25('tobias_can_bring', true), npc('c15_tobias', 1), until25(15, 20)] },
      { id: 'c25_bt_tea', label: 'Позвать его в дом погреться', minutes: 30, terminal: true, goto: 'c25_b_room',
        text: 'Тобиас глушит мотор и заходит. Пьёт чай стоя, у печи, в куртке. Нина ставит перед ним тарелку с хлебом. Он съедает всё и только потом замечает, что съел.\n\n— Danke. Seit Sonntag hat mir keiner was hingestellt.\n\nСпасибо. С воскресенья мне никто ничего не ставил на стол.\n\nТобиас пьёт чай, не снимая перчаток, и смотрит на печь так, будто давно не видел огня в доме.', effects: [set25('bt', 'tea'), npc('c15_tobias', 2), until25(15, 30)] },
      { id: 'c25_bt_short', label: 'Ответить коротко: да, в Люнебурге', minutes: 10, terminal: true, goto: 'c25_b_room',
        text: 'Тобиас кивает и поднимает стекло. «Вольф» уезжает к Йестебургу, оставляя на снегу две чёрные колеи.\n\nСтекло ползёт вверх. «Вольф» разворачивается, обдав калитку снегом.', effects: [set25('bt', 'short'), until25(15, 10)] },
    ] }),

  B({ id: 'c25_b_koehler', title: 'Кёлер', camp: kitchen14,
    text: [
      { text: 'Около полудня приходит Кёлер с буханкой под мышкой и новостями.' },
      { text: '— Der Bus ist heute früh weg. Sieben Leute. Die Witwe vom Schmied auch. — Она садится, не снимая пальто. — Und Brandt war heute Nacht bei seinem Enkel. Die ganze Nacht. Sabine sagt, er hat geweint. Brandt weint nicht.\n\nАвтобус утром ушёл. Семь человек. Вдова кузнеца тоже. А Брандт всю ночь сидел у внука. Сабина говорит, он плакал. Брандт не плачет.' },
      { text: 'Она приносит с собой запах печи и дрожжей, и от этого на кухне сразу становится уютнее.' },
    ],
    actions: [
      { id: 'c25_bkh_tea', label: 'Налить ей чаю и слушать', minutes: 40, terminal: true, goto: 'c25_b_lunch',
        text: 'Кёлер пьёт чай и рассказывает про всех: кто уехал, кто болен, у кого корова отелилась среди всего этого. Ты узнаёшь про деревню больше, чем за две недели.', effects: [set25('bkh', 'tea'), npc('c3_koehler', 1), { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }, until25(12, 30)] },
      { id: 'c25_bkh_mats', label: 'Сказать ей: Матс никогда не болел', minutes: 30, terminal: true, goto: 'c25_b_lunch',
        text: 'Кёлер ставит кружку.\n\n— Das weiß das ganze Dorf. Bis auf einen. — Она вздыхает. — Und der eine hat die Liste.\n\nЭто знает вся деревня. Кроме одного. А у этого одного — список.', effects: [set25('bkh', 'mats'), w25('village_knows_mats', true), { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }, until25(12, 25)] },
      { id: 'c25_bkh_thanks', label: 'Поблагодарить за хлеб и проводить', minutes: 15, terminal: true, goto: 'c25_b_lunch',
        text: 'Кёлер уходит через задний двор, по-соседски. На столе остаётся буханка, ещё тёплая.\n\nХлеб ещё тёплый. Ты держишь буханку у груди, пока не захлопывается калитка.', effects: [set25('bkh', 'thanks'), { place: 'c16_bread', at: 'c3_farm_stock', qty: 1 }, until25(12, 15)] },
    ] }),

  B({ id: 'c25_b_room', title: 'Комната Оле', camp: kitchen14,
    text: [
      { text: 'Если в пятницу Оле вернётся, ему нужна комната. Ты поднимаешься под крышу.' },
      { text: 'Кровать не застелена с ноября. На стене плакат с трактором и школьное расписание за восьмой класс. Пахнет пылью.' },
      { when: v('w.c24_ole_cabinet', 'open'), text: 'Железный шкаф у стены открыт. На полке пусто: бинокль и фляга внизу.' },
      { when: v('w.c24_ole_cabinet', 'broken'), text: 'Железный шкаф у стены взломан, дужка замка валяется на полу. На полке осколки линзы.' },
      { text: 'Под кроватью коробка с кассетами и старый плеер без батареек. На коробке фломастером: «Ole — nicht anfassen!» Оле — не трогать!' },
      { when: v('$.c25_bl', 'tea'), text: 'После обеда ты так ничего и не {m:съел|съела}, только чай. Руки слегка дрожат, когда ты берёшь кубок.' },
      { when: v('$.c25_bl', 'nap'), text: 'После часа сна голова ясная, и комната кажется больше, чем утром.' },
      { when: v('$.c25_bt', 'short'), text: '«Вольф» Тобиаса уехал, а ты всё думаешь, что ответил{m:|а} ему слишком коротко.' },
    ],
    actions: [
      { id: 'c25_br_bed', label: 'Застелить кровать и вытереть пыль', minutes: 50, activity: 'light', terminal: true, goto: 'c25_b_stranger',
        text: 'Простыни из шкафа Хенрике, два одеяла, подушка. Ты вытираешь подоконник, полку, шкаф. Нина приносит с улицы ветку ели и ставит в банку на окне. Не спрашивая. Просто так.\n\nПростыни пахнут шкафом и лавандой. Ты взбиваешь подушку и ставишь кубки ровно, по росту.', effects: [set25('br', 'bed'), w25('ole_room_ready', true), npc('c7_nina', 1), until25(16, 30)] },
      { id: 'c25_br_stove', label: 'Перенести сюда обогреватель и проверить окно', minutes: 40, terminal: true, goto: 'c25_b_stranger',
        text: 'Окно дует. Ты затыкаешь щели тряпками и газетой. Под крышей холодно. Оле придётся спать внизу, у печи, пока не потеплеет.\n\nОбогреватель гудит и пахнет горячей пылью. Через час в комнате можно снять куртку.', effects: [set25('br', 'stove'), w25('ole_downstairs', true), until25(16, 20)] },
      { id: 'c25_br_sit', label: 'Посидеть на его кровати', minutes: 20, terminal: true, goto: 'c25_b_stranger',
        text: 'Ты сидишь на краю кровати. На полке стоят школьные кубки за футбол, три, пыльные. На одном написано: «Ole Lüdemann, Torschützenkönig 2014». Лучший бомбардир.', effects: [set25('br', 'sit'), until25(16, 0)] },
    ] }),

  B({ id: 'c25_b_dusk', title: 'Ждать', camp: kitchen14,
    text: [
      { text: 'Темнеет в четыре. {A.gen} всё нет. Фургон должен быть к шести.' },
      { when: marcusTaken, text: 'Лео сидит у окна и рисует. Каждые десять минут он поднимает голову на шум с дороги.' },
      { text: 'В окне отражается кухня: лампа, стол, твоё лицо. Дороги за стеклом уже не видно.' },
    ],
    actions: [
      { id: 'c25_bd_gate', label: 'Выйти к воротам и ждать там', minutes: 60, terminal: true, goto: 'c25_supper', ambientDuring: snow25,
        text: 'Снег падает крупно и тихо. Ты стоишь у ворот, пока не начинают мёрзнуть ноги, потом ещё. В шесть на повороте появляются фары. Фургон прачечной. Остановился. Хлопнула дверь.\n\nМороз забирается в рукава. По дороге проходит только Кёлер с санками и машет тебе рукой в варежке.', effects: [set25('bd', 'gate'), until25(17, 55)] },
      { id: 'c25_bd_cook', label: 'Приготовить ужин повкуснее', minutes: 60, terminal: true, goto: 'c25_supper',
        text: 'Ты жаришь картошку с луком на сале, как любит {A}. Нина режет хлеб. Эва, не спрашивая, достаёт банку огурцов.', effects: [set25('bd', 'cook'), until25(17, 55)] },
      { id: 'c25_bd_sleep', label: 'Прилечь: день был длинный', minutes: 5, terminal: true, goto: 'c25_supper',
        text: 'Ты засыпаешь, не раздеваясь. Будит тебя стук входной двери и голос Нины снизу: «Приехал!»\n\nТы лежишь в одежде и слушаешь, как Нина внизу гремит кастрюлями. Сон не идёт.', effects: [set25('bd', 'sleep'), until25(17, 55, true)] },
    ] }),
];
