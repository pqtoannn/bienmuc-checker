import fs from 'fs';

// All starting numbers observed visually from collages and high-res crops
const starts = {
  2: 1, 3: 2, 4: 9, 5: 11, 6: 13, 7: 15, 8: 18, 9: 34, 10: 37,
  11: 39, 12: 41, 13: 42, 14: 43, 15: 45, 16: 47, 17: 49, 18: 50, 19: 52, 20: 53,
  21: 55, 22: 57, 23: 58, 24: 60, 25: 66, 26: 67, 27: 68, 28: 69, 29: 71, 30: 73,
  31: 82, 32: 83, 33: 84, 34: 85, 35: 86, 36: 87, 37: 88, 38: 90, 39: 91, 40: 92,
  41: 93, 42: 94, 43: 96, 44: 97, 45: 98, 46: 118, 47: 120, 48: 122, 49: 123, 50: 125,
  51: 126, 52: 127, 53: 128, 54: 129, 55: 130, 56: 132, 57: 133, 58: 134, 59: 135, 60: 137,
  61: 138, 62: 139, 63: 141, 64: 142, 65: 143, 66: 145, 67: 147, 68: 149, 69: 152, 70: 154,
  71: 163, 72: 165, 73: 167, 74: 169, 75: 171, 76: 173, 77: 175, 78: 178, 79: 180, 80: 183,
  81: 185, 82: 186, 83: 188, 84: 190, 85: 192, 86: 194, 87: 196, 88: 200, 89: 202, 90: 204,
  91: 206, /* 92 missing */
  93: 215, 94: 217, 95: 218, 96: 219, 97: 221, 98: 223, 99: 224, 100: 232,
  101: 243, 102: 246, 103: 247, 104: 249, 105: 251, 106: 252, 107: 253, 108: 254, 109: 255, 110: 256,
  111: 257, 112: 265, 113: 266, 114: 268, 115: 270, 116: 271, 117: 274, 118: 275, 119: 276, 120: 277,
  121: 278, 122: 279, 123: 280, 124: 281, 125: 282, 126: 283, 127: 284, 128: 286, 129: 288, 130: 289,
  131: 290, 132: 291, 133: 292, 134: 293, 135: 294, 136: 303, 137: 306, 138: 308, 139: 309, 140: 322,
  141: 323, 142: 324, 143: 325, 144: 327, 145: 328, 146: 341, 147: 347, 148: 360, 149: 364, 150: 366,
  151: 368, 152: 370, 153: 385, 154: 386, 155: 387, 156: 388, 157: 389, 158: 390, 159: 391, 160: 392,
  161: 393, 162: 402 // 162 is last sheet of 161!
};

console.log('Total mapped photos:', Object.keys(starts).length);

// Let us calculate the range for each photo
const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
const ranges = {};

for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
  if (p === 162) continue; // annex of 161
  const startNum = starts[p];
  const nextP = keys[i + 1];
  let endNum;
  if (p === 161) {
    endNum = starts[162]; // 402
  } else {
    endNum = starts[nextP] - 1;
  }
  
  if (startNum === endNum) {
    ranges[p] = String(startNum).padStart(2, '0');
  } else {
    ranges[p] = `${String(startNum).padStart(2, '0')}-${String(endNum).padStart(2, '0')}`;
  }
}

// Print ranges and check continuity
let prevEnd = 0;
let gapCount = 0;
for (const p of keys) {
  if (p === 162) continue;
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
console.log(`Total active docs: ${Object.keys(ranges).length}`);
console.log(`Final sheet: ${prevEnd}`);
console.log(`Gaps detected: ${gapCount}`);
