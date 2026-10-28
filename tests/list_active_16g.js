import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('tests/inspect_batch2016_5/16G_raw_rows.json', 'utf8'));

// Filter out 008, 038, 161
const active = rows.filter(r => r.img !== '008.jpg' && r.img !== '038.jpg' && r.img !== '161.jpg');
console.log('Total active rows:', active.length);

for (let i = 0; i < active.length; i++) {
  const r = active[i];
  console.log(`[${i+1}] ${r.img} | so: ${(r.so||'').padEnd(16)} | d: ${(r.d||'').padEnd(12)} | toSo: ${(r.toSo||'')}`);
}
