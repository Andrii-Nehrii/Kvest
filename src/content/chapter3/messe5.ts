import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, flag, not, keeper, npcHere } from './world3';
const S = (s: Scene) => s;
const C = all({ cp: 4 }, not({ cp: 5 }));
const AM = all({ after: at(12, 6) }, { before: at(12, 13) });
const NIGHT: Cond = { before: at(12, 6) };
const pair = all(flag('w.together'), { partnerAt: 'messe' }, { partner: 'active' });
const fresh = (id: string) => not(flag(`$.${id}`));
const result = (v: string): Cond => ({ v: 'w.c3_m5', op: '==', value: v });
const doctor = npcHere('c3_messe_doctor', 'messe');
const calm = all(AM, { before: at(12, 10, 50) });
const danger = all(C, { after: at(12, 10, 50) }, { before: at(12, 11, 35) }, fresh('c5_mknife.done'), not(flag('w.c3_m5_done')));
const back: ActionDef = { id: 'c5_mback', label: 'Вернуться к своей раскладушке', minutes: 2, terminal: true, goto: 'c5_messe' };
const wait: ActionDef = { id: 'c5_wait', label: 'Переждать час в своём ряду', minutes: 60, repeatable: true, activity: 'rest', text: 'Сосед накрывается с головой. Из-под одеяла он просит разбудить его к раздаче. Ты спрашиваешь, когда она будет; он уже не отвечает.' };
const blanket = all(calm, { after: at(12, 7, 20) }, fresh('c5_blanket.done'));
const locker = all(calm, { after: at(12, 8, 40) }, fresh('c5_locker.done'));
const toBlanket: ActionDef = { id: 'c5_blanket_approach', label: 'К женщине, спорящей об одеяле', minutes: 1, terminal: true, goto: 'c5_blanket', when: blanket };
const toLocker: ActionDef = { id: 'c5_locker_approach', label: 'К открытой чужой сумке', minutes: 1, terminal: true, goto: 'c5_locker', when: locker };
export const messe5Scenes: Scene[] = [
 S({ id: 'c5_messe', for: 'any', chapter: 'ch3', location: 'messe', title: 'Ряд раскладушек', safe: true,
  text: [
   { when: all(NIGHT, { before: at(11, 22) }), text: 'Солдат приглушает свет над рядами. Одна лампа остаётся гореть над твоими ногами. Мужчина напротив прикрывает глаза пустым рукавом.' },
   { when: all(NIGHT, { after: at(11, 22) }), text: 'Солдат проверяет спящих фонариком. Возле твоей раскладушки луч задерживается на ремне. Ты убираешь сумку из прохода.' },
   { when: all(AM, { before: at(12, 10, 50) }), text: 'У колонны солдат читает имена. Люди поднимают руки, не вставая. Он просит отвечать голосом: рук ему отсюда не видно.' },
   { when: all(flag('$.messe_exit'), NIGHT), text: 'Возле запасного выхода сквозит, как вчера. Ты подсовываешь сумку под дверную щель. Сосед благодарит тебя, не открывая глаз.' },
   { when: all(pair, NIGHT), text: '{partner} садится на край твоей раскладушки. — Я здесь. — Сосед придерживает ботинок, чтобы не задеть {pm:его|её} ногу.' },
   { when: result('hold'), text: 'Врач принимает сидя. На шее у неё узкая повязка. Одному пациенту она велит придержать бинт, другому — подать ножницы.' },
   { when: result('door'), text: 'Медицинский стол огорожен лентой. Врач ушла за солдатами в соседний павильон. Её кольцо осталось на блюдце возле мыла.' },
   { when: result('back'), text: 'Белый жилет врача лежит на пустой раскладушке. У ворот стоит машина медиков. Пациенты подходят к жилету, потом ищут друг друга глазами.' },
   { when: result('missed'), text: 'Пол возле медпоста смыт. Врач не вернулась. Женщина с очередным бинтом спрашивает тебя, кому теперь показать руку.' },
   { when: all({ after: at(12, 10, 50) }, fresh('c5_mknife.done'), not(flag('w.c3_m5_done'))), text: 'У медпоста люди пятятся между раскладушками. Солдат просит опустить головы. Кто-то встаёт, чтобы лучше увидеть.' },
   { when: all(flag('$.c5_mknife.done'), not(flag('w.c3_m5_done'))), text: 'Солдат держит проход к медпосту. Ты ждёшь с другой стороны ленты. Сосед забирает у тебя пустую миску.' },
   { when: flag('$.c5_blanket.gave'), text: 'Мужчина спит, прижав к груди твою шапку. Его жена придерживает её за край, когда он поворачивается.' },
   { when: flag('$.c5_locker.opened'), text: 'Мужчина проходит мимо твоей сумки, отвернув голову. Женщина рядом с ним опускает глаза первой.' },
   { when: flag('$.c5_mdoctor.quiet'), text: 'Возле врачебного мыла лежит кольцо. Когда рядом ставят чужой стакан, ты отодвигаешь его на край стола.' },
  ], actions: [
   { id: 'c5_sleep', label: 'Лечь под общей лампой', minutes: 0, repeatable: true, when: NIGHT, text: 'Ты ложишься, отвернувшись от света. Чужой рукав касается твоего лица. Мужчина напротив извиняется шёпотом.', effects: [{ sleep: 600 }] },
   { id: 'c5_mpair', label: 'Позвать {partner.acc} ближе', minutes: 12, when: all(pair, fresh('c5_mpair')), text: '{partner} упирается коленом в твою раскладушку. — Тут всё слышно. — Ты говоришь тише. {pm:Он|Она} наклоняется, хотя вопроса уже нет.', effects: once('c5_mpair', [{ body: 'stress', delta: -4 }]) },
   { id: 'c5_mcount', label: 'Ответить на перекличке', minutes: 8, when: all(calm, fresh('c5_mcount')), text: 'Солдат повторяет твоё имя с ударением на другом слоге. Ты отзываешься. Он зачеркивает пустую клетку и переходит к следующему, не исправляя произношения.', effects: once('c5_mcount') },
   { id: 'c5_mfood', label: 'Отстоять очередь за завтраком', minutes: 25, when: all(calm, fresh('c5_mfood')), text: 'На раздаче тот же солдат. Он говорит «Guten Appetit» и тебе, и пустой миске следующего. Ты отходишь с горячим краем в ладонях.', effects: once('c5_mfood', [{ body: 'hunger', delta: -25 }, { body: 'thirst', delta: -15 }]) },
   { id: 'c5_mclinic', label: 'Подойти к врачу у колонны', minutes: 2, terminal: true, goto: 'c5_mdoctor', when: all(calm, doctor, fresh('c5_mdoctor.done')) },
   { id: 'c5_mboard_go', label: 'К женщине у доски поиска', minutes: 2, terminal: true, goto: 'c5_mboard', when: all(AM, fresh('c5_mboard.done')) },
   { id: 'c5_mcorridor_go', label: 'К решётке коридора', minutes: 2, terminal: true, goto: 'c5_messe_corridor', when: all(AM, { any: [fresh('c5_mcrowd'), fresh('c5_mguard'), fresh('c5_mguard_family'), blanket, locker] }) },
   { id: 'c5_mwash', label: 'Дождаться места у умывальника', minutes: 18, when: all(calm, fresh('c5_mwash')), text: 'Мужчина держит кран открытым, пока ты моешь руки. Его собственные уже вытерты о штаны. — Я знаю, как быстро он закрывается. — Он отпускает ручку, когда ты отходишь.', effects: once('c5_mwash') },
   { id: 'c5_mcarry', label: 'Помочь соседке разложить чистые простыни', minutes: 25, when: all(calm, fresh('c5_mcarry')), text: 'Женщина отдаёт тебе мокрый угол простыни. — Сначала вывернем. — Сухая сторона оказывается внутри. Она накрывает ею пустую раскладушку и не ложится.', effects: once('c5_mcarry', [{ body: 'fatigue', delta: 3 }]) },
   toBlanket, toLocker, wait, cpAction(5),
  ] }),
 S({ id: 'c5_mdoctor', for: 'any', chapter: 'ch3', location: 'messe', title: 'Кольцо возле мыла', calm: true,
  text: [{ text: 'Врач снимает кольцо с распухшего пальца. — Сейчас. — Очередь терпеливо смотрит на её руки. Она намыливает палец ещё раз.' }, { when: pair, text: '{partner} подвигает ей стакан с водой. Врач погружает в него кисть. — Спасибо. Не пейте из него потом.' }], actions: [
   { id: 'c5_mdoc_why', label: 'Спросить, почему она не оставит кольцо на пальце', minutes: 5, when: fresh('c5_mdoc_why'), text: '— Перчатку порву. Последнюю моего размера. — Палец белеет раньше, чем металл сдвигается.', effects: once('c5_mdoc_why') },
   { id: 'c5_mdoc_home', label: 'Спросить, знает ли муж, где она', minutes: 6, when: fresh('c5_mdoc_home'), text: '— Привёз. Утром обещал забрать. — Она смотрит на часы над проходом. — Вчера утром. — Из очереди просят не торопиться.', effects: once('c5_mdoc_home') },
   { id: 'c5_mdoc_rule', label: 'Спросить о людях за решёткой', minutes: 6, when: fresh('c5_mdoc_rule'), text: '— Я туда хожу. — Врач показывает на стопку перевязок. — Только выходить не могут. — Солдат за её спиной кашляет в локоть.', effects: once('c5_mdoc_rule', [{ learn: 'f_messe_q' }]) },
   { id: 'c5_mdoc_help', label: 'Остаться рядом, пока она справится', minutes: 10, terminal: true, goto: 'c5_messe', text: 'Кольцо соскальзывает в воду. Врач достаёт его краем полотенца. — На блюдце оставьте. — Она натягивает перчатку, не проверив, куда ты положил{m:|а}.', effects: [...once('c5_mdoctor.done'), { set: '$.c5_mdoctor.quiet', value: true }] },
   { id: 'c5_mdoc_go', label: 'Отойти и уступить очередь', minutes: 3, terminal: true, goto: 'c5_messe', text: 'Врач зажимает кольцо в кулаке. Следующего пациента просит показать рану. Разжимать эту руку ей пока не нужно.', effects: once('c5_mdoctor.done') },
 ] }),
 S({ id: 'c5_blanket', for: 'any', chapter: 'ch3', location: 'messe', title: 'Чужое тепло', universal: false,
  text: [{ text: 'Женщина держит край одеяла, которое волонтёр уже забирает. — Он дрожит. — Её муж сидит, спрятав кисти между коленями. Волонтёр показывает на следующий ряд.' }, { when: pair, text: '{partner} снимает руку с твоего рукава. — Там тоже не спят. — Во втором ряду женщина сидит на полу возле детской раскладушки.' }], actions: [
   { id: 'c5_blanket_ask', label: 'Спросить мужа, может ли он встать', minutes: 4, when: fresh('c5_blanket_ask'), text: '— Могу. Не хочу. — Он пытается спрятать босую ногу под другую. Жена поднимает его ботинок с пола, но не надевает.', effects: once('c5_blanket_ask') },
   { id: 'c5_blanket_own', label: 'Отдать ему свою шапку', minutes: 6, terminal: true, goto: 'c5_messe', enabled: { has: 'beanie' }, disabledReason: 'Своей шапки при тебе нет', text: 'Он надевает её на обе ладони. Жена отпускает одеяло. — На голову, — говорит она ему, но сама накрывает пальцы краем.', effects: [...once('c5_blanket.done'), { set: '$.c5_blanket.gave', value: true }, { take: 'beanie' }] },
   { id: 'c5_blanket_turn', label: 'Встать вместо них в очередь к врачу', minutes: 25, terminal: true, goto: 'c5_messe', text: 'Женщина даёт тебе пустую миску: по ней узнает, где ты. Когда доходит твоя очередь, она приводит мужа за локоть. Твою миску возвращает вымытой.', effects: once('c5_blanket.done', [{ body: 'fatigue', delta: 4 }]) },
   { id: 'c5_blanket_no', label: 'Отпустить одеяло вместе с волонтёром', minutes: 4, terminal: true, goto: 'c5_messe', text: 'Женщина выпускает ткань. Муж поворачивается к ней спиной и подтягивает ноги. Жена остаётся с ботинком в руке.', effects: once('c5_blanket.done', [{ body: 'stress', delta: 5 }]) },
 ] }),
 S({ id: 'c5_locker', for: 'any', chapter: 'ch3', location: 'messe', title: 'Открытая сумка', universal: false,
  text: [{ text: 'Сосед держит чужую сумку за раскрытую молнию. — Тут было. — Женщина рядом просит не вытряхивать вещи. У её ног лежат две одинаковые пачки хлебцев.' }, { when: pair, text: '{partner} придерживает падающую рубашку. — Сначала спроси. — Сосед принимает рубашку, но сумку не закрывает.' }], actions: [
   { id: 'c5_locker_ask', label: 'Спросить, что пропало и когда', minutes: 5, when: fresh('c5_locker_ask'), text: '— Елку принёс? — переспрашивает женщина. — Я еду принёс, — отвечает мужчина. Она закрывает ухо ладонью: — Не слышу справа. — Он обходит её с другой стороны.', effects: once('c5_locker_ask') },
   { id: 'c5_locker_stop', label: 'Закрыть чужую сумку', minutes: 8, terminal: true, goto: 'c5_messe', text: 'Ты соединяешь края молнии. Мужчина выпускает ручки сумки. Возвращаясь, он смотрит на твои вещи.', effects: [...once('c5_locker.done'), { set: '$.c5_locker.stopped', value: true }, { body: 'stress', delta: 6 }] },
   { id: 'c5_locker_show', label: 'Показать свою сумку вместо её', minutes: 12, terminal: true, goto: 'c5_messe', text: 'Женщина забирает свою сумку, пока мужчина заглядывает в твою. Он тянется к боковому карману. Ты придерживаешь его руку.', effects: [...once('c5_locker.done'), { set: '$.c5_locker.opened', value: true }, { body: 'stress', delta: 4 }] },
   { id: 'c5_locker_leave', label: 'Оставить их разбираться', minutes: 3, terminal: true, goto: 'c5_messe', text: 'Ты отходишь. Женщина берёт сумку за дно, помогая высыпать вещи на раскладушку. Мужчина отступает, чтобы не задело его ноги.', effects: once('c5_locker.done', [{ body: 'stress', delta: 3 }]) },
 ] }),
 S({ id: 'c5_mboard', for: 'any', chapter: 'ch3', location: 'messe', title: 'Место для фотографии', calm: true,
  text: [{ text: 'У доски женщина разглаживает маленькую фотографию. — Ещё здесь можно? — Она показывает на край чужого листка. Свободного места рядом нет.' }, { when: pair, text: '{partner} достаёт телефон, но женщина качает головой. — Бумажную увидят. — {pm:Он|Она} убирает его, не включая.' }], actions: [
   { id: 'c5_mboard_who', label: 'Спросить, кого она ищет', minutes: 4, when: fresh('c5_mboard_who'), text: '— Брата. Здесь ему двадцать. Сейчас пятьдесят три. — Она закрывает пальцем волосы на снимке. — Вот теперь похож.', effects: once('c5_mboard_who') },
   { id: 'c5_mboard_yesterday', label: 'Проверить вчерашний список наблюдения', minutes: 6, when: fresh('c5_mboard_yesterday'), outcomes: [{ id: 'reported', when: flag('w.messe_reported'), text: 'Вчерашний список снят. Солдат снимает копию со стены, чтобы прочесть самому. — В другом зале. — Номер он говорит уже следующему человеку.' }, { id: 'other', text: 'На новом листе фамилии идут без имён. Ты ищешь знакомые буквы. Женщина рядом водит пальцем по той же строке в обратную сторону.' }], effects: once('c5_mboard_yesterday') },
   { id: 'c5_mboard_hold', label: 'Дать её снимку место над чужим листком', minutes: 8, terminal: true, goto: 'c5_messe', text: 'Она вкалывает булавку возле твоего пальца. Фотография закрывает половину чужого номера. Ты приподнимаешь край; женщина прикалывает его выше.', effects: once('c5_mboard.done') },
   { id: 'c5_mboard_go', label: 'Уступить место у доски', minutes: 2, terminal: true, goto: 'c5_messe', text: 'Женщина остаётся с фотографией на ладони. Следующий человек просит отойти. Она поворачивается к нему боком.', effects: once('c5_mboard.done') },
 ] }),
 S({ id: 'c5_messe_corridor', for: 'any', chapter: 'ch3', location: 'messe', title: 'Перед решёткой', calm: true,
  text: [{ text: 'Солдат открывает узкий проход к туалетам. Люди встают с пола одновременно. Врач просит пропустить женщину с ведром.' }, { when: pair, text: '{partner} берёт тебя за плечо. — Не за сумку. За меня. — В проходе вас разворачивает друг к другу.' }, { when: flag('$.c5_locker.stopped'), text: 'Мужчина с чужой сумкой стоит дальше в очереди. Он видит тебя и уступает проход женщине. Тебя пропускает следом.' }], actions: [
   { id: 'c5_mcrowd', label: 'Пройти с толпой между решётками', minutes: 18, risky: true, when: fresh('c5_mcrowd'), outcomes: [
    { id: 'through', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты упираешься ладонью в колонну. Следующий человек останавливается за твоим локтем. Солдат видит просвет и поворачивает поток в другой проход.', effects: once('c5_mcrowd', [{ body: 'fatigue', delta: 4 }]) },
    { id: 'pressed', text: 'Тебя прижимает к сетке. Кто-то наступает тебе на пятку, ботинок выворачивается. Солдат поднимает тебя за ворот, не спрашивая, можешь ли встать.', effects: once('c5_mcrowd', [{ injure: 'sprain', site: 'leftLeg', severity: 1 }]) },
   ] },
   { id: 'c5_mguard', label: 'Спросить солдата, почему не откроют вторую дверь', minutes: 6, when: fresh('c5_mguard'), text: 'Он показывает тебе связку ключей. На нужном отломана головка. — Слесарь там. — Куда именно, солдат не показывает.', effects: once('c5_mguard') },
   { id: 'c5_mguard_family', label: 'Спросить, знает ли он, где его семья', minutes: 4, when: fresh('c5_mguard_family'), text: '— Знает, где я. — Он отпускает цепочку на шее под ворот. Из очереди зовут солдата; он поворачивается раньше, чем ты успеваешь спросить ещё.', effects: once('c5_mguard_family') },
   toBlanket, toLocker, back, wait, cpAction(5),
 ] }),
 S({ id: 'c5_mknife', for: 'any', chapter: 'ch3', location: 'messe', title: 'Разрезанный ворот', universal: false,
  text: [{ text: 'Мужчина пятится от солдат, прижав врача к себе. У её шеи нож. — Я туда не пойду. — Она просит его отпустить ворот. Ткань уже разрезана.' }, { text: 'Солдат поднимает оружие. Врач смотрит поверх его плеча на дверь. Поперёк прохода стоит твоя раскладушка.' }, { when: pair, text: '{partner} тянет тебя вниз за плечо. — Не хватай нож. — Она качает головой.' }], actions: [
   { id: 'c5_mknife_hold', label: 'Отвести лезвие от её шеи', minutes: 8, risky: true, terminal: true, goto: 'c5_mafter', effects: [...once('c5_mknife.done'), { if: keeper(), then: [{ set: 'w.c3_m5', value: 'hold' }, { set: 'w.c3_m5_done', value: true }, { npc: 'c3_messe_doctor', status: 'injured', remember: 'c3_blade_held' }] }], outcomes: [
    { id: 'guest', when: not(keeper()), text: 'Ты хватаешь мужчину за предплечье. Он тянет нож к себе. Солдат отбрасывает твою руку; по пальцам течёт кровь.', effects: [{ injure: 'cut', site: 'hands', severity: 2 }, { body: 'stress', delta: 15 }] },
    { id: 'wrist', check: { traits: ['agility'], difficulty: 4, uses: ['mobility', 'focus'] }, text: 'Ты прижимаешь его запястье к плечу. Врач выскальзывает вниз, оставив ворот у него в кулаке. Солдат толкает вас обоих на пол. Ладонь режет край ножа.', effects: [{ injure: 'cut', site: 'hands', severity: 1 }, { body: 'stress', delta: 15 }] },
    { id: 'edge', text: 'Он дёргает рукой. Лезвие проходит по твоим пальцам, врач кричит. Солдат бьёт мужчину прикладом. Ты держишь его запястье, когда он уже не двигается.', effects: [{ injure: 'laceration', site: 'hands', severity: 2 }, { body: 'stress', delta: 20 }] },
   ] },
   { id: 'c5_mknife_door', label: 'Открыть ему служебную дверь', minutes: 6, terminal: true, goto: 'c5_mafter', outcomes: [{ id: 'guest', when: not(keeper()), text: 'Ты отодвигаешь свою раскладушку от двери. Солдат кричит, чтобы ты лёг{m:|ла}. Ты остаёшься возле ручки, пока {partner} не зовёт тебя.' }, { id: 'owner', text: 'Мужчина выталкивает врача в проход и исчезает за дверью. Солдат уводит её за собой в другой павильон. Второй закрывает створку на цепь. На медпост никто не возвращается.' }], effects: [...once('c5_mknife.done'), { body: 'stress', delta: 14 }, { if: keeper(), then: [{ set: 'w.c3_m5', value: 'door' }, { set: 'w.c3_m5_done', value: true }, { set: 'w.c3_messe_side_closed', value: true }, { npc: 'c3_messe_doctor', moveTo: 'messe_q', remember: 'c3_door_opened' }] }] },
   { id: 'c5_mknife_back', label: 'Лечь за раскладушку и дать солдатам действовать', minutes: 5, terminal: true, goto: 'c5_mafter', outcomes: [{ id: 'guest', when: not(keeper()), text: 'Ты ложишься под раскладушку. {partner} зовёт тебя с другой стороны. Ты отвечаешь, не поднимая головы.' }, { id: 'owner', text: 'Ты ложишься на пол. Выстрел бьёт по ушам. Врач остаётся сидеть, прижав ладонь к боку. К ней бегут с носилками. Ты отползаешь, чтобы пропустить.' }], effects: [...once('c5_mknife.done'), { body: 'stress', delta: 18 }, { if: keeper(), then: [{ set: 'w.c3_m5', value: 'back' }, { set: 'w.c3_m5_done', value: true }, { npc: 'c3_messe_doctor', moveTo: 'c3_medical_van', status: 'injured', set: { c3_shot: true } }] }] },
 ] }),
 S({ id: 'c5_mafter', for: 'any', chapter: 'ch3', location: 'messe', title: 'Под раскладушкой', universal: false,
  text: [{ text: 'Сосед протягивает тебе чистую простыню. — Не на пол. — Он держит её над твоими коленями, пока ты не берёшь край.' }, { when: pair, text: '{partner} садится прямо на пол. — Руку дай. Обе. — {pm:Он|Она} переворачивает твои ладони по одной.' }], actions: [
   { id: 'c5_mafter_ask', label: 'Спросить соседа, всё ли с ним цело', minutes: 3, when: fresh('c5_mafter_ask'), text: '— Очки. — Он показывает пустую оправу. Стёкла лежат под его ботинком. До них он не дотрагивается.', effects: once('c5_mafter_ask') },
   { id: 'c5_mafter_stay', label: 'Остаться с соседом до конца проверки', minutes: 15, terminal: true, goto: 'c5_messe', text: 'Солдат заглядывает под раскладушку, где вы сидите. Сосед поднимает пустую оправу. — Только это. — Солдат просит не вставать и идёт дальше.', effects: once('c5_mafter.done', [{ body: 'stress', delta: -3 }]) },
   { id: 'c5_mafter_return', label: 'Вернуться к своим вещам', minutes: 3, terminal: true, goto: 'c5_messe', text: 'Ты возвращаешь простыню. Сосед снимает пустую оправу и заворачивает её в простыню. На пустое место возле себя показывает уже другому.', effects: once('c5_mafter.done') },
 ] }),
].map((scene): Scene => scene.id === 'c5_mknife' ? scene : ({ ...scene, actions: [
 { id: 'c5_mknife_go', label: 'Крик у врачебного стола', minutes: 1, terminal: true, goto: 'c5_mknife', when: danger },
 ...scene.actions.map(a => ({ ...a, when: all(a.when ?? { always: true }, not(danger)) })),
] }));
export const messe5Events: WorldEvent[] = [
 { id: 'ev_m5_blanket', at: at(12, 7, 20), scope: 'world', interrupt: true, when: all(C, { at: 'messe' }), effects: [], news: [{ channel: 'direct', text: 'Волонтёр просит вернуть второе одеяло. Женщина возле соседней раскладушки не выпускает край.' }] },
 { id: 'ev_m5_locker', at: at(12, 8, 40), scope: 'world', interrupt: true, when: all(C, { at: 'messe' }), effects: [], news: [{ channel: 'direct', text: 'Возле колонны встряхивают раскрытую сумку. Сосед зовёт солдата. Женщина просит сперва её выслушать.' }] },
 { id: 'ev_m5_knife', at: at(12, 10, 50), scope: 'world', interrupt: true, when: all(C, { at: 'messe' }, doctor), effects: [], news: [{ channel: 'direct', text: 'Врач кричит: «Уберите оружие». Из-за колонны тянутся увидеть. Солдат велит всем лечь.' }] },
 { id: 'ev_m5_missed', at: at(12, 11, 35), scope: 'world', when: all(C, { at: 'messe' }, keeper(), not(flag('w.c3_m5_done'))), effects: [{ set: 'w.c3_m5', value: 'missed' }, { set: 'w.c3_m5_done', value: true }] },
];
