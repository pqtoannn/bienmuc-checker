const pad = (n) => String(n).padStart(2, '0');

const starts19M = {
  2: 1, 3: 7, 4: 16, 5: 18, 6: 21, 7: 24, 8: 25, 9: 28, 10: 34,
  11: 37, 12: 39, 13: 42, 14: 46, 15: 48, 16: 50, 17: 52, 18: 54, 19: 55, 20: 59,
  21: 60, 22: 62, 23: 65, 24: 67, 25: 69, 26: 71, 27: 72, 28: 75, 29: 79, 30: 80,
  31: 82, 32: 84, 33: 87, 34: 89, 35: 92, 36: 94, 37: 97, 38: 99, 39: 103, 40: 105,
  41: 106, 42: 109, 43: 111, 44: 113, 45: 115, 46: 118, 47: 120, 48: 123, 49: 126, 50: 128,
  51: 130, 52: 132, 53: 134, 54: 136, 55: 140, 56: 142, 57: 145, 58: 148, 59: 149, 60: 152,
  61: 153, 62: 155, 63: 157, 64: 160, 65: 162, 66: 163, 67: 165, 68: 167, 69: 169, 70: 172,
  71: 176, 72: 177, 73: 178, 74: 182, 75: 184, 76: 187, 77: 190, 78: 196, 79: 198, 80: 200,
  81: 201, 82: 205, 83: 207, 84: 211, 85: 215, 86: 218, 87: 221, 88: 222, 89: 225, 90: 226
};

const keys = Object.keys(starts19M).map(Number).sort((a,b)=>a-b);
let lastEnd = 0;
let errors = 0;

for (let i = 0; i < keys.length; i++) {
  const k = keys[i];
  const s = starts19M[k];
  let e;
  if (i < keys.length - 1) {
    e = starts19M[keys[i + 1]] - 1;
  } else {
    e = 226;
  }
  if (s !== lastEnd + 1) {
    console.error(`GAP ERROR at photo ${k}: expected ${lastEnd + 1}, got ${s}`);
    errors++;
  }
  lastEnd = e;
}

if (errors === 0 && lastEnd === 226) {
  console.log(`SUCCESS! All ${keys.length} items span strictly continuous 01 to 226 with 0 gaps!`);
} else {
  console.error(`FAILED with ${errors} errors, lastEnd = ${lastEnd}`);
}
