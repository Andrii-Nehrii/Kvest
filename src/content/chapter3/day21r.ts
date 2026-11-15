import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { carHere, evaHere, npc, tableOnly } from './point19';
import {
  B21, S21, car21, dusk21, guestsHome, lea, night21, own21, partnerDown, set21, until21, w21,
} from './point21';

// Участок 21, вход R: партнёр без сознания после 20-й, спасает тот, кто на ногах (TECHNIQUES §3.1, STOCK_PLAN §7).
// Пока спасающий на ногах, выбывший жив. Чем лучше спасали, тем раньше он очнётся и тем меньше слабость; плохой путь
// стоит времени, бензина и чужого слова, но не жизни. К утру выбывший приходит в себя при любом пути.
const R = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S21({ ...scene, for: 'any', chapter: 'ch3' });
const farm = 'hof_luedemann';
const point = 'c16_jesteburg';
const road = 'c7_farm_lane';
const strips: Cond = v('w.c19_b_stitch', 'strips');
const haveKeys: Cond = { pairHas: 'car_keys' };
const carOk: Cond = all(carHere, haveKeys, { fuelFor: 'opel_corsa', km: 8 });
const late: Cond = { after: at(20, 18, 50) };
const sewn: Cond = any(own21('rb', 'strips'), flag('$.c21_at_point'));
const partnerUp: Cond = { partner: 'active' };
const treat = (how: 'basic' | 'proper'): Effect => ({ treat: how, target: '@partner' });
const blood = (delta: number): Effect => ({ body: 'bloodLoss', delta, target: '@partner' });
const drink = (delta: number): Effect => ({ body: 'thirst', delta, target: '@partner' });
/** Ключи от машины могут лежать в кармане того, кто без сознания. */
const keys: Effect = { takeFromPartner: 'car_keys' };
/** Довезти партнёра: без сознания — на руках в машину, очнувшегося — как обычную поездку вдвоём. */
const ride = (to: string, km: number, minutes: number): Effect => ({ carryPartner: { to, km, minutes, vehicle: 'opel_corsa' } });
/** Последняя бутылка физраствора из кармана парки: если к этому часу партнёр всё ещё без сознания. */
const lastBottle: Effect = { if: partnerDown, then: [blood(-25), drink(-40)] };
const afterBed = 'c21_r_plan';

