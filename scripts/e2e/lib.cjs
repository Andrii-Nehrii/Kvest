// Общие помощники браузерных проверок: «телефоны» (контексты браузера), пара игроков, ходы, обмен на точке.
const { chromium } = require('playwright');

const URL = process.env.KVEST_URL || 'http://localhost:4179/';

/** Детерминированный генератор случайных чисел по номеру прогона. */
function makeRng(seed) {
  let r = seed * 9301 + 49297;
  return () => ((r = (r * 9301 + 49297) % 233280) / 233280);
}

const launch = (opts = {}) => chromium.launch(opts);

/** Отдельный «телефон»: свой контекст (своё хранилище), ошибки страницы собираются в errors. */
async function phone(browser, tag, errors, { width = 360, height = 740, route } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: true, acceptDownloads: true });
  if (route) await ctx.route('https://api.github.com/**', route);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/status of (409|404|502)/.test(m.text())) errors.push(`${tag} console: ${m.text()}`); });
  p.on('dialog', (d) => d.accept());
  await p.goto(URL);
  return p;
}

const code = async (p, sel = '.code-box') => (await p.locator(sel).first().textContent()).trim();
const inSection = (p, title) => p.locator('section', { has: p.locator(`h3:text-is("${title}")`) });
const worldCode = async (p) => { await p.getByRole('button', { name: 'Ещё' }).click(); const w = await p.locator('.world-code').first().textContent(); await p.locator('nav button').first().click(); return w; };

/** A создаёт приглашение, B принимает, A вставляет ответ. beforeCreate — например, подключить облако у A. */
async function pair(A, B, { beforeCreate } = {}) {
  if (beforeCreate) await beforeCreate(A);
  await A.getByRole('button', { name: 'Новая игра — пригласить партнёра' }).click();
  await A.locator('button.option', { hasText: 'Buchholz' }).click();
  await A.locator('input[type=text]').fill('Андрей');
  await A.getByRole('button', { name: 'Создать приглашение' }).click();
  const invite = await code(A);
  await B.getByRole('button', { name: 'У меня есть приглашение' }).click();
  await B.locator('textarea').fill(invite);
  await B.getByRole('button', { name: 'Дальше' }).click();
  await B.locator('input[type=text]').fill('Аня');
  await B.getByRole('button', { name: 'Создать ответ' }).click();
  const reply = await code(B);
  await B.getByRole('button', { name: 'Начать играть' }).click();
  await A.locator('textarea').fill(reply);
  await A.getByRole('button', { name: 'Начать игру' }).click();
  await A.locator('.topbar').waitFor();
}

const atCheckpoint = async (p) => (await p.locator('.scene-title', { hasText: 'Контрольная точка №' }).count()) > 0;
async function failIfErrorScreen(p, tag) {
  if (await p.locator('.card.bad h3', { hasText: 'Ошибка' }).count()) throw new Error(`${tag}: экран ошибки: ${(await p.locator('.card.bad').textContent()).slice(0, 300)}`);
}

/** Сюжетный игрок: случайное доступное действие сцены, при пустой сцене — повседневное. */
async function playSegment(p, tag, rnd, limit = 300) {
  for (let i = 0; i < limit; i++) {
    if (await atCheckpoint(p)) return i;
    await failIfErrorScreen(p, tag);
    const acts = p.locator('.page > .actions').first().locator('button.action:not(.off)');
    const n = await acts.count();
    if (!n) {
      const daily = p.locator('.group-toggle', { hasText: 'Повседневное' });
      if (await daily.count()) {
        await daily.click();
        const d = p.locator('.actions').nth(1).locator('button.action:not(.off)');
        if (await d.count()) { await d.first().click(); await p.getByRole('button', { name: /^Выполнить/ }).click(); continue; }
      }
      throw new Error(`${tag}: нет доступных действий на шаге ${i}: ${(await p.locator('.page').textContent()).slice(0, 300)}`);
    }
    await acts.nth(Math.floor(rnd() * n)).click();
    const run = p.getByRole('button', { name: /^Выполнить/ });
    if (await run.isDisabled()) { await p.getByRole('button', { name: 'Отмена' }).click(); continue; }
    await run.click();
  }
  throw new Error(`${tag}: не дошёл до КТ за ${limit} шагов`);
}

const SKIP = /Удалить игру|Отключить|Отменить приглашение|Скачать|Новая игра|Поделиться|Копировать|Восстановить|Обновить|Отправить сейчас|Подключить|Вставить|Принять/;
const toTop = (el) => el.evaluate((e) => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); }).catch(() => {});

/** «Неаккуратный» игрок: случайные нажатия по всему интерфейсу, примерно каждое восьмое — шаг сюжета. */
async function monkeySegment(p, tag, rnd, limit = 1200) {
  for (let i = 0; i < limit; i++) {
    if (await atCheckpoint(p)) return i;
    await failIfErrorScreen(p, tag);
    if (rnd() < 0.12) {
      await p.locator('nav button').first().click();
      const acts = p.locator('.page > .actions').first().locator('button.action:not(.off)');
      const n = await acts.count();
      if (n) {
        const a = acts.nth(Math.floor(rnd() * n));
        await toTop(a);
        await a.click();
        const run = p.getByRole('button', { name: /^Выполнить/ });
        if (await run.count() && !(await run.isDisabled())) await run.click();
        else if (await p.getByRole('button', { name: 'Отмена' }).count()) await p.getByRole('button', { name: 'Отмена' }).click();
      }
      continue;
    }
    const cands = p.locator('button:visible, input[type=checkbox]:visible');
    const n = await cands.count();
    for (let tries = 0; tries < 10 && n; tries++) {
      const el = cands.nth(Math.floor(rnd() * n));
      const txt = ((await el.textContent().catch(() => '')) || '') + ((await el.getAttribute('aria-label').catch(() => '')) || '');
      if (SKIP.test(txt) || await el.isDisabled().catch(() => true)) continue;
      await toTop(el);
      await el.click({ timeout: 3000 }).catch(() => {});
      const run = p.getByRole('button', { name: /^Выполнить/ });
      if (rnd() < 0.6 && await run.count() && !(await run.isDisabled())) await run.click();
      break;
    }
  }
  await p.locator('nav button').first().click();
  const dump = await p.evaluate(() => ({
    time: document.querySelector('.topbar .time')?.textContent, place: document.querySelector('.topbar .place')?.textContent,
    title: document.querySelector('.scene-title')?.textContent,
    acts: [...document.querySelectorAll('.page .actions button.action')].map((b) => b.textContent.slice(0, 50) + (b.classList.contains('off') ? ' [off]' : '')),
  }));
  throw new Error(`${tag}: не дошёл до КТ за ${limit} нажатий: ${JSON.stringify(dump)}`);
}

