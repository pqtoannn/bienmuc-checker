import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16H.xlsx');
  const ws = wb.worksheets[0];
  const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2016_16H.job.json', 'utf8'));

  console.log('--- Checking 16H rows ---');
  for (let r = 8; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const so = row.getCell(2).text?.trim();
    const ngay = row.getCell(3).text?.trim();
    const trich = row.getCell(4).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const loai = row.getCell(7).text?.trim();
    const ghiChu = row.getCell(8).text?.trim();
    console.log(`img ${(r-6).toString().padStart(3,'0')}.jpg | rawTo: ${toSo} | so: ${so} | ngay: ${ngay} | trich: ${trich.slice(0, 30)}`);
  }
}
main();
