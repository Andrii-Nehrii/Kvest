import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { S23, guestsArrive, guestsCome, leaHere23, leaJest23, leaLue23, set23, snow23, until23, w23 } from './point23';

// Участок 23, линия B: снег, Нина и отец, воскресная служба в Йестебурге или дом, Лео бежит к B, Уте, плазма, сообщение от Мерле.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S23({ ...scene, for: 'any', chapter: 'ch3' });
const jest = 'c16_jesteburg';
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => B({ ...scene, location: jest, camp: scene.camp ?? { at: jest, stock: 'c3_farm_stock', rest: false }, safe: false });
const ninaKnows: Cond = any(flag('w.c18_nina_told'), flag('w.c21_nina_told'));
const promisedB: Cond = { npc: 'c12_leo', alive: true, remembers: 'c12_B_promised' };
const plasmaHome: Cond = v('w.c21_bag', 'wait');
const insulinHome: Cond = any(v('w.c21_bag', 'wait'), v('w.c21_bag', 'keep'));
const sabine: Cond = flag('w.c21_mats_mother');
const merle: Cond = any(flag('w.c18_merle_listed'), flag('A.c21_told_merle'), flag('B.c21_told_merle'));
const afterNina = [{ id: 'c', when: flag('$.c23_church'), goto: 'c23_b_church' }, { id: 'h', goto: 'c23_b_home' }];

