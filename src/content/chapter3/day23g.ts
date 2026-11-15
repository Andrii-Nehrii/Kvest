import type { Scene } from '../../engine/content-types';
import { not } from './world3';
import { house14, yard14 } from './point14';
import { v } from './point18';
import { npc } from './point19';
import { S23, guestsCome, set23, until23, w23 } from './point23';

// Участок 23, третий проход (до уровня 19–20): Лео в снегу (B), поздний вечер у обоих — Маркус у печи (A), письмо для Хенрике (B).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S23({ ...scene, for: 'any', chapter: 'ch3' });
const snow = { tempC: -1, outdoor: true, wet: false };

export const day23GScenes: Scene[] = [
  X({ id: 'c23_b_leo', title: 'Снеговик', camp: yard14, ambient: snow,
    text: [
      { when: guestsCome, text: 'Лео стоит посреди двора и катает снежный ком, слишком большой для него. Ком не двигается. Лео толкает плечом, потом садится в снег и смотрит на него с ненавистью, как взрослый.' },
      { when: not(guestsCome), text: 'Нина стоит посреди двора и катает снежный ком. Потом бросает и смотрит на него. Говорит, что в Гамбурге снега так много не бывает. Ей пятнадцать, и ей почему-то стыдно катать снеговика.' },
      { text: 'Лео лепит снеговика сосредоточенно, высунув язык. Снеговик получается кривой, с головой больше туловища.' },
    ],
    actions: [
      { id: 'c23_bl9_help', label: 'Помочь докатить и слепить снеговика', minutes: 40, activity: 'light', terminal: true, goto: 'c23_b_sms',
        text: 'Вы катаете втроём: ты, ребёнок и Нина, которая не выдерживает и присоединяется. Снеговик выходит кривой, с морковкой вместо носа и пуговицами из угля. Хенрике, если бы видела, отругала бы за морковку. Ребёнок смеётся в первый раз, звонко, во весь двор.', effects: [set23('bl9', 'help'), w23('snowman', true), { if: guestsCome, then: [npc('c12_leo', 2, 'c23_snowman')] }, npc('c7_nina', 1), until23(16, 30)] },
      { id: 'c23_bl9_teach', label: 'Научить его слову по-русски: «снеговик»', when: guestsCome, minutes: 30, terminal: true, goto: 'c23_b_sms',
        text: '«Сне-го-вик». Лео повторяет: «Шнеховик». Потом бегает по двору и кричит это слово, пока Маркус не выходит на крыльцо посмотреть, что случилось. Маркус улыбается в первый раз за два дня.', effects: [set23('bl9', 'teach'), w23('leo_word', true), npc('c12_leo', 1), npc('c12_marcus', 1), until23(16, 20)] },
      { id: 'c23_bl9_in', label: 'Позвать в дом греться: вечереет', minutes: 20, terminal: true, goto: 'c23_b_sms',
        text: 'В доме тепло, пахнет супом. Ком так и остаётся посреди двора. Утром на нём сидит ворона.', effects: [set23('bl9', 'in'), until23(16, 0)] },
    ] }),

  X({ id: 'c23_a_late', title: 'У печи', camp: house14, onEnter: [until23(19, 30)],
    text: [
      { when: guestsCome, text: 'Когда все расходятся, Маркус остаётся у печи. Ты тоже. Он долго смотрит в огонь, потом закатывает рукав: старый шрам от укуса, белый, на предплечье. Октябрь, говорит он. Болел неделю. Выжил. Брандт об этом не знает.' },
      { when: not(guestsCome), text: 'Когда все расходятся, ты остаёшься у печи {m:один|одна}. Завтра понедельник. В понедельник Брандт обходит дворы.' },
      { text: 'Печь потрескивает. Дом засыпает, а вы ещё сидите. Тени от лампы шевелятся на стене.' },
      { when: v('$.c23_ev', 'sleep'), text: 'Лечь пораньше не вышло: сон не идёт.' },
      { when: v('$.c23_ev', 'out'), text: 'Снег во дворе ещё скрипит в ушах. Вы постояли на нём вдвоём, пока не замёрзли.' },
      { when: v('$.c23_ev', 'list'), text: 'Список того, что увидит Брандт, лежит на столе. Половина пунктов зачёркнута, половина нет.' },
    ],
    actions: [
      { id: 'c23_al6_keep', label: 'Сказать: от нас Брандт не узнает', when: guestsCome, minutes: 30, terminal: true, goto: 'c23_checkpoint',
        text: 'Маркус опускает рукав. Кивает. «Danke». Больше он ничего не говорит, но утром первым встаёт колоть дрова.', effects: [set23('al6', 'keep'), w23('marcus_secret', 'kept'), npc('c12_marcus', 2, 'c23_kept_secret'), until23(20, 0)] },
      { id: 'c23_al6_ask', label: 'Спросить: а Лео? Он тоже болел?', when: guestsCome, minutes: 30, terminal: true, goto: 'c23_checkpoint',
        text: '— Nein. Leo nie. — Маркус смотрит на тебя твёрдо. — Und das bleibt so.\n\nНет. Лео никогда. И так и останется. Ты не уверен{m:|а}, говорит ли он о прошлом или о будущем.', effects: [set23('al6', 'ask'), w23('marcus_secret', 'asked'), until23(20, 0)] },
      { id: 'c23_al6_warn', label: 'Сказать честно: если найдут — мы не сможем его закрыть', when: guestsCome, minutes: 30, terminal: true, goto: 'c23_checkpoint',
        text: 'Маркус кивает. «Ich weiß. Dann gehe ich allein. Leo bleibt bei euch». Знаю. Тогда я уйду один. Лео останется у вас. Он говорит это так, будто давно решил.', effects: [set23('al6', 'warn'), w23('marcus_secret', 'warned'), w23('leo_stays_if', true), until23(20, 0)] },
      { id: 'c23_al6_check', label: 'Обойти двор с фонарём перед сном', when: not(guestsCome), minutes: 30, terminal: true, goto: 'c23_checkpoint',
        text: 'Ворота, калитка, сарай. На снегу у задней калитки чьи-то следы, человеческие, туда и обратно. Ты задвигаешь второй засов.', effects: [set23('al6', 'check'), w23('back_tracks', true), until23(20, 0)] },
      { id: 'c23_al6_sleep', label: 'Лечь', when: not(guestsCome), minutes: 15, terminal: true, goto: 'c23_checkpoint',
        text: 'Ты ложишься и засыпаешь, не успев подумать о понедельнике.', effects: [set23('al6', 'sleep'), until23(19, 45)] },
    ] }),

  X({ id: 'c23_b_late', title: 'Письмо', camp: house14, onEnter: [until23(19, 30)],
    text: [
      { text: 'Перед сном ты садишься с тетрадью. В понедельник в Люнебург поедет фургон прачечной. Можно передать письмо Хенрике. Короткое: она не любит длинных.' },
      { text: 'Лампа на столе прикручена. Нина спит наверху. В доме тихо, только печь потрескивает и оседают угли.' },
      { when: v('$.c23_ev', 'sleep'), text: 'Лечь пораньше не вышло: сон не идёт.' },
      { when: v('$.c23_ev', 'out'), text: 'Снег во дворе ещё скрипит в ушах. Вы постояли на нём вдвоём, пока не замёрзли.' },
      { when: v('$.c23_ev', 'list'), text: 'Список того, что увидит Брандт, лежит на столе. Половина пунктов зачёркнута, половина нет.' },
    ],
    actions: [
      { id: 'c23_bl10_house', label: 'Написать про дом: куры, дрова, все живы', minutes: 30, terminal: true, goto: 'c23_checkpoint',
        text: '«Liebe Henrike. Alle leben. Die Hühner legen. Holz ist genug». Все живы. Куры несутся. Дров хватает. Ты перечитываешь и добавляешь: «Nina lernt Deutsch». Нина учит немецкий. Складываешь вчетверо.', effects: [set23('bl10', 'house'), w23('letter_henrike', 'house'), until23(20, 0)] },
      { id: 'c23_bl10_guests', label: 'Написать честно: у нас гости, отец с сыном', minutes: 30, terminal: true, goto: 'c23_checkpoint',
        text: 'Ты пишешь про Маркуса и Лео, коротко. Хенрике должна знать, кто живёт в её доме. Даже если это ей не понравится. Особенно тогда.', effects: [set23('bl10', 'guests'), w23('letter_henrike', 'guests'), until23(20, 0)] },
      { id: 'c23_bl10_none', label: 'Не писать: что ни напиши, будет волноваться', minutes: 15, terminal: true, goto: 'c23_checkpoint',
        text: 'Ты закрываешь тетрадь. Фургон уйдёт без письма. Хенрике будет гадать. Может, так лучше.', effects: [set23('bl10', 'none'), until23(19, 45)] },
    ] }),
];
