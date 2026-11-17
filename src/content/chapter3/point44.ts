import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import { henrike43, merle43 } from './point43';

// Участок 44 «Совет»: пн 21.12, 06:30 → КТ44 вт 22.12, 20:30. Передышка после «знают разное»; человек из прошлого — Нильс,
// водитель серого «гольфа» из Баренфельда (первый день A: `A.city_crash = helped` — вытащил ломом; иначе проехал мимо). Теперь он
// водит колонну Красного Креста Гамбург — Винзен и записывает больных на 28-е. Совет в пожарной части — по `w.c43_council`
// (что A говорит за двор, решила B). Последствия решения A за B (`w.c43_convoy` / `w.c43_job`) — сценой у B с Мерле.
export const P44: Cond = all({ cp: 43 }, not({ cp: 44 }));
export const A44: Cond = { me: 'A' };
export const farm44 = 'hof_luedemann';
export const jest44 = 'c16_jesteburg';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played43: Cond = any(flag('A.c43_finished'), flag('B.c43_finished'));
const base44: Cond = all(P44, played43, { at: farm44 }, { partnerAt: farm44 }, up, { partner: 'active' });
export const point44Available: Cond = base44;

export const henrike44 = henrike43;
export const merle44 = merle43;
export const council44 = (x: string): Cond => v('w.c43_council', x);
export const convoy44 = (x: string): Cond => v('w.c43_convoy', x);
export const job44 = (x: string): Cond => v('w.c43_job', x);
export const nilsHelped: Cond = v('A.city_crash', 'helped');
export const felixAround44: Cond = any(v('w.c43_felix', 'farm'), v('w.c43_felix', 'ditch'), v('w.c42_jonas_fate', 'take'), v('w.c42_jonas_fate', 'brandt'));
export const julian44: Cond = flag('w.c42_lars_work');
export const hansenDead44: Cond = v('w.c40_neighbor', 'dead');
export const own44 = (key: string, value: string): Cond => v(`$.c44_${key}`, value);

