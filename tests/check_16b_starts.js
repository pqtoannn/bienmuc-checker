import fs from 'fs';
import ExcelJS from 'exceljs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16B.xlsx');
  const ws = wb.worksheets[0];
  const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2016_16B.job.json', 'utf8'));
  const rows = job.data?.rows || [];

  console.log('Comparing raw Excel and Job rows for 16B:');
  for (let i = 0; i < 81; i++) {
    const rawRow = ws.getRow(i + 7);
    const jRow = rows[i];
    console.log(`[${i+1}] img=${String(i+1).padStart(3, '0')}.jpg | rawSo=${rawRow.getCell(2).text?.trim()} | jobSo=${jRow?.soKyHieu} | rawTo=${rawRow.getCell(6).text?.trim()} | jobTo=${jRow?.toSoTrangSo} | rawTrich=${(rawRow.getCell(4).text?.trim()||'').slice(0, 30)}`);
  }
}
main();
