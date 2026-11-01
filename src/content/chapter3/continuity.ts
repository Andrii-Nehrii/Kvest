// Отклики центральных сцен: видимы после слияния и в следующем участке.
import type { MergeNote, Scene, TextBlock } from '../../engine/content-types';

export const central5Notes: MergeNote[] = [
  { id: 'b5_lift_note', when: { v: 'w.c3_b5', op: '==', value: 'lift' }, text: 'Вы повторяете друг другу, как держали носилки. Медбрат уехал с машиной. Соседская дверь осталась без ключа изнутри.' },
  { id: 'b5_pull_note', when: { v: 'w.c3_b5', op: '==', value: 'pull' }, text: 'Медбрат остался в вашей квартире, зато общий спуск завален. Вы показываете друг другу, где теперь нельзя пройти с канистрой.' },
  { id: 'b5_leave_note', when: { any: [{ v: 'w.c3_b5', op: '==', value: 'leave' }, { v: 'w.c3_b5', op: '==', value: 'missed' }] }, text: 'Машина увезла медбрата с повреждённой рукой. {partner} спрашивает, успел{m:|а} ли ты что-нибудь сказать ему. Ты вспоминаешь только скрип ремня.' },
];
const b5After: TextBlock[] = [
  { when: { v: 'w.c3_b5', op: '==', value: 'lift' }, text: 'Медбрат не возвращается к обеду. Ты замечаешь его ключ в наружной стороне замка. {partner} просит пока его не трогать.' },
  { when: { v: 'w.c3_b5', op: '==', value: 'pull' }, text: 'Обломки на пролёте никто не убрал. Медбрат сидит у вашей двери, завернув руку в полотенце. Он спрашивает, сколько воды осталось дома.' },
  { when: { any: [{ v: 'w.c3_b5', op: '==', value: 'leave' }, { v: 'w.c3_b5', op: '==', value: 'missed' }] }, text: 'Уехавшая машина не возвращается. Ты подходишь к перилам и останавливаешься за шаг до ремня. На мокром металле виден отпечаток ладони.' },
];
export function withCentralEchoes(scene: Scene): Scene {
  if (scene.id === 'c6_bflat') return { ...scene, text: [...b5After, ...scene.text] };
  return scene;
}
