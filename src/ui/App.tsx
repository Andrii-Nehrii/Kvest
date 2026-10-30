import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { clock, shortDateLabel } from '../engine/time';
import { phone, type Ctx } from '../engine/world';
import { dbDelete, dbGet, dbPut, requestPersistence } from '../app/db';
import { act, exportSave, normalizePhase, refreshSave, type LocalSave } from '../app/session';
import { cloudPaths, loadCloud, putFile, storeCloud, type CloudConfig } from '../app/cloud';
import { content } from '../content';
import { healthDot } from './format';
import { Icon } from './kit';
import { saveFile } from './download';
import { Checkpoint, Resolution } from './screens/Checkpoint';
import { CloudCard, Ended, More } from './screens/More';
import { Create, Join, Menu } from './screens/Start';
import { BodyScreen, Items, Journal, People } from './screens/Status';
import { Story } from './screens/Story';

type Tab = 'story' | 'items' | 'body' | 'journal' | 'people' | 'more';
const TABS: { id: Tab; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { id: 'story', label: 'История', icon: 'story' },
  { id: 'items', label: 'Вещи', icon: 'items' },
  { id: 'body', label: 'Тело', icon: 'body' },
  { id: 'journal', label: 'Журнал', icon: 'journal' },
  { id: 'people', label: 'Люди', icon: 'people' },
  { id: 'more', label: 'Ещё', icon: 'more' },
];

