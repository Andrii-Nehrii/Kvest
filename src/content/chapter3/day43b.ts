import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import {
  S43, farm43, hansenDead43, merle43, merleTrip43, nina43, ninaTrip43, parents43, sat43, set43, sun43, until43, w43,
  winsen43,
} from './point43';

// Участок 43, линия B. Суббота — Винзен на автобусе Красного Креста: с Мерле (ветклиника), с Ниной (запись в школу) или одна
// (лекарства по списку Зандер). Красный Крест: колонна в Гамбург 28-го для тех, кому нужен инсулин (без Мерле — работа в пункте
// Винзена). Мерле: делит дозы пополам с середы и в Гамбург ехать не хочет — просит молчать. Воскресенье: Уте рассказывает, почему
// Яннес ушёл с поста (её крик, мёртвые у двери); выпечка, Мерле или Нина, кофе в три, сумерки.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S43({ ...scene, for: 'any', chapter: 'ch3' });
const W = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: winsen43, camp: scene.camp ?? { at: winsen43, stock: 'c3_farm_stock', rest: false }, safe: false });
const alone: Cond = all(not(merleTrip43), not(ninaTrip43));
const toWinsen = { move: winsen43 };
const toFarm = { move: farm43 };
const guestsN: Cond = v('w.c42_advent_guests', 'neighbors');

