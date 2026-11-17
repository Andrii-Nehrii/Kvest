import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any } from './point18';
import { npc } from './point19';
import { okaforComes } from './point33';
import {
  A38, B38, S38, ahr38, bothNorth38, bridge38, cab38, fed38, frost38, hall38, merleComes38, okafor38, parentsCome38, send38, set38, until38,
  w38, winsen38,
} from './point38';

// Участок 38, северный рейс (кто едет): посадка, мост в Гестхахте, дорога (A — дерево на дороге, B — солдат с обмороженными ногами),
// вид на Гамбург, ворота лагеря в Аренсбурге, разгрузка / лекарства, список на обратный путь, Мерле, её родители, топливо / просьба
// матери, суп, носилки и коляска на льду, отъезд, очередь у моста, последние минуты, Винзен.
// Если едут оба — порознь внутри дня: B в первой машине (медсестра), A во второй, у Янника.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S38({ ...scene, for: 'any', chapter: 'ch3' });
const ahrCamp = { at: ahr38, stock: 'c3_farm_stock', rest: false as const };
const roadCamp = { at: bridge38, stock: 'c3_farm_stock', rest: false as const };
const winCamp = { at: winsen38, stock: 'c3_farm_stock', rest: false as const };
const hasPens: Cond = { has: 'c21_insulin' };
const merleStays: Cond = all({ npc: 'merle', alive: true }, not(merleComes38));
const byRole = (a: string, b: string) => [{ id: 'a', when: A38, goto: a }, { id: 'b', goto: b }];

