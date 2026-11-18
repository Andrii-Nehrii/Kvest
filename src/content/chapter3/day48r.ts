import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { npc, tableOnly } from './point19';
import {
  A48, S48, bjornAlive48, day48, felix48, henrike48, letter48, merle48, parents48, partnerDown48, partnerUp48, set48, tue48, until48, w48,
} from './point48';

// Участок 48, спасение: партнёр выбыл в лесополосе в субботу (удар головой, кровь, холод) и с вечера лежит у Хенрике. Спасающий:
// тепло и сухое, повязка, доктор Зандер (швы, капельница), колонна уходит без вас (Мерле — с матерью или одна с Нильсом), Брандт
// про субботу и Бьёрна, перевязка, соседи, сумерки; к вечеру выбывший приходит в себя. Как в 41-й.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S48({ ...scene, for: 'any', chapter: 'ch3' });
const treat = (how: 'basic' | 'proper'): Effect => ({ treat: how, target: '@partner' });
const blood = (delta: number): Effect => ({ body: 'bloodLoss', delta, target: '@partner' });
const drink = (delta: number): Effect => ({ body: 'thirst', delta, target: '@partner' });
const drip: Effect = { if: partnerDown48, then: [blood(-25), drink(-40)] };
const merleGoes: Cond = all(merle48, flag('w.c44_hamburg_trip'));

