import { withCentralEchoes } from './continuity';
import { farm8Scenes, farm8Events } from './farm8';
import { farm7Scenes, farm7Events } from './farm7';
import { farm6Scenes, farm6Events } from './farm6';
import type { Scene } from '../../engine/content-types';
import { excursions } from './excursions';
import { arrival, entry, relocate, road } from './routes';
import { morning12Scenes, morning12Events } from './morning12';
import { afternoon12Scenes, afternoon12Events } from './afternoon12';
import { morning13Scenes, morning13Events } from './morning13';
import { afternoon13Scenes, afternoon13Events } from './afternoon13';

const checkpointScenes: Scene[] = [
  { id: 'c5_cp', for: 'any', chapter: 'ch3', checkpoint: 5, title: 'Полдень', universal: false, calm: true,
    text: [{ text: 'Ты садишься и достаёшь телефон. Палец оставляет на стекле след. Прежде чем говорить, приходится вытереть экран рукавом.' }], actions: [] },
  { id: 'c6_cp', for: 'any', chapter: 'ch3', checkpoint: 6, title: 'Ночь', universal: false, calm: true,
    text: [{ text: 'Ты расстёгиваешь верхнюю пуговицу. Под воротником саднит кожа. Телефон пока держишь в руке — убрать его можно после разговора.' }], actions: [] },
  { id: 'c7_cp', for: 'any', chapter: 'ch3', checkpoint: 7, title: 'Полдень', universal: false, calm: true,
    text: [{ text: 'На дисплее полдень. Ты пропускаешь ремень рюкзака под ногой, чтобы не упустить вещи, и освобождаешь вторую руку.' }], actions: [] },
  { id: 'c8_cp', for: 'any', chapter: 'ch3', checkpoint: 8, title: 'Ночь', universal: false, calm: true,
    text: [{ text: 'Ты ставишь воду рядом с рукой. Шнурок развязался; наклонившись к нему, ты замечаешь, как дрожат колени. Сначала садишься.' }], actions: [] },
  { id: 'c9_start', for: 'any', chapter: 'ch4', title: 'Продолжение', universal: false,
    onEnter: [{ if: { all: [{ cp: 8 }, { at: 'hof_luedemann' }, { flag: 'w.c3_f8_window_broken' }, { not: { flag: '$.c8_cold_night_cost' } }] }, then: [{ set: '$.c8_cold_night_cost', value: true }, { body: 'sleepDebt', delta: 1 }] }],
    text: [
      { when: { all: [{ cp: 8 }, { at: 'hof_luedemann' }, { flag: 'w.c3_f8_window_broken' }] }, text: 'Оле закрывает дверь остывшей кухни. Твои вещи остаются в соседней комнате. {partner} просит оставить рядом место и для {pm:него|неё}.' },
      { when: { all: [{ cp: 8 }, { at: 'hof_luedemann' }, { npcVar: 'henrike', key: 'c3_smoke_shoulder' }] }, text: 'Хенрике просит не трогать больное плечо. Оле помогает ей лечь. Когда ты оборачиваешься, он всё ещё держит её пальто.' },
      { when: { all: [{ cp: 8 }, { at: 'hof_luedemann' }, { flag: '$.c8_fpawel.answered' }] }, text: 'На телефоне Павла остался его ответ домой. Ничего про скорую дорогу он не обещал. Телефон он убирает сам.' },
      { text: 'Здесь заканчивается написанная часть истории. Пройденное сохранено. Продолжение начнётся с этого места.' },
    ], actions: [] },
];

export const scenes3: Record<string, Scene> = Object.fromEntries([
  ...morning12Scenes, ...afternoon12Scenes, ...farm6Scenes, ...morning13Scenes, ...farm7Scenes, ...afternoon13Scenes, ...farm8Scenes,
  ...excursions(6).filter(s => !s.id.endsWith('_neighbor')), ...excursions(8).filter(s => !s.id.endsWith('_neighbor')),
  entry(5), entry(6), entry(7), entry(8), road, arrival, relocate(7), relocate(8), ...checkpointScenes,
].map(s => [s.id, withCentralEchoes(s)]));
export const incidentEvents3 = [...morning12Events, ...afternoon12Events, ...farm6Events, ...morning13Events, ...farm7Events, ...afternoon13Events, ...farm8Events];