export const day38NScenes: Scene[] = [
  X({ id: 'c38_n_board', title: 'В машине', location: bridge38, camp: roadCamp, ambient: cab38,
    text: [
      { when: B38, text: 'Первая машина Красного Креста. Ты в кабине рядом с водителем, на коленях сумка медсестры. Сзади, в кузове, ящики с лекарствами, привязанные ремнями.' },
      { when: all(B38, okaforComes, okafor38), text: 'Окафор сидит у двери, с папкой на коленях, и читает список вслух, шёпотом, как молитву.' },
      { when: A38, text: 'Вторая машина. Янник ведёт одной рукой, другой держит кружку из термоса. В кузове мешки с крупой и одеяла для лагеря.' },
      { when: all(A38, bothNorth38), text: 'Впереди, в первой машине, она. Ты видишь её шапку через два стекла.' },
      { text: 'Колонна идёт на север, к Гестхахту. Фары упираются в снег. Справа светлеет.' },
    ],
    actions: [
      { id: 'c38_nb_list', label: 'Перечитать список лекарств: кому что в Аренсбурге', when: B38, minutes: 50, terminal: true, goto: 'c38_n_bridge',
        text: 'Антибиотики — шесть упаковок на четыреста человек. Жаропонижающее, бинты, мазь от обморожений. Инсулина — ноль. Ты складываешь список и понимаешь, что раздавать придётся не по списку, а по тому, кого увидишь первым.', effects: [set38('nb', 'list'), w38('b_knows_list', true), until38(7, 45)] },
      { id: 'c38_nb_talk', label: 'Поговорить с водителем', when: B38, minutes: 50, terminal: true, goto: 'c38_n_bridge',
        text: 'Водитель — женщина лет шестидесяти, бывшая школьная учительница из Гестхахта. Возит колонны с ноября. «Das Schlimmste ist nicht hinfahren. Das Schlimmste ist, wen man zurücklässt». Хуже всего не ехать туда. Хуже всего — кого оставляешь.', effects: [set38('nb', 'talk'), until38(7, 45)] },
      { id: 'c38_na_jannik', label: 'Спросить Янника про ту ночь на A7', when: A38, minutes: 50, terminal: true, goto: 'c38_n_bridge',
        text: 'Янник долго молчит. Потом говорит.\n\n— Ich hab danach drei Tage in einem Bus geschlafen. Dann kam das Rote Kreuz.\n\nЯ потом три дня спал в автобусе. Потом пришёл Красный Крест. Больше он ничего не рассказывает. Но кружку протягивает тебе.', effects: [set38('na', 'jannik'), npc('jannik', 1), until38(7, 45)] },
      { id: 'c38_na_watch', label: 'Смотреть на дорогу и на обочины', when: A38, minutes: 50, terminal: true, goto: 'c38_n_bridge',
        text: 'Брошенные машины, сугробы, на одной крыше сидит ворона. У поворота на Маршахт — перевёрнутый трактор. На обратном пути здесь будет темно.', effects: [set38('na', 'watch'), w38('a_road_seen', true), until38(7, 45)] },
      { id: 'c38_n_doze', label: 'Закрыть глаза до моста', minutes: 50, activity: 'rest', terminal: true, goto: 'c38_n_bridge',
        text: 'Мотор гудит ровно, печка дует в ноги. Ты не спишь, но и не думаешь. Сорок минут ничего.', effects: [set38('n', 'doze'), { body: 'fatigue', delta: -4 }, until38(7, 45)] },
    ] }),

  X({ id: 'c38_n_bridge', title: 'Мост', location: bridge38, camp: roadCamp, ambient: frost38,
    text: [
      { text: 'Мост через Эльбу у Гестхахта. Длинный, серый, над водой туман. По реке идёт лёд: белые плиты, медленно, с шорохом, который слышно даже в кабине.' },
      { text: 'Перед мостом шлагбаум, бетонные блоки, солдаты в касках. Справа, на том берегу, — башни старой электростанции, без дыма. У шлагбаума толпятся люди с узлами: им на север нельзя.' },
      { text: 'Солдат обходит машины, сверяет фамилии. Женщина из толпы бежит к твоей машине и стучит в стекло.' },
    ],
    actions: [
      { id: 'c38_nr_window', label: 'Опустить стекло: что она хочет', minutes: 30, terminal: true, outcomes: byRole('c38_na_road', 'c38_nb_road'), ambientDuring: frost38,
        text: '— Mein Mann ist in Ahrensburg! In der Halle! Sagen Sie ihm: Ilka lebt. Ilka Brandes!\n\nМой муж в Аренсбурге! В спортзале! Скажите ему: Илька жива. Илька Брандес!\n\nСолдат оттаскивает её за локоть. Ты повторяешь имя, чтобы не забыть.', effects: [set38('nr', 'window'), w38('ilka', true), until38(8, 30)] },
      { id: 'c38_nr_soldier', label: 'Спросить солдата, что будет с мостом после шести', minutes: 30, terminal: true, outcomes: byRole('c38_na_road', 'c38_nb_road'), ambientDuring: frost38,
        text: '— Zu. — Солдат не поднимает глаз от списка. Закрыт. — Und am Fünfzehnten fahren wir drüber, und dann ist er für immer zu.\n\nА пятнадцатого мы проедем по нему, и тогда он закрыт насовсем.', effects: [set38('nr', 'soldier'), until38(8, 30)] },
      { id: 'c38_nr_river', label: 'Смотреть на реку и лёд', minutes: 30, terminal: true, outcomes: byRole('c38_na_road', 'c38_nb_road'), ambientDuring: frost38,
        text: 'Льдины идут сплошным полем, сталкиваются, встают на ребро. Если Эльба встанет совсем, по льду можно будет перейти. Так было в шестьдесят третьем, говорит водитель. Ты не знаешь, хорошо это или плохо.', effects: [set38('nr', 'river'), w38('ice_seen', true), until38(8, 30)] },
    ] }),

  X({ id: 'c38_na_road', title: 'Дерево', location: bridge38, camp: roadCamp, safe: false, ambient: frost38,
    text: [
      { text: 'За Шварценбеком колонна встаёт. Поперёк дороги лежит сосна, сломанная снегом. Первая машина проскочила под верхушкой, вторая — ваша — не пройдёт.' },
      { text: 'Армейский джип сопровождения уехал вперёд с первой машиной. Янник глушит мотор и смотрит на тебя: в кузове есть пила и топор.' },
    ],
    actions: [
      { id: 'c38_nar_saw', label: 'Пилить ствол вдвоём с Янником', minutes: 40, activity: 'heavy', risky: true, terminal: true, goto: 'c38_n_view', ambientDuring: frost38,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'endurance'], difficulty: 3, uses: ['mobility'] },
            text: 'Пила вязнет в мёрзлой смоле, но идёт. Два распила, и вы откатываете чурбак к обочине. Янник хлопает тебя по плечу. Догоняете колонну через двадцать минут.',
            effects: [set38('nar', 'saw'), { body: 'fatigue', delta: 10 }, npc('jannik', 1), until38(9, 30)] },
          { id: 'slip',
            text: 'На последнем распиле ствол проседает и зажимает пилу. Ты дёргаешь, нога едет по льду, и ты падаешь на колено, на ветку. Брюки порваны, колено разбито. Янник вытаскивает пилу сам. Дальше ты едешь, держа ногу прямо.',
            effects: [set38('nar', 'slip'), { injure: 'bruise', site: 'rightLeg', severity: 1 }, { body: 'stress', delta: 5 }, until38(9, 30)] },
        ] },
      { id: 'c38_nar_wait', label: 'Ждать джип: он вернётся и стащит тросом', minutes: 50, terminal: true, goto: 'c38_n_view', ambientDuring: cab38,
        text: 'Вы сидите в кабине с работающим мотором. Через полчаса джип возвращается, солдат цепляет трос, и сосна уползает в кювет. Колонна потеряла сорок минут. Офицер с джипа смотрит на часы.', effects: [set38('nar', 'wait'), w38('late40', true), until38(9, 45)] },
      { id: 'c38_nar_round', label: 'Объехать по полю, по краю', minutes: 40, risky: true, terminal: true, goto: 'c38_n_view', ambientDuring: cab38,
        outcomes: [
          { id: 'ok', check: { traits: ['driving'], difficulty: 3, uses: ['focus'] },
            text: 'Янник ведёт, ты стоишь снаружи и показываешь, где кювет. Машина переваливает через край, кренится, выравнивается. Объехали.',
            effects: [set38('nar', 'round'), until38(9, 30)] },
          { id: 'stuck',
            text: 'Колесо уходит в кювет под снегом. Вы толкаете вдвоём, по колено в сугробе, двадцать минут, пока джип не возвращается и не вытаскивает вас тросом. Ты мокрый до пояса.',
            effects: [set38('nar', 'stuck'), { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 4 }, w38('late40', true), until38(9, 45)] },
        ] },
    ] }),

  X({ id: 'c38_nb_road', title: 'Солдат', location: bridge38, camp: roadCamp, ambient: cab38,
    text: [
      { text: 'За Гестхахтом колонна подбирает на обочине солдата: отстал от своей части, шёл пешком с ночи. Его сажают к тебе в кабину.' },
      { text: 'Он сидит, сжав губы, и не снимает ботинок. Ты видишь, как он морщится на каждой кочке.' },
    ],
    actions: [
      { id: 'c38_nbr_boots', label: 'Велеть снять ботинки и посмотреть ноги', minutes: 40, terminal: true, goto: 'c38_n_view',
        text: 'Носки примёрзли к коже. Пальцы на левой ноге восковые, белые. Ты отогреваешь их у себя на коленях, под курткой, медленно. К Аренсбургу два пальца розовеют. Третий — нет. Он смотрит на тебя и не спрашивает.', effects: [set38('nbr', 'boots'), w38('soldier_feet', true), until38(9, 30)] },
      { id: 'c38_nbr_tea', label: 'Дать ему горячего чаю из термоса', minutes: 35, terminal: true, goto: 'c38_n_view',
        text: 'Он пьёт, держа кружку двумя руками. Говорит, что его зовут Торбен, что он из Ульцена и что его часть ушла вчера, не дождавшись. Чай кончается. Ботинки он так и не снимает.', effects: [set38('nbr', 'tea'), until38(9, 30)] },
      { id: 'c38_nbr_ask', label: 'Расспросить, куда ушла часть', minutes: 35, terminal: true, goto: 'c38_n_view',
        text: '— Mölln, dann Lübeck. — Он пожимает плечами. — Die Armee geht schon jetzt. Der Fünfzehnte ist nur fürs Papier.\n\nМёльн, потом Любек. Армия уходит уже сейчас. Пятнадцатое — только для бумаги.', effects: [set38('nbr', 'ask'), w38('army_early', true), until38(9, 30)] },
    ] }),

  X({ id: 'c38_n_view', title: 'Город', location: bridge38, camp: roadCamp, ambient: cab38,
    text: [
      { text: 'С холма у Райнбека открывается Гамбург. Далеко, в дымке: телебашня, краны в порту, шпили. Ни одного дыма. Ни одного огонька.' },
      { when: B38, text: 'Город стоит, как нарисованный. Где-то там Бармбек, квартира, кухня, где всё началось утром десятого ноября.' },
      { when: A38, text: 'Город стоит, как нарисованный. Где-то там, за ним, Харбург и въезд в тоннель, где всё началось утром десятого ноября.' },
    ],
    actions: [
      { id: 'c38_nv_look', label: 'Смотреть, пока холм не скроет город', minutes: 30, terminal: true, goto: 'c38_n_gate',
        text: 'Ты смотришь, не моргая, пока дорога не уходит вниз и город не пропадает за лесом. Потом долго смотришь на руки.', effects: [set38('nv', 'look'), { body: 'stress', delta: 3 }, until38(10, 15)] },
      { id: 'c38_nv_away', label: 'Отвернуться: не сейчас', minutes: 30, terminal: true, goto: 'c38_n_gate',
        text: 'Ты смотришь в другую сторону, на поля. Там ничего нет, и это легче.', effects: [set38('nv', 'away'), until38(10, 15)] },
      { id: 'c38_nv_phone', label: 'Сфотографировать на телефон', minutes: 30, terminal: true, goto: 'c38_n_gate',
        text: 'Экран показывает серое пятно с иголкой телебашни. Красиво и бессмысленно. Ты сохраняешь снимок. Батарея минус процент.', effects: [set38('nv', 'phone'), w38('city_photo', true), until38(10, 15)] },
    ] }),

  X({ id: 'c38_n_gate', title: 'Ворота лагеря', location: ahr38, camp: ahrCamp, ambient: frost38,
    text: [
      { text: 'Аренсбург. Спортзал гимназии за двойным забором, на воротах солдаты. Каждого, кто входит, меряют: градусник ко лбу, две секунды.' },
      { text: 'Перед тобой мужчина с чемоданом. Градусник пищит. «Achtunddreißig vier». Тридцать восемь и четыре. Солдат показывает ему на отдельный корпус. Мужчина смотрит на градусник, на солдата и идёт, не споря.' },
    ],
    actions: [
      { id: 'c38_ng_pass', label: 'Подставить лоб и пройти', minutes: 30, terminal: true, outcomes: byRole('c38_na_unload', 'c38_nb_meds'),
        text: 'Тридцать шесть и шесть. Солдат кивает. Ты проходишь в ворота. Мужчина с чемоданом уже у двери отдельного корпуса. Дверь за ним закрывается.', effects: [set38('ng', 'pass'), until38(10, 45)] },
      { id: 'c38_ng_ask', label: 'Спросить солдата: что с теми, кто в отдельном корпусе', minutes: 30, terminal: true, outcomes: byRole('c38_na_unload', 'c38_nb_meds'),
        text: '— Drei Tage. Dann wissen wir es. — Солдат меряет следующего. — Die meisten haben Grippe. Die meisten.\n\nТри дня. Потом станет ясно. У большинства грипп. У большинства.', effects: [set38('ng', 'ask'), until38(10, 45)] },
      { id: 'c38_ng_wait', label: 'Посмотреть, куда поведут мужчину с чемоданом', minutes: 30, terminal: true, outcomes: byRole('c38_na_unload', 'c38_nb_meds'), ambientDuring: frost38,
        text: 'Мужчину уводят за забор, к отдельному корпусу. Он оглядывается на чемодан у ворот. Солдат ставит чемодан к стене так, как ставят вещь, за которой не вернутся.', effects: [set38('ng', 'wait'), until38(10, 45)] },
      { id: 'c38_ng_ilka', label: 'Спросить про мужа той женщины с моста, Брандеса', when: flag('w.c38_ilka'), minutes: 30, terminal: true, outcomes: byRole('c38_na_unload', 'c38_nb_meds'),
        text: 'Солдат листает список у ворот. «Brandes, Holger. Halle, Reihe sieben». Ряд семь. Позже, в зале, ты находишь его: седой, небритый. Ты говоришь: Илька жива. Она у моста. Он садится на раскладушку и закрывает лицо руками.', effects: [set38('ng', 'ilka'), w38('ilka_told', true), until38(10, 50)] },
    ] }),

  X({ id: 'c38_na_unload', title: 'Разгрузка', location: ahr38, camp: ahrCamp, safe: false, ambient: frost38,
    text: [
      { text: 'Янник подгоняет машину к заднему входу. Мешки с крупой по двадцать пять килограммов, одеяла в тюках. Рампа обледенела: её никто не посыпал.' },
    ],
    actions: [
      { id: 'c38_nau_fast', label: 'Таскать по мешку на плече, быстро', minutes: 45, activity: 'heavy', risky: true, terminal: true, goto: 'c38_n_merle',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['mobility'] },
            text: 'Мешок на плечо, по рампе, в кладовую. Двадцать раз. Ноги находят шершавые места на льду сами. Янник считает вслух и сбивается.',
            effects: [set38('nau', 'fast'), { body: 'fatigue', delta: 12 }, until38(11, 30)] },
          { id: 'fall',
            text: 'На рампе нога уходит, мешок падает первым, ты на него. Плечо выворачивает, локоть бьётся о бетон. Мешок цел. Ты встаёшь и доносишь его, но рука потом плохо поднимается выше плеча.',
            effects: [set38('nau', 'fall'), { injure: 'bruise', site: 'rightArm', severity: 1 }, { body: 'stress', delta: 5 }, until38(11, 30)] },
        ] },
      { id: 'c38_nau_ash', label: 'Сначала посыпать рампу песком из пожарного ящика', minutes: 50, activity: 'moderate', terminal: true, goto: 'c38_n_merle',
        text: 'Песок смёрзся, ты разбиваешь его каблуком. Рампа становится шершавой. Дальше разгружаете спокойно. Повар из кухни выходит и благодарит: вчера на этой рампе сломал руку их водитель.', effects: [set38('nau', 'ash'), { body: 'fatigue', delta: 8 }, until38(11, 35)] },
      { id: 'c38_nau_chain', label: 'Позвать людей из зала: цепочкой быстрее', minutes: 45, terminal: true, goto: 'c38_n_merle',
        text: 'Ты заходишь в зал и просишь. Встают восемь человек. Мешки идут из рук в руки, двадцать минут — и машина пустая. Люди не расходятся: им давно никто ничего не поручал.', effects: [set38('nau', 'chain'), { body: 'fatigue', delta: 5 }, until38(11, 30)] },
    ] }),

  X({ id: 'c38_nb_meds', title: 'Лекарства', location: ahr38, camp: ahrCamp, ambient: hall38,
    text: [
      { text: 'Медицинский угол спортзала: две раскладушки, стол, шкафчик. Местный фельдшер, старик, валится с ног. Он показывает тебе тех, кому хуже всех.' },
      { text: 'Мальчик лет шести с кашлем и жаром: похоже на воспаление лёгких. Старик с гноящейся раной на голени. Женщина с температурой и болью в ухе. Антибиотиков — шесть упаковок на весь зал.' },
    ],
    actions: [
      { id: 'c38_nbm_boy', label: 'Мальчику — полный курс, остальным — что останется', minutes: 45, terminal: true, goto: 'c38_nb_list',
        text: 'Ты отсчитываешь мальчику таблетки на неделю и объясняешь матери, как давать. Она повторяет вслух. Старику с раной ты промываешь её и перевязываешь. Антибиотика ему не хватает. Фельдшер кивает: правильно. Ты не {m:уверен|уверена}.', effects: [set38('nbm', 'boy'), w38('boy_meds', true), until38(11, 15)] },
      { id: 'c38_nbm_split', label: 'Разделить на всех троих поровну', minutes: 45, terminal: true, goto: 'c38_nb_list',
        text: 'Каждому — по три дня. Мало для всех. Фельдшер смотрит на тебя и молчит: он тоже так делал. Ты знаешь, что так нельзя. Знаешь и то, что иначе тоже нельзя.', effects: [set38('nbm', 'split'), until38(11, 15)] },
      { id: 'c38_nbm_doc', label: 'Отдать всё фельдшеру: пусть решает он, он их знает', minutes: 40, terminal: true, goto: 'c38_nb_list',
        text: 'Фельдшер берёт упаковки и долго держит в руках. «Danke, dass Sie mir das nicht abnehmen». Спасибо, что не снимаете с меня это. Ты так и не узнаёшь, кому что досталось.', effects: [set38('nbm', 'doc'), until38(11, 10)] },
    ] }),

  X({ id: 'c38_nb_list', title: 'Список обратно', location: ahr38, camp: ahrCamp, ambient: hall38,
    text: [
      { text: 'Координатор даёт тебе список на обратный путь: двадцать восемь мест. Тридцать одна фамилия. Три лишних надо вычеркнуть. Решать медсестре: кто здоровее, кто доедет.' },
      { when: merleComes38, text: 'Мерле в списке есть. Карандашом, но есть.' },
    ],
    actions: [
      { id: 'c38_nbl_young', label: 'Вычеркнуть трёх самых крепких мужчин: дождутся следующей колонны', minutes: 30, terminal: true, goto: 'c38_n_merle',
        text: 'Ты вычёркиваешь три фамилии. Мужчины выслушивают молча. Один говорит.\n\n— Es gibt keine nächste Kolonne.\n\nСледующей колонны не будет. Ты знаешь.', effects: [set38('nbl', 'young'), until38(11, 45)] },
      { id: 'c38_nbl_sick', label: 'Вычеркнуть тех, кто с температурой: на мосту всё равно не пропустят', minutes: 30, terminal: true, goto: 'c38_n_merle',
        text: 'Ты вычёркиваешь троих с жаром. Это правда: с температурой на мосту развернут. Женщина с больным ухом плачет. Ты говоришь ей: вылечитесь — придёте весной. Ей нечего ответить.', effects: [set38('nbl', 'sick'), until38(11, 45)] },
      { id: 'c38_nbl_squeeze', label: 'Никого не вычёркивать: посадить по трое на два места', minutes: 30, terminal: true, goto: 'c38_n_merle',
        text: 'Координатор качает головой, потом пожимает плечами.\n\n— Ihre Verantwortung.\n\nВаша ответственность. В машинах будет тесно. На мосту солдаты будут пересчитывать. Ты рискуешь всеми ради трёх.', effects: [set38('nbl', 'squeeze'), w38('overloaded', true), until38(11, 45)] },
    ] }),

  X({ id: 'c38_n_merle', title: 'Мерле', location: ahr38, camp: ahrCamp, ambient: hall38,
    text: [
      { text: 'Она сидит на раскладушке в ряду у окна, поджав ноги, в двух свитерах. Худая. Волосы отросли и выцвели на концах. На коленях блокнот: рисует.' },
      { when: B38, text: 'Мерле поднимает глаза. Секунду смотрит, не узнавая. Потом блокнот падает на пол.' },
      { when: A38, text: 'Ты {m:видел|видела} её только на фотографии в телефоне. Узнаёшь по тому, как она поднимает голову: как будто ждала.' },
      { when: merleComes38, text: '— Ich komme mit, — говорит она сразу, без «здравствуй». — Ich hab’s gehört, im Radio. Ich komme mit, bevor ich es mir anders überlege.\n\nЯ еду с вами. Я слышала, по радио. Еду, пока не передумала.' },
      { when: merleStays, text: '— Ich bleibe. — Она говорит это раньше, чем ты успеваешь спросить. — Mama hat Angst. Und hier gibt es Ärzte. Irgendwann gibt es auch Insulin. Hier, nicht bei euch.\n\nЯ остаюсь. Мама боится. И здесь врачи. Когда-нибудь будет и инсулин. Здесь, не у вас.' },
    ],
    actions: [
      { id: 'c38_nm_hug', label: 'Обнять её', minutes: 30, terminal: true, goto: 'c38_n_parents',
        text: 'Она пахнет чужим мылом и спортзалом. Держится за тебя крепко, как в ту ночь в Бармбеке, когда выключился свет. Потом отстраняется и вытирает нос рукавом: «Okay. Genug». Хватит.', effects: [set38('nm', 'hug'), { set: '$.met.merle', value: true }, { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 2 }] }, until38(12, 15)] },
      { id: 'c38_nm_pens', label: 'Отдать ей ручки инсулина, которые привезла', when: all(B38, hasPens), minutes: 30, terminal: true, goto: 'c38_n_parents',
        text: 'Ты достаёшь носок из внутреннего кармана. Мерле разворачивает его, видит ручки и долго молчит. Потом говорит.\n\n— Du bist bescheuert.\n\nТы чокнутая. И плачет. Первый раз за всё время, что ты её знаешь.', effects: [set38('nm', 'pens'), { set: '$.met.merle', value: true }, { take: 'c21_insulin', qty: 2 }, { if: { has: 'c21_insulin' }, then: [{ take: 'c21_insulin', qty: 2 }] }, w38('pens_to_merle', true), { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 3 }] }, until38(12, 15)] },
      { id: 'c38_nm_stay', label: 'Спросить, правда ли она хочет остаться', when: merleStays, minutes: 30, terminal: true, goto: 'c38_n_parents',
        text: '— Nein. — Мерле смеётся без звука. Нет. — Aber ich bleibe trotzdem. Das ist der Unterschied zwischen wollen und machen.\n\nНо всё равно останусь. В этом разница между «хочу» и «делаю».', effects: [set38('nm', 'stay'), { set: '$.met.merle', value: true }, until38(12, 15)] },
      { id: 'c38_nm_sure', label: 'Спросить: ты уверена? У нас тесно, и инсулина мало', when: merleComes38, minutes: 30, terminal: true, goto: 'c38_n_parents',
        text: '— Hier ist es auch eng. Und Insulin ist hier null. — Мерле пожимает плечами. Здесь тоже тесно. А инсулина здесь ноль. — Bei euch gibt es wenigstens eine Kuh.\n\nУ вас хотя бы корова есть.', effects: [set38('nm', 'sure'), { set: '$.met.merle', value: true }, until38(12, 15)] },
    ] }),

  X({ id: 'c38_n_parents', title: 'Уве и Биргит', location: ahr38, camp: ahrCamp, ambient: hall38,
    text: [
      { text: 'Родители Мерле приходят через полчаса, из дома: их дом на соседней улице, с бойцами на постое. Уве высокий, сутулый, в старой лётной куртке. Биргит маленькая, круглая, с кастрюлей в сумке.' },
      { when: parentsCome38, text: '— Wenn sie geht, gehen wir mit, — говорит Биргит и ставит кастрюлю на раскладушку. — Ein Kind lässt man nicht allein. Auch wenn es vierundzwanzig ist.\n\nЕсли она едет, мы с ней. Ребёнка одного не отпускают. Даже если ему двадцать четыре.' },
      { when: all(merleComes38, not(parentsCome38)), text: '— Geh, — говорит Уве дочери. Иди. Одно слово. Биргит отворачивается к окну.' },
      { when: merleStays, text: 'Биргит обнимает дочь за плечи, как будто ты {m:пришёл|пришла} её забрать силой. Уве смотрит на тебя внимательно и кивает: спасибо, что приехали.' },
    ],
    actions: [
      { id: 'c38_np_soup', label: 'Съесть суп Биргит: от такого не отказываются', minutes: 30, terminal: true, outcomes: byRole('c38_na_fuel', 'c38_nb_hall'),
        text: 'Гороховый, густой, с копчёным. Биргит смотрит, как ты ешь, и подкладывает, не спрашивая. Как когда-то Мерле рассказывала: у мамы никто не уходит голодным.', effects: [set38('np', 'soup'), ...fed38, { set: '$.met.uwe', value: true }, { set: '$.met.birgit', value: true }, until38(12, 50)] },
      { id: 'c38_np_uwe', label: 'Поговорить с Уве про дорогу и мост', minutes: 30, terminal: true, outcomes: byRole('c38_na_fuel', 'c38_nb_hall'),
        text: 'Уве говорит мало и по делу. Мост закроют в шесть, говорит он, но на деле в половине шестого: солдаты тоже хотят домой. Выезжать надо не позже трёх. Он смотрит на часы, на тебя. Ты запоминаешь: не позже трёх.', effects: [set38('np', 'uwe'), w38('uwe_time', true), { set: '$.met.uwe', value: true }, { set: '$.met.birgit', value: true }, until38(12, 50)] },
      { id: 'c38_np_promise', label: 'Пообещать Биргит, что за Мерле присмотрят', when: merleComes38, minutes: 30, terminal: true, outcomes: byRole('c38_na_fuel', 'c38_nb_hall'),
        text: 'Биргит берёт тебя за руку обеими руками, сухими и тёплыми. Ничего не говорит. Только сжимает. Это обещание тяжелее, чем все, что ты давал{m:|а} до сих пор.', effects: [set38('np', 'promise'), w38('promised_birgit', true), { set: '$.met.uwe', value: true }, { set: '$.met.birgit', value: true }, until38(12, 50)] },
    ] }),

  X({ id: 'c38_na_fuel', title: 'Канистра', location: ahr38, camp: ahrCamp, ambient: frost38,
    text: [
      { text: 'Янник ведёт тебя к армейскому заправщику во дворе гимназии. Ефрейтор у цистерны курит и считает литры в тетради.' },
      { text: '— Benzin? Für euren Hof? — Ефрейтор усмехается. — Was gebt ihr?\n\nБензин? Для вашего хутора? Что дадите?' },
    ],
    actions: [
      { id: 'c38_naf_jars', label: 'Отдать банку тушёнки за десять литров', when: { has: 'c26_jar' }, minutes: 30, terminal: true, goto: 'c38_n_soup',
        text: 'Ефрейтор взвешивает банку на ладони, кивает. Десять литров в зелёную канистру. Ты несёшь её в машину Янника, и руки пахнут бензином до самого вечера.', effects: [set38('naf', 'jars'), { take: 'c26_jar' }, { give: 'can_petrol_10', fuel: 10 }, w38('petrol_got', true), until38(13, 45)] },
      { id: 'c38_naf_work', label: 'Предложить работу: разгрузить его бочки', minutes: 40, activity: 'heavy', terminal: true, goto: 'c38_n_soup',
        text: 'Четыре бочки с машины на поддон. Ефрейтор смотрит, потом наливает пять литров в старую канистру и отдаёт: «Für die Arbeit. Nicht mehr». За работу. Больше нет.', effects: [set38('naf', 'work'), { give: 'can_petrol_10', fuel: 5 }, { body: 'fatigue', delta: 8 }, w38('petrol_got', true), until38(13, 45)] },
      { id: 'c38_naf_no', label: 'Отказаться: нечего дать, нечего и просить', minutes: 20, terminal: true, goto: 'c38_n_soup',
        text: 'Ефрейтор пожимает плечами и возвращается к тетради. Янник разводит руками: попробовать стоило.', effects: [set38('naf', 'no'), until38(13, 35)] },
    ] }),

  X({ id: 'c38_nb_hall', title: 'Просьба', location: ahr38, camp: ahrCamp, ambient: hall38,
    text: [
      { text: 'Женщина с младенцем на руках идёт за тобой по залу от самого медицинского угла. Догоняет у двери.' },
      { text: '— Meine Mutter ist in Hanstedt. Sie weiß nicht, dass wir leben. Bitte. Nur einen Zettel.\n\nМоя мать в Ханштедте. Она не знает, что мы живы. Пожалуйста. Только записку.' },
    ],
    actions: [
      { id: 'c38_nbh_note', label: 'Взять записку', minutes: 25, terminal: true, goto: 'c38_n_soup',
        text: 'Записка на обороте рецепта: «Mama, Lisa und ich leben. Ahrensburg, Halle. Wir kommen im Frühjahr». Мама, Лиза и я живы. Аренсбург, спортзал. Мы придём весной. Ты прячешь её во внутренний карман.', effects: [set38('nbh', 'note'), w38('hanstedt_note', true), until38(13, 30)] },
      { id: 'c38_nbh_seat', label: 'Предложить место в машине: у неё ведь семья к югу', minutes: 30, terminal: true, goto: 'c38_n_soup',
        text: 'Женщина смотрит на младенца, на тебя. Качает головой. «Mit ihr? Über den Fluss, in der Kälte? Im Frühjahr». С ней? Через реку, в такой холод? Весной. Она всё равно отдаёт тебе записку.', effects: [set38('nbh', 'seat'), w38('hanstedt_note', true), until38(13, 35)] },
      { id: 'c38_nbh_no', label: 'Сказать, что не можешь обещать', minutes: 20, terminal: true, goto: 'c38_n_soup',
        text: 'Женщина кивает, как будто ждала. Уходит к своей раскладушке. Ты стоишь у двери и смотришь ей в спину.', effects: [set38('nbh', 'no'), until38(13, 25)] },
    ] }),

  X({ id: 'c38_n_soup', title: 'Перед дорогой', location: ahr38, camp: ahrCamp, ambient: hall38,
    text: [
      { text: 'В столовой спортзала раздают суп: на воде, с перловкой. Очередь вдоль стены. У окна — те, кто едет обратно, с узлами у ног.' },
      { when: bothNorth38, text: 'Вы встречаетесь у раздачи впервые за день. Полчаса до погрузки.' },
    ],
    actions: [
      { id: 'c38_ns_eat', label: 'Поесть: дорога обратно длинная', minutes: 30, terminal: true, outcomes: byRole('c38_na_load', 'c38_nb_stretcher'),
        text: 'Суп жидкий, но горячий. Ты ешь стоя, у окна, и смотришь на машины во дворе. Половина второго.', effects: [set38('ns', 'eat'), { body: 'hunger', delta: -15 }, { body: 'thirst', delta: -20 }, until38(14, 15)] },
      { id: 'c38_ns_partner', label: 'Найти {partner.acc} и рассказать, как прошло утро', when: bothNorth38, minutes: 30, terminal: true, outcomes: byRole('c38_na_load', 'c38_nb_stretcher'),
        text: 'Вы стоите у окна, плечо к плечу, и рассказываете быстро, перебивая друг друга. Дерево. Солдат. Мерле. Полчаса — и снова каждый к своей машине.', effects: [set38('ns', 'partner'), { body: 'stress', delta: -4 }, until38(14, 15)] },
      { id: 'c38_ns_give', label: 'Отдать свою миску тому, кто остаётся', minutes: 30, terminal: true, outcomes: byRole('c38_na_load', 'c38_nb_stretcher'),
        text: 'Ты отдаёшь миску старику у двери. Он остаётся. Ты едешь домой, тебя там накормят. Он ест медленно, как будто боится, что отнимут.', effects: [set38('ns', 'give'), { body: 'hunger', delta: 4 }, until38(14, 15)] },
      { id: 'c38_ns_window', label: 'Стоять у окна и смотреть на ворота: кого ещё привезут', minutes: 30, terminal: true, outcomes: byRole('c38_na_load', 'c38_nb_stretcher'),
        text: 'У ворот останавливается грузовик, из кузова выносят носилки. Ты смотришь, пока не зовут на погрузку. Лица на носилках не разглядеть.', effects: [set38('ns', 'window'), until38(14, 15)] },
    ] }),

  X({ id: 'c38_na_load', title: 'Коляска', location: ahr38, camp: ahrCamp, safe: false, ambient: frost38,
    text: [
      { text: 'Погрузка. Мужчина в инвалидной коляске, бывший докер, грузный. Его надо поднять в кузов второй машины. Рампы нет. Янник смотрит на тебя.' },
    ],
    actions: [
      { id: 'c38_nal_lift', label: 'Поднять вдвоём с Янником, вместе с коляской', minutes: 30, activity: 'heavy', risky: true, terminal: true, goto: 'c38_n_leave',
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['mobility'] },
            text: 'Раз, два, взяли. Коляска встаёт в кузов, мужчина держится за борт и смеётся.\n\n— Wie ein Sack Kohlen.\n\nКак мешок угля. Янник отдувается.',
            effects: [set38('nal', 'lift'), { body: 'fatigue', delta: 8 }, until38(15, 15)] },
          { id: 'back',
            text: 'Коляска тяжелее, чем казалось. На полпути у тебя что-то щёлкает в пояснице. Вы ставите её, но выпрямляешься ты медленно, держась за борт. Дорогу домой ты сидишь не откидываясь.',
            effects: [set38('nal', 'back'), { injure: 'sprain', site: 'torso', severity: 1 }, { body: 'stress', delta: 4 }, until38(15, 15)] },
        ] },
      { id: 'c38_nal_planks', label: 'Найти две доски и закатить по ним', minutes: 40, terminal: true, goto: 'c38_n_leave',
        text: 'Две доски от забора спортплощадки, одна треснувшая. Ты держишь, Янник катит. Медленно, зато никто не надрывается. Мужчина говорит.\n\n— Ingenieur?\n\nИнженер? Ты смеёшься.', effects: [set38('nal', 'planks'), until38(15, 25)] },
      { id: 'c38_nal_men', label: 'Позвать ещё двоих из тех, кто едет', minutes: 30, terminal: true, goto: 'c38_n_leave',
        text: 'Вчетвером поднимаете легко. Мужчина в коляске благодарит каждого за руку. Один из помощников потом садится рядом с ним и всю дорогу рассказывает про порт.', effects: [set38('nal', 'men'), until38(15, 15)] },
    ] }),

  X({ id: 'c38_nb_stretcher', title: 'Носилки', location: ahr38, camp: ahrCamp, safe: false, ambient: frost38,
    text: [
      { text: 'Погрузка. На носилках старуха с переломом бедра, привязанная ремнями. Носилки надо поднять в кузов первой машины по обледенелой подножке.' },
      { when: all(okaforComes, okafor38), text: 'Окафор берётся за головной конец. Тебе — ножной.' },
    ],
    actions: [
      { id: 'c38_nbs_lift', label: 'Взяться и поднимать', minutes: 30, activity: 'heavy', risky: true, terminal: true, goto: 'c38_n_leave',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 4, uses: ['mobility'] },
            text: 'Носилки тяжелее, чем ты {m:думал|думала}. Ты ставишь ногу на подножку, рывок, и носилки в кузове. Старуха не издаёт ни звука. Потом говорит.\n\n— Sie haben starke Hände.\n\nУ вас сильные руки. Не правда, но приятно.',
            effects: [set38('nbs', 'lift'), { body: 'fatigue', delta: 8 }, until38(15, 15)] },
          { id: 'slip',
            text: 'Нога соскальзывает с подножки. Ты удерживаешь носилки, но падаешь на колено, и край кузова бьёт тебя по запястью. Носилки целы, старуха цела. Запястье распухает за минуту.',
            effects: [set38('nbs', 'slip'), { injure: 'sprain', site: 'hands', severity: 1 }, { body: 'stress', delta: 6 }, until38(15, 15)] },
        ] },
      { id: 'c38_nbs_four', label: 'Позвать ещё двоих: вчетвером', minutes: 35, terminal: true, goto: 'c38_n_leave',
        text: 'Двое мужчин из очереди берутся за боковые ручки. Поднимаете ровно, без рывка. Старуха всё равно стонет, когда носилки встают на место. Но кость не сдвинулась.', effects: [set38('nbs', 'four'), until38(15, 20)] },
      { id: 'c38_nbs_check', label: 'Сначала проверить ремни и шину', minutes: 35, terminal: true, goto: 'c38_n_leave',
        text: 'Шина сбилась, один ремень перетянут. Ты перекладываешь, подтягиваешь, подкладываешь одеяло под колено. Потом поднимаете вчетвером. Старуха смотрит на тебя и шепчет.\n\n— Danke, Schwester.\n\nСпасибо, сестра.', effects: [set38('nbs', 'check'), w38('splint_fixed', true), until38(15, 25)] },
    ] }),

  X({ id: 'c38_n_leave', title: 'Отъезд', location: ahr38, camp: ahrCamp, ambient: frost38,
    text: [
      { text: 'Половина четвёртого. Солнце уже над самыми крышами. Колонна стоит у ворот с работающими моторами.' },
      { when: merleComes38, text: 'Мерле сидит в кузове на рюкзаке, между двумя стариками. Машет тебе рукой: всё в порядке.' },
      { when: parentsCome38, text: 'Уве и Биргит рядом с ней. Биргит держит кастрюлю на коленях, как ребёнка.' },
      { when: merleStays, text: 'Мерле стоит у ворот, с родителями. Без шапки, хотя мороз. Она будет стоять, пока колонна не скроется. Ты знаешь это, потому что знаешь её.' },
      { when: flag('w.c38_late40'), text: 'Из-за дерева на дороге колонна отстаёт от графика на сорок минут. Офицер на джипе машет: быстрее.' },
    ],
    actions: [
      { id: 'c38_nl_wave', label: 'Махать до поворота', minutes: 75, terminal: true, goto: 'c38_n_queue', ambientDuring: cab38,
        text: 'Ты машешь, пока ворота не скрываются за поворотом. Потом садишься ровно и смотришь вперёд. До моста час с лишним. Темнеет.', effects: [set38('nl', 'wave'), until38(16, 45)] },
      { id: 'c38_nl_count', label: 'Пересчитать пассажиров: все ли на месте', minutes: 75, terminal: true, goto: 'c38_n_queue', ambientDuring: cab38,
        text: 'Ты идёшь вдоль машин и считаешь. Двадцать восемь. Или тридцать один. Все на месте. В первой машине старуха спит. В третьей плачет ребёнок. Колонна трогается.', effects: [set38('nl', 'count'), w38('counted', true), until38(16, 45)] },
      { id: 'c38_nl_sleep', label: 'Сесть и закрыть глаза: силы ещё понадобятся', minutes: 75, activity: 'rest', terminal: true, goto: 'c38_n_queue', ambientDuring: cab38,
        text: 'Ты засыпаешь на первом километре и просыпаешься от того, что машина стоит. Впереди огни. Мост.', effects: [set38('nl', 'sleep'), { body: 'fatigue', delta: -6 }, until38(16, 45)] },
    ] }),

  X({ id: 'c38_n_queue', title: 'Очередь у моста', location: bridge38, camp: roadCamp, safe: false, ambient: frost38,
    text: [
      { text: 'Без четверти пять. Темно. У моста очередь: машины, люди пешком, телеги. Все хотят на юг до шести. Солдаты пропускают по одной, медленно, проверяя каждого.' },
      { text: 'Впереди колонны, перед самым шлагбаумом, заглох старый «Фольксваген». Водитель крутит стартер, мотор чихает и молчит. Сзади сигналят.' },
      { when: flag('w.c38_overloaded'), text: 'Солдат идёт вдоль колонны с фонарём и пересчитывает людей в кузовах. Губы шевелятся.' },
    ],
    actions: [
      { id: 'c38_nq_push', label: 'Выйти и толкать «Фольксваген» к обочине', minutes: 30, activity: 'heavy', risky: true, terminal: true, goto: 'c38_n_cross', ambientDuring: frost38,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['mobility'] },
            text: 'Ты упираешься в багажник, ещё двое рядом. Машина ползёт, скрипя, и съезжает в снег у обочины. Путь свободен. Солдат у шлагбаума машет: следующий.',
            effects: [set38('nq', 'push'), { body: 'fatigue', delta: 6 }, w38('cleared', true), until38(17, 30)] },
          { id: 'fall',
            text: 'Ботинки скользят, ты падаешь лицом вперёд, на лёд, руки не успевают. Удар подбородком, во рту кровь. Машину сталкивают другие. Ты возвращаешься в кабину, прижимая снег к лицу.',
            effects: [set38('nq', 'fall'), { injure: 'bruise', site: 'head', severity: 1 }, { body: 'stress', delta: 6 }, w38('cleared', true), until38(17, 30)] },
        ] },
      { id: 'c38_nq_calm', label: 'Пройти вдоль колонны: успокоить тех, кто паникует', minutes: 30, terminal: true, goto: 'c38_n_cross', ambientDuring: frost38,
        text: 'В третьей машине женщина пытается вылезти и бежать к мосту пешком. Ты держишь её за рукав и говоришь, медленно, одно и то же: успеем, мы в списке, нас ждут. Она садится обратно. Через десять минут «Фольксваген» сталкивают солдаты.', effects: [set38('nq', 'calm'), until38(17, 30)] },
      { id: 'c38_nq_soldier', label: 'Подойти к солдату со списком колонны', minutes: 30, terminal: true, goto: 'c38_n_cross', ambientDuring: frost38,
        text: 'Ты протягиваешь список. Солдат светит фонарём, считает. «Rotes Kreuz, Rückfahrt. Gut. Ihr seid die Letzten». Красный Крест, обратный. Хорошо. Вы последние. Он машет своим: «Den Volkswagen weg!» Убрать «Фольксваген»!', effects: [set38('nq', 'soldier'), until38(17, 30)] },
    ] }),

  X({ id: 'c38_n_cross', title: 'Последние минуты', location: bridge38, camp: roadCamp, ambient: cab38, onEnter: [until38(17, 50)],
    text: [
      { text: 'Без десяти шесть колонна въезжает на мост. Под колёсами гудит бетон, внизу, в темноте, шуршит лёд.' },
      { text: 'Вы съезжаете на южный берег. За вашей последней машиной шлагбаум опускается. Солдат ставит поперёк бетонный блок краном.' },
      { text: 'На северной стороне остаются люди. Фонари, голоса, кто-то кричит имя. Шлагбаум не поднимется.' },
    ],
    actions: [
      { id: 'c38_nc_back', label: 'Оглянуться', minutes: 60, terminal: true, goto: 'c38_n_winsen', ambientDuring: cab38,
        text: 'Ты оборачиваешься. Огни на том берегу маленькие, жёлтые, их много. Ты смотришь, пока дорога не поворачивает. Потом смотришь вперёд.', effects: [set38('nc', 'back'), { body: 'stress', delta: 4 }, until38(19, 0)] },
      { id: 'c38_nc_forward', label: 'Не оглядываться', minutes: 60, terminal: true, goto: 'c38_n_winsen', ambientDuring: cab38,
        text: 'Ты смотришь вперёд, на красные огни передней машины. Только вперёд. Сзади кто-то плачет, но ты не оборачиваешься.', effects: [set38('nc', 'forward'), until38(19, 0)] },
      { id: 'c38_nc_hold', label: 'Взять за руку того, кто сидит рядом', minutes: 60, terminal: true, goto: 'c38_n_winsen', ambientDuring: cab38,
        text: 'Рядом с тобой — кто-то из вернувшихся, старик или Мерле, в темноте не разобрать. Рука холодная. Ты держишь её до самого Винзена.', effects: [set38('nc', 'hold'), { body: 'stress', delta: -3 }, until38(19, 0)] },
    ] }),

  X({ id: 'c38_n_winsen', title: 'Винзен', location: winsen38, camp: winCamp, ambient: frost38,
    text: [
      { text: 'Семь вечера. Школьный двор Винзена в фарах. Колонна встаёт. Люди вылезают из кузовов, затёкшие, замёрзшие. Кого-то встречают, кого-то нет.' },
      { when: all(B38, send38('both'), not(bothNorth38)), text: '{partner} стоит у ворот школы, в инее, и машет обеими руками.' },
      { when: all(not(send38('both')), not(bothNorth38)), text: 'Тебя здесь никто не встречает: так договорились. Пикап Красного Креста довезёт до хутора к половине девятого.' },
    ],
    actions: [
      { id: 'c38_nw_pickup', label: 'Сесть в пикап до хутора', minutes: 60, terminal: true, goto: 'c38_evening', ambientDuring: cab38,
        text: 'Пикап забит до отказа. Ты сидишь на сумке медсестры, и тебе всё равно. Дома ждут.', effects: [set38('nw', 'pickup'), until38(20, 30)] },
      { id: 'c38_nw_hand', label: 'Помочь старикам из кузова, потом ехать', minutes: 60, terminal: true, goto: 'c38_evening', ambientDuring: frost38,
        text: 'Ты подаёшь руку, ловишь узлы, отводишь старуху с носилок к санитарам. Последний пикап уходит в восемь, и ты успеваешь.', effects: [set38('nw', 'hand'), { body: 'fatigue', delta: 3 }, until38(20, 30)] },
      { id: 'c38_nw_okafor', label: 'Попрощаться с Окафором и Янником', when: any(all(okaforComes, okafor38), { npc: 'jannik', alive: true }), minutes: 60, terminal: true, goto: 'c38_evening', ambientDuring: frost38,
        text: 'Окафор кивает: «Good work». Хорошая работа. Янник хлопает тебя по плечу: «Wir haben es geschafft». Мы успели. Потом каждый к своей машине.', effects: [set38('nw', 'okafor'), until38(20, 30)] },
    ] }),
];
