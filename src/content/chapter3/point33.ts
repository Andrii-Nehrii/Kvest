import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { meal } from './point12';
import { indoor16 } from './point16';
import { any, ninaFarm, v } from './point18';
import { npc, tableOnly } from './point19';
import { okaforHere32 } from './point32';

// Участок 33: пятница 4.12, 07:00 → КТ33 20:00. Передышка; ресурс (вода — колонка замёрзла); находка B; человек из прошлого (Уте).
// Приезды по КТ32 одинаково в обеих линиях: братья Айдын (`w.c32_deniz`), Окафор и старики из Бармбека (`w.c32_okafor`).
// Вода добывается только в линии A (одна возможность — один раз); находка — в линии B.
export const P33: Cond = all({ cp: 32 }, not({ cp: 33 }));
export const A33: Cond = { me: 'A' };
export const B33: Cond = { me: 'B' };
export const farm33 = 'hof_luedemann';
export const near33 = 'c3_neighbor';
export const garden33 = 'c15_garden';
const up: Cond = { cap: 'canAct', op: '>=', value: 1 };
export const point33Available: Cond = all(P33, { at: farm33 }, { partnerAt: farm33 }, up, { partner: 'active' }, flag('w.c32_okafor'), flag('w.c32_deniz'));
export const own33 = (key: string, value: string): Cond => v(`$.c33_${key}`, value);

export const okafor33 = (x: string): Cond => v('w.c32_okafor', x);
export const deniz33 = (x: string): Cond => v('w.c32_deniz', x);
/** Старики из Бармбека приезжают (на хутор или рядом). */
export const eldersCome: Cond = any(okafor33('farm'), okafor33('near'));
/** Окафор с ними (если он был в Винзене). */
export const okaforComes: Cond = all(eldersCome, okaforHere32);
/** Хенрике берёт стариков в дом, только если вы остались своими (КТ28); иначе — домик Уте в колонии. */
export const eldersInHouse: Cond = all(okafor33('farm'), v('w.c28_place', 'family'));
export const brothersAlive: Cond = any({ npc: 'deniz', alive: true }, { npc: 'kerem', alive: true });
export const brothersCome: Cond = all(brothersAlive, any(deniz33('farm'), deniz33('near')));
export const oleHome33: Cond = all({ npc: 'ole', alive: true, at: farm33 }, not(flag('w.c27_ole_last')));
export const ute33: Cond = { npc: 'c14_ute', alive: true };
export const kasia33: Cond = { npc: 'kasia', alive: true, at: farm33 };
export const henrike33: Cond = { npc: 'henrike', alive: true, at: farm33 };
export const tractor33: Cond = all(flag('w.c16_tractor'), any(not(v('w.c30_tractor', 'ditch')), flag('w.c31_tractor_out')));
export const pumpFixed: Cond = v('w.c33_pump', 'fixed');

export const frost33 = { tempC: -5, outdoor: true, wet: false };
/** Двор без колонки: до починки к колодцу не сходить. */
export const yardDry33: NonNullable<Scene['camp']> = { at: farm33, stock: 'c3_farm_stock', rest: 'brief', car: 'opel_corsa' };

const wrap = (gate: Cond) => (scene: Scene): Scene => ({
  ...scene, location: 'location' in scene ? scene.location : farm33, universal: scene.universal ?? true,
  safe: scene.safe ?? true, ambient: scene.ambient ?? indoor16,
  actions: scene.actions.map(a => ({ ...a, when: all(gate, a.when ?? { always: true }) })),
});
export const S33 = wrap(P33);
export const set33 = (key: string, value: string | boolean): Effect => ({ set: `$.c33_${key}`, value });
export const w33 = (key: string, value: string | boolean | number): Effect => ({ set: `w.c33_${key}`, value });
export const until33 = (h: number, m = 0, sleeping = false): Effect => ({ restUntil: at(34, h, m), ...(sleeping ? { sleeping: true } : {}) });
export const prepare33: Effect = { camp: { kind: 'prepare', quiet: true } };
const finish: Effect = { set: '$.c33_finished', value: true };

