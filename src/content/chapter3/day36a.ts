import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, v } from './point18';
import { evaHere, npc } from './point19';
import { brothersCome } from './point33';
import {
  S36, cab36, east36, farm36, fed36, frost36, hall36, jest36, kasiaGoes36, lea36, lue36, set36, tobias36, until36, w36,
} from './point36';

// Участок 36, линия A: Йестебург (ответ Тобиасу) → Люнебург (казарма пустеет; кейс Ройтера; списки Хаазе; склад) → обратно.
// Находка A: кейс штабсарцта Ройтера, кодовый замок на три колёсика; подсказка — «n = 212 / 0» на доске в медпункте (обязательная сцена).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S36({ ...scene, for: 'any', chapter: 'ch3' });
const jestCamp = { at: jest36, stock: 'c3_farm_stock', rest: false as const };
const lueCamp = { at: lue36, stock: 'c3_farm_stock', rest: false as const };
const carHome: Cond = all({ has: 'car_keys' }, { itemAt: 'opel_corsa', place: farm36 }, { fuelFor: 'opel_corsa', km: 8 });
const carJest: Cond = flag('$.c36_car_jest');
const listedMed: Cond = any(flag('w.c35_b_listed_med'), v('w.c35_b_listed_med', 'maybe'));
const sayYes = (text: string, extra: Effect[] = []) => ({ id: 'yes', when: east36('yes'), goto: 'c36_a_ride', text, effects: [w36('told_tobias', 'yes'), w36('seats', 'kept'), ...extra, until36(9, 0)] });
const sayNo = (text: string, extra: Effect[] = []) => ({ id: 'no', when: east36('no'), goto: 'c36_a_ride', text, effects: [w36('told_tobias', 'no'), ...extra, until36(9, 0)] });
const sayGive = (text: string, extra: Effect[] = []) => ({ id: 'give', goto: 'c36_a_ride', text, effects: [w36('told_tobias', 'give'), w36('seats', 'kasia_eva'), ...extra, until36(9, 0)] });

