// Базовые типы движка. Всё состояние — простые сериализуемые данные (JSON),
// чтобы его можно было сохранить, передать партнёру и детерминированно воспроизвести.

export type PlayerId = 'A' | 'B';
export const PLAYERS: readonly PlayerId[] = ['A', 'B'];
export const other = (p: PlayerId): PlayerId => (p === 'A' ? 'B' : 'A');

export type Scalar = number | string | boolean;

/** Абсолютное игровое время в минутах от 00:00 10.11.2026 (Европа/Берлин). */
export type Minutes = number;

// ───────────────────────────── Тело ─────────────────────────────

export type Consciousness = 'awake' | 'asleep' | 'unconscious' | 'coma' | 'dead';

export type BodySite = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'hands' | 'leftLeg' | 'rightLeg' | 'feet';

export type InjuryKind =
  | 'bruise' | 'cut' | 'laceration' | 'scratch' | 'bite'
  | 'sprain' | 'fracture' | 'burn' | 'concussion';

export interface Injury {
  id: string;
  kind: InjuryKind;
  site: BodySite;
  severity: 1 | 2 | 3 | 4 | 5;
  /** Кровопотеря в пунктах (0–100) в час без обработки. */
  bleeding: number;
  treated: 'none' | 'basic' | 'proper';
  since: Minutes;
  /** Бактериальная инфекция раны (не путать со скрытым возбудителем). */
  woundInfected: boolean;
  /** 0 → свежая, 1 → зажила. */
  healed: number;
  /** Скрытая отметка: был ли контакт с биологическими жидкостями заражённого. */
  exposure?: number;
}

export interface Illness {
  id: string;
  /** Внутренний вид болезни. Игроку НЕ показывается — UI видит только симптомы. */
  kind: string;
  stage: number;
  since: Minutes;
  /** 0..1 — тяжесть текущей стадии. */
  severity: number;
  /** Следующий детерминированный переход стадии. */
  nextAt?: Minutes;
  /** Исход, определённый при заражении (seeded), хранится в состоянии. */
  fate?: string;
}

export interface Body {
  hunger: number;      // 0 сыт … 100 истощение
  thirst: number;      // 0 … 100 тяжёлое обезвоживание
  fatigue: number;     // 0 … 100 физическое изнеможение
  sleepDebt: number;   // часы недосыпа
  awakeSince: Minutes;
  bloodLoss: number;   // 0 … 100 (100 = смерть)
  coreTemp: number;    // °C
  stress: number;      // 0 … 100
  dehydratedSince?: Minutes;
  injuries: Injury[];
  illnesses: Illness[];
  consciousness: Consciousness;
  consciousSince: Minutes;
  /** До какого времени действует лекарство: painkiller, antipyretic, antibiotic. */
  meds: Record<string, Minutes>;
  /** Скрытые броски, уже сделанные для этого тела (заражение раны, возбудитель…). */
  rolled: Record<string, boolean>;
  diedAt?: Minutes;
  causeOfDeath?: string;
}

/** Постоянные черты персонажа, 0–5. Задаются при создании и не растут магически. */
export interface Traits {
  strength: number;
  endurance: number;
  agility: number;
  /** Рукопашный бой (у игрока A — бокс в прошлом). */
  melee: number;
  medicine: number;
  driving: number;
  stealth: number;
  persuasion: number;
  technical: number;
}

export interface NameForms {
  nom: string;  // Андрей
  gen: string;  // Андрея
  dat: string;  // Андрею
  acc: string;  // Андрея
  ins: string;  // Андреем
  pre: string;  // Андрее
}

/** Постоянные бытовые правила (п. 5.1) — автоматизируют рутину, но не сюжет. */
export interface StandingRules {
  chargePhoneWhenFreePower: boolean;
  drinkWhenThirsty: boolean;
  eatWhenHungry: boolean;
  /** Не тратить на рутину предметы с этими тегами (например, «резерв»). */
  keepReserve: boolean;
}

