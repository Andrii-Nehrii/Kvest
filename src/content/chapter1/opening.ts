// Глава 1, участок 1 — утро вторника. Сцены A и B раздельны; общие события — в people.ts.
import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';

const S = (s: Scene) => s;
const knock: Cond = { flag: '$.knock' };

/** Действия с телефоном — одинаковые по механике, разные по тексту для A и B. */
function phoneActions(newsText: string): ActionDef[] {
  return [
    { id: 'alert', label: 'Прочитать ночное уведомление', minutes: 1, combinable: true, group: 'phone_alert', when: { phoneUsable: true },
      text: '«Gefahrenlage in Hamburg und Umgebung. Bleiben Sie in geschlossenen Räumen. Vermeiden Sie Kontakt mit …» — на этом текст обрывается. Ни подписи ведомства, ни ссылки. Такое приходит впервые.',
      effects: [{ learn: 'f_alert' }] },
    { id: 'news', label: 'Открыть новости', minutes: 6, combinable: true, group: 'phone_news', when: { phoneUsable: true },
      outcomes: [
        { id: 'loaded', when: { network: 'data' }, text: newsText, effects: [{ learn: 'f_hospital_attacks' }, { charge: 'phone', delta: -3 }] },
        { id: 'nonet', text: '«Keine Verbindung». Полоска сети мигает и гаснет. Ещё попытка — то же самое.', effects: [{ charge: 'phone', delta: -2 }] },
      ] },
    { id: 'call', label: 'Позвонить {partner.dat}', minutes: 2, combinable: true, group: 'phone_call', repeatable: true, when: { phoneUsable: true },
      outcomes: [
        { id: 'unreachable', when: { network: 'voice' }, text: 'Гудок. Второй. Третий… «Der gewünschte Gesprächspartner ist zurzeit nicht erreichbar.»', effects: [{ charge: 'phone', delta: -1 }] },
        { id: 'busy', text: 'Вызов срывается, не начавшись: «Netz besetzt».', effects: [{ charge: 'phone', delta: -0.5 }] },
      ] },
  ];
}

