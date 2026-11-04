import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { P8 } from './point8';

export const finished8: Cond = all(P8, flag('A.c8_finished'), flag('B.c8_finished'));
const active8: Cond = all(finished8, flag('w.together'), { at: 'c7_farm_lane' },
  { partnerAt: 'c7_farm_lane' }, { cap: 'canAct', op: '>=', value: 1 }, { partner: 'active' });
const car8: Cond = all(active8, flag('A.c8_has_key'), { itemAt: 'opel_corsa', place: 'c7_farm_lane' });

export const point8Notes: MergeNote[] = [
  { id: 'c8_shared_facts', when: finished8, effects: [{ set: 'w.c8_met_bus', value: true }, { set: 'w.c8_nina_shared', value: true }],
    text: 'Вы сверяете события у дороги. Хельмут умер у старого колодца. Ева сходила к нему с Рут и вернулась к микроавтобусу. Павел сам подтвердил, что едет с Рут до большого перекрёстка.' },
  { id: 'c8_path_ready', when: all(finished8, flag('A.c8_path_ready')),
    effects: [{ set: 'w.c8_well_path_checked', value: true }],
    text: '{A} показывает безопасный проход у ручья: мостки повреждены, возле трубы можно пройти. За питьевой водой туда идти не надо.' },
  { id: 'c8_rumour', when: finished8, effects: [{ set: 'w.c8_east_rumour', value: true }],
    text: '{B} передаёт слова мужчины из грузовика о завале восточнее перекрёстка. Он сам его не видел. Рут едет только по своему известному маршруту; открытой дороги до города никто вам не обещал.' },
  { id: 'c8_nina_sent', when: all(finished8, { v: 'B.c8_nina', op: '==', value: 'sent' }, not({ v: 'w.c7_jens', op: '==', value: 'dead' })),
    effects: [{ set: 'w.c8_nina_status', value: 'sent' }],
    text: '{B} отправила Нине обновление: Йенс не отвечает, опасно бросается на людей и остаётся изолированным на хуторе. Ответа пока нет.' },
  { id: 'c8_nina_sent_death', when: all(finished8, { v: 'B.c8_nina', op: '==', value: 'sent' }, { v: 'w.c7_jens', op: '==', value: 'dead' }),
    effects: [{ set: 'w.c8_nina_status', value: 'sent' }],
    text: '{B} сообщила Нине, что Йенс погиб. Назвала адрес хутора, но не обещала, что к воротам можно подъехать без предупреждения. Ответа пока нет.' },
  { id: 'c8_nina_wait', when: all(finished8, not({ v: 'B.c8_nina', op: '==', value: 'sent' })),
    effects: [{ set: 'w.c8_nina_status', value: 'pending' }],
    text: 'Нового отправленного сообщения Нине нет. Сохранённый текст и бумажная записка не равны состоявшемуся разговору.' },
  { id: 'c8_pawel_go', when: all(finished8, not(flag('w.c8_pawel_left'))),
    effects: [{ set: 'w.c8_pawel_left', value: true }, { set: 'w.c8_home_kept', value: true },
      { npc: 'pawel', moveTo: 'c8_bus_east', set: { c8_with_ruth: true }, remember: 'c8_i_chose_ruths_bus' },
      { npc: 'c8_ruth', moveTo: 'c8_bus_east' }, { npc: 'c8_eva', moveTo: 'c8_bus_east' }],
  },
  { id: 'c8_bus_departed', when: finished8,
    text: 'Рут отъезжает. Павел машет из открытого окна; Ева сидит на своём месте. Вы остаётесь у остановки. Дальше можно выбрать свою дорогу.' },
];

