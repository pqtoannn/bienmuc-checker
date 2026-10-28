const starts = {
  2: 1, 3: 3, 4: 10, 5: 11, 6: 12, 7: 16, 8: 17, 9: 19, 10: 20,
  11: 21, 12: 22, 13: 23, 14: 25, 15: 26, 16: 31, 17: 33, 18: 34, 19: 36, 20: 37,
  21: 39, 22: 40, 23: 41, 24: 42, 25: 43, 26: 44, 27: 45, 28: 49, 29: 51, 30: 64,
  31: 75, 32: 78, 33: 84, 34: 85, 35: 86, 36: 90, 37: 91, 38: 92, 39: 94, 40: 97,
  41: 99, 42: 100, 43: 106, 44: 116, 45: 119, 46: 120, 47: 125, 48: 126, 49: 127, 50: 131,
  51: 132, 52: 139, 53: 141, 54: 143, 55: 144, 56: 145, 57: 146, 58: 147, 59: 148, 60: 149,
  61: 150, 62: 154, 63: 156, 64: 157, 65: 158, 66: 162, 67: 166, 68: 167, 69: 170, 70: 174,
  71: 177, 72: 178, 73: 183, 74: 185, 75: 186, 76: 188, 77: 191, 78: 193, 79: 194, 80: 205,
  81: 208, 82: 209, 83: 210, 84: 213, 85: 221, 86: 222, 87: 225, 88: 226, 89: 228, 90: 237,
  91: 245, 92: 248, 93: 250, 94: 251, 95: 252, 96: 253, 97: 255, 98: 264, 99: 268, 100: 272,
  101: 275, 102: 278, 103: 281, 104: 287, 105: 298, 106: 299, 107: 300, 108: 301, 109: 302, 110: 304
};

const pad = n => String(n).padStart(2, '0');
const ranges = {};
const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);

for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
  const cur = starts[p];
  if (p === 110) {
    ranges[p] = pad(cur);
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
  console.log(`SUCCESS: 20B has ${keys.length} active docs, spanning sheets 01 to ${lastEnd} continuously with ZERO GAPS!`);
}
