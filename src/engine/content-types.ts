// Формат сюжетного контента. Сюжет — данные, а не код интерфейса:
// новые главы добавляются новыми модулями с этими структурами.
import type {
  Activity, BodySite, Cond, Effect, KnowledgeKind, Minutes, NpcState, PlayerId, Scalar, Traits,
} from './types';

export interface ItemType {
  id: string;
  name: string;
  /** Граммы за единицу. */
  weight: number;
  /** Литры за единицу (для рюкзака/багажника). */
  volume?: number;
  tags: string[];
  /** Пищевая ценность: насколько снижает голод/жажду одна единица. */
  food?: { hunger?: number; thirst?: number; minutes?: number; kcal?: number };
  /** Транспорт: вид топлива, бак (л), расход (л/100 км), мест. Топливо — в ItemInstance.fuel. */
  vehicle?: { fuel: 'petrol' | 'diesel'; tankL: number; per100km: number; seats: number; cargoL?: number };
  /** Канистра/бочка: вид топлива и объём. */
  fuelCan?: { fuel: 'petrol' | 'diesel'; capacityL: number };
  /** Через сколько минут портится (скоропорт). */
  spoilsAfter?: number;
  /** Батарея: разряд % в час при обычном использовании. */
  battery?: { drainPerHour: number; idleDrainPerHour: number };
  /** Утепление одежды 0–5 и защита от укусов 0–5. */
  clothing?: { warmth: number; biteProtection: number; slot: 'outer' | 'legs' | 'feet' | 'hands' | 'head' };
  medical?: { treats: 'basic' | 'proper'; uses: number };
  description?: string;
}

export interface LocationDef {
  id: string;
  name: string;
  /** Регион для покрытия связи/событий: «hh-mitte», «harburg», «lk-harburg» … */
  region: string;
  indoor: boolean;
  /** Есть ли розетка, которой можно пользоваться бесплатно (пока есть ток). */
  power?: 'grid' | 'none';
  safe?: boolean;
  /** Есть водопровод (работает, пока w.water.<region> ≠ 'off'). */
  water?: boolean;
  /** Откуда здесь доходят новости: радио, телевизор, люди вокруг. */
  media?: ('radio' | 'tv' | 'people')[];
  description?: string;
}

/** Маршрут между точками. Расстояния — реальные (см. docs/ARCHITECTURE.md, раздел «География»). */
export interface RouteDef {
  from: string;
  to: string;
  km: number;
  modes: Partial<Record<'foot' | 'bike' | 'car' | 'train' | 'bus', number>>; // минуты в норме
  note?: string;
}

export interface TextBlock {
  text: string;
  when?: Cond;
}

export interface Check {
  /** Какие черты помогают (берётся среднее). */
  traits: (keyof Traits)[];
  /** Сложность 0–10. 5 — обычному человеку пополам. */
  difficulty: number;
  /** Какие текущие способности учитываются. */
  uses?: ('mobility' | 'focus' | 'strength')[];
  /** Дополнительные модификаторы по условиям (например, фонарик, напарник). */
  mods?: { when: Cond; bonus: number }[];
}

export interface Outcome {
  id: string;
  when?: Cond;
  /** Фиксированная вероятность (0..1) — если нет check. */
  chance?: number;
  /** Проверка навыка — вероятность считается из черт и состояния тела. */
  check?: Check;
  /** Если check/chance не прошли — следующий outcome. */
  text?: string;
  effects?: Effect[];
  goto?: string;
  /** Остановить дальнейшее выполнение плана из нескольких действий. */
  interrupt?: boolean;
}

export interface ActionDef {
  id: string;
  label: string;
  hint?: string;
  /** Показывать ли действие. */
  when?: Cond;
  /** Доступно ли (иначе показывается неактивным с причиной). */
  enabled?: Cond;
  disabledReason?: string;
  /** Длительность в минутах (до учёта травм/усталости, если move=true). */
  minutes: number;
  activity?: Activity;
  /** Действие — перемещение: длительность растёт при плохой подвижности. */
  move?: boolean;
  /** Можно выбирать вместе с другими действиями сцены. */
  combinable?: boolean;
  /** Взаимоисключающая группа: из одной группы — только одно действие. */
  group?: string;
  /** Уводит из сцены — в плане может быть только последним. */
  terminal?: boolean;
  /** Можно ли выполнить повторно в этой сцене. */
  repeatable?: boolean;
  /** Рискованное действие (UI помечает). */
  risky?: boolean;
  /** Требования к нескольким действиям по порядку: «только после X». */
  requiresDone?: string[];
  effects?: Effect[];
  outcomes?: Outcome[];
  text?: string;
  goto?: string;
}

