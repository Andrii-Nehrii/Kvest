import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import {
  S48, cellar48, dark48, day48, fed48, harburg48, henrike48, merle48, parents48, set48, trip48, tue48, uke48, until48, w48,
} from './point48';

// Участок 48, линия B. Колонна: автобус (Мерле; люди, которых {A} вписал в список у парома и на дамбе, — по КТ45), Харбургский
// мост (проверка, пропуск Тобиаса — `w.c46_pass`), город-острова, ворота больницы в Эппендорфе, отделение, старшая сестра
// Вольтерс и её предложение, вечер с Мерле, окно на тёмный город; ночёвка в больнице (место `c48_uke`). Обычный день — утро
// порознь: дом, Люллау (Бары), фрау Ханзен; после обеда — общий день хутора.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S48({ ...scene, for: 'any', chapter: 'ch3' });
const U = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => X({ ...scene, location: uke48, camp: scene.camp ?? trip48(uke48), safe: true });
const toHarburg: Effect = { move: harburg48 };
const toUke: Effect = { move: uke48 };
const ward = { tempC: 20, outdoor: false, wet: false };
const bus = { tempC: 8, outdoor: false, wet: false };
const fokken: Cond = v('w.c45_fokken', 'listed');
const pregnant: Cond = any(v('w.c45_ferry', 'pregnant'), all(not(fokken), any(v('w.c45_ferry', 'dialysis'), v('w.c45_ferry', 'inhaler'))));
const dialysis: Cond = any(v('w.c45_ferry', 'dialysis'), v('w.c45_ferry', 'nils'), all(not(fokken), v('w.c45_ferry', 'pregnant')));
const boy: Cond = v('w.c45_ferry', 'boy');
const pass: Cond = flag('w.c46_pass');
const lullau = 'c26_lullau';
const done = (key: string, value: string): Effect => set48(key, value);

