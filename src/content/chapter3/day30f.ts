import type { Scene } from '../../engine/content-types';
import { not } from './world3';
import { house14 } from './point14';
import { npc } from './point19';
import { S30, entryFuel, entryHome, entryJoin, frost30, mittens, set30, until30, w30, worse1 } from './point30';

// Участок 30, второй проход объёма (15.11): вечер перед выходом у каждого (записка на случай, проверка вещей, сон)
// и короткая сцена после цепочки, до возвращения в дом (кому помочь, кого пересчитать).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S30({ ...scene, for: 'any', chapter: 'ch3' });
const toRoad = [{ id: 'j', when: entryJoin, goto: 'c30_j_road' }, { id: 'f', when: entryFuel, goto: 'c30_f_road' }, { id: 'h', goto: 'c30_h_post' }];

export const day30FScenes: Scene[] = [
  X({ id: 'c30_a_eve', title: 'Перед выходом', camp: house14, onEnter: [until30(30, 19, 0)],
    text: [
      { text: 'Семь вечера. До выхода два часа. В доме тихо так, как бывает только перед чем-то.' },
      { when: entryJoin, text: 'В десять у пожарной части. Цепь, факелы, край впадины.' },
      { when: entryFuel, text: 'В одиннадцать, когда дружина уйдёт, трактор и третий грузовик.' },
      { when: entryHome, text: 'В одиннадцать — свой край у насыпи, ручей, лёд.' },
    ],
    actions: [
      { id: 'c30_ae_note', label: 'Написать {partner.dat} записку на случай, если не вернёшься', minutes: 40, terminal: true, outcomes: toRoad,
        text: 'Ты пишешь коротко, на листке из тетради. Перечитываешь, зачёркиваешь одну фразу, пишешь сверху другую. Складываешь вчетверо и кладёшь во внутренний карман, к телу. Если что — найдут.', effects: [set30('ae', 'note'), set30('note', true), until30(30, 21, 0)] },
      { id: 'c30_ae_check', label: 'Перебрать вещи ещё раз: всё ли взято', minutes: 40, terminal: true, outcomes: toRoad,
        text: 'Фонарь, батарейки, спички в целлофане, нож. На дне сундука в сенях ты находишь старые шерстяные рукавицы Хенрике, жёсткие от времени. Лучше, чем ничего.', effects: [set30('ae', 'check'), { if: not(mittens), then: [set30('mittens', true)] }, until30(30, 21, 0)] },
      { id: 'c30_ae_sleep', label: 'Лечь на полтора часа: ночь длинная', minutes: 30, terminal: true, outcomes: toRoad,
        text: 'Ты ложишься {m:одетым|одетой} поверх одеяла. Засыпаешь сразу. Просыпаешься за минуту до того, как Хенрике трогает тебя за плечо.', effects: [set30('ae', 'sleep'), { body: 'fatigue', delta: -10 }, until30(30, 21, 0, true)] },
    ] }),

  X({ id: 'c30_b_eve', title: 'Перед выходом', camp: house14, onEnter: [until30(30, 19, 0)],
    text: [
      { text: 'Семь вечера. До выхода два часа. Нина моет посуду очень медленно, чтобы было чем заняться.' },
      { when: entryJoin, text: 'В десять у пожарной части. Сани, Лея, доктор Зандер, костёр сзади цепи.' },
      { when: entryFuel, text: 'В одиннадцать — трактор, прицеп, фонарь в руках.' },
      { when: entryHome, text: 'В одиннадцать — двор, домик Уте, свеча в окне или темнота.' },
    ],
    actions: [
      { id: 'c30_be_note', label: 'Написать {partner.dat} записку на случай, если не вернёшься', minutes: 40, terminal: true, outcomes: toRoad,
        text: 'Ты пишешь, сидя на краю кровати. Получается не то, что хотелось. Ты пишешь снова, короче. Складываешь и кладёшь в нагрудный карман, застёгиваешь пуговицу.', effects: [set30('be', 'note'), set30('note', true), until30(30, 21, 0)] },
      { id: 'c30_be_bag', label: 'Собрать сумку для саней: бинты, сахар, сухие носки на смену', minutes: 40, terminal: true, outcomes: toRoad,
        text: 'Бинты, сахар в кубиках, две пары носков в целлофане, фляга с горячим чаем. Сумка тяжёлая. Сухие носки ты кладёшь сверху, чтобы достать, не глядя.', effects: [set30('be', 'bag'), set30('dry', true), until30(30, 21, 0)] },
      { id: 'c30_be_nina', label: 'Посидеть с Ниной, пока она не уснёт', minutes: 40, terminal: true, outcomes: toRoad,
        text: 'Нина не спит, притворяется. Ты сидишь рядом и рассказываешь ей про Гамбург, про трамвай, про кофе на углу. На середине она засыпает по-настоящему.', effects: [set30('be', 'nina'), npc('c7_nina', 1), until30(30, 21, 0)] },
    ] }),

  X({ id: 'c30_a_after', title: 'Под утро', location: undefined, safe: false, ambient: frost30,
    text: [
      { when: entryJoin, text: 'Цепь сворачивается. Уве идёт вдоль края и считает людей по головам, вслух. На одной цифре он сбивается и начинает заново.' },
      { when: entryFuel, text: 'Двор хутора. Канистры надо снять, пока солярка не застыла в шлангах. Хенрике держит фонарь.' },
      { when: entryHome, text: 'Костёр у насыпи догорает. Яннес сидит на корточках у огня и греет руки, не снимая рукавиц.' },
      { when: worse1, text: 'Руки и ноги отходят с болью: это значит, что они ещё твои.' },
    ],
    actions: [
      { id: 'c30_aa_help', label: 'Помочь донести раненых или разгрузить, пока есть силы', minutes: 10, activity: 'moderate', terminal: true, goto: 'c30_night_end',
        text: 'Ты берёшь за край носилки, канистру, мешок, что дают. Руки уже не чувствуют веса. Последнее несёшь, не понимая, что несёшь.', effects: [set30('aa', 'help'), w30('a_helped', true), { body: 'fatigue', delta: 6 }, until30(31, 3, 55)] },
      { id: 'c30_aa_count', label: 'Пересчитать своих', minutes: 10, terminal: true, goto: 'c30_night_end',
        text: 'Ты считаешь тех, кого знаешь. Уве. Яннес. Мальчишка. Хенрике. Одного нет. Ты считаешь снова. Потом тебе говорят: Хиннерк. С края.', effects: [set30('aa', 'count'), set30('knows_hinnerk', true), until30(31, 3, 55)] },
      { id: 'c30_aa_sit', label: 'Сесть на снег: ноги больше не держат', minutes: 10, terminal: true, goto: 'c30_night_end',
        text: 'Ты садишься прямо в снег. Кто-то поднимает тебя под мышки и ведёт к теплу. Ты не видишь, кто.', effects: [set30('aa', 'sit'), until30(31, 3, 55)] },
    ] }),

  X({ id: 'c30_b_after', title: 'Под утро', location: undefined, safe: false, ambient: frost30,
    text: [
      { when: entryJoin, text: 'У саней Лея пересчитывает раненых и шины. Зандер сидит на ящике, руки в крови до локтей, и пьёт чай из крышки термоса.' },
      { when: entryFuel, text: 'Двор хутора. Ты слезаешь с прицепа и не сразу чувствуешь землю под ногами.' },
      { when: entryHome, text: 'В домике тихо. Уте подкидывает в буржуйку последнее полено и открывает дверь, проверить, кто там.' },
      { when: worse1, text: 'Бедро, руки, всё ноет. Но ты на ногах.' },
    ],
    actions: [
      { id: 'c30_ba_help', label: 'Помочь Лее или Хенрике, сколько хватит сил', minutes: 10, activity: 'moderate', terminal: true, goto: 'c30_night_end',
        text: 'Бинт, шина, грелка, кружка. Ты делаешь, что говорят, пока руки не начинают дрожать так, что Лея забирает у тебя бинт.', effects: [set30('ba', 'help'), w30('b_helped', true), npc('c21_lea', 1), { body: 'fatigue', delta: 6 }, until30(31, 3, 55)] },
      { id: 'c30_ba_count', label: 'Пересчитать своих', minutes: 10, terminal: true, goto: 'c30_night_end',
        text: 'Нина, Хенрике, Уте, Эва. {partner}: где {pm:он|она}? Тебе говорят. Ты выдыхаешь. Или не выдыхаешь.', effects: [set30('ba', 'count'), until30(31, 3, 55)] },
      { id: 'c30_ba_sit', label: 'Сесть у огня и не двигаться', minutes: 10, terminal: true, goto: 'c30_night_end',
        text: 'Ты садишься у огня. Тепло бьёт в лицо. Глаза закрываются сами.', effects: [set30('ba', 'sit'), until30(31, 3, 55)] },
    ] }),
];
