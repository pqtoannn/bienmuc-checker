const starts = {
  2: 1, 3: 4, 4: 6, 5: 8, 6: 10, 7: 12, 8: 13, 9: 15, 10: 16,
  11: 18, 12: 23, 13: 25, 14: 27, 15: 29, 16: 32, 17: 34, 18: 35, 19: 37, 20: 40,
  21: 42, 22: 44, 23: 47, 24: 48, 25: 50, 26: 53, 27: 56, 28: 58, 29: 60, 30: 63,
  31: 65, 32: 66, 33: 67, 34: 73, 35: 74, 36: 75, 37: 79, 38: 81, 39: 83, 40: 86,
  41: 88, 42: 91, 43: 92, 44: 94, 45: 97, 46: 100, 47: 101, 48: 103, 49: 105, 50: 107,
  51: 110, 52: 111, 53: 115, 54: 118, 55: 119, 56: 120, 57: 121, 58: 124, 59: 126, 60: 129,
  61: 132, 62: 136, 63: 137, 64: 138, 65: 140
};

const pad = n => String(n).padStart(2, '0');
const ranges = {};
const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);

for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
  const cur = starts[p];
  if (p === 65) {
    ranges[p] = `${pad(cur)}-141`;
  } else {
    const nextP = keys[i+1];
    const next = starts[nextP];
    if (next - 1 === cur) {
      ranges[p] = pad(cur);
    } else {
      ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
    }
  }
}

let lastEnd = 0;
let errors = 0;
for (const p of keys) {
  const r = ranges[p];
  let s, e;
  if (r.includes('-')) {
    const parts = r.split('-');
    s = parseInt(parts[0], 10);
    e = parseInt(parts[1], 10);
  } else {
    s = parseInt(r, 10);
    e = s;
  }
  if (s !== lastEnd + 1) {
    console.error(`GAP at photo ${p}: expected ${lastEnd + 1}, got ${s}`);
    errors++;
  }
  lastEnd = e;
}

if (errors === 0) {
  console.log(`SUCCESS: 20A has ${keys.length} active docs, spanning sheets 01 to ${lastEnd} continuously with ZERO GAPS!`);
}