export const day43BScenes: Scene[] = [
  // ═════════════ Суббота ═════════════
  X({ id: 'c43_b_bus', title: 'Автобус', camp: yard14, ambient: sat43,
    text: [
      { text: 'У пожарной части в восемь — белый автобус с красным крестом на борту, стёкла в инее. Водитель курит у двери.' },
      { when: merleTrip43, text: 'Мерле рядом с тобой, в двух шарфах. В кармане блокнот с вопросами для ветеринара: «U-40? Spritzen? Einheiten?»' },
      { when: ninaTrip43, text: 'Нина с тобой, в лучшей куртке, с папкой школьных тетрадей под мышкой. Записываться в школу надо лично.' },
      { when: alone, text: 'С тобой только список доктора Зандер: что взять в аптеке Красного Креста, если дадут.' },
    ],
    actions: [
      { id: 'c43_bb_talk', label: 'Ждать у двери и разговаривать', minutes: 40, terminal: true, goto: 'c43_b_ride', ambientDuring: sat43,
        text: 'Водитель рассказывает, что в Винзене снова работает пекарня и что в школе теперь триста человек. Ты слушаешь и стучишь ногой об ногу.', effects: [set43('bb', 'talk'), until43(49, 8, 0)] },
      { id: 'c43_bb_old', label: 'Помочь старухе с сумками сесть в автобус', minutes: 40, terminal: true, goto: 'c43_b_ride', ambientDuring: sat43,
        text: 'Две сумки, обе тяжёлые: банки. Старуха едет в Винзен к сестре и везёт ей всё, что осталось от погреба. Садится у окна и держит тебя за рукав до самого отъезда.', effects: [set43('bb', 'old'), until43(49, 8, 0)] },
      { id: 'c43_bb_list', label: 'Пересчитать, что можно отдать на обмен', minutes: 30, terminal: true, goto: 'c43_b_ride',
        text: 'Десяток яиц в шапке, два куска мыла, пачка чая. Всё, что Хенрике разрешила взять. Негусто, но в Винзене за мыло дают хлеб.', effects: [set43('bb', 'list'), until43(49, 7, 50)] },
    ] }),

  X({ id: 'c43_b_ride', title: 'Дорога', camp: yard14, ambient: sat43,
    text: [
      { text: 'Автобус идёт медленно, по колее в снегу. За окном поля, брошенные машины на обочине, все в снегу по крышу. На въезде в Винзен — пост дружины и щит: «Rotes Kreuz — Schule».' },
    ],
    actions: [
      { id: 'c43_bri_window', label: 'Смотреть в окно', minutes: 70, terminal: true, goto: 'c43_b_desk', effects: [set43('bri', 'window'), toWinsen, until43(49, 9, 15)],
        text: 'Дорога белая и пустая, по обочинам горбами стоят занесённые машины. У одного дома на крыльце висит венок. Значит, там кто-то живёт.' },
      { id: 'c43_bri_merle', label: 'Повторить с Мерле вопросы для ветеринара', when: merleTrip43, minutes: 70, terminal: true, goto: 'c43_b_desk', effects: [set43('bri', 'merle'), toWinsen, until43(49, 9, 15)],
        text: 'Мерле читает вслух, ты поправляешь. U-40 — значит, в миллилитре сорок единиц, а не сто. Шприцы нужны свои. Ошибёшься — сахар упадёт. Мерле говорит: «Ich weiß. Ich rechne seit Tagen». Знаю. Я считаю уже несколько дней.' },
      { id: 'c43_bri_nina', label: 'Послушать, что Нина хочет сказать учителям', when: ninaTrip43, minutes: 70, terminal: true, goto: 'c43_b_desk', effects: [set43('bri', 'nina'), toWinsen, until43(49, 9, 15)],
        text: 'Нина репетирует шёпотом, по-немецки: имя, класс, школа, что учила. На слове «отец» сбивается и начинает снова, без него.' },
      { id: 'c43_bri_sleep', label: 'Подремать: ночью почти не {m:спал|спала}', minutes: 70, terminal: true, goto: 'c43_b_desk', effects: [set43('bri', 'sleep'), toWinsen, { body: 'fatigue', delta: -6 }, until43(49, 9, 15)],
        text: 'Ты засыпаешь, привалившись к холодному стеклу. Просыпаешься, когда автобус уже стоит у школы.' },
    ] }),

  W({ id: 'c43_b_desk', title: 'Красный Крест', ambient: sat43,
    text: [
      { text: 'В фойе школы стол с клеёнкой. Координатор Красного Креста, женщина с седой косой, узнаёт тебя: «Die Krankenschwester vom Lüdemann-Hof». Медсестра с хутора Людеманов.' },
      { when: merle43, text: '— Am achtundzwanzigsten fährt eine Kolonne nach Hamburg, ins UKE. Für die, die Insulin oder Dialyse brauchen. Dort gibt es beides. Ein Platz pro Patient, eine Begleitung. Zurück erst, wenn die Straßen frei sind. Vielleicht im Frühjahr.\n\nДвадцать восьмого колонна в Гамбург, в университетскую больницу. Для тех, кому нужен инсулин или диализ: там есть и то и другое. Место на больного и одно на сопровождающего. Обратно — когда дороги откроются. Может, весной.' },
      { when: merle43, text: 'Она пишет на листке: «Merle — Platz frei bis 24.» Место свободно до двадцать четвёртого.' },
      { when: not(merle43), text: '— Wir brauchen eine Schwester. Hier, in der Schule. Montag bis Donnerstag, mit Übernachtung. Zehn Kilo Mehl die Woche für Ihren Hof. Ab Januar.\n\nНам нужна медсестра. Здесь, в школе. С понедельника по четверг, с ночёвкой. Десять кило муки в неделю для вашего двора. С января.' },
    ],
    actions: [
      { id: 'c43_bd_paper', label: 'Взять листок и сказать: решим дома', minutes: 45, terminal: true, goto: 'c43_b_vet',
        text: 'Ты складываешь листок вчетверо и кладёшь во внутренний карман. Координатор кивает: так все говорят. Половина возвращается с ответом, половина — нет.', effects: [set43('bd', 'paper'), w43('offer_known', true), until43(49, 10, 15)] },
      { id: 'c43_bd_ask', label: 'Расспросить подробно: как, где, кто', minutes: 45, terminal: true, goto: 'c43_b_vet',
        text: 'Колонна армейская, две машины Красного Креста в середине. Ночёвка в Харбурге. Обратно сопровождающих довезут через неделю, если мост в Гамбурге открыт. Если закрыт — весной. Ты записываешь всё.', effects: [set43('bd', 'ask'), w43('offer_known', true), until43(49, 10, 15)] },
      { id: 'c43_bd_think', label: 'Отойти к окну и подумать', minutes: 45, terminal: true, goto: 'c43_b_vet',
        text: 'Во дворе школы дети катаются с горки на картонках. Ты стоишь у окна с листком в руке и думаешь, кому его показать первым.', effects: [set43('bd', 'think'), w43('offer_known', true), until43(49, 10, 15)] },
    ] }),

  W({ id: 'c43_b_vet', title: 'Утро в Винзене', ambient: sat43,
    text: [
      { when: merleTrip43, text: 'Ветклиника на Луэштрассе. Звонок не работает, дверь открыта. Ветеринар, доктор Кесслер, женщина лет шестидесяти в двух свитерах, выслушивает Мерле молча.' },
      { when: merleTrip43, text: '— Schweineinsulin, U vierzig. Fünf Fläschchen. Mehr hab ich nicht, und nach mir hat keiner mehr. Spritzen gebe ich dazu. Und Sie rechnen. Nicht ich.\n\nСвиной инсулин, U-40. Пять флаконов. Больше у меня нет, и после меня ни у кого нет. Шприцы дам. А считать будете вы. Не я.' },
      { when: ninaTrip43, text: 'В учительской на втором этаже — двое учителей и стопка бланков. Учительница математики узнаёт Нину по фамилии: учила её брата, или кого-то с такой же.' },
      { when: alone, text: 'Аптечный склад Красного Креста — бывший кабинет химии. На полках коробки, у двери очередь. Список Зандер у тебя в руке.' },
    ],
    actions: [
      { id: 'c43_bv_all', label: 'Взять все пять флаконов', when: merleTrip43, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Пять флаконов в коробке с ватой, двадцать шприцев. Ты отдаёшь всё, что {m:взял|взяла} на обмен. Доктор Кесслер смотрит на Мерле, а не на тебя: «Viel Glück, Mädchen». Удачи, девочка.', effects: [{ set: '$.met.c43_kessler', value: true }, set43('bv', 'all'), w43('vet_insulin', 5), until43(49, 11, 15)] },
      { id: 'c43_bv_three', label: 'Взять три, два оставить: вдруг придёт кто-то ещё', when: merleTrip43, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Три флакона. Доктор Кесслер поднимает брови, потом кивает и убирает два обратно в холодильник, который не работает. «Anständig». Порядочно.', effects: [{ set: '$.met.c43_kessler', value: true }, set43('bv', 'three'), w43('vet_insulin', 3), until43(49, 11, 15)] },
      { id: 'c43_bv_teach', label: 'Попросить её показать дозу на шприце', when: merleTrip43, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Она рисует шприц на обороте рецепта, отмечает деления, пишет: «U-40: 1 Strich = 1 Einheit». Одно деление — одна единица. Мерле переписывает в блокнот. Потом даёт пять флаконов.', effects: [{ set: '$.met.c43_kessler', value: true }, set43('bv', 'teach'), w43('vet_insulin', 5), w43('vet_taught', true), until43(49, 11, 15)] },
      { id: 'c43_bv_sign', label: 'Записать Нину и спросить про ночёвку', when: ninaTrip43, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Бланк, имя, класс, «Erziehungsberechtigte» — кто отвечает. Ты пишешь хутор Людеманов. Спальня для девочек на третьем этаже, десять кроватей. Нина смотрит на кровать у окна и говорит: «Die». Эта.', effects: [set43('bv', 'sign'), w43('nina_signed', true), until43(49, 11, 15)] },
      { id: 'c43_bv_ninatalk', label: 'Оставить Нину с учительницей и подождать в коридоре', when: ninaTrip43, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Ты ждёшь на подоконнике. Из учительской доносится смех. Нина выходит с красными щеками и тетрадью задач на каникулы.', effects: [set43('bv', 'ninatalk'), until43(49, 11, 15)] },
      { id: 'c43_bv_school', label: 'Обойти школу с Ниной: спальня, столовая, классы', when: ninaTrip43, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Классы с картами на стенах, столовая в спортзале, спальня на третьем этаже. Нина трогает парты, как старых знакомых. На лестнице она берёт тебя за руку и не отпускает.', effects: [set43('bv', 'school'), until43(49, 11, 15)] },
      { id: 'c43_bv_list', label: 'Получить по списку Зандер, что дадут', when: alone, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Йод — да. Бинты — да. Антибиотик — две упаковки, под роспись. Обезболивающего нет. Ты расписываешься за Зандер и прячешь коробку под куртку.', effects: [set43('bv', 'list'), w43('zander_meds', true), until43(49, 11, 15)] },
      { id: 'c43_bv_trade', label: 'Поменять мыло и чай на то, чего нет в списке', when: alone, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Женщина за столом берёт мыло, нюхает и даёт за него упаковку детского жаропонижающего. «Für das Mädchen bei euch». Для девочки у вас. Ты не спрашиваешь, откуда она знает.', effects: [set43('bv', 'trade'), until43(49, 11, 15)] },
      { id: 'c43_bv_wait', label: 'Подождать в очереди и поговорить с людьми', when: alone, minutes: 60, terminal: true, goto: 'c43_b_board',
        text: 'Очередь длинная: люди из Ханштедта, из Тоштедта, из-под Бухгольца. Каждый рассказывает свою зиму. Ты слушаешь и запоминаешь, у кого что болит.', effects: [set43('bv', 'wait'), until43(49, 11, 15)] },
    ] }),

  W({ id: 'c43_b_board', title: 'Доска поиска', ambient: sat43,
    text: [
      { text: 'В коридоре школы — доска поиска Красного Креста. Карточки в три слоя, кнопки, булавки. «Suche…», «Lebe…», «Wer weiß…» Ищу. Жив. Кто знает.' },
    ],
    actions: [
      { id: 'c43_bbd_card', label: 'Написать карточку: хутор Людеманов, кто живёт', minutes: 45, terminal: true, goto: 'c43_b_merle',
        text: '«Hof Lüdemann bei Jesteburg: wir leben». И имена, все, кто сейчас в доме. Ты прикалываешь карточку в самый верх, на чистое место.', effects: [set43('bbd', 'card'), w43('search_card', true), until43(49, 12, 0)] },
      { id: 'c43_bbd_read', label: 'Читать карточки: вдруг знакомое имя', minutes: 45, terminal: true, goto: 'c43_b_merle',
        text: 'Имена, имена. Ищут мужей, детей, бабушек. Знакомое имя одно: «Köhler, Jesteburg — lebt». Кёлер жива. Кто-то за неё написал. Ты прикалываешь рядом: «Wir auch». Мы тоже.', effects: [set43('bbd', 'read'), until43(49, 12, 0)] },
      { id: 'c43_bbd_felix', label: 'Прикрепить письмо, которое просил передать {partner}', when: flag('w.c42_jonas_letter'), minutes: 30, terminal: true, goto: 'c43_b_merle',
        text: 'Конверт на Ганновер ты отдаёшь в окошко почты Красного Креста. Женщина ставит штамп. «Nach Hannover dauert es. Aber es kommt an». До Ганновера долго. Но дойдёт.', effects: [set43('bbd', 'felix'), w43('felix_letter_sent', true), until43(49, 11, 45)] },
      { id: 'c43_bbd_soup', label: 'Не задерживаться: взять суп в столовой', minutes: 30, terminal: true, goto: 'c43_b_merle',
        text: 'Гороховый суп в железной миске, кусок хлеба. Столовая в спортзале, на шведской стенке сушатся носки. Ты ешь стоя.', effects: [set43('bbd', 'soup'), { body: 'hunger', delta: -25 }, until43(49, 11, 45)] },
    ] }),

  W({ id: 'c43_b_merle', title: 'Во дворе школы', ambient: sat43,
    text: [
      { when: merleTrip43, text: 'Мерле сидит на скамейке у горки и держит коробку с флаконами на коленях, как кошку. Когда ты показываешь листок про Гамбург, она долго молчит.' },
      { when: merleTrip43, text: '— Ich fahr nicht. Wenn ich fahre, komme ich nicht wieder. Und ihr seid hier. — Пауза. — Und noch was. Seit Mittwoch spritze ich die Hälfte. Damit es bis heute reicht. Sag es keinem. Nicht Mama. Nicht Henrike.\n\nЯ не поеду. Если уеду — не вернусь. А вы здесь. И ещё. С середы колю половину. Чтобы хватило до сегодня. Не говори никому. Ни маме. Ни Хенрике.' },
      { when: all(merleTrip43, parents43), text: 'За стеклом школы мелькает знакомая куртка: Биргит приехала тем же автобусом и ищет вас.' },
      { when: ninaTrip43, text: 'Нина сидит на скамейке у горки и болтает ногами. Потом говорит, не глядя на тебя: если в школе можно оставаться и на выходные, она хочет оставаться. Совсем. До весны.' },
      { when: alone, text: 'Координатор с седой косой выходит во двор покурить и садится рядом. Говорит о пункте, о врачах, о том, что половина медсестёр ушла с армией за Эльбу.' },
    ],
    actions: [
      { id: 'c43_bm_promise', label: 'Пообещать Мерле молчать', when: merleTrip43, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Ты обещаешь. Мерле выдыхает так, будто держала воздух с середы. «Danke. Und ab heute spritze ich richtig. Versprochen». Спасибо. С сегодняшнего дня колю как надо. Обещаю.', effects: [set43('bm', 'promise'), w43('merle_secret', 'kept'), npc('merle', 2), until43(49, 13, 0)] },
      { id: 'c43_bm_partner', label: 'Сказать: от {partner.gen} я не скрою, но больше никому', when: merleTrip43, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Мерле думает и кивает. «Okay. Nur ihr zwei». Ладно. Только вы двое. Потом добавляет: «Und Hamburg — nein. Sag ihm das auch». И Гамбург — нет. Ему тоже скажи.', effects: [set43('bm', 'partner'), w43('merle_secret', 'partner'), npc('merle', 1), until43(49, 13, 0)] },
      { id: 'c43_bm_hamburg', label: 'Уговаривать: в Гамбурге инсулин настоящий, а не на месяц', when: merleTrip43, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Мерле слушает до конца. Потом говорит: «Und wenn die Brücke im Frühjahr nicht aufgeht? Dann bin ich allein in Hamburg». А если мост весной не откроют? Тогда я одна в Гамбурге. Ты не знаешь, что ответить. Она права и неправа одновременно.', effects: [set43('bm', 'hamburg'), w43('merle_secret', 'argued'), until43(49, 13, 0)] },
      { id: 'c43_bm_nina', label: 'Сказать Нине: решим вместе, дома', when: ninaTrip43, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Нина кивает слишком быстро. «Klar». Ясно. Потом всё-таки говорит: «Bei euch ist es gut. Aber hier bin ich normal». У вас хорошо. Но здесь я нормальная.', effects: [set43('bm', 'nina'), w43('nina_wants', 'stay'), until43(49, 13, 0)] },
      { id: 'c43_bm_ninano', label: 'Сказать: на выходные — домой, это не обсуждается', when: ninaTrip43, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Нина пинает снег. «Du bist nicht meine Mutter». Ты мне не мать. Потом, через минуту, уже тише: «Aber okay». Но ладно.', effects: [set43('bm', 'ninano'), w43('nina_wants', 'home'), npc('c7_nina', -1), until43(49, 13, 0)] },
      { id: 'c43_bm_ninaask', label: 'Спросить Нину, чего ей не хватает дома', when: ninaTrip43, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Нина долго думает. «Dass mich keiner fragt, wie es mir geht. Weil alle wissen, wie es mir geht». Что никто не спрашивает, как я. Потому что все и так знают.', effects: [set43('bm', 'ninaask'), until43(49, 13, 0)] },
      { id: 'c43_bm_coord', label: 'Спросить координатора, как ей самой здесь', when: alone, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: '— Ich schlafe vier Stunden. Ich esse, was übrig bleibt. Und jeden Morgen kommen mehr. — Она тушит сигарету о скамейку. — Wenn Sie kommen, kann ich fünf schlafen.\n\nЯ сплю четыре часа. Ем, что остаётся. И каждое утро приходит больше людей. Если придёте вы, я буду спать пять.', effects: [set43('bm', 'coord'), until43(49, 13, 0)] },
      { id: 'c43_bm_bench', label: 'Посидеть на скамейке и подумать о листке', when: alone, minutes: 45, terminal: true, goto: 'c43_b_back',
        text: 'Дети катаются с горки на картонках. Ты сидишь с листком в руках и думаешь, как скажешь это {partner.dat}. И что скажет {pm:он|она}.', effects: [set43('bm', 'bench'), until43(49, 13, 0)] },
    ] }),

  W({ id: 'c43_b_back', title: 'Обратно', ambient: sat43,
    text: [
      { text: 'Автобус обратно уходит в три. До этого — полтора часа в Винзене и дорога. Сумка тяжёлая, листок в кармане ещё тяжелее.' },
    ],
    actions: [
      { id: 'c43_bk_bread', label: 'Поменять яйца на хлеб в пекарне', minutes: 120, terminal: true, goto: 'c43_b_gate', effects: [set43('bk', 'bread'), toFarm, until43(49, 15, 50)],
        text: 'Пекарня на рыночной площади, очередь на улице. За десяток яиц — два каравая, ещё тёплых. В автобусе обратно все оглядываются на запах.' },
      { id: 'c43_bk_wait', label: 'Ждать автобус в тепле, в фойе школы', minutes: 120, terminal: true, goto: 'c43_b_gate', effects: [set43('bk', 'wait'), toFarm, { body: 'fatigue', delta: -4 }, until43(49, 15, 50)],
        text: 'Скамейка у батареи, которая еле тёплая. Ты сидишь и смотришь, как в фойе входят и выходят люди с узлами. Потом автобус, дорога, сумерки.' },
      { id: 'c43_bk_help', label: 'Помочь в медпункте школы, пока ждёшь', minutes: 120, activity: 'light', terminal: true, goto: 'c43_b_gate', effects: [set43('bk', 'help'), toFarm, w43('helped_winsen', true), until43(49, 15, 50)],
        text: 'Перевязка, давление, ребёнок с кашлем. Полтора часа проходят как пятнадцать минут. Координатор провожает тебя до автобуса и говорит: «Sehen Sie? Sie gehören hierher». Видите? Вам здесь место.' },
    ] }),

  X({ id: 'c43_b_gate', title: 'Дома', camp: yard14, ambient: sat43,
    text: [
      { text: 'Без десяти четыре. Автобус останавливается у пожарной части, дальше пешком. У ворот хутора ждёт {partner}.' },
    ],
    actions: [
      { id: 'c43_bg_hand', label: 'Отдать сумку и взять {partner.acc} за руку', minutes: 30, terminal: true, goto: 'c43_b_evening',
        text: 'Сумка переходит к {partner.dat}. Рука у {pm:него|неё} тёплая. Ты рассказываешь про Винзен, но не всё: листок в кармане ты пока не достаёшь.', effects: [set43('bg', 'hand'), until43(49, 16, 30)] },
      { id: 'c43_bg_show', label: 'Сразу показать листок из Красного Креста', minutes: 30, terminal: true, goto: 'c43_b_evening',
        text: '{partner} читает листок прямо у ворот, при свете фонаря. Читает дважды. Потом складывает и отдаёт тебе: «Дома поговорим».', effects: [set43('bg', 'show'), w43('offer_shown', true), until43(49, 16, 30)] },
      { id: 'c43_bg_ask', label: 'Спросить, как прошла облава', minutes: 30, terminal: true, goto: 'c43_b_evening',
        text: '{partner} рассказывает про лесополосу, про пост на Зеве, про фонарь. Имени не называет. Ты спрашиваешь: «Ты знаешь, кто?» {pm:Он|Она} кивает и больше ничего не говорит.', effects: [set43('bg', 'ask'), until43(49, 16, 30)] },
    ] }),

  X({ id: 'c43_b_evening', title: 'До ужина', camp: kitchen14,
    text: [
      { when: merleTrip43, text: 'Мерле сидит у печи с флаконом и шприцем. Первая доза ветеринарного инсулина. Руки у неё не дрожат. У тебя — да.' },
      { when: not(merleTrip43), text: 'Хенрике разбирает сумку из Винзена и раскладывает всё по полкам. Про листок она не спрашивает: видит, что ты держишь руку на кармане.' },
    ],
    actions: [
      { id: 'c43_bev_watch', label: 'Сидеть рядом с Мерле и смотреть на деления вместе', when: merleTrip43, minutes: 60, terminal: true, goto: 'c43_sat_eve',
        text: 'Одно деление — одна единица. Мерле набирает, ты проверяешь, она проверяет за тобой. Укол. Потом каждые полчаса — сахар, как получится, по самочувствию. К ужину всё в порядке.', effects: [set43('bev', 'watch'), w43('vet_first', true), until43(49, 17, 45)] },
      { id: 'c43_bev_birgit', label: 'Позвать Биргит: пусть будет рядом', when: all(merleTrip43, parents43), minutes: 60, terminal: true, goto: 'c43_sat_eve',
        text: 'Биргит садится рядом с дочерью и держит её за свободную руку. Ничего не спрашивает. Ты видишь, что она знает больше, чем Мерле думает.', effects: [set43('bev', 'birgit'), w43('vet_first', true), until43(49, 17, 45)] },
      { id: 'c43_bev_henrike', label: 'Показать листок Хенрике', minutes: 60, terminal: true, goto: 'c43_sat_eve',
        text: 'Хенрике читает, надев очки. Потом снимает очки и говорит: «Das entscheidet ihr. Nicht ich». Это решаете вы. Не я. И уходит к плите.', effects: [set43('bev', 'henrike'), until43(49, 17, 45)] },
      { id: 'c43_bev_rest', label: 'Посидеть у печи: ноги гудят после Винзена', minutes: 45, terminal: true, goto: 'c43_sat_eve',
        text: 'Печь, кружка, тишина. Ты закрываешь глаза на минуту и открываешь их, когда зовут ужинать.', effects: [set43('bev', 'rest'), { body: 'fatigue', delta: -4 }, until43(49, 17, 30)] },
      { id: 'c43_bev_kids', label: 'Рассказать детям про Винзен', minutes: 45, terminal: true, goto: 'c43_sat_eve',
        text: 'Дети садятся на лавку у печи. Ты рассказываешь про автобус, про очередь у ворот, про город, где снова ходят люди и топят печи. Младший спрашивает, есть ли там дети. Есть. Много. Он кивает, будто это всё решает.', effects: [set43('bev', 'kids'), until43(49, 17, 30)] },
    ] }),

  // ═════════════ Воскресенье ═════════════
  X({ id: 'c43_b_ute', title: 'Колония', camp: yard14, ambient: sun43,
    text: [
      { text: 'Утром ты несёшь Уте банку печенья к кофе. В колонии тихо, снег на крышах домиков. Уте открывает не сразу.' },
      { text: 'Она усаживает тебя на кухне и долго наливает чай, хотя чашка уже полная. Потом говорит, глядя в окно:\n\n— Jannes hat nichts gesagt, oder? Er sagt nie was.\n\nЯннес ничего не сказал, да? Он никогда ничего не говорит.' },
      { text: '— In der Tauwetternacht standen zwei an meiner Tür. Ich habe geschrien. Er kam vom Posten gerannt. Mit der Axt. Sein Bein… — Она показывает на свою голень. — Er denkt, Hansen ist seinetwegen tot. Deshalb redet er nicht.\n\nВ ночь оттепели у моей двери стояли двое. Я закричала. Он прибежал с поста. С топором. Нога у него… Он думает, что Ханзен умер из-за него. Поэтому молчит.' },
    ],
    actions: [
      { id: 'c43_bu_keep', label: 'Пообещать Уте: дальше тебя это не пойдёт', minutes: 60, terminal: true, goto: 'c43_b_bake', ambientDuring: sun43,
        text: 'Уте кивает. «Er will es nicht. Ich auch nicht. Aber jemand sollte es wissen». Он не хочет. И я не хочу. Но кто-то должен знать. Ты уходишь с пустой банкой и с этим.', effects: [set43('bu', 'keep'), w43('b_knows_why', true), until43(50, 10, 0)] },
      { id: 'c43_bu_brandt', label: 'Сказать: Брандт должен это узнать до совета', minutes: 60, terminal: true, goto: 'c43_b_bake', ambientDuring: sun43,
        text: 'Уте качает головой. «Dann sag du es. Ich kann nicht. Er hat mir verboten». Тогда ты скажи. Я не могу. Он запретил мне. Она провожает тебя до калитки и держит за рукав дольше, чем нужно.', effects: [set43('bu', 'brandt'), w43('b_knows_why', true), until43(50, 10, 0)] },
      { id: 'c43_bu_jannes', label: 'Сходить к Яннесу и уговорить его сказать самому', minutes: 75, terminal: true, goto: 'c43_b_bake', ambientDuring: sun43,
        text: 'Яннес открывает и не впускает. Слушает на пороге. «Nein. Wenn ich das sage, klingt es wie eine Ausrede. Hansen ist tot oder sein Fenster kaputt — das ist keine Ausrede wert». Нет. Если я это скажу, это прозвучит как оправдание. Дверь закрывается мягко.', effects: [set43('bu', 'jannes'), w43('b_knows_why', true), until43(50, 10, 15)] },
    ] }),

  X({ id: 'c43_b_bake', title: 'Печенье к трём', camp: kitchen14,
    text: [
      { text: 'Кухня в муке. Хенрике раскатывает тесто, на подоконнике остывает первый противень. До трёх — ещё два.' },
    ],
    actions: [
      { id: 'c43_bbk_bake', label: 'Печь с Хенрике', minutes: 90, terminal: true, goto: 'c43_sun_lunch',
        text: 'Формочки, противень, печь. Хенрике рассказывает, как в детстве на адвент пекли на всю деревню, а она воровала тесто. Ты воруешь тоже. Хенрике делает вид, что не видит.', effects: [set43('bbk', 'bake'), npc('henrike', 1), until43(50, 11, 45)] },
      { id: 'c43_bbk_kids', label: 'Дать детям украшать печенье', minutes: 90, terminal: true, goto: 'c43_sun_lunch',
        text: 'Сахарная глазурь из последнего сахара, ложка, спички вместо кисточек. Печенье выходит кривое и пёстрое. Дети спорят, чьё лучше, и съедают половину до трёх.', effects: [set43('bbk', 'kids'), until43(50, 11, 45)] },
      { id: 'c43_bbk_think', label: 'Месить молча и думать про колонию', minutes: 75, terminal: true, goto: 'c43_sun_lunch',
        text: 'Тесто под ладонями тёплое. Ты думаешь про Уте, про дверь, про топор и ногу Яннеса. И про то, что завтра совет.', effects: [set43('bbk', 'think'), until43(50, 11, 30)] },
    ] }),

  X({ id: 'c43_b_merle2', title: 'После обеда', camp: kitchen14,
    text: [
      { when: merle43, text: 'Мерле зовёт тебя на чердак. Показывает блокнот: столбик чисел, вчера вечером, ночью, утром. Всё ровно.' },
      { when: merle43, text: '— Siehst du? Es geht. Ohne Hamburg.\n\nВидишь? Получается. Без Гамбурга.' },
      { when: all(not(merle43), nina43), text: 'Нина приносит тебе тетрадь задач из Винзена или свою, старую, и садится рядом. Ей нужно, чтобы кто-то посидел рядом, пока она решает.' },
      { when: all(not(merle43), not(nina43)), text: 'Хенрике садится напротив с листком из Винзена в руке. Ты оставил{m:|а} его на столе.' },
    ],
    actions: [
      { id: 'c43_bm2_glad', label: 'Сказать: получается. Пока', when: merle43, minutes: 60, terminal: true, goto: 'c43_coffee',
        text: 'Мерле слышит это «пока» и не спорит. Пять флаконов — это месяц, может, полтора. Дальше — неизвестно. Вы {m:оба|обе} это знаете и молчите об этом вместе.', effects: [set43('bm2', 'glad'), until43(50, 14, 30)] },
      { id: 'c43_bm2_doubt', label: 'Сказать: месяц — это не зима', when: merle43, minutes: 60, terminal: true, goto: 'c43_coffee',
        text: 'Мерле закрывает блокнот. «Ich weiß. Aber Hamburg ist nicht zu Hause». Знаю. Но Гамбург — не дом. Она смотрит в окно на поле. Решать будет не она одна, и она это понимает.', effects: [set43('bm2', 'doubt'), until43(50, 14, 30)] },
      { id: 'c43_bm2_draw', label: 'Попросить её нарисовать что-нибудь к Рождеству', when: merle43, minutes: 60, terminal: true, goto: 'c43_coffee',
        text: 'Мерле рисует дом, снег, окна со свечами. В одном окне — двое. Она не говорит, кто это, и отдаёт рисунок тебе.', effects: [set43('bm2', 'draw'), npc('merle', 1), until43(50, 14, 30)] },
      { id: 'c43_bm2_nina', label: 'Решать задачи с Ниной', when: all(not(merle43), nina43), minutes: 60, terminal: true, goto: 'c43_coffee',
        text: 'Проценты, дроби, задача про поезда, которых больше нет. Нина решает быстрее и подсказывает тебе. Потом говорит: «In Winsen haben sie einen Mathelehrer». В Винзене есть учитель математики. Это аргумент.', effects: [set43('bm2', 'nina'), until43(50, 14, 30)] },
      { id: 'c43_bm2_henrike', label: 'Поговорить с Хенрике про Винзен', when: all(not(merle43), not(nina43)), minutes: 60, terminal: true, goto: 'c43_coffee',
        text: 'Хенрике говорит: десять кило муки в неделю — это зима для всех. А четыре ночи в неделю без тебя — это тоже зима. «Für ihn». Для него. Она кивает на окно, за которым {partner} колет дрова.', effects: [set43('bm2', 'henrike'), until43(50, 14, 30)] },
      { id: 'c43_bm2_rest', label: 'Полежать час перед гостями', minutes: 60, terminal: true, goto: 'c43_coffee',
        text: 'Ты ложишься поверх одеяла. Снизу пахнет печеньем. Сон не идёт, но лежать хорошо.', effects: [set43('bm2', 'rest'), { body: 'fatigue', delta: -6 }, until43(50, 14, 30)] },
      { id: 'c43_bm2_porch', label: 'Выйти на крыльцо подышать перед гостями', minutes: 60, terminal: true, goto: 'c43_coffee', ambientDuring: sun43,
        text: 'Снег идёт редко. Над колонией дым. Ты стоишь, пока не начинают мёрзнуть руки, и возвращаешься к печенью.', effects: [set43('bm2', 'porch'), until43(50, 14, 30)] },
    ] }),

  X({ id: 'c43_b_dusk', title: 'После гостей', camp: kitchen14,
    text: [
      { when: all(guestsN, hansenDead43), text: 'Фрау Ханзен уходит последней. В дверях она берёт тебя за руку и говорит: «Er hat immer gesagt, die Kolonie hält zusammen. Hat sie nicht». Он всегда говорил: колония держится вместе. Не удержалась.' },
      { when: all(guestsN, not(hansenDead43)), text: 'Фрау Ханзен уходит последней, с пустой тарелкой из-под пирога. В дверях она говорит: «Ute war heute so still». Уте сегодня была такая тихая.' },
      { when: not(guestsN), text: 'Гости ушли или их не было. В кухне тепло и тесно от стульев, на столе крошки и четыре огарка.' },
    ],
    actions: [
      { id: 'c43_bdu_clean', label: 'Убрать со стола вместе с Хенрике', minutes: 60, terminal: true, goto: 'c43_sun_eve',
        text: 'Скатерть — встряхнуть на крыльце, чашки с золотым ободком — в буфет, по одной. Хенрике пересчитывает их дважды. Все целы.', effects: [set43('bdu', 'clean'), until43(50, 17, 15)] },
      { id: 'c43_bdu_write', label: 'Записать в тетрадь всё, что узнал{m:|а} за два дня', minutes: 45, terminal: true, goto: 'c43_sun_eve',
        text: 'Винзен, листок, Уте, ночь оттепели. Ты пишешь и останавливаешься на одном месте: это не твоя тайна. Ты пишешь одно слово: «Уте». Дальше — пусто.', effects: [set43('bdu', 'write'), until43(50, 17, 0)] },
      { id: 'c43_bdu_window', label: 'Постоять у окна: на тропе у колонии кто-то стоит', minutes: 30, terminal: true, goto: 'c43_sun_eve',
        text: 'Тёмная фигура у изгороди колонии, лицом к вашему дому. Стоит долго. Потом уходит, прихрамывая. Ты знаешь, кто это и почему он хромает.', effects: [set43('bdu', 'window'), until43(50, 16, 45)] },
    ] }),
];
