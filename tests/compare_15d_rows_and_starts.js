import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const active15D = [];
for (let r = 5; r <= 150; r++) {
  const row = rows[r];
  const stt = parseInt(row[0], 10);
  if (stt === 1) continue; // 001 cover
  if (stt === 92) continue; // duplicate of 91
  if (stt === 101) continue; // duplicate of 102
  if (stt === 146) continue; // photo
  active15D.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: row[1] || '',
    rawTo: (row[5] || '').toString().trim()
  });
}

console.log('Active count:', active15D.length);

const starts15D = [
  1, 2, 3, 4, 10, 11, 12, 14, 16, 17, 18, 19, 20, 30, 31, 32, 33, 34, 37, 39,
  40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 59, 65, 67, 68,
  72, 74, 75, 76, 85, 86, 87, 88, 90, 91, 92, 96, 100, 101, 102, 103, 104, 105, 112, 113,
  114, 115, 117, 121, 122, 123, 129, 132, 133, 134, 135, 136, 137, 138, 144, 145, 149, 152, 153, 155,
  156, 157, 158, 159, 160, 161, 163, 164, 165, 166, 167, 169, 170, 171, 172, 175, 177, 179, 181, 189,
  190, 200, 201, 211, 213, 215, 216, 223, 224, 225, 234, 235, 236, 237, 238, 239, 240, 241, 242, 248,
  258, 261, 262, 263, 264, 265, 272, 275, 278, 280, 284, 285, 286, 289, 290, 291, 292, 294, 296, 297
];

console.log('starts length:', starts15D.length);

// Compare rawTo with starts
for (let i = 0; i < Math.max(active15D.length, starts15D.length); i++) {
  const item = active15D[i];
  console.log(
    '#' + (i + 1).toString().padStart(3) + ' | ' +
    (item ? item.scan : '---') + ' | ' +
    (item ? item.so.padEnd(14) : '---'.padEnd(14)) + ' | raw: ' +
    (item ? item.rawTo.padEnd(10) : '---'.padEnd(10)) + ' | start: ' +
    (starts15D[i] !== undefined ? starts15D[i] : '---')
  );
}
