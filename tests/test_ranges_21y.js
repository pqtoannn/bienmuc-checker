import fs from 'fs';

const starts = {
  1: 1, 2: 13, 3: 15, 4: 23, 5: 25, 6: 27, 7: 29, 8: 31, 9: 33, 10: 34,
  11: 35, 12: 36, 13: 37, 14: 38, 15: 39, 16: 40, 17: 41, 18: 43, 19: 47, 20: 49,
  21: 51, 22: 57, 23: 59, 24: 62, 25: 64, 26: 66, 27: 68, 28: 71, 29: 73, 30: 76,
  31: 78, 32: 82, 33: 84, 34: 86, 35: 89, 36: 90, 37: 92, 38: 94, 39: 96, 40: 98,
  41: 99, 42: 100, 43: 103, 44: 105, 45: 107, 46: 109, 47: 111, 48: 113,
  49: 116, 50: 118, 51: 124, 52: 125, 53: 127, 54: 129, 55: 131, 56: 133, 57: 135, 58: 141,
  59: 143, 60: 146, 61: 149, 62: 153, 63: 155, 64: 157, 65: 159, 66: 162, 67: 164, 68: 166,
  69: 168, 70: 170, 71: 172, 72: 174, 73: 176, 74: 179, 75: 182, 76: 187, 77: 190, 78: 196,
  79: 202, 80: 208, 81: 210, 82: 211, 83: 212, 84: 215, 85: 222, 86: 229, 87: 236, 88: 243,
  89: 246, 90: 255, 91: 260, 92: 263, 93: 269, 94: 274, 95: 275, 96: 276, 97: 278, 98: 279,
  99: 280, 100: 281, 101: 285, 102: 289, 103: 292, 104: 293, 105: 311
};

console.log('Total photos mapped:', Object.keys(starts).length);

// Calculate ranges
const ranges = {};
const pad = (n) => String(n).padStart(2, '0');

for (let i = 1; i <= 105; i++) {
  const cur = starts[i];
  if (i === 105) {
    ranges[i] = pad(cur);
  } else {
    const next = starts[i + 1];
    if (next - 1 === cur) {
      ranges[i] = pad(cur);
    } else {
      ranges[i] = `${pad(cur)}-${pad(next - 1)}`;
    }
  }
}

console.log('Sample ranges:');
console.log('1:', ranges[1]);
console.log('41:', ranges[41]);
console.log('42:', ranges[42]);
console.log('104:', ranges[104]);
console.log('105:', ranges[105]);

// Verify gapless
let lastEnd = 0;
let errors = 0;
for (let i = 1; i <= 105; i++) {
  const r = ranges[i];
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
    console.error(`GAP at doc ${i}: expected ${lastEnd + 1}, got ${s}`);
    errors++;
  }
  lastEnd = e;
}
if (errors === 0) {
  console.log(`\nSUCCESS: All 105 documents span sheets 01 to ${lastEnd} continuously with ZERO GAPS!`);
}
