import type { Scene } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { flag, not } from './world3';
import { any, v } from './point18';
import { npc } from './point19';
import { S46, farm46, hamburg46, jest46, nilsNight46, set46, until46, w46, xmas46 } from './point46';

// Участок 46, линия A — Рождество после полудня: в Йестебург с корзиной остатков (Нильс — с вами, если ночевал), у пожарной части
// Брандт и его план на Сильвестр (большой огонь, суп, музыка для всего берега) — и его просьба к вашему двору; Нильс у кабины и январь
// (`w.c45_nils`), Яннес на посту колонии: «огонь и музыка — это приглашение»; обратно вдоль лесополосы, следы.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S46({ ...scene, for: 'any', chapter: 'ch3' });
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: jest46, camp: { at: jest46, stock: 'c3_farm_stock', rest: false }, safe: true });
const toJest: Effect = { move: jest46 };
const toFarm: Effect = { move: farm46 };
const nilsJan = (x: string) => v('w.c45_nils', x);

export const day46AScenes: Scene[] = [
  X({ id: 'c46_a_road', title: 'В Йестебург', camp: { at: farm46, stock: 'c3_farm_stock', rest: false }, ambient: xmas46,
    text: [
      { text: 'Хенрике собирает корзину: полкурицы, хлеб, банка капусты, кусок угря, если остался. «Für die, die gestern allein waren». Для тех, кто вчера был один. Кому — решишь по дороге.' },
      { when: nilsNight46, text: 'Нильс надевает куртку: ему к машине. Идти вместе.' },
      { text: 'Дорога в Йестебург укатана вчерашними санями и ногами. Солнце, мороз, тишина.' },
    ],
    actions: [
      { id: 'c46_ar_nils', label: 'Идти с Нильсом и слушать', when: nilsNight46, minutes: 55, terminal: true, goto: 'c46_a_station', ambientDuring: xmas46, activity: 'moderate',
        text: 'Нильс идёт медленно, руки в карманах. На полпути говорит: «Das war die erste Nacht seit November, in der ich nicht im Wagen geschlafen hab». Первая ночь с ноября, когда я спал не в машине. Он говорит это так, будто признаётся в чём-то.', effects: [set46('ar', 'nils'), toJest, until46(55, 11, 45)] },
      { id: 'c46_ar_fast', label: 'Идти быстро, пока солнце', minutes: 50, terminal: true, goto: 'c46_a_station', ambientDuring: xmas46, activity: 'moderate',
        text: 'Ты идёшь быстро, корзина бьёт по ноге. У лесополосы ты замедляешься, сам{m:|а} не зная зачем, и смотришь в кусты. Снег там ровный. Дальше — Йестебург и дым из труб.', effects: [set46('ar', 'fast'), toJest, until46(55, 11, 45)] },
      { id: 'c46_ar_tracks', label: 'Свернуть к лесополосе: посмотреть на вчерашние следы', when: flag('w.c46_tracks_seen'), minutes: 60, terminal: true, goto: 'c46_a_station', ambientDuring: xmas46, activity: 'moderate',
        text: 'Ночью мело, но следы ещё видны: ямки без пары, одна нога волочится. Они уходят в лесополосу и не возвращаются. Дальше ты не идёшь. Ты запоминаешь дерево с обломанной веткой у входа в кусты.', effects: [set46('ar', 'tracks'), w46('a_tracks_checked', true), toJest, until46(55, 11, 45)] },
      { id: 'c46_ar_lukas', label: 'Подождать Лукаса с трактором у развилки', minutes: 55, terminal: true, goto: 'c46_a_station', ambientDuring: xmas46,
        text: 'Лукас едет с прицепом, полным пустых бидонов, и всю дорогу кричит тебе через плечо про Сильвестр: огонь до неба, суп, музыка. «Brandt hat einen Plan!» У Брандта план. Ты держишь корзину на коленях.', effects: [set46('ar', 'lukas'), w46('heard_silvester', true), toJest, until46(55, 11, 45)] },
    ] }),

  J({ id: 'c46_a_station', title: 'Пожарная часть', ambient: xmas46,
    text: [
      { text: 'На площади у пожарной части дружинники складывают поленницу выше человеческого роста. Брандт стоит рядом с блокнотом, в праздничном шарфе поверх куртки.' },
      { text: '— Silvester. Hier. Ein Feuer, dass man es in Winsen sieht. Suppe für alle Höfe. Musik. Die Leute müssen sehen, dass wir noch da sind. Und ihr, Lüdemann-Hof, macht die Wache rund um den Platz. Ihr habt die Leute dafür.\n\nСильвестр. Здесь. Огонь, чтобы видно было в Винзене. Суп для всех дворов. Музыка. Люди должны видеть, что мы ещё здесь. А вы, хутор Людеманов, держите стражу вокруг площади. У вас есть для этого люди.' },
    ],
    actions: [
      { id: 'c46_as_risk', label: 'Спросить Брандта прямо: огонь и шум — а лесополоса?', minutes: 45, terminal: true, goto: 'c46_a_soup',
        text: 'Брандт смотрит на тебя поверх блокнота. «Darum die Wache. Darum ihr». Поэтому и стража. Поэтому вы. Он не отмахивается. Он просто уже решил. «Bis Sonntag will ich eine Antwort». До воскресенья хочу ответ.', effects: [set46('as', 'risk'), w46('a_asked_risk', true), w46('heard_silvester', true), until46(55, 12, 30)] },
      { id: 'c46_as_help', label: 'Взяться помогать складывать поленницу', minutes: 45, terminal: true, goto: 'c46_a_soup', activity: 'heavy',
        text: 'Ты таскаешь поленья с дружинниками полчаса. Поленница растёт. Брандт хлопает тебя по плечу: «So seh ich das gern». Вот так мне нравится. Как будто ответ уже дан. Он не дан.', effects: [set46('as', 'help'), w46('heard_silvester', true), { body: 'fatigue', delta: 5 }, until46(55, 12, 30)] },
      { id: 'c46_as_basket', label: 'Отдать корзину дружинникам у поленницы: они с утра на морозе', minutes: 45, terminal: true, goto: 'c46_a_soup',
        text: 'Курица уходит за минуту. Дружинники едят руками, стоя, и благодарят с набитыми ртами. Брандт смотрит и ничего не говорит, но записывает что-то в блокнот. Может, твой двор. Может, курицу.', effects: [set46('as', 'basket'), w46('basket', 'guards'), w46('heard_silvester', true), until46(55, 12, 30)] },
      { id: 'c46_as_lukas', label: 'Расспросить Лукаса, что там будет за музыка и кто придёт', minutes: 45, terminal: true, goto: 'c46_a_soup',
        text: 'Лукас загибает пальцы: гармошка, две гитары, барабан из бочки. Придут все дворы, может, человек двести. «Und ein Feuerwerk! Ich hab noch Raketen vom letzten Jahr!» И фейерверк! У меня остались ракеты с прошлого года! Ты представляешь двести человек, огонь до неба и ракеты над лесополосой.', effects: [set46('as', 'lukas'), w46('a_rockets', true), w46('heard_silvester', true), until46(55, 12, 30)] },
    ] }),

  J({ id: 'c46_a_soup', title: 'Суп для одиноких', ambient: { tempC: 10, outdoor: false, wet: false },
    text: [
      { text: 'В гараже пожарной части, где на совете стояли скамейки, сегодня столы и котёл. Рождественский суп для тех, у кого никого: старики, двое солдат-отставших, женщина с мальчиком из Винзена, которых никто не знает.' },
      { text: 'Разливает жена Брандта, маленькая, быстрая, в белом фартуке. Про Сильвестр здесь не говорят. Здесь говорят шёпотом.' },
    ],
    actions: [
      { id: 'c46_sp_serve', label: 'Встать на раздачу: у неё одна пара рук', minutes: 30, terminal: true, goto: 'c46_a_nils',
        text: 'Половник, миска, следующий. Двадцать мисок за полчаса. Один старик берёт миску обеими руками и говорит «danke» каждому, кто проходит мимо, даже тем, кто ничего ему не дал.', effects: [set46('sp', 'serve'), until46(55, 13, 0)] },
      { id: 'c46_sp_old', label: 'Сесть к старику, который сидит один в углу', minutes: 30, terminal: true, goto: 'c46_a_nils',
        text: 'Старик знал отца Хенрике. Говорит, тот был самый упрямый человек в округе и однажды пахал в сочельник, потому что «Kühe kennen keinen Feiertag». Коровы праздников не знают. Старик смеётся беззубо и долго.', effects: [set46('sp', 'old'), until46(55, 13, 0)] },
      { id: 'c46_sp_boy', label: 'Подойти к женщине с мальчиком: откуда они', minutes: 30, terminal: true, goto: 'c46_a_nils',
        text: 'Из Винзена, пешком, к сестре, которой в Йестебурге не оказалось. Дом пустой, дверь выбита. Женщина говорит это ровно, будто про погоду. Жена Брандта уже ищет им угол на ночь. Мальчик ест суп и смотрит на твою корзину.', effects: [set46('sp', 'boy'), w46('a_saw_stranger', true), until46(55, 13, 0)] },
    ] }),

  J({ id: 'c46_a_nils', title: 'Кабина', ambient: xmas46,
    text: [
      { text: 'Белый грузовик Красного Креста стоит за пожарной частью, в тени. Нильс открывает капот и смотрит в мотор, как в книгу.' },
      { when: nilsJan('yes'), text: '— Also ab Januar. Vierter, sieben Uhr, hier. Bring warme Socken mit.\n\nЗначит, с января. Четвёртое, семь утра, здесь. Возьми тёплые носки.' },
      { when: nilsJan('once'), text: '— Einmal. Gut. Einmal reicht, um zu wissen, ob man es kann.\n\nОдин раз. Хорошо. Одного раза хватит, чтобы понять, можешь ли.' },
      { when: nilsJan('no'), text: '— Nein ist auch eine Antwort. Eine ehrliche. — Нильс не поворачивается от мотора. — Ich frag den Lukas. Der ist zu jung, aber er hält an.\n\n«Нет» — тоже ответ. Честный. Спрошу Лукаса. Он слишком молодой, но он останавливается.' },
      { when: hamburg46, text: 'Двадцать восьмого он везёт колонну в Гамбург. В ней Мерле. И {partner}.' },
    ],
    actions: [
      { id: 'c46_an_engine', label: 'Помочь Нильсу с мотором к двадцать восьмому', minutes: 40, terminal: true, goto: 'c46_a_jannes',
        text: 'Свечи накаливания, фильтр, ремень. Руки мёрзнут, ключи липнут к пальцам. Через сорок минут мотор заводится с первого раза. Нильс слушает его, как музыку. «Der fährt. Bis Hamburg und zurück». Поедет. До Гамбурга и обратно.', effects: [set46('an', 'engine'), w46('truck_fixed', true), until46(55, 13, 45)] },
      { id: 'c46_an_bridge', label: 'Спросить про мост в Харбурге: Лукас говорил, ночью стреляли', minutes: 40, terminal: true, goto: 'c46_a_jannes',
        text: 'Нильс кивает. Стреляли с того берега, по колонне, не попали. «Plünderer. Keine Soldaten. Die haben Angst vor Lastwagen mit Kreuz drauf. Meistens». Мародёры. Не солдаты. Они боятся грузовиков с крестом. Почти всегда.', effects: [set46('an', 'bridge'), w46('a_knows_bridge', true), until46(55, 13, 45)] },
      { id: 'c46_an_food', label: 'Оставить ему остатки из корзины на завтра', when: not(v('w.c46_basket', 'guards')), minutes: 40, terminal: true, goto: 'c46_a_jannes',
        text: 'Нильс смотрит в корзину: курица, хлеб, капуста. «Hat Henrike das gepackt?» Это Хенрике собирала? Ты киваешь. Он прячет корзину под сиденье бережно, как документы.', effects: [set46('an', 'food'), w46('basket', 'nils'), until46(55, 13, 45)] },
      { id: 'c46_an_talk', label: 'Сесть в кабину погреться и поговорить ни о чём', minutes: 40, terminal: true, goto: 'c46_a_jannes',
        text: 'Печка в кабине гудит. Вы говорите про футбол, про то, кто выиграл бы лигу в этом году, если бы она была. Нильс уверен, что «Санкт-Паули». Ты споришь просто так. Это лучший разговор за месяц.', effects: [set46('an', 'talk'), { body: 'stress', delta: -5 }, until46(55, 13, 45)] },
    ] }),

  X({ id: 'c46_a_jannes', title: 'Пост колонии', location: 'c15_garden', camp: { at: 'c15_garden', stock: 'c3_farm_stock', rest: false }, ambient: xmas46,
    text: [
      { text: 'На обратном пути ты делаешь крюк к колонии. Яннес на посту, в будке у мешков с песком, нога вытянута на ящике. Двойные смены или нет, сегодня его очередь.' },
      { when: flag('w.c44_a_eve_shift'), text: 'Он кивает тебе как своему. «Danke für gestern. Ute hat geweint. Gut geweint». Спасибо за вчера. Уте плакала. По-хорошему.' },
      { text: 'Про Сильвестр он уже слышал. Говорит, не дожидаясь вопроса:' },
      { text: '— Feuer und Musik. Zweihundert Leute. Das ist keine Feier. Das ist eine Einladung. Seit dem Tauwetter ist der Waldstreifen nicht leer. Ich hör sie nachts.\n\nОгонь и музыка. Двести человек. Это не праздник. Это приглашение. С оттепели лесополоса не пустая. Я слышу их по ночам.' },
    ],
    actions: [
      { id: 'c46_aj_listen', label: 'Спросить, что именно он слышит по ночам', minutes: 45, terminal: true, goto: 'c46_a_back',
        text: 'Ветки. Шаги, которые не идут, а стоят. Один раз — звук, будто кто-то тянет мешок по снегу. Всегда в лесополосе, всегда между двумя и четырьмя. «Ich hab es Brandt gesagt. Brandt sagt, ich hab Angst. Hab ich auch». Я сказал Брандту. Брандт говорит, я боюсь. Боюсь.', effects: [set46('aj', 'listen'), w46('a_jannes_warn', true), until46(55, 14, 40)] },
      { id: 'c46_aj_tracks', label: 'Рассказать ему про следы у лесополосы', when: any(flag('w.c46_tracks_seen'), flag('w.c46_a_tracks_checked')), minutes: 45, terminal: true, goto: 'c46_a_back',
        text: 'Яннес слушает и молча чертит палочкой на снегу: дорога, лесополоса, дерево с обломанной веткой. «Da. Immer da». Там. Всегда там. Он смотрит на тебя: теперь вас двое, кто это знает.', effects: [set46('aj', 'tracks'), w46('a_jannes_warn', true), npc('c14_jannes', 1), until46(55, 14, 40)] },
      { id: 'c46_aj_tea', label: 'Отлить ему из своей фляжки горячего чая и посидеть рядом', minutes: 45, terminal: true, goto: 'c46_a_back',
        text: 'Вы сидите на мешках с песком и смотрите на поле. Яннес пьёт и молчит. Потом говорит: «Weihnachten im Unterstand. Wie mein Opa in Russland». Рождество в окопе. Как мой дед в России. И смеётся, коротко и невесело.', effects: [set46('aj', 'tea'), npc('c14_jannes', 1), until46(55, 14, 40)] },
      { id: 'c46_aj_brandt', label: 'Сказать: Брандт всё равно сделает, лучше помочь сделать это безопасно', minutes: 45, terminal: true, goto: 'c46_a_back',
        text: 'Яннес думает. Потом кивает: «Dann Posten an der Waldseite. Drei. Mit Glocke. Und kein Feuerwerk». Тогда посты со стороны леса. Три. С колоколом. И никакого фейерверка. Он говорит это так, будто уже стоит на одном из них.', effects: [set46('aj', 'brandt'), w46('a_jannes_plan', true), until46(55, 14, 40)] },
    ] }),

  X({ id: 'c46_a_back', title: 'Вдоль лесополосы', camp: { at: farm46, stock: 'c3_farm_stock', rest: false }, ambient: xmas46,
    text: [
      { text: 'Домой — короткой дорогой, вдоль лесополосы. Солнце низко, тени длинные и синие. В лесополосе тихо, как в комнате, где кто-то спит.' },
      { when: any(flag('w.c46_tracks_seen'), flag('w.c46_a_tracks_checked')), text: 'Дерево с обломанной веткой. Ямки в снегу у входа в кусты свежее, чем утром.' },
    ],
    actions: [
      { id: 'c46_ab_fast', label: 'Идти быстро и не останавливаться', minutes: 40, terminal: true, goto: 'c46_dusk', ambientDuring: xmas46, activity: 'moderate',
        text: 'Ты идёшь быстро, не оглядываясь, и считаешь шаги до калитки. Шестьсот двадцать. У калитки ты всё-таки оглядываешься. Лесополоса стоит, как стояла.', effects: [set46('ab', 'fast'), toFarm, until46(55, 15, 30)] },
      { id: 'c46_ab_mark', label: 'Воткнуть у дерева палку с тряпкой: пометить место для дружины', minutes: 45, terminal: true, goto: 'c46_dusk', ambientDuring: xmas46,
        text: 'Палка, тряпка из кармана, узел. Метка видна от дороги. Если кто-то из дружины пойдёт здесь в Сильвестр, он будет знать, куда смотреть.', effects: [set46('ab', 'mark'), w46('a_marked', true), toFarm, until46(55, 15, 30)] },
      { id: 'c46_ab_look', label: 'Заглянуть в кусты с края, не заходя', minutes: 45, terminal: true, goto: 'c46_dusk', ambientDuring: xmas46, risky: true,
        text: 'Ты раздвигаешь ветки палкой. Метрах в десяти, между стволами, стоит человек, спиной к тебе, неподвижно, по колено в снегу. Не поворачивается. Ты отпускаешь ветки очень медленно и уходишь, не поворачиваясь к лесополосе спиной, пока она не кончается.', effects: [set46('ab', 'look'), w46('a_saw_one', true), { body: 'stress', delta: 8 }, toFarm, until46(55, 15, 30)] },
    ] }),
];
