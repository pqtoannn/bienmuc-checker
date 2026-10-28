import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16B.xlsx');
  const ws = wb.worksheets[0];
  console.log('Total rows 16B:', ws.rowCount);
  for (let r = 7; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const so = row.getCell(2).text?.trim();
    const ngay = row.getCell(3).text?.trim();
    const trichYeu = row.getCell(4).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const ghiChu = row.getCell(8).text?.trim();
    if (stt || so || trichYeu) {
      console.log(`R${r}: [${stt}] [${so}] [${ngay}] [${toSo}] ${trichYeu.slice(0, 50)}`);
    }
  }
}
main();
