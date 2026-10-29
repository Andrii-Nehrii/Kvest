import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkCloud, getFile, gitBlobSha, putFile } from './cloud';

afterEach(() => vi.unstubAllGlobals());

describe('облако GitHub', () => {
  it('sha файла совпадает с git hash-object', async () => {
    expect(await gitBlobSha('hello\n')).toBe('ce013625030ba8dba906f756967f9e9ca394464a');
  });

  it('создаёт файл, не коммитит одинаковое повторно, читает', async () => {
    const files = new Map<string, { text: string; sha: string }>();
    const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
      const path = decodeURIComponent(new URL(url).pathname.split('/contents/')[1] ?? '');
      if (init.method === 'PUT') {
        const body = JSON.parse(String(init.body));
        const text = new TextDecoder().decode(Uint8Array.from(atob(body.content), (c) => c.charCodeAt(0)));
        files.set(path, { text, sha: await gitBlobSha(text) });
        return new Response('{}', { status: 201 });
      }
      const f = files.get(path);
      if (!f) return new Response('{}', { status: 404 });
      const raw = (init.headers as Record<string, string>).Accept?.includes('raw');
      return new Response(raw ? f.text : JSON.stringify({ sha: f.sha }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(await getFile('t', 'pairs/x/a.txt')).toBeUndefined();
    expect(await putFile('t', 'pairs/x/a.txt', 'Привет, KVEST1.abc', 'm')).toBe('written');
    expect(await putFile('t', 'pairs/x/a.txt', 'Привет, KVEST1.abc', 'm')).toBe('same');
    expect(await getFile('t', 'pairs/x/a.txt')).toBe('Привет, KVEST1.abc');
  });

  it('понятные ошибки токена', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })));
    expect(await checkCloud('bad')).toMatch(/Токен не подходит/);
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify({ permissions: { push: false } }), { status: url.endsWith('Kvest') ? 200 : 200 })));
    expect(await checkCloud('ro')).toMatch(/нет права записи/);
  });
});
