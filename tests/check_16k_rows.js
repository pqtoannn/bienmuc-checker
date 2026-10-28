import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16K.xlsx');
  const ws = wb.worksheets[0];
  const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2016_16K.job.json', 'utf8'));
  const rows = job.data?.rows || [];

  console.log('Total rows 16K: ws.rowCount =', ws.rowCount, 'job.rows =', rows.length);
  for (let r = 7; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const so = row.getCell(2).text?.trim();
    const ngay = row.getCell(3).text?.trim();
    const trichYeu = row.getCell(4).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const ghiChu = row.getCell(8).text?.trim();
    const jRow = rows[r - 7];
    if (stt || so || trichYeu) {
      console.log(`R${r}: [${stt}] [${so}] [${ngay}] [${toSo}] | jobTo: ${jRow?.toSoTrangSo} | ${trichYeu.slice(0, 45)}`);
    }
  }
}
main();
