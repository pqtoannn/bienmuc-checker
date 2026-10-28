import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('tests/inspect_batch2016_5/16G_raw_rows.json', 'utf8'));

// Filter out 008, 038, 161
const active = rows.filter(r => r.img !== '008.jpg' && r.img !== '038.jpg' && r.img !== '161.jpg');

// Let's create an explicit dictionary of corrections for starts
const corrections = {
  '005.jpg': 6,
  '016.jpg': 33,
  '017.jpg': 34,
  '020.jpg': 40,
  '024.jpg': 47,
  '025.jpg': 48,
  '026.jpg': 49,
  '032.jpg': 59,
  '034.jpg': 63,
  '035.jpg': 65,
  '050.jpg': 83,
  '069.jpg': 111,
  '070.jpg': 113,
  '071.jpg': 115,
  '072.jpg': 118,
  '078.jpg': 124,
  '088.jpg': 137,
  '092.jpg': 145,
  '123.jpg': 201,
  '124.jpg': 203,
  '132.jpg': 227,
  '133.jpg': 228,
  '134.jpg': 229,
  '138.jpg': 233,
  '142.jpg': 238,
  '145.jpg': 242,
  '146.jpg': 246,
  '148.jpg': 248,
  '153.jpg': 254,
  '159.jpg': 262,
  '160.jpg': 263,
  '163.jpg': 266
};

const starts = [];
for (let i = 0; i < active.length; i++) {
  const r = active[i];
  if (corrections[r.img] !== undefined) {
    starts.push(corrections[r.img]);
  } else {
    const parts = (r.toSo || '').split('-').map(p => parseInt(p.trim().replace(/[^\d]/g, ''), 10));
    starts.push(parts[0]);
  }
}

// Check strictly monotonic
let hasErr = false;
for (let i = 0; i < starts.length - 1; i++) {
  if (starts[i] >= starts[i+1]) {
    console.error(`ERROR at [${i+1}] ${active[i].img} (s=${starts[i]}) >= [${i+2}] ${active[i+1].img} (s=${starts[i+1]})`);
    hasErr = true;
  }
}

if (!hasErr) {
  console.log(`SUCCESS: All ${starts.length} starts are strictly increasing!`);
  console.log(`First start: ${starts[0]}, Last start: ${starts[starts.length - 1]}`);
  
  // Print each range
  for (let i = 0; i < starts.length; i++) {
    const s = starts[i];
    const e = i === starts.length - 1 ? 267 : starts[i+1] - 1;
    const rng = s === e ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
    // console.log(`[${i+1}] ${active[i].img} | toSo: ${rng.padEnd(8)} | so: ${active[i].so}`);
  }
}
fs.writeFileSync('tests/inspect_batch2016_5/16G_final_starts.json', JSON.stringify({ active, starts }, null, 2));
