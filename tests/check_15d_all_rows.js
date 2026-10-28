import xlsx from 'xlsx';
import path from 'path';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const data = rows.slice(6, 150);
console.log('Total data:', data.length);
data.forEach((r, i) => {
  const p = String(i + 2).padStart(3, '0') + '.jpg';
  console.log(`${p} | #${i+1} | ${r[1] || ''} | ${r[2] || ''} | to: ${r[5] || ''}`);
});
