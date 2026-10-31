import type { ActionDef, Scene, TextBlock } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { waitHour } from '../chapter1/common';
import { all, day, evening, flag, not } from './world3';

export const once = (id: string, extra: Effect[] = []): Effect[] => [{ set: `$.${id}`, value: true }, ...extra];
export function task(n: number, key: string, label: string, minutes: number, text: string, effects: Effect[] = [], when?: Cond): ActionDef {
  const id = `c${n}_${key}`;
  return { id, label, minutes, combinable: true, when: all(not(flag(`$.${id}`)), ...(when ? [when] : [])), text, effects: once(id, effects) };
}
export function cpAction(n: number): ActionDef {
  return { id: `c${n}_go`, label: 'Закончить день и обсудить завтрашний', minutes: 5, terminal: true, goto: `c${n}_cp`, when: all({ cp: n - 1 }, { after: at(n + 7, 20) }) };
}
export function hub(n: number, key: string, location: string | undefined, title: string, morning: string, late: string, actions: ActionDef[], extra: TextBlock[] = [], safe = true): Scene {
  const d = n + 7;
  return {
    id: `c${n}_${key}`, for: 'any', chapter: 'ch3', location, title, safe,
    text: [
      { when: { before: at(d, 6) }, text: 'Ночь ещё не кончилась. Ты устраиваешь вещи под рукой и проверяешь, откуда можно уйти. Спать приходится в одежде.' },
      { when: day(d), text: morning },
      { when: evening(d), text: late }, ...extra,
    ],
    actions: [
      ...actions,
      { id: `c${n}_sleep`, label: 'Попытаться поспать до рассвета', minutes: 0, repeatable: true, when: { before: at(d, 6) }, effects: [{ sleep: 360 }],
        text: 'Ты закрываешь глаза. Просыпаешься от собственного движения и долго слушаешь, прежде чем уснуть снова.' },
      waitHour('Переждать час', `c${n}_wait`), cpAction(n),
    ],
  };
}
export function work(n: number, id: string, project: string, label: string, text: string, when?: Cond): ActionDef {
  return { id: `c${n}_${id}`, label, minutes: 0, activity: 'moderate', repeatable: true, combinable: true,
    when: all(day(n + 7), not(flag(`proj.${project}.done`)), ...(when ? [when] : [])), text, effects: [{ work: project, hours: 1 }] };
}
export function localMove(n: number, key: string, label: string, scene: string, minutes = 2, when?: Cond, effects: Effect[] = []): ActionDef {
  return { id: `c${n}_${key}`, label, minutes, terminal: true, goto: scene, when, effects };
}