export const day21RScenes: Scene[] = [
  R({ id: 'c21_r_bed', title: 'Кухонный стол', camp: tense14, safe: false, onEnter: [set21('rescuer', true), set21('nursed', true)],
    text: [
      { text: '{partner} лежит на кухонном столе. Полотенце под раной уже не белое. Лицо серое, губы как бумага. На своё имя {pm:он|она} не отвечает.' },
      { text: 'Солдаты уехали к следующему двору. Во дворе тихо.' },
      { when: evaHere, text: 'Эва держит лампу. Руки у неё не дрожат. Нина стоит в дверях с аптечкой и не может войти.' },
      { when: not(evaHere), text: 'Нина стоит в дверях с аптечкой и не может войти.' },
      { text: 'Кровь идёт медленно, толчками. Но идёт.' },
    ],
    actions: [
      { id: 'c21_rb_press', label: 'Зажать рану и перевязать туго, чем есть', minutes: 15, terminal: true, goto: afterBed,
        text: 'Ты складываешь полотенце вчетверо, наваливаешься на рану всем весом и считаешь до двухсот. Потом бинтуешь, виток за витком, так туго, как хватает рук. Кровь проступает пятном и останавливается у края.', effects: [set21('rb', 'press'), treat('basic'), { use: 'dressing' }, until21(20, 16, 0)] },
      { id: 'c21_rb_strips', label: 'Свести края полосками, как учила врач, и перевязать', when: all(B21, strips), minutes: 20, terminal: true, goto: afterBed,
        text: 'Ты промываешь рану кипячёной водой, сводишь края пальцами и клеишь полоски одну за другой, внахлёст. Руки у тебя в его крови по запястья. Сверху давящая повязка. Кровь больше не идёт.', effects: [set21('rb', 'strips'), treat('proper'), { use: 'dressing' }, until21(20, 16, 0)] },
      { id: 'c21_rb_kit', label: 'Промыть антисептиком и наложить повязку из аптечки', when: { has: 'first_aid' }, minutes: 20, terminal: true, goto: afterBed,
        text: 'Антисептик шипит на ране. {partner} не вздрагивает, и это пугает больше крови. Ты кладёшь подушечку из аптечки, поверх бинт, поверх второй. Узел затягиваешь зубами.', effects: [set21('rb', 'kit'), treat('basic'), { use: 'dressing' }, blood(-1), until21(20, 16, 0)] },
      { id: 'c21_rb_help', label: 'Бежать к воротам: вернуть солдат', minutes: 25, terminal: true, goto: afterBed, ambientDuring: dusk21,
        text: 'Ты выбегаешь на дорогу. «Вольф» уже у двора Кёлер. Ты машешь и кричишь, пока он не разворачивается. Солдат Тобиаса, бывший пожарный, перетягивает рану жгутом за две минуты. Но до этих двух минут было двадцать, и все двадцать кровь шла.\n\n— Arzt ist in Jesteburg, — говорит Тобиас. Врач в Йестебурге. — Fahr selbst. Wir müssen zur Autobahn.\n\nВези сам. Нам на автобан.', effects: [set21('rb', 'help'), treat('basic'), npc('c15_tobias', 1), until21(20, 16, 5)] },
    ] }),

  R({ id: 'c21_r_plan', title: 'Куда', camp: tense14, safe: false,
    text: [
      { text: 'Четыре часа. Через полчаса стемнеет. Пульс у {partner.gen} на шее частый и слабый, как у птицы.' },
      { text: 'В Йестебурге, в пункте у пожарной части, есть врач. Четыре километра.' },
      { when: carHere, text: 'Corsa стоит под навесом.' },
      { text: 'В Люнебурге есть доктор Алерс и кровь. Сорок километров, посты, темнота.' },
      { when: evaHere, text: '— Nachts? Über die Felder? — говорит Эва. — Fahr ins Dorf oder bleib hier, Kind. Aber nicht nach Lüneburg.\n\nНочью? Через поля? Езжай в деревню или оставайся здесь, детка. Только не в Люнебург.' },
      { when: not(evaHere), text: '— Не надо в Люнебург, — говорит Нина. — Там по дороге те. Я видела с крыши.' },
    ],
    actions: [
      { id: 'c21_rp_point', label: 'Везти в Йестебург, к врачу', minutes: 10, terminal: true, goto: 'c21_r_point', enabled: carOk, disabledReason: 'Нет машины, ключей или бензина на дорогу туда и обратно',
        text: 'Вы с Ниной выносите {partner.acc} на одеяле и укладываете на заднее сиденье. Ключи находятся в кармане куртки. Четыре километра ты едешь на второй передаче и на каждой яме говоришь вслух: «Прости».', effects: [set21('rp', 'point'), set21('at_point', true), keys, ride(point, 4, 15), until21(20, 16, 35)] },
      { id: 'c21_rp_stay', label: 'Остаться: греть, поить, ждать', minutes: 10, terminal: true, goto: 'c21_r_warm',
        text: 'Вы переносите {partner.acc} на кровать Хенрике, к печи. Ты укрываешь {pm:его|её} двумя одеялами. На табурет ставишь кружку воды, которую пока некому пить.', effects: [set21('rp', 'stay'), until21(20, 16, 20)] },
      { id: 'c21_rp_lue', label: 'Везти в Люнебург, к Алерс', minutes: 10, risky: true, terminal: true, goto: 'c21_r_road', enabled: all(carHere, haveKeys, { fuelFor: 'opel_corsa', km: 40 }), disabledReason: 'Нет машины, ключей или бензина на сорок километров',
        text: 'Ты не слушаешь никого. Одеяла, заднее сиденье, ключи из кармана куртки. В зеркале Нина стоит у ворот и не машет.', effects: [set21('rp', 'lue'), keys, ride(road, 8, 20), until21(20, 16, 40)] },
    ] }),

  // ───────────── Пункт в Йестебурге ─────────────
  R({ id: 'c21_r_point', title: 'Пункт', location: point, camp: { at: point, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: car21,
    text: [
      { text: 'Пункт — бывший спортзал пожарной дружины. Два ряда раскладушек, запах хлорки. Доктор Зандер, маленькая, в мужском свитере под халатом, смотрит на рану, не дотрагиваясь. Потом тебе в лицо.\n\n— Wie lange?\n\nДавно?\n\n— Seit halb drei.\n\n— Auf den Tisch.\n\nНа стол.' },
      { when: all(B21, flag('w.c19_doc_trust')), text: 'Она узнаёт тебя.\n\n— Sie. Ich hatte gesagt: kommen Sie zu mir. So war das nicht gemeint.\n\nВы. Я говорила: приходите ко мне. Я имела в виду не это.' },
      { text: 'Шьёт она быстро, под лампой на аккумуляторе. Потом вешает на гвоздь бутылку с прозрачной жидкостью и ведёт трубку к сгибу локтя.\n\n— Kochsalz. Blut habe ich keins. Plasma auch nicht: das geht alles nach Lüneburg.\n\nФизраствор. Крови у меня нет. Плазмы тоже: вся уходит в Люнебург.' },
    ],
    actions: [
      { id: 'c21_ro_lamp', label: 'Держать лампу и подавать, что скажет', minutes: 40, terminal: true, goto: 'c21_r_point2',
        text: 'Ты держишь лампу сорок минут. Она ни разу не говорит «выше» или «левее»: значит, держишь правильно. Последний узел она завязывает одной рукой.\n\n— So. Jetzt braucht es Zeit.\n\nТак. Теперь нужно время.', effects: [set21('ro', 'lamp'), treat('proper'), blood(-12), drink(-40), { set: '$.met.c21_sander', value: true }, until21(20, 17, 20)] },
      { id: 'c21_ro_blood', label: 'Предложить свою кровь', minutes: 45, terminal: true, goto: 'c21_r_point2',
        text: '— Welche Gruppe?\n\nКакая группа?\n\nТы не знаешь. Она смотрит на тебя, на часы, на серое лицо на столе.\n\n— Dann nicht. Ohne Test kann ich damit töten.\n\nТогда нет. Без пробы этим можно убить.\n\nОна ставит физраствор. Но руку тебе сжимает, коротко, выше локтя.', effects: [set21('ro', 'blood'), w21('doc_knows', true), treat('proper'), blood(-12), drink(-40), { set: '$.met.c21_sander', value: true }, until21(20, 17, 20)] },
      { id: 'c21_ro_sit', label: 'Сесть у стены: ноги не держат', minutes: 40, terminal: true, goto: 'c21_r_point2',
        text: 'Ты сползаешь по стене на пол. Отсюда видно только её спину и локти. Через сорок минут она оборачивается.\n\n— Das Herz ist stark. Trinken Sie was.\n\nСердце сильное. Выпейте чего-нибудь.', effects: [set21('ro', 'sit'), treat('proper'), blood(-12), drink(-40), { body: 'stress', delta: -2 }, { set: '$.met.c21_sander', value: true }, until21(20, 17, 20)] },
    ] }),

  R({ id: 'c21_r_point2', title: 'Койка или дом', location: point, camp: { at: point, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: car21,
    text: [
      { text: 'К половине шестого бутылка на гвозде пустеет наполовину. {partner} дышит глубже. Глаз не открывает.' },
      { text: '— Sie können hierbleiben, ein Bett ist frei. Oder Sie fahren ins Warme. Hier wird es heute Nacht voll: die bringen die Leute von der Kolonne.\n\nМожете остаться, одна койка свободна. Или езжайте в тепло. Здесь сегодня ночью будет тесно: привезут людей с колонны.' },
      { text: 'В дверях стоит дружинник Брандта с блокнотом и записывает каждого, кто входит.' },
    ],
    actions: [
      { id: 'c21_r2_home', label: 'Везти домой, в тепло', minutes: 10, terminal: true, goto: 'c21_r_supper',
        text: 'Доктор Зандер сама подтыкает одеяло на заднем сиденье.\n\n— Wärme. Zuckerwasser, löffelweise. Den Verband nicht anfassen.\n\nТепло. Сладкая вода с ложки. Повязку не трогать.', effects: [set21('r2', 'home'), set21('doc_advice', true), ride(farm, 4, 15), until21(20, 17, 55)] },
      { id: 'c21_r2_stay', label: 'Остаться, пока не докапает до конца', minutes: 10, terminal: true, goto: 'c21_r_home',
        text: 'Ты сидишь на табурете у койки. В семь привозят первых с колонны, и зал наполняется криком. Доктор Зандер больше к вам не подходит. В половине восьмого бутылка пуста.\n\nДружинник в дверях пишет в блокнот: «Lüdemann-Hof — eine Person verletzt». И подчёркивает.\n\nДомой ты едешь в темноте.', effects: [set21('r2', 'stay'), w21('brandt_knows_hurt', true), blood(-5), until21(20, 19, 35), ride(farm, 4, 15), until21(20, 19, 55)] },
      { id: 'c21_r2_ask', label: 'Спросить, сколько {pm:он|она} будет приходить в себя', minutes: 15, terminal: true, goto: 'c21_r_supper',
        text: '— Heute Nacht wacht er auf, wenn Sie ihn warm halten. Aufstehen — in zwei Tagen. Arbeiten — in zwei Wochen. Und wenn er vorher aufstehen will: festhalten.\n\nОчнётся сегодня ночью, если держать в тепле. Вставать — через два дня. Работать — через две недели. А если захочет встать раньше — держите.\n\nВ дорогу она даёт тебе пакетик сахара из армейского пайка.', effects: [set21('r2', 'ask'), set21('doc_advice', true), ride(farm, 4, 15), until21(20, 18, 0)] },
    ] }),

  // ───────────── Плохой путь: ночью в Люнебург ─────────────
  R({ id: 'c21_r_road', title: 'Пост у Ханштедта', location: road, camp: { at: road, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: car21,
    text: [
      { text: 'За Ханштедтом дорога пустая и чёрная. {partner} лежит на заднем сиденье под двумя одеялами. На каждой яме голова {pm:его|её} мотается.' },
      { text: 'Поперёк шоссе стоит армейский грузовик без огней. Пост. Людей не видно. За грузовиком на асфальте кто-то сидит. Потом встаёт.' },
      { text: 'Ты считаешь: ещё тридцать два километра. Стрелка бензина ниже, чем ты думал{m:|а}.' },
    ],
    actions: [
      { id: 'c21_rr_back', label: 'Развернуться и ехать в Йестебург, пока не поздно', minutes: 10, terminal: true, goto: 'c21_r_point',
        text: 'Ты разворачиваешься в три приёма, задевая бампером отбойник. Тот, у грузовика, идёт за машиной шагов двадцать и отстаёт. Сорок минут ты отдал{m:|а} дороге, которая никуда не привела.', effects: [set21('rr', 'back'), set21('at_point', true), blood(1), ride(point, 12, 30), until21(20, 17, 25)] },
      { id: 'c21_rr_field', label: 'Объехать пост полем', minutes: 10, risky: true, terminal: true, goto: 'c21_r_home',
        outcomes: [
          { id: 'ok', check: { traits: ['driving'], difficulty: 5, uses: ['focus'] }, text: 'Поле держит. Ты выбираешься на шоссе за постом и едешь ещё четыре километра. У моста дорогу перегораживают два джипа и толпа пеших с узлами.\n\n— Nach Lüneburg kommt heute keiner. Umkehren!\n\nВ Люнебург сегодня никто не проедет. Разворачивайтесь!\n\nДомой ты возвращаешься через два часа после того, как выехал{m:|а}. Бензина сожжено на полдороги до Люнебурга.', effects: [set21('rr', 'turned'), blood(2), ride(farm, 20, 60)] },
          { id: 'ditch', text: 'Колёса зарываются в пашню по ступицу. Мотор воет и глохнет. Ты мигаешь фонарём в темноту сорок минут, пока на дороге не останавливается трактор Брандта, идущий к автобану. Пожарный цепляет трос и выдёргивает Corsa одним рывком.\n\n— Verletzte fährt man ins Dorf, du Idiot.\n\nРаненых возят в деревню, идиот.\n\nДомой ты едешь за трактором.', effects: [set21('rr', 'ditch'), set21('brandt_minus', true), blood(3), { body: 'stress', delta: 5 }, { body: 'fatigue', delta: 6 }, ride(farm, 10, 80)] },
        ], effects: [until21(20, 19, 0)] },
    ] }),

  // ───────────── Дом: тепло, ужин, фонарь на дороге ─────────────
  R({ id: 'c21_r_warm', title: 'Тепло', camp: house14,
    text: [
      { text: '{partner} лежит на кровати Хенрике, у печи. Руки у {pm:него|неё} ледяные.' },
      { when: evaHere, text: 'Эва наливает в бутылки горячую воду и заворачивает каждую в полотенце.\n\n— An die Füße. Und unter die Achseln. So hat man es früher gemacht.\n\nК ногам. И под мышки. Так делали раньше.' },
      { when: not(evaHere), text: 'Нина подкладывает дрова, пока печь не начинает гудеть.' },
    ],
    actions: [
      { id: 'c21_rw_bottles', label: 'Обложить бутылками с горячей водой и не отходить', minutes: 80, terminal: true, goto: 'c21_r_supper',
        text: 'Ты меняешь бутылки каждые двадцать минут. К шести пальцы у {partner.gen} розовеют. Один раз {pm:он|она} стонет и поворачивает голову. Ты говоришь с {pm:ним|ней} всё это время, обо всём подряд.', effects: [set21('rw', 'bottles'), blood(-2), { body: 'stress', delta: -1 }, until21(20, 17, 55)] },
      { id: 'c21_rw_sugar', label: 'Развести сахар в тёплой воде и поить с ложки', minutes: 80, terminal: true, goto: 'c21_r_supper',
        text: 'Первые ложки стекают по подбородку. Десятую {pm:он|она} глотает. Ты считаешь глотки, как считают деньги. К шести кружка пуста на треть.', effects: [set21('rw', 'sugar'), blood(-3), drink(-30), until21(20, 17, 55)] },
      { id: 'c21_rw_yard', label: 'Оставить {pm:его|её} Нине и запереть двор на ночь', minutes: 60, activity: 'moderate', terminal: true, goto: 'c21_r_supper', ambientDuring: dusk21,
        text: 'Ворота, задняя калитка, сарай. Сетку курятника ты стягиваешь проволокой в темноте, на ощупь. Когда возвращаешься, Нина сидит у кровати и держит {partner.acc} за руку обеими руками.\n\n— Дышит, — говорит она. — Я считала.', effects: [set21('rw', 'yard'), w21('yard_locked', true), npc('c7_nina', 2), until21(20, 17, 55)] },
    ] }),

  R({ id: 'c21_r_supper', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Шесть вечера. На плите картошка в мундире. Никто не садится за стол: на нём ещё лежит клеёнка, которую надо отмыть.' },
      { text: 'Нина ставит перед тобой миску на подоконник.\n\n— Ешь. Ты с утра ничего не ел{m:|а}.' },
    ],
    actions: [
      { id: 'c21_ru_eat', label: 'Поесть: силы ещё понадобятся', minutes: 15, terminal: true, goto: 'c21_r_home', ...tableOnly,
        text: 'Ты ешь стоя, у подоконника, и не чувствуешь вкуса. Миска пустеет.', effects: [set21('ru', 'eat'), meal('eat'), until21(20, 18, 35)] },
      { id: 'c21_ru_pack', label: 'Отставить миску на потом', minutes: 5, terminal: true, goto: 'c21_r_home', ...tableOnly,
        text: 'Ты накрываешь миску тарелкой. Нина смотрит на тебя, как смотрят взрослые, и ничего не говорит.', effects: [set21('ru', 'pack'), meal('pack'), until21(20, 18, 35)] },
      { id: 'c21_ru_tea', label: 'Только сладкий чай', minutes: 10, terminal: true, goto: 'c21_r_home',
        text: 'Чай обжигает. Сахар Нина кладёт сама, три ложки, не спрашивая.', effects: [set21('ru', 'tea'), { body: 'thirst', delta: -15 }, until21(20, 18, 35)] },
    ] }),

  R({ id: 'c21_r_home', title: 'Свет на дороге', camp: tense14, safe: false,
    text: [
      { when: not(late), text: 'Без четверти семь Нина зовёт от окна, шёпотом:\n\n— Там свет. На дороге.' },
      { when: not(late), text: 'На просёлке, метрах в трёхстах, мигает фонарь. Три коротких, пауза. Три коротких. Те, из больницы, так не ходят. Так зовут. В луче видно троих. Двое идут. Третьего несут.' },
      { when: late, text: 'У ворот тебя встречает Нина с фонарём.\n\n— У нас гости. Трое, с колонны. Один не может идти. Я пустила их в сарай. — Она смотрит тебе в лицо. — Правильно?' },
    ],
    actions: [
      { id: 'c21_rh_out', label: 'Выйти к ним с фонарём', when: not(late), minutes: 15, terminal: true, goto: 'c21_r_lea', ambientDuring: night21,
        text: 'Ты идёшь по просёлку и светишь себе под ноги, чтобы они видели, откуда ты.', effects: [set21('rh', 'out'), until21(20, 19, 5)] },
      { id: 'c21_rh_call', label: 'Окликнуть от ворот: пусть подойдут сами', when: not(late), minutes: 15, terminal: true, goto: 'c21_r_lea', ambientDuring: night21,
        text: '— Wer da? — кричишь ты.\n\n— Kolonne! Verwundeter! — отвечают с дороги.\n\nОни подходят медленно. Дважды останавливаются и ставят ношу на землю.', effects: [set21('rh', 'call'), until21(20, 19, 10)] },
      { id: 'c21_rh_right', label: 'Сказать: правильно. Веди', when: late, minutes: 10, terminal: true, goto: 'c21_r_lea',
        text: 'Нина выдыхает и идёт вперёд, к сараю. Фонарь в её руке не дрожит.', effects: [set21('rh', 'right'), npc('c7_nina', 2), until21(20, 20, 10)] },
      { id: 'c21_rh_first', label: 'Сначала занести {partner.acc} в дом', when: late, minutes: 20, activity: 'heavy', terminal: true, goto: 'c21_r_lea',
        text: 'Вы с Ниной несёте {partner.acc} на одеяле через двор. На крыльце из темноты выходит девушка в армейской парке и молча берётся за третий угол.', effects: [set21('rh', 'first'), { body: 'fatigue', delta: 4 }, until21(20, 20, 20)] },
    ] }),

  R({ id: 'c21_r_lea', title: 'Покажи рану', camp: kitchen14, onEnter: [...guestsHome, { set: '$.met.c21_dirk', value: true }],
    text: [
      { text: 'Девушка в армейской парке, с повязкой Красного Креста и синей сумкой через плечо. Молодой солдат с автоматом за спиной. И человек с ногой, примотанной к доске: шофёр колонны, его зовут Мальте.' },
      { text: '— Wir sind von der Kolonne. Seit Mittag unterwegs, — говорит солдат. Мы с колонны. Идём с полудня.' },
      { text: 'Девушка смотрит мимо тебя, на кровать у печи. Она уже идёт туда и на ходу закатывает рукава.\n\n— Zeig mir die Wunde.\n\nПокажи рану.' },
    ],
    actions: [
      { id: 'c21_rl_show', label: 'Показать', minutes: 25, terminal: true, goto: 'c21_r_plasma',
        outcomes: [
          { id: 'sewn', when: sewn, text: 'Она снимает верхний слой бинта, смотрит, нюхает.\n\n— Sauber. Das lasse ich so.\n\nЧисто. Так и оставлю.\n\nОна щупает пульс на шее, долго, с закрытыми глазами.', effects: [set21('rl', 'show'), treat('proper'), lea(1)] },
          { id: 'redo', text: 'Она снимает повязку, смотрит, нюхает.\n\n— Das hält nicht. Ich mache es neu.\n\nТак не удержит. Я переделаю.\n\nШьёт она быстро, мелким стежком, и разговаривает с раной, как с собакой на столе: «So. Brav. Stillhalten». Вот так. Умница. Не дёргаемся.', effects: [set21('rl', 'show'), treat('proper'), lea(2)] },
        ], effects: [until21(20, 20, 0)] },
      { id: 'c21_rl_who', label: 'Сначала спросить, кто она такая', minutes: 30, terminal: true, goto: 'c21_r_plasma',
        text: '— Tierärztin. Fast. Ich nähe Hunde. Menschen sind auch nicht viel anders, nur lauter.\n\nВетеринар. Почти. Я шью собак. Люди мало отличаются, только шумнее.\n\nРуки она уже моет. Через полчаса на ране ровный шов, мелкий, как на рубашке.', effects: [set21('rl', 'who'), set21('lea_doubt', true), treat('proper'), until21(20, 20, 5)] },
      { id: 'c21_rl_no', label: 'Не подпускать: врач уже шила', when: flag('$.c21_at_point'), minutes: 10, terminal: true, goto: 'c21_r_plasma',
        text: '— Dann schaue ich nur.\n\nТогда я только посмотрю.\n\nОна смотрит, не дотрагиваясь, и кивает.\n\n— Gut. Besser als ich.\n\nХорошо. Лучше, чем я.', effects: [set21('rl', 'no'), until21(20, 19, 50)] },
    ] }),

  R({ id: 'c21_r_plasma', title: 'Четыре пакета', camp: kitchen14,
    text: [
      { text: 'Она открывает синюю сумку. Внутри четыре прозрачных пакета с жёлтой жидкостью и узкая коробка шприц-ручек.\n\n— Plasma. Das ist kein Blut. Aber es füllt auf. Mit zwei Beuteln ist das Aufwachen heute Nacht sicher. Ohne — vielleicht morgen früh.\n\nПлазма. Это не кровь. Но объём она вернёт. С двумя пакетами проснётся сегодня ночью наверняка. Без них — может быть, к утру.' },
      { text: 'Она не отводит глаз.\n\n— Die waren für Kinder gedacht. In Lüneburg. Ich sage es nur, damit du es weißt.\n\nОни были для детей. В Люнебурге. Говорю, чтобы ты {m:знал|знала}.' },
    ],
    actions: [
      { id: 'c21_rq_use', label: 'Сказать: ставь оба', minutes: 40, terminal: true, goto: 'c21_f_b_set',
        text: 'Первый пакет она вешает на гвоздь от календаря. Жёлтое идёт по трубке медленно, капля за каплей. Через час лицо на подушке перестаёт быть серым. Пустые пакеты она складывает вчетверо и убирает обратно в сумку, как будто их ещё можно вернуть.', effects: [set21('rq', 'use'), w21('plasma_used', 2), blood(-20), drink(-30), lea(1), until21(20, 20, 50)] },
      { id: 'c21_rq_one', label: 'Сказать: один', minutes: 25, terminal: true, goto: 'c21_f_b_set',
        text: '— Einer. Gut. Das ist ehrlich.\n\nОдин. Хорошо. Это честно.\n\nОна вешает пакет на гвоздь от календаря. К тому, что осталось в сумке, она больше не прикасается.', effects: [set21('rq', 'one'), w21('plasma_used', 1), blood(-10), drink(-20), lea(2), until21(20, 20, 40)] },
      { id: 'c21_rq_no', label: 'Сказать: нет. Это не наше', minutes: 20, terminal: true, goto: 'c21_f_b_set',
        text: 'Она кивает, без облегчения и без упрёка. Из кармана парки достаёт плоскую бутылку с трубкой.\n\n— Kochsalz. Von dem toten Sani. Der braucht es nicht mehr.\n\nФизраствор. От мёртвого санитара. Ему уже не нужно.\n\nСумку она сама относит к двери в сени, в самый холодный угол.', effects: [set21('rq', 'no'), blood(-8), drink(-30), lea(2), until21(20, 20, 35)] },
    ] }),

  R({ id: 'c21_r_dirk', title: 'Ефрейтор', camp: yard14, ambient: night21, onEnter: [set21('lea_known', true)],
    text: [
      { text: 'Солдат ждёт тебя на крыльце. В дом он не заходил.\n\n— Gefreiter Sommer. Dirk. Ich muss weiter, nach Jesteburg, zur Wache. Ich muss melden, wo die Spenderin ist.\n\nЕфрейтор Зоммер. Дирк. Мне надо дальше, в Йестебург, в караулку. Я должен доложить, где донор.' },
      { text: 'Он понижает голос.\n\n— Die da drin ist keine Sanitäterin. Das ist Hartmann. Die, wegen der wir gefahren sind.\n\nТа, что в доме, не санитарка. Это Хартман. Та, из-за которой мы ехали.' },
      { text: 'Он качается на ногах.' },
    ],
    actions: [
      { id: 'c21_rk_sleep', label: 'Сказать: ты спишь стоя. Ляг в сарае до утра', minutes: 10, terminal: true, goto: 'c21_h_room',
        text: 'Он спорит ровно столько, сколько нужно, чтобы не было стыдно. В сарае он ложится на солому в ботинках и засыпает раньше, чем ты закрываешь дверь.', effects: [set21('rk', 'sleep'), w21('dirk', 'slept'), until21(20, 21, 30)] },
      { id: 'c21_rk_wait', label: 'Сказать: она только что зашила моего человека. Дай ей ночь', minutes: 10, terminal: true, goto: 'c21_h_room',
        text: 'Он смотрит в окно кухни, на кровать у печи.\n\n— Eine Nacht, — говорит он. Одну ночь. — Morgen früh melde ich.\n\nУтром доложу.', effects: [set21('rk', 'wait'), w21('dirk', 'slept'), w21('dirk_promised', true), until21(20, 21, 30)] },
      { id: 'c21_rk_go', label: 'Показать ему дорогу на Йестебург', minutes: 10, terminal: true, goto: 'c21_h_room',
        text: 'Просёлок, почтовый ящик, налево по шоссе. Он повторяет вслух и уходит. К полуночи в Йестебурге будут знать, где она.', effects: [set21('rk', 'go'), w21('dirk', 'reported'), until21(20, 21, 30)] },
    ] }),

  // ───────────── Ночь у постели ─────────────
  R({ id: 'c21_r_night', title: 'У постели', camp: house14,
    text: [
      { text: 'Одиннадцать. В доме тихо. Ты сидишь у кровати Хенрике и считаешь вдохи. Сбиваешься и начинаешь снова.' },
      { when: partnerUp, text: '{partner} уже открывал{pm:|а} глаза. Смотрел{pm:|а} на тебя, узнал{pm:|а} и уснул{pm:|а} опять, теперь по-настоящему.' },
      { when: partnerDown, text: '{partner} не приходит в себя. Но губы уже не серые.' },
    ],
    actions: [
      { id: 'c21_rn_spoon', label: 'Не спать: поить с ложки каждый час', minutes: 5, terminal: true, goto: 'c21_r_wake',
        text: 'Каждый час ты подносишь ложку к {pm:его|её} губам. В третьем часу {pm:он|она} глотает сам{pm:|а}, не просыпаясь. Ты чуть не роняешь кружку.', effects: [set21('rn', 'spoon'), blood(-4), drink(-40), until21(21, 3, 0)] },
      { id: 'c21_rn_alarm', label: 'Спать на стуле, вставать по будильнику', minutes: 5, terminal: true, goto: 'c21_r_wake',
        text: 'Будильник ты ставишь на каждые два часа. Дважды встаёшь, трогаешь лоб, поправляешь одеяло и проваливаешься обратно.', effects: [set21('rn', 'alarm'), blood(-2), drink(-20), until21(21, 3, 0, true)] },
      { id: 'c21_rn_nina', label: 'Попросить Нину посидеть до трёх', minutes: 5, terminal: true, goto: 'c21_r_wake',
        text: 'Нина садится на твой стул с тетрадью и карандашом. Утром ты находишь в тетради столбик: время и слово «дышит», шестнадцать раз подряд.', effects: [set21('rn', 'nina'), blood(-3), drink(-30), npc('c7_nina', 3, 'c21_sat_the_night'), until21(21, 3, 0, true)] },
    ] }),

  R({ id: 'c21_r_wake', title: 'Три часа ночи', camp: house14,
    text: [
      { when: partnerUp, text: 'В начале четвёртого ты слышишь своё имя. Шёпотом, с подушки. {partner} смотрит на тебя, и глаза у {pm:него|неё} ясные.\n\n— Сколько времени? — спрашивает {pm:он|она}. Как будто проспал{pm:|а} будильник.' },
      { when: partnerDown, text: 'В начале четвёртого {partner} всё ещё не открывает глаз. Но рука под одеялом тёплая, и пальцы сжимают твои, когда ты их трогаешь.' },
    ],
    actions: [
      { id: 'c21_rz_tell', label: 'Рассказать {pm:ему|ей}, что было', when: partnerUp, minutes: 15, terminal: true, goto: 'c21_h_dawn',
        text: 'Ты рассказываешь шёпотом. Про стол, про дорогу, про девушку с сумкой. {partner} слушает и на середине засыпает. Ты договариваешь до конца всё равно.', effects: [set21('rz', 'tell'), { body: 'stress', delta: -4 }, until21(21, 6, 30, true)] },
      { id: 'c21_rz_sleep', label: 'Лечь рядом и наконец уснуть', when: partnerUp, minutes: 5, terminal: true, goto: 'c21_h_dawn',
        text: 'Ты ложишься с краю, не раздеваясь. Рука {partner.gen} находит твою сама.', effects: [set21('rz', 'sleep'), { body: 'stress', delta: -3 }, until21(21, 6, 30, true)] },
      { id: 'c21_rz_lea', label: 'Разбудить гостью', when: partnerDown, minutes: 30, terminal: true, goto: 'c21_h_dawn',
        text: 'Она приходит босиком, щупает пульс, смотрит зрачки.\n\n— Der Körper holt auf. Es fehlt nicht mehr viel.\n\nТело догоняет. Осталось немного.\n\nИз кармана парки она достаёт последнюю плоскую бутылку и ставит её сама. К рассвету {partner} открывает глаза и просит пить.', effects: [set21('rz', 'lea'), lastBottle, lea(1), until21(21, 4, 30), lastBottle, until21(21, 6, 30, true)] },
      { id: 'c21_rz_wait', label: 'Сидеть и ждать рассвета', when: partnerDown, minutes: 5, terminal: true, goto: 'c21_h_dawn',
        text: 'Ты сидишь. В пятом часу в комнату входит гостья, босиком, не спрашивая. Щупает пульс и ставит бутылку из кармана парки.\n\n— Du hättest mich wecken sollen.\n\nНадо было меня разбудить.\n\nК рассвету {partner} открывает глаза и просит пить.', effects: [set21('rz', 'wait'), until21(21, 4, 30), lastBottle, until21(21, 5, 30), lastBottle, until21(21, 6, 30)] },
    ] }),
];
