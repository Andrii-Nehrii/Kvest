import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import {
  S49, bjorn49, bjornAlive49, d31, day49, fed49, mild49, set49, trip49, uke49, uke49is, until49, w49,
} from './point49';

// Участок 49, линия B. Дома — утро в колонии: Бьёрн Тиде по КТ48 (переезд с курами / ищут у лесополосы / колет дрова под
// присмотром дружины), без Бьёрна — Уте; потом фрау Ханзен моет окна к Сильвестру.
// Порознь — Эппендорф: восьмая палата (старик по `$.c48_hbtr`), гипогликемия Мерле на новой схеме, Вольтерс и бумаги на мост,
// фургон через город к Мессехалле, очередь, окно номер семь (`w.c48_uke`: обратный путь четвёртого или карта помощницы до весны),
// обратно мимо Альстера, ужин, рация в восемь (его голос — обрывками), ночь; 31-е — гирлянды, смена, разговор с Мерле, обед.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S49({ ...scene, for: 'any', chapter: 'ch3' });
const messe = 'c49_messe';
const hosp = (rest: false | 'sleep' = false) => ({ at: uke49, stock: 'c48_uke', rest });
const town = { at: messe, stock: 'c48_uke', rest: false as const };
const U = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: uke49, camp: scene.camp ?? hosp(), safe: true });
const ward = { tempC: 20, outdoor: false, wet: false };
const van = { tempC: 10, outdoor: false, wet: false };
const toFarm: Effect = { move: 'hof_luedemann' };
const toMesse: Effect = { move: messe };
const toUke: Effect = { move: uke49 };
const back: Cond = uke49is('back');
const spring: Cond = uke49is('spring');
const old = (x: string): Cond => v('$.c48_hbtr', x);
const late: Cond = old('rounds');
const noBjorn: Cond = not(bjornAlive49);