/** Все вкладки: без горизонтальной прокрутки и экранов ошибки. */
async function tabs(p, tag, errors) {
  for (const t of ['Вещи', 'Тело', 'Журнал', 'Люди', 'Ещё', 'История', 'Точка']) {
    const b = p.locator('nav button', { hasText: t });
    if (!(await b.count())) continue;
    await b.click();
    const w = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    if (w[0] > w[1]) errors.push(`${tag} ${t}: горизонтальная прокрутка ${w[0]} > ${w[1]}`);
    if (await p.locator('.card.bad h3', { hasText: 'Ошибка' }).count()) errors.push(`${tag} ${t}: экран ошибки`);
  }
}

/**
 * Контрольная точка обменом кодов через интерфейс. A получает ответ первым и сразу завершает точку,
 * поэтому B берёт код ответа A уже из «Ещё» — так проверяется и повторная отправка кодов.
 */
async function exchangeByCodes(A, B, n, rnd, errors, log) {
  for (const p of [A, B]) await p.locator('.scene-title', { hasText: `Контрольная точка №${n}` }).waitFor();
  const seg = {};
  for (const [p, k] of [[A, 'A'], [B, 'B']]) {
    const s = p.locator('section', { has: p.locator('h3', { hasText: 'Твой ход' }) });
    seg[k] = (await s.count()) ? (await s.locator('.code-box').textContent()).trim() : null;
  }
  for (const [p, from] of [[A, 'B'], [B, 'A']]) {
    const sec = inSection(p, 'Ход партнёра');
    if (seg[from] && await sec.locator('textarea').count()) { await sec.locator('textarea').fill(seg[from]); await sec.getByRole('button', { name: 'Принять ход' }).click(); }
  }
  for (const p of [A, B]) await inSection(p, 'Общий мир').waitFor();
  const wa = await A.locator('.world-code').first().textContent();
  const wb = await B.locator('.world-code').first().textContent();
  log(`КТ${n}: общий мир A=${wa} B=${wb}`);
  if (wa !== wb) throw new Error(`КТ${n}: миры разошлись`);
  const ans = {};
  for (const [p, k] of [[A, 'A'], [B, 'B']]) {
    const sec = inSection(p, 'Решение');
    if (!(await sec.count())) continue;
    const opts = sec.locator('button.option');
    await opts.nth(Math.floor(rnd() * (await opts.count()))).click();
    await sec.getByRole('button', { name: 'Подтвердить ответ' }).click();
    await sec.locator('.code-box').waitFor();
    ans[k] = (await sec.locator('.code-box').textContent()).trim();
  }
  const finish = async (p) => {
    await p.getByRole('button', { name: 'Завершить контрольную точку' }).click();
    await p.locator('.h1', { hasText: 'Что решено' }).waitFor();
  };
  const accept = async (p, c) => {
    const sec = inSection(p, 'Ответ партнёра');
    if (c && await sec.locator('textarea').count()) { await sec.locator('textarea').fill(c); await sec.getByRole('button', { name: 'Принять ответ' }).click(); }
  };
  await accept(A, ans.B);
  await finish(A);
  if (ans.A && !(await A.locator('.page').textContent()).includes('остались в «Ещё»')) errors.push(`КТ${n}: нет подсказки про коды в «Ещё»`);
  await A.getByRole('button', { name: 'Дальше' }).click();
  await A.getByRole('button', { name: 'Ещё' }).click();
  const fromMore = ans.A ? (await inSection(A, `Мои коды точки №${n}`).locator('.code-box').last().textContent()).trim() : null;
  if (ans.A && fromMore !== ans.A) errors.push(`КТ${n}: код ответа в «Ещё» не совпал`);
  await A.locator('nav button').first().click();
  await accept(B, fromMore);
  await finish(B);
  await B.getByRole('button', { name: 'Дальше' }).click();
  return afterCheckpoint(A, B, n, log);
}

/** После точки: коды мира совпадают. Возвращает код или 'end', если игра окончена. */
async function afterCheckpoint(A, B, n, log) {
  if (!(await A.locator('nav').count())) { log(`КТ${n}: игра окончена`); return 'end'; }
  const ca = await worldCode(A);
  const cb = await worldCode(B);
  log(`КТ${n} пройдена: код мира A=${ca} B=${cb}`);
  if (ca !== cb) throw new Error(`КТ${n}: после точки миры разошлись`);
  return ca;
}

module.exports = {
  URL, makeRng, launch, phone, code, inSection, worldCode, pair, playSegment, monkeySegment, tabs, exchangeByCodes, afterCheckpoint,
};
