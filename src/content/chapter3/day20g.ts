import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { ruthHere18 } from './day18y';
import { A19, B19, S20, npc, own20, set20, until, w20 } from './point19';

// Участок 20, Люнебург: пятница в казарме. Оле, Хенрике, доктор Алерс, ожидание транспорта, который не пришёл.
const lue = 'c18_lueneburg';
const camp = { at: lue, stock: 'c3_farm_stock', rest: false } as const;
const yardAir = { tempC: 4, outdoor: true, wet: false };
const fed: Effect[] = [{ body: 'hunger', delta: -40 }, { body: 'thirst', delta: -35 }];
const prepare = { camp: { kind: 'prepare' as const, quiet: true } };
const G = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S20({ ...scene, for: 'any', chapter: 'ch3', location: lue, camp: scene.camp ?? camp, safe: false });
const henrikeHere: Cond = { npc: 'henrike', alive: true, at: lue };
const phoneHeld: Cond = flag('w.c18_phone_held');
const kasiaHere: Cond = all({ npc: 'kasia', alive: true }, flag('w.nowaks_gone'));
const gaveBlood: Cond = any(all(v('B.c18_bd', 'ole'), not(v('B.c18_bd_paid', 'pen'))), all(v('B.c18_bd', 'insulin'), not(v('B.c18_bd_paid', 'pen'))));
const gunFound: Cond = flag('w.c19_gun');
const afterBreakfast = [{ id: 'a', when: A19, goto: 'c20_g_a_yard' }, { id: 'cmd', when: phoneHeld, goto: 'c20_g_b_commandant' }, { id: 'b', goto: 'c20_g_b_peters' }];
const noBlood = 'Доктор Алерс смотрит на сгиб твоего локтя, где ещё виден синяк от среды.\n\n— Nicht zweimal in drei Tagen. Gehen Sie essen.\n\nНе два раза за три дня. Идите поешьте.';
const noBloodFx: Effect[] = [set20('ga', 'blood_no'), until(20, 10, 50)];
const yesBlood = 'Игла толстая, как в прошлый раз у других. Пакет наполняется двенадцать минут. Доктор Алерс сама держит тебя за плечо, когда ты встаёшь.\n\n— Für heute bekommt Ole Ruhe. Morgen nicht.\n\nСегодня у Оле не возьмут. Завтра — да.';
const yesBloodFx: Effect[] = [set20('ga', 'blood'), w20('b_blood', true), { body: 'bloodLoss', delta: 9 }, { body: 'fatigue', delta: 10 }, npc('ole', 1), npc('henrike', 2), until(20, 11, 20)];
const afterAhlers = [{ id: 'a', when: A19, goto: 'c20_g_a_smoke' }, { id: 'k', when: kasiaHere, goto: 'c20_g_b_kitchen' }, { id: 'b', goto: 'c20_g_b_hanna' }];

