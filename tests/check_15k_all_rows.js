import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Check rows from index 6 (STT 1) to end
console.log('Total rows:', rows.length);
for (let i = 6; i < rows.length; i++) {
  const r = rows[i];
  const stt = parseInt(r[0], 10);
  const scanFile = String(stt).padStart(3, '0') + '.jpg';
  // Let's see: stt 1 is 001.jpg, stt 2 is 002.jpg, ..., stt 191 is 191.jpg
}
