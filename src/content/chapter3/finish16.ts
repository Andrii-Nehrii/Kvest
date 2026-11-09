import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P16, garden16 } from './point16';

export const finished16: Cond = all(P16, flag('A.c16_finished'), flag('B.c16_finished'));
const v = (key: string, value: string): Cond => ({ v: key, op: '==', value });
const any = (...xs: Cond[]): Cond => ({ any: xs });

// Сверка за ужином: каждый рассказывает свой кусок дня. Видят оба.
export const point16Notes: MergeNote[] = [
  { id: 'c16_band', when: all(finished16, any(v('A.c16_aby', 'band'), v('A.c16_aby', 'photo'), v('A.c16_aby', 'look'))),
    text: '{A} рассказывает про мальчика в спортзале. Его укусил босой человек в больничной рубашке, с браслетом «Klinikum Buchholz, Station 4». Из больницы, а не из колонии.' },
  { id: 'c16_band_item', when: all(finished16, v('A.c16_aby', 'band')), text: 'Браслет лежит на столе между тарелками. Застёжка сломана.' },
  { id: 'c16_grandson', when: all(finished16, v('A.c16_mother', 'who')), text: 'Мать мальчика — дочь Брандта. Брандт ищет, кто укусил его внука.' },
  { id: 'c16_told_brandt', when: all(finished16, any(garden16('help'), garden16('away')), flag('B.c16_bk2')),
    text: '{B} рассказывает про Кёлер. Брандту про колонию сказала она, утром, после мальчика. В четвёртой парцелле её брат.' },
  { id: 'c16_told_army', when: all(finished16, garden16('tell'), flag('B.c16_bk2')),
    text: '{B} рассказывает про Кёлер. Брандт узнал про колонию от армии и спрашивал у неё, кто там. В четвёртой парцелле её брат.' },
  { id: 'c16_koehler_walk', when: all(finished16, flag('B.c16_koehler_walk')), text: 'Завтра в девять Кёлер придёт: она хочет увидеть брата до среды и боится идти одна.' },
  { id: 'c16_kai_rope', when: all(finished16, flag('B.c16_bj2')),
    text: '{B} рассказывает про Яннеса. Уте сняла с Кая цепь с ноги, оставила только верёвку вокруг пояса. Говорит, он на неё посмотрел.' },
  { id: 'c16_kai_seen', when: all(finished16, flag('A.c16_col')),
    text: '{A} заходил в колонию на обратном пути и видел Кая без цепи. Верёвка завязана бантиком. Уте сказала: «Тогда мы погуляем раньше. Он и я».' },
  { id: 'c16_pump', when: all(finished16, flag('B.c16_bj')), text: 'В колонии сломался насос: отломилась ручка. Воду Яннес возит на тачке.' },
  { id: 'c16_tractor', when: all(finished16, flag('w.c16_tractor_known')),
    text: 'Трактор Хенрике стоит у Дениза в мастерской. Оле пригнал его неделю назад чинить сцепление. Готов, ключ в замке. Семь километров.' },
  { id: 'c16_ute_sms', when: all(finished16, flag('B.c16_us')), text: 'Вечером Уте написала {B.dat}: «Завтра прогулка. Не беспокойтесь».' },
  { id: 'c16_ute_sms_bach', when: all(finished16, v('B.c16_us', 'ask')), text: '«Он и я. Как раньше. Вдоль ручья».' },
  { id: 'c16_nina_knows', when: all(finished16, flag('w.c16_nina_knows')), text: 'Нина знает, что в среду к колонии придут солдаты. {A} сказал ей сам.' },
  { id: 'c16_notebook', when: all(finished16, flag('B.c16_cel_all')),
    text: 'В подвале тетрадь Хенрике: кого она кормила по понедельникам. Кёлер, «семья Бар», «мальчик обходчика». Внизу: «Если меня не будет — продолжайте».' },
  { id: 'c16_note_henrike', when: all(finished16, v('A.c16_doc', 'note')), text: 'Записка Хенрике ушла с машиной на Люнебург. Ответ, если будет, послезавтра.' },
  { id: 'c16_plasma', when: all(finished16, v('A.c16_doc', 'blood')), text: 'Врач пункта сказала {A.dat}: у переболевших берут плазму. «Добровольно, говорят».' },
  { id: 'c16_radio', when: all(finished16, v('B.c16_bba', 'radio')), text: 'В доме теперь есть радио: приёмник Хенрике из сарая, на батарейках {B.gen}.' },
  { id: 'c16_bread', when: all(finished16, v('B.c16_bb', 'bake')), text: 'На кухне остывают два кирпичика хлеба из муки Кёлер.' },
  { id: 'c16_tractor', when: all(finished16, flag('w.c16_tractor')), text: 'Под навесом стоит трактор Хенрике: {A} пригнал его из мастерской Дениза. Солярки на треть бака.' },
  { id: 'c16_road_band', when: all(finished16, flag('A.c16_saw_band'), { not: flag('A.c16_aby') }), text: '{A} видел ещё одного из больницы: босого, в рубашке, с пластиковым браслетом «Klinikum Buchholz».' },
  { id: 'c16_bell', when: all(finished16, flag('A.c16_bell')), text: 'В Йестебурге били в колокол: на краю деревни был ещё один из больницы, с таким же браслетом. Брандт видел его руку сам.' },
  { id: 'c16_b_colony', when: all(finished16, v('B.c16_route', 'colony')), text: '{B} ходила с Яннесом в колонию и видела Уте: цепи на Кае нет, она поёт ему целыми днями.' },
  { id: 'c16_walk', when: all(finished16, flag('B.c16_heard_walk')), text: 'Уте сказала {B.dat}: «Завтра мы пойдём гулять. Он и я». Без цепи.' },
  { id: 'c16_nina_went', when: all(finished16, flag('w.c16_nina_went')), text: 'Нина ходила в колонию к отцу с Яннесом и вернулась в сумерках одна.' },
  { id: 'c16_lena', when: all(finished16, flag('w.c16_lena_promise')), text: 'Маме Лены обещали: Нину заберут, чтобы она увидела отца.' },
  { id: 'c16_wires', when: all(finished16, flag('w.c16_jannes_wires')), text: 'Яннес умеет с проводами и предложил помочь с генератором.' },
  { id: 'c16_marcus', when: all(finished16, flag('A.c16_alo')), text: '{A} видел в пункте Маркуса и Лео. Бабушка в Целле не отвечает, Маркус собирается идти пешком.' },
  { id: 'c16_merle', when: all(finished16, flag('w.c16_merle_insulin')), text: 'Мерле жива, в Аренсбурге. Инсулина до пятницы. {B} обещала спросить у врача.' },
  { id: 'c16_coop', when: all(finished16, flag('w.c16_coop_open')), text: 'Курятник весь вечер простоял открытым: закрыть его было некому.' },
  { id: 'c16_marcus_wait', when: all(finished16, flag('w.c16_marcus_waits')), text: 'Маркус обещал подождать ответа бабушки ещё два дня.' },
  { id: 'c16_marcus_farm', when: all(finished16, flag('w.c16_marcus_invited')), text: 'Маркусу сказали: если не дойдут до Целле, пусть приходят на хутор.' },
  { id: 'c16_warned', when: all(finished16, flag('w.c16_warned_jannes')), text: 'Когда в поле стреляли, Яннеса предупредили. В колонии погасили свет.' },
  { id: 'c16_fuel', when: all(finished16, flag('A.c16_fuel')), text: 'У сарая стоит канистра {A.gen}: два литра бензина из деревни.' },
];

