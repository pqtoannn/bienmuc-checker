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

// Let's inspect rawTo vs pencil numbers of 15D
// We have corners of 15D:
// Let's see: earlier we had crop_15d_corners.js
console.log('Active items length:', activeItems.length);
