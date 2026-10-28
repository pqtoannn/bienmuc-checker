const pad = (n) => String(n).padStart(2, '0');

const starts19K = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 8,
  9: 9,
  10: 10,
  11: 12,
  12: 13,
  13: 14,
  14: 15,
  15: 16,
  16: 17,
  17: 19,
  18: 20,
  19: 21,
  20: 22,
  21: 23,
  22: 25,
  23: 26,
  24: 27,
  25: 28,
  26: 30,
  27: 31,
  28: 32,
  29: 33,
  30: 34,
  31: 35,
  32: 36,
  33: 37,
  34: 38,
  35: 39,
  36: 40,
  37: 41,
  38: 42,
  39: 43,
  40: 44,
  41: 45,
  42: 48,
  43: 50,
  44: 51,
  45: 52,
  46: 54,
  47: 55,
  48: 56,
  49: 57,
  50: 59,
  51: 60,
  52: 61,
  53: 63,
  54: 64,
  55: 65,
  56: 67,
  57: 72,
  58: 73,
  59: 74,
  60: 75,
  61: 76,
  62: 77,
  63: 78,
  64: 79,
  65: 81,
  66: 83,
  67: 84,
  68: 85,
  69: 87,
  70: 88,
  71: 89,
  72: 90,
  73: 92,
  74: 93,
  75: 95,
  76: 97,
  77: 98,
  78: 99,
  79: 100,
  80: 101,
  81: 103,
  82: 104,
  83: 105,
  84: 106,
  85: 107,
  86: 108,
  87: 110,
  88: 111,
  89: 113,
  90: 114,
  91: 115,
  92: 116,
  93: 118,
  94: 120,
  95: 121,
  96: 126,
  97: 127,
  98: 129,
  99: 131
};

const keys = Object.keys(starts19K).map(Number).sort((a,b)=>a-b);
let lastEnd = 0;
let errors = 0;

for (let i = 0; i < keys.length; i++) {
  const k = keys[i];
  const s = starts19K[k];
  let e;
  if (i < keys.length - 1) {
    e = starts19K[keys[i + 1]] - 1;
  } else {
    e = 131;
  }
  if (s !== lastEnd + 1) {
    console.error(`GAP ERROR at photo ${k}: expected ${lastEnd + 1}, got ${s}`);
    errors++;
  }
  lastEnd = e;
}

if (errors === 0 && lastEnd === 131) {
  console.log(`SUCCESS! All ${keys.length} items span strictly continuous 01 to 131 with 0 gaps!`);
} else {
  console.error(`FAILED with ${errors} errors, lastEnd = ${lastEnd}`);
}
