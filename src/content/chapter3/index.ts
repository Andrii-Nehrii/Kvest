import { withCentralEchoes } from './continuity';
import type { Scene } from '../../engine/content-types';
import { entry, road, arrival } from './routes';
import { morning12Scenes, morning12Events } from './morning12';

// Глава 3 сейчас написана до КТ 5 (участок 5). Участки 6–8 сняты 02.11 по решению владельца — пишутся заново по одному
// (docs/hidden/CHAPTER3_BRIEF.md). После последней написанной точки игроки видят экран продолжения: это сцена
// `c{WRITTEN_TO + 1}_start` без действий. Когда участок 6 готов — его сцены сюда, `WRITTEN_TO` в kt5.ts → 6, экран → c7_start.
const checkpointScenes: Scene[] = [
  { id: 'c5_cp', for: 'any', chapter: 'ch3', checkpoint: 5, title: 'Полдень', universal: false, calm: true,
    text: [{ text: 'Ты садишься и достаёшь телефон. Палец оставляет на стекле след. Прежде чем говорить, приходится вытереть экран рукавом.' }], actions: [] },
  { id: 'c6_start', for: 'any', chapter: 'ch3', title: 'Продолжение', universal: false,
    text: [{ text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' }], actions: [] },
];

export const scenes3: Record<string, Scene> = Object.fromEntries([
  ...morning12Scenes, entry(5), road, arrival, ...checkpointScenes,
].map(s => [s.id, withCentralEchoes(s)]));
export const incidentEvents3 = [...morning12Events];
