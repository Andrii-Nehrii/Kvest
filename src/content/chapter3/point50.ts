import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { colonyHigh } from './standing';
import { brothersCome, oleHome33 } from './point33';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, v, ninaFarm } from './point18';
import { kasiaLate } from './house28';
import { npc, tableOnly } from './point19';
import { felix47, henrike47, merle47 } from './point47';
import { julian45 } from './point45';

// Участок 50 «Новый год»: чт 31.12, 13:00 → КТ50 пт 1.1.2027, 16:00. Сильвестр и первый день года.
// Оба дома (или {A} один, если {B} в Эппендорфе): после обеда сборы, сумерки и первый дождь оттепели, ранний ужин; вечер и полночь —
// где решили на КТ49 (`w.c49_midnight`: огонь в Йестебурге / вдвоём на посту у Зеве / дома с оловом; {A} один — по `w.c46_silvester`);
// кто вызвался на карьер (`$.c49_mq`) — смена с десяти. После полуночи — колокол: что вышло из ельника, решают прошлые выборы:
//   пост у карьера и тихо — двоих встречают у карьера (`clean50`); пост, но ракеты Лукаса гремят — один проскальзывает к колонии
//   (`slip50`); поста нет, колония знает — стучит в запертую дверь (`door50`); поста нет и колония не знает — старика в синей шапке
//   кусают у сарая (`bite50`). Первое утро года порознь: A — Йестебург (площадь после огня, Брандт, Лукас), B — фрау Ханзен и
//   ящик её мужа (запертая находка: дата; подсказка — в той же сцене). Днём у калитки — Маркус и Лео (если живы и знакомы).
// B в Эппендорфе — `day50b.ts` (`c50_hb_*`): смена, ужин с «Dinner for One» по радио, пение, полночь на крыше или в отделении,
// утро, чемодан старика из восьмой (запертая находка: число; подсказка — в 49-й, в «Восьмой палате»), Мерле, Вольтерс.
// КТ50: карьер до весны (`c3_new_pit50`, кто на хуторе), Лео (`c3_new_leo50`), мост (`c3_new_bridge50`, порознь).
export const P50: Cond = all({ cp: 49 }, not({ cp: 50 }));
export const A50: Cond = { me: 'A' };
export const farm50 = 'hof_luedemann';
export const jest50 = 'c16_jesteburg';
export const uke50 = 'c48_uke';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
const played49: Cond = any(flag('A.c49_finished'), flag('B.c49_finished'));
export const split50: Cond = flag('w.c48_hamburg');
const home50: Cond = all(not(split50), { at: farm50 }, { partnerAt: farm50 });
const apart50: Cond = all(split50, any(all(A50, { at: farm50 }, { partnerAt: uke50 }), all(not(A50), { at: uke50 }, { partnerAt: farm50 })));
export const point50Available: Cond = all(P50, played49, up, { partner: 'active' }, any(home50, apart50));

export const henrike50 = henrike47;
export const felix50 = felix47;
export const julian50 = julian45;
export const merleHome50: Cond = all(merle47, not(flag('w.c44_hamburg_trip')));
export const alone50: Cond = all(A50, split50);
export const together50: Cond = not(split50);
export const hurt50: Cond = any(all(A50, flag('A.c47_down')), all(not(A50), flag('B.c47_down')));
export const partnerHurt50: Cond = any(all(A50, flag('B.c47_down')), all(not(A50), flag('A.c47_down')));
export const bjornAlive50: Cond = all(flag('w.c47_karsten'), not(v('w.c47_karsten', 'hidden')));
export const bjornFire50: Cond = all(bjornAlive50, any(flag('w.c49_bjorn_fire'), v('w.c48_bjorn', 'take')));
export const own50 = (key: string, value: string): Cond => v(`$.c50_${key}`, value);
/** Где полночь: решение КТ49; {A} один — по решению КТ46. */
/** Огонь вечером: решение КТ49 ({A} один — КТ46); «к полуночи домой, калитку запереть» (КТ49) отменяет огонь. */
export const atFire50: Cond = all(not(v('w.c49_tracks', 'gate')), any(v('w.c49_midnight', 'fire'), all(alone50, v('w.c46_silvester', 'go'))));
/** «Попросить Брандта: до одиннадцати, без колокола» (КТ49): огонь гасят в одиннадцать, колокола и ракет нет. */
export const short50: Cond = v('w.c49_tracks', 'short');
export const atPost50: Cond = v('w.c49_midnight', 'post');
export const atHome50: Cond = all(not(atFire50), not(atPost50));
export const volunteer50: Cond = v('$.c49_mq', 'volunteer');
/** Карьер под присмотром: свой пост по КТ49 или Брандт узнал и поставил людей. */
export const pitPost50: Cond = any(v('w.c49_tracks', 'pit'), flag('w.c49_brandt_knows'));
/** Ракеты Лукаса гремят в полночь с площади: их не нашли или нашли и оставили, а Брандт не знает. */
export const rocketsLoud50: Cond = all(not(short50), any(not(flag('w.c49_rockets_found')), all(v('w.c49_rockets', 'left'), not(flag('w.c49_brandt_rockets')))));
export const rocketDeal50: Cond = v('w.c49_rockets', 'deal');
export const clean50: Cond = all(pitPost50, not(rocketsLoud50));
export const slip50: Cond = all(pitPost50, rocketsLoud50);
/** Мика (КТ44: мешок картошки ему отнесли сами) живёт в крайнем домике колонии и не спит по ночам: он поднимет крик. */
export const mika50: Cond = v('w.c44_thief', 'feed');
export const door50: Cond = all(not(pitPost50), any(flag('w.c49_colony_told'), mika50, colonyHigh));
export const bite50: Cond = all(not(pitPost50), not(flag('w.c49_colony_told')), not(mika50), not(colonyHigh));
export const leo50: Cond = all({ npc: 'c12_leo', alive: true }, any(flag('A.met.c12_leo'), flag('B.met.c12_leo')));
export const marcus50: Cond = { npc: 'c12_marcus', alive: true };

