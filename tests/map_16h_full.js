import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16H.xlsx');
  const ws = wb.worksheets[0];

  console.log('16H Rows (from 8 to 117):');
  for (let r = 8; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const so = row.getCell(2).text?.trim();
    const d = row.getCell(3).text?.trim();
    const ty = row.getCell(4).text?.trim();
    const tg = row.getCell(5).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const lb = row.getCell(7).text?.trim();
    console.log(`[${r-7}] img ${(r-6).toString().padStart(3,'0')}.jpg | ${so} | ${d} | ${toSo} | ${ty.slice(0, 35)}`);
  }
}
main();
