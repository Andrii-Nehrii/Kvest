import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { content } from '../content';
import { upgradeState } from '../engine/game';
import { stateHash } from '../engine/rng';
import type { GameState, PlayerId } from '../engine/types';
import { knownContacts } from './people';

const fixture = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const start = () => structuredClone(fixture.legs.find(l => l.base.checkpoint === 5)!.base);
const listed = (s: GameState, pid: PlayerId) => knownContacts({ s, c: content, pid }).map(p => p.id);

describe('знакомые люди из новых сцен', () => {
  it('карточка появляется на своей линии после знакомства, а не от присутствия партнёра', () => {
    const s = start();
    s.vars['w.together'] = true;
    expect(listed(s, 'A')).not.toContain('c3_jens');
    expect(listed(s, 'B')).not.toContain('c3_jens');
    s.chars.A.visited.c6_l_arrival = 1;
    expect(listed(s, 'A')).toContain('c3_jens');
    expect(listed(s, 'B')).not.toContain('c3_jens');
    s.chars.B.visited.c6_l_arrival = 1;
    expect(listed(s, 'B')).toContain('c3_jens');
    s.checkpoint = 6;
    expect(listed(s, 'A')).toContain('c3_jens');
  });

  it('карточка не раскрывается в ранней главе и не дублирует знакомого моделируемого NPC', () => {
    const s = start();
    s.chars.A.visited.c6_l_arrival = 1;
    s.checkpoint = 4;
    expect(listed(s, 'A')).not.toContain('c3_jens');
    s.checkpoint = 5;
    const person = structuredClone(Object.values(s.npcs)[0]);
    person.id = 'c3_jens'; person.trust.A = 1;
    s.npcs.c3_jens = person;
    expect(listed(s, 'A')).not.toContain('c3_jens');
  });

  it('довоз карточек не добавляет NPC в подписанный мир и не меняет его хэш', () => {
    const withCards = start(), withoutCards = start();
    upgradeState(content, withCards);
    upgradeState({ ...content, contacts: undefined }, withoutCards);
    expect(withCards.npcs.c3_jens).toBeUndefined();
    expect(stateHash(withCards)).toBe(stateHash(withoutCards));
  });
});