export const day48RScenes: Scene[] = [
  X({ id: 'c48_r_bed', title: 'У постели', camp: tense14, safe: false, onEnter: [set48('rescuer', true)],
    text: [
      { text: '{partner} лежит на кровати Хенрике. Повязка на голове за ночь стала бурой. Лицо белое, губы сухие.' },
      { when: partnerDown48, text: 'Дышит ровно, но не просыпается, даже когда ты зовёшь по имени.' },
      { when: partnerUp48, text: 'Глаза открываются, когда ты зовёшь по имени, смотрят мимо тебя и закрываются снова. Слабость такая, что не поднять руки.' },
      { when: henrike48, text: 'Хенрике сидит на табуретке у изголовья с вечера, в той же кофте. Она встаёт, уступая место: «Du jetzt. Ich mach Wasser warm». Теперь ты. Я согрею воду.' },
    ],
    actions: [
      { id: 'c48_rb_wound', label: 'Снять старую повязку, промыть рану и перевязать заново', minutes: 45, terminal: true, goto: 'c48_r_doc',
        text: 'Бинт присох, ты отмачиваешь его тёплой водой, миллиметр за миллиметром. Рана над ухом длинная, края разошлись. Кипячёная вода, чистая марля, туго. Кровь проступает и останавливается.', effects: [set48('rb', 'wound'), treat('basic'), blood(-3), until48(7, 30)] },
      { id: 'c48_rb_warm', label: 'Укрыть потеплее, бутылки с тёплой водой к ногам и под мышки', minutes: 45, terminal: true, goto: 'c48_r_doc',
        text: 'Перина, два одеяла, бутылки в полотенцах. Руки холодные, как у того, кто долго был на улице. Через полчаса пальцы под твоей ладонью теплеют.', effects: [set48('rb', 'warm'), blood(-3), until48(7, 30)] },
      { id: 'c48_rb_water', label: 'Попробовать напоить: по ложке, по капле', minutes: 45, terminal: true, goto: 'c48_r_doc',
        text: 'Ложка тёплого сладкого чая к губам. Половина стекает по подбородку. Половина — нет. Горло двигается, глотает. Ты поишь полчаса, по ложке, и считаешь глотки.', effects: [set48('rb', 'water'), drink(-20), blood(-2), until48(7, 30)] },
    ] }),

  X({ id: 'c48_r_doc', title: 'Доктор Зандер', camp: tense14, safe: false,
    text: [
      { text: 'В восемь у ворот трактор Лукаса: он привёз доктора Зандер. Она объезжает дворы после субботы, одна на весь округ, с сумкой, которую носит, как ребёнка.' },
      { text: 'Она смотрит рану, зрачки, считает пульс, долго слушает грудь. «Gehirnerschütterung, Blutverlust, unterkühlt. {pm:Er|Sie} wird wach. Heute oder morgen». Сотрясение, кровопотеря, переохлаждение. Очнётся. Сегодня или завтра.' },
    ],
    actions: [
      { id: 'c48_rd_lamp', label: 'Держать лампу, пока она шьёт', minutes: 60, terminal: true, goto: 'c48_r_convoy',
        text: 'Ты держишь лампу. Зандер шьёт быстро, мелко. Девять швов. Потом капельница на гвозде над кроватью: последний пакет физраствора, который у неё есть. «Bis Mittag. Dann sehen wir». До полудня. Потом посмотрим.', effects: [set48('rd', 'lamp'), treat('proper'), drip, until48(9, 0)] },
      { id: 'c48_rd_ask', label: 'Спросить, что делать дальше и чего бояться', minutes: 60, terminal: true, goto: 'c48_r_convoy',
        text: '— Warm, nicht heiß. Trinken, wenn schluckt. Wenn erbricht oder die Pupillen ungleich werden — holen Sie mich. Sofort.\n\nТепло, не жарко. Поить, когда глотает. Если рвота или зрачки станут разными — зовите меня. Сразу. Она ставит капельницу и уходит к следующему двору.', effects: [set48('rd', 'ask'), treat('proper'), drip, w48('r_knows_signs', true), until48(9, 0)] },
      { id: 'c48_rd_out', label: 'Выйти на крыльцо: смотреть, как шьют, ты не можешь', minutes: 60, terminal: true, goto: 'c48_r_convoy', ambientDuring: day48,
        text: 'Ты стоишь на крыльце. Лукас стоит рядом, потом говорит: «Sie hat am Samstag fünf zusammengenäht. Alle leben». Она в субботу зашила пятерых. Все живы. Когда ты возвращаешься, капельница уже висит.', effects: [set48('rd', 'out'), treat('proper'), drip, until48(9, 0)] },
    ] }),

  X({ id: 'c48_r_convoy', title: 'Колонна', camp: kitchen14,
    text: [
      { when: all(merleGoes, parents48, A48), text: 'Колонна на Гамбург ушла в семь. Без вас. Мерле уехала с матерью: Биргит заняла место сопровождающего, которое было у {partner.gen}. Мерле обняла тебя в дверях и ничего не сказала.' },
      { when: all(merleGoes, parents48, not(A48)), text: 'Колонна на Гамбург ушла в семь. Без вас. Мерле уехала с матерью: Биргит заняла твоё место сопровождающей. Мерле обняла тебя в дверях и ничего не сказала.' },
      { when: all(merleGoes, not(parents48)), text: 'Колонна на Гамбург ушла в семь. Без вас. Мерле уехала одна: Нильс обещал присмотреть, пока доедут. Она обняла тебя в дверях и ничего не сказала.' },
      { when: not(merleGoes), text: 'Колонна на Гамбург ушла в семь от Винзена. Нильс проехал Йестебург в шесть: Лукас видел огни.' },
      { when: letter48, text: 'Письмо Тобиасу, написанное вдвоём, лежит на подоконнике. Лукас может отвезти его Вибке: следующая почта в Гамбург — через неделю.' },
    ],
    actions: [
      { id: 'c48_rc_letter', label: 'Отдать письмо Лукасу для Вибке', when: letter48, minutes: 30, terminal: true, goto: 'c48_r_house',
        text: 'Лукас прячет конверт за пазуху. «Mach ich». Сделаю. Он уходит, и ты думаешь, что Тобиас получит его недели через две, а может, и не получит. Но отправлено.', effects: [set48('rc', 'letter'), w48('letter_sent', true), blood(-2), until48(9, 45)] },
      { id: 'c48_rc_sit', label: 'Сесть у кровати и держать руку', minutes: 45, terminal: true, goto: 'c48_r_house',
        text: 'Рука тёплая, пальцы не отвечают. Ты держишь её, пока капает капельница. Капля, ещё капля. Ты считаешь до ста и начинаешь снова.', effects: [set48('rc', 'sit'), blood(-3), until48(9, 45)] },
      { id: 'c48_rc_kitchen', label: 'Поесть: Хенрике права, ты с вечера ничего не ел{m:|а}', minutes: 40, terminal: true, goto: 'c48_r_house', ...tableOnly,
        text: 'Каша, чай. Ты ешь, не чувствуя вкуса, и каждые две минуты смотришь на дверь комнаты.', effects: [set48('rc', 'kitchen'), meal('eat'), blood(-2), until48(9, 45)] },
    ] }),

  X({ id: 'c48_r_house', title: 'Дом', camp: kitchen14,
    text: [
      { text: 'Хутор живёт дальше: куры, вода, дрова. Кто-то должен, пока ты сидишь в комнате. Хенрике распределяет дела шёпотом.' },
      { when: felix48, text: 'Феликс берёт твою часть: дрова и воду. Ничего не говорит. Просто берёт.' },
    ],
    actions: [
      { id: 'c48_rh_chores', label: 'Быстро сделать своё по дому и вернуться', minutes: 60, terminal: true, goto: 'c48_r_brandt', activity: 'moderate',
        text: 'Вода, куры, дрова — бегом, через каждые десять минут заглядывая в окно комнаты. Всё сделано к одиннадцати. Ничего не изменилось. Это хорошо.', effects: [set48('rh', 'chores'), { body: 'fatigue', delta: 4 }, blood(-2), until48(11, 0)] },
      { id: 'c48_rh_stay', label: 'Не отходить: пусть другие', minutes: 60, terminal: true, goto: 'c48_r_brandt',
        text: 'Ты сидишь у кровати. Меняешь бутылки, поправляешь подушку, мочишь губы. Дом гремит вёдрами и дверьми без тебя. Он справляется.', effects: [set48('rh', 'stay'), blood(-3), until48(11, 0)] },
      { id: 'c48_rh_kids', label: 'Объяснить детям, почему в доме так тихо', minutes: 60, terminal: true, goto: 'c48_r_brandt',
        text: 'Младший спрашивает, умрёт ли. Ты говоришь: нет. Он смотрит на тебя внимательно, как взрослый, и кивает. Потом приносит к кровати свою деревянную лошадку: пусть охраняет.', effects: [set48('rh', 'kids'), blood(-2), until48(11, 0)] },
    ] }),

  X({ id: 'c48_r_brandt', title: 'Брандт', camp: yard14, ambient: day48,
    text: [
      { text: 'В половине двенадцатого у ворот джип. Брандт сам, без шапки. Смотрит на окно комнаты, потом на тебя.' },
      { text: '— Ich hab gesagt: keiner allein. Na ja. — Он трёт лицо. — Gut, dass ihr {pm:ihn|sie} rausgeholt habt.\n\nЯ говорил: никого одного. Ну что ж. Хорошо, что вытащили.' },
      { when: bjornAlive48, text: '— Und der Tiede-Junge sitzt allein auf dem Hof. Will nicht weg. Wenn ihr könnt — nehmt euch das vor. Nicht heute.\n\nА парень Тиде сидит один на дворе. Уходить не хочет. Если сможете — займитесь. Не сегодня.' },
      { when: not(bjornAlive48), text: '— Bei Tiedes haben wir gestern zugemacht. Beide.\n\nУ Тиде мы вчера закрыли. Обоих.' },
    ],
    actions: [
      { id: 'c48_rbr_thanks', label: 'Поблагодарить за тех, кто нёс', minutes: 40, terminal: true, goto: 'c48_r_noon', ambientDuring: day48,
        text: 'Брандт отмахивается. Называет имена: кто нёс, кто держал фонарь. Ты запоминаешь каждое. Он садится в джип и уезжает к следующему двору.', effects: [set48('rbr', 'thanks'), blood(-2), until48(12, 20)] },
      { id: 'c48_rbr_silvester', label: 'Сказать: в Сильвестр двор будет, как договаривались, но без меня', minutes: 40, terminal: true, goto: 'c48_r_noon', ambientDuring: day48,
        text: 'Брандт кивает. «Du bleibst hier. Das ist auch Wache». Ты останешься здесь. Это тоже стража. Первый раз за месяц он говорит с тобой, как с равным.', effects: [set48('rbr', 'silvester'), w48('r_stays_silvester', true), blood(-2), until48(12, 20)] },
      { id: 'c48_rbr_bjorn', label: 'Спросить, есть ли у Бьёрна хоть кто-то', when: bjornAlive48, minutes: 40, terminal: true, goto: 'c48_r_noon', ambientDuring: day48,
        text: 'Никого. Мать умерла давно, отец — в субботу. Шестнадцать лет, шесть кур и двор. Брандт смотрит в поле. «Ich hab auch einen in dem Alter. Der redet auch nicht». У меня тоже такой. Тоже не разговаривает.', effects: [set48('rbr', 'bjorn'), w48('r_heard_bjorn', true), blood(-2), until48(12, 20)] },
    ] }),

  X({ id: 'c48_r_noon', title: 'Полдень', camp: house14,
    text: [
      { text: 'Полдень. Капельница кончилась. Зандер сказала: если глотает — поить. Глотает.' },
      { when: partnerDown48, text: 'Веки дрогнули, когда ты {m:менял|меняла} бутылку. Или показалось.' },
      { when: partnerUp48, text: '{partner} открывает глаза на минуту, смотрит на тебя и снова засыпает. Сон уже не тот, что утром.' },
    ],
    actions: [
      { id: 'c48_rn_broth', label: 'Поить бульоном по ложке', minutes: 60, terminal: true, goto: 'c48_r_dressing',
        text: 'Бульон из курицы, которую сварили на Рождество. По ложке, медленно. Глотает. Ты не замечаешь, как {m:сам|сама} ешь из той же кастрюли, стоя.', effects: [set48('rn', 'broth'), drink(-20), blood(-3), { body: 'hunger', delta: -20 }, until48(13, 30)] },
      { id: 'c48_rn_talk', label: 'Говорить с {partner.ins}: Зандер сказала, слух возвращается первым', minutes: 60, terminal: true, goto: 'c48_r_dressing',
        text: 'Ты рассказываешь всё подряд: про колонну, про Брандта, про то, что дети ходят на цыпочках. Про то, что сказал бы, если бы мог ответить. На середине пальцы в твоей руке сжимаются. Слабо. Но сжимаются.', effects: [set48('rn', 'talk'), blood(-3), { body: 'hunger', delta: -15 }, until48(13, 30)] },
      { id: 'c48_rn_sleep', label: 'Подремать в кресле рядом: Хенрике посидит', when: henrike48, minutes: 60, terminal: true, goto: 'c48_r_dressing',
        text: 'Ты засыпаешь в кресле сразу, как будто выключили. Просыпаешься от того, что Хенрике трогает тебя за плечо: «Er hat gehustet. Gut so». Кашлянул. Это хорошо.', effects: [set48('rn', 'sleep'), { body: 'fatigue', delta: -10 }, blood(-2), { body: 'hunger', delta: -15 }, until48(13, 30)] },
    ] }),

  X({ id: 'c48_r_dressing', title: 'Перевязка', camp: house14,
    text: [
      { text: 'Повязку пора менять. Швы Зандер держат, края сходятся. Вокруг — синяк на полголовы, жёлтый по краям.' },
    ],
    actions: [
      { id: 'c48_rdr_careful', label: 'Сменить повязку, как показала Зандер', minutes: 45, terminal: true, goto: 'c48_r_visit',
        text: 'Старую — долой, швы протереть, чистую — туго, но не давя. Руки уже знают, что делать. Ты заканчиваешь и только тогда замечаешь, что не {m:дышал|дышала}.', effects: [set48('rdr', 'careful'), treat('basic'), blood(-2), until48(14, 30)] },
      { id: 'c48_rdr_check', label: 'Проверить зрачки фонарём, как она учила', minutes: 45, terminal: true, goto: 'c48_r_visit',
        text: 'Ты приподнимаешь веко, светишь. Зрачок сужается. Другой — тоже. Одинаково. Ты выдыхаешь так, что фонарь дрожит.', effects: [set48('rdr', 'check'), w48('r_pupils', true), blood(-2), until48(14, 30)] },
      { id: 'c48_rdr_wash', label: 'Обтереть лицо и руки тёплой водой', minutes: 45, terminal: true, goto: 'c48_r_visit',
        text: 'Тёплая вода, мягкая тряпка. Лицо, шея, руки, каждый палец. Грязь из лесополосы ещё под ногтями. Ты вычищаешь её, как будто так можно стереть субботу.', effects: [set48('rdr', 'wash'), blood(-2), until48(14, 30)] },
    ] }),

  X({ id: 'c48_r_visit', title: 'Гости', camp: kitchen14,
    text: [
      { text: 'Около трёх — стук в дверь. Яннес и Уте: Уте с банкой бульона, Яннес хромает сзади и стоит в дверях, не решаясь войти.' },
    ],
    actions: [
      { id: 'c48_rv_in', label: 'Позвать их в комнату', minutes: 45, terminal: true, goto: 'c48_r_dusk',
        text: 'Уте садится на край кровати и гладит одеяло. Яннес стоит у стены. Потом говорит, глядя в пол: «Ich war am Samstag zehn Meter weg. Zehn Meter». Я в субботу был в десяти метрах. В десяти. Ты говоришь, что знаешь. Он кивает.', effects: [set48('rv', 'in'), npc('c14_jannes', 1), blood(-2), until48(15, 45)] },
      { id: 'c48_rv_kitchen', label: 'Посидеть с ними на кухне за чаем', minutes: 45, terminal: true, goto: 'c48_r_dusk', ...tableOnly,
        text: 'Чай, сухари. Уте рассказывает про колонию, Яннес молчит. В конце он говорит: «Silvester steh ich am Wald. Für euch mit». В Сильвестр я стою у леса. И за вас. Это обещание.', effects: [set48('rv', 'kitchen'), w48('jannes_for_us', true), meal('eat'), blood(-2), until48(15, 45)] },
      { id: 'c48_rv_thank', label: 'Поблагодарить и сказать, что сейчас лучше не тревожить', minutes: 30, terminal: true, goto: 'c48_r_dusk',
        text: 'Уте понимает сразу и отдаёт банку. Яннес хочет что-то сказать, но Уте берёт его под руку. В дверях он всё-таки оборачивается: «Wenn was ist — die Glocke». Если что — колокол.', effects: [set48('rv', 'thank'), blood(-2), until48(15, 30)] },
    ] }),

  X({ id: 'c48_r_dusk', title: 'Сумерки', camp: house14,
    text: [
      { text: 'Сумерки. В комнате темнеет раньше, чем во дворе. Ты зажигаешь свечу на подоконнике.' },
      { when: merle48, text: 'Из кухни слышно, как Биргит или кто-то ещё моет посуду. Дом говорит шёпотом весь день.' },
    ],
    actions: [
      { id: 'c48_rk_candle', label: 'Сидеть со свечой и ждать', minutes: 60, terminal: true, goto: 'c48_r_supper',
        text: 'Свеча, дыхание, капли с крыши: оттепель на час. Ты сидишь и ждёшь. Не знаешь, чего именно. Что-то должно случиться, и ты не хочешь пропустить.', effects: [set48('rk', 'candle'), blood(-3), until48(17, 30)] },
      { id: 'c48_rk_read', label: 'Читать вслух что-нибудь из книг Хенрике', minutes: 60, terminal: true, goto: 'c48_r_supper',
        text: 'Старая книжка с полки: немецкие сказки, готический шрифт. Ты читаешь медленно, спотыкаясь. На «Бременских музыкантах» уголок рта у {partner.gen} дёргается. Или тебе хочется так думать.', effects: [set48('rk', 'read'), blood(-3), until48(17, 30)] },
      { id: 'c48_rk_bell', label: 'Сходить на пост у Зеве сказать, что ночью смену возьмёт кто-то другой', minutes: 45, terminal: true, goto: 'c48_r_supper', ambientDuring: day48,
        text: 'На посту сосед. Он кивает раньше, чем ты договариваешь: знает. «Geh rein. Ich bleib bis Mitternacht». Иди в дом. Я до полуночи. Ты бежишь обратно.', effects: [set48('rk', 'bell'), blood(-2), until48(17, 15)] },
    ] }),

  X({ id: 'c48_r_supper', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Ужин. Хенрике ставит тарелку и не уходит, пока ты не начинаешь есть.' },
    ],
    actions: [
      { id: 'c48_rs_eat', label: 'Поесть за столом со всеми', minutes: 40, terminal: true, goto: 'c48_r_wake', ...tableOnly,
        text: 'Суп, хлеб. Ты ешь, и тебе кладут ещё. Никто не спрашивает, как там. Все знают: как было.', effects: [set48('rs', 'eat'), meal('eat'), blood(-2), until48(18, 30)] },
      { id: 'c48_rs_tray', label: 'Взять тарелку с собой в комнату', minutes: 40, terminal: true, goto: 'c48_r_wake',
        text: 'Ты ешь у кровати, держа тарелку на коленях. Свеча на подоконнике догорает. Ты ставишь новую.', effects: [set48('rs', 'tray'), { body: 'hunger', delta: -25 }, blood(-2), until48(18, 30)] },
    ] }),

  X({ id: 'c48_r_wake', title: 'Разговор', camp: house14,
    text: [
      { when: partnerUp48, text: 'В семь {partner} открывает глаза. Смотрит на потолок, на свечу, на тебя. Долго. Потом спрашивает хрипло, какой сегодня день.' },
      { when: partnerDown48, text: '{partner} дышит глубже и ровнее, чем утром. Веки вздрагивают. Ещё немного.' },
    ],
    actions: [
      { id: 'c48_rw_tell', label: 'Рассказать: суббота, лесополоса, кто нёс', minutes: 45, terminal: true, goto: 'c48_t_dawn',
        text: 'Ты рассказываешь тихо. Тебя слушают с закрытыми глазами. На середине ты замечаешь, что тебя держат за руку. Крепче, чем утром.', effects: [set48('rw', 'tell'), blood(-3), tue48(7, 0, true)] },
      { id: 'c48_rw_date', label: 'Сказать только: понедельник, двадцать восьмое, всё хорошо', minutes: 30, terminal: true, goto: 'c48_t_dawn',
        text: '«Понедельник. Двадцать восьмое. Всё хорошо». Глаза закрываются. Но рука в твоей руке остаётся тёплой и сжимается в ответ.', effects: [set48('rw', 'date'), blood(-3), tue48(7, 0, true)] },
      { id: 'c48_rw_hand', label: 'Ничего не говорить, просто держать руку', minutes: 30, terminal: true, goto: 'c48_t_dawn',
        text: 'Ты берёшь руку. Пальцы сжимаются в ответ, слабо, но сжимаются. Вопросы подождут до утра.', effects: [set48('rw', 'hand'), blood(-3), tue48(7, 0, true)] },
    ] }),
  X({ id: 'c48_rt_bed', title: 'Утро вторника', camp: house14,
    text: [
      { when: partnerUp48, text: '{partner} сидит в кровати, опершись на подушки, и пытается заплести себе бинт поудобнее. Видит тебя и говорит первым: «Сколько я спал{pm:|а}?» Голос хриплый, но свой.' },
      { when: partnerDown48, text: '{partner} всё ещё спит, но иначе: глубоко, ровно, переворачиваясь на бок. Зандер сказала: такой сон лечит.' },
      { text: 'Повязка сухая. Синяк сполз на висок и стал жёлто-лиловым.' },
    ],
    actions: [
      { id: 'c48_rtb_tell', label: 'Рассказать, что пропущено: колонна, Брандт, Сильвестр', minutes: 75, terminal: true, goto: 'c48_t_stranger',
        text: 'Ты рассказываешь по порядку. {partner} слушает, иногда закрывая глаза, и задаёт один вопрос: «А кто нёс?» Ты называешь имена. {partner} повторяет их шёпотом, как будто запоминает для чего-то.', effects: [set48('rtb', 'tell'), blood(-3), tue48(10, 45)] },
      { id: 'c48_rtb_walk', label: 'Помочь дойти до окна: Зандер разрешила вставать', minutes: 75, terminal: true, goto: 'c48_t_stranger',
        text: 'Три шага до окна, держась за тебя. Голова кружится, ноги ватные. У окна {partner} стоит минуту и смотрит на снег. «Белое». Потом обратно. Три шага — как километр.', effects: [set48('rtb', 'walk'), blood(-3), tue48(10, 45)] },
      { id: 'c48_rtb_dressing', label: 'Сменить повязку и проверить зрачки', minutes: 75, terminal: true, goto: 'c48_t_stranger',
        text: 'Швы держат, края розовые, без гноя. Зрачки одинаковые. Ты говоришь это вслух, как Зандер, и {partner} улыбается углом рта: «Ты теперь доктор».', effects: [set48('rtb', 'dressing'), treat('basic'), blood(-2), tue48(10, 45)] },
    ] }),
];