export function App() {
  const [save, setSave] = useState<LocalSave | null | undefined>(undefined);
  const [view, setView] = useState<'menu' | 'create' | 'join'>('menu');
  const [tab, setTab] = useState<Tab>('story');
  const [pendingJoin, setPendingJoin] = useState<{ save: LocalSave; reply: string } | undefined>();
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<{ text: string; bad?: boolean } | null>(null);
  const [updated, setUpdated] = useState(false);

  const [cloud, setCloud] = useState<CloudConfig | null>(null);
  const cloudRef = useRef<CloudConfig | null>(null);
  cloudRef.current = cloud;
  const prevSave = useRef<LocalSave | null | undefined>(undefined);
  const uploadChain = useRef<Promise<unknown>>(Promise.resolve());
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    dbGet<LocalSave>('current').then((s) => {
      if (!s) { setSave(null); return; }
      // После обновления игры сохранение пересчитывается новой версией (см. refreshSave).
      const fresh = normalizePhase(content, refreshSave(content, s));
      if (fresh.notice) { setToast({ text: fresh.notice }); fresh.notice = undefined; }
      setSave(fresh);
      dbPut('current', fresh).catch(() => {});
    }).catch(() => setSave(null));
    loadCloud().then((c) => setCloud(c ?? null)).catch(() => {});
    requestPersistence();
    const onUpdate = () => setUpdated(true);
    window.addEventListener('kvest-update', onUpdate);
    // Игра может быть открыта дважды (значок на экране и вкладка браузера) — хранилище у них общее.
    // Чтобы старая копия не затёрла новые действия, каждая подхватывает то, что сохранила другая.
    const reload = () => dbGet<LocalSave>('current').then((s) => {
      setSave((cur) => {
        if (!s) return null;
        if (cur && cur.pairId === s.pairId && cur.updatedAt >= s.updatedAt) return cur;
        return normalizePhase(content, s);
      });
    }).catch(() => {});
    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('kvest') : null;
    if (bc) { bc.onmessage = reload; channel.current = bc; }
    const onVisible = () => { if (document.visibilityState === 'visible') reload(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.removeEventListener('kvest-update', onUpdate); document.removeEventListener('visibilitychange', onVisible); bc?.close(); };
  }, []);

  const updateCloud = (c: CloudConfig | null) => { setCloud(c); storeCloud(c).catch(() => {}); };

  /** Отправить сохранение в облако (по очереди, чтобы записи одного файла не толкались). */
  const uploadSave = (s: LocalSave, why: string, manual = false) => {
    const cfg = cloudRef.current;
    if (!cfg?.token || s.phase === 'invited' || !s.state) return;
    uploadChain.current = uploadChain.current.then(async () => {
      try {
        const name = s.state!.chars[s.me].name.nom;
        await putFile(cfg.token, cloudPaths.save(s.pairId, s.me), exportSave(s), `${s.me} ${name}: ${why}`);
        updateCloud({ ...cfg, lastUpload: Date.now(), lastError: undefined });
        if (manual) setToast({ text: 'Сохранение отправлено.' });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        updateCloud({ ...cfg, lastError: msg });
        if (manual) setToast({ text: `Не отправилось: ${msg}`, bad: true });
      }
    });
  };

  // Автоотправка: смена фазы, каждая контрольная точка и каждые 5 действий.
  useEffect(() => {
    const prev = prevSave.current;
    prevSave.current = save;
    if (!save || !prev || prev.pairId !== save.pairId) return;
    if (prev.phase !== save.phase) uploadSave(save, `фаза ${save.phase}`);
    else if (prev.hashes.length !== save.hashes.length) uploadSave(save, `КТ ${save.base?.checkpoint}`);
    else if (save.segment.length !== prev.segment.length && save.segment.length % 5 === 0) uploadSave(save, `${save.segment.length} действий`);
    else if (!!prev.cp?.myAnswers !== !!save.cp?.myAnswers) uploadSave(save, 'ответ на КТ');
  }, [save]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); } }, [toast]);

  const persist = (next: LocalSave | null) => {
    // Метка времени — чтобы другая открытая копия игры поняла, что её версия устарела.
    const s = next && { ...next, updatedAt: Math.max(Date.now(), (save?.updatedAt ?? 0) + 1) };
    setSave(s);
    (s ? dbPut('current', s) : dbDelete('current'))
      .then(() => channel.current?.postMessage('saved'))
      .catch(() => setToast({ text: 'Не удалось сохранить на телефоне — скачай файл сохранения.', bad: true }));
  };
  const reset = () => { persist(null); setView('menu'); setTab('story'); setPendingJoin(undefined); };

  const updateBar = updated && (
    <div className="update-bar"><span>Вышло обновление игры.</span><button className="btn primary" onClick={() => location.reload()}>Обновить</button></div>
  );

  if (save === undefined) return <div className="app"><div className="page muted">Загрузка…</div></div>;

  if (!save || save.phase === 'invited' || pendingJoin) {
    return (
      <div className="app">
        {updateBar}
        {pendingJoin ? <Join pending={pendingJoin} onBack={() => setPendingJoin(undefined)} onSave={() => setPendingJoin(undefined)} />
          : save?.phase === 'invited' ? <Create save={save} onSave={persist} onBack={reset} cloudToken={cloud?.token} />
          : view === 'create' ? <Create onSave={persist} onBack={() => setView('menu')} cloudToken={cloud?.token} />
          : view === 'join' ? <Join onBack={() => setView('menu')} onSave={(s, reply, token) => { persist(s); if (token && !cloud?.token) updateCloud({ token }); if (reply) setPendingJoin({ save: s, reply }); }} />
          : <Menu onCreate={() => setView('create')} onJoin={() => setView('join')} onImport={(s) => persist(normalizePhase(content, refreshSave(content, s)))} cloudToken={cloud?.token}
              cloud={<CloudCard cloud={cloud} onCloud={updateCloud} />} />}
      </div>
    );
  }

  const onPlan = (plan: string[]) => {
    try {
      const next = act(content, save, plan);
      persist(next);
      if (next.phase === 'checkpoint') setTab('story');
    } catch (e) { setToast({ text: e instanceof Error ? e.message : String(e), bad: true }); }
  };

  const ctx: Ctx = { s: save.state!, c: content, pid: save.me };
  const ch = save.state!.chars[save.me];
  const ph = phone(ctx);

  let body: ReactNode;
  if (showResult && save.cp?.result) body = <Resolution save={save} onClose={() => setShowResult(false)} />;
  else if (save.phase === 'ended') body = <Ended save={save} onReset={reset} />;
  else if (save.phase === 'checkpoint' && tab === 'story') body = <Checkpoint save={save} cloud={cloud} onSave={(s) => { persist(s); if (s.phase !== 'checkpoint') { setShowResult(true); window.scrollTo(0, 0); } }} />;
  else if (tab === 'story') body = <Story key={save.segment.length} save={save} ctx={ctx} onPlan={onPlan} />;
  else if (tab === 'items') body = <Items ctx={ctx} onPlan={onPlan} />;
  else if (tab === 'body') body = <BodyScreen ctx={ctx} />;
  else if (tab === 'journal') body = <Journal ctx={ctx} />;
  else if (tab === 'people') body = <People ctx={ctx} />;
  else body = <More save={save} ctx={ctx} onPlan={onPlan} onReset={reset} cloud={cloud} onCloud={updateCloud} onUpload={() => uploadSave(save, 'вручную', true)} />;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="time">{clock(ch.time)}</div>
          <div className="sub">{shortDateLabel(ch.time)}</div>
        </div>
        <div className="sub place">{content.locations[ch.location]?.name ?? ''}</div>
        <div className="right">
          {ph && <span title="Заряд телефона">📱 {Math.round(ph.charge ?? 0)}%</span>}
          <span className={`dot ${healthDot(ch.body)}`} title="Самочувствие" />
        </div>
      </header>
      {updateBar}
      <Boundary save={save}>{body}</Boundary>
      {save.phase !== 'ended' && (
        <nav className="nav"><div className="nav-inner">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => { setTab(t.id); setShowResult(false); window.scrollTo(0, 0); }}>
              <Icon name={t.icon} />{t.id === 'story' && save.phase === 'checkpoint' ? 'Точка' : t.label}
            </button>
          ))}
        </div></nav>
      )}
      {toast && <div className={`toast ${toast.bad ? 'bad' : ''}`}>{toast.text}</div>}
    </div>
  );
}

/** Если в сюжете ошибка — не терять игру: показать причину и дать скачать сохранение. */
class Boundary extends Component<{ save: LocalSave; children: ReactNode }, { err?: Error }> {
  state: { err?: Error } = {};
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    const download = () => saveFile('kvest-save.json', exportSave(this.props.save));
    return (
      <div className="page">
        <div className="card bad"><h3>Ошибка</h3><div className="small">{this.state.err.message}</div></div>
        <button className="btn block" onClick={download}>Скачать сохранение</button>
        <button className="btn block" style={{ marginTop: 8 }} onClick={() => this.setState({ err: undefined })}>Попробовать снова</button>
      </div>
    );
  }
}