export const point8Route: JointDecision = {
  id: 'c3_new_route8', checkpoint: 8, canParticipate: P8,
  prompt: { default: 'Павел уехал с Рут по своему выбору. Вы вправе вернуться на хутор: место и вещи у Хенрике сохраняются. Обратно около 4 км: пешком 55 минут, на Corsa — 20 минут и 0,26 л бензина. Если вернётесь пешком, машина останется там, где её оставили. На машине можно продолжить на восток, до следующего перекрёстка: 10 км, 35 минут и 0,64 л; слух о завале не проверен. Для поездок нужны машина рядом, ключ и топливо. Можно также остаться здесь. Разные ответы оставят вас у дороги, пока вы не договоритесь.' },
  rememberedBy: [],
  compromises: [
    { pair: ['home', 'east'], result: 'stay' },
    { pair: ['home', 'home_foot'], result: 'stay' },
    { pair: ['home_foot', 'east'], result: 'stay' },
  ],
  options: [
    { id: 'home', label: { default: 'Вернуться к Хенрике на Corsa: 20 минут, 0,26 л' },
      when: all(car8, { fuelIn: 'opel_corsa', liters: 0.26 }),
      feasible: all(car8, { has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 4 }),
      effects: [{ journey: { to: 'hof_luedemann', km: 4, minutes: 20, vehicle: 'opel_corsa' } },
        { set: 'w.c8_direction', value: 'home' }, { set: 'w.c8_home_kept', value: true },
        { npc: 'henrike', remember: 'c8_short_trip_returned', set: { c8_place_kept: true } }],
      text: 'Вы возвращаетесь на Corsa. Хенрике выходит к калитке. Вы говорите: Павел сел в попутку, вы привезли его к дороге и вернулись.\n\n— Мы место за собой оставляем, — говорите вы.\n\n— Я ваши вещи никуда не убирала, — отвечает Хенрике и открывает. Машину ставите у дома.' },
    { id: 'home_foot', label: { default: 'Вернуться пешком: около 55 минут; бензин не тратить' }, when: active8, feasible: active8,
      effects: [{ journey: { to: 'hof_luedemann', km: 4, minutes: 55 } },
        { set: 'w.c8_direction', value: 'home_foot' }, { set: 'w.c8_home_kept', value: true },
        { npc: 'henrike', remember: 'c8_short_trip_returned_on_foot', set: { c8_place_kept: true } }],
      text: 'Вы идёте обратно пешком. Хенрике открывает калитку. Вы рассказываете, что Павел сел в микроавтобус, а вы решили вернуться.\n\n— Ваше место ещё здесь, — говорит она. Вы проходите во двор со своими вещами.' },
    { id: 'east', label: { default: 'Ехать на Corsa до восточного перекрёстка: 35 минут, 0,64 л' },
      when: all(car8, { fuelIn: 'opel_corsa', liters: 0.64 }),
      feasible: all(car8, { has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 10 }),
      effects: [{ journey: { to: 'c8_east_road', km: 10, minutes: 35, vehicle: 'opel_corsa' } },
        { set: 'w.c8_direction', value: 'east' }, { set: 'w.c8_home_kept', value: true }],
      text: 'Вы едете на восток своей машиной и останавливаетесь перед большим перекрёстком. Микроавтобус Рут уже свернул. Дальняя дорога отсюда не видна. Вы пока не отказываетесь от хутора: обратный путь и оставшиеся там вещи сохраняются.' },
    { id: 'stay', label: { default: 'Пока остаться у дороги и передохнуть' }, when: P8, feasible: P8,
      effects: [{ if: finished8, then: [{ set: 'w.c8_direction', value: 'stay' }, { set: 'w.c8_home_kept', value: true }, { waitTogether: 10 }] }],
      text: 'Вы пока остаётесь у дороги. Рут и Павел уже уехали. Вы садитесь на несколько минут, прежде чем снова обсуждать путь. Место на хуторе от этого не потеряно.' },
  ],
  arbiters: [{ id: 'c8_no_trip_for_partner', when: P8, winner: 'stay',
    text: 'Общего направления пока нет. Ни один из вас не выбирает за другого. Вы остались у остановки; обратный путь на хутор открыт.' }],
  default: 'stay',
};