export const openingScenes: Record<string, Scene> = Object.fromEntries([
  // ───────────────────────────── A ─────────────────────────────
  S({
    id: 'a_wake', for: 'A', chapter: 'ch1', location: 'a_flat', safe: true, title: 'Вторник, 10 ноября',
    text: [
      { text: 'Ты просыпаешься не от будильника, а от тишины. Холодильник на кухне не гудит, часы на духовке погасли. Лампа у кровати щёлкает впустую.', when: { not: { visited: 'a_wake', times: 2 } } },
      { text: 'Телефон на тумбочке: заряда чуть за треть, сеть — одна полоска. На экране висит уведомление, пришедшее ночью, в 03:52.', when: { not: { visited: 'a_wake', times: 2 } } },
      { text: 'За окном мокрый ноябрьский сумрак. Фонари во дворе не горят, туман съел дома напротив. Внизу глухо хлопает дверь — и снова тихо.', when: { not: { visited: 'a_wake', times: 2 } } },
      { text: 'Ты снова в своей квартире. Тихо, холодно, пахнет остывшим кофе.', when: { visited: 'a_wake', times: 2 } },
      { text: 'В дверь стучат. Ильзе Брокман — ты узнаёшь её голос — зовёт снова и снова.', when: { all: [knock, { not: { flag: '$.ignored_ilse' } }, { not: { visited: 'a_door' } }] } },
    ],
    actions: [
      ...phoneActions('Страница грузится мучительно долго. NDR: «Nach Angriffen in mehreren Hamburger Kliniken: Polizei sieht keine Hinweise auf Terror». Под заметкой сотни комментариев: наркотики, «новый вирус», размытые видео, которые не открываются.'),
      { id: 'window', label: 'Выглянуть в окно', minutes: 3, combinable: true,
        text: 'Двор пуст. Твой Corsa стоит на месте, в каплях. У соседнего дома — скорая: двери распахнуты, мигалка выключена, в салоне горит тусклый свет. Вокруг никого. Пока ты смотришь, к ней так никто и не подходит.',
        effects: [{ learn: 'f_ambulance' }, { learn: 'f_power_out_a' }] },
      { id: 'kitchen', label: 'Проверить кухню и запасы', minutes: 5, combinable: true,
        text: 'На кухне холодно. В холодильнике — остатки с выходных; без тока он продержится несколько часов. В шкафу макароны, консервы, хлебцы. В ящике у двери — фонарик, в ванной — аптечка. Из крана течёт вода — пока.',
        effects: [{ set: '$.checked_kitchen', value: true }] },
      { id: 'dress', label: 'Одеться по погоде', minutes: 4, combinable: true,
        text: 'Джинсы, худи, тёплые носки, ботинки. В квартире уже заметно прохладнее, чем вечером.',
        effects: [{ pickup: 'jeans' }, { pickup: 'hoodie' }, { pickup: 'boots' }] },
      { id: 'door', label: 'Подойти к двери', minutes: 1, terminal: true, goto: 'a_door',
        when: { all: [knock, { not: { flag: '$.ignored_ilse' } }, { not: { visited: 'a_door' } }] } },
      { id: 'ignore', label: 'Не подходить. Замереть и слушать', minutes: 10, risky: false,
        when: { all: [knock, { not: { flag: '$.ignored_ilse' } }, { not: { visited: 'a_door' } }] },
        text: 'Стук продолжается ещё минуту. Потом голос срывается на всхлип, шаги удаляются вниз. Хлопает дверь Брокманов.',
        effects: [{ set: '$.ignored_ilse', value: true }, { npc: 'ilse', trust: -10, remember: '$:ignored' }, { body: 'stress', delta: 6 }] },
      { id: 'go_down', label: 'Всё-таки спуститься к Брокманам', minutes: 2, terminal: true, goto: 'a_brockmann',
        when: { all: [knock, { any: [{ flag: '$.ignored_ilse' }, { flag: '$.left_ilse' }] }] } },
      { id: 'leave', label: 'Выйти из квартиры', minutes: 2, terminal: true, goto: 'a_tbc' },
    ],
  }),
  S({
    id: 'a_door', for: 'A', chapter: 'ch1', location: 'a_flat', title: 'Глазок',
    text: [{ text: 'В глазок — искажённый круг площадки. Ильзе Брокман, соседка снизу: халат поверх свитера, в руке фонарик, светит себе под ноги. Волосы растрёпаны. Она одна. Оглядывается на лестницу вниз, будто боится, что оттуда кто-то поднимется.' }],
    actions: [
      { id: 'ask', label: 'Спросить через дверь, что случилось', minutes: 3,
        text: '— Герд… у него жар с вечера, он бредит. Телефон не ловит, сто двенадцать всё время занято. Вы же на машине? Пожалуйста. Это пять минут до больницы.',
        effects: [{ learn: 'f_gerd_fever' }, { set: '$.ilse_asked', value: true }] },
      { id: 'open', label: 'Открыть дверь', minutes: 1, terminal: true, goto: 'a_ilse' },
      { id: 'back', label: 'Не открывать и отойти от двери', minutes: 1, terminal: true, goto: 'a_wake',
        text: 'Ты отступаешь в темноту прихожей. Ильзе стучит ещё раз, тише, — и уходит.',
        effects: [{ set: '$.ignored_ilse', value: true }, { npc: 'ilse', trust: -12, remember: '$:ignored' }] },
    ],
  }),
  S({
    id: 'a_ilse', for: 'A', chapter: 'ch1', location: 'a_stairs', title: 'Ильзе',
    text: [
      { text: 'Ильзе говорит быстро, сбиваясь на шёпот. Герд с вечера горит — тридцать девять с лишним, градусник старый, ртутный. Ночью он бормотал что-то бессвязное и не узнал её, когда она включила ночник. «Вы же на машине… Krankenhaus — это пять минут. Пожалуйста.»' },
      { text: 'Она смотрит то на тебя, то на лестницу вниз.', when: { not: { flag: '$.promised_drive' } } },
    ],
    actions: [
      { id: 'ask_more', label: 'Расспросить, что ещё случилось', minutes: 5, combinable: true,
        text: '— Он с субботы был сам не свой. Позавчера в порту какой-то пьяный его укусил, представляете? До крови. Ему перевязали в медпункте, сказали — ерунда. А вчера вечером его затрясло…',
        effects: [{ learn: 'f_gerd_wound' }, { npc: 'ilse', trust: 3 }] },
      { id: 'advice', label: 'Посоветовать 116117 и сбивать температуру', minutes: 3, combinable: true,
        text: '— Сто шестнадцать сто семнадцать я тоже набирала… — Ильзе кивает, но по глазам видно: она ждала не совета.',
        effects: [{ npc: 'ilse', trust: 2 }] },
      { id: 'give_pills', label: 'Отдать ей пару таблеток ибупрофена', minutes: 2, combinable: true, when: { has: 'ibuprofen', qty: 2 },
        text: 'Ильзе сжимает таблетки в ладони, как что-то ценное. — Danke. Вы не представляете…',
        effects: [{ take: 'ibuprofen', qty: 2 }, { npc: 'ilse', trust: 8, remember: '$:gave_pills' }] },
      { id: 'look', label: 'Спуститься и посмотреть на Герда', minutes: 2, terminal: true, goto: 'a_brockmann' },
      { id: 'promise', label: 'Пообещать отвезти их в больницу', minutes: 1, combinable: true,
        text: 'Ильзе хватает тебя за рукав. — Я сейчас его одену. Сейчас.',
        effects: [{ set: '$.promised_drive', value: true }, { npc: 'ilse', trust: 15, remember: '$:promised_drive' }] },
      { id: 'refuse', label: 'Сказать, что помочь не можешь', minutes: 2, terminal: true, goto: 'a_wake',
        text: 'Ильзе молча кивает, будто ждала этого, и уходит вниз, держась за перила.',
        effects: [{ set: '$.left_ilse', value: true }, { npc: 'ilse', trust: -15, remember: '$:refused' }] },
    ],
  }),
  S({
    id: 'a_brockmann', for: 'A', chapter: 'ch1', location: 'a_brockmann', title: 'Квартира Брокманов',
    text: [
      { text: 'У Брокманов душно и пахнет уксусом — Ильзе обтирала мужа. Герд лежит на диване под двумя одеялами, лицо серое, на лбу испарина. Глаза открыты, но смотрят мимо. На левом предплечье — свежая марлевая повязка, сквозь неё проступает желтоватое пятно.' },
      { text: 'Когда ты входишь, он резко поворачивает голову на звук шагов — и щурится от фонарика, как от прожектора.' },
    ],
    actions: [
      { id: 'examine', label: 'Осмотреть повязку на руке', minutes: 4, combinable: true,
        text: 'Ты осторожно отводишь край марли. Полукруг следов зубов, края вспухшие, кожа вокруг горячая и багровая. Герд дёргает рукой и что-то бормочет — не по-немецки, не по-русски, просто звуки.',
        effects: [{ learn: 'f_gerd_wound' }, { body: 'stress', delta: 5 }] },
      { id: 'talk', label: 'Заговорить с Гердом', minutes: 3, combinable: true,
        text: '— Herr Brockmann? Вы меня слышите? — Пауза. Потом хрипло, с трудом: «Licht… aus». Он отворачивается к стене. Ильзе гасит фонарик, и в темноте его дыхание кажется громче.',
        effects: [{ body: 'stress', delta: 4 }] },
      { id: 'carry', label: 'Помочь довести его до машины', minutes: 15, activity: 'moderate', terminal: true, goto: 'a_tbc',
        text: 'Герд тяжёлый и неуклюжий, ноги его почти не слушаются. Ильзе семенит сзади с сумкой.',
        effects: [{ set: '$.driving_brockmanns', value: true }] },
      { id: 'leave', label: 'Сказать, что вернёшься, и подняться к себе', minutes: 2, terminal: true, goto: 'a_wake',
        effects: [{ set: '$.left_ilse', value: true }] },
    ],
  }),
  S({
    id: 'a_tbc', for: 'A', chapter: 'ch1', location: 'a_stairs', title: 'Продолжение следует',
    text: [{ text: 'Здесь бета пока обрывается: следующие сцены в работе. Можно осмотреть вещи и состояние — всё, что ты успел сделать, сохранено.' }],
    actions: [],
  }),

  // ───────────────────────────── B ─────────────────────────────
  S({
    id: 'b_wake', for: 'B', chapter: 'ch1', location: 'b_flat', safe: true, title: 'Вторник, 10 ноября',
    text: [
      { text: 'Ты просыпаешься от будильника Мерле за стеной: он пищит, пищит и пищит — и никто его не выключает. Потом стихает.', when: { not: { visited: 'b_wake', times: 2 } } },
      { text: 'Телефон: заряда почти две трети. Два уведомления: NINA, 03:52 — обрывок экстренного сообщения. И сообщение от Мерле, отправленное в 01:14: «bin wach, die sirenen hören nicht auf 😬».', when: { not: { visited: 'b_wake', times: 2 } } },
      { text: 'Батарея тёплая, свет включается. Где-то за крышами снова воет сирена — к ней присоединяется вторая.', when: { not: { visited: 'b_wake', times: 2 } } },
      { text: 'Ты у себя в комнате. За стеной тихо бормочет радио.', when: { visited: 'b_wake', times: 2 } },
      { text: 'С площадки доносится шорох, потом тяжёлый удар о дверь напротив. Потом — тишина.', when: { all: [{ flag: '$.okafor_knock' }, { not: { visited: 'b_hall' } }] } },
    ],
    actions: [
      ...phoneActions('Сайт NDR открывается с третьей попытки. «Angriffe in mehreren Hamburger Kliniken — Polizei: Lage unter Kontrolle». Ниже — прямая трансляция, которая так и не загружается, и сотни комментариев: наркотики, бешенство, «нам опять что-то не договаривают».'),
      { id: 'window', label: 'Выглянуть на улицу', minutes: 3, combinable: true,
        text: 'Внизу по мокрому асфальту медленно проезжает полицейская машина — без сирены, но с мигалкой, будто патрульные что-то высматривают. У киоска на углу уже трое с пакетами; кто-то тащит упаковку воды.',
        effects: [{ learn: 'f_sirens' }, { set: '$.saw_kiosk', value: true }] },
      { id: 'shower', label: 'Принять горячий душ', minutes: 15, combinable: true,
        text: 'Горячая вода. Пока она есть, это кажется самой обычной вещью на свете.',
        effects: [{ body: 'stress', delta: -15 }, { set: '$.showered', value: true }] },
      { id: 'dress', label: 'Одеться', minutes: 4, combinable: true,
        text: 'Джинсы, худи, кроссовки. Волосы — в хвост.',
        effects: [{ pickup: 'jeans' }, { pickup: 'hoodie' }, { pickup: 'sneakers' }] },
      { id: 'peephole', label: 'Посмотреть в глазок', minutes: 1, terminal: true, goto: 'b_hall',
        when: { all: [{ flag: '$.okafor_knock' }, { not: { visited: 'b_hall' } }] } },
      { id: 'kitchen', label: 'Пойти на кухню к Мерле', minutes: 1, terminal: true, goto: 'b_kitchen' },
    ],
  }),
  S({
    id: 'b_kitchen', for: 'B', chapter: 'ch1', location: 'b_flat', calm: true, title: 'Кухня',
    text: [
      { text: 'Мерле сидит на подоконнике в пледе, с кружкой; на коленях — глюкометр. Радио на холодильнике бормочет NDR 90,3: «…die Lage in mehreren Kliniken… Polizei…». Она вздрагивает, когда ты входишь, и смеётся над собой.', when: { not: { visited: 'b_kitchen', times: 2 } } },
      { text: '— Ты тоже не спала? Я — вообще. В чате дома пишут, что на соседней улице кого-то увезли в наручниках, а он кусался. Кусался, представляешь?', when: { not: { visited: 'b_kitchen', times: 2 } } },
      { text: 'Мерле на кухне, радио бормочет новости.', when: { visited: 'b_kitchen', times: 2 } },
      { text: 'С площадки доносится шорох, потом тяжёлый удар о дверь напротив.', when: { all: [{ flag: '$.okafor_knock' }, { not: { visited: 'b_hall' } }] } },
    ],
    actions: [
      { id: 'talk', label: 'Расспросить, что она слышала', minutes: 10, combinable: true,
        text: '— Сирены с полуночи. В чате пишут разное: что в UKE кто-то напал на врачей, что в Wilhelmsburg перекрыли улицу, что это наркотик какой-то. Мама звонила в шесть, сказала — сидеть дома. — Мерле крутит кружку. — Я хочу к ним, в Ahrensburg. Но не одна.',
        effects: [{ learn: 'f_sirens' }, { set: '$.merle_plan_known', value: true }, { npc: 'merle', trust: 3 }] },
      { id: 'radio', label: 'Сделать радио погромче и послушать', minutes: 15, combinable: true,
        text: 'Диктор говорит ровно, как всегда: «нападения в нескольких клиниках», «полиция призывает сохранять спокойствие», «Сенат проведёт пресс-конференцию». Между новостями — музыка, как будто ничего не случилось.',
        effects: [{ learn: 'f_hospital_attacks' }] },
      { id: 'fridge', label: 'Заглянуть в холодильник', minutes: 2, combinable: true,
        text: 'Яйца, молоко, остатки пасты. В дверце — три инсулиновые ручки Мерле. «Это где-то на девять дней», — говорит она, заметив твой взгляд, и отворачивается к окну.',
        effects: [{ learn: 'f_merle_insulin' }] },
      { id: 'breakfast', label: 'Сделать завтрак на двоих', minutes: 20, combinable: true, group: 'meal',
        text: 'Яичница, тосты, чай. Мерле ест, не глядя в тарелку, но впервые за утро улыбается по-настоящему.',
        effects: [{ pickup: 'eggs' }, { take: 'eggs' }, { body: 'hunger', delta: -25 }, { body: 'thirst', delta: -10 }, { npc: 'merle', trust: 5 }] },
      { id: 'plan', label: 'Обсудить, что делать сегодня', minutes: 10, combinable: true, requiresDone: ['talk'],
        text: '— Можно на S-Bahn до Poppenbüttel, а там автобус, — Мерле уже открывает карту. — Если поезда ходят. Или подождать, пока скажут что-то нормальное. Ты как думаешь?',
        effects: [{ npc: 'merle', trust: 3 }, { set: '$.discussed_plan', value: true }] },
      { id: 'peephole', label: 'Выйти в прихожую и посмотреть в глазок', minutes: 1, terminal: true, goto: 'b_hall',
        when: { all: [{ flag: '$.okafor_knock' }, { not: { visited: 'b_hall' } }] } },
      { id: 'room', label: 'Вернуться к себе в комнату', minutes: 1, terminal: true, goto: 'b_wake' },
    ],
  }),
  S({
    id: 'b_hall', for: 'B', chapter: 'ch1', location: 'b_flat', title: 'Глазок',
    text: [{ text: 'Через глазок — площадка в жёлтом свете лампы на таймере. У двери напротив на полу сидит Окафор, сосед: больничная форма под расстёгнутой курткой, голова откинута к стене, ключи рядом на коврике. На рукаве — бурое пятно, большое. Он дышит тяжело, но взгляд осмысленный — прямо на твою дверь, будто чувствует, что ты смотришь.' }],
    actions: [
      { id: 'ask', label: 'Спросить через дверь, всё ли в порядке', minutes: 2,
        text: '— Всё хорошо, — голос хриплый. — Это не моя кровь. Просто… очень длинная смена. И… не выходите сегодня без нужды, ладно?',
        effects: [{ set: '$.okafor_warned', value: true }, { npc: 'okafor', trust: 3 }] },
      { id: 'open', label: 'Открыть и выйти к нему', minutes: 1, terminal: true, goto: 'b_okafor' },
      { id: 'back', label: 'Отойти от двери', minutes: 1, terminal: true, goto: 'b_kitchen',
        text: 'Когда ты снова заглядываешь в глазок через минуту, площадка пуста. Дверь напротив закрыта.' },
    ],
  }),
  S({
    id: 'b_okafor', for: 'B', chapter: 'ch1', location: 'b_stairs', title: 'Окафор',
    text: [{ text: 'Окафор поднимается, опираясь на стену, и сразу делает шаг назад, чтобы не стоять близко. — Простите. Не хотел пугать. Я… просто сел на минуту и, кажется, уснул. Пятно на рукаве вблизи пахнет железом.' }],
    actions: [
      { id: 'coffee', label: 'Предложить ему кофе', minutes: 15, combinable: true, group: 'okafor_main',
        text: 'Он долго держит чашку обеими руками, прежде чем заговорить. — Ночью в приёмное привезли троих с одного адреса. Все с температурой, все… не в себе. Один укусил санитара. Потом ещё двое — коллег. Мы думали — наркотик. Под утро в отделении закрыли двери. — Он ставит чашку. — Я не знаю, что это. И мне это не нравится.',
        effects: [{ learn: 'f_okafor_night' }, { npc: 'okafor', trust: 10, remember: '$:coffee' }] },
      { id: 'insulin', label: 'Спросить, как хранить инсулин, если пропадёт ток', minutes: 5, combinable: true, when: { knows: 'f_merle_insulin' },
        text: '— Открытую ручку — при комнатной температуре, до четырёх недель. Запасные — в холоде, но не заморозить. Если тока не будет — прохладный подвал, термосумка, мокрое полотенце. Главное — не на батарее и не на солнце.',
        effects: [{ set: '$.knows_insulin_storage', value: true }, { npc: 'okafor', trust: 3 }] },
      { id: 'keys', label: 'Помочь ему открыть дверь', minutes: 2, combinable: true, group: 'okafor_main',
        text: 'Ключ находит замок со второго раза. — Danke, — Окафор задерживается на пороге. — Если что-то понадобится — стучите. Но, пожалуйста, сегодня не ходите в больницу. Никакую.',
        effects: [{ npc: 'okafor', trust: 5 }] },
      { id: 'back', label: 'Вернуться в квартиру', minutes: 1, terminal: true, goto: 'b_tbc' },
    ],
  }),
  S({
    id: 'b_tbc', for: 'B', chapter: 'ch1', location: 'b_flat', title: 'Продолжение следует',
    text: [{ text: 'Здесь бета пока обрывается: следующие сцены в работе. Можно осмотреть вещи и состояние — всё, что ты успела сделать, сохранено.' }],
    actions: [],
  }),
].map((s) => [s.id, s]));
