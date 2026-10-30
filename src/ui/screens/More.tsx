// «Ещё»: место и время, бытовые правила, сохранение, код мира, новая игра. Плюс экран финала.
import { availableActions } from '../../engine/actions';
import { daylight, clock, dateLabel, durationLabel } from '../../engine/time';
import { environment, network, phoneUsable, type Ctx } from '../../engine/world';
import type { NpcState, StandingRules } from '../../engine/types';
import { exportSave, worldCode, type LocalSave } from '../../app/session';
import { START_TIME } from '../../app/session';
import { content } from '../../content';
import { knownNpc, RULE_LABELS } from '../format';
import { Card, CodeOut } from '../kit';
import { saveFile } from '../download';
import { useState } from 'react';
import { checkCloud, type CloudConfig } from '../../app/cloud';

export function CloudCard({ cloud, onCloud, onUpload }: { cloud: CloudConfig | null; onCloud: (c: CloudConfig | null) => void; onUpload?: () => void }) {
  const [token, setToken] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (cloud?.token) {
    return (
      <Card title="Облако (GitHub)">
        <div className="small">Подключено. Сохранение уходит само: на контрольных точках и каждые 5 действий. Коды на точках тоже передаются сами.</div>
        <div className="small muted" style={{ marginTop: 6 }}>
          {cloud.lastUpload ? `Последняя отправка: ${new Date(cloud.lastUpload).toLocaleString('ru-RU')}` : 'Ещё ничего не отправлялось.'}
        </div>
        {cloud.lastError && <div className="errors">Ошибка: {cloud.lastError}</div>}
        <div className="row" style={{ marginTop: 10 }}>
          {onUpload && <button className="btn primary" onClick={onUpload}>Отправить сейчас</button>}
          <button className="btn" onClick={() => { if (confirm('Отключить облако на этом телефоне?')) onCloud(null); }}>Отключить</button>
        </div>
      </Card>
    );
  }
  const connect = async () => {
    setBusy(true); setErr('');
    const problem = await checkCloud(token);
    setBusy(false);
    if (problem) setErr(problem); else { onCloud({ token: token.trim() }); setToken(''); }
  };
  return (
    <Card title="Облако (GitHub)">
      <div className="small muted" style={{ marginBottom: 8 }}>Вставь токен GitHub — сохранения и коды контрольных точек будут передаваться сами. Партнёру вводить не нужно: токен уйдёт ему вместе с приглашением.</div>
      <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" autoComplete="off" />
      {err && <div className="errors">{err}</div>}
      <button className="btn primary block" style={{ marginTop: 10 }} disabled={busy || token.trim().length < 20} onClick={connect}>{busy ? 'Проверяю…' : 'Подключить'}</button>
    </Card>
  );
}

function hhmm(h: number) {
  const hh = Math.floor(h);
  return `${String(hh).padStart(2, '0')}:${String(Math.round((h - hh) * 60)).padStart(2, '0')}`;
}

