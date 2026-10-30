import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import './ui/styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

// Офлайн-режим: сервис-воркер кэширует приложение после первого открытия.
// Приложение с экрана «Домой» часто не перезапускается, а просыпается — поэтому новую версию
// ищем при каждом возвращении в игру и предлагаем обновиться (App слушает «kvest-update»).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) window.dispatchEvent(new Event('kvest-update')); });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      const check = () => { if (navigator.onLine) reg.update().catch(() => {}); };
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
      setInterval(check, 30 * 60 * 1000);
    }).catch(() => {});
  });
}
