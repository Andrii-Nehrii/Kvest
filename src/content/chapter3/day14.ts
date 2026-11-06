import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { flag, not } from './world3';
import {
  A14, B14, S14, day14, dusk14, house14, indoor14, kitchen14, leo14, leoWent14, own14, road14, soldier14, tense14, yard14,
} from './point14';
import { meal } from './point12';

const any = (...xs: Cond[]): Cond => ({ any: xs });
const once = (key: string): Cond => not(flag(`$.c14_${key}`));
const toLunch: Effect = { restUntil: at(15, 13) };
const toDusk: Effect = { restUntil: at(15, 16, 40) };
const toSupper: Effect = { restUntil: at(15, 19) };
const toNight: Effect = { restUntil: at(15, 20, 30) };
const nina = (trust: number): Effect => ({ npc: 'c7_nina', trust });
const ute = (trust: number): Effect => ({ npc: 'c14_ute', trust });
const jannes = (trust: number): Effect => ({ npc: 'c14_jannes', trust });
const split = (a: string, b: string) => [{ id: 'a', when: A14, goto: a }, { id: 'b', goto: b }];
const smsSent: Cond = { v: 'A.c12_sms', op: '==', value: 'sent' };
const metJannes: Cond = flag('$.c14_met_jannes');
const field = 'c10_field';
const neighbor = 'c3_neighbor';

