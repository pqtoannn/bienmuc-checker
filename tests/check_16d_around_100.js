import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  console.log('Comparing raw excel rows 80 to 110:');
  for (let r = 90; r <= 115; r++) {
    const row = ws.getRow(r);
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    console.log(`row ${r} | ${img} | toSo: ${row.getCell(6).text} | so: ${row.getCell(2).text} | d: ${row.getCell(3).text}`);
  }
}
main();
