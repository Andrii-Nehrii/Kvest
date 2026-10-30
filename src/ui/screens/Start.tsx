// Главное меню, создание персонажа, связывание двух телефонов.
import { useState, type ReactNode } from 'react';
import type { Signed, InvitePacket } from '../../engine/packet';
import type { PlayerSetup } from '../../engine/game';
import type { NameForms, PlayerId, Traits } from '../../engine/types';
import { other } from '../../engine/types';
import { guessForms, FORM_LABELS } from '../../app/names';
import { acceptInvite, acceptJoin, createInvite, importSave, readInvite, worldCode, type LocalSave } from '../../app/session';
import { content, EDITABLE_TRAITS, TRAIT_BUDGET } from '../../content';
import { Card, CodeIn, CodeOut } from '../kit';
import { listCloudSaves, type CloudSaveEntry } from '../../app/cloud';

const TRAIT_NAMES: Record<keyof Traits, string> = {
  strength: 'Сила', endurance: 'Выносливость', agility: 'Ловкость', melee: 'Рукопашная', medicine: 'Медицина',
  driving: 'Вождение', stealth: 'Скрытность', persuasion: 'Убеждение', technical: 'Техника',
};

const ROLE_INFO: Record<PlayerId, { title: string; body: string }> = {
  A: { title: 'Он — Buchholz in der Nordheide', body: '184 см, около 88 кг, хорошая форма: больше трёх лет зала и серьёзный бокс в прошлом. Небольшой город к югу от Гамбурга.' },
  B: { title: 'Она — Гамбург', body: '167 см, около 50 кг, физически не сильная, немного занималась в зале. Квартира в Гамбурге, соседка по квартире.' },
};

/** iPhone: вкладка Safari и значок «на экране Домой» хранят данные раздельно. */
function iosBrowserTab(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = (navigator as { standalone?: boolean }).standalone === true || window.matchMedia?.('(display-mode: standalone)').matches;
  return ios && !standalone;
}

