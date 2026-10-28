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

  let rawRowIdx = 8;
  for (let i = 0; i < startsD.length; i++) {
    let imgName;
    let files;
    if (i < 98) {
      imgName = String(i + 2).padStart(3, '0') + '.jpg';
      files = [imgName];
    } else if (i === 98) {
      imgName = '100.jpg';
      files = ['100.jpg', '101.jpg'];
    } else {
      imgName = String(i + 3).padStart(3, '0') + '.jpg';
      files = [imgName];
    }

    const rawRow = ws.getRow(rawRowIdx);
    const so = rawRow.getCell(2).text?.trim();
    const d = rawRow.getCell(3).text?.trim();
    const trich = rawRow.getCell(4).text?.trim();
    
    if (i === 98) {
      rawRowIdx += 2; // skip both rawRow 106 (100.jpg) and 107 (101.jpg)
    } else {
      rawRowIdx += 1;
    }

    if (i < 5 || i > 125 || i === 97 || i === 98 || i === 99) {
      console.log(`[${i+1}] img: ${imgName} | files: ${JSON.stringify(files)} | s=${startsD[i]} | so: ${so} | d: ${d} | trich: ${trich.slice(0, 25)}`);
    }
  }
  console.log('Final rawRowIdx:', rawRowIdx);
}
main();