export const rain50 = { tempC: 1, outdoor: true, wet: true };
export const mild50 = { tempC: -1, outdoor: true, wet: false };
export const night50 = { tempC: 0, outdoor: true, wet: true };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm50, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S50 = wrap(P50);
export const set50 = (key: string, value: string | boolean): Effect => ({ set: `$.c50_${key}`, value });
export const w50 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c50_${key}`, value });
/** Четверг, 31.12. */
export const until50 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(61, h, m), ...(sleeping ? { sleeping: true } : {}) });
/** Пятница, 1.1 (и ночь после полуночи). */
export const ny50 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(62, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare50: Effect = { camp: { kind: 'prepare', quiet: true } };
export const fed50 = (n = 30): Effect[] => [{ body: 'hunger', delta: -n }, { body: 'thirst', delta: -25 }];
export const trip50 = (where: string, rest: false | 'sleep' = false) => ({ at: where, stock: 'c3_farm_stock', rest });
const finish: Effect = { set: '$.c50_finished', value: true };
const heavy: Cond = not(hurt50);
const toNight = [
  { id: 'f', when: atFire50, goto: 'c50_f_square' },
  { id: 'p', when: atPost50, goto: 'c50_p_post' },
  { id: 'h', goto: 'c50_h_table' },
];
const toMidnight = [
  { id: 'f', when: all(atFire50, not(short50)), goto: 'c50_f_midnight' },
  { id: 'p', when: atPost50, goto: 'c50_p_midnight' },
  { id: 'h', goto: 'c50_h_midnight' },
];
const thenPit = (next: string) => [{ id: 'v', when: volunteer50, goto: 'c50_pit_shift' }, { id: 'n', goto: next }];
const fromNyDawn = [{ id: 'a', when: A50, goto: 'c50_na_square' }, { id: 'b', goto: 'c50_nb_hansen' }];

export const shared50: Scene[] = [
  S50({ id: 'c50_prep', for: 'any', chapter: 'ch3', title: 'Сильвестр', camp: kitchen14,
    text: [
      { text: 'Час дня, тридцать первое. На кухне пахнет луком и мокрыми валенками. Хенрике раздаёт задания, как Брандт посты: кто что несёт, кто где будет, кто с кем.' },
      { when: alone50, text: 'Хенрике спрашивает и тебя. Ты отвечаешь, и только потом замечаешь, что ответил{m:|а} за одного.' },
      { when: partnerHurt50, text: '{partner} сидит за столом, режет лук и плачет от лука. Говорит, что от лука.' },
    ],
    actions: [
      { id: 'c50_pr_soup', label: 'Отнести на площадь лук и картошку к общему котлу', when: atFire50, minutes: 90, terminal: true, goto: 'c50_dusk', ambientDuring: mild50,
        text: 'Мешок через плечо, корзина в руке. На площади жена Брандта ставит галочку против хутора Людеманов и улыбается первый раз за неделю. Котёл уже парит.', effects: [set50('pr', 'soup'), w50('soup_brought', true), until50(14, 45)] },
      { id: 'c50_pr_wood', label: 'Наколоть и сложить дров на всю ночь', when: heavy, minutes: 90, terminal: true, goto: 'c50_dusk', ambientDuring: mild50, activity: 'heavy',
        text: 'Чурбак, колун, вдох. Поленница у крыльца растёт до подоконника. Мокрый снег липнет к сапогам. Если ночь будет длинной, тепла хватит до утра.', effects: [set50('pr', 'wood'), { body: 'fatigue', delta: 6 }, until50(14, 45)] },
      { id: 'c50_pr_nap', label: 'Поспать полтора часа: ночь будет длинной', minutes: 90, terminal: true, goto: 'c50_dusk', activity: 'rest',
        text: 'Ты засыпаешь сразу и спишь без снов. Будит тебя стук капель по подоконнику: оттепель пришла раньше обещанного.', effects: [set50('pr', 'nap'), { body: 'fatigue', delta: -15 }, until50(14, 45)] },
      { id: 'c50_pr_kids', label: 'Сделать с детьми фонарики из банок', minutes: 90, terminal: true, goto: 'c50_dusk',
        text: 'Консервные банки, гвоздь, молоток. Дырочки звёздами, кругами, буквами. Внутрь — огарок. Младший выбивает на своей «Papa». Ты не спрашиваешь, только помогаешь держать банку ровно.', effects: [set50('pr', 'kids'), w50('jar_lanterns', true), until50(14, 45)] },
      { id: 'c50_pr_henrike', label: 'Помочь Хенрике с праздничным ужином', when: henrike50, minutes: 90, terminal: true, goto: 'c50_dusk',
        text: 'Карпа нет, зато есть щука из проруби, которую Феликс поймал утром. Хенрике чистит её быстро и зло, как будто щука в чём-то виновата. «Karpfen gab es früher. Hecht gibt es jetzt». Раньше был карп. Теперь щука.', effects: [set50('pr', 'henrike'), npc('henrike', 1), until50(14, 45)] },
    ] }),

  S50({ id: 'c50_dusk', for: 'any', chapter: 'ch3', title: 'Первый дождь', camp: yard14, ambient: rain50,
    text: [
      { text: 'В три начинается дождь. Мелкий, тёплый после двух недель мороза, он стучит по снегу, и снег под ним проседает и темнеет. С крыш течёт. Двор за час превращается в кашу.' },
      { text: 'Хенрике смотрит в окно и молчит. Все знают, о чём она молчит: в оттепель они просыпаются.' },
      { when: pitPost50, text: 'С поля видно: у карьера уже стоят двое с факелами, ещё не зажжёнными.' },
      { when: v('w.c43_council', 'yard'), text: 'Ваш двор ещё с декабрьского совета взял на себя лишние смены до весны. Сегодня это значит факелы и мокрую ночь.' },
      { when: flag('w.c49_gate_lamp'), text: 'Фонарь над калиткой, повешенный утром, светит на мокрую дорогу.' },
    ],
    actions: [
      { id: 'c50_du_gate', label: 'Обойти забор и калитку: всё ли держит', when: heavy, minutes: 60, terminal: true, goto: 'c50_supper', ambientDuring: rain50,
        text: 'Забор мокрый и чёрный. Одна доска у сарая шатается: ты прибиваешь её двумя гвоздями. Калитка закрывается туго, засов ходит. Вода течёт тебе в рукав.', effects: [set50('du', 'gate'), w50('fence_ok', true), until50(16, 30)] },
      { id: 'c50_du_watch', label: 'Постоять на крыльце и посмотреть на лесополосу', minutes: 60, terminal: true, goto: 'c50_supper', ambientDuring: rain50,
        text: 'Лесополоса за полем серая от дождя, без теней. Ничего не движется. Ты стоишь, пока не начинает казаться, что движется всё. Тогда уходишь в дом.', effects: [set50('du', 'watch'), until50(16, 30)] },
      { id: 'c50_du_drain', label: 'Прокопать канаву от крыльца, пока вода не залила подпол', when: heavy, minutes: 60, terminal: true, goto: 'c50_supper', ambientDuring: rain50, activity: 'heavy',
        text: 'Лопата, мокрый тяжёлый снег, под ним лёд. Канава выходит кривой, но вода уходит в сад. Подпол сухой. Ты мокрый насквозь.', effects: [set50('du', 'drain'), w50('drain', true), { body: 'fatigue', delta: 5 }, until50(16, 30)] },
      { id: 'c50_du_lamps', label: 'Зажечь фонари на окнах', minutes: 60, terminal: true, goto: 'c50_supper',
        text: 'Фонари на кухне, в сенях, над калиткой. Банки детей — по подоконникам. В сумерках хутор светится, как корабль. Издалека его видно. Ты думаешь, хорошо это или плохо, и не решаешь.', effects: [set50('du', 'lamps'), until50(16, 30)] },
    ] }),

  S50({ id: 'c50_supper', for: 'any', chapter: 'ch3', title: 'Ужин перед ночью', camp: kitchen14,
    text: [
      { text: 'Ужинают рано, в пять: кто уйдёт, кто останется, все за одним столом. Щука с картошкой, капуста, берлинеры. По глотку яичного ликёра взрослым, по глотку сиропа детям.' },
      { when: kasiaLate, text: 'Кася достаёт из кармана губную гармошку Тима и кладёт её на стол рядом со своей тарелкой. Играть не будет. Просто пусть лежит.' },
      { when: oleHome33, text: 'Оле поднимает кружку за мать. Хенрике машет на него рукой, но глаза у неё мокрые.' },
      { when: brothersCome, text: 'Дениз и Керем пришли со своей сковородой и жарят лук по-своему, с перцем. Спорят, чей Сильвестр был шумнее, стамбульский или харбургский. Хенрике запрещает спорить за едой и проигрывает.' },
      { text: 'После ужина Хенрике откашливается и говорит: «Dinner for One. Jedes Jahr. Auch dieses». Каждый год. И этот тоже. И пересказывает его по памяти, за обоих — за старую мисс Софи и за дворецкого, спотыкающегося о тигровую шкуру.' },
      { text: '— The same procedure as last year, Miss Sophie? — The same procedure as every year, James.' },
      { when: all({ npc: 'c21_lea', alive: true, at: 'hof_luedemann' }, not(flag('w.c41_lea_gone'))), text: 'Лея смеётся над тигром громче всех. Потом говорит, что дома в Сильвестр всегда смотрели «Dinner for One», с мамой и Финном. Говорит и не замолкает, как раньше, а доедает.' },
      { when: all(v('w.c39_strangers', 'barn'), not(flag('w.c40_left_army')), v('w.c41_jorg', 'stay')), text: 'Йорг поднимает кружку за Хенрике: «Sie hat uns nicht weggeschickt». Она нас не прогнала. Хенрике машет рукой, но садится прямее.' },
      { when: v('w.c41_xmas', 'none'), text: 'На Рождество не праздновали, берегли еду. Сегодня Хенрике выставляет на стол то, что берегли.' },
      { when: v('w.c41_xmas', 'feast'), text: 'Стол беднее рождественского, но за ним теснее.' },
      { when: all(flag('w.c49_bjorn_laughed'), v('w.c48_bjorn', 'take')), text: 'Бьёрн рассказывает детям, как его отец каждый Сильвестр засыпал до полуночи. Дети хохочут. Бьёрн тоже, впервые при всех.' },
    ],
    actions: [
      { id: 'c50_su_eat', label: 'Ужинать и смеяться со всеми', minutes: 60, terminal: true, goto: 'c50_out', ...tableOnly,
        text: 'Хенрике спотыкается о воображаемую шкуру четыре раза, и на четвёртый смеются даже те, кто не знает английского. Ты смеёшься так, что болит живот. Первый раз с ноября.', effects: [set50('su', 'eat'), meal('eat'), { body: 'stress', delta: -10 }, until50(18, 30)] },
      { id: 'c50_su_toast', label: 'Сказать тост за тех, кого нет за столом', minutes: 60, terminal: true, goto: 'c50_out',
        text: 'Ты встаёшь. За столом стихает. Ты говоришь коротко: за тех, кого нет. Не перечисляешь. Каждый сам знает, за кого пьёт. Хенрике поднимает рюмку выше всех.', effects: [set50('su', 'toast'), ...fed50(35), until50(18, 30)] },
      { id: 'c50_su_kids', label: 'Сидеть рядом с детьми и объяснять им шутку про тигра', minutes: 60, terminal: true, goto: 'c50_out',
        text: 'Шутку про тигра объяснить невозможно. Дети смеются всё равно, потому что смеются взрослые. Младший засыпает у тебя на коленях ещё до конца ужина.', effects: [set50('su', 'kids'), ...fed50(35), until50(18, 30)] },
      { id: 'c50_su_pour', label: 'Разливать ликёр и сироп, чтобы Хенрике посидела', minutes: 60, terminal: true, goto: 'c50_out',
        text: 'Бутылка, рюмки, детские кружки. Хенрике садится, первый раз за день, и пересказывает «Dinner for One» сидя. Ты разливаешь и смеёшься на ходу, проливая на скатерть. Пятно останется до следующего Сильвестра.', effects: [set50('su', 'pour'), ...fed50(30), until50(18, 30)] },
      { id: 'c50_su_partner', label: 'Сесть рядом с {partner.ins} и держать руку под столом', when: together50, minutes: 60, terminal: true, goto: 'c50_out', ...tableOnly,
        text: 'Под столом твоя рука находит руку {partner.gen}. Никто не видит, кроме Хенрике, которая видит всё. На тигре вы сжимаете пальцы одновременно, и смеётесь не над тигром.', effects: [set50('su', 'partner'), meal('eat'), until50(18, 30)] },
      { id: 'c50_su_bjorn', label: 'Посадить Бьёрна рядом с собой', when: bjornFire50, minutes: 60, terminal: true, goto: 'c50_out', ...tableOnly,
        text: 'Бьёрн пришёл в отцовском ремне, затянутом на последнюю дырку. Он не смеётся, но смотрит, как смеются другие, и один раз, на тигре, у него дёргается угол рта. Хенрике это видит и подкладывает ему берлинер.', effects: [set50('su', 'bjorn'), meal('eat'), w50('bjorn_dinner', true), until50(18, 30)] },
    ] }),

  S50({ id: 'c50_out', for: 'any', chapter: 'ch3', title: 'Сборы на ночь', camp: yard14, ambient: rain50,
    text: [
      { text: 'Половина седьмого. Дождь стих до мороси. У крыльца раздают факелы, фонари, термосы. Кто куда — решено ещё вчера, и всё равно все переспрашивают.' },
      { when: v('w.c49_tracks', 'gate'), text: 'К огню сегодня не идёт никто из ваших: к полуночи двор дома, калитка заперта, как решили вчера. Хенрике это одобряет молча.' },
      { text: 'Хенрике стоит в дверях и каждому уходящему говорит одно и то же: «Kommt wieder». Возвращайтесь.' },
      { when: all(ninaFarm, not(v('w.c46_silvester', 'stay'))), text: 'Нина просится к огню, к своим из Йестебурга. Хенрике отпускает её до одиннадцати, потом передумывает: до полуночи. И с тобой.' },
      { when: any(flag('w.c49_a_candles2'), flag('w.c48_a_candles')), text: 'Свечи с винзенского рынка горят в банках на подоконниках: хватило на все окна.' },
      { when: volunteer50, text: 'В десять тебе на карьер. До десяти — с остальными.' },
    ],
    actions: [
      { id: 'c50_ou_torch', label: 'Проверить факелы и спички у всех уходящих', minutes: 50, terminal: true, outcomes: toNight, ambientDuring: rain50,
        text: 'Факел, спички в жестянке, рог или свисток. У одного спички в кармане штанов, промокшие. Ты отдаёшь ему свои. Так и должно быть: одна ночь — один запас на всех.', effects: [set50('ou', 'torch'), until50(19, 30)] },
      { id: 'c50_ou_henrike', label: 'Обнять Хенрике на пороге', minutes: 50, terminal: true, outcomes: toNight,
        text: 'Хенрике сначала деревенеет, потом обнимает в ответ, коротко и сильно. Говорит в ухо: «Und pass auf die anderen auf». И присматривай за остальными. Отпускает и отворачивается к плите.', effects: [set50('ou', 'henrike'), npc('henrike', 1), until50(19, 30)] },
      { id: 'c50_ou_kids', label: 'Уложить младших, пока взрослые собираются', minutes: 50, terminal: true, outcomes: toNight,
        text: 'Младшие требуют, чтобы их разбудили в полночь. Ты обещаешь. Они не верят и засыпают с открытыми глазами, а потом закрывают и их.', effects: [set50('ou', 'kids'), until50(19, 30)] },
      { id: 'c50_ou_porch', label: 'Постоять минуту на крыльце, слушая дождь', minutes: 50, terminal: true, outcomes: toNight, ambientDuring: rain50,
        text: 'С крыши течёт, в бочках булькает, в поле что-то шуршит: тает. Из Йестебурга доносится первая проба аккордеона. Последняя ночь года начинается.', effects: [set50('ou', 'porch'), until50(19, 30)] },
    ] }),

  // ── Карьер: тем, кто вызвался ──
  S50({ id: 'c50_pit_shift', for: 'any', chapter: 'ch3', title: 'Карьер', location: 'c47_wood', camp: trip50('c47_wood'), ambient: night50,
    text: [
      { text: 'С десяти ты на краю карьера. Факел шипит под дождём, на дне ямы вода поднялась выше льда. Трое на посту: ты и двое из Йестебурга, которых ты знаешь в лицо, но не по имени.' },
      { when: flag('w.c49_pit_marked'), text: 'Внизу, у транспортёра, стоит тот, замёрзший. Он уже не замёрзший. Он поворачивает голову на свет.' },
      { text: 'Из ельника на юге тянет сыростью. Там тихо. Слишком тихо, сказал бы Яннес.' },
    ],
    actions: [
      { id: 'c50_ps_watch', label: 'Смотреть на ельник и не отводить глаз', minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Полтора часа ты смотришь в темноту под ёлками, пока глаза не начинают видеть то, чего нет. В половине двенадцатого вас сменяют. Ты идёшь к полуночи, оглядываясь.', effects: [set50('ps', 'watch'), w50('pit_watched', true), { body: 'fatigue', delta: 6 }, until50(23, 30)] },
      { id: 'c50_ps_end', label: 'Спуститься к тому, у транспортёра, пока он один', when: flag('w.c49_pit_marked'), minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50, activity: 'heavy',
        text: 'Двое светят сверху. Ты спускаешься по осыпи, и он идёт навстречу, медленно, по колено в воде. Один удар. Он падает в воду лицом вниз. Ты поднимаешься обратно, и руки трясутся до самой смены.', effects: [set50('ps', 'end'), w50('pit_end', true), { body: 'stress', delta: 6 }, { body: 'fatigue', delta: 8 }, until50(23, 30)] },
      { id: 'c50_ps_talk', label: 'Разговорить тех двоих, чтобы не заснуть', minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Один — пекарь из Йестебурга, второй — его сын. Пекарь рассказывает, как пёк к Сильвестру по двести берлинеров. Сын перебивает: триста. Спорят до смены. Ни разу не смотрят в сторону ельника, и ты понимаешь: нарочно.', effects: [set50('ps', 'talk'), until50(23, 30)] },
    ] }),

  // ── Огонь в Йестебурге ──
  S50({ id: 'c50_f_square', for: 'any', chapter: 'ch3', title: 'Огонь', location: jest50, camp: trip50(jest50), ambient: night50,
    text: [
      { text: 'В восемь Брандт поджигает кучу. Солома берётся сразу, дрова — через минуту, и огонь встаёт выше крыши гаража. Сто человек отступают на шаг и замолкают. Потом кто-то хлопает, и хлопают все.' },
      { text: 'Дождь шипит в огне и не может его погасить. Лица красные с одной стороны, мокрые с другой.' },
      { when: ninaFarm, text: 'Нина стоит у гаража рядом с Лукасом и делает вид, что ей совсем неинтересно, о чём он рассказывает.' },
      { when: flag('w.c49_julian_invited'), text: 'Юлиан пришёл с бабушкой на тележке. Бабушка в трёх одеялах смотрит на огонь, как в телевизор.' },
      { when: bjornFire50, text: 'Бьёрн стоит у самого огня, один, в отцовской куртке.' },
      { when: v('w.c44_thief', 'feed'), text: 'Мика, мальчишка из колонии, тащит к огню полено больше себя. Увидев тебя, кричит через всю площадь: «Frohes Neues!» — на два часа раньше.' },
      { when: all(bjornFire50, flag('w.c49_bjorn_photo')), text: 'Из-за пазухи у него торчит угол рамки: фотография отца. Он стоит с ней у огня, как вдвоём.' },
    ],
    actions: [
      { id: 'c50_fs_soup', label: 'Встать в очередь к котлу с мисками на всех своих', minutes: 75, terminal: true, outcomes: thenPit('c50_f_music'), ambientDuring: night50,
        text: 'Суп из всего, что принесли: картошка, капуста, кости, лук хутора Людеманов. Жена Брандта наливает до краёв. Ты несёшь миски своим по одной, обжигая пальцы. Суп вкуснее, чем должен быть.', effects: [set50('fs', 'soup'), ...fed50(40), until50(21, 15)] },
      { id: 'c50_fs_post', label: 'Пройти по кольцу постов вокруг площади', when: heavy, minutes: 75, terminal: true, outcomes: thenPit('c50_f_music'), ambientDuring: night50,
        text: 'Семь постов, на каждом факел и рог. Люди стоят спиной к огню и лицом в темноту. Им слышно, как смеются за спиной. На последнем посту Лукас: он видит тебя и отводит глаза.', effects: [set50('fs', 'post'), w50('fire_posts', true), until50(21, 15)] },
      { id: 'c50_fs_bjorn', label: 'Подойти к Бьёрну и постоять рядом', when: bjornFire50, minutes: 75, terminal: true, outcomes: thenPit('c50_f_music'), ambientDuring: night50,
        text: 'Вы стоите рядом и смотрите в огонь. Бьёрн говорит: «Papa hätte gesagt: zu viel Holz». Папа бы сказал: слишком много дров. Потом, тише: «Er hätte trotzdem geguckt». Но всё равно бы смотрел.', effects: [set50('fs', 'bjorn'), w50('bjorn_fire_talk', true), until50(21, 15)] },
      { id: 'c50_fs_julian', label: 'Принести бабушке Юлиана горячего', when: flag('w.c49_julian_invited'), minutes: 75, terminal: true, outcomes: thenPit('c50_f_music'), ambientDuring: night50,
        text: 'Бабушка пьёт суп маленькими глотками и рассказывает Юлиану про Сильвестр пятьдесят пятого, когда в Йестебурге сгорел сарай. Юлиан слышал это сто раз и слушает в сто первый.', effects: [set50('fs', 'julian'), w50('julian_fire', true), until50(21, 15)] },
      { id: 'c50_fs_watch', label: 'Смотреть на людей у огня', minutes: 75, terminal: true, outcomes: thenPit('c50_f_music'), ambientDuring: night50,
        text: 'Старики на лавках, дети на плечах у отцов, девушка с аккордеоном в чехле. Чужие с южной дороги жмутся с краю, и их зовут ближе. Брандт ходит между всеми, как хозяин свадьбы, и ни разу не садится.', effects: [set50('fs', 'watch'), until50(21, 15)] },
    ] }),

  S50({ id: 'c50_f_music', for: 'any', chapter: 'ch3', title: 'Аккордеон', location: jest50, camp: trip50(jest50), ambient: night50,
    text: [
      { text: 'В десять девушка достаёт аккордеон. Первую песню никто не поёт, вторую подпевают трое, на третьей — «Wir lagen vor Madagaskar» — поёт вся площадь, фальшиво и громко.' },
      { when: short50, text: 'Колокола в полночь не будет, и ракет тоже: Брандт согласился с вашим двором. В одиннадцать огонь гасят водой из шланга, и люди расходятся по домам с факелами.' },
      { text: 'Брандт стоит в стороне и смотрит не на огонь, а в темноту за кольцом постов.' },
    ],
    actions: [
      { id: 'c50_fm_dance', label: 'Пригласить {partner.acc} танцевать в грязи', when: together50, minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Грязь по щиколотку, дождь, аккордеон. Вы танцуете неуклюже, держась друг за друга, чтобы не упасть. Вокруг танцуют ещё пары, и все смеются над собой. В какой-то момент ты забываешь, где вы. На целую песню.', effects: [set50('fm', 'dance'), w50('danced', true), { body: 'stress', delta: -10 }, until50(23, 30)] },
      { id: 'c50_fm_sing', label: 'Петь со всеми, даже не зная слов', minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Слов ты не знаешь, мотив ловишь со второго куплета. Рядом поёт старик из колонии, громче всех и мимо нот. Вы смотрите друг на друга и поёте ещё громче.', effects: [set50('fm', 'sing'), { body: 'stress', delta: -8 }, until50(23, 30)] },
      { id: 'c50_fm_brandt', label: 'Встать рядом с Брандтом и смотреть в темноту вместе с ним', minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Брандт не поворачивает головы. Через час говорит: «Wenn heute nichts passiert, mach ich das jedes Jahr». Если сегодня ничего не случится, буду делать это каждый год. Ты не говоришь «если». Он тоже больше не говорит.', effects: [set50('fm', 'brandt'), w50('brandt_watch', true), until50(23, 30)] },
      { id: 'c50_fm_alone', label: 'Отойти к краю и подумать о {partner.pre}', when: alone50, minutes: 90, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'С края площади огонь кажется меньше, а песня — дальше. Ты думаешь о ней, на крыше или у окна, в городе, где сегодня запрещён фейерверк. Думаешь так подробно, что почти видишь.', effects: [set50('fm', 'alone'), until50(23, 30)] },
    ] }),

  S50({ id: 'c50_f_midnight', for: 'any', chapter: 'ch3', title: 'Полночь', location: jest50, camp: trip50(jest50), ambient: night50,
    text: [
      { text: 'Без пяти двенадцать Брандт поднимает руку, и площадь замолкает. Только огонь трещит и дождь шуршит.' },
      { text: 'Колокол пожарной части бьёт двенадцать раз. Медленно. На двенадцатом все кричат «Prost Neujahr!» и обнимаются с тем, кто рядом, — знакомым или нет.' },
      { when: rocketsLoud50, text: 'И тут из-за гаража с воем уходят в небо три ракеты, одна за другой: красная, зелёная, белая. Площадь ахает. Брандт поворачивается к гаражу с таким лицом, что Лукас, наверное, чувствует это спиной.' },
      { when: rocketDeal50, text: 'Далеко за деревней, у ручья, в небо уходит одна ракета. Белая. Она раскрывается беззвучно, потом доходит хлопок.' },
    ],
    actions: [
      { id: 'c50_fn_kiss', label: 'Поцеловать {partner.acc} под колокол', when: together50, minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'Губы холодные и мокрые от дождя. Кто-то рядом свистит. Вы не отрываетесь, пока колокол не затихает. С Новым годом.', effects: [set50('fn', 'kiss'), w50('kiss', 'fire'), { body: 'stress', delta: -8 }, ny50(0, 30)] },
      { id: 'c50_fn_hug', label: 'Обнять всех, кто рядом', minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'Старик из колонии, жена Брандта, незнакомая девушка с аккордеоном, мальчишка с южной дороги. Каждый говорит тебе «Prost Neujahr», и каждый — всерьёз.', effects: [set50('fn', 'hug'), ny50(0, 30)] },
      { id: 'c50_fn_north', label: 'Повернуться на север в полночь', when: alone50, minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'Ты поворачиваешься спиной к огню, лицом на север. Там темно. Ты говоришь в темноту «с Новым годом», вслух, по-русски. Никто вокруг не понимает. Это и не им.', effects: [set50('fn', 'north'), w50('a_north', true), ny50(0, 30)] },
      { id: 'c50_fn_dark', label: 'Смотреть не на небо, а в темноту за постами', minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'Все смотрят вверх. Ты смотришь туда, куда смотрит Брандт: за кольцо факелов, в поле. Поле чёрное и мокрое. Пока — пустое.', effects: [set50('fn', 'dark'), ny50(0, 30)] },
    ] }),

  // ── Пост у Зеве ──
  S50({ id: 'c50_p_post', for: 'any', chapter: 'ch3', title: 'Пост у Зеве', camp: yard14, ambient: night50,
    text: [
      { text: 'В восемь вы сменяете часового у Зеве. Он долго не верит, что его отпускают, потом жмёт обоим руки и почти бегом уходит к своим, в колонию.' },
      { text: 'Шалаш, фонарь, колокол на столбе, река подо льдом, который темнеет от дождя. Из Йестебурга далеко-далеко доносится аккордеон.' },
    ],
    actions: [
      { id: 'c50_pp_tea', label: 'Разлить чай из термоса и сесть плечом к плечу', minutes: 120, terminal: true, outcomes: thenPit('c50_p_talk'), ambientDuring: night50,
        text: 'Чай сладкий, Хенрике не пожалела сахара. Вы пьёте из одной крышки по очереди и смотрите на тот берег. Время идёт медленно и хорошо.', effects: [set50('pp', 'tea'), ...fed50(15), until50(22, 0)] },
      { id: 'c50_pp_round', label: 'Обходить берег по очереди, каждые полчаса', minutes: 120, terminal: true, outcomes: thenPit('c50_p_talk'), ambientDuring: night50,
        text: 'Сто шагов вверх по реке, сто вниз. Лёд у берега отходит от земли, между ними чёрная вода. На том берегу никого. Каждый раз, возвращаясь, ты видишь фонарь и того, кто под ним ждёт.', effects: [set50('pp', 'round'), { body: 'fatigue', delta: 4 }, until50(22, 0)] },
      { id: 'c50_pp_shelter', label: 'Залатать шалаш, пока не протёк', minutes: 120, terminal: true, outcomes: thenPit('c50_p_talk'), ambientDuring: night50,
        text: 'Лапник, мешковина, верёвка. Через полчаса внутри сухо, через час — почти тепло. Вы сидите в шалаше, как дети в домике из одеял, и смеётесь над этим.', effects: [set50('pp', 'shelter'), w50('shelter_fixed', true), until50(22, 0)] },
    ] }),

  S50({ id: 'c50_p_talk', for: 'any', chapter: 'ch3', title: 'Разговор у фонаря', camp: yard14, ambient: night50,
    text: [
      { text: 'К десяти дождь стихает до мороси. Аккордеон в Йестебурге играет что-то медленное. Самое время сказать то, что не говорится днём.' },
    ],
    actions: [
      { id: 'c50_pt_year', label: 'Вспомнить вслух этот год: с утра десятого ноября', minutes: 105, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Вы вспоминаете по очереди: сообщение в 03:52, дорогу, мост, хутор. Каждый помнит другое. Половину того, что помнит {partner}, ты не знал{m:|а}. Под конец оба молчите: всё это было за семь недель.', effects: [set50('pt', 'year'), w50('remembered', true), until50(23, 45)] },
      { id: 'c50_pt_spring', label: 'Говорить о весне: что будет, когда сойдёт снег', minutes: 105, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Огород за сараем. Колодец почистить. Может быть, свой дом, в колонии или у Тиде. Вы строите планы, как дом из кубиков, и ни один не говорит «если».', effects: [set50('pt', 'spring'), w50('spring_plans', true), until50(23, 45)] },
      { id: 'c50_pt_lead', label: 'Отлить олово прямо на посту: ложка над фонарём, вода из реки', when: flag('w.c49_lead_set'), minutes: 105, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Ты взял{m:|а} две подковки из коробки. Олово плавится над стеклом фонаря долго, потом сразу. У тебя выходит что-то вроде птицы. У {partner.gen} — что-то вроде ключа. Вы решаете, что это хорошие знаки. Других нет.', effects: [set50('pt', 'lead'), w50('lead_post', true), until50(23, 45)] },
      { id: 'c50_pt_quiet', label: 'Молчать вдвоём и слушать реку', minutes: 105, terminal: true, outcomes: toMidnight, ambientDuring: night50,
        text: 'Под льдом течёт вода, впервые за две недели слышно. Вы молчите почти два часа. Это лучший разговор за весь год.', effects: [set50('pt', 'quiet'), until50(23, 45)] },
    ] }),

  S50({ id: 'c50_p_midnight', for: 'any', chapter: 'ch3', title: 'Полночь у реки', camp: yard14, ambient: night50,
    text: [
      { text: 'Издалека, из Йестебурга, — колокол. Двенадцать ударов, еле слышных. Потом — тишина над рекой, и капли с лапника.' },
      { when: rocketsLoud50, text: 'Над Йестебургом поднимаются три ракеты: красная, зелёная, белая. Хлопки доходят через несколько секунд, раскатистые, на всю округу.' },
      { when: rocketDeal50, text: 'Над полем за деревней — одна белая ракета. Хлопок доходит не сразу.' },
    ],
    actions: [
      { id: 'c50_pm_kiss', label: 'Поцеловать {partner.acc} под далёкий колокол', minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'Фонарь, река, никого вокруг на километр. Вы целуетесь так, как не целовались с ноября: никуда не торопясь.', effects: [set50('pm', 'kiss'), w50('kiss', 'post'), { body: 'stress', delta: -10 }, ny50(0, 30)] },
      { id: 'c50_pm_bell', label: 'Ударить в колокол поста один раз — в ответ Йестебургу', minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'Один удар. Колокол поста звенит над рекой долго. Потом ты соображаешь, что колокол поста — это тревога, и в колонии могут не понять. Из темноты доносится крик Яннеса: «Alles gut?» Всё в порядке? Ты кричишь: всё. С Новым годом.', effects: [set50('pm', 'bell'), w50('post_bell', true), ny50(0, 30)] },
      { id: 'c50_pm_watch', label: 'Смотреть на тот берег, пока бьёт колокол', minutes: 30, terminal: true, goto: 'c50_bell', ambientDuring: night50,
        text: 'На двенадцатом ударе на том берегу что-то шевелится в камышах. Ты поднимаешь фонарь. Ветка. Мокрая, качается. Просто ветка.', effects: [set50('pm', 'watch'), ny50(0, 30)] },
    ] }),

  // ── Дома ──
  S50({ id: 'c50_h_table', for: 'any', chapter: 'ch3', title: 'Дома', camp: house14,
    text: [
      { text: 'Кто ушёл к огню, ушёл. В доме остались дети, Хенрике и те, кто с ними. На столе свечи, на печке чайник, на окнах банки с огарками.' },
      { when: alone50, text: 'Ты сидишь за столом рядом с пустым стулом. Хенрике ставит перед ним чашку. Ты делаешь вид, что не заметил{m:|а}.' },
      { when: partnerHurt50, text: '{partner} в кресле у печки, укрытый пледом. Зандер запретила холод, а Сильвестр не отменишь.' },
    ],
    actions: [
      { id: 'c50_ht_games', label: 'Играть с детьми в «Mensch ärgere dich nicht»', minutes: 120, terminal: true, outcomes: thenPit('c50_h_lead'),
        text: 'Доска потёртая, двух фишек не хватает, их заменяют пуговицы. Ты проигрываешь три раза подряд и злишься по-настоящему. Дети в восторге. «Mensch ärgere dich nicht» — не злись, человек.', effects: [set50('ht', 'games'), { body: 'stress', delta: -8 }, until50(22, 0)] },
      { id: 'c50_ht_henrike', label: 'Сидеть с Хенрике и слушать её Сильвестры', when: henrike50, minutes: 120, terminal: true, outcomes: thenPit('c50_h_lead'),
        text: 'Сильвестр семьдесят девятого, после снежной зимы. Сильвестр восемьдесят девятого, когда по радио говорили про Берлин и все плакали. Хенрике рассказывает и вяжет, не глядя на спицы.', effects: [set50('ht', 'henrike'), npc('henrike', 1), until50(22, 0)] },
      { id: 'c50_ht_window', label: 'Дежурить у окна: калитка, поле, лесополоса', minutes: 120, terminal: true, outcomes: thenPit('c50_h_lead'),
        text: 'Фонарь над калиткой светит на мокрую дорогу. Поле пустое. Лесополоса — чёрная полоса. Раз в полчаса ты выходишь на крыльцо и слушаешь. Только дождь.', effects: [set50('ht', 'window'), w50('home_watch', true), until50(22, 0)] },
      { id: 'c50_ht_letter', label: 'Написать {B.dat} письмо: о том, как прошёл год', when: alone50, minutes: 120, terminal: true, outcomes: thenPit('c50_h_lead'),
        text: 'Ты пишешь долго, зачёркивая. Про карьер не пишешь. Про пустой стул не пишешь. Пишешь про берлинеры с горчицей и про то, как Хенрике пересказывала «Dinner for One». Письмо выходит смешным. Ты этого и хотел{m:|а}.', effects: [set50('ht', 'letter'), w50('a_letter_ny', true), until50(22, 0)] },
    ] }),

  S50({ id: 'c50_h_lead', for: 'any', chapter: 'ch3', title: 'Олово', camp: house14,
    text: [
      { text: 'В десять Хенрике ставит на стол таз с водой и свечу. Дети выстраиваются в очередь, и каждый хочет лить дважды.' },
      { when: not(flag('w.c49_lead_set')), text: 'Набора для литья олова нет, но Хенрике нашла в сарае обрезки свинцовой трубы. Она режет их ножом, как сыр.' },
    ],
    actions: [
      { id: 'c50_hl_ship', label: 'Отлить свою фигуру: что выйдет', minutes: 90, terminal: true, outcomes: toMidnight,
        text: 'Ложка над свечой, металл течёт, шипит в воде. Ты вынимаешь фигурку. Похоже на лодку. Или на подкову. Хенрике смотрит и говорит: «Ein Schiff. Reise». Корабль. Дорога. Младший завидует: у него опять вышел гриб.', effects: [set50('hl', 'ship'), w50('lead_ship', true), until50(23, 45)] },
      { id: 'c50_hl_kids', label: 'Отдать свой кусочек младшему: пусть отольёт себе корабль', minutes: 90, terminal: true, outcomes: toMidnight,
        text: 'Младший льёт и вынимает. Не корабль. Но он объявляет, что корабль, и никто не спорит. Он засыпает с ним в кулаке ещё до полуночи.', effects: [set50('hl', 'kids'), until50(23, 45)] },
      { id: 'c50_hl_partner', label: 'Отлить фигуру за {partner.acc}', when: any(alone50, partnerHurt50), minutes: 90, terminal: true, outcomes: toMidnight,
        text: 'Ты льёшь за двоих. Выходит что-то вроде ключа. Хенрике говорит, что ключ — к новому дому. Ты кладёшь его в карман. Отдашь при встрече.', effects: [set50('hl', 'partner'), w50('lead_key', true), until50(23, 45)] },
      { id: 'c50_hl_nina', label: 'Отлить фигуру вместе с Ниной', when: ninaFarm, minutes: 90, terminal: true, outcomes: toMidnight,
        text: 'Ложку держите вдвоём. У Нины выходит что-то вроде книги. Хенрике говорит: к учёбе. Нина закатывает глаза, но фигурку прячет в карман и до полуночи трогает её пальцами.', effects: [set50('hl', 'nina'), w50('nina_lead', true), until50(23, 45)] },
      { id: 'c50_hl_watch', label: 'Смотреть, как льют другие', minutes: 90, terminal: true, outcomes: toMidnight,
        text: 'Собака, гриб, звезда, клякса. Хенрике толкует каждую и ни разу не говорит ничего плохого. Ты понимаешь, что она так делает каждый год, и сам{m:|а} начинаешь верить.', effects: [set50('hl', 'watch'), until50(23, 45)] },
    ] }),

  S50({ id: 'c50_h_midnight', for: 'any', chapter: 'ch3', title: 'Полночь дома', camp: house14,
    text: [
      { text: 'Без минуты двенадцать все выходят на крыльцо. Дождь почти перестал. Из Йестебурга — колокол, двенадцать еле слышных ударов.' },
      { when: short50, text: 'Колокола, правда, нет: Йестебург сегодня молчит, как договорились. Вы слушаете тишину вместо него.' },
      { when: all(flag('w.c45_dog'), rocketsLoud50), text: 'На первой ракете Луна вжимается в ноги детям и дрожит. Младший садится на ступеньку и обнимает её обеими руками, пока не стихнет.' },
      { when: rocketsLoud50, text: 'Над Йестебургом взлетают три ракеты, красная, зелёная, белая. Дети визжат от восторга. Хенрике сжимает перила крыльца.' },
      { when: rocketDeal50, text: 'Над полем далеко — одна белая ракета. Дети кричат «noch eine!», ещё одну. Больше не будет.' },
      { text: 'Хенрике выносит ружьё и держит его в руках, стволом вниз. Не стреляет. Просто держит. «Diesmal nicht», — говорит она. В этот раз нет.' },
    ],
    actions: [
      { id: 'c50_hm_kiss', label: 'Поцеловать {partner.acc} на крыльце', when: together50, minutes: 30, terminal: true, goto: 'c50_bell',
        text: 'На крыльце, при детях, под визг. Дети кричат «iiih!». Хенрике отворачивается, но улыбается, это видно по плечам.', effects: [set50('hm', 'kiss'), w50('kiss', 'home'), { body: 'stress', delta: -8 }, ny50(0, 30)] },
      { id: 'c50_hm_kids', label: 'Поднять младшего на руки, чтобы видел', minutes: 30, terminal: true, goto: 'c50_bell',
        text: 'Младший спросонья тяжёлый и тёплый. Он смотрит на небо над Йестебургом и спрашивает, будет ли так каждый год. Ты говоришь: да. Сам{m:|а} не зная.', effects: [set50('hm', 'kids'), ny50(0, 30)] },
      { id: 'c50_hm_henrike', label: 'Взять у Хенрике ружьё и поставить в сенях', minutes: 30, terminal: true, goto: 'c50_bell',
        text: 'Хенрике отдаёт ружьё не сразу. Потом кивает. Ты ставишь его в сенях, у двери, где и стояло. Она говорит: «Prost Neujahr» и уходит в дом первая.', effects: [set50('hm', 'henrike'), npc('henrike', 1), ny50(0, 30)] },
      { id: 'c50_hm_north', label: 'Повернуться на север', when: alone50, minutes: 30, terminal: true, goto: 'c50_bell',
        text: 'Ты стоишь лицом на север и говоришь «с Новым годом» в темноту. Хенрике слышит и делает вид, что не слышит. Потом кладёт тебе руку на плечо. Тяжёлую, тёплую.', effects: [set50('hm', 'north'), w50('a_north', true), ny50(0, 30)] },
    ] }),

  // ── После полуночи: колокол ──
  S50({ id: 'c50_bell', for: 'any', chapter: 'ch3', title: 'Колокол', camp: yard14, ambient: night50,
    text: [
      { when: clean50, text: 'Без двадцати час со стороны карьера трижды трубит рог. Потом тишина. Через полчаса по дороге проходят двое с поста: из ельника вышли двое, на свет и на колокол. Их встретили у карьера. Никто не ранен.' },
      { when: flag('w.c45_dog'), text: 'Луна залаяла в сторону поля ещё до рога. Теперь стоит у калитки, шерсть на загривке дыбом, и не уходит в дом, пока её не зовут трижды.' },
      { when: slip50, text: 'Без двадцати час со стороны карьера трубит рог, долго, тревожно. Из ельника вышли четверо, на ракеты. Троих встретили у карьера, четвёртый ушёл вдоль лесополосы. В час его догнал Яннес у забора колонии. Яннес цел, только рукав разорван.' },
      { when: all(door50, flag('w.c49_colony_told')), text: 'В час в колонии бьёт колокол. Из лесополосы вышел один и пошёл на свет окон. Ткнулся в запертую дверь крайнего домика, потом в соседнюю. Двери были закрыты: колония знала. Яннес вышел с вилами.' },
      { when: all(door50, mika50, not(flag('w.c49_colony_told'))), text: 'В час в колонии кричат. Из лесополосы вышел один, на свет окон. Первым его увидел Мика, мальчишка из крайнего домика: он не спит по ночам с тех пор, как копал ваш бурт. Он кричал на всю колонию, пока не захлопнулась последняя дверь. Старик в синей шапке, вышедший к сараю, вернулся бегом, как молодой. Яннес вышел с вилами.' },
      { when: all(door50, colonyHigh, not(mika50), not(flag('w.c49_colony_told'))), text: 'В час в колонии бьёт их собственный колокол. У Уте с декабря своя ночная смена, по двое: с тех пор, как вы не раз вставали рядом с колонией. Когда из лесополосы выходит один, двери закрыты задолго до первого домика. Яннес выходит с вилами.' },
      { when: bite50, text: 'В час в колонии кричат. Старик в синей шапке, сосед Уте, вышел к сараю по нужде, без фонаря. Из лесополосы вышел один, на свет окон. Старика укусили за руку. Яннес прибежал на крик с вилами.' },
      { when: any(atFire50, volunteer50), text: 'Ты узнаёшь об этом, уже возвращаясь на хутор.' },
      { when: all(bite50, v('w.c47_cellar', 'point')), text: 'Зандер прибегает первой: с тех пор как вы отдали в пункт банки из погреба Вальдхофа, на ваш двор она отзывается раньше других.' },
      { when: flag('w.c41_gun_rule'), text: 'Ружьё в сенях. После оттепели вы договорились: стрелять только в упор и только в крайнем случае. Сегодня случай не крайний, и от этого правила спокойнее.' },
    ],
    actions: [
      { id: 'c50_bl_colony', label: 'Бежать в колонию: может, нужны руки', when: heavy, minutes: 60, terminal: true, goto: 'c50_late', ambientDuring: night50,
        text: 'Ты прибегаешь, когда всё уже кончилось. Яннес сидит на крыльце, руки трясутся. Уте приносит ему чаю. Ты делаешь то, что можно сделать: держишь фонарь, приносишь воду, стоишь рядом.', effects: [set50('bl', 'colony'), w50('ran_colony', true), { body: 'fatigue', delta: 5 }, ny50(1, 45)] },
      { id: 'c50_bl_zander', label: 'Сбегать за доктором Зандер', when: all(heavy, bite50), minutes: 60, terminal: true, goto: 'c50_late', ambientDuring: night50,
        text: 'Зандер открывает в халате поверх свитера, ни о чём не спрашивает, берёт саквояж. У старика она промывает рану долго, очень долго. Потом садится рядом с ним на лавку и держит его за здоровую руку. Говорить ей нечего, и она не говорит.', effects: [set50('bl', 'zander'), w50('zander_night', true), ny50(1, 45)] },
      { id: 'c50_bl_zanderb', label: 'Помогать Зандер, как в ноябре в пункте', when: all(heavy, bite50, v('w.c24_duty', 'b'), { me: 'B' }), minutes: 60, terminal: true, goto: 'c50_late', ambientDuring: night50,
        text: 'Зандер, увидев тебя, молча протягивает фонарь и бинт, как в ноябре в пункте. Вы работаете вдвоём, не говоря ни слова. Старику от этого не легче. Тебе — немного. Уходя, Зандер говорит: «Wie früher». Как раньше.', effects: [set50('bl', 'zanderb'), w50('zander_b', true), ny50(1, 45)] },
      { id: 'c50_bl_kids', label: 'Остаться с детьми и закрыть калитку', minutes: 60, terminal: true, goto: 'c50_late',
        text: 'Ты закрываешь калитку на засов и садишься в кухне так, чтобы видеть дверь. Дети спят. Хенрике не спит. Вы сидите вдвоём до половины второго и не говорите ни слова.', effects: [set50('bl', 'kids'), ny50(1, 45)] },
      { id: 'c50_bl_torches', label: 'Зажечь факелы у калитки и у сарая', minutes: 60, terminal: true, goto: 'c50_late', ambientDuring: night50,
        text: 'Два факела на столбах, один у сарая. Двор в рыжем свете, тени длинные. Если что-то придёт, оно будет видно за сто шагов. Ничего не приходит.', effects: [set50('bl', 'torches'), ny50(1, 45)] },
    ] }),

  S50({ id: 'c50_late', for: 'any', chapter: 'ch3', title: 'Второй час нового года', camp: house14,
    text: [
      { text: 'Дом засыпает. Дождь снова пошёл, ровный, надолго. Под ним тает всё, что намело за две недели.' },
      { when: all(alone50, flag('w.c45_candle_sign')), text: 'Перед сном ты меняешь огарок в кухонном окне. Свеча горит для того, кто вернётся. Вы так договорились двадцать третьего.' },
      { when: bite50, text: 'В колонии горит одно окно. Там с укушенным сидят Уте и Зандер.' },
    ],
    actions: [
      { id: 'c50_lt_sleep', label: 'Спать', minutes: 30, terminal: true, goto: 'c50_ny_dawn', activity: 'rest',
        text: 'Ты засыпаешь под дождь. Первый сон в новом году — без снов.', effects: [set50('lt', 'sleep'), ny50(9, 0, true)] },
      { id: 'c50_lt_talk', label: 'Шёпотом поговорить с {partner.ins} о том, что было ночью', when: together50, minutes: 30, terminal: true, goto: 'c50_ny_dawn',
        text: 'Вы говорите в темноте, лицом друг к другу. О карьере, о колокольне, о том, что решили вчера и что надо было решить иначе. Под конец {partner} говорит: «Но мы встретили. Вместе». Это правда. Ты засыпаешь с этим.', effects: [set50('lt', 'talk'), ny50(9, 0, true)] },
      { id: 'c50_lt_dry', label: 'Развесить мокрое у печки, прежде чем лечь', minutes: 30, terminal: true, goto: 'c50_ny_dawn',
        text: 'Куртки, носки, варежки на верёвке над плитой. От них идёт пар. Утром всё будет сухим и пахнуть дымом. Ты ложишься последн{m:им|ей}.', effects: [set50('lt', 'dry'), ny50(9, 0, true)] },
      { id: 'c50_lt_window', label: 'Постоять у окна: тихо ли в стороне колонии', minutes: 30, terminal: true, goto: 'c50_ny_dawn',
        text: 'Дождь, темнота, одно окно в колонии светится. Ты смотришь, пока не начинают слипаться глаза. Ничего не меняется. Ты ложишься.', effects: [set50('lt', 'window'), ny50(9, 0, true)] },
      { id: 'c50_lt_key', label: 'Положить оловянную фигурку под подушку', when: any(flag('w.c50_lead_ship'), flag('w.c50_lead_key'), flag('w.c50_lead_post')), minutes: 30, terminal: true, goto: 'c50_ny_dawn',
        text: 'Хенрике говорит, так надо: тогда сбудется. Ты не веришь и кладёшь. На всякий случай.', effects: [set50('lt', 'key'), ny50(9, 0, true)] },
    ] }),

  // ── Первое января ──
  S50({ id: 'c50_ny_dawn', for: 'any', chapter: 'ch3', title: 'Первое января', camp: kitchen14,
    text: [
      { text: 'Девять утра, первое января. За окном дождь и туман. Снег сошёл с крыш, двор — чёрная вода с островами льда. С крыльца слышно, как ручей у дороги шумит, будто весной.' },
      { text: 'Хенрике варит кофе. Настоящий, из банки, которую берегла с ноября. «Neujahr», — говорит она, как будто это всё объясняет.' },
      { when: flag('w.c34_coffee_henrike'), text: 'Банку ей подарили вы, на Николауса. Она берегла её до сегодняшнего утра и наливает вам первым.' },
      { when: all(ninaFarm, flag('w.c23_nina_spring')), text: 'Нина стоит на крыльце и смотрит, как тает двор. Потом говорит, не оборачиваясь: «Ihr habt gesagt: wenn der Boden taut». Вы сказали: когда земля оттает. Внизу земля ещё мёрзлая, и Нина это знает. Но она запомнила.' },
      { when: bite50, text: 'Из колонии приходит Уте, серая, без сна. Старик в синей шапке ночью уснул и не проснулся. Яннес с Зандер сделали то, что надо было сделать. Уте говорит это ровно и пьёт кофе стоя.' },
      { when: slip50, text: 'Яннес заходит показать разорванный рукав. Кожа под ним цела: он проверял три раза, Уте — ещё три.' },
    ],
    actions: [
      { id: 'c50_nd_coffee', label: 'Пить кофе медленно, у окна', minutes: 45, terminal: true, outcomes: fromNyDawn,
        text: 'Кофе горький и крепкий, как надо. Ты пьёшь маленькими глотками и смотришь, как тает двор. Первое утро года. Оно выглядит как любое другое, только мокрее.', effects: [set50('nd', 'coffee'), ...fed50(15), ny50(9, 45)] },
      { id: 'c50_nd_eat', label: 'Завтракать со всеми: остатки ночи и берлинеры', minutes: 45, terminal: true, outcomes: fromNyDawn, ...tableOnly,
        text: 'Холодная щука, вчерашний хлеб, последние берлинеры. Все сонные, говорят тихо. Кто-то из детей спрашивает, наступил ли уже Новый год, если вчера был Сильвестр.', effects: [set50('nd', 'eat'), meal('eat'), ny50(9, 45)] },
      { id: 'c50_nd_yard', label: 'Выйти во двор: что натворила оттепель', minutes: 45, terminal: true, outcomes: fromNyDawn, ambientDuring: rain50,
        text: 'Двор — чёрная вода. Сарай стоит в луже, куры сидят на насесте и смотрят вниз с осуждением. Колодец вровень с краем. Ты прокапываешь сток к канаве, и вода уходит с хлюпаньем.', effects: [set50('nd', 'yard'), { body: 'fatigue', delta: 3 }, ny50(9, 45)] },
      { id: 'c50_nd_kids', label: 'Поздравить детей: они проспали полночь', minutes: 45, terminal: true, outcomes: fromNyDawn,
        text: 'Ты обещал{m:|а} разбудить и не разбудил{m:|а}. Дети обижаются ровно минуту, пока ты не рассказываешь, какой был колокол и какие были ракеты. Или как было тихо. Рассказываешь так, что им кажется — они видели сами.', effects: [set50('nd', 'kids'), ny50(9, 45)] },
      { id: 'c50_nd_barrels', label: 'Посмотреть бочки под водостоками', when: flag('w.c49_barrels'), minutes: 45, terminal: true, outcomes: fromNyDawn, ambientDuring: rain50,
        text: 'Бочки полные до краёв, вода чистая, дождевая. Хватит на стирку на неделю. Ты закрываешь их досками, чтобы не набился мусор.', effects: [set50('nd', 'barrels'), w50('rain_water', true), ny50(9, 45)] },
      { id: 'c50_nd_ute', label: 'Сесть рядом с Уте', when: bite50, minutes: 45, terminal: true, outcomes: fromNyDawn,
        text: 'Ты садишься рядом. Уте говорит, что старика звали Вилли и что он каждое утро приносил её детям по яблоку из подвала. Яблоки ещё остались. Кому их теперь, она не знает.', effects: [set50('nd', 'ute'), w50('willi_known', true), ny50(9, 45)] },
    ] }),

  S50({ id: 'c50_ny_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед в первый день года — суп из вчерашнего, разогретый. Все снова дома, мокрые, кто откуда.' },
      { when: all(kasiaLate, v('w.c32_kasia_mail', 'given')), text: 'Кася считает вслух: десятого поляки ушли из Винзена, до Щецина три недели пешком. Если дошли, письмо у мамы. Она говорит это за обедом, ни к кому не обращаясь.' },
      { when: together50, text: '{partner} садится напротив. По лицу видно: утро у {pm:него|неё} тоже было не пустым.' },
    ],
    actions: [
      { id: 'c50_nl_eat', label: 'Обедать со всеми', minutes: 45, terminal: true, goto: 'c50_ny_gate', ...tableOnly,
        text: 'Суп вчерашний и от этого гуще. Хенрике ставит на стол последнюю банку огурцов, «für das neue Jahr». Банку опустошают за три минуты.', effects: [set50('nl', 'eat'), meal('eat'), ny50(12, 45)] },
      { id: 'c50_nl_tell', label: 'Рассказать за столом, что было утром', minutes: 45, terminal: true, goto: 'c50_ny_gate',
        text: 'Ты рассказываешь коротко. Хенрике слушает, кивает, задаёт один вопрос, всегда самый точный. Дети слушают с открытыми ртами, суп остывает.', effects: [set50('nl', 'tell'), ...fed50(35), ny50(12, 45)] },
      { id: 'c50_nl_quick', label: 'Поесть быстро и выйти посмотреть, что делает оттепель', minutes: 30, terminal: true, goto: 'c50_ny_gate', ambientDuring: rain50,
        text: 'Ручей у дороги вышел из берегов и течёт поверх льда. Поле — серое озеро. Лесополоса стоит по колено в воде. Ничего не движется, кроме воды.', effects: [set50('nl', 'quick'), ...fed50(30), ny50(12, 45)] },
    ] }),

  S50({ id: 'c50_ny_gate', for: 'any', chapter: 'ch3', title: 'У калитки', camp: yard14, ambient: rain50,
    text: [
      { when: all(leo50, marcus50), text: 'В час у калитки двое: высокий мужчина и мальчик в валенках, которые ему велики. У мальчика под мышкой мокрый плюшевый заяц. Маркус и Лео.' },
      { when: all(leo50, marcus50), text: '— Frohes Neues, — говорит Маркус. Голос хриплый. — Wir kommen aus Winsen. Ich hab eine Bitte. Eine große.\n\nС Новым годом. Мы из Винзена. У меня просьба. Большая.' },
      { when: all(leo50, marcus50), text: 'Армия набирает людей на север, в Шлезвиг: работа за еду, до весны. Маркуса берут. Детей не берут. Бабушка в Целле не отвечает с декабря. Маркус смотрит не на вас, а на зайца.' },
      { when: all(leo50, marcus50, v('w.c23_guests', 'on')), text: 'Маркус смотрит на калитку, потом на вас: «Damals habt ihr uns Brot gegeben und die Tür zugemacht. Ich hab das verstanden. Ich frag trotzdem». Тогда вы дали хлеба и закрыли дверь. Я понял. Но всё равно прошу.' },
      { when: all(leo50, v('w.c23_guests', 'shed')), text: 'Лео смотрит на сарай и вдруг улыбается: там он прятался в ноябре от патруля, и там было тепло.' },
      { when: all(leo50, v('w.c23_guests', 'in')), text: 'Лео, не спрашивая, идёт к той лавке у печки, где спал в ноябре, и садится на неё, как на свою.' },
      { when: all(leo50, not(marcus50), v('w.c12_promise_A', 'promise'), A50), text: 'Ты помнишь сеновал в ноябре и своё обещание Маркусу: если что, Лео будет у бабушки. Бабушка в Целле не отвечает с декабря. Обещание — отвечает.' },
      { when: all(leo50, marcus50, v('w.c12_promise_B', 'promise'), not(A50)), text: 'Ты помнишь, что {m:пообещал|пообещала} Лео на сеновале: не отдашь его Маркусу. Теперь Маркус сам просит его оставить. Обещание вывернулось наизнанку и всё равно держит.' },
      { when: all(leo50, marcus50, flag('w.c24_marcus_three_days')), text: 'Маркус говорит: в ноябре, когда ему было плохо, вы передали ему: «Лео у нас, с ним всё в порядке». Он повторял это себе три дня. Поэтому и пришёл к вам, а не к Брандту.' },
      { when: all(leo50, v('w.c13_leo', 'drive')), text: 'Лео проходит мимо Corsa у сарая и трогает крыло ладонью, как старую лошадь: на ней его возили в Йестебург в ноябре.' },
      { when: all(leo50, not(marcus50)), text: 'В час к калитке подъезжает молоковоз дружины. Из кабины вылезает Вибке, за ней мальчик в валенках не по размеру, с мокрым плюшевым зайцем под мышкой. Лео.' },
      { when: all(leo50, not(marcus50)), text: '— Er hat nach euch gefragt, — говорит Вибке. — Jeden Tag. Seit Marcus nicht mehr da ist.\n\nОн спрашивал про вас. Каждый день. С тех пор как Маркуса нет.' },
      { when: not(leo50), text: 'В час к калитке приходит Лукас, без шапки, мокрый. Стоит и не заходит. Потом говорит: «Brandt sagt, ich soll mich entschuldigen. Ich weiß nur nicht, bei wem». Брандт говорит, чтобы я извинился. Только я не знаю, перед кем.' },
    ],
    actions: [
      { id: 'c50_ng_in', label: 'Позвать их в дом, к печке: сначала обсохнуть', when: leo50, minutes: 60, terminal: true, goto: 'c50_ny_walk',
        text: 'Лео садится у печки и ставит зайца сушиться рядом с собой, на кирпич. Хенрике даёт ему кружку молока с мёдом и ничего не спрашивает. Он пьёт и смотрит на тебя, как смотрят на тех, кого помнят.', effects: [set50('ng', 'in'), w50('leo_here', true), ny50(14, 0)] },
      { id: 'c50_ng_leo', label: 'Присесть к Лео: помнит ли он тебя', when: leo50, minutes: 60, terminal: true, goto: 'c50_ny_walk',
        text: 'Лео кивает и достаёт из кармана то, что ты когда-то ему дал{m:|а}. Он хранил. Потом говорит первое за весь разговор слово: «Bleiben?» Остаться? И сразу прячет лицо в мокрого зайца.', effects: [set50('ng', 'leo'), w50('leo_asked', true), ny50(14, 0)] },
      { id: 'c50_ng_ask', label: 'Спросить Маркуса прямо, на сколько и что будет потом', when: all(leo50, marcus50), minutes: 60, terminal: true, goto: 'c50_ny_walk',
        text: 'До весны. Потом он вернётся за Лео, если вернётся. Если нет — «dann ist er bei Leuten, die er kennt». Тогда он у людей, которых знает. Маркус говорит это спокойно. Он думал об этом не одну ночь.', effects: [set50('ng', 'ask'), w50('marcus_north', true), ny50(14, 0)] },
      { id: 'c50_ng_wiebke', label: 'Спросить Вибке, что с Маркусом', when: all(leo50, not(marcus50)), minutes: 60, terminal: true, goto: 'c50_ny_walk',
        text: 'Вибке отводит глаза. В Винзене Маркуса забрал карантин: жар. Потом его не стало. Лео не знает, как. Ему сказали — уехал. «Er weiß es trotzdem. Kinder wissen das». Он всё равно знает. Дети знают.', effects: [set50('ng', 'wiebke'), w50('leo_orphan', true), ny50(14, 0)] },
      { id: 'c50_ng_lukas', label: 'Позвать Лукаса в дом', when: not(leo50), minutes: 60, terminal: true, goto: 'c50_ny_walk',
        text: 'Лукас садится на край лавки и мнёт шапку. Хенрике даёт ему кофе. Он пьёт и вдруг говорит: «Wenn wegen mir einer...» Если из-за меня кто-то… И не договаривает. Ему шестнадцать, и он впервые понял, что взрослые решения — это такие.', effects: [set50('ng', 'lukas'), w50('lukas_sorry', true), ny50(14, 0)] },
      { id: 'c50_ng_lukas2', label: 'Сказать Лукасу: «Ты ни перед кем. Но запомни»', when: not(leo50), minutes: 60, terminal: true, goto: 'c50_ny_walk', ambientDuring: rain50,
        text: 'Лукас кивает и уходит, не обернувшись. У калитки останавливается и говорит в дождь: «Nächstes Jahr keine Raketen». В следующем году без ракет. Ты веришь. Почти.', effects: [set50('ng', 'lukas2'), w50('lukas_sorry', true), ny50(14, 0)] },
    ] }),

  S50({ id: 'c50_ny_walk', for: 'any', chapter: 'ch3', title: 'После ночи', camp: yard14, ambient: rain50,
    text: [
      { text: 'В два дождь ненадолго стихает. Хенрике говорит, не глядя: надо сходить посмотреть. Все и так знают, куда.' },
      { when: clean50, text: 'У карьера догорает костёр из шпал. Пост сменился, люди с факелами стоят спиной к огню и лицом к ельнику.' },
      { when: slip50, text: 'По тропе вдоль лесополосы видны следы ночи: затоптанный снег, вилы, воткнутые в землю у забора колонии.' },
      { when: door50, text: 'В колонии на двери крайнего домика уже новая доска поперёк: хозяйка прибила её утром, хотя никто не просил.' },
      { when: bite50, text: 'За крайними домиками колонии — свежий холмик, обложенный камнями. На колышке синяя шапка.' },
    ],
    actions: [
      { id: 'c50_nw_pit', label: 'Дойти до карьера и посмотреть самому', when: heavy, minutes: 45, terminal: true, goto: 'c50_ny_after', ambientDuring: rain50,
        text: 'Карьер наполовину залит водой. По краю следы — старые, ночные, сегодняшние, всё смешалось в кашу. Часовой кивает тебе и говорит: «Bei Regen hört man nichts». В дождь ничего не слышно. Это хуже, чем при морозе.', effects: [set50('nw', 'pit'), w50('saw_pit_day', true), ny50(14, 45)] },
      { id: 'c50_nw_colony', label: 'Зайти в колонию к Уте', minutes: 45, terminal: true, goto: 'c50_ny_after', ambientDuring: rain50,
        text: 'Уте варит суп на всех, как обещала, только теперь он не к празднику. Дети едят молча. Уте наливает и тебе, не спрашивая, и садится рядом, впервые за день.', effects: [set50('nw', 'colony'), ...fed50(20), ny50(14, 45)] },
      { id: 'c50_nw_tiede', label: 'Пройти мимо двора Тиде', minutes: 45, terminal: true, goto: 'c50_ny_after', ambientDuring: rain50,
        text: 'Двор Тиде под дождём. У крыльца сапоги, у сарая куриный помёт смыло. Следов чужих нет. Ты обходишь дом и ставишь на место упавшую доску забора.', effects: [set50('nw', 'tiede'), ny50(14, 45)] },
      { id: 'c50_nw_stay', label: 'Остаться: кому-то надо быть дома', minutes: 45, terminal: true, goto: 'c50_ny_after',
        text: 'Ты остаёшься с детьми и печкой. Они возвращаются через час, мокрые, и рассказывают коротко. Ты слушаешь и ставишь чайник.', effects: [set50('nw', 'stay'), ny50(14, 45)] },
    ] }),

  S50({ id: 'c50_ny_after', for: 'any', chapter: 'ch3', title: 'Дождь', camp: kitchen14,
    text: [
      { text: 'Дождь не перестаёт весь день. Дом пахнет мокрой шерстью, кофе и печкой. Двор за окном исчезает в тумане.' },
      { when: all(A50, flag('w.c45_spring_warn')), text: 'Ты вспоминаешь Бернда в Драге и его палец на столе: дамба, низина, канавы. Весной вода пойдёт туда, где её не ждут. До Эльбы отсюда далеко, но ручей у дороги уже вышел из берегов.' },
      { when: leo50, text: 'Лео спит на лавке, укрытый курткой Хенрике. Заяц высох и лежит у него на груди.' },
    ],
    actions: [
      { id: 'c50_na2_wash', label: 'Постирать в дождевой воде, пока её много', when: heavy, minutes: 45, terminal: true, goto: 'c50_ny_dusk', activity: 'moderate',
        text: 'Таз, мыло, дождевая вода, мягкая, как в детстве. Бельё развешано по всей кухне, с него капает. Хенрике ворчит и подставляет под каждую верёвку миску.', effects: [set50('na2', 'wash'), ny50(15, 30)] },
      { id: 'c50_na2_sleep', label: 'Поспать: ночь была короткой', minutes: 45, terminal: true, goto: 'c50_ny_dusk', activity: 'rest',
        text: 'Ты засыпаешь под стук дождя по крыше и просыпаешься в сумерках. Первый день года проспан на треть. Это лучшее, что с ним можно было сделать.', effects: [set50('na2', 'sleep'), { body: 'fatigue', delta: -15 }, ny50(15, 30)] },
      { id: 'c50_na2_talk', label: 'Обсудить с {partner.ins} то, что придётся решать', when: together50, minutes: 45, terminal: true, goto: 'c50_ny_dusk',
        text: 'Вы сидите у печки и говорите вполголоса. О карьере. О том, кто будет стоять там в оттепель. О Лео, если он здесь. Решения не принимаете: их принимают вечером, вдвоём, как всегда.', effects: [set50('na2', 'talk'), ny50(15, 30)] },
      { id: 'c50_na2_job', label: 'Собрать сумку на первую январскую смену в Винзене', when: all(not(A50), together50, any(v('w.c43_job', 'yes'), v('w.c43_job', 'part'))), minutes: 45, terminal: true, goto: 'c50_ny_dusk',
        text: 'Работа в пункте Красного Креста в Винзене, как решили перед Рождеством: смена с понедельника. Ты складываешь халат, бинты из своих, термос, хлеб. Хенрике заворачивает тебе в бумагу два берлинера и говорит: «Für die Kolleginnen». Для коллег.', effects: [set50('na2', 'job'), w50('b_jan_shift', true), ny50(15, 30)] },
      { id: 'c50_na2_kids', label: 'Читать детям вслух единственную книгу в доме', minutes: 45, terminal: true, goto: 'c50_ny_dusk',
        text: '«Die kleine Hexe». Маленькая ведьма. Ты читаешь по-немецки медленно, спотыкаясь, дети поправляют произношение. Через двадцать страниц ты уже не спотыкаешься.', effects: [set50('na2', 'kids'), ny50(15, 30)] },
    ] }),

  S50({ id: 'c50_ny_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки первого дня', camp: yard14, ambient: rain50,
    text: [
      { text: 'В четыре уже смеркается. Дождь редеет. На посту у Зеве зажигают фонарь, у карьера — факел. В новом году всё как в старом: посты, печка, вода.' },
    ],
    actions: [
      { id: 'c50_nk_post', label: 'Отнести на пост у Зеве горячего', when: heavy, minutes: 30, terminal: true, goto: 'c50_checkpoint', ambientDuring: rain50,
        text: 'Термос, хлеб, кусок щуки. Часовой благодарит так, будто ты принёс{m:|ла} ему весну. Река шумит подо льдом, лёд уже серый и тонкий.', effects: [set50('nk', 'post'), finish, ny50(16, 0)] },
      { id: 'c50_nk_porch', label: 'Постоять на крыльце в первых сумерках года', minutes: 30, terminal: true, goto: 'c50_checkpoint', ambientDuring: rain50,
        text: 'Сумерки синие и мокрые. Где-то каркает ворона. Год начался, и ничего не кончилось. Ты думаешь, что это, наверное, и есть хорошая новость.', effects: [set50('nk', 'porch'), finish, ny50(16, 0)] },
      { id: 'c50_nk_lamp', label: 'Зажечь лампу на кухне и сесть ждать вечера', minutes: 30, terminal: true, goto: 'c50_checkpoint',
        text: 'Лампа, стол, чашка. Хенрике садится напротив с вязанием. Вы ждёте вечера вместе, как ждут поезда, который точно придёт.', effects: [set50('nk', 'lamp'), finish, ny50(16, 0)] },
    ] }),

  S50({ id: 'c50_checkpoint', for: 'any', chapter: 'ch3', title: 'Новый год', checkpoint: 50, universal: false, camp: house14,
    text: [{ text: 'Четыре часа дня. Первое января две тысячи двадцать седьмого года.' }], actions: [] }),
];
