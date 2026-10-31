import type { Scene, WorldEvent } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { at } from '../../engine/time';
import { all, flag, keeper, not } from './world3';
import { inSegment, segmentDay } from './clock';

export interface Choice {
  id: string;
  label: string;
  text: string;
  minutes?: number;
  effects?: Effect[];
  enabled?: Cond;
  risky?: boolean;
}
export interface Incident {
  id: string;
  place: string;
  title: string;
  news: string;
  // Наблюдения не заменяют выбор: каждый шаг открывает новую часть конкретной ситуации.
  beats: [string, string][];
  choices: Choice[];
  missed: string;
  npc?: string;
  when?: Cond;
}
const castNames: [string, RegExp][] = [
  ['henrike', /Хенрике/],
  ['ole', /Оле/],
  ['pawel', /Пав[её]л|Павл/],
  ['deniz', /Дениз/],
  ['kerem', /Керем/],
  ['merle', /Мерле/],
  ['uwe', /Уве/],
  ['birgit', /Биргит/],
];
export function incidents(n: number, specs: Incident[], scenes: Record<string, Scene>): WorldEvent[] {
  const d = segmentDay(n);
  const events: WorldEvent[] = [];
  const occurrence: Record<string, number> = {};
  for (const spec of specs) {
    const order = occurrence[spec.place] ?? 0;
    occurrence[spec.place] = order + 1;
    const id = `c${n}_${spec.id}`;
    const home = `c${n}_${spec.place}`;
    const source = scenes[home];
    if (!source) throw new Error(`Нет места эпизода: ${home}`);
    const start = n % 2 ? at(d, order ? 9 : 7, order ? 25 : 10) : at(d, order ? 17 : 14, order ? 15 : 10);
    const end = n % 2 ? at(d, 13, 50) : at(d, 22);
    const nearby =
      spec.place === 'bflat'
        ? ['b_flat', 'b_stairs', 'b_okafor']
        : spec.place === 'aflat'
          ? ['a_flat', 'a_stairs']
          : [source.location];
    const presence: Cond = source.location ? { any: nearby.map((at) => ({ at: at! })) } : { scene: home };
    const actor: Cond = spec.npc
      ? {
          npc: spec.npc,
          alive: true,
          ...(source.location ? { at: spec.npc === 'okafor' ? 'b_okafor'
            : source.location === 'farm_coop' ? 'hof_luedemann' : source.location } : {}),
        }
      : { always: true };
    const narrative = [spec.news, ...spec.beats.map((b) => b[1])].join(' ');
    const cast = castNames
      .filter(([, name]) => name.test(narrative))
      .map(([npc]): Cond => ({
        npc,
        alive: true,
        at: source.location === 'farm_coop' ? 'hof_luedemann' : source.location,
      }));
    const present = all(presence, actor, ...cast, ...(spec.when ? [spec.when] : []));
    events.push({
      id: `ev_${id}`,
      at: start,
      scope: 'world',
      interrupt: true,
      when: all(inSegment(n), present, { before: end }),
      effects: [{ set: `$.${id}.pending`, value: true }],
      news: [{ channel: 'direct', text: spec.news }],
    });
    events.push({
      id: `ev_${id}_missed`,
      at: end,
      scope: 'world',
      when: all({ cp: n - 1 }, not(flag(`$.${id}.done`)), not(flag(`$.${id}.started`))),
      effects: [{ set: `$.${id}.missed`, value: true }],
    });
    const action = {
      id: `${id}_approach`,
      label: spec.title,
      minutes: 1,
      terminal: true,
      goto: `${id}_0`,
      when: all(
        actor,
        ...cast,
        ...(spec.when ? [spec.when] : []),
        flag(`$.${id}.pending`),
        not(flag(`$.${id}.done`)),
        not(flag(`$.${id}.missed`)),
      ),
      effects: [{ set: `$.${id}.started`, value: true }] as Effect[],
    };
    // Внутренние места не скрывают событие, случившееся во дворе/в доме.
    const related = Object.values(scenes).filter(
      (s) =>
        s.id.startsWith(`c${n}_`) &&
        s.checkpoint === undefined &&
        (source.location ? nearby.includes(s.location) : s.id === home) &&
        s.actions.some((a) => a.id === `c${n}_go`),
    );
    for (const s of related) s.actions.splice(Math.max(0, s.actions.length - 1), 0, action);
    spec.beats.forEach(([label, text], i) => {
      const next = i + 1 < spec.beats.length ? `${id}_${i + 1}` : `${id}_choice`;
      scenes[`${id}_${i}`] = {
        id: `${id}_${i}`,
        for: 'any',
        chapter: 'ch3',
        location: source.location,
        title: spec.title,
        universal: false,
        calm: true,
        text: [{ text }],
        actions: [
          { id: `${id}_step${i}`, label, minutes: i % 3 === 2 ? 6 : 2, terminal: true, goto: next },
          ...(i === 0
            ? [
                {
                  id: `${id}_leave`,
                  label: 'Отойти',
                  minutes: 3,
                  terminal: true,
                  goto: home,
                  text: spec.missed,
                  effects: [
                    { set: `$.${id}.done`, value: true },
                    { set: `$.${id}.result`, value: 'left' },
                    { body: 'stress' as const, delta: 4 },
                  ],
                },
              ]
            : []),
        ],
      };
    });
    scenes[`${id}_choice`] = {
      id: `${id}_choice`,
      for: 'any',
      chapter: 'ch3',
      location: source.location,
      title: spec.title,
      universal: false,
      calm: true,
      text: [{ text: spec.news }],
      actions: spec.choices.map((choice) => ({
        id: `${id}_${choice.id}`,
        label: choice.label,
        minutes: choice.minutes ?? 12,
        terminal: true,
        goto: home,
        risky: choice.risky,
        enabled: choice.enabled,
        disabledReason: 'Сейчас этого не сделать',
        text: choice.text,
        effects: [
          { set: `$.${id}.done`, value: true },
          { set: `$.${id}.result`, value: choice.id },
          {
            if: keeper(spec.place === 'bflat' ? 'B' : 'A'),
            then: [{ set: `w.${id}.result`, value: choice.id }],
          },
          ...(choice.effects ?? []).map((e): Effect =>
            ('set' in e && typeof e.set === 'string' && e.set.startsWith('w.')) ||
            'place' in e ||
            'unstock' in e ||
            ('npc' in e && (e.moveTo || e.status || e.set))
              ? { if: keeper(spec.place === 'bflat' ? 'B' : 'A'), then: [e] }
              : e,
          ),
        ],
      })),
    };
  }
  return events;
}
