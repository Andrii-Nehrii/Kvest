import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { not } from './world3';
import { yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { S40, henrike40, set40, thaw40, until40, w40 } from './point40';

// Участок 40, ветка «уйти с армией» (КТ39 `go`) — больше не тупик (REWORK_PLAN.md, этап 12). Ночь в казарме → во вторник
// в пять колонна → у моста через Эльбу военная полиция разворачивает гражданских: ночной приказ, «Альберс плюс двое» вычеркнуты →
// Тобиас везёт вас обратно на южный берег, по рации — впадина пошла к Зеве → сорок километров назад по оттепели → к сумеркам
// ворота хутора и общая ночь 40-й, ничего не успев подготовить. Тобиас уходит за реку один (`w.c40_army_back`).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S40({ ...scene, for: 'any', chapter: 'ch3' });
const bridge = 'c38_bridge';
const winsen = 'c15_winsen';
const truck = { tempC: 1, outdoor: true, wet: false };
const river = { tempC: 1, outdoor: true, wet: true };
const nurse: Cond = any(v('A.c35_li', 'all'), v('B.c35_li', 'all'));

export const day40MScenes: Scene[] = [
  X({ id: 'c40_am_convoy', title: 'Колонна', location: 'c18_lueneburg', camp: { at: 'c18_lueneburg', stock: 'c3_farm_stock', rest: false }, ambient: truck,
    text: [
      { text: 'В четыре Тобиас трогает тебя за плечо. Во дворе казармы урчат моторы: двенадцать грузовиков, два «Вольфа», санитарный автобус. Небо чёрное, идёт мокрый снег.' },
      { text: 'Вас сажают в кузов третьего грузовика, к медсёстрам из госпиталя и двум механикам с семьями. Брезент хлопает на ветру. Дети спят на мешках с бельём, взрослые сидят молча.' },
      { text: 'В пять колонна трогается. За задним бортом уходит назад Люнебург, тёмный, без единого огня.' },
    ],
    actions: [
      { id: 'c40_amc_cab', label: 'Сесть ближе к кабине: оттуда слышно рацию', minutes: 150, terminal: true, goto: 'c40_am_bridge',
        text: 'Через заднее окошко кабины слышно рацию: треск, позывные, цифры. Один раз — «Garlstorf». Потом «Bewegung». Водитель делает громче, потом тише. Ты слушаешь до самого моста и не можешь сложить слова во что-то целое.',
        effects: [set40('amc', 'cab'), set40('heard_radio', true), until40(45, 7, 30)] },
      { id: 'c40_amc_child', label: 'Взять на колени чужого ребёнка: у матери на руках второй', minutes: 150, terminal: true, goto: 'c40_am_bridge',
        text: 'Мальчику года три. Он спит, привалившись к тебе, тёплый и тяжёлый, и сопит в твою куртку. Мать благодарит одними губами. Пока он спит, ты не думаешь ни о чём другом. Это лучшие два часа за неделю.',
        effects: [set40('amc', 'child'), { body: 'stress', delta: -4 }, until40(45, 7, 30)] },
      { id: 'c40_amc_back', label: 'Смотреть назад, на дорогу к хутору, пока видно', minutes: 150, terminal: true, goto: 'c40_am_bridge',
        text: 'Поворот на Йестебург проходит мимо в темноте. Ты успеваешь увидеть указатель. Потом только мокрый асфальт и фары следующего грузовика, прямо в глаза.',
        effects: [set40('amc', 'back'), until40(45, 7, 30)] },
    ] }),

  X({ id: 'c40_am_bridge', title: 'Мост', location: bridge, camp: { at: bridge, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: river,
    text: [
      { text: 'К половине восьмого колонна встаёт у моста в Гестхахте. Река внизу серая, в шуге и льдинах. На въезде шлагбаум и военная полиция в белых касках.' },
      { text: 'Проверяют каждую машину. Майор с красным от холода лицом читает фамилии по планшету. Доходит до вашего грузовика.\n\n— Albers plus zwei. — Он ведёт пальцем по строчке. — Gestrichen. Befehl von heute Nacht: Zivilisten nur mit Passierschein der Kommandantur. Keine Ausnahmen.\n\nАльберс плюс двое. Вычеркнуто. Приказ сегодняшней ночи: гражданские — только с пропуском комендатуры. Без исключений.' },
      { text: 'Тобиас бледнеет. Говорит с майором тихо и быстро, держа руку у козырька. Майор качает головой, не поднимая глаз от планшета.' },
      { when: nurse, text: 'Майор находит в списке комендатуры строчку от Хаазе.\n\n— Die Krankenschwester kann mit. Der Mann nicht.\n\nМедсестра может ехать. Мужчина — нет.' },
    ],
    actions: [
      { id: 'c40_amb_spare', label: 'Попросить Тобиаса не спорить: ему ещё служить', minutes: 30, terminal: true, goto: 'c40_am_radio',
        text: 'Тобиас смотрит на тебя, потом на майора. Отдаёт честь. Майор кивает, впервые подняв глаза.\n\n— Ich fahr euch zurück. Über die Brücke, bis Hohnstorf. Weiter darf ich nicht.\n\nОтвезу вас обратно. Через мост, до Хонсторфа. Дальше мне нельзя.',
        effects: [set40('amb', 'spare'), npc('c15_tobias', 2), until40(45, 8, 0)] },
      { id: 'c40_amb_argue', label: 'Спорить с майором самому', minutes: 30, terminal: true, goto: 'c40_am_radio',
        text: 'Ты говоришь громко. Про два места, про обещание, про то, что вы уже здесь. Двое в белых касках подходят и встают по бокам. Тобиас кладёт руку тебе на плечо, крепко, и отводит в сторону.\n\n— Lass. Er hat recht und ich hab unrecht, und das ändert nichts.\n\nОставь. Он прав, а я нет, и это ничего не меняет.',
        effects: [set40('amb', 'argue'), { body: 'stress', delta: 5 }, until40(45, 8, 0)] },
      { id: 'c40_amb_together', label: 'Сказать майору: вместе или никак', when: nurse, minutes: 20, terminal: true, goto: 'c40_am_radio',
        text: 'Майор пожимает плечами, как будто вы сами себе выбрали погоду, и вычёркивает и эту строчку. Тобиас молчит. Потом говорит тихо: «Richtig so». Правильно.',
        effects: [set40('amb', 'together'), npc('c15_tobias', 1), until40(45, 7, 50)] },
    ] }),

  X({ id: 'c40_am_radio', title: 'Хонсторф', location: bridge, camp: { at: bridge, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: river,
    onEnter: [{ give: 'c38_flares' }],
    text: [
      { text: 'Тобиас везёт вас обратно через мост в «Вольфе», один. В кабине рация, и теперь её слышно целиком.\n\n«…Garlstorf, Masse in Bewegung, Richtung Seeve, geschätzt dreihundert… Feuerwehr Jesteburg, bitte melden…»\n\nГарльсторф, масса в движении, к Зеве, примерно триста… Пожарная часть Йестебурга, ответьте…' },
      { text: 'Тобиас выключает рацию. На южном берегу, у пустой заправки в Хонсторфе, он останавливается и достаёт из-под сиденья ящик: две сигнальные ракеты, четыре армейских пайка, моток верёвки.\n\n— Für heute Nacht. Ihr wisst, wohin die gehen.\n\nНа сегодняшнюю ночь. Вы знаете, куда они идут.' },
    ],
    actions: [
      { id: 'c40_amr_hug', label: 'Обнять Тобиаса на прощание', minutes: 20, terminal: true, goto: 'c40_am_road',
        text: 'Он неловкий в объятиях, в бронежилете и с автоматом за спиной. Потом садится в «Вольф» и разворачивается к мосту. Ты смотришь, пока машина не уходит за шлагбаум. Он не оглядывается: так проще.',
        effects: [set40('amr', 'hug'), { give: 'c24_epa', qty: 2 }, npc('c15_tobias', 2), until40(45, 8, 50)] },
      { id: 'c40_amr_post', label: 'Попросить номер полевой почты', minutes: 20, terminal: true, goto: 'c40_am_road',
        text: 'Тобиас пишет номер шариковой ручкой у тебя на запястье, потому что бумаги нет. «Feldpost. Wenn sie geht». Если она работает. Номер расплывается от мокрого снега, и ты переписываешь его в телефон, пока не стёрся.',
        effects: [set40('amr', 'post'), { set: 'w.c40_tobias_post', value: true }, { give: 'c24_epa', qty: 2 }, until40(45, 8, 50)] },
      { id: 'c40_amr_go', label: 'Сказать: езжай, пока мост открыт', minutes: 10, terminal: true, goto: 'c40_am_road',
        text: '— Fahr. Bevor die auch dich nicht mehr durchlassen.\n\nЕзжай. Пока и тебя не перестали пропускать.\n\nТобиас усмехается краем рта. Ящик остаётся у твоих ног. «Вольф» уходит к мосту.',
        effects: [set40('amr', 'go'), { give: 'c24_epa', qty: 2 }, until40(45, 8, 40)] },
    ] }),

  X({ id: 'c40_am_road', title: 'Сорок километров', location: winsen, camp: { at: winsen, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: thaw40,
    text: [
      { text: 'До хутора сорок километров. До Винзена вас подбрасывает грузовик Красного Креста, пустой, назад за ранеными. Шофёр не задаёт вопросов.' },
      { text: 'От Винзена — пешком. Оттепель. Снег превратился в кашу, канавы полны до краёв, поля стоят в воде. Под Рамельсло дорога уходит под воду метров на триста.' },
      { text: 'С холма у Асхаузена видно пойму Зеве. Далеко внизу, вдоль воды, медленно движутся тёмные точки. Много. Все в одну сторону. К югу.' },
    ],
    actions: [
      { id: 'c40_amd_wade', label: 'Идти напрямик через затопленную дорогу', minutes: 330, activity: 'heavy', risky: true, terminal: true, goto: 'c40_am_home', ambientDuring: { tempC: 2, outdoor: true, wet: true },
        outcomes: [
          { id: 'ok', check: { traits: ['endurance'], difficulty: 3, uses: ['mobility'] }, text: 'Вода по колено, потом по бедро. Ледяная. Ты идёшь по разметке, которую видно под водой, и не останавливаешься. На том берегу выжимаешь носки. К трём вы уже под Йестебургом.',
            effects: [set40('amd', 'wade'), set40('wet_road', true), until40(45, 15, 0)] },
          { id: 'slip', text: 'На середине нога уходит в размытую обочину. Ты падаешь в воду по грудь, ловишь ртом воздух, выбираешься. {m:Мокрый|Мокрая} насквозь. До хутора ты идёшь быстро, чтобы не замёрзнуть, и всё равно трясёшься.',
            effects: [set40('amd', 'slip'), set40('wet_road', true), { injure: 'bruise', site: 'leftLeg', severity: 1 }, { body: 'stress', delta: 5 }, until40(45, 15, 20)] },
        ] },
      { id: 'c40_amd_dam', label: 'В обход по железнодорожной насыпи: дольше, но сухо', minutes: 390, activity: 'heavy', terminal: true, goto: 'c40_am_home',
        text: 'Насыпь идёт над водой, шпалы скользкие, но ноги сухие. Лишних восемь километров. К половине пятого вы у ворот, ноги гудят до самых бёдер.',
        effects: [set40('amd', 'dam'), { body: 'fatigue', delta: 10 }, until40(45, 16, 30)] },
      { id: 'c40_amd_wait', label: 'Ждать попутку на мосту в Винзене', minutes: 300, terminal: true, goto: 'c40_am_home', ambientDuring: thaw40,
        text: 'Два часа на мосту под мокрым снегом. Потом трактор с прицепом: фермер из Хиттфельда везёт сено в Йестебург. Вы едете на сене, мокрые снаружи и сухие внутри. Последние три километра — пешком, по воде.',
        effects: [set40('amd', 'wait'), { body: 'fatigue', delta: 4 }, until40(45, 16, 0)] },
    ] }),

  X({ id: 'c40_am_home', title: 'Ворота', camp: yard14, ambient: thaw40,
    onEnter: [w40('left_army', false), w40('army_back', true)],
    text: [
      { when: henrike40, text: 'У ворот Хенрике с лампой, хотя ещё не стемнело. Она видит вас издалека и не двигается с места, пока вы не подходите.\n\n— Ich hab gewusst, dass die euch nicht lassen.\n\nЯ знала, что вас не пустят.\n\nОна говорит это сердито. Потом всё-таки обнимает, по очереди, крепко.' },
      { when: not(henrike40), text: 'Ворота заперты на цепь. Ты стучишь, и из-за них долго спрашивают, кто.' },
      { when: ninaFarm, text: 'Нина выбегает на крыльцо в одних носках и останавливается. Делает вид, что вышла за дровами.' },
      { text: 'Ничего к ночи не готово так, как было бы готово с вами. Забор, проволока, факелы — кто что успел без вас, то и есть.' },
    ],
    actions: [
      { id: 'c40_amh_work', label: 'Сразу к делу: что ещё можно успеть до темноты', minutes: 20, terminal: true, goto: 'c40_dusk',
        text: 'Ты проходишь двор быстрым шагом. Засовы, лампы, вода в вёдрах у двери. Мало. Но уже не ноль.',
        effects: [set40('amh', 'work'), until40(45, 16, 0)] },
      { id: 'c40_amh_sit', label: 'Сесть на крыльцо на минуту: ноги не держат', minutes: 20, terminal: true, goto: 'c40_dusk',
        text: 'Ты садишься на мокрую ступеньку. Хенрике ставит рядом кружку горячего чая и уходит. Через минуту ты встаёшь. Ночь не ждёт.',
        effects: [set40('amh', 'sit'), { body: 'fatigue', delta: -3 }, until40(45, 16, 0)] },
    ] }),
];
