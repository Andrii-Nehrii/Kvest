// Контрольная точка: обмен ходами → общий мир → совместные вопросы → итог.
import { useEffect, useRef, useState } from 'react';
import { cloudPaths, getFile, putFile, type CloudConfig } from '../../app/cloud';
import type { JointResult } from '../../engine/checkpoint';
import { evalCond } from '../../engine/conditions';
import { clock, dateLabel } from '../../engine/time';
import { fmt, type Ctx } from '../../engine/world';
import { shortHash } from '../../engine/rng';
import {
  acceptPartnerAnswers, acceptPartnerSegment, finishCheckpoint, myAnswersCode, myFinish, myQuestions, mySegmentCode,
  needPartnerSegment, optionsForMe, partnerAnswers, partnerOf, readyToFinish, type LocalSave,
} from '../../app/session';
import { content } from '../../content';
import { Card, CodeIn, CodeOut } from '../kit';

const FINISH_TEXT = {
  checkpoint: 'Ты {m:дошёл|дошла} до контрольной точки.',
  dead: 'Твой персонаж погиб. История продолжается — для {partner.gen}.',
  incapacitated: 'Ты без сознания. Пока ты не можешь действовать, время идёт само.',
  absent: 'В этом участке ты не {m:мог|могла} действовать.',
};

/**
 * Автообмен через облако: свой ход и ответ выкладываются сами, ход и ответ партнёра
 * проверяются каждые 12 секунд, пока экран открыт. Ручной обмен кодами остаётся.
 */
function useCloudExchange(save: LocalSave, cloud: CloudConfig | null | undefined, segCode: string, ansCode: string, onSave: (s: LocalSave) => void) {
  const [note, setNote] = useState('');
  const [sent, setSent] = useState({ seg: false, ans: false });
  const latest = useRef(save);
  latest.current = save;
  const token = cloud?.token;
  const cp = save.cp!;
  const partner = partnerOf(save);
  const say = (e: unknown) => setNote(e instanceof Error ? e.message : String(e));

  useEffect(() => {
    if (!token || !segCode) return;
    putFile(token, cloudPaths.segment(save.pairId, cp.index, save.me), segCode, `${save.me}: ход на КТ${cp.index}`)
      .then(() => setSent((x) => ({ ...x, seg: true }))).catch(say);
  }, [token, segCode]);
  useEffect(() => {
    if (!token || !ansCode) return;
    putFile(token, cloudPaths.answers(save.pairId, cp.index, save.me), ansCode, `${save.me}: ответ на КТ${cp.index}`)
      .then(() => setSent((x) => ({ ...x, ans: true }))).catch(say);
  }, [token, ansCode]);

  const waitingSeg = !!token && needPartnerSegment(save) && !cp.partnerRecords;
  const waitingAns = !!token && !!cp.merged && partnerAnswers(content, save) && !cp.partnerAnswers;
  useEffect(() => {
    if (!waitingSeg && !waitingAns) return;
    let stop = false;
    const tick = async () => {
      const s = latest.current;
      try {
        if (waitingSeg) {
          const t = await getFile(token!, cloudPaths.segment(s.pairId, s.cp!.index, partner));
          if (t && !stop) { onSave(await acceptPartnerSegment(content, s, t)); setNote(''); }
        } else if (waitingAns) {
          const t = await getFile(token!, cloudPaths.answers(s.pairId, s.cp!.index, partner));
          if (t && !stop) { onSave(await acceptPartnerAnswers(content, s, t)); setNote(''); }
        }
      } catch (e) { if (!stop) say(e); }
    };
    tick();
    const id = setInterval(tick, 12000);
    return () => { stop = true; clearInterval(id); };
  }, [waitingSeg, waitingAns, save.baseHash, cp.mergedHash]);

  return { on: !!token, note, sent, waitingSeg, waitingAns };
}

export function Checkpoint({ save, cloud, onSave }: { save: LocalSave; cloud?: CloudConfig | null; onSave: (s: LocalSave) => void }) {
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
  const net = useCloudExchange(save, cloud, segCode, ansCode, onSave);
  const own: Ctx = { s: save.state!, c: content, pid: save.me };
  const sceneDef = content.scenes[save.state!.chars[save.me].scene];
  const sceneText = (sceneDef?.text ?? []).filter((b) => evalCond(own, b.when)).map((b) => fmt(own, b.text));

  const fresh = cp.merged ? cp.merged.log.filter((e) => e.pid === save.me && ['message', 'checkpoint', 'system', 'news'].includes(e.kind)
    && e.seq > (save.state!.logSeq[save.me] ?? 0)) : [];

  return (
    <div className="page">
      <div className="scene-title">Контрольная точка №{cp.index}</div>
      <div className="h1">{def?.title ?? 'Синхронизация'}</div>
      {save.last && save.last.steps.length > 0 && (
        <div className="result">
          {save.last.steps.map((st, i) => <div key={i}>{st.text.map((t, j) => <p key={j}>{t}</p>)}</div>)}
        </div>
      )}
      {finish === 'checkpoint' && sceneText.length > 0 && <div className="story">{sceneText.map((t, i) => <p key={i}>{t}</p>)}</div>}
      <p className="lead">{fmt({ ...ctx, s: save.state! }, FINISH_TEXT[finish])}</p>
      {net.on && (
        <Card title="Облако">
          <div className="small">
            {iPlayed && (net.sent.seg ? 'Твой ход выложен. ' : 'Выкладываю твой ход… ')}
            {net.waitingSeg && 'Жду ход партнёра — проверяю каждые 12 секунд, пока экран открыт. '}
            {cp.myAnswers && partnerQ && (net.sent.ans ? 'Твой ответ выложен. ' : 'Выкладываю ответ… ')}
            {net.waitingAns && 'Жду ответ партнёра… '}
            {!net.waitingSeg && !net.waitingAns && cp.merged && (!partnerQ || cp.partnerAnswers) && 'Обмен завершён.'}
          </div>
          {net.note && <div className="errors">{net.note}</div>}
          <div className="faint small" style={{ marginTop: 6 }}>Коды ниже — запасной способ, если облако не работает.</div>
        </Card>
      )}
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
            <p className="story" style={{ marginTop: 8 }}>{fmt(ctx, j.reason)}</p>
            {j.applied.map((id) => <p key={id} className="story">{fmt(ctx, d.options.find((o) => o.id === id)?.text ?? '')}</p>)}
          </Card>
        );
      })}
      <Card title="Новый код мира"><div className="world-code">{shortHash(r.hash)}</div></Card>
      <Card title="Резервная копия" tone="warn"><div className="small">Сохрани файл игры (Ещё → Сохранение): браузер на телефоне может очистить данные.</div></Card>
      <button className="btn primary block" onClick={onClose}>Дальше</button>
    </div>
  );
}
