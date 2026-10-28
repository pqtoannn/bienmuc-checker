import fs from 'fs';

const starts21p = [];
// 196 active docs: 002.jpg (idx 1) to 197.jpg (idx 196)

const multiPages = {
  30: 2,   // 030.jpg: 30-31
  33: 2,   // 033.jpg: 34-35
  53: 2,   // 053.jpg: 55-56
  56: 2,   // 056.jpg: 59-60
  59: 3,   // 059.jpg: 63-65
  60: 2,   // 060.jpg: 66-67
  87: 6,   // 087.jpg: 94-99
  110: 7,  // 110.jpg: 122-128
  112: 2,  // 112.jpg: 130-131
  113: 2,  // 113.jpg: 132-133
  114: 2,  // 114.jpg: 134-135
  115: 2,  // 115.jpg: 136-137
  116: 2,  // 116.jpg: 138-139
  118: 2,  // 118.jpg: 141-142
  126: 3,  // 126.jpg: 150-152
  127: 2   // 127.jpg: 153-154
};

let curSheet = 1;
const docRanges = [];
for (let photoNum = 2; photoNum <= 197; photoNum++) {
  const pages = multiPages[photoNum] || 1;
  const start = curSheet;
  const end = curSheet + pages - 1;
  const rangeStr = (start === end) ? String(start).padStart(2, '0') : `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;
  docRanges.push({ photoNum, start, end, pages, rangeStr });
  curSheet += pages;
}

console.log('Total active docs:', docRanges.length);
console.log('Final sheet:', curSheet - 1);
console.log('First doc:', docRanges[0]);
console.log('Last doc:', docRanges[docRanges.length - 1]);

let gap = false;
for (let i = 0; i < docRanges.length - 1; i++) {
  if (docRanges[i].end + 1 !== docRanges[i + 1].start) {
    console.log(`Gap at doc ${i} (${docRanges[i].photoNum})`);
    gap = true;
  }
}
if (!gap) console.log('100% GAPLESS AND CONTINUOUS FROM 01 TO 224!');