export interface Scene {
  id: string;
  /** Чья это сцена (сюжетные линии раздельные). */
  for: PlayerId | 'any';
  location?: string;
  /** Глава/участок — для ленивой загрузки и документации. */
  chapter: string;
  title?: string;
  text: TextBlock[];
  onEnter?: Effect[];
  actions: ActionDef[];
  /** Универсальные действия (поесть, попить, перевязать, отдохнуть…). По умолчанию — да. */
  universal?: boolean;
  /** Сцена безопасна: можно спать, срабатывают бытовые правила. */
  safe?: boolean;
  /** Спокойная обстановка: бытовые правила (попить, поесть) срабатывают, но спать нельзя. */
  calm?: boolean;
  /** Сцена — прибытие на контрольную точку с этим номером. */
  checkpoint?: number;
  /** Активность фона, пока игрок читает и ничего не делает. */
  ambient?: { tempC?: number; wet?: boolean; outdoor?: boolean };
}

export interface FactDef {
  id: string;
  /** Как это видит игрок. */
  text: string;
  /** Тема для журнала: «болезнь», «транспорт», «люди» … */
  topic: string;
  /** Объективная правда (только для документации/тестов; в UI не попадает). */
  truth?: 'true' | 'false' | 'partial';
}

export interface AgendaItem {
  id: string;
  /** Не раньше этого времени. */
  at?: Minutes;
  when?: Cond;
  effects: Effect[];
  /** От чьего лица проверять «$» в условиях (обычно — игрок, рядом с которым NPC). */
  scope: PlayerId | 'world';
}

export interface NpcDef {
  id: string;
  name: string;
  /** Короткое описание, известное игроку при знакомстве. */
  intro: string;
  /** Скрытые цели/страхи — для сценариста, не для UI. */
  hidden?: { goals: string[]; fears: string[]; secrets?: string[] };
  initial: Omit<NpcState, 'id' | 'agendaDone' | 'changedAt'>;
  agenda: AgendaItem[];
}

export interface WorldEvent {
  id: string;
  at: Minutes;
  /** Чья временная линия запускает событие: свои события у каждой линии, «world» — у обеих. */
  scope: PlayerId | 'world';
  when?: Cond;
  /** Эффекты на объективный мир (одинаковы на обеих линиях). */
  effects?: Effect[];
  /** Что игрок узнаёт — только если есть канал (телефон, радио, люди рядом). */
  news?: { text: string; channel: 'phone' | 'radio' | 'people' | 'any' | 'direct'; learn?: string; kind?: KnowledgeKind }[];
  /** Прервать текущий план действий. */
  interrupt?: boolean;
}

export interface JointOption {
  id: string;
  label: Partial<Record<PlayerId, string>> & { default: string };
  /** Можно ли этот вариант выбрать конкретному игроку. */
  when?: Cond;
  /** Объективная выполнимость (проверяется на общем мире после слияния). */
  feasible?: Cond;
  effects: Effect[];
  text: string;
}

export interface JointArbiter {
  id: string;
  /** Объективная причина, существовавшая заранее (переменная мира, NPC, погода…). */
  when: Cond;
  /** Какой вариант она выбирает. */
  winner: string;
  text: string;
  effects?: Effect[];
}

