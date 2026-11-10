// Схема мест: где уже были игроки. Координаты приблизительные, только для рисунка; в расчёт мира не входят.
import type { Content } from '../engine/content-types';
import type { GameState, PlayerId } from '../engine/types';

export interface MapNode { id: string; name: string; lat: number; lon: number }

export const MAP_NODES: MapNode[] = [
  { id: 'kaltenkirchen', name: 'Kaltenkirchen', lat: 53.835, lon: 9.96 },
  { id: 'ahrensburg', name: 'Ahrensburg', lat: 53.674, lon: 10.24 },
  { id: 'ring3', name: 'Ring 3', lat: 53.615, lon: 10.02 },
  { id: 'eppendorf', name: 'Eppendorf', lat: 53.593, lon: 9.985 },
  { id: 'barmbek', name: 'Barmbek', lat: 53.587, lon: 10.045 },
  { id: 'hh_city', name: 'Bahrenfeld', lat: 53.572, lon: 9.935 },
  { id: 'alster', name: 'Alster', lat: 53.568, lon: 10.005 },
  { id: 'messe', name: 'Messe', lat: 53.562, lon: 9.972 },
  { id: 'neustadt', name: 'Neustadt', lat: 53.552, lon: 9.983 },
  { id: 'landung', name: 'Landungsbrücken', lat: 53.546, lon: 9.966 },
  { id: 'elbtunnel', name: 'Elbtunnel', lat: 53.543, lon: 9.93 },
  { id: 'elbbruecken', name: 'Elbbrücken', lat: 53.535, lon: 10.025 },
  { id: 'steinwerder', name: 'Steinwerder', lat: 53.533, lon: 9.962 },
  { id: 'a7', name: 'A7', lat: 53.515, lon: 9.935 },
  { id: 'wilhelmsburg', name: 'Wilhelmsburg', lat: 53.5, lon: 10.0 },
  { id: 'harburg', name: 'Harburg', lat: 53.456, lon: 9.99 },
  { id: 'b75', name: 'B75', lat: 53.4, lon: 9.92 },
  { id: 'a1', name: 'A1', lat: 53.385, lon: 9.99 },
  { id: 'winsen', name: 'Винзен', lat: 53.357, lon: 10.213 },
  { id: 'lueneburg', name: 'Люнебург', lat: 53.25, lon: 10.41 },
  { id: 'buchholz', name: 'Buchholz', lat: 53.326, lon: 9.868 },
  { id: 'garden', name: 'Колония', lat: 53.318, lon: 9.9 },
  { id: 'jesteburg', name: 'Йестебург', lat: 53.308, lon: 9.955 },
  { id: 'farm', name: 'Хутор', lat: 53.297, lon: 9.925 },
  { id: 'east', name: 'Восточная дорога', lat: 53.293, lon: 9.995 },
];

const AREA: Record<string, string> = {
  north_gym: 'kaltenkirchen', ahrensburg: 'ahrensburg', hh_ring3: 'ring3', hh_eppendorf: 'eppendorf', hh_city: 'hh_city',
  hh_alster: 'alster', messe: 'messe', messe_q: 'messe', hh_neustadt: 'neustadt', hh_landungsbruecken: 'landung', old_elbtunnel: 'landung',
  elbtunnel: 'elbtunnel', elbbruecken: 'elbbruecken', steinwerder: 'steinwerder', a7_jam: 'a7', wilhelmsburg: 'wilhelmsburg',
  wilhelmsburg_stairs: 'wilhelmsburg', harburg: 'harburg', harburg_station: 'harburg', harburg_kerem: 'harburg', a1_station: 'harburg',
  b75_road: 'b75', a_road: 'a1', c15_winsen: 'winsen', c18_lueneburg: 'lueneburg', deniz_workshop: 'buchholz', c15_garden: 'garden', c13_sammel: 'jesteburg',
  c16_jesteburg: 'jesteburg', hof_luedemann: 'farm', farm_coop: 'farm', c3_farm_shed: 'farm', c3_neighbor: 'farm', c7_farm_lane: 'farm',
  c8_well_path: 'farm', c10_field: 'farm', c8_road_store: 'east', c8_east_road: 'east', c8_bus_east: 'east',
};

