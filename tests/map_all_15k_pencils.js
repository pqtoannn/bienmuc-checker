import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(6);

const activeRows = [];
rawData.forEach((r, idx) => {
  const scanNum = idx + 1;
  const scanFile = String(scanNum).padStart(3, '0') + '.jpg';
  if (scanNum === 1 || scanNum === 67 || scanNum === 72 || scanNum === 181) return;
  activeRows.push({ scanNum, scanFile, stt: r[0], so: r[1]||'', rawToSo: (r[5]||'').toString().trim() });
});

console.log('Active count:', activeRows.length);
activeRows.forEach((a, i) => {
  console.log('[' + (i+1) + '] ' + a.scanFile + ' | raw: ' + a.rawToSo + ' | so: ' + a.so);
});
