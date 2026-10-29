// Контрольная точка: обмен ходами → общий мир → совместные вопросы → итог.
import { useEffect, useState } from 'react';
import type { JointResult } from '../../engine/checkpoint';
import { clock, dateLabel } from '../../engine/time';
import { fmt, type Ctx } from '../../engine/world';
import { shortHash } from '../../engine/rng';
import {
  acceptPartnerAnswers, acceptPartnerSegment, finishCheckpoint, myAnswersCode, myFinish, myQuestions, mySegmentCode,
  needPartnerSegment, optionsForMe, partnerAnswers, readyToFinish, type LocalSave,
} from '../../app/session';
import { content } from '../../content';
import { Card, CodeIn, CodeOut } from '../kit';

const FINISH_TEXT = {
  checkpoint: 'Ты {m:дошёл|дошла} до контрольной точки.',
  dead: 'Твой персонаж погиб. История продолжается — для {partner.gen}.',
  incapacitated: 'Ты без сознания. Пока ты не можешь действовать, время идёт само.',
  absent: 'В этом участке ты не {m:мог|могла} действовать.',
};

export function Checkpoint({ save, onSave }: { save: LocalSave; onSave: (s: LocalSave) => void }) {
  const cp = save.cp!;
  const def = content.checkpoints.find((x) => x.index === cp.index);
  const ctx: Ctx = { s: cp.merged ?? save.state!, c: content, pid: save.me };
  const finish = myFinish(content, save);
  const [segCode, setSegCode] = useState('');
  const [ansCode, setAnsCode] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const iPlayed = finish !== 'absent';
  const needPartner = needPartnerSegment(save);
  const questions = myQuestions(content, save);
  const partnerQ = partnerAnswers(content, save);

  useEffect(() => { if (iPlayed) mySegmentCode(content, save).then(setSegCode); }, [save.segment.length, save.baseHash]);
  useEffect(() => { if (cp.myAnswers && partnerQ) myAnswersCode(save).then(setAnsCode); }, [cp.myAnswers, cp.mergedHash]);

  const fresh = cp.merged ? cp.merged.log.filter((e) => e.pid === save.me && ['message', 'checkpoint', 'system', 'news'].includes(e.kind)
    && e.seq > (save.state!.logSeq[save.me] ?? 0)) : [];

  return (
    <div className="page">
      <div className="scene-title">Контрольная точка №{cp.index}</div>
      <div className="h1">{def?.title ?? 'Синхронизация'}</div>
      <p className="lead">{fmt({ ...ctx, s: save.state! }, FINISH_TEXT[finish])}</p>
      <div className="steps">
        {iPlayed && (
          <section className="card stepcard done">
            <h3>Твой ход — отправь {fmt(ctx, '{partner.dat}')}</h3>
            {segCode ? <CodeOut code={segCode} hint="В коде — только твои решения. Мир у партнёра посчитается заново из них." /> : <div className="muted">Готовлю код…</div>}
          </section>
        )}
        {needPartner && (
          <section className={`card stepcard ${cp.partnerRecords ? 'done' : ''}`}>
            <h3>Ход партнёра</h3>
            {cp.partnerRecords ? <div className="muted">Получен и проверен.</div> : <CodeIn cta="Принять ход" onSubmit={async (t) => onSave(await acceptPartnerSegment(content, save, t))} />}
          </section>
        )}
        {cp.merged && (
          <section className="card stepcard done">
            <h3>Общий мир</h3>
            <div className="world-code">{shortHash(cp.mergedHash!)}</div>
            <div className="small muted" style={{ margin: '6px 0 10px' }}>Сравните с партнёром — коды должны совпасть. {dateLabel(cp.merged.chars[save.me].time)}, {clock(cp.merged.chars[save.me].time)}.</div>
            {fresh.map((e) => <p key={e.seq} className="story" style={{ fontSize: 15 }}>{e.text}</p>)}
          </section>
        )}
        {cp.merged && questions.length > 0 && (
          <section className={`card stepcard ${cp.myAnswers ? 'done' : ''}`}>
            <h3>Решение</h3>
            {questions.map((d) => (
              <div key={d.id} style={{ marginBottom: 12 }}>
                <p className="story">{fmt(ctx, d.prompt[save.me] ?? d.prompt.default)}</p>
                {optionsForMe(content, save, d).map((o) => {
                  const chosen = (cp.myAnswers ?? draft)[d.id] === o.id;
                  return (
                    <button key={o.id} className={`option ${chosen ? 'sel' : ''}`} disabled={!!cp.myAnswers} onClick={() => setDraft({ ...draft, [d.id]: o.id })}>
                      <span>{chosen ? '●' : '○'}</span><span>{fmt(ctx, o.label[save.me] ?? o.label.default)}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            {!cp.myAnswers && (
              <button className="btn primary block" disabled={questions.some((d) => !draft[d.id])}
                onClick={() => { if (confirm('Ответ нельзя будет изменить. Подтвердить?')) onSave({ ...save, cp: { ...cp, myAnswers: draft } }); }}>
                Подтвердить ответ
              </button>
            )}
            {cp.myAnswers && partnerQ && (ansCode ? <CodeOut code={ansCode} hint="Отправь свой ответ партнёру. Кто что выбрал, станет видно только в итоге." /> : null)}
          </section>
        )}
        {cp.merged && partnerQ && (
          <section className={`card stepcard ${cp.partnerAnswers ? 'done' : ''}`}>
            <h3>Ответ партнёра</h3>
            {cp.partnerAnswers ? <div className="muted">Получен.</div> : <CodeIn cta="Принять ответ" onSubmit={async (t) => onSave(await acceptPartnerAnswers(content, save, t))} />}
          </section>
        )}
      </div>
      {readyToFinish(content, save) && (
        <button className="btn primary block" onClick={() => onSave(finishCheckpoint(content, save))}>Завершить контрольную точку</button>
      )}
    </div>
  );
}

const KIND_TEXT: Record<JointResult['kind'], string> = {
  same: 'Вы решили одинаково', compatible: 'Решения совместимы', compromise: 'Компромисс', conflict: 'Решили обстоятельства',
  solo: 'Решение одного', world: 'Решил мир',
};

export function Resolution({ save, onClose }: { save: LocalSave; onClose: () => void }) {
  const r = save.cp?.result;
  const ctx: Ctx = { s: save.base!, c: content, pid: save.me };
  if (!r) return null;
  return (
    <div className="page">
      <div className="scene-title">Контрольная точка №{save.cp!.index} пройдена</div>
      <div className="h1">Что решено</div>
      {r.joint.length === 0 && <p className="muted">Совместных решений на этой точке не было.</p>}
      {r.joint.map((j) => {
        const d = content.joint[j.id];
        return (
          <Card key={j.id} title={KIND_TEXT[j.kind]}>
            {Object.entries(j.answers).map(([p, a]) => (
              <div key={p} className="small muted">{p === save.me ? 'Ты' : fmt(ctx, '{partner}')}: {fmt(ctx, d.options.find((o) => o.id === a)?.label.default ?? a)}</div>
            ))}
            <p className="story" style={{ marginTop: 8 }}>{j.reason}</p>
            {j.applied.map((id) => <p key={id} className="story">{d.options.find((o) => o.id === id)?.text}</p>)}
          </Card>
        );
      })}
      <Card title="Новый код мира"><div className="world-code">{shortHash(r.hash)}</div></Card>
      <Card title="Резервная копия" tone="warn"><div className="small">Сохрани файл игры (Ещё → Сохранение): браузер на телефоне может очистить данные.</div></Card>
      <button className="btn primary block" onClick={onClose}>Дальше</button>
    </div>
  );
}
