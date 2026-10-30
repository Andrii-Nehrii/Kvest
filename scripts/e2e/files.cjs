// Файл сохранения и приглашение: отмена приглашения, скачивание файла, восстановление на «новом телефоне».
const { phone, code } = require('./lib.cjs');

module.exports = {
  name: 'files',
  about: 'отмена приглашения, файл сохранения: скачать и восстановить',
  async run({ browser }) {
    const errors = [];
    const A = await phone(browser, 'A', errors);
    const B = await phone(browser, 'B', errors);
    await A.getByRole('button', { name: 'Новая игра — пригласить партнёра' }).click();
    await A.locator('button.option', { hasText: 'Buchholz' }).click();
    await A.locator('input[type=text]').fill('Андрей');
    await A.getByRole('button', { name: 'Создать приглашение' }).click();
    const invite = await code(A);
    await A.getByRole('button', { name: 'Отменить приглашение' }).click();
    if (!(await A.getByRole('button', { name: 'Новая игра — пригласить партнёра' }).count())) errors.push('после отмены приглашения нет меню');
    await B.getByRole('button', { name: 'У меня есть приглашение' }).click();
    await B.locator('textarea').fill(invite);
    await B.getByRole('button', { name: 'Дальше' }).click();
    await B.locator('input[type=text]').fill('Аня');
    await B.getByRole('button', { name: 'Создать ответ' }).click();
    await B.getByRole('button', { name: 'Начать играть' }).click();
    await B.getByRole('button', { name: 'Ещё' }).click();
    const [d] = await Promise.all([B.waitForEvent('download'), B.getByRole('button', { name: 'Скачать файл сохранения' }).click()]);
    const file = await d.path();
    if (JSON.parse(require('node:fs').readFileSync(file, 'utf8')).kvestSave !== 1) errors.push('файл сохранения в неверном формате');
    const C = await phone(browser, 'C', errors);
    await C.locator('input[type=file]').setInputFiles(file);
    await C.locator('.topbar').waitFor({ timeout: 10000 });
    return errors;
  },
};
