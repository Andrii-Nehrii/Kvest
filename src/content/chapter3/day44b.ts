import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { ninaFarm } from './point18';
import { npc } from './point19';
import {
  S44, convoy44, hansenDead44, henrike44, job44, julian44, merle44, mon44, set44, tue44, until44, w44,
} from './point44';

// Участок 44, линия B. Понедельник: утро (Юлиан, Мерле или Хенрике), дорога и совет — общие; после обеда — что решил A за неё
// (Гамбург для Мерле / работа в Винзене) и как это принимает Мерле или дом, понедельники Хенрике (Бары, бабушка Юлиана), сумерки.
// Вторник: ответ Красному Кресту, выпечка, подарки, Уте и нога Яннеса, фрау Ханзен, вечер.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S44({ ...scene, for: 'any', chapter: 'ch3' });
const mondays = flag('w.c42_mondays');
const merleGoes = all(merle44, convoy44('go'));

export const day44BScenes: Scene[] = [
  // ═════════════ Понедельник ═════════════
  X({ id: 'c44_b_morning', title: 'До совета', camp: kitchen14,
    text: [
      { when: julian44, text: 'Юлиан в курятнике, потом у колодца, потом у поленницы. Он пришёл, как обещал, ровно в семь. Ты {m:обещал|обещала} ему работу. Теперь надо её найти.' },
      { when: all(not(julian44), merle44), text: 'Мерле считает единицы над флаконом. Вторые сутки на ветеринарном. Цифры ровные.' },
      { when: all(not(julian44), not(merle44)), text: 'Хенрике гладит скатерть к сочельнику, хотя до него три дня. «Später hab ich keine Zeit». Потом времени не будет.' },
    ],
    actions: [
      { id: 'c44_bm_julian', label: 'Дать Юлиану дело и посмотреть, как справляется', when: julian44, minutes: 75, terminal: true, goto: 'c44_road',
        text: 'Вода, дрова, куры, снег с крыльца. Юлиан делает всё быстро и спрашивает: «Und jetzt?» А теперь? Хенрике смотрит на него и говорит тебе тихо: «Den behalten wir». Этого оставим.', effects: [set44('bm', 'julian'), w44('julian_ok', true), until44(51, 8, 45)] },
      { id: 'c44_bm_grandma', label: 'Спросить Юлиана про бабушку', when: julian44, minutes: 60, terminal: true, goto: 'c44_road',
        text: 'Бабушке восемьдесят два. Слуховой аппарат молчит с ноября: батареек нет. Она не слышит, когда он уходит, и не слышит, когда приходит. Поэтому он стучит ей по плечу, два раза.', effects: [set44('bm', 'grandma'), until44(51, 8, 30)] },
      { id: 'c44_bm_merle', label: 'Проверить с Мерле дозу на сегодня', when: merle44, minutes: 60, terminal: true, goto: 'c44_road',
        text: 'Деления на шприце, единицы, время. Мерле говорит цифры, ты проверяешь. Всё сходится. «Siehst du», — говорит она. Видишь. Ты видишь.', effects: [set44('bm', 'merle'), until44(51, 8, 30)] },
      { id: 'c44_bm_cloth', label: 'Помочь Хенрике со скатертью', minutes: 60, terminal: true, goto: 'c44_road',
        text: 'Утюг на плите, мокрая тряпка, пар. Скатерть с вышивкой по краю: шила мать Хенрике. Хенрике рассказывает, кто за этой скатертью сидел в каком году.', effects: [set44('bm', 'cloth'), npc('henrike', 1), until44(51, 8, 30)] },
      { id: 'c44_bm_snow', label: 'Расчистить крыльцо и тропу к калитке', minutes: 60, terminal: true, goto: 'c44_road', ambientDuring: mon44,
        text: 'Лопата, снег, мороз. Тропа до калитки и обратно. Когда возвращаешься, щёки горят, а в голове пусто и ясно.', effects: [set44('bm', 'snow'), until44(51, 8, 30)] },
    ] }),

  X({ id: 'c44_b_merle', title: 'Что решено', camp: kitchen14,
    text: [
      { when: merleGoes, text: 'Ты рассказываешь Мерле, что решил{pm:|а} {partner}: если она поедет в Гамбург, ты едешь с ней. На неделю, если мост будет открыт. Мерле молчит долго.' },
      { when: all(merle44, convoy44('merle')), text: 'Ты рассказываешь Мерле, что решил{pm:|а} {partner}: если она поедет в Гамбург, то без тебя. Мерле смеётся, коротко: «Dann fahr ich nicht. Hab ich doch gesagt». Тогда не поеду. Я же говорила.' },
      { when: all(merle44, convoy44('none')), text: 'Ты рассказываешь Мерле, что решил{pm:|а} {partner}: в Гамбург не едет никто. Мерле кивает с облегчением и сразу отворачивается, чтобы ты не видел{m:|а} лица.' },
      { when: all(not(merle44), job44('yes')), text: '{partner} решил{pm:|а}: с января ты работаешь в Винзене, с понедельника по четверг. Хенрике слышит и ставит на стол лишнюю тарелку, хотя до января ещё неделя.' },
      { when: all(not(merle44), job44('part')), text: '{partner} решил{pm:|а}: два дня в неделю, без ночёвки. Если Красный Крест согласится.' },
      { when: all(not(merle44), job44('no')), text: '{partner} решил{pm:|а}: нет. Ты остаёшься на хуторе. Листок из Винзена лежит на подоконнике.' },
    ],
    actions: [
      { id: 'c44_bme_hamburg', label: 'Сказать Мерле: я поеду с тобой, если решишься', when: merleGoes, minutes: 60, terminal: true, goto: 'c44_b_mondays',
        text: 'Мерле смотрит на тебя, потом на флакон. «Eine Woche. Und du kommst zurück». Неделя. И ты возвращаешься. Это не вопрос и не согласие. Она обещает ответить до сочельника.', effects: [set44('bme', 'hamburg'), w44('merle_thinks', true), npc('merle', 2), until44(51, 14, 15)] },
      { id: 'c44_bme_stay', label: 'Сказать Мерле: решай сама, я поддержу любое', when: merle44, minutes: 60, terminal: true, goto: 'c44_b_mondays',
        text: 'Мерле кивает. Потом говорит: «Ich bleibe. Fünf Fläschchen, und dann sehen wir». Остаюсь. Пять флаконов, а там посмотрим. Ты не споришь. Ты записываешь, когда кончится пятый.', effects: [set44('bme', 'stay'), w44('merle_stays', true), until44(51, 14, 15)] },
      { id: 'c44_bme_angry', label: 'Сказать, что решать это было не {pm:ему|ей} одн{pm:ому|ой}', when: merle44, minutes: 60, terminal: true, goto: 'c44_b_mondays',
        text: 'Мерле пожимает плечами. «Du hast {pm:für ihn|für sie} auch entschieden. Am Montag. Ich hab’s gehört». Ты за {pm:него|неё} тоже {m:решал|решала}. В понедельник. Я слышала. Ты не находишь, что ответить.', effects: [set44('bme', 'angry'), until44(51, 14, 15)] },
      { id: 'c44_bme_job', label: 'Принять решение и написать ответ в Винзен', when: not(merle44), minutes: 60, terminal: true, goto: 'c44_b_mondays',
        text: 'Ты пишешь коротко, как есть. Ответ отвезёт Нильс завтра. Хенрике читает через плечо и молча кладёт тебе руку на спину.', effects: [set44('bme', 'job'), w44('job_answered', true), until44(51, 14, 15)] },
      { id: 'c44_bme_talk', label: 'Поговорить с Хенрике: что она думает', when: all(not(merle44), henrike44), minutes: 60, terminal: true, goto: 'c44_b_mondays',
        text: 'Хенрике говорит: мука — это зима для всех. А ты — это ты. «{pm:Er|Sie} hat entschieden. Jetzt lebt damit». {pm:Он решил|Она решила}. Теперь живите с этим.', effects: [set44('bme', 'talk'), until44(51, 14, 15)] },
      { id: 'c44_bme_porch', label: 'Выйти на крыльцо и постоять на морозе, чтобы остыть', minutes: 60, terminal: true, goto: 'c44_b_mondays', ambientDuring: mon44,
        text: 'Мороз хватает за щёки. Ты стоишь, пока мысли не становятся короче. Решение уже есть. Теперь с ним надо жить.', effects: [set44('bme', 'porch'), until44(51, 14, 15)] },
    ] }),

  X({ id: 'c44_b_mondays', title: 'Понедельник Хенрике', camp: yard14, ambient: mon44,
    text: [
      { when: mondays, text: 'Понедельник. Ты {m:обещал|обещала}, что по понедельникам кто-то будет приходить к тем, кого кормила Хенрике. Хенрике уже наливает суп в бидон.' },
      { when: not(mondays), text: 'После обеда Хенрике кладёт перед тобой свою тетрадь понедельников. «Heute ist Montag». Сегодня понедельник. Больше ничего не говорит.' },
    ],
    actions: [
      { id: 'c44_bmo_bahr', label: 'Отнести суп Барам у Люллау', minutes: 90, activity: 'moderate', terminal: true, goto: 'c44_b_dusk', ambientDuring: mon44,
        text: 'Два километра по снегу с бидоном. Коринна открывает сразу. Эрик и Миа бегут к двери. Суп горячий, бидон пустеет за десять минут. Коринна говорит: «Montags. Wie früher». По понедельникам. Как раньше.', effects: [set44('bmo', 'bahr'), { set: '$.met.c42_bahr', value: true }, w44('bahr_soup', true), until44(51, 15, 45)] },
      { id: 'c44_bmo_julian', label: 'Отнести суп бабушке Юлиана у переезда', minutes: 90, activity: 'moderate', terminal: true, goto: 'c44_b_dusk', ambientDuring: mon44,
        text: 'Будка обходчика, печь, бабушка в платке. Она не слышит, как ты входишь, и вздрагивает. Потом узнаёт бидон и плачет. Ты кормишь её с ложки, потому что руки у неё дрожат.', effects: [set44('bmo', 'julian'), w44('julian_soup', true), until44(51, 15, 45)] },
      { id: 'c44_bmo_koehler', label: 'Сходить к Кёлер в пункт: она тоже в тетради', minutes: 75, terminal: true, goto: 'c44_b_dusk', ambientDuring: mon44,
        text: 'Кёлер в пункте за столом, как всегда. Супу она удивляется и смеётся: «Ich bin doch die, die kocht!» Это же я та, кто варит! Но ест. Потом пишет в тетради Хенрике своё имя второй раз, с сегодняшней датой.', effects: [set44('bmo', 'koehler'), until44(51, 15, 30)] },
      { id: 'c44_bmo_rest', label: 'Сказать Хенрике: сегодня не успею, завтра', minutes: 30, terminal: true, goto: 'c44_b_dusk',
        text: 'Хенрике кивает и уносит бидон сама. Ты смотришь ей вслед, как она идёт по снегу с бидоном в здоровой руке.', effects: [set44('bmo', 'rest'), until44(51, 14, 45)] },
    ] }),

  X({ id: 'c44_b_dusk', title: 'Сумерки', camp: kitchen14,
    text: [
      { when: merle44, text: 'Сумерки. Мерле сидит у печи и рисует. На рисунке колонна грузовиков на мосту. Один грузовик едет в другую сторону.' },
      { when: all(not(merle44), ninaFarm), text: 'Сумерки. Нина собирает рюкзак к школе, хотя до четвёртого января две недели. Складывает и раскладывает.' },
      { when: all(not(merle44), not(ninaFarm)), text: 'Сумерки. В кухне пахнет супом и мокрой шерстью. Хенрике зажигает лампу.' },
    ],
    actions: [
      { id: 'c44_bd_draw', label: 'Спросить Мерле про рисунок', when: merle44, minutes: 45, terminal: true, goto: 'c44_mon_eve',
        text: '— Der hier kommt zurück. — Она показывает на грузовик, который едет не туда. — Ich weiß nur nicht, wer drin sitzt.\n\nЭтот возвращается. Я только не знаю, кто в нём сидит.', effects: [set44('bd', 'draw'), until44(51, 17, 0)] },
      { id: 'c44_bd_nina', label: 'Помочь Нине собрать рюкзак по списку', when: all(not(merle44), ninaFarm), minutes: 45, terminal: true, goto: 'c44_mon_eve',
        text: 'Тетради, карандаши, носки, мыло, фотография, которую она прячет на дно. Ты пишешь список на обороте её тетради. Нина вычёркивает каждую строчку с удовольствием.', effects: [set44('bd', 'nina'), npc('c7_nina', 1), until44(51, 17, 0)] },
      { id: 'c44_bd_lamp', label: 'Почистить лампы на сочельник', minutes: 45, terminal: true, goto: 'c44_mon_eve',
        text: 'Стёкла в мыльной воде, фитили ровно. Четыре лампы на подоконнике сияют, как новые. Керосина хватит на два вечера, если не жечь все сразу.', effects: [set44('bd', 'lamp'), until44(51, 17, 0)] },
      { id: 'c44_bd_rest', label: 'Посидеть у печи: день был длинный', minutes: 30, terminal: true, goto: 'c44_mon_eve',
        text: 'Печь, кружка, тишина. Ты закрываешь глаза и слышишь, как за окном скрипит снег под чьими-то шагами. Потом тишина.', effects: [set44('bd', 'rest'), { body: 'fatigue', delta: -4 }, until44(51, 16, 45)] },
    ] }),

  // ═════════════ Вторник ═════════════
  X({ id: 'c44_b_answer', title: 'Ответ', camp: kitchen14,
    text: [
      { when: merleGoes, text: 'Утром Мерле спускается одетая и кладёт на стол листок из Красного Креста. Подписанный. «Achtundzwanzigster. Und du kommst mit». Двадцать восьмое. И ты едешь со мной.' },
      { when: all(merle44, not(convoy44('go'))), text: 'Утром Мерле рвёт листок из Красного Креста пополам и бросает в печь. «Fertig». Всё. Потом садится есть, как ни в чём не бывало.' },
      { when: not(merle44), text: 'Утром Нильс должен заехать за ответами для Винзена. Листок лежит на подоконнике, придавленный кружкой.' },
    ],
    actions: [
      { id: 'c44_ba_yes', label: 'Обнять Мерле и начать собирать вещи на неделю', when: merleGoes, minutes: 75, terminal: true, goto: 'c44_b_bake',
        text: 'Рюкзак, тёплые вещи, аптечка, флаконы Мерле в вате. Неделя в Гамбурге, если мост откроют. Ты складываешь и думаешь, как скажешь это {partner.dat}. Хотя {pm:он|она} и так знает: {pm:он|она} это и решил{pm:|а}.', effects: [set44('ba', 'yes'), w44('hamburg_trip', true), until44(52, 9, 0)] },
      { id: 'c44_ba_wait', label: 'Сказать Мерле: подумай ещё до сочельника', when: merleGoes, minutes: 60, terminal: true, goto: 'c44_b_bake',
        text: 'Мерле качает головой. «Ich hab nachgedacht. Seit Mittwoch». Я подумала. С середы. Листок она отдаёт тебе: отвезёшь Нильсу {m:сам|сама}.', effects: [set44('ba', 'wait'), w44('hamburg_trip', true), until44(52, 8, 45)] },
      { id: 'c44_ba_fire', label: 'Не спорить и сесть завтракать с ней', when: all(merle44, not(convoy44('go'))), minutes: 60, terminal: true, goto: 'c44_b_bake',
        text: 'Вы едите кашу молча. Потом Мерле говорит: «Fünf Fläschchen. Dann suche ich weiter. Mit dir». Пять флаконов. Потом буду искать дальше. С тобой.', effects: [set44('ba', 'fire'), w44('merle_stays', true), until44(52, 8, 45)] },
      { id: 'c44_ba_note', label: 'Разложить флаконы и шприцы по дням', when: all(merle44, not(convoy44('go'))), minutes: 60, terminal: true, goto: 'c44_b_bake',
        text: 'Ты чертишь на обороте календаря клетки и раскладываешь флаконы и шприцы по неделям. Мерле смотрит через плечо и говорит: «Bis dahin ist was anderes da». До тех пор что-нибудь найдётся.', effects: [set44('ba', 'note'), until44(52, 8, 45)] },
      { id: 'c44_ba_nils', label: 'Отдать ответ Нильсу у ворот', when: not(merle44), minutes: 60, terminal: true, goto: 'c44_b_bake', ambientDuring: tue44,
        text: 'Нильс берёт листок, не читая, и кладёт в папку. «Gut. Die in Winsen warten auf Sie». Хорошо. В Винзене вас ждут. Или не ждут: это теперь написано в листке.', effects: [set44('ba', 'nils'), { set: '$.met.c44_nils', value: true }, until44(52, 8, 45)] },
      { id: 'c44_ba_keep', label: 'Оставить листок ещё на день', when: not(merle44), minutes: 45, terminal: true, goto: 'c44_b_bake',
        text: 'Ты кладёшь листок обратно под кружку. До двадцать четвёртого время есть. Хотя решение уже принято, и не тобой.', effects: [set44('ba', 'keep'), until44(52, 8, 30)] },
      { id: 'c44_ba_window', label: 'Постоять у окна с листком и ничего не решать до обеда', minutes: 45, terminal: true, goto: 'c44_b_bake',
        text: 'Листок в руке, снег за окном. Ты стоишь, пока Хенрике не зовёт месить тесто. Листок ты кладёшь в карман фартука.', effects: [set44('ba', 'window'), until44(52, 8, 30)] },
    ] }),

  X({ id: 'c44_b_bake', title: 'Штоллен', camp: kitchen14,
    text: [
      { text: 'Хенрике достаёт из сундука жестяную форму для штоллена. Изюм — горсть, орехов — горсть, масла почти нет. «Ein kleiner Stollen. Aber ein Stollen». Маленький штоллен. Но штоллен.' },
    ],
    actions: [
      { id: 'c44_bb_knead', label: 'Месить тесто с Хенрике', minutes: 90, terminal: true, goto: 'c44_b_gifts',
        text: 'Тесто тугое, руки устают. Хенрике рассказывает, как её бабушка пекла штоллен за три недели до Рождества, чтобы «созрел». «Unserer reift zwei Tage. Muss reichen». Наш созреет два дня. Хватит.', effects: [set44('bb', 'knead'), npc('henrike', 1), until44(52, 10, 30)] },
      { id: 'c44_bb_kids', label: 'Позвать детей перебирать изюм', minutes: 90, terminal: true, goto: 'c44_b_gifts',
        text: 'Изюм — в миску, камешки — в другую. Половина изюма исчезает по дороге. Хенрике делает вид, что не видит, и досыпает из своей заначки.', effects: [set44('bb', 'kids'), until44(52, 10, 30)] },
      { id: 'c44_bb_cookies', label: 'Испечь ещё противень печенья для гостей', minutes: 75, terminal: true, goto: 'c44_b_gifts',
        text: 'Звёзды, сердца, ёлки. Последний сахар — на глазурь. Банка снова полная.', effects: [set44('bb', 'cookies'), until44(52, 10, 15)] },
    ] }),

  X({ id: 'c44_b_gifts', title: 'Подарки', camp: kitchen14,
    text: [
      { when: flag('w.c42_b_gift'), text: 'Подарок для {partner.gen} почти готов. Осталось чуть-чуть, и спрятать.' },
      { when: not(flag('w.c42_b_gift')), text: 'До сочельника два дня. Подарка для {partner.gen} у тебя пока нет.' },
      { text: 'Детям тоже нужно что-то положить под ёлку. Хотя бы по мелочи.' },
    ],
    actions: [
      { id: 'c44_bg_finish', label: 'Закончить подарок для {partner.gen}', minutes: 75, terminal: true, goto: 'c44_tue_lunch',
        text: 'Последний час работы. Ты заворачиваешь подарок в газету, перевязываешь бечёвкой и прячешь там, где {partner} не найдёт.', effects: [set44('bg', 'finish'), w44('b_gift_done', true), until44(52, 11, 45)] },
      { id: 'c44_bg_kids', label: 'Сшить детям мешочки из лоскутов и насыпать орехов', minutes: 75, terminal: true, goto: 'c44_tue_lunch',
        text: 'Лоскуты из сундука, нитки, по горсти орехов и по яблоку. Мешочки получаются кривые и разные. Ты подписываешь каждый.', effects: [set44('bg', 'kids'), w44('kids_gifts', true), until44(52, 11, 45)] },
      { id: 'c44_bg_henrike', label: 'Связать Хенрике варежку на больную руку', minutes: 75, terminal: true, goto: 'c44_tue_lunch',
        text: 'Одна варежка, широкая, чтобы влезла рука с лубком или без. Шерсть серая, узор простой. Ты прячешь её в ящик с ложками: там Хенрике ищет каждое утро.', effects: [set44('bg', 'henrike'), npc('henrike', 1), until44(52, 11, 45)] },
    ] }),

  X({ id: 'c44_b_ute', title: 'Колония', camp: yard14, ambient: tue44,
    text: [
      { text: 'После обеда ты идёшь в колонию с аптечкой. У Яннеса нога, о которой он молчит.' },
      { text: 'Яннес сидит у печи в домике Уте, нога на табурете. Под штаниной повязка, грязная, недельная. Он не хочет, чтобы ты {m:смотрел|смотрела}. Уте хочет.' },
    ],
    actions: [
      { id: 'c44_bu_wound', label: 'Снять повязку и посмотреть рану', minutes: 75, terminal: true, goto: 'c44_b_hansen', ambientDuring: tue44,
        text: 'Рваная рана на голени, не укус: зацепился за ржавую сетку, когда бежал. Края красные, но гноя нет. Ты промываешь, мажешь, бинтуешь заново. Яннес смотрит в потолок. «Danke», — говорит он потолку.', effects: [set44('bu', 'wound'), w44('jannes_leg', 'treated'), npc('c14_jannes', 2), until44(52, 14, 45)] },
      { id: 'c44_bu_invite', label: 'Позвать их обоих на сочельник', minutes: 60, terminal: true, goto: 'c44_b_hansen', ambientDuring: tue44,
        text: 'Уте смотрит на Яннеса. Яннес смотрит в окно. «Wenn Frau Hansen kommt, komme ich nicht». Если придёт фрау Ханзен, я не приду. Уте говорит: «Dann reden wir mit ihr». Тогда поговорим с ней.', effects: [set44('bu', 'invite'), w44('ute_invited', true), until44(52, 14, 30)] },
      { id: 'c44_bu_leave', label: 'Оставить мазь и бинты и не настаивать', minutes: 45, terminal: true, goto: 'c44_b_hansen', ambientDuring: tue44,
        text: 'Ты кладёшь на стол мазь и два бинта и объясняешь Уте, как менять. Яннес молчит. У двери Уте шепчет: «Er lässt mich das machen. Dich nicht». Мне он даст. Тебе нет.', effects: [set44('bu', 'leave'), until44(52, 14, 15)] },
    ] }),

  X({ id: 'c44_b_hansen', title: 'Фрау Ханзен', camp: yard14, ambient: tue44,
    text: [
      { when: hansenDead44, text: 'По дороге назад ты заходишь к фрау Ханзен. На столе у неё фотография мужа в чёрной рамке и пустая чашка напротив.' },
      { when: not(hansenDead44), text: 'По дороге назад ты заходишь к Ханзенам. Старик дремлет, фрау Ханзен штопает у окна.' },
      { text: '— Der Junge aus der Kolonie. — Она не поднимает глаз. — Er hat Ute gerettet. Ich weiß. Und trotzdem.\n\nЭтот парень из колонии. Он спас Уте. Я знаю. И всё равно.' },
    ],
    actions: [
      { id: 'c44_bh_bring', label: 'Предложить: он придёт к вам сам и скажет, что хотел', minutes: 60, terminal: true, goto: 'c44_b_dusk2', ambientDuring: tue44,
        text: 'Фрау Ханзен долго молчит. Потом кивает. «Nach Weihnachten. Nicht vorher». После Рождества. Не раньше. Это больше, чем ты ожидал{m:|а}.', effects: [set44('bh', 'bring'), w44('hansen_talk', true), until44(52, 16, 0)] },
      { id: 'c44_bh_sit', label: 'Посидеть с ней молча', minutes: 60, terminal: true, goto: 'c44_b_dusk2', ambientDuring: tue44,
        text: 'Ты сидишь, она штопает. Часы тикают. Через час она говорит: «Danke, dass du nichts sagst». Спасибо, что ничего не говоришь. И наливает тебе чаю.', effects: [set44('bh', 'sit'), until44(52, 16, 0)] },
      { id: 'c44_bh_invite', label: 'Позвать её на сочельник: Яннеса за столом не будет', minutes: 60, terminal: true, goto: 'c44_b_dusk2', ambientDuring: tue44,
        text: 'Фрау Ханзен кивает. «Dann komme ich». Тогда приду. Потом добавляет: «Und sag Ute, sie soll trotzdem kommen». И скажи Уте, пусть всё равно приходит.', effects: [set44('bh', 'invite'), w44('hansen_invited44', true), until44(52, 16, 0)] },
    ] }),

  X({ id: 'c44_b_dusk2', title: 'Сумерки во вторник', camp: kitchen14,
    text: [
      { text: 'Сумерки. Штоллен остывает на подоконнике под полотенцем. В кухне тесно от лавок и стульев.' },
      { when: flag('w.c44_hamburg_trip'), text: 'Рюкзак на неделю стоит у двери. Ты стараешься на него не смотреть.' },
    ],
    actions: [
      { id: 'c44_bd2_table', label: 'Прикинуть с Хенрике, как всех рассадить в сочельник', minutes: 45, terminal: true, goto: 'c44_tue_eve',
        text: 'Хенрике рисует стол на обороте календаря и кружки вокруг. Кружков больше, чем стульев. Она зачёркивает один, потом рисует обратно.', effects: [set44('bd2', 'table'), until44(52, 17, 0)] },
      { id: 'c44_bd2_partner', label: 'Найти {partner.acc} и рассказать про колонию', minutes: 45, terminal: true, goto: 'c44_tue_eve',
        text: 'Ты рассказываешь про ногу Яннеса, про фрау Ханзен и её «и всё равно». {partner} слушает и говорит: «После Рождества — это уже много».', effects: [set44('bd2', 'partner'), until44(52, 17, 0)] },
      { id: 'c44_bd2_rest', label: 'Посидеть у печи с кружкой', minutes: 30, terminal: true, goto: 'c44_tue_eve',
        text: 'Печь, кружка, тишина. За окном снова пошёл снег.', effects: [set44('bd2', 'rest'), { body: 'fatigue', delta: -4 }, until44(52, 16, 45)] },
    ] }),
];