export const day48BScenes: Scene[] = [
  // ═════════════ Колонна ═════════════
  X({ id: 'c48_hb_bus', title: 'Автобус', location: harburg48, camp: trip48(harburg48), ambient: bus,
    text: [
      { text: 'Рейсовый автобус с крестом на боку пахнет соляркой и мокрой шерстью. Двадцать мест, двадцать человек: больные и те, кто с ними. Мерле у окна, сумка-холодильник на коленях.' },
      { when: fokken, text: 'Через проход — старики с дамбы в Теспе, про которых говорили на сверке: Гезина под тремя пледами, синие губы, и Тамме в фартуке под пальто. Он держит её руку и смотрит вперёд.' },
      { when: dialysis, text: 'Сзади сидит серый мужчина с повязкой на руке: диализ, три недели без процедуры. Его вписали в список у парома в Хоопте.' },
      { when: pregnant, text: 'Через два ряда — беременная, восьмой месяц, ноги отекли так, что сапоги расстёгнуты. Её вписали у парома.' },
      { when: boy, text: 'В конце салона — женщина с мальчиком лет восьми. Мальчик дышит со свистом и смотрит в окно. Их вписали у парома в Хоопте вдвоём.' },
    ],
    actions: [
      { id: 'c48_hbb_merle', label: 'Сидеть с Мерле и смотреть с ней в окно', minutes: 60, terminal: true, goto: 'c48_hb_bridge', ambientDuring: bus,
        text: 'Мерле называет деревни, мимо которых едете: Хиттфельд, Майлер, Майнсен. В Майнсене у неё была подруга по лагерю. «Ob die noch lebt?» Интересно, жива ли. Ты не знаешь. Она тоже.', effects: [done('hbb', 'merle'), npc('merle', 1), toHarburg, until48(8, 30)] },
      { id: 'c48_hbb_fokken', label: 'Пересесть к старикам Фоккен: Гезине плохо', when: fokken, minutes: 60, terminal: true, goto: 'c48_hb_bridge', ambientDuring: bus,
        text: 'Пульс частый и слабый, губы синие, но она в сознании и даже улыбается. Ты поднимаешь ей ноги на сумку и расстёгиваешь ворот. Тамме смотрит на тебя и говорит: «Sie sind die Frau von dem auf dem Deich». Вы жена того, что был на дамбе. Ты не поправляешь.', effects: [done('hbb', 'fokken'), w48('b_met_fokken', true), toHarburg, until48(8, 30)] },
      { id: 'c48_hbb_pregnant', label: 'Подсесть к беременной: проверить давление и отёки', when: pregnant, minutes: 60, terminal: true, goto: 'c48_hb_bridge', ambientDuring: bus,
        text: 'Тонометра нет, есть пальцы и часы. Пульс частый, отёки высокие, голова болит с утра. Ты говоришь ей лечь на бок и не вставать до самой больницы. Она ложится на два сиденья и закрывает глаза. Ты отмечаешь время.', effects: [done('hbb', 'pregnant'), w48('b_watched_pregnant', true), toHarburg, until48(8, 30)] },
      { id: 'c48_hbb_boy', label: 'Подсесть к мальчику с астмой', when: boy, minutes: 60, terminal: true, goto: 'c48_hb_bridge', ambientDuring: bus,
        text: 'Ты учишь его дышать, как учат детей: нос, губы трубочкой, медленно, считая до четырёх. Мать смотрит на тебя, не мигая. На подъезде к Харбургу мальчик засыпает у неё на коленях, дыша ровнее.', effects: [done('hbb', 'boy'), toHarburg, until48(8, 30)] },
      { id: 'c48_hbb_window', label: 'Смотреть в окно и ни о чём не думать', minutes: 60, terminal: true, goto: 'c48_hb_bridge', ambientDuring: bus,
        text: 'Поля, деревни, пустая автобанная развязка с машинами, вмёрзшими в сугробы. Чем ближе к Харбургу, тем больше брошенного. Потом начинаются склады и заборы, и ты понимаешь, что город начался.', effects: [done('hbb', 'window'), toHarburg, until48(8, 30)] },
    ] }),

  X({ id: 'c48_hb_bridge', title: 'Харбургский мост', location: harburg48, camp: trip48(harburg48), ambient: dark48, safe: false,
    text: [
      { text: 'Перед мостом через Южную Эльбу — стена из контейнеров, проход на одну машину. Наверху контейнеров люди с винтовками, не солдаты: синие куртки портовой полиции, оранжевые жилеты, кто в чём.' },
      { text: 'Всех выводят из автобуса. Проверка: имя по списку, руки до локтя, шея, лицо. У мужчины из второго ряда горит лоб. Человек в синей куртке говорит: «Fieber? Zurück». Жар? Назад.' },
      { text: 'Мужчина кашляет. Ты {m:видел|видела} утром, как он кашлял в Винзене, ещё до автобуса: тот же кашель, что сорок человек в спортзале на прошлой неделе.' },
    ],
    actions: [
      { id: 'c48_hbr_speak', label: 'Сказать охраннику: я медсестра, это грипп, не укус', minutes: 50, terminal: true, goto: 'c48_hb_city', ambientDuring: dark48,
        text: 'Охранник смотрит на тебя, на мужчину, на свою инструкцию. Зовёт старшего. Старший осматривает руки и шею сам, при тебе, долго. «Grippe. Na gut. Aber Sie sind verantwortlich». Грипп. Ладно. Но отвечаете вы. Мужчина садится в автобус и не может сказать «спасибо»: кашляет.', effects: [done('hbr', 'speak'), w48('b_vouched', true), until48(9, 40)] },
      { id: 'c48_hbr_pass', label: 'Показать пропуск Тобиаса и попросить пропустить всех без задержки', when: pass, minutes: 45, terminal: true, goto: 'c48_hb_city', ambientDuring: dark48,
        text: 'Старший долго смотрит на бланк с орлом, на подпись майора, на мелкую подпись сбоку. Потом смотрит на тебя иначе. «Zwei Personen. Hin und zurück». Двое. Туда и обратно. Ставит на пропуске штамп с датой. Мужчину с кашлем осматривает сам и пропускает, не споря.', effects: [done('hbr', 'pass'), w48('pass_stamped', true), until48(9, 30)] },
      { id: 'c48_hbr_silent', label: 'Промолчать: здесь их правила', minutes: 50, terminal: true, goto: 'c48_hb_city', ambientDuring: dark48,
        text: 'Мужчину с кашлем отводят в сторону, к будке у контейнеров. Нильс спорит с охраной, размахивая руками. Через двадцать минут колонна уходит на мост. Мужчина остаётся у будки. Вернут ли его с обратной колонной — ты не знаешь.', effects: [done('hbr', 'silent'), w48('man_left', true), { body: 'stress', delta: 5 }, until48(9, 40)] },
      { id: 'c48_hbr_nils', label: 'Позвать Нильса: он здесь всех знает', minutes: 50, terminal: true, goto: 'c48_hb_city', ambientDuring: dark48,
        text: 'Нильс подходит, кладёт старшему руку на плечо, говорит три слова на гамбургском, которых ты не понимаешь. Старший смеётся. Мужчина с кашлем садится в автобус. Нильс подмигивает тебе: «Den kenn ich seit der Schule». Его я знаю со школы.', effects: [done('hbr', 'nils'), until48(9, 40)] },
    ] }),

  X({ id: 'c48_hb_city', title: 'Город', location: harburg48, camp: trip48(harburg48), ambient: bus,
    text: [
      { text: 'Мост. Под ним Южная Эльба, серая, в льдинах. Потом Вильгельмсбург: дома с пустыми окнами, сгоревший квартал на Фединге, на крыше многоэтажки — флаг из простыни и дым из трубы буржуйки. Там живут.' },
      { text: 'Второй мост, через Северную Эльбу, перегорожен машинами, оставлена одна полоса. На том берегу — город. Краны в порту стоят, как скелеты. Над Хаммербруком в двух офисных башнях горят окна: генераторы. Острова, как говорил Нильс. Между ними вода, которая ходит пешком.' },
    ],
    actions: [
      { id: 'c48_hbc_look', label: 'Смотреть и запоминать дорогу: обратно ехать этим же путём', minutes: 75, terminal: true, goto: 'c48_hb_uke', ambientDuring: bus,
        text: 'Мост, Фединг, второй мост, вокзал с выбитым стеклянным куполом, Альстер подо льдом, по нему идут люди с санками. Ты повторяешь про себя названия, как молитву. Потом Эппендорф, деревья, кирпичные корпуса.', effects: [done('hbc', 'look'), w48('b_knows_route', true), toUke, until48(11, 0)] },
      { id: 'c48_hbc_merle', label: 'Держать Мерле за руку: она перестала говорить', minutes: 75, terminal: true, goto: 'c48_hb_uke', ambientDuring: bus,
        text: 'Мерле смотрит на город и молчит. На мосту через Северную Эльбу она сжимает твою руку так, что больно. Потом отпускает. «Ich war hier mit Papa im Hafen. Im Sommer». Я была здесь с папой в порту. Летом. Больше она ничего не говорит.', effects: [done('hbc', 'merle'), npc('merle', 1), toUke, until48(11, 0)] },
      { id: 'c48_hbc_people', label: 'Смотреть на людей: как здесь живут', minutes: 75, terminal: true, goto: 'c48_hb_uke', ambientDuring: bus,
        text: 'У вокзала — рынок, как в Винзене, только больше: сотни людей, костры в бочках, патруль в синих куртках. На Альстере ловят рыбу в лунках. На балконах сушится бельё. Город живёт островами, но живёт. Ты не {m:ожидал|ожидала} этого и не знаешь, что с этим делать.', effects: [done('hbc', 'people'), w48('b_saw_city', true), toUke, until48(11, 0)] },
      { id: 'c48_hbc_sleep', label: 'Закрыть глаза до самой больницы: впереди длинный день', minutes: 75, terminal: true, goto: 'c48_hb_uke', ambientDuring: bus,
        text: 'Ты закрываешь глаза на мосту и открываешь у ворот. Город проходит мимо тебя звуками: колокол где-то, собака, генератор, крик. Мерле будит тебя, тронув за плечо.', effects: [done('hbc', 'sleep'), { body: 'fatigue', delta: -6 }, toUke, until48(11, 0)] },
    ] }),

  U({ id: 'c48_hb_uke', title: 'Эппендорф', ambient: day48,
    text: [
      { text: 'Больница в Эппендорфе — город в городе: забор с колючей проволокой, мешки с песком у ворот, вышка из лесов. На воротах — очередь, человек сто, в основном старики и матери с детьми. Колонну Красного Креста пропускают мимо очереди.' },
      { text: 'Внутри — свет. Настоящий, электрический, в каждом окне. Тепло, гудит. Ты стоишь у двери приёмного покоя и не можешь сразу войти, как будто {m:забыл|забыла}, как это.' },
    ],
    actions: [
      { id: 'c48_hbu_desk', label: 'Пройти с Мерле к стойке приёма, всё по бумагам', minutes: 50, terminal: true, goto: 'c48_hb_ward',
        text: 'Фамилия, дата рождения, диагноз, что колола, сколько. Девушка за стойкой печатает на настоящем компьютере. Мерле дают браслет с номером. Тебе — бумажку «Begleitung, bis 04.01.». Сопровождение, до 4 января.', effects: [done('hbu', 'desk'), w48('b_registered', true), until48(12, 0)] },
      { id: 'c48_hbu_fokken', label: 'Сначала помочь донести Гезину Фоккен до приёмного', when: fokken, minutes: 50, terminal: true, goto: 'c48_hb_ward',
        text: 'Носилки, Тамме с одной стороны, ты с другой. Гезину забирают сразу, без очереди: синие губы здесь видят. Тамме остаётся в коридоре с её сумкой и снимает шапку. Потом надевает обратно. Потом снова снимает.', effects: [done('hbu', 'fokken'), w48('b_helped_fokken', true), until48(12, 0)] },
      { id: 'c48_hbu_light', label: 'Постоять у окна в коридоре: здесь горит свет', minutes: 40, terminal: true, goto: 'c48_hb_ward',
        text: 'Лампа под потолком гудит и чуть мигает. Ты стоишь под ней, как под солнцем, и смотришь на свои руки. При электричестве они другие: старше, в трещинах. Мерле уже машет тебе от стойки.', effects: [done('hbu', 'light'), until48(11, 50)] },
      { id: 'c48_hbu_guard', label: 'Спросить охранника у дверей, как в городе', minutes: 40, terminal: true, goto: 'c48_hb_ward',
        text: 'Охранник, пожилой, с винтовкой через плечо, говорит, что в Эппендорфе спокойно, в Альтоне нет, а в Бармбеке никто не живёт уже месяц. Ты вспоминаешь свою улицу в Бармбеке и ничего не говоришь.', effects: [done('hbu', 'guard'), until48(11, 50)] },
    ] }),

  U({ id: 'c48_hb_ward', title: 'Отделение', ambient: ward,
    text: [
      { text: 'Эндокринология, четвёртый этаж. Палата на шестерых, все с сахаром. Мерле — на кровати у окна. Врач, молодая, в свитере поверх халата, смотрит на её листок с расчётами, на ветеринарный флакон, на глюкометр, если есть, и долго молчит.' },
      { text: '— U vierzig. Vom Tierarzt. — Она качает головой. — Und Sie leben. Respekt.\n\nU-40. От ветеринара. И вы живы. Уважаю.' },
    ],
    actions: [
      { id: 'c48_hbw_learn', label: 'Слушать врача и записывать новую схему', minutes: 75, terminal: true, goto: 'c48_hb_wolters',
        text: 'Человеческий инсулин, две ручки, новая схема: длинный утром, короткий к еде. Цифры, единицы, хлебные единицы. Ты пишешь мелко, по-немецки, переспрашиваешь дважды. Врач диктует терпеливо: видит, что ты понимаешь.', effects: [done('hbw', 'learn'), w48('b_new_scheme', true), until48(14, 0)] },
      { id: 'c48_hbw_merle', label: 'Сидеть с Мерле, пока её колют и берут кровь', minutes: 75, terminal: true, goto: 'c48_hb_wolters',
        text: 'Кровь из вены, три пробирки. Капельница. Мерле смотрит в потолок и считает лампы. На четвёртой говорит: «Das erste Mal seit November, dass ich nicht rechnen muss». Первый раз с ноября, что мне не надо считать. И плачет. Тихо, без звука.', effects: [done('hbw', 'merle'), npc('merle', 2, 'c48_ward'), until48(14, 0)] },
      { id: 'c48_hbw_ask', label: 'Спросить врача, сколько Мерле пробудет здесь', minutes: 75, terminal: true, goto: 'c48_hb_wolters',
        text: 'Врач пожимает плечами. Неделя, чтобы подобрать дозу. Потом — как пойдёт с мостом. «Insulin haben wir. Bis März. Dann weiß ich es nicht». Инсулин есть. До марта. Дальше не знаю. Она говорит это ровно, как погоду.', effects: [done('hbw', 'ask'), w48('b_knows_march', true), until48(14, 0)] },
    ] }),

  U({ id: 'c48_hb_wolters', title: 'Старшая сестра', ambient: ward, onEnter: [{ set: '$.met.c48_wolters', value: true }],
    text: [
      { text: 'В коридоре тебя останавливает женщина лет пятидесяти, короткая стрижка, очки на шнурке. Дагмар Вольтерс, старшая сестра отделения. Она видела, как ты {m:считал|считала} единицы с врачом.' },
      { text: '— Sie sind Krankenschwester. Ich sehe das. Wir haben vier Schwestern für achtzig Betten. Bleiben Sie. Ein Zimmer, Essen, Strom. Bis zum Frühjahr. Ihre Merle kriegt ihr Insulin, solange ich hier bin.\n\nВы медсестра. Я вижу. У нас четыре сестры на восемьдесят коек. Оставайтесь. Комната, еда, свет. До весны. Ваша Мерле получит инсулин, пока я здесь.' },
    ],
    actions: [
      { id: 'c48_hbo_shift', label: 'Взять смену прямо сейчас, до ужина', minutes: 120, terminal: true, goto: 'c48_hb_canteen',
        text: 'Халат на два размера больше, бейджик «Aushilfe». Два часа ты меряешь сахар, меняешь капельницы, кормишь старика, у которого не слушаются руки. Ты {m:устал|устала} так, как не {m:уставал|уставала} с ноября. И впервые с ноября — правильно.', effects: [done('hbo', 'shift'), w48('b_worked', true), { body: 'fatigue', delta: 8 }, until48(17, 0)] },
      { id: 'c48_hbo_ask', label: 'Спросить честно: а мост? Если я останусь, когда я вернусь домой', minutes: 90, terminal: true, goto: 'c48_hb_canteen',
        text: '— Ehrlich? Nach Silvester will der Senat die Brücke in Harburg für Zivilisten schließen. Nur noch Kolonnen mit Papieren. Ihre Papiere gelten bis zum vierten. Danach — Frühling.\n\nЧестно? После Сильвестра сенат хочет закрыть мост в Харбурге для гражданских. Только колонны с бумагами. Ваши бумаги до четвёртого. Потом — весна.', effects: [done('hbo', 'ask'), w48('b_knows_bridge', true), until48(16, 30)] },
      { id: 'c48_hbo_no', label: 'Сказать сразу: у меня дома человек, я вернусь четвёртого', minutes: 60, terminal: true, goto: 'c48_hb_canteen',
        text: 'Вольтерс кивает, без обиды. «Das sagen alle. Die Hälfte bleibt trotzdem». Так все говорят. Половина всё равно остаётся. Она даёт тебе бумажку с номером своей комнаты. «Falls Sie es sich überlegen». Если передумаете.', effects: [done('hbo', 'no'), w48('b_said_no', true), until48(16, 0)] },
      { id: 'c48_hbo_merle', label: 'Спросить: Мерле получит инсулин, даже если я уеду?', minutes: 60, terminal: true, goto: 'c48_hb_canteen',
        text: 'Вольтерс снимает очки и трёт переносицу. «Ja. Bis März. Danach gibt es niemanden, der für sie fragt. Außer Ihnen». Да. До марта. Потом не будет никого, кто за неё попросит. Кроме вас.', effects: [done('hbo', 'merle'), w48('b_knows_march', true), until48(16, 0)] },
    ] }),

  U({ id: 'c48_hb_canteen', title: 'Столовая', ambient: ward,
    text: [
      { text: 'Столовая больницы в подвале: длинные столы, горячий суп, хлеб, яблоко. Настоящий кофе из автомата, который кто-то наладил. Врачи, сёстры, сопровождающие едят вместе.' },
      { when: flag('w.c48_b_met_fokken'), text: 'За соседним столом Тамме Фоккен ест суп одной рукой, другая лежит на сумке Гезины.' },
    ],
    actions: [
      { id: 'c48_hbca_eat', label: 'Есть медленно, чувствуя каждую ложку', minutes: 45, terminal: true, goto: 'c48_hb_merle',
        text: 'Суп с лапшой и курицей. Настоящей курицей. Ты ешь медленно и думаешь о хуторе, где сейчас тоже ужинают. Без тебя.', effects: [done('hbca', 'eat'), ...fed48(40), until48(18, 0)] },
      { id: 'c48_hbca_nurses', label: 'Сесть к сёстрам за их стол', minutes: 45, terminal: true, goto: 'c48_hb_merle',
        text: 'Четыре сестры, все с синяками под глазами. Они говорят о сменах, о детях, которых не видели неделю, о том, где достать колготки. Одна спрашивает, откуда ты. С хутора под Йестебургом. «Da ist es bestimmt ruhig». Там наверняка спокойно. Ты не споришь.', effects: [done('hbca', 'nurses'), until48(18, 0)] },
      { id: 'c48_hbca_nils', label: 'Подсесть к Нильсу: завтра он едет обратно', minutes: 45, terminal: true, goto: 'c48_hb_merle',
        text: 'Нильс уезжает в шесть утра, пустым. Обратно — четвёртого, за сопровождающими, если мост будет. «Willst du was mitgeben? Für ihn?» Хочешь что-нибудь передать? Для него? Ты пишешь на салфетке три строчки и отдаёшь.', effects: [done('hbca', 'nils'), w48('b_note_home', true), ...fed48(35), until48(18, 0)] },
      { id: 'c48_hbca_tamme', label: 'Сесть к Тамме Фоккену', when: flag('w.c48_b_met_fokken'), minutes: 45, terminal: true, goto: 'c48_hb_merle',
        text: 'Тамме говорит, что Гезине поставили капельницу и что она спит. Что он не спал в чужой кровати с шестьдесят второго года. «Sag deinem Mann, der Aal war gut». Скажи своему мужу, угорь был хороший. Ты не знаешь, про какого угря он, но обещаешь сказать.', effects: [done('hbca', 'tamme'), ...fed48(35), until48(18, 0)] },
    ] }),

  U({ id: 'c48_hb_merle', title: 'Вечер в палате', ambient: ward,
    text: [
      { text: 'Палата Мерле. Лампа над кроватью, телевизор на стене без сигнала, в окне — темнота с редкими огнями. Мерле сидит, обхватив колени, и смотрит на браслет с номером.' },
      { when: parents48, text: '— Mama hat gesagt, ich soll anrufen. Wie denn.\n\nМама сказала, чтобы я позвонила. Как.' },
    ],
    actions: [
      { id: 'c48_hbm_letter', label: 'Помочь Мерле написать письмо домой: Нильс заберёт утром', minutes: 50, terminal: true, goto: 'c48_hb_window',
        text: 'Мерле пишет быстро, крупно, с ошибками, которых раньше не делала. Про свет, про суп, про врача в свитере. Про то, что не страшно. Ты не говоришь ей, что знаешь, что страшно. Письмо — в конверт, на тумбочку.', effects: [done('hbm', 'letter'), w48('merle_letter', true), until48(19, 0)] },
      { id: 'c48_hbm_count', label: 'Пройтись с ней по новой схеме, пока она не запомнит', minutes: 50, terminal: true, goto: 'c48_hb_window',
        text: 'Длинный утром, короткий к еде, хлебные единицы. Мерле повторяет, ошибается, повторяет. На четвёртый раз говорит без ошибок и сама удивляется. «Das ist ja einfach». Это же просто. Не просто. Но теперь — можно.', effects: [done('hbm', 'count'), w48('merle_scheme', true), until48(19, 0)] },
      { id: 'c48_hbm_talk', label: 'Спросить, хочет ли она остаться здесь до весны', minutes: 50, terminal: true, goto: 'c48_hb_window',
        text: 'Мерле молчит долго. «Hier gibt es Insulin. Zuhause gibt es Mama». Здесь есть инсулин. Дома есть мама. Потом: «Und dich. Wenn du bleibst». И тебя. Если ты останешься. Она смотрит на тебя, и ты понимаешь, что ответа она не ждёт. Пока.', effects: [done('hbm', 'talk'), w48('merle_asks', true), until48(19, 0)] },
    ] }),

  U({ id: 'c48_hb_window', title: 'Окно', camp: trip48(uke48, 'sleep'), ambient: ward,
    text: [
      { text: 'Комната для сопровождающих: шесть раскладушек, батарея горячая, в окне — Эппендорф. Огни там и тут, островами. Далеко на юге, за рекой, ничего не видно. Там Харбург, потом поля, потом лес. Потом хутор.' },
      { text: 'В восемь у дежурной сестры на посту включается рация: из больницы передают в Винзен, кто доехал.' },
    ],
    actions: [
      { id: 'c48_hbx_radio', label: 'Попросить дежурную передать в Винзен: «Хутор Людеманов — все доехали»', minutes: 50, terminal: true, goto: 'c48_hbt_dawn',
        text: 'Дежурная кивает и говорит в рацию твои слова, добавив от себя: «und es geht ihnen gut». И у них всё хорошо. Ты не знаешь, услышит ли кто-нибудь на хуторе. Но сказано.', effects: [done('hbx', 'radio'), w48('b_radio', true), tue48(7, 0, true)] },
      { id: 'c48_hbx_window', label: 'Сидеть у окна и смотреть на юг', minutes: 50, terminal: true, goto: 'c48_hbt_dawn',
        text: 'Ты сидишь, прижавшись лбом к холодному стеклу. Где-то там сейчас ужин, лампа, печка. Кто-то, может быть, тоже стоит у окна и смотрит на север. Ты так думаешь, и от этого не легче, а правильнее.', effects: [done('hbx', 'window'), tue48(7, 0, true)] },
      { id: 'c48_hbx_sleep', label: 'Лечь на раскладушку: в тепле глаза закрываются сами', minutes: 50, terminal: true, goto: 'c48_hbt_dawn',
        text: 'Раскладушка скрипит. Батарея греет спину. Ты засыпаешь при свете, потому что выключатель далеко, а вставать нет сил.', effects: [done('hbx', 'sleep'), { body: 'fatigue', delta: -6 }, tue48(7, 0, true)] },
    ] }),

  // ── Вторник в Эппендорфе ──
  U({ id: 'c48_hbt_dawn', title: 'Утро в больнице', ambient: ward,
    text: [
      { text: 'Утро начинается с света: в шесть в коридоре включают лампы, и ты просыпаешься от того, что светло, а не от холода. Батарея горячая. Из крана течёт тёплая вода.' },
      { text: 'Мерле в палате уже сидит с глюкометром больницы и показывает тебе цифру, как пятёрку в дневнике: шесть и два. Первая ровная ночь с ноября.' },
    ],
    actions: [
      { id: 'c48_hbtd_shower', label: 'Встать под горячий душ, пока очередь не проснулась', minutes: 40, terminal: true, goto: 'c48_hbt_round',
        text: 'Горячая вода. Ты стоишь под ней, пока не начинают стучать в дверь, и плачешь, {m:сам|сама} не зная от чего. Потом вытираешься казённым полотенцем и выходишь как новая.', effects: [set48('hbtd', 'shower'), { body: 'stress', delta: -8 }, tue48(7, 45)] },
      { id: 'c48_hbtd_merle', label: 'Позавтракать с Мерле в палате', minutes: 40, terminal: true, goto: 'c48_hbt_round',
        text: 'Хлеб, масло, джем, чай, яйцо. Мерле считает хлебные единицы вслух и ест без страха. Ты смотришь, как она ест, и забываешь есть {m:сам|сама}. Она подталкивает тебе свою тарелку.', effects: [set48('hbtd', 'merle'), ...fed48(35), tue48(7, 45)] },
      { id: 'c48_hbtd_window', label: 'Посмотреть из окна на утренний город', minutes: 30, terminal: true, goto: 'c48_hbt_round',
        text: 'Эппендорф просыпается: дым из труб, люди с санками на улице, патруль в синих куртках у ворот. Где-то далеко звонит колокол. Город. Не мёртвый. Ты не {m:знал|знала}, что так бывает.', effects: [set48('hbtd', 'window'), tue48(7, 30)] },
    ] }),

  U({ id: 'c48_hbt_round', title: 'Обход', ambient: ward,
    text: [
      { text: 'Вольтерс ловит тебя у сестринского поста и молча протягивает халат. Обход: двадцать коек, четыре сестры, одна из них — ты, если согласишься.' },
      { text: 'Старик в восьмой палате прячет ногу под одеялом. Ты видишь: большой палец чёрный. Диабет, мороз, две недели без инсулина. Он просит не говорить врачу: «Die schneiden ab». Отрежут.' },
    ],
    actions: [
      { id: 'c48_hbtr_doctor', label: 'Сказать врачу: так он потеряет не палец, а ногу', minutes: 120, terminal: true, goto: 'c48_hbt_news',
        text: 'Врач смотрит, кивает, пишет. Старика увозят в хирургию после обеда. Он не смотрит на тебя, когда его везут мимо. Вольтерс, проходя, касается твоего плеча: правильно.', effects: [set48('hbtr', 'doctor'), w48('b_worked', true), { body: 'fatigue', delta: 6 }, tue48(10, 30)] },
      { id: 'c48_hbtr_talk', label: 'Сначала сесть к старику и поговорить, потом к врачу', minutes: 120, terminal: true, goto: 'c48_hbt_news',
        text: 'Ты садишься рядом. Он рассказывает про жену, про сад, про то, что ноги — это последнее, что у него осталось своего. Ты держишь его руку и говоришь правду: ногу можно спасти, если сегодня. Он молчит долго. Потом кивает: зови.', effects: [set48('hbtr', 'talk'), w48('b_worked', true), { body: 'fatigue', delta: 5 }, tue48(10, 30)] },
      { id: 'c48_hbtr_rounds', label: 'Делать обход по списку, как велено, и отметить палец в карте', minutes: 120, terminal: true, goto: 'c48_hbt_news',
        text: 'Сахар, давление, капельницы, двадцать коек. Палец ты отмечаешь в карте красным, как положено. Врач увидит или не увидит — уже не тебе решать. Руки делают своё, голова — своё.', effects: [set48('hbtr', 'rounds'), w48('b_worked', true), { body: 'fatigue', delta: 6 }, tue48(10, 30)] },
    ] }),

  U({ id: 'c48_hbt_news', title: 'Новости', ambient: ward,
    text: [
      { text: 'В перерыв ты спускаешься на второй этаж: узнать про тех, с кем {m:ехал|ехала} в автобусе.' },
      { when: v('w.c45_fokken', 'listed'), text: 'Гезина Фоккен в кардиологии, под капельницей, губы уже не синие. Тамме спит на стуле в коридоре, сидя, в пальто, с её сумкой на коленях.' },
      { when: any(v('w.c45_ferry', 'pregnant'), all(not(v('w.c45_fokken', 'listed')), any(v('w.c45_ferry', 'dialysis'), v('w.c45_ferry', 'inhaler')))), text: 'Беременную с отёками ночью прокесарили: мальчик, два восемьсот, живой и громкий. Она плакала и спрашивала, как звали того, кто вписал её в список у парома.' },
      { when: any(v('w.c45_ferry', 'dialysis'), v('w.c45_ferry', 'nils'), v('w.c45_ferry', 'inhaler')), text: 'Мужчину с повязкой подключили к диализу ещё вчера вечером. Говорят, в последний момент.' },
      { when: v('w.c45_ferry', 'boy'), text: 'Мальчику с астмой дали ингалятор и маску. Он дышит ровно и уже спорит с соседом по палате, у кого машинка круче.' },
      { when: all(not(any(flag('w.c45_fokken'), flag('w.c45_ferry'))), flag('w.c48_b_vouched')), text: 'Из автобуса все разошлись по отделениям. Мужчина с гриппом, которого пропустили на мосту, лежит в боксе: грипп, как ты и {m:говорил|говорила}.' },
      { when: all(not(any(flag('w.c45_fokken'), flag('w.c45_ferry'))), not(flag('w.c48_b_vouched'))), text: 'Из автобуса все разошлись по отделениям. Старушку с одышкой из автобуса положили в терапию. Она спит и улыбается во сне.' },
    ],
    actions: [
      { id: 'c48_hbtn_tamme', label: 'Принести Тамме кофе из автомата и разбудить', when: v('w.c45_fokken', 'listed'), minutes: 40, terminal: true, goto: 'c48_hbt_lunch',
        text: 'Тамме пьёт кофе, держа стаканчик обеими руками. Говорит, что Гезина утром спросила, где её фартук. «Wenn sie nach dem Schürze fragt, wird sie gesund». Если спрашивает про фартук — поправится.', effects: [set48('hbtn', 'tamme'), tue48(12, 0)] },
      { id: 'c48_hbtn_baby', label: 'Зайти к роженице: она просила', when: any(v('w.c45_ferry', 'pregnant'), all(not(v('w.c45_fokken', 'listed')), any(v('w.c45_ferry', 'dialysis'), v('w.c45_ferry', 'inhaler')))), minutes: 40, terminal: true, goto: 'c48_hbt_lunch',
        text: 'Она держит сына на груди и спрашивает имя того, кто вписал её у парома. Ты называешь. Она повторяет его медленно, по слогам, и говорит, что второе имя мальчика будет это. Ты не знаешь, что на такое отвечают.', effects: [set48('hbtn', 'baby'), w48('baby_named', true), tue48(12, 0)] },
      { id: 'c48_hbtn_note', label: 'Записать для дома, кто как: через неделю рассказать', minutes: 40, terminal: true, goto: 'c48_hbt_lunch',
        text: 'Ты пишешь на обороте листка с новой схемой Мерле: кто, где, как. Короткими строчками. Дома это захотят знать. Ты тоже {m:хотел|хотела} бы, на их месте.', effects: [set48('hbtn', 'note'), w48('b_notes', true), tue48(12, 0)] },
      { id: 'c48_hbtn_back', label: 'Вернуться на этаж: там нужнее', minutes: 30, terminal: true, goto: 'c48_hbt_lunch',
        text: 'Ты поднимаешься обратно. Новости хорошие, и от этого работается легче. До обеда ты меняешь шесть капельниц и не замечаешь времени.', effects: [set48('hbtn', 'back'), { body: 'fatigue', delta: 3 }, tue48(11, 50)] },
      { id: 'c48_hbtn_merle', label: 'Рассказать Мерле, как дела у тех, с кем ехали', minutes: 30, terminal: true, goto: 'c48_hbt_lunch',
        text: 'Мерле слушает каждую новость, как сказку. На хороших хлопает в ладоши, как маленькая. Потом говорит: «Dann war die Fahrt es wert. Auch für die anderen». Значит, поездка того стоила. И для других тоже.', effects: [set48('hbtn', 'merle'), tue48(11, 50)] },
    ] }),

  U({ id: 'c48_hbt_lunch', title: 'Столовая', ambient: ward,
    text: [
      { text: 'В столовой на стене радио: «Radio Hamburg», работает от больничного генератора. В час — новости сената.' },
      { text: '— …ab dem zweiten Januar wird die Harburger Brücke für den zivilen Verkehr geschlossen. Ausgenommen sind Kolonnen des Roten Kreuzes mit gültigen Papieren…\n\nСо второго января Харбургский мост закрывается для гражданских. Исключение — колонны Красного Креста с действующими бумагами.' },
      { text: 'Твоя бумажка — «Begleitung, bis 04.01.». Четвёртое — после второго. Нильс поедет с бумагами. Наверное.' },
    ],
    actions: [
      { id: 'c48_hbtl_wolters', label: 'Найти Вольтерс и спросить, что это значит для тебя', minutes: 50, terminal: true, goto: 'c48_hbt_city',
        text: '— Für Sie? Nils hat Papiere. Sie fahren am vierten mit ihm. Oder Sie bleiben. — Вольтерс не улыбается. — Aber wenn Sie am vierten nicht im Wagen sitzen, dann bis Ostern.\n\nДля вас? У Нильса бумаги. Вы едете четвёртого с ним. Или остаётесь. Но если четвёртого вас не будет в машине — тогда до Пасхи.', effects: [set48('hbtl', 'wolters'), w48('b_knows_bridge', true), ...fed48(35), tue48(13, 45)] },
      { id: 'c48_hbtl_eat', label: 'Есть и молчать: подумать потом', minutes: 45, terminal: true, goto: 'c48_hbt_city',
        text: 'Суп с фрикадельками, хлеб, компот. Ты ешь, не чувствуя вкуса. Второе января. Четвёртое. Пасха. Цифры стучат в голове, как ложка о тарелку.', effects: [set48('hbtl', 'eat'), w48('b_knows_bridge', true), ...fed48(35), tue48(13, 45)] },
      { id: 'c48_hbtl_merle', label: 'Отнести обед Мерле и рассказать ей новость', minutes: 50, terminal: true, goto: 'c48_hbt_city',
        text: 'Мерле слушает и пожимает плечами: «Ich bleib sowieso. Bis März». Я всё равно остаюсь. До марта. Потом смотрит на тебя: «Und du?» А ты? Ты не отвечаешь. Она кивает, как будто ответ был.', effects: [set48('hbtl', 'merle'), w48('b_knows_bridge', true), ...fed48(30), tue48(13, 45)] },
    ] }),

  X({ id: 'c48_hbt_city', title: 'Город после обеда', location: uke48, camp: trip48(uke48), ambient: day48,
    text: [
      { text: 'После обеда больничный фургон едет на склад аптеки у Главного вокзала за ручками инсулина. Вольтерс посылает тебя с водителем: «Sie können zählen. Er nicht». Вы умеете считать. Он нет.' },
      { text: 'Город днём: мосты над Альстером, люди с санками, костры в бочках у вокзала, рынок под стеклянным куполом, где полстёкол выбито. Патрули в синих куртках. Плакат: «Zusammen durch den Winter». Вместе через зиму.' },
    ],
    actions: [
      { id: 'c48_hbtc_count', label: 'Пересчитать ручки на складе дважды, как велено', minutes: 150, terminal: true, goto: 'c48_hbt_merle', ambientDuring: day48,
        text: 'Двести ручек по накладной, сто восемьдесят в коробках. Ты пересчитываешь трижды. Кладовщик пожимает плечами: «Krieg». Война. Водитель смотрит на тебя с уважением: раньше никто не пересчитывал.', effects: [set48('hbtc', 'count'), w48('b_counted', true), tue48(16, 30)] },
      { id: 'c48_hbtc_market', label: 'Пройтись по рынку под куполом, пока грузят', minutes: 150, terminal: true, goto: 'c48_hbt_merle', ambientDuring: day48,
        text: 'Под куполом торгуют всем: батарейками, свечами, кофе, шоколадом, патронами из-под полы. Денег не берут, берут сигареты и лекарства. Ты ничего не меняешь: тебе нечего. Но запоминаешь, где что. Если останешься — пригодится.', effects: [set48('hbtc', 'market'), w48('b_saw_market', true), tue48(16, 30)] },
      { id: 'c48_hbtc_alster', label: 'Постоять у Альстера, пока водитель курит', minutes: 150, terminal: true, goto: 'c48_hbt_merle', ambientDuring: day48,
        text: 'Альстер подо льдом. По льду идут люди, прямо через озеро, санки за ними. Дети катаются у берега на коньках. Кто-то ловит рыбу в лунке. Ты стоишь и смотришь, как живёт город, который ты {m:считал|считала} мёртвым.', effects: [set48('hbtc', 'alster'), { body: 'stress', delta: -5 }, tue48(16, 30)] },
    ] }),

  U({ id: 'c48_hbt_merle', title: 'Вечер с Мерле', ambient: ward,
    text: [
      { text: 'Вечер. В палате Мерле тихо: соседки спят. Мерле сидит у окна с тетрадью, где раньше считала флаконы. Теперь там другое.' },
      { text: 'Она показывает: список. «Was ich im Frühling mache». Что я буду делать весной. Пункт первый: «Nach Hause». Домой.' },
    ],
    actions: [
      { id: 'c48_hbtm_list', label: 'Дописать в её список свой пункт', minutes: 50, terminal: true, goto: 'c48_hbt_night',
        text: 'Ты пишешь внизу: «Kaffee bei Henrike, zu dritt». Кофе у Хенрике, втроём. Мерле читает, смеётся и обводит пункт сердечком, как школьница. Потом говорит серьёзно: «Zu viert». Вчетвером. И смотрит на тебя: про кого четвёртый — понятно.', effects: [set48('hbtm', 'list'), npc('merle', 1), tue48(18, 45)] },
      { id: 'c48_hbtm_ask', label: 'Спросить прямо: если я уеду четвёртого, ты справишься?', minutes: 50, terminal: true, goto: 'c48_hbt_night',
        text: 'Мерле думает. «Ja. Hier gibt es Strom, Insulin und Frau Wolters». Да. Здесь есть ток, инсулин и фрау Вольтерс. Потом: «Aber ich will nicht, dass du wegen mir bleibst. Und nicht, dass du wegen ihm gehst». Но я не хочу, чтобы ты {m:оставался|оставалась} из-за меня. И чтобы {m:уезжал|уезжала} из-за {pm:него|неё}. Это не помогает.', effects: [set48('hbtm', 'ask'), w48('merle_ok_alone', true), tue48(18, 45)] },
      { id: 'c48_hbtm_quiet', label: 'Просто посидеть рядом', minutes: 50, terminal: true, goto: 'c48_hbt_night',
        text: 'Вы сидите плечом к плечу и смотрите в окно на огни Эппендорфа. Ни о чём не говорите. Мерле засыпает сидя, и ты укрываешь её больничным одеялом.', effects: [set48('hbtm', 'quiet'), { body: 'stress', delta: -4 }, tue48(18, 45)] },
    ] }),

  U({ id: 'c48_hbt_night', title: 'Вечер вторника', camp: trip48(uke48, 'sleep'), ambient: ward,
    text: [
      { text: 'Комната сопровождающих. Пять раскладушек заняты, одна твоя. За окном — огни, островами. Послезавтра Сильвестр. Здесь, говорят, будут петь в столовой и зажгут свечи. Дома — огонь у пожарной части, посты, колокол.' },
    ],
    actions: [
      { id: 'c48_hbtx_radio', label: 'Попросить дежурную передать в Винзен: «Мерле лучше. Я думаю о вас»', minutes: 50, terminal: true, goto: 'c48_checkpoint_uke',
        text: 'Дежурная улыбается, повторяет в рацию твои слова и добавляет от себя: «Grüße an Jesteburg». Привет Йестебургу. Где-то на том конце, может быть, слушают.', effects: [set48('hbtx', 'radio'), w48('b_radio2', true), { set: '$.c48_finished', value: true }, tue48(20, 0)] },
      { id: 'c48_hbtx_write', label: 'Написать письмо домой, которое {m:привезёшь сам|привезёшь сама} или передашь с Нильсом', minutes: 50, terminal: true, goto: 'c48_checkpoint_uke',
        text: 'Ты пишешь про душ, про свет, про старика с пальцем, про рынок под куполом, про Мерле и её список. Не пишешь, что тебе предложили остаться. Это — не в письме. Это — вслух.', effects: [set48('hbtx', 'write'), w48('b_letter', true), { set: '$.c48_finished', value: true }, tue48(20, 0)] },
      { id: 'c48_hbtx_sleep', label: 'Уснуть: смена завтра в шесть', minutes: 50, terminal: true, goto: 'c48_checkpoint_uke',
        text: 'Ты засыпаешь в тепле, под гул батареи. Последняя мысль: дома сейчас холодно, и кто-то подкладывает в печку за двоих.', effects: [set48('hbtx', 'sleep'), { body: 'fatigue', delta: -6 }, { set: '$.c48_finished', value: true }, tue48(20, 0)] },
    ] }),

  X({ id: 'c48_checkpoint_uke', title: 'Вторник, вечер', location: uke48, checkpoint: 48, universal: false, camp: trip48(uke48, 'sleep'), ambient: ward,
    text: [{ text: 'Восемь вечера. Гамбург, Эппендорф. Двадцать девятое декабря.' }], actions: [] }),

  // ═════════════ Обычный день: утро B ═════════════
  X({ id: 'c48_nb_morning', title: 'Утро', camp: kitchen14, ambient: day48,
    text: [
      { text: 'Шесть утра. {A} ушёл к Нильсу в Йестебург. В доме сонно, тепло, дети ещё спят.' },
      { when: merle48, text: 'Мерле сидит на кухне с глюкометром или листком и считает утреннюю дозу. Колонна в Гамбург уходит без неё.' },
      { when: henrike48, text: 'Хенрике замешивает тесто на хлеб и кивает тебе на ведро: вода кончилась.' },
    ],
    actions: [
      { id: 'c48_nbm_water', label: 'Натаскать воды и растопить печь в большой комнате', minutes: 60, terminal: true, goto: 'c48_nb_bahr', activity: 'heavy',
        text: 'Шесть вёдер из колодца, ворот скрипит на морозе. Печь в большой комнате разгорается неохотно. К восьми в доме тепло и пахнет хлебом.', effects: [done('nbm', 'water'), { body: 'fatigue', delta: 4 }, until48(7, 45)] },
      { id: 'c48_nbm_kids', label: 'Разбудить детей и одеть к завтраку', minutes: 60, terminal: true, goto: 'c48_nb_bahr',
        text: 'Шарфы, варежки, носки, кто-то потерял второй ботинок. Через полчаса все за столом, и ты чувствуешь себя так, будто {m:разгрузил|разгрузила} вагон.', effects: [done('nbm', 'kids'), until48(7, 45)] },
      { id: 'c48_nbm_merle', label: 'Посчитать с Мерле дозу и проверить, сколько осталось флаконов', when: merle48, minutes: 60, terminal: true, goto: 'c48_nb_bahr',
        text: 'Пятый флакон начат. Четыре целых. Если не ошибаться — до конца января. Мерле записывает дату в тетрадь и обводит её. Потом закрывает тетрадь и говорит: «Nicht heute». Не сегодня.', effects: [done('nbm', 'merle'), npc('merle', 1), until48(7, 45)] },
      { id: 'c48_nbm_bread', label: 'Помочь Хенрике с хлебом', when: henrike48, minutes: 60, terminal: true, goto: 'c48_nb_bahr',
        text: 'Тесто тугое, руки устают. Хенрике рассказывает, как в детстве на Сильвестр они лили олово и гадали по фигуркам. «Ich hab immer ein Schiff gekriegt. Bin nie gefahren». Мне всегда доставался корабль. Так никуда и не уплыла.', effects: [done('nbm', 'bread'), npc('henrike', 1), until48(7, 45)] },
    ] }),

  X({ id: 'c48_nb_bahr', title: 'Люллау', location: lullau, camp: trip48(lullau), ambient: day48,
    text: [
      { text: 'К Барам в Люллау, два километра по укатанной дороге. Коринна открывает с Мией на руках.' },
      { when: any(v('w.c46_b_mia', 'treated'), v('w.c46_b_mia', 'syrup'), v('w.c46_b_mia', 'amoxi')), text: 'Мия уже не плачет: ухо прошло на третий день. Она тянет к тебе руки, как к знакомой.' },
      { when: flag('w.c46_b_pump_fixed'), text: 'Колонка во дворе работает: ты её {m:отогревал|отогревала} в Рождество, и Коринна каждый вечер, как ты {m:показал|показала}, сливает воду.' },
      { when: all(flag('w.c46_b_pump_note'), not(flag('w.c46_b_pump_fixed'))), text: 'Колонку отогрел Лукас с паяльной лампой: ты {m:передал|передала} ему записку.' },
      { when: cellar48('share'), text: 'На санках за тобой — мешок картошки и три банки из Вальдхофа: так решили на сверке.' },
    ],
    actions: [
      { id: 'c48_nbb_food', label: 'Отдать мешок и банки', when: cellar48('share'), minutes: 60, terminal: true, goto: 'c48_nb_hansen',
        text: 'Коринна смотрит на мешок и не берёт сразу. Потом ставит Мию на пол и обнимает тебя обеими руками, крепко, по-мужски. Эрик утаскивает банку тушёнки к себе под кровать: на чёрный день.', effects: [done('nbb', 'food'), w48('bahr_food', true), until48(9, 30)] },
      { id: 'c48_nbb_mia', label: 'Осмотреть Мию: ухо, горло, жар', minutes: 60, terminal: true, goto: 'c48_nb_hansen',
        text: 'Ухо чистое, горло красное, жара нет. Ты показываешь Коринне, как полоскать ромашкой. Мия хватает тебя за волосы и не отпускает, пока не дадут сухарь.', effects: [done('nbb', 'mia'), until48(9, 30)] },
      { id: 'c48_nbb_erik', label: 'Поговорить с Эриком: он дуется в углу', minutes: 60, terminal: true, goto: 'c48_nb_hansen',
        text: 'Эрик дуется, потому что в Сильвестр они останутся дома. Ты садишься рядом на пол и рассказываешь, как в детстве встречали Новый год. Он слушает сначала через плечо, потом лицом. В конце просит: ещё.', effects: [done('nbb', 'erik'), until48(9, 30)] },
      { id: 'c48_nbb_silvester', label: 'Спросить Коринну, решила ли она про Сильвестр', minutes: 60, terminal: true, goto: 'c48_nb_hansen',
        text: 'Коринна решила: дома. Эрик плакал вечером и сейчас дуется. «Ich kann nicht zwei Kinder tragen und rennen. Das hast du doch auch gesagt». Я не могу нести двоих и бежать. Ты же {m:сам|сама} так {m:говорил|говорила}. Ты так не {m:говорил|говорила}. Но киваешь.', effects: [done('nbb', 'silvester'), w48('bahr_home', true), until48(9, 30)] },
    ] }),

  X({ id: 'c48_nb_hansen', title: 'Фрау Ханзен', location: 'c3_neighbor', camp: trip48('c3_neighbor'), ambient: day48,
    text: [
      { text: 'По дороге назад — к фрау Ханзен.' },
      { when: flag('w.c47_jannes_hansen'), text: 'У её крыльца поленница выше окна, ровная, полено к полену: Яннес колол вчера до темноты. Фрау Ханзен говорит про это так: «Er hackt besser, als er Wache steht». Колет он лучше, чем стоит на посту. Это почти похвала.' },
      { when: not(flag('w.c47_jannes_hansen')), text: 'Фрау Ханзен сидит у окна с вязанием. Говорит, что вчера ждала кого-то, кто так и не пришёл. Кого — не говорит.' },
      { when: cellar48('share'), text: 'Вторая часть из Вальдхофа — для неё: банка тушёнки и картошка.' },
    ],
    actions: [
      { id: 'c48_nbh_food', label: 'Отдать картошку и тушёнку', when: cellar48('share'), minutes: 50, terminal: true, goto: 'c48_nb_back',
        text: 'Фрау Ханзен ставит банку на полку, рядом с фотографией мужа. «Otto hat Stöver nie gemocht. Jetzt isst er dessen Kartoffeln. Na ja». Отто терпеть не мог Штёвера. Теперь его картошку ест. Ну что ж. Отто нет, и она говорит о нём в настоящем.', effects: [done('nbh', 'food'), w48('hansen_food', true), until48(11, 0)] },
      { id: 'c48_nbh_sit', label: 'Посидеть с ней полчаса: чаю, разговор ни о чём', minutes: 50, terminal: true, goto: 'c48_nb_back',
        text: 'Чай из мяты, сухари. Фрау Ханзен рассказывает про Сильвестр шестьдесят лет назад, про санки и бенгальские огни. Смеётся. Потом замолкает и смотрит в окно на дорогу.', effects: [done('nbh', 'sit'), until48(11, 0)] },
      { id: 'c48_nbh_jannes', label: 'Спросить, как прошёл вчерашний день', when: flag('w.c47_jannes_hansen'), minutes: 50, terminal: true, goto: 'c48_nb_back',
        text: 'Фрау Ханзен рассказывает коротко: если кто-то и приходил, то колол и ушёл, не говорил, как она велела. Чай выпил стоя. «Er hat sich bedankt. Für den Tee. Nicht für mehr». Поблагодарил. За чай. Не больше. И это уже много.', effects: [done('nbh', 'jannes'), until48(11, 0)] },
      { id: 'c48_nbh_wood', label: 'Принести ей дров в дом и воды на два дня', minutes: 50, terminal: true, goto: 'c48_nb_back', activity: 'heavy',
        text: 'Охапки к печке, вёдра в бочку. Фрау Ханзен смотрит, как ты работаешь, и говорит в конце: «Komm Silvester rüber, wenn du kannst. Auf eine Tasse». Заходи в Сильвестр, если сможешь. На чашку.', effects: [done('nbh', 'wood'), w48('hansen_invite', true), { body: 'fatigue', delta: 4 }, until48(11, 0)] },
      { id: 'c48_nbh_photo', label: 'Посмотреть с ней старые фотографии на комоде', when: not(flag('w.c47_jannes_hansen')), minutes: 50, terminal: true, goto: 'c48_nb_back',
        text: 'Фотографии в рамках: свадьба в шестидесятых, сын в форме, внуки на пляже. Фрау Ханзен называет всех по именам и годам. Про половину говорит «tot». Про остальных — «weiß nicht». Не знаю.', effects: [done('nbh', 'photo'), until48(11, 0)] },
    ] }),

  X({ id: 'c48_nb_back', title: 'Дорога', camp: trip48('hof_luedemann'), ambient: day48,
    text: [
      { text: 'Домой — полем. Навстречу идёт Уте с бидоном: к колонии, от колодца.' },
      { when: v('w.c47_jannes_leg', 'stitched'), text: '— Er läuft wieder. Mit deinen Stichen. Er sagt, sie jucken. Das heißt, es heilt, oder?\n\nОн снова ходит. С твоими швами. Говорит, чешется. Это значит, заживает, да?' },
      { when: v('w.c47_jannes_leg', 'rest'), text: '— Er sitzt zu Hause und flucht. Wegen dir. Danke.\n\nСидит дома и ругается. Из-за тебя. Спасибо.' },
    ],
    actions: [
      { id: 'c48_nbk_ute', label: 'Проводить Уте до колонии и поговорить', minutes: 60, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48,
        text: 'Вы идёте рядом. Уте говорит про Сильвестр: Яннес хочет стоять на посту у леса, она хочет, чтобы он сидел дома. Спрашивает, что бы сделала ты. Ты не знаешь, что сказать, и говоришь правду: не знаешь.', effects: [done('nbk', 'ute'), until48(12, 0)] },
      { id: 'c48_nbk_carry', label: 'Взять у неё бидон и донести', minutes: 60, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48, activity: 'moderate',
        text: 'Бидон тяжёлый, ручка режет пальцы. До колонии полкилометра. Уте идёт рядом налегке и смеётся впервые с понедельника совета.', effects: [done('nbk', 'carry'), { body: 'fatigue', delta: 3 }, until48(12, 0)] },
      { id: 'c48_nbk_home', label: 'Кивнуть и идти домой: обед', minutes: 40, terminal: true, goto: 'c48_n_lunch', ambientDuring: day48,
        text: 'Ты киваешь Уте и идёшь своей дорогой. Над хутором дым, у калитки следы: {A} уже вернулся или вот-вот.', effects: [done('nbk', 'home'), until48(11, 40)] },
    ] }),
];
