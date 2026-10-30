import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Сервис-воркер для офлайн-игры: после сборки получает список всех файлов приложения и
 * кэширует их при установке. Новая версия → новый кэш; сохранения (IndexedDB) не трогаются.
 */
function offlineServiceWorker(): Plugin {
  return {
    name: 'kvest-offline-sw',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const files = ['./', ...Object.keys(bundle).map((f) => `./${f}`), './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
      const version = createHash('sha256').update(files.join('|') + Object.values(bundle).map((b) => ('code' in b ? b.code : '')).join('')).digest('hex').slice(0, 12);
      const sw = `const CACHE = 'kvest-${version}';
const FILES = ${JSON.stringify([...new Set(files)])};
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Страница — сначала сеть (чтобы прилетали обновления), без сети — из кэша.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => caches.match('./', { ignoreSearch: true, ignoreVary: true })));
    return;
  }
  // ignoreVary: некоторые серверы отдают Vary, и без него кэш не находит свои же файлы.
  e.respondWith(caches.match(e.request, { ignoreVary: true }).then((hit) => hit || fetch(e.request)));
});
`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: sw });
    },
  };
}

/**
 * Отпечаток кода движка: если у партнёров разные версии движка (одна обновилась, другая нет),
 * контрольная точка сразу скажет «обновитесь оба», а не «воспроизвелось иначе».
 */
const engineDir = new URL('./src/engine/', import.meta.url);
const engineHash = createHash('sha256')
  .update(readdirSync(engineDir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts')).sort().map((f) => readFileSync(new URL(f, engineDir), 'utf8')).join('\n'))
  .digest('hex').slice(0, 12);

// base './' — приложение работает из любой папки (GitHub Pages: /kvest/).
export default defineConfig({
  base: './',
  define: { __ENGINE_HASH__: JSON.stringify(engineHash) },
  plugins: [react(), offlineServiceWorker()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
