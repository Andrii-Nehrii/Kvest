import { withCentralEchoes } from './continuity';
import type { Scene } from '../../engine/content-types';
import { entry, newEntry6, newEntry8, newEntry9, road, arrival } from './routes';
import { morning12Scenes, morning12Events } from './morning12';
import { farm6bScenes } from './farm6b';
import { farm6longScenes } from './farm6long';
import { farm6CareScenes, withFarmCare } from './farm6care';
import { night7Scenes } from './night7';
import { night7AScenes } from './night7a';
import { night7BScenes } from './night7b';
import { dawn7AScenes } from './dawn7a';
import { dawn7BScenes } from './dawn7b';
import { dawn7Scenes } from './dawn7';
import { road8Scenes } from './road8';
import { search8AScenes } from './search8a';
import { return8AScenes } from './return8a';
import { bus8BScenes } from './bus8b';
import { wait8BScenes } from './wait8b';
import { meeting8Scenes } from './meeting8';
import { entry9Scenes } from './entry9';
import { farm9AScenes } from './farm9a';
import { farm9BScenes } from './farm9b';
import { common9Scenes } from './common9';

// Участок 6 написан заново только для актуальной линии пары. Снятые участки 6–8 не подключать.
const checkpointScenes: Scene[] = [
  { id: 'c5_cp', for: 'any', chapter: 'ch3', checkpoint: 5, title: 'Полдень', universal: false, calm: true,
    text: [{ text: 'Ты садишься и достаёшь телефон. Палец оставляет на стекле след. Прежде чем говорить, приходится вытереть экран рукавом.' }], actions: [] },
  { id: 'c10_start', for: 'any', chapter: 'ch3', title: 'Продолжение', universal: false,
    text: [{ text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' }], actions: [] },
];

export const scenes3: Record<string, Scene> = Object.fromEntries([
  ...morning12Scenes, entry(5), newEntry6, road, arrival, ...farm6bScenes, ...farm6longScenes, ...farm6CareScenes, ...night7Scenes, ...night7AScenes, ...night7BScenes, ...dawn7AScenes, ...dawn7BScenes, ...dawn7Scenes,
  newEntry8, ...road8Scenes, ...search8AScenes, ...return8AScenes, ...bus8BScenes, ...wait8BScenes, ...meeting8Scenes,
  newEntry9, ...entry9Scenes, ...farm9AScenes, ...farm9BScenes, ...common9Scenes, ...checkpointScenes,
].map(s => [s.id, withCentralEchoes(withFarmCare(s))]));
export const incidentEvents3 = [...morning12Events];
