import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { brothersCome } from './point33';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { tobias36 } from './point36';
import { parents42 } from './point42';
import { felix45, hamburg45, henrike45, julian45, merle45 } from './point45';

// Участок 46 «Сочельник»: чт 24.12, 17:00 → КТ46 пт 25.12, 20:00. Передышка после двух дней порознь. Вечер вместе: служба в шесть
// в Йестебурге (`w.c42_church` all/some/home), стол (гости — `w.c44_eve`, Нильс — `w.c45_guest`; курица — `w.c44_hen`, угорь из 45-й),
// подарки (`w.c42_a_gift`/`w.c42_b_gift`, варежки, носки, открытка, письмо Хенрике, глюкометр Мерле). С девяти до полуночи — порознь
// на часть: кто на посту у Зеве (`w.c44_post`, смена Яннеса `w.c44_a_eve_shift`), тот там; кто дома — дома. Рождество: утром Лукас
// приносит письмо Тобиаса с того берега (человек из прошлого; пропуск через мост — `w.c46_pass`), днём порознь: A — в Йестебург
// (Нильс, Брандт и Сильвестр у пожарной части, Яннес), B — к Барам в Люллау и к родителям Мерле / к Уте. Вечер вместе.
// КТ46: Сильвестр у пожарной части (`c3_new_silvester46`) и ответ Тобиасу (`c3_new_answer46`).
export const P46: Cond = all({ cp: 45 }, not({ cp: 46 }));
export const A46: Cond = { me: 'A' };
export const farm46 = 'hof_luedemann';
export const jest46 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played45: Cond = any(flag('A.c45_finished'), flag('B.c45_finished'));
const base46: Cond = all(P46, played45, { at: farm46 }, { partnerAt: farm46 }, up, { partner: 'active' });
export const point46Available: Cond = base46;

export const henrike46 = henrike45;
export const merle46 = merle45;
export const felix46 = felix45;
export const julian46 = julian45;
export const parents46 = parents42;
export const hamburg46 = hamburg45;
export const tobias46 = tobias36;
export const church46 = (x: string): Cond => v('w.c42_church', x);
export const eve46 = (x: string): Cond => v('w.c44_eve', x);
export const nils46: Cond = any(v('w.c45_guest', 'night'), v('w.c45_guest', 'dinner'));
export const nilsNight46: Cond = v('w.c45_guest', 'night');
export const feast46: Cond = not(v('w.c41_xmas', 'none'));
/** Кто стоит на посту с девяти до полуночи. */
const aPost: Cond = any(v('w.c44_post', 'a'), flag('w.c44_a_eve_shift'));
const bPost: Cond = v('w.c44_post', 'b');
export const atPost46: Cond = any(all(A46, aPost), all(not(A46), bPost));
export const partnerPost46: Cond = any(all(A46, bPost), all(not(A46), aPost));
/** Пост Яннеса у колонии — если {A} обещал ему смену, а ваш пост стоит {B} или другой. */
export const jannesPost46: Cond = all(A46, flag('w.c44_a_eve_shift'), not(v('w.c44_post', 'a')));
export const own46 = (key: string, value: string): Cond => v(`$.c46_${key}`, value);

