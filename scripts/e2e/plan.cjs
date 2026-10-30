// Панель выбранных действий внизу не закрывает кнопки: под ней ровно столько места, сколько она занимает.
const { phone, pair } = require('./lib.cjs');

module.exports = {
  name: 'plan',
  about: 'панель плана не перекрывает нижние действия',
  async run({ browser }) {
    const errors = [];
    const A = await phone(browser, 'A', errors, { height: 640 });
    const B = await phone(browser, 'B', errors, { height: 640 });
    await pair(A, B);
    const p = B;
    const measure = async (label) => {
      await p.waitForTimeout(250);
      await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => {
        const plan = document.querySelector('.plan');
        const btns = [...document.querySelectorAll('.page button')].filter((x) => !x.closest('.plan'));
        return { planTop: plan ? plan.getBoundingClientRect().top : null, lastBottom: btns[btns.length - 1].getBoundingClientRect().bottom };
      });
      if (r.planTop !== null && r.lastBottom > r.planTop + 1) errors.push(`${label}: нижняя кнопка под панелью плана`);
    };
    const all = p.locator('.page .actions button.action:not(.off)');
    await all.first().click();
    await measure('1 действие');
    await p.getByRole('button', { name: 'Отмена' }).click();
    await p.locator('.group-toggle', { hasText: 'Повседневное' }).click();
    for (let k = 0; k < 6; k++) {
      const n = await all.count();
      for (let i = n - 1; i >= 0; i--) {
        const el = all.nth(i);
        if ((await el.getAttribute('class')).includes('sel')) continue;
        await el.scrollIntoViewIfNeeded();
        const free = await el.evaluate((e) => { const r = e.getBoundingClientRect(); return e.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)); });
        if (free) { await el.click(); break; }
      }
      await measure(`выбрано ${await p.locator('.plan-row').count()}`);
    }
    return errors;
  },
};
