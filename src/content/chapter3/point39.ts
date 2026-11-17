import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { v } from './point18';
import { evaHere, npc, tableOnly } from './point19';
import { brothersCome, eldersCome, oleHome33 } from './point33';
import { tobias36 } from './point36';

// Участок 39: пятница 11.12, 07:00 → КТ39 суббота 12.12, 20:00. Жребий: запертая находка (B). План — STOCK_PLAN.md §10.4.
// Дом после десятого: новые люди (Мерле, её родители — или пустое место), инсулин, армия уходит раньше срока, Лея и Берген,
// ночное дежурство у Зеве (по КТ38), совет дворов в воскресенье. Прогноз на вторник — оттепель (первое предупреждение к 40-й).
// Находка B — сундук на чердаке, кодовый замок; подсказка — день рождения Оле, седьмое марта (Хенрике за завтраком).
export const P39: Cond = all({ cp: 38 }, not({ cp: 39 }));
export const A39: Cond = { me: 'A' };
export const B39: Cond = { me: 'B' };
export const farm39 = 'hof_luedemann';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point39Available: Cond = all(P39, { at: farm39 }, { partnerAt: farm39 }, up, { partner: 'active' }, flag('w.c38_watch'));
export const own39 = (key: string, value: string): Cond => v(`$.c39_${key}`, value);

export const merleFarm39: Cond = all(v('w.c38_merle', 'farm'), { npc: 'merle', alive: true });
export const merleNorth39: Cond = v('w.c38_merle', 'north');
export const parents39: Cond = flag('w.c38_parents');
export const watchTonight39: Cond = v('w.c38_watch', 'tomorrow');
export const army39: Cond = all(v('w.c37_leave', 'army'), tobias36);
export const henrike39: Cond = { npc: 'henrike', alive: true, at: farm39 };
export const oleDead39: Cond = flag('w.c27_ole_last');
export const pens39 = (n: number): Cond => ({ stocked: 'c21_insulin', qty: n, at: 'c3_farm_stock' });
export const bed39 = (x: string): Cond => v('w.c38_bed', x);