export const eve46amb = { tempC: -5, outdoor: true, wet: false };
export const xmas46 = { tempC: -3, outdoor: true, wet: false };
export const church46amb = { tempC: 4, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm46, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S46 = wrap(P46);
export const set46 = (key: string, value: string | boolean): Effect => ({ set: `$.c46_${key}`, value });
export const w46 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c46_${key}`, value });
export const until46 = (d: 54 | 55, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare46: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c46_finished', value: true };
const toJest: Effect = { move: jest46 };
const toFarm: Effect = { move: farm46 };
const fromGifts = [{ id: 'p', when: atPost46, goto: 'c46_post' }, { id: 'h', goto: 'c46_home_night' }];
const fromLetter = [{ id: 'a', when: A46, goto: 'c46_a_road' }, { id: 'b', goto: 'c46_b_road' }];
const someChurch: Cond = church46('some');
const allChurch: Cond = church46('all');
const goChurch: Cond = any(allChurch, someChurch);
const stayHome: Cond = any(someChurch, church46('home'));
/** Кто что дарит: подарки, сделанные в 42–44-й. */
const aGift = (x: string): Cond => v('w.c42_a_gift', x);
const bGift = (x: string): Cond => v('w.c42_b_gift', x);
const aMade: Cond = any(flag('w.c42_a_gift'), flag('w.c44_a_gift_done'));
const bMade: Cond = any(flag('w.c42_b_gift'), flag('w.c44_b_gift_done'));

export const shared46: Scene[] = [
  S46({ id: 'c46_eve', for: 'any', chapter: 'ch3', title: 'Сочельник', camp: kitchen14,
    text: [
      { text: 'Пять часов. В кухне жарко и тесно, на плите три кастрюли, окна запотели изнутри. Пахнет луком, хвоей и мокрой шерстью.' },
      { when: flag('w.c45_dog'), text: 'Луна лежит под столом и следит за каждым куском, который несут мимо. Дети уже научили её давать лапу. Хенрике делает вид, что не видит, как ей бросают корки.' },
      { when: all(henrike46, goChurch), text: 'Хенрике снимает фартук и надевает пальто, которое не надевала с осени: служба в шесть, до Йестебурга час пешком. «Wer mitkommt, kommt jetzt». Кто идёт — идёт сейчас.' },
      { when: all(not(henrike46), goChurch), text: 'Служба в шесть, до Йестебурга час пешком. Кто идёт — собирается сейчас.' },
      { when: church46('home'), text: 'В церковь не идёт никто: решили ещё в пятницу. Сочельник — дома.' },
      { when: v('w.c44_hen', 'killed'), text: 'Курица в духовке. Сверху на ней лежат две полоски сала, чтобы не высохла.' },
      { when: flag('w.c45_eel_home'), text: 'Угорь с дамбы ждёт в холодной кладовке на блюде, накрытый полотенцем.' },
    ],
    actions: [
      { id: 'c46_ev_partner', label: 'Идти в церковь рядом с {partner.ins}', when: allChurch, minutes: 60, terminal: true, goto: 'c46_church', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Фонарь у {partner.gen}, у тебя одеяло под мышкой. Дорога белая, по обе стороны темнота. Впереди и позади тоже идут люди, огоньки фонарей тянутся до самого Йестебурга.', effects: [set46('ev', 'partner'), toJest, until46(54, 18, 0)] },
      { id: 'c46_ev_henrike', label: 'Вести Хенрике под руку: дорога скользкая', when: all(goChurch, henrike46), minutes: 65, terminal: true, goto: 'c46_church', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Хенрике идёт медленно и считает шаги вслух, по-нижненемецки, чтобы не поскользнуться. На полпути она говорит: «Das letzte Mal war ich mit meinem Vater hier. Zu Fuß. Wie jetzt». В последний раз я шла сюда с отцом. Пешком. Как сейчас.', effects: [set46('ev', 'henrike'), npc('henrike', 1), toJest, until46(54, 18, 0)] },
      { id: 'c46_ev_lantern', label: 'Взять фонарь и идти впереди всех', when: goChurch, minutes: 60, terminal: true, goto: 'c46_church', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Ты идёшь первым, фонарь качается, тени деревьев прыгают по снегу. На повороте у лесополосы ты останавливаешься и светишь в кусты. Ничего. Только заяц, белый на белом.', effects: [set46('ev', 'lantern'), toJest, until46(54, 18, 0)] },
      { id: 'c46_ev_kids', label: 'Нести на плечах младшего из детей', when: goChurch, minutes: 65, terminal: true, goto: 'c46_church', ambientDuring: eve46amb, activity: 'heavy',
        text: 'Мальчишка сидит у тебя на плечах и держится за уши. Всю дорогу он спрашивает, придёт ли сегодня Вайнахтсман, и как он найдёт дом, если в окнах нет электричества. Ты говоришь: по свечам.', effects: [set46('ev', 'kids'), { body: 'fatigue', delta: 5 }, toJest, until46(54, 18, 0)] },
      { id: 'c46_ev_cook', label: 'Остаться у плиты: кто-то должен', when: stayHome, minutes: 30, terminal: true, goto: 'c46_kitchen',
        text: 'Ты повязываешь фартук. Кастрюли твои. Дом пустеет, становится тихо, слышно, как трещит печь.', effects: [set46('ev', 'cook'), until46(54, 17, 30)] },
      { id: 'c46_ev_table', label: 'Накрывать стол в большой комнате', when: stayHome, minutes: 30, terminal: true, goto: 'c46_kitchen',
        text: 'Две простыни вместо скатерти, тарелки из трёх разных сервизов, ложки разной длины. Ты раскладываешь их так, чтобы было похоже на праздник. Похоже.', effects: [set46('ev', 'table'), until46(54, 17, 30)] },
      { id: 'c46_ev_wash', label: 'Вымыться горячей водой и надеть чистое', when: stayHome, minutes: 30, terminal: true, goto: 'c46_kitchen',
        text: 'Таз, кувшин, мыло. Чистая рубашка пахнет шкафом и чужим домом. Ты смотришь в зеркальце над умывальником и впервые за неделю причёсываешься.', effects: [set46('ev', 'wash'), { body: 'stress', delta: -3 }, until46(54, 17, 30)] },
    ] }),

  S46({ id: 'c46_church', for: 'any', chapter: 'ch3', title: 'Святой Мартин', location: jest46, camp: { at: jest46, stock: 'c3_farm_stock', rest: false }, ambient: church46amb,
    text: [
      { text: 'Церковь Святого Мартина полна. Люди сидят в пальто, на скамьях одеяла, у алтаря две печки-буржуйки и сотня свечей. Дыхание видно даже здесь.' },
      { text: 'Пастор старый и тихий. Он не говорит про мёртвых и про армию. Он читает про пастухов и про то, что в гостинице не было места. В церкви так тихо, что слышно, как трещат свечи.' },
      { when: allChurch, text: '{partner} сидит рядом, плечом к плечу, и держит твою руку под одеялом.' },
      { text: 'В третьем ряду Яннес с Уте. В углу у колонны Брандт, без шапки, и впервые не похож на начальника.' },
      { when: v('w.c15_garden', 'help'), text: 'Уте узнаёт вас через всю церковь и машет рукой, как по средам в ноябре, когда вы приносили ей вёдра.' },
      { when: v('w.c25_truth', 'all'), text: 'После службы к вам подходит женщина из Йестебурга. В ноябре она отдавала кровь на плазму, для мужа. «Sie haben es damals laut gesagt. Ich habe Ihnen nicht geglaubt. Jetzt glaube ich». Вы тогда сказали это вслух. Я вам не поверила. Теперь верю. Она уходит, не дожидаясь ответа.' },
      { when: v('w.c25_truth', 'brandt'), text: 'Уходя, Брандт кивает вам отдельно. С того разговора с глазу на глаз в ноябре он кивает вам так, как кивают своим.' },
      { when: nils46, text: 'У дверей стоит Нильс, в куртке Красного Креста, и не садится: так и стоит всю службу у стены.' },
    ],
    actions: [
      { id: 'c46_ch_sing', label: 'Петь «Stille Nacht» со всеми', minutes: 60, terminal: true, goto: 'c46_back',
        text: 'Ты не знаешь слов дальше первой строки, но поют все, и не петь невозможно. Голоса неровные, кто-то плачет и поёт сквозь слёзы. На последнем куплете гаснет одна свеча у алтаря, и никто не зажигает её снова.', effects: [set46('ch', 'sing'), { body: 'stress', delta: -8 }, until46(54, 19, 0)] },
      { id: 'c46_ch_ute', label: 'После службы подойти к Уте и Яннесу', minutes: 60, terminal: true, goto: 'c46_back',
        text: 'Уте обнимает тебя, неловко, через пальто. Яннес жмёт руку. «Frohe Weihnachten». Больше он ничего не говорит, но не отпускает руку дольше обычного.', effects: [set46('ch', 'ute'), npc('c14_jannes', 1), until46(54, 19, 0)] },
      { id: 'c46_ch_candle', label: 'Поставить свечу за тех, кого нет', minutes: 60, terminal: true, goto: 'c46_back',
        text: 'У бокового алтаря песок в железном ящике и сотни огарков. Ты ставишь свой. Рядом женщина ставит третью свечу подряд и шевелит губами, считая имена.', effects: [set46('ch', 'candle'), { body: 'stress', delta: -4 }, until46(54, 19, 0)] },
      { id: 'c46_ch_nils', label: 'Подойти к Нильсу у дверей', when: nils46, minutes: 60, terminal: true, goto: 'c46_back',
        text: 'Нильс кивает тебе на скамью: садись, мол, я постою. Потом говорит тихо: «Ich war seit der Konfirmation nicht in der Kirche. Fünfunddreißig Jahre». Не был в церкви с конфирмации. Тридцать пять лет. После службы он идёт с вами на хутор.', effects: [set46('ch', 'nils'), until46(54, 19, 0)] },
    ] }),

  S46({ id: 'c46_back', for: 'any', chapter: 'ch3', title: 'Обратно', location: jest46, camp: { at: jest46, stock: 'c3_farm_stock', rest: false }, ambient: eve46amb,
    text: [
      { text: 'Из церкви выходят все разом, и площадь у пожарной части наполняется фонарями. Кто-то зажёг факел. Мороз крепче, чем был, звёзды крупные.' },
      { text: 'Обратно четыре километра. Дорога одна для всех хуторов на восток: идут толпой, потом группками, потом каждый двор своим кругом света.' },
    ],
    actions: [
      { id: 'c46_bk_song', label: 'Идти и тихо напевать со всеми', minutes: 55, terminal: true, goto: 'c46_table', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Кто-то впереди начинает «O Tannenbaum», и дорога подхватывает. Ты поёшь мелодию без слов. До поворота на хутор песня держится, потом обрывается, и остаётся только скрип снега.', effects: [set46('bk', 'song'), toFarm, until46(54, 19, 45)] },
      { id: 'c46_bk_rear', label: 'Идти последним и смотреть за лесополосой', minutes: 55, terminal: true, goto: 'c46_table', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Ты идёшь в хвосте и каждые сто шагов оборачиваешься. У лесополосы следы через дорогу, свежие, неровные, без пары. Кто-то прошёл здесь, волоча ногу. Ты запоминаешь место.', effects: [set46('bk', 'rear'), w46('tracks_seen', true), toFarm, until46(54, 19, 45)] },
      { id: 'c46_bk_hand', label: 'Взять за руку того, кто идёт рядом', minutes: 55, terminal: true, goto: 'c46_table', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Рука в варежке, тёплая. Вы идёте так до самой калитки и ничего не говорите. Не надо.', effects: [set46('bk', 'hand'), { body: 'stress', delta: -3 }, toFarm, until46(54, 19, 45)] },
    ] }),

  S46({ id: 'c46_kitchen', for: 'any', chapter: 'ch3', title: 'Дома', camp: kitchen14,
    text: [
      { when: someChurch, text: 'Дом без половины людей кажется большим. Те, кто остался, двигаются медленнее и разговаривают тише, как в библиотеке.' },
      { when: church46('home'), text: 'Дом полон: все здесь, и всем есть дело. Дети носятся между кухней и большой комнатой и всем мешают.' },
      { when: merle46, text: 'Мерле сидит у окна и считает на листке: картошка, хлеб, сколько единиц на праздничный ужин. Ей не хочется считать сегодня. Она считает.' },
      { when: parents46, text: 'Уве режет хлеб ровными ломтями. Биргит гладит скатерть утюгом, который греет на плите.' },
    ],
    actions: [
      { id: 'c46_kt_cook', label: 'Готовить: картошка, подливка, что есть', minutes: 120, terminal: true, goto: 'c46_table',
        text: 'Картошка в мундире, подливка из сала и муки, капуста с яблоком. Ты пробуешь, солишь, пробуешь ещё. К половине восьмого всё готово, и окна запотели до самого верха.', effects: [set46('kt', 'cook'), until46(54, 19, 40)] },
      { id: 'c46_kt_merle', label: 'Посчитать с Мерле её ужин, чтобы она могла есть, не думая', when: merle46, minutes: 120, terminal: true, goto: 'c46_table',
        text: 'Вы считаете вдвоём: сколько картошки, сколько хлеба, сколько единиц. Получается, что она может съесть всё, что на её тарелке, и ещё печенье. Мерле смотрит на листок и смеётся. «Zum ersten Mal seit November». Первый раз с ноября.', effects: [set46('kt', 'merle'), w46('merle_counted', true), npc('merle', 1), until46(54, 19, 40)] },
      { id: 'c46_kt_kids', label: 'Занять детей: пусть клеят цепи из бумаги на ёлку', minutes: 120, terminal: true, goto: 'c46_table',
        text: 'Газета, мука с водой вместо клея, ножницы одни на всех. Цепь выходит длинная, кривая и серая, с буквами. Её вешают на ёлку в три оборота. Дети считают её самой красивой вещью в доме.', effects: [set46('kt', 'kids'), until46(54, 19, 40)] },
      { id: 'c46_kt_post', label: 'Сходить проверить пост у Зеве до темноты, пока все заняты', minutes: 90, terminal: true, goto: 'c46_table', ambientDuring: eve46amb,
        text: 'Шалаш, колокол, пень. Снег вокруг нетронутый. На том берегу Зеве в колонии светятся три окна. Ты стоишь, пока не начинают мёрзнуть ноги, и возвращаешься по своим следам.', effects: [set46('kt', 'post'), until46(54, 19, 30)] },
    ] }),

  S46({ id: 'c46_table', for: 'any', chapter: 'ch3', title: 'Стол', camp: house14,
    text: [
      { text: 'Без четверти восемь. Большая комната, два стола встык, свечи на ёлке горят, ведро с водой стоит рядом. За столом тесно.' },
      { when: eve46('open'), text: 'Пришли все, кого звали: соседи, Феликс, Юлиан с бабушкой, которая не слышит и поэтому улыбается всем. Скамеек не хватило, двое сидят на ящиках.' },
      { when: eve46('near'), text: 'Свои и соседи, с кем договорились. Тесно, но не настолько, чтобы сидеть на ящиках.' },
      { when: eve46('home'), text: 'Только свои. Тихо, и от этого слышно, как трещат свечи на ёлке.' },
      { when: all(merle46, v('w.c43_b_pens', 'buy')), text: 'Мерле съедает кусок пирога, не пересчитывая хлебные единицы. Две ручки из Винзена дают ей этот вечер.' },
      { when: all(brothersCome, not(eve46('home'))), text: 'Дениз принёс к столу противень баклавы: тесто тонкое, мёд Хенрике, орехи неизвестно откуда. «Bei uns macht man das so». У нас так принято. Керем раздаёт по кусочку детям первым.' },
      { when: all(henrike46, not({ npc: 'ole', at: 'hof_luedemann' }), v('w.c18_friday', 'write')), text: 'Хенрике ставит на стол лишнюю чашку. Для Оле. На ваше ноябрьское письмо он так и не ответил. Чашка стоит пустая весь вечер, и никто её не убирает.' },
      { when: all(henrike46, not({ npc: 'ole', at: 'hof_luedemann' }), v('w.c18_friday', 'go')), text: 'Хенрике каждый раз смотрит на дверь, когда скрипят половицы. Вы ездили за Оле в Люнебург в ноябре. Об этом сегодня не говорят.' },
      { when: v('w.c44_thief', 'feed'), text: 'В разгар ужина в дверь стучат. На пороге Мика, тот, что копал ваш бурт, и его сестра Лотте. Принесли звезду из соломы и банку из-под варенья с шишками. «Für den Baum». Для ёлки. Хенрике сажает обоих за стол, не спрашивая.' },
      { when: v('w.c44_thief', 'brandt'), text: 'Кто-то за столом говорит: Брандт отправил ту семью из колонии в спортзал в Винзен. Там теплее и кормят. Говорят это так, будто это хорошая новость.' },
      { when: all({ npc: 'c21_lea', alive: true, at: 'hof_luedemann' }, not(flag('w.c41_lea_gone'))), text: 'Лея сидит у окна, с краю, как всегда. Перед ней открытка, которую она подписывала весь вечер и не отправит: адреса нет.' },
      { when: all(v('w.c39_strangers', 'barn'), not(flag('w.c40_left_army')), v('w.c41_jorg', 'stay')), text: 'Дети Йорга сидят рядком на одной лавке и смотрят на свечи не мигая. Йорг подкладывает им со своей тарелки.' },
      { when: v('w.c28_place', 'hands'), text: 'Хенрике ставит ваши тарелки рядом со своей. Работники вы до весны на бумаге. За этим столом — нет.' },
      { when: v('w.c28_place', 'guests'), text: 'Гостями до весны, как договаривались в ноябре, вы так и остались. Хенрике всё равно наливает вам первым.' },
      { when: v('w.c40_after', 'neighbors'), text: 'К ужину соседи прислали банку мёда: за то, что после оттепели вы пришли к ним, а не только к себе.' },
      { when: v('w.c36_gift', 'ham'), text: 'Окорок из коптильни ушёл с колоннами ещё десятого. Хенрике вспоминает о нём вслух один раз и больше не вспоминает.' },
      { when: nils46, text: 'Нильс сидит на углу, в чистой рубашке, которую ему дали, и держит вилку так, будто отвык.' },
      { when: v('w.c44_hen', 'killed'), text: 'Курица одна на всех. Хенрике режет её так, что кусок достаётся каждому, даже детям, даже гостям.' },
      { when: not(v('w.c44_hen', 'killed')), text: 'Суп с перловкой и сушёными грибами. Рыжая курица, которую пожалели, сидит в сарае и не знает, как ей повезло.' },
      { when: flag('w.c45_eel_home'), text: 'Угорь лежит на блюде посреди стола, золотой. Кто-то из детей говорит «фу», кто-то просит добавки.' },
      { when: not(feast46), text: 'Еду берегли, и стол небольшой. Но свечи горят все.' },
    ],
    actions: [
      { id: 'c46_tb_eat', label: 'Есть и слушать, как все говорят разом', minutes: 60, terminal: true, goto: 'c46_gifts', ...tableOnly,
        text: 'Говорят все сразу, на трёх языках. Смеются над тем, над чем месяц назад не засмеялись бы. Ты ешь медленно, чтобы запомнить вкус.', effects: [set46('tb', 'eat'), meal('eat'), { body: 'stress', delta: -6 }, until46(54, 20, 45)] },
      { id: 'c46_tb_toast', label: 'Встать и сказать тост', minutes: 60, terminal: true, goto: 'c46_gifts', ...tableOnly,
        text: 'Ты встаёшь с кружкой компота. Говоришь коротко: за тех, кто за этим столом, и за тех, кого за ним нет. Тихо. Потом все поднимают кружки, и кто-то из детей стучит ложкой по столу.', effects: [set46('tb', 'toast'), meal('eat'), w46('toast', true), until46(54, 20, 45)] },
      { id: 'c46_tb_henrike', label: 'Отдать Хенрике письмо из Любека', when: all(henrike46, flag('w.c45_henrike_letter'), { me: 'B' }), minutes: 60, terminal: true, goto: 'c46_gifts', ...tableOnly,
        text: 'Хенрике смотрит на конверт, на почерк, и ставит кружку. Руки у неё дрожат. «Das ist Gerdas Schrift». Это почерк Герды. Она не открывает при всех. Кладёт письмо в карман фартука и до конца ужина держит на нём ладонь.', effects: [set46('tb', 'henrike'), meal('eat'), w46('letter_given', true), npc('henrike', 2, 'c46_letter'), until46(54, 20, 45)] },
      { id: 'c46_tb_nils', label: 'Сесть рядом с Нильсом: он чувствует себя чужим', when: nils46, minutes: 60, terminal: true, goto: 'c46_gifts', ...tableOnly,
        text: 'Нильс рассказывает тебе про Финкенвердер, про яблони у деда, про то, как в детстве воровал угрей из коптильни. Когда он смеётся, становится видно, каким он был до шрама.', effects: [set46('tb', 'nils'), meal('eat'), until46(54, 20, 45)] },
      { id: 'c46_tb_little', label: 'Есть понемногу и подкладывать детям', minutes: 60, terminal: true, goto: 'c46_gifts',
        text: 'Ты берёшь себе половину и подкладываешь мальчишке рядом. Он не замечает, откуда у него на тарелке ещё картошка. Хенрике замечает и молча кладёт тебе свой кусок хлеба.', effects: [set46('tb', 'little'), { body: 'hunger', delta: -15 }, until46(54, 20, 45)] },
    ] }),

  S46({ id: 'c46_gifts', for: 'any', chapter: 'ch3', title: 'Подарки', camp: house14,
    text: [
      { text: 'После ужина дети не могут усидеть. Под ёлкой свёртки в газете, перевязанные бечёвкой. Хенрике хлопает в ладоши: «Bescherung!» Подарки!' },
      { when: all(A46, bGift('socks')), text: 'Аня протягивает тебе мягкий свёрток. Носки, связанные из распущенного свитера, серые с бордовой полосой. Одна пятка толще другой. Ты надеваешь их сразу, прямо поверх своих.' },
      { when: all(A46, bGift('drawing')), text: 'Аня протягивает тебе плоский свёрток. Рисунок карандашом: вы двое у окна кухни, рамка из реек от ящика. Рисовала Мерле. Рамку — Аня, это видно по гвоздям.' },
      { when: all(A46, bGift('letter')), text: 'Аня протягивает тебе конверт. Два листа мелким почерком. «Потом прочитаешь», — говорит она. Ты кладёшь конверт во внутренний карман, к сердцу.' },
      { when: all(A46, not(flag('w.c42_b_gift')), bMade), text: 'Аня протягивает тебе свёрток, перевязанный бечёвкой. Внутри то, что она сделала из того, что было. Ты смотришь долго и не находишь слов.' },
      { when: all(A46, flag('w.c45_b_socks')), text: 'И ещё одни носки, толстые, рыночные, с двойной пяткой. «Чтобы были две пары», — говорит она.' },
      { when: all(A46, flag('w.c45_b_card')), text: 'В кармане у неё ещё открытка с ёлкой. Три строчки. Ты читаешь их дважды.' },
      { when: all(not(A46), aGift('carve')), text: 'Андрей протягивает тебе маленький свёрток. Внутри фигурка из липы: птица, сидящая на ветке. Нож Оле, три вечера. На крыле видно, где сорвалась рука.' },
      { when: all(not(A46), aGift('boots')), text: 'Андрей ставит перед тобой твои же ботинки. Подошва пришита дратвой, шов ровный, частый. Больше в них не будет мокро. Ты не {m:знал|знала}, что он умеет.' },
      { when: all(not(A46), aGift('letter')), text: 'Андрей протягивает тебе конверт. Три листа, один зачёркнут весь. «Потом», — говорит он. Ты кладёшь письмо в карман и держишь там руку.' },
      { when: all(not(A46), not(flag('w.c42_a_gift')), aMade), text: 'Андрей протягивает тебе свёрток. То, что он сделал за последние дни, из того, что было под рукой. Ты держишь его в ладонях и улыбаешься.' },
      { when: all(not(A46), flag('w.c45_a_mittens')), text: 'Под подушкой потом найдутся ещё варежки, серые, со снежинкой. Но это потом.' },
    ],
    actions: [
      { id: 'c46_gf_give', label: 'Отдать {partner.dat} свой подарок', minutes: 10, terminal: true, outcomes: fromGifts,
        text: '{partner} разворачивает газету медленно, чтобы не порвать. Смотрит. Потом смотрит на тебя. Этого взгляда хватит надолго.', effects: [set46('gf', 'give'), { body: 'stress', delta: -6 }, until46(54, 20, 55)] },
      { id: 'c46_gf_kids', label: 'Раздать детям, что приготовлено для них', when: any(flag('w.c44_kids_gifts'), v('A.c44_ag', 'kids'), { has: 'chocolate' }, flag('w.c45_b_apples')), minutes: 10, terminal: true, outcomes: fromGifts,
        text: 'Мешочки с орехами, фигурки из липы, шоколад, разломанный на дольки, сушёные яблоки на нитке — что у кого есть. Дети сидят на полу и раскладывают богатство кучками. Младший засыпает с яблоком на шее.', effects: [set46('gf', 'kids'), { if: { has: 'chocolate' }, then: [{ take: 'chocolate', qty: 1 }] }, until46(54, 20, 55)] },
      { id: 'c46_gf_merle', label: 'Отдать Мерле глюкометр', when: { has: 'c45_glucometer' }, minutes: 10, terminal: true, outcomes: fromGifts,
        text: 'Мерле открывает чехол и долго молчит. Потом колет палец, прямо за столом, и показывает всем цифру на экране. Цифра хорошая. Биргит отворачивается к окну.', effects: [set46('gf', 'merle'), { take: 'c45_glucometer', qty: 1 }, w46('merle_meter', true), npc('merle', 2, 'c46_meter'), until46(54, 20, 55)] },
      { id: 'c46_gf_star', label: 'Повесить на верхушку ёлки деревянную звезду', when: all(flag('w.c45_b_star'), { me: 'B' }), minutes: 10, terminal: true, outcomes: fromGifts,
        text: 'Табуретка, кто-то держит за пояс. Звезда садится на верхушку криво, потом ровно. Хенрике говорит: «So. Jetzt ist es Weihnachten». Вот. Теперь Рождество.', effects: [set46('gf', 'star'), w46('star_up', true), until46(54, 20, 55)] },
      { id: 'c46_gf_henrike', label: 'Отдать Хенрике то, что приготовил{m:|а} для неё', when: all(henrike46, v('A.c44_ag', 'henrike'), A46), minutes: 10, terminal: true, outcomes: fromGifts,
        text: 'Хенрике надевает очки, починенные, с новым винтиком в дужке, и смотрит на ёлку сквозь них. «Ach. Jetzt seh ich, wie schief der Baum ist». Ну вот. Теперь я вижу, какая ёлка кривая. И смеётся.', effects: [set46('gf', 'henrike'), npc('henrike', 1), until46(54, 20, 55)] },
      { id: 'c46_gf_nils', label: 'Подарить Нильсу свои вторые перчатки', when: nils46, minutes: 10, terminal: true, outcomes: fromGifts,
        text: 'Нильс смотрит на перчатки, потом на свои руки, красные, в трещинах от руля и мороза. Надевает. «Seit drei Jahren hat mir keiner was geschenkt». Мне три года никто ничего не дарил. Три года — это больше, чем с ноября. Ты не спрашиваешь.', effects: [set46('gf', 'nils'), until46(54, 20, 55)] },
      { id: 'c46_gf_sing', label: 'Петь с детьми у ёлки', minutes: 10, terminal: true, outcomes: fromGifts,
        text: '«O Tannenbaum», потом «Jingle Bells» на трёх языках сразу, потом что-то русское, что знаешь только ты. Дети подпевают, не зная слов. Хенрике хлопает в такт.', effects: [set46('gf', 'sing'), { body: 'stress', delta: -5 }, until46(54, 20, 55)] },
      { id: 'c46_gf_watch', label: 'Сесть в угол и смотреть, как дарят другие', minutes: 10, terminal: true, outcomes: fromGifts,
        text: 'Ты смотришь, как Юлиан разворачивает варежки, которые ему кто-то связал, и не знает, что сказать. Как Феликс держит в руках чужое письмо из дома, которого у него нет. Как свечи на ёлке отражаются в окне.', effects: [set46('gf', 'watch'), until46(54, 20, 55)] },
    ] }),

  // ── С девяти до полуночи: кто на посту, кто дома ──
  S46({ id: 'c46_post', for: 'any', chapter: 'ch3', title: 'Пост', camp: { at: farm46, stock: 'c3_farm_stock', rest: false }, ambient: eve46amb, safe: false,
    text: [
      { when: not(jannesPost46), text: 'Пост вашего двора у Зеве: шалаш из жердей и лапника, колокол на столбе, пень вместо стула. Девять вечера. Ты сменяешь соседа, он уходит домой к своему столу, не оглядываясь.' },
      { when: jannesPost46, text: 'Пост Яннеса у колонии: будка из досок, колокол, мешки с песком. Девять вечера. Ты обещал{m:|а} ему эту смену в понедельник. Он сейчас у Уте, за столом. Первое Рождество без кого-то, кого он не назвал.' },
      { text: 'Зеве подо льдом. Снег светится сам. Где-то за спиной, далеко, на хуторе поют.' },
    ],
    actions: [
      { id: 'c46_po_walk', label: 'Ходить вдоль берега, чтобы не замёрзнуть', minutes: 90, terminal: true, goto: 'c46_post2', ambientDuring: eve46amb, activity: 'moderate',
        text: 'Сто шагов туда, сто обратно. Снег скрипит. Ты считаешь шаги, потом звёзды, потом снова шаги. Один раз у воды хрустит ветка, и ты стоишь, не дыша, минуту. Олень. Уходит в темноту.', effects: [set46('po', 'walk'), until46(54, 22, 30)] },
      { id: 'c46_po_fire', label: 'Развести маленький огонь в жестянке у шалаша', minutes: 90, terminal: true, goto: 'c46_post2', ambientDuring: eve46amb,
        text: 'Огонь в банке из-под краски, ладони над ним. Тепло только рукам, но и этого хватает. Свет огня делает темноту вокруг гуще. Ты отодвигаешь банку за шалаш, чтобы её не было видно с того берега.', effects: [set46('po', 'fire'), until46(54, 22, 30)] },
      { id: 'c46_po_sit', label: 'Сесть на пень и слушать', minutes: 90, terminal: true, goto: 'c46_post2', ambientDuring: eve46amb,
        text: 'Ты сидишь неподвижно и слушаешь. Река подо льдом дышит. Где-то лает собака. С хутора долетает песня, потом смех, потом тишина. Холод поднимается от пня через спину.', effects: [set46('po', 'sit'), { body: 'fatigue', delta: 4 }, until46(54, 22, 30)] },
    ] }),

  S46({ id: 'c46_post2', for: 'any', chapter: 'ch3', title: 'Половина одиннадцатого', camp: { at: farm46, stock: 'c3_farm_stock', rest: false }, ambient: eve46amb, safe: false,
    text: [
      { text: 'Половина одиннадцатого. На том берегу, в камышах, что-то движется. Медленно. Останавливается. Снова движется. Фигура человека, который идёт так, как не ходят живые: всем боком, волоча ногу.' },
      { text: 'До льда метров тридцать. Лёд у берега крепкий, посередине — тёмная промоина.' },
    ],
    actions: [
      { id: 'c46_p2_bell', label: 'Ударить в колокол два раза: «вижу, не бегите»', minutes: 60, terminal: true, goto: 'c46_midnight', ambientDuring: eve46amb,
        text: 'Два удара. С хутора отвечает свет в окне, с колонии — тоже. Фигура поворачивается на звук и идёт к воде. На краю промоины лёд ломается под ней, и она уходит в чёрную воду без всплеска. Ты стоишь до полуночи и смотришь на то место. Больше ничего.', effects: [set46('p2', 'bell'), w46('post_dead', 'water'), until46(55, 0, 0)] },
      { id: 'c46_p2_watch', label: 'Не шуметь: смотреть, куда идёт', minutes: 60, terminal: true, goto: 'c46_midnight', ambientDuring: eve46amb,
        text: 'Фигура идёт вдоль того берега, медленно, мимо, к лесополосе. Ты следишь, пока она не скрывается в темноте. Потом ещё долго следишь за темнотой. В полночь пишешь мелом на столбе: «22.30 — einer, Richtung Wald». Один, в сторону леса.', effects: [set46('p2', 'watch'), w46('post_dead', 'forest'), until46(55, 0, 0)] },
      { id: 'c46_p2_ice', label: 'Взять багор и выйти на лёд, пока он один', minutes: 60, terminal: true, goto: 'c46_midnight', ambientDuring: eve46amb, risky: true,
        text: 'У берега лёд держит, дальше гудит. Ты останавливаешься у края промоины и ждёшь с багром. Он подходит, и ты бьёшь, как учили: в голову, сверху. Он валится в чёрную воду. Обратно ты идёшь по своим следам и только на берегу замечаешь, что ноги мокрые до колен.', effects: [set46('p2', 'ice'), w46('post_dead', 'killed'), { body: 'fatigue', delta: 6 }, { body: 'stress', delta: 6 }, until46(55, 0, 0)] },
    ] }),

  S46({ id: 'c46_home_night', for: 'any', chapter: 'ch3', title: 'Девять вечера', camp: house14,
    text: [
      { when: partnerPost46, text: 'В девять {partner} надевает тулуп и уходит на пост. В дверях оборачивается и машет. Место за столом рядом с тобой пустое, и тарелку никто не убирает.' },
      { when: not(partnerPost46), text: 'В девять на пост уходит сосед, которого попросили. Вы оба остаётесь. За это ему отнесли полкурицы ещё днём.' },
      { text: 'Дети спят вповалку на матрасах у ёлки. Взрослые сидят при свечах. Кто-то нашёл в сундуке губную гармошку.' },
      { when: flag('w.c19_brockmann_answer'), text: 'Около десяти кто-то включает рацию на частоте Красного Креста. Рождественские приветы: имена, деревни, «wir leben». Потом знакомый голос с треском, через океан: Томас Брокман из Торонто читает ответы, которые до него дошли.' },
      { when: all(flag('w.c19_brockmann_answer'), any(v('w.c34_thomas', 'truth'), v('w.c34_thomas', 'gentle'))), text: 'Среди них — ваш. Он читает его медленно, по-немецки, и в конце говорит: «Danke, Jesteburg». Хенрике прижимает ладонь к губам.' },
    ],
    actions: [
      { id: 'c46_hn_henrike', label: 'Сесть к Хенрике и попросить рассказать, каким был сочельник раньше', when: henrike46, minutes: 90, terminal: true, goto: 'c46_home_late',
        text: 'Хенрике рассказывает про штоллен на всю деревню, про сани с колокольчиками, про отца, который в сочельник обходил всех соседей с бутылкой. «Und jetzt sitzt ihr hier. Fremde. Und es ist trotzdem Weihnachten». А теперь тут сидите вы. Чужие. И всё равно Рождество.', effects: [set46('hn', 'henrike'), npc('henrike', 1), until46(54, 22, 30)] },
      { id: 'c46_hn_music', label: 'Слушать губную гармошку', minutes: 90, terminal: true, goto: 'c46_home_late',
        text: 'Играет Феликс, или Уве, или кто-то из соседей: гармошка переходит из рук в руки. Песни все знают разные, но мелодии похожи. Ты сидишь у печки, и в какой-то момент понимаешь, что улыбаешься уже минут десять.', effects: [set46('hn', 'music'), { body: 'stress', delta: -6 }, until46(54, 22, 30)] },
      { id: 'c46_hn_nils', label: 'Поговорить с Нильсом у печки', when: nils46, minutes: 90, terminal: true, goto: 'c46_home_late',
        text: 'Нильс говорит мало и смотрит в огонь. Потом говорит, что его жена всегда пекла в сочельник печенье с корицей и сжигала первый противень. «Jedes Jahr. Mit Absicht, glaube ich. Damit das Haus riecht». Каждый год. Нарочно, по-моему. Чтобы дом пах.', effects: [set46('hn', 'nils'), until46(54, 22, 30)] },
      { id: 'c46_hn_dishes', label: 'Мыть посуду, пока все отдыхают', minutes: 90, terminal: true, goto: 'c46_home_late',
        text: 'Гора тарелок, таз горячей воды, полотенце через плечо. За спиной смеются и поют. Ты моешь не торопясь и слушаешь, как за спиной смеются. Это лучшее место в доме: всё слышно и никто не трогает.', effects: [set46('hn', 'dishes'), until46(54, 22, 30)] },
    ] }),

  S46({ id: 'c46_home_late', for: 'any', chapter: 'ch3', title: 'Поздно', camp: house14,
    text: [
      { text: 'Половина одиннадцатого. Свечи на ёлке погасили, оставили одну на столе. Гости, кто пешком, собираются по домам с фонарями.' },
      { text: 'Издалека, со стороны Зеве, доносятся два удара колокола. Потом тишина. Все замирают. Потом в окне колонии мигает свет: всё в порядке.' },
    ],
    actions: [
      { id: 'c46_hl_guests', label: 'Проводить гостей до дороги с фонарём', minutes: 60, terminal: true, goto: 'c46_midnight', ambientDuring: eve46amb,
        text: 'Ты идёшь с фонарём до поворота. Гости прощаются, обнимаются, уходят своими кругами света. Ты стоишь, пока последний огонёк не скрывается за лесополосой.', effects: [set46('hl', 'guests'), until46(55, 0, 0)] },
      { id: 'c46_hl_window', label: 'Сесть у окна, которое смотрит на Зеве', minutes: 60, terminal: true, goto: 'c46_midnight',
        text: 'Темнота, снег, звёзды. Где-то там, у реки, шалаш и колокол. Ты сидишь, пока стекло не запотевает от дыхания, и протираешь его рукавом.', effects: [set46('hl', 'window'), until46(55, 0, 0)] },
      { id: 'c46_hl_kids', label: 'Укрыть спящих детей и подложить дров', minutes: 60, terminal: true, goto: 'c46_midnight',
        text: 'Одеяла сползли, кто-то спит поперёк матраса. Ты укрываешь каждого и подкладываешь в печку два полена. Младший во сне сжимает в кулаке сушёное яблоко на нитке.', effects: [set46('hl', 'kids'), until46(55, 0, 0)] },
    ] }),

  S46({ id: 'c46_midnight', for: 'any', chapter: 'ch3', title: 'Полночь', camp: house14,
    text: [
      { text: 'Полночь. Со стороны Йестебурга едва слышно бьют колокола Святого Мартина: двенадцать ударов, медленно. Двадцать пятое декабря.' },
      { when: atPost46, text: 'Тебя сменяют. Ты возвращаешься в дом замёрзш{m:им|ей} до костей. В кухне тебя ждёт кружка горячего, накрытая блюдцем.' },
      { when: partnerPost46, text: 'Хлопает дверь: {partner} вернул{pm:ся|ась} с поста, с инеем на бровях. Ты наливаешь {pm:ему|ей} горячего.' },
    ],
    actions: [
      { id: 'c46_mn_sleep', label: 'Лечь спать', minutes: 30, terminal: true, goto: 'c46_morning',
        text: 'Ты засыпаешь, как только голова касается подушки. Последнее, что слышишь, — как трещит остывающая печь.', effects: [set46('mn', 'sleep'), { body: 'fatigue', delta: -6 }, until46(55, 8, 0, true)] },
      { id: 'c46_mn_talk', label: 'Шептаться с {partner.ins} в темноте', minutes: 45, terminal: true, goto: 'c46_morning',
        text: 'Про два дня порознь. Про то, что каждый видел. Не всё, но многое. Вы засыпаете на полуслове, и никто не помнит, кто первым.', effects: [set46('mn', 'talk'), { body: 'stress', delta: -6 }, until46(55, 8, 0, true)] },
      { id: 'c46_mn_stove', label: 'Подложить дров в печь на всю ночь', minutes: 30, terminal: true, goto: 'c46_morning',
        text: 'Три полена, заслонку на полпальца. Печка гудит и успокаивается. Ты ложишься последним в доме и засыпаешь под её тиканье.', effects: [set46('mn', 'stove'), until46(55, 8, 0, true)] },
      { id: 'c46_mn_letter', label: 'Прочитать при свечке письмо, которое тебе подарили', when: any(all(A46, bGift('letter')), all(not(A46), aGift('letter'))), minutes: 45, terminal: true, goto: 'c46_morning',
        text: 'Свечка, одеяло на голову, листы. Ты читаешь медленно, по одному предложению. Некоторые перечитываешь. Потом складываешь письмо и кладёшь под подушку. Засыпаешь, держа на нём руку.', effects: [set46('mn', 'letter'), { body: 'stress', delta: -8 }, until46(55, 8, 0, true)] },
    ] }),

  // ═════════════ Рождество ═════════════
  S46({ id: 'c46_morning', for: 'any', chapter: 'ch3', title: 'Рождество', camp: kitchen14,
    text: [
      { text: 'Двадцать пятое. Проснулись поздно, все. Снег шёл всю ночь и перестал: двор белый, следов нет. В кухне пахнет вчерашней хвоей и печкой.' },
      { text: 'Дети уже играют на полу тем, что получили вчера. Завтрак — то, что осталось от ужина.' },
      { when: flag('w.c45_dog'), text: 'Луна спит у печки на чьей-то куртке и дёргает лапами во сне: бежит куда-то, в Драге, наверное.' },
      { when: v('w.c44_thief', 'half'), text: 'На крыльце утром кто-то оставил звезду из соломы. Без записки. Следы маленькие, ведут через поле к колонии.' },
      { when: all({ npc: 'c21_lea', alive: true, at: 'hof_luedemann' }, not(flag('w.c41_lea_gone'))), text: 'Лея на крыльце учит младших свистеть в два пальца. Получается только у неё.' },
      { when: nilsNight46, text: 'Нильс спит на лавке в кухне, в куртке, с открытым ртом. Хенрике накрыла его вторым одеялом и ходит вокруг на цыпочках.' },
    ],
    actions: [
      { id: 'c46_mo_eat', label: 'Позавтракать со всеми', minutes: 45, terminal: true, goto: 'c46_letter', ...tableOnly,
        text: 'Холодная курица, хлеб, вчерашняя картошка, обжаренная на сале. Лучший завтрак за месяц.', effects: [set46('mo', 'eat'), meal('eat'), until46(55, 9, 15)] },
      { id: 'c46_mo_snow', label: 'Сначала расчистить двор и дорожку к калитке', minutes: 50, terminal: true, goto: 'c46_letter', ambientDuring: xmas46, activity: 'heavy',
        text: 'Лопата, свежий снег, мягкий и лёгкий. К калитке, к колодцу, к курятнику. Возвращаешься с красными щеками, и тебе оставили завтрак на краю плиты.', effects: [set46('mo', 'snow'), { body: 'hunger', delta: -25 }, until46(55, 9, 15)] },
      { id: 'c46_mo_kids', label: 'Играть с детьми на полу', minutes: 45, terminal: true, goto: 'c46_letter',
        text: 'Деревянная птица летает над ковром, фигурки ходят в гости друг к другу, мешочек с орехами становится сундуком с сокровищами. Ты ешь холодную картошку прямо с тарелки, сидя на полу.', effects: [set46('mo', 'kids'), { body: 'hunger', delta: -20 }, { body: 'stress', delta: -4 }, until46(55, 9, 15)] },
    ] }),

  S46({ id: 'c46_letter', for: 'any', chapter: 'ch3', title: 'Письмо', camp: kitchen14,
    text: [
      { text: 'В половине десятого в калитку стучит Лукас, красный от мороза, с мешком почты Красного Креста: пришла ночью с колонной из Харбурга.' },
      { when: tobias46, text: 'Для хутора — одно письмо. Армейский конверт, на нём карандашом: «Lüdemann-Hof, Jesteburg. Für die beiden». Для этих двоих. Почерк незнакомый, но внизу подпись — «T.», и ты понимаешь раньше, чем дочитываешь.' },
      { when: all(tobias46, v('w.c35_east', 'give')), text: '«Wir stehen bei Lauenburg. Die Elbe hält. Die zwei Plätze, die ihr verschenkt habt, sind nicht leer gefahren. Wer drin saß, ist gesund und hat einen Ofen. Im Umschlag ist ein Passierschein für die Brücke in Harburg, für zwei Personen, bis Ende Januar. Für die Schwester und wen sie mitnimmt. Oder für wen ihr wollt. Frohe Weihnachten. T.»\n\nМы стоим у Лауэнбурга. Эльба держит. Два места, которые вы отдали, не уехали пустыми. Кто в них сидел, здоров, и у него есть печка. В конверте пропуск через мост в Харбурге, на двоих, до конца января. Для сестры и того, кого она возьмёт. Или для кого захотите. Счастливого Рождества. Т.' },
      { when: all(tobias46, not(v('w.c35_east', 'give'))), text: '«Wir stehen bei Lauenburg. Die Elbe hält. Ich hatte zwei Plätze und habe zwei leere mitgenommen. Ist gut so. Im Umschlag ist ein Passierschein für die Brücke in Harburg, für zwei Personen, bis Ende Januar. Für die Schwester und wen sie mitnimmt. Oder für wen ihr wollt. Frohe Weihnachten. T.»\n\nМы стоим у Лауэнбурга. Эльба держит. У меня было два места, и я увёз их пустыми. Так и надо. В конверте пропуск через мост в Харбурге, на двоих, до конца января. Для сестры и того, кого она возьмёт. Или для кого захотите. Счастливого Рождества. Т.' },
      { when: all(tobias46, v('w.c16_albers', 'take')), text: 'Внизу приписка, торопливым почерком: «Für den Schuppen im November. Für Mama. Ich vergesse das nicht». За сарай в ноябре. За маму. Я этого не забуду.' },
      { when: all(tobias46, v('w.c16_albers', 'no')), text: 'О матери в письме ни слова. Ни упрёка, ни благодарности. Просто ни слова.' },
      { when: not(tobias46), text: 'Для хутора писем нет. Лукас разводит руками и уходит дальше по дворам.' },
    ],
    actions: [
      { id: 'c46_lt_read', label: 'Перечитать письмо вслух для всех', when: tobias46, minutes: 40, terminal: true, goto: 'c46_chores',
        text: 'Ты читаешь вслух, сначала по-немецки, потом переводишь. Хенрике слушает и кивает на «Эльба держит». Феликс, если он здесь, при слове «Лауэнбург» опускает глаза. Пропуск ты кладёшь в жестяную коробку на полке, где документы.', effects: [set46('lt', 'read'), w46('pass', true), w46('tobias_letter', true), until46(55, 10, 0)] },
      { id: 'c46_lt_pass', label: 'Рассмотреть пропуск: печать, подпись, срок', when: tobias46, minutes: 40, terminal: true, goto: 'c46_chores',
        text: 'Бланк с орлом, печать части, подпись майора и сбоку — подпись Тобиаса, мелкая. «Gültig bis 31.01.» Действителен до тридцать первого января. Двое. Без имён. Кто покажет — тот и пройдёт.', effects: [set46('lt', 'pass'), w46('pass', true), w46('tobias_letter', true), until46(55, 10, 0)] },
      { id: 'c46_lt_lukas', label: 'Налить Лукасу горячего, пока он греется', minutes: 40, terminal: true, goto: 'c46_chores',
        text: 'Лукас пьёт, обжигаясь, и рассказывает: ночью на мосту в Харбурге стреляли, но колонна прошла. У пожарной части с утра Брандт, и у него, говорит Лукас, «ein Plan für Silvester». План на Сильвестр.', effects: [set46('lt', 'lukas'), { if: tobias46, then: [w46('pass', true), w46('tobias_letter', true)] }, w46('heard_silvester', true), until46(55, 10, 0)] },
      { id: 'c46_lt_quiet', label: 'Отойти к окну с письмом и помолчать', when: tobias46, minutes: 40, terminal: true, goto: 'c46_chores',
        text: 'Ты помнишь, как стоял выбор с этими двумя местами, и кто что сказал. Тобиас тоже помнит. Он не упрекает. Он просто пишет, где он теперь.', effects: [set46('lt', 'quiet'), w46('pass', true), w46('tobias_letter', true), until46(55, 10, 0)] },
      { id: 'c46_lt_list', label: 'Посмотреть, нет ли в мешке Лукаса писем для соседей: отнести по пути', when: not(tobias46), minutes: 40, terminal: true, goto: 'c46_chores',
        text: 'Для соседей два письма: Ханзенам и Уте. Ты забираешь оба. Лукас благодарит: на два двора меньше идти по снегу.', effects: [set46('lt', 'list'), until46(55, 10, 0)] },
    ] }),

  S46({ id: 'c46_chores', for: 'any', chapter: 'ch3', title: 'Хозяйство', camp: yard14, ambient: xmas46,
    text: [
      { text: 'Праздник праздником, а куры, вода и печки своё требуют. Хенрике раздаёт дела, как каждое утро, только голос мягче.' },
      { when: henrike46, text: '«Heute machen wir nur das Nötigste. Und dann geht jeder, wohin er muss». Сегодня — только самое нужное. А потом каждый идёт, куда ему надо.' },
      { when: v('w.c44_hen', 'spared'), text: 'Рыжая курица, которую пожалели к сочельнику, сидит на заборе курятника и смотрит на всех с подозрением.' },
    ],
    actions: [
      { id: 'c46_cr_water', label: 'Натаскать воды из колодца на весь день', minutes: 45, terminal: true, outcomes: fromLetter, ambientDuring: xmas46, activity: 'heavy',
        text: 'Ворот скрипит, ведро стучит о сруб. Шесть вёдер в бочку на кухне. Вода в колодце стоит низко: зима сухая, снег не тает.', effects: [set46('cr', 'water'), { body: 'fatigue', delta: 5 }, until46(55, 10, 45)] },
      { id: 'c46_cr_hens', label: 'Покормить кур и собрать яйца', minutes: 40, terminal: true, outcomes: fromLetter, ambientDuring: xmas46,
        text: 'В курятнике тепло от птиц. Яиц три: зима, свет короткий. Куры толкаются у кормушки и не замечают праздника.', effects: [set46('cr', 'hens'), until46(55, 10, 45)] },
      { id: 'c46_cr_wood', label: 'Наколоть дров на два дня', minutes: 50, terminal: true, outcomes: fromLetter, ambientDuring: xmas46, activity: 'heavy',
        text: 'Колода, топор, мёрзлые чурки раскалываются со звоном. Через полчаса тебе жарко, и ты снимаешь куртку. Поленница у двери растёт на ладонь.', effects: [set46('cr', 'wood'), { body: 'fatigue', delta: 6 }, until46(55, 10, 45)] },
      { id: 'c46_cr_basket', label: 'Помочь Хенрике собрать корзины тем, кто вчера был один', when: henrike46, minutes: 40, terminal: true, outcomes: fromLetter,
        text: 'Две корзины: одна в Йестебург, одна в Люллау и к фрау Ханзен. Хенрике кладёт в каждую больше, чем можно, и потом немного вынимает обратно. Потом снова кладёт.', effects: [set46('cr', 'basket'), npc('henrike', 1), until46(55, 10, 45)] },
    ] }),

  // ── Вечер Рождества, вместе ──
  S46({ id: 'c46_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: xmas46,
    text: [
      { text: 'Половина четвёртого. Солнце садится за лесополосу, красное. Вы снова оба во дворе, после полудня порознь.' },
      { text: 'Дети лепят у калитки снеговика, уже третьего за неделю. У этого вместо носа сосновая шишка.' },
    ],
    actions: [
      { id: 'c46_dk_snow', label: 'Запустить в {partner.acc} снежком', minutes: 45, terminal: true, goto: 'c46_hall', ambientDuring: xmas46, activity: 'moderate',
        text: 'Снежок попадает точно в плечо. {partner} оборачивается, медленно нагибается и лепит в ответ. Через минуту в войне все дети и, кажется, Юлиан. Вы проигрываете оба.', effects: [set46('dk', 'snow'), { body: 'stress', delta: -8 }, until46(55, 16, 30)] },
      { id: 'c46_dk_tell', label: 'Рассказать {partner.dat}, как прошёл день', minutes: 45, terminal: true, goto: 'c46_hall', ambientDuring: xmas46,
        text: 'Вы стоите у забора, и каждый рассказывает своё. Про Йестебург, про Люллау. Многое совпадает, кое-что нет. Солнце садится, пока вы говорите.', effects: [set46('dk', 'tell'), until46(55, 16, 30)] },
      { id: 'c46_dk_wood', label: 'Принести дров на вечер и ночь', minutes: 45, terminal: true, goto: 'c46_hall', ambientDuring: xmas46, activity: 'heavy',
        text: 'Четыре охапки к печке, две к плите. Поленница за сараем похудела за праздники. До весны далеко. Ты прикидываешь, сколько осталось, и не говоришь вслух.', effects: [set46('dk', 'wood'), { body: 'fatigue', delta: 4 }, until46(55, 16, 30)] },
    ] }),

  S46({ id: 'c46_hall', for: 'any', chapter: 'ch3', title: 'Час до ужина', camp: house14,
    text: [
      { text: 'Стемнело. В большой комнате зажгли одну лампу и печку. До ужина час. Дом отдыхает: кто спит, кто сидит с книгой, кто просто смотрит в огонь.' },
      { when: nilsNight46, text: 'Нильс ушёл к своей машине ещё днём. На лавке в кухне аккуратно сложено одеяло, а на нём записка карандашом: «Danke für alles. N.»' },
      { when: felix46, text: 'Феликс сидит у окна с листом бумаги и не пишет. Письмо домой, которого некуда отправить.' },
    ],
    actions: [
      { id: 'c46_hl2_cards', label: 'Сыграть в карты с теми, кто не спит', minutes: 60, terminal: true, goto: 'c46_supper',
        text: 'Колода с одной картой, нарисованной от руки вместо потерянной. Играют в «дурака», которому ты учишь всех, путая немецкие слова. Через полчаса Хенрике или Уве уже обыгрывают тебя без жалости.', effects: [set46('hl2', 'cards'), { body: 'stress', delta: -5 }, until46(55, 17, 30)] },
      { id: 'c46_hl2_draft', label: 'Набросать черновик ответа Тобиасу, на всякий случай', when: flag('w.c46_tobias_letter'), minutes: 60, terminal: true, goto: 'c46_supper',
        text: 'Ты пишешь по-немецки, медленно, со словарём из головы. «Danke. Wir leben. Die Elbe soll halten». Дальше не знаешь. Решать, что ещё писать, — вдвоём. Ты складываешь листок и кладёшь в коробку к пропуску.', effects: [set46('hl2', 'draft'), w46('answer_draft', true), until46(55, 17, 30)] },
      { id: 'c46_hl2_felix', label: 'Сесть к Феликсу: может, ему нужна помощь со словами', when: felix46, minutes: 60, terminal: true, goto: 'c46_supper',
        text: 'Феликс пишет матери в Ганновер второй раз: первое письмо ушло неделю назад, ответа нет. Он спрашивает у тебя, как пишется «Weihnachten ohne dich», и сам вспоминает раньше, чем ты отвечаешь.', effects: [set46('hl2', 'felix'), until46(55, 17, 30)] },
      { id: 'c46_hl2_nap', label: 'Подремать у печки', minutes: 60, terminal: true, goto: 'c46_supper',
        text: 'Кресло, плед, треск поленьев. Ты засыпаешь сидя и просыпаешься от того, что кто-то накрыл тебя вторым пледом.', effects: [set46('hl2', 'nap'), { body: 'fatigue', delta: -8 }, until46(55, 17, 30)] },
    ] }),

  S46({ id: 'c46_supper', for: 'any', chapter: 'ch3', title: 'Вечер Рождества', camp: kitchen14,
    text: [
      { text: 'Ужин тихий: доедают праздник. Суп из курицы или из того, что от неё осталось, хлеб, чай.' },
      { when: all(henrike46, flag('w.c46_letter_given')), text: 'Хенрике достаёт из кармана фартука письмо из Любека и читает, шевеля губами. Потом говорит, ни к кому не обращаясь: «Gerda lebt. Mit dem Enkel. In einer Schule am Hafen». Герда жива. С внуком. В школе у порта. И прячет письмо обратно.' },
      { when: hamburg46, text: 'Мерле складывает в рюкзак тёплые вещи. До двадцать восьмого три дня.' },
    ],
    actions: [
      { id: 'c46_su_eat', label: 'Ужинать со всеми', minutes: 50, terminal: true, goto: 'c46_last', ...tableOnly,
        text: 'Суп, хлеб, чай. Разговоры усталые, ленивые. Кто-то из детей засыпает за столом, уронив голову на руки.', effects: [set46('su', 'eat'), meal('eat'), until46(55, 18, 30)] },
      { id: 'c46_su_henrike', label: 'Спросить Хенрике про Герду', when: all(henrike46, flag('w.c46_letter_given')), minutes: 50, terminal: true, goto: 'c46_last', ...tableOnly,
        text: 'Двоюродная сестра, на год старше. В детстве они делили одну кровать на каникулах. Последний раз виделись на похоронах отца Хенрике, двенадцать лет назад. «Wir haben uns gestritten. Wegen einer Kommode». Мы поссорились. Из-за комода. Хенрике смеётся и вытирает глаза.', effects: [set46('su', 'henrike'), meal('eat'), npc('henrike', 1), until46(55, 18, 30)] },
      { id: 'c46_su_merle', label: 'Помочь Мерле собраться в дорогу', when: hamburg46, minutes: 50, terminal: true, goto: 'c46_last',
        text: 'Тёплые носки, свитер, сменное бельё, флаконы в вату, шприцы, листок с расчётом единиц. Мерле складывает всё по три раза. Ты не мешаешь: так ей спокойнее.', effects: [set46('su', 'merle'), { body: 'hunger', delta: -20 }, until46(55, 18, 30)] },
      { id: 'c46_su_kids', label: 'Уложить детей и рассказать им сказку', minutes: 50, terminal: true, goto: 'c46_last',
        text: 'Ты рассказываешь про зайца, который искал дом, и находит его у людей, которые сначала не хотели его пускать. Сказку ты сочиняешь на ходу. Младший засыпает на середине, старший — дослушав и спросив, что заяц ел.', effects: [set46('su', 'kids'), { body: 'hunger', delta: -20 }, until46(55, 18, 30)] },
      { id: 'c46_su_count', label: 'Пересчитать, что осталось в кладовке после праздников', minutes: 50, terminal: true, goto: 'c46_last',
        text: 'Картошка, мука, банки, сало. Праздник съел неделю. Ты записываешь на обороте календаря цифры и обводишь одну. Январь будет худым.', effects: [set46('su', 'count'), w46('stock_counted', true), { body: 'hunger', delta: -20 }, until46(55, 18, 30)] },
    ] }),

  S46({ id: 'c46_last', for: 'any', chapter: 'ch3', title: 'Перед сном', camp: house14,
    text: [
      { text: 'Дом затихает рано: два дня праздника, и все устали. Свеча на столе, за окном снег.' },
      { when: flag('w.c46_heard_silvester'), text: 'Сильвестр через шесть дней. Брандт что-то задумал у пожарной части.' },
    ],
    actions: [
      { id: 'c46_ls_talk', label: 'Поговорить с {partner.ins} о том, что дальше', minutes: 60, terminal: true, goto: 'c46_checkpoint',
        text: 'Про Нильса и январь, про Тобиаса, про Сильвестр, про пропуск в жестяной коробке. Вы говорите шёпотом, хотя никто не спит рядом. Многое решать вместе. Сейчас.', effects: [set46('ls', 'talk'), finish, until46(55, 20, 0)] },
      { id: 'c46_ls_sleep', label: 'Лечь пораньше', minutes: 60, terminal: true, goto: 'c46_checkpoint',
        text: 'Ты ложишься в восемь, как ребёнок, и засыпаешь сразу. Где-то за стеной Хенрике напевает «O du fröhliche».', effects: [set46('ls', 'sleep'), { body: 'fatigue', delta: -6 }, finish, until46(55, 20, 0)] },
      { id: 'c46_ls_window', label: 'Постоять у окна, глядя на снег', minutes: 60, terminal: true, goto: 'c46_checkpoint',
        text: 'Снег идёт крупный, медленный. В колонии гаснет последнее окно. Первое Рождество после всего прошло. Ты не знаешь, будет ли второе. Но это было.', effects: [set46('ls', 'window'), finish, until46(55, 20, 0)] },
    ] }),

  S46({ id: 'c46_checkpoint', for: 'any', chapter: 'ch3', title: 'Рождество, вечер', checkpoint: 46, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Двадцать пятое декабря.' }], actions: [] }),
];
