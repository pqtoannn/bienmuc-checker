import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('tests/inspect_batch/PL_2020_20D/all_rows_summary.json', 'utf8'));

let lastNum = 0;
for (const r of rows) {
  if (r.idx === 1) continue; // skip cover
  const num = parseInt(r.to, 10);
  const diff = num - lastNum;
  if (isNaN(num) || diff <= 0 || diff > 4) {
    console.log(`Alert at row ${r.idx} (${r.fn}): prev=${lastNum} -> curr=${r.to} (diff=${diff}) | so=${r.so}`);
  }
  if (!isNaN(num) && num < 400) {
    lastNum = num;
  }
}
