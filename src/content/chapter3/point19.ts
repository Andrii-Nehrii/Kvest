import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, jens18, v } from './point18';

// Участки 19–20: 18.11, 19:30 (после КТ18) → КТ19 20.11, 05:00 → КТ20 20.11, 15:30. План — docs/hidden/CHAPTER3_ARC19_PLAN.md.
export const P19: Cond = all({ cp: 18 }, not({ cp: 19 }));
export const P20: Cond = all({ cp: 19 }, not({ cp: 20 }));
export const A19: Cond = { me: 'A' };
export const B19: Cond = { me: 'B' };
const able: Cond[] = [{ partner: 'active' }, { cap: 'canAct', op: '>=', value: 1 }];
export const point19Available: Cond = all(P19, flag('A.c18_finished'), flag('B.c18_finished'), flag('w.c18_friday'), flag('w.c18_house'),
  flag('w.together'), { at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' }, ...able);
export const inLue: Cond = all({ at: 'c18_lueneburg' }, { partnerAt: 'c18_lueneburg' });
export const atFarm: Cond = all({ at: 'hof_luedemann' }, { partnerAt: 'hof_luedemann' });
export const point20Available: Cond = all(P20, flag('A.c19_finished'), flag('B.c19_finished'), flag('w.c19_trip'), any(inLue, atFarm), ...able);

// Положение после точки 18 (все исходы).
export const henrikeHome: Cond = v('w.c18_henrike', 'home');
export const uteHere: Cond = v('w.c18_ute', 'farm');
export const jannesHere: Cond = any(uteHere, flag('w.c18_jannes_home'));
export const evaHere: Cond = v('w.c18_seat', 'eva');
export const janaHere: Cond = v('w.c18_seat', 'jana');
export const girlHere: Cond = any(evaHere, janaHere);
export const volkerHere: Cond = flag('w.c18_lodger');
export const ilseKept: Cond = v('w.c18_ilse', 'kept');
export const letter: Cond = flag('w.c18_ole_letter');
/** Колония в длинном сарае хутора: перевезли и Брандт оставил (farm) или оставили троих под слово Кёлер. */
export const barnChained: Cond = any(v('w.c18_colony', 'farm'), all(v('w.c18_colony', 'families'), v('w.c17_colony', 'move')));
export const colonyStands: Cond = v('w.c18_colony', 'spared');
export const colonyGone: Cond = any(v('w.c18_colony', 'cleared'), v('w.c18_colony', 'ended'), all(v('w.c18_colony', 'families'), not(v('w.c17_colony', 'move'))));
export const jensBarn: Cond = all(jens18, v('w.c18_colony', 'farm'));
export const jensColony: Cond = all(jens18, colonyStands);
export const jensGone: Cond = all(jens18, any(v('w.c18_colony', 'cleared'), v('w.c18_colony', 'ended')));
export const wernerAlive: Cond = any(colonyStands, barnChained);
export const tractorHere: Cond = all(any(flag('w.c16_tractor'), flag('w.c17_tractor')), not(flag('w.c18_tractor_lost')));
export const carHere: Cond = { itemAt: 'opel_corsa', place: 'hof_luedemann' };
export const own19 = (key: string, value: string): Cond => v(`$.c19_${key}`, value);
export const own20 = (key: string, value: string): Cond => v(`$.c20_${key}`, value);

export const cold19 = { tempC: -1, outdoor: true, wet: false };
export const day19 = { tempC: 4, outdoor: true, wet: false };
export const rain20 = { tempC: 5, outdoor: true, wet: true };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: scene.location ?? 'hof_luedemann', universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S19 = wrap(P19);
export const S20 = wrap(P20);
export const npc = (id: string, trust: number, remember?: string): Effect =>
  ({ if: { npc: id, alive: true }, then: [{ npc: id, trust, ...(remember ? { remember } : {}) }] });
export const set19 = (key: string, value: string | boolean): Effect => ({ set: `$.c19_${key}`, value });
export const w19 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c19_${key}`, value });
export const set20 = (key: string, value: string | boolean): Effect => ({ set: `$.c20_${key}`, value });
export const w20 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c20_${key}`, value });
export const until = (d: number, h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(d, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const tableOnly = { enabled: { camp: 'tableMeal' } as Cond, disabledReason: 'Своя порция уже использована или не выделена' };

export const shared19: Scene[] = [
  S19({ id: 'c19_wed_night', for: 'any', chapter: 'ch3', title: 'Ночь', camp: house14,
    text: [
      { text: 'Дом засыпает не сразу. Скрипят половицы, кто-то кашляет за стеной, на кухне тикают часы Хенрике.' },
      { when: barnChained, text: 'Из длинного сарая иногда доносится звон цепи. Потом снова тихо.' },
      { when: all(A19, ilseKept), text: 'Где-то там, на полпути к насыпи, в будке обходчика привязана Ильзе.' },
    ],
    actions: [
      { id: 'c19_wn_sleep', label: 'Спать', minutes: 5, terminal: true, goto: 'c19_breakfast',
        text: 'Ты засыпаешь, едва коснувшись подушки.', effects: [set19('wn', 'sleep'), until(19, 6, 40, true)] },
      { id: 'c19_wn_window', label: 'Полчаса посидеть у окна', minutes: 30, terminal: true, goto: 'c19_breakfast',
        text: 'Поле под луной серое. Около полуночи по дальней кромке проходят трое, цепочкой, в сторону B75. Они не сворачивают к хутору. Ты ложишься, когда их уже не видно.', effects: [set19('wn', 'window'), w19('saw_walkers', true), until(19, 6, 40, true)] },
      { id: 'c19_wn_clock', label: 'Спуститься на кухню попить и посмотреть на часы', when: A19, minutes: 15, terminal: true, goto: 'c19_breakfast',
        text: 'Ты пьёшь воду у раковины. Маятник часов Хенрике ходит за стеклом ровно, как всегда. Сбоку на корпусе маленькая латунная скважина. Раньше ты её не замечал.', effects: [set19('wn', 'clock'), until(19, 6, 40, true)] },
    ] }),

  S19({ id: 'c19_breakfast', for: 'any', chapter: 'ch3', title: 'Четверг', camp: kitchen14,
    text: [
      { text: 'Четверг, девятнадцатое. Каша на большой сковороде, хлеб, чай. За столом тесно.' },
      { when: henrikeHome, text: 'Хенрике распоряжается, не поднимая глаз от каши.\n\n— Heute gibt es Rationen in Jesteburg. Nur nach Liste, nur persönlich.\n\nСегодня пайки в Йестебурге. Только по списку и только лично.' },
      { when: not(henrikeHome), text: 'Вчера вечером патруль сказал: с сегодняшнего дня пайки в Йестебурге выдают по списку. Только лично.' },
      { when: all(A19, letter), text: '{B} кладёт рядом с твоей тарелкой листок, сложенный вчетверо. Почерк Оле, крупный, с наклоном назад.\n\n— От Оле, — говорит она. — Тебе.' },
      { when: B19, text: 'В девять за тобой зайдёт Кёлер: вчера на дороге она спросила, пойдёшь ли ты с ней за пайком.' },
    ],
    actions: [
      { id: 'c19_bf_eat', label: 'Поесть со всеми', minutes: 20, terminal: true, outcomes: [{ id: 'a', when: A19, goto: 'c19_a_letter' }, { id: 'b', goto: 'c19_b_morning' }], ...tableOnly,
        text: 'Ты ешь, не торопясь. Впереди длинный день.', effects: [set19('bf', 'eat'), meal('eat'), until(19, 7, 40)] },
      { id: 'c19_bf_pack', label: 'Взять свою порцию с собой', minutes: 5, terminal: true, outcomes: [{ id: 'a', when: A19, goto: 'c19_a_letter' }, { id: 'b', goto: 'c19_b_morning' }], ...tableOnly,
        text: 'Ты заворачиваешь хлеб и кашу в бумагу и убираешь в карман куртки.', effects: [set19('bf', 'pack'), meal('pack'), until(19, 7, 40)] },
      { id: 'c19_bf_tea', label: 'Только чай', minutes: 10, terminal: true, outcomes: [{ id: 'a', when: A19, goto: 'c19_a_letter' }, { id: 'b', goto: 'c19_b_morning' }],
        text: 'Чай крепкий и горький. Ты пьёшь его, обхватив кружку обеими руками.', effects: [set19('bf', 'tea'), until(19, 7, 40)] },
    ] }),

  // ───────────── Вечер четверга: снова вместе ─────────────
  S19({ id: 'c19_eve', for: 'any', chapter: 'ch3', title: 'Вольф у ворот', camp: yard14, ambient: cold19,
    text: [
      { text: 'В пять, уже в сумерках, у ворот останавливается армейский «Вольф». Из него выходит Тобиас. Планшет он оставляет на сиденье.' },
      { text: '— Morgen Mittag kommt ein Transport aus Hannover nach Lüneburg, — говорит он. — Mit Ersatz für euren Ole. Ich dachte, ihr wollt das wissen.\n\nЗавтра в полдень в Люнебург придёт транспорт из Ганновера. С заменой для вашего Оле. Я подумал, вы захотите знать.' },
      { text: 'Потом, тише:\n\n— Und ab Montag will Brandt alle sehen, die es überstanden haben. Alle Genesenen. Für Lüneburg.\n\nА с понедельника Брандт хочет видеть всех, кто переболел. Всех. Для Люнебурга.' },
    ],
    actions: [
      { id: 'c19_ev_route', label: 'Спросить, какой дорогой пойдёт транспорт', minutes: 10, terminal: true, goto: 'c19_supper',
        text: '— A7 bis Garlstorf, dann über Salzhausen. Die Autobahn weiter südlich ist dicht.\n\nПо A7 до Гарльсторфа, потом через Зальцхаузен. Дальше на юг автобан забит.\n\nОн рисует пальцем на пыльном капоте. Гарльсторф в двенадцати километрах от вас.', effects: [set19('ev', 'route'), w19('route_known', true), until(19, 18, 45)] },
      { id: 'c19_ev_who', label: 'Спросить, кто она — замена', minutes: 10, terminal: true, goto: 'c19_supper',
        text: '— Eine Studentin. Tiermedizin, glaube ich. Hat es im Oktober überstanden, in Hannover.\n\nСтудентка. Ветеринар, кажется. Переболела в октябре, в Ганновере.\n\nТобиас пожимает плечами.\n\n— Sie fährt nicht gern, sagt man.\n\nГоворят, едет без охоты.', effects: [set19('ev', 'who'), w19('heard_donor', true), until(19, 18, 45)] },
      { id: 'c19_ev_monday', label: 'Спросить, что будет с теми, кто придёт в понедельник', minutes: 10, terminal: true, goto: 'c19_supper',
        text: '— Sie werden gebraucht, — говорит Тобиас. Их ждут. Потом смотрит на дом за твоей спиной. — Ole hat sich auch freiwillig gemeldet. Am Anfang.\n\nОле тоже вызвался сам. Поначалу.', effects: [set19('ev', 'monday'), w19('monday_known', true), until(19, 18, 45)] },
      { id: 'c19_ev_coffee', label: 'Вынести ему кружку горячего', minutes: 10, terminal: true, goto: 'c19_supper',
        text: 'Тобиас пьёт, стоя у машины, и греет пальцы о кружку. Уезжая, он поднимает руку. Так он прощается теперь со всеми на этой дороге.', effects: [set19('ev', 'coffee'), npc('c15_tobias', 1), until(19, 18, 45)] },
    ] }),

  S19({ id: 'c19_supper', for: 'any', chapter: 'ch3', title: 'Ужин', camp: kitchen14,
    text: [
      { text: 'К ужину картошка с луком и то, что принесли из Йестебурга. За окном совсем темно.' },
      { when: all(henrikeHome, v('w.c18_friday', 'go')), text: 'Хенрике откладывает ложку.\n\n— Wenn ihr morgen fahrt, komme ich mit.\n\nЕсли завтра поедете, я с вами.' },
      { when: all(henrikeHome, not(v('w.c18_friday', 'go'))), text: 'Хенрике смотрит на часы и говорит в тарелку:\n\n— Der Junge kriegt heute keinen Brief. Morgen fährt der Wäschewagen.\n\nПисьма мальчик сегодня не получит. Фургон прачечной поедет завтра.' },
      { when: uteHere, text: 'Уте ест мало и аккуратно, как в гостях. Вилку держит по-учительски.' },
    ],
    actions: [
      { id: 'c19_su_eat', label: 'Поесть', minutes: 25, terminal: true, goto: 'c19_night', ...tableOnly,
        text: 'Ты доедаешь до конца и собираешь хлебом остатки лука.', effects: [set19('su', 'eat'), meal('eat'), until(19, 20, 0)] },
      { id: 'c19_su_pack', label: 'Отложить свою порцию на утро', minutes: 5, terminal: true, goto: 'c19_night', ...tableOnly,
        text: 'Ты накрываешь тарелку другой тарелкой и ставишь её на подоконник, где холодно.', effects: [set19('su', 'pack'), meal('pack'), until(19, 20, 0)] },
      { id: 'c19_su_talk', label: 'Поесть и рассказать за столом свой день', minutes: 40, terminal: true, goto: 'c19_night', ...tableOnly,
        text: 'Ты рассказываешь коротко, без подробностей, которых не стоит слышать Нине. Остальные слушают, не перебивая.', effects: [set19('su', 'talk'), meal('eat'), { body: 'stress', delta: -1 }, until(19, 20, 0)] },
    ] }),

  S19({ id: 'c19_night', for: 'any', chapter: 'ch3', title: 'Перед пятницей', camp: house14,
    text: [
      { text: 'В девять в доме гасят свет. Утром, если ехать, выезжать надо затемно.' },
      { when: v('w.c18_friday', 'go'), text: 'В среду вы решили ехать за Оле в пятницу. Пятница — завтра.' },
    ],
    actions: [
      { id: 'c19_ni_sleep', label: 'Лечь пораньше', minutes: 5, terminal: true, goto: 'c19_checkpoint',
        text: 'Ты ставишь будильник на половину пятого и засыпаешь сразу.', effects: [set19('ni', 'sleep'), { set: '$.c19_finished', value: true }, until(20, 4, 45, true)] },
      { id: 'c19_ni_watch', label: 'Посидеть у окна до часу ночи', minutes: 5, terminal: true, goto: 'c19_checkpoint',
        text: 'Ты сидишь у тёмного окна с кружкой. В половине первого по полю снова идут люди, четверо, к шоссе. Один спотыкается и встаёт, не вскрикнув. Ты ложишься в час и спишь плохо.', effects: [set19('ni', 'watch'), w19('saw_walkers', true), { set: '$.c19_finished', value: true }, until(20, 1, 0), until(20, 4, 45, true)] },
      { id: 'c19_ni_car', label: 'Сначала проверить машину и бак', when: carHere, minutes: 20, ambientDuring: cold19, terminal: true, goto: 'c19_checkpoint',
        text: 'Ты светишь фонариком на приборную панель. Стрелка бензина стоит там, где стояла. Ты протираешь стёкла от инея, чтобы утром не тратить на это время.', effects: [set19('ni', 'car'), { set: '$.c19_finished', value: true }, until(20, 4, 45, true)] },
    ] }),

  S19({ id: 'c19_checkpoint', for: 'any', chapter: 'ch3', title: 'Пятница, пять утра', checkpoint: 19, universal: false, camp: house14,
    text: [{ text: 'Пять утра. На кухне горит одна лампа. Вы стоите у стола в куртках и решаете, как начинается пятница.' }], actions: [] }),
];

export const checkpoint20: Scene[] = [
  S20({ id: 'c20_checkpoint', for: 'any', chapter: 'ch3', title: 'Половина четвёртого', checkpoint: 20, universal: false, camp: house14,
    text: [{ text: 'Половина четвёртого. Через час стемнеет. Вы стоите на кухне в куртках и решаете, что делаете этим вечером.' }], actions: [] }),
  S20({ id: 'c20_checkpoint_l', for: 'any', chapter: 'ch3', title: 'Половина четвёртого', checkpoint: 20, universal: false, location: 'c18_lueneburg',
    text: [{ text: 'Половина четвёртого. Через час стемнеет. Вы стоите у машины за шлагбаумом и решаете, что делаете этим вечером.' }], actions: [] }),
];
