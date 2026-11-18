import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all } from './world3';
import { any, v } from './point18';
import { npc } from './point19';
import { S32, frost32, set32, until32, w32, winsen32 } from './point32';

// Участок 32, переделка (REWORK_PLAN.md, этап 1): поручения из дома в Винзен — письмо Каси Миреку в депо,
// бинты для Леи в Красном Кресте или вопрос военным про Ганновер. Утро четверга, до грузовика.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S32({ ...scene, for: 'any', chapter: 'ch3' });
const trip = { at: winsen32, stock: 'c3_farm_stock', rest: false as const };
export const mail32: Cond = any(v('w.c31_kasia_mail', 'promised'), v('w.c31_kasia_mail', 'try'));
export const bandage32: Cond = v('w.c31_lea_errand', 'bandages');
export const hannover32: Cond = v('w.c31_lea_errand', 'hannover');
export const errand32: Cond = any(mail32, bandage32, hannover32);
const next = [{ id: 'k', goto: 'c32_y_b_kitchen' }];
/** Из «Коробок» четверга — к поручениям, если они есть. */
export const toErrand32 = [{ id: 'e', when: errand32, goto: 'c32_hb_errand' }, { id: 'k', goto: 'c32_y_b_kitchen' }];

export const day32HScenes: Scene[] = [
  B({ id: 'c32_hb_errand', title: 'Поручения', location: winsen32, camp: trip, ambient: frost32,
    text: [
      { text: 'До грузовика час. В кармане у тебя то, что дали с собой из дома.' },
      { when: mail32, text: 'Конверт Каси с адресом в Щецине. Старое депо у вокзала, десять минут пешком.' },
      { when: bandage32, text: 'Список Леи: бинты, йод, нитки. Красный Крест — в старой сберкассе на Рыночной, в другую сторону от вокзала.' },
      { when: hannover32, text: 'Вопрос Леи про Ганновер. Армейская комендатура — в здании полиции, рядом со сберкассой.' },
      { when: all(mail32, any(bandage32, hannover32)), text: 'Туда и туда за час не успеть, если стоять в очередях. Если бежать — может быть.' },
    ],
    actions: [
      { id: 'c32_hbe_mail', label: 'Отнести письмо Каси в депо', when: mail32, minutes: 35, terminal: true, outcomes: next,
        text: 'В депо пахнет углём и супом. Поляки сидят на нарах в два яруса, дети бегают между паровозными ямами. Мирек узнаёт тебя сразу. Берёт конверт, смотрит на адрес, кладёт в жестяную коробку из-под печенья, где уже лежат десятки других.\n\n— Wir gehen am Zehnten. Der Brief geht mit uns. Er kommt an, wenn wir ankommen.\n\nМы уходим десятого. Письмо пойдёт с нами. Дойдёт, когда дойдём мы.',
        effects: [set32('hbe', 'mail'), w32('kasia_mail', 'given'), until32(33, 10, 10)] },
      { id: 'c32_hbe_bandage', label: 'Зайти в Красный Крест за бинтами для Леи', when: bandage32, minutes: 35, terminal: true, outcomes: next,
        text: 'В сберкассе очередь до двери. Ты говоришь «für Lüllau, Dr. Zander», как велела Лея. Женщина за стойкой поднимает бровь, но выдаёт: шесть бинтов, флакон йода, две катушки нити. «Mehr gibt es nicht. Sagen Sie der Frau Doktor einen Gruß». Больше нет. Передайте привет доктору.',
        effects: [set32('hbe', 'bandage'), w32('lea_supplies', true), until32(33, 10, 10)] },
      { id: 'c32_hbe_hannover', label: 'Спросить в комендатуре про Ганновер', when: hannover32, minutes: 35, terminal: true, outcomes: next,
        text: 'Дежурный ефрейтор долго ищет в папке.\n\n— Hannover-Linden. Sperrgebiet seit dem neunten November. Evakuierte nach Langenhagen, Kaserne. Listen gibt es dort. Konvois über Celle, jeden zweiten Dienstag, mit Sanitätspersonal.\n\nГанновер-Линден. Закрытая зона с девятого ноября. Эвакуированных — в Лангенхаген, в казармы. Списки — там. Колонны через Целле, каждый второй вторник, с санитарами.\n\nТы записываешь всё дословно, на обороте списка Леи.',
        effects: [set32('hbe', 'hannover'), w32('hannover', 'lists'), until32(33, 10, 10)] },
      { id: 'c32_hbe_both', label: 'Бегом: и письмо, и поручение Леи', when: all(mail32, any(bandage32, hannover32)), minutes: 55, terminal: true, outcomes: next,
        text: 'Ты бежишь. Депо, конверт в руки Миреку, «am Zehnten», обратно через площадь. Сберкасса и полиция стоят рядом, и ты успеваешь в одну, пока в другой обед. К грузовику ты прибегаешь последней, мокрая под курткой, и водитель уже заводит мотор.',
        effects: [set32('hbe', 'both'), w32('kasia_mail', 'given'), { if: bandage32, then: [w32('lea_supplies', true)], else: [w32('hannover', 'lists')] }, { body: 'fatigue', delta: 4 }, until32(33, 10, 25)] },
      { id: 'c32_hbe_none', label: 'Не успеть: остаться у грузовика', minutes: 10, terminal: true, outcomes: next,
        text: 'Очередь у школы, коробки, водитель торопит. Ты остаёшься у грузовика. Всё, что дали с собой, едет обратно в кармане.',
        effects: [set32('hbe', 'none'), { if: mail32, then: [w32('kasia_mail', 'back'), npc('kasia', -1)] }, until32(33, 9, 45)] },
    ] }),
];
