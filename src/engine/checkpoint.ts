// Контрольные точки: детерминированное слияние двух офлайн-прохождений, сведение часов,
// доставка сообщений, совместные решения, одиночное продолжение и поражение.
// Слияние симметрично: merge(A, B) === merge(B, A) — ни у одного игрока нет приоритета.
import { baseCatchUp, markSegmentStart } from './base';
import { canAct, isDead, isIncapacitated, tickBody } from './body';
import { evalCond } from './conditions';
import type { Content, JointDecision, MergePolicy } from './content-types';
import { applyEffects } from './effects';
import { canonical, stateHash, unit } from './rng';
import { advanceTime } from './simulate';
import type { GameState, HistoryRecord, ItemInstance, NpcState, PlayerId, Scalar } from './types';
import { other, PLAYERS } from './types';
import { environment, log, network, phoneUsable, type Ctx } from './world';

const clone = <T>(x: T): T => structuredClone(x);
const same = (a: unknown, b: unknown) => canonical(a) === canonical(b);

export function policyFor(c: Content, key: string): MergePolicy {
  if (c.mergePolicies[key]) return c.mergePolicies[key];
  let best: [number, MergePolicy] | undefined;
  for (const [k, p] of Object.entries(c.mergePolicies)) {
    if (k.endsWith('*') && key.startsWith(k.slice(0, -1)) && (!best || k.length > best[0])) best = [k.length, p];
  }
  return best?.[1] ?? 'latest';
}

/** Ничья по времени решается хэшем ключа и сида — одинаково на обоих телефонах, без приоритета игрока. */
function tieBreak(seed: string, key: string): PlayerId {
  return unit(`${seed}:tie:${key}`) < 0.5 ? 'A' : 'B';
}

interface Sources { A: GameState; B: GameState }

