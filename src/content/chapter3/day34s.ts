import type { Scene } from '../../engine/content-types';
import { v } from './point18';
import { S34, frost34, set34, until34, w34 } from './point34';

// Участок 34, переделка (REWORK_PLAN.md, этап 2): если A ходит к фрау Тимм доить (`w.c27_timm_deal = hands`) — забой
// в Люллау в субботу. Что взять за работу: солонину на зиму, свежее на вечер Николауса для всего хутора, или отдать часть.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S34({ ...scene, for: 'any', chapter: 'ch3' });
const lullau = 'c26_lullau';
const toNoon = [{ id: 'n', goto: 'c34_noon' }];

export const day34SScenes: Scene[] = [
  X({ id: 'c34_sd_schlacht', title: 'Забой', location: lullau, camp: { at: lullau, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: frost34,
    text: [
      { text: 'Во дворе фрау Тимм пар стоит столбом. Свинью закололи на рассвете, без тебя: ты успеваешь к тому, как её ошпаривают в корыте и скребут щетину крышками от банок. Соседки в клеёнчатых фартуках. Кто-то мешает в тазу кровь, чтобы не свернулась.' },
      { text: '— Da bist du ja. Messer hier, Schüssel da. Erst die Därme waschen. Dann reden wir.\n\nА вот и ты. Нож здесь, таз там. Сначала промыть кишки. Потом поговорим.' },
      { text: 'Ты моешь кишки в ледяной воде до тех пор, пока не перестаёшь чувствовать пальцы. Потом крутишь мясорубку. Потом держишь оболочку, пока фрау Тимм набивает колбасу. К часу дня свинья превращается в ряды на столах: сало, окорока, рёбра, котёл с кровяной колбасой.' },
      { text: 'Фрау Тимм вытирает нож о фартук.\n\n— Ein Viertel. Wie abgemacht. Was willst du? Frisch oder gesalzen?\n\nЧетверть. Как договаривались. Что хочешь? Свежее или солёное?' },
    ],
    actions: [
      { id: 'c34_sd_salt', label: 'Солонину и сало: на всю зиму', minutes: 60, activity: 'moderate', terminal: true, outcomes: toNoon,
        text: 'Она отвешивает: окорок, кусок сала с ладонь толщиной, рёбра. Всё в соль, в деревянную кадку. Кадку вы с ней грузите вдвоём. «Bis Februar reicht das, wenn ihr nicht fresst wie die Wölfe». До февраля хватит, если не жрать, как волки.',
        effects: [set34('sd', 'salt'), w34('timm_meat', 'salt'), { place: 'c26_salt_beef', at: 'c3_farm_stock', qty: 8 }, { body: 'fatigue', delta: 6 }, until34(35, 13, 30)] },
      { id: 'c34_sd_fresh', label: 'Свежее: сегодня вечер Николауса, пусть поест весь хутор', minutes: 60, activity: 'moderate', terminal: true, outcomes: toNoon,
        text: 'Фрау Тимм смеётся, первый раз при тебе.\n\n— Nikolaus. Das hat Heiner auch immer gesagt. Gut.\n\nНиколаус. Хайнер тоже всегда так говорил. Ладно.\n\nОна заворачивает тебе свежие рёбра, две колбасы, ещё тёплые, и кусок печени для Хенрике. Ты несёшь их домой под курткой, и они греют тебе живот всю дорогу.',
        effects: [set34('sd', 'fresh'), w34('timm_meat', 'fresh'), { place: 'c26_salt_beef', at: 'c3_farm_stock', qty: 3 }, { body: 'hunger', delta: -15 }, { body: 'fatigue', delta: 5 }, until34(35, 13, 30)] },
      { id: 'c34_sd_give', label: 'Половину оставить её соседкам: у них дети', minutes: 50, terminal: true, outcomes: toNoon,
        text: 'Соседки переглядываются. Одна, самая старая, крестит тебя мокрой рукой. Фрау Тимм долго смотрит, потом кладёт в твою половину лишнюю колбасу. «Dumm, — говорит она. — Aber anständig». Глупо. Но порядочно. Вечером в Люллау будут знать, что люди с хутора Людеман отдали своё мясо.',
        effects: [set34('sd', 'give'), w34('timm_meat', 'give'), { place: 'c26_salt_beef', at: 'c3_farm_stock', qty: 4 }, { body: 'fatigue', delta: 5 }, until34(35, 13, 15)] },
    ] }),
];

/** Строки для «До обеда» в 34-й: что пришло от фрау Тимм при других сделках. */
export const timmLines34 = [
  { when: v('w.c27_timm_deal', 'plain'), text: 'С утра у ворот стоял бидон от фрау Тимм и свёрток в газете: кровяная колбаса. Она резала свинью. Без вас.' },
  { when: v('w.c27_timm_deal', 'hay'), text: 'У сарая два воза сена от фрау Тимм, под брезентом. Хенрике обошла их дважды и промолчала. Вечером сказала: «Danke». Не тебе — в сторону.' },
];
