import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  // Let's inspect raw Excel row by row from row 8 to 140
  console.log('--- ALL RAW ROWS IN 16D ---');
  for (let r = 8; r <= 140; r++) {
    const row = ws.getRow(r);
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    const so = row.getCell(2).text?.trim() || '';
    const d = row.getCell(3).text?.trim() || '';
    const trich = row.getCell(4).text?.trim() || '';
    const tg = row.getCell(5).text?.trim() || '';
    const toSo = row.getCell(6).text?.trim() || '';
    console.log(`[r=${r}] ${img} | so: ${so.padEnd(16)} | d: ${d.padEnd(12)} | toSo: ${toSo.padEnd(10)} | trich: ${trich.slice(0, 35)}`);
  }
}
main();
