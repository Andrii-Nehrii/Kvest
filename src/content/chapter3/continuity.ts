// Отклики центральных сцен: видимы после слияния и в следующем участке.
import type { MergeNote, Scene, TextBlock } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { at } from '../../engine/time';
const first7History = (b: TextBlock): TextBlock => ({ ...b, when: all(b.when ?? { always: true }, not(flag('$.c7_history_seen'))) });
const morning7 = { after: at(13, 6) };
const firstHistory = (b: TextBlock): TextBlock => ({ ...b, when: all(b.when ?? { always: true }, not(flag('$.c6_history_seen'))) });

export const central8Notes: MergeNote[] = [
 { id: 'f8_window', when: { v: 'w.c3_f8', op: '==', value: 'window' }, text: 'Хенрике вытащили через окно. Кухня проветрена, дым перестал идти, но спать возле разбитого стекла нельзя. Оле спрашивает, кто останется с матерью.' },
 { id: 'f8_door', when: { v: 'w.c3_f8', op: '==', value: 'door' }, text: 'Хенрике не может поднять руку. Кухню проветрили, окно цело; дым больше не идёт. Оле просит вас повторить, что делать ночью, если ей станет хуже.' },
 { id: 'f8_missed', when: { v: 'w.c3_f8', op: '==', value: 'missed' }, text: 'Оле вынес мать через разбитое окно. Её плечо повреждено, тёплый угол кухни потерян. Вы придвигаетесь к ней, чтобы слышать тихий голос.' },
];
export const central7Notes: MergeNote[] = [
 { id: 'f7_kill', when: { v: 'w.c3_f7', op: '==', value: 'kill' }, text: 'Мартин погиб в сарае. Хенрике забрала его почтовую сумку, Оле вымыл лом. {partner} спрашивает, кто расскажет, если за ним придут.' },
 { id: 'f7_lock', when: { v: 'w.c3_f7', op: '==', value: 'lock' }, text: 'Мартин остался в запертом сарае. Кёлер показывает на свои вещи за дверью. Ночевать там теперь нельзя; вы ищете другое место.' },
 { id: 'f7_missed', when: { v: 'w.c3_f7', op: '==', value: 'missed' }, text: 'Кисть Кёлер повреждена дверью, Мартин заперт. Она просит отдельно повторить: зубами он её не задел. Хенрике осматривает рукав при вас обоих.' },
];
export const central6Notes: MergeNote[] = [
 { id: 'f6_gate_note', when: { v: 'w.c3_f6', op: '==', value: 'gate' }, text: 'Дениз может ходить. Вместо ворот теперь тележка и снятая створка; Хенрике не позволит оставить их без дежурного. {partner} спрашивает, когда сменят вас.' },
 { id: 'f6_flour_note', when: { v: 'w.c3_f6', op: '==', value: 'flour' }, text: 'Кёлер потеряла муку, пока вы вытаскивали Дениза. Теперь она просит место, а предложить взамен ей нечего. {partner} спрашивает тебя, из чьей еды ей дать ужин.' },
 { id: 'f6_missed_note', when: { v: 'w.c3_f6', op: '==', value: 'missed' }, text: 'Керем вытаскивал брата один. Дениз не наступает на ногу; ехать самому он сейчас не берётся. Вы освобождаете ему место ближе к печи.' },
 { id: 'b6_close_note', when: { v: 'w.c3_b6', op: '==', value: 'close' }, text: 'Вы пробуете закрыть дверь без плеча. Не выходит. {partner} подаёт тебе пуговицу, оставшуюся внутри. На ночь её кладёте рядом с ключом.' },
 { id: 'b6_inside_note', when: { v: 'w.c3_b6', op: '==', value: 'inside' }, text: 'Человек с площадки ночует на вашем сухом месте. Вы разговариваете у окна: в кухне он услышит. Куртки пока не снимаете.' },
 { id: 'b6_food_note', when: { v: 'w.c3_b6', op: '==', value: 'food' }, text: 'Вы вспоминаете, кто протянул еду через дверную ручку. Пачки больше нет. {partner} спрашивает, где сейчас сидит тот человек; ты слушаешь площадку.' },
];

