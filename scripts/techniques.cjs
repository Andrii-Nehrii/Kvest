// Жребий приёмов для следующей точки. Правила — docs/hidden/TECHNIQUES.md, журнал — docs/hidden/techniques-log.json.
// Запуск: node scripts/techniques.cjs <номер точки>            — показать, что выпало
//         node scripts/techniques.cjs <номер точки> --write    — показать и записать в журнал (поле used заполнить после письма)
//         node scripts/techniques.cjs <номер точки> --ahead K  — прикинуть K точек вперёд, считая, что всё выпавшее вошло (ничего не пишет)
const { createHash } = require('node:crypto');
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const LOG = join(__dirname, '..', 'docs', 'hidden', 'techniques-log.json');
const PAIR = 'Uwz9uRin2OZVCugy';
// every — в среднем раз в столько точек; atLeast — страховка: не реже.
const BIG = [
  { id: 'danger', name: 'большая опасная сцена (на кону настоящая потеря)', every: 7, atLeast: 10 },
  { id: 'split_full', name: 'порознь на всю точку, у каждого своя задача', every: 8, atLeast: 12 },
  { id: 'secret', name: 'знают разное / один решает за другого', every: 8, atLeast: 12 },
];
const SMALL = [
  { id: 'resource', name: 'возможность добыть ресурсы', every: 4, atLeast: 7 },
  { id: 'find', name: 'запертая находка', every: 3, atLeast: 5 },
  { id: 'split_part', name: 'порознь на часть точки', every: 5, atLeast: 8 },
  { id: 'thread', name: 'человек или решение из прошлого', every: 5, atLeast: 9 },
];
const ECHO = { id: 'echo_loss', name: 'потеря как последствие старого решения (без опасности)', every: 10, atLeast: 15 };
const KINDS = ['еда', 'вода', 'топливо', 'лекарства', 'тепло и инструмент', 'батареи и связь'];
const SINCE = 12; // с какой точки считать «давно не было», если приём ещё не встречался

function draw(point, log) {
  const before = log.points.filter((p) => p.point < point).sort((a, b) => a.point - b.point);
  const roll = (id) => parseInt(createHash('sha256').update(`${PAIR}:${point}:${id}`).digest('hex').slice(0, 12), 16) / 2 ** 48;
  const counts = (id, used) => used.includes(id) || (id === 'split_part' && used.includes('split_full')); // целая точка порознь засчитывается и как частичная
  const lastUse = (id) => { const p = [...before].reverse().find((x) => counts(id, x.used ?? [])); return p ? p.point : SINCE - 1; };
  const gap = (id) => point - lastUse(id);
  const prev = before.find((p) => p.point === point - 1);
  const prevUsed = prev?.used ?? [];
  const carried = (prev?.carry ?? []).filter((id) => BIG.some((b) => b.id === id));
  const lines = [];
  // Крупное: не больше одного; после крупного — передышка; перенесённое и просроченное идут первыми.
  let big = null;
  const prevBig = BIG.find((b) => prevUsed.includes(b.id));
  if (prevBig) lines.push(`Крупное: нет — передышка после «${prevBig.name}» в точке ${point - 1}.`);
  else {
    const overdue = BIG.filter((b) => gap(b.id) >= b.atLeast).sort((a, b) => gap(b.id) / b.atLeast - gap(a.id) / a.atLeast);
    // Одно и то же крупное — не ближе половины своего среднего интервала (иначе бывает «через точку»).
    const hit = BIG.filter((b) => roll(b.id) < 1 / b.every && gap(b.id) >= Math.ceil(b.every / 2)).sort((a, b) => gap(b.id) - gap(a.id));
    const pick = carried.length ? BIG.find((b) => b.id === carried[0]) : overdue[0] ?? hit[0];
    if (pick) { big = pick.id; lines.push(`Крупное: ${pick.name}${carried.length ? ' (перенесено с прошлой точки)' : overdue[0] === pick ? ' (страховка: давно не было)' : ''}.`); }
    else lines.push('Крупное: нет.');
  }
  // Мелкое: до двух; не две точки подряд; «порознь на часть» не ставится в точку «порознь на всю».
  const ok = SMALL.filter((s) => !prevUsed.includes(s.id) && !(s.id === 'split_part' && big === 'split_full'));
  const forced = ok.filter((s) => gap(s.id) >= s.atLeast);
  const lucky = ok.filter((s) => !forced.includes(s) && roll(s.id) < 1 / s.every).sort((a, b) => roll(a.id) * a.every - roll(b.id) * b.every);
  // Сглаживание: если мелкого нет, а что-то подходит к страховке (осталась одна точка), берём его раньше — меньше скоплений.
  const early = forced.length || lucky.length ? [] : ok.filter((s) => gap(s.id) >= s.atLeast - 1).sort((a, b) => gap(b.id) / b.atLeast - gap(a.id) / a.atLeast).slice(0, 1);
  const small = [...forced, ...lucky, ...early].slice(0, 2);
  let findFor, resourceKind;
  if (!small.length) lines.push('Мелкое: нет.');
  for (const s of small) {
    let extra = forced.includes(s) ? ' (страховка)' : early.includes(s) ? ' (страховка, на точку раньше)' : '';
    if (s.id === 'find') { const last = [...before].reverse().find((p) => p.findFor); findFor = last?.findFor === 'B' ? 'A' : 'B'; extra += ` — очередь: ${findFor}`; }
    if (s.id === 'resource') {
      const seen = before.map((p) => p.resourceKind).filter(Boolean);
      resourceKind = [...KINDS].sort((a, b) => seen.lastIndexOf(a) - seen.lastIndexOf(b))[0];
      extra += ` — вид по ротации: ${resourceKind} (сверить с запасами пары; чего меньше всего — то и вперёд)`;
    }
    lines.push(`Мелкое: ${s.name}${extra}.`);
  }
  // Потеря вне опасности.
  const echo = big !== 'danger' && !prevBig && (gap(ECHO.id) >= ECHO.atLeast || roll(ECHO.id) < 1 / ECHO.every);
  if (echo) lines.push(`Ещё: ${ECHO.name}.`);
  const rolled = [big, ...small.map((s) => s.id), echo ? ECHO.id : null].filter(Boolean);
  return { lines, rolled, findFor, resourceKind };
}

const point = Number(process.argv[2]);
if (!Number.isInteger(point)) { console.error('Укажите номер точки: node scripts/techniques.cjs 19'); process.exit(1); }
const log = JSON.parse(readFileSync(LOG, 'utf8'));
const aheadAt = process.argv.indexOf('--ahead');
const ahead = aheadAt >= 0 ? Number(process.argv[aheadAt + 1]) : 1;
const sim = structuredClone(log);
for (let n = point; n < point + ahead; n++) {
  const r = draw(n, sim);
  console.log(`Точка ${n}:`); for (const l of r.lines) console.log('  ' + l);
  if (ahead > 1) sim.points = sim.points.filter((p) => p.point !== n).concat({ point: n, rolled: r.rolled, used: r.rolled, findFor: r.findFor, resourceKind: r.resourceKind });
  if (ahead === 1 && process.argv.includes('--write')) {
    log.points = log.points.filter((p) => p.point !== n).concat({ point: n, rolled: r.rolled, used: [], note: '' }).sort((a, b) => a.point - b.point);
    writeFileSync(LOG, JSON.stringify(log, null, 2) + '\n');
    console.log('  Записано в журнал. После письма заполнить used (и carry, findFor, resourceKind, note).');
  }
}
if (ahead > 1) console.log('(прикидка: считается, что всё выпавшее вошло; журнал не изменён)');
