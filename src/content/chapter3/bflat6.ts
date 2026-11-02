import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, not, flag, keeper, npcHere } from './world3';
const S = (s: Scene) => s;
const C = all({ cp: 5 }, not({ cp: 6 }));
const DAY: Cond = { before: at(12, 17) };
const pair = all(flag('w.together'), { partnerAt: 'b_flat' }, { partner: 'active' });
const merle = npcHere('merle', 'b_flat');
const medic = all({ npc: 'okafor', alive: true }, { any: [{ npc: 'okafor', at: 'b_okafor' }, { npc: 'okafor', at: 'b_flat' }] });
const fresh = (id: string) => not(flag(`$.${id}`));
const res = (v: string): Cond => ({ v: 'w.c3_b6', op: '==', value: v });
const alarm = all(C, { after: at(12, 19) }, { before: at(12, 19, 45) }, fresh('c6_bdoor.done'), not(flag('w.c3_b6_done')));
const back: ActionDef = { id: 'c6_back', label: 'Вернуться на кухню', minutes: 2, terminal: true, goto: 'c6_bflat' };
const wait: ActionDef = { id: 'c6_wait', label: 'Посидеть час возле своих вещей', minutes: 60, repeatable: true, activity: 'rest', text: 'Сосед за стеной передвигает мебель. В последний раз он только кашляет.' };
export const bflat6Scenes: Scene[] = [
 S({ id: 'c6_bflat', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'После полудня', safe: true,
  text: [
   { when: all(DAY, { v: '$.c5_yard.result', op: '==', value: 'talk' }), text: 'Во дворе мастер всё ещё возится с колесом. Мальчик бежит за ним с твоей пачкой хлопьев и не отдаёт её никому.' },
   { when: all({ me: 'B' }, DAY, fresh('c6_history_seen')), text: 'У твоего места лежит чужая куртка. Ты поднимаешь её двумя пальцами за ворот. Хозяин тянется следом, не давая повесить на крючок.' },
   { when: all({ me: 'A' }, pair, DAY, fresh('c6_history_seen')), text: '{partner} показывает, куда положить твою куртку. Ты спрашиваешь про соседний крючок. — Там могут ещё повесить. — {pm:Он|Она} освобождает свой.' },
   { when: all({ after: at(12, 17) }, fresh('c6_bdoor.done'), not(flag('w.c3_b6_done'))), text: 'За кухонным окном в чужом доме зажигают свет. Через минуту гасят. Соседка с площадки спрашивает через дверь, видно ли её фонарь со двора.' },
   { when: all(merle, pair, { me: 'A' }, DAY), text: '{partner} зовёт соседку: — Мерле, иди сюда. — Девушка берёт кружку, но к столу пока не подходит.' },
   { when: flag('w.c3_b_light_room'), text: 'За твоими вещами спит ребёнок. Женщина держит фонарь под курткой. По твоему рюкзаку она переступает, чтобы не разбудить.' },
   { when: all(merle, DAY), text: 'Мерле смотрит на твои руки поверх кружки. — Две штуки. Обе на месте. Уже неплохо. — Пить она пока не начинает.' },
   { when: all(not(merle), { me: 'B' }, DAY, fresh('c6_history_seen')), text: 'На полке осталась Мерлина пустая коробка. Ты ставишь её на бок, чтобы не попадалась надпись. Падающую крышку ловишь коленом.' },
   { when: all({ before: at(12, 15, 30) }, fresh('c6_water.done'), not(fresh('c6_history_seen'))), text: 'Соседка оставляет у вашего порога пустую тару. — Я потом. — Она касается ручки бутылки и уходит без неё.' },
   { when: all({ after: at(12, 15, 30) }, { before: at(12, 17) }), text: 'В сенях соседка ждёт, пока освободится крючок для её пальто. Она не снимает его сама. Под мокрым подолом темнеет пол.' },
   { when: all(flag('w.c3_b_note'), fresh('c6_note_echo')), text: 'На внешней стороне двери приклеена записка. Соседка просит не сорвать её замком. Имя дочери продавлено карандашом насквозь.' },
   { when: all(flag('$.c6_chair_lost'), fresh('c6_chair_echo')), text: 'Твой стул подпирает окно. Ты присаживаешься возле него на пол. Соседка поправляет под тобой край подстилки.' },
   { when: res('close'), text: 'Под дверью лежит оторванная пуговица. Ты подбираешь её, но в карман не кладёшь. С площадки спрашивают, можно ли забрать.' },
   { when: res('inside'), text: 'Незнакомец сидит на вашем сухом месте. Обувь держит в руках. Ты проходишь боком, чтобы он не подумал, что нужно встать.' },
   { when: res('food'), text: 'У двери осталась бумажная обёртка. На ней отпечатались мокрые пальцы. Из темноты площадки больше не просят.' },
   { when: all(flag('$.c6_bdoor.done'), not(flag('w.c3_b6_done'))), text: 'Ты садишься возле стены, откуда видна дверь. {partner} остаётся у проёма. Спрашивать через всю кухню ты не станешь.' },
   { when: all(flag('$.c6_water.gave'), fresh('c6_water_echo')), text: 'Соседка возвращает пустую бутылку. На дне осталась ложка воды. Она не выливает её, пока ты не скажешь, что всё.' },
   { when: all(flag('$.c6_pair.said'), fresh('c6_pair_echo')), text: '{partner} касается твоего плеча, проходя мимо. Ты сдвигаешься, оставляя место.' },
   { when: all(flag('$.c6_call.listened'), fresh('c6_call_echo')), text: 'Соседка присаживается возле твоих вещей, чтобы снова включить запись. Ты отодвигаешь кружку от её телефона.' },
  ], actions: [
   { id: 'c6_pair_go', label: 'Отойти поговорить с {partner.ins}', minutes: 2, terminal: true, goto: 'c6_bpair', when: all(pair, fresh('c6_pair.done')) },
   { id: 'c6_bmeal', label: 'Сесть за еду рядом с {partner.ins}', minutes: 2, terminal: true, goto: 'c6_bmeal_room', when: all(pair, DAY, fresh('c6_bmeal')) },
   { id: 'c6_bwater_go', label: 'Ответить соседке с пустой тарой', minutes: 2, terminal: true, goto: 'c6_patient', when: all({ after: at(12, 14, 20) }, fresh('c6_water.done')) },
   { id: 'c6_blight_go', label: 'К разговору о свете в окнах', minutes: 2, terminal: true, goto: 'c6_blight', when: all({ after: at(12, 17, 30) }, fresh('c6_light.done')) },
   { id: 'c6_bmedic_go', label: 'Спросить медбрата о его руке', minutes: 2, terminal: true, goto: 'c6_okafor', when: all(medic, fresh('c6_bmedic.done')) },
   { id: 'c6_blanding_go', label: 'К голосу на площадке', minutes: 2, terminal: true, goto: 'c6_landing_B', when: all({ after: at(12, 15, 30) }, { before: at(12, 19) }, fresh('c6_landing.done')), effects: [{ move: 'b_stairs' }] },
   { id: 'c6_bmerle_go', label: 'Посидеть с Мерле у её вещей', minutes: 2, terminal: true, goto: 'c6_medicine', when: all(merle, fresh('c6_merle.done')) },
   { id: 'c6_bwindow', label: 'К соседке у тяжёлой ставни', minutes: 2, terminal: true, goto: 'c6_bshutter', when: all({ after: at(12, 16, 40) }, fresh('c6_bwindow')) },
   { id: 'c6_bshift', label: 'Отсидеть обещанную соседям смену', minutes: 35, when: all(flag('w.c3_shared5'), fresh('c6_bshift')), text: 'Сосед приносит тебе кружку и уходит спать. Снизу стучат. Ты отвечаешь, не называя имени, и узнаёшь собственный голос не сразу.', effects: once('c6_bshift', [{ body: 'fatigue', delta: 5 }]) },
   { id: 'c6_bquiet_neighbour', label: 'Спросить соседку, почему она осталась одна', minutes: 2, terminal: true, goto: 'c6_bnote', when: fresh('c6_bquiet_neighbour') },
   { id: 'c6_bcall_go', label: 'Послушать, кого соседка записала на телефон', minutes: 2, terminal: true, goto: 'c6_bcall', when: fresh('c6_call.done') },
   wait, cpAction(6),
  ] }),
 S({ id: 'c6_bpair', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Между вами', calm: true,
  text: [{ when: { me: 'B' }, text: 'Ты закрываешь дверь кухни. {partner} придерживает её, чтобы замок не щёлкнул. — Тебе тут где спокойно? — На полу лежит его рюкзак.' }, { when: { me: 'A' }, text: '{partner} закрывает дверь кухни и остаётся стоять возле неё. — Раньше я здесь не слушала. — Ты отодвигаешь свой рюкзак, освобождая проход.' }], actions: [
   { id: 'c6_pair_before', label: 'Спросить, о чём вы молчите с утра', minutes: 6, when: fresh('c6_pair_before'), text: '{partner} смотрит на дверь. — Ты когда-нибудь перестанешь проверять? — Ты касаешься ручки ещё раз и отпускаешь. {pm:Он|Она} остаётся рядом.', effects: once('c6_pair_before') },
   { id: 'c6_pair_say', label: 'Попросить не решать за тебя у этой двери', minutes: 10, terminal: true, goto: 'c6_bflat', text: '— И ты за меня, — отвечает {partner}. Ты отодвигаешь рюкзак ещё дальше. {pm:Он|Она} убирает руку с двери.', effects: [...once('c6_pair.done'), { set: '$.c6_pair.said', value: true }, { body: 'stress', delta: 3 }] },
   { id: 'c6_pair_hold', label: 'Побыть рядом, не возвращаясь к утру', minutes: 15, terminal: true, goto: 'c6_bflat', text: 'Ты кладёшь ладонь на плечо {partner.gen}. {pm:Он|Она} поворачивается под ней и касается тебя лбом. В коридоре просят пропустить; вы отступаете вместе.', effects: once('c6_pair.done', [{ body: 'stress', delta: -5 }]) },
 ] }),
 S({ id: 'c6_bmeal_room', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'На ладони половина', universal: false,
  text: [{ text: '{partner} разламывает хлеб пополам. В коридоре соседка разворачивает пустую салфетку. На вопрос про еду отвечает: — Ищу, куда убрала.' }], actions: [
   { id: 'c6_bmeal_eat', label: 'Съесть свою половину сейчас', minutes: 15, terminal: true, goto: 'c6_bflat', text: 'Ты берёшь ближайшую половину. {partner} прижимает свою ладонью к столу, чтобы не раскрошилась. Соседка садится спиной к кухне.', effects: once('c6_bmeal', [{ body: 'hunger', delta: -12 }]) },
   { id: 'c6_bmeal_give', label: 'Отдать свою половину соседке', minutes: 8, terminal: true, goto: 'c6_bflat', text: 'Она принимает хлеб в салфетку. — Ела уже. На потом. — Ты отходишь, прежде чем она начинает отламывать край.', effects: once('c6_bmeal', [{ body: 'stress', delta: 4 }]) },
 ] }),
 S({ id: 'c6_bnote', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Дверь, которую найдут', universal: false,
  text: [{ text: '— Муж у дочери. Телефон сел, — говорит соседка. На бумаге она пишет номер вашей квартиры. — Можно здесь оставить? Если вернутся, эту дверь найдут.' }, { when: pair, text: '{partner} читает номер через её плечо. — Она будет знать, что тут кто-то есть. — Соседка ждёт, кому из вас отдать бумагу.' }], actions: [
   { id: 'c6_note_when', label: 'Спросить, когда они должны были вернуться', minutes: 4, when: fresh('c6_note_when'), text: '— Он всегда к ужину. Даже если ссорились. — Она смотрит на бумагу, где нет ни его имени, ни времени. Дописывать не начинает.', effects: once('c6_note_when') },
   { id: 'c6_note_yes', label: 'Позволить повесить записку на вашей двери', minutes: 5, terminal: true, goto: 'c6_bflat', outcomes: [{ id: 'guest', when: not(keeper('B')), text: 'Ты принимаешь бумагу. Соседка ищет скотч, {partner} подходит к двери. Ты показываешь {pm:ему|ей} написанный номер.' }, { id: 'owner', text: 'Она приклеивает листок снаружи. — Спасибо. — Имя дочери пишет крупнее.' }], effects: once('c6_bquiet_neighbour', [{ if: keeper('B'), then: [{ set: 'w.c3_b_note', value: true }] }]) },
   { id: 'c6_note_no', label: 'Попросить не указывать вашу квартиру', minutes: 4, terminal: true, goto: 'c6_bflat', text: 'Соседка вычёркивает номер. Бумагу складывает на четыре части. На вопрос, где оставит, показывает свой карман.', effects: once('c6_bquiet_neighbour', [{ body: 'stress', delta: 5 }]) },
 ] }),
 S({ id: 'c6_bshutter', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'За окно не высовываться', universal: false,
  text: [{ text: 'Соседка держит оторванную ставню за нижний край. — Возьми выше. — Дерево мокрое, крюк остался снаружи. Под твоими ногами стоит единственный свободный стул.' }, { when: pair, text: '{partner} придерживает соседку за пояс. — Сначала зацепи. Я не держу окно. — Она переступает дальше от рамы.' }], actions: [
   { id: 'c6_shutter_hold', label: 'Дотянуться до крюка, удерживая ставню', minutes: 15, terminal: true, goto: 'c6_bflat', risky: true, outcomes: [
    { id: 'held', check: { traits: ['technical'], difficulty: 3, uses: ['focus'] }, text: 'Ты держишь ставню, пока соседка заводит крюк. — Раньше муж делал. — Она тянет тебя внутрь, прежде чем ты отпускаешь раму.', effects: once('c6_bwindow', [{ body: 'fatigue', delta: 4 }]) },
    { id: 'hit', text: 'Крюк срывается. Ставня бьёт по твоему предплечью. Соседка оттаскивает тебя за пояс; створка остаётся хлопать снаружи.', effects: once('c6_bwindow', [{ injure: 'bruise', site: 'leftArm', severity: 2 }]) },
   ] },
   { id: 'c6_shutter_chair', label: 'Заклинить раму своим стулом', minutes: 10, terminal: true, goto: 'c6_bflat', text: 'Соседка держит раму, пока ты заводишь спинку под ручку. — Сядешь на мой. — Она уходит, так и не сказав, где он стоит.', effects: once('c6_bwindow', [{ set: '$.c6_chair_lost', value: true }, { body: 'stress', delta: 3 }]) },
 ] }),
 S({ id: 'c6_bcall', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Неудалённое сообщение', calm: true,
  text: [{ text: 'Соседка подносит телефон к твоему уху. Девичий голос просит больше не звонить: «Я сама». Запись обрывается на вдохе. Женщина включает сначала.' }, { when: pair, text: '{partner} отходит, но соседка зовёт и {pm:его|её}. — Ты тоже послушай. Вдруг там ещё что-то.' }], actions: [
   { id: 'c6_call_when', label: 'Спросить, когда пришло сообщение', minutes: 4, when: fresh('c6_call_when'), text: '— Вчера. Вот, время. — Она показывает экран слишком близко. Палец закрывает число; ты просишь убрать, и она сразу отдёргивает руку.', effects: once('c6_call_when') },
   { id: 'c6_call_breath', label: 'Спросить, что она пытается расслышать', minutes: 4, when: fresh('c6_call_breath'), text: '— Шаги. Она идёт или стоит? — Ты просишь прибавить звук. Теперь слышнее только чужой вдох.', effects: once('c6_call_breath') },
   { id: 'c6_call_reply', label: 'Спросить, ответила ли она', minutes: 4, when: fresh('c6_call_reply'), text: 'Соседка поворачивает экран. Под записью пять её сообщений. У последнего — фотография двери этой квартиры. — Чтоб нашла.', effects: once('c6_call_reply') },
   { id: 'c6_call_stay', label: 'Дослушать вместе, не обещая услышать больше', minutes: 10, terminal: true, goto: 'c6_bflat', text: 'Ты возвращаешь телефон. — Я тоже не разобрал{m:|а}. — Она кивает и выключает запись до конца.', effects: [...once('c6_call.done'), { set: '$.c6_call.listened', value: true }] },
   { id: 'c6_call_go', label: 'Отдать телефон и вернуться к своим', minutes: 3, terminal: true, goto: 'c6_bflat', text: 'Ты возвращаешь телефон. Перед следующим прослушиванием соседка садится дальше от стола.', effects: once('c6_call.done', [{ body: 'stress', delta: 3 }]) },
 ] }),
 S({ id: 'c6_bafter', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Что сказать соседям', universal: false,
  text: [{ text: 'Женщина с фонарём выглядывает в кухню. — Всё? — Ты видишь её пальцы на выключателе. Погасить она пока не решается.' }, { when: pair, text: '{partner} проводит ладонью по твоему плечу. — Ответь ей. — За дверью кухни ребёнок просит света.' }], actions: [
   { id: 'c6_bafter_tell', label: 'Сказать, что произошло у двери', minutes: 6, terminal: true, goto: 'c6_bflat', text: 'Женщина слушает и закрывает фонарь ладонью. — Он тоже слышит. — Ты понижаешь голос, хотя ребёнка здесь не видно.', effects: [{ body: 'stress', delta: 4 }] },
   { id: 'c6_bafter_no', label: 'Попросить оставить вас вдвоём', minutes: 3, terminal: true, goto: 'c6_bflat', when: pair, text: 'Она отходит от кухни, не погасив фонарь. {partner} ждёт, пока закроется дверь. Потом показывает тебе обе свои ладони.', effects: [{ body: 'stress', delta: -2 }] },
 ] }),
 S({ id: 'c6_patient', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Пустая тара', universal: false,
  text: [{ text: 'Соседка ставит на порог пустую бутылку. — Не мне. У них наверху совсем нет. — Ногой она придерживает вторую, чтобы не укатилась.' }, { when: pair, text: '{partner} смотрит на вашу воду. — А ночью? — Соседка поднимает пустую бутылку, освобождая вам порог.' }], actions: [
   { id: 'c6_water_ask', label: 'Спросить, почему не спускаются сами', minutes: 5, when: fresh('c6_water_ask'), text: '— На руках его не снесёшь. По лестнице тем более. — Соседка показывает вверх ладонью. На костяшках натёрта полоса от ручки ведра.', effects: once('c6_water_ask') },
   { id: 'c6_water_give', label: 'Отдать свою бутылку', minutes: 5, terminal: true, goto: 'c6_bflat', enabled: { has: 'water_15' }, disabledReason: 'Полной бутылки при тебе нет', text: 'Она берёт полную бутылку вместо пустой. На весу проверяет крышку. — Верну тару. — Бутылку держит двумя руками.', effects: [...once('c6_water.done'), { set: '$.c6_water.gave', value: true }, { take: 'water_15' }] },
   { id: 'c6_water_carry', label: 'Подняться с её водой на верхний этаж', minutes: 30, terminal: true, goto: 'c6_bflat', risky: true, outcomes: [
    { id: 'dry', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Соседка идёт впереди, придерживая ведро снизу. Наверху дверь открывают сразу. Ты отпускаешь ручку, когда чужая ладонь уже держит её.', effects: once('c6_water.done', [{ body: 'fatigue', delta: 6 }]) },
    { id: 'slip', text: 'На ступени нога уходит в сторону. Ты прижимаешь ведро к груди; вода льётся за ворот. Соседка садится рядом, не давая тебе встать сразу.', effects: once('c6_water.done', [{ injure: 'sprain', site: 'rightLeg', severity: 1 }]) },
   ] },
   { id: 'c6_water_no', label: 'Сохранить воду на вашу ночь', minutes: 3, terminal: true, goto: 'c6_bflat', text: 'Соседка убирает бутылки с порога. Одну волочит за горлышко. Пустая тара звенит по ступеням.', effects: once('c6_water.done', [{ body: 'stress', delta: 5 }]) },
 ] }),
 S({ id: 'c6_landing_B', for: 'any', chapter: 'ch3', location: 'b_stairs', title: 'Тот же этаж', calm: true,
  text: [{ when: flag('w.c3_b_stairs_closed'), text: 'Нижний пролёт всё ещё завален. Мужчина сидит выше него, возле двери, откуда принёс стул.' }, { text: 'Мужчина сидит у лестницы на вашем этаже. Одну кисть держит под мышкой. — Тут кто-нибудь кормит? — Встаёт, когда ты подходишь.' }, { when: pair, text: '{partner} остаётся в квартирной двери. — Я вижу тебя. — Мужчина смотрит на {pm:него|неё} через твоё плечо.' }], actions: [
   { id: 'c6_landing_from', label: 'Спросить, в какой квартире он живёт', minutes: 6, when: fresh('c6_landing_from'), text: '— Этажом выше. Я у них работал. — Он показывает кисть с белыми следами штукатурки. Вторую не вынимает.', effects: once('c6_landing_from') },
   { id: 'c6_landing_hand', label: 'Спросить про спрятанную руку', minutes: 5, when: fresh('c6_landing_hand'), text: '— Мёрзнет. — Мужчина вынимает ладонь и растирает пальцы. Он ждёт, пока ты посмотришь на все пять.', effects: once('c6_landing_hand') },
   { id: 'c6_landing_eat', label: 'Сказать, что вы сами едите из запаса', minutes: 4, terminal: true, goto: 'c6_bflat', text: '— Значит, готовите. — Он садится обратно на край ступени. Дверь квартиры ты закрываешь уже под его взглядом.', effects: once('c6_landing.done', [{ move: 'b_flat' }]) },
   { id: 'c6_landing_back', label: 'Не обещать ему ничего', minutes: 3, terminal: true, goto: 'c6_bflat', text: 'Мужчина кивает, словно ты назвал{m:|а} время. Ты повторяешь, что не обещаешь. Он снова кивает.', effects: once('c6_landing.done', [{ move: 'b_flat' }]) },
 ] }),
 S({ id: 'c6_okafor', for: 'any', chapter: 'ch3', title: 'Возле медбрата', calm: true,
  text: [{ when: all(medic, { npc: 'okafor', status: 'sick' }), text: 'Медбрат придерживает кружку обеими руками. — Не подходи пока. — Он вытирает лоб сгибом локтя. Кружку ставит подальше от края.' }, { when: all(medic, not({ npc: 'okafor', status: 'sick' })), text: 'Медбрат разворачивает полотенце с руки. — Вот так и показывай, если спросят. — Ты не успеваешь понять, тебе это или себе.' }, { when: not(medic), text: 'Дверь напротив закрыта. Ты подносишь руку к косяку и опускаешь, не постучав. Изнутри никто не зовёт.' }], actions: [
   { id: 'c6_bmedic_time', label: 'Спросить, сколько прошло с утра', minutes: 6, when: all(medic, fresh('c6_bmedic_time')), text: '— По часам скажи. Не «недавно». — Он смотрит, пока ты достаёшь телефон. Своего времени не называет.', effects: once('c6_bmedic_time') },
   { id: 'c6_bmedic_help', label: 'Посидеть, пока он сменит повязку', minutes: 15, terminal: true, goto: 'c6_bflat', when: medic, text: 'Он подаёт тебе чистый край полотенца. — Только за него. — На больную руку ты не смотришь, пока он не попросит.', effects: once('c6_bmedic.done') },
   back, wait, cpAction(6),
 ] }),
 S({ id: 'c6_medicine', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'На коробке имя', calm: true,
  text: [{ when: merle, text: 'Мерле собирает свою сумку на коленях. — Не ухожу. Просто собираю. — Убранную коробку тут же достаёт обратно.' }, { when: not(merle), text: 'На краю стола осталось свободное место. Ты не знаешь, чья здесь стояла сумка. Кружку ставишь с другой стороны.' }], actions: [
   { id: 'c6_merle_parents', label: 'Спросить, что она скажет родителям', minutes: 7, when: all(merle, fresh('c6_merle_parents')), text: '— Что доехала. Потом — что жива. Только в таком порядке. — Мерле вынимает зарядку и кладёт в карман. — А то начнут спрашивать раньше.', effects: once('c6_merle_parents') },
   { id: 'c6_merle_why', label: 'Спросить, почему не ложится', minutes: 6, when: all(merle, fresh('c6_merle_why')), text: '— Там ремень. — Она показывает на сумку у своих ног. Ты отодвигаешь её. Мерле садится на освободившееся место сама.', effects: once('c6_merle_why') },
   { id: 'c6_merle_stay', label: 'Посидеть с ней без сборов', minutes: 15, terminal: true, goto: 'c6_bflat', when: merle, text: 'Мерле откидывается к стене. — Разбуди, если начнут что-то решать. — Сумку держит коленями.', effects: once('c6_merle.done') }, back,
 ] }),
 S({ id: 'c6_blight', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Чужое окно', universal: false,
  text: [{ text: 'Соседка требует погасить фонарь. Другая женщина держит его у детского лица. — Он просыпается, когда темно. — Ребёнок уже открыл глаза.' }, { when: pair, text: '{partner} становится между женщинами. — Не на него свети. На стену. — Соседка просит и {pm:его|её} отойти от окна.' }], actions: [
   { id: 'c6_light_ask', label: 'Спросить соседку, кого она видела во дворе', minutes: 5, when: fresh('c6_light_ask'), text: '— Того, кто смотрел сюда. — Она показывает на тёмное окно напротив. Женщина закрывает фонарь ладонью. Между пальцами виден свет.', effects: once('c6_light_ask') },
   { id: 'c6_light_dark', label: 'Поддержать темноту у общего окна', minutes: 8, terminal: true, goto: 'c6_bflat', text: 'Женщина гасит фонарь. Ребёнок зовёт её по имени, не «мама». Она садится к нему так близко, что приходится закрыть дверь коленом.', effects: once('c6_light.done', [{ body: 'stress', delta: 5 }]) },
   { id: 'c6_light_guard', label: 'Остаться у окна, пока ребёнок заснёт', minutes: 25, terminal: true, goto: 'c6_bflat', text: 'Соседка уходит, оставив тебе место у стекла. В комнате за спиной тихо. Уходить ты начинаешь раньше, чем женщина убирает ладонь с фонаря.', effects: once('c6_light.done', [{ body: 'fatigue', delta: 5 }]) },
   { id: 'c6_light_room', label: 'Пустить их со светом в ваш угол', minutes: 12, terminal: true, goto: 'c6_bflat', when: keeper('B'), text: 'Женщина переносит фонарь к вашим вещам. Ребёнок идёт следом, неся чужую тапку. Твой рюкзак приходится поднять с пола.', effects: [...once('c6_light.done'), { set: 'w.c3_b_light_room', value: true }] },
 ] }),
 S({ id: 'c6_bdoor', for: 'any', chapter: 'ch3', location: 'b_flat', title: 'Ладонь в проёме', universal: false,
  text: [{ when: all(not(merle), not(pair), { me: 'A' }), text: 'Ты приоткрываешь дверь. Мужчина ставит ногу в проём. — Хоть до утра. — Ты удерживаешь створку за ручку.' }, { when: merle, text: 'Мерле приоткрывает дверь. Мужчина с площадки ставит ногу в проём. — Хоть до утра. — Она пытается сдвинуть створку; его ладонь уже на внутреннем косяке.' }, { when: all(not(merle), { me: 'B' }), text: 'Ты приоткрываешь свою дверь. Мужчина с площадки придерживает её ногой. — Хоть до утра. — Его ладонь ложится на внутренний косяк. Он тянется ко второй створке.' }, { when: all(not(merle), pair, { me: 'A' }), text: '{partner} приоткрывает дверь. Мужчина с площадки ставит ногу в проём. Ты подставляешь ладонь под створку. Она давит вам обоим на пальцы.' }, { when: pair, text: '{partner} просит тебя отойти от петель. — Не вдвоём за одно место. — Мужчина делает ещё полшага внутрь.' }], actions: [
   { id: 'c6_bdoor_close', label: 'Вытолкнуть его руку и прижать створку', minutes: 10, risky: true, terminal: true, goto: 'c6_bflat', effects: [...once('c6_bdoor.done'), { if: keeper('B'), then: [{ set: 'w.c3_b6', value: 'close' }, { set: 'w.c3_b6_done', value: true }, { npc: 'c3_b_landing', remember: 'c3_door_shut', moveTo: 'b_stairs' }] }], outcomes: [
    { id: 'guest', when: not(keeper('B')), text: 'Ты упираешься в дверь плечом. Чужой локоть бьёт тебя под рёбра. {partner} остаётся возле замка; ты не отпускаешь створку.', effects: [{ injure: 'bruise', site: 'torso', severity: 2 }] },
    { id: 'shut', check: { traits: ['agility'], difficulty: 4, uses: ['mobility'] }, text: 'Ты отводишь его пальцы и бьёшь плечом в дверь. Пуговица остаётся внутри. По своему запястью ты проводишь уже после щелчка замка.', effects: [{ injure: 'bruise', site: 'hands', severity: 1 }, { body: 'stress', delta: 12 }] },
    { id: 'hurt', text: 'Он дёргает створку на себя. Твою руку прижимает к косяку, замок щёлкает с третьего толчка. За дверью он просит вернуть пуговицу.', effects: [{ injure: 'sprain', site: 'leftArm', severity: 2 }, { body: 'stress', delta: 18 }] },
   ] },
   { id: 'c6_bdoor_inside', label: 'Отступить и освободить ему проход', minutes: 8, terminal: true, goto: 'c6_bflat', outcomes: [{ id: 'guest', when: not(keeper('B')), text: 'Ты убираешь руку со створки. {partner} стоит у замка, мужчина ждёт перед {pm:ним|ней}. Ты поднимаешь свой рюкзак с прохода.' }, { id: 'owner', text: 'Ты отходишь. Мужчина входит и сразу снимает ботинки. — Не натопчу. — Твои вещи он бережно перекладывает с сухого места на пол.' }], effects: [...once('c6_bdoor.done'), { body: 'stress', delta: 10 }, { if: keeper('B'), then: [{ set: 'w.c3_b6', value: 'inside' }, { set: 'w.c3_b6_done', value: true }, { set: 'w.c3_b_night_place_lost', value: true }, { npc: 'c3_b_landing', moveTo: 'b_flat', remember: 'c3_let_in' }] }] },
   { id: 'c6_bdoor_food', label: 'Дать свои хлебцы, попросить отойти от двери', minutes: 5, terminal: true, goto: 'c6_bflat', enabled: { has: 'crackers' }, disabledReason: 'Своей пачки хлебцев при тебе нет', outcomes: [{ id: 'guest', when: not(keeper('B')), text: 'Ты протягиваешь пачку поверх дверной ручки. Мужчина перехватывает её обеими руками. {partner} касается твоего локтя; ты отходишь от замка.' }, { id: 'owner', text: 'Мужчина принимает хлебцы и вынимает ногу. Ты закрываешь дверь, пока он разворачивает пачку. Бумага рвётся по его сторону.' }], effects: [...once('c6_bdoor.done'), { take: 'crackers' }, { body: 'stress', delta: 8 }, { if: keeper('B'), then: [{ set: 'w.c3_b6', value: 'food' }, { set: 'w.c3_b6_done', value: true }, { npc: 'c3_b_landing', moveTo: 'b_stairs', remember: 'c3_fed_outside' }] }] },
 ] }),
].map((scene): Scene => scene.id === 'c6_bdoor' ? { ...scene, actions: scene.actions.map(a => ({ ...a, goto: 'c6_bafter' })) } : ({ ...scene, actions: [
 { id: 'c6_bdoor_go', label: 'К открывшейся квартирной двери', minutes: 1, terminal: true, goto: 'c6_bdoor', when: alarm, effects: [{ move: 'b_flat' }] },
 ...scene.actions.map(a => ({ ...a, when: all(a.when ?? { always: true }, not(alarm)) })),
] }));
export const bflat6Events: WorldEvent[] = [
 { id: 'ev_b6_water', at: at(12, 14, 20), scope: 'world', interrupt: true, when: all(C, { at: 'b_flat' }), effects: [], news: [{ channel: 'direct', text: 'Соседка просит воды для верхнего этажа. Бутылки звенят у вашего порога.' }] },
 { id: 'ev_b6_light', at: at(12, 17, 30), scope: 'world', interrupt: true, when: all(C, { at: 'b_flat' }), effects: [], news: [{ channel: 'direct', text: 'На площадке спорят из-за света. Ребёнок зовёт женщину, но взрослые продолжают говорить поверх него.' }] },
 { id: 'ev_b6_door', at: at(12, 19), scope: 'world', interrupt: true, when: all(C, { any: [{ at: 'b_flat' }, { at: 'b_stairs' }, { at: 'b_okafor' }] }), effects: [], news: [{ channel: 'direct', text: 'Квартирная дверь бьётся о чью-то ногу. Мужской голос просит пустить его до утра.' }] },
 { id: 'ev_b6_missed', at: at(12, 19, 45), scope: 'world', when: all(C, { at: 'b_flat' }, keeper('B'), not(flag('w.c3_b6_done'))), effects: [{ set: 'w.c3_b6', value: 'inside' }, { set: 'w.c3_b6_done', value: true }, { set: 'w.c3_b_night_place_lost', value: true }] },
];
