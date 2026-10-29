import { createHash } from 'node:crypto';
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
    e.respondWith(fetch(e.request).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: sw });
    },
  };
}

// base './' — приложение работает из любой папки (GitHub Pages: /kvest/).
export default defineConfig({
  base: './',
  plugins: [react(), offlineServiceWorker()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