export const day36AScenes: Scene[] = [
  X({ id: 'c36_a_go', title: 'В Йестебург', camp: yard14, ambient: frost36,
    text: [
      { text: 'Без четверти восемь. Тобиас сказал вчера: ответ нужен до четырнадцатого. Но армейские машины грузятся у пожарной части каждое утро, и лучше сказать сейчас, пока не передумал{m:|а}.' },
      { when: carHome, text: 'Corsa стоит под навесом, на стекле изморозь в палец. Бензина в баке немного, но до Йестебурга и обратно хватит.' },
      { when: brothersCome, text: 'Дениз греет мотор фургона: ему в Йестебург за проволокой. Он машет тебе рукой из кабины.' },
    ],
    actions: [
      { id: 'c36_ag_car', label: 'Ехать на Corsa', when: carHome, minutes: 25, terminal: true, goto: 'c36_a_station', ambientDuring: frost36,
        text: 'Ты скребёшь стекло ногтями и краем пропуска. Мотор заводится со второго раза. Дорога белая, колея твёрдая, как асфальт. Через десять минут ты у пожарной части.', effects: [set36('ag', 'car'), set36('car_jest', true), { drive: 'opel_corsa', km: 4, to: jest36 }, until36(8, 30)] },
      { id: 'c36_ag_deniz', label: 'Сесть к Денизу в фургон', when: brothersCome, minutes: 25, terminal: true, goto: 'c36_a_station', ambientDuring: frost36,
        text: 'В фургоне пахнет маслом и табаком. Дениз ведёт одной рукой, другой крутит ручку приёмника: одна музыка, новостей нет. «Wenn du mit dem Soldaten redest — frag, ob die Armee Diesel dalässt». Если будешь говорить с солдатом, спроси, оставит ли армия солярку.', effects: [set36('ag', 'deniz'), w36('deniz_asks_diesel', true), npc('deniz', 1), until36(8, 30)] },
      { id: 'c36_ag_walk', label: 'Пойти пешком через поле', minutes: 45, activity: 'moderate', terminal: true, goto: 'c36_a_station', ambientDuring: frost36,
        text: 'Снег скрипит под ногами. Над полем поднимается солнце, маленькое и красное, и тени от столбов тянутся до самой дороги. Пока идёшь, ты подбираешь слова для Тобиаса. Ни одни не подходят.', effects: [set36('ag', 'walk'), { body: 'fatigue', delta: 4 }, until36(8, 30)] },
    ] }),

  X({ id: 'c36_a_station', title: 'Пожарная часть', location: jest36, camp: jestCamp, ambient: frost36,
    text: [
      { when: tobias36, text: 'У пожарной части три армейских грузовика. Солдаты носят ящики, считают вслух. Тобиас стоит у последней машины со списком на планшете. Он видит тебя издалека и ждёт, не двигаясь.' },
      { when: all(tobias36, east36('yes')), text: 'Тебе надо сказать «да». Два места, пятнадцатого, за Эльбу. Так решила она.' },
      { when: all(tobias36, east36('no')), text: 'Тебе надо сказать «нет». Спасибо и нет. Так решила она.' },
      { when: all(tobias36, east36('give')), text: 'Тебе надо попросить: возьми вместо нас Касю и Эву. Так решила она.' },
      { when: not(tobias36), text: 'У пожарной части три армейских грузовика. Тобиаса нет. Лукас, сын пожарного, таскает канистры наравне с солдатами. Увидев тебя, он отставляет канистру и подходит.' },
      { text: 'На стене пожарной части кто-то написал мелом: «15.?» Знак вопроса обведён два раза.' },
    ],
    actions: [
      { id: 'c36_as_say', label: 'Сказать ответ так, как решила {partner}', when: tobias36, minutes: 20, terminal: true,
        outcomes: [
          sayYes('— Gut. — Тобиас кивает и записывает что-то на полях списка. — Fünfzehnter, fünf Uhr, Kasernentor Lüneburg. Wer um Viertel nach nicht da ist, dessen Platz geht weiter. Kein Gepäck über zehn Kilo.\n\nХорошо. Пятнадцатое, пять утра, ворота казармы в Люнебурге. Кого нет в четверть шестого, того место уходит дальше. Багажа не больше десяти кило.', [npc('c15_tobias', 1)]),
          sayNo('Тобиас долго молчит. Потом кивает.\n\n— Dann bleibt ihr. Gut. Einer muss.\n\nЗначит, остаётесь. Хорошо. Кто-то должен.\n\nОн вычёркивает что-то на полях. Ты не видишь, что именно.'),
          sayGive('— Kasia und Eva. — Тобиас трёт переносицу. — Gut. Aber sie kommen selbst. Bis zum Vierzehnten, zu mir, mit Papieren. Ich hole niemanden ab.\n\nКася и Эва. Хорошо. Но они придут сами. До четырнадцатого, ко мне, с документами. Я никого забирать не буду.', [npc('c15_tobias', 1)]),
        ] },
      { id: 'c36_as_honest', label: 'Сказать, что решала она, а ты передаёшь', when: tobias36, minutes: 25, terminal: true,
        outcomes: [
          sayYes('Тобиас слушает и усмехается краем рта.\n\n— Sie hat für dich entschieden. Und du stehst trotzdem hier. — Пауза. — Fünfzehnter, fünf Uhr, Kasernentor. Wenn du es dir anders überlegst, sag es mir ins Gesicht. Nicht durch sie.\n\nОна решила за тебя. А стоишь тут всё равно ты. Пятнадцатое, пять утра, ворота казармы. Если передумаешь, скажи мне в лицо. Не через неё.', [npc('c15_tobias', 1, 'c36_a_said_her_choice')]),
          sayNo('— Sie hat für dich Nein gesagt. — Тобиас смотрит на тебя внимательно. — Und du? — Ты не отвечаешь. Он кивает, будто ответ услышал. — Gut. Einer muss bleiben.\n\nОна сказала за тебя «нет». А ты? Ладно. Кто-то должен остаться.', [npc('c15_tobias', 0, 'c36_a_said_her_choice')]),
          sayGive('— Sie verschenkt eure Plätze. — Тобиас качает головой, но без злости. — Das ist mehr, als die meisten machen würden. Kasia und Eva, bis zum Vierzehnten, mit Papieren. Selbst.\n\nОна отдаёт ваши места. Это больше, чем сделали бы многие. Кася и Эва, до четырнадцатого, с документами. Сами.', [npc('c15_tobias', 2, 'c36_a_said_her_choice')]),
        ] },
      { id: 'c36_as_first', label: 'Сначала спросить, что будет с округом после пятнадцатого', when: tobias36, minutes: 30, terminal: true,
        outcomes: [
          sayYes('— Brandt. Die Feuerwehr. Wer eine Flinte hat. — Тобиас пожимает плечами. — Und der Frost, solange er hält.\n\nБрандт. Пожарные. У кого есть ружьё. И мороз, пока держится.\n\nПотом ты передаёшь ответ. Он записывает: пятнадцатое, пять утра, ворота казармы.', [w36('asked_after', true)]),
          sayNo('— Brandt. Die Feuerwehr. Wer eine Flinte hat. Und der Frost, solange er hält.\n\nБрандт. Пожарные. У кого есть ружьё. И мороз, пока держится.\n\nПотом ты говоришь «нет». Тобиас кивает: «Dann gehört ihr zu denen, die halten». Значит, вы из тех, кто держит.', [w36('asked_after', true)]),
          sayGive('— Brandt. Die Feuerwehr. Wer eine Flinte hat. Und der Frost, solange er hält.\n\nБрандт. Пожарные. У кого есть ружьё. И мороз, пока держится.\n\nПотом ты просишь про Касю и Эву. Он соглашается: до четырнадцатого, сами, с документами.', [w36('asked_after', true)]),
        ] },
      { id: 'c36_as_lukas', label: 'Попросить Лукаса передать ответ Тобиасу', when: not(tobias36), minutes: 20, terminal: true, goto: 'c36_a_ride',
        text: 'Лукас повторяет за тобой слово в слово, шевеля губами, чтобы не забыть. Потом говорит: в девять грузовик идёт в Люнебург, им не хватает рук. Если поедешь, отец будет рад.', effects: [set36('as', 'lukas'), w36('told_tobias', 'lukas'), until36(9, 0)] },
    ] }),

  X({ id: 'c36_a_ride', title: 'В Люнебург', location: jest36, camp: jestCamp, ambient: frost36,
    text: [
      { when: tobias36, text: '— Hilf mir in Lüneburg, — говорит Тобиас. — Zwei, drei Stunden. Die Krankenstation muss leer werden, und ich habe drei Mann und vierzig Kisten. Mittags gibt es Essen. Um zwei bin ich wieder hier.\n\nПомоги мне в Люнебурге. Два-три часа. Медпункт надо вывезти, а у меня три человека и сорок ящиков. В обед кормят. В два я снова здесь.' },
      { when: not(tobias36), text: 'Грузовик в Люнебург стоит с открытым бортом. Водитель, пожилой ефрейтор, смотрит на тебя: «Packst du mit an? Mittagessen gibt’s». Поможешь грузить? Обед будет.' },
      { when: carJest, text: 'Твоя Corsa стоит у забора пожарной части. Можно ехать следом за грузовиком на ней. Бензина хватит туда и обратно, но в обрез.' },
    ],
    actions: [
      { id: 'c36_ar_cab', label: 'Сесть в кабину рядом с Тобиасом', when: tobias36, minutes: 50, terminal: true, goto: 'c36_a_cab',
        text: 'В кабине пахнет мокрой шерстью и дизелем. Тобиас ведёт сам. Печка гудит, но греет только ноги.', effects: [set36('ar', 'cab'), until36(9, 10)] },
      { id: 'c36_ar_back', label: 'Ехать в кузове с солдатами', minutes: 50, terminal: true, goto: 'c36_a_soldiers', ambientDuring: frost36,
        text: 'Брезент хлопает на ветру. В кузове шестеро солдат на ящиках, все молодые. Тебе освобождают место у борта.', effects: [set36('ar', 'back'), until36(9, 10)] },
      { id: 'c36_ar_corsa', label: 'Ехать следом на своей Corsa', when: all(carJest, { fuelFor: 'opel_corsa', km: 54 }), minutes: 50, terminal: true, goto: 'c36_a_ice',
        text: 'Ты едешь за грузовиком метрах в тридцати. Брезент впереди качается, из-под колёс летит снежная пыль. Своя машина — свой час обратно, когда захочешь.', effects: [set36('ar', 'corsa'), set36('car_lue', true), { drive: 'opel_corsa', km: 25, to: lue36 }, until36(9, 10)] },
    ] }),

  X({ id: 'c36_a_cab', title: 'Кабина', location: 'c7_farm_lane', camp: jestCamp, ambient: cab36,
    text: [
      { text: 'Тобиас молчит до самого Гарльсторфа. Мимо съезда, где стояла колонна, он проезжает, не поворачивая головы. Потом говорит, глядя на дорогу:' },
      { text: '— Weißt du, was das Schlimmste ist? Nicht das Weggehen. Dass ich mich freue. Ein bisschen. Dass es vorbei ist.\n\nЗнаешь, что хуже всего? Не то, что уходим. То, что я рад. Немножко. Что это кончается.' },
      { when: flag('w.c35_gun_told'), text: 'Он спрашивает, где теперь ружьё. И держит ли кто-нибудь на хуторе патроны сухими.' },
    ],
    actions: [
      { id: 'c36_ac_hear', label: 'Сказать: это не стыдно', minutes: 40, terminal: true, goto: 'c36_a_gate',
        text: 'Тобиас коротко смеётся, без радости.\n\n— Doch. Ein bisschen schon.\n\nСтыдно. Немножко всё-таки.\n\nНо плечи у него опускаются, и дальше он ведёт спокойнее.', effects: [set36('ac', 'hear'), npc('c15_tobias', 1), until36(10, 0)] },
      { id: 'c36_ac_ask', label: 'Спросить, куда их отводят за Эльбой', minutes: 40, terminal: true, goto: 'c36_a_gate',
        text: '— Mölln. Dann Lübeck, sagen sie. Dann weiß keiner. — Он пожимает плечами. — Da oben ist es nicht besser, nur enger. Mehr Menschen, weniger Platz.\n\nМёльн. Потом Любек, говорят. Потом никто не знает. Там наверху не лучше, только теснее. Больше людей, меньше места.', effects: [set36('ac', 'ask'), w36('north_crowded', true), until36(10, 0)] },
      { id: 'c36_ac_quiet', label: 'Промолчать и смотреть в окно', minutes: 40, terminal: true, goto: 'c36_a_gate',
        text: 'Поля, лесополоса, замёрзшая канава. У Тосштедта на обочине стоит брошенный автобус с выбитыми стёклами, в окнах снег. Тобиас тоже молчит. Так легче вам обоим.', effects: [set36('ac', 'quiet'), { body: 'stress', delta: -2 }, until36(10, 0)] },
    ] }),

  X({ id: 'c36_a_soldiers', title: 'Кузов', location: 'c7_farm_lane', camp: jestCamp, ambient: frost36,
    text: [
      { text: 'Солдаты говорят о пятнадцатом так, будто это отпуск. Кто-то уже знает, что их отводят за Эльбу. Кто-то не верит.' },
      { text: 'Рядом с тобой парень лет девятнадцати, с обветренными губами. Он слышит, как ты говоришь солдату про Бухгольц, и спрашивает, не оттуда ли ты.' },
      { text: '— Meine Mutter wohnt in Buchholz. Kirchenstraße. Ich weiß nicht, ob sie noch da ist. Wenn du mal hinkommst… — Он достаёт из нагрудного кармана сложенный листок. — Nur unter die Tür schieben.\n\nМоя мать живёт в Бухгольце. Кирхенштрассе. Не знаю, там ли она ещё. Если будешь там… Просто подсунуть под дверь.' },
    ],
    actions: [
      { id: 'c36_ak_take', label: 'Взять письмо', minutes: 40, terminal: true, goto: 'c36_a_gate',
        text: 'Листок тёплый от его кармана. На нём адрес и имя: «Frau Ingrid Behrens». Парень кивает, отворачивается и до самого Люнебурга смотрит на дорогу.', effects: [set36('ak', 'take'), { give: 'c36_behrens_letter' }, w36('behrens_letter', true), until36(10, 0)] },
      { id: 'c36_ak_truth', label: 'Сказать честно: Бухгольц пустой, ты там был{m:|а}', minutes: 40, terminal: true, goto: 'c36_a_gate',
        text: 'Ты говоришь, что видел{m:|а}: тихие улицы, закрытые двери, мало людей. Парень слушает, кусая губу. Потом убирает листок обратно в карман. «Danke. Besser so». Спасибо. Лучше так.', effects: [set36('ak', 'truth'), until36(10, 0)] },
      { id: 'c36_ak_share', label: 'Поделиться с ним сухарями', minutes: 40, terminal: true, goto: 'c36_a_gate',
        text: 'Он берёт сухарь и ест медленно, как будто хочет растянуть. Остальные смотрят. Ты раздаёшь всё, что было в кармане. Про письмо он больше не говорит.', effects: [set36('ak', 'share'), { body: 'hunger', delta: 4 }, until36(10, 0)] },
    ] }),

  X({ id: 'c36_a_ice', title: 'Мост через Луэ', location: 'c7_farm_lane', camp: jestCamp, safe: false, ambient: cab36,
    text: [
      { text: 'Перед мостом через Луэ грузовик притормаживает и проходит мост шагом. На мосту блестит голый лёд: ветер сдул снег, и асфальт как стекло.' },
      { text: 'Грузовик уходит вперёд. Если отстанешь, на въезде в казарму придётся объяснять часовым, кто ты такой.' },
    ],
    actions: [
      { id: 'c36_ai_fast', label: 'Не сбавлять: проскочить, пока грузовик виден', minutes: 40, risky: true, terminal: true, goto: 'c36_a_gate', ambientDuring: cab36,
        outcomes: [
          { id: 'ok', check: { traits: ['driving'], difficulty: 3, uses: ['focus'] },
            text: 'Машину ведёт на середине моста, задок уходит вбок. Ты не трогаешь тормоз, чуть доворачиваешь руль, и Corsa выравнивается сама. За мостом ты догоняешь грузовик и только тогда выдыхаешь.',
            effects: [set36('ai', 'fast'), { body: 'stress', delta: 3 }, until36(10, 0)] },
          { id: 'skid',
            text: 'Задок уходит, ты бьёшь по тормозу, и Corsa разворачивает поперёк моста. Удар бампером о бордюр, голова мотается и бьётся о стойку. Мотор глохнет. Ты сидишь, пока не перестаёт звенеть в ушах. Потом заводишь и едешь дальше, уже медленно. Грузовик ждёт за поворотом: Тобиас вышел и смотрит.',
            effects: [set36('ai', 'skid'), { injure: 'bruise', site: 'head', severity: 1 }, { body: 'stress', delta: 8 }, w36('corsa_bumper', true), until36(10, 0)] },
        ] },
      { id: 'c36_ai_slow', label: 'Сбавить до шага, как грузовик', minutes: 50, terminal: true, goto: 'c36_a_gate', ambientDuring: cab36,
        text: 'Ты ползёшь по мосту на первой передаче. Руль не трогаешь. Грузовик уходит за поворот, и дальше ты едешь один. У ворот казармы часовой долго смотрит твой пропуск с прошлой недели и машет: проезжай.', effects: [set36('ai', 'slow'), until36(10, 10)] },
      { id: 'c36_ai_sand', label: 'Остановиться и посыпать мост песком из ящика у обочины', minutes: 55, activity: 'moderate', terminal: true, goto: 'c36_a_gate', ambientDuring: frost36,
        text: 'Ящик с песком смёрзся, ты разбиваешь корку каблуком. Две лопаты на колею, и мост проходишь спокойно. За тобой, ты видишь в зеркале, так же спокойно проходит чей-то трактор с прицепом.', effects: [set36('ai', 'sand'), { body: 'fatigue', delta: 3 }, until36(10, 15)] },
    ] }),

  X({ id: 'c36_a_gate', title: 'Казарма', location: lue36, camp: lueCamp, ambient: frost36,
    text: [
      { text: 'Ворота казармы открыты настежь. Во дворе рядами стоят грузовики, у плаца горят бочки: солдаты кидают в огонь папки, целыми коробками. Пепел летит через забор на улицу.' },
      { text: 'У забора снаружи стоят люди, человек двадцать. Женщины, старики, мужчина с ребёнком на плечах. Они смотрят на грузовики и на дым.' },
      { text: 'Оберлейтенант Хаазе стоит у ворот с планшетом и отмечает машины. Тебя он узнаёт по вчерашнему списку и кивает, не улыбаясь.' },
    ],
    actions: [
      { id: 'c36_aa_in', label: 'Пройти внутрь, не останавливаясь', minutes: 20, terminal: true, goto: 'c36_a_carry',
        text: 'Ты проходишь в ворота следом за грузовиком. Кто-то из-за забора кричит тебе в спину: «Was ist hier los? Haut ihr ab?» Что тут происходит? Вы сматываетесь? Ты не оборачиваешься.', effects: [set36('aa', 'in'), until36(10, 40)] },
      { id: 'c36_aa_fence', label: 'Подойти к людям у забора', minutes: 30, terminal: true, goto: 'c36_a_fence', ambientDuring: frost36,
        text: 'Ты подходишь к забору. Люди сразу поворачиваются к тебе: на тебе нет формы, значит, ты свой. Значит, скажешь правду.', effects: [set36('aa', 'fence'), until36(10, 30)] },
      { id: 'c36_aa_haase', label: 'Спросить Хаазе, зачем жгут папки', minutes: 20, terminal: true, goto: 'c36_a_carry',
        text: '— Datenschutz, — говорит Хаазе, не поднимая головы. Защита данных. — Was nicht mitkommt, bleibt nicht liegen.\n\nЧто не едет с нами, не остаётся лежать.\n\nОн ставит галочку и отворачивается.', effects: [set36('aa', 'haase'), w36('asked_burn', true), until36(10, 40)] },
    ] }),

  X({ id: 'c36_a_fence', title: 'У забора', location: lue36, camp: lueCamp, ambient: frost36,
    text: [
      { text: 'Женщина в мужской куртке хватает тебя за рукав через прутья.' },
      { text: '— Stimmt es, dass die Armee geht? Mein Mann sagt, die gehen. Wohin sollen wir dann? Wer bringt dann das Brot?\n\nПравда, что армия уходит? Муж говорит, уходят. Куда нам тогда? Кто тогда будет возить хлеб?' },
      { text: 'Двадцать лиц смотрят на тебя. Ты знаешь про пятнадцатое. Тобиас просил молчать: иначе завтра побегут все.' },
    ],
    actions: [
      { id: 'c36_af_truth', label: 'Сказать правду: пятнадцатого', minutes: 20, terminal: true, goto: 'c36_a_carry',
        text: 'Ты говоришь. Женщина отпускает рукав. Кто-то сзади переспрашивает, кто-то уже уходит быстрым шагом к городу. Через минуту у забора половина людей. К вечеру, ты понимаешь, это будет знать весь Люнебург.', effects: [set36('af', 'truth'), w36('fence_told', true), npc('c15_tobias', -1, 'c36_a_told_the_fence'), until36(10, 45)] },
      { id: 'c36_af_lie', label: 'Сказать: перегруппировка, ничего не знаю', minutes: 20, terminal: true, goto: 'c36_a_carry',
        text: '— Umgruppierung, — говоришь ты слово, которое слышал{m:|а} от солдат. Перегруппировка. Женщина смотрит тебе в глаза и отпускает рукав. Она тебе не верит. Но остаётся у забора ждать.', effects: [set36('af', 'lie'), { body: 'stress', delta: 3 }, until36(10, 45)] },
      { id: 'c36_af_advice', label: 'Не говорить дату, но сказать: запасайте дрова и воду, держитесь соседей', minutes: 25, terminal: true, goto: 'c36_a_carry',
        text: 'Женщина слушает, кивает медленно. «Also doch». Значит, всё-таки. Она не плачет и не кричит. Просто уходит к городу, на ходу пересчитывая что-то на пальцах. Двое идут за ней.', effects: [set36('af', 'advice'), w36('fence_warned', true), until36(10, 45)] },
    ] }),

  X({ id: 'c36_a_carry', title: 'Медпункт', location: lue36, camp: lueCamp, ambient: hall36,
    text: [
      { text: 'Медпункт казармы — два коридора, кабинеты, процедурная. Кабинет доктора Алерс пустой: стол без бумаг, шкаф открыт. Она уехала за Эльбу вчера, с госпитальным эшелоном.' },
      { text: 'На стене у её стола осталась белая доска. Красным маркером, крупно: «Studie P (Hannover): n = 212 / 0». Ноль обведён и перечёркнут. Ниже кто-то дописал синим: «Weitermachen».' },
      { text: 'Ящики с лекарствами стоят штабелями до потолка. Каждый — килограммов двадцать. Тобиас показывает: в кузов, по списку.' },
    ],
    actions: [
      { id: 'c36_ay_two', label: 'Носить по два ящика: быстрее закончить', minutes: 50, activity: 'heavy', risky: true, terminal: true, goto: 'c36_a_burn',
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'endurance'], difficulty: 3, uses: ['mobility'] },
            text: 'Два ящика, прижать к груди, по коридору, по ступенькам, в кузов. Двадцать ходок. Солдаты сначала смеются, потом перестают. К концу у тебя мокрая спина и пустая голова, а медпункт пуст наполовину.',
            effects: [set36('ay', 'two'), { body: 'fatigue', delta: 12 }, npc('c15_tobias', 1), until36(11, 30)] },
          { id: 'back',
            text: 'На седьмой ходке на ступеньке у выхода ты поскальзываешься на натоптанном снегу. Ящики летят в одну сторону, ты в другую, спиной о край ступеньки. Секунду не можешь вдохнуть. Солдат помогает встать. Дальше ты носишь по одному, медленно, и каждый вдох отдаёт под лопатку.',
            effects: [set36('ay', 'back'), { injure: 'bruise', site: 'torso', severity: 1 }, { body: 'fatigue', delta: 10 }, { body: 'stress', delta: 5 }, until36(11, 30)] },
        ] },
      { id: 'c36_ay_one', label: 'Носить по одному, без спешки', minutes: 50, activity: 'moderate', terminal: true, goto: 'c36_a_burn',
        text: 'По одному, через двор, в кузов. Тобиас смотрит на часы, но молчит. На ступеньках у выхода натоптан лёд, и ты обходишь его каждый раз сбоку.', effects: [set36('ay', 'one'), { body: 'fatigue', delta: 7 }, until36(11, 30)] },
      { id: 'c36_ay_list', label: 'Взять список и командовать погрузкой', minutes: 50, terminal: true, goto: 'c36_a_burn',
        text: 'Ты читаешь вслух: что, сколько, в какую машину. Солдаты носят. Так получается быстрее и без путаницы. На полях списка ты замечаешь: «Insulin — 0. Nachlieferung?» Инсулин — ноль. Довезут?', effects: [set36('ay', 'list'), w36('saw_insulin_zero', true), until36(11, 30)] },
    ] }),

  X({ id: 'c36_a_burn', title: 'Бочки', location: lue36, camp: lueCamp, ambient: frost36,
    text: [
      { text: 'Последний ящик в кузове. Ты выходишь отдышаться к бочкам у плаца. Солдат подкидывает в огонь папки из медпункта, по одной.' },
      { text: 'На одной папке ты успеваешь прочесть: «Studie P — Verlauf, Lüneburg, Kinder». Течение, Люнебург, дети. Солдат берёт её из стопки следующей.' },
    ],
    actions: [
      { id: 'c36_ab_take', label: 'Выхватить папку из стопки, пока не сгорела', minutes: 20, terminal: true, goto: 'c36_a_case',
        text: '— He! — Солдат тянется, но ты уже прячешь папку под куртку. Он машет рукой: какая разница. В папке листы с фамилиями, датами, цифрами. Возле каждой фамилии — крестик. У последних пяти крестиков нет.', effects: [set36('ab', 'take'), { give: 'c36_p_file' }, w36('p_file', true), until36(11, 50)] },
      { id: 'c36_ab_read', label: 'Попросить подождать и прочитать первую страницу', minutes: 20, terminal: true, goto: 'c36_a_case',
        text: 'Солдат пожимает плечами и даёт тебе минуту. Первая страница — таблица: дети, возраст, даты переливаний. Восемнадцать фамилий. Новак, Тим. Ты отдаёшь папку. Она сворачивается в огне, как лист.', effects: [set36('ab', 'read'), { body: 'stress', delta: 4 }, until36(11, 50)] },
      { id: 'c36_ab_leave', label: 'Отвернуться: пусть горит', minutes: 15, terminal: true, goto: 'c36_a_case',
        text: 'Ты отворачиваешься. За спиной трещит огонь. Что было в этих папках, ты уже знаешь. Знать подробнее ничего не изменит.', effects: [set36('ab', 'leave'), until36(11, 50)] },
    ] }),

  X({ id: 'c36_a_case', title: 'Кейс Ройтера', location: lue36, camp: lueCamp, ambient: hall36,
    text: [
      { text: 'В углу пустого кабинета Алерс стоит коричневый кожаный кейс, старый, с латунными уголками. На ручке бирка: «OStArzt Dr. Reuter».' },
      { when: tobias36, text: '— Reuters Koffer, — говорит Тобиас с порога. — Kam mit den Papieren von der Kolonne. Seitdem steht er hier. Keiner kennt die Zahlen. Wenn du ihn aufkriegst — was drin ist, gehört dir. Er braucht es nicht mehr.\n\nКейс Ройтера. Приехал с бумагами из колонны. С тех пор так и стоит. Никто не знает цифр. Откроешь — всё, что внутри, твоё. Ему уже не нужно.' },
      { when: not(tobias36), text: 'Ефрейтор у двери пожимает плечами: «Der Koffer vom toten Doktor. Keiner kennt die Zahlen. Mach, was du willst». Кейс мёртвого доктора. Никто не знает цифр. Делай что хочешь.' },
      { text: 'Замок на три колёсика с цифрами. Три цифры.' },
    ],
    actions: [
      { id: 'c36_ca_212', label: 'Набрать 2-1-2', minutes: 15, terminal: true, goto: 'c36_a_open',
        text: 'Колёсики щёлкают. Два, один, два. Замок отскакивает сразу, с тугим звуком, как будто ждал.', effects: [set36('ca', '212'), set36('case_open', true), w36('case', 'open'), until36(12, 5)] },
      { id: 'c36_ca_120', label: 'Набрать 1-2-0', minutes: 15, terminal: true, goto: 'c36_a_case2',
        text: 'Один, два, ноль. Замок не поддаётся.', effects: [set36('ca', '120'), until36(12, 5)] },
      { id: 'c36_ca_221', label: 'Набрать 2-2-1', minutes: 15, terminal: true, goto: 'c36_a_case2',
        text: 'Два, два, один. Ничего.', effects: [set36('ca', '221'), until36(12, 5)] },
      { id: 'c36_ca_210', label: 'Набрать 2-1-0', minutes: 15, terminal: true, goto: 'c36_a_case2',
        text: 'Два, один, ноль. Колёсики проворачиваются впустую.', effects: [set36('ca', '210'), until36(12, 5)] },
      { id: 'c36_ca_leave', label: 'Не трогать вещи мёртвого', minutes: 10, terminal: true, goto: 'c36_a_lists',
        text: 'Ты ставишь кейс обратно в угол, ручкой к стене. Пусть уезжает с ними или сгорит с бумагами. Это не твоё.', effects: [set36('ca', 'leave'), w36('case', 'left'), until36(12, 10)] },
    ] }),

  X({ id: 'c36_a_case2', title: 'Замок', location: lue36, camp: lueCamp, ambient: hall36,
    text: [
      { text: 'Колёсики тугие, на латуни царапины от чужих попыток. Кто-то уже пробовал до тебя.' },
      { when: tobias36, text: 'Тобиас ждёт у двери и смотрит на часы. Через десять минут обед.' },
    ],
    actions: [
      { id: 'c36_a2_212', label: 'Набрать 2-1-2', minutes: 15, terminal: true, goto: 'c36_a_open',
        text: 'Два, один, два. Замок отскакивает.', effects: [set36('a2', '212'), set36('case_open', true), w36('case', 'open'), until36(12, 20)] },
      { id: 'c36_a2_bar', label: 'Сбить замок ломиком из пожарного щита', minutes: 20, terminal: true, goto: 'c36_a_open',
        text: 'Ломик входит под замок, ты налегаешь. Скрежет на весь коридор, латунь лопается. Солдат заглядывает в дверь, Тобиас машет ему рукой: всё нормально. Но смотрит на тебя без улыбки. Внутри что-то звякнуло, когда кейс подпрыгнул.', effects: [set36('a2', 'bar'), set36('case_open', true), set36('case_broken', true), w36('case', 'broken'), npc('c15_tobias', -1), until36(12, 25)] },
      { id: 'c36_a2_leave', label: 'Оставить', minutes: 10, terminal: true, goto: 'c36_a_lists',
        text: 'Ты ставишь кейс обратно в угол. Может, кто-то из уезжающих знает цифры. Может, нет.', effects: [set36('a2', 'leave'), w36('case', 'left'), until36(12, 25)] },
    ] }),

  X({ id: 'c36_a_open', title: 'Что было у Ройтера', location: lue36, camp: lueCamp, ambient: hall36,
    text: [
      { text: 'Внутри аккуратно, по-врачебному. Свёрнутый зимний спальник в чехле. Хирургический набор в кожаном футляре: иглы, нити, зажим. Блистер амоксициллина. Сверху — конверт без марки, надписанный от руки: «Für Ulrike. Falls».' },
      { when: flag('$.c36_case_broken'), text: 'Склянка с йодом в боковом кармане лопнула. Спальник с одного края в рыжих пятнах.' },
      { text: '«Для Ульрики. На случай». Конверт не заклеен.' },
    ],
    actions: [
      { id: 'c36_ao_take', label: 'Забрать всё, письмо — отдать на почту Красного Креста', minutes: 15, terminal: true, goto: 'c36_a_lists',
        text: 'Спальник, набор и таблетки ты укладываешь в рюкзак. Письмо — во внутренний карман, отдельно. В Винзене есть почта Красного Креста. Кто-нибудь знает, где Ульрика Ройтер.', effects: [set36('ao', 'take'), { give: 'c36_sleepbag' }, { give: 'c36_suture' }, { give: 'c25_amoxi' }, { give: 'c36_reuter_letter' }, w36('reuter_letter', 'carry'), until36(12, 30)] },
      { id: 'c36_ao_read', label: 'Прочитать письмо', minutes: 20, terminal: true, goto: 'c36_a_lists',
        text: 'Почерк врача, мелкий, ровный. «Ulrike, wenn Du das liest, bin ich nicht zurück. Ich habe getan, was man mir gesagt hat, und es war falsch. Sag den Kindern, ich war nicht feige. Nur gehorsam». Ульрика, если ты читаешь это, я не вернулся. Я делал, что мне говорили, и это было неправильно. Скажи детям, я не был трусом. Только послушным. Ты складываешь лист обратно. Всё остальное из кейса забираешь с собой.', effects: [set36('ao', 'read'), { give: 'c36_sleepbag' }, { give: 'c36_suture' }, { give: 'c25_amoxi' }, { give: 'c36_reuter_letter' }, w36('reuter_letter', 'read'), { body: 'stress', delta: 3 }, until36(12, 30)] },
      { id: 'c36_ao_tobias', label: 'Взять вещи, а письмо отдать Тобиасу: армия найдёт жену', minutes: 15, terminal: true, goto: 'c36_a_lists',
        text: 'Тобиас берёт конверт двумя пальцами, как берут что-то горячее, и прячет в планшет. «Ich frag nach. Versprochen». Я спрошу. Обещаю.', effects: [set36('ao', 'tobias'), { give: 'c36_sleepbag' }, { give: 'c36_suture' }, { give: 'c25_amoxi' }, w36('reuter_letter', 'army'), npc('c15_tobias', 1), until36(12, 30)] },
    ] }),

  X({ id: 'c36_a_lists', title: 'Списки', location: lue36, camp: lueCamp, ambient: hall36,
    text: [
      { text: 'Хаазе зовёт тебя в комендатуру: вынести коробки с картотекой. На каждой коробке надпись: «Erfassung LK Harburg». Его учёт.' },
      { when: listedMed, text: 'Верхняя карточка в открытой коробке — ваш хутор. Твоё имя, имя {partner.gen}. Рядом с её именем отдельная графа, красным: «Sanitätspersonal — ab 15.12. dienstverpflichtbar». Медицинский персонал. С пятнадцатого подлежит привлечению.' },
      { when: lea36, text: 'На столе Хаазе стопка листов другого цвета: «Evakuierte — Bergen-Hohne», лагерь у Целле. Списки по алфавиту.' },
      { text: 'Хаазе выходит к машинам. В комнате ты один{m:|а} на минуту.' },
    ],
    actions: [
      { id: 'c36_al_lea', label: 'Найти в списках Бергена фамилию Хартман', when: lea36, minutes: 25, terminal: true, goto: 'c36_a_mess',
        text: 'Буква H, третий лист. «Hartmann, Petra, 49. Hartmann, Finn, 12. Eingang 2.12., Block 4». Поступили второго декабря, четвёртый корпус. Ты переписываешь строчку на обрывок, пока не вернулся Хаазе.', effects: [set36('al', 'lea'), w36('lea_list', true), until36(13, 0)] },
      { id: 'c36_al_pull', label: 'Вытащить её карточку из коробки', when: listedMed, minutes: 20, risky: true, terminal: true, goto: 'c36_a_mess',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['focus'] },
            text: 'Ты вынимаешь карточку и суёшь за пазуху. Коробка закрывается. Хаазе возвращается, кивает тебе: неси. Ты несёшь. Карточка царапает кожу краем всю дорогу до грузовика.',
            effects: [set36('al', 'pull'), w36('b_card_pulled', true), until36(13, 0)] },
          { id: 'caught',
            text: '— Zurücklegen. — Хаазе стоит в дверях. Голос ровный, без злости. — Das ist kein Befehl, das ist eine Liste. Freiwillig. Vorerst.\n\nПоложите обратно. Это не приказ, это список. Добровольно. Пока.\n\nТы кладёшь карточку. Он записывает что-то в блокнот и больше не оставляет тебя в комнате одного.',
            effects: [set36('al', 'caught'), w36('haase_caught', true), npc('c15_tobias', -1), { body: 'stress', delta: 5 }, until36(13, 0)] },
        ] },
      { id: 'c36_al_ask', label: 'Дождаться Хаазе и спросить прямо про красную графу', when: listedMed, minutes: 20, terminal: true, goto: 'c36_a_mess',
        text: '— Freiwillig, — говорит Хаазе. Добровольно. — Wir nehmen mit, wer mit will und etwas kann. Ärzte, Schwestern, Mechaniker. Vorerst freiwillig.\n\nБерём тех, кто хочет и умеет. Врачей, сестёр, механиков. Пока добровольно.\n\nСлово «пока» он говорит так же ровно, как все остальные.', effects: [set36('al', 'ask'), w36('asked_haase', true), until36(13, 0)] },
      { id: 'c36_al_card', label: 'Прочитать, что записано про ваш хутор', minutes: 25, terminal: true, goto: 'c36_a_mess',
        text: 'Карточка хутора исписана мелко. Жильцы, возраст, профессии. Ниже, в графе «Material»: «Traktor (Diesel), PKW Opel, Stromaggregat?». Вопросительный знак у генератора подчёркнут. Ещё ниже карандашом: «Requirierung 9.12.». Девятое — это завтра.', effects: [set36('al', 'card'), w36('saw_card', true), until36(13, 0)] },
      { id: 'c36_al_carry', label: 'Просто вынести коробки', minutes: 25, terminal: true, goto: 'c36_a_mess',
        text: 'Коробки лёгкие: бумага, бумага, бумага. Ты носишь их в грузовик Хаазе. Восемь коробок. В каждой — сотни фамилий, кто где живёт и что умеет.', effects: [set36('al', 'carry'), until36(13, 0)] },
    ] }),

  X({ id: 'c36_a_mess', title: 'Столовая', location: lue36, camp: lueCamp, ambient: hall36,
    text: [
      { text: 'Столовая казармы наполовину разобрана: столы сдвинуты к стене, скамьи уже в грузовиках. Солдаты едят стоя, из котелков. Повар наливает тебе гороховый суп с сосиской, не спрашивая, кто ты.' },
      { when: tobias36, text: 'Тобиас ведёт тебя после обеда на склад продуктов за столовой. Полки до потолка: банки, мешки, коробки пайков.\n\n— Was nicht auf die Laster passt, geht am Vierzehnten an den Kreis. Brandt verteilt. Oder es holt sich, wer zuerst kommt. — Он кивает на полки. — Eine Kiste. Für heute. Mehr nicht.\n\nЧто не влезет в грузовики, четырнадцатого уйдёт округу. Брандт делит. Или возьмёт, кто первым придёт. Один ящик. За сегодня. Больше нельзя.' },
      { when: not(tobias36), text: 'Повар, услышав, что ты грузил{m:|а} медпункт, отводит тебя на склад и показывает на полки: «Eine Kiste. Mehr nicht». Один ящик. Больше нельзя.' },
    ],
    actions: [
      { id: 'c36_am_jars', label: 'Взять ящик тушёнки', minutes: 40, terminal: true, goto: 'c36_a_back',
        text: 'Шесть стеклянных банок в соломе. Тяжело, но это мясо на неделю для всего дома.', effects: [set36('am', 'jars'), { if: flag('$.c36_car_lue'), then: [{ drive: 'opel_corsa', km: 25, to: jest36 }] }, ...fed36, { give: 'c26_jar', qty: 6 }, w36('depot_seen', true), until36(13, 45)] },
      { id: 'c36_am_epa', label: 'Взять коробку суточных пайков', minutes: 40, terminal: true, goto: 'c36_a_back',
        text: 'Четыре армейских пайка в коробке. Лёгкие, не портятся, можно взять в дорогу. Солдат у полок кивает: хороший выбор.', effects: [set36('am', 'epa'), { if: flag('$.c36_car_lue'), then: [{ drive: 'opel_corsa', km: 25, to: jest36 }] }, ...fed36, { give: 'c24_epa', qty: 4 }, w36('depot_seen', true), until36(13, 45)] },
      { id: 'c36_am_choc', label: 'Взять шоколад: детям в доме', minutes: 40, terminal: true, goto: 'c36_a_back',
        text: 'Десять плиток армейского шоколада, горького. Ты думаешь о Нине и о стариках, о Рождестве, до которого ещё две недели.', effects: [set36('am', 'choc'), { if: flag('$.c36_car_lue'), then: [{ drive: 'opel_corsa', km: 25, to: jest36 }] }, ...fed36, { give: 'chocolate', qty: 10 }, w36('depot_seen', true), until36(13, 45)] },
      { id: 'c36_am_none', label: 'Не брать: пусть останется округу', minutes: 30, terminal: true, goto: 'c36_a_back',
        text: 'Ты качаешь головой. Четырнадцатого это будут делить на всех, и твой ящик кому-то не достанется. Тобиас смотрит на тебя странно, потом пожимает плечами.', effects: [set36('am', 'none'), { if: flag('$.c36_car_lue'), then: [{ drive: 'opel_corsa', km: 25, to: jest36 }] }, ...fed36, w36('depot_seen', true), w36('depot_left', true), npc('c15_tobias', 1), until36(13, 45)] },
    ] }),

  X({ id: 'c36_a_back', title: 'Обратно', location: 'c7_farm_lane', camp: jestCamp, safe: false, ambient: cab36,
    text: [
      { text: 'Обратно едут быстрее: грузовик пустой, дорога знакомая. У съезда к Гарльсторфу водитель вдруг сбрасывает газ.' },
      { text: 'В канаве у обочины кто-то шевелится. Обращённый, в больничной рубашке поверх свитера, ползёт по снегу к дороге. Медленно, на локтях: мороз его держит. Но ползёт.' },
      { when: all(tobias36, not(flag('$.c36_car_lue'))), text: 'Тобиас смотрит на тебя: «Halten oder weiter?» Остановиться или дальше?' },
      { when: flag('$.c36_car_lue'), text: 'Ты едешь следом в своей Corsa. Грузовик впереди встаёт, из кабины машут тебе рукой: решай.' },
    ],
    actions: [
      { id: 'c36_bk_soldiers', label: 'Сказать: пусть солдаты', minutes: 30, terminal: true, goto: 'c36_a_jest',
        text: 'Двое солдат спрыгивают из кузова. Один короткий удар прикладом. Они возвращаются молча, вытирая приклад о снег. Грузовик трогается.', effects: [set36('bk', 'soldiers'), until36(15, 15)] },
      { id: 'c36_bk_self', label: 'Выйти самому: ломиком, пока он медленный', minutes: 30, activity: 'moderate', risky: true, terminal: true, goto: 'c36_a_jest', ambientDuring: frost36,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 2, uses: ['mobility'] },
            text: 'Он поднимает голову на скрип снега. Ты бьёшь один раз, сверху, как учили. Всё. Когда ты возвращаешься в кабину, руки дрожат, но не от холода. Тобиас ничего не говорит, только кивает.',
            effects: [set36('bk', 'self'), npc('c15_tobias', 1), { body: 'stress', delta: 5 }, until36(15, 15)] },
          { id: 'slip',
            text: 'Ты скользишь на краю канавы, и удар приходится в плечо, не в голову. Он хватает тебя за штанину и тянет. Ты падаешь на колено, бьёшь ещё, ещё, пока он не отпускает. Колено разбито о лёд. Солдаты уже рядом. Брюки целы, кожа под ними нет.',
            effects: [set36('bk', 'slip'), { injure: 'bruise', site: 'leftLeg', severity: 1 }, { body: 'stress', delta: 10 }, until36(15, 15)] },
        ] },
      { id: 'c36_bk_mark', label: 'Ехать дальше и отметить место для дружины', minutes: 30, terminal: true, goto: 'c36_a_jest',
        text: 'Ты записываешь на полях своей ладони ручкой Тобиаса: съезд, правая канава. Когда мороз отпустит, их тут будет больше. Брандт должен знать, где они выходят к дороге.', effects: [set36('bk', 'mark'), w36('ditch_marked', true), until36(15, 15)] },
    ] }),

  X({ id: 'c36_a_jest', title: 'Йестебург', location: jest36, camp: jestCamp, ambient: frost36,
    text: [
      { text: 'Четверть четвёртого. Грузовик встаёт у пожарной части. Уже смеркается: в декабре день кончается, едва начавшись.' },
      { when: all(tobias36, east36('yes')), text: 'Тобиас пожимает тебе руку дольше обычного: «Fünfzehnter. Fünf Uhr». Пятнадцатое. Пять утра.' },
      { when: all(tobias36, east36('give'), kasiaGoes36), text: 'Тобиас напоминает: Кася и Эва, до четырнадцатого, сами, с документами.' },
      { when: all(tobias36, east36('give'), not(kasiaGoes36)), text: 'Тобиас напоминает: если Кася и Эва решатся — до четырнадцатого, сами, с документами.' },
      { when: all(tobias36, east36('no')), text: 'Тобиас хлопает тебя по плечу и уходит к машинам, не оглядываясь.' },
      { when: flag('w.c36_lea_list'), text: 'В кармане листок с двумя фамилиями. Пункт Зандер в двух улицах отсюда, Лея там до вечера.' },
      { when: flag('w.c35_brandt_ask'), text: 'У ворот пожарной части Брандт разговаривает с двумя дружинниками. Увидев тебя, он поднимает руку: подожди.' },
    ],
    actions: [
      { id: 'c36_aj_lea', label: 'Зайти к Лее с листком', when: flag('w.c36_lea_list'), minutes: 30, terminal: true, goto: 'c36_a_lea',
        text: 'Ты идёшь к пункту по скрипучему снегу. Окна пункта уже горят.', effects: [set36('aj', 'lea'), until36(15, 30)] },
      { id: 'c36_aj_brandt', label: 'Подождать Брандта', when: flag('w.c35_brandt_ask'), minutes: 30, terminal: true, goto: 'c36_a_brandt',
        text: 'Брандт отпускает дружинников и подходит, стягивая перчатку.', effects: [set36('aj', 'brandt'), until36(15, 30)] },
      { id: 'c36_aj_home', label: 'Сразу домой', minutes: 30, terminal: true, goto: 'c36_a_home',
        text: 'Ты не задерживаешься. Хочется домой, к печке. Хочется знать, как там Винзен.', effects: [set36('aj', 'home'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, until36(15, 45)] },
    ] }),

  X({ id: 'c36_a_lea', title: 'Лея', location: jest36, camp: jestCamp, ambient: hall36,
    text: [
      { text: 'Лея моет инструменты в тазу. Ты кладёшь листок рядом с тазом. Она вытирает руки о халат, берёт его и читает. Потом читает ещё раз.' },
      { text: '— Bergen. — Голос у неё сухой, как всегда. Только пальцы, держащие листок, белеют на костяшках. — Zweiter Dezember. Die leben. Die haben am Zweiten noch gelebt.\n\nБерген. Второго декабря. Они живы. Второго ещё были живы.' },
      { text: 'Она смотрит на тебя. Берген — восемьдесят километров на восток, за Целле. Армия уходит через неделю.' },
    ],
    actions: [
      { id: 'c36_al2_help', label: 'Пообещать помочь ей добраться, когда станет ясно, как', minutes: 30, terminal: true, goto: 'c36_a_home',
        text: 'Лея кивает, не отвечая. Убирает листок в нагрудный карман халата, под ручку. Когда ты уходишь, она говорит тебе в спину: «Danke». Первый раз за всё время ты слышишь от неё это слово.', effects: [set36('al2', 'help'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, npc('c21_lea', 3, 'c36_a_brought_bergen'), w36('lea_promise', true), until36(16, 0)] },
      { id: 'c36_al2_wait', label: 'Сказать: не ходи одна, сначала дождись, что будет после пятнадцатого', minutes: 30, terminal: true, goto: 'c36_a_home',
        text: '— Ich bin keine Idiotin, — говорит Лея. Я не дура. — Aber danke.\n\nОна складывает листок вчетверо и прячет. Ты видишь: она уже считает дни.', effects: [set36('al2', 'wait'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, npc('c21_lea', 2, 'c36_a_brought_bergen'), until36(16, 0)] },
      { id: 'c36_al2_leave', label: 'Ничего не говорить: пусть побудет одна', minutes: 20, terminal: true, goto: 'c36_a_home',
        text: 'Ты выходишь тихо. В окне видно: она сидит на табурете у таза, с листком в руках, и не двигается.', effects: [set36('al2', 'leave'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, npc('c21_lea', 2, 'c36_a_brought_bergen'), until36(16, 0)] },
    ] }),

  X({ id: 'c36_a_brandt', title: 'Брандт', location: jest36, camp: jestCamp, ambient: frost36,
    text: [
      { text: '— Der Fünfzehnte, — говорит Брандт без предисловий. Пятнадцатое. Он, похоже, уже знает, что ты знаешь. — Danach sind wir allein. Ich brauche an jedem Bach einen, der nachts guckt. An der Seeve, hinter eurem Hof, brauche ich einen, der den Weg kennt.\n\nПосле него мы одни. Мне нужен на каждом ручье человек, который смотрит ночью. На Зеве, за вашим хутором, — тот, кто знает дорогу.' },
      { when: flag('w.c36_ditch_marked'), text: 'Ты показываешь ему ладонь с записью: съезд у Гарльсторфа, правая канава. Брандт смотрит и кивает: «Gut. Genau so was».' },
    ],
    actions: [
      { id: 'c36_ab2_yes', label: 'Согласиться: Зеве — твой участок', minutes: 30, terminal: true, goto: 'c36_a_home',
        text: 'Брандт протягивает руку. Рукопожатие короткое и крепкое. «Ein Signal: drei Schüsse oder die Glocke an der Feuerwehr». Сигнал: три выстрела или колокол на пожарной части. Ты повторяешь, чтобы запомнить.', effects: [set36('ab2', 'yes'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, w36('seeve_watch', true), until36(16, 0)] },
      { id: 'c36_ab2_yard', label: 'Сказать: свой двор — да, за весь ручей не отвечаю', minutes: 30, terminal: true, goto: 'c36_a_home',
        text: 'Брандт молчит, потом кивает. «Ehrlich. Ist mir lieber als ein Versprechen, das keiner hält». Честно. Мне это лучше, чем обещание, которое никто не сдержит.', effects: [set36('ab2', 'yard'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, until36(16, 0)] },
      { id: 'c36_ab2_think', label: 'Сказать, что решишь вместе с {partner.ins}', minutes: 30, terminal: true, goto: 'c36_a_home',
        text: '— Bis Sonntag, — говорит Брандт. До воскресенья. — Dann ist Rat. Bei der Feuerwehr, nach dem Gottesdienst.\n\nПотом совет. В пожарной части, после службы.', effects: [set36('ab2', 'think'), { if: carJest, then: [{ drive: 'opel_corsa', km: 4, to: farm36 }] }, w36('council_sunday', true), until36(16, 0)] },
    ] }),

  X({ id: 'c36_a_home', title: 'Дома до темноты', camp: yard14, ambient: frost36,
    text: [
      { text: 'Хутор в сумерках. Из трубы кухни ровный дым. {partner} ещё не вернулась из Винзена.' },
      { when: flag('w.c36_corsa_bumper'), text: 'Передний бампер треснул от удара о бордюр. Ехать можно, вид жалкий.' },
      { when: evaHere, text: 'Эва во дворе снимает с верёвки бельё, застывшее колом. Простыни гнутся, как фанера.' },
    ],
    actions: [
      { id: 'c36_ah_wood', label: 'Наколоть дров к ночи', minutes: 40, activity: 'heavy', terminal: true, goto: 'c36_yard', ambientDuring: frost36,
        text: 'Колун, полено, колун, полено. Это работа, после которой голова пустая. Как раз то, что нужно после такого дня.', effects: [set36('ah', 'wood'), { body: 'fatigue', delta: 8 }, until36(17, 0)] },
      { id: 'c36_ah_car', label: 'Проверить Corsa: аккумулятор, масло, бензин', minutes: 40, terminal: true, goto: 'c36_yard', ambientDuring: frost36,
        text: 'Ты поднимаешь капот. Масло в норме, аккумулятор крутит бодро. Бензина в баке на донышке больше, чем ты думал{m:|а}, но меньше, чем хочется перед десятым.', effects: [set36('ah', 'car'), w36('car_checked', true), until36(17, 0)] },
      { id: 'c36_ah_henrike', label: 'Рассказать Хенрике про склад казармы и четырнадцатое', minutes: 40, terminal: true, goto: 'c36_yard',
        text: 'Хенрике слушает, вытирая руки о фартук. Потом говорит: «Am Vierzehnten fährt Ole mit dem Trecker. Oder du. Aber einer fährt». Четырнадцатого Оле поедет на тракторе. Или ты. Но кто-то поедет.', effects: [set36('ah', 'henrike'), w36('henrike_depot', true), npc('henrike', 1), until36(17, 0)] },
    ] }),
];
