// Облако через GitHub: сохранения и коды контрольных точек лежат в ветке `saves` репозитория Kvest.
// Токен вводится на телефоне и хранится только там (в коде сайта его нет — GitHub отзывает
// токены, найденные в публичном коде). Каждый телефон пишет только свои файлы — конфликтов нет.
import { dbGet, dbPut } from './db';

const OWNER = 'Andrii-Nehrii';
const REPO = 'Kvest';
const BRANCH = 'saves';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

export interface CloudConfig {
  token: string;
  lastUpload?: number;
  lastError?: string;
}

export const loadCloud = () => dbGet<CloudConfig>('cloud');
export const storeCloud = (c: CloudConfig | null) => dbPut('cloud', c);

export const cloudPaths = {
  save: (pairId: string, pid: string) => `pairs/${pairId}/save-${pid}.json`,
  segment: (pairId: string, cp: number, pid: string) => `pairs/${pairId}/kt${cp}-hod-${pid}.txt`,
  answers: (pairId: string, cp: number, pid: string) => `pairs/${pairId}/kt${cp}-otvet-${pid}.txt`,
};

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

/** SHA-1 git-блоба — чтобы не делать коммит, если файл не изменился. */
export async function gitBlobSha(text: string): Promise<string> {
  const body = new TextEncoder().encode(text);
  const head = new TextEncoder().encode(`blob ${body.length}\0`);
  const all = new Uint8Array(head.length + body.length);
  all.set(head);
  all.set(body, head.length);
  const d = new Uint8Array(await crypto.subtle.digest('SHA-1', all));
  return [...d].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function gh(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers ?? {}),
    },
  });
}

/** Проверить токен: доступ к репозиторию, ветке и право записи. Возвращает текст ошибки или null. */
export async function checkCloud(token: string): Promise<string | null> {
  try {
    const repo = await gh(token, '');
    if (repo.status === 401) return 'Токен не подходит (GitHub ответил 401). Скопируй его ещё раз целиком.';
    if (repo.status === 404 || repo.status === 403) return 'У токена нет доступа к репозиторию Kvest. При создании выбери «Only select repositories → Kvest».';
    if (!repo.ok) return `GitHub ответил ${repo.status}.`;
    const info = await repo.json();
    if (info.permissions && !info.permissions.push) return 'У токена нет права записи: в Permissions → Contents нужно «Read and write».';
    const br = await gh(token, `/branches/${BRANCH}`);
    if (!br.ok) return `Не найдена ветка ${BRANCH} (${br.status}).`;
    return null;
  } catch {
    return 'Нет связи с GitHub — проверь интернет.';
  }
}

async function existingSha(token: string, path: string): Promise<string | undefined> {
  const r = await gh(token, `/contents/${path}?ref=${BRANCH}`);
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  return (await r.json()).sha;
}

/** Записать файл (создать или заменить). Повтор при гонке за sha. */
export async function putFile(token: string, path: string, text: string, message: string): Promise<'written' | 'same'> {
  const want = await gitBlobSha(text);
  for (let attempt = 0; attempt < 3; attempt++) {
    const sha = await existingSha(token, path);
    if (sha === want) return 'same';
    const r = await gh(token, `/contents/${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content: toBase64(text), branch: BRANCH, ...(sha ? { sha } : {}) }),
    });
    if (r.ok) return 'written';
    if (r.status !== 409 && r.status !== 422) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 160)}`);
  }
  throw new Error('GitHub: не удалось записать файл после нескольких попыток.');
}

/** Прочитать файл; undefined — если его ещё нет. */
export async function getFile(token: string, path: string): Promise<string | undefined> {
  const r = await gh(token, `/contents/${path}?ref=${BRANCH}`, { headers: { Accept: 'application/vnd.github.raw+json' } });
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  return r.text();
}

export interface CloudSaveEntry {
  pairId: string;
  pid: string;
  name: string;
  updatedAt: number;
  text: string;
}

/** Все сохранения в облаке — чтобы вернуть игру, если телефон очистил данные. */
export async function listCloudSaves(token: string): Promise<CloudSaveEntry[]> {
  const r = await gh(token, `/contents/pairs?ref=${BRANCH}`);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const pairs = ((await r.json()) as { name: string; type: string }[]).filter((x) => x.type === 'dir');
  const out: CloudSaveEntry[] = [];
  for (const p of pairs) {
    for (const pid of ['A', 'B']) {
      const text = await getFile(token, cloudPaths.save(p.name, pid));
      if (!text) continue;
      try {
        const save = JSON.parse(text).save;
        out.push({ pairId: p.name, pid, name: save?.state?.chars?.[pid]?.name?.nom ?? pid, updatedAt: save?.updatedAt ?? 0, text });
      } catch { /* битый файл пропускаем */ }
    }
  }
  return out.sort((a, b) => b.updatedAt - a.updatedAt);
}
