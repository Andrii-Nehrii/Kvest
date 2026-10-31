import type { ActionDef, Scene, TextBlock } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { waitHour } from '../chapter1/common';
import { all, day, evening, flag, not } from './world3';

import { segmentDay, segmentEnd } from './clock';
import { afternoons, nights } from './atmosphere';

export const once = (id: string, extra: Effect[] = []): Effect[] => [
  { set: `$.${id}`, value: true },
  ...extra,
];
export function task(
  n: number,
  key: string,
  label: string,
  minutes: number,
  text: string,
  effects: Effect[] = [],
  when?: Cond,
): ActionDef {
  const id = `c${n}_${key}`;
  return {
    id,
    label,
    minutes,
    combinable: true,
    when: all(not(flag(`$.${id}`)), ...(when ? [when] : [])),
    text,
    effects: once(id, effects),
  };
}
export function cpAction(n: number): ActionDef {
  return {
    id: `c${n}_go`,
    label: n % 2 ? 'Полдень. Связаться' : 'Ночь. Устроиться на ночлег',
    minutes: 5,
    terminal: true,
    goto: `c${n}_cp`,
    when: all({ cp: n - 1 }, { after: segmentEnd(n) }),
  };
}
export function hub(
  n: number,
  key: string,
  location: string | undefined,
  title: string,
  morning: string,
  late: string,
  actions: ActionDef[],
  extra: TextBlock[] = [],
  safe = true,
): Scene {
  const d = segmentDay(n);
  return {
    id: `c${n}_${key}`,
    for: 'any',
    chapter: 'ch3',
    location,
    title,
    safe,
    text: [
      { when: { before: at(d, 6) }, text: nights[key]?.[d === 12 ? 0 : 1] ?? nights.start[d === 12 ? 0 : 1] },
      { when: all(day(d), { before: at(d, 12) }), text: morning },
      {
        when: all({ after: at(d, 12) }, { before: at(d, 17) }),
        text: afternoons[key]?.[d === 12 ? 0 : 1] ?? morning,
      },
      { when: evening(d), text: late },
      ...extra,
    ],
    actions: [
      ...actions,
      {
        id: `c${n}_sleep`,
        label: 'Попытаться поспать до рассвета',
        minutes: 0,
        repeatable: true,
        when: { before: at(d, 6) },
        effects: [{ sleep: 360 }],
        text: nights[key]?.[d === 12 ? 0 : 1] ?? nights.start[d === 12 ? 0 : 1],
      },
      waitHour('Переждать час', `c${n}_wait`),
      cpAction(n),
    ],
  };
}
export function work(
  n: number,
  id: string,
  project: string,
  label: string,
  text: string,
  when?: Cond,
): ActionDef {
  return {
    id: `c${n}_${id}`,
    label,
    minutes: 0,
    activity: 'moderate',
    repeatable: true,
    combinable: true,
    when: all(day(segmentDay(n)), not(flag(`proj.${project}.done`)), ...(when ? [when] : [])),
    text,
    effects: [{ work: project, hours: 1 }],
  };
}
export function localMove(
  n: number,
  key: string,
  label: string,
  scene: string,
  minutes = 2,
  when?: Cond,
  effects: Effect[] = [],
): ActionDef {
  return { id: `c${n}_${key}`, label, minutes, terminal: true, goto: scene, when, effects };
}