export const mon44 = { tempC: -4, outdoor: true, wet: false };
export const tue44 = { tempC: -2, outdoor: true, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm44, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S44 = wrap(P44);
export const set44 = (key: string, value: string | boolean): Effect => ({ set: `$.c44_${key}`, value });
export const w44 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c44_${key}`, value });
export const until44 = (d: 51 | 52, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare44: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c44_finished', value: true };
const toFarm: Effect = { move: farm44 };
/** Решение совета — одно на обеих линиях: зависит только от того, что сказал двор (КТ43). */
const verdict: Effect[] = [
  { if: council44('truth'), then: [w44('verdict', 'double')], else: [
    { if: council44('yard'), then: [w44('verdict', 'yard')], else: [w44('verdict', 'half')] }] },
];
const fromDawn = [{ id: 'a', when: A44, goto: 'c44_a_morning' }, { id: 'b', goto: 'c44_b_morning' }];
const fromLunch = [{ id: 'a', when: A44, goto: 'c44_a_jannes' }, { id: 'b', goto: 'c44_b_merle' }];
const fromTue = [{ id: 'a', when: A44, goto: 'c44_a_hen' }, { id: 'b', goto: 'c44_b_answer' }];
const fromTueLunch = [{ id: 'a', when: A44, goto: 'c44_a_church' }, { id: 'b', goto: 'c44_b_ute' }];

export const shared44: Scene[] = [
  S44({ id: 'c44_dawn', for: 'any', chapter: 'ch3', title: 'Понедельник', camp: kitchen14,
    text: [
      { text: 'Понедельник, половина седьмого. Минус четыре, небо чистое, звёзды ещё видны. В десять — совет дворов в пожарной части.' },
      { when: julian44, text: 'Без пяти семь в калитку стучат. На пороге мальчишка в шапке до бровей, с пустым мешком: «Ich bin Julian. Zum Arbeiten». Я Юлиан. Работать.' },
      { when: felixAround44, text: 'Феликс уже одет: в семь его ждут на рву у Зеве.' },
    ],
    actions: [
      { id: 'c44_dw_eat', label: 'Позавтракать со всеми', minutes: 40, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, хлеб, горячее молоко. За столом говорят про совет вполголоса, как будто Брандт может услышать.', effects: [set44('dw', 'eat'), meal('eat'), until44(51, 7, 15)] },
      { id: 'c44_dw_julian', label: 'Посадить мальчишку за стол: сначала поесть, потом работа', when: julian44, minutes: 40, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Юлиан ест так, что Хенрике молча подкладывает ему ещё. Потом он вытирает рот рукавом и спрашивает: «Was zuerst?» Что сначала? Хенрике отвечает: «Hühner». Куры.', effects: [set44('dw', 'julian'), meal('eat'), w44('julian_fed', true), until44(51, 7, 15)] },
      { id: 'c44_dw_henrike', label: 'Помочь Хенрике у плиты', when: henrike44, minutes: 40, terminal: true, outcomes: fromDawn,
        text: 'Хенрике говорит, не поворачиваясь: «Brandt wird laut sein. Lass ihn. Laute Männer hören am Ende zu». Брандт будет громким. Пусть. Громкие мужчины в конце концов слушают.', effects: [set44('dw', 'henrike'), meal('eat'), npc('henrike', 1), until44(51, 7, 15)] },
      { id: 'c44_dw_tea', label: 'Чай у окна и подумать про совет', minutes: 30, terminal: true, outcomes: fromDawn,
        text: 'Кружка остывает в руках. Ты думаешь о том, что скажешь сегодня. Или что за тебя уже решили.', effects: [set44('dw', 'tea'), { body: 'hunger', delta: -10 }, until44(51, 7, 0)] },
    ] }),

  S44({ id: 'c44_road', for: 'any', chapter: 'ch3', title: 'Дорога в Йестебург', camp: { at: farm44, stock: 'c3_farm_stock', rest: false }, ambient: mon44,
    text: [
      { text: 'Четыре километра по укатанной дороге. Мороз, солнце низко, снег слепит. Впереди и позади идут люди с других дворов, по двое, по трое. Все на совет.' },
    ],
    actions: [
      { id: 'c44_rd_partner', label: 'Идти рядом с {partner.ins}', minutes: 55, terminal: true, goto: 'c44_council', ambientDuring: mon44,
        text: 'Вы идёте молча, плечом к плечу. У поворота на Йестебург {partner} берёт тебя под руку. Так и входите в посёлок.', effects: [set44('rd', 'partner'), { move: jest44 }, until44(51, 9, 55)] },
      { id: 'c44_rd_henrike', label: 'Идти с Хенрике: ей тяжело по снегу', when: henrike44, minutes: 60, terminal: true, goto: 'c44_council', ambientDuring: mon44,
        text: 'Хенрике идёт медленно и держится за твой локоть. На полпути говорит: «Mein Vater war auch mal im Rat. Er hat nie was gesagt. Das war auch eine Meinung». Мой отец тоже был в совете. Никогда ничего не говорил. Это тоже было мнение.', effects: [set44('rd', 'henrike'), npc('henrike', 1), { move: jest44 }, until44(51, 9, 55)] },
      { id: 'c44_rd_lukas', label: 'Сесть к Лукасу на прицеп трактора', minutes: 40, terminal: true, goto: 'c44_council', ambientDuring: mon44,
        text: 'Лукас тормозит и машет: садись. Ты едешь на прицепе среди канистр. Лукас кричит через плечо: «Heute wird es laut». Сегодня будет громко.', effects: [set44('rd', 'lukas'), { move: jest44 }, until44(51, 9, 55)] },
    ] }),

  S44({ id: 'c44_council', for: 'any', chapter: 'ch3', title: 'Совет', location: jest44, camp: { at: jest44, stock: 'c3_farm_stock', rest: false }, onEnter: [until44(51, 10, 0), ...verdict],
    text: [
      { text: 'Пожарная часть, гараж без машин. Скамейки из школы, человек сорок, пар изо ртов. Брандт стоит у стола с блокнотом. Лукас у двери.' },
      { text: '— Die Tauwetternacht. Am Posten bei der Kolonie war vierzig Minuten keiner. Ich will wissen, wer. Jeder Hof sagt, was er weiß.\n\nНочь оттепели. На посту у колонии сорок минут никого не было. Я хочу знать, кто. Каждый двор говорит, что знает.' },
      { when: all(A44, council44('truth')), text: 'Очередь доходит до вашего двора. Ты встаёшь и говоришь, как решил{pm:|а} {partner}: всё, что знаете. Пост у колонии в ту ночь держал Яннес, и его не было сорок минут.' },
      { when: all(not(A44), council44('truth')), text: 'Очередь доходит до вашего двора. Встаёт {A} и говорит, как ты решил{m:|а}: всё, что знаете. Пост у колонии держал Яннес, и его не было сорок минут.' },
      { when: all(A44, council44('yard')), text: 'Очередь доходит до вашего двора. Ты встаёшь и говоришь, как решил{pm:|а} {partner}: за ту ночь отвечает двор Людеманов. Лишние смены у Зеве — ваши, до весны. Имени ты не называешь.' },
      { when: all(not(A44), council44('yard')), text: 'Очередь доходит до вашего двора. Встаёт {A} и говорит, как ты решил{m:|а}: за ту ночь отвечает двор Людеманов, лишние смены у Зеве — ваши, до весны. Имени {A} не называет.' },
      { when: all(A44, council44('silent')), text: 'Очередь доходит до вашего двора. Ты молчишь, как решил{pm:|а} {partner}. Брандт ждёт, потом сам смотрит в блокнот: «Jannes. Lukas hat es gesehen». Яннес. Лукас видел.' },
      { when: all(not(A44), council44('silent')), text: 'Очередь доходит до вашего двора. {A} молчит, как ты решил{m:|а}. Брандт ждёт, потом сам смотрит в блокнот: «Jannes. Lukas hat es gesehen». Яннес. Лукас видел.' },
      { text: 'В заднем ряду встаёт Яннес. Он хромает. «Ich war es. Vierzig Minuten». Это я. Сорок минут.' },
      { text: 'И тогда встаёт Уте. Голос у неё срывается, но она говорит до конца: двое у её двери, её крик, Яннес с топором, его нога. В гараже тихо.' },
    ],
    actions: [
      { id: 'c44_co_listen', label: 'Слушать, что скажет Брандт', minutes: 40, terminal: true, goto: 'c44_verdict',
        text: 'Брандт долго молчит. Потом закрывает блокнот. В гараже никто не кашляет.', effects: [set44('co', 'listen'), until44(51, 10, 45)] },
      { id: 'c44_co_stand', label: 'Встать рядом с Яннесом', minutes: 40, terminal: true, goto: 'c44_verdict',
        text: 'Ты встаёшь и проходишь в задний ряд. Встаёшь рядом с Яннесом. Он не смотрит на тебя, но плечо у него перестаёт дрожать. Двое из колонии встают тоже.', effects: [set44('co', 'stand'), npc('c14_jannes', 2), until44(51, 10, 45)] },
      { id: 'c44_co_hansen', label: 'Посмотреть на фрау Ханзен', minutes: 40, terminal: true, goto: 'c44_verdict',
        text: 'Фрау Ханзен сидит в первом ряду, прямо. Когда Уте садится, фрау Ханзен поворачивается и долго смотрит на Яннеса. Потом отворачивается. Ничего не говорит.', effects: [set44('co', 'hansen'), until44(51, 10, 45)] },
    ] }),

  S44({ id: 'c44_verdict', for: 'any', chapter: 'ch3', title: 'Решение', location: jest44, camp: { at: jest44, stock: 'c3_farm_stock', rest: false },
    text: [
      { when: v('w.c44_verdict', 'double'), text: '— Er bleibt in der Wache. Doppelte Schicht bis Weihnachten. Und wer das nächste Mal schreit, bekommt Hilfe vom ganzen Ufer, nicht von einem.\n\nОн остаётся в страже. Двойные смены до Рождества. И кто в следующий раз закричит, получит помощь от всего берега, а не от одного.' },
      { when: v('w.c44_verdict', 'yard'), text: '— Lüdemann nimmt die Schichten. Gut. Jannes bleibt in der Wache. — Брандт смотрит на {A.acc}. — Ihr habt für einen anderen gezahlt. Das merk ich mir.\n\nЛюдеманы берут смены. Хорошо. Яннес остаётся в страже. Вы заплатили за другого. Я это запомню.' },
      { when: v('w.c44_verdict', 'half'), text: '— Raus aus der Wache hätte ich gesagt. — Брандт трёт лицо. — Halbe Ration bis Neujahr. Und er steht trotzdem am Bach. Wir brauchen jeden.\n\nЯ бы сказал — вон из стражи. Половина пайка до Нового года. И всё равно стоит на ручье. Нам нужен каждый.' },
      { text: 'Брандт переходит к следующему: рву, соли, колоколу. Яннес садится. Уте держит его за рукав.' },
    ],
    actions: [
      { id: 'c44_ve_stay', label: 'Досидеть совет до конца', minutes: 60, terminal: true, goto: 'c44_nils',
        text: 'Ров до Нового года, соль — по дворам, колокол — каждый вечер в девять, проверка. Голосуют руками. Ты поднимаешь руку со всеми.', effects: [set44('ve', 'stay'), until44(51, 11, 45)] },
      { id: 'c44_ve_jannes', label: 'Подойти к Яннесу после', minutes: 60, terminal: true, goto: 'c44_nils',
        text: 'Яннес жмёт тебе руку, коротко, и говорит: «Danke. Oder nicht. Weiß ich noch nicht». Спасибо. Или нет. Ещё не знаю. Уте рядом кивает за него.', effects: [set44('ve', 'jannes'), until44(51, 11, 45)] },
      { id: 'c44_ve_brandt', label: 'Подойти к Брандту после', minutes: 60, terminal: true, goto: 'c44_nils',
        text: 'Брандт складывает листы. «Ihr habt es mir nicht leicht gemacht. Gut so». Вы мне не облегчили задачу. Так и надо. Он протягивает руку.', effects: [set44('ve', 'brandt'), npc('c16_brandt', 1), until44(51, 11, 45)] },
    ] }),

  S44({ id: 'c44_nils', for: 'any', chapter: 'ch3', title: 'Колонна', location: jest44, camp: { at: jest44, stock: 'c3_farm_stock', rest: false }, onEnter: [{ set: '$.met.c44_nils', value: true }],
    text: [
      { text: 'У ворот пожарной части — белый грузовик Красного Креста с гамбургскими номерами. Водитель, мужчина лет пятидесяти, со шрамом поперёк лба, записывает на капоте больных для колонны двадцать восьмого.' },
      { when: all(A44, nilsHelped), text: 'Ты узнаёшь шрам раньше лица. Баренфельд, первый день, серый «гольф» в фонарном столбе, монтировка. Он узнаёт тебя на секунду позже и роняет карандаш.\n\n— Du! Bahrenfeld!\n\nТы! Баренфельд!' },
      { when: all(A44, not(nilsHelped), v('A.city_crash', 'passed')), text: 'Ты узнаёшь его не сразу. Потом узнаёшь: Баренфельд, первый день, серый «гольф» в столбе, человек бьёт ладонью в стекло. Ты тогда объехал{m:|а} по тротуару. Он тебя не помнит.' },
      { when: not(all(A44, any(nilsHelped, v('A.city_crash', 'passed')))), text: '— Nils, — представляется он. — Rotes Kreuz Hamburg. Ich fahre die Kolonne.\n\nНильс. Красный Крест Гамбурга. Я веду колонну.' },
    ],
    actions: [
      { id: 'c44_ni_hug', label: 'Обнять его', when: all(A44, nilsHelped), minutes: 40, terminal: true, outcomes: [{ id: 'f', goto: 'c44_lunch' }],
        text: 'Он обнимает тебя одной рукой, как старого друга. Говорит: в тот вечер он дошёл до больницы пешком, со своим лбом. «Und jetzt fahre ich für die, die nicht gehen können». А теперь вожу тех, кто ходить не может.', effects: [set44('ni', 'hug'), w44('nils_friend', true), toFarm, until44(51, 12, 30)] },
      { id: 'c44_ni_merle', label: 'Спросить про Мерле: как там в Гамбурге с инсулином', when: merle44, minutes: 40, terminal: true, outcomes: [{ id: 'f', goto: 'c44_lunch' }],
        text: '— Im UKE gibt es Insulin. Und Strom, meistens. Und Wachen am Eingang. Rein kommt man mit dem Zettel. Raus — wenn die Brücke offen ist.\n\nВ больнице есть инсулин. И ток, почти всегда. И охрана на входе. Войти можно по бумажке. Выйти — когда откроют мост.', effects: [set44('ni', 'merle'), w44('nils_told', true), toFarm, until44(51, 12, 30)] },
      { id: 'c44_ni_back', label: 'Спросить, вернутся ли сопровождающие', minutes: 40, terminal: true, outcomes: [{ id: 'f', goto: 'c44_lunch' }],
        text: '— Ich bringe zurück, wen ich hinbringe. Wenn die Brücke offen ist, in einer Woche. — Нильс смотрит на тебя внимательно. — Das verspreche ich nicht jedem.\n\nКого отвезу, того и привезу. Если мост открыт — через неделю. Это я обещаю не каждому.', effects: [set44('ni', 'back'), toFarm, until44(51, 12, 30)] },
      { id: 'c44_ni_home', label: 'Кивнуть и пойти домой: обед', minutes: 30, terminal: true, outcomes: [{ id: 'f', goto: 'c44_lunch' }],
        text: 'Ты киваешь ему и идёшь домой через поле. Снег скрипит, солнце низко. Совет позади.', effects: [set44('ni', 'home'), toFarm, until44(51, 12, 20)] },
    ] }),

  S44({ id: 'c44_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14, onEnter: [until44(51, 12, 30)],
    text: [
      { text: 'Обед. За столом пересказывают совет на разные голоса. Хенрике слушает и не вмешивается.' },
      { when: julian44, text: 'Юлиан ест в углу, на табурете, и не пропускает ни слова.' },
    ],
    actions: [
      { id: 'c44_lu_eat', label: 'Обедать и слушать', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Суп, хлеб, кружка чая. Совет в пересказе становится громче, чем был. Ты не поправляешь.', effects: [set44('lu', 'eat'), meal('eat'), until44(51, 13, 15)] },
      { id: 'c44_lu_tell', label: 'Рассказать за столом, как было на самом деле', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Ты рассказываешь коротко и без украшений. Про Уте, про ногу Яннеса. За столом замолкают. Хенрике кивает: так.', effects: [set44('lu', 'tell'), meal('eat'), until44(51, 13, 15)] },
      { id: 'c44_lu_bread', label: 'Поесть на ходу', minutes: 30, terminal: true, outcomes: fromLunch,
        text: 'Хлеб в карман, суп залпом. День короткий.', effects: [set44('lu', 'bread'), { body: 'hunger', delta: -12 }, until44(51, 13, 0)] },
      { id: 'c44_lu_dishes', label: 'Мыть посуду, пока все говорят', minutes: 30, terminal: true, outcomes: fromLunch,
        text: 'Таз, вода, миски. За спиной пересказывают совет. Ты слушаешь, как твои же слова превращаются в чужие.', effects: [set44('lu', 'dishes'), until44(51, 13, 0)] },
    ] }),

  S44({ id: 'c44_mon_eve', for: 'any', chapter: 'ch3', title: 'Вечер понедельника', camp: kitchen14, onEnter: [until44(51, 18, 30)],
    text: [
      { text: 'Вечер. В девять у пожарной части бьёт колокол: проверка, как решили на совете. Три удара, далеко и чисто.' },
      { when: felixAround44, text: 'Феликс вернулся со рва с мозолями на обеих ладонях и гордый, как после экзамена.' },
    ],
    actions: [
      { id: 'c44_me_eat', label: 'Ужинать со всеми', minutes: 60, terminal: true, goto: 'c44_mon_night', ...tableOnly,
        text: 'Картошка, капуста, по ломтю сала. За столом тише, чем днём. Все устали от слов.', effects: [set44('me', 'eat'), meal('eat'), until44(51, 19, 30)] },
      { id: 'c44_me_plan', label: 'Обсудить за столом сочельник: кто, где, что', minutes: 60, terminal: true, goto: 'c44_mon_night', ...tableOnly,
        text: 'Курица, свечи, кто кого зовёт, кто идёт в церковь. Хенрике записывает на обороте календаря. Список выходит длинным.', effects: [set44('me', 'plan'), meal('eat'), until44(51, 19, 30)] },
      { id: 'c44_me_stove', label: 'Поесть у печи', minutes: 45, terminal: true, goto: 'c44_mon_night',
        text: 'Миска на коленях, печь за спиной. Колокол бьёт ровно в девять, и ты засыпаешь сидя, не доев.', effects: [set44('me', 'stove'), { body: 'hunger', delta: -20 }, until44(51, 19, 30)] },
      { id: 'c44_me_bell', label: 'Выйти на крыльцо послушать колокол', minutes: 45, terminal: true, goto: 'c44_mon_night', ambientDuring: mon44,
        text: 'Мороз, звёзды. Колокол бьёт три раза, и ему отвечают: где-то за полем стучат в рельс. Ещё дальше — второй. Берег на месте.', effects: [set44('me', 'bell'), until44(51, 19, 30)] },
    ] }),

  S44({ id: 'c44_mon_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14,
    text: [
      { text: 'Дом засыпает. Рядом ворочается {partner}: тоже не спится.' },
    ],
    actions: [
      { id: 'c44_mn_talk', label: 'Поговорить: про совет и про Гамбург', minutes: 30, terminal: true, goto: 'c44_tue_dawn',
        text: 'Шёпотом, лицом к лицу. Про Яннеса, про Уте, про решения, которые вы приняли друг за друга. Не со всем вы согласны. Но говорите до конца.', effects: [set44('mn', 'talk'), until44(52, 7, 0, true)] },
      { id: 'c44_mn_hold', label: 'Просто обнять и молчать', minutes: 30, terminal: true, goto: 'c44_tue_dawn',
        text: 'Слова кончились ещё на совете. Ты обнимаешь {partner.acc} и слушаешь, как выравнивается дыхание.', effects: [set44('mn', 'hold'), until44(52, 7, 0, true)] },
      { id: 'c44_mn_sleep', label: 'Сразу спать', minutes: 20, terminal: true, goto: 'c44_tue_dawn',
        text: 'Ты засыпаешь раньше, чем колокол заканчивает бить.', effects: [set44('mn', 'sleep'), { body: 'fatigue', delta: -4 }, until44(52, 7, 0, true)] },
    ] }),

  S44({ id: 'c44_tue_dawn', for: 'any', chapter: 'ch3', title: 'Вторник', camp: kitchen14, onEnter: [until44(52, 7, 0)],
    text: [
      { text: 'Вторник. Ночью шёл снег, двор белый, следов нет. Послезавтра сочельник.' },
      { when: v('w.c41_xmas', 'feast'), text: 'Хенрике выбирает курицу на Рождество. Старую рыжую, которая перестала нестись в ноябре.' },
      { when: v('w.c41_xmas', 'none'), text: 'Рождество праздновать не собирались. Но Хенрике всё равно достала из сундука скатерть.' },
    ],
    actions: [
      { id: 'c44_td_eat', label: 'Завтракать', minutes: 40, terminal: true, outcomes: fromTue, ...tableOnly,
        text: 'Каша, хлеб, по яйцу. Снег за окном всё идёт.', effects: [set44('td', 'eat'), meal('eat'), until44(52, 7, 40)] },
      { id: 'c44_td_snow', label: 'Выйти первым и протоптать тропу к колодцу', minutes: 40, terminal: true, outcomes: fromTue, ambientDuring: tue44,
        text: 'Снег по колено, мягкий. Ты протаптываешь тропу к колодцу, к курятнику, к калитке. Когда возвращаешься, на столе тебя ждёт миска каши.', effects: [set44('td', 'snow'), { body: 'hunger', delta: -10 }, until44(52, 7, 40)] },
      { id: 'c44_td_tea', label: 'Чай у окна', minutes: 30, terminal: true, outcomes: fromTue,
        text: 'Кружка, окно, снег. Лесополоса за полем белая и пустая.', effects: [set44('td', 'tea'), { body: 'hunger', delta: -8 }, until44(52, 7, 30)] },
      { id: 'c44_td_kids', label: 'Помочь детям одеться и вывести во двор', minutes: 30, terminal: true, outcomes: fromTue, ambientDuring: tue44,
        text: 'Шарфы, варежки, шапки. Дети вываливаются во двор и падают в снег спиной, раскинув руки. Ты стоишь на крыльце и считаешь: все.', effects: [set44('td', 'kids'), until44(52, 7, 30)] },
    ] }),

  S44({ id: 'c44_tue_lunch', for: 'any', chapter: 'ch3', title: 'Обед во вторник', camp: kitchen14, onEnter: [until44(52, 12, 30)],
    text: [
      { text: 'Обед. Пахнет печеньем и мокрой шерстью: в сенях сохнут варежки всего дома.' },
    ],
    actions: [
      { id: 'c44_tl_eat', label: 'Обедать со всеми', minutes: 45, terminal: true, outcomes: fromTueLunch, ...tableOnly,
        text: 'Суп, хлеб. За столом обсуждают, где ставить ёлку в сочельник и сколько свечей можно зажечь разом.', effects: [set44('tl', 'eat'), meal('eat'), until44(52, 13, 15)] },
      { id: 'c44_tl_kids', label: 'Сесть с детьми и рассказать про Рождество там, откуда ты', minutes: 45, terminal: true, outcomes: fromTueLunch, ...tableOnly,
        text: 'Дети слушают про ёлку на площади и про Деда Мороза в красной шубе. Нина переводит младшим. Хенрике слушает тоже.', effects: [set44('tl', 'kids'), meal('eat'), until44(52, 13, 15)] },
      { id: 'c44_tl_bread', label: 'Поесть на ходу', minutes: 30, terminal: true, outcomes: fromTueLunch,
        text: 'Хлеб, кружка супа у плиты. Дел к сочельнику больше, чем часов.', effects: [set44('tl', 'bread'), { body: 'hunger', delta: -12 }, until44(52, 13, 0)] },
      { id: 'c44_tl_stove', label: 'Подкинуть дров и посидеть у печи', minutes: 30, terminal: true, outcomes: fromTueLunch,
        text: 'Два полена, дверца, жар в лицо. Пять минут тишины в шумной кухне.', effects: [set44('tl', 'stove'), until44(52, 13, 0)] },
      { id: 'c44_tl_window', label: 'Посидеть у окна с миской', minutes: 30, terminal: true, outcomes: fromTueLunch,
        text: 'Снег, изгородь, лесополоса. Ты ешь медленно. Через два дня за этим окном будет сочельник.', effects: [set44('tl', 'window'), until44(52, 13, 0)] },
    ] }),

  S44({ id: 'c44_tue_eve', for: 'any', chapter: 'ch3', title: 'Вечер вторника', camp: kitchen14, onEnter: [until44(52, 18, 30)],
    text: [
      { text: 'Вечер. Снег перестал. В кухне пахнет хвоей и воском. Послезавтра сочельник, завтра — последний обычный день.' },
    ],
    actions: [
      { id: 'c44_ev_eat', label: 'Ужинать', minutes: 60, terminal: true, goto: 'c44_tue_night', ...tableOnly,
        text: 'Суп, хлеб, яблоки из погреба. Разговоры про завтра: кто куда, кто что несёт, кто с кем дежурит.', effects: [set44('ev', 'eat'), meal('eat'), until44(52, 19, 45)] },
      { id: 'c44_ev_sing', label: 'Попросить Хенрике спеть', when: henrike44, minutes: 60, terminal: true, goto: 'c44_tue_night', ...tableOnly,
        text: 'Хенрике поёт «Leise rieselt der Schnee». Тихо падает снег. Дети подпевают на последнем куплете. За окном и правда тихо падает снег.', effects: [set44('ev', 'sing'), meal('eat'), npc('henrike', 1), until44(52, 19, 45)] },
      { id: 'c44_ev_quiet', label: 'Поесть у печи и молчать', minutes: 45, terminal: true, goto: 'c44_tue_night',
        text: 'Ты сидишь у печи с миской на коленях. В кухне шумно и тепло. Ты молчишь и слушаешь.', effects: [set44('ev', 'quiet'), { body: 'hunger', delta: -20 }, until44(52, 19, 45)] },
      { id: 'c44_ev_dishes', label: 'Мыть посуду, пока все говорят', minutes: 45, terminal: true, goto: 'c44_tue_night',
        text: 'Таз, тёплая вода, миски. За спиной спорят про сочельник. Ты моешь медленно и слушаешь.', effects: [set44('ev', 'dishes'), until44(52, 19, 45)] },
      { id: 'c44_ev_wood', label: 'Принести дров на ночь', minutes: 45, terminal: true, goto: 'c44_tue_night', ambientDuring: tue44,
        text: 'Три охапки к печи. Снег перестал. Небо чистое, будет мороз.', effects: [set44('ev', 'wood'), until44(52, 19, 45)] },
    ] }),

  S44({ id: 'c44_tue_night', for: 'any', chapter: 'ch3', title: 'Перед сочельником', camp: house14,
    text: [
      { text: 'Дом засыпает. Завтра — двадцать третье. Послезавтра — сочельник.' },
    ],
    actions: [
      { id: 'c44_tn_talk', label: 'Поговорить с {partner.ins} о сочельнике', minutes: 45, terminal: true, goto: 'c44_checkpoint',
        text: 'Кто будет за столом, кто у Зеве, что подарить Хенрике. Вы говорите, пока не начинаете зевать на каждом слове.', effects: [set44('tn', 'talk'), finish, until44(52, 20, 30)] },
      { id: 'c44_tn_gift', label: 'Проверить, на месте ли подарок', minutes: 45, terminal: true, goto: 'c44_checkpoint',
        text: 'Тайник на месте. Ты ложишься и улыбаешься в темноту.', effects: [set44('tn', 'gift'), finish, until44(52, 20, 30)] },
      { id: 'c44_tn_sleep', label: 'Уснуть', minutes: 45, terminal: true, goto: 'c44_checkpoint',
        text: 'Ты засыпаешь под тиканье часов в кухне.', effects: [set44('tn', 'sleep'), { body: 'fatigue', delta: -6 }, finish, until44(52, 20, 30)] },
    ] }),

  S44({ id: 'c44_checkpoint', for: 'any', chapter: 'ch3', title: 'Вторник, вечер', checkpoint: 44, universal: false, camp: house14,
    text: [{ text: 'Половина девятого. До сочельника два дня.' }], actions: [] }),
];

