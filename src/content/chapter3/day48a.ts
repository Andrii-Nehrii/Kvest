import type { Scene } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { flag, not } from './world3';
import { yard14 } from './point14';
import { v } from './point18';
import {
  S48, bjornAlive48, cellar48, dark48, day48, fed48, jest48, letter48, set48, silvester48, trip48, until48, w48, winsen48,
} from './point48';

// Участок 48, линия A — утро. Колонна ушла с {B}: Винзен после прощания (Вибке, рынок, пустой двор школы), обратно в Йестебург,
// Брандт про Сильвестр. Обычный день: к шести — к Нильсу в Йестебург (письмо Тобиасу по КТ46, мешок для винзенского спортзала
// по КТ47), Брандт, Лукас. После обеда — общий день хутора (`point48.ts`).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S48({ ...scene, for: 'any', chapter: 'ch3' });
const toJest: Effect = { move: jest48 };
const toFarm: Effect = { move: 'hof_luedemann' };

export const day48AScenes: Scene[] = [
  // ═════════════ Колонна ушла ═════════════
  X({ id: 'c48_ha_market', title: 'Пустой двор', location: winsen48, camp: trip48(winsen48), ambient: dark48,
    text: [
      { text: 'Автобус трогается последним. В заднем стекле — две головы, одна в шапке, одна с косой. Рука машет, потом не машет. Джип дружины, машины Красного Креста, автобус — и пустой двор школы, где только что было сто человек.' },
      { text: 'Светает. Вибке стоит у дверей с пустой тетрадью и смотрит на дорогу дольше всех.' },
    ],
    actions: [
      { id: 'c48_hm_wiebke', label: 'Подойти к Вибке', minutes: 40, terminal: true, goto: 'c48_ha_ride', ambientDuring: dark48,
        text: 'Вибке узнаёт тебя: «Du bist der von der Schwester». Ты тот, что с сестрой. Она говорит, что в восемь вечера по рации будет слово из Эппендорфа: доехали или нет. «Hör zu. Um acht». Слушай. В восемь.', effects: [set48('hm', 'wiebke'), w48('a_knows_radio', true), until48(8, 0)] },
      { id: 'c48_hm_market', label: 'Пройти через рынок у школы: что-нибудь к Сильвестру', minutes: 40, terminal: true, goto: 'c48_ha_ride', ambientDuring: dark48,
        text: 'Рынок только раскладывается. Женщина продаёт свечи из огарков, старик — сушёные яблоки, мальчишка — петарды в целлофане, по одной. Ты берёшь свечи за горсть гвоздей. На петарды смотришь долго и не берёшь.', effects: [set48('hm', 'market'), w48('a_candles', true), until48(8, 0)] },
      { id: 'c48_hm_stand', label: 'Стоять у ворот, пока не стихнет звук моторов', minutes: 30, terminal: true, goto: 'c48_ha_ride', ambientDuring: dark48,
        text: 'Звук моторов стихает за поворотом на Харбург, потом ещё слышен, потом нет. Ты стоишь, пока мороз не пробирается под куртку. Потом поворачиваешься и идёшь. Неделя — это семь дней. Ты считаешь их по пальцам. Пальцы мёрзнут.', effects: [set48('hm', 'stand'), { body: 'stress', delta: 4 }, until48(7, 50)] },
    ] }),

  X({ id: 'c48_ha_ride', title: 'Дорога назад', location: 'c7_farm_lane', camp: trip48('c7_farm_lane'), ambient: day48,
    text: [
      { text: 'Обратно — на прицепе у Лукаса, полтора часа по укатанной дороге. На снегу ещё видны следы колонны: широкие, от автобуса, и узкие, от джипа дружины. Они ведут на север. Ты едешь на юг.' },
      { text: 'Лукас молчит всю дорогу, а потом, у поворота на Йестебург, говорит не оборачиваясь: «Die kommt wieder. Die kommen immer wieder». Она вернётся. Они всегда возвращаются.' },
    ],
    actions: [
      { id: 'c48_hrd_count', label: 'Считать дни на пальцах: до четвёртого', minutes: 90, terminal: true, goto: 'c48_ha_back', ambientDuring: day48,
        text: 'Вторник, среда, четверг — Сильвестр, пятница — Новый год, суббота, воскресенье, понедельник. Семь пальцев. Ты прячешь руки в карманы, чтобы не считать снова.', effects: [set48('hrd', 'count'), until48(10, 0)] },
      { id: 'c48_hrd_lukas', label: 'Спросить Лукаса, откуда он знает, что возвращаются', minutes: 90, terminal: true, goto: 'c48_ha_back', ambientDuring: day48,
        text: 'Лукас пожимает плечами. Он возил людей к колонне шесть раз. Все, кто уезжал с Нильсом, вернулись. «Nils bringt zurück, wen er hinbringt». Нильс привозит, кого отвёз. Ты слышал{m:|а} это уже от самого Нильса. От Лукаса звучит убедительнее.', effects: [set48('hrd', 'lukas'), until48(10, 0)] },
      { id: 'c48_hrd_sleep', label: 'Привалиться к борту и подремать', minutes: 90, terminal: true, goto: 'c48_ha_back', ambientDuring: day48,
        text: 'Ты засыпаешь под тряску и просыпаешься в Йестебурге, с инеем на воротнике. Лукас смотрит на тебя и смеётся: «Du hast geschnarcht». Ты храпел{m:|а}.', effects: [set48('hrd', 'sleep'), { body: 'fatigue', delta: -6 }, until48(10, 0)] },
    ] }),

  X({ id: 'c48_ha_back', title: 'Обратно', location: jest48, camp: trip48(jest48), ambient: day48,
    text: [
      { text: 'Йестебург. Лукас высаживает тебя у пожарной части и уезжает ставить трактор. Пахнет дымом: на площади уже складывают дрова.' },
      { text: 'Брандт как раз вешает на ворота лист: «Silvester. 20 Uhr. Feuer. Suppe. Jeder Hof bringt Holz». Сильвестр. 20 часов. Огонь. Суп. Каждый двор несёт дрова.' },
      { when: silvester48('stay'), text: 'Увидев тебя, Брандт отворачивается к листу. Ваш двор дома. Он помнит.' },
      { when: flag('w.c47_owe_brandt'), text: 'Увидев тебя, Брандт стучит пальцем по листу: «Und ihr steht Wache. Abgemacht ist abgemacht». А вы стоите в страже. Договор есть договор.' },
    ],
    actions: [
      { id: 'c48_hb2_brandt', label: 'Спросить Брандта, кто ещё будет в страже и где', minutes: 60, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48,
        text: 'Брандт раскладывает на капоте джипа карту: площадь, три улицы, лесополоса. Кресты — где стоять. Он говорит быстро и много, впервые без крика. Тебе кажется, что он тоже боится этого вечера и поэтому так к нему готовится.', effects: [set48('hb2', 'brandt'), w48('a_knows_plan', true), toFarm, until48(11, 45)] },
      { id: 'c48_hb2_wood', label: 'Сразу притащить к поленнице на площади вязанку от вашего двора', minutes: 60, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48, activity: 'heavy',
        text: 'Вязанка от сарая пожарной части до кучи на площади. Куча уже выше крыши гаража. Брандт ставит в блокноте галочку напротив хутора Людеманов. Хоть одну.', effects: [set48('hb2', 'wood'), w48('wood_given', true), { body: 'fatigue', delta: 5 }, toFarm, until48(11, 45)] },
      { id: 'c48_hb2_home', label: 'Домой, сразу: там теперь на одну пару рук меньше', minutes: 45, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48,
        text: 'Ты идёшь домой полем, быстро. Дома всё по-прежнему, только тише. Уве сидит на крыльце и смотрит на дорогу, по которой утром уехала его дочь.', effects: [set48('hb2', 'home'), toFarm, until48(10, 50)] },
    ] }),

  // ═════════════ Обычный день: утро A ═════════════
  X({ id: 'c48_na_nils', title: 'Нильс', location: jest48, camp: trip48(jest48), ambient: dark48,
    text: [
      { text: 'Без четверти шесть, Йестебург. Белый грузовик у пожарной части прогревает мотор, из трубы пар столбом. Нильс счищает лёд с лобового стекла пластиковой картой.' },
      { when: letter48, text: 'Во внутреннем кармане у тебя письмо Тобиасу: несколько строк, которые вы написали вдвоём.' },
      { when: cellar48('point'), text: 'На санках за тобой — мешок картошки и банки для винзенского спортзала: так решили.' },
    ],
    actions: [
      { id: 'c48_nn2_letter', label: 'Отдать Нильсу письмо для полевой почты', when: letter48, minutes: 30, terminal: true, goto: 'c48_na_brandt', ambientDuring: dark48,
        text: 'Нильс прячет конверт во внутренний карман. «Lauenburg. Feldpost. Dauert, kommt aber». Лауэнбург. Полевая почта. Долго, но дойдёт. Он хлопает по карману, как будто запирает.', effects: [set48('nn2', 'letter'), w48('letter_sent', true), toJest, until48(6, 15)] },
      { id: 'c48_nn2_sack', label: 'Погрузить мешок для спортзала в кузов', when: cellar48('point'), minutes: 30, terminal: true, goto: 'c48_na_brandt', ambientDuring: dark48,
        text: 'Мешок, банки, всё в кузов к коробкам. Нильс пишет на мешке мелом: «Turnhalle Winsen — von Lüdemann». Спортзал Винзена — от Людеманов. «Wiebke wird weinen. Sie tut nur so, als ob sie nicht weint». Вибке заплачет. Она только делает вид, что не плачет.', effects: [set48('nn2', 'sack'), w48('sack_sent', true), toJest, until48(6, 15)] },
      { id: 'c48_nn2_talk', label: 'Помочь со стеклом и спросить про мост', minutes: 30, terminal: true, goto: 'c48_na_brandt', ambientDuring: dark48,
        text: 'Вы счищаете лёд вдвоём. Нильс говорит, что мост в Харбурге держат гамбургские, не армия, и что после Нового года «wird es eng». Станет тесно. Что это значит, он не объясняет.', effects: [set48('nn2', 'talk'), w48('a_bridge_warn', true), toJest, until48(6, 15)] },
      { id: 'c48_nn2_coffee', label: 'Просто постоять с ним, пока греется мотор', minutes: 30, terminal: true, goto: 'c48_na_brandt', ambientDuring: dark48,
        text: 'Нильс наливает тебе кофе из термоса в крышку. Вы пьёте по очереди. Мотор урчит. В шесть он садится за руль, машет и уезжает к Винзену. Красные огни долго видно на прямой.', effects: [set48('nn2', 'coffee'), ...fed48(10), toJest, until48(6, 15)] },
    ] }),

  X({ id: 'c48_na_brandt', title: 'Пожарная часть', location: jest48, camp: trip48(jest48), ambient: dark48,
    text: [
      { text: 'Светает. Брандт уже на ногах: вешает на ворота лист про Сильвестр и сам себе кивает. Лукас таскает дрова к куче на площади.' },
      { when: bjornAlive48, text: '— Der Tiede-Junge sitzt allein auf dem Hof. Will nicht weg. Schaut mal nach ihm, ihr seid am nächsten.\n\nПарень Тиде сидит один на дворе. Уходить не хочет. Загляните к нему, вы ближе всех.' },
      { when: not(bjornAlive48), text: '— Bei Tiedes haben wir gestern zugemacht. Beide. — Брандт не смотрит на тебя. — Geht mal hin, wenn ihr könnt. Da sind noch Hühner.\n\nУ Тиде мы вчера закрыли. Обоих. Сходите, если сможете. Там ещё куры.' },
    ],
    actions: [
      { id: 'c48_nb2_plan', label: 'Спросить, как будет устроен Сильвестр', minutes: 60, terminal: true, goto: 'c48_na_lukas', ambientDuring: day48,
        text: 'Брандт раскладывает на капоте карту: площадь, улицы, лесополоса, кресты постов. Говорит много, без крика. Ты понимаешь, что он боится этого вечера и поэтому готовит его, как войну.', effects: [set48('nb2', 'plan'), w48('a_knows_plan', true), until48(7, 30)] },
      { id: 'c48_nb2_bjorn', label: 'Спросить, что говорят про Бьёрна', when: bjornAlive48, minutes: 60, terminal: true, goto: 'c48_na_lukas', ambientDuring: day48,
        text: 'Брандт пожимает плечами. Родни нет. Мать умерла давно. Школа в Винзене с ночёвкой, но Бьёрн не хочет. «Sechzehn. Mit sechzehn wollte ich auch nichts». Шестнадцать. В шестнадцать я тоже ничего не хотел.', effects: [set48('nb2', 'bjorn'), w48('a_heard_bjorn', true), until48(7, 30)] },
      { id: 'c48_nb2_help', label: 'Помочь Лукасу с дровами к куче', minutes: 60, terminal: true, goto: 'c48_na_lukas', ambientDuring: day48, activity: 'heavy',
        text: 'Охапка за охапкой, от сарая к куче. Куча уже выше гаража. Лукас рассказывает про ракеты с прошлого года и подмигивает: где они сейчас, он не скажет даже тебе.', effects: [set48('nb2', 'help'), { body: 'fatigue', delta: 5 }, until48(7, 30)] },
      { id: 'c48_nb2_coffee', label: 'Выпить с Брандтом кофе из его термоса и помолчать', minutes: 60, terminal: true, goto: 'c48_na_lukas',
        text: 'Брандт наливает тебе в крышку термоса, себе — в кружку с надписью «Bester Opa». Вы пьёте молча, глядя на кучу дров. Потом он говорит: «Wenn das schiefgeht, bin ich schuld». Если это плохо кончится, виноват я. И уходит, не дожидаясь ответа.', effects: [set48('nb2', 'coffee'), until48(7, 30)] },
    ] }),

  X({ id: 'c48_na_lukas', title: 'Лукас', location: jest48, camp: trip48(jest48), ambient: day48,
    text: [
      { text: 'Лукас догоняет тебя у выезда из Йестебурга, запыхавшийся. Ему надо что-то сказать, и он не знает, как.' },
      { text: '— Darf ich Silvester bei euch Wache stehen? Papa sagt, für die Posten am Wald bin ich zu jung. Ich will nicht Suppe tragen. Ich will was tun.\n\nМожно я в Сильвестр постою в страже с вами? Папа говорит, для постов у леса я слишком молодой. Я не хочу носить суп. Я хочу что-то делать.' },
    ],
    actions: [
      { id: 'c48_nl2_yes', label: 'Сказать: можно, но рядом со мной и без ракет', minutes: 30, terminal: true, goto: 'c48_na_colony', ambientDuring: day48,
        text: 'Лукас кивает так, что шапка съезжает на глаза. «Ohne Raketen. Versprochen». Без ракет. Обещаю. Он бежит обратно к пожарной части, и ты знаешь, что про ракеты он врёт. Немного.', effects: [set48('nl2', 'yes'), w48('lukas_watch', true), until48(8, 30)] },
      { id: 'c48_nl2_father', label: 'Сказать: спроси у отца, а я не против', minutes: 30, terminal: true, goto: 'c48_na_colony', ambientDuring: day48,
        text: 'Лукас морщится: отец скажет «нет», он всегда говорит «нет». Потом вздыхает и идёт спрашивать. Ты смотришь, как он идёт: плечи вперёд, как у взрослого.', effects: [set48('nl2', 'father'), until48(8, 30)] },
      { id: 'c48_nl2_why', label: 'Спросить, почему ему так этого хочется', minutes: 30, terminal: true, goto: 'c48_na_colony', ambientDuring: day48,
        text: 'Лукас молчит. Потом говорит: в субботу в цепи он видел, как дружинник бьёт того, вмёрзшего под елью. И ему не было страшно. Совсем. «Das macht mir Angst. Dass es mir keine macht». Вот это меня и пугает. Что мне не страшно. Он уходит, не прощаясь.', effects: [set48('nl2', 'why'), w48('lukas_talk', true), until48(8, 30)] },
    ] }),

  X({ id: 'c48_na_colony', title: 'Колония', location: 'c15_garden', camp: trip48('c15_garden'), ambient: day48,
    text: [
      { text: 'Обратная дорога идёт мимо колонии. Яннес у своего домика вбивает в снег колья с тряпками: размечает, где в Сильвестр встанут посты со стороны леса.' },
      { when: v('w.c47_jannes_leg', 'rest'), text: 'Ему запретили стоять на постах до Нового года. Колья он вбивает сидя на ящике, ругаясь при каждом ударе.' },
      { text: '— Drei Posten zum Wald. Einer hier, einer an der Brücke, einer bei Tiedes. Wenn da einer schläft, ist das Feuer am Platz eine Laterne für die da drin.\n\nТри поста к лесу. Один здесь, один у мостика, один у Тиде. Если там кто-то уснёт, огонь на площади станет фонарём для тех, кто внутри.' },
    ],
    actions: [
      { id: 'c48_nc_help', label: 'Помочь ему вбить колья до мостика', minutes: 75, terminal: true, goto: 'c48_na_back', ambientDuring: day48, activity: 'moderate',
        text: 'Ты держишь кол, Яннес бьёт обухом. Двенадцать кольев, двенадцать тряпок, от колонии до мостика. Яннес выпрямляется, смотрит на линию и говорит: «Jetzt sieht man wenigstens, wo man Angst haben muss». Теперь хотя бы видно, где бояться.', effects: [set48('nc', 'help'), w48('stakes', true), { body: 'fatigue', delta: 4 }, until48(10, 15)] },
      { id: 'c48_nc_which', label: 'Спросить, какой пост он считает самым опасным', minutes: 60, terminal: true, goto: 'c48_na_back', ambientDuring: day48,
        text: 'У Тиде, не задумываясь. Двор пустой или почти, лесополоса в двадцати метрах, канава. «Da stell ich mich hin. Oder einer, der nicht schläft». Туда встану я. Или тот, кто не спит. Он смотрит на тебя.', effects: [set48('nc', 'which'), w48('tiede_post', true), until48(10, 0)] },
      { id: 'c48_nc_ute', label: 'Зайти к Уте: она машет из окна', minutes: 60, terminal: true, goto: 'c48_na_back', ambientDuring: day48,
        text: 'Уте наливает тебе чаю и говорит шёпотом, чтобы Яннес не слышал: она боится Сильвестра больше, чем ночи оттепели. Тогда было неожиданно. А теперь все ждут. «Warten ist schlimmer». Ждать хуже.', effects: [set48('nc', 'ute'), until48(10, 0)] },
    ] }),

  X({ id: 'c48_na_back', title: 'Домой', camp: yard14, ambient: day48,
    text: [
      { text: 'Дорога домой полем, по своим утренним следам. Солнце низко, тени длинные. Над хутором дым столбом: мороз.' },
    ],
    actions: [
      { id: 'c48_nbk_tracks', label: 'Свернуть к лесополосе: посмотреть, нет ли свежих следов после субботы', minutes: 60, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48,
        text: 'Снег у лесополосы ровный, следов нет. Только заячьи, петлями. Дерево с обломанной веткой стоит, как стояло. После субботы лес тихий, как после уборки.', effects: [set48('nbk', 'tracks'), w48('wood_quiet', true), until48(12, 0)] },
      { id: 'c48_nbk_fast', label: 'Идти прямо, быстрым шагом', minutes: 40, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48, activity: 'moderate',
        text: 'Ты идёшь быстро, согреваешься на полпути. Дома тебя ждут, и ты это чувствуешь спиной, как тепло печки.', effects: [set48('nbk', 'fast'), until48(11, 40)] },
      { id: 'c48_nbk_wood', label: 'Набрать по дороге сухих веток на растопку', minutes: 60, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48,
        text: 'Сухие ветки ивы у канавы, вязанка через плечо. Растопки дома всегда не хватает, а в Сильвестр понадобится вдвое.', effects: [set48('nbk', 'wood'), until48(12, 0)] },
    ] }),
];