export const central5Notes: MergeNote[] = [
  { id: 'm5_hold_note', when: { v: 'w.c3_m5', op: '==', value: 'hold' }, text: 'Врач осталась в зале с перевязанной шеей. Вы показываете друг другу руки. К столу уже снова подходят люди; никто не знает, можно ли её сейчас звать.' },
  { id: 'm5_door_note', when: { v: 'w.c3_m5', op: '==', value: 'door' }, text: 'После побега служебную дверь закрыли на цепь, врач ушла с солдатами. Вы сравниваете, что у каждого осталось для перевязки. Кольцо возле мыла пока никто не забрал.' },
  { id: 'm5_back_note', when: { any: [{ v: 'w.c3_m5', op: '==', value: 'back' }, { v: 'w.c3_m5', op: '==', value: 'missed' }] }, text: 'Врача увезли раненой. Сосед принёс её жилет к своим вещам: вдруг спросят, где она. Вы освобождаете для него край раскладушки.' },
  { id: 'f5_shield_note', when: { v: 'w.c3_f5', op: '==', value: 'shield' }, text: 'За столом остаётся Павлово место. Ружьё лежит у печи с разбитым прикладом. Вы решаете, кто пойдёт на дежурство с Оле: один он теперь не выходит.' },
  { id: 'f5_coop_note', when: { v: 'w.c3_f5', op: '==', value: 'coop' }, text: 'Вы спрашиваете друг друга, кто отнесёт Павлу телефон. Ключ от курятника всё ещё у Оле. Поставленная возле двери тарелка остыла.' },
  { id: 'f5_leave_note', when: { v: 'w.c3_f5', op: '==', value: 'leave' }, text: 'Павел ушёл пешком. Вы достаёте телефоны: номер можно стереть, можно оставить. Ни один пока не нажимает.' },
  { id: 'b5_lift_note', when: { v: 'w.c3_b5', op: '==', value: 'lift' }, text: 'Вы повторяете друг другу, как держали носилки. Медбрат уехал с машиной. Соседская дверь осталась без ключа изнутри.' },
  { id: 'b5_pull_note', when: { v: 'w.c3_b5', op: '==', value: 'pull' }, text: 'Медбрат остался в вашей квартире, зато общий спуск завален. Вы показываете друг другу, где теперь нельзя пройти с канистрой.' },
  { id: 'b5_leave_note', when: { any: [{ v: 'w.c3_b5', op: '==', value: 'leave' }, { v: 'w.c3_b5', op: '==', value: 'missed' }] }, text: 'Машина увезла медбрата с повреждённой рукой. {partner} спрашивает, успел{m:|а} ли ты что-нибудь сказать ему. Ты вспоминаешь только скрип ремня.' },

  { id: 'n5_fight_note', when: { v: 'w.c3_n5', op: '==', value: 'fight' }, text: 'У кухни снова очередь. Вы обсуждаете, кто держал стойку; Хинрихсен туда пока не пускают. Вы решаете, кому отнести ей еду.' },
  { id: 'n5_closed_note', when: { any: [{ v: 'w.c3_n5', op: '==', value: 'close' }, { v: 'w.c3_n5', op: '==', value: 'leave' }, { v: 'w.c3_n5', op: '==', value: 'missed' }] }, text: 'Кухня сгорела. {partner} пересчитывает оставшуюся личную еду и останавливается, заметив твой взгляд. Имя Хинрихсен вы произносите тише.' },
];
const b5After: TextBlock[] = [
  { when: { v: 'w.c3_b5', op: '==', value: 'lift' }, text: 'Медбрат не возвращается к обеду. Ты замечаешь его ключ в наружной стороне замка. {partner} просит пока его не трогать.' },
  { when: { v: 'w.c3_b5', op: '==', value: 'pull' }, text: 'Обломки на пролёте никто не убрал. Медбрат сидит у вашей двери, завернув руку в полотенце. Он спрашивает, сколько воды осталось дома.' },
  { when: { any: [{ v: 'w.c3_b5', op: '==', value: 'leave' }, { v: 'w.c3_b5', op: '==', value: 'missed' }] }, text: 'Уехавшая машина не возвращается. Ты подходишь к перилам и останавливаешься за шаг до ремня. На мокром металле виден отпечаток ладони.' },
];
const n5After: TextBlock[] = [
 { when: { v: 'w.c3_n5', op: '==', value: 'fight' }, text: 'У раздачи тебя пропускают без очереди. Хинрихсен придерживает миску здоровой рукой. — Не за руку меня тогда тянул{m:|а}. Спасибо.' },
 { when: { any: [{ v: 'w.c3_n5', op: '==', value: 'close' }, { v: 'w.c3_n5', op: '==', value: 'leave' }, { v: 'w.c3_n5', op: '==', value: 'missed' }] }, text: 'Чёрный котёл лежит у ограды. К нему приносят пустые миски, потом уносят обратно. Хинрихсен смотрит из раздевалки, не выходя.' },
];
const promise5After: TextBlock[] = [
 { when: all({ flag: 'w.c3_farm_rest5' }, { at: 'hof_luedemann' }, { npc: 'henrike', alive: true, at: 'hof_luedemann' }), text: 'Хенрике проносит ведро мимо вашей лавки. {partner} убирает ноги с прохода. Хозяйка не останавливается.' },
 { when: { flag: 'w.c3_shift5' }, text: 'Человек, которого вы сменили, уже спит. {partner} показывает, где остались ваши вещи. Отсюда их не видно.' },
 { when: { flag: 'w.c3_bed5_lost' }, text: 'На вашем сухом месте лежит чужое одеяло. {partner} останавливается возле него и идёт дальше. Сумки вы ставите у прохода.' },
 { when: { flag: 'w.c3_house_empty5' }, text: 'Ты проверяешь, остался ли ключ у {partner.gen}. {pm:Он|Она} показывает его, не вынимая из кармана. У двери вас никто не сменит.' },
 { when: { flag: 'w.c3_exchange_load5' }, text: 'Хенрике выставила приготовленный мешок в сени. {partner} пробует поднять его за узел. — На двоих. — Ты берёшь снизу.' },
 { when: { flag: 'w.c3_mclinic_help5' }, text: 'Врач ждёт вас возле стула, который вы ей принесли. {partner} снимает куртку с вашей бывшей раскладушки. Пациент садится, придерживая повязку.' },
];
export function withCentralEchoes(scene: Scene): Scene {
  if (scene.id === 'c8_farm') return { ...scene, text: [...([
    { when: { v: 'w.c3_f7', op: '==', value: 'kill' }, text: 'Почтовая сумка висит в сенях. Хенрике просит не перекладывать её к вашим вещам. Оле отодвигает свою куртку.' },
    { when: { v: 'w.c3_f7', op: '==', value: 'lock' }, text: 'Из сарая стучат по закрытому окну. Кёлер остаётся на кухне. — Пальто там. Не пойду за ним. — Хенрике приносит ей одеяло.' },
    { when: { v: 'w.c3_f7', op: '==', value: 'missed' }, text: 'Кёлер не может завязать рукав над повязкой. Хенрике помогает, не спрашивая. Оле держит ткань с другой стороны.' },
    { when: flag('$.c7_fpair.hour'), text: '{partner} показывает на часы. — Наш час. Помнишь? — Ты останавливаешься возле лавки.' },
    { when: flag('$.c7_fpawel.recorded'), text: 'Павел просит включить сохранённую запись. На первом слове тянется остановить. Потом убирает руку.' },
    { when: flag('w.c3_f7_guard'), text: 'Оле возвращается за ключом, когда ваша смена кончается. — Живой? — спрашивает он. Ты показываешь на дверь, за которой снова скребут.' },
    { when: flag('w.c3_f7_rest'), text: '{partner} садится рядом. — Теперь наш час. — Хенрике видит вас и сама закрывает кухонную дверь.' },
    ] as TextBlock[]).map(b => ({ ...b, when: all(b.when ?? { always: true }, not(flag('$.c8_history_seen'))) })), ...scene.text], actions: scene.actions.map(a => ({ ...a, effects: [{ set: '$.c8_history_seen', value: true }, ...(a.effects ?? [])] })), onEnter: scene.onEnter };
  if (scene.id === 'c7_farm') return { ...scene, text: [...([
    { when: all(morning7, flag('w.c3_f6_bed_lost'), { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' }), text: 'Кёлер лежит на вашем вчерашнем месте. {partner} встаёт возле двери, держась за поясницу. — Сегодня я лягу раньше. Договорились?' },
    { when: all(morning7, flag('w.c3_guest_contract'), { npcVar: 'c3_koehler', key: 'separate' }, { npc: 'c3_koehler', alive: true, at: 'hof_luedemann' }), text: 'Кёлер возвращает хозяйке ключ от сарая. — Стучала ночью. Вы не слышали? — Хенрике отодвигает ей место у печи.' },
    { when: all(morning7, flag('w.c3_f6_refused')), text: '{partner} спрашивает, где переночевала женщина. Хенрике показывает на двор. Следы от тележки уходят к дороге.' },
    { when: all(morning7, flag('w.c3_guest_food_only')), text: 'Хенрике подбирает у ворот обёртку от пачки. — Ушла. — Ты смотришь на дорогу, по которой женщина приходила вчера.' },
    { when: all(morning7, { v: 'w.c3_f6', op: '==', value: 'gate' }), text: 'Хенрике будит дежурного у ворот. Дениз просит ещё минуту и поднимается без помощи. Створка всё ещё лежит поперёк тележки.' },
    { when: all(morning7, { v: 'w.c3_f6', op: '==', value: 'flour' }, { npc: 'kerem', alive: true, at: 'hof_luedemann' }, { npc: 'deniz', alive: true, at: 'hof_luedemann' }), text: 'Керем смотрит на белую корку у ворот. — Я бы тоже разрезал. — Дениз просит его говорить тише.' },
    { when: all(morning7, { v: 'w.c3_f6', op: '==', value: 'missed' }), text: 'Керем придерживает брата, пока тот идёт к выходу. Дениз ругается на тесную обувь. Свой ботинок он так и не надел.' },
    ] as TextBlock[]).map(first7History), ...scene.text], actions: scene.actions.map(a => ({ ...a, effects: [{ if: morning7, then: [{ set: '$.c7_history_seen', value: true }] }, ...(a.effects ?? [])] })), onEnter: [...(scene.onEnter ?? []), { if: all(flag('w.c3_f6_bed_lost'), not(flag('$.c3_f6_sleep_cost'))), then: [{ set: '$.c3_f6_sleep_cost', value: true }, { body: 'sleepDebt', delta: 2 }] }] };
  if (scene.id === 'c7_bflat') return { ...scene, text: [
    { when: { v: 'w.c3_b6', op: '==', value: 'close' }, text: 'Утром ты открываешь дверь обеими руками. Человек этажом выше застёгивает куртку, оставляя один край свободным. Ты вспоминаешь пуговицу возле ключа.' },
    { when: { v: 'w.c3_b6', op: '==', value: 'inside' }, text: 'На вашем месте спит вчерашний человек. Носки он положил под голову. Ты поднимаешь свой рюкзак с пола.' },
    { when: { v: 'w.c3_b6', op: '==', value: 'food' }, text: 'Ты выходишь на площадку. Мужчина подметает оболочку хлебцев к стене. Увидев тебя, берёт её рукой.' },
    ...scene.text] };
  if (['c6_bflat', 'c6_north', 'c6_farm', 'c6_messe'].includes(scene.id)) scene = { ...scene, text: [...promise5After.map(firstHistory), ...scene.text], actions: scene.actions.map(a => ({ ...a, effects: [...(a.effects ?? []), { set: '$.c6_history_seen', value: true }, ...(scene.id === 'c6_bflat' ? [
 { if: flag('w.c3_b_note'), then: [{ set: '$.c6_note_echo', value: true }] },
 { if: flag('$.c6_chair_lost'), then: [{ set: '$.c6_chair_echo', value: true }] },
 { if: flag('$.c6_water.gave'), then: [{ set: '$.c6_water_echo', value: true }] },
 { if: flag('$.c6_pair.said'), then: [{ set: '$.c6_pair_echo', value: true }] },
 { if: flag('$.c6_call.listened'), then: [{ set: '$.c6_call_echo', value: true }] },
 ] as import('../../engine/types').Effect[] : [])] })) };
  if (scene.id === 'c6_messe') return { ...scene, text: [
    { when: { v: 'w.c3_m5', op: '==', value: 'hold' }, text: 'Врач говорит шёпотом. К ней наклоняются слишком близко; она отстраняет пациента ладонью. На стуле перед ней сидит очередь.' },
    { when: { v: 'w.c3_m5', op: '==', value: 'door' }, text: 'Кольцо забирает солдат в бумажном пакете. Он спрашивает, чьё. Ответить успевают сразу трое.' },
    { when: { any: [{ v: 'w.c3_m5', op: '==', value: 'back' }, { v: 'w.c3_m5', op: '==', value: 'missed' }] }, text: 'Машина с врачом ушла. Солдат разворачивает очередь от пустого стола. Жилет на соседской раскладушке уже сложен рукавами внутрь.' },
    ...scene.text] };
  if (scene.id === 'c6_farm') return { ...scene, text: [
    firstHistory({ when: { v: 'w.c3_f5', op: '==', value: 'shield' }, text: 'Оле замечает твою куртку рядом со своей. — На воротах сменишь? — Павел остаётся у печи.' }),
    firstHistory({ when: { v: 'w.c3_f5', op: '==', value: 'coop' }, text: 'Из курятника стучат ложкой по двери. Хенрике ставит миску на подоконник. — Отнесёшь. — Ключа возле миски нет.' }),
    firstHistory({ when: { v: 'w.c3_f5', op: '==', value: 'leave' }, text: 'На крючке осталась запасная Павлова куртка. Хенрике снимает её и уносит в сени. Ты ещё слышишь, как он просил стереть номер.' }),
    ...scene.text] };
  if (scene.id === 'c6_north') return { ...scene, text: [...n5After.map(firstHistory), ...scene.text] };
  if (scene.id === 'c6_bflat') return { ...scene, text: [...b5After.map(firstHistory), ...scene.text] };
  return scene;
}
