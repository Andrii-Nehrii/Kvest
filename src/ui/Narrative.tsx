/** Абзацы авторского текста и реплики сохраняются и в сцене, и в результате хода. */
export function Narrative({ text, className }: { text: string; className?: string }) {
  return <>{text.split(/\r?\n\s*\r?\n/).filter(p => p.trim()).map((paragraph, i) => (
    <p key={i} className={[className, paragraph.trimStart().startsWith('—') ? 'dialogue' : ''].filter(Boolean).join(' ') || undefined}>
      {paragraph}
    </p>
  ))}</>;
}