export interface JointDecision {
  id: string;
  checkpoint: number;
  /** Вопрос с точки зрения каждого игрока (у них разные знания). */
  prompt: Partial<Record<PlayerId, string>> & { default: string };
  /** Может ли игрок участвовать (в сознании, есть связь с партнёром/группой). */
  canParticipate?: Cond;
  options: JointOption[];
  /** Пары вариантов, которые выполняются вместе. */
  compatible?: [string, string][];
  /** Компромисс для пары разных вариантов, если он объективно возможен. */
  compromises?: { pair: [string, string]; result: string; when?: Cond }[];
  /** Внешние обстоятельства для полностью несовместимых вариантов, по порядку. */
  arbiters: JointArbiter[];
  /** Что происходит само собой, если выбранное объективно невозможно (обычно — «ничего не менять»). */
  default?: string;
  /**
   * Если ни одно обстоятельство не сработало — взвешенная случайность по заранее
   * описанным причинам (сохраняется в истории). Веса — объективные условия.
   */
  fallbackWeights?: { option: string; base: number; mods?: { when: Cond; add: number }[] }[];
  /** Что NPC запомнят о позиции каждого игрока. */
  rememberedBy?: string[];
}

export interface CheckpointDef {
  index: number;
  title: string;
  /** Время, к которому сводятся часы обоих персонажей (не раньше их собственного). */
  syncNotBefore?: Minutes;
  joint: string[];
  /** Куда идёт каждый игрок после контрольной точки (первое подходящее условие). */
  next: Record<PlayerId, { when?: Cond; scene: string }[]>;
  /** Конец доступного сюжета (бета). */
  arcEnd?: boolean;
}

/** Долгая работа: ремонт, укрепление, огород. Прогресс — часы, хранится в proj.<id>.progress. */
export interface ProjectDef {
  id: string;
  name: string;
  hours: number;
  traits: (keyof Traits)[];
  difficulty: number;
  /** Без этих предметов (у игрока или на месте работ) работа не начнётся. */
  needs?: { type: string; qty: number; consumed?: boolean }[];
  /** Где можно работать. */
  at?: string[];
  /** Что даёт завершение. */
  onDone?: Effect[];
}

/** Убежище/база: общий склад, жильцы, ежедневный расход (06:00). */
export interface BaseDef {
  id: string;
  name: string;
  /** Локации, которые считаются базой. */
  places: string[];
  /** Где лежит общий склад. */
  stock: string;
  /** Литров воды на человека в сутки (питьё + готовка). */
  waterPerPerson: number;
  kcalPerPerson: number;
  /** Отопление: тег топлива (дрова, кг) и расход в сутки при данной температуре улицы. */
  heating?: { tag: string; perDay: (outsideC: number) => number };
  /** Если вода не из склада, а из скважины/водопровода — условие, когда она есть. */
  freeWater?: Cond;
}

export type MergePolicy = 'delta' | 'latest' | 'max' | 'min' | 'or' | 'and';

export interface MessageTemplate {
  id: string;
  label: string;
  text: string;
  learn?: string;
}

export interface CharacterTemplate {
  pid: PlayerId;
  gender: 'm' | 'f';
  traits: Traits;
  startScene: string;
  startLocation: string;
  startItems: { type: string; qty?: number; charge?: number; condition?: number }[];
}

export interface Content {
  version: string;
  epochLabel: string;
  items: Record<string, ItemType>;
  locations: Record<string, LocationDef>;
  routes: RouteDef[];
  scenes: Record<string, Scene>;
  facts: Record<string, FactDef>;
  npcs: Record<string, NpcDef>;
  events: WorldEvent[];
  joint: Record<string, JointDecision>;
  checkpoints: CheckpointDef[];
  messages: MessageTemplate[];
  projects?: Record<string, ProjectDef>;
  bases?: BaseDef[];
  characters: Record<PlayerId, CharacterTemplate>;
  initialVars: Record<string, Scalar>;
  /** Предметы, которые лежат в местах мира на старте (квартиры, двор, машина). */
  initialPlaceItems?: { type: string; at: string; qty?: number; charge?: number; fuel?: number; condition?: number }[];
  /** Факты, которые персонаж знает с самого начала. */
  initialKnowledge?: Partial<Record<PlayerId, string[]>>;
  /** Правило слияния для переменных: точное имя или префикс с «*». По умолчанию — latest. */
  mergePolicies: Record<string, MergePolicy>;
  /** Погода по часам: возвращает температуру и осадки для региона. */
  weather: (region: string, t: Minutes) => { tempC: number; rain: boolean; wind: number };
  /** Связь по региону и времени — объективная, из переменных мира. */
  network?: (region: string, t: Minutes, vars: Record<string, Scalar>) => { voice: boolean; sms: boolean; data: boolean };
}

export type { BodySite };