export const point16Albers: JointDecision = {
  id: 'c3_new_albers16', checkpoint: 16, canParticipate: P16,
  prompt: { default: 'Тобиас просит спрятать его мать, Маргит Альберс, у вас в сарае до четверга, пока на насыпи всё не кончится. Она обращённая. Он сам привезёт её в половине седьмого утра на цепи и в шлеме. Разные ответы — отказать.' },
  options: [
    { id: 'take', label: { default: 'Взять её в сарай до четверга' },
      effects: [{ set: 'w.c16_albers', value: 'take' }, { if: { npc: 'c15_tobias', alive: true }, then: [{ npc: 'c15_tobias', trust: 3, remember: 'c16_they_took_mother' }] }],
      text: 'Ты пишешь Тобиасу одно слово: «Ja». Через минуту приходит ответ: «Halb sieben». В половине седьмого.' },
    { id: 'no', label: { default: 'Отказать Тобиасу' },
      effects: [{ set: 'w.c16_albers', value: 'no' }, { if: { npc: 'c15_tobias', alive: true }, then: [{ npc: 'c15_tobias', remember: 'c16_they_refused' }] }],
      text: 'Ты пишешь Тобиасу: «Nein. Es tut uns leid». Нет. Простите. Ответ не приходит. Через час ты проверяешь ещё раз. Две серые галочки: прочитал.' },
  ],
  compromises: [{ pair: ['take', 'no'], result: 'no' }],
  arbiters: [{ id: 'c16_albers_no', when: P16, winner: 'no', text: 'Вы не сходитесь. Без согласия обоих в сарай никого не берёте.' }],
  default: 'no',
};

export const point16Sweep: JointDecision = {
  id: 'c3_new_sweep16', checkpoint: 16, canParticipate: P16,
  prompt: { default: 'В среду в восемь Брандт и солдаты придут к колонии. Можно этой ночью сходить к Уте и предупредить, утром пойти к Брандту и попробовать его остановить или не вмешиваться. Если не сойдётесь: ночь и Брандт — к Брандту, в остальных случаях — не вмешиваетесь.' },
  options: [
    { id: 'warn', label: { default: 'Сегодня ночью сходить к Уте и предупредить' },
      effects: [{ set: 'w.c16_sweep', value: 'warn' }],
      text: 'Вы надеваете всё тёплое, что есть. Фонарь заклеиваете красной изолентой, как у Яннеса.' },
    { id: 'brandt', label: { default: 'Утром пойти к Брандту и попробовать его остановить' },
      effects: [{ set: 'w.c16_sweep', value: 'brandt' }],
      text: 'Утром в девять Брандт открывает ворота пожарной части. До этого надо выспаться и решить, что ему сказать.' },
    { id: 'stay', label: { default: 'Не вмешиваться: это решат без вас' },
      effects: [{ set: 'w.c16_sweep', value: 'stay' }],
      text: 'Вы остаётесь дома. Это решат без вас. Так, по крайней мере, вы говорите друг другу.' },
  ],
  compromises: [
    { pair: ['warn', 'brandt'], result: 'brandt' }, { pair: ['warn', 'stay'], result: 'stay' }, { pair: ['brandt', 'stay'], result: 'stay' },
  ],
  arbiters: [{ id: 'c16_sweep_stay', when: P16, winner: 'stay', text: 'Вы не сходитесь. Вы не вмешиваетесь.' }],
  default: 'stay',
};