export interface CharacterState {
  id: PlayerId;
  name: NameForms;
  gender: 'm' | 'f';
  traits: Traits;
  body: Body;
  location: string;
  time: Minutes;
  scene: string;
  rules: StandingRules;
  /** Кто управляет персонажем в текущем участке (если игрок недееспособен — движок/партнёр). */
  controlledBy: PlayerId | 'engine';
  /** Посещённые сцены (для повторов, достижимости и итогов). */
  visited: Record<string, number>;
  /** Выполненные неповторяемые действия: «сцена/действие» → сколько раз. */
  done: Record<string, number>;
}

// ───────────────────────────── Предметы ─────────────────────────────

export type ItemLocation =
  | { kind: 'char'; id: PlayerId }
  | { kind: 'place'; id: string }
  | { kind: 'npc'; id: string }
  | { kind: 'container'; id: string }
  | { kind: 'gone' };

export interface ItemInstance {
  id: string;
  type: string;
  qty: number;
  /** 0–100 — износ/порча. */
  condition: number;
  /** Заряд батареи/телефона, 0–100 %. */
  charge?: number;
  /** Литры топлива: бак машины, канистра, бак генератора. */
  fuel?: number;
  at: ItemLocation;
  /** Игровое время последнего изменения — для слияния. */
  changedAt: Minutes;
  note?: string;
}

// ───────────────────────────── NPC ─────────────────────────────

export interface NpcState {
  id: string;
  alive: boolean;
  location: string;
  status: 'ok' | 'injured' | 'sick' | 'infected' | 'turned' | 'dead' | 'missing';
  /** Доверие к каждому игроку отдельно, −100…100. */
  trust: Record<PlayerId, number>;
  /** Что NPC помнит: «A:refused_help», «B:supported_evacuation»… */
  memory: string[];
  vars: Record<string, Scalar>;
  /** Выполненные пункты собственного плана NPC. */
  agendaDone: string[];
  changedAt: Minutes;
}

// ───────────────────────────── Знания ─────────────────────────────

export type KnowledgeKind = 'fact' | 'rumor' | 'guess' | 'false';

export interface KnowledgeEntry {
  kind: KnowledgeKind;
  at: Minutes;
  source: string;
}

// ───────────────────────────── Журнал ─────────────────────────────

export interface LogEntry {
  seq: number;
  pid: PlayerId;          // чей это журнал
  at: Minutes;
  kind: 'story' | 'action' | 'body' | 'item' | 'news' | 'npc' | 'system' | 'message' | 'checkpoint';
  text: string;
}

export interface Message {
  id: string;
  from: PlayerId;
  to: PlayerId;
  at: Minutes;
  template: string;
  text: string;
  delivered: boolean;
}

// ───────────────────────────── Состояние игры ─────────────────────────────

export interface GameState {
  schema: number;
  engineVersion: string;
  contentVersion: string;
  pairId: string;
  seed: string;
  /** Номер последней пройденной контрольной точки (0 — старт). */
  checkpoint: number;
  vars: Record<string, Scalar>;
  /** Игровое время последнего изменения переменной (для правила «позже»). */
  varTime: Record<string, Minutes>;
  chars: Record<PlayerId, CharacterState>;
  npcs: Record<string, NpcState>;
  items: Record<string, ItemInstance>;
  knowledge: Record<PlayerId, Record<string, KnowledgeEntry>>;
  firedEvents: Record<string, Minutes>;
  messages: Message[];
  log: LogEntry[];
  /** Счётчики детерминированного генератора случайности — свои у каждого игрока. */
  rng: Record<PlayerId, number>;
  /** Счётчик идентификаторов новых объектов — свой у каждого игрока (без коллизий при слиянии). */
  idSeq: Record<PlayerId, number>;
  logSeq: Record<PlayerId, number>;
  /** Итоги совместных решений и синхронизаций. */
  history: HistoryRecord[];
  /** Финал: поражение или конец доступного сюжета. */
  ended?: { kind: 'defeat' | 'arc-end'; at: Minutes; reason: string };
}

export interface HistoryRecord {
  checkpoint: number;
  kind: 'merge' | 'joint' | 'event' | 'solo';
  id: string;
  summary: string;
  data?: Record<string, Scalar>;
}

// ───────────────────────────── Условия и эффекты (DSL сюжета) ─────────────────────────────

export type CmpOp = '<' | '<=' | '==' | '!=' | '>=' | '>';

