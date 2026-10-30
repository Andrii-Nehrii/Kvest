// Игра открыта дважды на одном телефоне (значок и вкладка — общее хранилище): ходы не теряются.
const { phone, pair } = require('./lib.cjs');

module.exports = {
  name: 'instances',
  about: 'игра открыта дважды: копии подхватывают ходы друг друга',
  async run({ browser }) {
    const errors = [];
    const A = await phone(browser, 'A', errors);
    const B = await phone(browser, 'B', errors);
    await pair(A, B);
    const B2 = await B.context().newPage();
    B2.on('pageerror', (e) => errors.push(`B2 pageerror: ${e.message}`));
    await B2.goto(B.url());
    await B2.locator('.topbar').waitFor();
    const step = async (p) => {
      await p.locator('.page > .actions').first().locator('button.action:not(.off)').first().click();
      await p.getByRole('button', { name: /^Выполнить/ }).click();
      await p.waitForTimeout(300);
    };
    const clock = (p) => p.locator('.topbar .time').textContent();
    await step(B);
    await step(B);
    await B2.waitForTimeout(500);
    if (await clock(B) !== await clock(B2)) errors.push('вторая копия не подхватила ходы первой');
    await step(B2);
    await B.waitForTimeout(500);
    if (await clock(B) !== await clock(B2)) errors.push('первая копия не подхватила ход второй');
    const saved = await B.evaluate(() => new Promise((res) => {
      const r = indexedDB.open('kvest');
      r.onsuccess = () => { const db = r.result; const g = db.transaction(db.objectStoreNames[0]).objectStore(db.objectStoreNames[0]).get('current'); g.onsuccess = () => res(g.result.segment.length); };
    }));
    if (saved !== 3) errors.push(`в сохранении ${saved} действий вместо 3 — ход потерян`);
    return errors;
  },
};