export function More({ save, ctx, onPlan, onReset, cloud, onCloud, onUpload }: {
  save: LocalSave; ctx: Ctx; onPlan: (p: string[]) => void; onReset: () => void;
  cloud: CloudConfig | null; onCloud: (c: CloudConfig | null) => void; onUpload: () => void;
}) {
  const ch = ctx.s.chars[ctx.pid];
  const loc = ctx.c.locations[ch.location];
  const w = ctx.c.weather(loc?.region ?? 'hh', ch.time);
  const env = environment(ctx);
  const day = daylight(ch.time);
  const net = phoneUsable(ctx) ? network(ctx) : null;
  const download = () => saveFile(`kvest-${save.me}-kt${save.base?.checkpoint ?? 0}.json`, exportSave(save));
  const avail = new Set(availableActions(ctx).filter((a) => a.enabled).map((a) => a.def.id));
  return (
    <div className="page">
      <Card title="Где ты">
        <b>{loc?.name ?? ch.location}</b>
        {loc?.description && <div className="muted small" style={{ marginTop: 4 }}>{loc.description}</div>}
        <div className="li kv"><span>Время</span><span>{dateLabel(ch.time)}, <span className="nw">{clock(ch.time)}</span></span></div>
        <div className="li kv"><span>Погода</span><span><span className="nw">{w.tempC.toFixed(0)} °C</span>{w.rain ? ', дождь' : ''}, ветер <span className="nw">{w.wind} км/ч</span></span></div>
        <div className="li kv"><span>Ощущается</span><span><span className="nw">{env.tempC.toFixed(0)} °C</span>{env.wet ? ', сыро' : ''}</span></div>
        <div className="li kv"><span>Светло</span><span>{hhmm(day.sunrise)}–{hhmm(day.sunset)}</span></div>
        <div className="li kv"><span>Связь</span><span>{!net ? 'телефон недоступен' : [net.voice && 'звонки', net.sms && 'SMS', net.data && 'интернет'].filter(Boolean).join(', ') || 'нет сети'}</span></div>
      </Card>
      <Card title="Бытовые правила">
        <div className="small muted" style={{ marginBottom: 6 }}>Рутина без лишних нажатий. Сюжетных решений правила не принимают.</div>
        {(Object.keys(RULE_LABELS) as (keyof StandingRules)[]).map((k) => (
          <label key={k} className="li" style={{ alignItems: 'center' }}>
            <span className="grow">{RULE_LABELS[k]}</span>
            <input type="checkbox" checked={ch.rules[k]} disabled={!avail.has(`u:rule:${k}`)} onChange={() => onPlan([`u:rule:${k}`])} />
          </label>
        ))}
      </Card>
      <Card title="Код мира">
        <div className="world-code">{worldCode(save)}</div>
        <div className="small muted" style={{ marginTop: 6 }}>Состояние на последней контрольной точке. У партнёра должен быть такой же.</div>
      </Card>
      {save.outgoing && save.hashes.length <= 1 && (
        <Card title="Код для партнёра (приглашение/ответ)"><CodeOut code={save.outgoing} /></Card>
      )}
      {save.cp?.result && save.cp.sent && (save.cp.sent.segment || save.cp.sent.answers) && (
        <Card title={`Мои коды точки №${save.cp.index}`}>
          <div className="small muted" style={{ marginBottom: 8 }}>Нужны, только если партнёр ещё стоит на этой точке и не получил их.</div>
          {save.cp.sent.segment && <><div className="small"><b>Мой ход</b></div><CodeOut code={save.cp.sent.segment} /></>}
          {save.cp.sent.answers && <><div className="small" style={{ marginTop: 10 }}><b>Мой ответ</b></div><CodeOut code={save.cp.sent.answers} /></>}
        </Card>
      )}
      <CloudCard cloud={cloud} onCloud={onCloud} onUpload={onUpload} />
      <Card title="Сохранение">
        <div className="small muted" style={{ marginBottom: 8 }}>Игра сохраняется сама после каждого действия. Файл — на случай, если телефон очистит данные браузера. В файле есть секрет вашей пары: не публикуй его.</div>
        <button className="btn block" onClick={download}>Скачать файл сохранения</button>
      </Card>
      <Card title="Опасная зона" tone="bad">
        <button className="btn danger block" onClick={() => { if (confirm('Удалить игру на этом телефоне? Без файла сохранения её не вернуть.')) onReset(); }}>Удалить игру с телефона</button>
      </Card>
      <p className="faint small center">Сюжет {ctx.c.version} · начало {clock(START_TIME)}</p>
    </div>
  );
}

const NPC_STATUS: Record<NpcState['status'], string> = {
  ok: 'в порядке', injured: 'ранение', sick: 'болезнь', infected: 'заражение', turned: 'обращение', dead: 'нет в живых', missing: 'судьба неизвестна',
};

export function Ended({ save, onReset }: { save: LocalSave; onReset: () => void }) {
  const s = save.base!;
  const end = s.ended!;
  const lasted = end.at - START_TIME;
  return (
    <div className="page">
      <div className="big-state">{end.kind === 'defeat' ? 'Конец' : 'Конец первой арки'}</div>
      <p className="lead">{end.reason}</p>
      <Card title="Сколько продержались">{durationLabel(lasted)} — с утра вторника до {dateLabel(end.at)}, {clock(end.at)}.</Card>
      <Card title="Судьбы">
        {(['A', 'B'] as const).map((p) => {
          const ch = s.chars[p];
          const dead = ch.body.consciousness === 'dead';
          return <div className="li" key={p}><b className="grow">{ch.name.nom}</b><span className={`tag wrap ${dead ? 'bad' : 'accent'}`}>{dead ? `погиб${ch.gender === 'f' ? 'ла' : ''} — ${ch.body.causeOfDeath}, ${clock(ch.body.diedAt!)}` : 'жив' + (ch.gender === 'f' ? 'а' : '')}</span></div>;
        })}
      </Card>
      <Card title="Главные решения">
        {s.history.filter((h) => h.kind === 'joint').map((h) => <div className="li" key={h.id}>КТ {h.checkpoint}: {h.summary}</div>)}
        {s.history.every((h) => h.kind !== 'joint') && <div className="muted">Совместных решений не было.</div>}
      </Card>
      <Card title="Люди">
        {Object.values(s.npcs).filter((n) => knownNpc(n, 'A', s.vars) || knownNpc(n, 'B', s.vars)).map((n) => (
          <div className="li" key={n.id}><span className="grow">{content.npcs[n.id]?.name ?? n.id}</span><span className="tag">{n.alive ? NPC_STATUS[n.status] : NPC_STATUS.dead}</span></div>
        ))}
      </Card>
      <button className="btn primary block" onClick={() => { if (confirm('Начать новую игру? Текущая будет удалена с телефона.')) onReset(); }}>Новая игра</button>
    </div>
  );
}
