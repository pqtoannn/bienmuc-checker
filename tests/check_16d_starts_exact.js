import fs from 'fs';
import ExcelJS from 'exceljs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  console.log('--- Checking 16D rows ---');
  for (let r = 8; r <= 140; r++) {
    const row = ws.getRow(r);
    const toSo = row.getCell(6).text?.trim();
    const so = row.getCell(2).text?.trim();
    const trich = row.getCell(4).text?.trim();
    console.log(`[${r-7}] img ${(r-6).toString().padStart(3,'0')}.jpg -> rawTo: ${toSo} | so: ${so} | trich: ${trich.slice(0, 30)}`);
  }
}
main();
