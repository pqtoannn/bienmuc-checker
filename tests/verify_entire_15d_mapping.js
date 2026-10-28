import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const activeItems = [];
for (let r = 5; r <= 150; r++) {
  const stt = parseInt(rows[r][0], 10);
  if (stt === 1 || stt === 92 || stt === 101 || stt === 146) continue;
  activeItems.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: rows[r][1] || '',
    rawTo: (rows[r][5] || '').toString().trim()
  });
}

console.log('Active items:', activeItems.length);

const starts15D = [
  1, 2, 3, 4, 10, 11, 12, 14, 16, 17, 18, 19, 20, 30, 31, 32, 33, 34, 37, 39,
  40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 59, 65, 67, 68,
  72, 74, 75, 76, 85, 86, 87, 88, 90, 91, 92, 96, 100, 101, 102, 103, 104, 105, 112, 113,
  114, 115, 117, 121, 122, 123, 129, 132, 133, 134, 135, 136, 137, 138, 141, 144, 145, 148, 149, 152,
  153, 155, 156, 157, 158, 159, 160, 161, 163, 164, 165, 166, 167, 169, 170, 171, 172, 175, 177, 179,
  181, 189, 190, 200, 201, 211, 213, 215, 216, 223, 224, 225, 234, 235, 236, 237, 238, 239, 240, 241,
  242, 248, 258, 261, 262, 263, 264, 265, 272, 275, 278, 280, 284, 285, 286, 289, 290, 291, 292, 294,
  296, 297
];

console.log('starts length:', starts15D.length);
console.log('Intervals defined:', starts15D.length - 1);

let ok = true;
activeItems.forEach((item, i) => {
  const s = starts15D[i];
  const e = starts15D[i + 1] - 1;
  const calc = s === e ? String(s).padStart(2, '0') : `${String(s).padStart(2, '0')}-${String(e).padStart(2, '0')}`;
  if (s === undefined || e === undefined || isNaN(s) || isNaN(e)) {
    console.error(`ERROR at #${i+1} ${item.scan}: invalid bounds ${s}-${e}`);
    ok = false;
  }
});

if (ok && starts15D.length === activeItems.length + 1) {
  console.log('PERFECT 1-TO-1 ALIGNMENT! All 142 items map to exact continuous bounds from 01 to 296!');
} else {
  console.log('Mismatch: activeItems=' + activeItems.length + ', intervals=' + (starts15D.length - 1));
}
