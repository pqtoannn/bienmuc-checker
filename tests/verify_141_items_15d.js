import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const activeItems = [];
for (let r = 5; r <= 150; r++) {
  const stt = parseInt(rows[r][0], 10);
  if (stt === 1 || stt === 52 || stt === 92 || stt === 101 || stt === 146) continue;
  activeItems.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: rows[r][1] || '',
    rawTo: (rows[r][5] || '').toString().trim()
  });
}

console.log('Active items count:', activeItems.length);

const starts15D = [
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
  // 046 to 051 (052 duplicate skipped)
  85, 86, 87, 88, 90, 91,
  // 053 to 065
  92, 96, 100, 101, 102, 103, 104, 105, 112, 113, 114, 115, 117,
  // 066 to 076
  121, 122, 123, 129, 132, 133, 134, 135, 136, 137, 138,
  // 077 to 090
  141, 144, 145, 148, 149, 152, 153, 155, 156, 157, 158, 159, 160, 161,
  // 091, 093 to 100 (092 skipped)
  163, 164, 165, 166, 167, 169, 170, 171, 172,
  // 102 to 109 (101 skipped)
  175, 177, 179, 181, 189, 190, 200, 201,
  // 110 to 126
  211, 213, 215, 216, 223, 224, 225, 234, 235, 236, 237, 238, 239, 240, 241, 242, 248,
  // 127 to 145
  258, 261, 262, 263, 264, 265, 272, 275, 278, 280, 284, 285, 286, 289, 290, 291, 292, 294, 296,
  // End bound
  297
];

console.log('starts length:', starts15D.length);
console.log('Intervals defined:', starts15D.length - 1);

let ok = true;
let lastEnd = 0;
activeItems.forEach((item, i) => {
  const s = starts15D[i];
  const e = starts15D[i + 1] - 1;
  if (s <= lastEnd) {
    console.error(`ERROR overlap at #${i+1}: ${s} <= ${lastEnd}`);
    ok = false;
  }
  if (i > 0 && s !== lastEnd + 1) {
    console.error(`ERROR gap at #${i+1}: ${s} !== ${lastEnd + 1}`);
    ok = false;
  }
  lastEnd = e;
});

console.log('Final sheet:', lastEnd);
if (ok && starts15D.length === activeItems.length + 1 && lastEnd === 296) {
  console.log('VICTORY! All 141 active items of PL_2015_15D are 100% strictly continuous from 01 to 296!');
} else {
  console.log('Mismatch detected.');
}
