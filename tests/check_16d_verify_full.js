import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  const startsD = [
    1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18, 25, 26, 27, 28, 33, 34, 37, 40, 41, 45, 50, 55, 56, 57, 58, 59, 
    60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 72, 73, 74, 75, 76, 80, 83, 84, 85, 86, 87, 89, 90, 91, 92, 96, 97, 98, 99, 101, 
    102, 103, 105, 106, 107, 108, 109, 110, 111, 114, 118, 121, 122, 123, 125, 126, 127, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 
    143, 144, 146, 147, 149, 151, 152, 154, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 169, 173, 175, 179, 181, 182, 186, 187, 188, 189, 
    190, 191, 192, 193, 194, 195, 197, 204, 207, 209, 213
  ];

  console.log(`startsD has ${startsD.length} items.`);
  const finalSheetD = 213;

  let lastEnd = 0;
  for (let i = 0; i < startsD.length; i++) {
    const s = startsD[i];
    const e = (i === startsD.length - 1) ? finalSheetD : startsD[i + 1] - 1;
    if (s !== lastEnd + 1) {
      console.error(`GAP or OVERLAP at index ${i}: prevEnd=${lastEnd}, start=${s}`);
    }
    lastEnd = e;
  }
  console.log(`Final sheet reached: ${lastEnd}. Expected: ${finalSheetD}`);
}
main();
