import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { segmentEnd } from './clock';
import { farmScenes } from './farm';
import { messeScenes } from './messe';
import { arrival, entry, relocation, road, stayRoutes } from './routes';
import { shelterScenes } from './shelters';
import { day13Scenes } from './day13';
import { excursions } from './excursions';
import { incidents } from './incidents';
import { addRounds } from './rounds';
import { morning12 } from './morning12';
import { afternoon12 } from './afternoon12';
import { morning13 } from './morning13';
import { afternoon13 } from './afternoon13';

export const scenes3: Record<string, Scene> = {};
const add = (scenes: Scene[]) => {
  for (const s of scenes) scenes3[s.id] = s;
};
for (const n of [5, 6] as const) add([entry(n), ...farmScenes(n), ...shelterScenes(n), ...messeScenes(n)]);
for (const n of [7, 8] as const)
  add([entry(n), ...day13Scenes(n), ...messeScenes(n).filter((s) => s.id.endsWith('_messe_exit'))]);
add([road, arrival, relocation, ...excursions(6), ...excursions(8)]);
for (const n of [5, 6, 7, 8]) {
  add([
    {
      id: `c${n}_cp`,
      for: 'any',
      chapter: 'ch3',
      checkpoint: n,
      title: n % 2 ? 'Полдень' : 'Ночь',
      universal: false,
      calm: true,
      text: [
        {
          text: (
            {
              5: 'Время до полудня уходит на дорогу, людей и воду. Ты садишься там, где видно выход. Телефон держишь экраном вверх.',
              6: 'На двери ложится длинная тень. Ты ставишь обувь рядом с ночлегом. Рюкзак застёгнут, но ещё не убран.',
              7: 'Свет уже высокий, но улица или двор вокруг не стали тише. Ты проверяешь руки и вещи. Под ремнём остаётся тёплая кожа.',
              8: 'За стеной или тентом больше не видно дороги. Ты ставишь воду рядом с рукой. На холодном полу остаётся место для обуви.',
            } as Record<number, string>
          )[n],
        },
      ],
      actions: [],
    },
  ]);
  // Маршрутизатор начинает рассказ прямо в фактическом месте игрока.
  const routes = stayRoutes(n);
  scenes3[`c${n}_start`].text = routes.flatMap((r, i) => {
    const guard: Cond = all(
      ...(r.when ? [r.when] : []),
      ...routes.slice(0, i).flatMap((x) => (x.when ? [not(x.when)] : [])),
    );
    return scenes3[r.scene].text.map((b) => ({ ...b, when: all(guard, ...(b.when ? [b.when] : [])) }));
  });
  // Время главы не прыгает на сутки от половины дня к половине дня.
  for (const s of Object.values(scenes3).filter(
    (s) => s.id.startsWith(`c${n}_`) && s.checkpoint === undefined,
  )) {
    if (s.actions.some((a) => a.id === `c${n}_go`)) {
      const cp = s.actions.find((a) => a.id === `c${n}_go`)!;
      s.actions = [...s.actions.filter((a) => a !== cp), cp];
    }
    for (const a of s.actions) {
      if (a.id.includes('partner') || a.id.endsWith('_y_near'))
        a.when = all({ flag: 'w.together' }, ...(a.when ? [a.when] : []));
    }
  }
}
add([
  {
    id: 'c9_start',
    for: 'any',
    chapter: 'ch4',
    title: 'Продолжение',
    universal: false,
    text: [
      {
        text: 'Здесь заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.',
      },
    ],
    actions: [],
  },
]);

addRounds(scenes3);

// Разговоры и помощь требуют живого человека именно в этом месте.
const localPeople: [string, RegExp][] = [
  ['henrike', /Хенрике/],
  ['ole', /Оле/],
  ['pawel', /Пав[её]л|Павл/],
  ['deniz', /Дениз/],
  ['kerem', /Керем/],
  ['merle', /Мерле/],
  ['uwe', /Уве/],
  ['birgit', /Биргит/],
];
for (const s of Object.values(scenes3))
  for (const a of s.actions) {
    const people = localPeople.filter(([, name]) => name.test(a.label + ' ' + (a.text ?? '')));
    if (people.length && s.location)
      a.when = all(
        ...(a.when ? [a.when] : []),
        ...people.map(([npc]): Cond => ({
          npc,
          alive: true,
          at: s.location === 'farm_coop' ? 'hof_luedemann' : s.location,
        })),
      );
  }

export const incidentEvents3 = [
  ...incidents(5, morning12, scenes3),
  ...incidents(6, afternoon12, scenes3),
  ...incidents(7, morning13, scenes3),
  ...incidents(8, afternoon13, scenes3),
];
// Вспышка прекращает бытовые дела и разговоры в обоих павильонах, включая внутренние сцены.
for (const n of [7, 8])
  for (const s of Object.values(scenes3).filter(
    (s) =>
      s.id.startsWith(`c${n}_`) &&
      ['messe', 'messe_q'].includes(s.location ?? '') &&
      !s.id.endsWith('_messe_exit') &&
      s.checkpoint === undefined,
  )) {
    // Здесь нельзя спрятать острую ситуацию за универсальным сном или ожиданием.
    s.universal = false;
    s.safe = false;
    s.actions = [
      ...s.actions.map((a) => ({
        ...a,
        when: all(not(flag('w.c3_messe_outbreak')), ...(a.when ? [a.when] : [])),
      })),
      {
        id: `c${n}_alarm`,
        label: 'Уйти к служебной двери',
        minutes: 0,
        terminal: true,
        goto: `c${n}_messe_exit`,
        when: flag('w.c3_messe_outbreak'),
      },
    ];
  }
// Старые эпизоды не должны всплывать в следующем участке с опозданием.
for (const n of [5, 6, 7, 8])
  for (const s of Object.values(scenes3).filter((s) => s.id.startsWith(`c${n}_`))) {
    for (const a of s.actions)
      if (a.id === `c${n}_sleep` && n % 2 === 0) a.when = { before: segmentEnd(n) - 1440 };
  }
