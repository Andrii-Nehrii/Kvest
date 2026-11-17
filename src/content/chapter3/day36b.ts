import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { okaforComes } from './point33';
import {
  S36, bNorth36, cab36, fed36, frost36, hall36, insulinHome36, jest36, kasiaGoes36, lea36, ninaWinsen36, pawel36, set36,
  until36, w36, way36, winsen36,
} from './point36';

// Участок 36, линия B: Винзен — регистрация медсестрой (или отказ и замена), спортзал, отмороженные пальцы,
// урок Нины, колонна Павла и список для моста, Окафор и инсулин Мерле, радиорубка Красного Креста, рынок, велосипед Нины, обратно.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S36({ ...scene, for: 'any', chapter: 'ch3' });
const winCamp = { at: winsen36, stock: 'c3_farm_stock', rest: false as const };
const jestCamp = { at: jest36, stock: 'c3_farm_stock', rest: false as const };
const offered: Cond = flag('w.c35_nurse_offer');
const ninaAlive: Cond = { npc: 'c7_nina', alive: true };
const ninaHere: Cond = all(ninaAlive, any(ninaFarm, ninaWinsen36));
const okafor36: Cond = { npc: 'okafor', alive: true };

export const day36BScenes: Scene[] = [
  X({ id: 'c36_b_go', title: 'К дороге', camp: yard14, ambient: frost36,
    text: [
      { text: 'В восемь у поворота к колонии проходит пикап Красного Креста: собирает тех, кому в Винзен. Обратно в три.' },
      { when: all(bNorth36, offered), text: 'Зандер велела зарегистрироваться сегодня: десятого на это времени не будет.' },
      { when: all(not(bNorth36), offered), text: 'Ехать на север ты не будешь. Надо сказать об этом в Винзене самой и отдать то, что Зандер передала для спортзала.' },
      { when: not(offered), text: 'Зандер дала тебе коробку с бинтами для спортзала в Винзене. И список: что спросить у Красного Креста.' },
      { when: ninaFarm, text: 'Нина уже стоит у ворот с рюкзаком. Ей в школу, три часа в день.' },
    ],
    actions: [
      { id: 'c36_bg_nina', label: 'Идти к дороге вместе с Ниной', when: all(ninaFarm, ninaAlive), minutes: 15, terminal: true, goto: 'c36_b_truck', ambientDuring: frost36,
        text: 'Нина идёт рядом, подстраиваясь под твой шаг. По-русски, вполголоса, она спрашивает: «А если вы уедете, кто меня будет будить в школу?» Ты отвечаешь: Хенрике. Нина кивает. Это её устраивает больше, чем ты думал{m:|а}.', effects: [set36('bg', 'nina'), npc('c7_nina', 1), until36(8, 0)] },
      { id: 'c36_bg_okafor', label: 'Идти с Окафором: ему тоже в Винзен', when: all(okaforComes, okafor36), minutes: 15, terminal: true, goto: 'c36_b_truck', ambientDuring: frost36,
        text: 'Окафор идёт медленно, в шапке, натянутой до бровей. «Your friend has nine days, — говорит он по-английски, как всегда, когда о важном. — Maybe ten, if she is careful. She is not careful». У твоей подруги девять дней. Может, десять, если будет осторожна. Она не осторожна.', effects: [set36('bg', 'okafor'), w36('merle_days', true), until36(8, 0)] },
      { id: 'c36_bg_alone', label: 'Выйти пораньше одной', minutes: 15, terminal: true, goto: 'c36_b_truck', ambientDuring: frost36,
        text: 'Ты выходишь раньше всех. Над полем розовое небо, снег звенит. Пятнадцать минут тишины, которых сегодня больше не будет.', effects: [set36('bg', 'alone'), { body: 'stress', delta: -2 }, until36(8, 0)] },
    ] }),

  X({ id: 'c36_b_truck', title: 'Пикап', location: 'c7_farm_lane', camp: winCamp, ambient: frost36,
    text: [
      { text: 'Открытый кузов пикапа, брезент от ветра. Шесть человек на скамейках, ящики под ногами. Водитель — пожилой, в куртке Красного Креста поверх тулупа.' },
      { when: ninaFarm, text: 'Нина садится у борта и сразу открывает учебник: проверочная по немецкому.' },
    ],
    actions: [
      { id: 'c36_bt_nina', label: 'Помочь Нине с немецким', when: all(ninaFarm, ninaAlive), minutes: 60, terminal: true, goto: 'c36_b_desk', ambientDuring: frost36,
        text: 'Ты спрашиваешь слова, Нина отвечает. «Der Abschied». Прощание. «Die Heimat». Родина. «Die Brücke». Мост. На последнем слове она поднимает глаза и спрашивает, правда ли мост закроют. Ты говоришь: правда.', effects: [set36('bt', 'nina'), npc('c7_nina', 1), until36(9, 0)] },
      { id: 'c36_bt_driver', label: 'Пересесть к водителю в кабину: расспросить про десятое', minutes: 60, terminal: true, goto: 'c36_b_desk', ambientDuring: cab36,
        text: 'Водитель рад собеседнику. В Аренсбурге в спортзале четыреста человек, говорит он. Кормят раз в день. Инсулина нет с прошлой среды. «Und am Zehnten, um sechs am Abend, macht die Bundeswehr die Brücke zu. Wer dann noch drüben ist, bleibt drüben». А десятого в шесть вечера бундесвер закрывает мост. Кто тогда ещё на том берегу, там и останется.', effects: [set36('bt', 'driver'), w36('knows_ahrensburg', true), until36(9, 0)] },
      { id: 'c36_bt_doze', label: 'Задремать, прижавшись к ящикам', minutes: 60, activity: 'rest', terminal: true, goto: 'c36_b_desk', ambientDuring: frost36,
        text: 'Ты засыпаешь под качку и просыпаешься от толчка уже в Винзене. Шея затекла, ноги замёрзли. Но голова яснее.', effects: [set36('bt', 'doze'), { body: 'fatigue', delta: -4 }, until36(9, 0)] },
    ] }),

  X({ id: 'c36_b_desk', title: 'Стол регистрации', location: winsen36, camp: winCamp, ambient: hall36,
    text: [
      { text: 'В фойе школы стол, накрытый клеёнкой. Координатор Красного Креста, женщина с седой косой, пишет списки в амбарную книгу. За её спиной на стене карта: Винзен, Гестхахт, Аренсбург, стрелки красным маркером.' },
      { when: bNorth36, text: '— Sie sind die Aushilfe von Doktor Sander? Gut. Name, Geburtsdatum, Blutgruppe. Sie fahren im ersten Wagen. Sechs Uhr, nicht zehn nach.\n\nВы помощница от доктора Зандер? Хорошо. Имя, дата рождения, группа крови. Поедете в первой машине. В шесть, не в десять минут седьмого.' },
      { when: all(not(bNorth36), offered), text: 'Координатор находит твоё имя в книге: вписано карандашом, со знаком вопроса. Она поднимает глаза и ждёт.' },
      { when: not(offered), text: 'Координатор кивает на коробку с бинтами в твоих руках: «Von Sander? Danke. Hinten, in die Turnhalle». От Зандер? Спасибо. Сзади, в спортзал.' },
      { when: all(bNorth36, way36('east')), text: 'Колонна на север уходит из этой школы в шесть. Колонна Павла на восток — в семь, с того же двора. В один день в обе стороны не поехать.' },
    ],
    actions: [
      { id: 'c36_bd_sign', label: 'Расписаться и взять удостоверение', when: bNorth36, minutes: 30, terminal: true, goto: 'c36_b_gym',
        text: 'Бумага с печатью, твоё имя, «Krankenschwester (Aushilfe)», дата. Координатор объясняет быстро: в машине лекарства, в Аренсбурге раздать по списку, обратно — тех, у кого семья к югу от Эльбы. Мест обратно мало.', effects: [set36('bd', 'sign'), w36('nurse_signed', true), until36(9, 30)] },
      { id: 'c36_bd_merle', label: 'Расписаться и спросить: найдётся ли обратно место для Мерле', when: bNorth36, minutes: 35, terminal: true, goto: 'c36_b_gym',
        text: 'Координатор листает книгу. «Merle H., Ahrensburg. Diabetikerin. — Пауза. — Wenn sie Familie südlich der Elbe hat. Haben Sie?» Если у неё семья к югу от Эльбы. Есть? Ты говоришь: мы. Она вписывает Мерле в список на обратный путь, карандашом.', effects: [set36('bd', 'merle'), w36('nurse_signed', true), w36('merle_seat', true), until36(9, 35)] },
      { id: 'c36_bd_lea', label: 'Отказаться и предложить вместо себя Лею', when: all(not(bNorth36), offered, lea36), minutes: 30, terminal: true, goto: 'c36_b_gym',
        text: 'Ты говоришь: ветеринар, четвёртый курс, руки точные, уколы делает лучше тебя. Координатор морщится на слове «ветеринар», потом пожимает плечами: «Besser als niemand. Sie soll heute noch kommen». Лучше, чем никто. Пусть придёт сегодня же. Ты не спросил{m:|а} Лею. Теперь придётся.', effects: [set36('bd', 'lea'), w36('nurse', 'lea'), until36(9, 30)] },
      { id: 'c36_bd_okafor', label: 'Отказаться: Окафор справится один', when: all(not(bNorth36), offered), minutes: 25, terminal: true, goto: 'c36_b_gym',
        text: 'Координатор вычёркивает твоё имя. «Dann fährt der Pfleger allein. Er ist gut. Er wird müde sein». Тогда санитар поедет один. Он хороший. Он будет уставшим.', effects: [set36('bd', 'okafor'), w36('nurse', 'none'), until36(9, 25)] },
      { id: 'c36_bd_box', label: 'Отдать коробку и спросить, что ещё нужно спортзалу', when: not(bNorth36), minutes: 25, terminal: true, goto: 'c36_b_gym',
        text: 'Координатор считает на пальцах: бинты, жаропонижающее, тёплые носки, руки. Особенно руки. Ты остаёшься.', effects: [set36('bd', 'box'), until36(9, 30)] },
    ] }),

  X({ id: 'c36_b_gym', title: 'Спортзал', location: winsen36, camp: winCamp, safe: false, ambient: hall36,
    text: [
      { text: 'Спортзал школы — сто двадцать раскладушек рядами. Пахнет мокрыми носками, хлоркой и супом. Люди из Гамбурга-Норд, привезённые колонной Красного Креста: старики, семьи, двое солдат на костылях.' },
      { text: 'Старик у двери просит отвести его в туалет. Туалет во дворе, в вагончике. До него — пять обледенелых ступенек без перил.' },
    ],
    actions: [
      { id: 'c36_bm_carry', label: 'Взять его под руку и свести самой', minutes: 25, activity: 'moderate', risky: true, terminal: true, goto: 'c36_b_child',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 3, uses: ['mobility'] },
            text: 'Он лёгкий, как мешок с сеном, но держится за тебя всей тяжестью. Ступенька, ещё одна. Ты ставишь ногу боком, как учила Хенрике на крыльце. Дошли. Обратно так же. Старик говорит «danke» пять раз подряд.',
            effects: [set36('bm', 'carry'), { body: 'fatigue', delta: 4 }, until36(10, 0)] },
          { id: 'fall',
            text: 'На третьей ступеньке твоя нога уезжает. Ты успеваешь развернуться и упасть первой, чтобы он упал на тебя, а не на лёд. Бедро и локоть принимают всё. Старик цел, только испуган. Двое мужчин из зала помогают вам подняться. Локоть ноет и не разгибается до конца.',
            effects: [set36('bm', 'fall'), { injure: 'bruise', site: 'leftArm', severity: 1 }, { body: 'stress', delta: 6 }, until36(10, 0)] },
        ] },
      { id: 'c36_bm_help', label: 'Позвать двоих мужчин из зала и посыпать ступени золой', minutes: 30, terminal: true, goto: 'c36_b_child',
        text: 'Зола из печки в учительской, ведро на ступени. Двое мужчин берут старика под руки. Дольше, зато никто не падает. Мужчины остаются потом у двери: оказывается, им просто никто не говорил, что нужна помощь.', effects: [set36('bm', 'help'), w36('gym_steps', true), until36(10, 5)] },
      { id: 'c36_bm_bucket', label: 'Принести ему ведро за ширму', minutes: 20, terminal: true, goto: 'c36_b_child',
        text: 'Ширма из простыни на верёвке, ведро с крышкой. Старик смотрит на ведро, потом на тебя, и в глазах у него стыд. Он говорит: ничего, так тоже можно. Ты понимаешь, что ему это стоило больше, чем ступеньки.', effects: [set36('bm', 'bucket'), { body: 'stress', delta: 2 }, until36(9, 55)] },
    ] }),

  X({ id: 'c36_b_child', title: 'Пальцы', location: winsen36, camp: winCamp, ambient: hall36,
    text: [
      { text: 'Мать приводит девочку лет восьми. Девочка не плачет, только держит руки под мышками. Ночевали в машине, говорит мать, варежки потерялись.' },
      { text: 'Пальцы на обеих руках белые, восковые, холодные. Девочка ими почти не шевелит.' },
    ],
    actions: [
      { id: 'c36_bc_slow', label: 'Отогревать медленно: тёплая, не горячая вода, без растирания', minutes: 30, terminal: true, goto: 'c36_b_nina',
        text: 'Таз, вода чуть теплее руки. Десять минут, ещё десять. Пальцы краснеют, девочка начинает плакать: больно, кровь пошла. Это хорошо, говоришь ты матери. Больно — значит, живые. Мать держит дочь за плечи и смотрит на тебя, как на врача.', effects: [set36('bc', 'slow'), w36('child_ok', true), until36(10, 35)] },
      { id: 'c36_bc_snow', label: 'Растереть снегом: так всегда делали', minutes: 25, terminal: true, goto: 'c36_b_nina',
        text: 'Ты трёшь пальцы снегом. Девочка кричит. Подходит фельдшер из соседнего ряда и молча отводит твои руки: «Nicht reiben. Nie. Das reißt die Haut». Не тереть. Никогда. Это рвёт кожу. Он кладёт её руки в таз с тёплой водой. Ты стоишь рядом и не знаешь, куда деть свои.', effects: [set36('bc', 'snow'), { body: 'stress', delta: 5 }, until36(10, 35)] },
      { id: 'c36_bc_body', label: 'Сунуть её руки себе под свитер, на живот', minutes: 30, terminal: true, goto: 'c36_b_nina',
        text: 'Ледяные пальцы на голом животе. Ты вздрагиваешь, девочка смотрит на тебя круглыми глазами и вдруг смеётся. Через двадцать минут пальцы розовеют. Мать приносит тебе свой чай.', effects: [set36('bc', 'body'), w36('child_ok', true), { body: 'stress', delta: -2 }, until36(10, 35)] },
    ] }),

  X({ id: 'c36_b_nina', title: 'Урок', location: winsen36, camp: winCamp, ambient: hall36,
    text: [
      { when: ninaHere, text: 'В углу спортзала, за ширмой из матов, учительница ведёт урок для двенадцати детей разного возраста. Нина сидит во втором ряду. Сегодня читают вслух сочинения: «Wo ich Weihnachten sein werde». Где я буду на Рождество.' },
      { when: ninaHere, text: 'Очередь Нины. Она встаёт, смотрит на тебя за ширмой и читает медленно, с акцентом: про хутор, корову, про то, что дома теперь пахнет дымом и картошкой. В конце: «Und meine zwei vom Hof, wenn sie bleiben». И мои двое с хутора, если останутся.' },
      { when: not(ninaHere), text: 'В углу спортзала, за матами, идёт урок. Учительница читает детям сказку. Двенадцать детей разного возраста слушают молча, в куртках.' },
    ],
    actions: [
      { id: 'c36_bn_clap', label: 'Похлопать громче всех', when: ninaHere, minutes: 30, terminal: true, goto: 'c36_b_pawel',
        text: 'Ты хлопаешь, и Нина краснеет до ушей. Учительница улыбается. После урока Нина проходит мимо тебя и толкает плечом: «Peinlich». Стыдно. Но улыбается.', effects: [set36('bn', 'clap'), npc('c7_nina', 2), until36(11, 15)] },
      { id: 'c36_bn_talk', label: 'После урока спросить, что значит «если останутся»', when: ninaHere, minutes: 35, terminal: true, goto: 'c36_b_pawel',
        text: 'Нина пожимает плечами и смотрит в пол. По-русски: «Ну, вы же решаете. Я просто написала, как есть». Потом добавляет: «Я не обижусь. Я уже привыкла, что все уходят». Это хуже, чем если бы она обиделась.', effects: [set36('bn', 'talk'), w36('nina_asked', true), until36(11, 20)] },
      { id: 'c36_bn_teacher', label: 'Спросить учительницу, будет ли школа после пятнадцатого', minutes: 30, terminal: true, goto: 'c36_b_pawel',
        text: 'Учительница вздыхает. «Wenn die Lastwagen nicht mehr fahren, kommen nur die, die laufen können. Oder mit dem Rad». Когда грузовики перестанут ходить, будут приходить только те, кто может дойти пешком. Или на велосипеде.', effects: [set36('bn', 'teacher'), w36('school_bike', true), until36(11, 15)] },
    ] }),

  X({ id: 'c36_b_pawel', title: 'Школьный двор', location: winsen36, camp: winCamp, ambient: frost36,
    text: [
      { text: 'На школьном дворе собирается колонна на восток: одиннадцать легковушек, микроавтобус, грузовичок с прицепом. Люди говорят по-польски, грузят мешки на крыши.' },
      { when: pawel36, text: 'Павел замечает тебя первым. Он похудел, борода с проседью. Обнимает осторожно, как будто боится помять.\n\n— Pani! Dobrze, że jesteś.\n\nХорошо, что ты пришла.' },
      { when: all(pawel36, way36('east')), text: '— Miejsce dla dwojga jest. W moim samochodzie. — Он кивает на серый «Пассат» с мешками на крыше. — Dziesiątego, siódma.\n\nМесто для двоих есть. В моей машине. Десятого, в семь.' },
      { when: all(pawel36, not(way36('east'))), text: '— Słyszałem, że zostajecie. — Он не спрашивает, говорит. — Dobrze. Pani Henrike potrzebuje rąk.\n\nСлышал, вы остаётесь. Хорошо. Пани Хенрике нужны руки.' },
      { when: not(pawel36), text: 'Тот, кого называют старшим, — мужчина в оранжевой куртке дорожного рабочего — пересчитывает машины по пальцам и ругается.' },
    ],
    actions: [
      { id: 'c36_bp_seat', label: 'Подтвердить: место ваше, десятого в семь', when: all(pawel36, way36('east')), minutes: 30, terminal: true, goto: 'c36_b_list',
        text: 'Павел записывает в блокнот твоё имя и имя {partner.gen}. Буквы у него крупные, детские. «Dobrze. Nie spóźnijcie się. Most zamykają o szóstej». Хорошо. Не опаздывайте. Мост закрывают в шесть.', effects: [set36('bp', 'seat'), w36('pawel_seat', true), npc('pawel', 1), until36(11, 50)] },
      { id: 'c36_bp_kasia', label: 'Попросить место для Каси', when: pawel36, minutes: 30, terminal: true, goto: 'c36_b_list',
        text: '— Kasia Nowak? Żona Dariusza? — Павел снимает шапку и мнёт её в руках. — Dla niej zawsze. Niech przyjdzie.\n\nКася Новак? Жена Дариуша? Для неё всегда. Пусть приходит.', effects: [set36('bp', 'kasia'), w36('kasia_seat', true), npc('pawel', 1), until36(11, 50)] },
      { id: 'c36_bp_give', label: 'Отдать ему бинты и таблетки из своей сумки: в дорогу', when: pawel36, minutes: 25, terminal: true, goto: 'c36_b_list',
        text: 'Павел смотрит на бинты и на тебя. Прячет во внутренний карман, к документам. «Bóg zapłać». Бог воздаст. Он говорит это без улыбки, как говорят серьёзные вещи.', effects: [set36('bp', 'give'), w36('pawel_bandages', true), npc('pawel', 2), until36(11, 45)] },
      { id: 'c36_bp_ask', label: 'Спросить, куда они пойдут после моста', minutes: 30, terminal: true, goto: 'c36_b_list',
        text: 'Мёльн, Шверин, потом на Щецин. Шестьсот километров, если повезёт с бензином и дорогами. «A granica?» — спрашивает кто-то рядом. А граница? Никто не отвечает.', effects: [set36('bp', 'ask'), w36('east_route', true), until36(11, 50)] },
    ] }),

  X({ id: 'c36_b_list', title: 'Список для моста', location: winsen36, camp: winCamp, ambient: frost36,
    text: [
      { text: 'У микроавтобуса сидит женщина с папкой: составляет список колонны для армии. Без списка на мосту не пропустят. Имя, документы, кто за кого отвечает.' },
      { when: kasiaGoes36, text: 'Кася хочет на восток. Если её имени не будет в списке, мост для неё закроется вместе со всеми.' },
    ],
    actions: [
      { id: 'c36_bl_us', label: 'Вписать вас двоих', when: way36('east'), minutes: 25, terminal: true, goto: 'c36_b_okafor',
        text: 'Женщина пишет медленно, проговаривая буквы вслух. Документы, говорит она, десятого покажете на мосту. Если их нет, пусть Павел за вас ручается. Ты расписываешься в графе «отвечает»: за себя и за {partner.acc}.', effects: [set36('bl', 'us'), w36('east_listed', true), until36(12, 20)] },
      { id: 'c36_bl_kasia', label: 'Вписать Касю', when: kasiaGoes36, minutes: 25, terminal: true, goto: 'c36_b_okafor',
        text: '«Katarzyna Nowak». Ты диктуешь по буквам, как Кася однажды писала на листке. Женщина кивает: полька, вопросов не будет.', effects: [set36('bl', 'kasia'), w36('kasia_listed', true), until36(12, 20)] },
      { id: 'c36_bl_ask', label: 'Спросить, что будет, если имени нет в списке', minutes: 20, terminal: true, goto: 'c36_b_okafor',
        text: '— Dann stehen Sie an der Brücke und gucken, wie wir fahren. — Женщина не злая, она просто устала. Тогда будете стоять у моста и смотреть, как мы уезжаем.', effects: [set36('bl', 'ask'), until36(12, 15)] },
      { id: 'c36_bl_none', label: 'Никого не вписывать', minutes: 15, terminal: true, goto: 'c36_b_okafor',
        text: 'Ты отходишь от микроавтобуса. Женщина уже пишет следующего.', effects: [set36('bl', 'none'), until36(12, 10)] },
    ] }),

  X({ id: 'c36_b_okafor', title: 'Медицинский угол', location: winsen36, camp: winCamp, ambient: hall36,
    text: [
      { when: okafor36, text: 'В углу спортзала, за столом с аптечкой, Окафор перебирает коробки с лекарствами и пишет на каждой фломастером. Он показывает тебе пустую коробку из-под инсулина.' },
      { when: okafor36, text: '— In Ahrensburg there is none since Wednesday. Your friend has what she saved. Nine days. Maybe.\n\nВ Аренсбурге нет с прошлой среды. У твоей подруги то, что она сэкономила. Девять дней. Может быть.' },
      { when: all(okafor36, insulinHome36), text: 'Ты думаешь о коробке из-под чая в кладовке Хенрике. Шприц-ручки из синей сумки.' },
      { when: not(okafor36), text: 'В медицинском углу спортзала фельдшер перебирает коробки. Инсулина, говорит он, нет ни здесь, ни в Аренсбурге.' },
    ],
    actions: [
      { id: 'c36_bo_pens', label: 'Сказать Окафору про ручки на хуторе', when: all(okafor36, insulinHome36), minutes: 30, terminal: true, goto: 'c36_b_soup',
        text: 'Окафор кладёт фломастер. «How many?» Сколько? Ты говоришь. Он считает на пальцах, медленно. «For her — months. For the hall in Ahrensburg — one week». Для неё — месяцы. Для зала в Аренсбурге — неделя. Он не говорит, что выбрать. Только смотрит.', effects: [set36('bo', 'pens'), w36('okafor_pens', true), until36(13, 0)] },
      { id: 'c36_bo_bring', label: 'Попросить его привезти Мерле на хутор, если поедет без тебя', when: all(okafor36, not(bNorth36)), minutes: 30, terminal: true, goto: 'c36_b_soup',
        text: '— If she wants to come. — Окафор кивает. Если она захочет. — She is a grown woman. But I will tell her there is a place.\n\nОна взрослая. Но я скажу ей, что место есть.', effects: [set36('bo', 'bring'), w36('okafor_brings', true), npc('okafor', 1), until36(13, 0)] },
      { id: 'c36_bo_how', label: 'Спросить, как растянуть то, что у неё есть', minutes: 30, terminal: true, goto: 'c36_b_soup',
        text: 'Окафор объясняет коротко: есть меньше углеводов, двигаться, мерить сахар, если есть чем. Не голодать: от голода тоже плохо. «She knows all this. She is diabetic since nine years old. But tell her anyway». Она всё это знает. У неё диабет с девяти лет. Но скажи всё равно.', effects: [set36('bo', 'how'), w36('merle_advice', true), until36(13, 0)] },
      { id: 'c36_bo_work', label: 'Помочь ему разобрать коробки', minutes: 30, terminal: true, goto: 'c36_b_soup',
        text: 'Вы работаете молча, рядом. Жаропонижающее отдельно, бинты отдельно, просроченное в коробку на полу. Окафор в конце говорит: «You are good at this». У тебя это хорошо получается. Для него это много слов.', effects: [set36('bo', 'work'), { if: okafor36, then: [{ npc: 'okafor', trust: 1 }] }, until36(13, 0)] },
    ] }),

  X({ id: 'c36_b_soup', title: 'Суп', location: winsen36, camp: winCamp, ambient: hall36,
    text: [
      { text: 'Час дня. В столовой школы раздают суп из полевой кухни: перловка, морковь, немного мяса. Очередь до двери.' },
      { text: 'Перед тобой стоит мальчик лет десяти. Он уже получил свою миску, выпил её у раздачи залпом и встал в очередь снова. Повар его узнаёт и качает головой.' },
    ],
    actions: [
      { id: 'c36_bs_eat', label: 'Взять свою миску и поесть', minutes: 30, terminal: true, goto: 'c36_b_radio',
        text: 'Суп горячий, жидкий, но сытный. Ты ешь, не снимая куртки. Мальчик стоит у стены и смотрит на твою миску.', effects: [set36('bs', 'eat'), ...fed36, until36(13, 30)] },
      { id: 'c36_bs_boy', label: 'Отдать свою миску мальчику', minutes: 30, terminal: true, goto: 'c36_b_radio',
        text: 'Мальчик берёт миску обеими руками, не говоря ни слова, и уходит в угол. Ты пьёшь горячую воду с раздачи. Есть хочется до вечера.', effects: [set36('bs', 'boy'), { body: 'hunger', delta: 5 }, w36('soup_boy', true), until36(13, 30)] },
      { id: 'c36_bs_half', label: 'Поесть половину, половину отдать', minutes: 30, terminal: true, goto: 'c36_b_radio',
        text: 'Ты съедаешь полмиски и отдаёшь остальное мальчику. Он доедает так быстро, что ты не успеваешь отвернуться.', effects: [set36('bs', 'half'), { body: 'hunger', delta: -15 }, { body: 'thirst', delta: -15 }, until36(13, 30)] },
    ] }),

  X({ id: 'c36_b_radio', title: 'Радиорубка', location: winsen36, camp: winCamp, ambient: hall36,
    text: [
      { text: 'В бывшей учительской стоит рация Красного Креста. Связь с Аренсбургом два раза в день. Радист берёт сообщения на бумажке: не больше десяти слов.' },
      { text: 'Десять слов для Мерле. Её прочтут вслух в спортзале Аренсбурга сегодня вечером.' },
    ],
    actions: [
      { id: 'c36_br_come', label: '«Мерле. Десятого колонна. Приезжай к нам на хутор. Место есть»', minutes: 25, terminal: true, goto: 'c36_b_market',
        text: 'Радист считает слова, кивает и пишет. Сегодня в семь вечера в Аренсбурге кто-то крикнет «Мерле!» в спортзале на четыреста человек.', effects: [set36('br', 'come'), w36('merle_msg', 'come'), until36(14, 0)] },
      { id: 'c36_br_wait', label: '«Мерле. Жди десятого у колонны. Мы привезём что нужно»', when: bNorth36, minutes: 25, terminal: true, goto: 'c36_b_market',
        text: 'Радист пишет. «Wir bringen, was nötig ist». Привезём, что нужно. Ты не написал{m:|а} «инсулин»: вдруг услышат другие.', effects: [set36('br', 'wait'), w36('merle_msg', 'wait'), until36(14, 0)] },
      { id: 'c36_br_stay', label: '«Мерле. Оставайся с родителями. Там армия. Береги себя»', minutes: 25, terminal: true, goto: 'c36_b_market',
        text: 'Радист пишет. Ты смотришь на бумажку и не узнаёшь свой почерк. Если Мерле послушается, вы, может быть, больше не увидитесь. Но за Эльбой армия, аптеки, порядок.', effects: [set36('br', 'stay'), w36('merle_msg', 'stay'), until36(14, 0)] },
      { id: 'c36_br_none', label: 'Ничего не передавать: решить потом, вдвоём', minutes: 15, terminal: true, goto: 'c36_b_market',
        text: 'Ты выходишь из рубки. Десять слов можно передать и завтра. Если решите, какие.', effects: [set36('br', 'none'), until36(13, 50)] },
    ] }),

  X({ id: 'c36_b_market', title: 'Рынок', location: winsen36, camp: winCamp, ambient: frost36,
    text: [
      { text: 'На площади у ратуши меняются. Денег никто не берёт: яйца на бензин, свечи на табак, работа на еду. Женщина продаёт ледоступы, железные шипы на резинке, на ботинки. Мужчина рядом — батарейки, четыре штуки, круглые.' },
      { text: 'Женщина с ледоступами хромает. Она видит у тебя на рукаве повязку Красного Креста и спрашивает, не посмотришь ли ногу.' },
    ],
    actions: [
      { id: 'c36_bk_spikes', label: 'Посмотреть ей ногу за пару ледоступов', minutes: 30, terminal: true, goto: 'c36_b_bike',
        text: 'Растяжение, старое, перевязано неправильно. Ты перебинтовываешь туго, от пальцев вверх. Женщина встаёт, пробует, улыбается. Ледоступы ложатся тебе в карман, холодные и тяжёлые.', effects: [set36('bk', 'spikes'), { give: 'c36_spikes' }, until36(14, 30)] },
      { id: 'c36_bk_batt', label: 'Выменять батарейки для приёмника Хенрике: за помощь с ногой', minutes: 30, terminal: true, goto: 'c36_b_bike',
        text: 'Ты перевязываешь ногу. Мужчина с батарейками смотрит, потом говорит: «Für die Frau hab ich auch was». За неё и у меня кое-что есть. Четыре батарейки. Приёмник на кухне будет говорить до Рождества.', effects: [set36('bk', 'batt'), { give: 'c36_batteries' }, until36(14, 30)] },
      { id: 'c36_bk_free', label: 'Перевязать ногу просто так', minutes: 25, terminal: true, goto: 'c36_b_bike',
        text: 'Ты перевязываешь и не берёшь ничего. Женщина долго смотрит, потом достаёт из-за пазухи яблоко, сморщенное, прошлогоднее, и кладёт тебе в руку. Отказаться нельзя.', effects: [set36('bk', 'free'), { body: 'hunger', delta: -4 }, { body: 'stress', delta: -2 }, until36(14, 25)] },
    ] }),

  X({ id: 'c36_b_bike', title: 'Велосипед', location: winsen36, camp: winCamp, ambient: frost36,
    text: [
      { when: ninaHere, text: 'Нина ждёт тебя у школы после уроков. Она ведёт тебя к сараю за спортзалом: там стоит её велосипед, синий, с корзинкой. На нём она приехала в Винзен в ноябре.' },
      { when: ninaHere, text: '— Wenn keine Lastwagen mehr fahren… — Она переходит на русский. — Если грузовиков больше не будет, я буду ездить на нём. Двенадцать километров. Я смогу.' },
      { when: not(ninaHere), text: 'У ворот школы пикап уже заводят. До отъезда пятнадцать минут. На крыльце стоит учительница и курит, глядя на дорогу.' },
    ],
    actions: [
      { id: 'c36_bb_take', label: 'Забрать велосипед с собой в пикап', when: ninaHere, minutes: 30, terminal: true, goto: 'c36_b_back',
        text: 'Водитель ворчит, но помогает закинуть велосипед в кузов. Нина держит его за раму всю дорогу, чтобы не бился о борт.', effects: [set36('bb', 'take'), w36('nina_bike', 'farm'), npc('c7_nina', 1), until36(15, 0)] },
      { id: 'c36_bb_no', label: 'Сказать: двенадцать километров по льду одной — нет', when: ninaHere, minutes: 25, terminal: true, goto: 'c36_b_back',
        text: 'Нина сжимает губы. «Du bist nicht meine Mutter». Ты не моя мать. Потом, тише, по-русски: «Извини». Велосипед остаётся в сарае.', effects: [set36('bb', 'no'), w36('nina_bike', 'winsen'), npc('c7_nina', -1), until36(15, 0)] },
      { id: 'c36_bb_spring', label: 'Договориться: велосипед — когда отпустит мороз', when: ninaHere, minutes: 30, terminal: true, goto: 'c36_b_back',
        text: 'Нина торгуется, как взрослая: не весной, а когда снег сойдёт с дороги. Ты соглашаешься. Она пожимает тебе руку, серьёзно, и смеётся.', effects: [set36('bb', 'spring'), w36('nina_bike', 'thaw'), npc('c7_nina', 1), until36(15, 0)] },
      { id: 'c36_bb_teacher', label: 'Поговорить с учительницей, пока ждёшь', when: not(ninaHere), minutes: 30, terminal: true, goto: 'c36_b_back',
        text: 'Учительница говорит, что после пятнадцатого школа, наверное, закроется. Дети живут по всему округу, без машин их не собрать. Она бросает окурок в снег и долго на него смотрит.', effects: [set36('bb', 'teacher'), until36(15, 0)] },
    ] }),

  X({ id: 'c36_b_back', title: 'Обратно', location: 'c7_farm_lane', camp: winCamp, safe: false, ambient: frost36,
    text: [
      { text: 'Пикап выезжает из Винзена в три. Солнце уже низко, тени длинные и синие.' },
      { text: 'На полдороге, у поворота на Ханштедт, на обочине стоит легковушка с открытым капотом. Женщина машет обеими руками. На заднем сиденье — двое детей в одеялах.' },
      { text: 'Водитель сбавляет и ругается: «Wenn wir halten, kommen wir im Dunkeln an. Und hinten ist kein Platz». Если остановимся, приедем затемно. И сзади нет места.' },
    ],
    actions: [
      { id: 'c36_bk2_stop', label: 'Настоять: остановиться, детей взять в кузов', minutes: 50, terminal: true, goto: 'c36_b_point',
        text: 'Водитель тормозит со вздохом. Детей ты сажаешь к себе на колени, женщина садится на ящики. Пикап едет медленнее, ветер режет лицо. Женщина всю дорогу повторяет одно и то же: аккумулятор, она не знала, что на морозе он садится за ночь.', effects: [set36('bk2', 'stop'), w36('family_taken', true), { body: 'stress', delta: 2 }, until36(16, 15)] },
      { id: 'c36_bk2_gloves', label: 'Не останавливаться, но бросить им свои варежки и шарф', minutes: 40, terminal: true, goto: 'c36_b_point',
        text: 'Ты бросаешь варежки и шарф на ходу. Женщина ловит один, второй падает в снег. В зеркале видно, как она бежит его поднять. До Йестебурга у тебя немеют пальцы.', effects: [set36('bk2', 'gloves'), { body: 'stress', delta: 4 }, { body: 'fatigue', delta: 3 }, until36(16, 0)] },
      { id: 'c36_bk2_tell', label: 'Пообещать прислать за ними помощь из Йестебурга', minutes: 40, terminal: true, goto: 'c36_b_point',
        text: 'Ты кричишь женщине на ходу: пришлём кого-нибудь, ждите в машине, двигатель не включайте. Она кивает. В Йестебурге ты сразу идёшь в пожарную часть. Лукас обещает съездить на тракторе.', effects: [set36('bk2', 'tell'), w36('family_sent', true), until36(16, 10)] },
    ] }),

  X({ id: 'c36_b_point', title: 'Пункт', location: jest36, camp: jestCamp, ambient: hall36,
    text: [
      { text: 'Пункт Зандер. В приёмной двое ждут на лавке, в кабинете горит лампа. Доктор Зандер выходит тебе навстречу, вытирая руки.' },
      { when: flag('w.c36_nurse_signed'), text: '— Unterschrieben? Gut. Dann sind Sie am Zehnten nicht hier. Ich komme zurecht.\n\nПодписали? Хорошо. Значит, десятого вас здесь не будет. Справлюсь.' },
      { when: v('w.c36_nurse', 'lea'), text: 'Лея сидит у окна. Она уже знает: координатор передала по рации. Смотрит на тебя без выражения.' },
      { when: v('w.c36_nurse', 'none'), text: '— Okafor fährt allein? — Зандер поджимает губы. — Er schafft das. Aber nicht gern.\n\nОкафор поедет один? Справится. Но без удовольствия.' },
    ],
    actions: [
      { id: 'c36_bz_lea', label: 'Поговорить с Леей: ты не спросила её', when: v('w.c36_nurse', 'lea'), minutes: 25, terminal: true, goto: 'c36_b_path',
        text: '— Du hast mich nicht gefragt. — Лея говорит ровно. — Ich fahre. Aber du hast mich nicht gefragt.\n\nТы меня не спросила. Я поеду. Но ты меня не спросила.\n\nЭто не прощение. Это договор.', effects: [set36('bz', 'lea'), npc('c21_lea', -1, 'c36_b_chose_for_me'), w36('lea_goes_north', true), until36(16, 40)] },
      { id: 'c36_bz_report', label: 'Рассказать Зандер про спортзал: что нужно, кому плохо', minutes: 25, terminal: true, goto: 'c36_b_path',
        text: 'Зандер слушает, записывает: девочка с пальцами, старик со ступеньками, инсулин — ноль. «Danke. Das ist mehr wert als zwei Kisten». Спасибо. Это дороже двух ящиков.', effects: [set36('bz', 'report'), w36('zander_report', true), until36(16, 40)] },
      { id: 'c36_bz_rest', label: 'Посидеть пять минут в тепле', minutes: 20, terminal: true, goto: 'c36_b_path',
        text: 'Ты садишься на лавку у печки и закрываешь глаза. Зандер ставит перед тобой кружку с чаем и ничего не говорит. Пять минут, и можно идти дальше.', effects: [set36('bz', 'rest'), { body: 'fatigue', delta: -3 }, { body: 'stress', delta: -2 }, until36(16, 40)] },
    ] }),

  X({ id: 'c36_b_path', title: 'Домой', location: 'c7_farm_lane', camp: jestCamp, safe: false, ambient: frost36,
    text: [
      { text: 'От Йестебурга до хутора — по дороге сорок минут, через поле напрямик двадцать пять. Напрямик — через канаву у лесополосы. Канава замёрзла, но лёд под снегом не видно.' },
      { text: 'Уже почти темно. На хуторе загорается окно кухни.' },
    ],
    actions: [
      { id: 'c36_bh_ditch', label: 'Напрямик, через канаву', minutes: 20, risky: true, terminal: true, goto: 'c36_yard', ambientDuring: frost36,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 2, uses: ['mobility'] },
            text: 'Ты пробуешь лёд ногой у берега, потом переходишь быстро, широким шагом. Лёд держит. Через двадцать минут ты стучишь сапогами о порог.',
            effects: [set36('bh', 'ditch'), until36(17, 0)] },
          { id: 'wet',
            text: 'На середине лёд проседает с хрустом, и правая нога уходит в воду по колено. Ледяная вода в сапоге. Ты выдёргиваешь ногу и бежишь к хутору, пока носок не схватился. Дома нога белая и не чувствует пола.',
            effects: [set36('bh', 'wet'), { body: 'stress', delta: 6 }, { body: 'fatigue', delta: 5 }, w36('b_wet_foot', true), until36(17, 0)] },
        ] },
      { id: 'c36_bh_road', label: 'По дороге, как все', minutes: 40, activity: 'moderate', terminal: true, goto: 'c36_yard', ambientDuring: frost36,
        text: 'Дорога длинная и белая. Сзади кто-то едет на тракторе, сигналит, но ты машешь: дойду. Когда ты входишь во двор, совсем темно.', effects: [set36('bh', 'road'), { body: 'fatigue', delta: 4 }, until36(17, 0)] },
      { id: 'c36_bh_spikes', label: 'Надеть ледоступы и через поле', when: { has: 'c36_spikes' }, minutes: 25, terminal: true, goto: 'c36_yard', ambientDuring: frost36,
        text: 'Шипы впиваются в наст, как кошачьи когти. Через канаву ты переходишь, не думая о льде. Хорошая вещь. Через двадцать минут ты дома.', effects: [set36('bh', 'spikes'), until36(17, 0)] },
    ] }),
];
