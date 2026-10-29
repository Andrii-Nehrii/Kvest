// Глава 1 — линия A, Buchholz in der Nordheide. Места (подъезд, двор, улица, магазин, заправка,
// мастерская, больница) работают в обоих участках: текст и действия зависят от времени и прошлого.
import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { aTail, buy, carHere, CONTACT_AFTER, driveAction, radioAction, radioOutcomes, SEG2 } from './common';

const S = (s: Scene) => s;
const PWR = 'w.power.buchholz';
const powerOn: Cond = { v: PWR, op: '!=', value: 'off' };
const powerOff: Cond = { v: PWR, op: '==', value: 'off' };
export const gerdHome: Cond = { npc: 'gerd', at: 'a_brockmann' };
export const gerdRaging: Cond = { all: [gerdHome, { any: [{ npc: 'gerd', status: 'infected' }, { npc: 'gerd', status: 'turned' }] }] };
const gerdTurned: Cond = { npc: 'gerd', status: 'turned' };
const ilseHere = (place: string): Cond => ({ npc: 'ilse', at: place });
const ilseBitten: Cond = { npc: 'ilse', status: 'injured' };
const brockDone: Cond = { flag: '$.brock_done' };
const evening: Cond = { after: at(10, 16, 30) };
const notSeg2: Cond = { not: SEG2 };
const denizHere: Cond = { npc: 'deniz', at: 'deniz_workshop' };
const keremInCar: Cond = { npc: 'kerem', at: 'a_car' };
/** Условие «Дениз на месте» добавляется ко всем разговорам с ним. */
const withDeniz = (a: ActionDef): ActionDef => ({ ...a, when: a.when ? { all: [denizHere, a.when] } : denizHere });

/** Укус через одежду: чем плотнее, тем меньше риск (WORLD_BIBLE §2.3). Значения — скрытые. */
export function biteArm(site: 'leftArm' | 'rightArm' | 'hands' = 'leftArm', severity: 1 | 2 | 3 = 2): Effect {
  if (site === 'hands') {
    return { if: { has: 'gloves' }, then: [{ injure: 'bite', site, severity, exposure: 0.6 }], else: [{ injure: 'bite', site, severity, exposure: 0.85 }] };
  }
  return {
    if: { has: 'winter_jacket' }, then: [{ injure: 'bite', site, severity, exposure: 0.35 }],
    else: [{ if: { has: 'hoodie' }, then: [{ injure: 'bite', site, severity, exposure: 0.6 }], else: [{ injure: 'bite', site, severity, exposure: 0.85 }] }],
  };
}

/** Двери Брокманов из подъезда и из квартиры A. Утренний визит (a_brockmann) — только из подъезда. */
export function brockDoorActions(withMorning: boolean): ActionDef[] {
  const list: ActionDef[] = [];
  if (withMorning) {
    list.push({ id: 'brock_knock', label: 'Постучать к Брокманам', minutes: 1, terminal: true, goto: 'a_brockmann',
      when: { all: [{ flag: '$.knock' }, gerdHome, { not: gerdRaging }, { not: { flag: '$.driving_brockmanns' } }] } });
  }
  list.push(
    { id: 'brock_scream', label: 'Броситься вниз, на крик', minutes: 1, terminal: true, goto: 'a_brock_attack', risky: true,
      when: { all: [{ flag: '$.scream' }, { not: brockDone }] } },
    { id: 'brock_late', label: 'Постучать к Брокманам', minutes: 1, terminal: true, goto: 'a_brock_attack', risky: true,
      when: { all: [gerdRaging, { not: { flag: '$.scream' } }, { not: brockDone }] } },
    { id: 'brock_ilse', label: 'Заглянуть к Ильзе', minutes: 2, terminal: true, goto: 'a_ilse_home',
      when: { all: [ilseHere('a_brockmann'), { not: gerdHome }] } },
  );
  return list;
}

/** Куда вернуться из машины — сцена места, где она стоит. */
const outOfCar: ActionDef[] = [
  { id: 'out_yard', label: 'Заглушить мотор и выйти', minutes: 1, terminal: true, goto: 'a_yard', when: { at: 'a_yard' } },
  { id: 'out_market', label: 'Выйти к магазину', minutes: 1, terminal: true, goto: 'a_market', when: { at: 'a_market' } },
  { id: 'out_gas', label: 'Выйти у заправки', minutes: 1, terminal: true, goto: 'a_gas', when: { at: 'a_gas' } },
  { id: 'out_deniz', label: 'Выйти у мастерской', minutes: 1, terminal: true, goto: 'a_deniz', when: { at: 'deniz_workshop' } },
  { id: 'out_hosp', label: 'Выйти на парковке больницы', minutes: 1, terminal: true, goto: 'a_hosp_lot', when: { at: 'a_hospital' } },
  { id: 'out_farm', label: 'Выйти у ворот хутора', minutes: 1, terminal: true, goto: 'a_farm_gate', when: { at: 'hof_luedemann' } },
];

const enterCar = (extra: Partial<ActionDef> = {}): ActionDef => ({
  id: 'car', label: 'Сесть в машину', minutes: 1, terminal: true, goto: 'a_drive',
  when: carHere, enabled: { has: 'car_keys' }, disabledReason: 'Ключи от машины остались дома', ...extra,
});

const tail = aTail;

