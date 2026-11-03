import type { JointDecision, MergeNote, Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { P7, S7, atHome, room7, once7 } from './point7';

const twoActive: Cond = all({ cap: 'canAct', op: '>=', value: 1 }, { partner: 'active' });
const quietWork: Cond = all(P7, twoActive, atHome('deniz'),
  { any: [flag('A.c7_has_tool'), flag('A.c7_tools_deniz')] });
const fatalWork: Cond = all(P7, twoActive, atHome('deniz'), flag('A.c7_deniz_willing'), flag('A.c7_has_crowbar'));
const carRoute: Cond = all(P7, twoActive, atHome('pawel'), flag('A.c7_has_car_key'),
  { itemAt: 'opel_corsa', place: 'hof_luedemann' }, { fuelIn: 'opel_corsa', liters: 0.26 });
const walkRoute: Cond = all(P7, twoActive, atHome('pawel'));

export const dawn7Scenes: Scene[] = [
  S7({ id: 'c7_readiness', for: 'any', chapter: 'ch3', title: 'Перед ответом', camp: room7,
    text: [{ text: 'Хенрике собирает вас у стола. Йенс закрыт в фургоне и больше не отвечает на речь. Двое с дороги ещё у дальней сетки. К калитке никто не идёт без предупреждения.\n\nПавел стоит рядом с сумкой. Сейчас нужно решить, что делать с Йенсом, а затем — выходите ли вы с Павлом. Перед ответами вы показываете друг другу ключи и доступные инструменты.' }],
    actions: [
      { id: 'c7_ready_together', label: 'Сверить с партнёром оба общих решения', minutes: 3, terminal: true, goto: 'c7_checkpoint',
        text: 'Вы садитесь рядом, чтобы никто не отвечал за второго. Хенрике ждёт у ключа. Оле остаётся смотреть во двор.', effects: [{ set: '$.c7_finished', value: true }] },
      { id: 'c7_ready_house', label: 'Спросить Хенрике, можно ли вам остаться после этого утра', minutes: 2, combinable: true, when: once7('stay_allowed'),
        text: '«Место есть. Только работать дальше тоже придётся», — отвечает она. Павел слышит, что место для вас не зависит от его решения уходить.', effects: [{ set: '$.c7_stay_allowed', value: true }] },
      { id: 'c7_ready_promise', label: 'Перед ответом ещё раз назвать своё обещание Павлу', minutes: 2, combinable: true, when: once7('last_promise'),
        text: 'Ты называешь только то, что действительно обещано. Павел просит не заменять утренний ответ словами о вчерашней ночи.', effects: [{ set: '$.c7_last_promise', value: true }] },
    ],
  }),
  S7({ id: 'c7_checkpoint', for: 'any', chapter: 'ch3', title: 'Рассвет', checkpoint: 7, universal: false,
    ambient: { tempC: 16, outdoor: false, wet: false },
    onEnter: [
      { if: { has: 'crowbar' }, then: [{ set: '$.c7_has_crowbar', value: true }], else: [{ set: '$.c7_has_crowbar', value: false }] },
      { if: { has: 'multitool' }, then: [{ set: '$.c7_has_tool', value: true }], else: [{ set: '$.c7_has_tool', value: false }] },
      { if: { has: 'car_keys' }, then: [{ set: '$.c7_has_car_key', value: true }], else: [{ set: '$.c7_has_car_key', value: false }] },
    ],
    text: [{ text: 'Сначала ответ о Йенсе: оставить его под наблюдением, убрать гудок и закрыть обзор из кабины или разрешить Денизу убить его. Последний вариант требует согласия обоих.\n\nПотом ответ о дороге. На машине потратите бензин, пешком — больше времени и сил. При разных ответах вы останетесь здесь. Павел ждать ещё день не собирается.' }],
    actions: [],
  }),
];

export const point7Notes: MergeNote[] = [
  { id: 'c7_changed', when: P7, effects: [{ set: 'w.c7_jens', value: 'dangerous' }],
    text: 'Вы сравниваете увиденное: Йенс ещё дышит и двигается, но не отвечает на имена, бросается к людям и пытается кусать. Открывать ему дверь для обычного осмотра сейчас нельзя.' },
  { id: 'c7_lock_secure', when: all(P7, { v: 'A.c7_latch', op: '==', value: 'secure' }),
    text: 'Ночная проверка дверей помогла: утром Йенс не смог открыть кабину. Ключ остаётся у Хенрике.' },
  { id: 'c7_lock_other', when: all(P7, not({ v: 'A.c7_latch', op: '==', value: 'secure' })),
    text: 'Утром дверь фургона пришлось проверить ещё раз. Теперь замок закрыт. К окну по-прежнему не подходят.' },
  { id: 'c7_note_shared', when: all(P7, { any: [{ v: 'B.c7_note', op: '==', value: 'house' }, { v: 'B.c7_note', op: '==', value: 'pawel' }, flag('B.c7_share_nina')] }),
    effects: [{ set: 'w.c7_nina_shared', value: true }],
    text: '{B} рассказывает о Нине — человеке, с которым живёт Йенс. Он просил передать ей сообщение. Имя и просьбу вы теперь знаете оба; личный номер вслух не читаете.' },
  { id: 'c7_note_host', when: all(P7, { v: 'B.c7_note', op: '==', value: 'house' }), text: 'Записка Йенса осталась у Хенрике. Она согласилась хранить её для следующей попытки связи.' },
  { id: 'c7_note_pawel', when: all(P7, { v: 'B.c7_note', op: '==', value: 'pawel' }), text: 'Записка Йенса у Павла. Он убрал её в сухой карман и обещал искать связь по дороге.' },
  { id: 'c7_sms_public', when: all(P7, { v: 'B.c7_message', op: '==', value: 'sent' }, flag('w.c7_nina_shared')), text: '{B} успела отправить согласованный текст. Подтверждения прочтения Ниной нет; считать помощь уже вызванной нельзя.' },
  { id: 'c7_gift_water', when: all(P7, { v: 'B.c7_gift', op: '==', value: 'water' }), text: 'Павел показывает бутылку, которую ему дала {B}. Воду он сберёг на дорогу.' },
  { id: 'c7_gift_food', when: all(P7, { v: 'B.c7_gift', op: '==', value: 'food' }), text: 'Павел сохранил готовую порцию {B.gen} в своей сумке. На дорогу еда у него есть.' },
  { id: 'c7_receipt', when: all(P7, { v: 'A.c7_receipt', op: '==', value: 'presence' }), text: 'В кабине осталась накладная с записью {A.gen}: Йенс остановился у хутора и получил воду. Он успел прочитать подпись ещё ночью.' },
  { id: 'c7_deniz', when: all(P7, flag('A.c7_deniz_willing'), atHome('deniz')), text: 'Дениз ждёт вашего решения. Он готов отключить гудок; готов и убить Йенса, если вы оба и Хенрике это разрешите. Сам открывать кабину он не станет.' },
];

export const point7Van: JointDecision = {
  id: 'c3_new_van7', checkpoint: 7, canParticipate: P7,
  prompt: { default: 'Йенс бросается на людей через стекло. У стекла появилась трещина. Можно продолжать наблюдать из дома. Можно дать Денизу отключить гудок и прикрыть стёкла: Йенс не будет видеть людей, а двое с дороги не услышат нового сигнала. Дениз также готов убить Йенса, если вы оба и Хенрике согласитесь. Лом {A.gen} после этого вам не вернут. При разных ответах кабину оставят закрытой под наблюдением.' },
  rememberedBy: ['henrike', 'ole', 'deniz'],
  // Арбитр движка выбирает только среди предложенных вариантов. При quiet/stop
  // безопасный hold не входит в эту пару, поэтому задаём его явным компромиссом.
  compromises: [{ pair: ['quiet', 'stop'], result: 'hold' }],
  options: [
    { id: 'hold', label: { default: 'Оставить Йенса в закрытой кабине; продолжать наблюдение' }, when: P7, feasible: P7,
      effects: [{ set: 'w.c7_jens', value: 'contained' }, { set: 'w.c7_van_watch', value: true }, { waitTogether: 5 }],
      text: 'Хенрике убирает ключ. Никто не открывает дверь. За машиной продолжают смотреть из дома: Йенс ещё может снова задеть сигнал или повредить стекло. Вы оставили угрозу снаружи, но она не исчезла.' },
    { id: 'quiet', label: { default: 'Дать Денизу отключить сигнал и закрыть обзор из кабины; сохранить Йенса изолированным' }, when: quietWork,
      feasible: all(quietWork, { any: [{ has: 'multitool' }, flag('A.c7_tools_deniz')] }),
      effects: [{ set: 'w.c7_jens', value: 'quieted' }, { set: 'w.c7_van_watch', value: true }, { set: 'w.c7_van_horn_off', value: true },
        { if: flag('A.c7_tools_ready'), then: [{ waitTogether: 12 }], else: [{ waitTogether: 16 }] }],
      text: 'Оле следит за дальней сеткой. Дениз отключает провод гудка у бампера и прикрывает стёкла оставленным одеялом. Дверь кабины не открывает. Йенс перестаёт бросаться на стекло. Дениз возвращается к калитке; наблюдение за машиной остаётся.',
    },
    { id: 'stop', label: { default: 'Передать Денизу лом {A.gen} и вместе разрешить убить Йенса' }, when: fatalWork, feasible: all(fatalWork, { has: 'crowbar' }),
      effects: [{ handOver: 'crowbar', toNpc: 'deniz' }, { set: 'w.c7_jens', value: 'dead' }, { set: 'w.c7_van_watch', value: false }, { set: 'w.c7_van_horn_off', value: true }, { waitTogether: 10 }, { body: 'stress', delta: 10 }, { body: 'stress', delta: 10, target: 'B' }, { npc: 'deniz', set: { c7_killed_jens: true }, remember: 'c7_they_agreed_to_stop_jens' }],
      text: 'Вы оба произносите своё согласие. Хенрике отдаёт ключ Денизу. Он просит закрыть кухонное окно и отойти. После короткого шума в кабине становится тихо. Йенс погиб. Дениз возвращается один; использованный лом в дом не вносит и вам не отдаёт. Двое с дороги всё ещё за оградой.' },
  ],
  arbiters: [{ id: 'c7_no_irreversible_by_disagreement', when: P7, winner: 'hold', text: 'Общего согласия на выход к машине или смертельное действие нет. Хенрике сохраняет ключ и закрытую кабину. За фургоном продолжают следить.' }], default: 'hold',
};

export const point7Departure: JointDecision = {
  id: 'c3_new_depart7', checkpoint: 7, canParticipate: P7,
  prompt: { default: 'Утренний выход проверен. Павел хочет уйти сейчас. Можно выехать втроём на Corsa до дороги к Йестебургу: около четырёх километров и 0,26 л бензина, машина останется с вами. Можно идти вместе пешком через дальнюю ограду: дольше и тяжелее, Corsa останется у дома. Можно остаться на хуторе, тогда Павел выйдет сам. Если вчера обещали уйти вместе, отказ нужно сказать ему прямо. Разные ответы оставят вас на хуторе: ни дорогу, ни машину за другого человека никто не выбирает.' },
  rememberedBy: ['pawel', 'henrike'],
  compromises: [{ pair: ['car', 'walk'], result: 'stay' }],
  options: [
    { id: 'car', label: { default: 'Выехать с Павлом на Corsa; потратить бензин и забрать машину' }, when: carRoute, feasible: all(carRoute, { has: 'car_keys' }, { fuelFor: 'opel_corsa', km: 4 }),
      effects: [
        { if: { v: 'A.c7_dawn_exit', op: '==', value: 'car' }, then: [{ journey: { to: 'c7_farm_lane', km: 4, minutes: 20, vehicle: 'opel_corsa' } }], else: [{ journey: { to: 'c7_farm_lane', km: 4, minutes: 25, vehicle: 'opel_corsa' } }] },
        { npc: 'pawel', moveTo: 'c7_farm_lane', set: { c7_left_with_pair: true }, remember: 'c7_they_took_me_in_their_car' }, { set: 'w.c7_departure', value: 'car' }, { set: 'w.c7_promise_kept', value: true },
      ],
      text: 'Хенрике открывает ворота. Оле машет со своего места: двое ещё у сетки. Павел садится сзади со своей сумкой. Вы выезжаете на Corsa и добираетесь до дороги к Йестебургу втроём. Павел опускает стекло на два пальца и долго молчит. Следующего ночлега у вас пока нет.' },
    { id: 'walk', label: { default: 'Выйти с Павлом пешком; сберечь бензин, оставить машину у Хенрике' }, when: walkRoute, feasible: walkRoute,
      effects: [
        { if: { v: 'A.c7_dawn_exit', op: '==', value: 'walk' }, then: [{ journey: { to: 'c7_farm_lane', km: 4, minutes: 55 } }], else: [{ journey: { to: 'c7_farm_lane', km: 4, minutes: 65 } }] },
        { npc: 'pawel', moveTo: 'c7_farm_lane', set: { c7_left_with_pair: true }, remember: 'c7_they_walked_out_with_me' }, { set: 'w.c7_departure', value: 'walk' }, { set: 'w.c7_promise_kept', value: true },
      ],
      text: 'У дальнего столба вы сначала передаёте вещи, затем помогаете Павлу перебраться. Хенрике закрепляет сетку за вами. Corsa остаётся у дома, ключи вы сохраняете. До дороги идёте в темпе того, кому труднее; сумка Павла всё время при нём. Вы вышли вместе, но теперь дальше придётся идти своими ногами.' },
    { id: 'stay', label: { default: 'Остаться на хуторе; дать Павлу выйти одному' }, when: P7, feasible: P7,
      effects: [{ set: 'w.c7_departure', value: 'stay' }, { set: 'w.c7_promise_kept', value: false }, { npc: 'pawel', moveTo: 'c7_farm_lane', set: { c7_left_alone: true }, remember: 'c7_i_left_without_them' }],
      text: 'Вы говорите Павлу, что остаётесь и с ним не пойдёте. Он не просит ещё раз передумать. Хенрике помогает ему выйти с сумкой и закрывает проход. Некоторое время вы ещё видите его куртку за сеткой. Потом Павел скрывается за поворотом.' },
  ],
  arbiters: [{ id: 'c7_no_road_without_two', when: P7, winner: 'stay', text: 'Способ общего выхода вы не согласовали. Пара остаётся на хуторе. Павел не давал обещания ждать ещё день и выходит сам.' }], default: 'stay',
};
