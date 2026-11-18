import type { Outcome, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { S23, guestsArrive, guestsCome, leaHere23, leaLue23, set23, snow23, until23, w23 } from './point23';

// Участок 23, линия A: снег, Тобиас за письмами (A говорит то, что решила B), Уте и новая могила, Маркус с Лео, двор к понедельнику.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S23({ ...scene, for: 'any', chapter: 'ch3' });
const tob = (x: string): Cond => v('w.c22_tobias', x);
const letter = (x: string): Cond => v('w.c22_letter', x);
const locked: Cond = { npc: 'c12_marcus', alive: true, remembers: 'c12_they_locked_me' };
const promisedA: Cond = { npc: 'c12_marcus', alive: true, remembers: 'c12_A_promised' };
const canHere: Cond = { has: 'can_petrol_10' };
const gunHere: Cond = any({ has: 'c19_flinte' }, { stocked: 'c19_flinte', qty: 1, at: 'c3_farm_stock' });
const heldA: Cond = flag('w.c18_a_held');
const ninaCap: Cond = v('w.c22_cap_walk', 'sunday');
/** Что сказать Тобиасу, решила B вчера. A выбирает только слова. */
/** Исходы разговора с Тобиасом ведут дальше к Нине (если обещана прогулка) или к Уте. */
const viaCap = (list: Outcome[]): Outcome[] => list.flatMap(o => [
  { ...o, id: `${o.id}_cap`, when: all(o.when ?? { always: true }, ninaCap), goto: 'c23_a_cap' }, { ...o, goto: 'c23_a_ute' }]);
const afterTobias = [{ id: 'cap', when: ninaCap, goto: 'c23_a_cap' }, { id: 'ute', goto: 'c23_a_ute' }];
const tobiasFx: Effect[] = [
  { if: tob('truth'), then: [w23('tobias_told', 'truth'), { if: leaLue23, then: [w23('lea_exposed', true)] }, npc('c15_tobias', 1)] },
  { if: tob('release'), then: [w23('tobias_told', 'release'), w23('ole_message', true)] },
  { if: tob('silent'), then: [w23('tobias_told', 'silent')] },
];

export const day23AScenes: Scene[] = [
  A({ id: 'c23_a_snow', title: 'Первый снег', camp: yard14, ambient: snow23,
    text: [
      { text: 'Утром двор белый. Не иней: снег, тонкий, сухой, крупой. Он лежит на крыше сарая, на поленнице, на холмике под грушей.' },
      { text: 'На снегу видно всё. Кошачьи следы к курятнику. Нинины — от крыльца к колодцу и обратно. И цепочка вдоль задней изгороди: босые, длинные, с вывернутыми пальцами. Свежие.' },
      { when: flag('w.c22_bell'), text: 'Колокольчик на калитке ночью не звенел. Тот, кто ходил, калитку не трогал.' },
    ],
    actions: [
      { id: 'c23_as_follow', label: 'Пройти по следам, пока их не замело', minutes: 20, activity: 'moderate', terminal: true, goto: 'c23_a_birch', ambientDuring: snow23,
        text: 'Ты берёшь топор у поленницы и идёшь по следам.', effects: [set23('as', 'follow'), until23(7, 0)] },
      { id: 'c23_as_sweep', label: 'Расчистить дорожки и не ходить туда', minutes: 30, activity: 'moderate', terminal: true, goto: 'c23_a_tobias', ambientDuring: snow23,
        text: 'Лопата, метла, двор. От крыльца к колодцу, к курятнику, к воротам. Цепочку у изгороди ты обходишь стороной. К завтраку её почти заносит.', effects: [set23('as', 'sweep'), until23(8, 0)] },
      { id: 'c23_as_hens', label: 'Проверить курятник', minutes: 20, terminal: true, goto: 'c23_a_tobias', ambientDuring: snow23,
        text: 'Куры сидят на насесте, нахохлившись, все. Вода в поилке замёрзла. Ты разбиваешь лёд, наливаешь тёплой из чайника. Кошачьи следы обрываются у сетки: кошка постояла и ушла ни с чем.', effects: [set23('as', 'hens'), until23(8, 0)] },
    ] }),

  A({ id: 'c23_a_tobias', title: 'Письма', camp: yard14, ambient: snow23,
    text: [
      { text: 'В восемь у ворот «Вольф». Тобиас один. Он собирает письма в Люнебург по дворам: завтра фургон.' },
      { text: 'Письмо {B.gen} лежало утром на столе, заклеенное, с надписью «Lüneburg, Kaserne, Lüdemann». Ты отдаёшь его в окно машины.' },
      { when: letter('truth'), text: 'Что в нём, ты знаешь: ты сам{m:|а} это решил{m:|а}. Правда. Плазма не вылечила никого. Уезжай.' },
      { when: letter('hold'), text: 'Что в нём, ты знаешь: ты сам{m:|а} это решил{m:|а}. «Держись, замену ищут».' },
      { when: letter('home'), text: 'Что в нём, ты знаешь: ты сам{m:|а} это решил{m:|а}. Про дом. Про Нину, про кур. Ни слова про плазму.' },
      { text: 'Тобиас не уезжает. Он ждёт. Вчера вечером вы решили, что ты ему скажешь. Решала {B}.' },
      { when: tob('truth'), text: 'Сказать надо правду: Лея не болела. Её кровь никого не лечит.' },
      { when: tob('silent'), text: 'Сказать надо то же, что вчера. Ни слова сверх.' },
      { when: tob('release'), text: 'Сказать надо для Оле: замены не будет. Пусть решает сам.' },
      { when: v('$.c23_ab', 'tobias'), text: 'Но сначала ты ведёшь его к задней изгороди и показываешь на берёзу. Тобиас уходит в лесополосу с автоматом. Один выстрел, глухой, в снег. Он возвращается, вытирает сапоги о сугроб у ворот и только потом протягивает руку за письмом.' },
      { when: v('$.c23_ay', 'band'), text: 'Вместе с письмом ты отдаёшь браслет: «Sander, Wiebke». Тобиас кладёт его в нагрудный карман и застёгивает пуговицу.' },
    ],
    actions: [
      { id: 'c23_at_plain', label: 'Сказать прямо, как решили', minutes: 20, terminal: true,
        outcomes: viaCap([
          { id: 'truth_lue', when: all(tob('truth'), leaLue23), text: 'Тобиас слушает, не глядя на тебя. Потом снимает перчатку и долго трёт лицо.\n\n— Ihr Blut ist seit gestern in zwei Kindern.\n\nЕё кровь со вчерашнего дня в двух детях.\n\nОн заводит мотор, не попрощавшись. «Вольф» уходит на восток, к Люнебургу, быстро, по снегу, юзом на повороте. К Алерс.', effects: [set23('at', 'plain')] },
          { id: 'truth', when: tob('truth'), text: 'Тобиас слушает, не глядя на тебя. Потом снимает перчатку и долго трёт лицо.\n\n— Dann suche ich sie nicht mehr. — Он надевает перчатку. — Aber Brandt sucht. Und Brandt glaubt nicht, was man ihm sagt. Brandt glaubt, was er braucht.\n\nТогда я её больше не ищу. Но Брандт ищет. А Брандт не верит тому, что говорят. Брандт верит в то, что ему нужно.', effects: [set23('at', 'plain')] },
          { id: 'silent', when: tob('silent'), text: 'Ты говоришь то же, что вчера. Тобиас смотрит на окна дома, по одному.\n\n— Gut. Dann weißt du auch: Montag kann ich euch nicht helfen. Montag ist Brandts Tag.\n\nХорошо. Тогда ты знаешь и это: в понедельник я вам помочь не смогу. Понедельник — день Брандта.', effects: [set23('at', 'plain')] },
          { id: 'release', text: 'Тобиас достаёт планшет и пишет. Просит повторить. Пишет дословно, шевеля губами.\n\n— «Es kommt kein Ersatz. Entscheide selbst». Gut. Das sage ich ihm so. Genau so.\n\n«Замены не будет. Решай сам». Хорошо. Так ему и скажу. Слово в слово.', effects: [set23('at', 'plain')] },
        ]), effects: [...tobiasFx, until23(8, 30)] },
      { id: 'c23_at_why', label: 'Сказать, как решили, и объяснить почему', minutes: 30, terminal: true,
        outcomes: viaCap([
          { id: 'truth', when: tob('truth'), text: 'Ты рассказываешь про лептоспироз, про двух доноров с крестами, про мать и брата в Ганновере. Тобиас слушает до конца.\n\n— Und das hätte sie keinem in Uniform sagen sollen. Jetzt hab ich es gehört. — Он долго молчит. — Ich schreibe nichts auf. Aber ich kann es auch nicht mehr nicht wissen.\n\nИ этого она не должна была говорить никому в форме. Теперь я это слышал. Я ничего не запишу. Но и не знать больше не могу.', effects: [set23('at', 'why'), w23('tobias_no_report', true)] },
          { id: 'silent', when: tob('silent'), text: 'Ты говоришь то же, что вчера, и добавляешь: так решили вдвоём. Тобиас кивает.\n\n— Zu zweit. Das ist mehr, als die meisten haben.\n\nВдвоём. Это больше, чем у большинства.', effects: [set23('at', 'why')] },
          { id: 'release', text: 'Ты объясняешь: Оле сам себе хозяин, и решать за него не будет никто. Ни вы, ни Алерс, ни мать. Тобиас записывает и это.\n\n— Das wird ihm gefallen. Er hasst es, wenn man für ihn entscheidet.\n\nЕму это понравится. Он ненавидит, когда за него решают.', effects: [set23('at', 'why'), npc('ole', 1)] },
        ]), effects: [...tobiasFx, until23(8, 40)] },
      { id: 'c23_at_short', label: 'Сказать одной фразой и отойти от машины', minutes: 10, terminal: true, outcomes: afterTobias,
        text: 'Ты говоришь одну фразу. Тобиас смотрит тебе в лицо, будто проверяет, всё ли. Ты отходишь к воротам. Он уезжает, не сказав ни слова. В зеркале видно, как он что-то пишет на руле.', effects: [set23('at', 'short'), ...tobiasFx, until23(8, 20)] },
    ] }),

  A({ id: 'c23_a_cap', title: 'Двенадцатый участок', location: 'c15_garden', camp: { at: 'c15_garden', stock: 'c3_farm_stock', rest: false }, safe: false, ambient: snow23,
    text: [
      { text: 'Нина ждёт у ворот в куртке, застёгнутой до горла. В руках отцовская кепка с эмблемой службы доставки. Ты обещал{m:|а}: в воскресенье, засветло.' },
      { text: 'До колонии двадцать минут по шпалам. Двери домиков открыты, снег лежит на порогах. Над колонией так тихо, что слышно, как с веток падает снег.' },
      { text: 'Калитка двенадцатого участка висит на одной петле. Нина останавливается перед ней и долго смотрит на кольцо в столбе сарая. Пустое.' },
    ],
    actions: [
      { id: 'c23_ap_hang', label: 'Стоять рядом, пока она вешает кепку на калитку', minutes: 40, terminal: true, goto: 'c23_a_ute', ambientDuring: snow23,
        text: 'Нина вешает кепку на столбик калитки, козырьком к дороге. Поправляет. Ещё раз поправляет.\n\n— Чтобы он видел, куда идти, — говорит она. И сама слышит, что сказала.\n\nОбратно она идёт первой и ни разу не оглядывается.', effects: [set23('ap', 'hang'), w23('cap_hung', true), npc('c7_nina', 3, 'c23_went_with_me'), until23(9, 30)] },
      { id: 'c23_ap_talk', label: 'Спросить, каким он был до всего этого', minutes: 50, terminal: true, goto: 'c23_a_ute', ambientDuring: snow23,
        text: 'Нина рассказывает, сидя на перевёрнутом ведре. Папа развозил посылки и знал всех собак в Бухгольце по именам. Папа пел в машине громко и фальшиво. Папа научил её водить на пустой парковке у «Лидла», когда ей было тринадцать.\n\nКепку она уносит обратно, домой.\n\n— Пусть висит в сенях. Там тепло.', effects: [set23('ap', 'talk'), w23('cap_home', true), npc('c7_nina', 3), until23(9, 40)] },
      { id: 'c23_ap_back', label: 'Не пускать её за калитку: там следы', minutes: 30, terminal: true, goto: 'c23_a_ute', ambientDuring: snow23,
        text: 'На снегу за калиткой свежие следы, босые. Ты берёшь Нину за плечо. Она не спорит. Кепку она вешает на калитку снаружи, не заходя, и вы уходите быстрым шагом.', effects: [set23('ap', 'back'), w23('cap_hung', true), npc('c7_nina', 1), until23(9, 20)] },
    ] }),
  A({ id: 'c23_a_ute', title: 'По-человечески', camp: yard14, ambient: snow23,
    text: [
      { text: 'Утром у калитки Уте и Яннес. У Яннеса на плече две лопаты.' },
      { text: '— Kai liegt in der Grube mit Kalk. Wie ein Tier. — Уте говорит ровно, как говорят о погоде. — Ich will ihn am Bahndamm begraben. Wo er Drachen steigen ließ. Bevor der Boden friert.\n\nКай лежит в яме с известью. Как скотина. Я хочу похоронить его у насыпи. Там, где он запускал змея. Пока земля не замёрзла.' },
      { when: v('w.c17_colony', 'stand'), text: 'Ты помнишь утро у калитки колонии, когда вы стояли рядом с ней против солдат. Не помогло. Но Уте пришла именно к вам, и ты понимаешь почему.' },
      { when: flag('w.c22_grave_promised'), text: 'Вчера ты {m:обещал|обещала} Яннесу прийти в понедельник с лопатами. Уте не хочет ждать понедельника. В понедельник Брандт.' },
      { text: '— Heute nur das Grab, — говорит Яннес. Сегодня только могила. — Morgen früh holen wir ihn. Mutter sagt, so ist es richtig.\n\nЗавтра рано утром перенесём. Мать говорит, так правильно.' },
      { text: 'Уте в двух платках, на валенках налип снег. Она пришла через поле, напрямик, не по дороге.' },
    ],
    actions: [
      { id: 'c23_au_dig', label: 'Взять лопату и пойти копать', minutes: 15, terminal: true, goto: 'c23_a_dig', ambientDuring: snow23,
        text: 'Ты берёшь лопату у Яннеса. Уте идёт впереди, не оглядываясь, по снегу, не выбирая дороги.', effects: [set23('au', 'dig'), npc('c14_ute', 2), npc('c14_jannes', 1), until23(8, 50)] },
      { id: 'c23_au_later', label: 'Сказать: после обеда. Утром нельзя оставить двор', minutes: 10, terminal: true, goto: 'c23_a_marcus0',
        text: 'Уте кивает, будто так и знала.\n\n— Dann gräbt Jannes allein vor. Du machst es tief.\n\nТогда Яннес начнёт один. А ты сделаешь глубже.\n\nОни уходят вдвоём. Две лопаты на одном плече.\n\nДо полудня ты колешь дрова, чинишь сетку курятника и носишь воду. Руки заняты. Голова — нет.', effects: [set23('au', 'later'), npc('c14_ute', 1), { body: 'fatigue', delta: 4 }, until23(12, 20)] },
      { id: 'c23_au_no', label: 'Сказать: перед понедельником нельзя лезть в яму, Брандт узнает', minutes: 10, terminal: true, goto: 'c23_a_marcus0',
        text: 'Уте смотрит на тебя долго.\n\n— Brandt weiß schon alles. Das ist ja das Problem.\n\nБрандт уже всё знает. В этом и беда.\n\nОна уходит. Яннес задерживается у калитки, хочет что-то сказать и не говорит.\n\nДо полудня ты колешь дрова. Каждое полено — как ответ, которого ты не дал{m:|а}.', effects: [set23('au', 'no'), npc('c14_ute', -2, 'c23_they_refused_kai'), npc('c14_jannes', -1), { body: 'fatigue', delta: 4 }, until23(12, 20)] },
    ] }),

  A({ id: 'c23_a_dig', title: 'У насыпи', location: 'c15_garden', camp: { at: 'c15_garden', stock: 'c3_farm_stock', rest: false }, safe: false, ambient: snow23,
    text: [
      { text: 'Место Уте выбирает сама: у насыпи, под старой ольхой, откуда видно рельсы в обе стороны. Снег здесь неглубокий. Земля под ним промёрзла на палец, дальше мягкая, песчаная.' },
      { text: 'Вы копаете по очереди. Яннес молчит. Уте стоит рядом и держит в руках шапку Кая, вязаную, с помпоном.' },
    ],
    actions: [
      { id: 'c23_ad_deep', label: 'Копать как следует, в рост человека', minutes: 150, activity: 'heavy', terminal: true, goto: 'c23_a_marcus0', ambientDuring: snow23,
        text: 'К полудню яма по грудь тебе. Стенки ровные, как по линейке: Яннес выравнивает их черенком. Уте подходит к краю, смотрит вниз и кивает.\n\n— So. Da friert er nicht.\n\nВот. Тут он не замёрзнет.\n\nОна кладёт шапку на отвал земли, помпоном вверх.', effects: [set23('ad', 'deep'), w23('grave_dug', 'deep'), { body: 'fatigue', delta: 12 }, npc('c14_ute', 3, 'c23_dug_for_kai'), npc('c14_jannes', 2), until23(12, 20)] },
      { id: 'c23_ad_talk', label: 'Копать и спросить Яннеса, каким был Кай', minutes: 150, activity: 'heavy', terminal: true, goto: 'c23_a_marcus0', ambientDuring: snow23,
        text: 'Яннес рассказывает не сразу. Кай чинил всем велосипеды. Кай украл у пастора колокольчик. Кай боялся темноты до двенадцати лет. Кай один раз дал Брандту в морду, на празднике пожарных, и Брандт его потом за это уважал.\n\n— Und dann hat Brandt die Soldaten geholt.\n\nА потом Брандт привёл солдат.\n\nК полудню яма готова.', effects: [set23('ad', 'talk'), w23('grave_dug', 'deep'), w23('kai_known', true), { body: 'fatigue', delta: 12 }, npc('c14_jannes', 3), npc('c14_ute', 2), until23(12, 20)] },
      { id: 'c23_ad_quick', label: 'Выкопать неглубоко и вернуться до полудня', minutes: 90, activity: 'heavy', terminal: true, goto: 'c23_a_marcus0', ambientDuring: snow23,
        text: 'Ты копаешь быстро, на полметра. Уте смотрит, но не возражает. В одиннадцать ты отдаёшь лопату Яннесу.\n\n— Den Rest mache ich, — говорит он. Остальное я сам.', effects: [set23('ad', 'quick'), w23('grave_dug', 'shallow'), { body: 'fatigue', delta: 7 }, npc('c14_ute', 1), until23(11, 0)] },
    ] }),

  A({ id: 'c23_a_marcus0', title: 'Полдень', camp: yard14, ambient: snow23, onEnter: [guestsArrive],
    text: [
      { when: guestsCome, text: 'В половине первого у ворот двое. Мужчина в куртке, которая была ему впору неделю назад. Мальчик лет семи в шапке, натянутой до бровей. Мальчик кашляет: сухо, долго, сгибаясь.' },
      { when: guestsCome, text: 'Маркус. И Лео.' },
      { when: all(guestsCome, locked), text: 'Маркус смотрит на тебя спокойно. Последний раз, когда он был в этом доме, вы заперли его в кладовке. Он это помнит. Это видно по тому, как он держит руки: на виду.' },
      { when: all(guestsCome, promisedA), text: 'Ты {m:обещал|обещала} ему тогда, что Лео не отдадут никому, пока он не вернётся. Он, кажется, вернулся проверить.' },
      { when: guestsCome, text: '— Celle hat zu. Seit Donnerstag. Keiner kommt rein, auch nicht mit Ausweis. — Маркус говорит коротко, как отчитывается. — Und Hannover ist offen. Keiner mehr an den Toren. Weil keiner mehr da ist, der sie bewacht.\n\nЦелле закрыт. С четверга. Никого не пускают, даже с документами. А Ганновер открыт. На воротах никого. Потому что охранять больше некому.' },
      { when: guestsCome, text: '— Bis Dienstag. Dann gehen wir nach Winsen, zu meinem Bruder. Wenn ihr uns lasst.\n\nДо вторника. Потом пойдём в Винзен, к моему брату. Если пустите.' },
      { when: not(guestsCome), text: 'В половине первого у ворот никого. На столбе ворот, под камнем, — записка, мокрая от снега. Почерк детский, печатными буквами: «WIR SIND IN WINSEN. LEO». Мы в Винзене.' },
    ],
    actions: [
      { id: 'c23_am_in', label: 'Открыть ворота: заходите, пока на кухню', when: guestsCome, minutes: 15, terminal: true, goto: 'c23_a_lunch',
        text: 'Лео проходит мимо тебя бегом, к дому, и исчезает в сенях: ищет {B.acc}. Маркус идёт медленно, будто ждёт, что ворота закроются у него за спиной.\n\n— Danke, — говорит он у крыльца. — Das Schloss an der Kammer. Ist das noch da?\n\nСпасибо. Замок на кладовке. Он ещё там?', effects: [set23('am', 'in'), npc('c12_marcus', 1), until23(12, 45)] },
      { id: 'c23_am_hand', label: 'Спросить про руку', when: guestsCome, minutes: 20, terminal: true, goto: 'c23_a_lunch',
        text: 'Маркус разматывает бинт прямо у ворот, при тебе. На ладони — розовые шрамы, полукругом, детские. Зажили.\n\n— Neun Tage. Kein Fieber. Ich hab jeden Morgen gemessen.\n\nДевять дней. Жара не было. Я мерил каждое утро.\n\nОн заматывает обратно.\n\n— Jetzt du. Hat einer bei euch Fieber?\n\nТеперь ты. У вас кто-нибудь с жаром?', effects: [set23('am', 'hand'), w23('marcus_clean', true), until23(12, 50)] },
      { id: 'c23_am_cough', label: 'Спросить, давно ли мальчик кашляет', when: guestsCome, minutes: 15, terminal: true, goto: 'c23_a_lunch',
        text: '— Seit Freitag. Wir haben in einer Scheune bei Garstedt geschlafen. Es war nass.\n\nС пятницы. Мы ночевали в сарае у Гарштедта. Было сыро.\n\nМаркус кладёт ладонь Лео на лоб, как делают отцы.\n\n— Warm. Nicht heiß.\n\nТёплый. Не горячий.', effects: [set23('am', 'cough'), w23('leo_cough', true), until23(12, 45)] },
      { id: 'c23_am_note', label: 'Забрать записку и убрать в карман', when: not(guestsCome), minutes: 5, terminal: true, goto: 'c23_a_lunch',
        text: 'Ты кладёшь записку во внутренний карман. Значит, живы. Значит, дошли.', effects: [set23('am', 'note'), until23(12, 35)] },
    ] }),

  A({ id: 'c23_a_lunch', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед: суп, хлеб. За столом тесно.' },
      { when: guestsCome, text: 'Лео сидит на коленях у {B.gen} и ест из её ложки. Маркус ест у окна, стоя, и смотрит на дорогу.' },
      { when: all(guestsCome, leaHere23), text: 'Лея смотрит, как Лео кашляет, и встаёт из-за стола. Через минуту она возвращается с кружкой тёплого молока с мёдом.' },
    ],
    actions: [
      { id: 'c23_al_eat', label: 'Поесть горячего', minutes: 25, terminal: true, goto: 'c23_a_jannes', ...tableOnly,
        text: 'Суп горячий. Ты ешь и чувствуешь, как отходят пальцы, задеревеневшие на снегу.', effects: [set23('al', 'eat'), meal('eat'), until23(13, 40)] },
      { id: 'c23_al_nap', label: 'Поесть и лечь на час', minutes: 30, terminal: true, goto: 'c23_a_jannes', ...tableOnly,
        text: 'Ты засыпаешь в одежде, поверх одеяла. Будит тебя Нина: её рука на плече и шёпот, что пришёл Яннес.', effects: [set23('al', 'nap'), meal('eat'), until23(13, 30), until23(14, 30, true)] },
      { id: 'c23_al_tea', label: 'Только чай', minutes: 10, terminal: true, goto: 'c23_a_jannes',
        text: 'Ты пьёшь чай у окна. Снег на дороге уже разъезжен: кто-то проехал на тракторе.', effects: [set23('al', 'tea'), until23(13, 20)] },
    ] }),

  A({ id: 'c23_a_fuel', title: 'Бензин', camp: yard14, ambient: snow23,
    text: [
      { text: 'После обеда ты обходишь двор глазами Брандта. «Angabe aller Treibstoffvorräte». Все запасы топлива.' },
      { text: 'В баке Corsa — сколько есть. Солярка в бочке у сарая, для трактора.' },
      { when: canHere, text: 'Канистра Керема, пять литров, стоит в сенях за дверью.' },
      { when: guestsCome, text: 'Маркус стоит рядом и смотрит, куда ты смотришь.\n\n— Bei uns in Buchholz haben sie den Leuten die Tanks leer gesaugt. Mit Schlauch. Vor den Augen.\n\nУ нас в Бухгольце людям выкачали баки. Шлангом. На глазах.' },
      { when: v('$.c23_al', 'tea'), text: 'Чай согрел, но есть хочется.' },
    ],
    actions: [
      { id: 'c23_af_cellar', label: 'Спрятать канистру в подвале, за ящиками с картошкой', when: canHere, minutes: 20, terminal: true, goto: 'c23_a_gun',
        text: 'Канистра встаёт за ящики, в самый угол. Сверху ты кладёшь мешковину. Если не знать — не найдёшь. Если искать с собакой — найдёшь: бензин пахнет.', effects: [set23('af', 'cellar'), w23('fuel_spot', 'cellar'), until23(14, 20)] },
      { id: 'c23_af_field', label: 'Закопать канистру в снег у лесополосы', when: canHere, minutes: 40, activity: 'moderate', terminal: true, goto: 'c23_a_gun', ambientDuring: snow23,
        text: 'Ты относишь канистру к лесополосе, за триста шагов, и закапываешь в снег под кустом бузины. Следы к ней ты заметаешь веткой, насколько получается. Ночью, может быть, подсыплет.', effects: [set23('af', 'field'), w23('fuel_spot', 'field'), { take: 'can_petrol_10' }, { place: 'can_petrol_10', at: 'c7_farm_lane', qty: 1 }, until23(14, 40)] },
      { id: 'c23_af_tank', label: 'Слить канистру в бак Corsa: в баке не прячут', when: all(canHere, { itemAt: 'opel_corsa', place: 'hof_luedemann' }), minutes: 15, terminal: true, goto: 'c23_a_gun',
        text: 'Бензин уходит в бак с бульканьем. Пустую канистру ты бросаешь в сарай, к старым вёдрам. Теперь всё топливо в одном месте. Если машину заберут — с ним вместе.', effects: [set23('af', 'tank'), w23('fuel_spot', 'tank'), { refuel: 'opel_corsa', liters: 5, fromCan: 'can_petrol_10' }, until23(14, 15)] },
      { id: 'c23_af_list', label: 'Записать всё как есть, на листке, для Брандта', minutes: 15, terminal: true, goto: 'c23_a_gun',
        text: 'Ты пишешь на обороте бумаги Брандта: «Corsa — бак, канистра 5 л, солярка — бочка, ~40 л». Почерк ровный. Ты сам{m:|а} не знаешь, отдашь ли этот листок.', effects: [set23('af', 'list'), w23('fuel_list', true), until23(14, 15)] },
    ] }),

  A({ id: 'c23_a_gun', title: 'Ружьё', camp: kitchen14,
    text: [
      { text: '«Abgabe aller Schusswaffen». Сдать всё огнестрельное оружие.' },
      { when: gunHere, text: 'Двустволка Людеманов. Левый ствол заедает. Четыре патрона в банке с пуговицами.' },
      { when: not(gunHere), text: 'Ружья в доме нет. Есть топор, вилы и кочерга. Их Брандт не пишет.' },
      { when: all(gunHere, flag('w.c19_gun_declared')), text: 'Ружьё уже записано: ты сам{m:|а} сказал{m:|а} про него патрулю в четверг.' },
      { when: all(gunHere, flag('w.c19_gun_lie')), text: 'В четверг патрулю сказали, что ружья нет. Если его найдут, это будет не ружьё. Это будет ложь.' },
    ],
    actions: [
      { id: 'c23_ag_floor', label: 'Спрятать под половицу в швейной комнате', when: gunHere, minutes: 30, terminal: true, goto: 'c23_a_corsa',
        text: 'Половица у окна отходит, если поддеть ножом. Под ней пустота до балки, сухая, с мышиным помётом. Ружьё ложится туда, завёрнутое в промасленную тряпку. Патроны — отдельно, в жестяной коробке из-под чая.', effects: [set23('ag', 'floor'), w23('gun_spot', 'floor'), until23(15, 15)] },
      { id: 'c23_ag_hand', label: 'Оставить на виду: сдать завтра самим', when: gunHere, minutes: 10, terminal: true, goto: 'c23_a_corsa',
        text: 'Ты вешаешь ружьё на гвоздь у двери, разряженное. Патроны кладёшь рядом, в коробку. Завтра отдашь в руки и попросишь расписку. Если дадут.', effects: [set23('ag', 'hand'), w23('gun_spot', 'hand'), until23(14, 55)] },
      { id: 'c23_ag_marcus', label: 'Спросить Маркуса, что сделали с ружьями в Бухгольце', when: all(gunHere, guestsCome), minutes: 20, terminal: true, goto: 'c23_a_corsa',
        text: '— Eingesammelt. Registriert. Und dann haben Brandts Leute damit Wache gestanden. — Маркус пожимает плечами. — Wer eins versteckt hatte und erwischt wurde, kam von der Liste. Keine Ration mehr.\n\nСобрали. Записали. А потом люди Брандта стояли с ними на посту. Кто спрятал и попался — того вычеркнули из списка. Пайка больше нет.', effects: [set23('ag', 'marcus'), w23('gun_risk_known', true), until23(15, 0)] },
      { id: 'c23_ag_none', label: 'Обойти дом: что ещё может приглянуться Брандту', when: not(gunHere), minutes: 30, terminal: true, goto: 'c23_a_corsa',
        text: 'Генератора нет. Бензопилы нет. Есть трактор, который Брандт и так знает. Есть окорок в кладовке. Есть люди. Людей не спрячешь под половицу.', effects: [set23('ag', 'none'), until23(15, 10)] },
      { id: 'c23_ag_ham', label: 'Унести окорок на чердак, под сено', when: not(gunHere), minutes: 25, terminal: true, goto: 'c23_a_corsa',
        text: 'Окорок завёрнут в мешковину и пахнет дымом на весь чердак. Ты закапываешь его в сено у трубы, поглубже. Собака найдёт. Человек, который спешит, — нет.', effects: [set23('ag', 'ham'), w23('ham_hidden', true), until23(15, 10)] },
      { id: 'c23_ag_open', label: 'Ничего не прятать: спрятанное найдут, и будет хуже', when: not(gunHere), minutes: 10, terminal: true, goto: 'c23_a_corsa',
        text: 'Ты оставляешь всё как есть. Окорок на крюке в кладовке, топор у поленницы. Если Брандт захочет взять, возьмёт. Но лгать ему в глаза не придётся.', effects: [set23('ag', 'open'), until23(14, 55)] },
    ] }),

  A({ id: 'c23_a_corsa', title: 'Ключи', camp: yard14, ambient: snow23,
    text: [
      { text: 'Corsa стоит под навесом, на крыше снег. Ты сметаешь его рукавом.' },
      { when: heldA, text: 'В среду тебя держали на скамье у пожарной части. В бумаге у Брандта ты записан. «Verwarnt». Предупреждён.' },
      { text: 'Без машины до Йестебурга час пешком. До Люнебурга — день.' },
    ],
    actions: [
      { id: 'c23_ac_keys', label: 'Снять с машины аккумулятор и спрятать', minutes: 30, activity: 'moderate', terminal: true, outcomes: [{ id: 'fence', when: not(any(v('$.c23_ab', 'axe'), v('$.c23_ab', 'slip'), v('$.c23_ab', 'tobias'))), goto: 'c23_a_fence' }, { id: 'malte', goto: 'c23_a_malte' }],
        text: 'Клеммы прикипели. Ты отбиваешь их молотком через тряпку и вынимаешь аккумулятор, тяжёлый, как ведро с водой. Он уезжает в подвал, под старое пальто. Без него машина не заведётся. Ни у кого.', effects: [set23('ac', 'battery'), w23('battery_out', true), until23(15, 50)] },
      { id: 'c23_ac_spare', label: 'Сделать так, чтобы запасной ключ остался у {B.gen}', minutes: 15, terminal: true, outcomes: [{ id: 'fence', when: not(any(v('$.c23_ab', 'axe'), v('$.c23_ab', 'slip'), v('$.c23_ab', 'tobias'))), goto: 'c23_a_fence' }, { id: 'malte', goto: 'c23_a_malte' }],
        text: 'Запасного ключа нет. Есть один, на кольце с брелоком аптеки. Ты снимаешь его с кольца и кладёшь в жестяную коробку на полке, за банкой с мукой. {B} будет знать, где.', effects: [set23('ac', 'spare'), w23('key_tin', true), until23(15, 35)] },
      { id: 'c23_ac_leave', label: 'Оставить как есть', minutes: 5, terminal: true, outcomes: [{ id: 'fence', when: not(any(v('$.c23_ab', 'axe'), v('$.c23_ab', 'slip'), v('$.c23_ab', 'tobias'))), goto: 'c23_a_fence' }, { id: 'malte', goto: 'c23_a_malte' }],
        text: 'Ты закрываешь машину и кладёшь ключ в карман. Что будет — то будет.', effects: [set23('ac', 'leave'), until23(15, 25)] },
    ] }),

  A({ id: 'c23_a_malte', title: 'Последний вечер Мальте', camp: kitchen14,
    text: [
      { text: 'Мальте сидит у печи, костыль между колен. Завтра за ним придут: Крузе так и записал, «Lüdemann-Hof, Montag».' },
      { text: '— Weißt du, was ich Montag sage? — спрашивает он. Знаешь, что я скажу в понедельник? — Dass ich die Spenderin nie gesehen habe. Dass die Sanitäterin Meier hieß. Dass ich Fieber hatte und nichts weiß.\n\nЧто донора я никогда не видел. Что санитарку звали Майер. Что у меня был жар и я ничего не знаю.' },
      { when: v('w.c22_page', 'malte'), text: 'Лист с припиской Ройтера у него в нагрудном кармане. Он похлопывает по нему ладонью.' },
      { when: v('$.c23_ac', 'leave'), text: 'Машину ты так и {m:оставил|оставила}, как есть. Пусть стоит.' },
    ],
    actions: [
      { id: 'c23_ml_wife', label: 'Пообещать: если что, жена в Целле узнает, где он', minutes: 20, terminal: true, goto: 'c23_a_sms',
        text: '— Hohenweg zwölf. Celle. — Он повторяет адрес дважды и заставляет тебя повторить. — Sag ihr: ich bin nicht zu schnell gefahren.\n\nХоэнвег, двенадцать. Целле. Скажи ей: я не гнал.', effects: [set23('ml', 'wife'), w23('malte_wife', true), npc('c21_malte', 2), until23(16, 20)] },
      { id: 'c23_ml_page', label: 'Попросить отдать лист Ройтера тебе: в армии его отберут', when: v('w.c22_page', 'malte'), minutes: 20, terminal: true, goto: 'c23_a_sms',
        text: 'Мальте думает долго. Потом расстёгивает пуговицу кармана.\n\n— Recht hast du. Bei denen landet das im Ofen.\n\nТвоя правда. У них это окажется в печке.\n\nЛист теперь у тебя. Он тёплый.', effects: [set23('ml', 'page'), { give: 'c22_page' }, w23('page_a', true), npc('c21_malte', 1), until23(16, 20)] },
      { id: 'c23_ml_story', label: 'Помочь ему отрепетировать, что он скажет', minutes: 30, terminal: true, goto: 'c23_a_sms',
        text: 'Ты задаёшь вопросы, как задавал бы Крузе. Мальте отвечает. На третьем круге он перестаёт путаться в фамилии санитарки и в том, где был в пятницу вечером.\n\n— Du wärst ein guter Feldjäger, — говорит он. Из тебя вышел бы хороший военный полицейский. Это не комплимент.', effects: [set23('ml', 'story'), w23('malte_ready', true), until23(16, 30)] },
    ] }),

  A({ id: 'c23_a_sms', title: 'Окно сети', camp: yard14, ambient: snow23,
    text: [
      { text: 'В пятом часу телефон находит сеть. Одна полоска, у сарая, если держать руку повыше.' },
      { text: 'Сообщение от Дениза, отправленное вчера: «Transit läuft. Diesel haben wir nicht. Wenn ihr Diesel habt, fahre ich euren Fahrer nach Celle. Oder wohin auch immer».\n\n«Транзит» на ходу. Солярки нет. Если у вас есть солярка, отвезу вашего шофёра в Целле. Или куда угодно.' },
    ],
    actions: [
      { id: 'c23_az_yes', label: 'Ответить: солярка есть, приезжай во вторник', when: flag('w.c19_diesel'), minutes: 10, terminal: true, goto: 'c23_supper', enabled: { phoneUsable: true }, disabledReason: 'Телефон сел',
        text: 'Ответ уходит с четвёртой попытки. Через десять минут приходит: «Dienstag. Mittag». Вторник. Полдень.', effects: [set23('az', 'yes'), w23('deniz_tuesday', true), { charge: 'phone', delta: -1 }, until23(17, 20)] },
      { id: 'c23_az_celle', label: 'Ответить: Целле закрыт, не надо', minutes: 10, terminal: true, goto: 'c23_supper', enabled: { phoneUsable: true }, disabledReason: 'Телефон сел',
        text: 'Ты пишешь коротко. Дениз отвечает одним словом: «Scheiße». И потом: «Dann Winsen. Da ist ein Lazarett».\n\nТогда в Винзен. Там лазарет.', effects: [set23('az', 'celle'), w23('winsen_lazarett', true), { charge: 'phone', delta: -1 }, until23(17, 20)] },
      { id: 'c23_az_off', label: 'Не отвечать: батарея', minutes: 5, terminal: true, goto: 'c23_supper',
        text: 'Ты выключаешь телефон. Ответишь, когда будет что ответить.', effects: [set23('az', 'off'), until23(17, 10)] },
    ] }),
];
