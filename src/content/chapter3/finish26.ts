import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P26, brandtAlly, brandtBroken, brandtHostile, carLoss, oleNow, rationLoss } from './point26';

export const finished26: Cond = all(P26, any(flag('A.c26_finished'), flag('B.c26_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished26, when), text });
const w = (key: string): Cond => flag(`w.c26_${key}`);

// Сверка в среду в половине девятого.
export const point26Notes: MergeNote[] = [
  N('c26_timm_owes', flag('w.c26_timm_owes'), 'Фрау Тимм в Люллау считает, что обязана вам: из-за {A.gen} её невестка с внуком не замёрзли в канаве.'),
  N('c26_timm_cold', flag('w.c26_timm_cold'), 'Фрау Тимм знает, что {A} видел её невестку в канаве у Паттензена и не остановился.'),
  N('c26_nina_gun', v('w.c26_nina_gun', 'taught'), '{A} научил Нину стрелять из ружья Людеманов. Два патрона ушло на банку за хлевом.'),
  N('c26_child', flag('w.c26_child'), 'В пункте был мальчик четырёх лет с сильным жаром. {B} была там, пока Зандер была у Брандта.'),
  N('c26_jars', flag('w.c26_jars'), 'На чердаке нашлись банки с тушёнкой Хенрике — теперь они в кладовке.'),
  N('c26_car', carLoss, 'Corsa отогнали к пожарной части: «предупреждённые не ездят». Ключи у Тобиаса. Он обещал, что никто на ней не поедет.'),
  N('c26_car_fuel', w('car_fuel_kept'), 'Бензин в баке Corsa оставили.'),
  N('c26_ration', rationLoss, 'Хутору урезали паёк вдвое до восьмого декабря: за давний отказ.'),
  N('c26_hollow', w('hollow_seen'), 'С холма за Ханштедтом видна впадина у стоянки на автобане. Она серая от людей в больничном. Их там сотни, и каждый день больше.'),
  N('c26_uwe', w('uwe'), 'Рыжеусого пожарного зовут Уве. Он извинился за среду. Один раз.'),
  N('c26_meat', w('meat_got'), '{A} принёс из Люллау от фрау Тимм шесть кило говядины и пять литров молока.'),
  N('c26_timm_again', w('timm_again'), 'Фрау Тимм зовёт ещё: у неё два бычка, кормов до весны не хватит.'),
  N('c26_diesel_owed', w('diesel_owed'), 'Фрау Тимм обещаны пять литров солярки. Завтра.'),
  N('c26_ham_owed', w('ham_owed'), 'Фрау Тимм обещан копчёный окорок. В пятницу.'),
  N('c26_salt', v('w.c26_meat', 'salt'), 'Мясо засолили в бочонке. Через шесть недель будет солонина.'),
  N('c26_share', v('w.c26_meat', 'share'), 'Часть мяса отнесли Кёлер и Уте.'),
  N('c26_broth', w('broth_for_point'), 'Половину мяса отложили для пункта Зандер: бульон для тех, кто в жару.'),
  N('c26_ally', brandtAlly, 'Брандт выслушал правду про плазму и Матса. Снял каску. «Тогда расчистим впадину. Это хотя бы настоящее».'),
  N('c26_broken', brandtBroken, 'Брандт выслушал правду и сломался: «Идите. Все. Идите по домам». Дружина расходится.'),
  N('c26_hostile', brandtHostile, 'Брандт выслушал правду и выгнал: «Кто будет это пересказывать, вылетит из списка».'),
  N('c26_shift', w('b_shift'), '{B} отработала первую смену в пункте у Зандер.'),
  N('c26_pia', w('pia_worse'), 'Девочке в задней комнате пункта хуже. Завтра её переведут в запертую комнату.'),
  N('c26_lea', w('lea_stays_point'), 'Лея пока не пойдёт в Ганновер: в пункте от неё польза, и там её никто не колет.'),
  N('c26_plasma', w('plasma_spoiled'), 'Плазма в кладовке испортилась. Её вылили в снег за хлевом.'),
  N('c26_seed_kept', w('seed_kept'), 'Нина хотела взять семенную картошку. Её вернули обратно: это весна.'),
  N('c26_seed_used', w('seed_used'), 'Шесть картофелин из семенных ящиков пошли в суп.'),
  N('c26_seed_count', w('seed_counted'), 'Семенной картошки — восемь ящиков, около ста шестидесяти кило. Посадить — гектар. Съесть — две недели на всех.'),
  N('c26_ole', oleNow, 'Тобиас привёз Оле домой. Хенрике с ним.'),
  N('c26_postman_east', w('postman_east'), 'Вечером Почтальон уходит вдоль лесополосы на восток, к впадине.'),
  N('c26_postman_led', w('postman_led'), '{A} стуком по ведру увёл Почтальона к дороге на Ханштедт.'),
  N('c26_roof', w('roof_clear'), 'С крыши сарая сброшен снег.'),
  N('c26_postman', w('postman'), 'У лесополосы каждый день стоит один, в белом, лицом к хутору. Нина назвала его Почтальоном.'),
];

export const point26Meet: JointDecision = {
  id: 'c3_new_meet26', checkpoint: 26, canParticipate: P26,
  prompt: { default: 'Завтра в Люнебурге кончится плазма. Можно заранее пойти к Касе, к её сыну. Можно приготовить дома место на случай, если кто-то придёт. Можно закрыть ворота для всех до воскресенья. Разные ответы — готовить место.' },
  options: [
    { id: 'go', label: { default: 'Пойти к Касе заранее' }, effects: [{ set: 'w.c26_plan', value: 'go' }],
      text: 'Завтра {B} пойдёт в Люнебург, к Касе. С фургоном прачечной или как получится.' },
    { id: 'ready', label: { default: 'Приготовить место дома' }, effects: [{ set: 'w.c26_plan', value: 'ready' }],
      text: 'Вы приготовите в доме место. Солому, одеяла, воду. На случай, если завтра кто-то постучит.' },
    { id: 'door', label: { default: 'Закрыть ворота для всех до воскресенья' }, effects: [{ set: 'w.c26_plan', value: 'door' }],
      text: 'Ворота — на цепь. До воскресенья никого. Вы и так кормите больше, чем можете.' },
  ],
  compromises: [{ pair: ['go', 'ready'], result: 'ready' }, { pair: ['go', 'door'], result: 'ready' }, { pair: ['ready', 'door'], result: 'ready' }],
  arbiters: [{ id: 'c26_meet_ready', when: P26, winner: 'ready', text: 'Вы не сходитесь. Готовите место.' }],
  default: 'ready',
};

export const point26Seed: JointDecision = {
  id: 'c3_new_seed26', checkpoint: 26, canParticipate: P26,
  prompt: { default: 'Семенная картошка: восемь ящиков в подвале. Можно не трогать: весной посадить. Можно взять половину на еду сейчас. Можно отдать два ящика фрау Тимм за мясо и молоко на всю зиму. Разные ответы — не трогать.' },
  options: [
    { id: 'keep', label: { default: 'Не трогать: весной посадить' }, effects: [{ set: 'w.c26_seed', value: 'keep' }],
      text: 'Ящики «Saat» остаются в подвале. Весна.' },
    { id: 'half', label: { default: 'Половину — на еду сейчас' }, effects: [{ set: 'w.c26_seed', value: 'half' }, { place: 'potatoes', at: 'c3_farm_stock', qty: 80 }],
      text: 'Четыре ящика поднимают из подвала на кухню. Остальные четыре — весне.' },
    { id: 'trade', label: { default: 'Два ящика — фрау Тимм за мясо и молоко' }, effects: [{ set: 'w.c26_seed', value: 'trade' }],
      text: 'Два ящика уйдут в Люллау. Взамен фрау Тимм будет давать молоко до весны и мясо, когда будет резать.' },
  ],
  compromises: [{ pair: ['keep', 'half'], result: 'keep' }, { pair: ['keep', 'trade'], result: 'keep' }, { pair: ['half', 'trade'], result: 'keep' }],
  arbiters: [{ id: 'c26_seed_keep', when: P26, winner: 'keep', text: 'Вы не сходитесь. Ящики не трогаете.' }],
  default: 'keep',
};
