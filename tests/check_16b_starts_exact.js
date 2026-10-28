import fs from 'fs';
import ExcelJS from 'exceljs';

// Let's list the 80 scans of 16B (002 to 081)
// We know:
// 002: 1
// 003: 4
// 004: 6
// 005: 8
// 006: 10
// 007: 11 (Wait, is 007 11 or 13?)
// Let's inspect the numbers written in pencil by inspecting each header crop or using raw Excel clues.

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16B.xlsx');
  const ws = wb.worksheets[0];
  
  for (let r = 8; r <= 87; r++) {
    const row = ws.getRow(r);
    const toSo = row.getCell(6).text?.trim();
    const so = row.getCell(2).text?.trim();
    console.log(`img ${(r-6).toString().padStart(3,'0')}.jpg -> rawTo: ${toSo} | so: ${so}`);
  }
}
main();
