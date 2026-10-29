import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' — приложение работает из любой папки (GitHub Pages: /kvest/).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