/** Кто куда приезжает — по ответам КТ32, одинаково в обеих линиях. */
export const arrivals33: Effect[] = [
  { if: all(deniz33('farm'), { npc: 'deniz', alive: true }), then: [{ npc: 'deniz', moveTo: farm33 }] },
  { if: all(deniz33('farm'), { npc: 'kerem', alive: true }), then: [{ npc: 'kerem', moveTo: farm33 }] },
  { if: all(deniz33('near'), { npc: 'deniz', alive: true }), then: [{ npc: 'deniz', moveTo: near33 }] },
  { if: all(deniz33('near'), { npc: 'kerem', alive: true }), then: [{ npc: 'kerem', moveTo: near33 }] },
  { if: all(okaforComes, eldersInHouse), then: [{ npc: 'okafor', moveTo: farm33 }] },
  { if: all(okaforComes, not(eldersInHouse)), then: [{ npc: 'okafor', moveTo: garden33 }] },
];

export const shared33: Scene[] = [
  S33({ id: 'c33_dawn', for: 'any', chapter: 'ch3', title: 'Колонка', camp: yardDry33, ambient: frost33,
    text: [
      { text: 'Минус одиннадцать ночью. Утром Хенрике качает рычаг колонки, и рычаг не идёт. Совсем. Труба промёрзла насквозь, до самой земли.' },
      { text: 'В бочке в сенях воды на дне. В доме стало больше людей, и каждый пьёт, моется и варит.' },
      { when: all(ninaFarm, v('w.c32_nina', 'farm')), text: 'Нина, вернувшаяся вчера из Винзена, стоит у колонки в пальто поверх ночной рубашки и смотрит на рычаг так, будто это она его сломала.' },
      { when: v('w.c32_nina', 'winsen'), text: 'Раскладушка Нины сложена у стены. Хенрике по привычке ставит на стол лишнюю кружку и убирает обратно.' },
      { when: eldersCome, text: 'Сегодня приедут старики из Бармбека. Грузовик Красного Креста обещали к девяти.' },
      { when: brothersCome, text: 'Сегодня приедут братья Айдын, с фургоном и инструментом.' },
      { text: 'Хенрике пробует ещё раз, двумя руками, всем весом. Рычаг стоит.\n\n— Fünfzig Jahre, — говорит она. — Fünfzig Jahre ist die nicht eingefroren.\n\nПятьдесят лет она не замерзала.\n\nОна говорит это так, будто колонка её предала.' },
    ],
    actions: [
      { id: 'c33_da_a', label: 'Взяться за колонку', when: A33, minutes: 30, terminal: true, goto: 'c33_x_a_heat',
        text: 'Ты обходишь колонку, трогаешь трубу. Холодная, как рельс. Хенрике смотрит на тебя и ждёт.', effects: [set33('da', 'pump'), until33(7, 30)] },
      { id: 'c33_da_b', label: 'Помочь Хенрике готовить комнаты к приезду', when: B33, minutes: 30, terminal: true, goto: 'c33_b_rooms',
        text: 'Ты выносишь из комнаты наверху лишнее, сдвигаешь кровати. Хенрике считает вслух, загибая пальцы: одеяла, подушки, тарелки.', effects: [set33('da', 'rooms'), until33(8, 0)] },
      { id: 'c33_da_a2', label: 'Сначала растопить печь и поставить вёдра со снегом на плиту', when: A33, minutes: 40, terminal: true, goto: 'c33_x_a_heat',
        text: 'Ты набиваешь снегом все вёдра, какие есть, и ставишь на плиту. Снег оседает, тает, превращается в воду на донышке. Из ведра снега выходит четверть ведра воды. Хотя бы на чай и на умыться. Колонка подождёт час.', effects: [set33('da', 'snow'), until33(7, 30)] },
      { id: 'c33_da_b2', label: 'Сначала сходить к колонке посмотреть, что с ней', when: B33, minutes: 30, terminal: true, goto: 'c33_b_rooms', ambientDuring: frost33,
        text: 'Колонка обросла льдом, как сосулька. Рычаг не двигается совсем. Ты дышишь на него, бесполезно. Внизу, у основания, трещина во льду: значит, внутри тоже лёд. Без огня тут не обойдётся. Ты возвращаешься к Хенрике с этой новостью.', effects: [set33('da', 'look'), until33(8, 0)] },
    ] }),

  S33({ id: 'c33_council', for: 'any', chapter: 'ch3', title: 'Совет', camp: kitchen14,
    text: [
      { text: 'Вечером Хенрике собирает всех на кухне. Ставит на стол чайник и тетрадь, в которую записывает запасы.' },
      { text: '— Bis zum Frühling sind es vier Monate. Wir müssen reden, wie wir essen.\n\nДо весны четыре месяца. Надо поговорить, как мы будем есть.' },
      { when: brothersCome, text: 'Братья Айдын сидят у двери, как гости, которые ещё не решили, гости ли они.' },
      { when: okaforComes, text: 'Окафор сидит рядом с тобой. Он пришёл из колонии пешком, по темноте, с фонарём.' },
      { when: all(eldersCome, not(okaforHere32)), text: 'Старики Петерсены прислали записку: они согласны на всё, только бы не обратно в спортзал.' },
      { when: v('w.c26_seed', 'keep'), text: 'Семенную картошку в подвале Хенрике не трогает: весной её сажать. Это единственное, что она говорит твёрдо.' },
      { when: v('w.c24_ration', 'half'), text: 'Паёк по списку Брандта на хутор — половинный.' },
      { when: pumpFixed, text: 'Колонка во дворе снова качает. Хенрике то и дело выглядывает в окно, проверяет.' },
      { when: not(pumpFixed), text: 'Колонка во дворе стоит замёрзшая.' },
      { text: 'Вопрос один: общий котёл на всех, кто живёт на хуторе и рядом? Или каждый двор своё? Или общий, но кто пришёл последним, отрабатывает?' },
      { when: flag('w.c33_garden_stove'), text: 'Из колонии пришла записка от Петерсенов: буржуйка в домике тянет, как новая. Спасибо тому, кто лазил на крышу.' },
      { when: v('$.c33_ab', 'wood'), text: 'Поленница у сарая выросла за день на ладонь. Хенрике это заметила и сказала вслух, при всех.' },
      { when: v('w.c33_mouths_list', 'less'), text: 'Список ртов для Брандта короче, чем людей за столом. Все это знают и никто не говорит.' },
      { when: all(brothersCome, { npc: 'kerem', alive: true }), text: 'Керем поднимает руку, как в школе, и тут же опускает, смутившись.\n\n— Wir haben Werkzeug. Und den Transit. Wir können fahren, holen, reparieren. Aber essen müssen wir auch.\n\nУ нас инструмент. И «Транзит». Мы можем ездить, возить, чинить. Но есть нам тоже надо.' },
      { when: all(eldersCome, not(eldersInHouse)), text: 'Петерсен, которого привели из колонии под руку, говорит, что в войну у его матери был общий котёл на три семьи, и никто не умер. Фрау Петерсен поправляет: умер дядя Курт. Но не от голода.' },
    ],
    actions: [
      { id: 'c33_co_eat', label: 'Поесть и слушать', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A33, goto: 'c33_a_late' }, { id: 'b', goto: 'c33_b_late' }], ...tableOnly,
        text: 'Суп. Хлеб. Ты ешь и слушаешь, как спорят. Хенрике почти не говорит, только записывает.', effects: [set33('co', 'eat'), meal('eat'), finish, until33(19, 0)] },
      { id: 'c33_co_speak', label: 'Сказать, что думаешь', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A33, goto: 'c33_a_late' }, { id: 'b', goto: 'c33_b_late' }],
        text: 'Ты говоришь коротко. Хенрике записывает и твои слова тоже, не поднимая головы. Потом говорит: «Morgen». Завтра решим.', effects: [set33('co', 'speak'), npc('henrike', 1), finish, until33(19, 0)] },
      { id: 'c33_co_count', label: 'Предложить сначала посчитать: сколько ртов и сколько всего', minutes: 60, terminal: true, outcomes: [{ id: 'a', when: A33, goto: 'c33_a_late' }, { id: 'b', goto: 'c33_b_late' }],
        text: 'Ты берёшь Нинину тетрадь и пишешь в столбик: картошка, мука, крупа, сало, яйца, вода. Справа — рты. Хенрике смотрит через плечо и поправляет две цифры: она знает лучше. Внизу выходит число дней. Все смотрят на него молча. Спорить после этого становится легче: спорят уже не с соседом, а с числом.', effects: [set33('co', 'count'), w33('council_counted', true), until33(19, 0)] },
    ] }),

  S33({ id: 'c33_checkpoint', for: 'any', chapter: 'ch3', title: 'Пятница, вечер', checkpoint: 33, universal: false, camp: house14,
    text: [{ text: 'Восемь вечера. Решить, как жить до весны, надо сегодня: завтра Хенрике будет делить.' }], actions: [] }),
];