function mergeScalar(c: Content, seed: string, key: string, base: Scalar | undefined, src: Sources, timeOf: (p: PlayerId) => number, conflicts: string[]): Scalar | undefined {
  const a = src.A.vars[key];
  const b = src.B.vars[key];
  if (a === b) return a;
  if (a === base) return b;
  if (b === base) return a;
  const pol = policyFor(c, key);
  conflicts.push(key);
  if (pol === 'delta' && typeof a === 'number' && typeof b === 'number') {
    const bv = typeof base === 'number' ? base : 0;
    return Math.round((bv + (a - bv) + (b - bv)) * 1000) / 1000;
  }
  if (pol === 'max' && typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
  if (pol === 'min' && typeof a === 'number' && typeof b === 'number') return Math.min(a, b);
  if (pol === 'or') return !!a || !!b;
  if (pol === 'and') return !!a && !!b;
  const ta = timeOf('A');
  const tb = timeOf('B');
  if (ta !== tb) return ta > tb ? a : b;
  return tieBreak(seed, key) === 'A' ? a : b;
}

function mergeNpc(seed: string, id: string, base: NpcState | undefined, a: NpcState, b: NpcState): NpcState {
  if (same(a, b)) return clone(a);
  if (base && same(a, base)) return clone(b);
  if (base && same(b, base)) return clone(a);
  const later = a.changedAt !== b.changedAt ? (a.changedAt > b.changedAt ? a : b) : tieBreak(seed, `npc:${id}`) === 'A' ? a : b;
  const out = clone(later);
  out.trust = { A: a.trust.A, B: b.trust.B };
  out.memory = [...new Set([...a.memory, ...b.memory])].sort();
  out.agendaDone = [...new Set([...a.agendaDone, ...b.agendaDone])].sort();
  for (const k of new Set([...Object.keys(a.vars), ...Object.keys(b.vars)])) {
    const bv = base?.vars[k];
    out.vars[k] = a.vars[k] === bv ? b.vars[k] : b.vars[k] === bv ? a.vars[k] : later.vars[k];
  }
  // Смерть необратима: если на одной из линий NPC погиб, он мёртв.
  if (!a.alive || !b.alive) { out.alive = false; out.status = 'dead'; }
  out.changedAt = Math.max(a.changedAt, b.changedAt);
  return out;
}

function mergeItem(seed: string, id: string, base: ItemInstance | undefined, a: ItemInstance | undefined, b: ItemInstance | undefined): ItemInstance {
  if (!a) return clone(b!);
  if (!b) return clone(a);
  if (same(a, b)) return clone(a);
  if (base && same(a, base)) return clone(b);
  if (base && same(b, base)) return clone(a);
  const later = clone(a.changedAt !== b.changedAt ? (a.changedAt > b.changedAt ? a : b) : tieBreak(seed, `item:${id}`) === 'A' ? a : b);
  // Оба брали из одного запаса на одном месте (общий склад базы) — складываем расход, а не теряем его.
  if (base && same(a.at, base.at) && same(b.at, base.at)) {
    later.qty = Math.max(0, base.qty + (a.qty - base.qty) + (b.qty - base.qty));
    if (base.fuel !== undefined) later.fuel = Math.max(0, Math.round(((base.fuel) + ((a.fuel ?? 0) - base.fuel) + ((b.fuel ?? 0) - base.fuel)) * 100) / 100);
    if (later.qty <= 0) later.at = { kind: 'gone' };
  }
  return later;
}

/** Кто проводил участок за персонажа: он сам или партнёр (если был недееспособен). */
export function controllerOf(s: GameState, pid: PlayerId): PlayerId {
  const ctl = s.chars[pid].controlledBy;
  return ctl === 'engine' ? pid : ctl;
}

/**
 * Слить итоги участков. `results[pid]` — состояние в конце участка игрока pid
 * (воспроизведённое из его журнала действий). Игрок, который не мог действовать, участка не имеет.
 */
export function mergeSegments(c: Content, base: GameState, results: Partial<Record<PlayerId, GameState>>): GameState {
  // Входы не трогаем: слитый мир дальше меняется (часы, сообщения), а без копий эти правки
  // попадали бы в сыгранный участок игрока — и его код хода после перезапуска считался бы иначе.
  base = clone(base);
  results = clone(results);
  const pick = (pid: PlayerId) => results[pid] ?? results[controllerOf(base, pid)] ?? results[other(pid)] ?? base;
  const src: Sources = { A: pick('A'), B: pick('B') };
  const out = clone(base);
  const conflicts: string[] = [];

  for (const pid of PLAYERS) {
    const own = results[pid] ? src[pid] : results[other(pid)] ?? base;
    out.chars[pid] = clone(own.chars[pid]);
    out.knowledge[pid] = clone(src[pid].knowledge[pid]);
    out.rng[pid] = src[pid].rng[pid];
    out.idSeq[pid] = Math.max(src.A.idSeq[pid], src.B.idSeq[pid]);
    out.logSeq[pid] = Math.max(src.A.logSeq[pid], src.B.logSeq[pid]);
  }

  const keys = [...new Set([...Object.keys(src.A.vars), ...Object.keys(src.B.vars)])].sort();
  out.vars = {};
  out.varTime = {};
  for (const k of keys) {
    const v = mergeScalar(c, base.seed, k, base.vars[k], src, (p) => src[p].varTime[k] ?? -1, conflicts);
    if (v !== undefined) out.vars[k] = v;
    out.varTime[k] = Math.max(src.A.varTime[k] ?? -1, src.B.varTime[k] ?? -1);
  }

  out.npcs = {};
  for (const id of [...new Set([...Object.keys(src.A.npcs), ...Object.keys(src.B.npcs)])].sort()) {
    out.npcs[id] = mergeNpc(base.seed, id, base.npcs[id], src.A.npcs[id] ?? src.B.npcs[id], src.B.npcs[id] ?? src.A.npcs[id]);
  }

  out.items = {};
  for (const id of [...new Set([...Object.keys(src.A.items), ...Object.keys(src.B.items)])].sort()) {
    out.items[id] = mergeItem(base.seed, id, base.items[id], src.A.items[id], src.B.items[id]);
  }

  out.firedEvents = { ...src.A.firedEvents };
  for (const [k, t] of Object.entries(src.B.firedEvents)) out.firedEvents[k] = Math.min(out.firedEvents[k] ?? t, t);

  const msgs = new Map<string, GameState['messages'][number]>();
  for (const m of [...src.A.messages, ...src.B.messages]) {
    const prev = msgs.get(m.id);
    msgs.set(m.id, prev ? { ...m, delivered: prev.delivered || m.delivered } : m);
  }
  out.messages = [...msgs.values()].sort((x, y) => x.at - y.at || (x.id < y.id ? -1 : 1));

  const logs = new Map<string, GameState['log'][number]>();
  for (const e of [...src.A.log, ...src.B.log]) logs.set(`${e.pid}:${e.seq}`, e);
  out.log = [...logs.values()].sort((x, y) => (x.pid === y.pid ? x.seq - y.seq : x.pid < y.pid ? -1 : 1));

  out.history.push({
    checkpoint: base.checkpoint + 1, kind: 'merge', id: `merge-${base.checkpoint + 1}`,
    summary: conflicts.length ? `Слияние: ${conflicts.length} пересечений решено по правилам мира` : 'Слияние без пересечений',
    data: { conflicts: conflicts.join(',') },
  });
  return out;
}

/** Довести часы обоих до общего момента. Отставший персонаж «проживает» это время сам. */
export function syncClocks(c: Content, s: GameState, notBefore = 0) {
  const target = Math.max(s.chars.A.time, s.chars.B.time, notBefore);
  syncClocksTo(c, s, target);
  baseCatchUp({ s, c, pid: s.chars.A.time >= s.chars.B.time ? 'A' : 'B' }, target);
}

function syncClocksTo(c: Content, s: GameState, target: number) {
  for (const pid of PLAYERS) {
    const ch = s.chars[pid];
    if (ch.time >= target) continue;
    const ctx: Ctx = { s, c, pid };
    if (isDead(ch.body)) { ch.time = target; continue; }
    if (canAct(ch.body)) {
      log(ctx, 'system', 'Время до общей точки проходит в ожидании.');
      advanceTime(ctx, target - ch.time, 'rest', { finishOnEvent: true, away: true });
    } else {
      tickBody(ch.body, ch.traits, ch.time, target - ch.time, 'rest', environment(ctx), `${s.seed}:${pid}`);
      ch.time = target;
    }
  }
}

/** Сообщения, отправленные офлайн, доходят на контрольной точке, если телефон получателя жив и есть сеть. */
export function deliverMessages(c: Content, s: GameState) {
  for (const m of s.messages) {
    if (m.delivered) continue;
    const ctx: Ctx = { s, c, pid: m.to };
    if (!phoneUsable(ctx) || !network(ctx).sms) continue;
    m.delivered = true;
    const hh = String(Math.floor(((m.at % 1440) + 1440) % 1440 / 60)).padStart(2, '0');
    const mm = String((((m.at % 1440) + 1440) % 1440) % 60).padStart(2, '0');
    log(ctx, 'message', `Сообщение от {partner.gen}, отправлено в ${hh}:${mm}: «${m.text}»`);
    const tpl = c.messages.find((t) => t.id === m.template);
    if (tpl?.learn) applyEffects(ctx, [{ learn: tpl.learn, source: m.id }]);
  }
}

/** Заметки контрольной точки после слияния: каждый игрок видит свою версию (связь, встреча, новости друг от друга). */
export function mergeNotes(c: Content, s: GameState, index: number) {
  const cp = c.checkpoints.find((x) => x.index === index);
  for (const pid of PLAYERS) {
    if (isDead(s.chars[pid].body)) continue;
    const ctx: Ctx = { s, c, pid };
    const used = new Set<string>();
    for (const n of cp?.onMerge ?? []) {
      if (n.group && used.has(n.group)) continue;
      if (!evalCond(ctx, n.when)) continue;
      if (n.group) used.add(n.group);
      if (n.text) log(ctx, 'checkpoint', n.text);
      applyEffects(ctx, n.effects);
    }
  }
}

// ───────────── Совместные решения ─────────────

export type JointKind = 'same' | 'compatible' | 'compromise' | 'conflict' | 'solo' | 'world';

export interface JointResult {
  id: string;
  kind: JointKind;
  applied: string[];
  answers: Partial<Record<PlayerId, string>>;
  reason: string;
  /** Если выбор сделала взвешенная случайность — её значение (для воспроизводимости). */
  roll?: number;
}

export function participants(c: Content, s: GameState, d: JointDecision): PlayerId[] {
  return PLAYERS.filter((p) => canAct(s.chars[p].body) && evalCond({ s, c, pid: p }, d.canParticipate));
}

export function optionsFor(c: Content, s: GameState, d: JointDecision, pid: PlayerId) {
  return d.options.filter((o) => evalCond({ s, c, pid }, o.when));
}

/** Объективные условия контрольной точки проверяются от лица мира (переменные w.*, NPC, предметы). */
const worldCtx = (c: Content, s: GameState): Ctx => ({ s, c, pid: 'A' });

export function resolveJoint(c: Content, s: GameState, decisionId: string, answers: Partial<Record<PlayerId, string>>): JointResult {
  const d = c.joint[decisionId];
  if (!d) throw new Error(`Нет совместного решения ${decisionId}`);
  const who = participants(c, s, d);
  for (const p of who) {
    if (!answers[p]) throw new Error(`Ждём ответ игрока ${p}`);
    if (!optionsFor(c, s, d, p).some((o) => o.id === answers[p])) throw new Error(`Вариант ${answers[p]} недоступен игроку ${p}`);
  }
  const w = worldCtx(c, s);
  const feasible = (id: string) => evalCond(w, d.options.find((o) => o.id === id)?.feasible);
  const given = who.map((p) => answers[p]!) as string[];
  const res: JointResult = { id: d.id, kind: 'world', applied: [], answers: Object.fromEntries(who.map((p) => [p, answers[p]!])), reason: '' };

  const arbitrate = (candidates: string[]): void => {
    for (const a of d.arbiters) {
      if (evalCond(w, a.when) && (candidates.length === 0 || candidates.includes(a.winner) || !candidates.some(feasible))) {
        res.applied = [a.winner];
        res.reason = a.text;
        applyEffects(w, a.effects);
        return;
      }
    }
    const weights = (d.fallbackWeights ?? []).filter((f) => candidates.length === 0 || candidates.includes(f.option))
      .map((f) => ({ option: f.option, weight: Math.max(0, f.base + (f.mods ?? []).filter((m) => evalCond(w, m.when)).reduce((x, m) => x + m.add, 0)) }))
      .filter((f) => f.weight > 0 && feasible(f.option));
    let pool = weights.length ? weights : candidates.filter(feasible).map((o) => ({ option: o, weight: 1 }));
    if (!pool.length && d.default && feasible(d.default)) {
      res.applied = [d.default];
      res.reason = 'Задуманное оказалось невозможным — всё осталось как есть.';
      return;
    }
    if (!pool.length) pool = d.options.filter((o) => feasible(o.id)).slice(0, 1).map((o) => ({ option: o.id, weight: 1 }));
    if (!pool.length) throw new Error(`Совместное решение ${d.id}: нет объективно выполнимого исхода — ошибка сценария`);
    const total = pool.reduce((x, f) => x + f.weight, 0);
    const r = unit(`${s.seed}:joint:${d.id}`);
    res.roll = Math.round(r * 1e6) / 1e6;
    let acc = 0;
    for (const f of pool) { acc += f.weight / total; if (r < acc) { res.applied = [f.option]; break; } }
    if (!res.applied.length) res.applied = [pool[pool.length - 1].option];
    res.reason = 'Исход решили обстоятельства, которых никто из вас не контролировал.';
  };

  if (who.length === 0) {
    arbitrate([]);
    res.kind = 'world';
  } else if (who.length === 1) {
    res.kind = 'solo';
    if (feasible(given[0])) { res.applied = [given[0]]; res.reason = 'Решение принято одним игроком: второй не мог участвовать.'; }
    else arbitrate([given[0]]);
  } else {
    const [a, b] = given;
    const comp = d.compromises?.find((x) => ((x.pair[0] === a && x.pair[1] === b) || (x.pair[0] === b && x.pair[1] === a)) && evalCond(w, x.when));
    if (a === b) {
      res.kind = 'same';
      if (feasible(a)) { res.applied = [a]; res.reason = 'Вы решили одинаково.'; }
      else arbitrate([a]);
    } else if (d.compatible?.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
      res.kind = 'compatible';
      res.applied = [a, b].filter(feasible).sort();
      res.reason = 'Ваши решения дополняют друг друга.';
      if (!res.applied.length) arbitrate([a, b]);
    } else if (comp && feasible(comp.result)) {
      res.kind = 'compromise';
      res.applied = [comp.result];
      res.reason = 'Получилось найти компромисс.';
    } else {
      res.kind = 'conflict';
      arbitrate([a, b].sort());
    }
  }

  for (const id of res.applied) {
    const opt = d.options.find((o) => o.id === id)!;
    applyEffects(w, opt.effects);
    for (const p of PLAYERS) if (!isDead(s.chars[p].body)) log({ s, c, pid: p }, 'checkpoint', opt.text);
  }
  for (const p of PLAYERS) {
    if (answers[p] && who.includes(p)) s.vars[`joint.${d.id}.${p}`] = answers[p]!;
    if (!isDead(s.chars[p].body) && res.reason) log({ s, c, pid: p }, 'checkpoint', res.reason);
  }
  s.vars[`joint.${d.id}.result`] = res.applied.join('+');
  s.vars[`joint.${d.id}.kind`] = res.kind;
  for (const npcId of d.rememberedBy ?? []) {
    const n = s.npcs[npcId];
    if (!n?.alive) continue;
    for (const p of who) { const m = `${p}:${d.id}=${answers[p]}`; if (!n.memory.includes(m)) n.memory.push(m); }
    n.memory.sort();
  }
  const rec: HistoryRecord = { checkpoint: d.checkpoint, kind: 'joint', id: d.id, summary: `${res.kind}: ${res.applied.join(' + ')}`, data: { A: answers.A ?? '', B: answers.B ?? '', ...(res.roll !== undefined ? { roll: res.roll } : {}) } };
  s.history.push(rec);
  return res;
}

// ───────────── Особые состояния и поражение ─────────────

/**
 * Если оба не могут действовать — честно проматываем время, пока кто-то не очнётся или не умрёт.
 */
export function resolveHelplessness(c: Content, s: GameState): 'continue' | 'defeat' {
  if (PLAYERS.every((p) => isDead(s.chars[p].body))) return 'defeat';
  if (PLAYERS.some((p) => canAct(s.chars[p].body))) return 'continue';
  const limit = Math.max(s.chars.A.time, s.chars.B.time) + 14 * 1440;
  while (Math.max(s.chars.A.time, s.chars.B.time) < limit) {
    for (const p of PLAYERS) {
      const ch = s.chars[p];
      if (isDead(ch.body)) continue;
      const carer = s.vars[`${p}.caredBy`];
      if (typeof carer === 'string' && s.npcs[carer]?.alive) {
        // Уход NPC (только если он заранее был рядом и согласился помогать).
        ch.body.thirst = Math.max(0, ch.body.thirst - 25);
        ch.body.hunger = Math.max(0, ch.body.hunger - 15);
        for (const i of ch.body.injuries) if (i.treated === 'none') { i.treated = 'basic'; i.treatedAt = ch.time; }
      }
      tickBody(ch.body, ch.traits, ch.time, 60, 'rest', environment({ s, c, pid: p }), `${s.seed}:${p}`);
      ch.time += 60;
      if (canAct(ch.body)) return 'continue';
    }
    if (PLAYERS.every((p) => isDead(s.chars[p].body))) return 'defeat';
  }
  return 'defeat';
}

export interface CheckpointOutcome {
  state: GameState;
  joint: JointResult[];
  hash: string;
}

/**
 * Завершить контрольную точку: решить совместные вопросы, развести игроков по следующим сценам,
 * проверить поражение. Результат одинаков на обоих телефонах при одинаковых входах.
 */
export function completeCheckpoint(c: Content, merged: GameState, answers: Partial<Record<PlayerId, Record<string, string>>>): CheckpointOutcome {
  const s = clone(merged);
  const cpIndex = s.checkpoint + 1;
  const cp = c.checkpoints.find((x) => x.index === cpIndex);
  if (!cp) throw new Error(`Нет описания контрольной точки ${cpIndex}`);
  const joint: JointResult[] = [];
  for (const id of cp.joint) {
    joint.push(resolveJoint(c, s, id, { A: answers.A?.[id], B: answers.B?.[id] }));
  }
  s.checkpoint = cpIndex;
  markSegmentStart(s);
  const verdict = resolveHelplessness(c, s);
  for (const pid of PLAYERS) {
    const ch = s.chars[pid];
    if (isDead(ch.body)) { ch.controlledBy = 'engine'; continue; }
    if (isIncapacitated(ch.body)) {
      const partner = s.chars[other(pid)];
      ch.controlledBy = canAct(partner.body) ? other(pid) : 'engine';
      s.history.push({ checkpoint: cpIndex, kind: 'solo', id: `solo-${cpIndex}-${pid}`, summary: `${pid} недееспособен — участок без него` });
      continue;
    }
    ch.controlledBy = pid;
    const route = cp.next[pid].find((r) => evalCond({ s, c, pid }, r.when));
    if (!route) throw new Error(`Контрольная точка ${cpIndex}: нет следующей сцены для ${pid}`);
    const ctx: Ctx = { s, c, pid };
    ch.scene = route.scene;
    ch.visited[route.scene] = (ch.visited[route.scene] ?? 0) + 1;
    const sc = c.scenes[route.scene];
    if (sc?.location) ch.location = sc.location;
    applyEffects(ctx, sc?.onEnter);
  }
  if (verdict === 'defeat') {
    const t = Math.max(s.chars.A.time, s.chars.B.time);
    s.ended = { kind: 'defeat', at: t, reason: PLAYERS.every((p) => isDead(s.chars[p].body)) ? 'Оба персонажа погибли.' : 'Никто из вас не может действовать, и помощи не будет.' };
  } else if (cp.arcEnd) {
    s.ended = { kind: 'arc-end', at: Math.max(s.chars.A.time, s.chars.B.time), reason: 'Конец доступной части истории. Продолжение — в следующих главах.' };
  }
  return { state: s, joint, hash: stateHash(s) };
}

/** Проверка поражения посреди участка (например, оба уже мертвы). */
export function isDefeat(s: GameState): boolean {
  return PLAYERS.every((p) => isDead(s.chars[p].body));
}
