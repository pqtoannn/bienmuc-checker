import fs from 'fs';

// Starting sheet numbers for PL_2021_21U
const starts = {
  2: 1,
  3: 14,
  4: 17,
  5: 18,
  6: 19,
  7: 20,
  8: 21,
  9: 35,
  10: 38,
  11: 40,
  12: 43,
  13: 45,
  14: 48,
  15: 51,
  16: 54,
  17: 61,
  18: 62,
  19: 70,
  20: 75,
  21: 77,
  22: 80,
  23: 83,
  24: 86,
  25: 89,
  26: 92,
  27: 100,
  28: 105, // or 103? Let's check 28
  29: 112,
  30: 122,
  31: 124,
  32: 127,
  33: 130,
  34: 134,
  35: 138,
  36: 142,
  37: 146,
  38: 149,
  39: 152,
  40: 156,
  41: 159,
  42: 162,
  43: 165,
  44: 168,
  45: 169,
  46: 170,
  47: 172,
  48: 173,
  49: 175,
  50: 178,
  51: 181,
  52: 184,
  53: 186,
  54: 189,
  55: 192,
  56: 195,
  57: 198
};

const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
const ranges = {};

for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
  const startNum = starts[p];
  let endNum;
  if (i === keys.length - 1) {
    endNum = 198;
  } else {
    endNum = starts[keys[i + 1]] - 1;
  }
  
  if (startNum === endNum) {
    ranges[p] = String(startNum).padStart(2, '0');
  } else {
    ranges[p] = `${String(startNum).padStart(2, '0')}-${String(endNum).padStart(2, '0')}`;
  }
}

let prevEnd = 0;
let gapCount = 0;
for (const p of keys) {
  const r = ranges[p];
  const parts = r.split('-').map(Number);
  const start = parts[0];
  const end = parts.length > 1 ? parts[1] : parts[0];
  if (prevEnd > 0 && start !== prevEnd + 1) {
    console.log(`GAP at photo ${p}: prevEnd=${prevEnd}, start=${start}`);
    gapCount++;
  }
  prevEnd = end;
}

console.log(`Total active docs: ${keys.length}`);
console.log(`Final sheet: ${prevEnd}`);
console.log(`Gaps detected: ${gapCount}`);
