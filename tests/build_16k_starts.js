import fs from 'fs';
import ExcelJS from 'exceljs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16K.xlsx');
  const ws = wb.worksheets[0];
  const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2016_16K.job.json', 'utf8'));

  // Rows 7 to 98
  // Notice row 7 is 001.jpg (scrap note on 002), so row 7 is omitted or merged into row 8!
  // Document 1 starts at 002.jpg (row 8).
  console.log('--- Checking 16K rows ---');
  for (let r = 7; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const so = row.getCell(2).text?.trim();
    const ngay = row.getCell(3).text?.trim();
    const trich = row.getCell(4).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const loai = row.getCell(7).text?.trim();
    const ghiChu = row.getCell(8).text?.trim();
    console.log(`R${r} (img ${r-6}): stt=${stt} | so=${so} | ngay=${ngay} | toSo=${toSo} | trich=${trich.slice(0, 35)}`);
  }
}
main();
