import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { brothersCome } from './point33';
import { tractorRuns } from './point38';
import { merleFarm39 } from './point39';
import { A40, B40, S40, cab40, fed40, frost40, hall40, henrike40, lue40, set40, strangers40, until40, w40 } from './point40';

// Участок 40, понедельник. Склад казармы (кто едет по КТ39): дорога, очередь, человек из прошлого (A — Фолькер, которого не пустили
// на ночлег в 18-й; B — старушка с гамбургского вокзала первого дня), доля двора по спискам Брандта (выдаётся на линии A, один раз),
// суп полевой кухни, толпа у остатков (риск), обратно. Кто не едет — день на хуторе: Мерле, сарай, подготовка к оттепели, соседи,
// дежурства от Брандта, ожидание.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S40({ ...scene, for: 'any', chapter: 'ch3' });
const lueCamp = { at: lue40, stock: 'c3_farm_stock', rest: false as const };
const metVolker: Cond = flag('$.met.c18_volker');
const metLady: Cond = flag('$.helped_lady');
const carOk: Cond = all({ has: 'car_keys' }, { itemAt: 'opel_corsa', place: 'hof_luedemann' }, { fuelFor: 'opel_corsa', km: 54 });
const tractorReady: Cond = all(tractorRuns, flag('w.c39_tractor_ready'));
const share = (mult: 1 | 2): Effect => ({ if: A40, then: [{ give: 'c16_flour', qty: 10 * mult }, { give: 'c26_jar', qty: 4 * mult }, { give: 'c24_epa', qty: 2 * mult }, w40('share', mult === 2 ? 'big' : 'normal')] });

