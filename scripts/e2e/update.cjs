// Плашка «Вышло обновление игры»: новая версия сервис-воркера → плашка → «Обновить» перезагружает игру.
// Меняет dist/sw.js — поэтому запускается последней.
const { appendFileSync } = require('node:fs');
const { join } = require('node:path');
const { phone } = require('./lib.cjs');

module.exports = {
  name: 'update',
  last: true,
  about: 'плашка обновления при новой версии',
  async run({ browser, distDir }) {
    const errors = [];
    const p = await phone(browser, 'A', errors);
    await p.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15000 }).catch(() => {});
    await p.reload();
    await p.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15000 });
    if (await p.locator('.update-bar').count()) errors.push('плашка обновления видна без обновления');
    appendFileSync(join(distDir, 'sw.js'), '\n// e2e: новая версия\n');
    await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await p.locator('.update-bar').waitFor({ timeout: 20000 });
    await p.getByRole('button', { name: 'Обновить' }).click();
    await p.waitForLoadState('load');
    await p.waitForTimeout(1500);
    if (await p.locator('.update-bar').count()) errors.push('после «Обновить» плашка осталась');
    return errors;
  },
};
