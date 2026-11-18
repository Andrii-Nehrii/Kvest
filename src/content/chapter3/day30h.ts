import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14 } from './point14';
import { any, v } from './point18';
import { npc } from './point19';
import { S30, set30, until30 } from './point30';
import { evaIn, evaRole, kasiaIn, kasiaRoad, leaIn, leaRoad } from './house28';

// Участок 30, переделка (REWORK_PLAN.md, этап 1): перед сумерками тот, кто живёт в доме, собирает вас в ночь —
// варежки Эвы и часы на четыре минуты вперёд, верёвка Каси с петлями, сухое и наука Леи. Общая сцена, всё личное.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S30({ ...scene, for: 'any', chapter: 'ch3' });
const mitts2: Cond = { v: 'w.c29_eva_mitts', op: '>=', value: 2 };
const mitts1: Cond = { v: 'w.c29_eva_mitts', op: '==', value: 1 };
const go = [{ id: 'd', goto: 'c30_dusk' }];

export const day30HScenes: Scene[] = [
  X({ id: 'c30_hs', title: 'Перед сумерками', camp: kitchen14,
    text: [
      { text: 'Половина пятого. Солнце уже за лесополосой, на снегу длинные синие тени.' },
      // Эва
      { when: evaIn, text: 'Эва ловит тебя в сенях. Руки у неё в шерстяной пыли.' },
      { when: all(evaIn, mitts2), text: 'На ладони две пары серых варежек, плотных, двойной вязки, ещё пахнущих овцой.\n\n— Eine für dich, eine für den anderen. Daumen extra lang. Helmut hatte auch lange Daumen.\n\nОдна тебе, другая {partner.dat}. Большой палец длиннее обычного. У Хельмута тоже были длинные.' },
      { when: all(evaIn, mitts1, { me: 'A' }), text: 'На ладони одна пара серых варежек, плотных, двойной вязки.\n\n— Nur eine. Für dich. Du läufst immer ohne.\n\nТолько одна. Тебе. Ты всегда ходишь без.' },
      { when: all(evaIn, mitts1, { me: 'B' }), text: 'На ладони одна пара серых варежек, плотных, двойной вязки.\n\n— Nur eine. Für ihn. Er läuft immer ohne.\n\nТолько одна. Для {A.gen}. Он всегда ходит без.' },
      { when: all(evaIn, not(any(mitts1, mitts2))), text: 'Варежек она не довязала: на спицах половина пятки. Эва виновато показывает её тебе, как показывают недописанное письмо.' },
      { when: all(evaIn, flag('w.c29_eva_clock')), text: 'Кухонные часы спешат на четыре минуты.\n\n— Ihr geht vier Minuten früher. Mehr kann ich nicht tun.\n\nВы выйдете на четыре минуты раньше. Больше я ничего не могу.' },
      { when: all(evaIn, any(evaRole('kitchen'), evaRole('split'))), text: 'На плите в мятой кастрюле Эвы суп: картошка, морковь, шкварки. Густой, ложка стоит.' },
      { when: all(evaIn, v('w.c29_cow', 'saved')), text: 'Из хлева доносится, как Хенрике доит чёрную корову. Вымя спало.' },
      { when: all(evaIn, v('w.c29_cow', 'quarter')), text: 'Чёрная корова теперь доится на три соска. Молока на треть меньше. Эва об этом не говорит, но и не забывает.' },
      // Кася
      { when: kasiaIn, text: 'Кася сидит на нижней ступеньке лестницы с двумя мотками бельевой верёвки на коленях. Через каждый метр к верёвке пришита петля из лямок Тимова рюкзака: держаться в темноте, тащить, если придётся.' },
      { when: all(kasiaIn, kasiaRoad('list')), text: '— Am Zehnten bin ich weg. Bis dahin… nehmt die. Ich kann nähen. Das ist alles, was ich kann.\n\nДесятого меня уже не будет. А пока возьмите. Я умею шить. Больше я ничего не умею.' },
      { when: all(kasiaIn, kasiaRoad('stay')), text: '— Ich bleibe ja. Aber ich gehe heute Nacht nicht mit. Also nehmt die.\n\nЯ же остаюсь. Но сегодня ночью я с вами не пойду. Так что возьмите.' },
      { when: all(kasiaIn, not(any(kasiaRoad('list'), kasiaRoad('stay')))), text: '— Mit Bleistift, — говорит она про себя, про список Мирека. — Wie alles. Aber die hier ist fest genäht.\n\nКарандашом. Как всё. А вот это пришито крепко.' },
      // Лея
      { when: leaIn, text: 'Лея раскладывает на кухонном столе два свёртка: шерстяные носки в целлофане, войлочные стельки, бинт, четыре куска сахара.' },
      { when: leaIn, text: 'Она берёт тебя за запястье и прижимает свой палец к тыльной стороне твоей ладони.\n\n— Weiß und hart — das ist Erfrierung. Nicht reiben. Nie reiben. Warm machen, langsam. An einem Menschen, nicht am Ofen.\n\nБелое и твёрдое — это обморожение. Не растирать. Никогда не растирать. Отогревать медленно. О человека, не о печку.' },
      { when: all(leaIn, flag('w.c29_b_sutures')), text: 'Иглодержатель и катушку нити она кладёт в свёрток {B.gen}. «Du kannst es jetzt». Теперь ты умеешь.' },
      { when: all(leaIn, leaRoad('convoy')), text: 'Зандер обещала спросить про колонну на Ганновер. Лея говорит об этом между делом, будто о погоде.' },
    ],
    actions: [
      { id: 'c30_hs_mitts', label: 'Взять варежки Эвы', when: all(evaIn, any(mitts2, all(mitts1, { me: 'A' }))), minutes: 15, terminal: true, outcomes: go,
        text: 'Варежки тесноваты в запястье и как раз в пальцах. Ты надеваешь их и сразу снимаешь: жалко мочить раньше времени. Кладёшь во внутренний карман.',
        effects: [set30('hs', 'mitts'), set30('mittens', true), npc('c8_eva', 1), until30(30, 17, 0)] },
      { id: 'c30_hs_soup', label: 'Съесть тарелку супа перед ночью', when: all(evaIn, any(evaRole('kitchen'), evaRole('split'))), minutes: 20, terminal: true, outcomes: go,
        text: 'Эва наливает до краёв и стоит рядом, пока ты не съешь всё. Тепло доходит до пальцев ног.',
        effects: [set30('hs', 'soup'), { body: 'hunger', delta: -20 }, { body: 'stress', delta: -2 }, until30(30, 17, 0)] },
      { id: 'c30_hs_eva', label: 'Сказать Эве спасибо', when: evaIn, minutes: 10, terminal: true, outcomes: go,
        text: 'Эва машет рукой: ерунда. Потом всё-таки поправляет тебе воротник, как поправляла бы мужу.',
        effects: [set30('hs', 'eva'), npc('c8_eva', 1), until30(30, 17, 0)] },
      { id: 'c30_hs_rope', label: 'Взять верёвку с петлями', when: kasiaIn, minutes: 15, terminal: true, outcomes: go,
        text: 'Ты сматываешь верёвку на локоть. Петли ложатся ровно, одна к одной. Лямки ещё пахнут детским рюкзаком: яблоками и карандашами.',
        effects: [set30('hs', 'rope'), set30('rope', true), npc('kasia', 1), until30(30, 17, 0)] },
      { id: 'c30_hs_nina', label: 'Попросить Касю не оставлять Нину одну ночью', when: kasiaIn, minutes: 15, terminal: true, outcomes: go,
        text: '— Ja. Natürlich. — Кася смотрит на кухню, где Нина моет посуду. — Ich habe ein Kind im Haus gehabt. Ich weiß, wie das geht.\n\nДа. Конечно. У меня в доме был ребёнок. Я знаю, как это.',
        effects: [set30('hs', 'nina'), npc('kasia', 1), npc('c7_nina', 1), until30(30, 17, 0)] },
      { id: 'c30_hs_dry', label: 'Взять у Леи сухие носки и стельки', when: leaIn, minutes: 15, terminal: true, outcomes: go,
        text: 'Целлофан шуршит. Ты прячешь свёрток за пазуху, к телу: там носки останутся сухими до самой нужной минуты.',
        effects: [set30('hs', 'dry'), set30('dry', true), npc('c21_lea', 1), until30(30, 17, 0)] },
      { id: 'c30_hs_learn', label: 'Переспросить про обморожение, всё до конца', when: leaIn, minutes: 20, terminal: true, outcomes: go,
        text: 'Лея объясняет второй раз, медленнее: волдыри, цвет, когда уже поздно. Потом заставляет повторить. Ты повторяешь. Она кивает, как экзаменатор, которому понравился ответ.',
        effects: [set30('hs', 'learn'), set30('frostknow', true), { body: 'stress', delta: -2 }, until30(30, 17, 0)] },
    ] }),
];
