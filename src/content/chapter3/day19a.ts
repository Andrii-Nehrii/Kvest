import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { any, ninaFarm, v } from './point18';
import {
  A19, S19, barnChained, cold19, colonyGone, colonyStands, day19, evaHere, girlHere, henrikeHome, ilseKept, jannesHere, janaHere,
  jensBarn, jensColony, jensGone, letter, npc, own19, set19, tableOnly, tractorHere, until, uteHere, volkerHere, w19,
} from './point19';

// Участок 19, линия A: четверг на хуторе. Листок Оле (подвал и солярка), будка, крыша, патруль, люди дома.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S19({ ...scene, for: 'any', chapter: 'ch3',
  actions: scene.actions.map(a => ({ ...a, when: all(A19, a.when ?? { always: true }) })) });
const afterCaches = [{ id: 'booth', when: ilseKept, goto: 'c19_a_booth' }, { id: 'roof', goto: 'c19_a_roof' }];
const afterCellar = [{ id: 'diesel', when: not(flag('$.c19_ad')), goto: 'c19_a_diesel' }, ...afterCaches];
const afterDiesel = [{ id: 'cellar', when: all(letter, not(flag('$.c19_ac')), not(own19('al', 'put'))), goto: 'c19_a_cellar' }, ...afterCaches];
const gunKnown: Cond = flag('w.c19_gun');
const afterPatrol = [{ id: 'gun', when: gunKnown, goto: 'c19_a_weapons' }, { id: 'noon', goto: 'c19_a_noon', effects: [until(19, 12, 45)] }];
const afterWell = [{ id: 'nina', when: ninaFarm, goto: 'c19_a_nina' }, { id: 'call', goto: 'c19_a_ninacall' }];
const afterNoon = [{ id: 'well', goto: 'c19_a_well' }];
const afterGirl = [{ id: 'ute', when: uteHere, goto: 'c19_a_ute' }, { id: 'jannes', when: jannesHere, goto: 'c19_a_jannes' }, { id: 'kerem', goto: 'c19_a_kerem' }];
const afterNina = [{ id: 'girl', when: girlHere, goto: 'c19_a_girl' }, ...afterGirl];
const listed = (who: string) => `${who} в списке нет.`;