export const day23BScenes: Scene[] = [
  B({ id: 'c23_b_snow', title: 'Снег', camp: kitchen14,
    text: [
      { text: 'Тебя будит Нина. Она стоит у кровати в куртке поверх ночной рубашки, щёки красные.\n\n— Выйди. Посмотри.' },
      { text: 'Двор белый. Крыша сарая, поленница, груша — всё под тонким сухим снегом. Нина уже протоптала дорожку к курятнику и обратно, и ещё одну, просто так, кругом.' },
      { when: leaHere23, text: 'Лея стоит на крыльце, без куртки, и смотрит на снег так, будто видит его первый раз.' },
      { when: leaLue23, text: 'Постель в швейной комнате застелена так, как застилают в казарме. На подушке лежат вязаные носки Хенрике. Их не взяли.' },
      { when: leaJest23, text: 'Табурет у двери пустой. На подоконнике стоит её кружка, вымытая, вверх дном.' },
      { text: 'В девять Кёлер с соседками пойдёт в Йестебург, в церковь: пастор отслужит по всем, кого не похоронили. Кёлер звала с собой.' },
      { text: 'Нина выбегает на крыльцо босиком, ойкает и возвращается за валенками. Через минуту она уже во дворе, руки в снегу по локоть.' },
    ],
    actions: [
      { id: 'c23_bs_church', label: 'Решить: пойду с Кёлер в церковь', minutes: 20, terminal: true, goto: 'c23_b_nina',
        text: 'Ты говоришь Нине, что пойдёшь. Нина кивает и уходит наверх. Возвращается с варежками Уте: серыми, с красной полоской.\n\n— Возьми. Там холодно. В церкви всегда холодно.', effects: [set23('bs', 'church'), set23('church', true), until23(7, 30)] },
      { id: 'c23_bs_snowball', label: 'Слепить снежок и бросить в Нину', minutes: 20, terminal: true, goto: 'c23_b_nina', ambientDuring: snow23,
        text: 'Снег сухой, лепится плохо. Снежок рассыпается у Нины на плече. Нина смотрит на тебя так, будто ты {m:сошёл|сошла} с ума. Потом нагибается. Через минуту вы обе мокрые до локтей, и Нина смеётся так громко, что из сарая выглядывает Мальте.', effects: [set23('bs', 'snowball'), npc('c7_nina', 2), { body: 'stress', delta: -3 }, until23(7, 30)] },
      { id: 'c23_bs_home', label: 'Остаться дома: в доме и так работы на весь день', minutes: 20, terminal: true, goto: 'c23_b_nina',
        text: 'Ты ставишь чайник и пересчитываешь, сколько будет за столом в обед. Выходит много.', effects: [set23('bs', 'home'), until23(7, 30)] },
    ] }),

  B({ id: 'c23_b_nina', title: 'Нина спрашивает про отца', camp: kitchen14,
    text: [
      { when: not(ninaKnows), text: 'Нина садится напротив тебя за стол и кладёт руки на клеёнку, ладонями вниз.\n\n— Скажи мне ты. {A} не говорит. Он говорит: потом. Папы нет, да?' },
      { when: ninaKnows, text: 'Нина садится напротив тебя за стол и кладёт руки на клеёнку, ладонями вниз.\n\n— Где он лежит? Папа. Его ведь где-то закопали. Я хочу знать где. Я не пойду туда. Я просто хочу знать.' },
      { text: 'Нина сидит на ступеньке, натянув рукава свитера на пальцы. Снег на её валенках тает и стекает на пол.' },
      { when: v('$.c23_bs', 'home'), text: 'Ты {m:остался|осталась} дома: работы и так на весь день, и Нине, кажется, это было важно.' },
    ],
    actions: [
      { id: 'c23_bn_tell', label: 'Сказать правду', when: not(ninaKnows), minutes: 30, terminal: true, outcomes: afterNina,
        text: 'Ты говоришь. Про колонию, про солдат, про среду. Нина слушает, не перебивая, глядя на свои руки.\n\n— Я знала, — говорит она в конце. — Я просто хотела, чтобы кто-нибудь сказал это вслух. Спасибо.\n\nОна встаёт и моет свою чашку. Очень долго.', effects: [set23('bn', 'tell'), w23('nina_told', true), npc('c7_nina', 3, 'c23_b_told_me'), until23(8, 15)] },
      { id: 'c23_bn_later', label: 'Сказать: давай вечером, втроём, с {A.ins}', when: not(ninaKnows), minutes: 15, terminal: true, outcomes: afterNina,
        text: '— Вечером, — повторяет Нина. — Вы все говорите «вечером».\n\nОна не обижается. Она просто запоминает.', effects: [set23('bn', 'later'), npc('c7_nina', -1), until23(8, 0)] },
      { id: 'c23_bn_where', label: 'Сказать, где', when: ninaKnows, minutes: 25, terminal: true, outcomes: afterNina,
        text: 'В яме за теплицей, у колонии. С остальными шестью. Солдаты засыпали известью.\n\nНина кивает.\n\n— Уте хочет забрать оттуда Кая. — Она смотрит в окно. — А папу никто не заберёт. Потому что я одна, а копать надо вдвоём.\n\nТы не знаешь, что на это сказать. Она и не ждёт.', effects: [set23('bn', 'where'), w23('nina_knows_grave', true), npc('c7_nina', 2), until23(8, 10)] },
      { id: 'c23_bn_cap', label: 'Сказать: когда земля оттает, мы перенесём его вместе', when: ninaKnows, minutes: 20, terminal: true, outcomes: afterNina,
        text: 'Нина долго смотрит на тебя.\n\n— Обещаешь? Не «посмотрим». Обещаешь?\n\nТы обещаешь. Она кивает и идёт на улицу, к курам, без куртки. Ты не останавливаешь.', effects: [set23('bn', 'cap'), w23('nina_spring', true), npc('c7_nina', 3, 'c23_b_promised_spring'), until23(8, 10)] },
    ] }),

  // ───────────── Церковь ─────────────
  J({ id: 'c23_b_church', title: 'Церковь в Йестебурге', ambient: { tempC: 2, outdoor: false, wet: false },
    text: [
      { text: 'Четыре километра по снегу, с Кёлер и двумя соседками. В церкви холодно, как обещала Нина. Народу много: стоят в проходах, у дверей.' },
      { text: 'Пастор не читает проповедь. Он читает имена. Долго. Из списков, которые приносят ему люди: на листках, на обрывках, на обороте квитанций. После каждого имени — пауза, и кто-то в зале говорит «да». Или не говорит.' },
      { when: sabine, text: 'В третьем ряду сидит Сабина, дочь Брандта. Рядом мальчик лет восьми, румяный, в пожарной шапке не по размеру. Матс. Он вертится, и Сабина его не одёргивает.' },
      { when: not(sabine), text: 'В третьем ряду сидит женщина в пожарной куртке. Рядом мальчик лет восьми, румяный, вертлявый. Он болтает ногами и считает свечи.' },
    ],
    actions: [
      { id: 'c23_bc_names', label: 'Отдать пастору свой листок: Вернер, Йенс, Кай', minutes: 60, terminal: true, goto: 'c23_b_snowball',
        text: 'Ты пишешь на обороте Нининого листка три имени. Подумав, дописываешь четвёртое: «Helmut», мужа Эвы. Пастор читает их в конце, вместе с другими.\n\nНа «Jens» никто не говорит «да». Ты говоришь.', effects: [set23('bc', 'names'), w23('names_read', true), until23(10, 40)] },
      { id: 'c23_bc_listen', label: 'Стоять у двери и слушать', minutes: 60, terminal: true, goto: 'c23_b_snowball',
        text: 'Имён больше, чем ты {m:думал|думала}. Ты пробуешь считать и сбиваешься на сороковом. Кёлер стоит рядом, прямо, и после одного имени, «Werner Köhler», говорит «да» так тихо, что слышишь только ты.', effects: [set23('bc', 'listen'), npc('c3_koehler', 2), until23(10, 40)] },
      { id: 'c23_bc_out', label: 'Выйти на воздух: внутри душно', minutes: 50, terminal: true, goto: 'c23_b_snowball',
        text: 'Ты выходишь на паперть. Снег, тишина, колокольня. Через стену доносится голос пастора: имя, пауза, имя. Ты стоишь, пока не замерзают ноги.', effects: [set23('bc', 'out'), until23(10, 30)] },
    ] }),

  J({ id: 'c23_b_snowball', title: 'Снежки у церкви', ambient: snow23,
    text: [
      { text: 'После службы дети бегают у церкви. Мальчик в пожарной шапке лепит снежки и швыряет их в забор. Метко. Щёки красные, нос течёт. Здоровый, как бывают здоровы восьмилетние в первый снег.' },
      { when: sabine, text: 'Сабина подходит к тебе сама.\n\n— Das ist Mats. Der kranke Mats. Für den Vater Spender sucht. — Она смотрит на сына. — Er hat seit zehn Tagen kein Fieber. Er hatte nie welches. Ein Kratzer vom Kaninchen, am Montag vor einer Woche. Das ist alles.\n\nЭто Матс. Тот самый больной Матс. Для которого отец ищет доноров. У него десять дней нет жара. Его никогда и не было. Царапина от кролика, в позапрошлый понедельник. Это всё.' },
      { when: not(sabine), text: 'Женщина в пожарной куртке зовёт его: «Mats! Mütze!» Матс! Шапку! Мальчик не слышит.\n\nКёлер тихо говорит тебе: это внук Брандта. Тот, ради которого в деревне собирают кровь.' },
    ],
    actions: [
      { id: 'c23_bw_sabine', label: 'Спросить Сабину, знает ли отец', when: sabine, minutes: 20, terminal: true, goto: 'c23_b_marcus',
        text: '— Er weiß es. Er glaubt es nicht. — Сабина застёгивает Матсу куртку, хотя он вырывается. — Er hat zugesehen, wie seine Frau krank wurde. Seitdem glaubt er an Blut. Er sammelt es wie andere Leute Konserven.\n\nОн знает. Он не верит. Он смотрел, как заболела его жена. С тех пор он верит в кровь. Собирает её, как другие собирают консервы.', effects: [set23('bw', 'sabine'), w23('mats_clean', true), w23('brandt_wife', true), until23(12, 15)] },
      { id: 'c23_bw_mats', label: 'Слепить снежок и кинуть в Матса', minutes: 15, terminal: true, goto: 'c23_b_marcus', ambientDuring: snow23,
        text: 'Снежок попадает Матсу в спину. Он разворачивается, оценивает тебя и отвечает: точно в лоб. Кёлер хохочет так, что ей приходится держаться за ограду. Сабина улыбается первый раз за всё время, что ты её {m:видел|видела}.\n\nДомой вы с Кёлер возвращаетесь к полудню, мокрые до колен.', effects: [set23('bw', 'mats'), w23('mats_clean', true), { body: 'stress', delta: -2 }, until23(12, 15)] },
      { id: 'c23_bw_home', label: 'Идти домой с Кёлер', minutes: 10, terminal: true, goto: 'c23_b_marcus',
        text: 'Кёлер берёт тебя под руку. Дорога обратно длиннее, чем туда. Соседки идут впереди и разговаривают только о хлебе.', effects: [set23('bw', 'home'), w23('mats_seen', true), until23(12, 15)] },
    ] }),

  // ───────────── Дом ─────────────
  B({ id: 'c23_b_home', title: 'Кладовка и чердак', camp: kitchen14,
    text: [
      { when: plasmaHome, text: 'В кладовке холодно, как в погребе. На крышке синей сумки полоска с тремя окошками. Вчера два были белыми, одно зелёным. Сегодня зелёное начало желтеть по краю.' },
      { when: all(insulinHome, not(plasmaHome)), text: 'В кладовке, на верхней полке, за банками с огурцами, стоит коробка с шприц-ручками. Десять штук.' },
      { when: not(insulinHome), text: 'В кладовке пусто там, где стояла сумка. Ты расставляешь банки на освободившемся месте.' },
      { when: leaHere23, text: 'Лея заходит следом. Смотрит на полоску, трогает крышку тыльной стороной ладони.\n\n— Bis Mittwoch. Dann ist es Wasser.\n\nДо среды. Потом это вода.' },
      { text: 'В кладовке холодно, как в погребе. На полке банки с огурцами, мешок муки, коробка с шприц-ручками за банками.' },
    ],
    actions: [
      { id: 'c23_bh_ice', label: 'Обложить сумку снегом с крыльца', when: plasmaHome, minutes: 30, terminal: true, goto: 'c23_b_lea',
        text: 'Ты набиваешь пакеты свежим снегом и закладываешь сумку со всех сторон. Полоска не возвращается к зелёному. Но и дальше не желтеет. Это всё, что можно сделать.', effects: [set23('bh', 'ice'), w23('plasma_iced', true), until23(9, 0)] },
      { id: 'c23_bh_count', label: 'Пересчитать ручки и подумать о Мерле', when: insulinHome, minutes: 20, terminal: true, goto: 'c23_b_lea',
        text: 'Десять. Мерле колола три в день, когда ты {m:видел|видела} её последний раз. Значит, этого ей на три дня. Или на неделю, если колоть реже. Или ни на сколько, если ты не сможешь до неё добраться.', effects: [set23('bh', 'count'), w23('merle_math', true), { body: 'stress', delta: 1 }, until23(8, 50)] },
      { id: 'c23_bh_clean', label: 'Прибраться в кладовке и на чердаке', minutes: 40, activity: 'light', terminal: true, goto: 'c23_b_lea',
        text: 'Ты переставляешь банки, выметаешь мышиный помёт, проверяешь мешки с мукой. На чердаке, у коптильни, сушатся Нинины варежки. Всё на своих местах.', effects: [set23('bh', 'clean'), until23(9, 10)] },
    ] }),

  B({ id: 'c23_b_lea', title: 'До полудня', camp: kitchen14,
    text: [
      { when: leaHere23, text: 'Лея моет посуду после завтрака. Посуды много, она моет быстро.\n\n— Ich gehe am Mittwoch, — говорит она, не оборачиваясь. Я уйду в среду. — Wenn die Plasma Wasser ist, braucht mich hier keiner mehr. Und Brandt sucht. Ich höre seine Trecker jeden Abend.\n\nКогда плазма станет водой, я тут больше никому не нужна. А Брандт ищет. Я каждый вечер слышу его тракторы.' },
      { when: not(leaHere23), text: 'Мальте зовёт тебя с лавки: бинт съехал. Ты перевязываешь, как Лея показывала. Он морщится и рассказывает про Целле, третий раз, теми же словами. Тебе не надоедает.' },
      { text: 'Лея сидит у окна швейной комнаты, смотрит на снег. Руки у неё на коленях, ладонями вверх, как будто она ждёт, что на них что-то положат.' },
    ],
    actions: [
      { id: 'c23_bl_stay', label: 'Сказать Лее: оставайся, пока не будет куда идти', when: leaHere23, minutes: 25, terminal: true, goto: 'c23_b_marcus',
        text: 'Лея ставит тарелку на сушилку и долго вытирает руки.\n\n— Und wenn Brandt kommt?\n\nА если придёт Брандт?\n\nТы не знаешь, что ответить. Она кивает, будто это и был ответ.\n\n— Bis Mittwoch. Dann reden wir.\n\nДо среды. Потом поговорим.', effects: [set23('bl', 'stay'), w23('lea_asked_stay', true), npc('c21_lea', 2), until23(12, 20)] },
      { id: 'c23_bl_route', label: 'Спросить, как она пойдёт в Ганновер', when: leaHere23, minutes: 30, terminal: true, goto: 'c23_b_marcus',
        text: 'Она рисует пальцем на мокром столе: Йестебург, Зальцхаузен, Целле — нет, Целле закрыт, — Зольтау, Вальсроде, Ганновер. Пешком пять дней. С ночёвками в сараях.\n\n— Allein. Mit zwei geht man langsamer und man fällt mehr auf.\n\nОдна. Вдвоём идёшь медленнее и больше бросаешься в глаза.', effects: [set23('bl', 'route'), w23('lea_route', true), until23(12, 20)] },
      { id: 'c23_bl_teach', label: 'Попросить научить Нину перевязкам', when: leaHere23, minutes: 40, terminal: true, goto: 'c23_b_marcus',
        text: 'Лея учит Нину на её же руке: сначала бинт, потом шина из линейки, потом жгут. Нина запоминает всё с первого раза и повторяет вслух по-немецки. К полудню она перевязывает Лее палец лучше, чем ты.', effects: [set23('bl', 'teach'), w23('nina_bandage', true), npc('c7_nina', 2), npc('c21_lea', 1), until23(12, 20)] },
      { id: 'c23_bl_malte', label: 'Слушать Мальте до конца', when: not(leaHere23), minutes: 40, terminal: true, goto: 'c23_b_marcus',
        text: 'Ты слушаешь. Про дом с зелёными ставнями, про Яну и Морица, про жену в аптеке. В конце он говорит:\n\n— Danke, dass du zuhörst. Morgen hört mir keiner mehr zu. Morgen bin ich eine Nummer.\n\nСпасибо, что слушаешь. Завтра меня никто не будет слушать. Завтра я номер.', effects: [set23('bl', 'malte'), npc('c21_malte', 2), until23(12, 20)] },
      { id: 'c23_bl_work', label: 'Взяться за стирку: в доме девять человек', when: not(leaHere23), minutes: 60, activity: 'moderate', terminal: true, goto: 'c23_b_marcus',
        text: 'Вода на плите, корыто, мыло. Нина полощет, ты трёшь. К полудню на верёвке в сенях висит всё, что было в доме грязного. Руки красные до локтей.', effects: [set23('bl', 'work'), { body: 'fatigue', delta: 5 }, until23(12, 25)] },
    ] }),

  B({ id: 'c23_b_marcus', title: 'Лео', camp: yard14, ambient: snow23, onEnter: [guestsArrive],
    text: [
      { when: guestsCome, text: 'В половине первого во дворе кто-то бежит, топая. Дверь распахивается, и в тебя с разбегу врезается мальчик в шапке до бровей. Обхватывает за пояс и не отпускает.' },
      { when: guestsCome, text: 'Лео. Он кашляет тебе в куртку, долго, сухо. За ним в дверях стоит Маркус, ещё худее, чем неделю назад.' },
      { when: all(guestsCome, promisedB), text: 'Ты {m:обещал|обещала} Лео тогда, что с ним ничего не случится. Он пришёл сказать, что ничего не случилось.' },
      { when: not(guestsCome), text: 'В половине первого {A} приносит с ворот мокрую записку: «WIR SIND IN WINSEN. LEO». Буквы печатные, неровные.' },
      { text: 'У мальчика ободраны ладони и колени: шли через поле, падали в борозды. Он не плачет, только морщится, когда ты касаешься ссадин.' },
    ],
    actions: [
      { id: 'c23_bm_check', label: 'Осмотреть Лео: лоб, горло, руки', when: guestsCome, minutes: 20, terminal: true, goto: 'c23_b_lunch',
        text: 'Лоб тёплый, не горячий. Горло красное. Руки чистые, на коленке старая ссадина, зажившая. Кашель сухой, как у всех, кто ночевал в сыром сарае.\n\n— Erkältet, — говоришь ты Маркусу. Простыл.\n\nМаркус выдыхает так, будто держал воздух с пятницы.', effects: [set23('bm', 'check'), w23('leo_cold', true), npc('c12_marcus', 2), until23(12, 50)] },
      { id: 'c23_bm_hug', label: 'Обнять его и ничего не говорить', when: guestsCome, minutes: 15, terminal: true, goto: 'c23_b_lunch',
        text: 'Лео стоит, уткнувшись в тебя, и дышит. Потом отпускает, вытирает нос рукавом и говорит, глядя в пол:\n\n— Marcus ist nicht krank geworden. Ich hab doch gebissen. Aber er ist nicht krank geworden.\n\nМаркус не заболел. Я же укусил. А он не заболел.', effects: [set23('bm', 'hug'), npc('c12_leo', 3), until23(12, 45)] },
      { id: 'c23_bm_draw', label: 'Посадить его рисовать с Ниной', when: guestsCome, minutes: 20, terminal: true, goto: 'c23_b_lunch',
        text: 'Нина даёт ему карандаши и тетрадь. Лео рисует дом с трубой, из трубы дым, у дома трое. Потом подумав, дорисовывает четвёртого, маленького, и курицу.', effects: [set23('bm', 'draw'), npc('c12_leo', 1), npc('c7_nina', 1), until23(12, 50)] },
      { id: 'c23_bm_note', label: 'Положить записку на подоконник, к Нининым рисункам', when: not(guestsCome), minutes: 5, terminal: true, goto: 'c23_b_lunch',
        text: 'Ты кладёшь записку на подоконник. Живы. Дошли. Этого достаточно.', effects: [set23('bm', 'note'), until23(12, 35)] },
    ] }),

  B({ id: 'c23_b_lunch', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед: суп и хлеб. За столом тесно, локти задевают локти.' },
      { when: guestsCome, text: 'Лео садится к тебе на колени, не спрашивая, и ест из твоей ложки. Маркус ест у окна, стоя.' },
    ],
    actions: [
      { id: 'c23_bu_eat', label: 'Поесть горячего', minutes: 25, terminal: true, goto: 'c23_b_ute', ...tableOnly,
        text: 'Ты ешь одной рукой. Другой держишь Лео, чтобы не свалился. Он засыпает на третьей ложке.', effects: [set23('bu', 'eat'), meal('eat'), until23(13, 40)] },
      { id: 'c23_bu_nap', label: 'Лечь на час: ночью {m:спал|спала} плохо', minutes: 30, terminal: true, goto: 'c23_b_ute',
        text: 'Ты засыпаешь сразу. Когда открываешь глаза, рядом на одеяле спит Лео, свернувшись, в шапке. Ты не помнишь, когда он пришёл.', effects: [set23('bu', 'nap'), until23(14, 30, true)] },
      { id: 'c23_bu_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c23_b_ute',
        text: 'Ты пьёшь чай и отдаёшь свой хлеб Лео. Он прячет его в карман: на потом.', effects: [set23('bu', 'tea'), until23(13, 20)] },
    ] }),

  B({ id: 'c23_b_ute', title: 'Отпеть', camp: yard14, ambient: snow23,
    text: [
      { text: 'После обеда у калитки Уте. Без лопаты: лопаты сегодня у Яннеса. В руках у неё варежки, вторая пара, детская.' },
      { text: '— Für den Kleinen. Ich hab gehört, ihr habt wieder einen Jungen.\n\nДля малыша. Я слышала, у вас снова мальчик.' },
      { text: '— Morgen früh holen wir Kai aus der Grube. Bringen ihn an den Bahndamm. Kommst du? Nicht zum Graben. Zum Singen. Ich kann nicht singen, wenn ich ihn sehe.\n\nЗавтра рано утром мы заберём Кая из ямы. Перенесём к насыпи. Придёшь? Не копать. Петь. Я не смогу петь, когда увижу его.' },
      { text: 'Уте стоит у калитки, держа в руках что-то, завёрнутое в платок. Её лицо спокойное, но губы сжаты так, что побелели.' },
      { when: v('$.c23_bu', 'tea'), text: 'Чай согрел, но в животе пусто.' },
      { when: v('$.c23_bu', 'nap'), text: 'После часа сна ты наконец {m:согрелся|согрелась}.' },
      { when: v('$.c23_bu', 'eat'), text: 'Горячий суп ещё греет изнутри.' },
    ],
    actions: [
      { id: 'c23_bt_yes', label: 'Пообещать прийти и спеть', minutes: 15, terminal: true, goto: 'c23_b_plasma',
        text: 'Уте кивает.\n\n— Irgendwas. Was du kannst. Er hat alles gemocht.\n\nЧто-нибудь. Что умеешь. Он любил всё.\n\nТы весь день будешь думать, что споёшь. И не придумаешь.', effects: [set23('bt', 'yes'), w23('sing_promised', true), npc('c14_ute', 3), until23(14, 0)] },
      { id: 'c23_bt_words', label: 'Сказать: петь не умею, но скажу слова', minutes: 15, terminal: true, goto: 'c23_b_plasma',
        text: '— Worte sind gut, — говорит Уте. Слова — хорошо. — Der Pastor hat gestern keine Zeit gehabt. Für sieben Gruben hat keiner Zeit.\n\nУ пастора вчера не нашлось времени. На семь ям ни у кого нет времени.', effects: [set23('bt', 'words'), w23('sing_promised', true), npc('c14_ute', 2), until23(14, 0)] },
      { id: 'c23_bt_brandt', label: 'Сказать: завтра в десять Брандт, мы не успеем', minutes: 15, terminal: true, goto: 'c23_b_plasma',
        text: '— Um sechs. Dann seid ihr um acht zurück. — Уте не спорит, она считает. — Wenn nicht, dann nicht.\n\nВ шесть. Тогда к восьми будете дома. Если нет — значит, нет.\n\nВарежки она всё равно оставляет.', effects: [set23('bt', 'brandt'), npc('c14_ute', 1), until23(14, 0)] },
    ] }),

  B({ id: 'c23_b_plasma', title: 'Что останется', camp: kitchen14,
    text: [
      { text: 'Дом полон людей. Мальте, Маркус, Лео, Нина, Эва. Завтра Брандт будет считать их по бумаге.' },
      { when: guestsCome, text: 'Маркус подходит к тебе, когда никого нет рядом.\n\n— Wenn die mich morgen finden. Nehmt ihr Leo? Nur bis mein Bruder kommt.\n\nЕсли меня завтра найдут. Возьмёте Лео? Только пока не придёт мой брат.' },
      { when: not(guestsCome), text: 'Эва перебирает в сенях обувь: чья, сколько пар, у кого нет зимней.' },
      { text: 'Сумка в кладовке стоит в углу, синяя, с полоской на крышке. Ты смотришь на неё каждый раз, когда проходишь мимо.' },
    ],
    actions: [
      { id: 'c23_bp_leo', label: 'Сказать Маркусу: Лео останется у нас, если что', when: guestsCome, minutes: 15, terminal: true, goto: 'c23_b_leo',
        text: 'Маркус кивает и сразу отворачивается к окну. Лео в углу рисует курицу и не слышит.', effects: [set23('bp', 'leo'), w23('leo_promise', true), npc('c12_marcus', 3), until23(15, 30)] },
      { id: 'c23_bp_why', label: 'Спросить, почему его должны найти', when: guestsCome, minutes: 20, terminal: true, goto: 'c23_b_leo',
        text: '— Weil ich auf keiner Liste stehe. Und Leo auch nicht. Und wer auf keiner Liste steht, ist verdächtig. — Он смотрит на свою руку. — Und weil ich gebissen wurde. Von einem Kind. Das glaubt mir keiner, der die Narben sieht.\n\nПотому что я ни в одном списке. И Лео тоже. А кто ни в одном списке, тот подозрителен. И потому что меня укусили. Ребёнок. Мне никто не поверит, кто увидит шрамы.', effects: [set23('bp', 'why'), w23('marcus_scars', true), until23(15, 30)] },
      { id: 'c23_bp_shoes', label: 'Помочь Эве с обувью', minutes: 40, terminal: true, goto: 'c23_b_leo',
        text: 'Сапоги Нины малы. У Мальте один ботинок. У Лео кеды. Эва вздыхает и достаёт из шкафа Хенрике пару старых валенок, с войлоком, огромных.\n\n— Für den Kleinen. Mit drei Socken passt das.\n\nДля малыша. С тремя носками подойдут.', effects: [set23('bp', 'shoes'), npc('c8_eva', 1), until23(15, 40)] },
    ] }),

  B({ id: 'c23_b_sms', title: 'Сообщение', camp: yard14, ambient: snow23,
    text: [
      { text: 'В пятом часу телефон вздрагивает. Одна полоска, у сарая.' },
      { when: merle, text: 'Сообщение от матери Мерле, отправленное в пятницу: «Merle hat noch bis Dienstag. Arensburg sagt: keine Lieferung. Wenn du irgendwas weißt. Bitte».\n\nУ Мерле осталось до вторника. Аренсбург говорит: поставок нет. Если ты что-нибудь знаешь. Пожалуйста.' },
      { when: not(merle), text: 'Сообщение от соседки по квартире в Бармбеке, отправленное три дня назад: «Bist du am Leben? Hier ist alles ruhig. Zu ruhig. Okafor hat nach dir gefragt».\n\nТы там жива? Тут всё спокойно. Слишком. Окафор спрашивал про тебя.' },
      { text: 'Телефон вибрирует в кармане фартука. Одна полоска сети, в первый раз за день.' },
      { when: v('$.c23_bl9', 'in'), text: 'Маркус и Лео греются на кухне: ты {m:позвал|позвала} их в дом, когда стало темнеть.' },
    ],
    actions: [
      { id: 'c23_bz_insulin', label: 'Ответить: у меня есть инсулин. Как его передать?', when: all(merle, insulinHome), minutes: 15, terminal: true, goto: 'c23_supper', enabled: { phoneUsable: true }, disabledReason: 'Телефон сел',
        text: 'Ответ уходит с третьей попытки. Ответ на ответ не приходит. Окно сети закрывается, как будто его и не было. Ты стоишь у сарая с поднятой рукой ещё десять минут.', effects: [set23('bz', 'insulin'), w23('merle_told_insulin', true), { charge: 'phone', delta: -1 }, until23(17, 20)] },
      { id: 'c23_bz_hold', label: 'Ответить: держитесь. Я что-нибудь придумаю', minutes: 10, terminal: true, goto: 'c23_supper', enabled: { phoneUsable: true }, disabledReason: 'Телефон сел',
        text: 'Ты пишешь и стираешь три раза. Отправляешь короткое. Что «что-нибудь», ты не знаешь {m:сам|сама}.', effects: [set23('bz', 'hold'), { charge: 'phone', delta: -1 }, until23(17, 15)] },
      { id: 'c23_bz_off', label: 'Не отвечать сейчас', minutes: 5, terminal: true, goto: 'c23_supper',
        text: 'Ты убираешь телефон. Сообщение остаётся непрочитанным. Для них.', effects: [set23('bz', 'off'), until23(17, 10)] },
    ] }),
];
