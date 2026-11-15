import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { yard14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import {
  S33, brothersAlive, brothersCome, deniz33, frost33, henrike33, set33, tractor33, until33, ute33, w33, yardDry33,
} from './point33';

// Участок 33, линия A: вода (одна возможность), братья Айдын, вечер у приёмника.
const A = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S33({ ...scene, for: 'any', chapter: 'ch3' });
const water = (liters: number) => ({ place: 'water_l', at: 'c3_farm_stock', qty: liters });
const haveWood = { has: 'firewood' } as const;
const radio = any({ has: 'c32_ilse_radio' }, flag('w.c32_drk_freq'));
const fixed = v('w.c33_pump', 'fixed');

export const day33AScenes: Scene[] = [
  A({ id: 'c33_a_pump', title: 'Вода', camp: yardDry33, ambient: frost33,
    text: [
      { text: 'Колонку можно отогреть: снять кожух, греть трубу паяльной лампой, потом утеплить соломой и навозом до весны. Это работа на полдня, и не наверняка.' },
      { when: ute33, text: 'У Уте в колонии глубокий колодец, он не мёрзнет. Можно возить бочкой. Если Уте разрешит.' },
      { text: 'Можно топить снег. Дров уйдёт много, а воды выйдет мало.' },
    ],
    actions: [
      { id: 'c33_ap_fix', label: 'Отогревать и утеплять колонку', minutes: 270, activity: 'heavy', terminal: true, ambientDuring: frost33,
        outcomes: [
          { id: 'ok', check: { traits: ['technical', 'endurance'], difficulty: 4, mods: [{ when: brothersCome, bonus: 2 }] }, goto: 'c33_a_brothers',
            text: 'Кожух, паяльная лампа, тряпки. Труба шипит, оттаивает сантиметр за сантиметром. В полдень рычаг сдвигается. Ещё через полчаса из носика идёт ржавая вода, потом чистая. Ты обкладываешь трубу соломой, сверху навозом, сверху мешковиной. Колонка похожа на пугало. Но качает.',
            effects: [set33('ap', 'fix'), w33('pump', 'fixed'), water(20), { body: 'fatigue', delta: 10 }, until33(12, 30)] },
          { id: 'half', goto: 'c33_a_brothers',
            text: 'Труба оттаивает до колена и дальше не идёт: промёрзло глубже, чем достаёт лампа. К полудню у тебя есть два ведра ржавой воды и замёрзшие руки. Колонка встанет снова к ночи.',
            effects: [set33('ap', 'fix'), w33('pump', 'half'), water(10), { body: 'fatigue', delta: 12 }, until33(12, 30)] },
        ] },
      { id: 'c33_ap_ute', label: 'Ехать к Уте с бочкой на тракторе', when: all(ute33, tractor33), minutes: 240, activity: 'moderate', terminal: true, goto: 'c33_a_brothers', ambientDuring: frost33,
        text: 'Уте выходит к колодцу в валенках и долго смотрит на бочку.\n\n— Für Henrike. Wasser verkauft man nicht.\n\nДля Хенрике. Водой не торгуют.\n\nВедро за ведром, сорок литров. Обратно трактор идёт медленно, бочка плещет.', effects: [set33('ap', 'ute'), w33('pump', 'ute'), water(40), npc('c14_ute', 2, 'c33_gave_water'), until33(12, 0)] },
      { id: 'c33_ap_snow', label: 'Топить снег на плите', when: haveWood, minutes: 240, terminal: true, goto: 'c33_a_brothers',
        text: 'Ведро снега — полкружки воды. Ты таскаешь снег с крыши сарая, где он чище. Плита гудит весь день, поленница у стены тает на глазах. К полудню в бочке пятнадцать литров.', effects: [set33('ap', 'snow'), w33('pump', 'snow'), water(15), { take: 'firewood', qty: 3 }, until33(12, 0)] },
      { id: 'c33_ap_snow_cold', label: 'Топить снег на плите', when: not(haveWood), minutes: 240, terminal: true, goto: 'c33_a_brothers',
        text: 'Ведро снега — полкружки воды. Хенрике отдаёт под это свои дрова, молча. Плита гудит весь день. К полудню в бочке пятнадцать литров, а поленница у сарая заметно ниже.', effects: [set33('ap', 'snow'), w33('pump', 'snow'), water(15), w33('wood_spent', true), until33(12, 0)] },
    ] }),

  A({ id: 'c33_a_brothers', title: 'Братья', camp: yard14, ambient: frost33, onEnter: [until33(13, 0)],
    text: [
      { when: all(brothersCome, deniz33('farm')), text: 'В час у ворот «Транзит». Братья выгружают сумки, ящики с инструментом и раскладушки. Хенрике показывает им сеновал над хлевом: там теплее, чем кажется, от коров снизу.' },
      { when: all(brothersCome, deniz33('near')), text: 'В час «Транзит» проезжает мимо ваших ворот и встаёт у пустого двора соседей у насыпи. Братья выгружаются там. Дениз машет тебе: иди сюда.' },
      { when: all(brothersAlive, deniz33('stay')), text: 'В час «Транзит» останавливается у ворот, но мотор не глушат. Дениз выходит один.\n\n— Wir bleiben in Buchholz. Werkstatt ist Werkstatt. Aber das Werkzeug lasse ich euch da. Ihr braucht es mehr.\n\nМы остаёмся в Бухгольце. Мастерская есть мастерская. Но инструмент я вам оставлю. Вам нужнее.' },
      { when: not(brothersAlive), text: 'В час у ворот никого. Только ветер гонит снег вдоль забора.' },
      { when: fixed, text: 'Дениз первым делом идёт к колонке, качает, смотрит на воду и кивает тебе через двор.' },
    ],
    actions: [
      { id: 'c33_ab_help', label: 'Помочь им устроиться', when: brothersCome, minutes: 150, activity: 'moderate', terminal: true, goto: 'c33_a_eve',
        text: 'Раскладушки, буржуйка, труба в окно. Керем развешивает над дверью турецкий оберег, синий глаз на нитке. Дениз прибивает полку. К четырём это похоже на жильё.', effects: [set33('ab', 'help'), npc('deniz', 1), npc('kerem', 1), until33(15, 30)] },
      { id: 'c33_ab_tools', label: 'Разобрать с Денизом ящики с инструментом', when: brothersAlive, minutes: 150, terminal: true, goto: 'c33_a_eve',
        text: 'Головки, ключи, домкрат, сварочный аппарат без тока. Дениз раскладывает и говорит, что чем. Слушать его как слушать музыку на чужом языке: понятно не всё, но красиво.', effects: [set33('ab', 'tools'), w33('tools', true), npc('deniz', 1), until33(15, 30)] },
      { id: 'c33_ab_wood', label: 'Колоть дрова: их сегодня ушло много', minutes: 150, activity: 'heavy', terminal: true, goto: 'c33_a_eve', ambientDuring: frost33,
        text: 'Ты колешь, пока не перестаёшь чувствовать плечи. Поленница растёт обратно.', effects: [set33('ab', 'wood'), { body: 'fatigue', delta: 8 }, until33(15, 30)] },
    ] }),

  A({ id: 'c33_a_eve', title: 'Сумерки', camp: yard14, ambient: frost33,
    text: [
      { text: 'Четыре часа, и уже синие сумерки. Из окон соседнего двора у насыпи — свет, впервые за месяц.' },
      { when: radio, text: 'Частота Красного Креста записана в тетради. Приёмник ловит её только на улице, у забора, если поднять антенну.' },
    ],
    actions: [
      { id: 'c33_ae_radio', label: 'Слушать сводку Красного Креста', when: radio, minutes: 60, terminal: true, goto: 'c33_council', ambientDuring: frost33,
        text: 'Сквозь треск — женский голос, медленно, по слогам, как диктовку. Пункты приёма. Номера колонн. «Kolonne nach Ahrensburg: zehnter Dezember, Abfahrt Geesthacht, sieben Uhr. Begleitpersonen mit Passierschein». Колонна на Аренсбург: десятого декабря, отправление из Гестхахта, семь утра. Сопровождающие — с пропуском.\n\nТы записываешь. Ты не знаешь, кому это нужно. Но записываешь.', effects: [set33('ae', 'radio'), w33('heard_column', true), until33(18, 0)] },
      { id: 'c33_ae_henrike', label: 'Посидеть с Хенрике, пока она считает запасы', when: henrike33, minutes: 60, terminal: true, goto: 'c33_council',
        text: 'Хенрике пишет в тетради цифры столбиком: картошка, мука, соль, яйца. Подчёркивает. Пересчитывает. Потом закрывает тетрадь и долго держит на ней ладонь.', effects: [set33('ae', 'henrike'), npc('henrike', 1), until33(18, 0)] },
      { id: 'c33_ae_rest', label: 'Лечь на час', minutes: 60, terminal: true, goto: 'c33_council',
        text: 'Ты ложишься не раздеваясь и просыпаешься от голосов на кухне.', effects: [set33('ae', 'rest'), until33(18, 0, true)] },
    ] }),
];