export const day19AScenes: Scene[] = [
  A({ id: 'c19_a_letter', title: 'Листок Оле', camp: kitchen14,
    text: [
      { when: letter, text: 'Ты разворачиваешь листок у окна. Оле пишет по-немецки, коротко, как говорит.\n\n«{A}. Vaters Flinte: Keller, hinter der Kartoffelwand, die kleine Tür. Schlüssel im Uhrkasten, hinter dem Pendel. Zwei Kanister Diesel unterm Mist hinter der langen Scheune. Für den Trecker. Nicht verkaufen. Sag Brandt nichts. — O.»' },
      { when: letter, text: 'Ты переводишь про себя, медленно. Отцовское ружьё — в подвале, за стенкой из картошки, маленькая дверь. Ключ — в часах, за маятником. Две канистры солярки под навозом за длинным сараем. Для трактора. Не продавать. Брандту ничего не говорить.' },
      { when: all(letter, own19('wn', 'clock')), text: 'Латунная скважина сбоку на часах. Ночью ты её видел.' },
      { when: not(letter), text: 'Оле ничего не передал. Дел во дворе и без того хватает.' },
    ],
    actions: [
      { id: 'c19_al_cellar', label: 'Сначала подвал: часы, маятник, маленькая дверь', when: letter, minutes: 15, terminal: true, goto: 'c19_a_cellar',
        text: 'Ты открываешь стеклянную дверцу часов. Маятник качнулся и замер. За ним на гвоздике висит маленький ключ с картонной биркой: «K».', effects: [set19('al', 'cellar')] },
      { id: 'c19_al_diesel', label: 'Сначала солярка за длинным сараем', when: letter, minutes: 5, terminal: true, goto: 'c19_a_diesel',
        text: 'Ты берёшь вилы у курятника. Навозная куча за длинным сараем парит на холоде.', effects: [set19('al', 'diesel')] },
      { id: 'c19_al_henrike', label: 'Показать листок Хенрике', when: all(letter, henrikeHome), minutes: 15, terminal: true, goto: 'c19_a_cellar',
        text: 'Хенрике читает, держа листок далеко от глаз. Потом сама открывает часы и снимает ключ с гвоздика.\n\n— Sein Vater hat da drin geschossen, als die Füchse kamen. Achtundneunzig, — говорит она. — Komm.\n\nЕго отец стрелял из него, когда пришли лисы. В девяносто восьмом. Пойдём.', effects: [set19('al', 'henrike'), npc('henrike', 2)] },
      { id: 'c19_al_put', label: 'Убрать листок: сначала двор', when: letter, minutes: 5, terminal: true, goto: 'c19_a_roof',
        text: 'Ты убираешь листок во внутренний карман. Ружьё и солярка пролежали там до тебя. Полежат ещё.', effects: [set19('al', 'put')] },
      { id: 'c19_al_roof', label: 'Начать с крыши курятника', when: not(letter), minutes: 5, terminal: true, goto: 'c19_a_roof',
        text: 'Ты берёшь лестницу у сарая.', effects: [set19('al', 'roof')] },
      { id: 'c19_al_booth', label: 'Сначала сходить к будке обходчика', when: all(not(letter), ilseKept), minutes: 5, terminal: true, goto: 'c19_a_booth',
        text: 'Ты наливаешь воды в бутылку и выходишь к насыпи.', effects: [set19('al', 'booth')] },
    ] }),

  A({ id: 'c19_a_cellar', title: 'Маленькая дверь', camp: house14,
    text: [
      { text: 'В подвале пахнет землёй и картошкой. Ящики стоят вдоль дальней стены в два ряда. Ты отодвигаешь три, и за ними действительно дверца, по пояс, обитая жестью.' },
      { text: 'Ключ входит туго. Внутри ниша. На полке длинный свёрток в промасленной тряпке и картонная коробка из-под патронов. В коробке четыре. Под полкой две бутылки шнапса с выцветшими этикетками.' },
      { when: own19('al', 'henrike'), text: 'Хенрике стоит за спиной со свечой и молчит.' },
    ],
    actions: [
      { id: 'c19_ac_take', label: 'Забрать ружьё и патроны в дом', minutes: 15, terminal: true, outcomes: afterCellar,
        text: 'Ты разворачиваешь тряпку. Вертикалка, старая, ухоженная. Стволы смазаны. Ты прячешь её за шкафом в своей комнате, патроны — в банку с пуговицами.', effects: [set19('ac', 'take'), w19('gun', 'house'), { give: 'c19_flinte' }, { give: 'c19_shells', qty: 4 }] },
      { id: 'c19_ac_lock', label: 'Запереть всё обратно, ключ оставить себе', minutes: 10, terminal: true, outcomes: afterCellar,
        text: 'Ты запираешь дверцу и задвигаешь ящики на место. Ключ с биркой «K» ты вешаешь на шнурок и убираешь под свитер.', effects: [set19('ac', 'lock'), w19('gun', 'locked')] },
      { id: 'c19_ac_henrike', label: 'Отдать ключ Хенрике: дом её', when: henrikeHome, minutes: 10, terminal: true, outcomes: afterCellar,
        text: 'Хенрике берёт ключ и держит его на ладони.\n\n— Danke, — говорит она. И убирает ключ в фартук.\n\nСпасибо.', effects: [set19('ac', 'henrike'), w19('gun', 'henrike'), npc('henrike', 2)] },
      { id: 'c19_ac_schnaps', label: 'Запереть ружьё, а шнапс взять: на обмен', minutes: 10, terminal: true, outcomes: afterCellar,
        text: 'Бутылки тяжёлые и пыльные. Ружьё ты оставляешь за дверцей, ключ — себе. За шнапс сейчас дают больше, чем за деньги.', effects: [set19('ac', 'schnaps'), w19('gun', 'locked'), w19('schnaps', true)] },
    ] }),

  A({ id: 'c19_a_diesel', title: 'Навоз за длинным сараем', camp: yard14, ambient: day19,
    text: [
      { text: 'Куча за длинным сараем сверху смёрзлась коркой. Изнутри идёт пар и тяжёлый тёплый запах. Если Оле не соврал, канистры где-то внизу.' },
      { when: tractorHere, text: 'Бак трактора под навесом почти пустой. Ты {m:проверял|проверяла}.' },
      { when: not(tractorHere), text: 'Трактора под навесом нет. Солярка без него — просто товар.' },
    ],
    actions: [
      { id: 'c19_ad_tractor', label: 'Раскопать и залить в трактор', when: tractorHere, minutes: 55, activity: 'heavy', terminal: true, outcomes: afterDiesel,
        text: 'Через сорок минут вилы стукаются о железо. Первая канистра проржавела насквозь и пустая. Вторая целая, литров четырнадцать. Ты заливаешь её в трактор через воронку из пластиковой бутылки. Руки пахнут навозом до вечера.', effects: [set19('ad', 'dig'), w19('diesel', 'tractor')] },
      { id: 'c19_ad_dig', label: 'Раскопать вилами', minutes: 50, activity: 'heavy', terminal: true, outcomes: afterDiesel,
        text: 'Через сорок минут вилы стукаются о железо. Первая канистра проржавела насквозь и пустая. Вторая целая, литров четырнадцать. Ты обтираешь её соломой и уносишь под навес. Руки пахнут навозом до вечера.', effects: [set19('ad', 'dig'), w19('diesel', 'can'), { give: 'can_diesel_20', fuel: 14 }] },
      { id: 'c19_ad_mark', label: 'Только проверить щупом, что они там, и закопать обратно', minutes: 20, activity: 'moderate', terminal: true, outcomes: afterDiesel,
        text: 'Ты втыкаешь лом наискось. На глубине в полметра железо звенит. Ты забрасываешь ямку навозом и втыкаешь рядом палку. Сейчас солярка тебе не нужна. Пусть лучше не видят, что она есть.', effects: [set19('ad', 'mark'), w19('diesel', 'marked')] },
      { id: 'c19_ad_leave', label: 'Оставить на потом', minutes: 2, terminal: true, outcomes: afterDiesel,
        text: 'Ты прислоняешь вилы к стене сарая. Пар над кучей поднимается ровно, будто ничего не изменилось.', effects: [set19('ad', 'leave')] },
    ] }),

  A({ id: 'c19_a_booth', title: 'Будка обходчика', location: 'c10_field', camp: tense14, ambient: day19,
    text: [
      { text: 'Будка стоит у насыпи, как вчера. Шпала, которой ты подпёр дверь, на месте. Изнутри доносится ровный глухой стук: лоб о доску.' },
      { text: 'В окне Ильзе. Кофта с перламутровыми пуговицами. Верёвка от её пояса тянется к печной дверце. В миске на полу ни капли.' },
    ],
    actions: [
      { id: 'c19_ab_water', label: 'Налить ей воды в миску через окно', minutes: 45, move: true, terminal: true, goto: 'c19_a_roof',
        text: 'Ты просовываешь бутылку в разбитое стекло и льёшь в миску. Ильзе опускается на четвереньки и пьёт, как пьют кошки. Ты стоишь и не можешь уйти, пока она не поднимается обратно к окну.', effects: [set19('ab', 'water'), w19('ilse', 'water'), { body: 'stress', delta: 2 }, until(19, 10, 0)] },
      { id: 'c19_ab_fork', label: 'Ударить камертоном о рельс у окна', when: { has: 'c18_fork' }, minutes: 45, move: true, terminal: true, goto: 'c19_a_roof',
        text: 'Ля. Четыреста сорок. Звук тонкий, долгий. Стук за стеной прекращается. Ильзе поворачивает голову к окну и стоит, пока звук не гаснет.\n\nТы бьёшь ещё раз. Она стоит снова.\n\nКогда-то она учила этому детей. Ты уходишь, пока стук не начался опять.', effects: [set19('ab', 'fork'), w19('ilse', 'fork'), { body: 'stress', delta: 3 }, until(19, 10, 0)] },
      { id: 'c19_ab_end', label: 'Сделать это сейчас, пока никто не видит', minutes: 60, move: true, activity: 'heavy', terminal: true, goto: 'c19_a_roof',
        text: 'Ты долго стоишь у двери с ломом. Потом отваливаешь шпалу. Всё занимает меньше минуты.\n\nТы хоронишь её у насыпи, где земля мягче. Камертон кладёшь сверху, в чехле. Потом всё-таки забираешь обратно.', effects: [set19('ab', 'end'), w19('ilse', 'ended'), { body: 'stress', delta: 7 }, until(19, 10, 15)] },
      { id: 'c19_ab_tell', label: 'Ничего не делать: сказать патрулю, когда приедут', minutes: 40, move: true, terminal: true, goto: 'c19_a_roof',
        text: 'Ты стоишь у окна минуту и уходишь. Солдаты сделают то, что должны. Тебе останется только сказать им, где она.', effects: [set19('ab', 'tell'), until(19, 10, 0)] },
    ] }),

  A({ id: 'c19_a_roof', title: 'Крыша курятника', camp: yard14, ambient: day19,
    text: [
      { when: volkerHere, text: 'Фолькер уже на крыше курятника. Он стоит на коленях на старом рубероиде и выдирает гвозди. Рукава закатаны, как вчера. На шее у него на шнурке болтается обручальное кольцо.' },
      { when: volkerHere, text: '— Halt mal die Leiter, — говорит он, не оборачиваясь. — Die rutscht.\n\nПодержи лестницу. Скользит.' },
      { when: all(not(volkerHere), flag('w.c18_roofing')), text: 'Рулон рубероида, оставленный прохожим кровельщиком, стоит у столба. Крыша курятника протекает в двух местах.' },
      { when: all(not(volkerHere), not(flag('w.c18_roofing'))), text: 'Крыша курятника протекает в двух местах. Под дырами на насесте мокрые перья.' },
    ],
    actions: [
      { id: 'c19_ar_ladder', label: 'Держать лестницу и подавать рулоны', when: volkerHere, minutes: 70, activity: 'light', terminal: true, goto: 'c19_a_patrol',
        text: 'Час ты держишь лестницу и подаёшь гвозди горстями. Фолькер работает молча и быстро. Один раз кольцо цепляется за край листа, и он прячет его под свитер резким движением, как будто обжёгся.', effects: [set19('ar', 'ladder'), w19('roof', 'volker'), until(19, 11, 0)] },
      { id: 'c19_ar_tostedt', label: 'Спросить, кто у него остался в Тоштедте', when: volkerHere, minutes: 70, activity: 'light', terminal: true, goto: 'c19_a_patrol',
        text: '— Niemand, — говорит Фолькер. Никого. Молоток останавливается на полувзмахе. Потом бьёт дальше, сильнее, чем нужно.\n\nДо конца работы он не говорит ни слова.', effects: [set19('ar', 'tostedt'), w19('roof', 'volker'), w19('volker_asked', true), until(19, 11, 0)] },
      { id: 'c19_ar_climb', label: 'Залезть самому: пусть он отдохнёт', when: volkerHere, minutes: 70, activity: 'heavy', risky: true, terminal: true, goto: 'c19_a_patrol',
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'technical'], difficulty: 3, uses: ['strength', 'mobility'], mods: [{ when: { has: 'gloves' }, bonus: 1 }] }, text: 'Рубероид на холоде ломкий, но ты укладываешь лист ровно. Фолькер снизу кивает.\n\n— Gut, — говорит он. Слово это у него, видимо, одно на день.', effects: [set19('ar', 'climb'), w19('roof', 'a'), npc('henrike', 1)] },
          { id: 'slip', text: 'Нога едет по инею на краю. Ты успеваешь схватиться за конёк, но локтем бьёшься о жесть. Рукав куртки распорот на ладонь. Фолькер молча лезет наверх и доделывает сам.', effects: [set19('ar', 'slip'), w19('roof', 'volker'), w19('jacket_torn', true), { injure: 'bruise', site: 'rightArm', severity: 1 }] },
        ], effects: [until(19, 11, 0)] },
      { id: 'c19_ar_own', label: 'Оставить его: у тебя свои дела', when: volkerHere, minutes: 60, activity: 'moderate', terminal: true, goto: 'c19_a_patrol',
        text: 'Ты колешь дрова за сараем. Удары молотка на крыше и твои удары топора то сходятся, то расходятся. К одиннадцати крыша готова.', effects: [set19('ar', 'own'), w19('roof', 'volker'), until(19, 11, 0)] },
      { id: 'c19_ar_roll', label: 'Перекрыть крышу рубероидом', when: all(not(volkerHere), flag('w.c18_roofing')), minutes: 90, activity: 'heavy', risky: true, terminal: true, goto: 'c19_a_patrol',
        outcomes: [
          { id: 'ok', check: { traits: ['technical'], difficulty: 2, uses: ['strength'], mods: [{ when: { has: 'gloves' }, bonus: 1 }] }, text: 'Рулон тяжёлый и на холоде трескается на сгибах. Ты укладываешь его внахлёст и прибиваешь рейками. Течь больше не будет.', effects: [set19('ar', 'roll'), w19('roof', 'a')] },
          { id: 'slip', text: 'На краю рулон вырывается из рук и катится вниз. Ты тянешься за ним и съезжаешь по инею. Падение короткое, но рукав куртки распорот о жесть. Крыша закрыта наполовину.', effects: [set19('ar', 'slip'), w19('roof', 'half'), w19('jacket_torn', true), { injure: 'bruise', site: 'leftArm', severity: 1 }] },
        ], effects: [until(19, 11, 0)] },
      { id: 'c19_ar_tin', label: 'Залатать дыры жестью из сарая', when: not(volkerHere), minutes: 60, activity: 'moderate', terminal: true, goto: 'c19_a_patrol',
        text: 'Два куска жести, восемь гвоздей. Красиво не выходит, но на насест больше не капает.', effects: [set19('ar', 'tin'), w19('roof', 'half'), until(19, 11, 0)] },
      { id: 'c19_ar_later', label: 'Оставить до сухой погоды', when: not(volkerHere), minutes: 30, terminal: true, goto: 'c19_a_patrol',
        text: 'Ты переставляешь насест подальше от дыр и подкладываешь под капель старый таз. До выходных выдержит.', effects: [set19('ar', 'later'), until(19, 11, 0)] },
    ] }),

  A({ id: 'c19_a_patrol', title: 'Список', camp: yard14, ambient: day19,
    text: [
      { text: 'В одиннадцать у ворот патруль. Двое. Солдат постарше держит планшет, молодой стоит у машины.\n\n— Kontrolle der Liste. Alle, die hier wohnen, bitte an die Tür.\n\nПроверка списка. Все, кто здесь живёт, — к двери.' },
      { when: v('w.c18_list', 'all'), text: 'Солдат сверяет лица с фамилиями и ставит галочки.' },
      { when: flag('w.c18_list_checked'), text: 'Напротив каждого имени у него уже стоит «geprüft». Он узнаёт тебя и не задерживается.' },
      { when: all(v('w.c18_list', 'two'), any(girlHere, uteHere, jannesHere, volkerHere)), text: 'В списке только вы двое. У двери людей больше.' },
      { when: all(v('w.c18_list', 'hosts'), not(henrikeHome)), text: 'В списке Людеманы. Ни один из них не стоит у двери.' },
      { when: all(evaHere, not(v('w.c18_list', 'all'))), text: listed('Эвы') },
      { when: all(janaHere, not(v('w.c18_list', 'all'))), text: listed('Яны') },
      { when: own19('ab', 'tell'), text: 'Ты помнишь про будку у насыпи.' },
    ],
    actions: [
      { id: 'c19_ap_add', label: 'Дописать всех, кто живёт в доме', when: not(v('w.c18_list', 'all')), minutes: 20, terminal: true, outcomes: afterPatrol,
        text: 'Солдат вбивает фамилии одну за другой. На каждой он поднимает глаза и смотрит на человека.\n\n— Montag kommt Herr Brandt persönlich, — говорит он. — Er will jeden sehen.\n\nВ понедельник придёт сам господин Брандт. Он хочет видеть каждого.', effects: [set19('ap', 'add'), w19('list', 'all')] },
      { id: 'c19_ap_guests', label: 'Сказать: это гости, завтра уходят', when: not(v('w.c18_list', 'all')), minutes: 10, terminal: true, outcomes: afterPatrol,
        text: '— Gäste, — повторяет солдат. — Bis morgen.\n\nГости. До завтра.\n\nОн записывает в заметки: «Lüdemann-Hof, Gäste, Abreise Fr.» Отъезд в пятницу. Теперь это записано.', effects: [set19('ap', 'guests'), w19('list', 'guests')] },
      { id: 'c19_ap_keep', label: 'Подтвердить список как есть', minutes: 10, terminal: true, outcomes: afterPatrol,
        text: 'Солдат ставит галочку и закрывает планшет.', effects: [set19('ap', 'keep'), w19('list', 'keep')] },
      { id: 'c19_ap_booth', label: 'Сказать, что в будке у насыпи привязана женщина из больницы', when: all(ilseKept, any(own19('ab', 'tell'), own19('ab', 'water'), own19('ab', 'fork'))), minutes: 15, terminal: true, outcomes: afterPatrol,
        text: 'Солдат записывает. Номер с браслета ты называешь по памяти: Station 4.\n\n— Wir erledigen das heute, — говорит он. Сегодня закончим.\n\nМолодой у машины отворачивается. Ты подтверждаешь список, не глядя в него.', effects: [set19('ap', 'booth'), w19('list', 'keep'), w19('ilse', 'post')] },
    ] }),

  A({ id: 'c19_a_weapons', title: 'Оружие', camp: yard14, ambient: day19,
    text: [{ text: 'Солдат уже убирает планшет, но останавливается.\n\n— Waffen im Haus? Herr Brandt lässt alles registrieren.\n\nОружие в доме есть? Господин Брандт велел всё переписать.' }],
    actions: [
      { id: 'c19_aw_truth', label: 'Сказать правду: старая двустволка, отцовская', minutes: 15, terminal: true, goto: 'c19_a_noon',
        text: 'Солдат вписывает: «Bockflinte, Kal. 12, Lüdemann». Номер на стволе он переписывает сам.\n\n— Behalten Sie sie. Für den Hof. Aber Brandt weiß es jetzt.\n\nОставьте. Для двора. Но теперь Брандт знает.', effects: [set19('aw', 'truth'), w19('gun_declared', true), until(19, 12, 45)] },
      { id: 'c19_aw_lie', label: 'Сказать: оружия нет', minutes: 5, terminal: true, goto: 'c19_a_noon',
        text: '— Keine, — говоришь ты. Нет.\n\nСолдат кивает и уходит к машине. Молодой смотрит на окна твоей комнаты чуть дольше, чем нужно.', effects: [set19('aw', 'lie'), w19('gun_lie', true), until(19, 12, 45)] },
    ] }),

  A({ id: 'c19_a_noon', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'В час обед: суп из картошки, хлеб. Места за столом не хватает, и кто-то ест стоя у подоконника.' },
      { when: henrikeHome, text: 'Хенрике сидит во главе стола и следит, чтобы досталось всем поровну.' },
      { when: all(not(henrikeHome), uteHere), text: 'Половник взяла Уте. Она разливает аккуратно, по-учительски: сначала младшим.' },
      { when: own19('ab', 'end'), text: 'Ложка у тебя в руке не слушается. Ты кладёшь её и ждёшь, пока пройдёт.' },
    ],
    actions: [
      { id: 'c19_an_eat', label: 'Поесть', minutes: 25, terminal: true, outcomes: afterNoon, ...tableOnly,
        text: 'Суп горячий. Ты съедаешь всё и вытираешь тарелку хлебом.', effects: [set19('an', 'eat'), meal('eat'), until(19, 14, 0)] },
      { id: 'c19_an_give', label: 'Отдать свою порцию тому, кто стоит у подоконника', minutes: 10, terminal: true, outcomes: afterNoon, ...tableOnly,
        text: 'Ты ставишь свою тарелку на подоконник и уходишь во двор. Есть ты будешь вечером.', effects: [set19('an', 'give'), meal('pack'), { if: girlHere, then: [npc('c8_eva', 1)] }, until(19, 14, 0)] },
      { id: 'c19_an_skip', label: 'Взять хлеба и сразу во двор', minutes: 10, terminal: true, outcomes: afterNoon,
        text: 'Ты отламываешь горбушку и ешь на ходу.', effects: [set19('an', 'skip'), until(19, 14, 0)] },
    ] }),

  A({ id: 'c19_a_well', title: 'Колонка', camp: yard14, ambient: day19,
    text: [
      { text: 'После обеда колонка во дворе качает воздух. Рычаг ходит легко, слишком легко, и из носика только хрипит. Ночью был мороз: прихватило трубу или села кожа в поршне.' },
      { text: 'Воды в канистрах в кладовке на день, может на два, если людей столько, сколько сейчас.' },
    ],
    actions: [
      { id: 'c19_awl_fix', label: 'Разобрать и починить самому', minutes: 50, activity: 'moderate', terminal: true, outcomes: afterWell,
        text: 'Ты откручиваешь крышку. Кожаная манжета на поршне высохла и треснула. Ты вырезаешь новую из голенища старого сапога Хенрике ножом, по старой. Через сорок минут колонка снова качает. Вода сначала ржавая, потом чистая.', effects: [set19('awl', 'fix'), w19('well', 'ok'), until(19, 14, 0)] },
      { id: 'c19_awl_hot', label: 'Отогреть трубу кипятком и тряпками', minutes: 35, activity: 'light', terminal: true, outcomes: afterWell,
        text: 'Три чайника кипятка, старые полотенца, терпение. На третьем чайнике колонка кашляет и выплёвывает ржавую воду, потом чистую. Ты обматываешь трубу мешковиной и проволокой. Сегодня ночью не замёрзнет.', effects: [set19('awl', 'hot'), w19('well', 'ok'), until(19, 14, 0)] },
      { id: 'c19_awl_later', label: 'Оставить до тепла: воды пока хватит', minutes: 10, terminal: true, outcomes: afterWell,
        text: 'Ты вешаешь на рычаг табличку из картона: «Kaputt». Потом пересчитываешь канистры в кладовке ещё раз.', effects: [set19('awl', 'later'), w19('well', 'broken'), until(19, 13, 40)] },
    ] }),

  A({ id: 'c19_a_nina', title: 'Нина', camp: house14,
    text: [
      { when: jensBarn, text: 'Нина ждёт тебя у двери длинного сарая. В руках у неё миска с водой.\n\n— Ich will zu Papa. Nicht durch den Spalt. Rein.\n\nЯ хочу к папе. Не через щель. Внутрь.' },
      { when: jensColony, text: 'Нина стоит у калитки в куртке.\n\n— Bring mich zu Papa. Zur Kolonie. Bevor Brandt seine Woche vorbei ist.\n\nОтведи меня к папе. В колонию. Пока у Брандта не кончилась его неделя.' },
      { when: jensGone, text: 'Нина стоит у калитки в куртке.\n\n— Wo ist er? Ich will wissen, wo genau.\n\nГде он? Я хочу знать где. Точно.' },
      { when: not(any(jensBarn, jensColony, jensGone)), text: 'Нина сидит на крыльце, обхватив колени. Когда ты подходишь, она говорит:\n\n— Ich will irgendwas tun. Nicht nur warten.\n\nЯ хочу что-нибудь делать. Не только ждать.' },
    ],
    actions: [
      { id: 'c19_ani_with', label: 'Пойти с ней и быть рядом', when: any(jensBarn, jensColony, jensGone), minutes: 50, activity: 'light', terminal: true, outcomes: afterNina,
        text: 'Вы идёте вместе. Там, куда она шла, Нина долго стоит молча. Потом говорит отцу что-то по-немецки, быстро, будто боится не успеть. Обратно она держит тебя за рукав.', effects: [set19('ani', 'with'), w19('nina_visit', true), npc('c7_nina', 3), { body: 'stress', delta: 2 }, until(19, 15, 0)] },
      { id: 'c19_ani_no', label: 'Сказать: не сегодня', when: any(jensBarn, jensColony, jensGone), minutes: 10, terminal: true, outcomes: afterNina,
        text: '— Heute nicht, — говоришь ты.\n\nНина смотрит на тебя долго, не споря. Потом уходит в дом и закрывает за собой дверь. Тихо. Так закрывают, когда хотят хлопнуть.', effects: [set19('ani', 'no'), npc('c7_nina', -2), until(19, 14, 20)] },
      { id: 'c19_ani_ute', label: 'Позвать Уте: она знает, как с ними', when: all(uteHere, any(jensBarn, jensColony)), minutes: 50, terminal: true, outcomes: afterNina,
        text: 'Уте берёт Нину за руку, как берут ученицу перед экзаменом.\n\n— Wir gehen zusammen. Er erkennt Stimmen, nicht Gesichter.\n\nПойдём вместе. Он узнаёт голоса, не лица.\n\nТы ждёшь снаружи.', effects: [set19('ani', 'ute'), w19('nina_visit', true), npc('c14_ute', 2), npc('c7_nina', 2), until(19, 15, 0)] },
      { id: 'c19_ani_job', label: 'Дать ей настоящее дело: яйца и куры на ней', when: not(any(jensBarn, jensColony, jensGone)), minutes: 15, terminal: true, outcomes: afterNina,
        text: 'Ты отдаёшь ей корзину и тетрадь Хенрике.\n\n— Сколько снесли, кто болеет, кто клюёт других. Каждый день.\n\nНина кивает и уходит в курятник. Через час в тетради аккуратная таблица.', effects: [set19('ani', 'job'), npc('c7_nina', 2), until(19, 14, 30)] },
    ] }),

  A({ id: 'c19_a_ninacall', title: 'Звонок из Винзена', camp: house14,
    text: [
      { when: { npc: 'c7_nina', alive: true }, text: 'В два звонит Нина. Голос тихий: она где-то в ванной, чтобы не слышали.\n\n— Lenas Mutter sagt, ich soll hierbleiben. Ich will zurück zu euch.\n\nМама Лены говорит, мне надо остаться тут. Я хочу обратно к вам.' },
      { when: not({ npc: 'c7_nina', alive: true }), text: 'В два телефон молчит. Ты всё равно смотришь на него каждые десять минут.' },
    ],
    actions: [
      { id: 'c19_anc_yes', label: 'Сказать: в выходные заберём', when: { npc: 'c7_nina', alive: true }, minutes: 10, terminal: true, outcomes: afterNina,
        text: '— Am Wochenende, — говоришь ты. В выходные.\n\nНина молчит так долго, что ты думаешь, связь пропала. Потом: «Versprochen?» Обещаешь?\n\nТы говоришь «да».', effects: [set19('anc', 'yes'), w19('nina_promise', true), npc('c7_nina', 2), until(19, 14, 20)] },
      { id: 'c19_anc_stay', label: 'Сказать честно: там безопаснее', when: { npc: 'c7_nina', alive: true }, minutes: 10, terminal: true, outcomes: afterNina,
        text: 'Нина слушает до конца.\n\n— Bei euch ist es nicht sicher, aber da seid ihr, — говорит она и отключается.\n\nУ вас небезопасно, но там вы.', effects: [set19('anc', 'stay'), npc('c7_nina', -1), until(19, 14, 20)] },
      { id: 'c19_anc_work', label: 'Заняться двором до вечера', when: not({ npc: 'c7_nina', alive: true }), minutes: 20, activity: 'moderate', terminal: true, outcomes: afterNina,
        text: 'Ты складываешь поленницу заново, ровнее. Работа помогает не смотреть на телефон.', effects: [set19('anc', 'work'), until(19, 14, 30)] },
    ] }),

  A({ id: 'c19_a_girl', title: 'Новенькая', camp: house14,
    text: [
      { when: evaHere, text: 'Эва ждёт тебя в сенях. Рукава закатаны, руки красные от холодной воды.\n\n— Gib mir Arbeit. Richtige Arbeit. Sonst denke ich nach.\n\nДай мне работу. Настоящую. Иначе я начинаю думать.' },
      { when: janaHere, text: 'Яна ждёт тебя в сенях. Рукава закатаны, руки красные от холодной воды.\n\n— Gib mir Arbeit. Richtige Arbeit. Sonst denke ich nach.\n\nДай мне работу. Настоящую. Иначе я начинаю думать.' },
    ],
    actions: [
      { id: 'c19_ag_wood', label: 'Поставить её колоть дрова вместе с тобой', minutes: 40, activity: 'heavy', terminal: true, outcomes: afterGirl,
        text: 'Она колет неумело, но упрямо. На десятом полене топор перестаёт отскакивать. Вы работаете молча, и это молчание хорошее.', effects: [set19('ag', 'wood'), { if: evaHere, then: [npc('c8_eva', 2)] }, { place: 'firewood', at: 'c3_farm_stock', qty: 10 }, until(19, 15, 10)] },
      { id: 'c19_ag_story', label: 'Спросить, что с ней было до казармы', minutes: 30, terminal: true, outcomes: afterGirl,
        text: 'Она рассказывает, глядя на свои руки: дорога, чужие люди, человек, который отошёл ненадолго и не вернулся. Подробностей она не даёт, ты не спрашиваешь. В конце она говорит: «Danke, dass du nicht sagst, dass es vorbeigeht». Спасибо, что не говоришь, что пройдёт.', effects: [set19('ag', 'story'), { if: evaHere, then: [npc('c8_eva', 2)] }, until(19, 14, 55)] },
      { id: 'c19_ag_kitchen', label: 'Отдать ей кухню и кур', minutes: 15, terminal: true, outcomes: afterGirl,
        text: 'Она кивает и уходит, не дослушав. Через полчаса из кухни пахнет луком, а в курятнике выметен пол.', effects: [set19('ag', 'kitchen'), until(19, 14, 50)] },
    ] }),

  A({ id: 'c19_a_ute', title: 'Уте', camp: tense14, ambient: day19,
    text: [
      { when: barnChained, text: 'В длинном сарае Уте с вёдрами. Она моет пол в проходе между стойлами, на коленях. Цепи звякают каждый раз, когда она передвигает ведро.\n\n— Sie riechen die Hühner, — говорит она. — Seit gestern sind sie unruhig.\n\nОни чуют кур. Со вчерашнего дня беспокойные.' },
      { when: all(colonyStands, not(barnChained)), text: 'Уте сидит на крыльце с вязанием. Каждые полчаса она ходит к колонии и возвращается.\n\n— Eine Woche hat Brandt gesagt, — говорит она. — Ich zähle.\n\nБрандт сказал: неделя. Я считаю.' },
      { when: colonyGone, text: 'Уте сидит у окна в комнате за кухней. Вязание лежит на коленях, спицы не двигаются. На подоконнике связка ключей с бирками.\n\n— Ich weiß nicht, was ich mit den Händen machen soll, — говорит она.\n\nНе знаю, куда деть руки.' },
    ],
    actions: [
      { id: 'c19_au_help', label: 'Помочь ей с вёдрами', when: barnChained, minutes: 45, activity: 'moderate', terminal: true, goto: 'c19_a_kerem',
        text: 'Ты делаешь то, что она показывает, и не задаёшь вопросов. Уте работает быстро и говорит с каждым, мимо кого проходит, по имени. Под конец она говорит и с тобой, тем же голосом.', effects: [set19('au', 'help'), npc('c14_ute', 2), until(19, 15, 40)] },
      { id: 'c19_au_hens', label: 'Перенести кур подальше от сарая', when: barnChained, minutes: 45, activity: 'moderate', terminal: true, goto: 'c19_a_kerem',
        text: 'Ты переставляешь клетки и насест к дальнему углу двора, за поленницу. Куры недовольны. В сарае к вечеру становится тише.', effects: [set19('au', 'hens'), w19('hens_moved', true), until(19, 15, 40)] },
      { id: 'c19_au_walk', label: 'Сходить с ней к колонии', when: all(colonyStands, not(barnChained)), minutes: 50, move: true, terminal: true, goto: 'c19_a_kerem',
        text: 'Уте идёт быстро, вязание под мышкой. У калитки колонии она здоровается с каждым домиком, по номерам. Ты ждёшь у ленты. Обратно она идёт медленнее и молчит до самого двора.', effects: [set19('au', 'walk'), npc('c14_ute', 2), until(19, 15, 40)] },
      { id: 'c19_au_pit', label: 'Сходить с ней к холмикам за теплицей', when: colonyGone, minutes: 50, move: true, terminal: true, goto: 'c19_a_kerem',
        text: 'Уте идёт вдоль ряда и поправляет бирки на проволоке, одну за другой. У одной она стоит дольше. Потом достаёт из кармана ключ с биркой и вешает рядом, на ту же проволоку.\n\n— Jetzt sind alle Schlüssel da, wo sie hingehören.\n\nТеперь все ключи там, где им место.', effects: [set19('au', 'pit'), npc('c14_ute', 3), { body: 'stress', delta: 2 }, until(19, 15, 40)] },
      { id: 'c19_au_task', label: 'Дать ей дело: кухня и хлеб на всех', when: not(barnChained), minutes: 20, terminal: true, goto: 'c19_a_kerem',
        text: 'Уте смотрит на тебя поверх очков. Потом встаёт и снимает с крючка фартук Хенрике.\n\n— Mehl?\n\nМука? Ты показываешь, где. Через час в доме пахнет хлебом.', effects: [set19('au', 'task'), npc('c14_ute', 1), until(19, 15, 20)] },
      { id: 'c19_au_leave', label: 'Оставить её одну', minutes: 5, terminal: true, goto: 'c19_a_kerem',
        text: 'Ты прикрываешь за собой дверь. Есть вещи, в которые не надо лезть.', effects: [set19('au', 'leave'), until(19, 15, 10)] },
    ] }),

  A({ id: 'c19_a_jannes', title: 'Яннес', camp: yard14, ambient: day19,
    text: [{ text: 'Яннес чинит забор у задней калитки. Делает он это плохо: гвозди гнутся, доска садится криво. Когда ты подходишь, он не оборачивается.\n\n— Mama kommt nicht, — говорит он. — Sie sitzt in der Elf.\n\nМама не придёт. Сидит в одиннадцатом.' }],
    actions: [
      { id: 'c19_aj_show', label: 'Показать, как держать молоток', minutes: 40, activity: 'light', terminal: true, goto: 'c19_a_kerem',
        text: 'Ты показываешь: за конец рукояти, не за середину. Яннес забивает следующий гвоздь с трёх ударов. Потом ещё один. Он не улыбается, но перестаёт сутулиться.', effects: [set19('aj', 'show'), npc('c14_jannes', 2), until(19, 15, 40)] },
      { id: 'c19_aj_go', label: 'Сказать: сходи к ней, я доделаю', minutes: 40, activity: 'light', terminal: true, goto: 'c19_a_kerem',
        text: 'Яннес смотрит на тебя, потом на насыпь. Кладёт молоток и уходит, не попрощавшись. Забор ты доделываешь сам.', effects: [set19('aj', 'go'), npc('c14_jannes', 1), until(19, 15, 40)] },
    ] }),

  A({ id: 'c19_a_kerem', title: 'Керем', camp: yard14, ambient: day19,
    text: [
      { when: { npc: 'kerem', alive: true }, text: 'Около четырёх у ворот звенит велосипедный звонок. Керем, в шапке до бровей, с термосом на багажнике. Он ехал двадцать километров из Бухгольца.\n\n— Deniz schickt mich. Wir wollten wissen, ob ihr lebt.\n\nДениз прислал. Хотели знать, живы ли вы.' },
      { when: { npc: 'kerem', alive: true }, text: 'Он рассказывает, пока пьёт: в Бухгольце люди Брандта переписывают оружие и тех, кто переболел. У мастерской вчера стояли двое из больницы. Дениз отогнал их ломом, без крови.' },
      { when: not({ npc: 'kerem', alive: true }), text: 'Около четырёх у ворот звенит велосипедный звонок. Незнакомый парень с повязкой дружинника передаёт записку от Дениза: «Живы? Если надо — приезжайте. Д.»' },
    ],
    actions: [
      { id: 'c19_ak_trade', label: 'Спросить, что они берут на обмен', minutes: 20, terminal: true, goto: 'c19_a_wait',
        outcomes: [
          { id: 'diesel', when: flag('w.c19_diesel'), text: '— Diesel? — Керем поднимает брови. — Für Diesel gibt Deniz Benzin. Samstag. Fünf Liter gegen zehn.\n\nЗа солярку Дениз даст бензин. В субботу. Пять литров за десять.\n\nТы запоминаешь.', effects: [set19('ak', 'trade'), w19('fuel_offer', true)] },
          { id: 'schnaps', when: flag('w.c19_schnaps'), text: '— Schnaps? — Керем смеётся впервые за разговор. — Dafür kriegst du bei uns fast alles. Samstag.\n\nЗа шнапс у нас дают почти всё. В субботу.', effects: [set19('ak', 'trade'), w19('fuel_offer', true)] },
          { id: 'none', text: '— Alles, was nicht verdirbt, — говорит Керем. Всё, что не портится. — Benzin haben wir wenig. Aber für Diesel würde Deniz tauschen.\n\nБензина мало. Но за солярку Дениз бы поменялся.', effects: [set19('ak', 'trade')] },
        ] },
      { id: 'c19_ak_gun', label: 'Спросить про ружьё, которое у них', when: { v: 'A.c12_gun', op: '==', value: 'kerem' }, minutes: 15, terminal: true, goto: 'c19_a_wait',
        text: 'Керем мрачнеет.\n\n— Brandts Leute haben es gestern mitgenommen. Registriert, sagen sie. Zurück gibt es nicht.\n\nЛюди Брандта забрали его вчера. «Зарегистрировано». Обратно не отдают.', effects: [set19('ak', 'gun'), w19('workshop_gun_taken', true)] },
      { id: 'c19_ak_feed', label: 'Накормить его и отпустить засветло', minutes: 25, terminal: true, goto: 'c19_a_wait',
        text: 'Ты наливаешь ему супа из кастрюли на плите. Керем ест быстро и смотрит на часы. До темноты ему двадцать километров.\n\n— Grüß {B}, — говорит он уже с велосипеда.', effects: [set19('ak', 'feed'), npc('kerem', 2), until(19, 16, 15)] },
    ] }),

  A({ id: 'c19_a_wait', title: 'К пяти', camp: yard14, ambient: cold19,
    text: [
      { text: 'Солнце садится в половине пятого. {B} ушла с Кёлер в девять и ещё не вернулась.' },
      { when: flag('w.c19_saw_walkers'), text: 'Ты вспоминаешь людей, которые ночью шли по полю к шоссе.' },
    ],
    actions: [
      { id: 'c19_awt_road', label: 'Выйти навстречу по дороге к Йестебургу', minutes: 30, move: true, terminal: true, goto: 'c19_eve',
        text: 'Ты доходишь до поворота у почтового ящика Людеманов. Дорога пустая. Ты стоишь, пока не начинают мёрзнуть ноги, и смотришь в сторону Йестебурга.', effects: [set19('awt', 'road'), until(19, 17, 0)] },
      { id: 'c19_awt_stove', label: 'Затопить и поставить воду', minutes: 30, terminal: true, goto: 'c19_eve',
        text: 'Ты растапливаешь плиту и ставишь два ведра. Когда хлопает калитка, вода уже шумит.', effects: [set19('awt', 'stove'), until(19, 17, 0)] },
      { id: 'c19_awt_rest', label: 'Полчаса полежать', minutes: 30, activity: 'rest', terminal: true, goto: 'c19_eve',
        text: 'Ты ложишься не раздеваясь. Спина отходит не сразу.', effects: [set19('awt', 'rest'), { body: 'fatigue', delta: -5 }, until(19, 17, 0)] },
    ] }),
];
