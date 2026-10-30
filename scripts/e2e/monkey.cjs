// «Неаккуратные» игроки: случайные нажатия по всему интерфейсу на двух телефонах, обе точки.
const { makeRng, phone, pair, monkeySegment, exchangeByCodes } = require('./lib.cjs');

module.exports = {
  name: 'monkey',
  slow: true,
  about: 'случайные нажатия по всем экранам (10–15 мин)',
  async run({ browser, seed, log }) {
    const errors = [];
    const rnd = makeRng(seed);
    const A = await phone(browser, 'A', errors);
    const B = await phone(browser, 'B', errors);
    await pair(A, B);
    for (const n of [1, 2]) {
      const sa = await monkeySegment(A, `A${n}`, rnd);
      const sb = await monkeySegment(B, `B${n}`, rnd);
      log(`участок ${n}: A ${sa} нажатий, B ${sb}`);
      if (await exchangeByCodes(A, B, n, rnd, errors, log) === 'end') break;
    }
    return errors;
  },
};
