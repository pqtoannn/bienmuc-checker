import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('tests/inspect_batch2016_5/16G_raw_rows.json', 'utf8'));

// Filter out duplicates: 008, 038, 161
const active = rows.filter(r => r.img !== '008.jpg' && r.img !== '038.jpg' && r.img !== '161.jpg');

console.log(`Active rows: ${active.length}`);

// We will construct the proposed startSheet for each of the 160 active rows.
// Let's verify what the raw toSo says for each row:
const starts = [];
for (let i = 0; i < active.length; i++) {
  const r = active[i];
  const parts = (r.toSo || '').split('-').map(p => parseInt(p.trim().replace(/[^\d]/g, ''), 10));
  let s = parts[0];
  starts.push({ img: r.img, so: r.so, d: r.d, rawToSo: r.toSo, s: s });
}

fs.writeFileSync('tests/inspect_batch2016_5/16G_active_starts.json', JSON.stringify(starts, null, 2));
console.log('Saved 16G_active_starts.json');