export const frost39 = { tempC: -7, outdoor: true, wet: false };
export const night39 = { tempC: -10, outdoor: true, wet: false };
/** Шалаш дежурных у Зеве: еловые ветки, термос, костерок в ведре. */
export const shelter39 = { tempC: -2, outdoor: false, wet: false };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm39, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S39 = wrap(P39);
export const set39 = (key: string, value: string | boolean): Effect => ({ set: `$.c39_${key}`, value });
export const w39 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c39_${key}`, value });
/** День 41 — пятница 11.12, день 42 — суббота 12.12. */
export const until39 = (d: 41 | 42, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare39: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c39_finished', value: true };
const fromDawn = [{ id: 'a', when: A39, goto: 'c39_a_chores' }, { id: 'b', goto: 'c39_b_merle' }];
const fromLunch = [{ id: 'a', when: A39, goto: 'c39_a_lea' }, { id: 'b', goto: 'c39_b_zander' }];
const fromDusk = [{ id: 'w', when: watchTonight39, goto: 'c39_watch' }, { id: 'a', when: A39, goto: 'c39_a_evening' }, { id: 'b', goto: 'c39_b_evening' }];
const fromSat = [{ id: 'a', when: A39, goto: 'c39_a_sat' }, { id: 'b', goto: 'c39_b_sat' }];
const fromLunch2 = [{ id: 'a', when: A39, goto: 'c39_a_council' }, { id: 'b', goto: 'c39_b_henrike' }];

export const shared39: Scene[] = [
  // ═════════════ Пятница ═════════════
  S39({ id: 'c39_dawn', for: 'any', chapter: 'ch3', title: 'Пятница', camp: kitchen14,
    text: [
      { text: 'Минус семь, пасмурно. В кухне тесно: за столом сидят на лавках по двое. Хенрике варит кашу в самой большой кастрюле.' },
      { when: merleFarm39, text: 'Мерле сидит с краю, обхватив кружку двумя руками. Перед едой она отходит к окну и делает укол в живот, быстро, не морщась. Нина смотрит во все глаза. Мерле подмигивает ей.' },
      { when: parents39, text: 'Биргит режет хлеб рядом с Хенрике. Они не договаривались, кто что делает, но уже не мешают друг другу. Уве у окна чинит чью-то пряжку.' },
      { when: merleNorth39, text: 'Место, которое Хенрике вчера освободила для Мерле, пустое. Хенрике не убрала лишнюю кружку.' },
      { when: oleHome33, text: 'Оле листает календарь на стене. Хенрике говорит, не оборачиваясь: «Am siebten März wird er achtundzwanzig. Wenn wir den März sehen». Седьмого марта ему двадцать восемь. Если доживём до марта.' },
      { when: oleDead39, text: 'Хенрике смотрит на календарь на стене. Говорит, ни к кому не обращаясь: «Am siebten März wäre er achtundzwanzig geworden». Седьмого марта ему было бы двадцать восемь.' },
      { when: all(not(oleHome33), not(oleDead39)), text: 'Хенрике смотрит на календарь на стене, где седьмое марта обведено красным. День рождения Оле. «Wenn er dann hier ist», — говорит она. Если он тогда будет здесь.' },
    ],
    actions: [
      { id: 'c39_dw_eat', label: 'Завтракать со всеми', minutes: 45, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Каша, хлеб, молоко. Разговоры перебивают друг друга. Впервые за неделю за столом кто-то смеётся долго.', effects: [set39('dw', 'eat'), meal('eat'), until39(41, 8, 0)] },
      { id: 'c39_dw_merle', label: 'Сесть рядом с Мерле', when: merleFarm39, minutes: 45, terminal: true, outcomes: fromDawn, ...tableOnly,
        text: 'Мерле двигается на лавке, освобождая место. Говорит тихо: «Eure Kuh ist größer als ich dachte». Ваша корова больше, чем я думала. Шутит. Значит, освоилась.', effects: [set39('dw', 'merle'), meal('eat'), { if: { npc: 'merle', alive: true }, then: [{ npc: 'merle', trust: 1 }] }, until39(41, 8, 0)] },
      { id: 'c39_dw_help', label: 'Помогать Хенрике раздавать', when: henrike39, minutes: 45, terminal: true, outcomes: fromDawn,
        text: 'Ты разливаешь кашу по мискам, Хенрике следит, чтобы никому не досталось меньше. Сама ты ешь {m:последним|последней}, стоя у плиты.', effects: [set39('dw', 'help'), meal('eat'), npc('henrike', 1), until39(41, 8, 0)] },
    ] }),

  S39({ id: 'c39_lunch', for: 'any', chapter: 'ch3', title: 'Обед', camp: kitchen14, onEnter: [until39(41, 12, 30)],
    text: [
      { text: 'Обед. Суп, хлеб. За столом считают: сколько ртов, сколько дров, сколько дней до весны.' },
      { when: parents39, text: 'Уве говорит мало, но когда говорит, все замолкают: он считает дрова в кубометрах и выходит, что до февраля.' },
      { when: brothersCome, text: 'Дениз и Керем спорят, ехать ли в понедельник на склад казармы. Керем говорит: там будет весь округ. Дениз: тем более.' },
    ],
    actions: [
      { id: 'c39_lu_eat', label: 'Есть со всеми', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Суп горячий. Ты ешь и слушаешь. Цифры за столом страшные, но голоса спокойные.', effects: [set39('lu', 'eat'), meal('eat'), until39(41, 13, 45)] },
      { id: 'c39_lu_count', label: 'Предложить считать на бумаге, а не в уме', minutes: 45, terminal: true, outcomes: fromLunch, ...tableOnly,
        text: 'Хенрике приносит тетрадь, Уве или Оле — карандаш. Через полчаса на листе таблица: еда, дрова, вода, по неделям. Внизу итог. Его никто не читает вслух.', effects: [set39('lu', 'count'), meal('eat'), w39('table', true), until39(41, 13, 45)] },
      { id: 'c39_lu_quick', label: 'Поесть быстро и уйти к делам', minutes: 30, terminal: true, outcomes: fromLunch,
        text: 'Миску к окну, хлеб в карман. Дела не ждут.', effects: [set39('lu', 'quick'), meal('eat'), until39(41, 13, 45)] },
    ] }),

  S39({ id: 'c39_dusk', for: 'any', chapter: 'ch3', title: 'Сумерки', camp: yard14, ambient: frost39, onEnter: [until39(41, 16, 30)],
    text: [
      { text: 'Половина пятого. Темнеет. Над насыпью видно, как по дороге на север идёт ещё одна армейская колонна: огни, огни, огни.' },
      { when: watchTonight39, text: 'Сегодня ночью ваш двор дежурит у Зеве. С десяти до половины первого, потом сменят.' },
    ],
    actions: [
      { id: 'c39_du_supper', label: 'Поужинать и готовиться к ночи', minutes: 90, terminal: true, outcomes: fromDusk, ...tableOnly,
        text: 'Ужин ранний, картошка с капустой. Хенрике следит, чтобы все легли пораньше: завтра суббота, работы не меньше.', effects: [set39('du', 'supper'), meal('eat'), until39(41, 18, 30)] },
      { id: 'c39_du_count', label: 'Пересчитать машины в колонне', minutes: 60, terminal: true, outcomes: fromDusk, ambientDuring: frost39,
        text: 'Ты стоишь у ворот и считаешь. Сорок две машины. Последняя — бензовоз. После неё дорога пустая.', effects: [set39('du', 'count'), w39('convoy_counted', true), meal('eat'), until39(41, 18, 30)] },
    ] }),

  S39({ id: 'c39_watch', for: 'any', chapter: 'ch3', title: 'Дежурство', camp: yard14, safe: false, ambient: shelter39, onEnter: [until39(41, 22, 0)],
    text: [
      { text: 'Десять вечера. Пост у Зеве: шалаш из еловых веток на берегу, термос, колокол на столбе. Звёзды. Мороз минус десять. Лёд на ручье трещит сам по себе.' },
      { when: v('w.c37_signal', 'bell'), text: 'Колокол с хлева висит у ворот хутора. Отсюда до него триста метров.' },
      { text: 'Около полуночи на льду ниже по течению — тень. Медленная. Идёт, падает, встаёт. К берегу.' },
    ],
    actions: [
      { id: 'c39_wa_signal', label: 'Дать сигнал и ждать подмоги', minutes: 60, terminal: true, goto: 'c39_watch2', ambientDuring: shelter39,
        text: 'Ты бьёшь в колокол на столбе, три раза. Через десять минут с хутора бегут двое с фонарями. Тень к тому времени уже на берегу, у лесополосы. Её находят лежащей в снегу: мороз сделал своё.', effects: [set39('wa', 'signal'), w39('watch_signal', true), until39(42, 0, 30)] },
      { id: 'c39_wa_go', label: 'Пойти навстречу с фонарём и ломом', minutes: 45, risky: true, terminal: true, goto: 'c39_watch2', ambientDuring: night39,
        outcomes: [
          { id: 'ok', check: { traits: ['strength', 'agility'], difficulty: 3, uses: ['mobility'] },
            text: 'Он поднимает голову на свет медленно, как во сне. Ты бьёшь один раз. Он падает лицом в снег у самой воды. Ты стоишь и смотришь, пока руки не перестают дрожать.',
            effects: [set39('wa', 'go'), { body: 'stress', delta: 6 }, until39(42, 0, 30)] },
          { id: 'ice',
            text: 'Ты спускаешься к воде, и лёд у берега проламывается. Нога в воде по колено. Он рядом, тянется, медленно. Ты бьёшь ломом, не глядя, раз, другой. Он падает. Ты выбираешься на берег. Нога горит от холода, сапог полон воды.',
            effects: [set39('wa', 'ice'), { body: 'stress', delta: 9 }, { body: 'fatigue', delta: 6 }, w39('wet_watch', true), until39(42, 0, 30)] },
        ] },
      { id: 'c39_wa_hide', label: 'Затаиться и смотреть, куда пойдёт', minutes: 60, terminal: true, goto: 'c39_watch2', ambientDuring: shelter39,
        text: 'Ты не дышишь. Тень выбирается на берег, стоит, качаясь, и уходит вдоль ручья вниз, к соседям. Ты отмечаешь место. Утром надо будет сказать.', effects: [set39('wa', 'hide'), w39('watch_saw_pass', true), until39(42, 0, 30)] },
    ] }),

  S39({ id: 'c39_watch2', for: 'any', chapter: 'ch3', title: 'Смена', camp: house14,
    text: [
      { text: 'Половина первого. Тебя сменяют Дениз или Оле, сонные, с термосом. Ты возвращаешься в дом по тропе, мимо проволоки с банками.' },
      { text: 'Небо на западе затянуто. Ветер сменился: дует с запада, сырой. Пахнет не морозом.' },
    ],
    actions: [
      { id: 'c39_w2_sleep', label: 'Сразу спать', minutes: 30, terminal: true, goto: 'c39_sat',
        text: 'Ты падаешь на кровать, не раздеваясь. Ноги не согреваются долго. Потом согреваются.', effects: [set39('w2', 'sleep'), until39(42, 8, 0, true)] },
      { id: 'c39_w2_tea', label: 'Выпить горячего на кухне и записать, что видел{m:|а}', minutes: 30, terminal: true, goto: 'c39_sat',
        text: 'Кухня тёплая, печь ещё не остыла. Ты пишешь на листке у двери: время, место, что видел{m:|а}. Для Брандта. Потом спать.', effects: [set39('w2', 'tea'), w39('watch_log', true), until39(42, 8, 0, true)] },
    ] }),

  // ═════════════ Суббота ═════════════
  S39({ id: 'c39_sat', for: 'any', chapter: 'ch3', title: 'Суббота', camp: kitchen14, onEnter: [until39(42, 8, 0)],
    text: [
      { text: 'Суббота, восемь утра. Минус три: потеплело за ночь. С крыши капает в одном месте, над крыльцом. Хенрике смотрит на капель и хмурится.' },
      { when: merleNorth39, text: 'Радио Красного Креста, утренние сообщения. Под конец: «Aus Ahrensburg, für den Lüdemann-Hof, von Merle: Ich lebe. Spritzen reichen. Kuss». Из Аренсбурга, хутору Людеманов, от Мерле: я жива. Уколов хватает. Целую.' },
      { when: merleFarm39, text: 'Мерле в кухне учит Нину рисовать корову. Корова у Нины выходит похожей на Хенрике. Обе смеются.' },
      { when: watchTonight39, text: 'После ночи у Зеве глаза слипаются. Кофе не помогает.' },
    ],
    actions: [
      { id: 'c39_sa_eat', label: 'Завтракать', minutes: 45, terminal: true, outcomes: fromSat, ...tableOnly,
        text: 'Хлеб, молоко, яйцо на двоих. Суббота. За окном капает.', effects: [set39('sa', 'eat'), meal('eat'), until39(42, 9, 0)] },
      { id: 'c39_sa_drip', label: 'Спросить Хенрике, почему она хмурится на капель', when: henrike39, minutes: 45, terminal: true, outcomes: fromSat, ...tableOnly,
        text: '— Wenn es taut, werden sie wach. Die im Tal. — Хенрике вытирает руки о фартук. Когда тает, они просыпаются. Те, во впадине. — Mein Vater hat immer gesagt: der Winter ist der beste Wachhund. Er hat nie gesagt, warum.\n\nОтец всегда говорил: зима — лучший сторожевой пёс. Никогда не объяснял почему.', effects: [set39('sa', 'drip'), w39('thaw_warned', true), meal('eat'), until39(42, 9, 0)] },
      { id: 'c39_sa_sleep', label: 'Доспать ещё час', minutes: 60, activity: 'rest', terminal: true, outcomes: fromSat,
        text: 'Ты ложишься и засыпаешь сразу. Тебя будит запах кофе и голос Нины за стенкой.', effects: [set39('sa', 'sleep'), { body: 'fatigue', delta: -8 }, until39(42, 9, 15)] },
    ] }),

  S39({ id: 'c39_lunch2', for: 'any', chapter: 'ch3', title: 'Субботний обед', camp: kitchen14, onEnter: [until39(42, 12, 30)],
    text: [
      { text: 'Обед. Хенрике зарезала курицу: суббота, народу много. Суп с лапшой, которую Биргит или Эва раскатала утром.' },
      { when: evaHere, text: 'Эва ест молча. Если она едет с армией, то в понедельник вечером — к Тобиасу.' },
      { when: eldersCome, text: 'Петерсен рассказывает про наводнение шестьдесят второго в третий раз. Фрау Кёрнер не поправляет его ни разу.' },
    ],
    actions: [
      { id: 'c39_l2_eat', label: 'Есть и хвалить суп', minutes: 45, terminal: true, outcomes: fromLunch2, ...tableOnly,
        text: 'Суп настоящий, жирный, с курицей. Ты хвалишь, Хенрике отмахивается, но подкладывает ещё.', effects: [set39('l2', 'eat'), meal('eat'), npc('henrike', 1), until39(42, 13, 45)] },
      { id: 'c39_l2_tea', label: 'Выпить чаю с хлебом у плиты', minutes: 30, terminal: true, outcomes: fromLunch2,
        text: 'Ты пьёшь чай стоя и жуёшь хлеб. За столом и так тесно.', effects: [set39('l2', 'tea'), { body: 'hunger', delta: -8 }, until39(42, 13, 45)] },
      { id: 'c39_l2_kids', label: 'Отдать детям свою курицу', minutes: 45, terminal: true, outcomes: fromLunch2, ...tableOnly,
        text: 'Ты перекладываешь мясо из своей миски Нине. Она делает вид, что не заметила, и съедает всё.', effects: [set39('l2', 'kids'), meal('eat'), { body: 'hunger', delta: 6 }, until39(42, 13, 45)] },
    ] }),

  S39({ id: 'c39_radio', for: 'any', chapter: 'ch3', title: 'Прогноз', camp: kitchen14, onEnter: [until39(42, 16, 0)],
    text: [
      { text: 'Четыре часа. Хенрике включает приёмник на прогноз: его теперь читают по армейской частоте, коротко.' },
      { text: '— …ab Dienstag Tauwetter. Plus drei bis plus fünf Grad, Regen, in der Nacht zum Mittwoch Sturmböen.\n\nСо вторника оттепель. От плюс трёх до плюс пяти, дождь, в ночь на среду штормовые порывы.' },
      { text: 'Хенрике выключает приёмник и долго стоит у окна.' },
    ],
    actions: [
      { id: 'c39_ra_plan', label: 'Сказать: значит, к вторнику надо быть готовыми', minutes: 30, terminal: true, goto: 'c39_supper',
        text: 'Хенрике кивает. «Bretter vor die Stallfenster. Und keiner geht nachts allein raus». Доски на окна хлева. И ночью никто не выходит один. Она говорит это всем, но смотрит на тебя.', effects: [set39('ra', 'plan'), w39('thaw_plan', true), until39(42, 16, 45)] },
      { id: 'c39_ra_ask', label: 'Спросить: что будет со льдом на Зеве', minutes: 30, terminal: true, goto: 'c39_supper',
        text: '— Weg. Und mit ihm alles, was drauf stand, — говорит Хенрике. Уйдёт. И с ним всё, что на нём стояло. Ты думаешь о вмёрзшем у камышей.', effects: [set39('ra', 'ask'), w39('thaw_warned', true), until39(42, 16, 45)] },
      { id: 'c39_ra_quiet', label: 'Промолчать', minutes: 20, terminal: true, goto: 'c39_supper',
        text: 'Ты молчишь. В кухне слышно только, как капает с крыши за окном.', effects: [set39('ra', 'quiet'), until39(42, 16, 30)] },
    ] }),

  S39({ id: 'c39_supper', for: 'any', chapter: 'ch3', title: 'Третья свеча', camp: kitchen14, onEnter: [until39(42, 18, 0)],
    text: [
      { text: 'Ужин. На столе венок из еловых веток, в нём четыре свечи. Завтра третье воскресенье адвента: Хенрике зажигает две старые и одну новую, на день раньше. «Morgen ist Rat. Da hab ich keine Zeit für Kerzen». Завтра совет. Мне будет не до свечей.' },
      { when: merleFarm39, text: 'Мерле смотрит на свечи и говорит, что в Аренсбурге свечи были запрещены: пожарная опасность. Здесь можно. Здесь всё можно.' },
      { when: army39, text: 'В понедельник вечером — к Тобиасу. Во вторник в пять — ворота казармы. Если вы всё ещё этого хотите.' },
    ],
    actions: [
      { id: 'c39_su_eat', label: 'Ужинать при свечах', minutes: 60, terminal: true, goto: 'c39_night', ...tableOnly,
        text: 'Три огонька в венке, тени на потолке. Кто-то начинает петь, тихо, по-немецки, и замолкает на второй строчке. Никто не знает слов дальше.', effects: [set39('su', 'eat'), meal('eat'), until39(42, 19, 15)] },
      { id: 'c39_su_watch', label: 'Смотреть на свечи с чашкой чая', minutes: 60, terminal: true, goto: 'c39_night',
        text: 'Ты сидишь с краю с кружкой и смотришь на огоньки. Тепло, тесно, тихо.', effects: [set39('su', 'watch'), { body: 'stress', delta: -3 }, until39(42, 19, 15)] },
      { id: 'c39_su_sing', label: 'Попросить Хенрике спеть', when: henrike39, minutes: 60, terminal: true, goto: 'c39_night', ...tableOnly,
        text: 'Хенрике отказывается, потом поёт: «Macht hoch die Tür». Голос низкий, чуть дрожит. На втором куплете подпевает Биргит или Эва. Нина смотрит на них, открыв рот.', effects: [set39('su', 'sing'), meal('eat'), npc('henrike', 2, 'c39_sang'), { body: 'stress', delta: -6 }, until39(42, 19, 15)] },
    ] }),

  S39({ id: 'c39_night', for: 'any', chapter: 'ch3', title: 'Суббота, вечер', camp: house14,
    text: [
      { text: 'Дом затихает. Капель за окном не перестаёт. Ты лежишь и слушаешь её, как часы.' },
    ],
    actions: [
      { id: 'c39_ni_talk', label: 'Говорить с {partner.ins} про совет и про вторник', minutes: 30, terminal: true, goto: 'c39_checkpoint',
        text: 'Шёпотом. Совет у Брандта, склад в понедельник, оттепель во вторник. Вы раскладываете это по дням, как вещи по полкам. Легче не становится, но становится понятнее.', effects: [set39('ni', 'talk'), finish, until39(42, 20, 0)] },
      { id: 'c39_ni_sleep', label: 'Уснуть', minutes: 30, terminal: true, goto: 'c39_checkpoint',
        text: 'Ты засыпаешь под капель. Последняя мысль — о том, что весной это был бы хороший звук.', effects: [set39('ni', 'sleep'), finish, until39(42, 20, 0)] },
    ] }),

  S39({ id: 'c39_checkpoint', for: 'any', chapter: 'ch3', title: 'Суббота, восемь вечера', checkpoint: 39, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Завтра совет. Через три дня армия уйдёт.' }], actions: [] }),
];

