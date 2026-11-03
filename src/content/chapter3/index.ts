import { withCentralEchoes } from './continuity';
import type { Scene } from '../../engine/content-types';
import { entry, newEntry6, road, arrival } from './routes';
import { morning12Scenes, morning12Events } from './morning12';
import { farm6bScenes } from './farm6b';
import { farm6longScenes } from './farm6long';
import { farm6CareScenes, withFarmCare } from './farm6care';

// Участок 6 написан заново только для актуальной линии пары. Снятые участки 6–8 не подключать.
const checkpointScenes: Scene[] = [
  { id: 'c5_cp', for: 'any', chapter: 'ch3', checkpoint: 5, title: 'Полдень', universal: false, calm: true,
    text: [{ text: 'Ты садишься и достаёшь телефон. Палец оставляет на стекле след. Прежде чем говорить, приходится вытереть экран рукавом.' }], actions: [] },
  { id: 'c7_start', for: 'any', chapter: 'ch3', title: 'Продолжение', universal: false,
    text: [{ text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' }], actions: [] },
];

export const scenes3: Record<string, Scene> = Object.fromEntries([
  ...morning12Scenes, entry(5), newEntry6, road, arrival, ...farm6bScenes, ...farm6longScenes, ...farm6CareScenes, ...checkpointScenes,
].map(s => [s.id, withCentralEchoes(withFarmCare(s))]));
export const incidentEvents3 = [...morning12Events];