export const day40DScenes: Scene[] = [
  X({ id: 'c40_d_road', title: 'На склад', camp: yard14, ambient: frost40,
    text: [
      { text: 'Семь утра. До Люнебурга двадцать пять километров. Дорога — каша из снега и грязи, ночью подморозило, к обеду развезёт.' },
      { when: tractorReady, text: 'Трактор с прицепом готов: цепи на колёсах, брезент. Увезёт много, но едет медленно.' },
      { when: brothersCome, text: 'Дениз греет фургон у сарая: он едет в любом случае.' },
    ],
    actions: [
      { id: 'c40_dr_tractor', label: 'Ехать на тракторе с прицепом', when: tractorReady, minutes: 90, terminal: true, goto: 'c40_d_queue', ambientDuring: cab40,
        text: 'Полтора часа на тракторе по раскисшей дороге. Прицеп мотает на поворотах. Зато в него влезет всё, что дадут. И ещё столько же.', effects: [set40('dr', 'tractor'), set40('big_load', true), until40(44, 8, 30)] },
      { id: 'c40_dr_van', label: 'С Денизом в фургоне', when: brothersCome, minutes: 75, terminal: true, goto: 'c40_d_queue', ambientDuring: cab40,
        text: 'Фургон Дениза тёплый и тесный. Дениз молчит всю дорогу, только раз говорит: «Wenn es Ärger gibt — wir gehen. Kein Mehl ist das wert». Если будет заварушка — уходим. Никакая мука того не стоит.', effects: [set40('dr', 'van'), until40(44, 8, 30)] },
      { id: 'c40_dr_car', label: 'На Corsa', when: carOk, minutes: 60, terminal: true, goto: 'c40_d_queue', ambientDuring: cab40,
        text: 'Corsa идёт по колее, как по рельсам. В багажник много не влезет. Но быстро.', effects: [set40('dr', 'car'), { drive: 'opel_corsa', km: 27, to: lue40 }, until40(44, 8, 30)] },
      { id: 'c40_dr_lift', label: 'Попроситься к соседям в телегу', minutes: 90, terminal: true, goto: 'c40_d_queue', ambientDuring: frost40,
        text: 'Сосед с насыпи едет на телеге с лошадью: последняя лошадь в округе, говорит он. Ты сидишь на мешках, ноги мёрзнут. Зато в телеге место на двоих.', effects: [set40('dr', 'lift'), until40(44, 8, 30)] },
    ] }),

  X({ id: 'c40_d_queue', title: 'Ворота склада', location: lue40, camp: lueCamp, ambient: frost40,
    text: [
      { text: 'Ворота казармы открыты. Перед складом очередь: несколько сотен человек, телеги, тачки, санки. Брандт стоит на ящике у дверей склада с листами в руках. Рядом шестеро дружинников.' },
      { when: any(v('w.c39_council', 'guard'), v('w.c39_council', 'brandt')), text: 'Ваш двор в листах есть: вы были на совете.' },
      { when: v('w.c39_council', 'yards'), text: 'Ваш двор в листах есть, но в конце: «кто за себя, тот последний», сказал Брандт на совете.' },
    ],
    actions: [
      { id: 'c40_dq_line', label: 'Встать в очередь, как все', minutes: 60, terminal: true, goto: 'c40_d_thread', ambientDuring: frost40,
        text: 'Ты стоишь. Очередь движется медленно. Люди переговариваются, кто-то ругается, кто-то молится. Пахнет мокрой шерстью и дизелем.', effects: [set40('dq', 'line'), until40(44, 9, 30)] },
      { id: 'c40_dq_help', label: 'Помогать дружинникам держать порядок', minutes: 60, terminal: true, goto: 'c40_d_thread', ambientDuring: frost40,
        text: 'Ты встаёшь с дружинниками у дверей. Отводишь тех, кто лезет вперёд, подаёшь руку старикам. Брандт видит и кивает. Ваш двор он вызывает раньше.', effects: [set40('dq', 'help'), w40('helped_brandt', true), npc('c16_brandt', 1), until40(44, 9, 30)] },
      { id: 'c40_dq_front', label: 'Пройти прямо к Брандту: у вас больные на хуторе', minutes: 45, terminal: true, goto: 'c40_d_thread', ambientDuring: frost40,
        text: '— Kranke haben alle, — говорит Брандт, не поднимая глаз от листа. Больные у всех. — Stell dich an.\n\nВстань в очередь.\n\nОчередь видела, как ты шёл{m:|а} вперёд. Тебе это припомнят.', effects: [set40('dq', 'front'), npc('c16_brandt', -1), until40(44, 9, 15)] },
    ] }),

  X({ id: 'c40_d_thread', title: 'Знакомое лицо', location: lue40, camp: lueCamp, ambient: frost40,
    text: [
      { when: all(A40, metVolker), text: 'В очереди рядом — мужчина с ручной тележкой, в мокрой кожаной куртке. Фолькер, кровельщик из Тоштедта. Тот, кого вы в ноябре не пустили ночевать. Дали воды и закрыли ворота. Он тебя узнаёт.' },
      { when: all(A40, metVolker), text: '— Wasser habt ihr mir gegeben. Weiß ich noch. — Он не злой, просто устал. — Ich steh auf keiner Liste. Kein Hof. Wenn du sagst, ich gehör zu euch, krieg ich was.\n\nВоды вы мне дали. Помню. Меня ни в каком списке нет. Нет двора. Если скажешь, что я с вами, мне что-то дадут.' },
      { when: all(B40, metLady), text: 'Перед тобой в очереди — маленькая старушка в мужском пальто. Она оборачивается, смотрит на тебя и вдруг улыбается. Гамбург, вокзал, утро десятого ноября. Табло, расписание, шоколадка в кармане.' },
      { when: all(B40, metLady), text: '— Sie! Das Mädchen vom Bahnhof! — Она берёт тебя за руку. — Peters. Hilde Peters. Ich bin nie in Wandsbek angekommen. Sie haben uns hierher gebracht.\n\nВы! Девушка с вокзала! Петерс. Хильда Петерс. Я так и не дошла до Вандсбека. Нас привезли сюда.' },
      { when: any(all(A40, not(metVolker)), all(B40, not(metLady))), text: 'Рядом в очереди старик с пустыми санками. Он еле стоит. Спрашивает, не поможешь ли донести, когда дадут: одному не дотащить.' },
    ],
    actions: [
      { id: 'c40_dt_vouch', label: 'Сказать Брандту, что Фолькер — с вашего двора', when: all(A40, metVolker), minutes: 45, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Брандт смотрит на Фолькера, на тебя, долго. Потом вписывает его в ваш лист карандашом. «Ein Mann mehr — ein Sack weniger für euch». Одним человеком больше — одним мешком меньше вам. Фолькер жмёт тебе руку: «Jetzt sind wir quitt». Теперь мы квиты.', effects: [set40('dt', 'vouch'), w40('volker', 'yard'), w40('share_less', true), until40(44, 10, 15)] },
      { id: 'c40_dt_food', label: 'Отдать Фолькеру часть своего, когда получите', when: all(A40, metVolker), minutes: 45, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Ты говоришь: стой рядом, поделюсь. Фолькер кивает, не благодарит. Ждёт молча. Когда ты отсыпаешь ему муки в мешок, он говорит только: «Ich hätte euch auch nicht reingelassen». Я бы вас тоже не пустил.', effects: [set40('dt', 'food'), w40('volker', 'fed'), until40(44, 10, 15)] },
      { id: 'c40_dt_no', label: 'Сказать, что не можешь', when: all(A40, metVolker), minutes: 30, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Фолькер пожимает плечами и уходит в конец очереди с тележкой. Второй раз. Ты смотришь ему вслед.', effects: [set40('dt', 'no'), w40('volker', 'refused'), until40(44, 10, 0)] },
      { id: 'c40_dt_lady_carry', label: 'Пообещать донести её долю до автобуса', when: all(B40, metLady), minutes: 45, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Фрау Петерс кивает и держит тебя за рукав, пока очередь движется, как будто боится потерять. Рассказывает: сестра в Вандсбеке, наверное, умерла, она одна в женском корпусе, и корпус завтра закроют.', effects: [set40('dt', 'carry'), w40('peters', 'helped'), until40(44, 10, 15)] },
      { id: 'c40_dt_lady_farm', label: 'Позвать её на хутор: корпус всё равно закроют', when: all(B40, metLady), minutes: 45, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Фрау Петерс смотрит на тебя долго. Потом говорит: «Ich kann stricken. Und Kartoffeln schälen, schneller als jede». Я умею вязать. И чистить картошку быстрее всех. Это значит «да».', effects: [set40('dt', 'farm'), w40('peters', 'farm'), until40(44, 10, 15)] },
      { id: 'c40_dt_lady_talk', label: 'Просто поговорить, пока стоите', when: all(B40, metLady), minutes: 45, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Вы стоите и говорите. Про вокзал, про то утро, про шоколадку. Фрау Петерс смеётся: «Die war abgelaufen. Ich wollte es Ihnen nicht sagen». Она была просрочена. Я не хотела вам говорить.', effects: [set40('dt', 'talk'), w40('peters', 'met'), until40(44, 10, 15)] },
      { id: 'c40_dt_old', label: 'Пообещать старику помочь с санками', when: any(all(A40, not(metVolker)), all(B40, not(metLady))), minutes: 45, terminal: true, goto: 'c40_d_share', ambientDuring: frost40,
        text: 'Старик кивает. Потом рассказывает, что был машинистом на этой линии сорок лет. Последний поезд прошёл здесь десятого ноября. Он его вёл.', effects: [set40('dt', 'old'), until40(44, 10, 15)] },
    ] }),

  X({ id: 'c40_d_share', title: 'Доля двора', location: lue40, camp: lueCamp, ambient: hall40,
    text: [
      { text: 'Очередь доходит до вас. Внутри склада полутьма, пахнет мешковиной и мылом. Брандт сверяет лист: двор, сколько ртов.' },
      { when: v('w.c26_brandt', 'ally'), text: 'Брандт смотрит на тебя и, не говоря ни слова, ставит в вашу графу на одну цифру больше.' },
      { when: v('w.c26_brandt', 'hostile'), text: 'Брандт считает ваш двор дважды, вслух, и даёт ровно по списку. Ни граммом больше.' },
      { text: 'Мука в мешках по десять кило, тушёнка, армейские пайки. Соль. Свечи. Всё по счёту.' },
    ],
    actions: [
      { id: 'c40_ds_take', label: 'Взять, что дают, и поблагодарить', minutes: 60, terminal: true, goto: 'c40_d_lunch',
        text: 'Ты расписываешься в листе. Два дружинника выносят мешки к вашей телеге или машине. Брандт уже вызывает следующий двор.', effects: [set40('ds', 'take'), share(1), until40(44, 11, 15)] },
      { id: 'c40_ds_more', label: 'Попросить больше: у вас приезжие и диабетик', when: all(merleFarm39, not(v('w.c26_brandt', 'hostile'))), minutes: 60, terminal: true, goto: 'c40_d_lunch',
        text: 'Брандт слушает. Потом молча придвигает ещё мешок муки и коробку сахара. «Für das Mädchen. Sag ihr, sie soll leben». Для девушки. Скажи ей, пусть живёт.', effects: [set40('ds', 'more'), share(2), w40('sugar', true), until40(44, 11, 15)] },
      { id: 'c40_ds_trade', label: 'Взять долю и выменять часть муки на бензин у дружинников', minutes: 60, terminal: true, goto: 'c40_d_lunch',
        text: 'Дружинник с канистрой у ворот меняет литр на килограмм. Ты отдаёшь пять кило муки, получаешь пять литров. Хенрике будет ругаться. Или нет.', effects: [set40('ds', 'trade'), share(1), { if: A40, then: [{ give: 'can_petrol_10', fuel: 5 }] }, until40(44, 11, 15)] },
    ] }),

  X({ id: 'c40_d_lunch', title: 'Полевая кухня', location: lue40, camp: lueCamp, ambient: frost40,
    text: [
      { text: 'Во дворе казармы последняя армейская полевая кухня раздаёт гороховый суп: всем, кто подходит, без списков. Повар в куртке нараспашку, лицо красное от пара.' },
      { text: '— Morgen koch ich drüben, — говорит он каждому. Завтра я варю на той стороне. — Heute noch für euch.\n\nСегодня ещё для вас.' },
    ],
    actions: [
      { id: 'c40_dl_eat', label: 'Взять миску и поесть', minutes: 45, terminal: true, goto: 'c40_d_crowd', ambientDuring: frost40,
        text: 'Суп густой, с салом. Ты ешь стоя, у колеса кухни, где теплее. Повар кивает тебе, как знакомому.', effects: [set40('dl', 'eat'), ...fed40, until40(44, 12, 0)] },
      { id: 'c40_dl_pot', label: 'Попросить налить в котелок: для дома', minutes: 45, terminal: true, goto: 'c40_d_crowd', ambientDuring: frost40,
        text: 'Повар смотрит на котелок, на тебя, и наливает до краёв. «Für die Kinder?» Для детей? Ты киваешь. Ты сам{m:|а} ешь хлеб всухомятку.', effects: [set40('dl', 'pot'), w40('soup_home', true), { body: 'hunger', delta: -12 }, until40(44, 12, 0)] },
      { id: 'c40_dl_skip', label: 'Не стоять: следить за своим грузом', minutes: 30, terminal: true, goto: 'c40_d_crowd', ambientDuring: frost40,
        text: 'Ты стоишь у своих мешков. Вокруг ходят люди и смотрят на мешки. Ты смотришь на людей.', effects: [set40('dl', 'skip'), w40('guarded_load', true), until40(44, 11, 45)] },
    ] }),

  X({ id: 'c40_d_crowd', title: 'Остатки', location: lue40, camp: lueCamp, safe: false, ambient: frost40,
    text: [
      { text: 'В полдень Брандт кончает лист и спрыгивает с ящика. «Der Rest — wer zuerst kommt». Остальное — кто первым возьмёт. Дружинники отходят от дверей.' },
      { text: 'Толпа идёт к складу разом. Кто-то падает. Двери трещат. Внутри — ещё полсклада.' },
    ],
    actions: [
      { id: 'c40_dc_push', label: 'Лезть внутрь за мешком: пока есть', minutes: 45, activity: 'heavy', risky: true, terminal: true, goto: 'c40_d_back', ambientDuring: frost40,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['mobility'] },
            text: 'Плечом, локтем, боком. Внутри темно и тесно. Ты хватаешь мешок муки и коробку свечей и выбираешься обратно, пока двери не прижали. На улице руки трясутся.',
            effects: [set40('dc', 'push'), { give: 'c16_flour', qty: 10 }, { give: 'c39_candles' }, w40('grabbed', true), { body: 'fatigue', delta: 8 }, until40(44, 13, 0)] },
          { id: 'crush',
            text: 'В дверях тебя зажимает между людьми и косяком. Не вдохнуть. Кто-то наступает на ногу, кто-то бьёт локтем в рёбра. Ты выбираешься наружу без ничего. Бок горит при каждом вдохе.',
            effects: [set40('dc', 'crush'), { injure: 'bruise', site: 'torso', severity: 2 }, { body: 'stress', delta: 8 }, until40(44, 13, 0)] },
        ] },
      { id: 'c40_dc_child', label: 'Вытащить из толпы упавшего ребёнка', minutes: 40, terminal: true, goto: 'c40_d_back', ambientDuring: frost40,
        text: 'Мальчик лет восьми лежит у дверей, на него наступают. Ты хватаешь его за куртку и вытаскиваешь к стене. Он цел, только ревёт. Мать находит его через минуту и уводит, не сказав ни слова. Склад к тому времени пустеет.', effects: [set40('dc', 'child'), w40('child_saved', true), until40(44, 13, 0)] },
      { id: 'c40_dc_leave', label: 'Уходить, пока не началось', minutes: 30, terminal: true, goto: 'c40_d_back', ambientDuring: frost40,
        text: 'Ты уходишь к своей машине или телеге. За спиной крики, звон стекла, чей-то плач. Дениз был прав: никакая мука того не стоит.', effects: [set40('dc', 'leave'), until40(44, 12, 45)] },
    ] }),

  X({ id: 'c40_d_back', title: 'Обратно', location: 'c7_farm_lane', camp: lueCamp, safe: false, ambient: cab40,
    text: [
      { text: 'Обратно — с грузом. Дорога за утро раскисла: колея полна воды. Начинается мелкий дождь.' },
      { when: v('$.c40_dt', 'carry'), text: 'Сначала — до автобуса Красного Креста у ворот, с мешком фрау Петерс. Она машет тебе из окна, пока автобус не трогается.' },
      { when: v('$.c40_dt', 'farm'), text: 'Фрау Петерс сидит рядом, с узелком на коленях. Едет на хутор.' },
      { text: 'У поворота на Хиттфельд поперёк дороги лежит опрокинутая телега: лошадь упала, мешки в грязи. Двое мужчин ругаются друг на друга.' },
    ],
    actions: [
      { id: 'c40_db_help', label: 'Остановиться и помочь поднять телегу', minutes: 90, activity: 'heavy', risky: true, terminal: true, goto: 'c40_mon_evening', ambientDuring: frost40,
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['mobility'] },
            text: 'Вчетвером вы ставите телегу на колёса. Лошадь встаёт сама, дрожа. Один из мужчин даёт тебе десяток яиц из своих мешков, завёрнутых в газету. Половина целы.',
            effects: [set40('db', 'help'), w40('eggs', true), { body: 'fatigue', delta: 8 }, until40(44, 15, 30)] },
          { id: 'slip',
            text: 'Телега качается и садится обратно, ты падаешь в грязь лицом вниз. {m:Мокрый|Мокрая} до нитки. Телегу всё-таки поднимают. Ты едешь домой, стуча зубами.',
            effects: [set40('db', 'slip'), { body: 'stress', delta: 4 }, { body: 'fatigue', delta: 8 }, until40(44, 15, 30)] },
        ] },
      { id: 'c40_db_round', label: 'Объехать по обочине и не останавливаться', minutes: 75, terminal: true, goto: 'c40_mon_evening', ambientDuring: cab40,
        text: 'Ты объезжаешь по краю поля. Мужчины кричат вслед. Ты не оборачиваешься. Груз цел.', effects: [set40('db', 'round'), until40(44, 15, 15)] },
      { id: 'c40_db_wait', label: 'Подождать, пока разберутся сами', minutes: 90, terminal: true, goto: 'c40_mon_evening', ambientDuring: cab40,
        text: 'Ты ждёшь в кабине. Через полчаса телегу поднимают без тебя. Ещё через полчаса ты дома. Мокрые снаружи и сухие внутри — тоже хорошо.', effects: [set40('db', 'wait'), until40(44, 15, 30)] },
    ] }),

  // ═════════════ Понедельник на хуторе ═════════════
  X({ id: 'c40_m_merle', title: 'Утро на хуторе', camp: kitchen14,
    text: [
      { when: merleFarm39, text: 'Мерле колет утреннюю дозу и пишет в блокнот цифры. Утро тихое, хутор полупустой: кто уехал на склад, кто ещё спит.' },
      { when: not(merleFarm39), text: 'Утро тихое. Кто уехал на склад, кто ещё спит. Нина сидит над учебником и не читает.' },
    ],
    actions: [
      { id: 'c40_mm_merle', label: 'Посчитать с Мерле, на сколько хватит', when: merleFarm39, minutes: 60, terminal: true, goto: 'c40_m_barn',
        text: 'Мерле считает вслух, ты проверяешь. Цифры те же, что вчера, только на день меньше. Она закрывает блокнот: «Weiter». Дальше.', effects: [set40('mm', 'merle'), until40(44, 8, 30)] },
      { id: 'c40_mm_school', label: 'Провести с детьми урок, как договаривались', minutes: 60, terminal: true, goto: 'c40_m_barn',
        text: 'Немецкий, счёт, карта. Нина отвечает первой, соседская девочка — второй. Час без мыслей о вторнике.', effects: [set40('mm', 'school'), until40(44, 8, 30)] },
      { id: 'c40_mm_rest', label: 'Посидеть у печи с кружкой', minutes: 45, terminal: true, goto: 'c40_m_barn',
        text: 'Кружка, печь, тишина. Хенрике проходит мимо и кладёт тебе руку на плечо. Ничего не говорит.', effects: [set40('mm', 'rest'), { body: 'stress', delta: -3 }, until40(44, 8, 30)] },
    ] }),

  X({ id: 'c40_m_barn', title: 'Сарай', camp: yard14, ambient: frost40,
    text: [
      { when: strangers40, text: 'В сарае Йорг и его дети. У девочки жар меньше, горло ещё красное. Йорг колет дрова с утра, хотя никто не просил.' },
      { when: not(strangers40), text: 'В сарае течёт крыша: снег на ней тает. Под дырой лужа, рядом мешки с картошкой.' },
    ],
    actions: [
      { id: 'c40_mb_girl', label: 'Посмотреть девочку', when: strangers40, minutes: 45, terminal: true, goto: 'c40_m_prep',
        text: 'Тридцать семь и восемь, лучше. Горло всё ещё красное. Ты оставляешь Йоргу таблеток на два дня и объясняешь, как поить. Он повторяет за тобой вслух, как школьник.', effects: [set40('mb', 'girl'), w40('girl_better', true), until40(44, 10, 0)] },
      { id: 'c40_mb_jorg', label: 'Поговорить с Йоргом про ночь вторника', when: strangers40, minutes: 45, terminal: true, goto: 'c40_m_prep',
        text: 'Йорг слушает и кивает. «Wenn die kommen, bin ich da. Mit der Axt». Если придут, я тут. С топором. Он не хвастает. Он говорит, как будет.', effects: [set40('mb', 'jorg'), w40('jorg_ready', true), until40(44, 10, 0)] },
      { id: 'c40_mb_sacks', label: 'Перенести мешки от лужи', minutes: 45, activity: 'moderate', terminal: true, goto: 'c40_m_prep',
        text: 'Мешок за мешком на сухое, к стене. Под дыру — ведро. Капли стучат в ведро, как часы.', effects: [set40('mb', 'sacks'), { body: 'fatigue', delta: 5 }, until40(44, 10, 0)] },
    ] }),

  X({ id: 'c40_m_prep', title: 'К оттепели', camp: yard14, safe: false, ambient: frost40,
    text: [
      { text: 'Завтра оттепель. Хенрике хочет, чтобы к ночи вторника всё было готово: вода в бочках, окна, двери, дрова в доме.' },
      { when: not(flag('w.c39_barn_boarded')), text: 'Окна хлева не забиты. Корова за ними одна.' },
    ],
    actions: [
      { id: 'c40_mp_barn', label: 'Забить окна хлева', when: not(flag('w.c39_barn_boarded')), minutes: 90, activity: 'heavy', terminal: true, goto: 'c40_m_neighbor', ambientDuring: frost40,
        text: 'Доски, гвозди, молоток. Корова мычит в темноте. Ты оставляешь щель наверху для воздуха. Теперь в хлев можно войти только через дверь.', effects: [set40('mp', 'barn'), w40('barn_boarded', true), { body: 'fatigue', delta: 8 }, until40(44, 12, 0)] },
      { id: 'c40_mp_water', label: 'Наносить воды во все бочки: если что, наружу не выходить', minutes: 90, activity: 'heavy', risky: true, terminal: true, goto: 'c40_m_neighbor', ambientDuring: frost40,
        outcomes: [
          { id: 'ok', check: { traits: ['endurance'], difficulty: 3, uses: ['mobility'] },
            text: 'Ведро за ведром, бочка за бочкой. Плечи горят. К полудню в доме воды на три дня.',
            effects: [set40('mp', 'water'), w40('water_in', true), { body: 'fatigue', delta: 10 }, until40(44, 12, 0)] },
          { id: 'slip',
            text: 'На скользком крыльце ты падаешь с двумя вёдрами. Вода на тебе, вёдра в снегу, локоть разбит о ступеньку. Воду ты всё-таки наносишь, медленнее.',
            effects: [set40('mp', 'slip'), w40('water_in', true), { injure: 'bruise', site: 'rightArm', severity: 1 }, { body: 'stress', delta: 4 }, until40(44, 12, 0)] },
        ] },
      { id: 'c40_mp_wood', label: 'Перенести дрова в дом, в сени', minutes: 75, activity: 'moderate', terminal: true, goto: 'c40_m_neighbor', ambientDuring: frost40,
        text: 'Охапка за охапкой. Сени забиты дровами до потолка. Если ночью нельзя будет выйти к поленнице, печь не погаснет.', effects: [set40('mp', 'wood'), w40('wood_in', true), until40(44, 12, 0)] },
    ] }),

  X({ id: 'c40_m_neighbor', title: 'Соседи', camp: yard14, ambient: frost40,
    text: [
      { when: flag('w.c37_neighbor_saved'), text: 'В полдень приходит жена соседа, которому ты остановил{m:|а} кровь. Приносит десяток яиц в платке и стоит у ворот, не зная, как сказать спасибо.' },
      { when: not(flag('w.c37_neighbor_saved')), text: 'В полдень приходит фрау Гердес с насыпи. Муж у неё лежачий, после удара. Она спрашивает, можно ли, если что, прибежать к вам ночью.' },
    ],
    actions: [
      { id: 'c40_mn_eggs', label: 'Взять яйца и позвать её на чай', when: flag('w.c37_neighbor_saved'), minutes: 60, terminal: true, goto: 'c40_m_brandt',
        text: 'Она пьёт чай и рассказывает: муж ходит с палкой, но ходит. «Wenn ihr nachts Hilfe braucht — wir sind da. Er kann schießen. Mit dem Bein oder ohne». Если ночью нужна помощь — мы тут. Он стреляет. С ногой или без.', effects: [set40('mn', 'eggs'), w40('neighbor_ally', true), until40(44, 13, 30)] },
      { id: 'c40_mn_yes', label: 'Сказать фрау Гердес: прибегайте, дверь откроем', when: not(flag('w.c37_neighbor_saved')), minutes: 45, terminal: true, goto: 'c40_m_brandt',
        text: 'Фрау Гердес кивает. «Mein Mann kann nicht laufen». Мой муж не может ходить. Она говорит это тихо, глядя в землю. Что это значит, понятно без слов.', effects: [set40('mn', 'yes'), w40('gerdes_door', true), until40(44, 13, 30)] },
      { id: 'c40_mn_move', label: 'Предложить перевезти их к вам заранее, на санях', when: not(flag('w.c37_neighbor_saved')), minutes: 60, terminal: true, goto: 'c40_m_brandt',
        text: 'Фрау Гердес плачет, потом соглашается. Вечером Оле или Дениз везёт старика Гердеса на санях через поле, укрытого двумя одеялами. Его кладут в комнате стариков. В доме ещё теснее.', effects: [set40('mn', 'move'), w40('gerdes_moved', true), until40(44, 13, 30)] },
    ] }),

  X({ id: 'c40_m_brandt', title: 'Лист', camp: yard14, ambient: frost40,
    text: [
      { text: 'Днём Лукас привозит от Брандта лист на ночь вторника: кто на каком ручье, где колокол, кто к кому бежит, если что.' },
      { when: v('w.c38_watch', 'no'), text: 'Ваш двор в листе дежурит только у себя. Так вы решили.' },
      { when: not(v('w.c38_watch', 'no')), text: 'Ваш двор — Зеве, от моста до лесополосы. С восьми вечера до рассвета.' },
    ],
    actions: [
      { id: 'c40_mbr_sign', label: 'Расписаться в листе', minutes: 30, terminal: true, goto: 'c40_m_wait', ambientDuring: frost40,
        text: 'Ты ставишь подпись. Лукас кивает и уезжает к следующему двору. Лист с вашим участком он оставляет на гвозде у двери.', effects: [set40('mbr', 'sign'), until40(44, 15, 0)] },
      { id: 'c40_mbr_ask', label: 'Спросить, кто дежурит у соседей справа и слева', minutes: 30, terminal: true, goto: 'c40_m_wait', ambientDuring: frost40,
        text: 'Лукас показывает на листе: справа Гердесы — некому; слева колония — Уте и Яннес. «Gerdes ist ein Loch», говорит он. У Гердесов дыра.', effects: [set40('mbr', 'ask'), w40('knows_gap', true), until40(44, 15, 0)] },
      { id: 'c40_mbr_flare', label: 'Попросить у Лукаса ракету: на случай, если колокол не услышат', minutes: 30, terminal: true, goto: 'c40_m_wait', ambientDuring: frost40,
        text: 'Лукас роется в кабине и отдаёт тебе одну красную ракету. «Nur wenn es brennt». Только если горит. Ты прячешь её в карман.', effects: [set40('mbr', 'flare'), { give: 'c38_flares' }, until40(44, 15, 0)] },
    ] }),

  X({ id: 'c40_m_wait', title: 'Ожидание', camp: kitchen14,
    text: [
      { when: v('w.c39_depot', 'one'), text: 'Тот, кто уехал на склад, ещё не вернулся. Хенрике то и дело выглядывает в окно.' },
      { when: v('w.c39_depot', 'none'), text: 'На склад вы не поехали. С дороги видно, как мимо идут телеги и машины, гружёные мешками.' },
      { text: 'Смеркается рано. С крыши течёт.' },
    ],
    actions: [
      { id: 'c40_mw_cook', label: 'Помогать Хенрике с ужином', when: henrike40, minutes: 90, terminal: true, goto: 'c40_mon_evening',
        text: 'Картошка, лук, остатки окорока. Хенрике варит на всех и ещё на троих. На всякий случай.', effects: [set40('mw', 'cook'), npc('henrike', 1), until40(44, 17, 30)] },
      { id: 'c40_mw_gate', label: 'Ждать у ворот', minutes: 90, terminal: true, goto: 'c40_mon_evening', ambientDuring: frost40,
        text: 'Ты стоишь у ворот, пока не начинают мёрзнуть ноги. Потом заходишь, греешься и выходишь снова. Дорога пустеет к вечеру.', effects: [set40('mw', 'gate'), until40(44, 17, 30)] },
      { id: 'c40_mw_sleep', label: 'Поспать днём: ночь вторника будет без сна', minutes: 90, activity: 'rest', terminal: true, goto: 'c40_mon_evening',
        text: 'Ты ложишься и засыпаешь сразу. Просыпаешься в сумерках, от голосов во дворе.', effects: [set40('mw', 'sleep'), { body: 'fatigue', delta: -10 }, until40(44, 17, 30)] },
    ] }),
];

