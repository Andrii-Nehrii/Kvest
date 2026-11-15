import { withCentralEchoes } from './continuity';
import type { Scene } from '../../engine/content-types';
import { entry, newEntry6, newEntry8, newEntry9, newEntry10, newEntry11, newEntry12, newEntry13, newEntry14, newEntry15, newEntry16, newEntry17, newEntry18, newEntry19, newEntry20, newEntry21, newEntry22, newEntry23, newEntry24, newEntry25, newEntry26, newEntry27, newEntry28, newEntry29, newEntry30, newEntry31, road, arrival } from './routes';
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
import { night10SScenes } from './night10s';
import { night10FScenes } from './night10f';
import { night10Scenes } from './night10';
import { dawn11Scenes } from './dawn11';
import { day11Scenes } from './day11';
import { noon11Scenes } from './noon11';
import { day12Scenes } from './day12';
import { day13Scenes } from './day13';
import { day13xScenes } from './day13x';
import { day14Scenes } from './day14';
import { day14xScenes } from './day14x';
import { day15Scenes } from './day15';
import { day15xScenes } from './day15x';
import { day16Scenes } from './day16';
import { day16xScenes } from './day16x';
import { day17Scenes } from './day17';
import { day17xScenes } from './day17x';
import { day18yScenes } from './day18y';
import { checkpoint20, shared19 } from './point19';
import { day20GScenes } from './day20g';
import { day20FScenes } from './day20f';
import { day20DScenes } from './day20d';
import { day20XScenes } from './day20x';
import { shared21 } from './point21';
import { day21CScenes } from './day21c';
import { day21FScenes } from './day21f';
import { day21RScenes } from './day21r';
import { day21LScenes } from './day21l';
import { shared22 } from './point22';
import { day22AScenes } from './day22a';
import { day22BScenes } from './day22b';
import { shared23 } from './point23';
import { day23AScenes } from './day23a';
import { day23BScenes } from './day23b';
import { shared24 } from './point24';
import { day24AScenes } from './day24a';
import { day24BScenes } from './day24b';
import { shared25 } from './point25';
import { day25AScenes } from './day25a';
import { day25BScenes } from './day25b';
import { shared26 } from './point26';
import { day26AScenes } from './day26a';
import { day26BScenes } from './day26b';
import { shared27 } from './point27';
import { day27AScenes } from './day27a';
import { day27BScenes } from './day27b';
import { shared28 } from './point28';
import { day28AScenes } from './day28a';
import { day28BScenes } from './day28b';
import { shared29 } from './point29';
import { day29Scenes } from './day29x';
import { shared30 } from './point30';
import { day30Scenes } from './day30';
import { shared31 } from './point31';
import { day31AScenes } from './day31a';
import { day31BScenes } from './day31b';
import { day31RScenes } from './day31r';
import { day19AScenes } from './day19a';
import { day19BScenes } from './day19b';
import { day19XScenes } from './day19x';
import { checkpoint18, evening18 } from './point18';
import { day18AScenes } from './day18a';
import { day18BScenes } from './day18b';
import { day18xScenes } from './day18x';

// Участок 6 написан заново только для актуальной линии пары. Снятые участки 6–8 не подключать.
const checkpointScenes: Scene[] = [
  { id: 'c5_cp', for: 'any', chapter: 'ch3', checkpoint: 5, title: 'Полдень', universal: false, calm: true,
    text: [{ text: 'Ты садишься и достаёшь телефон. Палец оставляет на стекле след. Прежде чем говорить, приходится вытереть экран рукавом.' }], actions: [] },
  { id: 'c32_start', for: 'any', chapter: 'ch3', title: 'Продолжение', universal: false,
    text: [{ text: 'Здесь пока заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' }], actions: [] },
];

export const scenes3: Record<string, Scene> = Object.fromEntries([
  ...morning12Scenes, entry(5), newEntry6, road, arrival, ...farm6bScenes, ...farm6longScenes, ...farm6CareScenes, ...night7Scenes, ...night7AScenes, ...night7BScenes, ...dawn7AScenes, ...dawn7BScenes, ...dawn7Scenes,
  newEntry8, ...road8Scenes, ...search8AScenes, ...return8AScenes, ...bus8BScenes, ...wait8BScenes, ...meeting8Scenes,
  newEntry9, ...entry9Scenes, ...farm9AScenes, ...farm9BScenes, ...common9Scenes,
  newEntry10, ...night10SScenes, ...night10FScenes, ...night10Scenes,
  newEntry11, ...dawn11Scenes, ...day11Scenes, ...noon11Scenes,
  newEntry12, ...day12Scenes, newEntry13, ...day13Scenes, ...day13xScenes, newEntry14, ...day14Scenes, ...day14xScenes, newEntry15, ...day15Scenes, ...day15xScenes, newEntry16, ...day16Scenes, ...day16xScenes, newEntry17, ...day17Scenes, ...day17xScenes, newEntry18, ...day18AScenes, ...day18BScenes, ...day18xScenes, ...day18yScenes, evening18, checkpoint18, newEntry19, ...shared19, ...day19AScenes, ...day19BScenes, ...day19XScenes, newEntry20, ...day20GScenes, ...day20FScenes, ...day20DScenes, ...day20XScenes, ...checkpoint20, newEntry21, ...shared21, ...day21CScenes, ...day21FScenes, ...day21RScenes, ...day21LScenes, newEntry22, ...shared22, ...day22AScenes, ...day22BScenes, newEntry23, ...shared23, ...day23AScenes, ...day23BScenes, newEntry24, ...shared24, ...day24AScenes, ...day24BScenes, newEntry25, ...shared25, ...day25AScenes, ...day25BScenes, newEntry26, ...shared26, ...day26AScenes, ...day26BScenes, newEntry27, ...shared27, ...day27AScenes, ...day27BScenes, newEntry28, ...shared28, ...day28AScenes, ...day28BScenes, newEntry29, ...shared29, ...day29Scenes, newEntry30, ...shared30, ...day30Scenes, newEntry31, ...shared31, ...day31AScenes, ...day31BScenes, ...day31RScenes, ...checkpointScenes,
].map(s => [s.id, withCentralEchoes(withFarmCare(s))]));
export const incidentEvents3 = [...morning12Events];
