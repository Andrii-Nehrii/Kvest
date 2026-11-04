import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { content } from '../content';
import type { Content, NpcDef } from './content-types';
import { applyEffects } from './effects';
import { newGame, upgradeState } from './game';
import { mergeSegments } from './checkpoint';
import { evalCond } from './conditions';
import { stateHash } from './rng';
import type { GameState, PlayerId } from './types';
import { at } from './time';

const fixture = JSON.parse(readFileSync(new URL('../content/fixtures/release-3.json', import.meta.url), 'utf8')) as { legs: { base: GameState }[] };
const person: NpcDef = { id: 'test_late_person', name: 'Тест', intro: '', introducedByStory: true,
  initial: { alive: true, location: 'c7_farm_lane', status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: {} },
  initialItems: [{ type: 'bread', qty: 6 }, { type: 'water_05', qty: 4 }], agenda: [] };
const c: Content = { ...content, npcs: { ...content.npcs, [person.id]: person,
  test_late_receiver: { ...person, id: 'test_late_receiver', initialItems: [] } } };
const ctx = (s: GameState, pid: PlayerId = 'A') => ({ s, c, pid });
const start = () => {
  const s = structuredClone(fixture.legs.find(x => x.base.checkpoint === 5)!.base);
  s.checkpoint = 7;
  for (const p of ['A','B'] as const) { s.chars[p].location = 'c7_farm_lane'; s.chars[p].time = at(13,8,17); }
  return s;
};
const sum = (s: GameState, type: string) => Object.values(s.items).filter(i => i.type === type).reduce((n,i) => n+i.qty,0);

describe('новые актёры после подписанной точки', () => {
  it('новые NPC и их запасы не довозятся в старую базу и новую игру', () => {
    const s = start(), hash = stateHash(s); upgradeState(c,s);
    expect(stateHash(s)).toBe(hash); expect(s.npcs[person.id]).toBeUndefined();
    const names = { nom:'Т', gen:'Т', dat:'Т', acc:'Т', ins:'Т', pre:'Т' };
    const setup = { pairId:'intro-test', seed:'same', startTime:390, players:{ A:{name:names}, B:{name:names} } };
    expect(stateHash(newGame(c,setup))).toBe(stateHash(newGame(content,setup)));
  });

  it('появление повторяется точно и один раз, потраченные вещи не восстанавливаются', () => {
    const s=start(), before=sum(s,'bread');
    applyEffects(ctx(s),[{introduceNpc:person.id},{takeFromNpc:person.id,type:'bread'}]);
    expect(sum(s,'bread')).toBe(before+6);
    expect(evalCond(ctx(s),{npcHas:person.id,type:'bread',qty:5})).toBe(true);
    expect(evalCond(ctx(s),{npcHas:person.id,type:'bread',qty:6})).toBe(false);
    const hash=stateHash(s); applyEffects(ctx(s),[{introduceNpc:person.id}]); expect(stateHash(s)).toBe(hash);
  });

  it('два телефона расходуют один исходный запас; перенос NPC на одной линии сохраняется после позднего разговора на другой', () => {
    const base=start(), a=structuredClone(base), b=structuredClone(base), before=sum(base,'bread');
    for(const [s,pid] of [[a,'A'],[b,'B']] as const) applyEffects(ctx(s,pid),[{introduceNpc:person.id},{takeFromNpc:person.id,type:'bread'}]);
    applyEffects(ctx(a),[{npc:person.id,moveTo:'hof_luedemann'}]);
    b.chars.B.time+=10; applyEffects(ctx(b,'B'),[{npc:person.id,trust:3}]);
    const merged=mergeSegments(c,base,{A:a,B:b});
    expect(sum(merged,'bread')).toBe(before+6);
    const stock=Object.values(merged.items).find(i=>i.type==='bread'&&i.at.kind==='npc'&&i.at.id===person.id)!;
    expect(stock.qty).toBe(4); expect(merged.npcs[person.id].location).toBe('hof_luedemann');
    expect(merged.npcs[person.id].trust.B).toBe(3);
    expect(stateHash(mergeSegments(c,base,{B:b,A:a}))).toBe(stateHash(merged));
  });

  it('нельзя получить отсутствующее, удалённое или нулевое количество', () => {
    const s=start(); applyEffects(ctx(s),[{introduceNpc:person.id}]);
    for(const effects of [[{takeFromNpc:person.id,type:'bread',qty:7}], [{takeFromNpc:person.id,type:'bread',qty:0}]] as const){
      const hash=stateHash(s); expect(applyEffects(ctx(s),[...effects]).interrupted).toBe(true); expect(stateHash(s)).toBe(hash);
    }
    s.npcs[person.id].location='hof_luedemann'; const hash=stateHash(s);
    expect(applyEffects(ctx(s),[{takeFromNpc:person.id,type:'bread'}]).interrupted).toBe(true); expect(stateHash(s)).toBe(hash);
  });

  it('вещь переносится между NPC рядом; передача погибшему требует явного разрешения', () => {
    const s=start(); applyEffects(ctx(s),[{introduceNpc:person.id},{introduceNpc:'test_late_receiver'}]);
    s.npcs[person.id].alive=false;
    applyEffects(ctx(s),[{npcTransfer:{from:person.id,to:'test_late_receiver',type:'bread',qty:2}}]);
    expect(evalCond(ctx(s),{npcHas:'test_late_receiver',type:'bread',qty:2})).toBe(true);
    const hash=stateHash(s); s.npcs.test_late_receiver.alive=false;
    const dead=stateHash(s);
    expect(applyEffects(ctx(s),[{npcTransfer:{from:person.id,to:'test_late_receiver',type:'bread'}}]).interrupted).toBe(true);
    expect(stateHash(s)).toBe(dead); expect(dead).not.toBe(hash);
    expect(applyEffects(ctx(s),[{npcTransfer:{from:person.id,to:'test_late_receiver',type:'bread',allowDeadRecipient:true}}]).interrupted).toBe(false);
    expect(evalCond(ctx(s),{npcHas:'test_late_receiver',type:'bread',qty:3})).toBe(true);
  });

  it('до КТ7 новые операции не меняют старый ход', () => {
    const s=start(); s.checkpoint=6; const hash=stateHash(s);
    applyEffects(ctx(s),[{introduceNpc:person.id},{takeFromNpc:person.id,type:'bread'}]);
    expect(stateHash(s)).toBe(hash);
    expect(evalCond(ctx(s),{npcHas:person.id,type:'bread'})).toBe(false);
  });
});