/**
 * Условие. Ключи переменных: «w.*» — мир, «$.*» — текущий игрок, «A.*»/«B.*» — конкретный игрок.
 */
export type Cond =
  | { all: Cond[] }
  | { any: Cond[] }
  | { not: Cond }
  | { flag: string }
  | { v: string; op: CmpOp; value: Scalar }
  | { has: string; qty?: number }
  | { hasTag: string; qty?: number }
  | { body: keyof Pick<Body, 'hunger' | 'thirst' | 'fatigue' | 'sleepDebt' | 'bloodLoss' | 'coreTemp' | 'stress'>; op: CmpOp; value: number }
  | { cap: 'mobility' | 'focus' | 'strength' | 'canAct'; op: CmpOp; value: number }
  | { injured: InjuryKind | 'any'; site?: BodySite; minSeverity?: number }
  | { bleeding: true }
  | { trait: keyof Traits; op: CmpOp; value: number }
  | { after: Minutes } | { before: Minutes }
  | { daylight: boolean }
  | { at: string }
  | { knows: string; kind?: KnowledgeKind }
  | { npc: string; alive?: boolean; at?: string; status?: NpcState['status']; trust?: [CmpOp, number]; remembers?: string }
  | { visited: string; times?: number }
  | { event: string }
  | { partner: 'dead' | 'incapacitated' | 'active' }
  | { scene: string }
  | { phoneUsable: true }
  | { network: 'voice' | 'data' | 'sms' }
  | { fuelFor: string; km: number }
  /** В машине этого типа (где бы она ни стояла) не меньше столько-то литров. */
  | { fuelIn: string; liters: number }
  /** Оба телефона живы, оба в сознании и в ближайшие полчаса есть голосовая связь у обоих. */
  | { callable: true }
  /** Партнёр сейчас в этом месте. */
  | { partnerAt: string }
  /** Партнёр знает этот факт (для обмена новостями при встрече на контрольной точке). */
  | { partnerKnows: string }
  | { project: string; done?: boolean; progress?: [CmpOp, number] }
  | { stocked: string; qty: number; at?: string }
  | { always: true };

export type Activity = 'sleep' | 'rest' | 'light' | 'moderate' | 'heavy';

export type Effect =
  | { set: string; value: Scalar }
  | { add: string; value: number }
  | { give: string; qty?: number; charge?: number; condition?: number; note?: string; fuel?: number }
  | { take: string; qty?: number }
  | { takeTag: string; qty?: number }
  | { drop: string; qty?: number }
  | { pickup: string; place?: string; qty?: number }
  | { place: string; at: string; qty?: number; charge?: number }
  | { charge: string; delta: number }
  | { body: keyof Pick<Body, 'hunger' | 'thirst' | 'fatigue' | 'sleepDebt' | 'bloodLoss' | 'stress'>; delta: number }
  | { injure: InjuryKind; site: BodySite; severity: 1 | 2 | 3 | 4 | 5; bleeding?: number; exposure?: number }
  | { treat: 'basic' | 'proper'; target?: PlayerId | '$' | '@partner' }
  | { illness: string; target?: PlayerId | '$' }
  | { medicate: 'painkiller' | 'antipyretic' | 'antibiotic'; hours: number }
  /** quiet — не дублировать текст факта в журнале (новость уже показана своим текстом). */
  | { learn: string; kind?: KnowledgeKind; source?: string; quiet?: boolean }
  | { move: string }
  | { npc: string; trust?: number; remember?: string; set?: Record<string, Scalar>; status?: NpcState['status']; moveTo?: string; alive?: boolean }
  | { log: string; kind?: LogEntry['kind'] }
  | { message: string; to?: PlayerId | '@partner' }
  | { wait: number; activity?: Activity }
  | { sleep: number }
  | { die: string }
  | { faint: number }
  | { rule: keyof StandingRules; value: boolean }
  | { drive: string; km: number; to?: string; jam?: number }
  | { refuel: string; liters: number; fromCan?: string }
  | { fillCan: string; liters: number }
  | { work: string; hours: number }
  | { stock: string; qty: number; at?: string }
  | { unstock: string; qty: number; at?: string }
  | { if: Cond; then: Effect[]; else?: Effect[] };
