import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, not } from './world3';
import { house14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { S25, set25, until25 } from './point25';

// Участок 25, третий проход (до уровня 19–20): пост в Ханштедте по дороге в Люнебург (A), доска с пайками у пожарной части (B) —
// апелляция может отменить урезание пайка в 26-й; поздний вечер у обоих.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S25({ ...scene, for: 'any', chapter: 'ch3' });
const van = { tempC: 8, outdoor: false, wet: false };
const jest = 'c16_jesteburg';
const atRisk: Cond = all(not(v('w.c24_ration', 'half')), any(v('w.c19_cart', 'refused'), v('w.c20_list', 'lie2')));

export const day25GScenes: Scene[] = [
  X({ id: 'c25_a_post', title: 'Ханштедт', location: 'c7_farm_lane', ambient: van,
    text: [
      { text: 'У Ханштедта шлагбаум. Солдат светит в кабину, потом обходит фургон и стучит по задней двери. Мешки с бельём, ты среди них.' },
      { text: '— Wer ist das? — спрашивает он Весселя, кивая на тебя. Кто это? — Der steht nicht auf meinem Zettel.\n\nЕго нет в моей бумаге.' },
      { text: 'Шлагбаум — две бочки и труба поперёк дороги. В железном ведре у бочки горит костёр, у костра греются ещё двое, молодые, в касках набекрень.' },
    ],
    actions: [
      { id: 'c25_ap2_truth', label: 'Сказать самому: еду навестить Оле Людемана, донора', minutes: 20, terminal: true, goto: 'c25_a_gate',
        text: 'Солдат слушает, смотрит в твою бумагу из пункта, потом в свою. «Lüdemann. Der Spender. Gut». Людеман. Донор. Ладно. Он вписывает тебя карандашом в конец листа. Теперь ты есть в списке тех, кто ездит в Люнебург.', effects: [set25('ap2', 'truth'), { set: 'w.c25_post', value: 'listed' }, until25(8, 10)] },
      { id: 'c25_ap2_wessel', label: 'Промолчать: пусть говорит Вессель', minutes: 20, terminal: true, goto: 'c25_a_gate',
        text: '— Mein Beifahrer. Säcke schleppen, — говорит Вессель. Мой помощник. Мешки таскать. Солдат машет: проезжайте. Вессель не смотрит на тебя до самого Люнебурга, но на въезде говорит: «Jetzt schuldest du mir was». Теперь ты мне должен.', effects: [set25('ap2', 'wessel'), { set: 'w.c25_post', value: 'wessel' }, npc('c27_wessel', 1, 'c25_covered_a'), until25(8, 10)] },
      { id: 'c25_ap2_eggs', label: 'Протянуть солдату пару яиц из свёртка Хенрике', minutes: 20, terminal: true, goto: 'c25_a_gate',
        text: 'Солдат смотрит на яйца, потом на тебя. Берёт. «Weiter». Дальше. Вессель трогается и говорит, не поворачивая головы: «Das machst du nicht noch mal. Der merkt sich Gesichter». Больше так не делай. Он запоминает лица.', effects: [set25('ap2', 'eggs'), { set: 'w.c25_post', value: 'eggs' }, until25(8, 10)] },
    ] }),

  X({ id: 'c25_b_board', title: 'Доска у пожарной части', location: jest, camp: { at: jest, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: { tempC: -2, outdoor: true, wet: false },
    text: [
      { text: 'По дороге из пункта ты проходишь мимо доски у пожарной части. Новый лист: пайки на неделю, по дворам. Люди стоят и ищут свои фамилии, водя пальцем.' },
      { when: atRisk, text: 'Против «Lüdemann-Hof» карандашом: «prüfen». Проверить. Женщина рядом объясняет: где «prüfen», там паёк урезают вдвое, пока Брандт не разберётся. Разбираться он может месяц.' },
      { when: not(atRisk), text: 'Против «Lüdemann-Hof» — полный паёк. Рядом с другими фамилиями — «halb», «prüfen», «gestrichen». Урезано, проверить, вычеркнут.' },
    ],
    actions: [
      { id: 'c25_bb2_zander', label: 'Вернуться и попросить Зандер заступиться', when: atRisk, minutes: 50, terminal: true, goto: 'c25_b_homeway',
        text: 'Зандер выслушивает и идёт с тобой к Брандту, прямо в халате. Говорит коротко: этот двор кормит её пункт яйцами и даёт руки. Брандт смотрит на тебя, потом на неё, стирает «prüfen» резинкой. «Diesmal». В этот раз.\n\nЗандер выходит на крыльцо без пальто, слушает и уходит в караулку быстрым шагом, не говоря ни слова.', effects: [set25('bb2', 'zander'), { set: 'w.c25_appeal', value: 'won' }, npc('c16_brandt', -1, 'c25_b_appealed'), until25(11, 45)] },
      { id: 'c25_bb2_clerk', label: 'Пойти к писарю и объяснить {m:самому|самой}', when: atRisk, minutes: 40, risky: true, terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 4 }, goto: 'c25_b_homeway', text: 'Писарь, старик в нарукавниках, слушает, морщится, смотрит в свои бумаги. Потом стирает пометку. «Wenn Brandt fragt, ich habe nichts gesagt». Если Брандт спросит, я ничего не говорил.', effects: [set25('bb2', 'clerk'), { set: 'w.c25_appeal', value: 'won' }, until25(11, 45)] },
          { id: 'no', goto: 'c25_b_homeway', text: 'Писарь качает головой: не ему решать. Пометка остаётся. Ты уходишь, и тебе кажется, что все у доски смотрят тебе в спину.', effects: [set25('bb2', 'clerk'), { set: 'w.c25_appeal', value: 'lost' }, until25(11, 45)] },
        ] },
      { id: 'c25_bb2_leave', label: 'Не связываться: Брандт и так злится', when: atRisk, minutes: 20, terminal: true, goto: 'c25_b_homeway',
        text: 'Ты отходишь от доски. «Prüfen». Дома ты не знаешь, как об этом сказать.\n\nТы уходишь от доски, не оглядываясь. Карандашное слово остаётся там, где было.', effects: [set25('bb2', 'leave'), { set: 'w.c25_appeal', value: 'none' }, until25(11, 37)] },
      { id: 'c25_bb2_help', label: 'Помочь старухе найти её фамилию в списке', when: not(atRisk), minutes: 30, terminal: true, goto: 'c25_b_homeway',
        text: 'Её фамилия — внизу, «halb». Старуха кивает, будто ждала этого. Ты провожаешь её до перекрёстка. По дороге она рассказывает, что сын в Ганновере и не пишет. Прощаясь, суёт тебе в карман сушёное яблоко.\n\nСтаруха находит фамилию сама, раньше тебя, и долго стоит, держа палец на строчке.', effects: [set25('bb2', 'help'), { set: 'w.c25_board', value: 'helped' }, npc('c3_koehler', 1), until25(11, 40)] },
      { id: 'c25_bb2_read', label: 'Прочитать весь список: кто вычеркнут', when: not(atRisk), minutes: 30, terminal: true, goto: 'c25_b_homeway',
        text: 'Семь фамилий вычеркнуты. Рядом мелко: «verstorben» или «verzogen». Умер или уехал. Против одной — «Plasma». Ты запоминаешь фамилию: Ланге.\n\nВычеркнутых больше, чем ты думал{m:|а}. Против некоторых фамилий стоит крестик. Против одной — вопросительный знак.', effects: [set25('bb2', 'read'), { set: 'w.c25_board', value: 'read' }, until25(11, 40)] },
      { id: 'c25_bb2_home', label: 'Идти домой', when: not(atRisk), minutes: 10, terminal: true, goto: 'c25_b_homeway',
        text: 'Полный паёк. Хорошо. Ты идёшь домой быстрее, чем {m:шёл|шла} сюда.\n\nОбратная дорога кажется короче. Ветер в спину, и следы санок уже присыпало.', effects: [set25('bb2', 'home'), until25(11, 35)] },
    ] }),

  X({ id: 'c25_a_late', title: 'Поздно', camp: yard14, ambient: { tempC: -3, outdoor: true, wet: false }, onEnter: [until25(20, 0)],
    text: [
      { text: 'Поздно вечером ты выходишь проводить Весселя: фургон стоит у пекарни Кёлер, он ночует в кабине, чтобы утром сразу в Люнебург.' },
      { text: 'Он сидит в кабине с термосом и смотрит на дорогу.' },
      { text: 'Пекарня Кёлер тёмная, только в окне за сеткой от мух мерцает свеча.' },
      { when: v('$.c25_su', 'tea'), text: 'Ты так и не {m:поел|поела} толком за ужином. Под ложечкой сосёт.' },
      { when: v('$.c25_ev', 'short'), text: 'Ты {m:рассказал|рассказала} только главное. Остальное ещё ворочается внутри.' },
    ],
    actions: [
      { id: 'c25_al4_food', label: 'Принести ему горячего и посидеть в кабине', minutes: 40, terminal: true, goto: 'c25_checkpoint',
        text: 'Ты приносишь миску супа. Вессель ест медленно, потом рассказывает про жену, про Бухгольц, про четвёртое отделение. Немного. Потом замолкает. Ты сидишь рядом, пока не стынут ноги.', effects: [set25('al4', 'food'), npc('c27_wessel', 2, 'c25_brought_soup'), until25(21, 0)] },
      { id: 'c25_al4_thanks', label: 'Поблагодарить за дорогу и уйти', minutes: 15, terminal: true, goto: 'c25_checkpoint',
        text: 'Вессель кивает. «Freitag wieder». В пятницу опять. Ты уходишь. Фонарь в кабине гаснет.', effects: [set25('al4', 'thanks'), npc('c27_wessel', 1), until25(20, 30)] },
      { id: 'c25_al4_ask', label: 'Спросить, сможет ли он когда-нибудь привезти Оле', minutes: 30, terminal: true, goto: 'c25_checkpoint',
        text: '— Wenn sie ihn gehen lassen, — говорит Вессель. Если отпустят. — Und wenn ich dann noch fahre. Ich verspreche nichts.\n\nИ если я тогда ещё буду ездить. Ничего не обещаю. Но запоминает: ты видишь это по тому, как он кивает.', effects: [set25('al4', 'ask'), { set: 'w.c25_wessel_ole', value: true }, until25(20, 45)] },
    ] }),

  X({ id: 'c25_b_late', title: 'Поздно', camp: house14, onEnter: [until25(20, 0)],
    text: [
      { when: ninaFarm, text: 'Поздно вечером Нина приносит тебе чай и садится рядом, не уходит. Завтра, может быть, привезут Оле. Или не привезут. В доме все об этом думают, никто не говорит.' },
      { when: not(ninaFarm), text: 'Нины нет. Чай ты наливаешь себе {m:сам|сама} и садишься у окна {m:один|одна}.' },
      { when: v('$.c25_su', 'tea'), text: 'Ты так и не {m:поел|поела} толком за ужином. Под ложечкой сосёт.' },
      { when: v('$.c25_ev', 'short'), text: 'Ты {m:рассказал|рассказала} только главное. Остальное ещё ворочается внутри.' },
      { text: 'В доме тихо так, что слышно, как в печи оседают угли.' },
    ],
    actions: [
      { id: 'c25_bl7_talk', label: 'Рассказать Нине, каким был Оле в октябре', when: ninaFarm, minutes: 40, terminal: true, goto: 'c25_checkpoint',
        text: 'Ты рассказываешь: как он чинил забор, как смеялся над козой. Нина слушает и говорит: «Он вернётся другим». Она права. Ты не знаешь, что на это ответить.', effects: [set25('bl7', 'talk'), npc('c7_nina', 1, 'c25_told_ole'), until25(21, 0)] },
      { id: 'c25_bl7_room', label: 'Пойти ещё раз проверить комнату Оле', minutes: 30, terminal: true, goto: 'c25_checkpoint',
        text: 'Постель застелена, окно закрыто, у кровати кувшин воды. Ты поправляешь подушку, которую уже {m:поправлял|поправляла}. Нина смотрит с порога и ничего не говорит.', effects: [set25('bl7', 'room'), { set: 'w.c25_room_checked', value: true }, until25(20, 40)] },
      { id: 'c25_bl7_sleep', label: 'Лечь: завтра длинный день', minutes: 20, terminal: true, goto: 'c25_checkpoint',
        text: 'Ты ложишься и долго слушаешь, как дом скрипит на морозе.', effects: [set25('bl7', 'sleep'), until25(20, 30)] },
    ] }),
];
