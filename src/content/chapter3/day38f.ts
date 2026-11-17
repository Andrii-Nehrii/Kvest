import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { any, ninaFarm, v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { brothersCome, eldersCome, oleHome33 } from './point33';
import { bNorth36 } from './point36';
import {
  A38, S38, tractorRuns, cab38, frost38, hall38, henrike38, kasiaDeparts38, merleComes38, northPartner38, parentsCome38, send38, set38, until38, w38, winsen38,
} from './point38';

// Участок 38, кто остаётся: A — хутор снаружи (Брандт, Зеве, сосед, комната для Мерле, армейские грузовики на дороге, Оле);
// B (только если не едут оба) — хутор внутри и пункт Зандер. Общий обед. Вечером — встреча колонны в Винзене (если договорились)
// или ожидание дома.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S38({ ...scene, for: 'any', chapter: 'ch3' });
const winCamp = { at: winsen38, stock: 'c3_farm_stock', rest: false as const };
const jestCamp = { at: 'c16_jesteburg', stock: 'c3_farm_stock', rest: false as const };
const invited: Cond = any(v('w.c36_merle', 'all'), v('w.c36_merle', 'merle'));
const toEvening = (a: string) => [{ id: 'w', when: send38('both'), goto: 'c38_w_go' }, { id: 'h', goto: a }];
const carOk: Cond = all({ has: 'car_keys' }, { itemAt: 'opel_corsa', place: 'hof_luedemann' }, { fuelFor: 'opel_corsa', km: 34 });

export const day38FScenes: Scene[] = [
  // ═════════════ A на хуторе ═════════════
  X({ id: 'c38_fa_quiet', title: 'Хутор без них', camp: yard14, ambient: frost38,
    text: [
      { text: 'Половина девятого. Небо белое, без солнца. Во дворе тихо: те, кто уехал, оставили после себя пустоту, которую слышно.' },
      { when: northPartner38, text: 'Она сейчас где-то у моста. Или уже за ним.' },
      { when: henrike38, text: 'Хенрике стоит у сарая и смотрит на дорогу, хотя по ней никто не едет.' },
    ],
    actions: [
      { id: 'c38_faq_henrike', label: 'Подойти к Хенрике', when: henrike38, minutes: 45, terminal: true, goto: 'c38_fa_milk', ambientDuring: frost38,
        text: 'Вы стоите рядом и смотрите на дорогу вместе. Хенрике говорит.\n\n— So war es, als Ole zur Bundeswehr ging. Man steht und guckt.\n\nТак было, когда Оле уходил в армию. Стоишь и смотришь. Потом она хлопает тебя по плечу и идёт в дом.', effects: [set38('faq', 'henrike'), npc('henrike', 1), until38(9, 15)] },
      { id: 'c38_faq_work', label: 'Сразу взяться за дела: дрова, вода', minutes: 45, activity: 'moderate', terminal: true, goto: 'c38_fa_milk', ambientDuring: frost38,
        text: 'Колун, вёдра, снова колун. Работа съедает время. Через час ты замечаешь, что ни разу не посмотрел{m:|а} на часы.', effects: [set38('faq', 'work'), { body: 'fatigue', delta: 6 }, until38(9, 30)] },
      { id: 'c38_faq_rest', label: 'Посидеть на кухне с кофе', minutes: 45, terminal: true, goto: 'c38_fa_milk',
        text: 'Кофе остыл ещё в пять утра. Ты пьёшь холодный и смотришь в окно. Это тоже нужно иногда.', effects: [set38('faq', 'rest'), { body: 'stress', delta: -3 }, until38(9, 30)] },
    ] }),

  X({ id: 'c38_fa_milk', title: 'Корова', camp: yard14, safe: false, ambient: { tempC: 6, outdoor: false, wet: false },
    text: [
      { text: 'Корова мычит в хлеву: её не подоили. Обычно доит Хенрике или кто-то из женщин. Сегодня Хенрике возится с печью, а рук не хватает.' },
      { when: henrike38, text: 'Хенрике кричит из кухни.\n\n— Kannst du das? Von links, und nicht zögern!\n\nСможешь? Слева, и не тянуть!' },
    ],
    actions: [
      { id: 'c38_fam_milk', label: 'Сесть доить самому', minutes: 40, risky: true, terminal: true, goto: 'c38_fa_brandt',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'technical'], difficulty: 3, uses: ['focus'] },
            text: 'Сначала не выходит ничего, потом струйка, потом ровнее. Корова косится, но стоит. Полподойника. Хенрике заглядывает и кивает.\n\n— Na also.\n\nНу вот.',
            effects: [set38('fam', 'milk'), w38('a_milked', true), npc('henrike', 1), until38(10, 0)] },
          { id: 'kick',
            text: 'Корова переступает и бьёт задней ногой. Подойник летит, копыто задевает бедро. Ты сидишь в соломе, молоко растекается вокруг. Хенрике приходит и доит сама, не говоря ни слова.',
            effects: [set38('fam', 'kick'), { injure: 'bruise', site: 'leftLeg', severity: 1 }, { body: 'stress', delta: 4 }, until38(10, 0)] },
        ] },
      { id: 'c38_fam_nina', label: 'Позвать Нину: она видела, как доят', when: ninaFarm, minutes: 40, terminal: true, goto: 'c38_fa_brandt',
        text: 'Нина садится на скамеечку с видом знатока и доит медленно, но уверенно. Ты держишь хвост. Она командует тобой, как Хенрике. Подойник полный.', effects: [set38('fam', 'nina'), npc('c7_nina', 1), until38(10, 0)] },
      { id: 'c38_fam_feed', label: 'Дать сена и воды, доить пусть Хенрике', minutes: 30, terminal: true, goto: 'c38_fa_brandt',
        text: 'Сено, вода, свежая солома. Корова жуёт и успокаивается. Хенрике приходит через полчаса и доит, ворча, что пальцы не гнутся.', effects: [set38('fam', 'feed'), until38(9, 50)] },
    ] }),

  X({ id: 'c38_fa_kids', title: 'Просьба', camp: yard14, ambient: frost38,
    text: [
      { when: all(ninaFarm, v('w.c36_nina_bike', 'farm')), text: 'Нина выкатывает из сеней свой синий велосипед: цепь слетела, заднее колесо спущено. «Почини, а? Чтобы после пятнадцатого ездить в школу».' },
      { when: all(ninaFarm, not(v('w.c36_nina_bike', 'farm'))), text: 'Нина зовёт тебя к пруду за сараем: лёд толстый, можно кататься. «Только посмотри, крепкий ли. Хенрике не пускает одну».' },
      { when: not(ninaFarm), text: 'Эва просит заделать окно в комнате стариков: из щели под рамой дует так, что гаснет свеча.' },
    ],
    actions: [
      { id: 'c38_fak_fix', label: 'Сделать, о чём просят', minutes: 30, activity: 'light', terminal: true, goto: 'c38_fa_room', ambientDuring: frost38,
        text: 'Полчаса — и готово. Цепь на месте, или лёд проверен топором у берега, или щель забита паклей. Тебе говорят «спасибо» так, будто ты сделал{m:|а} что-то большое.', effects: [set38('fak', 'fix'), { if: { npc: 'c7_nina', alive: true }, then: [{ npc: 'c7_nina', trust: 1 }] }, until38(14, 45)] },
      { id: 'c38_fak_later', label: 'Сказать: потом, сейчас некогда', minutes: 10, terminal: true, goto: 'c38_fa_room',
        text: 'Тебе кивают и уходят. Без обиды. Почти без обиды.', effects: [set38('fak', 'later'), until38(14, 25)] },
      { id: 'c38_fak_teach', label: 'Показать, как сделать самому', minutes: 40, terminal: true, goto: 'c38_fa_room', ambientDuring: frost38,
        text: 'Ты показываешь, тебе повторяют. Дольше, чем сделать самому. Зато в следующий раз позовут не тебя.', effects: [set38('fak', 'teach'), until38(14, 55)] },
    ] }),

  X({ id: 'c38_fa_brandt', title: 'Новости из Йестебурга', camp: yard14, ambient: frost38,
    text: [
      { text: 'К воротам подъезжает на тракторе Лукас. Брандт прислал: армия ночью сняла пост у съезда к Гарльсторфу. Раньше времени. Солдаты уехали на север, оставили бетонные блоки и бочку из-под костра.' },
      { text: '— Brandt fragt, ob ihr ab morgen Nacht schon Wache macht. Nicht erst ab dem Fünfzehnten.\n\nБрандт спрашивает, будете ли вы дежурить уже с завтрашней ночи. Не с пятнадцатого.' },
    ],
    actions: [
      { id: 'c38_fab_yes', label: 'Сказать: да, с завтрашней ночи', minutes: 30, terminal: true, goto: 'c38_fa_seeve', ambientDuring: frost38,
        text: 'Лукас записывает в блокнот: «Lüdemann — ab Freitag». С пятницы. Он кивает и разворачивает трактор. Ты стоишь у ворот и думаешь, кто будет спать днём.', effects: [set38('fab', 'yes'), w38('a_watch_early', true), until38(10, 30)] },
      { id: 'c38_fab_later', label: 'Сказать: решим вечером, когда все вернутся', minutes: 30, terminal: true, goto: 'c38_fa_seeve', ambientDuring: frost38,
        text: '— Gut. Morgen früh sag ich Brandt Bescheid. — Лукас уезжает. Хорошо. Завтра утром скажу Брандту.', effects: [set38('fab', 'later'), until38(10, 30)] },
      { id: 'c38_fab_ask', label: 'Спросить, что видели у съезда', minutes: 30, terminal: true, goto: 'c38_fa_post', ambientDuring: frost38,
        text: 'Лукас мнётся. «Spuren. Im Schnee. Vom Tal zur Straße. Langsam, aber viele». Следы. В снегу. Из впадины к дороге. Медленные, но много. Он не смотрит тебе в глаза.', effects: [set38('fab', 'ask'), w38('tracks_known', true), until38(10, 30)] },
    ] }),

  X({ id: 'c38_fa_post', title: 'Брошенный пост', location: 'c7_farm_lane', camp: yard14, safe: false, ambient: frost38,
    text: [
      { text: 'Ты едешь с Лукасом на тракторе к съезду у Гарльсторфа. Пост пустой: бетонные блоки, бочка с золой, под мостом автобана — чёрный круг от костра.' },
      { text: 'Следы в снегу идут из лесополосы к дороге и обратно. Под мостом в тени что-то лежит. Или кто-то.' },
      { text: 'На блоке оставлен армейский ящик с откинутой крышкой: в нём три сигнальные ракеты и пачка мешков для песка.' },
    ],
    actions: [
      { id: 'c38_fap_flares', label: 'Забрать ракеты и мешки и сразу назад', minutes: 60, terminal: true, goto: 'c38_fa_neighbor', ambientDuring: frost38,
        text: 'Ракеты — в карман куртки, мешки — в кабину. Лукас разворачивает трактор, не дожидаясь, пока ты сядешь как следует. Под мостом так никто и не шевелится.', effects: [set38('fap', 'flares'), { give: 'c38_flares', qty: 3 }, until38(11, 30)] },
      { id: 'c38_fap_look', label: 'Подойти посмотреть, что под мостом', minutes: 60, risky: true, terminal: true, goto: 'c38_fa_neighbor', ambientDuring: frost38,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'agility'], difficulty: 3, uses: ['focus'] },
            text: 'Под мостом обращённый: сидит, прислонившись к опоре, иней на лице. Не двигается. Мёртв или почти. Ты отходишь, не поворачиваясь спиной. Ракеты ты всё-таки забираешь.',
            effects: [set38('fap', 'look'), { give: 'c38_flares', qty: 3 }, w38('bridge_seen', true), until38(11, 30)] },
          { id: 'grab',
            text: 'Ты подходишь, и он поднимает голову. Медленно, но рука хватает тебя за штанину. Ты бьёшь ногой, вырываешься, падаешь на бетон локтем. Лукас кричит от трактора. Ты бежишь. Ракеты остаются на блоке.',
            effects: [set38('fap', 'grab'), { injure: 'bruise', site: 'rightArm', severity: 1 }, { body: 'stress', delta: 8 }, until38(11, 30)] },
        ] },
      { id: 'c38_fap_mark', label: 'Ничего не трогать, отметить следы для Брандта', minutes: 50, terminal: true, goto: 'c38_fa_neighbor', ambientDuring: frost38,
        text: 'Ты рисуешь на обороте листа: пост, мост, откуда следы и куда. Лукас отвезёт Брандту. Ящик остаётся на блоке: пусть возьмёт дружина.', effects: [set38('fap', 'mark'), w38('tracks_marked', true), until38(11, 20)] },
    ] }),

  X({ id: 'c38_fa_seeve', title: 'Зеве', camp: yard14, safe: false, ambient: frost38,
    text: [
      { text: 'Ты идёшь к ручью за сараем. Лёд серый, в снегу. На берегу лесополосы следы: не звериные.' },
      { when: any(flag('w.c37_reeds_marked'), flag('w.c37_frozen_dead')), text: 'Палка с красной тряпкой на месте. Вмёрзший у камышей стоит так же. Не двигался.' },
      { when: v('w.c37_alarm', 'cans'), text: 'Проволока с банками поперёк тропы цела. Банки в инее.' },
    ],
    actions: [
      { id: 'c38_fas_tracks', label: 'Пройти по следам до лесополосы', minutes: 40, risky: true, terminal: true, goto: 'c38_fa_neighbor', ambientDuring: frost38,
        outcomes: [
          { id: 'ok', check: { traits: ['stealth', 'agility'], difficulty: 3, uses: ['focus'] },
            text: 'Следы идут вдоль ручья, путаются, кружат. Под старой ивой — лёжка: снег продавлен, рядом пятна. Кто-то здесь лежал ночью и ушёл. В сторону впадины. Ты возвращаешься тем же путём, след в след.',
            effects: [set38('fas', 'tracks'), w38('lair_found', true), until38(11, 30)] },
          { id: 'ice',
            text: 'Следы уводят на лёд. Ты делаешь шаг, другой, и лёд у берега ломается: ты по колено в воде. Выбираешься на четвереньках. До дома бегом, штанина колом. Следы так и остались непрочитанными.',
            effects: [set38('fas', 'ice'), { body: 'stress', delta: 5 }, { body: 'fatigue', delta: 5 }, until38(11, 30)] },
        ] },
      { id: 'c38_fas_mark', label: 'Не ходить: отметить место и рассказать Брандту', minutes: 30, terminal: true, goto: 'c38_fa_neighbor', ambientDuring: frost38,
        text: 'Ты втыкаешь ещё одну палку там, где следы выходят к ручью. Две метки на берегу. Вечером будет что сказать.', effects: [set38('fas', 'mark'), w38('tracks_marked', true), until38(11, 20)] },
      { id: 'c38_fas_cans', label: 'Натянуть ещё одну проволоку с банками, ближе к сараю', minutes: 40, activity: 'moderate', terminal: true, goto: 'c38_fa_neighbor', ambientDuring: frost38,
        text: 'Вторая линия, ближе к дому. Если первую пройдут, эту не пройдут тихо. Пальцы немеют от проволоки.', effects: [set38('fas', 'cans'), w38('second_wire', true), until38(11, 30)] },
    ] }),

  X({ id: 'c38_fa_neighbor', title: 'Сосед', camp: yard14, ambient: frost38,
    text: [
      { text: 'К воротам подходит молодая женщина с ребёнком в санках. Дочь соседа с насыпи. Её привезли из Ханштедта вчера вечером.' },
      { text: '— Haben Sie Milch? Für die Kleine. Unsere Ziege gibt nichts mehr. Ich kann nähen. Oder Holz hacken.\n\nУ вас есть молоко? Для малышки. Наша коза больше не доится. Я умею шить. Или рубить дрова.' },
    ],
    actions: [
      { id: 'c38_fan_milk', label: 'Налить литр молока просто так', when: henrike38, minutes: 30, terminal: true, goto: 'c38_f_lunch', ambientDuring: frost38,
        text: 'Хенрике выносит банку. Женщина хочет что-то сказать и не может. Ребёнок в санках тянет руки к банке. «Morgen wieder?» Завтра опять? Хенрике кивает: «Morgen wieder».', effects: [set38('fan', 'milk'), w38('milk_neighbor', true), npc('henrike', 1), until38(12, 30)] },
      { id: 'c38_fan_trade', label: 'Молоко за работу: пусть зашьёт куртки', minutes: 30, terminal: true, goto: 'c38_f_lunch', ambientDuring: frost38,
        text: 'Женщина садится у печки с иголкой и двумя порванными куртками. Шьёт быстро, ровно. Через час уходит с банкой молока. Куртки как новые.', effects: [set38('fan', 'trade'), w38('jackets_fixed', true), until38(12, 30)] },
      { id: 'c38_fan_no', label: 'Сказать: самим мало', minutes: 20, terminal: true, goto: 'c38_f_lunch', ambientDuring: frost38,
        text: 'Женщина кивает и уходит, таща санки. Ребёнок оборачивается и смотрит на тебя, пока они не скрываются за насыпью. Хенрике на крыльце не говорит ничего.', effects: [set38('fan', 'no'), npc('henrike', -1, 'c38_refused_milk'), until38(12, 20)] },
    ] }),

  X({ id: 'c38_f_lunch', title: 'Обед', camp: kitchen14, onEnter: [until38(12, 30)],
    text: [
      { text: 'Обед в полупустой кухне. Суп, хлеб. Стул Каси пустой, стул Павла давно пустой.' },
      { when: oleHome33, text: 'Оле ест молча и смотрит на часы над дверью: колонна сейчас в Аренсбурге.' },
      { when: evaHere, text: 'Эва чистит картошку на ужин: на всех, кто вернётся, и ещё на троих. На всякий случай.' },
      { when: brothersCome, text: 'Керем рассказывает, что на рынке в Винзене бензин меняли на сигареты: литр за пачку.' },
    ],
    actions: [
      { id: 'c38_fl_eat', label: 'Есть со всеми', minutes: 45, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_radio' }, { id: 'b', goto: 'c38_fb_bread' }], ...tableOnly,
        text: 'Суп с картошкой и луком. Ты ешь и слушаешь, как тикают часы. Половина первого. Ещё шесть часов.', effects: [set38('fl', 'eat'), meal('eat'), until38(13, 30)] },
      { id: 'c38_fl_bread', label: 'Перекусить хлебом на ходу', minutes: 30, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_radio' }, { id: 'b', goto: 'c38_fb_bread' }],
        text: 'Кусок хлеба с салом, кружка чая. Сесть некогда.', effects: [set38('fl', 'bread'), { body: 'hunger', delta: -8 }, until38(13, 30)] },
      { id: 'c38_fl_save', label: 'Отложить свою порцию тем, кто вернётся голодным', minutes: 45, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_radio' }, { id: 'b', goto: 'c38_fb_bread' }], ...tableOnly,
        text: 'Ты переливаешь суп в банку и ставишь на холодную полку. Вечером его разогреют. Тебе — хлеб с салом.', effects: [set38('fl', 'save'), meal('pack'), until38(13, 30)] },
      { id: 'c38_fl_talk', label: 'Спросить у всех: где кто будет спать, если приедет Мерле', when: invited, minutes: 45, terminal: true, outcomes: [{ id: 'a', when: A38, goto: 'c38_fa_radio' }, { id: 'b', goto: 'c38_fb_bread' }], ...tableOnly,
        text: 'Спорят все. Хенрике предлагает чердак, Эва — свою кровать, Оле — домик в колонии. В конце Хенрике стучит ложкой: «Wir sehen, wer kommt». Посмотрим, кто приедет.', effects: [set38('fl', 'talk'), meal('eat'), until38(13, 30)] },
    ] }),

  X({ id: 'c38_fa_radio', title: 'Радио', camp: kitchen14,
    text: [
      { text: 'Хенрике включает приёмник: Красный Крест сообщает о колоннах.' },
      { text: '— …Kolonne Nord hat Ahrensburg erreicht. Rückfahrt planmäßig um fünfzehn Uhr. Kolonne Ost hat die Elbe überquert.\n\nКолонна «Север» прибыла в Аренсбург. Обратный выезд по плану в пятнадцать часов. Колонна «Восток» переправилась через Эльбу.' },
    ],
    actions: [
      { id: 'c38_far_relief', label: 'Выдохнуть: доехали', minutes: 30, terminal: true, goto: 'c38_fa_kids',
        text: 'Ты не замечал{m:|а}, что не дышишь. Хенрике выключает приёмник и крестится, быстро, коротко, как будто ей неловко.', effects: [set38('far', 'relief'), { body: 'stress', delta: -5 }, until38(14, 15)] },
      { id: 'c38_far_listen', label: 'Слушать дальше: что ещё скажут', minutes: 30, terminal: true, goto: 'c38_fa_kids',
        text: 'Дальше — приказ комендатуры: с пятнадцатого гражданские посты Красного Креста к югу от Эльбы закрываются. Пункт в Йестебурге остаётся «на усмотрение врача». Зандер останется. Ты это знаешь.', effects: [set38('far', 'listen'), w38('posts_closing', true), until38(14, 15)] },
      { id: 'c38_far_off', label: 'Выключить: дальше ждать', minutes: 20, terminal: true, goto: 'c38_fa_kids',
        text: 'Ты выключаешь приёмник. Доехали — значит, и вернутся. До шести ещё четыре часа.', effects: [set38('far', 'off'), until38(14, 5)] },
    ] }),

  X({ id: 'c38_fa_room', title: 'Чердак', camp: kitchen14,
    text: [
      { when: invited, text: 'Если Мерле приедет, ей нужно место. Чердак над кухней: холодно, но труба от печи идёт через него, у трубы тепло. Там старая кровать без матраса и коробки.' },
      { when: all(invited, v('w.c36_merle', 'all')), text: 'И если приедут её родители — ещё двое. Чердак маленький.' },
      { when: not(invited), text: 'Мерле вы не звали. Хенрике просит помочь в подвале: переложить то, что осталось после реквизиции, чтобы видеть, сколько чего.' },
    ],
    actions: [
      { id: 'c38_faro_attic', label: 'Освободить чердак: коробки вниз, кровать к трубе', when: invited, minutes: 45, activity: 'moderate', terminal: true, goto: 'c38_fa_army',
        text: 'Коробки с ёлочными игрушками, старые журналы, детская коляска. Всё вниз, в сарай. Кровать к трубе, сверху матрас из кладовки, два одеяла. Пахнет пылью и дымом. Тепло — если не отходить от трубы.', effects: [set38('faro', 'attic'), w38('attic_ready', true), { body: 'fatigue', delta: 5 }, until38(15, 45)] },
      { id: 'c38_faro_own', label: 'Освободить вашу с {partner.ins} комнату: себе — лавку в кухне', when: invited, minutes: 45, terminal: true, goto: 'c38_fa_army',
        text: 'Ты переносишь ваши вещи в угол кухни. Комната пустая, тёплая, с окном во двор. Хенрике смотрит и качает головой: «Ihr seid verrückt». Вы ненормальные. Но приносит чистое бельё.', effects: [set38('faro', 'own'), w38('own_room_ready', true), npc('henrike', 1), until38(15, 45)] },
      { id: 'c38_faro_wait', label: 'Не готовить заранее: вдруг не приедет', when: invited, minutes: 30, terminal: true, goto: 'c38_fa_army',
        text: 'Ты решаешь не загадывать. Если приедет — найдётся место. Ты идёшь во двор: там всегда есть дело.', effects: [set38('faro', 'wait'), until38(15, 15)] },
      { id: 'c38_faro_cellar', label: 'Помочь Хенрике в подвале', when: not(invited), minutes: 45, activity: 'moderate', terminal: true, goto: 'c38_fa_army',
        text: 'Мешки, банки, ящики. Хенрике пишет, ты считаешь. После реквизиции всё выглядит меньше, чем было, хотя цифры почти те же.', effects: [set38('faro', 'cellar'), npc('henrike', 1), until38(15, 45)] },
    ] }),

  X({ id: 'c38_fa_army', title: 'Грузовики', camp: yard14, safe: false, ambient: frost38,
    text: [
      { text: 'С дороги доносится рёв моторов. Ты выходишь за ворота: по дороге на север идёт армейская колонна. Грузовики, бензовоз, кухня на прицепе. Отход начался.' },
      { text: 'На повороте у вашего поля последний грузовик съезжает колесом в кювет и садится на брюхо. Солдаты вылезают, ругаются, смотрят на твой двор, где стоит трактор.' },
    ],
    actions: [
      { id: 'c38_faa_tractor', label: 'Выгнать трактор и вытащить их тросом', when: tractorRuns, minutes: 40, risky: true, terminal: true, goto: 'c38_fa_ole', ambientDuring: frost38,
        outcomes: [
          { id: 'ok', check: { traits: ['driving', 'technical'], difficulty: 3, uses: ['focus'] },
            text: 'Трос, натяг, трактор упирается всеми колёсами. Грузовик выползает из кювета с рёвом. Сержант спрыгивает и суёт тебе в руки канистру: «Für den Traktor. Zwanzig Liter». Для трактора. Двадцать литров.',
            effects: [set38('faa', 'tractor'), { give: 'can_diesel_20', fuel: 20 }, w38('diesel_from_army', true), until38(16, 30)] },
          { id: 'snap',
            text: 'Трос лопается со звуком выстрела и хлещет по снегу в метре от тебя. Трактор дёргается и глохнет. Солдаты вытаскивают грузовик своим тягачом через полчаса. Тебе никто ничего не даёт. Руки трясутся до вечера.',
            effects: [set38('faa', 'snap'), { body: 'stress', delta: 8 }, until38(16, 30)] },
        ] },
      { id: 'c38_faa_shovel', label: 'Вынести лопату и золу: пусть откапываются сами', minutes: 40, activity: 'moderate', terminal: true, goto: 'c38_fa_ole', ambientDuring: frost38,
        text: 'Солдаты откапывают колесо, сыплют золу. Ты помогаешь. Через полчаса грузовик выезжает. Сержант кивает и кидает тебе пачку галет.\n\n— Danke.\n\nКолонна уходит на север.', effects: [set38('faa', 'shovel'), { body: 'fatigue', delta: 5 }, until38(16, 30)] },
      { id: 'c38_faa_watch', label: 'Смотреть из-за ворот и не вмешиваться', minutes: 30, terminal: true, goto: 'c38_fa_ole', ambientDuring: frost38,
        text: 'Солдаты возятся полчаса, потом их вытаскивает тягач. Колонна уходит. На повороте остаётся колея и чёрное пятно масла на снегу. Через неделю здесь не будет никого в форме.', effects: [set38('faa', 'watch'), until38(16, 20)] },
    ] }),

  X({ id: 'c38_fa_ole', title: 'Перед сумерками', camp: yard14, ambient: frost38,
    text: [
      { when: oleHome33, text: 'Оле сидит на колоде у сарая и смотрит на дорогу, куда ушла армия. Ружьё стоит рядом, прислонённое к стене.' },
      { when: all(not(oleHome33), brothersCome), text: 'Дениз копается в моторе фургона у сарая, ругаясь вполголоса по-турецки. Без генератора ему негде заряжать аккумулятор.' },
      { when: all(not(oleHome33), not(brothersCome)), text: 'Хенрике выходит на крыльцо с лампой, хотя ещё светло. Ставит её на перила и смотрит на дорогу.' },
    ],
    actions: [
      { id: 'c38_fao_sit', label: 'Сесть рядом и помолчать', minutes: 30, terminal: true, outcomes: toEvening('c38_fa_wait'), ambientDuring: frost38,
        text: 'Вы сидите рядом. Ни слова. Солнце красное, низкое, тени до самой дороги. Это тоже разговор.', effects: [set38('fao', 'sit'), { body: 'stress', delta: -3 }, until38(17, 0)] },
      { id: 'c38_fao_help', label: 'Предложить помощь с тем, чем он занят', minutes: 30, terminal: true, outcomes: toEvening('c38_fa_wait'), ambientDuring: frost38,
        text: 'Ты держишь фонарик, подаёшь ключи, держишь крышку. Дело идёт быстрее вдвоём. В конце он говорит «danke» так, будто ему это непривычно.', effects: [set38('fao', 'help'), { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: 1 }] }, { if: { npc: 'deniz', alive: true }, then: [{ npc: 'deniz', trust: 1 }] }, until38(17, 0)] },
      { id: 'c38_fao_chores', label: 'Закрыть кур, наносить дров на ночь', minutes: 30, activity: 'moderate', terminal: true, outcomes: toEvening('c38_fa_wait'), ambientDuring: frost38,
        text: 'Куры, засов. Дрова, охапка, ещё охапка. Когда ты заканчиваешь, уже темно.', effects: [set38('fao', 'chores'), { body: 'fatigue', delta: 4 }, until38(17, 0)] },
    ] }),

  X({ id: 'c38_fa_wait', title: 'Ждать', camp: kitchen14,
    text: [
      { text: 'Темно. Хенрике поставила лампу на подоконник: видно с дороги. Шесть часов. Мост закрыт.' },
      { when: northPartner38, text: 'Успела ли колонна? Радио молчит. Ты ходишь от окна к двери и обратно.' },
      { when: all(not(northPartner38), invited), text: 'Приедет ли Мерле? Окафор обещал. Радио молчит.' },
    ],
    actions: [
      { id: 'c38_faw_road', label: 'Выйти к дороге и ждать там', minutes: 210, terminal: true, goto: 'c38_evening',
        text: 'Ты стоишь у поворота, пока не перестаёшь чувствовать ноги. Потом возвращаешься греться и выходишь снова. В восемь вдали появляются фары.', effects: [set38('faw', 'road'), { body: 'fatigue', delta: 4 }, until38(20, 30)] },
      { id: 'c38_faw_cook', label: 'Помогать Хенрике готовить на всех, кто приедет', minutes: 210, terminal: true, goto: 'c38_evening',
        text: 'Картошка, капуста, сало на сковороде. Руки заняты — голова свободнее. Хенрике учит тебя, как резать лук, чтобы не плакать. Плачешь всё равно.', effects: [set38('faw', 'cook'), npc('henrike', 1), until38(20, 30)] },
      { id: 'c38_faw_sleep', label: 'Прилечь: всё равно ничего не изменишь', minutes: 210, activity: 'rest', terminal: true, goto: 'c38_evening',
        text: 'Ты ложишься одетый поверх одеяла. Не спишь, но и не встаёшь. Слушаешь каждый звук с дороги. В половине девятого слышишь мотор.', effects: [set38('faw', 'sleep'), { body: 'fatigue', delta: -6 }, until38(20, 30)] },
    ] }),

  // ═════════════ B на хуторе (если не едет) ═════════════
  X({ id: 'c38_fb_quiet', title: 'Кухня', camp: kitchen14,
    text: [
      { text: 'Половина девятого. Хенрике стоит у плиты и считает вслух, сколько картошки ставить на вечер: кто вернётся, кто приедет, кто уехал насовсем.' },
      { when: kasiaDeparts38, text: 'Кровать Каси заправлена так ровно, как она никогда не заправляла. На подушке пусто: гармошку Тима она увезла.' },
    ],
    actions: [
      { id: 'c38_fbq_count', label: 'Считать с Хенрике', when: henrike38, minutes: 45, terminal: true, goto: 'c38_fb_elders',
        text: 'Двенадцать, если Мерле приедет одна. Четырнадцать, если с родителями. Хенрике чистит на четырнадцать: лучше лишнее, чем не хватит.', effects: [set38('fbq', 'count'), npc('henrike', 1), until38(9, 30)] },
      { id: 'c38_fbq_wash', label: 'Затеять стирку, пока есть горячая вода', minutes: 45, activity: 'moderate', terminal: true, goto: 'c38_fb_elders',
        text: 'Корыто, хозяйственное мыло, кипяток из котла. Простыни, полотенца, чьи-то носки. Руки красные до локтей. К вечеру всё будет сохнуть на чердаке у трубы.', effects: [set38('fbq', 'wash'), { body: 'fatigue', delta: 5 }, until38(9, 30)] },
      { id: 'c38_fbq_bed', label: 'Перестелить кровать Каси: она теперь свободна', minutes: 45, terminal: true, goto: 'c38_fb_elders',
        text: 'Ты снимаешь бельё. Под подушкой — записка по-польски, три строчки. Ты не понимаешь слов, кроме одного: «Tim». Ты кладёшь записку в ящик стола. Пусть лежит.', effects: [set38('fbq', 'bed'), w38('kasia_note', true), until38(9, 30)] },
    ] }),

  X({ id: 'c38_fb_elders', title: 'Наверху', camp: kitchen14,
    text: [
      { when: eldersCome, text: 'Петерсену хуже: колено горячее и красное, он не спал. Фрау Кёрнер сидит рядом и держит его за руку.' },
      { when: all(not(eldersCome), evaHere), text: 'Эва кашляет, и кашель стал влажным. Она говорит, что это от дыма.' },
      { when: all(not(eldersCome), not(evaHere)), text: 'Хенрике снова жалуется на пальцы. Сегодня она не может застегнуть пуговицы на кофте.' },
    ],
    actions: [
      { id: 'c38_fbe_cold', label: 'Холодный компресс, покой, держать ногу выше', minutes: 45, terminal: true, goto: 'c38_fb_nina',
        text: 'Снег в полотенце, подушка под ногу. Через час отёк меньше. Ты пишешь на листке: что делать до вечера. Кто-нибудь да прочитает.', effects: [set38('fbe', 'cold'), w38('care_ok', true), until38(10, 30)] },
      { id: 'c38_fbe_warm', label: 'Тепло, чай с мёдом, растереть', minutes: 45, terminal: true, goto: 'c38_fb_nina',
        text: 'Ты делаешь, как делала бы бабушка. Становится легче, или так кажется. Ты не {m:уверен|уверена}, что правильно, но человеку спокойнее.', effects: [set38('fbe', 'warm'), until38(10, 30)] },
      { id: 'c38_fbe_zander', label: 'Решить: после обеда сходить к Зандер, спросить', minutes: 30, terminal: true, goto: 'c38_fb_nina',
        text: 'Ты записываешь, что спросить. Зандер сегодня одна: Лея на севере или в Винзене. Ей пригодятся руки.', effects: [set38('fbe', 'zander'), w38('to_zander', true), until38(10, 15)] },
    ] }),

  X({ id: 'c38_fb_nina', title: 'Нина', camp: kitchen14,
    text: [
      { when: ninaFarm, text: 'Нина сидит на лавке с учебником, но смотрит в окно. Школы сегодня нет: все в колонне. Она спрашивает по-русски, когда они вернутся.' },
      { when: not(ninaFarm), text: 'Нины на хуторе нет: она в Винзене. Ты находишь её тетрадь на подоконнике. Внутри — рисунок хутора, корова и шесть человечков. Подписаны все.' },
    ],
    actions: [
      { id: 'c38_fbn_teach', label: 'Позаниматься с Ниной немецким', when: ninaFarm, minutes: 45, terminal: true, goto: 'c38_fb_room',
        text: 'Диктант: Нина пишет, ты читаешь. «Die Brücke ist zu». Мост закрыт. Она пишет без ошибок и поднимает глаза: «А они успели?» Ты говоришь: успеют.', effects: [set38('fbn', 'teach'), npc('c7_nina', 1), until38(11, 30)] },
      { id: 'c38_fbn_cook', label: 'Взять Нину помогать на кухне', when: ninaFarm, minutes: 45, terminal: true, goto: 'c38_fb_room',
        text: 'Нина чистит картошку, высунув язык. Кожура выходит толстая, но Хенрике не ругает. Говорит только: «Dünner, Kind. Dünner». Тоньше, девочка.', effects: [set38('fbn', 'cook'), npc('c7_nina', 1), npc('henrike', 1), until38(11, 30)] },
      { id: 'c38_fbn_draw', label: 'Посмотреть рисунок Нины', when: not(ninaFarm), minutes: 30, terminal: true, goto: 'c38_fb_room',
        text: 'Шесть человечков: Хенрике, Оле, корова, она сама и двое, держащиеся за руки. Под ними подписано по-немецки: «Meine». Мои.', effects: [set38('fbn', 'draw'), until38(11, 15)] },
      { id: 'c38_fbn_outside', label: 'Пойти с Ниной на улицу: проветриться', when: ninaFarm, minutes: 45, terminal: true, goto: 'c38_fb_room',
        text: 'Вы лепите снеговика у ворот. Снег сухой, не липнет, снеговик выходит кривой. Нина смеётся впервые за неделю.', effects: [set38('fbn', 'outside'), { body: 'stress', delta: -4 }, npc('c7_nina', 1), until38(11, 30)] },
    ] }),

  X({ id: 'c38_fb_room', title: 'Место', camp: kitchen14,
    text: [
      { when: invited, text: 'Если Мерле приедет, ей нужно место. Чердак холодный, но у трубы тепло. Ваша комната — тёплая, но ваша.' },
      { when: not(invited), text: 'Мерле вы не звали. Ты стоишь у окна и думаешь, правильно ли. Потом идёшь помогать Хенрике.' },
    ],
    actions: [
      { id: 'c38_fbr_attic', label: 'Приготовить чердак: застелить, принести одеяла', when: invited, minutes: 50, activity: 'moderate', terminal: true, goto: 'c38_f_lunch',
        text: 'Ты застилаешь кровать у трубы, кладёшь два одеяла и грелку из бутылки. На подоконник ставишь банку с еловыми ветками. Мерле любит, когда красиво.', effects: [set38('fbr', 'attic'), w38('attic_ready', true), until38(12, 30)] },
      { id: 'c38_fbr_own', label: 'Освободить вашу комнату', when: invited, minutes: 50, terminal: true, goto: 'c38_f_lunch',
        text: 'Ваши вещи — в угол кухни. Комната тёплая, с окном во двор. Ты знаешь, что {partner} не будет против. Почти {m:уверен|уверена}.', effects: [set38('fbr', 'own'), w38('own_room_ready', true), until38(12, 30)] },
      { id: 'c38_fbr_help', label: 'Помочь Хенрике', minutes: 50, terminal: true, goto: 'c38_f_lunch',
        text: 'Хенрике чинит носки у окна. Ты садишься рядом и чинишь тоже. Час проходит в тишине и стежках.', effects: [set38('fbr', 'help'), npc('henrike', 1), until38(12, 30)] },
    ] }),

  X({ id: 'c38_fb_bread', title: 'После обеда', camp: kitchen14,
    text: [
      { text: 'Хенрике ставит тесто на вечер: если приедут, хлеба на всех не хватит. Мука — последний мешок от Кёлер.' },
    ],
    actions: [
      { id: 'c38_fbb_knead', label: 'Месить вместе', minutes: 45, activity: 'moderate', terminal: true, goto: 'c38_fb_point',
        text: 'Тесто, руки, мука на локтях. Хенрике рассказывает, как пекла на свадьбу Оле, которой не было. Ты не спрашиваешь почему.', effects: [set38('fbb', 'knead'), npc('henrike', 1), until38(14, 15)] },
      { id: 'c38_fbb_soup', label: 'Сварить суп на вечер, пока Хенрике месит', minutes: 45, terminal: true, goto: 'c38_fb_point',
        text: 'Кости от окорока, картошка, лук, морковь из погреба. К вечеру будет суп на всех. Хенрике пробует и молча добавляет соли.', effects: [set38('fbb', 'soup'), w38('soup_ready', true), until38(14, 15)] },
      { id: 'c38_fbb_skip', label: 'Оставить хлеб Хенрике, а самой собираться к Зандер', minutes: 30, terminal: true, goto: 'c38_fb_point',
        text: 'Хенрике машет рукой: иди. Ты одеваешься потеплее.', effects: [set38('fbb', 'skip'), until38(14, 0)] },
    ] }),

  X({ id: 'c38_fb_point', title: 'Пункт', location: 'c16_jesteburg', camp: jestCamp, ambient: hall38,
    text: [
      { text: 'Пункт Зандер в Йестебурге. Сегодня Зандер одна: в приёмной пятеро, в кабинете ещё двое.' },
      { text: '— Gott sei Dank, — говорит она, увидев тебя. Слава Богу. — Waschen, Kittel, und dann die Frau mit der Hand.\n\nМыть руки, халат, и потом женщина с рукой.' },
    ],
    actions: [
      { id: 'c38_fbp_work', label: 'Взяться за работу', minutes: 45, terminal: true, goto: 'c38_fb_patient',
        text: 'Халат великоват, перчатки малы. Женщина с рукой: порезалась косой, глубоко. Ты промываешь, Зандер шьёт. Потом ребёнок с кашлем, старик с давлением. Время идёт быстро.', effects: [set38('fbp', 'work'), until38(15, 15)] },
      { id: 'c38_fbp_ask', label: 'Сначала спросить про своих стариков', minutes: 40, terminal: true, goto: 'c38_fb_patient',
        text: 'Зандер слушает на ходу, кивает.\n\n— Kühlen, hochlegen, und wenn Fieber kommt — holen Sie mich.\n\nХолод, держать выше, а если будет жар — зовите меня. Потом показывает на приёмную: работа.', effects: [set38('fbp', 'ask'), w38('zander_advice', true), until38(15, 15)] },
    ] }),

  X({ id: 'c38_fb_patient', title: 'Мальчик', location: 'c16_jesteburg', camp: jestCamp, ambient: hall38,
    text: [
      { text: 'Последний на сегодня — мальчик лет двенадцати с обожжённой ладонью: схватился за печную дверцу. Пузыри, кожа белая. Мать держит его за плечи.' },
    ],
    actions: [
      { id: 'c38_fbpt_cool', label: 'Холодная вода, пятнадцать минут, потом чистая повязка', minutes: 40, terminal: true, goto: 'c38_fb_walk',
        text: 'Таз с холодной водой. Мальчик плачет, потом перестаёт: холод снимает боль. Пузыри ты не трогаешь, повязку кладёшь свободно. Зандер заглядывает, кивает.\n\n— Gut gemacht.\n\nХорошо сделано.', effects: [set38('fbpt', 'cool'), w38('burn_ok', true), until38(16, 0)] },
      { id: 'c38_fbpt_butter', label: 'Мазь с жиром, как мама мазала', minutes: 35, terminal: true, goto: 'c38_fb_walk',
        text: 'Зандер видит банку у тебя в руке и забирает её. «Kein Fett. Nie. Wasser». Никакого жира. Никогда. Вода. Она делает сама. Ты стоишь рядом и учишься.', effects: [set38('fbpt', 'butter'), { body: 'stress', delta: 3 }, until38(16, 0)] },
      { id: 'c38_fbpt_pop', label: 'Вскрыть пузыри, чтобы не мешали', minutes: 35, terminal: true, goto: 'c38_fb_walk',
        text: 'Зандер останавливает тебя за руку. «Nicht aufstechen. Die Blase ist das beste Pflaster». Не прокалывать. Пузырь — лучший пластырь. Она перевязывает сама.', effects: [set38('fbpt', 'pop'), until38(16, 0)] },
    ] }),

  X({ id: 'c38_fb_walk', title: 'Обратно', location: 'c7_farm_lane', camp: jestCamp, safe: false, ambient: frost38,
    text: [
      { text: 'Четыре часа, солнце красное и низкое. До хутора полчаса по дороге. Дорога за день укатана армейскими грузовиками до зеркала.' },
    ],
    actions: [
      { id: 'c38_fbw_road', label: 'Идти по укатанной дороге, быстро', minutes: 35, risky: true, terminal: true, goto: 'c38_fb_dusk', ambientDuring: frost38,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] },
            text: 'Ты идёшь мелкими шагами, руки из карманов, как учила Хенрике. Дважды почти падаешь, но доходишь. Во дворе Хенрике уже зажгла лампу.',
            effects: [set38('fbw', 'road'), until38(16, 45)] },
          { id: 'fall',
            text: 'На спуске ноги уходят разом, и ты падаешь на спину, затылком о лёд. В глазах вспышка. Ты лежишь, пока не перестаёт звенеть. Встаёшь медленно. Домой идёшь по обочине, по снегу.',
            effects: [set38('fbw', 'fall'), { injure: 'bruise', site: 'head', severity: 1 }, { body: 'stress', delta: 6 }, until38(16, 50)] },
        ] },
      { id: 'c38_fbw_edge', label: 'Идти по обочине, по снегу: дольше, но не скользко', minutes: 45, activity: 'moderate', terminal: true, goto: 'c38_fb_dusk', ambientDuring: frost38,
        text: 'Снег по щиколотку, идти тяжело. Зато ни разу не {m:поскользнулся|поскользнулась}. Когда ты входишь во двор, уже темно.', effects: [set38('fbw', 'edge'), { body: 'fatigue', delta: 4 }, until38(16, 55)] },
      { id: 'c38_fbw_spikes', label: 'Надеть ледоступы', when: { has: 'c36_spikes' }, minutes: 30, terminal: true, goto: 'c38_fb_dusk', ambientDuring: frost38,
        text: 'Шипы скрипят по льду. Идёшь, как по асфальту. Хорошая вещь. Через полчаса ты дома.', effects: [set38('fbw', 'spikes'), until38(16, 40)] },
    ] }),

  X({ id: 'c38_fb_dusk', title: 'Сумерки', camp: yard14, ambient: frost38,
    text: [
      { text: 'Сумерки. По дороге проходит армейская колонна на север: фары, рёв, выхлоп. Хенрике стоит у ворот и смотрит им вслед.' },
      { when: henrike38, text: '— Die fahren. Und wir bleiben, — говорит она, не оборачиваясь. Они едут. А мы остаёмся.' },
    ],
    actions: [
      { id: 'c38_fbd_stand', label: 'Встать рядом с Хенрике', when: henrike38, minutes: 15, terminal: true, outcomes: toEvening('c38_fb_wait'), ambientDuring: frost38,
        text: 'Вы стоите, пока не проходит последний грузовик. Хенрике берёт тебя под руку, и вы идёте в дом. Молча.', effects: [set38('fbd', 'stand'), npc('henrike', 1), until38(17, 0)] },
      { id: 'c38_fbd_hens', label: 'Закрыть кур и принести дров', minutes: 15, activity: 'moderate', terminal: true, outcomes: toEvening('c38_fb_wait'), ambientDuring: frost38,
        text: 'Куры, засов, охапка дров. Колонна уже прошла. Остался запах солярки и тишина.', effects: [set38('fbd', 'hens'), until38(17, 0)] },
    ] }),

  X({ id: 'c38_fb_wait', title: 'Ждать', camp: kitchen14,
    text: [
      { text: 'Шесть часов. Мост закрыт. Хенрике поставила лампу на подоконник, чтобы было видно с дороги.' },
      { when: invited, text: 'Приедет ли Мерле? Ты не знаешь. Радио молчит.' },
    ],
    actions: [
      { id: 'c38_fbw2_cook', label: 'Готовить ужин на всех, кто приедет', minutes: 210, terminal: true, goto: 'c38_evening',
        text: 'Картошка, капуста, суп. Кухня наполняется паром. Ты накрываешь на четырнадцать, потом убираешь две тарелки, потом ставишь обратно.', effects: [set38('fbw2', 'cook'), until38(20, 30)] },
      { id: 'c38_fbw2_window', label: 'Сидеть у окна и смотреть на дорогу', minutes: 210, terminal: true, goto: 'c38_evening',
        text: 'Дорога белая в темноте. Два часа ничего. Потом далеко, у леса, — фары.', effects: [set38('fbw2', 'window'), until38(20, 30)] },
      { id: 'c38_fbw2_rest', label: 'Прилечь на час', minutes: 210, activity: 'rest', terminal: true, goto: 'c38_evening',
        text: 'Ты ложишься, не раздеваясь, и закрываешь глаза. Слышишь, как Хенрике гремит кастрюлями. В половине девятого во дворе мотор.', effects: [set38('fbw2', 'rest'), { body: 'fatigue', delta: -6 }, until38(20, 30)] },
    ] }),

  // ═════════════ Встречать в Винзене ═════════════
  X({ id: 'c38_w_go', title: 'В Винзен', camp: yard14, ambient: frost38,
    text: [
      { text: 'Пять часов. Встречать колонну в Винзене договорились. До школы пятнадцать километров по тёмной дороге.' },
      { when: carOk, text: 'Corsa заведётся: бензина хватит туда и обратно.' },
    ],
    actions: [
      { id: 'c38_wg_car', label: 'Ехать на Corsa', when: carOk, minutes: 60, terminal: true, goto: 'c38_w_wait', ambientDuring: cab38,
        text: 'Фары упираются в снег. На дороге никого, только следы армейских колёс. Через сорок минут ты у школы.', effects: [set38('wg', 'car'), set38('car_winsen', true), { drive: 'opel_corsa', km: 17, to: winsen38 }, until38(18, 30)] },
      { id: 'c38_wg_lukas', label: 'Попроситься к Лукасу на трактор: он едет за матерью', minutes: 90, terminal: true, goto: 'c38_w_wait', ambientDuring: cab38,
        text: 'Трактор ползёт медленно, ты втиснут{m:|а} в кабину рядом с Лукасом, колени в приборную панель. Печка дует еле-еле. Лукас всю дорогу молчит.', effects: [set38('wg', 'lukas'), { body: 'fatigue', delta: 4 }, until38(18, 40)] },
      { id: 'c38_wg_pickup', label: 'Дождаться пикапа Красного Креста у поворота', minutes: 75, terminal: true, goto: 'c38_w_wait', ambientDuring: cab38,
        text: 'Пикап идёт в Винзен встречать колонну. Ты садишься в кабину. Водитель тот же, что утром.', effects: [set38('wg', 'pickup'), until38(18, 30)] },
    ] }),

  X({ id: 'c38_w_wait', title: 'Школьный двор, вечер', location: winsen38, camp: winCamp, ambient: frost38,
    text: [
      { text: 'Половина седьмого. Школьный двор Винзена. Человек тридцать ждут у ворот, притопывая. Кто-то говорит, что мост закрыли раньше. Кто-то — что колонна застряла.' },
      { text: 'Координатор с седой косой стоит с фонарём и никому ничего не обещает.' },
    ],
    actions: [
      { id: 'c38_ww_ask', label: 'Спросить координатора, есть ли связь', minutes: 45, terminal: true, goto: 'c38_w_arrive', ambientDuring: frost38,
        text: '— Sie sind über die Brücke. Fünf vor sechs. Die Letzten. — Она убирает рацию в карман. Они проехали мост. Без пяти шесть. Последними. Люди у ворот выдыхают все разом.', effects: [set38('ww', 'ask'), until38(19, 15)] },
      { id: 'c38_ww_fire', label: 'Помочь развести костёр в бочке', minutes: 45, activity: 'light', terminal: true, goto: 'c38_w_arrive', ambientDuring: frost38,
        text: 'Бочка, доски от разбитой парты, газета. Люди подходят греть руки. Кто-то делится хлебом. Ждать вместе легче.', effects: [set38('ww', 'fire'), until38(19, 15)] },
      { id: 'c38_ww_wait', label: 'Стоять у ворот и смотреть на дорогу', minutes: 45, terminal: true, goto: 'c38_w_arrive', ambientDuring: frost38,
        text: 'Дорога тёмная. Ты считаешь до ста, потом снова. На четвёртой сотне вдали появляются фары.', effects: [set38('ww', 'wait'), until38(19, 15)] },
    ] }),

  X({ id: 'c38_w_arrive', title: 'Колонна', location: winsen38, camp: winCamp, ambient: frost38,
    text: [
      { text: 'Белые грузовики въезжают во двор один за другим. Из кузовов вылезают люди, затёкшие, в инее.' },
      { when: northPartner38, text: '{partner} спрыгивает с подножки первой машины и сразу видит тебя.' },
      { when: merleComes38, text: 'Мерле вылезает из кузова, худая, в чужой куртке.' },
      { when: parentsCome38, text: 'За ней — двое пожилых: мужчина с сумками и женщина с кастрюлей.' },
      { when: all(not(merleComes38), any(bNorth36)), text: 'Мерле среди приехавших нет.' },
    ],
    actions: [
      { id: 'c38_wa_run', label: 'Бежать навстречу', minutes: 75, terminal: true, goto: 'c38_evening', ambientDuring: cab38,
        text: 'Ты не помнишь, как оказываешься у машины. Руки, холодные куртки, чей-то смех. Потом пикап, тесно, плечо к плечу, до самого хутора.', effects: [set38('wa', 'run'), { if: merleComes38, then: [{ set: '$.met.merle', value: true }] }, { if: parentsCome38, then: [{ set: '$.met.uwe', value: true }, { set: '$.met.birgit', value: true }] }, { if: flag('$.c38_car_winsen'), then: [{ drive: 'opel_corsa', km: 17, to: 'hof_luedemann' }] }, { body: 'stress', delta: -6 }, until38(20, 30)] },
      { id: 'c38_wa_help', label: 'Помогать всем выгружаться', minutes: 75, terminal: true, goto: 'c38_evening', ambientDuring: cab38,
        text: 'Узлы, носилки, старики. Ты подаёшь руку каждому, кто спускается. Своих обнимаешь уже потом, у машины.', effects: [set38('wa', 'help'), { if: merleComes38, then: [{ set: '$.met.merle', value: true }] }, { if: parentsCome38, then: [{ set: '$.met.uwe', value: true }, { set: '$.met.birgit', value: true }] }, { if: flag('$.c38_car_winsen'), then: [{ drive: 'opel_corsa', km: 17, to: 'hof_luedemann' }] }, until38(20, 30)] },
    ] }),
];
