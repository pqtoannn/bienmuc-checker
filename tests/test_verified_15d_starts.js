import fs from 'fs';

const starts15D = [
  1, 2, 3, 4, 10, 11, 12, 14, 16, 17, 18, 19, 20, 30, 31, 32, 33, 34, 37, 39,
  40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 59, 65, 67, 68,
  72, 74, 75, 76, 85, 86, 87, 88, 90, 91, 92, 96, 100, 101, 102, 103, 104, 105, 112, 113,
  114, 115, 117, 121, 122, 123, 129, 132, 133, 134, 135, 136, 137, 138, 144, 145, 149, 152, 153, 155,
  156, 157, 158, 159, 160, 161, 163, 164, 165, 166, 167, 169, 170, 171, 172, 175, 177, 179, 181, 189,
  190, 200, 201, 211, 213, 215, 216, 223, 224, 225, 234, 235, 236, 237, 238, 239, 240, 241, 242, 248,
  258, 261, 262, 263, 264, 265, 272, 275, 278, 280, 284, 285, 286, 289, 290, 291, 292, 294, 296, 297
];

console.log('starts15D length:', starts15D.length);
console.log('Intervals defined:', starts15D.length - 1);

let lastEnd = 0;
for (let i = 0; i < starts15D.length - 1; i++) {
  const s = starts15D[i];
  const e = starts15D[i + 1] - 1;
  if (s <= lastEnd) {
    console.error(`ERROR overlap at #${i + 1}: ${s} <= ${lastEnd}`);
  }
  if (i > 0 && s !== lastEnd + 1) {
    console.error(`ERROR gap at #${i + 1}: ${s} !== ${lastEnd + 1}`);
  }
  lastEnd = e;
}
console.log('Final sheet:', lastEnd);
if (lastEnd === 296) {
  console.log('PERFECT! Sequence 01 to 296 is completely continuous and gapless!');
}