export const day49BScenes: Scene[] = [
  // ═════════════ Дома: колония ═════════════
  X({ id: 'c49_nb_colony', title: 'Колония', location: 'c15_garden', camp: trip49('c15_garden'), ambient: { tempC: -7, outdoor: true, wet: false },
    text: [
      { text: 'В колонии у насыпи дымят три трубы из двенадцати. Снег между домиками истоптан в тропинки. Уте выходит навстречу в двух платках.' },
      { when: bjorn49('take'), text: 'У калитки Тиде, через дорогу, — санки. На санках клетка с курами, мешок и топор. Бьёрн увязывает всё верёвкой и не смотрит на дом. Сегодня он переезжает к вам.' },
      { when: bjorn49('help'), text: 'Уте говорит: Бьёрна со вчерашнего вечера не видно. Печь у Тиде не топится, дыма нет с ночи. Куры кричат голодные.' },
      { when: bjorn49('brandt'), text: 'Во дворе Тиде — дружинник с ружьём на лавке. Бьёрн колет дрова и делает вид, что никого нет. Ни дружинника, ни тебя.' },
      { when: noBjorn, text: 'Двор Тиде через дорогу стоит пустой. Окна забиты досками крест-накрест, на двери — мелом: «Leer». Пусто.' },
    ],
    actions: [
      { id: 'c49_nc_sled', label: 'Помочь Бьёрну увязать санки и довезти до хутора', when: bjorn49('take'), minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false }, activity: 'moderate',
        text: 'Ты тянешь санки за верёвку, Бьёрн толкает сзади. Куры возмущаются на каждом ухабе. На полпути он говорит: «Ich muss noch mal zurück. Ins Haus». Мне надо ещё раз вернуться. В дом. Одному ему туда не хочется, это видно.', effects: [set49('nc', 'sled'), w49('bjorn_moved', true), { body: 'fatigue', delta: 4 }, until49(8, 0)] },
      { id: 'c49_nc_hens', label: 'Взять клетку с курами: пусть Бьёрн несёт своё', when: bjorn49('take'), minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false },
        text: 'Клетка тяжёлая и живая: шесть кур спорят, кто виноват. Бьёрн берёт мешок и топор, и вы идёте рядом. У своей калитки он останавливается и говорит: «Ich hol noch was. Aus dem Haus». Я заберу ещё кое-что. Из дома. И смотрит на тебя: пойдёшь?', effects: [set49('nc', 'hens'), w49('bjorn_moved', true), until49(8, 0)] },
      { id: 'c49_nc_search', label: 'Идти по следам от крыльца Тиде', when: bjorn49('help'), minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false },
        text: 'Следы от крыльца идут не к дороге, а через огород, к лесополосе. Шаги широкие, ровные: шёл, не бежал. Ты идёшь по ним, и с каждым шагом понимаешь, куда.', effects: [set49('nc', 'search'), until49(8, 0)] },
      { id: 'c49_nc_jannes', label: 'Позвать Яннеса и искать Бьёрна вдвоём', when: bjorn49('help'), minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false },
        text: 'Яннес надевает куртку на ходу. По следам через огород вы идёте вдвоём, и он говорит, не глядя: «Ich weiß, wo er ist». Я знаю, где он. Ты тоже уже знаешь.', effects: [set49('nc', 'jannes'), w49('jannes_search', true), until49(8, 0)] },
      { id: 'c49_nc_wood', label: 'Взять второй колун и встать рядом с Бьёрном', when: bjorn49('brandt'), minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false }, activity: 'heavy',
        text: 'Вы колете вдвоём, молча, в разном ритме. Через полчаса ритм один. Дружинник на лавке закуривает и отворачивается к дороге: двое — это уже не его забота.', effects: [set49('nc', 'wood'), w49('bjorn_wood', true), { body: 'fatigue', delta: 6 }, until49(8, 0)] },
      { id: 'c49_nc_guard', label: 'Подсесть к дружиннику и спросить, как Бьёрн', when: bjorn49('brandt'), minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false },
        text: 'Дружинник говорит вполголоса: парень не спит, ест раз в день, ночью сидит на крыльце с ружьём отца. «Brandt sagt, aufpassen. Ich pass auf. Aber ich bin kein Vater». Брандт говорит — присматривать. Я присматриваю. Но я не отец.', effects: [set49('nc', 'guard'), w49('bjorn_nights', true), until49(8, 0)] },
      { id: 'c49_nc_ute', label: 'Выпить кофе у Уте', when: noBjorn, minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: 16, outdoor: false, wet: false },
        text: 'Кофе из цикория, сахара нет. Уте греет руки о кружку и говорит про завтрашнюю ночь: Яннес будет у леса, она с детьми у огня. «Und ich werd die ganze Zeit zum Wald gucken». И я всё время буду смотреть в сторону леса.', effects: [set49('nc', 'ute'), ...fed49(10), until49(8, 0)] },
      { id: 'c49_nc_brush', label: 'Набрать у насыпи хвороста на растопку к Сильвестру', when: noBjorn, minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false }, activity: 'moderate',
        text: 'Сухие ветки ивы, ломкие на морозе, вязанка за вязанкой. Уте выносит тебе бечёвку. Растопки хватит на три ночи, и одна из них — завтрашняя.', effects: [set49('nc', 'brush'), { body: 'fatigue', delta: 3 }, until49(8, 0)] },
      { id: 'c49_nc_potatoes', label: 'Отнести Уте мешок картошки к Сильвестру', minutes: 75, terminal: true, goto: 'c49_nb_second', ambientDuring: { tempC: -7, outdoor: true, wet: false }, activity: 'moderate',
        text: 'Мешок на санках, двадцать килограммов, из бурта Хенрике. Уте сначала отказывается, потом считает своих по пальцам и берёт. «Ich koche morgen für alle am Wald». Завтра сварю на всех у леса.', effects: [set49('nc', 'potatoes'), w49('ute_potatoes', true), until49(8, 0)] },
    ] }),

  X({ id: 'c49_nb_second', title: 'Тиде', location: 'c3_neighbor', camp: trip49('c3_neighbor'), ambient: { tempC: -5, outdoor: true, wet: false },
    text: [
      { when: bjorn49('take'), text: 'В доме Тиде холодно, как на улице. На столе кружка Карстена с недопитым кофе, замёрзшим в лёд. На стене — фотографии: Карстен с трактором, Карстен с собакой, Карстен молодой на чьей-то свадьбе.' },
      { when: bjorn49('help'), text: 'Бьёрн сидит на пне у лесополосы, там, где в субботу нашли его отца. На коленях — отцовское ружьё. Он не целится. Просто сидит, весь в инее, как будто давно.' },
      { when: bjorn49('brandt'), text: 'Дрова сложены. Бьёрн садится на колоду и впервые смотрит на тебя прямо. Глаза красные, сухие.' },
      { when: noBjorn, text: 'От Уте ты идёшь мимо пустого двора Тиде. Кур нет, собаки нет. Только на крыльце стоит пара сапог, большие и маленькие, рядом.' },
    ],
    actions: [
      { id: 'c49_n2_photo', label: 'Снять со стены фотографию отца и отдать Бьёрну', when: bjorn49('take'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: 4, outdoor: false, wet: false },
        text: 'Ты снимаешь ту, где Карстен смеётся с собакой. Бьёрн берёт её, смотрит и кладёт за пазуху, под куртку. Остальные остаются на стене. «Die bleiben hier. Damit das Haus weiß, wem es gehört». Эти останутся. Чтобы дом знал, чей он.', effects: [set49('n2', 'photo'), w49('bjorn_photo', true), until49(9, 30)] },
      { id: 'c49_n2_pack', label: 'Помочь сложить отцовские вещи в сундук', when: bjorn49('take'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: 4, outdoor: false, wet: false }, activity: 'moderate',
        text: 'Куртки, сапоги, трубка, ремень с пряжкой-оленем. Бьёрн складывает молча, ты держишь крышку. Ремень он вынимает обратно и надевает на себя. Он ему велик. Он затягивает его на последнюю дырку.', effects: [set49('n2', 'pack'), until49(9, 30)] },
      { id: 'c49_n2_leave', label: 'Выйти и дать ему побыть одному', when: bjorn49('take'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Ты стоишь у санок и кормишь кур крошками из кармана. Через двадцать минут Бьёрн выходит, запирает дверь и вешает ключ себе на шею, на шнурок. «Fertig». Всё.', effects: [set49('n2', 'leave'), until49(9, 30)] },
      { id: 'c49_n2_sit', label: 'Сесть рядом на снег и молчать', when: bjorn49('help'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Ты садишься рядом. Снег под тобой тает и мокнет. Минут через десять Бьёрн говорит: «Er hat gesagt, ich soll weglaufen. Ich bin nicht weggelaufen». Он сказал мне бежать. Я не побежал. Ещё через десять встаёт и идёт к дому. Ружьё несёт стволом вниз.', effects: [set49('n2', 'sit'), w49('bjorn_found', 'sit'), { body: 'fatigue', delta: 3 }, until49(9, 30)] },
      { id: 'c49_n2_gun', label: 'Тихо протянуть руку за ружьём', when: bjorn49('help'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Ты протягиваешь руку, ладонью вверх. Бьёрн смотрит на неё долго. Потом кладёт в неё ружьё, как вещь, которая ему больше не нужна. Патронов в нём нет. Он их и не заряжал.', effects: [set49('n2', 'gun'), w49('bjorn_found', 'gun'), w49('bjorn_gun_taken', true), until49(9, 30)] },
      { id: 'c49_n2_invite', label: 'Сказать: «Завтра ночью ты с нами. Не один»', when: bjorn49('help'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Бьёрн долго молчит. Потом кивает, один раз, коротко, как отец кивал Брандту на совете. Встаёт, отряхивает снег. По дороге к дому спрашивает, будут ли берлинеры. Будут.', effects: [set49('n2', 'invite'), w49('bjorn_found', 'invite'), w49('bjorn_fire', true), until49(9, 30)] },
      { id: 'c49_n2_talk', label: 'Спросить, как он спит', when: bjorn49('brandt'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: '«Gar nicht». Никак. Он слушает ночью двор. Каждый звук — отец идёт. Потом вспоминает, что нет. Ты говоришь ему про доктора Зандер и про чай с валерианой. Он слушает и не отвечает, но запоминает: это видно.', effects: [set49('n2', 'talk'), w49('bjorn_sleep', true), until49(9, 30)] },
      { id: 'c49_n2_food', label: 'Оставить ему хлеба и сала на два дня', when: bjorn49('brandt'), minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Хлеб, сало, луковица — на подоконник, под ставню. Бьёрн кивает. «Sag Henrike danke». Скажи Хенрике спасибо. Ты не говоришь, что это не от Хенрике.', effects: [set49('n2', 'food'), w49('bjorn_fed', true), until49(9, 30)] },
      { id: 'c49_n2_boots', label: 'Постоять у крыльца Тиде', when: noBjorn, minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Сапоги замёрзли в снег. Кто их поставил так, рядом, — непонятно. Ты не трогаешь. Уходя, оглядываешься один раз. Сапоги стоят.', effects: [set49('n2', 'boots'), until49(9, 30)] },
      { id: 'c49_n2_ute', label: 'Проводить Уте до колонки с вёдрами', when: noBjorn, minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Колонка замёрзла, Уте льёт на неё кипяток из чайника. Вода идёт рывками, ржавая, потом чистая. Вы наполняете четыре ведра и несёте по два, и Уте рассказывает, что Яннес с субботы спит в куртке.', effects: [set49('n2', 'ute'), until49(9, 30)] },
      { id: 'c49_n2_post', label: 'Помочь Яннесу на посту у лесополосы', when: noBjorn, minutes: 60, terminal: true, goto: 'c49_nb_kids', ambientDuring: { tempC: -5, outdoor: true, wet: false },
        text: 'Яннес показывает: колья с тряпками, которые вы ставили в понедельник, на месте. Лес тихий. «Zu ruhig für meinen Geschmack». Слишком тихо, на мой вкус. Он говорит это каждый день.', effects: [set49('n2', 'post'), until49(9, 30)] },
    ] }),

  X({ id: 'c49_nb_kids', title: 'Горка', location: 'c15_garden', camp: trip49('c15_garden'), ambient: { tempC: -4, outdoor: true, wet: false },
    text: [
      { text: 'На насыпи у колонии дети катаются с горки на картонках и мешках из-под картошки. Внизу, у канавы, горка кончается сугробом.' },
      { text: 'Один мальчишка стоит в стороне, без варежек, и смотрит, как катаются другие. Рукава у куртки короткие, запястья красные.' },
    ],
    actions: [
      { id: 'c49_nk_mittens', label: 'Отдать мальчишке свои варежки', minutes: 60, terminal: true, goto: 'c49_nb_hansen', ambientDuring: { tempC: -4, outdoor: true, wet: false },
        text: 'Варежки ему велики, пальцы болтаются. Он не говорит «спасибо», он сразу бежит на горку и съезжает на животе. Ты прячешь руки в карманы. До дома дотерпишь.', effects: [set49('nk', 'mittens'), w49('b_mittens_given', true), until49(10, 30)] },
      { id: 'c49_nk_slide', label: 'Съехать вместе с ними на мешке', minutes: 60, terminal: true, goto: 'c49_nb_hansen', ambientDuring: { tempC: -4, outdoor: true, wet: false }, activity: 'moderate',
        text: 'Мешок, насыпь, ветер в лицо, сугроб. Снег за шиворотом, смех. Дети требуют ещё. Ты съезжаешь ещё три раза, и на третий раз смеёшься громче всех.', effects: [set49('nk', 'slide'), { body: 'stress', delta: -8 }, { body: 'fatigue', delta: 3 }, until49(10, 30)] },
      { id: 'c49_nk_ditch', label: 'Встать внизу, у канавы: лёд там тонкий', minutes: 60, terminal: true, goto: 'c49_nb_hansen', ambientDuring: { tempC: -4, outdoor: true, wet: false },
        text: 'Канава под снегом, лёд с ладонь. Ты стоишь внизу и ловишь тех, кто разогнался слишком. Ловишь шестерых. Седьмой проскакивает мимо и застревает в сугробе по пояс, счастливый.', effects: [set49('nk', 'ditch'), until49(10, 30)] },
    ] }),

  X({ id: 'c49_nb_hansen', title: 'Окна', location: 'c3_neighbor', camp: trip49('c3_neighbor'), ambient: { tempC: 18, outdoor: false, wet: false },
    text: [
      { text: 'По дороге домой — фрау Ханзен. Она моет окна. В мороз. Вода на стекле тут же схватывается узором, и она трёт его газетой.' },
      { text: '— Silvester macht man die Fenster sauber. Damit das neue Jahr reingucken kann.\n\nВ Сильвестр моют окна. Чтобы новый год мог заглянуть.' },
      { when: flag('w.c48_hansen_invite'), text: 'Она напоминает: завтра заходите на чашку. У неё припрятана бутылка яичного ликёра.' },
    ],
    actions: [
      { id: 'c49_nh_wash', label: 'Взять вторую газету и тереть с ней окна', minutes: 90, terminal: true, goto: 'c49_n_lunch', ambientDuring: { tempC: -2, outdoor: true, wet: false }, activity: 'moderate',
        text: 'Шесть окон, двенадцать стёкол. Пальцы деревенеют. Фрау Ханзен рассказывает про каждое окно: из этого её муж смотрел на поле, из этого дочка махала автобусу. Последнее стекло вы моете в тишине. Оно самое чистое.', effects: [set49('nh', 'wash'), w49('hansen_windows', true), toFarm, until49(12, 0)] },
      { id: 'c49_nh_tea', label: 'Зайти к ней на чай и послушать', minutes: 90, terminal: true, goto: 'c49_n_lunch',
        text: 'Чай из мяты с её грядки, сухари. Фрау Ханзен показывает альбом: свадьба, наводнение шестьдесят второго, внуки на велосипедах. «Die sind in Kanada. Hoffe ich». Они в Канаде. Надеюсь. Альбом она закрывает аккуратно, как дверь.', effects: [set49('nh', 'tea'), ...fed49(10), toFarm, until49(12, 0)] },
      { id: 'c49_nh_wood', label: 'Натаскать ей дров на два дня', minutes: 90, terminal: true, goto: 'c49_n_lunch', ambientDuring: day49, activity: 'heavy',
        text: 'Поленница у неё за сараем, наполовину под снегом. Ты таскаешь охапки к печке, пока ящик не наполняется с горкой. Фрау Ханзен стоит в дверях и считает вслух: «Eins, zwei… das reicht bis Neujahr. Und noch weiter». Раз, два… хватит до Нового года. И ещё дальше.', effects: [set49('nh', 'wood'), w49('hansen_wood', true), { body: 'fatigue', delta: 6 }, toFarm, until49(12, 0)] },
    ] }),

  // ═════════════ Порознь: Эппендорф ═════════════
  U({ id: 'c49_hb_dawn', title: 'Среда в Эппендорфе', ambient: ward,
    text: [
      { text: 'Шесть утра. Свет в коридоре включают, как будильник. Ты уже не вздрагиваешь.' },
      { when: back, text: 'Четвёртого — домой. До четвёртого пять дней. Ты считаешь их не по пальцам, а по сменам.' },
      { when: spring, text: 'Решено: до весны. Ты просыпаешься с этим в первое утро и всё ещё не веришь, что решено.' },
      { text: 'Мерле ещё спит. На тумбочке её тетрадь со списком «Was ich im Frühling mache». Что я буду делать весной.' },
    ],
    actions: [
      { id: 'c49_hd_shower', label: 'Горячий душ, пока очередь не проснулась', minutes: 30, terminal: true, goto: 'c49_hb_ward',
        text: 'Горячая вода второй день подряд — уже не чудо, а привычка. Ты ловишь себя на этом и пугаешься: так быстро привыкнуть.', effects: [set49('hd', 'shower'), { body: 'stress', delta: -4 }, until49(6, 45)] },
      { id: 'c49_hd_eat', label: 'Позавтракать в столовой', minutes: 30, terminal: true, goto: 'c49_hb_ward',
        text: 'Хлеб, джем, яйцо, кофе из автомата. Ты съедаешь всё и думаешь, что на хуторе сейчас каша на воде. Яйцо застревает в горле. Ты всё равно его доедаешь.', effects: [set49('hd', 'eat'), ...fed49(35), until49(6, 45)] },
      { id: 'c49_hd_list', label: 'Тихо прочитать список Мерле', minutes: 30, terminal: true, goto: 'c49_hb_ward',
        text: 'Пункт первый: «Nach Hause». Домой. Ниже, новым почерком, ночью: «Henrike das Rezept für Rote Grütze geben». Отдать Хенрике рецепт красного киселя. И ещё ниже: «Nicht mehr rechnen». Больше не считать. Ты кладёшь тетрадь, как лежала.', effects: [set49('hd', 'list'), until49(6, 45)] },
    ] }),

  U({ id: 'c49_hb_ward', title: 'Восьмая палата', ambient: ward,
    text: [
      { text: 'Вольтерс отдаёт тебе халат и восьмую палату. Старик у окна, тот, с пальцем. На тумбочке у него фотография в рамке: он с женой у садового домика, на калитке номер 214.' },
      { when: any(old('doctor'), old('talk')), text: 'Палец ему отняли вчера после обеда. Ногу нет. Он лежит, смотрит на забинтованную ступню и разговаривает с ней, как с собакой.' },
      { when: late, text: 'Красную пометку в карте врач увидел только вечером. Ночью у старика поднялась температура, утром его увезли в хирургию. Вернули без половины стопы. Он лежит лицом к стене.' },
      { when: not(any(old('doctor'), old('talk'), late)), text: 'После вчерашней операции он лежит тихо: палец отняли, ногу оставили. Он смотрит в окно на заснеженные крыши.' },
    ],
    actions: [
      { id: 'c49_hw_dress', label: 'Сделать перевязку, как учили, и не торопиться', minutes: 120, terminal: true, goto: 'c49_hb_merle',
        text: 'Бинт, раствор, марля. Рана чистая. Старик смотрит, как ты работаешь, и говорит: «Sie haben gute Hände. Meine Frau hatte auch so welche». У вас хорошие руки. У моей жены были такие же. Больше он про жену не говорит.', effects: [set49('hw', 'dress'), w49('b_dressed', true), until49(9, 0)] },
      { id: 'c49_hw_garden', label: 'Посидеть со стариком и спросить про его сад', minutes: 120, terminal: true, goto: 'c49_hb_merle',
        text: 'Сад в Ниндорфе, яблони, двенадцать сортов. Он перечисляет все, загибая пальцы, и на десятом сбивается. «Boskoop. Den hab ich vergessen. Den Boskoop!» Боскоп. Его я забыл. Боскоп! Он смеётся до слёз, и ты не сразу понимаешь, от смеха ли.', effects: [set49('hw', 'garden'), w49('b_old_garden', true), until49(9, 0)] },
      { id: 'c49_hw_round', label: 'Обойти всю палату: шесть коек, не одна', minutes: 120, terminal: true, goto: 'c49_hb_merle',
        text: 'Сахар, давление, капельницы. Женщина на третьей койке просит расчёску. Мужчина на пятой — бумагу и ручку, написать сыну. Ты приносишь и то, и другое. Обход занимает вдвое дольше, чем надо. Вольтерс ничего не говорит.', effects: [set49('hw', 'round'), w49('b_worked2', true), { body: 'fatigue', delta: 4 }, until49(9, 0)] },
    ] }),

  U({ id: 'c49_hb_merle', title: 'Мерле', ambient: ward,
    text: [
      { text: 'В девять тебя зовут в палату Мерле. Она сидит на полу у кровати, мокрая, белая, руки трясутся. Новая схема: короткий инсулин к завтраку. А завтрак она отдала соседке.' },
      { text: '— Ich hab nicht gerechnet, — шепчет она. — Zum ersten Mal hab ich nicht gerechnet.\n\nЯ не посчитала. Первый раз не посчитала.' },
    ],
    actions: [
      { id: 'c49_hm_juice', label: 'Сок из тумбочки, сразу, по глотку, держа ей голову', minutes: 60, terminal: true, goto: 'c49_hb_wolters',
        text: 'Ты держишь её голову на сгибе локтя и поишь по глотку. Через десять минут руки перестают трястись, через двадцать она садится сама. «Danke, Schwester», — говорит она нарочно. Спасибо, сестра. И слабо смеётся.', effects: [set49('hm', 'juice'), w49('b_merle_hypo', 'juice'), until49(10, 0)] },
      { id: 'c49_hm_glucose', label: 'Бегом на пост за глюкозой', minutes: 60, terminal: true, goto: 'c49_hb_wolters',
        text: 'Коридор, пост, ящик, ампула. Ты возвращаешься за минуту. Глюкоза под язык, потом сладкий чай. Мерле приходит в себя и первым делом спрашивает, видел ли кто-нибудь. Видели все. Соседка плачет громче, чем Мерле.', effects: [set49('hm', 'glucose'), w49('b_merle_hypo', 'glucose'), until49(10, 0)] },
      { id: 'c49_hm_doctor', label: 'Крикнуть врача и держать Мерле, пока не придёт', minutes: 60, terminal: true, goto: 'c49_hb_wolters',
        text: 'Врач в свитере прибегает через две минуты, ставит глюкозу в вену, меряет, кивает. Потом садится на край кровати и пересчитывает с Мерле схему заново, по строчке. Тебе она говорит в коридоре: «Gut, dass Sie geblieben sind». Хорошо, что вы остались.', effects: [set49('hm', 'doctor'), w49('b_merle_hypo', 'doctor'), until49(10, 0)] },
    ] }),

  U({ id: 'c49_hb_wolters', title: 'Бумаги', ambient: ward,
    text: [
      { text: 'Вольтерс ловит тебя у поста с листком в руке.' },
      { text: '— Die Brücke. Ab dem zweiten zu. Ohne Stempel vom Roten Kreuz sind Sie danach eine Zivilistin ohne Papiere. — Она снимает очки. — Unser Wagen fährt um elf zu den Messehallen. Fahren Sie mit.\n\nМост. Со второго закрыт. Без печати Красного Креста вы потом — гражданская без бумаг. Наша машина в одиннадцать едет к Мессехалле. Езжайте.' },
      { when: back, text: 'Для обратного пути четвёртого тебе нужно, чтобы твоё имя стояло в списке колонны Нильса. Списки — там.' },
      { when: spring, text: 'Чтобы остаться, нужна карта помощницы больницы. Без неё со второго нет ни талонов на еду, ни права быть в городе.' },
    ],
    actions: [
      { id: 'c49_hwo_go', label: 'Ехать в одиннадцать, как она говорит', minutes: 60, terminal: true, goto: 'c49_hb_van',
        text: 'Вольтерс даёт тебе бумагу с печатью отделения: «Begleitung, Station 4, dringend». Сопровождение, отделение четыре, срочно. «Damit Sie nicht den ganzen Tag stehen». Чтобы не стоять весь день.', effects: [set49('hwo', 'go'), w49('b_wolters_paper', true), until49(11, 0)] },
      { id: 'c49_hwo_merle', label: 'Сначала посидеть с Мерле после приступа', minutes: 60, terminal: true, goto: 'c49_hb_van',
        text: 'Мерле ест кашу под твоим присмотром, ложку за ложкой. Ты считаешь хлебные единицы вслух, она повторяет. Без пяти одиннадцать она тебя выгоняет: «Geh. Sonst fährt der Wagen ohne dich». Иди. А то машина уедет без тебя.', effects: [set49('hwo', 'merle'), until49(11, 0)] },
      { id: 'c49_hwo_why', label: 'Спросить Вольтерс, зачем ей самой это всё', minutes: 60, terminal: true, goto: 'c49_hb_van',
        text: 'Вольтерс смотрит на тебя поверх очков. «Weil ich dreißig Jahre Leute festhalte, die gehen wollen. Und gehen lasse, die bleiben müssten. Diesmal mache ich es richtig». Потому что тридцать лет я удерживаю тех, кто хочет уйти. И отпускаю тех, кому надо остаться. В этот раз сделаю правильно.', effects: [set49('hwo', 'why'), until49(11, 0)] },
    ] }),

  X({ id: 'c49_hb_van', title: 'Через город', location: messe, camp: town, ambient: van,
    text: [
      { text: 'Больничный фургон идёт через Эппендорф, мимо пустого стадиона, к Даммтору. На улицах больше людей, чем вчера: все что-то несут к Сильвестру — ёлки, дрова, канистры.' },
      { text: 'На мосту через Альстер патруль в синем проверяет машины. Водитель показывает бумагу больницы, и вас пропускают не глядя.' },
    ],
    actions: [
      { id: 'c49_hv_driver', label: 'Разговорить водителя', minutes: 60, terminal: true, goto: 'c49_hb_queue', ambientDuring: van,
        text: 'Водитель возит больных с ноября. Говорит, что в Харбурге у моста сейчас очередь на полдня и что сенат боится не мёртвых, а людей: «Wenn alle auf einmal raus wollen, ist die Brücke weg». Если все разом захотят выйти, моста не будет.', effects: [set49('hv', 'driver'), toMesse, until49(12, 0)] },
      { id: 'c49_hv_window', label: 'Смотреть в окно на город', minutes: 60, terminal: true, goto: 'c49_hb_queue', ambientDuring: van,
        text: 'Телебашня без огней торчит над парком, как палец. В парке палатки, дым из труб, очередь к полевой кухне. На одном доме растянут флаг Гамбурга, на другом — простыня с надписью «Wir sind noch da». Мы ещё здесь.', effects: [set49('hv', 'window'), toMesse, until49(12, 0)] },
      { id: 'c49_hv_doze', label: 'Подремать: ночь была короткой', minutes: 60, terminal: true, goto: 'c49_hb_queue', ambientDuring: van, activity: 'rest',
        text: 'Ты засыпаешь на первом же светофоре, который не работает, и просыпаешься, когда водитель глушит мотор. «Messehallen. Viel Glück». Мессехалле. Удачи.', effects: [set49('hv', 'doze'), { body: 'fatigue', delta: -6 }, toMesse, until49(12, 0)] },
    ] }),

  X({ id: 'c49_hb_queue', title: 'Очередь', location: messe, camp: town, ambient: { tempC: 1, outdoor: true, wet: false },
    text: [
      { text: 'Мессехалле, выставочные павильоны у телебашни. Теперь здесь Красный Крест и сенат: окна в фанере, у входа, под длинным навесом, очередь в три ряда, на сотни метров. Все хотят одного: бумагу на мост до второго.' },
      { text: 'Перед тобой — женщина с двумя детьми и котом в сумке. За тобой — студент с чехлом от гитары, в котором явно не гитара.' },
    ],
    actions: [
      { id: 'c49_hq_paper', label: 'Показать охраннику бумагу Вольтерс', when: flag('w.c49_b_wolters_paper'), minutes: 90, terminal: true, goto: 'c49_hb_office', ambientDuring: { tempC: 1, outdoor: true, wet: false },
        text: 'Охранник читает, кивает и ведёт тебя вдоль очереди. Очередь смотрит тебе в спину, и ты чувствуешь каждый взгляд, как снежок за шиворот. Женщина с котом смотрит дольше всех.', effects: [set49('hq', 'paper'), w49('b_skipped', true), until49(13, 30)] },
      { id: 'c49_hq_stand', label: 'Стоять в очереди, как все', minutes: 120, terminal: true, goto: 'c49_hb_office', ambientDuring: { tempC: 1, outdoor: true, wet: false },
        text: 'Два часа. Ноги перестают чувствовать холод через полчаса, потом через час — вообще что-то. Очередь движется рывками. Кто-то поёт, кто-то ругается, кто-то спит стоя, держась за соседа.', effects: [set49('hq', 'stand'), { body: 'fatigue', delta: 4 }, until49(14, 0)] },
      { id: 'c49_hq_kids', label: 'Помочь женщине с детьми: подержать младшего', minutes: 120, terminal: true, goto: 'c49_hb_office', ambientDuring: { tempC: 1, outdoor: true, wet: false },
        text: 'Младшему года три, он тяжёлый и тёплый, засыпает у тебя на плече через пять минут. Мать заполняет бланк на коленке. Они идут в Целле, к бабушке. «Wenn die Brücke offen ist». Если мост откроют. Ты отдаёшь ей ребёнка у самого окна, и плечо долго помнит тепло.', effects: [set49('hq', 'kids'), w49('b_helped_mother', true), until49(14, 0)] },
      { id: 'c49_hq_student', label: 'Спросить студента, что у него в чехле', minutes: 120, terminal: true, goto: 'c49_hb_office', ambientDuring: { tempC: 1, outdoor: true, wet: false },
        text: 'Студент оглядывается и приоткрывает молнию. В чехле, на свитере, спит щенок. «Darf man nicht mitnehmen. Steht in den Regeln». Нельзя брать с собой. Так в правилах. Он застёгивает молнию и подмигивает. Два часа проходят быстрее.', effects: [set49('hq', 'student'), until49(14, 0)] },
    ] }),

  X({ id: 'c49_hb_office', title: 'Окно номер семь', location: messe, camp: town, ambient: { tempC: 8, outdoor: false, wet: false },
    text: [
      { text: 'Окно номер семь. Чиновница в двух свитерах, печать, штемпельная подушка, которую она греет дыханием.' },
      { when: back, text: 'Твоего имени в списке колонны Нильса на четвёртое нет. «Dann jetzt». Тогда сейчас. Она вписывает тебя от руки, восемнадцатой, и ставит печать: «Rückfahrt 04.01. Kolonne DRK Winsen». Обратно 4.01.' },
      { when: spring, text: 'Чиновница выписывает карту помощницы больницы. Тут же, у окна, делают снимок на полароид. На снимке у тебя лицо человека, которого только что разбудили.' },
      { when: not(any(back, spring)), text: 'Чиновница смотрит твою бумажку «Begleitung, bis 04.01.» и ставит печать. Бумага действительна. Дальше — как решишь.' },
    ],
    actions: [
      { id: 'c49_ho_merle', label: 'Вписать в список и Мерле — на всякий случай', when: back, minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: 'Чиновница пожимает плечами и вписывает Мерле девятнадцатой. «Streichen kann man immer». Вычеркнуть всегда можно. Две фамилии рядом, одной ручкой.', effects: [set49('ho', 'merle'), w49('b_listed', true), w49('merle_listed', true), until49(14, 45)] },
      { id: 'c49_ho_self', label: 'Только себя: Мерле решит сама', when: back, minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: 'Одна фамилия, одна печать. Чиновница говорит: если Мерле передумает, место в колонне найдётся до третьего. Потом — нет.', effects: [set49('ho', 'self'), w49('b_listed', true), until49(14, 45)] },
      { id: 'c49_ho_ifnot', label: 'Спросить, что будет, если колонну четвёртого не пустят', when: back, minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: 'Чиновница смотрит на тебя, как на ребёнка. «Dann die nächste. In zwei Wochen. Oder im Frühling». Тогда следующая. Через две недели. Или весной. И ставит печать, не дожидаясь, что ты скажешь.', effects: [set49('ho', 'ifnot'), w49('b_listed', true), w49('b_knows_fortnight', true), until49(14, 45)] },
      { id: 'c49_ho_cross', label: 'Спросить, можно ли с этой картой ездить через мост', when: spring, minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: '«Mit Kolonne, ja. Allein — nein». С колонной — да. Одной — нет. Колонны раз в две недели. Значит, домой можно будет съездить. Раз в две недели, если повезёт.', effects: [set49('ho', 'cross'), w49('b_staff_card', true), w49('b_knows_fortnight', true), until49(14, 45)] },
      { id: 'c49_ho_family', label: 'Попросить вписать {A.acc} как родственника', when: spring, minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: 'Чиновница качает головой: родственник — только с документом. Свидетельства о браке у вас нет. Она смотрит на тебя и вдруг пишет на обороте карты карандашом: «Partner: {A}». «Hilft nicht. Schadet nicht». Не поможет. Не повредит.', effects: [set49('ho', 'family'), w49('b_staff_card', true), w49('b_card_partner', true), until49(14, 45)] },
      { id: 'c49_ho_take', label: 'Взять карту и уйти, пока очередь не начала кричать', when: spring, minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: 'Карта ещё тёплая от ламинатора, который работает от аккумулятора. Ты прячешь её во внутренний карман. Первый документ за полтора месяца, где написано, кто ты.', effects: [set49('ho', 'take'), w49('b_staff_card', true), until49(14, 45)] },
      { id: 'c49_ho_stamp', label: 'Взять печать и уйти', when: not(any(back, spring)), minutes: 45, terminal: true, goto: 'c49_hb_city',
        text: 'Печать влажная, ты дуешь на неё, пока идёшь к выходу. Очередь за спиной не стала короче ни на метр.', effects: [set49('ho', 'stamp'), until49(14, 45)] },
    ] }),

  X({ id: 'c49_hb_city', title: 'Город', location: messe, camp: town, ambient: { tempC: 1, outdoor: true, wet: false },
    text: [
      { text: 'Фургон будет у Даммтора в четыре. До четырёх ты сама по себе в городе.' },
      { text: 'На Ратушной площади ставят помост: сенат обещает в полночь колокола всех церквей и речь бургомистра по радио. На столбах листовки: «Feuerwerk verboten. Lärm lockt». Фейерверк запрещён. Шум приманивает.' },
    ],
    actions: [
      { id: 'c49_hc_alster', label: 'Постоять у Альстера', minutes: 75, terminal: true, goto: 'c49_hb_bus', ambientDuring: { tempC: 1, outdoor: true, wet: false },
        text: 'По льду Альстера идут люди, прямо через озеро, санки за ними. У берега мальчишки катаются на коньках. Кто-то построил снеговика и надел на него полицейскую фуражку. Ты смеёшься вслух, одна, и тебе за это не стыдно.', effects: [set49('hc', 'alster'), toUke, until49(16, 30)] },
      { id: 'c49_hc_church', label: 'Зайти в церковь Святого Петра: там кормят', minutes: 75, terminal: true, goto: 'c49_hb_bus',
        text: 'В церкви тепло от сотни людей. Суп из полевой кухни, хлеб, орган, на котором кто-то учится играть одну и ту же фразу. Пастор ходит между рядами и спрашивает каждого: «Haben Sie jemanden?» У вас есть кто-нибудь? У тебя есть. Ты так и говоришь.', effects: [set49('hc', 'church'), ...fed49(30), toUke, until49(16, 30)] },
      { id: 'c49_hc_market', label: 'Пройти через рынок под куполом вокзала', minutes: 75, terminal: true, goto: 'c49_hb_bus', ambientDuring: { tempC: 1, outdoor: true, wet: false },
        text: 'Под куполом продают к Сильвестру: свечи, бенгальские огни, бутылки, конфеты с истёкшим сроком. Женщина отдаёт тебе бенгальский огонь бесплатно: «Für Ihren Liebsten. Sie gucken so». Для вашего любимого. У вас такой взгляд. Ты прячешь его в карман рядом с бумагами.', effects: [set49('hc', 'market'), w49('b_sparkler', true), toUke, until49(16, 30)] },
      { id: 'c49_hc_straight', label: 'Сразу к фургону: Мерле одна', minutes: 60, terminal: true, goto: 'c49_hb_bus',
        text: 'Ты ждёшь фургон у Даммтора час, переминаясь с ноги на ногу. Водитель приезжает раньше и смеётся: «Sie sind die Erste, die nicht spazieren geht». Вы первая, кто не пошёл гулять.', effects: [set49('hc', 'straight'), toUke, until49(16, 15)] },
    ] }),

  U({ id: 'c49_hb_bus', title: 'Попутчики', ambient: ward,
    text: [
      { text: 'Вернувшись, ты поднимаешься на второй этаж: узнать, как те, с кем ты {m:ехал|ехала} в автобусе.' },
      { when: v('w.c45_fokken', 'listed'), text: 'Гезина Фоккен сидит в кровати и вяжет из больничного бинта что-то вроде носка. Тамме дремлет на стуле. Увидев тебя, Гезина толкает его спицей: «Tamme. Die vom Bus». Тамме. Та, из автобуса.' },
      { when: all(not(v('w.c45_fokken', 'listed')), not(flag('w.c48_b_vouched'))), text: 'Старушка с одышкой из автобуса сидит в коридоре терапии и машет тебе платком, как с перрона.' },
      { when: all(not(v('w.c45_fokken', 'listed')), flag('w.c48_b_vouched')), text: 'Мужчина с гриппом, которого пропустили на мосту, уже ходит по коридору, держась за стену. Узнаёт тебя и поднимает руку, как на вокзале.' },
    ],
    actions: [
      { id: 'c49_hbb_sit', label: 'Посидеть с ними полчаса', minutes: 45, terminal: true, goto: 'c49_hb_canteen',
        text: 'Разговор ни о чём: про погоду, про больничную еду, про то, что в Харбурге у моста опять очередь. Уходя, ты понимаешь, что эти полчаса были первыми за день, когда ты ни за что не {m:отвечал|отвечала}.', effects: [set49('hbb', 'sit'), { body: 'stress', delta: -5 }, until49(17, 30)] },
      { id: 'c49_hbb_help', label: 'Спросить, не нужно ли чего: ты теперь своя здесь', minutes: 45, terminal: true, goto: 'c49_hb_canteen',
        text: 'Нужна мелочь: очки, которые разбились, нитки, письмо домой отправить. Ты записываешь на ладони. Очков нет, ниток найдёшь, письмо поедет четвёртого с колонной. Если поедет.', effects: [set49('hbb', 'help'), w49('b_bus_help', true), until49(17, 30)] },
      { id: 'c49_hbb_wave', label: 'Помахать из двери и пойти к Мерле', minutes: 30, terminal: true, goto: 'c49_hb_canteen',
        text: 'Тебе машут в ответ. Ты идёшь к Мерле по коридору, мимо звёзд из бланков, и думаешь, что в этом здании у тебя уже есть люди, которые тебе машут.', effects: [set49('hbb', 'wave'), until49(17, 15)] },
    ] }),

  U({ id: 'c49_hb_canteen', title: 'Вечер в отделении', ambient: ward,
    text: [
      { text: 'В отделении всё по-прежнему: свет, тепло, гул. Мерле сидит на кровати, ест яблоко и показывает тебе цифру на глюкометре: семь и один. «Ich rechne wieder». Я снова считаю.' },
      { text: 'В столовой капуста с сосисками. Сёстры обсуждают завтрашнее: в полночь в отделении будут петь, у кого есть голос, и у кого нет — тоже.' },
    ],
    actions: [
      { id: 'c49_hcn_eat', label: 'Поужинать с сёстрами', minutes: 105, terminal: true, goto: 'c49_hb_radio',
        text: 'Сосиски настоящие. Самая молодая из сестёр спрашивает, правда ли на хуторе свои куры. Правда. Она вздыхает так, будто ты {m:сказал|сказала} про море.', effects: [set49('hcn', 'eat'), ...fed49(40), until49(19, 30)] },
      { id: 'c49_hcn_garland', label: 'Помочь Вольтерс клеить гирлянду из старых бланков', minutes: 105, terminal: true, goto: 'c49_hb_radio',
        text: 'Ножницы, клей, бланки назначений. Вольтерс режет звёзды быстро и точно, как бинты. «Morgen sind wir alle müde und albern. Das gehört dazu». Завтра мы все будем усталые и глупые. Так положено.', effects: [set49('hcn', 'garland'), w49('b_wolters_close', true), ...fed49(25), until49(19, 30)] },
      { id: 'c49_hcn_write', label: 'Написать {A.dat} то, что не влезет в две минуты', minutes: 105, terminal: true, goto: 'c49_hb_radio',
        text: 'Ты пишешь на обороте листка со схемой Мерле: про старика и его яблони, про очередь, про щенка в гитарном чехле. Письмо поедет четвёртого. Или весной. Ты дописываешь и складываешь вчетверо.', effects: [set49('hcn', 'write'), w49('b_letter2', true), ...fed49(25), until49(19, 30)] },
    ] }),

  U({ id: 'c49_hb_radio', title: 'Рация', ambient: ward,
    text: [
      { text: 'Без четверти восемь у сестринского поста собираются все, у кого кто-то есть на юге. Дежурная с рацией, список имён. Ты седьмая.' },
      { text: '«Winsen, Eppendorf. Nummer sieben, für Hof Lüdemann». Шорох. Треск. Обрывок слова — может быть, его голос, может быть, чужой.' },
      { when: back, text: 'Тебе кажется, что ты слышишь «…четвёртого…». Может быть, только кажется.' },
      { when: spring, text: 'Тебе кажется, что ты слышишь «…весной…». Может быть, только кажется.' },
      { text: 'Дежурная поднимает палец: говори. Тридцать секунд.' },
    ],
    actions: [
      { id: 'c49_hr_love', label: 'Сказать, что любишь', minutes: 30, terminal: true, goto: 'c49_hb_late',
        text: 'Ты говоришь это по-русски, и дежурная не понимает ни слова. Но понимает. Она отворачивается к окну и долго смотрит на огни Эппендорфа.', effects: [set49('hr', 'love'), w49('b_radio', 'love'), { body: 'stress', delta: -6 }, until49(20, 15)] },
      { id: 'c49_hr_news', label: 'Сказать о деле: Мерле лучше, бумаги есть', minutes: 30, terminal: true, goto: 'c49_hb_late',
        text: 'Мерле лучше. Печать есть. Свет есть. Ты успеваешь всё по пунктам и в конце, на последней секунде, говоришь его имя. Просто имя. Тумблер щёлкает.', effects: [set49('hr', 'news'), w49('b_radio', 'news'), until49(20, 15)] },
      { id: 'c49_hr_bridge', label: 'Сказать: «Со второго мост закрыт. Сюда не иди сам»', minutes: 30, terminal: true, goto: 'c49_hb_late',
        text: 'Ты говоришь это дважды, медленно, чтобы прошло сквозь треск. Ты знаешь его: если не сказать, он пойдёт. Пешком, через Харбург, с пропуском Тобиаса в кармане. Дежурная смотрит на тебя и кивает: прошло.', effects: [set49('hr', 'bridge'), w49('b_radio', 'bridge'), until49(20, 15)] },
      { id: 'c49_hr_short', label: 'Сказать только: «Я здесь. Всё ровно»', minutes: 30, terminal: true, goto: 'c49_hb_late',
        text: 'Четыре слова. «Ровно» — так Мерле говорит про свои цифры. Он поймёт. Остальные двадцать секунд ты слушаешь треск, как будто в нём что-то есть.', effects: [set49('hr', 'short'), w49('b_radio', 'short'), until49(20, 15)] },
    ] }),

  U({ id: 'c49_hb_late', title: 'Завтрашняя ночь', ambient: ward,
    text: [
      { text: 'После рации Вольтерс ловит тебя в коридоре с листком смен на завтра.' },
      { text: '— Morgen um Mitternacht brauche ich zwei auf Station. Die anderen dürfen aufs Dach. Ich frage, ich befehle nicht.\n\nЗавтра в полночь мне нужны двое в отделении. Остальные могут на крышу. Я спрашиваю, а не приказываю.' },
    ],
    actions: [
      { id: 'c49_hl_shift', label: 'Взять полночную смену в отделении', minutes: 45, terminal: true, goto: 'c49_hb_night',
        text: 'Вольтерс вписывает твою фамилию и ставит рядом свою. «Dann sind wir zwei Alte». Значит, мы две старухи. Шутит она редко. Мерле, узнав, обижается на пять минут, потом говорит: «Ich bring dir ein Stück Dach mit». Принесу тебе кусочек крыши.', effects: [set49('hl', 'shift'), w49('b_midnight', 'ward'), until49(21, 0)] },
      { id: 'c49_hl_roof', label: 'Сказать: в полночь ты с Мерле на крыше', minutes: 45, terminal: true, goto: 'c49_hb_night',
        text: 'Вольтерс кивает без обиды и вписывает молодую сестру. «Gut. Passen Sie auf sie auf. Da oben ist es glatt». Хорошо. Присматривайте за ней. Наверху скользко.', effects: [set49('hl', 'roof'), w49('b_midnight', 'roof'), until49(21, 0)] },
      { id: 'c49_hl_ask', label: 'Спросить, где будет она сама', minutes: 45, terminal: true, goto: 'c49_hb_night',
        text: 'Вольтерс пожимает плечами: в отделении, как каждый Новый год тридцать лет. «Ich hab noch nie ein Feuerwerk gesehen. Nur gehört». Я ни разу не видела фейерверка. Только слышала. В этом году и слышно не будет.', effects: [set49('hl', 'ask'), until49(21, 0)] },
    ] }),

  U({ id: 'c49_hb_night', title: 'Последняя ночь года', camp: hosp('sleep'), ambient: ward,
    text: [
      { text: 'Комната сопровождающих. В окне Эппендорф, огни островами. Внизу кто-то играет на губной гармошке старый шлягер, мимо нот.' },
    ],
    actions: [
      { id: 'c49_hn_sleep', label: 'Спать', minutes: 30, terminal: true, goto: 'c49_hbm_dawn', activity: 'rest',
        text: 'Ты засыпаешь под гармошку. Последняя мысль: где-то на юге сейчас тоже кто-то не спит и смотрит на север.', effects: [set49('hn', 'sleep'), d31(6, 30, true)] },
      { id: 'c49_hn_merle', label: 'Посидеть с Мерле, пока она не уснёт', minutes: 30, terminal: true, goto: 'c49_hbm_dawn',
        text: 'Мерле засыпает не сразу. Спрашивает, страшно ли тебе было сегодня утром. Ты говоришь: да. Она говорит: «Mir nicht. Du warst ja da». Мне нет. Ты же была рядом. И засыпает на полуслове.', effects: [set49('hn', 'merle'), d31(6, 30, true)] },
      { id: 'c49_hn_window', label: 'Стоять у окна и смотреть на юг', minutes: 30, terminal: true, goto: 'c49_hbm_dawn',
        text: 'На юге темно. Там Харбург, потом поля, потом лес. Ты стоишь, пока батарея не начинает жечь колени. Потом ложишься и засыпаешь сразу.', effects: [set49('hn', 'window'), d31(6, 30, true)] },
    ] }),

  U({ id: 'c49_hbm_dawn', title: 'Тридцать первое', ambient: ward,
    text: [
      { text: 'Последний день года начинается с гирлянд: ночная смена развесила по коридору звёзды из старых бланков. На каждой — чья-то фамилия задом наперёд.' },
      { text: 'Мерле ловит тебя у двери: «Heute Nacht gehen alle aufs Dach. Man sieht die ganze Stadt». Сегодня ночью все пойдут на крышу. Видно весь город.' },
    ],
    actions: [
      { id: 'c49_hmd_eat', label: 'Позавтракать с Мерле', minutes: 60, terminal: true, goto: 'c49_hbm_ward',
        text: 'Мерле считает хлебные единицы вслух, ты проверяешь. Ошибок нет. Она съедает всё и ещё полбулки сверх, «für Silvester». Для Сильвестра. Сахар через час — шесть и восемь.', effects: [set49('hmd', 'eat'), ...fed49(35), d31(7, 45)] },
      { id: 'c49_hmd_hang', label: 'Помочь развешивать звёзды в палатах', minutes: 60, terminal: true, goto: 'c49_hbm_ward',
        text: 'Ты встаёшь на стул, молодая сестра подаёт звёзды. Старик из восьмой следит за вами и командует: левее, выше, криво. Ты вешаешь криво нарочно. Он смеётся.', effects: [set49('hmd', 'hang'), ...fed49(20), d31(7, 45)] },
      { id: 'c49_hmd_roof', label: 'Подняться на крышу посмотреть на город при свете', minutes: 60, terminal: true, goto: 'c49_hbm_ward', ambientDuring: mild49,
        text: 'С крыши видно: Альстер белый, телебашня, шпили, дым из тысячи труб. На юге — краны порта и серая полоса Эльбы. Дальше, за ней, ничего не видно. Но ты знаешь, что там.', effects: [set49('hmd', 'roof'), w49('b_roof', true), d31(7, 45)] },
    ] }),

  U({ id: 'c49_hbm_ward', title: 'Смена', ambient: ward,
    text: [
      { text: 'Твоя первая полная смена. Вольтерс ставит тебя на восьмую и девятую палаты: двенадцать коек.' },
      { text: 'В девятую ночью привезли девочку из Харбурга, лет двенадцати: отморожены пальцы ног, сахар под тридцать. Мать сидит рядом и держит её за руку обеими руками.' },
    ],
    actions: [
      { id: 'c49_hmw_girl', label: 'Взять девочку на себя', minutes: 150, terminal: true, goto: 'c49_hbm_merle',
        text: 'Капельница, инсулин по схеме, грелки к ногам — осторожно, не горячие. Мать смотрит на каждое твоё движение. К одиннадцати сахар падает до восемнадцати. Мать отпускает руку дочери и впервые садится нормально, откинувшись.', effects: [set49('hmw', 'girl'), w49('b_girl', true), { body: 'fatigue', delta: 5 }, d31(10, 30)] },
      { id: 'c49_hmw_round', label: 'Обходить все двенадцать коек по порядку', minutes: 150, terminal: true, goto: 'c49_hbm_merle',
        text: 'Сахар, давление, капельницы, утки, расчёски, письма. Двенадцать коек — двенадцать жизней, у каждой своя просьба. К одиннадцати ты знаешь всех по именам. Вольтерс, проходя, ставит в журнал галочку против твоей фамилии.', effects: [set49('hmw', 'round'), w49('b_worked2', true), { body: 'fatigue', delta: 6 }, d31(10, 30)] },
      { id: 'c49_hmw_old', label: 'Начать со старика из восьмой', minutes: 150, terminal: true, goto: 'c49_hbm_merle',
        text: 'Старик просит открыть окно: «Ich will hören, ob es taut». Хочу услышать, тает ли. Ты открываешь. С карниза капает. Он слушает с закрытыми глазами и говорит: «Dann kommt der Frühling doch». Значит, весна всё-таки придёт.', effects: [set49('hmw', 'old'), d31(10, 30)] },
    ] }),

  U({ id: 'c49_hbm_merle', title: 'Мерле и весна', ambient: ward,
    text: [
      { text: 'В перерыв Мерле зовёт тебя в палату и закрывает дверь.' },
      { text: '— Die Ärztin sagt: ich kann am vierten mitfahren. Mit Insulin für zwei Monate. Oder hierbleiben bis März. — Она крутит браслет на запястье. — Ich will nach Hause. Aber ich will auch leben.\n\nВрач говорит: я могу поехать четвёртого. С инсулином на два месяца. Или остаться до марта. Я хочу домой. Но я хочу и жить.' },
    ],
    actions: [
      { id: 'c49_hmm_home', label: 'Сказать: «Домой. Два месяца — это много, а потом решим»', minutes: 75, terminal: true, goto: 'c49_hbm_noon',
        text: 'Мерле кивает, быстро, как будто ждала именно этого. Потом спрашивает: «Und im März?» А в марте? Ты не знаешь. Ты говоришь честно: не знаю. Она говорит: «Ich auch nicht». Я тоже. И вам обеим от этого почему-то легче.', effects: [set49('hmm', 'home'), w49('b_merle_view', 'home'), d31(11, 45)] },
      { id: 'c49_hmm_stay', label: 'Сказать: «Оставайся. Здесь врачи. Дома — нет»', minutes: 75, terminal: true, goto: 'c49_hbm_noon',
        text: 'Мерле долго смотрит на браслет. «Du hast recht. Ich hasse es, dass du recht hast». Ты права. Ненавижу, что ты права. Она обнимает тебя так крепко, что больно рёбрам.', effects: [set49('hmm', 'stay'), w49('b_merle_view', 'stay'), d31(11, 45)] },
      { id: 'c49_hmm_hers', label: 'Сказать: «Это твоё решение. Я с тобой в любом»', minutes: 75, terminal: true, goto: 'c49_hbm_noon',
        text: 'Мерле фыркает: «Das sagen alle, die sich nicht trauen». Так говорят все, кто боится. Потом мягче: «Aber danke». Но спасибо. Она открывает тетрадь со списком и смотрит на первый пункт долго-долго.', effects: [set49('hmm', 'hers'), w49('b_merle_view', 'hers'), d31(11, 45)] },
    ] }),

  U({ id: 'c49_hbm_noon', title: 'Полдень', ambient: ward,
    text: [
      { text: 'Обед: чечевичный суп с сосиской. «Linsen an Silvester — für Geld im neuen Jahr», — говорит повариха каждому. Чечевица в Сильвестр — к деньгам в новом году.' },
    ],
    actions: [
      { id: 'c49_hbn_eat', label: 'Пообедать', minutes: 45, terminal: true, goto: 'c49_checkpoint_uke',
        text: 'Суп густой и горячий. Ты ешь и думаешь: на хуторе сейчас тоже обедают, и Хенрике тоже, наверное, говорит про деньги. Где бы ни было, в Сильвестр едят одно и то же.', effects: [set49('hbn', 'eat'), ...fed49(40), { set: '$.c49_finished', value: true }, d31(13, 0)] },
      { id: 'c49_hbn_nap', label: 'Прилечь на час перед ночью', minutes: 45, terminal: true, goto: 'c49_checkpoint_uke', activity: 'rest',
        text: 'Раскладушка, одеяло, гул батареи. Ты засыпаешь сразу и видишь во сне хуторскую кухню: все за столом, и твоё место не пустое.', effects: [set49('hbn', 'nap'), { body: 'fatigue', delta: -10 }, ...fed49(20), { set: '$.c49_finished', value: true }, d31(13, 0)] },
      { id: 'c49_hbn_merle', label: 'Пообедать с Мерле в палате', minutes: 45, terminal: true, goto: 'c49_checkpoint_uke',
        text: 'Мерле считает хлебные единицы чечевицы и сердится: в справочнике чечевицы нет. Вы считаете вдвоём, на глаз. Через час сахар — семь и три. «Geschätzt und getroffen», — гордится она. Прикинула и попала.', effects: [set49('hbn', 'merle'), ...fed49(40), { set: '$.c49_finished', value: true }, d31(13, 0)] },
      { id: 'c49_hbn_sparkler', label: 'Достать бенгальский огонь и решить, когда его зажечь', when: flag('w.c49_b_sparkler'), minutes: 45, terminal: true, goto: 'c49_checkpoint_uke',
        text: 'Бенгальский огонь в кармане, рядом с печатью. Ты решаешь: в полночь, на крыше, повернувшись на юг. Глупо. Но больше у тебя нет ничего, что можно было бы туда отправить.', effects: [set49('hbn', 'sparkler'), ...fed49(20), { set: '$.c49_finished', value: true }, d31(13, 0)] },
    ] }),

  X({ id: 'c49_checkpoint_uke', title: 'Тридцать первое', location: uke49, checkpoint: 49, universal: false, camp: hosp('sleep'), ambient: ward,
    text: [{ text: 'Час дня. Гамбург, Эппендорф. Тридцать первое декабря. До Нового года одиннадцать часов.' }], actions: [] }),
];
