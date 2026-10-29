// Человеческие подписи для состояния. Только наблюдаемое — никаких скрытых названий болезней.
import type { Body, Injury, NpcState, PlayerId, StandingRules } from '../engine/types';

export function trustWord(t: number): { text: string; tone: '' | 'accent' | 'bad' } {
  if (t <= -40) return { text: 'враждебно', tone: 'bad' };
  if (t <= -15) return { text: 'настороженно', tone: 'bad' };
  if (t < 15) return { text: 'нейтрально', tone: '' };
  if (t < 40) return { text: 'доброжелательно', tone: 'accent' };
  return { text: 'доверяет', tone: 'accent' };
}

export function consciousnessWord(b: Body, female: boolean): string {
  switch (b.consciousness) {
    case 'awake': return 'в сознании';
    case 'asleep': return female ? 'спит' : 'спит';
    case 'unconscious': return 'без сознания';
    case 'coma': return 'кома';
    case 'dead': return female ? 'погибла' : 'погиб';
  }
}

const KIND: Record<Injury['kind'], string> = {
  bruise: 'ушиб', cut: 'порез', laceration: 'рваная рана', scratch: 'царапина', bite: 'укус',
  sprain: 'растяжение', fracture: 'перелом', burn: 'ожог', concussion: 'сотрясение',
};
const SITE: Record<Injury['site'], string> = {
  head: 'голова', torso: 'туловище', leftArm: 'левая рука', rightArm: 'правая рука', hands: 'кисти',
  leftLeg: 'левая нога', rightLeg: 'правая нога', feet: 'ступни',
};
const SEV = ['', 'лёгкий', 'средний', 'серьёзный', 'тяжёлый', 'критический'];

export function injuryText(i: Injury): string {
  const treated = i.treated === 'proper' ? 'обработано' : i.treated === 'basic' ? 'перевязано кое-как' : 'не обработано';
  const bleed = i.bleeding > 0 && i.healed < 1 && i.treated === 'none' ? ', кровоточит' : '';
  return `${KIND[i.kind]} — ${SITE[i.site]} (${SEV[i.severity]}), ${treated}${bleed}${i.woundInfected ? ', воспалено' : ''}`;
}

export function healthDot(b: Body): '' | 'warn' | 'bad' {
  if (b.consciousness === 'dead' || b.bloodLoss >= 40 || b.coreTemp < 34 || b.coreTemp >= 39.5) return 'bad';
  if (b.bloodLoss >= 15 || b.thirst >= 70 || b.hunger >= 75 || b.fatigue >= 75 || b.sleepDebt >= 10 || b.coreTemp >= 38 || b.coreTemp < 35.5) return 'warn';
  return '';
}

export const RULE_LABELS: Record<keyof StandingRules, string> = {
  chargePhoneWhenFreePower: 'Заряжать телефон, когда есть бесплатная розетка и зарядка',
  drinkWhenThirsty: 'Пить, когда хочется, если обстановка спокойная',
  eatWhenHungry: 'Есть, когда голоден, если обстановка спокойная',
  keepReserve: 'Не трогать «резерв» (консервы, шоколад) для рутины',
};

export const roleLabel = (p: PlayerId) => (p === 'A' ? 'A — он, Buchholz' : 'B — она, Гамбург');

export function weightText(g: number): string {
  return g >= 1000 ? `${(g / 1000).toFixed(1).replace('.', ',')} кг` : `${g} г`;
}

export function knownNpc(n: NpcState, pid: PlayerId, vars: Record<string, unknown>): boolean {
  return !!vars[`${pid}.met.${n.id}`] || n.trust[pid] !== 0 || n.memory.some((m) => m.startsWith(`${pid}:`));
}