export const day14Scenes: Scene[] = [
  S14({ id: 'c14_noon', for: 'any', chapter: 'ch3', title: 'Пустой двор', camp: yard14, ambient: day14,
    text: [
      { when: road14('walk'), text: 'Дениз и Керем ушли по дороге на Бухгольц. Калитку за ними никто не закрыл.' },
      { when: road14('drive'), text: 'Вы вернулись из Бухгольца. Corsa остывает у сарая и тихо пощёлкивает.' },
      { when: leoWent14('marcus'), text: 'Маркус и Лео ушли на восток. На крыльце остался фантик от шоколадки.' },
      { when: leoWent14('drive'), text: 'Маркус и Лео уехали автобусом из Йестебурга. У пункта, в очереди к белой палатке, вы видели Хенрике. Она вас не заметила.' },
      { when: leo14, text: 'Маркус ушёл за бабушкой. Лео сидит на ступеньке крыльца с зайцем на коленях и смотрит на калитку.' },
      { text: 'Хенрике и Оле увезли утром. На хуторе остались вы двое, Нина и фургон под навесом.\n\nНина стоит у фургона, прижавшись лбом к доскам на окне кабины. Губы у неё шевелятся. Солдат сказал: до завтра.' },
    ],
    actions: [
      { id: 'c14_n_nina', label: 'Подойти к Нине', minutes: 5, terminal: true, goto: 'c14_lunch',
        text: 'Нина отходит от досок, как только слышит твои шаги.\n\n— Я ему рассказываю, что тут было, — говорит она. — Он любит, когда рассказывают. Любил.', effects: [{ set: '$.c14_noon', value: 'nina' }, nina(1), toLunch] },
      { id: 'c14_n_yard', label: 'Обойти двор: теперь он ваш', minutes: 15, activity: 'light', terminal: true, goto: 'c14_lunch',
        text: 'Колодец, сарай, курятник, поленница. Задняя калитка в поле закрыта на крючок, не на замок. Вчера это было не твоё дело.', effects: [{ set: '$.c14_noon', value: 'yard' }, toLunch] },
      { id: 'c14_n_partner', label: 'Постоять с {partner.ins} у калитки', minutes: 5, terminal: true, goto: 'c14_lunch',
        text: 'Вы стоите рядом и молчите. Дорога пустая в обе стороны. Где-то далеко лает собака и сразу перестаёт.', effects: [{ set: '$.c14_noon', value: 'partner' }, { body: 'stress', delta: -1 }, toLunch] },
    ] }),

  S14({ id: 'c14_lunch', for: 'any', chapter: 'ch3', title: 'Обед на троих', camp: kitchen14,
    onEnter: [{ introduceNpc: 'c14_ute' }, { introduceNpc: 'c14_jannes' }],
    text: [
      { text: 'Нина сама разогревает на плите картошку и ставит три тарелки. Подумав, ставит четвёртую. Потом убирает её обратно в шкаф.' },
      { when: leo14, text: 'Лео сидит рядом с Ниной и ест, держа ложку в кулаке. Зайца он посадил на стол.' },
      { text: 'На столе, у солонки, лежит связка ключей Хенрике. Под ней листок, сложенный вдвое.\n\nТелефон Нины лежит экраном вниз. Два раза он вздрагивает. Нина оба раза переворачивает его, читает под столом и снова кладёт.' },
    ],
    actions: [
      { id: 'c14_l_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, outcomes: split('c14_a_keys', 'c14_b_kitchen'), enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Картошка подгорела снизу. Никто об этом не говорит. Нина съедает половину и отодвигает тарелку.', effects: [meal('eat')] },
      { id: 'c14_l_pack', label: 'Попросить отложить свою порцию на вечер', minutes: 3, terminal: true, outcomes: split('c14_a_keys', 'c14_b_kitchen'), enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Нина перекладывает твою картошку в банку и ставит на подоконник.', effects: [meal('pack')] },
      { id: 'c14_l_skip', label: 'Встать из-за стола: потом', minutes: 2, terminal: true, outcomes: split('c14_a_keys', 'c14_b_kitchen'),
        text: 'Ты встаёшь. Нина провожает тебя взглядом и снова переворачивает телефон.' },
      { id: 'c14_l_phone', label: 'Спросить Нину, кто ей пишет', when: once('l_phone'), minutes: 2, combinable: true,
        text: '— Подруга. Из Винзена. — Нина убирает телефон в карман. — У них там свет дали. На два часа.', effects: [{ set: '$.c14_l_phone', value: true }] },
      { id: 'c14_l_soldier', label: 'Спросить Нину, что она думает про завтра', when: once('l_soldier'), minutes: 3, combinable: true,
        effects: [{ set: '$.c14_l_soldier', value: true }],
        outcomes: [
          { id: 'truth', when: soldier14('truth'), text: '— Он написал «завтра вечером», — говорит Нина. — Я слышала. Значит, ещё сутки. — Она смотрит в тарелку. — Целые сутки.' },
          { id: 'day', when: soldier14('day'), text: '— Один день, — говорит Нина. — Он так сказал: «Einer». Как будто это много.' },
          { id: 'lie', text: '— Вы сказали, что фургон пустой, — говорит Нина. — А папа стукнул. Теперь они придут, когда захотят. — Она не поднимает глаз. — Я не злюсь. Правда.' },
        ] },
    ] }),

  // ───────────── Линия A: двор, поле, соседний двор ─────────────
  S14({ id: 'c14_a_keys', for: 'any', chapter: 'ch3', title: 'Ключи Хенрике', camp: kitchen14,
    text: [{ text: 'Ты разворачиваешь листок из-под ключей. Почерк крупный, с наклоном:\n\n«Подвал — длинный ключ. Сарай — с синей ниткой. Курам воды каждый день. Ружьё Оле за шкафом в прихожей, два патрона. Для Йенса, если придётся. Нину одну не оставляйте. Х.»\n\nНа обороте, мельче: «Простите, что так».' }],
    actions: [
      { id: 'c14_ak_cellar', label: 'Спуститься в подвал и посмотреть, что осталось', minutes: 15, activity: 'light', terminal: true, goto: 'c14_a_van',
        text: 'Картошка в ящиках, полмешка лука, банки с огурцами и сливами, пустые полки там, где были консервы. На неделю хватит, если не гостей кормить.\n\nНа нижней полке — коробка с надписью маркером: «Für Nina». Шерстяные носки, шапка, шоколадка.', effects: [{ set: '$.c14_keys', value: 'cellar' }] },
      { id: 'c14_ak_gun', label: 'Заглянуть за шкаф в прихожей', minutes: 4, terminal: true, goto: 'c14_a_van',
        text: 'Ружьё стоит за шкафом, стволом вверх, в чехле из старой простыни. Рядом на полке чашка без ручки. В ней два патрона, красные, с латунными донцами.\n\nТы ставишь ружьё обратно.', effects: [{ set: '$.c14_keys', value: 'gun' }, { set: '$.c14_saw_gun', value: true }] },
      { id: 'c14_ak_pocket', label: 'Сунуть записку в карман и выйти во двор', minutes: 2, terminal: true, goto: 'c14_a_van',
        text: 'Ключи звякают у тебя в кармане при каждом шаге. Связка тяжёлая.', effects: [{ set: '$.c14_keys', value: 'pocket' }] },
    ] }),

  S14({ id: 'c14_a_van', for: 'any', chapter: 'ch3', title: 'Под навесом', camp: tense14, ambient: day14,
    text: [{ text: 'Под навесом стучат. Не так, как вчера. Удар, долгая пауза, ещё удар. Слабее.\n\nВ щели между досками на окне кабины что-то торчит. Пластиковая бутылка, разрезанная пополам. Горлышко просунуто внутрь, как воронка. Доски под ней тёмные, мокрые. На земле у колеса подмёрзшая лужица.' }],
    actions: [
      { id: 'c14_av_funnel', label: 'Вытащить воронку и посмотреть', minutes: 4, terminal: true, outcomes: [{ id: 'sms', when: smsSent, goto: 'c14_a_phone' }, { id: 'go', goto: 'c14_a_field' }],
        text: 'Внутри бутылки капли. Ты нюхаешь: просто вода. Из кабины тянет кислым и тяжёлым.\n\nТы вставляешь воронку обратно, как было. Кто-то поит его. И не первый раз: доски внизу набухли.', effects: [{ set: '$.c14_van', value: 'funnel' }, { set: '$.c14_knows_water', value: true }] },
      { id: 'c14_av_knock', label: 'Постучать по двери в ответ', minutes: 2, terminal: true, outcomes: [{ id: 'sms', when: smsSent, goto: 'c14_a_phone' }, { id: 'go', goto: 'c14_a_field' }],
        text: 'Ты стучишь костяшками. Внутри что-то тяжело сдвигается. Удар в доски прямо напротив твоей руки. Потом снова тихо.\n\nНа двери, на уровне ручки, следы маленьких ладоней. Нина приходит сюда часто.', effects: [{ set: '$.c14_van', value: 'knock' }] },
      { id: 'c14_av_leave', label: 'Не трогать и уйти', minutes: 1, terminal: true, outcomes: [{ id: 'sms', when: smsSent, goto: 'c14_a_phone' }, { id: 'go', goto: 'c14_a_field' }],
        text: 'Ты уходишь. За спиной ещё один удар. Потом долго ничего.', effects: [{ set: '$.c14_van', value: 'leave' }] },
    ] }),

  S14({ id: 'c14_a_phone', for: 'any', chapter: 'ch3', title: 'Ответ из Целле', camp: yard14, ambient: day14,
    text: [{ text: 'В кармане вибрирует телефон. Номер незнакомый, код Целле. Сообщение длинное, без единой ошибки:\n\n«Hier ist Hilde Brandt. Ihre Nummer stand unter der Nachricht. Wer sind Sie? Wo ist Anke? Ist Leo wirklich gesund? Bitte antworten Sie. Ich habe sonst niemanden.»\n\nХильде. Бабушка Лео. Она спрашивает, кто ты, где Анке и правда ли Лео здоров. Пишет, что у неё больше никого нет.' }],
    actions: [
      { id: 'c14_ap_truth', label: 'Написать правду: Анке больше нет, Лео с Маркусом', minutes: 10, terminal: true, goto: 'c14_a_field',
        effects: [{ set: '$.c14_hilde', value: 'truth' }, { charge: 'phone', delta: -1 }],
        outcomes: [
          { id: 'farm', when: leo14, text: 'Ты пишешь коротко, по-немецки, как можешь. Анке больше нет. Лео здоров, он здесь, на хуторе у Йестебурга. Маркус идёт к вам пешком.\n\nОтвет приходит через десять минут: «Danke. Ich warte. Sagen Sie ihm, Oma wartet.»\n\nСпасибо. Я жду. Скажите ему: бабушка ждёт.' },
          { id: 'go', text: 'Ты пишешь коротко, по-немецки, как можешь. Анке больше нет. Лео здоров, он с Маркусом, они едут к вам.\n\nОтвет приходит через десять минут, одно слово: «Danke».\n\nПотом ещё одно сообщение: «Er war immer gut zu ihm».\n\nОн всегда был добр к нему.' },
        ] },
      { id: 'c14_ap_short', label: 'Написать только про Лео: здоров, Маркус ведёт', minutes: 6, terminal: true, goto: 'c14_a_field',
        text: 'Ты пишешь: Лео здоров, Маркус ведёт его к вам. Про Анке не пишешь ничего.\n\nОтвет: «Und Anke?»\n\nА Анке?\n\nТы смотришь на экран, пока он не гаснет.', effects: [{ set: '$.c14_hilde', value: 'short' }, { charge: 'phone', delta: -1 }] },
      { id: 'c14_ap_later', label: 'Не отвечать сейчас: это должен сказать Маркус', minutes: 2, terminal: true, goto: 'c14_a_field',
        text: 'Ты убираешь телефон. Это не твоё известие. Но через минуту он вибрирует снова, и ты не смотришь.', effects: [{ set: '$.c14_hilde', value: 'later' }] },
    ] }),

  S14({ id: 'c14_a_field', for: 'any', chapter: 'ch3', title: 'По следу', location: field, ambient: day14,
    text: [
      { text: 'За задней калиткой поле. По краю, вдоль насыпи, тянется колея тачки. Иней сошёл, но в низинах след виден ясно. И две пары следов. Одни большие, с крупным протектором. Другие меньше, узкие, женские.\n\nСлед ведёт к соседнему двору. Над домом соседки, фрау Кёлер, не поднимается дым.' },
      { when: own14('van', 'funnel'), text: 'Воронку в щели поставил кто-то, кто дотягивается до окна кабины. Ты думаешь об этом всю дорогу.' },
    ],
    actions: [
      { id: 'c14_af_door', label: 'Идти прямо к дому Кёлер', minutes: 20, activity: 'moderate', move: true, terminal: true, goto: 'c14_a_koehler',
        text: 'Ты идёшь по меже. Земля чавкает под ногами. Во дворе Кёлер пусто. Занавеска на кухне сдвигается на ладонь и сразу возвращается на место.', effects: [{ set: '$.c14_field', value: 'door' }] },
      { id: 'c14_af_fence', label: 'Идти по следу к дыре в сетке', minutes: 20, activity: 'moderate', move: true, terminal: true, goto: 'c14_a_koehler',
        text: 'След упирается в угол сетки. Дыру прикрыли: кусок проволоки загнули обратно. Ты пролезаешь, цепляясь курткой.\n\nС крыльца кричат:\n\n— Stehen bleiben!\n\nСтоять!', effects: [{ set: '$.c14_field', value: 'fence' }] },
      { id: 'c14_af_sms', label: 'Сначала написать {partner.dat}, куда идёшь', minutes: 22, activity: 'moderate', move: true, terminal: true, goto: 'c14_a_koehler',
        text: 'Ты пишешь: «Иду к Кёлер, по следам тачки. Если через час не вернусь…» — и стираешь вторую половину. Отправляешь первую.\n\nВо дворе Кёлер пусто. Занавеска на кухне сдвигается и возвращается на место.', effects: [{ set: '$.c14_field', value: 'sms' }, { charge: 'phone', delta: -1 }] },
    ] }),

  S14({ id: 'c14_a_koehler', for: 'any', chapter: 'ch3', title: 'Фрау Кёлер', location: neighbor, ambient: day14,
    onEnter: [{ set: '$.met.c3_koehler', value: true }],
    text: [{ text: 'Кёлер открывает дверь на цепочку. В руке хлебный нож, длинный, с зубчиками. Узнаёт тебя не сразу.\n\n— Ах, вы. С хутора. — Нож она не опускает. — Zwei Nächte schon. In der Scheune. Ich hab nicht nachgesehen. Ich bin achtundsechzig.\n\nДве ночи уже кто-то в сарае. Она не ходила смотреть: ей шестьдесят восемь.' },
      { when: own14('field', 'fence'), text: '— Und durch den Zaun, wie die, — добавляет она, глядя на твою куртку. — Через сетку, как они.' }],
    actions: [
      { id: 'c14_ak_with', label: 'Предложить сходить к сараю вместе', minutes: 6, terminal: true, goto: 'c14_a_barn',
        text: 'Кёлер снимает цепочку и выходит в пальто поверх халата. Нож держит перед собой, как свечку. У сарая она останавливается и дальше не идёт.\n\n— Я тут подожду, — говорит она. — Если что — кричите.', effects: [{ set: '$.c14_koehler', value: 'with' }, { npc: 'c3_koehler', trust: 1 }] },
      { id: 'c14_ak_alone', label: 'Сказать ей запереться и пойти одному', minutes: 4, terminal: true, goto: 'c14_a_barn',
        text: 'Кёлер кивает и закрывает дверь. Ты слышишь, как поворачивается ключ. Два раза.', effects: [{ set: '$.c14_koehler', value: 'alone' }] },
      { id: 'c14_ak_saw', label: 'Спросить, кого она видела из окна', minutes: 6, terminal: true, goto: 'c14_a_barn',
        text: '— Женщину. И парня. Ночью, с тачкой. — Кёлер облизывает губы. — Один раз в тачке кто-то лежал. Под одеялом. И шевелился.\n\nОна смотрит на тебя, чтобы понять, веришь ли ты.\n\n— Я больше в окно не смотрю, — говорит она.', effects: [{ set: '$.c14_koehler', value: 'saw' }, { set: '$.c14_knows_cart', value: true }] },
    ] }),

  S14({ id: 'c14_a_barn', for: 'any', chapter: 'ch3', title: 'Стоянка', location: neighbor, ambient: indoor14,
    text: [{ text: 'В сарае пахнет сеном и керосином. В углу, за тюками, кто-то живёт. Два спальника. Походная горелка. Пустые банки, составленные пирамидкой, аккуратно.\n\nРядом — тачка. На ручках ремни, на дне старое одеяло в тёмных пятнах. К стене прислонён длинный шест с проволочной петлёй на конце. На тюке — мотоциклетный шлем. Визор заклеен изнутри серым скотчем.\n\nНа гвозде висит кусок картона, исписанный ручкой.' }],
    actions: [
      { id: 'c14_ab_list', label: 'Прочитать картонку на гвозде', minutes: 5, terminal: true, goto: 'c14_a_jannes',
        text: 'Почерк женский, ровный, как в школьном журнале:\n\n«Bendestorf — Opa Gerd ✓\nHarmstorf — Frau Lüders ✓\nLüllau — Herr Stamer ✓\nItzenbüttel — Kind ✗\nHof Lüdemann — Ninas Papa. Transporter. Heute Nacht.»\n\nДеревни, имена, галочки. Одна строка зачёркнута. Последняя — про ваш хутор. Папа Нины. Фургон. Сегодня ночью.', effects: [{ set: '$.c14_barn', value: 'list' }, { set: '$.c14_saw_list', value: true }, { restUntil: at(15, 15) }] },
      { id: 'c14_ab_gear', label: 'Осмотреть шест и шлем', minutes: 6, terminal: true, goto: 'c14_a_jannes',
        text: 'Петля на шесте затягивается, если потянуть, и не душит: в проволоку вставлен кусок садового шланга. Шлем изнутри пахнет чужим шампунем. Визор заклеен так, чтобы снаружи было не видно лица, а изнутри — ничего.\n\nЭто не для того, кто его наденет. Это для того, на кого его наденут. Чтобы не кусал и ничего не видел.', effects: [{ set: '$.c14_barn', value: 'gear' }, { set: '$.c14_saw_gear', value: true }, { restUntil: at(15, 15) }] },
      { id: 'c14_ab_photo', label: 'Сфотографировать всё телефоном', when: { has: 'phone' }, minutes: 5, terminal: true, goto: 'c14_a_jannes',
        text: 'Шест, шлем, тачка, картонка. Вспышку ты не включаешь. На последнем снимке картонка вышла смазанной, но одну строчку видно: «Hof Lüdemann».', effects: [{ set: '$.c14_barn', value: 'photo' }, { set: '$.c14_saw_list', value: true }, { charge: 'phone', delta: -1 }, { restUntil: at(15, 15) }] },
    ] }),

  S14({ id: 'c14_a_jannes', for: 'any', chapter: 'ch3', title: 'Яннес', location: neighbor, ambient: indoor14,
    onEnter: [{ set: '$.met.c14_jannes', value: true }, { set: '$.c14_met_jannes', value: true }],
    text: [{ text: 'Ждать приходится долго. Больше часа ты сидишь за тюками, пока не начинают мёрзнуть ноги. Потом дверь сарая скрипит. На пороге парень лет девятнадцати, в рабочей куртке не по размеру, с канистрой воды в руке. Во рту незажжённая сигарета. Он видит тебя и замирает.\n\n— Wir klauen nichts, — говорит он быстро. — Ehrlich.\n\nМы ничего не крадём. Честно.\n\nКанистру он ставит медленно, будто она может взорваться.\n\n— Яннес, — говорит он. — Я Яннес.' }],
    actions: [
      { id: 'c14_aj_ask', label: 'Спросить прямо, зачем им шест и шлем', minutes: 6, terminal: true, goto: 'c14_a_jannes2',
        text: '— Для больных. — Яннес наконец закуривает. Руки у него дрожат. — Мы их забираем. Пока их не застрелили. У мамы сад у насыпи, колония. Там домики.\n\nОн кивает на картонку.\n\n— Сегодня — папа той девочки. Она сама написала. В обед.', effects: [{ set: '$.c14_jannes', value: 'ask' }, jannes(1)] },
      { id: 'c14_aj_door', label: 'Встать в дверях: сначала объясни', minutes: 4, risky: true, terminal: true, goto: 'c14_a_jannes2',
        text: 'Яннес поднимает обе руки, и сигарета падает на пол.\n\n— Okay. Okay. — Он не пытается пройти. — Мы забираем больных. Чтобы их не стреляли. Сегодня ночью — того, в фургоне. Его дочка нам написала. Сама.', effects: [{ set: '$.c14_jannes', value: 'door' }, jannes(-1)] },
      { id: 'c14_aj_sit', label: 'Сесть на тюк и подождать, пока он заговорит', minutes: 8, activity: 'rest', terminal: true, goto: 'c14_a_jannes2',
        text: 'Яннес садится напротив, закуривает. Долго смотрит на тачку.\n\n— Мама говорит, это милосердие, — говорит он. — Забрать, пока не застрелили. Сегодня ночью — ваш. Из фургона. Девочка написала маме в обед: «Папу завтра застрелят».', effects: [{ set: '$.c14_jannes', value: 'sit' }, jannes(2)] },
    ] }),

  S14({ id: 'c14_a_jannes2', for: 'any', chapter: 'ch3', title: 'Что они верят', location: neighbor, ambient: indoor14,
    text: [
      { text: '— Папа у нас с прошлой среды, — говорит Яннес. — На цепи, в домике. Мама с ним разговаривает. Кормит. Он ест. Мама говорит: раз ест, значит, там ещё кто-то есть.\n\nОн стряхивает пепел в пустую банку.\n\n— Я не верю, — говорит он. — Но и стрелять в него я не дал. Вот так и живём.' },
      { when: flag('$.c14_knows_cart'), text: 'Ты вспоминаешь слова Кёлер: в тачке кто-то лежал и шевелился.' },
      { when: own14('barn', 'gear'), text: 'Ты вспоминаешь кусок садового шланга в петле. Чтобы не душить.' },
    ],
    actions: [
      { id: 'c14_aj2_count', label: 'Спросить, сколько их там', minutes: 4, terminal: true, goto: 'c14_a_back',
        text: '— Семеро. С папой. — Яннес считает на пальцах, шевеля губами. — Опа Герд, фрау Людерс, герр Штамер… Мама всех по именам зовёт. Каждое утро обходит и здоровается.\n\nОн смотрит на тебя.\n\n— Воду таскаю я.', effects: [{ set: '$.c14_jannes2', value: 'count' }, { set: '$.c14_knows_seven', value: true }, { restUntil: at(15, 15, 50) }] },
      { id: 'c14_aj2_us', label: 'Сказать: без нашего согласия к фургону не подходить', minutes: 4, terminal: true, goto: 'c14_a_back',
        text: '— Ясное дело. — Яннес кивает, будто ждал. — Поэтому мама и пошла к вам. Прямо сейчас. Через поле. Без вас она ничего не делает.\n\nОн встаёт.\n\n— Она вам понравится, — говорит он. — Всем нравится. В этом и беда.', effects: [{ set: '$.c14_jannes2', value: 'us' }, jannes(1), { restUntil: at(15, 15, 50) }] },
      { id: 'c14_aj2_why', label: 'Спросить, почему он тогда помогает', minutes: 5, terminal: true, goto: 'c14_a_back',
        text: '— А что, бросить её одну с ними? — Яннес тушит сигарету о подошву. — Она к ним без шлема заходит. Без шеста. Разговаривает.\n\nОн молчит.\n\n— Однажды кто-нибудь из них сорвётся с цепи. И я хочу быть рядом, когда это случится.', effects: [{ set: '$.c14_jannes2', value: 'why' }, jannes(1), { restUntil: at(15, 15, 50) }] },
    ] }),

  S14({ id: 'c14_a_back', for: 'any', chapter: 'ch3', title: 'Женщина с велосипедом', location: field, ambient: dusk14,
    text: [
      { text: 'Обратно ты идёшь по меже. Солнце садится за насыпью. Навстречу по полевой дороге идёт женщина с велосипедом. Седые волосы под вязаной шапкой, зелёный дождевик. На багажнике пустая корзина.\n\nПоравнявшись с тобой, она кивает.\n\n— Guten Abend.' },
      { when: any(own14('jannes2', 'us'), own14('jannes2', 'why'), own14('jannes2', 'count')), text: 'Мама Яннеса. Больше некому.' },
    ],
    actions: [
      { id: 'c14_aba_stop', label: 'Остановить её и спросить, откуда она идёт', minutes: 5, terminal: true, goto: 'c14_a_dusk',
        text: '— С вашего хутора, — говорит она спокойно. — Я разговаривала с Ниной и с вашей… — она ищет слово, — с вашей половиной. Вечером вы решите. Без вас я ничего не сделаю.\n\nОна кивает ещё раз и катит велосипед дальше, к насыпи.', effects: [{ set: '$.c14_back', value: 'stop' }, ute(1), toDusk] },
      { id: 'c14_aba_nod', label: 'Кивнуть в ответ и пройти мимо', minutes: 3, terminal: true, goto: 'c14_a_dusk',
        text: 'Ты киваешь. Она идёт дальше. Через двадцать шагов ты оборачиваешься. Она тоже обернулась и смотрит на тебя. Потом машет рукой, как старому знакомому.', effects: [{ set: '$.c14_back', value: 'nod' }, toDusk] },
      { id: 'c14_aba_run', label: 'Прибавить шаг: кто сейчас с Ниной?', minutes: 2, activity: 'moderate', terminal: true, goto: 'c14_a_dusk',
        text: 'Ты почти бежишь. У задней калитки следы велосипедных шин. Свежие, туда и обратно. Калитка закрыта на крючок изнутри: кто-то её открыл и закрыл.', effects: [{ set: '$.c14_back', value: 'run' }, toDusk] },
    ] }),

  S14({ id: 'c14_a_dusk', for: 'any', chapter: 'ch3', title: 'Три раза', camp: yard14, ambient: dusk14,
    text: [
      { text: 'Во дворе уже почти темно. На насыпи, там, где будка обходчика, мигает огонёк. Раз. Два. Три.\n\nИз окна второго этажа, из комнаты Нины, ему отвечают. Белый свет телефонного фонарика. Раз. Два. Три. Потом окно гаснет.' },
      { when: { v: '$.c12_dusk', op: '==', value: 'signal' }, text: 'Вчера в это время ты сам{m:|а} мигал{m:|а} фонарём в ту сторону. Тогда огонёк погас.' },
    ],
    actions: [
      { id: 'c14_ad_up', label: 'Подняться к Нине', minutes: 4, terminal: true, goto: 'c14_a_rest',
        text: 'Дверь в комнату Нины закрыта. Ты стучишь.\n\n— Я сплю, — говорит Нина из-за двери очень бодрым голосом.', effects: [{ set: '$.c14_dusk', value: 'up' }] },
      { id: 'c14_ad_partner', label: 'Найти {partner.acc} и рассказать про картонку и шест', minutes: 6, terminal: true, goto: 'c14_a_rest',
        effects: [{ set: '$.c14_dusk', value: 'partner' }, { set: '$.c14_told_early', value: true }],
        text: '{partner} на кухне. Выслушивает тебя, не перебивая.\n\n— Я знаю, — говорит {pm:он|она}. — Она приходила. Уте. Расскажу за ужином всё, а то Нина услышит.' },
      { id: 'c14_ad_watch', label: 'Постоять и посмотреть на насыпь', minutes: 8, terminal: true, goto: 'c14_a_rest',
        text: 'Огонёк больше не мигает. Потом загорается снова, ниже, уже на поле, и медленно уходит в сторону соседнего двора. Кто-то идёт с фонарём в руке и не прячется.', effects: [{ set: '$.c14_dusk', value: 'watch' }] },
    ] }),

  S14({ id: 'c14_a_rest', for: 'any', chapter: 'ch3', title: 'Пара часов', camp: house14, ambient: dusk14,
    text: [{ text: 'До ужина больше двух часов. Ночь, похоже, спокойной не будет. Тело говорит об этом раньше головы: веки тяжёлые, плечи как чужие.' }],
    actions: [
      { id: 'c14_ar_sleep', label: 'Лечь и поспать до ужина', minutes: 1, activity: 'sleep', terminal: true, goto: 'c14_a_gun',
        text: 'Ты ложишься не раздеваясь. Сквозь сон слышно, как Нина ходит наверху. Туда-сюда, туда-сюда.', effects: [{ set: '$.c14_rest', value: 'sleep' }, { restUntil: at(15, 18, 20), sleeping: true }] },
      { id: 'c14_ar_wood', label: 'Нарубить дров на два дня вперёд', minutes: 60, activity: 'heavy', terminal: true, goto: 'c14_a_gun',
        text: 'Колун тупой. Ты наловчишься к десятому полену. К тридцатому руки гудят, зато у поленницы новый ряд. Хенрике бы одобрила. Сказала бы, что криво.', effects: [{ set: '$.c14_rest', value: 'wood' }, { restUntil: at(15, 18, 20) }] },
      { id: 'c14_ar_van', label: 'Посидеть на ящике у фургона', minutes: 1, terminal: true, goto: 'c14_a_gun',
        text: 'Ты сидишь на ящике у колеса. Удары из кабины всё реже. Между ними ты успеваешь досчитать до ста. Потом до двухсот.', effects: [{ set: '$.c14_rest', value: 'van' }, { restUntil: at(15, 18, 20) }] },
    ] }),

  S14({ id: 'c14_a_gun', for: 'any', chapter: 'ch3', title: 'Два патрона', camp: house14,
    text: [
      { when: flag('$.c14_saw_gun'), text: 'Ружьё стоит за шкафом, где стояло. Чашка с патронами на полке.' },
      { when: not(flag('$.c14_saw_gun')), text: 'В прихожей ты отодвигаешь шкаф. Ружьё Оле стоит за ним в чехле из старой простыни. На полке чашка без ручки, в ней два патрона.' },
      { text: 'Ночью, как бы вы ни решили, оно может понадобиться. Или оно может понадобиться кому-то другому.' },
    ],
    actions: [
      { id: 'c14_ag_load', label: 'Зарядить и поставить обратно', minutes: 4, terminal: true, goto: 'c14_a_nina',
        text: 'Ты переламываешь ружьё, как видел{m:|а} у Оле. Два патрона входят туго. Щелчок громкий, на весь дом. Наверху Нина перестаёт ходить.', effects: [{ set: '$.c14_gun', value: 'load' }] },
      { id: 'c14_ag_pocket', label: 'Забрать патроны себе в карман', minutes: 2, terminal: true, goto: 'c14_a_nina',
        text: 'Патроны тяжёлые и холодные. Ружьё без них — просто железо. Пусть лучше так.', effects: [{ set: '$.c14_gun', value: 'pocket' }] },
      { id: 'c14_ag_leave', label: 'Не трогать', minutes: 1, terminal: true, goto: 'c14_a_nina',
        text: 'Ты задвигаешь шкаф обратно. Ножки царапают пол, и ты замираешь, будто тебя застали.', effects: [{ set: '$.c14_gun', value: 'leave' }] },
    ] }),

  S14({ id: 'c14_a_nina', for: 'any', chapter: 'ch3', title: 'Нина просит', camp: house14,
    text: [
      { when: metJannes, text: 'Нина ловит тебя в прихожей, у самой двери.\n\n— Ты был{m:|а} у Кёлер, — говорит она. — Яннес написал Уте, Уте мне. — Она сжимает телефон обеими руками. — Ну и что. Ну и ладно.' },
      { when: not(metJannes), text: 'Нина ловит тебя в прихожей. Телефон она сжимает обеими руками.' },
      { when: own14('keys', 'cellar'), text: 'Ты вспоминаешь коробку в подвале: «Für Nina». Хенрике знала, что Нина останется.' },
      { text: '— Они его заберут. Ночью. Тихо, никто не увидит. Там за ним будут смотреть, поить. — Голос у неё срывается. — Только не стреляйте. Пожалуйста. Только не вы.' },
    ],
    actions: [
      { id: 'c14_an_list', label: 'Сказать, что видел{m:|а} шест и картонку', when: any(flag('$.c14_saw_list'), flag('$.c14_saw_gear')), minutes: 5, terminal: true, goto: 'c14_supper',
        text: '— Я знаю. Шлем — чтобы не кусался. Шест — чтобы не подходить близко. — Нина говорит быстро, как выученное. — Уте всё объяснила. Она так уже семь раз делала. Семь!', effects: [{ set: '$.c14_an', value: 'list' }, toSupper] },
      { id: 'c14_an_self', label: 'Спросить, чего она хочет для себя', minutes: 6, terminal: true, goto: 'c14_supper',
        text: '— Для себя? — Нина не понимает вопроса. Потом понимает. — Чтобы он был где-то. Не в яме. Где-то, куда можно прийти.\n\nОна вытирает нос рукавом.\n\n— Это же не глупо?', effects: [{ set: '$.c14_an', value: 'self' }, nina(1), toSupper] },
      { id: 'c14_an_partner', label: 'Сказать: решать будем вдвоём, за ужином', minutes: 3, terminal: true, goto: 'c14_supper',
        text: '— Вдвоём. — Нина кивает. — Ладно. Только по-честному. Я буду слушать с лестницы.', effects: [{ set: '$.c14_an', value: 'partner' }, toSupper] },
      { id: 'c14_an_gun', label: 'Сказать, что Хенрике оставила ружьё для этого', when: flag('$.c14_saw_gun'), minutes: 3, risky: true, terminal: true, goto: 'c14_supper',
        text: 'Нина бледнеет.\n\n— Хенрике, — говорит она. — Ну конечно. — Она поворачивается и уходит наверх. Дверь хлопает так, что в кухне звенит посуда.', effects: [{ set: '$.c14_an', value: 'gun' }, nina(-2), toSupper] },
    ] }),

  // ───────────── Линия B: дом, Нина, Уте ─────────────
  S14({ id: 'c14_b_kitchen', for: 'any', chapter: 'ch3', title: 'Посуда', camp: kitchen14,
    text: [
      { text: 'Вы с Ниной моете посуду. Вода из колодца ледяная, руки краснеют. Нина моет быстро и плохо. Каждые полминуты она вытирает палец о джинсы и трогает телефон в заднем кармане.' },
      { when: leo14, text: 'Лео сидит на подоконнике и рисует пальцем на запотевшем стекле фургон. Квадрат и два круга.' },
    ],
    actions: [
      { id: 'c14_bk_ask', label: 'Спросить, кого она ждёт', minutes: 3, terminal: true, goto: 'c14_b_hens',
        text: '— Никого. — Нина роняет вилку в таз. — Ладно. Одна женщина должна ответить. Из чата. Потом скажу. Правда скажу.', effects: [{ set: '$.c14_bk', value: 'ask' }] },
      { id: 'c14_bk_quiet', label: 'Мыть молча и не смотреть на телефон', minutes: 10, terminal: true, goto: 'c14_b_hens',
        text: 'Нина домывает последнюю тарелку и вдруг говорит, не поворачиваясь:\n\n— Спасибо, что не спрашиваешь.', effects: [{ set: '$.c14_bk', value: 'quiet' }, nina(1)] },
      { id: 'c14_bk_hens', label: 'Позвать её покормить кур: Хенрике просила', minutes: 3, terminal: true, goto: 'c14_b_hens',
        text: '— Курам воды каждый день, — повторяет Нина голосом Хенрике. Почти улыбается. — Пошли.', effects: [{ set: '$.c14_bk', value: 'hens' }] },
    ] }),

  S14({ id: 'c14_b_hens', for: 'any', chapter: 'ch3', title: 'Куры', camp: yard14, ambient: day14,
    text: [
      { text: 'В курятнике пахнет пылью и пером. Куры толкаются у ведра. В гнёздах четыре яйца, одно ещё тёплое.\n\nНина держит яйцо на ладони.\n\n— Папа ел всмятку, — говорит она. — Три минуты. Ни секундой больше. Ставил таймер на телефоне.' },
      { when: leo14, text: 'Лео стоит у сетки и считает кур по-немецки. Каждый раз выходит разное число.' },
    ],
    actions: [
      { id: 'c14_bh_kitchen', label: 'Отнести яйца на кухню, в общий запас', minutes: 8, activity: 'light', terminal: true, goto: 'c14_b_phone',
        text: 'Ты ставишь миску с яйцами на полку у плиты. Четыре яйца. На хуторе, где некому больше считать, это много.', effects: [{ set: '$.c14_hens', value: 'kitchen' }, { give: 'eggs', qty: 4 }, { stock: 'eggs', qty: 4, at: 'c3_farm_stock' }] },
      { id: 'c14_bh_two', label: 'Два в запас, два сварить себе и Нине', minutes: 15, activity: 'light', terminal: true, goto: 'c14_b_phone',
        text: 'Ты ставишь кастрюльку на плиту. Нина достаёт телефон и ставит таймер. Три минуты.\n\nЯйцо горячее, его неудобно держать. Нина ест медленно, маленькой ложкой.', effects: [{ set: '$.c14_hens', value: 'two' }, { give: 'eggs', qty: 4 }, { stock: 'eggs', qty: 2, at: 'c3_farm_stock' }, { camp: { kind: 'consume', type: 'eggs', qty: 1 } }, { body: 'hunger', delta: -6 }, nina(1)] },
      { id: 'c14_bh_water', label: 'Сначала налить курам воды', minutes: 10, activity: 'light', terminal: true, goto: 'c14_b_phone',
        text: 'Поилка пустая, на дне корка льда. Ты разбиваешь её и наливаешь воды из колодца. Куры пьют, задирая головы. Яйца забирает Нина. Ты потом найдёшь их на кухне, в миске.', effects: [{ set: '$.c14_hens', value: 'water' }, { give: 'eggs', qty: 4 }, { stock: 'eggs', qty: 4, at: 'c3_farm_stock' }] },
    ] }),

  S14({ id: 'c14_b_phone', for: 'any', chapter: 'ch3', title: 'Два процента', camp: kitchen14,
    text: [
      { text: 'Нина показывает тебе экран. Два процента, батарейка красная.\n\n— Мне очень надо. Один разговор. — Она смотрит на твой карман, где пауэрбанк.' },
      { when: { v: 'B.c12_bni', op: '==', value: 'bank' }, text: '— Как вчера, — добавляет она. — Я верну. Честно.' },
    ],
    actions: [
      { id: 'c14_bp_give', label: 'Дать пауэрбанк', when: { has: 'powerbank' }, minutes: 25, terminal: true, goto: 'c14_b_water',
        text: 'Нина подключает телефон и уходит с ним в угол, к печке. Пишет что-то долго, стирает, снова пишет. Через двадцать минут возвращает пауэрбанк.\n\n— Она придёт, — говорит Нина. — Сегодня. Днём. Поговорить.', effects: [{ set: '$.c14_bank', value: 'give' }, { charge: 'powerbank', delta: -10 }, nina(1)] },
      { id: 'c14_bp_who', label: 'Сначала спросить, с кем разговор', minutes: 4, terminal: true, goto: 'c14_b_water',
        text: '— С женщиной из чата. Её зовут Уте. — Нина прячет телефон. — Она уже ответила, пока был процент. Сегодня придёт. Днём. Поговорить. — Она поднимает глаза. — Ты будешь рядом? Пожалуйста.', effects: [{ set: '$.c14_bank', value: 'who' }] },
      { id: 'c14_bp_no', label: 'Сказать, что заряд нужен самой', minutes: 2, terminal: true, goto: 'c14_b_water',
        text: '— Понятно. — Нина убирает телефон. Через минуту он гаснет у неё в руке. Она не замечает.', effects: [{ set: '$.c14_bank', value: 'no' }, nina(-1)] },
    ] }),

  S14({ id: 'c14_b_water', for: 'any', chapter: 'ch3', title: 'Без воды', camp: kitchen14,
    text: [{ text: 'Нина садится на табурет у плиты и долго молчит. Потом спрашивает, не глядя на тебя:\n\n— Сколько человек может без воды? Ну, совсем без.' }],
    actions: [
      { id: 'c14_bw_honest', label: 'Ответить честно: дня три, если холодно — чуть больше', minutes: 4, terminal: true, goto: 'c14_b_chat',
        text: 'Нина кивает. Считает на пальцах.\n\n— Тогда хорошо, что я… — Она останавливается. Потом говорит очень быстро: — Я ему ночью воду наливаю. Через доски. Бутылкой. Он пьёт. Слышно, как глотает. Каждую ночь, с того дня.', effects: [{ set: '$.c14_water', value: 'honest' }, { set: '$.c14_knows_water', value: true }, nina(1)] },
      { id: 'c14_bw_why', label: 'Спросить, почему она спрашивает', minutes: 4, terminal: true, goto: 'c14_b_chat',
        text: '— Просто. — Нина смотрит на свои руки. На костяшках ссадины, свежие, от досок. — Ладно. Я его пою. Ночью. Через щель. Он пьёт, глотает. Значит, хочет жить. Значит, там кто-то есть, да?', effects: [{ set: '$.c14_water', value: 'why' }, { set: '$.c14_knows_water', value: true }] },
      { id: 'c14_bw_hard', label: 'Сказать мягко: он уже не человек, Нина', minutes: 3, risky: true, terminal: true, goto: 'c14_b_chat',
        text: '— Я знаю! — Нина вскакивает. — Я знаю, ясно? Все знают. — Она стоит, тяжело дыша. Потом садится обратно. — Он пьёт. Я ночью наливаю, а он пьёт. Каждую ночь.', effects: [{ set: '$.c14_water', value: 'hard' }, { set: '$.c14_knows_water', value: true }, nina(-1)] },
    ] }),

  S14({ id: 'c14_b_chat', for: 'any', chapter: 'ch3', title: 'Мы берём больных', camp: kitchen14,
    text: [
      { text: 'Нина открывает чат «Winsen hilft» и отдаёт тебе телефон. Сообщение от «Ute R.», закреплённое сверху:\n\n«Wir nehmen Kranke auf. Bitte lasst sie nicht erschießen. Wir holen sie ab, nur nachts. Schreibt mir privat.»\n\nМы берём больных. Пожалуйста, не давайте их застрелить. Заберём сами, только ночью. Пишите в личку.\n\nПод ним ответы. «Du bist verrückt». «Danke Ute, Mama ist bei dir». «Das muss die Bundeswehr erfahren». Ты сумасшедшая. Спасибо, мама у тебя. Об этом должен узнать бундесвер.' },
      { when: { v: 'B.c13_bch', op: '==', value: 'truth' }, text: 'Чуть ниже — утреннее сообщение Нины, про Маркуса: «Der Mann mit dem Jungen ist kein Mörder». Под ним лайк от Ute R.' },
    ],
    actions: [
      { id: 'c14_bc_wrote', label: 'Спросить, что она написала Уте', minutes: 4, terminal: true, goto: 'c14_b_ute',
        text: 'Нина открывает личку. Её сообщение, в обед:\n\n«Mein Papa ist im Transporter. Die Soldaten erschießen ihn morgen. Bitte.»\n\nОтвет через шесть минут: «Ich komme heute um drei. Wir reden. Nichts ohne die Leute vom Hof.»\n\nПапа в фургоне, солдаты завтра его застрелят. Пожалуйста. — Приду сегодня в три, поговорим. Ничего без людей с хутора.', effects: [{ set: '$.c14_chat', value: 'wrote' }, { restUntil: at(15, 15) }] },
      { id: 'c14_bc_replies', label: 'Пролистать ответы дальше', minutes: 5, terminal: true, goto: 'c14_b_ute',
        text: 'Ответов много. Кто-то благодарит. Кто-то пишет адрес: «Bendestorf, mein Vater, bitte». Кто-то грозит полицией, которой нет.\n\nОдно сообщение без подписи, с номером: «Parzelle 9. Danke. Ich komme Mittwoch wieder mit Wasser.»\n\nПарцелла девять. Спасибо. Приду в среду снова с водой.', effects: [{ set: '$.c14_chat', value: 'replies' }, { set: '$.c14_saw_parzelle', value: true }, { restUntil: at(15, 15) }] },
      { id: 'c14_bc_partner', label: 'Сказать: {partner} {pm:должен|должна} это увидеть', minutes: 3, terminal: true, goto: 'c14_b_ute',
        text: '— {partner} {pm:ушёл|ушла} к соседке, по следам, — говорит Нина. — Я видела в окно. — Она забирает телефон. — Уте придёт в три. Ты будешь, да? Ты же будешь?', effects: [{ set: '$.c14_chat', value: 'partner' }, { restUntil: at(15, 15) }] },
    ] }),

  S14({ id: 'c14_b_ute', for: 'any', chapter: 'ch3', title: 'У задней калитки', camp: yard14, ambient: day14,
    onEnter: [{ set: '$.met.c14_ute', value: true }, { set: '$.c14_met_ute', value: true }],
    text: [{ text: 'В три у задней калитки звякает велосипедный звонок. Женщина лет пятидесяти пяти, седые волосы под вязаной шапкой, зелёный дождевик. Пустая корзина на багажнике. Лицо спокойное, как у человека, который пришёл по делу.\n\nНина бежит к калитке. Женщина обнимает её через перекладину, как родную. Потом смотрит на тебя.\n\n— Ute Reimers. Aus Winsen. — Она протягивает руку. — Ich war Sekretärin an Ninas Schule. Zwanzig Jahre.\n\nУте Раймерс. Двадцать лет была секретарём в школе Нины.' }],
    actions: [
      { id: 'c14_bu_open', label: 'Открыть калитку и пригласить на кухню', minutes: 5, terminal: true, goto: 'c14_b_ute2',
        text: 'Уте прислоняет велосипед к забору, вытирает ноги о траву. На кухне сразу садится к печке и греет руки. Нина ставит чайник, не спрашивая.', effects: [{ set: '$.c14_bu', value: 'open' }, ute(1)] },
      { id: 'c14_bu_gate', label: 'Говорить через калитку', minutes: 4, terminal: true, goto: 'c14_b_ute2',
        text: 'Уте кивает, будто так и надо. Опирается локтями на перекладину.\n\n— Правильно, — говорит она по-немецки. — Сначала посмотреть на человека.', effects: [{ set: '$.c14_bu', value: 'gate' }] },
      { id: 'c14_bu_sleeves', label: 'Попросить её показать руки', minutes: 4, terminal: true, goto: 'c14_b_ute2',
        text: 'Уте закатывает оба рукава до локтя, не дожидаясь второго слова. Руки в старых шрамах. Тонких, белых. Ни одного свежего.\n\n— Кошки, — говорит она. — У меня было шесть кошек.', effects: [{ set: '$.c14_bu', value: 'sleeves' }, ute(1)] },
    ] }),

  S14({ id: 'c14_b_ute2', for: 'any', chapter: 'ch3', title: 'Кто ест', camp: kitchen14,
    text: [{ text: 'Уте говорит медленно, по-немецки, чтобы ты {m:понял|поняла}. Нина переводит, когда ты хмуришься.\n\nУ неё в садовой колонии у насыпи семеро. Муж, Кай, с прошлой среды. Остальных отдали семьи: соседи, чей-то дед, учитель музыки. Домики запираются. Цепь на ноге, длинная, до порога.\n\n— Sie essen. Sie trinken. Wer isst, ist noch da.\n\nОни едят и пьют. А кто ест, тот ещё здесь.\n\n— Es ist jetzt Ihr Hof. Ohne Sie mache ich nichts.\n\nТеперь это ваш двор. Без вас я ничего не сделаю.' }],
    actions: [
      { id: 'c14_bu2_how', label: 'Спросить, как она их перевозит', minutes: 5, terminal: true, goto: 'c14_b_video',
        text: '— Шест с петлёй. Шлем, визор заклеен. Свет их беспокоит, а в темноте они тихие. — Уте загибает пальцы. — Ремни. Тачка. Яннес толкает, я веду. Семь раз — ни одной царапины.\n\nОна говорит это без гордости. Как рецепт.', effects: [{ set: '$.c14_bu2', value: 'how' }, { set: '$.c14_knows_gear', value: true }] },
      { id: 'c14_bu2_ole', label: 'Сказать: Оле выздоровел до того, как обратиться. Это другое', minutes: 5, terminal: true, goto: 'c14_b_video',
        text: 'Нина переводит. Медленно, запинаясь на каждом слове. Уте слушает и кивает.\n\n— Ja. Das sagt der Arzt auch. — Она улыбается. — Und vor zwei Wochen hat der Arzt gesagt, es ist Meningitis.\n\nДа, врач тоже так говорит. А две недели назад врач говорил, что это менингит.', effects: [{ set: '$.c14_bu2', value: 'ole' }] },
      { id: 'c14_bu2_kai', label: 'Спросить про её мужа', minutes: 4, terminal: true, goto: 'c14_b_video',
        text: '— Kai. — Лицо у неё становится моложе. — Тридцать один год вместе. Он чинил велосипеды всей улице. Даром. — Она достаёт телефон. — Хотите посмотреть?', effects: [{ set: '$.c14_bu2', value: 'kai' }, ute(1)] },
    ] }),

  S14({ id: 'c14_b_video', for: 'any', chapter: 'ch3', title: 'Видео', camp: kitchen14,
    text: [{ text: 'Уте показывает видео. Садовый домик изнутри, вечер, свеча на полке. На матрасе сидит мужчина в свитере. Цепь от щиколотки уходит за кадр. Лица в полутьме не разобрать.\n\n— Kai. Ich bin\'s, — говорит голос Уте.\n\nМужчина поворачивает голову на голос. Медленно, всем телом.\n\nЗа окном домика чирикает дрозд. Мужчина поворачивается туда. Так же медленно, так же всем телом. Потом скрипит дверь. Он поворачивается к двери.\n\n— Siehst du? — говорит Уте. — Er kennt meine Stimme.\n\nВидишь? Он узнаёт мой голос.' }],
    actions: [
      { id: 'c14_bv_bird', label: 'Сказать: он повернулся и на птицу, и на дверь', minutes: 4, risky: true, terminal: true, goto: 'c14_b_van',
        text: 'Нина переводить не хочет. Ты говоришь {m:сам|сама}, как можешь: Vogel. Tür. Птица. Дверь.\n\nУте убирает телефон.\n\n— Ja, — говорит она. — Ich weiß. — И больше ничего.\n\nДа. Я знаю.', effects: [{ set: '$.c14_video', value: 'bird' }, { set: '$.c14_saw_bird', value: true }, ute(-1), { restUntil: at(15, 15, 40) }] },
      { id: 'c14_bv_quiet', label: 'Промолчать и вернуть телефон', minutes: 2, terminal: true, goto: 'c14_b_van',
        text: 'Ты возвращаешь телефон. Уте смотрит на тебя внимательно. Она ждала, что ты что-нибудь скажешь. Ты не говоришь. Она кивает, будто это тоже ответ.', effects: [{ set: '$.c14_video', value: 'quiet' }, { set: '$.c14_saw_bird', value: true }, { restUntil: at(15, 15, 40) }] },
      { id: 'c14_bv_nina', label: 'Посмотреть на Нину, пока она смотрит видео', minutes: 3, terminal: true, goto: 'c14_b_van',
        text: 'Нина смотрит, не моргая. Когда Кай поворачивается к голосу, она выдыхает. Когда к птице, она не замечает. Смотрит только на то, что хочет увидеть.', effects: [{ set: '$.c14_video', value: 'nina' }, { set: '$.c14_saw_bird', value: true }, { restUntil: at(15, 15, 40) }] },
    ] }),

  S14({ id: 'c14_b_van', for: 'any', chapter: 'ch3', title: 'Уте у фургона', camp: tense14, ambient: day14,
    text: [
      { text: 'Чай давно остыл. Уте встаёт и идёт к фургону сама. Стучит в доски тихо, костяшкой, как в дверь к соседу. Светит фонариком в щель. Долго смотрит.\n\n— Ausgetrocknet, — говорит она. — Aber stark. Gut, dass du ihm Wasser gibst, Nina.\n\nОбезвожен, но сильный. Хорошо, что ты даёшь ему воду.\n\nПотом поворачивается к Нине и протягивает ладонь:\n\n— Den Schlüssel. Für heute Nacht.\n\nКлюч. На эту ночь.\n\nНина смотрит на тебя.' },
      { when: leo14, text: 'Лео стоит у крыльца и держит зайца за ухо. Близко к фургону он не подходит.' },
    ],
    actions: [
      { id: 'c14_bvn_keep', label: 'Сказать: ключ пока у Нины, решим вечером', minutes: 4, terminal: true, goto: 'c14_b_dusk',
        text: 'Уте опускает руку, не обидевшись.\n\n— Natürlich. — Она смотрит на часы. — Wir kommen um elf. Wenn nicht — dann nicht.\n\nКонечно. Придём в одиннадцать. Если нет, так нет.\n\nОна уходит через поле, ведя велосипед. Нина стоит с ключом в кулаке.', effects: [{ set: '$.c14_bvn', value: 'keep' }, ute(1), toDusk] },
      { id: 'c14_bvn_nina', label: 'Сказать: это решать Нине', minutes: 3, terminal: true, goto: 'c14_b_dusk',
        text: 'Нина делает шаг к Уте, потом останавливается.\n\n— Вечером, — говорит она. — Пусть {partner} тоже скажет.\n\nУте кивает. «Um elf», — говорит она и уходит через поле, ведя велосипед. В одиннадцать.', effects: [{ set: '$.c14_bvn', value: 'nina' }, nina(1), toDusk] },
      { id: 'c14_bvn_partner', label: 'Сказать: без {partner.gen} ничего не будет', minutes: 3, terminal: true, goto: 'c14_b_dusk',
        text: '— Gut, — говорит Уте. — So ist es richtig.\n\nХорошо. Так правильно.\n\nОна уходит через поле, ведя велосипед. У калитки оборачивается и показывает Нине на пальцах: одиннадцать.', effects: [{ set: '$.c14_bvn', value: 'partner' }, ute(1), toDusk] },
    ] }),

  S14({ id: 'c14_b_dusk', for: 'any', chapter: 'ch3', title: 'Фонарик', camp: house14, ambient: dusk14,
    text: [{ text: 'Темнеет рано. Ты поднимаешься наверх за одеялом и видишь в приоткрытую дверь: Нина стоит у окна с телефоном. На насыпи мигает огонёк. Раз. Два. Три.\n\nНина поднимает телефон и включает фонарик. Раз. Два. Три.' }],
    actions: [
      { id: 'c14_bd_stand', label: 'Подойти и встать рядом', minutes: 4, terminal: true, goto: 'c14_b_rest',
        text: 'Нина не вздрагивает. Она знала, что ты там.\n\n— Это значит «мы тут», — говорит она. — Так Уте придумала. Три раза. А два раза — «нельзя».', effects: [{ set: '$.c14_bd', value: 'stand' }, nina(1)] },
      { id: 'c14_bd_two', label: 'Спросить, что будет, если мигнуть два раза', minutes: 3, terminal: true, goto: 'c14_b_rest',
        text: 'Нина оборачивается.\n\n— Откуда ты… — Она не договаривает. — Два — значит «нельзя, не приходите». — Она прячет телефон за спину. — Я не буду мигать два раза.', effects: [{ set: '$.c14_bd', value: 'two' }] },
      { id: 'c14_bd_leave', label: 'Не мешать и спуститься', minutes: 2, terminal: true, goto: 'c14_b_rest',
        text: 'Ты спускаешься по лестнице. Во дворе мелькает тень: {partner} стоит посреди двора и смотрит на окно Нины.', effects: [{ set: '$.c14_bd', value: 'leave' }] },
    ] }),

  S14({ id: 'c14_b_rest', for: 'any', chapter: 'ch3', title: 'До ужина', camp: house14,
    text: [{ text: 'До ужина больше двух часов. Ночью, похоже, будет не до сна.' }],
    actions: [
      { id: 'c14_br_sleep', label: 'Лечь и поспать', minutes: 1, activity: 'sleep', terminal: true, goto: 'c14_b_letter',
        text: 'Ты засыпаешь, едва коснувшись подушки. Снится школа. Секретарь в окошке выдаёт тебе справку и говорит голосом Уте: «Wer isst, ist noch da».', effects: [{ set: '$.c14_rest', value: 'sleep' }, { restUntil: at(15, 18, 15), sleeping: true }] },
      { id: 'c14_br_soup', label: 'Сварить суп на ужин: картошка, лук', minutes: 1, activity: 'light', terminal: true, goto: 'c14_b_letter',
        text: 'Ты чистишь картошку. Нина спускается и молча режет лук рядом. Плачет над луком. Над луком можно.', effects: [{ set: '$.c14_rest', value: 'soup' }, nina(1), { restUntil: at(15, 18, 15) }] },
      { id: 'c14_br_van', label: 'Посидеть у фургона, пока светло', minutes: 1, terminal: true, goto: 'c14_b_letter',
        text: 'Ты сидишь на ящике у колеса. Удары из кабины редкие, слабые. Один раз, совсем рядом с твоей головой, кто-то царапает доску изнутри. Долго. Потом перестаёт.', effects: [{ set: '$.c14_rest', value: 'van' }, { body: 'stress', delta: 2 }, { restUntil: at(15, 18, 15) }] },
    ] }),

  S14({ id: 'c14_b_letter', for: 'any', chapter: 'ch3', title: 'Сумка для папы', camp: house14,
    text: [{ text: 'Нина собирает на кровати сумку. Папина шапка из дверного кармана фургона. Термос. Шерстяные носки из коробки Хенрике. Фото: Нина маленькая, на плечах у мужчины в такой же шапке.\n\n— Если его заберут, — говорит она. — Чтобы там было его. Чтобы он знал.' }],
    actions: [
      { id: 'c14_bl_help', label: 'Помочь сложить', minutes: 8, terminal: true, goto: 'c14_b_nina',
        text: 'Вы складываете носки, термос, шапку. Фото Нина кладёт последним, сверху, лицом вверх. Застёгивает молнию и долго держит на ней руку.', effects: [{ set: '$.c14_letter', value: 'help' }, nina(1)] },
      { id: 'c14_bl_sure', label: 'Спросить, уверена ли она', minutes: 5, terminal: true, goto: 'c14_b_nina',
        text: '— Нет. — Нина отвечает сразу. — Я ни в чём не уверена. Но если его застрелят солдаты, я буду уверена. Что это всё. — Она застёгивает сумку. — А так ещё не всё.', effects: [{ set: '$.c14_letter', value: 'sure' }] },
      { id: 'c14_bl_know', label: 'Сказать тихо: он тебя не узнает', minutes: 4, risky: true, terminal: true, goto: 'c14_b_nina',
        when: flag('$.c14_saw_bird'),
        text: 'Нина замирает с термосом в руке.\n\n— Я видела, как он на птицу повернулся, — говорит она. — В видео. Думаешь, я не видела? — Она кладёт термос в сумку. — Я не для того, чтобы он узнал. Я для себя.', effects: [{ set: '$.c14_letter', value: 'know' }] },
    ] }),

  S14({ id: 'c14_b_nina', for: 'any', chapter: 'ch3', title: 'Скажи им', camp: house14,
    text: [
      { text: 'Нина садится рядом с тобой на кровать.\n\n— Скажи {partner.dat} «да», — просит она. — Тебя {pm:он|она} послушает. Пожалуйста. Уте их не бьёт, не держит в холоде. Поит. Она их по именам зовёт.' },
      { when: flag('$.c14_saw_parzelle'), text: 'Ты вспоминаешь сообщение без подписи: «Парцелла девять. Спасибо».' },
    ],
    actions: [
      { id: 'c14_bn_yes', label: 'Пообещать сказать «да»', minutes: 3, terminal: true, goto: 'c14_supper',
        text: 'Нина обнимает тебя, быстро и крепко, как маленькая. Потом уходит вниз. Слышно, как она накрывает на стол и считает тарелки вслух.', effects: [{ set: '$.c14_bn', value: 'yes' }, nina(2), toSupper] },
      { id: 'c14_bn_true', label: 'Сказать: расскажу {partner.dat} всё, что видела. Честно', minutes: 4, terminal: true, goto: 'c14_supper',
        text: '— Всё? — Нина смотрит на тебя. — И про птицу? — Она пожимает плечами. — Ладно. Честно так честно.', effects: [{ set: '$.c14_bn', value: 'true' }, toSupper] },
      { id: 'c14_bn_no', label: 'Спросить, что она сделает, если мы скажем «нет»', minutes: 4, terminal: true, goto: 'c14_supper',
        text: 'Нина долго молчит.\n\n— Не знаю, — говорит она наконец. — Правда не знаю. — Ключ от фургона висит у неё на шее, на шнурке. Она держит его в кулаке.', effects: [{ set: '$.c14_bn', value: 'no' }, toSupper] },
    ] }),

  // ───────────── Общий вечер ─────────────
  S14({ id: 'c14_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'Суп из картошки и лука, хлеб, банка слив из подвала. Нина ставит три тарелки. На стене тикают часы Хенрике. Без пяти семь.' },
      { when: leo14, text: 'Лео ест и засыпает с ложкой в руке. Нина уносит его наверх и возвращается.' },
      { text: 'Нина не ест. Она смотрит на часы и считает, сколько до одиннадцати.' },
    ],
    actions: [
      { id: 'c14_s_eat', label: 'Поесть со всеми', minutes: 25, terminal: true, goto: 'c14_evening', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Суп горячий. Сливы сладкие до оскомины. Ты съедаешь всё. Нина смотрит на твою пустую тарелку так, будто это хороший знак.', effects: [meal('eat')] },
      { id: 'c14_s_pack', label: 'Отложить свою порцию на ночь', minutes: 3, terminal: true, goto: 'c14_evening', enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Твой суп переливают в банку. Ночь будет длинной.', effects: [meal('pack')] },
      { id: 'c14_s_skip', label: 'Посидеть, не ужиная', minutes: 15, terminal: true, goto: 'c14_evening',
        text: 'Ты сидишь над пустой тарелкой. Часы тикают. Нина тоже не ест. Вы как два человека на вокзале.' },
      { id: 'c14_s_tell', label: 'Рассказать {partner.dat}, что знаешь', when: once('s_tell'), minutes: 8, combinable: true,
        effects: [{ set: '$.c14_s_tell', value: true }, { set: '$.c14_compared', value: true }],
        outcomes: [
          { id: 'a', when: A14, text: 'Нина уходит наверх, и ты рассказываешь. Сарай Кёлер. Тачка, ремни, шест с петлёй, шлем с заклеенным визором. Картонка с деревнями и галочками. Последняя строчка — ваш хутор. Яннес говорит: у них семеро, его отец на цепи с прошлой среды. Мать верит. Он нет.\n\n{partner} слушает. Потом рассказывает своё.\n\n— Уте была здесь. Добрая. Спокойная. Показала видео с мужем. Он поворачивает голову на её голос. И на птицу за окном тоже. И на дверь. — {pm:Он|Она} молчит. — А Нина поит Йенса. Каждую ночь, через доски. Говорит: раз пьёт, значит, хочет жить.\n\nНаверху тихо скрипит ступенька. Нина слушает с лестницы.' },
          { id: 'b', text: 'Нина уходит наверх, и ты рассказываешь. Нина поит отца каждую ночь, через доски. Уте была здесь: добрая, спокойная, двадцать лет секретарь в школе. У неё семеро на цепях, в садовых домиках. Видео с мужем: он поворачивается на её голос. И на птицу. И на скрип двери.\n\n{partner} слушает. Потом рассказывает своё.\n\n— Я был{pm:|а} в сарае у Кёлер. Там их стоянка. Тачка с ремнями, шест с петлёй, шлем с заклеенным визором. Список: деревни, имена, галочки. Последняя строчка — наш хутор. Сын её, Яннес, не верит. Но таскает им воду.\n\nНаверху тихо скрипит ступенька. Нина слушает с лестницы.' },
        ] },
    ] }),

  S14({ id: 'c14_evening', for: 'any', chapter: 'ch3', title: 'До одиннадцати', camp: kitchen14,
    text: [
      { text: 'Нина спускается и встаёт в дверях кухни. Ключ от фургона висит у неё на шее, на шнурке.\n\n— Уте придёт в одиннадцать, — говорит она. — Если вы скажете «да». Если «нет» — я мигну два раза, и никто не придёт. — Она сглатывает. — И ещё. Что бы вы ни решили. Я хочу быть рядом. Я не маленькая.' },
      { when: A14, text: 'В кармане у тебя записка Хенрике: «Для Йенса, если придётся».' },
      { when: B14, text: 'Ты помнишь, как Кай на видео поворачивался к птице.' },
      { when: flag('$.c14_knows_water'), text: 'Под навесом тихо. Воронка торчит из щели в досках. Сегодня ночью Нина снова пойдёт туда с бутылкой, если ничего не изменится.' },
    ],
    actions: [
      { id: 'c14_e_partner', label: 'Выйти с {partner.ins} на крыльцо и решить', minutes: 5, terminal: true, goto: 'c14_checkpoint',
        effects: [{ set: '$.c14_finished', value: true }, toNight] },
      { id: 'c14_e_van', label: 'Сначала постоять у фургона', when: A14, minutes: 5, terminal: true, goto: 'c14_checkpoint',
        text: 'Из кабины ни звука. Ты ждёшь. Потом один удар, слабый, будто изнутри кто-то просто прислонился к двери.', effects: [{ set: '$.c14_finished', value: true }, toNight] },
      { id: 'c14_e_nina', label: 'Сказать Нине: решим и сразу скажем', when: B14, minutes: 3, terminal: true, goto: 'c14_checkpoint',
        text: 'Нина кивает и садится на ступеньку лестницы. Обхватывает колени. Ключ на шнурке качается.', effects: [{ set: '$.c14_finished', value: true }, toNight, nina(1)] },
    ] }),

  S14({ id: 'c14_checkpoint', for: 'any', chapter: 'ch3', title: 'Тачка в одиннадцать', checkpoint: 14, universal: false,
    text: [{ text: 'Что будет с Йенсом этой ночью и где будет Нина, решаете вы вдвоём.' }], actions: [] }),
];
