// Облако на поддельном GitHub (в памяти, с нарочными сбоями 502 и 409): ходы и ответы на точках
// передаются сами, сохранения уходят в облако, третий телефон восстанавливает игру.
const { createHash } = require('node:crypto');
const { makeRng, phone, pair, playSegment, inSection, afterCheckpoint } = require('./lib.cjs');

const TOKEN = 'ghp_' + 'f'.repeat(36);
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,PUT,DELETE,OPTIONS', 'access-control-expose-headers': '*' };
const blobSha = (t) => { const b = Buffer.from(t, 'utf8'); return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`), b])).digest('hex'); };

function fakeGitHub(rnd) {
  const store = new Map();
  const failedOnce = new Set();
  const stats = { puts: 0, fails: 0, conflicts: 0 };
  const route = async (r) => {
    const req = r.request();
    const u = new URL(req.url());
    const json = (status, body) => r.fulfill({ status, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (req.method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS });
    if (req.headers()['authorization'] !== `Bearer ${TOKEN}`) return json(401, { message: 'Bad credentials' });
    const p = u.pathname.replace('/repos/Andrii-Nehrii/Kvest', '');
    if (p === '') return json(200, { permissions: { push: true } });
    if (p === '/branches/saves') return json(200, { name: 'saves' });
    if (!p.startsWith('/contents/')) return json(404, { message: 'Not Found' });
    const path = decodeURIComponent(p.slice('/contents/'.length));
    if (req.method() === 'GET') {
      if (store.has(path)) {
        if ((req.headers()['accept'] || '').includes('raw')) return r.fulfill({ status: 200, headers: CORS, body: store.get(path) });
        return json(200, { path, sha: blobSha(store.get(path)) });
      }
      const dir = [...new Set([...store.keys()].filter((k) => k.startsWith(path + '/')).map((k) => k.slice(path.length + 1).split('/')[0]))];
      if (dir.length) return json(200, dir.map((name) => ({ name, path: `${path}/${name}`, type: store.has(`${path}/${name}`) ? 'file' : 'dir' })));
      return json(404, { message: 'Not Found' });
    }
    if (req.method() === 'PUT') {
      stats.puts++;
      const body = JSON.parse(req.postData());
      if (!failedOnce.has(path)) { failedOnce.add(path); stats.fails++; return json(502, { message: 'Server Error' }); }
      if (rnd() < 0.3) { stats.conflicts++; return json(409, { message: 'reference update failed' }); }
      if ((store.has(path) ? blobSha(store.get(path)) : undefined) !== body.sha) { stats.conflicts++; return json(409, { message: 'sha mismatch' }); }
      store.set(path, Buffer.from(body.content, 'base64').toString('utf8'));
      return json(201, { content: { path } });
    }
    return json(405, { message: 'no' });
  };
  return { route, store, stats };
}

async function connect(p) {
  await p.locator('input[type=password]').fill(TOKEN);
  await p.getByRole('button', { name: 'Подключить' }).click();
  await p.getByText('Подключено.', { exact: false }).waitFor({ timeout: 30000 });
}

module.exports = {
  name: 'cloud',
  about: 'облако на поддельном GitHub со сбоями: автообмен на точках, восстановление',
  async run({ browser, seed, log }) {
    const errors = [];
    const rnd = makeRng(seed);
    const gh = fakeGitHub(makeRng(seed + 1000));
    const A = await phone(browser, 'A', errors, { route: gh.route });
    const B = await phone(browser, 'B', errors, { route: gh.route });
    await pair(A, B, { beforeCreate: connect });
    let world;
    for (const n of [1, 2]) {
      await playSegment(A, `A${n}`, rnd);
      await playSegment(B, `B${n}`, rnd);
      const t0 = Date.now();
      for (const p of [A, B]) await inSection(p, 'Общий мир').waitFor({ timeout: 120000 });
      log(`КТ${n}: ходы пришли через облако за ${Math.round((Date.now() - t0) / 1000)} с`);
      for (const p of [A, B]) {
        const sec = inSection(p, 'Решение');
        if (!(await sec.count())) continue;
        const opts = sec.locator('button.option');
        await opts.nth(Math.floor(rnd() * (await opts.count()))).click();
        await sec.getByRole('button', { name: 'Подтвердить ответ' }).click();
      }
      for (const p of [A, B]) await p.getByRole('button', { name: 'Завершить контрольную точку' }).waitFor({ timeout: 120000 });
      for (const p of [A, B]) { await p.getByRole('button', { name: 'Завершить контрольную точку' }).click(); await p.getByRole('button', { name: 'Дальше' }).click(); }
      world = await afterCheckpoint(A, B, n, log);
      if (world === 'end') return errors;
    }
    await A.waitForTimeout(4000);
    log(`облако: записей ${gh.stats.puts}, нарочных сбоев 502: ${gh.stats.fails}, конфликтов 409: ${gh.stats.conflicts}`);
    const C = await phone(browser, 'C', errors, { route: gh.route });
    await connect(C);
    await C.getByRole('button', { name: 'Восстановить из облака' }).click();
    const entry = C.locator('button', { hasText: 'Андрей' }).first();
    await entry.waitFor({ timeout: 60000 });
    await entry.click();
    await C.locator('.topbar').waitFor();
    await C.getByRole('button', { name: 'Ещё' }).click();
    const restored = await C.locator('.world-code').first().textContent();
    if (restored !== world) errors.push(`восстановленная игра не совпала: ${restored} ≠ ${world}`);
    return errors;
  },
};
