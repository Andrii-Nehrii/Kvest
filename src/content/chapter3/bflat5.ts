// Участок 5: квартира B и соседи. Укус не означает немедленного обращения.
import type { ActionDef, Scene, TextBlock, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, not, flag, keeper, npcHere } from './world3';

const S = (s: Scene) => s;
const AM = all({ after: at(12, 6) }, { before: at(12, 13) });
const NIGHT: Cond = { before: at(12, 6) };
const C5 = all({ cp: 4 }, not({ cp: 5 }));
const okaforHere = npcHere('okafor', 'b_okafor');
const bitten: Cond = { npcVar: 'okafor', key: 'bitten' };
const speaking = all(okaforHere, not({ npc: 'okafor', status: 'turned' }));
const nameKnown: Cond = { any: [{ me: 'B' }, { visited: 'b_okafor' }, { knows: 'f_okafor_clinic' }, { knows: 'f_c3_okafor_name' }] };
const alarm = all(C5, { after: at(12, 11, 15) }, { before: at(12, 11, 55) }, not(flag('$.c5_stair.done')), not(flag('w.c3_b5_done')));
const partnerHere = all(C5, flag('w.together'), { partnerAt: 'b_flat' }, { partner: 'active' });
const atHome: Cond = { any: [{ at: 'b_flat' }, { at: 'b_stairs' }, { at: 'b_okafor' }] };
const notDone = (id: string) => not(flag(`$.${id}`));
const result = (id: string, value: string): Cond => ({ v: `$.${id}.result`, op: '==', value });
const knock = all(C5, speaking, { after: at(12, 7, 20) }, { before: at(12, 13) }, notDone('c5_knock.done'));
const cans = all(C5, not(speaking), { after: at(12, 7, 20) }, { before: at(12, 13) }, notDone('c5_cans.done'));
const yard = all(C5, { after: at(12, 10, 10) }, { before: at(12, 13) }, notDone('c5_yard.done'));
const toKnock: ActionDef = { id: 'c5_knock_approach', label: 'Ответить через дверь', minutes: 1, terminal: true, goto: 'c5_knock', when: knock };
const toCans: ActionDef = { id: 'c5_cans_approach', label: 'Ответить соседке у двери', minutes: 1, terminal: true, goto: 'c5_cans', when: cans };
const toYard: ActionDef = { id: 'c5_yard_approach', label: 'Спуститься на голоса во дворе', minutes: 4, terminal: true, goto: 'c5_yard', when: all(yard, not(flag('w.c3_b_stairs_closed'))) };
const homeCheckpoint: ActionDef = { ...cpAction(5), label: 'Вернуться домой и связаться', effects: [{ move: 'b_flat' }] };
const back: ActionDef = { id: 'c5_back', label: 'Вернуться в квартиру', minutes: 2, terminal: true, goto: 'c5_bflat' };
const wait: ActionDef = { id: 'c5_wait', label: 'Переждать час', minutes: 60, activity: 'rest', repeatable: true, combinable: true };

// Один эпизод входа c5_start: в остальном маршрутизация ночи прежняя.
export const bflat5EntryWhen: Cond = all(
  C5, NIGHT, { at: 'b_flat' },
  { any: [{ me: 'B' }, flag('w.together')] }, not(flag('B.flat_lost')),
  not(all({ npc: 'svenja', at: 'b_flat', alive: true, status: 'turned' },
    not({ any: [{ npcVar: 'svenja', key: 'isolated' }, { npcVar: 'svenja', key: 'locked' }, { npcVar: 'svenja', key: 'tied' }] }))),
);
const entryTogether = all(bflat5EntryWhen, flag('w.together'), { partnerAt: 'b_flat' });
export const bflat5EntryText: TextBlock[] = [
  { when: all(bflat5EntryWhen, { me: 'B' }),
    text: 'Ты тянешь дверь кухни. Она цепляет пол в том же месте. Ты перешагиваешь скол в плитке.' },
  { when: all(entryTogether, { me: 'A' }),
    text: 'В прихожей {partner} ловит твой взгляд. Подвигает стул к своему. — Садись рядом. — Ножка стула касается твоего ботинка.' },
  { when: all(entryTogether, { me: 'B' }),
    text: '{partner} останавливается на кухонном пороге. Ты подвигаешь второй стул к своему. — Садись рядом. — {pm:Он|Она} убирает руку с косяка.' },
  { when: all(bflat5EntryWhen, { me: 'A' }, not(entryTogether)),
    text: 'Ты останавливаешься у кухонного порога. Отодвигаешь стул, не задевая соседний. В подъезде хлопает дверь. Ты прислушиваешься.' },
];
export const bflat5EntryActions: ActionDef[] = [
  {
    id: 'c5_bflat_entry_near', label: 'Сесть рядом', minutes: 5,
    terminal: true, goto: 'c5_bflat', when: entryTogether,
    text: 'Ты садишься, касаясь плеча {partner.gen}. Ваши ладони ложатся рядом на стол.',
    effects: [{ set: '$.c5_bflat_entry.result', value: 'near' }, { body: 'stress', delta: -5 }],
  },
  {
    id: 'c5_bflat_entry_quiet', label: 'Сесть отдельно и помолчать', minutes: 5,
    terminal: true, goto: 'c5_bflat', when: entryTogether,
    text: 'Ты выбираешь стул у двери. {partner} смотрит на свободное место рядом. — Я тут, — говорит {pm:он|она}. Стул между вами остаётся пустым.',
    effects: [{ set: '$.c5_bflat_entry.result', value: 'quiet' }, { body: 'stress', delta: -2 }],
  },
  {
    id: 'c5_bflat_entry_agree', label: 'Договориться, как устроиться на ночь', minutes: 15,
    terminal: true, goto: 'c5_bflat', when: entryTogether,
    outcomes: [
      { id: 'host', when: { me: 'B' },
        text: '— Если постучат, сначала разбуди меня, — говоришь ты. {partner} смотрит на дверь. — Даже если тихо? — Ты подвигаешь стул ближе. — Особенно если тихо.',
        effects: [{ set: '$.c5_bflat_entry.result', value: 'agree' }, { body: 'stress', delta: -4 }] },
      { id: 'guest', when: { me: 'A' },
        text: 'Ты спрашиваешь, открывать ли, если постучат. {partner} качает головой. — Сначала меня разбуди. — Ты подвигаешь стул к {pm:нему|ней}. Ножка скребёт пол.',
        effects: [{ set: '$.c5_bflat_entry.result', value: 'agree' }, { body: 'stress', delta: -4 }] },
    ],
  },
  {
    id: 'c5_bflat_entry_alone', label: 'Устроиться на ночь', minutes: 5,
    terminal: true, goto: 'c5_bflat', when: all(bflat5EntryWhen, not(entryTogether)),
    text: 'Ты садишься напротив двери кухни. Из подъезда слышно, как кто-то поворачивает ключ. Ты отодвигаешь стул от прохода.',
  },
];

