// Два телефона: приглашение → шесть участков (главы 1–3) → обмен кодами через интерфейс → итоги → перезагрузка.
const { makeRng, phone, pair, playSegment, tabs, exchangeByCodes } = require('./lib.cjs');

module.exports = {
  name: 'codes',
  about: 'два телефона, обмен кодами вручную, все вкладки, коды из «Ещё»',
  async run({ browser, seed, log }) {
    const errors = [];
    const rnd = makeRng(seed);
    const A = await phone(browser, 'A', errors);
    const B = await phone(browser, 'B', errors);
    await pair(A, B);
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const sa = await playSegment(A, `A${n}`, rnd);
      const sb = await playSegment(B, `B${n}`, rnd);
      log(`участок ${n}: A ${sa} шагов, B ${sb}`);
      await tabs(A, `A${n}`, errors);
      await tabs(B, `B${n}`, errors);
      if (await exchangeByCodes(A, B, n, rnd, errors, log) === 'end') break;
    }
    await A.reload();
    await A.locator('.topbar').waitFor();
    return errors;
  },
};