export const aTownScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────── Подъезд (бывшая заглушка a_tbc — id сохранён ради сохранений) ─────────────
  S({
    id: 'a_tbc', for: 'A', chapter: 'ch1', location: 'a_stairs', title: 'Подъезд',
    text: [
      { when: { all: [{ flag: '$.driving_brockmanns' }, { not: { flag: '$.brock_in_car' } }] },
        text: 'Герд почти висит на тебе: горячий даже сквозь свитер, ноги заплетаются на каждой ступеньке. Ильзе спускается следом с сумкой и всё повторяет: «Langsam, Gerd, langsam». Внизу — дверь подъезда, за ней туман и твой Corsa в двадцати шагах.' },
      { when: { not: { flag: '$.driving_brockmanns' } },
        text: 'Подъезд. Пахнет мокрыми куртками, на почтовых ящиках — прошлогодняя записка про собрание жильцов. Лампа на лестнице не горит.' },
      { when: { all: [{ not: { flag: '$.driving_brockmanns' } }, gerdHome, { not: gerdRaging }] },
        text: 'Из-за двери Брокманов глухо бубнит Ильзе — успокаивает кого-то.' },
      { when: { all: [gerdRaging, { not: brockDone }, { not: gerdTurned }] },
        text: 'Из-за двери Брокманов — удары, будто в стену бросают что-то тяжёлое. Потом тишина. Неправильная.' },
      { when: { all: [gerdHome, gerdTurned] },
        text: 'За дверью Брокманов кто-то шаркает — туда и обратно, туда и обратно. Иногда — глухой удар в дверь, на уровне груди.' },
      { when: { all: [brockDone, { not: gerdTurned }, gerdHome] },
        text: 'Дверь Брокманов закрыта. За ней — тяжёлое, хриплое дыхание, которое слышно даже отсюда.' },
    ],
    actions: [
      { id: 'keys_up', label: 'Усадить Герда на ступеньку и сбегать за ключами от машины', minutes: 3, combinable: true, activity: 'moderate',
        when: { all: [{ flag: '$.driving_brockmanns' }, { not: { flag: '$.brock_in_car' } }, { not: { has: 'car_keys' } }] },
        text: 'Ты взлетаешь на второй этаж через ступеньку. Ключи — в миске у двери. Когда возвращаешься, Ильзе держит мужа за плечи, а он смотрит в стену и что-то шепчет.',
        effects: [{ pickup: 'car_keys', place: 'a_flat' }] },
      { id: 'to_car', label: 'Довести Герда до машины', minutes: 5, activity: 'moderate', terminal: true, goto: 'a_drive_hosp',
        when: { all: [{ flag: '$.driving_brockmanns' }, { not: { flag: '$.brock_in_car' } }] },
        enabled: { has: 'car_keys' }, disabledReason: 'Ключи от машины остались наверху',
        text: 'Дождь мелкий, холодный. Герд шарахается от фар проезжающей машины, как от удара. Вдвоём с Ильзе вы усаживаете его на заднее сиденье.',
        effects: [{ set: '$.brock_in_car', value: true }, { move: 'a_yard' }] },
      { id: 'yard', label: 'Выйти во двор, к машинам', minutes: 1, terminal: true, goto: 'a_yard', when: { not: { flag: '$.driving_brockmanns' } } },
      { id: 'street', label: 'Выйти на улицу', minutes: 1, terminal: true, goto: 'a_street', when: { not: { flag: '$.driving_brockmanns' } } },
      ...brockDoorActions(true).map((a) => ({ ...a, when: { all: [a.when!, { not: { flag: '$.driving_brockmanns' } }] } })),
      { id: 'listen', label: 'Прислушаться у двери Брокманов', minutes: 2, combinable: true, repeatable: true,
        when: { all: [brockDone, gerdHome] },
        outcomes: [
          { id: 'turned', when: gerdTurned, text: 'Шарканье. Удар. Шарканье. Ни слова, ни стона — только ногти скребут по дереву, очень низко. Ты отходишь от двери и понимаешь, что не дышал.', effects: [{ body: 'stress', delta: 6 }] },
          { id: 'raging', text: 'Хриплое дыхание, скрип пружин, потом долгий звук сквозь зубы — не крик и не плач. Герд не отвечает на своё имя.', effects: [{ body: 'stress', delta: 4 }] },
        ] },
      { id: 'up', label: 'Подняться к себе', minutes: 1, terminal: true, goto: 'a_wake', when: { not: { flag: '$.driving_brockmanns' } } },
      { id: 'ilse', label: 'Выслушать Ильзе', minutes: 1, terminal: true, goto: 'a_ilse',
        when: { all: [{ flag: '$.ilse_out' }, { not: { visited: 'a_ilse' } }, { not: { flag: '$.ignored_ilse' } }] } },
      ...tail(),
    ],
  }),

  // ───────────── Двор ─────────────
  S({
    id: 'a_yard', for: 'A', chapter: 'ch1', location: 'a_yard', title: 'Двор',
    text: [
      { when: { before: at(10, 9, 0) }, text: 'Двор: шесть машин в каплях, мусорные баки, мокрый газон. Так тихо, что слышно, как капает с водостока. Твой Corsa — на своём месте, у бака для бумаги.' },
      { when: { all: [{ before: at(10, 7, 40) }, { not: { flag: '$.police7' } }] }, text: 'У соседнего, седьмого, дома — скорая с распахнутыми задними дверями. Мигалка выключена, в салоне тусклый свет. Рядом никого.' },
      { when: { all: [{ flag: '$.police7' }, { before: at(10, 9, 0) }] }, text: 'У седьмого дома теперь две машины — скорая и полицейский универсал. Синие отсветы ползут по мокрым стенам.' },
      { when: { all: [{ after: at(10, 9, 0) }, { not: evening }] }, text: 'Двор поредел: двух машин уже нет, на их местах — сухие прямоугольники асфальта. У седьмого дома пусто, только латексная перчатка прилипла к бордюру.' },
      { when: evening, text: 'Во дворе темно. Окна вокруг светятся через одно — или не светятся вовсе. Кто-то в доме напротив задёрнул шторы и подпёр их чем-то изнутри.' },
      { when: { all: [evening, { after: at(10, 18, 0) }] }, text: 'Издалека, со стороны центра, — сирена. Потом другая. Потом — тишина, в которой слышно собственные шаги.' },
    ],
    actions: [
      { id: 'ambulance', label: 'Подойти к скорой у седьмого дома', minutes: 2, terminal: true, goto: 'a_ambulance',
        when: { all: [{ before: at(10, 8, 30) }, { not: { visited: 'a_ambulance' } }] } },
      enterCar(),
      { id: 'street', label: 'Выйти на улицу', minutes: 1, terminal: true, goto: 'a_street' },
      { id: 'back', label: 'Вернуться в подъезд', minutes: 1, terminal: true, goto: 'a_tbc' },
      { id: 'ilse', label: 'Обернуться к Ильзе', minutes: 1, terminal: true, goto: 'a_ilse',
        when: { all: [{ flag: '$.ilse_out' }, { not: { visited: 'a_ilse' } }, { not: { flag: '$.ignored_ilse' } }] } },
      { id: 'ilse_no', label: 'Сделать вид, что торопишься, и не останавливаться', minutes: 2, combinable: true,
        when: { all: [{ flag: '$.ilse_out' }, { not: { visited: 'a_ilse' } }, { not: { flag: '$.ignored_ilse' } }] },
        text: '— Bitte! — летит тебе в спину. Ты не оборачиваешься. Хлопает дверь подъезда.',
        effects: [{ set: '$.ignored_ilse', value: true }, { npc: 'ilse', trust: -12, remember: '$:ignored' }, { body: 'stress', delta: 5 }] },
      ...brockDoorActions(false).filter((a) => a.id === 'brock_scream'),
      ...tail(),
    ],
  }),

  // ───────────── Скорая у седьмого дома ─────────────
  S({
    id: 'a_ambulance', for: 'A', chapter: 'ch1', location: 'a_yard', title: 'Скорая',
    onEnter: [{ learn: 'f_ambulance' }],
    text: [
      { text: 'Скорая стоит криво, одним колесом на бордюре. Мотор выключен, носилки выдвинуты наполовину. На подножке — смазанный бурый след. Рация на панели шипит: «…drei-achtzig-eins, kommen… drei-achtzig-eins…» — и никто не отвечает.' },
      { text: 'Дверь седьмого дома приоткрыта. Наверху — глухие удары, будто кто-то бьёт в стену. Потом мужской крик, короткий, и снова удары.', when: { not: { flag: '$.police7' } } },
      { text: 'К дому подлетает полицейский универсал. Двое в жилетах бегут в подъезд, третий говорит в рацию и машет тебе рукой: отойди.', when: { flag: '$.police7' } },
    ],
    actions: [
      { id: 'listen', label: 'Послушать рацию', minutes: 3, combinable: true,
        text: 'Сквозь треск — женский голос диспетчера, быстрый, без интонаций: «…alle verfügbaren Kräfte… Buchholz-Nord… Eigenschutz beachten, ich wiederhole, Eigenschutz…» Потом длинный писк, и тишина.',
        effects: [{ learn: 'f_dispatch' }] },
      { id: 'take', label: 'Взять из салона перчатки и бинты', minutes: 2, combinable: true, risky: true,
        text: 'На полке — коробка одноразовых перчаток, стерильные салфетки, бинты в упаковках. Ты берёшь сколько влезает в карманы. Никто не видит. От этого не легче.',
        effects: [{ give: 'nitrile_gloves', qty: 4 }, { give: 'bandages' }, { set: '$.looted_ambulance', value: true }, { body: 'stress', delta: 3 }] },
      { id: 'shout', label: 'Крикнуть в подъезд, нужна ли помощь', minutes: 2, combinable: true, when: { not: { flag: '$.police7' } },
        text: '— Hallo! Brauchen Sie Hilfe? — Сверху, сорванным голосом: «Bleiben Sie draußen! Rufen Sie die Polizei! Hundertzehn!» Удары на секунду стихают — и начинаются снова, чаще.',
        effects: [{ set: '$.heard_house7', value: true }] },
      { id: 'call110', label: 'Попробовать дозвониться в полицию', minutes: 3, combinable: true, when: { all: [{ phoneUsable: true }, { not: { flag: '$.police7' } }] },
        outcomes: [
          { id: 'through', when: { network: 'voice' }, text: 'После долгих гудков — усталый мужской голос. Ты называешь адрес. «Ist bekannt. Kollegen sind unterwegs. Gehen Sie bitte nicht hinein.»', effects: [{ charge: 'phone', delta: -1 }, { set: '$.called_police', value: true }] },
          { id: 'busy', text: '«Netz besetzt». Ещё раз — то же самое.', effects: [{ charge: 'phone', delta: -1 }] },
        ] },
      { id: 'go_in', label: 'Подняться в седьмой дом', minutes: 2, terminal: true, goto: 'a_house7', risky: true, when: { not: { flag: '$.police7' } } },
      { id: 'back', label: 'Отойти к своему двору', minutes: 1, terminal: true, goto: 'a_yard' },
    ],
  }),
  S({
    id: 'a_house7', for: 'A', chapter: 'ch1', location: 'a_house7', title: 'Седьмой дом',
    onEnter: [{ body: 'stress', delta: 8 }],
    text: [
      { text: 'Второй этаж. На ступеньках сидит санитар — молодой, рыжий, в красной куртке. Прижимает к кисти полотенце, сквозь него проступает кровь. Его напарница, невысокая, держит дверь квартиры обеими руками, упираясь ногой в косяк. Дверь вздрагивает от ударов изнутри. За ней хрипит и воет мужской голос — без слов.' },
      { text: '— Он нас укусил, — говорит рыжий, не поднимая глаз. — Хольгер. Сорок лет его знаю, с детства. Жар под сорок, а силы — как у быка.', when: { not: { flag: '$.police7' } } },
      { text: 'Внизу хлопает дверь, по лестнице грохочут ботинки. «Polizei! Zurücktreten!» Двое в жилетах оттесняют тебя к стене.', when: { flag: '$.police7' } },
    ],
    actions: [
      { id: 'hold', label: 'Подменить её у двери', minutes: 10, combinable: true, activity: 'heavy', when: { not: { flag: '$.police7' } },
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 2, uses: ['strength'] },
            text: 'Ты наваливаешься плечом. Удары изнутри отдаются в зубы, но дверь держится. Санитарка садится на ступеньку рядом с напарником и впервые выдыхает. — Danke. Вы… не трогайте его кровь, ладно? Мы не знаем, что это.',
            effects: [{ learn: 'f_paramedic_bitten' }, { set: '$.helped_house7', value: true }] },
          { id: 'slip', text: 'Дверь рывком приоткрывается на ладонь — в щели мелькает багровое лицо, оскаленные зубы. Ты с рёвом захлопываешь её обратно. Пальцы целы. Сердце колотится в горле.',
            effects: [{ learn: 'f_paramedic_bitten' }, { body: 'stress', delta: 10 }, { set: '$.helped_house7', value: true }] },
        ] },
      { id: 'bandage', label: 'Перевязать руку санитару', minutes: 8, combinable: true, when: { hasTag: 'dressing' },
        text: 'Ты разматываешь полотенце. Полукруг следов зубов на тыльной стороне кисти, неглубокий, но кровит. Ты бинтуешь как умеешь. Санитар смотрит на тебя с удивлением — будто давно никто не делал для него чего-то простого.',
        effects: [{ takeTag: 'dressing' }, { learn: 'f_paramedic_bitten' }, { if: { not: { has: 'nitrile_gloves' } }, then: [{ body: 'stress', delta: 4 }] }] },
      { id: 'ask', label: 'Спросить, что с этим Хольгером', minutes: 4, combinable: true, when: { not: { flag: '$.police7' } },
        text: '— С субботы гриппует, — санитарка не отпускает дверь. — Ночью жена вызвала: бредит. Мы зашли — он сразу на нас. Не узнаёт никого. Это уже третий такой вызов за ночь по округу, понимаете? Третий.',
        effects: [{ learn: 'f_paramedic_bitten' }, { learn: 'f_third_call' }] },
      { id: 'leave', label: 'Уйти вниз', minutes: 2, terminal: true, goto: 'a_yard',
        text: 'Ты спускаешься. Удары наверху продолжаются ещё долго, их слышно даже во дворе.' },
    ],
  }),

  // ───────────── Машина (откуда угодно) ─────────────
  S({
    id: 'a_drive', for: 'A', chapter: 'ch1', title: 'За рулём', ambient: { outdoor: false, tempC: 17 },
    text: [
      { when: { not: { visited: 'a_drive', times: 2 } }, text: 'Салон выстыл, стёкла запотели изнутри. Ты поворачиваешь ключ — Corsa кашляет и заводится со второго раза. Печка сначала дует холодом, потом теплее.' },
      { when: { visited: 'a_drive', times: 2 }, text: 'Ты за рулём. Дворники отбивают ритм, печка гудит. Стрелка бензина — там, где была, только чуть ниже.' },
      { when: { all: [powerOff, { not: { after: at(10, 20, 15) } }] }, text: 'Светофоры в городе мёртвые; перекрёстки проезжают наугад, по очереди, кто кого пропустит.' },
    ],
    actions: [
      radioAction(),
      { id: 'fuel', label: 'Посмотреть, сколько бензина', minutes: 1, combinable: true,
        text: 'Стрелка — чуть выше четверти. Литров четырнадцать: пара сотен километров по трассе, если без пробок. На заправку ты собирался ещё в пятницу.',
        effects: [{ learn: 'f_fuel_a' }] },
      { id: 'charge', label: 'Поставить телефон заряжаться от прикуривателя', minutes: 1, combinable: true,
        when: { all: [{ hasTag: 'charger' }, { not: { flag: '$.car_charging' } }] },
        text: 'Кабель еле дотягивается до гнезда. Значок молнии на экране — маленькая победа.',
        effects: [{ set: '$.car_charging', value: true }, { charge: 'phone', delta: 3 }] },
      { id: 'glovebox', label: 'Порыться в бардачке', minutes: 2, combinable: true,
        text: 'Скребок для стёкол, салфетки, сервисная книжка, бумажная карта области двухлетней давности — и в конверте «на всякий случай» двадцать евро. Ты и забыл про них.',
        effects: [{ give: 'road_map' }, { give: 'cash_eur', qty: 20 }] },
      driveAction('to_home', 'Поехать домой, во двор', 4, 10, 'a_yard', 'a_yard', { when: { not: { at: 'a_yard' } } }),
      driveAction('to_market', 'Поехать к супермаркету у развязки', 3, 9, 'a_market', 'a_market', { when: { not: { at: 'a_market' } } }),
      driveAction('to_gas', 'Поехать на заправку у выезда на трассу', 4, 10, 'a_gas', 'a_gas', { when: { not: { at: 'a_gas' } } }),
      driveAction('to_deniz', 'Поехать в мастерскую Айдына в промзоне', 5, 12, 'deniz_workshop', 'a_deniz',
        { when: { not: { at: 'deniz_workshop' } }, hint: 'Дениз Айдын весной менял тебе тормозные колодки' }),
      driveAction('to_hosp', 'Съездить к больнице — посмотреть, что там', 3, 9, 'a_hospital', 'a_hosp_lot', { when: { not: { at: 'a_hospital' } } }),
      driveAction('to_farm', 'Поехать к хутору Людеманов под Jesteburg', 8, 15, 'hof_luedemann', 'a_farm_gate',
        { when: { all: [{ knows: 'f_farm' }, { not: { at: 'hof_luedemann' } }] } }),
      ...outOfCar,
      driveAction('to_hamburg', 'Ехать в Гамбург — к {partner.dat}', 4, 8, 'a_road', 'a_road1',
        { when: { all: [{ after: CONTACT_AFTER }, notSeg2] }, risky: true }),
      driveAction('north_b', 'Ехать в Гамбург — к {partner.dat}', 4, 8, 'a_road', 'a2_road_north',
        { when: { all: [SEG2, { v: 'w.plan_a', op: '==', value: 'to_b' }] } }),
      driveAction('north_h', 'Ехать в Harburg — к вокзалу, на встречу', 4, 8, 'a_road', 'a2_road_north',
        { when: { all: [SEG2, { v: 'w.plan_a', op: '==', value: 'harburg' }] } }),
      driveAction('to_hamburg2', 'Всё-таки ехать в Гамбург — к {partner.dat}', 4, 8, 'a_road', 'a2_road_north',
        { when: { all: [SEG2, { v: 'w.plan_a', op: '==', value: 'wait' }] }, risky: true,
          effects: [{ set: 'w.plan_a', value: 'to_b' }, { set: '$.went_anyway', value: true }] }),
      ...tail(),
    ],
  }),

  // ───────────── Улица ─────────────
  S({
    id: 'a_street', for: 'A', chapter: 'ch1', location: 'a_street', title: 'Улица',
    text: [
      { when: { before: at(10, 9, 0) }, text: 'Улица в тумане. Окна темны по всему кварталу. У пекарни на углу в витрине горит свеча, у двери — человек пять. Напротив сосед в халате курит под козырьком и поднимает телефон то выше, то ниже — ищет сеть.' },
      { when: { all: [{ after: at(10, 9, 0) }, { before: at(10, 11, 50) }] }, text: 'На улице больше людей и машин: кто-то грузит багажник, кто-то стоит у калитки с телефоном в руке. Пекарня всё ещё торгует при свечах.' },
      { when: { all: [{ after: at(10, 11, 50) }, { not: evening }] }, text: 'Фонари зажглись прямо среди дня — дали ток. Из открытого окна орёт телевизор. Двое соседей спорят у машины, куда ехать: «zu meiner Schwester nach Celle» — «и что, в Celle лучше?»' },
      { when: evening, text: 'Улица пуста. Ставни, задёрнутые шторы. У пекарни на двери — лист бумаги: «Geschlossen bis auf Weiteres». Где-то лает собака, долго, не переставая.' },
    ],
    actions: [
      { id: 'neighbor', label: 'Поговорить с соседом в халате', minutes: 6, combinable: true, when: { before: at(10, 11, 50) },
        text: '— Сеть? Да какая сеть, — сосед машет телефоном. — Брат из Harburg написал в пять: ночью у них стреляли. А в Гамбурге, говорят, бешенство. Я из-под крана больше не пью — вдруг вода. — Он затягивается. — Ты тоже никуда не дозвонился?',
        effects: [{ learn: 'f_rumor_water', kind: 'rumor' }, { learn: 'f_rumor_harburg', kind: 'rumor' }] },
      { id: 'bakery', label: 'Встать в очередь в пекарню', minutes: 12, combinable: true,
        when: { all: [{ before: at(10, 15, 0) }, { not: { visited: 'a_street', times: 6 } }] },
        enabled: { has: 'cash_eur', qty: 4 }, disabledReason: 'Нужны наличные: терминал без тока не работает',
        text: 'Пекарь печёт в газовой печи и продаёт что есть — вчерашний хлеб и горячие булки — за наличные, без сдачи. В очереди говорят о школах в Гамбурге и о том, что «мост закрыли».',
        effects: [{ take: 'cash_eur', qty: 4 }, { give: 'bread' }, { give: 'sandwich', qty: 2 }] },
      { id: 'walk_market', label: 'Дойти пешком до супермаркета', minutes: 15, move: true, terminal: true, goto: 'a_market',
        when: { not: evening }, effects: [{ move: 'a_market' }] },
      { id: 'yard', label: 'Пройти во двор', minutes: 1, terminal: true, goto: 'a_yard' },
      { id: 'stairs', label: 'Зайти в подъезд', minutes: 1, terminal: true, goto: 'a_tbc' },
      ...brockDoorActions(false).filter((a) => a.id === 'brock_scream'),
      ...tail(),
    ],
  }),

  // ───────────── Супермаркет ─────────────
  S({
    id: 'a_market', for: 'A', chapter: 'ch1', location: 'a_market', title: 'Супермаркет',
    text: [
      { when: { before: at(10, 8, 0) }, text: 'Супермаркет у развязки ещё закрыт — откроется в восемь. У стеклянных дверей уже очередь, человек двадцать, с тележками и сумками на колёсиках. Внутри темно: тока нет и здесь.' },
      { when: { all: [{ after: at(10, 8, 0) }, powerOff] }, text: 'Двери открыты наполовину, внутри полумрак — горят только аварийные лампы. Охранник пропускает по десять человек. Табличка от руки: «NUR BARZAHLUNG — Kartenzahlung nicht möglich».' },
      { when: { all: [powerOn, { not: evening }] }, text: 'Свет в зале горит. Табличка «Kartenzahlung wieder möglich» — и очередь вдвое длиннее, до самой парковки.' },
      { when: evening, text: 'Супермаркет закрыт. Стеклянная дверь треснула паутиной, внутри видно перевёрнутую тележку. На парковке пусто, только пакет катается по асфальту.' },
    ],
    actions: [
      { id: 'queue', label: 'Встать в очередь', minutes: 40, combinable: true, activity: 'light', terminal: true, goto: 'a_market_in',
        when: { all: [{ not: evening }, { not: { visited: 'a_market_in', times: 2 } }] },
        text: 'Очередь движется рывками. Впереди женщина звонит кому-то снова и снова. Сзади кто-то читает вслух с телефона: «…в Гамбурге закрыли мосты…». Через сорок минут охранник кивает тебе: заходи.' },
      { id: 'ask', label: 'Спросить у очереди, что слышно', minutes: 5, combinable: true, when: { not: evening },
        outcomes: [
          { id: 'late', when: { after: at(10, 11, 40) }, text: 'Говорят, поезда на Гамбург встали совсем. Что Сенат что-то скрывает. Что в Harburg кто-то видел военных — «да не военных, а полицию в масках».', effects: [{ learn: 'f_rail_stopped', kind: 'rumor' }] },
          { id: 'mid', when: { after: at(10, 8, 30) }, text: '«Мосты в Гамбурге закрыли — кого-то там ловят». «Да какое ловят, у них в больницах эпидемия». «Ага, а нам скажут в последний момент».', effects: [{ learn: 'f_bridges_closed', kind: 'rumor' }] },
          { id: 'early', text: 'Пожилой мужчина впереди уверен: подстанцию взорвали. Женщина за ним — что просто ветер. Обсуждают, где брать воду, если отключат и её.' },
        ] },
      enterCar(),
      { id: 'walk_home', label: 'Пойти домой пешком', minutes: 15, move: true, terminal: true, goto: 'a_street', when: { not: carHere }, effects: [{ move: 'a_street' }] },
      ...tail(),
    ],
  }),
  S({
    id: 'a_market_in', for: 'A', chapter: 'ch1', location: 'a_market', title: 'В магазине',
    text: [
      { text: 'Внутри пахнет мокрыми куртками и бананами. Люди толкают тележки быстро и молча, как на пожаре. Полки с водой почти пусты, у консервов — давка. На стеллаже с водой приклеен лист: «Max. 2 Flaschen pro Person».' },
      { when: { all: [{ after: at(10, 9, 30) }, { not: { flag: '$.market_scuffle' } }] }, text: 'У последней упаковки воды мужчина в рабочей куртке вырывает её из рук пожилой женщины. Она не отпускает, её тянет за упаковкой, и она вот-вот упадёт.' },
    ],
    actions: [
      buy('water', 'Взять воды — две бутылки по 1,5 л, больше не дают', 2, PWR, [{ give: 'water_15', qty: 2 }]),
      buy('cans', 'Консервы и макароны', 9, PWR, [{ give: 'canned_ravioli', qty: 2 }, { give: 'canned_beans', qty: 2 }, { give: 'pasta' }]),
      buy('batteries', 'Батарейки и свечи', 7, PWR, [{ give: 'batteries_aa', qty: 2 }, { give: 'candles' }]),
      buy('radio', 'Радиоприёмник на батарейках с полки спецпредложений — последний', 15, PWR, [{ give: 'radio', charge: 100 }],
        { when: { not: { hasTag: 'radio' } } }),
      buy('meds', 'Ибупрофен и пластыри у кассы', 6, PWR, [{ give: 'ibuprofen', qty: 10 }, { give: 'plasters' }]),
      buy('snacks', 'Шоколад, орехи, хлебцы', 5, PWR, [{ give: 'chocolate', qty: 2 }, { give: 'crackers' }]),
      { id: 'intervene', label: 'Вмешаться: «Lassen Sie sie los!»', minutes: 3, combinable: true, risky: true,
        when: { all: [{ after: at(10, 9, 30) }, { not: { flag: '$.market_scuffle' } }] },
        outcomes: [
          { id: 'talk', check: { traits: ['persuasion', 'strength'], difficulty: 4 },
            text: 'Ты встаёшь между ними — на голову выше мужика в куртке. Он смотрит на тебя, на твои плечи, сплёвывает и уходит к другой полке. Женщина прижимает воду к груди. — Danke, junger Mann. Danke.',
            effects: [{ set: '$.market_scuffle', value: 'won' }, { body: 'stress', delta: 4 }] },
          { id: 'shove', text: 'Мужик толкает тебя в грудь, ты врезаешься плечом в стеллаж — банки сыплются на пол. Пока вы стоите друг против друга, охранник уводит его к выходу. Плечо ноет. Женщина уже исчезла в толпе — вместе с водой.',
            effects: [{ injure: 'bruise', site: 'rightArm', severity: 1 }, { set: '$.market_scuffle', value: 'shoved' }] },
        ] },
      { id: 'ignore', label: 'Отвернуться — не твоё дело', minutes: 1, combinable: true,
        when: { all: [{ after: at(10, 9, 30) }, { not: { flag: '$.market_scuffle' } }] },
        text: 'За спиной что-то падает, вскрикивает женщина. Ты не оборачиваешься.',
        effects: [{ set: '$.market_scuffle', value: 'ignored' }, { body: 'stress', delta: 3 }] },
      { id: 'steal', label: 'В полутьме сунуть пару банок в рюкзак, не заплатив', minutes: 3, combinable: true, risky: true,
        when: { all: [powerOff, { hasTag: 'bag' }, { not: { flag: '$.stole_market' } }] },
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'agility'], difficulty: 5 },
            text: 'Две банки равиоли и шоколад исчезают в рюкзаке. Никто не смотрит — все смотрят на полки.',
            effects: [{ give: 'canned_ravioli', qty: 2 }, { give: 'chocolate' }, { set: '$.stole_market', value: true }, { body: 'stress', delta: 4 }] },
          { id: 'caught', text: 'Рука охранника ложится тебе на плечо. «Rucksack auf.» Банки возвращаются на полку, тебя выводят под взглядами очереди. Обратно не пустят.',
            effects: [{ set: '$.stole_market', value: 'caught' }, { body: 'stress', delta: 10 }], goto: 'a_market' },
        ] },
      { id: 'out', label: 'Пройти к кассе и выйти', minutes: 15, terminal: true, goto: 'a_market',
        text: 'Кассирша считает при свете фонарика на лбу, медленно и вслух. За тобой кто-то вздыхает так, будто ждёт уже сутки.' },
    ],
  }),

  // ───────────── Заправка ─────────────
  S({
    id: 'a_gas', for: 'A', chapter: 'ch1', location: 'a_gas', title: 'Заправка',
    text: [
      { when: powerOff, text: 'Заправка у выезда на трассу: навес, шесть колонок — все мёртвые, дисплеи пустые. У колонок стоят машины, водители курят под дождём и ругаются. В магазинчике горит фонарь на батарейках, продавец торгует за наличные.' },
      { when: { all: [powerOn, { not: evening }] }, text: 'Колонки ожили. Очередь машин тянется на улицу и дальше, до кольца. Над кассой — лист: «Max. 20 Liter pro Fahrzeug». Люди в очереди не выходят из машин — боятся потерять место.' },
      { when: { all: [powerOn, evening] }, text: 'Заправка закрыта: шланги сняты, на колонках — пакеты, примотанные скотчем. На стекле магазина: «Kein Benzin mehr».' },
    ],
    actions: [
      { id: 'clerk', label: 'Спросить продавца, когда дадут ток', minutes: 5, combinable: true, when: powerOff,
        text: '— Да кто ж знает. Говорят, подстанция, к обеду, может. А без тока насосы не качают — бензин в земле, а толку ноль. — Он понижает голос. — Если прям горит — Айдын в промзоне держит канистры. Но он не всем продаёт.',
        effects: [{ learn: 'f_gas_no_power' }, { learn: 'f_deniz_petrol' }] },
      buy('can', 'Купить пустую канистру на 10 литров', 15, PWR, [{ give: 'can_petrol_10' }], { when: { not: { has: 'can_petrol_10' } } }),
      buy('map', 'Купить бумажную карту области', 7, PWR, [{ give: 'road_map' }], { when: { not: { hasTag: 'map' } } }),
      buy('food', 'Взять воды и бутербродов в магазинчике', 6, PWR, [{ give: 'water_05', qty: 2 }, { give: 'sandwich' }], { when: { not: evening } }),
      { id: 'queue', label: 'Встать в очередь к колонке и залить двадцать литров', minutes: 45, combinable: true, activity: 'light',
        when: { all: [powerOn, { not: evening }, carHere, { not: { flag: '$.filled_up' } }] },
        enabled: { any: [{ has: 'bank_card' }, { has: 'cash_eur', qty: 40 }] }, disabledReason: 'Нужна карта или 40 € наличными',
        text: 'Сорок пять минут машина за машиной. Впереди двое чуть не дерутся из-за того, кто влез. Наконец — пистолет в бак, щелчок, цифры бегут. Ровно двадцать литров, ни каплей больше: колонку отсекает касса.',
        effects: [{ refuel: 'opel_corsa', liters: 20 }, { set: '$.filled_up', value: true },
          { if: { has: 'bank_card' }, then: [], else: [{ take: 'cash_eur', qty: 40 }] }] },
      { id: 'fill_can', label: 'Наполнить канистру', minutes: 5, combinable: true,
        when: { all: [powerOn, { not: evening }, { has: 'can_petrol_10' }, { flag: '$.filled_up' }, { not: { flag: '$.filled_can' } }] },
        enabled: { any: [{ has: 'bank_card' }, { has: 'cash_eur', qty: 20 }] }, disabledReason: 'Нужна карта или 20 € наличными',
        text: 'Кассир морщится — «пятнадцать литров на машину, а канистры…» — но пропускает: десять литров в канистру.',
        effects: [{ fillCan: 'can_petrol_10', liters: 10 }, { set: '$.filled_can', value: true },
          { if: { has: 'bank_card' }, then: [], else: [{ take: 'cash_eur', qty: 20 }] }] },
      enterCar(),
      ...tail(),
    ],
  }),

  // ───────────── Мастерская Дениза ─────────────
  S({
    id: 'a_deniz', for: 'A', chapter: 'ch1', location: 'deniz_workshop', title: 'Мастерская Айдына',
    onEnter: [{ if: denizHere, then: [{ set: '$.met.deniz', value: true }] }],
    text: [
      { when: { all: [denizHere, { not: { visited: 'a_deniz', times: 2 } }] }, text: 'Промзона на краю города: склады, шиномонтаж, мойка с выбитым светом. У бокса Айдына ворота подняты на метр, внутри тарахтит генератор и горит переноска. Дениз выходит на звук мотора — рабочая куртка, ключ в руке — и не сразу узнаёт тебя через лобовое стекло.' },
      { when: { all: [denizHere, { not: { visited: 'a_deniz', times: 2 } }] }, text: '— А. Corsa. Колодки, — он не улыбается. — Чего тебе?' },
      { when: { all: [denizHere, { visited: 'a_deniz', times: 2 }, { not: { npc: 'kerem', at: 'deniz_workshop' } }, { not: evening }] }, text: 'Дениз в боксе, у верстака. Генератор тарахтит. На тебя он смотрит уже без прежней настороженности — но и без радости.' },
      { when: { all: [denizHere, { npc: 'kerem', at: 'deniz_workshop' }] }, text: 'Керем сидит на перевёрнутом ящике с кружкой чая. Дениз то и дело кладёт ему руку на плечо, будто проверяет, что брат настоящий.' },
      { when: { all: [denizHere, evening, { visited: 'a_deniz', times: 2 }] }, text: 'Ворота опущены почти до земли, свет внутри приглушён. Ты стучишь — Дениз открывает не сразу.' },
      { when: { all: [{ not: denizHere }, { npc: 'deniz', at: 'hof_luedemann' }] }, text: 'Ворота мастерской опущены и заперты на замок. Мелом на железе крупно: «Bin bei H. — D.»' },
      { when: { all: [{ not: denizHere }, { not: { npc: 'deniz', at: 'hof_luedemann' } }] }, text: 'Ворота мастерской опущены и заперты. Мелом на железе: «Suche K. in Harburg. Bin zurück. D.» Генератор молчит.' },
    ],
    actions: [
      ...([
        { id: 'news', label: 'Спросить, что он слышал', minutes: 8, combinable: true,
          text: '— Брат у меня в Harburg, Керем. Пишет раз в час, когда сеть ловит. Ночью у Phoenix-центра стреляли, полиция. Сказал — выберется ко мне, как сможет. Машину ему вчера разбили. — Дениз вытирает руки. — Жду.',
          effects: [{ learn: 'f_kerem' }, { learn: 'f_rumor_harburg' }, { npc: 'deniz', trust: 3 }] },
        { id: 'kerem_bring', label: 'Привести Керема к брату', minutes: 10, combinable: true, when: keremInCar,
          text: 'Дениз видит брата через стекло — и роняет ключ. Они стоят обнявшись посреди бокса долго, так долго, что ты отворачиваешься к машине. Потом Дениз подходит к тебе. — Проси что хочешь, — говорит он. — Я серьёзно.',
          effects: [{ npc: 'kerem', moveTo: 'deniz_workshop' }, { npc: 'deniz', trust: 35, remember: '$:brought_kerem' }, { set: '$.brought_kerem', value: true }] },
        { id: 'note', label: 'Отдать Денизу записку от Керема', minutes: 3, combinable: true, when: { has: 'kerem_note' },
          text: 'Дениз читает записку, складывает, читает снова. «Komm nicht». — Конечно, не поеду, — говорит он таким голосом, что ясно: поедет.',
          effects: [{ take: 'kerem_note' }, { npc: 'deniz', trust: 12, remember: '$:saw_kerem' }, { set: '$.told_deniz', value: true }] },
        { id: 'petrol', label: 'Спросить, нет ли у него бензина', minutes: 3, combinable: true,
          when: { not: { flag: '$.deniz_can' } },
          text: '— Бензина — одна канистра, десять литров. Остальное — дизель, тебе он ни к чему: зальёшь — убьёшь мотор. — Он смотрит на тебя оценивающе. — Канистру не продаю. Пока.',
          effects: [{ set: '$.deniz_petrol_known', value: true }, { learn: 'f_deniz_petrol' }] },
        { id: 'buy', label: 'Предложить сорок евро за канистру', minutes: 4, requiresDone: ['petrol'], combinable: true,
          when: { not: { flag: '$.deniz_can' } }, enabled: { any: [{ has: 'cash_eur', qty: 40 }, { npc: 'deniz', trust: ['>=', 25] }] }, disabledReason: 'Нужно 40 € наличными',
          outcomes: [
            { id: 'trust', when: { npc: 'deniz', trust: ['>=', 25] }, text: '— Убери деньги, — Дениз ставит канистру к твоим ногам. — Ты мне помог. Сочтёмся.',
              effects: [{ give: 'can_petrol_10', fuel: 10 }, { set: '$.deniz_can', value: true }, { npc: 'deniz', trust: 3 }] },
            { id: 'deal', check: { traits: ['persuasion'], difficulty: 5, mods: [{ when: { npc: 'deniz', trust: ['>=', 10] }, bonus: 2 }] },
              text: 'Дениз долго молчит. Потом берёт деньги, пересчитывает и кивает на канистру у стены. — Только никому не говори, где взял.',
              effects: [{ take: 'cash_eur', qty: 40 }, { give: 'can_petrol_10', fuel: 10 }, { set: '$.deniz_can', value: true }] },
            { id: 'no', text: '— Деньги скоро будут бумагой, — говорит Дениз. — Бензин — нет. Не обижайся.', effects: [{ npc: 'deniz', trust: -2 }] },
          ] },
        { id: 'help', label: 'Предложить помочь — у него явно полно работы', minutes: 50, combinable: true, activity: 'heavy',
          when: { not: { flag: '$.helped_deniz' } },
          text: 'Дениз молча показывает: шины — внутрь, стопками; окно конторы — закрыть стальным листом; ворота — подпереть балкой. Вы работаете почти час, не разговаривая. Потом он протягивает тебе бутылку воды и впервые называет по имени.',
          effects: [{ set: '$.helped_deniz', value: true }, { npc: 'deniz', trust: 22, remember: '$:helped' }, { body: 'thirst', delta: -15 }] },
        { id: 'farm', label: 'Спросить, куда он сам денется, если станет совсем плохо', minutes: 6, combinable: true,
          when: { all: [{ not: { knows: 'f_farm' } }, { any: [{ npc: 'deniz', trust: ['>=', 15] }, { flag: '$.helped_deniz' }] }] },
          text: '— Есть хутор под Jesteburg. Людеманы. Я Хенрике трактор чиню десятый год. Колодец, печка на дровах, бак дизеля на триста литров, генератор, куры, картошки полный погреб. — Он пожимает плечами. — Хенрике кого попало не пустит. Меня — пустит. Может, и того, за кого я скажу.',
          effects: [{ learn: 'f_farm' }, { npc: 'deniz', trust: 3 }] },
        { id: 'hamburg', label: 'Сказать, что, может, поедешь в Гамбург — через Harburg', minutes: 3, combinable: true,
          when: { all: [{ after: CONTACT_AFTER }, { knows: 'f_kerem' }, { not: { flag: '$.kerem_favor' } }, { not: { npc: 'kerem', at: 'deniz_workshop' } }, { not: keremInCar }] },
          text: 'Дениз впервые смотрит на тебя по-другому. — Через Harburg? Заедешь к Керему? Это у вокзала, Schlossmühlendamm, третий этаж, табличка «Aydın». Он не отвечает с девяти. — Он пишет адрес на обрывке чека. — Я в долгу не останусь.',
          effects: [{ set: '$.kerem_favor', value: true }, { npc: 'deniz', trust: 5, remember: '$:kerem_favor' }] },
        { id: 'kerem_news', label: 'Рассказать, что был у Керема', minutes: 4, combinable: true,
          when: { all: [{ flag: '$.saw_kerem' }, { not: { flag: '$.told_deniz' } }, { not: { npc: 'kerem', at: 'deniz_workshop' } }, { not: keremInCar }] },
          text: 'Ты пересказываешь — разбитую машину, его слова «выберусь сам». Дениз слушает, не перебивая, потом отворачивается к верстаку и долго что-то там ищет. — Спасибо, — говорит он не оборачиваясь.',
          effects: [{ set: '$.told_deniz', value: true }, { npc: 'deniz', trust: 12, remember: '$:saw_kerem' }] },
        { id: 'shelter', label: 'Спросить, можно ли пересидеть у него, если что', minutes: 4, combinable: true,
          when: { all: [{ npc: 'deniz', trust: ['>=', 30] }, { not: { knows: 'f_deniz_shelter' } }] },
          text: '— Здесь? — Дениз оглядывает бокс: стальные ворота, лист на окне, генератор. — Тут бетон и железо, окно одно. Воды мало, зато канистры. Стучи три раза и два. — Он медлит. — Но я, может, уеду к Хенрике. Тогда — со мной. Скажу ей за тебя.',
          effects: [{ learn: 'f_deniz_shelter' }, { set: 'w.deniz_shelter', value: true }, { set: 'w.deniz_vouch', value: true }] },
        { id: 'stay', label: 'Остаться у него, переждать', minutes: 60, combinable: true, activity: 'rest', repeatable: true,
          when: { npc: 'deniz', trust: ['>=', 10] },
          text: 'Ты сидишь на перевёрнутом ящике у генератора. Дениз крутит своё старое радио с антенной, перемотанной изолентой.',
          outcomes: radioOutcomes() },
      ] as ActionDef[]).map(withDeniz),
      { id: 'refuel', label: 'Залить канистру в бак', minutes: 5, combinable: true,
        when: { all: [carHere, { fuelIn: 'can_petrol_10', liters: 1 }, { has: 'can_petrol_10' }] },
        text: 'Бензин булькает в горловине, пахнет на весь бокс. Стрелка ползёт вверх.',
        effects: [{ refuel: 'opel_corsa', liters: 10, fromCan: 'can_petrol_10' }] },
      enterCar(),
      ...tail(),
    ],
  }),

  // ───────────── Больница ─────────────
  S({
    id: 'a_hosp_lot', for: 'A', chapter: 'ch1', location: 'a_hospital', title: 'Krankenhaus Buchholz',
    text: [
      { when: { v: 'w.hosp_buchholz', op: '!=', value: 'closed' }, text: 'Больница светится в тумане, как корабль: у неё свой генератор. У въезда к приёмному — вереница машин с аварийками. Охранник в жёлтом жилете машет жезлом. Сбоку натянута белая палатка, к ней очередь людей в куртках поверх пижам. Женщина в защитном комбинезоне идёт вдоль машин с планшетом и что-то спрашивает в каждое окно.' },
      { when: { all: [{ flag: '$.brock_in_car' }, { not: { flag: '$.brock_triaged' } }] }, text: 'Ильзе прижимает к себе Герда и шепчет: «Gleich, Schatz, gleich».' },
      { when: { v: 'w.hosp_buchholz', op: '==', value: 'closed' }, text: 'Ворота к приёмному закрыты, поперёк въезда — полицейская машина. Табличка от руки: «Aufnahmestopp — Notfälle bitte über 112». У палатки никого; ветер треплет полог. За окнами корпусов мелькают силуэты в белом.' },
    ],
    actions: [
      { id: 'queue', label: 'Встать в очередь машин к приёмному', minutes: 35, combinable: true, terminal: true, goto: 'a_hosp_triage',
        when: { all: [{ flag: '$.brock_in_car' }, { not: { flag: '$.brock_triaged' } }, { v: 'w.hosp_buchholz', op: '!=', value: 'closed' }] },
        text: 'Машины ползут по метру. Герд то затихает, то стонет. Через полчаса к твоему окну наклоняется женщина в комбинезоне и маске.' },
      { id: 'tent', label: 'Вывести Герда и сразу вести к палатке', minutes: 10, activity: 'moderate', terminal: true, goto: 'a_hosp_triage',
        when: { all: [{ flag: '$.brock_in_car' }, { not: { flag: '$.brock_triaged' } }, { v: 'w.hosp_buchholz', op: '!=', value: 'closed' }] },
        text: 'Вы ведёте его под руки мимо очереди. Кто-то кричит вслед, что тут все больные. У палатки женщина в комбинезоне поднимает ладонь: стоп, дистанция.' },
      { id: 'guard', label: 'Спросить охранника, что происходит', minutes: 5, combinable: true, when: { v: 'w.hosp_buchholz', op: '!=', value: 'closed' },
        text: '— Nur echte Notfälle. С температурой — к палатке. — Он оглядывается и добавляет тише: — Кого укусили или поцарапали — сразу говорите. Таких уводят отдельно.',
        effects: [{ learn: 'f_hosp_bite_question' }] },
      { id: 'watch', label: 'Понаблюдать за очередью', minutes: 10, combinable: true,
        outcomes: [
          { id: 'closed', when: { v: 'w.hosp_buchholz', op: '==', value: 'closed' }, text: 'У закрытых ворот спорят с полицейским двое мужчин — у одного ребёнок на руках, завёрнутый в куртку. Полицейский повторяет одно и то же: «Hundertzwölf». Потом садится в машину и закрывает дверь.', effects: [{ body: 'stress', delta: 4 }] },
          { id: 'open', text: 'Из палатки выводят мужчину с перебинтованной рукой. Двое в костюмах, похожих на дождевики, ведут его не к главному входу, а к боковой двери с красной полосой. Он оглядывается на жену, она кричит его имя. Дверь закрывается.', effects: [{ learn: 'f_hosp_bite_question' }, { body: 'stress', delta: 4 }] },
        ] },
      { id: 'medic', label: 'Разговорить фельдшера, курящего у скорой', minutes: 8, combinable: true, when: { before: at(10, 11, 0) },
        text: '— Из Гамбурга с ночи к нам возят, у них всё забито. — Он затягивается так, что сигарета трещит. — Знаешь, сколько я сегодня видел укусов? Люди кусают людей. Пятнадцать лет работаю — такого не было. — Он бросает окурок. — Иди домой, парень. Серьёзно.',
        effects: [{ learn: 'f_hamburg_hospitals_full' }] },
      { id: 'home_brock', label: 'Передумать и отвезти Брокманов домой', minutes: 2, terminal: true, goto: 'a_brock_home',
        when: { all: [{ flag: '$.brock_in_car' }, { not: { flag: '$.brock_triaged' } }] } },
      { id: 'car', label: 'Сесть в машину', minutes: 1, terminal: true, goto: 'a_drive',
        when: { all: [carHere, { not: { all: [{ flag: '$.brock_in_car' }, { not: { flag: '$.brock_triaged' } }] } }] },
        enabled: { has: 'car_keys' }, disabledReason: 'Нет ключей' },
      { id: 'ilse_wait', label: 'Подойти к Ильзе у палатки', minutes: 2, terminal: true, goto: 'a_hosp_after',
        when: { all: [{ npc: 'ilse', at: 'a_hospital' }, { not: { flag: '$.left_ilse_hosp' } }] } },
      ...tail(),
    ],
  }),
  S({
    id: 'a_hosp_triage', for: 'A', chapter: 'ch1', location: 'a_hospital', title: 'Палатка',
    onEnter: [{ set: '$.brock_triaged', value: true }, { set: '$.driving_brockmanns', value: false }, { npc: 'gerd', moveTo: 'a_hospital' }, { npc: 'ilse', moveTo: 'a_hospital' }],
    text: [
      { text: 'Женщина в комбинезоне смотрит на Герда поверх маски. Голос ровный, усталый: «Fieber? Seit wann? Verletzungen? Biss, Kratzer, irgendwas?» Ильзе открывает рот — и смотрит на тебя.' },
    ],
    actions: [
      { id: 'tell', label: 'Рассказать про укус всё как есть', minutes: 15, terminal: true, goto: 'a_hosp_after',
        text: 'Ты говоришь про порт, про «пьяного», про повязку. Глаза над маской меняются. Она отступает на шаг и говорит в рацию два слова. Через минуту двое в защитных костюмах выкатывают кресло. Герда увозят к боковой двери с красной полосой. Ильзе бросается следом — её мягко, но твёрдо останавливают: «Sie dürfen nicht mit.»',
        effects: [{ set: '$.gerd_admitted', value: true }, { npc: 'ilse', trust: 10, remember: '$:hospital' }, { learn: 'f_hosp_bite_question' },
          { npc: 'gerd', status: 'sick' }] },
      { id: 'hide', label: 'Промолчать про укус: «Это грипп»', minutes: 5, terminal: true, goto: 'a_brock_home',
        text: 'Ильзе смотрит на тебя растерянно — и кивает. Женщина в комбинезоне записывает. «Grippe. Dann bitte nach Hause, viel trinken, Fieber senken. Wir nehmen heute nur Notfälle.» Следующий.',
        effects: [{ set: '$.gerd_hidden', value: true }, { npc: 'gerd', moveTo: 'a_brockmann' }, { npc: 'ilse', moveTo: 'a_brockmann' }] },
      { id: 'ask', label: 'Спросить, опасно ли это для остальных', minutes: 3, combinable: true,
        text: '— Wir wissen es nicht, — честно говорит она. — Избегайте контакта с кровью и слюной. Мойте руки. Если поднимется температура — приходите. — Она протягивает тебе листок, отпечатанный, видно, ночью.',
        effects: [{ learn: 'f_leaflet' }, { give: 'leaflet' }] },
    ],
  }),
  S({
    id: 'a_hosp_after', for: 'A', chapter: 'ch1', location: 'a_hospital', title: 'Ильзе',
    text: [
      { text: 'Ильзе стоит под дождём у палатки, держа в руках пакет с вещами Герда — тапочки, бритва, очки. Боковая дверь закрыта. — Сказали, позвонят, — говорит она. — Как позвонят? Телефоны же не работают.' },
      { when: { v: 'w.hosp_buchholz', op: '==', value: 'closed' }, text: 'Полиция уже просит людей разойтись с парковки.' },
    ],
    actions: [
      { id: 'comfort', label: 'Посидеть с ней в машине, дать прийти в себя', minutes: 10, combinable: true,
        text: 'В машине Ильзе долго молчит, потом рассказывает: сорок два года вместе, Герд научил её водить, на этой самой парковке они когда-то ждали, пока родится их сын… Она осекается. — Он в Канаде теперь. Даже не знает.',
        effects: [{ npc: 'ilse', trust: 6 }, { body: 'stress', delta: -2 }] },
      { id: 'wait', label: 'Подождать с ней новостей', minutes: 45, combinable: true, activity: 'rest', when: { not: { flag: '$.waited_hosp' } },
        outcomes: [
          { id: 'closed', when: { v: 'w.hosp_buchholz', op: '==', value: 'closed' }, text: 'Никто не выходит. Через сорок минут полиция просит всех покинуть парковку: «Aufnahmestopp». Ильзе плачет беззвучно.', effects: [{ set: '$.waited_hosp', value: true }] },
          { id: 'doctor', text: 'Через сорок минут из боковой двери выходит молодой врач в маске, находит Ильзе по фамилии. «Ihr Mann ist stabil. Er ist isoliert. Fahren Sie nach Hause, wir melden uns.» Он уходит быстрее, чем пришёл.', effects: [{ set: '$.waited_hosp', value: true }, { npc: 'ilse', trust: 4 }] },
        ] },
      driveAction('take_home', 'Отвезти Ильзе домой', 3, 12, 'a_yard', 'a_ilse_home',
        { text: 'Всю дорогу Ильзе смотрит в окно назад — на светящиеся корпуса, пока их не съедает туман.',
          effects: [{ npc: 'ilse', moveTo: 'a_brockmann', trust: 10, remember: '$:drove_home' }, { set: '$.ilse_home_alone', value: true }] }),
      { id: 'leave', label: 'Оставить её — она хочет ждать здесь', minutes: 2, terminal: true, goto: 'a_hosp_lot',
        text: '— Я подожду, — Ильзе кивает тебе, как кивают ученикам в конце урока. — Езжайте. Спасибо вам. Правда.',
        effects: [{ set: '$.left_ilse_hosp', value: true }, { npc: 'ilse', trust: 2 }] },
    ],
  }),
  S({
    id: 'a_brock_home', for: 'A', chapter: 'ch1', location: 'a_hospital', title: 'Обратно',
    onEnter: [{ npc: 'gerd', moveTo: 'a_brockmann' }, { npc: 'ilse', moveTo: 'a_brockmann' }],
    text: [{ text: 'Герд дремлет, привалившись виском к стеклу. Ильзе гладит его по руке, на которой повязка. Дома она уложит его, заварит ромашку, будет сбивать жар. «Это грипп», — говорит она вслух, и непонятно, кого убеждает.' }],
    actions: [
      driveAction('drive', 'Довезти их и помочь Герду подняться', 3, 25, 'a_yard', 'a_tbc',
        { activity: 'moderate', text: 'Лестница даётся Герду тяжело. На пороге своей квартиры он вдруг хватает тебя за рукав — сильно, до боли — и тут же отпускает, будто не понял, что сделал.',
          effects: [{ set: '$.driving_brockmanns', value: false }, { set: '$.brock_in_car', value: false }, { set: '$.brock_returned', value: true }, { move: 'a_stairs' }, { npc: 'ilse', trust: 6 }] }),
    ],
  }),
  S({
    id: 'a_ilse_home', for: 'A', chapter: 'ch1', location: 'a_brockmann', title: 'У Ильзе',
    text: [
      { when: { not: { visited: 'a_ilse_home', times: 2 } }, text: 'В квартире Брокманов без Герда тихо и слишком прибрано. Ильзе ставит чайник на газовую плиту — газ есть — и только потом замечает, что плачет.' },
      { when: { visited: 'a_ilse_home', times: 2 }, text: 'Ильзе открывает сразу, будто стояла у двери. Часы с маятником тикают на всю квартиру.' },
      { when: { all: [evening, { visited: 'a_ilse_home', times: 2 }] }, text: 'В квартире пахнет свечами. Ильзе в пальто — сидит одетая, «на всякий случай», с сумкой у ног.' },
    ],
    actions: [
      { id: 'tea', label: 'Выпить с ней чаю', minutes: 15, combinable: true, when: { not: { visited: 'a_ilse_home', times: 3 } },
        text: 'Чай с мятой, печенье из жестяной банки. Ильзе рассказывает про Герда: сорок лет на кране в порту, ни одного больничного. — А теперь вот. Из-за какого-то пьяного.',
        effects: [{ body: 'thirst', delta: -15 }, { body: 'stress', delta: -6 }, { npc: 'ilse', trust: 5 }] },
      { id: 'radio', label: 'Принять подарок — старое радио Герда', minutes: 2, combinable: true,
        when: { all: [{ npc: 'ilse', trust: ['>=', 20] }, { not: { flag: '$.ilse_radio' } }] },
        text: '— Возьмите. — Ильзе протягивает транзистор в кожаном чехле. — Герд с ним на рыбалку ездил. Мне оно сейчас… я не могу его слушать.',
        effects: [{ give: 'radio', charge: 80 }, { set: '$.ilse_radio', value: true }] },
      { id: 'food', label: 'Взять бутерброды, которые она суёт тебе в руки', minutes: 1, combinable: true, when: { not: { flag: '$.ilse_food' } },
        text: '— Я всё равно на двоих нарезала. По привычке.',
        effects: [{ give: 'sandwich', qty: 2 }, { set: '$.ilse_food', value: true }] },
      { id: 'advice', label: 'Посоветовать ей запереться и не открывать чужим', minutes: 3, combinable: true,
        text: '— Чужим, — повторяет Ильзе. — Я тут сорок лет живу. Тут нет чужих. — Но цепочку на двери потом накидывает.',
        effects: [{ npc: 'ilse', trust: 2 }] },
      { id: 'come_up', label: 'Позвать её к себе — вдвоём спокойнее', minutes: 3, combinable: true, when: { all: [evening, { not: { flag: '$.ilse_invited' } }] },
        outcomes: [
          { id: 'yes', when: { npc: 'ilse', trust: ['>=', 30] }, text: 'Ильзе долго молчит, потом берёт сумку. — Только до утра. Утром я поеду к нему.', effects: [{ npc: 'ilse', moveTo: 'a_flat', trust: 5 }, { set: '$.ilse_invited', value: true }], goto: 'a_wake' },
          { id: 'no', text: '— Нет-нет. Вдруг позвонят из больницы. Или он вернётся. — Она гладит тебя по руке. — Идите.', effects: [{ set: '$.ilse_invited', value: true }] },
        ] },
      { id: 'leave', label: 'Подняться к себе', minutes: 1, terminal: true, goto: 'a_tbc' },
    ],
  }),

  // ───────────── Брокманы после 11:30 ─────────────
  S({
    id: 'a_brock_attack', for: 'A', chapter: 'ch1', location: 'a_brockmann', title: 'Квартира Брокманов',
    onEnter: [{ set: '$.brock_intervened', value: true }, { body: 'stress', delta: 14 }],
    text: [
      { when: { all: [ilseHere('a_brockmann'), { not: ilseBitten }, { not: gerdTurned }] },
        text: 'Дверь не заперта. В гостиной перевёрнут столик, по полу — осколки чашки. Герд стоит над Ильзе, загнанной в угол у серванта: в одной майке, мокрый от пота, издаёт звук, похожий на рычание сквозь сжатые зубы. Ильзе выставила перед собой подушку. Герд поворачивается на твои шаги. Глаза мутные, зрачки огромные.' },
      { when: { all: [ilseHere('a_brockmann'), ilseBitten, { not: gerdTurned }] },
        text: 'Дверь не заперта. Ильзе сидит на полу у кухни, прижимая к груди руку; сквозь пальцы течёт кровь. Герд — у окна, бьётся плечом в раму, будто не видит стекла. На твои шаги он оборачивается — медленно, всем телом.' },
      { when: { all: [{ not: ilseHere('a_brockmann') }, { not: gerdTurned }] },
        text: 'Дверь не заперта. В квартире разгром, на ковре — бурые пятна. Ильзе нет. Герд стоит посреди гостиной, раскачиваясь, и смотрит на тебя. Потом делает шаг.' },
      { when: gerdTurned,
        text: 'Дверь подаётся от толчка. В квартире темно и холодно, пахнет чем-то кислым. Из темноты, шаркая, выходит Герд — босой, в мокрой майке, с серым неподвижным лицом. Он не щурится от света. Он вообще ни на что не реагирует — только идёт на звук. На тебя.' },
    ],
    actions: [
      { id: 'pull', label: 'Выдернуть Ильзе в коридор и захлопнуть дверь', minutes: 3, activity: 'heavy', risky: true, terminal: true, goto: 'a_brock_after',
        when: { all: [ilseHere('a_brockmann'), { not: gerdTurned }] },
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 4, uses: ['mobility', 'strength'], mods: [{ when: ilseBitten, bonus: 2 }] },
            text: 'Ты хватаешь Ильзе под мышки и тащишь к двери. Герд бросается следом, его пальцы скользят по твоей спине — мимо. Дверь захлопывается, ты наваливаешься на неё всем телом, Ильзе дрожащими руками поворачивает ключ снаружи. Удар. Ещё удар. Потом — тишина и хрип.',
            effects: [{ npc: 'ilse', moveTo: 'a_flat', trust: 25, remember: '$:saved' }, { npc: 'gerd', set: { locked: true } }] },
          { id: 'bit', text: 'Ты тянешь Ильзе к двери — и Герд вцепляется тебе в предплечье. Зубы сквозь рукав, боль белая, оглушающая. Ты бьёшь его локтем, он отлетает. Дверь — ключ — удары изнутри. Рука пульсирует.',
            effects: [biteArm('leftArm', 2), { npc: 'ilse', moveTo: 'a_flat', trust: 25, remember: '$:saved' }, { npc: 'gerd', set: { locked: true } }] },
        ] },
      { id: 'restrain', label: 'Скрутить Герда и прижать к полу', minutes: 6, activity: 'heavy', risky: true, terminal: true, goto: 'a_brock_after',
        when: { not: gerdTurned },
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 3, uses: ['strength', 'mobility'] },
            text: 'Ты заходишь сбоку, подсекаешь, валишь его лицом в ковёр и заламываешь руки. Он горячий, как печка, и бьётся с силой, которой у семидесятилетнего не бывает. Зубы клацают в сантиметре от твоей щеки. Ильзе приносит ремень, и вы связываете ему руки, потом ноги. Он воет — долго, без слов.',
            effects: [{ npc: 'gerd', set: { tied: true, locked: true } }, { npc: 'ilse', trust: 15, remember: '$:restrained' }, { if: ilseHere('a_brockmann'), then: [{ npc: 'ilse', moveTo: 'a_flat' }] }] },
          { id: 'scratch', chance: 0.5, text: 'Ты валишь его на пол, но он выворачивается и полосует тебе кисть ногтями — глубоко, до крови. Со второй попытки ты всё-таки прижимаешь его и связываешь ремнём. Кисть горит.',
            effects: [{ injure: 'scratch', site: 'hands', severity: 2, exposure: 0.15 }, { npc: 'gerd', set: { tied: true, locked: true } }, { npc: 'ilse', trust: 12 }, { if: ilseHere('a_brockmann'), then: [{ npc: 'ilse', moveTo: 'a_flat' }] }] },
          { id: 'bit', text: 'Он выворачивается, и его зубы смыкаются у тебя на ладони. Ты вырываешь руку вместе с его рывком, отшвыриваешь его к стене. Он оседает, хрипя. Ты успеваешь выскочить и захлопнуть дверь. Ладонь в крови.',
            effects: [biteArm('hands', 2), { npc: 'gerd', set: { locked: true } }, { if: ilseHere('a_brockmann'), then: [{ npc: 'ilse', moveTo: 'a_flat' }] }] },
        ] },
      { id: 'fight_turned', label: 'Бить, пока он не перестанет подниматься', minutes: 4, activity: 'heavy', risky: true, terminal: true, goto: 'a_brock_after',
        when: gerdTurned,
        outcomes: [
          { id: 'ok', check: { traits: ['melee', 'strength'], difficulty: 4, uses: ['strength', 'mobility'] },
            text: 'Он не уворачивается и не закрывается — просто идёт на тебя. Ты бьёшь, и он падает, и встаёт, и падает снова. Ты хватаешь со стены тяжёлые часы с маятником. Потом становится тихо. Ты долго стоишь над тем, что было Гердом Брокманом, и не можешь разжать пальцы.',
            effects: [{ npc: 'gerd', alive: false }, { body: 'stress', delta: 25 }, { set: '$.killed_gerd', value: true }] },
          { id: 'bit', text: 'Он вцепляется в тебя, когда ты бьёшь второй раз, — зубы сквозь рукав, в предплечье. Ты валишь его, бьёшь ещё и ещё, пока он не затихает. Потом сидишь на полу, прижимая к себе руку, и слушаешь, как тикают часы.',
            effects: [biteArm('leftArm', 2), { npc: 'gerd', alive: false }, { body: 'stress', delta: 25 }, { set: '$.killed_gerd', value: true }] },
        ] },
      { id: 'punch', label: 'Ударить. Один раз, как учили', minutes: 2, activity: 'heavy', risky: true, terminal: true, goto: 'a_brock_after',
        when: { not: gerdTurned },
        outcomes: [
          { id: 'ok', check: { traits: ['melee'], difficulty: 2, uses: ['strength', 'focus'] },
            text: 'Шаг, корпус, правый прямой — тело помнит лучше головы. Герд падает как подкошенный и остаётся лежать. Дышит. Ильзе кричит — на тебя, не на него. Ты выводишь её, она отбивается, но идёт. Ключ поворачивается в замке снаружи.',
            effects: [{ npc: 'gerd', set: { knocked_out: true, locked: true } }, { npc: 'ilse', trust: -5, remember: '$:hit_gerd' }, { if: ilseHere('a_brockmann'), then: [{ npc: 'ilse', moveTo: 'a_flat' }] }] },
          { id: 'bit', text: 'Ты бьёшь — и он не падает. Будто не почувствовал. Его зубы встречают твои костяшки, рвут кожу. Второй удар роняет его. Кулак разбит, кровь твоя и, кажется, его.',
            effects: [biteArm('hands', 1), { npc: 'gerd', set: { knocked_out: true, locked: true } }, { npc: 'ilse', trust: -5, remember: '$:hit_gerd' }, { if: ilseHere('a_brockmann'), then: [{ npc: 'ilse', moveTo: 'a_flat' }] }] },
        ] },
      { id: 'flee', label: 'Отступить на лестницу и захлопнуть дверь снаружи', minutes: 1, terminal: true, goto: 'a_tbc',
        text: 'Ты выскакиваешь на площадку и тянешь дверь на себя. Удар изнутри, ещё удар. Если там кто-то и кричит, ты стараешься не слышать.',
        effects: [{ set: '$.brock_done', value: true }, { npc: 'gerd', set: { locked: true } },
          { if: { all: [ilseHere('a_brockmann'), { not: ilseBitten }] }, then: [{ npc: 'ilse', status: 'injured', set: { bitten: true } }] },
          { if: ilseHere('a_brockmann'), then: [{ npc: 'ilse', trust: -40, remember: '$:abandoned' }] }, { body: 'stress', delta: 10 }] },
    ],
  }),
  S({
    id: 'a_brock_after', for: 'A', chapter: 'ch1', location: 'a_stairs', title: 'После',
    onEnter: [{ set: '$.brock_done', value: true }],
    text: [
      { text: 'Ты стоишь на площадке, прислонившись к двери Брокманов спиной. Руки трясутся — не от усталости.' },
      { when: { all: [{ npc: 'ilse', at: 'a_flat' }, { not: ilseBitten }] }, text: 'Ильзе сидит на ступеньке, обхватив себя руками, и раскачивается. — Это не он, — повторяет она. — Это не мой Герд.' },
      { when: { all: [{ npc: 'ilse', at: 'a_flat' }, ilseBitten] }, text: 'Ильзе сидит на ступеньке, прижимая к груди прокушенную руку. Кровь капает на бетон. Она смотрит на неё так, будто рука чужая.' },
      { when: { flag: '$.killed_gerd' }, text: 'Дверь Брокманов закрыта. За ней — тишина. Ты знаешь, что там лежит, и знаешь, что это сделал ты. И знаешь, что иначе было нельзя. Это знание не помогает.' },
      { when: { injured: 'any' }, text: 'Твоя рука горит. Промыть бы это — и как можно скорее.' },
    ],
    actions: [
      { id: 'treat_ilse', label: 'Перевязать Ильзе руку', minutes: 10, combinable: true,
        when: { all: [{ npc: 'ilse', at: 'a_flat' }, ilseBitten, { not: { flag: '$.treated_ilse' } }] },
        enabled: { any: [{ hasTag: 'dressing' }, { hasTag: 'cloth' }] }, disabledReason: 'Нужен бинт или хоть какая-то ткань',
        text: 'Ты промываешь укус водой из бутылки и туго бинтуешь. Ильзе морщится, но не издаёт ни звука. Следы зубов — полукругом, как у Герда на руке утром.',
        effects: [{ if: { hasTag: 'dressing' }, then: [{ takeTag: 'dressing' }], else: [{ takeTag: 'cloth' }] }, { set: '$.treated_ilse', value: true }, { npc: 'ilse', trust: 8, set: { treated: true } }] },
      { id: 'call112', label: 'Позвонить 112', minutes: 4, combinable: true, when: { phoneUsable: true },
        outcomes: [
          { id: 'through', when: { network: 'voice' }, text: 'Дозваниваешься с пятой попытки. Диспетчер выслушивает, не перебивая. «Wir haben sehr viele solcher Einsätze. Halten Sie Abstand, schließen Sie ihn ein. Es kann Stunden dauern.» Короткие гудки.', effects: [{ learn: 'f_112_overloaded' }, { charge: 'phone', delta: -1 }] },
          { id: 'busy', text: '«Netz besetzt». И ещё раз. И ещё.', effects: [{ charge: 'phone', delta: -1 }] },
        ] },
      { id: 'talk', label: 'Поговорить с Ильзе', minutes: 8, combinable: true, when: { npc: 'ilse', at: 'a_flat' },
        text: '— Он проснулся и сел. Я подумала — лучше ему. А он посмотрел на меня так… как на кусок мяса. — Ильзе закрывает лицо руками. — Он болен. Ему нужен врач. Его нельзя так оставлять.',
        effects: [{ npc: 'ilse', trust: 4 }, { learn: 'f_gerd_rage' }] },
      { id: 'up', label: 'Увести Ильзе к себе', minutes: 2, terminal: true, goto: 'a_wake', when: { npc: 'ilse', at: 'a_flat' },
        text: 'Ты укладываешь её на свой диван и накрываешь пледом. Снизу, сквозь пол, иногда доносится удар.' },
      { id: 'up_alone', label: 'Подняться к себе', minutes: 1, terminal: true, goto: 'a_wake', when: { not: { npc: 'ilse', at: 'a_flat' } } },
      { id: 'down', label: 'Выйти на улицу — подальше отсюда', minutes: 2, terminal: true, goto: 'a_street' },
    ],
  }),

  // ───────────── Хутор Людеманов ─────────────
  S({
    id: 'a_farm_gate', for: 'A', chapter: 'ch1', location: 'hof_luedemann', title: 'Хутор Людеманов',
    onEnter: [{ set: '$.met.ole', value: true },
      { if: { daylight: false }, then: [{ body: 'stress', delta: 8 }] },
      { if: { all: [{ npc: 'deniz', at: 'hof_luedemann' }, { npc: 'deniz', trust: ['>=', 30] }, { not: { flag: '$.deniz_vouched' } }] },
        then: [{ npc: 'henrike', trust: 15 }, { set: '$.deniz_vouched', value: true }] }],
    text: [
      { when: { daylight: false }, text: 'Фары упираются в сетку ворот. Собака беснуется. С крыльца бьёт выстрел — в воздух, но так близко, что закладывает уши. «Licht aus! Wer da?!» Ты гасишь фары и выходишь с поднятыми руками.' },
      { when: { npc: 'deniz', at: 'hof_luedemann' }, text: 'У сарая стоит знакомый фургон Айдына. Сам Дениз — рядом с Оле, машет тебе рукой: свои.' },
      { when: { not: { visited: 'a_farm_gate', times: 2 } }, text: 'Грунтовка между полями упирается в ворота из металлической сетки. За ними — двор, красный кирпичный дом с белыми рамами, длинный сарай, трактор под навесом, дым из трубы. Собака заходится лаем. От сарая к воротам идёт парень лет двадцати семи с ружьём на сгибе локтя — стволом вниз, но так, чтобы было видно.' },
      { when: { not: { visited: 'a_farm_gate', times: 2 } }, text: '— Стой там, — говорит он по-немецки. — Ты кто?' },
      { when: { visited: 'a_farm_gate', times: 2 }, text: 'Ворота хутора. Оле узнаёт тебя и не опускает ружьё, но и не поднимает.' },
      { when: { flag: 'w.henrike_yes' }, text: 'Собака уже не лает — нюхает твою руку через сетку.' },
    ],
    actions: [
      { id: 'deniz', label: 'Сказать, что тебя прислал Дениз Айдын', minutes: 3, combinable: true,
        when: { all: [{ knows: 'f_farm' }, { not: { flag: '$.said_deniz' } }] },
        outcomes: [
          { id: 'trusted', when: { npc: 'deniz', trust: ['>=', 30] }, text: '— Айдын? — Оле чуть расслабляется. — Ну, если Айдын… Мать в доме. Жди. — Он свистом подзывает собаку и уходит.', effects: [{ set: '$.said_deniz', value: true }, { npc: 'ole', trust: 10 }] },
          { id: 'doubt', text: '— Айдын тут всех знает, — Оле не двигается с места. — Любой может сказать «Айдын». — Но кричит через плечо: «Mama!»', effects: [{ set: '$.said_deniz', value: true }, { npc: 'ole', trust: 3 }] },
        ] },
      { id: 'honest', label: 'Сказать честно: ищешь, где пересидеть, если станет хуже', minutes: 3, combinable: true, when: { not: { flag: '$.said_honest' } },
        text: '— Ты и ещё пол-района, — говорит Оле. Но ружьё опускает ниже. — Мать решает. Не я.',
        effects: [{ set: '$.said_honest', value: true }, { npc: 'ole', trust: 4 }] },
      { id: 'henrike', label: 'Дождаться хозяйку', minutes: 10, terminal: true, goto: 'a_farm_talk',
        when: { any: [{ flag: '$.said_deniz' }, { flag: '$.said_honest' }] } },
      enterCar({ label: 'Сесть в машину и уехать' }),
      ...tail(),
    ],
  }),
  S({
    id: 'a_farm_talk', for: 'A', chapter: 'ch1', location: 'hof_luedemann', title: 'Хенрике',
    onEnter: [{ set: '$.met.henrike', value: true }, { set: '$.met.pawel', value: true }],
    text: [
      { when: { not: { visited: 'a_farm_talk', times: 2 } }, text: 'Хенрике Людеман выходит к воротам в резиновых сапогах и стёганой жилетке, с руками в муке. Лет под шестьдесят, седая коса, лицо, на котором ветер оставил больше, чем годы. За её плечом — крепкий мужчина в рабочем комбинезоне, говорит с Оле по-польски: Павел, сезонный работник. Хенрике смотрит на тебя долго, не торопясь.' },
      { when: { not: { visited: 'a_farm_talk', times: 2 } }, text: '— Ну? Что вы хотите?' },
      { when: { visited: 'a_farm_talk', times: 2 }, text: 'Хенрике снова у ворот. Ждёт, что ты скажешь — и не помогает.' },
    ],
    actions: [
      { id: 'offer_work', label: 'Предложить руки: дрова, забор, дежурства по ночам', minutes: 6, combinable: true, when: { not: { flag: '$.offered_work' } },
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion', 'strength'], difficulty: 5, mods: [{ when: { npc: 'deniz', trust: ['>=', 30] }, bonus: 2 }] },
            text: 'Хенрике оглядывает тебя, как оглядывают лошадь на ярмарке: плечи, руки, ботинки. — Колоть умеете? — Умею. — Посмотрим. — Это не «да». Но и не «нет».',
            effects: [{ set: '$.offered_work', value: true }, { npc: 'henrike', trust: 12 }] },
          { id: 'meh', text: '— Руки у меня есть, — Хенрике кивает на сына и Павла. — Мне нужно, чтобы руки не приводили сюда беды.', effects: [{ set: '$.offered_work', value: true }, { npc: 'henrike', trust: 4 }] },
        ] },
      { id: 'offer_fuel', label: 'Сказать, что у тебя есть машина и бензин', minutes: 3, combinable: true, when: { not: { flag: '$.offered_fuel' } },
        text: '— Бензин, — Хенрике усмехается. — У меня трактор на дизеле и триста литров в баке. Машина — это хорошо. Машина — это значит, вы можете уехать, если не уживёмся.',
        effects: [{ set: '$.offered_fuel', value: true }, { npc: 'henrike', trust: 3 }] },
      { id: 'tell_news', label: 'Рассказать, что видел в городе', minutes: 8, combinable: true, when: { not: { flag: '$.told_henrike' } },
        outcomes: [
          { id: 'seen', when: { any: [{ knows: 'f_paramedic_bitten' }, { knows: 'f_gerd_rage' }, { knows: 'f_hosp_bite_question' }] },
            text: 'Ты рассказываешь — без прикрас: укусы, жар, люди, которые перестают узнавать своих. Хенрике слушает, не перебивая. Павел перестаёт говорить с Оле. — Значит, кусаются, — говорит Хенрике наконец. — Спасибо, что не стали врать, что всё хорошо.',
            effects: [{ set: '$.told_henrike', value: true }, { npc: 'henrike', trust: 12, remember: '$:honest_news' }] },
          { id: 'little', text: 'Ты рассказываешь, что знаешь: тока нет, мосты закрыты, больницы забиты. Хенрике кивает: это она слышала и по радио.', effects: [{ set: '$.told_henrike', value: true }, { npc: 'henrike', trust: 3 }] },
        ] },
      { id: 'partner', label: 'Сказать, что ты не один: в Гамбурге {partner}', minutes: 3, combinable: true,
        when: { all: [{ after: CONTACT_AFTER }, { not: { flag: '$.told_partner_henrike' } }] },
        text: '— Девушка, — Хенрике смотрит иначе. — Что она умеет? — Ты отвечаешь, как можешь. — Ну, — говорит Хенрике. — Сначала довезите её. Потом поговорим.',
        effects: [{ set: '$.told_partner_henrike', value: true }, { npc: 'henrike', trust: 2 }] },
      { id: 'ask', label: 'Прямо спросить: пустите, если станет совсем плохо?', minutes: 4, combinable: true,
        when: { not: { flag: 'w.henrike_answered' } },
        outcomes: [
          { id: 'yes', when: { npc: 'henrike', trust: ['>=', 25] },
            text: 'Хенрике вытирает руки о жилетку. — Если станет совсем плохо — приезжайте. Работать будете со всеми, наравне. Дом мой, правила мои. Кто заболеет — в старый курятник, пока не ясно. Согласны? — Ты киваешь. — И приезжайте засветло. Ночью Оле стреляет раньше, чем спрашивает.',
            effects: [{ set: 'w.henrike_yes', value: true }, { set: 'w.henrike_answered', value: true }, { learn: 'f_henrike_yes' }, { npc: 'henrike', trust: 5, remember: '$:accepted' }] },
          { id: 'maybe', when: { npc: 'henrike', trust: ['>=', 12] },
            text: '— Не знаю, — честно говорит Хенрике. — Я вас первый раз вижу. Приезжайте, если будет край. Там посмотрим — на вас и на то, что вы с собой привезёте.',
            effects: [{ set: 'w.henrike_maybe', value: true }, { set: 'w.henrike_answered', value: true }, { learn: 'f_henrike_maybe' }] },
          { id: 'no', text: '— Нет, — спокойно говорит Хенрике. — У меня сын, работник и куры. Чужих не беру. Не обижайтесь.',
            effects: [{ set: 'w.henrike_answered', value: true }, { learn: 'f_henrike_no' }, { npc: 'henrike', trust: -3 }] },
        ] },
      { id: 'leave', label: 'Попрощаться и вернуться к машине', minutes: 2, terminal: true, goto: 'a_farm_gate' },
    ],
  }),
].map((s) => [s.id, s]));