export const bflat5Scenes: Scene[] = [
  S({ id: 'c5_bflat', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Квартира в Barmbek', safe: true,
    text: [
      { when: all(NIGHT, not(flag('$.c5_bflat_entry.slept')), notDone('c5_partner'), result('c5_bflat_entry', 'near'), flag('w.together'), { partnerAt: 'b_flat' }),
        text: '{partner} сдвигает локоть, освобождая тебе место на столе. Ваши стулья соприкасаются ножками.' },
      { when: all(NIGHT, not(flag('$.c5_bflat_entry.slept')), notDone('c5_partner'), result('c5_bflat_entry', 'quiet'), flag('w.together'), { partnerAt: 'b_flat' }),
        text: '{partner} оставляет проход между вашими стульями свободным. Когда ты поднимаешь голову, {pm:он|она} уже смотрит на тебя.' },
      { when: all(NIGHT, not(flag('$.c5_bflat_entry.slept')), notDone('c5_partner'), result('c5_bflat_entry', 'agree'), flag('w.together'), { partnerAt: 'b_flat' }),
        text: 'В подъезде щёлкает замок. Вы оба поворачиваетесь к двери. {partner} кладёт ладонь на стол рядом с твоей.' },
      { when: all(partnerHere, notDone('c5_partner.rested'), result('c5_partner', 'honest')), text: '{partner} останавливается перед тем, как что-то сказать. Ты поворачиваешься к {pm:нему|ней}. — Потом, — говорит {pm:он|она}. Ладонь остаётся возле твоей.' },
      { when: all(partnerHere, notDone('c5_partner.rested'), result('c5_partner', 'quiet')), text: '{partner} подаёт тебе край одеяла. Ты берёшься за него, но {pm:он|она} ещё держит другой конец.' },
      { when: all(partnerHere, notDone('c5_partner.rested'), result('c5_partner', 'space')), text: '{partner} отодвигает свой стул от прохода. Ты садишься отдельно. Между вами никто не ставит вещей.' },
      { when: NIGHT, text: 'Кто-то в подъезде ведёт ладонью по стене. Шаги останавливаются этажом ниже. Ты смотришь на дверь, пока человек не находит ключ.' },
      { when: all(AM, { before: at(12, 8, 30) }), text: 'Снизу зовут ребёнка завтракать. Он переспрашивает: «А папа?» В ответ двигают стул. В твоей кухне слышно каждое слово.' },
      { when: all({ after: at(12, 8, 30) }, { before: at(12, 10, 10) }), text: 'По лестнице несут носилки. Мужчина снизу просит не задевать свежую скобу. Ты слышишь, как её всё-таки цепляют.' },
      { when: { after: at(12, 10, 10) }, text: 'Внизу гремит железо. Ты подходишь к окну, но из кухни виден только край двора. Для остального придётся выйти.' },
      { when: all({ npc: 'svenja', at: 'b_flat', alive: true }, { npc: 'svenja', status: 'turned' }), text: 'За внутренней дверью шаркают ноги. Подпорка дрожит, потом замирает. Ты отодвигаешь от неё свои ботинки.' },
      { when: all(result('c5_knock', 'water'), speaking), text: 'На площадке щёлкает пластмассовая крышка. Ты узнаёшь звук своей бутылки. Окафор пьёт в несколько приёмов, долго между ними молчит.' },
      { when: all(result('c5_knock', 'refuse'), notDone('c5_okafor_healthy')), text: 'Окафор стучит ещё раз. Ты отвечаешь, что слышишь. После этого за его дверью тихо.' },
      { when: all(result('c5_knock', 'cloth'), speaking), text: 'Твоего полотенца на крючке нет. Вымыв руки, ты по привычке тянешься к нему. Приходится вытереть их о брюки.' },
      { when: all(result('c5_knock', 'medical'), speaking), text: 'У подъезда всё ещё стоит машина медиков. Ты считаешь людей, которых проводят к ней. До вашей двери никто не поднялся.' },
      { when: all(result('c5_yard', 'pay'), notDone('c5_yard_after')), text: 'Женщина возвращается за второй варежкой. — Спасибо за ремонт, — говорит мальчик. Мать поправляет: — Не ремонт. — И замолкает.' },
      { when: all(result('c5_yard', 'work'), notDone('c5_yard_after')), text: 'От твоих рук пахнет смазкой. Женщина с велосипедом ждёт у входа. — Он отпустил? — спрашивает она, словно ты тоже был{m:|а} залогом.' },
      { when: all(result('c5_yard', 'talk'), notDone('c5_yard_after')), text: 'Мастер уносит твою пачку под курткой. Мальчик держит отремонтированный велосипед за руль, пока мать пристёгивает кресло. У неё дрожит застёжка в руках.' },
      { when: flag('$.c5_yard_after'), text: 'У входа больше никого нет. На ступеньке лежит билет, выпавший из её кармана. Ты прижимаешь его камнем, чтобы не унесло ветром.' },
      { when: result('c5_yard', 'apart'), text: 'Во дворе прислонена к стене рама без колеса. В детском кресле лежит варежка. Женщина уже увела ребёнка.' },
      { when: flag('$.c5_cans.done'), text: 'Соседка оставила у твоей двери пустую канистру. На ручке висит детская варежка: так её найдут после раздачи.' },
      { when: result('c5_rounds', 'take'), text: 'На твоём листке три номера. У одного ты ставишь время: ответили. Прежде чем убрать карандаш, приписываешь следующий час.' },
      { when: result('c5_rounds', 'refuse'), text: 'Окафор приклеил список к своей двери. Рядом с номерами квартир его пометки. Строка для твоего имени осталась пустой.' },
      { when: result('c5_queue', 'share'), text: 'В общем запасе на два литра меньше, чем могло быть. Соседка возвращает тебе крышку от канистры. — На лестнице выпала. — Держит её на раскрытой ладони.' },
      { when: all(flag('$.c5_medical_fall'), not(partnerHere)), text: 'Когда ты сгибаешь колено, под тканью ноет ушиб. С лестницы доносится скрип носилок. Ты отодвигаешь свой рюкзак от двери.' },
      { when: all(flag('$.c5_medical_fall'), partnerHere), text: '{partner} смотрит, как ты сгибаешь колено. — Дай сюда. — Ты отодвигаешь {pm:его|её} руку, но штанину поднимаешь сам{m:|а}.' },
      { when: all({ me: 'A' }, flag('$.c5_stair.done'), not(flag('w.c3_b5_done'))), text: 'Ты прячешь ладонь под куртку. {partner} остаётся возле двери. За {pm:него|неё} ты не отвечаешь медикам.' },
      { when: { v: 'w.c3_b5', op: '==', value: 'lift' }, text: 'Из окна ты видишь, как машина увозит медбрата. Он держит ремень носилок здоровой рукой. Ключ от его двери остался в замке снаружи.' },
      { when: { v: 'w.c3_b5', op: '==', value: 'pull' }, text: 'Спуск закрыт обломками перил. За ними оставлены носилки. Из соседней комнаты слышно, как медбрат долго моет руки.' },
      { when: { any: [{ v: 'w.c3_b5', op: '==', value: 'leave' }, { v: 'w.c3_b5', op: '==', value: 'missed' }] }, text: 'Машина уже уехала. На сломанных перилах висит ремень, который медбрат держал ладонью. Ты обходишь его, не притрагиваясь.' },
      { when: flag('proj.c3_shutters_b.done'), text: 'Дверь внизу закрывается одним тяжёлым щелчком. Женщина за стеной говорит сыну: — Теперь не дёргай. Сперва позови.' },
    ],
    actions: [
      { id: 'c5_sleep', label: 'Лечь, не раздеваясь', minutes: 0, repeatable: true, when: NIGHT, text: 'Ты прячешь ступни под одеяло. Через стену слышно, как кто-то ставит будильник и тут же выключает. Твой телефон остаётся рядом с подушкой.', effects: [{ set: '$.c5_bflat_entry.slept', value: true }, { set: '$.c5_partner.rested', value: true }, { sleep: 600 }] },
      { id: 'c5_partner', label: 'Посидеть с {partner.ins}', minutes: 2, terminal: true, goto: 'c5_partner_room', when: all(partnerHere, notDone('c5_partner')) },
      { id: 'c5_breakfast_b', label: 'Поесть перед выходом', minutes: 20, combinable: true, when: all(AM, notDone('c5_breakfast_b')), enabled: { has: 'oats', qty: 0.25 }, disabledReason: 'Крупы в рюкзаке нет',
        text: 'Ты размачиваешь хлопья в кружке. Снизу мальчик спрашивает мать, можно ли сахар. Она отвечает: — Когда вернёмся. — Ты ешь быстрее, стараясь не слушать.', effects: once('c5_breakfast_b', [{ take: 'oats', qty: 0.25 }, { body: 'hunger', delta: -20 }]) },
      { id: 'c5_reserve', label: 'Оставить пачку на общей кухне', minutes: 10, combinable: true, when: all(AM, notDone('c5_reserve')), enabled: { has: 'oats' }, disabledReason: 'Нужна пачка крупы',
        text: 'Ты ставишь хлопья у кастрюли. На её крышке прежний стикер Мерле: «моё». Ты не отдираешь его. Просто поворачиваешь кастрюлю к стене.', effects: once('c5_reserve', [{ stock: 'oats', qty: 1, at: 'c3_b_stock' }]) },
      { id: 'c5_draw_water', label: 'Набрать три литра в дорогу', minutes: 10, combinable: true, when: all(AM, notDone('c5_draw_water')), enabled: { stocked: 'water_l', qty: 3, at: 'c3_b_stock' }, disabledReason: 'В общем запасе меньше трёх литров',
        text: 'Ты наполняешь две бутылки. Шум воды заставляет замолчать ребёнка этажом ниже. Когда ты закрываешь вторую, он зовёт мать шёпотом.', effects: once('c5_draw_water', [{ unstock: 'water_l', qty: 3, at: 'c3_b_stock' }, { take: 'water_l', qty: 3 }, { give: 'water_15', qty: 2 }]) },
      { id: 'c5_shutters', label: 'Час укреплять входную дверь', minutes: 0, repeatable: true, combinable: true, when: all(AM, not(flag('proj.c3_shutters_b.done'))),
        text: 'Сосед снизу держит фонарь. — Только меня не заприте. Я ещё за женой. — Когда ты примеряешь скобу, он просит показать, как отодвигать её снаружи. Ты объясняешь, что снаружи не получится.', effects: [{ work: 'c3_shutters_b', hours: 1 }] },
      toKnock, toCans, toYard,
      { id: 'c5_landing', label: 'Выйти на площадку', minutes: 2, terminal: true, goto: 'c5_landing_B', when: AM },
      { id: 'c5_okafor', label: 'Подойти к двери напротив', minutes: 2, terminal: true, goto: 'c5_okafor', when: all(AM, nameKnown) },
      { id: 'c5_neighbor_door', label: 'Подойти к двери напротив', minutes: 2, terminal: true, goto: 'c5_okafor', when: all(AM, not(nameKnown)) },
      { id: 'c5_yard_after', label: 'Окликнуть женщину с велосипедом', minutes: 15, combinable: true, when: all(AM, flag('$.c5_yard.done'), not(result('c5_yard', 'apart')), notDone('c5_yard_after')),
        text: '— На вокзал, — отвечает она. — Куда ещё. — Мальчик просит взять канистру, но она показывает на кресло: некуда. Ты придерживаешь дверь, пока они протискиваются мимо.', effects: once('c5_yard_after', [{ body: 'stress', delta: 3 }]) },
      wait, homeCheckpoint,
    ],
  }),
  S({
    id: 'c5_partner_room', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'На соседнем стуле', safe: true,
    text: [
      { when: all(partnerHere, { me: 'B' }, notDone('c5_partner.asked')),
        text: '{partner} смотрит на стену кухни. — Обычно это у них стул, — говоришь ты. {pm:Он|Она} поворачивается к тебе. — А если не они?' },
      { when: all(partnerHere, { me: 'A' }, notDone('c5_partner.asked')),
        text: 'За стеной скрипит. — Соседский стул, — говорит {partner} прежде, чем ты спрашиваешь. {pm:Он|Она} поворачивается к тебе.' },
      { when: all(partnerHere, flag('$.c5_partner.asked')),
        text: '{partner} садится боком, оставляя тебе место. За стеной опять скрипит. На этот раз никто не называет звук.' },
      { when: not(partnerHere), text: 'Ты придерживаешь пустой стул, чтобы он не ударил о стол.' },
    ],
    actions: [
      {
        id: 'c5_partner_ask', label: 'Спросить, о чём {partner} молчит', minutes: 8, combinable: true,
        when: all(partnerHere, notDone('c5_partner.asked')),
        outcomes: [
          { id: 'host', when: { me: 'B' },
            text: '— Ты каждый звук узнаёшь, — говорит {partner}. — Я жду, что и про следующий скажешь. — Ты убираешь ладони под стол.',
            effects: once('c5_partner.asked') },
          { id: 'guest', when: { me: 'A' },
            text: '— Раньше я могла сказать: это за стеной, — говорит {partner}. — И отвернуться. — {pm:Он|Она} проводит пальцем по столу, до самого края.',
            effects: once('c5_partner.asked') },
        ],
      },
      {
        id: 'c5_partner_honest', label: 'Сказать, что тебе тоже не по себе', minutes: 12,
        terminal: true, goto: 'c5_bflat', when: partnerHere,
        outcomes: [
          { id: 'host', when: { me: 'B' },
            text: '— Я не знаю, кто там, — говоришь ты. {partner} кивает. {pm:Он|Она} подвигает свой стул к твоему. — Тогда не будем угадывать.',
            effects: [{ set: '$.c5_partner.rested', value: false }, ...once('c5_partner'), { set: '$.c5_partner.result', value: 'honest' }, { body: 'stress', delta: -6 }] },
          { id: 'guest', when: { me: 'A' },
            text: 'Ты говоришь, что тоже прислушиваешься к каждому звуку. — Тогда не проси меня угадать следующий, — отвечает {partner}. {pm:Он|Она} разжимает пальцы на краю стола.',
            effects: [{ set: '$.c5_partner.rested', value: false }, ...once('c5_partner'), { set: '$.c5_partner.result', value: 'honest' }, { body: 'stress', delta: -6 }] },
        ],
      },
      {
        id: 'c5_partner_quiet', label: 'Остаться рядом, не расспрашивать', minutes: 10,
        terminal: true, goto: 'c5_bflat', when: partnerHere,
        text: 'Ты кладёшь ладонь на стол. {partner} накрывает её своей. За стеной снова скрипит.',
        effects: [{ set: '$.c5_partner.rested', value: false }, ...once('c5_partner'), { set: '$.c5_partner.result', value: 'quiet' }, { body: 'stress', delta: -4 }],
      },
      {
        id: 'c5_partner_space', label: 'Попросить немного тишины для себя', minutes: 5,
        terminal: true, goto: 'c5_bflat', when: partnerHere,
        text: '— Я побуду здесь, — говоришь ты, показывая на другой стул. {partner} отпускает его спинку. — Позови, если что. — Ты садишься, придерживая ножку ботинком.',
        effects: [{ set: '$.c5_partner.rested', value: false }, ...once('c5_partner'), { set: '$.c5_partner.result', value: 'space' }, { body: 'stress', delta: -2 }],
      },
      {
        id: 'c5_partner_return', label: 'Вернуться к своим вещам', minutes: 1,
        terminal: true, goto: 'c5_bflat', when: not(partnerHere),
      },
    ],
  }),
  S({ id: 'c5_stair', for: 'any', chapter: 'ch3', location: 'b_stairs', title: 'Между пролётами', universal: false,
    text: [
      { when: speaking, text: 'Ремень носилок намотан на руку Окафора. Перила оторвались от стены. — Не за руку, за раму! — кричит он. Нижний конец носилок уходит вниз.' },
      { when: not(speaking), text: 'Ты подхватываешь носилки на повороте. Перила вырываются из стены, и ремень тянет твою ладонь к краю. Человек внизу кричит: — За раму!' },
      { when: partnerHere, text: '{partner} держит тебя за пояс. — Если потянешь, я тебя не удержу. — Ремень ползёт по металлу.' },
      { when: { me: 'A' }, text: 'Из-за твоей спины просят закрыть дверь квартиры. Ты оборачиваешься на порог, но руку с ремня не снимаешь.' },
      { when: { me: 'B' }, text: 'Твоя дверь открыта за спиной. Ты видишь собственный порог между чужими ногами.' },
    ],
    onEnter: [{ learn: 'f_c3_okafor_name', quiet: true }],
    actions: [
      { id: 'c5_stair_lift', label: 'Подставить плечо под носилки', minutes: 12, risky: true, terminal: true, goto: 'c5_bflat',
        effects: [...once('c5_stair.done'), { set: '$.c5_stair.result', value: 'lift' }, { if: keeper('B'), then: [{ set: 'w.c3_b5', value: 'lift' }, { set: 'w.c3_b5_done', value: true }, { if: speaking, then: [{ npc: 'okafor', moveTo: 'c3_medical_van', set: { c3_left_on_stretcher: true } }] }] }],
        outcomes: [
          { id: 'guest_held', when: not(keeper('B')), check: { traits: ['strength', 'agility'], difficulty: 4, uses: ['mobility', 'strength'] }, text: 'Ты принимаешь раму на плечо. Медики подхватывают её снизу. {partner} остаётся у верхней двери. Ты окликаешь {pm:его|её}, не решаясь отпустить вес.', effects: [{ body: 'fatigue', delta: 12 }] },
          { id: 'guest_hurt', when: not(keeper('B')), text: 'Рама бьёт по ключице. Ты держишь её, пока снизу не подхватывают. {partner} кричит, чтобы ты отступил{m:|а}. Ты пытаешься показать, что услышал{m:|а}, но руку поднять не можешь.', effects: [{ injure: 'bruise', site: 'leftArm', severity: 2 }, { body: 'stress', delta: 12 }] },

          { id: 'held', when: keeper('B'), check: { traits: ['strength', 'agility'], difficulty: 4, uses: ['mobility', 'strength'] }, text: 'Рама ложится тебе на плечо. Ты спускаешься боком, ступенька за ступенькой. Медбрат остаётся в машине у больного. Дверь захлопывают, пока ты ещё держишься за борт.', effects: [{ body: 'fatigue', delta: 12 }] },
          { id: 'hurt', when: keeper('B'), text: 'Рама бьёт по ключице. Ты держишь её, пока снизу не подхватывают. Медбрат уезжает с больным. Когда машина трогается, ты не можешь поднять руку для прощания.', effects: [{ injure: 'bruise', site: 'leftArm', severity: 2 }, { body: 'stress', delta: 12 }] },
        ] },
      { id: 'c5_stair_pull', label: 'Вытащить руку, закрыть спуск', minutes: 8, terminal: true, goto: 'c5_bflat',
        outcomes: [{ id: 'guest', when: not(keeper('B')), text: 'Ты вытягиваешь ладонь из ремня. {partner} удерживает медбрата за ворот. Ты подхватываешь {pm:его|её} локоть. Снизу уже кричат, чтобы освободили лестницу.' }, { id: 'host', text: 'Ты дёргаешь ремень на себя. Носилки принимают люди снизу; рама срывает остаток ограждения. Кто-то кричит на тебя через пыль. Ты затаскиваешь обломки поперёк пролёта. Теперь за водой этим путём не выйти.' }],
        effects: [...once('c5_stair.done'), { set: '$.c5_stair.result', value: 'pull' }, { body: 'stress', delta: 10 }, { if: keeper('B'), then: [{ set: 'w.c3_b5', value: 'pull' }, { set: 'w.c3_b5_done', value: true }, { set: 'w.c3_b_stairs_closed', value: true }, { if: speaking, then: [{ npc: 'okafor', moveTo: 'b_flat', set: { c3_sheltered: true } }] }] }] },
      { id: 'c5_stair_leave', label: 'Отпустить раму и отступить', minutes: 5, terminal: true, goto: 'c5_bflat',
        outcomes: [{ id: 'guest', when: not(keeper('B')), text: 'Ты отступаешь от края. {partner} остаётся возле сорванных перил. Ты зовёшь {pm:его|её}, но голоса снизу заглушают тебя.' }, { id: 'host', text: 'Ты убираешь руку. Ремень режет чужую ладонь, и носилки с грохотом принимают внизу. — Зажми, — говорит медик. Ты слышишь это через закрывающуюся дверь машины.' }],
        effects: [...once('c5_stair.done'), { set: '$.c5_stair.result', value: 'leave' }, { body: 'stress', delta: 16 }, { if: keeper('B'), then: [{ set: 'w.c3_b5', value: 'leave' }, { set: 'w.c3_b5_done', value: true }, { if: speaking, then: [{ npc: 'okafor', moveTo: 'c3_medical_van', set: { c3_hand_crushed: true } }] }] }] },
    ],
  }),
  S({ id: 'c5_landing_B', for: 'any', chapter: 'ch3', location: 'b_stairs', title: 'Лестничная площадка', calm: true,
    text: [
      { when: { before: at(12, 7, 20) }, text: 'На ступеньке стоит детский ботинок. Снизу шепчут: — Я же велела рядом держать. — Ты ставишь ботинок на перила, где его видно.' },
      { when: all({ after: at(12, 7, 20) }, { before: at(12, 10, 10) }), text: 'Соседка тащит канистру за ручку. Мальчик помогает с другой стороны, хотя канистра пустая. Они останавливаются перед каждым пролётом.' },
      { when: all({ after: at(12, 10, 10) }, notDone('c5_yard.done')), text: 'Открытая дверь впускает шум двора. В проёме лежит гайка; ты чуть не наступаешь на неё. Из-за стены слышно: — Моё колесо. Положи.' },
      { when: flag('$.c5_yard.done'), text: 'Внизу тихо. На стене осталась чёрная полоса от покрышки. Ты закрываешь дверь, которую оставили настежь.' },
      { when: flag('$.c5_neighbors'), text: 'На стене карандашом написано «11:00». Ниже соседка приписала: «не вчерашнее». Подчеркнула дважды.' },
    ],
    actions: [
      { id: 'c5_neighbors', label: 'Спросить соседку о раздаче', minutes: 12, combinable: true, when: all(AM, notDone('c5_neighbors'), notDone('c5_yard.done')),
        text: '— В одиннадцать. Сказали вчера, — отвечает она. Ты показываешь на старую запись. — Нет, это позавчера. — Она стирает цифры рукавом, но они только размазываются.', effects: once('c5_neighbors') },
      { id: 'c5_water_queue', label: 'Идти с соседями за водой', minutes: 10, terminal: true, goto: 'c5_queue', when: all(AM, { after: at(12, 11) }, not(flag('w.c3_b_stairs_closed')), keeper('B'), notDone('c5_water_queue')) },

      toKnock, toCans, toYard, back, wait, homeCheckpoint,
    ],
  }),
  S({ id: 'c5_okafor', for: 'any', chapter: 'ch3', location: 'b_okafor', title: 'Дверь напротив', calm: true, onEnter: [{ learn: 'f_c3_okafor_name', quiet: true }],
    text: [
      { when: all({ me: 'A' }, partnerHere, notDone('c5_knock.done')), text: '— Это господин Окафор, — говорит {partner}. — Медбрат из квартиры напротив. — Ты отступаешь, чтобы {pm:он|она} видел{pm:|а} щель двери.' },
      { when: all(speaking, bitten), text: 'За дверью плещут водой из бутылки. Потом Окафор роняет крышку и долго ищет её на полу. Ты узнаёшь его кашель. Сегодня он старается кашлять тише.' },
      { when: all(speaking, not(bitten)), text: '— Секунду. Перчатки сниму. — Окафор отвечает, не подходя к двери. Что-то падает в ведро. Он ругается, потом говорит: — Теперь слушаю.' },
      { when: not(speaking), text: 'Ты зовёшь Окафора через дверь. Прикладываешь ухо. Собственное дыхание мешает услышать что-нибудь ещё.' },
      { when: all(result('c5_knock', 'cloth'), speaking), text: 'Окафор придерживает дверь твоим полотенцем. — Отойди, пожалуйста. — Он ждёт, пока ты уберёшь ногу с порога.' },
      { when: all(result('c5_knock', 'medical'), speaking), text: '— Ты им сказал{m:|а}? — спрашивает он. Ты отвечаешь. За дверью долго не двигаются.' },
    ],
    actions: [
      { id: 'c5_okafor_voice', label: 'Спросить, что с его рукой', minutes: 15, combinable: true, when: all(AM, speaking, bitten, notDone('c5_okafor_voice')),
        text: '— Укус, — говорит Окафор. Сразу добавляет: — Вчера. Я обработал. — На слове «обработал» голос срывается. Ты смотришь на свою руку возле его звонка и опускаешь её.', effects: once('c5_okafor_voice', [{ learn: 'f_c3_okafor' }, { npc: 'okafor', trust: 3 }]) },
      { id: 'c5_okafor_healthy', label: 'Узнать, кто ещё остался в доме', minutes: 2, terminal: true, goto: 'c5_rounds', when: all(AM, speaking, not(bitten), notDone('c5_okafor_healthy')) },
      toKnock, toCans, toYard, back, wait, homeCheckpoint,
    ],
  }),
  S({ id: 'c5_knock', for: 'any', chapter: 'ch3', location: 'b_okafor', title: 'Просьба через дверь', universal: false,
    text: [
      { when: partnerHere, text: '{partner} придерживает твою дверь. — Я здесь. — Между вами и соседом остаётся освещённая полоска пола.' },
      { when: all({ me: 'A' }, partnerHere), text: '— Господин Окафор, — говорит {partner}. — Мы вдвоём. — Сосед смотрит сначала на {pm:него|неё}, потом на тебя.' },
      { when: all({ me: 'A' }, not(partnerHere)), text: '— Окафор, медбрат, — представляется сосед. Он смотрит на твою руку у двери. — Не прислоняйся.' },
      { when: all(speaking, bitten, notDone('c5_knock.asked')), text: 'Окафор открывает на цепочку. Ты видишь мокрый лоб и забинтованную кисть. Когда дверь упирается, он дёргается всем телом. — Не сюда. Бутылку на пол.' },
      { when: all(speaking, not(bitten)), text: 'Окафор держит дверь локтем. На рукаве кровь, но руки целы. — Соседу снизу плохо. Я ходил к нему. Воды нет даже вымыться. — Он не приглашает войти.' },
      { when: all(speaking, bitten, flag('$.c5_knock.asked')), text: 'В щели видны его пальцы. Окафор обхватывает здоровой рукой больную. — Я слышу тебя. Не кричи. — Дверь между вами дрожит.' },
      { when: not(speaking), text: 'Ответа нет. Цепочка внутри двери не звенит. Ты отступаешь от щели.' },
    ],
    onEnter: [{ set: '$.c5_knock.started', value: true }, { learn: 'f_c3_okafor_name', quiet: true }],
    actions: [
      { id: 'c5_knock_ask', label: 'Спросить, пустит ли он помощь', minutes: 8, combinable: true, when: all(speaking, notDone('c5_knock.asked')),
        text: '— Врач пусть приходит. Соседи — нет, — говорит он. Ты спрашиваешь, ждать ли рядом. Ответ приходит после паузы. — Ты мне ничего не {m:должен|должна}.', effects: once('c5_knock.asked') },
      { id: 'c5_knock_water', label: 'Отдать свою бутылку воды', minutes: 8, terminal: true, goto: 'c5_bflat', when: speaking, enabled: { hasTag: 'drink' }, disabledReason: 'Питья при тебе нет',
        text: 'Ты ставишь бутылку у косяка. Окафор ждёт, пока ты отойдёшь, и тянется за ней двумя руками. — Спасибо. Дверь свою запри. — Это он говорит уже из темноты.',
        effects: [...once('c5_knock.done'), { set: '$.c5_knock.result', value: 'water' }, { takeTag: 'drink' }, { npc: 'okafor', trust: 5 }] },
      { id: 'c5_knock_cloth', label: 'Отдать ему своё полотенце', minutes: 10, terminal: true, goto: 'c5_bflat', when: speaking, enabled: { has: 'towel' }, disabledReason: 'Полотенца при тебе нет',
        text: 'Окафор просит бросить полотенце на порог. Ты наклоняешься, и он резко придерживает дверь. — Не надо. Я сам. — Ты выпрямляешься медленнее, чем нужно.',
        effects: [...once('c5_knock.done'), { set: '$.c5_knock.result', value: 'cloth' }, { take: 'towel' }, { npc: 'okafor', trust: 6 }] },
      { id: 'c5_knock_medical', label: 'Идти за медиком к машине', minutes: 35, terminal: true, goto: 'c5_bflat', when: speaking, risky: true,
        effects: [...once('c5_knock.done'), { set: '$.c5_knock.result', value: 'medical' }, { if: keeper('B'), then: [{ set: 'w.c3_okafor_reported', value: true }] }],
        outcomes: [
          { id: 'pass', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'На повороте лестницы навстречу несут носилки. Ты вжимаешься в стену. Чужая рука соскальзывает с простыни на твой рукав. Внизу медик записывает номер квартиры. К лестнице он не поворачивается.', effects: [{ body: 'fatigue', delta: 4 }] },
          { id: 'fall', text: '— Назад! — Носилки упираются в перила. Ты отступаешь мимо ступеньки и падаешь коленом на бетон. Медик поднимает тебя за локоть. Номер квартиры записывает на перчатке. Потом уходит с носилками.', effects: [{ injure: 'bruise', site: 'leftLeg', severity: 1 }, { body: 'fatigue', delta: 6 }, { set: '$.c5_medical_fall', value: true }] },
        ] },
      { id: 'c5_knock_wait_medical', label: 'Дождаться свободной лестницы и позвать медика', minutes: 55, terminal: true, goto: 'c5_bflat', when: speaking,
        text: 'Ты пропускаешь носилки, потом медсестру с сумкой. У машины уже другая очередь. Когда доходит твоя, медик просит повторить этаж. Пишет номер на перчатке. — Постараемся. — Этим же словом он отвечает следующему.', effects: [...once('c5_knock.done'), { set: '$.c5_knock.result', value: 'medical' }, { body: 'fatigue', delta: 4 }, { if: keeper('B'), then: [{ set: 'w.c3_okafor_reported', value: true }] }] },
      { id: 'c5_knock_refuse', label: 'Сказать, что сейчас не поможешь', minutes: 5, terminal: true, goto: 'c5_bflat', when: speaking,
        text: '— Хорошо, — говорит Окафор. Ты начинаешь объяснять, но дверь уже закрывается. Цепочку он не снимает.',
        effects: [...once('c5_knock.done'), { set: '$.c5_knock.result', value: 'refuse' }, { npc: 'okafor', trust: -4 }, { body: 'stress', delta: 4 }] },
      { id: 'c5_knock_leave', label: 'Вернуться и запереть свою дверь', minutes: 2, terminal: true, goto: 'c5_bflat', when: not(speaking), effects: once('c5_knock.done') },
    ],
  }),
  S({ id: 'c5_rounds', for: 'any', chapter: 'ch3', location: 'b_okafor', title: 'Три квартиры', calm: true,
    text: [
      { when: all(partnerHere, notDone('c5_rounds_ask'), notDone('c5_rounds_plan'), notDone('c5_rounds_fear')), text: '{partner} читает номера через твоё плечо. — Мы ведь тоже могли не ответить. — Ты отодвигаешь лист, чтобы {pm:он|она} видел{pm:|а} целиком.' },
      { when: notDone('c5_rounds_ask'), text: 'Окафор просовывает список под цепочкой. Бумага мокрая от его пальцев. — Эти отвечали вчера. Сегодня только одна. — Он стучит ногтем по двум пустым клеткам. — Сменишь меня?' },
      { when: flag('$.c5_rounds_ask'), text: 'Список висит между вами. Окафор держит его за верхний угол. Нижний уже оторвался и лежит возле твоей ноги.' },
      { when: flag('$.c5_rounds_fear'), text: '— Только через дверь, — добавляет Окафор. — Не открывать. Даже если попросят. — Он ждёт, чтобы ты ответил{m:|а}.' },
    ],
    actions: [
      { id: 'c5_rounds_ask', label: 'Спросить, почему он не входит', minutes: 8, combinable: true, when: notDone('c5_rounds_ask'), text: '— Потому что могу не выйти. Тогда никто не постучит в третью. Не надо считать меня смелым, — говорит он. — Я просто знаю номера.', effects: once('c5_rounds_ask') },
      { id: 'c5_rounds_fear', label: 'Спросить, сколько он уже не спал', minutes: 10, combinable: true, when: notDone('c5_rounds_fear'), text: 'Окафор считает, шевеля губами. Сбивается. — Вчера, наверное. — Он дописывает время рядом с номером квартиры. Зачёркивает: не тот час.', effects: once('c5_rounds_fear') },
      { id: 'c5_rounds_plan', label: 'Договориться, кого позвать при тишине', minutes: 8, combinable: true, when: notDone('c5_rounds_plan'), text: '— Не медиков. У них носилки заняты. Соседа с первого этажа. Он знает, как снять замок. — Окафор убирает руку с цепочки. — Вместе решать.', effects: once('c5_rounds_plan') },
      { id: 'c5_rounds_take', label: 'Обойти квартиры вместо него', minutes: 35, terminal: true, goto: 'c5_bflat', text: 'За первой дверью отвечают: «Живы». За второй кашляют, но к двери не идут. У третьей ты стоишь дольше всего. Время записываешь рядом с номером. Номера переписываешь себе. Лист возвращаешь Окафору через щель.', effects: [...once('c5_okafor_healthy'), { set: '$.c5_rounds.result', value: 'take' }, { body: 'stress', delta: 7 }, { body: 'fatigue', delta: 4 }] },
      { id: 'c5_rounds_refuse', label: 'Сказать, что не возьмёшь обход', minutes: 4, terminal: true, goto: 'c5_bflat', text: '— Хорошо. — Окафор складывает лист пополам. Ты объясняешь, что у тебя тоже есть за кого отвечать. — Я сказал: хорошо. — Он ждёт за дверью, пока ты уйдёшь.', effects: [...once('c5_okafor_healthy'), { set: '$.c5_rounds.result', value: 'refuse' }, { npc: 'okafor', trust: -2 }] },
    ],
  }),
  S({ id: 'c5_queue', for: 'any', chapter: 'ch3', location: 'b_street', title: 'У цистерны', ambient: { outdoor: true },
    text: [
      { when: partnerHere, text: '{partner} придерживает твою канистру коленом. — Нам тоже пить. — Женщина с ведром делает вид, что не слышит.' },
      { when: notDone('c5_queue_ask'), text: 'Женщина отмечает место в очереди пустым ведром. — Тут я. — Солдат отводит шланг от чужой бутылки. Вода течёт ему на ботинок, пока ищут крышку.' },
      { when: flag('$.c5_queue_ask'), text: 'Ведро уже у твоих ног. Его хозяйка ведёт ребёнка к стене. — Смотри на меня, — говорит она. Мальчик хочет сесть прямо на асфальт.' },
      { when: flag('$.c5_queue_time'), text: 'Солдат смотрит на часы после каждой канистры. До тебя ещё четыре человека. Один держит сразу три пустые бутылки, прижимая их подбородком.' },
    ],
    actions: [
      { id: 'c5_queue_ask', label: 'Спросить женщину, где её ребёнок', minutes: 6, combinable: true, when: notDone('c5_queue_ask'), text: '— За спиной. — Она не оборачивается. Ты показываешь на мальчика у стены. Женщина бросает ведро. — Я же сказала держаться. — Просит тебя пока занять место.', effects: once('c5_queue_ask') },
      { id: 'c5_queue_time', label: 'Узнать, вернётся ли цистерна вечером', minutes: 5, combinable: true, when: notDone('c5_queue_time'), text: '— По обстановке, — отвечает солдат. Ты просишь назвать хотя бы час. Он показывает на пустую строку в маршрутном листе. Сосед за тобой наклоняется тоже посмотреть.', effects: once('c5_queue_time') },
      { id: 'c5_queue_keep', label: 'Дождаться шести литров для своего дома', minutes: 65, terminal: true, goto: 'c5_bflat', text: 'Ты наполняешь канистру до метки. Женщина возвращается с мальчиком. Он смотрит, как вода плещется у тебя под крышкой. Шесть литров бьют по колену всю дорогу.', effects: [...once('c5_water_queue'), { set: '$.c5_queue.result', value: 'keep' }, { place: 'water_l', qty: 6, at: 'c3_b_stock' }, { body: 'fatigue', delta: 6 }] },
      { id: 'c5_queue_share', label: 'Отлить женщине два литра из своих шести', minutes: 70, terminal: true, goto: 'c5_bflat', text: 'Ты удерживаешь тяжёлую канистру, пока вода поднимается в её бутылке. Мальчик тянется к горлышку. — Дома, — говорит мать. Твою канистру теперь нести легче.', effects: [...once('c5_water_queue'), { set: '$.c5_queue.result', value: 'share' }, { place: 'water_l', qty: 4, at: 'c3_b_stock' }, { body: 'fatigue', delta: 5 }] },
      { id: 'c5_queue_leave', label: 'Вернуться, пока дома не начали искать', minutes: 10, terminal: true, goto: 'c5_bflat', text: 'Ты поднимаешь пустую канистру. Позади сразу сдвигают вёдра. Женщина ловит твой взгляд, но ничего не просит. На лестнице канистра гремит сильнее полной.', effects: [...once('c5_water_queue'), { set: '$.c5_queue.result', value: 'leave' }] },
    ],
  }),
  S({ id: 'c5_cans', for: 'any', chapter: 'ch3', location: 'b_stairs', title: 'Пустая канистра', universal: false,
    text: [
      { text: 'Соседка стоит с мальчиком у перил. Он держит чашку, она — канистру. — Нам до раздачи. На один чай, — говорит женщина. — Я верну.' },
      { text: 'Мальчик смотрит в чашку. На дне нарисована собака. Он закрывает её ладонью, когда замечает твой взгляд.' },
    ],
    actions: [
      { id: 'c5_cans_water', label: 'Отдать свою бутылку', minutes: 8, terminal: true, goto: 'c5_bflat', enabled: { hasTag: 'drink' }, disabledReason: 'Питья при тебе нет',
        text: 'Женщина сразу наливает мальчику. Он держит чашку обеими руками, пока она считает глотки. — Остальное на потом, — говорит она. Он не спорит.', effects: [...once('c5_cans.done'), { set: '$.c5_cans.result', value: 'water' }, { takeTag: 'drink' }] },
      { id: 'c5_cans_stock', label: 'Взять литр из общего запаса', minutes: 12, terminal: true, goto: 'c5_bflat', enabled: { stocked: 'water_l', qty: 1, at: 'c3_b_stock' }, disabledReason: 'В общем запасе нет литра',
        text: 'Женщина ждёт у двери. — Больше не надо, — говорит она, когда вода закрывает дно канистры. Ты доливаешь литр. Мальчик берётся за ручку вместе с ней.', effects: [...once('c5_cans.done'), { set: '$.c5_cans.result', value: 'stock' }, { unstock: 'water_l', qty: 1, at: 'c3_b_stock' }, { take: 'water_l', qty: 1 }] },
      { id: 'c5_cans_refuse', label: 'Оставить воду себе', minutes: 3, terminal: true, goto: 'c5_bflat',
        text: '— Понятно, — говорит женщина. Мальчик поднимает чашку, но она уже тянет его за рукав. Пластмасса стукает о перила на каждом пролёте.', effects: [...once('c5_cans.done'), { set: '$.c5_cans.result', value: 'refuse' }, { body: 'stress', delta: 4 }] },
    ],
  }),
  S({ id: 'c5_yard', for: 'any', chapter: 'ch3', location: 'b_yard', title: 'Колесо', universal: false, ambient: { outdoor: true },
    text: [
      { when: partnerHere, text: '{partner} становится рядом с ребёнком. — Сперва его отведём. — Мастер продолжает говорить о деньгах.' },
      { when: all(notDone('c5_yard.asked'), notDone('c5_yard.child')), text: 'Мастер держит колесо над головой. Женщина держит раму. Между ними мальчик в велосипедном шлеме. — Пять евро, — говорит мастер. — Камера моя.' },
      { when: all(notDone('c5_yard.asked'), notDone('c5_yard.child')), text: 'Женщина выворачивает карман. Выпадает билет. Мальчик тянется поднять его, и мастер резко опускает колесо. Мальчик замирает под его рукой.' },
      { when: flag('$.c5_yard.child'), text: 'Ребёнок стоит за матерью и держит её за пояс. Мастер опускает колесо к ногам. Пять евро он всё ещё требует.' },
      { when: all(flag('$.c5_yard.asked'), notDone('c5_yard.child')), text: 'Мальчик стоит между вами. Женщина держит пустой кошелёк обеими руками. Мастер стучит ключом по ободу. — Пять евро. Или помоги мне здесь.' },
      { when: result('c5_cans', 'refuse'), text: 'Женщина узнаёт тебя и отворачивается. Мальчик не отходит от твоей руки. Его чашка торчит из кармана куртки.' },
      { when: { any: [result('c5_cans', 'water'), result('c5_cans', 'stock')] }, text: '— Это нам воду дали, — говорит мальчик. Женщина кивает. Одной рукой она по-прежнему держит раму.' },
    ],
    onEnter: [{ set: '$.c5_yard.started', value: true }],
    actions: [
      { id: 'c5_yard_child', label: 'Вывести мальчика из-под колеса', minutes: 3, combinable: true, risky: true, when: notDone('c5_yard.child'),
        outcomes: [
          { id: 'clear', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты тянешь ребёнка к себе за куртку. Колесо проходит возле уха. Мальчик вцепляется в твой рукав; отцепить его удаётся только матери.', effects: once('c5_yard.child', [{ body: 'stress', delta: 5 }]) },
          { id: 'hit', text: 'Ты заслоняешь мальчика плечом. Обод ударяет по предплечью. Мастер отдёргивает колесо. — Не видел, — говорит он. — А его? — спрашиваешь ты, показывая на мальчика.', effects: once('c5_yard.child', [{ injure: 'bruise', site: 'leftArm', severity: 1 }, { body: 'stress', delta: 8 }]) },
        ] },
      { id: 'c5_yard_mother', label: 'Попросить мать забрать ребёнка', minutes: 5, combinable: true, when: notDone('c5_yard.child'), text: 'Женщина отпускает раму и берёт сына за плечи. Велосипед падает. Мастер успевает отставить ногу. — Ещё и это чинить? — Она не оборачивается.', effects: once('c5_yard.child', [{ body: 'stress', delta: 4 }]) },
      { id: 'c5_yard_ask', label: 'Спросить мастера, что за долг', minutes: 5, combinable: true, when: notDone('c5_yard.asked'),
        text: '— За спасибо я чиню дома, — говорит он. — У меня тоже едят. — Женщина показывает пустой кошелёк. Он даже не смотрит.', effects: once('c5_yard.asked') },
      { id: 'c5_yard_pay', label: 'Заплатить за неё пять евро', minutes: 12, terminal: true, goto: 'c5_bflat', enabled: { has: 'cash_eur', qty: 5 }, disabledReason: 'Нужно пять евро',
        text: 'Мастер разглаживает твою купюру о колено. Женщина отворачивается, пока он ставит колесо. Мальчик спрашивает, можно ли теперь ехать. Отвечаешь ему ты.', effects: [...once('c5_yard.done'), { set: '$.c5_yard.result', value: 'pay' }, { take: 'cash_eur', qty: 5 }] },
      { id: 'c5_yard_talk', label: 'Отдать свою крупу за ремонт', minutes: 15, terminal: true, goto: 'c5_bflat', enabled: { has: 'oats' }, disabledReason: 'Нужна пачка крупы',
        text: 'Ты предлагаешь хлопья. Мастер смотрит на пачку, на мальчика, снова на пачку. — Ладно. — Женщина придерживает велосипед, пока он затягивает гайку. Тебя она благодарит спиной.', effects: [...once('c5_yard.done'), { set: '$.c5_yard.result', value: 'talk' }, { take: 'oats' }] },
      { id: 'c5_yard_work', label: 'Отработать ремонт за неё', minutes: 55, terminal: true, goto: 'c5_bflat',
        text: 'Мастер ставит колесо и показывает на ободы у стены. — Камеры вынешь. Все. — Женщина ждёт у ворот, удерживая велосипед за руль. Мастер пересчитывает вынутые камеры: — Теперь {m:свободен|свободна}.',
        effects: [...once('c5_yard.done'), { set: '$.c5_yard.result', value: 'work' }, { body: 'fatigue', delta: 8 }] },
      { id: 'c5_yard_apart', label: 'Увести ребёнка, не платить долг', minutes: 8, terminal: true, goto: 'c5_bflat',
        text: 'Ты выводишь мальчика из-за рамы. Женщина идёт за вами, держа его шлем. — Пойдём пешком, — говорит она. Мастер окликает её один раз. Колесо не отдаёт.', effects: [...once('c5_yard.done'), { set: '$.c5_yard.result', value: 'apart' }, { body: 'stress', delta: 5 }] },
    ],
  }),
].map((scene): Scene => scene.id === 'c5_stair' ? scene : ({ ...scene, actions: [
  { id: 'c5_stair_go', label: 'К носилкам на лестнице', minutes: 1, terminal: true, goto: 'c5_stair', when: alarm },
  ...scene.actions.map(a => ({ ...a, when: all(a.when ?? { always: true }, not(alarm)) })),
] }));

export const bflat5Events: WorldEvent[] = [
  { id: 'ev_c5_stair', at: at(12, 11, 15), scope: 'world', interrupt: true, when: all(C5, atHome, { before: at(12, 11, 55) }, not(flag('w.c3_b5_done'))), effects: [], news: [{ channel: 'direct', text: 'На лестнице лопается крепёж. Кто-то кричит держать раму; по ступенькам гремит металл.' }] },
  { id: 'ev_c5_stair_missed', at: at(12, 11, 55), scope: 'world', when: all(C5, atHome, keeper('B'), not(flag('w.c3_b5_done'))), effects: [{ set: 'w.c3_b5', value: 'missed' }, { set: 'w.c3_b5_done', value: true }] },
  { id: 'ev_c5_knock', at: at(12, 7, 20), scope: 'world', interrupt: true, when: all(knock, atHome, notDone('c5_knock.started')), effects: [], news: [{ channel: 'direct', text: 'Сосед напротив стучит изнутри: два раза, пауза, ещё два. Потом называет номер вашей квартиры. Голос слышно через обе двери.' }] },
  { id: 'ev_c5_cans', at: at(12, 7, 20), scope: 'world', interrupt: true, when: all(cans, atHome), effects: [], news: [{ channel: 'direct', text: 'В дверь стучат снизу, детским кулаком. Женщина шепчет: «Не так громко». Потом стучит сама.' }] },
  { id: 'ev_c5_yard', at: at(12, 10, 10), scope: 'world', interrupt: true, when: all(yard, atHome, notDone('c5_yard.started')), effects: [], news: [{ channel: 'direct', text: 'Во дворе спорят о велосипеде. Мальчик кричит: «Мам». Сквозь окно слышно, как металл ударяет о стену.' }] },
];
