import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Narrative } from './Narrative';

it('разделяет смену говорящего и авторский текст на настоящие абзацы', () => {
  const html = renderToStaticMarkup(createElement(Narrative, { text: 'Она открывает окно.\n\n— Холодно, — говорит соседка.\n\nТы отвечаешь:\n\n— Закроем.' }));
  expect(html).toBe('<p>Она открывает окно.</p><p class="dialogue">— Холодно, — говорит соседка.</p><p>Ты отвечаешь:</p><p class="dialogue">— Закроем.</p>');
});

it('сохраняет однострочные тексты и экранирует содержимое без HTML-разметки', () => {
  expect(renderToStaticMarkup(createElement(Narrative, { text: 'Окно закрыто.', className: 'story' }))).toBe('<p class="story">Окно закрыто.</p>');
  expect(renderToStaticMarkup(createElement(Narrative, { text: '<script>\r\n\r\n— Текст.' }))).toBe('<p>&lt;script&gt;</p><p class="dialogue">— Текст.</p>');
});
