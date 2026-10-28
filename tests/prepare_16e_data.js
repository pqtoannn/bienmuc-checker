import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16E.xlsx');
  const ws = wb.worksheets[0];
  const job = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2016_16E.job.json', 'utf8'));
  const jRows = job.data?.rows || [];

  const starts = [1, 13, 19, 20, 22, 26, 27, 28, 29, 31, 33, 40, 42, 44, 46, 49, 56, 58, 61, 62, 63, 64, 65, 69, 70, 71, 72, 73, 78, 81, 85, 86, 87, 88, 90, 95, 98, 99, 100, 101, 102, 105, 106, 107, 108, 109, 110, 114, 119, 122, 125, 127, 128, 131, 132, 137, 167, 168, 169, 170, 173, 174, 176, 180, 182, 187, 188, 189, 191, 192, 196, 198, 199];
  const finalSheet = 201;

  console.log('Starts count:', starts.length); // should be 73 items? Wait, starts has 73 items!
  // Let's count items in starts!
  console.log('Starts items:', starts.length);
}
main();
