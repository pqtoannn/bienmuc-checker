import fs from 'fs';

// Build the verified starts for PL_2020_20F
const starts = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9,
  11: 10, 12: 12, 13: 13, 14: 14, 15: 15, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
  21: 23, 22: 24, 23: 25, 24: 26, 25: 27, 26: 29, 27: 30, 28: 31, 29: 32, 30: 33,
  31: 34, 32: 35, 33: 37, 34: 38, 35: 39, 36: 40, 37: 41, 38: 44, 39: 45, 40: 47,
  41: 48, 42: 49, 43: 53, 44: 54, 45: 57, 46: 59, 47: 60, 48: 61, 49: 63, 50: 64,
  51: 66, 52: 67, 53: 68, 54: 69, 55: 70, 56: 71, 57: 72,
  // 58 is SKIP (dup scan of 57)
  59: 73, 60: 74, 61: 75, 62: 76, 63: 77, 64: 78, 65: 79, 66: 80, 67: 81, 68: 82,
  69: 83, 70: 84, 71: 85, 72: 86, 73: 87, 74: 88, 75: 89, 76: 90, 77: 91, 78: 92,
  79: 93, 80: 94, 81: 95, 82: 96, 83: 97, 84: 98, 85: 100, 86: 101, 87: 103, 88: 104,
  89: 105, 90: 106, 91: 108, 92: 109, 93: 110, 94: 112, 95: 113, 96: 114, 97: 115, 98: 116,
  99: 117, 100: 118, 101: 119, 102: 120, 103: 121, 104: 123, 105: 124, 106: 125, 107: 126, 108: 127,
  109: 128, 110: 129, 111: 131, 112: 132, 113: 134, 114: 136, 115: 137, 116: 138, 117: 139, 118: 140,
  119: 141, 120: 142,
  // 121 is SKIP (dup scan of 120)
  122: 143, 123: 145, 124: 146, 125: 147, 126: 148, 127: 150, 128: 151, 129: 152, 130: 153,
  131: 154, 132: 155, 133: 156, 134: 157, 135: 158, 136: 159, 137: 160, 138: 161, 139: 162, 140: 163,
  141: 164, 142: 165, 143: 166, 144: 167, 145: 168, 146: 169, 147: 170, 148: 171, 149: 173,
  150: 174
  // 151 is SKIP (closing page of 150, ends at 176)
};

const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
console.log('Total active documents:', keys.length);

const pad = n => String(n).padStart(2, '0');
const ranges = {};

for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
  const cur = starts[p];
  if (p === 150) {
    ranges[p] = `${pad(cur)}-176`;
  } else {
    const nextP = keys[i + 1];
    const next = starts[nextP];
    if (next - 1 === cur) {
      ranges[p] = pad(cur);
    } else {
      ranges[p] = `${pad(cur)}-${pad(next - 1)}`;
    }
  }
}

// Verify continuity
let lastEnd = 0;
let errors = 0;
for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
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
    console.error(`GAP at key ${p}: expected ${lastEnd + 1}, got ${s} (range: ${r})`);
    errors++;
  }
  lastEnd = e;
}

if (errors === 0) {
  console.log(`VERIFICATION 100% SUCCESS: ${keys.length} active documents, sheets 01 to ${lastEnd} perfectly continuous with 0 gaps!`);
} else {
  console.error(`Total errors: ${errors}`);
}
