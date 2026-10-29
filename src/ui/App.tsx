// Временная заглушка: интерфейс — этап 9 (см. docs/ARCHITECTURE.md).
import { ENGINE_VERSION } from '../engine/game';

export function App() {
  return (
    <main style={{ minHeight: '100dvh', background: '#0e1013', color: '#d9dde3', fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      <h1 style={{ fontWeight: 600, letterSpacing: '0.02em' }}>Kvest</h1>
      <p style={{ opacity: 0.7 }}>Движок {ENGINE_VERSION} собран. Интерфейс и сюжет — следующие этапы.</p>
    </main>
  );
}