export const day20GScenes: Scene[] = [
  G({ id: 'c20_g_gate', title: 'Шлагбаум', ambient: yardAir,
    text: [
      { text: 'Сержант у шлагбаума тот же, что в среду. Он кивает на ящик с ячейками.\n\n— Telefone. Besuch nur Spenderblock, bis sechzehn Uhr.\n\nТелефоны. Посещение только донорского блока, до шестнадцати.' },
      { when: henrikeHere, text: 'Хенрике проходит первой. Пропуск у неё в кармане пальто, она его даже не достаёт.' },
      { when: all(B19, phoneHeld), text: 'Твой телефон с среды у коменданта. «Kommandant. Freitag», — сказал тогда сержант. Сегодня пятница.' },
    ],
    actions: [
      { id: 'c20_gg_give', label: 'Сдать телефон в ячейку', when: any(A19, not(phoneHeld)), minutes: 10, terminal: true, goto: 'c20_g_ole',
        text: 'Телефон уходит в ячейку. Жетон с номером на шнурке холодит шею.', effects: [prepare, set20('gg', 'give'), { phonePower: false }, until(20, 6, 50)] },
      { id: 'c20_gg_car', label: 'Оставить телефон в машине', when: any(A19, not(phoneHeld)), minutes: 10, terminal: true, goto: 'c20_g_ole',
        text: 'Ты возвращаешься к машине и кладёшь телефон в бардачок, выключенный. Сержант смотрит и ничего не говорит.', effects: [prepare, set20('gg', 'car'), { phonePower: false }, until(20, 6, 50)] },
      { id: 'c20_gg_ask', label: 'Спросить про свой телефон у коменданта', when: all(B19, phoneHeld), minutes: 10, terminal: true, goto: 'c20_g_ole',
        text: '— Ab neun, — говорит сержант. С девяти. — Zimmer zwölf. Mit Ausweis.\n\nКомната двенадцать. С документом.', effects: [prepare, set20('gg', 'ask'), until(20, 6, 50)] },
    ] }),

  G({ id: 'c20_g_ole', title: 'Донорский блок',
    text: [
      { text: 'Двенадцать коек, свет вполнакала. Оле у окна. Он открывает глаза, когда вы подходите, и долго смотрит, будто проверяет, не снитесь ли вы ему.\n\n— Was macht ihr hier?\n\nЧто вы тут делаете?' },
      { when: flag('w.c18_ole_rest'), text: 'Теперь у него берут через день. Вчера не брали. Лицо почти обычного цвета.' },
      { when: not(flag('w.c18_ole_rest')), text: 'Под глазами серое. Губы белые. На спинке койки листок: «Tag 11».' },
      { when: henrikeHere, text: 'Хенрике садится на табурет у изголовья и поправляет ему одеяло. Он позволяет.' },
      { text: '— Ich gehe, wenn die Neue da ist, — говорит Оле. — Nicht vorher. Das habe ich den Kindern versprochen.\n\nЯ уйду, когда приедет новая. Не раньше. Я обещал детям.' },
    ],
    actions: [
      { id: 'c20_go_promise', label: 'Сказать: мы за тобой, сразу как она приедет', when: A19, minutes: 15, terminal: true, goto: 'c20_g_breakfast',
        text: '— Сразу, — говоришь ты. — В полдень она тут, к вечеру ты дома.\n\nОле кивает. Он хочет в это верить и поэтому не спорит.', effects: [set20('go', 'promise'), npc('ole', 1), until(20, 7, 40)] },
      { id: 'c20_go_cellar', label: 'Рассказать про подвал и солярку', when: all(A19, any(flag('w.c19_gun'), flag('w.c19_diesel'))), minutes: 15, terminal: true, goto: 'c20_g_breakfast',
        text: 'Ты рассказываешь по порядку: часы, маятник, маленькая дверь, канистра под навозом. Оле слушает, не перебивая.\n\n— Gut, — говорит он.\n\nХорошо. От Оле это много.', effects: [set20('go', 'cellar'), npc('ole', 2), until(20, 7, 40)] },
      { id: 'c20_go_how', label: 'Спросить, как он на самом деле', when: A19, minutes: 15, terminal: true, goto: 'c20_g_breakfast',
        text: 'Оле молча отдаёт тебе листок со спинки койки. Даты, цифры, подписи. Шестьсот, шестьсот, триста, шестьсот.\n\n— Mir ist kalt. Immer, — говорит он. Мне холодно. Всё время.', effects: [set20('go', 'how'), w20('ole_numbers', true), { body: 'stress', delta: 2 }, until(20, 7, 40)] },
      { id: 'c20_go_hand', label: 'Сесть рядом и взять его за руку', when: B19, minutes: 15, terminal: true, goto: 'c20_g_breakfast',
        outcomes: [
          { id: 'remember', when: v('B.c18_bn', 'hand'), text: 'Он смотрит на твою руку и вдруг криво улыбается.\n\n— Du schon wieder.\n\nОпять ты.\n\nВ среду ночью он сжимал твои пальцы в процедурной и не помнил об этом. Видимо, всё-таки запомнил.', effects: [set20('go', 'hand'), npc('ole', 2)] },
          { id: 'plain', text: 'Рука у него холодная и сухая. Он не отнимает её, но и не сжимает. Просто лежит и смотрит в окно.', effects: [set20('go', 'hand'), npc('ole', 1)] },
        ], effects: [until(20, 7, 40)] },
      { id: 'c20_go_noon', label: 'Сказать: замена приедет в полдень, мы будем рядом', when: B19, minutes: 15, terminal: true, goto: 'c20_g_breakfast',
        text: '— Mittag, — повторяет Оле. Полдень. Он поворачивает голову к окну, откуда виден плац и ворота. До полудня ворота будут для него единственным, на что смотреть.', effects: [set20('go', 'noon'), until(20, 7, 40)] },
      { id: 'c20_go_home', label: 'Спросить, что он будет делать дома', when: B19, minutes: 15, terminal: true, goto: 'c20_g_breakfast',
        text: '— Kartoffeln. Hühner. Schlafen, — перечисляет Оле. Картошка. Куры. Спать. Потом, помолчав: — Und Ute fragen, wie man Brot backt. Mama kann das nicht.\n\nИ спросить у Уте, как печь хлеб. Мама не умеет.\n\nХенрике делает вид, что не слышит.', effects: [set20('go', 'home'), npc('ole', 1), until(20, 7, 40)] },
    ] }),

  G({ id: 'c20_g_breakfast', title: 'Столовая',
    text: [
      { text: 'Завтрак в бывшем гараже: каша на воде, хлеб, чай. Солдаты за соседним столом говорят про транспорт. Один громче остальных.' },
      { text: '— Heute kommt die Kuh aus Hannover. Zwei Liter am Tag, sagt der Doc.\n\nСегодня приедет корова из Ганновера. Два литра в день, доктор говорит.\n\nЗа столом смеются. Не все.' },
      { when: henrikeHere, text: 'Хенрике ставит ложку и смотрит на говорящего, пока тот не замолкает.' },
    ],
    actions: [
      { id: 'c20_gb_shut', label: 'Сказать ему, чтобы заткнулся', when: A19, minutes: 20, terminal: true, outcomes: afterBreakfast,
        text: 'Ты говоришь по-немецки, коротко и плохо, но понятно. Солдат поднимается. Его сосед кладёт ему руку на плечо и сажает обратно.\n\n— Lass. Der hat einen da drüben liegen.\n\nОставь. У него там свой лежит.\n\nДальше они едят молча.', effects: [set20('gb', 'shut'), ...fed, until(20, 8, 20)] },
      { id: 'c20_gb_cargo', label: 'Спросить солдат, что ещё везёт транспорт', when: A19, minutes: 20, terminal: true, outcomes: afterBreakfast,
        text: '— Plasma, Insulin, Diesel, Rationen, — загибает пальцы молодой. — Drei LKW, zwei Begleitwagen. Und sie.\n\nПлазма, инсулин, солярка, пайки. Три грузовика, две машины сопровождения. И она.', effects: [set20('gb', 'cargo'), w20('cargo_known', true), ...fed, until(20, 8, 20)] },
      { id: 'c20_gb_name', label: 'Спросить, как её зовут', when: B19, minutes: 20, terminal: true, outcomes: afterBreakfast,
        text: 'Солдат пожимает плечами. Отвечает радист с краю стола, не поднимая головы от кружки:\n\n— Lea. Lea Hartmann. Vierundzwanzig. Hat sich nicht freiwillig gemeldet.\n\nЛея Хартман. Двадцать четыре. Сама не вызывалась.', effects: [set20('gb', 'name'), w20('lea_name', true), ...fed, until(20, 8, 20)] },
      { id: 'c20_gb_give', label: 'Отдать свою кашу Хенрике', when: all(B19, henrikeHere), minutes: 15, terminal: true, outcomes: afterBreakfast,
        text: 'Ты придвигаешь ей свою миску. Хенрике смотрит на неё, потом на тебя.\n\n— Iss du. Du bist jünger.\n\nЕшь сама. Ты моложе.\n\nНо миску не отдаёт обратно.', effects: [set20('gb', 'give'), npc('henrike', 2), until(20, 8, 20)] },
      { id: 'c20_gb_eat', label: 'Есть молча', minutes: 15, terminal: true, outcomes: afterBreakfast,
        text: 'Каша пресная, но горячая. Ты доедаешь до дна.', effects: [set20('gb', 'eat'), ...fed, until(20, 8, 15)] },
    ] }),

  // ───────────── A: двор прачечной, зал списков, машина ─────────────
  G({ id: 'c20_g_a_yard', title: 'Двор прачечной', ambient: yardAir,
    text: [
      { when: { npc: 'pawel', alive: true }, text: 'Во дворе прачечной Павел грузит мешки в фургон. По пятницам фургон уходит в девять: Зальцхаузен, Йестебург, Винзен.\n\n— Pan z hutoru, — говорит он и вытирает руки о ватник. — Też tutaj?\n\nПан с хутора. Тоже здесь?' },
      { when: not({ npc: 'pawel', alive: true }), text: 'Во дворе прачечной шофёр в ватнике грузит мешки в фургон. По пятницам он уходит в девять: Зальцхаузен, Йестебург, Винзен. Его зовут Гюнтер.' },
    ],
    actions: [
      { id: 'c20_gay_note', label: 'Передать записку домой', minutes: 15, terminal: true, goto: 'c20_g_a_lists',
        text: 'Ты пишешь на обрывке накладной: «Мы в Люнебурге. Оле ждёт замену. Вернёмся вечером или завтра». Записка уходит в мешок с бельём для Йестебурга. К обеду её положат в почтовый ящик Людеманов.', effects: [set20('gay', 'note'), w20('note_home', true), until(20, 9, 0)] },
      { id: 'c20_gay_load', label: 'Помочь грузить мешки', minutes: 30, activity: 'moderate', terminal: true, goto: 'c20_g_a_lists',
        outcomes: [
          { id: 'pawel', when: { npc: 'pawel', alive: true }, text: 'Мешки тяжёлые и мокрые. Павел работает молча, потом говорит, не глядя:\n\n— Na autostradzie pod Garlstorfem od wczoraj korek. Ludzie w koszulach szpitalnych. Uważajcie.\n\nНа автобане под Гарльсторфом со вчерашнего дня пробка. Люди в больничных рубашках. Осторожнее.', effects: [set20('gay', 'load'), w20('road_warned', true), npc('pawel', 1)] },
          { id: 'guenter', text: 'Мешки тяжёлые и мокрые. Гюнтер в благодарность говорит, что под Гарльсторфом со вчерашнего дня пробка и на дороге «ходят». Он поедет через Винзен.', effects: [set20('gay', 'load'), w20('road_warned', true)] },
        ], effects: [until(20, 9, 0)] },
      { id: 'c20_gay_eva', label: 'Спросить про Рут и Эву', when: { npc: 'pawel', alive: true }, minutes: 15, terminal: true, goto: 'c20_g_a_lists',
        outcomes: [
          { id: 'eva', when: v('w.c18_seat', 'eva'), text: '— Ewa pojechała z wami? — Павел кивает сам себе. — Dobrze. Ruth płakała, ale dobrze.\n\nЭва уехала с вами? Хорошо. Рут плакала, но хорошо.', effects: [set20('gay', 'eva')] },
          { id: 'both', text: '— Ruth chodzi o kulach. Ewa pyta o wasz hutor codziennie.\n\nРут ходит на костылях. Эва каждый день спрашивает про ваш хутор.', effects: [set20('gay', 'eva')] },
        ], effects: [until(20, 8, 55)] },
    ] }),

  G({ id: 'c20_g_a_lists', title: 'Зал списков',
    text: [
      { text: 'В зале списков утром почти пусто. Ты находишь стену, про которую рассказывала {B}: «Klinikum Buchholz, Station 4». Шестьдесят одна фамилия, двадцать три зачёркнуты синей ручкой.' },
      { text: 'Напротив каждой фамилии, на полях, карандашом одна и та же буква: «P». У всех шестидесяти одной.' },
      { when: flag('w.c18_ilse_listed'), text: '«Brockmann, Ilse». Её фамилия тоже с «P».' },
    ],
    actions: [
      { id: 'c20_gal_p', label: 'Спросить писаря, что значит «P»', minutes: 20, terminal: true, goto: 'c20_g_a_corsa',
        text: 'Писарь, старик в нарукавниках, смотрит на стену поверх очков.\n\n— P wie Plasma. Die waren alle in der Studie. Die erste Station. — Он возвращается к своим бумагам. — Mehr weiß ich nicht.\n\nP — плазма. Они все были в исследовании. Первое отделение. Больше я ничего не знаю.', effects: [set20('gal', 'p'), w20('p_known', true), until(20, 9, 40)] },
      { id: 'c20_gal_gerd', label: 'Найти свою улицу и Герда Брокмана', minutes: 25, terminal: true, goto: 'c20_g_a_corsa',
        text: 'Бухгольц, твоя улица, твой дом. Напротив твоей фамилии: «abgemeldet». Напротив «Brockmann, Gerd»: «vermisst». Пропал. Ты {m:видел|видела} его на лестнице утром первого дня. Ты берёшь карандаш с подоконника и пишешь рядом мелко: «10.11, Treppenhaus. Erkrankt». Лестница. Болен.', effects: [set20('gal', 'gerd'), w20('gerd_written', true), { body: 'stress', delta: 2 }, until(20, 9, 45)] },
      { id: 'c20_gal_go', label: 'Уйти: это тебе ничего не даст', minutes: 10, terminal: true, goto: 'c20_g_a_corsa',
        text: 'Ты выходишь на воздух. Буквы «P» стоят перед глазами, пока ты идёшь через плац.', effects: [set20('gal', 'go'), until(20, 9, 30)] },
    ] }),

  G({ id: 'c20_g_a_corsa', title: 'У машины', ambient: yardAir,
    text: [
      { text: 'Ты выходишь за шлагбаум проверить машину. У Corsa на корточках мужчина в пуховике. Крышка бака откинута, в горловине шланг, рядом пустая канистра. Он тебя пока не видит.' },
    ],
    actions: [
      { id: 'c20_gac_shout', label: 'Крикнуть и бежать к машине', minutes: 10, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты кричишь. Мужчина вскакивает, роняет шланг и бежит вдоль забора, придерживая капюшон. Канистру он бросает. Она пустая. Бензин он слить не успел.', effects: [set20('gac', 'shout'), w20('siphon', 'stopped'), until(20, 10, 20)] },
      { id: 'c20_gac_talk', label: 'Подойти спокойно и спросить, зачем', minutes: 20, terminal: true, goto: 'c20_g_a_corsa2',
        text: 'Он не бежит. Встаёт, держа шланг, как вещь, которую поймали у него в руках.\n\n— Meine Frau ist da drin. Mit dem Kleinen. Heute lassen sie sie raus. Mein Bruder wohnt in Bienenbüttel. Fünfzehn Kilometer. Ich habe keinen Tropfen.\n\nЖена там, с малышом. Сегодня их выпускают. Брат живёт в Биненбюттеле, пятнадцать километров. У меня ни капли.\n\nОн снимает с пальца обручальное кольцо и протягивает тебе.', effects: [set20('gac', 'talk'), until(20, 10, 10)] },
    ] }),

  G({ id: 'c20_g_a_corsa2', title: 'Кольцо', ambient: yardAir,
    text: [
      { text: 'Кольцо тонкое, с царапиной. Пятнадцать километров — это литр с небольшим. Дорога домой — сорок. И вечер, про который вы ещё ничего не знаете.' },
    ],
    actions: [
      { id: 'c20_gac2_give', label: 'Отлить ему два литра, кольцо не брать', minutes: 15, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты сам держишь шланг. Два литра в его канистру, и ты пережимаешь шланг пальцем. Он пытается сунуть тебе кольцо в карман. Ты отводишь его руку.\n\n— Danke, — говорит он несколько раз подряд. Ты смотришь, как он уходит к воротам казармы, и думаешь про стрелку на приборной панели.', effects: [set20('gac2', 'give'), w20('siphon', 'gave'), { siphon: 'opel_corsa', liters: 2 }, until(20, 10, 30)] },
      { id: 'c20_gac2_ring', label: 'Отлить литр за кольцо', minutes: 15, terminal: true, goto: 'c20_g_ahlers',
        text: 'Литр — и ты пережимаешь шланг. Он отдаёт кольцо, не глядя тебе в глаза. До Биненбюттеля ему хватит впритык.\n\nКольцо лежит у тебя в кармане и мешает, как камень.', effects: [set20('gac2', 'ring'), w20('siphon', 'ring'), w20('ring', true), { siphon: 'opel_corsa', liters: 1 }, until(20, 10, 30)] },
      { id: 'c20_gac2_no', label: 'Отказать: вам самим возвращаться', minutes: 10, terminal: true, goto: 'c20_g_ahlers',
        text: '— Nein. Wir müssen selbst zurück.\n\nНет. Нам самим возвращаться.\n\nОн кивает, убирает шланг в канистру и уходит. Кольцо он надевает обратно не сразу.', effects: [set20('gac2', 'no'), w20('siphon', 'refused'), until(20, 10, 25)] },
    ] }),

  // ───────────── B: комендант или женский корпус, дети ─────────────
  G({ id: 'c20_g_b_commandant', title: 'Комната двенадцать',
    text: [
      { text: 'В коридоре штаба очередь на скамейках: шестеро. Дверь комнаты двенадцать открывается раз в десять минут. Адъютант с папкой выкрикивает фамилии не в том порядке, в каком сидят.' },
    ],
    actions: [
      { id: 'c20_gbc_wait', label: 'Ждать своей очереди', minutes: 80, terminal: true, goto: 'c20_g_b_kids',
        text: 'Через час с лишним тебя зовут. Майор с красными глазами выдвигает ящик, находит твой телефон по бирке и кладёт на стол.\n\n— Nächstes Mal nicht lügen.\n\nВ следующий раз не врите.\n\nТелефон холодный. Экран целый.', effects: [set20('gbc', 'wait'), w20('phone_back', true), { set: 'w.c18_phone_held', value: false }, until(20, 10, 0)] },
      { id: 'c20_gbc_doctor', label: 'Сказать адъютанту, что тебя ждёт доктор Алерс', minutes: 20, risky: true, terminal: true, goto: 'c20_g_b_kids',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3 }, text: 'Адъютант смотрит на тебя, на часы и пропускает без очереди. Майор отдаёт телефон, не поднимая головы от бумаг.', effects: [set20('gbc', 'doctor'), w20('phone_back', true), { set: 'w.c18_phone_held', value: false }] },
          { id: 'no', text: '— Dann soll die Ärztin anrufen, — говорит адъютант. Пусть доктор позвонит. И сажает тебя в конец очереди. Телефон ты получаешь через полтора часа.', effects: [set20('gbc', 'doctor_no'), w20('phone_back', true), { set: 'w.c18_phone_held', value: false }, until(20, 10, 20)] },
        ], effects: [until(20, 9, 0)] },
      { id: 'c20_gbc_leave', label: 'Плюнуть на телефон: есть дела важнее', minutes: 5, terminal: true, goto: 'c20_g_b_kids',
        text: 'Ты уходишь из коридора. Телефон останется у коменданта, но Оле, Хенрике и дети сейчас важнее.', effects: [set20('gbc', 'leave'), until(20, 8, 40)] },
    ] }),

  G({ id: 'c20_g_b_peters', title: 'Третий ряд',
    text: [
      { text: 'В женском корпусе пахнет хлоркой и мокрой шерстью. Фрау Петерс машет тебе с раскладушки, как старой знакомой.' },
      { when: all(ruthHere18, not(v('w.c18_seat', 'eva'))), text: 'Через проход Рут, нога на свёрнутом одеяле. Эва рядом с ней. Увидев тебя, Эва встаёт и сразу садится обратно.' },
      { when: v('w.c18_seat', 'eva'), text: 'Через проход Рут, нога на свёрнутом одеяле. Раскладушка рядом с ней пустая и аккуратно застелена.' },
    ],
    actions: [
      { id: 'c20_gbp_night', label: 'Спросить фрау Петерс, что тут было ночью', minutes: 25, terminal: true, goto: 'c20_g_b_kids',
        text: '— Nachts tragen sie aus dem Spenderblock raus, — говорит фрау Петерс вполголоса. — Zwei diese Woche. Zugedeckt. Die Schwester sagt: Kreislauf.\n\nНочью из донорского блока выносят. Двоих на этой неделе. Накрытых. Сестра говорит: сердце.', effects: [set20('gbp', 'night'), w20('peters_night', true), { body: 'stress', delta: 2 }, until(20, 9, 0)] },
      { id: 'c20_gbp_ruth', label: 'Посидеть с Рут', when: ruthHere18, minutes: 30, terminal: true, goto: 'c20_g_b_kids',
        outcomes: [
          { id: 'eva', when: v('w.c18_seat', 'eva'), text: 'Рут спрашивает про Эву: ест ли, спит ли, не обижают ли. Ты отвечаешь на всё. Она слушает, сжимая край одеяла, и в конце говорит: «Gut. Dann ist wenigstens sie raus». Хорошо. Хоть она выбралась.', effects: [set20('gbp', 'ruth'), npc('c8_ruth', 2)] },
          { id: 'here', text: 'Рут рассказывает про ногу: перелом не срастается, а врач приходит раз в два дня. Эва сидит рядом и молчит. Потом говорит, не тебе, а в пол: «Ich frage nicht mehr». Я больше не прошу.', effects: [set20('gbp', 'ruth'), npc('c8_ruth', 1)] },
        ], effects: [until(20, 9, 0)] },
      { id: 'c20_gbp_wash', label: 'Помочь фрау Петерс развесить бельё', minutes: 30, activity: 'light', terminal: true, goto: 'c20_g_b_kids',
        text: 'Верёвки натянуты между шведскими стенками. Фрау Петерс рассказывает, чья это наволочка и чья рубашка, как будто это её дом. Под конец она суёт тебе в карман две карамельки.', effects: [set20('gbp', 'wash'), until(20, 9, 0)] },
    ] }),

  G({ id: 'c20_g_b_kids', title: 'Детская палата',
    text: [
      { text: 'У стеклянной двери детской палаты стоит сестра. Шесть кроватей, у троих жёлтые пакеты. Девочка у окна, та, что поправляла твой немецкий, узнаёт тебя и садится в кровати.' },
      { when: kasiaHere, text: 'На второй кровати Тим. Клетка с хомяком на тумбочке. Тим спит.' },
      { text: '— Heute Mittag kommt Neues, — говорит сестра. — Bis dahin reicht es. Gerade so.\n\nСегодня в полдень привезут новое. До тех пор хватит. Еле-еле.' },
    ],
    actions: [
      { id: 'c20_gbk_read', label: 'Войти и дочитать им «Джима Пуговку»', minutes: 30, terminal: true, goto: 'c20_g_b_drk',
        outcomes: [
          { id: 'again', when: v('B.c18_bq', 'read'), text: 'Девочка у окна держит книгу раскрытой на той же странице, где ты {m:остановился|остановилась} в среду. Ты читаешь дальше. Она поправляет тебя реже. К концу главы она спит, единственная, кто не спал в прошлый раз.', effects: [set20('gbk', 'read'), { body: 'stress', delta: -2 }] },
          { id: 'first', text: 'Ты читаешь главу. Немецкий у тебя с акцентом. Девочка у окна поправляет тебя на каждом третьем слове и смеётся, когда ты путаешь Лукаса с локомотивом.', effects: [set20('gbk', 'read'), { body: 'stress', delta: -2 }] },
        ], effects: [until(20, 10, 30)] },
      { id: 'c20_gbk_hours', label: 'Спросить сестру, что будет, если транспорт не придёт', minutes: 15, terminal: true, goto: 'c20_g_b_drk',
        text: 'Сестра долго смотрит на кровать у окна.\n\n— Dann zählen wir. Bei ihr vielleicht einen Tag. Bei den Kleinen weniger.\n\nТогда будем считать. У неё, может быть, сутки. У маленьких меньше.', effects: [set20('gbk', 'hours'), w20('kids_hours', true), { body: 'stress', delta: 2 }, until(20, 10, 15)] },
      { id: 'c20_gbk_sweets', label: 'Отдать девочке карамельки', when: own20('gbp', 'wash'), minutes: 10, terminal: true, goto: 'c20_g_b_drk',
        text: 'Сестра разрешает, только через стекло, через окошко для лекарств. Девочка прячет обе карамельки под подушку и показывает тебе большой палец.', effects: [set20('gbk', 'sweets'), until(20, 10, 10)] },
    ] }),

  G({ id: 'c20_g_b_drk', title: 'Стол Красного Креста',
    text: [
      { text: 'У входа в зал списков стол с табличкой «DRK-Suchdienst». Женщина в жилете с крестом записывает, кто кого ищет, и отправляет записки дальше: в другие пункты, в Гамбург, если туда кто-то едет.' },
      { when: flag('w.c18_okafor_listed'), text: 'В среду ты {m:видел|видела} на стене Бармбека: Окафор остался в вашем доме и ухаживает за жильцами.' },
      { when: flag('w.c18_merle_listed'), text: 'В среду ты {m:видел|видела} на стене: Мерле с родителями в Аренсбурге, «зарегистрирована, обеспечена».' },
    ],
    actions: [
      { id: 'c20_gbd_okafor', label: 'Написать Окафору: где ты и как найти хутор', when: flag('w.c18_okafor_listed'), minutes: 20, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты пишешь на бланке по-немецки, медленно: имя, «Barmbek, Hausgemeinschaft», и ниже — хутор Людеманов под Йестебургом, поворот у почтового ящика. Женщина в жилете кладёт бланк в стопку с надписью «Hamburg». — Wenn einer fährt, — говорит она. Если кто-то поедет.', effects: [set20('gbd2', 'okafor'), w20('drk_okafor', true), until(20, 10, 30)] },
      { id: 'c20_gbd_merle', label: 'Написать Мерле в Аренсбург', when: flag('w.c18_merle_listed'), minutes: 20, terminal: true, goto: 'c20_g_ahlers',
        text: 'Ты пишешь коротко: жива, на хуторе под Йестебургом, у тебя есть инсулин или был, если дойдёт письмо — ответь через Красный Крест. Женщина в жилете морщится: Аренсбург за Эльбой. — Dauert, — говорит она. Долго.', effects: [set20('gbd2', 'merle'), w20('drk_merle', true), until(20, 10, 30)] },
      { id: 'c20_gbd_self', label: 'Записать себя: кто ты и где тебя искать', minutes: 15, terminal: true, goto: 'c20_g_ahlers',
        text: 'Женщина в жилете вписывает тебя в толстую тетрадь: имя, откуда, где сейчас. Твоя строчка двести сорок третья на этой странице.', effects: [set20('gbd2', 'self'), w20('drk_self', true), until(20, 10, 25)] },
    ] }),

  // ───────────── Снова вместе: доктор Алерс ─────────────
  G({ id: 'c20_g_ahlers', title: 'Доктор Алерс',
    text: [
      { text: 'В половине одиннадцатого доктор Алерс находит вас сама. Седая коса, халат поверх свитера, карты под мышкой.' },
      { text: '— Die Neue kommt um zwölf, — говорит она. — Dann unterschreibe ich für Ole. Wenn sie bleibt.\n\nНовая приедет в двенадцать. Тогда я подпишу Оле выписку. Если она останется.' },
    ],
    actions: [
      { id: 'c20_ga_p', label: 'Спросить, что значит «P» у всех фамилий из Station 4', when: all(A19, flag('w.c20_p_known')), minutes: 15, terminal: true, outcomes: afterAhlers,
        text: 'Доктор Алерс перестаёт листать карты.\n\n— Wer hat Ihnen das gezeigt?\n\nКто вам это показал?\n\nОна смотрит в окно, на плац.\n\n— Die Studie lief in Buchholz bis zum Stromausfall. Was danach kam, haben Sie auf der Liste gesehen. Mehr sage ich nicht. Nicht hier.\n\nИсследование шло в Бухгольце до того, как пропал ток. Что было дальше, вы видели в списке. Больше я ничего не скажу. Не здесь.', effects: [set20('ga', 'p'), w20('ahlers_p', true), until(20, 11, 0)] },
      { id: 'c20_ga_paper', label: 'Попросить подписать выписку Оле заранее', when: A19, minutes: 15, terminal: true, outcomes: afterAhlers,
        text: '— Ohne Ersatz unterschreibe ich nichts. — Она говорит это без злости, как диагноз. — Drei Kinder. Ich habe es Ihnen schon gesagt.\n\nБез замены ничего не подпишу. Трое детей. Я вам уже говорила.', effects: [set20('ga', 'paper'), until(20, 11, 0)] },
      { id: 'c20_ga_blood', label: 'Предложить снова сдать кровь', when: B19, minutes: 15, terminal: true, outcomes: [
        { id: 'no_k', when: all(gaveBlood, kasiaHere), goto: 'c20_g_b_kitchen', text: noBlood, effects: noBloodFx },
        { id: 'no_b', when: gaveBlood, goto: 'c20_g_b_hanna', text: noBlood, effects: noBloodFx },
        { id: 'yes_k', when: kasiaHere, goto: 'c20_g_b_kitchen', text: yesBlood, effects: yesBloodFx },
        { id: 'yes_b', goto: 'c20_g_b_hanna', text: yesBlood, effects: yesBloodFx },
      ] },
      { id: 'c20_ga_long', label: 'Спросить, сколько Оле ещё выдержит', when: B19, minutes: 15, terminal: true, outcomes: afterAhlers,
        text: '— Er ist jung. Zwei Wochen, wenn er isst. Vielleicht drei. — Она не смотрит на тебя. — Andere waren auch jung.\n\nОн молодой. Две недели, если будет есть. Может, три. Другие тоже были молодые.', effects: [set20('ga', 'long'), w20('ole_weeks', true), until(20, 11, 0)] },
      { id: 'c20_ga_thanks', label: 'Поблагодарить и выйти на воздух', minutes: 10, terminal: true, outcomes: afterAhlers,
        text: 'Она кивает и уходит по коридору, на ходу раскрывая следующую карту.', effects: [set20('ga', 'thanks'), until(20, 10, 50)] },
    ] }),

  G({ id: 'c20_g_a_smoke', title: 'Курилка', ambient: yardAir,
    text: [
      { text: 'За гаражом курилка: бочка с песком, лавка, трое солдат. Один из них радист. Рация у него на ремне шипит.' },
    ],
    actions: [
      { id: 'c20_gas_listen', label: 'Сесть рядом и слушать', minutes: 30, terminal: true, goto: 'c20_g_a_henrike',
        text: 'Радист говорит, не глядя на тебя: колонна вышла из Ганновера в шесть. Последний раз выходила на связь в десять, у Зольтау. Говорит, что автобан у Гарльсторфа «voll», полный. Чем полный, он не уточняет.', effects: [set20('gas', 'listen'), w20('radio_early', true), until(20, 11, 40)] },
      { id: 'c20_gas_smoke', label: 'Попросить сигарету, хотя не куришь', minutes: 20, terminal: true, goto: 'c20_g_a_henrike',
        text: 'Солдат протягивает пачку. Ты кашляешь с первой затяжки, и все трое смеются, впервые за утро. Потом один говорит: «Die Kuh tut mir leid». Мне жаль корову. Его никто не одёргивает.', effects: [set20('gas', 'smoke'), until(20, 11, 30)] },
      { id: 'c20_gas_car', label: 'Пойти посидеть в машине', minutes: 20, terminal: true, goto: 'c20_g_a_henrike',
        text: 'В машине тихо. Ты смотришь на стрелку бензина и считаешь в уме: до дома сорок километров.', effects: [set20('gas', 'car'), until(20, 11, 30)] },
    ] }),

  G({ id: 'c20_g_b_kitchen', title: 'Кухня',
    text: [{ text: 'На кухне Кася Новак режет капусту. Нож останавливается, когда ты входишь.\n\n— Barmbek! — Она вытирает руки о халат. — Tim spricht von dir. Von der Frau mit dem Buch.\n\nТим про тебя говорит. Про тётю с книжкой.' }],
    actions: [
      { id: 'c20_gbki_help', label: 'Встать рядом и резать капусту', minutes: 40, activity: 'light', terminal: true, goto: 'c20_g_b_donor',
        text: 'Вы режете вдвоём. Кася говорит про Тима: как он держится, как боится уколов и не плачет. Про то, что будет, если плазма кончится, она не говорит ни слова. Нож у неё стучит быстрее, когда ты спрашиваешь.', effects: [set20('gbki', 'help'), npc('kasia', 2), until(20, 11, 40)] },
      { id: 'c20_gbki_truth', label: 'Спросить, что ей сказали врачи', minutes: 20, terminal: true, goto: 'c20_g_b_donor',
        text: '— Dass es hält, — говорит Кася. Что держит. — Ich frage nicht weiter. Wenn ich weiterfrage, sagen sie es mir.\n\nЯ дальше не спрашиваю. Если спрошу, они мне скажут.', effects: [set20('gbki', 'truth'), w20('kasia_holds', true), until(20, 11, 20)] },
    ] }),

  G({ id: 'c20_g_b_hanna', title: 'Ханна',
    text: [
      { when: not(v('w.c18_seat', 'hanna')), text: 'На скамейке у плаца Ханна, из грузовика. Мальчик спит у неё на коленях.\n\n— Wir bleiben, — говорит она. — Wohin soll ich mit ihm?\n\nМы остаёмся. Куда я с ним?' },
      { when: v('w.c18_seat', 'hanna'), text: 'На скамейке у плаца женщина с девочкой лет пяти. Девочка болтает ногами. Женщина смотрит на ворота так, как смотрят все здесь сегодня.' },
    ],
    actions: [
      { id: 'c20_gbh_sit', label: 'Посидеть рядом', minutes: 30, terminal: true, goto: 'c20_g_b_donor',
        text: 'Вы сидите молча. Мимо проходят солдаты, сестра с каталкой, Хенрике в пальто. Так проходят полчаса.', effects: [set20('gbh', 'sit'), { body: 'stress', delta: -1 }, until(20, 11, 40)] },
      { id: 'c20_gbh_farm', label: 'Сказать, как найти хутор, если станет некуда', minutes: 15, terminal: true, goto: 'c20_g_b_donor',
        text: 'Ты объясняешь: Йестебург, поворот у почтового ящика Людеманов. Женщина повторяет за тобой, чтобы запомнить.', effects: [set20('gbh', 'farm'), w20('more_address', true), until(20, 11, 20)] },
    ] }),

  G({ id: 'c20_g_a_henrike', title: 'Хенрике в коридоре',
    text: [
      { text: 'Хенрике ловит тебя в коридоре штаба и отводит к окну, подальше от людей.\n\n— Hör zu. Wenn ich nicht zurückkomme… — Она сама себя обрывает. — Nein. Anders. Der Hof. Wer wohnt jetzt da?\n\nСлушай. Если я не вернусь… Нет. Иначе. Хутор. Кто там сейчас живёт?' },
      { when: flag('w.c18_henrike_key'), text: 'Ключ от её шкафа на шнурке у {B.gen}. Хенрике знает.' },
    ],
    actions: [
      { id: 'c20_gah_tell', label: 'Перечислить всех, кто сейчас в доме', minutes: 20, terminal: true, goto: 'c20_g_wait',
        outcomes: [
          { id: 'many', when: any(v('w.c18_house', 'open'), v('w.c18_seat', 'eva'), v('w.c18_seat', 'jana'), v('w.c18_ute', 'farm'), flag('w.c18_lodger')), text: 'Ты перечисляешь. Хенрике загибает пальцы и на пятом перестаёт.\n\n— Viele Münder, — говорит она. Много ртов. — Die Kartoffeln reichen bis Februar. Danach — Saat. Nicht essen. Hörst du? Die Saat nicht essen.\n\nКартошки хватит до февраля. Дальше — семенная. Не есть. Слышишь? Семенную не есть.', effects: [set20('gah', 'tell'), w20('seed_warning', true), npc('henrike', 1)] },
          { id: 'few', text: 'Ты перечисляешь. Хенрике кивает на каждое имя.\n\n— Gut. Die Saatkartoffeln sind die hinten links. Die esst ihr nicht.\n\nХорошо. Семенная картошка — сзади слева. Её вы не едите.', effects: [set20('gah', 'tell'), w20('seed_warning', true), npc('henrike', 1)] },
        ], effects: [until(20, 11, 55)] },
      { id: 'c20_gah_promise', label: 'Пообещать, что хутор будет в порядке', minutes: 15, terminal: true, goto: 'c20_g_wait',
        text: '— Versprich nichts, — говорит Хенрике. Не обещай. — Mach einfach.\n\nПросто делай.\n\nНо руку тебе на плечо она всё-таки кладёт. Коротко.', effects: [set20('gah', 'promise'), npc('henrike', 2), until(20, 11, 50)] },
      { id: 'c20_gah_ole', label: 'Спросить, что она будет делать, если Оле не уйдёт', minutes: 15, terminal: true, goto: 'c20_g_wait',
        text: 'Хенрике долго смотрит в окно, на донорский блок.\n\n— Bleiben. Bis er geht oder bis sie ihn raustragen. — Она поправляет воротник пальто. — Was sonst?\n\nОставаться. Пока он не уйдёт или пока его не вынесут. А что ещё?', effects: [set20('gah', 'ole'), { body: 'stress', delta: 1 }, until(20, 11, 50)] },
    ] }),

  G({ id: 'c20_g_b_donor', title: 'Забор крови',
    text: [
      { when: not(flag('w.c18_ole_rest')), text: 'В донорском блоке сестра уже ставит Оле катетер. Пакет на стойке пустой и плоский. Оле смотрит в потолок.' },
      { when: flag('w.c18_ole_rest'), text: 'В донорском блоке у Оле сегодня свободный день. Зато на соседней койке пожилой мужчина с белыми губами. На листке у его кровати: «Tag 7».' },
    ],
    actions: [
      { id: 'c20_gbd_hand', label: 'Сесть рядом и держать за руку, пока идёт', minutes: 20, terminal: true, goto: 'c20_g_wait',
        outcomes: [
          { id: 'ole', when: not(flag('w.c18_ole_rest')), text: 'Пакет наполняется медленно, тёмно-красный. Оле не смотрит на него. Он смотрит на тебя и рассказывает про кур: какая несётся, какая клюёт других. Когда пакет полный, он замолкает на середине фразы.', effects: [set20('gbd', 'hand'), npc('ole', 2), { body: 'stress', delta: 1 }] },
          { id: 'old', text: 'Мужчина на соседней койке берёт твою руку сам, не открывая глаз. Пальцы ледяные. Его зовут Вальтер, он из Уэльцена, у него внук. Больше он ничего не успевает сказать: приходит сестра с пакетом.', effects: [set20('gbd', 'hand'), w20('walter', true), { body: 'stress', delta: 2 }] },
        ], effects: [until(20, 11, 55)] },
      { id: 'c20_gbd_nurse', label: 'Спросить сестру, сколько у них берут', minutes: 15, terminal: true, goto: 'c20_g_wait',
        text: '— So viel, wie die Kinder brauchen, — говорит сестра заученно. Сколько нужно детям. Потом, тише, не глядя на тебя: — Mehr, als man darf.\n\nБольше, чем можно.', effects: [set20('gbd', 'nurse'), w20('nurse_more', true), until(20, 11, 50)] },
      { id: 'c20_gbd_go', label: 'Не смотреть: выйти во двор', minutes: 10, terminal: true, goto: 'c20_g_wait',
        text: 'Ты выходишь. Во дворе холодно, и это хорошо.', effects: [set20('gbd', 'go'), until(20, 11, 45)] },
    ] }),

  // ───────────── Ожидание и известие ─────────────
  G({ id: 'c20_g_wait', title: 'Полдень', ambient: yardAir,
    text: [
      { text: 'В двенадцать на плацу собирается полказармы. Сестра из детской. Доктор Алерс у окна второго этажа. Хенрике у ворот в пальто, застёгнутом на все пуговицы.' },
      { text: 'В двенадцать пятнадцать ворота всё ещё закрыты. В двенадцать тридцать фельдфебель уходит в радиорубку и не возвращается.' },
      { text: 'Оле стоит у окна донорского блока. Отсюда видно, что он держится за подоконник.' },
    ],
    actions: [
      { id: 'c20_gw_radio', label: 'Пойти к радиорубке', when: A19, minutes: 40, terminal: true, goto: 'c20_g_news',
        text: 'У радиорубки уже стоят трое. Сквозь дверь слышно только шипение и одну фразу, повторённую много раз: «Kolonne Hannover, bitte kommen». Колонна Ганновер, ответьте.', effects: [set20('gw', 'radio'), until(20, 13, 0)] },
      { id: 'c20_gw_gate', label: 'Ждать у ворот рядом с Хенрике', minutes: 40, terminal: true, goto: 'c20_g_news',
        text: 'Хенрике не разговаривает. Каждые пять минут она смотрит на часы. Один раз берёт тебя за рукав, будто проверяет, что ты здесь.', effects: [set20('gw', 'gate'), npc('henrike', 1), until(20, 13, 0)] },
      { id: 'c20_gw_ole', label: 'Встать под окном Оле, чтобы он видел', when: B19, minutes: 40, terminal: true, goto: 'c20_g_news',
        text: 'Ты стоишь внизу, задрав голову. Оле поднимает руку к стеклу. Ты поднимаешь свою. Так вы стоите, пока у тебя не затекает шея.', effects: [set20('gw', 'ole'), npc('ole', 1), until(20, 13, 0)] },
    ] }),

  G({ id: 'c20_g_news', title: 'Гарльсторф', ambient: yardAir,
    text: [
      { text: 'В час фельдфебель выходит на крыльцо штаба.\n\n— Die Kolonne steht seit zehn Uhr vierzig an der Ausfahrt Garlstorf. Personen auf der Fahrbahn, ein LKW umgestürzt. Seit Viertel nach zwölf kein Funk.\n\nКолонна с десяти сорока стоит на съезде у Гарльсторфа. Люди на проезжей части, один грузовик перевернулся. С четверти первого связи нет.' },
      { text: 'Плац молчит. Потом сестра из детской разворачивается и уходит внутрь, быстро, почти бегом.' },
      { text: 'Хенрике садится на бордюр, прямо в пальто.' },
    ],
    actions: [
      { id: 'c20_gn_who', label: 'Спросить фельдфебеля, пошлют ли туда кого-то', when: A19, minutes: 15, terminal: true, goto: 'c20_g_lunch',
        text: '— Zwei Wagen um vier. Mehr haben wir nicht, — говорит фельдфебель. Две машины в четыре. Больше у нас нет. — Zivilisten bleiben hier. Wer trotzdem fährt, fährt auf eigene Gefahr.\n\nГражданские остаются здесь. Кто всё-таки поедет — на свой страх и риск.', effects: [set20('gn', 'who'), w20('two_wagons', true), until(20, 13, 25)] },
      { id: 'c20_gn_lea', label: 'Спросить, что с донором в кабине', minutes: 15, terminal: true, goto: 'c20_g_lunch',
        text: '— Keine Ahnung, — говорит фельдфебель. Понятия не имею. — Der Funk ist tot. Vielleicht sitzt sie im Wagen. Vielleicht nicht.\n\nРация молчит. Может, сидит в машине. Может, нет.', effects: [set20('gn', 'lea'), until(20, 13, 25)] },
      { id: 'c20_gn_henrike', label: 'Сесть рядом с Хенрике на бордюр', minutes: 15, terminal: true, goto: 'c20_g_lunch',
        text: 'Бордюр ледяной. Хенрике смотрит на ворота и говорит, не поворачивая головы:\n\n— Er hat es den Kindern versprochen. Er geht nicht. — Пауза. — Er ist wie sein Vater.\n\nОн обещал детям. Он не уйдёт. Он как его отец.', effects: [set20('gn', 'henrike'), npc('henrike', 2), until(20, 13, 25)] },
    ] }),

  G({ id: 'c20_g_lunch', title: 'Суп',
    text: [
      { text: 'Обед никто не отменял. В гараже суп из порошка и хлеб. Солдаты едят быстро и молча. Шуток больше нет.' },
    ],
    actions: [
      { id: 'c20_gl_eat', label: 'Поесть', minutes: 25, terminal: true, goto: 'c20_g_fence',
        text: 'Суп горячий, и это главное. Ты доедаешь и берёшь второй кусок хлеба в карман.', effects: [set20('gl', 'eat'), ...fed, until(20, 14, 0)] },
      { id: 'c20_gl_henrike', label: 'Отнести суп Хенрике на плац', minutes: 20, terminal: true, goto: 'c20_g_fence',
        text: 'Хенрике берёт миску обеими руками и ест прямо на бордюре, не отрывая глаз от ворот. Ты ешь свой хлеб стоя.', effects: [set20('gl', 'henrike'), npc('henrike', 1), { body: 'hunger', delta: -15 }, until(20, 14, 0)] },
      { id: 'c20_gl_skip', label: 'Не есть', minutes: 10, terminal: true, goto: 'c20_g_fence',
        text: 'Кусок в горло не лезет. Ты пьёшь воду из-под крана в умывальной.', effects: [set20('gl', 'skip'), { body: 'thirst', delta: -20 }, until(20, 13, 50)] },
    ] }),

  G({ id: 'c20_g_fence', title: 'Вдоль забора', ambient: yardAir,
    text: [
      { text: 'После обеда ты идёшь вдоль забора казармы, просто чтобы двигаться. За сеткой поле, за полем дорога на Люнебург.' },
      { text: 'По полю идут трое в больничных рубашках. Медленно, в сторону города. На вышке у ворот солдат снимает винтовку с плеча и кладёт на перила.' },
    ],
    actions: [
      { id: 'c20_gf_watch', label: 'Остановиться и смотреть', minutes: 20, terminal: true, goto: 'c20_g_ole2',
        text: 'Трое идут, не меняя шага. Солдат на вышке ждёт, пока они подойдут к канаве у забора. Потом стреляет три раза, с промежутками. Ты не отворачиваешься. Солдат перекидывает винтовку обратно на плечо и закуривает.', effects: [set20('gf', 'watch'), { body: 'stress', delta: 3 }, until(20, 14, 20)] },
      { id: 'c20_gf_talk', label: 'Подойти к вышке и спросить солдата', minutes: 20, terminal: true, goto: 'c20_g_ole2',
        text: '— Nur wenn sie an den Graben kommen, — говорит солдат сверху. Только если подходят к канаве. — Jeden Tag mehr. Alle aus Richtung Autobahn.\n\nКаждый день больше. Все со стороны автобана.\n\nТрое сворачивают вдоль канавы и уходят к лесу. Он не стреляет.', effects: [set20('gf', 'talk'), w20('more_each_day', true), until(20, 14, 20)] },
      { id: 'c20_gf_back', label: 'Повернуть назад, к плацу', minutes: 10, terminal: true, goto: 'c20_g_ole2',
        text: 'Ты возвращаешься. За спиной, далеко, хлопают три выстрела. Ты не оборачиваешься.', effects: [set20('gf', 'back'), until(20, 14, 15)] },
    ] }),

  G({ id: 'c20_g_ole2', title: 'Оле во дворе', ambient: yardAir,
    text: [
      { text: 'В два Оле сам спускается во двор, в куртке поверх больничной пижамы. Санитар у двери делает вид, что не видит. Оле идёт к вам медленно, держась за стену.' },
      { text: '— Wenn ihr da vorbeifahrt… — Он останавливается, чтобы отдышаться. — Sie hat sich das nicht ausgesucht. Wie ich auch nicht. Schaut nach ihr.\n\nЕсли будете проезжать мимо… Она этого не выбирала. Как и я. Посмотрите, что с ней.' },
      { when: henrikeHere, text: 'Потом поворачивается к матери:\n\n— Mama. Du fährst mit ihnen nach Hause. Hier hilfst du mir nicht.\n\nМама. Ты едешь с ними домой. Здесь ты мне не поможешь.' },
    ],
    actions: [
      { id: 'c20_go2_promise', label: 'Пообещать: если поедем мимо, посмотрим, что с ней', when: A19, minutes: 15, terminal: true, goto: 'c20_g_car',
        text: 'Оле кивает и протягивает тебе руку. Рукопожатие слабое, но долгое.', effects: [set20('go2', 'promise'), w20('promise_lea', true), npc('ole', 2), until(20, 14, 30)] },
      { id: 'c20_go2_no', label: 'Сказать честно: вы туда не полезете', when: A19, minutes: 15, terminal: true, goto: 'c20_g_car',
        text: '— Verstehe, — говорит Оле. Понимаю. И садится на ступеньку, потому что стоять ему трудно.', effects: [set20('go2', 'no'), until(20, 14, 30)] },
      { id: 'c20_go2_gun', label: 'Сказать, что отцовское ружьё нашлось', when: all(A19, gunFound), minutes: 15, terminal: true, goto: 'c20_g_car',
        text: 'У Оле что-то меняется в лице.\n\n— Vaters, — говорит он. Отцовское. — Pass auf, der linke Lauf klemmt.\n\nОсторожно, левый ствол заедает.', effects: [set20('go2', 'gun'), w20('left_barrel', true), npc('ole', 1), until(20, 14, 30)] },
      { id: 'c20_go2_hug', label: 'Обнять его', when: B19, minutes: 15, terminal: true, goto: 'c20_g_car',
        text: 'Он деревенеет, как все Людеманы, когда их обнимают. Потом хлопает тебя по спине. Два раза.', effects: [set20('go2', 'hug'), npc('ole', 2), until(20, 14, 30)] },
      { id: 'c20_go2_mother', label: 'Попросить Хенрике поехать с вами', when: all(B19, henrikeHere), minutes: 20, terminal: true, goto: 'c20_g_car',
        text: 'Хенрике смотрит на сына, потом на тебя.\n\n— Ich bleibe, bis die Neue da ist. Dann komme ich. Mit ihm oder ohne.\n\nЯ останусь, пока не приедет новая. Потом приеду. С ним или без.', effects: [set20('go2', 'mother'), w20('henrike_waits', true), npc('henrike', 1), until(20, 14, 35)] },
      { id: 'c20_go2_free', label: 'Сказать: решай сам, когда ехать', when: B19, minutes: 15, terminal: true, goto: 'c20_g_car',
        text: '— Selbst, — повторяет Оле. Сам. Он смотрит на тебя так, будто ему впервые за две недели дали что-то решить. — Gut.', effects: [set20('go2', 'free'), npc('ole', 2), until(20, 14, 30)] },
    ] }),

  G({ id: 'c20_g_car', title: 'Перед дорогой', ambient: yardAir,
    text: [
      { text: 'Ближе к трём вы стоите у машины за шлагбаумом. Солнце уже низко. Через полтора часа стемнеет.' },
      { when: { fuelFor: 'opel_corsa', km: 40 }, text: 'Стрелка бензина показывает, что до дома хватит. С запасом или нет — смотря какой дорогой.' },
      { when: not({ fuelFor: 'opel_corsa', km: 40 }), text: 'Стрелка бензина почти на нуле. До дома сорок километров. Может не хватить.' },
      { when: flag('w.c20_two_wagons'), text: 'В четыре к Гарльсторфу уйдут две армейские машины. Гражданским сказали оставаться.' },
    ],
    actions: [
      { id: 'c20_gcr_check', label: 'Проверить фары, запаску и фонарь', when: A19, minutes: 20, terminal: true, goto: 'c20_checkpoint_l',
        text: 'Правая фара светит тускло, но светит. Запаска накачана. Фонарь в бардачке, батарейки на половине. Ты кладёшь его в карман куртки.', effects: [set20('gcr', 'check'), w20('car_checked', true), { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
      { id: 'c20_gcr_sleep', label: 'Двадцать минут поспать в машине', minutes: 20, activity: 'rest', terminal: true, goto: 'c20_checkpoint_l',
        text: 'Ты откидываешь сиденье и засыпаешь сразу, как выключили. Будит тебя стук костяшками в стекло.', effects: [set20('gcr', 'sleep'), { body: 'fatigue', delta: -6 }, { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
      { id: 'c20_gcr_bye', label: 'Сходить попрощаться с Хенрике', when: henrikeHere, minutes: 20, terminal: true, goto: 'c20_checkpoint_l',
        text: 'Хенрике обнимает тебя одной рукой, быстро, и сразу отворачивается к воротам.\n\n— Fahrt vorsichtig. Ich will nicht noch jemanden hier liegen sehen.\n\nЕзжайте осторожно. Не хочу видеть здесь ещё кого-то.', effects: [set20('gcr', 'bye'), npc('henrike', 1), { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
      { id: 'c20_gcr_wait', label: 'Стоять и смотреть на дорогу', minutes: 20, terminal: true, goto: 'c20_checkpoint_l',
        text: 'Дорога на запад пустая до самого леса. Ни фар, ни колонны.', effects: [set20('gcr', 'wait'), { set: '$.c20_finished', value: true }, until(20, 15, 30)] },
    ] }),
];
