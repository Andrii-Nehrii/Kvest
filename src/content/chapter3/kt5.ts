import type { CheckpointDef, JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { atAny, partnerAtAny } from '../chapter2/world2';
import { all, flag, not, together } from './world3';

const GROUPS = [
  ['a_flat', 'a_stairs', 'a_yard'], ['b_flat', 'b_stairs', 'b_okafor'], ['hof_luedemann', 'farm_coop'],
  ...['deniz_workshop', 'ahrensburg', 'north_gym', 'messe', 'messe_q', 'c3_messe_yard'].map((x) => [x]),
];
const same: Cond = { any: GROUPS.map((places) => all(atAny(places), partnerAtAny(places))) };
const share: Effect[] = ['f_c3_well', 'f_c3_exchange', 'f_c3_okafor', 'f_c3_messe_closed', 'f_farm', 'f_deniz_shelter'].map((f) => ({ if: { partnerKnows: f }, then: [{ learn: f, source: 'partner' }] }));
function notes(n: number): MergeNote[] {
  return [
    { id: 'c3_risk', group: 'risk', when: { any: [{ injured: 'bite' }, { injured: 'scratch', minSeverity: 2 }, { body: 'coreTemp', op: '>=', value: 37.8 }] }, effects: [{ set: '$.check_risk', value: true }] },
    { id: 'c3_clear', group: 'risk', effects: [{ set: '$.check_risk', value: false }] },
    { id: 'c3_coop_clear', when: all({ at: 'farm_coop' }, not(flag('$.check_risk')), not(flag('$.c3_coop_clear')), not(flag('$.c3_new_coop'))), effects: [{ set: '$.c3_coop_clear', value: true }], text: 'Хенрике ещё раз смотрит на цифры. Потом снимает цепочку с двери. — Утром в дом. Воду сам{m:|а} принесёшь.' },
    { id: `c${n}_met`, group: 'meet', when: same,
      effects: [{ set: `$.c${n}_met`, value: true }, { set: 'w.together', value: true }, ...share],
      text: 'Вы сверяете, что удалось сделать и что осталось. {partner} слушает, не перебивая. Потом говорит о своём дне. За несколько минут на завтрашней странице становится тесно.' },
    { id: `c${n}_apart`, group: 'meet', effects: [{ set: 'w.together', value: false }], text: 'День кончился, а вы всё ещё порознь. Ты записываешь, где находишься и что нужно на завтра. Без лишних слов.' },
    { id: `c${n}_call`, when: all(not(same), { callable: true }), effects: share,
      text: 'Связь держится недолго. Вы успеваете назвать места и самое нужное. Потом вместо голоса — короткие гудки.' },
  ];
}
const repairPlace: Cond = { any: [
  all(atAny(['hof_luedemann', 'farm_coop']), partnerAtAny(['hof_luedemann', 'farm_coop']), not(flag('proj.c3_fence.done'))),
  all({ at: 'deniz_workshop' }, { partnerAt: 'deniz_workshop' }, not(flag('proj.c3_ws_door.done'))),
  ...(['a', 'b'] as const).map((p) => all({ at: `${p}_flat` }, { partnerAt: `${p}_flat` }, not(flag(`proj.c3_shutters_${p}.done`)))),
] };
const short: Cond = { any: ['farm', 'a', 'b', 'ws'].map((id) => ({ v: `base.c3_${id}.shortDays`, op: '>=', value: 1 })) };
const tired: Cond = { any: [{ body: 'fatigue', op: '>=', value: 70 }, { any: [flag('A.c3_tired'), flag('B.c3_tired')] }] };
const set = (key: string, value: string): Effect[] => [{ set: key, value }];
export const focus: JointDecision = {
  id: 'c3_focus', checkpoint: 5,
  prompt: { default: 'На всё сразу сил не хватает. Что сделать главным делом завтрашнего дня?' },
  options: [
    { id: 'supply', label: { default: 'Сначала вода и еда' }, effects: set('w.c3_focus', 'supply'), text: 'Сначала запас на следующий день. Остальное — если останутся время и силы.' },
    { id: 'repair', label: { default: 'Сначала закончить ремонт' }, feasible: all(together, repairPlace), effects: set('w.c3_focus', 'repair'), text: 'Сначала закончить начатое. Без этого каждый день уходит на одно и то же.' },
    { id: 'rest', label: { default: 'Уменьшить нагрузку и отдохнуть' }, effects: set('w.c3_focus', 'rest'), text: 'Не брать лишнего. Один спокойный день ещё нужно суметь себе позволить.' },
  ],
  compromises: [['supply', 'repair'], ['supply', 'rest'], ['repair', 'rest']].map(([x, y]) => ({ pair: [x, y], result: 'rest', when: not(together) })),
  arbiters: [
    { id: 'apart', when: not(together), winner: 'rest', text: 'Вы в разных местах. Каждый бережёт силы там, где оказался.' },
    { id: 'short', when: short, winner: 'supply', text: 'В общем запасе уже не хватает на всех. Эту строку нельзя перенести ещё на день.' },
    { id: 'tired', when: tired, winner: 'rest', text: 'Тело не успевает восстановиться. На завтра придётся оставить меньше работы.' },
    { id: 'repair', when: repairPlace, winner: 'repair', text: 'Работа уже начата и всё ещё не закончена. Сначала убрать эту опасность.' },
    { id: 'rest', when: { always: true }, winner: 'rest', text: 'Ночь не добавит лишних рук. Завтра вы не берёте больше, чем можете сделать.' },
  ], default: 'rest',
};
const sheltered = atAny(['a_flat', 'b_flat', 'hof_luedemann', 'deniz_workshop', 'ahrensburg', 'north_gym']);
export const next: JointDecision = {
  id: 'c3_next', checkpoint: 6, prompt: { default: 'Четвёртый вечер. Что считать главным на ближайшие дни?' },
  options: [
    { id: 'settle', label: { default: 'Обустраиваться здесь надолго' }, feasible: all(together, same, sheltered), effects: set('w.c3_next', 'settle'), text: 'Пока остаться здесь. Считать запас, чинить, договариваться с теми, кто рядом.' },
    { id: 'watch', label: { default: 'Пока наблюдать и беречь запас' }, effects: set('w.c3_next', 'watch'), text: 'Не обещать себе лишнего. Сначала пережить следующий день и узнать, что вокруг.' },
    { id: 'search', label: { default: 'Готовиться искать другое место' }, effects: set('w.c3_next', 'search'), text: 'Собираться постепенно. Дорога начинается со списка, а не с открытой двери.' },
  ],
  compromises: [['settle', 'watch'], ['settle', 'search'], ['watch', 'search']].map(([x, y]) => ({ pair: [x, y], result: 'watch', when: not(together) })),
  arbiters: [{ id: 'observe', when: { always: true }, winner: 'watch', text: 'Пока нельзя обещать ни дорогу, ни постоянное место. Вы оставляете себе время посмотреть.' }], default: 'watch',
};
export const checkpoints3: CheckpointDef[] = [
  { index: 5, title: 'Третий вечер', syncNotBefore: at(12, 20), joint: ['c3_focus'], onMerge: [
    { id: 'tired', when: { body: 'fatigue', op: '>=', value: 70 }, effects: [{ set: '$.c3_tired', value: true }] },
    ...notes(5),
  ], next: { A: [{ scene: 'c6_start' }], B: [{ scene: 'c6_start' }] } },
  { index: 6, title: 'Четвёртый вечер', syncNotBefore: at(13, 20), joint: ['c3_next'], onMerge: notes(6), next: { A: [{ scene: 'c7_start' }], B: [{ scene: 'c7_start' }] } },
];