function CloudRestore({ token, onImport }: { token: string; onImport: (s: LocalSave) => void }) {
  const [list, setList] = useState<CloudSaveEntry[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const load = async () => {
    setBusy(true); setErr('');
    try { setList(await listCloudSaves(token)); } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const pick = (e: CloudSaveEntry) => {
    try { onImport(importSave(content, e.text)); } catch (x) { setErr(x instanceof Error ? x.message : String(x)); }
  };
  return (
    <div className="stack">
      {!list && <button className="btn block" disabled={busy} onClick={load}>{busy ? 'Ищу…' : 'Восстановить из облака'}</button>}
      {list && list.length === 0 && <div className="muted small">В облаке сохранений нет.</div>}
      {list?.map((e) => (
        <button key={`${e.pairId}-${e.pid}`} className="btn block" onClick={() => pick(e)}>
          {e.name} · {e.updatedAt ? new Date(e.updatedAt).toLocaleString('ru-RU') : e.pairId}
        </button>
      ))}
      {err && <div className="errors">{err}</div>}
    </div>
  );
}

export function Menu({ onCreate, onJoin, onImport, cloud, cloudToken }: { onCreate: () => void; onJoin: () => void; onImport: (s: LocalSave) => void; cloud?: ReactNode; cloudToken?: string }) {
  const [err, setErr] = useState('');
  const load = async (f: File | undefined) => {
    if (!f) return;
    try { onImport(importSave(content, await f.text())); } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
  };
  return (
    <div className="page">
      <div style={{ height: '14vh' }} />
      <div className="h1" style={{ fontSize: 34 }}>Kvest</div>
      {iosBrowserTab() && (
        <Card title="iPhone" tone="warn">
          <div className="small">Игра, начатая во вкладке Safari, не появится в значке на экране «Домой» — у них разные хранилища, а Safari ещё и стирает данные сайта через неделю без визитов. Сначала «Поделиться → На экран „Домой“», и начинай оттуда. И подключи облако.</div>
        </Card>
      )}
      <div className="stack" style={{ marginTop: 28 }}>
        <button className="btn primary block" onClick={onCreate}>Новая игра — пригласить партнёра</button>
        <button className="btn block" onClick={onJoin}>У меня есть приглашение</button>
        <label className="btn block">Восстановить из файла<input type="file" accept=".json,application/json" hidden onChange={(e) => load(e.target.files?.[0])} /></label>
        {cloudToken && <CloudRestore token={cloudToken} onImport={onImport} />}
        {err && <div className="errors">{err}</div>}
      </div>
      <div style={{ marginTop: 24 }}>{cloud}</div>
    </div>
  );
}

function CharacterForm({ pid, onDone, cta }: { pid: PlayerId; onDone: (s: PlayerSetup) => void; cta: string }) {
  const tpl = content.characters[pid];
  const [name, setName] = useState('');
  const [forms, setForms] = useState<NameForms | null>(null);
  const [showForms, setShowForms] = useState(false);
  const [traits, setTraits] = useState<Partial<Traits>>({});
  const value = (k: keyof Traits) => traits[k] ?? tpl.traits[k];
  const spent = EDITABLE_TRAITS.reduce((n, k) => n + (value(k) - tpl.traits[k]), 0);
  const f = forms ?? (name.trim() ? guessForms(name, tpl.gender) : null);
  const bump = (k: keyof Traits, d: number) => {
    const v = value(k) + d;
    if (v < Math.max(0, tpl.traits[k] - 2) || v > Math.min(5, tpl.traits[k] + 2)) return;
    if (d > 0 && spent >= TRAIT_BUDGET) return;
    setTraits({ ...traits, [k]: v });
  };
  return (
    <div className="stack">
      <Card title="Персонаж"><b>{ROLE_INFO[pid].title}</b><div className="muted small" style={{ marginTop: 4 }}>{ROLE_INFO[pid].body}</div></Card>
      <label className="field">Имя персонажа</label>
      <input type="text" value={name} onChange={(e) => { setName(e.target.value); setForms(null); }} placeholder="Как тебя зовут в игре" autoComplete="off" />
      {f && <button className="group-toggle" onClick={() => setShowForms(!showForms)}>Падежи для текста: {f.dat}, {f.ins}… {showForms ? '▴' : '▾'}</button>}
      {f && showForms && (Object.keys(FORM_LABELS) as (keyof NameForms)[]).map((k) => (
        <div className="row" key={k} style={{ alignItems: 'center' }}>
          <span className="muted small" style={{ flex: '0 0 92px' }}>{FORM_LABELS[k]}</span>
          <input type="text" value={f[k]} onChange={(e) => setForms({ ...f, [k]: e.target.value })} />
        </div>
      ))}
      <Card title={`Навыки (можно сместить до ${TRAIT_BUDGET} очков; тело — как в жизни)`}>
        {(Object.keys(TRAIT_NAMES) as (keyof Traits)[]).map((k) => {
          const editable = (EDITABLE_TRAITS as readonly string[]).includes(k);
          return (
            <div className="li" key={k} style={{ alignItems: 'center' }}>
              <span className="grow">{TRAIT_NAMES[k]}</span>
              {editable && <button className="icon-btn" onClick={() => bump(k, -1)}>−</button>}
              <b style={{ width: 22, textAlign: 'center' }}>{value(k)}</b>
              {editable ? <button className="icon-btn" onClick={() => bump(k, 1)}>+</button> : <span className="faint small" style={{ width: 32 }}>тело</span>}
            </div>
          );
        })}
        <div className="small muted" style={{ marginTop: 6 }}>Осталось очков: {TRAIT_BUDGET - spent}</div>
      </Card>
      <button className="btn primary block" disabled={!f || !name.trim()} onClick={() => onDone({ name: f!, traits })}>{cta}</button>
    </div>
  );
}

/** Создатель: выбрать роль → персонаж → отправить приглашение → принять ответ. */
export function Create({ save, onSave, onBack, cloudToken }: { save?: LocalSave; onSave: (s: LocalSave) => void; onBack: () => void; cloudToken?: string }) {
  const [role, setRole] = useState<PlayerId | null>(save?.me ?? null);
  if (save && save.phase === 'invited') {
    return (
      <div className="page">
        <div className="h1">Приглашение</div>
        <div className="steps">
          <section className="card stepcard"><h3>Отправь партнёру</h3><CodeOut code={save.outgoing ?? ''} hint="Через Telegram, WhatsApp или SMS. Партнёр открывает игру → «У меня есть приглашение»." /></section>
          <section className="card stepcard"><h3>Вставь ответ партнёра</h3><CodeIn cta="Начать игру" onSubmit={async (t) => onSave(await acceptJoin(content, save, t))} /></section>
        </div>
        <button className="btn block" style={{ marginTop: 12 }} onClick={() => { if (confirm('Отменить приглашение? Отправленный код перестанет работать.')) onBack(); }}>Отменить приглашение</button>
      </div>
    );
  }
  if (!role) {
    return (
      <div className="page">
        <div className="h1">За кого играешь?</div>
        <p className="lead">Второй персонаж достанется партнёру.</p>
        {(['A', 'B'] as const).map((p) => (
          <button key={p} className="option" onClick={() => setRole(p)}><div><b>{ROLE_INFO[p].title}</b><div className="small muted">{ROLE_INFO[p].body}</div></div></button>
        ))}
        <button className="btn block" style={{ marginTop: 12 }} onClick={onBack}>Назад</button>
      </div>
    );
  }
  return (
    <div className="page">
      <div className="h1">Твой персонаж</div>
      <CharacterForm pid={role} cta="Создать приглашение" onDone={async (setup) => {
        const r = await createInvite(content, role, setup, cloudToken);
        onSave(r.save);
      }} />
    </div>
  );
}

/** Приглашённый: вставить код → персонаж → отправить ответ → играть. */
export function Join({ onSave, onBack, pending }: { onSave: (s: LocalSave, reply?: string, cloudToken?: string) => void; onBack: () => void; pending?: { save: LocalSave; reply: string } }) {
  const [invite, setInvite] = useState<Signed<InvitePacket> | null>(null);
  if (pending) {
    return (
      <div className="page">
        <div className="h1">Почти готово</div>
        <section className="card"><h3>Отправь ответ партнёру</h3><CodeOut code={pending.reply} hint="Партнёр вставит его у себя — и у вас начнётся один и тот же мир." /></section>
        <Card title="Код мира">
          <div className="world-code">{worldCode(pending.save)}</div>
          <div className="small muted" style={{ marginTop: 6 }}>У партнёра после вставки должен быть такой же.</div>
        </Card>
        <button className="btn primary block" onClick={() => onSave(pending.save)}>Начать играть</button>
      </div>
    );
  }
  if (!invite) {
    return (
      <div className="page">
        <div className="h1">Приглашение</div>
        <p className="lead">Вставь код, который прислал партнёр.</p>
        <CodeIn cta="Дальше" onSubmit={async (t) => setInvite(await readInvite(content, t))} />
        <button className="btn block" style={{ marginTop: 12 }} onClick={onBack}>Назад</button>
      </div>
    );
  }
  const me = other(invite.from);
  const inviter = (invite.setup as PlayerSetup).name.nom;
  return (
    <div className="page">
      <div className="h1">Твой персонаж</div>
      <p className="lead">{inviter} играет за {invite.from === 'A' ? 'него' : 'неё'}. Тебе достаётся второй персонаж.</p>
      <CharacterForm pid={me} cta="Создать ответ" onDone={async (setup) => {
        const r = await acceptInvite(content, invite, setup);
        onSave(r.save, r.code, invite.cloudToken);
      }} />
    </div>
  );
}
