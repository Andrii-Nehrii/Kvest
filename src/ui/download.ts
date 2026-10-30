// Сохранить файл на телефоне. iPhone (особенно с экрана «Домой») плохо скачивает по ссылке —
// там открываем меню «Поделиться» с файлом («Сохранить в Файлы»); остальным — обычное скачивание.
export async function saveFile(name: string, text: string): Promise<void> {
  const file = new File([text], name, { type: 'application/json' });
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if ((e as Error).name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Сразу отзывать ссылку нельзя: Safari ещё не успел начать скачивание.
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}
