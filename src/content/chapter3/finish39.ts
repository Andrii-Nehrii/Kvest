import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P39, army39, merleFarm39 } from './point39';

export const finished39: Cond = all(P39, any(flag('A.c39_finished'), flag('B.c39_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished39, when), text });

// Сверка в субботу, восемь вечера.
export const point39Notes: MergeNote[] = [
  N('c39_forecast', finished39, 'По армейской частоте: со вторника оттепель, плюс три — плюс пять, дождь, в ночь на среду штормовые порывы.'),
  N('c39_tobias', any(v('A.c39_at', 'hand'), v('A.c39_at', 'gift'), v('A.c39_at', 'ask')), 'Тобиас приезжал попрощаться. Больше он не заедет.'),
  N('c39_number', flag('w.c39_tobias_number'), 'У {A.gen} на ладони номер Тобиаса. По которому никто не дозвонится.'),
  N('c39_dynamo', flag('w.c39_dynamo'), 'В сарае собрали зарядку на педалях: крутишь — горит лампочка, заряжается телефон. Медленно.'),
  N('c39_reeds', flag('w.c39_reeds_cleared'), 'Вмёрзшего у камышей больше нет: его вырубили изо льда.'),
  N('c39_lea_wed', v('w.c39_lea_date', 'wednesday'), 'Лея ждёт до среды. Потом уходит в Берген — с вами или одна.'),
  N('c39_lea_bike', flag('w.c39_lea_bike'), 'Нина отдала Лее свой велосипед до Целле. «Только вернёт».'),
  N('c39_lea_left', flag('w.c39_lea_left'), 'Лея ушла пешком на восток, в Берген.'),
  N('c39_canvass', any(v('w.c39_canvass', 'guard'), v('w.c39_canvass', 'listen'), v('w.c39_canvass', 'brandt')), '{A} обошёл соседей у насыпи перед советом.'),
  N('c39_brandt', any(v('w.c39_told_brandt', 'guard'), v('w.c39_told_brandt', 'brandt'), v('w.c39_told_brandt', 'yards')), 'Брандт заезжал: хочет знать, где ваш двор на завтрашнем совете. Сказал прямо, что хочет командовать.'),
  N('c39_watch', any(flag('w.c39_watch_signal'), v('A.c39_wa', 'go'), v('B.c39_wa', 'go'), flag('w.c39_watch_saw_pass')), 'Ночью на дежурстве у Зеве по льду к берегу шёл обращённый. Мороз его держит, но не всех и не везде.'),
  N('c39_barn', flag('w.c39_barn_boarded'), 'Окна хлева забиты досками.'),
  N('c39_fence', flag('w.c39_fence_up'), 'Забор со стороны ручья подпёрт и затянут сеткой.'),
  N('c39_tractor', flag('w.c39_tractor_ready'), 'Трактор с прицепом готов к понедельнику: цепи, борта, брезент.'),
  N('c39_sled', any(flag('w.c39_big_sled'), flag('w.c39_sled')), 'На хуторе есть сани.'),
  N('c39_chest', any(v('w.c39_chest', 'open'), v('w.c39_chest', 'ole'), v('w.c39_chest', 'broken')), '{B} открыла сундук Оле на чердаке: санки, фонарик с ручкой-динамо, свечи, детский альбом.'),
  N('c39_merle_plan', all(merleFarm39, any(flag('w.c39_merle_plan'), flag('w.c39_pens_cellar'))), 'У Мерле теперь план: дозы, еда, сахар. Ручки инсулина — в подвале, где плюс четыре.'),
  N('c39_vet', flag('w.c39_vet_known'), 'Лея говорит: в ветклинике в Винзене может быть свиной инсулин для собак. Он подходит и людям, если умеючи.'),
  N('c39_point', any(flag('w.c39_b_point'), v('w.c39_b_point', 'once')), '{B} будет помогать Зандер в пункте: со вторника Зандер одна на весь округ.'),
  N('c39_school', flag('w.c39_farm_school'), 'На кухне по утрам теперь школа: Нина и, может, соседские дети.'),
  N('c39_kitchen', flag('w.c39_kitchen_rules'), 'На кухне теперь две хозяйки и расписание: утром Хенрике.'),
  N('c39_saat', flag('w.c39_saat_2027'), 'В книге посевов Хенрике заполнена страница на двадцать седьмой год.'),
  N('c39_thomas', flag('w.c39_thomas_heard'), 'По радио Красного Креста прозвучало: Томас Брокман, Торонто, ищет…'),
  N('c39_toronto', flag('w.c39_toronto_freq'), 'Уве поймал ночью в эфире Торонто и записал частоту.'),
];

export const point39Council: JointDecision = {
  id: 'c3_new_council39', checkpoint: 39, canParticipate: P39,
  prompt: { default: 'Завтра совет дворов у Брандта. С чем идёт ваш двор: общая стража — все дворы по очереди, решают вместе; каждый двор сам за себя, общие только сигналы; или пусть командует Брандт. Разные ответы — общая стража.' },
  options: [
    { id: 'guard', label: { default: 'Общая стража, решаем вместе' }, effects: [{ set: 'w.c39_council', value: 'guard' }],
      text: 'На совете ваш двор — за общую стражу.' },
    { id: 'yards', label: { default: 'Каждый двор сам, общие сигналы' }, effects: [{ set: 'w.c39_council', value: 'yards' }],
      text: 'На совете ваш двор — за то, чтобы каждый двор держался сам.' },
    { id: 'brandt', label: { default: 'Пусть командует Брандт' }, effects: [{ set: 'w.c39_council', value: 'brandt' }],
      text: 'На совете ваш двор — за Брандта.' },
  ],
  compromises: [{ pair: ['guard', 'yards'], result: 'guard' }, { pair: ['guard', 'brandt'], result: 'guard' }, { pair: ['yards', 'brandt'], result: 'guard' }],
  arbiters: [{ id: 'c39_council_guard', when: P39, winner: 'guard', text: 'Вы не сходитесь. Общая стража.' }],
  default: 'guard',
};

export const point39Depot: JointDecision = {
  id: 'c3_new_depot39', checkpoint: 39, canParticipate: P39,
  prompt: { default: 'В понедельник со склада казармы делят остатки: Брандт по списку дворов, остальное — кто первым возьмёт. Ехать обоим, одному — второй на хуторе, или не ехать: самим хватит, а в толпе опасно. Разные ответы — едет один.' },
  options: [
    { id: 'both', label: { default: 'Едем оба' }, effects: [{ set: 'w.c39_depot', value: 'both' }],
      text: 'В понедельник на склад едете оба.' },
    { id: 'one', label: { default: 'Едет один, второй остаётся' }, effects: [{ set: 'w.c39_depot', value: 'one' }],
      text: 'В понедельник на склад едет один из вас. Второй — на хуторе.' },
    { id: 'none', label: { default: 'Не едем' }, effects: [{ set: 'w.c39_depot', value: 'none' }],
      text: 'На склад вы не едете.' },
  ],
  compromises: [{ pair: ['both', 'one'], result: 'one' }, { pair: ['both', 'none'], result: 'one' }, { pair: ['one', 'none'], result: 'one' }],
  arbiters: [{ id: 'c39_depot_one', when: P39, winner: 'one', text: 'Вы не сходитесь. Едет один.' }],
  default: 'one',
};

export const point39Army: JointDecision = {
  id: 'c3_new_army39', checkpoint: 39, canParticipate: all(P39, army39),
  prompt: { default: 'Во вторник в пять — ворота казармы, два места у Тобиаса. В понедельник вечером надо быть у него. Последнее слово: уходите с армией за Эльбу — или остаётесь. Разные ответы — остаётесь.' },
  options: [
    { id: 'go', label: { default: 'Уходим с армией' }, effects: [{ set: 'w.c39_army', value: 'go' }],
      text: 'Во вторник вы уходите с армией.' },
    { id: 'stay', label: { default: 'Остаёмся' }, effects: [{ set: 'w.c39_army', value: 'stay' }],
      text: 'Вы остаётесь на хуторе. Тобиас отдаст места другим.' },
  ],
  compromises: [{ pair: ['go', 'stay'], result: 'stay' }],
  arbiters: [{ id: 'c39_army_stay', when: P39, winner: 'stay', text: 'Вы остаётесь.' }],
  default: 'stay',
};
