// Браузерные проверки двух «телефонов». Запуск из корня проекта: `npm run e2e` (сборка + все сценарии),
// `npm run e2e:quick` (без долгих случайных нажатий) или `node scripts/e2e/run.cjs codes cloud --seed 3`.
// Нужен Playwright с Chromium (в облачной среде уже установлен: require('playwright')).
const { spawn } = require('node:child_process');
const { join } = require('node:path');
const { URL: APP, launch } = require('./lib.cjs');

const ROOT = join(__dirname, '..', '..');
const SCENARIOS = ['codes', 'cloud', 'files', 'instances', 'plan', 'monkey', 'update'].map((n) => require(`./${n}.cjs`));

const args = process.argv.slice(2);
const quick = args.includes('--quick');
const seedAt = args.indexOf('--seed');
const seed = seedAt >= 0 ? Number(args[seedAt + 1]) : 1;
const names = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--seed');
const chosen = SCENARIOS.filter((s) => (names.length ? names.includes(s.name) : !(quick && s.slow)))
  .sort((a, b) => Number(!!a.last) - Number(!!b.last));

const up = () => fetch(APP).then((r) => r.ok).catch(() => false);

async function startServer() {
  if (await up()) return null;
  const server = spawn('npx', ['vite', 'preview', '--port', '4179', '--strictPort'], { cwd: ROOT, stdio: 'ignore', detached: true });
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 500));
  if (!(await up())) throw new Error('сервер предпросмотра не поднялся (сначала npm run build)');
  return server;
}

(async () => {
  const server = await startServer();
  const browser = await launch();
  const failed = [];
  for (const s of chosen) {
    const t0 = Date.now();
    const log = (...a) => console.log(`  [${s.name}]`, ...a);
    console.log(`▶ ${s.name} — ${s.about}`);
    try {
      const errors = await s.run({ browser, seed, log, distDir: join(ROOT, 'dist') });
      const min = ((Date.now() - t0) / 60000).toFixed(1);
      if (errors.length) { failed.push(s.name); console.log(`✗ ${s.name} (${min} мин):\n    ${errors.slice(0, 10).join('\n    ')}`); }
      else console.log(`✓ ${s.name} (${min} мин)`);
    } catch (e) {
      failed.push(s.name);
      console.log(`✗ ${s.name}: ${String(e.message).split('\n')[0].slice(0, 400)}`);
    }
    for (const ctx of browser.contexts()) await ctx.close();
  }
  await browser.close();
  if (server) process.kill(-server.pid);
  console.log(failed.length ? `НЕ ПРОШЛИ: ${failed.join(', ')}` : 'Все браузерные проверки прошли.');
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
