import fs from 'fs';

const verifiedStarts15D = [
  // 002 to 005
  1, 2, 3, 4,
  // 006 to 014
  10, 11, 12, 14, 16, 17, 18, 19, 20,
  // 015 to 026
  30, 31, 32, 33, 34, 37, 39, 40, 41, 42, 43, 44,
  // 027 to 037
  46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57,
  // 038 to 045
  59, 65, 67, 68, 72, 74, 75, 76,
  // 046 to 052
  85, 86, 87, 88, 90, 91, 92,
  // 053 to 065
  96, 100, 101, 102, 103, 104, 105, 112, 113, 114, 115, 117, 121,
  // 066 to 076
  122, 123, 129, 132, 133, 134, 135, 136, 137, 138, 141,
  // 077 to 090
  144, 145, 148, 149, 152, 153, 155, 156, 157, 158, 159, 160, 161, 163,
  // 091, 093 to 100 (092 skipped)
  164, 165, 166, 167, 169, 170, 171, 172,
  // 102 to 109 (101 skipped)
  175, 177, 179, 181, 189, 190, 200, 201,
  // 110 to 126
  211, 213, 215, 216, 223, 224, 225, 234, 235, 236, 237, 238, 239, 240, 241, 242, 248,
  // 127 to 145
  258, 261, 262, 263, 264, 265, 272, 275, 278, 280, 284, 285, 286, 289, 290, 291, 292, 294, 296,
  // End bound
  297
];

console.log('verifiedStarts15D length:', verifiedStarts15D.length);
console.log('Intervals defined:', verifiedStarts15D.length - 1);

let lastEnd = 0;
for (let i = 0; i < verifiedStarts15D.length - 1; i++) {
  const s = verifiedStarts15D[i];
  const e = verifiedStarts15D[i + 1] - 1;
  if (s <= lastEnd) {
    console.error(`ERROR overlap at #${i + 1}: ${s} <= ${lastEnd}`);
  }
  if (i > 0 && s !== lastEnd + 1) {
    console.error(`ERROR gap at #${i + 1}: ${s} !== ${lastEnd + 1}`);
  }
  lastEnd = e;
}
console.log('Final sheet:', lastEnd);
if (lastEnd === 296 && verifiedStarts15D.length === 143) {
  console.log('BINGO! Exact 142 active intervals from 01 to 296!');
} else {
  console.log('Mismatch: length=' + verifiedStarts15D.length + ', final=' + lastEnd);
}
