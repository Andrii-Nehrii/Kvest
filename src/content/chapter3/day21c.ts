import type { Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { npc } from './point19';
import {
  A21, B21, S21, car21, convoy, dusk21, fromLue, knowsLea, lea, malte, meetLea, meetMalte, night21, set21, until21, w21,
} from './point21';

// Участок 21, вход C: вечер у колонны на съезде у Гарльсторфа. Порознь на часть: A у грузовиков, B на стоянке у раненых.
// Тяжёлых исходов нет (передышка после 20-й): рискованное стоит ушиба, времени или чьего-то слова.
const C = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => S21({ ...scene, for: 'any', chapter: 'ch3', location: convoy,
  camp: scene.camp ?? { at: convoy, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: scene.ambient ?? dusk21 });
const farm = 'hof_luedemann';
const held: Cond = flag('w.c18_a_held');
const crowbar: Cond = { has: 'crowbar' };
const tool: Cond = { has: 'multitool' };
const hasId: Cond = flag('$.c21_a_id');
const matsDoubt: Cond = flag('w.c19_mats_doubt');
const brandtPlus = set21('brandt_plus', true);
const brandtMinus = set21('brandt_minus', true);
/** Бензина не хватает на дорогу домой: фельдфебель велит отлить три литра для машины с раненым. */
const fuelForWounded: Effect = { if: all(A21, not({ fuelFor: 'opel_corsa', km: 14 })), then: [{ refuel: 'opel_corsa', liters: 3 }] };
const home: Effect[] = [{ drive: 'opel_corsa', km: 12, to: farm }, until21(20, 21, 5)];
const toLine = [{ id: 'a', when: A21, goto: 'c21_c_a_drive' }, { id: 'b', goto: 'c21_c_b_car' }];

export const day21CScenes: Scene[] = [
  C({ id: 'c21_c_site', title: 'Съезд',
    text: [
      { text: 'Автобан над вами тёмный и тихий. Так тихо на нём не было никогда.' },
      { text: 'Съезд перегорожен. Головной грузовик лежит на боку поперёк полосы, кабиной в отбойник. За ним ещё два, целые, с откинутыми бортами. Между ними ходят солдаты с фонарями на стволах. Дальше, у придорожной стоянки, стоят два трактора с прицепами и пожарный «Мерседес» Брандта.' },
      { text: 'Пахнет горелой резиной и соляркой. У стоянки кричит человек, долго, на одной ноте.' },
      { when: fromLue, text: 'Вы приехали с востока, через Зальцхаузен. Последние километры навстречу шли люди с узлами.' },
      { when: not(fromLue), text: 'Двенадцать километров от хутора вы ехали двадцать пять минут.' },
      { when: A21, text: 'Солдат на съезде машет тебе фонарём: дальше нельзя.' },
      { when: B21, text: '{A} притормаживает. Ты смотришь через лобовое стекло и пытаешься понять, сколько здесь людей.' },
    ],
    actions: [
      { id: 'c21_cs_bridge', label: 'Оставить машину на обочине у моста', when: A21, minutes: 15, terminal: true, goto: 'c21_c_ramp',
        text: 'Ты ставишь Corsa носом к дому, за брошенным автобусом, и запираешь. Дальше восемьсот метров пешком по обочине, мимо машин с открытыми дверцами. В одной на заднем сиденье пристёгнуто детское кресло. Пустое.', effects: [set21('cs', 'bridge'), until21(20, 16, 40)] },
      { id: 'c21_cs_tobias', label: 'Свернуть на полевую дорогу от Люллау, как сказал Тобиас', when: all(A21, flag('w.c20_tobias_way')), minutes: 10, terminal: true, goto: 'c21_c_ramp',
        text: 'Колея выводит вас за стоянку, к задним воротам для мусоровозов. Отсюда до второго грузовика шестьдесят шагов. Тобиас сказал правду: у моста стоит толпа, а здесь только забор и темнота.', effects: [set21('cs', 'near'), until21(20, 16, 40)] },
      { id: 'c21_cs_map', label: 'Проехать дорогой, обведённой на карте', when: all(A21, flag('w.c20_field_route'), not(flag('w.c20_tobias_way'))), minutes: 15, terminal: true, goto: 'c21_c_ramp',
        text: 'Полевая дорога идёт вдоль леса и выходит к автобану севернее съезда, у моста через ручей. Отсюда колонну видно сверху, всю сразу: три грузовика, две машины охранения, одна из них без колёс. Спускаться приходится пешком, по откосу.', effects: [set21('cs', 'hill'), until21(20, 16, 40)] },
      { id: 'c21_cs_cordon', label: 'Подъехать прямо к оцеплению', when: A21, minutes: 5, terminal: true, goto: 'c21_c_ramp',
        text: '— Licht aus! Sofort! — кричит солдат и бьёт ладонью по капоту.\n\nСвет выключить. Немедленно.\n\nТы гасишь фары. Машину велят оставить тут же, у отбойника. Солдат записывает номер шариковой ручкой себе на рукав.', effects: [set21('cs', 'cordon'), { body: 'stress', delta: 1 }, until21(20, 16, 40)] },
      { id: 'c21_cs_count', label: 'Сосчитать, сколько там людей и сколько тех', when: B21, minutes: 10, terminal: true, goto: 'c21_c_ramp',
        text: 'Солдат восемь или девять. Пожарных пятеро. На асфальте между грузовиками лежат тёмные кучи. Ты считаешь до одиннадцати и перестаёшь. Двое ещё ходят, у дальнего отбойника. Солдаты идут к ним не торопясь.', effects: [set21('cs', 'count'), { body: 'stress', delta: 1 }, until21(20, 16, 40)] },
      { id: 'c21_cs_kit', label: 'Проверить сумку: бинты, вода, перчатки', when: B21, minutes: 10, terminal: true, goto: 'c21_c_ramp',
        outcomes: [
          { id: 'nina', when: flag('w.c20_kit_ready'), text: 'Бинты, пластырь, таблетки. Каждая упаковка подписана Нининым фломастером: «от крови», «от боли», «от жара». Ты вешаешь сумку через плечо, чтобы руки были свободны.', effects: [set21('cs', 'kit'), set21('kit', true)] },
          { id: 'plain', text: 'Бинты, бутылка воды, перчатки, фонарь. Немного. Ты вешаешь сумку через плечо, чтобы руки были свободны.', effects: [set21('cs', 'kit'), set21('kit', true)] },
        ], effects: [until21(20, 16, 40)] },
      { id: 'c21_cs_sit', label: 'Посидеть ещё минуту: дальше будет некогда', when: B21, minutes: 10, terminal: true, goto: 'c21_c_ramp',
        text: 'Ты сидишь, положив руки на колени. Мотор тикает, остывая. {A} смотрит на тебя и не торопит. Потом вы оба открываете двери одновременно.', effects: [set21('cs', 'sit'), { body: 'stress', delta: -1 }, until21(20, 16, 40)] },
    ] }),

  C({ id: 'c21_c_ramp', title: 'Фельдфебель',
    text: [
      { text: 'У второго грузовика распоряжается фельдфебель с перевязанной головой. Бинт сбился ему на ухо, и он поправляет его той же рукой, которой показывает, куда нести.' },
      { text: '— Zivilisten? Gut. Wer tragen kann, trägt: Verwundete zum Rasthof. Wer ein Brecheisen hat — zum ersten Laster, da klemmt einer.\n\nГражданские? Хорошо. Кто может нести, несёт раненых на стоянку. У кого лом — к первому грузовику, там зажало человека.' },
      { text: 'Он уже не смотрит на вас. Его зовут с трёх сторон сразу: «Kruse! Feldwebel Kruse!»' },
      { when: all(A21, crowbar), text: 'Лом у тебя в багажнике. Он там с первого дня.' },
      { when: B21, text: 'Со стоянки снова кричат. Теперь можно разобрать слова: кто-то зовёт санитара.' },
    ],
    actions: [
      { id: 'c21_cr_cab', label: 'Взять лом и идти к головному грузовику', when: all(A21, crowbar), minutes: 5, terminal: true, goto: 'c21_c_a_cab',
        text: 'Лом холодный и тяжёлый. {B} уже идёт к стоянке и не оглядывается.', effects: [set21('cr', 'cab'), until21(20, 16, 50)] },
      { id: 'c21_cr_hands', label: 'Идти к головному грузовику', when: all(A21, not(crowbar)), minutes: 5, terminal: true, goto: 'c21_c_a_cab',
        text: 'Лома у тебя нет. Есть руки. {B} уже идёт к стоянке и не оглядывается.', effects: [set21('cr', 'cab'), until21(20, 16, 50)] },
      { id: 'c21_cr_donor', label: 'Сначала спросить его про донора из Ганновера', when: A21, minutes: 10, terminal: true, goto: 'c21_c_a_cab',
        text: '— Vermisst, — говорит Крузе, не оборачиваясь. Пропала без вести. — Zweiter Laster, Beifahrersitz. Tür offen, Sitz leer. Wenn Sie sie finden, kriegen Sie einen Orden. Und jetzt los.\n\nВторой грузовик, место пассажира. Дверь открыта, сиденье пустое. Найдёте — получите орден. А теперь идите.', effects: [set21('cr', 'donor'), set21('asked_donor', true), until21(20, 16, 55)] },
      { id: 'c21_cr_station', label: 'Идти на стоянку к раненым', when: B21, minutes: 5, terminal: true, goto: 'c21_c_b_station',
        text: 'Ты идёшь на крик. Под ногами хрустит стекло.', effects: [set21('cr', 'station'), until21(20, 16, 50)] },
      { id: 'c21_cr_water', label: 'Сначала напоить тех, кто сидит у отбойника', when: B21, minutes: 15, terminal: true, goto: 'c21_c_b_station',
        text: 'У отбойника сидят четверо в гражданском, шофёры с колонны. У одного рука на перевязи из ремня. Ты даёшь им воды. Они пьют по очереди, по три глотка, и передают дальше, как передают сигарету.', effects: [set21('cr', 'water'), set21('drivers', true), until21(20, 17, 0)] },
    ] }),

  // ───────────── A: у грузовиков ─────────────
  C({ id: 'c21_c_a_cab', title: 'Головной грузовик',
    text: [
      { text: 'Грузовик лежит на правом боку. Лобовое стекло высыпалось. Из кабины торчит рука в сером рукаве и шевелит пальцами.' },
      { text: '— Hier! Mein Bein!\n\nГолос сорванный. Здесь! Нога!' },
      { text: 'Двое солдат тянут водительскую дверь вверх, как крышку люка. Дверь перекосило, она не идёт. Под кабиной на асфальте лужа солярки. Курить здесь перестали все.' },
      { text: 'За спиной шофёра, на спальной полке, лежит ещё один человек. Он не шевелится.' },
    ],
    actions: [
      { id: 'c21_ac_pry', label: 'Поддеть дверь ломом', when: crowbar, minutes: 20, activity: 'heavy', risky: true, terminal: true, goto: 'c21_c_a_case',
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['strength'] }, text: 'Ты вгоняешь лом в щель у петли и ложишься на него всем весом. Петля лопается со звуком выстрела. Солдаты отворачивают дверь. Шофёр хватает тебя за воротник обеими руками и не отпускает, пока вы втроём не вытаскиваете его на асфальт.\n\n— Malte, — говорит он, будто это сейчас важнее всего. — Ich heiße Malte.', effects: [set21('ac', 'pry'), ...meetMalte, malte(3, 'c21_pulled_me_out')] },
          { id: 'slip', text: 'Лом срывается. Ты бьёшься костяшками о стойку, до крови. Со второго раза петля поддаётся. Шофёра вытаскивают солдаты, ты держишь дверь плечом.\n\n— Malte, — говорит он тебе снизу. — Ich heiße Malte.', effects: [set21('ac', 'slip'), ...meetMalte, malte(2), { injure: 'bruise', site: 'hands', severity: 1 }] },
        ], effects: [until21(20, 17, 15)] },
      { id: 'c21_ac_glass', label: 'Лезть к нему через лобовое стекло', minutes: 20, activity: 'moderate', risky: true, terminal: true, goto: 'c21_c_a_case',
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'], mods: [{ when: { has: 'gloves' }, bonus: 1 }] }, text: 'Ты влезаешь в кабину через пустую раму, по осколкам. Нога шофёра зажата под педалями. Ты упираешься спиной в сиденье и отжимаешь панель ногами. Сантиметр. Ещё один. Он выдёргивает ногу и воет.\n\nНаружу вы выбираетесь вместе.\n\n— Malte. Ich heiße Malte.', effects: [set21('ac', 'glass'), ...meetMalte, malte(3, 'c21_pulled_me_out')] },
          { id: 'cut', text: 'Осколок в раме распарывает тебе ладонь. Неглубоко. До педалей ты всё-таки добираешься и отжимаешь панель ногами. Шофёр выдёргивает ногу и воет.\n\n— Malte, — говорит он потом. — Ich heiße Malte.', effects: [set21('ac', 'cut'), ...meetMalte, malte(3, 'c21_pulled_me_out'), { injure: 'cut', site: 'hands', severity: 1 }] },
        ], effects: [until21(20, 17, 15)] },
      { id: 'c21_ac_hold', label: 'Лечь у кабины с фонарём и говорить с ним, пока тянут солдаты', minutes: 25, terminal: true, goto: 'c21_c_a_case',
        text: 'Ты ложишься на асфальт у пустой рамы и светишь внутрь. Спрашиваешь, как его зовут, откуда он, есть ли дети. Мальте. Из Целле. Двое. Солдаты возятся с дверью двадцать минут. Всё это время он отвечает на твои вопросы и не кричит.', effects: [set21('ac', 'hold'), ...meetMalte, malte(2), until21(20, 17, 20)] },
    ] }),

  C({ id: 'c21_c_a_case', title: 'Чемодан',
    text: [
      { text: 'Второй человек в кабине мёртв. Седой, очки на шнурке, на форме медицинские петлицы. К левому запястью у него цепочкой пристёгнут плоский стальной чемодан.' },
      { text: 'Мальте кладут на плащ-палатку. Он поворачивает голову.\n\n— Der Stabsarzt. Doktor Reuter. Der Koffer muss nach Lüneburg. Hat er hundertmal gesagt.\n\nШтабсарцт. Доктор Ройтер. Чемодан должен попасть в Люнебург. Он повторил это раз сто.' },
      { text: 'На крышке трафаретом: «STUDIE P — Hannover».' },
      { text: 'Солдат рядом с тобой смотрит на цепочку, потом на свои пустые руки.' },
    ],
    actions: [
      { id: 'c21_as_cut', label: 'Перекусить цепочку и отдать чемодан солдату', when: tool, minutes: 10, terminal: true, goto: 'c21_c_a_cargo',
        text: 'Кусачки берут звено с третьего раза. Замок на чемодане сорван ударом, крышка отходит на палец. Сверху лежит лист: таблица, столбцы цифр, внизу жирным: «n = 212. Genesen: 0».\n\nТы прижимаешь крышку и отдаёшь чемодан. Солдат уносит его бегом.', effects: [set21('as', 'cut'), w21('a_saw_zero', true), until21(20, 17, 35)] },
      { id: 'c21_as_read', label: 'Перекусить цепочку и дочитать верхний лист', when: tool, minutes: 15, terminal: true, goto: 'c21_c_a_cargo',
        text: 'Замок сорван ударом. Сверху таблица, внизу жирным: «n = 212. Genesen: 0». Под ней приписка от руки, синей ручкой, с нажимом:\n\n«Wir verlängern nur. Gemeldet am 17.11. Antwort: weitermachen, bis Ersatz da ist. R.»\n\nМы только продлеваем. Доложено семнадцатого. Ответ: продолжать, пока нет замены.\n\nСолдат забирает чемодан у тебя из рук.\n\n— Das ist nicht für Sie.\n\nЭто не для вас.', effects: [set21('as', 'read'), w21('a_saw_zero', true), w21('a_saw_note', true), { body: 'stress', delta: 2 }, until21(20, 17, 40)] },
      { id: 'c21_as_give', label: 'Не трогать: показать солдату, где цепочка', minutes: 5, terminal: true, goto: 'c21_c_a_cargo',
        text: 'Солдат снимает цепочку вместе с часами мертвеца, не расстёгивая. Чемодан он несёт перед собой двумя руками, как несут горячую кастрюлю.', effects: [set21('as', 'give'), until21(20, 17, 30)] },
      { id: 'c21_as_tag', label: 'Снять с мёртвого жетон и отнести Крузе', minutes: 10, terminal: true, goto: 'c21_c_a_cargo',
        text: 'Жетон на шнурке, под воротом. «Reuter, Dr. Wilhelm». Крузе читает его и суёт в нагрудный карман, к трём другим.\n\n— Danke. Den hätten wir vergessen.\n\nСпасибо. Про него бы забыли.', effects: [set21('as', 'tag'), npc('c15_tobias', 1), until21(20, 17, 35)] },
    ] }),

  C({ id: 'c21_c_a_cargo', title: 'Ящики',
    text: [
      { text: 'У второго грузовика кричат. Пожарные Брандта сняли с борта два белых ящика с красными крестами и тащат к трактору. Третий ящик с другой стороны держат двое солдат и не отдают.' },
      { text: '— Die gehen nach Jesteburg! Wir haben Kinder da!\n\nБрандт стоит на подножке трактора, каска сдвинута на затылок. Эти едут в Йестебург! У нас там дети!' },
      { text: '— Befehl ist Lüneburg, — говорит Крузе устало. Приказ — в Люнебург.' },
      { text: 'Ящик качается между ними над асфальтом. Холодильник в нём молчит: мотор не работает с полудня.' },
      { when: held, text: 'Один из пожарных оборачивается и смотрит на тебя дольше, чем на остальных.' },
    ],
    actions: [
      { id: 'c21_ag_army', label: 'Взяться за ящик со стороны солдат', minutes: 10, activity: 'moderate', terminal: true, goto: 'c21_c_a_radio',
        text: 'Ты берёшься за ручку рядом с солдатом. Пожарный напротив отпускает и сплёвывает. Ящик уходит в армейский кузов. Брандт смотрит на тебя сверху и что-то пишет в блокноте.', effects: [set21('ag', 'army'), brandtMinus, npc('c15_tobias', 1), until21(20, 17, 50)] },
      { id: 'c21_ag_brandt', label: 'Помочь пожарным донести ящик до трактора', minutes: 10, activity: 'moderate', terminal: true, goto: 'c21_c_a_radio',
        text: 'Ты берёшься за ручку рядом с пожарным. Солдат смотрит на Крузе. Крузе машет рукой: чёрт с ними. Ящик ставят в прицеп, на солому.\n\n— Du bist doch der vom Lüdemann-Hof, — говорит Брандт. Ты ведь с хутора Людеманов. — Gut. Das merke ich mir.\n\nЯ это запомню.', effects: [set21('ag', 'brandt'), brandtPlus, until21(20, 17, 50)] },
      { id: 'c21_ag_half', label: 'Сказать вслух: делите, пока оно не испортилось', minutes: 10, terminal: true, goto: 'c21_c_a_radio',
        text: 'Ты говоришь это громко, по-немецки, как умеешь. На секунду все смотрят на тебя. Потом Крузе кивает.\n\n— Zwei Kisten Lüneburg, eine Jesteburg. Und jetzt Ruhe.\n\nДва ящика в Люнебург, один в Йестебург. И тихо.\n\nБрандт слезает с подножки и первым берётся за ручку.', effects: [set21('ag', 'half'), until21(20, 17, 50)] },
      { id: 'c21_ag_none', label: 'Не вмешиваться: это их ящики', minutes: 5, terminal: true, goto: 'c21_c_a_radio',
        text: 'Ты стоишь в стороне. Через минуту Крузе делит сам: два ящика в армейский кузов, один в прицеп Брандта. Обе стороны недовольны одинаково.', effects: [set21('ag', 'none'), until21(20, 17, 45)] },
    ] }),

  C({ id: 'c21_c_a_radio', title: 'Рация',
    text: [
      { text: 'В кабине второго грузовика горит зелёная лампочка. Пассажирская дверь открыта, сиденье пустое. На полу лежит женская вязаная шапка.' },
      { text: 'Из динамика сквозь треск:\n\n— …Kolonne sieben, melden. Kolonne sieben, hier Hannover. Melden Sie sich.\n\nКолонна семь, ответьте. Колонна семь, здесь Ганновер. Ответьте.' },
      { text: 'Голос повторяет это ровно, без надежды. Солдат рядом нет.' },
    ],
    actions: [
      { id: 'c21_ar_answer', label: 'Взять тангенту и ответить', minutes: 10, terminal: true, goto: 'c21_c_a_fire',
        text: '— Hier Kolonne sieben, — говоришь ты. — Ausfahrt Garlstorf. Ein Laster umgekippt. Viele Tote. Die Bundeswehr ist da.\n\nПауза длиннее, чем треск.\n\n— Wer spricht?\n\n— Ein Zivilist.\n\n— Verstanden. — И тише, уже не по уставу: — Dann kommt nach uns keiner mehr. Sagen Sie das dem Kommandeur. Ende.\n\nЗначит, после нас никто больше не приедет. Передайте командиру. Конец связи.', effects: [set21('ar', 'answer'), w21('radio', 'answered'), set21('heard_last', true), until21(20, 18, 5)] },
      { id: 'c21_ar_kruse', label: 'Позвать Крузе', minutes: 10, terminal: true, goto: 'c21_c_a_fire',
        text: 'Крузе влезает в кабину, слушает, отвечает коротко, цифрами. Потом долго молчит с тангентой в руке.\n\n— Die schicken nichts mehr, — говорит он не тебе.\n\nОни больше ничего не пришлют.\n\nРацию он выключает сам.', effects: [set21('ar', 'kruse'), w21('radio', 'kruse'), set21('heard_last', true), until21(20, 18, 5)] },
      { id: 'c21_ar_hat', label: 'Поднять шапку и осмотреть кабину', minutes: 10, terminal: true, goto: 'c21_c_a_fire',
        text: 'Шапка серая, с помпоном. Под сиденьем рюкзак: свитер, зубная щётка, учебник по болезням мелких животных с закладкой и студенческий билет. На фотографии девушка с длинной светлой косой.\n\n«Hartmann, Lea. Tierärztliche Hochschule Hannover».\n\nБилет ты кладёшь во внутренний карман. Рация за спиной всё зовёт.', effects: [set21('ar', 'hat'), set21('a_id', true), set21('lea_known', true), { give: 'c21_lea_id' }, until21(20, 18, 5)] },
      { id: 'c21_ar_off', label: 'Выключить: аккумулятор ещё пригодится', minutes: 2, terminal: true, goto: 'c21_c_a_fire',
        text: 'Ты щёлкаешь тумблером. Зелёная лампочка гаснет. Становится слышно, как на стоянке кто-то плачет.', effects: [set21('ar', 'off'), w21('radio', 'off'), until21(20, 18, 0)] },
    ] }),

  C({ id: 'c21_c_a_fire', title: 'У прицепа',
    text: [
      { when: held, text: 'У прицепа с ящиком тебя ждёт пожарный, тот, что смотрел. Широкий, с рыжими усами.\n\n— Du bist der vom Tor. Am Mittwoch.\n\nОн не спрашивает. Ты тот, из калитки. В среду.\n\n— Ich hab dich zum Wagen gebracht.\n\nЭто я вёл тебя к машине.' },
      { when: not(held), text: 'У прицепа с ящиком возится пожарный с рыжими усами. Одному ему борт не поднять.\n\n— He! Fass mal mit an.\n\nЭй! Подсоби.' },
      { text: 'В прицепе, кроме ящика, лежит парень в куртке пожарной дружины не по росту. Рука у него примотана к груди.' },
      { when: flag('w.c20_wood_bag'), text: 'С другой стороны к тебе идёт солдат без каски, с двумя автоматами на плече.\n\n— Hast du einen Haller gesehen? Gefreiter. Der ist heute Morgen los, Hilfe holen.\n\nТы Халлера не видел? Ефрейтор. Утром ушёл за помощью.' },
    ],
    actions: [
      { id: 'c21_af_lift', label: 'Молча помочь поднять борт', minutes: 15, activity: 'moderate', terminal: true, goto: 'c21_c_a_tobias',
        outcomes: [
          { id: 'held', when: held, text: 'Вы поднимаете борт вдвоём. Он затягивает ремень на ящике и долго не убирает руку с пряжки.\n\n— Die Frau vom elften Garten. Die singt jetzt jeden Abend. Man hört es bis zur Wache.\n\nЖенщина из одиннадцатого. Она теперь поёт каждый вечер. Слышно до самой караулки.\n\nОн не извиняется. Но руку тебе подаёт.', effects: [set21('af', 'lift'), brandtPlus] },
          { id: 'plain', text: 'Вы поднимаете борт вдвоём.\n\n— Danke. Sag Brandt nicht, dass ich es allein nicht geschafft hab.\n\nСпасибо. Не говори Брандту, что один я не справился.', effects: [set21('af', 'lift'), brandtPlus] },
        ], effects: [until21(20, 18, 25)] },
      { id: 'c21_af_word', label: 'Сказать, что помнишь его приклад', when: held, minutes: 5, terminal: true, goto: 'c21_c_a_tobias',
        text: '— Ich weiß, — говорит он. Знаю. — Befehl.\n\nОн пожимает плечами и берётся за борт один. Борт срывается и бьёт его по пальцам. Помочь он не просит.', effects: [set21('af', 'word'), brandtMinus, until21(20, 18, 15)] },
      { id: 'c21_af_boy', label: 'Спросить про парня в прицепе', minutes: 10, terminal: true, goto: 'c21_c_a_tobias',
        text: '— Meiner, — говорит пожарный. Мой. — Sechzehn. Wollte unbedingt mit.\n\nШестнадцать. Сам напросился. Он поправляет на парне куртку.\n\n— Der Arm ist durch. Kein Biss. Ich hab dreimal nachgeschaut.\n\nРука сломана. Не укус. Я три раза смотрел.', effects: [set21('af', 'boy'), until21(20, 18, 20)] },
      { id: 'c21_af_haller', label: 'Сказать солдату, где ты нашёл ранец Халлера', when: flag('w.c20_wood_bag'), minutes: 10, terminal: true, goto: 'c21_c_a_tobias',
        text: 'Ты рассказываешь про ложбину у ручья, про шестерых и про ранец с выжженной фамилией. Солдат кивает на каждое слово.\n\n— Dann war er einer von den sechs.\n\nЗначит, он был одним из шестерых.\n\nВторой автомат он снимает с плеча и кладёт в кузов аккуратно, как кладут чужую вещь.', effects: [set21('af', 'haller'), w21('haller_told', true), { body: 'stress', delta: 2 }, until21(20, 18, 25)] },
    ] }),

  C({ id: 'c21_c_a_tobias', title: 'Тобиас', ambient: night21,
    text: [
      { text: 'Тобиас находит тебя сам. Каска у него в руке, волосы мокрые.\n\n— Die Spenderin fehlt. Zweiter Laster, Beifahrersitz leer. Kein Blut im Fahrerhaus.\n\nДонора нет. Второй грузовик, место пассажира пустое. Крови в кабине нет.' },
      { text: 'Он смотрит в темноту за отбойником.\n\n— Wenn sie tot ist, sage ich es dem Jungen selbst.\n\nЕсли она мертва, мальчику я скажу сам.' },
      { when: flag('w.c20_promise_lea'), text: 'Ты обещал Оле посмотреть, что с ней.' },
      { when: hasId, text: 'Её студенческий билет лежит у тебя во внутреннем кармане.' },
    ],
    actions: [
      { id: 'c21_at_search', label: 'Пройти с ним вдоль отбойника с фонарём', minutes: 20, terminal: true, goto: 'c21_c_a_carry',
        text: 'Трава за отбойником примята. Кто-то перелез и пошёл не в поле, а назад, к стоянке, вдоль забора. Следы маленькие, от городских ботинок.\n\n— Sie lebt, — говорит Тобиас. Жива. — Und sie will nicht gefunden werden.\n\nИ не хочет, чтобы её нашли.', effects: [set21('at', 'search'), set21('lea_tracks', true), npc('c15_tobias', 1), until21(20, 18, 45)] },
      { id: 'c21_at_id', label: 'Отдать ему её студенческий билет', when: hasId, minutes: 5, terminal: true, goto: 'c21_c_a_carry',
        text: 'Тобиас светит на фотографию.\n\n— So sieht sie also aus.\n\nВот, значит, какая она.\n\nБилет он убирает в планшет.\n\n— Lange Haare. Blond. Das finden wir.\n\nДлинные волосы, светлые. Найдём.', effects: [set21('at', 'id'), w21('tobias_photo', true), { take: 'c21_lea_id' }, npc('c15_tobias', 2), until21(20, 18, 40)] },
      { id: 'c21_at_ole', label: 'Спросить, что будет с Оле без неё', minutes: 10, terminal: true, goto: 'c21_c_a_carry',
        text: '— Er bleibt, — говорит Тобиас. Останется. — Er hat es versprochen. Den Kindern, nicht uns.\n\nОн обещал. Детям, не нам.\n\nОн надевает каску.\n\n— Ich habe ihn am Mittwoch gesehen. Er sieht aus wie meine Mutter am Ende.\n\nЯ видел его в среду. Он выглядит, как моя мать под конец.', effects: [set21('at', 'ole'), { body: 'stress', delta: 1 }, until21(20, 18, 40)] },
      { id: 'c21_at_silent', label: 'Кивнуть и промолчать', minutes: 5, terminal: true, goto: 'c21_c_a_carry',
        outcomes: [
          { id: 'id', when: hasId, text: 'Ты киваешь. Билет во внутреннем кармане давит на рёбра, как чужой бумажник.', effects: [set21('at', 'silent')] },
          { id: 'plain', text: 'Ты киваешь. Тобиас стоит рядом ещё минуту, потом уходит к грузовикам.', effects: [set21('at', 'silent')] },
        ], effects: [until21(20, 18, 35)] },
    ] }),

  C({ id: 'c21_c_a_carry', title: 'Двести метров', ambient: night21,
    text: [
      { text: 'Мальте лежит на плащ-палатке у колеса. Нога ниже колена вывернута так, как ноги не лежат. Он серый и всё время говорит.\n\n— …und dann sagt der Reuter: fahr schneller, Jessen, die Kinder warten. Und ich fahr schneller.\n\n…и тут Ройтер говорит: быстрее, Йессен, дети ждут. И я еду быстрее.' },
      { text: 'До стоянки двести метров. Носилок у солдат не осталось.' },
    ],
    actions: [
      { id: 'c21_ay_cloak', label: 'Нести вчетвером на плащ-палатке', minutes: 15, activity: 'moderate', terminal: true, goto: 'c21_c_meet',
        text: 'Ты берёшься за угол, трое солдат за остальные. Мальте ругается на каждом шаге. У дверей стоянки он открывает глаза.\n\n— Bist du noch da? Bleib da.\n\nТы ещё тут? Не уходи.', effects: [set21('ay', 'cloak'), malte(1), until21(20, 19, 5)] },
      { id: 'c21_ay_back', label: 'Взять его на спину: так быстрее', minutes: 10, activity: 'heavy', risky: true, terminal: true, goto: 'c21_c_meet',
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3, uses: ['strength', 'mobility'] }, text: 'Ты приседаешь, он обхватывает тебя за шею. Ты идёшь быстро и ровно. У дверей стоянки он говорит тебе в ухо:\n\n— Du bist ein Ochse. Danke.\n\nТы бык. Спасибо.', effects: [set21('ay', 'back'), malte(2), { body: 'fatigue', delta: 5 }] },
          { id: 'knee', text: 'На полпути тебе сводит поясницу. Ты опускаешься на колено, чтобы не уронить его, и он всё-таки бьётся ногой об асфальт. Крик слышно на всём съезде. Дальше вы несёте его вдвоём с солдатом.', effects: [set21('ay', 'knee'), malte(-1), { body: 'fatigue', delta: 8 }] },
        ], effects: [until21(20, 19, 5)] },
      { id: 'c21_ay_splint', label: 'Сначала примотать ногу к черенку лопаты', minutes: 20, terminal: true, goto: 'c21_c_meet',
        text: 'Ты приматываешь голень к черенку сапёрной лопатки ремнём и бинтом. Криво, но нога больше не болтается. Несут его солдаты. Мальте всю дорогу держит тебя за рукав.', effects: [set21('ay', 'splint'), malte(2), until21(20, 19, 5)] },
    ] }),

  // ───────────── B: стоянка ─────────────
  C({ id: 'c21_c_b_station', title: 'Стоянка', ambient: car21,
    text: [
      { text: 'В зале придорожного ресторана сдвинуты столы. На столах и на полу лежат люди: солдаты, шофёры, двое пожарных. Пахнет кровью, кофе и горелым маслом.' },
      { text: 'Между столами ходит девушка в армейской парке не по росту, с повязкой Красного Креста на рукаве. Рукава закатаны выше локтя. Она не суетится. Каждому трогает шею, смотрит зрачки и говорит одно слово: «Warten». Или: «Jetzt».' },
      { text: 'У двери на стуле сидит мёртвый санитар. Лицо ему закрыли его же пилоткой.' },
      { text: 'Девушка видит тебя.\n\n— Du. Kannst du nähen?\n\nТы. Шить умеешь?' },
    ],
    actions: [
      { id: 'c21_bs_strips', label: 'Сказать: шить нет, а стянуть рану полосками умею', when: v('w.c19_b_stitch', 'strips'), minutes: 10, terminal: true, goto: 'c21_c_b_hands',
        text: '— Zeig.\n\nПокажи.\n\nОна подводит тебя к солдату с распоротым предплечьем и смотрит, как ты сводишь края и клеишь первую полоску. Потом вторую.\n\n— Gut. Dann mach die drei da hinten.\n\nХорошо. Тогда займись вон теми тремя.', effects: [set21('bs', 'strips'), ...meetLea, lea(3, 'c21_strips'), until21(20, 17, 10)] },
      { id: 'c21_bs_no', label: 'Сказать честно: нет', minutes: 10, terminal: true, goto: 'c21_c_b_hands',
        text: '— Dann halt fest, — говорит она. Тогда держи.\n\nОна кладёт твои руки на плечи шофёру, которому сейчас будет больно. Ты держишь. Он смотрит тебе в лицо всё время, пока она работает.', effects: [set21('bs', 'no'), ...meetLea, lea(1), { body: 'stress', delta: 1 }, until21(20, 17, 10)] },
      { id: 'c21_bs_kit', label: 'Молча выложить на стол всё из сумки', when: flag('$.c21_kit'), minutes: 5, terminal: true, goto: 'c21_c_b_hands',
        text: 'Бинты, перчатки, вода, пластырь. Она пересчитывает глазами.\n\n— Handschuhe. Endlich.\n\nПерчатки. Наконец-то.\n\nСвои она стягивает и бросает под стол: они в крови по запястья и порваны на двух пальцах.', effects: [set21('bs', 'kit'), ...meetLea, lea(2), { if: { has: 'nitrile_gloves' }, then: [{ take: 'nitrile_gloves' }] }, until21(20, 17, 10)] },
    ] }),

  C({ id: 'c21_c_b_hands', title: 'Руки', ambient: car21,
    text: [
      { text: 'Час ты делаешь то, что она говорит. Держишь, подаёшь, светишь, режешь рукава ножницами. Она работает быстро и с людьми почти не разговаривает. Зато разговаривает с ранами.\n\n— So. Schön stillhalten. Brav.\n\nВот так. Не дёргаемся. Умница.' },
      { text: 'Так говорят с собакой на столе у ветеринара.' },
      { text: 'Солдат с зашитой бровью пробует пошутить: «Bin ich ein Dackel?» Я что, такса? Она не улыбается.\n\n— Dackel halten wenigstens still.\n\nТаксы хотя бы не дёргаются.' },
    ],
    actions: [
      { id: 'c21_bh_ask', label: 'Спросить, где она училась', minutes: 10, terminal: true, goto: 'c21_c_b_bite',
        text: '— Hannover, — говорит она. И после паузы, не поднимая головы: — Sanitätsdienst.\n\nСанитарная служба.\n\nВрёт она плохо: у неё краснеют уши. И зажим она минуту назад назвала полным латинским именем.', effects: [set21('bh', 'ask'), set21('lea_doubt', true), until21(20, 17, 35)] },
      { id: 'c21_bh_work', label: 'Не спрашивать: работать', minutes: 15, terminal: true, goto: 'c21_c_b_bite',
        text: 'Через полчаса она перестаёт говорить тебе, что подать: ты подаёшь сама. Один раз ваши руки сталкиваются над лотком, и она говорит: «Entschuldigung». Первое вежливое слово за вечер.', effects: [set21('bh', 'work'), lea(2), until21(20, 17, 35)] },
      { id: 'c21_bh_tea', label: 'Найти на кухне чайник и напоить тех, кто ждёт', minutes: 15, terminal: true, goto: 'c21_c_b_bite',
        text: 'Плита на кухне ресторана работает от баллона. Ты кипятишь воду в кастрюле для супа и разносишь сладкий чай в бумажных стаканах с эмблемой заправки. Девушке ставишь стакан на край стола. Она выпивает его в два глотка, не глядя.', effects: [set21('bh', 'tea'), lea(1), { body: 'stress', delta: -1 }, { body: 'thirst', delta: -15 }, until21(20, 17, 35)] },
    ] }),

  C({ id: 'c21_c_b_bite', title: 'Жгут', ambient: car21,
    text: [
      { text: 'В углу, отдельно от всех, сидит солдат и держит левую руку правой. Выше локтя у него намотан ремень, так туго, что кисть посинела. На предплечье сквозь рукав проступает тёмный полукруг.\n\n— Abbinden hilft. Hat der Sani gesagt.\n\nПеретянуть — помогает. Санитар сказал.' },
      { text: 'Девушка проходит мимо, смотрит на его руку секунду и идёт дальше. Тебе, вполголоса:\n\n— Hilft nicht. Aber lass ihn glauben.\n\nНе помогает. Но пусть верит.' },
    ],
    actions: [
      { id: 'c21_bb_sit', label: 'Сесть рядом и подержать его за здоровую руку', minutes: 10, terminal: true, goto: 'c21_c_b_bag',
        text: 'Его зовут Нико, ему двадцать. Жгут он затянул сам, за минуту, как учили. Ты киваешь. Ладонь у него горячая и мокрая. Когда ты встаёшь, он говорит:\n\n— Danke, Schwester.\n\nСпасибо, сестра.', effects: [set21('bb', 'sit'), { body: 'stress', delta: 2 }, until21(20, 17, 55)] },
      { id: 'c21_bb_loose', label: 'Ослабить ремень: рука уже синяя', minutes: 10, terminal: true, goto: 'c21_c_b_bag',
        text: 'Ты отпускаешь ремень на два деления. В кисть возвращается кровь, и он морщится.\n\n— Aber es hilft doch?\n\nНо ведь помогает?\n\nТы говоришь: «Ja». Девушка у стола слышит и на секунду закрывает глаза.', effects: [set21('bb', 'loose'), lea(1), { body: 'stress', delta: 1 }, until21(20, 17, 55)] },
      { id: 'c21_bb_kruse', label: 'Выйти и сказать фельдфебелю про укушенного', minutes: 10, terminal: true, goto: 'c21_c_b_bag',
        text: 'Крузе выслушивает и посылает двоих. Нико уводят за стоянку, к мусорным бакам, где под охраной уже сидят двое таких же. Он идёт сам и от двери оглядывается на тебя. Девушка смотрит тебе в лицо долго, без выражения.', effects: [set21('bb', 'kruse'), lea(-1), { body: 'stress', delta: 2 }, until21(20, 17, 55)] },
      { id: 'c21_bb_truth', label: 'Сказать ему правду', minutes: 10, terminal: true, goto: 'c21_c_b_bag',
        text: 'Ты говоришь тихо и так мягко, как можешь. Он слушает до конца. Потом сам расстёгивает ремень и сматывает его на кулак.\n\n— Dann will ich wenigstens beide Hände haben.\n\nТогда пусть у меня хотя бы будут обе руки.\n\nОн просит у тебя бумагу и ручку.', effects: [set21('bb', 'truth'), { body: 'stress', delta: 3 }, until21(20, 17, 55)] },
    ] }),

  C({ id: 'c21_c_b_bag', title: 'Сумка под столом', ambient: car21,
    text: [
      { text: 'Под её столом стоит синяя сумка-холодильник, с какими ездят на пляж. Каждые полчаса она приседает, трогает крышку тыльной стороной ладони и смотрит на полоску с тремя окошками.\n\n— Noch gut, — говорит она сумке. Ещё годится.' },
      { text: 'Она замечает, что ты смотришь.\n\n— Aus dem zweiten Laster. Der Rest ist in den großen Kisten, um die sich draußen alle prügeln. Das hier ist klein. So was vergisst man.\n\nИз второго грузовика. Остальное в больших ящиках, за которые там дерутся. А это маленькое. Про такое забывают.' },
    ],
    actions: [
      { id: 'c21_bg_what', label: 'Спросить, что внутри', minutes: 5, terminal: true, goto: 'c21_c_b_sabine',
        text: '— Plasma. Vier Beutel. Und Insulin.\n\nПлазма. Четыре пакета. И инсулин. Слово «инсулин» она говорит так, как другие говорят «золото».\n\n— In der Kälte hält Plasma fünf Tage. Hier drin bis morgen Abend.\n\nНа холоде плазма живёт пять дней. В этой сумке — до завтрашнего вечера.', effects: [set21('bg', 'what'), set21('bag_known', true), until21(20, 18, 10)] },
      { id: 'c21_bg_ice', label: 'Принести льда из морозилки ресторана', minutes: 10, terminal: true, goto: 'c21_c_b_sabine',
        text: 'Морозилка потекла, но на дне ещё лежит пакет льда для напитков. Она перекладывает лёд в сумку и первый раз смотрит на тебя, а не на твои руки.\n\n— Danke. Das war klug.\n\nСпасибо. Это было умно.', effects: [set21('bg', 'ice'), set21('bag_known', true), lea(2), until21(20, 18, 10)] },
      { id: 'c21_bg_merle', label: 'Сказать: у меня подруга на инсулине, за Эльбой', minutes: 10, terminal: true, goto: 'c21_c_b_sabine',
        text: 'Она перестаёт считать пульс у шофёра.\n\n— Wie lange hat sie noch?\n\nСколько у неё осталось?\n\nТы считаешь вслух: десятого было на девять дней. Она считает тоже.\n\n— Dann ist es seit gestern knapp.\n\nТогда со вчерашнего дня у неё в обрез.\n\n«Возьми» она не говорит. Но сумку ногой задвигает глубже под стол, туда, где её не видно от двери.', effects: [set21('bg', 'merle'), set21('bag_known', true), set21('told_merle', true), lea(1), { body: 'stress', delta: 2 }, until21(20, 18, 10)] },
    ] }),

  C({ id: 'c21_c_b_sabine', title: 'Одеяла', ambient: car21,
    text: [
      { text: 'В зал входит женщина в пожарной куртке с охапкой одеял. Она раздаёт их молча, от стола к столу.' },
      { when: matsDoubt, text: 'Это мать Матса. В четверг на крыльце пункта она сказала тебе, что жара у сына не было ни разу. Она узнаёт тебя и останавливается.\n\n— Mein Vater holt draußen das Plasma. Für Mats. «Zur Sicherheit».\n\nОтец там забирает плазму. Для Матса. «На всякий случай».\n\nОна сжимает одеяло.\n\n— Wenn er es für Mats nimmt, nimmt er es einem Kind weg, das wirklich krank ist.\n\nЕсли он возьмёт её для Матса, он отнимет её у ребёнка, который правда болен.' },
      { when: not(matsDoubt), text: 'Возле тебя она останавливается.\n\n— Sie sind nicht von hier. Lüdemann-Hof? Mein Vater ist der Brandt. Er holt draußen das Plasma für die Kinder im Dorf.\n\nВы не здешняя. С хутора Людеманов? Мой отец — Брандт. Он там забирает плазму для детей в деревне.\n\nПоследние слова она говорит так, будто сама в них не уверена.' },
    ],
    actions: [
      { id: 'c21_bq_tell', label: 'Сказать: скажите ему сами, вас он послушает', when: matsDoubt, minutes: 10, terminal: true, goto: 'c21_c_b_call',
        text: '— Er hört auf niemanden mehr, — говорит она. Он больше никого не слушает. — Seit Sonntag sitzt er nachts an Mats’ Bett und zählt, wie er atmet.\n\nС воскресенья он сидит ночами у кровати Матса и считает, как тот дышит.\n\nВ дверях она оборачивается:\n\n— Sabine. Ich heiße Sabine.', effects: [set21('bq', 'tell'), w21('mats_mother', true), { set: '$.met.c21_sabine', value: true }, until21(20, 18, 30)] },
      { id: 'c21_bq_promise', label: 'Пообещать: если будет случай, вы скажете Брандту сами', when: matsDoubt, minutes: 10, terminal: true, goto: 'c21_c_b_call',
        text: 'Она смотрит на тебя, как смотрят на человека, который пообещал лишнее.\n\n— Dann sagt es ihm so, dass er es überlebt.\n\nТогда скажите так, чтобы он это пережил.\n\nОна называет своё имя: Сабина. И кладёт тебе на плечи последнее одеяло.', effects: [set21('bq', 'promise'), w21('mats_mother', true), w21('sabine_promise', true), { set: '$.met.c21_sabine', value: true }, until21(20, 18, 30)] },
      { id: 'c21_bq_who', label: 'Спросить, сколько в деревне больных детей', when: not(matsDoubt), minutes: 10, terminal: true, goto: 'c21_c_b_call',
        text: '— Ein Mädchen, neun. — Девочка, девять лет. — Und ein Feuerwehrmann, aber der ist kein Kind. Und mein Sohn. Vielleicht.\n\nИ пожарный, но он не ребёнок. И мой сын. Может быть.\n\nНа «может быть» она отворачивается. Потом называет своё имя: Сабина.', effects: [set21('bq', 'who'), { set: '$.met.c21_sabine', value: true }, until21(20, 18, 30)] },
      { id: 'c21_bq_blanket', label: 'Взять у неё половину одеял и разнести дальним столам', minutes: 10, terminal: true, goto: 'c21_c_b_call',
        text: 'Вы разносите одеяла вдвоём. Она знает по именам обоих пожарных и одного шофёра: он возил в деревню хлеб. Уходя, она называет своё имя: Сабина. И говорит, что в пункте в Йестебурге не хватает рук. Если что.', effects: [set21('bq', 'blanket'), { set: '$.met.c21_sabine', value: true }, until21(20, 18, 30)] },
    ] }),

  C({ id: 'c21_c_b_call', title: 'Перекличка', ambient: car21,
    text: [
      { text: 'В дверях встаёт солдат с планшетом и читает фамилии. Раненые отвечают со столов: «Hier». За тех, кто не может, отвечают соседи. Мёртвого санитара он вычёркивает сам.' },
      { text: '— Hartmann, Lea! Spenderin aus Hannover! — Он повышает голос. — Hat jemand die Spenderin gesehen? Junge Frau, blond, langer Zopf!\n\nКто-нибудь видел донора? Молодая женщина, светлая, с длинной косой!' },
      { text: 'Девушка в парке шьёт. Игла идёт ровно, стежок за стежком. Капюшон у неё поднят, хотя в зале тепло. Из-под капюшона на воротник выбилась светлая прядь.' },
      { when: knowsLea, text: 'Лея. Двадцать четыре, ветеринар из Ганновера, замена для Оле. Ты знаешь о ней больше, чем солдат с планшетом.' },
    ],
    actions: [
      { id: 'c21_bc_quiet', label: 'Встать так, чтобы от двери её не было видно', minutes: 5, terminal: true, goto: 'c21_c_b_leg',
        text: 'Ты встаёшь между ней и дверью. Солдат читает следующую фамилию. Игла не сбивается. Когда он уходит, она говорит, не поднимая головы:\n\n— Warum?\n\nПочему?\n\nТы и сама не знаешь.', effects: [set21('bc', 'quiet'), set21('lea_known', true), lea(3, 'c21_hid_me'), until21(20, 18, 50)] },
      { id: 'c21_bc_ask', label: 'Спросить шёпотом: это ты?', minutes: 5, terminal: true, goto: 'c21_c_b_leg',
        text: 'Игла останавливается.\n\n— Ja. Und wenn du es ihnen sagst, liege ich morgen in Lüneburg an einem Schlauch. Bitte nicht. Noch nicht.\n\nДа. И если ты им скажешь, завтра я буду лежать в Люнебурге под трубкой. Пожалуйста, не надо. Пока не надо.\n\nОна снова шьёт. Руки у неё теперь дрожат.', effects: [set21('bc', 'ask'), set21('lea_known', true), lea(1), until21(20, 18, 50)] },
      { id: 'c21_bc_out', label: 'Пойти к двери и сказать солдату', minutes: 5, terminal: true, goto: 'c21_c_b_leg',
        text: 'Ты делаешь шаг к двери. Она ловит тебя за рукав, не вставая, мокрыми пальцами.\n\n— Bitte nicht.\n\nПожалуйста, не надо.\n\nСолдат уже ушёл к грузовикам. На рукаве у тебя остаётся тёмный отпечаток её руки. До конца вечера ты слышишь от неё только «держи» и «подай».', effects: [set21('bc', 'out'), set21('lea_known', true), lea(-3, 'c21_almost_told'), until21(20, 18, 50)] },
      { id: 'c21_bc_none', label: 'Резать бинт дальше: это не твоё дело', minutes: 5, terminal: true, goto: 'c21_c_b_leg',
        text: 'Солдат читает следующую фамилию, потом ещё одну, и уходит. Капюшон она опускает только через десять минут. Коса у неё заправлена под свитер.', effects: [set21('bc', 'none'), set21('lea_known', true), until21(20, 18, 50)] },
    ] }),

  C({ id: 'c21_c_b_leg', title: 'Третий стол', ambient: car21,
    text: [
      { text: 'Дверь распахивают ногой. Солдаты вносят человека на плащ-палатке. С ними {A}, чёрный от солярки по локоть.' },
      { text: 'Нога у шофёра ниже колена смотрит в сторону. Он в сознании и говорит без остановки.\n\n— Tisch drei, — командует девушка. Третий стол. И тебе: — Du hältst oben.\n\nТы держишь сверху.' },
      { text: 'Голень она ощупывает двумя пальцами, как ощупывают лапу.\n\n— Geschlossen. Glück gehabt. Ich zähle bis drei.\n\nЗакрытый. Повезло. Считаю до трёх.\n\nНа счёт «два» она дёргает.' },
    ],
    actions: [
      { id: 'c21_bl_hold', label: 'Держать его за плечи и смотреть в глаза', minutes: 10, terminal: true, goto: 'c21_c_meet',
        text: 'Он кричит тебе в лицо. Потом обмякает. Девушка приматывает ногу к доске от ящика, туго, виток к витку.\n\n— Fertig. Der läuft wieder. In acht Wochen.\n\nГотово. Будет ходить. Через восемь недель.', effects: [set21('bl', 'hold'), ...meetMalte, malte(1), until21(20, 19, 5)] },
      { id: 'c21_bl_talk', label: 'Говорить с ним, чтобы слушал тебя, а не ногу', minutes: 10, terminal: true, goto: 'c21_c_meet',
        text: 'Ты спрашиваешь, как зовут его детей. Яна и Мориц. На «Морице» она дёргает. Имя он договаривает уже сквозь вой. Потом лежит мокрый и повторяет: «Jana und Moritz, Jana und Moritz», пока она мотает бинт.', effects: [set21('bl', 'talk'), ...meetMalte, malte(2), until21(20, 19, 5)] },
      { id: 'c21_bl_board', label: 'Найти, к чему примотать ногу', minutes: 10, terminal: true, goto: 'c21_c_meet',
        text: 'Ты выламываешь боковину из ящика с армейскими пайками: ровная, длинная, с трафаретом «EPa». Девушка примеряет её к голени и кивает.\n\n— Passt. Du denkst mit.\n\nПодходит. Ты соображаешь.', effects: [set21('bl', 'board'), ...meetMalte, lea(1), until21(20, 19, 5)] },
    ] }),

  // ───────────── Снова вместе ─────────────
  C({ id: 'c21_c_meet', title: 'Суп', ambient: night21,
    text: [
      { text: 'В семь пожарные Брандта ставят у входа на стоянку бидон с супом. Армия выдаёт к нему галеты. Едят стоя, на крыльце, под лампой от генератора.' },
      { when: A21, text: '{B} стоит рядом. От неё пахнет йодом, рукава у неё мокрые до локтей.' },
      { when: B21, text: '{A} стоит рядом. От него пахнет соляркой, костяшки у него сбиты.' },
      { text: 'За забором стоянки, в темноте, кто-то идёт по гравию. Солдат поворачивает фонарь. Шаги останавливаются. Потом удаляются.' },
    ],
    actions: [
      { id: 'c21_cm_eat', label: 'Съесть суп и галеты', minutes: 20, terminal: true, goto: 'c21_c_ramp2',
        text: 'Гороховый суп, густой, с копчёным. Ты ешь слишком быстро и обжигаешь язык. Галеты размачиваешь в остатках.', effects: [set21('cm', 'eat'), { body: 'hunger', delta: -40 }, { body: 'thirst', delta: -20 }, until21(20, 19, 30)] },
      { id: 'c21_cm_save', label: 'Съесть суп, галеты убрать в карман', minutes: 15, terminal: true, goto: 'c21_c_ramp2',
        text: 'Суп ты съедаешь до дна. Пачку галет заворачиваешь в платок: ночь длинная, и дома теперь на два рта больше.', effects: [set21('cm', 'save'), { body: 'hunger', delta: -28 }, { body: 'thirst', delta: -20 }, { give: 'crackers' }, until21(20, 19, 30)] },
      { id: 'c21_cm_give', label: 'Отдать свою миску шофёру, который сидит у стены', minutes: 10, terminal: true, goto: 'c21_c_ramp2',
        text: 'У стены сидит шофёр с рукой на ремне. Он берёт миску здоровой рукой и ест, не отрываясь, как едят после суток без еды. Ты допиваешь чай из чужого стакана.', effects: [set21('cm', 'give'), { body: 'thirst', delta: -15 }, { body: 'stress', delta: -1 }, until21(20, 19, 30)] },
    ] }),

  C({ id: 'c21_c_ramp2', title: 'Чей это груз', ambient: night21,
    text: [
      { text: 'На съезде снова кричат. Брандт стоит перед армейским грузовиком, расставив ноги. За его спиной трактор с одним белым ящиком в прицепе. Он хочет второй.' },
      { text: '— In Jesteburg liegen zwei Gebissene und mein Enkel! In Lüneburg liegen Fremde!\n\nВ Йестебурге лежат двое укушенных и мой внук! В Люнебурге — чужие!' },
      { text: '— In Lüneburg liegen acht Kinder, — говорит Крузе. В Люнебурге лежат восемь детей. — Und die Spenderin ist weg. Ohne sie ist das hier alles, was es gibt.\n\nА донор пропала. Без неё вот это — всё, что есть.' },
      { text: 'Тобиас стоит между ними, молчит и смотрит в землю.' },
    ],
    actions: [
      { id: 'c21_c2_kids', label: 'Сказать вслух про детскую палату в Люнебурге', when: any(B21, fromLue), minutes: 10, terminal: true, goto: 'c21_c_order',
        text: 'Ты говоришь про восемь кроватей и про девочку у окна. Говоришь плохо, с ошибками, но тебя слушают. Брандт смотрит на тебя долго.\n\n— Und wer redet für meine?\n\nА кто скажет за моих?\n\nНо от грузовика он отходит.', effects: [set21('c2', 'kids'), until21(20, 19, 50)] },
      { id: 'c21_c2_brandt', label: 'Встать рядом с Брандтом: деревня ближе', minutes: 10, terminal: true, goto: 'c21_c_order',
        text: 'Ты встаёшь рядом. Он не оборачивается, но плечи у него опускаются. Крузе смотрит на вас, на часы и сдаётся: ещё восемь пакетов в прицеп.\n\n— Lüdemann-Hof, — говорит тебе Брандт потом. — Am Montag rede ich mit euch anders.\n\nВ понедельник я поговорю с вами по-другому.\n\nКак именно, он не объясняет.', effects: [set21('c2', 'brandt'), brandtPlus, until21(20, 19, 50)] },
      { id: 'c21_c2_tobias', label: 'Тихо спросить Тобиаса, что он думает', minutes: 10, terminal: true, goto: 'c21_c_order',
        text: '— Ich denke, dass es egal ist, — говорит Тобиас. Я думаю, что это всё равно.\n\nОн сразу поправляется:\n\n— Ich meine: es reicht für keinen. Nicht für die und nicht für die.\n\nТо есть не хватит никому. Ни тем, ни этим.', effects: [set21('c2', 'tobias'), set21('tobias_doubt', true), until21(20, 19, 50)] },
      { id: 'c21_c2_wait', label: 'Стоять и ждать, чем кончится', minutes: 10, terminal: true, goto: 'c21_c_order',
        text: 'Кончается тем, что Крузе отворачивается первым. Брандт уезжает со своим одним ящиком. Трактор ещё долго стучит в темноте.', effects: [set21('c2', 'wait'), until21(20, 19, 50)] },
    ] }),

  C({ id: 'c21_c_order', title: 'Приказ', ambient: night21,
    text: [
      { text: 'Армейские грузовики грузят лежачих. Места в кузовах кончаются раньше, чем раненые. Крузе идёт вдоль гражданских машин и стучит ладонью по крышам.' },
      { text: 'У вашей Corsa он останавливается.\n\n— Sie nehmen zwei. Den Fahrer mit dem Bein und die Sanitäterin, die bleibt bei ihm. Die Sammelstelle Jesteburg ist voll. Haben Sie ein Bett?\n\nВы берёте двоих. Шофёра с ногой и санитарку, она остаётся при нём. Пункт в Йестебурге забит. Кровать у вас есть?' },
      { text: 'Санитарка стоит у него за плечом с синей сумкой в руке, капюшон надвинут на глаза. Крузе её не узнаёт. Для него она та, что шила его людей.' },
      { when: all(A21, not({ fuelFor: 'opel_corsa', km: 14 })), text: 'Ты показываешь на стрелку бензина. Крузе морщится и кричит через плечо: «Drei Liter für den Corsa!»' },
    ],
    actions: [
      { id: 'c21_co_yes', label: 'Сказать: кровать есть', minutes: 5, terminal: true, goto: 'c21_c_load',
        text: '— Gut. Lüdemann-Hof, zwei Personen, — диктует Крузе солдату с планшетом. — Am Montag holen wir ihn ab.\n\nВ понедельник мы его заберём.\n\nПро неё он не говорит ничего.', effects: [set21('co', 'yes'), fuelForWounded, until21(20, 20, 5)] },
      { id: 'c21_co_her', label: 'Спросить, почему санитарка не едет с армией', minutes: 5, terminal: true, goto: 'c21_c_load',
        text: '— Weil ich sie da brauche, wo ein Verwundeter ohne Arzt liegt.\n\nПотому что она мне нужна там, где раненый лежит без врача.\n\nОн оборачивается к ней:\n\n— Wie heißen Sie eigentlich?\n\nКак вас, собственно, зовут?\n\n— Meier, — говорит она сразу. — Sanitätsdienst Hannover.\n\nКрузе кивает и идёт к следующей машине.', effects: [set21('co', 'her'), set21('heard_meier', true), fuelForWounded, until21(20, 20, 5)] },
      { id: 'c21_co_no', label: 'Сказать: в доме дети, чужих мы не берём', minutes: 5, terminal: true, goto: 'c21_c_load',
        text: '— Das war keine Frage, — говорит Крузе. Это был не вопрос.\n\nОн стучит по крыше ещё раз, сильнее, и уходит. Шофёра уже несут к вашей машине.', effects: [set21('co', 'no'), { body: 'stress', delta: 1 }, fuelForWounded, until21(20, 20, 5)] },
    ] }),

  C({ id: 'c21_c_load', title: 'Погрузка', ambient: night21,
    text: [
      { text: 'Мальте кладут на заднее сиденье наискось, ногу в доске просовывают между передними креслами. Санитарка садится рядом с ним и ставит сумку себе под ноги.' },
      { text: 'К водительскому окну подходит Тобиас. Он светит фонарём в салон: на Мальте, на доску. Потом на неё. Луч держится на капюшоне на секунду дольше, чем нужно.' },
      { when: all(A21, flag('w.c21_tobias_photo')), text: 'Её фотография лежит у него в планшете. Ты сам её туда положил.' },
      { text: '— Fahrt vorsichtig. Ab der Brücke ist Glatteis.\n\nЕзжайте осторожно. От моста гололёд.\n\nФонарь он гасит сам.' },
    ],
    actions: [
      { id: 'c21_cl_thanks', label: 'Сказать ему спасибо', minutes: 5, terminal: true, outcomes: toLine,
        text: '— Wofür? — спрашивает Тобиас. За что?\n\nИ отходит от машины, не дожидаясь ответа.', effects: [set21('cl', 'thanks'), npc('c15_tobias', 1), until21(20, 20, 15)] },
      { id: 'c21_cl_look', label: 'Посмотреть ему в глаза и ничего не сказать', minutes: 5, terminal: true, outcomes: toLine,
        text: 'Он выдерживает взгляд. Потом очень медленно, один раз, кивает. Ты не знаешь, что именно он тебе сейчас пообещал.', effects: [set21('cl', 'look'), set21('tobias_nod', true), until21(20, 20, 15)] },
      { id: 'c21_cl_go', label: 'Не задерживаться', minutes: 2, terminal: true, outcomes: toLine,
        text: 'Машина трогается. В зеркале Тобиас стоит на съезде с погашенным фонарём и смотрит вам вслед.', effects: [set21('cl', 'go'), until21(20, 20, 15)] },
    ] }),

  C({ id: 'c21_c_a_drive', title: 'Двенадцать километров', ambient: car21,
    text: [
      { text: 'Фары выхватывают иней на обочинах и пустые дворы. Мальте за спиной дышит сквозь зубы на каждой яме.' },
      { text: 'У поворота на Йестебург санитарка подаётся вперёд, между креслами.\n\n— Nicht zur Sammelstelle. Bitte.\n\nНе в пункт. Пожалуйста.\n\n— Die ist doch voll, — говорит Мальте. Он же забит.\n\n— Trotzdem.\n\nВсё равно.' },
    ],
    actions: [
      { id: 'c21_ad_slow', label: 'Ехать медленно и объезжать каждую яму', minutes: 50, terminal: true, goto: 'c21_h_gate',
        text: 'Ты ведёшь на второй передаче. У моста машину всё равно тянет вбок, мягко, как санки. Ты отпускаешь газ и ждёшь. Колёса находят асфальт. Сзади никто не издаёт ни звука.', effects: [set21('ad', 'slow'), ...home] },
      { id: 'c21_ad_fast', label: 'Ехать быстрее: шофёр совсем белый', minutes: 35, risky: true, terminal: true, goto: 'c21_h_gate',
        outcomes: [
          { id: 'ok', check: { traits: ['driving'], difficulty: 3, uses: ['focus'] }, text: 'Ты держишь шестьдесят. Лёд у моста чувствуешь раньше, чем он начинается: руль становится лёгким. Сбрасываешь и проходишь накатом.\n\n— Der fährt wie ich, — говорит Мальте сзади.\n\nВодит, как я. Это похвала.', effects: [set21('ad', 'fast'), malte(1)] },
          { id: 'spin', text: 'У моста машину ставит поперёк дороги. Ты ловишь её в метре от кювета. Мальте кричит: нога ударилась о спинку кресла. Санитарка говорит ровно, как говорила раненым:\n\n— Langsam. Wir haben Zeit.\n\nТише. Время есть.\n\nДо дома ты едешь на второй.', effects: [set21('ad', 'spin'), malte(-1), { body: 'stress', delta: 3 }] },
        ], effects: home },
      { id: 'c21_ad_promise', label: 'Сказать ей: едем домой, не в пункт', minutes: 50, terminal: true, goto: 'c21_h_gate',
        text: '— Danke, — говорит она и откидывается назад.\n\nЧерез минуту, уже из темноты:\n\n— Ich bin keine Sanitäterin. Das hast du gemerkt, oder? Ich bin Tierärztin. Fast.\n\nЯ не санитарка. Ты ведь заметил? Я ветеринар. Почти.', effects: [set21('ad', 'promise'), set21('lea_vet', true), ...meetLea, lea(2), ...home] },
    ] }),

  C({ id: 'c21_c_b_car', title: 'В машине', ambient: car21,
    text: [
      { text: 'Ты сидишь впереди, вполоборота назад. {A} ведёт медленно. Мальте дышит сквозь зубы на каждой яме. Санитарка держит его ногу обеими руками, чтобы доска не билась о кресла.' },
      { text: '— Ich bin schuld, — говорит Мальте в потолок. Я виноват. — Der Reuter sagt: schneller. Ich fahr schneller. Und dann stehen sie da auf der Bahn. Zwanzig, dreißig. In Hemden.\n\nРойтер говорит: быстрее. Я еду быстрее. А они стоят на полосе. Двадцать, тридцать. В рубашках.' },
    ],
    actions: [
      { id: 'c21_bk_celle', label: 'Спросить его про Целле', minutes: 45, terminal: true, goto: 'c21_h_gate',
        text: 'Он рассказывает про дом с зелёными ставнями. И про то, что Целле ещё в четверг закрыл въезды: своих пускают по спискам, чужих разворачивают.\n\n— Ich bin ja von da. Mich lassen sie rein.\n\nЯ-то оттуда. Меня пустят.\n\nОн повторяет это дважды.', effects: [set21('bk', 'celle'), set21('celle_closed', true), malte(1), { move: farm }, until21(20, 21, 5)] },
      { id: 'c21_bk_convoy', label: 'Спросить, что они везли', minutes: 45, terminal: true, goto: 'c21_h_gate',
        text: '— Alles, was noch da war, — говорит Мальте. Всё, что ещё оставалось.\n\nСанитарка на секунду сжимает его колено, и он замолкает. Потом говорит другим голосом:\n\n— Hilfsgüter. Steht auf dem Frachtbrief.\n\nГуманитарный груз. Так в накладной.', effects: [set21('bk', 'convoy'), set21('malte_slip', true), malte(1), { move: farm }, until21(20, 21, 5)] },
      { id: 'c21_bk_her', label: 'Спросить её, почему нельзя в пункт', minutes: 45, terminal: true, goto: 'c21_h_gate',
        text: 'Она долго молчит. За окном проплывает тёмный двор с распахнутыми воротами.\n\n— Weil dort jemand eine Liste hat, — говорит она наконец. Потому что там у кого-то есть список. — Und ich stehe drauf.\n\nИ я в нём.', effects: [set21('bk', 'her'), set21('lea_known', true), lea(1), { move: farm }, until21(20, 21, 5)] },
      { id: 'c21_bk_quiet', label: 'Молчать и поить Мальте, когда он открывает глаза', minutes: 45, terminal: true, goto: 'c21_h_gate',
        text: 'Ты даёшь ему воды каждый раз, когда он открывает глаза. К дому бутылка пуста. Последний глоток он оставляет санитарке, и она его берёт.', effects: [set21('bk', 'quiet'), malte(2), lea(1), { move: farm }, until21(20, 21, 5)] },
    ] }),
];
