import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('tests/inspect_batch2016_5/16G_raw_rows.json', 'utf8'));

console.log(`Total raw rows: ${rows.length}`);
let prevEnd = 0;
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const parts = r.toSo.split('-').map(p => parseInt(p.trim(), 10));
  const s = parts[0];
  const e = parts.length > 1 ? parts[1] : parts[0];

  const hasIssue = isNaN(s) || isNaN(e) || s !== prevEnd + 1 || (prevEnd > 0 && s <= prevEnd);
  if (hasIssue || i < 15 || i > rows.length - 10) {
    console.log(`[${i+1}] r=${r.r} | ${r.img} | toSo: ${r.toSo.padEnd(10)} | so: ${r.so.padEnd(16)} | d: ${r.d.padEnd(12)} | s=${s}, e=${e}, prevEnd=${prevEnd}`);
  }
  if (!isNaN(e)) prevEnd = e;
}