/** Узел схемы для места игры (несколько мест одного двора или района — один узел). */
export function mapArea(loc: string | undefined): string | undefined {
  if (!loc) return undefined;
  if (AREA[loc]) return AREA[loc];
  if (loc.startsWith('a_')) return 'buchholz';
  if (loc.startsWith('b_')) return 'barmbek';
  return undefined;
}

export const MAP_EDGES: [string, string][] = [
  ['kaltenkirchen', 'ring3'], ['ring3', 'eppendorf'], ['ring3', 'barmbek'], ['barmbek', 'ahrensburg'], ['barmbek', 'alster'],
  ['barmbek', 'eppendorf'], ['eppendorf', 'hh_city'], ['eppendorf', 'messe'], ['alster', 'neustadt'], ['alster', 'messe'], ['messe', 'neustadt'],
  ['neustadt', 'landung'], ['landung', 'steinwerder'], ['steinwerder', 'wilhelmsburg'], ['alster', 'elbbruecken'],
  ['elbbruecken', 'wilhelmsburg'], ['wilhelmsburg', 'harburg'], ['hh_city', 'elbtunnel'], ['elbtunnel', 'a7'], ['a7', 'harburg'],
  ['harburg', 'a1'], ['harburg', 'b75'], ['a1', 'buchholz'], ['b75', 'buchholz'], ['buchholz', 'garden'], ['garden', 'farm'],
  ['farm', 'jesteburg'], ['buchholz', 'farm'], ['farm', 'east'], ['jesteburg', 'winsen'], ['east', 'winsen'], ['harburg', 'buchholz'],
  ['kaltenkirchen', 'barmbek'], ['winsen', 'lueneburg'], ['east', 'lueneburg'], ['barmbek', 'harburg'],
];

/** Узлы, где персонаж бывал: по сценам, в которые он входил, и по месту, где он сейчас. */
export function visitedAreas(c: Content, s: GameState, pid: PlayerId): Set<string> {
  const out = new Set<string>();
  const ch = s.chars[pid];
  for (const id of Object.keys(ch.visited)) { const a = mapArea(c.scenes[id]?.location); if (a) out.add(a); }
  const here = mapArea(ch.location);
  if (here) out.add(here);
  return out;
}

export interface PlacedNode extends MapNode { x: number; y: number; ly: number; right: boolean; mine: boolean; theirs: boolean }

/**
 * Раскладка: настоящее положение пополам с порядком по осям — так тесные районы города не слипаются,
 * а стороны света сохраняются. Подписи раздвигаются по вертикали.
 */
export function layoutMap(mine: Set<string>, theirs: Set<string>, w: number, h: number): PlacedNode[] {
  const nodes = MAP_NODES.filter((n) => mine.has(n.id) || theirs.has(n.id));
  if (!nodes.length) return [];
  const pad = { l: 14, r: 14, t: 16, b: 16 };
  const axis = (get: (n: MapNode) => number) => {
    const vals = nodes.map(get), min = Math.min(...vals), max = Math.max(...vals);
    const order = [...nodes].sort((a, b) => get(a) - get(b)).map((n) => n.id);
    return (n: MapNode) => {
      if (nodes.length === 1) return 0.5;
      const real = max > min ? (get(n) - min) / (max - min) : 0.5;
      return 0.45 * real + 0.55 * (order.indexOf(n.id) / (nodes.length - 1));
    };
  };
  const fx = axis((n) => n.lon), fy = axis((n) => -n.lat);
  const placed: PlacedNode[] = nodes.map((n) => {
    const x = pad.l + fx(n) * (w - pad.l - pad.r), y = pad.t + fy(n) * (h - pad.t - pad.b);
    return { ...n, x, y, ly: y, right: x < w * 0.6, mine: mine.has(n.id), theirs: theirs.has(n.id) };
  });
  const byY = [...placed].sort((a, b) => a.y - b.y);
  for (let i = 1; i < byY.length; i++) {
    for (let j = 0; j < i; j++) {
      const a = byY[j], b = byY[i];
      if (a.right === b.right && Math.abs(a.x - b.x) < 96 && b.ly - a.ly < 11) b.ly = a.ly + 11;
    }
  }
  return placed;
}
